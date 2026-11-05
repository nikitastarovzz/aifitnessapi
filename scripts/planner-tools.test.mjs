/**
 * The logic behind /tools/build-plan, /tools/store-submission-checklist and
 * /tools/compliance-wizard (src/lib/plannerLogic.mjs), run against the quoted
 * rules those pages use (src/data/plannerSources.mjs).
 *
 *   node --test scripts/planner-tools.test.mjs     (npm run test:planners)
 *
 * The bundle here is a small synthetic stand-in for the one the pages build
 * from the cost model and the build guides: two app types and a handful of
 * products whose fields are made up. What is tested is the routing, the URL
 * round trip and the Markdown, not product facts.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PLANNER_SOURCES,
  PLANNER_TRAITS,
  STORE_ITEMS,
  REGIMES,
  EDGE_CASES,
} from "../src/data/plannerSources.mjs";
import {
  applicableStoreItems,
  assessCompliance,
  buildPlan,
  checklistMarkdown,
  checklistProgress,
  complianceMarkdown,
  decodeChecklist,
  decodePlan,
  decodeWizard,
  encodeChecklist,
  encodePlan,
  encodeWizard,
  parseList,
  planMarkdown,
  planToWizard,
  prdMarkdown,
  PLAN_PAGES,
  TRAIT_ORDER,
  WIZARD_DEFAULT,
  WIZARD_QUESTIONS,
} from "../src/lib/plannerLogic.mjs";

const api = (id, category, devCost, engEffort, extra = {}) => ({
  id,
  label: `Product ${id}`,
  category,
  categoryLabel: category,
  devCost,
  devCostLabel: devCost,
  userSideCost: null,
  approvalGate: null,
  engEffort,
  notes: "",
  sourceHref: `/apis/${id}`,
  ...extra,
});

const APIS = {
  healthkit: api("healthkit", "platform-store", "free", "medium"),
  "health-connect": api("health-connect", "platform-store", "free", "medium"),
  oura: api("oura", "wearable-direct", "free", "low", { userSideCost: "A ring." }),
  garmin: api("garmin", "wearable-direct", "free", "high", { approvalGate: "Program approval." }),
  terra: api("terra", "aggregator", "usage-based", "low"),
  kinestex: api("kinestex", "motion-sdk", "contact-sales", "low"),
  mediapipe: api("mediapipe", "pose-model", "free", "high"),
  "llm-apis": api("llm-apis", "llm-features", "usage-based", "medium"),
};

const labels = new Proxy(
  {},
  {
    get: (_t, href) => (typeof href === "string" && href.startsWith("/") ? `Page ${href}` : undefined),
  },
);

const BUNDLE = {
  appTypes: [
    {
      id: "sleep-tracking-app",
      label: "Sleep tracking app",
      guide: { href: "/build/sleep-tracking-app", label: "Sleep guide" },
      hk: [{ name: "sleepAnalysis", aggregation: null, android: "SleepSessionRecord" }],
      apiIds: ["oura", "healthkit"],
      pages: [],
    },
    { id: "clinical-rpm-app", label: "Clinical or remote patient monitoring app", hk: [], apiIds: [], traits: ["clinical"], pages: ["/compliance/hipaa-compliance-fitness-app"] },
  ],
  apis: APIS,
  labels,
  storeItems: STORE_ITEMS,
  regimes: REGIMES,
  edgeCases: EDGE_CASES,
  sources: PLANNER_SOURCES,
  traitLabels: PLANNER_TRAITS,
  devCostLabels: { free: "Free", "usage-based": "Usage-based", "contact-sales": "Contact sales" },
};
const TYPE_IDS = BUNDLE.appTypes.map((t) => t.id);

// ── The data ─────────────────────────────────────────────────────────────

test("every quoted rule names a known source, and ids are unique", () => {
  const ids = new Set();
  for (const i of STORE_ITEMS) {
    assert.ok(PLANNER_SOURCES[i.source], `${i.id}: unknown source ${i.source}`);
    assert.ok(!ids.has(i.id), `duplicate id ${i.id}`);
    ids.add(i.id);
    assert.ok(i.quote.length >= 12);
    for (const w of i.when ?? []) assert.ok(PLANNER_TRAITS[w], `${i.id}: unknown trait ${w}`);
  }
  for (const r of REGIMES) for (const q of r.quotes) assert.ok(PLANNER_SOURCES[q.source], `${r.id}: unknown source ${q.source}`);
  for (const e of EDGE_CASES) {
    assert.ok(PLANNER_SOURCES[e.source]);
    for (const w of e.when) assert.ok(PLANNER_TRAITS[w]);
  }
  assert.deepEqual([...TRAIT_ORDER].sort(), Object.keys(PLANNER_TRAITS).sort());
});

// ── Store checklist ──────────────────────────────────────────────────────

test("checklist: unconditional items always show for their store; conditional ones need a trait", () => {
  const apple = applicableStoreItems(STORE_ITEMS, ["apple"], []);
  assert.ok(apple.length > 0);
  assert.ok(apple.every((i) => i.store === "apple" && !i.when));
  const withHk = applicableStoreItems(STORE_ITEMS, ["apple"], ["healthkit"]);
  assert.ok(withHk.some((i) => i.id === "apple-no-false-data-icloud"));
  assert.ok(!apple.some((i) => i.id === "apple-no-false-data-icloud"));
  assert.equal(applicableStoreItems(STORE_ITEMS, [], TRAIT_ORDER).length, 0);
  const all = applicableStoreItems(STORE_ITEMS, ["apple", "google"], TRAIT_ORDER);
  assert.equal(all.length, STORE_ITEMS.length, "every item is reachable by some answer");
});

test("checklist: account deletion appears on both stores only with accounts", () => {
  const off = applicableStoreItems(STORE_ITEMS, ["apple", "google"], []).map((i) => i.id);
  const on = applicableStoreItems(STORE_ITEMS, ["apple", "google"], ["accounts"]).map((i) => i.id);
  assert.ok(!off.includes("apple-account-deletion") && !off.includes("google-account-deletion"));
  assert.ok(on.includes("apple-account-deletion") && on.includes("google-account-deletion"));
});

test("checklist: URL state round-trips and drops unknown values", () => {
  const s = { stores: ["google"], traits: ["health-connect", "kids"] };
  assert.deepEqual(decodeChecklist(encodeChecklist(s)), s);
  assert.deepEqual(decodeChecklist("?s=google,nope&t=kids,bogus"), { stores: ["google"], traits: ["kids"] });
  assert.deepEqual(decodeChecklist(""), decodeChecklist("?utm=1"));
});

test("checklist: progress counts only applicable items", () => {
  const items = applicableStoreItems(STORE_ITEMS, ["apple"], []);
  const p = checklistProgress(items, [items[0].id, "google-no-sale", "not-an-item"]);
  assert.equal(p.done, 1);
  assert.equal(p.total, items.length);
  assert.equal(checklistProgress([], []).percent, 0);
});

test("checklist markdown ticks done items and quotes every item with its source", () => {
  const items = applicableStoreItems(STORE_ITEMS, ["apple", "google"], ["accounts"]);
  const mdx = checklistMarkdown(items, PLANNER_SOURCES, { done: [items[0].id], origin: "https://x.test", stores: ["apple", "google"], traits: ["accounts"], traitLabels: PLANNER_TRAITS });
  assert.equal((mdx.match(/^- \[x\]/gm) ?? []).length, 1);
  assert.equal((mdx.match(/^- \[[ x]\]/gm) ?? []).length, items.length);
  for (const i of items) assert.ok(mdx.includes(i.quote.replace(/\s+/g, " ")), i.id);
  assert.ok(mdx.includes("not legal advice"));
});

// ── Compliance wizard ────────────────────────────────────────────────────

const ids = (r) => r.map((x) => `${x.id}:${x.status}`);

test("wizard: a consumer app outside HIPAA gets the FTC rule, not HIPAA", () => {
  const r = assessCompliance(WIZARD_DEFAULT);
  assert.ok(ids(r).includes("hipaa-not-covered:unlikely"));
  assert.ok(ids(r).includes("ftc-hbnr:likely"));
  assert.ok(!r.some((x) => x.id === "hipaa-covered-entity" || x.id === "hipaa-business-associate"));
  assert.ok(ids(r).includes("app-store:likely") && ids(r).includes("google-play:likely"));
});

test("wizard: building for a covered entity makes HIPAA likely and the FTC rule only possible", () => {
  const r = assessCompliance({ ...WIZARD_DEFAULT, payer: "provider", ba: "yes" });
  assert.ok(ids(r).includes("hipaa-business-associate:likely"));
  assert.ok(ids(r).includes("ftc-hbnr:possible"));
  assert.ok(!r.some((x) => x.id === "hipaa-not-covered"));
});

test("wizard: a provider-offered app with the on-behalf question unanswered asks for it", () => {
  const r = assessCompliance({ ...WIZARD_DEFAULT, payer: "health-plan", ba: "" });
  assert.ok(ids(r).includes("hipaa-business-associate:possible"));
  const r2 = assessCompliance({ ...WIZARD_DEFAULT, payer: "health-plan", ba: "no" });
  assert.ok(ids(r2).includes("hipaa-business-associate:check"));
  assert.ok(!r2.some((x) => x.id === "hipaa-not-covered"));
});

test("wizard: prescription, EU, Washington, medical claims and ad sharing each route to their rule", () => {
  const r = assessCompliance({ ...WIZARD_DEFAULT, rx: "yes", eu: "yes", wa: "unsure", med: "yes", ads: "yes", payer: "gym" });
  const got = ids(r);
  for (const want of ["hipaa-covered-entity:possible", "gdpr-art9:likely", "gdpr-gym:likely", "wa-mhmda:possible", "fda-wellness:possible", "ftc-hbnr-sharing:likely"]) {
    assert.ok(got.includes(want), want);
  }
  assert.ok(!r.some((x) => x.id === "hipaa-not-covered"));
});

test("wizard: no US users takes the US rules off", () => {
  const r = assessCompliance({ ...WIZARD_DEFAULT, us: "no", ads: "yes" });
  assert.ok(ids(r).includes("ftc-hbnr:unlikely"));
  assert.ok(!r.some((x) => x.id === "ftc-act" || x.id === "ftc-hbnr-sharing"));
});

test("wizard: every finding names a regime that exists, with a reason", () => {
  const regimes = new Set(REGIMES.map((x) => x.id));
  const combos = [];
  for (const q of WIZARD_QUESTIONS) for (const [v] of q.options) combos.push({ ...WIZARD_DEFAULT, [q.id]: v });
  combos.push(decodeWizard("?payer=provider"));
  for (const a of combos) {
    for (const f of assessCompliance(a)) {
      assert.ok(regimes.has(f.id), f.id);
      assert.ok(f.reason.length > 20);
    }
  }
});

test("wizard: URL state round-trips; an empty query is the default", () => {
  const a = { ...WIZARD_DEFAULT, payer: "gym", eu: "yes", s: ["google"] };
  assert.deepEqual(decodeWizard(encodeWizard(a)), a);
  assert.deepEqual(decodeWizard(""), WIZARD_DEFAULT);
  assert.equal(decodeWizard("?payer=martian").payer, "");
});

test("wizard markdown quotes each shown regime and says it is not legal advice", () => {
  const r = assessCompliance({ ...WIZARD_DEFAULT, eu: "yes" });
  const mdx = complianceMarkdown(r, REGIMES, PLANNER_SOURCES, { origin: "https://x.test", answers: { ...WIZARD_DEFAULT, eu: "yes" } });
  assert.ok(mdx.includes("not legal advice"));
  for (const f of r) {
    const g = REGIMES.find((x) => x.id === f.id);
    assert.ok(mdx.includes(`### ${g.name}`));
    for (const q of g.quotes) assert.ok(mdx.includes(q.quote.replace(/\s+/g, " ")));
  }
});

// ── Build plan and PRD ───────────────────────────────────────────────────

test("plan: URL state round-trips and unknown values fall back", () => {
  const a = { type: "clinical-rpm-app", p: ["android"], src: ["aggregator"], f: ["ai-motion", "llm-coach"], payer: "provider", us: "yes", eu: "yes", wa: "unsure" };
  assert.deepEqual(decodePlan(encodePlan(a), TYPE_IDS), a);
  assert.equal(decodePlan("?type=nope", TYPE_IDS).type, "sleep-tracking-app");
  assert.deepEqual(decodePlan("?p=ios,watchos", TYPE_IDS).p, ["ios"]);
});

test("plan: platform stores follow the platforms; categories follow sources and features", () => {
  const ios = buildPlan({ ...decodePlan("", TYPE_IDS), p: ["ios"], src: ["platform-store"], f: [] }, BUNDLE);
  assert.deepEqual(ios.apis.map((x) => x.id), ["healthkit"]);
  assert.ok(ios.traits.includes("healthkit") && !ios.traits.includes("health-connect"));
  const both = buildPlan({ ...decodePlan("", TYPE_IDS), p: ["ios", "android"], src: ["platform-store", "aggregator"], f: ["llm-coach"] }, BUNDLE);
  assert.deepEqual(new Set(both.apis.map((x) => x.id)), new Set(["healthkit", "health-connect", "terra", "llm-apis"]));
  assert.ok(both.traits.includes("third-party-ai"));
});

test("plan: a web-only plan cannot read the phone stores and says so", () => {
  const p = buildPlan({ ...decodePlan("", TYPE_IDS), p: ["web"], src: ["platform-store"] }, BUNDLE);
  assert.equal(p.apis.length, 0);
  assert.equal(p.hk.length, 0);
  assert.ok(p.notes.some((n) => /web-only/.test(n)));
});

test("plan: guide products sort first, then by how they bill", () => {
  const p = buildPlan({ ...decodePlan("", TYPE_IDS), src: ["wearable-direct", "platform-store"] }, BUNDLE);
  const order = p.apis.map((x) => x.id);
  assert.ok(order.indexOf("oura") < order.indexOf("garmin"), "oura is in the guide, garmin is not");
  assert.ok(p.apis.find((x) => x.id === "oura").inGuide);
});

test("plan: the cost shape has no numbers, only billing groups and the effort span", () => {
  const p = buildPlan({ ...decodePlan("", TYPE_IDS), src: ["wearable-direct", "aggregator"], f: ["ai-motion"] }, BUNDLE);
  assert.deepEqual(p.cost.effortRange, ["low", "high"]);
  assert.deepEqual(p.cost.byDevCost.map((g) => g.key), ["free", "usage-based", "contact-sales"]);
  const mdx = planMarkdown(p, BUNDLE, { origin: "https://x.test" });
  const cost = mdx.split("## Cost shape")[1].split("## Compliance")[0];
  assert.ok(!/\$\s?\d|\d+\s?(USD|EUR)/.test(cost));
  assert.ok(cost.includes("rough judgment"));
});

test("plan: the funder is named only with camera motion tracking, and always with the disclosure", () => {
  const base = { ...decodePlan("", TYPE_IDS), src: ["platform-store"], f: [] };
  const without = buildPlan(base, BUNDLE);
  assert.equal(without.showsFunder, false);
  for (const out of [planMarkdown(without, BUNDLE), prdMarkdown(without, BUNDLE)]) assert.ok(!out.includes("KinesteX"));
  const withMotion = buildPlan({ ...base, f: ["ai-motion"] }, BUNDLE);
  assert.equal(withMotion.showsFunder, true);
  for (const out of [planMarkdown(withMotion, BUNDLE), prdMarkdown(withMotion, BUNDLE)]) {
    assert.ok(out.includes("Disclosure: KinesteX"));
    assert.ok(out.includes("funds this site"));
  }
});

test("plan: compliance and checklist links carry the plan's answers", () => {
  const a = { ...decodePlan("", TYPE_IDS), type: "clinical-rpm-app", p: ["ios"], payer: "provider", eu: "yes" };
  const p = buildPlan(a, BUNDLE);
  const w = planToWizard(a, BUNDLE.appTypes[1]);
  assert.equal(w.ba, "unsure");
  assert.deepEqual(w.s, ["apple"]);
  assert.equal(p.links.wizard, `/tools/compliance-wizard${encodeWizard(w)}`);
  assert.deepEqual(decodeChecklist(p.links.checklist.split("?")[1]).stores, ["apple"]);
  assert.ok(p.traits.includes("clinical"));
  assert.ok(p.storeItems.some((i) => i.id === "apple-legal-entity"));
  assert.ok(p.compliance.some((f) => f.id === "hipaa-business-associate"));
});

test("plan: every linked page is one the page checks against routeLabel", () => {
  const seen = new Set();
  const spy = new Proxy({}, { get: (_t, h) => (typeof h === "string" && h.startsWith("/") ? (seen.add(h), `Page ${h}`) : undefined) });
  const bundle = { ...BUNDLE, labels: spy };
  const all = { type: "sleep-tracking-app", p: ["ios", "android", "web"], src: ["platform-store", "wearable-direct", "aggregator", "ble", "manual"], f: ["ai-motion", "llm-coach", "nutrition", "exercise-content", "accounts"], payer: "consumer", us: "yes", eu: "yes", wa: "yes" };
  buildPlan(all, bundle);
  for (const h of seen) assert.ok(PLAN_PAGES.includes(h), `${h} is linked but not in PLAN_PAGES`);
});

test("PRD: has every section, quotes the edge cases for the chosen platforms, and leaves TODOs", () => {
  const p = buildPlan({ ...decodePlan("", TYPE_IDS), p: ["ios", "android"], src: ["platform-store"], f: ["accounts"] }, BUNDLE);
  const prd = prdMarkdown(p, BUNDLE, { origin: "https://x.test", date: "2026-11-05" });
  for (const h of ["## 1. Problem and users", "## 4. Data and permissions", "## 6. Edge cases the platforms document", "## 7. Compliance requirements", "## 8. Store review requirements", "## 9. Cost structure", "## Sources"]) {
    assert.ok(prd.includes(h), h);
  }
  for (const id of ["healthkit-read-denial", "health-connect-30-days", "health-connect-token-expiry"]) {
    const e = EDGE_CASES.find((x) => x.id === id);
    assert.ok(prd.includes(e.quote.replace(/\s+/g, " ")), id);
  }
  assert.ok(prd.includes("TODO"));
  assert.ok(prd.includes("`SleepSessionRecord`"));
  const iosOnly = prdMarkdown(buildPlan({ ...decodePlan("", TYPE_IDS), p: ["ios"], src: ["platform-store"] }, BUNDLE), BUNDLE);
  assert.ok(!iosOnly.includes("Health Connect reads stop at 30 days"));
});

test("parseList keeps allowed order and drops duplicates", () => {
  assert.deepEqual(parseList("b,a,b,z", ["a", "b"]), ["a", "b"]);
  assert.deepEqual(parseList(null), []);
});
