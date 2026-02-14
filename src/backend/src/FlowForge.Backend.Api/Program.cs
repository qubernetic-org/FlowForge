// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Api.Configuration;
using FlowForge.Backend.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
builder.Services.Configure<FlowForgeOptions>(
    builder.Configuration.GetSection(FlowForgeOptions.Section));

// ---------------------------------------------------------------------------
// Database (EF Core + PostgreSQL)
// ---------------------------------------------------------------------------
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// ---------------------------------------------------------------------------
// Authentication — Keycloak OIDC (JWT validation)
// ---------------------------------------------------------------------------
// TODO: Wire up OIDC JWT Bearer authentication against Keycloak
// TODO: Add admin API endpoints as facade over Keycloak Admin REST API

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
app.UseCors();

// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();
app.MapHub<BuildHub>("/hub/build");

app.Run();