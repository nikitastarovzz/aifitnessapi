/**
 * Pure functions behind the weekly health checks in scripts/gsc-report.mjs.
 * ops/NEXT-10-2026-11-04.md item 3. No file system, no network, no clock:
 * every input is passed in, so scripts/gsc-sections.test.mjs can pin them.
 *
 * Four checks, each a heuristic that points at pages to look at, never a
 * verdict:
 *   ctrAnomalies     page one (position ≤ 10) earning under half the CTR the
 *                    curve below expects for its position, read without
 *                    machineQueries (AI-tool searches nobody clicks)
 *   cannibalisation  a query with ≥ 10 impressions spread over 2+ of our pages
 *   decay            impressions down ≥ 30% against an earlier snapshot while
 *                    the position held (±1.5), so the loss is demand or
 *                    snippet, not ranking
 *   indexLag         sitemap URLs with no impressions, aged by their
 *                    first-published date from src/data/published.ts
 */

/**
 * Position → expected CTR. A rounded public composite of published
 * click-curve studies; it is a heuristic for ordering pages against each
 * other, not a forecast or a target. Positions are rounded to the nearest
 * whole rank; past page one the curve is flattened on purpose.
 */
export const CTR_CURVE = [0.28, 0.15, 0.11, 0.08, 0.06, 0.05, 0.04, 0.035, 0.03, 0.025];

export function expectedCtr(position) {
  if (!Number.isFinite(position) || position < 1) return CTR_CURVE[0];
  if (position <= 10) return CTR_CURVE[Math.max(0, Math.min(9, Math.round(position) - 1))];
  if (position <= 20) return 0.012;
  if (position <= 30) return 0.006;
  return 0.003;
}

/** "https://www.x.com/a/" and "/a" are one page: host dropped, trailing slash trimmed. */
export function normalisePath(u) {
  let p;
  try {
    p = new URL(u).pathname;
  } catch {
    p = String(u ?? "/");
  }
  if (!p.startsWith("/")) p = `/${p}`;
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : p;
}

/**
 * Merge page rows that share a path (www and apex, trailing slash). Position
 * is impression-weighted, so a 1-impression row cannot outvote a busy one.
 * Accepts snapshot rows ({path, …}) or API rows ({keys: [url], …}).
 */
export function mergeByPath(rows) {
  const by = new Map();
  for (const r of rows ?? []) {
    const p = normalisePath(r.path ?? r.keys?.[0]);
    const cur = by.get(p) ?? { path: p, clicks: 0, impressions: 0, posWeighted: 0 };
    cur.clicks += r.clicks ?? 0;
    cur.impressions += r.impressions ?? 0;
    cur.posWeighted += (r.position || 0) * (r.impressions ?? 0);
    by.set(p, cur);
  }
  return [...by.values()].map(({ posWeighted, ...v }) => ({
    ...v,
    position: v.impressions ? posWeighted / v.impressions : 0,
    ctr: v.impressions ? v.clicks / v.impressions : 0,
  }));
}

/**
 * (a) Page-one pages earning under `ratio` × the curve's CTR for their
 * position. `minImpressions` keeps a 4-impression page from being flagged on
 * noise. Sorted by clicks short of the curve.
 */
export function ctrAnomalies(pages, { maxPosition = 10, minImpressions = 50, ratio = 0.5 } = {}) {
  return pages
    .filter((r) => r.impressions >= minImpressions && r.position > 0 && r.position <= maxPosition)
    .map((r) => {
      const ctr = r.impressions ? r.clicks / r.impressions : 0;
      const expected = expectedCtr(r.position);
      return { ...r, ctr, expected, ratio: ctr / expected, shortfall: r.impressions * expected - r.clicks };
    })
    .filter((r) => r.ctr < r.expected * ratio)
    .sort((a, b) => b.shortfall - a.shortfall);
}

