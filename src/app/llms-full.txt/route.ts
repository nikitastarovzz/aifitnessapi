import { site, absoluteUrl } from "@/lib/site";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";
import { releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";
import { releasedFixes, FIX_PATH } from "@/data/fix";
import { releasedLearn, LEARN_PATH } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";

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

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
