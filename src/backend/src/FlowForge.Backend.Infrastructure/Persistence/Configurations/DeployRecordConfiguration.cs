// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FlowForge.Backend.Infrastructure.Persistence.Configurations;

public class DeployRecordConfiguration : IEntityTypeConfiguration<DeployRecord>
{
    public void Configure(EntityTypeBuilder<DeployRecord> builder)
    {
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Status).HasConversion<string>();
        builder.HasOne(d => d.BuildJob).WithMany().HasForeignKey(d => d.BuildJobId);
    }
}
