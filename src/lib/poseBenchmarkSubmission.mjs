/**
 * Submitting a /tools/pose-benchmark run to the crowdsourced leaderboard.
 *
 * There is no backend. A reader who ran the benchmark opens a prefilled
 * GitHub issue in the site's public repository; a maintainer reviews it and
 * adds the ACCEPT_LABEL; scripts/import-pose-benchmark-results.mjs (run by
 * hand, unauthenticated, no secrets) turns accepted issues into
 * src/data/poseBenchmarkResults.ts, which the leaderboard renders at build.
 *
 * One module, imported by the client component (to build the URL), by the
 * import script (to parse what came back) and by
 * scripts/pose-benchmark-submission.test.mjs, so the format written and the
 * format read cannot drift.
 *
 * GitHub's own documentation (docs/content/issues/.../creating-an-issue.md,
 * read 2026-11-05) gives `title` and `body` as query parameters of
 * /issues/new, and says `labels` needs permission to add labels, which a
 * visitor does not have, and that an over-long URL returns 414. So the URL
 * carries only title and body, the labels live in the issue template
 * (.github/ISSUE_TEMPLATE/pose-benchmark-result.md) for readers who start
 * from the template chooser, and the importer finds submissions by title
 * prefix and the maintainer's label, never by a label the submitter set.
 */

export const REPO = "nikitastarovzz/aifitnessapi";
export const NEW_ISSUE_URL = `https://github.com/${REPO}/issues/new`;
export const TITLE_PREFIX = "[pose-benchmark]";
/** Added by a maintainer after checking the issue; only these are imported. */
export const ACCEPT_LABEL = "pose-benchmark:accepted";
/** The fenced block's info string; the importer reads only this block. */
export const BLOCK_TAG = "json pose-benchmark-result";
export const RESULT_SCHEMA = "https://aifitnessapi.com/tools/pose-benchmark#result-v1";
/** GitHub's docs say a URL over the server limit returns 414 but do not give
 *  the limit, so this is our own cap: above it the markdown copy is dropped
 *  from the body and only the machine-readable block is sent. */
export const MAX_URL_LENGTH = 7500;

/**
 * Every model the page can time, with the family that runs it. A v1 record
 * written before 2026-11-19 has no `family` on its rows; every model it could
 * name was a MediaPipe one, so such a row is read as `mediapipe` and nothing
 * else changes. A MoveNet row must say `movenet`: only the newer page writes
 * one, and it always does.
 */
export const MODEL_FAMILY = {
  "Pose Landmarker lite": "mediapipe",
  "Pose Landmarker full": "mediapipe",
  "Pose Landmarker heavy": "mediapipe",
  "MoveNet SinglePose Lightning": "movenet",
  "MoveNet SinglePose Thunder": "movenet",
};
/** Display order: MediaPipe lite, full, heavy, then MoveNet Lightning, Thunder. */
export const MODEL_ORDER = Object.keys(MODEL_FAMILY);
const DELEGATES = ["GPU", "CPU"];
const SEMVER = /^\d+\.\d+\.\d+/;
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 10) / 10 : null);
const str = (v, max = 300) => (typeof v === "string" ? v.slice(0, max) : null);

/**
 * The machine-readable record of one run. Only what the page measured and
 * what the browser reported; nothing is added.
 */
/** @param {{ runtime: string, tfjs?: { tfjs: string, poseDetection: string } | null, measuredAt: string, input: string, device: any, rows: any[] }} run */
export function resultRecord({ runtime, tfjs = null, measuredAt, input, device, rows }) {
  const ok = rows.filter((r) => r.status === "ok");
  const hasMoveNet = ok.some((r) => MODEL_FAMILY[r.model] === "movenet");
  return {
    $schema: RESULT_SCHEMA,
    /** @mediapipe/tasks-vision version (the field every v1 record has). */
    runtime: str(runtime, 80),
    /** TensorFlow.js and pose-detection versions; only when a MoveNet row is present. */
    tfjs: hasMoveNet && tfjs ? { tfjs: str(tfjs.tfjs, 40), poseDetection: str(tfjs.poseDetection, 40) } : null,
    measuredAt: str(measuredAt, 40),
    input: str(input, 200),
    device: device
      ? {
          userAgent: str(device.userAgent),
          platform: str(device.platform, 80),
          cores: str(device.cores, 20),
          memory: str(device.memory, 40),
          gpu: str(device.gpu, 200),
          webgl2: str(device.webgl2, 10),
          webgpu: str(device.webgpu, 20),
        }
      : null,
    rows: ok.map((r) => ({
      model: r.model,
      family: MODEL_FAMILY[r.model] ?? null,
      delegate: r.delegate,
      frames: r.frames ?? null,
      loadMs: num(r.loadMs),
      medianMs: num(r.medianMs),
      p95Ms: num(r.p95Ms),
      meanMs: num(r.meanMs),
      loopFps: num(r.loopFps),
      poseFrames: r.poseFrames ?? null,
    })),
  };
}

