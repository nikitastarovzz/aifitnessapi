import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { GATES, GATE_AREAS } from "@/data/gates";

/**
 * The QA suite, published. Every other page on this site asks a reader to
 * trust its facts; this one shows the mechanism that stops the obvious ways
 * of getting them wrong, including the ways it has caught us.
 *
 * The honest framing matters more than the list: a gate is a check on FORM,
 * not on truth. A fabricated statistic in a well-formed sentence passes all
 * of these, which is why the page closes by pointing at /methodology rather
 * than letting the table imply more than it proves.
 *
 * The list itself lives in src/data/gates.ts and is asserted against
 * scripts/qa.mjs in both directions, so this page cannot quietly overstate
 * or understate what the build actually refuses.
 */
const PAGE_PATH = "/gates";
const UPDATED = "2026-09-04";
const TITLE = "What This Site Refuses to Ship";
const DESCRIPTION =
  "The build runs automated refusals before anything deploys — broken anchors, thin pages, undisclosed first-party links. Every one of them, listed.";

export const metadata: Metadata = {
  // "The Gates: What This Site Refuses to Ship" overflows the 45-char budget
  // the " · AIFitnessAPI" suffix leaves, so this page carries its own title
  // absolutely and renders without the suffix.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    images: ["/opengraph-image"],
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_PATH,
  },
};

export default function GatesPage() {
  const url = absoluteUrl(PAGE_PATH);

  // Areas in declared order, empty ones dropped so a regrouping in the data
  // never leaves a headed section with nothing under it.
  const grouped = GATE_AREAS.map((area) => ({
    area,
    rows: GATES.filter((g) => g.area === area),
  })).filter((g) => g.rows.length > 0);

  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: UPDATED,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: GATES.length,
      itemListElement: GATES.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.code,
        description: g.refuses,
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
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Gates", path: PAGE_PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          The gates: what this site refuses to ship
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Updated {UPDATED}</p>

        <p id="answer" className="mt-6 text-lg text-[var(--muted)]">
          Before any change to this site is committed, the build runs{" "}
          <strong className="font-semibold text-[var(--fg)]">{GATES.length} automated refusals</strong>{" "}
          over the rendered output. Each one names a specific way a page can be wrong — a link to
          nothing, a title that will be truncated, a dataset whose CSV disagrees with its JSON, a
          link to the company that funds this site with no disclosure beside it. A failed gate is
          not a warning: the suite exits non-zero and the site does not deploy until the underlying
          problem is fixed. Weakening a gate to make a change pass is not allowed, which is the
          only reason a list like this is worth publishing.
        </p>
        <p className="mt-4 text-[var(--muted)]">
          The gates are one half of how this site is checked. The other half —
          primary sources, adversarial review, and what happens when we cannot verify something —
          is in{" "}
          <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
            methodology
          </Link>
          . When something gets through anyway, it goes in{" "}
          <Link href="/corrections" className="font-medium text-brand-600 hover:text-brand-500">
            corrections
          </Link>
          , alongside the errors these gates caught before publish.
        </p>

        <div data-gates-table className="mt-12 space-y-12">
          {grouped.map(({ area, rows }) => (
            <section key={area}>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {area}{" "}
                <span className="text-base font-normal text-[var(--muted)]">({rows.length})</span>
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th scope="col" className="py-2 pr-4 align-bottom font-semibold text-[var(--fg)]">
                        Code
                      </th>
                      <th scope="col" className="py-2 align-bottom font-semibold text-[var(--fg)]">
                        What the build refuses to ship
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((g) => (
                      <tr key={g.code} className="border-b border-[var(--border)] align-top">
                        <th
                          scope="row"
                          className="whitespace-nowrap py-3 pr-4 text-left font-normal"
                        >
                          <code className="font-mono text-xs text-[var(--fg)]">{g.code}</code>
                        </th>
                        <td className="py-3 text-[var(--muted)]">{g.refuses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-[var(--border)] p-6">
          <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">
            What the gates cannot do
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Every check above tests form, not truth. A rate limit copied wrong from a vendor page,
            a benchmark recalled from memory, a deprecation date off by a quarter — each of those
            is a well-formed sentence on a well-formed page, and it would pass all{" "}
            {GATES.length} of these gates without a murmur. Nothing automated catches a claim that
            is simply false. That is what the verification rules in{" "}
            <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
              methodology
            </Link>{" "}
            are for: primary sources fetched at write time, unverifiable claims marked rather than
            filled in, and dated review stamps you can hold us to. The gates make the mechanical
            failures impossible. They do not make us right.
          </p>
        </section>
      </div>
    </Container>
  );
}
