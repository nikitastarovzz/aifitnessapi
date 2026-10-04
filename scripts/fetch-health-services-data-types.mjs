#!/usr/bin/env node
/**
 * Regenerate src/data/healthServicesDataTypes.ts from Google's own Wear OS
 * Health Services documentation:
 *
 *   1. androidx.health.services.client.data.DataType (Jetpack, Kotlin
 *      reference) — every companion constant: its name, its declared Kotlin
 *      type exactly as printed (e.g. DeltaDataType<Double,
 *      SampleDataPoint<Double>>), Google's description, and an "Added in"
 *      version where the constant's own block prints one.
 *   2. "Declare appropriate permissions" (health-and-fitness/health-services/
 *      permissions) — the data type → permission table, and the list of
 *      permissions above it, verbatim.
 *
 * No model in this loop. The data-type class and data-point class are read
 * from the printed declaration (the first identifier and the outer type of
 * the second type argument), and the declaration itself is stored beside
 * them. The one cross-source field is `permission`: it is set only where
 * Google's permissions table lists the constant by name, and the table row's
 * text is stored in `permissionEvidence`. Both are null for every constant the
 * table does not name — the table is not extended by analogy (a _TOTAL or
 * _STATS sibling of a listed type stays null).
 *
 * Google's pages are fetched with ?hl=en and an English Accept-Language, and a
 * machine-translated page (devsite-banner-translated) is refused: the parse
 * is anchored on English captions. Node's fetch may need NODE_USE_ENV_PROXY=1
 * behind a proxy.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/fetch-health-services-data-types.mjs [--offline]
 *   --offline reparses the cache in .cache/health-services without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://developer.android.com";
const DATA_TYPE_URL = `${ORIGIN}/reference/kotlin/androidx/health/services/client/data/DataType`;
const PERMISSIONS_URL = `${ORIGIN}/health-and-fitness/health-services/permissions`;
const CACHE = ".cache/health-services";
const META = join(CACHE, "meta.json");
const OUT = "src/data/healthServicesDataTypes.ts";
const OFFLINE = process.argv.includes("--offline");

// Floors = the counts of the last verified read (2026-10-04; DataType page
// "Last updated 2026-08-06", permissions page "Last updated 2026-01-19"):
// 65 companion constants on DataType, and a permissions table of 3 rows naming
// 28 data types (26 of them DataType constants; UserActivityInfo and
// UserActivityState are classes). Raise after a verified read; lower only
// after confirming on Google's page that a row really was removed — never to
// get a write through.
const EXPECTED_MIN_TYPES = 65;
const EXPECTED_MIN_PERMISSION_ROWS = 3;
const EXPECTED_MIN_PERMISSION_TYPES = 26;

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};

/** Every URL read this run (as requested, with hl=en). */
const fetched = [];

