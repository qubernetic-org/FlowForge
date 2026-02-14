# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowForge is a visual no-code PLC programming environment inspired by Unreal Engine Blueprints. It provides a web-based node editor for creating and deploying Beckhoff TwinCAT PLC projects.

## Architecture

Four main components: **Visual Editor** (web frontend) → **.NET Backend API** → **PLC Build Server(s)** + **Monitor Server(s)** → Beckhoff PLC via direct ADS (Beckhoff.TwinCAT.Ads).

- `src/shared/FlowForge.Shared/` — Common DTOs (Flow, Build, Deploy, Project, Target, Auth, Monitor, Ads), enums, MQTT topic constants. No external dependencies.
- `src/frontend/` — Web-based node editor (React + TypeScript + React Flow + Zustand + React Query); feature-based folder structure with auth (Keycloak), layout, and feature modules (editor, projects, build, deploy, targets, monitoring, admin)
- `src/backend/` — Clean Architecture Lite (3 projects):
  - `src/backend/src/FlowForge.Backend.Api/` — ASP.NET Core API (Controllers, Middleware, Auth, SignalR hubs). References Application + Infrastructure + Shared.
  - `src/backend/src/FlowForge.Backend.Application/` — Business logic, entities, service/repository interfaces. References Shared only.
  - `src/backend/src/FlowForge.Backend.Infrastructure/` — EF Core, external integrations (Git, MQTT, Docker, Keycloak, AES encryption). References Application + Shared.
