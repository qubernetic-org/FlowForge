# Decision Log

This document tracks key technology and design decisions made during the project development.

## Format

Each decision is documented with:
- **Date**: When the decision was made
- **Decision**: What was decided
- **Context**: Why this decision was needed
- **Options Considered**: Alternatives that were evaluated
- **Rationale**: Why this option was chosen
- **Consequences**: Expected impact of this decision

---

## Decisions

### [Confirmed] Frontend Framework: React + React Flow

**Date**: Project update

**Decision**: Use React with React Flow for the visual editor frontend

**Context**: Need web framework with a mature node editor library for Blueprint-style visual PLC programming

**Options Considered**:
1. React + React Flow - **CHOSEN**
   - Pros: Most mature node editor library (production-proven), largest ecosystem, TypeScript first-class, most available developers, excellent testing tools
   - Cons: Larger bundle size (~150-200KB), more complex state management

2. Vue 3 + Vue Flow
   - Pros: Simpler reactivity model, smaller bundle
   - Cons: Vue Flow less mature than React Flow, smaller ecosystem

3. Svelte + Svelvet
   - Pros: Smallest bundle, best runtime performance
   - Cons: Svelvet not production-ready, would require custom node editor development

4. Angular
   - Pros: Enterprise-grade, strong TypeScript
   - Cons: No mature node editor library available

