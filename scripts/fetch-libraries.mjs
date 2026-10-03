#!/usr/bin/env node
/**
 * Refresh src/data/libraries.ts — registry facts for the open-source packages
 * developers actually pick to reach a health store or a fitness vendor API.
 *
 * Sources, all read live, nothing typed by hand:
 *   - npm:   https://registry.npmjs.org/<name>           (packument)
 *   - pub:   https://pub.dev/api/packages/<name>         (package + versions)
 *            https://pub.dev/api/packages/<name>/score   (licence + platform tags)
 *   - PyPI:  https://pypi.org/pypi/<name>/json
 *   - GitHub repo signals: the REST API (`repos/<owner>/<repo>`) — fetch with
 *     GITHUB_TOKEN in CI, else an unauthenticated fetch, else the `gh api`
 *     command when one is on PATH. When none answers, the previous run's
 *     values are carried forward WITH their own check date, or left null.
 *     A star count is never guessed.
 *   - Last commit on the default branch: a depth-1 `git fetch` of HEAD. This
 *     is not GitHub's `pushed_at`, which moves on a push to any branch or tag
 *     — react-native-health shows a 2026 push over a 2024 default-branch
 *     commit — so the two are stored and labelled separately.
 *
 * Guard rails, both from CLAUDE.md:
 *   - A short read fails. EXPECTED_ROWS is the size of the curated list; if
 *     any registry lookup fails (404 included) the script exits non-zero and
 *     leaves the existing file alone. Removing a package is an editorial
 *     decision — it deletes a page — so it is made by editing PACKAGES, never
 *     by a transient registry error.
 *   - Derived fields keep their evidence. `platforms`, `wraps` and `license`
 *     each carry the field or sentence they were read from, and are null
 *     where the registry metadata does not state them.
 *
 * Writes only when something changed, or when the stamp is a week old.
 * The workflow (.github/workflows/libraries.yml) then decides whether a diff
 * is worth a commit: version/date/licence/deprecation/archive changes commit
 * immediately; star, issue and activity-date churn waits for the month's
 * first run.
 *
 * Usage:  GITHUB_TOKEN=... node scripts/fetch-libraries.mjs
 */
import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = "src/data/libraries.ts";
const STALE_AFTER_DAYS = 7;

/**
 * The curated list. Every entry was confirmed in its registry on 2026-10-03
 * before being added; `why` is the reason it is here, rendered on the page.
 * `group` is the framework a reader arrives with — the hub groups by it.
 *
 * Considered and left out (2026-10-03): @ovalmoney/react-native-fitness (no
 * repository in its registry metadata, last publish 2021-04-19);
 * react-native-healthkit (a 0.0.1 placeholder from 2015); expo-health (0.0.0);
 * capacitor-healthkit (last publish 2022-05-18); health_connect and
 * apple_health on pub.dev (0.0.0 placeholders); fit_kit (discontinued on
 * pub.dev, replaced by `health`); python-fitbit / python-ouraring (not PyPI
 * names — the distributions are `fitbit` and `oura`, included below).
 */
