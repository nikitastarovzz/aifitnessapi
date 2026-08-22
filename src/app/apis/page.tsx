import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import ClusterCta from "@/components/ClusterCta";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { API_ENTRIES, APIS_PATH, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/apis";
import { CATEGORY_ORDER } from "@/data/costModel";
import { pageCount } from "@/lib/apiCoverage";

const UPDATED = "2026-08-22";
const TITLE = "Fitness & Health API Directory";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · AIFitnessAPI` },
  description:
    "Every fitness, wearable, nutrition and AI motion API we cover, on one page: how each bills you, what your users must own, and what gates launch.",
  alternates: { canonical: APIS_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "How each fitness and health API bills you, what your users must own, and what approval gates launch — with every page we have written about it.",
    url: APIS_PATH,
  },
};

/**
 * The directory: one row per product, grouped the way the cost planner groups
 * them. It exists because brand queries ("Terra API", "Polar AccessLink") had
 * no home here — they landed on whichever comparison happened to rank — and
 * because a model asked "what does this site say about WHOOP" had to infer it
 * from eleven pages.
 *
 * Every fact on this page and its children comes from the provenance-tracked
 * cost model, where each field is backed by a sentence already published here.
 * The directory adds no claims of its own.
 */
export default function ApiDirectory() {
  const url = absoluteUrl(APIS_PATH);
  const total = API_ENTRIES.length;
  const withGate = API_ENTRIES.filter((a) => a.approvalGate).length;
  const withUserCost = API_ENTRIES.filter((a) => a.userSideCost).length;

  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: TITLE,
    description: String(metadata.description),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: UPDATED,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: API_ENTRIES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.label,
        url: absoluteUrl(`${APIS_PATH}/${a.id}`),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "API directory", path: APIS_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; health API directory
        </h1>

        <AnswerCapsule>
          {total} products, each with one page stating how it bills developers, what every end
          user has to own or pay for before data flows, and what approval stands between you
          and launch. {withGate} of the {total} carry an approval gate and {withUserCost} carry
          a cost on the user&rsquo;s side — the two things that sink a schedule and are
          hardest to find in vendor documentation. There are no prices anywhere here by
          design: structures are stable, numbers are not, and a stale figure damages a
          citable source more than a missing one.
        </AnswerCapsule>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Each entry is generated from the same provenance-tracked model behind the{" "}
            <Link href="/cost-planner">cost planner</Link> and the{" "}
            <Link href="/state-of-fitness-apis-2026">State of Fitness APIs 2026</Link> dataset,
            where every field is backed by a sentence already published on this site and
            anything unverifiable is left empty rather than guessed. The directory adds no new
            claims — it gives each product one address, and lists every page here that covers
            it.
          </p>
        </div>

        {CATEGORY_ORDER.filter((c) => API_ENTRIES.some((a) => a.category === c)).map((cat) => {
          const items = API_ENTRIES.filter((a) => a.category === cat);
          return (
            <section key={cat} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {CATEGORY_LABELS[cat]}
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`${APIS_PATH}/${a.id}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{a.label}</span>
                      <span className="mt-2 flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]">
                          {DEV_COST_LABELS[a.devCost]}
                        </span>
                        {a.approvalGate && (
                          <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[var(--fg)]">
                            approval gate
                          </span>
                        )}
                        {a.userSideCost && (
                          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]">
                            user-side cost
                          </span>
                        )}
                      </span>
                      <span className="mt-3 text-xs text-[var(--muted)]">
                        {pageCount(a.id)} pages here cover it
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <ClusterCta
          pitch="The gates and the user-side costs are the parts that move: an approval queue opens, a membership requirement appears, a successor API arrives with different terms. We track those changes and write them down with dates."
          source="directory"
          id="cta-apis"
        />

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          Independent directory, last reviewed {UPDATED}. Access terms, approval processes and
          membership requirements change often — confirm current details in each
          provider&rsquo;s official documentation before you commit. Product and company names
          are trademarks of their respective owners; AIFitnessAPI is not affiliated with,
          endorsed by, or sponsored by any product listed here, with one exception stated on
          its own page: KinesteX funds this site.
        </p>
      </div>
    </Container>
  );
}
