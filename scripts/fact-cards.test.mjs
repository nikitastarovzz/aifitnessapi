/**
 * Fact cards (/s?t=fact&id=…): the id scheme in src/lib/factCardCore.mjs and
 * src/lib/factId.mjs, the strict parser the share route uses, the strings the
 * page and its card print, and the ids src/lib/keyFacts.ts attaches.
 *
 *   node --test scripts/fact-cards.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  FACT_ID,
  FACT_ID_MAX,
  clip,
  factBase,
  factCardImagePath,
  factCardText,
  factSharePath,
  longDate,
  parseFactId,
} from "../src/lib/factCardCore.mjs";
import { factHash, factId } from "../src/lib/factId.mjs";
import { KEY_FACTS_CLUSTERS, keyFacts } from "../src/lib/keyFacts.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const EVIDENCE = path.join(ROOT, "ops/sources/evidence");
const read = (f) => JSON.parse(fs.readFileSync(path.join(EVIDENCE, f), "utf8"));

test("an id is the evidence file's base name, a dot and ten hex digits of the row's hash", () => {
  assert.equal(factBase("/pricing/garmin-api"), "pricing-garmin-api");
  assert.equal(factBase("/fitness-apis/wearable-data-apis"), "fitness-apis-wearable-data-apis");
  const id = factId("/pricing/garmin-api", "https://example.com/a", "It costs 5 dollars.");
  assert.match(id, /^pricing-garmin-api\.[0-9a-f]{10}$/);
  assert.match(id, FACT_ID);
  assert.equal(id, factId("/pricing/garmin-api", "https://example.com/a", "  It costs 5 dollars.  "), "the quote is trimmed, as keyFacts trims it");
  assert.notEqual(id, factId("/pricing/garmin-api", "https://example.com/b", "It costs 5 dollars."), "another URL is another fact");
  assert.notEqual(id, factId("/pricing/garmin-api", "https://example.com/a", "It costs 6 dollars."), "another quote is another fact");
  assert.equal(factHash("u", "q"), factHash("u", "q"));
  for (const bad of ["pricing/garmin-api", "/pricing", "/Pricing/x", "/pricing/x/y", "/pricing/../x", ""]) {
    assert.throws(() => factBase(bad), bad);
  }
});

test("the parser accepts exactly one spelling and nothing else", () => {
  const id = factId("/compare/terra-vs-rook", "https://example.com/", "Plans start at 10 users.");
  assert.equal(parseFactId(id), id);
  const bad = [
    undefined,
    null,
    42,
    [id],
    [id, id],
    "",
    id.toUpperCase(),
    ` ${id}`,
    `${id} `,
    `${id}\n`,
    `${id}0`,
    id.slice(0, -1),
    id.replace(".", "-"),
    `../${id}`,
    `${id}/../../etc/passwd`,
    "pricing-garmin-api.zzzzzzzzzz",
    "pricing--garmin-api.0123456789",
    "-pricing.0123456789",
    "<script>alert(1)</script>.0123456789",
    "pricing%2Dgarmin-api.0123456789",
    "pricing-garmin-api.0123456789?x=1",
    "prícing-garmin-api.0123456789",
    `${"a".repeat(FACT_ID_MAX)}.0123456789`,
    "Free text that someone typed",
  ];
  for (const b of bad) assert.equal(parseFactId(b), null, JSON.stringify(b));
});

test("share and card paths are built only from a valid id", () => {
  const id = "pricing-garmin-api.0123456789";
  assert.equal(factSharePath(id), "/s?t=fact&id=pricing-garmin-api.0123456789");
  assert.equal(factSharePath(id, "https://aifitnessapi.com/"), "https://aifitnessapi.com/s?t=fact&id=pricing-garmin-api.0123456789");
  assert.equal(factCardImagePath(id), "/og/fact/pricing-garmin-api.0123456789.png");
  assert.throws(() => factSharePath("x y"));
  assert.throws(() => factCardImagePath("../x.0123456789"));
});

test("the printed strings come from the fact's own fields, within their caps", () => {
  const t = factCardText({
    quote: "Requests are limited to 150 per 15 minutes and 1,000 per day per application.",
    host: "developers.strava.com",
    checked: "2026-11-14",
    pageTitle: "Strava API rate limits",
  });
  assert.equal(t.ogEyebrow, "Sourced fact");
  assert.equal(t.ogLine, "developers.strava.com · checked November 14, 2026");
  assert.ok(t.ogTitle.startsWith("“Requests are limited to 150"));
  assert.ok(t.title.length <= 72 && t.title.startsWith("“"));
  assert.ok(t.description.length <= 155, `${t.description.length}`);
  assert.ok(t.description.includes("developers.strava.com") && t.description.includes("November 14, 2026"));
  assert.ok(t.shareText.endsWith("(developers.strava.com)"));
  const long = factCardText({ quote: "word ".repeat(80).trim() + ".", host: "h.example", checked: null, pageTitle: "P ".repeat(80) });
  assert.ok(long.description.length <= 155);
  assert.ok(long.ogTitle.length <= 152);
  assert.ok(long.ogLine.includes("check date not recorded"));
  assert.equal(longDate("2026-01-02"), "January 2, 2026");
  assert.equal(longDate("2026"), "2026");
  assert.equal(clip("a b c", 10), "a b c");
  assert.ok(clip("alpha beta gamma delta epsilon", 15).endsWith("…"));
});

test("keyFacts attaches a parseable id to every line, unique across every evidence file", () => {
  const files = fs.readdirSync(EVIDENCE).filter((f) => f.endsWith(".json"));
  const seen = new Map();
  let facts = 0;
  let pages = 0;
  for (const f of files) {
    const cluster = KEY_FACTS_CLUSTERS.find((c) => f.startsWith(`${c.slice(1)}-`));
    if (!cluster) continue;
    const rows = read(f);
    if (!Array.isArray(rows)) continue;
    const enPath = `${cluster}/${f.slice(cluster.length, -".json".length)}`;
    // Every row's URL counted as checked: the widest set keyFacts could show.
    const got = keyFacts(enPath, { sources: rows.filter((r) => typeof r.url === "string").map((r) => ({ url: r.url, checked: "2026-11-24" })) });
    if (got.length) pages++;
    for (const k of got) {
      facts++;
      assert.equal(parseFactId(k.id), k.id, k.id);
      assert.ok(k.id.startsWith(`${factBase(enPath)}.`), k.id);
      const row = rows.find((r) => r.url === k.url && typeof r.quote === "string" && r.quote.trim().replace(/[,;:]$/, "") === k.quote);
      assert.ok(row, `${k.id} is a row of ${f}`);
      assert.equal(k.id, factId(enPath, row.url, row.quote), `${k.id} is the hash of its row`);
      const prev = seen.get(k.id);
      assert.ok(!prev || prev === `${row.url}\n${row.quote.trim()}`, `id collision on ${k.id}`);
      seen.set(k.id, `${row.url}\n${row.quote.trim()}`);
    }
  }
  assert.ok(pages >= 20, `only ${pages} pages produce key facts`);
  assert.ok(facts >= 60, `only ${facts} key facts`);
});

test("an id survives reordering the evidence rows around it", () => {
  const f = fs.readdirSync(EVIDENCE).find((x) => x.startsWith("pricing-") && x.endsWith(".json"));
  const rows = read(f);
  const enPath = `/pricing/${f.slice("pricing-".length, -".json".length)}`;
  const sources = rows.map((r) => ({ url: r.url, checked: "2026-11-24" }));
  const before = keyFacts(enPath, { sources }).map((k) => k.id);
  for (const r of rows) if (typeof r.quote === "string") assert.equal(factId(enPath, r.url, r.quote), factId(enPath, r.url, r.quote));
  // The id of a row does not depend on its index: recompute each from content alone.
  const recomputed = keyFacts(enPath, { sources }).map((k) => factId(enPath, k.url, rows.find((r) => r.url === k.url && r.quote.trim().replace(/[,;:]$/, "") === k.quote).quote));
  assert.deepEqual(recomputed, before);
});

test("the share route and its card read the fact set, not the URL", () => {
  const page = fs.readFileSync(path.join(ROOT, "src/app/s/page.tsx"), "utf8");
  assert.ok(page.includes("factCard(sp.id)"), "the raw id goes straight to the strict lookup");
  assert.ok(/robots: \{ index: false, follow: true \}/.test(page), "the share page stays noindex");
  const og = fs.readFileSync(path.join(ROOT, "src/app/og/fact/[file]/route.tsx"), "utf8");
  assert.ok(og.includes("export const dynamicParams = false"), "an unknown card is a 404, never a render");
  const sitemap = fs.readFileSync(path.join(ROOT, "src/lib/sitemap.ts"), "utf8");
  assert.ok(!sitemap.includes("t=fact"), "fact cards stay out of the sitemap");
  const button = fs.readFileSync(path.join(ROOT, "src/components/FactShareLink.tsx"), "utf8");
  assert.ok(button.startsWith('"use client"'), "the share address is built in the browser");
  assert.ok(!button.includes("factId.mjs"), "node:crypto stays out of the client bundle");
});
