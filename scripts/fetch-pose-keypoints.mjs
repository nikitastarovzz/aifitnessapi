#!/usr/bin/env node
/**
 * Regenerate src/data/poseKeypoints.ts — the keypoint schemes of the pose
 * models this site covers — from each model's own published source:
 *
 *   MediaPipe / BlazePose 33  the PoseLandmark enum in google-ai-edge/mediapipe
 *                             (Tasks pose_landmarker.py, cross-checked against
 *                             the legacy solutions/pose.py and TF.js's
 *                             BLAZEPOSE_KEYPOINTS)
 *   ML Kit 33                 Google's Android PoseLandmark reference
 *                             ("Constant Value" of every int constant)
 *   COCO 17                   MMPose configs/_base_/datasets/coco.py,
 *                             cross-checked against TF.js COCO_KEYPOINTS,
 *                             Ultralytics coco-pose.yaml kpt_names and the
 *                             Ultralytics docs' keypoint index map
 *   Halpe26, COCO-WholeBody   MMPose halpe26.py and coco_wholebody.py
 *   OpenPose BODY_25, COCO 18 POSE_BODY_25_BODY_PARTS / POSE_COCO_BODY_PARTS in
 *                             poseParameters.cpp (BODY_25 cross-checked
 *                             against doc/02_output.md)
 *   Apple Vision 2D and 3D    the JSON Apple serves for
 *                             VNHumanBodyPoseObservation.JointName and
 *                             VNHumanBodyPose3DObservation.JointName
 *
 * GitHub files are read from raw.githubusercontent.com on the branch named in
 * SOURCES; the branch and the SHA-256 of the bytes read are stored with each
 * source, so a reader can tell exactly which revision a row came from.
 *
 * No model in this loop. Names are copied exactly as each source spells them.
 * "Which models use this scheme" is set only where a sentence or heading in a
 * fetched source says so, and that text is stored beside the claim. The one
 * derived field is the crosswalk key: a point's name lowercased with every
 * character outside a-z and 0-9 removed. Two points share a crosswalk row only
 * when their keys are identical, so left_knee, LEFT_KNEE and leftKnee join,
 * while MOUTH_LEFT / LEFT_MOUTH and RShoulder / right_shoulder do not: names
 * that are not identical after that normalisation stay unmapped rather than
 * guessed.
 *
 * A short parse, an unexpected count, or two sources that disagree about the
 * same scheme makes the script refuse to write.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-keypoints.mjs [--offline]
 *   --offline reparses the cache in .cache/pose-keypoints without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CACHE = ".cache/pose-keypoints";
const META = join(CACHE, "meta.json");
const OUT = "src/data/poseKeypoints.ts";
const OFFLINE = process.argv.includes("--offline");

const APPLE_DATA = "https://developer.apple.com/tutorials/data";
const gh = (repo, branch, path) => ({
  kind: "github",
  url: `https://raw.githubusercontent.com/${repo}/${branch}/${path}`,
  page: `https://github.com/${repo}/blob/${branch}/${path}`,
  repo,
  branch,
  path,
});
const devsite = (path) => ({
  kind: "devsite",
  url: `https://developers.google.com${path}?hl=en`,
  page: `https://developers.google.com${path}`,
  repo: null,
  branch: null,
  path: null,
});
const apple = (path) => ({
  kind: "apple",
  url: `${APPLE_DATA}/documentation/${path}.json`,
  page: `https://developer.apple.com/documentation/${path}`,
  repo: null,
  branch: null,
  path: null,
});

/** Every file this generator reads. `title` is how the pages name it. */
const SOURCES = {
  mpTasks: { ...gh("google-ai-edge/mediapipe", "master", "mediapipe/tasks/python/vision/pose_landmarker.py"), title: "MediaPipe Tasks pose_landmarker.py" },
  mpSolution: { ...gh("google-ai-edge/mediapipe", "master", "mediapipe/python/solutions/pose.py"), title: "MediaPipe legacy Pose solution pose.py" },
  tfjsConstants: { ...gh("tensorflow/tfjs-models", "master", "pose-detection/src/constants.ts"), title: "TF.js pose-detection constants.ts" },
  tfjsReadme: { ...gh("tensorflow/tfjs-models", "master", "pose-detection/README.md"), title: "TF.js pose-detection README" },
  mmposeCoco: { ...gh("open-mmlab/mmpose", "main", "configs/_base_/datasets/coco.py"), title: "MMPose coco.py dataset meta info" },
  mmposeHalpe26: { ...gh("open-mmlab/mmpose", "main", "configs/_base_/datasets/halpe26.py"), title: "MMPose halpe26.py dataset meta info" },
  mmposeWholebody: { ...gh("open-mmlab/mmpose", "main", "configs/_base_/datasets/coco_wholebody.py"), title: "MMPose coco_wholebody.py dataset meta info" },
  rtmposeReadme: { ...gh("open-mmlab/mmpose", "main", "projects/rtmpose/README.md"), title: "RTMPose README" },
  ultralyticsYaml: { ...gh("ultralytics/ultralytics", "main", "ultralytics/cfg/datasets/coco-pose.yaml"), title: "Ultralytics coco-pose.yaml" },
  ultralyticsDocs: { ...gh("ultralytics/ultralytics", "main", "docs/en/tasks/pose.md"), title: "Ultralytics pose task docs (pose.md)" },
  openposeParams: { ...gh("CMU-Perceptual-Computing-Lab/openpose", "master", "src/openpose/pose/poseParameters.cpp"), title: "OpenPose poseParameters.cpp" },
  openposeDoc: { ...gh("CMU-Perceptual-Computing-Lab/openpose", "master", "doc/02_output.md"), title: "OpenPose output format doc (02_output.md)" },
  mlkitLandmark: { ...devsite("/android/reference/com/google/mlkit/vision/pose/PoseLandmark"), title: "ML Kit PoseLandmark (Android reference)" },
  mlkitAndroid: { ...devsite("/ml-kit/vision/pose-detection/android"), title: "Detect poses with ML Kit on Android" },
  appleJoints2d: { ...apple("vision/vnhumanbodyposeobservation/jointname"), title: "VNHumanBodyPoseObservation.JointName" },
  appleJoints3d: { ...apple("vision/vnhumanbodypose3dobservation/jointname"), title: "VNHumanBodyPose3DObservation.JointName" },
  appleRequest2d: { ...apple("vision/vndetecthumanbodyposerequest"), title: "VNDetectHumanBodyPoseRequest" },
  appleRequest3d: { ...apple("vision/vndetecthumanbodypose3drequest"), title: "VNDetectHumanBodyPose3DRequest" },
  appleObservation3d: { ...apple("vision/vnhumanbodypose3dobservation"), title: "VNHumanBodyPose3DObservation" },
};

