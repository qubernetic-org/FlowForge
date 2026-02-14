// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Repositories;

public class PlcTargetRepository : IPlcTargetRepository
{
    private readonly AppDbContext _db;

    public PlcTargetRepository(AppDbContext db) => _db = db;

    public async Task<PlcTarget?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await _db.PlcTargets.Include(t => t.Group).FirstOrDefaultAsync(t => t.Id == id, ct);

    public async Task<IReadOnlyList<PlcTarget>> GetAllAsync(CancellationToken ct) =>
        await _db.PlcTargets.Include(t => t.Group).ToListAsync(ct);

    public async Task<PlcTarget> AddAsync(PlcTarget target, CancellationToken ct)
    {
        _db.PlcTargets.Add(target);
        await _db.SaveChangesAsync(ct);
        return target;
    }

    public async Task UpdateAsync(PlcTarget target, CancellationToken ct)
    {
        _db.PlcTargets.Update(target);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var target = await _db.PlcTargets.FindAsync([id], ct);
        if (target is not null)
        {
            _db.PlcTargets.Remove(target);
            await _db.SaveChangesAsync(ct);
        }
    }
}
