// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Deploy;

public enum DeployStatus
{
    Pending,
    AwaitingApproval,
    Approved,
    InProgress,
    Completed,
    Failed,
    Rejected
}
