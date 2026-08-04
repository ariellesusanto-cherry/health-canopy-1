"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { useTenant } from "@/lib/tenant-context";
import { useToast } from "@/components/ui/toast";
import {
  useSimulation,
  EXCURSION_UNIT_ID,
  type FridgeSim,
} from "@/lib/simulation";
import { ExcursionReportModal } from "@/components/demo/excursion-report";
import Link from "next/link";
import { daysFromNow } from "@/lib/demo-time";
import {
  Thermometer,
  Snowflake,
  Syringe,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  ArrowRightLeft,
  ClipboardCheck,
  Radio,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

const statusMeta: Record<
  FridgeSim["status"],
  { label: string; dot: string; pill: string; stroke: string }
> = {
  normal: {
    label: "In Range",
    dot: "bg-accent",
    pill: "bg-accent/10 text-accent",
    stroke: "#4a7a52",
  },
  alert: {
    label: "Approaching Limit",
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700",
    stroke: "#d4943e",
  },
  excursion: {
    label: "EXCURSION",
    dot: "bg-red-500",
    pill: "bg-red-100 text-red-700",
    stroke: "#c44840",
  },
};

function kindBadge(kind: FridgeSim["kind"]) {
  if (kind === "VFC")
    return "bg-primary/10 text-primary border-primary/20";
  if (kind === "Freezer")
    return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-stone-100 text-stone-600 border-stone-200";
}

export default function ColdChainPage() {
  const { tenant } = useTenant();
  const { showToast } = useToast();
  const {
    fridges,
    simNow,
    excursionPhase,
    resolveExcursion,
    excursionReport,
  } = useSimulation();
  const [reportOpen, setReportOpen] = useState(false);

  const [selectedKey, setSelectedKey] = useState<string>(
    // Default to the most interesting unit (the drifting MWC VFC fridge)
    fridges.find((f) => f.unitId === EXCURSION_UNIT_ID)?.key ?? fridges[0]?.key
  );
  const selected = fridges.find((f) => f.key === selectedKey) ?? fridges[0];

  const totalDoses = fridges.reduce((sum, f) => sum + f.doseCount, 0);
  const calDueSoon = fridges.filter(
    (f) =>
      f.calibrationExpires !== "—" && daysFromNow(f.calibrationExpires) < 90
  );
  const excursions24h =
    tenant.vfcCompliance.excursions24h +
    (excursionPhase === "excursion" || excursionPhase === "resolving" || excursionPhase === "resolved" ? 1 : 0);

  const alertUnits = fridges.filter((f) => f.status !== "normal");

  return (
    <div className="min-h-screen">
      <Header
        title="Cold Chain Monitoring"
        subtitle={`Continuous digital data logger telemetry — every vaccine storage unit across ${tenant.shortName}`}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Live status banner */}
        {alertUnits.length > 0 ? (
          <div
            className={cn(
              "rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3",
              alertUnits.some((f) => f.status === "excursion")
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            )}
          >
            <AlertTriangle
              className={cn(
                "w-5 h-5 shrink-0",
                alertUnits.some((f) => f.status === "excursion")
                  ? "text-red-600"
                  : "text-amber-600"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {alertUnits.some((f) => f.status === "excursion")
                  ? `Active temperature excursion — ${alertUnits.filter((f) => f.status === "excursion").map((f) => f.unitId).join(", ")}`
                  : `${alertUnits.length} unit${alertUnits.length > 1 ? "s" : ""} approaching temperature limits`}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {alertUnits
                  .map(
                    (f) =>
                      `${f.siteName} · ${f.kind}: ${f.readings[f.readings.length - 1].tempF.toFixed(1)}°F`
                  )
                  .join("  ·  ")}
              </p>
            </div>
            {excursionPhase === "excursion" && (
              <button
                onClick={() => {
                  resolveExcursion();
                  showToast(
                    "Transfer initiated — moving VFC stock to Martinez Health Center backup unit",
                    "info"
                  );
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Move doses to backup unit
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <p className="text-sm text-foreground flex-1">
              All {fridges.length} storage units in range.{" "}
              <span className="text-muted">
                Last reading {simNow.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · logging every 10 minutes
              </span>
            </p>
            {excursionReport && (
              <button
                onClick={() => setReportOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white text-xs font-medium text-foreground hover:bg-stone-50 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-red-600" />
                Excursion report {excursionReport.id}
              </button>
            )}
            <Link
              href="/vaccine-management#scan-inspector"
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
            >
              Point-of-care scans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {reportOpen && excursionReport && (
          <ExcursionReportModal
            report={excursionReport}
            onClose={() => setReportOpen(false)}
          />
        )}

        {/* KPI strip */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            icon={Radio}
            tone="accent"
            label="Units Monitored"
            value={String(fridges.length)}
            sub="6 refrigerators · 1 freezer, all with NIST-calibrated DDLs"
          />
          <KpiCard
            icon={Syringe}
            tone="primary"
            label="Doses Under Management"
            value={totalDoses.toLocaleString()}
            sub={`${fridges.filter((f) => f.kind === "VFC").reduce((s, f) => s + f.doseCount, 0)} VFC · ${fridges.filter((f) => f.kind !== "VFC").reduce((s, f) => s + f.doseCount, 0)} private`}
          />
          <KpiCard
            icon={AlertTriangle}
            tone={excursions24h > 0 ? "red" : "accent"}
            label="Excursions (24h)"
            value={String(excursions24h)}
            sub={
              excursionReport
                ? `${excursionReport.id} — ${excursionReport.status === "resolved" ? "resolved" : "active"}`
                : "No excursions in reporting window"
            }
            action={
              excursionReport
                ? { label: "View report", onClick: () => setReportOpen(true) }
                : undefined
            }
          />
          <KpiCard
            icon={ShieldCheck}
            tone={calDueSoon.length > 0 ? "amber" : "accent"}
            label="Calibrations Due <90d"
            value={String(calDueSoon.length)}
            sub={
              calDueSoon.length > 0
                ? `${calDueSoon[0].unitId} — ${calDueSoon[0].calibrationExpires}`
                : "All certificates current"
            }
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Unit list */}
          <div className="col-span-12 lg:col-span-4 space-y-2.5">
            {fridges.map((f) => {
              const latest = f.readings[f.readings.length - 1].tempF;
              const meta = statusMeta[f.status];
              const isSelected = f.key === selectedKey;
              return (
                <button
                  key={f.key}
                  onClick={() => setSelectedKey(f.key)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border bg-white transition-all",
                    isSelected
                      ? "border-primary shadow-md shadow-primary/10"
                      : "border-border hover:border-stone-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        f.kind === "Freezer" ? "bg-blue-50" : "bg-primary/10"
                      )}
                    >
                      {f.kind === "Freezer" ? (
                        <Snowflake className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Thermometer className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border shrink-0",
                            kindBadge(f.kind)
                          )}
                        >
                          {f.kind}
                        </span>
                        <span className="text-xs font-mono text-muted truncate">
                          {f.unitId}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1 truncate">
                        {f.siteName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "text-xl font-bold tabular-nums",
                          f.status === "excursion"
                            ? "text-red-600"
                            : f.status === "alert"
                              ? "text-amber-600"
                              : "text-foreground"
                        )}
                      >
                        {latest.toFixed(1)}°F
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            meta.dot,
                            f.status !== "normal" && "pulse-dot"
                          )}
                        />
                        <span className="text-[10px] text-muted">
                          {f.doseCount} doses
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <p className="text-[11px] text-muted leading-relaxed px-1 pt-1 flex items-start gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Continuous logging satisfies the CDPH twice-daily min/max
              requirement — AM/PM checks are auto-certified from DDL data
              instead of paper logs.
            </p>
          </div>

          {/* Detail panel */}
          <div data-tour="cold-chain-detail" className="col-span-12 lg:col-span-8 space-y-6">
            {selected && <UnitDetail fridge={selected} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Components ----

function KpiCard({
  icon: Icon,
  tone,
  label,
  value,
  sub,
  action,
}: {
  icon: typeof Thermometer;
  tone: "accent" | "amber" | "red" | "primary";
  label: string;
  value: string;
  sub: string;
  action?: { label: string; onClick: () => void };
}) {
  const tones = {
    accent: "bg-accent/10 text-accent",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    primary: "bg-primary/10 text-primary",
  } as const;
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {value}
          </p>
          <p className="text-xs text-muted mt-1.5 truncate">{sub}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-1.5 text-xs font-medium text-primary hover:underline"
            >
              {action.label} →
            </button>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg shrink-0", tones[tone])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function UnitDetail({ fridge }: { fridge: FridgeSim }) {
  const meta = statusMeta[fridge.status];
  const latest = fridge.readings[fridge.readings.length - 1];
  const isFreezer = fridge.kind === "Freezer";

  const chartData = useMemo(
    () =>
      fridge.readings.map((r) => ({
        t: r.t,
        temp: r.tempF,
        label: new Date(r.t).toLocaleTimeString("en-US", {
          hour: "numeric",
        }),
      })),
    [fridge.readings]
  );

  // 24h stats
  const dayAgo = latest.t - 24 * 60 * 60 * 1000;
  const last24 = fridge.readings.filter((r) => r.t >= dayAgo);
  const min24 = Math.min(...last24.map((r) => r.tempF));
  const max24 = Math.max(...last24.map((r) => r.tempF));
  const avg24 =
    Math.round(
      (last24.reduce((s, r) => s + r.tempF, 0) / last24.length) * 10
    ) / 10;

  const yDomain = isFreezer ? [-26, 10] : [32, 50];
  const calDays =
    fridge.calibrationExpires !== "—"
      ? daysFromNow(fridge.calibrationExpires)
      : null;

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      {/* Unit header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground font-mono">
              {fridge.unitId}
            </h3>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border",
                kindBadge(fridge.kind)
              )}
            >
              {fridge.kind}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">{fridge.siteName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={cn(
                "text-3xl font-bold tabular-nums leading-none",
                fridge.status === "excursion"
                  ? "text-red-600"
                  : fridge.status === "alert"
                    ? "text-amber-600"
                    : "text-foreground"
              )}
            >
              {latest.tempF.toFixed(1)}°F
            </p>
            <p className="text-[11px] text-muted mt-1">
              {new Date(latest.t).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={cn(
              "text-[11px] font-semibold px-2.5 py-1 rounded-full",
              meta.pill
            )}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {/* 48h chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={meta.stroke} stopOpacity={0.18} />
                <stop offset="100%" stopColor={meta.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5efe6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#6b6057" }}
              axisLine={{ stroke: "#e6ddd0" }}
              minTickGap={40}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: "#6b6057" }}
              axisLine={{ stroke: "#e6ddd0" }}
              tickFormatter={(v) => `${v}°`}
              width={38}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e6ddd0",
              }}
              formatter={(v) => [`${v}°F`, "Temp"]}
              labelFormatter={(l) => `~${l}`}
            />
            {/* Safe band */}
            <ReferenceArea
              y1={fridge.alarmLowF}
              y2={fridge.alarmHighF}
              fill="#4a7a52"
              fillOpacity={0.07}
            />
            <ReferenceLine
              y={fridge.alarmHighF}
              stroke="#c44840"
              strokeDasharray="4 4"
              label={{
                value: `High alarm ${fridge.alarmHighF}°F`,
                position: "insideTopRight",
                fontSize: 10,
                fill: "#c44840",
              }}
            />
            <ReferenceLine
              y={fridge.alarmLowF}
              stroke="#d4943e"
              strokeDasharray="4 4"
              label={{
                value: `Low alarm ${fridge.alarmLowF}°F`,
                position: "insideBottomRight",
                fontSize: 10,
                fill: "#d4943e",
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="none"
              fill="url(#tempFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={meta.stroke}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-muted mt-1 flex items-center gap-1.5">
        <Activity className="w-3 h-3" />
        Trailing 48 hours · one reading per 10 minutes · live
      </p>

      {/* Stats + metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        <Stat label="24h Min" value={`${min24.toFixed(1)}°F`} />
        <Stat label="24h Max" value={`${max24.toFixed(1)}°F`} />
        <Stat label="24h Avg" value={`${avg24.toFixed(1)}°F`} />
        <Stat
          label="Doses / Lots"
          value={`${fridge.doseCount} / ${fridge.lotCount}`}
        />
      </div>

      <div className="mt-5 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-xs">
        <p>
          <span className="text-muted">Data logger:</span>{" "}
          <span className="text-foreground font-medium">
            {fridge.dataLoggerModel}
          </span>{" "}
          <span className="font-mono text-[11px] text-muted">
            {fridge.dataLoggerSerial}
          </span>
        </p>
        <p>
          <span className="text-muted">Calibration expires:</span>{" "}
          <span
            className={cn(
              "font-medium",
              calDays !== null && calDays < 30
                ? "text-red-600"
                : calDays !== null && calDays < 90
                  ? "text-amber-600"
                  : "text-foreground"
            )}
          >
            {fridge.calibrationExpires}
            {calDays !== null && ` (${calDays}d)`}
          </span>
        </p>
        <p>
          <span className="text-muted">Alarm range:</span>{" "}
          <span className="text-foreground font-medium">
            {fridge.alarmLowF}°F – {fridge.alarmHighF}°F
          </span>
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-50/70 border border-border/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-foreground mt-0.5 tabular-nums">
        {value}
      </p>
    </div>
  );
}
