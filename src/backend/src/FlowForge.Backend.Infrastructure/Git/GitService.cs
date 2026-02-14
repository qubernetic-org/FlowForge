// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Infrastructure.Git;

public class GitService : IGitService
{
    public Task<string> CloneOrFetchAsync(string repoUrl, string localPath, string branch, CancellationToken ct)
    {
        // TODO: Implement using LibGit2Sharp
        throw new NotImplementedException();
    }

    public Task<string> CommitAndPushAsync(string localPath, string message, string userName, string userEmail, CancellationToken ct)
    {
        // TODO: Implement using LibGit2Sharp
        throw new NotImplementedException();
    }

    public Task<string> CreateRepoAsync(string name, string description, CancellationToken ct)
    {
        // TODO: Implement using GitHub API (service user)
        throw new NotImplementedException();
    }
}
