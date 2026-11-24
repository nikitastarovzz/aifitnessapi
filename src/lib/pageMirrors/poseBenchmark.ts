import { POSE_SCHEMES, POSE_KEYPOINTS_FETCHED_ON } from "@/data/poseKeypoints";
import {
  BENCH_MODELS,
  MOVENET_MODELS,
  MOVENET_VERIFIED_ON,
  POSE_DETECTION_VERSION,
  TASKS_VISION_USAGE_LOG_URL,
  TASKS_VISION_VERSION,
  TFJS_VERSION,
  VERIFIED_ON,
  mib,
} from "@/lib/poseBenchmark";
import { POSE_BENCHMARK_RESULTS_IMPORTED_ON } from "@/data/poseBenchmarkResults";
import { ACCEPT_LABEL, REPO, TITLE_PREFIX } from "@/lib/poseBenchmarkSubmission.mjs";
import { LEADERBOARD_TEMPLATE_URL, leaderboardDelegate, leaderboardGroups, leaderboardMs, leaderboardRuntime } from "@/lib/poseLeaderboard";
import { DRAW_SCORE_MIN, FRAME_H, FRAME_W, METER_FRAMES, RECORD_MS } from "@/lib/poseArena.mjs";
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
            `### ${g.model}, ${leaderboardDelegate(g.model, g.delegate)}`,
            "",
            ...table(
              ["Platform", "GPU (as reported)", "Median ms", "p95 ms", "Loop fps", "Runtime", "Issue"],
              g.rows.map(({ sub, row }) => [
                sub.device?.platform ?? "not reported",
                sub.device?.gpu ?? "not reported",
                leaderboardMs(row.medianMs),
                leaderboardMs(row.p95Ms),
                row.loopFps === null ? "—" : row.loopFps.toFixed(1),
                leaderboardRuntime(sub, row),
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
  const moveNetUrls = MOVENET_MODELS.map((m) => `\`${m.url}\``).join(" and ");
  const sizes = BENCH_MODELS.map((m, i) => `${i > 0 ? (i === BENCH_MODELS.length - 1 ? " and " : ", ") : ""}${mib(m.bytes)} (${m.id})`).join("");

  return {
    path: PATH,
    title: "Benchmark a pose model on your own device",
    description:
      "Time MediaPipe Pose Landmarker lite, full and heavy, and MoveNet Lightning and Thunder, on your own device: median and p95 latency, FPS. No video upload.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "The only latency number that predicts how a pose model will run in your app is one measured on the hardware it will run on. This page loads MediaPipe Pose Landmarker (lite, full and heavy) in your browser, and MoveNet SinglePose Lightning and Thunder through TensorFlow.js if you tick them, runs them on your camera or a test frame with the same timing loop, and reports load time, median and p95 inference time, frames per second and the delegate used, as one table you can copy as markdown. Frames never leave the tab: the page downloads the runtimes and model files and sends nothing from the camera; the MediaPipe runtime’s own usage report to Google carries timings, not images.",
    body: [
      interactiveNote(PATH, "the benchmark runner"),
      "",
      ...leaderboard,
      "## Pose arena: both models on the same frames",
      "",
      `The arena runs one MediaPipe Pose Landmarker model and one MoveNet model side by side on your camera or on a video file from your device. Each frame is drawn once into a single ${FRAME_W}×${FRAME_H} image and that same image goes to both models, so the two panels show what each model returns for identical pixels: MediaPipe’s landmarks in blue on the left, MoveNet’s keypoints in orange on the right. The lines join the same twelve limb joints in both and are this page’s drawing; a hollow dot is a keypoint the model scored below ${DRAW_SCORE_MIN}, a cutoff chosen for the picture.`,
      "",
      interactiveNote(`${PATH}#arena`, "the pose arena and its 5-second recorder"),
      "",
      `Each panel’s rate is 1,000 divided by that model’s mean inference time over the last ${METER_FRAMES} frames: what the model alone could sustain on your device. The arena runs both models on every frame, one after the other, so it redraws slower than either rate and the two compete for the same processor. The benchmark above runs one model at a time and is the measurement to quote.`,
      "",
      `**Record ${RECORD_MS / 1000} seconds** saves the arena as a video your browser makes (WebM where it can, MP4 otherwise) for you to download; nothing is uploaded. The caption under the panels, with both model names, their rates and this page’s address, is drawn into every frame, so a clip you share says where it came from. If MoveNet’s weights cannot be downloaded from tfhub.dev, its panel says so and MediaPipe keeps running.`,
      "",
      "## What it runs",
      "",
      `Google’s \`@mediapipe/tasks-vision\` package, version ${TASKS_VISION_VERSION} (the stable release on the npm registry when this page was checked on ${VERIFIED_ON}), loaded from cdn.jsdelivr.net only when you press Run. It runs in WebAssembly, and the package’s *delegate* option asks for inference on the GPU or the CPU; the benchmark times each one you tick. If the landmarker cannot be created with a delegate on your browser, that row says so instead of a number.`,
      "",
      `The model files sit on the \`float16/1/\` path of Google’s mediapipe-models storage bucket: the package README gives that URL for lite, and Google’s Android sample downloads all three from it. On ${VERIFIED_ON} they were served at ${sizes}. All three produce the same output:${plEvidence ? ` MediaPipe’s own Tasks source declares “${plEvidence.evidence.replace(/^.*"""(.*)"""$/, "$1")}”` : ""} (${blazepose?.points.length} points, indexed on the ${link("BlazePose 33 keypoint reference", "/pose-keypoints/blazepose-33")})${numPoses ? ", and its num_poses option defaults to 1, which is what this page uses" : ""}. Which variant to ship is the question ${link("Pose Landmarker lite vs full vs heavy", "/motion/mediapipe-pose-landmarker-models")} answers; this page gives you your own numbers to answer it with.`,
      "",
      "## MoveNet beside MediaPipe",
      "",
      `MoveNet Lightning and Thunder run in the browser through TensorFlow.js${movenet ? `, and the TF.js pose-detection README states “${movenet.text}”` : ""}. Tick them and the page loads \`@tensorflow-models/pose-detection\` ${POSE_DETECTION_VERSION} on TensorFlow.js ${TFJS_VERSION} (the latest releases on the npm registry when this was checked on ${MOVENET_VERIFIED_ON}) from cdn.jsdelivr.net, and the detector downloads its weights from the tfhub.dev addresses the package’s own source names: ${moveNetUrls}. The GPU box runs MoveNet on TF.js’s WebGL backend and the CPU box on its WebAssembly backend, the closest match to MediaPipe’s two delegates. Both families go through the same loop on the same input: the same warm-up, the same number of frames, one call per animation frame and the same percentiles, so the rows are comparable on your device.`,
      "",
      `The two families output different keypoint sets: Pose Landmarker ${blazepose?.points.length ?? 33} landmarks, MoveNet the ${coco?.points.length ?? 17} COCO keypoints, so a faster row is not doing the same job; the indices are on ${link("pose keypoint maps", "/pose-keypoints")}.`,
      "",
      `One limit we state plainly: on ${MOVENET_VERIFIED_ON} both tfhub.dev addresses answered with a TensorFlow.js graph model (Lightning with a 192×192 input, Thunder with 256×256), served through a redirect to Kaggle’s model storage, but our development environment’s network refused tfhub.dev, so we have not watched a MoveNet row complete on this page ourselves. If the download fails in your browser, the row says so instead of showing a number. The variants are covered in ${link("MoveNet Lightning vs Thunder", "/motion/movenet-models")}, and the head-to-head is ${link("MediaPipe vs MoveNet", "/compare/mediapipe-vs-movenet")}.`,
      "",
      "## How to read the numbers",
      "",
      "- **Load** is the time from asking for a model to having it ready, so on a first run it includes the download. The second delegate for the same model may be served the file from the browser’s cache, so compare loads across runs, not within one.",
      "- **Median and p95** time one call to `detectForVideo` (MediaPipe) or `estimatePoses` (MoveNet), each of which returns the keypoints to JavaScript, after 10 warm-up frames are discarded. p95 is the frame your users notice: a good median with a long tail still stutters.",
      "- **1000/mean fps** is the ceiling inference alone allows. **Loop fps** is what the page actually achieved with one inference per animation frame, so it is also capped by how often the browser paints; it is the closer estimate of a live overlay.",
      "- **Pose found** counts frames with a detected pose. In video mode the landmarker tracks a found pose from frame to frame, so a run with no person in view can time differently from one with a person in it. The synthetic frame is a drawn figure, not a photo, and is for timing only.",
      "- A browser is not your app. A native Android or iOS build of the same model runs through a different runtime and delegate, and a background tab, low-power mode or a hot device all slow the loop. Run it more than once, on the lowest-end device you intend to support.",
      "",
      `What to do with the result is the subject of ${link("real-time pose estimation", "/motion/real-time-pose-estimation")} and ${link("pose estimation hardware requirements", "/motion/pose-estimation-hardware-requirements")}; the wider choice of model is ${link("pose estimation models compared", "/motion/pose-estimation-models-compared")}, with the native alternatives in ${link("Apple Vision vs MediaPipe", "/compare/apple-vision-vs-mediapipe")} and ${link("ML Kit vs MediaPipe", "/compare/ml-kit-vs-mediapipe")}.`,
      "",
      "## How this works, and what it sends",
      "",
      "Everything runs client-side. Camera frames go from your browser’s video element straight into the WebAssembly runtime and are never stored or sent; the only recording is the arena’s, made in your browser when you press Record and kept there until you download it. This site has no server code behind this page and logs no event from it beyond its ordinary page view and a click on the arena’s download button. The network requests the page makes are the ones any app using the libraries makes: the runtimes from cdn.jsdelivr.net, each MediaPipe model file from storage.googleapis.com and, only if you tick MoveNet, its weights from tfhub.dev (and any host that download is redirected to), so those hosts see an ordinary download.",
      "",
      `The runtime also reports its own usage to Google. Version ${TASKS_VISION_VERSION} posts to \`${TASKS_VISION_USAGE_LOG_URL}\` about once a minute and when a model closes, which we saw in our own test of this page on ${VERIFIED_ON}. In the library’s code the report is built from the task name, the running mode, an operating-system family read from the user agent, the library version and timing counters such as frames processed and latency; no image, video or landmark value goes into it. Its public options offer no switch to turn it off, and blocking that host does not stop the benchmark. The TensorFlow.js ${TFJS_VERSION} and pose-detection ${POSE_DETECTION_VERSION} bundles the MoveNet rows load name no reporting address: when we listed every URL in them on ${MOVENET_VERIFIED_ON}, they were model hosts and documentation links only.`,
      "",
      "The device details are what your browser chooses to report. Some browsers hide the GPU name or round the memory figure on purpose, and the table says “not reported” rather than guessing.",
      "",
      `The package version, the file URLs and their sizes were checked on ${VERIFIED_ON} against the npm registry, the package README and Google’s sample code. The keypoint facts come from this site’s keypoint dataset, read from the models’ own source files on ${POSE_KEYPOINTS_FETCHED_ON} and published under CC BY 4.0 on ${link("open datasets", "/datasets")}.`,
      "",
      `A free tool from ${site.name}. To see the same lite model count reps, try ${link("the 30-second rep challenge", "/challenge")}. Every topic in camera-based tracking is at ${link("AI motion tracking", "/motion")}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
