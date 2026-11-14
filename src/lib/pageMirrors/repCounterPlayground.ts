import { FORM_RULE_PRESETS, FORM_RULE_SOURCES, FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { BENCH_MODELS, TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import { DEFAULT_CONFIG as D, JOINTS } from "@/lib/repPlayground.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/tools/rep-counter-playground";
const UPDATED = "2026-11-05";

/** /tools/rep-counter-playground.md — mirrors src/app/tools/rep-counter-playground/page.tsx.
 *  Joints, starting values, preset counts and model facts come from the
 *  modules the page renders. */
export function repCounterPlaygroundMirror(): MirrorDoc {
  const model = (id: string) => {
    const m = BENCH_MODELS.find((x) => x.id === id);
    if (!m) throw new Error(`rep-counter-playground mirror: no ${id} model in src/lib/poseBenchmark.ts`);
    return m;
  };
  const LITE = model("lite");
  const FULL = model("full");
  const presetSources = FORM_RULE_SOURCES.filter((s) => FORM_RULE_PRESETS.some((p) => p.sourceId === s.id));

  return {
    path: PATH,
    title: "Rep counter playground: tune the thresholds on your own video",
    description:
      "Load a workout video, see knee, hip, elbow and shoulder angles over time, tune a rep counter's thresholds and export the config. Runs in your browser.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "A camera rep counter usually reduces each frame to one joint angle and counts a rep each time that angle crosses a bottom threshold and comes back past a top one, with a gap between the two so jitter cannot count. This page runs MediaPipe Pose Landmarker on a video file or your webcam in your browser, draws the knee, hip, elbow and shoulder angles over time, and recounts the whole recording as you move the top and bottom angles, the minimum frames and the minimum cycle time. Export the result as a JSON config. The video is never uploaded.",
    body: [
      interactiveNote(PATH, "the video and webcam analyzer, angle chart, threshold controls and JSON export"),
      "",
      "## How the counter decides",
      "",
      `It is the same state machine as ${link("the 30-second rep challenge", "/challenge")}, with every constant exposed. For each frame:`,
      "",
      `1. **One angle.** The chosen joint’s angle at its middle point: ${Object.values(JOINTS)
        .map((j) => `${j.label.toLowerCase()} (${j.points})`)
        .join(", ")}. A side is read only if all three points are at least the minimum visibility the model reports; the side setting picks left, right, the average of the visible sides, or the more visible one.`,
      `2. **Smoothing.** An exponential moving average with a time constant you set (${D.smoothingMs} ms to start), so it lags by about the same time at any frame rate. The faint line on the chart is the unsmoothed angle.`,
      "3. **Two zones and a gap.** For a movement that starts with the joint open (a squat, a push-up, a curl), the rest zone is above the top angle and the active zone below the bottom angle. The counter waits until the angle first holds in the rest zone, then needs the active zone, then the rest zone again: that return is one rep. An angle between the two thresholds changes nothing, which is why a wider gap rejects more jitter and misses more shallow reps.",
      `4. **Holding and pacing.** A zone counts only after the angle stays in it for the minimum number of consecutive frames (${D.minFrames} to start), and a cycle completed faster than the minimum cycle time (${D.minCycleMs} ms to start) is drawn as a dotted tick and rejected, not counted.`,
      "",
      `The page’s own starting values (top ${D.top}°, bottom ${D.bottom}° on the knee) are the challenge’s squat rule and are not calibrated for any exercise or camera. Every model frame’s angles are kept in memory, so changing a threshold recounts the whole recording instantly without running the model again. That is the use of the page: find the values at which the count matches what you see, on footage shot the way your users will shoot it.`,
      "",
      "## Starting from published rules",
      "",
      `The preset list loads the thresholds that licensed open-source exercise trackers ship, from ${link("the open exercise form-rules dataset", "/tools/exercise-form-rules")}: ${FORM_RULE_PRESETS.length} rules from ${new Set(FORM_RULE_PRESETS.map((p) => p.sourceId)).size} projects (${presetSources.map((s) => `${s.name}, ${s.license}`).join("; ")}), each number read from the project’s code on ${FORM_RULES_FETCHED_ON} with the line it came from. A preset sets the joint, side, direction and the two angles; the frames, cycle time and smoothing stay this page’s, because none of those projects states them in the same terms. Their thresholds are the authors’ choices for their own setups, not biomechanical standards, and the sources compute angles in 2D image coordinates, which is why that is the default here.`,
      "",
      "The exported JSON names its schema, every setting and, for a preset, the dataset rows it came from, so a config in your repository says where its numbers started.",
      "",
      "## Reading the trace",
      "",
      "- **A rep is missing** when its trough stops short of the bottom line, or when the angle never climbs back above the top line between reps. Move the line to the shape you see rather than the reverse.",
      "- **A rep is counted twice** when noise crosses a line more than once. Widen the gap, raise the minimum frames or the smoothing, or raise the minimum cycle time.",
      `- **Gaps in the line** are frames with no reading: no person found, or the joint’s points below the visibility floor. Side-on footage hides the far limb, which is what the side setting is for. Camera placement is covered in ${link("how rep counting works", "/motion/how-rep-counting-works")} and ${link("improving pose detection accuracy", "/guides/improve-pose-detection-accuracy")}.`,
      "- **Image or world angles.** Image angles are measured on the picture, with x scaled by the frame’s aspect ratio, so they shrink when a limb points at the camera. World angles use the model’s 3D landmarks in meters and depend less on where you stand, at the cost of the model’s depth estimate.",
      "",
      "## What runs, and what it sends",
      "",
      "Everything runs client-side. A video file is opened with an object URL and read by your browser’s video element; it is not uploaded, stored or sent anywhere, and this site has no server code behind the page. Camera frames go from the video element into the model and are discarded; the page keeps only the angles, in memory, until you close the tab.",
      "",
      `The model is Google’s Pose Landmarker (${LITE.name.replace("Pose Landmarker ", "")}, ${mib(LITE.bytes)}, or ${FULL.name.replace("Pose Landmarker ", "")}, ${mib(FULL.bytes)}) in \`@mediapipe/tasks-vision\` ${TASKS_VISION_VERSION}, loaded from cdn.jsdelivr.net and storage.googleapis.com when you press Analyze or Start, the same files and version as ${link("the pose benchmark", "/tools/pose-benchmark")} (checked ${VERIFIED_ON}). The runtime also posts its own usage report to \`${TASKS_VISION_USAGE_LOG_URL}\`: in the library’s code it carries the task name, running mode, an operating-system family, the library version and timing counters, and no image, video or landmark value. The synthetic demo loads no model at all.`,
      "",
      "A video is analyzed as it plays (at the speed you pick), one model call per decoded frame the browser hands over, so a slow device analyzes fewer frames of the same clip. Slowing the playback gives the model more of them.",
      "",
      `A free tool from ${site.name}. Time the same model on your device with ${link("the pose benchmark", "/tools/pose-benchmark")}, map keypoint indices between models with ${link("the keypoint playground", "/tools/keypoint-playground")}, or see every topic in camera-based tracking at ${link("AI motion tracking", "/motion")}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
