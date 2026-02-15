// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

// Standalone demo page with mock data — no backend required.

import { useState, useCallback, useMemo } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorToolbar } from "./components/EditorToolbar";
import { FlowCanvas, type FlowGroup } from "./components/FlowCanvas";
import { WatchPanel } from "./components/WatchPanel";
import { NodePalette } from "./components/NodePalette";
import { NodeInspector } from "./components/NodeInspector";
import { ResizeDivider } from "./components/ResizeDivider";
import { computeExecutionOrder } from "./utils/executionOrder";
import type {
  FlowNode,
  FlowConnection,
  NodeExecutionState,
  PlcVariableValue,
  ConnectionStatus,
} from "../../api/types";

// ── Mock flow document ────────────────────────────────────────────────

const mockNodes: FlowNode[] = [
  // ── Main PRG exec chain ──
  { id: "entry", type: "entry", position: { x: 0, y: 200 }, parameters: { label: "Execution Entry" } },
  { id: "timer_1", type: "timer", position: { x: 300, y: 200 }, parameters: { label: "Delay T#2S" } },
  { id: "counter_1", type: "counter", position: { x: 604, y: 301 }, parameters: { label: "Part Counter" } },
  { id: "comparison_1", type: "comparison", position: { x: 900, y: 200 }, parameters: { label: ">=", operator: ">=" } },
  { id: "if_1", type: "if", position: { x: 1223, y: 169 }, parameters: { label: "Batch Check" } },
  { id: "method_call_1", type: "methodCall", position: { x: 1509, y: 325 }, parameters: { label: "CleanupCycle" } },
  // ── I/O mappings ──
  { id: "input_1", type: "input", position: { x: 12, y: 329 }, parameters: { label: "Start Button" } },
  { id: "output_1", type: "output", position: { x: 598, y: 180 }, parameters: { label: "Motor ON" } },
  { id: "output_2", type: "output", position: { x: 1220, y: 306 }, parameters: { label: "Batch Done" } },
  // ── Method body: CleanupCycle ──
  { id: "method_entry", type: "methodEntry", position: { x: -4, y: 664 }, parameters: { label: "CleanupCycle" } },
  { id: "for_1", type: "for", position: { x: 302, y: 665 }, parameters: { label: "Wash Iterations" } },
  { id: "timer_2", type: "timer", position: { x: 670, y: 769 }, parameters: { label: "Wash Pulse" } },
  { id: "output_3", type: "output", position: { x: 973, y: 800 }, parameters: { label: "Valve ON" } },
];

const mockGroups: FlowGroup[] = [
  { id: "group_main", label: "MAIN (PRG)", position: { x: -50, y: 130 }, width: 1820, height: 400, color: "#C0392B" },
  { id: "group_method", label: "CleanupCycle (METHOD)", position: { x: -60, y: 600 }, width: 1280, height: 340, color: "#D4883A" },
];

const mockConnections: FlowConnection[] = [
  // ── Main execution chain ──
  { from: { nodeId: "entry", portName: "ENO" }, to: { nodeId: "timer_1", portName: "EN" } },
  { from: { nodeId: "timer_1", portName: "ENO" }, to: { nodeId: "counter_1", portName: "EN" } },
  { from: { nodeId: "counter_1", portName: "ENO" }, to: { nodeId: "comparison_1", portName: "EN" } },
  { from: { nodeId: "comparison_1", portName: "ENO" }, to: { nodeId: "if_1", portName: "EN" } },
  // IF TRUE branch → method call node
  { from: { nodeId: "if_1", portName: "TRUE" }, to: { nodeId: "method_call_1", portName: "EN" } },
  // ── Method execution chain ──
  { from: { nodeId: "method_entry", portName: "ENO" }, to: { nodeId: "for_1", portName: "EN" } },
  { from: { nodeId: "for_1", portName: "DO" }, to: { nodeId: "timer_2", portName: "EN" } },
  // ── Data connections ──
  { from: { nodeId: "input_1", portName: "OUT" }, to: { nodeId: "timer_1", portName: "IN" } },
  { from: { nodeId: "input_1", portName: "OUT" }, to: { nodeId: "counter_1", portName: "CU" } },
  { from: { nodeId: "timer_1", portName: "Q" }, to: { nodeId: "output_1", portName: "IN" } },
  { from: { nodeId: "counter_1", portName: "CV" }, to: { nodeId: "comparison_1", portName: "A" } },
  { from: { nodeId: "counter_1", portName: "CV" }, to: { nodeId: "method_call_1", portName: "Cycles" } },
  { from: { nodeId: "comparison_1", portName: "OUT" }, to: { nodeId: "if_1", portName: "COND" } },
  { from: { nodeId: "comparison_1", portName: "OUT" }, to: { nodeId: "output_2", portName: "IN" } },
  { from: { nodeId: "method_entry", portName: "Cycles" }, to: { nodeId: "for_1", portName: "TO" } },
  { from: { nodeId: "timer_2", portName: "Q" }, to: { nodeId: "output_3", portName: "IN" } },
];

