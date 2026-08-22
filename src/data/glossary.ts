import { absoluteUrl } from "@/lib/site";

/**
 * The glossary vocabulary, extracted so it is a data module rather than page
 * markup: the glossary page renders it as a DefinedTermSet, and every cluster
 * spoke uses `termsDefining()` to emit `about` links to the terms whose
 * canonical explanation IS that page. That turns the glossary into a real
 * entity graph — each concept has one stable @id, and the pages that own a
 * concept say so in machine-readable form.
 */

export const GLOSSARY_PATH = "/glossary";

export type Term = { term: string; def: string; href: string };
export type Group = { title: string; terms: Term[] };

export const GROUPS: Group[] = [
  {
    title: "Health data & metrics",
    terms: [
      { term: "HRV (heart rate variability)", def: "Beat-to-beat variation in heart rhythm, used as a recovery signal — but not one number: Apple stores SDNN while Health Connect stores RMSSD, and the two are not interconvertible.", href: "/learn/what-is-hrv" },
      { term: "SDNN", def: "The HRV statistic Apple HealthKit stores — the standard deviation of intervals between normal heartbeats. Do not mix it with RMSSD in one column.", href: "/matrix" },
      { term: "RMSSD", def: "The HRV statistic Health Connect stores — the root mean square of successive interval differences. A different measure from SDNN, not a unit conversion away.", href: "/data/hrv-api" },
      { term: "VO2 max", def: "An estimate of aerobic capacity. On consumer devices it is modeled from heart rate and pace, not measured — treat it as a trend, not a lab value.", href: "/learn/what-is-vo2-max" },
      { term: "SpO2 (blood oxygen)", def: "Peripheral oxygen saturation from an optical sensor. A data type existing does not mean data will be there — it needs a device that measures it.", href: "/data/blood-oxygen-api" },
      { term: "Sleep stages", def: "Light, deep, REM and awake segments a device infers from movement and heart rate. Definitions and boundaries differ by vendor, so they do not compare one-to-one.", href: "/learn/what-are-sleep-stages" },
      { term: "Active vs total calories", def: "Active calories are the burn above rest; total adds basal metabolic rate. Providers disagree on which they report, which is a normalization trap.", href: "/learn/how-fitness-apps-estimate-calories" },
      { term: "Measured vs estimated", def: "Some metrics are sensed (steps, heart rate); others are modeled (VO2 max, calories, some sleep). Storing the distinction keeps you from presenting a guess as a reading.", href: "/data" },
    ],
  },
  {
    title: "Platforms & providers",
    terms: [
      { term: "HealthKit", def: "Apple's on-device health store. Not a cloud API — there is no server endpoint; your app reads it locally with permission and syncs itself.", href: "/integrate/healthkit" },
      { term: "Health Connect", def: "Android's on-device health store — Google's counterpart to HealthKit. Also local-only, and it deduplicates only Activity and Sleep, via its aggregate API.", href: "/integrate/google-health-connect" },
      { term: "Health-data aggregator", def: "A third party (Terra, Rook, and others) that normalizes many wearable and health sources behind one API — often the right buy instead of building integrations yourself.", href: "/learn/what-is-a-health-data-aggregator" },
      { term: "Exercise database API", def: "A catalogue of exercises with metadata and media. Watch the licensing — some open options are AGPL copyleft, which matters for closed-source apps.", href: "/fitness-apis/exercise-database-apis" },
      { term: "Fitness API", def: "Any API a developer uses to get fitness or health data or content — wearables, aggregators, exercise or nutrition catalogues, or AI motion tracking. Choose by job.", href: "/learn/what-is-a-fitness-api" },
    ],
  },
  {
    title: "Integration & auth",
    terms: [
      { term: "OAuth (for health data)", def: "The delegated-access handshake that lets a user grant your app read access to their provider account without sharing a password. The token lifecycle is where it breaks in production.", href: "/learn/what-is-oauth-for-health-data" },
      { term: "Webhook", def: "A provider-initiated callback telling you something changed. Most fitness webhooks are thin change-pointers, so the handler's job is usually to enqueue a fetch, not to trust the payload.", href: "/learn/what-are-webhooks" },
      { term: "401 vs 403", def: "A 401 means your token is bad, missing, expired or revoked; a 403 means the token is valid but lacks the scope. They point at different fixes.", href: "/fix/fitness-api-401-unauthorized" },
      { term: "Rate limit / 429", def: "A provider capping your request volume. 429 is defined in RFC 6585, where the Retry-After header is optional — so design to back off even when it is absent.", href: "/fix/fitbit-api-429-rate-limit" },
      { term: "Refresh token rotation", def: "When a provider issues a new refresh token on every refresh. Lose the new one and the user is disconnected permanently — a case worth testing explicitly.", href: "/fix/refresh-token-not-working" },
    ],
  },
  {
    title: "AI motion & camera",
    terms: [
      { term: "Pose estimation", def: "Finding body keypoints in each camera frame. A normal RGB phone camera is enough for 2D and even monocular 3D — no depth sensor required.", href: "/learn/what-is-pose-estimation" },
      { term: "2D vs 3D pose", def: "2D gives pixel coordinates; monocular 3D adds an estimated depth that is less reliable for occluded and out-of-plane joints. Say which you need.", href: "/motion/2d-vs-3d-pose-estimation" },
      { term: "Rep counting", def: "Turning a keypoint stream into a count — a classification problem, tested with precision and recall against a labelled corpus, not a demo of ten push-ups.", href: "/motion/how-rep-counting-works" },
      { term: "Form feedback", def: "Comparing joint angles and range of motion to a target. A coaching aid, not medical or physical-therapy advice — a distinction worth stating in the product.", href: "/motion/how-form-feedback-works" },
      { term: "On-device vs cloud inference", def: "Running the model on the phone (low latency, private, no per-frame cost) versus in the cloud (heavier models, consistent, but latency and streaming-video privacy weight).", href: "/motion/on-device-vs-cloud-pose-estimation" },
    ],
  },
  {
    title: "Architecture & data quality",
    terms: [
      { term: "Deduplication", def: "Resolving the same activity written by several apps or devices. Neither platform does it for raw reads the way people assume — it is a resolution layer you design.", href: "/architecture/deduplicate-health-data" },
      { term: "Day boundary problem", def: "“Today's steps” is a civil-date question, not a UTC range. DST days aren't 24 hours, so a fixed window silently drops or double-counts an hour twice a year.", href: "/day-boundaries" },
      { term: "Late-arriving data", def: "Health samples are not append-only — a watch syncs hours late, a user edits yesterday, a provider revises last night's sleep. Any total computed once and considered final will be wrong.", href: "/architecture/incremental-sync" },
      { term: "Idempotent ingestion", def: "Making a duplicated event a no-op. In health data a doubly-processed event silently doubles a user's calories rather than throwing, so the dedupe key is load-bearing.", href: "/architecture/webhook-ingestion" },
      { term: "Backfill", def: "Importing a user's history as a budgeted, resumable job — recent-first so the app is useful immediately, and chunked so a crash resumes rather than restarts.", href: "/architecture/historical-backfill" },
      { term: "Metric versioning", def: "Recording which formula produced a derived value, so improving a calorie or readiness formula doesn't silently rewrite a user's history.", href: "/architecture/metric-versioning-and-recompute" },
    ],
  },
  {
    title: "Compliance & AI",
    terms: [
      { term: "PHI (protected health information)", def: "The HIPAA category. Whether your fitness data is PHI depends on who you are and who you share it with — a consumer app is often outside HIPAA entirely, but not always.", href: "/compliance/is-fitness-data-phi" },
      { term: "General wellness policy", def: "The FDA position that it does not intend to examine low-risk wellness products. There is no approval to claim — and diagnosis or treatment claims can push you out of it.", href: "/compliance/fda-fitness-app-regulation" },
      { term: "RAG / grounding", def: "Constraining an LLM to a vetted catalogue instead of free-generating. For a few-thousand-row exercise table, plain retrieval usually beats vector search.", href: "/ai/ground-llm-in-exercise-database" },
      { term: "Guardrails (health advice)", def: "The deterministic gate in front of an LLM giving exercise or nutrition guidance. A model asked to police itself in the same call gets talked out of it.", href: "/ai/llm-safety-fitness-advice" },
    ],
  },
];

/** The fragment part of a term's stable id — also the element id on the
 *  glossary page, so the anchor an assistant cites actually scrolls somewhere. */
export function termSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Stable, human-stable fragment id for a term (used as its JSON-LD @id). */
export function termId(term: string): string {
  return `${absoluteUrl(GLOSSARY_PATH)}#term-${termSlug(term)}`;
}

export const ALL_TERMS: Term[] = GROUPS.flatMap((g) => g.terms);

/**
 * The terms whose glossary entry points at `path` — i.e. the concepts this
 * page is the site's canonical explanation of. Used for schema.org `about`.
 */
export function termsDefining(path: string): Term[] {
  return ALL_TERMS.filter((t) => t.href === path);
}
