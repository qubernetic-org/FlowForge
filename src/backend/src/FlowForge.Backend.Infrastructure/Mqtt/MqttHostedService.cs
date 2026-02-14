// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FlowForge.Backend.Infrastructure.Mqtt;

public class MqttHostedService : BackgroundService
{
    private readonly ILogger<MqttHostedService> _logger;

    public MqttHostedService(ILogger<MqttHostedService> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // TODO: Connect to MQTT broker and maintain connection
        _logger.LogInformation("MQTT hosted service started");
        await Task.CompletedTask;
    }
}
