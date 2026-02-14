// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class DeployStep : IBuildStep
{
    public string Name => "Deploy";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: ActivateConfiguration() + StartRestartTwinCAT() via ITcSysManager (conditional — deploy jobs only)
        throw new NotImplementedException();
    }
}
