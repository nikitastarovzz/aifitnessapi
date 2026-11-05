import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
import { SDK_REPOS, SDK_CHECKED_ON } from "@/data/sdkReleases";
import { clusterMap } from "@/lib/clusterRegistry";
import { releasedHkGroups, HK_BASE, hkGroupModified } from "@/data/hkGroupPages";
import { hkStandaloneModified } from "@/data/hkStandalone";
import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { changesSorted } from "@/data/changes";
import { PRESS_PATH, pressDataDate } from "@/lib/press";
import { GRAVEYARD_PATH, graveyardCheckedOn } from "@/data/graveyard";
import { OAUTH_FETCHED_ON } from "@/data/oauthVendors";
import { WEBHOOKS_FETCHED_ON } from "@/data/webhookPayloads";
import { API_ENTRIES, APIS_PATH, NOINDEX_APIS } from "@/data/apis";
import { API_INDEX_PATH, MARKET_MAP_PATH, indexDataDate } from "@/lib/ecosystemSignals";
import { DAILY_PATH, dailyDataDate } from "@/lib/dailyBank";
import { YEAR_PATH, yearDataDate } from "@/lib/year2026";
import { isNoindexed } from "@/data/noindex";
import { ptPages, ptIndexIndexable, PT_PREFIX } from "@/lib/translations";
import { digests, DIGEST_PATH, type Digest } from "@/data/digest";
import { HC_FETCHED_ON } from "@/data/healthConnectRecords";
import { orderedRecords, recordPath, HC_BASE, HC_PERMISSIONS_PATH, HC_AGGREGATES_PATH, hcModified } from "@/data/hcPages";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, comparisonModified, libraryPages, librariesModified } from "@/data/librariesEditorial";
import { LIBRARY_LANDINGS, landingPath } from "@/data/librariesLandings";
import { hkVersionPages, HK_VERSION_PAGES_PUBLISHED } from "@/lib/hkVersions";
import { ERROR_CODES_FETCHED_ON } from "@/data/errorCodes";
import { HC_RELEASES_FETCHED_ON } from "@/data/hcReleases";
import { HK_METADATA_KEYS_FETCHED_ON } from "@/data/healthkitMetadataKeys";
import { HS_DATA_TYPES_FETCHED_ON } from "@/data/healthServicesDataTypes";
import { POSE_KEYPOINTS_FETCHED_ON, POSE_SCHEMES } from "@/data/poseKeypoints";
import { FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { PLANNER_READ_ON } from "@/data/plannerSources.mjs";
import { COVERAGE_UPDATED, RATE_UPDATED } from "@/lib/coverageView";
import { ET_FETCHED_ON } from "@/data/exerciseTaxonomy";
import { ATLAS_PATH } from "@/lib/audienceTools";
import { atlasAsOf } from "@/lib/atlasView";
import { GYM_API_MATRIX } from "@/data/gymApiMatrix";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import { UNIFIED_READ_ON } from "@/data/unifiedSchema";
import { FG_UPDATED } from "@/lib/fitbitGoogleMap";
import { hkPageIdentifiers, hkIdentifierPath, hkPageModified } from "@/data/hkIdentifierPages";
import { hsPageTypes, hsDataTypePath, hsPageModified } from "@/data/hsDataTypePages";
import { GHAPI_PATHS, allTypes as ghapiTypes, typePath as ghapiTypePath, ghapiModified } from "@/data/ghapiPages";
import { MCP_SERVERS_FETCHED_ON } from "@/data/mcpHealthServers";
import { BT_BASE, BT_FETCHED, BT_PAGES, btPath } from "@/data/btPages";
import { PLATFORM_ORDER as WT_PLATFORM_ORDER, WT_BASE, WT_FETCHED, activityPath as wtActivityPath, activityRows as wtActivityRows, platformPath as wtPlatformPath } from "@/data/workoutTypePages";

/**
 * Every row carries a `lastmod` that some dated record on the site backs, or
 * no `lastmod` at all. Never build time: a sitemap that reports every URL as
 * changed on every deploy teaches a crawler to ignore the field, and this
 * site's whole claim is that its dates mean something. Where nothing dated
 * stands behind a page, the row goes out undated rather than guessed.
 *
 * The rule for a page is the date its own structured data declares as
 * dateModified, so the sitemap and the page can never disagree (qa's
 * SITEMAP-LASTMOD holds every row to it). A hub or index that declares no
 * dateModified of its own takes the date of its newest member instead. One
 * that does declare one — every cluster hub's Article node carries the
 * hub's own UPDATED (the "last reviewed" line most hubs print), and /changes
 * carries its "Updated" date — is dated by that declaration, even where a
 * member is newer: the page says when it was last changed, and the sitemap
 * must not say otherwise.
 *
 * Since 2026-11-05 (ops/MORE-30-2026-11-05.md item 26) /sitemap.xml is a
 * sitemap index over one child per section (SITEMAP_SECTIONS, served at
 * /sitemaps/<id>.xml by src/app/sitemaps/[file]/route.ts), so Search
 * Console reports coverage per section and a crawler can re-read the one
 * section that moved. The index keeps the URL robots.txt and both webmaster
 * consoles already hold; each child is dated by the newest lastmod among its
 * own rows. Current pt-BR translations and their English pages carry
 * xhtml:link hreflang alternates, the same three their pages declare.
 *
 * changefreq and priority are gone. Every row used to claim "weekly" or
 * "monthly" whether or not anything had changed, with priorities that were
 * one person's ranking typed once — neither was a fact we could keep true,
 * and lastmod is the one field here a dated record can back.
 *
 * Re-audited 2026-10-03, after the five-day 402 outage, because lastmod is
 * what prioritises a re-crawl and a wrong one would have been worse than
 * none: a sitemap that stamped the deploy date on all ~430 rows would have
 * told Google and Bing that every page changed while the site was dark. It
 * does not — no row carried the build date, and the dated rows spread across
 * the real re-verification dates they come from. The rows that carry no
 * lastmod are exactly the pages that declare no dateModified of their own:
 * the /apis directory and its product pages (apis.ts records no verification
 * date), and the utility pages (/privacy, /methodology, /glossary, /gates,
 * /about, /badges and the rest). Undated is the honest answer for those;
 * giving them a date would mean inventing one. Every content spoke and hub is
 * dated, which is the half that re-crawl priority turns on.
 */

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The newest of a set of YYYY-MM-DD dates, ignoring anything that is not
 *  one. Lexical order is date order for this format. */
function newest(dates: (string | null | undefined)[]): string | undefined {
  return dates.filter((d): d is string => typeof d === "string" && ISO_DAY.test(d)).sort().at(-1);
}

/** The sections, in the order the index lists them. Each is one child
 *  sitemap at /sitemaps/<id>.xml. */
export const SITEMAP_SECTIONS = ["pages", "guides", "healthkit", "reference", "libraries", "apis", "blog", "pt-br"] as const;
export type SitemapSectionId = (typeof SITEMAP_SECTIONS)[number];
export type SitemapAlternate = { hreflang: string; href: string };
export type SitemapRow = { path: string; lastmod?: string; alternates?: SitemapAlternate[] };
export type SitemapSection = { id: SitemapSectionId; rows: SitemapRow[]; lastmod?: string };

/** A row, dated only when the date is a real calendar day. A malformed stamp
 *  drops the lastmod instead of throwing at `toISOString()` or guessing. */
function row(p: string, date?: string | null): SitemapRow {
  return date && ISO_DAY.test(date) ? { path: p, lastmod: date } : { path: p };
}

const APP_DIR = path.join(process.cwd(), "src", "app");

/**
 * A standalone page's own date, read from its source: the page-local
 * `const UPDATED = "YYYY-MM-DD"`, and only when the same file also declares
 * `dateModified: UPDATED` — so the result is, by construction, the date the
 * page's structured data already states. Next refuses extra named exports
 * from a page module, so the constant cannot be imported; reading it is how
 * the two stay one value instead of two copies that drift. The sitemap is
 * generated at build, where the source is present. A missing file, constant
 * or dateModified yields no lastmod — never a substitute.
 */
function pageStamp(route: string): string | undefined {
  let src: string;
  try {
    src = fs.readFileSync(path.join(APP_DIR, route, "page.tsx"), "utf8");
  } catch {
    return undefined;
  }
  if (!/dateModified:\s*UPDATED\b/.test(src)) return undefined;
  return /const UPDATED\s*=\s*"(\d{4}-\d{2}-\d{2})"/.exec(src)?.[1];
}

/** A digest has no authored date of its own; it is the dated records of one
 *  month, so it is as fresh as the newest record it still holds. A page
 *  re-verified in a later month leaves the issue without adding a date, so
 *  this can understate a change — never overstate one. */
function digestDate(d: Digest): string | undefined {
  return newest([...d.changes.map((c) => c.verifiedOn), ...d.pages.map((p) => p.updated)]);
}

function computeSections(): SitemapSection[] {
  const map = clusterMap();
  const posts = getAllPosts();
  const issues = digests();

  // An empty cluster's hub and question index 404, so neither is listed.
  const populated = Object.entries(map).filter(([, entries]) => entries.length > 0);
  const newestIn = (base: string) => newest((map[base] ?? []).map((e) => e.updated));
  const newestAll = newest(Object.values(map).flatMap((l) => l.map((e) => e.updated)));
  const newestChange = newest(changesSorted().map((c) => c.verifiedOn));
  const newestPost = newest(posts.map((p) => p.updated));

  // HealthKit reference pages: each row carries its page's JSON-LD
  // dateModified — the page's own last change, not the data date it shows
  // readers. See HK_GROUP_MODIFIED / hkGroupModified for why those differ.
  const hkPages: [string, string | undefined][] = [
    ["/healthkit-identifiers", HK_FETCHED_ON],
    ["/healthkit-errors", HK_FETCHED_ON],
    ["/healthkit-versions", hkStandaloneModified("healthkit-versions")],
    ["/healthkit-status", hkStandaloneModified("healthkit-status")],
    ["/healthkit-category-values", hkStandaloneModified("healthkit-category-values")],
    ["/healthkit-units", hkStandaloneModified("healthkit-units")],
  ];
  // One row per computed /healthkit-versions/<ios-N> page; each declares
  // HK_VERSION_PAGES_PUBLISHED as its dateModified.
  const hkVersionRows = hkVersionPages().map((g) => row(g.path, HK_VERSION_PAGES_PUBLISHED));

  // Health Connect record reference (generated): every page but the hub
  // declares hcModified() — the fetch date — as dateModified; the hub
  // declares none, so it takes its newest member, which is the same date.
  const hcRows = [
    row(HC_BASE, HC_FETCHED_ON),
    row(HC_PERMISSIONS_PATH, hcModified()),
    row(HC_AGGREGATES_PATH, hcModified()),
    ...orderedRecords().map((r) => row(recordPath(r), hcModified())),
  ];

  // Per-type reference pages (generated): one per HealthKit identifier and
  // per Wear OS data type that clears its thin-page rule. Each declares
  // hkPageModified(id) / hsPageModified() as dateModified; the types the rule
  // holds back have no page and so no row.
  const typePageRows = [
    ...hkPageIdentifiers().map((id) => row(hkIdentifierPath(id), hkPageModified(id))),
    ...hsPageTypes().map((t) => row(hsDataTypePath(t), hsPageModified())),
  ];

  // Google Health API reference (generated): the hub, the five topic pages
  // and every data-type page declare ghapiModified() — the date Google's
  // pages were read — as dateModified.
  const ghapiRows = [
    ...Object.values(GHAPI_PATHS).map((p) => row(p, ghapiModified())),
    ...ghapiTypes().map((t) => row(ghapiTypePath(t), ghapiModified())),
  ];

  // Open-source library pages: hub, language landings, package pages and
  // comparisons declare librariesModified() as dateModified (a comparison
  // re-checked on its own declares comparisonModified()).
  const libRows = [
    row(LIBRARIES_BASE, librariesModified()),
    ...LIBRARY_LANDINGS.map((l) => row(landingPath(l), librariesModified())),
    ...libraryPages().map(({ ed }) => row(`${LIBRARIES_BASE}/${ed.slug}`, librariesModified())),
    ...LIBRARY_COMPARISONS.map((c) => row(`${LIBRARIES_BASE}/compare/${c.slug}`, comparisonModified(c))),
  ];

  // Generated error-code and release references: each page's dateModified is
  // its generator's fetch date.
  const generatedRefs: [string, string][] = [
    ["/error-codes", ERROR_CODES_FETCHED_ON],
    ["/error-codes/health-connect", ERROR_CODES_FETCHED_ON],
    ["/health-connect-releases", HC_RELEASES_FETCHED_ON],
    ["/healthkit-metadata-keys", HK_METADATA_KEYS_FETCHED_ON],
    ["/wear-os-data-types", HS_DATA_TYPES_FETCHED_ON],
    ["/pose-keypoints", POSE_KEYPOINTS_FETCHED_ON],
    ...POSE_SCHEMES.map((s): [string, string] => [`/pose-keypoints/${s.slug}`, POSE_KEYPOINTS_FETCHED_ON]),
    ["/health-mcp-servers", MCP_SERVERS_FETCHED_ON],
  ];

  // Bluetooth GATT reference (generated from the Bluetooth SIG's repository):
  // the hub and every characteristic page declare the fetch date as
  // dateModified.
  const btRows = [row(BT_BASE, BT_FETCHED), ...BT_PAGES.map((c) => row(btPath(c), BT_FETCHED))];

  // Workout-type reference (generated from Apple's and Google's docs and the
  // androidx source): the hub, the four platform list pages and the activity
  // pages the page rule allows all declare WT_FETCHED as dateModified.
  const wtRows = [
    row(WT_BASE, WT_FETCHED),
    ...WT_PLATFORM_ORDER.map((p) => row(wtPlatformPath(p), WT_FETCHED)),
    ...wtActivityRows().map((r) => row(wtActivityPath(r), WT_FETCHED)),
  ];

  // The list is empty until the authored entries land, and an empty list
  // emits no rows.
  const hkGroupDates = releasedHkGroups().map((g) => [g.slug, hkGroupModified(g.slug)] as const);
  const hkGroups = hkGroupDates.map(([slug, d]) => row(`${HK_BASE}/${slug}`, d));

  // Tools: the three built on the HealthKit corpus declare HK_FETCHED_ON as
  // dateModified; the other seven carry a page-local UPDATED.
  const tools: [string, string | undefined][] = [
    ["/tools/error-diagnoser", HK_FETCHED_ON],
    ["/tools/aggregation-checker", HK_FETCHED_ON],
    ["/tools/identifier-translator", HK_FETCHED_ON],
    ["/tools/permission-builder", pageStamp("/tools/permission-builder")],
    ["/tools/query-generator", pageStamp("/tools/query-generator")],
    ["/tools/stack-generator", pageStamp("/tools/stack-generator")],
    ["/tools/sample-data", pageStamp("/tools/sample-data")],
    ["/tools/pose-benchmark", pageStamp("/tools/pose-benchmark")],
    ["/tools/heart-rate-lab", pageStamp("/tools/heart-rate-lab")],
    ["/tools/webhook-verifier", pageStamp("/tools/webhook-verifier")],
    ["/tools/starter-scaffold", pageStamp("/tools/starter-scaffold")],
    ["/tools/keypoint-playground", pageStamp("/tools/keypoint-playground")],
    ["/tools/step-lab", pageStamp("/tools/step-lab")],
    ["/tools/ftms-lab", pageStamp("/tools/ftms-lab")],
    ["/tools/cycling-power-lab", pageStamp("/tools/cycling-power-lab")],
    ["/tools/ble-gatt-explorer", pageStamp("/tools/ble-gatt-explorer")],
    ["/tools/apple-health-explorer", pageStamp("/tools/apple-health-explorer")],
    ["/tools/rep-counter-playground", pageStamp("/tools/rep-counter-playground")],
    ["/tools/exercise-form-rules", FORM_RULES_FETCHED_ON],
    ["/tools/build-plan", PLANNER_READ_ON],
    ["/tools/store-submission-checklist", PLANNER_READ_ON],
    ["/tools/compliance-wizard", PLANNER_READ_ON],
    // The newest date any vendor in them was read (lib/coverageView).
    ["/tools/api-coverage-matrix", COVERAGE_UPDATED],
    ["/tools/rate-limit-calculator", RATE_UPDATED],
    ["/tools/exercise-taxonomy-crosswalk", ET_FETCHED_ON],
    ["/tools/gym-software-api-matrix", GYM_API_MATRIX.checkedOn],
    ["/tools/research-platform-chooser", RESEARCH_PLATFORM_MATRIX.checkedOn],
    ["/tools/oauth-playground", OAUTH_FETCHED_ON],
    ["/tools/schema-converter", UNIFIED_READ_ON],
    ["/tools/fitbit-to-google-health", FG_UPDATED],
  ];

  // Routes whose date comes from data, or from the members they index.
  // Anything not named here falls to pageStamp(), which dates it only if the
  // page states its own dateModified.
  const derived: Record<string, string | undefined> = {
    "/": newestAll,
    "/changes": pageStamp("/changes") ?? newestChange,
    "/blog": newestPost,
    [HK_BASE]: newest([...hkGroupDates.map(([, d]) => d), ...hkPages.map(([, d]) => d)]),
    "/tools": newest(tools.map(([, d]) => d)),
    // The unified schema page declares the newest read date of its inputs.
    "/schema": UNIFIED_READ_ON,
    [DIGEST_PATH]: newest(issues.map(digestDate)),
    "/sdk-releases": SDK_CHECKED_ON ?? undefined,
    // The directory pages carry a page-local "last reviewed", not a
    // dateModified, and apis.ts records no verification date — so the hub
    // and its entries stay undated rather than borrow one.
    [APIS_PATH]: undefined,
    // The map is drawn from the same directory, so it is undated for the same
    // reason. The index declares the newest date any of its inputs was written
    // or checked, and this reads the same function.
    [MARKET_MAP_PATH]: undefined,
    [API_INDEX_PATH]: indexDataDate(),
    // The daily puzzle declares the newest read date of the datasets its
    // bank draws from, not the date of today's draw: the page itself is the
    // same static file every day.
    [DAILY_PATH]: dailyDataDate(),
    // The 2026 story declares the newest date any of its inputs was written
    // or checked, through the same function.
    [YEAR_PATH]: yearDataDate(),
    // The graveyard declares the newest day any entry's source was read as its
    // dateModified; this reads the same function.
    [GRAVEYARD_PATH]: graveyardCheckedOn(),
    // The webhook payload library declares the day its vendor pages were read.
    "/webhooks": WEBHOOKS_FETCHED_ON,
    // The press page declares the newest date any of its inputs was written
    // or checked, through the same function.
    [PRESS_PATH]: pressDataDate(),
    // The poster declares the newest date its inputs were checked.
    [ATLAS_PATH]: atlasAsOf(),
  };

  const standalone = [
    "/",
    "/privacy",
    "/google-fit-shutdown",
    "/methodology",
    "/day-boundaries",
    "/challenge",
    "/glossary",
    "/picker",
    "/cost-planner",
    "/ai-fitness-app",
    "/no-code-fitness-app",
    "/fitbit-api-shutdown",
    "/state-of-fitness-apis-2026",
    YEAR_PATH,
    "/changes",
    "/matrix",
    HK_BASE,
    // "/questions" and /questions/<cluster> are noindex,follow since
    // 2026-10-12 (GROWTH-30 #16), so they are not listed here.
    // Only listed once CI has populated the tracker — the route 404s while
    // it is empty, and a sitemap must never advertise a 404.
    ...(SDK_REPOS.length > 0 ? ["/sdk-releases"] : []),
    "/blog",
    // /changelog is noindex,follow since 2026-11-05 (ops/MORE-30-2026-11-05.md
    // item 7): a ledger that drew impressions and no clicks. Linked from the
    // footer, so it stays reachable without asking to be indexed.
    "/newsletter",
    "/tools",
    "/paths",
    "/corrections",
    "/gates",
    "/about",
    // /site-index is deliberately absent: it is noindex,follow (see
    // src/app/site-index/page.tsx), and a sitemap entry is a request to
    // index. It stays linked from the header, so it keeps its crawl-aid job
    // without asking for the indexing we just removed. SITEMAP-NOINDEX in
    // qa.mjs stops it, or anything else noindexed, coming back.
    APIS_PATH,
    MARKET_MAP_PATH,
    ATLAS_PATH,
    API_INDEX_PATH,
    DAILY_PATH,
    GRAVEYARD_PATH,
    "/webhooks",
    PRESS_PATH,
    "/alerts",
    "/my-stack",
    "/answers-search",
    "/compare-apis",
    "/play/ship-it",
    "/datasets",
    "/schema",
    "/developers",
    "/badges",
    DIGEST_PATH,
  ];

  // hreflang alternates for each current translation, on both rows — the
  // same three the two pages declare in their own <head> (qa: PTBR-HREFLANG
  // for the pages, PTBR-SITEMAP-HREFLANG for these). A stale translation is
  // out of the sitemap and so are its alternates.
  const current = ptPages().filter((p) => p.status === "current");
  const pairs = new Map<string, SitemapAlternate[]>();
  for (const p of current) {
    const alts: SitemapAlternate[] = [
      { hreflang: "en", href: absoluteUrl(p.t.enPath) },
      { hreflang: "pt-BR", href: absoluteUrl(p.t.path) },
      { hreflang: "x-default", href: absoluteUrl(p.t.enPath) },
    ];
    pairs.set(p.t.enPath, alts);
    pairs.set(p.t.path, alts);
  }

  // One child sitemap per section of the site. Each row sits in exactly one
  // (qa: SITEMAP-DUPLICATE), and the index dates each child by the newest
  // lastmod among its own rows — never by the build.
  const standaloneRows = standalone.map((p) => row(p, p in derived ? derived[p] : pageStamp(p)));
  const sections: Record<SitemapSectionId, SitemapRow[]> = {
    pages: [
      ...standaloneRows.filter((r) => !isHk(r.path)),
      ...tools.map(([p, d]) => row(p, d)),
    ],
    // Hubs carry the dateModified they declare (see the header comment),
    // else their newest page; spokes carry their own re-verification date —
    // the point of the `updated` stamp is that a recrawl scheduler should
    // see it.
    guides: [
      ...populated.map(([base]) => row(base, pageStamp(base) ?? newestIn(base))),
      ...populated.flatMap(([base, entries]) => entries.map((e) => row(`${base}/${e.slug}`, e.updated))),
    ],
    healthkit: [...standaloneRows.filter((r) => isHk(r.path)), ...hkPages.map(([p, d]) => row(p, d)), ...hkGroups, ...hkVersionRows, ...typePageRows.filter((r) => isHk(r.path))],
    reference: [
      ...hcRows,
      ...typePageRows.filter((r) => !isHk(r.path)),
      ...ghapiRows,
      ...generatedRefs.map(([p, d]) => row(p, d)),
      ...btRows,
      ...wtRows,
    ],
    libraries: libRows,
    // Products without search demand of their own are noindex (NOINDEX_APIS).
    apis: API_ENTRIES.filter((a) => !NOINDEX_APIS.has(a.id)).map((a) => row(`${APIS_PATH}/${a.id}`)),
    blog: [
      // lastmod is the re-verification date, not first publication.
      ...posts.map((post) => row(`/blog/${post.slug}`, post.updated)),
      ...issues.map((d) => row(`${DIGEST_PATH}/${d.month}`, digestDate(d))),
    ],
    // The Portuguese edition (src/lib/translations.ts): only translations
    // that are current, each dated by its translation day, which is the
    // dateModified the page declares. A stale one is noindex and absent.
    // The index is listed once it is indexable, dated by the newest
    // translation it lists (its declared dateModified).
    "pt-br": [
      ...current.map((p) => row(p.t.path, p.t.translatedOn)),
      ...(ptIndexIndexable() ? [row(PT_PREFIX, newest(ptPages().map((p) => p.t.translatedOn)))] : []),
    ],
  };

  // Pages that ask not to be indexed leave the sitemap in one place, whatever
  // section listed them: the hand-written list and the data-driven rule for
  // generated pages (src/data/noindex.ts, src/data/indexDemand.ts;
  // ops/SEO-10-2026-10-27.md item 4). A sitemap row is a request to index, so
  // listing a noindex page would contradict the page (qa: SITEMAP-NOINDEX).
  return SITEMAP_SECTIONS.map((id) => {
    const rows = sections[id]
      .filter((r) => !isNoindexed(r.path))
      .map((r) => (pairs.has(r.path) ? { ...r, alternates: pairs.get(r.path) } : r));
    return { id, rows, lastmod: newest(rows.map((r) => r.lastmod)) };
  });
}

/** The HealthKit section: the /healthkit hub's pages and the per-identifier
 *  and per-version references. */
function isHk(p: string): boolean {
  return p === HK_BASE || p.startsWith(`${HK_BASE}/`) || p.startsWith("/healthkit-");
}

/** The sections, memoised for the build: the index and every child
 *  route read the same computation. */
let cached: SitemapSection[] | null = null;
export function sitemapSections(): SitemapSection[] {
  cached ??= computeSections();
  return cached;
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** The lastmod string as the sitemap has always written it (an ISO instant
 *  at midnight UTC), so a consumer diffing old against new — indexnow.mjs's
 *  snapshot — sees no change where the date did not change. */
const stamp = (d: string) => new Date(`${d}T00:00:00Z`).toISOString();

export const sitemapChildPath = (id: SitemapSectionId) => `/sitemaps/${id}.xml`;

/** /sitemap.xml: the index. Its URL is the one robots.txt, Search Console
 *  and Bing Webmaster Tools already hold. An empty section is left out — a
 *  sitemap with no <url> is an error to Search Console. */
export function sitemapIndexXml(): string {
  const items = sitemapSections()
    .filter((s) => s.rows.length > 0)
    .map(
      (s) =>
        `<sitemap>\n<loc>${xmlEscape(absoluteUrl(sitemapChildPath(s.id)))}</loc>\n` +
        (s.lastmod ? `<lastmod>${stamp(s.lastmod)}</lastmod>\n` : "") +
        `</sitemap>`,
    );
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</sitemapindex>\n`
  );
}

/** One child sitemap, or null for a section with no rows. */
export function sitemapChildXml(id: string): string | null {
  const s = sitemapSections().find((x) => x.id === id);
  if (!s || s.rows.length === 0) return null;
  const hasAlternates = s.rows.some((r) => r.alternates);
  const urls = s.rows.map(
    (r) =>
      `<url>\n<loc>${xmlEscape(absoluteUrl(r.path))}</loc>\n` +
      (r.alternates ?? [])
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}" />\n`)
        .join("") +
      (r.lastmod ? `<lastmod>${stamp(r.lastmod)}</lastmod>\n` : "") +
      `</url>`,
  );
  const ns = `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasAlternates ? ` xmlns:xhtml="http://www.w3.org/1999/xhtml"` : ""}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>\n${urls.join("\n")}\n</urlset>\n`;
}
