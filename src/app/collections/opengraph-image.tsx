import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { OAUTH_VENDORS } from "@/data/oauthVendors";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Postman and Bruno collections for wearable APIs";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Postman · Bruno",
      title: "Wearable API OAuth and webhook collections",
      line: `${OAUTH_VENDORS.map((v) => v.name).join(", ")} · no secrets`,
    }),
    { ...OG_SIZE },
  );
}
