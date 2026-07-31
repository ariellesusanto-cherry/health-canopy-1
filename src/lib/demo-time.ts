// ============================================================
// Canonical demo clock — the single "now" for the entire app.
// Every date in mock data is anchored relative to this moment:
// Monday, March 16, 2026, 12:05 PM (Pacific).
// If you shift the demo period, change this constant and sweep
// mock-data.ts / tenants.ts for dates that should move with it.
// ============================================================

export const DEMO_NOW = new Date("2026-03-16T12:05:00");

/** Days from DEMO_NOW to a date string (negative = past). */
export function daysFromNow(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.round((d.getTime() - DEMO_NOW.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDemoDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
