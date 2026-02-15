// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface EntryNodeData {
  label?: string;
  typePath?: string;
  executionOrder?: number;
  onlineData?: NodeOnlineData;
  [key: string]: unknown;
}

export function EntryNode({ data }: { data: EntryNodeData }) {
  const execState = data.onlineData?.executionState ?? "idle";
  const execColor = execState === "active" ? "#ffffff" : getPortColor("EXEC");
  return (
    <div className={`ff-node ff-node-entry ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{data.label ?? "Execution Entry"}</span>
          <span className="ff-node-type-path">{data.typePath ?? "PRG · MAIN"}</span>
        </div>
        {data.executionOrder != null && (
          <span className="ff-node-exec-order">#{data.executionOrder}</span>
        )}
      </div>
      <div className="ff-node-body">
        <div className="ff-port ff-port-output ff-port-exec">
          <span className="ff-port-label">ENO</span>
          <Handle
            type="source"
            position={Position.Right}
            id="ENO"
            style={{ background: execColor }}
          />
        </div>
      </div>
    </div>
  );
}
