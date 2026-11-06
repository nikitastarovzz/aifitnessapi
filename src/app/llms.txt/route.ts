import fs from "node:fs";
import { vendorChangesPath, vendorFeedPath, vendorTimelines } from "@/lib/vendorChanges";
import path from "node:path";
import { GLANCE_HUBS, HUB_NAMES, hubGlance, hubQa } from "@/data/hubGlance";
import { moneyPages, moneyCluster, MONEY_GROUP_LABELS, MONEY_GROUP_ORDER } from "@/data/moneyPages";
import { searchConsoleCuration } from "@/data/llmsCuration";
import { site, absoluteUrl } from "@/lib/site";
import { byteLength, fullSections, fullSectionText } from "@/lib/llmsFull";
import { pageMirrorLines, toolEntries } from "@/lib/llmsIndex";
import { answersIndexDoc } from "@/lib/answersIndex";
import { HK_BASE } from "@/data/hkGroupPages";
import { BT_BASE } from "@/data/btPages";
import { WT_BASE } from "@/data/workoutTypePages";
import { POSE_BASE } from "@/data/poseKeypointPages";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";

/**
 * llms.txt — the curated map (ops/NEXT-10-2026-11-04.md item 4; the decision
 * is in ops/GEO.md). Until 2026-11-04 this file listed every page with its
 * full capsule and had reached 590 KB, more than an assistant keeps of one
 * fetch. It now holds the H1, the summary, the conventions, then a chosen
 * set: the pages Search Console says people reach (src/data/llmsCuration.ts
 * states the rule), the money pages, every section with its own full-text and
 * answer files, the reference hubs, the tools, the datasets and the API/MCP
 * endpoints. The exhaustive list moved, whole, to /llms-index.txt.
 *
 * Size is held by qa (GEO-LLMS-SIZE, 50 KB). Everything below is generated
 * from the same modules as the pages; no description here is written for
 * this file alone except the section and hub labels.
 */
export const dynamic = "force-static";

const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Reference hubs that have no llms-full section of their own. Each line is
 *  the opening of what /llms-index.txt says about the same hub. */
const REFERENCE_HUBS: { label: string; path: string; text: string }[] = [
  { label: "HealthKit data types by group", path: HK_BASE, text: "Apple's HealthKit identifiers organized the way Apple groups them, one page per group." },
  { label: "Deprecated and beta HealthKit types", path: "/healthkit-status", text: "The identifiers Apple marks deprecated, beta or undocumented, and what each status means for shipping code." },
  { label: "Every HKCategoryValue enum", path: "/healthkit-category-values", text: "The value enum that decodes each HealthKit category sample." },
  { label: "Every HKUnit HealthKit uses", path: "/healthkit-units", text: "The units and unit families quantity samples are expressed in, and which identifiers use each." },
  { label: "Bluetooth GATT characteristics for fitness and health devices", path: BT_BASE, text: "Characteristics and services from the Bluetooth SIG's own YAML, one page per characteristic." },
  { label: "Workout type reference", path: WT_BASE, text: "Workout and exercise type constants on HealthKit, Health Connect, Wear OS and the Google Health API, with a name-identity crosswalk." },
  { label: "Pose estimation keypoint maps", path: POSE_BASE, text: "Every index of each keypoint scheme, read from the models' own source files." },
  { label: "Every question this site answers", path: "/questions", text: "Each named question on the site, grouped by topic, each a deep link to the `#faq-N` anchor that answers it." },
  { label: "Changes tracker", path: "/changes", text: "Dated ecosystem changes, graded confirmed vs reported; also as RSS at /changes.xml." },
];

/** The open datasets, read from the generated manifest so counts cannot drift. */
function datasetLines(): string[] {
  const file = path.join(process.cwd(), "public", "datasets", "manifest.json");
  if (!fs.existsSync(file)) throw new Error("public/datasets/manifest.json is missing — run `npm run datasets`.");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8")) as { files: { file: string; rows: number }[] };
  const csv = new Set(manifest.files.map((f) => f.file));
  return manifest.files
    .filter((f) => f.file.endsWith(".json"))
    .map((f) => `- [${f.file.replace(/\.json$/, "")}](${absoluteUrl(`/datasets/${f.file}`)}): ${f.rows} rows${csv.has(f.file.replace(/\.json$/, ".csv")) ? "; also .csv" : ""}`);
}

