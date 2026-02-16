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
import { StatusBar } from "./components/StatusBar";
import { computeExecutionOrder, computeExecutionChains } from "./utils/executionOrder";
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
  { id: "entry", type: "entry", position: { x: 0, y: 200 }, parameters: { label: "MAIN" } },
  { id: "timer_1", type: "timer", position: { x: 300, y: 200 }, parameters: { label: "Delay T#2S" } },
  { id: "counter_1", type: "counter", position: { x: 604, y: 301 }, parameters: { label: "Part Counter" } },
  { id: "comparison_1", type: "comparison", position: { x: 900, y: 200 }, parameters: { label: ">=", operator: ">=" } },
  { id: "if_1", type: "if", position: { x: 1223, y: 169 }, parameters: { label: "Batch Check" } },
  { id: "method_call_1", type: "methodCall", position: { x: 1509, y: 325 }, parameters: { label: "CleanupCycle" } },
  // ── Variable mappings ──
  { id: "input_1", type: "varRead", position: { x: 12, y: 329 }, parameters: { label: "Start Button" } },
  { id: "varRead_pv", type: "varRead", position: { x: 272, y: 414 }, parameters: { label: "Batch Size", dataType: "INT" } },
  { id: "output_1", type: "varWrite", position: { x: 598, y: 180 }, parameters: { label: "Motor ON" } },
  { id: "output_2", type: "varWrite", position: { x: 1228, y: 318 }, parameters: { label: "Batch Done" } },
  // ── Method body: CleanupCycle ──
  { id: "method_entry", type: "methodEntry", position: { x: -4, y: 664 }, parameters: { label: "CleanupCycle" } },
  { id: "for_1", type: "for", position: { x: 302, y: 665 }, parameters: { label: "Wash Iterations" } },
  { id: "timer_2", type: "timer", position: { x: 647, y: 716 }, parameters: { label: "Wash Pulse" } },
  { id: "output_3", type: "varWrite", position: { x: 973, y: 800 }, parameters: { label: "Valve ON" } },
  { id: "return_1", type: "return", position: { x: 973, y: 665 }, parameters: { label: "RETURN" } },
  // ── Property: AxisRef (GET) ──
  { id: "prop_axisref_get", type: "propertyEntry", position: { x: 0, y: 1060 }, parameters: { label: "AxisRef", accessor: "GET", dataType: "FB_AxisRef" } },
  { id: "prop_axisref_ret", type: "return", position: { x: 320, y: 1060 }, parameters: { label: "RETURN", returnType: "FB_AxisRef" } },
  { id: "varRead_axisRef", type: "varRead", position: { x: -1, y: 1162 }, parameters: { label: "_axisRef", dataType: "FB_AxisRef" } },
  // ── Property: IsRunning (GET) ──
  { id: "prop_isrunning_get", type: "propertyEntry", position: { x: 680, y: 1060 }, parameters: { label: "IsRunning", accessor: "GET", dataType: "BOOL" } },
  { id: "prop_isrunning_comp", type: "comparison", position: { x: 980, y: 1060 }, parameters: { label: "<> 0", operator: "<>" } },
  { id: "prop_isrunning_ret", type: "return", position: { x: 1300, y: 1060 }, parameters: { label: "RETURN", returnType: "BOOL" } },
  { id: "varRead_motorSpeed", type: "varRead", position: { x: 678, y: 1160 }, parameters: { label: "_motorSpeed", dataType: "INT" } },
  // ── Property: BatchSize (GET + SET) ──
  { id: "prop_bs_get", type: "propertyEntry", position: { x: 0, y: 1380 }, parameters: { label: "BatchSize", accessor: "GET", dataType: "INT" } },
  { id: "prop_bs_get_ret", type: "return", position: { x: 320, y: 1380 }, parameters: { label: "RETURN", returnType: "INT" } },
  { id: "varRead_bsGet", type: "varRead", position: { x: 0, y: 1483 }, parameters: { label: "_batchSize", dataType: "INT" } },
  { id: "prop_bs_set", type: "propertyEntry", position: { x: 0, y: 1580 }, parameters: { label: "BatchSize", accessor: "SET", dataType: "INT" } },
  { id: "prop_bs_set_comp", type: "comparison", position: { x: 370, y: 1580 }, parameters: { label: ">= 0", operator: ">=" } },
  { id: "prop_bs_set_if", type: "if", position: { x: 700, y: 1560 }, parameters: { label: "Valid Range" } },
  { id: "varWrite_bsSet", type: "varWrite", position: { x: 368, y: 1737 }, parameters: { label: "_batchSize", dataType: "INT" } },
];

