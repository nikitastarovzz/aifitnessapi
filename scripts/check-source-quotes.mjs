#!/usr/bin/env node
/**
 * Check that every quoted source passage behind a page still appears in its
 * source. ops/EXPANSION-3-2026-10-17.md item 4.8.
 *
 *   node scripts/check-source-quotes.mjs [ops/sources/evidence/*.json ...]
 *
 * Pages written from hosts the dev environment cannot reach (vendor pricing,
 * regulator guidance) carry an evidence file in ops/sources/evidence/: one
 * JSON array per page of { claim, url, quote }. `quote` is a verbatim passage
 * from `url`; `claim` is the sentence on our page it supports. This script
 * fetches each URL once, reduces it to text the same way
 * scripts/source-snapshot.mjs does, normalises whitespace, quote marks and
 * case, and fails when a quote is not found — so a claim cannot ship on a
 * passage its source does not contain, and a source that changes after
 * publication shows up on the next run.
 *
 * It runs on a GitHub runner (.github/workflows/source-quotes.yml) because the
 * hosts are blocked where pages are written. It checks presence, not meaning:
 * whether the claim says what the quote says is still a reviewer's job, which
 * is why both sit side by side in the file.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = "ops/sources/evidence";
const args = process.argv.slice(2).filter((a) => a.endsWith(".json"));
const files = args.length
  ? args
  : existsSync(DIR)
    ? readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => join(DIR, f))
    : [];
if (!files.length) {
  console.log("check-source-quotes: no evidence files");
  process.exit(0);
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const toText = (html) =>
  decode(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );

const norm = (s) =>
  s
    .normalize("NFKC")
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/ /g, " ")
    // Table pipes and heading marks exist only in the snapshot's text
    // rendering, never in the page, so a quote copied from a snapshot keeps
    // matching.
    .replace(/\|/g, " ")
    .replace(/(^|\s)#{1,6}(?=\s)/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const UA = "aifitnessapi-source-quotes/1.0 (+https://aifitnessapi.com/methodology)";
const cache = new Map();
async function textOf(url) {
  if (cache.has(url)) return cache.get(url);
  let out;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/json,text/plain;q=0.9,*/*;q=0.5" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    const body = await res.text();
    const type = res.headers.get("content-type") ?? "";
    out = { ok: res.ok, status: res.status, text: norm(/html/i.test(type) ? toText(body) : body) };
  } catch (e) {
    out = { ok: false, status: 0, text: "", error: [e?.name, e?.message, e?.cause?.code].filter(Boolean).join(": ") };
  }
  cache.set(url, out);
  return out;
}

let checked = 0;
const problems = [];
for (const file of files) {
  let rows;
  try {
    rows = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    problems.push(`${file}: not valid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(rows) || !rows.length) {
    problems.push(`${file}: expected a non-empty array of { claim, url, quote }`);
    continue;
  }
  for (const [i, r] of rows.entries()) {
    const where = `${file}[${i}]`;
    if (!r || typeof r.claim !== "string" || typeof r.url !== "string" || typeof r.quote !== "string") {
      problems.push(`${where}: needs string claim, url and quote`);
      continue;
    }
    if (!/^https:\/\//.test(r.url)) {
      problems.push(`${where}: url must be https`);
      continue;
    }
    if (norm(r.quote).length < 12) {
      problems.push(`${where}: quote too short to be evidence (${JSON.stringify(r.quote)})`);
      continue;
    }
    const page = await textOf(r.url);
    checked++;
    if (!page.ok) {
      problems.push(`${where}: ${r.url} answered ${page.status}${page.error ? ` (${page.error})` : ""}`);
    } else if (!page.text.includes(norm(r.quote))) {
      problems.push(`${where}: quote not found at ${r.url}: ${JSON.stringify(r.quote.slice(0, 160))}`);
    }
  }
}

console.log(`check-source-quotes: ${checked} quotes checked across ${files.length} files, ${cache.size} URLs fetched`);
if (problems.length) {
  console.log(problems.map((p) => `  ✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("✓ every quote was found in its source");
