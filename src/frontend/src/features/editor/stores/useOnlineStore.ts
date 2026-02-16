// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { create } from "zustand";
import type {
  MonitorSession,
  PlcVariableValue,
  NodeExecutionState,
  ConnectionStatus,
} from "../../../api/types";

interface OnlineState {
  isOnline: boolean;
  session: MonitorSession | null;
  nodeStates: Map<string, NodeExecutionState>;
  variableValues: Map<string, PlcVariableValue>;
  watchList: string[];
  connectionStatus: ConnectionStatus;
  error: string | null;
}

interface OnlineActions {
  setSession: (session: MonitorSession | null) => void;
  setOnline: (online: boolean) => void;
  updateVariableValues: (values: PlcVariableValue[]) => void;
  updateNodeState: (nodeId: string, state: NodeExecutionState) => void;
  updateConnectionStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  addToWatchList: (path: string) => void;
  removeFromWatchList: (path: string) => void;
  reset: () => void;
}

const initialState: OnlineState = {
  isOnline: false,
  session: null,
  nodeStates: new Map(),
  variableValues: new Map(),
  watchList: [],
  connectionStatus: "disconnected",
  error: null,
};

export const useOnlineStore = create<OnlineState & OnlineActions>((set) => ({
  ...initialState,

  setSession: (session) => set({ session }),

  setOnline: (isOnline) => set({ isOnline }),

  updateVariableValues: (values) =>
    set((state) => {
      const next = new Map(state.variableValues);
      for (const v of values) {
        next.set(v.path, v);
      }
      return { variableValues: next };
    }),

  updateNodeState: (nodeId, executionState) =>
    set((state) => {
      const next = new Map(state.nodeStates);
      next.set(nodeId, executionState);
      return { nodeStates: next };
    }),

  updateConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  setError: (error) => set({ error }),

  addToWatchList: (path) =>
    set((state) => {
      if (state.watchList.includes(path)) return state;
      return { watchList: [...state.watchList, path] };
    }),

  removeFromWatchList: (path) =>
    set((state) => ({
      watchList: state.watchList.filter((p) => p !== path),
    })),

  reset: () => set(initialState),
}));
