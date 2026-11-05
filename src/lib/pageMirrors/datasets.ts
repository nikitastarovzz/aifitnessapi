import { DATASETS_UPDATED, LICENSE_URL, LOADED, citeAs, fmtUpdated } from "@/lib/datasetsPage";
import { site } from "@/lib/site";
import { link, type MirrorDoc } from "./core";

const PATH = "/datasets";

/** /datasets.md — mirrors src/app/datasets/page.tsx: every dataset with its
 *  counts, caveat, files and citation string, read off the published files. */
export function datasetsMirror(): MirrorDoc {
  const totalRows = LOADED.reduce((n, l) => n + l.file.rows, 0);
  const bySlug = Object.fromEntries(LOADED.map((l) => [l.entry.slug, l.file.rows]));
  const versions = [...new Set(LOADED.map((l) => l.file.version))].sort();
  const versionLabel = versions.length === 1 ? `version ${versions[0]}` : `versions ${versions.join(", ")}`;

  const sets = LOADED.flatMap(({ entry, file }) => [
    `## ${file.name}`,
    "",
    `${file.rows} rows (${entry.unit}) · ${file.columns.length} columns · version ${file.version} · ${file.license}`,
    "",
    entry.blurb,
    "",
    entry.caveat,
    "",
    `${link(`${entry.slug}.json`, `/datasets/${entry.slug}.json`)} · ${link(`${entry.slug}.csv`, `/datasets/${entry.slug}.csv`)} · ${link(`Read it as a page: ${entry.presentedBy.label}`, entry.presentedBy.href)}`,
    "",
    `- **License:** ${link("Creative Commons Attribution 4.0", LICENSE_URL)} — reuse and redistribute freely, including commercially, with attribution.`,
    `- **Cite as:** ${citeAs(file, entry.slug)}`,
    `- **Columns:** ${file.columns.join(", ")}`,
    "",
  ]);

  return {
    path: PATH,
    title: "Open Datasets",
    description: `${LOADED.length} open CC BY 4.0 datasets: HealthKit, Health Connect, Wear OS and Google Health API types, pose keypoints, the API directory, changes, glossary.`,
    updated: DATASETS_UPDATED,
    type: "dataset-index",
    capsule: `AIFitnessAPI publishes ${LOADED.length} open datasets about fitness and health APIs, each in both JSON and CSV, each versioned 2026.1 and licensed CC BY 4.0 with attribution as the only condition (where a dataset restates another publisher’s facts, its note says what the license covers): the access-structure survey of ${bySlug["fitness-apis-2026"]} APIs, SDKs and models; the HealthKit ↔ Health Connect identifier matrix covering ${bySlug["health-data-type-matrix-2026"]} health metrics; the dated record of ${bySlug["fitness-api-changes-2026"]} ecosystem changes, each graded for evidence strength; and the glossary of ${bySlug["fitness-api-glossary-2026"]} defined terms. Three rules hold across all of them — there is not one dollar figure anywhere by design, a field we could not verify is null rather than guessed, and editions are versioned rather than overwritten, so a citation to 2026.1 keeps pointing at what 2026.1 said.`,
    body: [
      `${LOADED.length} datasets · ${totalRows} rows · ${versionLabel} · CC BY 4.0 · updated ${fmtUpdated(DATASETS_UPDATED)}`,
      "",
      ...sets,
      "## The rules these files follow",
      "",
      `**No dollar figures, by design.** There is not one monetary value in any of these datasets. Most serious tiers in this market are contact-sales, published figures move within a quarter, and a stale number damages a citable source more than a missing one. What we publish instead is structure: how a vendor bills, what gates a launch, what the end user must already own. The ${link("cost planner", "/cost-planner")} works the same way and likewise refuses to produce a total.`,
      "",
      "**A null means we could not verify it.** It never means zero and it is never a guess. If a field is empty in the CSV, the corresponding page on this site carries no sentence documenting it — that is the whole claim. Judgment calls stay out of the data entirely rather than being laundered into a column.",
      "",
      "**Versioned, not overwritten.** Every file is pinned at version 2026.1. The next edition re-verifies each row and ships under a new version rather than editing these in place, so a citation to 2026.1 keeps pointing at what 2026.1 actually said.",
      "",
      `**Every row traces to a page.** Each dataset carries a link column pointing at the page on this site that states the claim in prose, with its own sourcing and review date. Nothing here asserts more than its source page does. How we verify is written up in ${link("our methodology", "/methodology")}.`,
      "",
      "**Generated, not typed.** Every file is built by `scripts/build-datasets.mjs` from the same data modules that render the pages, so a dataset cannot drift from the page it came from. The counts, field lists and versions shown above are read out of the published JSON when this page is built, which is why they cannot disagree with the downloads.",
      "",
      "## Using them",
      "",
      "The JSON files share one envelope: `name`, `version`, `publisher`, `license`, `methodology`, `generatedFrom`, a `fields` dictionary describing the columns, a `stats` block, and the `items` array. The CSVs carry the same rows and columns, RFC 4180 quoted, with an empty field wherever the JSON has null.",
      "",
      `Attribution is the only condition. A link to ${link("aifitnessapi.com/datasets", "/datasets")} alongside the citation string above satisfies it. If you find an error in a row, the page it links is the place it will be corrected first.`,
      "",
      `The same rows are also served one at a time, as a read-only JSON API with an OpenAPI 3.1 document and as tools on a hosted MCP server for AI assistants. No key is needed for either; see ${link("the developer API and MCP server", "/developers")}.`,
      "",
      `Published by ${site.name}. Independent and not sponsored — one row of the access-structure survey covers KinesteX, the company that funds this site, recorded on the same terms as every competitor.`,
    ],
  };
}
