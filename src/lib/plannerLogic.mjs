/**
 * The logic behind the three planning tools: /tools/build-plan (and the PRD
 * template it writes), /tools/store-submission-checklist and
 * /tools/compliance-wizard (ops/AUDIENCE-30-2026-11-05.md items 17–20).
 *
 * Plain ESM with no DOM, imported by the pages (server render of the default
 * answers), by their client components, and by scripts/planner-tools.test.mjs,
 * so the tests run exactly the rules the reader's browser runs.
 *
 * It knows no facts. Rules come from src/data/plannerSources.mjs as quotes;
 * products, cost shapes, data types and page names come in a bundle the page
 * assembles on the server from the site's data modules (the cost model, the
 * build guides' stacks, the HealthKit identifier dataset, the verified
 * matrix, routeLabel). What it adds is the routing: which quoted rule, which
 * product and which page a set of answers reaches, and the reason it gives.
 * The reasons are written here and never state a rule; the rule is the quote
 * shown beside them.
 */

// ── Small helpers ────────────────────────────────────────────────────────

/** "a,b,,c" → ["a","b","c"], keeping only values in `allowed` (when given), deduped, in allowed order. */
export function parseList(value, allowed) {
  const got = String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!allowed) return [...new Set(got)];
  const set = new Set(got);
  return allowed.filter((a) => set.has(a));
}

function pick(value, allowed, fallback = "") {
  return allowed.includes(value) ? value : fallback;
}

function qs(params) {
  const parts = [];
  for (const [k, v] of Object.entries(params)) {
    const s = Array.isArray(v) ? v.join(",") : String(v ?? "");
    if (s) parts.push(`${k}=${encodeURIComponent(s).replace(/%2C/g, ",")}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

function searchParams(search) {
  return new URLSearchParams(String(search ?? "").replace(/^\?/, ""));
}

const md = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const cell = (s) => md(s).replace(/\|/g, "\\|");
const abs = (origin, href) => (href.startsWith("/") ? `${origin}${href}` : href);

// ── Store submission checklist ───────────────────────────────────────────

export const STORES = ["apple", "google"];
export const STORE_LABELS = { apple: "Apple App Store", google: "Google Play" };

/** The traits the checklist asks about, in the order it asks. */
export const TRAIT_ORDER = [
  "healthkit",
  "health-connect",
  "accounts",
  "camera",
  "hardware",
  "third-party-ai",
  "ads",
  "live-coaching",
  "medical",
  "clinical",
  "research",
  "kids",
];

/** Items for the chosen stores whose `when` (if any) meets a chosen trait. */
export function applicableStoreItems(items, stores, traits) {
  const s = new Set(stores);
  const t = new Set(traits);
  return items.filter((i) => s.has(i.store) && (!i.when || i.when.some((w) => t.has(w))));
}

export const CHECKLIST_DEFAULT = { stores: ["apple", "google"], traits: ["healthkit", "health-connect", "accounts"] };

export function decodeChecklist(search) {
  const p = searchParams(search);
  if (!p.has("s") && !p.has("t")) return { ...CHECKLIST_DEFAULT };
  return { stores: parseList(p.get("s"), STORES), traits: parseList(p.get("t"), TRAIT_ORDER) };
}

export function encodeChecklist(state) {
  return qs({ s: state.stores, t: state.traits });
}

/** Done/total for the applicable items only. */
export function checklistProgress(items, done) {
  const d = new Set(done);
  const n = items.filter((i) => d.has(i.id)).length;
  return { done: n, total: items.length, percent: items.length ? Math.round((n / items.length) * 100) : 0 };
}

export function checklistMarkdown(items, sources, { done = [], origin = "", traitLabels = {}, traits = [], stores = [] } = {}) {
  const d = new Set(done);
  const out = [
    "# App Store and Google Play submission checklist for a health or fitness app",
    "",
    `Generated at ${origin}/tools/store-submission-checklist${encodeChecklist({ stores, traits })}. Each item quotes the store's own text; it is a checklist to work through, not legal advice and not a guarantee of approval.`,
    "",
  ];
  if (traits.length) {
    out.push(`Answers: ${traits.map((t) => traitLabels[t] ?? t).join("; ")}.`, "");
  }
  for (const store of STORES) {
    const mine = items.filter((i) => i.store === store);
    if (!mine.length) continue;
    out.push(`## ${STORE_LABELS[store]} (${mine.filter((i) => d.has(i.id)).length} of ${mine.length} done)`, "");
    for (const i of mine) {
      const s = sources[i.source];
      out.push(`- [${d.has(i.id) ? "x" : " "}] **${md(i.title)}** (${md(i.section)})`);
      out.push(`  > ${md(i.quote)}`);
      out.push(`  Source: [${md(s.publisher)}, ${md(s.title)}](${s.url})${i.page ? ` · Explained: ${abs(origin, i.page)}` : ""}`);
    }
    out.push("");
  }
  return out.join("\n");
}

// ── Compliance wizard ────────────────────────────────────────────────────

/** The questions, in order. Labels are ours; no option states a rule. */
export const WIZARD_QUESTIONS = [
  {
    id: "payer",
    label: "Who offers or pays for the app?",
    options: [
      ["consumer", "Consumers download or buy it themselves"],
      ["employer", "An employer offers it to staff (wellness program)"],
      ["health-plan", "A health plan or insurer offers it to members"],
      ["provider", "A hospital, clinic, doctor or therapist offers it to patients"],
      ["gym", "A gym or studio offers it to members"],
    ],
  },
  {
    id: "ce",
    label: "Is your company itself a health plan, a health care clearinghouse, or a provider that sends claims or other standard transactions electronically?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
      ["unsure", "Not sure"],
    ],
  },
  {
    id: "ba",
    label: "Do you build, offer or run the app on behalf of a health plan, provider or clearinghouse (or as a subcontractor to one)?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
      ["unsure", "Not sure"],
    ],
  },
  {
    id: "rx",
    label: "Do people need a prescription to use the app?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
    ],
  },
  {
    id: "us",
    label: "Do you have users in the United States?",
    options: [
      ["yes", "Yes"],
      ["no", "No"],
    ],
  },
  {
    id: "wa",
    label: "Do you target consumers in Washington State, or collect health data there?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
      ["unsure", "Not sure"],
    ],
  },
  {
    id: "eu",
    label: "Do you offer the app to people in the EU?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
    ],
  },
  {
    id: "med",
    label: "Does the app claim to diagnose, treat, mitigate or prevent a disease or condition?",
    options: [
      ["no", "No, it supports fitness and a healthy lifestyle"],
      ["yes", "Yes"],
    ],
  },
  {
    id: "ads",
    label: "Do you share health data with advertising or other third parties?",
    options: [
      ["no", "No"],
      ["yes", "Yes"],
    ],
  },
];

