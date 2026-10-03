import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ERROR_CODES_FETCHED_ON, HC_ERROR_CONSTANTS, HK_ERROR_CODES } from "@/data/errorCodes";

/** Hub card. The counts are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "HealthKit and Health Connect error codes";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Error codes",
      title: "HealthKit & Health Connect Error Codes",
      line: `${HK_ERROR_CODES.length} HKError.Code cases · ${HC_ERROR_CONSTANTS.length} HealthConnectException constants · read ${ERROR_CODES_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
