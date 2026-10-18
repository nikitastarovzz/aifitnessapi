import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { WT_FETCHED, hubTotals } from "@/data/workoutTypePages";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Workout types on HealthKit, Health Connect, Wear OS and the Google Health API";

export default function Image() {
  const t = hubTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Reference · Health data",
      title: "Workout Types Across Four Platforms",
      line: `${t.constants} constants · ${t.rows} crosswalk rows · ${t.onAll} on all four · read ${WT_FETCHED}`,
    }),
    { ...OG_SIZE },
  );
}
