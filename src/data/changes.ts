/**
 * The Changes & Deadlines tracker (/changes) — the site's living record of
 * ecosystem events: deprecations, term changes, deadlines, model freezes.
 *
 * RULES (ops/GEO.md binds this file):
 * - Every entry traces to a page on this site that carries the sourced
 *   claim; `page` links it. No entry may state more than its source page.
 * - `status` is the honesty field: "confirmed" only when a vendor's own
 *   words are quoted on the linked page; "reported" for community/vendor
 *   notices our pages hedge; "watch" for undated live risks.
 * - `date` precision varies ("2026-09" = reported month). Never sharpen a
 *   date beyond what the source page states.
 * - The daily routine appends here when it verifies a dated change
 *   (ops/DAILY-CONTENT §6) — newest first within each year.
 */

export type ChangeStatus = "confirmed" | "reported" | "watch";

export type ChangeEvent = {
  /** ISO-ish; precision as sourced: "2024-05-01", "2026-09", "2026". */
  date: string;
  /** Sort key when `date` is fuzzy; full ISO date. */
  sortDate: string;
  title: string;
  summary: string;
  status: ChangeStatus;
  /** The on-site page carrying the sourced claim. */
  page: { href: string; label: string };
  /** When this entry was last checked against its source page. */
  verifiedOn: string;
};

