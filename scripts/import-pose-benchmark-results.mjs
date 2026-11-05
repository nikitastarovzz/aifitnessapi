#!/usr/bin/env node
/**
 * Regenerate src/data/poseBenchmarkResults.ts — the crowdsourced
 * /tools/pose-benchmark leaderboard — from accepted GitHub issues.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/import-pose-benchmark-results.mjs
 *   node scripts/import-pose-benchmark-results.mjs --from issues.json   (a saved API response, offline)
 *
 * Run by hand. It reads the public issues of the repository through GitHub's
 * REST API without a token (no secret, nothing written to GitHub) and keeps
 * only issues that
 *   - have a title starting with TITLE_PREFIX, and
 *   - carry ACCEPT_LABEL, which only a maintainer can add, after checking
 *     the numbers look like a real run (src/lib/poseBenchmarkSubmission.mjs).
 * The result block is parsed by the same module that wrote it; an issue whose
 * block does not validate is reported and skipped, never repaired. Results
 * are copied as submitted: no number is adjusted, averaged or ranked here.
 *
 * The output starts empty and stays empty until a run is accepted. Do not
 * add a result by hand: a row on the leaderboard must point at the public
 * issue it came from.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { ACCEPT_LABEL, REPO, TITLE_PREFIX, parseIssueBody } from "../src/lib/poseBenchmarkSubmission.mjs";

const OUT = "src/data/poseBenchmarkResults.ts";
const fromIdx = process.argv.indexOf("--from");

async function fetchIssues() {
  if (fromIdx > 0) return JSON.parse(readFileSync(process.argv[fromIdx + 1], "utf8"));
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}&labels=${encodeURIComponent(ACCEPT_LABEL)}`;
    const res = await fetch(url, { headers: { accept: "application/vnd.github+json", "user-agent": "aifitnessapi-leaderboard-import" } });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

const issues = await fetchIssues();
const results = [];
const skipped = [];
for (const is of issues) {
  if (is.pull_request) continue;
  if (!String(is.title ?? "").startsWith(TITLE_PREFIX)) continue;
  if (!(is.labels ?? []).some((l) => (typeof l === "string" ? l : l.name) === ACCEPT_LABEL)) continue;
  const parsed = parseIssueBody(is.body);
  if (!parsed.ok) {
    skipped.push(`#${is.number}: ${parsed.errors.join("; ")}`);
    continue;
  }
  results.push({
    issue: is.number,
    issueUrl: is.html_url,
    submittedBy: is.user?.login ?? null,
    submittedOn: String(is.created_at ?? "").slice(0, 10) || null,
    ...parsed.record,
  });
}
results.sort((a, b) => a.issue - b.issue);

for (const s of skipped) console.warn(`skipped ${s}`);

const importedOn = new Date().toISOString().slice(0, 10);
const body = `/**
 * Crowdsourced Pose Landmarker benchmark results, one entry per accepted
 * GitHub issue in ${REPO} (title prefix ${JSON.stringify(TITLE_PREFIX)}, label
 * ${JSON.stringify(ACCEPT_LABEL)}).
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/import-pose-benchmark-results.mjs
 *
 * Numbers are copied as the submitter's browser measured them: one device,
 * one run each, not reference figures. Empty until a run is accepted.
 */

export type PoseBenchmarkSubmission = {
  issue: number;
  issueUrl: string;
  submittedBy: string | null;
  submittedOn: string | null;
  runtime: string;
  measuredAt: string | null;
  input: string | null;
  device: {
    userAgent: string | null;
    platform: string | null;
    cores: string | null;
    memory: string | null;
    gpu: string | null;
    webgl2: string | null;
    webgpu: string | null;
  } | null;
  rows: {
    model: string;
    delegate: "GPU" | "CPU";
    frames: number;
    loadMs: number;
    medianMs: number;
    p95Ms: number;
    meanMs: number;
    loopFps: number | null;
    poseFrames: number | null;
  }[];
};

/** The date the importer last ran; null before the first import. */
export const POSE_BENCHMARK_RESULTS_IMPORTED_ON: string | null = ${JSON.stringify(results.length || issues.length ? importedOn : null)};

export const POSE_BENCHMARK_RESULTS: PoseBenchmarkSubmission[] = ${JSON.stringify(results, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`✓ ${OUT}: ${results.length} accepted submissions (${skipped.length} skipped) from ${issues.length} labeled issues.`);
