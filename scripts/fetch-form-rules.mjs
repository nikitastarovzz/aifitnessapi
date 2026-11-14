#!/usr/bin/env node
/**
 * Regenerate src/data/formRules.ts — the open exercise form-rules dataset —
 * and its evidence file, ops/sources/evidence/tools-exercise-form-rules.json,
 * from the source code of licensed open-source exercise trackers.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-form-rules.mjs [--offline]
 *     --offline reparses the cache in .cache/form-rules without refetching.
 *   Then `npm run datasets` to publish public/datasets/exercise-form-rules-2026.*.
 *
 * The rule this file exists to enforce: NO NUMBER IS TYPED HERE. Every
 * threshold row below names a source file and a verbatim `quote` from it, and
 * a `pick` pattern that captures the number(s) out of that quote. The script
 * fetches the file, refuses to write unless the quote appears in it (after
 * collapsing runs of whitespace, the same normalization
 * scripts/check-source-quotes.mjs applies), and takes the value from the
 * fetched text, never from this file. Each row also carries a `usage` quote
 * (the line that shows what the threshold does) and a `measure` quote (the
 * line that computes the angle), held to the same check, so a reader can
 * tell an elbow angle from an upper-arm-to-vertical angle without trusting
 * our description.
 *
 * Where no source read here gives a number, the row's value is null and
 * `nullReason` says why. Nothing is guessed, averaged or "typical". A null is
 * not a gap to fill from memory: it is filled by a regeneration that reads a
 * source which states the number.
 *
 * Sources are limited to code under an open-source license whose LICENSE file
 * the script also reads (its first line is quoted and checked). Repositories
 * whose README claims a license but that ship no LICENSE file were read on
 * 2026-11-05 and left out. thphuc05/PythonExcercisePoseEstimation (MIT), the
 * source of 11 squat, push-up and plank rows, answered 404 on 2026-11-14 (its
 * files on raw.githubusercontent.com, its GitHub page, and the GitHub API's
 * repository endpoint, while the owner's account still answers): deleted or
 * made private, so it was removed rather than kept from an old copy, and the
 * squat rep-count and plank hold rules it alone filled are null rows now. Peer-reviewed definitions (for example the
 * finite-state exercise definitions in Europe PMC PMC13204307, which
 * /motion/deadlift-pose-estimation and /motion/lunge-detection-pose-estimation
 * cite) are on hosts the build environment cannot reach; they are listed in
 * ops/sources/form-rules.txt for a source-snapshot run, and none of their
 * numbers is copied here until a fetched copy can be quoted.
 *
 * These are the thresholds those projects ship, not biomechanical standards:
 * each was chosen by a project's author for one camera setup and one model.
 * The dataset says so in every surface that renders it.
 *
 * Two rules every generator here follows: a short parse fails (EXPECTED_ROWS
 * below), and derived fields keep their evidence (the joint a row measures is
 * derived from its `measure` quote, which is stored beside it; Ultralytics'
 * COCO keypoint indices are resolved to names through the generated keypoint
 * dataset, src/data/poseKeypoints.ts, and the script fails if they disagree).
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CACHE = ".cache/form-rules";
const META = join(CACHE, "meta.json");
const OUT = "src/data/formRules.ts";
const EVIDENCE = "ops/sources/evidence/tools-exercise-form-rules.json";
const POSE = "src/data/poseKeypoints.ts";
const OFFLINE = process.argv.includes("--offline");

const gh = (repo, branch, path) => ({
  url: `https://raw.githubusercontent.com/${repo}/${branch}/${path}`,
  page: `https://github.com/${repo}/blob/${branch}/${path}`,
  repo,
  branch,
  path,
});

/** Licensed projects, their files, and the first line of each LICENSE. */
const PROJECTS = {
  ultralytics: {
    name: "Ultralytics AIGym (workouts monitoring solution)",
    repo: "ultralytics/ultralytics",
    branch: "main",
    license: "AGPL-3.0",
    licenseFile: gh("ultralytics/ultralytics", "main", "LICENSE"),
    licenseQuote: "GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007",
    poseModel: "Ultralytics YOLO pose (COCO 17 keypoints)",
    files: {
      config: gh("ultralytics/ultralytics", "main", "ultralytics/solutions/config.py"),
      gym: gh("ultralytics/ultralytics", "main", "ultralytics/solutions/ai_gym.py"),
      angle: gh("ultralytics/ultralytics", "main", "ultralytics/solutions/solutions.py"),
      docs: gh("ultralytics/ultralytics", "main", "docs/en/guides/workouts-monitoring.md"),
    },
    angleQuote: {
      file: "angle",
      quote: "radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])",
    },
  },
  poseTrainer: {
    name: "Pose Trainer (Steven Chen and Richard Yang)",
    repo: "stevenzchen/pose-trainer",
    branch: "master",
    license: "GPL-3.0",
    licenseFile: gh("stevenzchen/pose-trainer", "master", "LICENSE"),
    licenseQuote: "GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007",
    poseModel: "OpenPose",
    files: {
      evaluate: gh("stevenzchen/pose-trainer", "master", "evaluate.py"),
      readme: gh("stevenzchen/pose-trainer", "master", "README.md"),
    },
    angleQuote: {
      file: "evaluate",
      quote:
        "upper_arm_forearm_angles = np.degrees(np.arccos(np.clip(np.sum(np.multiply(upper_arm_vecs, forearm_vecs), axis=1), -1.0, 1.0)))",
    },
    caveat: {
      file: "readme",
      quote: "WARNING: This code is experimental, and is no longer maintained or supported. It is not expected to work.",
    },
  },
  exerciseCorrection: {
    name: "Exercise-Correction (Ngô Hồng Quốc Bảo)",
    repo: "NgoQuocBao1010/Exercise-Correction",
    branch: "main",
    license: "MIT",
    licenseFile: gh("NgoQuocBao1010/Exercise-Correction", "main", "LICENSE"),
    licenseQuote: "MIT License",
    poseModel: "MediaPipe Pose (BlazePose 33 landmarks)",
    files: {
      curl: gh("NgoQuocBao1010/Exercise-Correction", "main", "web/server/detection/bicep_curl.py"),
      lunge: gh("NgoQuocBao1010/Exercise-Correction", "main", "web/server/detection/lunge.py"),
      squat: gh("NgoQuocBao1010/Exercise-Correction", "main", "web/server/detection/squat.py"),
      plank: gh("NgoQuocBao1010/Exercise-Correction", "main", "web/server/detection/plank.py"),
      utils: gh("NgoQuocBao1010/Exercise-Correction", "main", "web/server/detection/utils.py"),
    },
    angleQuote: {
      file: "utils",
      quote: "angleInDeg = angleInDeg if angleInDeg <= 180 else 360 - angleInDeg",
    },
  },
};

