#!/usr/bin/env node
/**
 * Regenerate src/data/libraryWeather.ts — "weather" for the Python clients of
 * vendor cloud APIs that src/data/libraries.ts tracks (its `python` group:
 * garminconnect, garth, stravalib, the two Oura clients, python-fitbit,
 * withings-api). Garmin's Python users in particular depend on clients that
 * sign in the way Garmin's own apps do, and the first sign a login flow
 * changed is a run of issues titled "login fails" or "403".
 *
 * For each repository, from GitHub's public REST API:
 *   - every issue (pull requests excluded) opened in the last 90 days:
 *     GET /search/issues?q=repo:<owner/repo> is:issue created:>=<day>
 *     (sorted by creation, paginated to the total GitHub reports);
 *   - how many of those were opened in the last 14 days, how many of each
 *     window have a title matching the keyword set in src/lib/libraryWeather.mjs,
 *     and the newest matching issue's title, link and date;
 *   - the latest release: GET /repos/<owner/repo>/releases/latest (a 404 means
 *     the repository has published no release, stored as null).
 * The counting is done by weather() in src/lib/libraryWeather.mjs, which the
 * page and scripts/library-weather.test.mjs share.
 *
 * Routes, in order: GITHUB_TOKEN when set (CI: .github/workflows/library-weather.yml),
 * else an unauthenticated fetch (run with NODE_USE_ENV_PROXY=1 behind a
 * proxy), else the `gh api` command when one is on PATH, else, for a release
 * only, a source-snapshot job log passed with --snapshot-log (the dev
 * environment can search issues but not read another repository's releases;
 * dispatch .github/workflows/source-snapshot.yml with the releases/latest
 * URLs and print_chars, save the job log, pass it here). Every response is
 * cached in .cache/library-weather/ (gitignored) with the time and route it
 * was read by.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-library-weather.mjs [--snapshot-log <job log>]
 *   node scripts/fetch-library-weather.mjs --offline    (regenerate from the cache only)
 *   ... --cache <dir> --out <file>   (elsewhere; the test uses both)
 *
 * Guard rails (CLAUDE.md):
 *   - A short read fails. EXPECTED_ROWS is the size of the python group; if
 *     fewer libraries are found, any request fails, GitHub marks a search
 *     incomplete, or the pages read do not add up to the total GitHub
 *     reports, the script exits non-zero and writes nothing.
 *   - Nothing is inferred: the counts are counts of titles, the keyword set is
 *     written into the output and rendered on the page, and the page says a
 *     count is a signal of reported breakage, not proof.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { KEYWORDS, TITLE_MAX, WINDOWS, daysBefore, searchQuery, weather } from "../src/lib/libraryWeather.mjs";

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const OFFLINE = process.argv.includes("--offline");
const OUT = arg("--out") ?? "src/data/libraryWeather.ts";
const CACHE = arg("--cache") ?? ".cache/library-weather";
const LIBRARIES_FILE = arg("--libraries") ?? "src/data/libraries.ts";
const SNAPSHOT_LOG = arg("--snapshot-log");
const API = "https://api.github.com";

/** Rows the generator expects: the python group of src/data/libraries.ts. */
const EXPECTED_ROWS = 7;

const fail = (msg) => {
  console.error(`fetch-library-weather: ${msg}`);
  process.exit(1);
};

// ── The libraries ────────────────────────────────────────────────────────

const libSrc = readFileSync(LIBRARIES_FILE, "utf8");
const libArr = /export const LIBRARIES: Library\[\] = ([\s\S]*?);\n$/.exec(libSrc);
if (!libArr) fail(`${LIBRARIES_FILE} has no LIBRARIES array`);
const LIBS = JSON.parse(libArr[1])
  .filter((l) => l.group === "python")
  .map((l) => ({ slug: l.slug, name: l.name, repo: l.repoFullName ?? l.repo }));
if (LIBS.length < EXPECTED_ROWS) fail(`expected ${EXPECTED_ROWS} python libraries in ${LIBRARIES_FILE}, found ${LIBS.length}`);
for (const l of LIBS) if (!/^[\w.-]+\/[\w.-]+$/.test(l.repo ?? "")) fail(`${l.slug} has no GitHub repository`);

// ── Reading ──────────────────────────────────────────────────────────────

const token = process.env.GITHUB_TOKEN;
const inCI = Boolean(process.env.CI);
const HEADERS = { accept: "application/vnd.github+json", "user-agent": "aifitnessapi-library-weather", "x-github-api-version": "2022-11-28" };

