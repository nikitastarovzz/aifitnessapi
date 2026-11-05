import { ET_DATABASES, ET_EXERCISE_MATCHES, ET_FETCHED_ON, ET_RULE, ET_SOURCES } from "@/data/exerciseTaxonomy";
import { GYM_API_MATRIX } from "@/data/gymApiMatrix";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import type { EvidenceMatrix } from "@/lib/evidenceMatrix";
import {
  GYM_DESCRIPTION,
  GYM_H1,
  GYM_PATH,
  RESEARCH_DESCRIPTION,
  RESEARCH_H1,
  RESEARCH_PATH,
  TAXONOMY_DATASET,
  TAXONOMY_DESCRIPTION,
  TAXONOMY_H1,
  TAXONOMY_PATH,
  constantLinks,
  gymCapsule,
  matrixMethodLines,
  researchCapsule,
  taxonomyCapsule,
  taxonomyLimits,
  taxonomyRows,
} from "@/lib/audienceTools";
import { interactiveNote, link, table, type MirrorDoc } from "./core";

/** Markdown mirrors of the AUDIENCE-30 wave-3 tools, from the same modules the pages render. */

export function exerciseTaxonomyMirror(): MirrorDoc {
  const rows = taxonomyRows();
  const cellLinks = (xs: { label: string; href: string; name: string }[]) => xs.map((x) => `${link(x.name, x.href)} (${x.label})`).join(", ");
  return {
    path: TAXONOMY_PATH,
    title: TAXONOMY_H1,
    description: TAXONOMY_DESCRIPTION,
    updated: ET_FETCHED_ON,
    type: "tool",
    capsule: taxonomyCapsule(),
    body: [
      `${link("Download JSON", `/datasets/${TAXONOMY_DATASET}.json`)} · ${link("Download CSV", `/datasets/${TAXONOMY_DATASET}.csv`)} · ${link("Workout types on four platforms", "/workout-types")}`,
      "",
      interactiveNote(TAXONOMY_PATH, "filters by database, facet and match"),
      "",
      ...table(
        ["Term", "Database", "Facet", "Same name (mapped)", "Name contains it (not a mapping)"],
        rows.map((r) => [
          r.alias ? `${r.term} English name: ${r.alias}` : r.term,
          r.databaseName,
          r.facetLabel,
          r.exact.length ? cellLinks(r.exact) : r.reason,
          r.contains.length ? cellLinks(r.contains) : "—",
        ]),
      ),
      "## Exercise names that match a workout or segment type",
      "",
      ...table(
        ["Exercise", "Its category and equipment", "Same name"],
        ET_EXERCISE_MATCHES.map((e) => [e.name, [e.category, e.equipment].filter(Boolean).join(" · "), cellLinks(constantLinks(e))]),
      ),
      "## The three databases and their licenses",
      "",
      ...ET_DATABASES.map((d) => `- ${link(d.name, d.home)}: ${d.license}. Its license file or README says: “${d.licenseQuote}” ${d.read}`),
      "",
      "## How the crosswalk is built, and its limits",
      "",
      `- ${ET_RULE}`,
      ...taxonomyLimits().map((l) => `- ${l}`),
      "",
      "### Sources read",
      "",
      ...ET_SOURCES.map((s) => `- ${link(s.title, s.page)}, read ${s.fetchedOn}${s.via.startsWith("source-snapshot") ? ` through ${s.via}` : ""}`),
    ],
  };
}

const WORD = { yes: "Documented", no: "No", unknown: "Not stated" } as const;

function matrixMirror(m: EvidenceMatrix, path: string, h1: string, description: string, capsule: string): MirrorDoc {
  return {
    path,
    title: h1,
    description,
    updated: m.checkedOn,
    type: "tool",
    capsule,
    body: [
      interactiveNote(path, "tick the needs that matter and the rows reorder by how many each vendor documents"),
      "",
      ...table(
        ["Platform", ...m.columns.map((c) => c.label)],
        m.rows.map((r) => [
          r.page ? link(r.name, r.page.href) : r.name,
          ...m.columns.map((c) => {
            const cell = r.cells[c.id];
            return c.kind === "feature" ? `${WORD[cell.value]} ${cell.text}` : cell.text;
          }),
        ]),
      ),
      "## How this matrix is built",
      "",
      ...matrixMethodLines(m).map((l) => `- ${l}`),
      "",
      `The full write-up, with the context these cells leave out: ${link(m.roundup.label, m.roundup.href)}.`,
    ],
  };
}

export const gymMatrixMirror = () => matrixMirror(GYM_API_MATRIX, GYM_PATH, GYM_H1, GYM_DESCRIPTION, gymCapsule());
export const researchChooserMirror = () =>
  matrixMirror(RESEARCH_PLATFORM_MATRIX, RESEARCH_PATH, RESEARCH_H1, RESEARCH_DESCRIPTION, researchCapsule());