5. Blazor (C#/.NET)
   - Pros: Unified C# stack with backend
   - Cons: No node editor library, WebAssembly performance limitations for canvas

**Rationale**: React Flow is the most mature and actively maintained node editor library available. It is production-proven (used by Stripe, Typeform, and others), handles 1000+ node diagrams with virtualization, and has excellent documentation. The React ecosystem provides the widest selection of complementary libraries for authentication, UI components, and testing. Team has existing React experience. React Flow core is MIT licensed (dependency policy compliant).

**Consequences**: Frontend will use React + TypeScript + React Flow. React Flow Pro subscription under evaluation for additional features and priority support.

---

### [Confirmed] Backend Technology Stack

**Date**: Project update

**Decision**: ASP.NET Core (Controllers) + PostgreSQL + EF Core + Keycloak (OIDC) + SignalR + MQTTnet + LibGit2Sharp

**Context**: Need backend API for project management, authentication, build orchestration, real-time updates, MQTT communication, and git integration

**Stack**:
- **API**: ASP.NET Core Controllers (MIT)
- **Database**: PostgreSQL (PostgreSQL License)
- **ORM**: Entity Framework Core + Npgsql provider (Apache 2.0 / PostgreSQL License)
- **Auth**: Keycloak (Apache 2.0) — OIDC authentication. Backend validates JWT only. User management via Keycloak Admin REST API.
- **Real-time**: SignalR (MIT) — for build status and PLC monitoring push updates
- **MQTT**: MQTTnet (MIT) — for ADS over MQTT communication with PLC targets
- **Git**: LibGit2Sharp (MIT) — for programmatic git operations on GitHub repos

**Rationale**: .NET backend provides unified technology stack with the build servers. Keycloak handles all authentication complexity (local users, LDAP, external SSO) — backend only validates JWT. All dependencies are MIT or Apache 2.0 licensed.

**Consequences**: Backend requires PostgreSQL instance and Keycloak container. MQTT broker infrastructure required for PLC communication.

---

### [Confirmed] Intermediate Format: JSON (with PLCopen XML export in build server)

**Date**: Project update

**Decision**: Use JSON as the intermediate format throughout the application. The build server converts JSON to TwinCAT XML (PLCopen XML compatible) during project generation.

**Context**: Need format for storing and exchanging visual program data between frontend, backend, and build server

**Options Considered**:
1. JSON - **CHOSEN**
   - Pros: React Flow native export, ASP.NET Core native, PostgreSQL JSONB (indexable, queryable), compact, clean git diffs
   - Cons: No built-in schema validation (requires JSON Schema), not native to TwinCAT

2. XML
   - Pros: TwinCAT native, XSD validation, PLCopen TC6-XML standard, XSLT transformation
   - Cons: Not React Flow native (requires conversion on every save/load), verbose, poor PostgreSQL support, noisy git diffs

3. Hybrid (JSON in app, XML export)
   - This is effectively what option 1 becomes — JSON everywhere, build server handles the XML generation

**Rationale**: The entire application stack (React Flow, ASP.NET Core REST API, PostgreSQL JSONB) works natively with JSON. The build server must generate TwinCAT XML regardless of input format, so this conversion step exists either way. JSON Schema provides sufficient validation. Layout data (node positions) naturally stays in JSON while PLCopen XML export handles only PLC logic.

**Consequences**: Need well-designed JSON Schema that captures all information the build server requires (lossless conversion). Build server implements JSON → TwinCAT XML transformation. Future PLCopen XML export enables multi-platform PLC support.

---

### [Confirmed] Database: PostgreSQL

**Date**: Project update

**Decision**: Use PostgreSQL for data persistence

**Context**: Need database for user projects, settings, target management, and audit data

**Options Considered**:
1. PostgreSQL - **CHOSEN**
   - Pros: Excellent JSON/JSONB support for node editor data, ACID, open source
   - Cons: Requires infrastructure

2. SQL Server
   - Pros: Best .NET integration, enterprise support
   - Cons: License cost

3. File System (JSON/XML files)
   - Pros: Simple, Git-friendly, no additional services
   - Cons: Limited query capabilities, concurrency issues

**Rationale**: PostgreSQL is a proven, mature database platform. Excellent JSONB support enables efficient storage and querying of node editor data. Open-source license (PostgreSQL License).

**Consequences**: Requires PostgreSQL instance. EF Core + Npgsql provider for .NET integration. JSONB columns for flexible schema storage where needed.

---

### [Confirmed] Backend Technology: .NET

**Date**: Project update

**Decision**: Use .NET for the backend API server

**Context**: Need backend that integrates well with .NET-based build servers

**Rationale**: .NET backend provides native integration with the C#/.NET build servers, simplifying the architecture and allowing a single technology stack for all server-side components.

**Consequences**: Backend and build servers share the same runtime. Windows-friendly but .NET is cross-platform.

---

### [Confirmed] PLC Build Server Technology: C# .NET

**Date**: Project initialization

**Decision**: Use C# and .NET for PLC Build Server component

**Context**: Need to interface with Beckhoff Automation Interface

**Options Considered**:
1. C# .NET - **CHOSEN**
   - Pros: Native COM interop, full Automation Interface support
   - Cons: Windows-only, requires .NET runtime

2. Python with COM
   - Pros: Simpler syntax, flexible
   - Cons: COM interop is unreliable, poor performance

**Rationale**: Beckhoff Automation Interface is a COM/.NET API that requires strong .NET integration. C# provides the best support and reliability.

**Consequences**: PLC Build Server must run on Windows machine with TwinCAT installed. This component cannot be easily containerized (unless using Windows containers).

---

### [Updated] Authentication via Keycloak

**Date**: Project update

**Decision**: Use Keycloak as the sole authentication and authorization layer. Backend validates JWT only and exposes a user management admin API as a facade over Keycloak Admin REST API.

**Context**: Need flexible user authentication that works across different deployment environments — from standalone setups (local users) to enterprise environments (LDAP, SSO). Implementing multiple auth providers directly in the backend would be complex and error-prone.

**Options Considered**:
1. SSO-only (Azure AD)
   - Pros: Single auth path, automatic provisioning
   - Cons: Requires SSO infrastructure, limits adoption outside enterprise environments

2. Pluggable auth in backend (ASP.NET Identity + LDAP + OIDC)
   - Pros: No external auth dependency
   - Cons: Three auth code paths to implement/maintain/test, significant development effort

3. Keycloak as auth abstraction layer - **CHOSEN**
   - Pros: Backend implements only JWT validation (one code path). Local users, LDAP federation, external SSO (Azure AD, Okta, etc.) are all Keycloak configuration — zero backend code. Built-in MFA, password policies, brute force protection. Admin REST API for programmatic user management.
   - Cons: Additional container (~512MB RAM). Keycloak admin console must be secured (not exposed publicly — admin operations go through FlowForge admin UI).

**Rationale**: Keycloak is an industry-standard open-source IAM (Apache 2.0). Instead of implementing three auth providers in the backend, the backend only validates JWT tokens — a single, well-tested code path. Adding LDAP or external SSO later is a Keycloak configuration change, not a code change. The FlowForge frontend provides an admin UI for user management that calls the backend admin API, which proxies to Keycloak Admin REST API. Users never interact with Keycloak directly.

**Consequences**: Docker Compose stack includes a Keycloak container. Initial realm configuration provisioned via `realm-export.json` on first start. Backend needs OIDC JWT validation middleware and a thin admin API layer over Keycloak Admin REST API. Keycloak admin console is internal-only (not routed through Traefik).

---

### [Confirmed] Git-Based Project Versioning on GitHub

**Date**: Project update

**Decision**: Each project is a git repo on GitHub. Users commit/push with their own SSO identity; a service user handles repo creation only.

**Context**: Need version control for visual programs with full audit trail

**Options Considered**:
1. Service user for all git operations
   - Pros: Simpler token management
   - Cons: No per-user attribution, poor audit trail

2. User identity for commits, service user for repo creation - **CHOSEN**
   - Pros: Full per-user audit trail via git history, meets compliance requirements (IEC 62443, FDA 21 CFR Part 11)
   - Cons: Requires secure per-user token storage (encrypted at-rest)

**Rationale**: In industrial environments, traceability is critical. Using the user's own identity for git operations provides automatic audit trail without building a separate audit system. GitHub uses SSO, making this a natural fit.

**Consequences**: Backend must securely store per-user git tokens (encrypted at-rest). Service user needs only repo creation permissions (least privilege).

---

### [Confirmed] ADS over MQTT for PLC Communication

**Date**: Project update

**Decision**: Use ADS over MQTT via central MQTT broker for PLC activation (download/activate/online monitoring)

**Context**: Need to communicate with PLCs from the web application for deployment

**Options Considered**:
1. Direct ADS routes per build server
   - Pros: Simple, proven
   - Cons: Requires manual ADS route configuration per server/target pair, does not scale

2. ADS over MQTT via central broker - **CHOSEN**
   - Pros: No per-server ADS route configuration, scales to many targets, free (no additional Beckhoff license), central point of management
   - Cons: Requires MQTT broker infrastructure, additional network hop

**Rationale**: ADS over MQTT eliminates the operational overhead of managing ADS routes across multiple build servers and targets. The central MQTT broker simplifies network configuration and scales well. Note: TF6701 (separate Beckhoff license) is for PLC runtime ↔ MQTT broker communication, not for ADS over MQTT engineering operations which are free.

**Consequences**: Need a central MQTT broker (HA cluster for production). All build servers and target PLCs connect through the broker.

---

### [Confirmed] Version-Specific Build Servers

**Date**: Project update

**Decision**: Deploy one build server per TwinCAT version on dedicated Windows Server instances

**Context**: TwinCAT projects are version-dependent; different versions can have breaking changes

**Rationale**: Isolating TwinCAT versions on separate servers ensures version compatibility and prevents one version's update from breaking builds for another. The target runtime version is readable via ADS, enabling automatic build server selection.

**Consequences**: Infrastructure cost scales with number of supported TwinCAT versions. Need lifecycle policy for version support. Backend must implement build server routing logic.

---

### [Confirmed] Infrastructure: Docker Compose + Traefik + docker-socket-proxy

**Date**: 2026-02-13

**Decision**: Run all services (except build server) in a single Docker Compose stack with Traefik as reverse proxy and docker-socket-proxy for monitor container lifecycle management.

**Context**: Need a deployment architecture that supports the backend managing on-demand monitor containers while keeping the infrastructure simple and secure.

**Options Considered**:
1. Docker Compose + Traefik + docker-socket-proxy - **CHOSEN**
   - Pros: Single stack deployment, Traefik auto-discovers monitor containers via Docker labels, docker-socket-proxy limits Docker API exposure, URL-based routing for all services
   - Cons: Traefik adds a component to learn/maintain

2. Docker Compose + dynamic port mapping (no reverse proxy)
   - Pros: Simpler initial setup, fewer components
   - Cons: Dynamic ports are hard to manage, frontend needs to track port assignments, no TLS termination point, poor long-term maintainability

3. Kubernetes
   - Pros: Industry standard orchestration, built-in service discovery
   - Cons: Massive overhead for this use case, overkill for on-premise deployment

**Rationale**: Traefik provides automatic service discovery for dynamically created monitor containers via Docker labels — no manual configuration needed per session. All routing is path-based under a single domain (e.g., `flowforge.example.com`). docker-socket-proxy (Tecnativa) filters Docker API access to container operations only, significantly reducing the attack surface compared to exposing the raw Docker socket to the backend. The build server remains external (Windows requirement for TwinCAT Engineering) and connects via REST + MQTT.

**Consequences**: Infrastructure requires Docker + Docker Compose on the host. Traefik configuration needed for routing rules and TLS. docker-socket-proxy limits backend to container create/start/stop/remove only. Build server connects from external Windows machines via REST and MQTT.

---

*Add new decisions as they are made during development.*
