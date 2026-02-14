# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowForge is a visual no-code PLC programming environment inspired by Unreal Engine Blueprints. It provides a web-based node editor for creating and deploying Beckhoff TwinCAT PLC projects.

## Architecture

Four main components: **Visual Editor** (web frontend) → **.NET Backend API** → **PLC Build Server(s)** + **Monitor Server(s)** → Beckhoff PLC via ADS over MQTT.

- `src/frontend/` — Web-based node editor (React + TypeScript + React Flow); direct SignalR to monitor containers for live PLC data
- `src/backend/` — ASP.NET Core API (Controllers, PostgreSQL/EF Core, SignalR, MQTTnet, LibGit2Sharp); manages projects, routes build requests to version-specific build servers, orchestrates monitor containers, authenticates via OIDC (Keycloak), exposes admin API as facade over Keycloak Admin REST API
- `src/build-server/` — PLC build server (C#/.NET, required for Beckhoff Automation Interface); handles both build and deploy (TwinCAT Engineering needed for PLC activation); version-specific instances on dedicated Windows Servers
- `src/monitor-server/` — On-demand PLC monitoring container (C#/.NET, SignalR, MQTTnet); streams live ADS data directly to frontend via SignalR, backend manages lifecycle only
- `doc/` — Architecture docs, decision log, tech decisions
- `samples/` — Example visual programs
- `test/` — Tests (framework TBD)

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

## Commit Conventions

Commits are validated by commitlint via husky git hook. **All commits must follow Conventional Commits format:**

```
<type>[optional scope]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Scopes: `frontend`, `backend`, `build-server`, `monitor-server`, `docs`, `config`, `deps`

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
