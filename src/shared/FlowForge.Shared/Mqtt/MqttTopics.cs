// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Mqtt;

public static class MqttTopics
{
    private const string Prefix = "flowforge";

    public static string BuildNotify(string twinCatVersion) =>
        $"{Prefix}/build/notify/{twinCatVersion}";

    public static string BuildProgress(Guid buildId) =>
        $"{Prefix}/build/progress/{buildId}";

    public static string DeployRequest(string targetId) =>
        $"{Prefix}/deploy/request/{targetId}";

    public static string AdsRead(string amsNetId) =>
        $"{Prefix}/ads/read/{amsNetId}";

    public static string AdsWrite(string amsNetId) =>
        $"{Prefix}/ads/write/{amsNetId}";

    public static string AdsNotification(string amsNetId) =>
        $"{Prefix}/ads/notification/{amsNetId}";
}
