// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Monitor;

namespace FlowForge.MonitorServer.Services;

public interface IMqttAdsClient
{
    Task ConnectAsync(CancellationToken ct = default);
    Task<PlcVariableValueDto> ReadVariableAsync(string variablePath, CancellationToken ct = default);
    Task SubscribeAsync(string variablePath, Action<PlcVariableValueDto> callback, CancellationToken ct = default);
    Task UnsubscribeAsync(string variablePath, CancellationToken ct = default);
    Task DisconnectAsync(CancellationToken ct = default);
}