/**
 * One row per threshold. Values come only from `pick` applied to `quote`.
 * `comparison` and `role` describe what the source's own `usage` line does
 * with the value; they are read off that line by a reviewer, and the line is
 * stored beside them.
 */
const ROWS = [
  // ── Squat ──────────────────────────────────────────────────────────────
  {
    id: "squat-rep-count-null",
    exercise: "squat",
    purpose: "rep-count",
    role: "top-and-bottom",
    measure: "joint-angle",
    joint: "knee",
    points: ["hip", "knee", "ankle"],
    comparison: null,
    meaning: "Top and bottom knee angles for counting squat reps.",
    project: "exerciseCorrection",
    nullReason:
      "The one licensed squat source read counts squat stages with a trained classifier, not an angle threshold, so it states no top or bottom knee angle. The project that gave the squat angles here until November 2026 (thphuc05/PythonExcercisePoseEstimation) answered 404 on 2026-11-14 and was dropped.",
    file: "squat",
    reasonQuote: 'ML_MODEL_PATH = get_static_file_url("model/squat_model.pkl")',
  },
  {
    id: "squat-stance-ratio-exercise-correction",
    exercise: "squat",
    purpose: "form-check",
    role: "range",
    measure: "ratio",
    joint: "stance",
    points: null,
    comparison: "within",
    unit: "ratio",
    meaning: "Foot placement: foot width divided by shoulder width must fall within this range.",
    project: "exerciseCorrection",
    file: "squat",
    quote: "FOOT_SHOULDER_RATIO_THRESHOLDS = [1.2, 2.8]",
    pick: /\[(\d+(?:\.\d+)?), (\d+(?:\.\d+)?)\]/,
    usage: "if min_ratio_foot_shoulder <= foot_shoulder_ratio <= max_ratio_foot_shoulder:",
    measureQuote: "foot_shoulder_ratio = round(foot_width / shoulder_width, 1)",
  },

  // ── Push-up ────────────────────────────────────────────────────────────
  {
    id: "push-up-elbow-top-ultralytics",
    exercise: "push-up",
    purpose: "rep-count",
    role: "top",
    measure: "joint-angle",
    joint: "elbow",
    points: "ultralytics-kpts",
    comparison: ">",
    meaning: "Up: angle above this sets the stage to up. The documented default keypoints are for push-ups.",
    project: "ultralytics",
    file: "config",
    quote: "up_angle: float = 145.0",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: 'elif state["angle"] > self.up_angle:',
    usageFile: "gym",
    measureQuote: "kpts=[6, 8, 10],  # keypoints for monitoring specific exercise, by default it's for pushup",
    measureFile: "docs",
  },
  {
    id: "push-up-elbow-bottom-ultralytics",
    exercise: "push-up",
    purpose: "rep-count",
    role: "bottom",
    measure: "joint-angle",
    joint: "elbow",
    points: "ultralytics-kpts",
    comparison: "<",
    meaning: "Down: angle below this sets the stage to down, and counts a rep if the stage was up (the source counts on reaching the bottom, not on the return).",
    project: "ultralytics",
    file: "config",
    quote: "down_angle: float = 90.0",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: 'if state["angle"] < self.down_angle: if state["stage"] == "up": state["count"] += 1',
    usageFile: "gym",
    measureQuote: "kpts=[6, 8, 10],  # keypoints for monitoring specific exercise, by default it's for pushup",
    measureFile: "docs",
  },

  // ── Lunge ──────────────────────────────────────────────────────────────
  {
    id: "lunge-knee-bottom-range-exercise-correction",
    exercise: "lunge",
    purpose: "form-check",
    role: "range",
    measure: "joint-angle",
    joint: "knee",
    points: ["hip", "knee", "ankle"],
    comparison: "within",
    meaning: "At the bottom (the source's down stage): each knee angle must fall within this range, or the rep is flagged with a knee-angle error.",
    project: "exerciseCorrection",
    file: "lunge",
    quote: "KNEE_ANGLE_THRESHOLD = [60, 125]",
    pick: /\[(\d+(?:\.\d+)?), (\d+(?:\.\d+)?)\]/,
    usage: 'if angle_thresholds[0] <= results["right"]["angle"] <= angle_thresholds[1]:',
    measureQuote: 'results["right"]["angle"] = calculate_angle(right_hip, right_knee, right_ankle)',
  },
  {
    id: "lunge-rep-count-null",
    exercise: "lunge",
    purpose: "rep-count",
    role: "top-and-bottom",
    measure: "joint-angle",
    joint: "knee",
    points: ["hip", "knee", "ankle"],
    comparison: null,
    meaning: "Top and bottom knee angles for counting lunge reps.",
    project: "exerciseCorrection",
    nullReason:
      "The one licensed lunge source read counts lunge stages with a trained classifier, not an angle threshold, so it states no top or bottom angle. The peer-reviewed state-machine definition cited on /motion/lunge-detection-pose-estimation is on a host the build environment could not reach on the fetch date.",
    file: "lunge",
    reasonQuote: 'STAGE_ML_MODEL_PATH = get_static_file_url("model/lunge_stage_model.pkl")',
  },

  // ── Plank ──────────────────────────────────────────────────────────────
  {
    id: "plank-hold-null",
    exercise: "plank",
    purpose: "hold",
    role: "minimum",
    measure: "joint-angle",
    joint: "hip",
    points: ["knee", "hip", "shoulder"],
    comparison: null,
    meaning: "The hip angle a plank must hold, and how long before the hold counts.",
    project: "exerciseCorrection",
    nullReason:
      "The one licensed plank source read judges plank form with a trained classifier, not an angle threshold, so it states no hip angle and no hold time. The project that gave both here until November 2026 (thphuc05/PythonExcercisePoseEstimation) answered 404 on 2026-11-14 and was dropped.",
    file: "plank",
    reasonQuote: 'ML_MODEL_PATH = get_static_file_url("model/plank_model.pkl")',
  },

  // ── Bicep curl ─────────────────────────────────────────────────────────
  {
    id: "bicep-curl-elbow-top-exercise-correction",
    exercise: "bicep-curl",
    purpose: "rep-count",
    role: "top",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: ">",
    meaning: "Arm extended (the source's down stage): elbow angle above this.",
    project: "exerciseCorrection",
    file: "curl",
    quote: "STAGE_DOWN_THRESHOLD = 120",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: "if bicep_curl_angle > self.stage_down_threshold:",
    measureQuote: "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
  },
  {
    id: "bicep-curl-elbow-bottom-exercise-correction",
    exercise: "bicep-curl",
    purpose: "rep-count",
    role: "bottom",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: "<",
    meaning: "Curled (the source's up stage): elbow angle below this, after the arm was extended, counts a rep (the source counts on reaching the curl, not on the return).",
    project: "exerciseCorrection",
    file: "curl",
    quote: "STAGE_UP_THRESHOLD = 100",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: 'elif bicep_curl_angle < self.stage_up_threshold and self.stage == "down":',
    measureQuote: "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
  },
  {
    id: "bicep-curl-peak-exercise-correction",
    exercise: "bicep-curl",
    purpose: "form-check",
    role: "depth",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: "<",
    meaning: "Full range: a rep whose smallest elbow angle is this or more is flagged as a peak-contraction error.",
    project: "exerciseCorrection",
    file: "curl",
    quote: "PEAK_CONTRACTION_THRESHOLD = 60",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: "and self.peak_contraction_angle >= self.peak_contraction_threshold",
    measureQuote: "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
  },
  {
    id: "bicep-curl-upper-arm-exercise-correction",
    exercise: "bicep-curl",
    purpose: "form-check",
    role: "maximum",
    measure: "segment-angle",
    joint: "upper-arm-vertical",
    points: ["elbow", "shoulder", "vertical"],
    comparison: "<=",
    meaning: "Loose upper arm: an angle between the upper arm and the vertical above this is flagged as an error.",
    project: "exerciseCorrection",
    file: "curl",
    quote: "LOOSE_UPPER_ARM_ANGLE_THRESHOLD = 40",
    pick: /= (\d+(?:\.\d+)?)/,
    usage: "if ground_upper_arm_angle > self.loose_upper_arm_angle_threshold:",
    measureQuote: "calculate_angle(self.elbow, self.shoulder, shoulder_projection)",
  },
  {
    id: "bicep-curl-elbow-peak-pose-trainer",
    exercise: "bicep-curl",
    purpose: "form-check",
    role: "depth",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: "<=",
    meaning: "Full range: if the smallest elbow angle over the set is above this, the set is flagged as not curled all the way up.",
    project: "poseTrainer",
    file: "evaluate",
    quote: "if upper_arm_forearm_min > 70.0:",
    pick: /> (\d+(?:\.\d+)?)/,
    usage: "You are not curling the weight all the way to the top, up to your shoulders.",
    measureQuote:
      "upper_arm_forearm_angles = np.degrees(np.arccos(np.clip(np.sum(np.multiply(upper_arm_vecs, forearm_vecs), axis=1), -1.0, 1.0)))",
  },
  {
    id: "bicep-curl-upper-arm-range-pose-trainer",
    exercise: "bicep-curl",
    purpose: "form-check",
    role: "maximum",
    measure: "range-of-motion",
    joint: "upper-arm-torso",
    points: ["shoulder", "elbow", "hip", "neck"],
    comparison: "<=",
    meaning: "Upper arm still: if the upper-arm-to-torso angle varies by more than this over the set, the set is flagged for shoulder rotation.",
    project: "poseTrainer",
    file: "evaluate",
    quote: "if upper_arm_torso_range > 35.0:",
    pick: /> (\d+(?:\.\d+)?)/,
    usage: "Your upper arm shows significant rotation around the shoulder when curling.",
    measureQuote:
      "upper_arm_torso_range = np.max(upper_arm_torso_angles) - np.min(upper_arm_torso_angles)",
  },

  // ── Shoulder press ─────────────────────────────────────────────────────
  {
    id: "shoulder-press-lockout-pose-trainer",
    exercise: "shoulder-press",
    purpose: "form-check",
    role: "lockout",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: ">=",
    meaning: "Lockout: if the largest elbow angle over the set is below this, the set is flagged as not pressed all the way up.",
    project: "poseTrainer",
    file: "evaluate",
    quote: "if upper_forearm_angle < 178:",
    pick: /< (\d+(?:\.\d+)?)/,
    usage: "You are not lifting the weight all the way up. Extend your arms through the full range of motion.",
    measureQuote: 'print("Max upper arm and forearm angle: ", np.max(upper_arm_forearm_angles))',
  },
  {
    id: "shoulder-press-rep-count-null",
    exercise: "shoulder-press",
    purpose: "rep-count",
    role: "top-and-bottom",
    measure: "joint-angle",
    joint: "elbow",
    points: ["shoulder", "elbow", "wrist"],
    comparison: null,
    meaning: "Top and bottom elbow angles for counting shoulder-press reps.",
    project: "poseTrainer",
    nullReason:
      "The one licensed shoulder-press source read judges a whole recorded set by its largest elbow angle and counts no reps, so it states no bottom position and no per-rep top. No other licensed source read gives one.",
    file: "evaluate",
    reasonQuote: 'print("Max upper arm and forearm angle: ", np.max(upper_arm_forearm_angles))',
  },

  // ── Deadlift ───────────────────────────────────────────────────────────
  {
    id: "deadlift-rep-count-null",
    exercise: "deadlift",
    purpose: "rep-count",
    role: "top-and-bottom",
    measure: "joint-angle",
    joint: "hip",
    points: ["shoulder", "hip", "knee"],
    comparison: null,
    meaning: "Top and bottom hip angles for counting deadlift reps.",
    project: null,
    nullReason:
      "No licensed open-source deadlift rule could be read: the two deadlift repositories found ship no LICENSE file. The peer-reviewed state-machine definition cited on /motion/deadlift-pose-estimation is on a host the build environment could not reach on the fetch date, so its thresholds are not copied; it is listed in ops/sources/form-rules.txt for a snapshot run.",
  },
];

