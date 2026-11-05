import { API_ENTRIES, APIS_PATH, CATEGORY_LABELS } from "@/data/apis";
import { changesSorted } from "@/data/changes";
import { STATUS_LABEL, GRAVEYARD_PATH } from "@/data/graveyard";
import { VENDOR_HUBS } from "@/data/vendorHubs";
import { coverageFor, changesFor } from "@/lib/apiCoverage";
import { allSpokes } from "@/lib/clusterRegistry";
import { routeLabel } from "@/lib/routeLabel";
import { sitemapSections } from "@/lib/sitemap";
import { vendorChangesPath, vendorFeedPath, vendorTimeline } from "@/lib/vendorChanges";
import { countdownFor, gravesFor, vendorDeadlines, type DeadlineItem } from "@/lib/vendorDeadlines";
import { intentOf, INTENTS } from "@/lib/vendorMenu";
import type { TrackerEvent } from "@/lib/stackFeeds.mjs";

/**
 * The data behind /my-stack (ops/AUDIENCE-30-2026-11-05.md item 24): for
 * every product in the /apis directory, what this site already holds about it.
 * Computed at build from the modules the other pages render, so the dashboard
 * adds no claim of its own:
 *
 *  - tracked changes: changesFor (lib/apiCoverage.ts), the rule the /apis
 *    pages and the vendor timelines use;
 *  - stones: gravesFor (lib/vendorDeadlines.ts), the same word match over the
 *    Fitness API Graveyard;
 *  - pages: the vendor's menu (data/vendorHubs.ts) where it has one, otherwise
 *    the pages lib/apiCoverage.ts says cover it, each named by its own H1;
 *  - page dates: the date each page declares (a spoke's `updated`, otherwise
 *    the lastmod the sitemap gives it), or null where it declares none.
 *
 * The reader's choice of products never leaves the browser.
 */

export type StackPage = { href: string; label: string; group: string; date: string | null };

export type StackGrave = {
  id: string;
  name: string;
  status: string;
  end: string | null;
  endLabel: string;
  quote: string;
  publisher: string;
  checkedOn: string;
  href: string;
};

export type StackVendor = {
  id: string;
  short: string;
  label: string;
  category: string;
  directory: string;
  hub: string | null;
  timeline: string | null;
  feed: string | null;
  countdown: string | null;
  firstParty: boolean;
  pages: StackPage[];
  /** Indexes into StackData.changes. */
  changes: number[];
  /** Indexes into StackData.graves. */
  graves: number[];
  deadlines: DeadlineItem[];
};

export type StackData = {
  vendors: StackVendor[];
  changes: TrackerEvent[];
  graves: StackGrave[];
  categories: { key: string; label: string }[];
};

const COVERAGE_PAGES = 8;

function pageDates(): Map<string, string> {
  const m = new Map<string, string>();
  for (const s of sitemapSections()) for (const r of s.rows) if (r.lastmod) m.set(r.path, r.lastmod);
  // A spoke's own review date wins: it is the stamp the page renders, and it
  // is there even for a spoke the sitemap leaves out (noindex).
  for (const { basePath, entry } of allSpokes()) if (entry.updated) m.set(`${basePath}/${entry.slug}`, entry.updated);
  return m;
}

const groupLabel = (href: string) => INTENTS.find((i) => i.key === intentOf(href))?.label ?? "Reference";

export function stackData(): StackData {
  const dates = pageDates();
  const changes = changesSorted();
  const changeIndex = new Map(changes.map((c, i) => [c, i]));
  const graveList: StackGrave[] = [];
  const graveIndex = new Map<string, number>();

  const vendors: StackVendor[] = API_ENTRIES.map((api) => {
    const hubEntry = VENDOR_HUBS.find((h) => h.id === api.id);
    const directory = `${APIS_PATH}/${api.id}`;
    const hrefs = hubEntry
      ? hubEntry.pages
      : [
          ...coverageFor(api.id)
            .flatMap((c) => c.pages)
            .sort((a, b) => b.score - a.score)
            .slice(0, COVERAGE_PAGES)
            .map((p) => p.href),
          directory,
        ];
    const pages = [...new Set(hrefs)].flatMap((href) => {
      const label = routeLabel(href);
      return label ? [{ href, label, group: groupLabel(href), date: dates.get(href) ?? null }] : [];
    });

    const graves = gravesFor(api).map((g) => {
      if (!graveIndex.has(g.id)) {
        graveIndex.set(g.id, graveList.length);
        graveList.push({
          id: g.id,
          name: g.name,
          status: STATUS_LABEL[g.status],
          end: g.end,
          endLabel: g.endLabel,
          quote: g.source.quote,
          publisher: g.source.publisher,
          checkedOn: g.source.checkedOn,
          href: `${GRAVEYARD_PATH}#${g.id}`,
        });
      }
      return graveIndex.get(g.id)!;
    });

    const timeline = vendorTimeline(api.id);
    return {
      id: api.id,
      short: api.short,
      label: api.label,
      category: api.category,
      directory,
      hub: hubEntry?.hub ?? null,
      timeline: timeline ? vendorChangesPath(api.id) : null,
      feed: timeline ? vendorFeedPath(api.id) : null,
      countdown: countdownFor(api.id),
      firstParty: api.id === "kinestex",
      pages,
      changes: changesFor(api).map((c) => changeIndex.get(c)!),
      graves,
      deadlines: vendorDeadlines(api),
    };
  });

  const used = [...new Set(API_ENTRIES.map((a) => a.category))];
  return {
    vendors,
    changes: changes.map((c) => ({
      date: c.date,
      sortDate: c.sortDate,
      title: c.title,
      summary: c.summary,
      status: c.status,
      page: c.page,
      verifiedOn: c.verifiedOn,
    })),
    graves: graveList,
    categories: used.map((key) => ({ key, label: CATEGORY_LABELS[key] })),
  };
}
