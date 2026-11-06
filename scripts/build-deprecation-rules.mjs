#!/usr/bin/env node
/**
 * Build the deprecation scanner's rules (ops/VIRAL-20-2026-11-06.md items 14
 * and 15): one bundle that /tools/deprecation-scanner and the GitHub Action
 * actions/fitness-api-deprecation-check both run, so they cannot disagree.
 *
 *   node scripts/build-deprecation-rules.mjs          write
 *   node scripts/build-deprecation-rules.mjs --check  exit 1 if any output is stale (qa's DEPRECATION-RULES-STALE)
 *
 * Reads, never fetches:
 *   src/data/graveyard.ts            what happened to each API: status, end at source precision, the vendor's quote
 *   src/lib/fitbitGoogleMap.ts       every Fitbit Web API endpoint (src/data/fitbitWebApi.ts, read through
 *                                    source snapshots) and what Google's migration tables put in its place
 *   src/data/libraries.ts            registry packages whose registry description names a dead API
 *   src/data/deprecationSignatures.ts  hand-sourced patterns for the other graveyard entries
 *   src/lib/deprecationScan.mjs      the engine, copied into the Action
 *
 * Writes:
 *   src/data/deprecationRules.json                              the bundle the page imports
 *   actions/fitness-api-deprecation-check/dist/rules.json       the same bytes, for the Action
 *   actions/fitness-api-deprecation-check/dist/scan.mjs         the engine, byte for byte
 *   ops/sources/evidence/tools-deprecation-scanner.json         every hand-sourced quote, for source-quotes.yml
 *
 * Rules the build enforces (exit non-zero rather than publish a weaker set):
 *   - a pattern's `literal` is a substring of its quote, and its `example`
 *     matches with the match containing the literal;
 *   - every rule's example, scanned by the engine, is claimed by that rule
 *     (no rule shadows another on its own example);
 *   - every graveyard entry has a rule or a NOT_SCANNED reason;
 *   - every Fitbit endpoint row is covered, and the rule count is not short.
 */
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/load-ts.mjs";
import { compileRules, scanText, fileContext } from "../src/lib/deprecationScan.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHECK = process.argv.includes("--check");
const OUT = {
  site: "src/data/deprecationRules.json",
  actionRules: "actions/fitness-api-deprecation-check/dist/rules.json",
  actionScan: "actions/fitness-api-deprecation-check/dist/scan.mjs",
  evidence: "ops/sources/evidence/tools-deprecation-scanner.json",
};
const ENGINE = "src/lib/deprecationScan.mjs";
/** Fewer than this many rules means a parse came up short. */
const EXPECTED_MIN_RULES = 120;

const fail = (m) => {
  console.error(`build-deprecation-rules: ${m}`);
  process.exit(1);
};

const { GRAVEYARD, STATUS_LABEL, fmtGraveDate, endOfPeriod } = await loadTs("src/data/graveyard.ts");
const fg = await loadTs("src/lib/fitbitGoogleMap.ts");
const { FITBIT_ENDPOINTS, FITBIT_FETCHED_ON } = await loadTs("src/data/fitbitWebApi.ts");
const { LIBRARIES, LIBRARIES_FETCHED_ON } = await loadTs("src/data/libraries.ts");
const { GHAPI_FETCHED_ON } = await loadTs("src/data/googleHealthApi.ts");
const sig = await loadTs("src/data/deprecationSignatures.ts");
const { site } = await loadTs("src/lib/site.ts");

const graveById = new Map(GRAVEYARD.map((e) => [e.id, e]));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ------------------------------------------------------------------ entries
const entries = {};
for (const e of GRAVEYARD) {
  entries[e.id] = {
    id: e.id,
    name: e.name,
    vendor: e.vendor,
    kind: e.kind,
    status: e.status,
    statusLabel: STATUS_LABEL[e.status],
    end: e.end,
    endText: fmtGraveDate(e.end),
    endLast: e.end ? endOfPeriod(e.end) : null,
    endLabel: e.endLabel,
    quote: e.source.quote,
    url: e.source.url,
    publisher: e.source.publisher,
    checkedOn: e.source.checkedOn,
    replacedBy: e.replacedBy,
    graveyard: `/graveyard#${e.id}`,
    migrate: sig.MIGRATION_PAGES[e.id] ?? e.page ?? null,
  };
}