/** Exercises the dataset covers, in display order, and the rows each must
 *  yield. A short parse (a row dropped, an exercise lost) fails the build. */
const EXERCISES = [
  { id: "squat", name: "Squat", motion: "/motion/squat-detection-pose-estimation" },
  { id: "push-up", name: "Push-up", motion: "/motion/push-up-counter-computer-vision" },
  { id: "lunge", name: "Lunge", motion: "/motion/lunge-detection-pose-estimation" },
  { id: "plank", name: "Plank", motion: "/motion/plank-detection-pose-estimation" },
  { id: "bicep-curl", name: "Bicep curl", motion: "/motion/bicep-curl-counter-pose-estimation" },
  { id: "shoulder-press", name: "Shoulder press", motion: "/motion/overhead-press-pose-estimation" },
  { id: "deadlift", name: "Deadlift", motion: "/motion/deadlift-pose-estimation" },
];
const EXPECTED_ROWS = 16;
const EXPECTED_NULLS = 5;

/* ───────────────────────────────── fetching ───────────────────────────── */

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
const problems = [];
const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const collapse = (s) => s.replace(/\s+/g, " ").trim();

async function read(key, src) {
  const file = join(CACHE, `${key.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`);
  if (existsSync(file) && meta[key]) return readFileSync(file, "utf8");
  if (OFFLINE) throw new Error(`offline and ${file} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(src.url, { headers: { "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" } });
      if (!res.ok) throw new Error(`${res.status} for ${src.url}`);
      const text = await res.text();
      writeFileSync(file, text);
      meta[key] = { url: src.url, fetchedOn: new Date().toISOString().slice(0, 10), sha256: sha256(text) };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      return text;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const texts = {};
for (const [pid, p] of Object.entries(PROJECTS)) {
  texts[`${pid}:LICENSE`] = await read(`${pid}:LICENSE`, p.licenseFile);
  for (const [fk, f] of Object.entries(p.files)) texts[`${pid}:${fk}`] = await read(`${pid}:${fk}`, f);
}

/** 1-based line on which a (whitespace-collapsed) quote starts, or null. */
function lineOf(text, quote) {
  const want = collapse(quote);
  const lines = text.split("\n");
  // A window of four lines contains the quote for every start from
  // (first line - 3) to its first line; the last such start is the line.
  let found = -1;
  for (let i = 0; i < lines.length; i++) {
    if (collapse(lines.slice(i, i + 4).join("\n")).includes(want)) found = i;
    else if (found >= 0) break;
  }
  return found >= 0 ? found + 1 : null;
}

/** Check a quote against a fetched file; return its line anchor. */
function cite(pid, fileKey, quote, what) {
  const t = texts[`${pid}:${fileKey}`];
  if (t === undefined) {
    problems.push(`${what}: no file ${pid}:${fileKey}`);
    return null;
  }
  if (!collapse(t).includes(collapse(quote))) {
    problems.push(`${what}: quote not found in ${PROJECTS[pid].files[fileKey]?.url ?? fileKey}: ${quote}`);
    return null;
  }
  const line = lineOf(t, quote);
  const f = PROJECTS[pid].files[fileKey];
  return { url: f.url, page: line ? `${f.page}#L${line}` : f.page, quote };
}

/* ──────────────────────── keypoint names (derived) ────────────────────── */

const poseSrc = readFileSync(POSE, "utf8");
const schemesStart = poseSrc.indexOf("export const POSE_SCHEMES");
const open = poseSrc.indexOf("= [", schemesStart) + 2;
const close = poseSrc.indexOf("\n];", open);
const POSE_SCHEMES = JSON.parse(poseSrc.slice(open, close + 2));
const coco = POSE_SCHEMES.find((s) => s.slug === "coco-17");
if (!coco) problems.push("coco-17 missing from src/data/poseKeypoints.ts");

function ultralyticsPoints() {
  const docs = texts["ultralytics:docs"];
  const m = /kpts=\[(\d+), (\d+), (\d+)\],\s+# keypoints for monitoring specific exercise, by default it's for pushup/.exec(docs);
  if (!m) {
    problems.push("Ultralytics docs: default push-up kpts line not found");
    return null;
  }
  const cfg = /kpts: list\[int\] = field\(default_factory=lambda: \[(\d+), (\d+), (\d+)\]\)/.exec(texts["ultralytics:config"]);
  if (!cfg || cfg.slice(1).join() !== m.slice(1).join()) problems.push("Ultralytics: config.py default kpts disagree with the docs' push-up kpts");
  const names = m.slice(1).map((n) => coco?.points.find((p) => p.index === Number(n))?.name);
  if (names.some((n) => !n)) problems.push(`Ultralytics kpts ${m.slice(1)} not all in COCO 17`);
  // A three-point angle with the middle point as vertex (estimate_pose_angle's b).
  const expect = ["right_shoulder", "right_elbow", "right_wrist"];
  if (names.join() !== expect.join()) problems.push(`Ultralytics kpts resolve to ${names} in COCO 17, expected ${expect}`);
  return { names, indices: m.slice(1).map(Number) };
}
const ulPoints = ultralyticsPoints();

/* ───────────────────────────────── rows ───────────────────────────────── */

const evidence = [];
const out = [];
for (const r of ROWS) {
  const where = r.id;
  const ex = EXERCISES.find((e) => e.id === r.exercise);
  if (!ex) problems.push(`${where}: unknown exercise ${r.exercise}`);
  const base = {
    id: r.id,
    exercise: r.exercise,
    exerciseName: ex?.name ?? r.exercise,
    purpose: r.purpose,
    role: r.role,
    measure: r.measure,
    joint: r.joint,
    points: r.points === "ultralytics-kpts" ? (ulPoints?.names ?? null) : r.points,
    keypointIndices: r.points === "ultralytics-kpts" ? (ulPoints?.indices ?? null) : null,
    comparison: r.comparison,
    unit: r.unit ?? (r.measure === "ratio" ? "ratio" : r.measure === "frames" ? "frames" : "degrees"),
    meaning: r.meaning,
    sourceId: r.project,
  };
  if ("nullReason" in r) {
    let reasonEvidence = null;
    if (r.reasonQuote) reasonEvidence = cite(r.project, r.file, r.reasonQuote, `${where} reason`);
    out.push({ ...base, value: null, value2: null, source: reasonEvidence?.page ?? null, quote: null, usage: null, measureQuote: null, reasonQuote: reasonEvidence?.quote ?? null, nullReason: r.nullReason });
    if (reasonEvidence) {
      evidence.push({
        claim: `${ex?.name} ${r.purpose} thresholds are null in the form-rules dataset: ${r.nullReason}`,
        url: reasonEvidence.url,
        quote: reasonEvidence.quote,
      });
    }
    continue;
  }
  const q = cite(r.project, r.file, r.quote, `${where} quote`);
  const u = cite(r.project, r.usageFile ?? r.file, r.usage, `${where} usage`);
  const mq = cite(r.project, r.measureFile ?? r.file, r.measureQuote, `${where} measure`);
  if (!q) continue;
  const m = r.pick.exec(collapse(r.quote));
  if (!m) {
    problems.push(`${where}: pick ${r.pick} found nothing in its quote`);
    continue;
  }
  const nums = m.slice(1).map(Number);
  if (nums.some((n) => !Number.isFinite(n))) problems.push(`${where}: non-numeric capture ${m.slice(1)}`);
  if (r.comparison === "within" && nums.length !== 2) problems.push(`${where}: a range needs two numbers`);
  if (r.comparison !== "within" && nums.length !== 1) problems.push(`${where}: expected one number`);
  out.push({
    ...base,
    value: nums[0],
    value2: nums.length > 1 ? nums[1] : null,
    source: q.page,
    quote: q.quote,
    usage: u?.quote ?? null,
    measureQuote: mq?.quote ?? null,
    reasonQuote: null,
    nullReason: null,
  });
  const v = nums.length > 1 ? `${nums[0]} to ${nums[1]}` : String(nums[0]);
  evidence.push({ claim: `${ex?.name}: ${r.meaning} Value: ${v} (${base.unit}).`, url: q.url, quote: q.quote });
  if (u) evidence.push({ claim: `${ex?.name}: how ${r.id} is applied in the source.`, url: u.url, quote: u.quote });
  if (mq) evidence.push({ claim: `${ex?.name}: what ${r.id} measures in the source.`, url: mq.url, quote: mq.quote });
}

// Licence and angle-method evidence per project.
const sources = [];
for (const [pid, p] of Object.entries(PROJECTS)) {
  const lic = texts[`${pid}:LICENSE`];
  if (!collapse(lic).startsWith(collapse(p.licenseQuote))) problems.push(`${pid}: LICENSE does not open with "${p.licenseQuote}"`);
  // The evidence quote is the LICENSE file's first two non-empty lines: long
  // enough to count as evidence, and verbatim by construction.
  const licLines = lic.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2).join(" ");
  evidence.push({ claim: `${p.name} is licensed ${p.license}.`, url: p.licenseFile.url, quote: licLines });
  const aq = cite(pid, p.angleQuote.file, p.angleQuote.quote, `${pid} angle method`);
  if (aq) evidence.push({ claim: `${p.name} computes joint angles as a 0-180 degree angle in the image plane.`, url: aq.url, quote: aq.quote });
  let caveat = null;
  if (p.caveat) {
    caveat = cite(pid, p.caveat.file, p.caveat.quote, `${pid} caveat`);
    if (caveat) evidence.push({ claim: `${p.name}'s README says the code is unmaintained.`, url: caveat.url, quote: caveat.quote });
  }
  const files = Object.entries(p.files).map(([key, f]) => ({
    key,
    url: f.url,
    page: f.page,
    path: f.path,
    fetchedOn: meta[`${pid}:${key}`]?.fetchedOn ?? null,
    sha256: meta[`${pid}:${key}`]?.sha256 ?? null,
  }));
  for (const f of files) if (!f.sha256) problems.push(`${pid}:${f.key}: no fetch record`);
  sources.push({
    id: pid,
    name: p.name,
    repo: p.repo,
    repoUrl: `https://github.com/${p.repo}`,
    branch: p.branch,
    license: p.license,
    licenseUrl: p.licenseFile.page,
    licenseQuote: p.licenseQuote,
    licenseSha256: meta[`${pid}:LICENSE`]?.sha256 ?? null,
    poseModel: p.poseModel,
    angleMethodQuote: aq?.quote ?? null,
    angleMethodSource: aq?.page ?? null,
    caveat: caveat?.quote ?? null,
    files,
  });
}

