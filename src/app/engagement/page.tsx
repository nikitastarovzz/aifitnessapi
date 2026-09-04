import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getEngagement, releasedEngagement, ENGAGEMENT_PATH, ENGAGEMENT_CONFIG } from "@/data/engagement";

const UPDATED = "2026-08-22";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedEngagement().reduce((n, e) => n + e.faqs.length, 0);

export const metadata: Metadata = {
  title: "Fitness App Engagement & Retention",
  description:
    "Notifications, Live Activities, widgets, streaks and leaderboards for fitness apps — the platform surfaces, the SDK categories, and how to measure lift.",
  alternates: { canonical: ENGAGEMENT_PATH },
  openGraph: {
    type: "website",
    title: "Fitness App Engagement & Retention",
    description:
      "The layer after the integration works: whether anyone comes back. Platform engagement surfaces, streaks and leaderboards, and honest measurement.",
    url: ENGAGEMENT_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "The surfaces the platforms already give you",
    blurb: "Free, first-party, and usually under-used before anyone buys an engagement SDK.",
    slugs: [
      "push-notifications-fitness-app",
      "live-activities-workout-tracking",
      "widgets-and-complications",
      "wear-os-ongoing-activity",
    ],
  },
  {
    title: "Mechanics, and the SDKs that ship them",
    blurb: "Streaks, leaderboards, social and camera coaching — what each is, and what it costs you to run.",
    slugs: [
      "engagement-sdks-compared",
      "streaks-and-habit-loops",
      "leaderboards-and-challenges",
      "social-features-fitness-app",
      "gamification-in-fitness-apps",
      "camera-coaching-engagement",
    ],
  },
  {
    title: "Proving it worked",
    blurb: "The part that separates a real retention gain from a launch-week bump.",
    slugs: [
      "measuring-retention-fitness-app",
      "ab-testing-engagement-features",
      "engagement-metrics-that-matter",
      "notification-fatigue-and-optout",
    ],
  },
];

const FAQS = [
  {
    q: "Which fitness SDK drives the most user engagement?",
    a: "Nobody can answer that from public data, and this cluster will not pretend otherwise. There is no independent dataset ranking fitness or engagement SDKs by retention lift, and the numbers vendors publish are marketing claims measured on their own customers' apps, not on yours. What is knowable: what each category of SDK actually does, what the platforms give you free before you buy anything, and how to measure a feature's effect in your own app with a holdout. A vendor that quotes you a retention figure without describing the control group is quoting a number nobody could reproduce.",
  },
  {
    q: "What should a fitness app build before buying an engagement platform?",
    a: "The first-party surfaces, because they are free and they are where a fitness app is unusually well served. A workout is a long-running event, which is exactly what Live Activities and Wear OS Ongoing Activity exist for. Progress is glanceable, which is what widgets and watch complications are for. And a notification permission you have already spent is worth more than one you ask for later — on Android 13 and higher notifications are off by default for new installs, and iOS lets you start provisionally in Notification Center without an interrupting prompt. Most teams reach for a messaging platform before they have used any of that.",
  },
  {
    q: "Why does this cluster contain no engagement statistics?",
    a: "Because we could not verify any, and inventing plausible ones would be worse than leaving the gap visible. Engagement figures are the most-quoted and least-sourced numbers in app development: they travel without their methodology, they describe someone else's users, and they are almost never accompanied by the holdout that would make them a measurement rather than an anecdote. The pages here document mechanisms from Apple's and Google's own documentation, mark the parts we could not verify, and teach the experiment that would give you a number about your own app.",
  },
];

export default function EngagementPillar() {
  const url = absoluteUrl(ENGAGEMENT_PATH);
  const released = releasedEngagement();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness App Engagement & Retention",
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
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/engagement" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Engagement & Retention", path: ENGAGEMENT_PATH }]} />

        <ClusterHero label="Engagement & Retention" seed={heroSeed(ENGAGEMENT_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Engagement &amp; Retention
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The layer after the integration works and the data is correct: whether anyone comes back.
          A fitness app has engagement surfaces most apps do not — a workout is a long-running event
          the operating system will display on a Lock Screen, a Dynamic Island, or a watch face, and
          progress is glanceable enough for a widget or a complication. Those surfaces are free and
          documented, and most teams reach for a paid engagement platform before using any of them.
          This cluster covers the platform surfaces, the mechanics built on top of them — streaks,
          leaderboards, challenges, camera coaching — and the measurement that tells you whether any
          of it worked. It contains no engagement percentages, because no trustworthy public ones
          exist.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Every platform claim here is verified against Apple&rsquo;s and Google&rsquo;s own
            documentation. Where a third-party vendor&rsquo;s documentation was unreachable, the
            page says so rather than describing the product from memory. The data underneath all of
            this lives in <Link href="/devices">Connected Devices</Link> and{" "}
            <Link href="/architecture">Architecture</Link>; what you are allowed to show another
            user is often a <Link href="/compliance">terms and compliance</Link> question first.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getEngagement(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${ENGAGEMENT_PATH}/${e!.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                      <EntryBadge updated={e!.updated} />
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
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/engagement" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {ENGAGEMENT_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Engagement surfaces move with every OS release — a new Lock Screen affordance, a stricter notification default, a watch face that changes what your app may show. We track the ones that change what you can build."
          source="pillar-inline"
          id="cta-engagement"
        />
      </div>
    </Container>
  );
}
