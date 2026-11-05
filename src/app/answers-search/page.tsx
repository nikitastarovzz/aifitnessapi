import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import AnswerSearch from "@/components/tools/AnswerSearch";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { answerSearchSections } from "@/lib/answerSearchSections";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * /answers-search — full-text search over every answer this site publishes
 * (ops/AUDIENCE-30-2026-11-05.md item 25).
 *
 * The page ships the list of sections and their sizes and nothing else. The
 * answer files load when the reader first searches, from the same static
 * /answers/<section>.json files agents read, and are indexed and ranked in
 * the tab (src/lib/answerSearch.mjs). No server code runs per query.
 */

const PATH = "/answers-search";
const UPDATED = "2026-11-05";
// Within 45 characters: the layout appends the site suffix.
const TITLE = "Full-Text Answer Search (In Your Browser)";
const DESCRIPTION =
  "Search the full text of every answer, FAQ and tracked change on this site, ranked in your browser. Results deep-link to the exact answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description: "Every answer capsule and FAQ answer on AIFitnessAPI, searchable in full, with links to the exact answer.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function AnswersSearchPage() {
  const { sections, totalDocs } = answerSearchSections();
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "search the full text of every answer on AIFitnessAPI",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Answer search", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={13} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">Answer search</h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          This searches the whole text of the {totalDocs.toLocaleString("en-US")}{" "}answer capsules, FAQ answers, blog-post
          answers and tracked changes in this site&rsquo;s per-section answer files, in your browser. Nothing loads until
          you search: then the sections you have ticked are fetched from /answers/&lt;section&gt;.json, indexed in the
          tab and ranked, and each result links to the exact answer, down to its #faq-N anchor. The page shows how many
          bytes it fetched. Your query is not sent anywhere.
        </p>

        <section data-tool="answers-search" aria-label="Answer search">
          <AnswerSearch sections={sections} origin={site.url} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How this differs from the site search</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            <Link href="/search" className={linkCls}>
              The site search
            </Link>{" "}
            and the ⌘K palette use one small index of every page and every FAQ question, with the first 180 characters
            of each answer, and it first looks for results containing every word you type, falling back to a looser
            typo match only when none do. That is the right tool for finding a page by name.
            This page reads the answers themselves, all of every one, and ranks by how rare and how frequent your words
            are in each (BM25, with questions and titles weighted three times the answer text), so a word that only
            appears deep inside an answer still finds it, and a result can match most of your words rather than all of
            them. The last word also matches as a prefix while you type, and an identifier such as stepCount also
            matches its spelled-out words.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it loads</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            By default, the guide and comparison sections, the blog and the changes tracker; the generated references
            (one page per Health Connect record, HealthKit identifier, Wear OS data type, Google Health API type and
            library) are larger and can be ticked under Sections to search. The size shown beside each section is the
            file as served before compression. The individually citable facts and the start-here summary in{" "}
            <a href="/answers/index.json" className={linkCls}>
              the answer files
            </a>{" "}
            hold no prose of their own and are not searched. The files are rebuilt with the site, so results are as
            current as the pages.
          </p>
        </section>

        <ToolNextStep path={PATH} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
