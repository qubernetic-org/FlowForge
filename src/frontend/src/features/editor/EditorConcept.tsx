// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

// Static UI concept — Edit mode + Online Monitor mode with mock live data.
// Toggle between modes via toolbar. Layout from Visily mockups, colors from Unity VS refs.

import React, { useState } from "react";

// ── Design Tokens (Unity VS reference) ──────────────────────────────────────

const T = {
  canvasBg: "#1a1a1a",
  gridLine: "#222",
  panelBg: "#252525",
  toolbarBg: "#333333",
  nodeBg: "#262626",
  nodeBorder: "#333",
  panelBorder: "#444",
  inputBg: "#171717",
  inputBorder: "#404040",
  textPrimary: "#e0e0e0",
  textSecondary: "#999",
  textLabel: "#a3a3a3",
  textMuted: "#666",
  accentBlue: "#3b82f6",
  accentGreen: "#22c55e",
  accentRed: "#ef4444",
  catIO: "#4A9E9E",
  catTimer: "#5BA0D5",
  catCounter: "#6A8EBF",
  catLogic: "#6B9E5B",
  catMath: "#C89B5B",
  catCompare: "#8B6BBF",
  portBool: "#84cc16",
  portInt: "#60a5fa",
  portTime: "#2dd4bf",
  portReal: "#f97316",
  fontUI: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  nodeRadius: 4,
  nodeShadow: "0 4px 15px rgba(0,0,0,0.5)",
  selectedGlow: "0 0 0 1px #3b82f6, 0 4px 15px rgba(0,0,0,0.5)",
  activeGlow: "0 0 15px rgba(34,197,94,0.35), 0 4px 15px rgba(0,0,0,0.5)",
  activeSelectedGlow: "0 0 0 1px #3b82f6, 0 0 15px rgba(34,197,94,0.35), 0 4px 15px rgba(0,0,0,0.5)",
} as const;

const css = {
  flexRow: { display: "flex", alignItems: "center" } as React.CSSProperties,
  flexCol: { display: "flex", flexDirection: "column" } as React.CSSProperties,
  gap: (n: number) => ({ gap: n }) as React.CSSProperties,
  ellipsis: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as React.CSSProperties,
};

function portColor(type: string) {
  switch (type) {
    case "BOOL": return T.portBool;
    case "INT": return T.portInt;
    case "TIME": return T.portTime;
    case "REAL": return T.portReal;
    default: return T.textMuted;
  }
}

// ── Value Pill (live data badge) ────────────────────────────────────────────

