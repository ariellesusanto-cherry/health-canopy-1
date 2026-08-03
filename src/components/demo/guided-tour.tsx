"use client";

// ============================================================
// Guided product tour — first-run coach marks.
// ------------------------------------------------------------
// Auto-starts once per role after sign-in (localStorage flag),
// walks the user across pages with a spotlight + card, and can
// be relaunched anytime via the sidebar profile menu (which
// dispatches the "hc-start-tour" window event).
//
// Targets are marked with data-tour="<id>" attributes. Steps may
// declare a route; the tour navigates there and waits for the
// target element before showing the card.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-context";
import type { RoleId } from "@/lib/roles";

type TourStep = {
  /** data-tour attribute value; omit for a centered modal step */
  target?: string;
  /** Route to be on for this step */
  route?: string;
  title: string;
  body: string;
};

const TOURS: Record<RoleId, TourStep[]> = {
  "supply-chain-manager": [
    {
      route: "/",
      title: "Welcome to Health Canopy",
      body: "One platform for Contra Costa Health's supply chain, vaccine management, cold chain, and compliance — replacing four disconnected point solutions. This 60-second tour hits the highlights. Restart it anytime from your profile menu.",
    },
    {
      route: "/",
      target: "kpis",
      title: "The whole system at a glance",
      body: "18,470 SKUs across CCRMC and the Martinez clinics, with 7 more county health centers onboarding. These numbers are live — they always agree with the detail pages.",
    },
    {
      route: "/",
      target: "attention",
      title: "What needs you right now",
      body: "Not just med/surg shortages — the VFC badges are short-dated vaccine lots, each with the CDPH-recommended action: use first per FIFO, or transfer to another VFC provider via MyCAVax.",
    },
    {
      route: "/",
      target: "cold-chain-live",
      title: "Cold chain, live on the dashboard",
      body: "Continuous telemetry from every vaccine storage unit. Keep an eye on the Martinez Wellness VFC fridge — it's been trending warm for hours.",
    },
    {
      route: "/cold-chain",
      target: "cold-chain-detail",
      title: "Goodbye, paper temperature logs",
      body: "Every unit logs a reading every 10 minutes to a calibrated digital data logger. 48-hour strip charts with the 36–46°F safe band, alarm lines, min/max stats, and calibration countdowns — always CDPH-audit-ready.",
    },
    {
      route: "/vaccine-management",
      target: "scan-inspector",
      title: "One scan, five systems",
      body: "A nurse scans the vial barcode once. That scan posts to ccLink (Epic), submits to CAIR2, decrements the right fridge, logs to MyCAVax, and writes the audit trail. Zero double entry — expand a scan to see the fan-out.",
    },
    {
      route: "/forecasting",
      target: "scenarios",
      title: "See problems before they happen",
      body: "What-if scenarios model a respiratory surge or a supplier disruption — with stockout risk, cost impact, and AI pre-order recommendations down to quantities and suppliers.",
    },
    {
      route: "/forecasting",
      target: "ai-assistant",
      title: "Ask the AI anything",
      body: "The assistant queries the same live data you see on screen — inventory, cold chain telemetry, VFC records, POs, compliance. Try \"Which fridge should I be worried about?\"",
    },
    {
      route: "/forecasting",
      target: "demo-director",
      title: "For presenters: the Demo Director",
      body: "Trigger a live fridge excursion and watch it propagate — chart spike, sidebar badge, AI insight, activity feed — then resolve it with one click. Toggle with Shift+D. Enjoy the demo!",
    },
  ],
  "nurse-unit-coordinator": [
    {
      route: "/unit",
      title: "Welcome — your unit, your view",
      body: "Health Canopy scopes everything to your unit: stock, alerts, deliveries, and vaccine fridges. No system-wide noise, no finance dashboards — just what you need at the point of use.",
    },
    {
      route: "/unit",
      target: "unit-summary",
      title: "Your unit's stock at a glance",
      body: "Items tracked, low stock, critical, and out-of-stock counts for your unit. Use the unit selector above to switch if you cover multiple areas.",
    },
    {
      route: "/unit",
      target: "unit-fridges",
      title: "Vaccine fridges, live",
      body: "Live temperatures for every vaccine fridge, updated continuously from the data loggers. Amber means approaching the limit — tap through for the full charts.",
    },
    {
      route: "/inventory",
      target: "inv-summary",
      title: "Inventory — scoped to you",
      body: "The inventory view shows only your unit's items. Request restocks and flag stockouts right from the list. That's the tour — you're set!",
    },
  ],
  executive: [
    {
      route: "/executive",
      title: "Welcome — the executive view",
      body: "A single read-only page for leadership: KPIs, compliance readiness, critical alerts, and site-level rollout status across Contra Costa Health. No actions, no drill-downs — just the state of the system.",
    },
    {
      route: "/executive",
      target: "exec-readiness",
      title: "Compliance readiness, continuously",
      body: "Joint Commission readiness is monitored continuously across all 7 chapters — not assembled once a year before a survey.",
    },
    {
      route: "/executive",
      target: "exec-sites",
      title: "The path to full-county coverage",
      body: "Three sites live today; seven county health centers onboarding — Antioch, Pittsburg, Concord, San Pablo, Brentwood, North Richmond, and Bay Point.",
    },
    {
      route: "/budget",
      target: "fin-kpis",
      title: "Financials — visibility without the levers",
      body: "Budget vs. actual, inventory value, pending POs, and delivery costs — full transparency, but approvals and order actions stay with the supply chain team. Read-only by design. That's the tour.",
    },
  ],
};

