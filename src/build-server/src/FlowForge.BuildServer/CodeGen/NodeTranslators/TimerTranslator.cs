// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen.NodeTranslators;

public class TimerTranslator : INodeTranslator
{
    public string NodeType => "timer";

    public NodeTranslation Translate(FlowNode node, IReadOnlyList<FlowConnection> connections)
    {
        // TODO: Generate TON/TOF/TP timer function block instance + call
        throw new NotImplementedException();
    }
}
