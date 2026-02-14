// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Deploy;

public record DeployResultDto
{
    public Guid DeployId { get; init; }
    public bool Success { get; init; }
    public string? Error { get; init; }
    public DateTimeOffset CompletedAt { get; init; }
}
