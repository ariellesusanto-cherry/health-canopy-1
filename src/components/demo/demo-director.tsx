"use client";

// ============================================================
// Demo Director — presenter-only control for scripted scenarios.
// Discreet button bottom-left; also toggled with Shift+D.
// Drives the simulation context so a triggered event propagates
// to every page (cold chain chart, dashboard, activity feed).
// ============================================================

import { useEffect, useState } from "react";
import {
  Clapperboard,
  ThermometerSun,
  ArrowRightLeft,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/lib/simulation";

export function DemoDirector() {
  const [open, setOpen] = useState(false);
  const {
    excursionPhase,
    triggerExcursion,
    resolveExcursion,
    resetSimulation,
  } = useSimulation();

  // Shift+D toggles the panel (ignore while typing in inputs)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const phaseLabel: Record<string, string> = {
    idle: "Standing by",
    rising: "Temperature rising…",
    excursion: "EXCURSION ACTIVE",
    resolving: "Doses in transfer…",
    resolved: "Resolved",
  };

  return (
    // Sits just right of the sidebar so it never covers the user slot.
    <div className="fixed bottom-6 left-[17.5rem] z-[90]">
      {open && (
        <div className="mb-2 w-72 rounded-xl border border-border bg-white shadow-2xl overflow-hidden card-enter">
          <div className="flex items-center justify-between px-4 py-3 bg-sidebar-bg">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">
                Demo Director
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5 text-white/70" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted uppercase tracking-wide">
                Cold chain scenario
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  excursionPhase === "excursion"
                    ? "bg-red-100 text-red-700 pulse-dot"
                    : excursionPhase === "rising"
                      ? "bg-amber-50 text-amber-700"
                      : excursionPhase === "resolved"
                        ? "bg-accent/10 text-accent"
                        : "bg-stone-100 text-stone-600"
                )}
              >
                {phaseLabel[excursionPhase]}
              </span>
            </div>

            <button
              onClick={triggerExcursion}
              disabled={excursionPhase !== "idle" && excursionPhase !== "resolved"}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ThermometerSun className="w-4 h-4" />
              Trigger fridge excursion
              <span className="ml-auto text-[10px] text-red-400">MWC VFC</span>
            </button>

            <button
              onClick={resolveExcursion}
              disabled={excursionPhase !== "excursion"}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-accent/30 bg-accent/5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Move doses to backup unit
            </button>

            <button
              onClick={resetSimulation}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border text-xs font-medium text-muted hover:bg-stone-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset simulation
            </button>

            <p className="text-[10px] text-muted leading-relaxed">
              The excursion propagates live: Cold Chain chart → sidebar badge →
              dashboard AI insight → activity feed. Toggle this panel with{" "}
              <kbd className="px-1 py-0.5 rounded bg-stone-100 border border-border font-mono">
                Shift+D
              </kbd>
              .
            </p>
          </div>
        </div>
      )}

      <button
        data-tour="demo-director"
        onClick={() => setOpen((v) => !v)}
        title="Demo Director (Shift+D)"
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg",
          open
            ? "bg-sidebar-bg text-white"
            : "bg-white/80 text-stone-400 border border-border hover:text-stone-600 hover:bg-white"
        )}
      >
        <Clapperboard className="w-4 h-4" />
      </button>
    </div>
  );
}
