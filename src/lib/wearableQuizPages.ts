import { COST_ITEMS, DEV_COST_LABELS, type CostItem } from "@/data/costModel";
import { APIS_PATH, API_ENTRIES } from "@/data/apis";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import { BT_GATT_SOURCE, BT_GATT_TOTALS } from "@/data/bluetoothGatt";
import { COVERAGE_VENDORS, pushes } from "@/lib/vendorCoverage.mjs";
import { FITBIT_TURNED_OFF } from "@/lib/ghapiCoverage";
import { GHAPI_PATHS } from "@/data/ghapiPages";
import { ALL_TOOLS as TOOLS } from "@/lib/toolRegistry";
import { OUTCOMES, QUESTIONS, QUIZ_PATH, type Outcome } from "@/lib/wearableQuiz.mjs";

/**
 * What /quiz/which-wearable-api and its eight result pages say
 * (ops/VIRAL-20-2026-11-06.md item 6). The decision is src/lib/wearableQuiz.mjs;
 * this module is the copy around it.
 *
 * The result pages add no facts. Every product line is read from a module the
 * site already sources: the cost model (src/data/costModel.ts, each field
 * backed by a sentence published on the linked page), the coverage matrix's
 * delivery quotes (src/lib/vendorCoverage.mjs), the research-platform matrix,
 * the Bluetooth SIG dataset and the tool registry. The "fits when" lines are
 * this site's judgment and are labeled as such on the page. Products are
 * listed alphabetically: an outcome is an approach, never a product verdict.
 */

export { QUIZ_PATH };
export const QUIZ_UPDATED = "2026-11-06";
/** The page title, absolute (the layout suffix is not appended). */
export const QUIZ_TITLE = "Which Wearable API Should You Use? The 8-Question Quiz";
export const QUIZ_H1 = "Which wearable API should you use?";
export const QUIZ_DESCRIPTION =
  "Eight questions on platform, devices, data depth, webhooks, budget, compliance and team decide how your app should get wearable data. One sourced result.";
export const QUIZ_PRIMARY_QUERY = "which wearable API should I use";

export type QuizProduct = {
  name: string;
  /** This site's page for the product (directory entry or guide). */
  href: string;
  /** Sourced sentences, each from the page `source` names. */
  facts: string[];
  source: { href: string; label: string };
  firstParty?: boolean;
};

export type QuizOutcomePage = {
  slug: Outcome;
  /** Short name, for cards, titles and share text. */
  label: string;
  h1: string;
  title: string;
  description: string;
  /** One sentence, the result itself. */
  verdict: string;
  /** This site's judgment of when the approach fits (labeled on the page). */
  fits: string[];
  /** The trade-offs to check before committing (judgment, linked). */
  watch: string[];
  products: QuizProduct[];
  productsLead: string;
  readNext: { href: string; label: string }[];
  alternatives: Outcome[];
  firstParty: boolean;
};

export const resultPath = (slug: string) => `${QUIZ_PATH}/${slug}`;

const byId = new Map(COST_ITEMS.map((i) => [i.id, i]));
const directoryIds = new Set(API_ENTRIES.map((e) => e.id));

function costProduct(id: string, opts: { name?: string; href?: string } = {}): QuizProduct {
  const i = byId.get(id) as CostItem | undefined;
  if (!i) throw new Error(`wearableQuizPages: no cost-model item ${id}`);
  const facts = [i.notes];
  if (i.approvalGate) facts.push(`Before you ship: ${i.approvalGate}`);
  if (i.userSideCost) facts.push(`What each user needs: ${i.userSideCost}`);
  facts.push(`Cost model: ${DEV_COST_LABELS[i.devCost]}.`);
  return {
    name: opts.name ?? i.label,
    href: opts.href ?? (directoryIds.has(id) ? `${APIS_PATH}/${id}` : i.sourceHref),
    facts,
    source: { href: i.sourceHref, label: "source page" },
    firstParty: id === "kinestex",
  };
}

const alpha = (a: QuizProduct, b: QuizProduct) => a.name.localeCompare(b.name, "en");

