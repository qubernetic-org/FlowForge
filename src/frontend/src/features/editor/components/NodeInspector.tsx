// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState, useEffect, useRef } from "react";
import type {
  FlowNode,
  FlowConnection,
  NodeExecutionState,
  PlcVariableValue,
} from "../../../api/types";
import { categoryColor, categoryLabel, portColor } from "../utils/designTokens";
import { getPortColor, getHeaderGradient } from "../utils/portColors";

interface MethodParameter {
  name: string;
  dataType: string;
  direction: "VAR_INPUT" | "VAR_OUTPUT" | "VAR_IN_OUT";
}

interface PouMethod {
  name: string;
  description?: string;
  nodeCount: number;
  returnType?: string;
  visibility?: string;
  parameters?: MethodParameter[];
}

interface PouProperty {
  name: string;
  dataType: string;
  hasGetter?: boolean;
  hasSetter?: boolean;
  referenceReturn?: boolean;
  visibility?: string;
  getterNodeCount?: number;
  setterNodeCount?: number;
}

interface PouInfo {
  name: string;
  type: string;
  task?: string;
  cycleTime?: string;
  bodyNodeCount?: number;
  methods?: PouMethod[];
  properties?: PouProperty[];
}

interface NodeInspectorProps {
  isOnline: boolean;
  selectedNode: FlowNode | null;
  nodeStates: Map<string, NodeExecutionState>;
  variableValues: Map<string, PlcVariableValue>;
  connections: FlowConnection[];
  executionOrder?: Map<string, number>;
  totalExecNodes?: number;
  pouInfo?: PouInfo;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  style?: React.CSSProperties;
}

const PORT_DATA_TYPES: Record<string, Record<string, string>> = {
  entry: {},
  varRead: { VALUE: "BOOL" },
  varWrite: { VALUE: "BOOL" },
  timer: { IN: "BOOL", PT: "TIME", Q: "BOOL", ET: "TIME" },
  counter: { CU: "BOOL", RESET: "BOOL", PV: "INT", Q: "BOOL", CV: "INT" },
  comparison: { A: "INT", B: "INT", OUT: "BOOL" },
  if: { COND: "BOOL" },
  for: { FROM: "INT", TO: "INT", i: "INT" },
  methodCall: { Cycles: "INT", Temp: "INT", RET: "BOOL" },
  methodEntry: { Cycles: "INT", Temp: "INT" },
};

const NODE_TYPE_LABELS: Record<string, string> = {
  entry: "PRG · MAIN",
  varRead: "VAR · READ",
  varWrite: "VAR · WRITE",
  timer: "Tc2_Standard.TON",
  counter: "Tc2_Standard.CTU",
  comparison: "Tc2_Standard.GE",
  if: "INSTR · IF",
  for: "INSTR · FOR",
  methodCall: "MAIN.CleanupCycle",
  methodEntry: "METHOD · CleanupCycle",
};

const EXEC_NODE_TYPES = new Set(["entry", "timer", "counter", "comparison", "if", "for", "methodCall", "methodEntry", "return", "propertyEntry"]);

const VISIBILITY_OPTIONS = ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "FINAL"];
const TYPE_CATALOG: { category: string; color: string; types: string[] }[] = [
  { category: "Primitives", color: "#60a5fa", types: ["BOOL", "INT", "DINT", "UINT", "SINT", "LINT", "REAL", "LREAL", "BYTE", "WORD", "DWORD", "STRING", "WSTRING", "TIME", "DATE", "DATE_AND_TIME"] },
  { category: "Structs", color: "#f97316", types: ["ST_AxisRef", "ST_MachineState", "ST_BatchData", "ST_Recipe"] },
  { category: "Enums", color: "#a78bfa", types: ["E_AxisState", "E_MachineMode", "E_ErrorCode"] },
  { category: "Interfaces", color: "#2dd4bf", types: ["I_Actuator", "I_Sensor", "I_Communication"] },
  { category: "Special", color: "#666", types: ["POINTER TO BYTE", "VOID"] },
];