const PACKAGES = [
  // ── React Native ────────────────────────────────────────────────────────
  {
    ecosystem: "npm",
    name: "react-native-health",
    slug: "react-native-health",
    group: "react-native",
    why: "The long-standing React Native bridge to Apple HealthKit, and the one this site's SDK release tracker follows.",
  },
  {
    ecosystem: "npm",
    name: "@kingstinct/react-native-healthkit",
    slug: "kingstinct-react-native-healthkit",
    group: "react-native",
    why: "The other React Native HealthKit binding, typed close to Apple's own identifiers — the usual alternative to react-native-health.",
  },
  {
    ecosystem: "npm",
    name: "react-native-health-connect",
    slug: "react-native-health-connect",
    group: "react-native",
    why: "The React Native wrapper for Android Health Connect; since v4 it also carries the Expo config plugin.",
  },
  {
    ecosystem: "npm",
    name: "expo-health-connect",
    slug: "expo-health-connect",
    group: "react-native",
    why: "Still in many Expo app.json files. Deprecated in the registry and merged into react-native-health-connect v4 — the page exists to say how to remove it.",
  },
  {
    ecosystem: "npm",
    name: "react-native-google-fit",
    slug: "react-native-google-fit",
    group: "react-native",
    why: "The React Native bridge to the Google Fit Android API, which Google has deprecated in favour of Health Connect.",
  },
  // ── Capacitor and Cordova ───────────────────────────────────────────────
  {
    ecosystem: "npm",
    name: "capacitor-health",
    slug: "capacitor-health",
    group: "capacitor-cordova",
    why: "A Capacitor plugin over both Apple Health and Health Connect, derived in part from cordova-plugin-health.",
  },
  {
    ecosystem: "npm",
    name: "@capgo/capacitor-health",
    slug: "capgo-capacitor-health",
    group: "capacitor-cordova",
    why: "Capgo's Capacitor plugin over HealthKit and Health Connect — the other cross-platform choice for Capacitor apps.",
  },
  {
    ecosystem: "npm",
    name: "@perfood/capacitor-healthkit",
    slug: "perfood-capacitor-healthkit",
    group: "capacitor-cordova",
    why: "An iOS-only Capacitor plugin for HealthKit, still found in older Ionic projects.",
  },
  {
    ecosystem: "npm",
    name: "cordova-plugin-health",
    slug: "cordova-plugin-health",
    group: "capacitor-cordova",
    why: "The Cordova plugin over HealthKit and Health Connect, published since 2016 and documented for manual use under Capacitor.",
  },
  // ── Flutter ─────────────────────────────────────────────────────────────
  {
    ecosystem: "pub",
    name: "health",
    slug: "flutter-health",
    group: "flutter",
    why: "The Flutter plugin over HealthKit and Health Connect most Flutter health apps start from.",
  },
  {
    ecosystem: "pub",
    name: "health_connector",
    slug: "health-connector",
    group: "flutter",
    why: "A newer Flutter SDK over HealthKit and Health Connect, first published in November 2025 — the alternative to `health`.",
  },
  {
    ecosystem: "pub",
    name: "health_kit_reporter",
    slug: "health-kit-reporter",
    group: "flutter",
    why: "An iOS-only Flutter wrapper around the HealthKitReporter CocoaPods library.",
  },
  {
    ecosystem: "pub",
    name: "flutter_health_connect",
    slug: "flutter-health-connect",
    group: "flutter",
    why: "A Health Connect-only Flutter plugin that still turns up in search results and older projects.",
  },
  // ── Python ──────────────────────────────────────────────────────────────
  {
    ecosystem: "pypi",
    name: "garminconnect",
    slug: "garminconnect",
    group: "python",
    why: "The Python client most people reach for to read their own Garmin Connect data.",
  },
  {
    ecosystem: "pypi",
    name: "garth",
    slug: "garth",
    group: "python",
    why: "The Garmin auth library garminconnect used to depend on; its README now declares it deprecated.",
  },
  {
    ecosystem: "pypi",
    name: "stravalib",
    slug: "stravalib",
    group: "python",
    why: "The Python client for the Strava V3 API.",
  },
  {
    ecosystem: "pypi",
    name: "oura-ring",
    slug: "oura-ring",
    group: "python",
    why: "A Python client for the Oura API v2 with an OAuth2 helper.",
  },
  {
    ecosystem: "pypi",
    name: "oura",
    slug: "oura-python",
    group: "python",
    why: "The older Python Oura client (repository python-ouraring), whose maintainer is asking for someone to take it over.",
  },
  {
    ecosystem: "pypi",
    name: "fitbit",
    slug: "python-fitbit",
    group: "python",
    why: "The python-fitbit client for the legacy Fitbit Web API, which Google is retiring in favour of the Google Health API.",
  },
  {
    ecosystem: "pypi",
    name: "withings-api",
    slug: "withings-api",
    group: "python",
    why: "A Python client for the Withings Health API using OAuth 2.0.",
  },
];

/** The row guard. Change it in the same edit that changes PACKAGES. */
const EXPECTED_ROWS = 20;

