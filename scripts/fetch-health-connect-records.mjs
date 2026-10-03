#!/usr/bin/env node
/**
 * Regenerate src/data/healthConnectRecords.ts from Google's own documentation.
 *
 * Three kinds of page are read, all on developer.android.com:
 *
 *   1. The Health Connect data-types page — Google's catalogue of record
 *      classes. Its table gives each record's category (Google's own seven
 *      categories), record shape (Interval / Instantaneous / Series), unit
 *      class, mandatory fields, the exact permission strings to declare, any
 *      feature flag, and the aggregate metrics it supports.
 *   2. Each record's Jetpack reference page
 *      (/reference/kotlin/androidx/health/connect/client/records/<Class>) —
 *      Google's description of the class, its constructor (typed, with
 *      range annotations and defaults), its properties with descriptions,
 *      its constants (enum values such as sleep stages) and its aggregate
 *      metric constants with descriptions, plus the page's "Last updated"
 *      date and the "Added in" version the reference states.
 *   3. The two permission references — the framework class
 *      android.health.connect.HealthPermissions (every
 *      android.permission.health.* string Google documents, with its API
 *      level) and the Jetpack HealthPermission class (the special read
 *      permissions as constants). These are the cross-check: a permission
 *      string the data-types table prints that neither reference defines is
 *      flagged on the record rather than silently published as correct.
 *
 * There is no model in this loop. Every published field is copied from one
 * of those pages. The few derived fields keep the text they came from:
 *
 *   readPermissions / writePermissions — split from the data-types cell by the
 *       literal READ_ / WRITE_ prefix of each string; the whole cell travels
 *       with them as `permissionEvidence`.
 *   range on a property — copied from an @IntRange / @FloatRange annotation
 *       in Google's signature; null when the signature carries none (Google
 *       may still validate in code — we do not guess what it checks).
 *   unit of an aggregate metric — the type parameter of AggregateMetric<T> in
 *       Google's own signature, never inferred from the name.
 *
 * Usage: node scripts/fetch-health-connect-records.mjs [--offline]
 *   --offline reparses the cache in .cache/health-connect without refetching.
 *   Node's built-in fetch ignores HTTPS_PROXY; behind a proxy run it with
 *   NODE_USE_ENV_PROXY=1 (Node >= 22.21).
 *
 * The cache keeps each page trimmed to its <article> through the content
 * footer (where "Last updated" lives) — the reference pages are ~4 MB of
 * navigation each and the parse needs none of it. The fetch date of each
 * cached page is kept in .cache/health-connect/meta.json, so an --offline
 * reparse publishes the date the bytes were actually fetched, not the date
 * the script happened to run.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://developer.android.com";
const DATA_TYPES_URL = `${ORIGIN}/health-and-fitness/health-connect/data-types`;
const RECORD_REF = `${ORIGIN}/reference/kotlin/androidx/health/connect/client/records`;
const FW_PERMISSIONS_URL = `${ORIGIN}/reference/android/health/connect/HealthPermissions`;
const JETPACK_PERMISSION_URL = `${ORIGIN}/reference/kotlin/androidx/health/connect/client/permission/HealthPermission`;
const CACHE = ".cache/health-connect";
const META = join(CACHE, "meta.json");
const OUT = "src/data/healthConnectRecords.ts";
const OFFLINE = process.argv.includes("--offline");

// Google's data-types page listed 42 distinct record classes on 2026-10-03
// (page "Last updated 2026-09-23"). Every read so far has only added
// classes, so fewer almost certainly means the parse dropped rows. Raise it
// after a verified read; lower it only after checking on Google's page that
// a record really was removed — never to get a write through.
const EXPECTED_MIN_RECORDS = 42;
// The framework HealthPermissions reference defined 219 permission constants
// on 2026-10-03. Same rule.
const EXPECTED_MIN_FW_PERMISSIONS = 219;
// Aggregate metric constants across all records on 2026-10-03 (the
// data-types table links the same 92).
const EXPECTED_MIN_AGGREGATES = 92;

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};

function trimPage(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

async function getPage(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Without an explicit language devsite may serve a machine-translated
      // page (a Korean banner came back on the first run), and the parse is
      // anchored on Google's English table captions.
      const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}hl=en`, {
        headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" },
      });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      const text = trimPage(await res.text());
      if (/devsite-banner-translated/.test(text)) throw new Error(`translated page served for ${url}`);
      writeFileSync(path, text);
      meta[cacheFile] = { url, fetchedOn: new Date().toISOString().slice(0, 10) };
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

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => ENTITIES[n] ?? m);
}
/** Strip tags, decode entities, collapse whitespace. */
function text(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}
/** Like text() but keeps line breaks from <br> — for code signatures. */
function codeText(html) {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}
function lastUpdated(html) {
  const m = html.match(/Last updated (\d{4}-\d{2}-\d{2}) UTC/);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------------------
// 1. The data-types page
// ---------------------------------------------------------------------------

function parseDataTypes(html) {
  // The seven categories, in Google's order and with Google's descriptions.
  const categories = [];
  const catTable = html.match(/Table: Health Connect data type categories[\s\S]*?<\/table>/);
  if (catTable) {
    for (const tr of catTable[0].match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
      const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1]));
      if (tds.length >= 3) categories.push({ name: tds[1], description: tds[2] });
    }
  }

  // The additional read permissions (background, history).
  const additional = [];
  const addTable = html.match(/Table: Additional read permissions[\s\S]*?<\/table>/);
  if (addTable) {
    for (const tr of addTable[0].match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
      const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
      if (tds.length >= 2) {
        const perm = text(tds[1]);
        const label = text(tds[0].replace(/<a[\s\S]*?<\/a>[\s\S]*$/, ""));
        if (perm.startsWith("android.permission.health.")) additional.push({ permission: perm, label });
      }
    }
  }

  const sdkP = html.match(/<p>\s*(This table is for the Health Connect SDK version[\s\S]*?)<\/p>/);
  const sdkNote = sdkP ? text(sdkP[1]) : null;

  const table = html.match(/<table class="fixed" id="table-data-types">([\s\S]*?)<\/table>/);
  if (!table) throw new Error("data-types table #table-data-types not found");
  const rows = [];
  for (const tr of table[1].match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
    const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (tds.length < 3) continue;
    const [left, catCell, right] = tds;
    const label = text((left.match(/<strong[^>]*>([\s\S]*?)<\/strong>/) ?? [])[1] ?? "");
    const guides = [...left.matchAll(/<a href="(\/health-and-fitness\/[^"]+)">([\s\S]*?)<\/a>\s*guide/g)].map((m) => ({
      title: `${text(m[2])} guide`,
      url: ORIGIN + m[1],
    }));
    const classes = [...right.matchAll(/records\/([A-Za-z0-9]+Record)"/g)]
      .map((m) => m[1])
      .filter((c, i, a) => a.indexOf(c) === i);
    // Per-class blocks in the left cell: "For StepsRecord:" … when the row
    // carries more than one class; otherwise one block for the only class.
    const blocks = {};
    if (classes.length > 1) {
      const parts = left.split(/For\s+<code[^>]*>|For\s+(?=[A-Z][A-Za-z0-9]+Record:)/);
      for (const part of parts.slice(1)) {
        const cls = (text(part).match(/^([A-Za-z0-9]+Record)/) ?? [])[1];
        if (cls) blocks[cls] = part;
      }
    } else if (classes.length === 1) {
      blocks[classes[0]] = left;
    }
    const perms = [...right.matchAll(/<code[^>]*>(android\.permission\.health\.[A-Z0-9_]+)\s*<\/code>/g)].map((m) => m[1]);
    const featureFlag = (right.match(/<code[^>]*>(FEATURE_[A-Z0-9_]+)<\/code>/) ?? [])[1] ?? null;
    const aggregates = [...right.matchAll(/records\/([A-Za-z0-9]+Record)#([A-Z0-9_]+)\(\)/g)].map((m) => ({
      className: m[1],
      name: m[2],
    }));
    // Enumerations the table spells out inline ("Exercise types",
    // "Mindfulness session types") are not copied from here — the reference
    // page carries the full constant list with values and descriptions.
    const category = text(catCell);
    const permissionEvidence = `Google's data-types table, row "${label}" (${classes.join(", ")}): ${perms.join(", ")}`;
    for (const cls of classes) {
      const b = blocks[cls] ?? "";
      const recordShape = (text(b).match(/Record Type:\s*(Interval|Instantaneous|Series)/) ?? [])[1] ?? null;
      const unitM = b.match(/Unit:\s*<\/strong>\s*<a href="\/reference\/kotlin\/androidx\/health\/connect\/client\/units\/([A-Za-z]+)"/);
      const mandatory = [...(b.match(/Mandatory Fields<\/h4>\s*<div[^>]*>([\s\S]*?)<\/div>/) ?? ["", ""])[1].matchAll(/<code[^>]*>([^<]+)<\/code>/g)]
        .map((m) => m[1])
        .filter((f, i, a) => a.indexOf(f) === i);
      rows.push({
        className: cls,
        dataTypeLabel: label,
        category,
        recordShape,
        unitClass: unitM ? unitM[1] : null,
        mandatoryFields: mandatory,
        guides,
        permissions: perms,
        permissionEvidence,
        featureFlag,
        aggregateNames: aggregates.filter((a) => a.className === cls).map((a) => a.name),
        sharedRow: classes.length > 1 ? classes.filter((c) => c !== cls) : [],
      });
    }
  }
  return { categories, additional, sdkNote, rows, updated: lastUpdated(html) };
}

