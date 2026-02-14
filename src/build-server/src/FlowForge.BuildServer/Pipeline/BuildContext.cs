// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Ads;
using FlowForge.Shared.Models.Build;
using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.Pipeline;

public class BuildContext
{
    public required BuildJobDto Job { get; init; }
    public string WorkspacePath { get; set; } = string.Empty;
    public FlowDocument? FlowDocument { get; set; }
    public AdsConnectionInfo? TargetConnectionInfo { get; set; }
    public List<string> GeneratedFiles { get; } = [];
    public List<string> Errors { get; } = [];
    public Dictionary<string, TimeSpan> Timings { get; } = [];
}
