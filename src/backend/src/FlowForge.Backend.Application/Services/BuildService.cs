// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Application.Services;

public class BuildService
{
    private readonly IBuildJobRepository _buildJobRepository;
    private readonly IMqttService _mqttService;

    public BuildService(IBuildJobRepository buildJobRepository, IMqttService mqttService)
    {
        _buildJobRepository = buildJobRepository;
        _mqttService = mqttService;
    }
}
