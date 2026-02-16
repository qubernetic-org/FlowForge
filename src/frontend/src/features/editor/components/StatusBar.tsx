// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ConnectionStatus } from "../../../api/types";

interface StatusBarProps {
  isOnline: boolean;
  connectionStatus: ConnectionStatus;
}

export function StatusBar({ isOnline, connectionStatus }: StatusBarProps) {
  const connected = connectionStatus === "connected";

  return (
    <div className="ff-status-bar">
      <div className="ff-status-bar-left">
        <span className="ff-status-bar-item">Saved 2 min ago</span>
        {isOnline && (
          <>
            <span className="ff-status-bar-item">
              <span className="ff-status-bar-dot" style={{ background: connected ? "#22c55e" : "#666" }} />
              {connected ? "PLC Run" : "—"}
            </span>
            <span className="ff-status-bar-item">
              <span className="ff-status-bar-dot" style={{ background: connected ? "#22c55e" : connectionStatus === "connecting" ? "#f59e0b" : "#ef4444" }} />
              {connected ? "Connected · 5.39.123.1.1.1" : connectionStatus === "connecting" ? "Connecting…" : "Disconnected"}
            </span>
            <span className="ff-status-bar-item">
              <span className="ff-status-bar-mono">{connected ? "Cycle: 2ms" : "—"}</span>
            </span>
          </>
        )}
      </div>

      <div className="ff-status-bar-right">
        <span className="ff-status-bar-item">
          <span className="ff-status-bar-dot" style={{ background: "#22c55e" }} />
          Build Server Idle
        </span>
        <span className="ff-status-bar-item">
          <span className="ff-status-bar-dot" style={{ background: "#3b82f6" }} />
          Last Build: Success · 2 min ago
        </span>
        <span className="ff-status-bar-item">
          <span className="ff-status-bar-dot" style={{ background: "#666" }} />
          Deploy Lock: Off
        </span>
      </div>
    </div>
  );
}