function cloudVendors(): QuizProduct[] {
  return COVERAGE_VENDORS.filter((v) => v.kind === "cloud").map((v) => ({
    name: v.name,
    href: v.guide,
    facts: [
      pushes(v)
        ? "Documents a webhook or push delivery in the pages the coverage matrix read."
        : "No webhook or push delivery documented in the pages the coverage matrix read: you poll.",
    ],
    source: { href: `/tools/api-coverage-matrix?v=${v.id}`, label: "coverage matrix" },
  }));
}

function directProducts(): QuizProduct[] {
  const cost = ["garmin", "oura", "polar", "strava", "whoop"].map((id) => costProduct(id));
  const cloud = cloudVendors();
  // A vendor in both modules gets one card: the cost model's facts plus the delivery line.
  for (const c of cost) {
    const match = cloud.find((v) => v.name.split(" ")[0].toLowerCase() === c.name.split(" ")[0].toLowerCase());
    if (match) {
      c.facts.push(match.facts[0]);
      cloud.splice(cloud.indexOf(match), 1);
    }
  }
  const google: QuizProduct = {
    name: "Google Health API (Fitbit's successor)",
    href: GHAPI_PATHS.hub,
    facts: [`The Fitbit Web API: ${FITBIT_TURNED_OFF.reason}`],
    source: { href: GHAPI_PATHS.hub, label: "Google Health API reference" },
  };
  return [...cost, ...cloud, google].sort(alpha);
}

function researchProducts(): QuizProduct[] {
  return RESEARCH_PLATFORM_MATRIX.rows
    .map((r) => {
      const facts: string[] = [];
      const devices = r.cells.devices;
      const pricing = r.cells.pricing;
      if (devices && devices.value === "yes") facts.push(`Devices: ${devices.text}.`);
      if (pricing && pricing.value === "yes") facts.push(`Pricing: ${pricing.text}.`);
      if (!facts.length) facts.push("See the chooser for what its pages state.");
      return {
        name: r.name,
        href: `/tools/research-platform-chooser`,
        facts,
        source: { href: RESEARCH_PLATFORM_MATRIX.roundup.href, label: RESEARCH_PLATFORM_MATRIX.roundup.label },
      };
    })
    .sort(alpha);
}

function bleProducts(): QuizProduct[] {
  const tools = ["/tools/heart-rate-lab", "/tools/ftms-lab", "/tools/cycling-power-lab", "/tools/ble-gatt-explorer"];
  return tools.map((p) => {
    const t = TOOLS.find((x) => x.path === p);
    if (!t) throw new Error(`wearableQuizPages: no tool ${p}`);
    return { name: t.name, href: t.path, facts: [t.blurb], source: { href: t.path, label: "the tool" } };
  });
}

const L = {
  hkVsHc: { href: "/fitness-apis/apple-healthkit-vs-google-health-connect", label: "HealthKit vs Health Connect" },
  hk: { href: "/integrate/healthkit", label: "Integrating HealthKit" },
  hc: { href: "/integrate/google-health-connect", label: "Integrating Health Connect" },
  matrix: { href: "/matrix", label: "HealthKit to Health Connect type matrix" },
  wearables: { href: "/fitness-apis/wearable-data-apis", label: "Wearable data APIs compared" },
  aggregators: { href: "/fitness-apis/health-data-aggregator-apis", label: "Health-data aggregator APIs compared" },
  aggPricing: { href: "/pricing/health-data-aggregator-pricing", label: "Aggregator pricing" },
  coverage: { href: "/tools/api-coverage-matrix", label: "Wearable API coverage matrix" },
  rates: { href: "/tools/rate-limit-calculator", label: "Rate limit calculator" },
  webhooks: { href: "/webhooks", label: "Wearable webhook payloads" },
  compliance: { href: "/tools/compliance-wizard", label: "Health-app compliance wizard" },
  bt: { href: "/bluetooth-fitness", label: "Bluetooth GATT reference for fitness devices" },
  devices: { href: "/devices", label: "Connected-device guides" },
  research: { href: "/tools/research-platform-chooser", label: "Research platform chooser" },
  researchRoundup: { href: RESEARCH_PLATFORM_MATRIX.roundup.href, label: RESEARCH_PLATFORM_MATRIX.roundup.label },
  motion: { href: "/fitness-apis/ai-workout-tracking-apis", label: "AI workout tracking APIs compared" },
  buildBuy: { href: "/motion/build-vs-buy-ai-motion-tracking", label: "Build vs buy camera motion tracking" },
  poseModels: { href: "/motion/pose-estimation-models-compared", label: "Pose estimation models compared" },
  ghapi: { href: GHAPI_PATHS.hub, label: "Google Health API reference" },
  picker: { href: "/picker", label: "Fitness API picker (all API categories)" },
};

