/**
 * Derive every content page's first-published date from git history and
 * write it to src/data/published.ts.
 *
 * Why this exists: a page's `updated` stamp is its last re-verification, and
 * until this file the JSON-LD used it for datePublished too — so every
 * re-check made the page claim it was born on the day it was checked, and the
 * two dates said the same thing twice. The commit history is the only record of
 * when a URL actually started serving, so it is read from there, never typed.
 *
 * What counts as "published":
 *   - Cluster spoke: the later of (a) the first commit whose copy of the
 *     cluster's *.entries.ts contains `"slug": "<slug>"` and (b) the first
 *     commit whose release-gate module contains `"<slug>"`. The gate exists
 *     precisely so content can be committed before it is revealed; an entry
 *     sitting unreleased was not published, so the gate date wins when it is
 *     later. Clusters without a gate (the HealthKit reference pages) use (a).
 *   - Blog post: the commit that first added content/posts/<slug>.mdx.
 *
 * Keys are the page's URL path without the leading slash ("fix/<slug>",
 * "healthkit/<group>", "blog/<slug>"), so a lookup needs nothing but the
 * path the page already computes.
 *
 * Dates are the commit's author date rendered in UTC: the site formats every
 * date as UTC, and a commit made at 01:00 in UTC+5 is still the previous day
 * on the page that prints it.
 *
 * House rule: a short parse fails the build rather than publishing a
 * truncated dataset. The expected row count is the number of slugs found on
 * disk; any slug that gets no date is an error, not a gap to paper over.
 *
 * Needs the full history — a shallow clone would date everything to the
 * graft commit, so that is refused up front.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DATA = "src/data";
const POSTS = "content/posts";
const OUT = "src/data/published.ts";

/**
 * Entries files whose importing module carries no `basePath:` config because
 * the pages are not built by the shared cluster template. Their URL base is
 * stated here; every other entries file must yield one from its module, or
 * the run fails.
 */
const BASE_OVERRIDES = {
  "hkGroupPages.entries.ts": "/healthkit", // HK_BASE in hkGroupPages.ts
  "hkStandalone.entries.ts": "", // each slug is a root-level page
};

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    // UTC rendering of the author date (see header).
    env: { ...process.env, TZ: "UTC" },
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

const DATE_FMT = "--date=format-local:%Y-%m-%d";

/** Earliest commit date whose diff changes the count of `needle` in `paths`. */
function firstPickaxe(needle, paths) {
  const out = git(["log", `-S${needle}`, "--reverse", "--format=%ad", DATE_FMT, "--", ...paths]);
  return out ? out.split("\n")[0] : null;
}

if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
  console.error("backfill-published: shallow clone — run `git fetch --unshallow` first; dates would be wrong.");
  process.exit(1);
}

/** Resolve the URL base and release-gate file for one entries file. */
function clusterWiring(entriesFile) {
  const stem = entriesFile.replace(/\.ts$/, "");
  const importer = fs
    .readdirSync(DATA)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".entries.ts"))
    .find((f) => fs.readFileSync(path.join(DATA, f), "utf8").includes(`from "./${stem}"`));
  if (!importer) throw new Error(`no module in ${DATA} imports ./${stem}`);
  const src = fs.readFileSync(path.join(DATA, importer), "utf8");

  let base = BASE_OVERRIDES[entriesFile];
  if (base === undefined) {
    // `basePath: SOME_PATH` (or a literal), with SOME_PATH declared in the
    // same module — the shape every ClusterConfig in src/data uses.
    const ref = src.match(/basePath:\s*(?:"([^"]*)"|([A-Z_][A-Z0-9_]*))/);
    if (ref?.[1] !== undefined) base = ref[1];
    else if (ref?.[2]) base = src.match(new RegExp(`const ${ref[2]}\\s*=\\s*"([^"]*)"`))?.[1];
  }
  if (base === undefined) throw new Error(`cannot resolve the URL base for ${entriesFile} (via ${importer})`);

  // The gate is a `RELEASED_X = new Set` in the module itself, or imported
  // into it from a sibling (fitnessApis takes its gate from release.ts).
  let gate = null;
  if (/RELEASED_\w+\s*=\s*new Set/.test(src)) gate = path.join(DATA, importer);
  else {
    const imp = src.match(/import\s*\{[^}]*\bRELEASED_\w+[^}]*\}\s*from\s*"\.\/([\w.-]+)"/);
    if (imp) gate = path.join(DATA, `${imp[1]}.ts`);
  }
  return { base, gate };
}

