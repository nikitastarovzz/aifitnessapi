import { POSE_BENCHMARK_RESULTS } from "@/data/poseBenchmarkResults";
import { NEW_ISSUE_URL } from "@/lib/poseBenchmarkSubmission.mjs";

/**
 * The leaderboard's grouping, shared by the section on /tools/pose-benchmark
 * (src/components/tools/PoseLeaderboard.tsx) and its markdown mirror
 * (src/lib/pageMirrors/poseBenchmark.ts), so both list the same rows in the
 * same order. Rows are grouped by model and delegate and ordered by median
 * latency within a group; nothing is averaged or filled in.
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
  return [...groups.values()].sort((a, b) => a.model.localeCompare(b.model) || a.delegate.localeCompare(b.delegate));
}

/** Milliseconds as the table prints them. */
export const leaderboardMs = (n: number) => n.toFixed(1);
