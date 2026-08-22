import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";

/**
 * Social card generated from query parameters, for results that exist only as
 * a URL — a picker answer, a stack comparison. Every other card on this site
 * is a static file per route, which is right for pages; a result has no route
 * of its own, so this one is rendered on request.
 *
 * Inputs are text drawn on an image, never HTML, and they are hard-truncated
 * here as well as in the card layout: this endpoint is public, and the way a
 * public image generator gets abused is somebody pasting an essay into it.
 */
export const runtime = "nodejs";

const clip = (s: string | null, max: number) => (s ?? "").slice(0, max);

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  return new ImageResponse(
    ogCard({
      eyebrow: clip(q.get("eyebrow"), 40) || "AIFitnessAPI",
      title: clip(q.get("title"), 90) || "AIFitnessAPI",
      line: clip(q.get("line"), 120) || undefined,
    }),
    {
      ...OG_SIZE,
      headers: {
        // Deterministic output for a given query, so it is safe to cache hard.
        "cache-control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