if (PACKAGES.length !== EXPECTED_ROWS) {
  console.error(`PACKAGES has ${PACKAGES.length} entries but EXPECTED_ROWS is ${EXPECTED_ROWS}. Change both together.`);
  process.exit(1);
}
{
  const slugs = new Set();
  for (const p of PACKAGES) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) throw new Error(`bad slug ${p.slug}`);
    if (p.slug === "compare") throw new Error("`compare` is reserved for comparison routes");
    if (slugs.has(p.slug)) throw new Error(`duplicate slug ${p.slug}`);
    slugs.add(p.slug);
  }
}

// ── HTTP ──────────────────────────────────────────────────────────────────

const UA = { "user-agent": "aifitnessapi-library-tracker (+https://aifitnessapi.com/libraries)" };

async function getJson(url, headers = {}, attempts = 3) {
  let lastErr;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...UA, accept: "application/json", ...headers } });
      if (res.status === 404) {
        const err = new Error(`404 Not Found for ${url}`);
        err.status = 404;
        throw err;
      }
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (e.status === 404 || attempt === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  throw lastErr;
}

const day = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : null);

/** owner/repo from any GitHub URL form a registry might carry. */
function githubRepo(url) {
  if (!url || typeof url !== "string") return null;
  const m = /github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/#?].*)?$/.exec(url);
  return m ? `${m[1]}/${m[2]}` : null;
}

// ── Derived fields, each with its evidence ───────────────────────────────

/**
 * Health stores and vendor APIs the registry DESCRIPTION names. Evidence is
 * the description itself. Matching is on the store's own name with a space
 * ("Health Connect"), so a package name like react-native-health-connect
 * inside a description does not count as naming the store.
 */
const STORE_PATTERNS = [
  [/HealthKit|Apple Health\b/i, "Apple HealthKit"],
  [/Health Connect/i, "Health Connect"],
  [/Google ?Fit/i, "Google Fit"],
  [/Garmin/i, "Garmin Connect"],
  [/Strava/i, "Strava API"],
  [/Oura/i, "Oura API"],
  [/Fitbit/i, "Fitbit Web API"],
  [/Withings/i, "Withings API"],
];
function wrapsFrom(description) {
  if (!description) return { wraps: null, wrapsEvidence: null };
  const found = STORE_PATTERNS.filter(([re]) => re.test(description)).map(([, name]) => name);
  return found.length
    ? { wraps: found, wrapsEvidence: `registry description: "${description.trim()}"` }
    : { wraps: null, wrapsEvidence: null };
}

/** SPDX-ish licence normalisation is NOT attempted: the string is stored as
 *  the registry states it, with the field it came from. */
function licenseFromPypi(info) {
  if (info.license_expression) return { license: info.license_expression, licenseEvidence: "PyPI license_expression" };
  const raw = (info.license || "").trim();
  if (raw && raw.length <= 40 && !raw.includes("\n")) return { license: raw, licenseEvidence: "PyPI license field" };
  const cls = (info.classifiers || []).find((c) => c.startsWith("License :: "));
  if (cls) return { license: cls.split(" :: ").at(-1), licenseEvidence: `PyPI classifier "${cls}"` };
  return { license: null, licenseEvidence: null };
}

// ── Registry readers ──────────────────────────────────────────────────────

