"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Download,
  Play,
  ListChecks,
  Wrench,
  AlertCircle,
  ClipboardCheck,
  ArrowRight,
  CalendarDays,
  CircleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import {
  complianceChapters,
  overallReadinessScore,
  equipmentRegistry,
  complianceFindings,
  type ComplianceChapter,
  type Equipment,
} from "@/lib/mock-data";

const trendIcons = {
  improving: { icon: TrendingUp, color: "text-emerald-500", label: "Improving" },
  stable: { icon: Minus, color: "text-gray-400", label: "Stable" },
  declining: { icon: TrendingDown, color: "text-red-500", label: "Declining" },
};

function LargeScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#10b981" : score >= 80 ? "#f59e0b" : "#ef4444";
  const label = score >= 90 ? "Survey Ready" : score >= 80 ? "Needs Attention" : "At Risk";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f5efe6" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="score-gauge"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-muted font-medium mt-1">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-semibold mt-2" style={{ color }}>{label}</span>
      <span className="text-xs text-muted mt-0.5">Overall Readiness Score</span>
    </div>
  );
}

function ChapterCard({ chapter, expanded, onToggle }: { chapter: ComplianceChapter; expanded: boolean; onToggle: () => void }) {
  const trend = trendIcons[chapter.trend];
  const TrendIcon = trend.icon;
  const scoreColor = chapter.score >= 90 ? "text-emerald-600" : chapter.score >= 80 ? "text-amber-600" : "text-red-600";
  const barColor = chapter.score >= 90 ? "bg-emerald-500" : chapter.score >= 80 ? "bg-amber-400" : "bg-red-400";
  const findings = complianceFindings.filter((f) => f.chapter === chapter.code);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-5 hover:bg-stone-50/50 transition-colors text-left">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0",
          chapter.score >= 90 ? "bg-emerald-50 text-emerald-600" :
          chapter.score >= 80 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
        )}>
          {chapter.code}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{chapter.name}</h4>
            <div className={cn("flex items-center gap-1 text-[11px] font-medium", trend.color)}>
              <TrendIcon className="w-3 h-3" />
              {trend.label}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", barColor)} style={{ width: `${chapter.score}%` }} />
            </div>
            <span className={cn("text-sm font-bold w-12 text-right", scoreColor)}>{chapter.score}%</span>
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted">
            <span>{chapter.metRequirements}/{chapter.totalRequirements} requirements met</span>
            <span>{chapter.findings} open findings</span>
            <span>Assessed: {chapter.lastAssessed}</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
      </button>

      {expanded && findings.length > 0 && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="mt-4 space-y-3">
            <h5 className="text-xs font-semibold text-muted uppercase">Open Findings</h5>
            {findings.map((f) => (
              <div key={f.id} className={cn(
                "p-3 rounded-lg border",
                f.severity === "high" ? "bg-red-50 border-red-100" :
                f.severity === "medium" ? "bg-amber-50 border-amber-100" : "bg-stone-100 border-stone-200"
              )}>
                <div className="flex items-start gap-2">
                  {f.severity === "high" ? <CircleAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> :
                   <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-muted">{f.standard}</span>
                      <span className={cn(
                        "text-[11px] px-1.5 py-0.5 rounded font-medium",
                        f.status === "open" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {f.status === "open" ? "OPEN" : "IN PROGRESS"}
                      </span>
                    </div>
                    <p className="text-xs text-foreground mt-1">{f.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                      <span>Assigned: {f.assignedTo}</span>
                      <span>Due: {f.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>("ec");
  const [activeTab, setActiveTab] = useState<"overview" | "equipment" | "findings" | "reports">("overview");

  const pmStats = {
    total: equipmentRegistry.length,
    current: equipmentRegistry.filter((e) => e.pmStatus === "current").length,
    dueSoon: equipmentRegistry.filter((e) => e.pmStatus === "due-soon").length,
    overdue: equipmentRegistry.filter((e) => e.pmStatus === "overdue").length,
    highRisk: equipmentRegistry.filter((e) => e.riskLevel === "high").length,
    lifeSupport: equipmentRegistry.filter((e) => e.isLifeSupport).length,
  };

  const openFindings = complianceFindings.filter((f) => f.status === "open").length;
  const inProgressFindings = complianceFindings.filter((f) => f.status === "in-progress").length;

  return (
    <div className="min-h-screen">
      <Header title="Joint Commission Compliance" subtitle="Continuous readiness monitoring mapped to TJC standards (EC, MM, IC, EM, IM, LD, NPSG)" />

      <div className="p-8 space-y-6">
        {/* Top Section — Score + Key Stats */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 bg-white rounded-xl border border-border p-6 flex flex-col items-center justify-center">
            <LargeScoreGauge score={overallReadinessScore} />
            <div className="w-full mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                <p className="text-lg font-bold text-red-600">{openFindings}</p>
                <p className="text-[11px] text-red-600 font-medium">Open Findings</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-center">
                <p className="text-lg font-bold text-amber-600">{inProgressFindings}</p>
                <p className="text-[11px] text-amber-600 font-medium">In Progress</p>
              </div>
            </div>
          </div>

          <div className="col-span-8 space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Run Mock Survey", icon: Play, desc: "Simulate TJC tracer", color: "bg-primary text-white hover:bg-primary-dark" },
                { label: "Generate Audit Report", icon: FileText, desc: "One-click compliance export", color: "bg-white text-foreground border border-border hover:bg-stone-50" },
                { label: "PM Status Report", icon: Wrench, desc: "Equipment maintenance", color: "bg-white text-foreground border border-border hover:bg-stone-50" },
                { label: "96-Hr Sustainability", icon: ShieldCheck, desc: "Emergency preparedness", color: "bg-white text-foreground border border-border hover:bg-stone-50" },
              ].map((action) => (
                <button key={action.label} className={cn("flex items-center gap-3 p-4 rounded-xl transition-colors text-left", action.color)}>
                  <action.icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="text-[11px] text-white/80">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Equipment & PM Summary */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-muted" />
                  Equipment & Preventive Maintenance — EC.02.04.01
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Equipment", value: pmStats.total, color: "text-foreground" },
                  { label: "PM Current", value: pmStats.current, color: "text-emerald-600" },
                  { label: "PM Due Soon", value: pmStats.dueSoon, color: "text-amber-600" },
                  { label: "PM Overdue", value: pmStats.overdue, color: "text-red-600" },
                  { label: "High Risk", value: pmStats.highRisk, color: "text-rose-600" },
                  { label: "Life Support", value: pmStats.lifeSupport, color: "text-orange-600" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-stone-50">
                    <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-[11px] text-muted font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {[
            { id: "overview" as const, label: "Chapter Scorecard", icon: ListChecks },
            { id: "equipment" as const, label: "Equipment Registry", icon: Wrench },
            { id: "findings" as const, label: "Findings & Corrective Actions", icon: AlertTriangle },
            { id: "reports" as const, label: "Audit Reports", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {complianceChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                expanded={expandedChapter === chapter.id}
                onToggle={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Medical Equipment Inventory Registry</h3>
                <p className="text-xs text-muted mt-0.5">Per EC.02.04.01 EP 2 — Complete inventory of all medical equipment with risk classification</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5">
                <Download className="w-3.5 h-3.5" /> Export Registry
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-stone-50">
                  {[
                    { label: "ID" },
                    { label: "Equipment" },
                    { label: "Department" },
                    { label: "Risk Level" },
                    { label: "Life Support", tooltip: "Equipment classified as life-sustaining per TJC EC.02.04.01" },
                    { label: "PM Status" },
                    { label: "Next PM" },
                    { label: "AEM", tooltip: "Alternative Equipment Maintenance — risk-based PM scheduling per EC.02.04.01 EP 4" },
                    { label: "Status" },
                  ].map((h) => (
                    <th key={h.label} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      {h.tooltip ? (
                        <Tooltip content={h.tooltip} position="bottom" wide>
                          <span className="cursor-help border-b border-dotted border-muted/60">{h.label}</span>
                        </Tooltip>
                      ) : h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipmentRegistry.map((eq) => (
                  <tr key={eq.id} className="border-b border-border/50">
                    <td className="px-4 py-3 text-xs font-mono text-muted">{eq.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{eq.name}</p>
                      <p className="text-[11px] text-muted">{eq.manufacturer} — {eq.model}</p>
                      <p className="text-[11px] text-muted font-mono">S/N: {eq.serialNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{eq.department}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[11px] font-semibold px-2 py-1 rounded-full",
                        eq.riskLevel === "high" ? "bg-red-50 text-red-700 border border-red-200" :
                        eq.riskLevel === "medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-green-50 text-green-700 border border-green-200"
                      )}>
                        {eq.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {eq.isLifeSupport ? (
                        <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          LIFE SUPPORT
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[11px] font-semibold px-2 py-1 rounded-full",
                        eq.pmStatus === "current" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        eq.pmStatus === "due-soon" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-red-50 text-red-700 border border-red-200"
                      )}>
                        {eq.pmStatus === "current" ? "CURRENT" : eq.pmStatus === "due-soon" ? "DUE SOON" : "OVERDUE"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs",
                        eq.pmStatus === "overdue" ? "text-red-600 font-medium" : "text-foreground"
                      )}>
                        {eq.nextPM}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {eq.aemApplied ? (
                        <Tooltip content="Alternative Equipment Maintenance schedule in use">
                          <span className="text-[11px] font-medium text-orange-600 cursor-help border-b border-dotted border-orange-300">AEM</span>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Manufacturer-recommended maintenance schedule">
                          <span className="text-xs text-muted cursor-help border-b border-dotted border-muted/60">MFR</span>
                        </Tooltip>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[11px] font-medium",
                        eq.status === "operational" ? "text-emerald-600" :
                        eq.status === "maintenance" ? "text-amber-600" : "text-red-600"
                      )}>
                        {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "findings" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-50">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{openFindings}</p>
                  <p className="text-xs text-muted">Open Findings</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{inProgressFindings}</p>
                  <p className="text-xs text-muted">In Progress</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">12</p>
                  <p className="text-xs text-muted">Resolved (Last 90 Days)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-stone-50">
                    {["ID", "Standard", "Description", "Severity", "Status", "Assigned To", "Due Date"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complianceFindings.map((f) => (
                    <tr key={f.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-xs font-mono text-muted">{f.id}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-medium text-foreground">{f.standard}</span>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-xs text-foreground">{f.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[11px] font-semibold px-2 py-1 rounded-full border",
                          f.severity === "high" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {f.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[11px] font-semibold px-2 py-1 rounded-full border",
                          f.status === "open" ? "bg-red-50 text-red-700 border-red-200" :
                          f.status === "in-progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}>
                          {f.status === "in-progress" ? "IN PROGRESS" : f.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{f.assignedTo}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-xs",
                          new Date(f.dueDate) < new Date("2026-03-17") ? "text-red-600 font-medium" : "text-foreground"
                        )}>
                          {f.dueDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-2 gap-5">
            {[
              { title: "Complete Equipment Inventory", desc: "Full medical equipment registry with risk classification per EC.02.04.01 EP 2", format: "PDF / Excel", icon: ClipboardCheck },
              { title: "High-Risk Device Registry", desc: "All life-support and high-risk equipment per EC.02.04.01 EP 3", format: "PDF", icon: AlertCircle },
              { title: "PM Completion Report", desc: "Preventive maintenance status, completion rates, and overdue items per EC.02.04.03", format: "PDF / Excel", icon: Wrench },
              { title: "Medication Disposition Records", desc: "Receipt and disposition of scheduled drugs per MM 13.01.01 EP 1", format: "PDF", icon: FileText },
              { title: "96-Hour Sustainability Report", desc: "Emergency preparedness inventory calculations per EM.12.02.09", format: "PDF", icon: ShieldCheck },
              { title: "AEM Program Documentation", desc: "Alternative Equipment Maintenance justifications and evidence per EC.02.04.01 EP 4", format: "PDF", icon: FileText },
              { title: "Compliance Gap Analysis", desc: "Current gaps across all TJC chapters with corrective action status", format: "PDF / Excel", icon: ListChecks },
              { title: "Survey Readiness Summary", desc: "Executive-level readiness overview aligned with SPG 2026 modules", format: "PDF", icon: CalendarDays },
            ].map((report) => (
              <div key={report.title} className="bg-white rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/5">
                  <report.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">{report.title}</h4>
                  <p className="text-xs text-muted mt-1">{report.desc}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                      <Download className="w-3.5 h-3.5" /> Generate
                    </button>
                    <span className="text-[11px] text-muted">Format: {report.format}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
