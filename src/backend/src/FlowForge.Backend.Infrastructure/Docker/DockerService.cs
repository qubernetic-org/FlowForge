// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Infrastructure.Docker;

public class DockerService : IDockerService
{
    private readonly HttpClient _httpClient;

    public DockerService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<string> CreateMonitorContainerAsync(string sessionId, string targetAmsNetId, string authToken, CancellationToken ct)
    {
        // TODO: POST to docker-socket-proxy to create monitor container with Traefik labels
        throw new NotImplementedException();
    }

    public Task StartContainerAsync(string containerId, CancellationToken ct)
    {
        // TODO: POST to docker-socket-proxy
        throw new NotImplementedException();
    }

    public Task StopContainerAsync(string containerId, CancellationToken ct)
    {
        // TODO: POST to docker-socket-proxy
        throw new NotImplementedException();
    }

    public Task RemoveContainerAsync(string containerId, CancellationToken ct)
    {
        // TODO: DELETE to docker-socket-proxy
        throw new NotImplementedException();
    }
}
