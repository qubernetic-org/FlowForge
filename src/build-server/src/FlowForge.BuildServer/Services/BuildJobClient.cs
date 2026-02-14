// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.Services;

/// <summary>
/// HTTP client for communicating with the backend API.
/// Claims build jobs and reports results.
/// </summary>
public class BuildJobClient
{
    private readonly HttpClient _http;
    private readonly ILogger<BuildJobClient> _logger;

    public BuildJobClient(HttpClient http, ILogger<BuildJobClient> logger)
    {
        _http = http;
        _logger = logger;
    }

    /// <summary>
    /// Attempt to claim the next available build job from the backend.
    /// Backend uses SELECT ... FOR UPDATE SKIP LOCKED to guarantee exclusivity.
    /// </summary>
    public async Task<string?> ClaimNextJobAsync(CancellationToken ct = default)
    {
        // TODO: POST /api/build/claim with TwinCAT version
        _logger.LogDebug("Claiming next build job...");
        await Task.CompletedTask;
        return null;
    }

    /// <summary>
    /// Report build result (success or failure) back to the backend.
    /// </summary>
    public async Task ReportResultAsync(string buildId, bool success, string? error = null, CancellationToken ct = default)
    {
        // TODO: POST /api/build/{buildId}/result
        _logger.LogInformation("Reporting build {BuildId} result: {Success}", buildId, success);
        await Task.CompletedTask;
    }
}