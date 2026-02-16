// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useMemo } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorToolbar } from "./components/EditorToolbar";
import { FlowCanvas } from "./components/FlowCanvas";
import { WatchPanel } from "./components/WatchPanel";
import { useOnlineMode } from "./hooks/useOnlineMode";
import type { FlowDocument } from "../../api/types";

interface EditorPageProps {
  projectId?: string | null;
  targetAmsNetId?: string | null;
  targetName?: string | null;
  flow?: FlowDocument | null;
}

export function EditorPage({
  projectId = null,
  targetAmsNetId = null,
  targetName = null,
  flow = null,
}: EditorPageProps) {
  const flowNodes = useMemo(() => flow?.nodes ?? [], [flow]);
  const flowConnections = useMemo(() => flow?.connections ?? [], [flow]);

  const {
    isOnline,
    connectionStatus,
    error,
    nodeStates,
    variableValues,
    watchList,
    goOnline,
    goOffline,
    addToWatchList,
    removeFromWatchList,
  } = useOnlineMode(projectId ?? null, targetAmsNetId ?? null, flowNodes);

  const canGoOnline = !!projectId && !!targetAmsNetId;

  return (
    <div className="ff-editor-page">
      <EditorToolbar
        isOnline={isOnline}
        connectionStatus={connectionStatus}
        targetName={targetName ?? null}
        error={error}
        canGoOnline={canGoOnline}
        onGoOnline={goOnline}
        onGoOffline={goOffline}
      />

      <div className="ff-editor-content">
        <ReactFlowProvider>
          <FlowCanvas
            flowNodes={flowNodes}
            flowConnections={flowConnections}
            isOnline={isOnline}
            nodeStates={nodeStates}
            variableValues={variableValues}
          />
        </ReactFlowProvider>
      </div>

      <WatchPanel
        isOnline={isOnline}
        watchList={watchList}
        variableValues={variableValues}
        onAdd={addToWatchList}
        onRemove={removeFromWatchList}
      />
    </div>
  );
}
