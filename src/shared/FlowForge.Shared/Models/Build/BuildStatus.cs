// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Build;

public enum BuildStatus
{
    Pending,
    Claimed,
    InProgress,
    Completed,
    Failed
}