export const CHANGE_EVENTS: ChangeEvent[] = [
  {
    date: "2026-09",
    sortDate: "2026-09-15",
    title: "Fitbit Web API turndown (reported window)",
    summary:
      "The legacy Fitbit Web API's retirement in favour of the cloud Google Health API is reported to land around September 2026. No official day is confirmed on a page we could verify; some third-party guides name September 30, which is weaker evidence, not stronger. Tokens are reported not to transfer — every user re-consents via Google OAuth.",
    status: "reported",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    verifiedOn: "2026-08-11",
  },
  {
    date: "2026-09",
    sortDate: "2026-09-20",
    title: "Fitbit → Google Health side-by-side window reported to close",
    summary:
      "A window in which the legacy Fitbit Web API and the Google Health API run side by side is reported to extend into late September 2026 — the practical dual-read period for migrating integrations.",
    status: "reported",
    page: { href: "/migrate/fitbit-web-api-to-google-health", label: "Fitbit → Google Health migration playbook" },
    verifiedOn: "2026-08-11",
  },
  {
    date: "2026-12",
    sortDate: "2026-12-31",
    title: "Google Fit APIs: end of documented support",
    summary:
      "Google's own documentation states Fit APIs \"will be supported until the end of 2026\" (verified against developer.android.com on July 31, 2026). Migration targets differ by integration shape: Health Connect on-device, Health Services on Wear OS, or the Google Health API for server-side reads.",
    status: "confirmed",
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
    verifiedOn: "2026-07-31",
  },
  {
    date: "2026-05",
    sortDate: "2026-05-15",
    title: "Fitbit accounts: Google Account consolidation gate (reported)",
    summary:
      "Users on legacy Fitbit-only logins are reported to need consolidation into a Google Account by roughly mid-May 2026, and reportedly cannot use the successor API until they do — a gate on your migration, not a detail inside it.",
    status: "reported",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    verifiedOn: "2026-08-11",
  },
  {
    date: "2026",
    sortDate: "2026-06-01",
    title: "Strava developer terms: Standard-tier subscription (reported)",
    summary:
      "Strava's developer access terms reportedly changed during 2026, with Standard-tier developers said to need a paid Strava subscription. The architectural constraints matter more than the fee: athlete data may generally only be displayed back to that athlete, and using it to train AI/ML models is prohibited.",
    status: "reported",
    page: { href: "/migrate/adapt-to-strava-api-changes", label: "Adapting to Strava API changes" },
    verifiedOn: "2026-08-12",
  },
  {
    date: "2026",
    sortDate: "2026-04-01",
    title: "WHOOP membership restructuring",
    summary:
      "WHOOP has restructured its membership recently. Because WHOOP requires both a developer membership and an active end-user membership for data to flow, a restructuring moves two columns of the cost model at once — verify current terms before budgeting.",
    status: "reported",
    page: { href: "/pricing/whoop-api-pricing", label: "WHOOP API pricing" },
    verifiedOn: "2026-08-12",
  },
  {
    date: "2026",
    sortDate: "2026-03-01",
    title: "Nutritionix open free tier reportedly curtailed",
    summary:
      "Reports conflict on whether Nutritionix's open free tier still exists; higher tiers route through a Syndigo sales contact. If the free tier is gone, the freemium classification shifts toward sales-gated.",
    status: "reported",
    page: { href: "/pricing/nutrition-api-pricing", label: "Nutrition API pricing" },
    verifiedOn: "2026-08-12",
  },
  {
    date: "2025-12",
    sortDate: "2025-12-15",
    title: "Oura personal access tokens deprecated",
    summary:
      "Oura deprecated personal access tokens in December 2025 — scripts and internal tools built on PATs need the OAuth flow instead. This page's phrasing has been quoted back to us in search queries, a sign assistants cite it.",
    status: "confirmed",
    page: { href: "/fix/oura-personal-access-token-deprecated", label: "Oura PAT deprecation fix" },
    verifiedOn: "2026-08-02",
  },
  {
    date: "2024-05-01",
    sortDate: "2024-05-01",
    title: "Google Fit: new developer sign-ups closed",
    summary:
      "Google closed Google Fit API sign-ups for new developers on May 1, 2024 — the first hard milestone of the Fit sunset. Existing integrations continued to work.",
    status: "confirmed",
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
    verifiedOn: "2026-07-31",
  },
  {
    date: "2024",
    sortDate: "2024-07-01",
    title: "Strava tightened its developer program",
    summary:
      "Strava tightened developer-program rules in 2024 — the start of the stricter display, branding, and access regime its API operates under today.",
    status: "confirmed",
    page: { href: "/migrate/adapt-to-strava-api-changes", label: "Adapting to Strava API changes" },
    verifiedOn: "2026-08-12",
  },
  {
    date: "2024",
    sortDate: "2024-06-01",
    title: "MoveNet: no model updates observed since 2024",
    summary:
      "No updates to the MoveNet pose models have been observed since 2024. The single-person models remain Apache-2.0; treat the weights as stable rather than evolving.",
    status: "confirmed",
    page: { href: "/motion/mediapipe-vs-movenet", label: "MediaPipe vs MoveNet" },
    verifiedOn: "2026-08-02",
  },
  {
    date: "2023-04",
    sortDate: "2023-04-15",
    title: "MediaPipe Pose Landmarker weights: last modification",
    summary:
      "The served MediaPipe Pose Landmarker .task model files were last modified in April 2023. The framework evolves; the pose weights have not — pin versions and treat model updates as an event, not a stream.",
    status: "confirmed",
    page: { href: "/motion/mediapipe-pose-landmarker-models", label: "Pose Landmarker model guide" },
    verifiedOn: "2026-08-02",
  },
];

/** Undated live risks worth watching — no date, explicitly not predictions. */
export const WATCH_ITEMS: { title: string; summary: string; page: { href: string; label: string } }[] = [
  {
    title: "Google Health API pricing and quota model",
    summary:
      "The Fitbit successor's pricing model is not clearly public. Until it is, the free-to-call classification of the Fitbit ecosystem is the least stable cell in our dataset.",
    page: { href: "/pricing/fitbit-api-pricing", label: "Fitbit API pricing" },
  },
  {
    title: "MoveNet MultiPose licence gap",
    summary:
      "The MultiPose model card we read carried no licence line, while the single-person models are Apache-2.0. Confirm independently before shipping multi-person tracking commercially.",
    page: { href: "/motion/multi-person-pose-tracking", label: "Multi-person pose tracking" },
  },
  {
    title: "Garmin developer program sign-ups",
    summary:
      "Third parties report new partner sign-ups paused at times, with no reopening ETA. Existing partners are unaffected. Verify current status before planning a Garmin integration.",
    page: { href: "/fix/garmin-api-approval", label: "Garmin API approval" },
  },
];

export function changesSorted(): ChangeEvent[] {
  return [...CHANGE_EVENTS].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
}
