// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.BuildServer.Pipeline;
using FlowForge.Shared.Models.Build;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Xunit;

namespace FlowForge.BuildServer.Tests;

public class BuildPipelineTests
{
    [Fact]
    public async Task ExecuteAsync_WithNoSteps_ShouldReturnTrue()
    {
        var pipeline = new BuildPipeline([], NullLogger<BuildPipeline>.Instance);
        var context = new BuildContext
        {
            Job = new BuildJobDto { Id = Guid.NewGuid() }
        };

        var result = await pipeline.ExecuteAsync(context, CancellationToken.None);

        result.Should().BeTrue();
        context.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task ExecuteAsync_WithFailingStep_ShouldReturnFalse()
    {
        var failingStep = Substitute.For<IBuildStep>();
        failingStep.Name.Returns("FailStep");
        failingStep.ExecuteAsync(Arg.Any<BuildContext>(), Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("test error"));

        var pipeline = new BuildPipeline([failingStep], NullLogger<BuildPipeline>.Instance);
        var context = new BuildContext
        {
            Job = new BuildJobDto { Id = Guid.NewGuid() }
        };

        var result = await pipeline.ExecuteAsync(context, CancellationToken.None);

        result.Should().BeFalse();
        context.Errors.Should().ContainSingle().Which.Should().Contain("test error");
    }
}
