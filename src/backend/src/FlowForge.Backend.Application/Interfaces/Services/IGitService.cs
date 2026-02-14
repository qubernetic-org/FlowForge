// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Application.Interfaces.Services;

public interface IGitService
{
    Task<string> CloneOrFetchAsync(string repoUrl, string localPath, string branch, CancellationToken ct = default);
    Task<string> CommitAndPushAsync(string localPath, string message, string userName, string userEmail, CancellationToken ct = default);
    Task<string> CreateRepoAsync(string name, string description, CancellationToken ct = default);
}
