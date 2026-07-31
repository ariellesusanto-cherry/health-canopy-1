"use client";

import { Header } from "@/components/layout/header";
import {
  Package,
  MapPin,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Brain,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  CircleDollarSign,
  Activity,
  Boxes,
  Truck,
  FileText,
  ArrowRightLeft,
  Syringe,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { useToast } from "@/components/ui/toast";
import { useTenant } from "@/lib/tenant-context";
import { useSimulation } from "@/lib/simulation";
import type { Tenant } from "@/lib/tenants";
import {
  aiInsights,
  recentActivity,
  departmentConsumption,
  upcomingPurchaseOrders,
  upcomingDeliveries,
  delayedShipments,
  parLocations,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";

function buildMetrics(tenant: Tenant) {
  // Alert KPI is derived from the actual attention list so the number
  // always matches what the cards below show.
  const attention = tenant.itemsNeedingAttention;
  const criticalCount = attention.filter(
    (i) => i.status === "critical" || i.status === "out-of-stock"
  ).length;
  return [
    {
      label: "Total SKUs Tracked",
      value: tenant.metrics.totalSKUs,
      change: tenant.metrics.skuChange,
      trend: "up" as const,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "PAR Locations",
      value: tenant.metrics.parLocationCount,
      change: tenant.metrics.parLocationContext,
      trend: "neutral" as const,
      icon: MapPin,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Alerts",
      value: String(attention.length),
      change: `${criticalCount} critical`,
      trend: "down" as const,
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Monthly Spend",
      value: tenant.metrics.monthlySpend,
      change: tenant.metrics.spendChange,
      trend: "up" as const,
      icon: CircleDollarSign,
      color: "bg-accent/10 text-accent",
    },
  ];
}

function InsightCard({ insight }: { insight: (typeof aiInsights)[0] }) {
  const severityConfig = {
    high: { bg: "bg-red-50 border-red-200", icon: AlertCircle, iconColor: "text-red-600", badge: "bg-red-100 text-red-700" },
    medium: { bg: "bg-amber-50 border-amber-200", icon: AlertTriangle, iconColor: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
    low: { bg: "bg-stone-50 border-stone-200", icon: Activity, iconColor: "text-stone-500", badge: "bg-stone-200 text-stone-600" },
    info: { bg: "bg-accent/5 border-accent/20", icon: Sparkles, iconColor: "text-accent", badge: "bg-accent/10 text-accent" },
  };
  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  const typeLabels = { prediction: "Prediction", anomaly: "Anomaly", recommendation: "Recommendation", outbreak: "Outbreak Intel", "cost-saving": "Cost Saving" };

  return (
    <div className={cn("p-4 rounded-xl border", config.bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded", config.badge)}>
              {typeLabels[insight.type]}
            </span>
            <span className="text-[11px] text-muted">
              {new Date(insight.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">{insight.title}</h4>
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{insight.description}</p>
          {insight.impact && (
            <p className="text-xs font-medium text-primary mt-2">{insight.impact}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const poStatusColors: Record<string, string> = {
  "ai-recommended": "bg-red-50 text-red-700 border-red-200",
  "pending-approval": "bg-amber-50 text-amber-700 border-amber-200",
  "approved": "bg-accent/10 text-accent border-accent/20",
  "submitted": "bg-accent/10 text-accent border-accent/20",
  "in-transit": "bg-accent/10 text-accent border-accent/20",
};

const poStatusLabels: Record<string, string> = {
  "ai-recommended": "AI Recommended",
  "pending-approval": "Pending Approval",
  "approved": "Approved",
  "submitted": "Submitted",
  "in-transit": "In Transit",
};

export default function Dashboard() {
  const { showToast } = useToast();
  const { tenant } = useTenant();
  const { simInsights, simActivities, fridges } = useSimulation();
  const metrics = buildMetrics(tenant);
  // Live scenario insights (e.g. cold chain excursion) lead; then the
  // tenant's surge insight and the general AI insights.
  const topInsights = [
    ...simInsights,
    tenant.surgeInsight,
    ...aiInsights.filter((i) => i.id !== "AI-001"),
  ].slice(0, 3);

  const vfcActivities = tenant.vfcScans.map((s) => ({
    time: new Date(s.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    action: "VFC dose scanned",
    detail: `${s.vaccine} (${s.brand}) → ${s.site} → Patient ${s.patientId}${s.registrySubmitted ? ` → ${tenant.vfcCompliance.registry} submitted` : ""}`,
    user: s.fridge === "VFC" ? "VFC fridge scan" : "Private fridge scan",
  }));
  const activities = [...simActivities, ...vfcActivities, ...recentActivity];

  const pendingPOs = upcomingPurchaseOrders.filter(
    (po) => po.status === "pending-approval" || po.status === "ai-recommended"
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Operations Dashboard"
        subtitle={tenant.dashboardSubtitle}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Metrics Row */}
        <div data-tour="kpis" className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="bg-white rounded-xl border border-border p-5 card-enter"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wide">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <CountUp value={m.value} />
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {m.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-accent" />}
                    {m.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-amber-500" />}
                    <span className="text-xs text-muted">{m.change}</span>
                  </div>
                </div>
                <div className={cn("p-2.5 rounded-lg", m.color)}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supply Chain Status */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {tenant.supplyChains.map((sc) => (
            <div
              key={sc.chain}
              className={cn(
                "bg-white rounded-xl border p-4 flex items-center gap-3",
                sc.status === "critical"
                  ? "border-red-200 ring-1 ring-red-100 bg-red-50/30"
                  : "border-border"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full shrink-0", sc.status === "normal" ? "bg-accent" : sc.status === "low" ? "bg-amber-400" : "bg-red-500")} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{sc.chain}</span>
                  <span className={cn("text-xs font-bold", sc.fill >= 90 ? "text-accent" : sc.fill >= 80 ? "text-amber-600" : "text-red-600")}>{sc.fill}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1.5">
                  <div className={cn("h-full rounded-full", sc.fill >= 90 ? "bg-accent" : sc.fill >= 80 ? "bg-amber-400" : "bg-red-500")} style={{ width: `${sc.fill}%` }} />
                </div>
                <span className="text-[11px] text-muted mt-1">{sc.locations} PAR locations</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Operational focus */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Stock alerts + Pending orders */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Critical Items */}
            <div data-tour="attention" className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Items Needing Attention
              </h3>
              <div className="space-y-3">
                {tenant.itemsNeedingAttention.map((item) => {
                  const isExpiring = item.status === "expiring-soon";
                  const isVaccine = !!item.fridge;
                  const containerCls = isExpiring
                    ? "p-3 rounded-lg bg-amber-50 border border-amber-200"
                    : "p-3 rounded-lg bg-red-50 border border-red-200";
                  const statusBadge = isExpiring
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700";
                  const statusLabel =
                    item.status === "out-of-stock" ? "OUT OF STOCK" :
                    item.status === "critical" ? "CRITICAL" : "EXPIRING SOON";
                  return (
                    <div key={item.id} className={containerCls}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                        {isVaccine && (
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border shrink-0",
                            item.fridge === "VFC"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                          )}>
                            {item.fridge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        {item.department}{item.site ? ` · ${item.site}` : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {isExpiring ? (
                          <span className="text-[11px] font-bold text-amber-600">
                            Expires: {item.expirationDate}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-600">
                            {item.currentStock} / {item.parLevel} units
                          </span>
                        )}
                        <span className={cn("text-[11px] px-1.5 py-0.5 rounded font-medium", statusBadge)}>
                          {statusLabel}
                        </span>
                      </div>
                      {item.action && (
                        <p className="text-[11px] text-primary mt-1.5 leading-snug">→ {item.action}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link href="/inventory" className="flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                View full inventory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Pending Orders / Deliveries */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Orders Needing Action
              </h3>
              <div className="space-y-3">
                {pendingPOs.map((po) => (
                  <div key={po.id} className="p-3 rounded-lg border border-border hover:bg-stone-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-foreground">{po.id}</span>
                      <span className={cn("text-[11px] font-semibold px-1.5 py-0.5 rounded-full border", poStatusColors[po.status])}>
                        {poStatusLabels[po.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">{po.supplier} — {po.department}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-semibold text-foreground">${po.totalCost.toLocaleString()}</span>
                      <span className="text-[11px] text-muted">Delivery: {po.expectedDelivery}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/budget" className="flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                View all orders <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Cross-Location Imbalances */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                Cross-Location Imbalances
              </h3>
              <div className="space-y-3">
                {tenant.locationImbalances.slice(0, 3).map((imb) => (
                  <div key={imb.itemId} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs font-semibold text-foreground">{imb.itemName}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-amber-700 font-medium">{imb.fromLocation}: {imb.fromPctOfPar}% of PAR</span>
                      <ArrowRight className="w-3 h-3 text-muted shrink-0" />
                      <span className="text-red-600 font-medium">{imb.toLocation}: {imb.toPctOfPar}% of PAR</span>
                    </div>
                    <p className="text-[11px] text-accent mt-1.5">
                      Suggested: Transfer {imb.suggestedQty} units
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/inventory" className="flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                View all locations <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Middle: AI Insights + live cold chain */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
                  <span className="w-2 h-2 rounded-full bg-accent-light pulse-dot" />
                </div>
                <Link href="/ai-insights" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {topInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            {/* Live cold chain snapshot */}
            <div data-tour="cold-chain-live" className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Cold Chain — Live</h3>
                  <span className="w-2 h-2 rounded-full bg-accent-light pulse-dot" />
                </div>
                <Link href="/cold-chain" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Live charts <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {fridges
                  .filter((f) => f.kind !== "Freezer")
                  .map((f) => {
                    const latest = f.readings[f.readings.length - 1]?.tempF;
                    return (
                      <div
                        key={f.key}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2",
                          f.status === "excursion"
                            ? "border-red-200 bg-red-50"
                            : f.status === "alert"
                              ? "border-amber-200 bg-amber-50"
                              : "border-border"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                f.status === "normal" ? "bg-accent" : f.status === "alert" ? "bg-amber-400" : "bg-red-500 pulse-dot"
                              )}
                            />
                            <span className="text-[11px] font-semibold text-foreground truncate">
                              {f.siteName.replace("Contra Costa Regional Medical Center", "CCRMC")}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted">{f.kind} · {f.doseCount} doses</span>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-bold tabular-nums shrink-0",
                            f.status === "excursion" ? "text-red-600" : f.status === "alert" ? "text-amber-600" : "text-foreground"
                          )}
                        >
                          {latest?.toFixed(1)}°F
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right: Incoming Deliveries + Activity */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Incoming Deliveries — delayed + on-track combined */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                Incoming Deliveries
              </h3>
              <div className="space-y-3">
                {/* Delayed shipments first */}
                {delayedShipments.map((ds) => (
                  <div key={ds.id} className={cn(
                    "p-3 rounded-lg border",
                    ds.impactSeverity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{ds.supplier}</span>
                      <span className={cn(
                        "text-[11px] font-bold px-1.5 py-0.5 rounded",
                        ds.impactSeverity === "critical" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"
                      )}>
                        DELAYED {ds.delayDays}d
                      </span>
                    </div>
                    <p className="text-[11px] text-muted truncate">
                      {ds.items.map((i) => i.name).join(", ")}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-semibold text-foreground">${ds.totalCost.toLocaleString()}</span>
                      <span className="text-[11px]">
                        {ds.revisedEta
                          ? <span className="text-amber-600 font-medium">Revised: {ds.revisedEta}</span>
                          : <span className="text-red-600 font-medium">No ETA</span>
                        }
                      </span>
                    </div>
                  </div>
                ))}

                {/* On-track deliveries */}
                {upcomingDeliveries.map((del) => {
                  const statusLabels: Record<string, string> = {
                    "label-created": "Label Created",
                    "picked-up": "Picked Up",
                    "in-transit": "In Transit",
                    "out-for-delivery": "Arriving Today",
                    "delivered": "Delivered",
                  };
                  const statusColors: Record<string, string> = {
                    "out-for-delivery": "text-accent font-semibold",
                    "in-transit": "text-amber-600",
                    "picked-up": "text-amber-600",
                  };
                  return (
                    <div key={del.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">{del.supplier}</span>
                        <span className={cn("text-[11px]", statusColors[del.trackingStatus] || "text-muted")}>
                          {statusLabels[del.trackingStatus]}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted truncate">
                        {del.items.map((i) => i.name).join(", ")}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-semibold text-foreground">${del.totalCost.toLocaleString()}</span>
                        <span className="text-[11px] text-primary font-medium">ETA: {del.estimatedArrival}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/budget" className="flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                Track all deliveries <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Department Consumption */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Department Consumption — Current vs. AI Predicted
                </h3>
                <p className="text-xs text-muted mt-0.5">Supply items consumed per day by department. Red bars = AI predicts &gt;10% increase.</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-accent" />
                  <span className="text-muted">AI Predicted</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentConsumption} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }} />
                  <Bar dataKey="current" fill="#b5654a" radius={[4, 4, 0, 0]} barSize={24} name="Current" />
                  <Bar dataKey="predicted" radius={[4, 4, 0, 0]} barSize={24} name="AI Predicted">
                    {departmentConsumption.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.change > 10 ? "#ef4444" : "#4a7a52"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    a.action === "VFC dose scanned" ? "bg-primary/10" :
                    a.action === "AI Alert" ? "bg-red-50" :
                    a.action.includes("alert") ? "bg-amber-50" :
                    a.action.includes("Compliance") ? "bg-amber-50" : "bg-stone-50"
                  )}>
                    {a.action === "VFC dose scanned" ? <Syringe className="w-4 h-4 text-primary" /> :
                     a.action === "AI Alert" ? <Brain className="w-4 h-4 text-red-600" /> :
                     a.action.includes("alert") ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                     a.action.includes("completed") || a.action.includes("received") ? <CheckCircle2 className="w-4 h-4 text-accent" /> :
                     a.action.includes("PO") ? <Boxes className="w-4 h-4 text-amber-600" /> :
                     <Activity className="w-4 h-4 text-stone-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{a.action}</span>
                      <span className="text-[11px] text-muted">{a.time}</span>
                    </div>
                    <p className="text-[11px] text-muted mt-0.5 truncate">{a.detail}</p>
                    <p className="text-[11px] text-muted">{a.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
