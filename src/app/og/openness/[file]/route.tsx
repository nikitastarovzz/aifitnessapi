import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import { opennessVendors } from "@/lib/openness";
import { OPENNESS_CHECKS } from "@/lib/opennessIndex.mjs";

/**
 * /og/openness/<vendor>.png — the share card for one vendor's row of
 * /openness-index, written by `next build` (static, like /og/picker). It
 * names the count and which basics are documented, nothing else: no rank,
 * no verdict.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  return opennessVendors().map((v) => ({ file: `${v.id}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const v = opennessVendors().find((x) => `${x.id}.png` === file);
  if (!v) return new Response("Not found", { status: 404 });
  const documented = OPENNESS_CHECKS.filter((c) => v.cells[c.id].status === "documented").map((c) => c.label.toLowerCase());
  return new ImageResponse(
    ogCard({
      eyebrow: "Fitness API openness index",
      title: `${v.name}: ${v.documented} of ${v.applicable} developer basics documented`,
      line: documented.length ? `Documented: ${documented.join(", ")}` : "None of the eight basics documented in the pages read",
    }),
    { ...OG_SIZE },
  );
}
