#!/usr/bin/env node
/**
 * Open-dataset generator — builds public/datasets/*.json and *.csv from the
 * site's own TypeScript data modules, so a published dataset can never drift
 * from the pages that carry the sourced claims.
 *
 * Usage:
 *   node scripts/build-datasets.mjs        # rewrite every generated dataset
 *
 * Plain .mjs cannot import the TS modules, so it reads them as text and parses
 * them with a small string-aware scanner (same constraint scripts/qa.mjs and
 * scripts/indexnow.mjs work under). That parsing is the risk, so every dataset
 * declares how many rows the module should yield and the script exits non-zero
 * on a short parse: a silently truncated dataset is worse than none.
 *
 * Invariants:
 *  - Idempotent. No timestamps, no generation date, no ordering by anything
 *    but the source module — re-running produces byte-identical files.
 *  - Nothing is invented. Every value is copied from a repo data module; a
 *    field that cannot be filled is null (JSON) / empty (CSV), never guessed.
 *  - Versioned, not overwritten in spirit: the version string is pinned to
 *    2026.1 and the next edition gets a new file name, so a citation to 2026.1
 *    keeps pointing at what 2026.1 said.
 *  - It does NOT touch the hand-published fitness-apis-2026.* files or
 *    motion-sdk-scorecard.csv — those predate this generator.
 *
 * CSV follows RFC 4180: every non-null cell is quoted, embedded quotes are
 * doubled, nulls are empty unquoted fields (matching fitness-apis-2026.csv).
 * The script re-parses its own CSV and fails if any row's field count or value
 * disagrees with the JSON it was written from.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "datasets");

// Canonical site URL. Keep in sync with src/lib/site.ts `url` — plain .mjs
// can't import the TS config (same note as scripts/indexnow.mjs).
const SITE_URL = "https://aifitnessapi.com";

const VERSION = "2026.1";
const PUBLISHER = "AIFitnessAPI (aifitnessapi.com)";
const LICENSE = "CC BY 4.0";

const abs = (p) => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;

function fail(msg) {
  console.error(`\n✗ build-datasets: ${msg}\n`);
  process.exit(1);
}

const read = (rel) => {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fail(`missing source module ${rel}`);
  return fs.readFileSync(p, "utf8");
};

/* ─────────────────────────── TypeScript-as-text parsing ─────────────────── */

/**
 * Index of the bracket that closes the one at `open`, skipping brackets that
 * live inside string literals. Handles ", ' and ` so an apostrophe in prose
 * ("don't") or a URL can't derail the scan.
 */
function matchBracket(src, open) {
  const closeOf = { "[": "]", "{": "}" };
  const openCh = src[open];
  const closeCh = closeOf[openCh];
  if (!closeCh) fail(`matchBracket called on "${openCh}"`);
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === openCh) depth++;
    else if (c === closeCh) {
      depth--;
      if (depth === 0) return i;
    }
  }
  fail("unbalanced brackets while parsing a data module");
  return -1;
}

/** The `[ … ]` literal assigned to `export const <name>`, brackets included. */
function arrayLiteral(src, name) {
  const re = new RegExp(`export const ${name}\\b[^=]*=\\s*\\[`);
  const m = re.exec(src);
  if (!m) fail(`could not find "export const ${name}" as an array literal`);
  const open = m.index + m[0].length - 1;
  return src.slice(open, matchBracket(src, open) + 1);
}

/** The `{ … }` literal that follows `<key>:` inside an object literal. */
function objectAfterKey(objSrc, key) {
  const at = objSrc.search(new RegExp(`(?:^|[\\s{,])${key}:\\s*\\{`));
  if (at < 0) return null;
  const open = objSrc.indexOf("{", at + 1);
  return objSrc.slice(open, matchBracket(objSrc, open) + 1);
}

/** The `[ … ]` literal that follows `<key>:` inside an object literal. */
function arrayAfterKey(objSrc, key) {
  const at = objSrc.search(new RegExp(`(?:^|[\\s{,])${key}:\\s*\\[`));
  if (at < 0) return null;
  const open = objSrc.indexOf("[", at + 1);
  return objSrc.slice(open, matchBracket(objSrc, open) + 1);
}

