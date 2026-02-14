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
}

export function WatchPanel({
  isOnline,
  watchList,
  variableValues,
  onAdd,
  onRemove,
}: WatchPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPath, setNewPath] = useState("");

  if (!isOnline) return null;

  const handleAdd = () => {
    const trimmed = newPath.trim();
    if (trimmed) {
      onAdd(trimmed);
      setNewPath("");
    }
  };

  return (
    <div className={`ff-watch-panel ${isOpen ? "ff-watch-open" : ""}`}>
      <button
        className="ff-watch-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Watch {isOpen ? "\u25BC" : "\u25B2"}
      </button>

      {isOpen && (
        <div className="ff-watch-content">
          <div className="ff-watch-add">
            <input
              type="text"
              className="ff-watch-input"
              placeholder="MAIN.nCounter"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button className="ff-btn ff-btn-sm" onClick={handleAdd}>
              Add
            </button>
          </div>

          <table className="ff-watch-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Type</th>
                <th>Time</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {watchList.map((path) => {
                const v = variableValues.get(path);
                return (
                  <tr key={path}>
                    <td className="ff-watch-path">{path}</td>
                    <td className="ff-watch-value">
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
                        className="ff-btn ff-btn-sm ff-btn-danger"
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
      )}
    </div>
  );
}
