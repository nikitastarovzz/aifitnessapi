/**
 * "Ship It" (/play/ship-it): a short choose-your-path game built from the
 * site's dated record. The player picks a product and up to three data
 * stacks, then lives through the real events that hit those stacks between
 * the game's kickoff and its planned launch.
 *
 * Two kinds of content live here, and they must never be confused:
 *
 * 1. FACTS. Every event's date, quote and source come from this site's own
 *    sourced pages: `src/data/changes.ts` or a cluster entry in
 *    `src/data/*.entries.ts`. `quote` and `dateEvidence` are copied exactly
 *    from that source's text, and `scripts/ship-it-check.mjs` (run by
 *    `npm run qa` and `npm run test:ship-it`) fails the build if either stops
 *    appearing there, if a vendor quote is not inside quotation marks on the
 *    source, or if a linked change entry's date or page moves. No event here
 *    is invented: if the source page loses the fact, the event goes.
 *
 * 2. GAME RULES. Weeks, users, the runway, the kickoff and launch dates and
 *    every cost in RULES are invented game numbers. They are not estimates of
 *    real migration effort or churn, and the page says so beside them.
 *
 * Self-contained on purpose — no imports — so `node --test` and qa.mjs can
 * load it with Node's type stripping. Keep it to erasable TypeScript: no
 * enums, no namespaces, no parameter properties.
 */

export type StackId =
  | "healthkit"
  | "health-connect"
  | "google-fit"
  | "fitbit"
  | "garmin"
  | "oura"
  | "strava"
  | "terra";

export type ProductId = "running" | "ai-coach" | "sleep" | "wellness" | "camera";

export type ChoiceId = "act" | "hedge" | "ignore";

/** What kind of event it is; picks the row of RULES that prices the choices. */
export type EventKind = "turn-off" | "end-of-support" | "deprecation" | "gate" | "policy" | "limit";

export const PATH = "/play/ship-it";

// ── Game rules. Invented numbers; the page prints them as such. ─────────────

/** The day the game starts. A game rule, not a fact. */
export const KICKOFF = "2025-10-06";
/** The launch the team is aiming for, after the last event in the game. */
export const PLANNED_LAUNCH = "2027-01-11";
/** Weeks of slip the team can absorb; one more and the money runs out. */
export const RUNWAY_WEEKS = 8;
/** Connected users at the start, split evenly across the chosen stacks. */
export const START_USERS = 10000;
/** A run that keeps at least this share of its users counts as survived. */
export const SURVIVE_SHARE = 0.6;
export const MAX_STACKS = 3;

export type Cost = { weeks: number; lose: number };

/**
 * Cost of each choice by event kind. `weeks` adds to the slip; `lose` is the
 * share of the affected stack's users lost (1 = every user on that stack).
 */
export const RULES: Record<EventKind, Record<ChoiceId, Cost>> = {
  "turn-off": { act: { weeks: 3, lose: 0.1 }, hedge: { weeks: 5, lose: 0 }, ignore: { weeks: 0, lose: 1 } },
  "end-of-support": { act: { weeks: 3, lose: 0.1 }, hedge: { weeks: 4, lose: 0 }, ignore: { weeks: 0, lose: 0.1 } },
  deprecation: { act: { weeks: 1, lose: 0.05 }, hedge: { weeks: 2, lose: 0 }, ignore: { weeks: 0, lose: 0.5 } },
  gate: { act: { weeks: 3, lose: 0 }, hedge: { weeks: 1, lose: 0.2 }, ignore: { weeks: 0, lose: 1 } },
  policy: { act: { weeks: 2, lose: 0 }, hedge: { weeks: 0, lose: 0.5 }, ignore: { weeks: 0, lose: 1 } },
  limit: { act: { weeks: 1, lose: 0 }, hedge: { weeks: 0, lose: 0.1 }, ignore: { weeks: 0, lose: 0.25 } },
};

export const RULE_NOTES: Record<EventKind, string> = {
  "turn-off": "The endpoints stop working on a published date. Ignoring it loses every user on that stack; acting costs a re-consent round.",
  "end-of-support": "The API keeps running without fixes or support. Acting early is what makes the later turn-off free.",
  deprecation: "An old path is closing. Cheap to fix, expensive to ignore.",
  gate: "Nothing ships past it without the vendor's yes. The workaround keeps most users; skipping it keeps none.",
  policy: "A rule in the vendor's terms. The game counts shipping in breach as losing the integration.",
  limit: "A documented limit. Ignoring it costs failed syncs, not the whole stack.",
};

