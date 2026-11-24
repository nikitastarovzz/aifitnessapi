#!/usr/bin/env node
/**
 * AI coding-assistant rule packs: files a developer commits into their own
 * repository so Cursor, Claude Code or GitHub Copilot write health-data code
 * with the exact names, units, aggregation styles and permissions the
 * vendors document. Linked from /developers#ai-rules.
 *
 *   node scripts/build-ai-rules.mjs           write public/kit/ai-rules/*
 *   node scripts/build-ai-rules.mjs --check   exit 1 if a file is missing or differs from what the data renders
 *
 * Writes, for healthkit, health-connect and pose-keypoints, three flavors
 * of one body:
 *   public/kit/ai-rules/<topic>.mdc               Cursor project rule (.cursor/rules/<topic>.mdc)
 *   public/kit/ai-rules/<topic>.md                Claude Code rule (.claude/rules/<topic>.md, or @-imported from CLAUDE.md)
 *   public/kit/ai-rules/<topic>.instructions.md   GitHub Copilot path-specific instructions (.github/instructions/)
 * and public/kit/ai-rules/manifest.json (per file: bytes, lines, SHA-256 of
 * the body, the data dates, and the date the body last changed).
 *
 * Inputs, all generated or the site's own records (nothing is written here
 * by hand except the framing sentences):
 *   src/data/healthkitIdentifiers.ts   identifiers, aggregation + Apple's sentence, unit family, HKError cases
 *   src/data/healthkitWritability.ts   read-only types + Apple's sentence
 *   src/data/healthConnectRecords.ts   records, permissions, aggregate metrics, unit classes
 *   src/data/errorCodes.ts             HealthConnectException constants
 *   src/data/poseKeypoints.ts          keypoint schemes, crosswalk, source notes
 *   src/data/unifiedSchema.ts + src/data/matrix.ts   the verified cross-platform pairs (via src/lib/codeRosetta.mjs)
 *   src/data/fix.entries.ts + src/data/errorCodesEditorial.ts   the /fix pages and which error each covers
 *   src/data/libraryDataTypes.ts       this site's page for each type
 *
 * Garmin and Terra are not rendered: the site has no generated, sourced
 * dataset of either vendor's data types (Garmin has none; Terra has webhook
 * payload sketches in src/data/webhookPayloads.ts, which are not a type
 * catalog), so a rules file would have nothing exact to say.
 *
 * The three formats, read on 2026-11-24:
 *   Cursor rules: https://cursor.com/docs/context/rules (final URL https://cursor.com/docs/rules), read
 *     through .github/workflows/source-snapshot.yml run 45496299201 because cursor.com is blocked from the
 *     dev environment: project rules live in .cursor/rules as .mdc files with description, globs and
 *     alwaysApply front matter; alwaysApply false with a description and no globs is "Agent reads the
 *     description and pulls the rule in when relevant"; "Keep rules under 500 lines".
 *   Claude Code memory: https://code.claude.com/docs/en/memory (fetched directly): project rules are
 *     markdown files in .claude/rules/, loaded at launch unless a `paths:` front matter scopes them;
 *     CLAUDE.md can import a file with @path/to/import; "target under 200 lines per CLAUDE.md file".
 *   GitHub Copilot repository instructions:
 *     https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
 *     (snapshot run 45496299201; docs.github.com is blocked here): repository-wide instructions in
 *     .github/copilot-instructions.md; path-specific ones in .github/instructions/NAME.instructions.md
 *     with an applyTo glob in front matter; "Currently, on GitHub.com, path-specific custom instructions
 *     are only supported for Copilot cloud agent and Copilot code review."
 *
 * A body carries the date it last changed, not the date the script ran: the
 * script keeps the date in the manifest while the body's hash is unchanged,
 * so --check (and qa's AI-RULES-STALE) compare content only.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTs } from "./lib/load-ts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/kit/ai-rules");
const MANIFEST = path.join(OUT, "manifest.json");
const SITE = "https://aifitnessapi.com";
export const AI_RULES_DIR = "/kit/ai-rules";
export const MAX_LINES = 500; // Cursor: "Keep rules under 500 lines"

export const FORMAT_SOURCES = [
  { tool: "Cursor", url: "https://cursor.com/docs/context/rules", readOn: "2026-11-24", via: "source-snapshot run 45496299201" },
  { tool: "Claude Code", url: "https://code.claude.com/docs/en/memory", readOn: "2026-11-24", via: "direct fetch" },
  {
    tool: "GitHub Copilot",
    url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions",
    readOn: "2026-11-24",
    via: "source-snapshot run 45496299201",
  },
];

export const TOPICS = [
  {
    slug: "healthkit",
    title: "HealthKit",
    description: "Apple HealthKit: exact identifier names, cumulative vs discrete aggregation, units, read-only types and HKError cases, from aifitnessapi.com",
  },
  {
    slug: "health-connect",
    title: "Health Connect",
    description: "Android Health Connect: exact record classes, permission strings, aggregate metrics and errors, from aifitnessapi.com",
  },
  {
    slug: "pose-keypoints",
    title: "Pose keypoints",
    description: "Pose-estimation keypoint indices and names per model (MediaPipe, ML Kit, COCO, MMPose, OpenPose, Apple Vision), from aifitnessapi.com",
  },
];

export const FLAVORS = [
  { id: "cursor", tool: "Cursor", file: (s) => `${s}.mdc`, installAs: (s) => `.cursor/rules/${s}.mdc` },
  { id: "claude", tool: "Claude Code", file: (s) => `${s}.md`, installAs: (s) => `.claude/rules/${s}.md` },
  { id: "copilot", tool: "GitHub Copilot", file: (s) => `${s}.instructions.md`, installAs: (s) => `.github/instructions/${s}.instructions.md` },
];

const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const link = (label, p) => `[${label}](${p.startsWith("http") ? p : SITE + p})`;
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

async function loadAll() {
  const [hk, hkw, hc, ec, pose, uni, matrix, fixEntries, editorial, ldt, rosetta] = await Promise.all([
    loadTs("src/data/healthkitIdentifiers.ts"),
    loadTs("src/data/healthkitWritability.ts"),
    loadTs("src/data/healthConnectRecords.ts"),
    loadTs("src/data/errorCodes.ts"),
    loadTs("src/data/poseKeypoints.ts"),
    loadTs("src/data/unifiedSchema.ts"),
    loadTs("src/data/matrix.ts"),
    loadTs("src/data/fix.ts"),
    loadTs("src/data/errorCodesEditorial.ts"),
    loadTs("src/data/libraryDataTypes.ts"),
    loadTs("src/lib/codeRosetta.mjs"),
  ]);
  const table = rosetta.buildPairs({
    unifiedRecords: uni.UNIFIED_RECORDS,
    matrixRows: matrix.ROWS,
    hkIdentifiers: hk.HK_IDENTIFIERS,
    hcRecords: hc.HC_RECORDS,
  });
  const percentQuote = uni.UNIFIED_CONVERTER?.units?.unitEvidence?.percent?.quote;
  if (!percentQuote) throw new Error("build-ai-rules: src/data/unifiedSchema.ts no longer carries Apple's percent-unit sentence");
  // Released /fix pages only (fix.ts holds the release gate).
  return { hk, hkw, hc, ec, pose, matrix, fixEntries: fixEntries.releasedFixes(), editorial, ldt, table, percentQuote };
}

/** The first sentence of a /fix capsule, quoted as the site states it. */
function firstSentence(s) {
  const m = /^(.+?[.!?])(\s|$)/.exec(s ?? "");
  return m ? m[1] : (s ?? "");
}

