import {
  HISTORY_DESCRIPTION,
  HISTORY_FAQS,
  HISTORY_H1,
  HISTORY_PATH,
  HISTORY_PNG,
  HISTORY_SVG,
  fmtDate,
  history,
  historyAsOf,
  historyCapsule,
  historyMethodLines,
  kindLabel,
} from "@/lib/historyView";
import { absoluteUrl, site } from "@/lib/site";
import { faqSection, interactiveNote, link, type MirrorDoc } from "./core";

/** /history.md — mirrors src/app/history/page.tsx from the same modules. */
export function historyMirror(): MirrorDoc {
  const h = history();
  const years = [...new Set(h.marks.map((m) => m.date.slice(0, 4)))];
  const line = (m: (typeof h.marks)[number] | (typeof h.undated)[number], date: string | null) => {
    const kind = `${kindLabel(m.kind)}${m.kind === "change" || m.kind === "end" ? `, ${m.status}` : ""}`;
    const src = m.external ? link(`Source: ${m.hrefLabel}`, m.href) : link(m.hrefLabel, m.href);
    return `- ${date ? `${fmtDate(date)} ` : ""}${m.title} (${m.vendorLabel} · ${kind}) · ${src}`;
  };
  return {
    path: HISTORY_PATH,
    title: HISTORY_H1,
    description: HISTORY_DESCRIPTION,
    updated: historyAsOf(),
    type: "record",
    capsule: historyCapsule(),
    body: [
      `${link("Download the poster (PNG)", HISTORY_PNG)} · ${link("Download SVG", HISTORY_SVG)} · ${link("The API graveyard", "/graveyard")} · ${link("Changes and deadlines", "/changes")}`,
      "",
      interactiveNote(HISTORY_PATH, "the timeline with vendor and kind filters (?vendor=<id>&kind=<kinds>)"),
      "",
      "## Every event, as a list",
      "",
      ...years.flatMap((y) => [`### ${y}`, "", ...h.marks.filter((m) => m.date.startsWith(y)).map((m) => line(m, m.date)), ""]),
      ...(h.undated.length ? ["### No end date given by the vendor", "", ...h.undated.map((m) => line(m, null)), ""] : []),
      "## How the timeline is made",
      "",
      ...historyMethodLines().map((l) => `- ${l}`),
      "",
      `Free to print and share under CC BY 4.0: credit ${site.name} and link ${absoluteUrl(HISTORY_PATH)}.`,
      "",
      ...faqSection(HISTORY_PATH, HISTORY_FAQS),
    ],
  };
}
