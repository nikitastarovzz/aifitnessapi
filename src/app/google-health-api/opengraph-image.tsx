import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ghapiTotals } from "@/data/ghapiPages";
import { GHAPI_FETCHED_ON } from "@/data/googleHealthApi";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Google Health API reference";

export default function Image() {
  const t = ghapiTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Every Google Health API data type",
      line: `${t.types} data types · ${t.documentedScopes} scopes · ${t.methods} methods · read from Google's docs ${GHAPI_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
