import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";
import { changesSorted, WATCH_ITEMS } from "@/data/changes";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { GROUPS as GLOSSARY_GROUPS, termSlug } from "@/data/glossary";

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
    // Individually addressable facts.
    //
    // The `answers` array above is page-shaped: one object per page, which is
    // the right grain for "what does this site say about X". It is the wrong
    // grain for citation. A model that wants to state "heartRate is a discrete
    // type" should be able to cite that single fact at a stable address rather
    // than a page containing it, so each record below carries its own `id` —
    // a URL with the fragment that scrolls to the row it came from.
    //
    // Everything here is derived from the same modules the pages render, so a
    // fact cannot appear here that is not also on the site.
    facts: {
      description:
        "Individually citable reference facts. Each `id` is a resolvable URL with a fragment addressing the exact row. Cite the id, not the page.",
      healthkit_quantity_types: {
        count: HK_IDENTIFIERS.length,
        source_read_on: HK_FETCHED_ON,
        source: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier",
        derivation_note:
          "aggregation and unit_family are derived from Apple's prose, which states them in sentences rather than as properties; null means Apple's wording does not state it. Everything else is copied from Apple's payload.",
        items: HK_IDENTIFIERS.map((r) => ({
          id: `${absoluteUrl("/healthkit-identifiers")}#id-${r.case.toLowerCase()}`,
          identifier: r.case,
          objc_constant: r.objc,
          abstract: r.abstract || null,
          aggregation: r.aggregation,
          aggregation_evidence: r.aggregationEvidence,
          unit_family: r.unitFamily,
          ios_introduced: r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null,
          apple_documents_it: !r.undocumented,
          apple_docs: `https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/${r.case.toLowerCase()}`,
        })),
      },
      cross_platform_types: {
        count: MATRIX_ROWS.length,
        note:
          "Scoped deliberately to the two on-device stores. A metric's absence means we could not verify it on both platforms, not that it does not exist.",
        items: MATRIX_ROWS.map((r) => ({
          id: `${absoluteUrl("/matrix")}#${r.id}`,
          metric: r.label,
          apple_healthkit: r.apple,
          android_health_connect: r.android,
          caveat: r.watchOut ?? null,
          guide: absoluteUrl(r.href),
        })),
      },
      glossary: {
        count: GLOSSARY_GROUPS.reduce((n, g) => n + g.terms.length, 0),
        items: GLOSSARY_GROUPS.flatMap((g) =>
          g.terms.map((t) => ({
            id: `${absoluteUrl("/glossary")}#term-${termSlug(t.term)}`,
            term: t.term,
            definition: t.def,
            group: g.title,
            explained_at: absoluteUrl(t.href),
          })),
        ),
      },
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
