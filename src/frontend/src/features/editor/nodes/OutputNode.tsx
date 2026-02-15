// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface OutputNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function valueClass(dataType: string, value: unknown): string {
  const base = `ff-port-value ff-port-value-${dataType.toLowerCase()}`;
  if (dataType === "BOOL" && value === false) return `${base} ff-port-value-false`;
  return base;
}

export function OutputNode({ data }: { data: OutputNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const inVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".IN"),
  );

  return (
    <div className={`ff-node ff-node-output ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Output"}</span>
          <span className="ff-node-type-path">I/O · Output</span>
        </div>
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="IN" style={{ background: getPortColor("BOOL") }} />
          <span className="ff-port-label">IN</span>
          {inVar && (
            <span className={valueClass("BOOL", inVar.value)}>{String(inVar.value)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
