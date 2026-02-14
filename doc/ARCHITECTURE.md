# System Architecture

## Overview

FlowForge is a visual PLC programming platform:

![System Architecture](img/system-architecture-diagram.svg)

**Connections summary:**
- **Frontend ↔ Keycloak**: OIDC login/token flow (redirect-based)
- **Frontend ↔ Backend**: HTTP REST + SignalR for build/deploy status updates (JWT from Keycloak)
- **Frontend ↔ Monitor Container**: SignalR direct connection for live PLC data (no backend proxy)
- **Backend ↔ Keycloak**: JWT validation + Keycloak Admin REST API (user management facade)
- **Backend ↔ GitHub**: Git operations (LibGit2Sharp) — open/save with user identity
- **Backend ↔ PostgreSQL**: Metadata, build queue, target registry, audit
- **Backend → MQTT Broker**: Build notify (wake up build servers)
- **Backend → Monitor Container**: Container lifecycle management (start/stop on demand)
- **Build Server → Backend**: REST (poll for work, report results)
- **Build Server ↔ MQTT Broker**: Receive build notify, send progress updates, deploy commands (ADS over MQTT)
- **Build Server ↔ GitHub**: Git clone/fetch + push generated PLC solution
- **Monitor Container ↔ MQTT Broker**: ADS over MQTT reads/subscriptions for live PLC data
- **Build Server → MQTT Broker → PLC**: Deploy/activate via ADS over MQTT (requires TwinCAT Engineering on the build server)

## User Workflow

### 1. Project Creation
1. User logs in via SSO
2. Clicks "Create New" → fills in project details (git repo info, README data)
3. On Save → backend creates a new git repo on GitHub (via service user)
4. Optionally selects a machine type template (e.g., 3-axis standalone, 3+1 axis standalone, x-division rotary table)
5. Project editor opens

### 2. Development
- User works in the visual node editor
- Backend handles all git operations (LibGit2Sharp): clone/fetch on open, commit/push on save
- All changes are committed/pushed using the user's own SSO identity
- Full version history is maintained — every change is attributed to the actual user

### 3. Build & Deploy (permission hierarchy)

**Permission model**: Deploy permission implies Build permission. Users with Build-only permission can build but not deploy.

**Build button** (Build-only):
1. User clicks "Build"
2. Backend routes build request to the correct version-specific build server (auto-selected based on target runtime, readable via ADS)
3. Build server clones/fetches the project repo
4. Generates TwinCAT solution from the flow JSON
5. Commits and pushes the generated PLC solution back to the repo
6. Build can run at any time, even when deploy lock is active

**Deploy button** (Build + Deploy sequentially):
1. User clicks "Deploy" → Build runs first (same steps as above)
2. After successful build, user selects target PLC from auto-discovered list (ADS over MQTT)
3. Build server activates the TwinCAT solution on the target PLC via ADS over MQTT (requires TwinCAT Engineering)
4. Deploy is blocked by deploy lock on running PLCs; production targets require approval (4-eyes principle)

### 5. Online Monitoring (on-demand)
1. User opens monitoring view for a target PLC
2. Backend spins up a dedicated monitor container for that session
3. Backend issues a short-lived auth token and returns the container's SignalR endpoint to the frontend
4. Frontend connects directly to the monitor container via SignalR
5. Monitor container reads PLC data via ADS over MQTT and streams it to the frontend in real-time
6. User closes the monitoring view → backend stops the container

## Components

> **Detailed design documents**: See [MODULE_ARCHITECTURE.md](MODULE_ARCHITECTURE.md) for project structure, dependency graphs, and technology choices per module. See [BUILD_SERVER_DESIGN.md](BUILD_SERVER_DESIGN.md) for Beckhoff Automation Interface patterns, pipeline architecture, and COM interop details.

### 1. Visual Editor (Frontend)

**Purpose**: Provide intuitive node-based visual programming interface

**Architecture**: Feature-based folder organization with shared utilities. See [MODULE_ARCHITECTURE.md](MODULE_ARCHITECTURE.md).

**Key Responsibilities**:
- Render visual programming canvas
- Handle user interactions (drag-drop, connections)
- Validate connections and logic in real-time
- Serialize visual program to JSON
- Communicate with backend API
- TwinCAT version selection for build target
- PLC target selection and activation from the web interface
- Direct SignalR connection to monitor containers for live PLC data

