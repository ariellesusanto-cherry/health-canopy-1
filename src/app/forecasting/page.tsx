"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import {
  Brain,
  AlertTriangle,
  Calendar,
  Thermometer,
  Zap,
  Target,
  Layers,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Info,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Activity,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  aiInsights,
  demandForecastData,
  upcomingSurgeries,
  procedureSupplyProfiles,
  monthlySpendForecast,
} from "@/lib/mock-data";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

// Forward-looking insights only (predictions, outbreak intel)
const forecastInsights = aiInsights.filter(
  (i) => i.type === "prediction" || i.type === "outbreak"
);

const severityConfig = {
  high: { bg: "bg-red-50 border-red-100", iconColor: "text-red-500", badge: "bg-red-100 text-red-700", ring: "ring-red-200" },
  medium: { bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-500", badge: "bg-amber-100 text-amber-700", ring: "ring-amber-200" },
  low: { bg: "bg-stone-100 border-stone-200", iconColor: "text-stone-500", badge: "bg-stone-200 text-stone-700", ring: "ring-stone-200" },
  info: { bg: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-500", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-200" },
};

export default function ForecastingPage() {
  const [activeScenario, setActiveScenario] = useState<"baseline" | "flu-surge" | "supply-disruption">("baseline");
  const [expandedDay, setExpandedDay] = useState<string | null>("Mar 20");
  const [expandedInsight, setExpandedInsight] = useState<string | null>("AI-001");

  const daySupplyBreakdown = useMemo(() => {
    if (!expandedDay) return null;
    const day = upcomingSurgeries.find((s) => s.date === expandedDay);
    if (!day) return null;

    const supplyTotals: Record<string, { qty: number; unitCost: number; totalCost: number }> = {};
    let grandTotal = 0;

    for (const [procType, count] of Object.entries(day.types)) {
      const profile = procedureSupplyProfiles[procType];
      if (!profile) continue;
      for (const item of profile) {
        const needed = item.qty * count;
        const cost = needed * item.unitCost;
        if (supplyTotals[item.supply]) {
          supplyTotals[item.supply].qty += needed;
          supplyTotals[item.supply].totalCost += cost;
        } else {
          supplyTotals[item.supply] = { qty: needed, unitCost: item.unitCost, totalCost: cost };
        }
        grandTotal += cost;
      }
    }

    return { items: Object.entries(supplyTotals).sort((a, b) => b[1].totalCost - a[1].totalCost), grandTotal };
  }, [expandedDay]);

  // Weekly totals from surgery schedule
  const weeklySupplyCost = upcomingSurgeries.reduce((total, day) => {
    let dayCost = 0;
    for (const [procType, count] of Object.entries(day.types)) {
      const profile = procedureSupplyProfiles[procType];
      if (profile) {
        for (const item of profile) dayCost += item.qty * item.unitCost * count;
      }
    }
    return total + dayCost;
  }, 0);

  const totalProcedures = upcomingSurgeries.reduce((s, d) => s + d.procedures, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Forecasting & Predictions"
        subtitle="What the hospital will need next week, next month, and how to prepare"
      />

      <div className="p-8 space-y-6">
        {/* Overview cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-accent" /><span className="text-[11px] font-medium text-muted uppercase">Next 5 Operating Days</span></div>
            <p className="text-2xl font-bold text-foreground">{totalProcedures} <span className="text-xs font-normal text-muted">surgeries</span></p>
            <p className="text-xs text-primary font-semibold mt-1">${weeklySupplyCost.toLocaleString()} in supplies needed</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-[11px] font-medium text-muted uppercase">Predicted Daily Consumption</span></div>
            <p className="text-2xl font-bold text-foreground">3,050 <span className="text-xs font-normal text-muted">items/day by Mar 29</span></p>
            <p className="text-xs text-amber-600 font-medium mt-1">+10% vs. current average</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2"><Thermometer className="w-4 h-4 text-red-500" /><span className="text-[11px] font-medium text-muted uppercase">Outbreak Risk</span></div>
            <p className="text-2xl font-bold text-red-600">HIGH</p>
            <p className="text-xs text-red-600 font-medium mt-1">Flu surge — 40-60% ED increase predicted</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-accent" /><span className="text-[11px] font-medium text-muted uppercase">April Spend Forecast</span></div>
            <p className="text-2xl font-bold text-foreground">$942K</p>
            <p className="text-xs text-red-600 font-medium mt-1">$32K over budget — flu surge + OR volume</p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: Demand Forecast — Next 14 Days                    */}
        {/* ============================================================ */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">
              Predicted Consumption — Next 14 Days
            </h3>
            <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">
              How many supply items the hospital is expected to consume each day over the next two weeks.
              The forecast combines: historical usage patterns, scheduled surgeries, patient census projections,
              and the incoming flu surge from CDC surveillance data.
            </p>
          </div>

          <div className="flex items-center gap-6 mb-4 text-[11px]">
            <div className="flex items-center gap-2"><div className="w-8 h-0.5 rounded bg-primary" /><span className="text-foreground font-medium">Actual (past)</span></div>
            <div className="flex items-center gap-2"><div className="w-8 h-0.5 rounded bg-accent" style={{ borderTop: "2px dashed #6b8f71", height: 0 }} /><span className="text-foreground font-medium">AI forecast (future)</span></div>
            <div className="flex items-center gap-2"><div className="w-8 h-3 rounded bg-accent/10" /><span className="text-foreground font-medium">90% confidence range</span></div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} label={{ value: "Items / day", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#b8a898" }, offset: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }} formatter={(value, name) => {
                  const labels: Record<string, string> = { actual: "Actual", predicted: "Forecast", upper: "Upper bound", lower: "Lower bound" };
                  return [value ? `${Number(value).toLocaleString()} items` : "—", labels[name as string] || name];
                }} />
                <ReferenceLine x="Mar 15" stroke="#c44840" strokeDasharray="4 4" label={{ value: "Today", position: "top", fontSize: 10, fill: "#c44840" }} />
                <Area type="monotone" dataKey="upper" stackId="band" stroke="none" fill="#6b8f71" fillOpacity={0.08} />
                <Area type="monotone" dataKey="lower" stackId="band" stroke="none" fill="#ffffff" fillOpacity={1} />
                <Line type="monotone" dataKey="predicted" stroke="#6b8f71" strokeWidth={2} strokeDasharray="6 3" dot={false} name="predicted" />
                <Line type="monotone" dataKey="actual" stroke="#b5654a" strokeWidth={2.5} dot={{ r: 3, fill: "#b5654a" }} connectNulls={false} name="actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">Why is demand rising?</span> (1) OR schedule shows 55% above-normal surgical volume Mar 23–27. (2) CDC flu surveillance predicts a respiratory surge increasing ED PPE/medication consumption.
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: Spend Forecast                                     */}
        {/* ============================================================ */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">Monthly Spend Forecast</h3>
            <p className="text-xs text-muted mt-1">
              What the hospital is projected to spend on supplies each month. After March, the AI forecasts future spend
              based on scheduled procedures, seasonal patterns, and the flu surge.
            </p>
          </div>
          <div className="flex items-center gap-6 mb-4 text-[11px]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary" /><span className="text-foreground font-medium">Actual spend</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-accent" /><span className="text-foreground font-medium">AI forecasted</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2 border-dashed border-stone-400" /><span className="text-foreground font-medium">Budget</span></div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlySpendForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }} formatter={(value) => value ? [`$${(Number(value) / 1000).toFixed(0)}K`, ""] : ["—", ""]} />
                <Bar dataKey="actual" fill="#b5654a" radius={[4, 4, 0, 0]} barSize={24} name="Actual" />
                <Bar dataKey="forecast" fill="#6b8f71" radius={[4, 4, 0, 0]} barSize={24} name="AI Forecast" />
                <Line type="monotone" dataKey="budget" stroke="#b8a898" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Budget" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: Surgery → Supply Needs                             */}
        {/* ============================================================ */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Scheduled Surgeries → Supplies Needed This Week
            </h3>
            <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">
              Each surgery type requires specific supplies. The AI maps the OR schedule to supply consumption profiles
              and calculates exactly what must be on hand for each operating day. Click a day to see the breakdown.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-4">
            {upcomingSurgeries.map((day) => {
              const isExpanded = expandedDay === day.date;
              let dayCost = 0;
              for (const [procType, count] of Object.entries(day.types)) {
                const profile = procedureSupplyProfiles[procType];
                if (profile) { for (const item of profile) dayCost += item.qty * item.unitCost * count; }
              }

              return (
                <button key={day.date} onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                  className={cn("p-4 rounded-xl border text-left transition-all", isExpanded ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30 hover:bg-stone-50")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{day.date}</span>
                    <span className="text-[11px] text-muted">{day.day}</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{day.procedures} <span className="text-xs font-normal text-muted">surgeries</span></p>
                  <p className="text-xs font-semibold text-primary mt-1">${dayCost.toLocaleString()} <span className="text-[11px] font-normal text-muted">in supplies</span></p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(day.types).map(([type, count]) => (
                      <span key={type} className="text-[11px] px-1.5 py-0.5 rounded bg-stone-100 text-muted">{count}x {type}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {expandedDay && daySupplyBreakdown && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Supply Requirements for {expandedDay}</h4>
                  <p className="text-xs text-muted mt-0.5">Items that must be stocked in the OR before the day&apos;s surgeries begin</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">${daySupplyBreakdown.grandTotal.toLocaleString()}</p>
                  <p className="text-[11px] text-muted">Total supply cost</p>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold text-muted uppercase px-3 py-2">Supply Item</th>
                    <th className="text-right text-[11px] font-semibold text-muted uppercase px-3 py-2">Qty Needed</th>
                    <th className="text-right text-[11px] font-semibold text-muted uppercase px-3 py-2">Unit Cost</th>
                    <th className="text-right text-[11px] font-semibold text-muted uppercase px-3 py-2">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {daySupplyBreakdown.items.map(([name, data]) => (
                    <tr key={name} className="border-b border-border/50">
                      <td className="px-3 py-2 text-sm text-foreground">{name}</td>
                      <td className="px-3 py-2 text-sm text-foreground text-right">{data.qty}</td>
                      <td className="px-3 py-2 text-sm text-muted text-right">${data.unitCost.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm font-semibold text-foreground text-right">${data.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 space-y-2">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-800">
                    <span className="font-semibold">Shortfall: Vicryl 3-0 Suture</span> — Need {daySupplyBreakdown.items.find(([n]) => n.includes("Vicryl"))?.[1].qty || 0} units, only 15 in stock. PO-4522 pending approval.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* SECTION 4: What-If Scenarios                                  */}
        {/* ============================================================ */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              What Happens to Our Inventory If...
            </h3>
            <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">
              Select a scenario to see how it impacts supply consumption, stockout risk, and cost over the next 2–4 weeks.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {([
              { id: "baseline" as const, title: "Normal Operations", desc: "Current consumption continues. No disruptions.", icon: CheckCircle2, iconColor: "text-emerald-500" },
              { id: "flu-surge" as const, title: "Flu Surge Hits Contra Costa County", desc: "What if ED respiratory visits increase 40% over the next 10 days?", icon: Thermometer, iconColor: "text-red-500" },
              { id: "supply-disruption" as const, title: "Primary Supplier Delayed 5 Days", desc: "What if Medline and Cardinal Health shipments are delayed 5 days?", icon: AlertOctagon, iconColor: "text-amber-500" },
            ]).map((s) => (
              <button key={s.id} onClick={() => setActiveScenario(s.id)}
                className={cn("p-5 rounded-xl border text-left transition-all", activeScenario === s.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30 hover:bg-stone-50")}>
                <s.icon className={cn("w-6 h-6 mb-3", activeScenario === s.id ? "text-primary" : s.iconColor)} />
                <h4 className="text-sm font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          {activeScenario === "baseline" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
              <h4 className="text-sm font-semibold text-emerald-800 mb-4">Normal Operations — No Action Needed</h4>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "PPE Burn Rate", value: "5,000", sub: "/week", note: "Stock covers 6.4 days" },
                  { label: "Medication Usage", value: "3,200", sub: "/week", note: "2 items below reorder" },
                  { label: "Stockout Risk", value: "3", sub: "items", note: "Heparin, Vicryl 3-0, Vent Circuits" },
                  { label: "Extra Cost", value: "$0", sub: "", note: "On track — $59K under budget YTD" },
                ].map((c) => (
                  <div key={c.label} className="p-4 rounded-lg bg-white border border-emerald-100">
                    <p className="text-[11px] text-muted uppercase font-semibold mb-1">{c.label}</p>
                    <p className="text-xl font-bold text-foreground">{c.value} <span className="text-xs font-normal text-muted">{c.sub}</span></p>
                    <p className="text-xs text-emerald-600 mt-1">{c.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeScenario === "flu-surge" && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
              <h4 className="text-sm font-semibold text-red-800 mb-2">If flu surges 40% in ED → here&apos;s what changes</h4>
              <p className="text-xs text-red-700 mb-4">Based on CDC ILINet data, the AI projects a 40-60% increase in ED respiratory visits within 7-10 days.</p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "PPE Burn Rate", value: "7,800", extra: "+56%", note: "Stock drops to 4.1 days", color: "text-red-500" },
                  { label: "Medication Usage", value: "4,100", extra: "+28%", note: "Tamiflu stockout in ~5 days", color: "text-red-500" },
                  { label: "Stockout Risk", value: "11", extra: "", note: "N95s, Tamiflu, flu tests, IV fluids...", color: "text-red-600" },
                  { label: "Extra Weekly Spend", value: "+$67,200", extra: "", note: "Pre-ordering saves $45K", color: "text-red-600" },
                ].map((c) => (
                  <div key={c.label} className="p-4 rounded-lg bg-white border border-red-100">
                    <p className="text-[11px] text-muted uppercase font-semibold mb-1">{c.label}</p>
                    <p className="text-xl font-bold text-foreground">{c.value} {c.extra && <span className={cn("text-xs font-semibold", c.color)}>{c.extra}</span>}</p>
                    <p className="text-xs text-red-600 mt-1">{c.note}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-lg bg-white border border-primary/20">
                <h5 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> AI-Recommended Pre-Orders</h5>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded bg-stone-50"><p className="font-semibold">N95 Respirator Masks</p><p className="text-muted">3,000 units from 3M — $5,550</p></div>
                  <div className="p-2 rounded bg-stone-50"><p className="font-semibold">Tamiflu (Oseltamivir)</p><p className="text-muted">200 units from McKesson — $2,400</p></div>
                  <div className="p-2 rounded bg-stone-50"><p className="font-semibold">Rapid Flu Test Kits</p><p className="text-muted">1,500 units from Abbott — $5,250</p></div>
                </div>
              </div>
            </div>
          )}

          {activeScenario === "supply-disruption" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">If Medline + Cardinal Health delayed 5 days → here&apos;s what changes</h4>
              <p className="text-xs text-amber-700 mb-4">These two suppliers = 42% of supply volume. A 5-day delay pushes multiple items past safety stock.</p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "PPE Burn Rate", value: "5,000", note: "Unchanged, but reorder point → 3,800" },
                  { label: "Below Safety Stock", value: "8", note: "Gloves, gowns, drapes hit zero by day 4" },
                  { label: "OR Cases at Risk", value: "12", note: "Surgical drape kits depleted by Mar 20" },
                  { label: "Expedited Cost", value: "+$34,800", note: "Backup vendors + next-day shipping" },
                ].map((c) => (
                  <div key={c.label} className="p-4 rounded-lg bg-white border border-amber-100">
                    <p className="text-[11px] text-muted uppercase font-semibold mb-1">{c.label}</p>
                    <p className="text-xl font-bold text-amber-600">{c.value}</p>
                    <p className="text-xs text-amber-600 mt-1">{c.note}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-lg bg-white border border-primary/20">
                <h5 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> AI-Recommended Mitigation</h5>
                <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside">
                  <li>Switch gloves to <span className="font-semibold">McKesson backup contract</span> — 2-day lead, +$0.02/unit</li>
                  <li>Redirect drape POs to <span className="font-semibold">Halyard Health</span> — covers OR through Mar 25</li>
                  <li>Transfer 100 gowns from <span className="font-semibold">Richmond Health Center</span> (surplus)</li>
                  <li>Increase PAR levels 20% on Medline/Cardinal items temporarily</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* SECTION 5: Prediction Alerts                                  */}
        {/* ============================================================ */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Prediction Alerts
          </h3>
          <p className="text-xs text-muted mb-4">
            Forward-looking alerts: outbreak intelligence, demand predictions, and proactive recommendations.
          </p>
          <div className="space-y-4">
            {forecastInsights.map((insight) => {
              const config = severityConfig[insight.severity];
              const isExpanded = expandedInsight === insight.id;
              const TypeIcon = insight.type === "outbreak" ? Thermometer : TrendingUp;

              return (
                <div key={insight.id} className={cn("rounded-xl border overflow-hidden transition-all", config.bg, isExpanded && "ring-1", isExpanded && config.ring)}>
                  <button onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/30 transition-colors">
                    <div className={cn("p-2 rounded-lg shrink-0", insight.severity === "high" ? "bg-red-100" : insight.severity === "medium" ? "bg-amber-100" : "bg-stone-200")}>
                      <TypeIcon className={cn("w-5 h-5", config.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded", config.badge)}>
                          {insight.type === "outbreak" ? "Outbreak Intel" : "Prediction"}
                        </span>
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
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h5 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Recommended Action</h5>
                            <p className="text-xs text-foreground leading-relaxed">{insight.suggestedAction}</p>
                          </div>
                        )}
                        {insight.impact && (
                          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                            <h5 className="text-xs font-semibold text-emerald-700 mb-1">Projected Impact</h5>
                            <p className="text-xs text-emerald-600">{insight.impact}</p>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Take Action</button>
                          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-muted border border-border rounded-lg hover:bg-stone-50 transition-colors"><Clock className="w-3.5 h-3.5" /> Snooze</button>
                        </div>
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
