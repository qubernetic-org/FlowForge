// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class CompileStep : IBuildStep
{
    public string Name => "Compile";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: DTE.Solution.SolutionBuild.Build(true) + collect errors from ErrorList
        throw new NotImplementedException();
    }
}
