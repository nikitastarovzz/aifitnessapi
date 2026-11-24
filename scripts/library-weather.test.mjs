/**
 * Library weather: the keyword match and window counts in
 * src/lib/libraryWeather.mjs, the generator scripts/fetch-library-weather.mjs
 * run --offline on a fixture cache, and the committed src/data/libraryWeather.ts.
 *
 *   node --test scripts/library-weather.test.mjs   (npm run test:library-weather)
 *
 * The issues and releases below are synthetic test input written to a
 * temporary directory; they never reach the data file.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { KEYWORDS, TITLE_MAX, WINDOWS, daysBefore, isAuthRelated, matchedKeywords, searchQuery, weather } from "../src/lib/libraryWeather.mjs";
import { LIBRARY_WEATHER, LIBRARY_WEATHER_EXPECTED_ROWS, LIBRARY_WEATHER_KEYWORDS, LIBRARY_WEATHER_WINDOWS } from "../src/data/libraryWeather.ts";
import { LIBRARIES } from "../src/data/libraries.ts";

const cwd = new URL("..", import.meta.url);

test("the keyword set matches titles at the start of a word, ignoring case", () => {
  const hits = {
    "Login fails since Garmin change": ["login"],
    "Cannot log in with new account": ["log in"],
    "log-in loop": ["log in"],
    "Authentication error after update": ["auth"],
    "OAuth token refresh returns 401": ["auth", "oauth"].filter((w) => w === "oauth"),
    "authorization header missing": ["auth"],
    "HTTP 403 on every call": ["403"],
    "429 Too Many Requests": ["429"],
    "Sync is broken": ["broken"],
    "MFA prompt never arrives": ["MFA"],
    "mfa code rejected; login broken": ["login", "broken", "MFA"],
  };
  for (const [title, words] of Object.entries(hits)) {
    for (const w of words) assert.ok(matchedKeywords(title).includes(w), `${title} → ${w}`);
    assert.ok(isAuthRelated(title), title);
  }
  for (const miss of [
    "Add support for gear notes",
    "Author field missing from activity",
    "authority docs link",
    "blogin parser",
    "Error 4030 on upload",
    "Unbroken streaks are miscounted",
    "catalog of endpoints",
  ]) {
    assert.equal(isAuthRelated(miss), false, miss);
  }
  assert.equal(matchedKeywords("OAuth flow").includes("auth"), false, "oauth is its own keyword; auth needs a word start");
  assert.deepEqual(LIBRARY_WEATHER_KEYWORDS, KEYWORDS.map((k) => k.word), "the data file lists the keyword set the counts used");
});

const iss = (number, title, day, extra = {}) => ({ number, title, html_url: `https://github.com/o/r/issues/${number}`, created_at: `${day}T08:00:00Z`, ...extra });

test("weather() counts the two windows and picks the newest matching issue", () => {
  const asOf = "2026-11-24";
  assert.equal(daysBefore(asOf, 14), "2026-11-10");
  assert.equal(daysBefore(asOf, 90), "2026-08-26");
  const w = weather(
    [
      iss(10, "Login fails with 403", "2026-11-20"),
      iss(9, "Feature: gear", "2026-11-10"),
      iss(8, "429 on SSO", "2026-11-09"),
      iss(7, "MFA loop", "2026-08-26"),
      iss(6, "broken login", "2026-08-25"),
    ],
    asOf,
  );
  assert.deepEqual(w.since, { short: "2026-11-10", long: "2026-08-26" });
  assert.deepEqual(w.opened, { short: 2, long: 4 }, "the window's first day counts; the day before the long window does not");
  assert.deepEqual(w.authRelated, { short: 1, long: 3 });
  assert.deepEqual(w.newestAuthRelated, { number: 10, title: "Login fails with 403", url: "https://github.com/o/r/issues/10", createdOn: "2026-11-20", matched: ["login", "403"] });
  assert.equal(weather([iss(1, "Gear", "2026-11-01")], asOf).newestAuthRelated, null);
  const long = weather([iss(2, `login ${"x".repeat(300)}`, "2026-11-01")], asOf).newestAuthRelated.title;
  assert.equal(long.length, TITLE_MAX);
  assert.ok(long.endsWith("…"));
  assert.throws(() => weather([iss(3, "PR", "2026-11-01", { pull_request: {} })], asOf), /pull request/);
  assert.throws(() => weather([iss(4, "future", "2026-11-25")], asOf), /after the read/);
  assert.equal(searchQuery("o/r", "2026-08-26"), "repo:o/r is:issue created:>=2026-08-26");
});

const PY = ["cyberjunky/python-garminconnect", "matin/garth", "stravalib/stravalib", "hedgertronic/oura-ring", "turing-complet/python-ouraring", "orcasgit/python-fitbit", "vangorra/python_withings_api"];

/** A temporary libraries file, cache and output; `tweak(cache)` may break the cache. */
function runFixture(tweak = () => {}, libs = PY) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "library-weather-"));
  const cache = path.join(dir, "cache");
  fs.mkdirSync(cache);
  const rows = libs.map((repo, i) => ({ slug: `lib-${i}`, name: `lib${i}`, group: "python", repo, repoFullName: repo }));
  rows.push({ slug: "rn", name: "rn", group: "react-native", repo: "x/rn", repoFullName: "x/rn" });
  const libsFile = path.join(dir, "libraries.ts");
  fs.writeFileSync(libsFile, `export const LIBRARIES: Library[] = ${JSON.stringify(rows, null, 2)};\n`);
  const fetchedAt = "2026-11-24T09:00:00.000Z";
  for (const repo of libs) {
    const key = repo.replace("/", "__");
    const items = repo === PY[0] ? [iss(453, "first SSO request returns 429", "2026-10-07"), iss(476, "Personal API available", "2026-10-21"), iss(480, "Login broken again", "2026-11-22")] : [];
    const issues = { repo, query: searchQuery(repo, "2026-08-26"), fetchedAt, via: "fixture", pages: [{ total_count: items.length, incomplete_results: false, items }] };
    const release =
      repo === PY[1]
        ? { repo, url: `https://api.github.com/repos/${repo}/releases/latest`, fetchedAt, via: "fixture", status: 404, body: { message: "Not Found" } }
        : { repo, url: `https://api.github.com/repos/${repo}/releases/latest`, fetchedAt, via: "fixture", status: 200, body: { tag_name: "v1.0.0", published_at: "2026-10-23T11:32:56Z", html_url: `https://github.com/${repo}/releases/tag/v1.0.0` } };
    fs.writeFileSync(path.join(cache, `${key}.issues.json`), JSON.stringify(issues));
    fs.writeFileSync(path.join(cache, `${key}.release.json`), JSON.stringify(release));
  }
  tweak(cache);
  const out = path.join(dir, "out.ts");
  const r = spawnSync(process.execPath, ["scripts/fetch-library-weather.mjs", "--offline", "--cache", cache, "--libraries", libsFile, "--out", out], { cwd, encoding: "utf8" });
  const written = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : null;
  fs.rmSync(dir, { recursive: true, force: true });
  return { status: r.status, stderr: r.stderr, written };
}
const rowsOf = (src) => JSON.parse(/export const LIBRARY_WEATHER: LibraryWeather\[\] = (\[[\s\S]*\]);\s*$/.exec(src)[1]);

