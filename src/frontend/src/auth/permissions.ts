// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

export type Permission =
  | "project:view"
  | "project:create"
  | "project:edit"
  | "project:delete"
  | "build"
  | "deploy"
  | "target:manage"
  | "monitor"
  | "admin:users"
  | "admin:system";

const rolePermissions: Record<string, Permission[]> = {
  viewer: ["project:view", "monitor"],
  editor: ["project:view", "project:edit", "monitor"],
  builder: ["project:view", "project:edit", "build", "monitor"],
  deployer: [
    "project:view",
    "project:edit",
    "build",
    "deploy",
    "monitor",
    "target:manage",
  ],
  admin: [
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "build",
    "deploy",
    "target:manage",
    "monitor",
    "admin:users",
    "admin:system",
  ],
};

export function hasPermission(
  roles: string[],
  permission: Permission,
): boolean {
  return roles.some((role) =>
    rolePermissions[role]?.includes(permission),
  );
}
