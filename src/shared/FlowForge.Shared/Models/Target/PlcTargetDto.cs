// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;

namespace FlowForge.Shared.Models.Target;

public record PlcTargetDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string AmsNetId { get; init; } = string.Empty;
    public string TwinCatVersion { get; init; } = string.Empty;
    public IReadOnlyList<string> Labels { get; init; } = [];
    public Guid? GroupId { get; init; }
    public bool IsProductionTarget { get; init; }
    public bool DeployLocked { get; init; }
    public PlcAdsState? CurrentState { get; init; }
}