const mockGroups: FlowGroup[] = [
  { id: "group_main", label: "MAIN (PRG)", position: { x: -47, y: 99 }, width: 1823, height: 425, color: "#C0392B" },
  { id: "group_method", label: "CleanupCycle (METHOD)", position: { x: -53, y: 570 }, width: 1320, height: 340, color: "#D4883A" },
  { id: "group_properties", label: "Properties", position: { x: -57, y: 949 }, width: 1708, height: 907, color: "#C89B5B" },
  { id: "group_prop_axisref", label: "AxisRef (PROPERTY)", position: { x: -31, y: 1000 }, width: 620, height: 260, color: "#C89B5B" },
  { id: "group_prop_isrunning", label: "IsRunning (PROPERTY)", position: { x: 620, y: 1000 }, width: 1000, height: 260, color: "#C89B5B" },
  { id: "group_prop_batchsize", label: "BatchSize (PROPERTY)", position: { x: -31, y: 1321 }, width: 989, height: 513, color: "#C89B5B" },
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
  { from: { nodeId: "timer_2", portName: "ENO" }, to: { nodeId: "return_1", portName: "EN" } },
  // ── Data connections ──
  { from: { nodeId: "input_1", portName: "VALUE" }, to: { nodeId: "timer_1", portName: "IN" } },
  { from: { nodeId: "input_1", portName: "VALUE" }, to: { nodeId: "counter_1", portName: "CU" } },
  { from: { nodeId: "timer_1", portName: "Q" }, to: { nodeId: "output_1", portName: "VALUE" } },
  { from: { nodeId: "varRead_pv", portName: "VALUE" }, to: { nodeId: "counter_1", portName: "PV" } },
  { from: { nodeId: "counter_1", portName: "CV" }, to: { nodeId: "comparison_1", portName: "A" } },
  { from: { nodeId: "counter_1", portName: "CV" }, to: { nodeId: "method_call_1", portName: "Cycles" } },
  { from: { nodeId: "comparison_1", portName: "OUT" }, to: { nodeId: "if_1", portName: "COND" } },
  { from: { nodeId: "comparison_1", portName: "OUT" }, to: { nodeId: "output_2", portName: "VALUE" } },
  { from: { nodeId: "method_entry", portName: "Cycles" }, to: { nodeId: "for_1", portName: "TO" } },
  { from: { nodeId: "timer_2", portName: "Q" }, to: { nodeId: "output_3", portName: "VALUE" } },
  { from: { nodeId: "timer_2", portName: "Q" }, to: { nodeId: "return_1", portName: "RETURN" } },
  // ── AxisRef GET exec + data ──
  { from: { nodeId: "prop_axisref_get", portName: "ENO" }, to: { nodeId: "prop_axisref_ret", portName: "EN" } },
  { from: { nodeId: "varRead_axisRef", portName: "VALUE" }, to: { nodeId: "prop_axisref_ret", portName: "RETURN" } },
  // ── IsRunning GET exec + data ──
  { from: { nodeId: "prop_isrunning_get", portName: "ENO" }, to: { nodeId: "prop_isrunning_comp", portName: "EN" } },
  { from: { nodeId: "prop_isrunning_comp", portName: "ENO" }, to: { nodeId: "prop_isrunning_ret", portName: "EN" } },
  { from: { nodeId: "varRead_motorSpeed", portName: "VALUE" }, to: { nodeId: "prop_isrunning_comp", portName: "A" } },
  { from: { nodeId: "prop_isrunning_comp", portName: "OUT" }, to: { nodeId: "prop_isrunning_ret", portName: "RETURN" } },
  // ── BatchSize GET exec + data ──
  { from: { nodeId: "prop_bs_get", portName: "ENO" }, to: { nodeId: "prop_bs_get_ret", portName: "EN" } },
  { from: { nodeId: "varRead_bsGet", portName: "VALUE" }, to: { nodeId: "prop_bs_get_ret", portName: "RETURN" } },
  // ── BatchSize SET exec + data ──
  { from: { nodeId: "prop_bs_set", portName: "ENO" }, to: { nodeId: "prop_bs_set_comp", portName: "EN" } },
  { from: { nodeId: "prop_bs_set_comp", portName: "ENO" }, to: { nodeId: "prop_bs_set_if", portName: "EN" } },
  { from: { nodeId: "prop_bs_set", portName: "VALUE" }, to: { nodeId: "prop_bs_set_comp", portName: "A" } },
  { from: { nodeId: "prop_bs_set_comp", portName: "OUT" }, to: { nodeId: "prop_bs_set_if", portName: "COND" } },
  { from: { nodeId: "prop_bs_set", portName: "VALUE" }, to: { nodeId: "varWrite_bsSet", portName: "VALUE" } },
];