/* Rep-counter presets: derived only where one source gives both a top and a
 * bottom for the same joint of the same exercise. */
const presets = [];
for (const ex of EXERCISES) {
  const reps = out.filter((r) => r.exercise === ex.id && r.purpose === "rep-count" && r.value !== null);
  const bySrc = new Map();
  for (const r of reps) {
    const k = `${r.sourceId}|${r.joint}`;
    (bySrc.get(k) ?? bySrc.set(k, []).get(k)).push(r);
  }
  for (const [k, rows] of bySrc) {
    const top = rows.find((r) => r.role === "top");
    const bottom = rows.find((r) => r.role === "bottom");
    if (!top || !bottom) continue;
    if (!(top.value > bottom.value)) problems.push(`${k}: top ${top.value} is not above bottom ${bottom.value}`);
    const [sourceId, joint] = k.split("|");
    const side = sourceId === "ultralytics" ? "right" : "left";
    presets.push({
      id: `${ex.id}-${joint}-${sourceId === "exerciseCorrection" ? "exercise-correction" : sourceId}`,
      exercise: ex.id,
      exerciseName: ex.name,
      sourceId,
      joint,
      side,
      startAt: "high",
      top: top.value,
      bottom: bottom.value,
      topRuleId: top.id,
      bottomRuleId: bottom.id,
      others: out.filter((r) => r.exercise === ex.id && r.sourceId === sourceId && r.purpose === "rep-count" && r.value !== null && r.id !== top.id && r.id !== bottom.id).map((r) => r.id),
    });
  }
}

