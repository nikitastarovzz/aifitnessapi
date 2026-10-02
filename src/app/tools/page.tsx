import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ALL_TOOLS, TOOL_LOOKUPS, TOOL_PLANNERS, type Tool } from "@/lib/toolRegistry";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * The tools hub.
 *
 * Everything listed here answers a question with a lookup rather than an
 * essay, and every one of them runs in the browser off this site's published
 * datasets — no accounts, no uploads, no server round trip. That is the whole
 * organising idea, and it is also the reason these belong on one page: a
 * reader who found one of them by searching an error string should be able to
 * see the other nine.
 *
 * The blurbs for the planners and demos are the same sentences the site
 * search index uses for them, so a tool is described identically wherever it
 * is mentioned.
 */

const PATH = "/tools";
const TITLE = "Free Tools for Health-App Builders";
const DESCRIPTION =
  "Ten free tools for HealthKit and Health Connect work: error lookup, aggregation checker, identifier translator, permission and query builders.";

export const metadata: Metadata = {
  // Plain, not `absolute` — the layout template appends the site suffix and
  // every title here is inside 45 characters for exactly that.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Lookups, builders and planners for health-app developers — each one running client-side off this site's verified HealthKit and Health Connect datasets.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <li className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-brand-400">
      <h3 className="text-base font-bold tracking-tight text-[var(--fg)]">
        <Link href={tool.path} className="hover:text-brand-600">
          {tool.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{tool.blurb}</p>
      <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">{tool.path}</p>
    </li>
  );
}

export default function ToolsHubPage() {
  const url = absoluteUrl(PATH);

  // CollectionPage + ItemList, hand-rolled rather than via hubGraph(): these
  // are tools, not cluster spokes, and there is no markdown mirror to declare.
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
    lastReviewed: HK_FETCHED_ON,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ALL_TOOLS.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: ALL_TOOLS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        description: t.blurb,
        url: absoluteUrl(t.path),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Tools", path: PATH }]} />
        <ClusterHero label="Free Tools" seed={6} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Free tools for health-app builders
        </h1>

        <p id="answer" className="speakable mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {ALL_TOOLS.length} tools that answer a question with a lookup instead of an essay. Every
          one runs in your browser off this site&rsquo;s published datasets — the HealthKit
          identifier set read from Apple&rsquo;s documentation on {HK_FETCHED_ON}, the HealthKit ↔
          Health Connect matrix verified against both vendors, and the API directory. No account, no
          upload, no server round trip, and nothing invented where the source is silent.
        </p>

        <section data-tool="hub" aria-label="Free developer tools">
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Lookups and generators
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Built on the HealthKit identifier dataset and the verified cross-platform matrix.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {TOOL_LOOKUPS.map((t) => (
              <ToolCard key={t.path} tool={t} />
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Planners and demos
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Decision support for picking a stack, and one demo of the bug that costs the most
            debugging time.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {TOOL_PLANNERS.map((t) => (
              <ToolCard key={t.path} tool={t} />
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What these tools will not do
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            None of them will fill a gap in the source to look more complete. Where Apple&rsquo;s
            wording does not state a type&rsquo;s aggregation style, the checker says{" "}
            <em>not stated</em>. Where no cross-platform pair has been verified against both
            vendors&rsquo; documentation, the translator says there is no verified counterpart rather
            than transliterating a name. Where a pasted error matches nothing, the diagnoser says so
            and links the full reference. A tool that always returns an answer is a tool that
            sometimes returns a wrong one.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The datasets underneath are published under CC BY 4.0, so you can check any answer
            yourself or build your own lookup on top —{" "}
            <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
              open datasets
            </Link>
            .
          </p>
        </section>

        <ClusterCta
          pitch="These tools are only as current as the datasets under them, and we re-read Apple's and Google's documentation on a schedule — get the note when something in them changes."
          source="pillar-inline"
          id="cta-tools-hub"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Free tools from {site.name}. The references behind them:{" "}
          <Link
            href="/healthkit-identifiers"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            every HealthKit type identifier
          </Link>
          ,{" "}
          <Link href="/healthkit-errors" className="font-medium text-brand-600 hover:text-brand-500">
            every HealthKit error code
          </Link>
          , and the{" "}
          <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
            HealthKit ↔ Health Connect matrix
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
