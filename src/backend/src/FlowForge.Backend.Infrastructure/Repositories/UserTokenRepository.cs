// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Entities;
using FlowForge.Backend.Application.Interfaces.Repositories;
using FlowForge.Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Backend.Infrastructure.Repositories;

public class UserTokenRepository : IUserTokenRepository
{
    private readonly AppDbContext _db;

    public UserTokenRepository(AppDbContext db) => _db = db;

    public async Task<UserToken?> GetByUserAndProviderAsync(string userId, string provider, CancellationToken ct) =>
        await _db.UserTokens.FirstOrDefaultAsync(t => t.UserId == userId && t.Provider == provider, ct);

    public async Task<UserToken> AddOrUpdateAsync(UserToken token, CancellationToken ct)
    {
        var existing = await GetByUserAndProviderAsync(token.UserId, token.Provider, ct);
        if (existing is not null)
        {
            existing.EncryptedToken = token.EncryptedToken;
            existing.ExpiresAt = token.ExpiresAt;
            _db.UserTokens.Update(existing);
        }
        else
        {
            _db.UserTokens.Add(token);
        }
        await _db.SaveChangesAsync(ct);
        return existing ?? token;
    }

    public async Task DeleteAsync(string userId, string provider, CancellationToken ct)
    {
        var token = await GetByUserAndProviderAsync(userId, provider, ct);
        if (token is not null)
        {
            _db.UserTokens.Remove(token);
            await _db.SaveChangesAsync(ct);
        }
    }
}
