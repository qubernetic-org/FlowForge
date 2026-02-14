// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Pipeline;

public interface IBuildStep
{
    string Name { get; }
    Task ExecuteAsync(BuildContext context, CancellationToken ct);
}
