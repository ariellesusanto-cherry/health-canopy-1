"use client";

// ============================================================
// Temperature Excursion Report — the audit artifact.
// A formal, printable summary of a cold chain excursion:
// what happened, when, what was at risk, what was done, and
// the compliance attestations (MyCAVax, viability review).
// Opens as a modal; Print produces a clean paper copy via the
// print styles in globals.css.
// ============================================================

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  Clock,
  Thermometer,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExcursionReport } from "@/lib/simulation";

function fmtSim(ms: number) {
  const d = new Date(ms);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export function ExcursionReportModal({
  report,
  onClose,
}: {
  report: ExcursionReport;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  const durationMin =
    report.resolvedAtMs !== null
      ? Math.max(1, Math.round((report.resolvedAtMs - report.startedAtMs) / 60000))
      : null;

  const attestations = [
    { label: "Excursion reported in MyCAVax", done: report.reportedToMyCAVax },
    { label: "Affected doses marked DO NOT USE pending viability review", done: true },
    { label: "Viability review opened per CDPH storage & handling guidance", done: report.status === "resolved" },
    { label: "Authorized service vendor dispatched (Follett Service — door seal)", done: true },
    { label: "Continuous DDL record attached (LogTag export)", done: true },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4 md:p-10">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm modal-backdrop print:hidden"
        onClick={onClose}
      />

      <div className="excursion-report-print relative w-full max-w-2xl bg-white rounded-2xl border border-border shadow-2xl modal-panel">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground font-display">
                Temperature Excursion Report
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Report <span className="font-mono">{report.id}</span> · Contra
                Costa Health · VFC Program
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-stone-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              aria-label="Close report"
              className="p-2 rounded-lg text-muted hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status strip */}
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold",
              report.status === "resolved"
                ? "bg-accent/10 border-accent/20 text-accent"
                : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            {report.status === "resolved" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                RESOLVED — doses relocated, unit back within range
              </>
            ) : (
              <>
                <Thermometer className="w-4 h-4" />
                ACTIVE — excursion in progress
              </>
            )}
          </div>

          {/* Facts grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
            <Fact label="Storage unit" value={report.unitId} mono />
            <Fact label="Site" value={report.siteName} />
            <Fact
              label="Data logger"
              value={`${report.loggerModel} · ${report.loggerSerial}`}
            />
            <Fact label="High alarm limit" value={`${report.alarmHighF}°F`} />
            <Fact
              label="Peak temperature"
              value={`${report.peakTempF.toFixed(1)}°F`}
              danger
            />
            <Fact
              label="Time above limit"
              value={durationMin !== null ? `${durationMin} min` : "ongoing"}
            />
            <Fact label="Excursion began" value={fmtSim(report.startedAtMs)} />
            <Fact
              label="Excursion cleared"
              value={report.resolvedAtMs ? fmtSim(report.resolvedAtMs) : "—"}
            />
            <Fact
              label="Logger calibration valid to"
              value={report.calibrationExpires}
            />
            <Fact
              label="Doses affected"
              value={`${report.doseCount} VFC doses · ${report.lotCount} lots`}
            />
            <Fact
              label="Estimated value at risk"
              value={`$${report.estValueUsd.toLocaleString()}`}
            />
            <Fact label="Prepared by" value="Health Canopy (automated)" />
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Event timeline
            </h3>
            <div className="space-y-2">
              {report.actions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="font-mono text-muted shrink-0 w-32">
                    {fmtSim(a.tMs).split("· ")[1]}
                  </span>
                  <span className="text-foreground leading-relaxed">{a.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance attestations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Compliance actions
            </h3>
            <div className="space-y-1.5">
              {attestations.map((a) => (
                <div key={a.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      a.done ? "text-accent" : "text-stone-300"
                    )}
                  />
                  <span className={a.done ? "text-foreground" : "text-muted"}>
                    {a.label}
                    {!a.done && " — pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted leading-relaxed border-t border-border pt-4">
            Generated automatically from continuous digital data logger records
            at the time of the event. Retain with the site&apos;s VFC
            documentation per CDPH requirements. Demo environment — synthetic
            data.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Fact({
  label,
  value,
  mono,
  danger,
}: {
  label: string;
  value: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 font-medium",
          mono && "font-mono text-[13px]",
          danger ? "text-red-600 font-bold" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
