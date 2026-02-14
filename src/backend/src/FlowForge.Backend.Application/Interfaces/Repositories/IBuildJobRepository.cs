// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;

namespace FlowForge.Backend.Application.Interfaces.Repositories;

public interface IBuildJobRepository
{
    Task<BuildJob?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<BuildJob>> GetByProjectIdAsync(Guid projectId, CancellationToken ct = default);
    Task<BuildJob> AddAsync(BuildJob job, CancellationToken ct = default);
    Task UpdateAsync(BuildJob job, CancellationToken ct = default);
    Task<BuildJob?> ClaimNextAsync(string twinCatVersion, string claimedBy, CancellationToken ct = default);
}
