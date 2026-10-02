/**
 * Post-build SEO/link QA gate. Run `npm run build && npm run qa`.
 *
 * Catches the defect classes that have actually bitten this site:
 *  - phantom internal links (a link to a page that doesn't exist)
 *  - rendered <title> over 60 chars / meta description over 155
 *  - missing canonical or og:image
 *  - invalid JSON-LD, or more than one BreadcrumbList on a page
 *  - duplicate titles/descriptions across pages
 *  - the same FAQ question on two pages (they collide in FAQPage rich results)
 *  - GEO invariants: every spoke listed in llms.txt, a /md mirror per spoke,
 *    AI crawlers allowed in robots.txt, FAQPage + speakable on every spoke
 *
 * Exits non-zero with a report so a regression fails CI instead of shipping.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = ".next/server/app";
const TITLE_MAX = 60;
const DESC_MAX = 155;

if (!fs.existsSync(ROOT)) {
  console.error("No build output found — run `npm run build` first.");
  process.exit(1);
}

const htmls = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmls.push(p);
  }
})(ROOT);

const routeOf = (h) => {
  let r = h.slice(ROOT.length).replace(/\.html$/, "");
  if (r.endsWith("/index")) r = r.slice(0, -6);
  return r === "" ? "/" : r;
};

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "—")
    .replace(/&middot;/g, "·")
    .replace(/&rsquo;/g, "’");

const valid = new Set(htmls.map(routeOf));

/** The content of every <meta name="robots"> on a page, whatever the attribute order. */
const robotsOf = (html) =>
  [...html.matchAll(/<meta\b[^>]*\bname="robots"[^>]*>/g)].map((m) => /\bcontent="([^"]*)"/.exec(m[0])?.[1] ?? "");

/** The href of a page's <link rel="canonical">, whatever its attribute order. */
const canonicalOf = (html) =>
  /\bhref="([^"]*)"/.exec(/<link\b[^>]*\brel="canonical"[^>]*>/.exec(html)?.[0] ?? "")?.[1];

/** Normalize an FAQ question so near-duplicates collide: lowercase, drop
 *  punctuation and the filler words that vary between otherwise identical
 *  questions ("how do I stop the model inventing X" vs "how to stop the model
 *  inventing X"). */
const STOP = new Set(["a","an","the","i","my","you","your","do","does","did","is","are","can","should","to","for","of","in","on","it","that","just","actually","really","and","or","if"]);
function faqKey(q) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .sort()
    .join(" ");
}
const problems = [];
const titles = new Map();
const descs = new Map();
const faqs = new Map();
let checked = 0;

const notFoundRoutes = [];
const notFoundSet = new Set();
/** route → the newest JSON-LD dateModified (YYYY-MM-DD) the page declares. */
const dateModifiedOf = new Map();

for (const h of htmls) {
  const route = routeOf(h);
  if (route.startsWith("/_")) continue; // framework pages (404, error)
  const html = fs.readFileSync(h, "utf8");

  // A route that calls notFound() still emits a full HTML file carrying the
  // ROOT layout's title and description — so without this it would collide
  // with "/" on DUP-TITLE and DUP-DESC and read as an orphan, purely for not
  // existing. Next stamps its own marker in the RSC payload; that is the
  // authoritative signal, not a guess at the rendered copy.
  //
  // These are still counted and printed. A page that 404s by accident is a
  // real bug, and it should be visible rather than quietly skipped.
  if (html.includes("NEXT_HTTP_ERROR_FALLBACK;404")) {
    notFoundRoutes.push(route);
    notFoundSet.add(route);
    continue;
  }

  checked++;

  for (const m of html.matchAll(/href="(\/[a-z0-9/-]+)"/g)) {
    const target = m[1];
    if (target === "/" || valid.has(target)) continue;
    problems.push(`PHANTOM-LINK   ${route} -> ${target}`);
  }

  const tm = html.match(/<title>([^<]*)<\/title>/);
  if (tm) {
    const t = decode(tm[1]);
    (titles.get(t) ?? titles.set(t, []).get(t)).push(route);
    if (t.length > TITLE_MAX) problems.push(`TITLE-${t.length}     ${route}: ${t}`);
  }

  const dm = html.match(/<meta name="description" content="([^"]*)"/);
  if (dm) {
    const d = decode(dm[1]);
    (descs.get(d) ?? descs.set(d, []).get(d)).push(route);
    if (d.length > DESC_MAX) problems.push(`DESC-${d.length}      ${route}`);
  }

  if (!/rel="canonical"/.test(html)) problems.push(`NO-CANONICAL   ${route}`);
  if (!/property="og:image"/.test(html)) problems.push(`NO-OG-IMAGE    ${route}`);

  // A shared link is attributed to og:url, a search result to the canonical.
  // When the two disagree the same page is counted as two URLs. The case this
  // was written for shipped: the root layout's og:url named the homepage, and
  // every page that set no openGraph of its own inherited it, so a share of
  // that page was credited to "/". A noindex page may omit og:url (it is not
  // meant to be found); an indexable one that names a canonical must name it
  // again as og:url.
  {
    const canonical = canonicalOf(html);
    const ogUrl = /\bcontent="([^"]*)"/.exec(/<meta\b[^>]*\bproperty="og:url"[^>]*>/.exec(html)?.[0] ?? "")?.[1];
    const noindex = robotsOf(html).some((c) => /noindex/i.test(c));
    if (canonical && ogUrl && decode(ogUrl) !== decode(canonical)) {
      problems.push(`OG-URL-MISMATCH ${route}: og:url ${decode(ogUrl)} vs canonical ${decode(canonical)}`);
    }
    if (canonical && !ogUrl && !noindex) problems.push(`NO-OG-URL      ${route} is indexable and has a canonical but no og:url`);
  }

  let breadcrumbs = 0;
  for (const l of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(decode(l[1]));
      // Every dateModified the page declares, at any depth (an @graph child,
      // a nested WebPage) — the sitemap gate below holds lastmod to it.
      (function collectDates(n) {
        if (Array.isArray(n)) return n.forEach(collectDates);
        if (!n || typeof n !== "object") return;
        if (typeof n.dateModified === "string" && /^\d{4}-\d{2}-\d{2}/.test(n.dateModified)) {
          const d = n.dateModified.slice(0, 10);
          if (!(dateModifiedOf.get(route) >= d)) dateModifiedOf.set(route, d);
        }
        for (const v of Object.values(n)) if (v && typeof v === "object") collectDates(v);
      })(parsed);
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node["@type"] === "BreadcrumbList") breadcrumbs++;
        if (node["@type"] === "FAQPage") {
          for (const q of node.mainEntity ?? []) {
            const k = faqKey(q.name ?? "");
            if (!k) continue;
            (faqs.get(k) ?? faqs.set(k, []).get(k)).push(route);
          }
        }
      }
    } catch (e) {
      problems.push(`BAD-JSON-LD    ${route}: ${e.message.slice(0, 60)}`);
    }
  }
  if (breadcrumbs > 1) problems.push(`MULTI-BREADCRUMB ${route} (${breadcrumbs})`);
}

// Inbound-link audit: a published page nothing links to is invisible to
// crawlers and readers alike. Count internal content links (dedup by
// source page), fail on true orphans, report thin pages informally.
{
  const inbound = new Map();
  for (const h of htmls) {
    const route = routeOf(h);
    if (route.startsWith("/_")) continue;
    const html = fs.readFileSync(h, "utf8");
    const seen = new Set();
    for (const m of html.matchAll(/href="(\/[a-z0-9/-]+)"/g)) {
      const t = m[1];
      if (t !== route && valid.has(t)) seen.add(t);
    }
    for (const t of seen) inbound.set(t, (inbound.get(t) ?? 0) + 1);
  }
  const thin = [];
  for (const h of htmls) {
    const route = routeOf(h);
    if (route === "/" || route.startsWith("/_") || route.startsWith("/blog")) continue;
    // A route that renders notFound() is not published, so nothing should be
    // linking to it — being unlinked is the correct state, not an orphan.
    if (notFoundSet.has(route)) {
      // The exclusion above must not become a place for real pages to hide.
      // PHANTOM-LINK cannot catch this: the file exists, it just renders a
      // 404. So if anything on the site links to a route that 404s, that is
      // a broken link we shipped — louder than an orphan, not quieter.
      const n = inbound.get(route) ?? 0;
      if (n > 0) {
        problems.push(`LINK-TO-404    ${route} — ${n} internal link(s) point at a route that renders notFound()`);
      }
      continue;
    }
    const n = inbound.get(route) ?? 0;
    if (n === 0) problems.push(`ORPHAN         ${route} — no internal links point here`);
    else if (n < 3) thin.push(`${route} (${n})`);
  }
  if (thin.length) console.log(`Thin inbound (<3, informational): ${thin.join(", ")}`);
}

