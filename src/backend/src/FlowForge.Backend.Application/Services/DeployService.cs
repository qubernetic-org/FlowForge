// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;

namespace FlowForge.Backend.Application.Services;

public class DeployService
{
    private readonly IDeployRecordRepository _deployRecordRepository;
    private readonly IPlcTargetRepository _targetRepository;

    public DeployService(IDeployRecordRepository deployRecordRepository, IPlcTargetRepository targetRepository)
    {
        _deployRecordRepository = deployRecordRepository;
        _targetRepository = targetRepository;
    }
}
