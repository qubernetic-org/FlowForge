// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Monitor;

namespace FlowForge.MonitorServer.Hubs;

public interface IPlcDataHubClient
{
    Task ReceiveVariableValues(IReadOnlyList<PlcVariableValueDto> values);
    Task ReceiveConnectionStatus(string status);
    Task ReceiveError(string error);
}
