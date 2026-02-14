// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Application.Services;

public class ProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IGitService _gitService;

    public ProjectService(IProjectRepository projectRepository, IGitService gitService)
    {
        _projectRepository = projectRepository;
        _gitService = gitService;
    }
}
