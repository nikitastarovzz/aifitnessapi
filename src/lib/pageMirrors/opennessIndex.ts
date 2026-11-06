import { formatDate } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import {
  CELL_MARK,
  checkCounts,
  hostOf,
  opennessCapsule,
  opennessFaqs,
  opennessVendors,
  OPENNESS_DESCRIPTION,
  OPENNESS_METHOD,
  OPENNESS_TABLE_NOTE,
  OPENNESS_TITLE,
  OPENNESS_UPDATED,
  type Seg,
} from "@/lib/openness";
import { OPENNESS_CHECKS, OPENNESS_NOT_SCORED, OPENNESS_PATH, scoreText, STATUS_LABEL } from "@/lib/opennessIndex.mjs";
import { link, table, type MirrorDoc } from "./core";

const md = (para: Seg[]) => para.map((s) => (typeof s === "string" ? s : link(s.label, s.href))).join("");

/** /openness-index.md — mirrors src/app/openness-index/page.tsx from the same data. */
export function opennessIndexMirror(): MirrorDoc {
  const vendors = opennessVendors();
  const counts = checkCounts(vendors);
  const label = (s: string) => STATUS_LABEL[s as keyof typeof STATUS_LABEL];
  const perVendor = vendors.flatMap((v) => [
    `### ${v.name}: ${scoreText(v)}`,
    "",
    `${link(`The ${v.name} guide`, v.guide)} lists every page read.`,
    "",
    ...table(
      ["Check", "State", "What the vendor’s page says", "Quote", "Source"],
      OPENNESS_CHECKS.flatMap((c) => {
        const cell = v.cells[c.id];
        const rows: string[][] = [[c.label, label(cell.status), cell.note, cell.src?.quote ?? "", cell.src ? link(hostOf(cell.src.url), cell.src.url) : ""]];
        if (cell.caveat) rows.push(["", "", cell.caveat.text, cell.caveat.src.quote, link(hostOf(cell.caveat.src.url), cell.caveat.src.url)]);
        return rows;
      }),
    ),
  ]);

  return {
    path: OPENNESS_PATH,
    title: OPENNESS_TITLE,
    description: OPENNESS_DESCRIPTION,
    updated: OPENNESS_UPDATED,
    type: "record",
    capsule: opennessCapsule(vendors),
    body: [
      `Compiled ${formatDate(OPENNESS_UPDATED)} · ${vendors.length} APIs · ${OPENNESS_CHECKS.length} checks · CC BY 4.0`,
      "",
      "## The index",
      "",
      OPENNESS_TABLE_NOTE,
      "",
      ...table(
        ["API", ...OPENNESS_CHECKS.map((c) => c.label), "Count"],
        [
          ...vendors.map((v) => [v.name, ...OPENNESS_CHECKS.map((c) => CELL_MARK[v.cells[c.id].status].mark), `${v.documented}/${v.applicable}`]),
          ["Documented by", ...counts.map((x) => `${x.documented} of ${x.applies}`), ""],
        ],
      ),
      ...Object.values(CELL_MARK).map((m) => `- ${m.mark} ${m.meaning}`),
      "",
      "## What each check asks",
      "",
      ...OPENNESS_CHECKS.flatMap((c) => [`**${c.label}** ${c.question} ${c.rule}`, ""]),
      "## Each API, check by check",
      "",
      ...perVendor,
      "## How the index is built",
      "",
      ...OPENNESS_METHOD.flatMap((p) => [md(p), ""]),
      "### Not scored",
      "",
      ...OPENNESS_NOT_SCORED.map((n) => `- ${link(n.name, n.href)}: ${n.reason}`),
      "",
      `Every vendor’s count is also a README badge, and every API in the graveyard has a status badge: ${link("embeds and badges", "/badges#status-badges")}.`,
      "",
      "## Frequently asked questions",
      "",
      ...opennessFaqs(vendors).flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
      `By ${site.name}. Cite as: ${site.name}, “${OPENNESS_TITLE},” ${absoluteUrl(OPENNESS_PATH)}, compiled ${formatDate(OPENNESS_UPDATED)}.`,
    ],
  };
}
