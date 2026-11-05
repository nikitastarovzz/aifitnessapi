import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { BENCH_MODELS } from "@/lib/poseBenchmark";
import { EXERCISES, LANDMARKS, describeZone } from "@/lib/repCounter.mjs";

/** The /challenge page's landmark check, derived constants and FAQs, shared by
 *  src/app/challenge/page.tsx and its markdown mirror. */
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
export const KEYPOINT_COUNT = BLAZEPOSE.points.length;
export const LITE = BENCH_MODELS.find((m) => m.id === "lite")!;
export const SQUAT = EXERCISES.squat;
export const JACK = EXERCISES["jumping-jack"];

export const CHALLENGE_FAQS = [
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

