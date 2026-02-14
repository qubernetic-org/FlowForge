// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import type { ConnectionStatus } from "../../api/types";

export interface SignalRHandlers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [eventName: string]: (...args: any[]) => void;
}

export function useSignalR(
  endpoint: string | null,
  authToken: string | null,
  handlers: SignalRHandlers,
) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const connectionRef = useRef<HubConnection | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const disconnect = useCallback(async () => {
    const conn = connectionRef.current;
    if (conn) {
      connectionRef.current = null;
      try {
        await conn.stop();
      } catch {
        // ignore stop errors during cleanup
      }
    }
    setConnectionStatus("disconnected");
  }, []);

  useEffect(() => {
    if (!endpoint || !authToken) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(endpoint, { accessTokenFactory: () => authToken })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // Register event handlers
    for (const [event] of Object.entries(handlersRef.current)) {
      connection.on(event, (...args: unknown[]) => {
        handlersRef.current[event]?.(...args);
      });
    }

    connection.onreconnecting(() => setConnectionStatus("connecting"));
    connection.onreconnected(() => setConnectionStatus("connected"));
    connection.onclose(() => setConnectionStatus("disconnected"));

    setConnectionStatus("connecting");
    connection
      .start()
      .then(() => setConnectionStatus("connected"))
      .catch(() => setConnectionStatus("error"));

    return () => {
      connection.stop().catch(() => {});
    };
  }, [endpoint, authToken]);

  return {
    connection: connectionRef.current,
    connectionStatus,
    disconnect,
    invoke: useCallback(
      async (method: string, ...args: unknown[]) => {
        const conn = connectionRef.current;
        if (conn?.state === HubConnectionState.Connected) {
          return conn.invoke(method, ...args);
        }
      },
      [],
    ),
  };
}
