// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.MonitorServer.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace FlowForge.MonitorServer.Tests;

public class AdsClientWrapperTests
{
    [Fact]
    public async Task DisposeAsync_ShouldNotThrow()
    {
        var wrapper = new AdsClientWrapper(NullLogger<AdsClientWrapper>.Instance);

        await wrapper.DisposeAsync();
    }
}
