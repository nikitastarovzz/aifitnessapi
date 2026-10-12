import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { CHANGE_EVENTS } from "@/data/changes";

/** Hub social card with the page's own title and a line computed from the
 *  data, in place of the site-wide card (ops/SERP-30-2026-10-12.md #25). */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness API Changes & Deadlines";

export default function Image() {
  const line = `${CHANGE_EVENTS.length} tracked changes, each graded by its source`;
  return new ImageResponse(ogCard({ eyebrow: "Changes tracker", title: "Fitness API Changes & Deadlines", line }), { ...OG_SIZE });
}