function pairsSection(table, side, percentQuote) {
  const lines = ["## Cross-platform pairs this site has verified", ""];
  lines.push(
    "Only these one-to-one pairs are verified (same row of the site's HealthKit ↔ Health Connect matrix, one type on each side or mapped field by field in its unified schema). Do not map any other type by its name.",
    "",
  );
  for (const p of table.pairs) {
    const a = `\`${p.hk.familyType}.${p.hk.case}\``;
    const b = `\`${p.hc.className}\``;
    if (p.status === "different-measure") {
      const tag = (s) => s.replace(/^always /, "");
      lines.push(`- ${a} and ${b} are **not** the same measurement (${tag(p.measures.healthkit)} vs ${tag(p.measures.healthConnect)}): ${md(p.note)} Never convert one into the other.`);
    } else {
      const note = p.hk.percent ? ` ${p.note ? md(p.note) : `HealthKit's percent unit is a fraction (Apple: "${percentQuote}").`}` : "";
      lines.push(`- ${side === "hk" ? `${a} ↔ ${b}` : `${b} ↔ ${a}`}.${note}`);
    }
  }
  lines.push("", `Translate a query between the two: ${link("Swift ↔ Kotlin code translator", "/tools/identifier-translator#code")}.`, "");
  return lines;
}

