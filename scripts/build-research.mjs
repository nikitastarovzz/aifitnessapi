#!/usr/bin/env node
/**
 * Generator for src/data/researchStudies.ts, the rows behind the three
 * /research studies (ops/VIRAL-20-2026-11-06.md items 1-3). Then run
 * `npm run datasets`, which publishes each study as an open dataset.
 *
 * Usage:
 *   node scripts/build-research.mjs
 *
 * 1. Docs drift. Reads this repository's git history of
 *    ops/sources/evidence/*.json, commit by commit, oldest first, and follows
 *    every evidence row (file, claim, url, quote) from the commit that wrote
 *    it to the commit that replaced or removed it. Why a row ended comes only
 *    from ops/research/docs-drift-annotations.json, whose every statement must
 *    be in that commit's message; a commit whose message records source drift
 *    without an annotation fails the run. Needs the full history: it refuses
 *    a shallow clone (run `git fetch --unshallow origin`). It reads commits up
 *    to HEAD, so uncommitted evidence is not counted until a later run.
 * 2. Shutdown notice. src/data/graveyard.ts and src/data/changes.ts, with the
 *    announcement dates in ops/research/shutdown-announcements.json, each
 *    quoted in ops/sources/evidence/research-shutdown-notice.json.
 * 3. Pricing transparency. ops/research/pricing-transparency.json, every line
 *    of which must be a substring of a quote in the evidence file it names.
 *
 * Rules (CLAUDE.md, "Generated data"): idempotent for a given HEAD; nothing
 * invented (a value the inputs do not give is null); every study declares the
 * rows it expects and the run exits non-zero on a short parse.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { daysBetween } from "../src/lib/researchStats.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "data", "researchStudies.ts");
const EVIDENCE = "ops/sources/evidence";

function fail(msg) {
  console.error(`\n✗ build-research: ${msg}\n`);
  process.exit(1);
}

const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const squash = (s) => s.replace(/\s+/g, " ").trim();

/* ───────────────────────────── 1. Docs drift ───────────────────────────── */

/** host, or host/owner for the code hosts where one host serves many vendors. */
export function sourceKey(url) {
  const u = new URL(url);
  return /^(raw\.githubusercontent\.com|github\.com)$/.test(u.host) ? `${u.host}/${u.pathname.split("/")[1]}` : u.host;
}

const DRIFT_MESSAGE = /source drift|drifted source quotes/i;

