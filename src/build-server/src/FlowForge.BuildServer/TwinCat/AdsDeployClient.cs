// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;

namespace FlowForge.BuildServer.TwinCat;

/// <summary>
/// Wraps Beckhoff.TwinCAT.Ads.AdsClient for deploy operations.
/// Uses the native TwinCAT router (no TcpRouter needed on Windows).
/// </summary>
public class AdsDeployClient : IAdsDeployClient
{
    private readonly ILogger<AdsDeployClient> _logger;

    public AdsDeployClient(ILogger<AdsDeployClient> logger)
    {
        _logger = logger;
    }

    public Task ConnectAsync(AdsConnectionInfo connectionInfo, CancellationToken ct)
    {
        // TODO: Connect via AmsNetId.Parse(connectionInfo.AmsNetId), connectionInfo.AdsPort
        throw new NotImplementedException();
    }

    public Task<PlcStateDto> ReadPlcStateAsync(CancellationToken ct)
    {
        // TODO: client.ReadState() → map AdsState to PlcAdsState
        throw new NotImplementedException();
    }

    public Task SwitchToConfigModeAsync(CancellationToken ct)
    {
        // TODO: client.WriteControl(new StateInfo(AdsState.Reconfig, 0))
        throw new NotImplementedException();
    }

    public Task StartRestartTwinCatAsync(CancellationToken ct)
    {
        // TODO: client.WriteControl(new StateInfo(AdsState.Run, 0))
        throw new NotImplementedException();
    }

    public Task<string> ReadTwinCatVersionAsync(CancellationToken ct)
    {
        // TODO: Read TwinCAT version from target via ADS device info
        throw new NotImplementedException();
    }

    public Task DisconnectAsync(CancellationToken ct)
    {
        // TODO: Disconnect AdsClient
        throw new NotImplementedException();
    }

    public ValueTask DisposeAsync()
    {
        _logger.LogInformation("Disposing ADS deploy client");
        return ValueTask.CompletedTask;
    }
}
