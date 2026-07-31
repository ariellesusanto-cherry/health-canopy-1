"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { useToast } from "@/components/ui/toast";
import {
  Brain,
  AlertCircle,
  AlertTriangle,
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  Info,
  ChevronRight,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  aiInsights,
  demandForecastData,
  departmentConsumption,
  inventoryItems,
  inventoryValuation,
} from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";

const severityConfig = {
  high: { bg: "bg-red-50 border-red-200", icon: AlertCircle, iconColor: "text-red-600", badge: "bg-red-100 text-red-700", ring: "ring-red-200" },
  medium: { bg: "bg-amber-50 border-amber-200", icon: AlertTriangle, iconColor: "text-amber-600", badge: "bg-amber-100 text-amber-700", ring: "ring-amber-200" },
  low: { bg: "bg-stone-50 border-stone-200", icon: Activity, iconColor: "text-stone-500", badge: "bg-stone-200 text-stone-600", ring: "ring-stone-200" },
  info: { bg: "bg-accent/5 border-accent/20", icon: Sparkles, iconColor: "text-accent", badge: "bg-accent/10 text-accent", ring: "ring-accent/20" },
};

const typeLabels: Record<string, string> = {
  prediction: "Prediction", anomaly: "Anomaly Detection", recommendation: "Recommendation",
  outbreak: "Outbreak Intelligence", "cost-saving": "Cost Optimization",
};

const typeIcons: Record<string, typeof Brain> = {
  prediction: TrendingUp, anomaly: Zap, recommendation: Target, outbreak: Activity, "cost-saving": Sparkles,
};

// All AI alerts — outbreak intel, predictions, anomalies, recommendations, cost-saving
const currentStateInsights = aiInsights;

// Summary stats computed from inventory
const totalItems = inventoryItems.length;
const lowStockItems = inventoryItems.filter((i) => i.status === "low-stock");
const criticalItems = inventoryItems.filter((i) => i.status === "critical" || i.status === "out-of-stock");
const expiringItems = inventoryItems.filter((i) => i.status === "expiring-soon");
const totalValue = inventoryItems.reduce((s, i) => s + i.currentStock * i.unitCost, 0);

// Top consumers and slow movers
const topConsumers = [...departmentConsumption].sort((a, b) => b.current - a.current);
const deptWithBiggestIncrease = [...departmentConsumption].sort((a, b) => b.change - a.change);

