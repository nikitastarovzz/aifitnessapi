import { CHANGE_EVENTS, type ChangeStatus } from "@/data/changes";
import { GRAVEYARD, GRAVEYARD_PATH, STATUS_LABEL, type GraveStatus } from "@/data/graveyard";
import { PUBLISHED } from "@/data/published";
import { CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { routeLabel } from "@/lib/routeLabel";
import { getAllPosts } from "@/lib/posts";
import { buildDate, datedReleases } from "@/lib/year2026";
import { absoluteUrl, site } from "@/lib/site";
import {
  buildWeeks,
  joinList,
  weekLabel,
  weekRangeLabel,
  weekSummaryParts,
  WEEKLY_MIN_ITEMS,
  type WeekBucket,
} from "@/lib/weeklyCore.mjs";

/**
 * The weekly roundup (/weekly and /weekly/<ISO week>, ops/VIRAL-20-2026-11-06.md
 * item 9): what the site's own records dated inside one ISO week, generated
 * at build time. Nothing here is written by hand, so a week cannot claim
 * something that did not happen and a rebuild is the update.
 *
 * Four records feed it, each already sourced where it lives:
 * - src/data/changes.ts: tracker entries dated to the day (not "watch");
 * - src/data/graveyard.ts: end dates, dated milestones and launch dates, each
 *   with the vendor page it quotes. A graveyard date that a tracker entry
 *   already reports for the same page on the same day is shown once, as the
 *   tracker entry;
 * - releases: Health Connect's client (hcReleases.ts), the GitHub releases in
 *   sdkReleases.ts and each libraries.ts package's latest registry publish,
 *   de-duplicated exactly as /2026 counts them (datedReleases);
 * - src/data/published.ts: the first-published date of this site's pages.
 *
 * How it relates to the monthly digest (/digest): the digest is the indexed
 * archive. A week is a finer cut of the same records, so the week pages are
 * noindex, follow and out of the sitemap — two pages holding the same entries
 * would compete for the same searches. The week pages exist to be linked,
 * shared and polled: /weekly/feed.xml has one item per week.
 */

export const WEEKLY_PATH = "/weekly";
export const WEEKLY_FEED_PATH = "/weekly/feed.xml";
export const weekPath = (id: string) => `${WEEKLY_PATH}/${id}`;

export type WeeklyItem = {
  kind: "change" | "graveyard" | "release" | "page";
  date: string;
  key: string;
  title: string;
  /** One line under the title. */
  note: string;
  /** Where the item links on this site. */
  href: string;
  /** The vendor page or registry the record quotes, when it is off-site. */
  source?: { url: string; label: string };
  status?: ChangeStatus | GraveStatus;
  /** For pages: the section they belong to. */
  section?: string;
};

export type Week = WeekBucket<WeeklyItem> & { label: string; range: string };

const blogTitles = (): Map<string, string> => new Map(getAllPosts().map((p) => [`/blog/${p.slug}`, p.title]));

function sectionOf(href: string): string {
  const top = `/${href.split("/")[1]}`;
  if (top === "/blog") return "Blog";
  return CLUSTER_LABELS[top] ?? routeLabel(top) ?? "Reference";
}

/** Every record, at its own precision; weeklyCore places only day-dated ones. */
export function weeklyItems(asOf = buildDate()): WeeklyItem[] {
  const items: WeeklyItem[] = [];
  const changeDays = new Set<string>();

  for (const e of CHANGE_EVENTS) {
    if (e.status === "watch") continue;
    changeDays.add(`${e.date}|${e.page.href}`);
    items.push({
      kind: "change",
      date: e.date,
      key: `change:${e.sortDate}:${e.title}`,
      title: e.title,
      note: `${e.status === "confirmed" ? "Confirmed" : "Reported"} · ${e.page.label}`,
      href: e.page.href,
      status: e.status,
    });
  }

  for (const g of GRAVEYARD) {
    const href = g.page?.href ?? `${GRAVEYARD_PATH}#${g.id}`;
    const dates: { date: string; what: string; url: string }[] = [];
    if (g.end) dates.push({ date: g.end, what: g.endLabel, url: g.source.url });
    for (const m of g.milestones ?? []) dates.push({ date: m.date, what: m.label, url: m.url });
    if (g.launched) dates.push({ date: g.launched.date, what: g.launched.label, url: g.launched.url });
    for (const d of dates) {
      if (changeDays.has(`${d.date}|${href}`)) continue;
      items.push({
        kind: "graveyard",
        date: d.date,
        key: `grave:${g.id}:${d.date}:${d.what}`,
        title: `${g.name}: ${d.what}`,
        note: `${g.vendor} · ${STATUS_LABEL[g.status]} in the graveyard`,
        href: `${GRAVEYARD_PATH}#${g.id}`,
        source: { url: d.url, label: g.source.publisher },
        status: g.status,
      });
    }
  }

  for (const r of datedReleases(asOf)) {
    items.push({
      kind: "release",
      date: r.date,
      key: `release:${r.pkg}@${r.version}`,
      title: `${r.pkg} ${r.version}`,
      note: `Release date from ${r.source}`,
      href: r.href ?? "/sdk-releases",
    });
  }

  const posts = blogTitles();
  for (const [key, date] of Object.entries(PUBLISHED)) {
    if (key.startsWith("pt-br")) continue;
    const href = `/${key}`;
    const title = routeLabel(href) ?? posts.get(href);
    // A page this site cannot name is not linked with a bare path.
    if (!title) continue;
    const section = sectionOf(href);
    items.push({ kind: "page", date, key: `page:${href}`, title, note: section, href, section });
  }
  return items;
}

let CACHE: { asOf: string; weeks: Week[] } | null = null;

/** Every week that qualifies, newest first. */
export function weeks(asOf = buildDate()): Week[] {
  if (CACHE?.asOf === asOf) return CACHE.weeks;
  const out = buildWeeks(weeklyItems(asOf), asOf).map((w) => ({ ...w, label: weekLabel(w.id), range: weekRangeLabel(w.id) }));
  CACHE = { asOf, weeks: out };
  return out;
}

export function getWeek(id: string): Week | undefined {
  return weeks().find((w) => w.id === id);
}

/** The newest record any published week holds: the hub's dateModified. */
export function weeklyDataDate(asOf = buildDate()): string | undefined {
  return weeks(asOf)
    .flatMap((w) => w.items.map((i) => i.date))
    .sort()
    .at(-1);
}

/** The newest record one week holds: its dateModified and feed pubDate. */
export function weekDataDate(w: Week): string {
  return w.items.map((i) => i.date).sort().at(-1) ?? w.start;
}

export const WEEKLY_H1 = "The weekly fitness API roundup";
export const WEEKLY_TITLE = "Weekly Fitness API Roundup: Changes and Releases";
export const WEEKLY_DESCRIPTION =
  "Each week in fitness and health APIs: tracked changes, shutdowns, SDK and library releases and new pages, generated from this site's records. RSS.";

/** The H1 and title: "Week 45, 2026" plus "so far" while the week is running at build time. */
export function weekHeading(w: Week): string {
  return `${w.label}${w.inProgress ? ", so far" : ""}`;
}

export function weekTitle(w: Week): string {
  return `Fitness API roundup: week ${Number(w.id.slice(6))} of ${w.id.slice(0, 4)}`;
}

/** One line: page description, feed item description, OG line. */
export function weekSummary(w: Week): string {
  return `Fitness and health APIs, ${w.range}${w.inProgress ? " (so far)" : ""}: ${joinList(weekSummaryParts(w.counts))}.`;
}

/** Ecosystem items (changes, graveyard dates, releases), then the site's pages grouped by section. */
export function weekGroups(w: Week) {
  const of = (k: WeeklyItem["kind"]) => w.items.filter((i) => i.kind === k);
  const sections = new Map<string, WeeklyItem[]>();
  for (const p of of("page")) {
    const list = sections.get(p.section ?? "Reference") ?? [];
    list.push(p);
    sections.set(p.section ?? "Reference", list);
  }
  return {
    changes: of("change"),
    graveyard: of("graveyard"),
    releases: of("release"),
    pages: [...sections.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).map(([section, pages]) => ({ section, pages })),
  };
}

/** The headings a week prints, shared by the page and the feed. */
export const WEEK_HEADINGS = {
  changes: "What changed in the ecosystem",
  graveyard: "Shutdowns, deadlines and launches",
  releases: "SDK and library releases",
  pages: "New on this site",
} as const;

/** What the hub says about the series, on the page and in its mirror. */
export function weeklyCapsule(asOf = buildDate()): string {
  const all = weeks(asOf);
  return (
    `A roundup of each ISO week in fitness and health APIs, generated from this site's records at every build: tracker changes, graveyard shutdowns and launches, SDK and library releases, and the pages first published here. ` +
    `Only records dated to the day are placed in a week; anything dated by month or year stays in the monthly digest. ` +
    `A week needs ${WEEKLY_MIN_ITEMS} records, one of them from outside this site, to get a page; ${all.length} weeks do.`
  );
}

export function weeklyMethodLines(): string[] {
  return [
    "Tracker entries come from src/data/changes.ts, graveyard dates from src/data/graveyard.ts, releases from hcReleases.ts, sdkReleases.ts and libraries.ts (each package's latest publish only, so a week can undercount a busy package), and new pages from src/data/published.ts.",
    "A record whose source gives only a month or a year is never placed in a week. A date after the build day is never placed either.",
    "A graveyard date that a tracker entry reports for the same page on the same day appears once, as the tracker entry.",
    "Week pages are noindex: the monthly digest is the indexed archive of the same records. The feed and the links are what the weeks are for.",
  ];
}

/** Plain text of one week, for the feed item. */
export function weekText(w: Week): string {
  const g = weekGroups(w);
  const out: string[] = [weekSummary(w), ""];
  const block = (h: string, xs: WeeklyItem[]) => {
    if (!xs.length) return;
    out.push(h);
    for (const i of xs) out.push(`- ${i.date}: ${i.title} (${i.note}) ${absoluteUrl(i.href)}`);
    out.push("");
  };
  block(WEEK_HEADINGS.changes, g.changes);
  block(WEEK_HEADINGS.graveyard, g.graveyard);
  block(WEEK_HEADINGS.releases, g.releases);
  if (g.pages.length) {
    out.push(WEEK_HEADINGS.pages);
    for (const s of g.pages) out.push(`- ${s.section}: ${s.pages.length} page${s.pages.length === 1 ? "" : "s"}`);
    out.push("");
  }
  out.push(`Generated from ${site.name}'s records: ${absoluteUrl(weekPath(w.id))}`);
  return out.join("\n");
}