/** The /fix pages for a platform that the error list above does not already link. */
function fixLines(fixEntries, prefix, linked) {
  return fixEntries
    .filter((e) => e.slug.startsWith(prefix) && !linked.has(`/fix/${e.slug}`))
    .map((e) => `- ${link(e.h1, `/fix/${e.slug}`)}: ${md(firstSentence(e.answer))}`);
}

function headerLines(topic, sourceLine, generatedOn) {
  return [
    `# ${topic.title} rules for AI coding assistants`,
    "",
    `> Generated ${generatedOn} by ${SITE} from ${sourceLine}. Every name below is copied from the vendors' documentation or source; regenerate or re-download from ${SITE}${AI_RULES_DIR}/ (listed at ${SITE}/developers#ai-rules). Quoted sentences are the vendors' own words.`,
    "",
  ];
}

// ── HealthKit ──────────────────────────────────────────────────────────────

function healthkitBody(d) {
  const { hk, hkw, matrix, fixEntries, editorial, ldt, table } = d;
  const ids = hk.HK_IDENTIFIERS;
  const qty = ids.filter((r) => r.family === "quantity");
  const cat = ids.filter((r) => r.family === "category");
  const chr = ids.filter((r) => r.family === "characteristic");
  const noAgg = qty.filter((r) => !r.aggregation);
  const dep = ids.filter((r) => r.deprecated && (r.family === "quantity" || r.family === "category"));
  const notes = matrix.PLATFORM_NOTES.find((p) => p.platform === "Apple HealthKit")?.points ?? [];
  const hrv = matrix.ROWS.find((r) => r.id === "hrv");
  const path = (c) => ldt.sitePathFor({ store: "healthkit", id: ids.find((r) => r.case === c).objc, name: c });
  if (qty.length < 100 || cat.length < 20) throw new Error(`build-ai-rules: only ${qty.length} quantity and ${cat.length} category identifiers`);

  const lines = [
    "Use these rules whenever you write or review code that reads or writes Apple HealthKit, in Swift, Objective-C, or a React Native, Flutter or Capacitor wrapper.",
    "",
    "## Rules",
    "",
    `- Use only the identifier names in the tables below, spelled exactly (Swift case, or the Objective-C constant ${"`HKQuantityTypeIdentifierStepCount`"} style). If the type you need is not listed, say so; never build a name from a similar one.`,
    "- Decide sum vs average from the Aggregation column, which is copied from Apple's own sentence for each type: cumulative → `HKStatisticsOptions.cumulativeSum` and `sumQuantity()`; discrete → `.discreteAverage`, `.discreteMin`, `.discreteMax` and `averageQuantity()`, `minimumQuantity()`, `maximumQuantity()`. Never pass `.cumulativeSum` for a discrete type.",
    `- Apple states no aggregation style for ${noAgg.map((r) => `\`${r.case}\``).join(", ")}: do not assume one.`,
    `- Read a quantity with \`quantity.doubleValue(for:)\` in a unit of the type's unit family (column below). HealthKit's percent unit is a fraction; Apple: "${d.percentQuote}"`,
    "- Decode a category sample's `value` with the value enum listed for its identifier; the raw integer means nothing on its own.",
    ...notes.map((n) => `- ${md(n)}`),
    `- HRV: ${md((hrv?.watchOut ?? "").replace(/^The big one: (\w)/, (_, c) => c.toUpperCase()))}`,
    "",
  ];

  if (dep.length) {
    lines.push("## Deprecated identifiers", "", "Do not write new code against these; Apple's note is quoted.", "");
    for (const r of dep) lines.push(`- \`${r.case}\`: ${md(r.deprecation?.message ?? "deprecated, with no note from Apple.")}`);
    lines.push("");
  }

  lines.push("## Read-only types", "", "Apple states apps cannot save these; only read them.", "");
  lines.push(hkw.HK_READONLY.map((r) => `\`${r.case}\` ("${md(r.evidence)}")`).join(", ") + ".", "");

  lines.push("## HKError cases", "", `What Apple says each case means, and the page on this site that covers handling it. Full reference: ${link("HKError codes", "/healthkit-errors")}.`, "");
  const linked = new Set();
  for (const e of hk.HK_ERRORS) {
    const fix = editorial.fixHref(editorial.HK_ERROR_FIX_SLUGS, e.case);
    if (fix) linked.add(fix);
    const what = e.undocumented || !e.abstract ? "Apple publishes no description: log the raw code, do not infer a meaning" : md(e.abstract).replace(/\.$/, "");
    lines.push(`- \`HKError.Code.${e.case}\`: ${what}. ${fix ? link("Fix", fix) : link("Reference", `/healthkit-errors#err-${e.case.toLowerCase()}`)}`);
  }
  lines.push("", "## Common mistakes this site documents", "", ...fixLines(fixEntries, "healthkit-", linked), "");

  lines.push(...pairsSection(table, "hk", d.percentQuote));

  lines.push(
    `## Quantity types (${qty.length})`,
    "",
    "Aggregation and unit family are copied from Apple's documentation; the last column is Apple's sentence they were read from.",
    "",
    "| Identifier | Aggregation | Unit family | Apple's sentence |",
    "|---|---|---|---|",
  );
  for (const r of qty) {
    lines.push(`| [\`${r.case}\`](${SITE}${path(r.case)})${r.deprecated ? " (deprecated)" : ""} | ${r.aggregation ?? "not stated"} | ${r.unitFamily ?? "not stated"} | ${md(r.aggregationEvidence ?? "—")} |`);
  }
  lines.push("", `## Category types (${cat.length})`, "", "| Identifier | Value enum |", "|---|---|");
  for (const r of cat) lines.push(`| [\`${r.case}\`](${SITE}${path(r.case)})${r.deprecated ? " (deprecated)" : ""} | ${r.valueEnum ? `\`${r.valueEnum}\`` : "not stated"} |`);
  lines.push("", `## Characteristic types (${chr.length})`, "", chr.map((r) => `\`${r.case}\``).join(", ") + ".", "");
  return lines;
}