// ------------------------------------------------------------------ Fitbit
const FITBIT = "fitbit-web-api";
if (!graveById.has(FITBIT)) fail(`graveyard entry ${FITBIT} missing`);
const FITBIT_PUBLISHER = "Fitbit Web API reference";
const PH = "(?:\\$\\{[^}\\n]*\\}|\\{[^}\\n]*\\}|%[sd]|<[^>\\n]*>|:[A-Za-z_]\\w*|[^/\\s\"'`?#<>{}]+)";
const MULTI = new Set(["resource-path", "collection-path"]);
const SAMPLE = (name) => (name === "user-id" ? "-" : /date/i.test(name) ? "2026-01-01" : /time/.test(name) ? "08:00" : "x1");

function compilePath(tpl) {
  let re = "";
  let literal = 0;
  let example = "";
  for (const part of tpl.split(/(\[[^\]]+\])/)) {
    if (!part) continue;
    const m = /^\[([^\]]+)\]$/.exec(part);
    if (m) {
      re += MULTI.has(m[1]) ? `${PH}(?:/${PH})?` : PH;
      example += SAMPLE(m[1]);
    } else {
      re += esc(part);
      literal += part.length;
      example += part;
    }
  }
  const tail = /\.\w+$/.test(tpl) ? "(?![\\w])" : "(?![\\w-])";
  return { re: re + tail, literal, example };
}

const groups = new Map();
for (const row of fg.FG_ROWS) {
  for (const p of row.paths) {
    const key = p.replace(/\[[^\]]+\]/g, "[]");
    if (!groups.has(key)) groups.set(key, { tpl: p, rows: [] });
    const g = groups.get(key);
    if (!g.rows.includes(row)) g.rows.push(row);
  }
}
const covered = new Set([...groups.values()].flatMap((g) => g.rows.map((r) => r.id)));
const missingRows = fg.FG_ROWS.filter((r) => !covered.has(r.id));
if (missingRows.length) fail(`Fitbit endpoints with no path: ${missingRows.map((r) => r.id).join(", ")}`);

const endpointById = new Map(FITBIT_ENDPOINTS.map((e) => [e.id, e]));
const fitbitRules = [];
for (const { tpl, rows } of groups.values()) {
  const auth = rows.every((r) => r.category === "authorization");
  const c = compilePath(tpl);
  const re = auth ? `fitbit\\.com${c.re}` : c.re;
  const replacement = [];
  const seen = new Set();
  const add = (r) => {
    if (seen.has(r.label)) return;
    seen.add(r.label);
    replacement.push(r);
  };
  for (const r of rows) {
    for (const d of r.dataTypes) {
      const methods = d.methods.map((m) => m.label).join(", ");
      add({ label: `Google Health API ${d.googleName} (${d.googleDataType})${methods ? `: ${methods}` : ""}`, ...(d.href ? { href: d.href } : {}) });
    }
    if (r.methods.length) add({ label: `Google Health API ${r.methods.map((m) => m.label).join(", ")}`, href: "/google-health-api" });
    if (r.nameMatch) add({ label: `Google Health API ${r.nameMatch.label} (a method of the same name; this site's match, not Google's statement)`, href: "/google-health-api" });
  }
  const first = rows[0];
  let id = `fitbit:${first.id}`;
  for (let n = 2; fitbitRules.some((r) => r.id === id); n++) id = `fitbit:${first.id}:${n}`;
  fitbitRules.push({
    id,
    entry: FITBIT,
    kind: "endpoint",
    label: `Fitbit Web API: ${rows.map((r) => r.title).join(" / ")} (${tpl})`,
    patterns: [{ re }],
    specificity: c.literal + (auth ? 10 : 0),
    replacement,
    replacementNote: replacement.length ? null : first.why,
    replacementQuotes: [],
    // The path as each endpoint page's Request table prints it.
    basis: rows.map((r) => ({
      url: r.url,
      publisher: FITBIT_PUBLISHER,
      quote: tpl,
      literal: tpl,
      checkedOn: endpointById.get(r.id)?.fetchedOn ?? FITBIT_FETCHED_ON,
      via: "snapshot",
    })),
    more: { href: `/tools/fitbit-to-google-health#${first.id.replace("/", "--")}`, label: "This endpoint on the Fitbit to Google Health API map" },
    endpoints: rows.map((r) => ({ title: r.title, method: r.method, status: r.status, ...(r.notice ? { notice: r.notice } : {}) })),
    example: `${first.method ?? "GET"} https://${auth ? "api.fitbit.com" : "api.fitbit.com"}${c.example}`,
  });
}