test("the generator writes every python library from the cache, with a missing release as null", () => {
  const { status, stderr, written } = runFixture();
  assert.equal(status, 0, stderr);
  const rows = rowsOf(written);
  assert.equal(rows.length, PY.length, "only the python group, every one of it");
  const g = rows[0];
  assert.equal(g.repo, PY[0]);
  assert.equal(g.asOf, "2026-11-24");
  assert.deepEqual(g.opened, { short: 1, long: 3 });
  assert.deepEqual(g.authRelated, { short: 1, long: 2 });
  assert.equal(g.newestAuthRelated.number, 480);
  assert.deepEqual(g.latestRelease, { tag: "v1.0.0", publishedOn: "2026-10-23", url: `https://github.com/${PY[0]}/releases/tag/v1.0.0` });
  assert.equal(rows[1].latestRelease, null, "a 404 from releases/latest is no release");
  assert.ok(written.includes("GENERATED — do not hand-edit"));
  assert.ok(written.includes(`LIBRARY_WEATHER_KEYWORDS: string[] = ${JSON.stringify(KEYWORDS.map((k) => k.word))}`));
});

test("a short or inconsistent read fails and writes nothing", () => {
  const first = (cache) => path.join(cache, `${PY[0].replace("/", "__")}.issues.json`);
  const edit = (f, fn) => fs.writeFileSync(f, JSON.stringify(fn(JSON.parse(fs.readFileSync(f, "utf8")))));
  const cases = {
    "fewer python libraries than expected": [() => {}, PY.slice(0, 6)],
    "a page short of the reported total": [(c) => edit(first(c), (j) => ((j.pages[0].total_count = 4), j))],
    "an incomplete search": [(c) => edit(first(c), (j) => ((j.pages[0].incomplete_results = true), j))],
    "a cached query for another window": [(c) => edit(first(c), (j) => ((j.query = searchQuery(PY[0], "2026-01-01")), j))],
    "a release that answered 500": [(c) => edit(path.join(c, `${PY[2].replace("/", "__")}.release.json`), (j) => ((j.status = 500), j))],
    "a release without a date": [(c) => edit(path.join(c, `${PY[2].replace("/", "__")}.release.json`), (j) => (delete j.body.published_at, j))],
    "a missing cache file": [(c) => fs.rmSync(path.join(c, `${PY[3].replace("/", "__")}.release.json`))],
  };
  for (const [name, [tweak, libs]] of Object.entries(cases)) {
    const { status, written } = runFixture(tweak, libs);
    assert.notEqual(status, 0, name);
    assert.equal(written, null, `${name}: nothing written`);
  }
});

