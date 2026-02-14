// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ConnectionStatus } from "../../../api/types";

interface EditorToolbarProps {
  isOnline: boolean;
  connectionStatus: ConnectionStatus;
  targetName: string | null;
  error: string | null;
  canGoOnline: boolean;
  onGoOnline: () => void;
  onGoOffline: () => void;
}

const statusColors: Record<ConnectionStatus, string> = {
  disconnected: "#9ca3af",
  connecting: "#f59e0b",
  connected: "#22c55e",
  error: "#ef4444",
};

export function EditorToolbar({
  isOnline,
  connectionStatus,
  targetName,
  error,
  canGoOnline,
  onGoOnline,
  onGoOffline,
}: EditorToolbarProps) {
  return (
    <div className="ff-editor-toolbar">
      <div className="ff-toolbar-left">
        <button
          className={`ff-btn ${isOnline ? "ff-btn-danger" : "ff-btn-primary"}`}
          disabled={!isOnline && !canGoOnline}
          onClick={isOnline ? onGoOffline : onGoOnline}
        >
          {isOnline ? "Go Offline" : "Go Online"}
        </button>

        {isOnline && (
          <>
            <span
              className="ff-status-dot"
              style={{ backgroundColor: statusColors[connectionStatus] }}
              title={connectionStatus}
            />
            {targetName && (
              <span className="ff-toolbar-target">{targetName}</span>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="ff-toolbar-right">
          <span className="ff-toolbar-error">{error}</span>
        </div>
      )}
    </div>
  );
}
