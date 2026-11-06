/**
 * The decision logic behind /quiz/which-wearable-api (ops/VIRAL-20-2026-11-06.md
 * item 6): eight answers in, one of eight outcomes out, each outcome a static
 * page at /quiz/which-wearable-api/<outcome>.
 *
 * Pure and deterministic, so a result can be reproduced from its answers and
 * tested (scripts/wearable-quiz.test.mjs, npm run test:wearable-quiz). The
 * logic is a routing judgment, not a ranking of products: an outcome is an
 * approach (the platform stores, the device makers' own cloud APIs, an
 * aggregator, Bluetooth, a research platform, a camera pose model or SDK),
 * and every result page lists the products of that approach neutrally, in
 * alphabetical order, from the site's sourced cost model.
 *
 * How it decides, in order:
 *  1. Movement or form from a camera, or no wearable at all -> camera-motion.
 *  2. A research study under an IRB or ethics board -> research-platform.
 *  3. Bluetooth sensors or gym equipment -> bluetooth-direct.
 *  4. Otherwise three approaches are scored from every answer (SCORES below)
 *     and the highest wins; ties go to the first in APPROACHES. The store
 *     approach resolves to HealthKit, Health Connect or both by platform.
 *     Every point is listed in `reasons`, so the page can say why.
 *
 * KinesteX, which funds the site, can only appear through camera-motion,
 * where it is one of several listed products and disclosed.
 */

export const QUIZ_PATH = "/quiz/which-wearable-api";

export const QUESTIONS = [
  {
    id: "platform",
    label: "Where does your product run?",
    options: [
      ["ios", "iPhone app"],
      ["android", "Android app"],
      ["both", "iPhone and Android apps"],
      ["web", "Web app or backend only, no mobile app"],
    ],
  },
  {
    id: "devices",
    label: "What do your users wear or use?",
    options: [
      ["apple", "Apple Watch or just an iPhone"],
      ["android", "Android phones, Wear OS or Samsung watches"],
      ["many", "Many brands: Garmin, Oura, WHOOP, Fitbit and others"],
      ["few", "One or two specific brands"],
      ["sensors", "Bluetooth sensors or gym equipment: straps, bikes, treadmills"],
      ["camera", "No wearable: the phone or laptop camera"],
    ],
  },
  {
    id: "data",
    label: "What data do you need?",
    options: [
      ["summary", "Daily summaries: steps, sleep, resting heart rate"],
      ["raw", "Detailed samples: heart rate over time, GPS tracks, intervals"],
      ["movement", "Movement itself: reps, form, joint angles"],
    ],
  },
  {
    id: "server",
    label: "Where does the data have to end up?",
    options: [
      ["push", "On our backend, pushed to us as it arrives (webhooks)"],
      ["pull", "On our backend; we can poll for it"],
      ["device", "In the app on the user's device is enough"],
    ],
  },
  {
    id: "budget",
    label: "How do you want to pay for data access?",
    options: [
      ["free", "No per-user fees"],
      ["per-user", "A fee per connected user is fine"],
      ["contract", "A negotiated contract is fine"],
    ],
  },
  {
    id: "compliance",
    label: "Which rules shape the project?",
    options: [
      ["none", "Nothing beyond app store rules"],
      ["hipaa", "HIPAA: we work with a covered entity"],
      ["gdpr", "GDPR: users in the EU"],
      ["study", "A research study with an IRB or ethics board"],
    ],
  },
  {
    id: "team",
    label: "Who builds and runs the integration?",
    options: [
      ["solo", "Just me"],
      ["small", "A small team, no dedicated backend engineer"],
      ["backend", "A team with backend engineers"],
    ],
  },
  {
    id: "timeline",
    label: "When does it need to work?",
    options: [
      ["weeks", "In a few weeks"],
      ["months", "This quarter or later"],
    ],
  },
];

