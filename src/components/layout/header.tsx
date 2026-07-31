"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/ui/global-search";
import { recentActivity } from "@/lib/mock-data";
import { DEMO_NOW } from "@/lib/demo-time";

function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeCount = recentActivity.length - dismissed.size;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-background transition-colors"
      >
        <Bell className="w-5 h-5 text-muted" />
        {activeCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-danger border-2 border-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden modal-panel">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {dismissed.size < recentActivity.length && (
              <button
                onClick={() => setDismissed(new Set(recentActivity.map((_, i) => i)))}
                className="text-[11px] text-primary font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className={cn(
                  "px-4 py-3 border-b border-border/50 last:border-0 hover:bg-stone-50/50 transition-colors",
                  dismissed.has(i) && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-foreground">{a.action}</span>
                  <span className="text-[11px] text-muted">{a.time}</span>
                </div>
                <p className="text-[11px] text-muted">{a.detail}</p>
                <p className="text-[11px] text-muted mt-0.5">{a.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  // The demo dataset is anchored to a fixed date — showing the real
  // date would contradict every timestamp on screen.
  const today = DEMO_NOW.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-border">
      <div>
        <h1 className="text-xl font-semibold text-foreground font-display">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
        <GlobalSearch />
        <NotificationsDropdown />
      </div>
    </header>
  );
}
