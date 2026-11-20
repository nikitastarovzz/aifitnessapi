/**
 * Developers' reports of applying for a wearable vendor's API access, one
 * entry per accepted GitHub issue in nikitastarovzz/aifitnessapi (title prefix
 * "[access-report]", label "access-report:accepted").
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/import-access-reports.mjs
 *
 * Each row is what one submitter said happened to one application, copied as
 * submitted (sensitive-looking text removed), not a figure from the vendor.
 * Empty until a report is accepted.
 */

export type AccessReportVendor = "garmin" | "whoop" | "oura" | "strava" | "polar" | "coros" | "suunto" | "withings" | "fitbit" | "samsung-health" | "dexcom" | "wahoo";

export type AccessReport = {
  issue: number;
  issueUrl: string;
  submittedOn: string | null;
  vendor: AccessReportVendor;
  program: string;
  use: "personal" | "commercial" | "research";
  /** The month the submitter applied, YYYY-MM. */
  applied: string;
  outcome: "approved" | "rejected" | "no-answer" | "pending";
  daysToFirstAnswer: number | null;
  askedFor: string | null;
  notes: string | null;
};

/** The date the importer last ran; null before the first import. */
export const ACCESS_REPORTS_IMPORTED_ON: string | null = null;

export const ACCESS_REPORTS: AccessReport[] = [];
