// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from "react";
import type { PlcVariableValue } from "../../../api/types";

interface WatchPanelProps {
  isOnline: boolean;
  watchList: string[];
  variableValues: Map<string, PlcVariableValue>;
  onAdd: (path: string) => void;
  onRemove: (path: string) => void;
  style?: React.CSSProperties;
}

function watchValueClass(dataType: string): string {
  const dt = dataType.toLowerCase();
  if (dt === "bool" || dt === "int" || dt === "time" || dt === "real") {
    return `ff-watch-value ff-watch-value-${dt}`;
  }
  return "ff-watch-value ff-watch-value-default";
}

// TODO: Split this panel into tabbed sections (or side-by-side when wide enough):
//   1. "Watch" tab — current variable watch table (as-is)
//   2. "Debug Console" tab — scrollable log output showing:
//      - Flow validation errors (missing connections, type mismatches)
//      - ADS communication errors (timeout, access denied, symbol not found)
//      - Build output / warnings forwarded from build server
//      - User-facing log messages (e.g. from a future LogMessage node)
//      - Timestamped entries with severity icons (info / warn / error)
//   Layout strategy: when panel height > ~300px, show tabs side-by-side (50/50);
//   otherwise use tab switcher. Consider a shared filter/search bar across both.

export function WatchPanel({
  isOnline,
  watchList,
  variableValues,
  onAdd,
  onRemove,
  style,
}: WatchPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newPath, setNewPath] = useState("");

  const handleAdd = () => {
    const trimmed = newPath.trim();
    if (trimmed) {
      onAdd(trimmed);
      setNewPath("");
    }
  };

  if (!isOpen) {
    return (
      <div className="ff-watch-collapsed" onClick={() => setIsOpen(true)}>
        <span className="ff-watch-collapsed-title">&#x25B8; Watch</span>
        <span className="ff-watch-collapsed-count">
          {watchList.length} variables
        </span>
      </div>
    );
  }

  return (
    <div className="ff-watch-panel" style={style}>
      {/* Header bar */}
      <div className="ff-watch-header">
        <div className="ff-watch-header-left">
          <span className="ff-watch-title" onClick={() => setIsOpen(false)}>
            &#x25BE; Watch
          </span>
          <span className="ff-watch-badge">
            {watchList.length} variables
          </span>
        </div>
        <div className="ff-watch-header-right">
          <input
            type="text"
            className="ff-watch-input"
            placeholder="MAIN.nCounter"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="ff-btn ff-btn-sm ff-btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ff-watch-content">
        <table className="ff-watch-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
              <th>Type</th>
              <th>Timestamp</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {watchList.map((path) => {
              const v = variableValues.get(path);
              return (
                <tr key={path}>
                  <td className="ff-watch-path">{path}</td>
                  <td className={watchValueClass(v?.dataType ?? "DEFAULT")}>
                    {v ? String(v.value) : "\u2014"}
                  </td>
                  <td className="ff-watch-type">{v?.dataType ?? "\u2014"}</td>
                  <td className="ff-watch-time">
                    {v?.timestamp
                      ? new Date(v.timestamp).toLocaleTimeString()
                      : "\u2014"}
                  </td>
                  <td>
                    <button
                      className="ff-watch-remove"
                      onClick={() => onRemove(path)}
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              );
            })}
            {watchList.length === 0 && (
              <tr>
                <td colSpan={5} className="ff-watch-empty">
                  No variables in watch list
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
