// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;
using FlowForge.Shared.Models.Monitor;

namespace FlowForge.MonitorServer.Services;

/// <summary>
/// ADS client for reading PLC variables and subscribing to value changes.
/// Wraps Beckhoff.TwinCAT.Ads.AdsClient with TcpRouter for Linux/Docker.
/// </summary>
public interface IAdsClient : IAsyncDisposable
{
    Task ConnectAsync(AdsConnectionInfo connectionInfo, CancellationToken ct = default);
    Task<PlcVariableValueDto> ReadVariableAsync(string variablePath, CancellationToken ct = default);
    Task<IReadOnlyList<PlcVariableValueDto>> ReadVariablesBatchAsync(
        IReadOnlyList<string> variablePaths, CancellationToken ct = default);
    Task SubscribeAsync(AdsVariableSubscription subscription, Action<PlcVariableValueDto> callback, CancellationToken ct = default);
    Task UnsubscribeAsync(string variablePath, CancellationToken ct = default);
    Task<PlcStateDto> ReadPlcStateAsync(CancellationToken ct = default);
    Task DisconnectAsync(CancellationToken ct = default);
}