// ── Mock online variable snapshots ────────────────────────────────────

function makeMockValues(tick: number): PlcVariableValue[] {
  const ts = new Date().toISOString();
  const running = tick % 48 < 32; // on ~3.2s, off ~1.6s
  const counterVal = Math.floor(tick / 8) % 20; // count up every ~800ms
  return [
    { path: "MAIN.input_1.OUT", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.IN", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.PT", value: "T#2S", dataType: "TIME", timestamp: ts },
    { path: "MAIN.timer_1.Q", value: running && tick % 48 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.ET", value: running ? `T#${Math.min((tick % 48) * 100, 2000)}MS` : "T#0MS", dataType: "TIME", timestamp: ts },
    { path: "MAIN.counter_1.CU", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.RESET", value: false, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.PV", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.counter_1.Q", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.CV", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.A", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.B", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.OUT", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_1.IN", value: running && tick % 48 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_2.IN", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    // IF node
    { path: "MAIN.if_1.COND", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    // MethodCall node
    { path: "MAIN.method_call_1.Cycles", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.method_call_1.Temp", value: 45, dataType: "INT", timestamp: ts },
    { path: "MAIN.method_call_1.RET", value: counterVal >= 10 && tick % 64 > 40, dataType: "BOOL", timestamp: ts },
    // Method entry: CleanupCycle VAR_INPUT params
    { path: "MAIN.method_entry.Cycles", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.method_entry.Temp", value: 45, dataType: "INT", timestamp: ts },
    // Method: CleanupCycle body
    { path: "MAIN.for_1.FROM", value: 0, dataType: "INT", timestamp: ts },
    { path: "MAIN.for_1.TO", value: 3, dataType: "INT", timestamp: ts },
    { path: "MAIN.for_1.i", value: counterVal >= 10 ? Math.floor(tick / 8) % 3 : 0, dataType: "INT", timestamp: ts },
    // Wash pulse timer
    { path: "MAIN.timer_2.IN", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_2.PT", value: "T#500MS", dataType: "TIME", timestamp: ts },
    { path: "MAIN.timer_2.Q", value: counterVal >= 10 && tick % 32 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_2.ET", value: counterVal >= 10 ? `T#${Math.min((tick % 5) * 100, 500)}MS` : "T#0MS", dataType: "TIME", timestamp: ts },
    { path: "MAIN.output_3.IN", value: counterVal >= 10 && tick % 32 > 16, dataType: "BOOL", timestamp: ts },
  ];
}

// ── Demo component ────────────────────────────────────────────────────

export function EditorPageDemo() {
  const [mode, setMode] = useState<"edit" | "online">("edit");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [variableValues, setVariableValues] = useState<Map<string, PlcVariableValue>>(new Map());
  const [nodeStates, setNodeStates] = useState<Map<string, NodeExecutionState>>(new Map());
  const [watchList, setWatchList] = useState<string[]>(["MAIN.counter_1.CV", "MAIN.timer_1.ET"]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [tickRef] = useState({ current: 0, interval: 0 as unknown as ReturnType<typeof setInterval> });
  const [paletteWidth, setPaletteWidth] = useState(260);
  const [inspectorWidth, setInspectorWidth] = useState(280);
  const [watchHeight, setWatchHeight] = useState(180);

  const resizePalette = useCallback((delta: number) => {
    setPaletteWidth((w) => Math.max(160, Math.min(500, w + delta)));
  }, []);
  const resizeInspector = useCallback((delta: number) => {
    setInspectorWidth((w) => Math.max(200, Math.min(500, w - delta)));
  }, []);
  const resizeWatch = useCallback((delta: number) => {
    setWatchHeight((h) => Math.max(80, Math.min(600, h - delta)));
  }, []);

  const isOnline = mode === "online";
  const selectedNode = selectedNodeId
    ? mockNodes.find((n) => n.id === selectedNodeId) ?? null
    : null;
  const execOrder = useMemo(
    () => computeExecutionOrder(mockNodes, mockConnections),
    [],
  );

  const goOnline = useCallback(() => {
    setMode("online");
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

        // Derive node execution states — white border = node is being executed
        // Main chain (entry → timer_1 → counter_1 → comparison_1 → if_1)
        // always executes every PLC scan cycle.
        // Method call branch only executes when IF condition is true.
        // I/O nodes (input/output) are mappings, not in exec chain — never glow.
        const condTrue = (Math.floor(tickRef.current / 8) % 20) >= 10;
        const MAIN_CHAIN = new Set(["entry", "timer_1", "counter_1", "comparison_1", "if_1"]);
        const METHOD_BRANCH = new Set(["method_call_1", "method_entry", "for_1", "timer_2"]);
        for (const node of mockNodes) {
          if (MAIN_CHAIN.has(node.id)) {
            stateMap.set(node.id, "active");
          } else if (METHOD_BRANCH.has(node.id)) {
            stateMap.set(node.id, condTrue ? "active" : "idle");
          } else {
            stateMap.set(node.id, "idle");
          }
        }

        setVariableValues(valMap);
        setNodeStates(stateMap);
      }, 100);
    }, 600);
  }, [tickRef]);

  const goOffline = useCallback(() => {
    clearInterval(tickRef.interval);
    setMode("edit");
    setConnectionStatus("disconnected");
    setVariableValues(new Map());
    setNodeStates(new Map());
  }, [tickRef]);

  const toggleMode = useCallback(() => {
    if (isOnline) {
      goOffline();
    } else {
      goOnline();
    }
  }, [isOnline, goOnline, goOffline]);

  const addToWatchList = useCallback((path: string) => {
    setWatchList((prev) => (prev.includes(path) ? prev : [...prev, path]));
  }, []);

  const removeFromWatchList = useCallback((path: string) => {
    setWatchList((prev) => prev.filter((p) => p !== path));
  }, []);

  return (
    <div className="ff-editor-page">
      <EditorToolbar
        mode={mode}
        connectionStatus={connectionStatus}
        targetName={isOnline ? "PLC-Demo (5.39.123.1.1.1)" : null}
        error={null}
        onToggleMode={toggleMode}
        onGoOffline={goOffline}
      />

      {/* TODO: Add a StatusBar component below ff-editor-content showing:
           - PLC RT runtime state (Run / Stop / Exception / Config)
           - ADS connection state (Connected / Disconnected / Error + AmsNetId)
           - Build server status (Idle / Building / Offline)
           - Last build timestamp + result (Success / Failed)
           - Current cycle time / scan time from PLC
           - Active deploy lock indicator
           Use a thin horizontal bar similar to VS Code status bar. */}

      <div className="ff-editor-content">
        {/* TODO: Add a VariableDeclaration panel (collapsible, maybe above or beside
             the NodePalette) for declaring POU-level variables (VAR, VAR_INPUT,
             VAR_OUTPUT, VAR_IN_OUT, VAR_TEMP). Should support:
             - Table-style variable list (Name, Type, Initial Value, Comment)
             - Add / remove / reorder rows
             - Inline type picker (BOOL, INT, REAL, TIME, STRING, ARRAY, FB instances)
             - Drag-to-canvas to create a variable read/write node
             - In online mode: show live values inline (read-only)
             Location TBD — could be a tab in the left panel or a separate collapsible section. */}
        <NodePalette isOnline={isOnline} style={{ width: paletteWidth }} />
        <ResizeDivider direction="vertical" onResize={resizePalette} />

        <div className="ff-editor-center">
          <ReactFlowProvider>
            <FlowCanvas
              flowNodes={mockNodes}
              flowConnections={mockConnections}
              groups={mockGroups}
              isOnline={isOnline}
              nodeStates={nodeStates}
              variableValues={variableValues}
              onNodeSelect={setSelectedNodeId}
            />
          </ReactFlowProvider>

          <ResizeDivider direction="horizontal" onResize={resizeWatch} />
          <WatchPanel
            isOnline={isOnline}
            watchList={watchList}
            variableValues={variableValues}
            onAdd={addToWatchList}
            onRemove={removeFromWatchList}
            style={{ height: watchHeight }}
          />
        </div>

        <ResizeDivider direction="vertical" onResize={resizeInspector} />
        <NodeInspector
          isOnline={isOnline}
          selectedNode={selectedNode}
          nodeStates={nodeStates}
          variableValues={variableValues}
          connections={mockConnections}
          executionOrder={execOrder}
          totalExecNodes={execOrder.size}
          style={{ width: inspectorWidth }}
        />
      </div>
    </div>
  );
}
