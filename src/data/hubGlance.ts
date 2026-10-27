import {
  COST_ITEMS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEV_COST_LABELS,
  type CostCategory,
  type CostItem,
} from "./costModel";
import { allSpokes } from "@/lib/clusterRegistry";
import type { ClusterEntry } from "@/lib/cluster";

/**
 * "At a glance" tables and direct Q&A for the four section hubs Bing ranks
 * (ops/SEO-10-2026-10-27.md #9): /fitness-apis, /pricing, /alternatives and
 * /compare.
 *
 * NOTHING in this file is a new fact. Every figure is read from one of two
 * places at build time, so it cannot drift from the page that holds it:
 *
 * - `COST_ITEMS` (src/data/costModel.ts), the provenance-tracked cost model,
 *   whose every non-judgement field already quotes a sentence on its
 *   `sourceHref` page;
 * - a released page's own answer capsule, quoted sentence by sentence.
 *
 * Every rendered value carries a `data-glance` key naming its source
 * (`cost:<id>:<field>` or `capsule:<path>`; a trailing `~` marks an excerpt
 * rather than the whole field), and scripts/qa.mjs re-reads the source module
 * and the built target page to hold the rendered text to it (HUB-GLANCE-*
 * gates). Each row or answer also links the page that holds its facts.
 *
 * The questions are worded after the long comparison queries Bing paired with
 * these hubs in data/gsc/bing-latest.json (28 days to 2026-10-24); each keeps
 * its query beside it. A question that another page already owns is not
 * answered here: it is a `route` item, rendered as a pointer to the owning
 * page and kept out of the hub's FAQPage, so the FAQ-uniqueness rule holds.
 */

export type HubPath = "/fitness-apis" | "/pricing" | "/alternatives" | "/compare";

/** One piece of rendered text. `source` set = a verified value; unset = connective wording. */
export type Seg = { text: string; source?: string; href?: string };
export type GlanceRow = { id: string; cells: Seg[][] };
export type HubGlance = {
  heading: string;
  intro: string;
  columns: string[];
  /** Category group header rows, keyed by the index of the first row in each group. */
  groups?: { at: number; label: string }[];
  rows: GlanceRow[];
  footnote: string;
};
/** One linked piece of an answer: its segments, then a link to the page holding them. */
export type QaPart = { segs: Seg[]; href: string; label: string };
export type HubQa = {
  id: string;
  q: string;
  /** The Bing query (data/gsc/bing-latest.json) the question is worded after. */
  bingQuery: string;
  /** answer = answered here and marked up; route = owned elsewhere, pointer only. */
  kind: "answer" | "route";
  parts: QaPart[];
};

// ─── sources ──────────────────────────────────────────────────────────────

const COST = new Map(COST_ITEMS.map((c) => [c.id, c]));
function cost(id: string): CostItem {
  const c = COST.get(id);
  if (!c) throw new Error(`hubGlance: no cost-model item "${id}"`);
  return c;
}

/** Released spoke by path; throws so a renamed or unreleased page fails the build. */
function page(path: string): ClusterEntry {
  const hit = allSpokes().find(({ basePath, entry }) => `${basePath}/${entry.slug}` === path);
  if (!hit) throw new Error(`hubGlance: ${path} is not a released page`);
  return hit.entry;
}
function released(path: string): boolean {
  return allSpokes().some(({ basePath, entry }) => `${basePath}/${entry.slug}` === path);
}

const ABBREV = /\b(?:e\.g|i\.e|vs|etc|approx|Inc|Ltd|No|St|U\.S|U\.K)\.$/;

/**
 * Split prose into sentences without breaking on "e.g.", "vs.", initials or
 * decimals. Used for excerpts only: the qa gate checks an excerpt against the
 * full source text, so a split in the wrong place shows up as a short quote,
 * never as a wrong one.
 */
export function sentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  const re = /[.!?]["”’)]*(?=\s+["“(]?[A-Z0-9$])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const end = m.index + m[0].length;
    const head = text.slice(start, end).trim();
    if (ABBREV.test(text.slice(0, m.index + 1)) || /\b[A-Z]\.$/.test(text.slice(0, m.index + 1))) continue;
    if (head.length < 25) continue;
    out.push(head);
    start = end;
  }
  const tail = text.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}
export function firstSentence(text: string): string {
  return sentences(text)[0] ?? text.trim();
}

