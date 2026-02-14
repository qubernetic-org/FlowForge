// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

public interface IAutomationInterface
{
    void CreatePlcProject(string name, string? templatePath);
    void AddPou(string parentPath, string name, string content, int subType);
    void AddGvl(string parentPath, string name, string content);
    void AddDut(string parentPath, string name, string content, int subType);
    void GenerateBootProject();
    void ActivateConfiguration();
    void StartRestartTwinCat();
}
