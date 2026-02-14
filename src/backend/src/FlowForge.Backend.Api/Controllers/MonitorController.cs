// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlowForge.Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MonitorController : ControllerBase
{
    private readonly MonitorService _monitorService;

    public MonitorController(MonitorService monitorService)
    {
        _monitorService = monitorService;
    }
}
