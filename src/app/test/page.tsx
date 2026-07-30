import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getTesting, releasedTesting, TEST_PATH } from "@/data/testing";

const UPDATED = "2026-07-27";

export const metadata: Metadata = {
  title: "Testing Health & Fitness Apps",
  description:
    "How to test HealthKit, Health Connect, wearable and camera integrations — what you can automate, what needs a device, and what you can only monitor.",
  alternates: { canonical: TEST_PATH },
  openGraph: {
    type: "website",
    title: "Testing Health & Fitness Apps",
    description:
      "The parts of a fitness app that resist testing: on-device health stores with no test double, background delivery you cannot trigger, and a camera the simulator does not have.",
    url: TEST_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "The health stores",
    blurb: "Two platforms, two completely different testing stories.",
    slugs: ["healthkit-integration", "health-connect-test-data", "mock-wearable-data", "background-sync"],
  },
  {
    title: "Third-party providers",
    blurb: "Testing against APIs you do not control and mostly cannot sandbox.",
    slugs: ["oauth-flows", "provider-sandboxes", "webhooks-locally", "rate-limits-and-outages"],
  },
  {
    title: "Camera and motion",
    blurb: "Proving a vision feature works without pointing a phone at a human every time.",
    slugs: ["camera-features-without-a-device", "pose-detection-accuracy", "rep-counting"],
  },
  {
    title: "Running the suite",
    blurb: "What runs in CI, what needs real hardware, and what you assert at the end.",
    slugs: ["device-lab-and-ci", "offline-sync", "data-deletion"],
  },
];

const FAQS = [
  {
    q: "Why is a fitness app harder to test than a normal CRUD app?",
    a: "Because three of its most important surfaces resist automation. The on-device health stores are concrete platform classes rather than injectable services — Apple ships no test double for HealthKit at all, and Google's testing library for Health Connect is an alpha that has not been updated in over a year and stubs aggregation rather than faking it. Background delivery cannot be triggered on demand, so you cannot assert it in CI. And the iOS Simulator has no camera, so any pose or rep-counting feature is untestable there without a frame-source abstraction you have to design in on day one.",
  },
  {
    q: "What should I actually automate, and what should I stop trying to automate?",
    a: "Automate everything downstream of a seam you control: put a protocol or interface in front of the platform store and unit-test your own reconciliation, dedupe, timezone and rollup logic against deliberately ugly fixtures. Automate provider integrations against recorded fixtures rather than live APIs. Do not try to automate background delivery, real camera capture, or a live third-party OAuth login — those get a small manual device pass and a production alert instead. The mistake is spending weeks building a flaky end-to-end harness for the parts that will never be reliable, while the reconciliation logic that actually corrupts user data has no tests at all.",
  },
  {
    q: "What makes good test data for a health app?",
    a: "Realistic ugliness. Clean synthetic data is why reconciliation bugs reach production: your fixtures should include overlapping intervals from two sources, a retro-edited sleep session, a day with a gap in the middle, a daylight-saving night that is 23 or 25 hours long, a device whose clock is a couple of minutes off, and a manually entered entry alongside an automatically recorded one. If your test corpus is a smooth sine wave of heart-rate samples, it proves your parser works and nothing else.",
  },
];

export default function TestPillar() {
  const url = absoluteUrl(TEST_PATH);
  const released = releasedTesting();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Testing Health & Fitness Apps",
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
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: released.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.h1,
      url: absoluteUrl(`${TEST_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Testing", path: TEST_PATH }]} />

        <ClusterHero label="Testing" seed={heroSeed(TEST_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Testing Health &amp; Fitness Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The standard testing advice runs out early here. No unit test can reach inside HealthKit,
          which ships no test double. No CI runner can make background delivery fire. No iOS Simulator
          has a camera. So the useful question is not &ldquo;how do I test my fitness app&rdquo; but
          &ldquo;where exactly does the ladder stop, and what do I do at each rung above it&rdquo; —
          which is what this hub answers, one impossibility at a time.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Three neighbouring clusters, kept deliberately distinct.{" "}
            <Link href="/fix">Troubleshooting</Link> is <em>it is broken right now</em>.{" "}
            <Link href="/architecture">Architecture</Link> is <em>a design that prevents a class of
            breakage</em>. This cluster is <em>the assertion that proves the design holds</em>. Each
            page opens with the test you are going to write, not with an error message.
          </p>
          <p>
            We also do not re-explain general-purpose testing. Record-and-replay libraries, mock
            servers, tunnels and the test pyramid are mature, well documented elsewhere, and we would
            add nothing. Every page here spends its words on the health-specific delta — the
            duplicated day, the mis-timezoned midnight, the missed rep, the sample that survived
            deletion.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getTesting(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${TEST_PATH}/${e!.slug}`}
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
          pitch="Test tooling for health platforms moves in jumps — an alpha library stalls, a simulator capability appears, a provider quietly adds or drops a sandbox. We track what changes for people testing this stack. Get the updates."
          source="pillar-inline"
          id="cta-test-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