/** Top-level `{ … }` members of an array literal, in source order. */
function objectsIn(arrayText) {
  const out = [];
  let i = 1; // skip the opening "["
  while (i < arrayText.length) {
    if (arrayText[i] === "{") {
      const end = matchBracket(arrayText, i);
      out.push(arrayText.slice(i, end + 1));
      i = end + 1;
    } else i++;
  }
  return out;
}

/**
 * A double-quoted string property. Values in these modules routinely wrap onto
 * the following line, so the match is whitespace-tolerant. Returns null when
 * the key is absent (optional fields such as `watchOut`).
 */
function strProp(objSrc, key, { required = true, where = "" } = {}) {
  const re = new RegExp(`(?:^|[\\s{,])${key}:\\s*("(?:[^"\\\\]|\\\\.)*")`);
  const m = re.exec(objSrc);
  if (!m) {
    if (required) fail(`missing required field "${key}"${where ? ` in ${where}` : ""}`);
    return null;
  }
  try {
    return JSON.parse(m[1]);
  } catch {
    fail(`could not decode the string literal for "${key}"${where ? ` in ${where}` : ""}`);
    return null;
  }
}

/** Count of a declared row marker in a module — the cross-check for a parse. */
const countOf = (src, re) => (src.match(re) ?? []).length;

/* ──────────────────────────────── CSV ───────────────────────────────────── */

