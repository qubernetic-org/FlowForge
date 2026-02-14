// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Application.Services;

public class MonitorService
{
    private readonly IDockerService _dockerService;

    public MonitorService(IDockerService dockerService)
    {
        _dockerService = dockerService;
    }
}
