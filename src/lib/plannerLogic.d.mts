import type { EdgeCase, PlannerSource, Regime, StoreItem } from "../data/plannerSources.mjs";

export type Status = "likely" | "possible" | "unlikely" | "check";
export type Finding = { id: string; status: Status; reason: string };
export type WizardAnswers = { payer: string; ce: string; ba: string; rx: string; us: string; wa: string; eu: string; med: string; ads: string; s: string[] };
export type WizardKey = Exclude<keyof WizardAnswers, "s">;
export type ChecklistState = { stores: string[]; traits: string[] };
export type PlanAnswers = { type: string; p: string[]; src: string[]; f: string[]; payer: string; us: string; eu: string; wa: string };

export type PageLink = { href: string; label: string };
export type HkType = { name: string; aggregation: string | null; android: string | null };
export type AppType = { id: string; label: string; guide?: PageLink; hk: HkType[]; apiIds: string[]; traits?: string[]; pages: string[] };
export type PlanApi = {
  id: string;
  label: string;
  category: string;
  categoryLabel: string;
  devCost: string;
  devCostLabel: string;
  userSideCost: string | null;
  approvalGate: string | null;
  engEffort: "low" | "medium" | "high";
  notes: string;
  sourceHref: string;
};
export type PlanBundle = {
  appTypes: AppType[];
  apis: Record<string, PlanApi>;
  labels: Record<string, string>;
  storeItems: StoreItem[];
  regimes: Regime[];
  edgeCases: EdgeCase[];
  sources: Record<string, PlannerSource>;
  traitLabels: Record<string, string>;
  devCostLabels: Record<string, string>;
};
export type Plan = {
  answers: PlanAnswers;
  appType: AppType;
  guide: PageLink | null;
  traits: string[];
  apis: (PlanApi & { inGuide: boolean })[];
  hk: HkType[];
  notes: string[];
  cost: {
    byDevCost: { key: string; items: (PlanApi & { inGuide: boolean })[] }[];
    effortRange: [string, string] | null;
    approvals: PlanApi[];
    userSide: PlanApi[];
  };
  arch: { title: string; links: PageLink[] }[];
  wizard: WizardAnswers;
  compliance: Finding[];
  stores: string[];
  storeItems: StoreItem[];
  edgeCases: EdgeCase[];
  showsFunder: boolean;
  links: { self: string; wizard: string; checklist: string };
};

export function parseList(value: string | null | undefined, allowed?: string[]): string[];

export const STORES: string[];
export const STORE_LABELS: Record<string, string>;
export const TRAIT_ORDER: string[];
export function applicableStoreItems(items: StoreItem[], stores: string[], traits: string[]): StoreItem[];
export const CHECKLIST_DEFAULT: ChecklistState;
export function decodeChecklist(search: string): ChecklistState;
export function encodeChecklist(state: ChecklistState): string;
export function checklistProgress(items: StoreItem[], done: string[]): { done: number; total: number; percent: number };
export function checklistMarkdown(
  items: StoreItem[],
  sources: Record<string, PlannerSource>,
  opts?: { done?: string[]; origin?: string; traitLabels?: Record<string, string>; traits?: string[]; stores?: string[] },
): string;

export const WIZARD_QUESTIONS: { id: WizardKey; label: string; options: [string, string][] }[];
export const WIZARD_DEFAULT: WizardAnswers;
export function decodeWizard(search: string): WizardAnswers;
export function encodeWizard(a: WizardAnswers): string;
export const STATUS_LABELS: Record<Status, string>;
export function assessCompliance(a: WizardAnswers): Finding[];
export function complianceMarkdown(
  result: Finding[],
  regimes: Regime[],
  sources: Record<string, PlannerSource>,
  opts?: { origin?: string; answers?: WizardAnswers },
): string;

export const PLATFORMS: string[];
export const PLATFORM_LABELS: Record<string, string>;
export const DATA_SOURCES: [string, string][];
export const FEATURES: { id: string; label: string; categories: string[]; traits: string[] }[];
export const PAYERS: [string, string][];
export const PLAN_DEFAULT: PlanAnswers;
export function decodePlan(search: string, appTypeIds: string[]): PlanAnswers;
export function encodePlan(a: PlanAnswers): string;
export function planTraits(a: PlanAnswers, appType?: AppType): string[];
export function planToWizard(a: PlanAnswers, appType?: AppType): WizardAnswers;
export function buildPlan(a: PlanAnswers, bundle: PlanBundle): Plan;
export const EFFORT_NOTE: string;
export function planMarkdown(plan: Plan, bundle: PlanBundle, opts?: { origin?: string; date?: string }): string;
export function prdMarkdown(plan: Plan, bundle: PlanBundle, opts?: { origin?: string; date?: string }): string;
export const PLAN_PAGES: string[];
