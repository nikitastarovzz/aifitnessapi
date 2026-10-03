#!/usr/bin/env node
/**
 * Regenerate src/data/errorCodes.ts from the platform vendors' own reference
 * documentation:
 *
 *   1. HealthKit's HKError.Code — Apple's docs JSON for the enum
 *      (/tutorials/data/documentation/healthkit/hkerror/code.json), then one
 *      JSON per case, followed from the enum's topic sections. This is the
 *      same JSON developer.apple.com renders.
 *   2. android.health.connect.HealthConnectException — every ERROR_* constant
 *      on the framework reference page: value, Google's description, the API
 *      level it was added in.
 *   3. androidx.health.connect.client.HealthConnectClient (Jetpack, Kotlin
 *      reference) — the exceptions its "Throws" tables document, with
 *      Google's wording and the methods each wording appears on.
 *
 * No model in this loop. Every published field is copied from the source, or
 * derived by a literal match against the source's own sentence, and that
 * sentence is stored beside the derived value:
 *
 *   similarTo (Health Connect) — Google's reference says of some constants
 *     "This error may be considered similar to IllegalArgumentException".
 *     The exception named is copied into `similarTo` and the sentence into
 *     `similarToEvidence`. Both are null where Google says nothing.
 *
 * The rest is copied: Apple's abstract/discussion/platforms, Google's
 * constant value (as printed under "Constant Value:"), API level (the
 * `data-version-added` attribute, cross-checked against the printed "Added in
 * API level N" text — a disagreement fails the run), and the printed SDK
 * extension line.
 *
 * Apple publishes no raw integer values for HKError.Code, so none are carried
 * here. Google does publish values for HealthConnectException, so those are.
 *
 * Usage: node scripts/fetch-error-codes.mjs [--offline]
 *   --offline reparses the cache in .cache/error-codes without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const APPLE = "https://developer.apple.com/tutorials/data/documentation/healthkit";
const HC_EXCEPTION_URL = "https://developer.android.com/reference/android/health/connect/HealthConnectException";
const HC_CLIENT_URL = "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient";
const CACHE = ".cache/error-codes";
const OUT = "src/data/errorCodes.ts";
const OFFLINE = process.argv.includes("--offline");

mkdirSync(CACHE, { recursive: true });

/** Every URL actually read this run, in order — written into the output. */
const fetched = [];

async function getText(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  fetched.push(url);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const text = await res.text();
  writeFileSync(path, text);
  await new Promise((r) => setTimeout(r, 150));
  return text;
}
const getJson = async (url, cacheFile) => JSON.parse(await getText(url, cacheFile));

// Integrity problems, collected while parsing and checked before anything is
// written — see the gates at the end.
const problems = [];

// ── HTML helpers (Google's reference pages are server-rendered HTML) ────────
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
const textOf = (html) => decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
/** Split an HTML fragment into its paragraphs' text. Tolerates Google's
 *  nested <p><p></p></p> markup by treating every <p> or </p> as a break. */
const paragraphsOf = (html) =>
  html
    .split(/<\/?p\b[^>]*>/i)
    .map(textOf)
    .filter(Boolean);
/** The "Last updated YYYY-MM-DD UTC." stamp Google prints in the page footer. */
const googleLastUpdated = (html) => /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;

// ── 1. HKError.Code ────────────────────────────────────────────────────────
/** Apple inline content → text, resolving symbol links to their titles. */
function linkedText(nodes, refs) {
  let out = "";
  for (const n of nodes || []) {
    if (!n || typeof n !== "object") continue;
    if (n.type === "text") out += n.text ?? "";
    else if (n.type === "codeVoice") out += n.code ?? "";
    else if (n.type === "reference") out += refs?.[n.identifier]?.title ?? String(n.identifier).split("/").pop();
    else if (n.inlineContent) out += linkedText(n.inlineContent, refs);
  }
  return out;
}

