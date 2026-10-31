import { API_ENTRIES, APIS_PATH, CATEGORY_LABELS, DEV_COST_LABELS, type ApiEntry } from "@/data/apis";
import { CATEGORY_ORDER, type CostCategory, type DevCost } from "@/data/costModel";
import { LIBRARIES, LIBRARIES_FETCHED_ON, type LibraryGroup } from "@/data/libraries";
import { LIBRARIES_BASE, LIBRARY_GROUPS } from "@/data/librariesEditorial";
import { SDK_REPOS, SDK_CHECKED_ON } from "@/data/sdkReleases";
import { HC_RELEASES, HC_RELEASES_FETCHED_ON, HC_RELEASES_SOURCE } from "@/data/hcReleases";
import { CHANGE_EVENTS } from "@/data/changes";
import { allSpokes } from "@/lib/clusterRegistry";
import { changesFor, countMatches, pageCount } from "@/lib/apiCoverage";
import { derive, type IndexRow, type PackageSignal } from "@/lib/ecosystemDerive";

export type { IndexRow, PackageSignal };

/**
 * The data behind /market-map and /fitness-api-index, computed from modules
 * the repo already holds. Nothing here is typed in by hand: every value is a
 * field of a generated or provenance-tracked module, or a count/date derived
 * from one, and each derivation is stated in the methodology on the page.
 *
 * Joining products to packages and changes is done by the product's proper
 * name (the directory's `aliases`), case-sensitive with word boundaries — the
 * same matcher lib/apiCoverage.ts uses, for the same reason: "Polar" the
 * vendor, not polar coordinates.
 *
 * Windowed counts ("last 12 months") and ages are NOT computed here. They
 * depend on the day they are read, so the server renders them as of the
 * build and the browser recomputes them against today; only the dates
 * travel to the client.
 */

export const MARKET_MAP_PATH = "/market-map";
export const API_INDEX_PATH = "/fitness-api-index";
export const MARKET_MAP_EMBED_PATH = "/embed/market-map";

/** The one product whose company funds this site. Never ranked. */
export const FIRST_PARTY_ID = "kinestex";

/** The existing open dataset generated from the same cost model (scripts/build-datasets.mjs). */
export const ACCESS_DATASET = "fitness-apis-2026";

export type MapItem = {
  id: string;
  label: string;
  short: string;
  href: string;
  category: CostCategory;
  devCost: DevCost;
  devCostLabel: string;
  gated: boolean;
  userSideCost: boolean;
  /** Library groups (libraries.ts `group`) of packages whose registry metadata names this product. */
  groups: LibraryGroup[];
  pages: number;
  firstParty: boolean;
};

export const GROUP_LABELS: Record<LibraryGroup, string> = Object.fromEntries(
  LIBRARY_GROUPS.map((g) => [g.id, g.label]),
) as Record<LibraryGroup, string>;

export const CATEGORIES: { id: CostCategory; label: string }[] = CATEGORY_ORDER.filter((c) =>
  API_ENTRIES.some((a) => a.category === c),
).map((c) => ({ id: c, label: CATEGORY_LABELS[c] }));

function names(api: ApiEntry, hay: string | null | undefined): boolean {
  if (!hay) return false;
  return api.aliases.some((a) => countMatches(hay, a) > 0);
}

/** Packages in libraries.ts whose registry-stated `wraps` names the product. */
function librariesFor(api: ApiEntry) {
  return LIBRARIES.filter((l) => (l.wraps ?? []).some((w) => names(api, w)));
}

/** Repos in sdkReleases.ts whose `covers` names the product. */
function sdkReposFor(api: ApiEntry) {
  return SDK_REPOS.filter((r) => names(api, r.covers));
}

export function marketMapItems(): MapItem[] {
  return API_ENTRIES.map((a) => ({
    id: a.id,
    label: a.label,
    short: a.short,
    href: `${APIS_PATH}/${a.id}`,
    category: a.category,
    devCost: a.devCost,
    devCostLabel: DEV_COST_LABELS[a.devCost],
    gated: a.approvalGate !== null,
    userSideCost: a.userSideCost !== null,
    groups: [...new Set(librariesFor(a).map((l) => l.group))],
    pages: pageCount(a.id),
    firstParty: a.id === FIRST_PARTY_ID,
  }));
}

/* ───────────────────────────── The index ───────────────────────────── */

const spokeByPath = () => new Map(allSpokes().map(({ basePath, entry }) => [`${basePath}/${entry.slug}`, entry]));

