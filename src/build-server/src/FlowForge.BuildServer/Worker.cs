using FlowForge.BuildServer.Services;

namespace FlowForge.BuildServer;

/// <summary>
/// Background worker that polls the backend API for build jobs.
/// In production, MQTT notifications wake this up instead of blind polling.
/// </summary>
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly BuildJobClient _jobClient;

    public Worker(ILogger<Worker> logger, BuildJobClient jobClient)
    {
        _logger = logger;
        _jobClient = jobClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Build server worker started");

        while (!stoppingToken.IsCancellationRequested)
        {
            // TODO: Replace polling with MQTT-triggered wake-up
            // TODO: Claim job via BuildJobClient (SELECT ... FOR UPDATE SKIP LOCKED on backend)
            // TODO: Clone/fetch repo, generate TwinCAT solution, commit/push result

            _logger.LogDebug("Polling for build jobs...");
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}
