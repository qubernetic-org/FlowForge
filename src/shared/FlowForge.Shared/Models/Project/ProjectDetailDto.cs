// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.Shared.Models.Project;

public record ProjectDetailDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string RepoUrl { get; init; } = string.Empty;
    public string Branch { get; init; } = "main";
    public string? LastCommitSha { get; init; }
    public FlowDocument? Flow { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
}