**Technology**: React (TypeScript) + React Flow

### 2. Backend API Server (.NET)

**Purpose**: Manage projects, orchestrate builds, and handle authentication

**Architecture**: Clean Architecture Lite (3 projects: Application, Infrastructure, Api). See [MODULE_ARCHITECTURE.md](MODULE_ARCHITECTURE.md).

**Key Responsibilities**:
- User authentication via Keycloak (OIDC JWT validation) with role-based access control
- User management admin API (facade over Keycloak Admin REST API)
- Secure per-user token storage (encrypted at-rest) for git operations
- Git repo creation on GitHub (via service user with minimal permissions)
- Git operations on behalf of users (clone/fetch on open, commit/push on save) using their own identity
- Serve flow JSON to frontend from cached local repos
- Validate visual program structure
- Manage build queue and route build requests to version-specific build servers
- Route deploy requests to the appropriate build server (deploy requires TwinCAT Engineering)
- Automatically select build server based on target runtime (readable via ADS)
- Orchestrate monitor containers (start/stop on demand, issue short-lived auth tokens)
- Provide REST API
- Push real-time build/deploy status updates via SignalR

**Technology**: ASP.NET Core (Controllers) + PostgreSQL + EF Core + SignalR + MQTTnet + LibGit2Sharp (auth via Keycloak OIDC)

### 3. PLC Build Server

**Purpose**: Convert visual programs to TwinCAT PLC projects

**Architecture**: Single project with pipeline pattern (Pipeline, CodeGen, TwinCat, Services). See [BUILD_SERVER_DESIGN.md](BUILD_SERVER_DESIGN.md).

**Key Responsibilities**:
- Clone/fetch project repo from GitHub
- Parse JSON intermediate format (flow JSON)
- Generate IEC 61131-3 code (Structured Text)
- Create TwinCAT project structure
- Commit/push generated PLC solution back to the repo
- Interface with Beckhoff Automation Interface for compilation
- Deploy (activate) TwinCAT solution on target PLC via ADS over MQTT (requires TwinCAT Engineering)

**Note**: Build and Deploy are separate operations with a shared permission hierarchy. The build server handles both: generation/compilation (build) and PLC activation via ADS over MQTT (deploy). Deploy requires TwinCAT Engineering, which is only available on the build server. The backend orchestrates the requests; the build server executes them.

**Technology**: C# (.NET) - Required for Automation Interface compatibility

**Deployment**: Version-specific — each TwinCAT version runs on a dedicated Windows Server instance. The target runtime is readable via ADS, enabling automatic build server selection.

### 4. Monitor Server (on-demand containers)

**Purpose**: Provide real-time PLC data streaming to the frontend without loading the backend API

**Architecture**: Single project with organized folders (Hubs, Auth, Services). See [MODULE_ARCHITECTURE.md](MODULE_ARCHITECTURE.md).

**Key Responsibilities**:
- Read PLC variables via ADS over MQTT (cyclic reads or event-based subscriptions)
- Convert ADS data to frontend-consumable format
- Stream live data directly to the frontend via SignalR
- Authenticate frontend connections using short-lived tokens issued by the backend

**Lifecycle**: On-demand — the backend starts a container when a user requests monitoring and stops it when the session ends. The backend handles only orchestration (start/stop); it is not in the data path.

**Why separate from the backend?**
- Monitoring is long-lived and resource-intensive (continuous ADS reads); the backend API is short-lived request-response
- The ADS data is already on the MQTT broker — routing it back through MQTT just to proxy via the backend is an unnecessary round-trip
- Isolation: a slow or crashing PLC connection does not affect the backend API
- Scalability: containers scale independently per monitoring session

**Technology**: C# (.NET) + SignalR + MQTTnet

**Authentication**: Backend generates a short-lived token on monitor start; the container validates this token on SignalR connection — no need to implement full SSO in the container.

## Build Queue (PostgreSQL + MQTT notify)

Build scheduling uses PostgreSQL as the queue backend with MQTT for lightweight notifications:

1. Frontend requests a build
2. Backend inserts a row in the `build_queue` table (status: `pending`)
3. Backend publishes an MQTT notify on `flowforge/build/notify/{twincat-version}`
4. Build server receives the notify, calls the backend REST API to claim the next job
   - Backend uses `SELECT ... FOR UPDATE SKIP LOCKED` to guarantee only one server gets each job
   - Status transitions: `pending` → `in_progress` → `completed` / `failed`