/** Outcome slugs, in the order the quiz page lists them. */
export const OUTCOMES = [
  "healthkit",
  "health-connect",
  "healthkit-and-health-connect",
  "direct-wearable-apis",
  "aggregator",
  "bluetooth-direct",
  "research-platform",
  "camera-motion",
];

/** The three approaches that are scored, in tie-break order. */
export const APPROACHES = ["store", "direct", "aggregator"];

/**
 * Points per answer: [approach, points, why]. `why` is the sentence the
 * result shows for that point; it is a judgment, labeled as one on the page.
 */
export const SCORES = {
  platform: {
    ios: [["store", 1, "An iPhone app can read HealthKit on the device"]],
    android: [["store", 1, "An Android app can read Health Connect on the device"]],
    both: [["store", 1, "Two mobile apps can each read their platform's health store"]],
    web: [
      ["store", -10, "The platform stores are read by a mobile app on the device, and you have none"],
      ["aggregator", 1, "A web-only product needs the data to come from a cloud API"],
      ["direct", 1, "A web-only product needs the data to come from a cloud API"],
    ],
  },
  devices: {
    apple: [["store", 3, "Apple Watch data reaches apps through HealthKit"]],
    android: [["store", 3, "Android and Wear OS data reaches apps through Health Connect"]],
    many: [["aggregator", 3, "Many brands is the case an aggregator's one integration is built for"]],
    few: [["direct", 3, "With one or two brands, integrating their own APIs is a bounded job"]],
  },
  data: {
    summary: [
      ["aggregator", 1, "Daily summaries are what every route offers"],
      ["store", 1, "Daily summaries are what every route offers"],
    ],
    raw: [
      ["direct", 2, "Detailed samples are where provider-specific fields matter most"],
      ["store", 1, "The stores keep individual samples on the device"],
    ],
  },
  server: {
    push: [
      ["aggregator", 1, "You want data pushed to a backend"],
      ["direct", 1, "You want data pushed to a backend"],
    ],
    pull: [
      ["aggregator", 1, "You want data on a backend"],
      ["direct", 1, "You want data on a backend"],
    ],
    device: [["store", 2, "Data that only has to reach the app can stay on the device"]],
  },
  budget: {
    free: [
      ["store", 2, "The platform stores have no per-user fee"],
      ["direct", 2, "The device makers' own APIs in this site's cost model list no per-call fee"],
      ["aggregator", -2, "Aggregators bill by usage"],
    ],
    "per-user": [["aggregator", 2, "Aggregators bill by usage, which a per-user budget allows"]],
    contract: [["aggregator", 1, "A contract fits sales-led aggregator plans"]],
  },
  compliance: {
    hipaa: [["store", 1, "Data that stays on the device never reaches your servers"]],
  },
  team: {
    solo: [
      ["store", 1, "One person: fewer servers to run"],
      ["aggregator", 1, "One person: one integration instead of several"],
      ["direct", -1, "One person maintaining several vendor integrations is a lot"],
    ],
    small: [["aggregator", 1, "No backend engineer: one integration instead of several"]],
    backend: [["direct", 2, "A backend team can own several OAuth integrations and webhooks"]],
  },
  timeline: {
    weeks: [
      ["aggregator", 2, "A few weeks favors one integration over several"],
      ["store", 1, "A few weeks favors no backend at all"],
      ["direct", -1, "Several vendor approvals can take longer than a few weeks"],
    ],
    months: [["direct", 1, "A quarter leaves time for each vendor's developer approval"]],
  },
};

const OPTION_VALUES = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.options.map((o) => o[0])]));

/** True when every question has one of its own option values. */
export function isComplete(answers) {
  if (!answers || typeof answers !== "object") return false;
  return QUESTIONS.every((q) => OPTION_VALUES[q.id].includes(answers[q.id]));
}

/** The store outcome for a platform. */
export function storeFor(platform, devices) {
  if (platform === "ios") return "healthkit";
  if (platform === "android") return "health-connect";
  // "both" (and "web", which the store approach can never win) needs a
  // reader in each app; an iPhone-only user base still reads HealthKit.
  return platform === "both" && devices === "apple" ? "healthkit" : "healthkit-and-health-connect";
}

