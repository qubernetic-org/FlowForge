# Changelog

All notable changes to FlowForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.3.0] - 2026-02-14

Architecture skeleton and Beckhoff ADS integration.

### Added
- **Shared DTO library** (`src/shared/FlowForge.Shared/`): common DTOs (Flow, Build, Deploy, Project, Target, Auth, Monitor), enums (Permission, ProjectRole, BuildStatus, DeployStatus), MQTT topic constants
- **Backend Clean Architecture** (3-project split):
  - `FlowForge.Backend.Application` — entities, service/repository interfaces, business logic stubs
  - `FlowForge.Backend.Infrastructure` — EF Core persistence, repository implementations, external service integrations (Git, MQTT, Docker, Keycloak, AES encryption)
  - Refactored `FlowForge.Backend.Api` — added controller stubs (Projects, Build, Deploy, Targets, Monitor, Admin), middleware (error handling, request logging), Keycloak JWT authentication setup
- **Build Server architecture** — pipeline pattern (IBuildStep), code generation (INodeTranslator strategy), TwinCAT COM facades (IVisualStudioInstance, IAutomationInterface), MessageFilter, template manager, workspace manager
- **Monitor Server architecture** — typed SignalR hub interface (IPlcDataHubClient), subscription manager, token validator
- **Frontend architecture** — feature-based folder structure (editor, projects, build, deploy, targets, monitoring, admin), auth layer (Keycloak OIDC), layout components, API client with JWT interceptor; added zustand, react-query, keycloak-js, @microsoft/signalr, react-router-dom
- **Test projects** (6): xUnit + NSubstitute + FluentAssertions for Shared, Backend.Api, Backend.Application, Backend.Infrastructure, BuildServer, MonitorServer
- **Root solution** (`src/FlowForge.sln`) including all 12 .NET projects with solution folders
- **Architecture design documents**: `doc/BUILD_SERVER_DESIGN.md`, `doc/MODULE_ARCHITECTURE.md`, `doc/ADS_INTEGRATION.md`
- **Beckhoff ADS integration** — direct ADS communication replacing custom MQTT relay:
  - Shared ADS types: `PlcAdsState` enum, `PlcStateDto`, `AdsConnectionInfo`, `AdsVariableSubscription` DTOs
  - Monitor Server: `IAdsClient` + `AdsClientWrapper` using `Beckhoff.TwinCAT.Ads` + `TcpRouter` for Linux/Docker
  - Build Server: `IAdsDeployClient` + `AdsDeployClient` for deploy-time PLC state management
  - `DeployService` and `TargetService` stubs for deploy workflow and target management
  - `DeployStatus` MQTT topic for deploy progress notifications

### Changed
- Monitor Server: replaced `IMqttAdsClient` with direct `IAdsClient` (Beckhoff ADS over TCP)
- MQTT topics: removed `AdsRead`, `AdsWrite`, `AdsNotification` relay topics — MQTT now used for FlowForge internal messaging only
- Architecture docs updated to reflect ADS-direct design

### Removed
- `IMqttAdsClient` and `MqttAdsClient` (MQTT ADS relay no longer needed)

---

## [0.2.0] - 2026-02-14

Open source preparation release — AGPL-3.0 dual licensing.

### Added
- AGPL-3.0 license with dual licensing model (open source + commercial)
- NOTICE file with dual licensing terms and Qubernetic copyright
- Contributor License Agreement (CLA) with GitHub Action workflow
- SPDX license headers (`AGPL-3.0-or-later`) on all source files
- Dependabot configuration for npm, NuGet, GitHub Actions, and Docker
- Issue template chooser with GitHub Discussions links
- GitHub Discussions enabled with pinned welcome, roadmap, ADR, and guidelines
- GitHub Project board with all 82 issues across 15 milestones
- CLA Assistant workflow for automated contributor agreement signing

### Changed
- Development planning moved from ROADMAP.md to GitHub Milestones and Issues
- Dependabot PRs now target `develop` branch (GitFlow compliance)
- Bump `actions/checkout` from v4 to v6
- Bump `actions/setup-node` from v4 to v6
- Bump `@commitlint/cli` from 19.8.1 to 20.4.1
- Bump `@commitlint/config-conventional` from 19.8.1 to 20.4.1

### Removed
- ROADMAP.md (replaced by GitHub Milestones)
- Proprietary license (replaced by AGPL-3.0)

---

## [0.1.0] - 2026-02-12

Initial repository setup and documentation phase.

### Added
- Initial repository structure
- Project documentation:
  - README.md with project overview
  - ARCHITECTURE.md with system design
  - VISUAL_LANGUAGE.md with node specifications
  - DECISION_LOG.md for tracking choices
  - TECH_DECISIONS.md for technology evaluation
  - CONTRIBUTING.md for contributor guidelines
  - GIT_WORKFLOW.md for GitFlow and Conventional Commits guide
- Directory structure:
  - `src/` — Source code (frontend, backend, build-server, monitor-server)
  - `doc/` — Documentation
  - `samples/` — Example projects
  - `test/` — Test files
  - `release/` — Release builds
- Git workflow standards:
  - GitFlow branching model implemented
  - Conventional Commits specification adopted
  - Commit message template (.gitmessage)
  - Commitlint configuration (.commitlintrc.json)
  - GitHub Actions workflow for commit validation
  - Pull request template
  - Issue templates (bug report, feature request)
  - Development setup scripts (setup-dev.sh, setup-dev.ps1)
  - Automated commitlint and husky installation via setup script
  - Commit validation test scripts (test-commitlint.sh, test-commitlint.ps1)
- Comprehensive .gitignore covering multiple tech stacks
- package.json for Node.js dependencies management
- Docker Compose stack (Traefik, PostgreSQL, MQTT, docker-socket-proxy)
- Frontend skeleton (React + React Flow + TypeScript + Vite)
- Backend skeleton (ASP.NET Core + SignalR)
- Build server skeleton (.NET Worker Service)
- Monitor server skeleton (.NET + SignalR)
