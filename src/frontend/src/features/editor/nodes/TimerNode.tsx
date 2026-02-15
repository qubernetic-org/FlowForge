// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface TimerNodeData {
  label?: string;
  executionOrder?: number;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function findVar(data: NodeOnlineData | undefined, suffix: string) {
  return data?.variables.find((v) => v.path.endsWith(suffix));
}

function valueClass(dataType: string, value: unknown): string {
  const base = `ff-port-value ff-port-value-${dataType.toLowerCase()}`;
  if (dataType === "BOOL" && value === false) return `${base} ff-port-value-false`;
  return base;
}

export function TimerNode({ data }: { data: TimerNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const execColor = execState === "active" ? "#ffffff" : getPortColor("EXEC");
  const inVar = findVar(data.onlineData, ".IN");
  const ptVar = findVar(data.onlineData, ".PT");
  const qVar = findVar(data.onlineData, ".Q");
  const etVar = findVar(data.onlineData, ".ET");

  return (
    <div className={`ff-node ff-node-timer ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Timer"}</span>
          <span className="ff-node-type-path">FB · Tc2_Standard.TON</span>
        </div>
        {data.executionOrder != null && (
          <span className="ff-node-exec-order">#{data.executionOrder}</span>
        )}
      </div>
      <div className="ff-node-body">
        <div className="ff-port-row ff-port-exec">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="EN" style={{ background: execColor }} />
            <span className="ff-port-label" style={{ color: "#999" }}>EN</span>
          </div>
          <div className="ff-port ff-port-output">
            <span className="ff-port-label" style={{ color: "#999" }}>ENO</span>
            <Handle type="source" position={Position.Right} id="ENO" style={{ background: execColor }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="IN" style={{ background: getPortColor("BOOL") }} />
            <span className="ff-port-label">IN</span>
            {inVar && <span className={valueClass("BOOL", inVar.value)}>{String(inVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {qVar && <span className={valueClass("BOOL", qVar.value)}>{String(qVar.value)}</span>}
            <span className="ff-port-label">Q</span>
            <Handle type="source" position={Position.Right} id="Q" style={{ background: getPortColor("BOOL") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="PT" style={{ background: getPortColor("TIME") }} />
            <span className="ff-port-label">PT</span>
            {ptVar && <span className={valueClass("TIME", ptVar.value)}>{String(ptVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {etVar && <span className={valueClass("TIME", etVar.value)}>{String(etVar.value)}</span>}
            <span className="ff-port-label">ET</span>
            <Handle type="source" position={Position.Right} id="ET" style={{ background: getPortColor("TIME") }} />
          </div>
        </div>
      </div>
    </div>
  );
}
