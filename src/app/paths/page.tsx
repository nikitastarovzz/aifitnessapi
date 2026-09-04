import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import PathProgress from "@/components/PathProgress";
import { READING_PATHS } from "@/data/readingPaths";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Reading paths.
 *
 * Every other index on this site is organised by kind of page. That serves
 * the reader who arrived from a search for one error string and fails the
 * reader who has been handed a job and does not yet know which four sections
 * it touches. These are the second reader's routes: one task each, the pages
 * in working order, and a sentence per step saying why it comes here.
 *
 * The step lists live in src/data/readingPaths.ts and point only at released
 * pages. Progress is a browser-local tick per step (see PathProgress) — there
 * is no account, and the page is complete without it.
 */

const PATH = "/paths";
const TITLE = "Reading paths";
const DESCRIPTION =
  "Four ordered routes through this site: ship a HealthKit read, support every wearable, add camera coaching, or get off Google Fit — with a why per step.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    images: ["/opengraph-image"],
    type: "website",
    title: "Reading paths: four routes through the site",
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function PathsPage() {
  const url = absoluteUrl(PATH);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Reading paths",
    description: DESCRIPTION,
    url,
    itemListElement: READING_PATHS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${url}#${p.slug}`,
    })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Reading paths",
    description: DESCRIPTION,
    url,
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Reading paths", path: PATH }]} />

        <ClusterHero label="Reading paths" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Reading paths
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The rest of the site is filed by kind of page — integration guide,
          fix, concept, architecture note. These four routes are filed by job
          instead: the pages one task needs, in the order the work lands, with
          a line on each saying why it comes there rather than later.
        </div>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Tick steps as you go if it helps. Progress is stored in this browser
          only — no account, nothing sent anywhere, and it will not follow you
          to another device. Prefer to browse everything instead? The{" "}
          <Link href="/site-index" className="text-brand-600 hover:text-brand-500">
            site index
          </Link>{" "}
          lists every page.
        </p>

        <div className="mt-12 space-y-16">
          {READING_PATHS.map((p) => (
            <section key={p.slug} id={p.slug} className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{p.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{p.blurb}</p>
              <PathProgress slug={p.slug} steps={p.steps} />
            </section>
          ))}
        </div>

        <p className="mt-16 text-sm text-[var(--muted)]">
          A path you wanted and did not find is a content request —{" "}
          <Link href="/signup" className="text-brand-600 hover:text-brand-500">
            tell us what you are building
          </Link>{" "}
          and it may become the fifth.
        </p>
      </div>
    </Container>
  );
}
