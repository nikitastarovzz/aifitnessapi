import { EVENTS, RUNWAY_WEEKS, STACKS, START_USERS, type EventKind } from "@/lib/shipIt";

/** The /play/ship-it page's labels, date format, event order and FAQs, shared
 *  by src/app/play/ship-it/page.tsx and its markdown mirror. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function human(d: string): string {
  const [y, m, day] = d.split("-");
  if (!m) return y;
  return day ? `${MONTHS[Number(m) - 1]} ${Number(day)}, ${y}` : `${MONTHS[Number(m) - 1]} ${y}`;
}

export const stackName = (id: string) => STACKS.find((s) => s.id === id)?.name ?? id;
export const sorted = [...EVENTS].sort((a, b) => (a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0));
export const KIND_LABEL: Record<EventKind, string> = {
  "turn-off": "Turn-off",
  "end-of-support": "End of support",
  deprecation: "Deprecation",
  gate: "Approval or review gate",
  policy: "Policy rule",
  limit: "Documented limit",
};
export const pct = (n: number) => `${Math.round(n * 100)}%`;

export const SHIP_IT_FAQS = [
  {
    q: "Are the events in the Ship It game real?",
    a: `Yes. Each of the ${EVENTS.length} events is a dated change or a documented rule that this site has already sourced, on its changes tracker or on a guide, and the card quotes the words the source page carries, with a link to that page. Where the quote is this site's summary rather than the vendor's own sentence, the card says so. A build check fails if a quote or a date stops appearing on its source page, so an event cannot outlive its evidence.`,
  },
  {
    q: "Are the weeks and user numbers in Ship It estimates?",
    a: `No. They are game rules: ${START_USERS.toLocaleString("en-US")} starting users, a ${RUNWAY_WEEKS}-week runway and a fixed cost for each kind of choice, all invented to make the trade-offs playable. They do not estimate how long a real migration takes or how many users a real app loses, and the scoring table on the page prints them as rules.`,
  },
  {
    q: "Why does acting at the Fitbit end of support make the turn-off free in the game?",
    a: "Because Google gave two dates. Support for the Fitbit Web API ended on September 30, 2026, while the API kept operating, and the turn-off, after which requests fail with HTTP 410 Gone, follows on November 2, 2026. A team that started its Google Health API migration at the first date has nothing left to do at the second, so the game marks the turn-off as already handled.",
  },
  {
    q: "Why is Google Fit marked as existing projects only in Ship It?",
    a: "Google closed Google Fit API sign-ups for new developers on May 1, 2024, before the game's kickoff, so a team in the game can only be on Google Fit if it already had a project. Google's Fit migration guide says the Google Fit APIs will be supported until the end of 2026 and publishes no switch-off date, which is why ignoring that event costs fewer users than ignoring a turn-off.",
  },
  {
    q: "Does Ship It send my choices or results anywhere?",
    a: "No. The game runs in your browser from data shipped with the page. The share card is drawn on a canvas in the tab and the share text is copied to your clipboard only when you press the button; nothing is uploaded or stored, and the page has no server code behind it.",
  },
];

