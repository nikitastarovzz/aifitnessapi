import { allStackRefs } from "@/components/AppStack";
import { HK_IDENTIFIERS } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { COST_ITEMS, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/costModel";
import { allBuilds, RELEASED_BUILD, BUILD_PATH } from "@/data/build";
import { routeLabel } from "@/lib/routeLabel";
import { EDGE_CASES, PLANNER_SOURCES, PLANNER_TRAITS, REGIMES, STORE_ITEMS } from "@/data/plannerSources.mjs";
import { PLAN_PAGES, type AppType, type PlanApi, type PlanBundle } from "@/lib/plannerLogic.mjs";

/**
 * The data the three planning tools run on, assembled on the server from the
 * site's own modules so the client components hold no facts of their own:
 *
 *  - app types: every released /build guide that has a concrete stack
 *    (components/AppStack), with the HealthKit types that stack names joined
 *    to the generated identifier dataset and, for Android, the verified matrix
 *    only (exactly as AppStack and the stack generator join them), plus two
 *    app types the guides do not cover, which point at the pages that do;
 *  - products: the whole provenance-tracked cost model (data/costModel.ts),
 *    which states how each product bills, never what it charges;
 *  - page names: routeLabel for every page a plan, checklist item or rule can
 *    link. A path routeLabel does not know fails the build here rather than
 *    shipping a dead or nameless link.
 */

const EXTRA_TYPES: AppType[] = [
  {
    id: "gym-studio-app",
    label: "Gym or studio app",
    hk: [],
    apiIds: [],
    pages: ["/fitness-apis/gym-management-software-apis", "/compliance/gym-gdpr-compliance"],
  },
  {
    id: "clinical-rpm-app",
    label: "Clinical or remote patient monitoring app",
    hk: [],
    apiIds: [],
    traits: ["clinical"],
    pages: [
      "/compliance/remote-patient-monitoring-device-requirements",
      "/fitness-apis/wearable-data-to-ehr-fhir",
      "/compliance/hipaa-compliance-fitness-app",
    ],
  },
];

/** App types whose audience switches a checklist trait on. */
const TYPE_TRAITS: Record<string, string[]> = {
  "kids-fitness-app": ["kids"],
};

function labelForSlug(slug: string): string {
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

let BUNDLE: PlanBundle | null = null;

export function plannerBundle(): PlanBundle {
  if (BUNDLE) return BUNDLE;
  const byCase = new Map(HK_IDENTIFIERS.map((r) => [r.case, r]));
  const androidFor = new Map<string, string>();
  for (const row of MATRIX_ROWS) {
    for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) androidFor.set(m[1], row.android);
  }
  const buildTitle = new Map(allBuilds.map((b) => [b.slug, b.h1]));

  const apis: Record<string, PlanApi> = {};
  for (const c of COST_ITEMS) {
    apis[c.id] = {
      id: c.id,
      label: c.label,
      category: c.category,
      categoryLabel: CATEGORY_LABELS[c.category],
      devCost: c.devCost,
      devCostLabel: DEV_COST_LABELS[c.devCost],
      userSideCost: c.userSideCost,
      approvalGate: c.approvalGate,
      engEffort: c.engEffort,
      notes: c.notes,
      sourceHref: c.sourceHref,
    };
  }

  const guided: AppType[] = allStackRefs()
    .filter((s) => RELEASED_BUILD.has(s.slug))
    .map((s) => {
      const href = `${BUILD_PATH}/${s.slug}`;
      return {
        id: s.slug,
        label: labelForSlug(s.slug),
        guide: { href, label: buildTitle.get(s.slug) ?? labelForSlug(s.slug) },
        hk: s.healthkit
          .map((name) => ({ name, record: byCase.get(name) }))
          .filter((r) => r.record)
          .map(({ name, record }) => ({ name, aggregation: record!.aggregation, android: androidFor.get(name) ?? null })),
        apiIds: s.apis.filter((id) => apis[id]),
        traits: TYPE_TRAITS[s.slug],
        pages: [],
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const appTypes = [...guided, ...EXTRA_TYPES];

  const hrefs = new Set<string>([
    ...PLAN_PAGES,
    ...appTypes.flatMap((t) => t.pages),
    ...STORE_ITEMS.flatMap((i) => (i.page ? [i.page] : [])),
    ...REGIMES.map((r) => r.page),
    ...EDGE_CASES.map((e) => e.page),
    ...Object.values(apis).map((a) => a.sourceHref),
  ]);
  const labels: Record<string, string> = {};
  const unknown: string[] = [];
  for (const h of hrefs) {
    const l = routeLabel(h);
    if (l) labels[h] = l;
    else unknown.push(h);
  }
  if (unknown.length) throw new Error(`plannerBundle: routeLabel does not know ${unknown.join(", ")}`);

  BUNDLE = {
    appTypes,
    apis,
    labels,
    storeItems: STORE_ITEMS,
    regimes: REGIMES,
    edgeCases: EDGE_CASES,
    sources: PLANNER_SOURCES,
    traitLabels: PLANNER_TRAITS,
    devCostLabels: DEV_COST_LABELS,
  };
  return BUNDLE;
}
