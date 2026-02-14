// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlowForge.Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeployController : ControllerBase
{
    private readonly DeployService _deployService;

    public DeployController(DeployService deployService)
    {
        _deployService = deployService;
    }
}
