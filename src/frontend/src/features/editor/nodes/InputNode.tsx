// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface InputNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

function valueClass(dataType: string, value: unknown): string {
  const base = `ff-port-value ff-port-value-${dataType.toLowerCase()}`;
  if (dataType === "BOOL" && value === false) return `${base} ff-port-value-false`;
  return base;
}

export function InputNode({ data }: { data: InputNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const outVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".OUT"),
  );

  return (
    <div className={`ff-node ff-node-input ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Input"}</span>
          <span className="ff-node-type-path">I/O · Input</span>
        </div>
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">OUT</span>
          {outVar && (
            <span className={valueClass("BOOL", outVar.value)}>{String(outVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="OUT" style={{ background: getPortColor("BOOL") }} />
        </div>
      </div>
    </div>
  );
}
