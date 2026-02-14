# Build Server Design

## Overview

The build server converts visual flow programs into deployable TwinCAT PLC projects. It runs on dedicated Windows Server instances (one per TwinCAT version) and connects to the FlowForge stack via REST + MQTT.

## Pipeline Architecture

Build jobs are processed through a sequential pipeline of `IBuildStep` implementations:

1. **CloneRepoStep** — Clone/fetch the project repo from GitHub
2. **ParseFlowStep** — Deserialize flow JSON from the repo
3. **ValidateFlowStep** — Validate node graph structure and connections
4. **GenerateCodeStep** — Generate IEC 61131-3 Structured Text from flow nodes
5. **CreateProjectStep** — Create TwinCAT project structure via Automation Interface
6. **ConfigureTasksStep** — Configure PLC tasks and I/O mappings
7. **CompileStep** — Compile the TwinCAT project
8. **GenerateBootProjectStep** — Generate boot project for target deployment
9. **CommitResultStep** — Commit/push generated PLC solution to the repo
10. **DeployStep** — (Deploy jobs only) Activate on target PLC via ADS

## Code Generation

The `INodeTranslator` strategy pattern maps flow node types to Structured Text:
- Each node type has a dedicated translator (e.g., `TimerTranslator`, `CounterTranslator`, `ComparisonTranslator`)
- `StructuredTextGenerator` orchestrates translation using registered translators
- `PlcProjectBuilder` assembles POUs, GVLs, and DUTs into the TwinCAT project structure

## TwinCAT Integration

- **IVisualStudioInstance** — Manages the TwinCAT XAE Shell (Visual Studio) COM automation
- **IAutomationInterface** — Facade over `ITcSysManager` for project creation, POU management, compilation, and activation
- **MessageFilter** — COM message filter for handling OLE callbacks during automation

## ADS Integration

Deploy operations use `Beckhoff.TwinCAT.Ads` for direct ADS communication with target PLCs:

- **IAdsDeployClient** — Connect, read state, switch to config mode, restart TwinCAT
- Uses the native TwinCAT router on Windows (no TcpRouter needed)
- Deploy sequence documented in [ADS_INTEGRATION.md](ADS_INTEGRATION.md)

## Build Queue Integration

- Build servers poll the backend REST API for jobs (`FOR UPDATE SKIP LOCKED`)
- MQTT `flowforge/build/notify/{twincat-version}` provides lightweight wake-up signals
- Progress reported via MQTT `flowforge/build/progress/{build-id}`
- Deploy status reported via MQTT `flowforge/deploy/status/{deploy-id}`
- Final results reported via backend REST API
