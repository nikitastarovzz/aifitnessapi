import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_READONLY } from "@/data/healthkitWritability";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { GROUPS as GLOSSARY_GROUPS, termSlug } from "@/data/glossary";
import { absoluteUrl, site } from "@/lib/site";
import { allSpokes } from "@/lib/clusterRegistry";
import { DEV_COST_LABELS } from "@/data/costModel";
import { DEV_COST_MEANING, GLANCE_COST_ITEMS } from "@/data/hubGlance";
import { moneyPages } from "@/data/moneyPages";

/**
 * The claims index: every citable fact this site publishes, flattened to one
 * record per claim with a composed English sentence, a stable fragment URL,
 * and a cite-as string.
 *
 * answers.json carries the same facts as structured groups for querying;
 * this is the projection for QUOTING — an agent that wants one attributable
 * sentence should not have to compose it from fields and risk composing it
 * wrong. Every sentence below is assembled mechanically from dataset fields,
 * so it cannot say more than the data does.
 */
export const dynamic = "force-static";

type Claim = {
  id: string;
  claim: string;
  url: string;
  source: string;
  last_reviewed: string;
  cite_as: string;
};

function claim(id: string, text: string, reviewed: string): Claim {
  const url = id.split("#")[0];
  return {
    id,
    claim: text,
    url,
    source: `${site.name} (${site.url})`,
    last_reviewed: reviewed,
    cite_as: `"${text}" — ${site.name}, ${id}`,
  };
}

export function GET() {
  const claims: Claim[] = [];

  // First, the money pages: the opening of each one's answer capsule, cited
  // at the capsule itself (src/data/moneyPages.ts). The sentence is the
  // page's own, so the claim cannot say more than the page does.
  for (const m of moneyPages()) {
    claims.push(claim(`${absoluteUrl(m.path)}#answer`, m.oneLine, m.entry.updated));
  }

  // Then how each product bills developers, from the cost model, cited at the
  // row of the /pricing hub's at-a-glance table that renders it. Reviewed as
  // of the page the cost model quotes for that product.
  const reviewedOn = new Map(allSpokes().map(({ basePath, entry }) => [`${basePath}/${entry.slug}`, entry.updated]));
  for (const c of GLANCE_COST_ITEMS) {
    const parts = [`${c.label} bills developers: ${DEV_COST_LABELS[c.devCost]} (${DEV_COST_MEANING[c.devCost]}).`];
    if (c.userSideCost) parts.push(`Each end user: ${c.userSideCost}`);
    if (c.approvalGate) parts.push(`Before launch: ${c.approvalGate}`);
    const reviewed = reviewedOn.get(c.sourceHref);
    if (!reviewed) throw new Error(`claims.json: cost model source ${c.sourceHref} is not a released page`);
    claims.push(claim(`${absoluteUrl("/pricing")}#cost-${c.id}`, parts.join(" "), reviewed));
  }

  for (const r of HK_IDENTIFIERS) {
    const id = `${absoluteUrl("/healthkit-identifiers")}#id-${r.case.toLowerCase()}`;
    const bits: string[] = [`${r.case} is a case of Apple's ${r.familyType}`];
    const ios = r.platforms.find((p) => p.name === "iOS");
    if (ios) bits.push(`introduced in iOS ${ios.introducedAt}`);
    if (r.aggregation) bits.push(`documented as measuring ${r.aggregation} values`);
    if (r.unitFamily) bits.push(`with units in the ${r.unitFamily} family`);
    if (r.valueEnum) bits.push(`its samples carry ${r.valueEnum} values`);
    if (r.undocumented) bits.push("Apple lists it without an abstract");
    claims.push(claim(id, bits.join(", ") + `, per Apple's documentation read ${HK_FETCHED_ON}.`, HK_FETCHED_ON));
  }

  for (const r of HK_READONLY) {
    claims.push(
      claim(
        `${absoluteUrl("/healthkit-identifiers")}#id-${r.case.toLowerCase()}`,
        `Apple's documentation states ${r.case} samples are read-only: "${r.evidence}" (read ${HK_FETCHED_ON}).`,
        HK_FETCHED_ON,
      ),
    );
  }

  for (const r of MATRIX_ROWS) {
    claims.push(
      claim(
        `${absoluteUrl("/matrix")}#${r.id}`,
        `${r.label} maps to ${r.apple} on Apple HealthKit and to ${r.android} on Android Health Connect${r.watchOut ? `; caveat: ${r.watchOut}` : ""}.`,
        HK_FETCHED_ON,
      ),
    );
  }

  for (const g of GLOSSARY_GROUPS) {
    for (const t of g.terms) {
      claims.push(
        claim(`${absoluteUrl("/glossary")}#term-${termSlug(t.term)}`, `${t.term}: ${t.def}`, HK_FETCHED_ON),
      );
    }
  }

  const body = {
    name: `${site.name} claims index`,
    description:
      "One record per citable fact, each with a composed sentence, a stable fragment URL that a build gate keeps resolving, and a cite-as string. Assembled mechanically from the same datasets that render the pages.",
    site: site.url,
    license: "Quotable with attribution. Cite the fragment URL.",
    structured_view: absoluteUrl("/answers.json"),
    count: claims.length,
    claims,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
