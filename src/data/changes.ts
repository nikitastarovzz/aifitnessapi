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
 *
 * One entry is about this site and not about a vendor API: the five days in
 * 2026 when every URL here answered HTTP 402. It is deliberate and it is not
 * a precedent for site news in general — the test it passes is the same one
 * every other entry passes, a dated event with the vendor's own words
 * (Vercel's `x-vercel-error`) quoted on the page it links. The site's claim
 * is that it tracks a moving ecosystem; the days it was unreachable are part
 * of that record, not an exception to it. Note that every entry here also
 * becomes an item in /changes.xml and a VEVENT in the deadlines calendar, so
 * an entry that is not a deadline shows up in both.
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
    date: "2026-11-03",
    sortDate: "2026-11-03",
    title: "Terra legacy widget endpoint deprecation",
    summary:
      "Terra relaunched its connect widget. Its documentation says the older session endpoint, POST https://api.tryterra.co/v2/auth/generateWidgetSession, \"keeps working today, with deprecation planned for 3 November 2026\", and that \"Accounts created after 3 September 2026 cannot use it at all.\" New sessions are created at POST https://access.tryterra.co/api/widget/session; the response shape (session_id, url, status, expires_in) is unchanged, while the multi-provider and all-providers options are now sent differently.",
    status: "confirmed",
    page: { href: "/integrate/terra-api", label: "How to integrate Terra" },
    verifiedOn: "2026-10-17",
  },
  {
    date: "2026-10-30",
    sortDate: "2026-10-30",
    title: "Fitbit Web API turn-off",
    summary:
      "Google's Google Health API page states that on October 30, 2026 \"the Fitbit Web API will be turned off and will no longer function or sync data to or from Fitbit users\", and that all current integrations \"must migrate their applications and users to the Google Health API and Google OAuth 2.0 as soon as possible\". Until then the legacy API keeps operating without support, and Google's migration guide has apps support both login methods while it does. Existing tokens cannot be transferred, so every user re-consents through Google OAuth.",
    status: "confirmed",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    verifiedOn: "2026-10-12",
  },
  {
    date: "2026-10",
    sortDate: "2026-10-22",
    title: "Garmin Connect Personal API and Starter/Enterprise access",
    summary:
      "Garmin reorganised its Connect Developer Program and gives no launch date: first seen on 2026-10-22, absent from the 2026-10-17 snapshot. A new Garmin Connect Personal API lets individuals create their own API key on Garmin Connect Web for their own data; Garmin says it \"is available for personal use\" and \"is not intended for commercial applications serving multiple end users\". The business program now describes Starter Access and Enterprise Access, its FAQ moved under a new Business section (the old address no longer loads), and the earlier FAQ statement that the program was only for business use is gone.",
    status: "confirmed",
    page: { href: "/fix/garmin-api-personal-use", label: "Garmin API for personal use" },
    verifiedOn: "2026-10-22",
  },
  {
    date: "2026-09-30",
    sortDate: "2026-09-30",
    title: "Fitbit Web API end of support",
    summary:
      "Google's Google Health API page states that on September 30, 2026 \"support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support.\" The turn-off follows on October 30, 2026. Third-party guides had named September 30 before Google published the timeline; it is the end-of-support date, not the switch-off.",
    status: "confirmed",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    verifiedOn: "2026-10-12",
  },
  {
    date: "2026-09-27",
    sortDate: "2026-09-27",
    title: "This site served HTTP 402 for five days",
    summary:
      "From 2026-09-27 (21:38 UTC, the first probe that saw it) until recovery on 2026-10-02, every request to aifitnessapi.com answered HTTP 402 with x-vercel-error: DEPLOYMENT_DISABLED — Vercel had disabled the project's deployments, which is an account and billing state, not a code, build or DNS fault. Googlebot and bingbot got that status on every URL for five days, and a sustained 4xx reads as removal rather than retry. The site serves 200 again on the apex and on www. This entry is about this site rather than a vendor API, and it is here because a tracker that goes dark for five days and does not say so is not a record.",
    status: "confirmed",
    page: { href: "/changelog", label: "Site changelog" },
    verifiedOn: "2026-10-03",
  },
  {
    date: "2026-09-09",
    sortDate: "2026-09-09",
    title: "FTC rescinds its 2021 health-app breach policy statement",
    summary:
      "The FTC's press release says \"The Federal Trade Commission rescinded the 2021 Policy Statement on Breaches by Health Apps and Other Connected Devices\", because the Commission's 2024 update to the Health Breach Notification Rule covers \"health apps and connected devices like fitness trackers, rendering the policy statement unnecessary.\" The FTC's rule page dates the release September 9, 2026. The rule itself, 16 CFR part 318, still applies; eCFR's current text lists no amendment after May 30, 2024.",
    status: "confirmed",
    page: { href: "/compliance/ftc-health-breach-notification-rule", label: "FTC Health Breach Notification Rule for fitness apps" },
    verifiedOn: "2026-10-17",
  },
  {
    date: "2026-12",
    sortDate: "2026-12-31",
    title: "Google Fit APIs: end of documented support",
    summary:
      "Google's Fit migration guide on developer.android.com (updated September 10, 2026) states \"The Google Fit APIs will be supported until the end of 2026\" — end of support, with no switch-off date published. It recommends the Google Health API for cloud-based integrations (including the Fit History and Session APIs), Health Connect for step tracking and mobile-first apps, and Health Services on Wear OS, and lists no replacement for the Goals API.",
    status: "confirmed",
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
    verifiedOn: "2026-10-02",
  },
  {
    date: "2026-05",
    sortDate: "2026-05-15",
    title: "Fitbit accounts: Google Account consolidation gate (reported)",
    summary:
      "Users on legacy Fitbit-only logins are reported to need consolidation into a Google Account by roughly mid-May 2026. Google's migration guide confirms the gate itself but gives no date: a user must sign in to the Google Health mobile app to link Google Health to their Google Account before an app can sync their data, and calls made before that fail with ACCOUNT_NOT_LINKED. A gate on your migration, not a detail inside it.",
    status: "reported",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    verifiedOn: "2026-10-12",
  },
  {
    date: "2026",
    sortDate: "2026-06-01",
    title: "Strava developer terms: Standard Tier subscription",
    summary:
      "Strava's API Policy makes Standard Tier apps \"subject to subscription requirements\", including \"that the developer or specified end users maintain an active Strava subscription\", and its getting-started guide calls a subscription \"a prerequisite for creating an app\". Access itself is free: the API Agreement (2026), effective June 1, 2026, says it is \"currently provided at no charge\". The architectural constraints matter more than the fee: Strava data may be shown only to the athlete it belongs to, and the API Policy forbids using it in the development, training, evaluation or operation of any AI application. Graded reported until Strava's own pages were re-read on 2026-10-17.",
    status: "confirmed",
    page: { href: "/pricing/strava-api-pricing", label: "Strava API pricing" },
    verifiedOn: "2026-10-17",
  },
  {
    date: "2026",
    sortDate: "2026-04-01",
    title: "WHOOP membership restructuring",
    summary:
      "Reported, not confirmed: 2026 press coverage said WHOOP had restructured its membership and upgrade model, and this site's WHOOP pricing page repeated it until the page was re-verified on 2026-10-17. WHOOP's developer pages read for that re-verification do not mention a restructuring. They do say a developer must have a WHOOP membership to build an app and that users connect with their own WHOOP accounts, so a membership change moves two columns of the cost model at once — check WHOOP's current terms before budgeting.",
    status: "reported",
    page: { href: "/pricing/whoop-api-pricing", label: "WHOOP API pricing" },
    verifiedOn: "2026-10-17",
  },
  {
    date: "2026",
    sortDate: "2026-03-30",
    title: "ExerciseDB becomes AscendAPI, with free V1 and V2 tiers",
    summary:
      "The exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI, and AscendAPI's documentation (pages last modified in March 2026) describes two products. ExerciseDB V1 has a free hosted tier of \"1,500 exercises with 180p GIFs. No authentication required\" at oss.exercisedb.dev, plus a paid RapidAPI tier; ExerciseDB V2, on RapidAPI only, gives each exercise an MP4 video and has a free Basic plan of 2,000 requests a month and 200 exercises, on which \"free tier media is watermarked\". This site first saw the AscendAPI name on 2026-10-22; neither the rename's date nor the paid prices are published on the pages we could read.",
    status: "confirmed",
    page: { href: "/pricing/exercise-database-api-pricing", label: "Exercise database API pricing" },
    verifiedOn: "2026-10-22",
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
    date: "2025-06-30",
    sortDate: "2025-06-30",
    title: "ANT+ membership and certification programs discontinued (reported)",
    summary:
      "Per widely-quoted announcements from the ANT+ organization — the official page was unreachable in our research pass, so this stays reported — the ANT+ membership and certification programs were discontinued on June 30, 2025, with certification applications accepted only until March 31, 2025. Device profiles and documentation reportedly remain available and existing devices are unaffected; coverage cites the EU Radio Equipment Directive as a driver. For new fitness apps, BLE is the practical default radio.",
    status: "reported",
    page: { href: "/devices/ant-plus-vs-bluetooth", label: "ANT+ vs Bluetooth for fitness sensors" },
    verifiedOn: "2026-08-14",
  },
  {
    date: "2024-05-01",
    sortDate: "2024-05-01",
    title: "Google Fit: new developer sign-ups closed",
    summary:
      "Google closed Google Fit API sign-ups for new developers on May 1, 2024 — the first hard milestone of the Fit sunset. Existing integrations continued to work. Google's documentation stated the date when we checked on July 31, 2026; its current Fit migration guide (updated September 10, 2026) no longer repeats it.",
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
    page: { href: "/motion/pose-estimation-models-compared", label: "Pose estimation models compared" },
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
];

export function changesSorted(): ChangeEvent[] {
  return [...CHANGE_EVENTS].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
}
