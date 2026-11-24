/**
 * Loading the two in-browser pose runtimes, shared by the tools that run
 * them: the benchmark and the arena on /tools/pose-benchmark.
 *
 * Every URL and version comes from src/lib/poseBenchmark.ts, where each was
 * checked; this module only loads them. Both loaders cache at module level,
 * so the benchmark and the arena on the same page download each runtime once.
 * Call these from the browser only (they touch window and document).
 */
import { TASKS_VISION_BUNDLE, TASKS_VISION_WASM, TFJS_SCRIPTS, TFJS_WASM_PATH } from "@/lib/poseBenchmark";

export type Delegate = "GPU" | "CPU";
export type PoseFrame = HTMLVideoElement | HTMLCanvasElement;

/* The subset of @mediapipe/tasks-vision these pages call. Typed by hand from
 * the package's vision.d.ts so the site does not depend on the package. */
export type MpLandmark = { x: number; y: number; z: number; visibility?: number };
export type PoseResult = { landmarks: MpLandmark[][] };
export type Landmarker = {
  detectForVideo(frame: PoseFrame, timestamp: number): PoseResult;
  close(): void;
};
export type VisionModule = {
  FilesetResolver: { forVisionTasks(basePath: string): Promise<unknown> };
  PoseLandmarker: {
    createFromOptions(
      fileset: unknown,
      options: {
        baseOptions: { modelAssetPath: string; delegate: Delegate };
        runningMode: "VIDEO";
        numPoses: number;
      },
    ): Promise<Landmarker>;
  };
};
export type Vision = { mod: VisionModule; fileset: unknown };

/* The subset of TensorFlow.js and pose-detection 2.1.3 these pages call, on
 * the globals their UMD bundles define (window.tf, window.poseDetection).
 * Typed by hand from the packages' .d.ts files for the same reason. */
export type TfGlobal = {
  setBackend(name: string): Promise<boolean>;
  ready(): Promise<void>;
  getBackend(): string;
  wasm?: { setWasmPaths(prefix: string): void };
};
export type MnKeypoint = { x: number; y: number; score?: number; name?: string };
export type PoseDetector = {
  estimatePoses(image: PoseFrame, config?: object, timestamp?: number): Promise<{ keypoints: MnKeypoint[]; score?: number }[]>;
  dispose(): void;
};
export type PoseDetectionGlobal = {
  SupportedModels: { MoveNet: string };
  createDetector(model: string, config: { modelType: string; modelUrl: string }): Promise<PoseDetector>;
};
type TfWindow = Window & { tf?: TfGlobal; poseDetection?: PoseDetectionGlobal };
export type TfLib = { tf: TfGlobal; pd: PoseDetectionGlobal };

/** Add a classic <script> once and wait for it; rejects on a network error. */
export function loadScript(src: string): Promise<void> {
  const prior = document.querySelector<HTMLScriptElement>(`script[data-bench-src="${src}"]`);
  if (prior?.dataset.loaded === "1") return Promise.resolve();
  prior?.remove();
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.crossOrigin = "anonymous";
    el.dataset.benchSrc = src;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`could not load ${new URL(src).pathname.split("/").slice(1, 3).join("/")}`));
    document.head.appendChild(el);
  });
}

let vision: Vision | null = null;

/** The MediaPipe Tasks runtime, imported from the pinned CDN URL. */
export async function loadVision(): Promise<Vision> {
  if (vision) return vision;
  const url = TASKS_VISION_BUNDLE;
  // A runtime URL, so neither bundler tries to resolve or inline it.
  const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as VisionModule;
  const fileset = await mod.FilesetResolver.forVisionTasks(TASKS_VISION_WASM);
  vision = { mod, fileset };
  return vision;
}

let tfLib: (TfLib & { wasm: boolean }) | null = null;

/** TF.js core, converter and the WebGL backend, then pose-detection; the
 *  WASM backend only when asked for. */
export async function loadTf(needWasm: boolean): Promise<TfLib> {
  if (!tfLib) {
    await loadScript(TFJS_SCRIPTS.core);
    await loadScript(TFJS_SCRIPTS.converter);
    await loadScript(TFJS_SCRIPTS.webgl);
    await loadScript(TFJS_SCRIPTS.poseDetection);
    const w = window as TfWindow;
    if (!w.tf || !w.poseDetection) throw new Error("the TensorFlow.js scripts loaded but defined no tf / poseDetection global");
    tfLib = { tf: w.tf, pd: w.poseDetection, wasm: false };
  }
  if (needWasm && !tfLib.wasm) {
    await loadScript(TFJS_SCRIPTS.wasm);
    const tf = (window as TfWindow).tf!;
    if (!tf.wasm) throw new Error("the TF.js WASM backend script defined no tf.wasm");
    tf.wasm.setWasmPaths(TFJS_WASM_PATH);
    tfLib = { ...tfLib, tf, wasm: true };
  }
  return tfLib;
}
