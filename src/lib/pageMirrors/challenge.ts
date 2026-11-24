import {
  CHALLENGE_FAQS,
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
import { TASKS_VISION_USAGE_LOG_URL, TASKS_VISION_VERSION, VERIFIED_ON, mib } from "@/lib/poseBenchmark";
import { CHALLENGE_SECONDS, COUNTDOWN_SECONDS, MIN_HOLD_MS, SMOOTHING_MS, VISIBILITY_MIN, describeZone } from "@/lib/repCounter.mjs";
import { site } from "@/lib/site";
import { faqSection, interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/challenge";
const UPDATED = "2026-10-31";

/** /challenge.md — mirrors src/app/challenge/page.tsx: the counting rules with
 *  every threshold read from the counter module, the failure modes and FAQs. */
export function challengeMirror(): MirrorDoc {
  return {
    path: PATH,
    title: "The 30-second rep challenge",
    description:
      "Squats, jumping jacks, push-ups or lunges in 30 seconds, or a plank hold, counted live by a pose model in your browser. The video stays on your device.",
    updated: UPDATED,
    type: "game",
    capsule: `Pick squats, jumping jacks, push-ups or lunges and do as many as you can in ${CHALLENGE_SECONDS} seconds, or hold a plank as long as you can. A pose model running in your browser finds your joints in every frame, a few angle rules count the reps (or time the plank) live, and at the end you get a score card and a link that challenges someone to beat your number. It is a game and a demo of how camera rep counting works, not coaching: the rules are simple, the count can be wrong, and your camera frames never leave this tab.`,
    body: [
      interactiveNote(PATH, "the webcam challenge"),
      "",
      `Before you start: clear some space, stand far enough back that the camera sees you from head to feet, and stop if anything hurts. For push-ups and the plank, put the camera at floor level and turn side-on to it. The camera is asked for only when you press Start camera, and the preview shows the skeleton and the angle before anything counts. Press Go for a ${COUNTDOWN_SECONDS}-second countdown; reps during it do not count.`,
      "",
      "## How the counting works",
      "",
      `The counter is the method ${link("how rep counting works", "/motion/how-rep-counting-works")} describes, kept short enough to print in full here. Every number below is read from the same module the page runs, so this text and the code cannot disagree.`,
      "",
      `1. **Landmarks.** Google’s \`@mediapipe/tasks-vision\` ${TASKS_VISION_VERSION} runs ${LITE.name} (${mib(LITE.bytes)}) on each frame and returns ${KEYPOINT_COUNT} points, indexed on the ${link("BlazePose 33 map", "/pose-keypoints/blazepose-33")}, each with a visibility score. It also returns the same pose as world landmarks, which the package’s type definitions describe as coordinates in meters; the angle is computed from those, so it does not depend on where you stand in the frame.`,
      `2. **One angle.** For squats and lunges, the ${SQUAT.angleName} at the knee between hip and ankle, averaged over the legs the camera can see. For jumping jacks, the ${JACK.angleName} at the shoulder between hip and wrist, averaged over both arms, and only when both are visible. For push-ups, the ${PUSHUP.angleName} at the elbow between shoulder and wrist, averaged over the arms the camera can see. A side is used only when its three landmarks each report a visibility of at least ${VISIBILITY_MIN}; otherwise the frame has no reading and the counter waits.`,
      `3. **Smoothing.** The angle passes through a moving average with a ${SMOOTHING_MS} ms time constant, so single-frame jitter is damped by the same amount at any frame rate.`,
      `4. **Two zones with a gap.** A squat rep is the angle going ${describeZone(SQUAT.active)} (${SQUAT.activeName}) and back ${describeZone(SQUAT.rest)} (${SQUAT.restName}). A jumping jack is ${describeZone(JACK.active)} (${JACK.activeName}) and back ${describeZone(JACK.rest)} (${JACK.restName}). A push-up is ${describeZone(PUSHUP.active)} (${PUSHUP.activeName}) and back ${describeZone(PUSHUP.rest)} (${PUSHUP.restName}). A lunge is ${describeZone(LUNGE.active)} (${LUNGE.activeName}) and back ${describeZone(LUNGE.rest)} (${LUNGE.restName}). The gap between the zones is the hysteresis: an angle hovering at one boundary cannot finish a cycle on its own. You have to start in the rest zone, so beginning at the bottom of a squat is not half a rep.`,
      `5. **Hold and speed limits.** A zone has to hold for ${MIN_HOLD_MS} ms of frames (two frames at 30 frames per second) before the phase changes, which drops one-frame glitches. A cycle that completes faster than ${SQUAT.minCycleMs} ms for a squat, ${JACK.minCycleMs} ms for a jumping jack, ${PUSHUP.minCycleMs} ms for a push-up or ${LUNGE.minCycleMs} ms for a lunge is rejected, and the result says how many were.`,
      `6. **The plank is timed, not counted.** A frame is in position when the angle at the hip between shoulder and ankle is above ${PLANK.STRAIGHT_MIN}° (a straight body) and the line from shoulders to ankles is within ${PLANK.TILT_MAX}° of level in the image (so standing up straight does not count). The clock starts once that has held for ${PLANK.ENTER_MS} ms, pauses when it fails, and stops when it has failed for ${PLANK.GRACE_MS / 1000} seconds in a row, or at ${PLANK.MAX_SECONDS / 60} minutes. Time out of position is not counted.`,
      "",
      `Where the thresholds come from: the squat values are the example definition ${link("squat detection with pose estimation", "/motion/squat-detection-pose-estimation")} reports from a 2026 study, which marks them as adjustable defaults. The jumping-jack values are our own choice for a frontal webcam: ${link("the jumping jack counter page", "/motion/jumping-jack-counter-pose-estimation")} reports no measured counting accuracy and gives no numeric threshold to copy, and the studies it read tracked hand and foot distance rather than an arm angle. The push-up values are the defaults Ultralytics ships in its open-source workout monitor, read from its source by the ${link("exercise form rules", "/tools/exercise-form-rules")} dataset on ${FORM_RULES_FETCHED_ON}: an up angle of ${PUSHUP_TOP_RULE.value}° and a down angle of ${PUSHUP_BOTTOM_RULE.value}° (Ultralytics counts a rep on reaching the bottom; this counter counts on the way back up, like the others). The lunge and plank values are our own simple defaults, because no source in that dataset gives a lunge counting angle or a plank angle and hold time; the lunge bottom zone does sit inside the ${LUNGE_RANGE_RULE.value}–${LUNGE_RANGE_RULE.value2}° knee range one open-source form checker accepts at the bottom of a lunge. Nothing here was calibrated on real users.`,
      "",
      "## Where it gets the count wrong",
      "",
      "- **Depth it cannot see.** Facing the camera, the knee bend is mostly toward the lens, and the model estimates that depth from a flat image. A real squat can read shallower than it is, and a different camera angle can change the count.",
      "- **Partial movements.** Squats, lunges and push-ups that stop above the bottom zone and jumping jacks whose arms stop at shoulder height are not counted. The jumping-jack rule watches the arms only, so arm swings without a jump count as reps, and the push-up rule watches the elbows only, so it does not check that your body stays straight.",
      "- **The frame.** Feet, hands or hips out of shot, loose clothing, low light, a busy background or a second person all degrade the landmarks. The model is asked for one pose.",
      "- **The camera angle.** Push-ups and the plank are read from the side; facing the camera, the elbow bend and the body line point toward the lens and read badly. A plank seen from too high or too low looks tilted.",
      `- **The device.** A slow device runs fewer frames per second, and very fast reps can fall between them. How fast the model runs on yours is what ${link("the pose model benchmark", "/tools/pose-benchmark")} measures.`,
      "",
      `It does not judge form, depth targets or safety, and it is not exercise, coaching or medical advice. What a product-grade counter adds on top of rules like these is in ${link("adding rep counting to an app", "/guides/add-rep-counting")}, ${link("how form feedback works", "/motion/how-form-feedback-works")} and ${link("testing a rep counting algorithm", "/test/rep-counting")}.`,
      "",
      ...faqSection(PATH, CHALLENGE_FAQS),
      "## What this page sends, and what it keeps",
      "",
      `Everything runs client-side. Camera frames go from your browser’s video element into the WebAssembly runtime and are never stored, recorded or sent; this site has no server code behind this page, keeps no scores and has no leaderboard. The network requests are the runtime from cdn.jsdelivr.net and the model file from storage.googleapis.com, so those hosts see an ordinary download, the same one ${link("the benchmark", "/tools/pose-benchmark")} makes. The package version and file URLs were checked on ${VERIFIED_ON}.`,
      "",
      `The runtime also reports its own usage to Google. Version ${TASKS_VISION_VERSION} posts to \`${TASKS_VISION_USAGE_LOG_URL}\` about once a minute and when the model closes, and we saw that request in our own test of this page. In the library’s code the report is built from the task name, the running mode, an operating-system family read from the user agent, the library version and timing counters such as frames processed and latency; no image, video or landmark value goes into it. Its public options offer no switch to turn it off, and a content blocker that blocks that host does not stop the challenge.`,
      "",
      "The score card is a PNG drawn on a canvas in your browser and the result line is text built in the same place. Neither contains an image of you. The challenge link under it carries only the exercise and your score in its address (for example ?ex=pushups&beat=17); whoever opens it sees that number as the one to beat, and nothing is sent to this site.",
      "",
      `A free demo from ${site.name}. Every topic in camera-based tracking is at ${link("AI motion tracking", "/motion")}, and the free developer tools are at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