// ── Health Connect ─────────────────────────────────────────────────────────

function healthConnectBody(d) {
  const { hc, ec, matrix, fixEntries, editorial, ldt, table } = d;
  const recs = hc.HC_RECORDS;
  if (recs.length < 30) throw new Error(`build-ai-rules: only ${recs.length} Health Connect records`);
  const notes = matrix.PLATFORM_NOTES.find((p) => p.platform === "Android Health Connect")?.points ?? [];
  const noMetrics = recs.filter((r) => r.aggregateMetrics.length === 0);
  const lines = [
    "Use these rules whenever you write or review code that reads or writes Android Health Connect (androidx.health.connect.client), in Kotlin, Java, or a React Native, Flutter or Capacitor wrapper.",
    "",
    "## Rules",
    "",
    "- Use only the record classes in the table below, spelled exactly. If the type you need is not listed, say so; never build a name from a similar one.",
    "- Declare and request the exact permission string in the table for every record you read or write; each record has its own READ_ and WRITE_ permission.",
    ...hc.HC_ADDITIONAL_READ_PERMISSIONS.map((p) => `- ${p.label}: \`${p.permission}\`, declared and requested separately from the data-type permissions.`),
    "- Aggregate only with the metrics listed for a record (`StepsRecord.COUNT_TOTAL` style). A metric's description says whether it is a total, an average, a minimum or a maximum; do not sum a record that only offers averages.",
    `- These records list no aggregate metric, so read them with \`readRecords\` and compute yourself: ${noMetrics.map((r) => `\`${r.className}\``).join(", ")}.`,
    ...notes.map((n) => `- ${md(n)}`),
    `- ${md(hc.HC_SDK_NOTE)}`,
    "",
  ];
  if (hc.HC_UNRESOLVED_PERMISSIONS?.length) {
    lines.push("## Permission strings Google's pages disagree on", "");
    for (const u of hc.HC_UNRESOLVED_PERMISSIONS) {
      lines.push(`- Google's data-types table prints \`${u.permission}\` for \`${u.className}\`, and neither the framework HealthPermissions reference nor the Jetpack HealthPermission constants define it. Check the live reference before you put it in a manifest.`);
    }
    lines.push("");
  }
  lines.push("## HealthConnectException error codes", "", `Google's description of each constant (${link("reference", "/error-codes/health-connect")}).`, "");
  const linked = new Set();
  for (const e of ec.HC_ERROR_CONSTANTS) {
    const fix = editorial.fixHref(editorial.HC_ERROR_FIX_SLUGS, e.name);
    if (fix) linked.add(fix);
    lines.push(`- \`${e.name}\` (${e.value}): ${md(e.description)}${fix ? ` ${link("Fix", fix)}` : ""}`);
  }
  lines.push("", "## Common mistakes this site documents", "", ...fixLines(fixEntries, "health-connect-", linked), "");
  lines.push(...pairsSection(table, "hc", d.percentQuote));
  lines.push(
    `## Record classes (${recs.length})`,
    "",
    "| Record | Shape | Unit class | Read permission | Write permission | Aggregate metrics |",
    "|---|---|---|---|---|---|",
  );
  for (const r of recs) {
    const p = ldt.sitePathFor({ store: "healthConnect", id: r.className, name: r.className });
    const metrics = r.aggregateMetrics.map((m) => `\`${m.name}\` (${m.valueType})`).join(", ") || "none";
    lines.push(
      `| [\`${r.className}\`](${SITE}${p})${r.deprecated ? " (deprecated)" : ""} | ${r.recordShape ?? "not stated"} | ${r.unitClass ?? "—"} | ${r.readPermissions.map((x) => `\`${x}\``).join(", ") || "—"} | ${r.writePermissions.map((x) => `\`${x}\``).join(", ") || "—"} | ${metrics} |`,
    );
  }
  lines.push("");
  return lines;
}

// ── Pose keypoints ─────────────────────────────────────────────────────────

function poseBody(d) {
  const { pose } = d;
  const schemes = pose.POSE_SCHEMES;
  if (schemes.length < 9) throw new Error(`build-ai-rules: only ${schemes.length} pose schemes`);
  const src = (id) => pose.POSE_SOURCES.find((s) => s.id === id);
  const bp = schemes.find((s) => s.slug === "blazepose-33");
  const coco = schemes.find((s) => s.slug === "coco-17");
  const at = (s, key) => s.points.find((p) => p.key === key);
  const ls = [at(bp, "leftshoulder"), at(coco, "leftshoulder")];
  const lines = [
    "Use these rules whenever you write or review code that reads body keypoints from a pose-estimation model (MediaPipe, ML Kit, MoveNet, YOLO pose, RTMPose, OpenPose, Apple Vision), for rep counting, form checks or any joint angle.",
    "",
    "## Rules",
    "",
    `- A keypoint index means something only inside its own scheme. The same joint has different indices in different schemes: ${ls[0] ? `\`${ls[0].name}\` is ${ls[0].index} in ${bp.shortName}` : ""}${ls[1] ? `, while \`${ls[1].name}\` is ${ls[1].index} in ${coco.shortName}` : ""}. Never reuse an index from one model with another model's output.`,
    "- Write the scheme next to every index constant you define, and look indices up in the lists below rather than from memory.",
    "- To move between schemes, join by joint name using the crosswalk table below. A joint missing from a scheme is missing: do not substitute a neighbor.",
    `- ${schemes
      .filter((s) => !s.indexed)
      .map((s) => s.shortName)
      .join(" and ")} name joints with constants, not integer indices; use the constant names listed.`,
    "- Coordinate spaces differ by model and by output. The statements under each scheme are copied from its source; follow the one for the model you use.",
    "",
    "## Schemes",
    "",
  ];
  for (const s of schemes) {
    const source = src(s.sourceId);
    lines.push(`### ${s.name}`, "");
    lines.push(`Used by: ${s.usedBy.map((u) => u.model).join("; ") || "not stated"}. Names from ${s.nameSource} (${source?.page ?? "source not listed"}).`, "");
    const list = s.points.map((p) => (s.indexed ? `${p.index} \`${p.name}\`` : `\`${p.name}\``)).join(" · ");
    lines.push(`${s.points.length} ${s.indexed ? "keypoints" : "joints"}: ${list}`, "");
    for (const n of s.notes) lines.push(`- ${md(n.text)}`);
    if (s.notes.length) lines.push("");
  }
  const rows = pose.POSE_CROSSWALK.filter((r) => r.cells.length >= 4);
  lines.push(
    "## Crosswalk: the same joint across schemes",
    "",
    "Rows join points whose names are identical once lowercased with separators removed; a dash means the scheme has no point by that name.",
    "",
    `| Joint | ${schemes.map((s) => s.shortName).join(" | ")} |`,
    `|---|${schemes.map(() => "---").join("|")}|`,
  );
  for (const r of rows) {
    const cells = schemes.map((s) => {
      const c = r.cells.find((x) => x.scheme === s.slug);
      return c ? (c.index === null ? `\`${c.name}\`` : `${c.index}`) : "—";
    });
    lines.push(`| ${r.label} | ${cells.join(" | ")} |`);
  }
  lines.push(
    "",
    `Every scheme and the full crosswalk, including joints fewer schemes share: ${link("pose keypoint reference", "/pose-keypoints")}; map one scheme onto another in the ${link("keypoint playground", "/tools/keypoint-playground")}.`,
    "",
  );
  return lines;
}

