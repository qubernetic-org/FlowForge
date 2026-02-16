// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor, getHeaderGradient } from "../utils/portColors";

interface VarReadNodeData {
  label?: string;
  dataType?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function valueClass(dataType: string, value: unknown): string {
  const base = `ff-port-value ff-port-value-${dataType.toLowerCase()}`;
  if (dataType === "BOOL" && value === false) return `${base} ff-port-value-false`;
  return base;
}

export function VarReadNode({ data }: { data: VarReadNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const dataType = data.dataType ?? "BOOL";
  const valVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".VALUE"),
  );

  return (
    <div className={`ff-node ff-node-varRead ff-exec-${execState}`}>
      <div className="ff-node-header" style={{ background: getHeaderGradient(dataType) }}>
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Variable Read"}</span>
          <span className="ff-node-type-path">VAR · READ</span>
        </div>
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">VALUE</span>
          {valVar && (
            <span className={valueClass(dataType, valVar.value)}>{String(valVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="VALUE" style={{ background: getPortColor(dataType) }} />
        </div>
      </div>
    </div>
  );
}