// Segment builders. Each names its source so qa can hold it to the module.
const label = (c: CostItem): Seg => ({ text: c.label, source: `cost:${c.id}:label`, href: c.sourceHref });
const devCost = (c: CostItem): Seg => ({ text: DEV_COST_LABELS[c.devCost], source: `cost:${c.id}:devCost` });
const userSide = (c: CostItem): Seg => ({ text: c.userSideCost ?? "None documented.", source: `cost:${c.id}:userSideCost` });
const gate = (c: CostItem): Seg => ({ text: c.approvalGate ?? "None documented.", source: `cost:${c.id}:approvalGate` });
const note = (c: CostItem, i = 0): Seg => {
  const s = sentences(c.notes)[i];
  if (!s) throw new Error(`hubGlance: ${c.id} notes have no sentence ${i + 1}`);
  return { text: s, source: `cost:${c.id}:notes~` };
};
const capsule = (path: string, i = 0): Seg => {
  const s = sentences(page(path).answer)[i];
  if (!s) throw new Error(`hubGlance: ${path} capsule has no sentence ${i + 1}`);
  return { text: s, source: `capsule:${path}~` };
};
const t = (text: string): Seg => ({ text });

/** This site's funder is marked wherever it appears in a table (ops/GEO.md). */
const FIRST_PARTY = new Set(["kinestex"]);
const funderMark = (c: CostItem): Seg[] => (FIRST_PARTY.has(c.id) ? [t(" (funds this site)")] : []);

/** A product named with its billing label: "Oura Cloud API: Free". */
const billed = (c: CostItem): Seg[] => [label(c), ...funderMark(c), t(": "), devCost(c)];

/** A part made of one cost item's segments, linked to the page that holds them. */
function costPart(c: CostItem, segs: Seg[]): QaPart {
  return { segs, href: c.sourceHref, label: page(c.sourceHref).h1 };
}
/** A part quoting sentences of a page's capsule, linked to that page. */
function capsulePart(path: string, idx: number[] = [0]): QaPart {
  const segs = idx.flatMap((i, n) => [...(n ? [t(" ")] : []), capsule(path, i)]);
  return { segs, href: path, label: page(path).h1 };
}

/** Every product row: the cost model minus `llm-apis`, a category rather than a product (as in apis.ts). */
export const GLANCE_COST_ITEMS = COST_ITEMS.filter((c) => c.id !== "llm-apis");
const PRODUCTS = GLANCE_COST_ITEMS;

// ─── tables ───────────────────────────────────────────────────────────────

function pricingGlance(): HubGlance {
  const ordered = CATEGORY_ORDER.flatMap((cat) => PRODUCTS.filter((c) => c.category === cat));
  const groups: { at: number; label: string }[] = [];
  ordered.forEach((c, i) => {
    if (i === 0 || ordered[i - 1].category !== c.category) groups.push({ at: i, label: CATEGORY_LABELS[c.category] });
  });
  return {
    heading: "At a glance: how each API bills you, and what your users pay",
    intro:
      "Every product this site tracks, from its cost model. No dollar amounts by design: each name opens the page that quotes the vendor, and the pages below carry the dated figures.",
    columns: ["Product", "How it bills developers", "What each end user needs"],
    groups,
    rows: ordered.map((c) => ({
      id: `cost-${c.id}`,
      cells: [[label(c), ...funderMark(c)], [devCost(c)], [userSide(c)]],
    })),
    footnote: `${(Object.keys(DEV_COST_MEANING) as CostItem["devCost"][])
      .map((k) => `${DEV_COST_LABELS[k]}: ${DEV_COST_MEANING[k]}.`)
      .join(" ")} None documented: the site has not recorded one.`,
  };
}

/** Category → the page that compares that job's options. */
const JOB_GUIDE: Partial<Record<CostCategory, string>> = {
  "wearable-direct": "/fitness-apis/wearable-data-apis",
  aggregator: "/fitness-apis/health-data-aggregator-apis",
  "platform-store": "/fitness-apis/apple-healthkit-vs-google-health-connect",
  nutrition: "/fitness-apis/nutrition-apis",
  "exercise-content": "/fitness-apis/exercise-database-apis",
  "motion-sdk": "/fitness-apis/ai-workout-tracking-apis",
  "pose-model": "/motion/pose-estimation-models-compared",
};

function fitnessApisGlance(): HubGlance {
  const cats = CATEGORY_ORDER.filter((cat) => JOB_GUIDE[cat]);
  return {
    heading: "At a glance: every job, the products for it, and how each bills",
    intro:
      "From the site's cost model. Each product name opens the page that quotes its vendor; each job opens the comparison for that category.",
    columns: ["Job", "Products and how each bills developers"],
    rows: cats.map((cat) => {
      const guide = JOB_GUIDE[cat]!;
      const items = PRODUCTS.filter((c) => c.category === cat);
      return {
        id: `job-${cat}`,
        cells: [
          [{ text: CATEGORY_LABELS[cat], href: guide }],
          items.flatMap((c, i) => [...(i ? [t("; ")] : []), ...billed(c)]),
        ],
      };
    }),
    footnote:
      "Free means no fee is documented for calling it, not that nothing costs money: device ownership, memberships and approval gates are on the pricing hub.",
  };
}

