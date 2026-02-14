# ADS Integration Architecture

## Decision

**Use Beckhoff.TwinCAT.Ads for direct ADS communication** instead of a custom ADS-over-MQTT relay protocol.

### Context

The original architecture assumed a custom relay where the monitor server would exchange ADS read/write commands as MQTT messages (`flowforge/ads/read/*`, `flowforge/ads/write/*`, `flowforge/ads/notification/*`). Research revealed this is unnecessary:

- **ADS-over-MQTT is a native TwinCAT router feature** — transparent to application code. Once configured on the PLC via `TcConfig.xml`, any `AdsClient` connects normally via `AmsNetId`.
- **`Beckhoff.TwinCAT.Ads.TcpRouter`** provides a software ADS router for non-TwinCAT systems (Linux Docker containers).
- MQTT remains for **FlowForge internal messaging** (build notifications, progress updates) but is no longer used for ADS relay.

### Consequences

| Component | Before | After |
|-----------|--------|-------|
| **Monitor Server** | MQTT relay topics for ADS reads | `Beckhoff.TwinCAT.Ads` + `TcpRouter` for direct ADS-over-TCP |
| **Build Server** | MQTT relay for deploy commands | `Beckhoff.TwinCAT.Ads` natively (Windows/TwinCAT router) |
| **Shared MQTT Topics** | `flowforge/ads/read/*`, `write/*`, `notification/*` | Removed — MQTT for build notifications only |

---

## NuGet Packages

| Package | Version | Used By | Purpose |
|---------|---------|---------|---------|
| `Beckhoff.TwinCAT.Ads` | 7.0.* | Monitor Server, Build Server | Core ADS client (`AdsClient`) |
| `Beckhoff.TwinCAT.Ads.TcpRouter` | 7.0.* | Monitor Server only | Software ADS router for Linux/Docker |

Both packages target .NET 8.0, .NET 10.0, and .NET Standard 2.0. They work with .NET 9.0 via the .NET Standard 2.0 target.

---

## Key API Patterns

### Connection

```csharp
// On Windows with TwinCAT installed (build server):
var client = new AdsClient();
client.Connect(AmsNetId.Parse("192.168.1.100.1.1"), 851);

// On Linux/Docker with TcpRouter (monitor server):
// TcpRouter must be started first, then AdsClient connects normally.
```

**Port 851** = PLC Runtime 1 (default). Ports 852, 853 for additional runtimes.

### Variable Access

**Symbol-based read** (dynamic, for discovery):
```csharp
var loader = SymbolLoaderFactory.Create(client, settings);
var value = loader.Symbols["MAIN.nCounter"].ReadValue();
```

**Handle-based read** (faster for repeated access):
```csharp
uint handle = client.CreateVariableHandle("MAIN.nCounter");
int value = (int)client.ReadAny(handle, typeof(int));
client.DeleteVariableHandle(handle);
```

**Sum Commands** (batch — critical for performance):
- 4000 individual reads = 4–8 seconds
- 4000 reads via Sum Command = ~10 ms
- Max 500 sub-commands per call

### Notifications (Monitor Server)

```csharp
client.AddDeviceNotificationEx(
    "MAIN.nCounter",
    AdsTransMode.OnChange,
    cycleTime: 100,   // ms — check interval
    maxDelay: 0,       // ms — max delay before notification
    userData: null,
    type: typeof(int));
```

- **Max 1024 notifications per connection**
- Notifications fire on background threads
- Always unregister when done (`DeleteDeviceNotification`)

### PLC State Management (Build Server — Deploy)

```csharp
// Read state
StateInfo state = client.ReadState();
// state.AdsState == AdsState.Run / Stop / Config / etc.

// Switch to config mode (required before activation)
client.WriteControl(new StateInfo(AdsState.Reconfig, 0));

// Restart to run mode
client.WriteControl(new StateInfo(AdsState.Run, 0));
```

---

## PlcAdsState Enum

Mirrored in `FlowForge.Shared.Models.Ads.PlcAdsState` (no Beckhoff dependency in Shared):

| Value | Name | FlowForge Meaning |
|-------|------|--------------------|
| 5 | **Run** | PLC running — deploy needs approval if production target |
| 6 | **Stop** | PLC stopped — safe for deploy |
| 11 | **Error** | PLC error — needs investigation |
| 15 | **Config** | Config mode — safe for deploy |
| 16 | **Reconfig** | Transitioning to config mode |

