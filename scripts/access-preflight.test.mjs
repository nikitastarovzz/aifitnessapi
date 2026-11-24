/**
 * The pre-flight checklists for gated programs (src/data/accessPreflight.ts,
 * rendered by components/AccessPreflight): every item is a row of the
 * evidence file, sits on a released English page, and claims nothing about
 * approval odds.
 *
 *   node --test scripts/access-preflight.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ACCESS_PREFLIGHT, PREFLIGHT_TOPICS, preflightFor } from "../src/data/accessPreflight.ts";
import { VENDOR_SLUGS, vendorBySlug } from "../src/lib/accessReportSubmission.mjs";

const root = new URL("..", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const EVIDENCE = "ops/sources/evidence/tools-access-preflight.json";
const norm = (s) =>
  s
    .normalize("NFKC")
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

test("every item is a row of the evidence file, and every row is an item", () => {
  const rows = JSON.parse(read(EVIDENCE));
  const key = (url, quote) => `${url}\n${norm(quote)}`;
  const evidence = new Set(rows.map((r) => key(r.url, r.quote)));
  const items = new Set();
  for (const v of ACCESS_PREFLIGHT)
    for (const i of v.items) {
      assert.ok(evidence.has(key(i.url, i.quote)), `${v.vendor} ${i.id}: its url and quote are not a row of ${EVIDENCE}`);
      items.add(key(i.url, i.quote));
    }
  for (const r of rows) {
    assert.ok(items.has(key(r.url, r.quote)), `${EVIDENCE} has a row no item uses: ${r.quote.slice(0, 60)}`);
    assert.ok(r.claim && /^https:\/\//.test(r.url) && norm(r.quote).length >= 12, r.quote);
  }
});

test("items are well formed and every topic is either stated or shown as not stated", () => {
  const topics = new Set(PREFLIGHT_TOPICS.map((t) => t.id));
  for (const v of ACCESS_PREFLIGHT) {
    assert.ok(VENDOR_SLUGS.includes(v.vendor), v.vendor);
    assert.equal(v.name, vendorBySlug(v.vendor).name);
    assert.match(v.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(v.snapshotRun, /^\d+$/);
    const ids = v.items.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length, `${v.vendor}: item ids are unique`);
    assert.ok(v.items.some((i) => i.kind === "do"), `${v.vendor}: at least one checkbox`);
    for (const i of v.items) {
      assert.ok(topics.has(i.topic), `${v.vendor} ${i.id} topic`);
      assert.ok(i.kind === "do" || i.kind === "know", `${v.vendor} ${i.id} kind`);
      assert.match(i.id, /^[a-z0-9-]+$/);
      assert.ok(i.text.length > 10 && i.text.length < 200, `${v.vendor} ${i.id} text length`);
    }
  }
});

test("each checklist is on the vendor's English approval page, else its integrate page", () => {
  const fix = read("src/data/fix.ts");
  const integrate = read("src/data/integrate.ts");
  const pages = new Set();
  for (const v of ACCESS_PREFLIGHT) {
    assert.ok(!pages.has(v.page), `${v.page} has one checklist`);
    pages.add(v.page);
    const approval = `${v.vendor}-api-approval`;
    if (fix.includes(`"${approval}"`)) assert.equal(v.page, `/fix/${approval}`, `${v.vendor} has a /fix approval page`);
    else assert.equal(v.page, `/integrate/${v.vendor}-api`);
    const [, cluster, slug] = v.page.split("/");
    assert.ok((cluster === "fix" ? fix : integrate).includes(`"${slug}"`), `${v.page} is a released page`);
    assert.equal(preflightFor(v.page), v);
  }
  assert.equal(preflightFor("/fix/garmin-api-approval")?.vendor, "garmin");
  assert.equal(preflightFor("/integrate/garmin-api"), undefined, "Garmin's checklist is on its approval page only");
  assert.equal(preflightFor("/pt-br/fix/garmin-api-approval"), undefined);
  for (const v of ["garmin", "whoop", "dexcom", "samsung-health"]) assert.ok(ACCESS_PREFLIGHT.some((p) => p.vendor === v), `${v} is covered`);
});

test("nothing claims an item improves the odds of approval", () => {
  const odds = /\b(improv|increas|boost|rais|better|maximi[sz]|help)\w*\b.{0,40}\b(odds|chances?|likel\w*|approval rate)\b|\baccelerat\w*|\bfaster (approval|review)|\bspeed(s|ing)? up|(?<!not |no )\bguarantee/i;
  for (const v of ACCESS_PREFLIGHT) {
    for (const s of [v.program, ...v.items.flatMap((i) => [i.text, i.quote])]) assert.ok(!odds.test(s), `${v.vendor}: ${s}`);
  }
  const component = read("src/components/AccessPreflight.tsx");
  assert.ok(component.includes("not advice on getting approved"), "the component says it is not approval advice");
  assert.ok(component.includes("kept in this browser only"), "the component says where the checkboxes are kept");
  assert.ok(!/fetch\(|sendBeacon|data-cta/.test(component), "the checklist sends nothing");
});
