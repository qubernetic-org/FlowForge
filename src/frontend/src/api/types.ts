// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

// Mirrors FlowForge.Shared DTOs

export interface FlowDocument {
  name: string;
  version: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  metadata: Record<string, string>;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  parameters: Record<string, unknown>;
}

export interface FlowConnection {
  from: { nodeId: string; portName: string };
  to: { nodeId: string; portName: string };
}

export type BuildStatus =
  | "Pending"
  | "Claimed"
  | "InProgress"
  | "Completed"
  | "Failed";

export interface BuildJob {
  id: string;
  projectId: string;
  projectName: string;
  status: BuildStatus;
  includeDeploy: boolean;
  createdAt: string;
}

export interface BuildResult {
  buildId: string;
  success: boolean;
  errors: string[];
  commitSha: string | null;
  completedAt: string;
}

export interface BuildProgress {
  buildId: string;
  stage: string;
  percentage: number;
  message: string;
}

export type DeployStatus =
  | "Pending"
  | "AwaitingApproval"
  | "Approved"
  | "InProgress"
  | "Completed"
  | "Failed"
  | "Rejected";

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  lastCommitSha: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  branch: string;
  flow: FlowDocument | null;
}

export interface PlcTarget {
  id: string;
  name: string;
  amsNetId: string;
  twinCatVersion: string;
  labels: string[];
  groupId: string | null;
  isProductionTarget: boolean;
  deployLocked: boolean;
}

export interface TargetGroup {
  id: string;
  name: string;
  description: string;
  targets: PlcTarget[];
}

export interface UserInfo {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  roles: string[];
}

export interface MonitorSession {
  sessionId: string;
  signalREndpoint: string;
  authToken: string;
  targetAmsNetId: string;
}

export interface PlcVariableValue {
  path: string;
  value: unknown;
  dataType: string;
  timestamp: string;
}

// Online monitoring

export type NodeExecutionState = "idle" | "active" | "error";

export interface NodeOnlineData {
  nodeId: string;
  executionState: NodeExecutionState;
  variables: PlcVariableValue[];
}

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";
