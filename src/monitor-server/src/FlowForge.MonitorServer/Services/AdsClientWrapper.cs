// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;
using FlowForge.Shared.Models.Monitor;

namespace FlowForge.MonitorServer.Services;

/// <summary>
/// Wraps Beckhoff.TwinCAT.Ads.AdsClient with TcpRouter for use on Linux/Docker.
/// Each monitor container maintains a single long-lived ADS connection.
/// </summary>
public class AdsClientWrapper : IAdsClient
{
    private readonly ILogger<AdsClientWrapper> _logger;

    public AdsClientWrapper(ILogger<AdsClientWrapper> logger)
    {
        _logger = logger;
    }

    public Task ConnectAsync(AdsConnectionInfo connectionInfo, CancellationToken ct)
    {
        // TODO: Start TcpRouter with unique local AmsNetId
        // TODO: Connect AdsClient to target via AmsNetId.Parse(connectionInfo.AmsNetId), connectionInfo.AdsPort
        throw new NotImplementedException();
    }

    public Task<PlcVariableValueDto> ReadVariableAsync(string variablePath, CancellationToken ct)
    {
        // TODO: CreateVariableHandle → ReadAny → DeleteVariableHandle
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<PlcVariableValueDto>> ReadVariablesBatchAsync(
        IReadOnlyList<string> variablePaths, CancellationToken ct)
    {
        // TODO: Use ADS Sum Commands for batch reads (max 500 per call)
        throw new NotImplementedException();
    }

    public Task SubscribeAsync(AdsVariableSubscription subscription, Action<PlcVariableValueDto> callback, CancellationToken ct)
    {
        // TODO: AddDeviceNotificationEx with AdsTransMode.OnChange
        // Max 1024 notifications per connection
        throw new NotImplementedException();
    }

    public Task UnsubscribeAsync(string variablePath, CancellationToken ct)
    {
        // TODO: DeleteDeviceNotification for the given variable
        throw new NotImplementedException();
    }

    public Task<PlcStateDto> ReadPlcStateAsync(CancellationToken ct)
    {
        // TODO: client.ReadState() → map AdsState to PlcAdsState
        throw new NotImplementedException();
    }

    public Task DisconnectAsync(CancellationToken ct)
    {
        // TODO: Disconnect AdsClient, dispose TcpRouter
        throw new NotImplementedException();
    }

    public ValueTask DisposeAsync()
    {
        // TODO: Clean up AdsClient and TcpRouter resources
        _logger.LogInformation("Disposing ADS client wrapper");
        return ValueTask.CompletedTask;
    }
}