/** { status, body, via } from fetch, or null when the route did not answer usefully. */
async function viaFetch(path) {
  try {
    const res = await fetch(`${API}/${path}`, { headers: token ? { ...HEADERS, authorization: `Bearer ${token}` } : HEADERS, signal: AbortSignal.timeout(30000) });
    const text = await res.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
    if (res.ok || res.status === 404) {
      // A proxy that refuses a repository answers 403 with its own message;
      // only GitHub's own 404 ("Not Found") means "no such resource".
      if (res.status === 404 && body?.message !== "Not Found") return null;
      return { status: res.status, body, via: token ? "GitHub REST API (token)" : "GitHub REST API" };
    }
    if (token && inCI) fail(`${res.status} from ${API}/${path}: ${text.slice(0, 200)}`);
    return null;
  } catch (e) {
    if (token && inCI) fail(`${API}/${path}: ${e.message}`);
    return null;
  }
}

function viaGh(path) {
  try {
    const out = execFileSync("gh", ["api", path], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30000 });
    return { status: 200, body: JSON.parse(out), via: "GitHub REST API (gh api)" };
  } catch (e) {
    const err = String(e.stderr ?? "");
    if (/HTTP 404/.test(err) && /Not Found/.test(err)) return { status: 404, body: { message: "Not Found" }, via: "GitHub REST API (gh api)" };
    return null;
  }
}

/** Responses printed by a source-snapshot job log: URL → { status, body, fetchedAt, via }. */
function snapshotResponses(file) {
  const out = new Map();
  if (!file) return out;
  let cur = null;
  let lines = [];
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z /, "");
    const m = /^===== SNAPSHOT (\S+) \| status (\d+) \| fetched (\S+) \|/.exec(line);
    if (m) {
      cur = { url: m[1], status: Number(m[2]), fetchedAt: m[3] };
      lines = [];
      continue;
    }
    if (cur && line.startsWith("===== END ")) {
      try {
        out.set(cur.url, { status: cur.status, body: JSON.parse(lines.join("\n")), fetchedAt: cur.fetchedAt, via: `source-snapshot job log ${file.split("/").pop()}` });
      } catch {
        // Not JSON, or cut short by print_chars: not usable.
      }
      cur = null;
      continue;
    }
    if (cur) lines.push(line);
  }
  return out;
}
const SNAPSHOT = snapshotResponses(SNAPSHOT_LOG);

const cacheFile = (repo, kind) => join(CACHE, `${repo.replace("/", "__")}.${kind}.json`);
const readCache = (repo, kind) => {
  const f = cacheFile(repo, kind);
  if (!existsSync(f)) fail(`--offline: ${f} is not cached; run without --offline first`);
  return JSON.parse(readFileSync(f, "utf8"));
};
const writeCache = (repo, kind, value) => {
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(cacheFile(repo, kind), JSON.stringify(value, null, 2));
};

async function readIssues(repo, since) {
  if (OFFLINE) return readCache(repo, "issues");
  const q = searchQuery(repo, since);
  const pages = [];
  let via = null;
  for (let page = 1; page <= 10; page++) {
    const path = `search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=100&page=${page}`;
    const r = (await viaFetch(path)) ?? viaGh(path);
    if (!r || r.status !== 200) fail(`${repo}: the issue search did not answer (${path})`);
    via = r.via;
    pages.push(r.body);
    const got = pages.reduce((n, p) => n + (p.items?.length ?? 0), 0);
    if (got >= r.body.total_count || !r.body.items?.length) break;
  }
  const cached = { repo, query: q, fetchedAt: new Date().toISOString(), via, pages };
  writeCache(repo, "issues", cached);
  return cached;
}

async function readRelease(repo) {
  if (OFFLINE) return readCache(repo, "release");
  const path = `repos/${repo}/releases/latest`;
  const url = `${API}/${path}`;
  let r = (await viaFetch(path)) ?? viaGh(path);
  let fetchedAt = new Date().toISOString();
  if (!r && SNAPSHOT.has(url)) ({ fetchedAt, ...r } = SNAPSHOT.get(url));
  if (!r) fail(`${repo}: ${url} did not answer by any route (pass a source-snapshot log with --snapshot-log)`);
  if (r.status !== 200 && r.status !== 404) fail(`${repo}: ${url} answered ${r.status}`);
  const cached = { repo, url, fetchedAt, via: r.via, status: r.status, body: r.body };
  writeCache(repo, "release", cached);
  return cached;
}

