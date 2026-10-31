export type StepParams = { threshold: number; minIntervalMs: number; cutoffHz: number; baselineSeconds: number };
export type Sample = { t: number; m: number };
export type Step = { t: number; value: number; index: number };
export type Processed = { t: number; raw: number; filtered: number; baseline: number; step: Step | null };

export const DEFAULT_PARAMS: Readonly<StepParams>;
export const THRESHOLD_RANGE: Readonly<{ min: number; max: number; step: number }>;
export const INTERVAL_RANGE: Readonly<{ min: number; max: number; step: number }>;
export const G: number;
export const REPLAY_TRUE_STEPS: number;
export const REPLAY_LABEL: string;

export function magnitude(x: number, y: number, z: number): number;
export function createStepDetector(params?: Partial<StepParams>): {
  push: (t: number, m: number) => Processed;
  readonly count: number;
  params: StepParams;
};
export function detectSteps(
  samples: Sample[],
  params?: Partial<StepParams>,
): { filtered: number[]; baseline: number[]; steps: Step[]; count: number; params: StepParams };
export function seeded(seed: number): () => number;
export function synthesize(opts: {
  durationMs: number;
  rateHz?: number;
  events?: (
    | { kind: "step"; at: number; amp: number; widthMs?: number }
    | { kind: "jitter"; at: number; until: number; amp: number; hz: number }
  )[];
  noise?: number;
  seed?: number;
}): Sample[];
export function walkEvents(opts: {
  steps: number;
  startMs?: number;
  cadenceHz?: number;
  amp?: number;
  seed?: number;
}): { kind: "step"; at: number; amp: number }[];
export function replayTrace(): Sample[];
export function shareText(opts: {
  mode: "live" | "replay";
  walked: number;
  counted: number;
  threshold: number;
  minIntervalMs: number;
  url: string;
}): string;
