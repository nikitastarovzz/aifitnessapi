/**
 * Access reports: the issue form written by src/lib/accessReportSubmission.mjs,
 * read back by the same module, and the file scripts/import-access-reports.mjs
 * generates from accepted issues.
 *
 *   node --test scripts/access-reports.test.mjs   (npm run test:access-reports)
 *
 * The reports below are synthetic test input, not anyone's application.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  ACCEPT_LABEL,
  BLOCK_TAG,
  CAPS,
  ISSUE_URL,
  MAX_DAYS,
  NEW_ISSUE_URL,
  OUTCOMES,
  REDACTED,
  TEMPLATE_FILE,
  TITLE_PREFIX,
  USES,
  VENDORS,
  VENDOR_SLUGS,
  buildIssueUrl,
  issueBody,
  parseIssueBody,
  redact,
  summarize,
  vendorForPath,
} from "../src/lib/accessReportSubmission.mjs";

const root = new URL("..", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const NOW = new Date("2026-11-19T12:00:00Z");

const filled = {
  vendor: "garmin",
  program: "Connect Developer Program",
  use: "commercial",
  applied: "2026-06",
  outcome: "approved",
  daysToFirstAnswer: 12,
  askedFor: "a description of the app and a privacy policy",
  notes: "",
};
const parse = (overrides = {}, opts = { now: NOW }) => parseIssueBody(issueBody({ ...filled, ...overrides }), opts);
const bodyFromUrl = (url) => new URL(url).searchParams.get("body");

test("a filled report round-trips through the issue body", () => {
  const r = parse();
  assert.ok(r.ok, r.errors?.join("; "));
  assert.deepEqual(r.record, {
    vendor: "garmin",
    program: "Connect Developer Program",
    use: "commercial",
    applied: "2026-06",
    outcome: "approved",
    daysToFirstAnswer: 12,
    askedFor: "a description of the app and a privacy policy",
    notes: null,
  });
  assert.equal(r.redacted, 0);
});

test("optional fields may be blank, and enumerations ignore case and padding", () => {
  const r = parse({ daysToFirstAnswer: "", askedFor: "", outcome: "no-answer" });
  assert.ok(r.ok, r.errors?.join("; "));
  assert.equal(r.record.daysToFirstAnswer, null);
  assert.equal(r.record.askedFor, null);
  const body = issueBody(filled).replace("vendor: garmin", "vendor:   Garmin  ").replace("use: commercial", "use: Commercial");
  const r2 = parseIssueBody(body, { now: NOW });
  assert.ok(r2.ok, r2.errors?.join("; "));
  assert.equal(r2.record.vendor, "garmin");
  assert.equal(r2.record.use, "commercial");
  assert.ok(parse({ daysToFirstAnswer: 0 }).ok, "0 days is a same-day answer");
  assert.ok(parse({ applied: "2026-11", daysToFirstAnswer: 18 }).ok, "18 days fits inside November 2026 by the 19th");
  for (const v of VENDOR_SLUGS) assert.ok(parse({ vendor: v }).ok, v);
  for (const u of USES) assert.ok(parse({ use: u }).ok, u);
  for (const o of OUTCOMES) assert.ok(parse({ outcome: o, daysToFirstAnswer: o === "no-answer" ? "" : 5 }).ok, o);
});

test("each invalid field is rejected, not repaired", () => {
  const bad = {
    "unknown vendor": { vendor: "apple" },
    "missing vendor": { vendor: "" },
    "missing program": { program: "" },
    "over-long program": { program: "x".repeat(CAPS.program + 1) },
    "markup in program": { program: "<b>Starter</b>" },
    "unknown use": { use: "hobby" },
    "unknown outcome": { outcome: "maybe" },
    "missing outcome": { outcome: "" },
    "month not YYYY-MM": { applied: "June 2026" },
    "month 13": { applied: "2026-13" },
    "day-precision date": { applied: "2026-06-01" },
    "month in the future": { applied: "2026-12" },
    "month before 2000": { applied: "1999-05" },
    "missing month": { applied: "" },
    "days not an integer": { daysToFirstAnswer: "12.5" },
    "days with words": { daysToFirstAnswer: "about 12" },
    "negative days": { daysToFirstAnswer: "-3" },
    "days over the cap": { applied: "2020-01", daysToFirstAnswer: MAX_DAYS + 1 },
    "days longer than since the month applied": { applied: "2026-11", daysToFirstAnswer: 40 },
    "days with no-answer": { outcome: "no-answer", daysToFirstAnswer: 30 },
    "over-long asked_for": { askedFor: "y".repeat(CAPS.askedFor + 1) },
    "over-long notes": { notes: "z".repeat(CAPS.notes + 1) },
  };
  for (const [name, o] of Object.entries(bad)) {
    const r = parse(o);
    assert.equal(r.ok, false, name);
    assert.ok(r.errors.length > 0, name);
  }
  const body = issueBody(filled);
  assert.equal(parseIssueBody(undefined).ok, false);
  assert.equal(parseIssueBody("no block here").ok, false);
  assert.equal(parseIssueBody(body.replace("\n```\n", "\n")).ok, false, "unclosed block");
  assert.equal(parseIssueBody(body.replace("\nnotes:\n```", "\nnotes: first line\nsecond line\n```")).ok, false, "a line that is no field");
  assert.equal(parseIssueBody(body.replace("\nnotes:\n```", "\ncolour: blue\nnotes:\n```")).ok, false, "unknown key");
  assert.equal(parseIssueBody(body.replace("use: commercial", "use: commercial\nuse: personal")).ok, false, "a key given twice");
  assert.equal(parseIssueBody(body + "\n```" + BLOCK_TAG + "\nvendor: oura\n```\n").ok, false, "two blocks");
  assert.equal(parseIssueBody(issueBody({})).ok, false, "the empty template is not a report");
});

test("text that looks like a key, token, email or person is removed before it is stored", () => {
  const cases = [
    "write to jane.doe@example.com",
    "callback https://example.com/cb?code=abcdef123456&state=x",
    "my client_secret=s3cr3tV4lu3XYZ",
    "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.abc",
    "id 123e4567-e89b-12d3-a456-426614174000",
    "hash 0123456789abcdef0123456789abcdef",
    "key AbCdEf1234567890GhIjKl1234567890mnOp",
    "call +44 20 7946 0958",
    "thanks @someone-at-vendor",
  ];
  for (const c of cases) {
    const { text, removed } = redact(c);
    assert.ok(removed > 0, c);
    assert.ok(text.includes(REDACTED), c);
  }
  for (const ok of ["approved after two emails", "Starter Access", "they asked for a demo video in 2026", "Health API, Activity API", "client secret rotation was required", "a token refreshment step"]) {
    assert.equal(redact(ok).removed, 0, ok);
  }
  const r = parse({ notes: "contact was ana@vendor.io, key AbCdEf1234567890GhIjKl1234567890mnOp" });
  assert.ok(r.ok, r.errors?.join("; "));
  assert.equal(r.redacted, 2);
  assert.ok(!r.record.notes.includes("@"));
  assert.ok(!r.record.notes.includes("AbCdEf"));
  assert.equal(r.record.notes, `contact was ${REDACTED}, key ${REDACTED}`);
});

test("the prefilled link opens the form with only the vendor filled in", () => {
  const url = buildIssueUrl({ vendor: "whoop" });
  assert.ok(url.startsWith(`${NEW_ISSUE_URL}?title=`));
  assert.ok(!url.includes("labels="), "visitors cannot set labels, so the URL must not try");
  assert.ok(!url.includes("+"), "spaces are %20, not +");
  const u = new URL(url);
  assert.ok(u.searchParams.get("title").startsWith(`${TITLE_PREFIX} WHOOP`));
  const body = bodyFromUrl(url);
  assert.equal(body, issueBody({ vendor: "whoop" }));
  assert.ok(body.includes("```" + BLOCK_TAG + "\nvendor: whoop\nprogram:\n"));
  assert.ok(body.includes("Please do not post API keys"));
  const back = parseIssueBody(body, { now: NOW });
  assert.equal(back.ok, false, "an unfilled form is not a report");
  assert.ok(!back.errors.some((e) => e.startsWith("vendor")), "the prefilled vendor itself is valid");
  assert.ok(url.length < 4000);
  assert.throws(() => buildIssueUrl({ vendor: "apple" }));
  assert.ok(buildIssueUrl().includes(encodeURIComponent(TITLE_PREFIX)));
});

test("the issue template asks exactly what the link asks", () => {
  const tpl = read(`.github/ISSUE_TEMPLATE/${TEMPLATE_FILE}`);
  assert.ok(tpl.includes(`title: "${TITLE_PREFIX} "`));
  assert.ok(tpl.endsWith(issueBody({})), "template body drifted from issueBody(); regenerate it from the module");
});

test("every vendor's pages are released English pages", () => {
  const integrate = read("src/data/integrate.ts");
  const fix = read("src/data/fix.ts");
  for (const v of VENDORS) {
    assert.ok(v.pages.includes(`/integrate/${v.slug}-api`), `${v.slug} has its /integrate page`);
    for (const p of v.pages) {
      const [, cluster, slug] = p.split("/");
      const src = cluster === "integrate" ? integrate : cluster === "fix" ? fix : "";
      assert.ok(src.includes(`"${slug}"`), `${p} is in the ${cluster} release list`);
      assert.equal(vendorForPath(p), v.slug);
      assert.ok(!p.startsWith("/pt-br"), p);
    }
  }
  assert.equal(vendorForPath("/fix/garmin-api-approval"), "garmin");
  assert.equal(vendorForPath("/integrate/terra-api"), null);
  assert.equal(vendorForPath("/pt-br/integrate/garmin-api"), null);
});

test("counts and the median come only from the reports given", () => {
  const rep = (outcome, daysToFirstAnswer) => ({ outcome, daysToFirstAnswer });
  assert.deepEqual(summarize([]), { total: 0, counts: { approved: 0, rejected: 0, "no-answer": 0, pending: 0 }, withDays: 0, medianDays: null });
  const two = summarize([rep("approved", 3), rep("rejected", 9), rep("no-answer", null)]);
  assert.equal(two.medianDays, null, "no median below three reports with days");
  assert.equal(two.withDays, 2);
  assert.deepEqual(two.counts, { approved: 1, rejected: 1, "no-answer": 1, pending: 0 });
  assert.equal(summarize([rep("approved", 3), rep("approved", 30), rep("rejected", 9)]).medianDays, 9);
  assert.equal(summarize([rep("approved", 3), rep("approved", 30), rep("rejected", 9), rep("pending", 10)]).medianDays, 9.5);
});

const generated = () => {
  const src = read("src/data/accessReports.ts");
  const m = /export const ACCESS_REPORTS: AccessReport\[\] = (\[[\s\S]*\]);\s*$/.exec(src);
  assert.ok(m, "src/data/accessReports.ts has no ACCESS_REPORTS array");
  return { src, rows: JSON.parse(m[1]) };
};

test("the generated file is empty, or every row is valid and links its issue", () => {
  const { src, rows } = generated();
  assert.ok(src.includes("GENERATED — do not hand-edit"));
  const seen = new Set();
  for (const r of rows) {
    assert.ok(Number.isInteger(r.issue) && r.issue > 0, `issue ${r.issue}`);
    assert.ok(!seen.has(r.issue), `#${r.issue} listed twice`);
    seen.add(r.issue);
    assert.match(r.issueUrl, ISSUE_URL);
    assert.ok(r.issueUrl.endsWith(`/issues/${r.issue}`), `#${r.issue} links ${r.issueUrl}`);
    assert.ok(VENDOR_SLUGS.includes(r.vendor), `#${r.issue} vendor`);
    assert.ok(USES.includes(r.use), `#${r.issue} use`);
    assert.ok(OUTCOMES.includes(r.outcome), `#${r.issue} outcome`);
    assert.match(r.applied, /^\d{4}-(0[1-9]|1[0-2])$/);
    assert.ok(r.daysToFirstAnswer === null || (Number.isInteger(r.daysToFirstAnswer) && r.daysToFirstAnswer >= 0 && r.daysToFirstAnswer <= MAX_DAYS));
    for (const k of ["program", "askedFor", "notes"]) if (r[k] !== null) assert.equal(redact(r[k]).removed, 0, `#${r.issue} ${k} still holds sensitive-looking text`);
  }
  if (rows.length === 0) assert.ok(src.includes("ACCESS_REPORTS_IMPORTED_ON: string | null = null;"));
});

test("the importer reproduces the empty file, and imports only accepted, valid, prefixed issues", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "access-reports-"));
  const run = (issues) => {
    const from = path.join(dir, "issues.json");
    const out = path.join(dir, "out.ts");
    fs.writeFileSync(from, JSON.stringify(issues));
    const log = execFileSync(process.execPath, ["scripts/import-access-reports.mjs", "--from", from, "--out", out], {
      cwd: new URL(".", root),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { out: fs.readFileSync(out, "utf8"), log };
  };
  try {
    const { rows } = generated();
    if (rows.length === 0) assert.equal(run([]).out, read("src/data/accessReports.ts"), "the committed empty file is not what the importer writes");

    const issue = (number, title, labels, body) => ({
      number,
      title,
      labels: labels.map((name) => ({ name })),
      body,
      html_url: `https://github.com/nikitastarovzz/aifitnessapi/issues/${number}`,
      created_at: "2026-11-19T10:00:00Z",
    });
    const good = issueBody({ ...filled, applied: "2026-01", notes: "mail me at x@y.com" });
    const { out } = run([
      issue(7, `${TITLE_PREFIX} Garmin`, [ACCEPT_LABEL], good),
      issue(8, `${TITLE_PREFIX} Garmin`, ["access-report"], good),
      issue(9, "Garmin report", [ACCEPT_LABEL], good),
      issue(10, `${TITLE_PREFIX} Oura`, [ACCEPT_LABEL], issueBody({ ...filled, vendor: "oura", use: "hobby" })),
      { ...issue(11, `${TITLE_PREFIX} PR`, [ACCEPT_LABEL], good), pull_request: {} },
    ]);
    const m = /= (\[[\s\S]*\]);\s*$/.exec(out);
    const imported = JSON.parse(m[1]);
    assert.deepEqual(imported.map((r) => r.issue), [7]);
    assert.equal(imported[0].notes, `mail me at ${REDACTED}`);
    assert.equal(imported[0].issueUrl, "https://github.com/nikitastarovzz/aifitnessapi/issues/7");
    assert.equal(imported[0].submittedOn, "2026-11-19");
    assert.ok(!("submittedBy" in imported[0]), "no GitHub login is copied into the site");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
