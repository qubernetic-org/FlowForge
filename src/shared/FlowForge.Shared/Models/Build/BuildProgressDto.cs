// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Build;

public record BuildProgressDto
{
    public Guid BuildId { get; init; }
    public string Stage { get; init; } = string.Empty;
    public int Percentage { get; init; }
    public string Message { get; init; } = string.Empty;
}
