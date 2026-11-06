import { GRAVEYARD } from "@/data/graveyard";
import { machineBadgeResponse, statBadge } from "@/lib/statBadge";
import { stoneBadge } from "@/lib/statusBadges.mjs";

/**
 * /badges/api/<stone>.svg — a README badge for one API in the Fitness API
 * Graveyard: its name, the vendor's own end label and date at the source's
 * precision, and for a scheduled end the days left as of the build day
 * (src/lib/statusBadges.mjs). Written once per deploy; qa's BADGE-TEXT gate
 * recomputes every badge from src/data/graveyard.ts with the day it names.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  return GRAVEYARD.map((g) => ({ file: `${g.id}.svg` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const stone = GRAVEYARD.find((g) => `${g.id}.svg` === file);
  if (!stone) return new Response("Not found", { status: 404 });
  const b = stoneBadge(stone, new Date().toISOString().slice(0, 10));
  return machineBadgeResponse(statBadge(b.label, b.value, b.color));
}
