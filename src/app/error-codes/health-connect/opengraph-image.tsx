import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ERROR_CODES_FETCHED_ON, HC_CLIENT_EXCEPTIONS, HC_ERROR_CONSTANTS } from "@/data/errorCodes";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health Connect error codes and exceptions";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Error codes · Health Connect",
      title: "Health Connect Error Codes",
      line: `${HC_ERROR_CONSTANTS.length} HealthConnectException constants · ${HC_CLIENT_EXCEPTIONS.length} Jetpack exception types · read ${ERROR_CODES_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