// ── Assembly ───────────────────────────────────────────────────────────────

/** Each topic's body (without the generated-on line's date filled in) and its data date. */
export async function renderBodies() {
  const d = await loadAll();
  const hk = d.hk;
  return {
    healthkit: {
      asOf: hk.HK_FETCHED_ON,
      source: `its HealthKit dataset, read from Apple's documentation on ${hk.HK_FETCHED_ON} (${SITE}/healthkit-identifiers)`,
      lines: healthkitBody(d),
    },
    "health-connect": {
      asOf: d.hc.HC_FETCHED_ON,
      source: `its Health Connect dataset, read from Google's data-types page and Jetpack reference on ${d.hc.HC_FETCHED_ON} (${SITE}/health-connect)`,
      lines: healthConnectBody(d),
    },
    "pose-keypoints": {
      asOf: d.pose.POSE_KEYPOINTS_FETCHED_ON,
      source: `its pose keypoint dataset, read from each model's own source on ${d.pose.POSE_KEYPOINTS_FETCHED_ON} (${SITE}/pose-keypoints)`,
      lines: poseBody(d),
    },
  };
}

function frontMatter(flavor, topic) {
  if (flavor.id === "cursor") return ["---", `description: ${topic.description}`, "alwaysApply: false", "---", ""];
  if (flavor.id === "copilot") return ["---", 'applyTo: "**"', "---", ""];
  return [];
}