Deploy lock logic: `IsSafeForDeploy = State is Stop or Config`.

---

## Component Architecture

### Monitor Server (Linux/Docker)

```
┌─────────────────────────────────┐
│  Monitor Container              │
│                                 │
│  ┌──────────────────────────┐   │
│  │  IAdsClient              │   │      ADS-over-TCP
│  │  (AdsClientWrapper)      │───────────────────────► PLC
│  │  Uses: AdsClient +       │   │      Port 48898
│  │        TcpRouter          │   │
│  └──────────┬───────────────┘   │
│             │                   │
│  ┌──────────▼───────────────┐   │
│  │  SubscriptionManager    │   │
│  └──────────┬───────────────┘   │
│             │                   │
│  ┌──────────▼───────────────┐   │      SignalR
│  │  PlcDataHub (SignalR)    │◄─────────────────── Frontend
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

- Each container gets a unique local `AmsNetId` (derived from IP or session ID).
- `TcpRouter` establishes the ADS-over-TCP connection to the target PLC.
- `AdsClient` connects through the local `TcpRouter`.

### Build Server (Windows/TwinCAT)

```
┌─────────────────────────────────┐
│  Build Server (Windows)         │
│                                 │
│  ┌──────────────────────────┐   │
│  │  IAdsDeployClient        │   │      Native ADS
│  │  (AdsDeployClient)       │───────────────────────► PLC
│  │  Uses: AdsClient          │   │      (via TwinCAT router)
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │  IAutomationInterface    │   │      COM Interop
│  │  (ActivateConfiguration) │───────────────────────► TwinCAT XAE
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

- No `TcpRouter` needed — uses the native TwinCAT router on Windows.
- Deploy sequence: connect → read state → switch to config → activate → restart → verify.

---

## Deploy Sequence (Build Server)

1. **Connect** to target PLC via ADS (`IAdsDeployClient.ConnectAsync`)
2. **Read PLC state** — deploy lock check (`ReadPlcStateAsync`)
3. If running + production → require 4-eyes approval (handled by backend before queuing)
4. **Switch to config mode** (`SwitchToConfigModeAsync` → `AdsState.Reconfig`)
5. **Activate configuration** via Automation Interface (`IAutomationInterface.ActivateConfiguration`)
6. **Start/restart TwinCAT** via ADS (`StartRestartTwinCatAsync` → `AdsState.Run`)
7. **Verify** PLC is in Run state
8. **Disconnect**

---

## MQTT Topic Changes

### Removed
- `flowforge/ads/read/{amsNetId}` — replaced by direct ADS reads
- `flowforge/ads/write/{amsNetId}` — replaced by direct ADS writes
- `flowforge/ads/notification/{amsNetId}` — replaced by ADS notifications

### Retained
- `flowforge/build/notify/{twincat-version}` — backend → build servers (wake-up signal)
- `flowforge/build/progress/{build-id}` — build server → backend (progress updates)

### Added
- `flowforge/deploy/status/{deploy-id}` — build server → backend (deploy progress)

---

## References

- [Beckhoff.TwinCAT.Ads NuGet](https://www.nuget.org/packages/Beckhoff.TwinCAT.Ads)
- [Beckhoff.TwinCAT.Ads.TcpRouter NuGet](https://www.nuget.org/packages/Beckhoff.TwinCAT.Ads.TcpRouter/)
- [ADS-over-MQTT Manual](https://download.beckhoff.com/download/document/automation/twincat3/ADS-over-MQTT_en.pdf)
- [Beckhoff/ADS-over-MQTT_Samples](https://github.com/Beckhoff/ADS-over-MQTT_Samples)
- [Beckhoff/TF6000_ADS_DOTNET_V5_Samples](https://github.com/Beckhoff/TF6000_ADS_DOTNET_V5_Samples)
- [ADS Notifications](https://infosys.beckhoff.com/content/1033/tc3_adsnetref/7312578699.html)
- [ADS Sum Commands](https://infosys.beckhoff.com/content/1033/tc3_adssamples_net/185258507.html)
- [AdsState Enum](https://infosys.beckhoff.com/content/1033/tc3_adsnetref/7313023115.html)
- [ITcSysManager.ActivateConfiguration](https://infosys.beckhoff.com/content/1033/tc3_automationinterface/242759819.html)
- [Secure ADS](https://download.beckhoff.com/download/document/automation/twincat3/Secure_ADS_EN.pdf)
