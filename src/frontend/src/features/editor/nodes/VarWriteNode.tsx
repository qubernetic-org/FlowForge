// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor, getHeaderGradient } from "../utils/portColors";

interface VarWriteNodeData {
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

export function VarWriteNode({ data }: { data: VarWriteNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const dataType = data.dataType ?? "BOOL";
  const valVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".VALUE"),
  );

  return (
    <div className={`ff-node ff-node-varWrite ff-exec-${execState}`}>
      <div className="ff-node-header" style={{ background: getHeaderGradient(dataType) }}>
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Variable Write"}</span>
          <span className="ff-node-type-path">VAR · WRITE</span>
        </div>
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="VALUE" style={{ background: getPortColor(dataType) }} />
          <span className="ff-port-label">VALUE</span>
          {valVar && (
            <span className={valueClass(dataType, valVar.value)}>{String(valVar.value)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
