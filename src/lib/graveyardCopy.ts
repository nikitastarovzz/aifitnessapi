import { absoluteUrl } from "@/lib/site";
import {
  endOfPeriod,
  fmtGraveDate,
  GRAVEYARD_EMBED_PATH,
  GRAVEYARD_JSON_PATH,
  graveyardCheckedOn,
  graveyardSorted,
  type GraveEntry,
} from "@/data/graveyard";

/**
 * The words /graveyard says about itself — answer capsule and FAQs — computed
 * from src/data/graveyard.ts so the page, llms-full.txt and anything else that
 * quotes the page say the same thing. Kept out of the data module so the
 * client grid does not ship it.
 */
export type GraveyardCopy = {
  total: number;
  dead: number;
  dying: number;
  deprecated: number;
  checkedOn: string;
  next: GraveEntry | undefined;
  capsule: string;
  faqs: { q: string; a: string }[];
};

export function graveyardCopy(): GraveyardCopy {
  const entries = graveyardSorted();
  const checkedOn = graveyardCheckedOn();
  const n = (s: string) => entries.filter((e) => e.status === s).length;
  const dead = n("dead");
  const dying = n("dying");
  const deprecated = n("deprecated");
  // "Next to go" is stated as of the day the sources were read, so the
  // sentence is true on that date whatever day the page is built.
  const next = entries
    .filter((e) => e.status === "dying" && e.end && endOfPeriod(e.end) >= checkedOn)
    .sort((a, b) => (endOfPeriod(a.end!) < endOfPeriod(b.end!) ? -1 : 1))[0];
  const noReplacement = entries.filter((e) => e.replacedBy.length === 0);
  const undated = entries.filter((e) => !e.end).length;

  const capsule =
    `The Fitness API Graveyard records ${entries.length} fitness and health developer APIs, SDKs and endpoints ` +
    `that their vendors have shut down, scheduled to shut down or deprecated: ${dead} dead, ${dying} dying with a ` +
    `published end date and ${deprecated} deprecated. Each entry quotes the vendor’s own notice, with its end date ` +
    `at the precision the vendor gave and the replacement the vendor names.` +
    (next && next.end
      ? ` As of ${fmtGraveDate(checkedOn)}, the next to go is the ${next.name}: ${next.source.publisher} gives ${fmtGraveDate(next.end)} (${next.endLabel.toLowerCase()}).`
      : "");

  const faqs = [
    {
      q: "What do dead, dying and deprecated mean in the Fitness API Graveyard?",
      a: `Each entry takes the state its vendor's own notice states. Dead: the vendor says it was removed, turned off or can no longer be used (${dead} entries). Dying: the vendor names a future end date, and the entry shows a countdown to it (${dying}). Deprecated: the vendor says it is deprecated or unsupported but names no end, or it keeps running as-is (${deprecated}). A dying entry whose date has passed fails this site's build until someone re-reads the source and moves it.`,
    },
    {
      q: "Which fitness and health APIs are ending without a replacement?",
      a: `In the graveyard as of ${fmtGraveDate(checkedOn)}, the vendor names no replacement for ${noReplacement.length}: ${noReplacement
        .map((e) => e.name)
        .join("; ")}. For Google Fit's Goals API, Google's migration guide says to manage goal tracking within your own application logic.`,
    },
    {
      q: "Where do the Fitness API Graveyard's dates come from?",
      a: `From the vendor's own page, quoted on each entry: documentation, changelogs, specifications and blog posts, or an Internet Archive capture of that page when the vendor has taken it down. Every entry records the day the source was read. Dates keep the source's precision, so an end the vendor gives only as a year stays a year, and ${undated} entries say no date was given. Events we could not read on a vendor page are left out rather than taken from press coverage.`,
    },
    {
      q: "Can I embed the Fitness API Graveyard or download its data?",
      a: `Yes. ${absoluteUrl(GRAVEYARD_EMBED_PATH)} is a compact widget for an iframe, with a link back to the page, and ${absoluteUrl(
        GRAVEYARD_JSON_PATH,
      )} has every entry as JSON with its source URL, check date and quote, regenerated at each build. Each entry also has a share button that copies a text summary or draws a PNG card in your browser.`,
    },
  ];

  return { total: entries.length, dead, dying, deprecated, checkedOn, next, capsule, faqs };
}
