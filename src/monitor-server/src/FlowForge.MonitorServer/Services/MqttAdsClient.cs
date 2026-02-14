// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Monitor;

namespace FlowForge.MonitorServer.Services;

public class MqttAdsClient : IMqttAdsClient
{
    public Task ConnectAsync(CancellationToken ct)
    {
        // TODO: Connect to MQTT broker using MQTTnet
        throw new NotImplementedException();
    }

    public Task<PlcVariableValueDto> ReadVariableAsync(string variablePath, CancellationToken ct)
    {
        // TODO: Publish ADS read request via MQTT, await response
        throw new NotImplementedException();
    }

    public Task SubscribeAsync(string variablePath, Action<PlcVariableValueDto> callback, CancellationToken ct)
    {
        // TODO: Register ADS subscription via MQTT
        throw new NotImplementedException();
    }

    public Task UnsubscribeAsync(string variablePath, CancellationToken ct)
    {
        // TODO: Unregister ADS subscription
        throw new NotImplementedException();
    }

    public Task DisconnectAsync(CancellationToken ct)
    {
        // TODO: Disconnect from MQTT broker
        throw new NotImplementedException();
    }
}
