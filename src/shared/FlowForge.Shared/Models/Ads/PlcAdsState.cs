// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Ads;

/// <summary>
/// Mirrors TwinCAT.Ads.AdsState for use in shared DTOs without requiring a
/// Beckhoff NuGet dependency in the Shared library.
/// See: https://infosys.beckhoff.com/content/1033/tc3_adsnetref/7313023115.html
/// </summary>
public enum PlcAdsState
{
    Invalid = 0,
    Idle = 1,
    Reset = 2,
    Init = 3,
    Start = 4,
    Run = 5,
    Stop = 6,
    SaveConfig = 7,
    LoadConfig = 8,
    PowerFailure = 9,
    PowerGood = 10,
    Error = 11,
    Shutdown = 12,
    Suspend = 13,
    Resume = 14,
    Config = 15,
    Reconfig = 16
}
