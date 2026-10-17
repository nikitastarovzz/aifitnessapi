/**
 * "On this site" for the per-type reference pages: the released cluster
 * pages that already point at a type. Computed, never listed by hand — a
 * page counts only if its own body links the type's row (or page), or, for a
 * Wear OS constant, uses it in code as DataType.NAME. These are links, not
 * facts about the type, so they never count toward the thin-page rules in
 * hkIdentifierPages.ts and hsDataTypePages.ts.
 *
 * Kept apart from those two modules so that the rule, the titles and the
 * capsules — which llms.txt, answers.json and the search index import — do
 * not pull in the whole cluster registry.
 */
import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { allReferencedCases } from "@/components/MetricFacts";

export type RelatedPage = { path: string; title: string; section: string };

type Spoke = RelatedPage & { text: string };

let SPOKES: Spoke[] | null = null;

function spokes(): Spoke[] {
  SPOKES ??= allSpokes().map(({ basePath, entry }) => ({
    path: `${basePath}/${entry.slug}`,
    title: entry.h1,
    section: CLUSTER_LABELS[basePath] ?? basePath,
    text: `${entry.answer}\n${entry.body}`,
  }));
  return SPOKES;
}

/**
 * Released cluster pages that cover this HealthKit identifier: the /data
 * guides whose derived platform-facts block renders it (the join in
 * MetricFacts, so the two cannot disagree), then every page whose markdown
 * links its row on any HealthKit reference page (/healthkit/<group>#id-<case>,
 * /healthkit-identifiers#id-<case>, …) or its own page. Deduplicated, in that
 * order.
 */
export function pagesLinkingHkIdentifier(caseName: string, pagePath: string | null): RelatedPage[] {
  const lc = caseName.toLowerCase();
  const row = new RegExp(`\\]\\(/healthkit[a-z0-9/-]*#id-${lc}\\)`);
  const own = pagePath ? new RegExp(`\\]\\(${pagePath.replace(/[-/]/g, "\\$&")}(?:#[^)]*)?\\)`) : null;
  const byPath = new Map(spokes().map((s) => [s.path, s]));
  const out: RelatedPage[] = [];
  const add = (s: Spoke | undefined) => {
    if (s && !out.some((o) => o.path === s.path)) out.push({ path: s.path, title: s.title, section: s.section });
  };
  for (const { source, cases } of allReferencedCases()) if (cases.includes(caseName)) add(byPath.get(source));
  for (const s of spokes()) if (row.test(s.text) || (own?.test(s.text) ?? false)) add(s);
  return out;
}

/**
 * Released cluster pages that use this Health Services constant in code
 * (DataType.NAME, whole word, so HEART_RATE_BPM does not match
 * HEART_RATE_BPM_STATS) or link its row or page on /wear-os-data-types.
 */
export function pagesUsingHsDataType(name: string, pagePath: string | null): RelatedPage[] {
  const code = new RegExp(`\\bDataType\\.${name}\\b`);
  const row = new RegExp(`\\]\\(/wear-os-data-types#type-${name.toLowerCase()}\\)`);
  const own = pagePath ? new RegExp(`\\]\\(${pagePath.replace(/[-/]/g, "\\$&")}(?:#[^)]*)?\\)`) : null;
  return spokes()
    .filter((s) => code.test(s.text) || row.test(s.text) || (own?.test(s.text) ?? false))
    .map(({ path, title, section }) => ({ path, title, section }));
}
