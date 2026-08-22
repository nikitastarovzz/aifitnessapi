import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import DataMatrix from "@/components/DataMatrix";
import { ROWS } from "@/data/matrix";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import PageSummary from "@/components/PageSummary";

const MATRIX_PATH = "/matrix";
const UPDATED = "2026-07-26";

export const metadata: Metadata = {
  title: { absolute: "HealthKit ↔ Health Connect Type Reference" },
  description:
    "Side-by-side Apple HealthKit and Android Health Connect type identifiers for heart rate, HRV, sleep, steps, SpO2, GPS, calories, and body composition.",
  alternates: { canonical: MATRIX_PATH },
  openGraph: {
    type: "website",
    title: "HealthKit ↔ Health Connect: The Data-Type Reference",
    description:
      "Every common health metric with its Apple HealthKit and Android Health Connect type identifier — plus the cross-platform gotchas, like SDNN vs RMSSD.",
    url: MATRIX_PATH,
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    q: "Can I map HealthKit HRV to Health Connect HRV?",
    a: "Not directly. Apple stores heart-rate variability as SDNN (HKQuantityTypeIdentifier.heartRateVariabilitySDNN) while Health Connect stores RMSSD (HeartRateVariabilityRmssdRecord). SDNN and RMSSD are different calculations over the interval series and are not interconvertible, so treating them as one normalized 'HRV' field will produce values that aren't comparable between your iOS and Android users. Store the platform and the measure alongside the number.",
  },
  {
    q: "Can I read HealthKit or Health Connect from my server?",
    a: "No. Both are on-device stores, not cloud APIs — there is no server endpoint to call. Your app reads them on the device with the user's permission and syncs to your backend itself. If you need server-to-server access to user health data, you need a cloud provider API or a health-data aggregator instead.",
  },
  {
    q: "Does a type existing mean the data will be there?",
    a: "No, and this trips up a lot of integrations. These types are containers — something still has to write to them. Blood oxygen needs a device that measures SpO2, body composition usually needs a smart scale or manual entry, and on iOS a denied read permission is indistinguishable from an empty result, because HealthKit deliberately doesn't tell your app that read access was refused. Always design for the empty case.",
  },
];

export default function MatrixPage() {
  const url = absoluteUrl(MATRIX_PATH);

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "HealthKit ↔ Health Connect Data-Type Reference",
    description: metadata.description,
    url,
    creator: orgRef(),
    publisher: orgRef(),
    datePublished: UPDATED,
    dateModified: UPDATED,
    isAccessibleForFree: true,
    variableMeasured: ROWS.map((r) => r.label),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Type Reference", path: MATRIX_PATH }]} />
        <ClusterHero label="Reference" seed={7} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          HealthKit &harr; Health Connect: The Data-Type Reference
        </h1>
        <PageSummary path="/matrix" name="HealthKit ↔ Health Connect type reference" updated={UPDATED} className="mt-4 text-lg text-[var(--muted)]">
          If you&rsquo;re building the same health feature on iOS and Android, you need the matching type
          on each platform — and to know where they quietly disagree. Here are {ROWS.length}{" "}
          common metrics side by side, checked against Apple&rsquo;s and Google&rsquo;s own docs.
        </PageSummary>
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
        <DataMatrix />
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <section className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>The three things that actually bite</h2>
          <p>
            <strong>HRV is not one metric.</strong> Apple gives you SDNN, Health Connect gives you RMSSD.
            They&rsquo;re computed differently and don&rsquo;t convert, so a single normalized
            &ldquo;hrv&rdquo; column in your database will silently mix two incompatible measures. Keep the
            platform and measure with the value — the <Link href="/data/hrv-api">HRV guide</Link> goes
            deeper.
          </p>
          <p>
            <strong>Neither store has a server API.</strong> Both are{" "}
            <Link href="/learn/on-device-vs-cloud-health-data">on-device</Link>, so there&rsquo;s no
            backend integration to write — your app reads locally and syncs. Teams routinely plan a
            server-to-server integration and discover this late.
          </p>
          <p>
            <strong>Permission and presence are different problems.</strong> On iOS you cannot tell
            whether a read was denied or simply had no data. On Android, read windows are capped, routes
            need their own permission, and from the June 2026 update on-device steps carry a per-device
            synthetic package name you must resolve at runtime rather than hardcode.
          </p>
          <h2>Where to go next</h2>
          <p>
            Setting one up? The <Link href="/integrate/healthkit">HealthKit</Link> and{" "}
            <Link href="/integrate/google-health-connect">Health Connect</Link> integration guides walk the
            wiring. Deciding between them — or whether you need both — is covered in{" "}
            <Link href="/fitness-apis/apple-healthkit-vs-google-health-connect">HealthKit vs Health Connect</Link>{" "}
            and, if you&rsquo;re adding a second platform,{" "}
            <Link href="/migrate/add-android-to-healthkit-app">adding Android to a HealthKit app</Link>.
            For what each metric means and whether it&rsquo;s measured or estimated, see{" "}
            <Link href="/data">health data by metric</Link>.
          </p>
          <h2>Why only these two platforms?</h2>
          <p>
            Because these are the rows we could verify. A reference table is only worth publishing if its
            cells are actually checked against primary sources, and every entry above comes from
            Apple&rsquo;s or Google&rsquo;s own documentation. We&rsquo;d rather ship a narrow table
            you can trust than a wide one padded with guesses. For cloud providers, the{" "}
            <Link href="/data">per-metric guides</Link> and{" "}
            <Link href="/compare">head-to-head comparisons</Link> cover what each one exposes.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
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
          pitch="Platform data types shift with every OS release — new records, deprecated values, changed permissions. We track the ones that break integrations. Get the heads-up."
          source="pillar-inline"
          id="cta-matrix"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free reference from {site.name}. Independent and not sponsored — please cite or link if you
          find it useful.
        </p>
      </div>
    </Container>
  );
}