async function readNpm(p) {
  const doc = await getJson(`https://registry.npmjs.org/${p.name.replace("/", "%2F")}`);
  const latest = doc["dist-tags"]?.latest;
  const v = doc.versions?.[latest];
  if (!latest || !v) throw new Error(`${p.name}: no latest version in packument`);

  let platforms = null;
  let platformsEvidence = null;
  if (v.capacitor && typeof v.capacitor === "object") {
    platforms = Object.keys(v.capacitor).filter((k) => ["ios", "android", "web"].includes(k));
    platformsEvidence = `package.json "capacitor" keys: ${platforms.join(", ")}`;
  } else if (v.engines?.cordovaDependencies) {
    const keys = new Set();
    for (const deps of Object.values(v.engines.cordovaDependencies)) {
      for (const k of Object.keys(deps || {})) {
        if (k === "cordova-ios") keys.add("ios");
        if (k === "cordova-android") keys.add("android");
      }
    }
    if (keys.size) {
      platforms = [...keys].sort();
      platformsEvidence = `package.json engines.cordovaDependencies names ${[...keys].map((k) => `cordova-${k}`).sort().join(", ")}`;
    }
  }
  if (!platforms) {
    const m = /\((iOS|Android) only\)/i.exec(v.description || doc.description || "");
    if (m) {
      platforms = [m[1].toLowerCase()];
      platformsEvidence = `registry description: "${(v.description || doc.description).trim()}"`;
    }
  }

  const description = v.description || doc.description || null;
  const repoUrl = typeof v.repository === "string" ? v.repository : v.repository?.url ?? doc.repository?.url ?? null;
  // Peer dependencies where the package declares them; a Cordova plugin
  // states its toolchain floor in engines.cordovaDependencies instead, keyed
  // by the plugin version the floor applies from — the newest key is the one
  // that governs the latest release.
  let requires = null;
  let requiresSource = null;
  if (v.peerDependencies && Object.keys(v.peerDependencies).length) {
    requires = v.peerDependencies;
    requiresSource = "package.json peerDependencies";
  } else if (v.engines?.cordovaDependencies) {
    const keys = Object.keys(v.engines.cordovaDependencies).filter((k) => /^\d+\.\d+\.\d+$/.test(k));
    const newest = keys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
    if (newest && v.engines.cordovaDependencies[newest]) {
      requires = v.engines.cordovaDependencies[newest];
      requiresSource = `package.json engines.cordovaDependencies["${newest}"]`;
    }
  }

  return {
    registryUrl: `https://www.npmjs.com/package/${p.name}`,
    description,
    latestVersion: latest,
    latestPublished: day(doc.time?.[latest]),
    firstPublished: day(doc.time?.created),
    versionCount: Object.keys(doc.versions || {}).length,
    license: typeof v.license === "string" ? v.license : v.license?.type ?? null,
    licenseEvidence: v.license ? "package.json license" : null,
    repositoryUrl: repoUrl,
    homepage: v.homepage || null,
    platforms,
    platformsEvidence,
    requires,
    requiresSource,
    deprecated: v.deprecated ? { source: "npm deprecation message on the latest version", message: String(v.deprecated) } : null,
    registryStatus: null,
    distTags: doc["dist-tags"],
    ...wrapsFrom(description),
  };
}

async function readPub(p) {
  const doc = await getJson(`https://pub.dev/api/packages/${p.name}`);
  const score = await getJson(`https://pub.dev/api/packages/${p.name}/score`);
  const ps = doc.latest?.pubspec;
  if (!ps) throw new Error(`${p.name}: no latest pubspec`);
  const tags = score.tags || [];

  let platforms = null;
  let platformsEvidence = null;
  const declared = ps.flutter?.plugin?.platforms;
  if (declared && Object.keys(declared).length) {
    platforms = Object.keys(declared).sort();
    platformsEvidence = `pubspec flutter.plugin.platforms: ${platforms.join(", ")}`;
  } else {
    const t = tags.filter((x) => x.startsWith("platform:")).map((x) => x.slice(9)).sort();
    if (t.length) {
      platforms = t;
      platformsEvidence = `pub.dev platform tags: ${t.map((x) => `platform:${x}`).join(", ")}`;
    }
  }

  const licTags = tags
    .filter((x) => x.startsWith("license:"))
    .map((x) => x.slice(8))
    .filter((x) => !["fsf-libre", "osi-approved", "unknown"].includes(x));

  const published = (doc.versions || []).map((x) => x.published).filter(Boolean).sort();
  const description = ps.description || null;
  const repoUrl = ps.repository || (githubRepo(ps.homepage) ? ps.homepage : null);

  return {
    registryUrl: `https://pub.dev/packages/${p.name}`,
    description,
    latestVersion: doc.latest.version,
    latestPublished: day(doc.latest.published),
    firstPublished: day(published[0]),
    versionCount: (doc.versions || []).length,
    license: licTags.length ? licTags.map((x) => x.toUpperCase()).join(" / ") : null,
    licenseEvidence: licTags.length ? `pub.dev tags: ${licTags.map((x) => `license:${x}`).join(", ")}` : null,
    repositoryUrl: repoUrl,
    homepage: ps.homepage || null,
    platforms,
    platformsEvidence,
    requires: ps.environment && Object.keys(ps.environment).length ? ps.environment : null,
    requiresSource: ps.environment ? "pubspec environment" : null,
    deprecated: doc.isDiscontinued
      ? {
          source: "pub.dev isDiscontinued",
          message: doc.replacedBy ? `Discontinued; replaced by ${doc.replacedBy}` : "Discontinued",
        }
      : null,
    registryStatus: null,
    distTags: null,
    ...wrapsFrom(description),
  };
}

