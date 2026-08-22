import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";

/**
 * Clean-markdown mirrors (GEO). Generated from the same data modules as the
 * HTML, so they cannot drift. The HTML page stays canonical; this is the
 * version an agent can ingest without a DOM.
 *
 * Addresses: these are served here AND, via rewrites in next.config, at the
 * conventional llms.txt addresses — `/<cluster>/<slug>.md`, `/<cluster>.md`
 * and `/index.md`. Every document opens with YAML front matter so a parser
 * gets canonical URL, review date, primary query and licence without having
 * to read prose.
 */
export const dynamic = "force-static";
// Unknown paths must 404 outright rather than invoking the handler and being
// cached as a rendered body — /md is a mirror of what exists, not a catch-all.
export const dynamicParams = false;

export function generateStaticParams(): { path: string[] }[] {
  const map = clusterMap();
  // A cluster with no released pages gets no markdown index: an index for an
  // empty cluster is a promise with nothing behind it, and it desynchronizes
  // the mirror counts a GEO gate checks.
  const populated = Object.entries(map).filter(([, entries]) => entries.length > 0);
  return [
    { path: ["index"] },
    ...populated.map(([base]) => ({ path: [base.slice(1)] })),
    ...populated.flatMap(([base, entries]) =>
      entries.map((e) => ({ path: [base.slice(1), e.slug] })),
    ),
  ];
}

function md(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}

/** YAML-escape a scalar: quote it and escape embedded quotes/backslashes. */
function y(v: string): string {
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function frontMatter(fields: [string, string | string[]][]): string[] {
  const out = ["---"];
  for (const [k, v] of fields) {
    if (Array.isArray(v)) {
      out.push(`${k}:`);
      for (const item of v) out.push(`  - ${y(item)}`);
    } else {
      out.push(`${k}: ${y(v)}`);
    }
  }
  out.push("---", "");
  return out;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const map = clusterMap();

  // ——— /index.md — the whole site as one map ———
  if (path.length === 1 && path[0] === "index") {
    const total = Object.values(map).reduce((n, l) => n + l.length, 0);
    const out = frontMatter([
      ["title", site.name],
      ["canonical", site.url],
      ["description", site.description],
      ["publisher", `${site.name} — funded by KinesteX; first-party pages disclose it`],
      ["license", "Content readable and quotable with attribution"],
      ["llms_txt", absoluteUrl("/llms.txt")],
    ]);
    out.push(`# ${site.name}`, "", `> ${site.description}`, "");
    out.push(
      `${total} verified pages across ${Object.keys(map).length} clusters. Every page also exists as markdown at its own URL with \`.md\` appended.`,
      "",
    );
    for (const [base, entries] of Object.entries(map)) {
      out.push(`## ${CLUSTER_LABELS[base] ?? base} — ${absoluteUrl(base)}`, "");
      for (const e of entries) {
        out.push(`- [${e.h1}](${markdownUrl(`${base}/${e.slug}`)}): ${e.primaryQuery}`);
      }
      out.push("");
    }
    return md(out.join("\n"));
  }

  // ——— /<cluster>.md — the cluster map, with every answer capsule ———
  if (path.length === 1) {
    const base = `/${path[0]}`;
    const entries = map[base];
    if (!entries || entries.length === 0) return new Response("Not found", { status: 404 });
    const label = CLUSTER_LABELS[base] ?? path[0];
    const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
    const out = frontMatter([
      ["title", label],
      ["canonical", absoluteUrl(base)],
      ["type", "cluster-index"],
      ["pages", String(entries.length)],
      ["last_reviewed", newest],
      ["publisher", site.name],
    ]);
    out.push(`# ${label}`, "");
    out.push(
      `> ${entries.length} pages. Each entry below shows the question the page owns, followed by its answer capsule.`,
      "",
    );
    for (const e of entries) {
      out.push(`## ${e.h1}`, "");
      out.push(`- Question: ${e.primaryQuery}`);
      out.push(`- HTML: ${absoluteUrl(`${base}/${e.slug}`)}`);
      out.push(`- Markdown: ${markdownUrl(`${base}/${e.slug}`)}`);
      out.push(`- Last reviewed: ${e.updated}`, "");
      out.push(e.answer, "");
    }
    return md(out.join("\n"));
  }

  // ——— /<cluster>/<slug>.md — the full article ———
  if (path.length !== 2) return new Response("Not found", { status: 404 });
  const [cluster, slug] = path;
  const base = `/${cluster}`;
  const entry = map[base]?.find((e) => e.slug === slug);
  if (!entry) return new Response("Not found", { status: 404 });

  const canonical = absoluteUrl(`${base}/${slug}`);
  const out = frontMatter([
    ["title", entry.h1],
    ["canonical", canonical],
    ["cluster", CLUSTER_LABELS[base] ?? cluster],
    ["primary_query", entry.primaryQuery],
    ["last_reviewed", entry.updated],
    ["description", entry.metaDescription],
    [
      "publisher",
      entry.firstParty
        ? `${site.name} — funded by KinesteX, the subject of this page; disclosure in body`
        : `${site.name} — independent, not sponsored`,
    ],
    ["cite_as", `"${entry.h1}", ${site.name}, ${canonical}`],
  ]);

  out.push(`# ${entry.h1}`, "", `> ${entry.answer}`, "");
  out.push(
    `- Canonical: ${canonical}`,
    `- Last reviewed: ${entry.updated}`,
    // First-party pages must carry the conflict in the citation header itself,
    // not just the body — an agent quoting the header alone still sees it.
    entry.firstParty
      ? `- Publisher: ${site.name} (${site.url}) — funded by KinesteX, the subject of this page; disclosure in body`
      : `- Publisher: ${site.name} (${site.url}) — independent, not sponsored`,
    `- Cite as: "${entry.h1}", ${site.name}, ${canonical}`,
    "",
    "---",
    "",
    entry.body,
    "",
  );
  if (entry.faqs.length) {
    out.push("## FAQ", "");
    entry.faqs.forEach((f, i) => {
      out.push(`### ${f.q}`, "", f.a, "", `[Permalink](${canonical}#faq-${i + 1})`, "");
    });
  }
  return md(out.join("\n"));
}
