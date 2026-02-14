// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using System.Diagnostics;

namespace FlowForge.BuildServer.Pipeline;

public class BuildPipeline
{
    private readonly IEnumerable<IBuildStep> _steps;
    private readonly ILogger<BuildPipeline> _logger;

    public BuildPipeline(IEnumerable<IBuildStep> steps, ILogger<BuildPipeline> logger)
    {
        _steps = steps;
        _logger = logger;
    }

    public async Task<bool> ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        foreach (var step in _steps)
        {
            _logger.LogInformation("Executing step: {Step}", step.Name);
            var sw = Stopwatch.StartNew();

            try
            {
                await step.ExecuteAsync(context, ct);
                sw.Stop();
                context.Timings[step.Name] = sw.Elapsed;
                _logger.LogInformation("Step {Step} completed in {Elapsed}ms", step.Name, sw.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                sw.Stop();
                context.Timings[step.Name] = sw.Elapsed;
                context.Errors.Add($"{step.Name}: {ex.Message}");
                _logger.LogError(ex, "Step {Step} failed", step.Name);
                return false;
            }
        }

        return context.Errors.Count == 0;
    }
}
