// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Monitor;

public record MonitorSessionDto
{
    public string SessionId { get; init; } = string.Empty;
    public string SignalREndpoint { get; init; } = string.Empty;
    public string AuthToken { get; init; } = string.Empty;
    public string TargetAmsNetId { get; init; } = string.Empty;
}
