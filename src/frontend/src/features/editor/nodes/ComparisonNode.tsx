// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";

interface ComparisonNodeData {
  label?: string;
  operator?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function findVar(data: NodeOnlineData | undefined, suffix: string) {
  return data?.variables.find((v) => v.path.endsWith(suffix));
}

export function ComparisonNode({ data }: { data: ComparisonNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const aVar = findVar(data.onlineData, ".A");
  const bVar = findVar(data.onlineData, ".B");
  const outVar = findVar(data.onlineData, ".OUT");

  return (
    <div className={`ff-node ff-node-comparison ff-exec-${execState}`}>
      <div className="ff-node-header">
        {data.label ?? data.operator ?? "Compare"}
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="A" />
          <span className="ff-port-label">A</span>
          {aVar && (
            <span className="ff-port-value">{String(aVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-input">
          <Handle
            type="target"
            position={Position.Left}
            id="B"
            style={{ top: "60%" }}
          />
          <span className="ff-port-label">B</span>
          {bVar && (
            <span className="ff-port-value">{String(bVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">OUT</span>
          {outVar && (
            <span className="ff-port-value">{String(outVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="OUT" />
        </div>
      </div>
    </div>
  );
}
