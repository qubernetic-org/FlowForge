// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";
import { getPortColor } from "../utils/portColors";

interface OnlineEdgeData {
  isOnline?: boolean;
  value?: unknown;
  portType?: string;
  sourceExecState?: string;
  [key: string]: unknown;
}

export function OnlineEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as OnlineEdgeData | undefined;
  const isOnline = edgeData?.isOnline ?? false;
  const value = edgeData?.value;
  const portType = edgeData?.portType ?? "DEFAULT";
  const sourceExecState = edgeData?.sourceExecState ?? "idle";
  const isExec = portType === "EXEC";
  const isActive = isOnline && (isExec ? sourceExecState === "active" : Boolean(value));

  const baseColor = getPortColor(portType);
  const strokeColor = isActive && isExec ? "#ffffff" : baseColor;
  const edgeStyle: React.CSSProperties = {
    stroke: strokeColor,
    strokeWidth: isActive ? 2.5 : 2,
    filter: isActive
      ? `drop-shadow(0 0 4px ${strokeColor}80) drop-shadow(0 0 8px ${strokeColor}40)`
      : undefined,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
      {isOnline && value !== undefined && (
        <EdgeLabelRenderer>
          <div
            className="ff-edge-value"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              color: getPortColor(portType),
            }}
          >
            {String(value)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