const Q_IDS = WIZARD_QUESTIONS.map((q) => q.id);
const OPTIONS = Object.fromEntries(WIZARD_QUESTIONS.map((q) => [q.id, q.options.map((o) => o[0])]));

export const WIZARD_DEFAULT = { payer: "consumer", ce: "no", ba: "no", rx: "no", us: "yes", wa: "no", eu: "no", med: "no", ads: "no", s: ["apple", "google"] };

export function decodeWizard(search) {
  const p = searchParams(search);
  if (![...Q_IDS, "s"].some((k) => p.has(k))) return { ...WIZARD_DEFAULT, s: [...WIZARD_DEFAULT.s] };
  const a = {};
  for (const id of Q_IDS) a[id] = pick(p.get(id) ?? "", OPTIONS[id]);
  a.s = parseList(p.get("s"), STORES);
  return a;
}

export function encodeWizard(a) {
  const o = {};
  for (const id of Q_IDS) o[id] = a[id] ?? "";
  o.s = a.s ?? [];
  return qs(o);
}

export const STATUS_LABELS = {
  likely: "Likely applies",
  possible: "May apply",
  unlikely: "Likely does not apply",
  check: "Answer needed",
};

/**
 * Answers → which regimes to show, with a status and our one-line reason.
 * The order is the order a reader should look at them in.
 * @returns {{ id: string; status: "likely"|"possible"|"unlikely"|"check"; reason: string }[]}
 */
