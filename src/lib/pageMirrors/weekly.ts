import {
  WEEKLY_DESCRIPTION,
  WEEKLY_FEED_PATH,
  WEEKLY_H1,
  WEEKLY_PATH,
  weekHeading,
  weekPath,
  weekSummary,
  weeklyCapsule,
  weeklyDataDate,
  weeklyMethodLines,
  weeks,
} from "@/lib/weekly";
import { link, type MirrorDoc } from "./core";

/** /weekly.md — mirrors src/app/weekly/page.tsx from the same module. */
export function weeklyMirror(): MirrorDoc {
  return {
    path: WEEKLY_PATH,
    title: WEEKLY_H1,
    description: WEEKLY_DESCRIPTION,
    updated: weeklyDataDate() ?? "",
    type: "record",
    capsule: weeklyCapsule(),
    body: [
      `${link("RSS feed", WEEKLY_FEED_PATH)} · ${link("The monthly digest", "/digest")} · ${link("Changes and deadlines", "/changes")}`,
      "",
      "## Every week with a roundup",
      "",
      ...weeks().map((w) => `- ${link(weekHeading(w), weekPath(w.id))}: ${weekSummary(w)}`),
      "",
      "## How the roundup is made",
      "",
      ...weeklyMethodLines().map((l) => `- ${l}`),
    ],
  };
}
