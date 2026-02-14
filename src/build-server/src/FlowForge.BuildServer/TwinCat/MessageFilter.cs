// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

/// <summary>
/// IOleMessageFilter implementation for COM call retry handling.
/// When the DTE is busy, COM calls are rejected with SERVERCALL_RETRYLATER.
/// This filter automatically retries after a short delay (99ms).
/// Without this, random RPC_E_CALL_REJECTED exceptions crash the build.
/// Pattern from TcUnit-Verifier and Beckhoff CodeGenerationDemo.
/// </summary>
public static class MessageFilter
{
    // TODO: Implement IOleMessageFilter via COM interop:
    //   HandleInComingCall → SERVERCALL_ISHANDLED
    //   RetryRejectedCall → 99 (retry after 99ms)
    //   MessagePending → PENDINGMSG_WAITDEFPROCESS

    public static void Register()
    {
        // TODO: CoRegisterMessageFilter(new MessageFilterImpl(), out _)
    }

    public static void Revoke()
    {
        // TODO: CoRegisterMessageFilter(null, out _)
    }
}
