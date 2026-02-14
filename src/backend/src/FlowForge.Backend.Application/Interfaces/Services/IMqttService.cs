// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Application.Interfaces.Services;

public interface IMqttService
{
    Task PublishAsync(string topic, string payload, CancellationToken ct = default);
    Task SubscribeAsync(string topic, Func<string, string, Task> handler, CancellationToken ct = default);
    Task UnsubscribeAsync(string topic, CancellationToken ct = default);
}