// ── The board. ─────────────────────────────────────────────────────────────

export type Stack = { id: StackId; name: string; blurb: string; href: string };

/** `href` is the on-site page about that product; the check script asserts it is built. */
export const STACKS: Stack[] = [
  { id: "healthkit", name: "HealthKit", blurb: "Apple's on-device health store", href: "/apis/healthkit" },
  { id: "health-connect", name: "Health Connect", blurb: "Android's on-device health store", href: "/apis/health-connect" },
  { id: "google-fit", name: "Google Fit", blurb: "Existing project only: closed to new developers since May 1, 2024", href: "/google-fit-shutdown" },
  { id: "fitbit", name: "Fitbit Web API", blurb: "Cloud API for Fitbit users", href: "/apis/fitbit" },
  { id: "garmin", name: "Garmin", blurb: "Garmin Connect Developer Program", href: "/apis/garmin" },
  { id: "oura", name: "Oura", blurb: "Oura API v2", href: "/apis/oura" },
  { id: "strava", name: "Strava", blurb: "Strava API v3", href: "/apis/strava" },
  { id: "terra", name: "Terra", blurb: "A health-data aggregator", href: "/apis/terra" },
];

export type Product = { id: ProductId; name: string; blurb: string; suggested: StackId[] };

export const PRODUCTS: Product[] = [
  { id: "running", name: "Running app", blurb: "Runs, routes and training load", suggested: ["strava", "garmin", "healthkit"] },
  { id: "ai-coach", name: "AI running coach", blurb: "A language model plans your week", suggested: ["strava", "health-connect", "healthkit"] },
  { id: "sleep", name: "Sleep app", blurb: "Nights, readiness and recovery", suggested: ["oura", "fitbit", "healthkit"] },
  { id: "wellness", name: "Employer wellness", blurb: "Team step challenges and rewards", suggested: ["terra", "strava", "healthkit"] },
  { id: "camera", name: "Camera workout app", blurb: "Reps counted on the phone, synced to health stores", suggested: ["healthkit", "health-connect", "google-fit"] },
];

export type ShipEvent = {
  id: string;
  /** Display date, at the precision the source gives. */
  date: string;
  /** Full ISO date used only to order the timeline. */
  sortDate: string;
  /** What the date is: a vendor's deadline, or the day a standing rule was read. */
  dateNote: string;
  kind: EventKind;
  title: string;
  /** Stacks this event hits. Only these can lose users to it. */
  stacks: StackId[];
  /** Products it applies to; absent means every product. */
  products?: ProductId[];
  /** Copied exactly from the source text. */
  quote: string;
  /** "vendor" when the source quotes the vendor's own words; "site" when it is this site's sourced summary. */
  quoteBy: "vendor" | "site";
  /** Who said it, as the card attributes it. */
  speaker: string;
  /** Text in the source that backs `date` (checked like `quote`). */
  dateEvidence: string;
  /** The on-site page carrying the sourced claim. */
  source: { href: string; label: string };
  /** When the event is also a dated entry on /changes, its exact title there. */
  change?: string;
  /** Earlier events whose act or hedge already dealt with this one. */
  resolvedBy?: string[];
  choices: Record<ChoiceId, string>;
};

