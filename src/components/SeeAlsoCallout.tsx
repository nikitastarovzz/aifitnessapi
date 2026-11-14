import Link from "next/link";
import { ALL_TOOLS } from "@/lib/toolRegistry";

/**
 * A pointer from a page to the interactive tools and site-wide records that
 * answer the next question its reader has: the benchmark on the model page,
 * the graveyard on a guide whose vendor retired an API version, the market map
 * on a pricing comparison.
 *
 * Explicit map keyed by PATH, the same discipline as ReferenceCallout and the
 * spoke tool CTA: a link earns its place on a page only where the target
 * genuinely helps that page's reader, and a keyword heuristic would turn it
 * into boilerplate. At most three per page. The `why` line states what the
 * target page itself states (its capsule, its data module or the /tools hub
 * blurb), never more. Rendered outside entry bodies, so adding a pointer moves
 * no `updated` stamp and no translation hash; English only, so translations
 * leave it out.
 *
 * Added 2026-11-02 (ops/GSC-10-2026-11-02.md item 6) to route crawl from the
 * pages Google already shows most often to the pages shipped on 2026-10-31.
 */
type Pointer = { href: string; label: string; why: string };

const name = (href: string) => {
  const t = ALL_TOOLS.find((x) => x.path === href);
  if (!t) throw new Error(`SeeAlsoCallout: ${href} is not in the tool registry`);
  return t.name;
};

const GRAVEYARD = { href: "/graveyard", label: "The Fitness API Graveyard" };
const MARKET_MAP = { href: "/market-map", label: name("/market-map") };
const API_INDEX = { href: "/fitness-api-index", label: name("/fitness-api-index") };
const SHIP_IT = { href: "/play/ship-it", label: name("/play/ship-it") };
const DAILY = { href: "/daily", label: name("/daily") };
const CHALLENGE = { href: "/challenge", label: "30-second webcam rep challenge" };
const YEAR = { href: "/2026", label: "Fitness APIs in 2026: the year in numbers" };
const POSE_BENCH = { href: "/tools/pose-benchmark", label: name("/tools/pose-benchmark") };
const KEYPOINTS = { href: "/tools/keypoint-playground", label: name("/tools/keypoint-playground") };
const SAMPLE_DATA = { href: "/tools/sample-data", label: name("/tools/sample-data") };
const HR_LAB = { href: "/tools/heart-rate-lab", label: name("/tools/heart-rate-lab") };
const WEBHOOK = { href: "/tools/webhook-verifier", label: name("/tools/webhook-verifier") };
const STEP_LAB = { href: "/tools/step-lab", label: name("/tools/step-lab") };
const FTMS_LAB = { href: "/tools/ftms-lab", label: name("/tools/ftms-lab") };
const CP_LAB = { href: "/tools/cycling-power-lab", label: name("/tools/cycling-power-lab") };
const GATT = { href: "/tools/ble-gatt-explorer", label: name("/tools/ble-gatt-explorer") };
const COVERAGE = { href: "/tools/api-coverage-matrix", label: name("/tools/api-coverage-matrix") };
const RATE_CALC = { href: "/tools/rate-limit-calculator", label: name("/tools/rate-limit-calculator") };
// Pages, not tools: added 2026-11-13 (ops/GSC-10-2026-11-13.md item 8) because
// Google had shown neither once since they shipped on 2026-11-02, and the
// pages below are among the ones it shows most.
const FITBIT_410 = { href: "/fix/fitbit-api-410-gone", label: "Fitbit API 410 Gone: the turn-off and the fix" };
const ROOK_ALTERNATIVES = { href: "/alternatives/rook-alternatives", label: "ROOK API alternatives" };
// Added 2026-11-14 (ops/MORE-20-2026-11-14.md item 19): the new page, from
// the nutrition pages Google shows most.
const NUTRITICS = {
  href: "/alternatives/nutritics-alternatives",
  label: "Nutritics alternatives",
  why: "Nutritics sells its Food Data API by quote, and we found no published price or API reference; five developer alternatives and what each publishes.",
};