function TypePicker({ value, onChange }: { value: string; onChange?: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const query = search.toLowerCase();
  const filtered = TYPE_CATALOG
    .map((cat) => ({
      ...cat,
      types: cat.types.filter((t) => t.toLowerCase().includes(query)),
    }))
    .filter((cat) => cat.types.length > 0);

  return (
    <div className="ff-type-picker" ref={ref}>
      <span
        className="ff-inspector-type-badge ff-type-picker-trigger"
        style={{
          background: `${getPortColor(value)}1F`,
          color: getPortColor(value),
          cursor: "pointer",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {value} ▾
      </span>
      {open && (
        <div className="ff-type-picker-popup">
          <input
            ref={inputRef}
            className="ff-type-picker-search"
            placeholder="Search types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ff-type-picker-list">
            {filtered.map((cat) => (
              <div key={cat.category}>
                <div className="ff-type-picker-category">
                  <span className="ff-type-picker-dot" style={{ background: cat.color }} />
                  {cat.category}
                </div>
                {cat.types.map((t) => (
                  <span
                    key={t}
                    className={`ff-type-picker-option ${t === value ? "ff-type-picker-option-active" : ""}`}
                    style={{
                      background: t === value ? `${getPortColor(t)}30` : undefined,
                      color: getPortColor(t),
                    }}
                    onClick={() => { onChange?.(t); setOpen(false); }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="ff-type-picker-empty">No matching types</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      className={`ff-toggle ${on ? "ff-toggle-on" : ""}`}
      onClick={() => setOn((v) => !v)}
    >
      <span className="ff-toggle-thumb" />
    </button>
  );
}

function Section({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ff-inspector-section">
      <div className="ff-inspector-section-header" onClick={() => setOpen((v) => !v)}>
        <div className="ff-toolbox-section-dot" style={{ background: "#666" }} />
        <span className="ff-toolbox-section-name">{title}</span>
        {count != null && <span className="ff-toolbox-section-count">{count}</span>}
        <span className="ff-toolbox-section-arrow">{open ? "\u25BE" : "\u25B8"}</span>
      </div>
      {open && children}
    </div>
  );
}

/* ── Method detail view ─────────────────────────────────────────────── */

function MethodDetail({
  method,
  pouName,
  onBack,
}: {
  method: PouMethod;
  pouName: string;
  onBack: () => void;
}) {
  const inputs = method.parameters?.filter((p) => p.direction === "VAR_INPUT") ?? [];
  const outputs = method.parameters?.filter((p) => p.direction === "VAR_OUTPUT" || p.direction === "VAR_IN_OUT") ?? [];

  return (
    <div className="ff-inspector-body">
      {/* Breadcrumb */}
      <div className="ff-inspector-breadcrumb">
        <span className="ff-inspector-breadcrumb-link" onClick={onBack}>{pouName}</span>
        <span className="ff-inspector-breadcrumb-sep">&rsaquo;</span>
        <span className="ff-inspector-breadcrumb-current">{method.name}</span>
      </div>

      <Section title="General">
        <div className="ff-inspector-field">
          <div className="ff-inspector-field-label">Name</div>
          <input type="text" className="ff-inspector-input" value={method.name} readOnly />
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Visibility</span>
          <select className="ff-inspector-select" defaultValue={method.visibility ?? "PUBLIC"}>
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Body</span>
          <span className="ff-inspector-kv-value">{method.nodeCount} nodes</span>
        </div>
      </Section>

      <Section title="Return">
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Type</span>
          <TypePicker value={method.returnType ?? "VOID"} />
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">REFERENCE TO</span>
          <ToggleSwitch defaultChecked={false} />
        </div>
      </Section>

      {(inputs.length > 0 || outputs.length > 0) && (
        <Section title="Parameters" count={inputs.length + outputs.length}>
          {inputs.length > 0 && (
            <>
              <div className="ff-inspector-field-label" style={{ marginBottom: 6 }}>VAR_INPUT</div>
              {inputs.map((p) => (
                <div key={p.name} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{p.name}</span>
                  <span
                    className="ff-inspector-type-badge"
                    style={{
                      background: `${getPortColor(p.dataType)}1F`,
                      color: getPortColor(p.dataType),
                      fontSize: 10,
                    }}
                  >
                    {p.dataType}
                  </span>
                </div>
              ))}
            </>
          )}
          {outputs.length > 0 && (
            <>
              <div className="ff-inspector-field-label" style={{ marginTop: 8, marginBottom: 6 }}>VAR_OUTPUT</div>
              {outputs.map((p) => (
                <div key={p.name} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{p.name}</span>
                  <span
                    className="ff-inspector-type-badge"
                    style={{
                      background: `${getPortColor(p.dataType)}1F`,
                      color: getPortColor(p.dataType),
                      fontSize: 10,
                    }}
                  >
                    {p.dataType}
                  </span>
                </div>
              ))}
            </>
          )}
        </Section>
      )}

      <Section title="Notes" defaultOpen={false}>
        <textarea className="ff-inspector-notes" placeholder="Add documentation..." readOnly />
      </Section>
    </div>
  );
}

/* ── Accessor detail view (GET / SET) ───────────────────────────────── */

function AccessorDetail({
  property,
  accessor,
  pouName,
  onBackToProperty,
  onBackToPou,
}: {
  property: PouProperty;
  accessor: "GET" | "SET";
  pouName: string;
  onBackToProperty: () => void;
  onBackToPou: () => void;
}) {
  const nodeCount = accessor === "GET" ? property.getterNodeCount ?? 0 : property.setterNodeCount ?? 0;
  return (
    <div className="ff-inspector-body">
      <div className="ff-inspector-breadcrumb">
        <span className="ff-inspector-breadcrumb-link" onClick={onBackToPou}>{pouName}</span>
        <span className="ff-inspector-breadcrumb-sep">&rsaquo;</span>
        <span className="ff-inspector-breadcrumb-link" onClick={onBackToProperty}>{property.name}</span>
        <span className="ff-inspector-breadcrumb-sep">&rsaquo;</span>
        <span className="ff-inspector-breadcrumb-current">{accessor}</span>
      </div>

      <Section title="General">
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Accessor</span>
          <span className="ff-inspector-kv-value">{accessor === "GET" ? "Getter" : "Setter"}</span>
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">{accessor === "GET" ? "Returns" : "Accepts"}</span>
          <span
            className="ff-inspector-type-badge"
            style={{
              background: `${getPortColor(property.dataType)}1F`,
              color: getPortColor(property.dataType),
            }}
          >
            {property.referenceReturn && accessor === "GET" ? "REF TO " : ""}{property.dataType}
          </span>
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Body</span>
          <span className="ff-inspector-kv-value">{nodeCount} nodes</span>
        </div>
      </Section>

      <Section title="Notes" defaultOpen={false}>
        <textarea className="ff-inspector-notes" placeholder="Add documentation..." readOnly />
      </Section>
    </div>
  );
}

/* ── Property detail view ───────────────────────────────────────────── */

function PropertyDetail({
  property,
  pouName,
  onBack,
  onOpenAccessor,
}: {
  property: PouProperty;
  pouName: string;
  onBack: () => void;
  onOpenAccessor: (accessor: "GET" | "SET") => void;
}) {
  return (
    <div className="ff-inspector-body">
      <div className="ff-inspector-breadcrumb">
        <span className="ff-inspector-breadcrumb-link" onClick={onBack}>{pouName}</span>
        <span className="ff-inspector-breadcrumb-sep">&rsaquo;</span>
        <span className="ff-inspector-breadcrumb-current">{property.name}</span>
      </div>

      <Section title="General">
        <div className="ff-inspector-field">
          <div className="ff-inspector-field-label">Name</div>
          <input type="text" className="ff-inspector-input" value={property.name} readOnly />
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Visibility</span>
          <select className="ff-inspector-select" defaultValue={property.visibility ?? "PUBLIC"}>
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">Type</span>
          <TypePicker value={property.dataType} />
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">REFERENCE TO</span>
          <ToggleSwitch defaultChecked={property.referenceReturn ?? false} />
        </div>
      </Section>

      <Section title="Accessors">
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">GET</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {property.hasGetter && (
              <span
                className="ff-inspector-breadcrumb-link"
                style={{ fontSize: 11 }}
                onClick={() => onOpenAccessor("GET")}
              >
                {property.getterNodeCount ?? 0} nodes &rarr;
              </span>
            )}
            <ToggleSwitch defaultChecked={property.hasGetter ?? false} />
          </div>
        </div>
        <div className="ff-inspector-kv">
          <span className="ff-inspector-kv-label">SET</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {property.hasSetter && (
              <span
                className="ff-inspector-breadcrumb-link"
                style={{ fontSize: 11 }}
                onClick={() => onOpenAccessor("SET")}
              >
                {property.setterNodeCount ?? 0} nodes &rarr;
              </span>
            )}
            <ToggleSwitch defaultChecked={property.hasSetter ?? false} />
          </div>
        </div>
      </Section>

      <Section title="Notes" defaultOpen={false}>
        <textarea className="ff-inspector-notes" placeholder="Add documentation..." readOnly />
      </Section>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export function NodeInspector({
  isOnline,
  selectedNode,
  nodeStates,
  variableValues,
  connections,
  executionOrder,
  totalExecNodes,
  pouInfo,
  collapsed,
  onToggleCollapsed,
  style,
}: NodeInspectorProps) {
  const [selectedMethodName, setSelectedMethodName] = useState<string | null>(null);
  const [selectedPropertyName, setSelectedPropertyName] = useState<string | null>(null);
  const [selectedAccessor, setSelectedAccessor] = useState<"GET" | "SET" | null>(null);

  // Reset selections when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setSelectedMethodName(null);
      setSelectedPropertyName(null);
      setSelectedAccessor(null);
    }
  }, [selectedNode]);

  const selectedMethod = selectedMethodName
    ? pouInfo?.methods?.find((m) => m.name === selectedMethodName) ?? null
    : null;
  const selectedProperty = selectedPropertyName
    ? pouInfo?.properties?.find((p) => p.name === selectedPropertyName) ?? null
    : null;

  if (collapsed) {
    return (
      <div className="ff-panel-collapsed ff-panel-collapsed-right" onClick={onToggleCollapsed}>
        <span className="ff-panel-collapsed-text">Inspector</span>
      </div>
    );
  }

  // ── No node selected: POU or Method detail ──
  if (!selectedNode) {
    // Method detail view
    if (selectedMethod && pouInfo) {
      return (
        <aside className="ff-panel-right" style={style}>
          <div className="ff-panel-header" onClick={onToggleCollapsed}>
            <span className="ff-panel-title">Inspector</span>
            <span className="ff-inspector-badge" style={{ background: "#D4883A" }}>
              METHOD
            </span>
          </div>
          <MethodDetail
            method={selectedMethod}
            pouName={pouInfo.name}
            onBack={() => setSelectedMethodName(null)}
          />
        </aside>
      );
    }

    // Accessor detail view (GET / SET inside a property)
    if (selectedProperty && selectedAccessor && pouInfo) {
      return (
        <aside className="ff-panel-right" style={style}>
          <div className="ff-panel-header" onClick={onToggleCollapsed}>
            <span className="ff-panel-title">Inspector</span>
            <span className="ff-inspector-badge" style={{ background: "#2dd4bf" }}>
              {selectedAccessor}
            </span>
          </div>
          <AccessorDetail
            property={selectedProperty}
            accessor={selectedAccessor}
            pouName={pouInfo.name}
            onBackToProperty={() => setSelectedAccessor(null)}
            onBackToPou={() => { setSelectedPropertyName(null); setSelectedAccessor(null); }}
          />
        </aside>
      );
    }

    // Property detail view
    if (selectedProperty && pouInfo) {
      return (
        <aside className="ff-panel-right" style={style}>
          <div className="ff-panel-header" onClick={onToggleCollapsed}>
            <span className="ff-panel-title">Inspector</span>
            <span className="ff-inspector-badge" style={{ background: "#2dd4bf" }}>
              PROPERTY
            </span>
          </div>
          <PropertyDetail
            property={selectedProperty}
            pouName={pouInfo.name}
            onBack={() => setSelectedPropertyName(null)}
            onOpenAccessor={(a) => setSelectedAccessor(a)}
          />
        </aside>
      );
    }

    // POU properties view
    return (
      <aside className="ff-panel-right" style={style}>
        <div className="ff-panel-header" onClick={onToggleCollapsed}>
          <span className="ff-panel-title">Inspector</span>
          {pouInfo && (
            <span
              className="ff-inspector-badge"
              style={{ background: "#C0392B" }}
            >
              {pouInfo.type}
            </span>
          )}
        </div>
        {pouInfo ? (
          <div className="ff-inspector-body">
            <Section title="General">
              <div className="ff-inspector-field">
                <div className="ff-inspector-field-label">Name</div>
                <input type="text" className="ff-inspector-input" value={pouInfo.name} readOnly />
              </div>
              <div className="ff-inspector-kv">
                <span className="ff-inspector-kv-label">Type</span>
                <span
                  className="ff-inspector-type-badge"
                  style={{ background: "rgba(192,57,43,0.15)", color: "#C0392B" }}
                >
                  {pouInfo.type}
                </span>
              </div>
              {pouInfo.task && (
                <div className="ff-inspector-kv">
                  <span className="ff-inspector-kv-label">Task</span>
                  <span className="ff-inspector-kv-value">{pouInfo.task}</span>
                </div>
              )}
              {pouInfo.cycleTime && (
                <div className="ff-inspector-kv">
                  <span className="ff-inspector-kv-label">Cycle Time</span>
                  <span className="ff-inspector-id">{pouInfo.cycleTime}</span>
                </div>
              )}
              <div className="ff-inspector-kv">
                <span className="ff-inspector-kv-label">Body</span>
                <span className="ff-inspector-kv-value">{pouInfo.bodyNodeCount ?? 0} nodes</span>
              </div>
            </Section>

            {pouInfo.methods && pouInfo.methods.length > 0 && (
              <Section title="Methods" count={pouInfo.methods.length}>
                {pouInfo.methods.map((m) => (
                  <div
                    key={m.name}
                    className="ff-toolbox-node-item"
                    onClick={() => setSelectedMethodName(m.name)}
                  >
                    <div
                      className="ff-toolbox-node-icon"
                      style={{ background: "#D4883A" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ff-toolbox-node-name">{m.name}</div>
                      <div className="ff-toolbox-node-desc">
                        {m.description ?? "METHOD"} · {m.nodeCount} nodes
                      </div>
                    </div>
                    {m.returnType && (
                      <span
                        className="ff-inspector-type-badge"
                        style={{
                          background: `${getPortColor(m.returnType)}1F`,
                          color: getPortColor(m.returnType),
                          fontSize: 10,
                          flexShrink: 0,
                        }}
                      >
                        {m.returnType}
                      </span>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {pouInfo.properties && pouInfo.properties.length > 0 && (
              <Section title="Properties" count={pouInfo.properties.length}>
                {pouInfo.properties.map((p) => {
                  const accessLabel = [p.hasGetter ? "GET" : null, p.hasSetter ? "SET" : null].filter(Boolean).join("/");
                  return (
                    <div
                      key={p.name}
                      className="ff-toolbox-node-item"
                      onClick={() => setSelectedPropertyName(p.name)}
                    >
                      <div
                        className="ff-toolbox-node-icon"
                        style={{ background: "#2dd4bf" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="ff-toolbox-node-name">{p.name}</div>
                        <div className="ff-toolbox-node-desc">
                          {accessLabel}{p.referenceReturn ? " · REF" : ""}
                        </div>
                      </div>
                      <span
                        className="ff-inspector-type-badge"
                        style={{
                          background: `${getPortColor(p.dataType)}1F`,
                          color: getPortColor(p.dataType),
                          fontSize: 10,
                          flexShrink: 0,
                        }}
                      >
                        {p.dataType}
                      </span>
                    </div>
                  );
                })}
              </Section>
            )}

            <Section title="Notes" defaultOpen={false}>
              <textarea className="ff-inspector-notes" placeholder="Add documentation..." readOnly />
            </Section>
          </div>
        ) : (
          <div className="ff-inspector-empty">No node selected</div>
        )}
      </aside>
    );
  }

  // ── Node selected ──
  const node = selectedNode;
  const label = (node.parameters.label as string) ?? node.type;
  const isVarNode = node.type === "varRead" || node.type === "varWrite";
  const varDataType = (node.parameters.dataType as string) ?? "BOOL";
  const catColor = isVarNode ? getPortColor(varDataType) : categoryColor(node.type);
  const catLabel = categoryLabel(node.type);
  const typeLabel = NODE_TYPE_LABELS[node.type] ?? node.type;
  const ports = PORT_DATA_TYPES[node.type] ?? {};
  const inputPorts = Object.entries(ports).filter(([name]) => {
    if (node.type === "varRead") return false;
    if (node.type === "varWrite") return name === "VAL";
    if (node.type === "timer") return name === "IN" || name === "PT";
    if (node.type === "counter") return name === "CU" || name === "RESET" || name === "PV";
    if (node.type === "comparison") return name === "A" || name === "B";
    if (node.type === "methodCall") return name === "Cycles" || name === "Temp";
    if (node.type === "methodEntry") return false;
    return false;
  });
  const outputPorts = Object.entries(ports).filter(([name]) => {
    if (node.type === "varRead") return name === "VAL";
    if (node.type === "varWrite") return false;
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
      <div className="ff-panel-header" onClick={onToggleCollapsed}>
        <span className="ff-panel-title">Inspector</span>
        <span
          className="ff-inspector-badge"
          style={{ background: catColor }}
        >
          {catLabel}
        </span>
      </div>

      <div className="ff-inspector-body">
        {/* Live Values — online only */}
        {isOnline && (
          <Section title="Live Values">
            <div className="ff-inspector-live-box">
              {Object.entries(ports).map(([portName, dataType]) => {
                const effectiveType = isVarNode && portName === "VALUE" ? varDataType : dataType;
                const path = `MAIN.${node.id}.${portName}`;
                const v = variableValues.get(path);
                const valStr = v ? String(v.value) : "\u2014";
                return (
                  <div key={portName} className="ff-inspector-live-row">
                    <span className="ff-inspector-live-name">{portName}</span>
                    <ValuePill value={valStr} type={effectiveType} />
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* General */}
        <Section title="General">
          <div className="ff-inspector-field">
            <div className="ff-inspector-field-label">Label</div>
            <input
              type="text"
              className="ff-inspector-input"
              value={label}
              readOnly
            />
          </div>
          <div className="ff-inspector-kv">
            <span className="ff-inspector-kv-label">Type</span>
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
          <div className="ff-inspector-kv">
            <span className="ff-inspector-kv-label">ID</span>
            <span className="ff-inspector-id">{node.id}</span>
          </div>
          {executionOrder?.has(node.id) && (
            <div className="ff-inspector-kv">
              <span className="ff-inspector-kv-label">Exec Order</span>
              <span className="ff-inspector-id">#{executionOrder.get(node.id)}</span>
            </div>
          )}
        </Section>

        {/* Input Ports */}
        {inputPorts.length > 0 && (
          <Section title="Inputs">
            {inputPorts.map(([portName]) => {
              const conn = findConnection(portName, "input");
              return (
                <div key={portName} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{portName}</span>
                  {conn ? (
                    <span
                      className="ff-inspector-connection-chip"
                      style={{
                        background: `${catColor}20`,
                        color: catColor,
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
          </Section>
        )}

        {/* Output Ports */}
        {outputPorts.length > 0 && (
          <Section title="Outputs">
            {outputPorts.map(([portName]) => {
              const conn = findConnection(portName, "output");
              return (
                <div key={portName} className="ff-inspector-port-row">
                  <span className="ff-inspector-port-name">{portName}</span>
                  {conn ? (
                    <span
                      className="ff-inspector-connection-chip"
                      style={{
                        background: `${catColor}20`,
                        color: catColor,
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
          </Section>
        )}

        {/* Notes */}
        <Section title="Notes" defaultOpen={false}>
          <textarea
            className="ff-inspector-notes"
            placeholder="Add documentation..."
            readOnly
          />
        </Section>
      </div>

      <div className="ff-inspector-footer">
        <span className="ff-inspector-footer-text">1 node selected</span>
      </div>
    </aside>
  );
}
