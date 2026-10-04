import { getAllPosts } from "@/lib/posts";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";
import { releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";
import { releasedFixes, FIX_PATH } from "@/data/fix";
import { releasedLearn, LEARN_PATH } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";
import { releasedCompliance, COMPLIANCE_PATH } from "@/data/compliance";
import { releasedMigrate, MIGRATE_PATH } from "@/data/migrate";
import { releasedPricing, PRICING_PATH } from "@/data/pricing";
import { releasedCompare, COMPARE_PATH } from "@/data/compare";
import { releasedData, DATA_PATH } from "@/data/healthData";
import { releasedMotion, MOTION_PATH } from "@/data/motion";
import { releasedAi, AI_PATH } from "@/data/ai";
import { releasedArchitecture, ARCHITECTURE_PATH } from "@/data/architecture";
import { releasedTesting, TEST_PATH } from "@/data/testing";
import { releasedCookbook, COOKBOOK_PATH } from "@/data/cookbook";
import { releasedDevices, DEVICES_PATH } from "@/data/devices";
import { releasedEngagement, ENGAGEMENT_PATH } from "@/data/engagement";
import { releasedWatchApps, WATCH_PATH } from "@/data/watchApps";
import { releasedAccessibility, A11Y_PATH } from "@/data/accessibility";
import { API_ENTRIES, APIS_PATH, CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/apis";
import { releasedHkGroups, HK_BASE } from "@/data/hkGroupPages";
import { HK_IDENTIFIERS } from "@/data/healthkitIdentifiers";
import { releasedAudioCoaching, AUDIO_PATH } from "@/data/audioCoaching";
import { releasedHealthkitQueries, HKQ_PATH } from "@/data/healthkitQueries";
import { releasedPhoneSensors, SENSORS_PATH } from "@/data/phoneSensors";
import { releasedHealthConnectApi, HCAPI_PATH } from "@/data/healthConnectApi";
import { HK_METADATA_KEYS } from "@/data/healthkitMetadataKeys";
import { HS_DATA_TYPES } from "@/data/healthServicesDataTypes";
import {
  orderedRecords,
  recordPath,
  recordTitle,
  recordDescription,
  shortPermission,
  hcTotals,
  HC_BASE,
  HC_PERMISSIONS_PATH,
  HC_AGGREGATES_PATH,
} from "@/data/hcPages";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, libraryPages } from "@/data/librariesEditorial";
import { hkVersionPages, versionTitle, versionDescription, versionPrimaryQuery } from "@/lib/hkVersions";
import { HC_ERROR_CONSTANTS } from "@/data/errorCodes";
import { HC_RELEASES } from "@/data/hcReleases";

/**
 * Site search index — generated from the same data modules as the pages
 * (identical pattern to llms.txt), so it can never drift from what's
 * actually published. The client fetches it once on first search
 * interaction.
 *
 * Record: [path, title, description, extra-match-text, kind?]
 *
 * Every FAQ on every spoke is its own record, addressed at its `#faq-N`
 * anchor. People search in questions — "why is my fitbit token 401" is a
 * question we have answered on a page whose title says none of those words,
 * and title-only matching could never find it. The answer text is truncated
 * because this file is downloaded before anyone has typed anything.
 */
export const dynamic = "force-static";

type Rec = [string, string, string, string] | [string, string, string, string, string];

/** FAQ answers are indexed as a preview, not in full — this file is a
 *  download, and the page itself is one click away. */
function preview(s: string, max = 180): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

export function GET() {
  const recs: Rec[] = [];
  const add = (path: string, title: string, desc: string, extra = "") =>
    recs.push([path, title, desc, extra]);

  const clusters: [
    string,
    string,
    {
      slug: string;
      h1: string;
      metaDescription: string;
      primaryQuery: string;
      faqs: { q: string; a: string }[];
    }[],
  ][] = [
    [PILLAR_PATH, "Fitness APIs", releasedEntries()],
    [GUIDES_PATH, "Guides", releasedGuides()],
    [BUILD_PATH, "Build", releasedBuilds()],
    [INTEGRATE_PATH, "Integrate", releasedIntegrations()],
    [FIX_PATH, "Fix", releasedFixes()],
    [LEARN_PATH, "Learn", releasedLearn()],
    [ALTERNATIVES_PATH, "Alternatives", releasedAlternatives()],
    [COMPLIANCE_PATH, "Compliance", releasedCompliance()],
    [MIGRATE_PATH, "Migrate", releasedMigrate()],
    [PRICING_PATH, "Pricing", releasedPricing()],
    [COMPARE_PATH, "Compare", releasedCompare()],
    [DATA_PATH, "Health Data", releasedData()],
    [MOTION_PATH, "AI Motion", releasedMotion()],
    [AI_PATH, "AI Features", releasedAi()],
    [ARCHITECTURE_PATH, "Architecture", releasedArchitecture()],
    [TEST_PATH, "Testing", releasedTesting()],
    [COOKBOOK_PATH, "Cookbook", releasedCookbook()],
    [DEVICES_PATH, "Connected Devices", releasedDevices()],
    [ENGAGEMENT_PATH, "Engagement & Retention", releasedEngagement()],
    [WATCH_PATH, "Watch Apps", releasedWatchApps()],
    [A11Y_PATH, "Accessibility", releasedAccessibility()],
    [AUDIO_PATH, "Audio Coaching", releasedAudioCoaching()],
    [HKQ_PATH, "HealthKit Queries", releasedHealthkitQueries()],
    [SENSORS_PATH, "Phone Sensors", releasedPhoneSensors()],
    [HCAPI_PATH, "Health Connect API", releasedHealthConnectApi()],
  ];

  const hubBlurbs: Record<string, string> = {
    [PILLAR_PATH]: "Choose a fitness API by job — content, wearables, aggregators, nutrition, AI motion.",
    [GUIDES_PATH]: "Add AI workout tracking: camera pose, rep counting, form feedback, per platform.",
    [BUILD_PATH]: "Build playbooks by app type — coaching, strength, running, rehab, nutrition.",
    [INTEGRATE_PATH]: "Per-provider integration walkthroughs, from HealthKit to Terra.",
    [FIX_PATH]: "Symptom-to-fix for fitness API errors: 401s, 429s, empty reads, dead webhooks.",
    [LEARN_PATH]: "Plain-English explainers for the health-tech vocabulary.",
    [ALTERNATIVES_PATH]: "Why teams switch each API and the realistic options.",
    [COMPLIANCE_PATH]: "HIPAA, GDPR, FDA and store policy for health apps.",
    [MIGRATE_PATH]: "Step-by-step migration playbooks between fitness APIs.",
    [PRICING_PATH]: "What fitness and health APIs actually cost.",
    [COMPARE_PATH]: "Developer-lens head-to-heads: Oura vs WHOOP, Terra vs Rook, and more.",
    [DATA_PATH]: "Which API gives you each health metric, measured vs estimated.",
    [MOTION_PATH]: "Pose estimation tech: models, 2D vs 3D, rep counting, form scoring.",
    [AI_PATH]: "LLM features in fitness apps: plans, food logging, guardrails, cost.",
    [ARCHITECTURE_PATH]: "Pipelines, storage and data quality for multi-source health data.",
    [TEST_PATH]: "Testing HealthKit, Health Connect, wearable and camera integrations.",
    [COOKBOOK_PATH]: "Runnable, CI-tested reference code: token rotation, webhooks, rollups, rep counting.",
    [DEVICES_PATH]: "Pair straps, machines, and watches: BLE heart rate, FTMS, live watch data, testing.",
    [A11Y_PATH]:
      "Making a fitness app usable when someone cannot see the screen, cannot hear the cue, or cannot reach the button mid-set.",
    [WATCH_PATH]: "Building the app that runs on the watch: sessions, background, tiles, pairing, battery, testing.",
    [AUDIO_PATH]: "Workout cues over the user's music: ducking, interruptions, background audio, Android audio focus, TextToSpeech, watch speakers.",
    [HKQ_PATH]: "How each HealthKit query class works and where it bites: sample, statistics, anchored, observer, descriptors, routes, rings.",
    [SENSORS_PATH]: "Fitness features from the phone's own motion sensors: steps, activity, altitude, head motion, and the Android permission rules around them.",
    [HCAPI_PATH]: "How each Health Connect Jetpack call works and where it bites: readRecords paging, aggregates, getChanges, upserts, deletes, permissions, background and history reads, routes, training plans.",
    [ENGAGEMENT_PATH]: "Getting people back: notifications, Live Activities, widgets, streaks, leaderboards \u2014 and how to measure lift honestly.",
  };

  // Synonym boosts for tokens people type that page titles don't contain.
  const EXTRA: Record<string, string> = {
    "/architecture/deduplicate-health-data": "dedupe duplicate steps double counting",
    "/architecture/timezones-and-day-boundaries": "dst midnight timezone",
    "/fix/fitness-api-401-unauthorized": "fitbit 401 unauthorized token",
    "/test/health-connect-test-data": "fake mock health connect",
  };

  for (const [base, label, entries] of clusters) {
    add(base, `${label} — all topics`, hubBlurbs[base] ?? "", label.toLowerCase());
    for (const e of entries) {
      const path = `${base}/${e.slug}`;
      add(path, e.h1, e.metaDescription, [e.primaryQuery, EXTRA[path]].filter(Boolean).join(" "));
      e.faqs.forEach((f, i) => {
        recs.push([`${path}#faq-${i + 1}`, f.q, preview(f.a), e.h1, "faq"]);
      });
    }
  }

  // The question indexes. Every individual question is already a record
  // above, addressed at its own anchor; these are the pages that list them,
  // for the reader who wants to browse a topic rather than search a phrase.
  const questionsIn = (entries: { faqs: unknown[] }[]) =>
    entries.reduce((n, e) => n + e.faqs.length, 0);
  const questionTotal = clusters.reduce((n, [, , entries]) => n + questionsIn(entries), 0);
  add(
    "/questions",
    "Every question this site answers",
    `${questionTotal} named questions grouped by topic, each one a link straight to the paragraph that answers it.`,
    "questions index faq answers list all every question",
  );
  for (const [base, label, entries] of clusters) {
    if (entries.length === 0) continue;
    add(
      `/questions${base}`,
      `${label}: every question answered`,
      `All ${questionsIn(entries)} questions the ${label.toLowerCase()} pages answer, each linking straight to its answer.`,
      `questions faq index answers ${label.toLowerCase()}`,
    );
  }

  // The HealthKit reference set. The group pages are derived, so the index
  // gains them the day they ship and lists none while the set is empty.
  add(
    HK_BASE,
    "HealthKit data types by group",
    "Apple's HealthKit identifiers organised the way Apple groups them: activity, nutrition, vital signs, body measurements, lab results and the rest.",
    "healthkit groups data types activity nutrition vital signs reference",
  );
  for (const g of releasedHkGroups()) {
    add(`${HK_BASE}/${g.slug}`, g.title, g.metaDescription, `healthkit identifiers group ${g.primaryQuery}`);
  }
  add(
    "/healthkit-versions",
    "HealthKit Types by iOS Version",
    "Which HealthKit identifiers arrived in which iOS release, so a deployment target tells you what you can read.",
    "healthkit ios versions timeline availability deployment target ios 18 ios 17",
  );
  add(
    "/healthkit-status",
    "Deprecated and Beta HealthKit Types",
    "The HealthKit identifiers Apple marks deprecated, beta or undocumented, and what each status means for shipping code.",
    "healthkit deprecated beta undocumented status unavailable renamed",
  );
  add(
    "/healthkit-category-values",
    "Every HKCategoryValue Enum",
    "The value enums that decode a HealthKit category sample, per identifier — a category sample is meaningless without the right one.",
    "hkcategoryvalue enum sleep analysis category sample values decode",
  );
  add(
    "/healthkit-units",
    "Every HKUnit HealthKit Uses",
    "The units and unit families HealthKit quantity samples are expressed in, and which identifiers use each.",
    "hkunit units count kcal meters bpm unit family quantity",
  );
  for (const g of hkVersionPages()) {
    add(g.path, versionTitle(g), versionDescription(g), `${versionPrimaryQuery(g)} healthkit identifiers ios ${g.major}`);
  }

  // The Health Connect record reference (generated from Google's pages).
  const hcT = hcTotals();
  add(
    HC_BASE,
    "Health Connect record types",
    `Every Health Connect record class (${hcT.records}) with fields, permission strings and aggregate metrics, from Google's Jetpack reference.`,
    "health connect records android record types jetpack androidx health reference",
  );
  add(
    HC_PERMISSIONS_PATH,
    "Health Connect permissions: every android.permission.health string",
    `All ${hcT.frameworkPermissions} android.permission.health strings, grouped, with API level and the record each unlocks.`,
    "health connect permissions android.permission.health read write manifest healthpermissions",
  );
  add(
    HC_AGGREGATES_PATH,
    "Health Connect aggregate metrics",
    `All ${hcT.aggregates} AggregateMetric constants with Google's description and value type.`,
    "health connect aggregate metrics aggregatemetric count_total bpm_avg aggregate request",
  );
  for (const r of orderedRecords()) {
    const perms = [...new Set([...r.readPermissions, ...r.writePermissions].map(shortPermission))];
    const metrics = r.aggregateMetrics.map((m) => m.name);
    add(recordPath(r), recordTitle(r), recordDescription(r), [r.className, ...perms, ...metrics, "health connect record"].join(" "));
  }

  // Open-source libraries (registry facts generated weekly).
  add(
    LIBRARIES_BASE,
    "Open-source health & fitness libraries",
    "Open-source packages for HealthKit, Health Connect and fitness APIs: latest versions, release dates, licences and README caveats.",
    "libraries packages sdk open source npm pub.dev pypi react native flutter capacitor python wrapper",
  );
  for (const { lib, ed } of libraryPages()) {
    add(`${LIBRARIES_BASE}/${ed.slug}`, ed.title, ed.metaDescription, [lib.name, ed.primaryQuery, lib.wraps?.join(" ") ?? ""].filter(Boolean).join(" "));
  }
  for (const c of LIBRARY_COMPARISONS) {
    add(`${LIBRARIES_BASE}/compare/${c.slug}`, c.title, c.metaDescription, `${c.primaryQuery} vs compare`);
  }

  // Generated platform references.
  add(
    "/error-codes",
    "HealthKit & Health Connect error codes",
    "The platform error-code reference: HKError.Code and Health Connect's error codes, each linked to its fix guide where one exists.",
    "error codes hkerror healthconnectexception reference",
  );
  add(
    "/error-codes/health-connect",
    "Health Connect error codes",
    `All ${HC_ERROR_CONSTANTS.length} HealthConnectException ERROR_* constants with value, description and API level, plus the Jetpack client's exception types.`,
    ["healthconnectexception error code", ...HC_ERROR_CONSTANTS.map((c) => c.name)].join(" "),
  );
  add(
    "/health-connect-releases",
    "Health Connect SDK releases",
    `All ${HC_RELEASES.length} androidx.health.connect:connect-client releases: version, date, stage and what changed.`,
    "health connect sdk releases connect-client androidx version changelog alpha beta stable",
  );
  add(
    "/healthkit-metadata-keys",
    "HealthKit metadata keys",
    `All ${HK_METADATA_KEYS.length} HKMetadataKey constants in Apple's topic groups, with Apple's wording, OS versions and the value type where Apple states it.`,
    ["healthkit metadata keys hkmetadatakey metadata dictionary", ...HK_METADATA_KEYS.map((k) => k.swiftName)].join(" "),
  );
  add(
    "/wear-os-data-types",
    "Wear OS Health Services data types",
    `All ${HS_DATA_TYPES.length} Health Services DataType constants with Google's description, declared Kotlin type and the permission Google's table lists.`,
    ["wear os health services datatype data types exerciseclient passivemonitoringclient", ...HS_DATA_TYPES.map((t) => t.name)].join(" "),
  );

  add(
    APIS_PATH,
    "Fitness & Health API Directory",
    "Every API this site covers, with how it bills you, what your users must own, and what gates launch.",
    "directory apis list vendors providers index",
  );
  for (const a of API_ENTRIES) {
    add(
      `${APIS_PATH}/${a.id}`,
      a.label,
      `${DEV_COST_LABELS[a.devCost]}${a.approvalGate ? " · approval gate" : ""}${a.userSideCost ? " · user-side cost" : ""}`,
      [a.aliases.join(" "), CATEGORY_LABELS[a.category], "directory pricing access"].join(" "),
    );
  }

  add("/picker", "Which Fitness API Should I Use? (interactive)", "Three questions, a tailored recommendation.", "picker tool quiz choose");
  add("/cost-planner", "Fitness API Cost Planner (interactive)", "The cost structure of your stack: billing models, user-side costs, approval gates, eng effort.", "cost calculator pricing budget planner tool");
  add("/changes", "Fitness API Changes & Deadlines Tracker", "The dated, graded record of ecosystem changes: deprecations, deadlines, term changes \u2014 confirmed vs reported.", "changes changelog deadlines deprecations tracker news updates");
  add("/state-of-fitness-apis-2026", "The State of Fitness APIs 2026", "Original research: 25 APIs surveyed on access structure \u2014 free vs gated vs contact-sales \u2014 with an open CC BY dataset.", "state of fitness apis report research dataset statistics survey 2026");
  add("/ai-fitness-app", "How to Build an AI Fitness App", "The six layers and the five decisions that pick your stack \u2014 the decision map into every cluster.", "build ai fitness app gym workout development guide map");
  add("/no-code-fitness-app", "Build a Fitness App With No Code, Just APIs", "A worked example assembled from APIs: embedded AI coaching, hosted wearable auth, one-sentence food logging \u2014 and where no-code honestly bends.", "no code nocode fitness app apis without coding builder visual flutterflow bubble worked example");
  add("/matrix", "HealthKit ↔ Health Connect Type Reference", "Matching type identifiers for ten metrics, verified against Apple's and Google's docs.", "matrix types sdnn rmssd");
  add("/healthkit-identifiers", "Every HealthKit Type Identifier", `All ${HK_IDENTIFIERS.length} HealthKit identifiers across four families with units, value enums, availability, and the cumulative-vs-discrete split.`, "healthkit hkquantitytypeidentifier hkcategorytypeidentifier hkworkoutactivitytype cumulative discrete hkstatisticsquery sleepanalysis units identifiers");
  add("/healthkit-errors", "Every HealthKit Error Code", "All 17 HKError.Code cases, what each means, and why a denied HealthKit read raises no error at all.", "healthkit error hkerror errorauthorizationdenied code 5 no data permission denied");
  add("/day-boundaries", "Why \u201cToday\u2019s Steps\u201d Is a Bug (live demo)", "Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.", "timezone dst day boundary demo interactive");
  add("/google-fit-shutdown", "Google Fit Is Shutting Down", "The verified timeline and the migration path for each kind of integration.", "google fit deprecated sunset end of 2026");
  add("/fitbit-api-shutdown", "Fitbit Web API Retirement: Deadlines and Migration", "What is confirmed vs reported about the turndown reported for ~September 2026, and the migration path by integration shape.", "fitbit api shutdown deprecated retirement google health september 2026");
  add("/datasets", "Open datasets (CC BY 4.0)", "Every dataset this site publishes: API access structures, the HealthKit/Health Connect type matrix, the changes log, the glossary.", "datasets open data csv json cc by download research");
  add("/badges", "Embeds & badges", "Put the type reference or the deadlines tracker on your own page, or link back with a badge.", "embed iframe widget badge link back");
  add("/compare-apis", "Compare two fitness APIs side by side", "Access structure, user-side cost and approval gates for any two products in the directory.", "compare versus vs side by side tool");
  add("/alerts", "API change alerts", "Watch the fitness APIs you depend on and get an email when a dated deprecation or terms change lands.", "alerts watch notify subscribe deprecation deadline");
  add("/digest", "Monthly digest archive", "What changed in the fitness and health API ecosystem each month, and which pages were verified.", "digest newsletter archive monthly issues");
  add("/search", "Search every page and answer", "Search the whole site, including the individual questions answered inside each page.", "search find query");
  add("/signup", "Sign up for the newsletter", "API breakdowns matched to what you're building.", "subscribe newsletter email");
  add("/about", "About AIFitnessAPI", "Who writes this site and why.", "about");
  add("/glossary", "Fitness & Health API Glossary", "Every term in one or two honest sentences, linked to the page that treats it properly.", "glossary terms definitions dictionary");
  add("/methodology", "How We Verify", "Primary sources, adversarial review, and who funds the site.", "methodology how we verify sources");
  add("/paths", "Reading paths", "Curated page sequences for a goal: ship HealthKit in a week, escape Google Fit, wearables without tears.", "reading path learning sequence curriculum guide");
  add("/tools", "Free tools for health-app builders", "Ten tools that answer from the site's published datasets: diagnose an error, check an aggregation, build a permission set, generate a stack.", "tools free interactive utilities");
  add("/tools/error-diagnoser", "Diagnose a HealthKit or OAuth error", "Paste an error, get the matching diagnosis from the error dataset and the fix guides.", "error diagnoser paste debug hkerror oauth 401 429 tool");
  add("/tools/aggregation-checker", "Sum or average? Check any HealthKit type", "Type an identifier, get the cumulative-vs-discrete verdict with Apple's own sentence as evidence.", "aggregation cumulative discrete sum average statistics tool");
  add("/tools/identifier-translator", "HealthKit to Health Connect translator", "Two-way lookup over the verified cross-platform matrix, honest about everything it has not verified.", "translate healthkit health connect identifier record mapping tool");
  add("/tools/permission-builder", "HealthKit permission set builder", "Pick your types, get the Info.plist keys and authorization code, with read-only types flagged from Apple's own wording.", "permissions info.plist authorization nshealthshareusagedescription tool");
  add("/tools/query-generator", "HealthKit statistics query generator", "Pick a type and a window, get the correct HKStatisticsQuery with the right options, or an honest refusal.", "hkstatisticsquery swift code generator cumulativesum discreteaverage tool");
  add("/tools/stack-generator", "Fitness app stack generator", "Four questions in, a concrete recommended stack out, composed from the directory and type data with reasons stated.", "stack generator wizard recommend apis tool");
  add("/newsletter", "The AIFitnessAPI newsletter", "What changed in fitness and health APIs, verified before it is sent. The archive is the sample.", "newsletter subscribe email digest updates");
  add("/changelog", "Site changelog", "Every content change, rendered from the operational log it is generated from.", "changelog history what changed updates");
  add("/corrections", "Corrections log", "Published corrections, and the errors the build gates caught before publish.", "corrections errata errors fixed accuracy");
  add("/gates", "What This Site Refuses to Ship", "Every automated refusal the build runs before a change can deploy, and what each one refuses to publish.", "gates qa checks build refusals quality automated verification");

  for (const p of getAllPosts()) add(`/blog/${p.slug}`, p.title, p.description, "blog post");

  return Response.json(recs, {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
