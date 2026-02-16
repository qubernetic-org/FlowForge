// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { VarReadNode } from './VarReadNode';
import { VarWriteNode } from './VarWriteNode';
import { TimerNode } from './TimerNode';
import { CounterNode } from './CounterNode';
import { ComparisonNode } from './ComparisonNode';
import { IfNode } from './IfNode';
import { ForNode } from './ForNode';
import { EntryNode } from './EntryNode';
import { MethodCallNode } from './MethodCallNode';
import { MethodEntryNode } from './MethodEntryNode';
import { ReturnNode } from './ReturnNode';
import { PropertyEntryNode } from './PropertyEntryNode';
import { GroupNode } from './GroupNode';
import { OnlineEdge } from '../components/OnlineEdge';

export const nodeTypes = {
  entry: EntryNode,
  varRead: VarReadNode,
  varWrite: VarWriteNode,
  timer: TimerNode,
  counter: CounterNode,
  comparison: ComparisonNode,
  if: IfNode,
  for: ForNode,
  methodCall: MethodCallNode,
  methodEntry: MethodEntryNode,
  return: ReturnNode,
  propertyEntry: PropertyEntryNode,
  flowGroup: GroupNode,
};

export const edgeTypes = {
  online: OnlineEdge,
};
