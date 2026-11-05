import { API_ENTRIES, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/apis";
import { CATEGORY_ORDER } from "@/data/costModel";
import { GRAVEYARD } from "@/data/graveyard";
import { CHANGE_EVENTS } from "@/data/changes";

/**
 * What /atlas says about the poster, shared with its markdown mirror. The
 * poster itself (public/atlas/*) is drawn by scripts/build-atlas.mjs from the
 * datasets these modules generate; the page reads the modules, so its text and
 * the poster cannot disagree about what is on it (qa's ATLAS gate checks the
 * SVG names every product and graveyard entry).
 */

export const ATLAS_SVG = "/atlas/fitness-api-atlas.svg";
export const ATLAS_PDF = "/atlas/fitness-api-atlas.pdf";

/** The newest date any input was checked: the poster's "data as of". */
export function atlasAsOf(): string {
  return [...GRAVEYARD.map((g) => g.source.checkedOn), ...CHANGE_EVENTS.map((c) => c.verifiedOn)].sort().at(-1)!;
}

export function atlasCategories() {
  return CATEGORY_ORDER.map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    items: API_ENTRIES.filter((a) => a.category === id).map((a) => ({
      id: a.id,
      label: a.label,
      billing: DEV_COST_LABELS[a.devCost],
      gated: Boolean(a.approvalGate),
    })),
  })).filter((c) => c.items.length > 0);
}

export function atlasRecentCount(): number {
  const asOf = atlasAsOf();
  const yearBefore = `${Number(asOf.slice(0, 4)) - 1}${asOf.slice(4)}`;
  return CHANGE_EVENTS.filter((c) => c.status === "confirmed" && c.sortDate > yearBefore).length;
}

const fmt = (iso: string) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [y, m, d] = iso.split("-");
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
};

export function atlasCapsule(): string {
  const cats = atlasCategories();
  return (
    `The Fitness API Atlas is a one-page A2 poster, as SVG and PDF, of the ${API_ENTRIES.length} products in this site's API directory in ${cats.length} categories, ` +
    `each labeled with how it bills developers and whether an approval stands before production, plus the ${GRAVEYARD.length} entries of the API graveyard and the ${atlasRecentCount()} confirmed changes of the twelve months before its data date. ` +
    `A script draws it from the site's open datasets, so nothing on it is hand-placed, and it ranks nothing. Data as of ${fmt(atlasAsOf())}.`
  );
}

export function atlasMethodLines(): string[] {
  return [
    "Drawn by scripts/build-atlas.mjs from public/datasets/fitness-apis-2026.json (the directory), public/datasets/fitness-api-changes-2026.json (the changes tracker) and src/data/graveyard.ts; the PDF is the same SVG printed by a headless Chromium.",
    "The date on the poster is the newest date its inputs were checked, not the day it was drawn, so an unchanged dataset redraws an identical file.",
    "Billing labels are the directory's: Free, Free tier, Usage-based or Contact sales, describing what the developer pays, not quality. A diamond marks a product whose directory entry names a review, approval or declaration to clear before you can ship.",
    "KinesteX funds this site. Its entry is drawn the same way as every other, and the poster ranks nothing.",
  ];
}
