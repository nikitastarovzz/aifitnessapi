/**
 * The access-report scoreboard (/integrate), the per-vendor README badges
 * (public/badges/access/<vendor>.svg) and the share line on each report row,
 * all from src/lib/accessReportSubmission.mjs and scripts/import-access-reports.mjs.
 *
 *   node --test scripts/access-scoreboard.test.mjs   (part of npm run test:access-reports)
 *
 * The issues below are synthetic test input written to a temporary file, not
 * anyone's application; they never reach src/data/accessReports.ts.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  ACCEPT_LABEL,
  ACCESS_BADGE_DIR,
  MEDIAN_MIN,
  TITLE_PREFIX,
  VENDORS,
  accessBadge,
  accessBadgePath,
  accessBadges,
  issueBody,
  scoreboard,
  shareText,
  shareUrl,
  summarize,
} from "../src/lib/accessReportSubmission.mjs";
import { statBadge } from "../src/lib/statBadgeSvg.mjs";
import { ACCESS_REPORTS } from "../src/data/accessReports.ts";

const root = new URL("..", import.meta.url);
const cwd = new URL(".", root);

const report = (vendor, outcome, daysToFirstAnswer, applied = "2026-03") => ({
  vendor,
  program: "Connect Developer Program",
  use: "commercial",
  applied,
  outcome,
  daysToFirstAnswer: daysToFirstAnswer ?? "",
  askedFor: "",
  notes: "",
});
const FIXTURE = [
  report("garmin", "approved", 12),
  report("garmin", "approved", 30),
  report("garmin", "rejected", 9),
  report("garmin", "no-answer", null),
  report("whoop", "approved", 5),
  report("whoop", "pending", null),
  report("dexcom", "rejected", 40),
];
const issue = (number, fields, labels = [ACCEPT_LABEL]) => ({
  number,
  title: `${TITLE_PREFIX} ${fields.vendor} API access application`,
  labels: labels.map((name) => ({ name })),
  body: issueBody(fields),
  html_url: `https://github.com/nikitastarovzz/aifitnessapi/issues/${number}`,
  created_at: "2026-11-01T10:00:00Z",
});

/** Run the importer on fixture issues into a temporary directory; returns its rows and badges. */
function importFixture(issues) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "access-scoreboard-"));
  const from = path.join(dir, "issues.json");
  const out = path.join(dir, "accessReports.ts");
  const badges = path.join(dir, "badges");
  fs.mkdirSync(badges);
  fs.writeFileSync(path.join(badges, "retired-vendor.svg"), "<svg/>");
  fs.writeFileSync(from, JSON.stringify(issues));
  execFileSync(process.execPath, ["scripts/import-access-reports.mjs", "--from", from, "--out", out, "--badges-dir", badges], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const rows = JSON.parse(/export const ACCESS_REPORTS: AccessReport\[\] = (\[[\s\S]*\]);\s*$/.exec(fs.readFileSync(out, "utf8"))[1]);
  const svgs = Object.fromEntries(fs.readdirSync(badges).map((f) => [f, fs.readFileSync(path.join(badges, f), "utf8")]));
  fs.rmSync(dir, { recursive: true, force: true });
  return { rows, svgs };
}

const ariaOf = (svg) => /aria-label="([^"]*)"/.exec(svg)?.[1].replace(/&amp;/g, "&");

test("the scoreboard aggregates per vendor with the panel's median rule", () => {
  const { rows } = importFixture([...FIXTURE.map((f, i) => issue(i + 1, f)), issue(99, report("oura", "approved", 3), ["access-report"])]);
  assert.equal(rows.length, FIXTURE.length, "the unlabeled issue is not imported");
  const board = scoreboard(rows);
  assert.equal(board.length, VENDORS.length, "every vendor has a row, reported or not");
  assert.deepEqual(
    board.slice(0, 3).map((r) => [r.slug, r.total]),
    [
      ["garmin", 4],
      ["whoop", 2],
      ["dexcom", 1],
    ],
    "most reports first",
  );
  const garmin = board[0];
  assert.deepEqual(garmin.counts, { approved: 2, rejected: 1, "no-answer": 1, pending: 0 });
  assert.equal(garmin.withDays, 3);
  assert.equal(garmin.medianDays, 12, "median of 9, 12, 30");
  assert.equal(garmin.page, "/integrate/garmin-api");
  const whoop = board.find((r) => r.slug === "whoop");
  assert.equal(whoop.withDays, 1);
  assert.equal(whoop.medianDays, null, `no median below ${MEDIAN_MIN} reports with days`);
  const rest = board.slice(3);
  assert.ok(rest.every((r) => r.total === 0 && r.medianDays === null));
  assert.deepEqual(
    rest.map((r) => r.slug),
    VENDORS.map((v) => v.slug).filter((s) => !["garmin", "whoop", "dexcom"].includes(s)),
    "ties keep the VENDORS order",
  );
  for (const r of board) assert.deepEqual({ ...r, slug: undefined, name: undefined, page: undefined }, { ...summarize(rows.filter((x) => x.vendor === r.slug)), slug: undefined, name: undefined, page: undefined });
  assert.deepEqual(scoreboard([]).map((r) => r.slug), VENDORS.map((v) => v.slug));
});

