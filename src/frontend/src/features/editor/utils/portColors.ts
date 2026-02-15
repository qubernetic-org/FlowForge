// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

const PORT_COLORS: Record<string, string> = {
  BOOL: "#84cc16",
  INT: "#60a5fa",
  TIME: "#2dd4bf",
  REAL: "#f97316",
  EXEC: "#999",
};

const DEFAULT_COLOR = "#666";

export function getPortColor(dataType: string): string {
  return PORT_COLORS[dataType.toUpperCase()] ?? DEFAULT_COLOR;
}
