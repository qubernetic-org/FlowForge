# PLC Build Server

Converts visual programs to Beckhoff TwinCAT PLC projects.

**Location**: `src/build-server/`

## Purpose

This module is responsible for:
- Cloning/fetching the project repo from GitHub
- Parsing flow JSON from the repo
- Generating Structured Text (ST) or other IEC 61131-3 code
- Creating TwinCAT project structure
- Committing/pushing the generated PLC solution back to the repo
- Interfacing with Beckhoff Automation Interface for compilation
- Deploying (activating) TwinCAT solution on target PLC via ADS over MQTT

**Note**: Build (generation + commit) and Deploy (PLC activation) are separate operations with a shared permission hierarchy. The build server handles both: it generates and compiles the PLC solution (build), and activates it on the target PLC via ADS over MQTT (deploy). Deploy requires TwinCAT Engineering, which is only available on the build server. The backend orchestrates requests; the build server executes them.

## Architecture

Build servers are version-specific — each TwinCAT version runs on a dedicated Windows Server instance. The backend API manages and routes build requests to the appropriate server based on the target runtime version (readable via ADS).

## Planned Features

- Git repo clone/fetch from GitHub
- JSON parser for flow definitions
- Code generation for IEC 61131-3 languages (primarily ST)
- TwinCAT project template system
- Beckhoff Automation Interface integration for compilation
- Generated PLC solution commit/push back to repo
- Build verification and error reporting
- PLC activation (deploy) via ADS over MQTT through central broker

## Technology

- **Language**: C# (.NET) — required for Automation Interface compatibility
- **Code Generation**: Template engine (Scriban, T4)
- **Automation Interface**: Beckhoff TcXaeShell API
- **Deployment**: ADS over MQTT via central MQTT broker

## Beckhoff Integration

Integration with [Beckhoff Automation Interface](https://infosys.beckhoff.com/english.php?content=../content/1033/tc3_automationinterface/index.html) requires:
- TwinCAT 3 XAE (Engineering) installed
- Visual Studio Shell or Visual Studio
- Appropriate COM/API access permissions

## Getting Started

*Setup instructions coming soon*
