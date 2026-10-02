import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import PageActions from "@/components/PageActions";
import NextSteps from "@/components/NextSteps";
import Feedback from "@/components/Feedback";
import { site, absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { clampTitle, clampDescription } from "@/lib/cluster";
import {
  API_ENTRIES,
  APIS_PATH,
  getApi,
  CATEGORY_LABELS,
  DEV_COST_LABELS,
  type ApiEntry,
} from "@/data/apis";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_BASE, buildHkGroups } from "@/data/hkGroupPages";
import { coverageFor, changesFor, pageCount } from "@/lib/apiCoverage";

export const dynamicParams = false;

const UPDATED = "2026-08-22";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return API_ENTRIES.map((a) => ({ id: a.id }));
}

/**
 * What the title calls the product: the name people type into a search box,
 * then the kind of thing it is. "WHOOP API", not "WHOOP Developer Platform" —
 * the full product string is the H1 and leads the description. An SDK is
 * called an SDK, and a pose model is neither, so it keeps its own label.
 * Names are in order of preference; the title takes the first that fits.
 */
function titleNames(api: ApiEntry): string[] {
  // Two products are searched by a name the colloquial one drops: Junction
  // by its former name, FoodData Central by its agency. Both names are in the
  // cost model's own label.
  if (api.id === "junction") return ["Junction API (ex-Vital)", "Junction API"];
  if (api.id === "usda-fdc") return ["USDA FoodData Central API", "FoodData Central API"];
  if (api.category === "motion-sdk") return [`${api.short} SDK`];
  if (api.category === "pose-model") return [api.label, api.short];
  return [`${api.short} API`];
}

/**
 * Brand-navigational: "<name>: <what this page shows>". It names only what
 * the page renders — the access fields, the tracked changes when there are
 * any, and the coverage list (which qa requires on every directory page). It
 * deliberately avoids cost, pricing and approval: /pricing and the approval
 * fix pages own those questions, and a title here would compete with them.
 */
