import { formatDate } from "@/lib/posts";
import { YEAR, type Slide } from "@/lib/year2026";

/** The /2026 page's capsule and FAQs, shared by src/app/2026/page.tsx and its
 *  markdown mirror so the two say the same thing on the same build. */
export const YEAR_FAQS: { q: string; a: string }[] = [
  {
    q: `How is the Fitness APIs in ${YEAR} story different from the changes tracker and the State of Fitness APIs report?`,
    a: `It counts; they explain. The changes tracker is the record of every dated change, each with the vendor's words and a confirmed-or-reported grade, and the State of Fitness APIs ${YEAR} report surveys how access to 25 APIs is structured. This page adds up the year: how many tracked changes, which month was busiest, how many releases are on file, how fresh this site's own checks are. Each number links to the page that owns the detail behind it, and none of the report's findings is repeated here.`,
  },
  {
    q: `Where do the numbers in the ${YEAR} story come from?`,
    a: `Only from data files already in this site's repository, read at build time: src/data/changes.ts for the tracked changes, src/data/googleHealthApi.ts for the Google Health API launch and the Fitbit turn-off date, src/data/hcReleases.ts, sdkReleases.ts and libraries.ts for releases, and the updated stamp on every cluster page for freshness. Every slide names its file and the date that file was last read from its source. Nothing is typed in by hand, and a slide whose number would rest on a single item is left out.`,
  },
  {
    q: `Why does the ${YEAR} story say "so far", and when does it become a full-year recap?`,
    a: `The title is computed from the build date. Every build before January 1, ${Number(YEAR) + 1} calls the page "so far"; the first build after that date titles it as the year in numbers, with the same code and no edit. Release counts also stop at the date each data file was last read, which every slide states.`,
  },
  {
    q: `Why are some ${YEAR} changes in the story not placed in any month?`,
    a: `Because their sources do not give one. The tracker keeps a date at the precision its evidence states, and several ${YEAR} entries are dated only by year. They count toward the year's total and appear in their own column on the month chart, but placing them in a month would sharpen a date beyond what the source says.`,
  },
];


/** The capsule, from the slides computed for `asOf`. */
export function yearCapsule(asOf: string, all: Slide[]): string {
  const by = Object.fromEntries(all.map((s) => [s.id, s]));
  return [
    by.changes && `As of ${formatDate(asOf)}, this site's changes tracker holds ${by.changes.value} ${by.changes.label}${by["busiest-month"] ? `, and ${by["busiest-month"].value} ${by["busiest-month"].label}` : ""}.`,
    by["google-health-api"] && by["fitbit-turn-off"] &&
      `Google's release notes date the Google Health API launch to ${by["google-health-api"].value}, ${YEAR}, and Google gives ${by["fitbit-turn-off"].value}, ${YEAR} for the Fitbit Web API turn-off.`,
    by["health-connect-client"] && by.packages &&
      `Health Connect's connect-client shipped ${by["health-connect-client"].value} releases in ${YEAR}, and ${by.packages.value} ${by.packages.label}.`,
    by.freshness && `The median verification stamp on this site was ${by.freshness.value} old on the build date.`,
  ]
    .filter(Boolean)
    .join(" ");
}
