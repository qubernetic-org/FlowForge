// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Flow;

public record FlowConnection
{
    public FlowPort From { get; init; } = new();
    public FlowPort To { get; init; } = new();
}
