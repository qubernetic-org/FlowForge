// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Application.Interfaces.Services;

public interface IDockerService
{
    Task<string> CreateMonitorContainerAsync(string sessionId, string targetAmsNetId, string authToken, CancellationToken ct = default);
    Task StartContainerAsync(string containerId, CancellationToken ct = default);
    Task StopContainerAsync(string containerId, CancellationToken ct = default);
    Task RemoveContainerAsync(string containerId, CancellationToken ct = default);
}
