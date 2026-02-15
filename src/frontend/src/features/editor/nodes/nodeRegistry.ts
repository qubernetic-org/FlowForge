// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { TimerNode } from './TimerNode';
import { CounterNode } from './CounterNode';
import { ComparisonNode } from './ComparisonNode';
import { IfNode } from './IfNode';
import { ForNode } from './ForNode';
import { EntryNode } from './EntryNode';
import { MethodCallNode } from './MethodCallNode';
import { MethodEntryNode } from './MethodEntryNode';
import { GroupNode } from './GroupNode';
import { OnlineEdge } from '../components/OnlineEdge';

export const nodeTypes = {
  entry: EntryNode,
  input: InputNode,
  output: OutputNode,
  timer: TimerNode,
  counter: CounterNode,
  comparison: ComparisonNode,
  if: IfNode,
  for: ForNode,
  methodCall: MethodCallNode,
  methodEntry: MethodEntryNode,
  flowGroup: GroupNode,
};

export const edgeTypes = {
  online: OnlineEdge,
};
