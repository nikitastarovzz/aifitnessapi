import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import KinestexNote from "@/components/KinestexNote";
import RepChallenge from "@/components/RepChallenge";
import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { BENCH_MODELS, TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import {
  CHALLENGE_SECONDS,
  COUNTDOWN_SECONDS,
  EXERCISES,
  LANDMARKS,
  MIN_HOLD_MS,
  SMOOTHING_MS,
  VISIBILITY_MIN,
  describeZone,
} from "@/lib/repCounter.mjs";
import { absoluteUrl, site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * /challenge — a 30-second webcam rep challenge (ops/VIRAL-30-2026-10-31.md
 * item 3).
 *
 * A game, and labelled as one: squats or jumping jacks counted live by
 * MediaPipe Pose Landmarker lite and a two-phase angle state machine
 * (src/lib/repCounter.mjs, tested in scripts/rep-counter.test.mjs). The page
 * prints every threshold the counter applies, read from that module, so the
 * prose cannot drift from the code. It claims no accuracy: the counter is a
 * demo of the method on /motion/how-rep-counting-works, and the page says
 * where it goes wrong.
 *
 * Client-side only. The runtime and model are the files /tools/pose-benchmark
 * verified (src/lib/poseBenchmark.ts); the share card is drawn on a canvas in
 * the browser (src/lib/shareCard.ts). No API route, no storage, no dynamic OG.
 */

const PATH = "/challenge";
const UPDATED = "2026-10-31";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "30-Second Webcam Rep Challenge";
const DESCRIPTION =
  "How many squats or jumping jacks in 30 seconds? A pose model in your browser counts them live from your webcam, and the video stays on your device.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Squats or jumping jacks for 30 seconds, counted live in your browser by MediaPipe Pose Landmarker and a few angle rules. Get a score card to share.",
    url: PATH,
  },
};

// The counter reads landmarks by index. Check each index against the name
// MediaPipe's own source gives it (the generated keypoint dataset), so a
// wrong number fails the build instead of quietly counting the wrong joint.
const BLAZEPOSE = POSE_SCHEMES.find((s) => s.slug === "blazepose-33");
if (!BLAZEPOSE) throw new Error("challenge: blazepose-33 missing from the keypoint dataset");
for (const [name, index] of Object.entries(LANDMARKS)) {
  const point = BLAZEPOSE.points.find((p) => p.index === index);
  if (point?.name !== name) {
    throw new Error(`challenge: landmark ${index} is ${point?.name ?? "absent"} in the dataset, not ${name}`);
  }
}
const KEYPOINT_COUNT = BLAZEPOSE.points.length;
const LITE = BENCH_MODELS.find((m) => m.id === "lite")!;
const SQUAT = EXERCISES.squat;
const JACK = EXERCISES["jumping-jack"];

