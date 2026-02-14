// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { TimerNode } from './TimerNode';
import { CounterNode } from './CounterNode';
import { ComparisonNode } from './ComparisonNode';
import { OnlineEdge } from '../components/OnlineEdge';

export const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  timer: TimerNode,
  counter: CounterNode,
  comparison: ComparisonNode,
};

export const edgeTypes = {
  online: OnlineEdge,
};
