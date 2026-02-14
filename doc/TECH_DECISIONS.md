# Technology Decision Guide

This document helps guide technology stack decisions for FlowForge.

## Decision Criteria

When evaluating technologies, consider:

1. **Integration Requirements**
   - Must work with Beckhoff Automation Interface
   - Must support web-based delivery
   - Cross-platform where possible

2. **Development Experience**
   - Learning curve for team
   - Available libraries and tools
   - Community support

3. **Performance**
   - Visual editor responsiveness
   - Build/compile speed
   - Deployment time

4. **Maintainability**
   - Code clarity
   - Testing capabilities
   - Long-term support

5. **Deployment**
   - Infrastructure requirements
   - Cost considerations
   - Security implications

## Component Analysis

### Visual Editor (Frontend) — **DECIDED: React + React Flow**

#### Option 1: React + React Flow ✅ CHOSEN

**Pros**:
- Mature node editor library (React Flow)
- Large ecosystem and community
- Excellent TypeScript support
- Many UI component libraries available
- Good debugging tools

**Cons**:
- Larger bundle size (~200-300KB minified)
- More complex state management
- Steeper learning curve
- Performance optimization needed for large diagrams

**Best For**: Teams familiar with React, projects needing rich UI components

#### Option 2: Vue 3 + Vue Flow

**Pros**:
- Vue Flow is a port of React Flow for Vue
- Simpler reactive model than React
- Good performance out of the box
- Smaller bundle size than React
- Composition API similar to React Hooks

**Cons**:
- Smaller ecosystem than React
- Vue Flow less mature than React Flow
- Fewer pre-built UI libraries

**Best For**: Developers wanting simpler reactivity, node-editor-focused projects

#### Option 3: Svelte + Custom Canvas

**Pros**:
- Smallest bundle size (~50-100KB)
- Best runtime performance
- Reactive by default (no virtual DOM)
- Clean, readable code
- Excellent DX with SvelteKit

**Cons**:
- Requires custom node editor implementation
- Smaller ecosystem (but growing)
- Fewer developers familiar with it
- Less enterprise adoption

**Best For**: Performance-critical applications, greenfield projects

**Decision**: React + React Flow — most mature node editor library, largest ecosystem, team has React experience. React Flow core is MIT licensed. React Flow Pro subscription under evaluation.

---

### Backend API — **DECIDED: ASP.NET Core + PostgreSQL + Keycloak (OIDC) + SignalR + MQTTnet + LibGit2Sharp**

#### Option 1: Node.js + TypeScript + Express/Fastify

**Pros**:
- Same language as frontend (TypeScript)
- Excellent async I/O performance
- Large ecosystem (npm)
- Easy deployment (containerizable)
- Many developers available

**Cons**:
- No native .NET interop (requires child process for PLC build server)
- Less type safety at runtime despite TypeScript
- Package.json dependency hell

**Best For**: JavaScript/TypeScript teams, microservices architecture

#### Option 2: Python + FastAPI

**Pros**:
- Fast development with FastAPI
- Auto-generated API documentation
- Excellent async support (asyncio)
- Great for data processing
- Type hints with Pydantic

**Cons**:
- COM/.NET interop via pythonnet is clunky
- Global interpreter lock (GIL) limitations
- Slower than Node.js for I/O
- Requires separate process for PLC build server

**Best For**: Data-heavy applications, teams with Python expertise

#### Option 3: C# + .NET 8 Web API ✅ CHOSEN

**Pros**:
- Native interop with PLC Build Server component
- Strong type safety
- Excellent performance (close to C++)
- Can integrate Automation Interface directly
- Single deployment package possible

**Cons**:
- Heavier runtime than Node.js
- Different language from frontend
- More verbose than Python/Node.js
- Windows-focused (though .NET 8 is cross-platform)

**Best For**: Windows-first deployment, integrated solution with PLC build server

**Decision**: ASP.NET Core (Controllers) with the following stack:
- **Database**: PostgreSQL (EF Core + Npgsql)
- **Auth**: Keycloak (OIDC) — backend validates JWT only. Local users, LDAP, external SSO all handled by Keycloak.
- **Real-time**: SignalR — build status and PLC monitoring push updates
- **MQTT**: MQTTnet — ADS over MQTT communication with PLC targets
- **Git**: LibGit2Sharp — programmatic git operations on GitHub repos
- All dependencies MIT or Apache 2.0 licensed

---

### PLC Build Server

**Decision: C# .NET (Required)**

Beckhoff Automation Interface is a COM/.NET API. C# provides:
- Native COM interop
- Full API access
- Best performance and reliability
- Official Beckhoff examples in C#

**No viable alternatives** for production use.

---

### Database vs File Storage — **DECIDED: PostgreSQL**

#### Option 1: PostgreSQL Database ✅ CHOSEN

**Pros**:
- ACID transactions
- Multi-user support
- Complex queries
- JSON support (for storing projects)
- Mature and reliable

**Cons**:
- Additional infrastructure
- More complex setup
- Overkill for single-user

**Best For**: Multi-user deployment, production systems

#### Option 2: File System (JSON files)

**Pros**:
- Simple implementation
- Git-friendly (version control)
- No additional services
- Easy debugging (open file in editor)
- Portable

**Cons**:
- No concurrent access protection
- Limited query capabilities
- No built-in backup/recovery

**Best For**: Single-user, development, quick prototyping

#### Option 3: SQLite

**Pros**:
- No server needed (embedded)
- ACID transactions
- SQL queries available
- Single file database
- Good performance

**Cons**:
- Limited concurrent writes
- No network access (file-based)

**Best For**: Single-user production, embedded applications

**Decision**: PostgreSQL — excellent JSONB support for storing node editor data.

---

### Deployment Strategy

#### Development:
- Frontend: Vite dev server (`npm run dev`)
- Backend: Local process with hot reload
- PLC Build Server: Compile locally, manual deploy

#### Production Options:

**Option A: All-in-One Windows Service**
- Bundle everything into Windows service
- Runs on machine with TwinCAT
- Pros: Simple, single point of deployment
- Cons: Tight coupling, harder to scale

**Option B: Separated Services**
- Frontend: Static hosting (CDN, Vercel, Azure)
- Backend: Container on cloud/on-prem
- PLC Build Server: Windows service near PLC
- Pros: Scalable, flexible
- Cons: More complex, latency between services

**Decision**: Option B (Separated Services) — matches the confirmed architecture with independent frontend, backend, build servers, monitor containers, and MQTT broker

---

## Next Steps Decision Checklist

Before starting implementation, decide:

- [x] Frontend framework — React + React Flow
- [x] Backend runtime — ASP.NET Core (C#)
- [x] Storage mechanism — PostgreSQL + git repos on GitHub
- [x] Deployment strategy — Separated Services (Option B)
- [x] Development environment setup — setup scripts in `scripts/`
- [ ] CI/CD pipeline (GitHub Actions?)

Update [DECISION_LOG.md](DECISION_LOG.md) as decisions are made.
