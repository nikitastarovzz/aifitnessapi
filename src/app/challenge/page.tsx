import type { Metadata } from "next";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import KinestexNote from "@/components/KinestexNote";
import RepChallenge from "@/components/RepChallenge";
import { TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import {
  CHALLENGE_SECONDS,
  COUNTDOWN_SECONDS,
  MIN_HOLD_MS,
  SMOOTHING_MS,
  VISIBILITY_MIN,
  describeZone,
} from "@/lib/repCounter.mjs";
import { absoluteUrl, site } from "@/lib/site";
import { toolGraph, publishedDate } from "@/lib/schema";
import ToolNextStep from "@/components/ToolNextStep";
import {
  CHALLENGE_FAQS as FAQS,
  FORM_RULES_FETCHED_ON,
  JACK,
  KEYPOINT_COUNT,
  LITE,
  LUNGE,
  LUNGE_RANGE_RULE,
  PLANK,
  PUSHUP,
  PUSHUP_BOTTOM_RULE,
  PUSHUP_TOP_RULE,
  SQUAT,
} from "@/lib/challengePage";

/**
 * /challenge — a 30-second webcam rep challenge (ops/VIRAL-30-2026-10-31.md
 * item 3).
 *
 * A game, and labelled as one: squats, jumping jacks, push-ups or lunges
 * counted live (and a plank timed) by MediaPipe Pose Landmarker lite and a
 * two-phase angle state machine
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
  "Squats, jumping jacks, push-ups or lunges in 30 seconds, or a plank hold, counted live by a pose model in your browser. The video stays on your device.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Squats, jumping jacks, push-ups or lunges for 30 seconds, or a plank hold, counted live in your browser by MediaPipe Pose Landmarker. Send a score to beat.",
    url: PATH,
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function ChallengePage() {
  const url = absoluteUrl(PATH);
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "webcam squat, jumping jack, push-up, lunge and plank counter game",
    description: DESCRIPTION,
    datePublished: publishedDate("challenge", UPDATED),
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
          Pick squats, jumping jacks, push-ups or lunges and do as many as you can in {CHALLENGE_SECONDS}{" "}
          seconds, or hold a plank as long as you can. A pose model running in your browser finds your
          joints in every frame, a few angle rules count the reps (or time the plank) live, and at the end
          you get a score card and a link that challenges someone to beat your number. It is a game and a
          demo of how camera rep counting works, not coaching: the rules are simple, the count can be
          wrong, and your camera frames never leave this tab.
        </p>

        <section data-challenge aria-label="Webcam rep challenge">
          <RepChallenge />
        </section>

        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          Before you start: clear some space, stand far enough back that the camera sees you from head
          to feet, and stop if anything hurts. For push-ups and the plank, put the camera at floor level
          and turn side-on to it. The camera is asked for only when you press Start camera, and the
          preview shows the skeleton and the angle before anything counts. Press Go for a{" "}
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
              package&rsquo;s type definitions describe as coordinates in meters; the angle is computed from
              those, so it does not depend on where you stand in the frame.
            </li>
            <li>
              <strong className="text-[var(--fg)]">One angle.</strong> For squats and lunges, the{" "}
              {SQUAT.angleName} at the knee between hip and ankle, averaged over the legs the camera can see.
              For jumping jacks, the {JACK.angleName} at the shoulder between hip and wrist, averaged over
              both arms, and only when both are visible. For push-ups, the {PUSHUP.angleName} at the elbow
              between shoulder and wrist, averaged over the arms the camera can see. A side is used only
              when its three landmarks each report a visibility of at least {VISIBILITY_MIN}; otherwise the
              frame has no reading and the counter waits.
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
              {describeZone(JACK.rest)} ({JACK.restName}). A push-up is {describeZone(PUSHUP.active)}{" "}
              ({PUSHUP.activeName}) and back {describeZone(PUSHUP.rest)} ({PUSHUP.restName}). A lunge is{" "}
              {describeZone(LUNGE.active)} ({LUNGE.activeName}) and back {describeZone(LUNGE.rest)}{" "}
              ({LUNGE.restName}). The gap between the zones is the hysteresis: an
              angle hovering at one boundary cannot finish a cycle on its own. You have to start in the rest
              zone, so beginning at the bottom of a squat is not half a rep.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Hold and speed limits.</strong> A zone has to hold for{" "}
              {MIN_HOLD_MS} ms of frames (two frames at 30 frames per second) before the phase changes,
              which drops one-frame glitches. A cycle that completes faster than {SQUAT.minCycleMs} ms for a
              squat, {JACK.minCycleMs} ms for a jumping jack, {PUSHUP.minCycleMs} ms for a push-up or{" "}
              {LUNGE.minCycleMs} ms for a lunge is rejected, and the result says how many were.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The plank is timed, not counted.</strong> A frame is in
              position when the angle at the hip between shoulder and ankle is above {PLANK.STRAIGHT_MIN}° (a
              straight body) and the line from shoulders to ankles is within {PLANK.TILT_MAX}° of level in the
              image (so standing up straight does not count). The clock starts once that has held for{" "}
              {PLANK.ENTER_MS} ms, pauses when it fails, and stops when it has failed for {PLANK.GRACE_MS / 1000}{" "}
              seconds in a row, or at {PLANK.MAX_SECONDS / 60} minutes. Time out of position is not counted.
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
            read tracked hand and foot distance rather than an arm angle. The push-up values are the defaults
            Ultralytics ships in its open-source workout monitor, read from its source by the{" "}
            <Link href="/tools/exercise-form-rules" className={linkCls}>
              exercise form rules
            </Link>{" "}
            dataset on {FORM_RULES_FETCHED_ON}: an up angle of {PUSHUP_TOP_RULE.value}° and a down angle of{" "}
            {PUSHUP_BOTTOM_RULE.value}° (Ultralytics counts a rep on reaching the bottom; this counter counts
            on the way back up, like the others). The lunge and plank values are our own simple defaults,
            because no source in that dataset gives a lunge counting angle or a plank angle and hold time; the
            lunge bottom zone does sit inside the {LUNGE_RANGE_RULE.value}–{LUNGE_RANGE_RULE.value2}° knee range
            one open-source form checker accepts at the bottom of a lunge. Nothing here was calibrated on real
            users.
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
              <strong className="text-[var(--fg)]">Partial movements.</strong> Squats, lunges and push-ups
              that stop above the bottom zone and jumping jacks whose arms stop at shoulder height are not
              counted. The jumping-jack rule watches the arms only, so arm swings without a jump count as
              reps, and the push-up rule watches the elbows only, so it does not check that your body stays
              straight.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The frame.</strong> Feet, hands or hips out of shot,
              loose clothing, low light, a busy background or a second person all degrade the landmarks.
              The model is asked for one pose.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The camera angle.</strong> Push-ups and the plank are
              read from the side; facing the camera, the elbow bend and the body line point toward the lens
              and read badly. A plank seen from too high or too low looks tilted.
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
          <div className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
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
              the same place. Neither contains an image of you. The challenge link under it carries only the
              exercise and your score in its address (for example ?ex=pushups&amp;beat=17); whoever opens it
              sees that number as the one to beat, and nothing is sent to this site.
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

        <ToolNextStep path="/challenge" />
      </div>
    </Container>
  );
}
