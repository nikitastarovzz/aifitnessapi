/**
 * Cost STRUCTURE model for the Fitness API Cost Planner (/cost-planner).
 *
 * Deliberately contains no dollar figures. Vendor prices change, most serious
 * tiers are contact-sales, and this site refuses to print stale numbers — so
 * every field here describes the SHAPE of the cost (who pays, what gates it,
 * where the engineering time goes), never the amount. The only "number" this
 * file is allowed to state is the word "free".
 *
 * PROVENANCE RULE (ops/GEO.md): every non-judgement field below is backed by a
 * sentence already published on this site. Each item carries `// provenance:`
 * lines quoting a short fragment plus the slug it came from. If a field could
 * not be sourced on-site it is `null` — it is not guessed.
 *
 * The one field that is NOT sourced is `engEffort`. It is this site's rough
 * judgement about integration and maintenance work, and the UI labels it as
 * such ("our rough judgement") rather than presenting it as a vendor fact.
 */

export type CostCategory =
  | "wearable-direct"
  | "aggregator"
  | "platform-store"
  | "nutrition"
  | "exercise-content"
  | "motion-sdk"
  | "pose-model"
  | "llm-features";

/**
 * How the vendor bills YOU, the developer.
 * - "free"                — no fee documented for calling it
 * - "free-tier-then-paid" — a real free entry point that runs out
 * - "usage-based"         — the bill scales with users, events, or tokens
 * - "contact-sales"       — no public price; you have to ask for a quote
 */
export type DevCost = "free" | "free-tier-then-paid" | "usage-based" | "contact-sales";

/** Rough judgement, not a vendor fact. low ≈ days, medium ≈ weeks, high ≈ months. */
export type EngEffort = "low" | "medium" | "high";

export type CostItem = {
  id: string;
  label: string;
  category: CostCategory;
  devCost: DevCost;
  /** What each END USER has to own or pay for before their data can flow. */
  userSideCost: string | null;
  /** Review, approval, or declaration you must clear before you can ship. */
  approvalGate: string | null;
  engEffort: EngEffort;
  notes: string;
  sourceHref: string;
};

export const CATEGORY_LABELS: Record<CostCategory, string> = {
  "wearable-direct": "Wearable APIs (direct)",
  aggregator: "Health-data aggregators",
  "platform-store": "Platform health stores",
  nutrition: "Nutrition & food data",
  "exercise-content": "Exercise content",
  "motion-sdk": "AI motion / coaching SDKs",
  "pose-model": "Pose-estimation models",
  "llm-features": "LLM features",
};

export const CATEGORY_ORDER: CostCategory[] = [
  "wearable-direct",
  "aggregator",
  "platform-store",
  "nutrition",
  "exercise-content",
  "motion-sdk",
  "pose-model",
  "llm-features",
];

export const DEV_COST_LABELS: Record<DevCost, string> = {
  free: "Free",
  "free-tier-then-paid": "Free tier",
  "usage-based": "Usage-based",
  "contact-sales": "Contact sales",
};