function buildDrift() {
  if (git("rev-parse", "--is-shallow-repository").trim() !== "false") {
    fail("this is a shallow clone; run `git fetch --unshallow origin` first");
  }
  const head = git("rev-parse", "--short=7", "HEAD").trim();
  const commits = git("log", "--reverse", "--format=%H%x09%cs", "--", EVIDENCE)
    .trim()
    .split("\n")
    .map((l) => {
      const [hash, date] = l.split("\t");
      return { hash, short: hash.slice(0, 7), date, message: git("log", "-1", "--format=%B", hash) };
    });
  if (commits.length < 20) fail(`docs drift: ${commits.length} commits touch ${EVIDENCE}, expected at least 20`);

  const { annotations } = readJson("ops/research/docs-drift-annotations.json");
  const byShort = new Map(commits.map((c) => [c.short, c]));
  for (const a of annotations) {
    const c = byShort.get(a.commit);
    if (!c) fail(`docs drift: annotation names ${a.commit}, which is not a commit touching ${EVIDENCE}`);
    for (const s of a.statements) if (!squash(c.message).includes(squash(s))) fail(`docs drift: "${s}" is not in the message of ${a.commit}`);
  }
  for (const c of commits) {
    if (DRIFT_MESSAGE.test(c.message) && !annotations.some((a) => a.commit === c.short && a.cause === "source-changed")) {
      fail(`docs drift: ${c.short} records source drift in its message but has no source-changed annotation`);
    }
  }
  const explain = (commit, source, endKind) =>
    annotations.find((a) => a.commit === commit && a.sources.includes(source) && (!a.endKinds || a.endKinds.includes(endKind))) ?? null;

  const rowsAt = (hash, file) => {
    let text;
    try {
      text = git("show", `${hash}:${file}`);
    } catch {
      return []; // deleted in this commit
    }
    const doc = JSON.parse(text);
    return (Array.isArray(doc) ? doc : []).filter((r) => r && typeof r.url === "string" && typeof r.quote === "string");
  };

  const live = new Map();
  const ended = [];
  const keyOf = (file, r) => `${file}\u0000${r.claim ?? ""}\u0000${r.url}\u0000${r.quote}`;
  for (const c of commits) {
    const files = git("diff-tree", "--no-commit-id", "--name-only", "-r", "--root", c.hash, "--", EVIDENCE)
      .trim()
      .split("\n")
      .filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const after = rowsAt(c.hash, file);
      const keys = new Set(after.map((r) => keyOf(file, r)));
      const byClaim = new Map(after.map((r) => [r.claim ?? "", r]));
      const urlQuote = new Set(after.map((r) => `${r.url}\u0000${r.quote}`));
      for (const [k, row] of [...live]) {
        if (row.file !== file || keys.has(k)) continue;
        const same = byClaim.get(row.claim);
        row.endKind = same
          ? same.url !== row.url && same.quote !== row.quote
            ? "url-and-quote"
            : same.url !== row.url
              ? "url"
              : "quote"
          : urlQuote.has(`${row.url}\u0000${row.quote}`)
            ? "claim-reworded"
            : "removed";
        row.endedOn = c.date;
        row.endedCommit = c.short;
        const a = explain(c.short, row.source, row.endKind);
        row.cause = a ? a.cause : "not-stated";
        row.kind = a ? a.kind : null;
        row.statement = a ? a.statements.join(" / ") : null;
        ended.push(row);
        live.delete(k);
      }
      for (const r of after) {
        const k = keyOf(file, r);
        if (!live.has(k)) {
          live.set(k, { file, claim: r.claim ?? "", url: r.url, quote: r.quote, source: sourceKey(r.url), writtenOn: c.date, writtenCommit: c.short });
        }
      }
    }
  }
  const all = [...ended, ...live.values()];

  // Group rows that share every published field.
  const groups = new Map();
  for (const r of all) {
    const g = {
      file: r.file.slice(EVIDENCE.length + 1),
      source: r.source,
      writtenOn: r.writtenOn,
      writtenCommit: r.writtenCommit,
      endedOn: r.endedOn ?? null,
      endedCommit: r.endedCommit ?? null,
      endKind: r.endKind ?? null,
      cause: r.cause ?? null,
      kind: r.kind ?? null,
      statement: r.statement ?? null,
    };
    const k = JSON.stringify(g);
    const have = groups.get(k);
    if (have) have.rows++;
    else groups.set(k, { ...g, rows: 1 });
  }
  const items = [...groups.values()].sort(
    (a, b) =>
      a.writtenOn.localeCompare(b.writtenOn) ||
      a.file.localeCompare(b.file) ||
      a.source.localeCompare(b.source) ||
      String(a.endedOn).localeCompare(String(b.endedOn)) ||
      String(a.endKind).localeCompare(String(b.endKind)) ||
      String(a.cause).localeCompare(String(b.cause)),
  );
  const total = items.reduce((n, g) => n + g.rows, 0);
  if (total !== all.length) fail(`docs drift: grouped ${total} rows, expected ${all.length}`);
  if (total < 5000) fail(`docs drift: ${total} evidence rows in the history, expected at least 5000`);

  const last = commits[commits.length - 1];
  return {
    items,
    meta: {
      historyFrom: commits[0].date,
      historyThrough: last.date,
      historyCommit: last.short,
      headAtGeneration: head,
      commitsRead: commits.length,
      rowsRead: all.length,
    },
  };
}

