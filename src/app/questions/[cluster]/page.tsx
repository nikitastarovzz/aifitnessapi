import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { clampTitle, clampDescription, type ClusterEntry } from "@/lib/cluster";
import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";

/**
 * One question index per cluster — /questions/<cluster>.
 *
 * Every spoke already answers a handful of named questions and renders each
 * one at a stable `#faq-N` anchor, but nothing on the site lists them: the
 * only way to find the paragraph that answers "why does my Fitbit token 401"
 * is to already know which page it is on. This is that list.
 *
 * Deliberately an INDEX, not a copy. The questions are links; the answers
 * stay on the pages that own them. Restating them here would duplicate both
 * the prose and the FAQPage markup, and two URLs competing for one rich
 * result means neither wins — so this page emits CollectionPage + ItemList
 * (one ListItem per question, pointing at the anchor) and no FAQPage at all.
 */

const QUESTIONS_PATH = "/questions";
/** The layout appends " · AIFitnessAPI" (15 chars) to the 60-char budget. */
const TITLE_MAX = 45;
/** Enough of the answer to recognise it, never enough to replace reading it. */
const SNIPPET_MAX = 140;

type Cluster = {
  /** e.g. "/learn" */
  base: string;
  /** the route param, e.g. "learn" */
  cluster: string;
  label: string;
  entries: ClusterEntry[];
  questions: number;
};

/** Clusters with at least one released page, in registry order. An empty
 *  cluster has no questions to index and its hub 404s, so it is skipped. */
function populatedClusters(): Cluster[] {
  return Object.entries(clusterMap())
    .filter(([, entries]) => entries.length > 0)
    .map(([base, entries]) => ({
      base,
      cluster: base.replace(/^\//, ""),
      label: CLUSTER_LABELS[base] ?? base.replace(/^\//, ""),
      entries,
      questions: entries.reduce((n, e) => n + e.faqs.length, 0),
    }));
}

function getCluster(cluster: string): Cluster | undefined {
  return populatedClusters().find((c) => c.cluster === cluster);
}

/**
 * The long title form where the label leaves room for it, the short form
 * where it does not. Computed rather than authored so a renamed hub label
 * can never push a title past the budget unnoticed.
 */
function indexTitle(label: string): string {
  const full = `${label}: Every Question Answered`;
  if (full.length <= TITLE_MAX) return full;
  return clampTitle(`${label} — Questions`, TITLE_MAX);
}

function indexDescription(label: string, questions: number): string {
  return clampDescription(
    `${questions} questions answered across the ${label} pages, each linking straight to its answer.`,
  );
}

function snippet(a: string): string {
  const t = a.trim().replace(/\s+/g, " ");
  if (t.length <= SNIPPET_MAX) return t;
  const cut = t.slice(0, SNIPPET_MAX);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > SNIPPET_MAX * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

export const dynamicParams = false;

type Params = { cluster: string };

export function generateStaticParams(): Params[] {
  return populatedClusters().map((c) => ({ cluster: c.cluster }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cluster } = await params;
  const c = getCluster(cluster);
  if (!c) return {};
  const canonical = `${QUESTIONS_PATH}/${c.cluster}`;
  const title = indexTitle(c.label);
  const description = indexDescription(c.label, c.questions);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      images: ["/opengraph-image"], type: "website", title, description, url: canonical },
  };
}

export default async function ClusterQuestionsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { cluster } = await params;
  const c = getCluster(cluster);
  if (!c) notFound();

  const path = `${QUESTIONS_PATH}/${c.cluster}`;
  const url = absoluteUrl(path);
  const title = indexTitle(c.label);
  const description = indexDescription(c.label, c.questions);

  // One flat list of every question in the cluster, in page order, each
  // already carrying the deep link it will be rendered and published with —
  // so the JSON-LD and the markup can never point at different anchors.
  const questions = c.entries.flatMap((e) =>
    e.faqs.map((f, i) => ({
      q: f.q,
      a: f.a,
      href: `${c.base}/${e.slug}#faq-${i + 1}`,
    })),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: questions.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: questions.map((q, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: q.q,
        url: absoluteUrl(q.href),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Questions", path: QUESTIONS_PATH },
            { name: c.label, path },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every question the {c.label} pages answer
        </h1>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The {c.entries.length} {c.label.toLowerCase()} pages answer {c.questions} named
          questions between them. Every one is listed below, and every link lands on the
          paragraph that answers it rather than the top of the page.
        </p>

        {c.entries.map((entry) => (
          <section key={entry.slug} className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              <Link href={`${c.base}/${entry.slug}`} className="hover:text-brand-600">
                {entry.h1}
              </Link>
            </h2>
            <ul className="mt-4 space-y-4">
              {entry.faqs.map((f, i) => (
                <li key={f.q}>
                  <Link
                    href={`${c.base}/${entry.slug}#faq-${i + 1}`}
                    className="font-medium text-brand-600 hover:text-brand-500"
                  >
                    {f.q}
                  </Link>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{snippet(f.a)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-14 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
          Back to the <Link href={c.base} className="text-brand-600 hover:text-brand-500">{c.label} hub</Link>, or
          see <Link href={QUESTIONS_PATH} className="text-brand-600 hover:text-brand-500">every question this site answers</Link>.
        </p>
      </div>
    </Container>
  );
}
