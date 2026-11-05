import { shortDate } from "@/lib/ecosystemDerive";
import { formatDate } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { YEAR, YEAR_PATH, buildDate, changeMonths, freshness, isSoFar, releaseMonths, slides, storyTitle, yearDataDate, type Slide } from "@/lib/year2026";
import { YEAR_FAQS, yearCapsule } from "@/lib/year2026Copy";
import { faqSection, link, table, type MirrorDoc } from "./core";

/** /2026.md — mirrors src/app/2026/page.tsx: every slide, its rows and its
 *  source, computed by the same module on the same build date. */
export function year2026Mirror(): MirrorDoc {
  const asOf = buildDate();
  const all = slides(asOf);
  const title = storyTitle();
  const soFar = isSoFar();

  const chart = (s: Slide): string[] => {
    if (s.chart === "changes-months") {
      const { months, yearOnly } = changeMonths();
      const entries = [...months.flatMap((m) => m.entries), ...yearOnly];
      return ["#### Every entry, by month", "", ...entries.map((e) => `- ${shortDate(e.date)} · ${e.status} · ${link(e.title, e.page.href)}`), ""];
    }
    if (s.chart === "release-months") {
      const events = releaseMonths(asOf).flatMap((m) => m.events);
      return [
        "#### Every release counted",
        "",
        ...events.map((e) => `- ${shortDate(e.date)} · ${e.href ? link(e.pkg, e.href) : e.pkg} \`${e.version}\` · ${e.source}`),
        "",
      ];
    }
    if (s.chart === "freshness") {
      const f = freshness(asOf);
      return [
        ...table(["Age band", "Pages"], f.bands.map((b) => [b.label, b.count])),
        "Days since each page’s sources were last re-checked, on the build date. Amber bands are 90 days or older, the age at which every page here flags itself.",
        "",
      ];
    }
    return [];
  };

  const slideBlocks = all.flatMap((s, i) => [
    `**${String(i + 1).padStart(2, "0")} ${s.kicker}**`,
    "",
    `## ${s.value} ${s.label}`,
    "",
    s.detail,
    "",
    ...(s.items ?? []).map((it) => `- ${link(it.text, it.href)} (${it.note})`),
    ...(s.items?.length ? [""] : []),
    ...(s.caveat ? [`Note: ${s.caveat}.`, ""] : []),
    ...chart(s),
    `Source: \`${s.source.file}\`, ${s.source.dateLabel}${s.source.url ? ` · ${link("original", s.source.url)}` : ""} · ${link(s.link.label, s.link.href)}`,
    "",
  ]);

  return {
    path: YEAR_PATH,
    title,
    description: `Fitness and health APIs in ${YEAR} as shareable numbers: changes, launches, shutdowns and releases, computed at each build from this site's own data.`,
    updated: yearDataDate(),
    type: "record",
    capsule: yearCapsule(asOf, all),
    body: [
      `${all.length} numbers about the fitness and health API ecosystem, one per slide, each computed from this site's own data files at the build of ${formatDate(asOf)}${soFar ? `. It becomes the full-year recap on the first build of ${Number(YEAR) + 1}.` : "."}`,
      "",
      `**What this page is, and is not.** It counts the year; it does not re-tell it. Each change, with the vendor's words and its grade, lives on the ${link("changes tracker", "/changes")}, and how access to 25 APIs is structured (free, gated, contact-sales) is the ${link(`State of Fitness APIs ${YEAR}`, "/state-of-fitness-apis-2026")} report. Every slide below links to the page that owns its detail.`,
      "",
      ...slideBlocks,
      "## How the story is computed",
      "",
      `Every slide is produced by src/lib/year2026.ts from modules the repository already holds, at build time, with no generator of its own. A change counts in ${YEAR} when its tracker date, at the precision its source states, falls in ${YEAR}; undated watch items are excluded. A release counts once per package and version, whichever file holds it. A slide whose number would rest on one item is dropped instead of shown.`,
      "",
      `Two limits are stated on the slides they affect. sdkReleases.ts keeps each repository's five newest GitHub releases, so a count that fills all five is a floor. libraries.ts keeps only each package's latest registry publish, so it says whether a package released in ${YEAR}, never how often. The freshness slide reads the updated stamp of every cluster page, with ages counted in whole days between UTC midnights, the same arithmetic as the site's own staleness flags.`,
      "",
      ...faqSection(YEAR_PATH, YEAR_FAQS),
      "## Keep reading",
      "",
      `- ${link("Changes & deadlines tracker", "/changes")}`,
      `- ${link(`The State of Fitness APIs ${YEAR}`, "/state-of-fitness-apis-2026")}`,
      `- ${link("Monthly digest archive", "/digest")}`,
      `- ${link("The fitness API index", "/fitness-api-index")}`,
      "",
      `By ${site.name}. Cite as: ${site.name}, "${title}," ${absoluteUrl(YEAR_PATH)}, as of ${formatDate(asOf)}. Product and company names are trademarks of their respective owners.`,
    ],
  };
}
