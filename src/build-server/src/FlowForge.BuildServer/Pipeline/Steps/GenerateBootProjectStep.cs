// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class GenerateBootProjectStep : IBuildStep
{
    public string Name => "GenerateBootProject";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: ITcPlcIECProject.GenerateBootProject(true) + CheckAllObjects()
        throw new NotImplementedException();
    }
}
