// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

export const T = {
  canvasBg: "#1a1a1a",
  gridLine: "#222",
  panelBg: "#252525",
  toolbarBg: "#333333",
  nodeBg: "#262626",
  nodeBorder: "#333",
  panelBorder: "#444",
  inputBg: "#171717",
  inputBorder: "#404040",
  textPrimary: "#e0e0e0",
  textSecondary: "#999",
  textLabel: "#a3a3a3",
  textMuted: "#666",
  accentBlue: "#3b82f6",
  accentGreen: "#22c55e",
  accentRed: "#ef4444",
  catPrg: "#C0392B",
  catVar: "#6B9E23",
  catFB: "#4A90C9",
  catFun: "#00838F",
  catMethod: "#D4883A",
  catProperty: "#C89B5B",
  catInterface: "#2BABB4",
  catCtrl: "#9B59B6",
  catAction: "#D4A83A",
  catTransition: "#D45A5A",
  portBool: "#84cc16",
  portInt: "#60a5fa",
  portTime: "#2dd4bf",
  portReal: "#f97316",
  fontUI: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  nodeRadius: 4,
  nodeShadow: "0 4px 15px rgba(0,0,0,0.5)",
  selectedGlow: "0 0 0 1px #3b82f6, 0 4px 15px rgba(0,0,0,0.5)",
  activeGlow: "0 0 4px rgba(255,255,255,0.5), 0 0 8px rgba(255,255,255,0.25), 0 4px 15px rgba(0,0,0,0.5)",
  activeSelectedGlow: "0 0 0 1px #3b82f6, 0 0 4px rgba(255,255,255,0.5), 0 0 8px rgba(255,255,255,0.25), 0 4px 15px rgba(0,0,0,0.5)",
} as const;

const CATEGORY_COLORS: Record<string, string> = {
  entry: T.catPrg,
  varRead: T.catVar,
  varWrite: T.catVar,
  timer: T.catFB,
  counter: T.catFB,
  comparison: T.catFun,
  if: T.catCtrl,
  for: T.catCtrl,
  methodCall: T.catMethod,
  methodEntry: T.catPrg,
  return: T.catPrg,
  propertyEntry: T.catPrg,
  method: T.catMethod,
  property: T.catProperty,
  interface: T.catInterface,
  action: T.catAction,
  transition: T.catTransition,
};

const CATEGORY_LABELS: Record<string, string> = {
  entry: "PRG",
  varRead: "VAR",
  varWrite: "VAR",
  timer: "FB",
  counter: "FB",
  comparison: "FUN",
  if: "FLOW CTRL",
  for: "FLOW CTRL",
  methodCall: "METHOD",
  methodEntry: "METHOD",
  return: "RETURN",
  propertyEntry: "PROPERTY",
  method: "METHOD",
  property: "PROPERTY",
  interface: "INTERFACE",
  action: "ACTION",
  transition: "TRANSITION",
};

export function categoryColor(nodeType: string): string {
  return CATEGORY_COLORS[nodeType] ?? T.textMuted;
}

export function categoryLabel(nodeType: string): string {
  return CATEGORY_LABELS[nodeType] ?? nodeType.toUpperCase();
}

export function portColor(dataType: string): string {
  switch (dataType.toUpperCase()) {
    case "BOOL": return T.portBool;
    case "INT": return T.portInt;
    case "TIME": return T.portTime;
    case "REAL": return T.portReal;
    default: return T.textMuted;
  }
}
