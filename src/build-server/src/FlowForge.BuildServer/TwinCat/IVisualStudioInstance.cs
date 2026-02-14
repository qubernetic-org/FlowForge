// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

public interface IVisualStudioInstance : IDisposable
{
    void CreateSolution(string solutionPath);
    void OpenSolution(string solutionPath);
    bool Build();
    IReadOnlyList<string> GetBuildErrors();
    void Close();
}
