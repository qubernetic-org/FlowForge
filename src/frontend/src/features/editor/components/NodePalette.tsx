// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from "react";
import { T } from "../utils/designTokens";

interface NodePaletteProps {
  isOnline: boolean;
  style?: React.CSSProperties;
}

const toolboxCategories = [
  {
    name: "I/O", color: T.catIO, expanded: true,
    nodes: [
      { name: "Digital Input", desc: "Read PLC input" },
      { name: "Digital Output", desc: "Write PLC output" },
      { name: "Analog Input", desc: "Read analog value" },
      { name: "Analog Output", desc: "Write analog value" },
    ],
  },
  {
    name: "Function Blocks", color: T.catFB, expanded: true,
    nodes: [
      { name: "TON", desc: "On-delay timer" },
      { name: "TOF", desc: "Off-delay timer" },
      { name: "TP", desc: "Pulse timer" },
      { name: "CTU", desc: "Up counter" },
      { name: "CTD", desc: "Down counter" },
      { name: "CTUD", desc: "Up/down counter" },
    ],
  },
  {
    name: "Functions", color: T.catFun, expanded: true,
    nodes: [
      { name: "GE (>=)", desc: "Greater or equal" },
      { name: "GT (>)", desc: "Greater than" },
      { name: "LE (<=)", desc: "Less or equal" },
      { name: "EQ (=)", desc: "Equal" },
      { name: "ADD", desc: "Addition" },
      { name: "MUL", desc: "Multiplication" },
    ],
  },
  {
    name: "Methods", color: T.catMethod, expanded: true,
    nodes: [
      { name: "CleanupCycle", desc: "Run cleanup wash cycle" },
      { name: "Initialize", desc: "Initialize machine" },
    ],
  },
  { name: "Interfaces", color: T.catInterface, expanded: false, nodes: [], count: 0 },
];

const filterChips = ["All", "\u2605 Favorites", "I/O", "FB", "FUN", "Method", "Interface"];

export function NodePalette({ isOnline, style }: NodePaletteProps) {
  const [activeFilter] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="ff-panel-collapsed" onClick={() => setCollapsed(false)}>
        <span className="ff-panel-collapsed-text">NODES &#x25B8;</span>
      </div>
    );
  }

  return (
    <aside className="ff-panel-left" style={style}>
      <div className="ff-toolbox-header">
        <div className="ff-toolbox-title" style={{ cursor: "pointer" }} onClick={() => setCollapsed(true)}>&#x25C0; Nodes</div>
        <input
          type="text"
          className="ff-toolbox-search"
          placeholder="Search nodes..."
          readOnly
        />
      </div>

      <div className="ff-toolbox-filters">
        {filterChips.map((chip, i) => (
          <span
            key={chip}
            className={`ff-toolbox-chip ${i === activeFilter ? "ff-toolbox-chip-active" : ""}`}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="ff-toolbox-categories">
        {toolboxCategories.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 8 }}>
            <div className="ff-toolbox-section-header">
              <div
                className="ff-toolbox-section-dot"
                style={{ background: cat.color }}
              />
              <span className="ff-toolbox-section-name">{cat.name}</span>
              <span className="ff-toolbox-section-count">
                {cat.expanded
                  ? `${cat.nodes.length} nodes`
                  : `${cat.count ?? cat.nodes.length} nodes`}
              </span>
              <span className="ff-toolbox-section-arrow">
                {cat.expanded ? "\u25BE" : "\u25B8"}
              </span>
            </div>

            {cat.expanded &&
              cat.nodes.map((node) => (
                <div key={node.name} className="ff-toolbox-node-item">
                  <div
                    className="ff-toolbox-node-icon"
                    style={{ background: cat.color }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ff-toolbox-node-name">{node.name}</div>
                    <div className="ff-toolbox-node-desc">{node.desc}</div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="ff-toolbox-footer">
        Drag to canvas or double-click to add
      </div>
    </aside>
  );
}
