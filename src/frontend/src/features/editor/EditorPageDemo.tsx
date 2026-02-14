// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

// Standalone demo page with mock data — no backend required.

import { useState, useCallback } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorToolbar } from "./components/EditorToolbar";
import { FlowCanvas } from "./components/FlowCanvas";
import { WatchPanel } from "./components/WatchPanel";
import type {
  FlowNode,
  FlowConnection,
  NodeExecutionState,
  PlcVariableValue,
  ConnectionStatus,
} from "../../api/types";

// ── Mock flow document ────────────────────────────────────────────────

const mockNodes: FlowNode[] = [
  { id: "input_1", type: "input", position: { x: 50, y: 100 }, parameters: { label: "Start Button" } },
  { id: "timer_1", type: "timer", position: { x: 350, y: 50 }, parameters: { label: "Delay T#2S" } },
  { id: "counter_1", type: "counter", position: { x: 350, y: 280 }, parameters: { label: "Part Counter" } },
  { id: "comparison_1", type: "comparison", position: { x: 650, y: 280 }, parameters: { label: ">=", operator: ">=" } },
  { id: "output_1", type: "output", position: { x: 900, y: 100 }, parameters: { label: "Motor ON" } },
  { id: "output_2", type: "output", position: { x: 900, y: 350 }, parameters: { label: "Batch Done" } },
];

const mockConnections: FlowConnection[] = [
  { from: { nodeId: "input_1", portName: "OUT" }, to: { nodeId: "timer_1", portName: "IN" } },
  { from: { nodeId: "input_1", portName: "OUT" }, to: { nodeId: "counter_1", portName: "CU" } },
  { from: { nodeId: "timer_1", portName: "Q" }, to: { nodeId: "output_1", portName: "IN" } },
  { from: { nodeId: "counter_1", portName: "CV" }, to: { nodeId: "comparison_1", portName: "A" } },
  { from: { nodeId: "comparison_1", portName: "OUT" }, to: { nodeId: "output_2", portName: "IN" } },
];

// ── Mock online variable snapshots ────────────────────────────────────

function makeMockValues(tick: number): PlcVariableValue[] {
  const ts = new Date().toISOString();
  const running = tick % 6 < 4; // on 4 cycles, off 2
  const counterVal = tick % 20;
  return [
    { path: "MAIN.input_1.OUT", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.IN", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.PT", value: "T#2S", dataType: "TIME", timestamp: ts },
    { path: "MAIN.timer_1.Q", value: running && tick % 6 > 1, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.ET", value: running ? `T#${(tick % 3) * 700}MS` : "T#0MS", dataType: "TIME", timestamp: ts },
    { path: "MAIN.counter_1.CU", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.RESET", value: false, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.PV", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.counter_1.Q", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.CV", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.A", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.B", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.OUT", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_1.IN", value: running && tick % 6 > 1, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_2.IN", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
  ];
}

// ── Demo component ────────────────────────────────────────────────────

export function EditorPageDemo() {
  const [isOnline, setIsOnline] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [variableValues, setVariableValues] = useState<Map<string, PlcVariableValue>>(new Map());
  const [nodeStates, setNodeStates] = useState<Map<string, NodeExecutionState>>(new Map());
  const [watchList, setWatchList] = useState<string[]>(["MAIN.counter_1.CV", "MAIN.timer_1.ET"]);
  const [tickRef] = useState({ current: 0, interval: 0 as unknown as ReturnType<typeof setInterval> });

  const goOnline = useCallback(() => {
    setIsOnline(true);
    setConnectionStatus("connecting");

    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus("connected");

      // Start simulated PLC cycle
      tickRef.current = 0;
      tickRef.interval = setInterval(() => {
        tickRef.current++;
        const values = makeMockValues(tickRef.current);
        const valMap = new Map<string, PlcVariableValue>();
        const stateMap = new Map<string, NodeExecutionState>();

        for (const v of values) {
          valMap.set(v.path, v);
        }

        // Derive node states
        for (const node of mockNodes) {
          const outPaths = values.filter((v) => v.path.startsWith(`MAIN.${node.id}.`));
          const hasActive = outPaths.some((v) => v.value === true);
          stateMap.set(node.id, hasActive ? "active" : "idle");
        }

        setVariableValues(valMap);
        setNodeStates(stateMap);
      }, 800);
    }, 600);
  }, [tickRef]);

  const goOffline = useCallback(() => {
    clearInterval(tickRef.interval);
    setIsOnline(false);
    setConnectionStatus("disconnected");
    setVariableValues(new Map());
    setNodeStates(new Map());
  }, [tickRef]);

  const addToWatchList = useCallback((path: string) => {
    setWatchList((prev) => (prev.includes(path) ? prev : [...prev, path]));
  }, []);

  const removeFromWatchList = useCallback((path: string) => {
    setWatchList((prev) => prev.filter((p) => p !== path));
  }, []);

  return (
    <div className="ff-editor-page">
      <EditorToolbar
        isOnline={isOnline}
        connectionStatus={connectionStatus}
        targetName={isOnline ? "PLC-Demo (5.39.123.1.1.1)" : null}
        error={null}
        canGoOnline={true}
        onGoOnline={goOnline}
        onGoOffline={goOffline}
      />

      <div className="ff-editor-content">
        <ReactFlowProvider>
          <FlowCanvas
            flowNodes={mockNodes}
            flowConnections={mockConnections}
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
