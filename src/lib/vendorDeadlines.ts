import { API_ENTRIES, APIS_PATH, type ApiEntry } from "@/data/apis";
import { GRAVEYARD, GRAVEYARD_PATH, STATUS_LABEL, type GraveEntry } from "@/data/graveyard";
import type { ChangeEvent } from "@/data/changes";
import { changesFor, countMatches } from "@/lib/apiCoverage";
import { vendorTimeline, vendorChangesPath } from "@/lib/vendorChanges";
import { countdownTarget, isExactDate } from "@/lib/stackFeeds.mjs";

/**
 * Dated items per directory product, for /my-stack and the countdown widgets
 * at /embed/countdown/<id> (ops/AUDIENCE-30-2026-11-05.md items 24 and 26).
 *
 * Nothing here is curated and nothing is new. Every date comes from one of two
 * hand-sourced files: a tracker entry in src/data/changes.ts (matched to a
 * product by changesFor, the word-boundary alias rule the /apis directory and
 * the vendor timelines use) or a stone in src/data/graveyard.ts (matched by
 * the same rule over its name, vendor and summary). Dates keep the source's
 * precision; a countdown counts a stated month or year to its last day.
 *
 * One overlap is folded: a stone and a tracker entry with the same date and
 * the same source page on this site are one event told twice (the Fitbit Web
 * API turn-off is both), so the tracker entry, which carries the
 * confirmed/reported grade, is kept.
 */

export const COUNTDOWN_BASE = "/embed/countdown";
export const countdownPath = (id: string) => `${COUNTDOWN_BASE}/${id}`;

/**
 * Stones whose end is on or after this day get a countdown widget. A fixed
 * day, not "today", so the set of widget addresses only ever grows: a widget
 * embedded on someone's page keeps resolving after its date passes.
 */
export const COUNTDOWN_SINCE = "2025-01-01";

export type DeadlineItem = {
  key: string;
  source: "change" | "graveyard";
  /** The date as the source states it ("2026-11-02", "2026-10", "2026"). */
  date: string;
  /** The full day a countdown counts to. */
  target: string;
  exact: boolean;
  title: string;
  /** "confirmed" / "reported" for tracker entries; "Dying" / "Dead" / "Deprecated" for stones. */
  grade: string;
  /** What happens on the date, for stones ("Turn-off"); null for tracker entries. */
  endLabel: string | null;
  href: string;
  label: string;
  checkedOn: string;
  quote: string | null;
  publisher: string | null;
};

export function gravesFor(api: ApiEntry): GraveEntry[] {
  return GRAVEYARD.filter((g) =>
    api.aliases.some((a) => countMatches(`${g.name} ${g.vendor}`, a) > 0 || countMatches(g.summary, a) > 0),
  );
}

export function changeItem(e: ChangeEvent): DeadlineItem {
  return {
    key: `change:${e.sortDate}:${e.title}`,
    source: "change",
    date: e.date,
    target: countdownTarget(e.date),
    exact: isExactDate(e.date),
    title: e.title,
    grade: e.status,
    endLabel: null,
    href: e.page.href,
    label: e.page.label,
    checkedOn: e.verifiedOn,
    quote: null,
    publisher: null,
  };
}

export function graveItem(g: GraveEntry): DeadlineItem | null {
  if (!g.end) return null;
  return {
    key: `grave:${g.id}`,
    source: "graveyard",
    date: g.end,
    target: countdownTarget(g.end),
    exact: isExactDate(g.end),
    title: `${g.name}: ${g.endLabel.toLowerCase()}`,
    grade: STATUS_LABEL[g.status],
    endLabel: g.endLabel,
    href: g.page?.href ?? `${GRAVEYARD_PATH}#${g.id}`,
    label: g.page?.label ?? "The Fitness API Graveyard",
    checkedOn: g.source.checkedOn,
    quote: g.source.quote,
    publisher: g.source.publisher,
  };
}

/** Every dated item for a product, latest target first, with stone/tracker duplicates folded. */
export function vendorDeadlines(api: ApiEntry): DeadlineItem[] {
  const changes = changesFor(api).map(changeItem);
  const seen = new Set(changes.map((c) => `${c.date}|${c.href}`));
  const graves = gravesFor(api)
    .map(graveItem)
    .filter((g): g is DeadlineItem => g !== null && !seen.has(`${g.date}|${g.href}`));
  return [...changes, ...graves].sort((a, b) => (a.target < b.target ? 1 : a.target > b.target ? -1 : 0));
}

export type CountdownTarget = {
  id: string;
  kind: "vendor" | "entry";
  /** The widget's heading. */
  name: string;
  /** The built page the widget canonicals to and links back to. */
  canonical: string;
  ctaLabel: string;
  items: DeadlineItem[];
  firstParty: boolean;
};

let CACHE: CountdownTarget[] | null = null;

/**
 * Every countdown widget: one per stone ending on or after COUNTDOWN_SINCE,
 * and one per product with at least one dated item. Stone ids and product ids
 * share the address space, so a collision fails the build.
 */
export function countdownTargets(): CountdownTarget[] {
  if (CACHE) return CACHE;
  const out: CountdownTarget[] = [];
  for (const g of GRAVEYARD) {
    const item = graveItem(g);
    if (!item || item.target < COUNTDOWN_SINCE) continue;
    out.push({
      id: g.id,
      kind: "entry",
      name: g.name,
      canonical: g.page?.href ?? GRAVEYARD_PATH,
      ctaLabel: g.page ? `${g.page.label} on aifitnessapi.com` : "The Fitness API Graveyard on aifitnessapi.com",
      items: [item],
      firstParty: false,
    });
  }
  for (const api of API_ENTRIES) {
    const items = vendorDeadlines(api);
    if (!items.length) continue;
    const timeline = vendorTimeline(api.id);
    out.push({
      id: api.id,
      kind: "vendor",
      name: api.short,
      canonical: timeline ? vendorChangesPath(api.id) : `${APIS_PATH}/${api.id}`,
      ctaLabel: timeline
        ? `Every ${api.short} change and deadline on aifitnessapi.com`
        : `${api.short} in the API directory on aifitnessapi.com`,
      items,
      firstParty: api.id === "kinestex",
    });
  }
  const ids = out.map((t) => t.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`countdownTargets: id "${dup}" is both a graveyard entry and a directory product`);
  CACHE = out;
  return out;
}

export function countdownTargetById(id: string): CountdownTarget | undefined {
  return countdownTargets().find((t) => t.id === id);
}

/** The countdown widget for a stone or product, if it has one. */
export function countdownFor(id: string): string | null {
  return countdownTargetById(id) ? countdownPath(id) : null;
}