/** Alternatives page for a cost-model product, if one is released. */
function alternativesFor(id: string): string | null {
  for (const slug of [`${id}-alternatives`, `${id}-api-alternatives`]) {
    if (released(`/alternatives/${slug}`)) return `/alternatives/${slug}`;
  }
  return null;
}

function alternativesGlance(): HubGlance {
  const rows = PRODUCTS.flatMap((c) => {
    const alt = alternativesFor(c.id);
    if (!alt) return [];
    return [
      {
        id: `leaving-${c.id}`,
        cells: [[label(c), ...funderMark(c)], [devCost(c)], [gate(c)], [{ text: page(alt).h1, href: alt }]],
      },
    ];
  });
  return {
    heading: "At a glance: what the API you are leaving charges and gates",
    intro:
      "Every product in the site's cost model that has an alternatives page. The billing and the gate before launch are usually why teams look around; each name opens the page that quotes its vendor.",
    columns: ["Leaving", "How it bills developers", "What gates launch", "Alternatives"],
    rows,
    footnote:
      "Pages for products outside the cost model, such as Google Fit, Human API and OpenPose, are in the lists below. None documented means the site has not recorded a gate.",
  };
}

/** Compare-slug side → cost-model id. Apple Watch data is read through HealthKit. */
const SIDE: Record<string, string> = {
  oura: "oura",
  whoop: "whoop",
  fitbit: "fitbit",
  strava: "strava",
  garmin: "garmin",
  "garmin-connect": "garmin",
  terra: "terra",
  rook: "rook",
  spike: "spike",
  nutritionix: "nutritionix",
  edamam: "edamam",
  exercisedb: "exercisedb",
  wger: "wger",
  kinestex: "kinestex",
  sency: "sency",
  quickpose: "quickpose",
  mediapipe: "mediapipe",
  movenet: "movenet",
  "usda-fooddata-central": "usda-fdc",
  "open-food-facts": "open-food-facts",
  "apple-watch": "healthkit",
};

function compareGlance(): HubGlance {
  const rows = allSpokes()
    .filter(({ basePath }) => basePath === "/compare")
    .flatMap(({ entry }) => {
      const [a, b] = entry.slug.split("-vs-");
      const ca = a && COST.get(SIDE[a] ?? "");
      const cb = b && COST.get(SIDE[b] ?? "");
      if (!ca || !cb) return [];
      return [
        {
          id: `pair-${entry.slug}`,
          cells: [[{ text: entry.h1, href: `/compare/${entry.slug}` }], billed(ca), billed(cb)],
        },
      ];
    });
  return {
    heading: "At a glance: how both sides of each head-to-head bill developers",
    intro:
      "Every comparison whose two products are both in the site's cost model. Each product name opens the page that quotes its vendor; the head-to-head weighs data, access and fit.",
    columns: ["Head-to-head", "First", "Second"],
    rows,
    footnote:
      "Apple Watch rows show Apple HealthKit, the on-device store an app reads Apple Watch data through. Comparisons with a product outside the cost model are listed below.",
  };
}

// ─── direct Q&A ───────────────────────────────────────────────────────────

function pricingQa(): HubQa[] {
  const agg = ["terra", "junction", "rook", "spike"].map(cost);
  return [
    {
      id: "ask-wearable-api-fees",
      q: "Do the Oura, WHOOP, Garmin, Fitbit and Strava APIs cost developers anything?",
      bingQuery: "oura whoop garmin myfitnesspal api official pricing",
      kind: "answer",
      parts: ["oura", "whoop", "garmin", "fitbit", "strava"].map((id) => {
        const c = cost(id);
        return costPart(c, [label(c), t(" — "), devCost(c), t(". "), note(c, 0)]);
      }),
    },
    {
      id: "ask-aggregator-pricing",
      q: "How do Terra, Junction, Rook and Spike price their health-data APIs?",
      bingQuery: "terra api vs junction vital vs rook health data aggregator pricing apple health health connect sdk",
      kind: "answer",
      parts: [
        capsulePart("/pricing/health-data-aggregator-pricing"),
        ...agg.map((c) => costPart(c, [label(c), t(": "), note(c, c.id === "spike" ? 1 : 0)])),
      ],
    },
    {
      id: "ask-exercise-api-cost",
      q: "What does an exercise database API with animations cost?",
      bingQuery: "fitness exercise database api subscription animations pricing 2026",
      kind: "route",
      parts: [capsulePart("/pricing/exercise-database-api-pricing")],
    },
  ];
}

