// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";

interface OutputNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

export function OutputNode({ data }: { data: OutputNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const inVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".IN"),
  );

  return (
    <div className={`ff-node ff-node-output ff-exec-${execState}`}>
      <div className="ff-node-header">{data.label ?? "Output"}</div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-input">
          <Handle type="target" position={Position.Left} id="IN" />
          <span className="ff-port-label">IN</span>
          {inVar && (
            <span className="ff-port-value">{String(inVar.value)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
