/**
 * Crowdsourced Pose Landmarker benchmark results, one entry per accepted
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
export const POSE_BENCHMARK_RESULTS_IMPORTED_ON: string | null = null;

export const POSE_BENCHMARK_RESULTS: PoseBenchmarkSubmission[] = [];
