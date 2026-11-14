/**
 * The machine-surface descriptions (llms-full, llms-index) of the rep counter
 * playground, the exercise form-rules dataset and the pose benchmark's
 * leaderboard, built from the same data the pages render so the two
 * surfaces cannot drift from the pages or from each other.
 */
import { FORM_RULES, FORM_RULE_EXERCISES, FORM_RULE_PRESETS, FORM_RULE_SOURCES, FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { POSE_BENCHMARK_RESULTS } from "@/data/poseBenchmarkResults";
import { TASKS_VISION_VERSION } from "@/lib/poseBenchmark";
import { formRuleDisagreement } from "@/lib/formRulesView";
import { DEFAULT_CONFIG } from "@/lib/repPlayground.mjs";
import { ACCEPT_LABEL, REPO } from "@/lib/poseBenchmarkSubmission.mjs";

const withValue = FORM_RULES.filter((r) => r.value !== null);
const nulls = FORM_RULES.filter((r) => r.value === null);

export const REP_PLAYGROUND_PRIMARY_QUERY = "rep counter joint angle threshold from video";
export const FORM_RULES_PRIMARY_QUERY = "squat knee angle threshold for rep counting";

export function repPlaygroundText(): string {
  const d = DEFAULT_CONFIG;
  return `A client-side tool. The reader loads a local video file (or uses the webcam); MediaPipe Pose Landmarker lite or full (@mediapipe/tasks-vision ${TASKS_VISION_VERSION}) runs in the browser on each decoded frame, and the page records the knee (hip-knee-ankle), hip (shoulder-hip-knee), elbow (shoulder-elbow-wrist) and shoulder (hip-shoulder-elbow) angles of both sides, in 2D image coordinates or from the model's 3D world landmarks. A threshold counter with hysteresis, the same state machine as /challenge, counts reps on one chosen angle: exponential smoothing (time constant ${d.smoothingMs} ms to start), a top and a bottom angle with a gap between them (${d.top} and ${d.bottom} degrees to start, this site's uncalibrated values), a minimum number of consecutive frames in a zone (${d.minFrames}) and a minimum cycle time (${d.minCycleMs} ms) below which a cycle is rejected. Moving any setting recounts the whole recording without rerunning the model, and the chart marks each counted and rejected rep. Presets load the thresholds of ${FORM_RULE_PRESETS.length} rule sets from the exercise form-rules dataset. The config exports as JSON (with a $schema and, for a preset, the dataset rows it came from) and the angles as CSV. The video is never uploaded; the runtime posts its own usage report to Google (timings, no images). No accuracy figure is claimed.`;
}

export function formRulesText(): string {
  const srcs = FORM_RULE_SOURCES.map((s) => `${s.name} (${s.repo}, ${s.license})`).join("; ");
  const kinds = ["joint-angle", withValue.some((r) => r.unit === "ratio") ? "ratio" : null, withValue.some((r) => r.unit === "frames") ? "hold-time" : null].filter(Boolean);
  const kindText = kinds.length > 1 ? `${kinds.slice(0, -1).join(", ")} and ${kinds.at(-1)}` : kinds[0];
  const pushUps = FORM_RULE_PRESETS.filter((p) => p.exercise === "push-up");
  const pair = formRuleDisagreement();
  const disagree =
    pushUps.length >= 2
      ? ` The sources disagree, for example on push-up elbow angles (${pushUps.map((p) => `${p.top}/${p.bottom}`).join(" vs ")} degrees).`
      : pair
        ? ` The sources disagree, for example on the ${pair.exerciseName.toLowerCase()} ${pair.joint} ${pair.role} check (${pair.a.value} vs ${pair.b.value} degrees).`
        : "";
  return `An open dataset (CC BY 4.0, JSON and CSV at /datasets/exercise-form-rules-2026.json and .csv) of ${FORM_RULES.length} rules for ${FORM_RULE_EXERCISES.map((e) => e.name.toLowerCase()).join(", ")}: the ${kindText} thresholds that licensed open-source exercise trackers use to count reps and check form, read from their code on ${FORM_RULES_FETCHED_ON}: ${srcs}. ${withValue.length} rules carry a value captured from a verbatim line of code (stored with the line that applies it and the line that computes the angle; a weekly job re-checks each quote against the live file); ${nulls.length} are null with the reason (${nulls.map((r) => `${r.exerciseName.toLowerCase()} ${r.purpose}`).join("; ")}), because no licensed source read states a number and peer-reviewed definitions on hosts the build could not reach are not copied.${disagree} They are the authors' choices for their own camera setups, measured as 2D image angles, not biomechanical standards. Each rule set with a top and a bottom angle opens as a starting config in the rep counter playground.`;
}

export function leaderboardText(): string {
  const n = POSE_BENCHMARK_RESULTS.length;
  return `After a run, readers can submit their result as a prefilled public GitHub issue in ${REPO}; a maintainer adds the ${ACCEPT_LABEL} label and the next build lists accepted runs on the page with a link to each issue, copied as submitted (one device, one run each). ${n === 0 ? "No run has been accepted yet, and the leaderboard shows none rather than any placeholder." : `${n} accepted so far.`}`;
}
