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
  add("/healthkit-identifiers", "Every HealthKit Type Identifier", "All 240 HealthKit identifiers across four families with units, value enums, availability, and the cumulative-vs-discrete split.", "healthkit hkquantitytypeidentifier hkcategorytypeidentifier hkworkoutactivitytype cumulative discrete hkstatisticsquery sleepanalysis units identifiers");
  add("/day-boundaries", "Why \u201cToday\u2019s Steps\u201d Is a Bug (live demo)", "Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.", "timezone dst day boundary demo interactive");
  add("/google-fit-shutdown", "Google Fit Is Shutting Down", "The verified timeline and the migration path for each kind of integration.", "google fit deprecated sunset end of 2026");
  add("/fitbit-api-shutdown", "Fitbit Web API Retirement: Deadlines and Migration", "What is confirmed vs reported about the ~September 2026 turndown, and the migration path by integration shape.", "fitbit api shutdown deprecated retirement google health september 2026");
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

  for (const p of getAllPosts()) add(`/blog/${p.slug}`, p.title, p.description, "blog post");

  return Response.json(recs, {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
