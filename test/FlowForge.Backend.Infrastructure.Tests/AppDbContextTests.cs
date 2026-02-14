// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FlowForge.Backend.Infrastructure.Tests;

public class AppDbContextTests
{
    [Fact]
    public void AppDbContext_ShouldCreateSuccessfully()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        using var context = new AppDbContext(options);

        context.Should().NotBeNull();
        context.Projects.Should().NotBeNull();
    }
}
