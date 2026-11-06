import { AGGREGATOR_MATRIX } from "@/data/aggregatorChooser";
import { matrixMethodLines } from "@/lib/audienceTools";
import { AGG_DESCRIPTION, AGG_H1, AGG_PATH, aggregatorCapsule, aggregatorFaqs, useCases } from "@/lib/aggregatorChooserView";
import { faqSection, interactiveNote, link, table, type MirrorDoc } from "./core";

/** The markdown mirror of /tools/aggregator-chooser, from the same modules the page renders. */

const WORD = { yes: "Documented", no: "No", unknown: "Not stated" } as const;

export function aggregatorChooserMirror(): MirrorDoc {
  const m = AGGREGATOR_MATRIX;
  return {
    path: AGG_PATH,
    title: AGG_H1,
    description: AGG_DESCRIPTION,
    updated: m.checkedOn,
    type: "tool",
    capsule: aggregatorCapsule(),
    body: [
      interactiveNote(AGG_PATH, "tick the needs that matter and the rows reorder by how many each vendor documents; each cell's source quotes"),
      "",
      ...table(
        ["Aggregator", ...m.columns.map((c) => c.label)],
        m.rows.map((r) => [
          r.page ? link(r.name, r.page.href) : r.name,
          ...m.columns.map((c) => {
            const cell = r.cells[c.id];
            return c.kind === "feature" ? `${WORD[cell.value]}. ${cell.text}` : cell.text;
          }),
        ]),
      ),
      "## Trade-offs by use case",
      "",
      ...useCases().flatMap((u) => [
        `### ${u.title}`,
        "",
        u.intro,
        "",
        ...u.lines.map((l) => `- ${l}`),
        ...(u.silent.length ? ["", `Not stated in the pages read: ${u.silent.join(", ")}.`] : []),
        "",
      ]),
      ...faqSection(AGG_PATH, aggregatorFaqs(), "How to choose: questions"),
      "## How this matrix is built",
      "",
      ...matrixMethodLines(m).map((l) => `- ${l}`),
      "",
      `The full write-up, with the context these cells leave out: ${link(m.roundup.label, m.roundup.href)}.`,
    ],
  };
}
