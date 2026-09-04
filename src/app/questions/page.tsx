import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { clampDescription } from "@/lib/cluster";
import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";

/**
 * The index of the indexes — /questions.
 *
 * One card per populated cluster, each linking to that cluster's question
 * list. Everything here is counted from clusterMap() at build time: the
 * number of clusters, the number of questions in each, and the site total.
 * A hardcoded total would be wrong the first time anyone adds an FAQ, and
 * wrong silently, which is the worst way for a number on a page to be wrong.
 */

const PATH = "/questions";

const TITLE = "Every Question This Site Answers";

type ClusterCard = { path: string; label: string; pages: number; questions: number };

/** Populated clusters, in registry order, with their question counts. */
function cards(): ClusterCard[] {
  return Object.entries(clusterMap())
    .filter(([, entries]) => entries.length > 0)
    .map(([base, entries]) => ({
      path: `${PATH}/${base.replace(/^\//, "")}`,
      label: CLUSTER_LABELS[base] ?? base.replace(/^\//, ""),
      pages: entries.length,
      questions: entries.reduce((n, e) => n + e.faqs.length, 0),
    }));
}

const CARDS = cards();
const TOTAL_QUESTIONS = CARDS.reduce((n, c) => n + c.questions, 0);
const TOTAL_PAGES = CARDS.reduce((n, c) => n + c.pages, 0);

const DESCRIPTION = clampDescription(
  `${TOTAL_QUESTIONS} named questions answered across ${TOTAL_PAGES} pages, grouped into ${CARDS.length} topics — each one a link straight to its answer.`,
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
      images: ["/opengraph-image"], type: "website", title: TITLE, description: DESCRIPTION, url: PATH },
};

export default function QuestionsHub() {
  const url = absoluteUrl(PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: CARDS.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: CARDS.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.label}: ${c.questions} questions`,
        url: absoluteUrl(c.path),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Questions", path: PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every question this site answers
        </h1>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The {TOTAL_PAGES} reference pages here answer {TOTAL_QUESTIONS} named questions
          between them, and each answer has its own address. Pick a topic to see its
          questions listed in full — every link lands on the paragraph that answers it,
          not the top of the page.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map((c) => (
            <li key={c.path}>
              <Link
                href={c.path}
                className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="font-semibold text-[var(--fg)]">{c.label}</span>
                <span className="mt-2 text-sm text-[var(--muted)]">
                  {c.questions} questions across {c.pages} pages
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-[var(--muted)]">
          Looking for one specific thing? <Link href="/search" className="text-brand-600 hover:text-brand-500">Search</Link>{" "}
          covers the same questions by keyword, and{" "}
          <Link href="/site-index" className="text-brand-600 hover:text-brand-500">the site index</Link>{" "}
          lists every page.
        </p>
      </div>
    </Container>
  );
}
