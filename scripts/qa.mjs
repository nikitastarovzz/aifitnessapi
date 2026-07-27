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

console.log(`QA: checked ${checked} content pages (${htmls.length} built HTML files).`);
if (problems.length === 0) {
  console.log("✓ No issues found.");
  process.exit(0);
}
console.error(`\n✗ ${problems.length} issue(s):\n`);
for (const p of problems) console.error("  " + p);
process.exit(1);
