import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
import { SDK_REPOS, SDK_CHECKED_ON } from "@/data/sdkReleases";
import { clusterMap } from "@/lib/clusterRegistry";
import { releasedHkGroups, HK_BASE, hkGroupModified } from "@/data/hkGroupPages";
import { hkStandaloneModified } from "@/data/hkStandalone";
import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { changesSorted } from "@/data/changes";
import { API_ENTRIES, APIS_PATH } from "@/data/apis";
import { digests, DIGEST_PATH, type Digest } from "@/data/digest";
import { HC_FETCHED_ON } from "@/data/healthConnectRecords";
import { orderedRecords, recordPath, HC_BASE, HC_PERMISSIONS_PATH, HC_AGGREGATES_PATH, hcModified } from "@/data/hcPages";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, libraryPages, librariesModified } from "@/data/librariesEditorial";
import { hkVersionPages, HK_VERSION_PAGES_PUBLISHED } from "@/lib/hkVersions";
import { ERROR_CODES_FETCHED_ON } from "@/data/errorCodes";
import { HC_RELEASES_FETCHED_ON } from "@/data/hcReleases";

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

/** A row, dated only when the date is a real calendar day. A malformed stamp
 *  drops the lastmod instead of throwing at `toISOString()` or guessing. */
function row(p: string, date?: string | null): MetadataRoute.Sitemap[number] {
  return date && ISO_DAY.test(date)
    ? { url: absoluteUrl(p), lastModified: new Date(`${date}T00:00:00Z`) }
    : { url: absoluteUrl(p) };
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

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Open-source library pages: hub, package pages and comparisons all
  // declare librariesModified() as dateModified.
  const libRows = [
    row(LIBRARIES_BASE, librariesModified()),
    ...libraryPages().map(({ ed }) => row(`${LIBRARIES_BASE}/${ed.slug}`, librariesModified())),
    ...LIBRARY_COMPARISONS.map((c) => row(`${LIBRARIES_BASE}/compare/${c.slug}`, librariesModified())),
  ];

  // Generated error-code and release references: each page's dateModified is
  // its generator's fetch date.
  const generatedRefs: [string, string][] = [
    ["/error-codes", ERROR_CODES_FETCHED_ON],
    ["/error-codes/health-connect", ERROR_CODES_FETCHED_ON],
    ["/health-connect-releases", HC_RELEASES_FETCHED_ON],
  ];

  // The list is empty until the authored entries land, and an empty list
  // emits no rows.
  const hkGroupDates = releasedHkGroups().map((g) => [g.slug, hkGroupModified(g.slug)] as const);
  const hkGroups = hkGroupDates.map(([slug, d]) => row(`${HK_BASE}/${slug}`, d));

  // Tools: the three built on the HealthKit corpus declare HK_FETCHED_ON as
  // dateModified; the other three carry a page-local UPDATED.
  const tools: [string, string | undefined][] = [
    ["/tools/error-diagnoser", HK_FETCHED_ON],
    ["/tools/aggregation-checker", HK_FETCHED_ON],
    ["/tools/identifier-translator", HK_FETCHED_ON],
    ["/tools/permission-builder", pageStamp("/tools/permission-builder")],
    ["/tools/query-generator", pageStamp("/tools/query-generator")],
    ["/tools/stack-generator", pageStamp("/tools/stack-generator")],
  ];

  // Routes whose date comes from data, or from the members they index.
  // Anything not named here falls to pageStamp(), which dates it only if the
  // page states its own dateModified.
  const derived: Record<string, string | undefined> = {
    "/": newestAll,
    "/changes": pageStamp("/changes") ?? newestChange,
    "/blog": newestPost,
    "/questions": newestAll,
    [HK_BASE]: newest([...hkGroupDates.map(([, d]) => d), ...hkPages.map(([, d]) => d)]),
    "/tools": newest(tools.map(([, d]) => d)),
    [DIGEST_PATH]: newest(issues.map(digestDate)),
    "/sdk-releases": SDK_CHECKED_ON ?? undefined,
    // The directory pages carry a page-local "last reviewed", not a
    // dateModified, and apis.ts records no verification date — so the hub
    // and its entries stay undated rather than borrow one.
    [APIS_PATH]: undefined,
  };

  const standalone = [
    "/",
    "/privacy",
    "/google-fit-shutdown",
    "/methodology",
    "/day-boundaries",
    "/glossary",
    "/picker",
    "/cost-planner",
    "/ai-fitness-app",
    "/no-code-fitness-app",
    "/fitbit-api-shutdown",
    "/state-of-fitness-apis-2026",
    "/changes",
    "/matrix",
    HK_BASE,
    "/questions",
    // Only listed once CI has populated the tracker — the route 404s while
    // it is empty, and a sitemap must never advertise a 404.
    ...(SDK_REPOS.length > 0 ? ["/sdk-releases"] : []),
    "/blog",
    "/changelog",
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
    "/alerts",
    "/compare-apis",
    "/datasets",
    "/badges",
    DIGEST_PATH,
  ];

  return [
    ...standalone.map((p) => row(p, p in derived ? derived[p] : pageStamp(p))),
    ...hkPages.map(([p, d]) => row(p, d)),
    ...tools.map(([p, d]) => row(p, d)),
    // Hubs carry the dateModified they declare (see the header comment),
    // else their newest page; spokes carry their own re-verification date —
    // the point of the `updated` stamp is that a recrawl scheduler should
    // see it.
    ...populated.map(([base]) => row(base, pageStamp(base) ?? newestIn(base))),
    ...populated.flatMap(([base, entries]) => entries.map((e) => row(`${base}/${e.slug}`, e.updated))),
    // One question index per populated cluster, as fresh as the newest
    // entry whose questions it lists.
    ...populated.map(([base]) => row(`/questions${base}`, newestIn(base))),
    ...hkGroups,
    ...hkVersionRows,
    ...hcRows,
    ...libRows,
    ...generatedRefs.map(([p, d]) => row(p, d)),
    ...API_ENTRIES.map((a) => row(`${APIS_PATH}/${a.id}`)),
    ...issues.map((d) => row(`${DIGEST_PATH}/${d.month}`, digestDate(d))),
    // lastmod is the re-verification date, not first publication.
    ...posts.map((post) => row(`/blog/${post.slug}`, post.updated)),
  ];
}
