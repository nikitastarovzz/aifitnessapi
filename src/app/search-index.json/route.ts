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

/**
 * Site search index — generated from the same data modules as the pages
 * (identical pattern to llms.txt), so it can never drift from what's
 * actually published. ~200 records, a few dozen KB; the client fetches it
 * once on first search interaction.
 *
 * Record: [path, title, description, extra-match-text]
 */
export const dynamic = "force-static";

type Rec = [string, string, string, string];

export function GET() {
  const recs: Rec[] = [];
  const add = (path: string, title: string, desc: string, extra = "") =>
    recs.push([path, title, desc, extra]);

  const clusters: [string, string, { slug: string; h1: string; metaDescription: string; primaryQuery: string }[]][] = [
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
    }
  }

  add("/picker", "Which Fitness API Should I Use? (interactive)", "Three questions, a tailored recommendation.", "picker tool quiz choose");
  add("/matrix", "HealthKit ↔ Health Connect Type Reference", "Matching type identifiers for ten metrics, verified against Apple's and Google's docs.", "matrix types sdnn rmssd");
  add("/day-boundaries", "Why \u201cToday\u2019s Steps\u201d Is a Bug (live demo)", "Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.", "timezone dst day boundary demo interactive");
  add("/google-fit-shutdown", "Google Fit Is Shutting Down", "The verified timeline and the migration path for each kind of integration.", "google fit deprecated sunset end of 2026");
  add("/signup", "Sign up for the newsletter", "API breakdowns matched to what you're building.", "subscribe newsletter email");
  add("/about", "About AIFitnessAPI", "Who writes this site and why.", "about");
  add("/glossary", "Fitness & Health API Glossary", "Every term in one or two honest sentences, linked to the page that treats it properly.", "glossary terms definitions dictionary");
  add("/methodology", "How We Verify", "Primary sources, adversarial review, and who funds the site.", "methodology how we verify sources");

  for (const p of getAllPosts()) add(`/blog/${p.slug}`, p.title, p.description, "blog post");

  return Response.json(recs, {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