// The bare host and path prefix: the fallbacks for a URL built by concatenation.
const hostRow = FITBIT_ENDPOINTS.flatMap((e) => e.rows.map((r) => ({ e, r }))).find(({ r }) => /api\.fitbit\.com\/1\/user\//.test(r.termEvidence));
if (!hostRow) fail("no Fitbit page text names api.fitbit.com");
const fitbitFallbacks = [
  {
    id: "fitbit:host",
    entry: FITBIT,
    kind: "host",
    label: "Fitbit Web API host (api.fitbit.com)",
    patterns: [{ re: "\\bapi\\.fitbit\\.com\\b" }],
    fallback: true,
    specificity: 1,
    replacement: graveById.get(FITBIT).replacedBy,
    replacementNote: null,
    replacementQuotes: [],
    basis: [{ url: hostRow.e.url, publisher: FITBIT_PUBLISHER, quote: hostRow.r.termEvidence, literal: "api.fitbit.com", checkedOn: hostRow.e.fetchedOn, via: "snapshot" }],
    more: { href: "/tools/fitbit-to-google-health", label: "Every Fitbit endpoint and its Google Health API replacement" },
    example: 'const FITBIT = "https://api.fitbit.com";',
  },
  {
    id: "fitbit:path-prefix",
    entry: FITBIT,
    kind: "endpoint",
    label: "Fitbit Web API path (/1/user/, /1.1/user/ or /1.2/user/) in a file that mentions Fitbit",
    patterns: [{ re: "/1(?:\\.[12])?/user/" }],
    requiresFile: "fitbit",
    fallback: true,
    specificity: 2,
    replacement: graveById.get(FITBIT).replacedBy,
    replacementNote: null,
    replacementQuotes: [],
    basis: ["/1/user/", "/1.2/user/"].map((lit) => {
      const e = FITBIT_ENDPOINTS.find((x) => x.paths.some((p) => p.startsWith(lit))) ?? fail(`no Fitbit path starts ${lit}`);
      return { url: e.url, publisher: FITBIT_PUBLISHER, quote: e.paths.find((p) => p.startsWith(lit)), literal: lit, checkedOn: e.fetchedOn, via: "snapshot" };
    }),
    more: { href: "/tools/fitbit-to-google-health", label: "Every Fitbit endpoint and its Google Health API replacement" },
    example: 'url = FITBIT_BASE + "/1/user/" + user_id + "/" + resource  # fitbit',
  },
];

// ------------------------------------------------------------------ signatures
const sigRules = [];
const evidence = [];
for (const s of sig.DEPRECATION_SIGNATURES) {
  const entry = graveById.get(s.entry) ?? fail(`${s.id}: no graveyard entry ${s.entry}`);
  if (!s.source.quote.includes(s.literal)) fail(`${s.id}: literal ${JSON.stringify(s.literal)} is not in its quote`);
  for (const x of s.extraSources ?? []) if (!x.quote.includes(x.literal)) fail(`${s.id}: extra literal ${JSON.stringify(x.literal)} is not in its quote`);
  let rx;
  try {
    rx = new RegExp(s.pattern, s.flags ?? "");
  } catch (e) {
    fail(`${s.id}: bad pattern (${e.message})`);
  }
  const m = rx.exec(s.example);
  if (!m) fail(`${s.id}: pattern does not match its example`);
  // A literal's "{id}"-style path parameter stands for any one segment.
  const literalRe = new RegExp(esc(s.literal).replace(/\\\{[^}]*\\\}/g, "[^/]+"));
  if (!literalRe.test(m[0]) && !s.literal.includes(m[0])) fail(`${s.id}: the example's match ${JSON.stringify(m[0])} does not carry the literal`);
  const basis = [s.source, ...(s.extraSources ?? [])].map((x) => ({
    url: x.url,
    publisher: x.publisher,
    quote: x.quote,
    literal: x.literal ?? s.literal,
    checkedOn: x.checkedOn,
    via: x.via,
    ...(x.capturedOn ? { capturedOn: x.capturedOn } : {}),
  }));
  sigRules.push({
    id: s.id,
    entry: s.entry,
    kind: s.kind,
    label: s.label,
    patterns: [{ re: s.pattern, ...(s.flags ? { flags: s.flags } : {}) }],
    ...(s.contexts ? { contexts: s.contexts } : {}),
    ...(s.fallback ? { fallback: true } : {}),
    specificity: 100 + s.literal.length,
    replacement: s.replacement ?? entry.replacedBy,
    replacementNote: null,
    replacementQuotes: (s.replacementQuotes ?? []).map((q) => ({ url: q.url, quote: q.quote })),
    basis,
    example: s.example,
  });
  for (const x of [s.source, ...(s.extraSources ?? [])]) {
    evidence.push({
      claim: `${s.label}: the scanner's pattern for "${x.literal ?? s.literal}" rests on this passage.`,
      url: x.url,
      quote: x.evidenceQuote ?? x.quote,
    });
  }
  for (const q of s.replacementQuotes ?? []) {
    evidence.push({ claim: `${s.label}: the replacement the scanner names.`, url: q.url, quote: q.evidenceQuote ?? q.quote });
  }
}

