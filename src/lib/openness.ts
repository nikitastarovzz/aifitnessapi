import { OAUTH_SOURCES, OAUTH_VENDORS } from "@/data/oauthVendors";
import { WEBHOOK_SOURCES, WEBHOOK_VENDORS as WEBHOOK_DOCS } from "@/data/webhookPayloads";
import { WEBHOOK_VENDORS as VERIFIER_VENDORS } from "@/lib/webhookVerifier.mjs";
import { NOT_DOCUMENTED, RATE_LIMIT_VENDORS } from "@/lib/rateLimitCalc.mjs";
import { GHAPI_RATE_LIMITS, GHAPI_SOURCES } from "@/data/googleHealthApi";
import { deriveOpenness, OPENNESS_CHECKS, OPENNESS_VENDORS, type OpennessVendor } from "@/lib/opennessIndex.mjs";

/**
 * The openness index as the site renders it: src/lib/opennessIndex.mjs fed
 * the build's own modules. scripts/lib/openness-sources.mjs passes the same
 * modules to the same function for the test and qa, so the three cannot
 * compute different cells.
 */

/**
 * The day the index was compiled and its quotes checked against the evidence
 * files. The quotes themselves were read on the dates their evidence files
 * and modules record, and source-quotes.yml re-reads them every week.
 */
export const OPENNESS_UPDATED = "2026-11-06";

let CACHE: OpennessVendor[] | null = null;

export function opennessVendors(): OpennessVendor[] {
  if (CACHE) return CACHE;
  CACHE = deriveOpenness({
    oauth: OAUTH_VENDORS,
    oauthSources: OAUTH_SOURCES,
    webhooks: WEBHOOK_DOCS,
    webhookSources: WEBHOOK_SOURCES,
    verifierKinds: Object.fromEntries(VERIFIER_VENDORS.map((v: { id: string; kind: string }) => [v.id, v.kind])),
    rateLimits: RATE_LIMIT_VENDORS,
    rateNotDocumented: NOT_DOCUMENTED,
    ghapi: { rateLimits: GHAPI_RATE_LIMITS, sources: GHAPI_SOURCES },
  });
  return CACHE;
}

export function opennessVendor(id: string): OpennessVendor | undefined {
  return opennessVendors().find((v) => v.id === id);
}

/** The PNG card for one vendor, built at `next build`. */
export const opennessCardPath = (id: string) => `/og/openness/${id}.png`;

export const OPENNESS_TITLE = "The fitness API openness index";
// Within 45 characters: the layout appends the site suffix.
export const OPENNESS_META_TITLE = "Fitness API Openness Index: 8 Basics";
export const OPENNESS_DESCRIPTION = `Which developer basics ${OPENNESS_VENDORS.length} wearable and health-data APIs document: self-serve access, sandbox, pricing, rate limits, signed webhooks, PKCE and more.`;

/** How many vendors document one check, out of those it applies to. */
export function checkCounts(vendors = opennessVendors()) {
  return OPENNESS_CHECKS.map((c) => {
    const applies = vendors.filter((v) => v.cells[c.id].status !== "n/a");
    const documented = applies.filter((v) => v.cells[c.id].status === "documented");
    return { check: c, documented: documented.length, applies: applies.length, names: documented.map((v) => v.name) };
  });
}

/** A source's host, as the page names it beside a quote. */
export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** The short mark a cell shows in the summary table, and its spelled-out meaning. */
export const CELL_MARK: Record<string, { mark: string; meaning: string }> = {
  documented: { mark: "✓", meaning: "Documented: the vendor's page states it (the mark links the quote)" },
  absent: { mark: "✗", meaning: "The vendor's page says otherwise, for example that access needs approval (the mark links the quote)" },
  "not-documented": { mark: "n.d.", meaning: "Not documented in the pages read, which is not the same as no" },
  "n/a": { mark: "n/a", meaning: "Does not apply to how this API authenticates or issues tokens" },
};

