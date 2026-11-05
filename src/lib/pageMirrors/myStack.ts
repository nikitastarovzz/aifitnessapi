import { stackData } from "@/lib/myStack";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/my-stack";
const UPDATED = "2026-11-05";

/** /my-stack.md — mirrors src/app/my-stack/page.tsx. */
export function myStackMirror(): MirrorDoc {
  const data = stackData();
  const n = data.vendors.length;
  const withDates = data.vendors.filter((v) => v.deadlines.length).length;
  return {
    path: PATH,
    title: "My stack",
    description:
      "Pick the fitness and health APIs you use: their tracked changes, deadlines and pages here, plus a calendar and feed list to save. Stays in your browser.",
    updated: UPDATED,
    type: "tool",
    capsule: `Pick the fitness and health APIs your product depends on, from the ${n} products in this site’s directory, and this page gathers what the site tracks about them: every dated change and deadline, graded confirmed or reported; any of their APIs in the Fitness API Graveyard; every page here about each one with the date that page declares; and a calendar, a feed list and a share link for the stack. The choice is kept in your browser and in the page address, and nothing is sent anywhere.`,
    body: [
      interactiveNote(PATH, "the product picker, the per-product changes, deadlines and pages, and the calendar, OPML and RSS downloads"),
      "",
      "## Where the dashboard’s data comes from",
      "",
      `- Changes and deadlines are the entries of ${link("the changes tracker", "/changes")} whose title or summary names the product as a whole word, the rule its ${link("directory entry", "/apis")} uses. Each keeps the date at the precision its source gives and the day it was last checked.`,
      `- Stones come from ${link("the Fitness API Graveyard", "/graveyard")}, matched by the same rule over each stone’s name, vendor and summary, each with the vendor’s own sentence on its page. Where a stone and a tracker entry are the same event on the same date, the tracker entry is shown.`,
      "- Pages are the product’s menu on this site where it has one, otherwise the pages that cover it most. The date beside each is the one the page declares as its last review, and a page past 90 days is flagged: the age of a check is the number to watch on a site that tracks a moving ecosystem.",
      `- ${withDates} of the ${n} products have at least one dated item, and each of those has an embeddable countdown to its next one (${link("every countdown widget", "/badges#countdowns")}).`,
      "",
      "## What stays in your browser",
      "",
      `Your stack is saved in this browser’s local storage under one key and nowhere else. A share link carries it in the address, as ?v= and the product ids, so whoever opens it sees the same products without anything being stored on a server. The calendar (.ics), the OPML feed list and the RSS snapshot are built in the tab from data already in the page. The calendar and the snapshot are copies and do not update; the OPML file subscribes a feed reader to each product’s live feed, and ${link("the full deadline calendar", "/changes/calendar.ics")} can be subscribed to directly. For email, use ${link("change alerts", "/alerts")}.`,
      "",
      "KinesteX, which funds this site, is in the list because it is in the directory, on the same terms as every other product.",
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
