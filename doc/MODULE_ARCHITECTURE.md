# Module Architecture

## Shared Library (`FlowForge.Shared`)

Dependency-free library containing DTOs, enums, and constants shared across all .NET components.

### Models
- **Ads/** — `PlcAdsState`, `PlcStateDto`, `AdsConnectionInfo`, `AdsVariableSubscription`
- **Auth/** — `UserInfoDto`
- **Build/** — `BuildStatus`, `BuildJobDto`, `BuildProgressDto`, `BuildResultDto`
- **Deploy/** — `DeployStatus`, `DeployRequestDto`, `DeployResultDto`
- **Flow/** — `FlowDocument`, `FlowNode`, `FlowConnection`, `FlowPort`, `NodePosition`
- **Monitor/** — `MonitorSessionDto`, `PlcVariableValueDto`
- **Project/** — `ProjectSummaryDto`, `ProjectDetailDto`
- **Target/** — `PlcTargetDto`, `TargetGroupDto`

### MQTT
- `MqttTopics` — Topic string builders for FlowForge internal messaging (build notifications, progress, deploy status). ADS communication uses `Beckhoff.TwinCAT.Ads` directly.

---

## Backend (`FlowForge.Backend`)

Clean Architecture Lite with three layers:

### Api (ASP.NET Core)
Controllers, middleware, auth (Keycloak JWT validation), SignalR hubs for build/deploy status.

### Application (Business Logic)
- **Services**: `ProjectService`, `BuildService`, `DeployService`, `TargetService`, `MonitorService`, `AdminService`
- **Interfaces**: Repository and service contracts (Git, Docker, MQTT, Keycloak, encryption)
- No external dependencies — references Shared only

### Infrastructure
EF Core (PostgreSQL), external integrations (Git via LibGit2Sharp, MQTT via MQTTnet, Docker API, Keycloak Admin REST API, AES encryption).

---

## Build Server (`FlowForge.BuildServer`)

Windows-only service for PLC project generation and deployment.

### Pipeline
Sequential `IBuildStep` pipeline: clone → parse → validate → generate code → create project → configure tasks → compile → generate boot project → commit → deploy.

### Code Generation
`INodeTranslator` strategy pattern for flow-to-Structured Text translation. `PlcProjectBuilder` for TwinCAT project assembly.

### TwinCAT Integration
- **IAutomationInterface** — COM facade over `ITcSysManager` (Visual Studio/TwinCAT XAE Shell)
- **IAdsDeployClient** — Direct ADS via `Beckhoff.TwinCAT.Ads` for deploy operations (state management, config mode switch, restart). Uses native TwinCAT router.

### Services
- `BuildJobClient` — REST client for backend API (claim jobs, report results)
- `MqttHandler` — FlowForge internal messaging (build notifications, progress updates)
- `Worker` — Background service polling for build jobs

---

## Monitor Server (`FlowForge.MonitorServer`)

On-demand Linux/Docker container for live PLC data streaming.

### ADS Client
- **IAdsClient** — Direct ADS via `Beckhoff.TwinCAT.Ads` + `Beckhoff.TwinCAT.Ads.TcpRouter` (software ADS router for non-TwinCAT systems)
- Supports: single reads, batch reads (Sum Commands), ADS notifications (`OnChange`), PLC state reads
- Each container maintains a single long-lived ADS-over-TCP connection to the target PLC

### SignalR Hub
- **PlcDataHub** — Frontend subscribes to PLC variables; hub streams values via `IPlcDataHubClient`
- **IPlcDataHubClient** — `ReceiveVariableValues`, `ReceiveConnectionStatus`, `ReceiveError`

### Services
- **SubscriptionManager** — Thread-safe tracking of per-connection variable subscriptions
- **TokenValidator** — Short-lived auth token validation for SignalR connections

### Lifecycle
Backend creates container on monitoring request, injects config as env vars (`MonitorOptions`), Traefik auto-discovers via Docker labels, frontend connects directly via SignalR, backend destroys on session end.
