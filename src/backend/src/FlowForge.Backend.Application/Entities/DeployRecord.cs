// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Deploy;

namespace FlowForge.Backend.Application.Entities;

public class DeployRecord
{
    public Guid Id { get; set; }
    public Guid BuildJobId { get; set; }
    public string TargetAmsNetId { get; set; } = string.Empty;
    public DeployStatus Status { get; set; }
    public string RequestedBy { get; set; } = string.Empty;
    public string? ApprovedBy { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }

    public BuildJob? BuildJob { get; set; }
}
