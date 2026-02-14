// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.Backend.Api.Configuration;

public class KeycloakOptions
{
    public const string Section = "Keycloak";

    public string BaseUrl { get; set; } = "http://keycloak:8080";
    public string Realm { get; set; } = "flowforge";
    public string ClientId { get; set; } = "flowforge-backend";
    public string AdminUrl { get; set; } = "http://keycloak:8080";
    public bool RequireHttps { get; set; } = false;
}
