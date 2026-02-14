// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;
using FlowForge.Shared.Models.Auth;

namespace FlowForge.Backend.Infrastructure.Keycloak;

public class KeycloakAdminService : IKeycloakAdminService
{
    private readonly HttpClient _httpClient;

    public KeycloakAdminService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<IReadOnlyList<UserInfoDto>> GetUsersAsync(CancellationToken ct)
    {
        // TODO: GET /admin/realms/{realm}/users
        throw new NotImplementedException();
    }

    public Task<UserInfoDto?> GetUserByIdAsync(string userId, CancellationToken ct)
    {
        // TODO: GET /admin/realms/{realm}/users/{id}
        throw new NotImplementedException();
    }

    public Task<UserInfoDto> CreateUserAsync(string userName, string email, string? password, CancellationToken ct)
    {
        // TODO: POST /admin/realms/{realm}/users
        throw new NotImplementedException();
    }

    public Task UpdateUserAsync(string userId, string? email, string? displayName, CancellationToken ct)
    {
        // TODO: PUT /admin/realms/{realm}/users/{id}
        throw new NotImplementedException();
    }

    public Task DeleteUserAsync(string userId, CancellationToken ct)
    {
        // TODO: DELETE /admin/realms/{realm}/users/{id}
        throw new NotImplementedException();
    }

    public Task AssignRoleAsync(string userId, string roleName, CancellationToken ct)
    {
        // TODO: POST /admin/realms/{realm}/users/{id}/role-mappings/realm
        throw new NotImplementedException();
    }

    public Task RemoveRoleAsync(string userId, string roleName, CancellationToken ct)
    {
        // TODO: DELETE /admin/realms/{realm}/users/{id}/role-mappings/realm
        throw new NotImplementedException();
    }
}
