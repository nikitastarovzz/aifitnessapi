import { site, absoluteUrl } from "@/lib/site";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";

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

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
