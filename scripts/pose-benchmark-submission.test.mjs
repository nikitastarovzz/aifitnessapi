/**
 * The pose-benchmark leaderboard's submission format, written by the page and
 * read back by scripts/import-pose-benchmark-results.mjs through the same
 * module (src/lib/poseBenchmarkSubmission.mjs).
 *
 *   node --test scripts/pose-benchmark-submission.test.mjs   (npm run test:pose-leaderboard)
 *
 * The run below is synthetic test input, not a measurement.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { NEW_ISSUE_URL, TITLE_PREFIX, buildIssue, parseIssueBody, resultRecord } from "../src/lib/poseBenchmarkSubmission.mjs";

const run = {
  runtime: "1.1.1",
  measuredAt: "2026-11-05 10:00 UTC",
  input: "synthetic test frame, 640×480",
  device: { userAgent: "TestAgent/1.0", platform: "TestOS", cores: "8", memory: "8 GB (browser-rounded)", gpu: "Test GPU", webgl2: "yes", webgpu: "exposed", pixelRatio: "2" },
  rows: [
    { model: "Pose Landmarker lite", delegate: "GPU", status: "ok", loadMs: 812.34, frames: 100, medianMs: 9.87, p95Ms: 14.2, meanMs: 10.4, minMs: 8, loopFps: 59.9, poseFrames: 0 },
    { model: "Pose Landmarker full", delegate: "CPU", status: "error", error: "no delegate" },
  ],
};

test("a run round-trips through the issue body", () => {
  const rec = resultRecord(run);
  assert.equal(rec.rows.length, 1, "failed rows are not submitted");
  const issue = buildIssue(rec, "| a | b |");
  assert.ok(issue.title.startsWith(TITLE_PREFIX));
  assert.ok(issue.url.startsWith(`${NEW_ISSUE_URL}?title=`));
  assert.ok(!issue.url.includes("labels="), "visitors cannot set labels, so the URL must not try");
  const back = parseIssueBody(decodeURIComponent(issue.url.split("&body=")[1]));
  assert.ok(back.ok, back.errors?.join("; "));
  assert.equal(back.record.rows[0].medianMs, 9.9);
  assert.equal(back.record.device.gpu, "Test GPU");
  assert.equal("pixelRatio" in back.record.device, false);
});

test("an edited or implausible block is rejected, not repaired", () => {
  const body = buildIssue(resultRecord(run)).body;
  assert.equal(parseIssueBody(body.replace('"medianMs": 9.9', '"medianMs": -1')).ok, false);
  assert.equal(parseIssueBody(body.replace('"p95Ms": 14.2', '"p95Ms": 2')).ok, false);
  assert.equal(parseIssueBody(body.replace("Pose Landmarker lite", "MoveNet")).ok, false);
  assert.equal(parseIssueBody(body.replace('"frames": 100', '"frames": 3')).ok, false);
  assert.equal(parseIssueBody("no block here").ok, false);
  assert.equal(parseIssueBody(body.replace("```json pose-benchmark-result\n{", "```json pose-benchmark-result\n{{")).ok, false);
});

test("a long markdown copy is dropped before the URL gets too long", () => {
  const issue = buildIssue(resultRecord(run), "x".repeat(20000));
  assert.ok(!issue.tooLong);
  assert.ok(!issue.body.includes("xxxx"));
  assert.ok(parseIssueBody(issue.body).ok);
});
