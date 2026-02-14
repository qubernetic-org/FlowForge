// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Services;

/// <summary>
/// MQTT handler for FlowForge internal messaging only.
/// ADS communication uses Beckhoff.TwinCAT.Ads directly — see doc/ADS_INTEGRATION.md.
/// </summary>
public class MqttHandler
{
    // TODO: MQTT subscribe for build notifications, publish progress/deploy status updates
}
