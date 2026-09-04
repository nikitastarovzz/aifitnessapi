import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import ApiCompare, { type CompareItem } from "@/components/ApiCompare";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { API_ENTRIES, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/apis";
import { pageCount } from "@/lib/apiCoverage";

const PATH = "/compare-apis";
const UPDATED = "2026-08-22";

/**
 * Static metadata on purpose. The tool carries its selection in the query
 * string (?a=…&b=…) so a comparison can be linked, and every one of those
 * states is the SAME page: one canonical, /compare-apis, with no parameters.
 *
 * Do not turn this into a generateMetadata over searchParams. Per-pair titles
 * would mint 276 self-canonicalising addresses out of four fields each, which
 * is the thin-content page set this tool exists to avoid — and reading
 * searchParams here would also drop the route's prerendered HTML, which the
 * QA gate audits for canonical, phantom links and inbound links.
 */
export const metadata: Metadata = {
  title: { absolute: "Compare two fitness APIs side by side" },
  description:
    "Put any two fitness or health APIs side by side: how each bills developers, what your users must own, and what approval stands between you and launch.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Compare two fitness APIs side by side",
    description:
      "Access structure, user-side cost and approval gates for any two products in the directory — verified fields only, no verdict.",
    url: PATH,
  },
};

const EFFORT: Record<string, string> = {
  low: "Low — days",
  medium: "Medium — weeks",
  high: "High — months",
};

export default function CompareApisPage() {
  const url = absoluteUrl(PATH);
  const items: CompareItem[] = API_ENTRIES.map((a) => ({
    id: a.id,
    label: a.label,
    short: a.short,
    category: CATEGORY_LABELS[a.category],
    devCost: DEV_COST_LABELS[a.devCost],
    userSideCost: a.userSideCost,
    approvalGate: a.approvalGate,
    effort: EFFORT[a.engEffort] ?? a.engEffort,
    pages: pageCount(a.id),
    sourceHref: a.sourceHref,
  }));

  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Compare two fitness APIs side by side",
    description: String(metadata.description),
    isPartOf: { "@id": WEBSITE_ID },
    lastReviewed: UPDATED,
    reviewedBy: orgRef(),
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "API directory", path: "/apis" },
            { name: "Compare", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          Compare two APIs
        </h1>

        <AnswerCapsule>
          Pick any two of the {items.length} products in the directory and see the four things
          that decide a schedule: how each bills developers, what every end user has to own or
          pay for, what approval stands between you and launch, and roughly how much
          integration work it is. There is no score and no winner — these fields describe how
          you get access, not which product is better, and arithmetic over &ldquo;has an
          approval gate&rdquo; would be a judgement wearing a number.
        </AnswerCapsule>

        <div className="mt-10">
          <ApiCompare items={items} />
        </div>

        <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            For an argued comparison rather than a field table — where each one wins, where it
            loses, and what we could not verify about either — see the written head-to-heads
            in <Link href="/compare">comparisons</Link>. For what a whole stack costs,{" "}
            <Link href="/cost-planner">the cost planner</Link> models the same fields at your
            user count. For which one to start with at all, try{" "}
            <Link href="/picker">the picker</Link>.
          </p>
        </div>
      </div>
    </Container>
  );
}
