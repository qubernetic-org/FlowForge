// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Deploy;

public record DeployRequestDto
{
    public Guid ProjectId { get; init; }
    public string TargetAmsNetId { get; init; } = string.Empty;
    public string? ApproverId { get; init; }
    public int AdsPort { get; init; } = 851;
}
