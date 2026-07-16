"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getRole,
  ROLE_COOKIE,
  ROLES,
  type RoleConfig,
  type RoleId,
} from "./roles";

type RoleContextValue = {
  role: RoleConfig | null;
  roleId: RoleId | null;
  /** Selected unit for unit-scoped roles (falls back to the role's defaultUnit). */
  unit: string | null;
  setRole: (id: RoleId) => void;
  setUnit: (unit: string) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

const UNIT_COOKIE = "hc_unit";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function RoleProvider({
  initialRoleId,
  children,
}: {
  initialRoleId?: RoleId | null;
  children: React.ReactNode;
}) {
  const [roleId, setRoleId] = useState<RoleId | null>(initialRoleId ?? null);
  const [unit, setUnitState] = useState<string | null>(null);

  // Hydrate from cookies on mount (middleware is the source of truth for
  // the guard; this keeps the client UI in sync).
  useEffect(() => {
    const stored = readCookie(ROLE_COOKIE);
    if (stored && stored in ROLES) setRoleId(stored as RoleId);
    const storedUnit = readCookie(UNIT_COOKIE);
    if (storedUnit) setUnitState(storedUnit);
  }, []);

  const setRole = useCallback((id: RoleId) => {
    writeCookie(ROLE_COOKIE, id);
    setRoleId(id);
  }, []);

  const setUnit = useCallback((u: string) => {
    writeCookie(UNIT_COOKIE, u);
    setUnitState(u);
  }, []);

  const logout = useCallback(() => {
    clearCookie(ROLE_COOKIE);
    clearCookie(UNIT_COOKIE);
    setRoleId(null);
    setUnitState(null);
  }, []);

  const role = getRole(roleId);
  const effectiveUnit = unit ?? role?.defaultUnit ?? null;

  return (
    <RoleContext.Provider
      value={{ role, roleId, unit: effectiveUnit, setRole, setUnit, logout }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used inside <RoleProvider>");
  }
  return ctx;
}
