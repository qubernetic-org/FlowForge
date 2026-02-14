// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;

namespace FlowForge.Backend.Application.Services;

public class TargetService
{
    private readonly IPlcTargetRepository _targetRepository;

    public TargetService(IPlcTargetRepository targetRepository)
    {
        _targetRepository = targetRepository;
    }

    // TODO: GetTargetsAsync() — list all targets with cached PLC state (PlcAdsState from last known read)
    // TODO: SetDeployLockAsync(Guid targetId, bool locked) — manual deploy lock toggle
    // TODO: IsDeployAllowedAsync(Guid targetId, string userId) — checks lock + production rules + 4-eyes
}
