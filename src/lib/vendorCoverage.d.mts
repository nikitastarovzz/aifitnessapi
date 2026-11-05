/** Types for vendorCoverage.mjs (the data and filters behind /tools/api-coverage-matrix). */

/** The vendor's words, where they are published, and the evidence file that holds them. */
/** `table`: the quote is a row of a generated table (Google's data-types table), shown as data rather than as a sentence. */
export type CoverageSource = { url: string; quote: string; ev: string; table?: boolean };

export type CoverageMetricId =
  | "heart-rate"
  | "hrv"
  | "sleep"
  | "steps"
  | "workouts"
  | "gps-route"
  | "spo2"
  | "respiration"
  | "temperature"
  | "body"
  | "vo2max"
  | "glucose"
  | "stress";

export type CoverageMetric = { id: CoverageMetricId; label: string; matrix: string | null };

export type CoverageCell = { note: string; res?: string; src: CoverageSource };

export type DeliveryMode = "webhook" | "push" | "pull" | "on-device";

export type CoverageVendor = {
  id: string;
  name: string;
  guide: string;
  kind: "cloud" | "aggregator" | "on-device";
  cells: Partial<Record<CoverageMetricId, CoverageCell>>;
  no: Partial<Record<CoverageMetricId, CoverageCell>>;
  delivery: { mode: DeliveryMode; note: string; src: CoverageSource }[];
  history: { note: string; src: CoverageSource }[];
  resolution?: { note: string; src: CoverageSource }[];
};

export type CoverageState = { q: string; metrics: string[]; vendors: string[]; push: boolean };

export const COVERAGE_METRICS: CoverageMetric[];
export const DELIVERY_LABELS: Record<DeliveryMode, string>;
export const KIND_LABELS: Record<CoverageVendor["kind"], string>;
export const COVERAGE_VENDORS: CoverageVendor[];

export function cellState(
  vendor: CoverageVendor,
  metricId: string,
): { state: "yes" | "no" | "unknown"; cell: CoverageCell | null };
export function pushes(vendor: CoverageVendor): boolean;
export function filterVendors(vendors: CoverageVendor[], state: Partial<CoverageState>, metrics?: CoverageMetric[]): CoverageVendor[];
export function visibleMetrics(state: Partial<CoverageState>, metrics?: CoverageMetric[]): CoverageMetric[];
export function parseCoverageState(search: string, vendorIds: string[], metricIds?: string[]): CoverageState;
export function coverageStateToSearch(state: Partial<CoverageState>): string;
