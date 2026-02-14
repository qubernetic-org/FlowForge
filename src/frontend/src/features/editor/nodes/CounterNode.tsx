// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";

interface CounterNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function findVar(data: NodeOnlineData | undefined, suffix: string) {
  return data?.variables.find((v) => v.path.endsWith(suffix));
}

export function CounterNode({ data }: { data: CounterNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const cuVar = findVar(data.onlineData, ".CU");
  const resetVar = findVar(data.onlineData, ".RESET");
  const pvVar = findVar(data.onlineData, ".PV");
  const qVar = findVar(data.onlineData, ".Q");
  const cvVar = findVar(data.onlineData, ".CV");

  return (
    <div className={`ff-node ff-node-counter ff-exec-${execState}`}>
      <div className="ff-node-header">{data.label ?? "Counter"}</div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="CU" />
          <span className="ff-port-label">CU</span>
          {cuVar && (
            <span className="ff-port-value">{String(cuVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-input">
          <Handle
            type="target"
            position={Position.Left}
            id="RESET"
            style={{ top: "50%" }}
          />
          <span className="ff-port-label">RESET</span>
          {resetVar && (
            <span className="ff-port-value">{String(resetVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-input">
          <Handle
            type="target"
            position={Position.Left}
            id="PV"
            style={{ top: "70%" }}
          />
          <span className="ff-port-label">PV</span>
          {pvVar && (
            <span className="ff-port-value">{String(pvVar.value)}</span>
          )}
        </div>
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">Q</span>
          {qVar && (
            <span className="ff-port-value">{String(qVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="Q" />
        </div>
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">CV</span>
          {cvVar && (
            <span className="ff-port-value">{String(cvVar.value)}</span>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id="CV"
            style={{ top: "60%" }}
          />
        </div>
      </div>
    </div>
  );
}