const rows = new Map(); // key -> date
const missing = [];
const gateMoved = []; // spokes whose release came after the entry was committed
let expected = 0;

const entriesFiles = fs.readdirSync(DATA).filter((f) => f.endsWith(".entries.ts")).sort();
for (const file of entriesFiles) {
  const rel = path.join(DATA, file);
  const { base, gate } = clusterWiring(file);
  const slugs = [...fs.readFileSync(rel, "utf8").matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const slug of slugs) {
    expected++;
    const key = `${base}/${slug}`.replace(/^\/+/, "");
    const needle = `"slug": "${slug}"`;
    // Per-file first: a slug can exist in two clusters (background-sync is
    // in both /architecture and /test), and each URL has its own birthday.
    // Fall back to all content only if this file's history has nothing —
    // which would mean the entry arrived in a form the pickaxe cannot see.
    const added = firstPickaxe(needle, [rel]) ?? firstPickaxe(needle, [DATA, "content"]);
    if (!added) {
      missing.push(key);
      continue;
    }
    let date = added;
    if (gate) {
      const released = firstPickaxe(`"${slug}"`, [gate]);
      if (released && released > added) {
        date = released;
        gateMoved.push(`${key} (committed ${added}, released ${released})`);
      }
    }
    rows.set(key, date);
  }
}

const postFiles = fs.existsSync(POSTS) ? fs.readdirSync(POSTS).filter((f) => /\.mdx?$/.test(f)).sort() : [];
for (const file of postFiles) {
  expected++;
  const key = `blog/${file.replace(/\.mdx?$/, "")}`;
  const out = git(["log", "--diff-filter=A", "--format=%ad", DATE_FMT, "--", path.join(POSTS, file)]);
  const date = out ? out.split("\n").at(-1) : null; // log is newest-first; the add is last
  if (!date) {
    missing.push(key);
    continue;
  }
  rows.set(key, date);
}

if (missing.length || rows.size !== expected) {
  console.error(
    `backfill-published: dated ${rows.size} of ${expected} pages — refusing to write.` +
      (missing.length ? `\n  no first-commit date for:\n    ${missing.join("\n    ")}` : "") +
      (rows.size + missing.length !== expected ? "\n  duplicate keys: two entries files resolve to the same URL" : ""),
  );
  process.exit(1);
}

const sorted = [...rows.entries()].sort(([a], [b]) => a.localeCompare(b));
const body = `/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/backfill-published.mjs
 *
 * First-published date of every cluster spoke and blog post, read from git
 * history: the first commit that both contained the entry and listed it in
 * its cluster's release gate (blog posts: the commit that added the file).
 * Keyed by URL path without the leading slash. ${sorted.length} rows.
 *
 * This is datePublished; an entry's \`updated\` stamp is dateModified. A key
 * missing here means the page postdates the last regeneration — rerun the
 * script rather than adding the row by hand.
 */
export const PUBLISHED: Record<string, string> = {
${sorted.map(([k, d]) => `  ${JSON.stringify(k)}: ${JSON.stringify(d)},`).join("\n")}
};
`;

fs.writeFileSync(OUT, body);
console.log(`backfill-published: wrote ${sorted.length} rows to ${OUT}.`);
if (gateMoved.length) {
  console.log(`  ${gateMoved.length} dated by their release gate, not their commit:\n    ${gateMoved.join("\n    ")}`);
}