const FAQS = [
  {
    q: "How does the 30-second rep challenge count reps?",
    a: `Each camera frame goes through MediaPipe Pose Landmarker lite in your browser, which returns ${KEYPOINT_COUNT} body landmarks. The page turns them into one angle, the knee angle for squats and the hip, shoulder and wrist angle for jumping jacks, and a two-phase state machine counts a rep when that angle goes from the rest zone to the active zone and back. For squats that is ${describeZone(SQUAT.active)} and back ${describeZone(SQUAT.rest)}; for jumping jacks, ${describeZone(JACK.active)} and back ${describeZone(JACK.rest)}.`,
  },
  {
    q: "Why did the rep challenge miss a rep or count one I did not do?",
    a: "Because its rules are simple. A shallow squat never reaches the bottom zone, arms that stop at shoulder height never reach the top zone, a body partly out of frame gives no reading, and a slow device skips frames. Loose clothing, low light and a camera that is too close all make the landmarks less reliable. The thresholds are starting values, not ones tuned on real users, so treat the number as a game score, not a measurement.",
  },
  {
    q: "Does the webcam rep challenge upload my video?",
    a: "No. Frames go from your camera into the pose model running in the same browser tab and are never stored, recorded or sent. The page downloads Google's runtime from cdn.jsdelivr.net and the model file from storage.googleapis.com. That runtime also sends Google a usage report of its own, which in the code we read carries timings and the library version, not images. The share card is drawn on your device and leaves only if you save or post it yourself.",
  },
  {
    q: "Can I reuse the challenge's angle thresholds in my own app?",
    a: "As a starting point only. The squat thresholds come from one 2026 study's example definition and the jumping-jack ones are our own choice; neither was calibrated for your camera, model or users. The how-rep-counting-works and per-exercise pages explain what to test, and every rule the counter applies is listed on this page.",
  },
];

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function ChallengePage() {
  const url = absoluteUrl(PATH);
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "webcam squat and jumping jack counter game",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Rep challenge", path: PATH },
          ]}
        />
        <ClusterHero label="Challenge" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          The 30-second rep challenge
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Pick squats or jumping jacks, step back from your webcam, and do as many as you can in{" "}
          {CHALLENGE_SECONDS} seconds. A pose model running in your browser finds your joints in every
          frame, a few angle rules count the reps live, and at the end you get a score card to share.
          It is a game and a demo of how camera rep counting works, not coaching: the rules are simple,
          the count can be wrong, and your camera frames never leave this tab.
        </p>

        <section data-challenge aria-label="Webcam rep challenge">
          <RepChallenge />
        </section>

        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          Before you start: clear some space, stand far enough back that the camera sees you from head
          to feet, and stop if anything hurts. The camera is asked for only when you press Start camera,
          and the preview shows the skeleton and the angle before anything counts. Press Go for a{" "}
          {COUNTDOWN_SECONDS}-second countdown; reps during it do not count.
        </p>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the counting works</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The counter is the method{" "}
            <Link href="/motion/how-rep-counting-works" className={linkCls}>
              how rep counting works
            </Link>{" "}
            describes, kept short enough to print in full here. Every number below is read from the same
            module the page runs, so this text and the code cannot disagree.
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Landmarks.</strong> Google&rsquo;s{" "}
              <code className="font-mono text-sm">@mediapipe/tasks-vision</code> {TASKS_VISION_VERSION}{" "}
              runs {LITE.name} ({mib(LITE.bytes)}) on each frame and returns {KEYPOINT_COUNT}{" "}
              points, indexed on the{" "}
              <Link href="/pose-keypoints/blazepose-33" className={linkCls}>
                BlazePose 33 map
              </Link>
              , each with a visibility score. It also returns the same pose as world landmarks, which the
              package&rsquo;s type definitions describe as coordinates in metres; the angle is computed from
              those, so it does not depend on where you stand in the frame.
            </li>
            <li>
              <strong className="text-[var(--fg)]">One angle.</strong> For squats, the{" "}
              {SQUAT.angleName} at the knee between hip and ankle, averaged over the legs the camera can see.
              For jumping jacks, the {JACK.angleName} at the shoulder between hip and wrist, averaged over
              both arms, and only when both are visible. A side is used only when its three landmarks each
              report a visibility of at least {VISIBILITY_MIN}; otherwise the frame has no reading and the
              counter waits.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Smoothing.</strong> The angle passes through a moving
              average with a {SMOOTHING_MS} ms time constant, so single-frame jitter is damped by the same
              amount at any frame rate.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Two zones with a gap.</strong> A squat rep is the angle
              going {describeZone(SQUAT.active)} ({SQUAT.activeName}) and back {describeZone(SQUAT.rest)}{" "}
              ({SQUAT.restName}). A jumping jack is {describeZone(JACK.active)} ({JACK.activeName}) and back{" "}
              {describeZone(JACK.rest)} ({JACK.restName}). The gap between the zones is the hysteresis: an
              angle hovering at one boundary cannot finish a cycle on its own. You have to start in the rest
              zone, so beginning at the bottom of a squat is not half a rep.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Hold and speed limits.</strong> A zone has to hold for{" "}
              {MIN_HOLD_MS} ms of frames (two frames at 30 frames per second) before the phase changes,
              which drops one-frame glitches. A cycle that completes faster than {SQUAT.minCycleMs} ms for a
              squat or {JACK.minCycleMs} ms for a jumping jack is rejected, and the result says how many
              were.
            </li>
          </ol>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Where the thresholds come from: the squat values are the example definition{" "}
            <Link href="/motion/squat-detection-pose-estimation" className={linkCls}>
              squat detection with pose estimation
            </Link>{" "}
            reports from a 2026 study, which marks them as adjustable defaults. The jumping-jack values are
            our own choice for a frontal webcam:{" "}
            <Link href="/motion/jumping-jack-counter-pose-estimation" className={linkCls}>
              the jumping jack counter page
            </Link>{" "}
            reports no measured counting accuracy and gives no numeric threshold to copy, and the studies it
            read tracked hand and foot distance rather than an arm angle. Nothing here was calibrated on real users.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where it gets the count wrong</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Depth it cannot see.</strong> Facing the camera, the
              knee bend is mostly toward the lens, and the model estimates that depth from a flat image. A
              real squat can read shallower than it is, and a different camera angle can change the count.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Partial movements.</strong> Squats that stop above the
              bottom zone and jumping jacks whose arms stop at shoulder height are not counted. The
              jumping-jack rule watches the arms only, so arm swings without a jump count as reps.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The frame.</strong> Feet, hands or hips out of shot,
              loose clothing, low light, a busy background or a second person all degrade the landmarks.
              The model is asked for one pose.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The device.</strong> A slow device runs fewer frames per
              second, and very fast reps can fall between them. How fast the model runs on yours is what{" "}
              <Link href="/tools/pose-benchmark" className={linkCls}>
                the pose model benchmark
              </Link>{" "}
              measures.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            It does not judge form, depth targets or safety, and it is not exercise, coaching or medical
            advice. What a product-grade counter adds on top of rules like these is in{" "}
            <Link href="/guides/add-rep-counting" className={linkCls}>
              adding rep counting to an app
            </Link>
            ,{" "}
            <Link href="/motion/how-form-feedback-works" className={linkCls}>
              how form feedback works
            </Link>{" "}
            and{" "}
            <Link href="/test/rep-counting" className={linkCls}>
              testing a rep counting algorithm
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">What this page sends, and what it keeps</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side. Camera frames go from your browser&rsquo;s video element into the
              WebAssembly runtime and are never stored, recorded or sent; this site has no server code behind
              this page, keeps no scores and has no leaderboard. The network requests are the runtime from
              cdn.jsdelivr.net and the model file from storage.googleapis.com, so those hosts see an ordinary
              download, the same one{" "}
              <Link href="/tools/pose-benchmark" className={linkCls}>
                the benchmark
              </Link>{" "}
              makes. The package version and file URLs were checked on {VERIFIED_ON}.
            </p>
            <p>
              The runtime also reports its own usage to Google. Version {TASKS_VISION_VERSION}{" "}posts to{" "}
              <code className="font-mono text-xs">{TASKS_VISION_USAGE_LOG_URL}</code>{" "}about once a minute and
              when the model closes, and we saw that request in our own test of this page. In the
              library&rsquo;s code the report is built from the task name, the running mode, an
              operating-system family read from the user agent, the library version and timing counters
              such as frames processed and latency; no image, video or landmark value goes into it. Its
              public options offer no switch to turn it off, and a content blocker that blocks that host
              does not stop the challenge.
            </p>
            <p>
              The score card is a PNG drawn on a canvas in your browser and the result line is text built in
              the same place. Neither contains an image of you.
            </p>
          </div>
        </details>

        <KinestexNote path={PATH} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free demo from {site.name}. Every topic in camera-based tracking is at{" "}
          <Link href="/motion" className={linkCls}>
            AI motion tracking
          </Link>
          , and the free developer tools are at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
