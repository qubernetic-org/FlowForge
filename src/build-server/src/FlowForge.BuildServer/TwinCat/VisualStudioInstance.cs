// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

public class VisualStudioInstance : IVisualStudioInstance
{
    // TODO: Wrap EnvDTE.DTE lifecycle:
    //   - Create via Activator.CreateInstance(Type.GetTypeFromProgID("TcXaeShell.DTE.15.0"))
    //   - Version auto-detection from .sln
    //   - SuppressUI, MainWindow.Visible = false
    //   - Build, error collection, Quit in Dispose

    public void CreateSolution(string solutionPath) => throw new NotImplementedException();
    public void OpenSolution(string solutionPath) => throw new NotImplementedException();
    public bool Build() => throw new NotImplementedException();
    public IReadOnlyList<string> GetBuildErrors() => throw new NotImplementedException();
    public void Close() => throw new NotImplementedException();
    public void Dispose() { /* TODO: DTE.Quit() */ }
}
