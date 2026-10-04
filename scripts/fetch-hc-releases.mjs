#!/usr/bin/env node
/**
 * Regenerate src/data/hcReleases.ts — every androidx.health.connect:
 * connect-client release, read from Google's Jetpack release-notes page:
 *
 *   https://developer.android.com/jetpack/androidx/releases/health-connect
 *
 * That page interleaves two artifacts: connect-client (the Health Connect
 * Jetpack SDK) and connect-testing (its test fakes), each under its own
 * "Version 1.x" sections and with overlapping version numbers (both have a
 * 1.0.0-alpha02). A release counts as connect-client only when its own
 * paragraph names the coordinate `androidx.health.connect:connect-client:<v>`;
 * the section heading alone is not trusted.
 *
 * No model in this loop. Every field is copied from the page:
 *   version, date      — the h3 heading and the date line under it
 *   releaseSentence    — Google's "… is released" / "… promoted …" paragraph
 *   headings           — the bold section labels ("API Changes", "Bug Fixes")
 *   firstNote          — the first bullet, verbatim, as evidence of content
 * One field is derived:
 *   stage — alpha / beta / rc / stable, read from the version string's
 *           pre-release suffix (none means stable). The version string is
 *           stored beside it, so the derivation is checkable at a glance.
 *
 * Usage: node scripts/fetch-hc-releases.mjs [--offline]
 *   --offline reparses the cache in .cache/hc-releases without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const URL = "https://developer.android.com/jetpack/androidx/releases/health-connect";
const ARTIFACT = "androidx.health.connect:connect-client";
const CACHE = ".cache/hc-releases";
const OUT = "src/data/hcReleases.ts";
const OFFLINE = process.argv.includes("--offline");

mkdirSync(CACHE, { recursive: true });

async function getText(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  // Without an explicit language devsite may serve a machine-translated page,
  // whose dates this parser cannot read. Ask for English and refuse anything
  // else before it reaches the cache.
  const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}hl=en`);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const text = await res.text();
  if (/devsite-banner-translated/.test(text) || !/<html[^>]*\blang="en/.test(text)) {
    throw new Error(`non-English page served for ${url}`);
  }
  writeFileSync(path, text);
  return text;
}

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

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
/** "October 08, 2025" → "2025-10-08"; null if the text holds no such date. */
function isoDate(text) {
  const m = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/.exec(text);
  if (!m) return null;
  const mm = String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, "0");
  return { iso: `${m[3]}-${mm}-${m[2].padStart(2, "0")}`, text: m[0] };
}

function stageOf(version) {
  const m = /-(alpha|beta|rc)\d+$/.exec(version);
  return m ? m[1] : /^\d+\.\d+\.\d+$/.test(version) ? "stable" : null;
}

const html = await getText(URL, "health-connect.html");
const problems = [];