export const COST_ITEMS: CostItem[] = [
  // provenance: "The Fitbit Web API is free to call - there is no documented per-request fee" — /pricing/fitbit-api-pricing
  // provenance: "each user must own a Fitbit device and account" — /pricing/fitbit-api-pricing
  // provenance: "Self-serve for own data; case-by-case for other users' intraday" — /fitness-apis/wearable-data-apis
  {
    id: "fitbit",
    label: "Fitbit Web API (Google)",
    category: "wearable-direct",
    devCost: "free",
    userSideCost: "Each user must own a Fitbit device and account.",
    approvalGate:
      "Developer app registration; access to other users' intraday data is case-by-case (verify).",
    engEffort: "medium",
    notes:
      "Free to call, but Fitbit is migrating to the Google Health API during 2026 and the successor's pricing model is not clearly public — budget a re-integration.",
    sourceHref: "/pricing/fitbit-api-pricing",
  },

  // provenance: "Garmin does not publish pricing for its developer APIs" — /pricing/garmin-api-pricing
  // provenance: "partner-approval-only rather than self-serve, so commercial terms are settled privately" — /pricing/garmin-api-pricing
  // provenance: "your users must own a Garmin device" — /pricing/garmin-api-pricing
  {
    id: "garmin",
    label: "Garmin Health / Activity API",
    category: "wearable-direct",
    devCost: "contact-sales",
    userSideCost: "Your users must own a Garmin device.",
    approvalGate:
      "Garmin Connect Developer Program partner approval; third parties report sign-ups paused at times (verify).",
    engEffort: "high",
    notes:
      "You cannot see the terms until you are far enough into the partner process to be quoted. Do not label Garmin free. Factor the approval queue in from the start.",
    sourceHref: "/pricing/garmin-api-pricing",
  },

  // provenance: "The Oura API is free to call: there is no publicly listed developer or per-request fee" — /pricing/oura-api-pricing
  // provenance: "Gen3 ring users reportedly need an active Oura Membership for their data" — /pricing/oura-api-pricing
  // provenance: "A new app can connect only a small number of users, reported around 10" — /pricing/oura-api-pricing
  {
    id: "oura",
    label: "Oura Cloud API",
    category: "wearable-direct",
    devCost: "free",
    userSideCost:
      "User must own an Oura Ring; Gen3 users reportedly need an active Oura Membership (verify).",
    approvalGate:
      "A fresh app connects only a small number of users (reported around 10) until Oura's review — the 'Oura for Organizations' partner path.",
    engEffort: "medium",
    notes:
      "Free to call today, but the membership requirement and partner terms are not publicly listed and change over time.",
    sourceHref: "/pricing/oura-api-pricing",
  },

  // provenance: "The WHOOP API is free to call — there is no documented per-request fee" — /pricing/whoop-api-pricing
  // provenance: "every end user needs an active WHOOP membership for their data to flow" — /pricing/whoop-api-pricing
  // provenance: "Hard 10-member cap until production approval" — /fitness-apis/wearable-data-apis
  {
    id: "whoop",
    label: "WHOOP Developer Platform",
    category: "wearable-direct",
    devCost: "free",
    userSideCost: "Every end user needs an active WHOOP membership for their data to flow.",
    approvalGate:
      "Hard 10-member cap until production approval, and WHOOP requires developers to hold a membership.",
    engEffort: "medium",
    notes:
      "WHOOP has changed its membership structure recently — verify current terms before you budget.",
    sourceHref: "/pricing/whoop-api-pricing",
  },

  // provenance: "The Strava API has no per-call developer fee" — /pricing/strava-api-pricing
  // provenance: "Standard-tier developers now reportedly must hold a paid Strava subscription" — /pricing/strava-api-pricing
  // provenance: "A free or paid Strava account; the user's data must exist to flow" — /pricing/strava-api-pricing
  {
    id: "strava",
    label: "Strava API",
    category: "wearable-direct",
    devCost: "free-tier-then-paid",
    userSideCost: "A free or paid Strava account — the user's data has to exist before it can flow.",
    approvalGate:
      "Developer Program display rules: 'Connect with Strava' branding and screenshots of every surface where Strava data appears.",
    engEffort: "medium",
    notes:
      "No per-request fee, but Standard-tier developers reportedly must hold a paid Strava subscription (2026, verify). The bigger constraint is architectural: an athlete's data may generally only be displayed back to that athlete, and using it to train AI or ML models is prohibited.",
    sourceHref: "/pricing/strava-api-pricing",
  },

  // provenance: "Fitbit/Google, Garmin, Oura, WHOOP and Polar all publish no per-call fee" — /fitness-apis/wearable-data-apis
  // provenance: "Polar, whose self-serve client registration and long-lived tokens" — /fitness-apis/wearable-data-apis
  {
    id: "polar",
    label: "Polar Open AccessLink",
    category: "wearable-direct",
    devCost: "free",
    // No sentence on our pages states a Polar user-side membership or device cost, so this stays null.
    userSideCost: null,
    approvalGate: null,
    engEffort: "low",
    notes:
      "Documented as free (verify) and the most self-serve option in this group — you register a client yourself and tokens are long-lived. Watch the data shape, not the price: only recent data is exposed, so sync regularly or lose history.",
    sourceHref: "/fitness-apis/wearable-data-apis",
  },

  // provenance: "both are free and both use per-data-type OS permission prompts rather than OAuth" — /fitness-apis/apple-healthkit-vs-google-health-connect
  // provenance: "HealthKit is included with the Apple Developer Program (a paid membership is needed to ship apps" — /fitness-apis/apple-healthkit-vs-google-health-connect
  // provenance: "App Store review checks that the stated purpose matches what you do" — /fitness-apis/apple-healthkit-vs-google-health-connect
  {
    id: "healthkit",
    label: "Apple HealthKit",
    category: "platform-store",
    devCost: "free",
    userSideCost: null,
    approvalGate:
      "App Store review checks that your health usage-description strings match what you actually do.",
    engEffort: "medium",
    notes:
      "Free and platform-bound: iOS-family only, on-device, no server-to-server pull. HealthKit itself is included with the Apple Developer Program, whose paid membership you need to ship any app — verify current pricing with Apple.",
    sourceHref: "/fitness-apis/apple-healthkit-vs-google-health-connect",
  },

  // provenance: "Health Connect is part of the Android platform" — /fitness-apis/apple-healthkit-vs-google-health-connect
  // provenance: "the Play Console enforces a health-data declaration and review before launch" — /fitness-apis/apple-healthkit-vs-google-health-connect
  {
    id: "health-connect",
    label: "Google Health Connect",
    category: "platform-store",
    devCost: "free",
    userSideCost: null,
    approvalGate: "Play Console health-data declaration and review before you can publish.",
    engEffort: "medium",
    notes:
      "Free as part of the Android platform, Android-only and on-device. An app reads only about 30 days of history before first grant unless it requests the historical-read permission.",
    sourceHref: "/fitness-apis/apple-healthkit-vs-google-health-connect",
  },

  // provenance: "Terra uses a subscription plus usage (credit-based) model" — /fitness-apis/terra-vs-vital
  // provenance: "cost scales with connected users and event volume" — /fitness-apis/terra-vs-vital
  {
    id: "terra",
    label: "Terra",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate: null,
    engEffort: "low",
    notes:
      "Subscription plus a credit/event layer, so the bill has two dimensions rather than one — a data-heavy integration can burn the allowance faster than the user count suggests. Per-user rates are not publicly listed; get a quote.",
    sourceHref: "/fitness-apis/terra-vs-vital",
  },

  // provenance: "Vital/Junction uses per-user, usage-based pricing with a monthly minimum" — /fitness-apis/terra-vs-vital
  {
    id: "junction",
    label: "Junction (formerly Vital)",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate: null,
    engEffort: "low",
    notes:
      "Per-user usage-based with a monthly minimum, so there is a floor under the bill before your first connected user. Wearables plus US-focused lab diagnostics in one integration.",
    sourceHref: "/fitness-apis/terra-vs-vital",
  },

  // provenance: "Rook uses named active-user tiers" — /pricing/health-data-aggregator-pricing
  // provenance: "Several providers need your own developer credentials; confirm tier caps" — /fitness-apis/health-data-aggregator-apis
  {
    id: "rook",
    label: "Rook",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate:
      "Several underlying providers still need your own developer credentials — confirm tier caps.",
    engEffort: "low",
    notes:
      "Usage-based, tiered by active users, with strong on-device SDK support for Apple Health and Health Connect. Third-party reports cite tier bands; the official pricing page could not be verified.",
    sourceHref: "/pricing/health-data-aggregator-pricing",
  },

  // provenance: "tiered and sales-assisted with no durable itemized public figures" — /fitness-apis/health-data-aggregator-apis
  // provenance: "Per-user; dedicated implementation engineer from sandbox" — /fitness-apis/health-data-aggregator-apis
  {
    id: "spike",
    label: "Spike",
    category: "aggregator",
    devCost: "contact-sales",
    userSideCost: null,
    approvalGate: "Sales-assisted onboarding with a dedicated implementation engineer from sandbox.",
    engEffort: "low",
    notes:
      "Broadest scope beyond wearables — IoT and medical devices, EMR, labs — but a newer, smaller company, and its pricing is not itemized publicly. Treat it as contact-sales.",
    sourceHref: "/fitness-apis/health-data-aggregator-apis",
  },

  // provenance: "Nutritionix uses tiered paid plans with an enterprise contact sales top tier" — /pricing/nutrition-api-pricing
  // provenance: "Nutritionix reportedly curtailed its open free tier" — /pricing/nutrition-api-pricing
  // provenance: "higher tiers gated through a Syndigo sales contact" — /compare/nutritionix-vs-edamam
  {
    id: "nutritionix",
    label: "Nutritionix",
    category: "nutrition",
    devCost: "free-tier-then-paid",
    userSideCost: null,
    approvalGate:
      "Higher tiers are gated through a Syndigo sales contact rather than a self-serve checkout.",
    engEffort: "low",
    notes:
      "Freemium into tiered paid plans with an enterprise contact-sales top tier and annual billing on larger commitments. Reports conflict on whether the open free tier still exists — verify before you design around it.",
    sourceHref: "/pricing/nutrition-api-pricing",
  },

  // provenance: "a free Developer tier for low volume and moves up to paid Enterprise tiers" — /pricing/nutrition-api-pricing
  // provenance: "restrict requests to human/end-user-driven calls and prohibit scraping or bulk saving" — /pricing/nutrition-api-pricing
  {
    id: "edamam",
    label: "Edamam",
    category: "nutrition",
    devCost: "free-tier-then-paid",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "Self-serve tiered freemium, priced separately per product line (Nutrition Analysis, Food Database, Meal Planner) — and each API uses its own app_id/app_key pair that does not carry across. Terms reportedly restrict calls to end-user-driven requests and prohibit scraping: an architectural constraint, not just a cost.",
    sourceHref: "/pricing/nutrition-api-pricing",
  },

  // provenance: "USDA FoodData Central is free and public domain (CC0) with a free data.gov API key" — /pricing/nutrition-api-pricing
  // provenance: "you self-integrate, normalize, and maintain everything" — /pricing/nutrition-api-pricing
  {
    id: "usda-fdc",
    label: "USDA FoodData Central",
    category: "nutrition",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "Genuinely free rather than free-tier: public domain (CC0), hosted, free API key, no license obligations. It is rate-limited and offers no natural-language meal parsing or barcode product, so you self-integrate, normalize, and maintain everything.",
    sourceHref: "/pricing/nutrition-api-pricing",
  },

  // provenance: "Open Food Facts is free open data (ODbL) with no key needed to read" — /pricing/nutrition-api-pricing
  // provenance: "attribution and share-alike obligations that can force architecture or legal work" — /pricing/nutrition-api-pricing
  {
    id: "open-food-facts",
    label: "Open Food Facts",
    category: "nutrition",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "Free open data for global barcode and packaged-product lookups, no key needed to read (a custom User-Agent is required). The cost is licensing, not money: ODbL attribution and share-alike can require you to open derived databases.",
    sourceHref: "/pricing/nutrition-api-pricing",
  },

  // provenance: "a free BASIC tier with a hard monthly request cap, then paid tiers, with overage" — /pricing/exercise-database-api-pricing
  // provenance: "Do not assume a specific free-tier quota — the numbers reported around ExerciseDB's free tier vary" — /pricing/exercise-database-api-pricing
  {
    id: "exercisedb",
    label: "ExerciseDB (via RapidAPI)",
    category: "exercise-content",
    devCost: "free-tier-then-paid",
    userSideCost: null,
    approvalGate: null,
    engEffort: "low",
    notes:
      "Freemium per-request gateway: a hard-capped free tier, then paid tiers metered by request volume with overage above quota. Marketplace quotas and prices change without notice, and the free tier is often non-commercial — re-open the live listing before you budget.",
    sourceHref: "/pricing/exercise-database-api-pricing",
  },

  // provenance: "genuinely free for the software or data - you pay only your own hosting" — /pricing/exercise-database-api-pricing
  // provenance: "the software is AGPL-3.0, so copyleft applies to modifications you deploy" — /fitness-apis/free-fitness-apis
  {
    id: "wger",
    label: "wger (self-hosted)",
    category: "exercise-content",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "high",
    notes:
      "No per-call fee at all — you pay only your own hosting, plus the engineering time to run, parse, normalize, and keep the dataset updated. The real bill is legal: the code is AGPL-3.0 copyleft and the data is Creative Commons with attribution/share-alike, so get it reviewed by counsel for a closed-source product.",
    sourceHref: "/compare/exercisedb-vs-wger",
  },

  // provenance: "Contact-sales; vendor-described per-active-user pricing" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "KinesteX's repos contain no self-serve pricing; access goes through a contact form" — /compare/kinestex-vs-sency
  {
    id: "kinestex",
    label: "KinesteX",
    category: "motion-sdk",
    devCost: "contact-sales",
    userSideCost: null,
    approvalGate: "Access runs through a contact form and an issued API key — no self-serve signup.",
    engEffort: "low",
    notes:
      "This site's own product — see disclosure on linked page. No public pricing appears in its repos; the vendor describes usage-based per-active-user pricing, so budgeting needs a sales conversation.",
    sourceHref: "/compare/kinestex-vs-sency",
  },

  // provenance: "Free trial, then usage-based; contact-sales" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "we could not read the page itself, so we will not characterize what it offers" — /compare/kinestex-vs-sency
  {
    id: "sency",
    label: "Sency (SMKit)",
    category: "motion-sdk",
    devCost: "contact-sales",
    userSideCost: null,
    approvalGate: "Free trial first (no credit card, per the vendor's site at our last check), then a sales conversation.",
    engEffort: "low",
    notes:
      "Detailed pricing sits behind sales. Sency's README links a pricing and registration page whose contents could not be read from our research environment, so we will not characterize the terms — use the trial to confirm scope.",
    sourceHref: "/fitness-apis/ai-workout-tracking-apis",
  },

  // provenance: "Self-serve free tier, paid above a device threshold" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "its public repos publish no tiers, so confirm current terms" — /fitness-apis/ai-workout-tracking-apis
  {
    id: "quickpose",
    label: "QuickPose",
    category: "motion-sdk",
    devCost: "free-tier-then-paid",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "The one coaching SDK here you can start on today without a sales call: a fully-featured self-serve free tier with no watermark, moving to paid above a monthly-active-device threshold. Its public repos publish no tiers, so confirm current terms. iOS-first, and exercise programming and UI stay on you.",
    sourceHref: "/fitness-apis/ai-workout-tracking-apis",
  },

  // provenance: "MediaPipe/BlazePose and TensorFlow MoveNet are Apache-2.0" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "rep counting, per-exercise form rules, calibration, and edge-case tuning are a multi-month build" — /fitness-apis/fitness-api-vs-build-your-own
  {
    id: "mediapipe",
    label: "MediaPipe Pose Landmarker (BlazePose)",
    category: "pose-model",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "high",
    notes:
      "Free, Apache-2.0, on-device, no per-frame cost — 33 landmarks per frame and nothing else. The keypoints are the commoditized part; rep logic, per-exercise form rules, calibration, content, and cross-device tuning are the recurring cost, and they recur as maintenance rather than a one-time build.",
    sourceHref: "/compare/kinestex-vs-mediapipe",
  },

  // provenance: "MediaPipe/BlazePose, MoveNet, and PoseNet are Apache-2.0" — /motion/pose-estimation-models-compared
  // provenance: "the MoveNet MultiPose card contained no license line, so confirm MultiPose licensing" — /motion/mediapipe-vs-movenet
  {
    id: "movenet",
    label: "TensorFlow MoveNet",
    category: "pose-model",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "high",
    notes:
      "Free and Apache-2.0 for the single-person models, 17 2D keypoints, Lightning tuned for latency. One licensing gap to close yourself: the MultiPose model card we read carried no license line, so confirm it independently before shipping commercially.",
    sourceHref: "/motion/mediapipe-vs-movenet",
  },

  // provenance: "free within the Apple toolchain but iOS and macOS only" — /fitness-apis/ai-workout-tracking-apis
  {
    id: "apple-vision",
    label: "Apple Vision body pose",
    category: "pose-model",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "high",
    notes:
      "Free within the Apple SDK with no model file to ship, running locally with no network and no per-call cost — but iOS and macOS only, so a cross-platform product still needs a second model. Everything above the joints is yours to build.",
    sourceHref: "/fitness-apis/ai-workout-tracking-apis",
  },

  // provenance: "LLM cost is (tokens in + tokens out) x rate x calls x users" — /ai/ai-fitness-app-cost
  // provenance: "output is billed at a higher rate than input" — /ai/ai-fitness-app-cost
  {
    id: "llm-apis",
    label: "LLM API (coaching, plan generation, food parsing)",
    category: "llm-features",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "Metered per token: input and output are priced separately and output costs more. The bill is a function of your prompt shape, not your vendor choice — a long system prompt is a tax on every call, and history growth in chat is what surprises teams. Cache the stable prefix, cap output, and measure your real token counts.",
    sourceHref: "/ai/ai-fitness-app-cost",
  },
];
