#!/usr/bin/env node
/**
 * Regenerate src/data/builtWith.ts — projects that use the APIs this site
 * covers, listed under "Built with these APIs" on /awesome and in AWESOME.md —
 * from accepted GitHub issues.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/import-built-with.mjs
 *   node scripts/import-built-with.mjs --from issues.json   (a saved API response, offline)
 *   ... --out <file>   (write elsewhere; the test uses it to rebuild the empty file)
 *
 * Then `node scripts/build-awesome.mjs`, so AWESOME.md lists the same projects.
 *
 * Run by hand. It reads the public issues of the repository through GitHub's
 * REST API without a token (no secret, nothing written to GitHub) and keeps
 * only issues that
 *   - have a title starting with TITLE_PREFIX, and
 *   - carry ACCEPT_LABEL, which only a maintainer can add, after reading the
 *     submission (src/lib/builtWithSubmission.mjs).
 * The block is parsed by the same module that wrote the form, against the API
 * ids of the directory (src/data/costModel.ts, less the ids src/data/apis.ts
 * excludes); an issue whose block does not validate is reported and skipped,
 * never repaired, and a second issue for an address already listed is
 * skipped. Text that looks like a key, token, email or @mention is replaced
 * before it is stored. No GitHub login is copied.
 *
 * The output starts empty and stays empty until a project is accepted. Do not
 * add a project by hand: every row must point at the public issue it came from.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { ACCEPT_LABEL, REPO, TITLE_PREFIX, parseIssueBody } from "../src/lib/builtWithSubmission.mjs";
import { excludedApiIds } from "./build-awesome.mjs";

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const OUT = arg("--out") ?? "src/data/builtWith.ts";
const FROM = arg("--from");

const { COST_ITEMS } = await import(new URL("../src/data/costModel.ts", import.meta.url).href);
const excluded = excludedApiIds();
const API_IDS = COST_ITEMS.map((i) => i.id).filter((id) => !excluded.has(id));
if (API_IDS.length < 10) throw new Error(`import-built-with: read ${API_IDS.length} directory ids, expected at least 10`);

async function fetchIssues() {
  if (FROM) return JSON.parse(readFileSync(FROM, "utf8"));
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}&labels=${encodeURIComponent(ACCEPT_LABEL)}`;
    const res = await fetch(url, { headers: { accept: "application/vnd.github+json", "user-agent": "aifitnessapi-built-with-import" } });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

const issues = await fetchIssues();
if (!Array.isArray(issues)) throw new Error("expected a JSON array of issues");
const accepted = issues
  .filter((is) => !is.pull_request)
  .filter((is) => String(is.title ?? "").startsWith(TITLE_PREFIX))
  .filter((is) => (is.labels ?? []).some((l) => (typeof l === "string" ? l : l.name) === ACCEPT_LABEL))
  .sort((a, b) => a.number - b.number);

const projects = [];
const skipped = [];
let redacted = 0;
const seenUrl = new Set();
for (const is of accepted) {
  const parsed = parseIssueBody(is.body, { apiIds: API_IDS });
  if (!parsed.ok) {
    skipped.push(`#${is.number}: ${parsed.errors.join("; ")}`);
    continue;
  }
  const key = parsed.record.url.replace(/\/$/, "").toLowerCase();
  if (seenUrl.has(key)) {
    skipped.push(`#${is.number}: ${parsed.record.url} is already listed from an earlier issue`);
    continue;
  }
  seenUrl.add(key);
  if (parsed.redacted) console.warn(`#${is.number}: ${parsed.redacted} sensitive-looking run(s) removed`);
  redacted += parsed.redacted;
  projects.push({
    issue: is.number,
    issueUrl: is.html_url,
    submittedOn: String(is.created_at ?? "").slice(0, 10) || null,
    ...parsed.record,
  });
}

for (const s of skipped) console.warn(`skipped ${s}`);

const importedOn = new Date().toISOString().slice(0, 10);
const body = `/**
 * Projects that use the APIs this site covers, one entry per accepted GitHub
 * issue in ${REPO} (title prefix ${JSON.stringify(TITLE_PREFIX)}, label
 * ${JSON.stringify(ACCEPT_LABEL)}). Listed under "Built with these APIs" on
 * /awesome and in AWESOME.md.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/import-built-with.mjs
 * (then node scripts/build-awesome.mjs).
 *
 * Each row is what the project's maker wrote, copied as submitted
 * (sensitive-looking text removed), not a review. Empty until a project is
 * accepted.
 */

export type BuiltWithProject = {
  issue: number;
  issueUrl: string;
  submittedOn: string | null;
  name: string;
  url: string;
  repoUrl: string | null;
  /** Directory ids (aifitnessapi.com/apis/<id>). */
  apis: string[];
  description: string;
};

/** The date the importer last ran; null before the first import. */
export const BUILT_WITH_IMPORTED_ON: string | null = ${JSON.stringify(projects.length || issues.length ? importedOn : null)};

export const BUILT_WITH: BuiltWithProject[] = ${JSON.stringify(projects, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`✓ ${OUT}: ${projects.length} accepted projects (${skipped.length} skipped, ${redacted} sensitive run(s) removed) from ${issues.length} labeled issues.`);
