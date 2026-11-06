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
import { starterScaffoldMirror } from "./starterScaffold";
import { appleHealthExplorerMirror } from "./appleHealthExplorer";
import { bleGattExplorerMirror } from "./bleGattExplorer";
import { cyclingPowerLabMirror } from "./cyclingPowerLab";
import { exerciseFormRulesMirror } from "./exerciseFormRules";
import { ftmsLabMirror } from "./ftmsLab";
import { repCounterPlaygroundMirror } from "./repCounterPlayground";
import { buildPlanMirror, complianceWizardMirror, storeChecklistMirror } from "./plannerTools";
import { apiCoverageMatrixMirror } from "./apiCoverageMatrix";
import { rateLimitCalculatorMirror } from "./rateLimitCalculator";
import { exerciseTaxonomyMirror, gymMatrixMirror, researchChooserMirror } from "./audienceTools";
import { atlasMirror } from "./atlas";
import { weeklyMirror } from "./weekly";
import { historyMirror } from "./history";
import { oauthPlaygroundMirror } from "./oauthPlayground";
import { webhooksMirror } from "./webhooks";
import { schemaConverterMirror } from "./schemaConverter";
import { fitbitToGoogleHealthMirror } from "./fitbitToGoogleHealth";
import { schemaMirror } from "./schema";
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
  "/tools/starter-scaffold": starterScaffoldMirror,
  "/tools/apple-health-explorer": appleHealthExplorerMirror,
  "/tools/ble-gatt-explorer": bleGattExplorerMirror,
  "/tools/cycling-power-lab": cyclingPowerLabMirror,
  "/tools/exercise-form-rules": exerciseFormRulesMirror,
  "/tools/ftms-lab": ftmsLabMirror,
  "/tools/rep-counter-playground": repCounterPlaygroundMirror,
  "/tools/build-plan": buildPlanMirror,
  "/tools/store-submission-checklist": storeChecklistMirror,
  "/tools/compliance-wizard": complianceWizardMirror,
  "/tools/api-coverage-matrix": apiCoverageMatrixMirror,
  "/tools/rate-limit-calculator": rateLimitCalculatorMirror,
  "/tools/exercise-taxonomy-crosswalk": exerciseTaxonomyMirror,
  "/tools/gym-software-api-matrix": gymMatrixMirror,
  "/tools/research-platform-chooser": researchChooserMirror,
  "/atlas": atlasMirror,
  "/weekly": weeklyMirror,
  "/history": historyMirror,
  "/tools/oauth-playground": oauthPlaygroundMirror,
  "/tools/schema-converter": schemaConverterMirror,
  "/tools/fitbit-to-google-health": fitbitToGoogleHealthMirror,
  "/schema": schemaMirror,
  "/graveyard": graveyardMirror,
  "/webhooks": webhooksMirror,
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