function csvCell(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(columns, rows) {
  const lines = [columns.join(",")];
  for (const row of rows) lines.push(columns.map((c) => csvCell(row[c])).join(","));
  return lines.join("\n");
}

/** RFC 4180 reader, used only to verify what we just wrote. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  let i = 0;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      quoted = true;
      i++;
      continue;
    }
    if (c === ",") {
      pushField();
      i++;
      continue;
    }
    if (c === "\n") {
      pushField();
      pushRow();
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    field += c;
    i++;
  }
  pushField();
  pushRow();
  return rows;
}

/* ─────────────────────────────── datasets ───────────────────────────────── */

/**
 * a. HealthKit ↔ Health Connect identifier matrix — src/data/matrix.ts.
 * The module carries id, label, href (our per-metric guide), apple, android
 * and an optional watchOut; nothing else is invented here.
 */
function buildMatrixDataset() {
  const rel = "src/data/matrix.ts";
  const src = read(rel);
  const declared = countOf(src, /\bid: "[a-z0-9-]+"/g); // same marker scripts/qa.mjs counts
  const objs = objectsIn(arrayLiteral(src, "ROWS"));

  const items = objs.map((o) => {
    const id = strProp(o, "id", { where: `${rel} ROWS` });
    return {
      id,
      label: strProp(o, "label", { where: `${rel} ${id}` }),
      appleHealthKit: strProp(o, "apple", { where: `${rel} ${id}` }),
      androidHealthConnect: strProp(o, "android", { where: `${rel} ${id}` }),
      watchOut: strProp(o, "watchOut", { required: false }),
      source: abs(strProp(o, "href", { where: `${rel} ${id}` })),
    };
  });

  if (items.length !== declared) {
    fail(
      `matrix parse yielded ${items.length} rows but ${rel} declares ${declared} — refusing to write a truncated dataset`,
    );
  }
  for (const it of items) {
    if (!it.appleHealthKit || !it.androidHealthConnect) {
      fail(`matrix row "${it.id}" is missing a platform identifier — every row needs both`);
    }
  }

  return {
    slug: "health-data-type-matrix-2026",
    declared,
    columns: ["id", "label", "appleHealthKit", "androidHealthConnect", "watchOut", "source"],
    doc: {
      name: "Health Data Type Matrix 2026 (HealthKit ↔ Health Connect)",
      version: VERSION,
      publisher: PUBLISHER,
      license: LICENSE,
      methodology:
        "One row per common health metric, pairing Apple's HealthKit type identifier with Android Health Connect's record type. Every identifier was confirmed against Apple's and Google's own developer documentation (HKQuantityTypeIdentifier, HKCategoryTypeIdentifier, and the Health Connect data-types guide) before publication; the full source list and the platform-level notes are on https://aifitnessapi.com/matrix. Scope is deliberately narrow — only the two on-device platform stores, because those are the cells we could verify. watchOut is null where the module records no cross-platform gotcha; it is never a guess.",
      generatedFrom: "src/data/matrix.ts (generated by scripts/build-datasets.mjs)",
      fields: {
        id: "Stable metric slug used across aifitnessapi.com",
        label: "Human-readable metric name",
        appleHealthKit: "Apple HealthKit type identifier(s) for this metric",
        androidHealthConnect: "Android Health Connect record type(s) for this metric",
        watchOut: "The cross-platform gotcha, where one exists (null = none recorded)",
        source: "aifitnessapi.com page carrying the verified claims for this metric",
      },
      stats: {
        totalItems: items.length,
        platforms: ["Apple HealthKit", "Android Health Connect"],
        rowsWithBothIdentifiers: items.filter((i) => i.appleHealthKit && i.androidHealthConnect).length,
        rowsWithWatchOut: items.filter((i) => i.watchOut).length,
        rowsWithMultipleAppleIdentifiers: items.filter((i) => i.appleHealthKit.includes(", ")).length,
        rowsWithMultipleHealthConnectIdentifiers: items.filter((i) =>
          i.androidHealthConnect.includes(", "),
        ).length,
      },
      items,
    },
  };
}

/**
 * b. The dated ecosystem record — src/data/changes.ts (CHANGE_EVENTS).
 * WATCH_ITEMS is deliberately excluded: those entries carry no date and no
 * status in the module, and inventing either would break the grading this
 * dataset exists to publish.
 */
function buildChangesDataset() {
  const rel = "src/data/changes.ts";
  const src = read(rel);
  const arr = arrayLiteral(src, "CHANGE_EVENTS");
  const declared = countOf(arr, /\bsortDate:\s*"/g);
  const objs = objectsIn(arr);

  const items = objs.map((o) => {
    const title = strProp(o, "title", { where: `${rel} CHANGE_EVENTS` });
    const pageSrc = objectAfterKey(o, "page");
    if (!pageSrc) fail(`change event "${title}" has no page reference`);
    const href = strProp(pageSrc, "href", { where: `${rel} ${title}` });
    return {
      date: strProp(o, "date", { where: `${rel} ${title}` }),
      sortDate: strProp(o, "sortDate", { where: `${rel} ${title}` }),
      title,
      summary: strProp(o, "summary", { where: `${rel} ${title}` }),
      status: strProp(o, "status", { where: `${rel} ${title}` }),
      source: abs(href),
      sourceLabel: strProp(pageSrc, "label", { where: `${rel} ${title}` }),
      verifiedOn: strProp(o, "verifiedOn", { where: `${rel} ${title}` }),
    };
  });

  if (items.length !== declared) {
    fail(
      `changes parse yielded ${items.length} rows but CHANGE_EVENTS declares ${declared} — refusing to write a truncated dataset`,
    );
  }
  const allowed = new Set(["confirmed", "reported", "watch"]);
  for (const it of items) {
    if (!allowed.has(it.status)) fail(`change event "${it.title}" has unknown status "${it.status}"`);
  }

  // Newest first, mirroring changesSorted() in the module.
  items.sort((a, b) => (a.sortDate < b.sortDate ? 1 : a.sortDate > b.sortDate ? -1 : 0));

  const byStatus = {};
  for (const it of items) byStatus[it.status] = (byStatus[it.status] ?? 0) + 1;
  const sortDates = items.map((i) => i.sortDate).sort();

  return {
    slug: "fitness-api-changes-2026",
    declared,
    columns: ["date", "sortDate", "title", "summary", "status", "source", "sourceLabel", "verifiedOn"],
    doc: {
      name: "Fitness API Changes & Deadlines 2026",
      version: VERSION,
      publisher: PUBLISHER,
      license: LICENSE,
      methodology:
        "One row per dated ecosystem event tracked on https://aifitnessapi.com/changes — deprecations, deadlines, term changes, model freezes. The status field is the point of the dataset: confirmed means a vendor's own words are quoted on the linked page; reported means vendor or community notices we could not confirm on an official page; watch means an undated live risk. Date precision is kept exactly as sourced (\"2026-09\" means a reported month) and is never sharpened. Every row links the page on this site that carries the sourced claim, and verifiedOn records when that page was last checked. The undated watch items published on /changes are excluded here because they carry no date to publish.",
      generatedFrom: "src/data/changes.ts CHANGE_EVENTS (generated by scripts/build-datasets.mjs)",
      fields: {
        date: "Event date at the precision the source supports (YYYY, YYYY-MM or YYYY-MM-DD)",
        sortDate: "Full ISO date used only for ordering when `date` is fuzzy",
        title: "Short name of the event",
        summary: "What changed, in the words the linked page can support",
        status: "confirmed | reported | watch — the evidence grade, see methodology",
        source: "aifitnessapi.com page carrying the sourced claim",
        sourceLabel: "Title of that page",
        verifiedOn: "Date this entry was last checked against its source page",
      },
      stats: {
        totalItems: items.length,
        byStatus,
        confirmed: byStatus.confirmed ?? 0,
        reported: byStatus.reported ?? 0,
        watch: byStatus.watch ?? 0,
        earliestSortDate: sortDates[0] ?? null,
        latestSortDate: sortDates[sortDates.length - 1] ?? null,
      },
      items,
    },
  };
}

/**
 * c. The glossary vocabulary — src/data/glossary.ts.
 * The anchor is computed with the same slug rule as termId() in that module,
 * so a citation to a term's #term-… fragment resolves on /glossary.
 */
function buildGlossaryDataset() {
  const rel = "src/data/glossary.ts";
  const src = read(rel);

  // Mirror of termId()'s slug rule in src/data/glossary.ts. Kept identical on
  // purpose: the fragment is a published, citable id.
  const termSlug = (term) =>
    term
      .toLowerCase()
      .replace(/\(.*?\)/g, " ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const glossaryPath = (() => {
    const m = /export const GLOSSARY_PATH\s*=\s*("(?:[^"\\]|\\.)*")/.exec(src);
    if (!m) fail(`could not read GLOSSARY_PATH from ${rel}`);
    return JSON.parse(m[1]);
  })();

  const declaredTerms = countOf(src, /\{\s*term:\s*"/g);
  const groups = objectsIn(arrayLiteral(src, "GROUPS"));
  const declaredGroups = countOf(src, /^\s{4}title:\s*"/gm);

  const items = [];
  for (const g of groups) {
    const group = strProp(g, "title", { where: `${rel} GROUPS` });
    const termsArr = arrayAfterKey(g, "terms");
    if (!termsArr) fail(`glossary group "${group}" has no terms array`);
    for (const t of objectsIn(termsArr)) {
      const term = strProp(t, "term", { where: `${rel} ${group}` });
      const slug = termSlug(term);
      if (!slug) fail(`glossary term "${term}" produced an empty anchor slug`);
      items.push({
        term,
        definition: strProp(t, "def", { where: `${rel} ${term}` }),
        group,
        href: abs(strProp(t, "href", { where: `${rel} ${term}` })),
        anchor: `#term-${slug}`,
        id: `${abs(glossaryPath)}#term-${slug}`,
      });
    }
  }

  if (items.length !== declaredTerms) {
    fail(
      `glossary parse yielded ${items.length} terms but ${rel} declares ${declaredTerms} — refusing to write a truncated dataset`,
    );
  }
  if (groups.length !== declaredGroups) {
    fail(`glossary parse yielded ${groups.length} groups but ${rel} declares ${declaredGroups}`);
  }
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.id)) fail(`glossary anchor collision on ${it.id}`);
    seen.add(it.id);
  }

  const byGroup = {};
  for (const it of items) byGroup[it.group] = (byGroup[it.group] ?? 0) + 1;

  return {
    slug: "fitness-api-glossary-2026",
    declared: declaredTerms,
    columns: ["term", "definition", "group", "href", "anchor", "id"],
    doc: {
      name: "Fitness & Health API Glossary 2026",
      version: VERSION,
      publisher: PUBLISHER,
      license: LICENSE,
      methodology:
        "The controlled vocabulary behind https://aifitnessapi.com/glossary, published as data. Each term has exactly one canonical explanation on this site — the href column — and one stable fragment id, so a machine reader can cite the definition it used rather than the top of a long page. The definitions are the site's own editorial definitions written against the vendor documentation cited on the linked pages, not quotations from a standards body. Groups are our sections, not an industry taxonomy.",
      generatedFrom: "src/data/glossary.ts (generated by scripts/build-datasets.mjs)",
      fields: {
        term: "The term as it appears in the glossary",
        definition: "The site's definition of the term",
        group: "Glossary section the term belongs to",
        href: "The canonical aifitnessapi.com page explaining this term",
        anchor: "Stable fragment on /glossary, computed by termId() in the source module",
        id: "Absolute, citable URL of the term entry (the JSON-LD DefinedTerm @id)",
      },
      stats: {
        totalItems: items.length,
        totalGroups: groups.length,
        byGroup,
      },
      items,
    },
  };
}

