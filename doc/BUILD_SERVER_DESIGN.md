# Build Server Design

## Overview

The FlowForge Build Server converts visual flow programs into TwinCAT PLC projects using the Beckhoff Automation Interface. It runs on dedicated Windows Server instances (one per TwinCAT version) and connects to the main stack via REST + MQTT.

This document captures the architectural decisions, constraints, and patterns derived from Beckhoff documentation, community projects, and production experience.

## Critical Constraints

| Constraint | Reason | Impact |
|-----------|--------|--------|
| **32-bit (x86) execution** | Automation Interface COM is 32-bit only | `<PlatformTarget>x86</PlatformTarget>` in .csproj |
| **STA threading** | COM interop requires Single-Threaded Apartment | `[STAThread]` on entry + dedicated STA thread for pipeline |
| **IOleMessageFilter** | VS DTE rejects COM calls while busy — crashes without it | Mandatory MessageFilter wrapper |
| **One VS instance per build** | No concurrent DTE usage per process | Queue-based sequential processing |
| **TwinCAT Engineering license** | Required for project creation, compilation, activation | Build server = dedicated Windows Server |
| **Visual Studio DTE dependency** | Automation Interface accessed via `TcXaeShell.DTE.15.0` ProgID | VS or TcXaeShell must be installed |

## Beckhoff Automation Interface

The Automation Interface is a COM-based API provided by Beckhoff for programmatic control of TwinCAT Engineering (XAE). Key interfaces:

### Core COM Interfaces

- **`EnvDTE.DTE`** — Visual Studio Development Tools Environment. Entry point for solution management (open, build, close).
- **`ITcSysManager`** — TwinCAT System Manager. Root interface for navigating and manipulating the TwinCAT project tree.
- **`ITcSmTreeItem`** — Tree item in the TwinCAT project hierarchy. Provides `CreateChild()`, `LookupChild()`, property access.
- **`ITcPlcIECProject`** — PLC IEC project interface. Provides `GenerateBootProject()`, `CheckAllObjects()`, `PlcLogin()`, `PlcStart()`.

### Key Methods

| Interface | Method | Purpose |
|-----------|--------|---------|
| `DTE` | `Solution.Open(path)` | Open TwinCAT solution |
| `DTE` | `Solution.SolutionBuild.Build(true)` | Compile the solution |
| `ITcSysManager` | `LookupTreeItem(path)` | Navigate project tree by path |
| `ITcSmTreeItem` | `CreateChild(name, subType, vInfo, templatePath)` | Add POU, GVL, DUT, task |
| `ITcSmTreeItem` | `ImportChild(path, ...)` | Import from PLCopen XML |
| `ITcSysManager` | `ActivateConfiguration()` | Download config to PLC runtime |
| `ITcSysManager` | `StartRestartTwinCAT()` | Start/restart TwinCAT runtime |
| `ITcPlcIECProject` | `GenerateBootProject(true)` | Generate boot project for autostart |

### TwinCAT Project Tree Structure

The TwinCAT system manager organizes projects as a tree:

```
TIRC (Root)
├── TIPC (PLC)
│   └── PLC Project
│       ├── POUs/
│       │   ├── MAIN (PRG)
│       │   ├── FB_Timer (FB)
│       │   └── FC_Calculate (FUN)
│       ├── DUTs/
│       │   └── ST_MachineState (STRUCT)
│       ├── GVLs/
│       │   └── GVL_Main
│       └── Libraries/
├── TINC (NC)
├── TIID (I/O)
│   └── Device 1 (EtherCAT Master)
└── TIRT (Realtime)
    └── Task 1
        └── Linked PLC Program
```

### Tree Item SubTypes

| Type | SubType Value | Description |
|------|--------------|-------------|
| POU (Program) | 604 | PROGRAM POU |
| POU (Function Block) | 604 | FUNCTION_BLOCK POU |
| POU (Function) | 604 | FUNCTION POU |
| GVL | 615 | Global Variable List |
| DUT (Struct) | 606 | Data Unit Type (Structure) |
| DUT (Enum) | 606 | Data Unit Type (Enumeration) |
| Task | — | Realtime task |

