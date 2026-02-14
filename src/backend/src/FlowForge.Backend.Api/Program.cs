// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Api.Auth;
using FlowForge.Backend.Api.Configuration;
using FlowForge.Backend.Api.Hubs;
using FlowForge.Backend.Api.Middleware;
using FlowForge.Backend.Application.Services;
using FlowForge.Backend.Application.Validation;
using FlowForge.Backend.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
builder.Services.Configure<FlowForgeOptions>(
    builder.Configuration.GetSection(FlowForgeOptions.Section));
builder.Services.Configure<KeycloakOptions>(
    builder.Configuration.GetSection(KeycloakOptions.Section));
builder.Services.Configure<MqttOptions>(
    builder.Configuration.GetSection(MqttOptions.Section));

// ---------------------------------------------------------------------------
// Infrastructure (EF Core, repositories, external services)
// ---------------------------------------------------------------------------
builder.Services.AddInfrastructure(builder.Configuration);

// ---------------------------------------------------------------------------
// Application services
// ---------------------------------------------------------------------------
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<BuildService>();
builder.Services.AddScoped<DeployService>();
builder.Services.AddScoped<TargetService>();
builder.Services.AddScoped<MonitorService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddSingleton<FlowDocumentValidator>();

// ---------------------------------------------------------------------------
// Authentication — Keycloak OIDC (JWT validation)
// ---------------------------------------------------------------------------
builder.Services.AddKeycloakAuthentication(builder.Configuration);

// ---------------------------------------------------------------------------
// SignalR
// ---------------------------------------------------------------------------
builder.Services.AddSignalR();

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------
builder.Services.AddControllers();

// ---------------------------------------------------------------------------
// CORS (development)
// ---------------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:5173"])
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<BuildHub>("/hub/build");

app.Run();