const storeFits = [
  "Your users' data already lands in the phone's health store, and the app is the one reading it.",
  "You would rather not run servers that hold health data.",
  "You want no per-user fee for the data itself.",
];

export function quizOutcomePages(): QuizOutcomePage[] {
  const pages: QuizOutcomePage[] = [
    {
      slug: "healthkit",
      label: "Apple HealthKit",
      h1: "Your result: read Apple HealthKit on the iPhone",
      title: "Quiz Result: Apple HealthKit",
      description: "Your answers point to Apple HealthKit: read Apple Watch and iPhone data on the device. What this site's sources say, and what to read next.",
      verdict: "Your answers point to Apple HealthKit: an iPhone app reading the user's health store on the device.",
      fits: storeFits,
      watch: [
        "Anything that has to reach your backend is yours to upload from the app; there is no server-side pull.",
        "Android users, if you ever add them, need Health Connect as a second integration.",
      ],
      products: [costProduct("healthkit")],
      productsLead: "What this site's sourced cost model says about it:",
      readNext: [L.hk, L.hkVsHc, L.matrix, L.compliance],
      alternatives: ["healthkit-and-health-connect", "aggregator", "direct-wearable-apis"],
      firstParty: false,
    },
    {
      slug: "health-connect",
      label: "Google Health Connect",
      h1: "Your result: read Health Connect on Android",
      title: "Quiz Result: Google Health Connect",
      description: "Your answers point to Health Connect: read Android, Wear OS and Samsung data on the device. What this site's sources say, and what to read next.",
      verdict: "Your answers point to Health Connect: an Android app reading the on-device health store.",
      fits: storeFits,
      watch: [
        "Anything that has to reach your backend is yours to upload from the app.",
        "iPhone users, if you add them, need HealthKit as a second integration.",
      ],
      products: [costProduct("health-connect")],
      productsLead: "What this site's sourced cost model says about it:",
      readNext: [L.hc, L.hkVsHc, L.matrix, L.compliance],
      alternatives: ["healthkit-and-health-connect", "aggregator", "direct-wearable-apis"],
      firstParty: false,
    },
    {
      slug: "healthkit-and-health-connect",
      label: "HealthKit and Health Connect",
      h1: "Your result: HealthKit on iPhone, Health Connect on Android",
      title: "Quiz Result: HealthKit and Health Connect",
      description: "Your answers point to both platform stores: HealthKit in the iPhone app, Health Connect in the Android app. Sourced notes and what to read next.",
      verdict: "Your answers point to the two platform health stores, one per app: HealthKit on iPhone and Health Connect on Android.",
      fits: [...storeFits, "You ship both mobile apps anyway, so a reader in each is not extra architecture."],
      watch: [
        "Two integrations with different type names and permissions: map them once, in one place.",
        "Anything that has to reach your backend is yours to upload from each app.",
      ],
      products: [costProduct("healthkit"), costProduct("health-connect")],
      productsLead: "What this site's sourced cost model says about each:",
      readNext: [L.hkVsHc, L.matrix, L.hk, L.hc],
      alternatives: ["aggregator", "direct-wearable-apis", "healthkit"],
      firstParty: false,
    },
    {
      slug: "direct-wearable-apis",
      label: "The device makers' own APIs",
      h1: "Your result: integrate the device makers' own APIs",
      title: "Quiz Result: Direct Wearable APIs",
      description: "Your answers point to the device makers' own cloud APIs (Garmin, Oura, WHOOP, Polar and others): approvals, webhooks and sourced notes for each.",
      verdict: "Your answers point to integrating each device maker's own cloud API, one OAuth integration per brand.",
      fits: [
        "You need one or two brands, not every brand.",
        "You want provider-specific fields at the resolution the maker offers.",
        "You have backend engineers to own OAuth tokens, webhooks and each vendor's terms.",
      ],
      watch: [
        "Each maker has its own developer approval, and several cap an unapproved app at a handful of users.",
        "Webhook support differs by vendor and by data type; the coverage matrix shows which push and which you poll.",
      ],
      products: directProducts(),
      productsLead: "The cloud APIs this site's coverage matrix and cost model cover, alphabetically:",
      readNext: [L.wearables, L.coverage, L.rates, L.webhooks],
      alternatives: ["aggregator", "healthkit-and-health-connect", "research-platform"],
      firstParty: false,
    },
    {
      slug: "aggregator",
      label: "A health-data aggregator",
      h1: "Your result: a health-data aggregator",
      title: "Quiz Result: A Health-Data Aggregator",
      description: "Your answers point to a health-data aggregator: one integration for many wearable brands. Junction, Rook, Spike and Terra listed neutrally, with sources.",
      verdict: "Your answers point to a health-data aggregator: one integration that connects many wearable brands for you.",
      fits: [
        "Your users wear many different brands.",
        "You want one integration and one webhook format instead of several.",
        "A usage-based bill is acceptable in exchange for less integration work.",
      ],
      watch: [
        "Some brands still need your own developer account or a special setup at the aggregator; check the brands you need.",
        "Pricing models differ (per user, per connection, per plan): model your own numbers on the pricing page.",
      ],
      products: ["junction", "rook", "spike", "terra"].map((id) => costProduct(id)).sort(alpha),
      productsLead: "The aggregators this site's sourced cost model covers, alphabetically. None is ranked:",
      readNext: [L.aggregators, L.aggPricing, L.coverage, L.webhooks],
      alternatives: ["direct-wearable-apis", "healthkit-and-health-connect", "research-platform"],
      firstParty: false,
    },
    {
      slug: "bluetooth-direct",
      label: "Bluetooth sensors, read directly",
      h1: "Your result: read Bluetooth sensors directly",
      title: "Quiz Result: Read Bluetooth Sensors Directly",
      description: "Your answers point to reading heart-rate straps, bikes and treadmills over Bluetooth GATT in your app. The SIG reference and four test tools.",
      verdict: "Your answers point to reading the sensors themselves over Bluetooth Low Energy, using the Bluetooth SIG's standard GATT profiles.",
      fits: [
        "Your users have heart-rate straps, power meters, smart trainers, rowers or treadmills.",
        "You want live readings during a session, not a summary hours later.",
        "You want no vendor account or per-user fee between you and the device.",
      ],
      watch: [
        "You own pairing, reconnection and every device's quirks.",
        "Summaries over days still need a health store or a cloud API next to the live readings.",
      ],
      products: bleProducts(),
      productsLead: `This site reads the Bluetooth SIG's public repository (${BT_GATT_TOTALS.characteristicUuids} characteristic UUIDs and ${BT_GATT_TOTALS.gssFiles} structure files at commit ${BT_GATT_SOURCE.commit.slice(0, 7)}, ${BT_GATT_SOURCE.commitDate}). The free tools to test a device against it:`,
      readNext: [L.bt, L.devices, L.hkVsHc],
      alternatives: ["healthkit-and-health-connect", "direct-wearable-apis", "camera-motion"],
      firstParty: false,
    },
    {
      slug: "research-platform",
      label: "A wearable research platform",
      h1: "Your result: a wearable research data platform",
      title: "Quiz Result: A Wearable Research Platform",
      description: "Your answers point to a research data platform built for studies: participant management and exports. Fitabase, Labfront, Empatica and Ametris.",
      verdict: "Your answers point to a research data platform: tools built for studies, with participant management and exports.",
      fits: [
        "You run a study under an IRB or ethics board, not a consumer product.",
        "You need per-participant exports more than a polished app.",
      ],
      watch: [
        "Device support differs from platform to platform: compare the devices line for each below.",
        "Pricing differs too, and the chooser shows only what each platform's pages state.",
      ],
      products: researchProducts(),
      productsLead: "The platforms this site's research chooser covers, alphabetically, each from its quoted pages:",
      readNext: [L.research, L.researchRoundup, L.compliance],
      alternatives: ["direct-wearable-apis", "aggregator", "bluetooth-direct"],
      firstParty: false,
    },
    {
      slug: "camera-motion",
      label: "Camera pose tracking",
      h1: "Your result: track movement with the camera",
      title: "Quiz Result: Camera Pose Tracking",
      description: "Your answers point to camera-based pose tracking: open pose models to build on, or motion SDKs. Six options listed alphabetically, with sources.",
      verdict: "Your answers point to camera-based pose tracking: reps, form and joint angles come from the camera, not a wearable.",
      fits: [
        "You need movement itself (reps, form, range of motion), which wearable summaries do not carry.",
        "Your users have a phone or laptop camera and no wearable.",
      ],
      watch: [
        "An open pose model gives you keypoints; rep logic, form rules and per-exercise tuning are yours to build.",
        "A motion SDK does more of that for you, under its own pricing and terms.",
      ],
      products: ["apple-vision", "kinestex", "mediapipe", "movenet", "quickpose", "sency"].map((id) => costProduct(id)).sort(alpha),
      productsLead:
        "Pose models (free, you build the rest) and motion SDKs (sold), from this site's sourced cost model, alphabetically. KinesteX funds this site; it is listed on the same terms as the others:",
      readNext: [L.motion, L.buildBuy, L.poseModels],
      alternatives: ["bluetooth-direct", "healthkit-and-health-connect", "direct-wearable-apis"],
      firstParty: true,
    },
  ];
  // The module and the logic must agree on the outcome set, in order.
  if (pages.map((p) => p.slug).join() !== OUTCOMES.join()) throw new Error("wearableQuizPages: outcomes out of step with wearableQuiz.mjs");
  return pages;
}

