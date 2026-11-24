import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { FORM_RULES, FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { BENCH_MODELS } from "@/lib/poseBenchmark";
import { EXERCISES, LANDMARKS, PLANK, describeZone } from "@/lib/repCounter.mjs";

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
export const PUSHUP = EXERCISES["push-up"];
export const LUNGE = EXERCISES.lunge;
export { PLANK, FORM_RULES_FETCHED_ON };

// The push-up zones are Ultralytics' defaults as the generated form-rules
// dataset records them. Check the counter's numbers against the dataset, so
// a regenerated rule that moves fails the build instead of leaving the page
// citing a value the source no longer ships.
const rule = (id: string) => {
  const r = FORM_RULES.find((x) => x.id === id);
  if (!r) throw new Error(`challenge: form rule ${id} missing from src/data/formRules.ts`);
  return r;
};
export const PUSHUP_TOP_RULE = rule("push-up-elbow-top-ultralytics");
export const PUSHUP_BOTTOM_RULE = rule("push-up-elbow-bottom-ultralytics");
export const LUNGE_RANGE_RULE = rule("lunge-knee-bottom-range-exercise-correction");
export const LUNGE_COUNT_RULE = rule("lunge-rep-count-null");
export const PLANK_RULE = rule("plank-hold-null");
if (PUSHUP_TOP_RULE.comparison !== ">" || PUSHUP_TOP_RULE.value !== PUSHUP.rest.above) {
  throw new Error(`challenge: push-up top is ${PUSHUP_TOP_RULE.comparison} ${PUSHUP_TOP_RULE.value} in the dataset, not > ${PUSHUP.rest.above}`);
}
if (PUSHUP_BOTTOM_RULE.comparison !== "<" || PUSHUP_BOTTOM_RULE.value !== PUSHUP.active.below) {
  throw new Error(`challenge: push-up bottom is ${PUSHUP_BOTTOM_RULE.comparison} ${PUSHUP_BOTTOM_RULE.value} in the dataset, not < ${PUSHUP.active.below}`);
}
// The defaults are labelled "no source states one"; that stays true only
// while the dataset still has no number for them.
if (LUNGE_COUNT_RULE.value !== null || PLANK_RULE.value !== null) {
  throw new Error("challenge: the form-rules dataset now states a lunge or plank value; cite it instead of the default");
}
if (LUNGE_RANGE_RULE.value === null || LUNGE_RANGE_RULE.value2 === null || !(LUNGE.active.below! > LUNGE_RANGE_RULE.value && LUNGE.active.below! <= LUNGE_RANGE_RULE.value2)) {
  throw new Error("challenge: the lunge bottom zone no longer sits inside the Exercise-Correction range the page cites");
}

export const CHALLENGE_FAQS = [
  {
    q: "How does the 30-second rep challenge count reps?",
    a: `Each camera frame goes through MediaPipe Pose Landmarker lite in your browser, which returns ${KEYPOINT_COUNT} body landmarks. The page turns them into one angle, the knee angle for squats and lunges, the hip, shoulder and wrist angle for jumping jacks and the elbow angle for push-ups, and a two-phase state machine counts a rep when that angle goes from the rest zone to the active zone and back. For squats that is ${describeZone(SQUAT.active)} and back ${describeZone(SQUAT.rest)}; for jumping jacks, ${describeZone(JACK.active)} and back ${describeZone(JACK.rest)}; for push-ups, ${describeZone(PUSHUP.active)} and back ${describeZone(PUSHUP.rest)}; for lunges, ${describeZone(LUNGE.active)} and back ${describeZone(LUNGE.rest)}. The plank is timed instead: the seconds your body stays straight and level.`,
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
    a: "As a starting point only. The squat thresholds come from one 2026 study's example definition, the push-up ones are the defaults of Ultralytics' open-source workout monitor, and the jumping-jack, lunge and plank ones are our own simple defaults; none was calibrated for your camera, model or users. The how-rep-counting-works and per-exercise pages explain what to test, and every rule the counter applies is listed on this page.",
  },
];

