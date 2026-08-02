"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";

/**
 * Interactive "which fitness API should I use?" picker. Three questions (the job,
 * the platform, the top priority) produce a tailored recommendation that links
 * into the site's comparison, integration, pricing, and compliance content. It's
 * a navigation/decision layer over the whole hub — honest and independent, it
 * routes to guidance rather than pushing any product. Renders on the server for
 * the first step (SEO) and hydrates for interactivity.
 */

type Job =
  | "exercise-content"
  | "wearable-data"
  | "aggregate-many"
  | "nutrition"
  | "ai-motion"
  | "specific-metric";
type Platform = "ios" | "android" | "web" | "cross-platform";
type Priority =
  | "ship-fast"
  | "low-cost"
  | "data-depth"
  | "privacy"
  | "avoid-lock-in"
  | "compliance";

type ResultLink = { href: string; label: string; primary?: boolean };
type Result = { title: string; body: string; links: ResultLink[] };

const JOB_OPTIONS: { value: Job; label: string; hint: string }[] = [
  { value: "wearable-data", label: "Wearable & device data", hint: "Steps, heart rate, sleep, workouts from users' devices" },
  { value: "aggregate-many", label: "Many devices at once", hint: "One integration across Fitbit, Garmin, Oura, Apple, and more" },
  { value: "ai-motion", label: "AI motion / camera tracking", hint: "Rep counting and form feedback from the camera" },
  { value: "exercise-content", label: "Exercise & workout content", hint: "A library of exercises, images, and instructions" },
  { value: "nutrition", label: "Nutrition & food data", hint: "Calories, macros, food and recipe databases" },
  { value: "specific-metric", label: "One specific metric", hint: "Just heart rate, steps, sleep, HRV, calories…" },
];

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "cross-platform", label: "Cross-platform (iOS + Android)" },
  { value: "ios", label: "iOS only" },
  { value: "android", label: "Android only" },
  { value: "web", label: "Web / backend" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; hint: string }[] = [
  { value: "ship-fast", label: "Ship fast", hint: "Least integration work" },
  { value: "low-cost", label: "Keep costs low", hint: "Free or cheap to start" },
  { value: "data-depth", label: "Data depth & control", hint: "Full access, provider-specific fields" },
  { value: "privacy", label: "Privacy / on-device", hint: "Keep data on the phone" },
  { value: "avoid-lock-in", label: "Avoid vendor lock-in", hint: "Stay portable" },
  { value: "compliance", label: "Compliance", hint: "HIPAA, GDPR, health-data rules" },
];

const L = {
  wearables: { href: "/fitness-apis/wearable-data-apis", label: "Best wearable data APIs" },
  aggregators: { href: "/fitness-apis/health-data-aggregator-apis", label: "Best health-data aggregator APIs" },
  exercise: { href: "/fitness-apis/exercise-database-apis", label: "Best exercise database APIs" },
  nutrition: { href: "/fitness-apis/nutrition-apis", label: "Best nutrition APIs" },
  aiApis: { href: "/fitness-apis/ai-workout-tracking-apis", label: "Best AI workout tracking APIs" },
  free: { href: "/fitness-apis/free-fitness-apis", label: "Free & open-source fitness APIs" },
  hkVsHc: { href: "/fitness-apis/apple-healthkit-vs-google-health-connect", label: "HealthKit vs Health Connect" },
  buildOwn: { href: "/fitness-apis/fitness-api-vs-build-your-own", label: "Fitness API vs build your own" },
  data: { href: "/data", label: "Health data by metric" },
  motion: { href: "/motion", label: "AI motion & pose estimation" },
  motionBuildBuy: { href: "/motion/build-vs-buy-ai-motion-tracking", label: "Build vs buy AI motion tracking" },
  cKinestexSency: { href: "/compare/kinestex-vs-sency", label: "KinesteX vs Sency (our own product, disclosed)" },
  guides: { href: "/guides", label: "AI workout tracking guides" },
  iHealthkit: { href: "/integrate/healthkit", label: "Integrate Apple HealthKit" },
  iHc: { href: "/integrate/google-health-connect", label: "Integrate Google Health Connect" },
  iTerra: { href: "/integrate/terra-api", label: "Integrate Terra" },
  iExercisedb: { href: "/integrate/exercisedb-api", label: "Integrate ExerciseDB" },
  iNutritionix: { href: "/integrate/nutritionix-api", label: "Integrate the Nutritionix API" },
  onDevice: { href: "/learn/on-device-vs-cloud-health-data", label: "On-device vs cloud health data" },
  storeSecure: { href: "/compliance/store-health-data-securely", label: "Store health data securely" },
  hipaa: { href: "/compliance/hipaa-compliance-fitness-app", label: "Does your app need HIPAA?" },
  compliance: { href: "/compliance", label: "Health-data compliance & privacy" },
  areFree: { href: "/pricing/are-fitness-apis-free", label: "Are fitness APIs free?" },
  pAgg: { href: "/pricing/health-data-aggregator-pricing", label: "Aggregator pricing models" },
  pExercise: { href: "/pricing/exercise-database-api-pricing", label: "Exercise database API pricing" },
  pNutrition: { href: "/pricing/nutrition-api-pricing", label: "Nutrition API pricing" },
  cTerraRook: { href: "/compare/terra-vs-rook", label: "Terra vs Rook" },
  cExercisedbWger: { href: "/compare/exercisedb-vs-wger", label: "ExerciseDB vs wger" },
  cNutritionixEdamam: { href: "/compare/nutritionix-vs-edamam", label: "Nutritionix vs Edamam" },
  landscape: { href: "/fitness-apis", label: "The full fitness API landscape" },
};

