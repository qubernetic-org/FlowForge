// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.Backend.Application.Validation;
using FlowForge.Shared.Models.Flow;
using Xunit;

namespace FlowForge.Backend.Application.Tests;

public class FlowDocumentValidatorTests
{
    [Fact]
    public void Validate_EmptyDocument_ShouldReturnNoErrors()
    {
        var validator = new FlowDocumentValidator();
        var doc = new FlowDocument();

        var errors = validator.Validate(doc);

        errors.Should().BeEmpty();
    }
}
