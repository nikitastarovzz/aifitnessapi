import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import DayBoundaryDemo from "@/components/DayBoundaryDemo";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import PageSummary from "@/components/PageSummary";

const PATH = "/day-boundaries";
const UPDATED = "2026-07-31";

export const metadata: Metadata = {
  title: { absolute: "Why “Today’s Steps” Is a Bug: A Live Demo" },
  description:
    "An interactive demo of the day-boundary bug in health apps: DST days aren't 24 hours, so a fixed UTC window silently drops or double-counts an hour.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Why “Today’s Steps” Is the Most Bug-Prone Number in a Fitness App",
    description:
      "Pick a timezone and a daylight-saving day and watch the civil day stop being 24 hours long — the bug that makes step counts and streaks wrong twice a year.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    q: "Why isn't a day always 24 hours?",
    a: "Because of daylight-saving transitions. On the day a zone springs forward, the clock skips an hour, so the civil day is 23 hours long; on the day it falls back, an hour repeats and the day is 25 hours. A daily total that assumes every day is a fixed 24-hour UTC window will include or drop an hour of a user's activity on exactly those two days a year, and the bug is invisible the rest of the time.",
  },
  {
    q: "How should I store a daily total so this doesn't happen?",
    a: "Store the instant (UTC) for each sample, the UTC offset in effect at that instant, and — where your product needs a per-day figure — the local civil date the sample belongs to. Compute 'today' against the user's local midnight, resolved through a real timezone database, not against a fixed UTC range. UTC alone loses the information you need to answer 'which day was this'; local time alone loses the ability to order events. You need both.",
  },
  {
    q: "Does this demo use data you collected about timezones?",
    a: "No. Everything on this page is computed in your browser from the platform's own IANA timezone database via the built-in Intl API. There are no timezone facts we hardcoded, so nothing here can be stale or wrong about a specific zone — your device is the source.",
  },
];

export default function DayBoundariesPage() {
  const url = absoluteUrl(PATH);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Day-Boundary Explorer",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: metadata.description,
    url,
    publisher: orgRef(),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Day Boundaries", path: PATH }]} />
        <ClusterHero label="Interactive" seed={11} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          &ldquo;Today&rsquo;s steps&rdquo; is the most bug-prone number in a fitness app
        </h1>

        <PageSummary path="/day-boundaries" name="Why “today’s steps” is a bug" updated={UPDATED} className="mt-6 text-lg text-[var(--muted)]">
          It looks trivial and it is not. A civil day is only usually 24 hours long, so any daily
          total computed over a fixed UTC window is quietly wrong on the two days a year a timezone
          shifts. Pick a zone and a daylight-saving day below and watch it happen — every number
          computed live in your browser from its own timezone database.
        </PageSummary>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <DayBoundaryDemo />
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>Why this bites health apps specifically</h2>
          <p>
            In most software a mislabelled day is cosmetic. In a fitness app it corrupts the numbers
            users check obsessively: a step count that drops an hour reads as the app losing their
            walk, a streak that spans a DST night breaks when it shouldn&rsquo;t, and a
            &ldquo;daily average&rdquo; computed over 23- and 25-hour days is subtly off forever. The
            user knows how far they walked; when your number disagrees, they trust the app less.
          </p>
          <p>
            The full storage model — instant plus offset plus civil date, and how to recompute a day
            that a late-arriving sample makes stale — is in{" "}
            <Link href="/architecture/timezones-and-day-boundaries">timezones and day boundaries</Link>.
            The broader &ldquo;samples are late-arriving, not append-only&rdquo; problem this is part
            of lives in <Link href="/architecture/incremental-sync">incremental sync</Link>, and{" "}
            <Link href="/test/mock-wearable-data">the test-data guide</Link> explains why a
            DST night belongs in your fixtures.
          </p>
        </div>

        <section className="mt-12">
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
          pitch="Date and timezone handling is one of a dozen quietly-wrong places in a health data pipeline. We write the ones that corrupt data instead of throwing errors. Get the deep dives."
          source="pillar-inline"
          id="cta-day-boundaries"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free interactive demo from {site.name}. Independent and not sponsored — link it if it
          helps you explain this to someone.
        </p>
      </div>
    </Container>
  );
}
