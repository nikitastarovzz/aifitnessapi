/**
 * Cluster 14 — LLM-powered features in fitness apps. The language-model layer:
 * plan generation, conversational coaching, natural-language food logging,
 * grounding a model in your own catalogue, safety guardrails for health advice,
 * model choice, evaluation, and what it costs. Distinct from /motion (computer
 * vision) and from /build/ai-fitness-coaching-app (a product playbook).
 * Reuses the shared cluster template; Article + FAQPage (no HowTo).
 */
import { aiEntries } from "./ai.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const AI_PATH = "/ai";
export const AI_CONFIG: ClusterConfig = {
  basePath: AI_PATH,
  hubLabel: "AI Features",
  disclaimer: "health-ai",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_AI = new Set<string>([
  "ai-workout-plan-generation",
  "ai-nutrition-logging",
  "personalize-with-wearable-data",
  "ground-llm-in-exercise-database",
  "ai-fitness-coach-prompts",
  "ai-vs-rules-based-coaching",
  "evaluating-ai-fitness-features",
  "llm-safety-fitness-advice",
  "choosing-an-llm-for-fitness-apps",
  "ai-fitness-app-cost",
  "structured-output-for-workout-plans",
]);

export const allAi: ClusterEntry[] = aiEntries;

export function releasedAi(): ClusterEntry[] {
  return allAi.filter((e) => RELEASED_AI.has(e.slug));
}

export function getAi(slug: string): ClusterEntry | undefined {
  return releasedAi().find((e) => e.slug === slug);
}
