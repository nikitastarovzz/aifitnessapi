import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { HS_DATA_TYPES, HS_DATA_TYPES_FETCHED_ON } from "@/data/healthServicesDataTypes";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Wear OS Health Services data types";

export default function Image() {
  const withPermission = HS_DATA_TYPES.filter((t) => t.permission).length;
  return new ImageResponse(
    ogCard({
      eyebrow: "Reference · Wear OS",
      title: "Wear OS Health Services Data Types",
      line: `${HS_DATA_TYPES.length} DataType constants · ${withPermission} with a listed permission · read ${HS_DATA_TYPES_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
