// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useEffect, useMemo } from "react";
import { useSignalR } from "../../../shared/hooks/useSignalR";
import { useOnlineStore } from "../stores/useOnlineStore";
import { apiFetch } from "../../../api/client";
import { endpoints } from "../../../api/endpoints";
import { getAllVariablePaths, getNodeIdFromPath } from "../utils/nodeVariableMapping";
import type { FlowNode, MonitorSession, PlcVariableValue } from "../../../api/types";

export function useOnlineMode(
  projectId: string | null,
  targetAmsNetId: string | null,
  flowNodes: FlowNode[],
) {
  const store = useOnlineStore();

  const handlers = useMemo(
    () => ({
      ReceiveVariableValues: (values: PlcVariableValue[]) => {
        store.updateVariableValues(values);

        // Derive node execution states from variable values
        for (const v of values) {
          const nodeId = getNodeIdFromPath(v.path);
          if (nodeId) {
            // A node is "active" if any of its output variables are truthy
            const state = v.value ? "active" as const : "idle" as const;
            store.updateNodeState(nodeId, state);
          }
        }
      },
      ReceiveConnectionStatus: (status: string) => {
        if (
          status === "disconnected" ||
          status === "connecting" ||
          status === "connected" ||
          status === "error"
        ) {
          store.updateConnectionStatus(status);
        }
      },
      ReceiveError: (message: string) => {
        store.setError(message);
      },
    }),
    // Store methods are stable (zustand), safe to reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { connectionStatus: signalRStatus, invoke } = useSignalR(
    store.session?.signalREndpoint ?? null,
    store.session?.authToken ?? null,
    handlers,
  );

  // Sync SignalR connection status to store
  useEffect(() => {
    store.updateConnectionStatus(signalRStatus);
  }, [signalRStatus, store]);

  // Auto-subscribe to variables when online and flow changes
  useEffect(() => {
    if (!store.isOnline || signalRStatus !== "connected") return;
    const paths = getAllVariablePaths(flowNodes);
    if (paths.length > 0) {
      invoke("Subscribe", paths).catch(() => {});
    }
  }, [store.isOnline, signalRStatus, flowNodes, invoke]);

  // Subscribe watch list variables when they change
  useEffect(() => {
    if (!store.isOnline || signalRStatus !== "connected") return;
    if (store.watchList.length > 0) {
      invoke("Subscribe", store.watchList).catch(() => {});
    }
  }, [store.isOnline, signalRStatus, store.watchList, invoke]);

  const goOnline = useCallback(async () => {
    if (!projectId || !targetAmsNetId) return;
    store.setError(null);
    store.updateConnectionStatus("connecting");

    try {
      const session = await apiFetch<MonitorSession>(endpoints.monitor.start, {
        method: "POST",
        body: JSON.stringify({ projectId, targetAmsNetId }),
      });
      store.setSession(session);
      store.setOnline(true);
    } catch (err) {
      store.setError(
        err instanceof Error ? err.message : "Failed to start monitor session",
      );
      store.updateConnectionStatus("error");
    }
  }, [projectId, targetAmsNetId, store]);

  const goOffline = useCallback(async () => {
    const sessionId = store.session?.sessionId;
    store.reset();

    if (sessionId) {
      try {
        await apiFetch(endpoints.monitor.stop(sessionId), { method: "POST" });
      } catch {
        // Best-effort cleanup
      }
    }
  }, [store]);

  return {
    isOnline: store.isOnline,
    connectionStatus: store.connectionStatus,
    error: store.error,
    nodeStates: store.nodeStates,
    variableValues: store.variableValues,
    watchList: store.watchList,
    goOnline,
    goOffline,
    addToWatchList: store.addToWatchList,
    removeFromWatchList: store.removeFromWatchList,
  };
}
