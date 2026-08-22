import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterDownload from "@/components/ClusterDownload";
import ClusterHero from "@/components/ClusterHero";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getWatchApp, releasedWatchApps, WATCH_PATH } from "@/data/watchApps";

const UPDATED = "2026-08-22";

export const metadata: Metadata = {
  title: "Building watchOS & Wear OS Fitness Apps",
  description:
    "Workout sessions, background execution, WorkoutKit, Health Services, tiles, pairing, battery and testing — building the fitness app that runs on the wrist.",
  alternates: { canonical: WATCH_PATH },
  openGraph: {
    type: "website",
    title: "Building watchOS & Wear OS Fitness Apps",
    description:
      "The layer after the integration works: whether anyone comes back. Platform engagement surfaces, streaks and leaderboards, and honest measurement.",
    url: WATCH_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Apple Watch",
    blurb: "The workout session is the platform: it tunes the sensors, keeps you running, and ends when another app starts one.",
    slugs: [
      "watchos-workout-app-anatomy",
      "healthkit-on-apple-watch",
      "apple-watch-background-execution",
      "workoutkit-scheduled-workouts",
      "mirroring-workouts-to-iphone",
    ],
  },
  {
    title: "Wear OS",
    blurb: "Health Services owns the sensors, tiles own the glance, and the phone may not be an Android phone at all.",
    slugs: [
      "wear-os-app-anatomy",
      "wear-os-exercise-tracking",
      "wear-os-tiles",
      "wear-os-phone-sync",
    ],
  },
  {
    title: "Both platforms",
    blurb: "The constraints that decide the architecture, and the ones no emulator will show you.",
    slugs: ["watch-platform-differences", "watch-app-battery", "testing-watch-apps"],
  },
];

const FAQS = [
  {
    q: "Do I need a watch app, or is reading watch data from my phone app enough?",
    a: "It depends on whether you need data during the workout or after it. A phone app reading HealthKit or Health Connect gets what already happened — an excellent source for history, trends and anything written by other apps. It cannot coach somebody mid-set. Live, high-frequency metrics come from code running on the watch: a workout session on watchOS, Health Services on Wear OS. If your product is a log, a viewer or an analysis tool, skip the watch app. If it reacts while somebody is moving, the watch app is the product.",
  },
  {
    q: "Can one Wear OS app work when the watch is paired to an iPhone?",
    a: "The app can, but the phone link cannot. Google's documentation is explicit that the Data Layer API only synchronizes with phones running Android or with Wear OS watches, that it will not work when a Wear OS device is paired with an iOS device, and that for this reason you should not use it as the primary way to communicate with a network. In practice that means a Wear OS app which routes everything through a paired Android phone silently has no data path for those users. Talk to your own backend from the watch, and treat the phone link as an optimization.",
  },
  {
    q: "Why can't I just run my workout tracking in a background task?",
    a: "Because both platforms reserve their long-running paths for declared purposes. On watchOS an active workout session is the mechanism that keeps your app alive and tunes the sensors, and Apple documents extended runtime sessions as covering self care, mindfulness, physical therapy or smart alarm — workout is deliberately not in that list, because workouts belong to HKWorkoutSession. On Wear OS, Health Services owns the exercise lifecycle and applies power-optimized sensor configurations. Trying to route around either gets you a worse battery profile and a fragile app.",
  },
];

export default function WatchAppsPillar() {
  const released = releasedWatchApps();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(WATCH_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Building watchOS & Wear OS Fitness Apps",
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
      <HubJsonLd basePath="/watch-apps" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Watch Apps", path: WATCH_PATH }]} />

        <ClusterHero label="Watch Apps" seed={heroSeed(WATCH_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Watch Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Writing the app that runs on the wrist, as opposed to reading the wrist from a phone. On
          Apple Watch the workout session is the platform: Apple documents that it tunes the
          sensors for the activity you declare, that every session produces high-frequency heart
          rate, and that the watch runs one at a time, so a competing app ends yours. On Wear OS,
          Health Services owns the exercise lifecycle with power-optimized sensor configurations
          and computations shared across apps. Around that sit the parts that decide whether the
          app is any good: what runs when the screen is off, what a tile may show, whether the
          phone is even reachable, and what battery you spend to do it.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Three clusters touch the wrist and they do not overlap:{" "}
            <Link href="/devices">Connected Devices</Link> treats the watch as a data source for a
            phone app, <Link href="/engagement">Engagement</Link> covers the surfaces that bring
            somebody back, and this one is about building and shipping the watch app itself. Every
            platform claim below is verified against Apple&rsquo;s or Google&rsquo;s own
            documentation, and there are no battery figures anywhere: battery is the defining
            constraint of this platform, and a number we cannot measure would be worse than none.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getWatchApp(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${WATCH_PATH}/${e!.slug}`}
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

        <ClusterDownload
          title="Watch app pre-flight checklist"
          blurb="The twelve decisions this section covers, each with the question it answers and the page that treats it properly. No battery, performance or accuracy numbers — same rule as the pages."
          href="/kit/watch-app-preflight-checklist.md"
          filename="the checklist"
        />

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Watch platforms move faster than phone platforms, and a single OS release can change what runs in the background or what a tile may do. We track the changes that alter what you are allowed to build."
          source="pillar-inline"
          id="cta-watch-apps"
        />
      </div>
    </Container>
  );
}
