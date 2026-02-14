// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<BuildJob> BuildJobs => Set<BuildJob>();
    public DbSet<PlcTarget> PlcTargets => Set<PlcTarget>();
    public DbSet<TargetGroup> TargetGroups => Set<TargetGroup>();
    public DbSet<DeployRecord> DeployRecords => Set<DeployRecord>();
    public DbSet<UserToken> UserTokens => Set<UserToken>();
    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
