/** Types for correctionReport.mjs (the "Suggest a correction" issue and the /contributors wall). */

export const REPO: string;
export const REPO_URL: string;
export const NEW_ISSUE_URL: string;
export const TEMPLATE_FILE: string;
export const TEMPLATE_URL: string;
export const TITLE_PREFIX: string;
export const CONTRIBUTORS_PATH: string;
export const CREDIT_LINE: string;
export const CREDIT_HELP: string;
export const ISSUE_URL: RegExp;

export type ReportedBy = {
  /** The name or handle the reporter asked to be shown, exactly as given. */
  name: string;
  /** The correction issue, https://github.com/<REPO>/issues/<n>. */
  issue: string;
  /** A link the reporter asked for (their GitHub profile or site), if any. */
  url?: string;
};

export type CreditedCorrection = { date: string; page: { href: string; label: string }; reportedBy?: ReportedBy };

export type Contributor = {
  name: string;
  url?: string;
  corrections: { date: string; page: { href: string; label: string }; issue: string }[];
};

export function correctionBody(pageUrl?: string): string;
export function correctionIssueUrl(o: { path: string; title: string; origin?: string; repoUrl?: string }): string;
export function parseCredit(body: string): { credit: true; name: string } | { credit: false };
export function contributorsFrom(corrections: CreditedCorrection[]): Contributor[];
export function creditProblems(corrections: CreditedCorrection[]): string[];
