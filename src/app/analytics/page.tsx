"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  RotateCcw,
  Clock,
  Target,
  ArrowUpDown,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip as InfoTooltip } from "@/components/ui/tooltip";
import {
  monthlyCostTrend,
  supplierPerformance,
  inventoryTurnover,
  departmentConsumption,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const wasteData = [
  { category: "Expired Medications", value: 34200, pct: 38 },
  { category: "Damaged Supplies", value: 12800, pct: 14 },
  { category: "Overstocked Items", value: 28500, pct: 32 },
  { category: "Recalled Products", value: 8900, pct: 10 },
  { category: "Other", value: 5600, pct: 6 },
];

const kpiCards = [
  { label: "Total Monthly Spend", value: "$856K", change: "-6.5%", trend: "down" as const, detail: "vs. $915K budget", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Inventory Turnover", value: "12.8x", change: "+0.6", trend: "up" as const, detail: "Annual average", icon: RotateCcw, color: "bg-orange-50 text-orange-700", tooltip: "How many times inventory cycles through per year — higher means more efficient use of capital" },
  { label: "Avg Lead Time", value: "3.2 days", change: "-0.4", trend: "up" as const, detail: "Across all vendors", icon: Clock, color: "bg-rose-50 text-rose-600" },
  { label: "Fill Rate", value: "96.8%", change: "+1.2%", trend: "up" as const, detail: "Last 30 days", icon: Target, color: "bg-amber-50 text-amber-600", tooltip: "Percentage of orders delivered complete on first shipment" },
  { label: "Waste & Expiration", value: "$90K", change: "-12%", trend: "up" as const, detail: "YTD savings vs. prior", icon: TrendingDown, color: "bg-red-50 text-red-600" },
  { label: "Active Vendors", value: "24", change: "3 underperforming", trend: "neutral" as const, detail: "", icon: Truck, color: "bg-stone-50 text-stone-600" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "12m">("12m");

  return (
    <div className="min-h-screen">
      <Header
        title="Supply Chain Analytics"
        subtitle="Cost optimization, vendor performance, and operational efficiency metrics"
      />

      <div className="p-8 space-y-6">
        {/* Time Range + Export */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(["30d", "90d", "12m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  timeRange === range
                    ? "bg-primary text-white"
                    : "bg-white text-muted border border-border hover:bg-stone-50"
                )}
              >
                {range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "12 Months"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-4">
          {kpiCards.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", kpi.color)}>
                  <kpi.icon className="w-4 h-4" />
                </div>
                {kpi.trend !== "neutral" && (
                  <div className={cn(
                    "flex items-center gap-0.5 text-[11px] font-semibold",
                    kpi.trend === "up" ? "text-emerald-600" : "text-red-600"
                  )}>
                    {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                )}
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted mt-0.5">
                {"tooltip" in kpi && kpi.tooltip ? (
                  <InfoTooltip content={kpi.tooltip as string} position="bottom" wide>
                    <span className="cursor-help border-b border-dotted border-muted/60">{kpi.label}</span>
                  </InfoTooltip>
                ) : kpi.label}
              </p>
              {kpi.detail && <p className="text-[11px] text-muted mt-0.5">{kpi.detail}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Cost Trend */}
          <div className="col-span-7 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Monthly Spend vs. Budget</h3>
                <p className="text-xs text-muted mt-0.5">Tracking actual spend against allocated budget</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 rounded bg-stone-300" />
                  <span className="text-muted">Budget</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCostTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b6057" }}
                    axisLine={{ stroke: "#e6ddd0" }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }}
                    formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, ""]}
                  />
                  <Bar dataKey="actual" radius={[4, 4, 0, 0]} barSize={32} name="Actual">
                    {monthlyCostTrend.map((entry, i) => (
                      <Cell key={i} fill={entry.actual > entry.budget ? "#c44840" : "#b5654a"} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="budget" stroke="#b8a898" strokeWidth={2} strokeDasharray="6 3" dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Breakdown */}
          <div className="col-span-5 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Waste & Loss Breakdown</h3>
                <p className="text-xs text-muted mt-0.5">YTD total: $90,000 — down 12% from prior year</p>
              </div>
            </div>
            <div className="space-y-3">
              {wasteData.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-xs text-foreground w-36 shrink-0">{item.category}</span>
                  <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-16 text-right">
                    ${(item.value / 1000).toFixed(1)}K
                  </span>
                  <span className="text-[11px] text-muted w-8 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-700">
                <span className="font-semibold">AI Recommendation:</span>{" "}
                <InfoTooltip content="First Expired, First Out — prioritize items closest to expiry">
                  <span className="cursor-help border-b border-dotted border-emerald-400">FEFO</span>
                </InfoTooltip>{" "}
                enforcement on 12 medication SKUs could reduce expiration waste by $18,200/year.
              </p>
            </div>
          </div>
        </div>

        {/* Supplier Performance + Turnover */}
        <div className="grid grid-cols-12 gap-6">
          {/* Supplier Performance Table */}
          <div className="col-span-7 bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Vendor Performance Scorecard</h3>
              <p className="text-xs text-muted mt-0.5">Tracking on-time delivery, fill rate, and lead times across key suppliers</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-stone-50">
                  {[
                    { label: "Vendor" },
                    { label: "On-Time %", tooltip: "Percentage of orders delivered by the promised date" },
                    { label: "Fill Rate %", tooltip: "Percentage of ordered items delivered complete on first shipment" },
                    { label: "Avg Lead (days)" },
                    { label: "Orders" },
                    { label: "Spend" },
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
                {supplierPerformance.map((s) => (
                  <tr key={s.name} className="border-b border-border/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-semibold",
                        s.onTimeRate >= 95 ? "text-emerald-600" : s.onTimeRate >= 90 ? "text-amber-600" : "text-red-600"
                      )}>
                        {s.onTimeRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-semibold",
                        s.fillRate >= 97 ? "text-emerald-600" : s.fillRate >= 95 ? "text-amber-600" : "text-red-600"
                      )}>
                        {s.fillRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs",
                        s.avgLeadDays > 4 ? "text-amber-600 font-medium" : "text-foreground"
                      )}>
                        {s.avgLeadDays}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{s.orders}</td>
                    <td className="px-4 py-3 text-xs font-medium text-foreground">${(s.spend / 1000).toFixed(0)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Department Turnover */}
          <div className="col-span-5 bg-white rounded-xl border border-border p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">Inventory Turnover by Department</h3>
              <p className="text-xs text-muted mt-0.5">Actual vs. industry benchmark — higher is more efficient</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={inventoryTurnover}>
                  <PolarGrid stroke="#e6ddd0" />
                  <PolarAngleAxis dataKey="department" tick={{ fontSize: 10, fill: "#6b6057" }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: "#b8a898" }} />
                  <Radar name="Actual" dataKey="turnover" stroke="#b5654a" fill="#b5654a" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="#b8a898" fill="none" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e6ddd0" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-xs text-orange-700">
                <span className="font-semibold">Insight:</span> OR turnover (8.7x) is 13% below benchmark. Review PAR levels and preference card accuracy to reduce excess.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
