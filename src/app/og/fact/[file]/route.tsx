import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import { allFactCards } from "@/lib/factCards";

/**
 * /og/fact/<fact id>.png — the social card for one shared key fact
 * (/s?t=fact&id=…), written by `next build` like /og/picker and
 * /og/openness: one file per fact the site renders today, and
 * `dynamicParams = false`, so an id outside that set is a 404 from the router
 * and no request ever renders a card. The text is the fact's own
 * (src/lib/factCardCore.mjs factCardText): the verbatim quote, the source's
 * host and the date the page checked it.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  return allFactCards().map((f) => ({ file: `${f.id}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const f = allFactCards().find((x) => `${x.id}.png` === file);
  if (!f) return new Response("Not found", { status: 404 });
  return new ImageResponse(ogCard({ eyebrow: f.text.ogEyebrow, title: f.text.ogTitle, line: f.text.ogLine }), {
    ...OG_SIZE,
    headers: { "cache-control": "public, max-age=86400" },
  });
}