test("the committed file covers every python library with consistent counts", () => {
  const python = LIBRARIES.filter((l) => l.group === "python");
  assert.ok(LIBRARY_WEATHER.length >= LIBRARY_WEATHER_EXPECTED_ROWS);
  assert.deepEqual(LIBRARY_WEATHER.map((w) => w.slug), python.map((l) => l.slug), "one row per python library, in the tracker's order");
  assert.deepEqual(LIBRARY_WEATHER_WINDOWS, WINDOWS);
  for (const w of LIBRARY_WEATHER) {
    assert.equal(w.repo, python.find((l) => l.slug === w.slug).repoFullName);
    assert.equal(w.since.short, daysBefore(w.asOf, WINDOWS.short));
    assert.equal(w.since.long, daysBefore(w.asOf, WINDOWS.long));
    assert.ok(w.opened.short <= w.opened.long && w.authRelated.short <= w.authRelated.long, w.slug);
    assert.ok(w.authRelated.long <= w.opened.long && w.authRelated.short <= w.opened.short, w.slug);
    assert.equal(w.newestAuthRelated === null, w.authRelated.long === 0, `${w.slug}: a newest issue exactly when one matched`);
    if (w.newestAuthRelated) {
      assert.ok(isAuthRelated(w.newestAuthRelated.title), w.slug);
      assert.ok(w.newestAuthRelated.createdOn >= w.since.long && w.newestAuthRelated.createdOn <= w.asOf, w.slug);
      assert.match(w.newestAuthRelated.url, new RegExp(`^https://github\\.com/${w.repo.replace(".", "\\.")}/issues/\\d+$`));
    }
    if (w.latestRelease) assert.match(w.latestRelease.url, new RegExp(`^https://github\\.com/${w.repo.replace(".", "\\.")}/releases/tag/`));
  }
});
