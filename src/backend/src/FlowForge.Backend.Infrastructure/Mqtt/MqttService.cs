// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Infrastructure.Mqtt;

public class MqttService : IMqttService
{
    public Task PublishAsync(string topic, string payload, CancellationToken ct)
    {
        // TODO: Implement using MQTTnet
        throw new NotImplementedException();
    }

    public Task SubscribeAsync(string topic, Func<string, string, Task> handler, CancellationToken ct)
    {
        // TODO: Implement using MQTTnet
        throw new NotImplementedException();
    }

    public Task UnsubscribeAsync(string topic, CancellationToken ct)
    {
        // TODO: Implement using MQTTnet
        throw new NotImplementedException();
    }
}
