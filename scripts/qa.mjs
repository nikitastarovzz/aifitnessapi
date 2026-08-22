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

for (const h of htmls) {
  const route = routeOf(h);
  if (route.startsWith("/_")) continue; // framework pages (404, error)
  checked++;
  const html = fs.readFileSync(h, "utf8");

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

  let breadcrumbs = 0;
  for (const l of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(decode(l[1]));
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
    const n = inbound.get(route) ?? 0;
    if (n === 0) problems.push(`ORPHAN         ${route} — no internal links point here`);
    else if (n < 3) thin.push(`${route} (${n})`);
  }
  if (thin.length) console.log(`Thin inbound (<3, informational): ${thin.join(", ")}`);
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

  // Which top-level dirs are clusters? Exactly those mirrored under /md.
  const mdRoot = ".next/server/app/md";
  const clusterTops = fs.existsSync(mdRoot)
    ? fs
        .readdirSync(mdRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith("["))
        .map((e) => e.name)
    : [];
  if (clusterTops.length === 0) problems.push("GEO-NO-MD-MIRRORS  /md build output missing entirely");

  const mirrorFiles = [];
  for (const top of clusterTops) {
    for (const f of fs.readdirSync(path.join(mdRoot, top))) {
      if (f.endsWith(".body")) mirrorFiles.push(path.join(mdRoot, top, f));
    }
  }
  const hubMirrors = fs.existsSync(mdRoot)
    ? fs.readdirSync(mdRoot).filter((f) => f.endsWith(".body"))
    : [];
  const spokes = htmls
    .map(routeOf)
    .filter((r) => { const seg = r.split("/").filter(Boolean); return seg.length === 2 && clusterTops.includes(seg[0]); });
  if (mirrorFiles.length !== spokes.length) {
    problems.push(`GEO-MIRROR-COUNT  ${mirrorFiles.length} /md spoke mirrors vs ${spokes.length} spoke pages — every spoke needs its markdown mirror`);
  }
  // One markdown index per cluster, plus the site index.
  const expectedHubMirrors = clusterTops.length + 1;
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
  }

  // The structured answer index: one record per spoke, each with the fields a
  // citing agent needs.
  if (answersRaw === null) problems.push("GEO-NO-ANSWERS  answers.json missing from build output");
  else {
    let parsed = null;
    try { parsed = JSON.parse(answersRaw); } catch { problems.push("GEO-ANSWERS-INVALID  answers.json is not valid JSON"); }
    if (parsed) {
      if (!Array.isArray(parsed.answers) || parsed.answers.length !== spokes.length) {
        problems.push(`GEO-ANSWERS-COUNT  answers.json has ${parsed.answers?.length ?? 0} records vs ${spokes.length} spokes`);
      }
      const bad = (parsed.answers ?? []).filter(
        (a) => !a.question || !a.answer || !a.url || !a.markdown || !a.last_reviewed,
      );
      if (bad.length) problems.push(`GEO-ANSWERS-FIELDS  ${bad.length} answers.json records missing required fields`);
    }
  }

  if (changesFeed === null) problems.push("GEO-NO-CHANGES-FEED  changes.xml missing from build output");
  else if (!changesFeed.includes("<item>")) problems.push("GEO-CHANGES-FEED-EMPTY  changes.xml has no items");

  for (const h of htmls) {
    const r = routeOf(h);
    const seg = r.split("/").filter(Boolean);
    const isSpoke = seg.length === 2 && clusterTops.includes(seg[0]);
    const isHub = seg.length === 1 && clusterTops.includes(seg[0]);
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
    if (!html.includes('"FAQPage"')) problems.push(`GEO-NO-FAQPAGE  ${r}`);
    if (!html.includes("speakable")) problems.push(`GEO-NO-SPEAKABLE ${r}`);
    if (!html.includes('"TechArticle"')) problems.push(`GEO-NO-TECHARTICLE  ${r}`);
    // Individually addressable answers — an assistant should be able to deep
    // link the exact FAQ it quoted.
    if (html.includes('"FAQPage"') && !html.includes('id="faq-1"')) {
      problems.push(`GEO-NO-FAQ-ANCHOR  ${r} FAQ answers are not individually addressable`);
    }
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
      `changes.xml ${changesFeed ? "ok" : "MISSING"}; crawler allows ${robotsTxt ? "ok" : "MISSING"}.`,
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

console.log(`QA: checked ${checked} content pages (${htmls.length} built HTML files).`);
if (problems.length === 0) {
  console.log("✓ No issues found.");
  process.exit(0);
}
console.error(`\n✗ ${problems.length} issue(s):\n`);
for (const p of problems) console.error("  " + p);
process.exit(1);
