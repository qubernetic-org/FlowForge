// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Build;

public record BuildJobDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string ProjectName { get; init; } = string.Empty;
    public string RepoUrl { get; init; } = string.Empty;
    public string Branch { get; init; } = "main";
    public string TwinCatVersion { get; init; } = string.Empty;
    public string RequestedBy { get; init; } = string.Empty;
    public BuildStatus Status { get; init; }
    public bool IncludeDeploy { get; init; }
    public string? TargetAmsNetId { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
