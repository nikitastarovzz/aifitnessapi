import { POSE_SCHEMES, POSE_KEYPOINTS_FETCHED_ON } from "@/data/poseKeypoints";
import { BENCH_MODELS, TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import { POSE_BENCHMARK_RESULTS_IMPORTED_ON } from "@/data/poseBenchmarkResults";
import { ACCEPT_LABEL, REPO, TITLE_PREFIX } from "@/lib/poseBenchmarkSubmission.mjs";
import { LEADERBOARD_TEMPLATE_URL, leaderboardGroups, leaderboardMs } from "@/lib/poseLeaderboard";
import { site } from "@/lib/site";
import { interactiveNote, link, table, type MirrorDoc } from "./core";

const PATH = "/tools/pose-benchmark";
const UPDATED = "2026-10-31";

/** /tools/pose-benchmark.md — mirrors src/app/tools/pose-benchmark/page.tsx. */
export function poseBenchmarkMirror(): MirrorDoc {
  const groups = leaderboardGroups();
  const leaderboard = [
    "## Leaderboard: runs readers submitted",
    "",
    `After a run, the page offers a prefilled GitHub issue in this site’s public repository (${link(REPO, `https://github.com/${REPO}`)}). A maintainer checks that the numbers came from the page and adds the \`${ACCEPT_LABEL}\` label, and the next build lists the run here with a link to its issue. Each row is one run on one device, copied as submitted; the order within a model is by median latency on that run and is not a ranking of hardware.`,
    "",
    ...(groups.length === 0
      ? [
          "No submissions yet. Be the first.",
          "",
          `Run the benchmark above, then press **Submit to the leaderboard on GitHub**. You can also start from the ${link("issue template", LEADERBOARD_TEMPLATE_URL)} (titles start with \`${TITLE_PREFIX}\`). This table shows no numbers until a real run is accepted: none are filled in for it.`,
          "",
        ]
      : [
          ...groups.flatMap((g) => [
            `### ${g.model}, ${g.delegate} delegate`,
            "",
            ...table(
              ["Platform", "GPU (as reported)", "Median ms", "p95 ms", "Loop fps", "Runtime", "Issue"],
              g.rows.map(({ sub, row }) => [
                sub.device?.platform ?? "not reported",
                sub.device?.gpu ?? "not reported",
                leaderboardMs(row.medianMs),
                leaderboardMs(row.p95Ms),
                row.loopFps === null ? "—" : row.loopFps.toFixed(1),
                sub.runtime,
                `${link(`#${sub.issue}`, sub.issueUrl)}${sub.submittedOn ? ` · ${sub.submittedOn}` : ""}`,
              ]),
            ),
          ]),
          `Imported ${POSE_BENCHMARK_RESULTS_IMPORTED_ON}.`,
          "",
        ]),
  ];
  const blazepose = POSE_SCHEMES.find((s) => s.slug === "blazepose-33");
  const coco = POSE_SCHEMES.find((s) => s.slug === "coco-17");
  const plEvidence = blazepose?.usedBy.find((u) => u.modelId === "mediapipe-pose-landmarker");
  const numPoses = blazepose?.notes.find((n) => n.text === "num_poses: int = 1");
  const movenet = coco?.notes.find((n) => /MoveNet/.test(n.text));
  const sizes = BENCH_MODELS.map((m, i) => `${i > 0 ? (i === BENCH_MODELS.length - 1 ? " and " : ", ") : ""}${mib(m.bytes)} (${m.id})`).join("");

  return {
    path: PATH,
    title: "Benchmark a pose model on your own device",
    description:
      "Time MediaPipe Pose Landmarker lite, full and heavy on your own device: load time, median and p95 latency, FPS, delegate. In the browser; no video upload.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "The only latency number that predicts how a pose model will run in your app is one measured on the hardware it will run on. This page loads MediaPipe Pose Landmarker (lite, full and heavy) in your browser, runs it on your camera or a test frame, and reports load time, median and p95 inference time, frames per second and the delegate used, as a table you can copy as markdown. Frames never leave the tab: the page downloads Google’s runtime and model files and sends nothing from the camera; the runtime’s own usage report to Google carries timings, not images.",
    body: [
      interactiveNote(PATH, "the benchmark runner"),
      "",
      ...leaderboard,
      "## What it runs",
      "",
      `Google’s \`@mediapipe/tasks-vision\` package, version ${TASKS_VISION_VERSION} (the stable release on the npm registry when this page was checked on ${VERIFIED_ON}), loaded from cdn.jsdelivr.net only when you press Run. It runs in WebAssembly, and the package’s *delegate* option asks for inference on the GPU or the CPU; the benchmark times each one you tick. If the landmarker cannot be created with a delegate on your browser, that row says so instead of a number.`,
      "",
      `The model files sit on the \`float16/1/\` path of Google’s mediapipe-models storage bucket: the package README gives that URL for lite, and Google’s Android sample downloads all three from it. On ${VERIFIED_ON} they were served at ${sizes}. All three produce the same output:${plEvidence ? ` MediaPipe’s own Tasks source declares “${plEvidence.evidence.replace(/^.*"""(.*)"""$/, "$1")}”` : ""} (${blazepose?.points.length} points, indexed on the ${link("BlazePose 33 keypoint reference", "/pose-keypoints/blazepose-33")})${numPoses ? ", and its num_poses option defaults to 1, which is what this page uses" : ""}. Which variant to ship is the question ${link("Pose Landmarker lite vs full vs heavy", "/motion/mediapipe-pose-landmarker-models")} answers; this page gives you your own numbers to answer it with.`,
      "",
      "## Why MoveNet is not here yet",
      "",
      `MoveNet Lightning and Thunder run in the browser through TensorFlow.js${movenet ? `, and the TF.js pose-detection README states “${movenet.text}”` : ""}. The package loads its weights from tfhub.dev unless you pass your own \`modelUrl\`, and when this page was built on ${VERIFIED_ON} we could not reach tfhub.dev to confirm those files are still served. A benchmark that might time a failed download is worse than none, so MoveNet stays out until its weight URLs can be checked. Its variants and runtimes are covered in ${link("MoveNet Lightning vs Thunder", "/motion/movenet-models")}, and the head-to-head is ${link("MediaPipe vs MoveNet", "/compare/mediapipe-vs-movenet")}.`,
      "",
      "## How to read the numbers",
      "",
      "- **Load** is the time from asking for a model to having it ready, so on a first run it includes the download. The second delegate for the same model may be served the file from the browser’s cache, so compare loads across runs, not within one.",
      "- **Median and p95** time one call to `detectForVideo`, which returns the landmarks to JavaScript, after 10 warm-up frames are discarded. p95 is the frame your users notice: a good median with a long tail still stutters.",
      "- **1000/mean fps** is the ceiling inference alone allows. **Loop fps** is what the page actually achieved with one inference per animation frame, so it is also capped by how often the browser paints; it is the closer estimate of a live overlay.",
      "- **Pose found** counts frames with a detected pose. In video mode the landmarker tracks a found pose from frame to frame, so a run with no person in view can time differently from one with a person in it. The synthetic frame is a drawn figure, not a photo, and is for timing only.",
      "- A browser is not your app. A native Android or iOS build of the same model runs through a different runtime and delegate, and a background tab, low-power mode or a hot device all slow the loop. Run it more than once, on the lowest-end device you intend to support.",
      "",
      `What to do with the result is the subject of ${link("real-time pose estimation", "/motion/real-time-pose-estimation")} and ${link("pose estimation hardware requirements", "/motion/pose-estimation-hardware-requirements")}; the wider choice of model is ${link("pose estimation models compared", "/motion/pose-estimation-models-compared")}, with the native alternatives in ${link("Apple Vision vs MediaPipe", "/compare/apple-vision-vs-mediapipe")} and ${link("ML Kit vs MediaPipe", "/compare/ml-kit-vs-mediapipe")}.`,
      "",
      "## How this works, and what it sends",
      "",
      "Everything runs client-side. Camera frames go from your browser’s video element straight into the WebAssembly runtime and are never stored, sent or recorded; this site has no server code behind this page and logs no event from it beyond its ordinary page view. The network requests the page makes are the ones any app using the library makes: the runtime from cdn.jsdelivr.net and each model file from storage.googleapis.com, so those hosts see an ordinary download.",
      "",
      `The runtime also reports its own usage to Google. Version ${TASKS_VISION_VERSION} posts to \`${TASKS_VISION_USAGE_LOG_URL}\` about once a minute and when a model closes, which we saw in our own test of this page on ${VERIFIED_ON}. In the library’s code the report is built from the task name, the running mode, an operating-system family read from the user agent, the library version and timing counters such as frames processed and latency; no image, video or landmark value goes into it. Its public options offer no switch to turn it off, and blocking that host does not stop the benchmark.`,
      "",
      "The device details are what your browser chooses to report. Some browsers hide the GPU name or round the memory figure on purpose, and the table says “not reported” rather than guessing.",
      "",
      `The package version, the file URLs and their sizes were checked on ${VERIFIED_ON} against the npm registry, the package README and Google’s sample code. The keypoint facts come from this site’s keypoint dataset, read from the models’ own source files on ${POSE_KEYPOINTS_FETCHED_ON} and published under CC BY 4.0 on ${link("open datasets", "/datasets")}.`,
      "",
      `A free tool from ${site.name}. To see the same lite model count reps, try ${link("the 30-second rep challenge", "/challenge")}. Every topic in camera-based tracking is at ${link("AI motion tracking", "/motion")}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