// ── Fragment links. PHANTOM-LINK and the inbound count above match only a
// bare href="/path", so a link carrying #fragment was never checked at all:
// not that its page exists, and not that the fragment lands anywhere. A dead
// fragment still resolves — it just drops the reader at the top of the page
// instead of on the row or answer the link promised, which no crawl reports.
// Every built HTML file is scanned (the 404 shell is served to readers too),
// and every internal fragment is resolved against the ids of the target
// page's built HTML: "/x#y" against /x, a same-page "#y" against the page it
// sits on. Resolution follows the HTML spec's fragment rules, nothing looser:
// an element whose id (or an <a>'s legacy name) equals the fragment, tried
// as written and then percent-decoded; an empty fragment and "top" mean the
// top of the document. A protocol-relative "//host" href is external.
{
  const fileByRoute = new Map(htmls.map((h) => [routeOf(h), h]));
  const idCache = new Map();
  const idsOf = (route) => {
    if (!idCache.has(route)) {
      const html = fs.readFileSync(fileByRoute.get(route), "utf8");
      const ids = new Set();
      for (const m of html.matchAll(/\sid="([^"]*)"/g)) ids.add(decode(m[1]));
      for (const m of html.matchAll(/<a\b[^>]*\sname="([^"]*)"/g)) ids.add(decode(m[1]));
      idCache.set(route, ids);
    }
    return idCache.get(route);
  };
  const seen = new Set();
  let resolved = 0;
  let samePage = 0;
  for (const h of htmls) {
    const from = routeOf(h);
    const html = fs.readFileSync(h, "utf8");
    for (const m of html.matchAll(/href="(\/[^"#]*)?#([^"]*)"/g)) {
      const [, rawPath, rawFrag] = m;
      if (rawPath?.startsWith("//")) continue;
      const key = `${from} ${rawPath ?? ""}#${rawFrag}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let target = from;
      if (rawPath !== undefined) {
        target = decode(rawPath).split("?")[0];
        if (target.length > 1 && target.endsWith("/")) target = target.slice(0, -1);
      } else samePage++;
      const shown = `${rawPath ?? ""}#${decode(rawFrag)}`;
      if (!fileByRoute.has(target) || notFoundSet.has(target)) {
        problems.push(
          `FRAGMENT-NO-PAGE ${from} -> ${shown} — ${fileByRoute.has(target) ? "the target renders notFound()" : "no built page answers the path"}`,
        );
        continue;
      }
      const frag = decode(rawFrag);
      let pct = frag;
      try { pct = decodeURIComponent(frag); } catch { /* not percent-encoded */ }
      const ids = idsOf(target);
      if (frag === "" || ids.has(frag) || ids.has(pct) || frag.toLowerCase() === "top") {
        resolved++;
        continue;
      }
      problems.push(`FRAGMENT-DEAD  ${from} -> ${shown} — no element with that id on ${target}`);
    }
  }
  console.log(`Fragments: ${resolved} of ${seen.size} internal fragment links resolve (${samePage} same-page).`);
}

for (const [t, routes] of titles) {
  if (routes.length > 1) problems.push(`DUP-TITLE      ${routes.join(", ")} — "${t}"`);
}
for (const [, routes] of descs) {
  if (routes.length > 1) problems.push(`DUP-DESC       ${routes.join(", ")}`);
}
// Two pages asking the same FAQ compete in the same FAQPage rich result, so
// Google suppresses one and both lose. Parallel writers produce these silently.
for (const [k, routes] of faqs) {
  const uniq = [...new Set(routes)];
  if (uniq.length > 1) problems.push(`DUP-FAQ        ${uniq.join(", ")} — "${k}"`);
}

// The type reference is only worth publishing if every row carries a real
// identifier for both platforms. An empty cell is a guess waiting to happen.
const matrixPath = "src/data/matrix.ts";
if (fs.existsSync(matrixPath)) {
  const src = fs.readFileSync(matrixPath, "utf8");
  // Values may wrap onto the next line, and ids contain digits (vo2-max) —
  // match tolerantly so the gate flags real gaps, not formatting.
  const rows = (src.match(/\bid: "[a-z0-9-]+"/g) ?? []).length;
  const apple = (src.match(/\bapple:\s+"[^"]+"/g) ?? []).length;
  const android = (src.match(/\bandroid:\s+"[^"]+"/g) ?? []).length;
  console.log(`Matrix: ${rows} rows, ${apple} Apple + ${android} Health Connect identifiers.`);
  if (rows === 0 || apple !== rows || android !== rows) {
    problems.push(
      `MATRIX-INCOMPLETE ${rows} rows but ${apple} Apple / ${android} Android identifiers — every row needs both.`,
    );
  }
}

// ── Published artifacts: open datasets and the downloadable kit. These are
// files rather than pages, so nothing else notices when one goes missing or a
// generator writes an empty array — and a dataset that 404s on a page that
// cites it is worse than never publishing one.
{
  const DATASETS = [
    "fitness-apis-2026",
    "health-data-type-matrix-2026",
    "fitness-api-changes-2026",
    "fitness-api-glossary-2026",
    "healthkit-type-identifiers-2026",
  ];
  // Both directions. Listing files catches a DELETION (a dataset a page
  // still cites); scanning the directory catches an ADDITION that was never
  // added to this list — which is exactly how healthkit-type-identifiers-2026
  // shipped ungated. A list checked in only one direction is half a gate.
  {
    const onDisk = fs
      .readdirSync("public/datasets")
      .filter((f) => f.endsWith(".json"))
      // The manifests are infrastructure ABOUT the datasets (hashes, row
      // counts, rotation for /datasets/diff.json), not datasets themselves;
      // they get their own assertion below instead of a row in DATASETS.
      .filter((f) => !f.startsWith("manifest"))
      .map((f) => f.replace(/\.json$/, ""));
    for (const d of onDisk) {
      if (!DATASETS.includes(d)) {
        problems.push(`DATASET-UNGATED  public/datasets/${d}.json is published but not in qa's DATASETS list`);
      }
    }
  }

  for (const d of DATASETS) {
    const j = `public/datasets/${d}.json`;
    const c = `public/datasets/${d}.csv`;
    if (!fs.existsSync(j)) { problems.push(`DATASET-MISSING  ${j}`); continue; }
    if (!fs.existsSync(c)) problems.push(`DATASET-MISSING  ${c}`);
    try {
      const parsed = JSON.parse(fs.readFileSync(j, "utf8"));
      const rows = parsed.items?.length ?? 0;
      if (rows === 0) problems.push(`DATASET-EMPTY  ${d} has no items`);
      if (!parsed.license) problems.push(`DATASET-NO-LICENCE  ${d}`);
      // The CSV must carry the same number of data rows as the JSON.
      const lines = fs.readFileSync(c, "utf8").trim().split("\n").length - 1;
      if (lines !== rows) problems.push(`DATASET-CSV-ROWS  ${d}: ${lines} CSV rows vs ${rows} JSON items`);
    } catch {
      problems.push(`DATASET-INVALID  ${d}.json is not valid JSON`);
    }
  }

  const KIT = [
    "api-selection-checklist.md",
    "launch-compliance-checklist.md",
    "ble-fitness-uuid-cheat-sheet.md",
    "watch-app-preflight-checklist.md",
    "motion-sdk-scorecard.csv",
    "fitness-apis-2026.csv",
    "healthkit-type-identifiers-2026.csv",
    "fitness-api-decision-kit.zip",
  ];
  for (const f of KIT) {
    if (!fs.existsSync(`public/kit/${f}`)) problems.push(`KIT-MISSING  public/kit/${f}`);
    else if (fs.statSync(`public/kit/${f}`).size === 0) problems.push(`KIT-EMPTY  public/kit/${f} is zero bytes`);
  }
  for (const f of fs.readdirSync("public/kit")) {
    if (!KIT.includes(f)) problems.push(`KIT-UNGATED  public/kit/${f} is published but not in qa's KIT list`);
  }
  {
    const mPath = "public/datasets/manifest.json";
    if (!fs.existsSync(mPath)) {
      problems.push("DATASET-NO-MANIFEST  public/datasets/manifest.json missing — run `npm run datasets`");
    } else {
      const manifest = JSON.parse(fs.readFileSync(mPath, "utf8"));
      const inManifest = new Set(manifest.files.map((f) => f.file.replace(/\.(json|csv)$/, "")));
      for (const d of DATASETS) {
        if (!inManifest.has(d)) problems.push(`DATASET-UNMANIFESTED  ${d} not covered by manifest.json`);
      }
      // And the manifest must match the bytes actually on disk — a stale
      // manifest makes /datasets/diff.json lie about freshness.
      for (const f of manifest.files) {
        const full = `public/datasets/${f.file}`;
        if (!fs.existsSync(full) || fs.statSync(full).size !== f.bytes) {
          problems.push(`DATASET-MANIFEST-STALE  ${f.file} differs from manifest.json — rerun \`npm run datasets\``);
        }
      }
    }
  }
  console.log(`Artifacts: ${DATASETS.length} datasets, ${KIT.length} kit files.`);
}

// ── API directory. Its whole value is that it is derived: one page per
// product in the cost model, each listing the pages that actually cover it.
// A directory entry with no coverage is a thin page pretending to be an
// entity, which is the failure mode this gate exists to catch.
{
  const dir = htmls.map(routeOf).filter((r) => r.startsWith("/apis/"));
  const model = fs.existsSync("src/data/costModel.ts")
    ? fs.readFileSync("src/data/costModel.ts", "utf8")
    : "";
  const ids = [...model.matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
  // llm-apis is a category, not a product, and is deliberately excluded.
  const expected = ids.filter((i) => i !== "llm-apis");
  if (expected.length && dir.length !== expected.length) {
    problems.push(
      `APIS-COUNT  ${dir.length} directory pages vs ${expected.length} products in the cost model`,
    );
  }
  for (const id of expected) {
    if (!dir.includes(`/apis/${id}`)) problems.push(`APIS-MISSING  /apis/${id} was not built`);
  }
  let thin = 0;
  for (const h of htmls) {
    const r = routeOf(h);
    if (!r.startsWith("/apis/")) continue;
    const html = fs.readFileSync(h, "utf8");
    if (!html.includes("Everything on this site about")) {
      thin++;
      problems.push(`APIS-NO-COVERAGE  ${r} lists no pages covering it`);
    }
    if (!html.includes('"SoftwareApplication"')) problems.push(`APIS-NO-ENTITY  ${r}`);
  }
  console.log(`Directory: ${dir.length} product pages, ${thin} with no coverage.`);
}

// ── GEO invariants (ops/GEO.md). These protect machine-citability: if a new
// cluster ships without llms.txt wiring or the /md mirrors break, LLMs lose
// their clean path to us and nothing else would notice.
{
  const readBody = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
  const llms = readBody(".next/server/app/llms.txt.body");
  const robotsTxt = readBody(".next/server/app/robots.txt.body");
  const answersRaw = readBody(".next/server/app/answers.json.body");
  const changesFeed = readBody(".next/server/app/changes.xml.body");
  const icsFeed = readBody(".next/server/app/changes/calendar.ics.body");

  // Which top-level dirs are clusters? Exactly those mirrored under /md.
  const mdRoot = ".next/server/app/md";
  const mdTops = fs.existsSync(mdRoot)
    ? fs
        .readdirSync(mdRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith("["))
        .map((e) => e.name)
    : [];
  // The blog has markdown mirrors but is NOT a cluster: it has no ClusterEntry
  // data, no per-cluster RSS feed, and no answers.json spoke records. It must
  // still meet the same GEO bar as a spoke, so the two sets are separated
  // rather than the blog being waved through.
  const clusterTops = mdTops.filter((n) => n !== "blog");
  const geoTops = mdTops;
  if (clusterTops.length === 0) problems.push("GEO-NO-MD-MIRRORS  /md build output missing entirely");

  const mirrorFiles = [];
  for (const top of geoTops) {
    for (const f of fs.readdirSync(path.join(mdRoot, top))) {
      if (f.endsWith(".body")) mirrorFiles.push(path.join(mdRoot, top, f));
    }
  }
  const hubMirrors = fs.existsSync(mdRoot)
    ? fs.readdirSync(mdRoot).filter((f) => f.endsWith(".body"))
    : [];
  const spokes = htmls
    .map(routeOf)
    .filter((r) => { const seg = r.split("/").filter(Boolean); return seg.length === 2 && geoTops.includes(seg[0]); });
  // answers.json carries one record per cluster spoke; blog posts are a
  // separate collection in that document and must not be counted here.
  const clusterSpokes = spokes.filter((r) => clusterTops.includes(r.split("/").filter(Boolean)[0]));
  if (mirrorFiles.length !== spokes.length) {
    problems.push(`GEO-MIRROR-COUNT  ${mirrorFiles.length} /md spoke mirrors vs ${spokes.length} spoke pages — every spoke needs its markdown mirror`);
  }
  // One markdown index per cluster, plus the site index.
  const expectedHubMirrors = geoTops.length + 1;
  if (hubMirrors.length !== expectedHubMirrors) {
    problems.push(`GEO-HUB-MIRRORS  ${hubMirrors.length} cluster/index markdown mirrors, expected ${expectedHubMirrors} (one per cluster + /index.md)`);
  }

  // Every markdown mirror must open with YAML front matter carrying the
  // canonical URL — that header is what a parser reads instead of prose.
  for (const f of mirrorFiles) {
    const body = fs.readFileSync(f, "utf8");
    if (!body.startsWith("---\n")) {
      problems.push(`GEO-MD-FRONTMATTER  ${f.replace(mdRoot + "/", "")} does not start with YAML front matter`);
    } else if (!/^canonical: "https:\/\//m.test(body)) {
      problems.push(`GEO-MD-CANONICAL  ${f.replace(mdRoot + "/", "")} front matter has no canonical URL`);
    }
  }

  // next.config's rewrite list is a hand-maintained copy of the cluster set
  // (it cannot import the TS data modules). Assert it matches reality, or the
  // spec-conventional /<cluster>/<slug>.md addresses silently 404.
  const nextConfig = fs.existsSync("next.config.ts") ? fs.readFileSync("next.config.ts", "utf8") : "";
  for (const c of clusterTops) {
    if (!new RegExp(`"${c}"`).test(nextConfig)) {
      problems.push(`GEO-MD-REWRITE  cluster "${c}" missing from next.config CLUSTERS — /${c}/<slug>.md will 404`);
    }
  }

  // ── Link headers: the HTTP twin of the <link> tags. Header rules in
  // next.config match the path AS REQUESTED, before the rewrite to /md/*, so
  // a loose `/fix/:slug` also matched `/fix/x.md` and every markdown mirror
  // advertised `/fix/x.md.md` — a 404 — as its own alternate. The rules are
  // read from the built routes-manifest (what the server actually runs) and
  // replayed the way the server applies them: every matching rule in order,
  // a later value for the same key replacing an earlier one, `:param`
  // substituted from the match.
  {
    const SITE = "https://aifitnessapi.com";
    let rm = null;
    try {
      rm = JSON.parse(fs.readFileSync(".next/routes-manifest.json", "utf8"));
    } catch {
      problems.push("GEO-ALT-HEADER  .next/routes-manifest.json missing or unreadable — header rules cannot be checked");
    }
    if (rm) {
      const flags = rm.caseSensitive ? "" : "i";
      const rules = (rm.headers ?? []).map((h) => ({
        re: new RegExp(h.regex, flags),
        params: [...h.source.matchAll(/:([A-Za-z_]\w*)/g)].map((m) => m[1]),
        link: (h.headers ?? []).filter((x) => x.key.toLowerCase() === "link").map((x) => x.value),
      }));
      /** Every rule that sets Link on `p`, with its value as the server sends it. */
      const linkRulesFor = (p) => {
        const out = [];
        for (const r of rules) {
          const m = r.re.exec(p);
          if (!m || r.link.length === 0) continue;
          for (let v of r.link) {
            r.params.forEach((name, i) => {
              v = v.replace(new RegExp(`:${name}\\b`, "g"), m[i + 1] ?? "");
            });
            out.push(v);
          }
        }
        return out;
      };

      // Every address a markdown mirror answers at: the conventional .md URL
      // and the /md/* path it rewrites to. The mirror route sends its own Link
      // (canonical + describedby); a config rule that matches here either
      // advertises a .md.md alternate or, because config headers are set
      // first, silently replaces the mirror's canonical.
      const mdAddresses = ["/index.md", "/md", "/md/index"];
      for (const top of geoTops) mdAddresses.push(`/${top}.md`, `/md/${top}`);
      for (const r of spokes) mdAddresses.push(`${r}.md`, `/md${r}`);
      for (const p of mdAddresses) {
        for (const v of linkRulesFor(p)) {
          if (/rel="alternate"/.test(v)) {
            problems.push(`GEO-MD-ALT-LOOP  a next.config Link rule matches ${p} and advertises ${(/<([^>]*)>;\s*rel="alternate"/.exec(v) ?? [])[1]} as its alternate`);
          } else {
            problems.push(`GEO-MD-LINK-SHADOWED  a next.config Link rule matches ${p}, replacing the mirror's own canonical Link header`);
          }
        }
      }

      // And the HTML side still has what the rules exist for: each spoke's
      // header names its own single-.md mirror plus llms.txt, and a hub or
      // the homepage at least names llms.txt. A slug with a character the
      // rule's class refuses would otherwise lose its alternate silently.
      const effective = (p) => linkRulesFor(p).at(-1) ?? "";
      for (const r of spokes) {
        const v = effective(r);
        if (!v.includes(`<${SITE}${r}.md>; rel="alternate"`) || !v.includes('rel="describedby"')) {
          problems.push(`GEO-ALT-HEADER  ${r} response Link header lacks <${r}.md> rel=alternate or describedby: "${v}"`);
        }
      }
      for (const r of ["/", ...geoTops.map((t) => `/${t}`)]) {
        if (!effective(r).includes('rel="describedby"')) {
          problems.push(`GEO-ALT-HEADER  ${r} response carries no describedby Link header`);
        }
      }
    }

    // The mirror's own header: one Link, canonical first, naming the same URL
    // as its front matter and as the HTML page's <link rel=canonical>. URLs
    // are compared after URL normalisation, so the bare origin and the origin
    // with "/" are one value (Next renders the homepage canonical without the
    // slash; the header carries it with one).
    const norm = (u) => {
      try { return new URL(u).href; } catch { return u; }
    };
    const metaFiles = [path.join(mdRoot, "index.meta")];
    for (const top of geoTops) {
      metaFiles.push(path.join(mdRoot, `${top}.meta`));
      for (const f of fs.readdirSync(path.join(mdRoot, top))) {
        if (f.endsWith(".meta")) metaFiles.push(path.join(mdRoot, top, f));
      }
    }
    const linkRe = new RegExp(
      `^<(${SITE.replace(/[.]/g, "\\.")}[^>]*)>; rel="canonical", <${SITE.replace(/[.]/g, "\\.")}/llms\\.txt>; rel="describedby"; type="text/plain"$`,
    );
    for (const mf of metaFiles) {
      const rel = mf.slice(mdRoot.length + 1).replace(/\.meta$/, "");
      let link;
      try {
        link = JSON.parse(fs.readFileSync(mf, "utf8")).headers?.link;
      } catch {
        problems.push(`GEO-MD-LINK-CANONICAL  /md/${rel} has no readable .meta`);
        continue;
      }
      const m = typeof link === "string" ? linkRe.exec(link) : null;
      if (!m) {
        problems.push(`GEO-MD-LINK-CANONICAL  /md/${rel} Link header is not canonical + describedby: ${JSON.stringify(link)}`);
        continue;
      }
      const body = readBody(mf.replace(/\.meta$/, ".body")) ?? "";
      const fm = /^canonical: "([^"]+)"/m.exec(body)?.[1];
      if (!fm || norm(fm) !== norm(m[1])) {
        problems.push(`GEO-MD-LINK-CANONICAL  /md/${rel} header canonical ${m[1]} differs from its front matter ${fm}`);
      }
      const page = rel === "index" ? "/" : `/${rel}`;
      const pageFile = htmls.find((h) => routeOf(h) === page);
      const htmlCanon = pageFile ? canonicalOf(fs.readFileSync(pageFile, "utf8")) : null;
      if (!htmlCanon || norm(decode(htmlCanon)) !== norm(m[1])) {
        problems.push(`GEO-MD-LINK-CANONICAL  /md/${rel} header canonical ${m[1]} differs from ${page}'s rel=canonical ${htmlCanon}`);
      }
    }
  }

  if (llms === null) problems.push("GEO-NO-LLMS  llms.txt missing from build output");
  else {
    for (const r of spokes) {
      if (!llms.includes(`aifitnessapi.com${r})`)) problems.push(`GEO-LLMS-MISSING  ${r} not listed in llms.txt`);
    }
    for (const surface of ["/answers.json", "/changes.xml", "/llms-full.txt"]) {
      if (!llms.includes(surface)) problems.push(`GEO-LLMS-SURFACE  ${surface} not advertised in llms.txt`);
    }
  }

  if (robotsTxt === null) problems.push("GEO-NO-ROBOTS  robots.txt missing from build output");
  else {
    const required = [
      "GPTBot", "OAI-SearchBot", "ChatGPT-User",
      "ClaudeBot", "Claude-User", "Claude-SearchBot",
      "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot",
    ];
    for (const ua of required) {
      if (!robotsTxt.includes(ua)) problems.push(`GEO-ROBOTS  ${ua} not explicitly allowed in robots.txt`);
    }
    for (const surface of ["/llms.txt", "/answers.json", "/changes.xml"]) {
      if (!robotsTxt.includes(surface)) problems.push(`GEO-ROBOTS-SURFACE  ${surface} not advertised in robots.txt`);
    }
    // The canonical host is set in one place, the hosting provider's domain
    // settings (see the redirects note in next.config.ts). A Host: line here
    // is a second, unchecked statement of it.
    if (/^Host:/im.test(robotsTxt)) problems.push("GEO-ROBOTS-HOST  robots.txt carries a Host: line");
    // A crawler obeys only the group that names it, so a rule added to the
    // `*` group alone never reaches the AI crawlers named above (and the
    // reverse). Every group must carry the identical rule list. A group is a
    // run of User-agent lines followed by its Allow/Disallow lines.
    {
      const groups = [];
      let cur = null;
      for (const raw of robotsTxt.split(/\r?\n/)) {
        const line = raw.replace(/#.*/, "").trim();
        if (!line) continue;
        const [, field, value] = /^([A-Za-z-]+):\s*(.*)$/.exec(line) ?? [];
        if (!field) continue;
        const f = field.toLowerCase();
        if (f === "user-agent") {
          if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
          cur.agents.push(value);
        } else if ((f === "allow" || f === "disallow") && cur) {
          cur.rules.push(`${f}: ${value}`);
        }
      }
      const star = groups.find((g) => g.agents.includes("*"));
      if (!star) problems.push("GEO-ROBOTS-UNIFORM  robots.txt has no User-agent: * group");
      else {
        const want = star.rules.join("\n");
        for (const g of groups) {
          if (g.rules.join("\n") !== want) {
            problems.push(`GEO-ROBOTS-UNIFORM  group "${g.agents[0]}" carries different rules from the * group`);
          }
        }
      }
    }
  }

  // The structured answer index: one record per spoke, each with the fields a
  // citing agent needs.
  if (answersRaw === null) problems.push("GEO-NO-ANSWERS  answers.json missing from build output");
  else {
    let parsed = null;
    try { parsed = JSON.parse(answersRaw); } catch { problems.push("GEO-ANSWERS-INVALID  answers.json is not valid JSON"); }
    if (parsed) {
      if (!Array.isArray(parsed.answers) || parsed.answers.length !== clusterSpokes.length) {
        problems.push(`GEO-ANSWERS-COUNT  answers.json has ${parsed.answers?.length ?? 0} records vs ${clusterSpokes.length} spokes`);
      }
      const bad = (parsed.answers ?? []).filter(
        (a) => !a.question || !a.answer || !a.url || !a.markdown || !a.last_reviewed,
      );
      if (bad.length) problems.push(`GEO-ANSWERS-FIELDS  ${bad.length} answers.json records missing required fields`);
    }
  }

  if (changesFeed === null) problems.push("GEO-NO-CHANGES-FEED  changes.xml missing from build output");
  else if (!changesFeed.includes("<item>")) problems.push("GEO-CHANGES-FEED-EMPTY  changes.xml has no items");

  // The calendar is a second consumer of the same dated dataset, so it can
  // silently lose events the RSS feed keeps. Gate on parity, not existence:
  // one VEVENT per change entry, and the honesty prefix preserved for every
  // event whose date is a reported month rather than a confirmed day.
  // ── Reference callouts ────────────────────────────────────────────────
  // ReferenceCallout maps specific guide paths to the generated references.
  // A slug rename would leave the map pointing at nothing and the callout
  // would silently stop rendering, so the count is asserted.
  {
    const rendered = htmls.filter((h) => fs.readFileSync(h, "utf8").includes("data-reference-callout")).length;
    const EXPECTED = 4;
    if (rendered !== EXPECTED) {
      problems.push(
        `REFERENCE-CALLOUT  ${rendered} pages render the reference callout, expected ${EXPECTED} — a mapped path was probably renamed`,
      );
    }
  }

  // ── Build-guide stacks ────────────────────────────────────────────────
  // AppStack joins an authored category→types map against the generated
  // identifier dataset and the API directory. A renamed identifier or a
  // retired product id makes the join drop rows silently, and the page still
  // renders — just with less in it than it claims. Count the blocks.
  {
    const rendered = htmls.filter((h) => fs.readFileSync(h, "utf8").includes("data-app-stack")).length;
    const EXPECTED = 23;
    if (rendered !== EXPECTED) {
      problems.push(`APP-STACK      ${rendered} /build guides render the stack block, expected ${EXPECTED}`);
    } else {
      console.log(`Build stacks: ${rendered} /build guides carry the derived type + API stack.`);
    }
  }

  // ── Blog: frontmatter, placements, mirrors ────────────────────────────
  // The blog is the one content surface not generated from a data module, so
  // nothing else stops a post shipping with a title that overflows the tab, a
  // missing FAQ block, or a placement pointing at a slug that was renamed.
  {
    const POSTS_DIR = path.join(process.cwd(), "content", "posts");
    const files = fs.existsSync(POSTS_DIR)
      ? fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f))
      : [];
    const posts = [];
    for (const f of files) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
      if (!m) {
        problems.push(`POST-FRONTMATTER  ${f} has no YAML front matter`);
        continue;
      }
      const fm = m[1];
      const scalar = (k) => {
        const r = new RegExp(`^${k}:\\s*(.*)$`, "m").exec(fm);
        if (!r) return null;
        return r[1].trim().replace(/^["']|["']$/g, "");
      };
      const slug = f.replace(/\.mdx?$/, "");
      const title = scalar("title");
      const desc = scalar("description");
      const draft = scalar("draft") === "true";
      // Front-matter caps are tighter than the rendered ones on purpose: the
      // layout appends " · AIFitnessAPI", so a 45-char title is the largest
      // that still fits the 60-char <title> budget. Catching it here names the
      // file; catching it in the rendered HTML only names the route.
      if (!title) problems.push(`POST-NO-TITLE     ${f}`);
      else if (title.length > 45)
        problems.push(`POST-TITLE-${title.length}    ${f}: "${title}" (max 45; the layout appends " · ${"AIFitnessAPI"}")`);
      if (!desc) problems.push(`POST-NO-DESC      ${f}`);
      else if (desc.length > 155) problems.push(`POST-DESC-${desc.length}     ${f}`);
      if (!/^date:/m.test(fm)) problems.push(`POST-NO-DATE      ${f}`);
      if (!/^updated:/m.test(fm)) problems.push(`POST-NO-UPDATED   ${f}`);
      const faqCount = (fm.match(/^\s+- q:/gm) ?? []).length;
      posts.push({ slug, draft, faqCount, title });
    }
    const live = posts.filter((p) => !p.draft);

    // Every live post must render, carry its FAQ block, and have a markdown
    // mirror. A post that silently stops building is invisible, not broken.
    for (const p of live) {
      if (!valid.has(`/blog/${p.slug}`)) problems.push(`POST-NOT-BUILT    /blog/${p.slug}`);
    }
    const withFaq = htmls.filter((h) => fs.readFileSync(h, "utf8").includes("data-post-faq")).length;
    const expectFaq = live.filter((p) => p.faqCount > 0).length;
    if (withFaq !== expectFaq)
      problems.push(`POST-FAQ-RENDER   ${withFaq} posts render the FAQ block, expected ${expectFaq}`);

    // Placements: both halves, because either rots silently.
    // Read the placement map straight out of the component source. Parsing
    // the authored map rather than counting rendered blocks is what makes a
    // renamed slug an error instead of a silently missing section.
    const placements = [];
    {
      const src = fs.readFileSync(path.join(process.cwd(), "src/components/PostLinks.tsx"), "utf8");
      const body = /const PLACEMENTS: Record<string, string\[\]> = \{([\s\S]*?)\n\};/.exec(src);
      if (!body) problems.push("POST-PLACE-PARSE  could not read PLACEMENTS from PostLinks.tsx");
      else {
        for (const m of body[1].matchAll(/"([a-z0-9-]+)":\s*\[([\s\S]*?)\]/g)) {
          const paths = [...m[2].matchAll(/"(\/[^"]+)"/g)].map((x) => x[1]);
          placements.push({ slug: m[1], paths });
        }
      }
    }
    const liveSlugs = new Set(live.map((p) => p.slug));
    let placedPaths = 0;
    for (const { slug, paths } of placements) {
      if (!liveSlugs.has(slug)) problems.push(`POST-PLACE-SLUG   PostLinks references /blog/${slug}, which is not a live post`);
      for (const pth of paths) {
        placedPaths++;
        if (!valid.has(pth) || notFoundSet.has(pth))
          problems.push(`POST-PLACE-PATH   PostLinks places a post on ${pth}, which does not exist`);
      }
    }
    const rendered = htmls.filter((h) => fs.readFileSync(h, "utf8").includes("data-post-links")).length;
    const expectPaths = new Set(placements.flatMap((x) => x.paths)).size;
    if (placements.length && rendered !== expectPaths)
      problems.push(`POST-LINKS        ${rendered} pages render the blog block, expected ${expectPaths}`);

    if (live.length) {
      console.log(
        `Blog: ${live.length} posts, ${live.filter((p) => p.faqCount > 0).length} with FAQ blocks, surfaced on ${expectPaths} reference pages.`,
      );
    }
  }

  // ── Question indexes ──────────────────────────────────────────────────
  // /questions/<cluster> is the only surface that lists the site's FAQ
  // anchors, and it is built entirely out of deep links. Two ways it rots
  // silently: a cluster stops generating its index (a whole topic quietly
  // disappears from the list), and a page renumbers or drops an FAQ (the
  // link still renders and still resolves — it just lands at the top of the
  // page instead of on the answer, which no crawl or link check would flag).
  {
    const questionPages = htmls
      .map((h) => [routeOf(h), h])
      .filter(([r]) => /^\/questions\/[^/]+$/.test(r));
    if (questionPages.length !== clusterTops.length) {
      problems.push(
        `QUESTIONS-HUBS  ${questionPages.length} /questions/<cluster> pages built, expected ${clusterTops.length} (one per populated cluster)`,
      );
    }

    // Collect the deep links first, deduped, then resolve each target page
    // once — the same spoke is linked once per FAQ it answers, and re-reading
    // its HTML for every one of them would read the whole site many times.
    const links = new Map();
    for (const [route, file] of questionPages) {
      const html = fs.readFileSync(file, "utf8");
      for (const m of html.matchAll(/href="(\/[a-z0-9/-]+)#(faq-\d+)"/g)) {
        const key = `${m[1]}#${m[2]}`;
        if (!links.has(key)) links.set(key, { target: m[1], anchor: m[2], from: route });
      }
    }
    const anchorsOf = new Map();
    for (const { target, anchor, from } of links.values()) {
      if (!anchorsOf.has(target)) {
        const file = htmls.find((h) => routeOf(h) === target);
        const set = new Set();
        if (file) {
          for (const m of fs.readFileSync(file, "utf8").matchAll(/id="(faq-\d+)"/g)) set.add(m[1]);
        }
        anchorsOf.set(target, set);
      }
      if (!anchorsOf.get(target).has(anchor)) {
        problems.push(`QUESTIONS-DEAD-ANCHOR ${from} -> ${target}#${anchor}`);
      }
    }
    if (questionPages.length) {
      console.log(
        `Question indexes: ${questionPages.length} cluster pages, ${links.size} deep links resolved against ${anchorsOf.size} pages.`,
      );
    }
  }

  // ── HealthKit group pages ─────────────────────────────────────────────
  // The twelve /healthkit/<group> pages partition the 240-identifier
  // dataset — every identifier on exactly one page. A mapping bug drops
  // identifiers from every page at once and nothing else notices: each page
  // still builds, still reads fine, just with fewer rows than it claims. So
  // count the id markers in the derived tables and assert the partition is
  // whole. While the set is still being written the count would fail for the
  // wrong reason, so an incomplete set reports as incomplete instead.
  {
    const EXPECTED_GROUPS = 12;
    const EXPECTED_IDS = 240;
    const groupPages = htmls.filter((h) => /^\/healthkit\/[^/]+$/.test(routeOf(h)));
    if (groupPages.length > 0) {
      const ids = new Set();
      for (const h of groupPages) {
        const html = fs.readFileSync(h, "utf8");
        // Row ids on these pages exist only in the derived tables (TOC and
        // section anchors use #overview-style names), so a whole-file scan is
        // exact. Region-slicing to the first </table> undercounted pages whose
        // section holds one table per Apple subgroup.
        for (const m of html.matchAll(/id="(id-[A-Za-z0-9._-]+)"/g)) ids.add(m[1].toLowerCase());
      }
      if (groupPages.length === EXPECTED_GROUPS) {
        if (ids.size !== EXPECTED_IDS) {
          problems.push(
            `HK-GROUP-COVERAGE  ${ids.size} identifiers across group pages, expected ${EXPECTED_IDS}`,
          );
        } else {
          console.log(`HealthKit groups: ${EXPECTED_GROUPS} pages carrying all ${ids.size} identifiers.`);
        }
      } else {
        problems.push(
          `HK-GROUP-PARTIAL  only ${groupPages.length} of ${EXPECTED_GROUPS} group pages built`,
        );
      }
    }
  }

  // ── Tools ─────────────────────────────────────────────────────────────
  // Every tool page carries data-tool. The count is asserted both ways: a
  // tool silently dropping out of the build matters exactly because tools
  // have no data file whose absence would fail anything else.
  {
    const rendered = htmls.filter((h) => {
      const r = routeOf(h);
      return (r === "/tools" || r.startsWith("/tools/")) && fs.readFileSync(h, "utf8").includes("data-tool");
    }).length;
    const EXPECTED_TOOLS = 7; // hub + 6 tools
    if (rendered !== EXPECTED_TOOLS) {
      problems.push(`TOOLS          ${rendered} /tools pages carry data-tool, expected ${EXPECTED_TOOLS}`);
    } else {
      console.log(`Tools: ${EXPECTED_TOOLS - 1} interactive tools + hub render.`);
    }
  }

  // ── Architecture diagrams ─────────────────────────────────────────────
  // Every /architecture spoke renders its hand-drawn mechanism figure, and
  // nothing outside the cluster does. A renamed slug drops its diagram
  // silently otherwise — the page still builds, just poorer.
  {
    const archPages = htmls.filter((h) => /^\/architecture\/[^/]+$/.test(routeOf(h)) && !notFoundSet.has(routeOf(h)));
    const withFig = archPages.filter((h) => fs.readFileSync(h, "utf8").includes("data-arch-diagram")).length;
    if (withFig !== archPages.length) {
      problems.push(`ARCH-DIAGRAM   ${withFig} of ${archPages.length} /architecture pages render their diagram`);
    }
    const outside = htmls.filter((h) => !routeOf(h).startsWith("/architecture") && fs.readFileSync(h, "utf8").includes("data-arch-diagram")).length;
    if (outside > 0) problems.push(`ARCH-DIAGRAM-LEAK  ${outside} page(s) outside /architecture carry the diagram marker`);
    if (withFig === archPages.length && archPages.length > 0) console.log(`Diagrams: all ${withFig} /architecture pages carry their mechanism figure.`);
  }

  // ── Disclosed first-party links ───────────────────────────────────────
  // KinestexNote maps specific paths to a disclosed link to the site's
  // funder. Two things are asserted, and the second matters more than the
  // first: the count (a renamed slug would silently drop the link), and that
  // EVERY instance carries the disclosure. An undisclosed link to the funder
  // on a site that presents itself as neutral is the one failure that would
  // discredit everything else here, so it fails the build rather than
  // relying on the component being written correctly.
  {
    const withNote = htmls.filter((h) => fs.readFileSync(h, "utf8").includes("data-kinestex-note"));
    const EXPECTED = 13;
    if (withNote.length !== EXPECTED) {
      problems.push(
        `KINESTEX-NOTE  ${withNote.length} pages render the first-party link, expected ${EXPECTED} — a mapped path was probably renamed`,
      );
    }
    for (const h of withNote) {
      const html = fs.readFileSync(h, "utf8");
      if (!/Disclosure:/.test(html)) {
        problems.push(`KINESTEX-UNDISCLOSED  ${routeOf(h)} links to the funder without the disclosure`);
      }
    }
  }

  // ── Content freshness ─────────────────────────────────────────────────
  // Informational, deliberately. This site's claim is that it tracks a moving
  // ecosystem, so the age of its verification stamps is a first-class quality
  // signal — but re-verifying needs vendor documentation the build
  // environment cannot reach, so a hard failure here would be unsatisfiable,
  // and an unsatisfiable gate is one people learn to bypass. It prints, and
  // `npm run stale` ranks the queue.
  //
  // Ages are whole days between UTC midnights, and "due" means 90 days or
  // older — the same arithmetic as <ContentAge> (which flags a page at
  // day 90) and `npm run stale`. Measured from the current instant with `> 90`
  // this line could count a page as fine on the day the page itself started
  // telling readers it was due a re-check.
  {
    const STALE_AFTER_DAYS = 90;
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const ages = [];
    for (const f of fs.readdirSync("src/data").filter((n) => n.endsWith(".entries.ts"))) {
      const src = fs.readFileSync(`src/data/${f}`, "utf8");
      for (const m of src.matchAll(/"updated":\s*"(\d{4}-\d{2}-\d{2})"/g)) {
        ages.push(Math.round((todayUtc - Date.parse(`${m[1]}T00:00:00Z`)) / 86400000));
      }
    }
    if (ages.length) {
      ages.sort((a, b) => a - b);
      const due = ages.filter((d) => d >= STALE_AFTER_DAYS).length;
      const median = ages[Math.floor(ages.length / 2)];
      console.log(
        `Freshness: ${ages.length} entries, median ${median}d since verification, oldest ${ages.at(-1)}d` +
          (due ? `, ${due} at ${STALE_AFTER_DAYS}d or older (run \`npm run stale\`)` : ""),
      );
    }
  }

  // ── Derived metric facts ──────────────────────────────────────────────
  // The /data guides render their HealthKit facts from a join between
  // matrix.ts and the generated identifier dataset. If a matrix cell is
  // edited to a name the dataset does not contain, the join yields nothing
  // and the block silently disappears — the page still builds, still reads
  // fine, and quietly loses the facts it was enriched with. Count them.
  {
    const EXPECTED_METRIC_FACTS = 12;
    const withFacts = htmls
      .map((h) => [routeOf(h), fs.readFileSync(h, "utf8")])
      .filter(([r, html]) => r.startsWith("/data/") && html.includes("data-metric-facts"));
    if (withFacts.length < EXPECTED_METRIC_FACTS) {
      const have = new Set(withFacts.map(([r]) => r));
      const missing = htmls
        .map(routeOf)
        .filter((r) => r.startsWith("/data/") && r !== "/data" && !have.has(r));
      problems.push(
        `METRIC-FACTS   only ${withFacts.length} /data guides render the derived facts block ` +
          `(expected ${EXPECTED_METRIC_FACTS}) — missing: ${missing.join(", ")}`,
      );
    } else {
      console.log(`Metric facts: ${withFacts.length} /data guides carry the derived HealthKit block.`);
    }
  }

  // ── Citation anchors ──────────────────────────────────────────────────
  // /answers.json publishes each reference fact at a fragment URL and tells
  // machine readers to cite THAT rather than the page. A fragment that stops
  // resolving turns every citation already made into a broken one, and
  // nothing else in the build would notice — the JSON stays valid and the
  // page still renders. So every published id is resolved against the actual
  // built HTML of the page it points into.
  {
    const answersBody = readBody(".next/server/app/answers.json.body");
    if (answersBody === null) {
      problems.push("FACTS-NO-ANSWERS  answers.json missing from build output");
    } else {
      let parsedAnswers = null;
      try {
        parsedAnswers = JSON.parse(answersBody);
      } catch {
        problems.push("FACTS-ANSWERS-INVALID  answers.json is not valid JSON");
      }
      const groups = parsedAnswers?.facts;
      if (parsedAnswers && !groups) {
        problems.push("FACTS-MISSING  answers.json has no `facts` section");
      } else if (groups) {
        let checked = 0;
        for (const [name, group] of Object.entries(groups)) {
          if (!group || !Array.isArray(group.items)) continue;
          for (const item of group.items) {
            const [pageUrl, fragment] = String(item.id ?? "").split("#");
            if (!fragment) {
              problems.push(`FACTS-NO-FRAGMENT  ${name}: "${item.id}" has no fragment`);
              continue;
            }
            const rel = pageUrl.replace(/^https?:\/\/[^/]+/, "") || "/";
            const file = htmls.find((h) => routeOf(h) === rel);
            if (!file) {
              problems.push(`FACTS-NO-PAGE  ${name}: ${rel} is not in the build output`);
              continue;
            }
            const html = fs.readFileSync(file, "utf8");
            if (!html.includes(`id="${fragment}"`)) {
              problems.push(`FACTS-DEAD-ANCHOR  ${name}: ${rel}#${fragment} does not resolve`);
              continue;
            }
            checked++;
          }
        }
        console.log(`Citation anchors: ${checked} published fact ids resolve.`);
      }
    }
  }

  if (icsFeed === null) {
    problems.push("ICS-MISSING  changes/calendar.ics missing from build output");
  } else {
    const vevents = (icsFeed.match(/BEGIN:VEVENT/g) || []).length;
    const items = (changesFeed?.match(/<item>/g) || []).length;
    if (vevents === 0) problems.push("ICS-EMPTY  changes/calendar.ics has no VEVENTs");
    else if (items && vevents !== items) {
      problems.push(`ICS-PARITY  calendar.ics has ${vevents} VEVENTs but changes.xml has ${items} items`);
    }
    if (!icsFeed.includes("END:VCALENDAR")) problems.push("ICS-UNTERMINATED  changes/calendar.ics has no END:VCALENDAR");
    // Every line must be CRLF-terminated and within the 75-octet fold limit.
    const overlong = icsFeed.split("\r\n").filter((l) => Buffer.byteLength(l, "utf8") > 75);
    if (overlong.length) problems.push(`ICS-FOLD  ${overlong.length} line(s) exceed the 75-octet limit`);
    if (!icsFeed.includes("\r\n")) problems.push("ICS-LINE-ENDINGS  changes/calendar.ics is not CRLF-terminated");
  }

  // Posts that opt out of the FAQ requirement. Named in the run output so the
  // exemption is visible every build rather than discovered later.
  const nonReferencePosts = [];
  {
    const dir = path.join(process.cwd(), "content", "posts");
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
        if (fm && /^reference:\s*false\s*$/m.test(fm[1])) {
          nonReferencePosts.push(`/blog/${f.replace(/\.mdx?$/, "")}`);
        }
      }
    }
    if (nonReferencePosts.length > 2) {
      problems.push(`POST-EXEMPT-CREEP  ${nonReferencePosts.length} posts set reference:false — the FAQ exemption is meant for announcements, not a default`);
    }
    if (nonReferencePosts.length) {
      console.log(`Blog exemptions: ${nonReferencePosts.join(", ")} carry reference:false (no FAQ required).`);
    }
  }

  for (const h of htmls) {
    const r = routeOf(h);
    const seg = r.split("/").filter(Boolean);
    const isSpoke = seg.length === 2 && geoTops.includes(seg[0]);
    const isHub = seg.length === 1 && geoTops.includes(seg[0]);
    if (!isSpoke && !isHub) continue;
    const html = fs.readFileSync(h, "utf8");

    // Discovery: the markdown mirror and the llms.txt that documents it.
    if (!/rel="alternate"[^>]*type="text\/markdown"|type="text\/markdown"[^>]*rel="alternate"/.test(html)) {
      problems.push(`GEO-NO-MD-ALT  ${r} has no rel=alternate text/markdown link`);
    }
    if (!html.includes('rel="describedby"')) problems.push(`GEO-NO-DESCRIBEDBY  ${r}`);

    if (isHub) {
      if (!html.includes('"CollectionPage"')) problems.push(`GEO-NO-COLLECTIONPAGE  ${r} hub has no CollectionPage/ItemList`);
      continue;
    }
    if (!html.includes('"FAQPage"') && !nonReferencePosts.includes(r)) {
      problems.push(`GEO-NO-FAQPAGE  ${r}`);
    }
    if (!html.includes("speakable")) problems.push(`GEO-NO-SPEAKABLE ${r}`);
    if (!html.includes('"TechArticle"')) problems.push(`GEO-NO-TECHARTICLE  ${r}`);
    // Individually addressable answers — an assistant should be able to deep
    // link the exact FAQ it quoted.
    if (html.includes('"FAQPage"') && !html.includes('id="faq-1"')) {
      problems.push(`GEO-NO-FAQ-ANCHOR  ${r} FAQ answers are not individually addressable`);
    }
  }

  // ── Hub coverage. A hub is hand-assembled in places (the /fix hub files
  // its released slugs into named groups), so a released spoke can build,
  // sit in llms.txt and the sitemap, and still be missing from the one page
  // that is meant to list everything in its section. That shipped: /fix
  // omitted healthkit-invalid-argument until a reader-facing audit noticed.
  // Every released spoke (built, not notFound) of every mirrored section —
  // the clusters and the blog, the same set the GEO checks above walk — must
  // be linked from its hub's built HTML. A link that carries a #fragment to
  // the spoke still counts; a hub that was not built at all fails too.
  {
    let linked = 0;
    for (const top of geoTops) {
      const hubFile = htmls.find((h) => routeOf(h) === `/${top}`);
      const released = spokes.filter((r) => r.split("/")[1] === top && !notFoundSet.has(r));
      if (!hubFile || notFoundSet.has(`/${top}`)) {
        problems.push(`HUB-LINK       /${top} hub was not built, so none of its ${released.length} released page(s) are listed`);
        continue;
      }
      const hrefs = new Set(
        [...fs.readFileSync(hubFile, "utf8").matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]),
      );
      for (const r of released) {
        if (hrefs.has(r)) linked++;
        else problems.push(`HUB-LINK       /${top} hub does not link its released page ${r}`);
      }
    }
    console.log(`Hub coverage: ${linked} released pages linked from their ${geoTops.length} section hubs.`);
  }

  // ── Discovery surfaces. Feeds, the search descriptor and the manifest are
  // invisible when they break: nothing on the site links to a broken feed in a
  // way a human would notice, and a reader whose reader stops updating just
  // stops reading. Assert they exist and parse.
  {
    const feedsDir = ".next/server/app/feeds";
    const feedFiles = fs.existsSync(feedsDir)
      ? fs.readdirSync(feedsDir).filter((f) => f.endsWith(".body"))
      : [];
    const populated = clusterTops.length;
    if (feedFiles.length !== populated) {
      problems.push(
        `FEED-COUNT  ${feedFiles.length} per-cluster RSS feeds vs ${populated} populated clusters`,
      );
    }
    for (const f of feedFiles) {
      const xml = fs.readFileSync(path.join(feedsDir, f), "utf8");
      if (!xml.includes("<item>")) problems.push(`FEED-EMPTY  /feeds/${f.replace(".body", "")}`);
      if (!xml.includes('rel="self"')) problems.push(`FEED-NO-SELF  /feeds/${f.replace(".body", "")}`);
      // A raw & in an RSS body breaks strict readers. Entities and CDATA are fine.
      const outsideCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
      if (/&(?!(amp|lt|gt|quot|apos|#\d+);)/.test(outsideCdata)) {
        problems.push(`FEED-UNESCAPED-AMP  /feeds/${f.replace(".body", "")}`);
      }
    }

    const jsonFeed = readBody(".next/server/app/feed.json.body");
    if (jsonFeed === null) problems.push("FEED-NO-JSON  feed.json missing from build output");
    else {
      try {
        const parsed = JSON.parse(jsonFeed);
        if (!parsed.version?.includes("jsonfeed.org")) problems.push("FEED-JSON-VERSION  feed.json has no JSON Feed version");
        if (!Array.isArray(parsed.items)) problems.push("FEED-JSON-ITEMS  feed.json has no items array");
      } catch {
        problems.push("FEED-JSON-INVALID  feed.json is not valid JSON");
      }
    }

    const opensearch = readBody(".next/server/app/opensearch.xml.body");
    if (opensearch === null) problems.push("NO-OPENSEARCH  opensearch.xml missing from build output");
    else if (!opensearch.includes("/search?q={searchTerms}")) {
      problems.push("OPENSEARCH-TARGET  descriptor does not point at the /search results page");
    }

    const manifest = readBody(".next/server/app/manifest.webmanifest.body");
    if (manifest === null) problems.push("NO-MANIFEST  manifest.webmanifest missing from build output");
    else {
      try {
        const parsed = JSON.parse(manifest);
        if (!parsed.name || !parsed.start_url || !Array.isArray(parsed.icons) || parsed.icons.length === 0) {
          problems.push("MANIFEST-FIELDS  manifest is missing name, start_url or icons");
        }
      } catch {
        problems.push("MANIFEST-INVALID  manifest.webmanifest is not valid JSON");
      }
    }
    console.log(
      `Discovery: ${feedFiles.length} cluster feeds; feed.json ${jsonFeed ? "ok" : "MISSING"}; ` +
        `opensearch ${opensearch ? "ok" : "MISSING"}; manifest ${manifest ? "ok" : "MISSING"}.`,
    );
  }

  console.log(
    `GEO: ${mirrorFiles.length} spoke + ${hubMirrors.length} index markdown mirrors; ` +
      `llms.txt ${llms ? "ok" : "MISSING"}; answers.json ${answersRaw ? "ok" : "MISSING"}; ` +
      `changes.xml ${changesFeed ? "ok" : "MISSING"}; ` +
      `calendar.ics ${icsFeed ? `${(icsFeed.match(/BEGIN:VEVENT/g) || []).length} events` : "MISSING"}; ` +
      `crawler allows ${robotsTxt ? "ok" : "MISSING"}.`,
  );
}

// ── First-party disclosure gate (ops/GEO.md). KinesteX funds this site; any
// page whose PROSE substantively features it must say so in the rendered
// output. Link labels and the RSC flight payload are stripped first so nav
// references (site index, prev/next, related cards) don't count — only body
// text does. Threshold: ≥3 prose mentions. If an innocent page trips this,
// the fix is adding a disclosure there — never raising the threshold.
{
  const disclosureRe =
    /funds th(?:is|e) site|funded by KinesteX|this (?:site|blog)(?:'|’|&#x27;|&#39;)s own (?:product|company)/i;
  for (const h of htmls) {
    const r = routeOf(h);
    const html = fs.readFileSync(h, "utf8");
    const prose = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, "");
    const mentions = (prose.match(/KinesteX/g) ?? []).length;
    if (mentions >= 3 && !disclosureRe.test(html)) {
      problems.push(`FIRSTPARTY     ${r} mentions KinesteX ${mentions}× in prose with no funding disclosure`);
    }
  }
}

// ── Hosting surface. Two ways a static site ends up doing unbounded work on
// demand, read from the manifests the server runs rather than from config
// source, so a default flipping in a Next upgrade is caught too.
{
  const readJson = (p) => {
    try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
  };

  // The image optimizer fetches, resizes and caches whatever URL it is
  // handed from any host its patterns allow, on our compute. Nothing here
  // uses next/image, so the endpoint must be off or allow no remote host.
  const im = readJson(".next/images-manifest.json");
  if (!im?.images) {
    problems.push("IMAGE-PROXY-OPEN  .next/images-manifest.json missing or unreadable — cannot show /_next/image is closed");
  } else if (im.images.unoptimized !== true) {
    const hosts = [
      ...(im.images.remotePatterns ?? []).map((p) => `${p.protocol ?? "*"}://${p.hostname}`),
      ...(im.images.domains ?? []),
    ];
    if (hosts.length) {
      problems.push(`IMAGE-PROXY-OPEN  /_next/image will fetch remote images from ${hosts.join(", ")}`);
    }
  }

  // Every dynamic route renders exactly the params it prerendered. With
  // fallback anything but false, an unknown slug is rendered on request —
  // and, under ISR, written to the cache — so any crawler or typo can mint
  // pages. A dynamic route missing from the prerender manifest altogether is
  // rendered on every request, which is the same hole from the other side.
  const pm = readJson(".next/prerender-manifest.json");
  const rmDyn = readJson(".next/routes-manifest.json")?.dynamicRoutes ?? [];
  if (!pm?.dynamicRoutes) {
    problems.push("DYNAMIC-FALLBACK  .next/prerender-manifest.json missing or has no dynamicRoutes");
  } else {
    for (const [r, v] of Object.entries(pm.dynamicRoutes)) {
      if (v.fallback !== false) {
        problems.push(`DYNAMIC-FALLBACK  ${r} has fallback ${JSON.stringify(v.fallback)} — unknown params render on demand (set dynamicParams = false)`);
      }
    }
    for (const { page } of rmDyn) {
      if (!(page in pm.dynamicRoutes)) {
        problems.push(`DYNAMIC-FALLBACK  ${page} is a dynamic route with no prerendered params — it renders on every request`);
      }
    }
  }
  console.log(
    `Hosting: image optimizer ${im?.images?.unoptimized === true ? "off" : "on"}; ` +
      `${Object.keys(pm?.dynamicRoutes ?? {}).length} dynamic routes, all checked for fallback:false.`,
  );
}

// ── Sitemap. lastmod is the one sitemap field a crawler still reads, and it
// is only worth reading if it agrees with the page: a row is held to the
// newest dateModified the page's own JSON-LD declares. A row with no such
// date on its page is not judged (an undated row is honest; a guessed one is
// not). Every row must resolve to a page that builds and does not 404.
{
  const SITE = "https://aifitnessapi.com";
  const sm = fs.existsSync(`${ROOT}/sitemap.xml.body`) ? fs.readFileSync(`${ROOT}/sitemap.xml.body`, "utf8") : null;
  if (sm === null) problems.push("SITEMAP-MISSING  sitemap.xml missing from build output");
  else {
    // changefreq and priority were dropped deliberately: neither was a fact
    // anyone kept true, and a field that is always "weekly" teaches a
    // crawler to ignore the file.
    if (/<changefreq>|<priority>/.test(sm)) {
      problems.push("SITEMAP-CHANGEFREQ  sitemap.xml carries <changefreq> or <priority>");
    }
    let rows = 0;
    let dated = 0;
    for (const [, u] of sm.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      rows++;
      const loc = /<loc>([^<]*)<\/loc>/.exec(u)?.[1] ?? "";
      const lastmod = /<lastmod>([^<]*)<\/lastmod>/.exec(u)?.[1];
      if (lastmod) dated++;
      const route = loc === SITE ? "/" : loc.startsWith(`${SITE}/`) ? loc.slice(SITE.length) : null;
      if (route === null || !valid.has(route) || notFoundSet.has(route)) {
        problems.push(`SITEMAP-NO-PAGE  ${loc} is listed but no built page answers it`);
        continue;
      }
      const declared = dateModifiedOf.get(route);
      if (declared && lastmod?.slice(0, 10) !== declared) {
        problems.push(`SITEMAP-LASTMOD  ${route}: lastmod ${lastmod ?? "(none)"} but the page declares dateModified ${declared}`);
      }
    }
    console.log(`Sitemap: ${rows} rows, ${dated} with lastmod; every row whose page declares dateModified checked against it.`);
  }
}

// ── The 404. Next injects its own robots noindex on every not-found render;
// a second robots meta from metadata makes two directives a crawler has to
// reconcile, and the root layout's `index, follow` was exactly that. A 404
// has no URL of its own, so it must not name a canonical or og:url either —
// the failure that shipped was the homepage's canonical on every unknown URL.
{
  const nf = `${ROOT}/_not-found.html`;
  if (!fs.existsSync(nf)) problems.push("NOTFOUND-ROBOTS  .next/server/app/_not-found.html was not built");
  else {
    const html = fs.readFileSync(nf, "utf8");
    const robots = robotsOf(html);
    if (robots.length !== 1 || !/noindex/i.test(robots[0])) {
      problems.push(`NOTFOUND-ROBOTS  the 404 page carries ${robots.length} robots meta(s) [${robots.join(" | ")}], expected exactly one with noindex`);
    }
    if (/rel="canonical"/.test(html) || /property="og:url"/.test(html)) {
      problems.push("NOTFOUND-CANONICAL  the 404 page names a canonical or og:url");
    }
  }
}

// ── The published gate list ─────────────────────────────────────────────
// /gates publishes this suite as prose: one row per failure code, saying in
// a sentence what the build refuses to ship when that code fires. A written
// description of a program rots the moment the program changes, so parity is
// asserted in both directions rather than trusted. An added gate nobody
// described makes the published list an understatement; a described gate
// that no longer exists is a claim about a check that is not running. Both
// are the page lying about the build, which is worse than not having it.
{
  const self = fs.readFileSync("scripts/qa.mjs", "utf8");
  // Every failure in this file is a problems.push whose message opens with an
  // uppercase code. Parameterised codes carry the offending length inside the
  // code itself (`TITLE-${t.length}`), so they collapse to one `TITLE-*` row:
  // the page describes the check, not one instance of it.
  const live = new Set();
  for (const m of self.matchAll(/problems\.push\(\s*[`"']([A-Z][A-Z0-9-]*(?:\$\{[^}]*\})?)/g)) {
    live.add(m[1].replace(/\$\{[^}]*\}/, "*"));
  }

  const gatesSrc = fs.existsSync("src/data/gates.ts")
    ? fs.readFileSync("src/data/gates.ts", "utf8")
    : "";
  const described = [...gatesSrc.matchAll(/^\s*code: "([^"]+)",$/gm)].map((m) => m[1]);
  const describedSet = new Set(described);

  for (const code of [...live].sort()) {
    if (!describedSet.has(code)) {
      problems.push(`GATE-UNDESCRIBED  ${code} fires in qa.mjs but has no row in src/data/gates.ts`);
    }
  }
  for (const code of described) {
    // The GATE-* codes are this block's own output, and they are extracted
    // from the source above like any other, so they would pass on their own.
    // Skipping them here keeps the stale side from ever being the thing that
    // reports a rename of them — the undescribed side says it more usefully,
    // and the gate does not end up chasing its own tail.
    if (code.startsWith("GATE-")) continue;
    if (!live.has(code)) {
      problems.push(`GATE-STALE  src/data/gates.ts describes ${code}, which no longer fires in qa.mjs`);
    }
  }

  // And the page has to render them. Compare the codes in the built table
  // against the data module rather than counting rows: a grouping bug that
  // drops a whole area then names the exact codes that went missing.
  const gatesPage = htmls.find((h) => routeOf(h) === "/gates");
  if (!gatesPage) {
    problems.push("GATE-PAGE-MISSING  /gates was not built");
  } else {
    const html = fs.readFileSync(gatesPage, "utf8");
    if (!html.includes("data-gates-table")) {
      problems.push("GATE-PAGE-MISSING  /gates renders no data-gates-table");
    } else {
      const shown = new Set(
        [...html.matchAll(/<code[^>]*>([A-Z][A-Z0-9*-]+)<\/code>/g)].map((m) => m[1]),
      );
      const missing = described.filter((c) => !shown.has(c));
      if (missing.length || shown.size !== describedSet.size) {
        problems.push(
          `GATE-PAGE-ROWS  /gates renders ${shown.size} gate rows for ${describedSet.size} described gates` +
            (missing.length ? ` — missing: ${missing.join(", ")}` : ""),
        );
      }
    }
  }
  console.log(`Gates: ${live.size} refusals in qa.mjs, ${described.length} described on /gates.`);
}

if (notFoundRoutes.length) {
  console.log(
    `Not published (route renders notFound, e.g. a tracker awaiting its first CI run): ${notFoundRoutes.join(", ")}`,
  );
}
console.log(`QA: checked ${checked} content pages (${htmls.length} built HTML files).`);
if (problems.length === 0) {
  console.log("✓ No issues found.");
  process.exit(0);
}
console.error(`\n✗ ${problems.length} issue(s):\n`);
for (const p of problems) console.error("  " + p);
process.exit(1);
