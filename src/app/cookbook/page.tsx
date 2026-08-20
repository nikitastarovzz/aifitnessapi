import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterHero from "@/components/ClusterHero";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getRecipe, releasedCookbook, COOKBOOK_PATH } from "@/data/cookbook";

const UPDATED = "2026-08-12";

export const metadata: Metadata = {
  title: "Fitness API Cookbook: Tested Reference Code",
  description:
    "Runnable, dependency-free reference implementations for the hard fitness-API patterns: token rotation, webhooks, DST-safe rollups, rep counting. CI-tested.",
  alternates: { canonical: COOKBOOK_PATH },
  openGraph: {
    type: "website",
    title: "Fitness API Cookbook: CI-Tested Reference Code",
    description:
      "Copy-paste-runnable implementations of the patterns our pages document — zero dependencies, node:test suites, tested in CI on every change.",
    url: COOKBOOK_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Auth & API clients",
    blurb: "The failure modes that break every user at once.",
    slugs: ["refresh-rotation", "rate-limit-fetcher"],
  },
  {
    title: "Data ingestion",
    blurb: "Webhooks and backfills that survive duplicates, reordering, and outages.",
    slugs: ["webhook-receiver", "backfill-checkpointer"],
  },
  {
    title: "Correctness & motion",
    blurb: "The rollup that survives DST, and the rep counter that earns its counts.",
    slugs: ["day-boundary-rollup", "rep-counter"],
  },
];

const FAQS = [
  {
    q: "How is the cookbook code tested?",
    a: "Every recipe ships with a node:test suite in the same directory, and a CI workflow runs the full suite on every change to the cookbook — the code you see on a recipe page is a byte-verbatim copy of the file that passed. Tests inject fakes for the clock, fetch, and storage, so they exercise the logic (races, rotations, retries, DST transitions) without any network or provider account.",
  },
  {
    q: "Can I use these recipes in a commercial product?",
    a: "Yes — the cookbook files are MIT-licensed, stated in each file's header. They are deliberately dependency-free and built around injected interfaces (store, fetch, clock), so adapting one usually means implementing a small store interface against your database and deleting the in-memory reference version. Attribution is appreciated, not required.",
  },
  {
    q: "Why does the cookbook avoid npm dependencies entirely?",
    a: "Because reference code you can read end-to-end in one file is worth more than a cleverer implementation you cannot audit. Zero dependencies means no supply-chain surface, no version drift against your stack, and no framework assumptions — every recipe is plain modern JavaScript on Node 20+, portable into TypeScript or another runtime by hand without untangling a dependency tree.",
  },
];

export default function CookbookPillar() {
  const url = absoluteUrl(COOKBOOK_PATH);
  const released = releasedCookbook();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness API Cookbook: CI-Tested Reference Code",
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/cookbook" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Cookbook", path: COOKBOOK_PATH }]} />

        <ClusterHero label="Cookbook" seed={heroSeed(COOKBOOK_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          The Fitness API Cookbook
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Runnable reference implementations of the patterns the rest of this site documents in prose:
          rotation-safe token refresh, webhook ingestion that survives duplicates and reordering, and
          rate-limit handling that degrades instead of hammering. Every recipe is dependency-free
          JavaScript with an injected clock, fetch, and store, ships with a node:test suite, and runs
          in CI on every change — the code on each page is a byte-verbatim copy of the file that
          passed. Read the theory on the linked pages; take the working version from here.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            The theory lives in <Link href="/fix">Troubleshooting</Link>,{" "}
            <Link href="/architecture">Architecture</Link>, and <Link href="/test">Testing</Link> —
            each recipe links its source pages. MIT-licensed; adapt freely.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getRecipe(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${COOKBOOK_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="New recipes land as the patterns pages grow. Subscribe and get the next one — with its test suite — before you need it in production."
          source="pillar-inline"
          id="cta-cookbook"
        />
      </div>
    </Container>
  );
}
