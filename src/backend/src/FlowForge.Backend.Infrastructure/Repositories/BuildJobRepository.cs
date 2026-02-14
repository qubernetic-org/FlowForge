// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Infrastructure.Persistence;
using FlowForge.Shared.Models.Build;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Repositories;

public class BuildJobRepository : IBuildJobRepository
{
    private readonly AppDbContext _db;

    public BuildJobRepository(AppDbContext db) => _db = db;

    public async Task<BuildJob?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await _db.BuildJobs.Include(b => b.Project).FirstOrDefaultAsync(b => b.Id == id, ct);

    public async Task<IReadOnlyList<BuildJob>> GetByProjectIdAsync(Guid projectId, CancellationToken ct) =>
        await _db.BuildJobs.Where(b => b.ProjectId == projectId).OrderByDescending(b => b.CreatedAt).ToListAsync(ct);

    public async Task<BuildJob> AddAsync(BuildJob job, CancellationToken ct)
    {
        _db.BuildJobs.Add(job);
        await _db.SaveChangesAsync(ct);
        return job;
    }

    public async Task UpdateAsync(BuildJob job, CancellationToken ct)
    {
        _db.BuildJobs.Update(job);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<BuildJob?> ClaimNextAsync(string twinCatVersion, string claimedBy, CancellationToken ct)
    {
        // TODO: Use raw SQL with FOR UPDATE SKIP LOCKED for proper queue semantics
        var job = await _db.BuildJobs
            .Where(b => b.Status == BuildStatus.Pending && b.TwinCatVersion == twinCatVersion)
            .OrderBy(b => b.CreatedAt)
            .FirstOrDefaultAsync(ct);

        if (job is null) return null;

        job.Status = BuildStatus.Claimed;
        job.ClaimedBy = claimedBy;
        job.StartedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
        return job;
    }
}
