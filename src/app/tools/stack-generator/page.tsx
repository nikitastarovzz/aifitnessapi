import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageSummary from "@/components/PageSummary";
import StackGenerator, {
  type ApiPick,
  type CategoryOption,
  type HkRow,
} from "@/components/tools/StackGenerator";
import { allStackRefs } from "@/components/AppStack";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { API_ENTRIES, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/apis";
import { allBuilds, RELEASED_BUILD, BUILD_PATH } from "@/data/build";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * The stack generator — the /build guides' concrete stack, narrowed by four
 * answers.
 *
 * Everything the tool renders is assembled here, on the server, out of data
 * that already exists: the category-to-types map behind AppStack, the
 * generated HealthKit identifier dataset, the both-platforms-verified matrix,
 * and the provenance-tracked cost model behind the API directory. The client
 * component filters and explains; it holds no facts of its own, which is what
 * keeps this page from being able to state anything the reference pages do
 * not.
 *
 * Links are resolved against the release gates here rather than written by
 * hand, so a roundup or build guide that is not published cannot be linked.
 */

const PATH = "/tools/stack-generator";
const UPDATED = "2026-09-04";

export const metadata: Metadata = {
  title: "Fitness app stack generator",
  description:
    "Answer four questions, get a concrete stack: the health data types, the APIs that fit, and the reason each survived the cut. Built from verified data.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Fitness app stack generator",
    description:
      "Pick a category, platforms, wearable needs and a team constraint; see the health data types and APIs that are left, and why the rest are not.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

/**
 * A product's category decides which roundup covers it. Only released spokes
 * are linked — the set is checked below, so an unreleased slug drops the link
 * rather than shipping a dead one.
 */
const ROUNDUP_FOR_CATEGORY: Record<string, { slug: string; label: string }> = {
  "wearable-direct": { slug: "wearable-data-apis", label: "Wearable & device data APIs" },
  aggregator: { slug: "health-data-aggregator-apis", label: "Health-data aggregator APIs" },
  "platform-store": {
    slug: "apple-healthkit-vs-google-health-connect",
    label: "Apple HealthKit vs Google Health Connect",
  },
  nutrition: { slug: "nutrition-apis", label: "Nutrition APIs" },
  "exercise-content": { slug: "exercise-database-apis", label: "Exercise database APIs" },
  "motion-sdk": { slug: "ai-workout-tracking-apis", label: "AI workout tracking APIs" },
  "pose-model": { slug: "ai-workout-tracking-apis", label: "AI workout tracking APIs" },
};

/** "running-app" → "Running app". Mechanical, so it cannot drift from a title. */
function labelForSlug(slug: string): string {
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default function StackGeneratorPage() {
  const url = absoluteUrl(PATH);

  const byCase = new Map(HK_IDENTIFIERS.map((r) => [r.case, r]));

  // Health Connect names come only from the verified matrix, derived exactly
  // as AppStack derives them: a type with no matrix row gets no Android name.
  const androidFor = new Map<string, string>();
  for (const row of MATRIX_ROWS) {
    for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
      androidFor.set(m[1], row.android);
    }
  }

  const buildTitle = new Map(allBuilds.map((b) => [b.slug, b.h1]));
  const releasedRoundups = new Set(releasedEntries().map((e) => e.slug));

  const apis: Record<string, ApiPick> = {};
  for (const a of API_ENTRIES) {
    const roundup = ROUNDUP_FOR_CATEGORY[a.category];
    apis[a.id] = {
      id: a.id,
      label: a.label,
      short: a.short,
      category: a.category,
      categoryLabel: CATEGORY_LABELS[a.category],
      devCost: a.devCost,
      devCostLabel: DEV_COST_LABELS[a.devCost],
      userSideCost: a.userSideCost,
      approvalGate: a.approvalGate,
      engEffort: a.engEffort,
      notes: a.notes,
      sourceHref: a.sourceHref,
      roundup:
        roundup && releasedRoundups.has(roundup.slug)
          ? { href: `${PILLAR_PATH}/${roundup.slug}`, label: roundup.label }
          : null,
    };
  }

  const categories: CategoryOption[] = allStackRefs()
    .filter((s) => RELEASED_BUILD.has(s.slug))
    .map((s) => {
      const hk: HkRow[] = s.healthkit
        .map((name) => ({ name, record: byCase.get(name) }))
        .filter((r): r is { name: string; record: NonNullable<typeof r.record> } => Boolean(r.record))
        .map(({ name, record }) => ({
          name,
          abstract: record.abstract,
          aggregation: record.aggregation,
          family: record.family,
          valueEnum: record.valueEnum,
          android: androidFor.get(name) ?? null,
        }));
      return {
        slug: s.slug,
        label: labelForSlug(s.slug),
        guideHref: `${BUILD_PATH}/${s.slug}`,
        guideTitle: buildTitle.get(s.slug) ?? `How to build a ${labelForSlug(s.slug).toLowerCase()}`,
        hk,
        apiIds: s.apis.filter((id) => apis[id]),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fitness app stack generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: String(metadata.description),
    url,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: orgRef(),
    datePublished: UPDATED,
    dateModified: UPDATED,
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Build guides", path: BUILD_PATH },
            { name: "Stack generator", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          Generate your stack
        </h1>

        <PageSummary path={PATH} name="Fitness app stack generator" updated={UPDATED}>
          Four questions — what you are building, which platforms ship, how much wearable data
          you need, and whether the team is optimising for speed or control — and you get the
          HealthKit types that category touches and the APIs that survive those answers, each
          one carrying the reason it survived. The reasons are fields, not opinions: how the
          product bills developers, what every end user must own, what approval gates your
          launch, and our published rough judgement of the integration work.
        </PageSummary>

        <div className="mt-8">
          <StackGenerator
            categories={categories}
            apis={apis}
            origin={site.url}
            hkFetchedOn={HK_FETCHED_ON}
          />
        </div>

        <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>What this will not do</h2>
          <p>
            It will not rank. There is no score behind the ordering — products are filtered by
            your answers and then sorted by the same fields the{" "}
            <Link href="/compare-apis">comparison tool</Link> prints, with the sort key stated on
            screen so you can disagree with it. The one judgement in the model, integration
            effort, is labelled as ours everywhere it appears, because it is the only field in{" "}
            <Link href="/apis">the directory</Link> that is not backed by a published sentence.
          </p>
          <p>
            It will also not fill an empty result. Some combinations exclude everything a
            category lists — a web-and-backend-only product that wants platform-store data has
            nowhere to read it from, because both stores are on-device — and the tool says so
            instead of offering a consolation pick. When that happens, the exclusions are the
            answer: loosen the constraint you can live with, or plan to build that layer.
          </p>
          <p>
            For a whole-stack cost shape at your user count, use{" "}
            <Link href="/cost-planner">the cost planner</Link>. For a starting recommendation
            before you know the category, <Link href="/picker">the picker</Link> asks three
            broader questions. For the full type reference behind the table,{" "}
            <Link href="/healthkit-identifiers">every HealthKit type identifier</Link> lists all
            of them with the platform each was introduced on.
          </p>
        </div>
      </div>
    </Container>
  );
}
