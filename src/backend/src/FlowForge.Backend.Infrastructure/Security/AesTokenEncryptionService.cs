// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Backend.Application.Interfaces.Services;

namespace FlowForge.Backend.Infrastructure.Security;

public class AesTokenEncryptionService : ITokenEncryptionService
{
    public byte[] Encrypt(string plainText)
    {
        // TODO: Implement AES-256-GCM encryption
        throw new NotImplementedException();
    }

    public string Decrypt(byte[] cipherText)
    {
        // TODO: Implement AES-256-GCM decryption
        throw new NotImplementedException();
    }
}
