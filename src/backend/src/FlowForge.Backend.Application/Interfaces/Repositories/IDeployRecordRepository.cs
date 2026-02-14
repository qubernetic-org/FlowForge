// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;

namespace FlowForge.Backend.Application.Interfaces.Repositories;

public interface IDeployRecordRepository
{
    Task<DeployRecord?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<DeployRecord>> GetByBuildJobIdAsync(Guid buildJobId, CancellationToken ct = default);
    Task<DeployRecord> AddAsync(DeployRecord record, CancellationToken ct = default);
    Task UpdateAsync(DeployRecord record, CancellationToken ct = default);
}
