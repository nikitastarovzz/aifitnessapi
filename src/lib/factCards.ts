import { allSpokes } from "@/lib/clusterRegistry";
import { keyFacts, urlKey } from "@/lib/keyFacts";
import { factCardImagePath, factCardText, factSharePath, parseFactId } from "@/lib/factCardCore.mjs";

/**
 * The fact cards the site can share: every "Key facts" line an English
 * cluster page renders today (src/lib/keyFacts.ts), keyed by its fact id
 * (src/lib/factCardCore.mjs). /s?t=fact&id=… renders one of these and the
 * static card at /og/fact/<id>.png draws the same one; an id that is not in
 * this set resolves to nothing, so a fact the page stopped showing stops
 * being shareable with it.
 *
 * `checked` is the date the page's last full re-verification read the
 * fact's source (the entry's `sources` row for that URL), which is the date
 * the page itself shows for it.
 */

export type FactCard = {
  id: string;
  quote: string;
  /** The evidence row's claim line, in this site's words; null when it has none. */
  claim: string | null;
  url: string;
  host: string;
  checked: string | null;
  pagePath: string;
  pageTitle: string;
  /** The page features KinesteX, which funds this site (ops/GEO.md): the card says so. */
  firstParty: boolean;
  sharePath: string;
  image: string;
  text: ReturnType<typeof factCardText>;
};

let cache: Map<string, FactCard> | null = null;

function build(): Map<string, FactCard> {
  const out = new Map<string, FactCard>();
  for (const { basePath, entry } of allSpokes()) {
    const pagePath = `${basePath}/${entry.slug}`;
    const facts = keyFacts(pagePath, entry);
    if (facts.length === 0) continue;
    const checkedBy = new Map((entry.sources ?? []).map((s) => [urlKey(s.url), s.checked]));
    for (const f of facts) {
      // Two pages quoting the same row of the same file cannot happen (the id
      // starts with the page's own evidence file), so a repeat is a bug.
      if (out.has(f.id)) throw new Error(`factCards: fact id ${f.id} rendered twice`);
      const checked = checkedBy.get(urlKey(f.url)) ?? null;
      out.set(f.id, {
        id: f.id,
        quote: f.quote,
        claim: f.claim,
        url: f.url,
        host: f.host,
        checked,
        pagePath,
        pageTitle: entry.h1,
        firstParty: entry.firstParty === true,
        sharePath: factSharePath(f.id),
        image: factCardImagePath(f.id),
        text: factCardText({ quote: f.quote, host: f.host, checked, pageTitle: entry.h1 }),
      });
    }
  }
  return out;
}

/** Every shareable fact, in registry and page order. */
export function allFactCards(): FactCard[] {
  cache ??= build();
  return [...cache.values()];
}

/** The fact for a raw query value, or null: strict id check, then lookup. */
export function factCard(raw: unknown): FactCard | null {
  const id = parseFactId(raw);
  if (!id) return null;
  cache ??= build();
  return cache.get(id) ?? null;
}
