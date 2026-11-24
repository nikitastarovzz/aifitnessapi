/**
 * Fact cards: one sourced "Key facts" line as a share target of its own,
 * `/s?t=fact&id=<fact id>`.
 *
 * Pure and dependency-free, so the share route, its static social card, the
 * "Share this fact" button (a client component) and scripts/fact-cards.test.mjs
 * run the same code. The hash itself is in src/lib/factId.mjs, which needs
 * node:crypto and so stays out of the browser bundle.
 *
 * The id scheme. A key fact is a row of an evidence file,
 * `ops/sources/evidence/<cluster>-<slug>.json` (src/lib/keyFacts.ts), and its
 * id names that file and the row's content:
 *
 *     <cluster>-<slug>.<first 10 hex of sha256(url + "\n" + quote)>
 *     e.g. pricing-garmin-api.3f9a0c41be
 *
 * - The prefix is the evidence file's base name, which is the English page
 *   path with its slashes joined by a hyphen, so the id also says which page
 *   uses the fact.
 * - The hash is taken over the row's `url` and `quote` exactly as the
 *   evidence file stores them (the quote trimmed, nothing else changed), not
 *   over the row's position. Rows added, removed or reordered around a fact
 *   leave its id alone; a change to the quoted words or the source URL makes
 *   a different fact, and the old id stops resolving (the share page then
 *   says so and links the page), which is the honest outcome for a quote the
 *   source no longer carries.
 * - Ten hex digits (40 bits) is far more than the few hundred key facts the
 *   site renders need; scripts/fact-cards.test.mjs checks every row of every
 *   evidence file for a collision anyway.
 *
 * An id only ever selects a fact; nothing from the URL is printed. The share
 * route accepts a value that matches FACT_ID exactly and then looks it up in
 * the set of facts the site currently renders, so free text cannot reach a
 * title, a description or a card.
 */
export const FACT_HASH_LEN = 10;
export const FACT_ID_MAX = 120;
/** Lowercase words joined by hyphens, a dot, then the hash. */
export const FACT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[0-9a-f]{10}$/;

/** The evidence file's base name for an English page path: "/pricing/garmin-api" → "pricing-garmin-api". */
export function factBase(enPath) {
  const p = String(enPath ?? "");
  const m = /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(p);
  if (!m) throw new Error(`factBase: not a /<cluster>/<slug> path: ${JSON.stringify(p.slice(0, 80))}`);
  return `${m[1]}-${m[2]}`;
}

/**
 * A query value as a fact id, or null. Strict: a single string (an array from
 * a repeated parameter is refused, not narrowed to its first item), at most
 * FACT_ID_MAX characters, matching FACT_ID in full. Nothing is trimmed,
 * lowercased or decoded further, so one fact has exactly one spelling.
 */
export function parseFactId(raw) {
  if (typeof raw !== "string") return null;
  if (raw.length === 0 || raw.length > FACT_ID_MAX) return null;
  return FACT_ID.test(raw) ? raw : null;
}

/** The share address for a fact, relative or on `siteUrl`. */
export function factSharePath(id, siteUrl = "") {
  if (!parseFactId(id)) throw new Error(`factSharePath: bad id ${JSON.stringify(String(id).slice(0, 40))}`);
  return `${String(siteUrl).replace(/\/$/, "")}/s?t=fact&id=${id}`;
}

/** The prerendered social card's path for a fact (src/app/og/fact/[file]). */
export function factCardImagePath(id) {
  if (!parseFactId(id)) throw new Error(`factCardImagePath: bad id ${JSON.stringify(String(id).slice(0, 40))}`);
  return `/og/fact/${id}.png`;
}

/** Cut on a word boundary and add an ellipsis; mirrors clampLine in og-card.tsx. */
export function clip(s, max) {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

/** "2026-11-14" → "November 14, 2026"; anything else is returned as given. */
export function longDate(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d ?? ""));
  if (!m) return String(d ?? "");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/**
 * Every string the share page, its metadata and its card print, from one
 * fact. Built only from the fact's own fields (all from the evidence file and
 * the page entry), never from the request.
 *
 * @param {{ quote: string, host: string, checked: string | null, pageTitle: string }} f
 */
export function factCardText(f) {
  const checked = f.checked ? `checked ${longDate(f.checked)}` : "check date not recorded";
  return {
    /** <title> before the site suffix; the quote, short. */
    title: `“${clip(f.quote, 70)}”`,
    /** Meta and social description, held to 155 characters. */
    description: clip(`A sourced fact, quoted word for word from ${f.host} (${checked}), as used on “${f.pageTitle}”.`, 155),
    /** The card: eyebrow, the quote as its title, and who says it. */
    ogEyebrow: "Sourced fact",
    ogTitle: `“${clip(f.quote, 150)}”`,
    ogLine: `${f.host} · ${checked}`,
    /** The one line that goes with a posted link. */
    shareText: `“${clip(f.quote, 200)}” (${f.host})`,
  };
}