- `src/build-server/` — PLC build server (C#/.NET); pipeline architecture with sequential build steps (IBuildStep), code generation (INodeTranslator strategy pattern), TwinCAT COM facades (IVisualStudioInstance, IAutomationInterface), ADS deploy client (IAdsDeployClient). References Shared. Uses `Beckhoff.TwinCAT.Ads` for direct PLC communication.
- `src/monitor-server/` — On-demand PLC monitoring container (C#/.NET, SignalR); typed hub interface, subscription manager, direct ADS client (IAdsClient) via `Beckhoff.TwinCAT.Ads` + `Beckhoff.TwinCAT.Ads.TcpRouter` for Linux/Docker. References Shared.
- `doc/` — Architecture docs (`ARCHITECTURE.md`, `BUILD_SERVER_DESIGN.md`, `MODULE_ARCHITECTURE.md`, `ADS_INTEGRATION.md`), decision log, tech decisions
- `samples/` — Example visual programs
- `test/` — xUnit + NSubstitute + FluentAssertions test projects: `FlowForge.Shared.Tests`, `FlowForge.Backend.Api.Tests`, `FlowForge.Backend.Application.Tests`, `FlowForge.Backend.Infrastructure.Tests`, `FlowForge.BuildServer.Tests`, `FlowForge.MonitorServer.Tests`
- `src/FlowForge.sln` — Root solution including all .NET projects

**Key architectural decisions:**
- **Direct ADS communication**: Monitor Server uses `Beckhoff.TwinCAT.Ads` + `TcpRouter` (Linux/Docker); Build Server uses `Beckhoff.TwinCAT.Ads` natively (Windows). MQTT is for FlowForge internal messaging only (build notifications, deploy status), NOT for ADS relay. See `doc/ADS_INTEGRATION.md`.
- **Keycloak as auth layer**: all authentication/authorization via Keycloak (local users, LDAP federation, external SSO — all Keycloak config). Backend only validates JWT from Keycloak. User management via FlowForge admin UI (facade over Keycloak Admin REST API).
- **Git repo as single source of truth** on GitHub — each project is a repo containing flow JSON (user-edited) and generated PLC solution (build server output); users commit/push with their own identity; service user handles repo creation only
- **Git-backed workflow**: backend handles git operations for open (fetch) and save (commit/push); build server clones repo, generates TwinCAT solution, commits/pushes back; PostgreSQL stores only metadata, auth, target registry, audit
- **Machine type templates** for new projects (e.g., 3-axis standalone, 3+1 axis standalone, x-division rotary table)
- **Build and Deploy are separate operations with permission hierarchy**: Deploy permission implies Build permission. Deploy button triggers Build + Deploy sequentially; Build button triggers Build only. Build generates PLC solution and commits to repo; Deploy activates on target PLC via direct ADS — both executed by the build server (requires TwinCAT Engineering). Backend orchestrates, build server executes. Deploy lock and 4-eyes principle for production.
- **Build queue**: PostgreSQL-based queue with MQTT notify; backend inserts jobs, build servers poll via REST with `FOR UPDATE SKIP LOCKED`; MQTT is lightweight wake-up signal only
- **Build servers are version-specific** (one per TwinCAT version on separate Windows Servers); target runtime readable via ADS enables automatic build server selection
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

Commits are validated by commitlint via husky git hook **and** by GitHub Actions CI on PRs. Both commit messages AND PR titles must pass validation.

**All commits must follow Conventional Commits format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Scopes (warning-level, not required): `frontend`, `backend`, `build-server`, `monitor-server`, `docs`, `config`, `ci`, `deps`

**Hard rules enforced by CI:**
- `header-max-length`: **72 characters max** (includes type, scope, colon, space, and description)
- `body-max-line-length`: **100 characters max** per line in commit body
- `subject-empty`: subject must not be empty
- `subject-full-stop`: no trailing period
- `body-leading-blank`: blank line between header and body
- `footer-leading-blank`: blank line before footer
- `subject-case`: **disabled** (acronyms like DTO, MQTT, TwinCAT are common)

**PR titles** are also validated against the same rules. Keep PR titles under 72 characters.

Use `!` after type/scope for breaking changes. Use imperative mood, no trailing period.

## CI Checks

Every PR runs two GitHub Actions checks:

1. **Validate Commit Messages** (`commitlint.yml`): validates all PR commits AND the PR title against `.commitlintrc.json` rules. Triggered on `opened`, `synchronize`, `reopened` events.
2. **CLA Assistant** (`cla.yml`): checks Contributor License Agreement signature. Uses `pull_request_target` (reads workflow from `main` branch). Signatures stored on `cla-signatures` branch. Org members in allowlist skip signing.

**Important CI notes:**
- CLA workflow reads from `main` branch (`pull_request_target` event) — changes to `cla.yml` must be merged to `main` first (via hotfix) to take effect
- Commitlint workflow reads `.commitlintrc.json` from the PR branch — rule changes take effect after rebase on `develop`
- PR title changes do NOT trigger CI re-runs (no `edited` event) — push a commit to trigger `synchronize`
- `package-lock.json` is in `.gitignore` — do NOT use `cache: 'npm'` in GitHub Actions setup-node steps

## Git Workflow

Uses **GitFlow** branching model:
- `main` — production releases (tagged with semver), protected branch
- `develop` — integration branch, protected branch
- `feature/*` — new features (from/to `develop`)
- `bugfix/*` — bug fixes (from/to `develop`)
- `release/*` — release prep (from `develop`, merge to both `main` and `develop`)
- `hotfix/*` — emergency fixes (from `main`, merge to both `main` and `develop`)
- `cla-signatures` — CLA signature storage (unprotected, used by CLA bot)

PRs target `develop` for features/bugfixes. Squash-merge for feature branches, merge commit for release/hotfix branches.

**Release process:**
1. Create `release/x.y.z` from `develop`
2. Update `CHANGELOG.md` (move Unreleased to new version section)
3. Commit, push, create PR to `main`
4. Merge to `main` with merge commit (not squash)
5. Tag `main` with `vx.y.z`
6. Merge `main` back to `develop`
7. Delete release branch (local + remote)

**Hotfix process** (for CI/workflow fixes that need to be on `main` immediately):
1. Create `hotfix/*` from `main`
2. Fix, commit, push, create PR to `main`
3. Merge to `main` with merge commit
4. Cherry-pick to `develop` (or merge `main` into `develop`)
5. Delete hotfix branch