/**
 * Exact point counts of the last verified read (2026-10-17). A scheme with a
 * different count is a different scheme, or a parse that went wrong, so both
 * directions refuse. Change a number only after reading the source and
 * confirming the scheme itself changed.
 */
const EXPECTED = {
  "blazepose-33": 33,
  "ml-kit": 33,
  "coco-17": 17,
  "halpe-26": 26,
  "coco-wholebody-133": 133,
  "openpose-body-25": 25,
  "openpose-coco-18": 18,
  "apple-vision-2d": 19,
  "apple-vision-3d": 17,
};

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
const problems = [];

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

function trimDevsite(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

/** Read one source (cached), recording when and what was read. */
async function read(id) {
  const src = SOURCES[id];
  const file = join(CACHE, `${id}.txt`);
  if (existsSync(file)) return readFileSync(file, "utf8");
  if (OFFLINE) throw new Error(`offline and ${file} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(src.url, {
        headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" },
      });
      if (!res.ok) throw new Error(`${res.status} for ${src.url}`);
      let text = await res.text();
      const hash = sha256(text);
      if (src.kind === "devsite") {
        text = trimDevsite(text);
        if (/devsite-banner-translated/.test(text)) throw new Error(`translated page served for ${src.url}`);
      }
      if (src.kind === "apple") JSON.parse(text);
      writeFileSync(file, text);
      meta[id] = { url: src.url, fetchedOn: new Date().toISOString().slice(0, 10), sha256: hash };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      await new Promise((r) => setTimeout(r, 200));
      return text;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
const squash = (s) => s.replace(/\s+/g, " ").trim();
const textOf = (html) => squash(decodeEntities(html.replace(/<[^>]+>/g, "")));
/** Markdown rendered as plain text: heading marks dropped, a link shown as its
 *  text — the sentence a reader of the rendered README sees. */
const mdText = (md) =>
  md == null ? null : squash(md.replace(/^#+\s*/, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/ - /, ": "));
/** Source code with line-comment markers removed, so a comment that wraps
 *  across lines reads as the sentence it is. */
const uncomment = (code) => code.replace(/^[ \t]*(\/\/|#)[ \t]?/gm, "");
const googleLastUpdated = (html) => /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;

/** The crosswalk key: lowercase, every character outside a-z0-9 removed. */
const keyOf = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Find `needle` (a string or a RegExp) in `text`; record a problem if absent. */
function evidence(text, needle, what) {
  if (typeof needle === "string") {
    if (squash(text).includes(squash(needle))) return squash(needle);
  } else {
    const m = needle.exec(squash(text));
    if (m) return m[0];
  }
  problems.push(`${what}: evidence ${needle} not found in the source`);
  return null;
}

// ── Parsers ────────────────────────────────────────────────────────────────

/** `class <name>(enum.IntEnum):` members `NAME = N`, with its docstring. */
function pyIntEnum(text, className, label) {
  const at = text.indexOf(`class ${className}(enum.IntEnum):`);
  if (at < 0) {
    problems.push(`${label}: class ${className}(enum.IntEnum) not found`);
    return { doc: null, members: [] };
  }
  const rest = text.slice(at).split("\n").slice(1);
  let doc = null;
  const members = [];
  for (const line of rest) {
    if (/^\S/.test(line)) break; // dedent: the class body ended
    const d = /^\s+"""(.*)"""\s*$/.exec(line);
    if (d && doc === null && members.length === 0) {
      doc = d[1].trim();
      continue;
    }
    const m = /^\s+([A-Z][A-Z0-9_]*)\s*=\s*(\d+)\s*$/.exec(line);
    if (m) members.push({ name: m[1], index: Number(m[2]) });
  }
  return { doc, members };
}

/** `export const NAME = [ 'a', 'b', … ];` → ["a", "b", …]. */
function tsStringArray(text, constName, label) {
  const m = new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\];`).exec(text);
  if (!m) {
    problems.push(`${label}: export const ${constName} not found`);
    return [];
  }
  return [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
}

/** README list lines `N: name` under a heading, until the next heading or rule. */
function readmeIndexList(text, headingRe, label) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => headingRe.test(l));
  if (start < 0) {
    problems.push(`${label}: heading ${headingRe} not found`);
    return { heading: null, items: [] };
  }
  const items = [];
  for (const l of lines.slice(start + 1)) {
    if (/^#{1,6}\s|^-{3,}/.test(l)) break;
    const m = /^(\d+):\s*([A-Za-z_]+)/.exec(l.trim());
    if (m) items.push({ index: Number(m[1]), name: m[2] });
  }
  return { heading: lines[start].replace(/^#+\s*/, "").trim(), items };
}

/** The `(...)` body that opens at `open` (an index of "("), quotes respected. */
function parenBody(s, open) {
  let depth = 0;
  let q = null;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === "\\") i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === "'" || c === '"') q = c;
    else if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return s.slice(open + 1, i);
  }
  return null;
}

/** MMPose dataset meta info: keypoint_info entries and the paper it cites. */
function mmposeDataset(text, label) {
  const dataset = /dataset_name='([^']+)'/.exec(text)?.[1] ?? null;
  const paperAt = text.indexOf("paper_info=dict(");
  const paper = paperAt >= 0 ? parenBody(text, paperAt + "paper_info=dict".length) : null;
  const str = (body, k) => {
    const m = new RegExp(`${k}=((?:\\s*r?'[^']*'\\s*)+)`).exec(body ?? "");
    return m ? squash([...m[1].matchAll(/r?'([^']*)'/g)].map((x) => x[1]).join("")) : null;
  };
  const kiStart = text.indexOf("keypoint_info={");
  const kiEnd = text.indexOf("skeleton_info=", kiStart);
  if (kiStart < 0 || kiEnd < 0) {
    problems.push(`${label}: keypoint_info block not found`);
    return { dataset, paper: null, points: [] };
  }
  const block = text.slice(kiStart, kiEnd);
  const points = [];
  for (const m of block.matchAll(/(\d+):\s*dict\(/g)) {
    const body = parenBody(block, m.index + m[0].length - 1);
    if (body === null) {
      problems.push(`${label}: unbalanced dict( at key ${m[1]}`);
      continue;
    }
    const name = /name='([^']*)'/.exec(body)?.[1];
    const id = /\bid=(\d+)/.exec(body)?.[1];
    const swap = /swap='([^']*)'/.exec(body)?.[1];
    if (name === undefined || id === undefined) {
      problems.push(`${label}: entry ${m[1]} has no name or id`);
      continue;
    }
    if (Number(id) !== Number(m[1])) problems.push(`${label}: entry ${m[1]} declares id=${id}`);
    points.push({ index: Number(id), name, swap: swap === undefined || swap === "" ? null : swap });
  }
  return {
    dataset,
    paper: paper ? { title: str(paper, "title"), year: str(paper, "year"), homepage: str(paper, "homepage") } : null,
    points,
  };
}

