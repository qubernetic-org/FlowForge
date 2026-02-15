// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface CounterNodeData {
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

export function CounterNode({ data }: { data: CounterNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const cuVar = findVar(data.onlineData, ".CU");
  const resetVar = findVar(data.onlineData, ".RESET");
  const pvVar = findVar(data.onlineData, ".PV");
  const qVar = findVar(data.onlineData, ".Q");
  const cvVar = findVar(data.onlineData, ".CV");

  return (
    <div className={`ff-node ff-node-counter ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Counter"}</span>
          <span className="ff-node-type-path">FB · Tc2_Standard.CTU</span>
        </div>
        {data.executionOrder != null && (
          <span className="ff-node-exec-order">#{data.executionOrder}</span>
        )}
      </div>
      <div className="ff-node-body">
        <div className="ff-port-row ff-port-exec">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="EN" style={{ background: getPortColor("EXEC") }} />
            <span className="ff-port-label" style={{ color: "#999" }}>EN</span>
          </div>
          <div className="ff-port ff-port-output">
            <span className="ff-port-label" style={{ color: "#999" }}>ENO</span>
            <Handle type="source" position={Position.Right} id="ENO" style={{ background: getPortColor("EXEC") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="CU" style={{ background: getPortColor("BOOL") }} />
            <span className="ff-port-label">CU</span>
            {cuVar && <span className={valueClass("BOOL", cuVar.value)}>{String(cuVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {qVar && <span className={valueClass("BOOL", qVar.value)}>{String(qVar.value)}</span>}
            <span className="ff-port-label">Q</span>
            <Handle type="source" position={Position.Right} id="Q" style={{ background: getPortColor("BOOL") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="RESET" style={{ background: getPortColor("BOOL") }} />
            <span className="ff-port-label">RESET</span>
            {resetVar && <span className={valueClass("BOOL", resetVar.value)}>{String(resetVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {cvVar && <span className={valueClass("INT", cvVar.value)}>{String(cvVar.value)}</span>}
            <span className="ff-port-label">CV</span>
            <Handle type="source" position={Position.Right} id="CV" style={{ background: getPortColor("INT") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="PV" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">PV</span>
            {pvVar && <span className={valueClass("INT", pvVar.value)}>{String(pvVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output" />
        </div>
      </div>
    </div>
  );
}
