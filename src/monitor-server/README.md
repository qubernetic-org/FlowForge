# Monitor Server (On-Demand Containers)

Real-time PLC data streaming via on-demand containers.

**Location**: `src/monitor-server/`

## Purpose

This module provides real-time PLC online monitoring by streaming live ADS data directly to the frontend. Each monitoring session runs in a dedicated container, started and stopped on demand by the backend.

## Architecture

```
Frontend: requests monitoring
    → Backend: starts monitor container, returns SignalR endpoint + short-lived token
    → Frontend: connects directly to monitor container via SignalR
    → Monitor container: reads PLC data via ADS over MQTT, streams to frontend
    → Frontend: closes monitoring view
    → Backend: stops the container
```

**Container lifecycle:**
1. Backend creates the container via docker-socket-proxy (filtered Docker API — container operations only)
2. Container starts with Traefik labels → Traefik auto-discovers and routes traffic via path prefix (`/monitor/{session-id}/`)
3. Frontend connects directly via SignalR through Traefik
4. Session ends → backend stops and removes the container via docker-socket-proxy

**Key design decisions:**
- **Direct SignalR to frontend** — the backend is NOT in the data path, only manages container lifecycle
- **No backend proxy** — ADS data is already on the MQTT broker; routing it back through MQTT to proxy via the backend would be an unnecessary round-trip
- **On-demand** — containers only run when someone is actively monitoring (cost-efficient)
- **Isolation** — a slow or crashing PLC connection does not affect the backend API
- **docker-socket-proxy** — backend never touches the raw Docker socket; API filtered to container create/start/stop/remove only
- **Traefik routing** — monitor containers are auto-discovered via Docker labels, no manual proxy configuration per session

## Planned Features

- ADS over MQTT variable reads (cyclic and event-based subscriptions)
- ADS data conversion to frontend-consumable JSON format
- SignalR streaming to frontend clients
- Short-lived token authentication (tokens issued by the backend)
- Graceful shutdown on session end or timeout

## Technology

- **Language**: C# (.NET)
- **Real-time**: SignalR (direct connection to frontend)
- **MQTT**: MQTTnet (ADS over MQTT reads/subscriptions)
- **Authentication**: Short-lived token validation (tokens issued by backend, no full SSO needed)
- **Deployment**: Docker container, created/destroyed by backend via docker-socket-proxy, auto-discovered by Traefik via Docker labels

## Getting Started

*Setup instructions coming soon*