const MAP: Record<string, Pointer[]> = {
  // ── Pose and motion ──────────────────────────────────────────────────
  "/motion/mediapipe-pose-landmarker-models": [
    {
      ...KEYPOINTS,
      why: "Click a BlazePose landmark and see its index in COCO, OpenPose, ML Kit and Apple Vision, then copy an index map.",
    },
    {
      ...CHALLENGE,
      why: "Pose Landmarker lite running in your browser, counting squats or jumping jacks from your webcam for 30 seconds.",
    },
    {
      ...GRAVEYARD,
      why: "Lists the legacy MediaPipe Pose solution these models replaced, with Google's own wording and date.",
    },
  ],
  "/motion/pose-estimation-models-compared": [
    {
      ...POSE_BENCH,
      why: "Time MediaPipe Pose Landmarker lite, full and heavy on your own device before you pick a variant.",
    },
    {
      ...CHALLENGE,
      why: "A pose model and a few angle rules counting reps live from your webcam; the video stays on your device.",
    },
  ],
  "/fitness-apis/ai-workout-tracking-apis": [
    {
      ...POSE_BENCH,
      why: "If you would run an open pose model yourself, time MediaPipe Pose Landmarker on your own device first.",
    },
    {
      ...CHALLENGE,
      why: "What camera rep counting looks like at its simplest: a pose model in your browser and a two-phase angle rule.",
    },
    {
      ...MARKET_MAP,
      why: "Every product in the directory on one map, grouped by category, AI motion SDKs and pose models included.",
    },
  ],
  // ── Wearable and platform guides whose vendor retired something ─────
  "/integrate/oura-api": [
    {
      ...GRAVEYARD,
      why: "Oura API V1 and Oura personal access tokens are both listed, with Oura's own wording.",
    },
    {
      ...SHIP_IT,
      why: "Oura's personal access token deprecation is one of the dated events the game puts your app through.",
    },
  ],
  "/integrate/whoop-api": [
    {
      ...GRAVEYARD,
      why: "WHOOP API v1 is listed there with the line from WHOOP's migration guide that ended its support.",
    },
    {
      ...RATE_CALC,
      why: "Put your user count and sync schedule against WHOOP's 100 a minute and 10,000 a day, beside other vendors' documented limits.",
    },
  ],
  "/integrate/terra-api": [
    {
      ...GRAVEYARD,
      why: "Terra's legacy widget session endpoint is listed with its planned deprecation date, in Terra's words.",
    },
  ],
  "/integrate/fitbit-api": [
    {
      ...GRAVEYARD,
      why: "The Fitbit Web API is listed with Google's end-of-support and turn-off wording, beside the other retired fitness APIs.",
    },
    {
      ...SHIP_IT,
      why: "The Fitbit Web API turn-off is one of the dated events the game puts your app through.",
    },
    {
      ...YEAR,
      why: "This year's tracked changes as computed numbers, including the Fitbit Web API turn-off date as Google gives it.",
    },
  ],
  "/integrate/garmin-api": [
    {
      ...SHIP_IT,
      why: "Garmin's approval step is one of the dated events the game puts your app through.",
    },
    {
      ...API_INDEX,
      why: "Approval gates, releases and dated changes for every product we track, side by side and sortable.",
    },
  ],
  "/fix/garmin-api-approval": [
    {
      ...API_INDEX,
      why: "Which other products we track have an approval gate, in one sortable table.",
    },
    {
      ...SHIP_IT,
      why: "Garmin's approval step is one of the dated events the game puts your app through.",
    },
  ],
  "/pricing/strava-api-pricing": [
    {
      ...GRAVEYARD,
      why: "Strava's removed club and running-race endpoints are listed there, with the dates from Strava's changelog.",
    },
    {
      ...SHIP_IT,
      why: "Strava's API policy, display rule and rate limits are among the dated events the game puts your app through.",
    },
  ],
  // ── Policy pages that are events in Ship It ──────────────────────────
  "/compliance/app-store-guideline-5-1-3-health-research": [
    {
      ...SHIP_IT,
      why: "Guideline 5.1.3 meeting an employer reward is one of the dated events the game puts your app through.",
    },
  ],
  "/compliance/google-play-health-connect-publishing-requirements": [
    {
      ...SHIP_IT,
      why: "The Health apps declaration is one of the dated events the game puts your app through.",
    },
  ],
  // ── Pricing, alternatives and roundups: the whole field at once ─────
  "/pricing/exercise-database-api-pricing": [
    { ...MARKET_MAP, why: "Every product in the directory on one map, filterable by billing model." },
    { ...API_INDEX, why: "Releases, dated changes and verification age for every product we track, sortable." },
  ],
  "/pricing/garmin-api-pricing": [
    { ...API_INDEX, why: "Approval gates, releases and dated changes for every product we track, sortable." },
    { ...MARKET_MAP, why: "Every product in the directory on one map, filterable by billing model and approval gate." },
  ],
  "/alternatives/terra-alternatives": [
    { ...MARKET_MAP, why: "Every aggregator and wearable API in the directory on one map, filterable by billing model." },
    { ...API_INDEX, why: "Releases, dated changes and verification age for each alternative, side by side." },
  ],
  "/alternatives/exercisedb-alternatives": [
    { ...MARKET_MAP, why: "Every product in the directory on one map, grouped by category, exercise content included." },
  ],
  "/compare/exercisedb-vs-wger": [
    { ...MARKET_MAP, why: "The rest of the field on one map, grouped by category and filterable by billing model." },
  ],
  "/fitness-apis/exercise-database-apis": [
    { ...MARKET_MAP, why: "Every product in the directory on one map, grouped by category and filterable by billing model." },
  ],
  "/fitness-apis/wearable-data-apis": [
    {
      ...ROOK_ALTERNATIVES,
      why: "Six alternatives to the ROOK aggregator from the vendors' own pages, and which to pick by what is pushing you off ROOK.",
    },
    { ...MARKET_MAP, why: "Every wearable and aggregator API in the directory on one map, filterable by approval gate." },
    { ...API_INDEX, why: "Releases, dated changes and verification age for every product we track, sortable." },
  ],
  "/fitness-apis/nutrition-apis": [NUTRITICS],
  "/compare/nutritionix-vs-edamam": [NUTRITICS],
  "/compare/edamam-vs-spoonacular": [NUTRITICS],
  // ── HealthKit, Health Connect and Google Health API references ───────
  "/integrate/healthkit": [
    {
      ...SAMPLE_DATA,
      why: "Seeded synthetic HealthKit test data as JSON or CSV, with field names from this site's generated copy of Apple's reference.",
    },
    { ...DAILY, why: "Five questions a day drawn from the HealthKit, Health Connect and Google Health API datasets." },
  ],
  "/fitness-apis/apple-healthkit-vs-google-health-connect": [
    { ...DAILY, why: "Five questions a day, including HealthKit type to Health Connect record and sum or average." },
  ],
  "/healthkit-identifiers": [
    {
      ...SAMPLE_DATA,
      why: "Synthetic fixtures for these types as JSON or CSV, with field names from this same generated dataset.",
    },
    { ...DAILY, why: "Five questions a day drawn from this dataset and the Health Connect and Google Health API ones." },
  ],
  "/google-health-api": [
    {
      ...FITBIT_410,
      why: "A 410 from a Fitbit Web API or Fitbit OAuth endpoint is the November 2, 2026 turn-off, not a fault in the request; the fix is moving each user to this API with Google OAuth 2.0.",
    },
    {
      ...SAMPLE_DATA,
      why: "Synthetic Google Health API test data as JSON or CSV, with field names from this site's generated copy of Google's reference.",
    },
    { ...DAILY, why: "Five questions a day drawn from this dataset and the HealthKit and Health Connect ones." },
  ],
  "/google-health-api/webhooks": [
    {
      ...WEBHOOK,
      why: "Paste a Google Health API notification and check it the way Google documents, then see the response Google expects. Runs in your browser.",
    },
  ],
  "/matrix": [
    {
      ...COVERAGE,
      why: "The cloud-vendor side of this table: which wearable APIs document each metric, at what resolution and with what history, each mark sourced.",
    },
    {
      ...SAMPLE_DATA,
      why: "The same metric as HealthKit, Health Connect or Google Health API fixtures, to test both sides of a row.",
    },
    { ...DAILY, why: "Five questions a day, including HealthKit type to Health Connect record and sum or average." },
  ],
  "/health-connect-releases": [
    {
      ...YEAR,
      why: "This year's Health Connect client releases counted beside the other changes we track, as computed numbers.",
    },
  ],
  "/google-fit-shutdown": [
    {
      ...SHIP_IT,
      why: "Google Fit's end of support is one of the dated events the game puts your app through.",
    },
    {
      ...FITBIT_410,
      why: "The other Google turn-off: Fitbit Web API and Fitbit OAuth requests return 410 Gone from November 2, 2026, and retries will not bring them back.",
    },
  ],
  // ── Bluetooth heart rate and steps ───────────────────────────────────
  "/healthkit-identifiers/heart-rate-variability-sdnn": [
    {
      ...HR_LAB,
      why: "Connect a BLE strap in the browser and see whether it sends the RR intervals HRV is computed from.",
    },
  ],
  "/bluetooth-fitness": [
    {
      ...HR_LAB,
      why: "Connect a heart-rate strap in the browser and watch every Heart Rate Measurement byte decoded live.",
    },
    {
      ...FTMS_LAB,
      why: "Treadmill, Indoor Bike, Rower and Cross Trainer Data decoded flag by flag, from a machine or pasted hex.",
    },
    {
      ...CP_LAB,
      why: "Cycling Power and CSC Measurement decoded, with cadence and speed computed from revolution counts.",
    },
    {
      ...GATT,
      why: "Connect any device and decode every characteristic below that has a SIG structure; hex for the rest.",
    },
  ],
  // ── Bluetooth fitness machines and cycling sensors ───────────────────
  "/bluetooth-fitness/treadmill-data": [
    { ...FTMS_LAB, why: "This characteristic decoded from your treadmill or from pasted hex: each Flags bit, field and resolution." },
  ],
  "/bluetooth-fitness/indoor-bike-data": [
    { ...FTMS_LAB, why: "This characteristic decoded from your bike or trainer, or from pasted hex, with cadence in half-rpm units." },
  ],
  "/bluetooth-fitness/rower-data": [
    { ...FTMS_LAB, why: "This characteristic decoded from your rower or from pasted hex: stroke rate, count, pace and power." },
  ],
  "/bluetooth-fitness/cross-trainer-data": [
    { ...FTMS_LAB, why: "This characteristic decoded from your cross trainer or from pasted hex, three-octet Flags included." },
  ],
  "/bluetooth-fitness/cycling-power-measurement": [
    { ...CP_LAB, why: "This characteristic decoded live or pasted, with crank and wheel revolutions turned into cadence and speed." },
  ],
  "/bluetooth-fitness/csc-measurement": [
    { ...CP_LAB, why: "Two notifications in, cadence and speed out: the revolution and event-time arithmetic, wraps included." },
  ],
  "/bluetooth-fitness/heart-rate-measurement": [
    {
      ...HR_LAB,
      why: "This characteristic decoded live from your own strap: flags, BPM, energy expended and RR intervals.",
    },
  ],
  "/google-health-api/steps": [
    {
      ...STEP_LAB,
      why: "Walk with your phone and watch a visible step detector count, to see why two step counters disagree.",
    },
  ],
  "/phone-sensors": [
    {
      ...STEP_LAB,
      why: "Your phone's accelerometer, a visible step detector and two sliders that change the count.",
    },
  ],
};

export default function SeeAlsoCallout({ path }: { path: string }) {
  const refs = MAP[path];
  if (!refs) return null;

  return (
    <aside data-see-also className="mt-12 rounded-xl border border-[var(--border)] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Related tools and records
      </h2>
      <ul className="mt-3 space-y-2">
        {refs.map((r) => (
          <li key={r.href} className="text-sm">
            <Link
              href={r.href}
              data-cta={`see-also-${r.href.replace(/^\//, "").replace(/\//g, "-")}`}
              data-cta-source="see-also"
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              {r.label}
            </Link>
            <span className="text-[var(--muted)]"> — {r.why}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Paths this component covers, for the qa gate. */
export const SEE_ALSO_PATHS = Object.keys(MAP);