/* ─────────────────────────── 2. Shutdown notice ────────────────────────── */

const precision = (d) => (d === null ? null : /^\d{4}-\d{2}-\d{2}$/.test(d) ? "day" : /^\d{4}-\d{2}$/.test(d) ? "month" : /^\d{4}$/.test(d) ? "year" : fail(`shutdown notice: unreadable date ${d}`));

async function buildNotice() {
  const { GRAVEYARD } = await import(pathToFileURL(path.join(ROOT, "src/data/graveyard.ts")).href);
  const { CHANGE_EVENTS } = await import(pathToFileURL(path.join(ROOT, "src/data/changes.ts")).href);
  const input = readJson("ops/research/shutdown-announcements.json");
  const evidence = readJson(`${EVIDENCE}/research-shutdown-notice.json`);
  const byId = new Map(input.entries.map((e) => [e.id, e]));
  for (const e of input.entries) if (!GRAVEYARD.some((g) => g.id === e.id)) fail(`shutdown notice: ${e.id} is not a graveyard entry`);

  const items = GRAVEYARD.map((g) => {
    const inp = byId.get(g.id);
    if (!inp) fail(`shutdown notice: graveyard entry ${g.id} is missing from ops/research/shutdown-announcements.json`);
    if (inp.announced) {
      if (!evidence.some((r) => r.url === inp.url && r.quote === inp.quote)) fail(`shutdown notice: ${g.id}'s quote is not a row of research-shutdown-notice.json`);
      for (const m of g.milestones ?? []) {
        if (/announc/i.test(m.label) && m.date !== inp.announced) fail(`shutdown notice: ${g.id}'s graveyard milestone "${m.label}" is ${m.date}, the input says ${inp.announced}`);
      }
    }
    const endPrecision = precision(g.end);
    const announced = inp.announced ?? null;
    let exclusion = null;
    if (g.end === null) exclusion = "no end date";
    else if (endPrecision === "year") exclusion = "end date given only as a year";
    else if (!announced) exclusion = "no dated announcement on the pages read";
    else if (endPrecision !== "day") exclusion = "end date given only to the month";
    const noticeDays = exclusion ? null : daysBetween(announced, g.end);
    if (noticeDays !== null && noticeDays < 0) fail(`shutdown notice: ${g.id} was announced after its end`);
    const tracked = CHANGE_EVENTS.filter((c) => c.page.href === g.page?.href && c.date === g.end).map((c) => c.title);
    return {
      id: g.id,
      name: g.name,
      vendor: g.vendor,
      status: g.status,
      end: g.end,
      endPrecision,
      endLabel: g.endLabel,
      announced,
      noticeDays,
      exclusion,
      note: inp.note ?? null,
      how: inp.how ?? null,
      announcementUrl: inp.url ?? null,
      announcementQuote: inp.quote ?? null,
      endUrl: g.source.url,
      endQuote: g.source.quote,
      changesEntries: tracked.length ? tracked.join("; ") : null,
      page: `/graveyard#${g.id}`,
    };
  });
  if (items.length !== GRAVEYARD.length || items.length < 15) fail(`shutdown notice: ${items.length} rows, expected ${GRAVEYARD.length} (at least 15)`);
  return { items, meta: { readOn: input.readOn, graveyardEntries: GRAVEYARD.length, changesEntries: CHANGE_EVENTS.length } };
}

/* ───────────────────────── 3. Pricing transparency ─────────────────────── */

