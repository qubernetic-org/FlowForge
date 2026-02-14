// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen.NodeTranslators;

public class ComparisonTranslator : INodeTranslator
{
    public string NodeType => "comparison";

    public NodeTranslation Translate(FlowNode node, IReadOnlyList<FlowConnection> connections)
    {
        // TODO: Generate GT/LT/EQ/GE/LE comparison expressions
        throw new NotImplementedException();
    }
}
