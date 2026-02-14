// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class ConfigureTasksStep : IBuildStep
{
    public string Name => "ConfigureTasks";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Create realtime tasks under TIRT, link PLC programs to tasks
        throw new NotImplementedException();
    }
}
