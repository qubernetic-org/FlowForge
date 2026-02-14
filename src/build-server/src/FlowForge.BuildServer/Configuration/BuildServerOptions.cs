// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Configuration;

/// <summary>
/// Configuration bound to the "BuildServer" section in appsettings.
/// </summary>
public class BuildServerOptions
{
    public const string Section = "BuildServer";

    /// <summary>Backend API base URL for REST polling.</summary>
    public string BackendApiUrl { get; set; } = "http://localhost:5000";

    /// <summary>TwinCAT version this build server instance handles.</summary>
    public string TwinCatVersion { get; set; } = "3.1.4024";

    /// <summary>Local directory for cloned project repos.</summary>
    public string WorkspacePath { get; set; } = @"C:\FlowForge\workspace";

    /// <summary>MQTT broker host for build notifications and ADS over MQTT.</summary>
    public string MqttHost { get; set; } = "localhost";

    /// <summary>MQTT broker port.</summary>
    public int MqttPort { get; set; } = 1883;
}