export function assessCompliance(a) {
  const out = [];
  const add = (id, status, reason) => out.push({ id, status, reason });
  const ceYes = a.ce === "yes";
  const baYes = a.ba === "yes";
  const sponsor = a.payer === "health-plan" || a.payer === "provider";
  const covered = ceYes || baYes;

  // HIPAA: covered entity
  if (ceYes) add("hipaa-covered-entity", "likely", "You said your company is itself a health plan, clearinghouse or provider that sends standard transactions electronically: the regulation's definition of a covered entity.");
  else if (a.rx === "yes") add("hipaa-covered-entity", "possible", "People need a prescription to use the app, which is the case the FTC's tool flags as a possible covered health care provider.");
  else if (a.ce === "unsure" || !a.ce) add("hipaa-covered-entity", "check", "Whether your company is a covered entity decides this. The definition is quoted below.");

  // HIPAA: business associate
  if (baYes) add("hipaa-business-associate", "likely", "You build, offer or run the app on behalf of a covered entity, the situation the FTC's tool calls a likely business associate.");
  else if (a.ba === "unsure" || (!a.ba && sponsor)) add("hipaa-business-associate", "possible", "Settle whether you act on behalf of a covered entity: if you do, the FTC's tool says you likely are a business associate.");
  else if (sponsor && a.ba === "no") add("hipaa-business-associate", "check", "A health plan or provider offers the app, yet you said you do not act on its behalf. Check that against the FTC's question quoted below before you rely on it.");

  // HIPAA: neither
  if (a.ce === "no" && a.ba === "no" && a.rx !== "yes" && !sponsor) {
    add("hipaa-not-covered", "unlikely", "On your answers you are neither a covered entity nor acting for one, so HIPAA likely does not reach the app. Other rules below still can.");
  }

  // FTC Health Breach Notification Rule
  if (a.us === "no") add("ftc-hbnr", "unlikely", "You said you have no users in the United States; the rule is about information of US citizens and residents.");
  else if (covered) add("ftc-hbnr", "possible", "The rule excludes HIPAA-covered entities and business-associate activity, but a business associate that also offers health records to the public can fall under both rules.");
  else add("ftc-hbnr", a.us === "yes" ? "likely" : "check", "A health or fitness app outside HIPAA is the case the FTC says its breach rule covers.");

  if (a.ads === "yes" && a.us !== "no" && !covered) {
    add("ftc-hbnr-sharing", "likely", "You share health data with advertising or other third parties: under this rule an unauthorized disclosure, not only a hack, can be a breach.");
  }

  // FTC Act claims
  if (a.us !== "no") add("ftc-act", a.us === "yes" ? "likely" : "check", "Whatever HIPAA's answer, the FTC tells health-app makers not to claim HIPAA compliance or certification they do not have.");

  // GDPR
  if (a.eu === "yes") {
    add("gdpr-art9", "likely", "You offer the app to people in the EU, and fitness and health metrics can be data concerning health. Whether GDPR reaches a company outside the EU is the territorial-scope question the GDPR page covers.");
    if (a.payer === "gym") add("gdpr-gym", "likely", "A gym or studio deciding why and how member data is processed is the controller; the app vendor that processes it for the gym is a processor.");
  } else if (!a.eu) add("gdpr-art9", "check", "Answer the EU question.");

  // Washington
  if (a.wa === "yes") add("wa-mhmda", "likely", "You target consumers in Washington or collect health data there, and the Act's definition of consumer health data is broad.");
  else if (a.wa === "unsure") add("wa-mhmda", "possible", "Check whether you do business in Washington or target consumers there; the regulated-entity definition is quoted below.");

  // FDA
  if (a.med === "yes") add("fda-wellness", "possible", "You claim to diagnose, treat, mitigate or prevent a condition, which takes the software outside the healthy-lifestyle carve-out quoted below.");
  else if (a.med === "no") add("fda-wellness", "unlikely", "Software only for maintaining or encouraging a healthy lifestyle is outside the device definition, per the provision the FDA quotes below. Medical claims change that.");

  // Stores
  const s = new Set(a.s ?? []);
  if (s.has("apple")) add("app-store", "likely", "You ship on iOS. The App Store's health rules apply to every health and fitness app there.");
  if (s.has("google")) add("google-play", "likely", "You ship on Android. Google Play's Health apps policy applies to any app with health features.");
  return out;
}

export function complianceMarkdown(result, regimes, sources, { origin = "", answers } = {}) {
  const byId = Object.fromEntries(regimes.map((r) => [r.id, r]));
  const out = [
    "# Which health-data rules likely apply to my app?",
    "",
    `Generated at ${origin}/tools/compliance-wizard${answers ? encodeWizard(answers) : ""}. A starting map, not legal advice: every rule below is quoted from its source, and the status is a routing from your answers, not a legal conclusion. Confirm with a qualified professional.`,
    "",
  ];
  if (answers) {
    out.push("## Your answers", "");
    for (const q of WIZARD_QUESTIONS) {
      const o = q.options.find((x) => x[0] === answers[q.id]);
      out.push(`- ${q.label} **${o ? o[1] : "not answered"}**`);
    }
    out.push(`- Stores: **${(answers.s ?? []).map((x) => STORE_LABELS[x]).join(", ") || "none"}**`, "");
  }
  out.push("## Result", "");
  for (const r of result) {
    const g = byId[r.id];
    if (!g) continue;
    out.push(`### ${g.name}: ${STATUS_LABELS[r.status]}`, "", r.reason, "");
    for (const q of g.quotes) {
      const s = sources[q.source];
      out.push(`> ${md(q.quote)}`, `> — [${md(s.publisher)}, ${md(s.title)}](${s.url})`, "");
    }
    out.push(`Explained: ${abs(origin, g.page)}`, "");
  }
  return out.join("\n");
}

