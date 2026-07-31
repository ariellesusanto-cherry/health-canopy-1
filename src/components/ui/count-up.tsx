"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Animates the numeric portion of a formatted KPI string on mount.
// Handles values like "18,470", "$842K", "94.2%", "12.8x", "34".
export function CountUp({
  value,
  duration = 750,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/^([^0-9-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : 0;
  const decimals = match ? (match[2].split(".")[1] ?? "").length : 0;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - p, 3)); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  if (!match) return <span className={className}>{value}</span>;

  const display = (target * progress).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn("tabular-nums", className)}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
}
