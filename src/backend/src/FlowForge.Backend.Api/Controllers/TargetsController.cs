// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlowForge.Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TargetsController : ControllerBase
{
    private readonly TargetService _targetService;

    public TargetsController(TargetService targetService)
    {
        _targetService = targetService;
    }
}
