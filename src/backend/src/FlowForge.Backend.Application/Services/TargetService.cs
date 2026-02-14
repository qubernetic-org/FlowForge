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
}
