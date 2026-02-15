// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface MethodCallNodeData {
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

export function MethodCallNode({ data }: { data: MethodCallNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const execColor = execState === "active" ? "#ffffff" : getPortColor("EXEC");
  const cyclesVar = findVar(data.onlineData, ".Cycles");
  const tempVar = findVar(data.onlineData, ".Temp");
  const retVar = findVar(data.onlineData, ".RET");
  const label = data.label ?? "MethodCall";

  return (
    <div className={`ff-node ff-node-methodCall ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{label}</span>
          <span className="ff-node-type-path">METHOD · MAIN.{label}</span>
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
            <Handle type="target" position={Position.Left} id="Cycles" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">Cycles</span>
            {cyclesVar && <span className={valueClass("INT", cyclesVar.value)}>{String(cyclesVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {retVar && <span className={valueClass("BOOL", retVar.value)}>{String(retVar.value)}</span>}
            <span className="ff-port-label">RET</span>
            <Handle type="source" position={Position.Right} id="RET" style={{ background: getPortColor("BOOL") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="Temp" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">Temp</span>
            {tempVar && <span className={valueClass("INT", tempVar.value)}>{String(tempVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output" />
        </div>
      </div>
    </div>
  );
}
