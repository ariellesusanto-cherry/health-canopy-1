"use client";

import { Header } from "@/components/layout/header";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  Thermometer,
  Snowflake,
  ShieldCheck,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Users,
  Wrench,
  Syringe,
  ExternalLink,
  ScanLine,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useState } from "react";
import type { VfcTask } from "@/lib/tenants";
import { DEMO_NOW } from "@/lib/demo-time";

const cadenceLabels: Record<VfcTask["cadence"], string> = {
  daily: "Daily",
  "bi-weekly": "Bi-weekly",
  monthly: "Monthly",
  annual: "Annual",
  "as-needed": "As needed",
};

const statusStyles: Record<VfcTask["status"], { bg: string; text: string; label: string }> = {
  "on-track": { bg: "bg-accent/10", text: "text-accent", label: "On track" },
  "due-soon": { bg: "bg-amber-50", text: "text-amber-700", label: "Due soon" },
  overdue: { bg: "bg-red-50", text: "text-red-700", label: "Overdue" },
  complete: { bg: "bg-stone-100", text: "text-stone-600", label: "Complete" },
};

const categoryStyles: Record<"spoiled" | "expired" | "wasted", string> = {
  spoiled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  wasted: "bg-stone-100 text-stone-600 border-stone-200",
};

export default function VaccineManagementPage() {
  const { tenant } = useTenant();
  const totalRoles = tenant.vfcRoles.length;
  const completeTraining = tenant.vfcRoles.filter((r) => r.trainingComplete).length;
  const tasksOverdue = tenant.vfcTasks.filter((t) => t.status === "overdue").length;
  const tasksDueSoon = tenant.vfcTasks.filter((t) => t.status === "due-soon").length;

  return (
    <div className="min-h-screen">
      <Header
        title="Vaccine Management Plan"
        subtitle={`${tenant.name} — CDPH VFC compliance program`}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Compliance overview strip */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <ComplianceCard
            label="VFC Enrollment"
            value="Active"
            sub={`Recert in ${tenant.vfcCompliance.nextRecertificationDays}d`}
            tone={tenant.vfcCompliance.nextRecertificationDays < 60 ? "amber" : "accent"}
            icon={ShieldCheck}
          />
          <ComplianceCard
            label="Staff Training"
            value={`${completeTraining}/${totalRoles}`}
            sub="Required roles trained"
            tone={completeTraining === totalRoles ? "accent" : "amber"}
            icon={Users}
          />
          <ComplianceCard
            label="Open Tasks"
            value={`${tasksOverdue + tasksDueSoon}`}
            sub={`${tasksOverdue} overdue · ${tasksDueSoon} due soon`}
            tone={tasksOverdue > 0 ? "red" : tasksDueSoon > 0 ? "amber" : "accent"}
            icon={ClipboardList}
          />
          <ComplianceCard
            label={`${tenant.vfcCompliance.registry} Sync`}
            value={`${tenant.vfcCompliance.cair2PendingDoses}`}
            sub="Doses pending submission"
            tone={tenant.vfcCompliance.cair2PendingDoses > 0 ? "amber" : "accent"}
            icon={Syringe}
          />
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: Important Contacts                                */}
        {/* ============================================================ */}
        <Section
          number={1}
          title="Important Contacts"
          subtitle="Practice staff and emergency contacts required by the VFC plan"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactGroup title="Practice Staff" contacts={tenant.vfcContacts.practice} />
            <ContactGroup
              title="Emergency Contacts"
              contacts={tenant.vfcContacts.emergency}
              highlight
            />
          </div>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 2: Equipment Documentation                           */}
        {/* ============================================================ */}
        <Section
          number={2}
          title="Equipment Documentation"
          subtitle="Vaccine storage units, digital data loggers, and calibration timeline"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-semibold uppercase text-muted">
                  <th className="px-3 py-2">Unit ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Designation</th>
                  <th className="px-3 py-2">Serial</th>
                  <th className="px-3 py-2">Data Logger</th>
                  <th className="px-3 py-2">Probe</th>
                  <th className="px-3 py-2">Alarms (°F)</th>
                  <th className="px-3 py-2">Calibration Expires</th>
                </tr>
              </thead>
              <tbody>
                {tenant.vfcEquipment.map((u) => {
                  const calDate = new Date(u.calibrationExpires);
                  const today = DEMO_NOW;
                  const daysToExpiry = Math.round((calDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const calTone =
                    daysToExpiry < 30 ? "text-red-600" :
                    daysToExpiry < 90 ? "text-amber-600" : "text-foreground";
                  const isVFC = u.unitId.startsWith("VFC");
                  return (
                    <tr key={u.unitId} className="border-b border-border last:border-0 hover:bg-stone-50/50">
                      <td className="px-3 py-2.5 font-mono text-[11px]">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border",
                          isVFC ? "bg-primary/10 text-primary border-primary/20" : "bg-stone-100 text-stone-600 border-stone-200"
                        )}>
                          {u.unitId}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {u.type === "Freezer" || u.type === "ULT Freezer" ? (
                            <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Thermometer className="w-3.5 h-3.5 text-accent" />
                          )}
                          <span className="text-foreground">{u.type}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-muted">{u.locationId}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                          u.designation === "primary" ? "bg-accent/10 text-accent" : "bg-stone-100 text-stone-600"
                        )}>
                          {u.designation}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted">{u.serialNumber}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-foreground">{u.dataLoggerModel}</p>
                        <p className="font-mono text-[10px] text-muted">{u.dataLoggerSerial}</p>
                      </td>
                      <td className="px-3 py-2.5 text-muted capitalize">{u.probeType}</td>
                      <td className="px-3 py-2.5 text-muted">{u.alarmLowF} – {u.alarmHighF}</td>
                      <td className={cn("px-3 py-2.5 font-medium", calTone)}>
                        {u.calibrationExpires}
                        <p className="text-[10px] font-normal">
                          {daysToExpiry < 0
                            ? `${Math.abs(daysToExpiry)}d overdue`
                            : `in ${daysToExpiry}d`}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted mt-3 flex items-center gap-1.5">
            <Wrench className="w-3 h-3" />
            Authorized repair: contact <span className="font-medium">Refrigerator Repair</span> in Section 1 emergency contacts.
          </p>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 3: Key Staff Roles & Responsibilities                */}
        {/* ============================================================ */}
        <Section
          number={3}
          title="Key Staff Roles & Responsibilities"
          subtitle="Designated vaccine management staff and their VFC duties"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenant.vfcRoles.map((r) => (
              <div key={r.role} className="rounded-xl border border-border p-5 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-muted tracking-wide">{r.role}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{r.name}, {r.credential}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full",
                    r.trainingComplete ? "bg-accent/10 text-accent" : "bg-amber-50 text-amber-700"
                  )}>
                    {r.trainingComplete
                      ? <><CheckCircle2 className="w-3 h-3" /> Trained {r.trainingDate}</>
                      : <><AlertTriangle className="w-3 h-3" /> Training pending</>
                    }
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {r.responsibilities.map((resp, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5 leading-relaxed">
                      <span className="text-accent mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 4: Initial Equipment Setup Guide                     */}
        {/* ============================================================ */}
        <Section
          number={4}
          title="Initial Equipment Setup Guide"
          subtitle="VFC program requirements for storage units and digital data loggers"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border p-5 bg-stone-50/50">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-accent" />
                Storage Unit Requirements
              </h4>
              <ul className="text-xs text-foreground space-y-2 leading-relaxed">
                <li>• Stand-alone refrigerator and freezer units only — dorm-style and combination units prohibited.</li>
                <li>• Refrigerated vaccines: <strong>36–46°F</strong> (target 40°F). Frozen vaccines: <strong>≤5°F</strong> (target 0°F).</li>
                <li>• VFC and private stock physically separated (Martinez sites use dedicated VFC + private fridges).</li>
                <li>• Each unit clearly labeled with designation and unit ID matching Section 2 documentation.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5 bg-stone-50/50">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Digital Data Logger Requirements
              </h4>
              <ul className="text-xs text-foreground space-y-2 leading-relaxed">
                <li>• Continuous monitoring with NIST-traceable calibration certificate.</li>
                <li>• Swappable probe module preferred — allows probe replacement without unit downtime.</li>
                <li>• Calibration must remain current; recalibrate or replace before listed expiration.</li>
                <li>• Alarm settings configured for low/high temp; immediate response required on excursion.</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/* TASK SCHEDULE                                                */}
        {/* ============================================================ */}
        <Section
          number={null}
          icon={CalendarDays}
          title="Task Schedule"
          subtitle="Required cadence per the CDPH vaccine management plan"
        >
          <div className="space-y-2.5">
            {tenant.vfcTasks.map((t, i) => {
              const s = statusStyles[t.status];
              return (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-stone-100 text-stone-600 shrink-0 mt-0.5">
                    {cadenceLabels[t.cadence]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{t.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted">
                      {t.lastCompleted && <span>Last: <span className="text-foreground font-medium">{t.lastCompleted}</span></span>}
                      {t.nextDue && <span>Next: <span className="text-foreground font-medium">{t.nextDue}</span></span>}
                    </div>
                  </div>
                  <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full shrink-0", s.bg, s.text)}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ============================================================ */}
        {/* POINT-OF-CARE SCAN INSPECTOR                                 */}
        {/* ============================================================ */}
        <Section
          number={null}
          icon={ScanLine}
          tourId="scan-inspector"
          title="Point-of-Care Scan Inspector"
          subtitle={`Each scan fans out to 5 systems. Verify the data flow per dose — ${tenant.vfcScans[0]?.ehrSystem ?? "EHR"} → ${tenant.vfcCompliance.registry} → inventory → MyCAVax → audit log.`}
        >
          <div className="space-y-3">
            {tenant.vfcScans.map((s, i) => (
              <ScanRow key={i} scan={s} registry={tenant.vfcCompliance.registry} />
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            Barcode payload (2D Data Matrix on the vial) carries NDC + lot + expiration + serial — one scan autofills the EHR, decrements the source fridge, sends the HL7 message to {tenant.vfcCompliance.registry}, and logs to MyCAVax. Scanner blocks administration if NDC doesn&apos;t match the order, lot is past expiration, or VFC-eligible patient was matched against private stock.
          </p>
        </Section>

        {/* ============================================================ */}
        {/* SEW REPORTING                                                */}
        {/* ============================================================ */}
        <Section
          number={null}
          icon={AlertTriangle}
          title="Spoiled / Expired / Wasted (SEW) Reporting"
          subtitle="Reported through MyCAVax, disposed per practice protocol"
        >
          <div className="space-y-2">
            {tenant.vfcSEW.map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-white">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border shrink-0",
                  categoryStyles[e.category]
                )}>
                  {e.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {e.vaccine} <span className="text-muted font-normal">({e.brand})</span> · {e.doses} dose{e.doses === 1 ? "" : "s"}
                  </p>
                  <p className="text-[11px] text-muted">Lot {e.lot} · {e.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-muted">{e.date}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className={cn(
                      "flex items-center gap-1",
                      e.reportedToMyCAVax ? "text-accent" : "text-amber-600"
                    )}>
                      {e.reportedToMyCAVax ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      MyCAVax
                    </span>
                    <span className={cn(
                      "flex items-center gap-1",
                      e.disposalStatus === "completed" ? "text-accent" : "text-amber-600"
                    )}>
                      {e.disposalStatus === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      Disposed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3 flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            Report SEW events at <span className="font-mono">mycavax.cdph.ca.gov</span>
          </p>
        </Section>
      </div>
    </div>
  );
}

// ---- Helpers ----

function ComplianceCard({
  label,
  value,
  sub,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "accent" | "amber" | "red";
  icon: typeof ShieldCheck;
}) {
  const toneStyles = {
    accent: "bg-accent/10 text-accent",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  } as const;
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <p className="text-xs text-muted mt-1.5">{sub}</p>
        </div>
        <div className={cn("p-2.5 rounded-lg", toneStyles[tone])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function Section({
  number,
  icon: Icon,
  title,
  subtitle,
  tourId,
  children,
}: {
  number: number | null;
  icon?: typeof ShieldCheck;
  title: string;
  subtitle: string;
  tourId?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={tourId} data-tour={tourId} className="bg-white rounded-xl border border-border p-6 scroll-mt-24">
      <div className="flex items-start gap-3 mb-5">
        {number !== null ? (
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {number}
          </span>
        ) : Icon ? (
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </span>
        ) : null}
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ScanRow({
  scan,
  registry,
}: {
  scan: import("@/lib/tenants").VfcScanEvent;
  registry: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const scanTime = new Date(scan.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const allClear =
    scan.ehrPosted &&
    scan.cair2Submitted &&
    scan.inventoryDecremented &&
    scan.myCAVaxLogged &&
    scan.auditTrailCaptured;

  const systems = [
    { label: scan.ehrSystem.split(" ")[0], full: scan.ehrSystem, ok: scan.ehrPosted, at: scan.ehrPostedAt },
    { label: registry, full: `${registry} (CA Immunization Registry)`, ok: scan.cair2Submitted, at: scan.cair2SubmittedAt },
    { label: "Inventory", full: `${scan.fridge} fridge decrement`, ok: scan.inventoryDecremented },
    { label: "MyCAVax", full: "VFC accountability log", ok: scan.myCAVaxLogged },
    { label: "Audit", full: "HIPAA + VFC audit trail", ok: scan.auditTrailCaptured },
  ];

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Scan icon + time */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] text-muted">{scanTime}</span>
          </div>

          {/* Scan summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                {scan.vaccine} <span className="text-muted font-normal">({scan.brand})</span>
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border",
                scan.fridge === "VFC"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-stone-100 text-stone-600 border-stone-200"
              )}>
                {scan.fridge}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                {scan.eligibility}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Patient {scan.patientId} ({scan.patientAge}) · {scan.site} · {scan.room} · Scanned by {scan.scannedBy}
            </p>

            {/* System status pills */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {systems.map((sys) => (
                <span
                  key={sys.label}
                  title={sys.full}
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border",
                    sys.ok
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {sys.ok
                    ? <CheckCircle2 className="w-2.5 h-2.5" />
                    : <Clock className="w-2.5 h-2.5" />
                  }
                  {sys.label}
                </span>
              ))}
            </div>
          </div>

          {/* Overall status + expand */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
              "text-[11px] font-semibold px-2 py-1 rounded-full",
              allClear ? "bg-accent/10 text-accent" : "bg-amber-50 text-amber-700"
            )}>
              {allClear ? "Synced" : "Pending"}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted transition-transform",
              expanded && "rotate-180"
            )} />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-stone-50/40 p-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
          {/* Barcode payload */}
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted tracking-wide mb-1">Barcode Payload (2D Data Matrix)</p>
            <div className="font-mono text-[11px] space-y-0.5">
              <p><span className="text-muted">NDC:</span> {scan.ndc}</p>
              <p><span className="text-muted">Lot:</span> {scan.lot}</p>
              <p><span className="text-muted">Exp:</span> {scan.expiration}</p>
            </div>
          </div>
          {/* Patient + clinical */}
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted tracking-wide mb-1">Patient + Clinical</p>
            <div className="space-y-0.5">
              <p><span className="text-muted">Patient:</span> {scan.patientId} ({scan.patientAge})</p>
              <p><span className="text-muted">VFC eligibility:</span> {scan.eligibility}</p>
              <p><span className="text-muted">VIS provided:</span> {scan.visVersion}</p>
            </div>
          </div>
          {/* System details */}
          <div className="col-span-2">
            <p className="text-[10px] font-semibold uppercase text-muted tracking-wide mb-1.5">Downstream Systems</p>
            <div className="space-y-1.5">
              {systems.map((sys) => (
                <div key={sys.label} className="flex items-center justify-between gap-2">
                  <span className="text-foreground">{sys.full}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-[11px] font-medium",
                    sys.ok ? "text-accent" : "text-amber-600"
                  )}>
                    {sys.ok
                      ? <><CheckCircle2 className="w-3 h-3" /> {sys.at ? new Date(sys.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }) : "Confirmed"}</>
                      : <><Clock className="w-3 h-3" /> Pending</>
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactGroup({
  title,
  contacts,
  highlight,
}: {
  title: string;
  contacts: Array<{ role: string; name: string; title: string; phone: string; email: string }>;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border p-5",
      highlight ? "border-amber-200 bg-amber-50/40" : "border-border bg-stone-50/50"
    )}>
      <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
      <div className="space-y-3">
        {contacts.map((c) => (
          <div key={c.role + c.name} className="pb-3 border-b border-border/60 last:border-0 last:pb-0">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">{c.role}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{c.name}</p>
            <p className="text-[11px] text-muted">{c.title}</p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px]">
              <span className="flex items-center gap-1 text-foreground">
                <Phone className="w-3 h-3 text-muted" />
                {c.phone}
              </span>
              <span className="flex items-center gap-1 text-foreground truncate">
                <Mail className="w-3 h-3 text-muted shrink-0" />
                <span className="truncate">{c.email}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