function trimPage(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

async function getPage(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  const enUrl = `${url}${url.includes("?") ? "&" : "?"}hl=en`;
  fetched.push(enUrl);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(enUrl, {
        headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" },
      });
      if (!res.ok) throw new Error(`${res.status} for ${enUrl}`);
      const text = trimPage(await res.text());
      if (/devsite-banner-translated/.test(text)) throw new Error(`translated page served for ${enUrl}`);
      writeFileSync(path, text);
      meta[cacheFile] = { url: enUrl, fetchedOn: new Date().toISOString().slice(0, 10) };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      await new Promise((r) => setTimeout(r, 200));
      return text;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const problems = [];

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
const paragraphsOf = (html) =>
  [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => textOf(m[1])).filter(Boolean);
const googleLastUpdated = (html) => /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;

// ── 1. DataType companion constants ────────────────────────────────────────
const dtHtml = await getPage(DATA_TYPE_URL, "DataType.html");
const classAddedIn = /<div id="added-in">Added in <a[^>]*>([^<]+)<\/a>/.exec(dtHtml)?.[1] ?? null;
const artifact = /<div id="maven-coordinates">Artifact: <a[^>]*>([^<]+)<\/a>/.exec(dtHtml)?.[1] ?? null;
if (!classAddedIn) problems.push("DataType: no class-level \"Added in\" line parsed");

// The class's own description (the paragraphs between the header's <hr> and
// the Summary heading) and its "Known direct subclasses" table, verbatim.
const classDescription = (() => {
  const summaryAt = dtHtml.indexOf('<h2 id="summary"');
  const hrAt = dtHtml.lastIndexOf("<hr>", summaryAt);
  if (summaryAt < 0 || hrAt < 0) {
    problems.push("DataType: class description block not found");
    return [];
  }
  return paragraphsOf(dtHtml.slice(hrAt, summaryAt));
})();
const subclasses = (() => {
  const block = /<div id="subclasses-direct-summary">([\s\S]*?)<\/table>/.exec(dtHtml)?.[1] ?? "";
  return (block.match(/<tr>[\s\S]*?<\/tr>/g) ?? []).map((tr) => {
    const cells = tr.match(/<td>[\s\S]*?<\/td>/g) ?? [];
    return { name: textOf(cells[0] ?? ""), description: textOf(cells[1] ?? "") };
  });
})();
if (classDescription.length < 2) problems.push(`DataType: only ${classDescription.length} class description paragraphs`);
if (subclasses.length < 2 || subclasses.some((s) => !s.name || !s.description)) problems.push("DataType: Known direct subclasses table did not parse");

const detailStart = dtHtml.indexOf('<h2 id="public-companion-properties_1"');
const detailEnd = dtHtml.indexOf("<h2 ", detailStart + 10);
if (detailStart < 0 || detailEnd < 0) problems.push('DataType: no "Public companion properties" detail section');
const detail = dtHtml.slice(detailStart, detailEnd);

const SIG_RE = /^val (\w+): ((\w+)<(.+)>)$/;
const rows = [];
for (const item of detail.split('<div class="api-item">').slice(1)) {
  const name = /<h3 id="[^"]+" data-text="([^"]+)"/.exec(item)?.[1];
  if (!name) {
    problems.push("an api-item in the companion section has no name");
    continue;
  }
  const sigHtml = /<pre class="api-signature[^"]*"[^>]*>([\s\S]*?)<\/pre>/.exec(item)?.[1];
  const signature = sigHtml ? textOf(sigHtml) : null;
  const m = signature ? SIG_RE.exec(signature) : null;
  if (!m || m[1] !== name) {
    problems.push(`${name}: signature did not parse: ${signature}`);
    continue;
  }
  const kotlinType = m[2];
  const dataTypeClass = m[3];
  // Type arguments: the value type, then the data-point type. Split on the
  // top-level comma only (the second argument is itself generic).
  let depth = 0;
  let split = -1;
  for (let i = 0; i < m[4].length; i++) {
    const c = m[4][i];
    if (c === "<") depth++;
    else if (c === ">") depth--;
    else if (c === "," && depth === 0) {
      split = i;
      break;
    }
  }
  if (split < 0) {
    problems.push(`${name}: could not split the type arguments of ${kotlinType}`);
    continue;
  }
  const valueType = m[4].slice(0, split).trim();
  const pointType = m[4].slice(split + 1).trim();
  const dataPointClass = /^(\w+)/.exec(pointType)?.[1] ?? null;
  const body = item.slice(item.indexOf("</devsite-code>"));
  const paras = paragraphsOf(body);
  const addedIn = /<div id="added-in">Added in <a[^>]*>([^<]+)<\/a>/.exec(item)?.[1] ?? null;
  const deprecatedLine = /<div id="deprecated-in">([\s\S]*?)<\/div>/.exec(item)?.[1];
  rows.push({
    name,
    kotlinType,
    dataTypeClass,
    valueType,
    dataPointClass,
    description: paras[0] ?? null,
    detail: paras.slice(1).join(" ") || null,
    addedIn,
    deprecated: Boolean(deprecatedLine) || /This (property|constant) is deprecated/i.test(textOf(body)),
    permission: null,
    permissionEvidence: null,
    docUrl: `${DATA_TYPE_URL}#${name}()`,
  });
}
console.log(`  DataType: ${rows.length} companion constants`);

// The summary table lists every constant with its type too; the detail parse
// must find the same names with the same declared types.
{
  const sumStart = dtHtml.indexOf('<h3 id="public-companion-properties"');
  const sumEnd = dtHtml.indexOf("</table>", sumStart);
  const summary = dtHtml.slice(sumStart, sumEnd);
  let n = 0;
  for (const tr of summary.match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
    const cells = tr.match(/<td>[\s\S]*?<\/td>/g);
    if (!cells || cells.length < 2) continue;
    const type = textOf(cells[0]);
    const nm = /DataType#(\w+)\(\)/.exec(cells[1])?.[1];
    if (!nm) continue;
    n++;
    const row = rows.find((r) => r.name === nm);
    if (!row) problems.push(`${nm} is in the summary table but its detail block did not parse`);
    else if (row.kotlinType !== type) problems.push(`${nm}: summary type "${type}" != detail type "${row.kotlinType}"`);
  }
  if (n !== rows.length) problems.push(`summary table lists ${n} constants, detail section ${rows.length}`);
}

// ── 2. Permissions page ────────────────────────────────────────────────────
const permHtml = await getPage(PERMISSIONS_URL, "permissions.html");
const permissionList = (() => {
  const i = permHtml.indexOf("uses the following distinct permissions");
  if (i < 0) {
    problems.push('permissions page: "uses the following distinct permissions" not found');
    return [];
  }
  const ul = /<ul>([\s\S]*?)<\/ul>/.exec(permHtml.slice(i))?.[1] ?? "";
  return [...ul.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => textOf(x[1]));
})();

const permissionRows = [];
const linkMismatches = [];
{
  const tables = [...permHtml.matchAll(/<table>([\s\S]*?)<\/table>/g)].map((x) => x[1]);
  const table = tables.find((t) => {
    const ths = (t.match(/<th>[\s\S]*?<\/th>/g) ?? []).map(textOf);
    return ths[0] === "Data type" && ths[1] === "Permission";
  });
  if (!table) problems.push('permissions page: no table headed "Data type | Permission"');
  for (const tr of (table ?? "").match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
    const cells = tr.match(/<td>[\s\S]*?<\/td>/g);
    if (!cells) continue; // the header row
    if (cells.length !== 2) {
      problems.push(`permissions table row with ${cells.length} cells`);
      continue;
    }
    // The names are the <code> texts; the link targets are not trusted (on
    // the 2026-10-04 read CALORIES_DAILY linked to #DISTANCE_DAILY).
    const dataTypes = [];
    for (const a of cells[0].matchAll(/<a href="([^"]*)"[^>]*>\s*<code[^>]*>([^<]+)<\/code>\s*<\/a>/g)) {
      const shown = a[2].trim();
      dataTypes.push(shown);
      const target = /#(\w+)$/.exec(a[1])?.[1];
      if (target && target !== shown) linkMismatches.push({ shown, linksTo: target });
    }
    const codeCount = (cells[0].match(/<code\b/g) ?? []).length;
    if (codeCount !== dataTypes.length) problems.push(`permissions table: ${codeCount} names in a cell but ${dataTypes.length} parsed`);
    const permissions = [...cells[1].matchAll(/<code[^>]*>([^<]+)<\/code>/g)].map((x) => x[1].trim());
    if (permissions.length !== 1) problems.push(`permissions table row names ${permissions.length} permissions: ${textOf(cells[1])}`);
    permissionRows.push({ dataTypes, permission: permissions.join(", "), text: `${textOf(cells[0])} | ${textOf(cells[1])}` });
  }
}
const unmatchedTableNames = [];
for (const pr of permissionRows) {
  for (const dt of pr.dataTypes) {
    const row = rows.find((r) => r.name === dt);
    if (!row) {
      unmatchedTableNames.push(dt);
      continue;
    }
    if (row.permission && row.permission !== pr.permission) problems.push(`${dt} sits in two permission rows (${row.permission}, ${pr.permission})`);
    row.permission = pr.permission;
    row.permissionEvidence = pr.text;
  }
}
const withPermission = rows.filter((r) => r.permission).length;
console.log(
  `  permissions: ${permissionRows.length} rows, ${withPermission} DataType constants matched, not constants: ${unmatchedTableNames.join(", ") || "none"}`,
);

// ── Integrity gates ────────────────────────────────────────────────────────
if (rows.length < EXPECTED_MIN_TYPES) problems.push(`only ${rows.length} DataType constants parsed (expected >= ${EXPECTED_MIN_TYPES})`);
if (permissionRows.length < EXPECTED_MIN_PERMISSION_ROWS) problems.push(`only ${permissionRows.length} permission rows (expected >= ${EXPECTED_MIN_PERMISSION_ROWS})`);
if (withPermission < EXPECTED_MIN_PERMISSION_TYPES) problems.push(`only ${withPermission} constants matched a permission row (expected >= ${EXPECTED_MIN_PERMISSION_TYPES})`);
if (new Set(rows.map((r) => r.name)).size !== rows.length) problems.push("duplicate DataType constant names");
const noDesc = rows.filter((r) => !r.description);
if (noDesc.length) problems.push(`constants with no description: ${noDesc.map((r) => r.name)}`);
const KNOWN_TYPE_CLASSES = new Set(["DeltaDataType", "AggregateDataType"]);
const KNOWN_POINT_CLASSES = new Set(["SampleDataPoint", "IntervalDataPoint", "CumulativeDataPoint", "StatisticalDataPoint"]);
for (const r of rows) {
  if (!KNOWN_TYPE_CLASSES.has(r.dataTypeClass)) problems.push(`${r.name}: unfamiliar data-type class ${r.dataTypeClass} — check the page and extend the page's labels`);
  if (!KNOWN_POINT_CLASSES.has(r.dataPointClass)) problems.push(`${r.name}: unfamiliar data-point class ${r.dataPointClass}`);
}
if (permissionList.length < 3) problems.push(`permissions page: only ${permissionList.length} items in the permission list`);
if (problems.length) {
  console.error("REFUSING TO WRITE — a source page's shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const fetchedOn = meta["DataType.html"]?.fetchedOn ?? new Date().toISOString().slice(0, 10);
const sources = { dataType: DATA_TYPE_URL, permissions: PERMISSIONS_URL };
const body = `/**
 * Wear OS Health Services data types (androidx.health.services.client.data.
 * DataType companion constants) and the permission each needs, read from
 * Google's own reference and guide.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-health-services-data-types.mjs
 *
 * Sources:
 *   ${DATA_TYPE_URL}
 *   ${PERMISSIONS_URL}
 * Fetched: ${fetchedOn}
 *
 * dataTypeClass, valueType and dataPointClass are read from the declaration
 * printed in \`kotlinType\`. \`permission\` is set only where Google's
 * permissions table names the constant, and that row's text is stored in
 * \`permissionEvidence\`; both are null otherwise.
 */

/** The date the generator last read the sources (the DataType page's fetch date). */
export const HS_DATA_TYPES_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The pages this file was read from. */
export const HS_DATA_TYPES_SOURCES = ${JSON.stringify(sources, null, 2)} as const;

/** Google's "Last updated" footer stamp on each page at read time. */
export const HS_DATA_TYPES_SOURCE_UPDATED = ${JSON.stringify(
  { dataType: googleLastUpdated(dtHtml), permissions: googleLastUpdated(permHtml) },
  null,
  2,
)};

/** The Jetpack artifact and the version DataType itself was added in, as printed. */
export const HS_DATA_TYPE_ARTIFACT: string | null = ${JSON.stringify(artifact)};
export const HS_DATA_TYPE_CLASS_ADDED_IN: string | null = ${JSON.stringify(classAddedIn)};

/** Google's description of the DataType class, paragraph by paragraph, verbatim. */
export const HS_DATA_TYPE_CLASS_DESCRIPTION: string[] = ${JSON.stringify(classDescription, null, 2)};

/** DataType's "Known direct subclasses" table, verbatim. */
export const HS_DATA_TYPE_SUBCLASSES: { name: string; description: string }[] = ${JSON.stringify(subclasses, null, 2)};

export type HsDataType = {
  /** Companion constant name, e.g. "HEART_RATE_BPM". */
  name: string;
  /** The declared type exactly as printed, e.g. "DeltaDataType<Double, SampleDataPoint<Double>>". */
  kotlinType: string;
  /** "DeltaDataType" or "AggregateDataType" — the declaration's outer type. */
  dataTypeClass: string;
  /** The first type argument, e.g. "Double", "Long", "LocationData". */
  valueType: string;
  /** "SampleDataPoint", "IntervalDataPoint", "CumulativeDataPoint" or "StatisticalDataPoint". */
  dataPointClass: string;
  /** Google's first description paragraph, verbatim. */
  description: string | null;
  /** Google's further paragraphs, joined; null when none. */
  detail: string | null;
  /** The constant's own "Added in" version; null where its block prints none. */
  addedIn: string | null;
  deprecated: boolean;
  /** The permission Google's permissions table lists it under; null where the table does not name it. */
  permission: string | null;
  /** The table row \`permission\` was read from ("data types | permission"). */
  permissionEvidence: string | null;
  docUrl: string;
};

/** Every DataType companion constant, in the reference's (alphabetical) order. */
export const HS_DATA_TYPES: HsDataType[] = ${JSON.stringify(rows, null, 2)};

/** Google's permissions table, row by row, names as printed. */
export const HS_PERMISSION_ROWS: { dataTypes: string[]; permission: string; text: string }[] = ${JSON.stringify(
  permissionRows,
  null,
  2,
)};

/** Names in the permissions table that are not DataType constants (classes such as UserActivityInfo). */
export const HS_PERMISSION_TABLE_NON_CONSTANTS: string[] = ${JSON.stringify(unmatchedTableNames)};

/** Table cells whose link target differs from the name shown (the name is what this file uses). */
export const HS_PERMISSION_TABLE_LINK_MISMATCHES: { shown: string; linksTo: string }[] = ${JSON.stringify(linkMismatches)};

/** The permission list above the table ("Health Services on Wear OS uses the following distinct permissions"), verbatim. */
export const HS_PERMISSION_LIST: string[] = ${JSON.stringify(permissionList, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${rows.length} data types, ${withPermission} with a table permission, ${permissionRows.length} permission rows`);
console.log("fetched:");
for (const u of [...new Set(fetched)]) console.log("  " + u);
