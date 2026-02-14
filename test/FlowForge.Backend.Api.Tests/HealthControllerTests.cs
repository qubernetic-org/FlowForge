// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.Backend.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace FlowForge.Backend.Api.Tests;

public class HealthControllerTests
{
    [Fact]
    public void Get_ShouldReturnOk()
    {
        var controller = new HealthController();

        var result = controller.Get();

        result.Should().BeOfType<OkObjectResult>();
    }
}
