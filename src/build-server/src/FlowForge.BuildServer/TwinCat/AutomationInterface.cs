// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

public class AutomationInterface : IAutomationInterface
{
    // TODO: Wrap ITcSysManager operations:
    //   - LookupTreeItem(path) for tree navigation
    //   - CreateChild(name, subType, vInfo, templatePath) for child creation
    //   - ActivateConfiguration() for deployment
    //   - StartRestartTwinCAT() for runtime control

    public void CreatePlcProject(string name, string? templatePath) => throw new NotImplementedException();
    public void AddPou(string parentPath, string name, string content, int subType) => throw new NotImplementedException();
    public void AddGvl(string parentPath, string name, string content) => throw new NotImplementedException();
    public void AddDut(string parentPath, string name, string content, int subType) => throw new NotImplementedException();
    public void GenerateBootProject() => throw new NotImplementedException();
    public void ActivateConfiguration() => throw new NotImplementedException();
    public void StartRestartTwinCat() => throw new NotImplementedException();
}
