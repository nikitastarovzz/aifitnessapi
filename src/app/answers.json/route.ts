import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";
import { CATEGORY_LABELS, DEV_COST_LABELS } from "@/data/costModel";
import {
  DEV_COST_MEANING,
  GLANCE_COST_ITEMS,
  GLANCE_HUBS,
  hubGlance,
  hubQa,
  qaText,
  segText,
} from "@/data/hubGlance";
import { moneyPages, MONEY_GROUP_LABELS, MONEY_GROUP_ORDER } from "@/data/moneyPages";
import { changesSorted, WATCH_ITEMS } from "@/data/changes";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { HK_IDENTIFIERS, HK_FAMILIES, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { GROUPS as GLOSSARY_GROUPS, termSlug } from "@/data/glossary";
import { getAllPosts } from "@/lib/posts";
import { orderedRecords, recordPath, recordH1, recordCapsule, recordFaqs, hcModified } from "@/data/hcPages";
import {
  allTypes as ghapiTypes,
  ghapiModified,
  typeCapsule as ghapiTypeCapsule,
  typeFaqs as ghapiTypeFaqs,
  typeH1 as ghapiTypeH1,
  typePath as ghapiTypePath,
} from "@/data/ghapiPages";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, comparisonModified, libraryPages, librariesModified } from "@/data/librariesEditorial";
import { LIBRARY_LANDINGS, landingPath } from "@/data/librariesLandings";
import { hkPageIdentifiers, hkIdentifierPath, hkPageH1, hkPageCapsule, hkPageFaqs, hkPageModified } from "@/data/hkIdentifierPages";
import { hsPageTypes, hsDataTypePath, hsPageH1, hsPageCapsule, hsPageFaqs, hsPageModified } from "@/data/hsDataTypePages";

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
      claims_index: absoluteUrl("/claims.json"),
    },
    generated: answers.length,
    clusters: Object.keys(map).length,
    // The money pages first, each with the opening of its own capsule, and
    // the four section hubs' direct answers and at-a-glance tables. Built by
    // src/data/moneyPages.ts and src/data/hubGlance.ts from the cost model and
    // the pages' capsules, so nothing here is not also on the page it names.
    start_here: {
      description:
        "Pricing, alternatives, head-to-head and per-vendor integration pages, plus the newest pages, each with the opening sentence(s) of its own answer capsule. The full record for each is in `answers` below.",
      groups: MONEY_GROUP_ORDER.map((g) => ({
        group: g,
        label: MONEY_GROUP_LABELS[g],
        pages: moneyPages()
          .filter((m) => m.group === g)
          .map((m) => ({
            title: m.entry.h1,
            question: m.entry.primaryQuery,
            one_line_answer: m.oneLine,
            url: absoluteUrl(m.path),
            answer_url: `${absoluteUrl(m.path)}#answer`,
            markdown: markdownUrl(m.path),
            cluster: CLUSTER_LABELS[m.basePath] ?? m.basePath,
            published: m.published,
            last_reviewed: m.entry.updated,
            first_party: Boolean(m.entry.firstParty),
          })),
      })).filter((g) => g.pages.length > 0),
      hub_answers: GLANCE_HUBS.map((h) => ({
        hub: absoluteUrl(h),
        questions: hubQa(h).map((q) => ({
          question: q.q,
          url: `${absoluteUrl(h)}#${q.id}`,
          // "route": another page owns this question; the hub only points there.
          kind: q.kind,
          answer: qaText(q),
          sources: [...new Set(q.parts.map((p) => absoluteUrl(p.href)))],
        })),
      })),
      at_a_glance: GLANCE_HUBS.map((h) => {
        const g = hubGlance(h);
        return {
          hub: absoluteUrl(h),
          url: `${absoluteUrl(h)}#at-a-glance`,
          title: g.heading,
          columns: g.columns,
          rows: g.rows.map((r) => ({
            id: `${absoluteUrl(h)}#${r.id}`,
            cells: r.cells.map((c) => segText(c)),
            links: [...new Set(r.cells.flat().flatMap((s) => (s.href ? [absoluteUrl(s.href)] : [])))],
          })),
          note: g.footnote,
        };
      }),
    },
    answers,
    // The blog carries findings derived from the datasets below rather than
    // reference answers, so it is a separate collection: an agent looking for
    // "what does this site assert about X" should not have to parse prose,
    // and the posts' own FAQ blocks are the quotable part.
    posts: getAllPosts().map((p) => ({
      title: p.title,
      description: p.description,
      url: absoluteUrl(`/blog/${p.slug}`),
      markdown: markdownUrl(`/blog/${p.slug}`),
      published: p.date,
      last_reviewed: p.updated,
      tags: p.tags,
      faqs: p.faqs.map((f) => ({ question: f.q, answer: f.a })),
    })),
    // Generated reference pages outside the cluster registry (no markdown
    // mirror, so no `markdown` field): the Health Connect record pages, the
    // HealthKit identifier and Wear OS data type pages, and the open-source
    // library pages. Same answer/FAQ shape as `answers`,
    // kept separate because they are not cluster spokes.
    reference_pages: [
      ...orderedRecords().map((r) => {
        const url = absoluteUrl(recordPath(r));
        return {
          question: r.className,
          answer: recordCapsule(r),
          title: recordH1(r),
          url,
          section: "Health Connect record reference",
          last_reviewed: hcModified(),
          first_party: false,
          faqs: recordFaqs(r).map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      // One page per HealthKit identifier and Wear OS data type that clears
      // its thin-page rule (hkIdentifierPages.ts, hsDataTypePages.ts).
      ...hkPageIdentifiers().map((id) => {
        const url = absoluteUrl(hkIdentifierPath(id));
        return {
          question: id.objc,
          answer: hkPageCapsule(id),
          title: hkPageH1(id),
          url,
          section: "HealthKit identifier reference",
          last_reviewed: hkPageModified(id),
          first_party: false,
          faqs: hkPageFaqs(id).map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      ...hsPageTypes().map((t) => {
        const url = absoluteUrl(hsDataTypePath(t));
        return {
          question: `DataType.${t.name}`,
          answer: hsPageCapsule(t),
          title: hsPageH1(t),
          url,
          section: "Wear OS Health Services data types",
          last_reviewed: hsPageModified(),
          first_party: false,
          faqs: hsPageFaqs(t).map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      ...ghapiTypes().map((t) => {
        const url = absoluteUrl(ghapiTypePath(t));
        return {
          question: `Google Health API ${t.name} (${t.dataType})`,
          answer: ghapiTypeCapsule(t),
          title: ghapiTypeH1(t),
          url,
          section: "Google Health API reference",
          last_reviewed: ghapiModified(),
          first_party: false,
          faqs: ghapiTypeFaqs(t).map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      ...LIBRARY_LANDINGS.map((l) => {
        const url = absoluteUrl(landingPath(l));
        return {
          question: l.primaryQuery,
          answer: l.answer,
          title: l.h1,
          url,
          section: "Open-source libraries",
          last_reviewed: librariesModified(),
          first_party: false,
          faqs: l.faqs.map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      ...libraryPages().map(({ ed }) => {
        const url = absoluteUrl(`${LIBRARIES_BASE}/${ed.slug}`);
        return {
          question: ed.primaryQuery,
          answer: ed.answer,
          title: ed.h1,
          url,
          section: "Open-source libraries",
          last_reviewed: librariesModified(),
          first_party: false,
          faqs: ed.faqs.map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
      ...LIBRARY_COMPARISONS.map((c) => {
        const url = absoluteUrl(`${LIBRARIES_BASE}/compare/${c.slug}`);
        return {
          question: c.primaryQuery,
          answer: c.answer,
          title: c.h1,
          url,
          section: "Open-source libraries",
          last_reviewed: comparisonModified(c),
          first_party: false,
          faqs: c.faqs.map((f, i) => ({ question: f.q, answer: f.a, url: `${url}#faq-${i + 1}` })),
        };
      }),
    ],
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
      healthkit_type_identifiers: {
        count: HK_IDENTIFIERS.length,
        families: HK_FAMILIES,
        source_read_on: HK_FETCHED_ON,
        source: "https://developer.apple.com/documentation/healthkit",
        derivation_note:
          "aggregation and unit_family are derived from Apple's prose, which states them in sentences rather than as properties. Both apply only to quantity types: elsewhere null means the concept does not apply, not that Apple was silent — read them together with `family`. Everything else is copied from Apple's payload.",
        items: HK_IDENTIFIERS.map((r) => ({
          id: `${absoluteUrl("/healthkit-identifiers")}#id-${r.case.toLowerCase()}`,
          identifier: r.case,
          objc_constant: r.objc,
          family: r.familyType,
          abstract: r.abstract || null,
          aggregation: r.aggregation,
          aggregation_evidence: r.aggregationEvidence,
          unit_family: r.unitFamily,
          value_enum: r.valueEnum,
          ios_introduced: r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null,
          apple_documents_it: !r.undocumented,
          apple_docs: `https://developer.apple.com/documentation/healthkit/${r.familyType.toLowerCase()}/${r.case.toLowerCase()}`,
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
      // How each product bills developers, what its users need and what gates
      // launch, one row per product of the cost model, at the row of the
      // /pricing hub's at-a-glance table that renders it.
      api_access_structures: {
        count: GLANCE_COST_ITEMS.length,
        note:
          "From the site's cost model (src/data/costModel.ts), whose every field quotes a sentence on `source_page`. No dollar amounts by design. A null field means the site has not recorded one, not that none exists.",
        items: GLANCE_COST_ITEMS.map((c) => ({
          id: `${absoluteUrl("/pricing")}#cost-${c.id}`,
          product: c.label,
          category: CATEGORY_LABELS[c.category],
          developer_billing: DEV_COST_LABELS[c.devCost],
          developer_billing_meaning: DEV_COST_MEANING[c.devCost],
          end_user_needs: c.userSideCost,
          approval_gate: c.approvalGate,
          source_page: absoluteUrl(c.sourceHref),
          directory_page: absoluteUrl(`/apis/${c.id}`),
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
