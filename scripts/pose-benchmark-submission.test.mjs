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

const moveNetRun = {
  ...run,
  tfjs: { tfjs: "4.22.0", poseDetection: "2.1.3" },
  rows: [
    ...run.rows,
    { model: "MoveNet SinglePose Lightning", delegate: "GPU", status: "ok", loadMs: 1500.2, frames: 100, medianMs: 12.31, p95Ms: 18.4, meanMs: 13.1, minMs: 10, loopFps: 58.2, poseFrames: 0 },
    { model: "MoveNet SinglePose Thunder", delegate: "CPU", status: "ok", loadMs: 1900.6, frames: 100, medianMs: 40.1, p95Ms: 52.7, meanMs: 41.9, minMs: 35, loopFps: 22.4, poseFrames: 0 },
  ],
};

test("every row carries its model family, and MoveNet rows the TF.js versions", () => {
  const rec = resultRecord(moveNetRun);
  assert.deepEqual(rec.rows.map((r) => r.family), ["mediapipe", "movenet", "movenet"]);
  assert.deepEqual(rec.tfjs, { tfjs: "4.22.0", poseDetection: "2.1.3" });
  const back = parseIssueBody(buildIssue(rec).body);
  assert.ok(back.ok, back.errors?.join("; "));
  assert.deepEqual(back.record.rows.map((r) => [r.model, r.family]), [
    ["Pose Landmarker lite", "mediapipe"],
    ["MoveNet SinglePose Lightning", "movenet"],
    ["MoveNet SinglePose Thunder", "movenet"],
  ]);
  assert.deepEqual(back.record.tfjs, { tfjs: "4.22.0", poseDetection: "2.1.3" });
  assert.equal(back.record.runtime, "1.1.1");
  // A MediaPipe-only run records no TF.js versions, even if the page passed them.
  assert.equal(resultRecord({ ...run, tfjs: moveNetRun.tfjs }).tfjs, null);
});

test("a record written before families existed still parses, unchanged", () => {
  // The v1 block exactly as the page wrote it before 2026-11-19: no family, no tfjs.
  const legacy = {
    $schema: "https://aifitnessapi.com/tools/pose-benchmark#result-v1",
    runtime: "1.1.1",
    measuredAt: "2026-11-05 10:00 UTC",
    input: "synthetic test frame, 640×480",
    device: { userAgent: "TestAgent/1.0", platform: "TestOS", cores: "8", memory: "8 GB (browser-rounded)", gpu: "Test GPU", webgl2: "yes", webgpu: "exposed" },
    rows: [{ model: "Pose Landmarker full", delegate: "GPU", frames: 100, loadMs: 900.1, medianMs: 15.2, p95Ms: 20.3, meanMs: 16, loopFps: 55.5, poseFrames: 12 }],
  };
  const back = parseIssueBody("```json pose-benchmark-result\n" + JSON.stringify(legacy, null, 2) + "\n```");
  assert.ok(back.ok, back.errors?.join("; "));
  const row = back.record.rows[0];
  for (const k of ["model", "delegate", "frames", "loadMs", "medianMs", "p95Ms", "meanMs", "loopFps", "poseFrames"]) assert.equal(row[k], legacy.rows[0][k], k);
  assert.equal(row.family, "mediapipe");
  assert.equal(back.record.tfjs, null);
  assert.equal(back.record.runtime, "1.1.1");
  assert.equal(back.record.device.gpu, "Test GPU");
});

test("a family that does not match its model, or MoveNet without TF.js versions, is rejected", () => {
  const body = buildIssue(resultRecord(moveNetRun)).body;
  assert.equal(parseIssueBody(body.replace('"family": "movenet"', '"family": "mediapipe"')).ok, false);
  assert.equal(parseIssueBody(body.replace('"family": "mediapipe"', '"family": "movenet"')).ok, false);
  // A MoveNet row may not omit its family: only the newer page writes one.
  assert.equal(parseIssueBody(body.replace(/"family": "movenet",\n\s*/, "")).ok, false);
  assert.equal(parseIssueBody(body.replace('"poseDetection": "2.1.3"', '"poseDetection": "latest"')).ok, false);
  assert.equal(parseIssueBody(body.replace("MoveNet SinglePose Thunder", "MoveNet MultiPose Lightning")).ok, false);
});
