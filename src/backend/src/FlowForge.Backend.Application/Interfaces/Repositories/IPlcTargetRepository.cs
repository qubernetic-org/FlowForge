// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;

namespace FlowForge.Backend.Application.Interfaces.Repositories;

public interface IPlcTargetRepository
{
    Task<PlcTarget?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<PlcTarget>> GetAllAsync(CancellationToken ct = default);
    Task<PlcTarget> AddAsync(PlcTarget target, CancellationToken ct = default);
    Task UpdateAsync(PlcTarget target, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