/**
 * (a′) Queries that look machine-issued rather than typed by a person
 * (ops/GSC-10-2026-11-13.md item 5). Search Console counts the searches AI
 * answer engines and agent tools run against Google while they ground an
 * answer. They arrive in bulk, sit at the top of the results and are never
 * clicked: "tryrook.io alternatives" 301 impressions at 2.1, "api fitness
 * alternatives" 125 at 1.1, "evaluate rook on health data api for
 * developers" 86 at 8.1, all with no click (Oct 30 to Nov 12). Rewriting a
 * title for them cannot win a click, so the CTR check reads pages without
 * them. A query is machine-like when it has no click and either
 *   - `minTopImpressions` or more impressions at position ≤ `topPosition`
 *     (a person shown a top-3 result that often clicks it at least once), or
 *   - `minPatternImpressions` or more impressions and the shape such tools
 *     write: "evaluate <x> on …", "best <x> for <y>" of five or more words,
 *     a bare domain followed by "alternatives", or a question of nine or more
 *     words.
 * A heuristic that sets pages aside for a person to look at, never a
 * verdict on who searched. Input: byQuery rows ({keys: [query], clicks,
 * impressions, position}). Returns a Set of query strings.
 */
export const MACHINE_PATTERNS = [
  /^evaluate \S.* on /,
  /^best \S+(?: \S+)* for \S+(?: \S+)*$/,
  /^[a-z0-9-]+\.(?:io|co|com|ai|app|dev|health)\b.* alternatives?$/,
];
export function machineQueries(byQuery, { topPosition = 3, minTopImpressions = 20, minPatternImpressions = 10 } = {}) {
  const out = new Set();
  for (const r of byQuery ?? []) {
    const q = String(r.keys?.[0] ?? "").toLowerCase().trim();
    if (!q || r.clicks > 0) continue;
    const words = q.split(/\s+/).length;
    const top = r.impressions >= minTopImpressions && r.position > 0 && r.position <= topPosition;
    const shaped =
      r.impressions >= minPatternImpressions &&
      ((MACHINE_PATTERNS.some((re) => re.test(q)) && (words >= 5 || !/^best /.test(q))) || (q.endsWith("?") && words >= 9));
    if (top || shaped) out.add(r.keys[0]);
  }
  return out;
}

/**
 * Page rows with the impressions of `machine` queries taken out, from the
 * query→page join. Position is re-weighted over what remains; a page whose
 * impressions were all machine-like drops out. Clicks are untouched (a
 * machine-like query has none). `removed` on each row says how many
 * impressions went.
 */
export function withoutMachineQueries(pages, byQueryPage, machine) {
  const cut = new Map();
  for (const r of byQueryPage ?? []) {
    if (!machine.has(r.keys?.[0])) continue;
    const p = normalisePath(r.keys?.[1]);
    const c = cut.get(p) ?? { impressions: 0, posWeighted: 0 };
    c.impressions += r.impressions;
    c.posWeighted += r.position * r.impressions;
    cut.set(p, c);
  }
  const out = [];
  for (const r of pages) {
    const c = cut.get(r.path);
    if (!c) { out.push({ ...r, removed: 0 }); continue; }
    const impressions = Math.max(0, r.impressions - c.impressions);
    if (impressions === 0) continue;
    const position = Math.max(1, (r.position * r.impressions - c.posWeighted) / impressions);
    out.push({ ...r, impressions, position, ctr: r.clicks / impressions, removed: r.impressions - impressions });
  }
  return out;
}

/**
 * (b) Queries whose impressions are split over two or more of our pages.
 * Input is byQueryPage rows ({keys: [query, url], clicks, impressions,
 * position}). Pages are merged by path first, so www/apex is one page.
 * `pages` is sorted by impressions; `topShare` is the leading page's share.
 */
