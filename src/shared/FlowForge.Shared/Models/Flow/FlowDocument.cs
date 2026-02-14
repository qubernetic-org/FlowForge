// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Flow;

public record FlowDocument
{
    public string Name { get; init; } = string.Empty;
    public string Version { get; init; } = string.Empty;
    public IReadOnlyList<FlowNode> Nodes { get; init; } = [];
    public IReadOnlyList<FlowConnection> Connections { get; init; } = [];
    public Dictionary<string, string> Metadata { get; init; } = [];
}
