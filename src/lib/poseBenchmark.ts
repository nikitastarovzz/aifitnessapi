/**
 * What the in-browser pose benchmark loads, and from where.
 *
 * One module so the page's prose and the client component name the same
 * version and the same URLs. Every value below was checked on VERIFIED_ON:
 *
 *  - the package version against https://registry.npmjs.org/@mediapipe/tasks-vision
 *    (a stable release, not an -rc nightly; 1.1.1 was published 2026-10-14);
 *  - the runtime path against that version's tarball: the package ships
 *    `vision_bundle.mjs` and a `wasm/` directory, which is what
 *    FilesetResolver.forVisionTasks() is pointed at in the package README;
 *  - the three model URLs against Google's own sources: the package README
 *    gives the lite URL on the `float16/1/` path, Google's Android sample
 *    (mediapipe-samples, examples/pose_landmarker/android/app/download_tasks.gradle;
 *    since 2026-11-11 download_tasks.gradle.kts, read 2026-11-14 with the same URLs)
 *    downloads all three from that same path, and each answered HTTP 200 with
 *    `access-control-allow-origin: *` and the byte size recorded below.
 *
 * MoveNet (added 2026-11-19, MOVENET_VERIFIED_ON) runs through TensorFlow.js
 * and @tensorflow-models/pose-detection, loaded as pinned UMD scripts from
 * the same CDN, only when the reader ticks a MoveNet row; see MOVENET_MODELS.
 */

export const VERIFIED_ON = "2026-10-31";

export const TASKS_VISION_VERSION = "1.1.1";
export const TASKS_VISION_BUNDLE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/vision_bundle.mjs`;
export const TASKS_VISION_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

/**
 * The runtime reports its own usage to Google. Read in the 1.1.1 tarball's
 * vision_bundle.mjs on 2026-10-31 and seen in a Playwright run of
 * /tools/pose-benchmark and /challenge the same day: every task creates a
 * logger that POSTs a protobuf to this URL about once a minute and when the
 * task closes. In that code the report is built from the task name
 * ("PoseLandmarker"), the running mode, an operating-system family parsed
 * from the user agent, the library version string and timing counters
 * (initialisation time, frames processed, total and maximum latency, dropped
 * frames); no image, video or landmark value is passed to it. The package's
 * public options expose no way to turn it off. Pages that say what is sent
 * cite this, rather than "nothing is uploaded".
 */
export const TASKS_VISION_USAGE_LOG_URL = "https://odml.pa.googleapis.com/v1/log";

export type BenchModel = {
  id: "lite" | "full" | "heavy";
  name: string;
  url: string;
  /** Content-Length of the .task file as served on VERIFIED_ON. */
  bytes: number;
};

const MODEL_BASE = "https://storage.googleapis.com/mediapipe-models/pose_landmarker";

export const BENCH_MODELS: BenchModel[] = [
  {
    id: "lite",
    name: "Pose Landmarker lite",
    url: `${MODEL_BASE}/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
    bytes: 5777746,
  },
  {
    id: "full",
    name: "Pose Landmarker full",
    url: `${MODEL_BASE}/pose_landmarker_full/float16/1/pose_landmarker_full.task`,
    bytes: 9398198,
  },
  {
    id: "heavy",
    name: "Pose Landmarker heavy",
    url: `${MODEL_BASE}/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task`,
    bytes: 30664242,
  },
];

/** "5.5 MiB" — the size a reader will see in their network panel. */
export function mib(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MiB`;
}

/* ── MoveNet, through TensorFlow.js ─────────────────────────────────────── */

/**
 * Checked on MOVENET_VERIFIED_ON:
 *
 *  - versions against the npm registry: @tensorflow-models/pose-detection
 *    2.1.3 is its `latest` dist-tag (published 2023-08-29) and declares
 *    peer dependencies @tensorflow/tfjs-core, -converter, -backend-webgl and
 *    -backend-wasm `^4.10.0`; 4.22.0 is the `latest` of each of those
 *    (published 2024-10-21);
 *  - script paths against those versions' tarballs from the registry: each
 *    ships the dist/*.min.js named below as its `unpkg`/`jsdelivr` entry, and
 *    tfjs-backend-wasm ships its .wasm binaries in dist/, which is what
 *    setWasmPaths() is pointed at;
 *  - the weight URLs against TensorFlow's own source:
 *    https://raw.githubusercontent.com/tensorflow/tfjs-models/master/pose-detection/src/movenet/constants.ts
 *    declares MOVENET_SINGLEPOSE_LIGHTNING_URL =
 *    'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4' and
 *    MOVENET_SINGLEPOSE_THUNDER_URL = '.../singlepose/thunder/4', the same
 *    strings are in the 2.1.3 dist bundle, and the package's MoveNet README
 *    (pose-detection/src/movenet/README.md) says that without `modelUrl` "it
 *    will load the model specified by modelType from tf.hub". The page passes
 *    these URLs as `modelUrl` so the address it times is the one written here.
 *
 * NOT verified on MOVENET_VERIFIED_ON: that tfhub.dev still serves those
 * weights. tfhub.dev (and cdn.jsdelivr.net) were refused by the development
 * environment's network policy that day, so the page was exercised with the
 * CDN scripts served from the registry tarballs and could not download the
 * weights; the component reports that failure as a row, never a number.
 */
export const MOVENET_VERIFIED_ON = "2026-11-19";

export const TFJS_VERSION = "4.22.0";
export const POSE_DETECTION_VERSION = "2.1.3";

const JSD = "https://cdn.jsdelivr.net/npm";
/** Loaded in this order: core, then what registers on it, then the detector. */
export const TFJS_SCRIPTS = {
  core: `${JSD}/@tensorflow/tfjs-core@${TFJS_VERSION}/dist/tf-core.min.js`,
  converter: `${JSD}/@tensorflow/tfjs-converter@${TFJS_VERSION}/dist/tf-converter.min.js`,
  webgl: `${JSD}/@tensorflow/tfjs-backend-webgl@${TFJS_VERSION}/dist/tf-backend-webgl.min.js`,
  wasm: `${JSD}/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/tf-backend-wasm.min.js`,
  poseDetection: `${JSD}/@tensorflow-models/pose-detection@${POSE_DETECTION_VERSION}/dist/pose-detection.min.js`,
} as const;
/** Where the WASM backend fetches its .wasm binaries (setWasmPaths prefix). */
export const TFJS_WASM_PATH = `${JSD}/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/`;

/**
 * The delegate the reader ticks, mapped to the TF.js backend closest to it:
 * MediaPipe's GPU delegate runs on WebGL, and its CPU delegate runs in
 * WebAssembly, so GPU → webgl and CPU → wasm.
 */
export const TFJS_BACKEND = { GPU: "webgl", CPU: "wasm" } as const;

export type MoveNetModel = {
  id: "lightning" | "thunder";
  name: string;
  /** poseDetection.movenet.modelType value, as the 2.1.3 bundle defines it. */
  modelType: "SinglePose.Lightning" | "SinglePose.Thunder";
  url: string;
  /** Input resolution, MOVENET_SINGLEPOSE_*_RESOLUTION in constants.ts. */
  input: number;
};

export const MOVENET_MODELS: MoveNetModel[] = [
  {
    id: "lightning",
    name: "MoveNet SinglePose Lightning",
    modelType: "SinglePose.Lightning",
    url: "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4",
    input: 192,
  },
  {
    id: "thunder",
    name: "MoveNet SinglePose Thunder",
    modelType: "SinglePose.Thunder",
    url: "https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4",
    input: 256,
  },
];
