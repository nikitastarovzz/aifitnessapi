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
import { getBuild, releasedBuilds, BUILD_PATH } from "@/data/build";

const UPDATED = "2026-07-09";

export const metadata: Metadata = {
  title: "How to Build a Workout App (2026)",
  description:
    "A builder's playbook for shipping a workout app — scope, core features, which APIs to use, MVP, and launch — with a guide for each app type.",
  alternates: { canonical: BUILD_PATH },
  openGraph: {
    type: "website",
    title: "How to Build a Workout App (2026): The Builder's Playbook",
    description:
      "Scope, features, APIs, MVP, and launch — plus a build guide for personal training, home workout, AI coaching, rehab, yoga, and more.",
    url: BUILD_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Consumer fitness apps",
    blurb: "Direct-to-user apps people work out with.",
    slugs: [
      "home-workout-app",
      "ai-fitness-coaching-app",
      "strength-training-app",
      "running-app",
      "yoga-app",
    ],
  },
  {
    title: "Pro, clinical & B2B",
    blurb: "Apps built for trainers, clinics, and employers.",
    slugs: [
      "personal-training-app",
      "rehab-physical-therapy-app",
      "corporate-wellness-app",
      "nutrition-tracking-app",
    ],
  },
  {
    title: "Decisions",
    blurb: "The choices that cut across every app type.",
    slugs: ["fitness-app-tech-stack"],
  },
];

const FAQS = [
  {
    q: "How do you build a workout app?",
    a: "Start by narrowing to one app type and one core loop (for example: pick a workout, do it, log it). Decide which parts to build versus buy — exercise content, wearable data, nutrition, and AI motion tracking are all available as APIs — then ship a thin MVP of the core loop before adding breadth. Choose native or cross-platform based on your team and how much on-device work (camera, sensors) you need.",
  },
  {
    q: "What features does a fitness app need?",
    a: "At minimum: a way to choose or follow a workout, a way to perform and track it, and a way to see progress. Beyond that, features depend on the app type — wearable sync, camera-based rep counting, nutrition logging, social or coaching layers — and most of these can be added through APIs rather than built from scratch.",
  },
  {
    q: "Should you build a fitness app native or cross-platform?",
    a: "Cross-platform (React Native or Flutter) is usually faster to ship and cheaper to maintain for standard apps. Native (Swift/Kotlin) is worth it when you lean heavily on the camera, sensors, or platform health stores. Our tech-stack guide walks the trade-off.",
  },
];

export default function BuildPillar() {
  const url = absoluteUrl(BUILD_PATH);
  const released = releasedBuilds();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Build a Workout App (2026): The Builder's Playbook",
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
      url: absoluteUrl(`${BUILD_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Build Guides", path: BUILD_PATH }]} />

        <ClusterHero label="Build Guides" seed={heroSeed(BUILD_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          How to Build a Workout App
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Building a workout app comes down to a handful of decisions: pick one app type and its core loop,
          decide what to build versus buy (exercise content, wearable data, nutrition, and AI motion
          tracking are all APIs), ship a thin MVP of that loop, then add breadth. These guides walk
          each app type end to end, and link to the exact APIs and integration steps for the pieces.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>The five phases, whatever you&rsquo;re building</h2>
          <ol>
            <li>
              <strong>Scope to one app type and one core loop.</strong> A personal-training app and a
              running app share almost no core loop. Pick one below and design its single most
              important flow first.
            </li>
            <li>
              <strong>Decide build vs buy for each feature.</strong> Exercise libraries, wearable
              metrics, nutrition data, and camera-based coaching are all available as APIs — see{" "}
              <Link href="/fitness-apis">the fitness API landscape</Link> and{" "}
              <Link href="/fitness-apis/fitness-api-vs-build-your-own">build vs buy</Link>.
            </li>
            <li>
              <strong>Choose a stack.</strong> Native or cross-platform, and a backend — the{" "}
              <Link href={`${BUILD_PATH}/fitness-app-tech-stack`}>tech-stack guide</Link> covers the
              trade-offs.
            </li>
            <li>
              <strong>Build the MVP of the core loop.</strong> One workflow, done well. Wire the
              feature-level pieces from our{" "}
              <Link href="/guides">AI workout tracking guides</Link> if you need camera reps or form.
            </li>
            <li>
              <strong>Launch, measure, and add breadth.</strong> Ship the loop, learn from real use,
              then layer on the extras your app type needs.
            </li>
          </ol>
          <p>
            The guides below apply that playbook per app type — the features that matter, which APIs
            fit, the MVP scope, and the pitfalls specific to that niche.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getBuild(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${BUILD_PATH}/${e!.slug}`}
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
          pitch="We publish a new build guide most weeks — features, APIs, and the pitfalls per app type. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-build-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
