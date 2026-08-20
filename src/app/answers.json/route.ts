import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";
import { changesSorted, WATCH_ITEMS } from "@/data/changes";

/**
 * The answer index: every question this site owns, with the answer, in one
 * machine-readable document.
 *
 * Why it exists: llms.txt is a map, llms-full.txt is prose, and the /md
 * mirrors are documents. None of them is a *structured* index an agent can
 * load once and query. This is — one JSON object per answerable question,
 * carrying the canonical URL, the markdown URL, the deep link to the exact
 * FAQ answer, the review date, and the disclosure flag. Generated from the
 * same data modules as the pages, so it cannot drift.
 */
export const dynamic = "force-static";

export function GET() {
  const map = clusterMap();

  const answers = Object.entries(map).flatMap(([base, entries]) =>
    entries.map((e) => {
      const url = absoluteUrl(`${base}/${e.slug}`);
      return {
        question: e.primaryQuery,
        answer: e.answer,
        title: e.h1,
        url,
        markdown: markdownUrl(`${base}/${e.slug}`),
        cluster: CLUSTER_LABELS[base] ?? base,
        cluster_url: absoluteUrl(base),
        last_reviewed: e.updated,
        // Disclosed conflict of interest, machine-readable: pages about the
        // product of the company funding this site are flagged here as well
        // as in the rendered page and the markdown mirror.
        first_party: Boolean(e.firstParty),
        faqs: e.faqs.map((f, i) => ({
          question: f.q,
          answer: f.a,
          url: `${url}#faq-${i + 1}`,
        })),
      };
    }),
  );

  const body = {
    name: `${site.name} answer index`,
    description:
      "Every question this site owns, with its answer, canonical URL, markdown mirror and review date. One object per page; FAQ entries carry deep links to the individual answer.",
    site: site.url,
    publisher: {
      name: site.name,
      url: site.url,
      publishing_principles: absoluteUrl("/methodology"),
      funding_disclosure:
        "This site is funded by KinesteX, an AI motion SDK. Pages that cover KinesteX are flagged first_party and carry a rendered disclosure.",
    },
    license: "Quotable with attribution. Cite the canonical URL.",
    conventions: {
      markdown_mirror: "Append .md to any page URL.",
      llms_txt: absoluteUrl("/llms.txt"),
      llms_full_txt: absoluteUrl("/llms-full.txt"),
      changes_feed: absoluteUrl("/changes.xml"),
    },
    generated: answers.length,
    clusters: Object.keys(map).length,
    answers,
    // The dated ecosystem record, graded — the highest-value thing here to
    // cite, and the part that goes stale fastest if an agent caches it.
    changes: changesSorted().map((c) => ({
      date: c.date,
      title: c.title,
      summary: c.summary,
      status: c.status,
      url: absoluteUrl(c.page.href),
      verified_on: c.verifiedOn,
    })),
    watching: WATCH_ITEMS.map((w) => ({
      title: w.title,
      summary: w.summary,
      url: absoluteUrl(w.page.href),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