export const EVENTS: ShipEvent[] = [
  {
    id: "oura-pat",
    date: "2025-12",
    sortDate: "2025-12-15",
    dateNote: "Deprecated in December 2025",
    kind: "deprecation",
    title: "Oura deprecates personal access tokens",
    stacks: ["oura"],
    quote:
      "Oura deprecated personal access tokens in December 2025 — scripts and internal tools built on PATs need the OAuth flow instead.",
    quoteBy: "site",
    speaker: "This site's change log",
    dateEvidence: "December 2025",
    source: { href: "/fix/oura-personal-access-token-deprecated", label: "Oura PAT deprecation fix" },
    change: "Oura personal access tokens deprecated",
    choices: {
      act: "Move every user to OAuth 2.0 now",
      hedge: "Build OAuth beside the tokens you already hold",
      ignore: "Keep shipping on personal tokens",
    },
  },
  {
    id: "hc-declaration",
    date: "2026-03-10",
    sortDate: "2026-03-10",
    dateNote: "Google's publishing guide, last updated March 10, 2026",
    kind: "gate",
    title: "Health Connect apps need a Health apps declaration",
    stacks: ["health-connect"],
    quote:
      "must be completed for all publishing requests, both for a new app that has not been published yet, or when updating an existing, already published app that now uses a different set of data types.",
    quoteBy: "vendor",
    speaker: "Google, on the Health apps declaration",
    dateEvidence: "last updated March 10, 2026",
    source: {
      href: "/compliance/google-play-health-connect-publishing-requirements",
      label: "Google Play publishing requirements for Health Connect apps",
    },
    choices: {
      act: "File it, with a justification for every data type",
      hedge: "Request fewer data types and file a short one",
      ignore: "Submit the release without it",
    },
  },
  {
    id: "strava-ai",
    date: "2026-06-01",
    sortDate: "2026-06-01",
    dateNote: "Strava's new API Agreement and API Policy, June 1, 2026",
    kind: "policy",
    title: "Strava's API Policy bans AI use of its data",
    stacks: ["strava"],
    products: ["ai-coach"],
    quote: "in connection with the development, training, evaluation, or operation of any AI Application",
    quoteBy: "vendor",
    speaker: "Strava's API Policy, on what Strava data may not be used",
    dateEvidence: "New API Agreement and API Policy",
    source: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
    choices: {
      act: "Rebuild so no Strava data reaches the model",
      hedge: "Switch the Strava-powered coaching off for now",
      ignore: "Keep feeding Strava activities to the coach",
    },
  },
  {
    id: "strava-display",
    date: "2026-06-01",
    sortDate: "2026-06-01",
    dateNote: "Strava's new API Agreement and API Policy, June 1, 2026",
    kind: "policy",
    title: "Strava data may be shown only to its athlete",
    stacks: ["strava"],
    products: ["wellness"],
    quote: "Strava Data from a user may be shown only to that user, even data that is public on Strava.",
    quoteBy: "site",
    speaker: "This site's summary of Strava's API Policy",
    dateEvidence: "New API Agreement and API Policy",
    source: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
    choices: {
      act: "Rebuild the team leaderboard without Strava data",
      hedge: "Drop Strava from the challenge, keep it in each profile",
      ignore: "Put everyone's Strava runs on the company board",
    },
  },
  {
    id: "hk-benefit",
    date: "2026-06-08",
    sortDate: "2026-06-08",
    dateNote: "In Apple's App Review Guidelines, last updated June 8, 2026",
    kind: "policy",
    title: "HealthKit data meets the employer reward (guideline 5.1.3)",
    stacks: ["healthkit"],
    products: ["wellness"],
    quote: "provided that the app is submitted by the entity providing the benefit, and the data is not shared with a third party.",
    quoteBy: "vendor",
    speaker: "Apple, App Review Guideline 5.1.3(i)",
    dateEvidence: "last updated June 8, 2026",
    source: {
      href: "/compliance/app-store-guideline-5-1-3-health-research",
      label: "App Store guideline 5.1.3: Health and Health Research",
    },
    choices: {
      act: "Have the employer submit the app; share nothing onward",
      hedge: "Pull the HealthKit-based rewards from the iOS app",
      ignore: "Send HealthKit data on to the rewards vendor",
    },
  },
  {
    id: "hk-icloud",
    date: "2026-06-08",
    sortDate: "2026-06-08",
    dateNote: "In Apple's App Review Guidelines, last updated June 8, 2026",
    kind: "policy",
    title: "HealthKit apps: no personal health information in iCloud",
    stacks: ["healthkit"],
    quote: "may not store personal health information in iCloud.",
    quoteBy: "vendor",
    speaker: "Apple, App Review Guideline 5.1.3(ii)",
    dateEvidence: "last updated June 8, 2026",
    source: {
      href: "/compliance/app-store-guideline-5-1-3-health-research",
      label: "App Store guideline 5.1.3: Health and Health Research",
    },
    choices: {
      act: "Move health-data sync to your own backend",
      hedge: "Turn cross-device sync off for health data",
      ignore: "Sync HealthKit data through iCloud anyway",
    },
  },
  {
    id: "strava-clubs",
    date: "2026-09-01",
    sortDate: "2026-09-01",
    dateNote: "Strava's changelog, September 1, 2026",
    kind: "turn-off",
    title: "Strava removes its club endpoints",
    stacks: ["strava"],
    products: ["wellness"],
    quote: "Club Activities, Club Members and Club Admins endpoints removed",
    quoteBy: "site",
    speaker: "This site's table of Strava's changelog",
    dateEvidence: "September 1, 2026",
    source: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
    choices: {
      act: "Rebuild team challenges on each athlete's own activities",
      hedge: "Build the replacement in parallel before the date",
      ignore: "Keep the challenges on Strava clubs",
    },
  },
  {
    id: "fitbit-eos",
    date: "2026-09-30",
    sortDate: "2026-09-30",
    dateNote: "End of support, September 30, 2026",
    kind: "end-of-support",
    title: "Fitbit Web API support ends",
    stacks: ["fitbit"],
    quote:
      "support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support.",
    quoteBy: "vendor",
    speaker: "Google, on the Google Health API page",
    dateEvidence: "September 30, 2026",
    source: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    change: "Fitbit Web API end of support",
    choices: {
      act: "Start the Google Health API migration now",
      hedge: "Run Fitbit and the Google Health API side by side",
      ignore: "It still works. Leave it",
    },
  },
  {
    id: "hc-rate-limit",
    date: "2026-10-03",
    sortDate: "2026-10-03",
    dateNote: "Google's rate-limiting guide, as this site read it on October 3, 2026",
    kind: "limit",
    title: "Health Connect throttles background reads harder",
    stacks: ["health-connect"],
    quote: "background rate limiting is stricter than foreground rate limiting.",
    quoteBy: "vendor",
    speaker: "Google's Health Connect rate-limiting guide",
    dateEvidence: "October 3, 2026",
    source: { href: "/fix/health-connect-rate-limit", label: "Health Connect rate limit fix" },
    choices: {
      act: "Batch reads and back off on ERROR_RATE_LIMIT_EXCEEDED",
      hedge: "Only sync while the app is open",
      ignore: "Read everything in the background, all the time",
    },
  },
  {
    id: "strava-single-player",
    date: "2026-10-17",
    sortDate: "2026-10-17",
    dateNote: "Strava's getting-started guide, as this site read it on October 17, 2026",
    kind: "gate",
    title: "Strava apps start in single-player mode",
    stacks: ["strava"],
    quote: "All new applications start in single-player mode",
    quoteBy: "vendor",
    speaker: "Strava's getting-started guide",
    dateEvidence: "October 17, 2026",
    source: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
    choices: {
      act: "Submit Strava's review to go past 10 athletes",
      hedge: "Launch with Strava as an optional extra while the review runs",
      ignore: "Launch anyway and hope athletes can connect",
    },
  },
  {
    id: "strava-rate-limit",
    date: "2026-10-17",
    sortDate: "2026-10-17",
    dateNote: "Strava's rate-limit page, as this site read it on October 17, 2026",
    kind: "limit",
    title: "Strava's rate limits meet your sync job",
    stacks: ["strava"],
    quote: "a new app gets an overall limit of 200 requests per 15 minutes and 2,000 per day",
    quoteBy: "site",
    speaker: "This site's reading of Strava's rate-limit page",
    dateEvidence: "October 17, 2026",
    source: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
    choices: {
      act: "Use the webhook and read the rate-limit headers",
      hedge: "Sync each athlete less often",
      ignore: "Poll every athlete every few minutes",
    },
  },
  {
    id: "garmin-gate",
    date: "2026-10",
    sortDate: "2026-10-22",
    dateNote: "Garmin's program pages, reorganised in October 2026",
    kind: "gate",
    title: "Garmin access still starts with an approval",
    stacks: ["garmin"],
    quote:
      "your request has been approved, you will be granted access to the Garmin Developer Portal and can get started on your integration right away",
    quoteBy: "vendor",
    speaker: "Garmin's developer program FAQ",
    dateEvidence: "October 2026",
    source: { href: "/fix/garmin-api-approval", label: "Garmin API approval" },
    choices: {
      act: "Request access and wait for Garmin's yes",
      hedge: "Bridge through an aggregator that holds its own Garmin access",
      ignore: "Launch Garmin sync before access is granted",
    },
  },
  {
    id: "fitbit-turn-off",
    date: "2026-11-02",
    sortDate: "2026-11-02",
    dateNote: "Turn-off, November 2, 2026",
    kind: "turn-off",
    title: "The Fitbit Web API is turned off",
    stacks: ["fitbit"],
    quote:
      "The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users.",
    quoteBy: "vendor",
    speaker: "Google, on the Google Health API page",
    dateEvidence: "November 2, 2026",
    source: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
    change: "Fitbit Web API turn-off moves to November 2, 2026",
    resolvedBy: ["fitbit-eos"],
    choices: {
      act: "Cut over to the Google Health API now",
      hedge: "Ship the Google Health API path beside Fitbit before the date",
      ignore: "Ignore it",
    },
  },
  {
    id: "terra-widget",
    date: "2026-11-03",
    sortDate: "2026-11-03",
    dateNote: "Deprecation planned for November 3, 2026",
    kind: "deprecation",
    title: "Terra's legacy widget endpoint is deprecated",
    stacks: ["terra"],
    quote: "keeps working today, with deprecation planned for 3 November 2026",
    quoteBy: "vendor",
    speaker: "Terra's documentation",
    dateEvidence: "3 November 2026",
    source: { href: "/integrate/terra-api", label: "How to integrate Terra" },
    change: "Terra legacy widget endpoint deprecation",
    choices: {
      act: "Move to the new widget session endpoint",
      hedge: "Call both endpoints behind a flag",
      ignore: "Keep calling generateWidgetSession",
    },
  },
  {
    id: "google-fit-eos",
    date: "2026-12",
    sortDate: "2026-12-31",
    dateNote: "Supported until the end of 2026",
    kind: "end-of-support",
    title: "Google Fit reaches the end of its support",
    stacks: ["google-fit"],
    quote: "The Google Fit APIs will be supported until the end of 2026",
    quoteBy: "vendor",
    speaker: "Google's Fit migration guide",
    dateEvidence: "until the end of 2026",
    source: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
    change: "Google Fit APIs: end of documented support",
    choices: {
      act: "Move to Health Connect or the Google Health API",
      hedge: "Run Fit and its successor side by side",
      ignore: "Google gave no switch-off date. Leave it",
    },
  },
];

