import { GRAVEYARD } from "@/data/graveyard";
import { CHANGE_EVENTS } from "@/data/changes";
import { HISTORY_KINDS, fmtDate, historyModel, historySvg } from "@/lib/historyCore.mjs";

/**
 * What /history says, shared by the page and its markdown mirror
 * (ops/VIRAL-20-2026-11-06.md item 10). The drawing is src/lib/historyCore.mjs;
 * the poster files are written by scripts/build-history.mjs from the same
 * function.
 */

export const HISTORY_PATH = "/history";
export const HISTORY_H1 = "A visual history of fitness and health APIs";
export const HISTORY_TITLE = "Fitness API History: Launches, Changes, Shutdowns";
export const HISTORY_DESCRIPTION =
  "Every dated fitness and health API launch, change and shutdown this site has sourced, on one timeline. Filter by vendor or kind; download the poster.";
export const HISTORY_SVG = "/history/fitness-api-history.svg";
export const HISTORY_PNG = "/history/fitness-api-history.png";

let MODEL: ReturnType<typeof historyModel> | null = null;
export function history() {
  MODEL ??= historyModel({ graveyard: GRAVEYARD, changes: CHANGE_EVENTS });
  return MODEL;
}

export function historyInlineSvg(): string {
  return historySvg(history());
}

export function historyAsOf(): string {
  return history().asOf;
}

export const kindLabel = (id: string) => HISTORY_KINDS.find((k) => k.id === id)?.label ?? id;
export { fmtDate };

export function historyCapsule(): string {
  const h = history();
  const first = h.marks[0];
  const ends = h.marks.filter((m) => m.kind === "end").length;
  return (
    `${h.marks.length} dated events in fitness and health APIs from ${h.vendors.length} vendors, drawn on one timeline from ${first ? fmtDate(first.date) : "the first record"} on: ${ends} shutdowns or deprecations and the milestones before them from the API graveyard, and the tracker's dated changes. ` +
    `Each event sits at the precision its source gives (a day, a month or a year) and links that source. Filter by vendor or kind, share the filtered view as a link, or download the poster. Data as of ${fmtDate(h.asOf)}.`
  );
}

export function historyMethodLines(): string[] {
  const h = history();
  return [
    `Drawn by src/lib/historyCore.mjs from src/data/graveyard.ts (${h.graveyardCount} entries: end dates, dated milestones and launch dates) and src/data/changes.ts (dated tracker entries; undated watch items are left out). The poster is the same drawing, written by scripts/build-history.mjs and rendered to PNG by a headless Chromium.`,
    "A day is a point, a month is a bar across that month and a year is a bar across that year. No date is sharpened beyond its source.",
    "A graveyard date links the vendor page, archive capture or registry record it quotes. A tracker entry links the page on this site that quotes its source.",
    "A tracker entry with the same date and page as a graveyard date is the same event and is drawn once, as the graveyard mark.",
    "The vendor of a tracker entry is the company its title names first. Records naming none are filed under Other.",
  ];
}

export const HISTORY_FAQS: { q: string; a: string }[] = [
  {
    q: "Why do some events on the fitness API timeline show as bars instead of points?",
    a: "Because their source dates them only to a month or a year. A bar across October means the source says October and nothing more precise; drawing it as a point on a guessed day would claim a date nobody published.",
  },
  {
    q: "How do I share the timeline filtered to one vendor?",
    a: "Pick the vendor or kinds and copy the address: the filter is kept in the URL as ?vendor=<id> and &kind=<kinds>, for example /history?vendor=google&kind=end. Anyone who opens it sees the same filtered timeline.",
  },
  {
    q: "Can I print or reuse the fitness API history poster?",
    a: "Yes. The SVG and PNG are generated from the same records as the page and published under CC BY 4.0: credit AIFitnessAPI and link the page. Each rebuild redraws them, so the poster date is the newest day a record was checked.",
  },
];
