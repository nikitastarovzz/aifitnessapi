import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import KinestexNote from "@/components/KinestexNote";
import PoseBenchmark from "@/components/tools/PoseBenchmark";
import { POSE_SCHEMES, POSE_KEYPOINTS_FETCHED_ON } from "@/data/poseKeypoints";
import { BENCH_MODELS, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * An in-browser Pose Landmarker benchmark.
 *
 * The /motion pages say, again and again, "verify on your target hardware".
 * This is the page that lets a reader do it without writing a harness: it
 * loads Google's published runtime and model files, times them on the
 * reader's own device, and prints a table they can paste into an issue or a
 * design doc. It states no speed or accuracy figure of its own — the model
 * card's are on /motion/mediapipe-pose-landmarker-models, with their date and
 * device, and the point here is that the reader's number replaces them.
 *
 * Facts on the page come from two places only: the generated keypoint
 * dataset (what each model outputs, with the source sentence beside it) and
 * the checks recorded in src/lib/poseBenchmark.ts (package version, file
 * URLs and sizes, read on VERIFIED_ON).
 */

const PATH = "/tools/pose-benchmark";
const UPDATED = "2026-10-31";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Pose Landmarker Benchmark on Your Device";
const DESCRIPTION =
  "Time MediaPipe Pose Landmarker lite, full and heavy on your own device: load time, median and p95 latency, FPS, delegate. Runs in the browser; no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Run MediaPipe Pose Landmarker on your own camera or a test frame and get load time, latency percentiles and FPS as a markdown table. Nothing is uploaded.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const blazepose = POSE_SCHEMES.find((s) => s.slug === "blazepose-33");
const coco = POSE_SCHEMES.find((s) => s.slug === "coco-17");
const PL_EVIDENCE = blazepose?.usedBy.find((u) => u.modelId === "mediapipe-pose-landmarker");
const PL_POINTS = blazepose?.points.length;
const NUM_POSES_NOTE = blazepose?.notes.find((n) => n.text === "num_poses: int = 1");
const MOVENET_EVIDENCE = coco?.notes.find((n) => /MoveNet/.test(n.text));

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function PoseBenchmarkPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "pose estimation benchmark in the browser",
    description: DESCRIPTION,
    datePublished: UPDATED,
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
            { name: "Pose benchmark", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={3} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Benchmark a pose model on your own device
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          The only latency number that predicts how a pose model will run in your app is one measured
          on the hardware it will run on. This page loads MediaPipe Pose Landmarker (lite, full and
          heavy) in your browser, runs it on your camera or a test frame, and reports load time,
          median and p95 inference time, frames per second and the delegate used, as a table you can
          copy as markdown. Frames never leave the tab: the page downloads Google&rsquo;s runtime and
          model files and uploads nothing.
        </p>

        <section data-tool="pose-benchmark" aria-label="In-browser pose model benchmark">
          <PoseBenchmark />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it runs</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Google&rsquo;s{" "}
            <code className="font-mono text-sm">@mediapipe/tasks-vision</code>{" "}package, version{" "}
            {TASKS_VISION_VERSION}{" "}(the stable release on the npm registry when this page was
            checked on {VERIFIED_ON}), loaded from cdn.jsdelivr.net only when you press Run. It
            runs in WebAssembly, and the package&rsquo;s <em>delegate</em> option asks for inference on
            the GPU or the CPU; the benchmark times each one you tick. If the landmarker cannot be
            created with a delegate on your browser, that row says so instead of a number.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The model files sit on the <code className="font-mono text-sm">float16/1/</code>{" "}path of
            Google&rsquo;s mediapipe-models storage bucket: the package README gives that URL for lite,
            and Google&rsquo;s Android sample downloads all three from it. On {VERIFIED_ON}{" "}they were served at{" "}
            {BENCH_MODELS.map((m, i) => (
              <span key={m.id}>
                {i > 0 ? (i === BENCH_MODELS.length - 1 ? " and " : ", ") : ""}
                {mib(m.bytes)}{" "}({m.id})
              </span>
            ))}
            . All three produce the same output:
            {PL_EVIDENCE ? (
              <>
                {" "}MediaPipe&rsquo;s own Tasks source declares{" "}
                <q>{PL_EVIDENCE.evidence.replace(/^.*"""(.*)"""$/, "$1")}</q>
              </>
            ) : null}{" "}
            ({PL_POINTS}{" "}points, indexed on the{" "}
            <Link href="/pose-keypoints/blazepose-33" className={linkCls}>
              BlazePose 33 keypoint reference
            </Link>
            ){NUM_POSES_NOTE ? ", and its num_poses option defaults to 1, which is what this page uses" : ""}.
            Which variant to ship is the question{" "}
            <Link href="/motion/mediapipe-pose-landmarker-models" className={linkCls}>
              Pose Landmarker lite vs full vs heavy
            </Link>{" "}
            answers; this page gives you your own numbers to answer it with.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Why MoveNet is not here yet</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            MoveNet Lightning and Thunder run in the browser through TensorFlow.js
            {MOVENET_EVIDENCE ? (
              <>
                , and the TF.js pose-detection README states <q>{MOVENET_EVIDENCE.text}</q>
              </>
            ) : null}
            . The package loads its weights from tfhub.dev unless you pass your own{" "}
            <code className="font-mono text-sm">modelUrl</code>, and when this page was built on{" "}
            {VERIFIED_ON}{" "}we could not reach tfhub.dev to confirm those files are still served. A
            benchmark that might time a failed download is worse than none, so MoveNet stays out until
            its weight URLs can be checked. Its variants and runtimes are covered in{" "}
            <Link href="/motion/movenet-models" className={linkCls}>
              MoveNet Lightning vs Thunder
            </Link>
            , and the head-to-head is{" "}
            <Link href="/compare/mediapipe-vs-movenet" className={linkCls}>
              MediaPipe vs MoveNet
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to read the numbers</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Load</strong>{" "}is the time from asking for a model to
              having it ready, so on a first run it includes the download. The second delegate for the
              same model may be served the file from the browser&rsquo;s cache, so compare loads across
              runs, not within one.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Median and p95</strong> time one call to{" "}
              <code className="font-mono text-sm">detectForVideo</code>, which returns the landmarks to
              JavaScript, after {10}{" "}warm-up frames are discarded. p95 is the frame your users notice:
              a good median with a long tail still stutters.
            </li>
            <li>
              <strong className="text-[var(--fg)]">1000/mean fps</strong> is the ceiling inference alone
              allows. <strong className="text-[var(--fg)]">Loop fps</strong>{" "}is what the page actually
              achieved with one inference per animation frame, so it is also capped by how often the
              browser paints; it is the closer estimate of a live overlay.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Pose found</strong> counts frames with a detected
              pose. In video mode the landmarker tracks a found pose from frame to frame, so a run with
              no person in view can time differently from one with a person in it. The synthetic
              frame is a drawn figure, not a photo, and is for timing only.
            </li>
            <li>
              A browser is not your app. A native Android or iOS build of the same model runs through a
              different runtime and delegate, and a background tab, low-power mode or a hot device all
              slow the loop. Run it more than once, on the lowest-end device you intend to support.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            What to do with the result is the subject of{" "}
            <Link href="/motion/real-time-pose-estimation" className={linkCls}>
              real-time pose estimation
            </Link>{" "}
            and{" "}
            <Link href="/motion/pose-estimation-hardware-requirements" className={linkCls}>
              pose estimation hardware requirements
            </Link>
            ; the wider choice of model is{" "}
            <Link href="/motion/pose-estimation-models-compared" className={linkCls}>
              pose estimation models compared
            </Link>
            , with the native alternatives in{" "}
            <Link href="/compare/apple-vision-vs-mediapipe" className={linkCls}>
              Apple Vision vs MediaPipe
            </Link>{" "}
            and{" "}
            <Link href="/compare/ml-kit-vs-mediapipe" className={linkCls}>
              ML Kit vs MediaPipe
            </Link>
            .
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side. Camera frames go from your browser&rsquo;s video element
              straight into the WebAssembly runtime and are never stored, sent or recorded; this site
              has no server code behind this page and logs no event from it beyond its ordinary page
              view. The network requests the page makes are the ones any app using the library makes:
              the runtime from cdn.jsdelivr.net and each model file from storage.googleapis.com, so
              those hosts see an ordinary download.
            </p>
            <p>
              The device details are what your browser chooses to report. Some browsers hide the GPU
              name or round the memory figure on purpose, and the table says &ldquo;not
              reported&rdquo; rather than guessing.
            </p>
            <p>
              The package version, the file URLs and their sizes were checked on {VERIFIED_ON}{" "}
              against the npm registry, the package README and Google&rsquo;s sample code. The
              keypoint facts come from this site&rsquo;s keypoint dataset, read from the models&rsquo;
              own source files on {POSE_KEYPOINTS_FETCHED_ON}{" "}and published under CC BY 4.0 on{" "}
              <Link href="/datasets" className={linkCls}>
                open datasets
              </Link>
              .
            </p>
          </div>
        </details>

        <KinestexNote path={PATH} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Every topic in camera-based tracking is at{" "}
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
