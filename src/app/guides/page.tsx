import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getGuide, releasedGuides, GUIDES_PATH } from "@/data/guides";

const UPDATED = "2026-07-08";

export const metadata: Metadata = {
  title: "How to Add AI Workout Tracking to Your App",
  description:
    "A builder's guide to adding AI workout tracking — camera pose detection, rep counting, and form feedback — to iOS, Android, React Native, Flutter, and web apps.",
  alternates: { canonical: GUIDES_PATH },
  openGraph: {
    type: "website",
    title: "How to Add AI Workout Tracking to Your App (2026)",
    description:
      "Camera-based rep counting and form feedback, from pose primitives to per-platform integration for iOS, Android, React Native, Flutter, and web.",
    url: GUIDES_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "By capability",
    blurb: "The building blocks of camera-based workout tracking.",
    slugs: [
      "camera-pose-tracking",
      "add-rep-counting",
      "add-form-feedback",
      "track-workouts-without-wearables",
    ],
  },
  {
    title: "By platform",
    blurb: "The same feature, wired into your stack.",
    slugs: [
      "ai-workout-tracking-ios-swift",
      "ai-workout-tracking-android-kotlin",
      "ai-workout-tracking-react-native",
      "ai-workout-tracking-flutter",
      "ai-workout-tracking-web",
    ],
  },
  {
    title: "Troubleshooting",
    blurb: "When the model works but the results don't.",
    slugs: ["improve-pose-detection-accuracy"],
  },
];

const FAQS = [
  {
    q: "How do you add AI workout tracking to an app?",
    a: "At a high level: capture the camera feed, run a pose-estimation model on each frame to get body keypoints, then turn those keypoints into product logic — count reps from joint angles and check form against target ranges. You can build this on free pose primitives (MediaPipe, MoveNet, Apple Vision) or use a commercial fitness SDK that wraps the whole pipeline.",
  },
  {
    q: "Do I need machine-learning expertise to add rep counting?",
    a: "Not necessarily. The pose-estimation model does the ML; the rep-counting and form logic on top is ordinary application code (geometry and state machines). If you would rather not build even that, a commercial AI fitness SDK provides rep counting and form feedback out of the box.",
  },
  {
    q: "Can you track workouts with just a phone camera, no wearable?",
    a: "Yes. Camera-based pose estimation runs on a standard phone camera and needs no wearable — it infers body position from the video frames. Wearables and camera tracking measure different things (physiological signals vs movement/form), so many apps use one, the other, or both.",
  },
];

export default function GuidesPillar() {
  const url = absoluteUrl(GUIDES_PATH);
  const released = releasedGuides();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Add AI Workout Tracking to Your App (2026)",
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
      url: absoluteUrl(`${GUIDES_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Guides", path: GUIDES_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          How to Add AI Workout Tracking to Your App
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Adding AI workout tracking comes down to three stages: capture the camera feed, run a
          pose-estimation model to get body keypoints, then turn those keypoints into product logic —
          rep counting and form feedback. You can build the pipeline on free pose primitives (MediaPipe,
          MoveNet, Apple Vision) or buy a fitness SDK that wraps all three stages. These guides cover
          both paths, the per-platform wiring, and how to make detection reliable.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>The pipeline is always the same three stages</h2>
          <p>
            Whatever platform you&rsquo;re on, camera-based workout tracking is the same shape:
          </p>
          <ol>
            <li>
              <strong>Capture</strong> — get frames from the camera (AVFoundation, CameraX,
              <code>getUserMedia</code>, or a React Native / Flutter camera plugin).
            </li>
            <li>
              <strong>Estimate pose</strong> — run each frame through a pose model to get 2D/3D body
              keypoints. See{" "}
              <Link href={`${GUIDES_PATH}/camera-pose-tracking`}>camera pose tracking</Link>.
            </li>
            <li>
              <strong>Interpret</strong> — turn keypoints into logic:{" "}
              <Link href={`${GUIDES_PATH}/add-rep-counting`}>count reps</Link> from joint angles and{" "}
              <Link href={`${GUIDES_PATH}/add-form-feedback`}>give form feedback</Link> against target
              ranges.
            </li>
          </ol>

          <h2>Build on primitives, or buy an SDK</h2>
          <p>
            The two paths differ only in how much of that pipeline you own. Building on free primitives
            (MediaPipe, TensorFlow MoveNet, Apple Vision) gives you full control and no per-user fee,
            but you write the rep logic, form rules, and calibration yourself. A commercial AI fitness
            SDK ships those out of the box for a price. We compare the options in{" "}
            <Link href="/fitness-apis/ai-workout-tracking-apis">AI workout tracking APIs</Link> and walk
            the decision in{" "}
            <Link href="/fitness-apis/fitness-api-vs-build-your-own">fitness API vs building your own</Link>.
          </p>
          <p>
            No wearable is required for any of this — it all runs on the phone camera. If you also want
            device metrics, that&rsquo;s a separate integration (
            <Link href="/fitness-apis/wearable-data-apis">wearable data APIs</Link>). When detection is
            flaky, start with{" "}
            <Link href={`${GUIDES_PATH}/improve-pose-detection-accuracy`}>
              improving pose-detection accuracy
            </Link>
            .
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getGuide(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${GUIDES_PATH}/${e!.slug}`}
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
          pitch="We publish a new build guide like these most weeks — real integration code, not marketing. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-guides-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
