import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedMigrate, MIGRATE_CONFIG } from "@/data/migrate";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness & Health API Migration Guides";

export default function Image() {
  const released = releasedMigrate();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: MIGRATE_CONFIG.hubLabel,
      title: "Fitness & Health API Migration Guides",
      line,
    }),
    { ...OG_SIZE },
  );
}
