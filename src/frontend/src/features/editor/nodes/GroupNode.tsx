// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useRef } from "react";

interface GroupNodeData {
  label?: string;
  color?: string;
  width?: number;
  height?: number;
  onResize?: (id: string, width: number, height: number) => void;
  nodeId?: string;
  [key: string]: unknown;
}

export function GroupNode({ data }: { data: GroupNodeData }) {
  const color = data.color ?? "#666";
  const width = data.width ?? 400;
  const height = data.height ?? 300;
  const ref = useRef<HTMLDivElement>(null);

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = width;
      const startH = height;

      const onMove = (ev: MouseEvent) => {
        const newW = Math.max(120, startW + (ev.clientX - startX));
        const newH = Math.max(80, startH + (ev.clientY - startY));
        if (ref.current) {
          ref.current.style.width = `${newW}px`;
          ref.current.style.height = `${newH}px`;
        }
      };

      const onUp = (ev: MouseEvent) => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        const finalW = Math.max(120, startW + (ev.clientX - startX));
        const finalH = Math.max(80, startH + (ev.clientY - startY));
        data.onResize?.(data.nodeId ?? "", finalW, finalH);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [width, height, data],
  );

  return (
    <div
      ref={ref}
      className="ff-group-node"
      style={{
        width,
        height,
        background: `${color}0A`,
        border: `1.5px dashed ${color}40`,
        borderRadius: 10,
        position: "relative",
        pointerEvents: "none",
      }}
    >
      {/* Header — drag handle */}
      <div
        className="ff-group-header"
        style={{
          background: `${color}18`,
          borderBottom: `1px solid ${color}30`,
          borderRadius: "9px 9px 0 0",
          padding: "6px 12px",
          cursor: "grab",
          userSelect: "none",
          pointerEvents: "all",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: `${color}90`,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {data.label}
        </span>
      </div>

      {/* Resize handle bottom-right */}
      <div
        className="ff-group-resize-handle nodrag"
        onMouseDown={onResizeStart}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          cursor: "nwse-resize",
          zIndex: 1,
          pointerEvents: "all",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ position: "absolute", bottom: 4, right: 4 }}>
          <line x1="9" y1="1" x2="1" y2="9" stroke={`${color}50`} strokeWidth="1.5" />
          <line x1="9" y1="5" x2="5" y2="9" stroke={`${color}50`} strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
