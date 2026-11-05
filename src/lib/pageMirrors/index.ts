import { mirrorResponse, type MirrorDoc } from "./core";
import { toolsHubMirror } from "./toolsHub";
import { aggregationCheckerMirror } from "./aggregationChecker";
import { errorDiagnoserMirror } from "./errorDiagnoser";
import { heartRateLabMirror } from "./heartRateLab";
import { identifierTranslatorMirror } from "./identifierTranslator";
import { keypointPlaygroundMirror } from "./keypointPlayground";
import { permissionBuilderMirror } from "./permissionBuilder";
import { poseBenchmarkMirror } from "./poseBenchmark";
import { queryGeneratorMirror } from "./queryGenerator";
import { sampleDataMirror } from "./sampleData";
import { stackGeneratorMirror } from "./stackGenerator";
import { stepLabMirror } from "./stepLab";
import { webhookVerifierMirror } from "./webhookVerifier";
import { appleHealthExplorerMirror } from "./appleHealthExplorer";
import { bleGattExplorerMirror } from "./bleGattExplorer";
import { cyclingPowerLabMirror } from "./cyclingPowerLab";
import { exerciseFormRulesMirror } from "./exerciseFormRules";
import { ftmsLabMirror } from "./ftmsLab";
import { repCounterPlaygroundMirror } from "./repCounterPlayground";
import { graveyardMirror } from "./graveyard";
import { datasetsMirror } from "./datasets";
import { changesMirror } from "./changes";
import { marketMapMirror } from "./marketMap";
import { fitnessApiIndexMirror } from "./fitnessApiIndex";
import { year2026Mirror } from "./year2026";
import { dailyMirror } from "./daily";
import { shipItMirror } from "./shipIt";
import { challengeMirror } from "./challenge";
import { myStackMirror } from "./myStack";
import { answersSearchMirror } from "./answersSearch";

/**
 * Every non-cluster page with a markdown mirror, by page path. Each entry has
 * a route folder `src/app/<path>.md/route.ts` that serves it, a
 * `<link rel="alternate" type="text/markdown">` on the page (via
 * `pageMirrorAlternates`), a Link header rule in next.config.ts
 * (PAGE_MIRRORS) and a line in /llms.txt and /llms-index.txt. qa's
 * GEO-PAGE-MD-* gates check all four from the build output.
 */
export const PAGE_MIRRORS: Record<string, () => MirrorDoc> = {
  "/tools": toolsHubMirror,
  "/tools/aggregation-checker": aggregationCheckerMirror,
  "/tools/error-diagnoser": errorDiagnoserMirror,
  "/tools/heart-rate-lab": heartRateLabMirror,
  "/tools/identifier-translator": identifierTranslatorMirror,
  "/tools/keypoint-playground": keypointPlaygroundMirror,
  "/tools/permission-builder": permissionBuilderMirror,
  "/tools/pose-benchmark": poseBenchmarkMirror,
  "/tools/query-generator": queryGeneratorMirror,
  "/tools/sample-data": sampleDataMirror,
  "/tools/stack-generator": stackGeneratorMirror,
  "/tools/step-lab": stepLabMirror,
  "/tools/webhook-verifier": webhookVerifierMirror,
  "/tools/apple-health-explorer": appleHealthExplorerMirror,
  "/tools/ble-gatt-explorer": bleGattExplorerMirror,
  "/tools/cycling-power-lab": cyclingPowerLabMirror,
  "/tools/exercise-form-rules": exerciseFormRulesMirror,
  "/tools/ftms-lab": ftmsLabMirror,
  "/tools/rep-counter-playground": repCounterPlaygroundMirror,
  "/graveyard": graveyardMirror,
  "/datasets": datasetsMirror,
  "/changes": changesMirror,
  "/market-map": marketMapMirror,
  "/fitness-api-index": fitnessApiIndexMirror,
  "/2026": year2026Mirror,
  "/daily": dailyMirror,
  "/play/ship-it": shipItMirror,
  "/challenge": challengeMirror,
  "/my-stack": myStackMirror,
  "/answers-search": answersSearchMirror,
};

/** The GET handler body for a mirror route. */
export function servePageMirror(path: string): Response {
  const make = PAGE_MIRRORS[path];
  if (!make) return new Response("Not found", { status: 404 });
  return mirrorResponse(make());
}

/** Titles for the llms files, in registry order. */
export function pageMirrorList(): { path: string; title: string }[] {
  return Object.entries(PAGE_MIRRORS).map(([path, make]) => ({ path, title: make().title }));
}