// ------------------------------------------------------------------ libraries
const libRules = [];
for (const l of LIBRARIES) {
  const wrapped = (l.wraps ?? []).map((w) => sig.LIBRARY_WRAPS_ENTRY[w]).filter(Boolean);
  if (!wrapped.length) continue;
  const entryId = wrapped[0];
  const entry = graveById.get(entryId) ?? fail(`library ${l.name}: no graveyard entry ${entryId}`);
  if (!l.wrapsEvidence) fail(`library ${l.name}: wraps has no evidence`);
  const name = esc(l.name);
  const patterns =
    l.ecosystem === "npm"
      ? [{ re: `(?<![\\w@.-])${name}(?![\\w-])` }]
      : l.ecosystem === "pypi"
        ? [{ re: `^\\s*["']?${name}["']?\\s*(?:\\[[^\\]]*\\])?\\s*(?:[=<>!~;@,"'#]|$)`, flags: "i" }]
        : [{ re: `^\\s*${name}\\s*:` }];
  const contexts = l.ecosystem === "npm" ? ["code", "npm-manifest"] : l.ecosystem === "pypi" ? ["pypi-manifest"] : ["pubspec"];
  const example = l.ecosystem === "npm" ? `import X from "${l.name}";` : l.ecosystem === "pypi" ? `${l.name}==${l.latestVersion}` : `  ${l.name}: ^${l.latestVersion}`;
  libRules.push({
    id: `library:${l.ecosystem}:${l.name}`,
    entry: entryId,
    kind: "package",
    label: `${l.name} (${l.ecosystem === "pypi" ? "PyPI" : l.ecosystem === "npm" ? "npm" : "pub.dev"}), a client for the ${l.wraps.join(" and ")}`,
    patterns,
    contexts,
    specificity: 100 + l.name.length,
    replacement: entry.replacedBy,
    replacementNote: null,
    replacementQuotes: [],
    basis: [{ url: l.registryUrl, publisher: l.ecosystem === "pypi" ? "PyPI" : l.ecosystem === "npm" ? "npm registry" : "pub.dev", quote: l.wrapsEvidence, literal: l.name, checkedOn: LIBRARIES_FETCHED_ON, via: "direct" }],
    more: { href: `/libraries/${l.slug}`, label: `${l.name} on this site's library index` },
    example,
  });
}

const rules = [...fitbitRules, ...fitbitFallbacks, ...sigRules, ...libRules];
if (rules.length < EXPECTED_MIN_RULES) fail(`only ${rules.length} rules (expected at least ${EXPECTED_MIN_RULES})`);
const ids = new Set();
for (const r of rules) {
  if (ids.has(r.id)) fail(`duplicate rule id ${r.id}`);
  ids.add(r.id);
  for (const p of r.patterns) new RegExp(p.re, `g${p.flags ?? ""}`);
}