function buildPricing() {
  const input = readJson("ops/research/pricing-transparency.json");
  const pricingTs = fs.readFileSync(path.join(ROOT, "src/data/pricing.ts"), "utf8");
  const items = input.vendors.map((v) => {
    const slug = v.page.replace(/^\/pricing\//, "");
    if (!pricingTs.includes(`"${slug}"`)) fail(`pricing: ${v.vendor}'s page ${v.page} is not a released /pricing page`);
    const categoryLabel = input.categories[v.category] ?? fail(`pricing: unknown category ${v.category}`);
    if (v.excluded) {
      return { vendor: v.vendor, category: v.category, categoryLabel, class: null, classLabel: null, line: null, url: null, evidenceFile: null, freeEntry: null, unpricedTier: null, excluded: v.excluded, pricingPage: v.page };
    }
    const classLabel = input.classes[v.class] ?? fail(`pricing: unknown class ${v.class} for ${v.vendor}`);
    const rows = readJson(`${EVIDENCE}/${v.file}`);
    const find = (line, what) => {
      if (!line) return null;
      if (line.length < 12) fail(`pricing: ${v.vendor}'s ${what} is shorter than 12 characters`);
      const row = rows.find((r) => r.quote.includes(line));
      if (!row) fail(`pricing: ${v.vendor}'s ${what} "${line}" is not in a quote of ${v.file}`);
      return row;
    };
    const row = find(v.line, "line");
    find(v.freeEntry, "freeEntry");
    find(v.unpricedTier, "unpricedTier");
    return {
      vendor: v.vendor,
      category: v.category,
      categoryLabel,
      class: v.class,
      classLabel,
      line: v.line,
      url: row.url,
      evidenceFile: `${EVIDENCE}/${v.file}`,
      freeEntry: v.freeEntry ?? null,
      unpricedTier: v.unpricedTier ?? null,
      excluded: null,
      pricingPage: v.page,
    };
  });
  const declared = 32;
  if (items.length !== declared) fail(`pricing: ${items.length} vendors, expected ${declared}`);
  return { items, meta: { classes: input.classes, categories: input.categories } };
}

/* ─────────────────────────────── Write ─────────────────────────────────── */

const drift = buildDrift();
const notice = await buildNotice();
const pricing = buildPricing();

const arr = (name, type, rows) => `export const ${name}: ${type}[] = ${JSON.stringify(rows, null, 2)};\n`;
const str = (name, v) => `export const ${name} = ${JSON.stringify(v)};\n`;
const num = (name, v) => `export const ${name} = ${v};\n`;

const out = `/**
 * Rows behind the three /research studies (ops/VIRAL-20-2026-11-06.md items 1-3).
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/build-research.mjs
 * (then \`npm run datasets\`). Inputs: the git history of ops/sources/evidence,
 * ops/research/*.json, src/data/graveyard.ts, src/data/changes.ts and the
 * evidence files they name. The figures are computed from these rows by
 * src/lib/researchStats.mjs, on the pages and again in qa from the published
 * datasets.
 */
import type { DriftGroup, NoticeRow, PricingRow } from "@/lib/researchStats.mjs";

${str("DRIFT_HISTORY_FROM", drift.meta.historyFrom)}${str("DRIFT_HISTORY_THROUGH", drift.meta.historyThrough)}${str("DRIFT_HISTORY_COMMIT", drift.meta.historyCommit)}${num("DRIFT_COMMITS_READ", drift.meta.commitsRead)}${num("DRIFT_ROWS_READ", drift.meta.rowsRead)}
${arr("DRIFT_GROUPS", "DriftGroup", drift.items)}
${str("NOTICE_READ_ON", notice.meta.readOn)}${num("NOTICE_CHANGES_READ", notice.meta.changesEntries)}
${arr("NOTICE_ROWS", "NoticeRow", notice.items)}
${arr("PRICING_ROWS", "PricingRow", pricing.items)}`;

const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
if (prev !== out) fs.writeFileSync(OUT, out);
console.log(
  `✓ build-research: docs drift ${drift.meta.rowsRead} rows in ${drift.items.length} groups from ${drift.meta.commitsRead} commits (${drift.meta.historyFrom} to ${drift.meta.historyThrough}); ` +
    `shutdown notice ${notice.items.length} entries; pricing ${pricing.items.length} vendors${prev === out ? " (unchanged)" : ""}.`,
);
