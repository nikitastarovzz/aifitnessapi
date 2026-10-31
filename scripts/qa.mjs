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
/** Routes whose rendered HTML asks robots not to index them. */
const noindexSet = new Set();

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
    if (noindex) noindexSet.add(route);
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
    "health-connect-records-2026",
    "health-connect-permissions-2026",
    "healthkit-metadata-keys-2026",
    "wear-os-health-services-data-types-2026",
    "pose-keypoint-maps-2026",
    "google-health-api-data-types-2026",
    "health-mcp-servers-2026",
    "bluetooth-fitness-gatt-2026",
    "workout-types-crosswalk-2026",
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

// ── The public API and the hosted MCP endpoint (ops/EXPANSION-3-2026-10-17.md
// 4.2, added 2026-10-17). /api/v1 serves the datasets as static JSON described
// by /api/v1/openapi.json; /mcp runs the stdio package's tools over Streamable
// HTTP. Both are read by machines that nobody watches, so every failure here
// is a silent one: a documented path that 404s, a served path no client can
// discover, a response without its licence, a source link that lands nowhere,
// a registry entry that names a version nobody shipped. The checks read the
// build output, the way a client meets it, and the OpenAPI document is held to
// the build in both directions — the same rule as DATASET-UNGATED.
{
  const SITE = "https://aifitnessapi.com";
  const readJson = (p) => {
    try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
  };
  const bodyOf = (route) => readJson(`${ROOT}${route}.body`);
  const metaOf = (route) => readJson(`${ROOT}${route}.meta`);

  // Every response the build wrote below /api/v1, by route.
  const built = new Set();
  if (fs.existsSync(`${ROOT}/api/v1.body`)) built.add("/api/v1");
  if (fs.existsSync(`${ROOT}/api/v1`)) {
    (function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".body")) built.add(p.slice(ROOT.length).replace(/\.body$/, ""));
      }
    })(`${ROOT}/api/v1`);
  }

  const openapi = bodyOf("/api/v1/openapi.json");
  let collections = 0;
  let items = 0;
  const servedDatasets = new Set();
  if (!openapi || typeof openapi.openapi !== "string" || !openapi.openapi.startsWith("3.1.") || typeof openapi.paths !== "object") {
    problems.push("API-OPENAPI  /api/v1/openapi.json is missing from the build output or is not an OpenAPI 3.1 document");
  } else {
    // Expand each documented path into the concrete URLs it promises. An item
    // path must enumerate its ids, or there is no way to hold it to the build.
    const documented = new Set();
    for (const [p, ops] of Object.entries(openapi.paths)) {
      const params = [...p.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      if (!p.startsWith("/api/v1") || params.length > 1) {
        problems.push(`API-OPENAPI  ${p} is documented outside /api/v1 or with more than one path parameter`);
        continue;
      }
      if (params.length === 0) {
        documented.add(p);
        continue;
      }
      const values = (ops?.get?.parameters ?? []).find((x) => x.in === "path" && x.name === params[0])?.schema?.enum;
      if (!Array.isArray(values) || values.length === 0) {
        problems.push(`API-OPENAPI  ${p} does not enumerate its {${params[0]}} values, so the URLs it promises cannot be checked`);
        continue;
      }
      for (const v of values) documented.add(p.replace(`{${params[0]}}`, v));
    }

    for (const route of documented) {
      if (!built.has(route)) problems.push(`API-NOT-BUILT  ${route} is in the OpenAPI document but the build wrote no response for it`);
    }
    for (const route of built) {
      if (!documented.has(route)) problems.push(`API-UNDOCUMENTED  ${route} is served but the OpenAPI document does not describe it`);
    }

    // The pages a response's `source` points at, resolved like FRAGMENT-DEAD:
    // the path must be a built page that does not 404, and a fragment must be
    // an id on it. A citation an API hands out has to land.
    const fileOf = new Map(htmls.map((h) => [routeOf(h), h]));
    const idCache = new Map();
    const resolves = (url) => {
      if (typeof url !== "string" || !url.startsWith(`${SITE}/`)) return false;
      const [rawPath, frag] = url.slice(SITE.length).split("#");
      const route = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
      if (!fileOf.has(route) || notFoundSet.has(route)) return false;
      if (!frag) return true;
      if (!idCache.has(route)) {
        idCache.set(route, new Set([...fs.readFileSync(fileOf.get(route), "utf8").matchAll(/\sid="([^"]*)"/g)].map((m) => decode(m[1]))));
      }
      return idCache.get(route).has(frag);
    };

    for (const route of [...built].filter((r) => documented.has(r)).sort()) {
      const meta = metaOf(route);
      const h = meta?.headers ?? {};
      const body = bodyOf(route);
      if (!meta || (meta.status ?? 200) !== 200 || body === null || !/^application\/json\b/.test(h["content-type"] ?? "")) {
        problems.push(`API-NOT-BUILT  ${route} is not served as a 200 JSON response`);
        continue;
      }
      const missing = [];
      if (h["access-control-allow-origin"] !== "*") missing.push("Access-Control-Allow-Origin: *");
      if (!/max-age=\d+/.test(h["cache-control"] ?? "")) missing.push("a Cache-Control max-age");
      if (!/noindex/i.test(h["x-robots-tag"] ?? "")) missing.push("X-Robots-Tag: noindex");
      if (missing.length) problems.push(`API-HEADERS  ${route} is served without ${missing.join(", ")}`);
      if (route === "/api/v1/openapi.json") continue;

      const env = [];
      if (body.license !== "CC-BY-4.0") env.push("license CC-BY-4.0");
      if (typeof body.attribution !== "string" || !body.attribution.includes("aifitnessapi.com")) env.push("attribution");
      if (typeof body.source !== "string") env.push("source");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.verified?.date ?? "") || !body.verified?.meaning) env.push("a verified date and what it means");
      if (env.length) problems.push(`API-ENVELOPE  ${route} lacks ${env.join(", ")}`);
      else if (!resolves(body.source)) problems.push(`API-SOURCE-DEAD  ${route} cites ${body.source}, which is not a built page or not an id on it`);

      // A collection serves every row of its dataset, save the ones it names
      // as excluded and why, and every row it serves has its own URL.
      if (Array.isArray(body.items)) {
        collections++;
        const slug = body.dataset?.slug;
        servedDatasets.add(slug);
        const dataset = readJson(`public/datasets/${slug}.json`);
        const excluded = Array.isArray(body.excluded) ? body.excluded.length : 0;
        if (!dataset || !Array.isArray(dataset.items)) {
          problems.push(`API-ROWS  ${route} names dataset "${slug}", which is not in public/datasets`);
        } else if (body.count !== body.items.length || body.items.length + excluded !== dataset.items.length) {
          problems.push(
            `API-ROWS  ${route} serves ${body.items.length} rows (count ${body.count}, ${excluded} excluded) of ${dataset.items.length} in ${slug}.json`,
          );
        }
        const ids = body.items.map((it) => it?.[body.key]);
        const children = [...built].filter((r) => r.startsWith(`${route}/`) && !r.slice(route.length + 1).includes("/"));
        if (new Set(ids).size !== ids.length || children.length !== ids.length || ids.some((id) => !built.has(`${route}/${id}`))) {
          problems.push(`API-ROWS  ${route} has ${ids.length} rows keyed by "${body.key}" but ${children.length} item responses, or ids that repeat or have no response`);
        }
        items += children.length;
      }
    }
    if (!built.has("/api/v1")) problems.push("API-NOT-BUILT  /api/v1 (the index) was not built");
  }

  // Discoverable: llms.txt and robots.txt name the API and the MCP endpoint,
  // and /developers lists every collection and every tool.
  {
    const llmsBody = fs.existsSync(`${ROOT}/llms.txt.body`) ? fs.readFileSync(`${ROOT}/llms.txt.body`, "utf8") : "";
    const robotsBody = fs.existsSync(`${ROOT}/robots.txt.body`) ? fs.readFileSync(`${ROOT}/robots.txt.body`, "utf8") : "";
    for (const surface of [`${SITE}/api/v1/openapi.json`, `${SITE}/mcp`, `${SITE}/developers`]) {
      if (!llmsBody.includes(surface)) problems.push(`API-UNADVERTISED  llms.txt does not name ${surface}`);
      if (!robotsBody.includes(surface)) problems.push(`API-UNADVERTISED  robots.txt does not name ${surface}`);
    }
    const devFile = htmls.find((h) => routeOf(h) === "/developers");
    const dev = devFile && !notFoundSet.has("/developers") ? fs.readFileSync(devFile, "utf8") : null;
    if (!dev || !dev.includes("data-api-collections")) {
      problems.push("API-UNADVERTISED  /developers was not built or renders no collection table");
    } else {
      for (const route of [...built].filter((r) => Array.isArray(bodyOf(r)?.items))) {
        if (!dev.includes(`href="${SITE}${route}"`)) problems.push(`API-UNADVERTISED  /developers does not link the collection ${route}`);
      }
    }
    const datasetsFile = htmls.find((h) => routeOf(h) === "/datasets");
    if (datasetsFile && !fs.readFileSync(datasetsFile, "utf8").includes('href="/developers"')) {
      problems.push("API-UNADVERTISED  /datasets does not link /developers");
    }

    // The hosted MCP endpoint: built as an on-demand route, never prerendered,
    // and capped. The tool list is the shared module's, so /developers must
    // name each tool it serves.
    const appPaths = readJson(".next/server/app-paths-manifest.json") ?? {};
    const fnConfig = readJson(".next/server/functions-config-manifest.json")?.functions ?? {};
    const maxDuration = fnConfig["/mcp"]?.maxDuration;
    if (!("/mcp/route" in appPaths) || fs.existsSync(`${ROOT}/mcp.body`)) {
      problems.push("MCP-ROUTE  /mcp is missing from the build or was prerendered instead of served on demand");
    } else if (typeof maxDuration !== "number" || maxDuration > 10) {
      problems.push(`MCP-ROUTE  /mcp declares maxDuration ${JSON.stringify(maxDuration)}; it must be set, and at most 10 seconds`);
    }

    const { createToolkit, TOOLS, REQUIRED_DATASETS, SERVER_INFO } = await import(new URL("../mcp/src/tools.js", import.meta.url));
    try {
      const toolkit = createToolkit(Object.fromEntries(REQUIRED_DATASETS.map((s) => [s, readJson(`public/datasets/${s}.json`)])));
      for (const tool of TOOLS) {
        if (dev && !dev.includes(tool.name)) problems.push(`API-UNADVERTISED  /developers does not name the MCP tool ${tool.name}`);
        if (tool.annotations?.readOnlyHint !== true || tool.annotations?.destructiveHint !== false) {
          problems.push(`MCP-TOOLS  ${tool.name} is not annotated read-only and non-destructive`);
        }
        // A probe call with every required argument filled: the answer must
        // carry the site's provenance, and any dataset it names must exist.
        const args = Object.fromEntries((tool.inputSchema.required ?? []).map((k) => [k, "heart"]));
        const out = toolkit.call(tool.name, args);
        const text = (out?.content ?? []).map((c) => c.text).join("\n");
        if (out?.isError || !text.includes(`Source: ${SITE}/`)) {
          problems.push(`MCP-TOOLS  ${tool.name} answered a probe call without the Source line every answer ends with`);
        }
        for (const [, slug] of text.matchAll(/Dataset: https:\/\/aifitnessapi\.com\/datasets\/([a-z0-9-]+)\.json/g)) {
          if (!fs.existsSync(`public/datasets/${slug}.json`)) {
            problems.push(`MCP-TOOLS  ${tool.name} cites /datasets/${slug}.json, which is not published`);
          }
        }
      }
    } catch (err) {
      problems.push(`MCP-TOOLS  the shared tool module could not be loaded over public/datasets: ${err.message}`);
    }

    // The MCP Registry entry must describe what is actually shipped: the npm
    // package's name, mcpName and version, the hosted URL, and the schema's
    // 100-character description cap. A mismatch is rejected by the registry
    // at publish time, or worse, accepted and wrong.
    const serverJson = readJson("mcp/server.json");
    const pkg = readJson("mcp/package.json");
    if (!serverJson || !pkg) {
      problems.push("MCP-SERVER-JSON  mcp/server.json or mcp/package.json is missing or not valid JSON");
    } else {
      const npmPkg = (serverJson.packages ?? []).find((p) => p.registryType === "npm");
      const issues = [];
      if (!/^https:\/\/static\.modelcontextprotocol\.io\/schemas\/\d{4}-\d{2}-\d{2}\/server\.schema\.json$/.test(serverJson.$schema ?? "")) issues.push("$schema is not a registry server schema URL");
      if (!/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/.test(serverJson.name ?? "") || serverJson.name !== pkg.mcpName) issues.push(`name ${serverJson.name} is not the package's mcpName ${pkg.mcpName}`);
      if (typeof serverJson.description !== "string" || serverJson.description.length === 0 || serverJson.description.length > 100) issues.push(`description is ${serverJson.description?.length ?? 0} characters (1–100)`);
      if (serverJson.version !== pkg.version || SERVER_INFO.version !== pkg.version) issues.push(`versions differ: server.json ${serverJson.version}, package.json ${pkg.version}, SERVER_INFO ${SERVER_INFO.version}`);
      if (!npmPkg || npmPkg.identifier !== pkg.name || npmPkg.version !== pkg.version) issues.push(`the npm package entry does not name ${pkg.name}@${pkg.version}`);
      if (!(serverJson.remotes ?? []).some((r) => r.type === "streamable-http" && r.url === `${SITE}/mcp`)) issues.push(`no streamable-http remote at ${SITE}/mcp`);
      if (!(pkg.files ?? []).includes("data")) issues.push("package.json files does not ship data/, which the stdio server reads at start-up");
      for (const i of issues) problems.push(`MCP-SERVER-JSON  ${i}`);
    }
  }

  // Informational: a dataset on disk that no collection serves is a candidate
  // for one entry in src/lib/publicApi.ts, not an error.
  const unserved = fs
    .readdirSync("public/datasets")
    .filter((f) => f.endsWith(".json") && !f.startsWith("manifest"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((s) => !servedDatasets.has(s));
  console.log(
    `API: ${built.size} responses under /api/v1 (${collections} collections, ${items} items), each held to the OpenAPI document both ways; ` +
      `MCP endpoint built on demand.${unserved.length ? ` Datasets not served by /api/v1: ${unserved.join(", ")}.` : ""}`,
  );
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

  // ── The market map and the index (added 2026-10-31). Both are derived views
  // of the directory, so the directory's product set is what they must show:
  // a tile or a row that quietly drops out is a landscape with a hole in it.
  // And the one invariant that matters more than completeness: the funder's
  // row on the index is never ranked — it carries data-unranked, the
  // "funds this site" label and no position — and its tile on the map and in
  // the embed carries its marker, because the embed travels without the
  // page's disclosure.
  const tilesOn = (html) => [...html.matchAll(/data-map-tile="([a-z0-9-]+)"/g)].map((m) => m[1]);
  for (const route of ["/market-map", "/embed/market-map"]) {
    const h = htmls.find((x) => routeOf(x) === route);
    if (!h) { problems.push(`MARKET-MAP-TILES  ${route} was not built`); continue; }
    const html = fs.readFileSync(h, "utf8");
    const tiles = tilesOn(html);
    const missing = expected.filter((id) => !tiles.includes(id));
    if (missing.length || tiles.length !== expected.length) {
      problems.push(`MARKET-MAP-TILES  ${route} renders ${tiles.length} tiles for ${expected.length} directory products${missing.length ? ` — missing: ${missing.join(", ")}` : ""}`);
    }
    const funderTile = /data-map-tile="kinestex"[\s\S]*?<\/li>/.exec(html)?.[0] ?? "";
    if (expected.includes("kinestex") && !/funds (?:this site|aifitnessapi\.com)/.test(funderTile)) {
      problems.push(`MARKET-MAP-FUNDER  ${route}: the KinesteX tile does not carry its funds-this-site marker`);
    }
  }
  {
    const h = htmls.find((x) => routeOf(x) === "/fitness-api-index");
    if (!h) problems.push("API-INDEX-ROWS  /fitness-api-index was not built");
    else {
      const html = fs.readFileSync(h, "utf8");
      const rows = [...html.matchAll(/data-index-row="([a-z0-9-]+)"/g)].map((m) => m[1]);
      const missing = expected.filter((id) => !rows.includes(id));
      if (missing.length || rows.length !== expected.length) {
        problems.push(`API-INDEX-ROWS  /fitness-api-index renders ${rows.length} rows for ${expected.length} directory products${missing.length ? ` — missing: ${missing.join(", ")}` : ""}`);
      }
      const unranked = [...html.matchAll(/<tr[^>]*data-index-row="([a-z0-9-]+)"[^>]*data-unranked=""[^>]*>([\s\S]*?)<\/tr>/g)];
      const ok = unranked.length === 1 && unranked[0][1] === "kinestex" && /Funds this site — not ranked/.test(unranked[0][2]) && /not ranked<\/span><\/td>/.test(unranked[0][2]);
      if (expected.includes("kinestex") && !ok) {
        problems.push("API-INDEX-FUNDER-RANKED  /fitness-api-index must render exactly one unranked row, KinesteX's, labelled funds this site with no position");
      }
      if (/"@type":"[^"]*"[^}]*"ratingValue"|data-composite-score/.test(html)) {
        problems.push("API-INDEX-SCORE  /fitness-api-index renders a composite score; it publishes raw signals only");
      }
    }
  }
}

// ── Vendor menus (ops/EXPANSION-3-2026-10-17.md, item 1.2). src/data/vendorHubs.ts
// lists every page about each vendor; each of them renders the same menu
// (components/VendorHubMenu), and the vendor's hub links them all, so a search
// for "<vendor> api" gathers on one page instead of splitting across three.
// What rots without failing anything else: a listed page that stops building
// or renders notFound (the menu's own build-time check only knows titles), a
// page that drops its menu, a hub that stops linking a page, an entry whose
// text drifts from the H1 it lands on, and the one the menus exist to stop: a
// new page about a vendor that never joins its list. The lists are read from
// the source, everything else from the build. Membership is held to the rules
// declared beside each list: a whole hyphen-separated word of an address in
// the sections the menus cover, and for a library its generated `wraps`.
{
  const VH_SRC = "src/data/vendorHubs.ts";
  // Full-line comments may name paths in prose; they are not entries.
  const code = fs.existsSync(VH_SRC) ? fs.readFileSync(VH_SRC, "utf8").replace(/^\s*\/\/.*$/gm, "") : "";
  const strs = (s) => [...s.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  const vendors = [
    ...code.matchAll(
      /\bid: "([a-z0-9-]+)",\s*hub: "([^"]+)",\s*tokens: \[([^\]]*)\],\s*wraps: \[([^\]]*)\],\s*pages: \[([^\]]*)\]/g,
    ),
  ].map((m) => ({ id: m[1], hub: m[2], tokens: strs(m[3]), wraps: strs(m[4]), pages: strs(m[5]) }));
  if (vendors.length === 0) problems.push(`VENDOR-HUB-PAGE  could not read VENDOR_HUBS from ${VH_SRC}`);

  const fileOf = new Map(htmls.map((h) => [routeOf(h), h]));
  const cache = new Map();
  const htmlAt = (r) => {
    if (!cache.has(r)) {
      cache.set(r, fileOf.has(r) && !notFoundSet.has(r) ? fs.readFileSync(fileOf.get(r), "utf8") : null);
    }
    return cache.get(r);
  };
  const textOf = (s) => decode(s.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
  // A menu names a page by its H1 without the trailing "(2026)".
  const h1Of = (html) =>
    textOf(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "").replace(/\s*\((?:19|20)\d{2}\)$/, "");
  const menusOn = (html) =>
    [...html.matchAll(/<nav\b[^>]*\bdata-vendor-menu="([^"]*)"[^>]*>/g)].map((m) => ({
      ids: m[1].split(/\s+/),
      placement: /\bdata-vendor-placement="([^"]*)"/.exec(m[0])?.[1],
    }));

  let carrying = 0;
  let labelled = 0;
  for (const v of vendors) {
    if (v.pages.length < 3) {
      problems.push(`VENDOR-HUB-PAGE  ${v.id} lists ${v.pages.length} page(s); a vendor gets a menu at three or more`);
    }
    const guide = v.pages.find((p) => p.startsWith("/integrate/"));
    const rule = guide ?? `/apis/${v.id}`;
    if (v.hub !== rule) {
      problems.push(`VENDOR-HUB-PAGE  ${v.id}: hub is ${v.hub}, but its ${guide ? "integration guide" : "directory entry"} ${rule} is the hub by rule`);
    }
    if (!v.pages.includes(v.hub)) problems.push(`VENDOR-HUB-PAGE  ${v.id}: hub ${v.hub} is not in its own pages list`);
    for (const p of v.pages) {
      const html = htmlAt(p);
      if (html === null) {
        problems.push(`VENDOR-HUB-PAGE  ${v.id}: ${p} is listed in ${VH_SRC} but ${fileOf.has(p) ? "renders notFound()" : "no built page answers it"}`);
        continue;
      }
      const want = p === v.hub ? "top" : "end";
      if (menusOn(html).some((m) => m.placement === want && m.ids.includes(v.id))) carrying++;
      else problems.push(`VENDOR-HUB-MENU  ${p} does not render the ${v.id} menu${want === "top" ? " at the top of the hub" : ""}`);
    }
    const hub = htmlAt(v.hub);
    if (!hub) continue;
    const hrefs = new Set([...hub.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]));
    for (const p of v.pages) {
      // An unbuilt page is already a VENDOR-HUB-PAGE failure above.
      if (p !== v.hub && htmlAt(p) !== null && !hrefs.has(p)) {
        problems.push(`VENDOR-HUB-LINK  ${v.hub}, the ${v.id} hub, does not link ${p}`);
      }
    }
    // The hub's menu lists every page, so its entries are the whole label set.
    for (const m of hub.matchAll(/<(a|span)\b[^>]*\bdata-vendor-page="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g)) {
      const target = htmlAt(m[2]);
      if (!target) continue;
      labelled++;
      const shown = textOf(m[3]);
      const h1 = h1Of(target);
      if (shown !== h1) problems.push(`VENDOR-HUB-LABEL  ${v.hub} names ${m[2]} "${shown}", but that page's H1 reads "${h1}"`);
    }
  }

  // Membership. In the sections the menus cover, and among the single-segment
  // reference pages, an address with one of a vendor's words is the vendor's
  // page; so is a library whose generated `wraps` names it, and a library
  // comparison where either package's does.
  const SECTIONS = new Set(["integrate", "pricing", "alternatives", "compare", "fix", "libraries", "migrate", "fitness-apis", "data", "apis"]);
  let wrapsOf = new Map();
  try {
    const libSrc = fs.readFileSync("src/data/libraries.ts", "utf8");
    const at = /export const LIBRARIES: [^=]+= /.exec(libSrc);
    const open = at.index + at[0].length;
    const rows = JSON.parse(libSrc.slice(open, libSrc.indexOf("\n];", open) + 3).trim().replace(/;$/, ""));
    wrapsOf = new Map(rows.map((l) => [l.slug, l.wraps ?? []]));
  } catch {
    problems.push("VENDOR-HUB-UNLISTED  could not read LIBRARIES from src/data/libraries.ts to check which vendors each library wraps");
  }
  const hasWord = (seg, word) =>
    seg === word || seg.startsWith(`${word}-`) || seg.endsWith(`-${word}`) || seg.includes(`-${word}-`);
  let scanned = 0;
  for (const r of [...valid].sort()) {
    if (notFoundSet.has(r)) continue;
    const seg = r.split("/").filter(Boolean);
    if (seg.length === 0 || seg[0].startsWith("_")) continue;
    if (!(seg.length === 1 || SECTIONS.has(seg[0]))) continue;
    scanned++;
    const words = seg.length === 1 ? seg : seg.slice(1);
    let libWraps = [];
    if (seg[0] === "libraries" && seg.length === 2) libWraps = wrapsOf.get(seg[1]) ?? [];
    if (seg[0] === "libraries" && seg[1] === "compare" && seg.length === 3) {
      libWraps = seg[2].split("-vs-").flatMap((s) => wrapsOf.get(s) ?? []);
    }
    for (const v of vendors) {
      if (v.pages.includes(r)) continue;
      const word = v.tokens.find((t) => words.some((w) => hasWord(w, t)));
      const wrap = v.wraps.find((w) => libWraps.includes(w));
      if (word || wrap) {
        problems.push(
          `VENDOR-HUB-UNLISTED  ${r} ${word ? `has "${word}" as a word of its address` : `wraps ${wrap}`} but is not in the ${v.id} pages of ${VH_SRC}`,
        );
      }
    }
  }
  console.log(
    `Vendor menus: ${vendors.length} vendors, ${carrying} vendor pages carrying their menu, ` +
      `${labelled} hub entries reading their page's H1; ${scanned} addresses checked for unlisted vendor pages.`,
  );
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

  // A word glued to the expression or element before it ("5carry",
  // "Disclosure:KinesteX"). The compiler Next ships drops the leading space of
  // a JSX text run when that run both contains an HTML entity (&rsquo;,
  // &amp;, …) and spans more than one line; the same run on one line, or with
  // a literal ’, keeps it. 69 runs had lost their space when this was found
  // (2026-10-12). Checked in the source, where the condition is exact; the fix
  // is an explicit {" "} before the run, never a reflowed paragraph that
  // happens to dodge the rule.
  {
    const { default: ts } = await import("typescript");
    const tsx = [];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (p.endsWith(".tsx")) tsx.push(p);
      }
    })("src");
    const INLINE = new Set([ts.SyntaxKind.JsxExpression, ts.SyntaxKind.JsxElement, ts.SyntaxKind.JsxSelfClosingElement]);
    for (const f of tsx) {
      const src = fs.readFileSync(f, "utf8");
      if (!/&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(src)) continue;
      const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      (function visit(n) {
        if (n.kind === ts.SyntaxKind.JsxText) {
          const raw = src.slice(n.pos, n.end);
          const kids = n.parent.children ? Array.from(n.parent.children) : [];
          const prev = kids[kids.indexOf(n) - 1];
          if (prev && INLINE.has(prev.kind) && /^[ \t]+\S/.test(raw) && raw.includes("\n") && /&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(raw)) {
            const line = sf.getLineAndCharacterOfPosition(n.pos).line + 1;
            problems.push(`JSX-ENTITY-SPACE  ${f}:${line} the space after the preceding expression or tag will not render`);
          }
        }
        ts.forEachChild(n, visit);
      })(sf);
    }
  }

  // /opensearch.xml surfaced in Google results as if it were a page
  // (GROWTH-30 #29). It is a machine file for browsers, so its response must
  // carry X-Robots-Tag: noindex. The static route's headers land in the
  // build's .meta file, which is what a deploy serves.
  {
    const metaPath = ".next/server/app/opensearch.xml.meta";
    let noindexHeader = false;
    if (fs.existsSync(metaPath)) {
      try {
        const h = JSON.parse(fs.readFileSync(metaPath, "utf8")).headers ?? {};
        noindexHeader = /noindex/i.test(h["x-robots-tag"] ?? h["X-Robots-Tag"] ?? "");
      } catch {
        noindexHeader = false;
      }
    }
    if (!noindexHeader) problems.push("MACHINE-FILE-INDEXABLE  /opensearch.xml is served without X-Robots-Tag: noindex");
  }

  if (robotsTxt === null) problems.push("GEO-NO-ROBOTS  robots.txt missing from build output");
  else {
    const required = [
      "GPTBot", "OAI-SearchBot", "ChatGPT-User",
      "ClaudeBot", "Claude-User", "Claude-SearchBot",
      "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot",
      // bingbot earns its place on this list twice over: Bing is a search
      // engine we have never had a single impression from, and its index is
      // what its assistant answers from. Naming it in robots.txt changes no
      // rule — every group shares the same `Allow: /` — but an unnamed agent
      // sits outside the file's "a Disallow here reaches every named agent"
      // invariant, and nothing stopped a future edit from quietly dropping
      // the line. Now something does.
      "bingbot",
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
  // The twelve /healthkit/<group> pages partition the identifier dataset —
  // every identifier on exactly one page. A mapping bug drops
  // identifiers from every page at once and nothing else notices: each page
  // still builds, still reads fine, just with fewer rows than it claims. So
  // count the id markers in the derived tables and assert the partition is
  // whole. While the set is still being written the count would fail for the
  // wrong reason, so an incomplete set reports as incomplete instead.
  {
    const EXPECTED_GROUPS = 12;
    // Apple's HealthKit docs JSON (https://developer.apple.com/documentation/healthkit,
    // the four identifier families) listed 241 identifiers when read on
    // 2026-10-02: the 240 of the 2026-08-28 read plus
    // HKQuantityTypeIdentifier.heartRateVariabilityRMSSD (iOS 27.0). Move this
    // only with a regeneration of src/data/healthkitIdentifiers.ts.
    const EXPECTED_IDS = 241;
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
    const EXPECTED_TOOLS = 10; // hub + 9 tools (the 6 lookups, sample-data, webhook-verifier and pose-benchmark)
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
    // 13 pages where KinesteX is the subject or one listed option, plus 47
    // build-vs-buy camera-motion pages and /tools/pose-benchmark (widened
    // 2026-10-31; the placement rule is in the component's header comment).
    const EXPECTED = 61;
    if (withNote.length !== EXPECTED) {
      problems.push(
        `KINESTEX-NOTE  ${withNote.length} pages render the first-party link, expected ${EXPECTED} — a mapped path was probably renamed`,
      );
    }
    // The count alone could balance a renamed path against a stray one, so
    // the rendered set must also be exactly the component's map.
    {
      const mapped = [...fs.readFileSync("src/components/KinestexNote.tsx", "utf8").matchAll(/^  "(\/[^"]+)": \{$/gm)].map((m) => m[1]);
      const rendered = new Set(withNote.map(routeOf));
      for (const p of mapped) {
        if (!rendered.has(p)) problems.push(`KINESTEX-NOTE  ${p} is in the KinestexNote map but no built page renders the note`);
      }
      const mappedSet = new Set(mapped);
      for (const r of rendered) {
        if (!mappedSet.has(r)) problems.push(`KINESTEX-NOTE  ${r} renders the note but is not in the KinestexNote map`);
      }
    }
    for (const h of withNote) {
      const html = fs.readFileSync(h, "utf8");
      if (!/Disclosure:/.test(html)) {
        problems.push(`KINESTEX-UNDISCLOSED  ${routeOf(h)} links to the funder without the disclosure`);
      }
    }
    // The sitewide footer credit links the funder on every page, so the same
    // rule holds it: every footer link to the funder must sit in the funding
    // line, and that line must say who funds the site in the page's language.
    let footerCredits = 0;
    const funderHref = /<a\b[^>]*\bhref="https?:\/\/(?:www\.)?kinestex\.com[^"]*"/g;
    for (const h of htmls) {
      const html = fs.readFileSync(h, "utf8");
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
      const links = (footer.match(funderHref) ?? []).length;
      if (!links) continue;
      const line = footer.match(/<p\b[^>]*\bdata-funding-line[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
      const lineText = line.replace(/<!-- -->/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
      const inLine = (line.match(funderHref) ?? []).length;
      const pt = routeOf(h).startsWith("/pt-br");
      const says = pt ? /financiada pela KinesteX/.test(lineText) : /funded by KinesteX/.test(lineText);
      if (inLine !== links || !says) {
        problems.push(`KINESTEX-UNDISCLOSED  ${routeOf(h)} footer links to the funder outside a funding line that says who funds the site`);
      } else footerCredits++;
    }
    console.log(`First-party: ${withNote.length} disclosed notes; footer funding credit on ${footerCredits} of ${htmls.length} pages.`);
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

  // ── Query ownership: one query, one page ──────────────────────────────
  //
  // Added 2026-10-03 after the query→page join showed 44 of 234 queries split
  // across several of our own URLs — 450 of 1,220 query-page impressions.
  // "fitness api" was spread over thirteen of our pages, every one of them
  // stranded between position 40 and 90. Nothing ranks when it is bidding
  // against itself, and the split is invisible from inside a single entry
  // file: each page looks fine on its own.
  //
  // So `primaryQuery` is now an exclusive claim. Two entries wanting the same
  // string is a content decision — merge them, or narrow one — not something
  // to discover in Search Console a quarter later.
  {
    const owners = new Map(); // normalised query -> ["cluster/slug", ...]
    for (const f of fs.readdirSync("src/data").filter((n) => n.endsWith(".entries.ts"))) {
      const cluster = f.replace(".entries.ts", "");
      const src = fs.readFileSync(`src/data/${f}`, "utf8");
      // Entries are JSON-shaped objects; slug precedes primaryQuery within one.
      for (const m of src.matchAll(
        /"slug":\s*"([^"]+)"[\s\S]{0,800}?"primaryQuery":\s*"((?:[^"\\]|\\.)*)"/g,
      )) {
        const key = m[2].trim().toLowerCase().replace(/\s+/g, " ");
        if (!key) continue;
        const list = owners.get(key) ?? [];
        list.push(`${cluster}/${m[1]}`);
        owners.set(key, list);
      }
    }
    let clashes = 0;
    for (const [query, pages] of owners) {
      if (pages.length > 1) {
        clashes++;
        problems.push(
          `CANNIBAL-QUERY  "${query}" is the primaryQuery of ${pages.length} entries: ${pages.join(", ")}`,
        );
      }
    }
    console.log(
      `Query ownership: ${owners.size} distinct primary queries across the clusters, ${clashes} contested.`,
    );
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
    // A translated page discloses in its own language; PTBR-DISCLOSURE holds
    // /pt-br pages to the translated banner on top of this.
    // The sitewide footer credit is not this page's disclosure: a page that
    // features KinesteX owes its own, so the footer is cut before the test.
    const own = html.replace(/<footer\b[\s\S]*?<\/footer>/g, "");
    const disclosed = disclosureRe.test(own) || (r.startsWith("/pt-br/") && /financia este site/.test(own));
    if (mentions >= 3 && !disclosed) {
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
      if (noindexSet.has(route)) {
        problems.push(
          `SITEMAP-NOINDEX  ${route} is listed in sitemap.xml but its own HTML says noindex`,
        );
      }
      const declared = dateModifiedOf.get(route);
      if (declared && lastmod?.slice(0, 10) !== declared) {
        problems.push(`SITEMAP-LASTMOD  ${route}: lastmod ${lastmod ?? "(none)"} but the page declares dateModified ${declared}`);
      }
    }
    console.log(`Sitemap: ${rows} rows, ${dated} with lastmod; every row whose page declares dateModified checked against it.`);
  }
}

// ── Index decisions (ops/SEO-10-2026-10-27.md item 4). Two lists say which
// pages ask not to be indexed: src/data/indexDemand.ts, generated from the
// search pulls by scripts/build-index-demand.mjs for the generated per-item
// reference pages, and NOINDEX_PAGES in src/data/noindex.ts, decided by hand
// for older hand-written pages. Each list is only true if the built site
// does what it says, and a decision lives in three places a later edit can
// separate: the list, the page's robots meta and the sitemap. So every row
// is held to both: a noindex row renders `noindex, follow` and is absent from
// the sitemap; an index row of the generated list renders no noindex and is
// listed. Neither list may name a hub — a noindexed hub would hide the
// indexed pages under it — and a hand-written entry must still build (a page
// folded away has to leave the list too).
{
  const SITE = "https://aifitnessapi.com";
  const sm = fs.existsSync(`${ROOT}/sitemap.xml.body`) ? fs.readFileSync(`${ROOT}/sitemap.xml.body`, "utf8") : "";
  const listed = new Set(
    [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => (loc === SITE ? "/" : loc.slice(SITE.length))),
  );
  const htmlByRoute = new Map(htmls.map((h) => [routeOf(h), h]));
  /** The page's robots directives, or null when no page builds there. */
  const robotsAt = (route) => {
    const h = htmlByRoute.get(route);
    if (!h || notFoundSet.has(route)) return null;
    return robotsOf(fs.readFileSync(h, "utf8")).join(" | ");
  };
  const isNoindexFollow = (r) => /\bnoindex\b/i.test(r) && /\bfollow\b/i.test(r) && !/\bnofollow\b/i.test(r);
  const hubOk = (route) => {
    const segs = route.split("/").filter(Boolean);
    if (segs.length < 2) return false;
    const hub = `/${segs[0]}`;
    const r = robotsAt(hub);
    return r !== null && !/noindex/i.test(r) && listed.has(hub);
  };

  // Generated pages: the data-driven rule.
  const src = fs.existsSync("src/data/indexDemand.ts") ? fs.readFileSync("src/data/indexDemand.ts", "utf8") : "";
  const m = /export const INDEX_DEMAND: [^=]+= /.exec(src);
  const end = m ? src.indexOf("\n];", m.index) : -1;
  let rows = null;
  try {
    rows = m && end !== -1 ? JSON.parse(src.slice(m.index + m[0].length, end + 2)) : null;
  } catch {
    rows = null;
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    problems.push("INDEX-DEMAND-READ  src/data/indexDemand.ts has no readable INDEX_DEMAND rows — run npm run build && node scripts/build-index-demand.mjs");
  } else {
    let judged = 0;
    const unbuilt = [];
    for (const r of rows) {
      const robots = robotsAt(r.path);
      if (robots === null) {
        unbuilt.push(r.path);
        continue;
      }
      judged++;
      if (r.decision === "noindex") {
        if (!isNoindexFollow(robots)) problems.push(`INDEX-DEMAND-ROBOTS  ${r.path} is noindex in src/data/indexDemand.ts but renders robots "${robots}"`);
        if (listed.has(r.path)) problems.push(`INDEX-DEMAND-SITEMAP  ${r.path} is noindex in src/data/indexDemand.ts but sitemap.xml lists it`);
        if (!hubOk(r.path)) problems.push(`INDEX-DEMAND-HUB  ${r.path} is noindexed but is a hub, or its hub is not indexed and listed`);
      } else if (r.decision === "index") {
        if (/noindex/i.test(robots)) problems.push(`INDEX-DEMAND-ROBOTS  ${r.path} is indexed in src/data/indexDemand.ts but renders robots "${robots}"`);
        if (!listed.has(r.path)) problems.push(`INDEX-DEMAND-SITEMAP  ${r.path} is indexed in src/data/indexDemand.ts but sitemap.xml does not list it`);
      } else {
        problems.push(`INDEX-DEMAND-READ  ${r.path} carries decision "${r.decision}"`);
      }
    }
    const noindexed = rows.filter((r) => r.decision === "noindex").length;
    console.log(
      `Index demand: ${judged} generated pages held to src/data/indexDemand.ts (${noindexed} noindex)` +
        (unbuilt.length ? `; ${unbuilt.length} rows name pages this build does not have — regenerate after a data change (${unbuilt.slice(0, 3).join(", ")}${unbuilt.length > 3 ? ", …" : ""})` : ""),
    );
  }

  // Hand-written pages: the decided list.
  const nsrc = fs.existsSync("src/data/noindex.ts") ? fs.readFileSync("src/data/noindex.ts", "utf8") : "";
  const block = /export const NOINDEX_PAGES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(nsrc)?.[1];
  if (block === undefined) problems.push("NOINDEX-PAGE-READ  NOINDEX_PAGES not found in src/data/noindex.ts");
  else {
    const pages = [...block.matchAll(/"(\/[^"]+)"/g)].map((x) => x[1]);
    for (const p of pages) {
      const robots = robotsAt(p);
      if (robots === null) {
        problems.push(`NOINDEX-PAGE-GONE  ${p} is in NOINDEX_PAGES but no page builds there — a folded or removed page leaves the list too`);
        continue;
      }
      if (!isNoindexFollow(robots)) problems.push(`NOINDEX-PAGE-ROBOTS  ${p} is in NOINDEX_PAGES but renders robots "${robots}"`);
      if (listed.has(p)) problems.push(`NOINDEX-PAGE-SITEMAP  ${p} is in NOINDEX_PAGES but sitemap.xml lists it`);
      if (!hubOk(p)) problems.push(`NOINDEX-PAGE-HUB  ${p} is in NOINDEX_PAGES but is a hub, or its hub is not indexed and listed`);
    }
    console.log(`Noindex list: ${pages.length} hand-written pages render noindex, follow and are out of the sitemap.`);
  }
}

// ── /opensearch.xml is for browsers, not for results pages: Google showed it
// for "fitness api" (ops/SEO-10-2026-10-27.md item 8). An XML file cannot
// carry a robots meta, so next.config.ts sends X-Robots-Tag: noindex for it.
// The rule has to stay, and the file has to keep working for the browsers it
// is for.
{
  const cfg = fs.existsSync("next.config.ts") ? fs.readFileSync("next.config.ts", "utf8") : "";
  if (!/source:\s*"\/opensearch\.xml",\s*headers:\s*\[\s*\{\s*key:\s*"X-Robots-Tag",\s*value:\s*"noindex"\s*\}/.test(cfg)) {
    problems.push('OPENSEARCH-NOINDEX  next.config.ts does not send "X-Robots-Tag: noindex" for /opensearch.xml');
  }
  const body = fs.existsSync(`${ROOT}/opensearch.xml.body`) ? fs.readFileSync(`${ROOT}/opensearch.xml.body`, "utf8") : "";
  if (!/<OpenSearchDescription\b/.test(body) || !/<Url\b[^>]*template="[^"]*\{searchTerms\}/.test(body)) {
    problems.push("OPENSEARCH-NOINDEX  /opensearch.xml did not build as an OpenSearch description with a {searchTerms} template");
  }
}

// ── Year markers. A year in parentheses in a page's <title> or <h1> —
// "(2026)", "(2026 Guide)", "(2026 Update)" — is a freshness claim: it tells
// a searcher the page is current as of that year. The only honest backing
// for it is the page's own verification stamp, so every parenthesised year
// must equal the year of the newest dateModified the page's JSON-LD declares
// (the same per-route date SITEMAP-LASTMOD holds the sitemap to). The years
// stay literal on purpose: on January 1 nothing here fails, and a page nobody
// re-verified keeps saying the year it was verified in, which is true. A
// rewrite of the years, or a token filled from the build date, would move
// the claim without anyone re-checking a source (CLAUDE.md, Freshness). When
// a re-verification moves a stamp into a new year, this forces the marker to
// move with it. A page with a marker and no dateModified fails too: nothing
// backs its year. A year outside parentheses is the page's subject ("Strava's
// API Changes Since 2024", "State of Fitness APIs 2026") and is not judged.
{
  let marked = 0;
  for (const h of htmls) {
    const route = routeOf(h);
    if (route.startsWith("/_") || notFoundSet.has(route)) continue;
    const html = fs.readFileSync(h, "utf8");
    const heads = [];
    const tm = html.match(/<title>([^<]*)<\/title>/);
    if (tm) heads.push(["<title>", decode(tm[1])]);
    for (const m of html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)) {
      heads.push(["<h1>", decode(m[1].replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim()]);
    }
    const declared = dateModifiedOf.get(route);
    const stampYear = declared?.slice(0, 4);
    let hasMarker = false;
    for (const [tag, text] of heads) {
      const years = [];
      for (const [, inner] of text.matchAll(/\(([^()]*)\)/g)) {
        for (const [y] of inner.matchAll(/\b(?:19|20)\d{2}\b/g)) years.push(y);
      }
      if (!years.length) continue;
      hasMarker = true;
      if (!declared) {
        problems.push(
          `YEAR-MARKER    ${route}: ${tag} "${text}" says ${years.join(", ")} but the page declares no JSON-LD dateModified, so no stamp backs the year — drop the year marker, or emit the page's real verification stamp as dateModified; never change the year alone`,
        );
        continue;
      }
      const wrong = [...new Set(years.filter((y) => y !== stampYear))];
      if (!wrong.length) continue;
      if (wrong.every((y) => y < stampYear)) {
        problems.push(
          `YEAR-MARKER    ${route}: ${tag} "${text}" says ${wrong.join(", ")} but the page's newest dateModified is ${declared} — the stamp says the page was verified in ${stampYear}, so move the year marker to ${stampYear} with it, or drop the year marker (a subject year belongs outside the parentheses)`,
        );
      } else {
        problems.push(
          `YEAR-MARKER    ${route}: ${tag} "${text}" says ${wrong.join(", ")} but the page's newest dateModified is ${declared} — re-verify the page and move its stamp, or drop the year marker; never change the year alone`,
        );
      }
    }
    if (hasMarker) marked++;
  }
  console.log(`Year markers: ${marked} pages carry a parenthesised year in their title or h1, each held to the year of its newest dateModified.`);
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

// ── Generated references (GROWTH-OCT-2026-B, added 2026-10-03). Each of these
// surfaces renders rows out of a generated module, so the failure that matters
// is the quiet one: a page that builds and reads fine with fewer rows than the
// data holds. Counts come from the generated modules themselves (read as text,
// like everything else here), never from a number typed into this file, and
// each module's own floor is asserted so a short regeneration fails too.
{
  const htmlOf = (route) => {
    const h = htmls.find((f) => routeOf(f) === route);
    return h && !notFoundSet.has(route) ? fs.readFileSync(h, "utf8") : null;
  };
  /** The JSON array literal assigned to `export const <name>` in a generated module. */
  const jsonArray = (src, name) => {
    const m = new RegExp(`export const ${name}: [^=]+= `).exec(src);
    if (!m) return null;
    const open = m.index + m[0].length;
    const end = src.indexOf("\n];", open);
    if (end === -1) return null;
    try { return JSON.parse(src.slice(open, end + 3).trim().replace(/;$/, "")); } catch { return null; }
  };
  const strConst = (src, name) => new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"`).exec(src)?.[1] ?? null;
  const numConst = (src, name) => {
    const v = new RegExp(`export const ${name}\\s*=\\s*(\\d+)`).exec(src)?.[1];
    return v ? Number(v) : null;
  };
  const hrefsIn = (html) => new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]));

  // Health Connect record reference. Google's data-types table listed 42
  // record classes and the framework HealthPermissions reference 219
  // constants on 2026-10-03 (the generator's own floors).
  {
    const src = fs.readFileSync("src/data/healthConnectRecords.ts", "utf8");
    const records = jsonArray(src, "HC_RECORDS");
    const perms = jsonArray(src, "HC_FRAMEWORK_PERMISSIONS");
    if (!records || records.length < 42) {
      problems.push(`HC-RECORD-COVERAGE  src/data/healthConnectRecords.ts yields ${records?.length ?? 0} records, expected at least 42`);
    } else {
      const built = htmls
        .map(routeOf)
        .filter((r) => /^\/health-connect\/[a-z0-9-]+-record$/.test(r) && !notFoundSet.has(r));
      if (built.length !== records.length) {
        problems.push(`HC-RECORD-COVERAGE  ${built.length} record pages built for ${records.length} generated records`);
      }
      const hub = htmlOf("/health-connect");
      const hubLinks = hub ? hrefsIn(hub) : new Set();
      if (!hub) problems.push("HC-RECORD-COVERAGE  /health-connect was not built");
      let permsChecked = 0;
      for (const r of records) {
        const route = `/health-connect/${r.slug}`;
        const html = htmlOf(route);
        if (!html) {
          problems.push(`HC-RECORD-COVERAGE  ${route} (${r.className}) has no built page`);
          continue;
        }
        if (!html.includes(`data-hc-record="${r.className}"`)) {
          problems.push(`HC-RECORD-COVERAGE  ${route} does not carry data-hc-record="${r.className}"`);
        }
        if (hub && !hubLinks.has(route)) problems.push(`HC-RECORD-COVERAGE  /health-connect does not link ${route}`);
        for (const p of [...r.readPermissions, ...r.writePermissions]) {
          if (!html.includes(p)) problems.push(`HC-PERM-ON-PAGE  ${route} does not show its permission ${p}`);
          else permsChecked++;
        }
      }
      if (!perms || perms.length < 219) {
        problems.push(`HC-PERMISSION-ROWS  src/data/healthConnectRecords.ts yields ${perms?.length ?? 0} framework permissions, expected at least 219`);
      } else {
        const page = htmlOf("/health-connect/permissions");
        const rendered = new Set(
          page ? [...page.matchAll(/data-hc-permission="(android\.permission\.health\.[A-Z0-9_]+)"/g)].map((m) => m[1]) : [],
        );
        const missing = perms.filter((p) => !rendered.has(p.value)).map((p) => p.constant);
        if (rendered.size !== perms.length || missing.length) {
          problems.push(
            `HC-PERMISSION-ROWS  /health-connect/permissions renders ${rendered.size} permission rows for ${perms.length} generated` +
              (missing.length ? ` — missing: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}` : ""),
          );
        }
      }
      console.log(
        `Health Connect: ${built.length} record pages for ${records.length} records, ${permsChecked} permission strings on their pages, ${perms?.length ?? 0} framework permissions.`,
      );
    }
  }

  // Open-source libraries: the generator's declared row count, a page per
  // package, the hub linking every package and comparison, and freshness —
  // the weekly CI refresh holds some changes back to the first run of the
  // month, so up to ~5 weeks is normal and 45 days means CI has stopped.
  {
    const src = fs.readFileSync("src/data/libraries.ts", "utf8");
    const rows = jsonArray(src, "LIBRARIES");
    const expected = numConst(src, "LIBRARIES_EXPECTED_ROWS");
    const fetchedOn = strConst(src, "LIBRARIES_FETCHED_ON");
    const editorial = fs.readFileSync("src/data/librariesEditorial.ts", "utf8");
    const comparisons = [...editorial.matchAll(/^\s{4}slug: "([a-z0-9-]+-vs-[a-z0-9-]+)",$/gm)].map((m) => m[1]);
    if (!rows || !expected || rows.length !== expected) {
      problems.push(`LIBS-ROWS  src/data/libraries.ts yields ${rows?.length ?? 0} rows, LIBRARIES_EXPECTED_ROWS is ${expected}`);
    } else {
      const hub = htmlOf("/libraries");
      const hubLinks = hub ? hrefsIn(hub) : new Set();
      if (!hub) problems.push("LIBS-ROWS  /libraries was not built");
      const routes = [
        ...rows.map((l) => `/libraries/${l.slug}`),
        ...comparisons.map((c) => `/libraries/compare/${c}`),
      ];
      for (const route of routes) {
        if (!htmlOf(route)) problems.push(`LIBS-ROWS  ${route} has no built page`);
        else if (hub && !hubLinks.has(route)) problems.push(`LIBS-ROWS  /libraries does not link ${route}`);
      }
      console.log(`Libraries: ${rows.length} packages + ${comparisons.length} comparisons built and linked from /libraries.`);
    }
    if (!fetchedOn) {
      problems.push("LIBS-FRESH  src/data/libraries.ts has no LIBRARIES_FETCHED_ON");
    } else {
      const age = Math.floor((Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(fetchedOn)) / 86_400_000);
      if (!(age <= 45)) problems.push(`LIBS-FRESH  libraries data read ${fetchedOn} (${age} days ago) — the weekly CI refresh has stopped`);
      else console.log(`Libraries freshness: registries read ${fetchedOn} (${age}d ago, limit 45).`);
    }
  }

  // Library landings (ops/EXPANSION-3-2026-10-17.md 4.6): one page per
  // language or framework, declared in src/data/librariesLandings.ts and
  // rendered from the generated rows. A landing that drops a package is the
  // quiet failure here — it still reads like a complete list — so the built
  // page must carry one data-lib-row per package of its groups, each linking
  // the package page, and no row for anything else. Every landing must be
  // built and linked from /libraries, every package page must link back to
  // its landing, and a group with three or more packages must have one.
  {
    const rows = jsonArray(fs.readFileSync("src/data/libraries.ts", "utf8"), "LIBRARIES") ?? [];
    const LANDINGS_SRC = "src/data/librariesLandings.ts";
    const landSrc = fs.existsSync(LANDINGS_SRC) ? fs.readFileSync(LANDINGS_SRC, "utf8") : "";
    const landings = [...landSrc.matchAll(/^\s{4}slug: "([a-z0-9-]+)",\n\s{4}groups: \[([^\]\n]*)\],$/gm)].map((m) => ({
      slug: m[1],
      groups: [...m[2].matchAll(/"([a-z0-9-]+)"/g)].map((g) => g[1]),
    }));
    if (!landings.length) problems.push(`LIBS-LANDING-ROWS  could not read the landings (slug and groups lines) from ${LANDINGS_SRC}`);
    const hub = htmlOf("/libraries");
    const hubLinks = hub ? hrefsIn(hub) : new Set();
    const covered = new Set(landings.flatMap((l) => l.groups));
    const sizes = new Map();
    for (const r of rows) sizes.set(r.group, (sizes.get(r.group) ?? 0) + 1);
    for (const [g, n] of sizes) {
      if (n >= 3 && !covered.has(g)) problems.push(`LIBS-LANDING-ROWS  the ${g} group has ${n} packages but no landing page covers it`);
    }
    let rowsShown = 0;
    for (const l of landings) {
      const route = `/libraries/${l.slug}`;
      const html = htmlOf(route);
      if (!html) {
        problems.push(`LIBS-LANDING-ROWS  ${route} has no built page`);
        continue;
      }
      if (hub && !hubLinks.has(route)) problems.push(`LIBS-LANDING-ROWS  /libraries does not link ${route}`);
      const shown = new Map(
        [...html.matchAll(/<tr\b[^>]*\bdata-lib-row="([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => [m[1], m[2]]),
      );
      const members = rows.filter((r) => l.groups.includes(r.group));
      if (!members.length) problems.push(`LIBS-LANDING-ROWS  ${route} covers ${l.groups.join(", ")}, which hold no packages`);
      for (const r of members) {
        const row = shown.get(r.slug);
        if (row === undefined) problems.push(`LIBS-LANDING-ROWS  ${route} has no table row for ${r.name} (${r.slug})`);
        else if (!row.includes(`href="/libraries/${r.slug}"`)) problems.push(`LIBS-LANDING-ROWS  ${route}'s row for ${r.name} does not link /libraries/${r.slug}`);
        else rowsShown++;
        const pkg = htmlOf(`/libraries/${r.slug}`);
        if (pkg && !hrefsIn(pkg).has(route)) problems.push(`LIBS-LANDING-ROWS  /libraries/${r.slug} does not link back to its landing ${route}`);
      }
      for (const slug of shown.keys()) {
        if (!members.some((r) => r.slug === slug)) problems.push(`LIBS-LANDING-ROWS  ${route} has a row for ${slug}, which is not a package of ${l.groups.join(", ")}`);
      }
    }
    console.log(`Library landings: ${landings.length} pages, ${rowsShown} of ${rows.length} packages on a landing row that links their page.`);
  }

  // Audio coaching: written while the cross-platform framework docs were
  // unreachable, so it carries no framework claim at all; every outside link
  // goes to Apple's or Google's developer docs; and every entry's sources were
  // checked on the day it was last updated.
  {
    const src = fs.readFileSync("src/data/audioCoaching.entries.ts", "utf8");
    const framework = src.match(/\b(react native|flutter|expo|capacitor)\b/i);
    if (framework) problems.push(`AUDIO-EVIDENCE  audioCoaching.entries.ts mentions "${framework[0]}" — no framework docs were verifiable for this cluster`);
    for (const m of src.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
      if (!/^https:\/\/developer\.(apple|android)\.com\//.test(m[1])) {
        problems.push(`AUDIO-EVIDENCE  audioCoaching.entries.ts links ${m[1]}, outside Apple's and Google's developer docs`);
      }
    }
    const entries = src.split(/\n {4}"slug": "/).slice(1);
    for (const e of entries) {
      const slug = e.slice(0, e.indexOf('"'));
      const updated = /"updated": "(\d{4}-\d{2}-\d{2})"/.exec(e)?.[1];
      const sourcesAt = e.indexOf('"sources": [');
      const checked = sourcesAt === -1 ? [] : [...e.slice(sourcesAt).matchAll(/"checked": "(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
      if (!checked.length) problems.push(`AUDIO-EVIDENCE  /audio-coaching/${slug} has no sources`);
      else if (checked.some((c) => c !== updated)) {
        problems.push(`AUDIO-EVIDENCE  /audio-coaching/${slug} has a source checked on a date other than its updated stamp (${updated})`);
      }
    }
    console.log(`Audio coaching: ${entries.length} entries, Apple/Google-only links, sources checked on each updated date.`);
  }

  // Health Connect error codes and SDK releases.
  {
    const src = fs.readFileSync("src/data/errorCodes.ts", "utf8");
    const constants = jsonArray(src, "HC_ERROR_CONSTANTS");
    const page = htmlOf("/error-codes/health-connect");
    if (!constants || constants.length < 9) {
      problems.push(`ERROR-CODES-ROWS  src/data/errorCodes.ts yields ${constants?.length ?? 0} HealthConnectException constants, expected at least 9`);
    } else if (!page) {
      problems.push("ERROR-CODES-ROWS  /error-codes/health-connect was not built");
    } else {
      const missing = constants.filter((c) => !page.includes(`id="code-${c.name.toLowerCase()}"`)).map((c) => c.name);
      if (missing.length) problems.push(`ERROR-CODES-ROWS  /error-codes/health-connect is missing rows for ${missing.join(", ")}`);
      else console.log(`Error codes: ${constants.length} HealthConnectException constants rendered.`);
    }
    if (!htmlOf("/error-codes")) problems.push("ERROR-CODES-ROWS  /error-codes was not built");
  }
  {
    const src = fs.readFileSync("src/data/hcReleases.ts", "utf8");
    const releases = jsonArray(src, "HC_RELEASES");
    const page = htmlOf("/health-connect-releases");
    if (!releases || releases.length < 32) {
      problems.push(`HC-RELEASES-ROWS  src/data/hcReleases.ts yields ${releases?.length ?? 0} releases, expected at least 32`);
    } else if (!page) {
      problems.push("HC-RELEASES-ROWS  /health-connect-releases was not built");
    } else {
      const missing = releases.filter((r) => !page.includes(`id="release-${r.version}"`)).map((r) => r.version);
      if (missing.length) problems.push(`HC-RELEASES-ROWS  /health-connect-releases is missing ${missing.join(", ")}`);
      else console.log(`Health Connect releases: ${releases.length} connect-client releases rendered.`);
    }
  }

  /** The HTML of one table row, from its id to its closing tag, decoded. */
  const rowOf = (html, id) => {
    const at = html.indexOf(`id="${id}"`);
    if (at === -1) return null;
    const end = html.indexOf("</tr>", at);
    return decode(html.slice(at, end === -1 ? undefined : end));
  };

  // HealthKit metadata keys. Apple's Metadata Keys collection listed 67 keys
  // on 2026-10-04 (the generator's own floor). valueType is the one derived
  // field: it must never appear without the sentence it was read from, that
  // sentence must be Apple's own text, and the page must show both together.
  {
    const src = fs.readFileSync("src/data/healthkitMetadataKeys.ts", "utf8");
    const keys = jsonArray(src, "HK_METADATA_KEYS");
    const page = htmlOf("/healthkit-metadata-keys");
    if (!keys || keys.length < 67) {
      problems.push(`HK-METADATA-ROWS  src/data/healthkitMetadataKeys.ts yields ${keys?.length ?? 0} metadata keys, expected at least 67`);
    } else if (!page) {
      problems.push("HK-METADATA-ROWS  /healthkit-metadata-keys was not built");
    } else {
      const missing = keys.filter((k) => !page.includes(`id="key-${k.swiftName.toLowerCase()}"`)).map((k) => k.swiftName);
      if (missing.length) {
        problems.push(`HK-METADATA-ROWS  /healthkit-metadata-keys is missing rows for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
      }
      let typed = 0;
      for (const k of keys) {
        if (!!k.valueType !== !!k.valueTypeEvidence) {
          problems.push(`HK-METADATA-EVIDENCE  ${k.swiftName} has ${k.valueType ? "a valueType without its evidence sentence" : "an evidence sentence without a valueType"}`);
          continue;
        }
        if (!k.valueType) continue;
        typed++;
        if (!`${k.abstract ?? ""} ${k.discussion ?? ""}`.includes(k.valueTypeEvidence)) {
          problems.push(`HK-METADATA-EVIDENCE  ${k.swiftName}'s valueTypeEvidence is not a sentence from Apple's abstract or discussion`);
        }
        const row = rowOf(page, `key-${k.swiftName.toLowerCase()}`);
        if (row && !(row.includes(k.valueType) && row.includes(k.valueTypeEvidence))) {
          problems.push(`HK-METADATA-EVIDENCE  /healthkit-metadata-keys row for ${k.swiftName} does not show its value type together with Apple's sentence`);
        }
      }
      if (!missing.length) console.log(`HealthKit metadata keys: ${keys.length} keys rendered, ${typed} with a value type and its evidence sentence.`);
    }
  }

  // Wear OS Health Services data types. Google's DataType reference listed 65
  // constants on 2026-10-04, 26 of them named in the permissions guide's table
  // (the generator's own floors). A permission is shown only where that table
  // names the constant, and the table row it came from travels with it.
  {
    const src = fs.readFileSync("src/data/healthServicesDataTypes.ts", "utf8");
    const types = jsonArray(src, "HS_DATA_TYPES");
    const tableRows = jsonArray(src, "HS_PERMISSION_ROWS") ?? [];
    const page = htmlOf("/wear-os-data-types");
    if (!types || types.length < 65) {
      problems.push(`WEAR-DATATYPE-ROWS  src/data/healthServicesDataTypes.ts yields ${types?.length ?? 0} DataType constants, expected at least 65`);
    } else if (!page) {
      problems.push("WEAR-DATATYPE-ROWS  /wear-os-data-types was not built");
    } else {
      const missing = types.filter((t) => !page.includes(`id="type-${t.name.toLowerCase()}"`)).map((t) => t.name);
      if (missing.length) {
        problems.push(`WEAR-DATATYPE-ROWS  /wear-os-data-types is missing rows for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
      }
      const withPermission = types.filter((t) => t.permission);
      if (withPermission.length < 26) {
        problems.push(`WEAR-DATATYPE-PERMS  only ${withPermission.length} DataType constants carry a permission from Google's table, expected at least 26`);
      }
      for (const t of types) {
        if (!!t.permission !== !!t.permissionEvidence) {
          problems.push(`WEAR-DATATYPE-EVIDENCE  ${t.name} has ${t.permission ? "a permission without its table row" : "a table row without a permission"}`);
          continue;
        }
        if (t.permission) {
          const source = tableRows.find((r) => r.text === t.permissionEvidence);
          if (!source || source.permission !== t.permission || !source.dataTypes.includes(t.name)) {
            problems.push(`WEAR-DATATYPE-EVIDENCE  ${t.name}'s permissionEvidence is not a row of Google's permissions table naming it under ${t.permission}`);
          }
        }
        const row = rowOf(page, `type-${t.name.toLowerCase()}`);
        if (row && (t.permission ? !row.includes(t.permission) : !row.includes("Not in table"))) {
          problems.push(`WEAR-DATATYPE-PERMS  /wear-os-data-types row for ${t.name} does not show ${t.permission ?? "that Google's table does not name it"}`);
        }
      }
      if (!missing.length) console.log(`Wear OS data types: ${types.length} constants rendered, ${withPermission.length} with a permission from Google's table.`);
    }
  }

  // Pose keypoint schemes (EXPANSION-3 2.1 and 2.2, added 2026-10-17). Nine
  // schemes read from each model's own source on 2026-10-17 (the generator's
  // exact counts). Every point must render on its scheme page with the name
  // the source spells, every scheme must have a column in the hub's
  // crosswalk, and the crosswalk may join only names that are identical once
  // lowercased with every character outside a-z0-9 removed — the rule the
  // pages state. A join that rule does not produce is a guess, and a key the
  // rule does produce but the crosswalk leaves out is a dropped mapping.
  {
    const src = fs.readFileSync("src/data/poseKeypoints.ts", "utf8");
    const schemes = jsonArray(src, "POSE_SCHEMES");
    const crosswalk = jsonArray(src, "POSE_CROSSWALK") ?? [];
    const POSE_MIN_SCHEMES = 9;
    const keyOf = (n) => n.toLowerCase().replace(/[^a-z0-9]/g, "");
    const kpId = (p) => (p.index !== null ? `kp-${p.index}` : `kp-${p.key}`);
    if (!schemes || schemes.length < POSE_MIN_SCHEMES) {
      problems.push(`POSE-KEYPOINT-ROWS  src/data/poseKeypoints.ts yields ${schemes?.length ?? 0} schemes, expected at least ${POSE_MIN_SCHEMES}`);
    } else {
      let rendered = 0;
      for (const s of schemes) {
        const page = htmlOf(`/pose-keypoints/${s.slug}`);
        if (!page) {
          problems.push(`POSE-KEYPOINT-ROWS  /pose-keypoints/${s.slug} was not built`);
          continue;
        }
        const missing = [];
        for (const p of s.points) {
          const row = rowOf(page, kpId(p));
          if (!row || !row.includes(`>${p.name}<`)) missing.push(p.index ?? p.name);
          else rendered++;
        }
        if (missing.length) {
          problems.push(`POSE-KEYPOINT-ROWS  /pose-keypoints/${s.slug} does not show the row and source name for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
        }
        for (const p of s.points) {
          if (p.key !== keyOf(p.name)) problems.push(`POSE-KEYPOINT-MAPPING  ${s.slug} ${p.name} carries the key ${p.key}, not ${keyOf(p.name)}`);
        }
      }
      const owners = new Map();
      for (const s of schemes) for (const p of s.points) (owners.get(p.key) ?? owners.set(p.key, []).get(p.key)).push(s.slug);
      for (const r of crosswalk) {
        if (r.cells.length < 2) problems.push(`POSE-KEYPOINT-MAPPING  crosswalk row ${r.key} joins ${r.cells.length} point`);
        for (const c of r.cells) {
          const point = schemes.find((x) => x.slug === c.scheme)?.points.find((x) => x.name === c.name && x.index === c.index);
          if (!point) problems.push(`POSE-KEYPOINT-MAPPING  crosswalk row ${r.key} names ${c.scheme} ${c.name}, which is not a point of that scheme`);
          else if (keyOf(c.name) !== r.key) problems.push(`POSE-KEYPOINT-MAPPING  crosswalk row ${r.key} joins ${c.scheme} ${c.name}, whose name does not normalise to ${r.key}`);
        }
      }
      for (const [k, slugs] of owners) {
        if (slugs.length > 1 && !crosswalk.some((r) => r.key === k)) problems.push(`POSE-KEYPOINT-MAPPING  ${slugs.join(" and ")} share the key ${k} but the crosswalk has no row for it`);
      }
      const hub = htmlOf("/pose-keypoints");
      if (!hub) problems.push("POSE-KEYPOINT-CROSSWALK  /pose-keypoints was not built");
      else {
        const noColumn = schemes.filter((s) => !hub.includes(`data-scheme="${s.slug}"`)).map((s) => s.slug);
        if (noColumn.length) problems.push(`POSE-KEYPOINT-CROSSWALK  the /pose-keypoints crosswalk has no column for ${noColumn.join(", ")}`);
        for (const r of crosswalk) {
          const row = rowOf(hub, `xw-${r.key}`);
          if (!row) problems.push(`POSE-KEYPOINT-CROSSWALK  /pose-keypoints has no crosswalk row for ${r.key}`);
          else {
            const absent = r.cells.filter(
              (c) => !row.includes(`href="/pose-keypoints/${c.scheme}#${c.index !== null ? `kp-${c.index}` : `kp-${keyOf(c.name)}`}"`) || !row.includes(`>${c.name}<`),
            );
            if (absent.length) problems.push(`POSE-KEYPOINT-CROSSWALK  /pose-keypoints row ${r.key} does not show ${absent.map((c) => `${c.scheme} ${c.index ?? c.name}`).join(", ")}`);
          }
        }
      }
      console.log(`Pose keypoints: ${schemes.length} schemes, ${rendered} points rendered with their source names, ${crosswalk.length} crosswalk rows, every join name-identical.`);
    }
  }

  // Google Health API reference (EXPANSION-3 1.1, added 2026-10-17). Google's
  // data-types table listed 44 data types on 2026-10-17 (the generator's own
  // floor). Every generated type must have a built page carrying its marker
  // and showing every operation (with its documented path) and every scope
  // URL the data gives it, a row in the hub's table, and every cross-check
  // flag raised for it (the hub lists the flags no type owns); the derived
  // fields must arrive with their evidence;
  // and each topic page must render every row of the generated list it
  // presents. Counts come from the generated module, never from this file.
  {
    const src = fs.readFileSync("src/data/googleHealthApi.ts", "utf8");
    const types = jsonArray(src, "GHAPI_DATA_TYPES");
    const prefix = strConst(src, "GHAPI_SCOPE_PREFIX");
    const BASE = "/google-health-api";
    const TOPICS = ["scopes", "fitbit-web-api-mapping", "access-and-limits", "webhooks", "errors"].map((s) => `${BASE}/${s}`);
    if (!types || types.length < 44) {
      problems.push(`GHAPI-TYPE-COVERAGE  src/data/googleHealthApi.ts yields ${types?.length ?? 0} data types, expected at least 44`);
    } else {
      const built = htmls
        .map(routeOf)
        .filter((r) => r.startsWith(`${BASE}/`) && r.split("/").length === 3 && !TOPICS.includes(r) && !notFoundSet.has(r));
      if (built.length !== types.length) problems.push(`GHAPI-TYPE-COVERAGE  ${built.length} data-type pages built for ${types.length} generated data types`);
      const hub = htmlOf(BASE);
      if (!hub) problems.push(`GHAPI-TYPE-COVERAGE  ${BASE} was not built`);
      const hubLinks = hub ? hrefsIn(hub) : new Set();
      let facts = 0;
      let flagsShown = 0;
      for (const t of types) {
        const route = `${BASE}/${t.dataType}`;
        const html = htmlOf(route);
        if (hub && (!hubLinks.has(route) || !hub.includes(`id="type-${t.dataType}"`))) {
          problems.push(`GHAPI-HUB-TABLE  ${BASE} has no table row linking ${route}`);
        }
        if (!html) {
          problems.push(`GHAPI-TYPE-COVERAGE  ${route} (${t.name}) has no built page`);
          continue;
        }
        if (!html.includes(`data-ghapi-type="${t.dataType}"`)) problems.push(`GHAPI-TYPE-COVERAGE  ${route} does not carry data-ghapi-type="${t.dataType}"`);
        const text = decode(html);
        for (const o of t.operations) {
          if (!html.includes(`data-ghapi-op="${o.op}"`)) problems.push(`GHAPI-TYPE-FACTS  ${route} does not show the operation ${o.op}`);
          else if (o.path && !text.includes(`${o.httpMethod} ${o.path}`)) problems.push(`GHAPI-TYPE-FACTS  ${route} does not show ${o.httpMethod} ${o.path}`);
          else facts++;
        }
        for (const s of t.scopes) {
          if (!text.includes(s.url)) problems.push(`GHAPI-TYPE-FACTS  ${route} does not show its scope ${s.url}`);
          else facts++;
        }
        const shown = (html.match(/data-ghapi-flag="/g) ?? []).length;
        if (shown < t.flags.length) problems.push(`GHAPI-FLAG-SHOWN  ${route} shows ${shown} of the ${t.flags.length} cross-check flags raised for it`);
        flagsShown += Math.min(shown, t.flags.length);
        // Derived fields and their evidence.
        if (!!t.dataPointProperty !== !!t.dataPointMatch) problems.push(`GHAPI-EVIDENCE  ${t.dataType} has a DataPoint field without the way it was matched`);
        if (t.dataPointMatch === "description" && !(t.dataPointEvidence ?? "").includes(`\`${t.dataType}\``)) {
          problems.push(`GHAPI-EVIDENCE  ${t.dataType}: the DataPoint description it was matched by does not name it`);
        }
        for (const s of t.scopes) {
          if (!prefix || s.url !== `${prefix}${s.shorthand}`) problems.push(`GHAPI-EVIDENCE  ${t.dataType}: scope ${s.url} is not the documented prefix plus ${s.shorthand}`);
        }
        for (const r of [t.rollup, t.dailyRollup]) {
          if (r && !(r.evidence ?? "").includes(`\`${t.dataType}\``)) problems.push(`GHAPI-EVIDENCE  ${t.dataType}: a rollup was matched by a description that does not name it`);
        }
        for (const o of t.operations) {
          if (o.match && o.match !== "exact" && !o.evidence) problems.push(`GHAPI-EVIDENCE  ${t.dataType}: operation ${o.op} was paired with ${o.method} without its evidence`);
        }
        for (const f of t.flags) if (!f.evidence?.length) problems.push(`GHAPI-EVIDENCE  ${t.dataType}: a ${f.kind} flag carries no evidence`);
      }
      // A flag that belongs to no data-type page (a scope one source omits, a
      // wording disagreement between two guides) is listed on the hub instead.
      {
        const typeIds = new Set(types.map((t) => t.dataType));
        const pageless = (jsonArray(src, "GHAPI_FLAGS") ?? []).filter((f) => !f.dataType || !typeIds.has(f.dataType)).length;
        const onHub = hub ? (hub.match(/data-ghapi-flag="/g) ?? []).length : 0;
        if (onHub < pageless) problems.push(`GHAPI-FLAG-SHOWN  ${BASE} shows ${onHub} of the ${pageless} cross-check flags that belong to no data-type page`);
        flagsShown += Math.min(onHub, pageless);
      }
      // The topic pages: each renders every row of the list it presents.
      const rowsOn = (route, re) => {
        const html = htmlOf(route);
        if (!html) {
          problems.push(`GHAPI-TOPIC-ROWS  ${route} was not built`);
          return null;
        }
        return new Set([...html.matchAll(re)].map((m) => m[1]));
      };
      const checkRows = (route, re, expected, what) => {
        const got = rowsOn(route, re);
        if (!got) return;
        const missing = expected.filter((x) => !got.has(x));
        if (missing.length) problems.push(`GHAPI-TOPIC-ROWS  ${route} is missing ${what}: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
      };
      checkRows(`${BASE}/scopes`, /data-ghapi-scope="([^"]+)"/g, (jsonArray(src, "GHAPI_DOCUMENTED_SCOPES") ?? []).map((s) => s.url), "documented scopes");
      checkRows(`${BASE}/errors`, /id="error-([a-z0-9_]+)"/g, (jsonArray(src, "GHAPI_ERRORS") ?? []).map((e) => e.reason.toLowerCase()), "error reasons");
      checkRows(`${BASE}/webhooks`, /id="webhook-([a-z0-9-]+)"/g, jsonArray(src, "GHAPI_WEBHOOK_TYPES") ?? [], "webhook data types");
      checkRows(`${BASE}/fitbit-web-api-mapping`, /id="map-(\d+)"/g, (jsonArray(src, "GHAPI_DATA_TYPE_MAPPING") ?? []).map((_, i) => String(i + 1)), "data-type mapping rows");
      if (!htmlOf(`${BASE}/access-and-limits`)?.includes("data-ghapi-rate-limits")) problems.push(`GHAPI-TOPIC-ROWS  ${BASE}/access-and-limits does not render the rate-limits table`);
      console.log(
        `Google Health API: ${built.length} data-type pages for ${types.length} types, ${facts} operations and scopes shown, ${flagsShown} cross-check flags shown, ${TOPICS.length} topic pages checked.`,
      );
    }
  }

  // MCP servers for health and fitness data (EXPANSION-3 2.5), generated from
  // the official MCP Registry. Three things are held: every generated server
  // has its row on /health-mcp-servers and the generator's own floor is met;
  // no row says "official" unless the generator set publisherIsVendor, and a
  // server it did set it for really sits under the reverse-DNS form of a
  // domain the generator lists for a source the server names; and every term
  // a server was kept for is in the field the match names — the evidence the
  // listing rests on.
  {
    const src = fs.readFileSync("src/data/mcpHealthServers.ts", "utf8");
    const servers = jsonArray(src, "MCP_HEALTH_SERVERS");
    const terms = jsonArray(src, "MCP_SERVER_TERMS") ?? [];
    const floor = numConst(src, "MCP_SERVERS_EXPECTED_MIN");
    const page = htmlOf("/health-mcp-servers");
    if (!servers || !floor || servers.length < floor) {
      problems.push(`MCP-SERVER-ROWS  src/data/mcpHealthServers.ts yields ${servers?.length ?? 0} servers, below its floor MCP_SERVERS_EXPECTED_MIN (${floor})`);
    } else if (!page) {
      problems.push("MCP-SERVER-ROWS  /health-mcp-servers was not built");
    } else {
      /** The <tr …>…</tr> carrying an id, decoded. */
      const trOf = (id) => {
        const at = page.indexOf(`id="${id}"`);
        if (at === -1) return null;
        const start = page.lastIndexOf("<tr", at);
        const end = page.indexOf("</tr>", at);
        return decode(page.slice(start, end === -1 ? undefined : end));
      };
      const rendered = new Set([...page.matchAll(/data-mcp-server="([^"]+)"/g)].map((m) => decode(m[1])));
      const missing = servers.filter((s) => !rendered.has(s.name) || !page.includes(`id="server-${s.slug}"`)).map((s) => s.name);
      if (missing.length) {
        problems.push(`MCP-SERVER-ROWS  /health-mcp-servers is missing rows for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
      }
      if (rendered.size !== servers.length) {
        problems.push(`MCP-SERVER-ROWS  /health-mcp-servers renders ${rendered.size} server rows for ${servers.length} generated servers`);
      }
      const domainsOf = new Map(terms.map((t) => [t.source, t.domains ?? []]));
      const reverseDns = (d) => d.split(".").reverse().join(".");
      let official = 0;
      for (const s of servers) {
        const row = trOf(`server-${s.slug}`);
        if (!row) continue;
        const saysOfficial = /data-publisher="official"/.test(row) || />Official</.test(row);
        if (saysOfficial && !s.publisherIsVendor) {
          problems.push(`MCP-SERVER-OFFICIAL  /health-mcp-servers labels ${s.name} official, but the generator did not set publisherIsVendor`);
        }
        if (s.publisherIsVendor) {
          official++;
          if (!saysOfficial) problems.push(`MCP-SERVER-OFFICIAL  ${s.name} has publisherIsVendor but its row does not say official`);
          const ns = String(s.namespace).toLowerCase();
          const vendorDomain = s.sources
            .flatMap((k) => domainsOf.get(k) ?? [])
            .find((d) => ns === reverseDns(d) || ns.startsWith(`${reverseDns(d)}.`));
          if (!vendorDomain || !s.publisherEvidence) {
            problems.push(`MCP-SERVER-OFFICIAL  ${s.name} has publisherIsVendor, but its namespace is not the reverse-DNS form of a domain listed for a source it names`);
          }
        }
      }
      const fieldsOf = (s) => ({ name: s.name.replace(/[/._-]+/g, " "), title: s.title ?? "", description: s.description ?? "" });
      for (const s of servers) {
        if (!s.matches?.length) {
          problems.push(`MCP-SERVER-EVIDENCE  ${s.name} is listed without a matched term`);
          continue;
        }
        const f = fieldsOf(s);
        for (const m of s.matches) {
          if (!f[m.field]?.includes(m.text) || (m.context && !f[m.context.field]?.includes(m.context.text))) {
            problems.push(`MCP-SERVER-EVIDENCE  ${s.name}: the match for "${m.term}" is not in its ${m.field}`);
          }
        }
        const row = trOf(`server-${s.slug}`);
        if (row && !row.includes(s.description)) {
          problems.push(`MCP-SERVER-EVIDENCE  /health-mcp-servers row for ${s.name} does not quote its registry description`);
        }
      }
      if (!missing.length) console.log(`MCP servers: ${servers.length} rendered on /health-mcp-servers (floor ${floor}), ${official} under a vendor's own namespace.`);
    }
  }

  // Bluetooth GATT reference (ops/EXPANSION-3-2026-10-17.md item 4.3, added
  // 2026-10-17). The Bluetooth SIG's repository read that day gave 97 in-scope
  // characteristics, 90 with a gss structure and 44 passing the thin-page rule
  // (the generator's own floors). The failure that matters is the quiet one:
  // a page that builds and reads fine with a field missing from its layout,
  // or a hub that drops a characteristic. So the hub must carry a row for
  // every in-scope characteristic and link every page; every page must show
  // every structure field (name, type and size as published) and render every
  // definition and struct row the SIG's file gives; the thin-page rule must
  // hold both ways; and a derived value must travel with its line.
  {
    const src = fs.readFileSync("src/data/bluetoothGatt.ts", "utf8");
    const chars = jsonArray(src, "BT_CHARACTERISTICS");
    const hub = htmlOf("/bluetooth-fitness");
    if (!chars || chars.length < 97) {
      problems.push(`BT-GATT-ROWS  src/data/bluetoothGatt.ts yields ${chars?.length ?? 0} characteristics, expected at least 97`);
    } else if (!hub) {
      problems.push("BT-GATT-ROWS  /bluetooth-fitness was not built");
    } else {
      const withStructure = chars.filter((c) => c.gss);
      const eligible = chars.filter((c) => c.hasPage);
      if (withStructure.length < 90) problems.push(`BT-GATT-ROWS  only ${withStructure.length} characteristics carry a gss structure, expected at least 90`);
      if (eligible.length < 44) problems.push(`BT-GATT-ROWS  only ${eligible.length} characteristics pass the thin-page rule, expected at least 44`);
      const hubLinks = hrefsIn(hub);
      for (const c of chars) {
        if (!hub.includes(`id="char-${c.slug}"`)) {
          problems.push(`BT-GATT-HUB  /bluetooth-fitness has no row for ${c.name} (${c.uuid})`);
        } else if (c.gss && !c.hasPage) {
          // A structure the thin-page rule keeps on the hub is shown there, in its row.
          const row = rowOf(hub, `char-${c.slug}`) ?? "";
          for (const f of c.gss.structure) {
            if (!row.includes(f.name) || !row.includes(f.type) || !row.includes(f.size)) {
              problems.push(`BT-GATT-HUB  /bluetooth-fitness row for ${c.name} does not show its field ${f.name} (${f.type}, ${f.size})`);
            }
          }
        }
        const passes = !!c.gss && (c.gss.structure.length >= 2 || c.gss.flagsFields.length > 0);
        if (passes !== c.hasPage) problems.push(`BT-GATT-THIN  ${c.name} is marked hasPage=${c.hasPage} but the rule (two fields or a flags field) says ${passes}`);
      }
      const want = new Set(eligible.map((c) => `/bluetooth-fitness/${c.slug}`));
      for (const r of htmls.map(routeOf).filter((r) => /^\/bluetooth-fitness\/[a-z0-9-]+$/.test(r) && !notFoundSet.has(r))) {
        if (!want.has(r)) problems.push(`BT-GATT-THIN  ${r} is built, but its characteristic does not pass the thin-page rule`);
      }
      const norm = (s) => String(s).replace(/\s+/g, " ").trim();
      let fieldsShown = 0;
      for (const c of eligible) {
        const route = `/bluetooth-fitness/${c.slug}`;
        const html = htmlOf(route);
        if (!html) {
          problems.push(`BT-GATT-ROWS  ${route} (${c.name}) has no built page`);
          continue;
        }
        if (!html.includes(`data-bt-characteristic="${c.id}"`)) problems.push(`BT-GATT-ROWS  ${route} does not carry data-bt-characteristic="${c.id}"`);
        if (!hubLinks.has(route)) problems.push(`BT-GATT-HUB  /bluetooth-fitness does not link ${route}`);
        for (const f of c.gss.structure) {
          const row = rowOf(html, f.anchor);
          if (!row) {
            problems.push(`BT-GATT-FIELDS  ${route} has no layout row for ${f.name}`);
            continue;
          }
          if (!row.includes(f.name) || !row.includes(f.type) || !row.includes(f.size)) {
            problems.push(`BT-GATT-FIELDS  ${route} row for ${f.name} does not show its name, type "${f.type}" and size "${f.size}"`);
            continue;
          }
          fieldsShown++;
          for (const u of f.units) {
            if (!u.evidence.includes(u.id) || !norm(f.description).includes(norm(u.evidence))) {
              problems.push(`BT-GATT-EVIDENCE  ${c.name} ${f.name}: unit ${u.id} is not on a line of the field's own text`);
            }
          }
          if (f.presence) {
            if (!f.description.split("\n").map((l) => l.trim()).includes(f.presence.evidence)) {
              problems.push(`BT-GATT-EVIDENCE  ${c.name} ${f.name}: its flag condition is not a "Present if" line of the field's own text`);
            } else if (!row.includes(`Bit ${f.presence.bit} of ${f.presence.field} is ${f.presence.value}`)) {
              problems.push(`BT-GATT-EVIDENCE  ${route} row for ${f.name} does not show the condition its "Present if" line states`);
            }
          }
        }
        const defs = [];
        const walk = (ds) => ds.forEach((d) => (defs.push(d), walk(d.subfields)));
        walk(c.gss.definitions);
        for (const d of defs) {
          if (!html.includes(`id="${d.anchor}"`)) problems.push(`BT-GATT-FIELDS  ${route} does not render the SIG's "${d.name}" definition`);
          for (const s of d.layout ?? []) {
            if (!html.includes(`id="${s.anchor}"`)) problems.push(`BT-GATT-FIELDS  ${route} does not render ${d.name} › ${s.name}`);
          }
        }
      }
      console.log(
        `Bluetooth GATT: ${chars.length} characteristics with a hub row, ${eligible.length} pages, ${fieldsShown} structure fields shown with name, type and size.`,
      );
    }
  }

  // Workout types across four platforms (added 2026-10-18). Apple's
  // HKWorkoutActivityType (84 cases), Health Connect's ExerciseSessionRecord
  // EXERCISE_TYPE_* (61), Wear OS Health Services' ExerciseType (85 public) and
  // the Google Health API's exerciseType enum (182), as the generator read
  // them on 2026-10-18 (its own exact counts; these are the floors). Every
  // constant must render on its platform page under the name its source
  // spells; the crosswalk may join only constants whose names are identical
  // after the one stated normalisation, and must not leave out a key two
  // platforms share; a mapping a source states must carry that source's row;
  // the activity pages must be exactly the rows the page rule passes, each
  // showing the evidence for every fact it counts; and every published
  // disagreement between sources must be on the hub.
  {
    const src = fs.readFileSync("src/data/workoutTypes.ts", "utf8");
    const BASE = "/workout-types";
    const FLOORS = { healthkit: 84, "health-connect": 61, "wear-os": 85, "google-health-api": 182 };
    const lists = {
      healthkit: jsonArray(src, "WT_HEALTHKIT"),
      "health-connect": jsonArray(src, "WT_HEALTH_CONNECT"),
      "wear-os": jsonArray(src, "WT_WEAR_OS"),
      "google-health-api": jsonArray(src, "WT_GOOGLE_HEALTH_API"),
    };
    const crosswalk = jsonArray(src, "WT_CROSSWALK") ?? [];
    const stated = jsonArray(src, "WT_STATED_MAPPINGS") ?? [];
    const flags = jsonArray(src, "WT_FLAGS") ?? [];
    const sources = jsonArray(src, "WT_SOURCES") ?? [];
    const nameOf = { healthkit: (r) => r.case, "health-connect": (r) => r.name, "wear-os": (r) => r.name, "google-health-api": (r) => r.value };
    const keyOf = (n) => n.replace(/^EXERCISE_TYPE_/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const rowId = (n) => `t-${n.toLowerCase()}`;
    const norm = (t) => String(t ?? "").replace(/`/g, "").replace(/\s+/g, " ").trim();
    const plain = (html) => norm(decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " ")));
    const short = Object.entries(FLOORS).filter(([p, n]) => !lists[p] || lists[p].length < n);
    if (short.length) {
      problems.push(`WORKOUT-TYPE-ROWS  src/data/workoutTypes.ts yields ${short.map(([p]) => `${lists[p]?.length ?? 0} ${p}`).join(", ")} constants, expected at least ${short.map(([p, n]) => `${n} ${p}`).join(", ")}`);
    } else {
      // 1. Every constant on its platform page, under its own spelling.
      let rendered = 0;
      for (const [p, rows] of Object.entries(lists)) {
        const route = `${BASE}/${p}`;
        const page = notFoundSet.has(route) ? null : htmlOf(route);
        if (!page || !page.includes(`data-wt-list="${p}"`)) {
          problems.push(`WORKOUT-TYPE-ROWS  ${route} was not built or renders no data-wt-list="${p}" table`);
          continue;
        }
        const missing = [];
        for (const r of rows) {
          const row = rowOf(page, rowId(nameOf[p](r)));
          if (!row || !row.includes(`>${nameOf[p](r)}<`)) missing.push(nameOf[p](r));
          else rendered++;
        }
        if (missing.length) problems.push(`WORKOUT-TYPE-ROWS  ${route} does not show the row and source spelling for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
      }
      // 2. The join: keys, counterparts and crosswalk rows are name identity and nothing else.
      const owners = new Map();
      for (const [p, rows] of Object.entries(lists)) {
        for (const r of rows) {
          const n = nameOf[p](r);
          if (r.key !== keyOf(n)) problems.push(`WORKOUT-TYPE-MAPPING  ${p} ${n} carries the key ${r.key}, not ${keyOf(n)}`);
          (owners.get(keyOf(n)) ?? owners.set(keyOf(n), []).get(keyOf(n))).push({ platform: p, name: n });
        }
      }
      for (const [k, cells] of owners) {
        const plats = cells.map((c) => c.platform);
        if (new Set(plats).size !== plats.length) problems.push(`WORKOUT-TYPE-MAPPING  two constants of one platform normalise to ${k}: ${cells.map((c) => `${c.platform} ${c.name}`).join(", ")}`);
        if (cells.length > 1 && !crosswalk.some((r) => r.key === k)) problems.push(`WORKOUT-TYPE-MAPPING  ${cells.map((c) => `${c.platform} ${c.name}`).join(" and ")} share the key ${k} but the crosswalk has no row for it`);
      }
      for (const [p, rows] of Object.entries(lists)) {
        for (const r of rows) {
          const want = owners.get(r.key).filter((c) => c.platform !== p).map((c) => `${c.platform}:${c.name}`).sort().join(",");
          const got = (r.counterparts ?? []).map((c) => `${c.platform}:${c.name}`).sort().join(",");
          if (want !== got) problems.push(`WORKOUT-TYPE-MAPPING  ${p} ${nameOf[p](r)} lists counterparts [${got}] where the names give [${want}]`);
        }
      }
      for (const r of crosswalk) {
        if (r.cells.length < 2 || new Set(r.cells.map((c) => c.platform)).size !== r.cells.length) problems.push(`WORKOUT-TYPE-MAPPING  crosswalk row ${r.key} does not join constants of at least two different platforms`);
        for (const c of r.cells) {
          const known = (lists[c.platform] ?? []).some((x) => nameOf[c.platform](x) === c.name);
          if (!known) problems.push(`WORKOUT-TYPE-MAPPING  crosswalk row ${r.key} names ${c.platform} ${c.name}, which is not a constant of that platform`);
          else if (keyOf(c.name) !== r.key) problems.push(`WORKOUT-TYPE-MAPPING  crosswalk row ${r.key} joins ${c.platform} ${c.name}, whose name does not normalise to ${r.key}`);
        }
      }
      for (const m of stated) {
        const ok = [m.from, m.to].every((c) => (lists[c?.platform] ?? []).some((x) => nameOf[c.platform](x) === c.name));
        if (!ok || m.from.platform === m.to.platform || !sources.some((x) => x.id === m.sourceId) || !m.url || !String(m.evidence ?? "").trim()) {
          problems.push(`WORKOUT-TYPE-MAPPING  a stated mapping (${m.from?.name} → ${m.to?.name}) lacks a known source, its URL, the source's row, or two real constants of two platforms`);
        }
      }
      // 3. The hub: a column per platform, a row per crosswalk key, every cell linked and spelled.
      const hub = notFoundSet.has(BASE) ? null : htmlOf(BASE);
      if (!hub || !hub.includes("data-wt-crosswalk")) problems.push(`WORKOUT-TYPE-CROSSWALK  ${BASE} was not built or renders no crosswalk`);
      else {
        const noColumn = Object.keys(lists).filter((p) => !hub.includes(`data-platform="${p}"`));
        if (noColumn.length) problems.push(`WORKOUT-TYPE-CROSSWALK  the ${BASE} crosswalk has no column for ${noColumn.join(", ")}`);
        for (const r of crosswalk) {
          const row = rowOf(hub, `xw-${r.key}`);
          if (!row) {
            problems.push(`WORKOUT-TYPE-CROSSWALK  ${BASE} has no crosswalk row for ${r.key}`);
            continue;
          }
          const absent = r.cells.filter((c) => !row.includes(`href="${BASE}/${c.platform}#${rowId(c.name)}"`) || !row.includes(`>${c.name}<`));
          if (absent.length) problems.push(`WORKOUT-TYPE-CROSSWALK  ${BASE} row ${r.key} does not link and spell ${absent.map((c) => `${c.platform} ${c.name}`).join(", ")}`);
        }
        const shown = (hub.match(/data-wt-flag="/g) ?? []).length;
        if (shown < flags.length) problems.push(`WORKOUT-TYPE-FLAG-SHOWN  ${BASE} shows ${shown} of the ${flags.length} disagreements the generator published`);
        for (const p of Object.keys(lists)) {
          const own = flags.filter((f) => f.platform === p).length;
          const page = htmlOf(`${BASE}/${p}`);
          const onPage = page ? (page.match(/data-wt-flag="/g) ?? []).length : 0;
          if (onPage < own) problems.push(`WORKOUT-TYPE-FLAG-SHOWN  ${BASE}/${p} shows ${onPage} of the ${own} disagreements that concern it`);
        }
      }
      // 4. The page rule, recomputed from the generated module.
      const find = (p, n) => (lists[p] ?? []).find((x) => nameOf[p](x) === n);
      const factsOf = (row) => {
        const out = [];
        for (const c of row.cells) {
          const x = find(c.platform, c.name);
          if (!x) continue;
          if (c.platform === "healthkit") {
            if (x.discussion?.length) out.push(["hk-discussion", x.discussion]);
            if (x.deprecation?.message) out.push(["hk-deprecation", [x.deprecation.message]]);
          } else if (c.platform === "health-connect") {
            if (x.segments?.rule !== "universal-only" && x.segments?.evidence) out.push(["hc-segments", [x.segments.evidence]]);
            if (x.description) out.push(["hc-description", [x.description]]);
            if (x.platform?.deprecationNote) out.push(["hc-platform-deprecation", [x.platform.deprecationNote]]);
          } else if (c.platform === "wear-os") {
            if (x.description) out.push(["hs-description", [x.description]]);
          }
        }
        return out;
      };
      const qualifying = crosswalk.filter((r) => r.cells.length >= 3 && factsOf(r).length >= 2);
      const want = new Map(qualifying.map((r) => [`${BASE}/${r.slug}`, r]));
      const built = htmls
        .map(routeOf)
        .filter((r) => r.startsWith(`${BASE}/`) && r.split("/").length === 3 && !notFoundSet.has(r) && !Object.keys(lists).includes(r.split("/")[2]));
      for (const r of built) if (!want.has(r)) problems.push(`WORKOUT-TYPE-PAGE-RULE  ${r} is built, but no crosswalk row passes the page rule for it`);
      let pages = 0;
      for (const [route, r] of want) {
        const html = htmlOf(route);
        if (!html || notFoundSet.has(route)) {
          problems.push(`WORKOUT-TYPE-PAGE-RULE  ${r.key} passes the page rule but ${route} was not built`);
          continue;
        }
        pages++;
        const facts = factsOf(r);
        if (!html.includes(`data-wt-activity="${r.key}"`)) problems.push(`WORKOUT-TYPE-PAGE-RULE  ${route} does not carry data-wt-activity="${r.key}"`);
        const declared = (/\bdata-wt-facts="([^"]*)"/.exec(html)?.[1] ?? "").split(" ").filter(Boolean).sort().join(" ");
        if (declared !== facts.map(([k]) => k).sort().join(" ")) problems.push(`WORKOUT-TYPE-PAGE-RULE  ${route} declares facts [${declared}], the generated data gives [${facts.map(([k]) => k).join(" ")}]`);
        for (const [kind, texts] of facts) {
          const blocks = [...html.matchAll(new RegExp(`<blockquote\\b[^>]*\\bdata-evidence="${kind}"[^>]*>([\\s\\S]*?)</blockquote>`, "g"))].map((m) => plain(m[1]));
          for (const t of texts) {
            if (!blocks.some((b) => b.includes(norm(t)))) problems.push(`WORKOUT-TYPE-PAGE-RULE  ${route} counts its ${kind} fact but does not quote it in a data-evidence block`);
          }
        }
        if (hub && !hrefsIn(hub).has(route)) problems.push(`WORKOUT-TYPE-PAGE-RULE  ${BASE} does not link ${route}`);
      }
      console.log(
        `Workout types: ${rendered} constants rendered on 4 platform pages, ${crosswalk.length} name-identity rows and ${stated.length} stated mappings checked, ${pages} activity pages by the page rule, ${flags.length} source disagreements shown.`,
      );
    }
  }

  // The HealthKit ↔ Health Connect equivalents page links both query
  // clusters, so the link has to run both ways: every /healthkit-queries page
  // it maps, and the /healthkit-queries hub, must link back to it. Otherwise
  // a reader on the iOS side never finds the translation table.
  {
    const EQUIV = "/health-connect-api/healthkit-vs-health-connect-api-equivalents";
    const page = htmlOf(EQUIV);
    if (!page) {
      problems.push(`HCAPI-EQUIV-BACKLINK  ${EQUIV} was not built`);
    } else {
      const mapped = [...hrefsIn(page)].filter((h) => /^\/healthkit-queries\/[a-z0-9-]+$/.test(h));
      for (const route of ["/healthkit-queries", ...mapped]) {
        const html = htmlOf(route);
        if (html && !hrefsIn(html).has(EQUIV)) problems.push(`HCAPI-EQUIV-BACKLINK  ${route} is mapped on ${EQUIV} but does not link back to it`);
      }
      console.log(`Equivalents page: ${mapped.length} /healthkit-queries pages mapped, each checked for a link back.`);
    }
  }

  // ── Per-type reference pages (ops/EXPANSION-3-2026-10-17.md, added
  // 2026-10-17). One page per HealthKit identifier (quantity, category and
  // characteristic types) and per Wear OS Health Services DataType constant —
  // but only where the generated data holds at least two evidence-backed facts
  // specific to the type, so that no page restates a one-line abstract. The
  // rules live in src/data/hkIdentifierPages.ts and src/data/hsDataTypePages.ts;
  // they are recomputed HERE, independently, from the generated files, and the
  // build fails when the pages built differ from them in either direction (a
  // thin page shipped, a qualifying type left without one), when a page counts
  // a fact whose evidence it does not render, or when its table page does not
  // link it. Evidence is checked in the rendered text with scripts stripped, so
  // the JSON-LD and the RSC payload cannot stand in for a missing block.
  {
    const MIN_FACTS = 2;
    const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
    const textOf = (html) =>
      norm(decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<!-- -->/g, "").replace(/<[^>]+>/g, "")));
    /** The text of every element the page marks data-evidence="<key>" — the
     *  quoted blocks themselves, so an FAQ answer or the capsule that repeats
     *  a sentence cannot stand in for the block that should show it. */
    const evidenceIn = (html, keys) => {
      const out = [];
      for (const key of keys) {
        const re = new RegExp(`<(\\w+)\\b[^>]*\\bdata-evidence="${key}"[^>]*>([\\s\\S]*?)</\\1>`, "g");
        for (const m of html.matchAll(re)) out.push(textOf(m[2]));
      }
      return out;
    };
    /** [what, value, evidence keys]: the value must sit in a block marked
     *  with one of the keys, or — with no keys — anywhere in the page text. */
    const missing = (html, need) => {
      const text = textOf(html);
      return need
        .filter(([, value, keys]) => {
          const v = norm(value);
          return keys?.length ? !evidenceIn(html, keys).some((t) => t.includes(v)) : !text.includes(v);
        })
        .map(([what]) => what);
    };
    const attrOf = (html, name) => {
      const v = new RegExp(`\\b${name}="([^"]*)"`).exec(html)?.[1];
      return v === undefined ? null : decode(v);
    };
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
    /** The JS string literal after `key:` inside one object block of matrix.ts. */
    const literal = (block, key) => {
      const m = new RegExp(`\\b${key}:\\s+"((?:[^"\\\\]|\\\\.)*)"`).exec(block);
      if (!m) return null;
      try { return JSON.parse(`"${m[1]}"`); } catch { return m[1]; }
    };
    const builtUnder = (prefix) =>
      htmls.map(routeOf).filter((r) => r.startsWith(`${prefix}/`) && r.split("/").length === 3 && !notFoundSet.has(r));

    // HealthKit identifiers.
    let hkBuilt = 0;
    let hkHeld = 0;
    let hkLinked = 0;
    {
      const FAMILIES = ["quantity", "category", "characteristic"];
      const ids = jsonArray(fs.readFileSync("src/data/healthkitIdentifiers.ts", "utf8"), "HK_IDENTIFIERS") ?? [];
      const readOnly = new Map(
        (jsonArray(fs.readFileSync("src/data/healthkitWritability.ts", "utf8"), "HK_READONLY") ?? []).map((r) => [r.case, r.evidence]),
      );
      const keys = jsonArray(fs.readFileSync("src/data/healthkitMetadataKeys.ts", "utf8"), "HK_METADATA_KEYS") ?? [];
      const matrixSrc = fs.readFileSync("src/data/matrix.ts", "utf8");
      const rows = [...matrixSrc.matchAll(/\{\s*id: "([a-z0-9-]+)",([\s\S]*?)\n {2}\},?/g)].map((m) => ({
        id: m[1],
        label: literal(m[2], "label"),
        apple: literal(m[2], "apple") ?? "",
        android: literal(m[2], "android") ?? "",
        watchOut: literal(m[2], "watchOut"),
      }));
      // Same parse as MetricFacts.appleCases: drop parentheticals, then read
      // ".case" with or without its HK…TypeIdentifier prefix.
      const appleCases = (apple) =>
        [...apple.replace(/\([^)]*\)/g, " ").matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
      const slug = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
      const unitEvidence = (i) =>
        i.unitFamily && i.aggregationEvidence && new RegExp(`\\buses?\\s+${esc(i.unitFamily)}\\s+units\\b`, "i").test(i.aggregationEvidence)
          ? i.aggregationEvidence
          : null;
      const tiesOf = (i) => {
        const re = new RegExp(`\\b(?:${i.case}|${i.objc})\\b`);
        return keys.filter((k) => re.test([k.abstract, k.discussion].filter(Boolean).join(" ")));
      };
      const rowOfCase = (i) => rows.find((r) => appleCases(r.apple).includes(i.case)) ?? null;
      const factsOf = (i) => {
        const f = [];
        if (i.family === "quantity" && i.aggregation && i.aggregationEvidence) f.push("aggregation");
        if (i.family === "quantity" && unitEvidence(i)) f.push("unit-family");
        if (i.family === "category" && i.valueEnum) f.push("value-enum");
        if (readOnly.has(i.case)) f.push("read-only");
        if (rowOfCase(i)) f.push("cross-platform");
        if (i.deprecated && i.deprecation?.message) f.push("deprecation");
        if (tiesOf(i).length) f.push("metadata-key");
        return f;
      };
      const qualifies = (i) =>
        FAMILIES.includes(i.family) &&
        i.abstract.trim().length > 0 &&
        i.platforms.some((p) => p.introducedAt) &&
        factsOf(i).length >= MIN_FACTS;

      if (ids.length < 241 || rows.length < 10) {
        problems.push(`TYPE-PAGE-RULE  read ${ids.length} HealthKit identifiers and ${rows.length} matrix rows — the rule cannot be recomputed`);
      }
      const table = htmlOf("/healthkit-identifiers");
      if (!table) problems.push("TYPE-PAGE-UNLINKED  /healthkit-identifiers was not built, so no identifier page is linked from it");
      const tableLinks = table ? hrefsIn(table) : new Set();
      const byCase = new Map(ids.map((i) => [i.case, i]));

      for (const i of ids.filter((x) => FAMILIES.includes(x.family))) {
        const route = `/healthkit-identifiers/${slug(i.case)}`;
        const html = htmlOf(route);
        const facts = factsOf(i);
        if (!qualifies(i)) {
          hkHeld++;
          if (html && html.includes(`data-hk-identifier="${i.case}"`)) {
            problems.push(`TYPE-PAGE-RULE  ${route} is built, but ${i.case} fails the thin-page rule (facts: ${facts.join(", ") || "none"})`);
          }
          continue;
        }
        if (!html) {
          problems.push(`TYPE-PAGE-RULE  ${i.case} qualifies (${facts.join(", ")}) but ${route} was not built`);
          continue;
        }
        hkBuilt++;
        if (attrOf(html, "data-hk-identifier") !== i.case) {
          problems.push(`TYPE-PAGE-RULE  ${route} does not carry data-hk-identifier="${i.case}"`);
          continue;
        }
        const declared = (attrOf(html, "data-type-facts") ?? "").split(" ").filter(Boolean);
        if (declared.length < MIN_FACTS || !sameSet(declared, facts)) {
          problems.push(`TYPE-PAGE-RULE  ${route} declares facts [${declared.join(", ")}], the generated data gives [${facts.join(", ")}]`);
        }
        if (table) {
          if (tableLinks.has(route)) hkLinked++;
          else problems.push(`TYPE-PAGE-UNLINKED  /healthkit-identifiers does not link ${route}`);
        }
        const need = [["abstract", i.abstract, ["abstract"]]];
        if (facts.includes("aggregation")) need.push(["aggregation sentence", i.aggregationEvidence, ["aggregation"]]);
        if (facts.includes("unit-family")) {
          // One stored sentence states both, so it may be quoted once, under
          // the aggregation style.
          need.push(["unit family", i.unitFamily], ["unit sentence", unitEvidence(i), ["unit-family", "aggregation"]]);
        }
        if (facts.includes("value-enum")) need.push(["value enum", i.valueEnum, ["value-enum"]]);
        if (facts.includes("read-only")) need.push(["read-only sentence", readOnly.get(i.case), ["read-only"]]);
        if (facts.includes("cross-platform")) {
          const r = rowOfCase(i);
          need.push(["matrix row", r.android]);
          if (r.watchOut) need.push(["matrix caveat", r.watchOut, ["cross-platform"]]);
        }
        if (facts.includes("deprecation")) need.push(["deprecation note", i.deprecation.message, ["deprecation"]]);
        if (facts.includes("metadata-key")) {
          for (const k of tiesOf(i)) {
            const re = new RegExp(`\\b(?:${i.case}|${i.objc})\\b`);
            const sentence = [k.abstract, k.discussion].filter(Boolean).join(" ").split(/(?<=[.!?])\s+/).find((s) => re.test(s));
            need.push([`metadata key ${k.swiftName}`, k.swiftName], [`${k.swiftName} sentence`, sentence, ["metadata-key"]]);
          }
        }
        for (const what of missing(html, need)) {
          problems.push(`TYPE-PAGE-EVIDENCE  ${route} counts its ${what} but does not render it`);
        }
      }
      // A page under the prefix that names an identifier of these families
      // must be that identifier's own address (a page set for another family,
      // such as workout activity types, is not this rule's to judge).
      for (const route of builtUnder("/healthkit-identifiers")) {
        const c = attrOf(htmlOf(route) ?? "", "data-hk-identifier");
        const i = c ? byCase.get(c) : null;
        if (!c || (i && !FAMILIES.includes(i.family))) continue;
        if (!i) problems.push(`TYPE-PAGE-RULE  ${route} names ${c}, which is not in the generated identifier data`);
        else if (route !== `/healthkit-identifiers/${slug(c)}`) problems.push(`TYPE-PAGE-RULE  ${route} names ${c}, whose page is /healthkit-identifiers/${slug(c)}`);
      }
    }

    // Wear OS Health Services data types.
    let hsBuilt = 0;
    let hsHeld = 0;
    let hsLinked = 0;
    {
      const src = fs.readFileSync("src/data/healthServicesDataTypes.ts", "utf8");
      const types = jsonArray(src, "HS_DATA_TYPES") ?? [];
      const tableRows = jsonArray(src, "HS_PERMISSION_ROWS") ?? [];
      let mismatches = [];
      try {
        mismatches = JSON.parse(/export const HS_PERMISSION_TABLE_LINK_MISMATCHES[^=]*=\s*(\[.*\]);/.exec(src)?.[1] ?? "[]");
      } catch {
        problems.push("TYPE-PAGE-RULE  HS_PERMISSION_TABLE_LINK_MISMATCHES in src/data/healthServicesDataTypes.ts is unreadable");
      }
      const slug = (n) => n.toLowerCase().replace(/_/g, "-");
      const byName = new Map(types.map((t) => [t.name, t]));
      const counterpart = (t) =>
        t.dataTypeClass === "DeltaDataType"
          ? types.find((a) => a.dataTypeClass === "AggregateDataType" && (a.name === `${t.name}_TOTAL` || a.name === `${t.name}_STATS`)) ?? null
          : t.dataTypeClass === "AggregateDataType"
            ? types.find((d) => d.dataTypeClass === "DeltaDataType" && (t.name === `${d.name}_TOTAL` || t.name === `${d.name}_STATS`)) ?? null
            : null;
      const permissionRow = (t) =>
        t.permission && t.permissionEvidence
          ? tableRows.find((r) => r.text === t.permissionEvidence && r.permission === t.permission) ?? null
          : null;
      const factsOf = (t) => {
        const f = [];
        if (permissionRow(t)) f.push("permission");
        if (t.detail) f.push("detail");
        if (mismatches.some((m) => m.shown === t.name)) f.push("table-mismatch");
        if (counterpart(t)) f.push("counterpart");
        return f;
      };
      const qualifies = (t) => Boolean(t.description?.trim()) && Boolean(t.kotlinType) && factsOf(t).length >= MIN_FACTS;

      if (types.length < 65) problems.push(`TYPE-PAGE-RULE  read ${types.length} Health Services DataType constants — the rule cannot be recomputed`);
      const table = htmlOf("/wear-os-data-types");
      if (!table) problems.push("TYPE-PAGE-UNLINKED  /wear-os-data-types was not built, so no data-type page is linked from it");
      const tableLinks = table ? hrefsIn(table) : new Set();

      for (const t of types) {
        const route = `/wear-os-data-types/${slug(t.name)}`;
        const html = htmlOf(route);
        const facts = factsOf(t);
        if (!qualifies(t)) {
          hsHeld++;
          if (html && html.includes(`data-wear-datatype="${t.name}"`)) {
            problems.push(`TYPE-PAGE-RULE  ${route} is built, but ${t.name} fails the thin-page rule (facts: ${facts.join(", ") || "none"})`);
          }
          continue;
        }
        if (!html) {
          problems.push(`TYPE-PAGE-RULE  ${t.name} qualifies (${facts.join(", ")}) but ${route} was not built`);
          continue;
        }
        hsBuilt++;
        if (attrOf(html, "data-wear-datatype") !== t.name) {
          problems.push(`TYPE-PAGE-RULE  ${route} does not carry data-wear-datatype="${t.name}"`);
          continue;
        }
        const declared = (attrOf(html, "data-type-facts") ?? "").split(" ").filter(Boolean);
        if (declared.length < MIN_FACTS || !sameSet(declared, facts)) {
          problems.push(`TYPE-PAGE-RULE  ${route} declares facts [${declared.join(", ")}], the generated data gives [${facts.join(", ")}]`);
        }
        if (table) {
          if (tableLinks.has(route)) hsLinked++;
          else problems.push(`TYPE-PAGE-UNLINKED  /wear-os-data-types does not link ${route}`);
        }
        const need = [["description", t.description, ["description"]]];
        if (facts.includes("permission")) {
          need.push(["permission", t.permission], ["permissions-table row", t.permissionEvidence, ["permission"]]);
        }
        if (facts.includes("detail")) need.push(["further paragraph", t.detail, ["detail"]]);
        if (facts.includes("table-mismatch")) {
          for (const m of mismatches.filter((x) => x.shown === t.name)) {
            need.push(["table quirk", `the link on ${m.shown} points to #${m.linksTo}`, ["table-mismatch"]]);
          }
        }
        if (facts.includes("counterpart")) {
          const c = counterpart(t);
          need.push(["counterpart", c.name], ["counterpart's description", c.description, ["counterpart"]]);
        }
        for (const what of missing(html, need)) {
          problems.push(`TYPE-PAGE-EVIDENCE  ${route} counts its ${what} but does not render it`);
        }
      }
      for (const route of builtUnder("/wear-os-data-types")) {
        const n = attrOf(htmlOf(route) ?? "", "data-wear-datatype");
        if (!n) continue;
        if (!byName.has(n)) problems.push(`TYPE-PAGE-RULE  ${route} names ${n}, which is not in the generated DataType data`);
        else if (route !== `/wear-os-data-types/${slug(n)}`) problems.push(`TYPE-PAGE-RULE  ${route} names ${n}, whose page is /wear-os-data-types/${slug(n)}`);
      }
    }
    console.log(
      `Type pages: ${hkBuilt} HealthKit identifier pages (${hkHeld} held back by the thin-page rule), ` +
        `${hsBuilt} Wear OS data-type pages (${hsHeld} held back); ${hkLinked + hsLinked} linked from their table pages.`,
    );
  }

  // ── One metric across platforms (ops/EXPANSION-3-2026-10-17.md 1.8, added
  // 2026-10-18). src/data/metricTypeMap.ts pairs each /data guide with the
  // type that carries its metric on each platform with a generated reference
  // here — Google Health API, HealthKit, Health Connect, Wear OS, Bluetooth —
  // and every pairing quotes the platform's own description of the type as
  // its evidence. That quote is a claim about a generated file, so it is
  // re-read here from the generated modules, independently of the TS code:
  // a regeneration that rewords or drops the sentence fails the build instead
  // of leaving the pairing standing on words Google or Apple no longer print.
  // A mapped type must have a built page, and the two directions must agree:
  // the guide's By platform block links exactly the mapped type pages, and
  // each mapped type page links the guide (data-metric-guide), no more.
  {
    const MAP_SRC = "src/data/metricTypeMap.ts";
    const map = jsonArray(fs.readFileSync(MAP_SRC, "utf8"), "METRIC_TYPE_MAP");
    /** The object literal assigned to `export const <name>` in a generated module. */
    const jsonObject = (src, name) => {
      const m = new RegExp(`export const ${name}: [^=]+= `).exec(src);
      if (!m) return null;
      const open = m.index + m[0].length;
      const end = src.indexOf("\n};", open);
      if (end === -1) return null;
      try { return JSON.parse(src.slice(open, end + 3).trim().replace(/;$/, "")); } catch { return null; }
    };
    const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
    const attr = (tag, name) => {
      const v = new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
      return v === undefined ? null : decode(v);
    };
    const anchors = (html) => [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);

    const gSrc = fs.readFileSync("src/data/googleHealthApi.ts", "utf8");
    const gTypes = jsonArray(gSrc, "GHAPI_DATA_TYPES") ?? [];
    const gSchemas = jsonObject(gSrc, "GHAPI_SCHEMAS") ?? {};
    const hkIds = jsonArray(fs.readFileSync("src/data/healthkitIdentifiers.ts", "utf8"), "HK_IDENTIFIERS") ?? [];
    const hcRecs = jsonArray(fs.readFileSync("src/data/healthConnectRecords.ts", "utf8"), "HC_RECORDS") ?? [];
    const hsTypes = jsonArray(fs.readFileSync("src/data/healthServicesDataTypes.ts", "utf8"), "HS_DATA_TYPES") ?? [];
    const btChars = jsonArray(fs.readFileSync("src/data/bluetoothGatt.ts", "utf8"), "BT_CHARACTERISTICS") ?? [];
    const matrixSrc = fs.readFileSync("src/data/matrix.ts", "utf8");
    const matrixRows = [...matrixSrc.matchAll(/\{\s*id: "([a-z0-9-]+)",([\s\S]*?)\n {2}\},?/g)].map((m) => {
      const lit = (key) => {
        const v = new RegExp(`\\b${key}:\\s+"((?:[^"\\\\]|\\\\.)*)"`).exec(m[2])?.[1];
        if (v === undefined) return "";
        try { return JSON.parse(`"${v}"`); } catch { return v; }
      };
      return { id: m[1], href: lit("href"), apple: lit("apple"), android: lit("android") };
    });
    const appleCasesOf = (apple) =>
      [...apple.replace(/\([^)]*\)/g, " ").matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    const hkSlug = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

    // The texts a quote may come from, per family — the type's own record and
    // nothing else, so a sentence about another type cannot stand in.
    const schemaTexts = (id, nested = []) =>
      [id, ...nested].flatMap((s) => {
        const sc = s ? gSchemas[s] : null;
        return sc ? [sc.description, ...sc.fields.map((f) => f.description)] : [];
      });
    const btTexts = (c) => {
      const out = [c.gss?.description, ...(c.gss?.structure ?? []).map((f) => f.description)];
      const walk = (defs) => {
        for (const d of defs ?? []) {
          out.push(d.description, ...d.rows.flatMap((r) => Object.values(r)));
          walk(d.subfields);
        }
      };
      walk(c.gss?.definitions);
      return out;
    };
    const TYPES = new Map(); // "family:id" -> { route, texts }
    for (const t of gTypes) {
      TYPES.set(`google-health-api:${t.dataType}`, {
        route: `/google-health-api/${t.dataType}`,
        texts: [
          ...schemaTexts(t.schema?.id, t.schema?.nested),
          t.dataPointEvidence,
          ...[t.rollup, t.dailyRollup].flatMap((r) => (r ? [r.evidence, ...schemaTexts(r.schema?.id, r.schema?.nested)] : [])),
          t.fitbit?.description,
        ],
      });
    }
    for (const i of hkIds.filter((x) => ["quantity", "category", "characteristic"].includes(x.family))) {
      TYPES.set(`healthkit:${i.case}`, { route: `/healthkit-identifiers/${hkSlug(i.case)}`, texts: [i.abstract, i.aggregationEvidence] });
    }
    for (const r of hcRecs) {
      TYPES.set(`health-connect:${r.className}`, {
        route: `/health-connect/${r.slug}`,
        texts: [...r.description, ...r.properties.map((p) => p.description), ...r.aggregateMetrics.map((a) => a.description)],
      });
    }
    for (const t of hsTypes) {
      TYPES.set(`wear-os:${t.name}`, { route: `/wear-os-data-types/${t.name.toLowerCase().replace(/_/g, "-")}`, texts: [t.description, t.detail] });
    }
    for (const c of btChars.filter((x) => x.hasPage)) {
      TYPES.set(`bluetooth:${c.id}`, { route: `/bluetooth-fitness/${c.slug}`, texts: btTexts(c) });
    }
    const keyOfRoute = new Map([...TYPES].map(([k, v]) => [v.route, k]));

    if (!map?.length) {
      problems.push(`METRIC-MAP-EVIDENCE  could not read METRIC_TYPE_MAP from ${MAP_SRC}`);
    } else if (gTypes.length < 44 || hkIds.length < 241 || hcRecs.length < 42 || hsTypes.length < 65 || btChars.length < 97 || matrixRows.length < 10) {
      problems.push(
        `METRIC-MAP-EVIDENCE  read ${gTypes.length} Google Health API types, ${hkIds.length} HealthKit identifiers, ${hcRecs.length} Health Connect records, ` +
          `${hsTypes.length} Wear OS data types, ${btChars.length} Bluetooth characteristics and ${matrixRows.length} matrix rows — the evidence cannot be re-read`,
      );
    } else {
      const mapped = new Set(); // "guide|family:id"
      let pairs = 0;
      let backLinked = 0;
      for (const g of map) {
        const guideRoute = `/data/${g.guide}`;
        const guideHtml = htmlOf(guideRoute);
        if (!guideHtml) {
          problems.push(`METRIC-MAP-NO-PAGE  ${MAP_SRC} maps the guide ${g.guide}, but ${guideRoute} is not a built page`);
          continue;
        }
        const block = new RegExp(`<section\\b[^>]*\\bdata-metric-platforms="${g.guide}"[^>]*>([\\s\\S]*?)</section>`).exec(guideHtml)?.[1] ?? null;
        if (block === null) problems.push(`METRIC-MAP-LINK  ${guideRoute} renders no By platform block (data-metric-platforms="${g.guide}")`);
        const shown = new Map(); // data-metric-type -> href, inside the block
        for (const a of anchors(block ?? "")) {
          const k = attr(a, "data-metric-type");
          if (k) shown.set(k, attr(a, "href"));
        }
        for (const t of g.types ?? []) {
          const key = `${t.family}:${t.id}`;
          mapped.add(`${g.guide}|${key}`);
          pairs++;
          const ty = TYPES.get(key);
          if (!ty) {
            problems.push(`METRIC-MAP-NO-PAGE  ${g.guide} maps ${key}, which the generated data does not contain`);
            continue;
          }
          const quote = norm(t.quote);
          if (!quote) problems.push(`METRIC-MAP-EVIDENCE  ${g.guide} maps ${key} with no quote`);
          else if (!ty.texts.some((x) => norm(x).includes(quote))) {
            problems.push(`METRIC-MAP-EVIDENCE  ${g.guide} maps ${key} on "${quote}", which is no longer in that type's generated text`);
          }
          if (t.matrixRow) {
            const row = matrixRows.find((r) => r.id === t.matrixRow);
            const names =
              row && (t.family === "healthkit" ? appleCasesOf(row.apple).includes(t.id) : t.family === "health-connect" ? new RegExp(`\\b${t.id}\\b`).test(row.android) : false);
            if (!row || row.href !== guideRoute || !names) {
              problems.push(`METRIC-MAP-EVIDENCE  ${g.guide} cites matrix row "${t.matrixRow}" for ${key}, but that row ${!row ? "does not exist" : row.href !== guideRoute ? `belongs to ${row.href}` : "does not name it"}`);
            }
          }
          const html = htmlOf(ty.route);
          if (!html) {
            problems.push(`METRIC-MAP-NO-PAGE  ${g.guide} maps ${key}, but ${ty.route} is not a built page`);
            continue;
          }
          if (block !== null && shown.get(key) !== ty.route) {
            problems.push(`METRIC-MAP-LINK  ${guideRoute} By platform block does not link ${ty.route} (${key})`);
          }
          const back = anchors(html).some((a) => attr(a, "data-metric-guide") === g.guide && attr(a, "href") === guideRoute);
          if (back) backLinked++;
          else problems.push(`METRIC-MAP-LINK  ${ty.route} does not link its metric guide ${guideRoute} (data-metric-guide="${g.guide}")`);
        }
        for (const [k, href] of shown) {
          if (!mapped.has(`${g.guide}|${k}`)) problems.push(`METRIC-MAP-LINK  ${guideRoute} By platform block links ${href} (${k}), which ${MAP_SRC} does not map to it`);
        }
      }
      // The other direction: a type page may claim only the guides that map it.
      for (const [route, key] of keyOfRoute) {
        const html = htmlOf(route);
        if (!html) continue;
        for (const a of anchors(html)) {
          const slug = attr(a, "data-metric-guide");
          if (slug && !mapped.has(`${slug}|${key}`)) {
            problems.push(`METRIC-MAP-LINK  ${route} links /data/${slug} as its metric guide, but ${MAP_SRC} does not map ${key} there`);
          }
        }
      }
      const byFamily = {};
      for (const g of map) for (const t of g.types ?? []) byFamily[t.family] = (byFamily[t.family] ?? 0) + 1;
      console.log(
        `Metric map: ${map.length} /data guides, ${pairs} type pairings (${Object.entries(byFamily).map(([f, n]) => `${n} ${f}`).join(", ")}), ` +
          `each quote re-read from the generated modules; ${backLinked} type pages link back.`,
      );
    }
  }
}

// ── Hub at-a-glance tables and direct answers (ops/SEO-10-2026-10-27.md #9).
// /fitness-apis, /pricing, /alternatives and /compare carry a table and a
// short Q&A built by src/data/hubGlance.ts from the cost model and released
// capsules. Their promise is that they add no fact, so every rendered value
// is held here to its source: each element carries data-glance="cost:<id>:
// <field>" or "capsule:<path>" (a trailing ~ marks an excerpt), and the cost
// model is re-read from src/data/costModel.ts itself rather than from the
// module that rendered it. Every value's holding page must be linked from its
// row or answer, every link must land on a built page, the pricing table must
// carry every product, answered questions must sit in the hub's FAQPage and
// pointer-only ones (owned by another page) must not.
{
  const GLANCE_HUBS = ["/fitness-apis", "/pricing", "/alternatives", "/compare"];
  const { default: ts } = await import("typescript");
  let model = null;
  try {
    const src = fs.readFileSync("src/data/costModel.ts", "utf8");
    const js = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    model = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  } catch (err) {
    problems.push(`HUB-GLANCE-SOURCE  src/data/costModel.ts could not be loaded: ${err.message}`);
  }
  const items = new Map((model?.COST_ITEMS ?? []).map((c) => [c.id, c]));
  const products = [...items.keys()].filter((id) => id !== "llm-apis");
  const norm = (s) => decode(s.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
  const fileOf = (route) => htmls.find((h) => routeOf(h) === route);
  const capsuleCache = new Map();
  const capsuleOf = (route) => {
    if (!capsuleCache.has(route)) {
      const f = fileOf(route);
      const m = f && !notFoundSet.has(route) ? /<div\b[^>]*\bid="answer"[^>]*>([\s\S]*?)<\/div>/.exec(fs.readFileSync(f, "utf8")) : null;
      capsuleCache.set(route, m ? norm(m[1]) : null);
    }
    return capsuleCache.get(route);
  };
  const NONE = "None documented.";

  /** Check one data-glance element; returns the page that holds its value, or null. */
  function checkValue(where, key, text) {
    const excerpt = key.endsWith("~");
    const k = excerpt ? key.slice(0, -1) : key;
    if (k.startsWith("cost:")) {
      const [, id, field] = k.split(":");
      const c = items.get(id);
      if (!c || !["label", "devCost", "userSideCost", "approvalGate", "notes"].includes(field)) {
        problems.push(`HUB-GLANCE-SOURCE  ${where}: "${key}" names no cost-model field`);
        return null;
      }
      const want =
        field === "devCost" ? model.DEV_COST_LABELS[c.devCost] : field === "userSideCost" || field === "approvalGate" ? (c[field] ?? NONE) : c[field];
      const ok = excerpt ? text.length >= 20 && norm(want).includes(text) : text === norm(want);
      if (!ok) problems.push(`HUB-GLANCE-VALUE  ${where}: "${text.slice(0, 80)}" is not ${excerpt ? "in " : ""}the cost model's ${id}.${field}`);
      return c.sourceHref;
    }
    if (k.startsWith("capsule:")) {
      const route = k.slice("capsule:".length);
      const cap = capsuleOf(route);
      if (cap === null) {
        problems.push(`HUB-GLANCE-SOURCE  ${where}: quotes ${route}, which has no built answer capsule`);
        return null;
      }
      if (!(excerpt ? text.length >= 20 && cap.includes(text) : text === cap)) {
        problems.push(`HUB-GLANCE-VALUE  ${where}: "${text.slice(0, 80)}" is not in ${route}'s answer capsule`);
      }
      return route;
    }
    problems.push(`HUB-GLANCE-SOURCE  ${where}: unknown source "${key}"`);
    return null;
  }

  /** Every value in a block checked, its holding page linked, every link built. */
  function checkBlock(where, inner) {
    const hrefs = new Set([...inner.matchAll(/\bhref="([^"#?]*)/g)].map((m) => m[1]));
    for (const h of hrefs) {
      if (h.startsWith("/") && (!valid.has(h) || notFoundSet.has(h))) problems.push(`HUB-GLANCE-LINK  ${where} links ${h}, which is not a built page`);
    }
    let n = 0;
    for (const m of inner.matchAll(/<(a|span)\b([^>]*\bdata-glance="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g)) {
      n++;
      const holder = checkValue(where, decode(m[3]), norm(m[4]));
      if (holder && !hrefs.has(holder)) problems.push(`HUB-GLANCE-UNLINKED  ${where}: a value from ${holder} does not link it`);
    }
    return n;
  }

  let values = 0;
  let rowsSeen = 0;
  let qaSeen = 0;
  for (const hub of GLANCE_HUBS) {
    const f = fileOf(hub);
    if (!f) {
      problems.push(`HUB-GLANCE-MISSING  ${hub} was not built`);
      continue;
    }
    const html = fs.readFileSync(f, "utf8");
    if (!html.includes(`data-hub-glance="${hub}"`) || !html.includes('id="direct-answers"')) {
      problems.push(`HUB-GLANCE-MISSING  ${hub} renders no at-a-glance table or no direct answers`);
      continue;
    }
    const rows = [...html.matchAll(/<tr\b([^>]*\bdata-glance-row\b[^>]*)>([\s\S]*?)<\/tr>/g)];
    rowsSeen += rows.length;
    const rowIds = rows.map((r) => /\bid="([^"]+)"/.exec(r[1])?.[1]);
    if (hub === "/pricing") {
      const missing = products.filter((id) => !rowIds.includes(`cost-${id}`));
      if (missing.length || rows.length !== products.length) {
        problems.push(`HUB-GLANCE-ROWS  /pricing renders ${rows.length} rows for ${products.length} cost-model products${missing.length ? ` — missing: ${missing.join(", ")}` : ""}`);
      }
    } else if (rows.length < 5) {
      problems.push(`HUB-GLANCE-ROWS  ${hub} renders ${rows.length} at-a-glance rows (at least 5)`);
    }
    for (const [i, r] of rows.entries()) {
      if (!rowIds[i]) problems.push(`HUB-GLANCE-ROWS  ${hub} row ${i + 1} has no id to cite`);
      values += checkBlock(`${hub}#${rowIds[i] ?? i + 1}`, r[2]);
    }

    // Direct answers and their markup.
    const faqNodes = [];
    for (const l of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const parsed = JSON.parse(decode(l[1]));
        for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
          if (node["@type"] === "FAQPage") faqNodes.push(...(node.mainEntity ?? []));
        }
      } catch { /* BAD-JSON-LD reports it */ }
    }
    const qaItems = [...html.matchAll(/<div\b([^>]*\bdata-hub-qa="(answer|route)"[^>]*)>\s*<h3\b[^>]*>([\s\S]*?)<\/h3>/g)];
    qaSeen += qaItems.length;
    if (qaItems.length < 3 || qaItems.length > 5) problems.push(`HUB-QA-COUNT  ${hub} renders ${qaItems.length} direct answers (3 to 5)`);
    for (const m of qaItems) {
      const id = /\bid="([^"]+)"/.exec(m[1])?.[1];
      const q = norm(m[3]);
      const node = faqNodes.find((n) => n.name === q);
      if (m[2] === "answer" && !(node && String(node.url ?? "").endsWith(`#${id}`))) {
        problems.push(`HUB-QA-MARKUP  ${hub}#${id} is answered on the hub but not in its FAQPage with that anchor`);
      }
      if (m[2] === "route" && node) problems.push(`HUB-QA-MARKUP  ${hub}#${id} points to the page that owns it but is still marked up as the hub's FAQ`);
      // The block from this item's start to the next item (or the section end).
      const start = m.index;
      const rest = html.slice(start + m[0].length);
      const stop = rest.search(/<div\b[^>]*\bdata-hub-qa="|<\/section>/);
      const block = rest.slice(0, stop === -1 ? undefined : stop);
      const parts = [...block.matchAll(/<li\b[^>]*\bdata-qa-part="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)];
      if (!parts.length) problems.push(`HUB-QA-MARKUP  ${hub}#${id} has no linked answer parts`);
      for (const p of parts) {
        if (!new RegExp(`href="${p[1].replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}"`).test(p[2])) {
          problems.push(`HUB-GLANCE-UNLINKED  ${hub}#${id}: a part does not link ${p[1]}`);
        }
        values += checkBlock(`${hub}#${id}`, p[2]);
      }
    }
  }

  // The answer surfaces list the money pages first (src/data/moneyPages.ts):
  // every released pricing, alternatives, compare and integration page must
  // sit in llms.txt's "Start here" sections and in answers.json start_here.
  const llmsBody = fs.existsSync(`${ROOT}/llms.txt.body`) ? fs.readFileSync(`${ROOT}/llms.txt.body`, "utf8") : "";
  const llmsLines = llmsBody.split("\n");
  const firstSection = llmsLines.findIndex((l) => l.startsWith("## Start here"));
  const endSection = llmsLines.findIndex((l, i) => i > firstSection && l.startsWith("## ") && !l.startsWith("## Start here"));
  const startBlock = firstSection === -1 ? "" : llmsLines.slice(firstSection, endSection === -1 ? undefined : endSection).join("\n");
  let answersStart = null;
  try {
    answersStart = JSON.parse(fs.readFileSync(`${ROOT}/answers.json.body`, "utf8")).start_here ?? null;
  } catch { /* GEO-ANSWERS-INVALID reports it */ }
  const startUrls = new Set((answersStart?.groups ?? []).flatMap((g) => g.pages.map((p) => p.url)));
  let money = 0;
  for (const h of htmls) {
    const r = routeOf(h);
    const seg = r.split("/").filter(Boolean);
    if (seg.length !== 2 || !["pricing", "alternatives", "compare", "integrate"].includes(seg[0]) || notFoundSet.has(r)) continue;
    money++;
    if (!startBlock.includes(`(https://aifitnessapi.com${r})`)) problems.push(`MONEY-UNLISTED  ${r} is not in llms.txt's Start here sections`);
    if (!startUrls.has(`https://aifitnessapi.com${r}`)) problems.push(`MONEY-UNLISTED  ${r} is not in answers.json start_here`);
  }

  // claims.json tells machine readers to cite each claim's fragment URL, so
  // every fragment has to resolve on the built page it names.
  let claimsChecked = 0;
  const claimsBody = fs.existsSync(`${ROOT}/claims.json.body`) ? fs.readFileSync(`${ROOT}/claims.json.body`, "utf8") : null;
  let claimsParsed = null;
  try {
    claimsParsed = claimsBody === null ? null : JSON.parse(claimsBody);
  } catch { /* reported below */ }
  if (!claimsParsed || !Array.isArray(claimsParsed.claims)) {
    problems.push("CLAIMS-INVALID  claims.json is missing from the build or has no claims array");
  } else {
    const idCache = new Map();
    for (const c of claimsParsed.claims) {
      const [pageUrl, fragment] = String(c.id ?? "").split("#");
      if (!fragment) continue;
      const rel = pageUrl.replace(/^https?:\/\/[^/]+/, "") || "/";
      if (!idCache.has(rel)) {
        const f = fileOf(rel);
        idCache.set(rel, f && !notFoundSet.has(rel) ? new Set([...fs.readFileSync(f, "utf8").matchAll(/\sid="([^"]*)"/g)].map((m) => m[1])) : null);
      }
      const ids = idCache.get(rel);
      if (!ids || !ids.has(fragment)) {
        problems.push(`CLAIMS-DEAD-ANCHOR  ${rel}#${fragment} does not resolve`);
        continue;
      }
      claimsChecked++;
    }
  }
  console.log(
    `Hub glance: ${rowsSeen} table rows and ${qaSeen} direct answers on ${GLANCE_HUBS.length} hubs, ${values} sourced values held to the cost model and capsules; ` +
      `${money} money pages listed first on the answer surfaces; ${claimsChecked} claim fragments resolve.`,
  );
}

// ── Translations (ops/SEO-10-2026-10-27.md item 10). A translated page is a
// second copy of claims that were verified in English, and it is only safe
// to publish while it says the same thing and never claims to be newer than
// it is. So the status is recomputed here from the English entries and the
// translation store (src/lib/translationStore.mjs, the same hash the build
// uses), and the built pages are held to it:
//
//   - a stale translation (English text changed since translatedOn) renders
//     noindex and a visible notice linking the English page, and leaves the
//     sitemap and hreflang; a current one does none of that;
//   - the translated page carries every number, external source, code span,
//     quoted source sentence and internal link the English page carries, and
//     no number or link it does not;
//   - its verification date is the English page's, labelled as such, and a
//     first-party page carries the translated disclosure.
//
// Text comparisons read the rendered HTML of both pages (capsule, body, each
// FAQ), so what is checked is what a reader gets.
{
  const { loadTranslations, loadEnglishEntries, translationStatus } = await import(
    new URL("../src/lib/translationStore.mjs", import.meta.url)
  );
  const SITE = "https://aifitnessapi.com";
  const fileByRoute = new Map(htmls.map((h) => [routeOf(h), h]));
  const htmlOf = (r) => (fileByRoute.has(r) ? fs.readFileSync(fileByRoute.get(r), "utf8") : null);
  const fullDecode = (s) =>
    decode(s)
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&nbsp;/g, " ");
  /** The outer HTML of the element whose opening tag starts at `at`, by tag depth. */
  const elementAt = (html, at) => {
    const tag = /^<([a-z0-9]+)/.exec(html.slice(at))?.[1];
    if (!tag) return "";
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
    re.lastIndex = at;
    let depth = 0;
    for (let m; (m = re.exec(html)); ) {
      if (m[0].endsWith("/>")) continue;
      depth += m[1] ? -1 : 1;
      if (depth === 0) return html.slice(at, re.lastIndex);
    }
    return html.slice(at);
  };
  const region = (html, marker) => {
    const i = html.search(marker);
    return i === -1 ? "" : elementAt(html, i);
  };
  const textOf = (h) => fullDecode(h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  const parts = (html) => {
    const faqs = [];
    for (const m of html.matchAll(/<div[^>]*\bid="faq-(\d+)"[^>]*>([\s\S]*?)<\/div>/g)) faqs[Number(m[1]) - 1] = m[2];
    return {
      capsule: region(html, /<div[^>]*\bid="answer"/),
      body: region(html, /<div[^>]*\bdata-article-body/),
      faqs,
    };
  };
  /** Digit runs with their separators removed: "1,500" and "1.500" are one number. */
  const numbers = (text) => new Set([...text.matchAll(/\d+(?:[.,]\d+)*/g)].map((m) => m[0].replace(/[.,]/g, "")));
  const hrefsOf = (h) => [...h.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => fullDecode(m[1]));
  const codesOf = (h) => new Set([...h.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/g)].map((m) => textOf(m[1]).trim()).filter(Boolean));
  const diff = (a, b) => [...a].filter((x) => !b.has(x));
  const short = (xs, n = 6) => xs.slice(0, n).join(", ") + (xs.length > n ? ` … (+${xs.length - n})` : "");

  let translations = [];
  try {
    translations = loadTranslations("pt-br");
  } catch (e) {
    problems.push(`PTBR-STORE  ${e.message}`);
  }
  const english = loadEnglishEntries([...new Set(translations.map((t) => `/${t.enPath.split("/")[1]}`))]);
  const status = new Map();
  for (const t of translations) {
    const e = english.get(t.enPath);
    const built = e && valid.has(t.enPath) && !notFoundSet.has(t.enPath);
    status.set(t.enPath, built ? translationStatus(t, e).status : "orphan");
  }
  const currentPt = new Set(translations.filter((t) => status.get(t.enPath) === "current").map((t) => t.enPath));
  /** The rule src/lib/translations.ts localizeHref applies. */
  const localize = (href) => {
    const i = href.indexOf("#");
    const p = i === -1 ? href : href.slice(0, i);
    const frag = i === -1 ? "" : href.slice(i + 1);
    if (frag && !/^(faq-\d+|answer)$/.test(frag)) return href;
    return currentPt.has(p) ? `/pt-br${href}` : href;
  };
  const sm = fs.existsSync(`${ROOT}/sitemap.xml.body`) ? fs.readFileSync(`${ROOT}/sitemap.xml.body`, "utf8") : "";
  const smRows = new Map(
    [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => [
      (/<loc>([^<]*)<\/loc>/.exec(u)?.[1] ?? "").replace(SITE, "") || "/",
      /<lastmod>([^<]*)<\/lastmod>/.exec(u)?.[1]?.slice(0, 10),
    ]),
  );
  const hreflangsOf = (html) =>
    Object.fromEntries(
      [...html.matchAll(/<link\b[^>]*\bhrefLang="([^"]+)"[^>]*>/gi)].map((m) => [m[1], /\bhref="([^"]*)"/.exec(m[0])?.[1]]),
    );
  const ptDate = (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const today = new Date().toISOString().slice(0, 10);

  let stale = 0;
  // What the faithfulness checks compared, printed so a vacuous pass shows.
  const seen = { numbers: 0, links: 0, external: 0, code: 0, quotes: 0 };
  for (const t of translations) {
    const st = status.get(t.enPath);
    const e = english.get(t.enPath);
    if (st === "orphan") {
      problems.push(`PTBR-ORPHAN  ${t.file} translates ${t.enPath}, which is not a built English page — delete the translation in the same change`);
      continue;
    }
    if (st === "stale") stale++;
    const pt = htmlOf(t.path);
    const en = htmlOf(t.enPath);
    if (!pt || notFoundSet.has(t.path)) {
      problems.push(`PTBR-NOT-BUILT  ${t.path} has a translation file but no built page`);
      continue;
    }
    const tag = `${t.path} (${st})`;

    // Status, as the page renders it, against the status computed here.
    const shown = /\bdata-ptbr-status="([a-z]+)"/.exec(pt)?.[1];
    if (shown !== st) problems.push(`PTBR-STATUS  ${t.path} renders status ${shown ?? "(none)"} but the English entry's hash says ${st}`);

    // The freshness mechanism itself.
    const robots = robotsOf(pt).join(" ");
    const notice = region(pt, /<aside[^>]*\bdata-ptbr-stale-notice/);
    const enLink = new RegExp(`href="${t.enPath}"`);
    if (st === "stale") {
      if (!/noindex/i.test(robots)) problems.push(`PTBR-STALE-RENDER  ${tag} does not render noindex`);
      if (!notice || !enLink.test(notice)) problems.push(`PTBR-STALE-RENDER  ${tag} has no stale notice linking ${t.enPath}`);
    } else {
      if (/noindex/i.test(robots)) problems.push(`PTBR-CURRENT-RENDER  ${tag} renders noindex`);
      if (notice) problems.push(`PTBR-CURRENT-RENDER  ${tag} renders the stale notice`);
    }
    const listed = smRows.has(t.path);
    if (st === "current" && (!listed || smRows.get(t.path) !== t.translatedOn)) {
      problems.push(`PTBR-SITEMAP  ${tag} ${listed ? `has lastmod ${smRows.get(t.path)}, not its translatedOn ${t.translatedOn}` : "is not in sitemap.xml"}`);
    }
    if (st === "stale" && listed) problems.push(`PTBR-SITEMAP  ${tag} is in sitemap.xml`);

    // hreflang both ways while current, on neither page once stale; the
    // language switch on the English page follows the same rule.
    const want = { en: `${SITE}${t.enPath}`, "pt-BR": `${SITE}${t.path}`, "x-default": `${SITE}${t.enPath}` };
    const enSwitch = en ? new RegExp(`<a\\b[^>]*\\bhref="${t.path}"[^>]*\\bdata-lang-switch="pt-BR"|<a\\b[^>]*\\bdata-lang-switch="pt-BR"[^>]*\\bhref="${t.path}"`).test(en) : false;
    for (const [where, html] of [["pt", pt], ["en", en ?? ""]]) {
      const got = hreflangsOf(html);
      if (st === "current") {
        for (const [k, v] of Object.entries(want)) {
          if (got[k] !== v) problems.push(`PTBR-HREFLANG  ${tag}: the ${where} page's hreflang ${k} is ${got[k] ?? "(missing)"}, expected ${v}`);
        }
      } else if (got["pt-BR"]) {
        problems.push(`PTBR-HREFLANG  ${tag}: the ${where} page still offers hreflang pt-BR`);
      }
    }
    if (st === "current" && !enSwitch) problems.push(`PTBR-HREFLANG  ${t.enPath} has no language switch to its current translation`);
    if (st === "stale" && enSwitch) problems.push(`PTBR-HREFLANG  ${t.enPath} still links its stale translation as a language switch`);
    if (canonicalOf(pt) !== `${SITE}${t.path}`) problems.push(`PTBR-CANONICAL  ${t.path} canonical is ${canonicalOf(pt)}, not itself`);

    // Dates: the English page's verification date, labelled; never a new one.
    const verified = st === "current" ? e.updated : t.sourceUpdated;
    const vAttr = /\bdata-ptbr-verified="([^"]*)"/.exec(pt)?.[1];
    const vText = `Verificado em ${ptDate(verified)} (versão em inglês)`;
    if (vAttr !== verified || !textOf(pt).includes(vText)) {
      problems.push(`PTBR-DATES  ${tag} must show "${vText}" (found data-ptbr-verified=${vAttr ?? "none"})`);
    }
    if (!(t.sourceUpdated <= t.translatedOn && t.translatedOn <= today && t.sourceUpdated <= e.updated)) {
      problems.push(`PTBR-DATES  ${t.file}: sourceUpdated ${t.sourceUpdated} / translatedOn ${t.translatedOn} out of order (English updated ${e.updated}, today ${today})`);
    }
    if (st === "current") {
      const missing = (e.sources ?? []).filter((s) => !pt.includes(`href="${s.url.replace(/&/g, "&amp;")}"`));
      if (missing.length) problems.push(`PTBR-SOURCES  ${tag} omits ${missing.length} of the English page's checked sources: ${short(missing.map((s) => s.url))}`);
    }

    // Shape: one translated FAQ per English FAQ, one step per step, the
    // English related links in the English order.
    const relHrefs = t.related.map((r) => r.href).join(" ");
    if (t.faqs.length !== e.faqs.length || t.steps.length !== (e.steps ?? []).length || relHrefs !== e.related.map((r) => r.href).join(" ")) {
      problems.push(
        `PTBR-STRUCTURE  ${t.file}: ${t.faqs.length}/${e.faqs.length} FAQs, ${t.steps.length}/${(e.steps ?? []).length} steps, related ${relHrefs === e.related.map((r) => r.href).join(" ") ? "match" : "differ from the English hrefs or order"}`,
      );
    }

    if (!en) continue;
    const P = parts(pt);
    const E = parts(en);

    // Numbers, both directions, per block.
    const blocks = [
      ["capsule", E.capsule, P.capsule],
      ["body", E.body, P.body],
      ...E.faqs.map((f, i) => [`faq-${i + 1}`, f, P.faqs[i] ?? ""]),
      ...(e.steps ?? []).map((s, i) => [`step-${i + 1}`, `${s.name} ${s.text}`, t.steps[i] ? `${t.steps[i].name} ${t.steps[i].text}` : ""]),
    ];
    for (const [where, a, b] of blocks) {
      const na = numbers(textOf(a));
      const nb = numbers(textOf(b));
      seen.numbers += na.size;
      const lost = diff(na, nb);
      const added = diff(nb, na);
      if (lost.length) problems.push(`PTBR-NUMBERS  ${t.path} ${where} drops ${short(lost)} from the English text`);
      if (added.length) problems.push(`PTBR-NUMBERS  ${t.path} ${where} adds ${short(added)} that the English text does not have`);
    }
    const metaNums = numbers(`${t.metaTitle} ${t.metaDescription} ${t.h1}`);
    const enMetaNums = numbers(`${e.metaTitle} ${e.metaDescription} ${e.h1}`);
    const metaAdded = diff(metaNums, enMetaNums);
    if (metaAdded.length) problems.push(`PTBR-NUMBERS  ${t.path} title/description/h1 add ${short(metaAdded)}`);

    // Links in the body: the English body's internal links, localized by the
    // site's rule, and its external sources — no more, no fewer.
    const enInternal = new Set([...e.body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => localize(m[1])));
    const ptHrefs = hrefsOf(P.body);
    const ptInternal = new Set(ptHrefs.filter((h) => h.startsWith("/")));
    seen.links += enInternal.size;
    const lostI = diff(enInternal, ptInternal);
    const addedI = diff(ptInternal, enInternal);
    if (lostI.length || addedI.length) {
      problems.push(`PTBR-LINKS  ${t.path} body links differ from the English body's (localized): missing ${short(lostI) || "none"}; extra ${short(addedI) || "none"}`);
    }
    const relWant = t.related.map((r) => localize(r.href));
    const relSection = (() => {
      const i = pt.search(/>Continue lendo</);
      if (i === -1) return "";
      const start = pt.lastIndexOf("<section", i);
      return start === -1 ? "" : elementAt(pt, start);
    })();
    const relGot = hrefsOf(relSection);
    if (relGot.join(" ") !== relWant.join(" ")) {
      problems.push(`PTBR-LINKS  ${t.path} related links render ${short(relGot)}, expected ${short(relWant)}`);
    }
    const enExt = new Set(hrefsOf(E.body).filter((h) => /^https?:/.test(h)));
    const ptExt = new Set(ptHrefs.filter((h) => /^https?:/.test(h)));
    seen.external += enExt.size;
    const lostX = diff(enExt, ptExt);
    const addedX = diff(ptExt, enExt);
    if (lostX.length || addedX.length) {
      problems.push(`PTBR-EXTERNAL  ${t.path} external links differ from the English body's: missing ${short(lostX) || "none"}; extra ${short(addedX) || "none"}`);
    }

    // Code and quoted source text stay exactly as in English.
    seen.code += codesOf(E.body).size;
    const lostCode = diff(codesOf(E.body), codesOf(P.body));
    if (lostCode.length) problems.push(`PTBR-CODE  ${t.path} changes or drops code spans: ${short(lostCode.map((c) => JSON.stringify(c.slice(0, 60))))}`);
    // Prose only: code carries its own quotation marks (PTBR-CODE holds it),
    // and one odd count inside a block would pair every quote after it wrongly.
    const prose = (h) => textOf(h.replace(/<pre\b[\s\S]*?<\/pre>/g, " ").replace(/<code\b[\s\S]*?<\/code>/g, " "));
    const enText = prose(E.body);
    const ptText = prose(P.body);
    const quotes = new Set();
    // Every pair is matched, short ones too ("NA"), and filtered after:
    // skipping a short pair would pair its closing mark with the next
    // opening one and read the prose between them as a quotation.
    for (const m of enText.matchAll(/"([^"]*)"|“([^”]*)”/g)) {
      const q = (m[1] ?? m[2]).trim();
      if (q.split(/\s+/).length >= 2) quotes.add(q);
    }
    // Block quotes are not collected: on this site they hold editorial
    // callouts ("Checked against Strava's own pages on …"), which translate;
    // source text is always in quotation marks.
    seen.quotes += quotes.size;
    const lostQ = [...quotes].filter((q) => !ptText.includes(q));
    if (lostQ.length) problems.push(`PTBR-QUOTES  ${t.path} does not keep ${lostQ.length} quoted source passage(s) verbatim: ${short(lostQ.map((q) => JSON.stringify(q.slice(0, 50))), 3)}`);

    // First-party pages: the translated disclosure, and KinesteX mentioned in
    // the body exactly as often as in English (no added praise, no omission).
    if (e.firstParty) {
      const disc = region(pt, /<aside[^>]*\bdata-ptbr-disclosure/);
      if (!/KinesteX/.test(disc) || !/financia este site/.test(disc)) problems.push(`PTBR-DISCLOSURE  ${t.path} is first-party but renders no translated disclosure`);
    }
    const kx = (h) => (textOf(h).match(/KinesteX/g) ?? []).length;
    if (kx(E.body) !== kx(P.body) || kx(E.capsule) !== kx(P.capsule)) {
      problems.push(`PTBR-DISCLOSURE  ${t.path} mentions KinesteX ${kx(P.body)}+${kx(P.capsule)}× (body+capsule) where English has ${kx(E.body)}+${kx(E.capsule)}×`);
    }
  }

  // Language of every page.
  for (const h of htmls) {
    const r = routeOf(h);
    if (r.startsWith("/_") || notFoundSet.has(r)) continue;
    const lang = /<html\b[^>]*\blang="([^"]*)"/.exec(fs.readFileSync(h, "utf8"))?.[1];
    const wantLang = r === "/pt-br" || r.startsWith("/pt-br/") ? "pt-BR" : "en";
    if (lang !== wantLang) problems.push(`PTBR-LANG  ${r} renders <html lang="${lang}">, expected "${wantLang}"`);
  }

  // The index: lists every built translation, and asks to be indexed only
  // with at least three current ones.
  const built = translations.filter((t) => status.get(t.enPath) !== "orphan");
  const current = built.filter((t) => status.get(t.enPath) === "current").length;
  if (built.length) {
    const idx = htmlOf("/pt-br");
    if (!idx) problems.push("PTBR-INDEX  /pt-br is not built");
    else {
      const noindex = robotsOf(idx).some((c) => /noindex/i.test(c));
      if (noindex !== current < 3) problems.push(`PTBR-INDEX  /pt-br ${noindex ? "is noindex" : "is indexable"} with ${current} current translations (noindex below 3)`);
      if (!noindex !== smRows.has("/pt-br")) problems.push(`PTBR-INDEX  /pt-br sitemap row disagrees with its robots meta`);
      const links = new Set(hrefsOf(idx));
      const unlisted = built.filter((t) => !links.has(t.path)).map((t) => t.path);
      if (unlisted.length) problems.push(`PTBR-INDEX  /pt-br does not list ${short(unlisted)}`);
    }
  }

  // The machine surfaces stay English-only: they index the English pages,
  // and a translation is reachable from its English page's hreflang.
  for (const f of ["llms.txt", "llms-full.txt", "answers.json", "search-index.json"]) {
    const p = `${ROOT}/${f}.body`;
    if (fs.existsSync(p) && fs.readFileSync(p, "utf8").includes("/pt-br/")) {
      problems.push(`PTBR-SURFACES  /${f} lists a /pt-br page`);
    }
  }

  console.log(
    `Translations: ${translations.length} pt-BR pages, ${current} current, ${stale} stale` +
      (stale ? " (noindex, out of sitemap and hreflang — run node scripts/translation-status.mjs)" : "") +
      `; held to the English pages: ${seen.numbers} numbers, ${seen.links} internal and ${seen.external} external links, ` +
      `${seen.code} code spans, ${seen.quotes} quoted passages.`,
  );
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
