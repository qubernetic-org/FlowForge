// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FlowForge.Backend.Infrastructure.Persistence.Configurations;

public class TargetGroupConfiguration : IEntityTypeConfiguration<TargetGroup>
{
    public void Configure(EntityTypeBuilder<TargetGroup> builder)
    {
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Name).IsRequired().HasMaxLength(200);
    }
}