5. Build server sends progress updates via MQTT (`flowforge/build/progress/{build-id}`)
6. Build server completes, reports result via backend REST API
7. If a build server crashes (timeout), backend resets the job to `pending` (auto-retry)

**Why not pure MQTT queue?** MQTT shared subscriptions lack priority, retry, dead letter, and cancel support. PostgreSQL provides ACID guarantees, priority ordering, timeout recovery, and the build history doubles as audit data.

**MQTT topics:**
- `flowforge/build/notify/{twincat-version}` — backend → build servers (lightweight wake-up signal)
- `flowforge/build/progress/{build-id}` — build server → backend (real-time progress)
- `flowforge/deploy/request/{target-id}` — build server → PLC (ADS over MQTT activation, requires TwinCAT Engineering)

## Authentication & Authorization

- **Keycloak** as the sole authentication/authorization layer (runs as a container in the Docker Compose stack):
  - **Local users**: Keycloak built-in user management (default, works out of the box)
  - **LDAP federation**: Active Directory or other LDAP-compatible directories (Keycloak config, zero backend code)
  - **External SSO**: Azure AD, Okta, or any OIDC/SAML provider via Keycloak Identity Brokering (Keycloak config, zero backend code)
  - **MFA, password policies, brute force protection**: Keycloak built-in
- **Backend auth**: Validates Keycloak-issued JWT tokens only — single code path regardless of identity source
- **User management**: FlowForge admin UI in the frontend, calls FlowForge backend admin API endpoints, which proxy to Keycloak Admin REST API. Keycloak admin console is not exposed to users.
- **Role-based access control**: Keycloak roles/groups mapped to FlowForge permissions
- **Initial config**: Keycloak realm imported from JSON on first start (`realm-export.json`)
- **Git identity**: Users commit/push with their own credentials — every change is traceable to the actual user
- **Token storage**: Per-user git tokens stored encrypted at-rest in the backend
- **Service user**: Minimal-permission account used exclusively for creating new repos on GitHub

## Git Integration (GitHub)

- Each project corresponds to a git repo on GitHub
- **Repo creation**: Service user with minimal permissions (create repo only)
- **Commits/pushes**: Performed with the authenticated user's own identity/token
- **Templates**: Pre-configured repos for common machine types
- All project history is version-controlled — serves as the audit trail for changes

## Target PLC Management

- Available targets are auto-discovered via ADS over MQTT
- **Target labeling/grouping**: Targets can be tagged by plant, cell, machine type, environment (dev/staging/prod) for manageability at scale
- **Build/Deploy separation**: Build generates and commits PLC solution; Deploy activates on PLC — independent operations with separate permissions
- **Deploy protection**: Production targets require approval (4-eyes principle)
- **Deploy lock**: Running PLCs cannot be overwritten without explicit confirmation; build can still run
- **Audit trail**: Git history provides full traceability (who changed flow, who built, who deployed)

## Version Control Strategy

The git repo on GitHub is the **single source of truth** for all project data:

```
project-repo/
├── flow/              # Visual editor JSON (edited by user via frontend)
│   └── program.json
├── plc/               # Generated TwinCAT solution (created by build server)
│   ├── MyProject.tsproj
│   ├── POUs/
│   │   └── MAIN.TcPOU
│   └── ...
└── README.md
```

- **Flow JSON** is committed by the backend using the user's SSO identity
- **PLC solution** is committed by the build server after generation
- The database (PostgreSQL) stores only metadata, auth, target registry, and build/deploy audit — not project data
- Opening a project: backend fetches the repo (cached locally, shallow clone or pull) and serves the flow JSON to the frontend

## Data Flow