/* ──────────────────────────────── write ─────────────────────────────────── */

function writeDataset(ds) {
  const { slug, doc, columns } = ds;
  const jsonPath = path.join(OUT_DIR, `${slug}.json`);
  const csvPath = path.join(OUT_DIR, `${slug}.csv`);

  const json = JSON.stringify(doc, null, 2);
  const csv = toCsv(columns, doc.items);

  // Verify the CSV against the JSON it came from before either lands on disk.
  const parsed = parseCsv(csv);
  if (parsed.length !== doc.items.length + 1) {
    fail(`${slug}.csv re-parsed to ${parsed.length} lines, expected ${doc.items.length + 1}`);
  }
  const header = parsed[0];
  if (header.join(",") !== columns.join(",")) fail(`${slug}.csv header does not match the column list`);
  for (let r = 0; r < doc.items.length; r++) {
    const rowFields = parsed[r + 1];
    if (rowFields.length !== header.length) {
      fail(
        `${slug}.csv row ${r + 1} has ${rowFields.length} fields, header has ${header.length} — quoting bug`,
      );
    }
    for (let c = 0; c < columns.length; c++) {
      const want = doc.items[r][columns[c]];
      const got = rowFields[c];
      const expected = want === null || want === undefined ? "" : String(want);
      if (got !== expected) fail(`${slug}.csv row ${r + 1} column "${columns[c]}" did not round-trip`);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const before = {
    json: fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, "utf8") : null,
    csv: fs.existsSync(csvPath) ? fs.readFileSync(csvPath, "utf8") : null,
  };
  // Only write when the bytes actually differ — the working tree is shared,
  // and a no-op run should leave mtimes alone.
  if (before.json !== json) fs.writeFileSync(jsonPath, json);
  if (before.csv !== csv) fs.writeFileSync(csvPath, csv);

  const changed = before.json !== json || before.csv !== csv;
  console.log(
    `${slug}: ${doc.items.length} rows (module declares ${ds.declared}), ` +
      `${columns.length} columns → ${slug}.json + ${slug}.csv${changed ? "" : " (unchanged)"}`,
  );
  return { slug, rows: doc.items.length };
}

const built = [buildMatrixDataset(), buildChangesDataset(), buildGlossaryDataset()].map(writeDataset);

console.log(
  `\n✓ ${built.length} datasets written to public/datasets/ ` +
    `(${built.reduce((n, b) => n + b.rows, 0)} rows total, version ${VERSION}, ${LICENSE}).`,
);
