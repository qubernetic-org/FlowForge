// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";

interface OnlineEdgeData {
  isOnline?: boolean;
  value?: unknown;
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
  const isActive = isOnline && Boolean(value);

  const edgeClass = !isOnline
    ? "ff-edge-offline"
    : isActive
      ? "ff-edge-active"
      : "ff-edge-online";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={edgeClass}
      />
      {isOnline && value !== undefined && (
        <EdgeLabelRenderer>
          <div
            className="ff-edge-value"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            {String(value)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
