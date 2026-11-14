"use client";

import { useEffect } from "react";
import { rememberPicker } from "@/lib/track";
import { pickerAnswerId } from "@/lib/measure.mjs";

/**
 * Renders nothing. Mounted wherever a picker answer is on screen (the
 * /picker result and the /s share page), it stores that answer's id for the
 * rest of the browser session, so later cta_click and funder_click events
 * carry it as `picker` (ops/MEASUREMENT.md). Sends no event of its own.
 */
export default function PickerSeen({ job, platform, priority }: { job: string; platform: string; priority: string }) {
  useEffect(() => {
    rememberPicker(pickerAnswerId(job, platform, priority));
  }, [job, platform, priority]);
  return null;
}
