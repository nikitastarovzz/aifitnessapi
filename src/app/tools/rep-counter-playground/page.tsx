import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import KinestexNote from "@/components/KinestexNote";
import RepCounterPlayground from "@/components/tools/RepCounterPlayground";
import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { FORM_RULE_PRESETS, FORM_RULE_SOURCES, FORM_RULES, FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { BENCH_MODELS, TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import { LANDMARKS } from "@/lib/repCounter.mjs";
import { DEFAULT_CONFIG, JOINTS } from "@/lib/repPlayground.mjs";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site } from "@/lib/site";
import { EXERCISES as COUNTER_EXERCISES } from "@/lib/repCounter.mjs";
import { STANCE_ROW_ID } from "@/lib/repCounterKit.mjs";
import { toolGraph, publishedDate } from "@/lib/schema";

/**
 * A rep-counting playground: a local video (or the webcam) through MediaPipe
 * Pose Landmarker in the browser, every joint angle traced over time, and a
 * threshold counter with hysteresis the reader tunes and exports as JSON.
 *
 * Fact discipline: the runtime and model facts are the ones checked in
 * src/lib/poseBenchmark.ts (VERIFIED_ON); the keypoint names are checked
 * against the generated keypoint dataset at build time below; the starting
 * thresholds are either this page's own (said so) or a preset from the
 * exercise form-rules dataset (src/data/formRules.ts, every number quoted
 * from its source). The page states no accuracy figure: a counter's accuracy
 * is a property of a recording, a camera angle and a person, and the point of
 * the tool is that the reader measures it on theirs.
 */

const PATH = "/tools/rep-counter-playground";
const UPDATED = "2026-11-05";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Rep Counter Playground: Tune Angle Thresholds";
const DESCRIPTION =
  "Load a workout video, see knee, hip, elbow and shoulder angles over time, tune a rep counter's thresholds and export the config. Runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "MediaPipe Pose Landmarker on your own video, joint-angle traces and a tunable hysteresis rep counter, exported as JSON. The video is never uploaded.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

// The joint indices are the /challenge landmarks; hold their names to the
// generated keypoint dataset so a wrong index fails the build instead of
// tracing the wrong joint.
const BLAZEPOSE = POSE_SCHEMES.find((s) => s.slug === "blazepose-33");
if (!BLAZEPOSE) throw new Error("rep-counter-playground: blazepose-33 missing from the keypoint dataset");
for (const [name, index] of Object.entries(LANDMARKS)) {
  const point = BLAZEPOSE.points.find((p) => p.index === index);
  if (point?.name !== name) {
    throw new Error(`rep-counter-playground: landmark ${index} is ${point?.name ?? "absent"} in the dataset, not ${name}`);
  }
}

const LITE = BENCH_MODELS.find((m) => m.id === "lite")!;
const FULL = BENCH_MODELS.find((m) => m.id === "full")!;
const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const D = DEFAULT_CONFIG;

// The one-file counter (public/kit/rep-counter.html, rendered by
// scripts/build-kit.mjs from the same modules): its count thresholds are the
// /challenge squat rule, and its stance cue is one row of the form-rules dataset.
const KIT_TOP = COUNTER_EXERCISES.squat.rest.above;
const KIT_BOTTOM = COUNTER_EXERCISES.squat.active.below;
function stanceRule() {
  const row = FORM_RULES.find((r) => r.id === STANCE_ROW_ID);
  const src = FORM_RULE_SOURCES.find((s) => s.id === row?.sourceId);
  if (!row || row.value == null || row.value2 == null || !src) {
    throw new Error(`rep-counter-playground: ${STANCE_ROW_ID} missing from the form-rules dataset`);
  }
  return { row, src };
}
const { row: STANCE, src: STANCE_SRC } = stanceRule();

export default function RepCounterPlaygroundPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "rep counting from video with pose estimation",
    description: DESCRIPTION,
    datePublished: publishedDate("tools/rep-counter-playground", UPDATED),
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Rep counter playground", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Rep counter playground: tune the thresholds on your own video
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          A camera rep counter usually reduces each frame to one joint angle and counts a rep each time
          that angle crosses a bottom threshold and comes back past a top one, with a gap between the two
          so jitter cannot count. This page runs MediaPipe Pose Landmarker on a video file or your webcam
          in your browser, draws the knee, hip, elbow and shoulder angles over time, and recounts the whole
          recording as you move the top and bottom angles, the minimum frames and the minimum cycle time.
          Export the result as a JSON config. The video is never uploaded.
        </p>

        <section data-tool="rep-counter-playground" aria-label="Rep counter on your own video">
          <RepCounterPlayground />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the counter decides</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            It is the same state machine as{" "}
            <Link href="/challenge" className={linkCls}>
              the 30-second rep challenge
            </Link>
            , with every constant exposed. For each frame:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">One angle.</strong>{" "}The chosen joint&rsquo;s angle at its
              middle point:{" "}
              {Object.values(JOINTS)
                .map((j) => `${j.label.toLowerCase()} (${j.points})`)
                .join(", ")}
              . A side is read only if all three points are at least the minimum visibility the model
              reports; the side setting picks left, right, the average of the visible sides, or the more
              visible one.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Smoothing.</strong> An exponential moving average with a
              time constant you set ({D.smoothingMs} ms to start), so it lags by about the same time at any
              frame rate. The faint line on the chart is the unsmoothed angle.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Two zones and a gap.</strong> For a movement that starts
              with the joint open (a squat, a push-up, a curl), the rest zone is above the top angle and the
              active zone below the bottom angle. The counter waits until the angle first holds in the rest
              zone, then needs the active zone, then the rest zone again: that return is one rep. An angle
              between the two thresholds changes nothing, which is why a wider gap rejects more jitter and
              misses more shallow reps.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Holding and pacing.</strong> A zone counts only after the
              angle stays in it for the minimum number of consecutive frames ({D.minFrames} to start), and a
              cycle completed faster than the minimum cycle time ({D.minCycleMs} ms to start) is drawn as a
              dotted tick and rejected, not counted.
            </li>
          </ol>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The page&rsquo;s own starting values (top {D.top}&deg;, bottom {D.bottom}&deg; on the knee) are
            the challenge&rsquo;s squat rule and are not calibrated for any exercise or camera. Every model
            frame&rsquo;s angles are kept in memory, so changing a threshold recounts the whole recording
            instantly without running the model again. That is the use of the page: find the values at which
            the count matches what you see, on footage shot the way your users will shoot it.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Starting from published rules</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The preset list loads the thresholds that licensed open-source exercise trackers ship, from{" "}
            <Link href="/tools/exercise-form-rules" className={linkCls}>
              the open exercise form-rules dataset
            </Link>
            : {FORM_RULE_PRESETS.length} rules from {new Set(FORM_RULE_PRESETS.map((p) => p.sourceId)).size}{" "}
            projects ({FORM_RULE_SOURCES.filter((s) => FORM_RULE_PRESETS.some((p) => p.sourceId === s.id))
              .map((s) => `${s.name}, ${s.license}`)
              .join("; ")}), each number read from the project&rsquo;s code on {FORM_RULES_FETCHED_ON}{" "}
            with the line it came from. A preset sets the joint, side, direction and the two angles; the
            frames, cycle time and smoothing stay this page&rsquo;s, because none of those projects states them
            in the same terms. Their
            thresholds are the authors&rsquo; choices for their own setups, not biomechanical standards, and
            the sources compute angles in 2D image coordinates, which is why that is the default here.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The exported JSON names its schema, every setting and, for a preset, the dataset rows it came
            from, so a config in your repository says where its numbers started.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Reading the trace</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">A rep is missing</strong> when its trough stops short of the
              bottom line, or when the angle never climbs back above the top line between reps. Move the line
              to the shape you see rather than the reverse.
            </li>
            <li>
              <strong className="text-[var(--fg)]">A rep is counted twice</strong> when noise crosses a line
              more than once. Widen the gap, raise the minimum frames or the smoothing, or raise the minimum
              cycle time.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Gaps in the line</strong>{" "}are frames with no reading: no
              person found, or the joint&rsquo;s points below the visibility floor. Side-on footage hides the
              far limb, which is what the side setting is for. Camera placement is covered in{" "}
              <Link href="/motion/how-rep-counting-works" className={linkCls}>
                how rep counting works
              </Link>{" "}
              and{" "}
              <Link href="/guides/improve-pose-detection-accuracy" className={linkCls}>
                improving pose detection accuracy
              </Link>
              .
            </li>
            <li>
              <strong className="text-[var(--fg)]">Image or world angles.</strong>{" "}Image angles are measured on
              the picture, with x scaled by the frame&rsquo;s aspect ratio, so they shrink when a limb points at
              the camera. World angles use the model&rsquo;s 3D landmarks in meters and depend less on where
              you stand, at the cost of the model&rsquo;s depth estimate.
            </li>
          </ul>
        </section>

        <section id="one-file" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The same counter in one HTML file</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            rep-counter.html is a squat counter in a single file of about 200 lines you can read in one sitting:
            Pose Landmarker {LITE.name.replace("Pose Landmarker ", "")}{" "}in{" "}
            <code className="font-mono text-sm">@mediapipe/tasks-vision</code> {TASKS_VISION_VERSION}{" "}from the same pinned
            addresses as this page, the knee angle with two thresholds and a gap between them, and one form cue. It
            counts a rep when the knee angle goes below {KIT_BOTTOM}&deg; and back above {KIT_TOP}&deg;, the example
            defaults Sousa and colleagues mark as adjustable, quoted on{" "}
            <Link href="/motion/squat-detection-pose-estimation" className={linkCls}>
              squat detection with pose estimation
            </Link>
            . The cue checks stance: foot width over shoulder width between {STANCE.value} and {STANCE.value2}, the range{" "}
            {STANCE_SRC.name} ({STANCE_SRC.license}) ships, read from its code on {FORM_RULES_FETCHED_ON}{" "}into{" "}
            <Link href="/tools/exercise-form-rules" className={linkCls}>
              the form-rules dataset
            </Link>
            . Neither is calibrated for your camera or your users, and the file says where each number came from.
          </p>
          <a
            href="/kit/rep-counter.html"
            download="rep-counter.html"
            data-cta="kit-rep-counter"
            data-cta-source="rep-counter-playground"
            className="mt-5 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Download rep-counter.html
          </a>
          <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">On your computer.</strong>{" "}Open the downloaded file in your
              browser. The camera API works only in a secure context, and MDN&rsquo;s table of secure contexts lists a
              file:// page as secure; we ran the file that way in Chromium with a test video as the camera.
            </li>
            <li>
              <strong className="text-[var(--fg)]">In CodePen.</strong>{" "}Create a Pen and drag the file onto it, or
              paste its contents into the Pen&rsquo;s index.html. CodePen&rsquo;s documentation says files can be
              dragged in or uploaded, and that its preview server answers / with /index.html.
            </li>
            <li>
              <strong className="text-[var(--fg)]">In StackBlitz.</strong>{" "}StackBlitz&rsquo;s documentation lists
              starter links such as vite.new; open one and put the file&rsquo;s contents in the project&rsquo;s
              index.html.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            We have not run the file inside CodePen or StackBlitz. If an editor&rsquo;s preview does not offer your
            camera, choose a video file instead. This page sends nothing to either service: there is no prefilled
            form, and you paste the file yourself. Count side-on and check stance facing the camera; why the view
            matters is shown in{" "}
            <Link href="/guides/improve-pose-detection-accuracy#camera-angle-simulator" className={linkCls}>
              the camera-angle simulator
            </Link>
            . The file is MIT-licensed, sends no frame anywhere, and, like this page, loads a runtime that posts its own
            usage report to Google.
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">What runs, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side. A video file is opened with an object URL and read by your
              browser&rsquo;s video element; it is not uploaded, stored or sent anywhere, and this site has no
              server code behind the page. Camera frames go from the video element into the model and are
              discarded; the page keeps only the angles, in memory, until you close the tab.
            </p>
            <p>
              The model is Google&rsquo;s Pose Landmarker ({LITE.name.replace("Pose Landmarker ", "")}, {mib(LITE.bytes)}, or{" "}
              {FULL.name.replace("Pose Landmarker ", "")}, {mib(FULL.bytes)}) in{" "}
              <code className="font-mono text-xs">@mediapipe/tasks-vision</code> {TASKS_VISION_VERSION}, loaded from
              cdn.jsdelivr.net and storage.googleapis.com when you press Analyze or Start, the same files and
              version as{" "}
              <Link href="/tools/pose-benchmark" className={linkCls}>
                the pose benchmark
              </Link>{" "}
              (checked {VERIFIED_ON}). The runtime also posts its own usage report to{" "}
              <code className="font-mono text-xs">{TASKS_VISION_USAGE_LOG_URL}</code>: in the library&rsquo;s code
              it carries the task name, running mode, an operating-system family, the library version and
              timing counters, and no image, video or landmark value. The synthetic demo loads no model at all.
            </p>
            <p>
              A video is analyzed as it plays (at the speed you pick), one model call per decoded frame the
              browser hands over, so a slow device analyzes fewer frames of the same clip. Slowing the playback
              gives the model more of them.
            </p>
          </div>
        </details>

        <KinestexNote path={PATH} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Time the same model on your device with{" "}
          <Link href="/tools/pose-benchmark" className={linkCls}>
            the pose benchmark
          </Link>
          , map keypoint indices between models with{" "}
          <Link href="/tools/keypoint-playground" className={linkCls}>
            the keypoint playground
          </Link>
          , or see every topic in camera-based tracking at{" "}
          <Link href="/motion" className={linkCls}>
            AI motion tracking
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
