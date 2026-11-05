import { HC_RELEASES_SOURCE } from "@/data/hcReleases";
import { PAGE_H1 } from "@/data/pageTitles";
import { INDEX_METHOD, median } from "@/lib/apiIndexMethod";
import { derive, shortDate, WINDOW_DAYS } from "@/lib/ecosystemDerive";
import { API_INDEX_PATH, MARKET_MAP_PATH, indexDataDate, indexInputDates, indexRows } from "@/lib/ecosystemSignals";
import { formatDate } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { interactiveNote, link, table, type MirrorDoc } from "./core";

/** /fitness-api-index.md — mirrors src/app/fitness-api-index/page.tsx: the
 *  headline counts, the per-product evidence, the methodology and data dates,
 *  computed from the same rows on the same build date. The sortable table
 *  itself is the interactive part; its rows are data.json and data.csv. */
export function fitnessApiIndexMirror(): MirrorDoc {
  const buildDate = new Date().toISOString().slice(0, 10);
  const rows = indexRows();
  const inputs = indexInputDates();
  const modified = indexDataDate();
  const ranked = rows.filter((r) => !r.firstParty);
  const d = ranked.map((r) => ({ r, d: derive(r, buildDate) }));
  const withChange = d.filter((x) => x.d.changes12 > 0);
  const changeTotal = d.reduce((n, x) => n + x.d.changes12, 0);
  const withPackages = d.filter((x) => x.d.packageCount > 0);
  const activePackages = withPackages.filter((x) => x.d.packagesActive12 > 0);
  const ages = d.flatMap((x) => (x.d.verifiedAge !== null ? [x.d.verifiedAge] : []));
  const over90 = ages.filter((a) => a > 90).length;
  const gated = ranked.filter((r) => r.approvalGate).length;

  const evidence = rows.flatMap((r) => [
    `### ${r.label}`,
    "",
    `${r.packages.length} packages · ${r.changes.length} tracked changes${r.firstParty ? " · funds this site, not ranked" : ""}`,
    "",
    `Directory entry: ${link(r.label, r.href)}${r.verified ? ` · facts from ${link(r.verified.label, r.verified.href)}, verified ${shortDate(r.verified.date)}` : ""}`,
    "",
    ...(r.officialSdk
      ? [
          `Vendor SDK: \`${r.officialSdk.name}\`, ${r.officialSdk.dates.length} dated releases on ${link("Google’s release notes", r.officialSdk.source)}, newest ${r.officialSdk.latestVersion} (${link("every release", "/health-connect-releases")}).`,
          "",
        ]
      : []),
    ...r.packages.map(
      (p) => `- ${p.href ? link(p.name, p.href) : p.name} — newest release ${p.latest ? shortDate(p.latest) : "none recorded"} (${p.source})${p.deprecated ? " · deprecated or archived" : ""}`,
    ),
    ...(r.changes.length
      ? r.changes.map((c) => `- ${shortDate(c.date)} · ${c.status} · ${link(c.title, c.href)}`)
      : ["No tracked change names this product."]),
    "",
  ]);

  const dataDates = [
    `- \`libraries.ts\` last written from npm, pub.dev, PyPI and GitHub: ${formatDate(inputs.libraries)}`,
    `- \`sdkReleases.ts\` last reached the GitHub Releases API: ${formatDate(inputs.sdkReleases)}`,
    `- \`hcReleases.ts\` last read ${link("Google’s release notes", HC_RELEASES_SOURCE)}: ${formatDate(inputs.hcReleases)}`,
    ...(inputs.changes ? [`- \`changes.ts\` newest entry check: ${formatDate(inputs.changes)}`] : []),
    ...(inputs.verifiedOldest && inputs.verifiedNewest
      ? [`- Source-page verification stamps range from ${formatDate(inputs.verifiedOldest)} to ${formatDate(inputs.verifiedNewest)}`]
      : []),
  ];

  return {
    path: API_INDEX_PATH,
    title: PAGE_H1[API_INDEX_PATH],
    description:
      "Sortable signals for every fitness API we track: SDK and library releases, dated changes in the last 12 months, approval gates and verification age.",
    updated: modified,
    type: "record",
    capsule: `As of ${formatDate(buildDate)}, ${withChange.length} of the ${ranked.length} ranked fitness and health products had at least one dated change in this site’s tracker in the previous 12 months (${changeTotal} entries in all), ${activePackages.length} of the ${withPackages.length} products with a tracked open-source package had a package release in that window, and ${gated} document an approval gate before launch. The page each product’s facts come from was last re-verified a median of ${median(ages)} days earlier; ${over90} are past 90 days. There is no score: every column is a raw signal computed from the repository’s data files at each build, sortable, with its source file named below.`,
    body: [
      `Computed ${formatDate(buildDate)} from this site’s data files · inputs last written ${formatDate(modified)} · ${rows.length} products · CC BY 4.0`,
      "",
      "**Disclosure:** KinesteX, the company that funds this site, is one of the products in the directory. Its row is shown and computed exactly like the others, but it is kept out of every sort and given no position: it sits below the ranked rows, labeled “funds this site — not ranked”.",
      "",
      "## The signals",
      "",
      "Click a column header to sort; click again to reverse. The number on the left is the position in the current sort and nothing more. A dash or “not tracked” means the repository holds no data for that cell — it sorts last either way and is not a zero.",
      "",
      interactiveNote(API_INDEX_PATH, `the sortable table (its rows as of the build are ${absoluteUrl(`${API_INDEX_PATH}/data.json`)} and ${absoluteUrl(`${API_INDEX_PATH}/data.csv`)})`),
      "",
      "## Per-product evidence",
      "",
      "The records each row counts, so any number in the table can be checked by hand.",
      "",
      ...evidence,
      "## Methodology",
      "",
      "Every column is computed by `src/lib/ecosystemSignals.ts` and `src/lib/ecosystemDerive.ts` from files already in the repository, at every build. Nothing is entered by hand, and no generator was added for this page: the inputs are the outputs of the existing ones. Products are joined to packages and changes by their proper names (the directory’s aliases), case-sensitive with word boundaries.",
      "",
      `Windows are the ${WINDOW_DAYS} days ending on the as-of date. The server renders the table as of the build date; your browser then recomputes the windows and ages for today, and the line above the table says which date is in use.`,
      "",
      ...table(["Column", "Source file", "Rule"], INDEX_METHOD.map((m) => [m.col, `\`${m.from}\``, m.rule])),
      "### Data dates",
      "",
      ...dataDates,
      "",
      "### Why there is no score",
      "",
      "None of these signals says a product is good. More tracked changes can mean an unstable API or a vendor that documents what it changes; an approval gate protects users as often as it slows builders; a package with no release this year may be finished rather than abandoned. Any weighting would be our judgment presented as a measurement, so the index publishes the measurements and leaves the weighting to you. Download the rows and apply your own.",
      "",
      "The funder is held to the same rule from the other side: KinesteX’s row is computed identically and shown, but never sorted among the others and never given a position.",
      "",
      "### Download and reproduce",
      "",
      `The rows as of the build, with every input date: ${link("data.json", `${API_INDEX_PATH}/data.json`)} and ${link("data.csv", `${API_INDEX_PATH}/data.csv`)}, CC BY 4.0. They are regenerated with the page, so they carry an as-of date rather than a version. To reproduce from source, regenerate the inputs with the generators named in the repository’s instructions, then run \`npm run build\`.`,
      "",
      "## Related",
      "",
      `- ${link("The fitness & health API market map", MARKET_MAP_PATH)}`,
      `- ${link("Changes & deadlines tracker", "/changes")}`,
      `- ${link("Open-source health & fitness libraries", "/libraries")}`,
      `- ${link("The State of Fitness APIs 2026", "/state-of-fitness-apis-2026")}`,
      "",
      `By ${site.name}. Cite as: ${site.name}, “The fitness API index,” ${absoluteUrl(API_INDEX_PATH)}, as of ${formatDate(buildDate)}. Product and company names are trademarks of their respective owners; KinesteX funds this site.`,
    ],
  };
}
