# Visual Programming Language Specification

## Overview

This document defines the visual programming language for FlowForge, including node types, connection rules, and how visual elements map to PLC code.

## Design Philosophy

The visual language is inspired by:
- **Unreal Engine Blueprints**: Node-based visual scripting
- **IEC 61131-3**: Standard PLC programming concepts
- **Functional Flow Block Diagram (FFBD)**: Sequential logic flow

## Core Concepts

### Nodes

Nodes are the fundamental building blocks. Each node represents:
- A PLC operation (timer, counter, logic)
- A hardware interface (input, output)
- A data operation (math, comparison)
- Control flow (if/else, loop, state machine)

### Ports

Nodes have input and output ports:
- **Execution Ports** (white): Control flow (when to execute)
- **Data Ports** (colored by type): Data flow (values between nodes)
  - Blue: BOOL
  - Green: INT / DINT
  - Yellow: REAL / LREAL
  - Red: TIME
  - Purple: STRING

### Connections

Connections (wires) link ports together:
- Execution flow: Defines order of operations
- Data flow: Passes values between nodes

## Node Categories

### 1. Input/Output Nodes

#### Digital Input
```
┌─────────────────┐
│  Digital Input  │
│                 │
│  Address: %IX0.0│──→ Output (BOOL)
└─────────────────┘
```

#### Digital Output
```
┌─────────────────┐
│ Digital Output  │
│                 │
│  Address: %QX0.0│←── Input (BOOL)
└─────────────────┘
```

### 2. Logic Nodes

#### AND Gate
```
┌─────────────────┐
│      AND        │
│                 │
│  A ─────┐       │
│         ├──→ Q  │──→ Result (BOOL)
│  B ─────┘       │
└─────────────────┘
```

#### OR Gate, NOT, XOR (similar structure)

### 3. Timer Nodes

#### TON (On-Delay Timer)
```
┌─────────────────┐
│      TON        │
│                 │
│  IN ────────→   │──→ Q (BOOL)
│  PT ────────→   │──→ ET (TIME)
│                 │
│  Preset: 5000ms │
└─────────────────┘
```

### 4. Counter Nodes

#### CTU (Up Counter)
```
┌─────────────────┐
│      CTU        │
│                 │
│  CU ────────→   │──→ Q (BOOL)
│  R  ────────→   │──→ CV (INT)
│  PV ────────→   │
│                 │
└─────────────────┘
```

### 5. Math Nodes

#### ADD, SUB, MUL, DIV
```
┌─────────────────┐
│      ADD        │
│                 │
│  A ─────┐       │
│         ├──→ R  │──→ Result (INT/REAL)
│  B ─────┘       │
└─────────────────┘
```

### 6. Comparison Nodes

#### GT, LT, EQ, NE, GE, LE
```
┌─────────────────┐
│       GT        │
│  (Greater Than) │
│                 │
│  A ─────┐       │
│         ├──→ Q  │──→ Result (BOOL)
│  B ─────┘       │
└─────────────────┘
```

### 7. Control Flow Nodes

#### Branch (If/Else)
```
┌─────────────────┐
│     Branch      │
│                 │
│  Exec ──→       │──→ True
│  Condition ──→  │──→ False
│                 │
└─────────────────┘
```

#### Sequence
```
┌─────────────────┐
│    Sequence     │
│                 │
│  Exec ──→       │──→ Then 1
│                 │──→ Then 2
│                 │──→ Then 3
└─────────────────┘
```

### 8. State Machine

#### State Node
```
┌─────────────────┐
│  State: IDLE    │
│                 │
│  Entry ──→      │──→ Transition 1
│  Exit ──→       │──→ Transition 2
│                 │
│  [Actions]      │
└─────────────────┘
```

### 9. Function Blocks

#### Custom Function Block
```
┌─────────────────┐
│   MyFunction    │
│                 │
│  Input1 ──→     │──→ Output1
│  Input2 ──→     │──→ Output2
│                 │
└─────────────────┘
```

## Connection Rules

### Valid Connections
- ✅ Execution → Execution
- ✅ Data output → Data input (same type)
- ✅ Data output → Data input (compatible types, with implicit conversion)

### Invalid Connections
- ❌ Execution → Data
- ❌ Data → Execution
- ❌ Incompatible data types (e.g., BOOL → TIME)
- ❌ Multiple outputs to single execution input

### Type Compatibility

Implicit conversions allowed:
- INT → DINT → LINT
- REAL → LREAL
- BYTE → WORD → DWORD

Explicit conversion required:
- INT ↔ REAL (requires CAST node)
- BOOL ↔ INT (requires conversion node)

## Example Visual Programs

### Example 1: Simple Timer

```
[Start Button] ──→ [TON Timer] ──Q──→ [Output Light]
                   PT: 5000ms
```

### Example 2: Start/Stop with Memory

```
[Start] ──→ [SR Latch] ──Q──→ [Motor Output]
[Stop] ───→ [   ] ───Q
```

### Example 3: Traffic Light State Machine

```
State: GREEN
  Timer 30s → Yellow

State: YELLOW
  Timer 3s → Red

State: RED
  Timer 30s → Green
```

## Best Practices

1. **Left to Right Flow**: Execution should generally flow left to right
2. **Data Clarity**: Label connections with meaningful names
3. **Modularity**: Group related nodes into function blocks
4. **Error Handling**: Include exception/error branches
5. **Comments**: Add comment nodes to explain complex logic

## Future Enhancements

- **Custom Node Library**: User-defined reusable nodes
- **Hierarchical Nodes**: Collapse complex logic into single node
- **Debugging**: Breakpoints and step-through execution
- **Simulation**: Test without hardware

---

*This specification will evolve as the visual editor is developed and user feedback is incorporated.*