async function readPypi(p) {
  const doc = await getJson(`https://pypi.org/pypi/${p.name}/json`);
  const info = doc.info;
  if (!info?.version) throw new Error(`${p.name}: no version in PyPI JSON`);
  const files = doc.releases?.[info.version] ?? [];
  const latestUpload = files.map((f) => f.upload_time_iso_8601).filter(Boolean).sort()[0] ?? null;
  const allUploads = Object.values(doc.releases || {})
    .flat()
    .map((f) => f.upload_time_iso_8601)
    .filter(Boolean)
    .sort();
  const urls = info.project_urls || {};
  const urlValues = Object.values(urls);
  const repoUrl =
    urlValues.find((u) => githubRepo(u) && !/\/(issues|releases|blob|tree)\b/.test(u)) ||
    urlValues.find((u) => githubRepo(u)) ||
    (githubRepo(info.home_page) ? info.home_page : null);
  const status = (info.classifiers || []).find((c) => c.startsWith("Development Status ::")) ?? null;
  const yanked = files.length > 0 && files.every((f) => f.yanked);
  const description = info.summary || null;

  return {
    registryUrl: `https://pypi.org/project/${p.name}/`,
    description,
    latestVersion: info.version,
    latestPublished: day(latestUpload),
    firstPublished: day(allUploads[0]),
    versionCount: Object.values(doc.releases || {}).filter((fs) => fs.length > 0).length,
    ...licenseFromPypi(info),
    repositoryUrl: repoUrl,
    homepage: urls.Homepage || urls.homepage || info.home_page || null,
    platforms: null,
    platformsEvidence: null,
    requires: info.requires_python ? { python: info.requires_python } : null,
    requiresSource: info.requires_python ? "PyPI requires_python" : null,
    deprecated: yanked
      ? { source: "PyPI: every file of the latest release is yanked", message: files[0]?.yanked_reason || "Yanked" }
      : null,
    registryStatus: status,
    distTags: null,
    ...wrapsFrom(description),
  };
}

// ── GitHub signals ───────────────────────────────────────────────────────

const token = process.env.GITHUB_TOKEN;
const inCI = Boolean(process.env.CI);

