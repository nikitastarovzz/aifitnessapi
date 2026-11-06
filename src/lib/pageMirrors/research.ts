import { absoluteUrl } from "@/lib/site";
import { faqSection, link, table, type MirrorDoc } from "./core";
import { DRIFT_GROUPS, NOTICE_ROWS, PRICING_ROWS } from "@/data/researchStudies";
import { PRICING_CLASS_ORDER } from "@/lib/researchStats.mjs";
import {
  HUB,
  HUB_FAQS,
  HUB_OTHER,
  PRICING_CLASS_LABEL,
  PRICING_DISCLOSURE,
  RESEARCH_PATH,
  datasetUrl,
  driftFindings,
  driftStudy,
  hubCapsule,
  hubDataDate,
  noticeFindings,
  noticeStudy,
  pricingFindings,
  pricingStudy,
  studies,
  studyCitation,
  type Study,
} from "@/lib/researchPages";

/**
 * Mirrors of /research and its three studies, from the same words and rows
 * the pages render (src/lib/researchPages.ts). Charts are not reproduced;
 * the tables under them carry the same figures.
 */

function studyDoc(s: Study, rows: number, findings: string[], extraTop: string[] = []): MirrorDoc {
  const cite = studyCitation(s);
  const url = absoluteUrl(s.path);
  return {
    path: s.path,
    title: s.h1,
    description: s.description,
    updated: s.dataDate,
    type: "research",
    capsule: s.capsule,
    body: [
      `${s.dataDateLabel} · ${rows.toLocaleString("en-US")} rows in the dataset · every figure recomputed from it at each build`,
      "",
      ...s.headlines.map((h) => `- **${h.value}** ${h.label}`),
      "",
      ...extraTop,
      "## Method",
      "",
      ...s.method.flatMap((p) => [p, ""]),
      ...findings,
      "## What this method cannot see",
      "",
      ...s.limits.map((p) => `- ${p}`),
      "",
      "## Download the data",
      "",
      `The rows behind every figure on this page, CC BY 4.0: ${link(`${s.dataset}.json`, datasetUrl(s.dataset, "json"))}, ${link(`${s.dataset}.csv`, datasetUrl(s.dataset, "csv"))} and the ${link("dataset card", datasetUrl(s.dataset, "md"))} that describes every column. All of this site’s datasets are on ${link("the open datasets page", "/datasets")}.`,
      "",
      "## How to cite",
      "",
      `Quote a figure with the date its data was read and link this page; each headline figure has its own anchor, such as ${url}#${s.headlines[0].id}.`,
      "",
      "```",
      cite.plain,
      "```",
      "",
      "```bibtex",
      cite.bibtex,
      "```",
      "",
      `More citable counts about this site and the ecosystem it tracks are on ${link("the press page", "/press")}.`,
      "",
      ...faqSection(s.path, s.faqs),
      "## Related",
      "",
      ...s.related.map((r) => `- ${link(r.label, r.href)}`),
      "",
    ],
  };
}

export function driftMirror(): MirrorDoc {
  const f = driftFindings();
  return studyDoc(driftStudy(), DRIFT_GROUPS.length, [
    "## Source changes by commit",
    "",
    f.endedText,
    "",
    f.byDateIntro,
    "",
    ...table(["Date", "Commit", "Hosts", "Rows replaced"], f.byDate.map((d) => [d.date, d.commit, d.hosts, d.rows])),
    "## Hosts whose sources changed",
    "",
    f.hostsIntro,
    "",
    ...table(["Host", "Source changes", "Rows replaced", "Rows written"], f.bySource.map((s) => [s.source, s.driftEvents, s.driftRows, s.rows])),
    "## Fact or wording",
    "",
    f.kindsText,
    "",
    ...table(["Date", "Commit", "Host", "Kind", "Rows"], f.events.map((e) => [e.dateLabel, e.commit, e.source, e.kindLabel, e.rows])),
  ]);
}

export function noticeMirror(): MirrorDoc {
  const f = noticeFindings();
  return studyDoc(noticeStudy(), NOTICE_ROWS.length, [
    "## Notice measured",
    "",
    f.measuredIntro,
    "",
    ...table(
      ["Entry", "Vendor", "Announced", "End", "Notice", "How the announcement is dated"],
      f.measured.map((r) => [link(r.name, r.page), r.vendor, r.announcedLabel, r.endDateLabel, `${r.noticeDays} days`, r.announcementUrl ? link(r.how ?? "", r.announcementUrl) : r.how]),
    ),
    "## Entries left out",
    "",
    f.excludedIntro,
    "",
    ...table(
      ["Entry", "Vendor", "End", "Reason", "What the pages say"],
      f.excluded.map((r) => [link(r.name, r.page), r.vendor, r.endDateLabel, r.exclusion, r.note]),
    ),
  ]);
}

export function pricingMirror(): MirrorDoc {
  const f = pricingFindings();
  const legend = PRICING_CLASS_ORDER.map((c) => PRICING_CLASS_LABEL[c]);
  return studyDoc(
    pricingStudy(),
    PRICING_ROWS.length,
    [
      "## By category",
      "",
      f.categoryIntro,
      "",
      ...table(["Category", ...legend, "Counted"], f.byCategory.map((c) => [c.label, ...PRICING_CLASS_ORDER.map((k) => c[k]), c.total])),
      "## Every vendor, with its line",
      "",
      f.vendorsIntro,
      "",
      ...table(
        ["Vendor", "Category", "Class", "The vendor's line", "Free plan or trial", "Tier with no price"],
        f.vendors.map((r) => [
          link(r.vendor, r.pricingPage),
          r.categoryLabel,
          r.classLabel,
          link(`“${r.line}”`, r.url as string),
          r.freeEntry ? `“${r.freeEntry}”` : "",
          r.unpricedTier ? `“${r.unpricedTier}”` : "",
        ]),
      ),
      "## Not counted",
      "",
      f.excludedIntro,
      "",
      ...table(["Vendor", "Category", "Reason"], f.excluded.map((r) => [link(r.vendor, r.pricingPage), r.categoryLabel, r.excluded])),
    ],
    [`**${PRICING_DISCLOSURE.title}**`, "", `${PRICING_DISCLOSURE.text} ${link("How we stay independent →", "/about#funding")}`, ""],
  );
}

export function researchHubMirror(): MirrorDoc {
  const all = studies();
  return {
    path: RESEARCH_PATH,
    title: HUB.h1,
    description: HUB.description,
    updated: hubDataDate(),
    type: "research",
    capsule: hubCapsule(),
    body: [
      "## The studies",
      "",
      ...all.flatMap((s) => [
        `### ${link(s.h1, s.path)}`,
        "",
        s.description,
        "",
        ...s.headlines.slice(0, 2).map((h) => `- **${h.value}** ${h.label}`),
        "",
        s.dataDateLabel,
        "",
      ]),
      "## How these are made",
      "",
      ...HUB_OTHER.how.flatMap((p) => [p, ""]),
      "## Other numbers on this site",
      "",
      ...HUB_OTHER.links.map((l) => `- ${link(l.label, l.href)}: ${l.text}`),
      "",
      ...faqSection(RESEARCH_PATH, HUB_FAQS),
    ],
  };
}