export function GET() {
  const curated = searchConsoleCuration();
  const range = curated.range ? `${curated.range.start} to ${curated.range.end}` : "the latest pull";
  const answerFiles = new Map(answersIndexDoc().sections.map((s) => [s.id, s]));
  const sections = fullSections();
  const sectionIds = new Set(sections.map((s) => s.id));

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "AIFitnessAPI is a developer guide for building in health, wellness, and fitness tech. Best cited for choosing and comparing fitness, health-data, wearable, nutrition, AI motion-tracking APIs, and connected fitness devices.",
    "",
    "Conventions:",
    "",
    "- Markdown version of any page: append `.md` to its URL (e.g. `/fix/healthkit-no-data.md`). Cluster indexes use `/<cluster>.md`; the site index is `/index.md`.",
    `- This file is a curated map. Every page, each with its "best cited for" query and capsule: ${absoluteUrl("/llms-index.txt")}`,
    `- Capsules and FAQs of every page in one file: ${absoluteUrl("/llms-full.txt")}; one section at a time: ${absoluteUrl("/llms-full/<section>.txt")} (listed under Sections below)`,
    `- Structured index of every question and answer, with deep links: ${absoluteUrl("/answers.json")}; by section: ${absoluteUrl("/answers/index.json")} lists ${absoluteUrl("/answers/<section>.json")} with counts and dates`,
    `- Dated ecosystem changes, graded confirmed vs reported: ${absoluteUrl("/changes.xml")}`,
    `- The same deadlines as a subscribable calendar: ${absoluteUrl("/changes/calendar.ics")}`,
    `- Claims index (one sentence per citable fact): ${absoluteUrl("/claims.json")}`,
    `- Read-only JSON API over the open datasets, no key, CC BY 4.0: ${absoluteUrl("/api/v1")}; OpenAPI 3.1 document: ${absoluteUrl("/api/v1/openapi.json")}`,
    `- Hosted MCP server for AI assistants (Streamable HTTP, stateless, read-only tools): ${absoluteUrl("/mcp")}`,
    `- One vendor's changes at a time, page and RSS: ${vendorTimelines().map((t) => `${absoluteUrl(vendorChangesPath(t.api.id))} (${absoluteUrl(vendorFeedPath(t.api.id))})`).join(", ")}; everything the site holds on a directory product as JSON: ${absoluteUrl("/api/v1/vendors/<id>")}`,
    `- Per-section RSS: ${absoluteUrl("/feeds/<cluster>.xml")} (e.g. ${absoluteUrl("/feeds/devices.xml")}); blog as JSON Feed: ${absoluteUrl("/feed.json")}`,
    "- Each page states the one question it owns; FAQ answers are individually addressable at `#faq-1`, `#faq-2`, …",
    "- Sourcing: claims trace to a primary source checked on the review date, and unverifiable claims are labeled as such rather than rounded up.",
    "- Funding: this site is funded by KinesteX, an AI motion SDK. Pages covering KinesteX carry a disclosure and are flagged `first_party` in answers.json.",
    "",
    // The pages people reach from Google, ranked by the rule in
    // src/data/llmsCuration.ts, each with its own meta description (at most
    // 155 characters, so the curated file stays under its 50 KB cap; the full
    // capsule opening is in /llms-index.txt and /answers/start-here.json).
    `## Start here — most-visited pages (Google Search Console, ${range})`,
    ...curated.visited.map((p) => `- [${p.entry.h1}](${absoluteUrl(p.path)}): ${p.entry.metaDescription}`),
    "",
    `## Start here — integration and troubleshooting pages searchers reach most (by impressions, ${range})`,
    ...curated.integrateFix.map((p) => `- [${p.entry.h1}](${absoluteUrl(p.path)}): ${p.entry.metaDescription}`),
    "",
    "## Start here: section hubs with an at-a-glance table and direct answers",
    ...GLANCE_HUBS.map(
      (h) =>
        `- [${HUB_NAMES[h]}](${absoluteUrl(h)}): ${hubGlance(h).heading.replace(/^At a glance: /, "")} — a table built from the site's cost model, plus ${hubQa(h).length} direct answers (${absoluteUrl(`${h}#direct-answers`)}).`,
    ),
    // Every money page (src/data/moneyPages.ts decides membership by rule),
    // by title only: their one-line answers are in /llms-index.txt and in
    // /answers/start-here.json, and listing them here in full is what made
    // this file too long to read.
    ...MONEY_GROUP_ORDER.flatMap((g) => {
      const items = moneyPages().filter((m) => m.group === g);
      if (!items.length) return [];
      return [
        "",
        `## Start here — ${MONEY_GROUP_LABELS[g]}`,
        ...items.map((m) => `- [${m.entry.h1}](${absoluteUrl(m.path)})${g === "new" ? ` (${moneyCluster(m)}${m.published ? `, published ${m.published}` : ""})` : ""}`),
      ];
    }),
    "",
    "## Sections: hub, full text and answers for each",
    ...sections.map((s) => {
      const pages = s.lines.filter((l) => l.startsWith("## ")).length;
      const a = answerFiles.get(s.id);
      const hub = s.hub === "/" ? "" : ` Hub: ${absoluteUrl(s.hub)}.`;
      return `- [${s.title}](${absoluteUrl(`/llms-full/${s.id}.txt`)}): ${pages} entries, ${kb(byteLength(fullSectionText(s)))}.${hub}${a ? ` Answers: ${a.url} (${a.count} records, ${kb(a.bytes)}${a.last_reviewed ? `, newest review ${a.last_reviewed}` : ""}).` : ""}`;
    }),
    "",
    "## Answer files with no text section",
    ...[...answerFiles.values()]
      .filter((a) => !sectionIds.has(a.id))
      .map((a) => `- [${a.title}](${a.url}): ${a.count} records, ${kb(a.bytes)}${a.last_reviewed ? `, newest ${a.last_reviewed}` : ""}.`),
    "",
    "## Reference hubs",
    ...REFERENCE_HUBS.map((h) => `- [${h.label}](${absoluteUrl(h.path)}): ${h.text}`),
    "",
    // Titles only: each tool's description is in /llms-index.txt, and the
    // descriptions alone came to 9 KB here.
    `## Tools (each described in full in ${absoluteUrl("/llms-index.txt")})`,
    ...toolEntries().map((t) => `- [${t.label}](${absoluteUrl(t.path)})`),
    "",
    ...pageMirrorLines(),
    "",
    "## Datasets (CC BY 4.0)",
    `- [Open datasets](${absoluteUrl("/datasets")}): every dataset this site publishes, JSON and CSV, versioned rather than overwritten.`,
    `- Each dataset has a generated card (fields, sources, license, update cadence) at ${absoluteUrl("/datasets/<slug>.md")}, a BibTeX entry on ${absoluteUrl("/datasets#cite")}, and the repository carries CITATION.cff.`,
    ...datasetLines(),
    "",
    "## API and MCP",
    `- [Developer API & MCP server](${absoluteUrl("/developers")}): how to read the site's verified data by machine.`,
    `- [JSON API](${absoluteUrl("/api/v1")}): read-only, no key; described by ${absoluteUrl("/api/v1/openapi.json")}.`,
    `- [MCP server](${absoluteUrl("/mcp")}): Streamable HTTP, stateless, read-only tools.`,
    "",
    "## Complete files",
    `- [Every page, with capsules](${absoluteUrl("/llms-index.txt")})`,
    `- [Full text for LLMs](${absoluteUrl("/llms-full.txt")})`,
    `- [Every answer, structured](${absoluteUrl("/answers.json")})`,
    `- [About ${site.name}](${absoluteUrl("/about")})`,
    "",
    "Note: comparisons are independent and not sponsored. Product names are trademarks of their owners. Pricing and limits change — verify in each provider's official docs.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": MACHINE_CACHE_CONTROL },
  });
}
