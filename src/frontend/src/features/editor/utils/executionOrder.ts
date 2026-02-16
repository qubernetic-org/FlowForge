// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FlowNode, FlowConnection } from "../../../api/types";

/**
 * Walk EXEC connection chains starting from all entry-type nodes.
 * Each chain is numbered independently (1-based).
 * Entry/methodEntry nodes are virtual and excluded from numbering —
 * the count starts from the first real node after each entry point.
 * Also follows branching exec ports (TRUE, DO) with continued numbering.
 * Input/Output nodes are not part of the execution chain.
 */
export function computeExecutionOrder(
  nodes: FlowNode[],
  connections: FlowConnection[],
): Map<string, number> {
  const orderMap = new Map<string, number>();

  const ENTRY_TYPES = new Set(["entry", "methodEntry", "propertyEntry"]);

  // Find all entry nodes (PRG entries, method entries)
  const entryNodes = nodes.filter((n) => ENTRY_TYPES.has(n.type));
  if (entryNodes.length === 0) return orderMap;

  // Build lookup: "sourceNodeId:portName" → targetNodeId for all exec connections
  const execTargets = new Map<string, string>();
  for (const conn of connections) {
    const isExecPort = conn.to.portName === "EN";
    if (isExecPort) {
      execTargets.set(`${conn.from.nodeId}:${conn.from.portName}`, conn.to.nodeId);
    }
  }

  const visited = new Set<string>();

  // Walk each chain independently
  for (const entry of entryNodes) {
    let order = 1;
    const queue: string[] = [entry.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = nodes.find((n) => n.id === currentId);
      const isEntry = node != null && ENTRY_TYPES.has(node.type);

      // Skip entry nodes from numbering — they are virtual
      if (!isEntry) {
        orderMap.set(currentId, order);
        order++;
      }

      // Follow ENO (main continuation)
      const enoTarget = execTargets.get(`${currentId}:ENO`);
      if (enoTarget && !visited.has(enoTarget)) {
        queue.push(enoTarget);
      }

      // Follow branch ports (TRUE, DO, etc.)
      for (const port of ["TRUE", "DO"]) {
        const branchTarget = execTargets.get(`${currentId}:${port}`);
        if (branchTarget && !visited.has(branchTarget)) {
          queue.push(branchTarget);
        }
      }
    }
  }

  return orderMap;
}

export interface ExecutionChain {
  entryId: string;
  entryType: string;
  label: string;
  memberIds: string[];
}

/**
 * Return per-entry execution chains with member node IDs.
 * Entry/methodEntry nodes themselves are excluded from member lists.
 */
export function computeExecutionChains(
  nodes: FlowNode[],
  connections: FlowConnection[],
): ExecutionChain[] {
  const ENTRY_TYPES = new Set(["entry", "methodEntry", "propertyEntry"]);
  const entryNodes = nodes.filter((n) => ENTRY_TYPES.has(n.type));
  if (entryNodes.length === 0) return [];

  const execTargets = new Map<string, string>();
  for (const conn of connections) {
    if (conn.to.portName === "EN") {
      execTargets.set(`${conn.from.nodeId}:${conn.from.portName}`, conn.to.nodeId);
    }
  }

  const visited = new Set<string>();
  const chains: ExecutionChain[] = [];

  for (const entry of entryNodes) {
    const memberIds: string[] = [];
    const queue: string[] = [entry.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = nodes.find((n) => n.id === currentId);
      if (node != null && !ENTRY_TYPES.has(node.type)) {
        memberIds.push(currentId);
      }

      for (const port of ["ENO", "TRUE", "DO"]) {
        const target = execTargets.get(`${currentId}:${port}`);
        if (target && !visited.has(target)) {
          queue.push(target);
        }
      }
    }

    chains.push({
      entryId: entry.id,
      entryType: entry.type,
      label: (entry.parameters.label as string) ?? entry.type,
      memberIds,
    });
  }

  return chains;
}