export function cannibalisation(byQueryPage, { minImpressions = 10, minPages = 2 } = {}) {
  const byQuery = new Map();
  for (const r of byQueryPage ?? []) {
    const q = r.keys?.[0];
    if (!q) continue;
    const list = byQuery.get(q) ?? [];
    list.push({ path: r.keys[1], clicks: r.clicks, impressions: r.impressions, position: r.position });
    byQuery.set(q, list);
  }
  const out = [];
  for (const [query, rows] of byQuery) {
    const pages = mergeByPath(rows)
      .filter((p) => p.impressions > 0)
      .sort((a, b) => b.impressions - a.impressions);
    const impressions = pages.reduce((n, p) => n + p.impressions, 0);
    if (pages.length < minPages || impressions < minImpressions) continue;
    out.push({
      query,
      impressions,
      clicks: pages.reduce((n, p) => n + p.clicks, 0),
      pages,
      topShare: pages[0].impressions / impressions,
    });
  }
  return out.sort((a, b) => b.impressions - a.impressions);
}

/**
 * (c) Pages whose impressions fell by `drop` or more against `previous` while
 * the position stayed within ±`posTolerance`. Both inputs are page rows
 * (snapshot or API shape); they are merged by path. A page absent from
 * `current` has no position to compare, so it is returned under `vanished`
 * instead of being called decay.
 */
export function decay(current, previous, { drop = 0.3, posTolerance = 1.5, minImpressions = 20 } = {}) {
  const now = new Map(mergeByPath(current).map((r) => [r.path, r]));
  const decayed = [];
  const vanished = [];
  for (const before of mergeByPath(previous)) {
    if (before.impressions < minImpressions) continue;
    const after = now.get(before.path);
    if (!after || after.impressions === 0) {
      vanished.push(before);
      continue;
    }
    const change = (after.impressions - before.impressions) / before.impressions;
    const dPos = after.position - before.position;
    if (change <= -drop && Math.abs(dPos) <= posTolerance) {
      decayed.push({ path: before.path, before, after, change, dPos, lost: before.impressions - after.impressions });
    }
  }
  return { decayed: decayed.sort((a, b) => b.lost - a.lost), vanished: vanished.sort((a, b) => b.impressions - a.impressions) };
}

/** <loc> values of a sitemap, as normalised paths. */
export function parseSitemap(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => normalisePath(m[1]));
}

/** src/data/published.ts → Map(path → YYYY-MM-DD). Keys there have no leading slash. */
export function parsePublished(src) {
  const map = new Map();
  for (const m of String(src).matchAll(/^\s*"([^"]*)":\s*"(\d{4}-\d{2}-\d{2})"/gm)) map.set(normalisePath(`/${m[1]}`), m[2]);
  return map;
}

const DAY = 86400000;
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);

/**
 * (d) Sitemap URLs with no impressions in the window. Each is placed by its
 * first-published date against the window:
 *   lagging   published before the window started — the whole window was
 *             available and the page still drew nothing
 *   partial   published inside the window
 *   tooNew    published after the window ended — nothing to judge yet
 *   unknown   no row in published.ts (hubs, static pages, or the file is
 *             behind the build)
 * `seen` is a Set of paths that had impressions (any engine the caller
 * chooses). `ageDays` is the page's age at the window's end.
 */
export function indexLag(sitemapPaths, seen, published, range) {
  const out = { lagging: [], partial: [], tooNew: [], unknown: [] };
  for (const p of new Set(sitemapPaths)) {
    if (seen.has(p)) continue;
    const first = published.get(p) ?? null;
    if (!first) out.unknown.push({ path: p, published: null, ageDays: null });
    else {
      const row = { path: p, published: first, ageDays: daysBetween(first, range.end) };
      if (first < range.start) out.lagging.push(row);
      else if (first <= range.end) out.partial.push(row);
      else out.tooNew.push(row);
    }
  }
  for (const k of ["lagging", "partial", "tooNew"]) out[k].sort((a, b) => b.ageDays - a.ageDays || a.path.localeCompare(b.path));
  out.unknown.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

/** Days two windows share; 0 when they do not overlap. */
export function overlapDays(a, b) {
  if (!a?.start || !a?.end || !b?.start || !b?.end) return 0;
  const start = a.start > b.start ? a.start : b.start;
  const end = a.end < b.end ? a.end : b.end;
  return end < start ? 0 : daysBetween(start, end) + 1;
}