function fitnessApisQa(): HubQa[] {
  const wearables = PRODUCTS.filter((c) => c.category === "wearable-direct");
  return [
    {
      id: "ask-aggregator-setup",
      q: "Which wearables need extra developer setup on Terra, Rook and Spike?",
      bingQuery: "wearable data aggregator api comparison terra rook spike vital",
      kind: "answer",
      parts: [
        costPart(cost("terra"), [label(cost("terra")), t(": "), gate(cost("terra"))]),
        costPart(cost("rook"), [label(cost("rook")), t(": "), gate(cost("rook")), t(" "), note(cost("rook"), 1)]),
        costPart(cost("spike"), [label(cost("spike")), t(": "), gate(cost("spike"))]),
      ],
    },
    {
      id: "ask-platform-store-requirements",
      q: "What do Apple HealthKit and Google Health Connect require before an app can launch?",
      bingQuery: "apple healthkit google health connect fitness app integration requirements",
      kind: "answer",
      parts: ["healthkit", "health-connect"].map((id) => {
        const c = cost(id);
        return costPart(c, [label(c), t(" — "), devCost(c), t(". "), gate(c), t(" "), note(c, 0)]);
      }),
    },
    {
      id: "ask-wearables-with-apis",
      q: "Which wearables expose an API a third-party app can integrate directly?",
      bingQuery: "find me the top fitness wearables that expose api endpoints and i can easily integrate",
      kind: "answer",
      parts: [
        ...wearables.map((c) => costPart(c, [label(c), t(" — "), devCost(c), t(". Before launch: "), gate(c)])),
        {
          segs: [t("Those are the wearables in this site's cost model; the integration guides walk through more providers, one page each.")],
          href: "/integrate",
          label: "Integration guides",
        },
      ],
    },
  ];
}

function alternativesQa(): HubQa[] {
  return [
    {
      id: "ask-free-nutrition-alternatives",
      q: "Are there free alternatives to the Nutritionix and Edamam APIs?",
      bingQuery: "free open source nutrition macro api alternatives edamam api ninjas",
      kind: "answer",
      parts: [
        ...["nutritionix", "edamam"].map((id) => {
          const c = cost(id);
          return costPart(c, [label(c), t(" — "), devCost(c), t(". "), note(c, 0)]);
        }),
        ...["usda-fdc", "open-food-facts"].map((id) => {
          const c = cost(id);
          return costPart(c, [label(c), t(" — "), devCost(c), t(". "), note(c, 0)]);
        }),
      ],
    },
    {
      id: "ask-fitbit-replacement",
      q: "What replaces the Fitbit Web API?",
      bingQuery: "fitbit api end of life",
      kind: "route",
      parts: [capsulePart("/migrate/fitbit-web-api-to-google-health")],
    },
    {
      id: "ask-garmin-without-approval",
      q: "Can I use Garmin's API for my own data without the developer program?",
      bingQuery: "garmin api for personal use",
      kind: "route",
      parts: [capsulePart("/fix/garmin-api-personal-use")],
    },
    {
      id: "ask-free-exercise-db",
      q: "Is free-exercise-db a free alternative to ExerciseDB?",
      bingQuery: "github yuhonas free-exercise-db exercisedb api comparison",
      kind: "route",
      parts: [capsulePart("/compare/exercisedb-vs-free-exercise-db")],
    },
  ];
}

