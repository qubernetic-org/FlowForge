// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class GenerateCodeStep : IBuildStep
{
    public string Name => "GenerateCode";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Translate flow nodes to IEC 61131-3 ST, populate POUs/GVLs/DUTs via ITcSmTreeItem.CreateChild()
        throw new NotImplementedException();
    }
}
