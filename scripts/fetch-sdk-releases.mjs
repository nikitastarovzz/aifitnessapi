#!/usr/bin/env node
/**
 * Refresh src/data/sdkReleases.ts from the GitHub Releases API.
 *
 * Runs in CI, not at build time. api.github.com is unreachable from the
 * authoring container, and a release tracker should refresh on a schedule
 * anyway rather than freezing whatever was true at the last deploy.
 *
 * The repo list is deliberately short and deliberately verified. Every entry
 * was confirmed to exist before being added; guessing plausible repo names
 * would produce a tracker that silently follows nothing. Adding a repo means
 * checking it resolves first — the script fails loudly on a 404 rather than
 * skipping it, so a renamed or deleted repo surfaces instead of going quiet.
 *
 * Usage:  GITHUB_TOKEN=... node scripts/fetch-sdk-releases.mjs
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const OUT = "src/data/sdkReleases.ts";

/**
 * Repos this site tracks. `why` is rendered on the page — a tracker that
 * lists releases without saying why the repo matters to a fitness-API reader
 * is just a feed.
 */
const REPOS = [
  {
    repo: "agencyenterprise/react-native-health",
    label: "react-native-health",
    why: "The most-used bridge from React Native to Apple HealthKit. Its releases are where HealthKit type support arrives for RN apps.",
    covers: "Apple HealthKit",
  },
  {
    repo: "matinzd/react-native-health-connect",
    label: "react-native-health-connect",
    why: "The React Native wrapper for Android Health Connect, supporting both the old and new RN architectures.",
    covers: "Android Health Connect",
  },
  {
    repo: "android/health-samples",
    label: "android/health-samples",
    why: "Google's own sample projects for Health Connect, Health Services and Wear OS. Changes here usually precede changes in the guidance.",
    covers: "Android Health Connect, Health Services",
  },
];

const token = process.env.GITHUB_TOKEN;
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "aifitnessapi-release-tracker",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

const problems = [];
const entries = [];

for (const r of REPOS) {
  let meta;
  try {
    meta = await api(`/repos/${r.repo}`);
  } catch (e) {
    // A repo we verified that has since moved or vanished is a fact worth
    // surfacing, not a row to drop silently.
    problems.push(`${r.repo}: ${e.message}`);
    continue;
  }

  let releases = [];
  try {
    releases = await api(`/repos/${r.repo}/releases?per_page=5`);
  } catch (e) {
    problems.push(`${r.repo} releases: ${e.message}`);
  }

  entries.push({
    repo: r.repo,
    label: r.label,
    why: r.why,
    covers: r.covers,
    url: `https://github.com/${r.repo}`,
    stars: meta.stargazers_count ?? null,
    archived: Boolean(meta.archived),
    pushedAt: meta.pushed_at ? meta.pushed_at.slice(0, 10) : null,
    releases: (Array.isArray(releases) ? releases : [])
      .filter((rel) => !rel.draft)
      .slice(0, 5)
      .map((rel) => ({
        tag: rel.tag_name,
        name: rel.name && rel.name !== rel.tag_name ? rel.name : null,
        publishedAt: rel.published_at ? rel.published_at.slice(0, 10) : null,
        prerelease: Boolean(rel.prerelease),
        url: rel.html_url,
      })),
  });
}

if (problems.length) {
  console.error("Problems reaching tracked repos:");
  for (const p of problems) console.error("  - " + p);
}
// Refuse to overwrite good data with a broken run. A transient API failure
// must not silently empty the tracker on the site.
if (entries.length === 0) {
  console.error("No repo resolved — leaving the existing data in place.");
  process.exit(1);
}
if (existsSync(OUT)) {
  const prev = readFileSync(OUT, "utf8");
  const prevCount = (prev.match(/"repo":/g) || []).length;
  if (prevCount > entries.length) {
    console.error(`Refusing to shrink the tracker from ${prevCount} to ${entries.length} repos.`);
    process.exit(1);
  }
}

// ── Write only when it means something ────────────────────────────────────
//
// SDK_CHECKED_ON is stamped with today's date, so a naive write makes the
// file differ on every single run and CI commits — and redeploys the whole
// site — daily for a one-character change. Three of the first four runs did
// exactly that.
//
// So the payload is compared with the check date excluded. If the releases,
// star counts and archive flags are all unchanged, the only reason left to
// write is to keep "checked on" from going misleadingly stale, and a week is
// close enough for a page that says which day we last looked.
const STALE_AFTER_DAYS = 7;
const checkedOn = new Date().toISOString().slice(0, 10);

const payload = JSON.stringify(entries);
let previousPayload = null;
let previousCheckedOn = null;
if (existsSync(OUT)) {
  const prev = readFileSync(OUT, "utf8");
  const arr = /export const SDK_REPOS: SdkRepo\[\] = ([\s\S]*?);\n$/.exec(prev);
  if (arr) {
    try {
      previousPayload = JSON.stringify(JSON.parse(arr[1]));
    } catch {
      // Unparseable previous file: fall through and rewrite it.
    }
  }
  previousCheckedOn = /export const SDK_CHECKED_ON(?::[^=]*)? = "(\d{4}-\d{2}-\d{2})"/.exec(prev)?.[1] ?? null;
}

const dataUnchanged = previousPayload !== null && previousPayload === payload;
const dateAgeDays = previousCheckedOn
  ? Math.round((Date.parse(checkedOn) - Date.parse(previousCheckedOn)) / 86400000)
  : Infinity;

if (dataUnchanged && dateAgeDays < STALE_AFTER_DAYS) {
  console.log(
    `No release changes and the check date is ${dateAgeDays}d old (< ${STALE_AFTER_DAYS}d) — leaving ${OUT} untouched.`,
  );
  process.exit(0);
}

writeFileSync(
  OUT,
  `/**
 * Release activity for the SDKs that sit between an app and a health store.
 *
 * GENERATED — do not hand-edit. Refreshed in CI by
 * .github/workflows/sdk-releases.yml, which runs
 * scripts/fetch-sdk-releases.mjs against the GitHub Releases API.
 *
 * The repo list is short on purpose: every entry was verified to exist before
 * it was added. This tracks the bridges, not the vendors — vendor release
 * notes are not machine-readable, and this site does not publish facts it
 * cannot fetch.
 */

export type SdkRelease = {
  tag: string;
  name: string | null;
  publishedAt: string | null;
  prerelease: boolean;
  url: string;
};

export type SdkRepo = {
  repo: string;
  label: string;
  /** Why a reader of this site should care about this repo. */
  why: string;
  /** Which health store the SDK bridges to. */
  covers: string;
  url: string;
  stars: number | null;
  archived: boolean;
  /** Last push to the default branch — activity, not release cadence. */
  pushedAt: string | null;
  releases: SdkRelease[];
};

/** The date CI last reached the GitHub API. */
export const SDK_CHECKED_ON = ${JSON.stringify(checkedOn)};

export const SDK_REPOS: SdkRepo[] = ${JSON.stringify(entries, null, 2)};
`,
);

console.log(
  `wrote ${OUT}: ${entries.length} repos, ${entries.reduce((n, e) => n + e.releases.length, 0)} releases` +
    (dataUnchanged ? ` (data unchanged; refreshed the check date, ${dateAgeDays}d old)` : " (data changed)"),
);