function recommend(job: Job, platform: Platform, priority: Priority): Result {
  const links: ResultLink[] = [];
  const seen = new Set<string>();
  const add = (l: ResultLink) => {
    if (seen.has(l.href)) return;
    seen.add(l.href);
    links.push(l);
  };

  let title = "";
  let body = "";

  // Whether an aggregator is the better default for this answer set.
  const leansAggregator =
    platform === "cross-platform" || priority === "ship-fast" || priority === "avoid-lock-in";

  switch (job) {
    case "wearable-data":
      if (leansAggregator) {
        title = "Start with a health-data aggregator";
        body =
          "You want device data across platforms or with the least integration work, so one aggregator (Terra, Junction, Rook, Spike) that normalizes many wearables behind a single integration is usually the fastest path — you trade a recurring fee for far less per-vendor work.";
        add({ ...L.aggregators, primary: true });
        add(L.cTerraRook);
        add(L.iTerra);
      } else {
        title = "Integrate wearable data directly";
        body =
          "You want depth and control on a focused platform, so integrating the wearable APIs you care about directly (or reading the on-device store) gives you full access without a middleman — at the cost of more maintenance per provider.";
        add({ ...L.wearables, primary: true });
      }
      break;
    case "aggregate-many":
      title = "Use a health-data aggregator";
      body =
        "Covering many devices at once is exactly what aggregators are for: one integration and one webhook normalizes Fitbit, Garmin, Oura, Apple, and more. Compare them on coverage and pricing model.";
      add({ ...L.aggregators, primary: true });
      add(L.cTerraRook);
      add(L.pAgg);
      add(L.iTerra);
      break;
    case "ai-motion":
      title = "AI motion tracking: buy an SDK or build the pipeline";
      body =
        "Camera-based rep counting and form feedback run on pose estimation. Decide build-vs-buy first: an SDK ships faster with an exercise library included; building your own gives control but means choosing a model, per-platform work, and accuracy tuning.";
      add({ ...L.aiApis, primary: true });
      add(L.motionBuildBuy);
      add(L.cKinestexSency);
      add(L.motion);
      add(L.guides);
      break;
    case "exercise-content":
      title = "Use an exercise / workout content API";
      body =
        "You need a library of exercises with instructions and media. Compare hosted paid gateways against free, open, self-host options — and mind the licensing (some open datasets are AGPL).";
      add({ ...L.exercise, primary: true });
      add(L.cExercisedbWger);
      add(L.pExercise);
      add(L.iExercisedb);
      break;
    case "nutrition":
      title = "Use a nutrition / food-data API";
      body =
        "For calories, macros, and food or recipe data, compare the paid databases (Nutritionix, Edamam, Spoonacular) against the genuinely free/open options (USDA FoodData Central, Open Food Facts).";
      add({ ...L.nutrition, primary: true });
      add(L.cNutritionixEdamam);
      add(L.pNutrition);
      add(L.iNutritionix);
      break;
    case "specific-metric":
      title = "Pick the source for that metric";
      body =
        "Since you need one specific metric, start from the data itself: each metric page shows which sources expose it, how to access it, and whether it's measured or a modeled estimate.";
      add({ ...L.data, primary: true });
      break;
  }

  // Platform modifiers.
  if (job !== "exercise-content" && job !== "nutrition" && job !== "ai-motion") {
    if (platform === "ios") add(L.iHealthkit);
    else if (platform === "android") add(L.iHc);
    else if (platform === "cross-platform") add(L.hkVsHc);
  }

  // Priority modifiers.
  switch (priority) {
    case "low-cost":
      add(L.areFree);
      add(L.free);
      break;
    case "privacy":
      add(L.onDevice);
      add(L.storeSecure);
      break;
    case "compliance":
      add(L.hipaa);
      add(L.compliance);
      break;
    case "data-depth":
      if (job === "wearable-data" || job === "aggregate-many") add(L.wearables);
      break;
    case "avoid-lock-in":
      add(L.buildOwn);
      break;
  }

  add(L.landscape);
  return { title, body, links: links.slice(0, 6) };
}

const STEPS = ["What are you building?", "Which platform?", "What matters most?"] as const;

export default function ApiPicker() {
  const [step, setStep] = useState(0);
  const [job, setJob] = useState<Job | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);

  const result = job && platform && priority ? recommend(job, platform, priority) : null;

  function restart() {
    setStep(0);
    setJob(null);
    setPlatform(null);
    setPriority(null);
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Our suggestion
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">{result.title}</h2>
        <p className="mt-3 text-[var(--muted)]">{result.body}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {result.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => track("picker-result", "spoke-inline")}
                className={`flex h-full items-center justify-between gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  l.primary
                    ? "border-brand-400 bg-brand-500/10 text-[var(--fg)] hover:bg-brand-500/20"
                    : "border-[var(--border)] text-[var(--fg)] hover:border-brand-400 hover:bg-[var(--bg)]"
                }`}
              >
                <span>
                  {l.primary && <span className="mr-1 text-brand-600 dark:text-brand-300">Start here →</span>}
                  {l.label}
                </span>
                {!l.primary && <span aria-hidden className="text-[var(--muted)]">→</span>}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-[var(--muted)]">
          A starting point, not a verdict — every project is different. Nobody pays for placement here;
          the site is funded by KinesteX, and any page featuring it says so up front.
        </p>

        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
        >
          ↺ Start over
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">{STEPS[step]}</h2>

      {step === 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {JOB_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  setJob(o.value);
                  setStep(1);
                }}
                className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] p-4 text-left transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 1 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {PLATFORM_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  setPlatform(o.value);
                  setStep(2);
                }}
                className="flex h-full w-full items-center rounded-xl border border-[var(--border)] p-4 text-left font-semibold text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 2 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {PRIORITY_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => setPriority(o.value)}
                className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] p-4 text-left transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-6 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
