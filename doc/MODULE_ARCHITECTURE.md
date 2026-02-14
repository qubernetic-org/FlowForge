# Module Architecture

## Overview

FlowForge is composed of four main modules plus a shared library, each with an architecture pattern suited to its complexity and deployment model.

```
┌─────────────────────────────────────────────────────────┐
│                     FlowForge.Shared                     │
│                   (DTOs, Enums, Constants)                │
└────────┬──────────────┬──────────────┬──────────────┬────┘
         │              │              │              │
    ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐   ┌────▼────┐
    │ Backend │   │Build Server│  │ Monitor │   │Frontend │
    │ (3 proj)│   │ (1 proj)   │  │ (1 proj)│   │ (React) │
    └─────────┘   └───────────┘  └─────────┘   └─────────┘
```

## Shared DTO Library (`FlowForge.Shared`)

**Pattern**: Standalone class library with no external dependencies.

**Rationale**: Multiple .NET modules (Backend, Build Server, Monitor Server) exchange data via REST and MQTT. A shared library ensures type consistency across module boundaries without coupling modules to each other.

**Contents**:
- **Models/** — DTOs for Flow, Build, Deploy, Project, Target, Auth, Monitor domains.
- **Enums/** — Permission, ProjectRole, BuildStatus, DeployStatus.
- **Mqtt/** — Static topic string builders (type-safe topic construction).

**Design rules**:
- No logic — only data structures and constants.
- No external NuGet dependencies — keeps the library lightweight and universally referenceable.
- Immutable where possible — DTOs use `init` properties.

## Backend — Clean Architecture Lite (3 Projects)

**Pattern**: Simplified Clean Architecture with three projects: Application (core), Infrastructure (externals), Api (HTTP surface).

**Rationale**: The backend has the highest complexity — it integrates with PostgreSQL, Keycloak, GitHub, MQTT, Docker, and SignalR. Separating concerns into three projects enables:
- Independent testing of business logic (Application) without database or HTTP.
- Swappable infrastructure (e.g., different git providers, different databases).
- Clear dependency direction: Api → Application ← Infrastructure.

### Project: `FlowForge.Backend.Application`

The core business logic layer. References only `FlowForge.Shared`.

- **Entities/** — Domain entities mapped to PostgreSQL tables (Project, BuildJob, PlcTarget, etc.).
- **Interfaces/** — Repository and service abstractions (IProjectRepository, IGitService, etc.).
- **Services/** — Business logic implementations (ProjectService, BuildService, DeployService, etc.).
- **Validation/** — Domain validation rules (FlowDocumentValidator).

### Project: `FlowForge.Backend.Infrastructure`

External integrations. References `Application` + `Shared`.

- **Persistence/** — EF Core DbContext, entity configurations, migrations.
- **Repositories/** — `IRepository` implementations using EF Core.
- **Git/** — LibGit2Sharp implementation of `IGitService`.
- **Mqtt/** — MQTTnet implementation of `IMqttService`.
- **Docker/** — HttpClient-based `IDockerService` (talks to docker-socket-proxy).
- **Keycloak/** — HttpClient-based `IKeycloakAdminService` (Keycloak Admin REST API).
- **Security/** — AES encryption for per-user token storage.
- **DependencyInjection.cs** — `AddInfrastructure()` extension method for clean DI registration.

### Project: `FlowForge.Backend.Api`

HTTP surface layer. References `Application` + `Infrastructure` + `Shared`.

- **Controllers/** — REST API endpoints (Projects, Build, Deploy, Targets, Monitor, Admin).
- **Hubs/** — SignalR hubs (BuildHub with typed client interface).
- **Middleware/** — Error handling (ProblemDetails), request logging.
- **Auth/** — Keycloak JWT setup, claims extensions.
- **Configuration/** — Options classes (FlowForgeOptions, KeycloakOptions, MqttOptions).

### Dependency Graph

```
Api ──────→ Application ←────── Infrastructure
 │                │                    │
 └────────────────┼────────────────────┘
                  ▼
              Shared
```

**Key rule**: Application has NO reference to Infrastructure. Service interfaces are defined in Application, implemented in Infrastructure, and wired via DI in Api.

## Build Server — Single Project, Organized Folders

**Pattern**: Single project with folder-based organization (Pipeline, CodeGen, TwinCat, Services).

**Rationale**: The build server has a focused responsibility (convert flow → TwinCAT project) and runs as an isolated process on Windows. Multi-project separation would add complexity without proportional benefit. The pipeline pattern provides internal structure.

See [BUILD_SERVER_DESIGN.md](BUILD_SERVER_DESIGN.md) for detailed design.

**Folder structure**:
- **Pipeline/** — `IBuildStep` interface, `BuildContext`, `BuildPipeline` orchestrator, concrete steps.
- **CodeGen/** — `ICodeGenerator`, `StructuredTextGenerator`, `PlcProjectBuilder`, node translators.
- **TwinCat/** — COM facades (`IVisualStudioInstance`, `IAutomationInterface`, `MessageFilter`, tree item constants, template manager).
- **Services/** — `BuildJobClient` (existing), `MqttHandler`, `GitWorkspace`, `WorkspaceManager`.

**Key architectural decisions**:
1. **Pipeline pattern** — Each build step is an `IBuildStep` with `ExecuteAsync(BuildContext, CancellationToken)`. Steps are executed sequentially by `BuildPipeline`. Enables logging, timing, and error handling per step.
2. **Facade pattern for COM** — `IVisualStudioInstance` and `IAutomationInterface` wrap COM objects behind testable interfaces.
3. **Strategy pattern for code generation** — `INodeTranslator` per visual node type. New node types = new translator class.
4. **Template-based project creation** — Machine type templates stored as `.tpzip` files, resolved by `TemplateManager`.

## Monitor Server — Single Project, Organized Folders

**Pattern**: Single project with folder-based organization (Hubs, Auth, Services).

**Rationale**: The monitor server is lightweight — it streams PLC data from MQTT to SignalR. Minimal complexity doesn't warrant multi-project separation.

**Folder structure**:
- **Hubs/** — `PlcDataHub` (existing) + `IPlcDataHubClient` typed interface.
- **Auth/** — `TokenValidator` for short-lived HMAC tokens.
- **Services/** — `IMqttAdsClient` / `MqttAdsClient` for ADS over MQTT, `SubscriptionManager` for per-connection tracking.

## Frontend — Feature-Based Folders

**Pattern**: Feature-based folder organization with shared utilities.

**Rationale**: Feature-based structure scales better than layer-based (e.g., all components in one folder). Each feature is self-contained with its own components, hooks, and types. Shared code lives in `shared/`.

**Folder structure**:
```
src/
├── api/          — HTTP client, endpoint constants, TypeScript types
├── auth/         — Keycloak OIDC provider, auth hooks, route guards
├── layout/       — App shell (sidebar, header, content area)
├── features/
│   ├── editor/   — Flow canvas, node palette, inspector, custom nodes
│   ├── projects/ — Project list, create, templates
│   ├── build/    — Build panel, history, logs
│   ├── deploy/   — Deploy panel, lock indicator, approval dialog
│   ├── targets/  — PLC target management
│   ├── monitoring/ — Live PLC data monitoring
│   └── admin/    — User management (Keycloak facade)
└── shared/       — Reusable components, hooks, utilities
```

**Key dependencies**:
- `zustand` — Lightweight state management (simpler than Redux for this scale).
- `@tanstack/react-query` — Server state management (caching, refetching, optimistic updates).
- `keycloak-js` — Keycloak OIDC client adapter.
- `@microsoft/signalr` — SignalR client for real-time updates.
- `react-router-dom` — Client-side routing.

## Test Project Organization

**Pattern**: One test project per source project, using xUnit + NSubstitute + FluentAssertions.

```
test/
├── FlowForge.Shared.Tests/
├── FlowForge.Backend.Api.Tests/
├── FlowForge.Backend.Application.Tests/
├── FlowForge.Backend.Infrastructure.Tests/    (+Testcontainers.PostgreSql)
├── FlowForge.BuildServer.Tests/
└── FlowForge.MonitorServer.Tests/
```

**Rationale**:
- **xUnit** — Modern, extensible, widely used in .NET ecosystem.
- **NSubstitute** — Clean mocking syntax, ideal for interface-heavy architecture.
- **FluentAssertions** — Readable assertion syntax, better error messages.
- **Testcontainers** — Real PostgreSQL for Infrastructure tests (no in-memory fakes).

## Technology Choices Summary

| Module | Runtime | Key Libraries |
|--------|---------|---------------|
| Shared | .NET 9.0 | (none) |
| Backend.Application | .NET 9.0 | (none — interfaces only) |
| Backend.Infrastructure | .NET 9.0 | EF Core, Npgsql, MQTTnet, LibGit2Sharp |
| Backend.Api | .NET 9.0 (ASP.NET Core) | SignalR, JWT Bearer |
| Build Server | .NET 9.0 (x86) | MQTTnet, LibGit2Sharp, COM Interop |
| Monitor Server | .NET 9.0 (ASP.NET Core) | SignalR, MQTTnet |
| Frontend | TypeScript/React 19 | React Flow, zustand, react-query, keycloak-js, signalr |
| Tests | .NET 9.0 | xUnit, NSubstitute, FluentAssertions, Testcontainers |
