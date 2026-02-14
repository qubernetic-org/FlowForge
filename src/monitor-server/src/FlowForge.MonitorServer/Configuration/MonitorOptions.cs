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

    /// <summary>MQTT broker host for ADS over MQTT.</summary>
    public string MqttHost { get; set; } = "mqtt-broker";

    /// <summary>MQTT broker port.</summary>
    public int MqttPort { get; set; } = 1883;

    /// <summary>Target PLC AMS Net ID to monitor.</summary>
    public string TargetAmsNetId { get; set; } = string.Empty;
}