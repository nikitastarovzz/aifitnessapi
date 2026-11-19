/**
 * Reading paths — ordered routes through pages that already exist.
 *
 * The site is organised by kind of page (integration guide, fix, concept,
 * architecture note). That is the right shape for someone who arrived from a
 * search for one error string, and the wrong shape for someone who has been
 * handed a job and does not yet know which four sections it touches. A path
 * is the second shape: one task, the pages in the order you actually need
 * them, and a sentence per step saying why that page is next rather than
 * later.
 *
 * Every `href` here MUST resolve to a released page. Nothing in this file is
 * generated, so a slug that gets renamed elsewhere becomes a phantom link the
 * moment it changes — the QA gate catches it after a build, but the cheaper
 * check is to keep this list short and to re-check it whenever a cluster
 * release set changes.
 */

export type PathStep = {
  /** Site-relative href to a released page. */
  href: string;
  /** Short human label — close to the page's own H1, not necessarily equal. */
  label: string;
  /** Why this page, at this point in the sequence. One sentence. */
  why: string;
};

export type ReadingPath = {
  slug: string;
  title: string;
  blurb: string;
  steps: PathStep[];
};

export const READING_PATHS: ReadingPath[] = [
  {
    slug: "ship-healthkit-in-a-week",
    title: "Ship a HealthKit read in a week",
    blurb:
      "From an empty Xcode project to a background-syncing HealthKit read, in the order the work actually lands: permissions before queries, queries before the empty-result debugging that always follows.",
    steps: [
      {
        href: "/integrate/healthkit",
        label: "Integrate Apple HealthKit",
        why: "The end-to-end walkthrough: capability, Info.plist keys, authorization request, first query. Everything below assumes you have done this once.",
      },
      {
        href: "/healthkit/activity",
        label: "The HealthKit Activity types",
        why: "Pick the identifiers you are actually reading before you write a query, and learn which of them sum and which must be averaged.",
      },
      {
        href: "/tools/permission-builder",
        label: "Permission set builder",
        why: "Turn that list of types into the exact Info.plist keys and authorization call, with the read-only types flagged so you do not request a write that can never be granted.",
      },
      {
        href: "/tools/query-generator",
        label: "Statistics query generator",
        why: "Generate the HKStatisticsQuery with the right options for each type — the cumulative-vs-discrete choice is the one that silently produces plausible wrong numbers.",
      },
      {
        href: "/fix/healthkit-error-no-data",
        label: "errorNoData: the query found nothing",
        why: "Budget for this one. A first HealthKit read on a real device returns nothing far more often than it throws, and the reasons are not what most people guess.",
      },
      {
        href: "/test/healthkit-integration",
        label: "Test a HealthKit integration",
        why: "The simulator cannot tell you whether this works. Set up the device and fixture story before you ship rather than after the first bug report.",
      },
      {
        href: "/architecture/background-sync",
        label: "Background sync that does not need the phone awake",
        why: "A read that only runs while the app is open is a demo. This is the step that turns it into a product.",
      },
    ],
  },
  {
    slug: "wearables-without-tears",
    title: "Support every wearable without eleven integrations",
    blurb:
      "The aggregator route: what one actually does for you, what it costs, how to wire it, and the two operational problems (webhook delivery, late data) that arrive with it rather than instead of it.",
    steps: [
      {
        href: "/learn/what-is-a-health-data-aggregator",
        label: "What is a health-data aggregator?",
        why: "Start with what the category does and does not absorb — aggregators broker OAuth and normalize payloads; they do not remove the provider approval gates.",
      },
      {
        href: "/fitness-apis/health-data-aggregator-apis",
        label: "The health-data aggregator APIs",
        why: "The landscape in one page, so you are choosing between named products with known coverage rather than between marketing sites.",
      },
      {
        href: "/pricing/health-data-aggregator-pricing",
        label: "What aggregators cost",
        why: "Pricing is per connected user on most of them, which makes the build-vs-buy answer a function of your user count. Get the number before you write code.",
      },
      {
        href: "/integrate/terra-api",
        label: "Integrate Terra",
        why: "A concrete worked integration of one aggregator, end to end. The shape transfers to the others even if you pick a different vendor.",
      },
      {
        href: "/architecture/webhook-ingestion",
        label: "Webhook ingestion done safely",
        why: "Aggregators push. At-least-once delivery means duplicates and out-of-order events are normal traffic, not incidents — the receiver has to be built for it.",
      },
      {
        href: "/fix/wearable-data-delayed",
        label: "Why wearable data is missing or delayed",
        why: "The support ticket you will get most. Most of the delay is upstream of you, and knowing which part is which is the difference between a reply and a rewrite.",
      },
      {
        href: "/migrate/consolidate-wearables-with-aggregator",
        label: "Consolidate direct integrations onto one aggregator",
        why: "If you already have direct integrations, this is the cutover plan that keeps existing users connected through the switch.",
      },
    ],
  },
  {
    slug: "camera-coaching",
    title: "Add camera-based coaching",
    blurb:
      "Pose estimation from the concept to a shipped rep counter and form cue: what the models return, where they run, and the two features everybody builds on top of them.",
    steps: [
      {
        href: "/learn/what-is-pose-estimation",
        label: "What is pose estimation?",
        why: "The vocabulary first — keypoints, confidence, and what a model actually hands you, which is much less than 'it knows the exercise'.",
      },
      {
        href: "/motion/pose-estimation-models-compared",
        label: "Pose estimation models compared",
        why: "MediaPipe, MoveNet, YOLO and the rest differ in keypoint count, speed and license. Choosing here decides most of what follows.",
      },
      {
        href: "/motion/on-device-vs-cloud-pose-estimation",
        label: "On-device vs cloud",
        why: "This one decision sets your latency budget, your per-user cost and your privacy story all at once, so make it deliberately.",
      },
      {
        href: "/guides/camera-pose-tracking",
        label: "Camera pose tracking, practically",
        why: "The build: camera pipeline, frame rate, coordinate spaces, and the smoothing that stops a skeleton from jittering.",
      },
      {
        href: "/guides/add-rep-counting",
        label: "Add rep counting",
        why: "The first feature worth shipping on top of keypoints, and the one where naive thresholding fails on real users.",
      },
      {
        href: "/guides/add-form-feedback",
        label: "Add real-time form feedback",
        why: "The hard one. Ship it after rep counting, because it needs the same signal to be stable before a cue can be trusted.",
      },
    ],
  },
  {
    slug: "escape-google-fit",
    title: "Get off Google Fit",
    blurb:
      "The Android migration in five pages: what is actually being shut down, the mapping to Health Connect, the integration, and the empty-read debugging on the other side.",
    steps: [
      {
        href: "/google-fit-shutdown",
        label: "What is shutting down, and when",
        why: "The dated timeline, with what is confirmed separated from what is reported. Plan against this rather than against a blog post.",
      },
      {
        href: "/migrate/google-fit-to-health-connect",
        label: "Migrate to Health Connect",
        why: "The mapping and cutover plan — the API shapes are not equivalent, and the differences decide how much of your read layer survives.",
      },
      {
        href: "/integrate/google-health-connect",
        label: "Integrate Health Connect",
        why: "The destination platform end to end: permissions, the reads, and the Play policy that governs what you may ask for.",
      },
      {
        href: "/fix/health-connect-no-data",
        label: "Health Connect returns no data",
        why: "The Android counterpart to HealthKit's empty read, and the first thing you will hit on a real device after the integration compiles.",
      },
      {
        href: "/health-connect",
        label: "Every Health Connect record type",
        why: "The reference to keep open while you rewrite the read layer — the full record set, so you can check a type exists before you plan around it.",
      },
    ],
  },
  {
    slug: "one-wearable-brand",
    title: "Get one wearable brand's data past the gate",
    blurb:
      "For when the one API you need sits behind an approval form, an unpublished price or a retired token. Garmin is the worked example; the personal-export, library, OAuth and webhook steps cover other vendors too.",
    steps: [
      {
        href: "/integrate/garmin-api",
        label: "Integrate the Garmin API",
        why: "What Garmin's Connect Developer Program actually is before you apply: the access request, Starter versus Enterprise Access, OAuth 2.0, and push or ping/pull delivery.",
      },
      {
        href: "/fix/garmin-api-approval",
        label: "Garmin API access on hold",
        why: "When the request stalls. What the reorganized program says now, and the order to try things in: apply, and bridge through an aggregator only after confirming whose Garmin credentials it uses.",
      },
      {
        href: "/pricing/garmin-api-pricing",
        label: "What the Garmin API costs",
        why: "Garmin publishes no price for any of its access levels, so this is the list of what to get in writing before you put a number in a budget.",
      },
      {
        href: "/own-your-data",
        label: "Export your own data",
        why: "If the data you need is your own, you may not need a developer program at all: each platform's official export, any personal-use API such as Garmin's, and notebooks to analyze the files.",
      },
      {
        href: "/libraries/python",
        label: "Python libraries for fitness APIs",
        why: "The open-source clients for Garmin Connect, Strava, Oura, Fitbit and Withings, with versions and README caveats. garminconnect and garth are unofficial and sign in as the user, which suits a script for yourself, not an app serving other people.",
      },
      {
        href: "/fix/oura-personal-access-token-deprecated",
        label: "Oura personal access tokens are deprecated",
        why: "The retired-credential trap: a tutorial that tells you to paste an Oura personal token predates Oura's December 2025 deprecation, and new integrations use OAuth 2.0 Authorization Code instead.",
      },
      {
        href: "/tools/oauth-playground",
        label: "Wearable OAuth playground",
        why: "Build the authorize URL, scopes, PKCE and token request for Oura, WHOOP, Strava, Polar, Withings, Wahoo, Dexcom, Suunto or Google Health from each vendor's own docs, before you write the callback.",
      },
      {
        href: "/tools/webhook-verifier",
        label: "Verify a wearable webhook signature",
        why: "Once data starts arriving: paste a webhook from Oura, WHOOP, Polar, Strava, Withings, Wahoo or Google Health, check its signature in the browser and see what the vendor expects back.",
      },
    ],
  },
  {
    slug: "exercise-and-food-content",
    title: "License exercise and food data you can ship",
    blurb:
      "The catalogue route: what each exercise and food database costs once you ship rather than try, which license comes with it, whether it has video, and how its categories line up with the health stores.",
    steps: [
      {
        href: "/fitness-apis/exercise-database-apis",
        label: "Exercise database APIs compared",
        why: "The field side by side — ExerciseDB, wger, API Ninjas, Your Move and free-exercise-db by free tier, price, license, media and size — so you start from the constraint that matters to you.",
      },
      {
        href: "/pricing/exercise-database-api-pricing",
        label: "Exercise database API pricing",
        why: "The cost of shipping, not of trying: API Ninjas' free plan is for evaluation only and storing its data needs a higher plan, while wger and free-exercise-db cost nothing for the data but you host them.",
      },
      {
        href: "/compare/exercisedb-vs-wger",
        label: "ExerciseDB vs wger",
        why: "The license question in its sharpest form: a rented hosted API against self-hosted AGPL software whose exercise data is licensed Creative Commons per entry. Read the copyleft section before you self-host.",
      },
      {
        href: "/alternatives/exercisedb-alternatives",
        label: "ExerciseDB alternatives",
        why: "If ExerciseDB is not the one, the alternatives sorted by what is pushing you away: license and ownership, a simpler hosted API, paid hosted video, or media you control.",
      },
      {
        href: "/fitness-apis/exercise-video-apis",
        label: "Exercise video APIs",
        why: "Only if you need demonstration video. Few exercise APIs serve it, and this page separates hosted video from GIFs, still images and video files licensed from a stock library.",
      },
      {
        href: "/tools/exercise-taxonomy-crosswalk",
        label: "Exercise taxonomy crosswalk",
        why: "If you picked ExerciseDB, wger or free-exercise-db: its categories, equipment and muscles set against HealthKit and Health Connect workout types by name only, with each database's license quoted from its license file or README.",
      },
      {
        href: "/fitness-apis/nutrition-apis",
        label: "Nutrition and food database APIs",
        why: "The food side: USDA FoodData Central, Open Food Facts, Nutritionix, Edamam and Spoonacular, each matched to the use case it fits.",
      },
      {
        href: "/pricing/nutrition-api-pricing",
        label: "What a nutrition API costs",
        why: "Price and, often more binding, usage terms: Edamam allows only end-user-driven requests, and Open Food Facts requires attribution and share-alike.",
      },
    ],
  },
];