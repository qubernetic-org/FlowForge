// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

export const endpoints = {
  health: "/health",

  projects: {
    list: "/projects",
    detail: (id: string) => `/projects/${id}`,
    create: "/projects",
  },

  build: {
    enqueue: "/build",
    claim: "/build/claim",
    result: (buildId: string) => `/build/${buildId}/result`,
    history: (projectId: string) => `/build/history/${projectId}`,
  },

  deploy: {
    request: "/deploy",
    approve: (deployId: string) => `/deploy/${deployId}/approve`,
    lock: (targetId: string) => `/deploy/lock/${targetId}`,
    unlock: (targetId: string) => `/deploy/unlock/${targetId}`,
  },

  targets: {
    list: "/targets",
    detail: (id: string) => `/targets/${id}`,
    groups: "/targets/groups",
  },

  monitor: {
    start: "/monitor/start",
    stop: (sessionId: string) => `/monitor/${sessionId}/stop`,
  },

  admin: {
    users: "/admin/users",
    user: (id: string) => `/admin/users/${id}`,
    roles: "/admin/roles",
  },
} as const;
