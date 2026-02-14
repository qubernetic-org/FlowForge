// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

public class TemplateManager
{
    private readonly string _templateBasePath;

    public TemplateManager(string templateBasePath)
    {
        _templateBasePath = templateBasePath;
    }

    public string? GetTemplatePath(string machineType)
    {
        // TODO: Resolve .tpzip template path from machine type name
        //   e.g., "3-axis-standalone" → "{basePath}/3-axis-standalone.tpzip"
        var path = Path.Combine(_templateBasePath, $"{machineType}.tpzip");
        return File.Exists(path) ? path : null;
    }
}
