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
import { getMotion, releasedMotion, MOTION_PATH, MOTION_CONFIG } from "@/data/motion";

const UPDATED = "2026-07-24";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedMotion().reduce((n, e) => n + e.faqs.length, 0);

export const metadata: Metadata = {
  title: "AI Motion & Pose Estimation for Fitness Apps",
  description:
    "The tech behind camera-based fitness: which pose model to pick, 2D vs 3D, on-device vs cloud, accuracy, and how rep counting and form feedback work.",
  alternates: { canonical: MOTION_PATH },
  openGraph: {
    type: "website",
    title: "AI Motion & Pose Estimation for Fitness Apps",
    description:
      "Choose a pose model, decide on-device vs cloud, understand accuracy, and see how rep counting and form scoring work — the technical layer behind AI workout tracking.",
    url: MOTION_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Pose estimation tech",
    blurb: "Which model, how many dimensions, how accurate.",
    slugs: [
      "pose-estimation-models-compared",
      "mediapipe-vs-movenet",
      "mediapipe-pose-landmarker-models",
      "apple-vision-body-pose",
      "2d-vs-3d-pose-estimation",
      "pose-estimation-accuracy",
      "multi-person-pose-tracking",
    ],
  },
  {
    title: "Performance & deployment",
    blurb: "Where inference runs and what it needs.",
    slugs: [
      "on-device-vs-cloud-pose-estimation",
      "real-time-pose-estimation",
      "pose-estimation-hardware-requirements",
    ],
  },
  {
    title: "Interpreting motion",
    blurb: "Turning keypoints into reps, form, and a decision.",
    slugs: ["how-rep-counting-works", "how-form-feedback-works", "build-vs-buy-ai-motion-tracking"],
  },
];

const FAQS = [
  {
    q: "Do I need a special camera for AI motion tracking?",
    a: "No. A regular RGB smartphone camera is enough for 2D pose estimation and even monocular (single-camera) 3D landmarks — you don't need a depth sensor. GPU/NPU acceleration helps performance on-device, and lighting and framing matter more than the camera itself. The hardware-requirements page covers what actually affects it.",
  },
  {
    q: "Should pose estimation run on-device or in the cloud?",
    a: "On-device (ML Kit, MediaPipe, TensorFlow Lite, Core ML) is usually the better default for fitness: it's low-latency, works offline, has no per-frame server cost, and keeps workout video private. Cloud inference lets you run heavier models consistently across devices but adds latency, bandwidth, and the privacy weight of streaming video. The on-device-vs-cloud page walks the trade-off.",
  },
  {
    q: "How does an app count reps or check form from a camera?",
    a: "It runs pose estimation to get body keypoints each frame, then interprets them: rep counting tracks a joint angle or keypoint over time and detects the up/down phases (usually a state machine with thresholds); form feedback computes joint angles and range of motion and compares them to a target. Both are covered here — and note that camera-based form feedback is a coaching aid, not medical or physical-therapy advice.",
  },
];

export default function MotionPillar() {
  const url = absoluteUrl(MOTION_PATH);
  const released = releasedMotion();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI Motion & Pose Estimation for Fitness Apps",
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
      url: absoluteUrl(`${MOTION_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/motion" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "AI Motion", path: MOTION_PATH }]} />

        <ClusterHero label="AI Motion" seed={heroSeed(MOTION_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          AI Motion &amp; Pose Estimation for Fitness Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Camera-based fitness runs on pose estimation: a model finds body keypoints in each frame, and
          your app turns those into reps, form cues, and coaching. This hub is the technical layer — which
          pose model to choose, 2D vs 3D, on-device vs cloud inference, what drives accuracy, and how rep
          counting and form scoring actually work — with links to the how-to guides when you&rsquo;re ready
          to build.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            New to the idea? Start with{" "}
            <Link href="/learn/what-is-pose-estimation">what pose estimation is</Link>. Ready to
            implement? The <Link href="/guides">AI workout tracking guides</Link> walk the per-platform
            wiring, and <Link href="/fitness-apis/ai-workout-tracking-apis">the AI tracking APIs</Link>{" "}
            cover the buy option. This cluster is the decisions in between.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getMotion(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${MOTION_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
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
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/motion" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {MOTION_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterCta
          pitch="Pose models, on-device runtimes, and motion-tracking tooling move fast. We track what changes for builders of camera-based fitness — so your stack decisions stay current. Get the updates."
          source="pillar-inline"
          id="cta-motion-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