/** `const std::map<unsigned int, std::string> NAME { {0, "Nose"}, … };` */
function cppBodyParts(text, mapName, label) {
  const m = new RegExp(`std::map<unsigned int, std::string> ${mapName} \\{([\\s\\S]*?)\\};`).exec(text);
  if (!m) {
    problems.push(`${label}: ${mapName} not found`);
    return [];
  }
  return [...m[1].matchAll(/\{\s*(\d+),\s*"([^"]+)"\s*\}/g)].map((x) => ({ index: Number(x[1]), name: x[2] }));
}

/** Apple JointName JSON: the `static let` constants in topic-section order. */
function appleJoints(doc, typeTitle, label) {
  const out = [];
  for (const sec of doc.topicSections ?? []) {
    for (const id of sec.identifiers ?? []) {
      const r = doc.references?.[id];
      const decl = (r?.fragments ?? []).map((f) => f.text).join("");
      const m = new RegExp(`^static let (\\w+): ${typeTitle.replace(/\./g, "\\.")}$`).exec(decl);
      if (!m) continue; // the initializer and anything that is not a joint constant
      if (m[1] !== r.title) problems.push(`${label}: declaration names ${m[1]} but the title is ${r.title}`);
      out.push({
        name: r.title,
        group: sec.title,
        description: squash((r.abstract ?? []).map((a) => a.text ?? a.code ?? "").join("")) || null,
        docUrl: `https://developer.apple.com${r.url}`,
        deprecated: Boolean(r.deprecated),
      });
    }
  }
  if (!out.length) problems.push(`${label}: no static let joint constants found`);
  return out;
}
const appleAbstract = (doc) => squash((doc.abstract ?? []).map((a) => a.text ?? a.code ?? "").join(""));
const applePlatforms = (doc) => (doc.metadata?.platforms ?? []).map((p) => ({ name: p.name, introducedAt: p.introducedAt ?? null }));
/** First Overview paragraph of an Apple page, references resolved to titles. */
function appleOverview(doc) {
  for (const sec of doc.primaryContentSections ?? []) {
    if (sec.kind !== "content") continue;
    for (const node of sec.content ?? []) {
      if (node.type !== "paragraph") continue;
      return squash(
        (node.inlineContent ?? [])
          .map((n) => (n.type === "text" ? n.text : n.type === "codeVoice" ? n.code : n.type === "reference" ? (doc.references?.[n.identifier]?.title ?? "") : ""))
          .join(""),
      );
    }
  }
  return null;
}
/** Abstract of a symbol the page lists in its topic sections, by title. */
function appleTopicAbstract(doc, title, label) {
  for (const sec of doc.topicSections ?? []) {
    for (const id of sec.identifiers ?? []) {
      const r = doc.references?.[id];
      if (r?.title === title) return squash((r.abstract ?? []).map((a) => a.text ?? a.code ?? "").join(""));
    }
  }
  problems.push(`${label}: topic ${title} not found`);
  return null;
}

// ── Read everything ────────────────────────────────────────────────────────
const T = {};
for (const id of Object.keys(SOURCES)) T[id] = await read(id);
const J = {};
for (const id of Object.keys(SOURCES).filter((k) => SOURCES[k].kind === "apple")) J[id] = JSON.parse(T[id]);

const schemes = [];
/** A cross-check that must hold; a failure refuses the write. */
function crossCheck(scheme, ok, what, detail) {
  if (!ok) problems.push(`${scheme}: cross-check failed — ${what}${detail ? `: ${detail}` : ""}`);
  return what;
}
const sameNames = (a, b, norm = (x) => x) => a.length === b.length && a.every((x, i) => norm(x) === norm(b[i]));
const firstDiff = (a, b, norm = (x) => x) => {
  const i = a.findIndex((x, j) => norm(x) !== norm(b[j] ?? ""));
  return i < 0 ? (a.length !== b.length ? `lengths ${a.length} vs ${b.length}` : "") : `index ${i}: ${a[i]} vs ${b[i]}`;
};

// ── 1. BlazePose 33 (MediaPipe) ────────────────────────────────────────────
{
  const tasks = pyIntEnum(T.mpTasks, "PoseLandmark", "mediapipe tasks");
  const legacy = pyIntEnum(T.mpSolution, "PoseLandmark", "mediapipe solution");
  const tfjs = tsStringArray(T.tfjsConstants, "BLAZEPOSE_KEYPOINTS", "tfjs constants");
  const readme = readmeIndexList(T.tfjsReadme, /^###\s+BlazePose Keypoints/, "tfjs README");
  const names = tasks.members.map((m) => m.name);
  const checks = [
    crossCheck(
      "blazepose-33",
      tasks.members.every((m, i) => m.index === i),
      "MediaPipe Tasks PoseLandmark values run 0 to N-1 in declaration order",
    ),
    crossCheck(
      "blazepose-33",
      sameNames(names, legacy.members.map((m) => m.name)) && legacy.members.every((m, i) => m.index === i),
      "the legacy solutions/pose.py PoseLandmark enum declares the same names at the same values",
      firstDiff(names, legacy.members.map((m) => m.name)),
    ),
    crossCheck(
      "blazepose-33",
      sameNames(names, tfjs, keyOf),
      "TF.js BLAZEPOSE_KEYPOINTS lists the same names in the same order (lowercase)",
      firstDiff(names, tfjs, keyOf),
    ),
    crossCheck(
      "blazepose-33",
      readme.items.slice(0, names.length).every((it, i) => it.index === i && keyOf(it.name) === keyOf(names[i])),
      "the TF.js README's BlazePose keypoint list agrees for every index the enum defines",
    ),
  ];
  const readmeOnly = readme.items.filter((it) => it.index >= names.length);
  const notes = [
    { sourceId: "mpTasks", text: evidence(T.mpTasks, /The pose landmarks detection result from PoseLandmarker, where each vector element represents a single pose detected in the image\./, "mediapipe result docstring") },
    { sourceId: "mpTasks", text: evidence(T.mpTasks, "pose_landmarks: Detected pose landmarks in normalized image coordinates.", "mediapipe pose_landmarks docstring") },
    { sourceId: "mpTasks", text: evidence(T.mpTasks, "pose_world_landmarks: Detected pose landmarks in world coordinates.", "mediapipe world docstring") },
    { sourceId: "mpTasks", text: evidence(T.mpTasks, "num_poses: The maximum number of poses can be detected by the PoseLandmarker.", "mediapipe num_poses docstring") },
    { sourceId: "mpTasks", text: evidence(T.mpTasks, /num_poses: int = \d+/, "mediapipe num_poses default") },
    {
      sourceId: "mpSolution",
      text: evidence(
        T.mpSolution,
        /"pose_world_landmarks" field that contains the pose landmarks in real-world 3D coordinates that are in meters with the origin at the center between hips\./,
        "mediapipe legacy world-landmark docstring",
      ),
    },
    { sourceId: "tfjsReadme", text: evidence(T.tfjsReadme, "For the `keypoints`, x and y represent the actual keypoint position in the image.", "tfjs keypoints coordinates") },
    {
      sourceId: "tfjsReadme",
      text: evidence(
        T.tfjsReadme,
        /For the `keypoints3D`, x, y and z represent absolute distance in meters in a 2 x 2 x 2 meter cubic space\. The range for each axis goes from -1 to 1 \(therefore 2m total delta\)\. The z is always perpendicular to the xy plane that passes the center of the hip, so the coordinate for the hip center is \(0, 0, 0\)\./,
        "tfjs keypoints3D coordinates",
      ),
    },
  ];
  if (readmeOnly.length) {
    notes.push({
      sourceId: "tfjsReadme",
      text: `The README's BlazePose keypoint list continues past ${names.length - 1} with ${readmeOnly
        .map((it) => `${it.index}: ${it.name}`)
        .join(", ")}; BLAZEPOSE_KEYPOINTS in constants.ts, whose comment says the order "needs to be consistent with the model keypoint result list", stops at ${names.length - 1}.`,
    });
    evidence(uncomment(T.tfjsConstants), "The order needs to be consistent with the model keypoint result list.", "tfjs constants order comment");
  }
  schemes.push({
    slug: "blazepose-33",
    name: "BlazePose 33 (MediaPipe pose landmarks)",
    shortName: "BlazePose 33",
    family: "MediaPipe",
    sourceId: "mpTasks",
    nameSource: "the PoseLandmark enum in MediaPipe's Tasks pose_landmarker.py",
    indexed: true,
    points: tasks.members.map((m, i) => ({
      index: m.index,
      order: i,
      name: m.name,
      altNames: tfjs[i] && tfjs[i] !== m.name ? [{ sourceId: "tfjsConstants", name: tfjs[i] }] : [],
      description: null,
      group: null,
      swap: null,
      docUrl: null,
    })),
    excluded: [],
    crossChecks: checks,
    checkSources: ["mpSolution", "tfjsConstants", "tfjsReadme"],
    usedBy: [
      { modelId: "mediapipe-pose-landmarker", model: "MediaPipe Pose Landmarker (Tasks API)", sourceId: "mpTasks", evidence: evidence(T.mpTasks, `class PoseLandmark(enum.IntEnum): """${tasks.doc ?? "The 33 pose landmarks."}"""`, "mediapipe tasks docstring") },
      { modelId: "mediapipe-pose-legacy", model: "MediaPipe Pose (legacy Solutions API)", sourceId: "mpSolution", evidence: evidence(T.mpSolution, `class PoseLandmark(enum.IntEnum): """${legacy.doc ?? "The 33 pose landmarks."}"""`, "mediapipe solution docstring") },
      { modelId: "tfjs-blazepose", model: "BlazePose in TF.js pose-detection", sourceId: "tfjsReadme", evidence: evidence(T.tfjsReadme, "MediaPipe BlazePose returns 33 keypoints.", "tfjs README blazepose") },
    ],
    notes: notes.filter((n) => n.text),
    datasetInfo: null,
    platforms: null,
  });
}

// ── 2. ML Kit 33 ───────────────────────────────────────────────────────────
{
  const html = T.mlkitLandmark;
  // The page has two sections with id="constants": the summary table, and
  // the details (the one with the h2) that carries each "Constant Value".
  const secAt = html.indexOf('<h2 id="constants"');
  const secEnd = secAt >= 0 ? html.indexOf("</section>", secAt) : -1;
  if (secAt < 0 || secEnd < 0) problems.push("ml kit: constants detail section not found");
  const sec = html.slice(secAt, secEnd);
  const consts = [];
  for (const block of sec.split('<div class="jd-details">').slice(1)) {
    const name = /<strong>([A-Z_]+)<\/strong>/.exec(block)?.[1];
    const desc = /<div class="jd-tagdata jd-tagdescr">\s*<p>([\s\S]*?)<\/p>/.exec(block)?.[1];
    const value = /Constant Value:<\/span>\s*<span>(\d+)<\/span>/.exec(block)?.[1];
    if (!name || value === undefined) {
      problems.push(`ml kit: a constant block did not parse (${name ?? "no name"})`);
      continue;
    }
    consts.push({ name, value: Number(value), description: desc ? textOf(desc) : null });
  }
  consts.sort((a, b) => a.value - b.value);
  const contiguous = consts.every((c, i) => c.value === i);
  const z = (() => {
    const at = html.indexOf('<a name="getPosition3D()"');
    const block = at >= 0 ? html.slice(at, html.indexOf("</ul>", at)) : "";
    return [...block.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => textOf(m[1]));
  })();
  if (z.length < 3) problems.push(`ml kit: only ${z.length} getPosition3D notes parsed`);
  const blaze = schemes.find((s) => s.slug === "blazepose-33");
  const sameAsBlaze = consts.filter((c) => blaze.points[c.value]?.name === c.name).length;
  schemes.push({
    slug: "ml-kit",
    name: "ML Kit PoseLandmark (33 landmarks)",
    shortName: "ML Kit 33",
    family: "ML Kit",
    sourceId: "mlkitLandmark",
    nameSource: "the int constants of com.google.mlkit.vision.pose.PoseLandmark (Android reference)",
    indexed: true,
    points: consts.map((c, i) => ({
      index: c.value,
      order: i,
      name: c.name,
      altNames: [],
      description: c.description,
      group: null,
      swap: null,
      docUrl: `${SOURCES.mlkitLandmark.page}#${c.name}`,
    })),
    excluded: [],
    crossChecks: [
      crossCheck("ml-kit", contiguous, "the Constant Values run 0 to N-1 with no gaps", consts.map((c) => c.value).join(",")),
      `${sameAsBlaze} of the ${consts.length} constants have the same name and value as MediaPipe's PoseLandmark`,
    ],
    checkSources: ["mpTasks"],
    usedBy: [
      {
        modelId: "ml-kit",
        model: "ML Kit Pose Detection (base and accurate SDKs)",
        sourceId: "mlkitAndroid",
        evidence: evidence(T.mlkitAndroid ? textOf(T.mlkitAndroid) : "", /the pose detection API returns a Pose object with \d+ PoseLandmarks\./, "ml kit android guide"),
      },
    ],
    notes: z.map((t) => ({ sourceId: "mlkitLandmark", text: `getPosition3D(): ${t}` })),
    datasetInfo: null,
    platforms: null,
    sourceUpdated: googleLastUpdated(html),
  });
}

// ── 3. COCO 17 (MMPose, TF.js, Ultralytics) ────────────────────────────────
const coco = mmposeDataset(T.mmposeCoco, "mmpose coco.py");
{
  const names = coco.points.map((p) => p.name);
  const tfjs = tsStringArray(T.tfjsConstants, "COCO_KEYPOINTS", "tfjs constants");
  const readme = readmeIndexList(T.tfjsReadme, /^###\s+COCO Keypoints/, "tfjs README");
  const yaml = (() => {
    const shape = /^kpt_shape:\s*\[(\d+),\s*(\d+)\]\s*(#.*)?$/m.exec(T.ultralyticsYaml);
    const at = T.ultralyticsYaml.indexOf("kpt_names:");
    const list = [];
    if (at >= 0) {
      const lines = T.ultralyticsYaml.slice(at).split("\n").slice(1);
      let inClass0 = false;
      for (const l of lines) {
        if (/^\s+0:\s*$/.test(l)) {
          inClass0 = true;
          continue;
        }
        const m = /^\s+-\s+(\S+)\s*$/.exec(l);
        if (inClass0 && m) list.push(m[1]);
        else if (inClass0 && list.length) break;
      }
    }
    return { shape: shape ? { k: Number(shape[1]), dims: Number(shape[2]), comment: shape[3]?.replace(/^#\s*/, "") ?? null } : null, names: list };
  })();
  const docs = (() => {
    const at = T.ultralyticsDocs.indexOf("### Keypoint index map");
    if (at < 0) {
      problems.push("ultralytics docs: ### Keypoint index map not found");
      return [];
    }
    const out = [];
    for (const l of T.ultralyticsDocs.slice(at).split("\n").slice(1)) {
      if (/^#{1,6}\s/.test(l)) break;
      const m = /^(\d+)\.\s+(.+)$/.exec(l.trim());
      if (m) out.push({ index: Number(m[1]), name: m[2].trim() });
    }
    return out;
  })();
  const checks = [
    crossCheck("coco-17", coco.points.every((p, i) => p.index === i), "MMPose keypoint_info ids run 0 to N-1"),
    crossCheck("coco-17", sameNames(names, tfjs), "TF.js COCO_KEYPOINTS spells the same names in the same order", firstDiff(names, tfjs)),
    crossCheck("coco-17", sameNames(names, yaml.names), "Ultralytics coco-pose.yaml kpt_names spells the same names in the same order", firstDiff(names, yaml.names)),
    crossCheck(
      "coco-17",
      docs.length === names.length && docs.every((d, i) => d.index === i && keyOf(d.name) === keyOf(names[i])),
      "the Ultralytics docs' keypoint index map lists the same points in the same order (title case)",
      firstDiff(names, docs.map((d) => d.name), keyOf),
    ),
    crossCheck(
      "coco-17",
      readme.items.length === names.length && readme.items.every((it, i) => it.index === i && it.name === names[i]),
      "the TF.js README's COCO keypoint list agrees at every index",
    ),
    crossCheck("coco-17", yaml.shape?.k === names.length, "Ultralytics kpt_shape declares the same keypoint count", String(yaml.shape?.k)),
  ];
  const ultraEvidence = evidence(T.ultralyticsDocs, /The default (YOLO\w*) Pose models predict the 17 COCO keypoints/, "ultralytics docs index map sentence");
  const ultraFamily = /The default (YOLO\w*) Pose/.exec(ultraEvidence ?? "")?.[1] ?? "YOLO";
  const rtmEvidence = evidence(
    T.rtmposeReadme,
    /#### 17 Keypoints - Keypoints are defined as \[COCO\]\(http:\/\/cocodataset\.org\/\)\. For details please refer to the \[meta info\]\(\/configs\/_base_\/datasets\/coco\.py\)\./,
    "rtmpose README 17 keypoints",
  );
  const notes = [
    { sourceId: "tfjsConstants", text: evidence(uncomment(T.tfjsConstants), "Don't change the order. The order needs to be consistent with the model keypoint result list.", "tfjs order comment") },
    yaml.shape?.comment ? { sourceId: "ultralyticsYaml", text: `kpt_shape: [${yaml.shape.k}, ${yaml.shape.dims}] — ${yaml.shape.comment}` } : null,
    ...[...T.ultralyticsDocs.matchAll(/\|\s*`(result\.keypoints\.\w+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|/g)].map((m) => ({
      sourceId: "ultralyticsDocs",
      text: `${m[1]} (${m[2]}, shape ${m[3]}): ${squash(m[4])}`,
    })),
    { sourceId: "tfjsReadme", text: evidence(T.tfjsReadme, "PoseNet and MoveNet both return 17 keypoints.", "tfjs README 17 keypoints") },
  ].filter((n) => n && n.text);
  schemes.push({
    slug: "coco-17",
    name: "COCO 17 keypoints",
    shortName: "COCO 17",
    family: "COCO",
    sourceId: "mmposeCoco",
    nameSource: "keypoint_info in MMPose's configs/_base_/datasets/coco.py",
    indexed: true,
    points: coco.points.map((p, i) => ({
      index: p.index,
      order: i,
      name: p.name,
      altNames: docs[i] && docs[i].name !== p.name ? [{ sourceId: "ultralyticsDocs", name: docs[i].name }] : [],
      description: null,
      group: null,
      swap: p.swap,
      docUrl: null,
    })),
    excluded: [],
    crossChecks: checks,
    checkSources: ["tfjsConstants", "ultralyticsYaml", "ultralyticsDocs", "tfjsReadme"],
    usedBy: [
      { modelId: "movenet", model: "MoveNet (TF.js pose-detection)", sourceId: "tfjsReadme", evidence: readme.heading },
      { modelId: "posenet", model: "PoseNet (TF.js pose-detection)", sourceId: "tfjsReadme", evidence: readme.heading },
      { modelId: "yolo-pose", model: `Ultralytics ${ultraFamily} default pose models`, sourceId: "ultralyticsDocs", evidence: ultraEvidence },
      { modelId: "rtmpose", model: "RTMPose 17-keypoint body models (MMPose)", sourceId: "rtmposeReadme", evidence: mdText(rtmEvidence) },
    ],
    notes,
    datasetInfo: coco.paper ? { dataset: coco.dataset, ...coco.paper } : null,
    platforms: null,
  });
  if (!/COCO Keypoints: Used in MoveNet and PoseNet/.test(readme.heading ?? "")) problems.push(`coco-17: TF.js README heading changed: ${readme.heading}`);
}

// ── 4. Halpe26 and COCO-WholeBody (MMPose, used by RTMPose) ────────────────
for (const [slug, id, short, name, evidenceRe] of [
  [
    "halpe-26",
    "mmposeHalpe26",
    "Halpe26",
    "Halpe26 keypoints",
    /#### 26 Keypoints - Keypoints are defined as \[Halpe26\]\([^)]+\)\. For details please refer to the \[meta info\]\(\/configs\/_base_\/datasets\/halpe26\.py\)\./,
  ],
  [
    "coco-wholebody-133",
    "mmposeWholebody",
    "COCO-WholeBody 133",
    "COCO-WholeBody 133 keypoints",
    /### WholeBody 2d \(133 Keypoints\) - Keypoints are defined as \[COCO-WholeBody\]\([^)]+\)\. For details please refer to the \[meta info\]\(\/configs\/_base_\/datasets\/coco_wholebody\.py\)\./,
  ],
]) {
  const ds = mmposeDataset(T[id], `mmpose ${slug}`);
  const cocoNames = coco.points.map((p) => p.name);
  const head = ds.points.slice(0, cocoNames.length).map((p) => p.name);
  const checks = [
    crossCheck(slug, ds.points.every((p, i) => p.index === i), "MMPose keypoint_info ids run 0 to N-1"),
    sameNames(head, cocoNames)
      ? `its first ${cocoNames.length} names are identical to MMPose's COCO 17, in the same order`
      : `its first ${cocoNames.length} names differ from MMPose's COCO 17 (${firstDiff(head, cocoNames)})`,
  ];
  schemes.push({
    slug,
    name,
    shortName: short,
    family: "MMPose",
    sourceId: id,
    nameSource: `keypoint_info in MMPose's configs/_base_/datasets/${SOURCES[id].path.split("/").pop()}`,
    indexed: true,
    points: ds.points.map((p, i) => ({ index: p.index, order: i, name: p.name, altNames: [], description: null, group: null, swap: p.swap, docUrl: null })),
    excluded: [],
    crossChecks: checks,
    checkSources: ["mmposeCoco"],
    usedBy: [
      {
        modelId: "rtmpose",
        model: slug === "halpe-26" ? "RTMPose 26-keypoint body models (MMPose)" : "RTMPose WholeBody 2d models (MMPose: RTMPose, RTMW and DWPose-distilled checkpoints)",
        sourceId: "rtmposeReadme",
        evidence: mdText(evidence(T.rtmposeReadme, evidenceRe, `rtmpose README ${slug}`)),
      },
    ],
    notes: [],
    datasetInfo: ds.paper ? { dataset: ds.dataset, ...ds.paper } : null,
    platforms: null,
  });
}

// ── 5. OpenPose BODY_25 and COCO 18 ────────────────────────────────────────
{
  const mappingList = /POSE_BODY_PART_MAPPING\{([\s\S]*?)\};/.exec(T.openposeParams)?.[1]?.match(/\w+/g) ?? [];
  const numbers = (/POSE_NUMBER_BODY_PARTS\{([\s\S]*?)\};/.exec(T.openposeParams)?.[1]?.match(/\d+/g) ?? []).map(Number);
  const backgroundComment = evidence(
    uncomment(T.openposeParams),
    "POSE_NUMBER_BODY_PARTS equivalent to size of std::map POSE_BODY_XX_BODY_PARTS - 1 (removing background)",
    "openpose background comment",
  );
  const docBody25 = [...T.openposeDoc.matchAll(/\/\/\s+\{(\d+),\s*"([^"]+)"\}/g)].map((m) => ({ index: Number(m[1]), name: m[2] }));
  const jsonNote = evidence(
    T.openposeDoc,
    /`pose_keypoints_2d`: Body part locations \(`x`, `y`\) and detection confidence \(`c`\) formatted as `x0,y0,c0,x1,y1,c1,\.\.\.`\./,
    "openpose pose_keypoints_2d",
  );
  const scaleNote = evidence(
    T.openposeDoc,
    /The coordinates `x` and `y` can be normalized to the range \[0,1\], \[-1,1\], \[0, source size\], \[0, output size\], etc\. \(see the flag `--keypoint_scale` for more information\), while the confidence score \(`c`\) in the range \[0,1\]\./,
    "openpose keypoint_scale",
  );
  for (const [slug, mapName, short, name, model, headingRe] of [
    ["openpose-body-25", "POSE_BODY_25_BODY_PARTS", "OpenPose BODY_25", "OpenPose BODY_25", "OpenPose BODY_25 model", /^###\s+Pose Output Format \(BODY_25\)/m],
    ["openpose-coco-18", "POSE_COCO_BODY_PARTS", "OpenPose COCO 18", "OpenPose COCO 18 (PoseModel::COCO_18)", "OpenPose COCO model (PoseModel::COCO_18)", /^###\s+Pose Output Format \(COCO\)/m],
  ]) {
    const all = cppBodyParts(T.openposeParams, mapName, `openpose ${slug}`);
    const parts = all.filter((p) => p.name !== "Background");
    const background = all.filter((p) => p.name === "Background");
    const declared = numbers[mappingList.indexOf(mapName)];
    const checks = [
      crossCheck(slug, parts.every((p, i) => p.index === i), "the map's keys run 0 to N-1"),
      crossCheck(
        slug,
        background.length === 1 && background[0].index === parts.length,
        `the map ends with {${parts.length}, "Background"}, which the source excludes from the body-part count`,
      ),
      crossCheck(slug, declared === parts.length, `POSE_NUMBER_BODY_PARTS gives ${mapName} ${declared} body parts`, `${declared} vs ${parts.length}`),
    ];
    if (slug === "openpose-body-25") {
      checks.push(
        crossCheck(
          slug,
          sameNames(parts.map((p) => p.name), docBody25.filter((p) => p.name !== "Background").map((p) => p.name)),
          "doc/02_output.md prints the same BODY_25 list",
          firstDiff(parts.map((p) => p.name), docBody25.map((p) => p.name)),
        ),
      );
    }
    const heading = headingRe.exec(T.openposeDoc)?.[0]?.replace(/^#+\s*/, "") ?? null;
    if (!heading) problems.push(`${slug}: doc heading ${headingRe} not found`);
    schemes.push({
      slug,
      name,
      shortName: short,
      family: "OpenPose",
      sourceId: "openposeParams",
      nameSource: `${mapName} in OpenPose's src/openpose/pose/poseParameters.cpp`,
      indexed: true,
      points: parts.map((p, i) => ({ index: p.index, order: i, name: p.name, altNames: [], description: null, group: null, swap: null, docUrl: null })),
      excluded: background.map((b) => ({ index: b.index, name: b.name, sourceId: "openposeParams", reason: backgroundComment })),
      crossChecks: checks,
      checkSources: slug === "openpose-body-25" ? ["openposeDoc"] : [],
      usedBy: [{ modelId: "openpose", model, sourceId: "openposeDoc", evidence: heading }],
      notes: [
        { sourceId: "openposeDoc", text: jsonNote },
        { sourceId: "openposeDoc", text: scaleNote },
      ].filter((n) => n.text),
      datasetInfo: null,
      platforms: null,
    });
  }
}

// ── 6. Apple Vision 2D and 3D ──────────────────────────────────────────────
for (const [slug, jointsId, requestId, typeTitle, short, name, model] of [
  ["apple-vision-2d", "appleJoints2d", "appleRequest2d", "VNHumanBodyPoseObservation.JointName", "Apple Vision 2D", "Apple Vision 2D body pose joints", "Apple Vision VNDetectHumanBodyPoseRequest"],
  ["apple-vision-3d", "appleJoints3d", "appleRequest3d", "VNHumanBodyPose3DObservation.JointName", "Apple Vision 3D", "Apple Vision 3D body pose joints", "Apple Vision VNDetectHumanBodyPose3DRequest"],
]) {
  const doc = J[jointsId];
  if (doc.metadata?.title !== typeTitle) problems.push(`${slug}: page title is ${doc.metadata?.title}, expected ${typeTitle}`);
  const joints = appleJoints(doc, typeTitle, slug);
  const overview = appleOverview(J[requestId]);
  const observation = typeTitle.split(".")[0];
  if (!overview?.includes(observation)) problems.push(`${slug}: the request's overview does not name ${observation}: ${overview}`);
  const notes = [{ sourceId: jointsId, text: `${typeTitle}: ${appleAbstract(doc)}` }];
  if (slug === "apple-vision-3d") {
    notes.push({ sourceId: requestId, text: overview });
    for (const t of ["pointInImage(_:)", "cameraRelativePosition(_:)", "bodyHeight", "cameraOriginMatrix"]) {
      const a = appleTopicAbstract(J.appleObservation3d, t, slug);
      if (a) notes.push({ sourceId: "appleObservation3d", text: `${t}: ${a}` });
    }
  }
  schemes.push({
    slug,
    name,
    shortName: short,
    family: "Apple Vision",
    sourceId: jointsId,
    nameSource: `the static joint-name constants of ${typeTitle}`,
    indexed: false,
    points: joints.map((j, i) => ({ index: null, order: i, name: j.name, altNames: [], description: j.description, group: j.group, swap: null, docUrl: j.docUrl })),
    excluded: [],
    crossChecks: [
      crossCheck(slug, joints.every((j) => !j.deprecated), "no joint constant is marked deprecated"),
      `Apple files the constants under ${new Set(joints.map((j) => j.group)).size} topic groups: ${[...new Set(joints.map((j) => j.group))].join(", ")}`,
    ],
    checkSources: [],
    usedBy: [{ modelId: slug, model, sourceId: requestId, evidence: overview?.split(/(?<=\.)\s+/)[0] ?? null }],
    notes,
    datasetInfo: null,
    platforms: applePlatforms(doc),
  });
}

// ── Counts, uniqueness and the crosswalk ───────────────────────────────────
const ORDER = Object.keys(EXPECTED);
schemes.sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
for (const s of schemes) {
  if (s.points.length !== EXPECTED[s.slug]) problems.push(`${s.slug}: ${s.points.length} points parsed, expected exactly ${EXPECTED[s.slug]}`);
  const keys = s.points.map((p) => keyOf(p.name));
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length) problems.push(`${s.slug}: two points normalise to the same key (${dup.join(", ")}) — the crosswalk rule cannot place them`);
  for (const p of s.points) {
    p.key = keyOf(p.name);
    for (const a of p.altNames) if (keyOf(a.name) !== p.key) problems.push(`${s.slug}: alternate spelling ${a.name} does not normalise to ${p.key}`);
  }
  if (!s.usedBy.length || s.usedBy.some((u) => !u.evidence)) problems.push(`${s.slug}: a "used by" claim has no evidence text`);
}
if (schemes.length !== ORDER.length) problems.push(`${schemes.length} schemes built, expected ${ORDER.length}`);

const byKey = new Map();
for (const s of schemes) for (const p of s.points) (byKey.get(p.key) ?? byKey.set(p.key, []).get(p.key)).push({ scheme: s.slug, index: p.index, name: p.name });
for (const s of schemes) for (const p of s.points) p.sharedWith = byKey.get(p.key).filter((c) => c.scheme !== s.slug).map((c) => c.scheme);

/** Row label: the first spelling found in this order of schemes. */
const LABEL_ORDER = ["coco-17", "halpe-26", "coco-wholebody-133", "blazepose-33", "ml-kit", "apple-vision-2d", "apple-vision-3d", "openpose-body-25", "openpose-coco-18"];
const crosswalk = [];
for (const s of schemes) {
  for (const p of s.points) {
    if (crosswalk.some((r) => r.key === p.key)) continue;
    const cells = byKey.get(p.key);
    if (cells.length < 2) continue;
    let label = null;
    for (const slug of LABEL_ORDER) {
      const sc = schemes.find((x) => x.slug === slug);
      const pt = sc?.points.find((x) => x.key === p.key);
      if (pt) {
        label = pt.altNames.find((a) => a.sourceId === "tfjsConstants")?.name ?? pt.name;
        break;
      }
    }
    crosswalk.push({ key: p.key, label, cells: ORDER.flatMap((slug) => cells.filter((c) => c.scheme === slug)) });
  }
}

const fetchedDates = Object.keys(SOURCES).map((id) => meta[id]?.fetchedOn).filter(Boolean);
const fetchedOn = fetchedDates.sort().at(-1) ?? new Date().toISOString().slice(0, 10);
for (const id of Object.keys(SOURCES)) if (!meta[id]?.sha256) problems.push(`${id}: no fetch record in ${META}`);

if (problems.length) {
  console.error("REFUSING TO WRITE — a source's shape may have changed, or two sources disagree:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const sources = Object.entries(SOURCES).map(([id, s]) => ({
  id,
  title: s.title,
  url: s.url,
  page: s.page,
  repo: s.repo,
  branch: s.branch,
  path: s.path,
  fetchedOn: meta[id].fetchedOn,
  sha256: meta[id].sha256,
  sourceUpdated: s.kind === "devsite" ? googleLastUpdated(T[id]) : null,
}));

const body = `/**
 * Pose-estimation keypoint schemes — every index and name, as each model's own
 * source spells it — and the name-identity crosswalk between them.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-keypoints.mjs
 *
 * Sources (GitHub files on the branch shown; sha256 is of the bytes read):
${sources.map((s) => ` *   ${s.page}${s.branch ? ` (branch ${s.branch})` : ""}`).join("\n")}
 * Fetched: ${fetchedOn}
 *
 * Names are copied exactly. \`key\` is the one derived field: the name
 * lowercased with every character outside a-z0-9 removed. A crosswalk row
 * joins points whose keys are identical and nothing else; a point whose key
 * no other scheme shares has an empty \`sharedWith\` and no row. Each "used
 * by" claim carries the source text it was read from in \`evidence\`.
 */

/** The date the generator last read its sources (the latest fetch date). */
export const POSE_KEYPOINTS_FETCHED_ON = ${JSON.stringify(fetchedOn)};

export type PoseSource = {
  id: string;
  title: string;
  /** The URL the generator read (raw file, docs JSON, or ?hl=en page). */
  url: string;
  /** The human-readable page for the same file. */
  page: string;
  repo: string | null;
  branch: string | null;
  path: string | null;
  fetchedOn: string;
  /** SHA-256 of the bytes as served. */
  sha256: string;
  /** Google's "Last updated" footer stamp, for developers.google.com pages. */
  sourceUpdated: string | null;
};

/** Every source file read, in the order the generator lists them. */
export const POSE_SOURCES: PoseSource[] = ${JSON.stringify(sources, null, 2)};

export type PosePoint = {
  /** The integer index the source assigns; null for Apple's named constants. */
  index: number | null;
  /** Position in the source's own listing. */
  order: number;
  /** Exactly as the source spells it. */
  name: string;
  /** Spellings of the same index in the cross-checked sources, where they differ. */
  altNames: { sourceId: string; name: string }[];
  /** The source's own description, verbatim (ML Kit, Apple); null elsewhere. */
  description: string | null;
  /** Apple's topic group; null elsewhere. */
  group: string | null;
  /** MMPose's \`swap\` field, verbatim; null elsewhere or where it is empty. */
  swap: string | null;
  docUrl: string | null;
  /** DERIVED: name lowercased, characters outside a-z0-9 removed. */
  key: string;
  /** Other schemes with a point of the same key. */
  sharedWith: string[];
};

export type PoseScheme = {
  slug: string;
  name: string;
  shortName: string;
  family: string;
  /** The source the names and indices are copied from. */
  sourceId: string;
  nameSource: string;
  /** false for Apple Vision: joint names are constants with no numeric index. */
  indexed: boolean;
  points: PosePoint[];
  /** Entries the source lists that are not keypoints, and the source's reason. */
  excluded: { index: number; name: string; sourceId: string; reason: string | null }[];
  /** What was checked against the other sources (every check passed). */
  crossChecks: string[];
  /** The sources those checks read. */
  checkSources: string[];
  /** Models documented as producing this scheme, each with the source text that says so. */
  usedBy: { modelId: string; model: string; sourceId: string; evidence: string }[];
  /** Code-facing statements copied from the sources (whitespace collapsed). */
  notes: { sourceId: string; text: string }[];
  /** The dataset paper MMPose's meta info cites; null elsewhere. */
  datasetInfo: { dataset: string | null; title: string | null; year: string | null; homepage: string | null } | null;
  /** Apple's availability for the joint-name type; null elsewhere. */
  platforms: { name: string; introducedAt: string | null }[] | null;
  sourceUpdated?: string | null;
};

/** Every scheme, in a fixed order. */
export const POSE_SCHEMES: PoseScheme[] = ${JSON.stringify(schemes, null, 2)};

export type PoseCrosswalkRow = {
  /** The shared key (name lowercased, separators removed). */
  key: string;
  /** Display label: the first spelling found in a fixed order of schemes. */
  label: string;
  /** One cell per scheme that has a point with this key. */
  cells: { scheme: string; index: number | null; name: string }[];
};

/** Keys shared by at least two schemes. */
export const POSE_CROSSWALK: PoseCrosswalkRow[] = ${JSON.stringify(crosswalk, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${schemes.length} schemes, ${schemes.reduce((n, s) => n + s.points.length, 0)} points, ${crosswalk.length} crosswalk rows`);
for (const s of schemes) {
  const mapped = s.points.filter((p) => p.sharedWith.length).length;
  console.log(`  ${s.slug.padEnd(20)} ${String(s.points.length).padStart(3)} points, ${mapped} mapped, ${s.points.length - mapped} unmapped`);
}
console.log("read:");
for (const s of sources) console.log(`  ${s.fetchedOn} ${s.url}`);
