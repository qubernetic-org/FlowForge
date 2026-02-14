// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Application.Interfaces.Services;
using FlowForge.Shared.Models.Deploy;

namespace FlowForge.Backend.Application.Services;

public class DeployService
{
    private readonly IDeployRecordRepository _deployRecordRepository;
    private readonly IPlcTargetRepository _targetRepository;
    private readonly IMqttService _mqttService;

    public DeployService(
        IDeployRecordRepository deployRecordRepository,
        IPlcTargetRepository targetRepository,
        IMqttService mqttService)
    {
        _deployRecordRepository = deployRecordRepository;
        _targetRepository = targetRepository;
        _mqttService = mqttService;
    }

    // TODO: RequestDeployAsync(DeployRequestDto) — validate target, check deploy lock, create record, queue job
    // TODO: ApproveDeployAsync(Guid deployId, string approverId) — 4-eyes approval for production targets
    // TODO: GetDeployStatusAsync(Guid deployId) — return current deploy status
}
