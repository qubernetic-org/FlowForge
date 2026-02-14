// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.MonitorServer.Configuration;
using FlowForge.MonitorServer.Hubs;
using FlowForge.MonitorServer.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Configuration (injected as env vars by backend at container creation)
// ---------------------------------------------------------------------------
builder.Services.Configure<MonitorOptions>(
    builder.Configuration.GetSection(MonitorOptions.Section));

// ---------------------------------------------------------------------------
// ADS client (direct ADS-over-TCP via TcpRouter — see doc/ADS_INTEGRATION.md)
// ---------------------------------------------------------------------------
builder.Services.AddSingleton<IAdsClient, AdsClientWrapper>();
builder.Services.AddSingleton<SubscriptionManager>();
// TODO: Add IHostedService to establish ADS connection on startup using MonitorOptions

// ---------------------------------------------------------------------------
// SignalR
// ---------------------------------------------------------------------------
builder.Services.AddSignalR();

var app = builder.Build();

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "flowforge-monitor" }));

// ---------------------------------------------------------------------------
// SignalR hub — Traefik strips /monitor/{session-id} prefix, so hub is at /
// ---------------------------------------------------------------------------
app.MapHub<PlcDataHub>("/plc");

app.Run();
