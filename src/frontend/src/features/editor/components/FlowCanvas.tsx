// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type OnSelectionChangeFunc,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes, edgeTypes } from "../nodes/nodeRegistry";
import type {
  FlowNode,
  FlowConnection,
  NodeExecutionState,
  PlcVariableValue,
  NodeOnlineData,
} from "../../../api/types";
import { getVariablePathsForNode } from "../utils/nodeVariableMapping";
import { computeExecutionOrder } from "../utils/executionOrder";

const PORT_DATA_TYPES: Record<string, Record<string, string>> = {
  entry: { ENO: "EXEC" },
  input: { OUT: "BOOL" },
  output: { IN: "BOOL" },
  timer: { EN: "EXEC", ENO: "EXEC", IN: "BOOL", PT: "TIME", Q: "BOOL", ET: "TIME" },
  counter: { EN: "EXEC", ENO: "EXEC", CU: "BOOL", RESET: "BOOL", PV: "INT", Q: "BOOL", CV: "INT" },
  comparison: { EN: "EXEC", ENO: "EXEC", A: "INT", B: "INT", OUT: "BOOL" },
  if: { EN: "EXEC", ENO: "EXEC", COND: "BOOL", TRUE: "EXEC" },
  for: { EN: "EXEC", ENO: "EXEC", DO: "EXEC", FROM: "INT", TO: "INT", i: "INT" },
  methodCall: { EN: "EXEC", ENO: "EXEC", Cycles: "INT", Temp: "INT", RET: "BOOL" },
  methodEntry: { ENO: "EXEC", Cycles: "INT", Temp: "INT" },
};

export interface FlowGroup {
  id: string;
  label: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  color: string;
}

interface FlowCanvasProps {
  flowNodes: FlowNode[];
  flowConnections: FlowConnection[];
  groups?: FlowGroup[];
  isOnline: boolean;
  nodeStates: Map<string, NodeExecutionState>;
  variableValues: Map<string, PlcVariableValue>;
  onNodeSelect?: (nodeId: string | null) => void;
}

function toReactFlowNodes(
  flowNodes: FlowNode[],
  flowConnections: FlowConnection[],
  isOnline: boolean,
  nodeStates: Map<string, NodeExecutionState>,
  variableValues: Map<string, PlcVariableValue>,
): Node[] {
  const execOrder = computeExecutionOrder(flowNodes, flowConnections);

  return flowNodes.map((fn) => {
    let onlineData: NodeOnlineData | undefined;
    if (isOnline) {
      const paths = getVariablePathsForNode(fn);
      const variables = paths
        .map((p) => variableValues.get(p))
        .filter((v): v is PlcVariableValue => v !== undefined);
      onlineData = {
        nodeId: fn.id,
        executionState: nodeStates.get(fn.id) ?? "idle",
        variables,
      };
    }

    return {
      id: fn.id,
      type: fn.type,
      position: fn.position,
      data: {
        ...fn.parameters,
        label: (fn.parameters.label as string) ?? fn.type,
        executionOrder: execOrder.get(fn.id),
        onlineData,
      },
    };
  });
}

function resolvePortType(
  nodeId: string,
  portName: string,
  flowNodes: FlowNode[],
): string {
  const node = flowNodes.find((n) => n.id === nodeId);
  if (!node) return "DEFAULT";
  return PORT_DATA_TYPES[node.type]?.[portName] ?? "DEFAULT";
}

