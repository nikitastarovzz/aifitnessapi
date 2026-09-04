import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import PermissionBuilder, { type PermOption } from "@/components/tools/PermissionBuilder";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_READONLY } from "@/data/healthkitWritability";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * HealthKit permission builder.
 *
 * The page is a thin server shell: it joins three verified datasets into the
 * option list the client tool needs, so the 240-identifier corpus never ships
 * to the browser and the tool cannot state anything the reference pages do
 * not.
 *
 *   healthkitIdentifiers.ts  — the identifiers themselves, read from Apple.
 *   healthkitWritability.ts  — the 14 types Apple documents as read-only,
 *                              carrying the sentence that says so.
 *   matrix.ts                — Health Connect record names, but only for
 *                              metrics confirmed against both platforms.
 *
 * No Android permission string and no Kotlin appears anywhere on this page:
 * this site has verified record names and nothing beyond them.
 */

const PATH = "/tools/permission-builder";
const UPDATED = "2026-09-04";
const TITLE = "HealthKit Permission Builder";
const DESCRIPTION =
  "Pick the HealthKit types your app touches: get the Info.plist keys, the toShare/toRead Swift, and Health Connect record names. Read-only types flagged.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const ANSWER =
  "Pick the HealthKit identifiers your app reads or writes and this returns three things: the Info.plist usage-description keys you actually need, the toShare and toRead sets for requestAuthorization(toShare:read:), and the Health Connect record names for the types verified on both platforms. It refuses to put a type in a write set when Apple's own documentation says the samples are read-only, and it shows you Apple's sentence rather than asking you to take its word for it. Everything runs in your browser.";

/** Health Connect record names, keyed by HealthKit case — matrix rows only. */
const androidFor = new Map<string, string>();
for (const row of MATRIX_ROWS) {
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    androidFor.set(m[1], row.android);
  }
}

const readOnlyEvidenceFor = new Map(HK_READONLY.map((r) => [r.case, r.evidence]));

const OPTIONS: PermOption[] = HK_IDENTIFIERS.map((r) => ({
  case: r.case,
  family: r.family,
  group: r.group,
  abstract: r.abstract,
  readOnlyEvidence: readOnlyEvidenceFor.get(r.case) ?? null,
  android: androidFor.get(r.case) ?? null,
}));

export default function PermissionBuilderPage() {
  const url = absoluteUrl(PATH);
  const pageId = `${url}#webpage`;

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: TITLE,
        alternativeHeadline: "healthkit permission request generator",
        description: DESCRIPTION,
        datePublished: UPDATED,
        dateModified: UPDATED,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "HealthKit",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: TITLE,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: UPDATED,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/opengraph-image` },
      },
    ],
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: TITLE, path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {OPTIONS.length} identifiers and {HK_READONLY.length} documented read-only types · read
          from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </p>

        <section data-tool="permission-builder" aria-label="HealthKit permission builder" className="mt-10">
          <PermissionBuilder options={OPTIONS} />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The caveat that outlives this page
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Generating a correct authorization call is the easy half. The half that breaks products
            is what happens afterwards:{" "}
            <strong className="text-[var(--fg)]">
              HealthKit does not tell you whether the user granted or denied read access.
            </strong>{" "}
            That is deliberate — reporting it would leak whether a person has health data at all.{" "}
            <code className="font-mono text-sm">authorizationStatus(for:)</code> reliably reflects
            only write and share status; for read types it typically returns{" "}
            <code className="font-mono text-sm">.notDetermined</code> even after a grant.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            So <code className="font-mono text-sm">requestAuthorization</code> succeeding means the
            sheet was shown, not that read was granted. Never gate your UI on read-authorization
            status. Run the query and treat an empty result as{" "}
            <em>no data or no permission</em> — the two are indistinguishable, by design. Design the
            empty state before the happy path.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                How to integrate Apple HealthKit &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — the guide these snippets follow, step by step.
              </span>
            </li>
            <li>
              <Link
                href="/blog/healthkit-error-that-never-fires"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                The HealthKit error that never fires &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — why an empty read is not a denial, and what to build instead.
              </span>
            </li>
          </ul>
        </section>

        <details className="mt-12 rounded-xl border border-[var(--border)] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
            Where this output comes from, and where it runs
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything on this page runs client-side. Your selection never leaves the browser:
              there is no request to a server, nothing is stored, and no health data is involved at
              any point — you are picking type <em>names</em>, not data.
            </p>
            <p>
              The identifier list is Apple&rsquo;s own, parsed from their developer documentation on{" "}
              {HK_FETCHED_ON} and published in full at{" "}
              <Link
                href="/healthkit-identifiers"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                every HealthKit type identifier
              </Link>
              . The {HK_READONLY.length} read-only flags come from the same corpus, each carrying
              the Apple sentence it was derived from; an identifier absent from that list is{" "}
              <em>unknown</em>, not writable, because Apple states writability in prose and silence
              is not a statement.
            </p>
            <p>
              Android record names come only from the{" "}
              <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
                cross-platform matrix
              </Link>
              , which is restricted to metrics confirmed against both platforms&rsquo;
              documentation. Where a type has no matrix row, the tool says so rather than guessing a
              record name. Permission string format and client code for Health Connect are not
              published here because this site has not verified them.
            </p>
            <p>
              Swift symbols are emitted only where the{" "}
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                integration guide
              </Link>{" "}
              establishes them. <code className="font-mono">HKQuantityType(.case)</code> is the iOS
              16+ initializer; the category and characteristic initializers are not established
              here, so the generator names those picks in a comment instead of inventing a
              constructor. Verify every signature against Apple&rsquo;s current documentation
              before you ship.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Data read from Apple&rsquo;s published documentation on{" "}
          {HK_FETCHED_ON}; the machine-readable export is on{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            datasets
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