/** "A, B and C". */
export function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** The answer capsule, shared by the page and its markdown mirror. */
export function opennessCapsule(vendors = opennessVendors()): string {
  const counts = checkCounts(vendors);
  const ratio = (x: { documented: number; applies: number }) => x.documented / x.applies;
  const top = Math.max(...counts.map(ratio));
  const low = Math.min(...counts.map(ratio));
  const most = counts.filter((x) => ratio(x) === top);
  const least = counts.filter((x) => ratio(x) === low);
  const phrase = (xs: typeof counts) => listNames(xs.map((x) => `${x.check.label.toLowerCase()} (${x.documented} of ${x.applies})`));
  return (
    `This index counts which of eight developer basics ${vendors.length} wearable and health-data APIs document on their own pages: ` +
    `a self-serve start, a sandbox or test mode, public pricing, published rate limits, signed webhooks, PKCE, refresh tokens, and a call that disconnects a user or deletes their data. ` +
    `The most often documented is ${phrase(most)}; the least is ${phrase(least)}. ` +
    `Every mark links the vendor's own sentence. A basic the pages read do not mention is shown as not documented, never as missing, and each score is a plain count with no weighting and no rank.`
  );
}

/** Prose with links, rendered by the page as JSX and by the mirror as markdown. */
export type Seg = string | { href: string; label: string };

export const OPENNESS_METHOD: Seg[][] = [
  [
    "Four checks are read straight from data the site already keeps for its tools. PKCE and refresh tokens come from the ",
    { href: "/tools/oauth-playground", label: "OAuth playground" },
    "’s per-vendor facts; published rate limits from the ",
    { href: "/tools/rate-limit-calculator", label: "rate-limit calculator" },
    " (and Google’s generated quota table); signed webhooks from the ",
    { href: "/webhooks", label: "webhook payload library" },
    " and the check each vendor gets in the ",
    { href: "/tools/webhook-verifier", label: "webhook verifier" },
    ". When one of those changes, the index changes with it at the next build.",
  ],
  [
    "The other four, self-serve start, sandbox, public pricing and a disconnect or deletion call, are one quote each, copied verbatim from an evidence file the site already holds for an integration guide or a pricing page. Those files are re-read against the live vendor pages every week by the source-quotes check, so a sentence a vendor removes turns the check red.",
  ],
  [
    "The count is documented basics over the basics that apply. A basic the pages read do not mention scores nothing and is labeled as not documented: it is a statement about what was read, not a finding that the vendor lacks it. Nothing is weighted and nothing is ranked; the table is alphabetical. KinesteX, which funds this site, makes a motion SDK rather than a wearable-data API, so it is not in the index.",
  ],
];

export const OPENNESS_TABLE_NOTE = "Alphabetical, so the order says nothing. A mark links the vendor’s sentence further down the page.";

export type Faq = { q: string; a: string };

export function opennessFaqs(vendors = opennessVendors()): Faq[] {
  const counts = checkCounts(vendors);
  const by = (id: string) => counts.find((c) => c.check.id === id)!;
  const pkce = by("pkce");
  const signed = by("signed-webhooks");
  const na = vendors.filter((v) => v.applicable < OPENNESS_CHECKS.length);
  const tokenOnly = vendors.filter((v) => v.cells["signed-webhooks"].status === "absent").map((v) => v.name);
  return [
    {
      q: "How is the openness score counted?",
      a: `One point for each of the eight basics the vendor's own pages document, divided by the basics that apply to that API. Nothing is weighted, so a sandbox counts the same as PKCE. A basic counts only when a quoted vendor sentence states it; ${listNames(na.map((v) => `${v.name} is scored out of ${v.applicable}`))}, because ${na.length === 1 ? "a basic does" : "some basics do"} not apply to how ${na.length === 1 ? "it authenticates or issues tokens" : "they authenticate or issue tokens"}.`,
    },
    {
      q: "Does “not documented” mean a vendor lacks that feature?",
      a: "No. It means the pages this site read for its integration guides, OAuth playground, webhook library and rate-limit calculator do not state it. A vendor may support PKCE or sign webhooks without saying so on those pages. Where a vendor's page does say something else, such as access needing approval or a shared token instead of a signature, the cell quotes it and is marked separately.",
    },
    {
      q: "Which wearable APIs describe PKCE in their OAuth documentation?",
      a: `${pkce.documented} of the ${pkce.applies} APIs here with an OAuth flow: ${listNames(pkce.names)}. The others' authorization pages, as read for the OAuth playground, do not mention it.`,
    },
    {
      q: "Which wearable APIs sign the webhooks they send?",
      a: `${listNames(signed.names)}: ${signed.documented} of ${signed.applies}. ${listNames(tokenOnly)} document a shared token instead, which proves the sender knows a secret but not that the body is unchanged.`,
    },
    {
      q: "Why are HealthKit and Health Connect not in the openness index?",
      a: "They are on-device frameworks. There is no developer account to apply for, request limit, webhook or OAuth client to check, so the eight basics do not describe them.",
    },
  ];
}
