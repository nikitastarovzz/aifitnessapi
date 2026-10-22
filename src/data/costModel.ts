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

  // provenance: "Garmin does not publish a price for Personal, Starter or Enterprise access" — /pricing/garmin-api-pricing
  // provenance: "\"Commercial terms are tailored based on business and technical requirements\"" — /pricing/garmin-api-pricing
  // provenance: "Starter is push only with no historical data and limited user capacity, Enterprise adds ping/pull, history and unlimited users" — /pricing/garmin-api-pricing
  // provenance: "Your users sync their own Garmin devices. If you want to offer Garmin wearables ... \"and contact us using the inquiry form\"" — /pricing/garmin-api-pricing
  // provenance: "after your request is approved you get the Garmin Developer Portal ... It no longer states how long the review takes" — /pricing/garmin-api-pricing
  // devCost stays "free" under the DevCost definition above (no fee documented for calling it): Garmin
  // documents no fee for Starter Access. Its explicit "no licensing or maintenance fees" sentence was removed
  // in October 2026 and Enterprise terms are negotiated, so the notes say so; re-check when Garmin states terms.
  {
    id: "garmin",
    label: "Garmin Health / Activity API",
    category: "wearable-direct",
    devCost: "free",
    userSideCost:
      "Users sync their own Garmin devices; if you want to offer Garmin wearables, Garmin asks you to contact it through its inquiry form when you request the program.",
    approvalGate:
      "Garmin Connect Developer Program approval, as Starter or Enterprise Access; Garmin's pages state no review time.",
    engEffort: "high",
    notes:
      "Garmin publishes no price for Starter Access and says Enterprise commercial terms are tailored; ping/pull delivery, backfill and enhanced beat-to-beat interval are Enterprise-only. Its earlier statement that there were no licensing or maintenance fees is no longer on its site, so get terms in writing before you promise a feature.",
    sourceHref: "/pricing/garmin-api-pricing",
  },

  // provenance: "says it is free to use for both personal and commercial applications" — /pricing/oura-api-pricing
  // provenance: "they need an Oura Ring and an active Oura Membership" — /pricing/oura-api-pricing
  // provenance: "a lapsed membership shows up as failed calls" — /pricing/oura-api-pricing
  // provenance: "A new API application is limited to 10 users until Oura approves it, and there is no limit once it is approved" — /pricing/oura-api-pricing
  // provenance: "personal access tokens were deprecated in December 2025 and are no longer available for use" — /pricing/oura-api-pricing
  {
    id: "oura",
    label: "Oura Cloud API",
    category: "wearable-direct",
    devCost: "free",
    userSideCost:
      "Each user needs an Oura Ring and an active Oura Membership; the API returns 403 when a user's subscription has expired.",
    approvalGate: "A new API application is limited to 10 users until Oura approves it, with no limit once approved.",
    engEffort: "medium",
    notes:
      "Free for personal and commercial apps by Oura's own FAQ. Personal access tokens are gone, so every integration, even a personal script, uses OAuth 2.0.",
    sourceHref: "/pricing/oura-api-pricing",
  },

  // provenance: "effective October 6, 2026, say access is currently provided at no charge" — /pricing/whoop-api-pricing
  // provenance: "Your users authorize your app with their own WHOOP accounts, so they are WHOOP members already" — /pricing/whoop-api-pricing
  // provenance: "Every new app starts on the Sandbox tier with up to 10 members" — /pricing/whoop-api-pricing
  // provenance: "tiers then run Build (100), Growth (1,000), Scale (5,000) and Production (unlimited)" — /pricing/whoop-api-pricing
  // provenance: "You must have a WHOOP membership to develop an app on the Developer Platform" — /pricing/whoop-api-pricing
  // provenance: "The terms forbid using WHOOP data to train or improve any machine-learning or AI model" — /pricing/whoop-api-pricing
  {
    id: "whoop",
    label: "WHOOP Developer Platform",
    category: "wearable-direct",
    devCost: "free",
    userSideCost: "Users authorize your app with their own WHOOP accounts, so they are WHOOP members already.",
    approvalGate:
      "New apps start on a Sandbox tier of 10 members and move up through reviewed tiers of 100, 1,000, 5,000 and unlimited; developers need a WHOOP membership to build.",
    engEffort: "medium",
    notes:
      "Free under API terms effective October 6, 2026, which let WHOOP attach charges to use beyond its limits and forbid using WHOOP data to train AI models.",
    sourceHref: "/pricing/whoop-api-pricing",
  },

  // provenance: "2026 API Agreement says access is currently provided at no charge" — /pricing/strava-api-pricing
  // provenance: "calls a prerequisite for creating an app" — /pricing/strava-api-pricing
  // provenance: "and they authorize your app themselves" — /pricing/strava-api-pricing
  // provenance: "makes Standard Tier apps subject to subscription requirements for the developer or specified end users" — /pricing/strava-api-pricing
  // provenance: "New apps also start in single-player mode, where only your own account can connect, and the self-service upgrade raises the athlete capacity to 10." — /pricing/strava-api-pricing
  // provenance: "To connect more than 10 athletes, Strava's getting-started guide says to submit your app for review." — /pricing/strava-api-pricing
  // provenance: "data may be shown only to the athlete it belongs to, AI use is banned and caches expire after seven days" — /pricing/strava-api-pricing
  {
    id: "strava",
    label: "Strava API",
    category: "wearable-direct",
    devCost: "free",
    userSideCost:
      "A Strava account whose data your app reads, authorized by the athlete; Standard Tier apps may require specified end users to hold an active Strava subscription.",
    approvalGate:
      "A Strava subscription is a prerequisite for creating an app, which starts in single-player mode; a self-service upgrade raises its athlete capacity to 10, and connecting more than 10 needs Strava's review.",
    engEffort: "medium",
    notes:
      "No per-call fee, but the subscription requirement comes first. The bigger constraints are architectural: data may be shown only to the athlete it belongs to, AI use is banned and caches expire after seven days.",
    sourceHref: "/pricing/strava-api-pricing",
  },

  // provenance: "license agreement says the APIs are currently free of charge" — /integrate/polar-api
  // provenance: "Users authorize through OAuth 2.0 at flow.polar.com" — /integrate/polar-api
  // provenance: "any registered Polar Flow user can create an API client at admin.polaraccesslink.com" — /integrate/polar-api
  // provenance: "Each user must accept all mandatory consents; without them, user endpoints return 403" — /integrate/polar-api
  // provenance: "Polar uses a dynamic limit that scales with your number of registered users" — /integrate/polar-api
  // provenance: "Exercise endpoints return only data uploaded after the user registered with your client, and only from the last 30 days" — /integrate/polar-api
  {
    id: "polar",
    label: "Polar Open AccessLink",
    category: "wearable-direct",
    devCost: "free",
    userSideCost:
      "Each user needs a Polar Flow account and must accept all of Polar's mandatory consents; without them, user endpoints return 403.",
    // Polar documents no review: any registered Polar Flow user creates a
    // client themselves, so this is null (none documented).
    approvalGate: null,
    engEffort: "low",
    notes:
      "Free of charge at the moment under Polar's license agreement, which reserves the right to charge later. Rate limits scale with your registered users, and exercise data covers only uploads from the last 30 days after the user registered with your client.",
    sourceHref: "/integrate/polar-api",
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

  // provenance: "when we read the vendors' pricing pages on October 17, 2026, eight of them showed an entry price" — /pricing/health-data-aggregator-pricing
  // provenance: "Terra bills a subscription plus credits per connected data source" — /fitness-apis/terra-vs-vital
  // provenance: "Terra bills credits for each connected data source and for events past a free allowance" — /fitness-apis/health-data-aggregator-apis
  // provenance: "Terra's homepage now sells lab testing" — /fitness-apis/terra-vs-vital
  // provenance: "Terra's docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym" — /fitness-apis/health-data-aggregator-apis
  {
    id: "terra",
    label: "Terra",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate:
      "Some providers need a special setup process first; Terra's docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym.",
    engEffort: "low",
    notes:
      "A published subscription with included credits, then credits per connected data source and for events past a free allowance, so a user who connects two devices costs twice. Now also sells lab testing.",
    sourceHref: "/fitness-apis/terra-vs-vital",
  },

  // provenance: "Junction's Launch plan is a flat monthly fee for up to 500 connected users, and everything past that, including labs, is a custom Enterprise contract" — /fitness-apis/terra-vs-vital
  {
    id: "junction",
    label: "Junction (formerly Vital)",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate: null,
    engEffort: "low",
    notes:
      "A flat monthly fee for up to 500 connected users on its Launch plan; past that, and for lab testing, a custom Enterprise contract. Wearables plus US lab diagnostics in one integration.",
    sourceHref: "/fitness-apis/terra-vs-vital",
  },

  // provenance: "Rook prices \"based on the plan and the number of active users\"" — /pricing/health-data-aggregator-pricing
  // provenance: "Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts, which ROOK says \"can take several weeks\"" — /fitness-apis/health-data-aggregator-apis
  // provenance: "with \"billing adjusts based on usage\" past each limit and a standard 12-month contract" — /fitness-apis/health-data-aggregator-apis
  // provenance: "SDKs for Apple Health and Health Connect" — /compare/terra-vs-rook
  {
    id: "rook",
    label: "Rook",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate:
      "Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts, which Rook says can take several weeks.",
    engEffort: "low",
    notes:
      "Published plans tiered by active users, with billing that adjusts past each plan's limit and a standard 12-month contract. SDKs cover Apple Health and Health Connect.",
    sourceHref: "/pricing/health-data-aggregator-pricing",
  },

  // provenance: "Spike reaches into medical IoT, lab-report OCR, food-photo nutrition and EMR data" — /alternatives/terra-alternatives
  // provenance: "Spike's pricing page lists a Sandbox plan that \"Starts from" — /fitness-apis/health-data-aggregator-apis
  // provenance: "Spike calls its pricing \"Usage-driven, transparent, and flexible\" but does not itemize how the bill grows" — /fitness-apis/health-data-aggregator-apis
  // provenance: "\"Every organization gets a dedicated implementation engineer from the sandbox level" — /fitness-apis/health-data-aggregator-apis
  // provenance: "Each of its plans is bought through a \"Book a demo\" button rather than a checkout" — /fitness-apis/health-data-aggregator-apis
  // provenance: "a banner on its integrations page reads \"Raintree Systems Acquires Spike Technologies\"" — /fitness-apis/health-data-aggregator-apis
  {
    id: "spike",
    label: "Spike",
    category: "aggregator",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate: "Sales-assisted onboarding: every plan is bought through a demo call, with a dedicated implementation engineer from sandbox.",
    engEffort: "low",
    notes:
      "Broadest scope beyond wearables (medical IoT, EMR, lab reports, food photos). Its pricing page now shows a Sandbox starting price and calls the model usage-driven, but does not itemize how the bill grows. Its site also announces an acquisition by Raintree Systems.",
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
  // provenance: "KinesteX publishes no price list, so this page will not guess its number: access goes through a contact form and API key" — /compare/kinestex-vs-sency
  {
    id: "kinestex",
    label: "KinesteX",
    category: "motion-sdk",
    devCost: "contact-sales",
    userSideCost: null,
    approvalGate: "Access runs through a contact form and an issued API key — no self-serve signup.",
    engEffort: "low",
    notes:
      "This site's own product — see disclosure on linked page. KinesteX publishes no price list; the vendor describes usage-based per-active-user pricing, so budgeting needs a sales conversation.",
    sourceHref: "/compare/kinestex-vs-sency",
  },

  // provenance: "Sency prices by monthly active user" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "Free trial, then usage-based" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "Sign-up runs through a contact form" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "The pricing pages' contact form says Sency then invites you to schedule a call" — /pricing/sency-pricing
  // provenance: "commercial use falls under a separate paid agreement in its Terms of Use" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "per-user plans published on two pages that disagree" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "Models download from Sency's server at configuration" — /fitness-apis/ai-workout-tracking-apis
  {
    id: "sency",
    label: "Sency (SMKit)",
    category: "motion-sdk",
    devCost: "usage-based",
    userSideCost: null,
    approvalGate:
      "Sign-up runs through a contact form that leads to a call, and Sency's Terms of Use put commercial or production use under a separate paid service agreement.",
    engEffort: "low",
    notes:
      "Sency publishes per-user plans, but on two pages that disagree about whether its first active users are free or covered by a paid monthly fee, and sign-up runs through a contact form, so confirm the terms in writing. Models download from Sency's server at configuration.",
    sourceHref: "/fitness-apis/ai-workout-tracking-apis",
  },

  // provenance: "Self-serve free tier, paid above a device threshold" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "without a sales call to start" — /fitness-apis/ai-workout-tracking-apis
  // provenance: "with every SDK feature on every plan" — /fitness-apis/ai-workout-tracking-apis
  {
    id: "quickpose",
    label: "QuickPose",
    category: "motion-sdk",
    devCost: "free-tier-then-paid",
    userSideCost: null,
    approvalGate: null,
    engEffort: "medium",
    notes:
      "A coaching SDK you can start on today without a sales call: a free SDK key, a free tier for a small number of monthly active devices, and paid plans by monthly active device published on its pricing page, with every SDK feature on every plan. iOS, Android and React Native; exercise programming and UI stay on you.",
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
  // provenance: "the text we extracted from it has no license line" (MoveNet MultiPose card) — /motion/pose-estimation-model-licenses
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
    sourceHref: "/motion/pose-estimation-model-licenses",
  },

  // provenance: "free within the Apple toolchain, on Apple platforms only" — /fitness-apis/ai-workout-tracking-apis
  {
    id: "apple-vision",
    label: "Apple Vision body pose",
    category: "pose-model",
    devCost: "free",
    userSideCost: null,
    approvalGate: null,
    engEffort: "high",
    notes:
      "Free within the Apple SDK with no model file to ship, running locally with no network and no per-call cost — but on Apple platforms only, so a cross-platform product still needs a second model. Everything above the joints is yours to build.",
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
