import {
  fmtGraveDate,
  GRAVEYARD_EMBED_PATH,
  GRAVEYARD_JSON_PATH,
  GRAVEYARD_PATH,
  graveyardSorted,
  graveyardVendors,
  STATUS_LABEL,
} from "@/data/graveyard";
import { PAGE_H1 } from "@/data/pageTitles";
import { graveyardCopy } from "@/lib/graveyardCopy";
import { site } from "@/lib/site";
import { faqSection, interactiveNote, link, table, type MirrorDoc } from "./core";

/** /graveyard.md — mirrors src/app/graveyard/page.tsx, every stone included,
 *  from the same data module and copy the page renders. */
export function graveyardMirror(): MirrorDoc {
  const entries = graveyardSorted();
  const vendors = graveyardVendors();
  const { checkedOn, capsule, faqs } = graveyardCopy();
  const stones = entries.flatMap((e) => [
    `### ${e.name}`,
    "",
    ...table(
      ["Status", "Kind", "Vendor", e.endLabel, "Replaced by", "Checked"],
      [
        [
          STATUS_LABEL[e.status],
          e.kind,
          e.vendor,
          fmtGraveDate(e.end),
          e.replacedBy.length === 0 ? "no replacement named by the vendor" : e.replacedBy.map((r) => (r.href ? link(r.label, r.href) : r.label)).join("; "),
          fmtGraveDate(e.source.checkedOn),
        ],
      ],
    ),
    `> “${e.source.quote}”`,
    "",
    `— ${link(e.source.publisher, e.source.url)}${e.source.capturedOn ? `, captured ${fmtGraveDate(e.source.capturedOn)}` : ""}`,
    "",
    e.summary,
    "",
    ...(e.milestones ?? []).map((m) => `- ${fmtGraveDate(m.date)} · ${m.label}: ${link(`“${m.quote}”`, m.url)}`),
    ...(e.milestones?.length ? [""] : []),
    ...(e.launched ? [`Launch: ${fmtGraveDate(e.launched.date)}, ${link(e.launched.label, e.launched.url)}`, ""] : []),
    ...(e.page ? [link(e.page.label, e.page.href), ""] : []),
  ]);

  return {
    path: GRAVEYARD_PATH,
    title: PAGE_H1[GRAVEYARD_PATH],
    description:
      "Shut-down, dying and deprecated fitness and health APIs, from Fitbit and Google Fit to Oura and Strava: end dates, replacements, each vendor's own words.",
    updated: checkedOn,
    type: "record",
    capsule,
    body: [
      `${entries.length} APIs, SDKs and endpoints from ${vendors.length} vendors · sources read ${fmtGraveDate(checkedOn)}`,
      "",
      interactiveNote(GRAVEYARD_PATH, "the filters, countdowns and share cards"),
      "",
      "## The graveyard",
      "",
      ...stones,
      "## How an API gets a stone",
      "",
      "**The vendor’s words or nothing.** Every entry quotes a passage from the vendor’s own documentation, changelog, specification or blog, read on the date the stone shows. Where the vendor has taken its notice down, the source is an Internet Archive capture of the vendor’s page, with the capture date. Shutdowns we know of but could not read on a vendor page this way are not here yet; press coverage is not a source.",
      "",
      "**Dates are never sharpened.** “Until the end of 2026” is recorded as 2026, and its countdown says it counts to the end of the year. Launch dates appear only where a primary record dates them, such as a package’s first publication on npm; otherwise the stone shows a question mark.",
      "",
      "**Endpoints count.** A removed endpoint breaks an integration as surely as a removed API, so Strava’s retired endpoints sit beside whole platforms. Symbol-level deprecations inside a live SDK, such as renamed HealthKit identifiers, are left to the reference pages.",
      "",
      `Dated changes that are not endings, such as pricing and terms changes, are on the ${link("changes and deadlines tracker", "/changes")}. The two deadlines most readers arrive for have their own pages: ${link("the Fitbit Web API turn-off", "/fitbit-api-shutdown")} and ${link("the Google Fit end of support", "/google-fit-shutdown")}.`,
      "",
      "## Download the data",
      "",
      `Every entry, with its status, dates, replacement, source URL, check date and quote, as one JSON file written at each build: ${link("graveyard/data.json", GRAVEYARD_JSON_PATH)}. Our fields are free to reuse with a link to this page; the quoted passages belong to their publishers.`,
      "",
      "## Embed the graveyard",
      "",
      `A compact list for your own article or docs, without the site chrome, with each entry’s status, end date and replacement and a link back here. It shows the graveyard as it stands when your reader opens it. ${link("Preview the widget", GRAVEYARD_EMBED_PATH)}. Other widgets: ${link("embeds & badges", "/badges")}.`,
      "",
      ...faqSection(GRAVEYARD_PATH, faqs),
      "## Related",
      "",
      `- ${link("Fitness API changes & deadlines tracker", "/changes")}`,
      `- ${link("Fitbit API shutdown: what's confirmed", "/fitbit-api-shutdown")}`,
      `- ${link("Google Fit shutdown: timeline and paths", "/google-fit-shutdown")}`,
      `- ${link("Migrate off a deprecated fitness API", "/migrate/migrate-off-a-deprecated-fitness-api")}`,
      "",
      `By ${site.name}. Product and company names are trademarks of their respective owners; quoted passages are the publishers’ own words, reproduced to attribute each date. Vendors change their notices: check the linked source before you plan around a date.`,
    ],
  };
}
