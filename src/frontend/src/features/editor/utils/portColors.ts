// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

const PORT_COLORS: Record<string, string> = {
  BOOL: "#4ec970",
  INT: "#5b8def",
  TIME: "#4ac1cc",
};

const DEFAULT_COLOR = "#8b95a3";

export function getPortColor(dataType: string): string {
  return PORT_COLORS[dataType.toUpperCase()] ?? DEFAULT_COLOR;
}
