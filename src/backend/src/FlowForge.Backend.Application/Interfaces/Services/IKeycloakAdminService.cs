// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Auth;

namespace FlowForge.Backend.Application.Interfaces.Services;

public interface IKeycloakAdminService
{
    Task<IReadOnlyList<UserInfoDto>> GetUsersAsync(CancellationToken ct = default);
    Task<UserInfoDto?> GetUserByIdAsync(string userId, CancellationToken ct = default);
    Task<UserInfoDto> CreateUserAsync(string userName, string email, string? password, CancellationToken ct = default);
    Task UpdateUserAsync(string userId, string? email, string? displayName, CancellationToken ct = default);
    Task DeleteUserAsync(string userId, CancellationToken ct = default);
    Task AssignRoleAsync(string userId, string roleName, CancellationToken ct = default);
    Task RemoveRoleAsync(string userId, string roleName, CancellationToken ct = default);
}