// ── Build plan and PRD ───────────────────────────────────────────────────

export const PLATFORMS = ["ios", "android", "web"];
export const PLATFORM_LABELS = { ios: "iOS", android: "Android", web: "Web" };

export const DATA_SOURCES = [
  ["platform-store", "Apple Health / Health Connect on the phone"],
  ["wearable-direct", "Wearable vendors' cloud APIs directly (Garmin, Oura, WHOOP...)"],
  ["aggregator", "A health-data aggregator (one API for many wearables)"],
  ["ble", "Bluetooth devices (heart-rate straps, trainers, treadmills)"],
  ["manual", "Only what users enter in the app"],
];
const SOURCE_IDS = DATA_SOURCES.map((s) => s[0]);

/** Features: the cost-model categories each pulls in and the checklist traits it switches on. */
export const FEATURES = [
  { id: "ai-motion", label: "Camera motion tracking (rep counting, form feedback)", categories: ["motion-sdk", "pose-model"], traits: ["camera"] },
  { id: "llm-coach", label: "An AI (LLM) coach or chat", categories: ["llm-features"], traits: ["third-party-ai"] },
  { id: "nutrition", label: "Food logging and nutrition data", categories: ["nutrition"], traits: [] },
  { id: "exercise-content", label: "An exercise library with instructions or media", categories: ["exercise-content"], traits: [] },
  { id: "accounts", label: "User accounts", categories: [], traits: ["accounts"] },
  { id: "live-coaching", label: "Paid live coaching sessions", categories: [], traits: ["live-coaching"] },
  { id: "ads", label: "Ads or data sharing with ad partners", categories: [], traits: ["ads"] },
  { id: "medical", label: "Medical claims (diagnose, treat, monitor a condition)", categories: [], traits: ["medical"] },
  { id: "research", label: "Health research with participants", categories: [], traits: ["research"] },
];
const FEATURE_IDS = FEATURES.map((f) => f.id);

export const PAYERS = WIZARD_QUESTIONS[0].options;
const PAYER_IDS = PAYERS.map((p) => p[0]);

export const PLAN_DEFAULT = {
  type: "sleep-tracking-app",
  p: ["ios", "android"],
  src: ["platform-store", "wearable-direct"],
  f: ["accounts"],
  payer: "consumer",
  us: "yes",
  eu: "no",
  wa: "no",
};

export function decodePlan(search, appTypeIds) {
  const p = searchParams(search);
  if (!["type", "p", "src", "f", "payer", "us", "eu", "wa"].some((k) => p.has(k))) return { ...PLAN_DEFAULT, p: [...PLAN_DEFAULT.p], src: [...PLAN_DEFAULT.src], f: [...PLAN_DEFAULT.f] };
  return {
    type: pick(p.get("type") ?? "", appTypeIds, appTypeIds.includes(PLAN_DEFAULT.type) ? PLAN_DEFAULT.type : appTypeIds[0]),
    p: parseList(p.get("p"), PLATFORMS),
    src: parseList(p.get("src"), SOURCE_IDS),
    f: parseList(p.get("f"), FEATURE_IDS),
    payer: pick(p.get("payer") ?? "", PAYER_IDS, "consumer"),
    us: pick(p.get("us") ?? "", ["yes", "no"], "yes"),
    eu: pick(p.get("eu") ?? "", ["yes", "no"], "no"),
    wa: pick(p.get("wa") ?? "", ["yes", "no", "unsure"], "no"),
  };
}

export function encodePlan(a) {
  return qs({ type: a.type, p: a.p, src: a.src, f: a.f, payer: a.payer, us: a.us, eu: a.eu, wa: a.wa });
}

const EFFORT_ORDER = ["low", "medium", "high"];
const DEV_COST_ORDER = ["free", "free-tier-then-paid", "usage-based", "contact-sales"];

/** The traits a plan switches on, for the checklist and the edge cases. */
export function planTraits(a, appType) {
  const t = new Set(appType?.traits ?? []);
  const p = new Set(a.p);
  if (a.src.includes("platform-store")) {
    if (p.has("ios")) t.add("healthkit");
    if (p.has("android")) t.add("health-connect");
  }
  if (a.src.includes("ble") || a.src.includes("wearable-direct") || a.src.includes("aggregator")) t.add("hardware");
  for (const f of FEATURES) if (a.f.includes(f.id)) for (const x of f.traits) t.add(x);
  return TRAIT_ORDER.filter((x) => t.has(x));
}