const doneKey = (roleId: RoleId) => `hc_tour_done_${roleId}`;

export function GuidedTour() {
  const { role, roleId } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [ready, setReady] = useState(false);
  // Tracks which role we've already auto-started for, so switching
  // personas re-arms the first-run tour.
  const autoStartedRef = useRef<string | null>(null);

  const steps = roleId ? TOURS[roleId] : null;
  const step = active && steps ? steps[stepIndex] : null;

  // ---- Auto-start once per role, after landing ----
  useEffect(() => {
    if (!role || !roleId || active || autoStartedRef.current === roleId) return;
    if (pathname !== role.landingRoute) return;
    try {
      if (localStorage.getItem(doneKey(roleId))) return;
    } catch {
      return;
    }
    autoStartedRef.current = roleId;
    const t = setTimeout(() => {
      setStepIndex(0);
      setActive(true);
    }, 900);
    return () => clearTimeout(t);
  }, [role, roleId, pathname, active]);

  // ---- Relaunch via window event (profile menu) ----
  useEffect(() => {
    function onStart() {
      setStepIndex(0);
      setActive(true);
    }
    window.addEventListener("hc-start-tour", onStart);
    return () => window.removeEventListener("hc-start-tour", onStart);
  }, []);

  const finish = useCallback(
    (completed: boolean) => {
      setActive(false);
      setRect(null);
      setReady(false);
      if (roleId) {
        try {
          localStorage.setItem(doneKey(roleId), completed ? "done" : "skipped");
        } catch {}
      }
    },
    [roleId]
  );

  // ---- Navigate + locate target for the current step ----
  useEffect(() => {
    if (!step) return;
    setReady(false);
    setRect(null);

    if (step.route && pathname !== step.route) {
      router.push(step.route);
      return; // effect re-runs when pathname updates
    }

    if (!step.target) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let tries = 0;
    const locate = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        // Fixed-position targets (floating buttons) are always on screen —
        // scrolling to them would drag the document to the page bottom.
        const isFixed = getComputedStyle(el).position === "fixed";
        if (!isFixed) el.scrollIntoView({ block: "center", behavior: "smooth" });
        // wait for the scroll to settle before measuring
        setTimeout(() => {
          if (cancelled) return;
          setRect(el.getBoundingClientRect());
          setReady(true);
        }, isFixed ? 50 : 500);
      } else if (tries < 40) {
        tries += 1;
        setTimeout(locate, 100);
      } else {
        // Target never appeared — skip forward rather than hang.
        setReady(true);
      }
    };
    locate();
    return () => {
      cancelled = true;
    };
  }, [step, pathname, router]);

  // ---- Keep the spotlight glued to the target (live pages, resizes) ----
  useEffect(() => {
    if (!step?.target || !ready) return;
    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };
    const interval = setInterval(measure, 350);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, ready]);

  // ---- Esc to exit ----
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  if (!active || !steps || !step) return null;

  const isLast = stepIndex === steps.length - 1;
  const spotlight = ready && rect && step.target;

  // Card placement: below the target when there's room, else above; centered steps in the middle.
  const cardWidth = 340;
  let cardStyle: React.CSSProperties;
  if (!spotlight) {
    cardStyle = {
      left: "50%",
      top: "45%",
      transform: "translate(-50%, -50%)",
    };
  } else {
    const spaceBelow = window.innerHeight - rect.bottom;
    const rawTop = spaceBelow > 240 ? rect.bottom + 14 : rect.top - 232;
    const top = Math.min(Math.max(16, rawTop), window.innerHeight - 260);
    const left = Math.min(
      Math.max(16, rect.left + rect.width / 2 - cardWidth / 2),
      window.innerWidth - cardWidth - 16
    );
    cardStyle = { left, top };
  }

  return (
    <div className="fixed inset-0 z-[105]" aria-live="polite">
      {/* Dim / spotlight layer */}
      {spotlight ? (
        <div
          className="absolute rounded-xl transition-all duration-300 pointer-events-none"
          style={{
            left: rect.left - 6,
            top: rect.top - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(28, 16, 8, 0.55)",
            border: "2px solid rgba(203, 126, 94, 0.9)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[rgba(28,16,8,0.55)] transition-opacity" />
      )}

      {/* Click-catcher so the page underneath isn't interactive mid-tour */}
      <div className="absolute inset-0" onClick={() => {}} />

      {/* Card */}
      <div
        className="absolute w-[340px] rounded-2xl bg-white border border-border shadow-2xl p-5 card-enter"
        style={cardStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </span>
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {step.title}
            </h3>
          </div>
          <button
            onClick={() => finish(false)}
            aria-label="Close tour"
            className="p-1 rounded hover:bg-stone-100 text-muted shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed mt-2.5">{step.body}</p>

        <div className="flex items-center justify-between mt-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  i === stepIndex
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-stone-200"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex((i) => i - 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-stone-50"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
            <button
              onClick={() => (isLast ? finish(true) : setStepIndex((i) => i + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {stepIndex === 0 && (
          <button
            onClick={() => finish(false)}
            className="mt-2.5 text-[11px] text-muted hover:text-foreground underline-offset-2 hover:underline"
          >
            Skip the tour
          </button>
        )}
      </div>
    </div>
  );
}

/** Dispatch from anywhere (e.g. profile menu) to relaunch the tour. */
export function startGuidedTour() {
  window.dispatchEvent(new Event("hc-start-tour"));
}
