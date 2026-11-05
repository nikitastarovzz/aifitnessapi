/** Types for rateLimitCalc.mjs (the limits and arithmetic behind /tools/rate-limit-calculator). */

export type LimitSource = { url: string; quote: string; ev: string };

export type Limit = {
  label: string;
  max: number;
  /** Added per registered user (Polar's dynamic limit). */
  perUser?: number;
  /** Window length in seconds. */
  window: number;
  scope: "app" | "user" | "unstated";
  /** "days": the limit counts requested days of data, not requests (Terra). */
  unit?: "days";
  src: LimitSource;
};

export type Tier = { id: string; label: string; limits: Limit[] };

export type RateLimitVendor = {
  id: string;
  name: string;
  guide: string;
  tiers: Tier[];
  scopeNote?: { text: string; src: LimitSource };
  unlimited?: { text: string; src: LimitSource };
  maxDaysPerRequest?: { days: number; src: LimitSource };
  mitigations: { text: string; src: LimitSource }[];
};

export type NotDocumented = { id: string; name: string; guide: string; reason: string; src?: LimitSource };

export type CalcInputs = {
  users: number;
  syncsPerDay: number;
  endpointsPerSync: number;
  timing: "spread" | "aligned";
  daysPerRequest: number;
};

export type LimitRow = { limit: Limit; capacity: number; demand: number; utilization: number; maxUsers: number };
export type TierResult = { rows: LimitRow[]; binding: LimitRow; over: boolean };
export type VendorResult = TierResult & { vendor: RateLimitVendor; tier: Tier; warnings: "span"[] };

export const DAY: number;
export const RATE_LIMIT_VENDORS: RateLimitVendor[];
export const NOT_DOCUMENTED: NotDocumented[];
export const DEFAULT_INPUTS: CalcInputs;
export const BOUNDS: Record<"users" | "syncsPerDay" | "endpointsPerSync" | "daysPerRequest", [number, number]>;

export function parsePublishedLimit(text: string): { max: number; window: number };
export function capacity(limit: Limit, users: number): number;
export function perSync(limit: Limit, inputs: CalcInputs): number;
export function syncsInWindow(limit: Limit, inputs: CalcInputs): number;
export function worstSyncsInWindow(limit: Limit, inputs: CalcInputs): number;
export function demand(limit: Limit, inputs: CalcInputs): number;
export function maxUsers(limit: Limit, inputs: CalcInputs): number;
export function evaluateTier(tier: Tier, inputs: CalcInputs): TierResult;
export function pickTier(vendor: RateLimitVendor, tiers?: Record<string, string>): Tier | null;
export function evaluateAll(vendors: RateLimitVendor[], inputs: CalcInputs, tiers?: Record<string, string>): VendorResult[];
export function totals(inputs: CalcInputs): { perDay: number; perMinuteAverage: number; perMinutePeak: number };
export function windowLabel(seconds: number): string;
export function parseCalcState(search: string, vendors: RateLimitVendor[]): { inputs: CalcInputs; tiers: Record<string, string> };
export function calcStateToSearch(state: { inputs: CalcInputs; tiers: Record<string, string> }): string;
