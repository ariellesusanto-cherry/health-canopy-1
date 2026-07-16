"use client";

import { useMemo } from "react";
import { Header } from "@/components/layout/header";
import {
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronDown,
  Truck,
  Snowflake,
  PackageCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useTenant } from "@/lib/tenant-context";
import { useRole } from "@/lib/role-context";
import { inventoryItems, upcomingDeliveries } from "@/lib/mock-data";

const statusMeta: Record<string, { label: string; badge: string; box: string }> = {
  "out-of-stock": { label: "OUT OF STOCK", badge: "bg-red-100 text-red-700", box: "bg-red-50 border-red-200" },
  critical: { label: "CRITICAL", badge: "bg-red-100 text-red-700", box: "bg-red-50 border-red-200" },
  "low-stock": { label: "LOW", badge: "bg-amber-100 text-amber-700", box: "bg-amber-50 border-amber-200" },
  "expiring-soon": { label: "EXPIRING", badge: "bg-amber-100 text-amber-700", box: "bg-amber-50 border-amber-200" },
};

const severityRank: Record<string, number> = {
  "out-of-stock": 0,
  critical: 1,
  "low-stock": 2,
  "expiring-soon": 3,
};

// Significant words from an item name, for loose delivery matching.
function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !["with", "kit", "size", "adult"].includes(w));
}

export default function UnitPage() {
  const { showToast } = useToast();
  const { tenant } = useTenant();
  const { unit, setUnit } = useRole();

  const units = useMemo(
    () => Array.from(new Set(inventoryItems.map((i) => i.department))).sort(),
    []
  );
  const activeUnit = unit && units.includes(unit) ? unit : units.includes("Med/Surg") ? "Med/Surg" : units[0];

  const unitItems = useMemo(
    () => inventoryItems.filter((i) => i.department === activeUnit),
    [activeUnit]
  );

  const counts = {
    total: unitItems.length,
    low: unitItems.filter((i) => i.status === "low-stock").length,
    critical: unitItems.filter((i) => i.status === "critical").length,
    out: unitItems.filter((i) => i.status === "out-of-stock").length,
  };

  const alerts = unitItems
    .filter((i) => i.status !== "in-stock")
    .sort((a, b) => (severityRank[a.status] ?? 9) - (severityRank[b.status] ?? 9));

  // Incoming deliveries whose contents loosely match this unit's items.
  const unitTokens = useMemo(() => {
    const set = new Set<string>();
    unitItems.forEach((i) => tokens(i.name).forEach((t) => set.add(t)));
    return set;
  }, [unitItems]);

  const deliveries = upcomingDeliveries.filter((d) =>
    d.items.some((it) => tokens(it.name).some((t) => unitTokens.has(t)))
  );

  // Cold-chain snapshot (facility vaccine fridges) — contextual.
  const fridges = tenant.coldChain.flatMap((site) =>
    site.fridges.map((f) => ({ site: site.siteName, ...f }))
  );

  return (
    <div className="min-h-screen">
      <Header title="My Unit" subtitle={`${tenant.shortName} — point-of-use supply view`} />

      <div className="p-8 max-w-5xl space-y-6">
        {/* Unit selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">Unit</span>
          <div className="relative">
            <select
              value={activeUnit}
              onChange={(e) => setUnit(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Items Tracked", value: counts.total, icon: Package, color: "text-primary bg-primary/10" },
            { label: "Low Stock", value: counts.low, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
            { label: "Critical", value: counts.critical, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
            { label: "Out of Stock", value: counts.out, icon: XCircle, color: "text-red-700 bg-red-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", s.color)}><s.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Unit stock alerts + actions */}
          <div className="col-span-7 bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Needs Attention — {activeUnit}
            </h3>
            {alerts.length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">Everything in this unit is at PAR. 🎉</p>
            ) : (
              <div className="space-y-2.5">
                {alerts.map((i) => {
                  const meta = statusMeta[i.status] ?? statusMeta["low-stock"];
                  const isOut = i.status === "out-of-stock";
                  return (
                    <div key={i.id} className={cn("p-3 rounded-lg border", meta.box)}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground">{i.name}</p>
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0", meta.badge)}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] font-bold text-foreground">
                          {i.currentStock.toLocaleString()} / {i.parLevel.toLocaleString()} units
                        </span>
                        <button
                          onClick={() =>
                            showToast(
                              isOut
                                ? `Stockout flagged — restock request sent for ${i.name}`
                                : `Restock requested for ${i.name}`,
                              "success"
                            )
                          }
                          className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          {isOut ? "Flag stockout" : "Request restock"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Incoming deliveries + fridge status */}
          <div className="col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                Incoming to Your Unit
              </h3>
              {deliveries.length === 0 ? (
                <p className="text-xs text-muted py-4 text-center">No incoming deliveries flagged for {activeUnit}.</p>
              ) : (
                <div className="space-y-2.5">
                  {deliveries.map((d) => (
                    <div key={d.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">{d.supplier}</span>
                        <span className="text-[11px] text-primary font-medium">ETA {d.estimatedArrival}</span>
                      </div>
                      <p className="text-[11px] text-muted truncate">{d.items.map((i) => i.name).join(", ")}</p>
                      <button
                        onClick={() => showToast(`Marked received: ${d.supplier} delivery`, "success")}
                        className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-light transition-colors mt-1.5"
                      >
                        <PackageCheck className="w-3 h-3" />
                        Mark received
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-primary" />
                Vaccine Fridge Status
              </h3>
              <div className="space-y-2">
                {fridges.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          f.status === "normal" ? "bg-accent" : f.status === "alert" ? "bg-amber-400" : "bg-red-500"
                        )}
                      />
                      <span className="text-muted truncate">{f.site} · {f.type}</span>
                    </div>
                    <span className={cn("font-semibold shrink-0", f.status === "normal" ? "text-foreground" : "text-amber-600")}>
                      {f.tempF}°F
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Target range 36–46°F · logged twice daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
