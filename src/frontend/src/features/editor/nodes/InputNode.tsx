// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";

interface InputNodeData {
  label?: string;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

export function InputNode({ data }: { data: InputNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const outVar = data.onlineData?.variables.find((v) =>
    v.path.endsWith(".OUT"),
  );

  return (
    <div className={`ff-node ff-node-input ff-exec-${execState}`}>
      <div className="ff-node-header">{data.label ?? "Input"}</div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-output">
          <span className="ff-port-label">OUT</span>
          {outVar && (
            <span className="ff-port-value">{String(outVar.value)}</span>
          )}
          <Handle type="source" position={Position.Right} id="OUT" />
        </div>
      </div>
    </div>
  );
}
