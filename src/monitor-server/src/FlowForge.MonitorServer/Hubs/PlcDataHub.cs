// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.MonitorServer.Services;
using FlowForge.Shared.Models.Ads;
using Microsoft.AspNetCore.SignalR;

namespace FlowForge.MonitorServer.Hubs;

/// <summary>
/// SignalR hub for streaming live PLC data to the frontend.
/// Frontend connects directly to this hub (not through the backend).
/// </summary>
public class PlcDataHub : Hub
{
    private readonly IAdsClient _adsClient;
    private readonly SubscriptionManager _subscriptionManager;
    private readonly ILogger<PlcDataHub> _logger;

    public PlcDataHub(IAdsClient adsClient, SubscriptionManager subscriptionManager, ILogger<PlcDataHub> logger)
    {
        _adsClient = adsClient;
        _subscriptionManager = subscriptionManager;
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
        _subscriptionManager.RemoveAllSubscriptions(Context.ConnectionId);
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Client subscribes to specific PLC variables via direct ADS notifications.
    /// </summary>
    public async Task Subscribe(string[] variablePaths)
    {
        foreach (var path in variablePaths)
        {
            _subscriptionManager.AddSubscription(Context.ConnectionId, path);

            var subscription = new AdsVariableSubscription { VariablePath = path };
            // TODO: Wire callback to push values to this client via IPlcDataHubClient.ReceiveVariableValues
            await _adsClient.SubscribeAsync(subscription, _ => { });
        }

        _logger.LogInformation("Client {ConnectionId} subscribed to {Count} variables",
            Context.ConnectionId, variablePaths.Length);
    }

    /// <summary>
    /// Client unsubscribes from specific PLC variables.
    /// </summary>
    public async Task Unsubscribe(string[] variablePaths)
    {
        foreach (var path in variablePaths)
        {
            _subscriptionManager.RemoveSubscription(Context.ConnectionId, path);
            await _adsClient.UnsubscribeAsync(path);
        }

        _logger.LogInformation("Client {ConnectionId} unsubscribed from {Count} variables",
            Context.ConnectionId, variablePaths.Length);
    }
}