function ValuePill({ value, type }: { value: string; type: string }) {
  const isBoolTrue = type === "BOOL" && value === "TRUE";
  const isBoolFalse = type === "BOOL" && value === "FALSE";
  const color = isBoolFalse ? T.textMuted : portColor(type);
  const bg = isBoolFalse
    ? "rgba(100,100,100,0.1)"
    : `${portColor(type)}1F`; // ~12% opacity

  return (
    <span
      style={{
        padding: "1px 6px",
        borderRadius: 3,
        fontSize: 10,
        fontFamily: T.fontMono,
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

// ── Types ────────────────────────────────────────────────────────────────────

type EditorMode = "edit" | "online";

// ── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ mode, onToggle }: { mode: EditorMode; onToggle: () => void }) {
  return (
    <header
      style={{
        height: 48,
        background: T.toolbarBg,
        borderBottom: `1px solid ${T.panelBorder}`,
        ...css.flexRow,
        justifyContent: "space-between",
        padding: "0 16px",
        fontFamily: T.fontUI,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ ...css.flexRow, ...css.gap(12) }}>
        <div style={{ ...css.flexRow, ...css.gap(6) }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: 6, background: T.catIO,
              ...css.flexRow, justifyContent: "center",
              fontWeight: 800, fontSize: 12, color: "#fff",
            }}
          >FF</div>
          <span style={{ color: T.textMuted, fontSize: 13 }}>FlowForge</span>
        </div>
        <span style={{ color: T.textMuted, fontSize: 12 }}>Projects &gt;</span>
        <span style={{ color: T.textPrimary, fontSize: 13, fontWeight: 600 }}>
          Motor Control v2.1
        </span>
      </div>

      {/* Center — Edit / Online toggle */}
      <div style={{ ...css.flexRow, ...css.gap(16) }}>
        <div
          style={{
            ...css.flexRow,
            background: "#222",
            borderRadius: 6,
            padding: 2,
            border: `1px solid ${T.panelBorder}`,
          }}
        >
          <button
            onClick={mode === "online" ? onToggle : undefined}
            style={{
              padding: "5px 20px", borderRadius: 4, border: "none",
              background: mode === "edit" ? T.accentBlue : "transparent",
              color: mode === "edit" ? "#fff" : T.textMuted,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >EDIT</button>
          <button
            onClick={mode === "edit" ? onToggle : undefined}
            style={{
              padding: "5px 20px", borderRadius: 4, border: "none",
              background: mode === "online" ? T.accentGreen : "transparent",
              color: mode === "online" ? "#fff" : T.textMuted,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >ONLINE</button>
        </div>

        {/* Connection status — only in Online mode */}
        {mode === "online" && (
          <div style={{ ...css.flexRow, ...css.gap(8) }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accentGreen }} />
            <span style={{ fontSize: 12, color: T.textPrimary }}>PLC-Demo (5.39.123.1.1.1)</span>
            <span style={{ fontSize: 11, color: T.accentGreen, fontWeight: 600 }}>Connected</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ ...css.flexRow, ...css.gap(12) }}>
        <button
          style={{
            ...css.flexRow, ...css.gap(4),
            padding: "5px 12px", borderRadius: 4,
            border: `1px solid ${T.panelBorder}`,
            background: "transparent", color: T.textSecondary,
            fontSize: 12, cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>&#x1F528;</span> Build
        </button>
        {mode === "edit" && (
          <button
            style={{
              ...css.flexRow, ...css.gap(4),
              padding: "5px 12px", borderRadius: 4,
              border: `1px solid ${T.panelBorder}`,
              background: "transparent", color: T.textSecondary,
              fontSize: 12, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14 }}>&#x1F680;</span> Deploy
          </button>
        )}
        {mode === "online" && (
          <button
            style={{
              ...css.flexRow, ...css.gap(4),
              padding: "5px 16px", borderRadius: 4, border: "none",
              background: T.accentRed, color: "#fff",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >Go Offline</button>
        )}
        {mode === "edit" && (
          <span style={{ fontSize: 11, color: T.textMuted }}>Saved 2 min ago</span>
        )}
        <div
          style={{
            width: 32, height: 32, borderRadius: "50%", background: "#444",
            ...css.flexRow, justifyContent: "center", fontSize: 12, color: T.textSecondary,
          }}
        >CB</div>
      </div>
    </header>
  );
}

// ── Collapsed Node Toolbox (Online mode) ────────────────────────────────────

function CollapsedToolbox() {
  return (
    <div
      style={{
        width: 20,
        background: T.panelBg,
        borderRight: `1px solid ${T.panelBorder}`,
        ...css.flexCol,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      <span style={{ color: T.textMuted, fontSize: 12, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        NODES &#x25B8;
      </span>
    </div>
  );
}

// ── Node Toolbox (Edit mode — expanded panel) ───────────────────────────────

const toolboxCategories = [
  {
    name: "I/O", color: T.catIO, expanded: true,
    nodes: [
      { name: "Digital Input", desc: "Read PLC input", fav: false },
      { name: "Digital Output", desc: "Write PLC output", fav: false },
      { name: "Analog Input", desc: "Read analog value", fav: true },
      { name: "Analog Output", desc: "Write analog value", fav: false },
    ],
  },
  {
    name: "Timers", color: T.catTimer, expanded: true,
    nodes: [
      { name: "TON", desc: "On-delay timer", fav: false },
      { name: "TOF", desc: "Off-delay timer", fav: false },
      { name: "TP", desc: "Pulse timer", fav: false },
    ],
  },
  { name: "Logic", color: T.catLogic, expanded: false, nodes: [], count: 4 },
  { name: "Math", color: T.catMath, expanded: false, nodes: [], count: 4 },
  { name: "Counters", color: T.catCounter, expanded: false, nodes: [], count: 3 },
];

const filterChips = ["All", "\u2605 Favorites", "I/O", "Logic", "Timers", "Counters", "Math", "Compare"];

function NodeToolbox() {
  return (
    <aside
      style={{
        width: 260,
        background: T.panelBg,
        borderRight: `1px solid ${T.panelBorder}`,
        ...css.flexCol,
        fontFamily: T.fontUI,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "12px 14px 8px", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 10 }}>
          Nodes
        </div>
        <input
          type="text"
          placeholder="Search nodes..."
          readOnly
          style={{
            width: "100%",
            padding: "7px 10px 7px 30px",
            fontSize: 12,
            background: T.inputBg,
            border: `1px solid ${T.inputBorder}`,
            borderRadius: 4,
            color: T.textPrimary,
            outline: "none",
            boxSizing: "border-box",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "8px center",
          }}
        />
      </div>

      {/* Filter chips */}
      <div
        style={{
          ...css.flexRow,
          ...css.gap(4),
          padding: "4px 14px 8px",
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {filterChips.map((chip, i) => (
          <span
            key={chip}
            style={{
              padding: "3px 10px",
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              background: i === 0 ? T.accentBlue : "#333",
              color: i === 0 ? "#fff" : T.textSecondary,
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Category sections */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 14px 14px" }}>
        {toolboxCategories.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 8 }}>
            {/* Section header */}
            <div
              style={{
                ...css.flexRow,
                ...css.gap(8),
                padding: "6px 0",
                cursor: "pointer",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, flex: 1 }}>{cat.name}</span>
              <span style={{ fontSize: 10, color: T.textMuted }}>
                {cat.expanded ? `${cat.nodes.length} nodes` : `${cat.count ?? cat.nodes.length} nodes`}
              </span>
              <span style={{ fontSize: 10, color: T.textMuted }}>
                {cat.expanded ? "\u25BE" : "\u25B8"}
              </span>
            </div>

            {/* Node items */}
            {cat.expanded &&
              cat.nodes.map((node) => (
                <div
                  key={node.name}
                  style={{
                    ...css.flexRow,
                    ...css.gap(8),
                    padding: "6px 8px",
                    background: "#333",
                    borderRadius: 3,
                    marginBottom: 2,
                    cursor: "grab",
                  }}
                >
                  <div
                    style={{
                      width: 16, height: 16, borderRadius: 3,
                      background: cat.color, opacity: 0.8, flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, ...css.ellipsis }}>{node.name}</div>
                    <div style={{ fontSize: 10, color: T.textSecondary, ...css.ellipsis }}>{node.desc}</div>
                  </div>
                  <span style={{ fontSize: 14, color: node.fav ? "#f59e0b" : T.textMuted, cursor: "pointer", flexShrink: 0 }}>
                    {node.fav ? "\u2605" : "\u2606"}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.panelBorder}`, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: T.textMuted }}>Drag to canvas or double-click to add</span>
      </div>
    </aside>
  );
}

// ── Canvas Node (Online with live values) ───────────────────────────────────

interface LivePortDef {
  name: string;
  type: "BOOL" | "INT" | "TIME";
  side: "left" | "right";
  value?: string;
}

function CanvasNode({
  category,
  categoryColor,
  name,
  ports,
  selected,
  active,
  style,
}: {
  category: string;
  categoryColor: string;
  name: string;
  ports: LivePortDef[];
  selected?: boolean;
  active?: boolean;
  style?: React.CSSProperties;
}) {
  const leftPorts = ports.filter((p) => p.side === "left");
  const rightPorts = ports.filter((p) => p.side === "right");
  const rows = Math.max(leftPorts.length, rightPorts.length);

  let borderColor = T.nodeBorder;
  let shadow = T.nodeShadow;
  if (selected && active) {
    borderColor = T.accentBlue;
    shadow = T.activeSelectedGlow;
  } else if (selected) {
    borderColor = T.accentBlue;
    shadow = T.selectedGlow;
  } else if (active) {
    borderColor = T.accentGreen;
    shadow = T.activeGlow;
  }

  return (
    <div
      style={{
        position: "absolute",
        width: 200,
        background: T.nodeBg,
        border: `1px solid ${borderColor}`,
        borderRadius: T.nodeRadius,
        boxShadow: shadow,
        fontFamily: T.fontUI,
        overflow: "hidden",
        zIndex: 1,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "5px 10px",
          background: categoryColor,
          borderBottom: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <span
          style={{
            fontSize: 9, fontWeight: 600, textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)", letterSpacing: 0.5,
            display: "block",
          }}
        >{category}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{name}</span>
      </div>

      {/* Ports with live values */}
      <div style={{ padding: "4px 0" }}>
        {Array.from({ length: rows }).map((_, i) => {
          const lp = leftPorts[i];
          const rp = rightPorts[i];
          return (
            <div
              key={i}
              style={{
                ...css.flexRow,
                justifyContent: "space-between",
                padding: "2px 8px",
                minHeight: 24,
              }}
            >
              {/* Left port */}
              <div style={{ ...css.flexRow, ...css.gap(5), flex: 1, minWidth: 0 }}>
                {lp ? (
                  <>
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: portColor(lp.type), flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: T.textLabel }}>{lp.name}</span>
                    {lp.value && <ValuePill value={lp.value} type={lp.type} />}
                  </>
                ) : <span />}
              </div>
              {/* Right port */}
              <div style={{ ...css.flexRow, ...css.gap(5), justifyContent: "flex-end" }}>
                {rp && (
                  <>
                    {rp.value && <ValuePill value={rp.value} type={rp.type} />}
                    <span style={{ fontSize: 11, color: T.textLabel }}>{rp.name}</span>
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: portColor(rp.type), flexShrink: 0,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SVG Wires with value badges ─────────────────────────────────────────────

function Wire({
  x1, y1, x2, y2, color, active, label,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; active?: boolean; label?: string;
}) {
  const cx1 = x1 + (x2 - x1) * 0.4;
  const cx2 = x2 - (x2 - x1) * 0.4;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
        stroke={color}
        strokeWidth={active ? 3 : 2}
        fill="none"
        opacity={active ? 1 : 0.6}
      />
      {label && (
        <g transform={`translate(${mx}, ${my})`}>
          <rect x={-20} y={-10} width={40} height={20} rx={4} fill={T.canvasBg} stroke={T.panelBorder} strokeWidth={1} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={10}
            fontFamily={T.fontMono}
            fontWeight={600}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

// ── Flow Canvas ─────────────────────────────────────────────────────────────

function FlowCanvas({ mode }: { mode: EditorMode }) {
  const isOnline = mode === "online";
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        background: T.canvasBg,
        overflow: "hidden",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(to right, ${T.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${T.gridLine} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Wires */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <Wire x1={300} y1={105} x2={360} y2={90} color={T.portBool} active={isOnline} label={isOnline ? "TRUE" : undefined} />
        <Wire x1={300} y1={105} x2={480} y2={90} color={T.portBool} active={isOnline} label={isOnline ? "TRUE" : undefined} />
        <Wire x1={550} y1={90} x2={730} y2={230} color={T.portBool} active={isOnline} label={isOnline ? "TRUE" : undefined} />
        <Wire x1={670} y1={130} x2={720} y2={100} color={T.portInt} active={isOnline} label={isOnline ? "7" : undefined} />
        <Wire x1={910} y1={100} x2={950} y2={230} color={T.portBool} label={isOnline ? "FALSE" : undefined} />
      </svg>

      {/* Node 1: Start Button */}
      <CanvasNode
        category="I/O INPUT"
        categoryColor={T.catIO}
        name="Start Button"
        active={isOnline}
        ports={[
          { name: "OUT", type: "BOOL", side: "right", value: isOnline ? "TRUE" : undefined },
        ]}
        style={{ left: 100, top: 70 }}
      />

      {/* Node 2: Delay T#2S */}
      <CanvasNode
        category="TIMER"
        categoryColor={T.catTimer}
        name="Delay T#2S"
        active={isOnline}
        ports={[
          { name: "IN", type: "BOOL", side: "left", value: isOnline ? "TRUE" : undefined },
          { name: "PT", type: "TIME", side: "left", value: isOnline ? "T#2S" : undefined },
          { name: "Q", type: "BOOL", side: "right", value: isOnline ? "TRUE" : undefined },
          { name: "ET", type: "TIME", side: "right", value: isOnline ? "T#1400MS" : undefined },
        ]}
        style={{ left: 360, top: 50 }}
      />

      {/* Node 3: Part Counter — SELECTED */}
      <CanvasNode
        category="COUNTER"
        categoryColor={T.catCounter}
        name="Part Counter"
        active={isOnline}
        selected
        ports={[
          { name: "CU", type: "BOOL", side: "left", value: isOnline ? "TRUE" : undefined },
          { name: "RESET", type: "BOOL", side: "left", value: isOnline ? "FALSE" : undefined },
          { name: "PV", type: "INT", side: "left", value: isOnline ? "10" : undefined },
          { name: "Q", type: "BOOL", side: "right", value: isOnline ? "FALSE" : undefined },
          { name: "CV", type: "INT", side: "right", value: isOnline ? "7" : undefined },
        ]}
        style={{ left: 480, top: 50 }}
      />

      {/* Node 4: >= */}
      <CanvasNode
        category="COMPARE"
        categoryColor={T.catCompare}
        name=">="
        active={isOnline}
        ports={[
          { name: "A", type: "INT", side: "left", value: isOnline ? "7" : undefined },
          { name: "B", type: "INT", side: "left", value: isOnline ? "10" : undefined },
          { name: "OUT", type: "BOOL", side: "right", value: isOnline ? "FALSE" : undefined },
        ]}
        style={{ left: 720, top: 60 }}
      />

      {/* Node 5: Motor ON */}
      <CanvasNode
        category="I/O OUTPUT"
        categoryColor={T.catIO}
        name="Motor ON"
        active={isOnline}
        ports={[
          { name: "IN", type: "BOOL", side: "left", value: isOnline ? "TRUE" : undefined },
        ]}
        style={{ left: 730, top: 200 }}
      />

      {/* Node 6: Batch Done — IDLE in online, normal in edit */}
      <CanvasNode
        category="I/O OUTPUT"
        categoryColor={T.catIO}
        name="Batch Done"
        ports={[
          { name: "IN", type: "BOOL", side: "left", value: isOnline ? "FALSE" : undefined },
        ]}
        style={{ left: 950, top: 200 }}
      />

      {/* MiniMap */}
      <div
        style={{
          position: "absolute", bottom: 16, right: 16,
          width: 140, height: 90,
          background: "rgba(30,30,30,0.9)",
          border: `1px solid ${T.panelBorder}`, borderRadius: 4,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={{ position: "absolute", left: 10, top: 28, width: 14, height: 8, background: T.catIO, borderRadius: 1, opacity: 0.7, boxShadow: `0 0 4px ${T.accentGreen}` }} />
          <div style={{ position: "absolute", left: 35, top: 22, width: 14, height: 12, background: T.catTimer, borderRadius: 1, opacity: 0.7, boxShadow: `0 0 4px ${T.accentGreen}` }} />
          <div style={{ position: "absolute", left: 52, top: 22, width: 14, height: 14, background: T.catCounter, borderRadius: 1, opacity: 0.9, border: `1px solid ${T.accentBlue}`, boxShadow: `0 0 4px ${T.accentGreen}` }} />
          <div style={{ position: "absolute", left: 78, top: 24, width: 14, height: 10, background: T.catCompare, borderRadius: 1, opacity: 0.7, boxShadow: `0 0 4px ${T.accentGreen}` }} />
          <div style={{ position: "absolute", left: 80, top: 50, width: 14, height: 8, background: T.catIO, borderRadius: 1, opacity: 0.7, boxShadow: `0 0 4px ${T.accentGreen}` }} />
          <div style={{ position: "absolute", left: 105, top: 50, width: 14, height: 8, background: T.catIO, borderRadius: 1, opacity: 0.4 }} />
        </div>
      </div>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
          ...css.flexRow, ...css.gap(4),
          background: "rgba(30,30,30,0.9)",
          border: `1px solid ${T.panelBorder}`, borderRadius: 6, padding: 3,
        }}
      >
        {["+", "85%", "\u2212", "\u2922"].map((label, i) => (
          <button
            key={i}
            style={{
              width: label === "85%" ? 48 : 32, height: 28,
              border: "none", background: "transparent",
              color: label === "85%" ? T.textPrimary : T.textSecondary,
              fontSize: label === "85%" ? 12 : 16,
              fontWeight: label === "85%" ? 600 : 400,
              cursor: "pointer", borderRadius: 3, fontFamily: T.fontUI,
            }}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

// ── Node Inspector (Online — with Live Values) ─────────────────────────────

function InspectorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function ConnectionChip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ padding: "2px 8px", borderRadius: 10, background: `${color}20`, color, fontSize: 11, fontWeight: 500 }}>
      {label}
    </span>
  );
}

function LiveValueRow({ name, value, type }: { name: string; value: string; type: string }) {
  return (
    <div style={{ ...css.flexRow, justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: T.textLabel }}>{name}</span>
      <ValuePill value={value} type={type} />
    </div>
  );
}

function NodeInspectorPanel({ mode }: { mode: EditorMode }) {
  return (
    <aside
      style={{
        width: 280, background: T.panelBg,
        borderLeft: `1px solid ${T.panelBorder}`,
        ...css.flexCol, fontFamily: T.fontUI, flexShrink: 0, overflow: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: `1px solid ${T.panelBorder}`,
          ...css.flexRow, justifyContent: "space-between",
        }}
      >
        <div style={{ ...css.flexRow, ...css.gap(8) }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>PROPERTIES</span>
          <span style={{ padding: "2px 8px", borderRadius: 10, background: T.catCounter, color: "#fff", fontSize: 10, fontWeight: 600 }}>
            CTU
          </span>
        </div>
        <span style={{ color: T.textMuted, fontSize: 16, cursor: "pointer" }}>&#x2699;</span>
      </div>

      <div style={{ padding: "12px 14px", flex: 1 }}>
        {/* Live Values section — Online mode only */}
        {mode === "online" && (
          <>
            <div style={{ ...css.flexRow, ...css.gap(6), marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accentGreen }} />
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: T.accentGreen }}>
                Live Values
              </span>
            </div>
            <div
              style={{
                background: `${T.accentGreen}0A`,
                border: `1px solid ${T.accentGreen}25`,
                borderRadius: 4,
                padding: "8px 10px",
                marginBottom: 16,
              }}
            >
              <LiveValueRow name="CU" value="TRUE" type="BOOL" />
              <LiveValueRow name="RESET" value="FALSE" type="BOOL" />
              <LiveValueRow name="PV" value="10" type="INT" />
              <LiveValueRow name="Q" value="FALSE" type="BOOL" />
              <LiveValueRow name="CV" value="7" type="INT" />
            </div>
          </>
        )}

        {/* General */}
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: T.textSecondary, marginBottom: 10 }}>
          General
        </div>

        <InspectorField label="Label">
          <input
            type="text" value="Part Counter" readOnly
            style={{
              width: "100%", padding: "6px 10px", fontSize: 12,
              background: T.inputBg, border: `1px solid ${T.inputBorder}`,
              borderRadius: 4, color: T.textPrimary, outline: "none", boxSizing: "border-box",
            }}
          />
        </InspectorField>

        <div style={{ ...css.flexRow, ...css.gap(12), marginBottom: 12 }}>
          <InspectorField label="Type">
            <span style={{ padding: "3px 8px", borderRadius: 4, background: `${T.catCounter}25`, color: T.catCounter, fontSize: 11, fontWeight: 500 }}>
              CTU (Up Counter)
            </span>
          </InspectorField>
          <InspectorField label="ID">
            <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fontMono }}>counter_1</span>
          </InspectorField>
        </div>

        {/* Input Ports */}
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: T.textSecondary, marginBottom: 10, marginTop: 8 }}>
          Input Ports
        </div>
        <div style={{ ...css.flexRow, justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: T.textPrimary }}>CU</span>
          <ConnectionChip label="&larr; Start Button.OUT" color={T.catIO} />
        </div>
        <div style={{ ...css.flexRow, justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: T.textPrimary }}>RESET</span>
          <span style={{ fontSize: 11, color: T.textMuted, fontStyle: "italic" }}>Not connected</span>
        </div>
        <InspectorField label="PV (Preset Value)">
          <input
            type="number" value="10" readOnly
            style={{
              width: "100%", padding: "6px 10px", fontSize: 12,
              background: T.inputBg, border: `1px solid ${T.inputBorder}`,
              borderRadius: 4, color: T.accentBlue, fontFamily: T.fontMono,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </InspectorField>

        {/* Output Ports */}
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: T.textSecondary, marginBottom: 10, marginTop: 8 }}>
          Output Ports
        </div>
        <div style={{ ...css.flexRow, justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: T.textPrimary }}>Q (Done)</span>
          <span style={{ fontSize: 11, color: T.textMuted, fontStyle: "italic" }}>Not connected</span>
        </div>
        <div style={{ ...css.flexRow, justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: T.textPrimary }}>CV (Current)</span>
          <ConnectionChip label="&rarr; Comparison.A" color={T.catIO} />
        </div>

        {/* Notes */}
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: T.textSecondary, marginBottom: 10, marginTop: 8 }}>
          Notes
        </div>
        <textarea
          placeholder="Add documentation for this counter logic..."
          readOnly
          style={{
            width: "100%", height: 60, padding: "8px 10px", fontSize: 12,
            background: T.inputBg, border: `1px solid ${T.inputBorder}`,
            borderRadius: 4, color: T.textPrimary, resize: "none",
            outline: "none", boxSizing: "border-box", fontFamily: T.fontUI,
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.panelBorder}`, ...css.flexRow, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 11, color: T.textMuted }}>1 node selected</span>
      </div>
    </aside>
  );
}

// ── Watch Table (Expanded) ──────────────────────────────────────────────────

const watchData = [
  { path: "MAIN.counter_1.CV", value: "7", type: "INT", color: T.portInt, time: "14:23:05.123" },
  { path: "MAIN.timer_1.ET", value: "T#1400MS", type: "TIME", color: T.portTime, time: "14:23:05.089" },
  { path: "MAIN.input_1.OUT", value: "TRUE", type: "BOOL", color: T.portBool, time: "14:23:05.201" },
  { path: "MAIN.counter_1.Q", value: "FALSE", type: "BOOL", color: T.textMuted, time: "14:23:05.123" },
  { path: "MAIN.output_1.IN", value: "TRUE", type: "BOOL", color: T.portBool, time: "14:23:05.201" },
];

function WatchTable() {
  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "6px 12px",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    color: T.textMuted,
    borderBottom: `1px solid ${T.panelBorder}`,
  };

  return (
    <div
      style={{
        height: 200,
        background: T.panelBg,
        borderTop: `1px solid ${T.panelBorder}`,
        ...css.flexCol,
        fontFamily: T.fontUI,
        flexShrink: 0,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          ...css.flexRow, justifyContent: "space-between",
          padding: "6px 16px",
          borderBottom: `1px solid ${T.panelBorder}`,
          background: T.toolbarBg,
          flexShrink: 0,
        }}
      >
        <div style={{ ...css.flexRow, ...css.gap(12) }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary }}>&#x25BE; Watch</span>
          <span
            style={{
              padding: "1px 8px", borderRadius: 8,
              background: `${T.accentBlue}20`, color: T.accentBlue,
              fontSize: 10, fontWeight: 600,
            }}
          >
            {watchData.length} variables
          </span>
        </div>
        <div style={{ ...css.flexRow, ...css.gap(8) }}>
          <input
            type="text" placeholder="MAIN.nCounter" readOnly
            style={{
              width: 200, padding: "4px 8px", fontSize: 11,
              background: T.inputBg, border: `1px solid ${T.inputBorder}`,
              borderRadius: 4, color: T.textPrimary, outline: "none",
              fontFamily: T.fontMono,
            }}
          />
          <button
            style={{
              padding: "4px 12px", borderRadius: 4, border: "none",
              background: T.accentBlue, color: "#fff",
              fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}
          >Add</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "40%" }}>Variable</th>
              <th style={{ ...thStyle, width: "18%" }}>Value</th>
              <th style={{ ...thStyle, width: "12%" }}>Type</th>
              <th style={{ ...thStyle, width: "22%" }}>Timestamp</th>
              <th style={{ ...thStyle, width: "8%" }} />
            </tr>
          </thead>
          <tbody>
            {watchData.map((row, i) => (
              <tr key={row.path} style={{ background: i % 2 === 0 ? T.panelBg : "#2a2a2a" }}>
                <td style={{ padding: "5px 12px", fontFamily: T.fontMono, color: T.textLabel, fontSize: 11 }}>
                  {row.path}
                </td>
                <td style={{ padding: "5px 12px", fontFamily: T.fontMono, color: row.color, fontWeight: 600, fontSize: 12 }}>
                  {row.value}
                </td>
                <td style={{ padding: "5px 12px", color: T.textMuted, fontSize: 11 }}>
                  {row.type}
                </td>
                <td style={{ padding: "5px 12px", color: T.textMuted, fontSize: 11, fontFamily: T.fontMono }}>
                  {row.time}
                </td>
                <td style={{ padding: "5px 8px", textAlign: "center" }}>
                  <span style={{ color: T.textMuted, cursor: "pointer", fontSize: 14 }}>&times;</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Collapsed Watch Bar (Edit mode) ──────────────────────────────────────────

function CollapsedWatchBar() {
  return (
    <div
      style={{
        height: 32,
        background: T.toolbarBg,
        borderTop: `1px solid ${T.panelBorder}`,
        ...css.flexRow,
        justifyContent: "space-between",
        padding: "0 16px",
        fontFamily: T.fontUI,
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary }}>&#x25B8; Watch</span>
      <span style={{ fontSize: 10, color: T.textMuted }}>0 variables</span>
    </div>
  );
}

// ── Main Concept Layout ─────────────────────────────────────────────────────

export function EditorConcept() {
  const [mode, setMode] = useState<EditorMode>("edit");
  const toggle = () => setMode((m) => (m === "edit" ? "online" : "edit"));

  return (
    <div
      style={{
        width: "100vw", height: "100vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        fontFamily: T.fontUI,
        background: T.canvasBg,
        color: T.textPrimary,
      }}
    >
      <Toolbar mode={mode} onToggle={toggle} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {mode === "edit" ? <NodeToolbox /> : <CollapsedToolbox />}
        <FlowCanvas mode={mode} />
        <NodeInspectorPanel mode={mode} />
      </div>
      {mode === "online" ? <WatchTable /> : <CollapsedWatchBar />}
    </div>
  );
}
