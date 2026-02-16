// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Handle, Position } from "@xyflow/react";
import type { NodeOnlineData } from "../../../api/types";
import { getPortColor } from "../utils/portColors";

interface PropertyEntryNodeData {
  label?: string;
  accessor?: "GET" | "SET";
  dataType?: string;
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

export function PropertyEntryNode({ data }: { data: PropertyEntryNodeData }) {
  const accessor = data.accessor ?? "GET";
  const dataType = data.dataType ?? "BOOL";
  const execState = data.onlineData?.executionState ?? "idle";
  const execColor = execState === "active" ? "#ffffff" : getPortColor("EXEC");
  const label = data.label ?? "Property";
  const valueVar = findVar(data.onlineData, ".VALUE");

  return (
    <div className={`ff-node ff-node-propertyEntry ff-exec-${execState}`}>
      <div className="ff-node-header">
        <div className="ff-node-header-info">
          <span className="ff-node-label">{label}</span>
          <span className="ff-node-type-path">Property {accessor} · {dataType}</span>
        </div>
        {data.executionOrder != null && (
          <span className="ff-node-exec-order">#{data.executionOrder}</span>
        )}
      </div>
      <div className="ff-node-body">
        <div className="ff-port-row ff-port-exec">
          <div className="ff-port ff-port-input" />
          <div className="ff-port ff-port-output">
            <span className="ff-port-label" style={{ color: "#999" }}>ENO</span>
            <Handle type="source" position={Position.Right} id="ENO" style={{ background: execColor }} />
          </div>
        </div>
        {accessor === "SET" && (
          <div className="ff-port-row">
            <div className="ff-port ff-port-input" />
            <div className="ff-port ff-port-output">
              {valueVar && <span className={valueClass(dataType, valueVar.value)}>{String(valueVar.value)}</span>}
              <span className="ff-port-label">VALUE</span>
              <Handle type="source" position={Position.Right} id="VALUE" style={{ background: getPortColor(dataType) }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
