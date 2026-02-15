// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FlowNode, FlowConnection } from "../../../api/types";

/**
 * Walk EXEC connection chains starting from all entry-type nodes.
 * Each chain is numbered independently (1-based).
 * Also follows branching exec ports (TRUE, DO) with continued numbering.
 * Input/Output nodes are not part of the execution chain.
 */
export function computeExecutionOrder(
  nodes: FlowNode[],
  connections: FlowConnection[],
): Map<string, number> {
  const orderMap = new Map<string, number>();

  // Find all entry nodes (PRG entries, method entries)
  const entryNodes = nodes.filter((n) => n.type === "entry");
  if (entryNodes.length === 0) return orderMap;

  // Build lookup: "sourceNodeId:portName" → targetNodeId for all exec connections
  const execTargets = new Map<string, string>();
  for (const conn of connections) {
    const isExecPort = conn.to.portName === "EN";
    if (isExecPort) {
      execTargets.set(`${conn.from.nodeId}:${conn.from.portName}`, conn.to.nodeId);
    }
  }

  // Walk each chain independently
  for (const entry of entryNodes) {
    let order = 1;
    const queue: string[] = [entry.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (orderMap.has(currentId)) continue;

      orderMap.set(currentId, order);
      order++;

      // Follow ENO (main continuation)
      const enoTarget = execTargets.get(`${currentId}:ENO`);
      if (enoTarget && !orderMap.has(enoTarget)) {
        queue.push(enoTarget);
      }

      // Follow branch ports (TRUE, DO, etc.)
      for (const port of ["TRUE", "DO"]) {
        const branchTarget = execTargets.get(`${currentId}:${port}`);
        if (branchTarget && !orderMap.has(branchTarget)) {
          queue.push(branchTarget);
        }
      }
    }
  }

  return orderMap;
}
