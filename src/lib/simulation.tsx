"use client";

// ============================================================
// Live demo simulation engine
// ------------------------------------------------------------
// Owns the "living" state of the demo: continuous cold-chain
// telemetry for every vaccine storage unit, a ticking sim clock
// anchored at DEMO_NOW, and scripted scenarios (fridge excursion)
// that the Demo Director can trigger. Pages subscribe via
// useSimulation() so an event triggered on one page is visible
// everywhere (dashboard alert, cold chain chart, activity feed).
//
// All baseline series are seeded + deterministic so server and
// client render identically; live ticking starts client-side.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEMO_NOW } from "./demo-time";
import { useTenant } from "./tenant-context";
import { useToast } from "@/components/ui/toast";

// ---- Types ------------------------------------------------------------

export type TempReading = {
  /** epoch ms (sim time) */
  t: number;
  tempF: number;
};

export type FridgeStatus = "normal" | "alert" | "excursion";

export type FridgeSim = {
  key: string;
  unitId: string;
  siteId: string;
  siteName: string;
  /** VFC / Private stock, or Freezer */
  kind: "VFC" | "Private" | "Freezer";
  doseCount: number;
  lotCount: number;
  alarmLowF: number;
  alarmHighF: number;
  dataLoggerModel: string;
  dataLoggerSerial: string;
  calibrationExpires: string;
  readings: TempReading[];
  status: FridgeStatus;
};

export type SimActivity = {
  time: string;
  action: string;
  detail: string;
  user: string;
};

export type SimInsight = {
  id: string;
  type: "prediction" | "anomaly" | "recommendation" | "outbreak" | "cost-saving";
  severity: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  timestamp: string;
  actionable: boolean;
  suggestedAction?: string;
  impact?: string;
};

export type ExcursionPhase = "idle" | "rising" | "excursion" | "resolving" | "resolved";

export type ExcursionReportAction = {
  /** sim-time ms */
  tMs: number;
  text: string;
};

export type ExcursionReport = {
  id: string;
  status: "active" | "resolved";
  unitId: string;
  siteName: string;
  loggerModel: string;
  loggerSerial: string;
  calibrationExpires: string;
  alarmHighF: number;
  startedAtMs: number;
  resolvedAtMs: number | null;
  peakTempF: number;
  doseCount: number;
  lotCount: number;
  estValueUsd: number;
  actions: ExcursionReportAction[];
  reportedToMyCAVax: boolean;
};

type SimulationContextValue = {
  /** Current simulated wall-clock. */
  simNow: Date;
  fridges: FridgeSim[];
  /** Any unit currently in alert or excursion. */
  coldChainAlertCount: number;
  excursionActive: boolean;
  excursionPhase: ExcursionPhase;
  /** Scripted scenario controls (Demo Director). */
  triggerExcursion: () => void;
  resolveExcursion: () => void;
  resetSimulation: () => void;
  /** Items injected by scenarios, for merging into page feeds. */
  simActivities: SimActivity[];
  simInsights: SimInsight[];
  /** Formal record of the current/last excursion (CDPH/MyCAVax-style). */
  excursionReport: ExcursionReport | null;
};

// ---- Seeded PRNG so SSR + client agree --------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashKey(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---- Baseline series generation ---------------------------------------

const STEP_MS = 10 * 60 * 1000; // one reading per 10 sim-minutes
const WINDOW_MS = 48 * 60 * 60 * 1000; // keep 48h of history
const TICK_REAL_MS = 4000; // real seconds per tick
const TICK_SIM_MS = 10 * 60 * 1000; // each tick advances sim 10 min

