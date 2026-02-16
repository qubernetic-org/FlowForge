// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useRef } from "react";

interface ResizeDividerProps {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  onDoubleClick?: () => void;
}

export function ResizeDivider({ direction, onResize, onDoubleClick }: ResizeDividerProps) {
  const startPos = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startPos.current = direction === "vertical" ? e.clientX : e.clientY;

      const onMouseMove = (ev: MouseEvent) => {
        const current = direction === "vertical" ? ev.clientX : ev.clientY;
        const delta = current - startPos.current;
        if (delta !== 0) {
          startPos.current = current;
          onResize(delta);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor =
        direction === "vertical" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    },
    [direction, onResize],
  );

  return (
    <div
      className={`ff-resize-divider ff-resize-${direction}`}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    />
  );
}
