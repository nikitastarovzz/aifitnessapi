/**
 * The text of the README status badges (ops/VIRAL-20-2026-11-06.md item 5):
 * one per Fitness API Graveyard stone at /badges/api/<id>.svg, and one per
 * openness-index vendor at /badges/openness/<id>.svg.
 *
 * Plain ESM with no imports, so the routes, /badges, scripts/status-badges.test.mjs
 * and qa's BADGE-TEXT gate compute the same strings.
 *
 * Rules the text keeps:
 *   - A stone's date is its `end` exactly as src/data/graveyard.ts holds it,
 *     at the source's precision ("2026-11-02", "2025-12", "2026"). Never
 *     sharpened.
 *   - The words are the stone's own `endLabel`, lowercased.
 *   - Only a "dying" stone (a future end the vendor names) gets a countdown,
 *     and it is computed when the site is built, so the badge says which day
 *     it was computed on: "in 55 days (as of 2026-11-06)". A cached copy can
 *     be old; it cannot claim to be current. A day-precise end counts to
 *     00:00 UTC that day; a month or year counts to its last day and says
 *     "within", because the event may come any time before it. Once the date
 *     is reached the badge says "date passed" rather than inventing an
 *     outcome the vendor has not announced.
 */

const DAY_MS = 86400000;

/** The last day a fuzzy date can mean: "2026" → 2026-12-31, "2025-12" → 2025-12-31. */
export function lastDay(d) {
  if (/^\d{4}$/.test(d)) return `${d}-12-31`;
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-").map(Number);
    return `${d}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, "0")}`;
  }
  return d;
}

export const isDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);

/** Whole days from 00:00 UTC on `asOf` to 00:00 UTC on `day`. */
export function daysBetween(asOf, day) {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${asOf}T00:00:00Z`)) / DAY_MS);
}

export const STONE_COLORS = { dead: "#b91c1c", dying: "#b45309", deprecated: "#4b5563" };
export const OPENNESS_COLOR = "#059669";

/**
 * A stone's badge: label, value and colour.
 * @param {{ id: string; name: string; status: "dead" | "dying" | "deprecated"; end: string | null; endLabel: string }} stone
 * @param {string} asOf  The build day, YYYY-MM-DD (UTC).
 */
export function stoneBadge(stone, asOf) {
  if (!isDay(asOf)) throw new Error(`stoneBadge: asOf must be YYYY-MM-DD, got ${asOf}`);
  const words = stone.endLabel.toLowerCase();
  let value = stone.end ? `${words} ${stone.end}` : words;
  if (stone.status === "dying" && stone.end) {
    const n = daysBetween(asOf, lastDay(stone.end));
    const left = n <= 0 ? "date passed" : `${isDay(stone.end) ? "in" : "within"} ${n} ${n === 1 ? "day" : "days"}`;
    value += ` · ${left} (as of ${asOf})`;
  }
  return { label: stone.name, value, color: STONE_COLORS[stone.status] };
}

/** The badge for one openness-index vendor. */
export function opennessBadge(vendor) {
  return { label: `${vendor.name} openness`, value: `${vendor.documented}/${vendor.applicable} documented`, color: OPENNESS_COLOR };
}

/** The accessible name a rendered badge carries: "label: value". */
export const badgeAlt = (b) => `${b.label}: ${b.value}`;

export const STONE_BADGE_BASE = "/badges/api";
export const OPENNESS_BADGE_BASE = "/badges/openness";
export const stoneBadgePath = (id) => `${STONE_BADGE_BASE}/${id}.svg`;
export const opennessBadgePath = (id) => `${OPENNESS_BADGE_BASE}/${id}.svg`;

/**
 * The README snippet: a Markdown image that links to `href`. Its alt text is
 * fixed ("Fitbit Web API status"), not the badge's value: the snippet is
 * pasted once and the image changes under it, so an alt carrying today's
 * countdown would be the one part of the README that goes stale.
 */
export function badgeMarkdown(alt, svgPath, href, origin = "https://aifitnessapi.com") {
  return `[![${alt}](${origin}${svgPath})](${origin}${href})`;
}

export const stoneBadgeAlt = (stone) => `${stone.name} status`;
export const opennessBadgeAlt = (vendor) => `${vendor.name} openness`;