function generateBaseline(
  key: string,
  baseTemp: number,
  endMs: number,
  opts?: { driftTo?: number; driftHours?: number }
): TempReading[] {
  const rand = mulberry32(hashKey(key));
  const points = Math.floor(WINDOW_MS / STEP_MS);
  const readings: TempReading[] = [];
  let doorSpike = 0;
  for (let i = 0; i <= points; i++) {
    const t = endMs - (points - i) * STEP_MS;
    const hourOfDay = new Date(t).getHours() + new Date(t).getMinutes() / 60;
    // Gentle daily cycle (compressor/ambient), small sensor noise
    const daily = 0.5 * Math.sin(((hourOfDay - 4) / 24) * Math.PI * 2);
    const noise = (rand() - 0.5) * 0.7;
    // Occasional door-open events during clinic hours
    if (doorSpike <= 0 && hourOfDay > 8 && hourOfDay < 18 && rand() < 0.045) {
      doorSpike = 1.8 + rand() * 1.4;
    }
    const spike = Math.max(0, doorSpike);
    doorSpike *= 0.55;
    // Optional slow upward drift over the trailing N hours (failing seal)
    let drift = 0;
    if (opts?.driftTo !== undefined) {
      const driftMs = (opts.driftHours ?? 16) * 60 * 60 * 1000;
      const start = endMs - driftMs;
      if (t > start) {
        const p = (t - start) / driftMs;
        drift = (opts.driftTo - baseTemp) * p;
      }
    }
    readings.push({
      t,
      tempF: Math.round((baseTemp + daily + noise + spike + drift) * 10) / 10,
    });
  }
  return readings;
}

function statusFor(
  f: Pick<FridgeSim, "alarmLowF" | "alarmHighF">,
  latest: number
): FridgeStatus {
  if (latest > f.alarmHighF || latest < f.alarmLowF) return "excursion";
  // within 3°F of the high alarm (or 1°F of the low) = approaching
  if (latest > f.alarmHighF - 3 || latest < f.alarmLowF + 1) return "alert";
  return "normal";
}

// The scripted scenario targets this unit (Martinez Wellness VFC fridge).
export const EXCURSION_UNIT_ID = "VFC-FR-MWC-01";

