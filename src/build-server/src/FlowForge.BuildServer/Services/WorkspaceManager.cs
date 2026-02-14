// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Services;

public class WorkspaceManager
{
    private readonly string _basePath;

    public WorkspaceManager(string basePath)
    {
        _basePath = basePath;
    }

    public string CreateWorkspace(Guid buildId)
    {
        var path = Path.Combine(_basePath, buildId.ToString());
        Directory.CreateDirectory(path);
        return path;
    }

    public void CleanupWorkspace(string path)
    {
        if (Directory.Exists(path))
        {
            Directory.Delete(path, recursive: true);
        }
    }
}