function apiTitle(api: ApiEntry, hasChanges: boolean): string {
  const tails = [
    ...(hasChanges ? ["Access Requirements, Changes & Guides"] : []),
    "Access Requirements & Guides",
    "Access & Guides",
  ];
  for (const name of titleNames(api)) {
    for (const tail of tails) {
      const t = `${name}: ${tail}`;
      if (t.length <= 60) return t;
    }
  }
  return clampTitle(`${api.short}: Access & Guides`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const api = getApi(id);
  if (!api) return {};
  const title = apiTitle(api, changesFor(api).length > 0);
  // The full product string leads the description, the colloquial name only
  // when the full one would push it past the limit.
  const describe = (name: string) =>
    `${name}: how it bills developers, what each user must own before data flows, what approval gates launch, and every page we have on it.`;
  const description = clampDescription(
    describe(api.label).length <= 155 ? describe(api.label) : describe(api.short),
  );
  const canonical = `${APIS_PATH}/${api.id}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "article", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * One product, one address.
 *
 * Every factual line here is a field of the provenance-tracked cost model —
 * the same source behind the cost planner and the open dataset, where each
 * value is backed by a sentence already published on this site and anything
 * unverifiable is null rather than guessed. Null is rendered as "none
 * documented", never as "free" or "no gate": we did not find one, which is
 * not the same as there not being one.
 *
 * The coverage list and the changes list are computed by matching the
 * product's proper name in page text, so they cannot fall behind the pages.
 */
export default async function ApiPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const api = getApi(id);
  if (!api) notFound();

  const path = `${APIS_PATH}/${api.id}`;
  const url = absoluteUrl(path);
  const coverage = coverageFor(api.id);
  const total = pageCount(api.id);
  const changes = changesFor(api);
  const isFirstParty = api.id === "kinestex";

  const facts: { label: string; value: string; note?: string }[] = [
    { label: "Category", value: CATEGORY_LABELS[api.category] },
    {
      label: "How it bills developers",
      value: DEV_COST_LABELS[api.devCost],
    },
    {
      label: "What each end user needs",
      value: api.userSideCost ?? "None documented.",
    },
    {
      label: "What gates your launch",
      value: api.approvalGate ?? "None documented.",
    },
    {
      label: "Integration effort",
      value: { low: "Low — days", medium: "Medium — weeks", high: "High — months" }[api.engEffort],
      note: "our rough judgement, not a vendor fact",
    },
  ];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: api.label,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: UPDATED,
        reviewedBy: orgRef(),
        publisher: orgRef(),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        // The subject of the page. SoftwareApplication is the core-vocabulary
        // type; schema.org's WebAPI is still marked pending, and this file
        // does not emit pending terms (see the note in lib/schema.ts).
        about: {
          "@type": "SoftwareApplication",
          name: api.label,
          applicationCategory: "DeveloperApplication",
          applicationSubCategory: CATEGORY_LABELS[api.category],
        },
        mainEntity: {
          "@type": "ItemList",
          name: `Pages about ${api.label} on ${site.name}`,
          numberOfItems: total,
          itemListElement: coverage
            .flatMap((c) => c.pages)
            .map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.h1,
              url: absoluteUrl(p.href),
            })),
        },
      },
    ],
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "API directory", path: APIS_PATH },
            { name: api.label, path },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          {api.label}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Directory entry · last reviewed {UPDATED}
        </p>

        {isFirstParty && (
          <aside
            role="note"
            className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Disclosure:</strong> KinesteX is the product of the company that funds this
            site. It is classified here by exactly the same rule as every other entry, with no
            ranking and no exemption from the &ldquo;could not verify&rdquo; treatment applied
            to its competitors — see{" "}
            <Link href="/methodology" className="text-brand-600 underline hover:text-brand-500">
              how we verify
            </Link>
            .
          </aside>
        )}

        <AnswerCapsule>
          {api.notes} {api.userSideCost ? `On the user's side: ${api.userSideCost} ` : ""}
          {api.approvalGate
            ? `Before launch: ${api.approvalGate}`
            : "No approval gate is documented in the sources we checked, which is not the same as there being none."}
        </AnswerCapsule>

        <PageActions path={path} url={url} title={api.label} updated={UPDATED} markdown={false} />

        <div className="mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5">
          <p className="text-sm font-semibold text-[var(--fg)]">
            Depending on {api.short}?
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Get an email when the changes tracker gains a dated entry naming it — a
            deprecation, a deadline, a terms change. Nothing else.
          </p>
          <Link
            href={`/alerts?watch=${api.id}`}
            className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Watch {api.short}
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What we have verified
          </h2>
          <dl className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-semibold text-[var(--fg)]">{f.label}</dt>
                <dd className="text-sm text-[var(--muted)] sm:col-span-2">
                  {f.value}
                  {f.note && <span className="block text-xs italic">({f.note})</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Sourced from{" "}
            <Link href={api.sourceHref} className="text-brand-600 hover:text-brand-500">
              the page carrying the verified claims
            </Link>
            , and published as open data in{" "}
            <Link href="/state-of-fitness-apis-2026" className="text-brand-600 hover:text-brand-500">
              the State of Fitness APIs 2026 dataset
            </Link>{" "}
            (CC BY 4.0). No prices appear here by design — vendor figures move within quarters
            and most serious tiers are quoted privately.
          </p>
        </section>

        {/* The type-level reference exists only for HealthKit, and it is not a
            cluster, so the coverage list below never picks it up. Counts and
            date come from the generated dataset, as on the hub itself. */}
        {api.id === "healthkit" && (
          <section className="mt-10 rounded-2xl border border-[var(--border)] p-5">
            <Link href={HK_BASE} className="font-semibold text-brand-600 hover:text-brand-500">
              HealthKit data types by group →
            </Link>
            <p className="mt-1 text-sm text-[var(--muted)]">
              All {HK_IDENTIFIERS.length} HealthKit type identifiers in {buildHkGroups().size} group
              pages — units, aggregation style and iOS availability, read from Apple&rsquo;s
              documentation on {HK_FETCHED_ON}.
            </p>
          </section>
        )}

        {changes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Tracked changes affecting {api.short}
            </h2>
            <ul className="mt-5 space-y-3">
              {changes.map((c) => (
                <li key={c.title}>
                  <Link
                    href={c.page.href}
                    className="block rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {c.date} · {c.status}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-[var(--fg)]">
                      {c.title}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {coverage.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Everything on this site about {api.short}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {total} pages, grouped by section. A page qualifies when the product is in its
              title or the question it answers, or it comes up in the body more than once — a
              single mention in a list is not coverage.
            </p>
            <div className="mt-6 space-y-8">
              {coverage.map((c) => (
                <div key={c.basePath}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    <Link href={c.basePath} className="hover:text-[var(--fg)]">
                      {c.clusterLabel}
                    </Link>
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {c.pages.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          className="text-sm text-brand-600 hover:text-brand-500"
                        >
                          {p.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <NextSteps />

        <Feedback path={path} title={api.label} repo={site.social.github || undefined} />

        <p className="mt-12 border-t border-[var(--border)] pt-6 text-xs leading-relaxed text-[var(--muted)]">
          Directory entry, last reviewed {UPDATED}. Access terms, approval processes and
          membership requirements change — confirm current details in the provider&rsquo;s own
          documentation before you commit. Product names are trademarks of their respective
          owners.
        </p>

        <p className="mt-8 text-sm">
          <Link href={APIS_PATH} className="text-brand-600 hover:text-brand-500">
            ← The whole directory
          </Link>
        </p>
      </article>
    </Container>
  );
}
