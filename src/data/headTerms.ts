/**
 * Head terms and the one page that owns each (ops/MORE-30-2026-11-05.md items
 * 1-4).
 *
 * Search Console showed the site's category terms split across many of our own
 * pages, none of them ranking: "fitness api" over 22 pages (best: the homepage
 * at 20.8), "workout api" over 13, "fitness management api" over 12,
 * "healthkit" over 5 (Google, Oct 4-31, data/gsc/latest.json byQueryPage). The
 * site ranks for its long tail and loses the terms that name the category.
 *
 * The fix is ownership: one page per term, named here, and the rest of the site
 * pointing at it. `scripts/qa.mjs` (HEAD-TERM-OWNER) holds two things for every
 * English page:
 *
 *  - a title or H1 that IS the term (its lead before any ":", "—", "|", ","
 *    or "(", with a leading "the", "best", "top" or "all" set aside) belongs to
 *    the owner and no other page;
 *  - an internal link whose visible text is the term (same normalization)
 *    points at the owner.
 *
 * Pages that answer a narrower question ("What is a fitness API?", "Fitness API
 * vs building your own", "HealthKit vs Health Connect") keep their own titles
 * and links: only the bare term is held. External links (Apple's own
 * "HealthKit" documentation, say) are citations and are not checked.
 *
 * `variants` are the exact phrasings searchers used, lowercased; each is held
 * to the same owner. Add a term only with the search evidence that it is split,
 * and pick the owner by what the page answers, not by what ranks.
 */
export type HeadTerm = {
  term: string;
  /** How a link to the owner reads in a sentence: one of the variants. */
  label: string;
  variants: string[];
  owner: string;
  why: string;
};

export const HEAD_TERMS: HeadTerm[] = [
  {
    "term": "fitness api",
    "label": "fitness APIs",
    "variants": ["fitness api", "fitness apis", "api fitness", "fitness & workout apis", "fitness and workout apis"],
    "owner": "/fitness-apis",
    "why": "The pillar answers what a fitness API is and which to use for each job (made the pillar 2026-11-04). 'fitness api' drew 373 impressions over 22 pages, 'fitness apis' 75 over 18, 'api fitness' 37 over 9."
  },
  {
    "term": "workout api",
    "label": "workout APIs",
    "variants": ["workout api", "workout apis"],
    "owner": "/fitness-apis/exercise-database-apis",
    "why": "A workout API most often means the exercise content a workout is built from (exercises, instructions, media, routines), which the exercise database roundup compares; tracking a user's own workout by camera is the narrower AI workout tracking page. 30 impressions over 13 pages."
  },
  {
    "term": "fitness management api",
    "label": "fitness management APIs",
    "variants": ["fitness management api", "fitness management apis", "gym management api", "gym management apis", "gym management software api", "gym management software apis"],
    "owner": "/fitness-apis/gym-management-software-apis",
    "why": "The gym and studio management software roundup compares the APIs of the software that runs a gym or studio (bookings, members, classes). 35 impressions over 12 pages, the best at position 37."
  },
  {
    "term": "healthkit",
    "label": "HealthKit",
    "variants": ["healthkit"],
    "owner": "/healthkit",
    "why": "The /healthkit hub is the reference for the whole framework and links every HealthKit page; the integration guide (owner of 'apple healthkit' and 'healthkit api' since SEO-10 item 2), the type matrix and the comparison each answer a narrower question. 38 impressions over 5 pages, the hub at 34.7."
  }
];

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const OWNER_OF = new Map(HEAD_TERMS.flatMap((t) => t.variants.map((v) => [v, t.owner] as const)));

/** The owner page of a held head term, or undefined when the text is not one. */
export function headTermOwner(text: string): string | undefined {
  return OWNER_OF.get(normalize(text));
}

/**
 * The anchor text for a link to a product's own /apis entity page. The short
 * name is used unless it is a held head term ("HealthKit"), in which case the
 * product's full label ("Apple HealthKit") names it: the entity page is about
 * the product, and the bare term's links belong to its owner.
 */
export function entityAnchor(api: { short: string; label: string }): string {
  return headTermOwner(api.short) ? api.label : api.short;
}
