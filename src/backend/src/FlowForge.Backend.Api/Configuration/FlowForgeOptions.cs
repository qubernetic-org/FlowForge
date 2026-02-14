// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Api.Configuration;

/// <summary>
/// Application-level configuration bound to the "FlowForge" section in appsettings.
/// </summary>
public class FlowForgeOptions
{
    public const string Section = "FlowForge";

    /// <summary>Base domain used for path-based routing (e.g. flowforge.example.com).</summary>
    public string BaseDomain { get; set; } = "localhost";

    /// <summary>Local directory where project repos are cached.</summary>
    public string RepoStoragePath { get; set; } = "/data/repos";

    /// <summary>Docker socket proxy URL for monitor container management.</summary>
    public string DockerSocketProxyUrl { get; set; } = "http://docker-socket-proxy:2375";

    /// <summary>Monitor container Docker image name.</summary>
    public string MonitorContainerImage { get; set; } = "flowforge-monitor:latest";
}