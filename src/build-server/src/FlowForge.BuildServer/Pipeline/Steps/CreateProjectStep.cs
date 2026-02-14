// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class CreateProjectStep : IBuildStep
{
    public string Name => "CreateProject";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Create TwinCAT solution via DTE, add PLC project from template via ITcSmTreeItem.CreateChild()
        throw new NotImplementedException();
    }
}
