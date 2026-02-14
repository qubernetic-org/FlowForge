// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen.NodeTranslators;

public record NodeTranslation(
    IReadOnlyList<string> VariableDeclarations,
    IReadOnlyList<string> BodyStatements,
    IReadOnlyList<string> RequiredLibraries);

public interface INodeTranslator
{
    string NodeType { get; }
    NodeTranslation Translate(FlowNode node, IReadOnlyList<FlowConnection> connections);
}