/** The issue a reader is offered: title, body, and the /issues/new URL. */
export function buildIssue(record, markdownTable = "") {
  const head = record.rows[0];
  const device = record.device?.platform && record.device.platform !== "not reported" ? record.device.platform : "my device";
  const title = `${TITLE_PREFIX} ${head ? `${head.model} ${head.delegate} ${head.medianMs} ms median` : "result"} on ${device}`.slice(0, 200);
  const body = [
    "Submitted from https://aifitnessapi.com/tools/pose-benchmark. One device, one run.",
    "",
    "Everything below was measured or read by the page in my browser. I have checked it and I am happy for it to be public, including the user agent and GPU name.",
    "",
    "Notes (optional: device model, power mode, anything else running):",
    "",
    "",
    markdownTable ? "<details><summary>Results as markdown</summary>\n\n" + markdownTable + "\n\n</details>\n" : "",
    "Do not edit the block below; the leaderboard importer reads it.",
    "",
    "```" + BLOCK_TAG,
    JSON.stringify(record, null, 2),
    "```",
  ].join("\n");
  const url = `${NEW_ISSUE_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  if (url.length > MAX_URL_LENGTH && markdownTable) return buildIssue(record, "");
  return { title, body, url, tooLong: url.length > MAX_URL_LENGTH };
}

/**
 * Read a submission back out of an issue body. Returns the cleaned record or
 * the reasons it cannot be used. A row is kept only if every number is
 * present and plausible; nothing is repaired or filled in.
 */
export function parseIssueBody(body) {
  const errors = [];
  if (typeof body !== "string") return { ok: false, errors: ["no body"] };
  const fence = "```" + BLOCK_TAG;
  const start = body.indexOf(fence);
  if (start < 0) return { ok: false, errors: [`no \`\`\`${BLOCK_TAG} block`] };
  const end = body.indexOf("```", start + fence.length);
  if (end < 0) return { ok: false, errors: ["the result block is not closed"] };
  let data;
  try {
    data = JSON.parse(body.slice(start + fence.length, end));
  } catch (e) {
    return { ok: false, errors: [`the result block is not JSON: ${e.message}`] };
  }
  if (data.$schema !== RESULT_SCHEMA) errors.push("unknown $schema");
  if (!Array.isArray(data.rows) || data.rows.length === 0) errors.push("no result rows");
  const rows = [];
  for (const [i, r] of (data.rows ?? []).entries()) {
    const bad = [];
    const fam = Object.hasOwn(MODEL_FAMILY, r.model) ? MODEL_FAMILY[r.model] : null;
    if (!fam) bad.push("model");
    // Absent family: a row from before families existed, which can only be MediaPipe.
    const family = r.family === undefined && fam === "mediapipe" ? "mediapipe" : r.family;
    if (fam && family !== fam) bad.push("family");
    if (!DELEGATES.includes(r.delegate)) bad.push("delegate");
    for (const k of ["loadMs", "medianMs", "p95Ms", "meanMs"]) if (typeof r[k] !== "number" || !(r[k] > 0) || r[k] > 600000) bad.push(k);
    if (typeof r.frames !== "number" || !Number.isInteger(r.frames) || r.frames < 10) bad.push("frames");
    if (r.loopFps !== null && (typeof r.loopFps !== "number" || r.loopFps <= 0 || r.loopFps > 1000)) bad.push("loopFps");
    if (typeof r.medianMs === "number" && typeof r.p95Ms === "number" && r.p95Ms < r.medianMs) bad.push("p95 below median");
    if (bad.length) errors.push(`row ${i}: ${bad.join(", ")}`);
    else rows.push({ ...r, family, poseFrames: Number.isInteger(r.poseFrames) ? r.poseFrames : null });
  }
  if (typeof data.runtime !== "string" || !SEMVER.test(data.runtime)) errors.push("runtime version");
  const needsTfjs = rows.some((r) => r.family === "movenet");
  const tfjsOk = data.tfjs && typeof data.tfjs.tfjs === "string" && SEMVER.test(data.tfjs.tfjs) && typeof data.tfjs.poseDetection === "string" && SEMVER.test(data.tfjs.poseDetection);
  if (needsTfjs && !tfjsOk) errors.push("tfjs runtime version");
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    record: {
      runtime: data.runtime,
      tfjs: needsTfjs ? { tfjs: data.tfjs.tfjs, poseDetection: data.tfjs.poseDetection } : null,
      measuredAt: typeof data.measuredAt === "string" ? data.measuredAt : null,
      input: typeof data.input === "string" ? data.input : null,
      device: data.device ?? null,
      rows,
    },
  };
}
