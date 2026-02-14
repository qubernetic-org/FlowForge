// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Build;

namespace FlowForge.Backend.Application.Entities;

public class BuildJob
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string TwinCatVersion { get; set; } = string.Empty;
    public BuildStatus Status { get; set; }
    public bool IncludeDeploy { get; set; }
    public string? TargetAmsNetId { get; set; }
    public string RequestedBy { get; set; } = string.Empty;
    public string? ClaimedBy { get; set; }
    public string? CommitSha { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }

    public Project? Project { get; set; }
}
