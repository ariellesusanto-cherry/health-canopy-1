"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Brain,
  BarChart3,
  CircleDollarSign,
  TrendingUp,
  Leaf,
  LogIn,
  Check,
  ChevronsUpDown,
  Syringe,
} from "lucide-react";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { useTenant } from "@/lib/tenant-context";
import { tenants, type TenantId } from "@/lib/tenants";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Vaccine Mgmt", href: "/vaccine-management", icon: Syringe },
  { name: "AI Insights", href: "/ai-insights", icon: Brain },
  { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
  { name: "Financials", href: "/budget", icon: CircleDollarSign },
  { name: "Supply Chain", href: "/analytics", icon: BarChart3 },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar-bg flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-base tracking-tight font-display">Health Canopy</h1>
          <p className="text-sidebar-text text-[11px]">Inventory Intelligence</p>
        </div>
      </div>

      {/* Organization switcher */}
      <div className="px-4 py-3 border-b border-white/8">
        <TenantSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-sidebar-text hover:text-white hover:bg-sidebar-hover"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "")} />
              {item.name}
              {item.name === "AI Insights" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-accent-light pulse-dot" />
              )}
              {item.name === "Compliance" && (
                <Tooltip content="Compliance readiness score" position="right" className="ml-auto">
                  <span className="text-[11px] font-bold bg-warning/20 text-warning px-1.5 py-0.5 rounded cursor-help">
                    88%
                  </span>
                </Tooltip>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/8">
        <UserSlot />
      </div>
    </aside>
  );
}

function UserSlot() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) return <SignedInUser />;
  return (
    <SignInButton mode="modal">
      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors">
        <LogIn className="w-[18px] h-[18px]" />
        <span className="font-medium">Sign in</span>
      </button>
    </SignInButton>
  );
}

function TenantSwitcher() {
  const { tenant, setTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const options = Object.values(tenants);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-hover text-sm text-sidebar-text hover:bg-white/10 transition-colors"
      >
        <div className="w-6 h-6 rounded bg-primary/25 flex items-center justify-center text-[11px] font-bold text-primary-light shrink-0">
          {tenant.abbreviation}
        </div>
        <span className="flex-1 text-left text-xs truncate text-white">
          {tenant.name}
        </span>
        <ChevronsUpDown className="w-3.5 h-3.5 text-sidebar-text shrink-0" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-lg bg-sidebar-bg border border-white/10 shadow-lg overflow-hidden z-50">
          {options.map((opt) => {
            const active = opt.id === tenant.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTenant(opt.id as TenantId);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors",
                  active
                    ? "bg-primary/20 text-white"
                    : "text-sidebar-text hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="w-6 h-6 rounded bg-primary/25 flex items-center justify-center text-[11px] font-bold text-primary-light shrink-0">
                  {opt.abbreviation}
                </div>
                <span className="flex-1 truncate">{opt.name}</span>
                {active && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignedInUser() {
  const { user } = useUser();
  const name = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";
  const role =
    (user?.publicMetadata?.role as string | undefined) ??
    user?.primaryEmailAddress?.emailAddress ??
    "Signed in";

  return (
    <div className="flex items-center gap-3">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">{name}</p>
        <p className="text-sidebar-text text-[11px] truncate">{role}</p>
      </div>
    </div>
  );
}
