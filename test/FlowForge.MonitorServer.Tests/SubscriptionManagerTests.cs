// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FluentAssertions;
using FlowForge.MonitorServer.Services;
using Xunit;

namespace FlowForge.MonitorServer.Tests;

public class SubscriptionManagerTests
{
    [Fact]
    public void AddSubscription_ShouldTrackVariablePath()
    {
        var manager = new SubscriptionManager();
        manager.AddSubscription("conn-1", "GVL_Main.bRunning");

        var subs = manager.GetSubscriptions("conn-1");

        subs.Should().ContainSingle().Which.Should().Be("GVL_Main.bRunning");
    }

    [Fact]
    public void RemoveAllSubscriptions_ShouldClearConnection()
    {
        var manager = new SubscriptionManager();
        manager.AddSubscription("conn-1", "GVL_Main.bRunning");
        manager.AddSubscription("conn-1", "GVL_Main.nCounter");

        manager.RemoveAllSubscriptions("conn-1");

        manager.GetSubscriptions("conn-1").Should().BeEmpty();
    }
}