1. **Design Phase**:
   - User creates visual program in editor
   - Editor validates connections locally
   - Backend commits/pushes to git repo on GitHub (under user's identity via LibGit2Sharp)

2. **Build Phase** (independent of deploy):
   - User clicks "Build"
   - Backend routes request to the correct version-specific build server (auto-selected via ADS)
   - Build server clones/fetches repo, generates TwinCAT solution from flow JSON
   - Build server commits/pushes the generated PLC solution back to the repo
   - Can run at any time, even with deploy lock active

3. **Deploy Phase** (executed by build server):
   - Backend routes deploy request to the appropriate build server
   - Build server activates the TwinCAT solution on the target PLC via ADS over MQTT (requires TwinCAT Engineering)
   - Separate permissions, blocked by deploy lock on running PLCs
   - Status updates sent back through SignalR
   - User receives success/error feedback

4. **Monitor Phase** (on-demand):
   - User requests monitoring for a target PLC
   - Backend starts a dedicated monitor container, returns SignalR endpoint + short-lived token
   - Frontend connects directly to the monitor container via SignalR
   - Monitor container reads PLC data via ADS over MQTT and streams to the frontend
   - Backend is not in the data path — only manages container lifecycle
   - Session ends → backend stops the container

## Intermediate Format

The visual program is stored as JSON. The build server converts this to TwinCAT XML (PLCopen XML compatible) during project generation. Example structure:

```json
{
  "project": {
    "name": "MyPLCProject",
    "version": "1.0.0",
    "nodes": [
      {
        "id": "node_1",
        "type": "timer",
        "position": {"x": 100, "y": 100},
        "parameters": {
          "preset": 1000
        }
      }
    ],
    "connections": [
      {
        "from": {"node": "node_1", "port": "output"},
        "to": {"node": "node_2", "port": "input"}
      }
    ]
  }
}
```

## Project Directory Structure

- **`src/frontend/`** - Web-based visual editor
- **`src/backend/`** - .NET API server for project management
- **`src/build-server/`** - PLC build server (C#/.NET)
- **`src/monitor-server/`** - On-demand PLC monitoring container (C#/.NET)
- **`doc/`** - All project documentation
- **`samples/`** - Example visual programs
- **`test/`** - Unit tests, integration tests
- **`release/`** - Production builds

## Machine Type Templates

Pre-configured project templates for common machine types:
- 3-axis standalone machine
- 3+1 axis standalone machine
- x-division rotary table
- *(extensible with additional templates)*

Templates include pre-configured I/O mappings, node structures, and project scaffolding to accelerate project creation.

## Infrastructure & Deployment

### Production Architecture

All services except the build server run as Docker containers in a single Docker Compose stack:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Docker Compose Stack                                               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────┐  │
│  │  Frontend    │  │   Backend    │  │ PostgreSQL │  │   MQTT    │  │
│  │  (nginx)     │  │ (ASP.NET     │  │            │  │  Broker   │  │
│  │              │  │  Core)       │  │            │  │           │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┘  └───────────┘  │
│                           │                                         │
│                    ┌──────┴───────┐                                  │
│                    │  Keycloak    │                                  │
│                    │  (OIDC/Auth) │                                  │
│                    └──────────────┘                                  │
│         │                 │                                         │
│  ┌──────┴─────────────────┴──────────────────────────────────────┐  │
│  │  Traefik (Reverse Proxy)                                      │  │
│  │  - Routes frontend, backend, monitor containers               │  │
│  │  - Auto-discovers monitor containers via Docker labels        │  │
│  │  - Path-based routing: /monitor/{session-id}/*                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────┐  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                │
│  │  docker-socket-    │    Monitor Containers                       │
│  │  proxy             │  │ (on-demand, created by  │                │
│  │                    │    backend via proxy)                       │
│  │  Filters Docker    │  │                         │                │
│  │  API: only         │    ┌─────────┐ ┌─────────┐                  │
│  │  create/start/stop │  │ │ mon-01  │ │ mon-02  │ │                │
│  └────────────────────┘    └─────────┘ └─────────┘                  │
│                          └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                │
└─────────────────────────────────────────────────────────────────────┘

  External (Windows Server):
  ┌─────────────────────────────┐
  │  Build Server               │
  │  (TwinCAT Engineering req.) │
  │  Connects via REST + MQTT   │
  └─────────────────────────────┘
```

### Stack Components

| Service | Image | Purpose |
|---------|-------|---------|
| **Traefik** | traefik | Reverse proxy, auto-discovers monitor containers via Docker labels, TLS termination |
| **Frontend** | nginx + static build | Serves React SPA |
| **Backend** | ASP.NET Core | API server, build orchestration, monitor container lifecycle, admin API (Keycloak facade) |
| **Keycloak** | quay.io/keycloak/keycloak | Authentication & authorization — local users, LDAP federation, external SSO (OIDC/SAML). Admin console not exposed; managed via FlowForge admin UI |
| **PostgreSQL** | postgres | Metadata, build queue, target registry, audit + Keycloak data |
| **MQTT Broker** | mosquitto / emqx | ADS over MQTT communication, build notifications |
| **docker-socket-proxy** | tecnativa/docker-socket-proxy | Filtered Docker API access for backend (containers only) |
| **Monitor Containers** | On-demand (C#/.NET) | Live PLC data streaming via SignalR, created/destroyed per session |

### Monitor Container Lifecycle

1. User requests monitoring for a target PLC
2. Backend calls Docker API (via docker-socket-proxy) to create a monitor container with Traefik labels
3. Traefik auto-discovers the new container and routes traffic via path prefix `/monitor/{session-id}/`
4. Backend returns the SignalR endpoint path (`/monitor/{session-id}/`) + short-lived auth token to the frontend
5. Frontend connects directly to the monitor container via SignalR through Traefik
6. User closes monitoring → backend stops and removes the container via docker-socket-proxy

### docker-socket-proxy

The backend does **not** have direct access to the Docker socket. Instead, [docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy) exposes a filtered Docker API:

- **Allowed**: `containers/create`, `containers/start`, `containers/stop`, `containers/remove`, `containers/list`
- **Denied**: Everything else (images, volumes, networks, exec, system)

This limits the blast radius if the backend is compromised — it can only manage containers, not escape to the host.

### Build Server (External)

The build server runs on dedicated Windows Server instances (not in the Docker stack):

- **Requirement**: TwinCAT Engineering (Windows desktop dependency for Beckhoff Automation Interface)
- **Connectivity**: Connects to the stack via REST (poll backend for build jobs) and MQTT (receive notifications, send progress, deploy via ADS over MQTT)
- **Scaling**: One instance per supported TwinCAT version
- **Cannot be containerized**: TwinCAT Engineering requires Windows desktop environment with COM interop

### Traefik Routing

All traffic is served under a single domain. Traefik uses path-based routing exclusively. The base domain is **configurable** (`BASE_DOMAIN` environment variable) to support different deployments (e.g., `flowforge.example.com`):

| Route | Target |
|-------|--------|
| `{BASE_DOMAIN}/` | Frontend (nginx) |
| `{BASE_DOMAIN}/api/*` | Backend (ASP.NET Core) |
| `{BASE_DOMAIN}/hub/*` | Backend SignalR hubs |
| `{BASE_DOMAIN}/monitor/{session-id}/*` | Monitor container (SignalR, auto-discovered) |

Monitor containers are registered with Traefik automatically via Docker labels (path prefix rule) applied at container creation time. Traefik strips the `/monitor/{session-id}` prefix before forwarding to the container, so the container itself serves on `/`. No manual Traefik configuration is needed when a new monitor session starts.

### Development

- Frontend: `npm run dev` (Vite dev server with hot reload)
- Backend: `dotnet watch run` (hot reload)
- Build Server: Local .NET development, manual deploy
- Docker Compose: `docker compose up` for full local stack (minus build server)
- Monitor Containers: Can be tested locally via Docker Compose override

## Security Considerations

- **Authentication**: Keycloak (local users, LDAP, or external SSO — all managed by Keycloak)
- **Token storage**: Per-user git tokens encrypted at-rest (never in logs or responses)
- **Service user**: Minimal permissions — repo creation only
- **Authorization**: Role-based access control via Keycloak roles/groups
- **Deploy protection**: 4-eyes principle for production targets, deploy lock on running PLCs
- **PLC Access**: ADS over MQTT via central broker (no per-server ADS route configuration)
- **Docker socket isolation**: Backend accesses Docker API only through docker-socket-proxy (filtered to container create/start/stop/remove)
- **Monitor container auth**: Short-lived tokens issued by backend, validated by container on SignalR connect — no full auth stack in containers
- **Code Injection**: Validate all user inputs to prevent malicious code generation
- **Audit**: Git history provides complete change traceability per user

## Future Enhancements

- Real-time collaboration (multiple users editing same project)
- Simulation mode (run program without PLC)
- Library of reusable components
- Code export to other PLC platforms (Siemens, Allen-Bradley)
- Template upgrade mechanism for existing projects

---

*This document will be updated as architectural decisions are finalized.*
