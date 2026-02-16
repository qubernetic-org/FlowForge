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

const HEADER_GRADIENTS: Record<string, string> = {
  BOOL: "linear-gradient(135deg, #8cbf2e 0%, #567a18 100%)",
  INT: "linear-gradient(135deg, #6faef0 0%, #3872a8 100%)",
  TIME: "linear-gradient(135deg, #3ecfb8 0%, #1a8a76 100%)",
  REAL: "linear-gradient(135deg, #f0a050 0%, #b06820 100%)",
};

const DEFAULT_GRADIENT = "linear-gradient(135deg, #666 0%, #444 100%)";

export function getPortColor(dataType: string): string {
  return PORT_COLORS[dataType.toUpperCase()] ?? DEFAULT_COLOR;
}

export function getHeaderGradient(dataType: string): string {
  return HEADER_GRADIENTS[dataType.toUpperCase()] ?? DEFAULT_GRADIENT;
}