function ghCli(path) {
  try {
    const out = execFileSync("gh", ["api", path], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30000 });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

/** Returns { stats } on success, { notFound: true } on a 404, or null when no
 *  route to the API answered. */
async function readGithub(repo) {
  const auth = token ? { authorization: `Bearer ${token}` } : {};
  try {
    // CI (token, CI=true) gets retries; anywhere else this route is a
    // convenience, and a sandbox that blocks it should fall through to
    // `gh` quickly rather than back off.
    const j = await getJson(
      `https://api.github.com/repos/${repo}`,
      { accept: "application/vnd.github+json", ...auth },
      token && inCI ? 3 : 1,
    );
    return { json: j };
  } catch (e) {
    if (e.status === 404) return { notFound: true };
    // In CI a non-404 failure is an outage, not a fact: fail the run rather
    // than commit archived:null over archived:false.
    if (token && inCI) throw e;
  }
  const j = ghCli(`repos/${repo}`);
  if (j && j.full_name) return { json: j };
  return null;
}

function lastCommit(repo) {
  const dir = mkdtempSync(join(tmpdir(), "libs-git-"));
  try {
    execFileSync("git", ["init", "-q", "--bare", dir], { stdio: "ignore" });
    execFileSync(
      "git",
      ["-C", dir, "fetch", "-q", "--depth=1", "--filter=tree:0", `https://github.com/${repo}`, "HEAD"],
      { stdio: "ignore", timeout: 60000, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } },
    );
    const out = execFileSync("git", ["-C", dir, "log", "-1", "--format=%cI %H", "FETCH_HEAD"], { encoding: "utf8" }).trim();
    const [date, sha] = out.split(" ");
    return { date: day(date), sha: sha.slice(0, 12) };
  } catch {
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── Previous file (for carry-forward and the write decision) ─────────────

const today = new Date().toISOString().slice(0, 10);
let previous = [];
let previousFetchedOn = null;
let previousPayload = null;
if (existsSync(OUT)) {
  const prev = readFileSync(OUT, "utf8");
  const arr = /export const LIBRARIES: Library\[\] = ([\s\S]*?);\n$/.exec(prev);
  if (arr) {
    try {
      previous = JSON.parse(arr[1]);
      previousPayload = JSON.stringify(previous);
    } catch {
      previous = [];
    }
  }
  previousFetchedOn = /export const LIBRARIES_FETCHED_ON = "(\d{4}-\d{2}-\d{2})"/.exec(prev)?.[1] ?? null;
}
const prevBySlug = new Map(previous.map((e) => [e.slug, e]));

// ── Run ──────────────────────────────────────────────────────────────────

const READERS = { npm: readNpm, pub: readPub, pypi: readPypi };
const failures = [];
const entries = [];
let githubFresh = 0;
let githubCarried = 0;

for (const p of PACKAGES) {
  let reg;
  try {
    reg = await READERS[p.ecosystem](p);
  } catch (e) {
    failures.push(`${p.ecosystem}:${p.name}: ${e.message}`);
    continue;
  }

  const repo = githubRepo(reg.repositoryUrl) ?? githubRepo(reg.homepage);
  const prev = prevBySlug.get(p.slug);

  let repoStats = null;
  let repoFullName = null;
  if (repo) {
    const gh = await readGithub(repo);
    if (gh?.json) {
      const j = gh.json;
      repoFullName = j.full_name ?? null;
      repoStats = {
        stars: j.stargazers_count ?? null,
        openIssues: j.open_issues_count ?? null,
        pushedAt: day(j.pushed_at),
        archived: Boolean(j.archived),
        checkedOn: today,
      };
      githubFresh++;
    } else if (gh?.notFound) {
      repoStats = null;
    } else if (prev?.repoStats) {
      // No route to the API this run (an authoring sandbox, a rate limit
      // without a token). The last values we did read are still true as of
      // the date stored beside them, and the page prints that date.
      repoStats = prev.repoStats;
      repoFullName = prev.repoFullName ?? null;
      githubCarried++;
    }
  }

  const commit = repo ? lastCommit(repo) : null;
  const lastCommitOnDefaultBranch = commit
    ? { ...commit, checkedOn: today }
    : (prev?.lastCommitOnDefaultBranch ?? null);

  entries.push({
    slug: p.slug,
    ecosystem: p.ecosystem,
    name: p.name,
    group: p.group,
    why: p.why,
    ...reg,
    repo,
    repoFullName,
    repoStats,
    lastCommitOnDefaultBranch,
  });
}

if (failures.length) {
  console.error(`Registry lookups failed for ${failures.length} of ${EXPECTED_ROWS} packages:`);
  for (const f of failures) console.error("  - " + f);
  console.error(
    "Refusing to publish a partial set; the existing file is untouched. If a package was really removed " +
      "from its registry, delete it from PACKAGES (and lower EXPECTED_ROWS) on purpose.",
  );
  process.exit(1);
}
if (entries.length !== EXPECTED_ROWS) {
  console.error(`Short read: ${entries.length} entries, expected ${EXPECTED_ROWS}.`);
  process.exit(1);
}
for (const e of entries) {
  if (!e.latestVersion || !e.latestPublished || !e.firstPublished) {
    console.error(`${e.name}: registry answered without a version or publish dates — refusing to write.`);
    process.exit(1);
  }
}

// The per-signal check dates move on every run by construction, so they are
// left out of "did anything change": a run that read the same facts again
// only rewrites the file once the stamp is a week old.
const withoutCheckDates = (json) => json.replace(/"checkedOn":"\d{4}-\d{2}-\d{2}"/g, '"checkedOn":""');
const payload = JSON.stringify(entries);
const unchanged = previousPayload !== null && withoutCheckDates(previousPayload) === withoutCheckDates(payload);
const ageDays = previousFetchedOn ? Math.round((Date.parse(today) - Date.parse(previousFetchedOn)) / 86400000) : Infinity;
if (unchanged && ageDays < STALE_AFTER_DAYS) {
  console.log(`Nothing changed and the stamp is ${ageDays}d old — leaving ${OUT} untouched.`);
  process.exit(0);
}

writeFileSync(
  OUT,
  `/**
 * Registry facts for open-source health and fitness packages.
 *
 * GENERATED — do not hand-edit. Produced by scripts/fetch-libraries.mjs from
 * the npm registry, pub.dev, PyPI, the GitHub REST API and a depth-1 git
 * fetch; refreshed weekly by .github/workflows/libraries.yml. Hand-written
 * notes per package live in src/data/librariesEditorial.ts.
 *
 * Every derived field carries the metadata it was read from (\`*Evidence\`,
 * \`requiresSource\`) and is null where the registry does not state it.
 * \`repoStats\` and \`lastCommitOnDefaultBranch\` carry their own check date,
 * because they can be older than LIBRARIES_FETCHED_ON when GitHub was not
 * reachable from the run that wrote this file.
 */

export type LibraryEcosystem = "npm" | "pub" | "pypi";
export type LibraryGroup = "react-native" | "capacitor-cordova" | "flutter" | "python";

export type Library = {
  slug: string;
  ecosystem: LibraryEcosystem;
  /** The exact registry name — what goes after npm install / pub add / pip install. */
  name: string;
  group: LibraryGroup;
  /** Why the package is on this list (curated in the generator). */
  why: string;
  registryUrl: string;
  description: string | null;
  latestVersion: string;
  /** YYYY-MM-DD the latest version was published (npm time, pub published, PyPI upload). */
  latestPublished: string;
  firstPublished: string;
  versionCount: number;
  license: string | null;
  licenseEvidence: string | null;
  repositoryUrl: string | null;
  homepage: string | null;
  platforms: string[] | null;
  platformsEvidence: string | null;
  /** Peer/runtime constraints exactly as the registry states them. */
  requires: Record<string, string> | null;
  requiresSource: string | null;
  deprecated: { source: string; message: string } | null;
  /** PyPI "Development Status" classifier, verbatim. */
  registryStatus: string | null;
  distTags: Record<string, string> | null;
  /** Stores / vendor APIs the registry description names. */
  wraps: string[] | null;
  wrapsEvidence: string | null;
  /** owner/repo as the registry metadata names it. */
  repo: string | null;
  /** owner/repo as GitHub reports it (differs after a rename). */
  repoFullName: string | null;
  repoStats: {
    stars: number | null;
    openIssues: number | null;
    /** GitHub pushed_at: a push to ANY branch or tag. */
    pushedAt: string | null;
    archived: boolean;
    checkedOn: string;
  } | null;
  lastCommitOnDefaultBranch: { date: string | null; sha: string; checkedOn: string } | null;
};

/** The date this file was last written from a successful run. */
export const LIBRARIES_FETCHED_ON = ${JSON.stringify(today)};

/** Rows the generator expects; it refuses to write fewer. */
export const LIBRARIES_EXPECTED_ROWS = ${EXPECTED_ROWS};

export const LIBRARIES: Library[] = ${JSON.stringify(entries, null, 2)};
`,
);

console.log(
  `wrote ${OUT}: ${entries.length} packages (` +
    `${entries.filter((e) => e.ecosystem === "npm").length} npm, ` +
    `${entries.filter((e) => e.ecosystem === "pub").length} pub, ` +
    `${entries.filter((e) => e.ecosystem === "pypi").length} PyPI); ` +
    `GitHub stats fresh for ${githubFresh}, carried forward for ${githubCarried}, ` +
    `last commit read for ${entries.filter((e) => e.lastCommitOnDefaultBranch?.checkedOn === today).length}` +
    (inCI ? " [CI]" : ""),
);
