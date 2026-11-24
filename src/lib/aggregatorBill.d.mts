/** Types for aggregatorBill.mjs (the bill calculator on /tools/aggregator-chooser). */

export type BillSource = { url: string; quote: string; ev: string };
export type Price = { value: number; as: string; src: BillSource };
export type Billing = "annual" | "monthly";
export type BillInputs = { users: number; sources: number; months: number; billing: Billing };

export type BillOption = {
  plan: string;
  monthly: number;
  lines: string[];
  uses: Price[];
  conditional?: string;
  conditionalSrc?: BillSource;
};
export type BillNote = { text: string; src: BillSource };

export type BillVendor = {
  id: string;
  name: string;
  currency: "USD" | "EUR";
  page: { href: string; label: string } | null;
  unit: string;
  periods: Billing[];
  compute(i: BillInputs): Computed | NotComputable;
};

type Computed = { computable: true; options: BillOption[]; notes: BillNote[] };
type NotComputable = { computable: false; reason: string; sources: BillSource[] };

export type BillResult =
  | ({ vendor: BillVendor } & Computed & { pick: BillOption; monthly: number; annual: number; total: number })
  | ({ vendor: BillVendor } & NotComputable);

export const PRICES: Record<string, Price>;
export const BILL_SOURCES: Record<string, BillSource>;
export const BILL_VENDORS: BillVendor[];
export const BOUNDS: { users: [number, number]; sources: [number, number]; months: [number, number] };
export const DEFAULT_INPUTS: BillInputs;
export function readStated(as: string): number;
export function clampInputs(i: Partial<Record<keyof BillInputs, unknown>>): BillInputs;
export function billAll(i: BillInputs): BillResult[];
export function parseBillHash(hash: string): BillInputs | null;
export function billHash(i: BillInputs): string;
export function billMethods(): Record<string, string>;
export function money(x: number, currency: "USD" | "EUR"): string;