function toReactFlowEdges(
  connections: FlowConnection[],
  isOnline: boolean,
  variableValues: Map<string, PlcVariableValue>,
  flowNodes: FlowNode[],
  nodeStates: Map<string, NodeExecutionState>,
): Edge[] {
  return connections.map((conn) => {
    const id = `e-${conn.from.nodeId}-${conn.from.portName}-${conn.to.nodeId}-${conn.to.portName}`;
    const sourcePath = `MAIN.${conn.from.nodeId}.${conn.from.portName}`;
    const value = variableValues.get(sourcePath)?.value;
    const portType = resolvePortType(conn.from.nodeId, conn.from.portName, flowNodes);
    const sourceExecState = nodeStates.get(conn.from.nodeId) ?? "idle";

    return {
      id,
      source: conn.from.nodeId,
      sourceHandle: conn.from.portName,
      target: conn.to.nodeId,
      targetHandle: conn.to.portName,
      type: "online",
      data: { isOnline, value: isOnline ? value : undefined, portType, sourceExecState },
    };
  });
}

function toGroupReactFlowNodes(
  groups: FlowGroup[],
  onResize: (id: string, w: number, h: number) => void,
): Node[] {
  return groups.map((g) => ({
    id: g.id,
    type: "flowGroup",
    position: g.position,
    data: { label: g.label, color: g.color, width: g.width, height: g.height, nodeId: g.id, onResize },
    dragHandle: ".ff-group-header",
    selectable: false,
    focusable: false,
    zIndex: -1,
  }));
}

export function FlowCanvas({
  flowNodes,
  flowConnections,
  groups = [],
  isOnline,
  nodeStates,
  variableValues,
  onNodeSelect,
}: FlowCanvasProps) {
  const handleGroupResize = useCallback(
    (id: string, width: number, height: number) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, width, height } } : n,
        ),
      );
    },
    [],
  );

  const initialNodes = useMemo(() => {
    const flowRfNodes = toReactFlowNodes(flowNodes, flowConnections, isOnline, nodeStates, variableValues);
    const groupRfNodes = toGroupReactFlowNodes(groups, handleGroupResize);
    return [...groupRfNodes, ...flowRfNodes];
  }, [flowNodes, flowConnections, isOnline, nodeStates, variableValues, groups, handleGroupResize]);

  const initialEdges = useMemo(
    () => toReactFlowEdges(flowConnections, isOnline, variableValues, flowNodes, nodeStates),
    [flowConnections, isOnline, variableValues, nodeStates],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync node data when online values change, but preserve user-dragged positions and selection
  useEffect(() => {
    const freshFlowNodes = toReactFlowNodes(flowNodes, flowConnections, isOnline, nodeStates, variableValues);
    setNodes((currentNodes) => {
      // Keep group nodes as-is, update flow nodes
      const groupNodes = currentNodes.filter((n) => n.type === "flowGroup");
      const currentFlowNodes = currentNodes.filter((n) => n.type !== "flowGroup");
      if (currentFlowNodes.length === 0) return [...groupNodes, ...freshFlowNodes];
      const stateMap = new Map(currentFlowNodes.map((n) => [n.id, n]));
      const updatedFlow = freshFlowNodes.map((n) => {
        const prev = stateMap.get(n.id);
        return {
          ...n,
          position: prev?.position ?? n.position,
          selected: prev?.selected,
        };
      });
      return [...groupNodes, ...updatedFlow];
    });
  }, [flowNodes, isOnline, nodeStates, variableValues, setNodes]);

  useEffect(() => {
    setEdges(toReactFlowEdges(flowConnections, isOnline, variableValues, flowNodes, nodeStates));
  }, [flowConnections, isOnline, variableValues, nodeStates, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // DEV helper: press Ctrl+Shift+P to dump current node positions to console
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        const positions = nodes.filter((n) => n.type !== "flowGroup").map((n) => ({
          id: n.id,
          x: Math.round(n.position.x),
          y: Math.round(n.position.y),
        }));
        console.log("Node positions:", JSON.stringify(positions, null, 2));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nodes]);

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes: selectedNodes }) => {
      if (onNodeSelect) {
        onNodeSelect(selectedNodes.length === 1 ? selectedNodes[0].id : null);
      }
    },
    [onNodeSelect],
  );

  return (
    <div className="ff-flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} gap={40} color="#222" />
      </ReactFlow>
    </div>
  );
}
