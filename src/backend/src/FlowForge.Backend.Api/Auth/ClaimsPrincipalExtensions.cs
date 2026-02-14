// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using System.Security.Claims;

namespace FlowForge.Backend.Api.Auth;

public static class ClaimsPrincipalExtensions
{
    public static string? GetUserId(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier);

    public static string? GetEmail(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.Email);

    public static string? GetDisplayName(this ClaimsPrincipal principal) =>
        principal.FindFirstValue("name") ?? principal.FindFirstValue(ClaimTypes.Name);

    public static bool HasPermission(this ClaimsPrincipal principal, string permission) =>
        principal.HasClaim("permission", permission) ||
        principal.IsInRole("admin");
}
