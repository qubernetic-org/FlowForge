// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.MonitorServer.Configuration;

/// <summary>
/// Configuration bound to the "Monitor" section in appsettings.
/// Injected by the backend as environment variables at container creation.
/// </summary>
public class MonitorOptions
{
    public const string Section = "Monitor";

    /// <summary>Unique session ID assigned by the backend.</summary>
    public string SessionId { get; set; } = string.Empty;

    /// <summary>Short-lived auth token for frontend SignalR connections.</summary>
    public string AuthToken { get; set; } = string.Empty;

    /// <summary>MQTT broker host for FlowForge internal messaging.</summary>
    public string MqttHost { get; set; } = "mqtt-broker";

    /// <summary>MQTT broker port.</summary>
    public int MqttPort { get; set; } = 1883;

    /// <summary>Target PLC AMS Net ID to monitor.</summary>
    public string TargetAmsNetId { get; set; } = string.Empty;

    /// <summary>Hostname or IP of the target PLC for TcpRouter connection.</summary>
    public string? TargetHostname { get; set; }

    /// <summary>ADS port on the target PLC (default 851 = PLC Runtime 1).</summary>
    public int AdsPort { get; set; } = 851;

    /// <summary>TCP port for the ADS router on the target (default 48898).</summary>
    public int AdsTcpPort { get; set; } = 48898;
}
