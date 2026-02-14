// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Build;

public record BuildResultDto
{
    public Guid BuildId { get; init; }
    public bool Success { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = [];
    public string? CommitSha { get; init; }
    public DateTimeOffset CompletedAt { get; init; }
}
