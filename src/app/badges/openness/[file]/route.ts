import { machineBadgeResponse, statBadge } from "@/lib/statBadge";
import { opennessVendors } from "@/lib/openness";
import { opennessBadge } from "@/lib/statusBadges.mjs";

/**
 * /badges/openness/<vendor>.svg — "<Vendor> openness | N/M documented", the
 * plain count from /openness-index (src/lib/opennessIndex.mjs). qa's
 * BADGE-TEXT gate re-derives the count from the source modules.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  return opennessVendors().map((v) => ({ file: `${v.id}.svg` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const v = opennessVendors().find((x) => `${x.id}.svg` === file);
  if (!v) return new Response("Not found", { status: 404 });
  const b = opennessBadge(v);
  return machineBadgeResponse(statBadge(b.label, b.value, b.color));
}
