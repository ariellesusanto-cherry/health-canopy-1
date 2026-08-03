"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { useToast } from "@/components/ui/toast";
import { useRole } from "@/lib/role-context";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Download,
  Brain,
  CircleDollarSign,
  Boxes,
  MapPin,
  CalendarDays,
  Info,
  OctagonAlert,
  Timer,
  ArrowRightLeft,
  ExternalLink,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip as InfoTooltip } from "@/components/ui/tooltip";
import {
  budgetAllocation,
  inventoryValuation,
  upcomingPurchaseOrders,
  upcomingDeliveries,
  delayedShipments,
  monthlySpendForecast,
} from "@/lib/mock-data";
import { useTenant } from "@/lib/tenant-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Cell,
  ComposedChart,
  Legend,
} from "recharts";

const poStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "ai-recommended": { label: "AI Recommended", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  "pending-approval": { label: "Pending Approval", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "approved": { label: "Approved", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  "submitted": { label: "Submitted", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  "in-transit": { label: "In Transit", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
};

const deliveryStatusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  "label-created": { label: "Label Created", color: "text-stone-500", icon: Clock },
  "picked-up": { label: "Picked Up", color: "text-amber-600", icon: Package },
  "in-transit": { label: "In Transit", color: "text-amber-600", icon: Truck },
  "out-for-delivery": { label: "Out for Delivery", color: "text-accent", icon: Truck },
  "delivered": { label: "Delivered", color: "text-accent", icon: CheckCircle2 },
};

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "deliveries">("overview");
  const [approvedPOs, setApprovedPOs] = useState<Set<string>>(new Set());
  const { showToast } = useToast();
  const { tenant } = useTenant();
  const { role } = useRole();
  // Read-only personas (Executive) get full financial visibility but no
  // operational actions — approvals stay with the supply chain team.
  const readOnly = !!role?.readOnly;
  const scale = tenant.financialScale;

  // Summary calculations — scaled to active tenant so headline numbers match the dashboard
  const totalAnnualBudget = budgetAllocation.reduce((s, b) => s + b.annualBudget, 0) * scale;
  const totalYtdSpend = budgetAllocation.reduce((s, b) => s + b.ytdSpend, 0) * scale;
  const totalYtdBudget = budgetAllocation.reduce((s, b) => s + b.ytdBudget, 0) * scale;
  const totalForecast = budgetAllocation.reduce((s, b) => s + b.forecast, 0) * scale;
  const totalInventoryValue = inventoryValuation.reduce((s, v) => s + v.totalValue, 0) * scale;
  const pendingPOTotal = upcomingPurchaseOrders.reduce((s, po) => s + po.totalCost, 0);
  const inTransitTotal = upcomingDeliveries.reduce((s, d) => s + d.totalCost, 0);

  const budgetVariance = totalYtdSpend - totalYtdBudget;
  const budgetVariancePct = ((budgetVariance / totalYtdBudget) * 100);

  return (
    <div className="min-h-screen">
      <Header
        title="Financials"
        subtitle="Inventory budget tracking, purchase orders, and delivery cost forecasting"
      />

      <div className="p-4 md:p-8 space-y-6">
        {readOnly && (
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <Lock className="w-3.5 h-3.5" />
            Read-only financial view — PO approvals and order actions stay with the supply chain team
          </div>
        )}
        {/* Top KPI Cards */}
        <div data-tour="fin-kpis" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            {
              label: "Annual Inventory Budget",
              value: `$${(totalAnnualBudget / 1_000_000).toFixed(1)}M`,
              detail: `FY 2025-26`,
              icon: CircleDollarSign,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "YTD Spend",
              value: `$${(totalYtdSpend / 1_000_000).toFixed(2)}M`,
              detail: budgetVariance > 0
                ? `$${(budgetVariance / 1000).toFixed(0)}K over budget`
                : `$${(Math.abs(budgetVariance) / 1000).toFixed(0)}K under budget`,
              detailColor: budgetVariance > 0 ? "text-red-600" : "text-accent",
              icon: DollarSign,
              color: budgetVariance > 0 ? "bg-red-50 text-red-600" : "bg-accent/10 text-accent",
            },
            {
              label: "Current Inventory Value",
              value: `$${(totalInventoryValue / 1_000_000).toFixed(2)}M`,
              detail: "Total value on shelves right now",
              icon: Boxes,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Pending Purchase Orders",
              value: `$${(pendingPOTotal / 1000).toFixed(1)}K`,
              detail: `${upcomingPurchaseOrders.length} orders in pipeline`,
              icon: FileText,
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "In-Transit Shipments",
              value: `$${(inTransitTotal / 1000).toFixed(1)}K`,
              detail: `${upcomingDeliveries.length} deliveries expected`,
              icon: Truck,
              color: "bg-accent/10 text-accent",
            },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-lg", kpi.color)}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] font-medium text-muted uppercase mt-1">{kpi.label}</p>
              <p className={cn("text-[11px] mt-1", "detailColor" in kpi ? kpi.detailColor : "text-muted")}>{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {[
            { id: "overview" as const, label: "Budget & Valuation" },
            { id: "orders" as const, label: "Purchase Orders" },
            { id: "deliveries" as const, label: "Upcoming Deliveries" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================ */}
        {/* TAB: Budget & Valuation                      */}
        {/* ============================================ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Monthly Spend vs Budget + AI Forecast */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-foreground">Monthly Inventory Spend vs. Budget</h3>
                <p className="text-xs text-muted mt-1">
                  Blue bars show actual spend each month. The gray dashed line is the allocated budget.
                  After March, the green bars show the AI&apos;s forecast of what the hospital will spend,
                  based on scheduled surgeries, seasonal patterns, and current supply prices.
                </p>
              </div>
              <div className="flex items-center gap-6 mb-4 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-foreground font-medium">Actual spend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-accent" />
                  <span className="text-foreground font-medium">AI forecasted spend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0 border-t-2 border-dashed border-gray-400" />
                  <span className="text-foreground font-medium">Budget allocation</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlySpendForecast.map((m) => ({
                    month: m.month,
                    actual: m.actual === null ? null : Math.round(m.actual * scale),
                    budget: Math.round(m.budget * scale),
                    forecast: m.forecast === null ? null : Math.round(m.forecast * scale),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b6057" }}
                      axisLine={{ stroke: "#e6ddd0" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }}
                      formatter={(value) => value ? [`$${(Number(value) / 1000).toFixed(0)}K`, ""] : ["—", ""]}
                    />
                    <Bar dataKey="actual" fill="#b5654a" radius={[4, 4, 0, 0]} barSize={28} name="Actual Spend" />
                    <Bar dataKey="forecast" fill="#4a7a52" radius={[4, 4, 0, 0]} barSize={28} name="AI Forecast" />
                    <Line type="monotone" dataKey="budget" stroke="#b8a898" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Budget" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">AI forecast note:</span> April spend is projected $32K above budget due to the flu surge driving higher PPE and medication orders. June also trends high because of 3 additional spinal fusion cases added to the OR schedule.
                </p>
              </div>
            </div>

            {/* Budget Allocation by Category */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Budget Allocation by Supply Category</h3>
                  <p className="text-xs text-muted mt-0.5">Annual budget, year-to-date spend, and AI-projected full-year spend</p>
                </div>
                <button
                  onClick={() => {
                    downloadCSV(
                      "budget-allocation.csv",
                      ["Category", "Annual Budget", "YTD Spend", "YTD Budget", "Variance", "AI Forecast"],
                      budgetAllocation.map((b) => [
                        b.category,
                        String(b.annualBudget),
                        String(b.ytdSpend),
                        String(b.ytdBudget),
                        String(b.ytdSpend - b.ytdBudget),
                        String(b.forecast),
                      ])
                    );
                    showToast("Budget allocation exported to CSV");
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-stone-50">
                    {[
                      { label: "Category" },
                      { label: "Annual Budget" },
                      { label: "YTD Spend", tooltip: "Year-to-date actual spend" },
                      { label: "YTD Budget", tooltip: "Year-to-date budgeted amount" },
                      { label: "Variance" },
                      { label: "AI Full-Year Forecast", tooltip: "AI-projected total spend by end of fiscal year, based on trends and scheduled procedures" },
                      { label: "vs. Budget" },
                    ].map((h) => (
                      <th key={h.label} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-4 py-3">
                        {h.tooltip ? (
                          <InfoTooltip content={h.tooltip} position="bottom" wide>
                            <span className="cursor-help border-b border-dotted border-muted/60">{h.label}</span>
                          </InfoTooltip>
                        ) : h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {budgetAllocation.map((b) => {
                    const variance = b.ytdSpend - b.ytdBudget;
                    const forecastVariance = b.forecast - b.annualBudget;
                    return (
                      <tr key={b.category} className="border-b border-border/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{b.category}</td>
                        <td className="px-4 py-3 text-sm text-foreground">${(b.annualBudget / 1000).toLocaleString()}K</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">${(b.ytdSpend / 1000).toLocaleString()}K</td>
                        <td className="px-4 py-3 text-sm text-muted">${(b.ytdBudget / 1000).toLocaleString()}K</td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold", variance > 0 ? "text-red-600" : "text-accent")}>
                            {variance > 0 ? "+" : ""}{(variance / 1000).toFixed(0)}K
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-3 h-3 text-accent" />
                            <span className="text-sm font-medium text-foreground">${(b.forecast / 1000).toLocaleString()}K</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold", forecastVariance > 0 ? "text-red-600" : "text-accent")}>
                            {forecastVariance > 0 ? "+" : ""}{(forecastVariance / 1000).toFixed(0)}K
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Totals row */}
                  <tr className="bg-stone-50 font-semibold">
                    <td className="px-4 py-3 text-sm text-foreground">Total</td>
                    <td className="px-4 py-3 text-sm text-foreground">${(totalAnnualBudget / 1_000_000).toFixed(1)}M</td>
                    <td className="px-4 py-3 text-sm text-foreground">${(totalYtdSpend / 1_000_000).toFixed(2)}M</td>
                    <td className="px-4 py-3 text-sm text-muted">${(totalYtdBudget / 1_000_000).toFixed(2)}M</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-bold", budgetVariance > 0 ? "text-red-600" : "text-accent")}>
                        {budgetVariance > 0 ? "+" : ""}{(budgetVariance / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-3 h-3 text-accent" />
                        <span className="text-sm font-bold text-foreground">${(totalForecast / 1_000_000).toFixed(1)}M</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-bold", (totalForecast - totalAnnualBudget) > 0 ? "text-red-600" : "text-accent")}>
                        {(totalForecast - totalAnnualBudget) > 0 ? "+" : ""}{((totalForecast - totalAnnualBudget) / 1000).toFixed(0)}K
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================ */}
        {/* TAB: Purchase Orders                         */}
        {/* ============================================ */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: "AI Recommended", count: upcomingPurchaseOrders.filter(p => p.status === "ai-recommended").length, cost: upcomingPurchaseOrders.filter(p => p.status === "ai-recommended").reduce((s, p) => s + p.totalCost, 0), color: "bg-red-50 text-red-600 border-red-200" },
                { label: "Pending Approval", count: upcomingPurchaseOrders.filter(p => p.status === "pending-approval").length, cost: upcomingPurchaseOrders.filter(p => p.status === "pending-approval").reduce((s, p) => s + p.totalCost, 0), color: "bg-amber-50 text-amber-600 border-amber-200" },
                { label: "Approved / Submitted", count: upcomingPurchaseOrders.filter(p => p.status === "approved" || p.status === "submitted").length, cost: upcomingPurchaseOrders.filter(p => p.status === "approved" || p.status === "submitted").reduce((s, p) => s + p.totalCost, 0), color: "bg-accent/10 text-accent border-accent/20" },
                { label: "In Transit", count: upcomingPurchaseOrders.filter(p => p.status === "in-transit").length, cost: upcomingPurchaseOrders.filter(p => p.status === "in-transit").reduce((s, p) => s + p.totalCost, 0), color: "bg-accent/10 text-accent border-accent/20" },
              ].map((s) => (
                <div key={s.label} className={cn("rounded-xl border p-4", s.color)}>
                  <p className="text-lg font-bold">{s.count}</p>
                  <p className="text-xs font-medium">{s.label}</p>
                  <p className="text-xs mt-1 opacity-80">${s.cost.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {upcomingPurchaseOrders.map((po) => {
                const sc = poStatusConfig[po.status];
                const isAI = po.triggeredBy === "ai-forecast";
                return (
                  <div key={po.id} className="bg-white rounded-xl border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-foreground">{po.id}</span>
                        <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full border", sc.bg, sc.color)}>
                          {sc.label}
                        </span>
                        {isAI && (
                          <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 flex items-center gap-1">
                            <Brain className="w-3 h-3" /> AI Generated
                          </span>
                        )}
                        <span className="text-[11px] text-muted">
                          Triggered by: {po.triggeredBy === "par-trigger" ? "PAR level alert" : po.triggeredBy === "ai-forecast" ? "AI demand forecast" : po.triggeredBy === "auto-reorder" ? "Auto-reorder rule" : "Manual"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">${po.totalCost.toLocaleString()}</p>
                        <p className="text-[11px] text-muted">Order total</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-3 text-xs text-muted">
                      <span><span className="font-medium text-foreground">Supplier:</span> {po.supplier}</span>
                      <span><span className="font-medium text-foreground">Dept:</span> {po.department}</span>
                      <span><span className="font-medium text-foreground">Ordered:</span> {po.orderDate}</span>
                      <span><span className="font-medium text-foreground">Expected delivery:</span> <span className="font-semibold text-primary">{po.expectedDelivery}</span></span>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-3">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left text-[11px] font-semibold text-muted uppercase px-2 py-1">Item</th>
                            <th className="text-right text-[11px] font-semibold text-muted uppercase px-2 py-1">Qty</th>
                            <th className="text-right text-[11px] font-semibold text-muted uppercase px-2 py-1">Unit Cost</th>
                            <th className="text-right text-[11px] font-semibold text-muted uppercase px-2 py-1">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {po.items.map((item, i) => (
                            <tr key={i} className="border-t border-border/50">
                              <td className="px-2 py-1.5 text-xs text-foreground">{item.name}</td>
                              <td className="px-2 py-1.5 text-xs text-foreground text-right">{item.qty.toLocaleString()}</td>
                              <td className="px-2 py-1.5 text-xs text-muted text-right">${item.unitCost.toFixed(2)}</td>
                              <td className="px-2 py-1.5 text-xs font-semibold text-foreground text-right">${(item.qty * item.unitCost).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {!readOnly && (po.status === "ai-recommended" || po.status === "pending-approval") && !approvedPOs.has(po.id) && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => {
                            setApprovedPOs((prev) => new Set(prev).add(po.id));
                            showToast(`${po.id} approved and submitted to ${po.supplier}`);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Submit
                        </button>
                        <button
                          onClick={() => showToast("Order editing requires ERP integration", "info")}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-muted border border-border rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          Edit Order
                        </button>
                      </div>
                    )}
                    {approvedPOs.has(po.id) && (
                      <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span className="text-xs font-medium text-accent">Approved & submitted</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: Upcoming Deliveries                     */}
        {/* ============================================ */}
        {activeTab === "deliveries" && (
          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">{upcomingDeliveries.length}</p>
                  <p className="text-xs text-accent">On-Track Shipments — ${inTransitTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <OctagonAlert className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-red-800">{delayedShipments.length}</p>
                  <p className="text-xs text-red-700">Delayed Shipments — ${delayedShipments.reduce((s, d) => s + d.totalCost, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <Timer className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-amber-700">{(delayedShipments.reduce((s, d) => s + d.delayDays, 0) / delayedShipments.length).toFixed(1)} days</p>
                  <p className="text-xs text-amber-700">Avg Delay — {delayedShipments.filter(d => d.impactSeverity === "critical").length} critical</p>
                </div>
              </div>
            </div>

            {/* Delayed Shipments */}
            {delayedShipments.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <OctagonAlert className="w-5 h-5 text-red-600" />
                  Delayed Shipments
                </h3>
                <div className="space-y-4">
                  {delayedShipments.map((ds) => (
                    <div key={ds.id} className={cn(
                      "rounded-xl border-2 overflow-hidden",
                      ds.impactSeverity === "critical" ? "border-red-300 bg-red-50/50" : ds.impactSeverity === "high" ? "border-amber-300 bg-amber-50/30" : "border-border bg-white"
                    )}>
                      {/* Header */}
                      <div className={cn(
                        "px-5 py-3 flex items-center justify-between",
                        ds.impactSeverity === "critical" ? "bg-red-100/60" : ds.impactSeverity === "high" ? "bg-amber-100/40" : "bg-stone-50"
                      )}>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-bold text-foreground">{ds.id}</span>
                          <span className="text-[11px] text-muted">PO: {ds.poId}</span>
                          <span className={cn(
                            "text-[11px] font-bold px-2 py-0.5 rounded-full",
                            ds.impactSeverity === "critical" ? "bg-red-200 text-red-800" : ds.impactSeverity === "high" ? "bg-amber-200 text-amber-700" : "bg-stone-200 text-stone-700"
                          )}>
                            {ds.impactSeverity.toUpperCase()} — {ds.delayDays} DAY DELAY
                          </span>
                        </div>
                        <span className="text-lg font-bold text-foreground">${ds.totalCost.toLocaleString()}</span>
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Supplier / carrier / dates */}
                        <div className="flex items-center gap-8 text-xs">
                          <span><span className="font-medium text-foreground">Supplier:</span> <span className="text-muted">{ds.supplier}</span></span>
                          <span><span className="font-medium text-foreground">Carrier:</span> <span className="text-muted">{ds.carrier}</span></span>
                          <span><span className="font-medium text-foreground">Original ETA:</span> <span className="text-red-600 line-through">{ds.originalEta}</span></span>
                          <span><span className="font-medium text-foreground">Revised ETA:</span> <span className={cn("font-semibold", ds.revisedEta ? "text-amber-600" : "text-red-600")}>{ds.revisedEta || "Pending — no ETA"}</span></span>
                        </div>

                        {/* Delay reason */}
                        <div className="p-3 rounded-lg bg-white border border-border">
                          <p className="text-[11px] font-semibold text-muted uppercase mb-1">Delay Reason</p>
                          <p className="text-xs text-foreground">{ds.reason}</p>
                          <p className="text-[11px] text-muted mt-1.5">{ds.carrierUpdate}</p>
                        </div>

                        {/* Items + affected departments */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[11px] font-semibold text-muted uppercase mb-2">Items in Shipment</p>
                            <div className="flex flex-wrap gap-2">
                              {ds.items.map((item, i) => (
                                <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-border text-foreground">
                                  {item.name} <span className="text-muted">x{item.qty}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-muted uppercase mb-2">Affected Departments</p>
                            <div className="flex flex-wrap gap-2">
                              {ds.affectedDepartments.map((dept) => (
                                <span key={dept} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Inventory impact */}
                        <div className={cn(
                          "p-3 rounded-lg border",
                          ds.impactSeverity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                        )}>
                          <p className="text-[11px] font-semibold text-muted uppercase mb-1">Inventory Impact</p>
                          <p className="text-xs text-foreground leading-relaxed">{ds.inventoryImpact}</p>
                        </div>

                        {/* Mitigation options */}
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-[11px] font-semibold text-primary uppercase mb-2 flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> Mitigation Options
                          </p>
                          <ul className="space-y-1.5">
                            {ds.mitigationOptions.map((opt, i) => (
                              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                                <span className="text-primary font-bold mt-px">{i + 1}.</span>
                                {opt}
                              </li>
                            ))}
                          </ul>
                          {!readOnly && ds.impactSeverity === "critical" && (
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() => showToast(`Emergency PO drafted for ${ds.supplier} — backup supplier order initiated`, "warning")}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Place Emergency Order
                              </button>
                              <button
                                onClick={() => showToast(`Contact request sent to ${ds.supplier} account representative`, "info")}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                              >
                                Contact Supplier
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* On-Track Deliveries */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-accent" />
                On-Track Deliveries
              </h3>
            </div>

            {upcomingDeliveries.map((del) => {
              const status = deliveryStatusConfig[del.trackingStatus];
              const StatusIcon = status.icon;

              return (
                <div key={del.id} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono font-bold text-foreground">{del.id}</span>
                        <span className="text-[11px] text-muted">PO: {del.poId}</span>
                        <div className={cn("flex items-center gap-1 text-xs font-semibold", status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>
                      <p className="text-xs text-muted">{del.supplier} via {del.carrier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">${del.totalCost.toLocaleString()}</p>
                      <p className="text-[11px] text-muted">+ ${del.shippingCost} shipping</p>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="flex items-center gap-0 mb-4">
                    {(["label-created", "picked-up", "in-transit", "out-for-delivery", "delivered"] as const).map((step, i) => {
                      const steps = ["label-created", "picked-up", "in-transit", "out-for-delivery", "delivered"];
                      const currentIdx = steps.indexOf(del.trackingStatus);
                      const isPast = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={step} className="flex-1 flex items-center">
                          <div className={cn(
                            "w-3 h-3 rounded-full shrink-0 border-2",
                            isPast ? "bg-accent border-accent" : "bg-white border-stone-300"
                          )}>
                            {isCurrent && <div className="w-full h-full rounded-full animate-ping bg-accent-light opacity-50" />}
                          </div>
                          {i < 4 && (
                            <div className={cn("flex-1 h-0.5", isPast && i < currentIdx ? "bg-accent" : "bg-stone-200")} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-muted mb-4 px-1">
                    <span>Label</span>
                    <span>Picked Up</span>
                    <span>In Transit</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-muted mb-3">
                    <span><span className="font-medium text-foreground">Shipped:</span> {del.shippedDate}</span>
                    <span><span className="font-medium text-foreground">Estimated arrival:</span> <span className="font-semibold text-primary">{del.estimatedArrival}</span></span>
                  </div>

                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-muted uppercase mb-2">Items in this shipment</p>
                    <div className="flex flex-wrap gap-2">
                      {del.items.map((item, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-border text-foreground">
                          {item.name} <span className="text-muted">x{item.qty.toLocaleString()}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next Delivery Cost Forecast */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                AI-Projected Next Orders & Delivery Costs
              </h3>
              <p className="text-xs text-muted mb-4">
                Based on current consumption rates, PAR levels, and scheduled procedures, these orders will need to be placed this week
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { supplier: "Ethicon (J&J)", items: "Vicryl 3-0 + 2-0 Sutures", qty: "300 units", estCost: "$2,980", estShipping: "$45", deliveryEta: "Mar 19-20", reason: "Suture stock critically low (15 units). OR schedule requires ~80 units by Mar 20." },
                  { supplier: "Fisher & Paykel", items: "Ventilator Circuits + Humidifier Chambers", qty: "75 units", estCost: "$1,225", estShipping: "$35", deliveryEta: "Mar 22-23", reason: "Current stock: 0 ventilator circuits. ICU has 4 ventilated patients." },
                  { supplier: "3M Healthcare", items: "N95 Masks + Fit-Test Kits", qty: "3,010 units", estCost: "$6,000", estShipping: "$85", deliveryEta: "Mar 18", reason: "Flu surge incoming — current N95 stock covers 4 days at projected surge rate." },
                ].map((proj) => (
                  <div key={proj.supplier} className="p-4 rounded-xl border border-accent/20 bg-accent/[0.03]">
                    <p className="text-xs font-bold text-foreground mb-1">{proj.supplier}</p>
                    <p className="text-[11px] text-muted">{proj.items}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Est. order cost</span>
                        <span className="font-semibold text-foreground">{proj.estCost}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Est. shipping</span>
                        <span className="text-foreground">{proj.estShipping}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Delivery ETA</span>
                        <span className="font-semibold text-primary">{proj.deliveryEta}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-accent mt-3 leading-relaxed">
                      <span className="font-semibold">Why:</span> {proj.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
