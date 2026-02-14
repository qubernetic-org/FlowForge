# Frontend - Visual Editor

Web-based visual programming interface for PLC development.

**Location**: `src/frontend/`

## Purpose

This module contains the frontend application that provides the node-based visual programming interface. Users will drag and drop nodes, connect them, and create logic flows similar to Unreal Engine Blueprints.

## Technology Stack

- **Framework**: React (TypeScript)
- **Node Editor**: React Flow (MIT licensed core)
- **Build Tool**: TBD (Vite recommended)
- **State Management**: TBD (Zustand or React Context)
- **UI Components**: TBD

## Planned Features

- Node-based visual programming canvas (React Flow)
- Drag-and-drop component library
- Real-time validation and error checking
- Project save/load functionality
- Export to intermediate format (JSON)
- Connection to backend API
- TwinCAT version selection for build target
- PLC target selection (auto-discovered via ADS over MQTT) and activation from the web interface
- Machine type template selection for new projects
- Direct SignalR connection to on-demand monitor containers for live PLC data streaming

## Authentication

- OIDC login via Keycloak (redirect-based flow)
- Admin UI for user management (calls backend admin API → Keycloak Admin REST API)

## Getting Started

*Setup instructions coming soon*