export default function AIInsightsPage() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>("AI-002");
  const [actionedInsights, setActionedInsights] = useState<Set<string>>(new Set());
  const [snoozedInsights, setSnoozedInsights] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  return (
    <div className="min-h-screen">
      <Header
        title="Inventory & Usage Analysis"
        subtitle="Current inventory health, consumption patterns, anomaly detection, and cost optimization"
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "In Stock", value: inventoryItems.filter((i) => i.status === "in-stock").length, color: "bg-accent/10 text-accent", icon: CheckCircle2 },
            { label: "Low Stock", value: lowStockItems.length, color: "bg-amber-50 text-amber-600", icon: AlertTriangle },
            { label: "Critical / OOS", value: criticalItems.length, color: "bg-red-50 text-red-600", icon: AlertCircle },
            { label: "Expiring Soon", value: expiringItems.length, color: "bg-amber-50 text-amber-600", icon: Clock },
            { label: "On-Hand Value", value: `$${(totalValue / 1000).toFixed(0)}K`, color: "bg-primary/10 text-primary", icon: BarChart3 },
            { label: "AI Alerts", value: currentStateInsights.length, color: "bg-accent/10 text-accent", icon: Zap },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", s.color)}><s.icon className="w-4 h-4" /></div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] font-medium text-muted uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: Actual Consumption — What Are We Using?            */}
        {/* ============================================================ */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">
              Daily Supply Consumption — Actual vs. AI Predicted
            </h3>
            <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">
              Total supply items consumed hospital-wide per day. The solid blue line is what was actually used.
              The dashed green line is what the AI predicted. Comparing these shows how accurate our forecasting is
              and where consumption is deviating from expectations.
            </p>
          </div>

          <div className="flex items-center gap-6 mb-4 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 rounded bg-primary" />
              <span className="text-foreground font-medium">Actual consumption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 rounded bg-accent border-dashed" style={{ borderTop: "2px dashed #4a7a52", height: 0 }} />
              <span className="text-foreground font-medium">AI predicted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded bg-accent/10" />
              <span className="text-foreground font-medium">90% confidence range</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b6057" }}
                  axisLine={{ stroke: "#e6ddd0" }}
                  label={{ value: "Items consumed / day", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#b8a898" }, offset: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = { actual: "Actual", predicted: "AI predicted", upper: "Upper bound", lower: "Lower bound" };
                    return [value ? `${Number(value).toLocaleString()} items` : "—", labels[name as string] || name];
                  }}
                />
                <ReferenceLine x="Mar 15" stroke="#c44840" strokeDasharray="4 4" label={{ value: "Today", position: "top", fontSize: 10, fill: "#c44840" }} />
                <Area type="monotone" dataKey="upper" stackId="band" stroke="none" fill="#4a7a52" fillOpacity={0.08} />
                <Area type="monotone" dataKey="lower" stackId="band" stroke="none" fill="#ffffff" fillOpacity={1} />
                <Line type="monotone" dataKey="predicted" stroke="#4a7a52" strokeWidth={2} strokeDasharray="6 3" dot={false} name="predicted" />
                <Line type="monotone" dataKey="actual" stroke="#b5654a" strokeWidth={2.5} dot={{ r: 3, fill: "#b5654a" }} connectNulls={false} name="actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: Department Usage Breakdown                         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-border p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-foreground">Usage by Department</h3>
              <p className="text-xs text-muted mt-1">
                How many items each department consumes per day. Red predicted bars mean the AI expects a &gt;10% increase — usually driven by scheduling or seasonal factors.
              </p>
            </div>
            <div className="flex items-center gap-4 mb-3 text-[11px]">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /><span className="text-muted">Current daily usage</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-accent" /><span className="text-muted">AI predicted (next 7 days)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500" /><span className="text-muted">&gt;10% increase expected</span></div>
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

          {/* Inventory value by department */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-border p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-foreground">Inventory Value on Shelves</h3>
              <p className="text-xs text-muted mt-1">Dollar value of stock currently held by each department, with average days of supply on hand.</p>
            </div>
            <div className="space-y-3">
              {inventoryValuation.map((v) => {
                const maxVal = Math.max(...inventoryValuation.map((iv) => iv.totalValue));
                const pct = (v.totalValue / maxVal) * 100;
                return (
                  <div key={v.department} className="flex items-center gap-3">
                    <span className="text-xs text-foreground w-32 shrink-0 truncate">{v.department}</span>
                    <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-14 text-right">${(v.totalValue / 1000).toFixed(0)}K</span>
                    <span className={cn(
                      "text-[11px] w-12 text-right",
                      v.avgDaysOnHand < 7 ? "text-red-600 font-semibold" : v.avgDaysOnHand > 15 ? "text-amber-600" : "text-muted"
                    )}>
                      {v.avgDaysOnHand}d
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs">
              <span className="text-muted">Total on-hand value</span>
              <span className="font-bold text-foreground">${(inventoryValuation.reduce((s, v) => s + v.totalValue, 0) / 1_000_000).toFixed(2)}M</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: Items needing attention                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical / OOS */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-red-700 mb-3">Critical & Out of Stock ({criticalItems.length})</h3>
            <div className="space-y-2.5">
              {criticalItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{item.department} — {item.supplier}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] font-bold text-red-600">{item.currentStock} / {item.parLevel}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                      {item.status === "out-of-stock" ? "OUT OF STOCK" : "CRITICAL"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-amber-700 mb-3">Low Stock ({lowStockItems.length})</h3>
            <div className="space-y-2.5">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{item.department} — {item.supplier}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] font-bold text-amber-600">{item.currentStock} / {item.parLevel}</span>
                    <span className="text-[11px] text-muted">Reorder at {item.reorderPoint}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-amber-700 mb-3">Expiring Soon ({expiringItems.length})</h3>
            <div className="space-y-2.5">
              {expiringItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{item.department} — {item.currentStock} units</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] font-bold text-amber-600">Expires: {item.expirationDate}</span>
                    <span className="text-[11px] text-muted">${(item.currentStock * item.unitCost).toLocaleString()} at risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 4: AI Alerts — Anomalies & Recommendations           */}
        {/* ============================================================ */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            AI Alerts — Outbreak Intel, Predictions & Recommendations
          </h3>
          <p className="text-xs text-muted mb-4">
            Outbreak intelligence, demand predictions, anomaly detection, cost-saving opportunities, and compliance gaps detected by the AI.
          </p>
          <div className="space-y-4">
            {currentStateInsights.map((insight) => {
              const config = severityConfig[insight.severity];
              const TypeIcon = typeIcons[insight.type] || Brain;
              const isExpanded = expandedInsight === insight.id;

              return (
                <div key={insight.id} className={cn("rounded-xl border overflow-hidden transition-all", config.bg, isExpanded && "ring-1", isExpanded && config.ring)}>
                  <button
                    onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/30 transition-colors"
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", insight.severity === "high" ? "bg-red-100" : insight.severity === "medium" ? "bg-amber-100" : insight.severity === "info" ? "bg-accent/10" : "bg-stone-100")}>
                      <TypeIcon className={cn("w-5 h-5", config.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded", config.badge)}>{typeLabels[insight.type]}</span>
                        <span className="text-[11px] text-muted">{new Date(insight.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{insight.description}</p>
                    </div>
                    <ChevronRight className={cn("w-5 h-5 text-muted shrink-0 transition-transform", isExpanded && "rotate-90")} />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/50">
                      <div className="mt-4 space-y-3">
                        <div className="p-4 rounded-lg bg-white border border-border">
                          <h5 className="text-xs font-semibold text-foreground mb-2">Full Analysis</h5>
                          <p className="text-xs text-muted leading-relaxed">{insight.description}</p>
                        </div>
                        {insight.suggestedAction && (
                          <div className="p-4 rounded-lg bg-white border border-border">
                            <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Recommended Action</h5>
                            <p className="text-xs text-muted leading-relaxed">{insight.suggestedAction}</p>
                          </div>
                        )}
                        {insight.impact && (
                          <div className="p-4 rounded-lg bg-white border border-border">
                            <h5 className="text-xs font-semibold text-foreground mb-1">Projected Impact</h5>
                            <p className="text-xs text-muted">{insight.impact}</p>
                          </div>
                        )}
                        {actionedInsights.has(insight.id) ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/5 border border-accent/20">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium text-accent">Action taken — assigned to relevant department</span>
                          </div>
                        ) : snoozedInsights.has(insight.id) ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200">
                            <Clock className="w-4 h-4 text-muted" />
                            <span className="text-xs font-medium text-muted">Snoozed for 24 hours</span>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setActionedInsights((prev) => new Set(prev).add(insight.id));
                                showToast(`Action initiated: ${insight.title}`);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Take Action
                            </button>
                            <button
                              onClick={() => {
                                setSnoozedInsights((prev) => new Set(prev).add(insight.id));
                                showToast(`Snoozed: ${insight.title} — will resurface in 24h`, "info");
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-muted border border-border rounded-lg hover:bg-stone-50 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5" /> Snooze
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
