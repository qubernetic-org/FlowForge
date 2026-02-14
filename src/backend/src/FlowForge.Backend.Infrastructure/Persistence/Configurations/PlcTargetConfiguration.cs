// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FlowForge.Backend.Infrastructure.Persistence.Configurations;

public class PlcTargetConfiguration : IEntityTypeConfiguration<PlcTarget>
{
    public void Configure(EntityTypeBuilder<PlcTarget> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.AmsNetId).IsRequired().HasMaxLength(50);
        builder.HasOne(t => t.Group).WithMany(g => g.Targets).HasForeignKey(t => t.GroupId);
        builder.HasIndex(t => t.AmsNetId).IsUnique();
    }
}
