#!/usr/bin/env node
/**
 * Regenerate src/data/accessReports.ts — developers' reports of applying for
 * a wearable vendor's API access — from accepted GitHub issues.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/import-access-reports.mjs
 *   node scripts/import-access-reports.mjs --from issues.json   (a saved API response, offline)
 *   ... --out <file>   (write elsewhere; the test uses it to rebuild the empty file)
 *
 * Run by hand. It reads the public issues of the repository through GitHub's
 * REST API without a token (no secret, nothing written to GitHub) and keeps
 * only issues that
 *   - have a title starting with TITLE_PREFIX, and
 *   - carry ACCEPT_LABEL, which only a maintainer can add, after reading the
 *     report (src/lib/accessReportSubmission.mjs).
 * The report block is parsed by the same module that wrote the form; an issue
 * whose block does not validate is reported and skipped, never repaired.
 * Text that looks like a key, token, email or @mention is replaced before it
 * is stored. Nothing is averaged or adjusted here: the panel computes its
 * counts from these rows at build.
 *
 * The output starts empty and stays empty until a report is accepted. Do not
 * add a report by hand: every row must point at the public issue it came from.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { ACCEPT_LABEL, OUTCOMES, REPO, TITLE_PREFIX, USES, VENDOR_SLUGS, parseIssueBody } from "../src/lib/accessReportSubmission.mjs";

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const OUT = arg("--out") ?? "src/data/accessReports.ts";
const FROM = arg("--from");

async function fetchIssues() {
  if (FROM) return JSON.parse(readFileSync(FROM, "utf8"));
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}&labels=${encodeURIComponent(ACCEPT_LABEL)}`;
    const res = await fetch(url, { headers: { accept: "application/vnd.github+json", "user-agent": "aifitnessapi-access-report-import" } });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

const issues = await fetchIssues();
if (!Array.isArray(issues)) throw new Error("expected a JSON array of issues");
const reports = [];
const skipped = [];
let redacted = 0;
for (const is of issues) {
  if (is.pull_request) continue;
  if (!String(is.title ?? "").startsWith(TITLE_PREFIX)) continue;
  if (!(is.labels ?? []).some((l) => (typeof l === "string" ? l : l.name) === ACCEPT_LABEL)) continue;
  const parsed = parseIssueBody(is.body);
  if (!parsed.ok) {
    skipped.push(`#${is.number}: ${parsed.errors.join("; ")}`);
    continue;
  }
  if (parsed.redacted) console.warn(`#${is.number}: ${parsed.redacted} sensitive-looking run(s) removed`);
  redacted += parsed.redacted;
  reports.push({
    issue: is.number,
    issueUrl: is.html_url,
    submittedOn: String(is.created_at ?? "").slice(0, 10) || null,
    ...parsed.record,
  });
}
reports.sort((a, b) => a.issue - b.issue);

for (const s of skipped) console.warn(`skipped ${s}`);

const union = (xs) => xs.map((x) => JSON.stringify(x)).join(" | ");
const importedOn = new Date().toISOString().slice(0, 10);
const body = `/**
 * Developers' reports of applying for a wearable vendor's API access, one
 * entry per accepted GitHub issue in ${REPO} (title prefix
 * ${JSON.stringify(TITLE_PREFIX)}, label ${JSON.stringify(ACCEPT_LABEL)}).
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/import-access-reports.mjs
 *
 * Each row is what one submitter said happened to one application, copied as
 * submitted (sensitive-looking text removed), not a figure from the vendor.
 * Empty until a report is accepted.
 */

export type AccessReportVendor = ${union(VENDOR_SLUGS)};

export type AccessReport = {
  issue: number;
  issueUrl: string;
  submittedOn: string | null;
  vendor: AccessReportVendor;
  program: string;
  use: ${union(USES)};
  /** The month the submitter applied, YYYY-MM. */
  applied: string;
  outcome: ${union(OUTCOMES)};
  daysToFirstAnswer: number | null;
  askedFor: string | null;
  notes: string | null;
};

/** The date the importer last ran; null before the first import. */
export const ACCESS_REPORTS_IMPORTED_ON: string | null = ${JSON.stringify(reports.length || issues.length ? importedOn : null)};

export const ACCESS_REPORTS: AccessReport[] = ${JSON.stringify(reports, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`✓ ${OUT}: ${reports.length} accepted reports (${skipped.length} skipped, ${redacted} sensitive run(s) removed) from ${issues.length} labeled issues.`);
