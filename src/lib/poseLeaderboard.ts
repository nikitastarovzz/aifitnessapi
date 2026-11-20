import { POSE_BENCHMARK_RESULTS } from "@/data/poseBenchmarkResults";
import { MODEL_FAMILY, MODEL_ORDER, NEW_ISSUE_URL } from "@/lib/poseBenchmarkSubmission.mjs";
import { TFJS_BACKEND } from "@/lib/poseBenchmark";

/**
 * The leaderboard's grouping, shared by the section on /tools/pose-benchmark
 * (src/components/tools/PoseLeaderboard.tsx) and its markdown mirror
 * (src/lib/pageMirrors/poseBenchmark.ts), so both list the same rows in the
 * same order. Rows are grouped by model and delegate and ordered by median
 * latency within a group; groups follow the benchmark's own model order
 * (MediaPipe lite, full, heavy, then MoveNet Lightning, Thunder). Nothing is
 * averaged or filled in.
 */

type Submission = (typeof POSE_BENCHMARK_RESULTS)[number];
export type LeaderboardGroup = {
  model: string;
  delegate: string;
  rows: { sub: Submission; row: Submission["rows"][number] }[];
};

export const LEADERBOARD_TEMPLATE_URL = `${NEW_ISSUE_URL}?template=pose-benchmark-result.md`;

export function leaderboardGroups(): LeaderboardGroup[] {
  const groups = new Map<string, LeaderboardGroup>();
  for (const sub of POSE_BENCHMARK_RESULTS) {
    for (const row of sub.rows) {
      const k = `${row.model}|${row.delegate}`;
      if (!groups.has(k)) groups.set(k, { model: row.model, delegate: row.delegate, rows: [] });
      groups.get(k)!.rows.push({ sub, row });
    }
  }
  for (const g of groups.values()) g.rows.sort((a, b) => a.row.medianMs - b.row.medianMs);
  const rank = (m: string) => (MODEL_ORDER.indexOf(m) < 0 ? MODEL_ORDER.length : MODEL_ORDER.indexOf(m));
  return [...groups.values()].sort(
    (a, b) => rank(a.model) - rank(b.model) || a.model.localeCompare(b.model) || a.delegate.localeCompare(b.delegate),
  );
}

const isMoveNet = (model: string) => (MODEL_FAMILY as Record<string, string>)[model] === "movenet";

/** "GPU delegate", or for MoveNet the TF.js backend the delegate maps to. */
export function leaderboardDelegate(model: string, delegate: string): string {
  if (!isMoveNet(model)) return `${delegate} delegate`;
  const backend = TFJS_BACKEND[delegate as keyof typeof TFJS_BACKEND];
  return backend ? `${delegate} (TF.js ${backend} backend)` : delegate;
}

/** The runtime a row was measured with: tasks-vision for MediaPipe, pose-detection on TF.js for MoveNet. */
export function leaderboardRuntime(sub: Submission, row: Submission["rows"][number]): string {
  if (!isMoveNet(row.model)) return sub.runtime;
  return sub.tfjs ? `pose-detection ${sub.tfjs.poseDetection}, TF.js ${sub.tfjs.tfjs}` : "not reported";
}

/** Milliseconds as the table prints them. */
export const leaderboardMs = (n: number) => n.toFixed(1);
