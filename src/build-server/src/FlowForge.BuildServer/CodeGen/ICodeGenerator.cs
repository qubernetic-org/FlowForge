// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.BuildServer.CodeGen;

public record GenerateResult(
    string MainProgram,
    IReadOnlyList<string> FunctionBlocks,
    IReadOnlyList<string> GlobalVariableLists,
    IReadOnlyList<string> DataTypes,
    IReadOnlyList<string> RequiredLibraries);

public interface ICodeGenerator
{
    GenerateResult Generate(FlowDocument flow);
}
