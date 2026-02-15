// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface ComparisonNodeData {
  label?: string;
  operator?: string;
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

export function ComparisonNode({ data }: { data: ComparisonNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const aVar = findVar(data.onlineData, ".A");
  const bVar = findVar(data.onlineData, ".B");
  const outVar = findVar(data.onlineData, ".OUT");

  return (
    <div className={`ff-node ff-node-comparison ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? data.operator ?? "Compare"}</span>
          <span className="ff-node-type-path">FUN · Tc2_Standard.GE</span>
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
            <Handle type="target" position={Position.Left} id="A" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">A</span>
            {aVar && <span className={valueClass("INT", aVar.value)}>{String(aVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {outVar && <span className={valueClass("BOOL", outVar.value)}>{String(outVar.value)}</span>}
            <span className="ff-port-label">OUT</span>
            <Handle type="source" position={Position.Right} id="OUT" style={{ background: getPortColor("BOOL") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="B" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">B</span>
            {bVar && <span className={valueClass("INT", bVar.value)}>{String(bVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output" />
        </div>
      </div>
    </div>
  );
}
