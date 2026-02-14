// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly AppDbContext _db;

    public AuditRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(AuditEntry entry, CancellationToken ct)
    {
        _db.AuditEntries.Add(entry);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<AuditEntry>> GetByEntityAsync(string entityType, string entityId, CancellationToken ct) =>
        await _db.AuditEntries
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync(ct);
}