/** The body text a file is held to: everything except the date on the header line. */
const DATE_RE = /^(> Generated )\d{4}-\d{2}-\d{2}( by )/m;
export const normalize = (text) => text.replace(DATE_RE, "$1<date>$2");

/** Every file's content for the given per-topic dates. */
export async function renderFiles(datesByTopic) {
  const bodies = await renderBodies();
  const files = [];
  for (const topic of TOPICS) {
    const b = bodies[topic.slug];
    const date = datesByTopic?.[topic.slug] ?? new Date().toISOString().slice(0, 10);
    const body = [...headerLines(topic, b.source, date), ...b.lines].join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
    for (const flavor of FLAVORS) {
      const text = [...frontMatter(flavor, topic), body].join("\n");
      files.push({ topic: topic.slug, flavor: flavor.id, file: flavor.file(topic.slug), text, asOf: b.asOf, bodyHash: sha(normalize(body)) });
    }
  }
  return files;
}

function readManifest() {
  return fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { files: [] };
}

/** Problems with the published files, comparing content without the date. */
export async function checkAiRules() {
  const manifest = readManifest();
  const dates = Object.fromEntries(manifest.files.map((f) => [f.topic, f.generatedOn]));
  const want = await renderFiles(dates);
  const problems = [];
  for (const f of want) {
    const p = path.join(OUT, f.file);
    if (!fs.existsSync(p)) {
      problems.push(`public/kit/ai-rules/${f.file} is missing`);
      continue;
    }
    const have = fs.readFileSync(p, "utf8");
    if (normalize(have) !== normalize(f.text)) problems.push(`public/kit/ai-rules/${f.file} differs from what the data renders today`);
    const lines = have.split("\n").length;
    if (lines > MAX_LINES) problems.push(`public/kit/ai-rules/${f.file} has ${lines} lines, over Cursor's ${MAX_LINES}`);
    if (!manifest.files.some((m) => m.file === f.file)) problems.push(`public/kit/ai-rules/${f.file} is not in manifest.json`);
  }
  for (const name of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) {
    if (name !== "manifest.json" && !want.some((f) => f.file === name)) problems.push(`public/kit/ai-rules/${name} is not a file this script writes`);
  }
  return problems;
}

