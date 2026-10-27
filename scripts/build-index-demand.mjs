/**
 * Which generated per-item reference pages have earned a place in the search
 * index. ops/SEO-10-2026-10-27.md item 4(a).
 *
 *   npm run build                      # the page list comes from the build
 *   node scripts/build-index-demand.mjs
 *
 * Run it after every search pull (scripts/search-pull.mjs writes the dated
 * snapshot it reads), then build again so the pages and the sitemap pick up
 * the result. Writes src/data/indexDemand.ts.
 *
 * The rule, per page of a family below:
 *
 *   noindex, follow and out of the sitemap  when the page had zero Google
 *   impressions AND zero Bing impressions in every pull that covers it, was
 *   first published at least MIN_AGE_DAYS before the newest pull's end date,
 *   and at least MIN_PULLS pulls cover it.
 *
 *   indexed  otherwise.
 *
 * A pull "covers" a page when its window ends on or after the page's first
 * publication (a window that closed before the page existed says nothing
 * about it). Impressions are counted per engine and never added together;
 * a pull without Bing data (the 2026-10-02 snapshot predates the Bing pull)
 * counts as covering for Google only. A noindexed page stays live for
 * readers, site search, the JSON API, the datasets and the machine surfaces —
 * the same treatment as NOINDEX_APIS in src/data/apis.ts — and comes back the
 * first pull that shows it on either engine.
 *
 * Only per-item pages are judged. Hubs, the topic pages beside them and the
 * list/table pages (the four workout-type platform lists, the Health Connect
 * permissions and aggregate tables, /healthkit/<group>, /healthkit-versions/
 * <ios-N>) are never noindexed by this rule: they are where a reader and a
 * crawler find the items, and a noindexed hub would hide the indexed pages
 * under it.
 *
 * First publication, in order of preference:
 *   1. src/data/published.ts (git-derived by scripts/backfill-published.mjs);
 *   2. the date this file already holds for the page (a ledger: a date once
 *      recorded is kept, so the rule cannot forget how old a page is);
 *   3. on the first run only (no previous file), the commit that added the
 *      family's dynamic route — no item data file changed after its route
 *      was added, checked 2026-10-27;
 *   4. otherwise today's date: a page that appeared since the last run is
 *      recorded no older than it can be. Every fallback errs young, so the
 *      rule can be late to noindex a page, never early.
 *
 * House rule (CLAUDE.md, generated data): a short read fails. A snapshot
 * with fewer than MIN_GOOGLE_ROWS Google page rows, a newest snapshot without
 * MIN_BING_ROWS Bing rows or whose window differs from data/gsc/latest.json,
 * a missing build, or a family with fewer built pages than its floor exits
 * non-zero and leaves the previous file in place.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT = "src/data/indexDemand.ts";
const SNAPSHOTS = "data/gsc/snapshots";
const MANIFEST = ".next/prerender-manifest.json";
const MIN_AGE_DAYS = 60;
const MIN_PULLS = 2;
const MIN_GOOGLE_ROWS = 100;
const MIN_BING_ROWS = 50;

/**
 * The generator-backed per-item families. `route` is the dynamic route as the
 * build names it; `floor` the fewest built pages a healthy build has (a
 * regeneration that drops below it is a short read, not a decision);
 * `exclude` names list pages served by the same route.
 */
const FAMILIES = [
  { family: "healthkit-identifiers", route: "/healthkit-identifiers/[case]", floor: 120 },
  { family: "bluetooth-fitness", route: "/bluetooth-fitness/[slug]", floor: 40 },
  { family: "wear-os-data-types", route: "/wear-os-data-types/[name]", floor: 20 },
  { family: "google-health-api", route: "/google-health-api/[dataType]", floor: 40 },
  { family: "health-connect", route: "/health-connect/[record]", floor: 42 },
  { family: "workout-types", route: "/workout-types/[slug]", floor: 9, exclude: platformSlugs() },
  { family: "pose-keypoints", route: "/pose-keypoints/[scheme]", floor: 8 },
  { family: "libraries", route: "/libraries/[slug]", floor: 18 },
];

function fail(msg) {
  console.error(`build-index-demand: ${msg}`);
  process.exit(1);
}

