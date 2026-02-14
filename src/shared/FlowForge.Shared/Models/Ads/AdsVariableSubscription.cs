// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Ads;

public record AdsVariableSubscription
{
    public string VariablePath { get; init; } = string.Empty;
    public int CycleTimeMs { get; init; } = 100;
    public int MaxDelayMs { get; init; }
}
