// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.AspNetCore.SignalR;

namespace FlowForge.MonitorServer.Hubs;

/// <summary>
/// SignalR hub for streaming live PLC data to the frontend.
/// Frontend connects directly to this hub (not through the backend).
/// </summary>
public class PlcDataHub : Hub
{
    private readonly ILogger<PlcDataHub> _logger;

    public PlcDataHub(ILogger<PlcDataHub> logger)
    {
        _logger = logger;
    }

    public override Task OnConnectedAsync()
    {
        // TODO: Validate short-lived auth token from query string
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Client subscribes to specific PLC variables.
    /// </summary>
    public async Task Subscribe(string[] variablePaths)
    {
        // TODO: Register ADS subscriptions via MQTT for requested variables
        _logger.LogInformation("Client {ConnectionId} subscribed to {Count} variables",
            Context.ConnectionId, variablePaths.Length);
        await Task.CompletedTask;
    }
}