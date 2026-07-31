"use client";

import { Header } from "@/components/layout/header";
import {
  Package,
  MapPin,
  AlertTriangle,
  CircleDollarSign,
  ShieldCheck,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { useTenant } from "@/lib/tenant-context";
import { complianceChapters, overallReadinessScore, monthlyCostTrend } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

function ReadinessGauge({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "#4a7a52" : score >= 80 ? "#d4943e" : "#c44840";
  return (
    <div className="relative w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e6ddd0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="score-gauge"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-[11px] text-muted uppercase tracking-wide">Readiness</span>
      </div>
    </div>
  );
}

const trendIcon = {
  improving: <TrendingUp className="w-3.5 h-3.5 text-accent" />,
  stable: <Minus className="w-3.5 h-3.5 text-muted" />,
  declining: <TrendingDown className="w-3.5 h-3.5 text-red-500" />,
};

export default function ExecutivePage() {
  const { tenant } = useTenant();

  const criticalItems = tenant.itemsNeedingAttention.filter(
    (i) => i.status === "critical" || i.status === "out-of-stock"
  );

  const kpis = [
    { label: "Total SKUs Tracked", value: tenant.metrics.totalSKUs, sub: tenant.metrics.skuChange, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "PAR Locations", value: tenant.metrics.parLocationCount, sub: tenant.metrics.parLocationContext, icon: MapPin, color: "bg-primary/10 text-primary" },
    { label: "Active Alerts", value: String(tenant.itemsNeedingAttention.length), sub: `${criticalItems.length} critical`, icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
    { label: "Monthly Spend", value: tenant.metrics.monthlySpend, sub: tenant.metrics.spendChange, icon: CircleDollarSign, color: "bg-accent/10 text-accent" },
  ];

  const expiringCount = tenant.itemsNeedingAttention.filter((i) => i.status === "expiring-soon").length;

  // Spend/savings trend, scaled to this facility's financial footprint.
  const spendTrend = monthlyCostTrend.map((m) => ({
    month: m.month,
    actual: Math.round((m.actual * tenant.financialScale) / 1000),
    budget: Math.round((m.budget * tenant.financialScale) / 1000),
  }));

  return (
    <div className="min-h-screen">
      <Header
        title="Executive Overview"
        subtitle={`${tenant.system} — cross-site state of the system`}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Read-only banner */}
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <Lock className="w-3.5 h-3.5" />
          Read-only executive summary · {tenant.campusCount} {tenant.campusLabel} · synthetic data
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className="bg-white rounded-xl border border-border p-5 card-enter"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wide">{k.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <CountUp value={k.value} />
                  </p>
                  <p className="text-xs text-muted mt-1.5">{k.sub}</p>
                </div>
                <div className={cn("p-2.5 rounded-lg", k.color)}>
                  <k.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Compliance readiness */}
          <div data-tour="exec-readiness" className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Compliance Readiness
            </h3>
            <div className="flex flex-col items-center">
              <ReadinessGauge score={overallReadinessScore} />
              <p className="text-[11px] text-muted mt-3 text-center">
                Joint Commission continuous readiness across 7 chapters
              </p>
            </div>
          </div>

          {/* Chapter breakdown */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Department / Chapter Compliance</h3>
            <div className="space-y-2.5">
              {complianceChapters.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-muted w-12 shrink-0">{c.code}</span>
                  <span className="text-xs text-foreground w-52 shrink-0 truncate">{c.name}</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        c.score >= 90 ? "bg-accent" : c.score >= 80 ? "bg-amber-400" : "bg-red-500"
                      )}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-9 text-right">{c.score}</span>
                  <span className="w-4 flex justify-center">{trendIcon[c.trend]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Campus-level status */}
          <div data-tour="exec-sites" className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Site-Level Status
              <span className="ml-auto text-[11px] font-normal text-muted">
                3 live · 7 onboarding across Contra Costa County
              </span>
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 text-muted">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Site</th>
                    <th className="text-right font-medium px-3 py-2">Items</th>
                    <th className="text-right font-medium px-3 py-2">PAR Locs</th>
                    <th className="text-right font-medium px-3 py-2">Critical</th>
                    <th className="text-right font-medium px-3 py-2">Expiring</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.sitesInventory.map((s) => (
                    <tr key={s.siteId} className="border-t border-border">
                      <td className="px-3 py-2.5 text-foreground font-medium">{s.siteName}</td>
                      <td className="px-3 py-2.5 text-right text-muted tabular-nums">{s.totalItems.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-muted tabular-nums">{s.parLocations}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={cn("font-bold tabular-nums", s.criticalAlerts > 0 ? "text-red-600" : "text-muted")}>
                          {s.criticalAlerts}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-amber-600 tabular-nums">{s.expiringSoon}</td>
                    </tr>
                  ))}
                  {tenant.sites
                    .filter((s) => s.status === "onboarding")
                    .map((s) => (
                      <tr key={s.id} className="border-t border-border/60 opacity-60">
                        <td className="px-3 py-2 text-muted">
                          {s.name}
                          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                            Onboarding
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-muted">—</td>
                        <td className="px-3 py-2 text-right text-muted">—</td>
                        <td className="px-3 py-2 text-right text-muted">—</td>
                        <td className="px-3 py-2 text-right text-muted">—</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical alerts summary */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Critical Alerts Summary
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
                <p className="text-[11px] text-red-700">Critical / Out</p>
              </div>
              <div className="flex-1 rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
                <p className="text-[11px] text-amber-700">Expiring Soon</p>
              </div>
            </div>
            <div className="space-y-2">
              {criticalItems.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-xs border-b border-border/60 last:border-0 pb-2 last:pb-0">
                  <span className="text-foreground truncate pr-2">{i.name}</span>
                  <span className="text-muted shrink-0">{i.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spend / savings trend */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Spend vs. Budget Trend</h3>
              <p className="text-xs text-muted mt-0.5">Monthly supply spend against budget ($K), last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /><span className="text-muted">Actual</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-accent" /><span className="text-muted">Budget</span></div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b5654a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#b5654a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b6057" }} axisLine={{ stroke: "#e6ddd0" }} />
                <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e6ddd0" }} formatter={(v) => `$${v}K`} />
                <Area type="monotone" dataKey="actual" stroke="#b5654a" strokeWidth={2} fill="url(#actualFill)" />
                <Area type="monotone" dataKey="budget" stroke="#4a7a52" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Read-only AI signal (context only) */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">{tenant.surgeInsight.title}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{tenant.surgeInsight.impact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
