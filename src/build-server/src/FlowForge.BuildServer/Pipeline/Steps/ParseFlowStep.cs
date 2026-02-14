// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class ParseFlowStep : IBuildStep
{
    public string Name => "ParseFlow";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Deserialize flow/program.json from cloned repo into FlowDocument
        throw new NotImplementedException();
    }
}
