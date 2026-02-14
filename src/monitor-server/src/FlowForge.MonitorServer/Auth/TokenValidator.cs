// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.MonitorServer.Auth;

public class TokenValidator
{
    private readonly string _expectedToken;

    public TokenValidator(string expectedToken)
    {
        _expectedToken = expectedToken;
    }

    public bool Validate(string? token)
    {
        // TODO: Implement HMAC-based short-lived token validation
        //       For now, simple string comparison with the token injected at container creation
        return !string.IsNullOrEmpty(token) && token == _expectedToken;
    }
}
