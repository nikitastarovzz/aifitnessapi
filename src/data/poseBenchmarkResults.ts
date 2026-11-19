/**
 * Crowdsourced pose benchmark results (MediaPipe Pose Landmarker and MoveNet), one entry per accepted
 * GitHub issue in nikitastarovzz/aifitnessapi (title prefix "[pose-benchmark]", label
 * "pose-benchmark:accepted").
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
  /** @mediapipe/tasks-vision version. */
  runtime: string;
  /** TensorFlow.js and pose-detection versions; null when the run has no MoveNet row. */
  tfjs: { tfjs: string; poseDetection: string } | null;
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
    /** Rows submitted before families existed are MediaPipe and read as such. */
    family: "mediapipe" | "movenet";
    /** For MoveNet rows, GPU is the TF.js webgl backend and CPU the wasm backend. */
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
export const POSE_BENCHMARK_RESULTS_IMPORTED_ON: string | null = null;

export const POSE_BENCHMARK_RESULTS: PoseBenchmarkSubmission[] = [];
