// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline.Steps;

public class CloneRepoStep : IBuildStep
{
    public string Name => "CloneRepo";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        // TODO: Git clone/fetch via LibGit2Sharp with user credentials from job
        throw new NotImplementedException();
    }
}
