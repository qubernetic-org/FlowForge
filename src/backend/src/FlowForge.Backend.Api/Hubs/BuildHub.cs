// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.AspNetCore.SignalR;

namespace FlowForge.Backend.Api.Hubs;

/// <summary>
/// SignalR hub for real-time build/deploy status updates.
/// Clients join a build-specific group to receive progress events.
/// </summary>
public class BuildHub : Hub
{
    public async Task JoinBuild(string buildId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"build-{buildId}");
    }

    public async Task LeaveBuild(string buildId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"build-{buildId}");
    }
}