/** The four workout-type platform list pages share the activity route. */
function platformSlugs() {
  const src = fs.readFileSync("src/data/workoutTypePages.ts", "utf8");
  const m = /export const PLATFORM_ORDER[^=]*=\s*\[([^\]]*)\]/.exec(src);
  const slugs = m ? [...m[1].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]) : [];
  if (slugs.length < 4) fail("could not read PLATFORM_ORDER from src/data/workoutTypePages.ts");
  return slugs;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const norm = (p) =>
  (p.replace(/^https?:\/\/(www\.)?aifitnessapi\.com/, "").replace(/[?#].*$/, "").replace(/\/$/, "") || "/").toLowerCase();

// ── The pulls ────────────────────────────────────────────────────────────
const latest = JSON.parse(fs.readFileSync("data/gsc/latest.json", "utf8"));
const pulls = fs
  .readdirSync(SNAPSHOTS)
  .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
  .sort()
  .map((f) => {
    const j = JSON.parse(fs.readFileSync(path.join(SNAPSHOTS, f), "utf8"));
    const google = j.engines?.google;
    const bing = j.engines?.bing ?? null;
    if (!ISO.test(j.range?.start ?? "") || !ISO.test(j.range?.end ?? "")) fail(`${f} has no date range`);
    if (!Array.isArray(google) || google.length < MIN_GOOGLE_ROWS) {
      fail(`${f} has ${google?.length ?? 0} Google page rows, expected at least ${MIN_GOOGLE_ROWS}`);
    }
    const sum = (rows) => {
      const m = new Map();
      for (const r of rows ?? []) m.set(norm(r.path), (m.get(norm(r.path)) ?? 0) + (r.impressions ?? 0));
      return m;
    };
    return { file: f, start: j.range.start, end: j.range.end, google: sum(google), bing: bing ? sum(bing) : null, bingRows: bing?.length ?? 0 };
  });
if (pulls.length === 0) fail(`no snapshots in ${SNAPSHOTS}`);
const newest = pulls.at(-1);
if (newest.start !== latest.range?.start || newest.end !== latest.range?.end) {
  fail(`newest snapshot ${newest.file} covers ${newest.start}..${newest.end} but data/gsc/latest.json covers ${latest.range?.start}..${latest.range?.end}`);
}
if (newest.bing === null || newest.bingRows < MIN_BING_ROWS) {
  fail(`newest snapshot ${newest.file} has ${newest.bingRows} Bing page rows, expected at least ${MIN_BING_ROWS}`);
}
const cutoff = addDays(newest.end, -MIN_AGE_DAYS);

// ── The pages ────────────────────────────────────────────────────────────
if (!fs.existsSync(MANIFEST)) fail(`${MANIFEST} missing — run \`npm run build\` first`);
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const bySrc = new Map();
for (const [route, v] of Object.entries(manifest.routes ?? {})) {
  if (!v.srcRoute) continue;
  (bySrc.get(v.srcRoute) ?? bySrc.set(v.srcRoute, []).get(v.srcRoute)).push(route);
}

const published = Object.fromEntries(
  [...fs.readFileSync("src/data/published.ts", "utf8").matchAll(/^\s*"([^"]+)":\s*"(\d{4}-\d{2}-\d{2})"/gm)].map((m) => [m[1], m[2]]),
);
if (Object.keys(published).length < 400) fail("src/data/published.ts parsed short");

/** The previous output, if any: its dates are the ledger. */
const prevRows = (() => {
  if (!fs.existsSync(OUT)) return null;
  const src = fs.readFileSync(OUT, "utf8");
  const m = /export const INDEX_DEMAND: [^=]+= /.exec(src);
  const end = m ? src.indexOf("\n];", m.index) : -1;
  if (!m || end === -1) fail(`${OUT} exists but its INDEX_DEMAND array could not be read`);
  return new Map(JSON.parse(src.slice(m.index + m[0].length, end + 2)).map((r) => [r.path, r]));
})();

function routeAdded(route) {
  const file = `src/app${route}/page.tsx`;
  const out = execFileSync("git", ["log", "--diff-filter=A", "--format=%ad", "--date=format-local:%Y-%m-%d", "--", `:(literal)${file}`], {
    encoding: "utf8",
    env: { ...process.env, TZ: "UTC" },
  }).trim();
  const d = out.split("\n").at(-1);
  if (!ISO.test(d ?? "")) fail(`no commit adds ${file} — is this a shallow clone?`);
  return d;
}

const today = new Date().toISOString().slice(0, 10);
const rows = [];
for (const f of FAMILIES) {
  const built = (bySrc.get(f.route) ?? []).filter((p) => !(f.exclude ?? []).includes(p.split("/").at(-1))).sort();
  if (built.length < f.floor) fail(`${f.route} built ${built.length} pages, expected at least ${f.floor}`);
  const added = prevRows === null ? routeAdded(f.route) : null;
  for (const p of built) {
    const key = p.slice(1);
    const prev = prevRows?.get(p);
    let firstPublished;
    let dateFrom;
    if (published[key]) [firstPublished, dateFrom] = [published[key], "published.ts"];
    else if (prev) [firstPublished, dateFrom] = [prev.firstPublished, prev.dateFrom];
    else if (added) [firstPublished, dateFrom] = [added, "route"];
    else [firstPublished, dateFrom] = [today, "first-seen"];

    const covering = pulls.filter((u) => u.end >= firstPublished);
    const k = norm(p);
    const google = covering.reduce((n, u) => n + (u.google.get(k) ?? 0), 0);
    const bing = covering.reduce((n, u) => n + (u.bing?.get(k) ?? 0), 0);
    let reason;
    if (google > 0 || bing > 0) reason = "impressions";
    else if (firstPublished > cutoff) reason = "too-young";
    else if (covering.length < MIN_PULLS) reason = "too-few-pulls";
    else reason = "no-impressions";
    rows.push({
      path: p,
      family: f.family,
      firstPublished,
      dateFrom,
      pulls: covering.length,
      google,
      bing,
      decision: reason === "no-impressions" ? "noindex" : "index",
      reason,
    });
  }
}

// ── Write ────────────────────────────────────────────────────────────────
const noindexCount = rows.filter((r) => r.decision === "noindex").length;
const body = `/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   npm run build && node scripts/build-index-demand.mjs
 * after every search pull, then build again.
 *
 * The index decision for every generated per-item reference page
 * (ops/SEO-10-2026-10-27.md item 4a): a page with zero Google and zero Bing
 * impressions in every pull that covers it, first published at least
 * ${MIN_AGE_DAYS} days before the newest pull's end, and covered by at least
 * ${MIN_PULLS} pulls is noindex, follow and out of the sitemap. Everything
 * else is indexed. The full rule, and why each fallback date errs young, is
 * in the script's header. Hubs and list pages are never judged.
 *
 * Pulls read: ${pulls.map((u) => `${u.file} (${u.start} to ${u.end}${u.bing ? "" : ", Google only"})`).join(", ")}.
 * ${rows.length} pages judged, ${noindexCount} noindexed.
 */

export type IndexDemandRow = {
  path: string;
  family: string;
  /** First publication; dateFrom says where the date came from. */
  firstPublished: string;
  dateFrom: "published.ts" | "route" | "first-seen";
  /** Pulls whose window ends on or after firstPublished. */
  pulls: number;
  /** Impressions summed over those pulls, per engine; never added together. */
  google: number;
  bing: number;
  decision: "index" | "noindex";
  reason: "impressions" | "too-young" | "too-few-pulls" | "no-impressions";
};

export const INDEX_DEMAND_RULE = ${JSON.stringify({ minAgeDays: MIN_AGE_DAYS, minPulls: MIN_PULLS, newestPullEnd: newest.end, publishedOnOrBefore: cutoff })} as const;

export const INDEX_DEMAND: IndexDemandRow[] = [
${rows.map((r) => `  ${JSON.stringify(r)},`).join("\n").replace(/,$/, "")}
];

/** Paths this rule takes out of the index. */
export const NOINDEX_GENERATED: ReadonlySet<string> = new Set(INDEX_DEMAND.filter((r) => r.decision === "noindex").map((r) => r.path));
`;
fs.writeFileSync(OUT, body);

// ── Print what it decided ────────────────────────────────────────────────
console.log(
  `build-index-demand: newest pull ${newest.start} → ${newest.end}; noindex needs zero impressions on both engines, first published on or before ${cutoff}, at least ${MIN_PULLS} covering pulls → ${OUT}`,
);
for (const f of FAMILIES) {
  const rs = rows.filter((r) => r.family === f.family);
  const count = (reason) => rs.filter((r) => r.reason === reason).length;
  const young = rs.filter((r) => r.reason === "too-young");
  const eligible = young.length ? addDays(young.map((r) => r.firstPublished).sort()[0], MIN_AGE_DAYS) : null;
  console.log(
    `  ${f.family.padEnd(22)} ${String(rs.length).padStart(4)} pages: ${String(count("impressions")).padStart(3)} with impressions, ` +
      `${String(count("too-young")).padStart(3)} unseen but too young, ${count("too-few-pulls")} too few pulls, ` +
      `${String(count("no-impressions")).padStart(3)} noindex` +
      (eligible ? `  (first unseen page reaches ${MIN_AGE_DAYS} days with a pull ending ${eligible})` : ""),
  );
}
for (const r of rows.filter((x) => x.decision === "noindex")) console.log(`  noindex ${r.path} (first published ${r.firstPublished}, ${r.pulls} pulls)`);
const flipped = prevRows ? rows.filter((r) => prevRows.get(r.path) && prevRows.get(r.path).decision !== r.decision) : [];
for (const r of flipped) console.log(`  changed ${r.path}: ${prevRows.get(r.path).decision} → ${r.decision} (${r.reason})`);
console.log(`  ${noindexCount} of ${rows.length} pages noindexed.`);