## Pipeline Architecture

The build server processes jobs through a sequential pipeline of discrete steps. Each step has a single responsibility and operates on a shared `BuildContext`.

### Pipeline Flow

```
CloneRepo → ParseFlow → ValidateFlow → CreateProject → GenerateCode
    → ConfigureTasks → Compile → GenerateBootProject → CommitResult
    → [DeployStep] (conditional, only for Deploy jobs)
```

### BuildContext

Mutable context object passed through all pipeline steps:

```
BuildContext
├── Job              — BuildJobDto (from backend)
├── WorkspacePath    — temp directory for this build
├── FlowDocument     — parsed flow JSON
├── Solution         — DTE Solution reference
├── SysManager       — ITcSysManager reference
├── PlcProject       — ITcSmTreeItem for PLC project node
├── GeneratedFiles   — list of generated file paths
├── Errors           — accumulated error messages
├── Timings          — per-step execution times
└── CancellationToken
```

### Step Descriptions

1. **CloneRepoStep** — Git clone or fetch the project repository using LibGit2Sharp with user credentials from the job.
2. **ParseFlowStep** — Deserialize `flow/program.json` from the cloned repo into a `FlowDocument` object.
3. **ValidateFlowStep** — Structural validation: check all connections reference valid ports, detect cycles, verify required parameters.
4. **CreateProjectStep** — Create a new TwinCAT solution using `DTE`, add PLC project from machine type template via `ITcSmTreeItem.CreateChild()`.
5. **GenerateCodeStep** — Translate flow nodes to IEC 61131-3 Structured Text using node translators. Populate POUs, GVLs, DUTs via `ITcSmTreeItem.CreateChild()`.
6. **ConfigureTasksStep** — Create realtime tasks under TIRT, link PLC programs to tasks.
7. **CompileStep** — Call `DTE.Solution.SolutionBuild.Build(true)`, collect errors from ErrorList.
8. **GenerateBootProjectStep** — Call `ITcPlcIECProject.GenerateBootProject(true)` + `CheckAllObjects()` for autostart capability.
9. **CommitResultStep** — Git commit the generated `.tsproj` and ST files, push to the project repo.
10. **DeployStep** (conditional) — Only for Deploy jobs. Call `ActivateConfiguration()` + `StartRestartTwinCAT()` via `ITcSysManager`. Deploy lock and 4-eyes validation happen in the backend before the job reaches the build server.

## Code Generation Strategy

### FlowDocument JSON to IEC 61131-3 ST

The code generator translates the visual flow (nodes + connections) into Structured Text:

1. **Topological sort** — Order nodes by data dependencies (connections define edges).
2. **Node translation** — Each node type has a dedicated `INodeTranslator` that emits ST code.
3. **Variable declarations** — Collect all node inputs/outputs, generate `VAR`/`VAR_INPUT`/`VAR_OUTPUT` blocks.
4. **Connection wiring** — Generate assignment statements for connections between nodes.
5. **POU generation** — Wrap translated code in `PROGRAM`/`FUNCTION_BLOCK` declarations.

### Node Translator Pattern

Each visual node type maps to an `INodeTranslator` implementation:

```
INodeTranslator
├── TimerTranslator      — TON/TOF/TP timer blocks
├── CounterTranslator    — CTU/CTD/CTUD counter blocks
├── ComparisonTranslator — GT/LT/EQ/GE/LE comparisons
├── MathTranslator       — ADD/SUB/MUL/DIV operations
├── LogicTranslator      — AND/OR/NOT/XOR gates
├── MoveTranslator       — MOVE/assignment operations
└── (extensible per node type)
```

Each translator receives the node definition and its resolved input connections, and returns:
- Variable declarations (type, initial value)
- Body statements (ST code)
- Any required library references

## COM Interop Patterns

### MessageFilter (Mandatory)

The `IOleMessageFilter` implementation handles COM call rejection by the DTE when it's busy processing. Without this, random `RPC_E_CALL_REJECTED` exceptions crash the build process.

