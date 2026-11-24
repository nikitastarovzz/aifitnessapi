/**
 * Projects that use the APIs this site covers, one entry per accepted GitHub
 * issue in nikitastarovzz/aifitnessapi (title prefix "[built-with]", label
 * "built-with:accepted"). Listed under "Built with these APIs" on
 * /awesome and in AWESOME.md.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/import-built-with.mjs
 * (then node scripts/build-awesome.mjs).
 *
 * Each row is what the project's maker wrote, copied as submitted
 * (sensitive-looking text removed), not a review. Empty until a project is
 * accepted.
 */

export type BuiltWithProject = {
  issue: number;
  issueUrl: string;
  submittedOn: string | null;
  name: string;
  url: string;
  repoUrl: string | null;
  /** Directory ids (aifitnessapi.com/apis/<id>). */
  apis: string[];
  description: string;
};

/** The date the importer last ran; null before the first import. */
export const BUILT_WITH_IMPORTED_ON: string | null = null;

export const BUILT_WITH: BuiltWithProject[] = [];