/** Plan answers → the compliance wizard's answers. Unknowns stay unanswered. */
export function planToWizard(a, appType) {
  const traits = planTraits(a, appType);
  const sponsor = a.payer === "health-plan" || a.payer === "provider";
  return {
    payer: a.payer,
    ce: sponsor ? "unsure" : "no",
    ba: sponsor || traits.includes("clinical") ? "unsure" : "no",
    rx: "",
    us: a.us,
    wa: a.wa,
    eu: a.eu,
    med: traits.includes("medical") ? "yes" : "no",
    ads: a.f.includes("ads") ? "yes" : "no",
    s: [a.p.includes("ios") ? "apple" : null, a.p.includes("android") ? "google" : null].filter(Boolean),
  };
}

/**
 * Assemble a plan from answers and the page's data bundle.
 *
 * bundle: {
 *   appTypes: { id, label, guide?: {href,label}, hk: {name, aggregation, android}[], apiIds: string[], traits?: string[], pages: string[] }[],
 *   apis: Record<id, { id, label, category, categoryLabel, devCost, devCostLabel, userSideCost, approvalGate, engEffort, notes, sourceHref }>,
 *   labels: Record<path, string>,   // routeLabel for every page the plan may link
 *   storeItems, regimes, edgeCases, sources, traitLabels
 * }
 */
export function buildPlan(a, bundle) {
  const appType = bundle.appTypes.find((t) => t.id === a.type) ?? bundle.appTypes[0];
  const p = new Set(a.p);
  const src = new Set(a.src);
  const traits = planTraits(a, appType);
  const link = (href) => (bundle.labels[href] ? { href, label: bundle.labels[href] } : null);
  const notes = [];

  // Products: the categories the answers reach, then the platform stores the platforms can read.
  const cats = new Set();
  if (src.has("wearable-direct")) cats.add("wearable-direct");
  if (src.has("aggregator")) cats.add("aggregator");
  for (const f of FEATURES) if (a.f.includes(f.id)) for (const c of f.categories) cats.add(c);
  const guideApis = new Set(appType.apiIds);
  const apis = Object.values(bundle.apis)
    .filter((x) => {
      if (x.category === "platform-store") {
        if (!src.has("platform-store")) return false;
        return (x.id === "healthkit" && p.has("ios")) || (x.id === "health-connect" && p.has("android"));
      }
      return cats.has(x.category);
    })
    .map((x) => ({ ...x, inGuide: guideApis.has(x.id) }))
    .sort((x, y) => Number(y.inGuide) - Number(x.inGuide) || DEV_COST_ORDER.indexOf(x.devCost) - DEV_COST_ORDER.indexOf(y.devCost) || x.label.localeCompare(y.label));
  if (src.has("platform-store") && !p.has("ios") && !p.has("android")) {
    notes.push("Apple Health and Health Connect are read by an app on the phone, so a web-only plan cannot read them. Add iOS or Android, or drop that data source.");
  }
  if (!a.p.length) notes.push("Pick at least one platform.");

  // Cost shape: counts by how each product bills, and the span of our effort judgement.
  const byDevCost = DEV_COST_ORDER.map((k) => ({ key: k, items: apis.filter((x) => x.devCost === k) })).filter((g) => g.items.length);
  const efforts = apis.map((x) => EFFORT_ORDER.indexOf(x.engEffort)).filter((i) => i >= 0);
  const effortRange = efforts.length ? [EFFORT_ORDER[Math.min(...efforts)], EFFORT_ORDER[Math.max(...efforts)]] : null;
  const approvals = apis.filter((x) => x.approvalGate);
  const userSide = apis.filter((x) => x.userSideCost);

  // Data types the category touches, narrowed to the platforms that can read them.
  const hk = src.has("platform-store") && (p.has("ios") || p.has("android")) ? appType.hk : [];

  // Architecture: one line per layer, each pointing at the page that covers it.
  const arch = [];
  const layer = (title, hrefs) => {
    const links = hrefs.map(link).filter(Boolean);
    if (links.length) arch.push({ title, links });
  };
  if (p.has("ios") && src.has("platform-store")) layer("iOS app reads and writes HealthKit on the device", ["/integrate/healthkit", "/healthkit-queries"]);
  if (p.has("android") && src.has("platform-store")) layer("Android app reads and writes Health Connect on the device", ["/integrate/google-health-connect", "/health-connect-api"]);
  if (src.has("platform-store") && (p.has("ios") || p.has("android"))) layer("Phone-to-backend sync from the on-device store", ["/architecture/incremental-sync", "/architecture/background-sync"]);
  if (src.has("wearable-direct") || src.has("aggregator")) layer("Cloud ingestion: user authorization, webhooks and history backfill", ["/architecture/identity-and-account-linking", "/architecture/webhook-ingestion", "/architecture/historical-backfill"]);
  if (src.has("aggregator")) layer("Choosing an aggregator", ["/fitness-apis/health-data-aggregator-apis"]);
  if (src.has("ble")) layer("Bluetooth devices, read directly", ["/devices"]);
  if (src.size > 1 || src.has("wearable-direct") || src.has("aggregator")) layer("Normalize, deduplicate and bucket by the user's day", ["/architecture/normalize-wearable-data", "/architecture/deduplicate-health-data", "/architecture/timezones-and-day-boundaries"]);
  layer("Storage, gaps, deletion and export", ["/architecture/time-series-storage", "/architecture/missing-data-and-gaps", ...(a.f.includes("accounts") ? ["/architecture/data-deletion-and-export"] : [])]);
  if (a.f.includes("ai-motion")) layer("Camera motion tracking: build or buy, on device or in the cloud", ["/motion/build-vs-buy-ai-motion-tracking", "/motion/on-device-vs-cloud-pose-estimation"]);
  if (a.f.includes("llm-coach")) layer("AI coach", ["/ai/choosing-an-llm-for-fitness-apps", "/ai/llm-safety-fitness-advice", "/ai/ai-fitness-app-cost"]);
  if (a.f.includes("nutrition")) layer("Nutrition data", ["/fitness-apis/nutrition-apis"]);
  if (a.f.includes("exercise-content")) layer("Exercise content", ["/fitness-apis/exercise-database-apis"]);
  layer(`More for a ${appType.label.toLowerCase()}`, appType.pages);

  const wizard = planToWizard(a, appType);
  const compliance = assessCompliance(wizard);
  const stores = wizard.s;
  const storeItems = applicableStoreItems(bundle.storeItems, stores, traits);
  const edgeCases = bundle.edgeCases.filter((e) => e.when.some((w) => traits.includes(w)));

  return {
    answers: a,
    appType,
    guide: appType.guide ?? null,
    traits,
    apis,
    hk,
    notes,
    cost: { byDevCost, effortRange, approvals, userSide },
    arch,
    wizard,
    compliance,
    stores,
    storeItems,
    edgeCases,
    /** The plan includes camera motion tracking, so the funder's product is among the motion SDKs listed. */
    showsFunder: apis.some((x) => x.id === "kinestex"),
    links: {
      self: `/tools/build-plan${encodePlan(a)}`,
      wizard: `/tools/compliance-wizard${encodeWizard(wizard)}`,
      checklist: `/tools/store-submission-checklist${encodeChecklist({ stores, traits })}`,
    },
  };
}