const outcomeOf = (approach, a) =>
  approach === "store" ? storeFor(a.platform, a.devices) : approach === "direct" ? "direct-wearable-apis" : "aggregator";

/**
 * Decide. Returns { outcome, rule, scores, runnerUp, reasons } where `rule`
 * is "camera", "study", "sensors" or "score", `scores` the three approach
 * totals (all zero for a rule), `runnerUp` the next outcome by score (null
 * for a rule) and `reasons` the sentences that pushed toward the outcome.
 * Throws on incomplete answers: the page only calls this with all eight.
 */
export function decide(answers) {
  if (!isComplete(answers)) throw new Error("wearableQuiz.decide: every question needs an answer");
  const a = answers;
  if (a.data === "movement" || a.devices === "camera") {
    return {
      outcome: "camera-motion",
      rule: "camera",
      scores: { store: 0, direct: 0, aggregator: 0 },
      runnerUp: null,
      reasons: [a.data === "movement" ? "You need movement itself, which wearable data does not carry" : "Your users have no wearable, only a camera"],
    };
  }
  if (a.compliance === "study") {
    return {
      outcome: "research-platform",
      rule: "study",
      scores: { store: 0, direct: 0, aggregator: 0 },
      runnerUp: null,
      reasons: ["A study under an ethics board needs participant management and exports that research platforms are built for"],
    };
  }
  if (a.devices === "sensors") {
    return {
      outcome: "bluetooth-direct",
      rule: "sensors",
      scores: { store: 0, direct: 0, aggregator: 0 },
      runnerUp: null,
      reasons: ["Straps, bikes and treadmills talk standard Bluetooth profiles your app can read directly"],
    };
  }
  const scores = { store: 0, direct: 0, aggregator: 0 };
  const why = { store: [], direct: [], aggregator: [] };
  for (const q of QUESTIONS) {
    for (const [approach, pts, text] of SCORES[q.id]?.[a[q.id]] ?? []) {
      scores[approach] += pts;
      if (pts > 0 && !why[approach].includes(text)) why[approach].push(text);
    }
  }
  const ranked = [...APPROACHES].sort((x, y) => scores[y] - scores[x] || APPROACHES.indexOf(x) - APPROACHES.indexOf(y));
  return {
    outcome: outcomeOf(ranked[0], a),
    rule: "score",
    scores,
    runnerUp: outcomeOf(ranked[1], a),
    reasons: why[ranked[0]],
  };
}

/** Answers -> "?a=<one letter-free code per question>", in question order. */
export function encodeAnswers(answers) {
  if (!isComplete(answers)) return "";
  return `?a=${QUESTIONS.map((q) => OPTION_VALUES[q.id].indexOf(answers[q.id])).join("")}`;
}

/** The inverse of encodeAnswers; null for anything that is not a full, valid code. */
export function decodeAnswers(search) {
  const code = new URLSearchParams(String(search ?? "")).get("a") ?? "";
  if (!/^\d+$/.test(code) || code.length !== QUESTIONS.length) return null;
  const out = {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    const v = OPTION_VALUES[QUESTIONS[i].id][Number(code[i])];
    if (!v) return null;
    out[QUESTIONS[i].id] = v;
  }
  return out;
}

/** Every combination of answers, for tests and for checking reachability. */
export function* allAnswerSets() {
  const ids = QUESTIONS.map((q) => q.id);
  const idx = ids.map(() => 0);
  while (true) {
    yield Object.fromEntries(ids.map((id, i) => [id, OPTION_VALUES[id][idx[i]]]));
    let k = ids.length - 1;
    while (k >= 0 && ++idx[k] >= OPTION_VALUES[ids[k]].length) idx[k--] = 0;
    if (k < 0) return;
  }
}
