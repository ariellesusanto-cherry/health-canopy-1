"use client";

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
  Settings,
  Bell,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Budget & Financials", href: "/budget", icon: CircleDollarSign },
  { name: "Inventory Analysis", href: "/ai-insights", icon: Brain },
  { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
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

      {/* Organization Selector */}
      <div className="px-4 py-3 border-b border-white/8">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-hover text-sm text-sidebar-text hover:text-white transition-colors">
          <div className="w-6 h-6 rounded bg-primary/25 flex items-center justify-center text-[11px] font-bold text-primary-light">
            CC
          </div>
          <span className="flex-1 text-left text-xs truncate">Contra Costa RMC</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
        </button>
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

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-white/8 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          Notifications
          <span className="ml-auto w-5 h-5 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center">
            6
          </span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors">
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
            KA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Kartik Aggarwal</p>
            <p className="text-sidebar-text text-[11px] truncate">System Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
