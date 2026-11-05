import { PAGE_H1 } from "@/data/pageTitles";
import { EVENTS, KICKOFF, MAX_STACKS, PATH, PLANNED_LAUNCH, RULES, RULE_NOTES, RUNWAY_WEEKS, START_USERS, SURVIVE_SHARE, type EventKind } from "@/lib/shipIt";
import { SHIP_IT_FAQS, KIND_LABEL, human, pct, sorted, stackName } from "@/lib/shipItPage";
import { site } from "@/lib/site";
import { faqSection, interactiveNote, link, table, type MirrorDoc } from "./core";

const UPDATED = "2026-10-31";

/** /play/ship-it.md — mirrors src/app/play/ship-it/page.tsx: every event card,
 *  the scoring rules and the FAQs, from the game's own data. */
export function shipItMirror(): MirrorDoc {
  const events = sorted.flatMap((e) => [
    `### ${e.title}`,
    "",
    `${human(e.date)} · ${KIND_LABEL[e.kind]} · ${e.stacks.map(stackName).join(", ")}${e.products ? ` · ${e.products.length === 1 ? "one product" : "some products"}` : ""}`,
    "",
    `> “${e.quote}”`,
    "",
    `${e.quoteBy === "vendor" ? e.speaker : `${e.speaker} (not the vendor's words)`}, via ${link(e.source.label, e.source.href)}`,
    "",
  ]);
  const kinds = Object.keys(RULES) as EventKind[];
  return {
    path: PATH,
    title: PAGE_H1[PATH],
    description:
      "Pick a fitness app and its data stack, then survive the real, dated API changes of 2025–26, from Oura's token deprecation to the Fitbit Web API turn-off.",
    updated: UPDATED,
    type: "game",
    capsule: `Ship It is a three-to-five-minute browser game about getting a fitness app to launch through the API changes of late 2025 and 2026. You pick a product and up to ${MAX_STACKS} data stacks, then every real, dated event that hit those stacks plays out, from Oura deprecating personal access tokens in December 2025 to the Fitbit Web API turn-off on November 2, 2026 and Google Fit’s end of support at the end of 2026. Each card quotes the page on this site that sources it. The weeks and users you spend are game rules, not estimates.`,
    body: [
      interactiveNote(PATH, "the game"),
      "",
      "## Every event in the game",
      "",
      `${EVENTS.length} events, in date order. A run only meets the ones that hit the stacks it picked, and a few apply to one product only. The date is the vendor’s where it gives one; for a standing rule it is the day the rule’s page was last updated or read, and the card says which. The full record, graded confirmed or reported, is the ${link("changes and deadlines tracker", "/changes")}.`,
      "",
      ...events,
      "## How the game is scored (game rules)",
      "",
      `These numbers are invented to make the choices trade off against each other. They are not estimates of real engineering time or user churn. The game starts on ${human(KICKOFF)} with ${START_USERS.toLocaleString("en-US")} connected users split evenly across your stacks, and a launch planned for ${human(PLANNED_LAUNCH)}. Every week of slip moves the launch a week. More than ${RUNWAY_WEEKS} weeks and the money runs out; lose every user and there is nothing to launch; keep ${pct(SURVIVE_SHARE)} or more and you survived.`,
      "",
      ...table(
        ["Kind of event", "Act now", "Hedge", "Ignore"],
        kinds.map((k) => [
          `${KIND_LABEL[k]}: ${RULE_NOTES[k]}`,
          ...(["act", "hedge", "ignore"] as const).map((c) => `${RULES[k][c].weeks} wk, ${pct(RULES[k][c].lose)} of that stack’s users`),
        ]),
      ),
      "Acting or hedging at the Fitbit end of support counts the later turn-off as already handled, because the migration it starts is the one the turn-off forces. Nothing else carries over between events.",
      "",
      "## After the game",
      "",
      `The real versions of these moves are the ${link("migration guides", "/migrate")}: start with ${link("Fitbit Web API to the Google Health API", "/migrate/fitbit-web-api-to-google-health")} and ${link("Google Fit to Health Connect", "/migrate/google-fit-to-health-connect")}, or the shutdown centers for ${link("Fitbit", "/fitbit-api-shutdown")} and ${link("Google Fit", "/google-fit-shutdown")}. To hear about the next dated change before it reaches your app, use ${link("API change alerts", "/alerts")}.`,
      "",
      ...faqSection(PATH, SHIP_IT_FAQS, "Questions"),
      `A game from ${site.name}, built on the ${link("changes tracker", "/changes")}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
