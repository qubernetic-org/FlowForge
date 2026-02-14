# Backend - .NET API Server

API server for managing visual programming projects and coordinating with version-specific PLC build servers.

**Location**: `src/backend/`

## Technology Stack

- **Framework**: ASP.NET Core (Controllers)
- **Database**: PostgreSQL with Entity Framework Core + Npgsql
- **Authentication**: Keycloak (OIDC) — backend validates JWT only
- **Real-time**: SignalR (build status, PLC monitoring push updates)
- **MQTT**: MQTTnet (build notifications, progress updates)
- **Git Integration**: LibGit2Sharp (programmatic git operations on GitHub)

All dependencies are MIT or Apache 2.0 licensed.

## Purpose

This module provides the backend services that:
- Authenticate users via Keycloak (OIDC JWT validation) with role-based access control
- Expose admin API for user management (facade over Keycloak Admin REST API)
- Git operations via LibGit2Sharp: clone/fetch on project open, commit/push on save (user's identity)
- Serve flow JSON to frontend from cached local repos (git repo is the single source of truth)
- Store metadata, auth, target registry, and audit data in PostgreSQL (not project/flow data)
- Validate visual program logic
- Route build requests to the appropriate version-specific build server
- Route deploy requests to the appropriate build server (deploy requires TwinCAT Engineering on the build server)
- Automatically select the correct build server based on target runtime (via ADS)
- Push real-time build/deploy status updates to the frontend (SignalR)
- Communicate with build servers via MQTT broker (build notifications, progress tracking)
- Orchestrate on-demand monitor containers via docker-socket-proxy (create/start/stop, short-lived token issuance, Traefik labels for auto-discovery)
- Provide REST API for the frontend

## Planned Features

- Keycloak OIDC integration (JWT validation)
- User management admin API (Keycloak Admin REST API facade)
- Role-based access control (Keycloak roles/groups)
- Secure per-user token storage (encrypted at-rest) for git operations
- Git repo creation on GitHub (via service user with minimal permissions)
- Git commit/push using authenticated user's own identity
- Project CRUD operations
- Project validation API
- Intermediate format generation
- Multi-version build server management and routing
- Build queue management
- Target PLC management (labeling, grouping, deploy protection)
- Real-time build/deploy status via SignalR
- Monitor container orchestration via docker-socket-proxy (create/start/stop, issue short-lived auth tokens, apply Traefik labels for auto-discovery)

## Getting Started

*Setup instructions coming soon*