// ── Engine: a pure state machine. ──────────────────────────────────────────

export type LogEntry = {
  eventId: string;
  choice: ChoiceId | "handled";
  weeks: number;
  /** Users lost per stack to this event. */
  lost: Partial<Record<StackId, number>>;
  /** True when this event took a stack's last user. */
  wiped: boolean;
};

export type EndingId = "shipped" | "limped" | "out-of-runway" | "out-of-users";

export type State = {
  phase: "product" | "stacks" | "event" | "end";
  product: ProductId | null;
  stacks: StackId[];
  /** Event ids in play order, fixed when the stacks are locked in. */
  queue: string[];
  index: number;
  weeks: number;
  users: Partial<Record<StackId, number>>;
  log: LogEntry[];
  ending: EndingId | null;
};

export type Action =
  | { type: "product"; id: ProductId }
  | { type: "stacks"; ids: StackId[] }
  | { type: "choose"; choice: ChoiceId }
  | { type: "restart" };

export const INITIAL: State = {
  phase: "product",
  product: null,
  stacks: [],
  queue: [],
  index: 0,
  weeks: 0,
  users: {},
  log: [],
  ending: null,
};

const EVENT_BY_ID = new Map(EVENTS.map((e) => [e.id, e]));

export function eventById(id: string): ShipEvent | undefined {
  return EVENT_BY_ID.get(id);
}

