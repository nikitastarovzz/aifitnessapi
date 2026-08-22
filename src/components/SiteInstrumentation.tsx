"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import CtaTracker from "@/components/CtaTracker";
import WebVitals from "@/components/WebVitals";

/**
 * Analytics, CTA tracking and field vitals — but never inside an embed.
 *
 * The widgets under /embed are designed to be iframed into other people's
 * pages. Instrumentation that is entirely reasonable on our own site becomes
 * something else when it rides along into somebody else's: their visitors did
 * not come here, and firing our beacons from their page is not ours to do.
 * The root layout cannot know the path (it would have to become dynamic), so
 * the gate lives here, in the client, where the path is free to read.
 */
export default function SiteInstrumentation() {
  // Decided after mount, not during render: the server cannot see the path,
  // so a render-time check would disagree with the client and produce a
  // hydration mismatch. Everything here is effect-driven anyway, so mounting
  // one tick later costs nothing.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(!window.location.pathname.startsWith("/embed/"));
  }, []);
  if (!enabled) return null;
  return (
    <>
      <CtaTracker />
      <Analytics />
      <WebVitals />
    </>
  );
}
