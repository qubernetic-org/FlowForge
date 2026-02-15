// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ConnectionStatus } from "../../../api/types";

interface EditorToolbarProps {
  mode: "edit" | "online";
  connectionStatus: ConnectionStatus;
  targetName: string | null;
  error: string | null;
  onToggleMode: () => void;
  onGoOffline: () => void;
}

const statusColors: Record<ConnectionStatus, string> = {
  disconnected: "#9ca3af",
  connecting: "#f59e0b",
  connected: "#22c55e",
  error: "#ef4444",
};

export function EditorToolbar({
  mode,
  connectionStatus,
  targetName,
  error,
  onToggleMode,
  onGoOffline,
}: EditorToolbarProps) {
  const isOnline = mode === "online";

  return (
    <div className="ff-editor-toolbar">
      {/* Left: Brand + breadcrumb */}
      <div className="ff-toolbar-left">
        <div className="ff-toolbar-brand">
          <div className="ff-toolbar-brand-icon">FF</div>
          <span className="ff-toolbar-brand-name">FlowForge</span>
        </div>
        <span className="ff-toolbar-breadcrumb">Projects &gt;</span>
        <span className="ff-toolbar-project">Motor Control v2.1</span>
      </div>

      {/* Center: Mode toggle + connection status */}
      <div className="ff-toolbar-center">
        <div className="ff-mode-toggle">
          <button
            className={`ff-mode-btn ${mode === "edit" ? "ff-mode-btn-active-edit" : ""}`}
            onClick={mode === "online" ? onToggleMode : undefined}
          >
            EDIT
          </button>
          <button
            className={`ff-mode-btn ${mode === "online" ? "ff-mode-btn-active-online" : ""}`}
            onClick={mode === "edit" ? onToggleMode : undefined}
          >
            ONLINE
          </button>
        </div>

        {isOnline && (
          <div className="ff-toolbar-left">
            <span
              className="ff-status-dot"
              style={{ backgroundColor: statusColors[connectionStatus] }}
            />
            {targetName && (
              <span className="ff-toolbar-target">{targetName}</span>
            )}
            {connectionStatus === "connected" && (
              <span className="ff-toolbar-connected">Connected</span>
            )}
          </div>
        )}

        {error && <span className="ff-toolbar-error">{error}</span>}
      </div>

      {/* Right: Actions + avatar */}
      <div className="ff-toolbar-right">
        <button className="ff-btn ff-btn-ghost">Build</button>
        {mode === "edit" && (
          <button className="ff-btn ff-btn-ghost">Deploy</button>
        )}
        {isOnline && (
          <button className="ff-btn ff-btn-danger" onClick={onGoOffline}>
            Go Offline
          </button>
        )}
        {mode === "edit" && (
          <span className="ff-toolbar-saved">Saved 2 min ago</span>
        )}
        <div className="ff-toolbar-avatar">CB</div>
      </div>
    </div>
  );
}