/** Every page the architecture outline can link, besides each app type's own pages. The page checks each against routeLabel at build time. */
export const PLAN_PAGES = [
  "/integrate/healthkit",
  "/healthkit-queries",
  "/integrate/google-health-connect",
  "/health-connect-api",
  "/architecture/incremental-sync",
  "/architecture/background-sync",
  "/architecture/identity-and-account-linking",
  "/architecture/webhook-ingestion",
  "/architecture/historical-backfill",
  "/fitness-apis/health-data-aggregator-apis",
  "/devices",
  "/architecture/normalize-wearable-data",
  "/architecture/deduplicate-health-data",
  "/architecture/timezones-and-day-boundaries",
  "/architecture/time-series-storage",
  "/architecture/missing-data-and-gaps",
  "/architecture/data-deletion-and-export",
  "/motion/build-vs-buy-ai-motion-tracking",
  "/motion/on-device-vs-cloud-pose-estimation",
  "/ai/choosing-an-llm-for-fitness-apps",
  "/ai/llm-safety-fitness-advice",
  "/ai/ai-fitness-app-cost",
  "/fitness-apis/nutrition-apis",
  "/fitness-apis/exercise-database-apis",
];

export const EFFORT_NOTE = "Integration effort is this site's rough judgment, not a vendor fact: low is roughly days, medium roughly weeks, high roughly months.";

function costLines(plan, devCostLabels) {
  const out = [];
  if (!plan.apis.length) {
    out.push("No products are in this plan yet, so there is no cost shape to report.", "");
    return out;
  }
  out.push("No dollar figures, on purpose: the cost model this comes from records how each product bills, not what it charges today.", "");
  for (const g of plan.cost.byDevCost) out.push(`- **${devCostLabels[g.key] ?? g.key}:** ${g.items.map((x) => x.label).join(", ")}`);
  out.push("");
  if (plan.cost.effortRange) {
    const [lo, hi] = plan.cost.effortRange;
    out.push(`- **Integration effort per product:** from ${lo} to ${hi}. ${EFFORT_NOTE}`);
  }
  if (plan.cost.approvals.length) out.push(`- **Approval gates:** ${plan.cost.approvals.length} of ${plan.apis.length} products have one (listed in the integrations table).`);
  if (plan.cost.userSide.length) out.push(`- **End-user cost:** ${plan.cost.userSide.length} of ${plan.apis.length} products need something each user owns or pays for.`);
  out.push("");
  return out;
}

