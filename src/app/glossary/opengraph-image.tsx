import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ALL_TERMS } from "@/data/glossary";

/** Hub social card with the page's own title and a line computed from the
 *  data, in place of the site-wide card (ops/SERP-30-2026-10-12.md #25). */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health & Fitness Data Glossary";

export default function Image() {
  const line = `${ALL_TERMS.length} terms, each linked to the page that treats it`;
  return new ImageResponse(ogCard({ eyebrow: "Glossary", title: "Health & Fitness Data Glossary", line }), { ...OG_SIZE });
}