// Walk h2/h3 headings in document order. A release block is an h3 whose text
// is "Version x.y.z[-pre]" and runs to the next h2 or h3.
const heads = [...html.matchAll(/<h([23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
  level: Number(m[1]),
  id: m[2],
  text: textOf(m[3]),
  start: m.index,
  end: m.index + m[0].length,
}));

const releases = [];
const skipped = [];
let section = null;
for (let i = 0; i < heads.length; i++) {
  const h = heads[i];
  if (h.level === 2) {
    section = h.text;
    continue;
  }
  const vm = /^Version (\d+\.\d+\.\d+(?:-[a-z]+\d+)?)$/.exec(h.text);
  if (!vm) continue;
  const version = vm[1];
  // The last release on the page has no following heading; end its block at
  // the article's close rather than running into the footer and nav.
  const articleEnd = html.indexOf("</article>", h.end);
  if (articleEnd < 0) problems.push(`${version}: no </article> after its heading`);
  const block = html.slice(h.end, Math.min(heads[i + 1]?.start ?? Infinity, articleEnd < 0 ? html.length : articleEnd));
  const paras = [...block.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  const blockText = textOf(block);

  if (!blockText.includes(`${ARTIFACT}:${version}`)) {
    skipped.push(`${version} (${section})`);
    continue;
  }

  const date = isoDate(textOf(paras[0] ?? ""));
  if (!date) problems.push(`${version}: no date parsed from "${textOf(paras[0] ?? "").slice(0, 80)}"`);

  const releaseSentence =
    paras.map(textOf).find((t) => t.includes(`${ARTIFACT}:${version}`))?.replace(date ? date.text : "", "").trim() ?? null;
  // Bold-only paragraphs are Google's section labels.
  const headings = paras
    .filter((p) => /^\s*<strong>[\s\S]*<\/strong>\s*$/.test(p))
    .map(textOf)
    .filter(Boolean);
  const bullets = [...block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => textOf(m[1])).filter(Boolean);
  const stage = stageOf(version);
  if (!stage) problems.push(`${version}: version string has no recognised stage`);

  releases.push({
    version,
    date: date?.iso ?? null,
    dateText: date?.text ?? null,
    stage,
    series: version.split(".").slice(0, 2).join("."),
    section,
    releaseSentence,
    headings,
    firstNote: bullets[0] ?? null,
    noteCount: bullets.length,
    url: `${URL}#${h.id}`,
  });
}

// ── Integrity gates ─────────────────────────────────────────────────────────
// The floor is the count of the last verified read (2026-10-03): 32
// connect-client releases, 1.0.0-alpha04 (the first under this coordinate —
// earlier builds shipped as androidx.health:health-connect-client) through
// 1.2.0-alpha06. Releases are never removed from release notes, so fewer
// means the parse broke. Raise after a verified read; never lower to get a
// write through.
const EXPECTED_MIN_RELEASES = 32;
if (releases.length < EXPECTED_MIN_RELEASES) {
  problems.push(`only ${releases.length} connect-client releases parsed (expected >= ${EXPECTED_MIN_RELEASES})`);
}
const versions = releases.map((r) => r.version);
const dupes = versions.filter((v, i) => versions.indexOf(v) !== i);
if (dupes.length) problems.push(`duplicate versions parsed: ${[...new Set(dupes)].join(", ")}`);
if (!releases.some((r) => r.stage === "stable")) problems.push("no stable release parsed — 1.1.0 should be one");
// Within one series the page is newest-first; a date that goes forward while
// reading down means a block boundary slipped. Across series it is NOT
// chronological — Google files by series, and 1.2.0-alpha01 (July 2025) sits
// above 1.1.0 stable (October 2025) — so the check stops at series edges.
for (let i = 1; i < releases.length; i++) {
  const [a, b] = [releases[i - 1], releases[i]];
  if (a.series !== b.series) continue;
  if (a.date && b.date && b.date > a.date) problems.push(`${b.version} (${b.date}) is dated after ${a.version} (${a.date}) above it`);
}
const noSentence = releases.filter((r) => !r.releaseSentence);
if (noSentence.length) problems.push(`no release sentence for: ${noSentence.map((r) => r.version)}`);

if (problems.length) {
  console.error("REFUSING TO WRITE — the release-notes page shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const fetchedOn = new Date().toISOString().slice(0, 10);
const sourceUpdated = /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;
const body = `/**
 * Every ${ARTIFACT} release, read from Google's Jetpack release notes.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-hc-releases.mjs
 *
 * Source: ${URL}
 * Fetched: ${fetchedOn}
 *
 * Copied from the page: version, date, Google's release sentence, the bold
 * section labels and the first bullet. Derived: \`stage\`, from the version
 * string's pre-release suffix (none = stable) — the version is beside it.
 * connect-testing releases on the same page are excluded; a release counts
 * only when its own paragraph names ${ARTIFACT}:<version>.
 */

/** The date the generator last read the release notes. */
export const HC_RELEASES_FETCHED_ON = ${JSON.stringify(fetchedOn)};

export const HC_RELEASES_SOURCE = ${JSON.stringify(URL)};

/** Google's "Last updated" footer stamp on the page at read time. */
export const HC_RELEASES_SOURCE_UPDATED: string | null = ${JSON.stringify(sourceUpdated)};

export type HcReleaseStage = "alpha" | "beta" | "rc" | "stable";

export type HcRelease = {
  /** e.g. "1.1.0-rc03". */
  version: string;
  /** ISO date parsed from \`dateText\`. */
  date: string | null;
  /** The date line as Google prints it, e.g. "July 16, 2025". */
  dateText: string | null;
  /** Derived from the suffix of \`version\`. */
  stage: HcReleaseStage;
  /** Major.minor, e.g. "1.1". */
  series: string;
  /** The h2 the release sits under on Google's page, e.g. "Version 1.1". */
  section: string | null;
  /** Google's release paragraph, verbatim (date line removed). */
  releaseSentence: string | null;
  /** Google's bold section labels in order, e.g. ["API Changes", "Bug Fixes"]. */
  headings: string[];
  /** The first bullet of the notes, verbatim; null when none. */
  firstNote: string | null;
  /** How many bullets the notes carry. */
  noteCount: number;
  /** Deep link to the release on Google's page. */
  url: string;
};

/** Newest first, as Google lists them. */
export const HC_RELEASES: HcRelease[] = ${JSON.stringify(releases, null, 2)};
`;
writeFileSync(OUT, body);
const byStage = releases.reduce((m, r) => ((m[r.stage] = (m[r.stage] ?? 0) + 1), m), {});
console.log(`wrote ${OUT}: ${releases.length} connect-client releases ${JSON.stringify(byStage)}`);
console.log(`skipped (not connect-client): ${skipped.join(", ")}`);
console.log(`fetched: ${URL}`);
