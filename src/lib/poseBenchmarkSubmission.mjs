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

const MODELS = ["Pose Landmarker lite", "Pose Landmarker full", "Pose Landmarker heavy"];
const DELEGATES = ["GPU", "CPU"];
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 10) / 10 : null);
const str = (v, max = 300) => (typeof v === "string" ? v.slice(0, max) : null);

/**
 * The machine-readable record of one run. Only what the page measured and
 * what the browser reported; nothing is added.
 */
export function resultRecord({ runtime, measuredAt, input, device, rows }) {
  return {
    $schema: RESULT_SCHEMA,
    runtime: str(runtime, 80),
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
    rows: rows
      .filter((r) => r.status === "ok")
      .map((r) => ({
        model: r.model,
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
    if (!MODELS.includes(r.model)) bad.push("model");
    if (!DELEGATES.includes(r.delegate)) bad.push("delegate");
    for (const k of ["loadMs", "medianMs", "p95Ms", "meanMs"]) if (typeof r[k] !== "number" || !(r[k] > 0) || r[k] > 600000) bad.push(k);
    if (typeof r.frames !== "number" || !Number.isInteger(r.frames) || r.frames < 10) bad.push("frames");
    if (r.loopFps !== null && (typeof r.loopFps !== "number" || r.loopFps <= 0 || r.loopFps > 1000)) bad.push("loopFps");
    if (typeof r.medianMs === "number" && typeof r.p95Ms === "number" && r.p95Ms < r.medianMs) bad.push("p95 below median");
    if (bad.length) errors.push(`row ${i}: ${bad.join(", ")}`);
    else rows.push({ ...r, poseFrames: Number.isInteger(r.poseFrames) ? r.poseFrames : null });
  }
  if (typeof data.runtime !== "string" || !/^\d+\.\d+\.\d+/.test(data.runtime)) errors.push("runtime version");
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    record: {
      runtime: data.runtime,
      measuredAt: typeof data.measuredAt === "string" ? data.measuredAt : null,
      input: typeof data.input === "string" ? data.input : null,
      device: data.device ?? null,
      rows,
    },
  };
}