export function quizOutcomePage(slug: string): QuizOutcomePage | undefined {
  return quizOutcomePages().find((p) => p.slug === slug);
}

/** One line for the share intents. */
export function shareText(p: QuizOutcomePage): string {
  return `My "which wearable API?" quiz result: ${p.label}. Eight questions, sourced answer:`;
}

/** The answer capsule, shared by the page and its markdown mirror. */
export function quizCapsule(): string {
  return `Which wearable API you should use depends less on the API than on eight facts about your product: where it runs, what your users wear, how detailed the data has to be, whether it must reach your backend by webhook, how you pay, which rules apply, who builds it and when it has to work. This quiz asks those eight questions and lands on one of eight approaches: Apple HealthKit, Health Connect, both platform stores, the device makers' own APIs, a health-data aggregator, Bluetooth sensors read directly, a research data platform or camera pose tracking. Each result page lists the products of that approach alphabetically with what this site's pages source about them; no product is ranked.`;
}

export const QUIZ_FAQS: { q: string; a: string }[] = [
  {
    q: "How is this quiz different from the fitness API picker?",
    a: "The picker routes any fitness project (exercise content, nutrition, motion, wearables) to the roundup to read, from three questions. This quiz answers one narrower question, how your app should get wearable and health data, from eight, and lands on one of eight approaches with the products of that approach listed.",
  },
  {
    q: "Does the quiz recommend a specific vendor?",
    a: "No. Each result is an approach: the platform stores, the device makers' own APIs, an aggregator, Bluetooth sensors, a research platform or camera pose tracking. The products under it are listed alphabetically with the facts this site's pages source about them, and none is ranked.",
  },
  {
    q: "How does the quiz decide between an aggregator and direct APIs?",
    a: "Camera or movement answers, a research study and Bluetooth sensors each decide on their own. Otherwise every answer adds or removes points for three approaches (platform stores, direct APIs, an aggregator) and the highest total wins, ties going to the platform stores, then direct APIs. The result lists the answers that pushed it there, and the rules are printed on this page.",
  },
  {
    q: "Are my quiz answers stored or sent anywhere?",
    a: "No. The quiz runs in your browser. Your answers are kept only in the page address as an eight-digit code so a link reproduces the result; nothing is stored on a server. A click on a share button counts as a fixed event name, never with your answers.",
  },
];

export { QUESTIONS };
