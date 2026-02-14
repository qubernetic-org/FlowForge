// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createContext, type ReactNode } from "react";
import type { UserInfo } from "../api/types";

export interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Initialize Keycloak, handle OIDC flow, manage token lifecycle
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        login: () => {},
        logout: () => {},
        token: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