// ── Run ──────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);
const rows = [];
for (const l of LIBS) {
  const issuesRead = await readIssues(l.repo, daysBefore(today, WINDOWS.long));
  const asOf = issuesRead.fetchedAt.slice(0, 10);
  const items = [];
  let total = null;
  for (const p of issuesRead.pages) {
    if (p.incomplete_results) fail(`${l.repo}: GitHub marked the issue search incomplete`);
    total = p.total_count;
    items.push(...(p.items ?? []));
  }
  if (total === null) fail(`${l.repo}: no search page read`);
  if (total > 1000) fail(`${l.repo}: ${total} issues in 90 days is past the search API's 1,000-result cap`);
  if (items.length !== total) fail(`${l.repo}: read ${items.length} issues, GitHub reports ${total}`);
  // The cached query must be the one this asOf implies, or the 90-day window would be wrong.
  if (issuesRead.query !== searchQuery(l.repo, daysBefore(asOf, WINDOWS.long))) fail(`${l.repo}: the cached query ${issuesRead.query} is not the 90-day query for ${asOf}`);
  const w = weather(items, asOf);

  const rel = await readRelease(l.repo);
  if (rel.status !== 200 && rel.status !== 404) fail(`${l.repo}: ${rel.url} answered ${rel.status}`);
  const b = rel.body ?? {};
  if (rel.status === 200 && !(b.tag_name && b.published_at && b.html_url)) fail(`${l.repo}: the latest release has no tag, date or link`);
  rows.push({
    slug: l.slug,
    name: l.name,
    repo: l.repo,
    issuesUrl: `https://github.com/${l.repo}/issues?q=${encodeURIComponent(`is:issue created:>=${w.since.long}`)}`,
    ...w,
    latestRelease: rel.status === 200 ? { tag: b.tag_name, publishedOn: b.published_at.slice(0, 10), url: b.html_url } : null,
    releaseCheckedOn: rel.fetchedAt.slice(0, 10),
  });
  console.log(
    `${l.repo}: ${w.opened.short}/${w.opened.long} issues opened in ${WINDOWS.short}/${WINDOWS.long} days, ${w.authRelated.short}/${w.authRelated.long} matching; release ${rel.status === 200 ? b.tag_name : "none"} (${rel.via})`,
  );
}
if (rows.length < EXPECTED_ROWS) fail(`only ${rows.length} of ${EXPECTED_ROWS} rows`);

const fetchedOn = rows.map((r) => r.asOf).sort()[0];
const body = `/**
 * "Weather" for the Python clients of vendor cloud APIs in
 * src/data/libraries.ts: issues opened on each GitHub repository in the last
 * ${WINDOWS.short} and ${WINDOWS.long} days, how many have a title matching LIBRARY_WEATHER_KEYWORDS,
 * the newest such issue, and the latest release. Rendered as the "Weather"
 * box on /libraries/<slug>.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/fetch-library-weather.mjs
 * (weekly in .github/workflows/library-weather.yml; --offline reparses
 * .cache/library-weather).
 *
 * A count of issue titles is a signal that people are reporting breakage,
 * not proof the library is broken.
 */

export type LibraryWeather = {
  slug: string;
  name: string;
  repo: string;
  /** The repository's issue list, filtered to the long window. */
  issuesUrl: string;
  /** The day the issues were read (UTC); both windows end on it. */
  asOf: string;
  /** First day of each window: asOf minus ${WINDOWS.short} and ${WINDOWS.long} days. */
  since: { short: string; long: string };
  /** Issues (no pull requests) opened on or after since.short / since.long. */
  opened: { short: number; long: number };
  /** Of those, the ones whose title matches LIBRARY_WEATHER_KEYWORDS. */
  authRelated: { short: number; long: number };
  /** The newest matching issue in the long window; the title is cut at ${TITLE_MAX} characters. */
  newestAuthRelated: { number: number; title: string; url: string; createdOn: string; matched: string[] } | null;
  /** GitHub's releases/latest; null when the repository has published no release. */
  latestRelease: { tag: string; publishedOn: string; url: string } | null;
  releaseCheckedOn: string;
};

/** The earliest day any row's issues were read. */
export const LIBRARY_WEATHER_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** Rows the generator expects; it refuses to write fewer. */
export const LIBRARY_WEATHER_EXPECTED_ROWS = ${EXPECTED_ROWS};

export const LIBRARY_WEATHER_WINDOWS = ${JSON.stringify(WINDOWS)};

/** Matched case-insensitively against issue titles, at the start of a word (src/lib/libraryWeather.mjs). */
export const LIBRARY_WEATHER_KEYWORDS: string[] = ${JSON.stringify(KEYWORDS.map((k) => k.word))};

export const LIBRARY_WEATHER: LibraryWeather[] = ${JSON.stringify(rows, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`✓ ${OUT}: ${rows.length} libraries, issues read ${fetchedOn}.`);
