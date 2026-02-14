// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Application.Interfaces.Services;
using FlowForge.Backend.Infrastructure.Docker;
using FlowForge.Backend.Infrastructure.Git;
using FlowForge.Backend.Infrastructure.Keycloak;
using FlowForge.Backend.Infrastructure.Mqtt;
using FlowForge.Backend.Infrastructure.Persistence;
using FlowForge.Backend.Infrastructure.Repositories;
using FlowForge.Backend.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FlowForge.Backend.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("PostgreSQL")));

        // Repositories
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IBuildJobRepository, BuildJobRepository>();
        services.AddScoped<IPlcTargetRepository, PlcTargetRepository>();
        services.AddScoped<IDeployRecordRepository, DeployRecordRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<IUserTokenRepository, UserTokenRepository>();

        // Services
        services.AddSingleton<IGitService, GitService>();
        services.AddSingleton<IMqttService, MqttService>();
        services.AddSingleton<ITokenEncryptionService, AesTokenEncryptionService>();

        // Docker service (HttpClient-based)
        services.AddHttpClient<IDockerService, DockerService>(client =>
        {
            client.BaseAddress = new Uri(configuration["FlowForge:DockerSocketProxyUrl"] ?? "http://docker-socket-proxy:2375");
        });

        // Keycloak admin service (HttpClient-based)
        services.AddHttpClient<IKeycloakAdminService, KeycloakAdminService>(client =>
        {
            client.BaseAddress = new Uri(configuration["Keycloak:AdminUrl"] ?? "http://keycloak:8080");
        });

        // MQTT background connection
        services.AddHostedService<MqttHostedService>();

        return services;
    }
}
