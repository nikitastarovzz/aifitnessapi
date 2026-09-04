import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import IdentifierTranslator, {
  type AppleName,
  type TRow,
} from "@/components/tools/IdentifierTranslator";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * HealthKit identifier ↔ Health Connect record, both directions.
 *
 * The valuable part of this tool is what it refuses to answer. Name-shaped
 * translation is exactly where cross-platform health code goes wrong —
 * heartRateVariabilitySDNN "translates" to HeartRateVariabilityRmssdRecord
 * only if you ignore that SDNN and RMSSD are different measurements — so the
 * only source is matrix.ts, which holds the metrics confirmed against both
 * vendors' documentation. Everything else returns the honest gap.
 */

const PATH = "/tools/identifier-translator";
const TITLE = "Translate HealthKit to Health Connect";
const DESCRIPTION =
  "Look up the Health Connect record for a HealthKit identifier, or the reverse. Verified pairs only — where nothing was checked, the tool says so.";

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
      "Two-way lookup between Apple HealthKit type identifiers and Android Health Connect record types, restricted to pairs verified against both vendors' docs.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const ROWS: TRow[] = MATRIX_ROWS.map((r) => ({
  id: r.id,
  label: r.label,
  href: r.href,
  apple: r.apple,
  android: r.android,
  watchOut: r.watchOut ?? null,
}));

const APPLE_NAMES: AppleName[] = HK_IDENTIFIERS.map((r) => ({ c: r.case, f: r.family }));

/** Same parse as src/components/AppStack.tsx, for the count in the prose. */
const MAPPED = new Set<string>();
for (const row of MATRIX_ROWS) {
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    MAPPED.add(m[1].toLowerCase());
  }
}
const COVERED = APPLE_NAMES.filter((n) => MAPPED.has(n.c.toLowerCase())).length;

export default function IdentifierTranslatorPage() {
  const url = absoluteUrl(PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: TITLE,
    description: DESCRIPTION,
    url,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: orgRef(),
    publisher: orgRef(),
    dateModified: HK_FETCHED_ON,
    lastReviewed: HK_FETCHED_ON,
    reviewedBy: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Identifier translator", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={2} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Apple type, Android record
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Type an Apple HealthKit identifier and get the Health Connect record type, or type a record
          name and get the Apple side. The Apple identifiers come from the{" "}
          {APPLE_NAMES.length}-type dataset read from Apple&rsquo;s documentation on {HK_FETCHED_ON};
          the pairings come only from this site&rsquo;s verified matrix, which covers {COVERED} of
          those {APPLE_NAMES.length} identifiers across {ROWS.length} metrics. For anything outside
          that set the tool reports no verified counterpart rather than inventing a record name —
          the mistake that turns Apple&rsquo;s SDNN into Android&rsquo;s RMSSD.
        </p>

        <section data-tool="identifier-translator" aria-label="HealthKit to Health Connect translator">
          <IdentifierTranslator rows={ROWS} appleNames={APPLE_NAMES} />
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side from this site&rsquo;s published dataset — no lookup
              service, no network call. Two sources feed it. The Apple identifier list is generated
              from Apple&rsquo;s own documentation, last read {HK_FETCHED_ON}. The cross-platform
              pairs are the {ROWS.length} rows of the HealthKit ↔ Health Connect matrix, each one
              confirmed against both Apple&rsquo;s and Google&rsquo;s developer documentation, with
              the per-row source recorded in the dataset.
            </p>
            <p>
              That matrix is deliberately small. A wider table would have to include pairs nobody
              checked, and a reference is only worth publishing if its cells are verified — so an
              identifier outside it returns the gap, with a link to the Android record list so you
              can check it yourself. Both datasets are downloadable —{" "}
              <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
                open datasets, CC BY 4.0
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. The full table is the{" "}
          <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
            HealthKit ↔ Health Connect type reference
          </Link>
          ; the Android side is at{" "}
          <Link
            href="/health-connect-records"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            every Health Connect record type
          </Link>
          . More at{" "}
          <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
