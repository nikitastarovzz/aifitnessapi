"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number for the hero stat strip. Server HTML carries the final
 * value (SEO/no-JS safe); JS restarts from 0 and eases up. Reduced-motion
 * users keep the static value. tabular-nums prevents width jitter.
 */
export default function StatCounter({
  value,
  suffix = "",
  durationMs = 900,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [value, durationMs]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