test("the importer draws one badge per vendor with the shared drawing, and removes strays", () => {
  const { rows, svgs } = importFixture(FIXTURE.map((f, i) => issue(i + 1, f)));
  assert.deepEqual(Object.keys(svgs).sort(), VENDORS.map((v) => `${v.slug}.svg`).sort(), "one file per vendor, the stray one removed");
  assert.equal(ariaOf(svgs["garmin.svg"]), "Garmin API access: 4 reports · median 12 days");
  assert.equal(ariaOf(svgs["whoop.svg"]), "WHOOP API access: 2 reports");
  assert.equal(ariaOf(svgs["dexcom.svg"]), "Dexcom API access: 1 report");
  assert.equal(ariaOf(svgs["oura.svg"]), "Oura API access: no reports yet");
  for (const b of accessBadges(rows)) assert.equal(svgs[`${b.slug}.svg`], statBadge(b.label, b.value, b.color), `${b.slug} is the shared drawing`);
  assert.notEqual(accessBadge("Garmin", summarize(rows.filter((r) => r.vendor === "garmin"))).color, accessBadge("Oura", summarize([])).color);
  assert.equal(accessBadge("Garmin", { total: 3, medianDays: 1 }).value, "3 reports · median 1 day");
  assert.equal(accessBadge("Garmin", { total: 4, medianDays: 9.5 }).value, "4 reports · median 9.5 days");
});

test("the committed badges are what the committed reports draw", () => {
  const files = fs.readdirSync(new URL(`${ACCESS_BADGE_DIR}/`, root)).sort();
  assert.deepEqual(files, VENDORS.map((v) => `${v.slug}.svg`).sort(), `${ACCESS_BADGE_DIR} holds one badge per vendor; run node scripts/import-access-reports.mjs --badges-only`);
  for (const b of accessBadges(ACCESS_REPORTS)) {
    assert.equal(accessBadgePath(b.slug), `/badges/access/${b.slug}.svg`);
    const svg = fs.readFileSync(new URL(`${ACCESS_BADGE_DIR}/${b.slug}.svg`, root), "utf8");
    assert.equal(svg, statBadge(b.label, b.value, b.color), `${b.slug}.svg is stale; run node scripts/import-access-reports.mjs --badges-only`);
  }
});

test("the share line describes the report, not the reader, and links the vendor's panel", () => {
  const r = { issue: 7, vendor: "garmin", applied: "2026-06", outcome: "approved", daysToFirstAnswer: 12 };
  assert.equal(shareText(r), "Garmin API access approved in 12 days, per developer report #7 (applied 2026-06). Reports from developers:");
  assert.equal(shareUrl(r), "https://aifitnessapi.com/integrate/garmin-api#access-reports");
  assert.equal(shareText({ ...r, daysToFirstAnswer: 1 }).includes("in 1 day,"), true);
  assert.equal(shareText({ ...r, outcome: "no-answer", daysToFirstAnswer: null }), "Garmin API access no answer, per developer report #7 (applied 2026-06). Reports from developers:");
  assert.ok(shareText({ ...r, outcome: "rejected", daysToFirstAnswer: null }).startsWith("Garmin API access rejected, per"));
  assert.ok(shareText({ ...r, vendor: "samsung-health", outcome: "pending", daysToFirstAnswer: 4 }).startsWith("Samsung Health API access pending, first answer in 4 days"));
  assert.ok(!/\bmy\b|\bI\b/.test(shareText(r)), "no first person: anyone can share any row");
  assert.throws(() => shareText({ ...r, vendor: "apple" }));
  assert.throws(() => shareText({ ...r, outcome: "maybe" }));
});
