// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class ValidateFlowStep : IBuildStep
{
    public string Name => "ValidateFlow";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Structural validation — connections, port types, cycle detection
        throw new NotImplementedException();
    }
}