function apiTable(plan, origin) {
  if (!plan.apis.length) return ["No products match these answers.", ""];
  return [
    "| Product | Category | How it bills you | What each user needs | Approval gate | Effort (our judgment) | Source |",
    "|---|---|---|---|---|---|---|",
    ...plan.apis.map((x) => `| ${cell(x.label)}${x.inGuide ? " (in the build guide)" : ""} | ${cell(x.categoryLabel)} | ${cell(x.devCostLabel)} | ${cell(x.userSideCost ?? "Nothing recorded")} | ${cell(x.approvalGate ?? "None recorded")} | ${x.engEffort} | ${abs(origin, x.sourceHref)} |`),
    "",
  ];
}

function hkTable(plan) {
  if (!plan.hk.length) return [];
  return [
    "| HealthKit type | Aggregate with | Health Connect record |",
    "|---|---|---|",
    ...plan.hk.map((r) => `| \`${r.name}\` | ${r.aggregation ?? "not stated by Apple"} | ${r.android ? `\`${r.android}\`` : "no verified pair"} |`),
    "",
  ];
}

function funderLine(plan) {
  return plan.showsFunder
    ? ["Disclosure: KinesteX, one of the motion SDKs listed, makes the product that funds this site. It is listed because the plan includes camera motion tracking, not ranked, and the other options are listed beside it.", ""]
    : [];
}

function quoteBlock(q, sources) {
  const s = sources[q.source];
  return [`> ${md(q.quote)}`, `> — [${md(s.publisher)}, ${md(s.title)}](${s.url})`, ""];
}

/** The shareable spec: architecture outline, products, compliance, cost shape. */
export function planMarkdown(plan, bundle, { origin = "", date = "" } = {}) {
  const a = plan.answers;
  const out = [
    `# Build plan: ${plan.appType.label}`,
    "",
    `Generated${date ? ` on ${date}` : ""} at ${origin}${plan.links.self}. Every product field, rule and data type below comes from a page on aifitnessapi.com or a quoted primary source; nothing is ranked, and nothing here is legal advice.`,
    "",
    "## Answers",
    "",
    `- Platforms: ${a.p.map((x) => PLATFORM_LABELS[x]).join(", ") || "none"}`,
    `- Data sources: ${DATA_SOURCES.filter((s) => a.src.includes(s[0])).map((s) => s[1]).join("; ") || "none"}`,
    `- Features: ${FEATURES.filter((f) => a.f.includes(f.id)).map((f) => f.label).join("; ") || "none"}`,
    `- Offered or paid for by: ${(PAYERS.find((x) => x[0] === a.payer) ?? ["", a.payer])[1]}`,
    `- US users: ${a.us} · EU users: ${a.eu} · Washington State: ${a.wa}`,
    "",
  ];
  if (plan.guide) out.push(`Build guide for this app type: [${plan.guide.label}](${abs(origin, plan.guide.href)})`, "");
  for (const n of plan.notes) out.push(`**Note:** ${n}`, "");
  out.push("## Architecture outline", "");
  plan.arch.forEach((l, i) => out.push(`${i + 1}. ${l.title}: ${l.links.map((x) => `[${x.label}](${abs(origin, x.href)})`).join(", ")}`));
  out.push("");
  if (plan.hk.length) out.push("## Health data types this app type touches", "", ...hkTable(plan));
  out.push("## Products that fit", "", ...apiTable(plan, origin), ...funderLine(plan));
  out.push("## Cost shape", "", ...costLines(plan, bundle.devCostLabels ?? {}));
  out.push("## Compliance: what likely applies", "");
  const byId = Object.fromEntries(bundle.regimes.map((r) => [r.id, r]));
  for (const r of plan.compliance) {
    const g = byId[r.id];
    if (g) out.push(`- **${g.name}: ${STATUS_LABELS[r.status]}.** ${r.reason} ${abs(origin, g.page)}`);
  }
  out.push("", `Quoted rules and the full reasoning: ${origin}${plan.links.wizard}`, "");
  out.push("## Store submission", "", `${plan.storeItems.length} checklist items apply to this plan (${plan.stores.map((s) => STORE_LABELS[s]).join(" and ") || "no store chosen"}): ${origin}${plan.links.checklist}`, "");
  return out.join("\n");
}

