export type SamplePlatform = "healthkit" | "health-connect" | "google-health-api";

export type SampleField = { name: string; type: string; note: string | null };

/** The keys every spec has; platform-specific extras ride along untyped. */
export type SampleSpecCore = {
  platform: SamplePlatform;
  metric: string;
  label: string;
  /** The platform's own type name: HK identifier constant, HC record class, Google data type id. */
  typeName: string;
  typeLabel: string;
  shape: "interval" | "sample" | "session" | "daily";
  tabular: boolean;
  docUrl: string | null;
  snippet: string;
};

export type SampleSpec = SampleSpecCore & {
  fields: SampleField[];
  omitted: { name: string; reason: string }[];
  [k: string]: unknown;
};

export type SampleSources = Record<string, { fetchedOn: string; [k: string]: unknown }>;

export const SAMPLE_DATA_NOTICE: string;
export const MAX_DAYS: number;
export const METRICS: { metric: string; label: string }[];

export function parseRange(text: string | null): { min: number; max: number } | null;
export function buildSampleSpecs(data: Record<string, unknown>): { specs: SampleSpec[]; sources: SampleSources };

export function rng(seed: string, stream: string): { rand: () => number; int: (lo: number, hi: number) => number; range: (lo: number, hi: number) => number };
export function offsetMinutes(ms: number, timeZone: string): number;
export function zonedToUtc(y: number, mo: number, d: number, h: number, mi: number, timeZone: string): number;
export function isoOffset(min: number): string;
export function durationOffset(min: number): string;
export function civilDays(start: string, end: string): { y: number; mo: number; d: number; date: string }[];
export function offsetTransitions(start: string, end: string, timeZone: string): { at: string; from: string; to: string }[];

export type SampleRecords = Record<string, unknown[] | { dataPoints: unknown[] }>;

export type SampleOutput = {
  _synthetic: {
    notice: string;
    generator: string;
    platform: SamplePlatform;
    seed: string;
    timeZone: string;
    range: { start: string; end: string };
    offsets: boolean;
    offsetTransitions: { at: string; from: string; to: string }[];
    counts: Record<string, number>;
    encoding: string;
  };
  records: SampleRecords;
};

export function generateSampleData(opts: {
  specs: SampleSpec[];
  platform: SamplePlatform;
  metrics: string[];
  start: string;
  end: string;
  timeZone: string;
  seed: string;
  offsets?: boolean;
}): SampleOutput;

export function toCsv(records: unknown[] | { dataPoints: unknown[] }): string;
