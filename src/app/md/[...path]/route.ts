import { clusterMap } from "@/lib/clusterRegistry";
import { absoluteUrl, site } from "@/lib/site";

/**
 * Clean-markdown mirrors for every spoke page (GEO): /md/<cluster>/<slug>
 * serves the article as text/markdown with a citation header. Generated from
 * the same data modules as the HTML, so it cannot drift. The HTML page stays
 * canonical; this is the version an agent can ingest without a DOM.
 */
export const dynamic = "force-static";

export function generateStaticParams(): { path: string[] }[] {
  return Object.entries(clusterMap()).flatMap(([base, entries]) =>
    entries.map((e) => ({ path: [base.slice(1), e.slug] })),
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (path.length !== 2) return new Response("Not found", { status: 404 });
  const [cluster, slug] = path;
  const entry = clusterMap()[`/${cluster}`]?.find((e) => e.slug === slug);
  if (!entry) return new Response("Not found", { status: 404 });

  const canonical = absoluteUrl(`/${cluster}/${slug}`);
  const out = [
    `# ${entry.h1}`,
    "",
    `> ${entry.answer}`,
    "",
    `- Canonical: ${canonical}`,
    `- Last reviewed: ${entry.updated}`,
    `- Publisher: ${site.name} (${site.url}) — independent, not sponsored`,
    `- Cite as: "${entry.h1}", ${site.name}, ${canonical}`,
    "",
    "---",
    "",
    entry.body,
    "",
  ];
  if (entry.faqs.length) {
    out.push("## FAQ", "");
    for (const f of entry.faqs) out.push(`### ${f.q}`, "", f.a, "");
  }
  return new Response(out.join("\n"), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