function compareQa(): HubQa[] {
  return [
    {
      id: "ask-terra-rook-spike-junction",
      q: "Terra, Junction, Rook or Spike: how do the aggregators differ head to head?",
      bingQuery: "terra api vs junction vital vs rook health data aggregator pricing apple health health connect sdk",
      kind: "answer",
      parts: [
        capsulePart("/fitness-apis/terra-vs-vital"),
        capsulePart("/compare/terra-vs-rook"),
        capsulePart("/compare/terra-vs-spike"),
        capsulePart("/compare/rook-vs-spike"),
      ],
    },
    {
      id: "ask-sleep-recovery-apis",
      q: "Oura, WHOOP or Fitbit: which API suits sleep and recovery data?",
      bingQuery: "sleep api services fitbit oura ring whoop health data",
      kind: "answer",
      parts: [capsulePart("/compare/oura-vs-whoop"), capsulePart("/compare/fitbit-vs-oura")],
    },
    {
      id: "ask-pose-model-three-way",
      q: "MediaPipe, MoveNet or YOLO Pose: which pose model fits a fitness app?",
      bingQuery: "mediapipe pose vs movenet vs blazepose fitness tracking accuracy",
      kind: "answer",
      parts: [capsulePart("/compare/mediapipe-vs-movenet", [0, 1]), capsulePart("/compare/mediapipe-vs-yolo-pose", [0, 1])],
    },
    {
      id: "ask-nutritionix-edamam-billing",
      q: "Nutritionix or Edamam: how does each bill developers?",
      bingQuery: "nutritionix edamam chomp nutrition database api pricing developer",
      kind: "answer",
      parts: ["nutritionix", "edamam"].map((id) => {
        const c = cost(id);
        return costPart(c, [label(c), t(" — "), devCost(c), t(". "), note(c, 0), t(" "), note(c, 1)]);
      }),
    },
  ];
}

// ─── public API ───────────────────────────────────────────────────────────

const GLANCE: Record<HubPath, () => HubGlance> = {
  "/pricing": pricingGlance,
  "/fitness-apis": fitnessApisGlance,
  "/alternatives": alternativesGlance,
  "/compare": compareGlance,
};
const QA: Record<HubPath, () => HubQa[]> = {
  "/pricing": pricingQa,
  "/fitness-apis": fitnessApisQa,
  "/alternatives": alternativesQa,
  "/compare": compareQa,
};

export const GLANCE_HUBS = Object.keys(GLANCE) as HubPath[];

/** The hubs' own H1s, for the machine surfaces that list them. */
export const HUB_NAMES: Record<HubPath, string> = {
  "/fitness-apis": "Best Fitness & Workout APIs for Builders",
  "/pricing": "Fitness & Health API Pricing",
  "/alternatives": "Fitness & Health API Alternatives",
  "/compare": "Fitness & Health API Comparisons",
};

/** What each billing label means, in the cost model's own definitions (costModel.ts DevCost). */
export const DEV_COST_MEANING: Record<CostItem["devCost"], string> = {
  free: "no fee documented for calling it",
  "free-tier-then-paid": "a real free entry point that runs out",
  "usage-based": "the bill scales with users, events, or tokens",
  "contact-sales": "no public price; you have to ask for a quote",
};

export function hubGlance(hub: HubPath): HubGlance {
  return GLANCE[hub]();
}
export function hubQa(hub: HubPath): HubQa[] {
  return QA[hub]();
}
export function isGlanceHub(path: string): path is HubPath {
  return (GLANCE_HUBS as string[]).includes(path);
}

/** Plain text of segments, for JSON-LD, markdown and the machine surfaces. */
export function segText(segs: Seg[]): string {
  return segs.map((s) => s.text).join("");
}
/** An answer's plain text: its parts, one after another. */
export function qaText(qa: HubQa): string {
  return qa.parts.map((p) => segText(p.segs).trim()).join(" ");
}

/** FAQPage Question nodes for a hub's answered items (routes stay out). */
export function hubQaJsonLd(hub: HubPath, url: string) {
  return hubQa(hub)
    .filter((q) => q.kind === "answer")
    .map((q) => ({
      "@type": "Question",
      "@id": `${url}#${q.id}`,
      url: `${url}#${q.id}`,
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: qaText(q), url: `${url}#${q.id}` },
    }));
}

/** Markdown for the hub's .md mirror: the table as GFM, then the Q&A. */
export function hubGlanceMarkdown(hub: HubPath, abs: (p: string) => string): string[] {
  const g = hubGlance(hub);
  const cell = (segs: Seg[]) =>
    segs
      .map((s) => (s.href ? `[${s.text}](${abs(s.href)})` : s.text))
      .join("")
      .replace(/\|/g, "\\|");
  const out = [`## ${g.heading}`, "", g.intro, "", `| ${g.columns.join(" | ")} |`, `|${g.columns.map(() => "---").join("|")}|`];
  for (const r of g.rows) out.push(`| ${r.cells.map(cell).join(" | ")} |`);
  out.push("", g.footnote, "", "## Direct answers", "");
  for (const q of hubQa(hub)) {
    out.push(`### ${q.q}`, "");
    if (q.kind === "route") out.push(`Answered on its own page:`, "");
    for (const p of q.parts) out.push(`- ${segText(p.segs).trim()} ([${p.label}](${abs(p.href)}))`);
    out.push("");
  }
  return out;
}
