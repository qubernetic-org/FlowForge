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

const PORT_DATA_TYPES: Record<string, Record<string, string>> = {
  input: { OUT: "BOOL" },
  output: { IN: "BOOL" },
  timer: { IN: "BOOL", PT: "TIME", Q: "BOOL", ET: "TIME" },
  counter: { CU: "BOOL", RESET: "BOOL", PV: "INT", Q: "BOOL", CV: "INT" },
  comparison: { A: "INT", B: "INT", OUT: "BOOL" },
};

interface FlowCanvasProps {
  flowNodes: FlowNode[];
  flowConnections: FlowConnection[];
  isOnline: boolean;
  nodeStates: Map<string, NodeExecutionState>;
  variableValues: Map<string, PlcVariableValue>;
}

function toReactFlowNodes(
  flowNodes: FlowNode[],
  isOnline: boolean,
  nodeStates: Map<string, NodeExecutionState>,
  variableValues: Map<string, PlcVariableValue>,
): Node[] {
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
): Edge[] {
  return connections.map((conn) => {
    const id = `e-${conn.from.nodeId}-${conn.from.portName}-${conn.to.nodeId}-${conn.to.portName}`;
    const sourcePath = `MAIN.${conn.from.nodeId}.${conn.from.portName}`;
    const value = variableValues.get(sourcePath)?.value;
    const portType = resolvePortType(conn.from.nodeId, conn.from.portName, flowNodes);

    return {
      id,
      source: conn.from.nodeId,
      sourceHandle: conn.from.portName,
      target: conn.to.nodeId,
      targetHandle: conn.to.portName,
      type: "online",
      data: { isOnline, value: isOnline ? value : undefined, portType },
    };
  });
}

export function FlowCanvas({
  flowNodes,
  flowConnections,
  isOnline,
  nodeStates,
  variableValues,
}: FlowCanvasProps) {
  const initialNodes = useMemo(
    () => toReactFlowNodes(flowNodes, isOnline, nodeStates, variableValues),
    [flowNodes, isOnline, nodeStates, variableValues],
  );

  const initialEdges = useMemo(
    () => toReactFlowEdges(flowConnections, isOnline, variableValues, flowNodes),
    [flowConnections, isOnline, variableValues],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes/edges when online data changes
  useEffect(() => {
    setNodes(toReactFlowNodes(flowNodes, isOnline, nodeStates, variableValues));
  }, [flowNodes, isOnline, nodeStates, variableValues, setNodes]);

  useEffect(() => {
    setEdges(toReactFlowEdges(flowConnections, isOnline, variableValues, flowNodes));
  }, [flowConnections, isOnline, variableValues, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
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
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
