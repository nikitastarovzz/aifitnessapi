/**
 * Where each tool hands the reader on to a decision (ops/MORE-30-2026-11-05.md
 * item 27). A tool answers one narrow question; the pages listed here are the
 * comparison, pricing or integration pages where that question turns into a
 * choice of API. Two or three per tool, picked by what the tool works on.
 *
 * Hand-written, and it adds no facts: link text is each page's own H1
 * (lib/routeLabel), so nothing typed here can disagree with the page it names,
 * and a path routeLabel does not know fails the build (components/ToolNextStep).
 */
export const TOOL_NEXT_STEPS: Record<string, string[]> = {
  "/tools/error-diagnoser": [
    "/integrate/healthkit",
    "/integrate/google-health-connect",
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
  ],
  "/tools/aggregation-checker": [
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
    "/integrate/healthkit",
    "/integrate/google-health-connect",
  ],
  "/tools/identifier-translator": [
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
    "/integrate/google-health-connect",
  ],
  "/tools/permission-builder": [
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
    "/alternatives/healthkit-alternatives",
  ],
  "/tools/query-generator": [
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
    "/alternatives/healthkit-alternatives",
  ],
  "/tools/stack-generator": [
    "/fitness-apis/wearable-data-apis",
    "/fitness-apis/health-data-aggregator-apis",
    "/pricing/how-much-does-a-fitness-api-cost",
  ],
  "/tools/sample-data": [
    "/fitness-apis/wearable-data-apis",
    "/fitness-apis/health-data-aggregator-apis",
  ],
  "/tools/webhook-verifier": [
    "/integrate",
    "/fitness-apis/health-data-aggregator-apis",
    "/pricing/health-data-aggregator-pricing",
  ],
  "/tools/keypoint-playground": [
    "/fitness-apis/ai-workout-tracking-apis",
    "/motion/pose-estimation-model-licenses",
  ],
  "/tools/pose-benchmark": [
    "/fitness-apis/ai-workout-tracking-apis",
    "/motion/build-vs-buy-ai-motion-tracking",
  ],
  "/tools/heart-rate-lab": [
    "/fitness-apis/wearable-data-apis",
    "/fitness-apis/health-data-aggregator-apis",
  ],
  "/tools/step-lab": [
    "/fitness-apis/wearable-data-apis",
    "/integrate/healthkit",
    "/integrate/google-health-connect",
  ],
  "/challenge": [
    "/fitness-apis/ai-workout-tracking-apis",
    "/motion/build-vs-buy-ai-motion-tracking",
    "/motion/pose-estimation-models-compared",
  ],
  "/daily": [
    "/fitness-apis/wearable-data-apis",
    "/integrate/healthkit",
    "/integrate/google-health-connect",
  ],
  "/play/ship-it": [
    "/fitness-apis/wearable-data-apis",
    "/fitness-apis/health-data-aggregator-apis",
    "/pricing/how-much-does-a-fitness-api-cost",
  ],
  "/graveyard": [
    "/alternatives/fitbit-api-alternatives",
    "/alternatives/google-fit-api-alternatives",
    "/fitness-apis/wearable-data-apis",
  ],
  "/market-map": [
    "/fitness-apis",
    "/pricing/how-much-does-a-fitness-api-cost",
    "/fitness-apis/free-fitness-apis",
  ],
  "/fitness-api-index": [
    "/fitness-apis",
    "/pricing",
    "/alternatives",
  ],
};

/** The data-cta id of a next-step link: its target path, slashes as dashes. */
export function nextStepCtaId(target: string): string {
  return `next-step${target.replace(/\//g, "-")}`;
}