/** The events a product on these stacks lives through, in date order. */
export function timeline(product: ProductId, stacks: StackId[]): ShipEvent[] {
  return EVENTS.filter(
    (e) => e.stacks.some((s) => stacks.includes(s)) && (!e.products || e.products.includes(product)),
  ).sort((a, b) => (a.sortDate === b.sortDate ? 0 : a.sortDate < b.sortDate ? -1 : 1));
}

export function totalUsers(s: State): number {
  return Object.values(s.users).reduce((n, u) => n + (u ?? 0), 0);
}

function startUsers(stacks: StackId[]): Partial<Record<StackId, number>> {
  const out: Partial<Record<StackId, number>> = {};
  const each = Math.floor(START_USERS / stacks.length);
  stacks.forEach((s, i) => {
    out[s] = i === 0 ? START_USERS - each * (stacks.length - 1) : each;
  });
  return out;
}

/** Whether an earlier act or hedge already dealt with this event. */
function isHandled(e: ShipEvent, log: LogEntry[]): boolean {
  return (e.resolvedBy ?? []).some((id) => log.some((l) => l.eventId === id && (l.choice === "act" || l.choice === "hedge")));
}

/** Move past events already handled, then decide whether the run is over. */
function settle(s: State): State {
  let next = s;
  while (next.index < next.queue.length) {
    const e = EVENT_BY_ID.get(next.queue[next.index]);
    if (!e || !isHandled(e, next.log)) break;
    next = {
      ...next,
      index: next.index + 1,
      log: [...next.log, { eventId: e.id, choice: "handled", weeks: 0, lost: {}, wiped: false }],
    };
  }
  if (next.weeks > RUNWAY_WEEKS) return { ...next, phase: "end", ending: "out-of-runway" };
  if (totalUsers(next) <= 0) return { ...next, phase: "end", ending: "out-of-users" };
  if (next.index >= next.queue.length) {
    return { ...next, phase: "end", ending: keptShare(next) >= SURVIVE_SHARE ? "shipped" : "limped" };
  }
  return { ...next, phase: "event" };
}

