// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.BuildServer;
using FlowForge.BuildServer.Configuration;
using FlowForge.BuildServer.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
builder.Services.Configure<BuildServerOptions>(
    builder.Configuration.GetSection(BuildServerOptions.Section));

// ---------------------------------------------------------------------------
// HTTP client for backend REST API
// ---------------------------------------------------------------------------
builder.Services.AddHttpClient<BuildJobClient>(client =>
{
    var backendUrl = builder.Configuration["BuildServer:BackendApiUrl"] ?? "http://localhost:5000";
    client.BaseAddress = new Uri(backendUrl);
});

// ---------------------------------------------------------------------------
// Background worker (build job polling)
// ---------------------------------------------------------------------------
builder.Services.AddHostedService<Worker>();

var app = builder.Build();

// ---------------------------------------------------------------------------
// Debug REST endpoints (manual build/deploy trigger)
// ---------------------------------------------------------------------------
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "flowforge-build-server" }));

app.MapPost("/debug/build", async (HttpRequest request) =>
{
    // Accept a hand-crafted flow JSON for debug builds
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    // TODO: Queue a local debug build with the provided JSON
    return Results.Accepted(value: new { message = "debug build queued", size = json.Length });
});

app.MapPost("/debug/deploy", async (HttpRequest request) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    // TODO: Queue a local debug deploy with the provided JSON
    return Results.Accepted(value: new { message = "debug deploy queued", size = json.Length });
});

app.Run();