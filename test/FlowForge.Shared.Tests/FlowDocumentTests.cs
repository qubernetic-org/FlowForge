// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.Shared.Models.Flow;
using Xunit;

namespace FlowForge.Shared.Tests;

public class FlowDocumentTests
{
    [Fact]
    public void FlowDocument_DefaultValues_ShouldBeEmpty()
    {
        var doc = new FlowDocument();

        doc.Name.Should().BeEmpty();
        doc.Nodes.Should().BeEmpty();
        doc.Connections.Should().BeEmpty();
    }
}
