// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from "react";
import type { NodeExecutionState } from "../../../api/types";

interface NodeOnlineOverlayProps {
  executionState: NodeExecutionState;
  isOnline: boolean;
  children: ReactNode;
}

export function NodeOnlineOverlay({
  executionState,
  isOnline,
  children,
}: NodeOnlineOverlayProps) {
  if (!isOnline) {
    return <>{children}</>;
  }

  return (
    <div className={`ff-online-overlay ff-online-${executionState}`}>
      {children}
    </div>
  );
}
