// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FlowNode } from "../../../api/types";

/**
 * Maps node types to their PLC variable port names.
 * Must match the build server's code generation naming conventions.
 */
const nodePortMap: Record<string, string[]> = {
  entry: [],
  input: ["OUT"],
  output: ["IN"],
  timer: ["IN", "PT", "Q", "ET"],
  counter: ["CU", "RESET", "PV", "Q", "CV"],
  comparison: ["A", "B", "OUT"],
  if: ["COND"],
  for: ["FROM", "TO", "i"],
  methodCall: ["Cycles", "Temp", "RET"],
  methodEntry: ["Cycles", "Temp"],
};

/**
 * Returns PLC variable paths for a given flow node.
 * Path format: MAIN.<nodeId>.<portName>
 */
export function getVariablePathsForNode(node: FlowNode): string[] {
  const ports = nodePortMap[node.type];
  if (!ports) return [];
  return ports.map((port) => `MAIN.${node.id}.${port}`);
}

/**
 * Returns all variable paths for an entire flow document's nodes.
 */
export function getAllVariablePaths(nodes: FlowNode[]): string[] {
  return nodes.flatMap(getVariablePathsForNode);
}

/**
 * Extracts the nodeId from a variable path (MAIN.<nodeId>.<port>).
 */
export function getNodeIdFromPath(path: string): string | null {
  const parts = path.split(".");
  if (parts.length >= 3 && parts[0] === "MAIN") {
    return parts[1] ?? null;
  }
  return null;
}
