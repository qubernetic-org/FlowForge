// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Api.Configuration;

public class MqttOptions
{
    public const string Section = "Mqtt";

    public string Host { get; set; } = "mqtt-broker";
    public int Port { get; set; } = 1883;
    public string? ClientId { get; set; }
}
