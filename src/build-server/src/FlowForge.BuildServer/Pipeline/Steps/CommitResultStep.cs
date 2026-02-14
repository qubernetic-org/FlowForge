// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class CommitResultStep : IBuildStep
{
    public string Name => "CommitResult";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Git commit generated .tsproj + ST files, push to project repo
        throw new NotImplementedException();
    }
}
