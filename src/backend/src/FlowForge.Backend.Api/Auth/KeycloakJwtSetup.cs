// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Api.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace FlowForge.Backend.Api.Auth;

public static class KeycloakJwtSetup
{
    public static IServiceCollection AddKeycloakAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var keycloakOptions = configuration.GetSection(KeycloakOptions.Section).Get<KeycloakOptions>()
            ?? new KeycloakOptions();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = $"{keycloakOptions.BaseUrl}/realms/{keycloakOptions.Realm}";
                options.Audience = keycloakOptions.ClientId;
                options.RequireHttpsMetadata = keycloakOptions.RequireHttps;
            });

        services.AddAuthorization();

        return services;
    }
}
