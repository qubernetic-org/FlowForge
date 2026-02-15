// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  FlowNode,
  FlowConnection,
  NodeExecutionState,
  PlcVariableValue,
} from "../../../api/types";
import { categoryColor, categoryLabel, portColor } from "../utils/designTokens";
import { getPortColor } from "../utils/portColors";

interface NodeInspectorProps {
  isOnline: boolean;
  selectedNode: FlowNode | null;
  nodeStates: Map<string, NodeExecutionState>;
  variableValues: Map<string, PlcVariableValue>;
  connections: FlowConnection[];
  executionOrder?: Map<string, number>;
  totalExecNodes?: number;
  style?: React.CSSProperties;
}

const PORT_DATA_TYPES: Record<string, Record<string, string>> = {
  entry: {},
  input: { OUT: "BOOL" },
  output: { IN: "BOOL" },
  timer: { IN: "BOOL", PT: "TIME", Q: "BOOL", ET: "TIME" },
  counter: { CU: "BOOL", RESET: "BOOL", PV: "INT", Q: "BOOL", CV: "INT" },
  comparison: { A: "INT", B: "INT", OUT: "BOOL" },
  if: { COND: "BOOL" },
  for: { FROM: "INT", TO: "INT", i: "INT" },
  methodCall: { Cycles: "INT", Temp: "INT", RET: "BOOL" },
  methodEntry: { Cycles: "INT", Temp: "INT" },
};

const NODE_TYPE_LABELS: Record<string, string> = {
  entry: "PRG (Program)",
  input: "I/O Input Mapping",
  output: "I/O Output Mapping",
  timer: "FB — TON (On-Delay Timer)",
  counter: "FB — CTU (Up Counter)",
  comparison: "FUN — GE (Compare >=)",
  if: "CTRL — IF (Conditional)",
  for: "CTRL — FOR (Loop)",
  methodCall: "METHOD — CleanupCycle",
  methodEntry: "METHOD — CleanupCycle (Body)",
};

const EXEC_NODE_TYPES = new Set(["entry", "timer", "counter", "comparison", "if", "for", "methodCall", "methodEntry"]);

