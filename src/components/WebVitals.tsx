"use client";

import { useEffect } from "react";

/**
 * Field performance, sampled. The perf budget in CI measures one machine on
 * one network; it cannot see a mid-range Android on a train, which is the
 * device most likely to leave. This reports what real visits actually
 * experienced.
 *
 * Deliberately not the web-vitals library: LCP, CLS and TTFB come straight
 * from PerformanceObserver in about thirty lines, and a dependency that ships
 * to every visitor to measure how fast the page is has to justify its own
 * weight. Everything is sent once, at the end of the visit, via sendBeacon —
 * no polling, no timers, nothing running while the page sits idle.
 *
 * Sampled at 10%: enough to see a regression, few enough writes to stay free.
 * Nothing identifying is sent — path, three numbers, and a coarse
 * connection type.
 */
const SAMPLE = 0.1;

type NetworkInformation = { effectiveType?: string };

export default function WebVitals() {
  useEffect(() => {
    if (Math.random() > SAMPLE) return;

    let lcp = 0;
    let cls = 0;
    const observers: PerformanceObserver[] = [];

    const observe = (type: string, cb: (list: PerformanceObserverEntryList) => void) => {
      try {
        const po = new PerformanceObserver(cb);
        po.observe({ type, buffered: true });
        observers.push(po);
      } catch {
        /* unsupported entry type — skip that metric rather than break */
      }
    };

    observe("largest-contentful-paint", (list) => {
      const last = list.getEntries().at(-1);
      if (last) lcp = last.startTime;
    });
    observe("layout-shift", (list) => {
      for (const e of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!e.hadRecentInput) cls += e.value;
      }
    });

    let sent = false;
    const send = () => {
      if (sent || document.visibilityState !== "hidden") return;
      sent = true;
      for (const po of observers) po.disconnect();
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      const body = JSON.stringify({
        path: location.pathname,
        lcp: Math.round(lcp),
        cls: Math.round(cls * 1000) / 1000,
        ttfb: nav ? Math.round(nav.responseStart) : 0,
        conn: conn?.effectiveType ?? "",
      });
      navigator.sendBeacon?.("/api/vitals", new Blob([body], { type: "application/json" }));
    };

    document.addEventListener("visibilitychange", send);
    return () => {
      document.removeEventListener("visibilitychange", send);
      for (const po of observers) po.disconnect();
    };
  }, []);

  return null;
}
