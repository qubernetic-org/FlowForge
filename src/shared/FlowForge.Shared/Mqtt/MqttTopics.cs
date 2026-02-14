// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Mqtt;

/// <summary>
/// MQTT topics for FlowForge internal messaging.
/// ADS communication is handled directly via Beckhoff.TwinCAT.Ads — see doc/ADS_INTEGRATION.md.
/// </summary>
public static class MqttTopics
{
    private const string Prefix = "flowforge";

    public static string BuildNotify(string twinCatVersion) =>
        $"{Prefix}/build/notify/{twinCatVersion}";

    public static string BuildProgress(Guid buildId) =>
        $"{Prefix}/build/progress/{buildId}";

    public static string DeployRequest(string targetId) =>
        $"{Prefix}/deploy/request/{targetId}";

    public static string DeployStatus(Guid deployId) =>
        $"{Prefix}/deploy/status/{deployId}";
}