// ---- Context ----------------------------------------------------------

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant();
  const { showToast } = useToast();

  // Build the unit roster from tenant cold chain + equipment registry.
  const roster = useMemo(() => {
    const units: Omit<FridgeSim, "readings" | "status">[] = [];
    for (const site of tenant.coldChain) {
      for (const fridge of site.fridges) {
        const unitId =
          fridge.type === "VFC"
            ? `VFC-FR-${site.siteId === "ccrmc" ? "CCRMC" : site.siteId === "martinez-health" ? "MHC" : "MWC"}-01`
            : `PRIV-FR-${site.siteId === "ccrmc" ? "CCRMC" : site.siteId === "martinez-health" ? "MHC" : "MWC"}-01`;
        const equip = tenant.vfcEquipment.find((e) => e.unitId === unitId);
        units.push({
          key: `${site.siteId}-${fridge.type}`,
          unitId,
          siteId: site.siteId,
          siteName: site.siteName,
          kind: fridge.type,
          doseCount: fridge.doseCount,
          lotCount: fridge.lotCount,
          alarmLowF: equip?.alarmLowF ?? 36,
          alarmHighF: equip?.alarmHighF ?? 46,
          dataLoggerModel: equip?.dataLoggerModel ?? "LogTag UTRIX-16",
          dataLoggerSerial: equip?.dataLoggerSerial ?? "—",
          calibrationExpires: equip?.calibrationExpires ?? "—",
        });
      }
    }
    // CCRMC pharmacy vaccine freezer from the equipment registry
    const freezer = tenant.vfcEquipment.find((e) => e.type === "Freezer");
    if (freezer) {
      units.push({
        key: "ccrmc-Freezer",
        unitId: freezer.unitId,
        siteId: "ccrmc",
        siteName: "Contra Costa Regional Medical Center",
        kind: "Freezer",
        doseCount: 164,
        lotCount: 6,
        alarmLowF: freezer.alarmLowF,
        alarmHighF: freezer.alarmHighF,
        dataLoggerModel: freezer.dataLoggerModel,
        dataLoggerSerial: freezer.dataLoggerSerial,
        calibrationExpires: freezer.calibrationExpires,
      });
    }
    return units;
  }, [tenant]);

  // Baseline series (deterministic).
  const initialFridges = useMemo<FridgeSim[]>(() => {
    const endMs = DEMO_NOW.getTime();
    return roster.map((u) => {
      const site = tenant.coldChain.find((s) => s.siteId === u.siteId);
      const cfgTemp =
        u.kind === "Freezer"
          ? 0
          : site?.fridges.find((f) => f.type === u.kind)?.tempF ?? 40;
      // MWC VFC fridge: slow drift up to its configured 43°F (failing seal story)
      const isDrifting = u.unitId === EXCURSION_UNIT_ID;
      const base = isDrifting ? 40.2 : cfgTemp;
      const readings = generateBaseline(
        u.key,
        base,
        endMs,
        isDrifting ? { driftTo: cfgTemp, driftHours: 16 } : undefined
      );
      const latest = readings[readings.length - 1].tempF;
      return { ...u, readings, status: statusFor(u, latest) };
    });
  }, [roster, tenant]);

  const [fridges, setFridges] = useState<FridgeSim[]>(initialFridges);
  const [simNowMs, setSimNowMs] = useState<number>(DEMO_NOW.getTime());
  const [excursionPhase, setExcursionPhase] = useState<ExcursionPhase>("idle");
  const [simActivities, setSimActivities] = useState<SimActivity[]>([]);
  const [simInsights, setSimInsights] = useState<SimInsight[]>([]);
  const [excursionReport, setExcursionReport] = useState<ExcursionReport | null>(null);

  // Refs so the tick interval sees current values without re-subscribing.
  const phaseRef = useRef<ExcursionPhase>("idle");
  phaseRef.current = excursionPhase;
  const simNowRef = useRef(simNowMs);
  simNowRef.current = simNowMs;
  const crossedRef = useRef(false);

  // ---- Scenario persistence: survive a hard reload mid-demo ----
  // (client-only, after hydration, so SSR markup stays deterministic)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hc_sim_v1");
      if (!raw) return;
      const stored = JSON.parse(raw) as {
        phase: ExcursionPhase;
        activities: SimActivity[];
        insights: SimInsight[];
        report?: ExcursionReport | null;
      };
      if (stored.phase && stored.phase !== "idle") {
        // Past the alarm crossing? Don't re-fire the toast/insight.
        crossedRef.current = stored.phase !== "rising";
        setExcursionPhase(stored.phase);
        setSimActivities(stored.activities ?? []);
        setSimInsights(stored.insights ?? []);
        setExcursionReport(stored.report ?? null);
      }
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "hc_sim_v1",
        JSON.stringify({
          phase: excursionPhase,
          activities: simActivities,
          insights: simInsights,
          report: excursionReport,
        })
      );
    } catch {
      // storage full/unavailable — nonfatal
    }
  }, [excursionPhase, simActivities, simInsights, excursionReport]);

  const fmtSimTime = useCallback((ms: number) => {
    return new Date(ms).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, []);

  // ---- Live tick ----
  useEffect(() => {
    const interval = setInterval(() => {
      const nextMs = simNowRef.current + TICK_SIM_MS;
      setSimNowMs(nextMs);

      setFridges((prev) =>
        prev.map((f) => {
          const rand = Math.random;
          const last = f.readings[f.readings.length - 1].tempF;
          const site = tenant.coldChain.find((s) => s.siteId === f.siteId);
          const baseTarget =
            f.kind === "Freezer"
              ? 0
              : site?.fridges.find((ff) => ff.type === f.kind)?.tempF ?? 40;

          let target = baseTarget;
          const phase = phaseRef.current;
          const isTargetUnit = f.unitId === EXCURSION_UNIT_ID;
          if (isTargetUnit) {
            if (phase === "rising" || phase === "excursion") target = 48.2;
            else if (phase === "resolving") target = 39.5;
            else if (phase === "resolved") target = 39.5;
          }

          // Move toward target with noise; scenario ramps move faster.
          const rate =
            isTargetUnit && (phase === "rising" || phase === "resolving")
              ? 0.35
              : 0.12;
          const noise = (rand() - 0.5) * 0.5;
          const next =
            Math.round((last + (target - last) * rate + noise) * 10) / 10;

          const readings = [...f.readings, { t: nextMs, tempF: next }].filter(
            (r) => r.t >= nextMs - WINDOW_MS
          );
          return { ...f, readings, status: statusFor(f, next) };
        })
      );
    }, TICK_REAL_MS);
    return () => clearInterval(interval);
  }, [tenant]);

  // ---- Scenario transitions (watch the target unit's latest temp) ----
  const targetFridge = fridges.find((f) => f.unitId === EXCURSION_UNIT_ID);
  const targetTemp = targetFridge?.readings[targetFridge.readings.length - 1]?.tempF;

  useEffect(() => {
    if (targetTemp === undefined || !targetFridge) return;

    // Track the peak temperature for the excursion report.
    if (
      (excursionPhase === "excursion" || excursionPhase === "resolving") &&
      excursionReport &&
      targetTemp > excursionReport.peakTempF
    ) {
      setExcursionReport((r) => (r ? { ...r, peakTempF: targetTemp } : r));
    }

    // Rising → crossed the high alarm: fire the excursion event once.
    if (excursionPhase === "rising" && targetTemp > targetFridge.alarmHighF && !crossedRef.current) {
      crossedRef.current = true;
      setExcursionPhase("excursion");
      const nowMs = simNowRef.current;
      setExcursionReport({
        id: "EXC-2026-CC-001",
        status: "active",
        unitId: targetFridge.unitId,
        siteName: targetFridge.siteName,
        loggerModel: targetFridge.dataLoggerModel,
        loggerSerial: targetFridge.dataLoggerSerial,
        calibrationExpires: targetFridge.calibrationExpires,
        alarmHighF: targetFridge.alarmHighF,
        startedAtMs: nowMs,
        resolvedAtMs: null,
        peakTempF: targetTemp,
        doseCount: targetFridge.doseCount,
        lotCount: targetFridge.lotCount,
        estValueUsd: 14200,
        reportedToMyCAVax: false,
        actions: [
          { tMs: nowMs, text: `Continuous data logger recorded ${targetTemp.toFixed(1)}°F — high alarm (${targetFridge.alarmHighF}°F) exceeded` },
          { tMs: nowMs, text: "AI response plan issued: relocate VFC stock to backup unit, mark doses DO NOT USE pending viability review, dispatch Follett Service for door seal" },
        ],
      });
      const at = fmtSimTime(simNowRef.current);
      showToast(
        `TEMP EXCURSION — Martinez Wellness VFC fridge at ${targetTemp.toFixed(1)}°F (limit 46°F)`,
        "warning"
      );
      setSimInsights((prev) => [
        {
          id: "SIM-EXC-01",
          type: "anomaly",
          severity: "high",
          title: "Cold Chain Excursion — Martinez Wellness VFC Fridge",
          description: `Unit ${EXCURSION_UNIT_ID} exceeded its 46°F high alarm at ${at} and is still climbing. Temperature has been trending upward for ~16 hours — pattern is consistent with a failing door seal, not a door-open event. ${targetFridge.doseCount} VFC doses across ${targetFridge.lotCount} lots are at risk (est. value $14,200).`,
          timestamp: new Date(simNowRef.current).toISOString(),
          actionable: true,
          suggestedAction:
            "Move all VFC stock to the backup unit at Martinez Health Center now. Mark affected doses 'DO NOT USE' pending viability review, log the excursion in MyCAVax, and dispatch Follett Service (authorized vendor) for the door seal.",
          impact: `${targetFridge.doseCount} doses / ~$14,200 at risk — excursion logged for CDPH reporting`,
        },
        ...prev,
      ]);
      setSimActivities((prev) => [
        {
          time: at,
          action: "Cold chain alert",
          detail: `${EXCURSION_UNIT_ID} high-temp alarm — ${targetTemp.toFixed(1)}°F, ${targetFridge.doseCount} VFC doses at risk (Martinez Wellness)`,
          user: "LogTag UTRIX-16 · continuous monitor",
        },
        ...prev,
      ]);
    }

    // Resolving → back inside range: mark resolved once.
    if (excursionPhase === "resolving" && targetTemp <= targetFridge.alarmHighF - 3) {
      setExcursionPhase("resolved");
      const at = fmtSimTime(simNowRef.current);
      const nowMs = simNowRef.current;
      setExcursionReport((r) =>
        r
          ? {
              ...r,
              status: "resolved",
              resolvedAtMs: nowMs,
              reportedToMyCAVax: true,
              actions: [
                ...r.actions,
                { tMs: nowMs, text: `All ${r.doseCount} VFC doses relocated to Martinez Health Center backup unit (VFC-FR-MHC-01)` },
                { tMs: nowMs, text: "Unit back within range — excursion closed; temperatures verified by continuous logger" },
                { tMs: nowMs, text: "Excursion reported in MyCAVax · viability review opened per CDPH storage & handling guidance" },
              ],
            }
          : r
      );
      showToast("Excursion resolved — doses relocated, unit recovering", "success");
      setSimActivities((prev) => [
        {
          time: at,
          action: "Transfer completed",
          detail: `${targetFridge.doseCount} VFC doses relocated to Martinez Health Center backup unit — excursion logged in MyCAVax, viability review opened`,
          user: "M. Gutierrez, RN (Vaccine Coordinator)",
        },
        ...prev,
      ]);
      setSimInsights((prev) =>
        prev.map((i) =>
          i.id === "SIM-EXC-01"
            ? {
                ...i,
                severity: "medium" as const,
                title: "Cold Chain Excursion — Contained (Martinez Wellness)",
                impact: "Doses relocated within 22 min of alarm — $14,200 in stock protected",
              }
            : i
        )
      );
    }
  }, [targetTemp, excursionPhase, targetFridge, excursionReport, showToast, fmtSimTime]);

  // ---- Scenario controls ----
  const triggerExcursion = useCallback(() => {
    crossedRef.current = false;
    setExcursionPhase("rising");
    showToast("Scenario armed: Martinez Wellness VFC fridge temperature rising…", "info");
  }, [showToast]);

  const resolveExcursion = useCallback(() => {
    setExcursionPhase("resolving");
    const nowMs = simNowRef.current;
    setExcursionReport((r) =>
      r
        ? {
            ...r,
            actions: [
              ...r.actions,
              { tMs: nowMs, text: "Transfer to backup unit initiated by M. Gutierrez, RN (Vaccine Coordinator)" },
            ],
          }
        : r
    );
  }, []);

  const resetSimulation = useCallback(() => {
    crossedRef.current = false;
    setExcursionPhase("idle");
    setSimActivities([]);
    setSimInsights([]);
    setExcursionReport(null);
    setFridges(initialFridges);
    setSimNowMs(DEMO_NOW.getTime());
    try {
      sessionStorage.removeItem("hc_sim_v1");
    } catch {}
  }, [initialFridges]);

  const coldChainAlertCount = fridges.filter((f) => f.status !== "normal").length;

  const value: SimulationContextValue = {
    simNow: new Date(simNowMs),
    fridges,
    coldChainAlertCount,
    excursionActive: excursionPhase === "rising" || excursionPhase === "excursion",
    excursionPhase,
    triggerExcursion,
    resolveExcursion,
    resetSimulation,
    simActivities,
    simInsights,
    excursionReport,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside <SimulationProvider>");
  return ctx;
}
