// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.BuildServer.CodeGen.NodeTranslators;
using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen;

public class StructuredTextGenerator : ICodeGenerator
{
    private readonly IEnumerable<INodeTranslator> _translators;

    public StructuredTextGenerator(IEnumerable<INodeTranslator> translators)
    {
        _translators = translators;
    }

    public GenerateResult Generate(FlowDocument flow)
    {
        // TODO: Topological sort nodes, translate each via matching INodeTranslator,
        //       generate variable declarations, wire connections as assignments
        throw new NotImplementedException();
    }
}