/** Discussion paragraphs (and asides, prefixed with their name). */
function discussionOf(doc, label) {
  const refs = doc.references || {};
  const paras = [];
  for (const sec of doc.primaryContentSections || []) {
    if (sec.kind !== "content") continue;
    for (const node of sec.content || []) {
      if (node.type === "heading") continue;
      if (node.type === "paragraph") {
        const t = linkedText(node.inlineContent, refs).replace(/\s+/g, " ").trim();
        if (t) paras.push(t);
      } else if (node.type === "aside") {
        const inner = (node.content || [])
          .filter((c) => c.type === "paragraph")
          .map((c) => linkedText(c.inlineContent, refs).replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join(" ");
        if (inner) paras.push(`${node.name || node.style || "Note"}: ${inner}`);
      } else {
        // A node shape we do not render (code listing, table, list). Dropping
        // it silently would publish a discussion with a hole in it.
        problems.push(`HKError.Code.${label}: discussion has an unhandled "${node.type}" node`);
      }
    }
  }
  return paras;
}

function platformOf(p) {
  return {
    name: p.name,
    introducedAt: p.introducedAt ?? null,
    // Apple marks deprecation with a deprecatedAt version and leaves the
    // boolean false (see scripts/fetch-healthkit-identifiers.mjs), so both
    // count, and the version is kept as the evidence.
    deprecated: Boolean(p.deprecated) || p.deprecatedAt != null,
    deprecatedAt: p.deprecatedAt ?? null,
    beta: Boolean(p.beta),
  };
}

const codeIndex = await getJson(`${APPLE}/hkerror/code.json`, "apple-hkerror-code.json");
const hkCases = [];
for (const sec of codeIndex.topicSections || []) {
  // "Initializers" is init(rawValue:), the enum's own constructor.
  if (sec.title === "Initializers") continue;
  for (const id of sec.identifiers || []) {
    if (!id.includes("/HKError/Code/")) continue;
    const name = id.split("/").pop();
    if (name.startsWith("init(")) continue;
    // Follow the reference's own url rather than rebuilding it from the name.
    const ref = codeIndex.references?.[id];
    const url = ref?.url;
    if (!url) {
      problems.push(`HKError.Code.${name}: no url in the enum page's references`);
      continue;
    }
    hkCases.push({ name, group: sec.title, url });
  }
}

const hkRows = [];
for (const { name, group, url } of hkCases) {
  const doc = await getJson(`https://developer.apple.com/tutorials/data${url}.json`, `apple-${name}.json`);
  const md = doc.metadata || {};
  const refs = doc.references || {};
  const abstract = linkedText(doc.abstract, refs).replace(/\s+/g, " ").trim();
  const paras = discussionOf(doc, name);
  const platforms = (md.platforms || []).map(platformOf);
  const deprecated = platforms.some((p) => p.deprecated);
  const summary = (doc.deprecationSummary || [])
    .map((node) => linkedText(node.inlineContent ?? [node], refs).trim())
    .filter(Boolean)
    .join(" ");
  const renamed = [...new Set((md.platforms || []).map((p) => p.renamed).filter(Boolean))];
  if (renamed.length > 1) problems.push(`HKError.Code.${name} is renamed to different symbols per platform: ${renamed.join(", ")}`);
  if (!deprecated && summary) problems.push(`HKError.Code.${name} has a deprecation note but no platform marks it deprecated`);
  // The declarations exactly as Apple prints them, Swift and Objective-C
  // (the occ variant arrives as a patch over primaryContentSections/0). Kept
  // because they are the evidence for "Apple publishes no raw values": a
  // declaration with a value would read "HKErrorX = 3".
  const declarations = [];
  const declOf = (sec) => {
    for (const d of sec?.declarations || []) {
      declarations.push({ language: (d.languages || []).join(","), text: (d.tokens || []).map((t) => t.text).join("") });
    }
  };
  for (const sec of doc.primaryContentSections || []) if (sec.kind === "declarations") declOf(sec);
  for (const v of doc.variantOverrides || []) {
    for (const p of v.patch || []) if (p.path === "/primaryContentSections/0" && p.value?.kind === "declarations") declOf(p.value);
  }
  if (!declarations.length) problems.push(`HKError.Code.${name}: no declaration parsed`);
  hkRows.push({
    case: name,
    // The Objective-C constant, from Apple's navigator title (e.g.
    // HKErrorHealthDataUnavailable). Null when Apple gives none.
    objc: (md.navigatorTitle || []).map((x) => x.text).join("") || null,
    // Apple's own role heading for the symbol ("Case", "Type Property").
    kind: md.roleHeading ?? null,
    group,
    abstract: abstract || null,
    discussion: paras.join(" ") || null,
    undocumented: !abstract && paras.length === 0,
    platforms,
    deprecated,
    deprecation: deprecated
      ? { message: summary || null, renamedTo: renamed.length === 1 ? renamed[0] : null }
      : null,
    declarations,
    docUrl: `https://developer.apple.com${url}`,
  });
}
console.log(`  HKError.Code: ${hkRows.length} cases`);

// ── 2. HealthConnectException ERROR_* constants ────────────────────────────
const hceHtml = await getText(HC_EXCEPTION_URL, "android-HealthConnectException.html");
const hceClassLevel = (() => {
  const block = /<div id="api-info-block">([\s\S]*?)<\/div>/.exec(hceHtml)?.[1] ?? "";
  const m = /Added in <a[^>]*>API level (\d+)<\/a>/.exec(block);
  return m ? Number(m[1]) : null;
})();
const hcRows = [];
{
  // Each constant's detail block opens with <div data-version-added="N"> and
  // an <h3 class="api-name" id="ERROR_…">, and ends before the next such div.
  const re = /<div data-version-added="(\d+)"\s*>\s*<h3 class="api-name" id="(ERROR_[A-Z_]+)"[^>]*>[\s\S]*?(?=<div data-version-added=|<h2 |<!-- ========)/g;
  for (const m of hceHtml.matchAll(re)) {
    const [block, versionAttr, name] = m;
    const apiLevelBlock = /<div class="api-level">([\s\S]*?)<\/div>/.exec(block)?.[1] ?? "";
    const apiLevelEvidence = textOf(apiLevelBlock) || null;
    const printed = /Added in API level (\d+)/.exec(apiLevelEvidence ?? "")?.[1];
    if (printed && printed !== versionAttr) {
      problems.push(`${name}: data-version-added=${versionAttr} but the page prints "Added in API level ${printed}"`);
    }
    const extension = /Also in (.+)$/.exec(apiLevelEvidence ?? "")?.[1]?.trim() ?? null;
    const deprecatedNote = /This constant was deprecated[^<]*/.exec(block)?.[0] ?? null;
    // Description: between the signature and "Constant Value:".
    const descHtml = /<\/devsite-code>([\s\S]*?)<p>\s*Constant Value:/.exec(block)?.[1] ?? "";
    const paras = paragraphsOf(descHtml);
    const valueMatch = /Constant Value:\s*(-?\d+)\s*\((0x[0-9a-fA-F]+)\)/.exec(textOf(block));
    if (!valueMatch) problems.push(`${name}: no "Constant Value:" parsed`);
    const similarSentence = paras.find((p) => /may be considered similar to/i.test(p)) ?? null;
    const similarTo = similarSentence ? /similar to\s+([A-Za-z_.]+?)\.?$/.exec(similarSentence.trim())?.[1] ?? null : null;
    if (similarSentence && !similarTo) problems.push(`${name}: "similar to" sentence did not yield a class name: ${similarSentence}`);
    hcRows.push({
      name,
      value: valueMatch ? Number(valueMatch[1]) : null,
      hex: valueMatch ? valueMatch[2] : null,
      description: paras[0] ?? null,
      detail: paras.slice(1).join(" ") || null,
      similarTo,
      similarToEvidence: similarSentence,
      apiLevel: Number(versionAttr),
      apiLevelEvidence,
      extension,
      deprecated: Boolean(deprecatedNote),
      deprecationNote: deprecatedNote ? textOf(deprecatedNote) : null,
      docUrl: `${HC_EXCEPTION_URL}#${name}`,
    });
  }
  // The summary table lists every constant too; the detail parse must find
  // the same set, or a block shape changed under us.
  const summaryNames = new Set([...hceHtml.matchAll(/href="[^"]*#(ERROR_[A-Z_]+)"/g)].map((x) => x[1]));
  for (const n of summaryNames) {
    if (!hcRows.some((r) => r.name === n)) problems.push(`${n} is linked from the summary but its detail block did not parse`);
  }
  hcRows.sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
}
console.log(`  HealthConnectException: ${hcRows.length} ERROR_* constants`);

// ── 3. HealthConnectClient "Throws" tables ─────────────────────────────────
const hccHtml = await getText(HC_CLIENT_URL, "android-HealthConnectClient.html");
const throwsRows = [];
for (const item of hccHtml.split('<div class="api-item">').slice(1)) {
  const method = /<h3 id="[^"]+" data-text="([^"]+)"/.exec(item)?.[1] ?? null;
  const table = /<th colspan="100%">Throws<\/th>[\s\S]*?<tbody class="list">([\s\S]*?)<\/tbody>/.exec(item)?.[1];
  if (!table) continue;
  if (!method) {
    problems.push("a Throws table sits in an api-item with no parsable method name");
    continue;
  }
  for (const row of table.match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
    const cells = row.match(/<td>[\s\S]*?<\/td>/g) ?? [];
    if (cells.length < 2) {
      problems.push(`${method}: Throws row without two cells`);
      continue;
    }
    const asWritten = textOf(cells[0]);
    // Google's cell can run on into the next prose paragraph ("Example code
    // to aggregate…"), which belongs to the method, not the exception. The
    // first paragraph is the exception's wording.
    const wording = paragraphsOf(cells[1])[0] ?? null;
    if (!asWritten || !wording) {
      problems.push(`${method}: Throws row with an empty exception or wording`);
      continue;
    }
    throwsRows.push({ method, asWritten, wording });
  }
}
const byException = new Map();
for (const r of throwsRows) {
  const simple = r.asWritten.split(".").pop();
  const e = byException.get(simple) ?? { exception: simple, writtenAs: [], wordings: [] };
  if (!e.writtenAs.includes(r.asWritten)) e.writtenAs.push(r.asWritten);
  let w = e.wordings.find((x) => x.text === r.wording);
  if (!w) e.wordings.push((w = { text: r.wording, methods: [] }));
  if (!w.methods.includes(r.method)) w.methods.push(r.method);
  byException.set(simple, e);
}
const hcClientRows = [...byException.values()]
  .map((e) => ({
    ...e,
    // Methods across every wording, for "documented on N methods".
    methodCount: new Set(e.wordings.flatMap((w) => w.methods)).size,
  }))
  .sort((a, b) => b.methodCount - a.methodCount || a.exception.localeCompare(b.exception));
console.log(
  `  HealthConnectClient Throws: ${throwsRows.length} rows → ${hcClientRows.length} exception types (${hcClientRows.map((e) => e.exception).join(", ")})`,
);

// ── Integrity gates: refuse to write a truncated dataset ───────────────────
// Floors are the counts of the last verified read (2026-10-03). Raise after a
// verified read; lower only after confirming on the vendor's site that a row
// really was removed — never to get a write through.
//
//  - HKError.Code: 17 cases across Apple's "Errors", "Enumeration Cases" and
//    "Type Properties" topic groups (init(rawValue:) excluded).
//  - HealthConnectException: 9 ERROR_* constants, values 1–9 as
//    printed under "Constant Value:".
//  - HealthConnectClient: 6 exception types in its Throws tables
//    (SecurityException, RemoteException, IOException,
//    IllegalStateException, IllegalArgumentException,
//    UnsupportedOperationException).
const EXPECTED_MIN_HK_CASES = 17;
const EXPECTED_MIN_HC_CONSTANTS = 9;
const EXPECTED_MIN_HC_CLIENT_EXCEPTIONS = 6;
if (hkRows.length < EXPECTED_MIN_HK_CASES) problems.push(`only ${hkRows.length} HKError.Code cases parsed (expected >= ${EXPECTED_MIN_HK_CASES})`);
if (hcRows.length < EXPECTED_MIN_HC_CONSTANTS) problems.push(`only ${hcRows.length} HealthConnectException constants parsed (expected >= ${EXPECTED_MIN_HC_CONSTANTS})`);
if (hcClientRows.length < EXPECTED_MIN_HC_CLIENT_EXCEPTIONS) problems.push(`only ${hcClientRows.length} HealthConnectClient exception types parsed (expected >= ${EXPECTED_MIN_HC_CLIENT_EXCEPTIONS})`);
// An HK case with a discussion but no abstract means the abstract parse broke;
// one with neither is Apple's genuine silence and is allowed, but bounded.
const hkSuspicious = hkRows.filter((r) => !r.abstract && r.discussion);
if (hkSuspicious.length) problems.push(`HKError.Code cases with discussion but no abstract (parser broken): ${hkSuspicious.map((r) => r.case)}`);
const hkUndocumented = hkRows.filter((r) => r.undocumented);
if (hkUndocumented.length > 8) problems.push(`${hkUndocumented.length} HKError.Code cases with no abstract — more than expected; check Apple's payload shape`);
if (hkRows.some((r) => r.platforms.length === 0)) problems.push(`HKError.Code cases with no platform data: ${hkRows.filter((r) => r.platforms.length === 0).map((r) => r.case)}`);
for (const r of hcRows) {
  if (r.value === null) continue; // already reported
  if (!r.description) problems.push(`${r.name}: no description parsed`);
}
if (new Set(hcRows.map((r) => r.value)).size !== hcRows.length) problems.push("two HealthConnectException constants share a value — the value parse is misaligned");
if (problems.length) {
  console.error("REFUSING TO WRITE — a source page's shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
if (hkUndocumented.length) {
  console.log(`note: ${hkUndocumented.length} HKError.Code case(s) with neither abstract nor discussion: ${hkUndocumented.map((r) => r.case).join(", ")}`);
}

const fetchedOn = new Date().toISOString().slice(0, 10);
const sources = {
  hkErrorCode: "https://developer.apple.com/documentation/healthkit/hkerror/code",
  healthConnectException: HC_EXCEPTION_URL,
  healthConnectClient: HC_CLIENT_URL,
};
const body = `/**
 * Platform error codes for HealthKit and Health Connect, read from Apple's
 * and Google's own reference documentation.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-error-codes.mjs
 *
 * Sources:
 *   ${sources.hkErrorCode} (and each case's page)
 *   ${sources.healthConnectException}
 *   ${sources.healthConnectClient}
 * Fetched: ${fetchedOn}
 *
 * Apple publishes no raw integer values for HKError.Code, so HK rows carry
 * none. Google prints a value for every HealthConnectException constant, so
 * those rows do.
 *
 * The one derived field is Health Connect's \`similarTo\`, copied from
 * Google's "This error may be considered similar to X" sentence, which is
 * stored beside it in \`similarToEvidence\`. Null where Google says nothing.
 *
 * Which fix page a code links to is editorial, not generated: see
 * src/data/errorCodesEditorial.ts.
 */

/** The date the generator last read the sources. */
export const ERROR_CODES_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The reference pages this file was read from. */
export const ERROR_CODES_SOURCES = ${JSON.stringify(sources, null, 2)} as const;

/**
 * Whether the Jetpack HealthConnectClient reference names the framework's
 * HealthConnectException anywhere on the page (it was absent on the
 * 2026-10-03 read: the Jetpack Throws tables name only the exceptions in
 * HC_CLIENT_EXCEPTIONS). A literal substring check of the page.
 */
export const HC_CLIENT_NAMES_HEALTHCONNECTEXCEPTION = ${JSON.stringify(hccHtml.includes("HealthConnectException"))};

/** Google's "Last updated" footer stamp on each Android page at read time. */
export const ERROR_CODES_SOURCE_UPDATED = ${JSON.stringify(
  { healthConnectException: googleLastUpdated(hceHtml), healthConnectClient: googleLastUpdated(hccHtml) },
  null,
  2,
)};

export type HkErrorCodePlatform = {
  name: string;
  introducedAt: string | null;
  /** True when Apple gives this platform a deprecatedAt version (or sets the
   *  deprecated boolean, which it in practice leaves false). */
  deprecated: boolean;
  /** The evidence for \`deprecated\`. Null where Apple gives none. */
  deprecatedAt: string | null;
  beta: boolean;
};

export type HkErrorCode = {
  /** Swift case on HKError.Code, e.g. "errorAuthorizationDenied". */
  case: string;
  /** Objective-C constant from Apple's navigator title, e.g.
   *  "HKErrorAuthorizationDenied". Null when Apple gives none. */
  objc: string | null;
  /** Apple's role heading for the symbol ("Case", "Type Property"). */
  kind: string | null;
  /** Apple's topic group on the HKError.Code page. */
  group: string;
  /** Apple's one-line abstract, verbatim; null when Apple publishes none. */
  abstract: string | null;
  /** Apple's discussion, symbol links resolved to their names; null when none. */
  discussion: string | null;
  /** True when Apple ships the case with neither abstract nor discussion. */
  undocumented: boolean;
  platforms: HkErrorCodePlatform[];
  deprecated: boolean;
  /** Apple's own words on the deprecation; null when not deprecated. */
  deprecation: { message: string | null; renamedTo: string | null } | null;
  /** The declarations as Apple prints them, per language ("swift", "occ"). */
  declarations: { language: string; text: string }[];
  /** Apple's reference page for the case — the page this row was read from. */
  docUrl: string;
};

/** Every HKError.Code case, in Apple's topic order. */
export const HK_ERROR_CODES: HkErrorCode[] = ${JSON.stringify(hkRows, null, 2)};

export type HcErrorConstant = {
  /** Constant name on android.health.connect.HealthConnectException. */
  name: string;
  /** Value printed under "Constant Value:". */
  value: number | null;
  hex: string | null;
  /** Google's first description paragraph, verbatim. */
  description: string | null;
  /** Google's further paragraphs, joined; null when none. */
  detail: string | null;
  /** Derived: the class named in \`similarToEvidence\`. Null when unstated. */
  similarTo: string | null;
  /** Google's sentence \`similarTo\` was copied from. */
  similarToEvidence: string | null;
  /** From the block's data-version-added, cross-checked against the text. */
  apiLevel: number;
  /** The printed availability line, e.g. "Added in API level 34 Also in U Extensions 7". */
  apiLevelEvidence: string | null;
  /** The SDK extension line, e.g. "U Extensions 7"; null when none printed. */
  extension: string | null;
  deprecated: boolean;
  deprecationNote: string | null;
  docUrl: string;
};

/** The API level HealthConnectException itself was added in, as printed. */
export const HC_EXCEPTION_API_LEVEL: number | null = ${JSON.stringify(hceClassLevel)};

/** Every ERROR_* constant on HealthConnectException, by value. */
export const HC_ERROR_CONSTANTS: HcErrorConstant[] = ${JSON.stringify(hcRows, null, 2)};

export type HcClientException = {
  /** Simple class name, e.g. "SecurityException". */
  exception: string;
  /** Every spelling the reference uses for it, e.g. "android.os.RemoteException". */
  writtenAs: string[];
  /** Each distinct wording Google uses, verbatim, with the methods it is on. */
  wordings: { text: string; methods: string[] }[];
  /** Distinct methods documenting this exception, across wordings. */
  methodCount: number;
};

/** Exceptions documented in HealthConnectClient's Throws tables. */
export const HC_CLIENT_EXCEPTIONS: HcClientException[] = ${JSON.stringify(hcClientRows, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${hkRows.length} HK cases, ${hcRows.length} HC constants, ${hcClientRows.length} HC client exceptions`);
console.log("fetched:");
for (const u of [...new Set(fetched)]) console.log("  " + u);
