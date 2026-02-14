// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Application.Entities;

public class PlcTarget
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AmsNetId { get; set; } = string.Empty;
    public string TwinCatVersion { get; set; } = string.Empty;
    public List<string> Labels { get; set; } = [];
    public Guid? GroupId { get; set; }
    public bool IsProductionTarget { get; set; }
    public bool DeployLocked { get; set; }

    public TargetGroup? Group { get; set; }
}