/** The PRD template: the spec's facts in PRD sections, with TODOs for what only the team knows. */
export function prdMarkdown(plan, bundle, { origin = "", date = "" } = {}) {
  const a = plan.answers;
  const src = bundle.sources;
  const byId = Object.fromEntries(bundle.regimes.map((r) => [r.id, r]));
  const out = [
    `# PRD: ${plan.appType.label} (draft)`,
    "",
    `Template generated${date ? ` on ${date}` : ""} at ${origin}${plan.links.self}. Sections marked TODO are yours; everything else is filled from aifitnessapi.com pages and the primary sources they quote, linked inline. Not legal advice.`,
    "",
    "## 1. Problem and users",
    "",
    "- TODO: the problem, in one sentence a user would say.",
    "- TODO: the primary user and the moment they open the app.",
    `- Offered or paid for by: ${(PAYERS.find((x) => x[0] === a.payer) ?? ["", a.payer])[1]}.`,
    "",
    "## 2. Goals and non-goals",
    "",
    "- TODO: the one metric this release moves.",
    "- TODO: what this release will not do.",
    "",
    "## 3. Platforms and scope",
    "",
    `- Platforms: ${a.p.map((x) => PLATFORM_LABELS[x]).join(", ") || "TODO"}.`,
    ...FEATURES.filter((f) => a.f.includes(f.id)).map((f) => `- Feature: ${f.label}.`),
    "- TODO: the user stories for each feature, with acceptance criteria.",
    "",
  ];
  if (plan.guide) out.push(`Reference: [${plan.guide.label}](${abs(origin, plan.guide.href)}).`, "");
  for (const n of plan.notes) out.push(`**Note:** ${n}`, "");

  out.push("## 4. Data and permissions", "");
  if (plan.hk.length) {
    out.push("Data types the build guide's stack reads for this app type (aggregation is Apple's own wording, Health Connect records only where both platforms' documentation pairs them):", "", ...hkTable(plan));
  }
  out.push(`- Data sources: ${DATA_SOURCES.filter((s) => a.src.includes(s[0])).map((s) => s[1]).join("; ") || "TODO"}.`);
  out.push("- TODO: for each type, read, write or both, and the feature that needs it. Both stores ask you to request only what a feature uses:", "");
  const minimum = bundle.storeItems.filter((i) => (i.id === "apple-data-minimization" && plan.stores.includes("apple")) || (i.id === "google-hc-minimum-scope" && plan.traits.includes("health-connect")));
  for (const i of minimum) out.push(...quoteBlock(i, src));

  out.push("## 5. Integrations", "", ...apiTable(plan, origin), ...funderLine(plan));

  out.push("## 6. Edge cases the platforms document", "");
  if (plan.edgeCases.length) {
    for (const e of plan.edgeCases) {
      out.push(`### ${e.title}`, "", ...quoteBlock(e, src), `What to do about it: ${abs(origin, e.page)}`, "");
    }
  } else out.push("None of the documented platform edge cases in this template apply to these answers.", "");
  out.push("- TODO: product edge cases (no data yet, a user who revokes access, a second device).", "");

  out.push("## 7. Compliance requirements", "", "A routing from the answers above, not a legal conclusion; confirm with a qualified professional.", "");
  for (const r of plan.compliance) {
    const g = byId[r.id];
    if (!g) continue;
    out.push(`### ${g.name}: ${STATUS_LABELS[r.status]}`, "", r.reason, "", ...quoteBlock(g.quotes[0], src), `Explained: ${abs(origin, g.page)}`, "");
  }
  out.push(`All quoted rules: ${origin}${plan.links.wizard}`, "");

  out.push("## 8. Store review requirements", "");
  if (plan.storeItems.length) {
    for (const i of plan.storeItems) out.push(`- [ ] **${md(i.title)}** (${STORE_LABELS[i.store]} ${md(i.section)}): "${md(i.quote)}" [source](${src[i.source].url})`);
  } else out.push("No store chosen.");
  out.push("", `Checklist with progress tracking: ${origin}${plan.links.checklist}`, "");

  out.push("## 9. Cost structure", "", ...costLines(plan, bundle.devCostLabels ?? {}));

  out.push("## 10. Open questions", "", "- TODO: anything the team has not decided.", "- Prices: none are in this document. Get a current quote from each vendor marked contact sales or usage-based before you budget.", "");

  out.push("## Sources", "");
  const used = new Set([...plan.storeItems.map((i) => i.source), ...plan.edgeCases.map((e) => e.source), ...plan.compliance.flatMap((r) => (byId[r.id] ? [byId[r.id].quotes[0].source] : []))]);
  for (const key of Object.keys(src)) if (used.has(key)) out.push(`- ${src[key].publisher}, ${src[key].title}: ${src[key].url}`);
  out.push("");
  return out.join("\n");
}
