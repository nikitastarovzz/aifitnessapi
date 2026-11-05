import { changesSorted, WATCH_ITEMS } from "@/data/changes";
import { site } from "@/lib/site";
import { vendorChangesPath, vendorFeedPath, vendorTimelines } from "@/lib/vendorChanges";
import { link, type MirrorDoc } from "./core";

const PATH = "/changes";
const UPDATED = "2026-08-12";

/** The page's own date format (src/app/changes/page.tsx). */
function fmtDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const mn = months[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

/** /changes.md — mirrors src/app/changes/page.tsx: every dated entry and every
 *  watch item from src/data/changes.ts, graded as on the page. */
export function changesMirror(): MirrorDoc {
  const timelines = vendorTimelines();
  const perVendor = timelines.length
    ? [
        "## One vendor at a time",
        "",
        "Each vendor named by two or more entries below has its own timeline and RSS feed.",
        "",
        ...timelines.map((t) => `- ${link(`${t.api.short} (${t.events.length})`, vendorChangesPath(t.api.id))} · ${link("RSS", vendorFeedPath(t.api.id))}`),
        "",
      ]
    : [];
  const events = changesSorted().flatMap((e) => [
    `## ${e.title}`,
    "",
    `**${fmtDate(e.date)}** · ${e.status}`,
    "",
    e.summary,
    "",
    `${link(e.page.label, e.page.href)} · checked ${fmtDate(e.verifiedOn)}`,
    "",
  ]);
  return {
    path: PATH,
    title: "Fitness API Changes & Deadlines",
    description:
      "The dated record of fitness-API ecosystem changes: deprecations, term changes, deadlines — graded confirmed vs reported, each linked to its source.",
    updated: UPDATED,
    type: "record",
    capsule:
      "This is the dated record of what is changing in the fitness-API ecosystem: deprecations, deadlines, pricing-model shifts, and model freezes. Every entry is graded — confirmed means a vendor’s own words are quoted on the linked page; reported means the claim comes from vendor or community notices we could not confirm on an official page. Each entry links the page on this site that carries the sourced detail, and every date keeps the precision of its evidence rather than being sharpened for effect.",
    body: [
      `Updated ${fmtDate(UPDATED)}`,
      "",
      "- confirmed — vendor’s own words, quoted and dated",
      "- reported — consistent notices, no official page verified",
      "",
      "## Get the deadlines in your calendar",
      "",
      "Subscribe once and every deadline we verify afterwards shows up where you already look. Events with no confirmed day are titled [reported month] and placed on a nominal date for planning only — the calendar carries the same grading this page does.",
      "",
      `${link("Subscribe (.ics)", "/changes/calendar.ics")} · ${link("RSS feed", "/changes.xml")} · ${link("By email", "/newsletter")}`,
      "",
      ...perVendor,
      `This year's entries, counted by month, with releases and our own verification age: ${link("Fitness APIs in 2026, in numbers", "/2026")}`,
      "",
      `Looking only for the endings? ${link("The Fitness API Graveyard", "/graveyard")} collects every shut-down, dying and deprecated fitness and health API we could source, with the vendor’s own words, filters, an embed and a JSON download.`,
      "",
      `Play the record: ${link("Ship It", "/play/ship-it")} is a short game that puts your app’s stack through the dated events below, each card quoting its source page.`,
      "",
      ...events,
      "## How to read the grades",
      "",
      "The label records provenance, not plausibility: a reported item can be very likely true and still be reported. When we graded the entries on September 1, 2026, the confirmed ones were mostly past or documented, something a vendor had already done or committed to in writing, while the reported ones were mostly still ahead and commercial: turndowns, pricing changes, membership requirements. Vendors document what they have done far more reliably than what they are about to do to your costs.",
      "",
      "Reported does not mean ignorable. Act on the direction, verify the specific date or number yourself before anything depends on it, and write down which of your assumptions is unsourced. A precise date you cannot trace back to the vendor is weaker evidence than an imprecise one you can, because the precision is presentation rather than sourcing.",
      "",
      "The same grading works on your own dependency list. Give each dependency a row with the date or term you are assuming, where it came from and when you last checked it. Vendor documentation, a vendor changelog or a vendor email addressed to you counts as confirmed; a community thread, an aggregator blog, a conference talk or a colleague’s memory counts as reported. Re-check the oldest rows first, and re-plan when an item moves from reported to confirmed, which usually means the vendor finally published.",
      "",
      "## On watch — undated, not predictions",
      "",
      ...WATCH_ITEMS.flatMap((w) => [`### ${w.title}`, "", w.summary, "", link(w.page.label, w.page.href), ""]),
      `Maintained by ${site.name}. Grading rules live in the repo alongside the data — an entry never states more than the page it links.`,
    ],
  };
}
