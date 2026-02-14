// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using FlowForge.Shared.Models.Flow;

namespace FlowForge.Backend.Application.Validation;

public class FlowDocumentValidator
{
    public IReadOnlyList<string> Validate(FlowDocument document)
    {
        // TODO: Validate connections reference existing nodes/ports, detect cycles, etc.
        return [];
    }
}
