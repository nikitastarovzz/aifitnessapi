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
 *    (mediapipe-samples, examples/pose_landmarker/android/app/download_tasks.gradle)
 *    downloads all three from that same path, and each answered HTTP 200 with
 *    `access-control-allow-origin: *` and the byte size recorded below.
 *
 * MoveNet is not here. @tensorflow-models/pose-detection 2.1.3 (the latest
 * release on the npm registry) loads its MoveNet weights from tfhub.dev by
 * default (the package's own constants, and the README's `modelUrl` option),
 * and tfhub.dev could not be reached to verify on VERIFIED_ON. TensorFlow's
 * hosted demo loads the same tfhub.dev URLs. No other weight URL is
 * documented, so the model is left out rather than pointed at a guessed one.
 */

export const VERIFIED_ON = "2026-10-31";

export const TASKS_VISION_VERSION = "1.1.1";
export const TASKS_VISION_BUNDLE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/vision_bundle.mjs`;
export const TASKS_VISION_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

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
