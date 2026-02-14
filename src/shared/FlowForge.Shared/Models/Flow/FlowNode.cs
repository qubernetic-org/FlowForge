// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Flow;

public record FlowNode
{
    public string Id { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public NodePosition Position { get; init; } = new();
    public Dictionary<string, object?> Parameters { get; init; } = [];
}
