// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.BuildServer.TwinCat;

namespace FlowForge.BuildServer.Pipeline.Steps;

public class DeployStep : IBuildStep
{
    private readonly IAdsDeployClient _adsClient;
    private readonly IAutomationInterface _automationInterface;
    private readonly ILogger<DeployStep> _logger;

    public DeployStep(IAdsDeployClient adsClient, IAutomationInterface automationInterface, ILogger<DeployStep> logger)
    {
        _adsClient = adsClient;
        _automationInterface = automationInterface;
        _logger = logger;
    }

    public string Name => "Deploy";

    public Task ExecuteAsync(BuildContext context, CancellationToken ct)
    {
        if (!context.Job.IncludeDeploy || context.TargetConnectionInfo is null)
        {
            _logger.LogInformation("Deploy skipped — build-only job");
            return Task.CompletedTask;
        }

        // TODO: Implement deploy sequence (see doc/ADS_INTEGRATION.md):
        // 1. Connect to target PLC via ADS (_adsClient.ConnectAsync)
        // 2. Read PLC state — deploy lock check (_adsClient.ReadPlcStateAsync)
        // 3. Switch to config mode (_adsClient.SwitchToConfigModeAsync)
        // 4. Activate configuration via Automation Interface (_automationInterface.ActivateConfiguration)
        // 5. Start/restart TwinCAT via ADS (_adsClient.StartRestartTwinCatAsync)
        // 6. Verify PLC is in Run state (_adsClient.ReadPlcStateAsync)
        // 7. Disconnect (_adsClient.DisconnectAsync)
        throw new NotImplementedException();
    }
}
