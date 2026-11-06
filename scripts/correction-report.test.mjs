/**
 * Tests for src/lib/correctionReport.mjs: the "Suggest a correction" issue,
 * the credit question it asks, and the /contributors wall built from
 * src/data/corrections.ts (ops/VIRAL-20-2026-11-06.md item 17).
 *
 * Run: npm run test:corrections   (node --test; Node strips corrections.ts's types)
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const cr = await import(new URL("../src/lib/correctionReport.mjs", import.meta.url).href);
const { CORRECTIONS } = await import(new URL("../src/data/corrections.ts", import.meta.url).href);

test("the issue link carries title, page and the credit question, and nothing else", () => {
  const url = new URL(cr.correctionIssueUrl({ path: "/pricing/terra-api-pricing", title: "Terra API Pricing" }));
  assert.equal(`${url.origin}${url.pathname}`, cr.NEW_ISSUE_URL);
  assert.deepEqual([...url.searchParams.keys()], ["title", "body"]);
  assert.equal(url.searchParams.get("title"), "[correction] Terra API Pricing");
  const body = url.searchParams.get("body");
  assert.match(body, /^Page: https:\/\/aifitnessapi\.com\/pricing\/terra-api-pricing\n/);
  assert.ok(body.includes(`${cr.CREDIT_LINE}: \n`));
  assert.ok(!url.toString().includes("+"), "spaces are %20, not +");
});

test("an unanswered credit line is not consent", () => {
  assert.deepEqual(cr.parseCredit(cr.correctionBody("https://aifitnessapi.com/x")), { credit: false });
  assert.deepEqual(cr.parseCredit(""), { credit: false });
  assert.deepEqual(cr.parseCredit("Page: x\n\nWhat's wrong: y"), { credit: false });
  for (const a of ["no", "No.", "none", "n/a", "-", "anonymous"]) assert.deepEqual(cr.parseCredit(`${cr.CREDIT_LINE}: ${a}`), { credit: false }, a);
});

test("a name on the credit line is read exactly", () => {
  assert.deepEqual(cr.parseCredit(`Page: x\n${cr.CREDIT_LINE}: @octocat\n${cr.CREDIT_HELP}`), { credit: true, name: "@octocat" });
  assert.deepEqual(cr.parseCredit(`  ${cr.CREDIT_LINE}:   Ada Lovelace  `), { credit: true, name: "Ada Lovelace" });
});

test("the issue template asks the same credit question as the link", () => {
  const tpl = fs.readFileSync(new URL(`../.github/ISSUE_TEMPLATE/${cr.TEMPLATE_FILE}`, import.meta.url), "utf8");
  assert.ok(tpl.includes(`${cr.CREDIT_LINE}: `));
  assert.ok(tpl.includes(cr.CREDIT_HELP));
  assert.match(tpl, /^title: "\[correction\] "$/m);
  assert.deepEqual(cr.parseCredit(tpl), { credit: false }, "the blank template credits nobody");
});

test("contributorsFrom credits only corrections with reportedBy, grouped by name, newest first", () => {
  const issue = (n) => `${cr.REPO_URL}/issues/${n}`;
  const list = [
    { date: "2026-10-01", page: { href: "/a", label: "A" } },
    { date: "2026-10-02", page: { href: "/b", label: "B" }, reportedBy: { name: "Ada", issue: issue(11) } },
    { date: "2026-10-05", page: { href: "/c", label: "C" }, reportedBy: { name: "ada ", issue: issue(12), url: "https://github.com/ada" } },
    { date: "2026-10-03", page: { href: "/d", label: "D" }, reportedBy: { name: "Grace", issue: issue(13) } },
  ];
  const wall = cr.contributorsFrom(list);
  assert.deepEqual(wall.map((p) => p.name), ["Ada", "Grace"]);
  assert.deepEqual(wall[0].corrections.map((c) => c.page.href), ["/c", "/b"]);
  assert.equal(wall[0].url, "https://github.com/ada");
  assert.deepEqual(cr.creditProblems(list), []);
  assert.deepEqual(cr.contributorsFrom([list[0]]), []);
});

test("creditProblems refuses a credit without an issue of this repository", () => {
  const p = cr.creditProblems([
    { date: "2026-10-02", page: { href: "/b", label: "B" }, reportedBy: { name: "Ada", issue: "https://github.com/someone/else/issues/1" } },
    { date: "2026-10-03", page: { href: "/c", label: "C" }, reportedBy: { name: " ", issue: `${cr.REPO_URL}/issues/2`, url: "http://x" } },
  ]);
  assert.equal(p.length, 3);
});

test("the real corrections log has valid credits, and the wall names only those", () => {
  assert.deepEqual(cr.creditProblems(CORRECTIONS), []);
  const credited = new Set(CORRECTIONS.filter((c) => c.reportedBy).map((c) => c.reportedBy.name.trim().toLowerCase()));
  const wall = cr.contributorsFrom(CORRECTIONS);
  assert.equal(wall.length, credited.size);
  for (const p of wall) assert.ok(credited.has(p.name.toLowerCase()), p.name);
});