Key behavior:
- `HandleInComingCall` — Always returns `SERVERCALL_ISHANDLED` (accept all incoming calls).
- `RetryRejectedCall` — Returns 99ms retry delay when the DTE is busy (`SERVERCALL_RETRYLATER`). This causes the COM runtime to automatically retry the call after a short delay.
- `MessagePending` — Returns `PENDINGMSG_WAITDEFPROCESS` (default processing).

This pattern is proven in both TcUnit-Verifier and the Beckhoff CodeGenerationDemo samples.

### VisualStudioInstance Facade

Wraps `EnvDTE.DTE` lifecycle management behind `IVisualStudioInstance`:

- **Creation** — `Activator.CreateInstance(Type.GetTypeFromProgID("TcXaeShell.DTE.15.0"))` or version-specific ProgID.
- **Version detection** — Parse .sln file to determine required VS/XAE version, select matching ProgID.
- **UI suppression** — `DTE.SuppressUI = true`, `DTE.MainWindow.Visible = false` for headless operation.
- **Build** — `DTE.Solution.SolutionBuild.Build(true)` with error collection from `DTE.ToolWindows.ErrorList`.
- **Cleanup** — `DTE.Quit()` in `finally` block to prevent orphaned devenv.exe processes.

### AutomationInterface Facade

Wraps `ITcSysManager` operations behind `IAutomationInterface`:

- **Tree navigation** — `LookupTreeItem("TIPC^PLC Project^POUs")` with typed path helpers.
- **Child creation** — `CreateChild(name, subType, vInfo, templatePath)` with subtype constants.
- **Configuration activation** — `ActivateConfiguration()` → downloads to target PLC.
- **Runtime control** — `StartRestartTwinCAT()` → starts/restarts the TwinCAT runtime.

## Template Management

Machine type templates accelerate project creation by providing pre-configured PLC project structures:

- **Template format** — `.tpzip` files (TwinCAT Project ZIP archives).
- **Template types** — 3-axis standalone, 3+1 axis standalone, x-division rotary table, etc.
- **Usage** — `ITcSmTreeItem.CreateChild(name, 0, null, templatePath)` to create PLC project from template.
- **Storage** — Templates stored on the build server file system, path resolved by `TemplateManager` from machine type enum.

## Build vs Deploy Workflow

### Build (Build-only)

1. Backend inserts build job into PostgreSQL queue.
2. Build server claims job via REST (`FOR UPDATE SKIP LOCKED`).
3. Pipeline executes steps 1-9 (CloneRepo through CommitResult).
4. Generated PLC solution is committed and pushed to the project repo.
5. Build result reported to backend via REST.

### Deploy (Build + Deploy)

1. Backend validates deploy permissions (4-eyes for production, deploy lock check).
2. Backend inserts deploy job into PostgreSQL queue.
3. Build server claims job, executes steps 1-9 (same as build).
4. **DeployStep** (step 10) activates configuration on target PLC:
   - `ITcSysManager.ActivateConfiguration()` — downloads project to PLC.
   - `ITcSysManager.StartRestartTwinCAT()` — starts/restarts the runtime.
   - Both operations go through ADS over MQTT to the target PLC.
5. Deploy result reported to backend via REST.

## ADS over MQTT Deployment

PLC activation uses ADS (Automation Device Specification) protocol tunneled over MQTT:

- **Central MQTT broker** — All PLCs and build servers connect to a single broker.
- **No per-server ADS routes** — Eliminates manual route configuration on each PLC.
- **Topic structure** — `flowforge/deploy/request/{target-id}` for deploy commands.
- **Build server as gateway** — The build server has TwinCAT Engineering, which provides the ADS client. It publishes ADS commands to the MQTT broker, which routes them to the target PLC.

## References

- [Beckhoff InfoSys — Automation Interface](https://infosys.beckhoff.com/content/1033/tc3_automationinterface/index.html)
- [TcUnit — TwinCAT Unit Testing Framework](https://github.com/tcunit/TcUnit) (VisualStudioInstance pattern, MessageFilter implementation)
- [CodeGenerationDemo](src/build-server/samples/) — Beckhoff sample for Automation Interface scripting
- [AllTwinCAT — CI/CD for TwinCAT](https://alltwincat.com/) — Blog series on Jenkins integration and automated builds
