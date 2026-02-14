// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;

namespace FlowForge.BuildServer.TwinCat;

/// <summary>
/// ADS client for deploy-time operations on target PLCs.
/// Uses the native TwinCAT router on the Windows build server.
/// </summary>
public interface IAdsDeployClient : IAsyncDisposable
{
    Task ConnectAsync(AdsConnectionInfo connectionInfo, CancellationToken ct = default);
    Task<PlcStateDto> ReadPlcStateAsync(CancellationToken ct = default);
    Task SwitchToConfigModeAsync(CancellationToken ct = default);
    Task StartRestartTwinCatAsync(CancellationToken ct = default);
    Task<string> ReadTwinCatVersionAsync(CancellationToken ct = default);
    Task DisconnectAsync(CancellationToken ct = default);
}
