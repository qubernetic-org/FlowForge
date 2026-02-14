// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen.NodeTranslators;

public class CounterTranslator : INodeTranslator
{
    public string NodeType => "counter";

    public NodeTranslation Translate(FlowNode node, IReadOnlyList<FlowConnection> connections)
    {
        // TODO: Generate CTU/CTD/CTUD counter function block instance + call
        throw new NotImplementedException();
    }
}