// ---------------------------------------------------------------------------
// 2. A record's Jetpack reference page
// ---------------------------------------------------------------------------

/** The prose paragraphs of a block, verbatim text, code samples excluded. */
function paragraphs(html) {
  const noCode = html.replace(/<devsite-code>[\s\S]*?<\/devsite-code>/g, "").replace(/<pre[\s\S]*?<\/pre>/g, "");
  return [...noCode.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => text(m[1])).filter(Boolean);
}

/** Summary tables keyed by their h3 id ("public-properties", "constants"…). */
function summaryTables(html) {
  const out = {};
  for (const t of html.matchAll(/<table class="responsive">([\s\S]*?)<\/table>/g)) {
    const id = (t[1].match(/<h3 id="([a-z-]+)"/) ?? [])[1];
    if (!id) continue;
    const rows = [];
    for (const tr of t[1].match(/<tr>\s*<td[\s\S]*?<\/tr>/g) ?? []) {
      const tds = [...tr.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
      rows.push(tds);
    }
    out[id] = rows;
  }
  return out;
}

/** Detail sections: <div class="list"><h2 id="constants_1">…api-items. */
function detailItems(html, sectionPrefix) {
  const re = new RegExp(`<div class="list">\\s*<h2 id="${sectionPrefix}(?:_\\d+)?"[\\s\\S]*?(?=<div class="list">|<devsite-hats-survey|$)`);
  const sec = html.match(re);
  if (!sec) return [];
  const items = [];
  const parts = sec[0].split(/<div class="api-item">/).slice(1);
  for (const p of parts) {
    const name = (p.match(/<h3 id="[^"]*" data-text="([^"]+)"/) ?? [])[1] ?? null;
    const sig = (p.match(/<pre class="api-signature[^"]*"[^>]*>([\s\S]*?)<\/pre>/) ?? [])[1];
    const added = (p.match(/<div id="added-in">Added in <a[^>]*>([^<]+)<\/a>/) ?? [])[1] ?? null;
    const deprecated = /class="deprecated"|<strong>This [a-z]+ is deprecated/i.test(p);
    items.push({
      name: name ? decode(name) : null,
      signature: sig ? codeText(sig) : null,
      signatureHtml: sig ?? null,
      description: paragraphs(p.replace(/<pre class="api-signature[\s\S]*?<\/pre>/, "")).join(" ") || null,
      addedIn: added,
      deprecated,
    });
  }
  return items;
}

function rangeOf(type) {
  const m = type.match(/@(IntRange|FloatRange)\(([^)]*)\)/);
  if (!m) return null;
  const from = (m[2].match(/from\s*=\s*(-?[0-9.]+)/) ?? [])[1] ?? null;
  const to = (m[2].match(/to\s*=\s*(-?[0-9.]+)/) ?? [])[1] ?? null;
  return { annotation: `@${m[1]}(${m[2].replace(/\s+/g, " ").trim()})`, from, to };
}

function stripTypeAnnotations(type) {
  return type.replace(/@(IntRange|FloatRange)\([^)]*\)\s*/g, "").replace(/^open\s+/, "").replace(/^override\s+/, "").trim();
}

function parseRecordPage(html, className) {
  const art = html;
  const header = (art.match(/<div id="header-block">([\s\S]*?)<hr/) ?? [])[1] ?? "";
  const addedIn = (header.match(/<div id="added-in">Added in <a[^>]*>([^<]+)<\/a>/) ?? [])[1] ?? null;
  const h1 = (header.match(/<h1[^>]*data-text="([^"]+)"/) ?? [])[1];
  // The class signature and the description sit between the language
  // switcher and the Summary heading.
  const afterSwitch = art.split(/<h2 id="summary"/)[0];
  const sigM = afterSwitch.match(/<pre translate="no" dir="ltr" is-upgraded>(class [\s\S]*?)<\/pre>/);
  const signature = sigM ? codeText(sigM[1]) : null;
  const descHtml = afterSwitch.slice(afterSwitch.lastIndexOf("<hr>") >= 0 ? afterSwitch.lastIndexOf("<hr>") : 0);
  const description = paragraphs(descHtml.replace(/<table[\s\S]*?<\/table>/g, ""));
  const exampleM = descHtml.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
  const googleExample = exampleM ? codeText(exampleM[1]) : null;
  const classDeprecated = /This class is deprecated/i.test(afterSwitch);
  const experimental = [...new Set([...afterSwitch.matchAll(/@(Experimental[A-Za-z]+Api)/g)].map((m) => m[1]))];

  const tables = summaryTables(art);

  // Nested types: name + Google's one-line description.
  const nestedTypes = (tables["nested-types"] ?? []).map((tds) => {
    const cell = tds[tds.length - 1] ?? tds[0];
    const nm = text((cell.match(/<code[^>]*>([\s\S]*?)<\/code>/) ?? [])[1] ?? "");
    const kind = text(tds[0] ?? "").replace(nm, "").trim() || null;
    return {
      name: nm.replace(/^(class|enum class|object|interface|sealed class|annotation class)\s+/, ""),
      kind: (nm.match(/^(class|enum class|object|interface|sealed class|annotation class)/) ?? [])[1] ?? kind,
      description: paragraphs(cell).join(" ") || null,
    };
  });

  // Constants: `const val STAGE_TYPE_AWAKE = 1: Int`.
  const constants = detailItems(art, "constants").map((it) => {
    const m = (it.signature ?? "").match(/const val\s+([A-Z0-9_]+)\s*=\s*(.+?):\s*([A-Za-z<>?]+)\s*$/s);
    return {
      name: it.name,
      value: m ? m[2].trim() : null,
      type: m ? m[3] : null,
      description: it.description,
    };
  });

  // Companion properties: AggregateMetric<T> constants, and anything else
  // Google declares on the companion (kept, but separately).
  const companion = detailItems(art, "public-companion-properties");
  const aggregateMetrics = [];
  const otherCompanion = [];
  for (const it of companion) {
    const am = (it.signature ?? "").match(/val\s+([A-Z0-9_]+):\s*AggregateMetric<([^>]+)>/);
    if (am) {
      // The fully qualified value type, from the link Google's signature puts
      // on T (e.g. …/client/units/Energy → androidx.health.connect.client.units.Energy,
      // …/java/time/Duration.html → java.time.Duration). Null when T is unlinked.
      const href = (it.signatureHtml?.match(/AggregateMetric<\/a>&lt;<a href="([^"]+)"/) ?? [])[1] ?? null;
      let valueTypeQualified = null;
      if (href) {
        const ref = href.match(/\/reference\/(?:kotlin\/)?((?:androidx|java|android)\/[A-Za-z0-9_/]+?)(?:\.html)?$/);
        const kt = href.match(/kotlinlang\.org\/api\/core\/kotlin-stdlib\/kotlin\/-([a-z-]+)\/index\.html/);
        if (ref) valueTypeQualified = ref[1].replace(/\//g, ".");
        else if (kt) valueTypeQualified = `kotlin.${am[2].trim()}`;
      }
      aggregateMetrics.push({ name: am[1], valueType: am[2].trim(), valueTypeQualified, description: it.description });
    }
    else otherCompanion.push({ name: it.name, signature: it.signature, description: it.description });
  }

  // Constructor(s): parameters with type, range annotation and default.
  const ctorItems = detailItems(art, "public-constructors");
  const constructors = ctorItems.map((it) => it.signature).filter(Boolean);
  const ctorParams = new Map();
  for (const sig of constructors) {
    const inner = sig.slice(sig.indexOf("(") + 1, sig.lastIndexOf(")"));
    // Split on top-level commas only (generics and annotations contain them).
    let depth = 0;
    let cur = "";
    const parts = [];
    for (const ch of inner) {
      if ("(<[".includes(ch)) depth++;
      if (")>]".includes(ch)) depth--;
      if (ch === "," && depth === 0) {
        parts.push(cur);
        cur = "";
      } else cur += ch;
    }
    if (cur.trim()) parts.push(cur);
    for (const raw of parts) {
      const p = raw.replace(/\s+/g, " ").trim();
      const m = p.match(/^([a-zA-Z0-9_]+):\s*(.+)$/);
      if (!m) continue;
      // The default is after the first " = " outside parentheses — an
      // annotation like @IntRange(from = 1, to = 1000000) has its own.
      let d = 0;
      let cut = -1;
      for (let i = 0; i < m[2].length; i++) {
        const ch = m[2][i];
        if (ch === "(" || ch === "<") d++;
        else if (ch === ")" || ch === ">") d--;
        else if (d === 0 && m[2].startsWith(" = ", i)) {
          cut = i;
          break;
        }
      }
      const type = cut >= 0 ? m[2].slice(0, cut) : m[2];
      const def = cut >= 0 ? m[2].slice(cut + 3) : null;
      if (!ctorParams.has(m[1])) ctorParams.set(m[1], { type: type.trim(), default: def?.trim() ?? null });
    }
  }

  // Properties: summary table gives the type; detail gives the full text.
  const propSummary = new Map();
  for (const tds of tables["public-properties"] ?? []) {
    if (tds.length < 2) continue;
    const nm = text((tds[1].match(/<code[^>]*>([\s\S]*?)<\/code>/) ?? [])[1] ?? "");
    propSummary.set(nm, text(tds[0]));
  }
  const properties = detailItems(art, "public-properties").map((it) => {
    const summaryType = propSummary.get(it.name) ?? "";
    const sigType = ((it.signature ?? "").match(/val\s+[A-Za-z0-9_]+:\s*([\s\S]+)$/) ?? [])[1]?.trim() ?? "";
    const ctor = ctorParams.get(it.name) ?? null;
    const typeWithAnn = summaryType || sigType;
    const range = rangeOf(typeWithAnn) ?? (ctor ? rangeOf(ctor.type) : null);
    // Google more often states a range in prose than in an annotation
    // ("Valid range: 1-1000000."). That sentence is kept verbatim; it is not
    // parsed into numbers, because the wording varies and a misread bound is
    // worse than a quoted one.
    const rangeStatement = (it.description?.match(/[^.]*\b(?:[Vv]alid range|[Rr]ange)\b[^.]*(?:\.\d+[^.]*)*\./) ?? [])[0]?.trim() ?? null;
    return {
      name: it.name,
      type: stripTypeAnnotations(typeWithAnn || sigType),
      range,
      rangeStatement,
      description: it.description,
      inConstructor: Boolean(ctor),
      constructorDefault: ctor?.default ?? null,
      addedIn: it.addedIn,
      deprecated: it.deprecated,
    };
  });

  return {
    h1: h1 ? decode(h1) : null,
    addedIn,
    signature,
    description,
    googleExample,
    classDeprecated,
    experimental,
    nestedTypes,
    constants,
    aggregateMetrics,
    otherCompanion,
    constructors,
    properties,
    updated: lastUpdated(art),
    className,
  };
}

// ---------------------------------------------------------------------------
// 3. Permission references
// ---------------------------------------------------------------------------

function parseFrameworkPermissions(html) {
  const out = [];
  // Detail blocks: <h3 … data-text="READ_STEPS"> … Constant Value: "…"
  const parts = html.split(/<div data-version-added="[^"]*"\s*>\s*<h3 class="api-name" id="/).slice(1);
  for (const p of parts) {
    const name = (p.match(/^([A-Z0-9_]+)"/) ?? [])[1];
    if (!name) continue;
    const value = (p.match(/Constant Value:[\s\S]*?"(android\.permission\.health\.[A-Z0-9_]+)"/) ?? p.match(/&quot;(android\.permission\.health\.[A-Z0-9_]+)&quot;/) ?? [])[1] ?? null;
    if (!value) continue;
    const added = text((p.match(/<div class="api-level">([\s\S]*?)<\/div>/) ?? [])[1] ?? "") || null;
    const descHtml = (p.match(/<\/pre>([\s\S]*?)(?:<p>\s*Constant Value|Constant Value:)/) ?? [])[1] ?? "";
    // Google nests unclosed <p> tags here, so the block is read as one run of
    // text rather than as paragraphs.
    const description = text(descHtml) || null;
    const protection = (description?.match(/Protection level:\s*([a-z|]+)/) ?? [])[1] ?? null;
    out.push({
      constant: name,
      value,
      description: description?.replace(/\s*Protection level:\s*[a-z|]+\.?\s*$/, "").trim() || null,
      protectionLevel: protection,
      added,
    });
  }
  return { permissions: out, updated: lastUpdated(html) };
}

function parseJetpackPermissionConstants(html) {
  // Annotations (e.g. @ExperimentalPersonalHealthRecordApi) are printed in
  // the summary table's name cell, on the line above the constant name.
  const annotations = new Map();
  for (const tds of summaryTables(html)["constants"] ?? []) {
    if (tds.length < 2) continue;
    const cell = (tds[1].match(/<code[^>]*>([\s\S]*?)<\/code>/) ?? [])[1] ?? "";
    const nm = (cell.match(/#([A-Z0-9_]+)\(\)"/) ?? [])[1];
    if (!nm) continue;
    annotations.set(nm, [...text(cell).matchAll(/@([A-Za-z]+)/g)].map((m) => m[1]));
  }
  return detailItems(html, "constants").map((it) => {
    const value = (it.description?.match(/android\.permission\.health\.[A-Z0-9_]+/) ?? [])[0] ?? null;
    return { constant: it.name, value, annotations: annotations.get(it.name) ?? [], description: it.description };
  });
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const dtHtml = await getPage(DATA_TYPES_URL, "data-types.html");
const dt = parseDataTypes(dtHtml);
const fwHtml = await getPage(FW_PERMISSIONS_URL, "HealthPermissions.html");
const fw = parseFrameworkPermissions(fwHtml);
const jpHtml = await getPage(JETPACK_PERMISSION_URL, "HealthPermission.html");
const jetpackConstants = parseJetpackPermissionConstants(jpHtml);

const fwByValue = new Map(fw.permissions.map((p) => [p.value, p]));
const jpByValue = new Map(jetpackConstants.filter((c) => c.value).map((c) => [c.value, c]));

function kebab(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const problems = [];
const records = [];
for (const row of dt.rows) {
  const sourceUrl = `${RECORD_REF}/${row.className}`;
  const html = await getPage(sourceUrl, `records/${row.className}.html`.replace("records/", "record-"));
  const ref = parseRecordPage(html, row.className);
  if (ref.h1 !== row.className) problems.push(`${row.className}: reference h1 is ${ref.h1}`);
  if (!ref.description.length) problems.push(`${row.className}: no description parsed`);
  if (!ref.properties.length) problems.push(`${row.className}: no properties parsed`);
  if (!ref.updated) problems.push(`${row.className}: no "Last updated" date`);
  const readPermissions = row.permissions.filter((p) => /\.READ_/.test(p));
  const writePermissions = row.permissions.filter((p) => /\.WRITE_/.test(p));
  // The aggregate metrics come from the reference page (with Google's
  // description and value type). The data-types table names them too; any
  // name the table lists that the reference does not define is a problem.
  for (const n of row.aggregateNames) {
    if (!ref.aggregateMetrics.some((a) => a.name === n)) problems.push(`${row.className}: table lists ${n} but the reference page does not define it`);
  }
  records.push({
    className: row.className,
    slug: kebab(row.className),
    qualifiedName: `androidx.health.connect.client.records.${row.className}`,
    dataTypeLabel: row.dataTypeLabel,
    category: row.category || null,
    recordShape: row.recordShape,
    unitClass: row.unitClass,
    mandatoryFields: row.mandatoryFields,
    description: ref.description,
    googleExample: ref.googleExample,
    signature: ref.signature,
    addedIn: ref.addedIn,
    addedInEvidence: ref.addedIn ? `Jetpack reference header: "Added in ${ref.addedIn}"` : null,
    deprecated: ref.classDeprecated,
    experimentalAnnotations: ref.experimental,
    featureFlag: row.featureFlag,
    readPermissions,
    writePermissions,
    permissionEvidence: row.permissionEvidence,
    // Each permission string checked against the two permission references.
    permissionCheck: row.permissions.map((p) => ({
      permission: p,
      inFrameworkReference: fwByValue.has(p),
      frameworkAdded: fwByValue.get(p)?.added ?? null,
      inJetpackConstants: jpByValue.has(p),
    })),
    sharedRowWith: row.sharedRow,
    properties: ref.properties,
    constructors: ref.constructors,
    aggregateMetrics: ref.aggregateMetrics,
    constants: ref.constants,
    nestedTypes: ref.nestedTypes,
    otherCompanionProperties: ref.otherCompanion,
    guides: row.guides,
    sourceUrl,
    sourceUpdated: ref.updated,
  });
}

// ---------------------------------------------------------------------------
// Guards — refuse to publish a short or broken parse.
// ---------------------------------------------------------------------------

if (records.length < EXPECTED_MIN_RECORDS) problems.push(`only ${records.length} records parsed from the data-types table (expected >= ${EXPECTED_MIN_RECORDS})`);
const slugs = new Set(records.map((r) => r.slug));
if (slugs.size !== records.length) problems.push("duplicate slugs");
if (dt.categories.length !== 7) problems.push(`expected Google's 7 data type categories, parsed ${dt.categories.length}`);
for (const r of records) {
  if (!dt.categories.some((c) => c.name === r.category)) problems.push(`${r.className}: category "${r.category}" is not one of Google's categories`);
  if (!r.readPermissions.length || !r.writePermissions.length) problems.push(`${r.className}: missing a read or write permission in the table`);
  if (!r.recordShape) problems.push(`${r.className}: no record type (Interval/Instantaneous/Series) parsed`);
  if (!r.mandatoryFields.length) problems.push(`${r.className}: no mandatory fields parsed`);
}
if (fw.permissions.length < EXPECTED_MIN_FW_PERMISSIONS) problems.push(`only ${fw.permissions.length} framework permission constants parsed (expected >= ${EXPECTED_MIN_FW_PERMISSIONS})`);
if (!dt.additional.length) problems.push("no additional read permissions parsed from the data-types page");
const aggCount = records.reduce((n, r) => n + r.aggregateMetrics.length, 0);
if (aggCount < EXPECTED_MIN_AGGREGATES) problems.push(`only ${aggCount} aggregate metrics parsed (expected >= ${EXPECTED_MIN_AGGREGATES})`);
const noAggType = records.flatMap((r) => r.aggregateMetrics.filter((a) => !a.valueTypeQualified).map((a) => `${r.className}.${a.name}`));
if (noAggType.length) problems.push(`${noAggType.length} aggregate metrics whose value type link could not be read: ${noAggType.slice(0, 5)}`);
const noAggDesc = records.flatMap((r) => r.aggregateMetrics.filter((a) => !a.description).map((a) => `${r.className}.${a.name}`));
if (noAggDesc.length > 5) problems.push(`${noAggDesc.length} aggregate metrics with no description: ${noAggDesc.slice(0, 5)}`);
const noPropDesc = records.flatMap((r) => r.properties.filter((p) => !p.description).map((p) => `${r.className}.${p.name}`));
if (noPropDesc.length > 40) problems.push(`${noPropDesc.length} properties with no description — more than expected; check Google's markup`);

if (problems.length) {
  console.error("REFUSING TO WRITE — Google's page shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

// The data date is the date the data-types page was fetched (from the cache
// metadata), so an --offline reparse does not claim a fresh read.
const fetchedOn = meta["data-types.html"]?.fetchedOn ?? new Date().toISOString().slice(0, 10);

const unresolvedPermissions = records.flatMap((r) =>
  r.permissionCheck.filter((c) => !c.inFrameworkReference && !c.inJetpackConstants).map((c) => ({ className: r.className, permission: c.permission })),
);

const body = `/**
 * Every Health Connect record class on Google's data-types page, joined with
 * each class's Jetpack reference page.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-health-connect-records.mjs
 *
 * Sources:
 *   ${DATA_TYPES_URL} (Last updated ${dt.updated})
 *   ${RECORD_REF}/<Class>
 *   ${FW_PERMISSIONS_URL} (Last updated ${fw.updated})
 *   ${JETPACK_PERMISSION_URL}
 * Fetched: ${fetchedOn}
 *
 * Copied verbatim: descriptions, property/constant/metric descriptions,
 * types, signatures, permission strings, categories, record shapes, units,
 * mandatory fields, "Added in" and "Last updated".
 *
 * Derived, with the text kept beside it:
 *   readPermissions / writePermissions — split by the literal READ_/WRITE_
 *     prefix; the table cell is in permissionEvidence.
 *   property range — copied from an @IntRange/@FloatRange annotation in
 *     Google's signature (the annotation itself is kept); null when the
 *     signature carries none. Null does not mean unvalidated.
 *   permissionCheck — whether each string the data-types table prints is
 *     defined by the framework HealthPermissions reference or a Jetpack
 *     HealthPermission constant. A false/false pair is a disagreement between
 *     Google's own pages, published as such, never corrected by us.
 */

export type HcRange = { annotation: string; from: string | null; to: string | null };

export type HcProperty = {
  name: string;
  /** Kotlin type as Google prints it, annotations removed. */
  type: string;
  /** From an @IntRange/@FloatRange annotation; null when none is printed. */
  range: HcRange | null;
  /** The sentence of Google's description that states a range, verbatim
   *  ("Valid range: 1-1000000."). Null when the description states none. */
  rangeStatement: string | null;
  /** Google's description, verbatim. Null where Google gives none. */
  description: string | null;
  inConstructor: boolean;
  /** Default value in Google's constructor signature, verbatim. */
  constructorDefault: string | null;
  addedIn: string | null;
  deprecated: boolean;
};

export type HcAggregateMetric = {
  /** Companion constant name, e.g. "COUNT_TOTAL". */
  name: string;
  /** T in Google's AggregateMetric<T> signature, e.g. "Long", "Energy". */
  valueType: string;
  /** T fully qualified, from the link on T in Google's signature, e.g.
   *  "androidx.health.connect.client.units.Energy", "java.time.Duration",
   *  "kotlin.Long". Null when Google's signature does not link T. */
  valueTypeQualified: string | null;
  description: string | null;
};

export type HcConstant = {
  name: string;
  value: string | null;
  type: string | null;
  description: string | null;
};

export type HcPermissionCheck = {
  permission: string;
  inFrameworkReference: boolean;
  /** The framework reference's availability line, e.g. "Added in API level 34 Also in U Extensions 7". */
  frameworkAdded: string | null;
  inJetpackConstants: boolean;
};

export type HcRecord = {
  className: string;
  /** kebab-case of the full class name: StepsRecord → "steps-record". */
  slug: string;
  qualifiedName: string;
  /** The data type's name in Google's table, e.g. "Steps". */
  dataTypeLabel: string;
  /** One of Google's seven categories, as Google names it. */
  category: string | null;
  /** "Interval" | "Instantaneous" | "Series", per Google's table. */
  recordShape: string | null;
  /** Unit class Google's table names (androidx…units.<Unit>); null when none. */
  unitClass: string | null;
  mandatoryFields: string[];
  /** Google's description paragraphs, verbatim. */
  description: string[];
  /** A code sample Google embeds in the class description, verbatim. */
  googleExample: string | null;
  signature: string | null;
  addedIn: string | null;
  addedInEvidence: string | null;
  deprecated: boolean;
  experimentalAnnotations: string[];
  featureFlag: string | null;
  readPermissions: string[];
  writePermissions: string[];
  permissionEvidence: string;
  permissionCheck: HcPermissionCheck[];
  /** Other classes Google lists in the same table row (Steps + StepsCadence). */
  sharedRowWith: string[];
  properties: HcProperty[];
  constructors: string[];
  aggregateMetrics: HcAggregateMetric[];
  constants: HcConstant[];
  nestedTypes: { name: string; kind: string | null; description: string | null }[];
  otherCompanionProperties: { name: string | null; signature: string | null; description: string | null }[];
  guides: { title: string; url: string }[];
  sourceUrl: string;
  /** The reference page's "Last updated" date. */
  sourceUpdated: string | null;
};

export type HcFrameworkPermission = {
  /** Constant on android.health.connect.HealthPermissions. */
  constant: string;
  /** The manifest string, e.g. "android.permission.health.READ_STEPS". */
  value: string;
  description: string | null;
  protectionLevel: string | null;
  /** Availability line as Google prints it. */
  added: string | null;
};

/** The date the generator fetched Google's data-types page. */
export const HC_FETCHED_ON = ${JSON.stringify(fetchedOn)};
/** "Last updated" on Google's data-types page at that fetch. */
export const HC_DATA_TYPES_UPDATED = ${JSON.stringify(dt.updated)};
export const HC_DATA_TYPES_URL = ${JSON.stringify(DATA_TYPES_URL)};
export const HC_FW_PERMISSIONS_URL = ${JSON.stringify(FW_PERMISSIONS_URL)};
export const HC_FW_PERMISSIONS_UPDATED = ${JSON.stringify(fw.updated)};
export const HC_JETPACK_PERMISSION_URL = ${JSON.stringify(JETPACK_PERMISSION_URL)};
/** The SDK-version note above Google's table, verbatim. */
export const HC_SDK_NOTE = ${JSON.stringify(dt.sdkNote)};

/** Google's seven data type categories, in Google's order and words. */
export const HC_CATEGORIES: { name: string; description: string }[] = ${JSON.stringify(dt.categories, null, 2)};

/** The extra read permissions Google's data-types page lists separately. */
export const HC_ADDITIONAL_READ_PERMISSIONS: { permission: string; label: string }[] = ${JSON.stringify(dt.additional, null, 2)};

export const HC_RECORDS: HcRecord[] = ${JSON.stringify(records, null, 2)};

/** Every constant on the framework HealthPermissions reference. */
export const HC_FRAMEWORK_PERMISSIONS: HcFrameworkPermission[] = ${JSON.stringify(fw.permissions, null, 2)};

/** The Jetpack HealthPermission class's string constants. \`value\` is set
 *  only where Google's description states the string; the Jetpack page
 *  otherwise prints the constant without its value. */
export const HC_JETPACK_PERMISSION_CONSTANTS: { constant: string | null; value: string | null; annotations: string[]; description: string | null }[] = ${JSON.stringify(jetpackConstants, null, 2)};

/** Strings Google's data-types table prints that neither permission
 *  reference defines — a disagreement between Google's own pages. */
export const HC_UNRESOLVED_PERMISSIONS: { className: string; permission: string }[] = ${JSON.stringify(unresolvedPermissions, null, 2)};
`;

writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${records.length} records, ${aggCount} aggregate metrics, ${fw.permissions.length} framework permissions, ${jetpackConstants.length} Jetpack permission constants`);
for (const c of dt.categories) console.log(`  ${c.name}: ${records.filter((r) => r.category === c.name).length}`);
console.log(`  constants (enum values): ${records.reduce((n, r) => n + r.constants.length, 0)}`);
console.log(`  properties: ${records.reduce((n, r) => n + r.properties.length, 0)} (${records.reduce((n, r) => n + r.properties.filter((p) => p.range).length, 0)} with a range annotation)`);
if (unresolvedPermissions.length) console.log(`  permission strings no reference defines: ${unresolvedPermissions.map((u) => `${u.className}:${u.permission}`).join(", ")}`);
if (noPropDesc.length) console.log(`  properties Google gives no description: ${noPropDesc.length}`);
