// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Shared.Models.Monitor;

public record PlcVariableValueDto
{
    public string Path { get; init; } = string.Empty;
    public object? Value { get; init; }
    public string DataType { get; init; } = string.Empty;
    public DateTimeOffset Timestamp { get; init; }
}
