// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Repositories;

public class DeployRecordRepository : IDeployRecordRepository
{
    private readonly AppDbContext _db;

    public DeployRecordRepository(AppDbContext db) => _db = db;

    public async Task<DeployRecord?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await _db.DeployRecords.Include(d => d.BuildJob).FirstOrDefaultAsync(d => d.Id == id, ct);

    public async Task<IReadOnlyList<DeployRecord>> GetByBuildJobIdAsync(Guid buildJobId, CancellationToken ct) =>
        await _db.DeployRecords.Where(d => d.BuildJobId == buildJobId).ToListAsync(ct);

    public async Task<DeployRecord> AddAsync(DeployRecord record, CancellationToken ct)
    {
        _db.DeployRecords.Add(record);
        await _db.SaveChangesAsync(ct);
        return record;
    }

    public async Task UpdateAsync(DeployRecord record, CancellationToken ct)
    {
        _db.DeployRecords.Update(record);
        await _db.SaveChangesAsync(ct);
    }
}
