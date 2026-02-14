// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Ads;

public record PlcStateDto
{
    public string AmsNetId { get; init; } = string.Empty;
    public PlcAdsState State { get; init; }
    public DateTimeOffset Timestamp { get; init; }

    public bool IsRunning => State == PlcAdsState.Run;
    public bool IsInConfigMode => State is PlcAdsState.Config or PlcAdsState.Reconfig;
    public bool IsSafeForDeploy => State is PlcAdsState.Stop or PlcAdsState.Config;
}
