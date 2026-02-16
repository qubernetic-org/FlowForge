// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { useEffect, useRef } from "react";
import { getPortColor } from "../utils/portColors";

interface OnlineEdgeData {
  isOnline?: boolean;
  value?: unknown;
  portType?: string;
  sourceExecState?: string;
  [key: string]: unknown;
}

// Dot spacing (dash period) and animation speed
const DOT_PERIOD = 25; // px between dot centers
const CYCLE_MS = 500;  // ms for one dot to travel one period

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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as OnlineEdgeData | undefined;
  const isOnline = edgeData?.isOnline ?? false;
  const portType = edgeData?.portType ?? "DEFAULT";
  const sourceExecState = edgeData?.sourceExecState ?? "idle";
  const isExec = portType === "EXEC";
  const isExecActive = isOnline && isExec && sourceExecState === "active";

  const baseColor = getPortColor(portType);
  const strokeColor = isExecActive ? "#ffffff" : baseColor;
  const edgeStyle: React.CSSProperties = {
    stroke: strokeColor,
    strokeWidth: isExecActive ? 2.5 : 2,
    filter: isExecActive
      ? `drop-shadow(0 0 4px ${strokeColor}80) drop-shadow(0 0 8px ${strokeColor}40)`
      : undefined,
  };

  // --- Flowing dots via rAF (bypasses React re-render entirely) ----------
  const pathRef = useRef<SVGPathElement>(null);
  const activeRef = useRef(false);
  activeRef.current = isExecActive;

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    let rafId: number;

    const tick = (time: number) => {
      if (activeRef.current) {
        // time is a monotonic DOMHighResTimeStamp — use it directly
        const offset = DOT_PERIOD - ((time / CYCLE_MS) * DOT_PERIOD) % DOT_PERIOD;
        el.setAttribute("stroke-dashoffset", String(offset));
        el.style.visibility = "visible";
      } else {
        el.style.visibility = "hidden";
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
      {isExec && (
        <path
          ref={pathRef}
          d={edgePath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`3 ${DOT_PERIOD - 3}`}
          filter="drop-shadow(0 0 4px #ffffff)"
          style={{ visibility: "hidden", pointerEvents: "none" }}
        />
      )}
    </>
  );
}
