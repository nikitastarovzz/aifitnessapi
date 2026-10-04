import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { HK_METADATA_KEYS, HK_METADATA_KEYS_FETCHED_ON, HK_METADATA_KEY_GROUPS } from "@/data/healthkitMetadataKeys";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Every HealthKit metadata key";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Reference · HealthKit",
      title: "HealthKit Metadata Keys",
      line: `${HK_METADATA_KEYS.length} HKMetadataKey constants · ${HK_METADATA_KEY_GROUPS.length} topic groups · read ${HK_METADATA_KEYS_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