async function write() {
  const old = readManifest();
  const first = await renderFiles({});
  // Keep a topic's date while its body is unchanged.
  const dates = {};
  for (const t of TOPICS) {
    const prev = old.files.find((m) => m.topic === t.slug);
    const now = first.find((f) => f.topic === t.slug);
    dates[t.slug] = prev && prev.bodyHash === now.bodyHash ? prev.generatedOn : new Date().toISOString().slice(0, 10);
  }
  const files = await renderFiles(dates);
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of files) fs.writeFileSync(path.join(OUT, f.file), f.text);
  const manifest = {
    about: `AI coding-assistant rule packs from ${SITE}, rendered by scripts/build-ai-rules.mjs from the site's generated data.`,
    formats: FORMAT_SOURCES,
    files: files.map((f) => ({
      file: f.file,
      topic: f.topic,
      flavor: f.flavor,
      installAs: FLAVORS.find((x) => x.id === f.flavor).installAs(f.topic),
      bytes: Buffer.byteLength(f.text),
      lines: f.text.split("\n").length,
      bodyHash: f.bodyHash,
      dataReadOn: f.asOf,
      generatedOn: dates[f.topic],
    })),
  };
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  for (const f of manifest.files) console.log(`${f.file}: ${f.lines} lines, ${f.bytes} bytes`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.argv.includes("--check")) await write();
  const problems = await checkAiRules();
  if (problems.length) {
    for (const p of problems) console.error(`✗ ${p}`);
    console.error("run node scripts/build-ai-rules.mjs");
    process.exit(1);
  }
  console.log(`public/kit/ai-rules is current (${TOPICS.length} topics × ${FLAVORS.length} flavors)`);
}
