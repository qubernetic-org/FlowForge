// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Flow;

public record FlowPort
{
    public string NodeId { get; init; } = string.Empty;
    public string PortName { get; init; } = string.Empty;
}