// Every graveyard entry is scanned, or says why not.
const scanned = new Set(rules.map((r) => r.entry));
const notScanned = [];
for (const e of GRAVEYARD) {
  if (scanned.has(e.id)) continue;
  const why = sig.NOT_SCANNED[e.id];
  if (!why) fail(`graveyard entry ${e.id} has no rule and no NOT_SCANNED reason`);
  notScanned.push({ entry: e.id, name: e.name, reason: why });
}
const partial = Object.entries(sig.NOT_SCANNED)
  .filter(([k]) => k.includes("#"))
  .map(([k, reason]) => ({ entry: k.split("#")[0], name: graveById.get(k.split("#")[0])?.name ?? fail(`NOT_SCANNED ${k}: no entry`), reason }));

const newest = (xs) => xs.filter(Boolean).sort().at(-1);
const bundle = {
  generatedBy: "scripts/build-deprecation-rules.mjs",
  site: site.url,
  updated: newest([
    FITBIT_FETCHED_ON,
    GHAPI_FETCHED_ON,
    LIBRARIES_FETCHED_ON,
    ...GRAVEYARD.map((e) => e.source.checkedOn),
    ...sig.DEPRECATION_SIGNATURES.map((s) => s.source.checkedOn),
  ]),
  inputs: {
    graveyard: newest(GRAVEYARD.map((e) => e.source.checkedOn)),
    fitbitWebApi: FITBIT_FETCHED_ON,
    googleHealthApi: GHAPI_FETCHED_ON,
    libraries: LIBRARIES_FETCHED_ON,
    signatures: newest(sig.DEPRECATION_SIGNATURES.map((s) => s.source.checkedOn)),
  },
  counts: {
    rules: rules.length,
    fitbitEndpointRules: fitbitRules.length,
    fitbitEndpoints: fg.FG_ROWS.length,
    entries: scanned.size,
  },
  entries,
  rules,
  notScanned: [...notScanned, ...partial],
};

// Each rule's own example must come back as that rule.
const compiled = compileRules(bundle);
for (const r of rules) {
  const ctx = r.contexts?.[0] ?? "code";
  const hits = scanText(r.example, { compiled, context: ctx });
  if (!hits.some((h) => h.ruleId === r.id)) fail(`rule ${r.id}: its example ${JSON.stringify(r.example)} is claimed by ${hits.map((h) => h.ruleId).join(", ") || "nothing"}`);
}
void fileContext;

// ------------------------------------------------------------------ write / check
const json = `${JSON.stringify(bundle, null, 2)}\n`;
const engine = fs.readFileSync(path.join(ROOT, ENGINE), "utf8");
const scanCopy = `// GENERATED by scripts/build-deprecation-rules.mjs: a byte-for-byte copy of ${ENGINE} below this line. Do not edit.\n${engine}`;
// One row per passage: a shared source (Strava's basePath) is checked once.
const evidenceRows = evidence.filter((r, i) => evidence.findIndex((x) => x.url === r.url && x.quote === r.quote) === i);
const evidenceJson = `${JSON.stringify(evidenceRows, null, 2)}\n`;
const outputs = [
  [OUT.site, json],
  [OUT.actionRules, json],
  [OUT.actionScan, scanCopy],
  [OUT.evidence, evidenceJson],
];
if (CHECK) {
  const stale = outputs.filter(([f, body]) => !fs.existsSync(path.join(ROOT, f)) || fs.readFileSync(path.join(ROOT, f), "utf8") !== body).map(([f]) => f);
  if (stale.length) {
    console.error(`build-deprecation-rules --check: stale ${stale.join(", ")} — run node scripts/build-deprecation-rules.mjs`);
    process.exit(1);
  }
  console.log(`build-deprecation-rules --check: ${rules.length} rules current`);
} else {
  for (const [f, body] of outputs) {
    fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, f), body);
  }
  console.log(
    `build-deprecation-rules: ${rules.length} rules (${fitbitRules.length} Fitbit endpoint paths covering ${fg.FG_ROWS.length} endpoints, ${sigRules.length} signatures, ${libRules.length} packages) over ${scanned.size} graveyard entries; ${notScanned.length} not scanned; ${evidenceRows.length} evidence rows`,
  );
}
