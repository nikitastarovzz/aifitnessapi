import { site, absoluteUrl } from "@/lib/site";
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

/**
 * llms-full.txt — the fuller LLM-facing dump: each spoke's answer capsule and
 * FAQs inline, so an assistant can answer directly and cite the source (§8).
 */
export const dynamic = "force-static";

export function GET() {
  const spokes = releasedEntries();

  const out: string[] = [
    `# ${site.name} — full reference for LLMs`,
    "",
    `> ${site.description}`,
    "",
    "Independent, non-sponsored comparisons for developers choosing fitness/health APIs. Verify volatile specifics (pricing, rate limits) in each provider's official docs.",
    "",
    `## Best Fitness & Workout APIs — ${absoluteUrl(PILLAR_PATH)}`,
    "There is no single best fitness API; choose by job — exercise/workout content, wearable & device data, health-data aggregators, nutrition data, or AI motion tracking. Pick the category first, then compare within it.",
    "",
  ];

  for (const e of spokes) {
    out.push(`## ${e.h1} — ${absoluteUrl(`${PILLAR_PATH}/${e.slug}`)}`);
    out.push(`Primary query: ${e.primaryQuery}`);
    out.push("");
    out.push(e.answer);
    out.push("");
    if (e.faqs.length) {
      out.push("FAQ:");
      for (const f of e.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
      out.push("");
    }
  }

  const guides = releasedGuides();
  if (guides.length) {
    out.push(`# How-to guides — ${absoluteUrl(GUIDES_PATH)}`, "");
    for (const g of guides) {
      out.push(`## ${g.h1} — ${absoluteUrl(`${GUIDES_PATH}/${g.slug}`)}`);
      out.push(`Primary query: ${g.primaryQuery}`);
      out.push("");
      out.push(g.answer);
      out.push("");
      if (g.faqs.length) {
        out.push("FAQ:");
        for (const f of g.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const builds = releasedBuilds();
  if (builds.length) {
    out.push(`# Build guides — ${absoluteUrl(BUILD_PATH)}`, "");
    for (const b of builds) {
      out.push(`## ${b.h1} — ${absoluteUrl(`${BUILD_PATH}/${b.slug}`)}`);
      out.push(`Primary query: ${b.primaryQuery}`);
      out.push("");
      out.push(b.answer);
      out.push("");
      if (b.faqs.length) {
        out.push("FAQ:");
        for (const f of b.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const integrations = releasedIntegrations();
  if (integrations.length) {
    out.push(`# Integration guides — ${absoluteUrl(INTEGRATE_PATH)}`, "");
    for (const it of integrations) {
      out.push(`## ${it.h1} — ${absoluteUrl(`${INTEGRATE_PATH}/${it.slug}`)}`);
      out.push(`Primary query: ${it.primaryQuery}`);
      out.push("");
      out.push(it.answer);
      out.push("");
      if (it.faqs.length) {
        out.push("FAQ:");
        for (const f of it.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const fixes = releasedFixes();
  if (fixes.length) {
    out.push(`# Troubleshooting — ${absoluteUrl(FIX_PATH)}`, "");
    for (const fx of fixes) {
      out.push(`## ${fx.h1} — ${absoluteUrl(`${FIX_PATH}/${fx.slug}`)}`);
      out.push(`Primary query: ${fx.primaryQuery}`);
      out.push("");
      out.push(fx.answer);
      out.push("");
      if (fx.faqs.length) {
        out.push("FAQ:");
        for (const f of fx.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const learn = releasedLearn();
  if (learn.length) {
    out.push(`# Concepts explained — ${absoluteUrl(LEARN_PATH)}`, "");
    for (const ln of learn) {
      out.push(`## ${ln.h1} — ${absoluteUrl(`${LEARN_PATH}/${ln.slug}`)}`);
      out.push(`Primary query: ${ln.primaryQuery}`);
      out.push("");
      out.push(ln.answer);
      out.push("");
      if (ln.faqs.length) {
        out.push("FAQ:");
        for (const f of ln.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const alternatives = releasedAlternatives();
  if (alternatives.length) {
    out.push(`# Alternatives — ${absoluteUrl(ALTERNATIVES_PATH)}`, "");
    for (const alt of alternatives) {
      out.push(`## ${alt.h1} — ${absoluteUrl(`${ALTERNATIVES_PATH}/${alt.slug}`)}`);
      out.push(`Primary query: ${alt.primaryQuery}`);
      out.push("");
      out.push(alt.answer);
      out.push("");
      if (alt.faqs.length) {
        out.push("FAQ:");
        for (const f of alt.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const compliance = releasedCompliance();
  if (compliance.length) {
    out.push(`# Compliance & privacy — ${absoluteUrl(COMPLIANCE_PATH)}`, "");
    out.push("General engineering guidance for health-data compliance, not legal advice. Regulations vary by jurisdiction and change — verify current obligations with a qualified professional.", "");
    for (const c of compliance) {
      out.push(`## ${c.h1} — ${absoluteUrl(`${COMPLIANCE_PATH}/${c.slug}`)}`);
      out.push(`Primary query: ${c.primaryQuery}`);
      out.push("");
      out.push(c.answer);
      out.push("");
      if (c.faqs.length) {
        out.push("FAQ:");
        for (const f of c.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const migrate = releasedMigrate();
  if (migrate.length) {
    out.push(`# Migration guides — ${absoluteUrl(MIGRATE_PATH)}`, "");
    for (const m of migrate) {
      out.push(`## ${m.h1} — ${absoluteUrl(`${MIGRATE_PATH}/${m.slug}`)}`);
      out.push(`Primary query: ${m.primaryQuery}`);
      out.push("");
      out.push(m.answer);
      out.push("");
      if (m.faqs.length) {
        out.push("FAQ:");
        for (const f of m.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const pricing = releasedPricing();
  if (pricing.length) {
    out.push(`# Pricing — ${absoluteUrl(PRICING_PATH)}`, "");
    out.push("Most first-party wearable APIs are free to call; the real costs are aggregators, nutrition/exercise APIs, user device/membership, and infra. Pricing is volatile — verify current figures.", "");
    for (const p of pricing) {
      out.push(`## ${p.h1} — ${absoluteUrl(`${PRICING_PATH}/${p.slug}`)}`);
      out.push(`Primary query: ${p.primaryQuery}`);
      out.push("");
      out.push(p.answer);
      out.push("");
      if (p.faqs.length) {
        out.push("FAQ:");
        for (const f of p.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const compare = releasedCompare();
  if (compare.length) {
    out.push(`# Comparisons — ${absoluteUrl(COMPARE_PATH)}`, "");
    out.push("Developer-lens head-to-heads: what data each exposes via its API, access model, cost, and fit. Recommends by use-case, not a single winner.", "");
    for (const c of compare) {
      out.push(`## ${c.h1} — ${absoluteUrl(`${COMPARE_PATH}/${c.slug}`)}`);
      out.push(`Primary query: ${c.primaryQuery}`);
      out.push("");
      out.push(c.answer);
      out.push("");
      if (c.faqs.length) {
        out.push("FAQ:");
        for (const f of c.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const healthData = releasedData();
  if (healthData.length) {
    out.push(`# Health data by metric — ${absoluteUrl(DATA_PATH)}`, "");
    out.push("Which sources expose each health metric, how to access it, and whether it's measured or a modeled estimate. Treat consumer-device data as a wellness signal, not a diagnosis.", "");
    for (const d of healthData) {
      out.push(`## ${d.h1} — ${absoluteUrl(`${DATA_PATH}/${d.slug}`)}`);
      out.push(`Primary query: ${d.primaryQuery}`);
      out.push("");
      out.push(d.answer);
      out.push("");
      if (d.faqs.length) {
        out.push("FAQ:");
        for (const f of d.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const motion = releasedMotion();
  if (motion.length) {
    out.push(`# AI motion & pose estimation — ${absoluteUrl(MOTION_PATH)}`, "");
    out.push("The technical/decision layer behind camera-based fitness: pose model choice, 2D vs 3D, on-device vs cloud, accuracy, and how rep counting and form scoring work. Camera-based form feedback is a coaching aid, not medical/PT advice.", "");
    for (const m of motion) {
      out.push(`## ${m.h1} — ${absoluteUrl(`${MOTION_PATH}/${m.slug}`)}`);
      out.push(`Primary query: ${m.primaryQuery}`);
      out.push("");
      out.push(m.answer);
      out.push("");
      if (m.faqs.length) {
        out.push("FAQ:");
        for (const f of m.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const ai = releasedAi();
  if (ai.length) {
    out.push(`# AI & LLM features — ${absoluteUrl(AI_PATH)}`, "");
    out.push("The language-model layer of a fitness app: plan generation, natural-language food logging, conversational coaching, grounding a model in your own catalogue, safety guardrails, model choice, evaluation, and cost. LLM output about exercise or nutrition is not medical advice, and the app publisher owns what the app tells a user.", "");
    for (const a of ai) {
      out.push(`## ${a.h1} — ${absoluteUrl(`${AI_PATH}/${a.slug}`)}`);
      out.push(`Primary query: ${a.primaryQuery}`);
      out.push("");
      out.push(a.answer);
      out.push("");
      if (a.faqs.length) {
        out.push("FAQ:");
        for (const f of a.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const architecture = releasedArchitecture();
  if (architecture.length) {
    out.push(`# Health data architecture — ${absoluteUrl(ARCHITECTURE_PATH)}`, "");
    out.push("Pipelines, storage and data quality for multi-source health data. Key facts: HealthKit performs no automatic deduplication of raw samples (merging happens only inside statistics query results, only for quantity types); Health Connect deduplicates only Activity and Sleep, only via its aggregate API, with the source priority order controlled by the user rather than the app. Health samples are late-arriving and retro-edited, not append-only.", "");
    for (const a of architecture) {
      out.push(`## ${a.h1} — ${absoluteUrl(`${ARCHITECTURE_PATH}/${a.slug}`)}`);
      out.push(`Primary query: ${a.primaryQuery}`);
      out.push("");
      out.push(a.answer);
      out.push("");
      if (a.faqs.length) {
        out.push("FAQ:");
        for (const f of a.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const testing = releasedTesting();
  if (testing.length) {
    out.push(`# Testing health & fitness apps — ${absoluteUrl(TEST_PATH)}`, "");
    out.push("Testing the surfaces that resist automation. Apple ships no test double for HealthKit; Google's Health Connect testing library is an alpha that stubs aggregation rather than faking it; background delivery cannot be triggered on demand; the iOS Simulator has no camera. This cluster covers what to automate behind a seam you control, what needs a real device, and what can only be monitored in production.", "");
    for (const t of testing) {
      out.push(`## ${t.h1} — ${absoluteUrl(`${TEST_PATH}/${t.slug}`)}`);
      out.push(`Primary query: ${t.primaryQuery}`);
      out.push("");
      out.push(t.answer);
      out.push("");
      if (t.faqs.length) {
        out.push("FAQ:");
        for (const f of t.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const cookbook = releasedCookbook();
  if (cookbook.length) {
    out.push(`# Cookbook — runnable, CI-tested reference code — ${absoluteUrl(COOKBOOK_PATH)}`, "");
    out.push("Dependency-free JavaScript implementations of the patterns this site documents, each with a node:test suite that runs in CI on every change; the code on each page is a byte-verbatim copy of the tested file. MIT-licensed.", "");
    for (const c of cookbook) {
      out.push(`## ${c.h1} — ${absoluteUrl(`${COOKBOOK_PATH}/${c.slug}`)}`);
      out.push(`Primary query: ${c.primaryQuery}`, "", c.answer, "");
      if (c.faqs.length) {
        for (const f of c.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const devices = releasedDevices();
  if (devices.length) {
    out.push(`# Connected fitness devices — BLE, FTMS, watch data — ${absoluteUrl(DEVICES_PATH)}`, "");
    out.push("The live-hardware layer of a fitness app: standard Bluetooth GATT profiles (Heart Rate, Fitness Machine, cycling sensors) with identifiers verified against the Bluetooth SIG's published assigned numbers, live watch data on watchOS and Wear OS, Web Bluetooth reach, and the testing story for hardware CI cannot script.", "");
    for (const d of devices) {
      out.push(`## ${d.h1} — ${absoluteUrl(`${DEVICES_PATH}/${d.slug}`)}`);
      out.push(`Primary query: ${d.primaryQuery}`, "", d.answer, "");
      if (d.faqs.length) {
        for (const f of d.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const engagement = releasedEngagement();
  if (engagement.length) {
    out.push(`# Engagement & retention for fitness apps — ${absoluteUrl(ENGAGEMENT_PATH)}`, "");
    out.push("Platform engagement surfaces verified against Apple's and Google's documentation, plus streaks, leaderboards and honest measurement. This cluster states no engagement or retention percentages: no public dataset ranks fitness SDKs by retention lift, and vendor case studies are marketing, so the pages teach measurement with a holdout instead.", "");
    for (const g of engagement) {
      out.push(`## ${g.h1} — ${absoluteUrl(`${ENGAGEMENT_PATH}/${g.slug}`)}`);
      out.push(`Primary query: ${g.primaryQuery}`, "", g.answer, "");
      if (g.faqs.length) {
        for (const f of g.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const watchApps = releasedWatchApps();
  if (watchApps.length) {
    out.push(`# Building watch apps — watchOS and Wear OS — ${absoluteUrl(WATCH_PATH)}`, "");
    out.push("Writing the app that runs on the wrist: workout session lifecycle, background execution, WorkoutKit scheduling, Wear OS Health Services, tiles, phone pairing, battery and testing. Every platform claim verified against Apple's or Google's own documentation.", "");
    for (const w of watchApps) {
      out.push(`## ${w.h1} — ${absoluteUrl(`${WATCH_PATH}/${w.slug}`)}`);
      out.push(`Primary query: ${w.primaryQuery}`, "", w.answer, "");
      if (w.faqs.length) {
        for (const f of w.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  const a11y = releasedAccessibility();
  if (a11y.length) {
    out.push(`# Accessibility for fitness and health apps — ${absoluteUrl(A11Y_PATH)}`, "");
    out.push(
      "Making a fitness product usable when somebody cannot see the screen, cannot hear the cue, or cannot reach the button mid-set. Every platform claim is verified against Apple's or Google's own documentation. This cluster deliberately cites no WCAG criteria and makes no legal claims: w3.org was unreachable when it was written, and an unverifiable standards citation is worse than none.",
      "",
    );
    for (const a of a11y) {
      out.push(`## ${a.h1} — ${absoluteUrl(`${A11Y_PATH}/${a.slug}`)}`);
      out.push(`Primary query: ${a.primaryQuery}`, "", a.answer, "");
      if (a.faqs.length) {
        for (const f of a.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  out.push(`# Free tools — ${absoluteUrl("/")}`, "");
  out.push(`## Which Fitness API Should I Use? (interactive picker) — ${absoluteUrl("/picker")}`);
  out.push("Primary query: which fitness api should i use");
  out.push("");
  out.push(
    "A three-question tool (what you're building, your platform, your top priority) that recommends a fitness/health API approach and links to the relevant comparisons, integration guides, and pricing. Independent, not sponsored.",
  );
  out.push("");
  out.push(`## HealthKit and Health Connect data-type reference — ${absoluteUrl("/matrix")}`);
  out.push("Primary query: healthkit health connect data types");
  out.push("");
  out.push(
    "Ten common health metrics with their matching Apple HealthKit and Android Health Connect type identifiers, verified against Apple's and Google's own documentation. Key cross-platform gotcha: Apple stores HRV as SDNN (HKQuantityTypeIdentifier.heartRateVariabilitySDNN) while Health Connect stores RMSSD (HeartRateVariabilityRmssdRecord) — these are different measures and are not interconvertible. Both stores are on-device with no server endpoint.",
  );
  out.push("");

  const posts = getAllPosts();
  if (posts.length) {
    out.push(`# Blog — ${absoluteUrl("/blog")}`, "");
    out.push(
      "Findings derived from this site's own published datasets. Each post states when the underlying source was read.",
      "",
    );
    for (const p of posts) {
      out.push(`## ${p.title} — ${absoluteUrl(`/blog/${p.slug}`)}`);
      out.push(`Published: ${p.date}; last reviewed: ${p.updated}`);
      out.push("");
      out.push(p.description);
      out.push("");
      if (p.faqs.length) {
        out.push("FAQ:");
        for (const f of p.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
