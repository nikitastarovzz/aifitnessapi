import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getAccessibility, releasedAccessibility, A11Y_PATH } from "@/data/accessibility";

const UPDATED = "2026-08-22";
const TITLE = "Accessible Fitness & Health Apps";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Screen readers over live workout metrics, text scaling, touch targets, contrast outdoors, reduced motion, audible charts, haptics, captions and testing.",
  alternates: { canonical: A11Y_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Making a fitness app usable when somebody cannot see the screen, cannot hear the cue, or cannot reach the button mid-set.",
    url: A11Y_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "When nobody is looking at the screen",
    blurb:
      "The number changes four times a second and the user's eyes are on the road. Screen readers, live regions, and the trait that stops your rep counter shouting.",
    slugs: [
      "voiceover-live-workout-metrics",
      "talkback-workout-screens",
      "labelling-exercises-and-sets",
      "accessible-health-charts",
    ],
  },
  {
    title: "They can see it and still can't use it",
    blurb:
      "Text that has to survive being doubled, targets that have to be hit with a shaking hand, and a screen that has to be readable in sunlight.",
    slugs: [
      "dynamic-type-workout-screens",
      "touch-targets-during-a-workout",
      "colour-contrast-outdoors",
      "reduced-motion-coaching-ui",
      "gestures-and-hands-free-control",
    ],
  },
  {
    title: "The audio channel is already taken",
    blurb:
      "Their music is playing and their headphones are in. What is left to tell somebody they finished a set, and what a class video owes a deaf viewer.",
    slugs: ["haptics-when-audio-is-busy", "captions-for-workout-video"],
  },
  {
    title: "Proving it",
    blurb: "What a tool can catch, and the part only a person moving can.",
    slugs: ["testing-accessibility-fitness-app"],
  },
];

const FAQS = [
  {
    q: "Why does a fitness app need different accessibility work from a normal app?",
    a: "Because the conditions are different, not because the APIs are. A fitness product is used while the person is moving: eyes on the road or the floor, hands occupied or sweaty, phone on a bike mount or an armband, music already playing through the one audio channel your cues need, and a number on screen that changes several times a second. Each of those turns a standard control into an edge case. A rep counter is the clearest example — it is a label that updates constantly, which is a specific, documented problem with a specific, documented answer, and no general accessibility guide will ever mention it.",
  },
  {
    q: "Does this section tell me what the law requires?",
    a: "No, and that is deliberate. Every page here is engineering guidance sourced from Apple's and Google's own developer documentation. We do not cite accessibility standards by criterion or level, because the standards body's site was unreachable from our research environment when these pages were written, and a standards citation we could not read is worse than no citation. We also make no claims about legislation in any jurisdiction. Legal obligations, store policy and health-data rules live in the compliance section, and for anything binding you want a qualified professional, not a developer guide.",
  },
  {
    q: "Where should a team start if the app already shipped without any of this?",
    a: "Start with the screen somebody spends the workout on, not the settings screen. Turn on the screen reader and try to complete one set without looking: that single exercise surfaces unlabelled controls, a counter that either says nothing or will not stop talking, and buttons too small to hit while moving. Then run the platform's own tooling over the same screen — Apple's Accessibility Inspector audit, Android's Accessibility Scanner — because those catch the unlabelled and low-contrast elements faster than you can. What the tools cannot tell you is whether the flow works while somebody is actually exercising, which is why the testing page ends with people rather than tools.",
  },
];

export default function AccessibilityPillar() {
  const released = releasedAccessibility();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(A11Y_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
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
      <HubJsonLd basePath={A11Y_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Accessibility", path: A11Y_PATH }]} />

        <ClusterHero label="Accessibility" seed={heroSeed(A11Y_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Accessibility
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Accessibility in a fitness app is not the same problem as accessibility in a news
          site, because the person is moving. Their eyes are on the road, their hands are
          occupied, their music owns the audio channel your cues need, and the number they
          care about changes several times a second — Apple has a documented trait for exactly
          that element, and almost nobody building a rep counter has heard of it. These pages
          cover the moments where a fitness product specifically breaks: live metrics under a
          screen reader, text that has to survive doubling, targets hit with a shaking hand,
          contrast in sunlight, animation somebody has asked to stop, a heart-rate trend
          nobody can see, and a class video nobody can hear. Every claim comes from Apple&rsquo;s
          or Google&rsquo;s own documentation.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            This is engineering guidance and nothing else. It cites no accessibility standard
            by criterion or level — the standards body&rsquo;s site was unreachable from our
            research environment when these pages were written, and a citation we could not
            read is worse than none — and it makes no claim about the law anywhere. For
            obligations, store policy and health-data rules, see{" "}
            <Link href="/compliance">compliance</Link>. For building the app that runs on the
            wrist, see <Link href="/watch-apps">watch apps</Link>; for the algorithms behind a
            rep counter, <Link href="/motion">AI motion</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getAccessibility(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${A11Y_PATH}/${e!.slug}`}
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
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Platform accessibility APIs move with every OS release, and a setting that was advisory last year can become the thing a review flags this year. We track the changes that alter what you have to build."
          source="pillar-inline"
          id="cta-accessibility"
        />
      </div>
    </Container>
  );
}
