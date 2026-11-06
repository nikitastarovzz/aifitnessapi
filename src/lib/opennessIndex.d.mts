/** Types for opennessIndex.mjs (the cells behind /openness-index). */

export type OpennessSrc = { url: string; quote: string; ev: string };
export type OpennessStatus = "documented" | "absent" | "not-documented" | "n/a";
export type OpennessCheckId = "self-serve" | "sandbox" | "pricing" | "rate-limits" | "signed-webhooks" | "pkce" | "refresh" | "disconnect";

export type OpennessCheck = {
  id: OpennessCheckId;
  label: string;
  question: string;
  rule: string;
  from: "curated" | "rateLimitCalc" | "webhookPayloads" | "oauthVendors";
};

export type OpennessCell = {
  status: OpennessStatus;
  note: string;
  src?: OpennessSrc;
  caveat?: { text: string; src: OpennessSrc };
};

export type OpennessVendorBase = { id: string; name: string; guide: string; kind: "cloud" | "aggregator" };

export type OpennessVendor = OpennessVendorBase & {
  cells: Record<OpennessCheckId, OpennessCell>;
  documented: number;
  applicable: number;
};

export type OpennessSources = {
  oauth: unknown[];
  oauthSources: Record<string, { url: string; via?: string }>;
  webhooks: unknown[];
  webhookSources: Record<string, { url: string; via?: string }>;
  verifierKinds: Record<string, string>;
  rateLimits: unknown[];
  rateNotDocumented: unknown[];
  ghapi: { rateLimits: { metric: string; defaultLimit: string; qpsImpact: string }[]; sources: { key: string; url: string }[] };
};

export const OPENNESS_PATH: string;
export const OPENNESS_CHECKS: OpennessCheck[];
export const CHECK_WORDS: Record<OpennessCheckId, RegExp>;
export const OPENNESS_VENDORS: OpennessVendorBase[];
export const OPENNESS_NOT_SCORED: { name: string; href: string; reason: string }[];
export const CURATED: Record<string, Partial<Record<OpennessCheckId, OpennessCell>>>;
export const STATUS_LABEL: Record<OpennessStatus, string>;
export function deriveOpenness(sources: OpennessSources): OpennessVendor[];
export function opennessScore(cells: Record<string, OpennessCell>): { documented: number; applicable: number };
export function scoreText(s: { documented: number; applicable: number }): string;
export function opennessSources(vendors: OpennessVendor[]): { at: string; src: OpennessSrc; status: string; check: string }[];
export function vendorAnchor(id: string): string;
export function cellAnchor(id: string, check: string): string;
