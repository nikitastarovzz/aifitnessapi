export type PlannerSource = { url: string; title: string; publisher: string; note?: string };
export type StoreItem = {
  id: string;
  store: "apple" | "google";
  section: string;
  title: string;
  quote: string;
  source: string;
  when?: string[];
  page?: string;
};
export type RuleQuote = { quote: string; source: string; page?: string };
export type Regime = { id: string; name: string; page: string; quotes: RuleQuote[] };
export type EdgeCase = { id: string; title: string; quote: string; source: string; page: string; when: string[] };

export const PLANNER_READ_ON: string;
export const PLANNER_SOURCES: Record<string, PlannerSource>;
export const PLANNER_TRAITS: Record<string, string>;
export const STORE_ITEMS: StoreItem[];
export const REGIMES: Regime[];
export const EDGE_CASES: EdgeCase[];