export function reduce(s: State, a: Action): State {
  if (a.type === "restart") return INITIAL;
  if (s.phase === "product" && a.type === "product") {
    if (!PRODUCTS.some((p) => p.id === a.id)) return s;
    return { ...INITIAL, phase: "stacks", product: a.id };
  }
  if (s.phase === "stacks" && a.type === "stacks" && s.product) {
    const ids = [...new Set(a.ids)].filter((id) => STACKS.some((x) => x.id === id));
    if (ids.length < 1 || ids.length > MAX_STACKS) return s;
    const queue = timeline(s.product, ids).map((e) => e.id);
    return settle({ ...s, stacks: ids, queue, index: 0, users: startUsers(ids) });
  }
  if (s.phase === "event" && a.type === "choose") {
    const e = EVENT_BY_ID.get(s.queue[s.index]);
    if (!e) return settle({ ...s, index: s.index + 1 });
    const cost = RULES[e.kind][a.choice];
    const users = { ...s.users };
    const lost: Partial<Record<StackId, number>> = {};
    let wiped = false;
    for (const st of e.stacks) {
      const u = users[st];
      if (u === undefined) continue;
      const l = Math.round(u * cost.lose);
      users[st] = u - l;
      lost[st] = l;
      if (u > 0 && l === u) wiped = true;
    }
    return settle({
      ...s,
      index: s.index + 1,
      weeks: s.weeks + cost.weeks,
      users,
      log: [...s.log, { eventId: e.id, choice: a.choice, weeks: cost.weeks, lost, wiped }],
    });
  }
  return s;
}

export function keptShare(s: State): number {
  return totalUsers(s) / START_USERS;
}

export function currentEvent(s: State): ShipEvent | undefined {
  return s.phase === "event" ? EVENT_BY_ID.get(s.queue[s.index]) : undefined;
}

/** The planned launch, moved one week for every week of slip. */
export function shipDate(s: State): string {
  const d = new Date(`${PLANNED_LAUNCH}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 7 * s.weeks);
  return d.toISOString().slice(0, 10);
}

export const ENDINGS: Record<EndingId, { title: string; survived: boolean; line: string }> = {
  shipped: { title: "Shipped", survived: true, line: "You launched with most of your users still connected." },
  limped: { title: "Shipped, barely", survived: false, line: `You launched, but kept fewer than ${SURVIVE_SHARE * 100}% of your users.` },
  "out-of-runway": { title: "Out of runway", survived: false, line: "The platform work ate the roadmap and the money ran out before launch." },
  "out-of-users": { title: "Out of users", survived: false, line: "Every stack you built on stopped delivering data." },
};

/** One square per event: green kept everyone, yellow lost some, red lost a whole stack, white was already handled. */
export function squares(s: State): string {
  return s.log
    .map((l) => {
      if (l.choice === "handled") return "⬜";
      if (l.wiped) return "🟥";
      return Object.values(l.lost).some((n) => (n ?? 0) > 0) ? "🟨" : "🟩";
    })
    .join("");
}

/** The spoiler-free share text: the squares, never the events. */
export function shareText(s: State, origin = "https://aifitnessapi.com"): string {
  const product = PRODUCTS.find((p) => p.id === s.product)?.name ?? "Fitness app";
  const stacks = s.stacks.map((id) => STACKS.find((x) => x.id === id)?.name ?? id).join(" + ");
  const end = s.ending ? ENDINGS[s.ending] : null;
  const kept = Math.round(keptShare(s) * 100);
  const lines = [
    `Ship It: ${product} on ${stacks}`,
    squares(s),
    end?.survived || s.ending === "limped"
      ? `${end?.title} ${shipDate(s)} · kept ${kept}% of users · ${s.weeks} weeks of slip`
      : `${end?.title} · kept ${kept}% of users · ${s.weeks} weeks of slip`,
    `${origin}${PATH}`,
  ];
  return lines.join("\n");
}
