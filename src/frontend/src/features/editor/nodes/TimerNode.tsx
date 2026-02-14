// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface TimerNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function findVar(data: NodeOnlineData | undefined, suffix: string) {
  return data?.variables.find((v) => v.path.endsWith(suffix));
}

export function TimerNode({ data }: { data: TimerNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const inVar = findVar(data.onlineData, ".IN");
  const ptVar = findVar(data.onlineData, ".PT");
  const qVar = findVar(data.onlineData, ".Q");
  const etVar = findVar(data.onlineData, ".ET");

  return (
    <div className={`ff-node ff-node-timer ff-exec-${execState}`}>
      <div className="ff-node-header">{data.label ?? "Timer"}</div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="IN" style={{ background: getPortColor("BOOL") }} />
          <span className="ff-port-label">IN</span>
          {inVar && (
            <span className="ff-port-value">{String(inVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-input">
          <Handle
            type="target"
            position={Position.Left}
            id="PT"
            style={{ top: "60%", background: getPortColor("TIME") }}
          />
          <span className="ff-port-label">PT</span>
          {ptVar && (
            <span className="ff-port-value">{String(ptVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">Q</span>
          {qVar && (
            <span className="ff-port-value">{String(qVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="Q" style={{ background: getPortColor("BOOL") }} />
        </div>
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">ET</span>
          {etVar && (
            <span className="ff-port-value">{String(etVar.value)}</span>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id="ET"
            style={{ top: "60%", background: getPortColor("TIME") }}
          />
        </div>
      </div>
    </div>
  );
}