export function indexRows(): IndexRow[] {
  const spokes = spokeByPath();
  const pricing = allSpokes().filter(({ basePath }) => basePath === "/pricing");

  return API_ENTRIES.map((a) => {
    const libs = librariesFor(a);
    const repos = sdkReposFor(a);
    const packages: PackageSignal[] = libs.map((l) => {
      const repo = repos.find((r) => r.repo === l.repoFullName || r.repo === l.repo);
      const gh = repo?.releases.filter((r) => !r.prerelease && r.publishedAt).map((r) => r.publishedAt as string) ?? [];
      const latest = [l.latestPublished, ...gh].sort().at(-1) ?? null;
      return {
        name: l.name,
        href: `${LIBRARIES_BASE}/${l.slug}`,
        latest,
        source: repo ? "libraries.ts + sdkReleases.ts" : "libraries.ts",
        deprecated: l.deprecated !== null || (l.repoStats?.archived ?? false),
      };
    });
    for (const r of repos) {
      if (libs.some((l) => r.repo === l.repoFullName || r.repo === l.repo)) continue;
      const latest = r.releases.filter((x) => !x.prerelease && x.publishedAt).map((x) => x.publishedAt as string).sort().at(-1) ?? null;
      packages.push({ name: r.label, href: null, latest, source: "sdkReleases.ts", deprecated: r.archived });
    }

    const officialSdk =
      a.id === "health-connect"
        ? {
            name: "androidx.health.connect:connect-client",
            source: HC_RELEASES_SOURCE,
            dates: HC_RELEASES.flatMap((r) => (r.date ? [r.date] : [])),
            latestVersion: HC_RELEASES[0]?.version ?? null,
          }
        : null;

    const pricingSpoke = pricing.find(({ entry }) => names(a, entry.h1));
    const source = spokes.get(a.sourceHref);

    return {
      id: a.id,
      label: a.label,
      short: a.short,
      href: `${APIS_PATH}/${a.id}`,
      categoryLabel: CATEGORY_LABELS[a.category],
      firstParty: a.id === FIRST_PARTY_ID,
      devCost: a.devCost,
      devCostLabel: DEV_COST_LABELS[a.devCost],
      quoteOnly: a.devCost === "contact-sales",
      approvalGate: a.approvalGate,
      userSideCost: a.userSideCost,
      pricingPage: pricingSpoke
        ? { href: `/pricing/${pricingSpoke.entry.slug}`, label: pricingSpoke.entry.h1 }
        : null,
      officialSdk,
      packages,
      changes: changesFor(a).map((e) => ({
        date: e.date,
        sortDate: e.sortDate,
        title: e.title,
        status: e.status,
        href: e.page.href,
      })),
      pages: pageCount(a.id),
      verified: source ? { date: source.updated, href: a.sourceHref, label: source.h1 } : null,
    };
  });
}

/** The dates of every input the index reads, for the methodology and the page's dateModified. */
export function indexInputDates() {
  const changesVerified = CHANGE_EVENTS.map((e) => e.verifiedOn).sort().at(-1) ?? null;
  const verified = indexRows()
    .flatMap((r) => (r.verified ? [r.verified.date] : []))
    .sort();
  return {
    sdkReleases: SDK_CHECKED_ON,
    libraries: LIBRARIES_FETCHED_ON,
    hcReleases: HC_RELEASES_FETCHED_ON,
    changes: changesVerified,
    verifiedOldest: verified[0] ?? null,
    verifiedNewest: verified.at(-1) ?? null,
  };
}

/**
 * The newest date any input to the index was written or checked. It is the
 * page's dateModified (and its sitemap lastmod): the table can only change
 * when one of these moves. The ages and windowed counts move daily, which is
 * why they are recomputed in the browser instead of being dated.
 */
export function indexDataDate(): string {
  const d = indexInputDates();
  return [d.sdkReleases, d.libraries, d.hcReleases, d.changes, d.verifiedNewest]
    .filter((x): x is string => Boolean(x))
    .sort()
    .at(-1) as string;
}

/* ─────────────────────────── Downloads ─────────────────────────── */

/**
 * The index as one flat record per product, for /fitness-api-index/data.json
 * and data.csv. Same function, same as-of date as the page's server render.
 * Not a versioned dataset under public/datasets: those are pinned, idempotent
 * files with no generation date, and this one is defined by its as-of date.
 */
export function indexExport(asOf: string) {
  return indexRows().map((r) => {
    const d = derive(r, asOf);
    return {
      id: r.id,
      product: r.label,
      category: r.categoryLabel,
      ranked: !r.firstParty,
      note: r.firstParty ? "Funds aifitnessapi.com; not ranked" : null,
      billing: r.devCost,
      no_public_price: r.quoteOnly,
      approval_gate: r.approvalGate,
      user_side_cost: r.userSideCost,
      pricing_page: r.pricingPage ? r.pricingPage.href : null,
      vendor_sdk: r.officialSdk?.name ?? null,
      vendor_sdk_releases_12mo: d.sdkReleases12,
      vendor_sdk_last_release: d.sdkLatest,
      packages_tracked: d.packageCount,
      packages_released_12mo: d.packagesActive12,
      newest_package_release: d.packageLatest,
      tracked_changes_12mo: d.changes12,
      tracked_changes_dated_ahead: d.changesAhead,
      latest_tracked_change: d.changeLatest?.date ?? null,
      pages_here: r.pages,
      last_verified: r.verified?.date ?? null,
      verified_age_days: d.verifiedAge,
      verified_on_page: r.verified?.href ?? null,
      directory_page: r.href,
    };
  });
}