/* ──────────────────────────────── checks ──────────────────────────────── */

if (out.length !== EXPECTED_ROWS) problems.push(`${out.length} rows, expected ${EXPECTED_ROWS}`);
const nulls = out.filter((r) => r.value === null).length;
if (nulls !== EXPECTED_NULLS) problems.push(`${nulls} null rows, expected ${EXPECTED_NULLS}`);
for (const ex of EXERCISES) if (!out.some((r) => r.exercise === ex.id)) problems.push(`no row for ${ex.id}`);
const ids = new Set();
for (const r of out) {
  if (ids.has(r.id)) problems.push(`duplicate id ${r.id}`);
  ids.add(r.id);
  if (r.value === null && !r.nullReason) problems.push(`${r.id}: null value without a reason`);
  if (r.value !== null && (!r.quote || !r.usage || !r.measureQuote)) problems.push(`${r.id}: a value without its three quotes`);
}

if (problems.length) {
  console.error("REFUSING TO WRITE — a quote is missing from its source, or a count changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const fetchedOn = Object.values(meta).map((m) => m.fetchedOn).sort().at(-1);

const body = `/**
 * Open exercise form-rules dataset: the joint-angle thresholds that licensed
 * open-source exercise trackers ship, per exercise, each with the verbatim
 * line it was read from.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-form-rules.mjs
 * (then \`npm run datasets\`). Fetched: ${fetchedOn}
 *
 * Every \`value\` was captured from \`quote\` after the generator found \`quote\`
 * in the fetched file; \`usage\` is the line that applies it and
 * \`measureQuote\` the line that computes what it is compared with. A null
 * value carries \`nullReason\`. These are the projects' own choices for their
 * own setups, not biomechanical standards.
 */

/** The date the generator last read its sources. */
export const FORM_RULES_FETCHED_ON = ${JSON.stringify(fetchedOn)};

export type FormRuleSource = {
  id: string;
  name: string;
  repo: string;
  repoUrl: string;
  branch: string;
  license: string;
  licenseUrl: string;
  /** The LICENSE file's opening words, checked against the fetched file. */
  licenseQuote: string;
  licenseSha256: string | null;
  poseModel: string;
  /** The line that computes the source's angles. */
  angleMethodQuote: string | null;
  angleMethodSource: string | null;
  /** A warning the project's own README gives, verbatim; null when none. */
  caveat: string | null;
  files: { key: string; url: string; page: string; path: string; fetchedOn: string | null; sha256: string | null }[];
};

export const FORM_RULE_SOURCES: FormRuleSource[] = ${JSON.stringify(sources, null, 2)};

export type FormRuleExercise = { id: string; name: string; motion: string };

export const FORM_RULE_EXERCISES: FormRuleExercise[] = ${JSON.stringify(EXERCISES, null, 2)};

export type FormRule = {
  id: string;
  exercise: string;
  exerciseName: string;
  /** rep-count: a phase boundary; form-check: an error rule; hold: an isometric rule. */
  purpose: "rep-count" | "form-check" | "hold";
  role: string;
  measure: "joint-angle" | "segment-angle" | "range-of-motion" | "ratio" | "frames";
  joint: string | null;
  /** The points as the source names them, vertex in the middle for a three-point angle. */
  points: string[] | null;
  /** COCO 17 indices, where the source names indices rather than points. */
  keypointIndices: number[] | null;
  comparison: ">" | "<" | ">=" | "<=" | "within" | null;
  unit: "degrees" | "ratio" | "frames";
  /** What crossing the value does in the source, in our words; the usage quote is the evidence. */
  meaning: string;
  sourceId: string | null;
  value: number | null;
  /** The upper bound of a "within" range. */
  value2: number | null;
  /** The source file and line. */
  source: string | null;
  quote: string | null;
  usage: string | null;
  measureQuote: string | null;
  /** For a null row: the source line that shows why it states no number. */
  reasonQuote: string | null;
  nullReason: string | null;
};

export const FORM_RULES: FormRule[] = ${JSON.stringify(out, null, 2)};

/** DERIVED: one rep-counter starting config per source and joint where that
 *  source gives both a top and a bottom value. */
export type FormRulePreset = {
  id: string;
  exercise: string;
  exerciseName: string;
  sourceId: string;
  joint: string;
  side: "left" | "right" | "either" | "best";
  startAt: "high" | "low";
  top: number;
  bottom: number;
  topRuleId: string;
  bottomRuleId: string;
  /** Other rep-count rules of the same source the single-angle counter does not apply. */
  others: string[];
};

export const FORM_RULE_PRESETS: FormRulePreset[] = ${JSON.stringify(presets, null, 2)};
`;

writeFileSync(OUT, body);
writeFileSync(EVIDENCE, JSON.stringify(evidence, null, 2) + "\n");
console.log(`✓ ${OUT}: ${out.length} rules (${nulls} null), ${presets.length} presets, ${sources.length} sources; ${EVIDENCE}: ${evidence.length} quotes.`);
