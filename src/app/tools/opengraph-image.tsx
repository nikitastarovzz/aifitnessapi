import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ALL_TOOLS } from "@/lib/toolRegistry";

/** Hub social card with the page's own title and a line computed from the
 *  data, in place of the site-wide card (ops/SERP-30-2026-10-12.md #25). */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Free Tools for Health-App Builders";

export default function Image() {
  const line = `${ALL_TOOLS.length} tools that answer with a lookup, not an essay`;
  return new ImageResponse(ogCard({ eyebrow: "Free tools", title: "Free Tools for Health-App Builders", line }), { ...OG_SIZE });
}
