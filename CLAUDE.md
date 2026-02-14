# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowForge is a visual no-code PLC programming environment inspired by Unreal Engine Blueprints. It provides a web-based node editor for creating and deploying Beckhoff TwinCAT PLC projects.

## Architecture

Four main components: **Visual Editor** (web frontend) → **.NET Backend API** → **PLC Build Server(s)** + **Monitor Server(s)** → Beckhoff PLC via ADS over MQTT.

- `src/shared/FlowForge.Shared/` — Common DTOs, enums, MQTT topic constants. No external dependencies.
- `src/frontend/` — Web-based node editor (React + TypeScript + React Flow + Zustand + React Query); feature-based folder structure with auth (Keycloak), layout, and feature modules (editor, projects, build, deploy, targets, monitoring, admin)
- `src/backend/` — Clean Architecture Lite (3 projects):
  - `src/backend/src/FlowForge.Backend.Api/` — ASP.NET Core API (Controllers, Middleware, Auth, SignalR hubs). References Application + Infrastructure + Shared.
  - `src/backend/src/FlowForge.Backend.Application/` — Business logic, entities, service/repository interfaces. References Shared only.
  - `src/backend/src/FlowForge.Backend.Infrastructure/` — EF Core, external integrations (Git, MQTT, Docker, Keycloak, AES encryption). References Application + Shared.
- `src/build-server/` — PLC build server (C#/.NET); pipeline architecture with sequential build steps (IBuildStep), code generation (INodeTranslator strategy pattern), TwinCAT COM facades (IVisualStudioInstance, IAutomationInterface). References Shared.
- `src/monitor-server/` — On-demand PLC monitoring container (C#/.NET, SignalR, MQTTnet); typed hub interface, subscription manager, MQTT ADS client. References Shared.
- `doc/` — Architecture docs (`ARCHITECTURE.md`, `BUILD_SERVER_DESIGN.md`, `MODULE_ARCHITECTURE.md`), decision log, tech decisions
- `samples/` — Example visual programs
- `test/` — xUnit + NSubstitute + FluentAssertions test projects: `FlowForge.Shared.Tests`, `FlowForge.Backend.Api.Tests`, `FlowForge.Backend.Application.Tests`, `FlowForge.Backend.Infrastructure.Tests`, `FlowForge.BuildServer.Tests`, `FlowForge.MonitorServer.Tests`
- `src/FlowForge.sln` — Root solution including all .NET projects

**Key architectural decisions:**
- **Keycloak as auth layer**: all authentication/authorization via Keycloak (local users, LDAP federation, external SSO — all Keycloak config). Backend only validates JWT from Keycloak. User management via FlowForge admin UI (facade over Keycloak Admin REST API).
- **Git repo as single source of truth** on GitHub — each project is a repo containing flow JSON (user-edited) and generated PLC solution (build server output); users commit/push with their own identity; service user handles repo creation only
- **Git-backed workflow**: backend handles git operations for open (fetch) and save (commit/push); build server clones repo, generates TwinCAT solution, commits/pushes back; PostgreSQL stores only metadata, auth, target registry, audit
- **Machine type templates** for new projects (e.g., 3-axis standalone, 3+1 axis standalone, x-division rotary table)
- **Build and Deploy are separate operations with permission hierarchy**: Deploy permission implies Build permission. Deploy button triggers Build + Deploy sequentially; Build button triggers Build only. Build generates PLC solution and commits to repo; Deploy activates on target PLC via ADS over MQTT — both executed by the build server (requires TwinCAT Engineering). Backend orchestrates, build server executes. Deploy lock and 4-eyes principle for production.
- **Build queue**: PostgreSQL-based queue with MQTT notify; backend inserts jobs, build servers poll via REST with `FOR UPDATE SKIP LOCKED`; MQTT is lightweight wake-up signal only
- **Build servers are version-specific** (one per TwinCAT version on separate Windows Servers); target runtime readable via ADS enables automatic build server selection
- **PLC activation via ADS over MQTT** through a central MQTT broker (free, no per-server ADS route config needed)
- **Deploy safety**: target labeling/grouping, deploy protection for production targets (4-eyes principle), deploy lock on running PLCs, full audit trail via git history
- **Infrastructure**: Single Docker Compose stack (frontend/nginx, backend, Keycloak, PostgreSQL, MQTT broker, Traefik, docker-socket-proxy). Monitor containers created on-demand via docker-socket-proxy, auto-discovered by Traefik via Docker labels. Build server external on Windows Server (TwinCAT Engineering requirement), connects via REST + MQTT.

The intermediate format between editor and build server is JSON containing nodes (with type, position, parameters) and connections (from/to port pairs).

## Development Setup

```bash
# Install commitlint + husky (Node.js/npm required)
npm install

# Or use the setup scripts which also configure git hooks and commit template:
./scripts/setup-dev.sh        # Linux/macOS
.\scripts\setup-dev.ps1       # Windows PowerShell
```

## Build & Test Commands

```bash
# Build all .NET projects
dotnet build src/FlowForge.sln

# Run all .NET tests
dotnet test src/FlowForge.sln

# Build/test individual modules
dotnet build src/backend/FlowForge.Backend.sln
dotnet build src/build-server/FlowForge.BuildServer.sln
dotnet build src/monitor-server/FlowForge.MonitorServer.sln

# Frontend
cd src/frontend && npm run build
cd src/frontend && npm run dev
```

## Commit Conventions

Commits are validated by commitlint via husky git hook. **All commits must follow Conventional Commits format:**

```
<type>[optional scope]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Scopes: `frontend`, `backend`, `build-server`, `monitor-server`, `docs`, `config`, `ci`, `deps`

Rules: imperative mood, lowercase subject, no trailing period, max 72 chars. Use `!` after type/scope for breaking changes.

## Git Workflow

Uses **GitFlow** branching model:
- `main` — production releases (tagged with semver)
- `develop` — integration branch
- `feature/*` — new features (from/to `develop`)
- `bugfix/*` — bug fixes (from/to `develop`)
- `release/*` — release prep (from `develop`, merge to both `main` and `develop`)
- `hotfix/*` — emergency fixes (from `main`, merge to both `main` and `develop`)

PRs target `develop` for features/bugfixes. Squash-merge for feature branches, merge commit for release/hotfix branches.
