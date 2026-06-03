"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_TENANT, type Tenant, type TenantId, tenants } from "./tenants";

const STORAGE_KEY = "health-canopy.tenant";

type TenantContextValue = {
  tenant: Tenant;
  tenantId: TenantId;
  setTenant: (id: TenantId) => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<TenantId>(DEFAULT_TENANT);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in tenants) {
      setTenantId(stored as TenantId);
    }
  }, []);

  const setTenant = useCallback((id: TenantId) => {
    setTenantId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return (
    <TenantContext.Provider
      value={{ tenant: tenants[tenantId], tenantId, setTenant }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used inside <TenantProvider>");
  }
  return ctx;
}
