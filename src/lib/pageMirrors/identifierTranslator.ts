import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/identifier-translator";

/** /tools/identifier-translator.md — mirrors src/app/tools/identifier-translator/page.tsx. */
export function identifierTranslatorMirror(): MirrorDoc {
  // Same parse as the page (and src/components/AppStack.tsx), for the count.
  const mapped = new Set<string>();
  for (const row of MATRIX_ROWS) {
    for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) mapped.add(m[1].toLowerCase());
  }
  const covered = HK_IDENTIFIERS.filter((r) => mapped.has(r.case.toLowerCase())).length;
  const n = HK_IDENTIFIERS.length;
  return {
    path: PATH,
    title: "Apple type, Android record",
    description:
      "Look up the Health Connect record for a HealthKit identifier, or the reverse. Verified pairs only — where nothing was checked, the tool says so.",
    updated: HK_FETCHED_ON,
    type: "tool",
    capsule: `Type an Apple HealthKit identifier and get the Health Connect record type, or type a record name and get the Apple side. The Apple identifiers come from the ${n}-type dataset read from Apple’s documentation on ${HK_FETCHED_ON}; the pairings come only from this site’s verified matrix, which covers ${covered} of those ${n} identifiers across ${MATRIX_ROWS.length} metrics. For anything outside that set the tool reports no verified counterpart rather than inventing a record name — the mistake that turns Apple’s SDNN into Android’s RMSSD.`,
    body: [
      interactiveNote(PATH, "the two-way lookup"),
      "",
      "## How this works",
      "",
      `Everything runs client-side from this site’s published dataset — no lookup service, no network call. Two sources feed it. The Apple identifier list is generated from Apple’s own documentation, last read ${HK_FETCHED_ON}. The cross-platform pairs are the ${MATRIX_ROWS.length} rows of the HealthKit ↔ Health Connect matrix, each one confirmed against both Apple’s and Google’s developer documentation, with the per-row source recorded in the dataset.`,
      "",
      `That matrix is deliberately small. A wider table would have to include pairs nobody checked, and a reference is only worth publishing if its cells are verified — so an identifier outside it returns the gap, with a link to the Android record list so you can check it yourself. Both datasets are downloadable — ${link("open datasets, CC BY 4.0", "/datasets")}.`,
      "",
      `A free tool from ${site.name}. The full table is the ${link("HealthKit ↔ Health Connect type reference", "/matrix")}; the Android side is at ${link("every Health Connect record type", "/health-connect")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
