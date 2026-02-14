// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Ads;

public record AdsConnectionInfo
{
    public string AmsNetId { get; init; } = string.Empty;
    public int AdsPort { get; init; } = 851;

    /// <summary>
    /// Hostname or IP of the target PLC. Used by TcpRouter on non-TwinCAT
    /// systems (e.g. Linux Docker containers) to establish ADS-over-TCP.
    /// </summary>
    public string? TargetHostname { get; init; }

    /// <summary>TCP port for the ADS router on the target (default 48898).</summary>
    public int TcpPort { get; init; } = 48898;
}