// ── Mock online variable snapshots ────────────────────────────────────

function makeMockValues(tick: number): PlcVariableValue[] {
  const ts = new Date().toISOString();
  const running = tick % 48 < 32; // on ~3.2s, off ~1.6s
  const counterVal = Math.floor(tick / 8) % 20; // count up every ~800ms
  return [
    { path: "MAIN.input_1.VALUE", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.IN", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.PT", value: "T#2S", dataType: "TIME", timestamp: ts },
    { path: "MAIN.timer_1.Q", value: running && tick % 48 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.timer_1.ET", value: running ? `T#${Math.min((tick % 48) * 100, 2000)}MS` : "T#0MS", dataType: "TIME", timestamp: ts },
    { path: "MAIN.varRead_pv.VALUE", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.counter_1.CU", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.RESET", value: false, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.PV", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.counter_1.Q", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.counter_1.CV", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.A", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.B", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.comparison_1.OUT", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_1.VALUE", value: running && tick % 48 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.output_2.VALUE", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    // IF node
    { path: "MAIN.if_1.COND", value: counterVal >= 10, dataType: "BOOL", timestamp: ts },
    // MethodCall node
    { path: "MAIN.method_call_1.Cycles", value: counterVal, dataType: "INT", timestamp: ts },
    { path: "MAIN.method_call_1.Temp", value: 45, dataType: "INT", timestamp: ts },
    { path: "MAIN.method_call_1.RETURN", value: counterVal >= 10 && tick % 64 > 40, dataType: "BOOL", timestamp: ts },
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
    { path: "MAIN.output_3.VALUE", value: counterVal >= 10 && tick % 32 > 16, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.return_1.RETURN", value: counterVal >= 10 && tick % 32 > 16, dataType: "BOOL", timestamp: ts },
    // ── Property: IsRunning GET ──
    { path: "MAIN.varRead_motorSpeed.VALUE", value: running ? 1500 : 0, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_isrunning_comp.A", value: running ? 1500 : 0, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_isrunning_comp.B", value: 0, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_isrunning_comp.OUT", value: running, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.prop_isrunning_ret.RETURN", value: running, dataType: "BOOL", timestamp: ts },
    // ── Property: BatchSize GET ──
    { path: "MAIN.varRead_bsGet.VALUE", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_bs_get_ret.RETURN", value: 10, dataType: "INT", timestamp: ts },
    // ── Property: BatchSize SET ──
    { path: "MAIN.prop_bs_set.VALUE", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_bs_set_comp.A", value: 10, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_bs_set_comp.B", value: 0, dataType: "INT", timestamp: ts },
    { path: "MAIN.prop_bs_set_comp.OUT", value: true, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.prop_bs_set_if.COND", value: true, dataType: "BOOL", timestamp: ts },
    { path: "MAIN.varWrite_bsSet.VALUE", value: 10, dataType: "INT", timestamp: ts },
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
  const [showPalette, setShowPalette] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showWatch, setShowWatch] = useState(true);

  const resizePalette = useCallback((delta: number) => {
    setPaletteWidth((w) => Math.max(160, Math.min(500, w + delta)));
  }, []);
  const resizeInspector = useCallback((delta: number) => {
    setInspectorWidth((w) => Math.max(200, Math.min(500, w - delta)));
  }, []);
  const resizeWatch = useCallback((delta: number) => {
    setWatchHeight((h) => Math.max(80, Math.min(600, h - delta)));
  }, []);

  const togglePalette = useCallback(() => setShowPalette((v) => !v), []);
  const toggleInspector = useCallback(() => setShowInspector((v) => !v), []);
  const toggleWatch = useCallback(() => setShowWatch((v) => !v), []);

  const isOnline = mode === "online";
  const selectedNode = selectedNodeId
    ? mockNodes.find((n) => n.id === selectedNodeId) ?? null
    : null;
  const execOrder = useMemo(
    () => computeExecutionOrder(mockNodes, mockConnections),
    [],
  );
  const execChains = useMemo(
    () => computeExecutionChains(mockNodes, mockConnections),
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
        // Variable nodes (varRead/varWrite) are mappings, not in exec chain — never glow.
        const condTrue = (Math.floor(tickRef.current / 8) % 20) >= 10;
        const MAIN_CHAIN = new Set(["entry", "timer_1", "counter_1", "comparison_1", "if_1"]);
        const METHOD_BRANCH = new Set(["method_call_1", "method_entry", "for_1", "timer_2", "return_1"]);
        // Property accessor bodies execute every scan cycle
        const PROPERTY_NODES = new Set([
          "prop_axisref_get", "prop_axisref_ret",
          "prop_isrunning_get", "prop_isrunning_comp", "prop_isrunning_ret",
          "prop_bs_get", "prop_bs_get_ret",
          "prop_bs_set", "prop_bs_set_comp", "prop_bs_set_if",
        ]);
        for (const node of mockNodes) {
          if (MAIN_CHAIN.has(node.id) || PROPERTY_NODES.has(node.id)) {
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
      />

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
        <NodePalette isOnline={isOnline} collapsed={!showPalette} onToggleCollapsed={togglePalette} style={{ width: paletteWidth }} />
        <ResizeDivider direction="vertical" onResize={resizePalette} onDoubleClick={togglePalette} />

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

          <ResizeDivider direction="horizontal" onResize={resizeWatch} onDoubleClick={toggleWatch} />
          <WatchPanel
            isOnline={isOnline}
            watchList={watchList}
            variableValues={variableValues}
            onAdd={addToWatchList}
            onRemove={removeFromWatchList}
            collapsed={!showWatch}
            onToggleCollapsed={toggleWatch}
            style={{ height: watchHeight }}
          />
        </div>

        <ResizeDivider direction="vertical" onResize={resizeInspector} onDoubleClick={toggleInspector} />
        <NodeInspector
          isOnline={isOnline}
          selectedNode={selectedNode}
          nodeStates={nodeStates}
          variableValues={variableValues}
          connections={mockConnections}
          executionOrder={execOrder}
          totalExecNodes={execOrder.size}
          pouInfo={{
            name: "MAIN",
            type: "PRG",
            task: "PlcTask",
            cycleTime: "T#10MS",
            bodyNodeCount: execChains.find((c) => c.entryType === "entry")?.memberIds.length ?? 0,
            methods: execChains
              .filter((c) => c.entryType === "methodEntry")
              .map((c) => ({
                name: c.label,
                description: "Run cleanup wash cycle",
                nodeCount: c.memberIds.length,
                returnType: "BOOL",
                visibility: "PUBLIC",
                parameters: [
                  { name: "Cycles", dataType: "INT", direction: "VAR_INPUT" as const },
                  { name: "Temp", dataType: "INT", direction: "VAR_INPUT" as const },
                ],
              })),
            properties: [
              { name: "AxisRef", dataType: "FB_AxisRef", hasGetter: true, hasSetter: false, referenceReturn: true, visibility: "PUBLIC", getterNodeCount: 1 },
              { name: "IsRunning", dataType: "BOOL", hasGetter: true, hasSetter: false, visibility: "PUBLIC", getterNodeCount: 2 },
              { name: "BatchSize", dataType: "INT", hasGetter: true, hasSetter: true, visibility: "PUBLIC", getterNodeCount: 1, setterNodeCount: 2 },
            ],
          }}
          collapsed={!showInspector}
          onToggleCollapsed={toggleInspector}
          style={{ width: inspectorWidth }}
        />
      </div>

      <StatusBar isOnline={isOnline} connectionStatus={connectionStatus} />
    </div>
  );
}
