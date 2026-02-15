// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface ForNodeData {
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

export function ForNode({ data }: { data: ForNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const iVar = findVar(data.onlineData, ".i");
  const fromVar = findVar(data.onlineData, ".FROM");
  const toVar = findVar(data.onlineData, ".TO");

  return (
    <div className={`ff-node ff-node-for ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "FOR"}</span>
          <span className="ff-node-type-path">CTRL · FOR</span>
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
            <Handle type="target" position={Position.Left} id="FROM" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">FROM</span>
            {fromVar && <span className={valueClass("INT", fromVar.value)}>{String(fromVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            <span className="ff-port-label" style={{ color: "#999" }}>DO</span>
            <Handle type="source" position={Position.Right} id="DO" style={{ background: getPortColor("EXEC") }} />
          </div>
        </div>
        <div className="ff-port-row">
          <div className="ff-port ff-port-input">
            <Handle type="target" position={Position.Left} id="TO" style={{ background: getPortColor("INT") }} />
            <span className="ff-port-label">TO</span>
            {toVar && <span className={valueClass("INT", toVar.value)}>{String(toVar.value)}</span>}
          </div>
          <div className="ff-port ff-port-output">
            {iVar && <span className={valueClass("INT", iVar.value)}>{String(iVar.value)}</span>}
            <span className="ff-port-label">i</span>
            <Handle type="source" position={Position.Right} id="i" style={{ background: getPortColor("INT") }} />
          </div>
        </div>
      </div>
    </div>
  );
}