function ValuePill({ value, type }: { value: string; type: string }) {
  const isBoolFalse = type === "BOOL" && value === "FALSE";
  const color = isBoolFalse ? "#666" : portColor(type);
  const bg = isBoolFalse
    ? "rgba(100,100,100,0.1)"
    : `${getPortColor(type)}1F`;

  return (
    <span
      style={{
        padding: "1px 6px",
        borderRadius: 3,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontWeight: 600,
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

export function NodeInspector({
  isOnline,
  selectedNode,
  nodeStates,
  variableValues,
  connections,
  executionOrder,
  totalExecNodes,
  style,
}: NodeInspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="ff-panel-right" style={style}>
        <div className="ff-inspector-header">
          <span className="ff-inspector-title">PROPERTIES</span>
        </div>
        <div className="ff-inspector-empty">No node selected</div>
      </aside>
    );
  }

  const node = selectedNode;
  const label = (node.parameters.label as string) ?? node.type;
  const catColor = categoryColor(node.type);
  const catLabel = categoryLabel(node.type);
  const typeLabel = NODE_TYPE_LABELS[node.type] ?? node.type;
  const ports = PORT_DATA_TYPES[node.type] ?? {};
  const inputPorts = Object.entries(ports).filter(([, dt]) =>
    node.type === "input" ? false : true
  ).filter(([name]) => {
    if (node.type === "input") return false;
    if (node.type === "output") return name === "IN";
    if (node.type === "timer") return name === "IN" || name === "PT";
    if (node.type === "counter") return name === "CU" || name === "RESET" || name === "PV";
    if (node.type === "comparison") return name === "A" || name === "B";
    if (node.type === "methodCall") return name === "Cycles" || name === "Temp";
    if (node.type === "methodEntry") return false;
    return false;
  });
  const outputPorts = Object.entries(ports).filter(([name]) => {
    if (node.type === "input") return name === "OUT";
    if (node.type === "output") return false;
    if (node.type === "timer") return name === "Q" || name === "ET";
    if (node.type === "counter") return name === "Q" || name === "CV";
    if (node.type === "comparison") return name === "OUT";
    if (node.type === "methodCall") return name === "RET";
    if (node.type === "methodEntry") return name === "Cycles" || name === "Temp";
    return false;
  });

  function findConnection(portName: string, direction: "input" | "output") {
    if (direction === "input") {
      return connections.find(
        (c) => c.to.nodeId === node.id && c.to.portName === portName,
      );
    }
    return connections.find(
      (c) => c.from.nodeId === node.id && c.from.portName === portName,
    );
  }

  return (
    <aside className="ff-panel-right" style={style}>
      <div className="ff-inspector-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ff-inspector-title">PROPERTIES</span>
          <span
            className="ff-inspector-badge"
            style={{ background: catColor }}
          >
            {catLabel}
          </span>
        </div>
      </div>

      <div className="ff-inspector-body">
        {/* Live Values — online only */}
        {isOnline && (
          <>
            <div className="ff-inspector-live-header">
              <div className="ff-inspector-live-dot" />
              <span className="ff-inspector-live-label">Live Values</span>
            </div>
            <div className="ff-inspector-live-box">
              {Object.entries(ports).map(([portName, dataType]) => {
                const path = `MAIN.${node.id}.${portName}`;
                const v = variableValues.get(path);
                const valStr = v ? String(v.value) : "\u2014";
                return (
                  <div key={portName} className="ff-inspector-live-row">
                    <span className="ff-inspector-live-name">{portName}</span>
                    <ValuePill value={valStr} type={dataType} />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* General */}
        <div className="ff-inspector-section-title">General</div>
        <div className="ff-inspector-field">
          <div className="ff-inspector-field-label">Label</div>
          <input
            type="text"
            className="ff-inspector-input"
            value={label}
            readOnly
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div className="ff-inspector-field">
            <div className="ff-inspector-field-label">Type</div>
            <span
              className="ff-inspector-type-badge"
              style={{
                background: `${catColor}25`,
                color: catColor,
              }}
            >
              {typeLabel}
            </span>
          </div>
          <div className="ff-inspector-field">
            <div className="ff-inspector-field-label">ID</div>
            <span className="ff-inspector-id">{node.id}</span>
          </div>
        </div>

        {/* Input Ports */}
        {inputPorts.length > 0 && (
          <>
            <div className="ff-inspector-section-title">Inputs</div>
            {inputPorts.map(([portName]) => {
              const conn = findConnection(portName, "input");
              return (
                <div key={portName} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{portName}</span>
                  {conn ? (
                    <span
                      className="ff-inspector-connection-chip"
                      style={{
                        background: `${categoryColor(
                          // find source node type
                          "input",
                        )}20`,
                        color: categoryColor("input"),
                      }}
                    >
                      &larr; {conn.from.nodeId}.{conn.from.portName}
                    </span>
                  ) : (
                    <span className="ff-inspector-not-connected">
                      Not connected
                    </span>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Output Ports */}
        {outputPorts.length > 0 && (
          <>
            <div className="ff-inspector-section-title">Outputs</div>
            {outputPorts.map(([portName]) => {
              const conn = findConnection(portName, "output");
              return (
                <div key={portName} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{portName}</span>
                  {conn ? (
                    <span
                      className="ff-inspector-connection-chip"
                      style={{
                        background: `${categoryColor("input")}20`,
                        color: categoryColor("input"),
                      }}
                    >
                      &rarr; {conn.to.nodeId}.{conn.to.portName}
                    </span>
                  ) : (
                    <span className="ff-inspector-not-connected">
                      Not connected
                    </span>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Execution */}
        <div className="ff-inspector-section-title">Execution</div>
        {EXEC_NODE_TYPES.has(node.type) ? (
          <div className="ff-inspector-field">
            <span style={{ fontSize: 12, color: "#e0e0e0" }}>
              #{executionOrder?.get(node.id) ?? "?"}
            </span>
          </div>
        ) : (
          <div className="ff-inspector-field">
            <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
              Not in execution chain (I/O mapping)
            </span>
          </div>
        )}

        {/* Notes */}
        <div className="ff-inspector-section-title">Notes</div>
        <textarea
          className="ff-inspector-notes"
          placeholder="Add documentation..."
          readOnly
        />
      </div>

      <div className="ff-inspector-footer">
        <span className="ff-inspector-footer-text">1 node selected</span>
      </div>
    </aside>
  );
}
