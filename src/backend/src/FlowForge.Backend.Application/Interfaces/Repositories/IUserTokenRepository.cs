// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;

namespace FlowForge.Backend.Application.Interfaces.Repositories;

public interface IUserTokenRepository
{
    Task<UserToken?> GetByUserAndProviderAsync(string userId, string provider, CancellationToken ct = default);
    Task<UserToken> AddOrUpdateAsync(UserToken token, CancellationToken ct = default);
    Task DeleteAsync(string userId, string provider, CancellationToken ct = default);
}
