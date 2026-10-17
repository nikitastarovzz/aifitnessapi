import { VENDOR_HUBS, type VendorHub } from "@/data/vendorHubs";
import { getApi } from "@/data/apis";
import { routeLabel } from "@/lib/routeLabel";

/**
 * Resolves data/vendorHubs.ts into the menu a page renders: which vendors the
 * page belongs to, every page about them grouped by what the reader came for,
 * and each page named by its own H1. Server-side only.
 *
 * A config the pages cannot back (an unknown product id, a hub missing from
 * its own list, a page with no title anywhere in the data) throws, so the
 * build stops on the page that renders the menu instead of shipping a link
 * labelled with a bare path.
 */

export const INTENTS = [
  { key: "integrate", label: "Integration guide", plural: "Integration guides" },
  { key: "pricing", label: "Pricing", plural: "Pricing" },
  { key: "alternatives", label: "Alternatives", plural: "Alternatives" },
  { key: "compare", label: "Comparisons", plural: "Comparisons" },
  { key: "fix", label: "Errors and fixes", plural: "Errors and fixes" },
  { key: "libraries", label: "Libraries", plural: "Libraries" },
  { key: "migrate", label: "Migration", plural: "Migration" },
  { key: "reference", label: "Reference", plural: "Reference" },
  { key: "directory", label: "Directory entry", plural: "Directory entries" },
] as const;

export type Intent = (typeof INTENTS)[number]["key"];

/** A page's group by its section. */
const INTENT_OF_SECTION: Record<string, Intent> = {
  integrate: "integrate",
  pricing: "pricing",
  alternatives: "alternatives",
  compare: "compare",
  fix: "fix",
  "error-codes": "fix",
  libraries: "libraries",
  migrate: "migrate",
  apis: "directory",
};

/** Pages whose group is not the one their address implies. */
const INTENT_OF_PAGE: Record<string, Intent> = {
  "/fitbit-api-shutdown": "migrate",
  "/google-fit-shutdown": "migrate",
  "/healthkit-errors": "fix",
  "/error-codes": "fix",
};

/**
 * Which group a page is listed under, from its address: its section where
 * the section is one intent (every /pricing page is pricing), a head-to-head
 * filed elsewhere (/fitness-apis/terra-vs-vital) under comparisons — except
 * a library comparison, which stays with the libraries — and everything else
 * (the generated references, the /data guides) under reference.
 */
export function intentOf(path: string): Intent {
  const fixed = INTENT_OF_PAGE[path];
  if (fixed) return fixed;
  const [section, ...rest] = path.split("/").filter(Boolean);
  if (rest.length && INTENT_OF_SECTION[section]) return INTENT_OF_SECTION[section];
  if (rest.at(-1)?.includes("-vs-")) return "compare";
  return "reference";
}

/** A trailing "(2026)" on an H1 is the page's own freshness claim, checked
 *  against its own stamp; repeated down a list of links it is noise. */
const YEAR_MARKER = /\s*\((?:19|20)\d{2}\)$/;

/** A page's name in the menu: its H1, minus a trailing year marker. */
export function menuLabel(path: string): string {
  const label = routeLabel(path);
  if (!label) {
    throw new Error(
      `vendorHubs: ${path} has no title in the site's data (lib/routeLabel) — fix the path in src/data/vendorHubs.ts, or give a hand-built page its H1 in src/data/pageTitles.ts`,
    );
  }
  return label.replace(YEAR_MARKER, "");
}

export function vendorName(v: VendorHub): string {
  const api = getApi(v.id);
  if (!api) throw new Error(`vendorHubs: "${v.id}" is not a product id in src/data/apis.ts`);
  return api.short;
}

let CHECKED = false;
function checkConfig(): void {
  if (CHECKED) return;
  for (const v of VENDOR_HUBS) {
    vendorName(v);
    if (!v.pages.includes(v.hub)) throw new Error(`vendorHubs: ${v.id}'s hub ${v.hub} is not in its own pages`);
    const dup = v.pages.find((p, i) => v.pages.indexOf(p) !== i);
    if (dup) throw new Error(`vendorHubs: ${v.id} lists ${dup} twice`);
    v.pages.forEach(menuLabel);
  }
  CHECKED = true;
}

export type MenuItem = { path: string; label: string; current: boolean; hub: boolean };
export type MenuGroup = { intent: Intent; label: string; items: MenuItem[] };
export type VendorMenu = {
  ids: string[];
  names: string[];
  placement: "top" | "end";
  groups: MenuGroup[];
};

/**
 * The menu one placement of a page renders, or null.
 *
 * "top" is for the vendors whose hub this page is: their menu leads the page.
 * "end" is for every other vendor the page belongs to, rendered as one menu
 * when there are several (a comparison, a shared pricing page, a library for
 * both stores), so a page shared by four aggregators lists its pages once
 * rather than four times.
 */
export function vendorMenu(path: string, placement: "top" | "end"): VendorMenu | null {
  checkConfig();
  const vendors = VENDOR_HUBS.filter(
    (v) => v.pages.includes(path) && (v.hub === path) === (placement === "top"),
  );
  if (vendors.length === 0) return null;

  // Name the vendors in the order the page itself names them ("Oura vs
  // WHOOP"), falling back to the config's order for the ones it does not.
  const own = menuLabel(path);
  const at = (v: VendorHub) => {
    const i = own.indexOf(vendorName(v));
    return i === -1 ? Number.POSITIVE_INFINITY : i;
  };
  const ordered = vendors
    .map((v, i) => ({ v, i }))
    .sort((a, b) => at(a.v) - at(b.v) || a.i - b.i)
    .map(({ v }) => v);

  const hubs = new Set(ordered.map((v) => v.hub));
  const seen = new Set<string>();
  const byIntent = new Map<Intent, MenuItem[]>();
  for (const v of ordered) {
    for (const p of v.pages) {
      if (seen.has(p)) continue;
      seen.add(p);
      const intent = intentOf(p);
      const list = byIntent.get(intent) ?? [];
      list.push({ path: p, label: menuLabel(p), current: p === path, hub: hubs.has(p) });
      byIntent.set(intent, list);
    }
  }

  const groups: MenuGroup[] = INTENTS.flatMap((i) => {
    const items = byIntent.get(i.key);
    if (!items) return [];
    return [{ intent: i.key, label: items.length > 1 ? i.plural : i.label, items }];
  });

  return {
    ids: ordered.map((v) => v.id),
    names: ordered.map(vendorName),
    placement,
    groups,
  };
}
