/**
 * The decision logic behind /quiz/which-wearable-api (src/lib/wearableQuiz.mjs)
 * and the share-link builders the quiz, /my-stack and the tools share
 * (src/lib/shareIntents.mjs).
 *
 *   node --test scripts/wearable-quiz.test.mjs     (npm run test:wearable-quiz)
 *
 * Runs every one of the quiz's answer combinations: each must produce a known
 * outcome, every outcome must be reachable, the hard rules must win over the
 * scores, and the answers must survive the share address both ways.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APPROACHES,
  OUTCOMES,
  QUESTIONS,
  QUIZ_PATH,
  SCORES,
  allAnswerSets,
  decide,
  decodeAnswers,
  encodeAnswers,
  isComplete,
  storeFor,
} from "../src/lib/wearableQuiz.mjs";
import { SHARE_TARGETS, shareIntents, shareCtaId } from "../src/lib/shareIntents.mjs";
import { STACK_CARD_MAX_PRODUCTS, stackCardModel } from "../src/lib/stackCard.mjs";

const base = {
  platform: "both",
  devices: "many",
  data: "summary",
  server: "push",
  budget: "per-user",
  compliance: "none",
  team: "small",
  timeline: "weeks",
};
const with_ = (o) => ({ ...base, ...o });

test("eight questions, every option value path-safe and unique per question", () => {
  assert.equal(QUESTIONS.length, 8);
  for (const q of QUESTIONS) {
    const vals = q.options.map((o) => o[0]);
    assert.equal(new Set(vals).size, vals.length, q.id);
    assert.ok(vals.length >= 2 && vals.length <= 9, `${q.id}: one digit per answer in the share code`);
    for (const v of vals) assert.match(v, /^[a-z-]+$/);
  }
  assert.equal(QUIZ_PATH, "/quiz/which-wearable-api");
});

test("SCORES only name real questions, options and approaches", () => {
  for (const [qid, byOpt] of Object.entries(SCORES)) {
    const q = QUESTIONS.find((x) => x.id === qid);
    assert.ok(q, qid);
    for (const [opt, rows] of Object.entries(byOpt)) {
      assert.ok(q.options.some((o) => o[0] === opt), `${qid}.${opt}`);
      for (const [ap, pts, why] of rows) {
        assert.ok(APPROACHES.includes(ap), ap);
        assert.equal(typeof pts, "number");
        assert.ok(why.length > 10);
      }
    }
  }
});

test("every combination decides to a known outcome, and every outcome is reachable", () => {
  const seen = new Map();
  let n = 0;
  for (const a of allAnswerSets()) {
    n++;
    const r = decide(a);
    assert.ok(OUTCOMES.includes(r.outcome), JSON.stringify(a));
    assert.ok(r.reasons.length > 0, `no reason for ${JSON.stringify(a)}`);
    if (r.runnerUp) assert.notEqual(r.runnerUp, r.outcome);
    seen.set(r.outcome, (seen.get(r.outcome) ?? 0) + 1);
  }
  const expected = QUESTIONS.reduce((x, q) => x * q.options.length, 1);
  assert.equal(n, expected);
  for (const o of OUTCOMES) assert.ok(seen.get(o) > 0, `${o} is unreachable`);
});

test("deterministic: the same answers give the same result", () => {
  for (const a of [base, with_({ devices: "few", team: "backend" }), with_({ platform: "ios", devices: "apple" })]) {
    assert.deepEqual(decide(a), decide({ ...a }));
  }
});

test("rules: camera and movement win over everything, then a study, then sensors", () => {
  assert.equal(decide(with_({ data: "movement" })).outcome, "camera-motion");
  assert.equal(decide(with_({ devices: "camera", compliance: "study" })).outcome, "camera-motion");
  assert.equal(decide(with_({ compliance: "study", devices: "sensors" })).outcome, "research-platform");
  assert.equal(decide(with_({ devices: "sensors" })).outcome, "bluetooth-direct");
  assert.equal(decide(with_({ devices: "sensors" })).rule, "sensors");
});

test("camera-motion is the only outcome reached from camera or movement answers", () => {
  for (const a of allAnswerSets()) {
    const r = decide(a);
    const camera = a.data === "movement" || a.devices === "camera";
    assert.equal(r.outcome === "camera-motion", camera, JSON.stringify(a));
  }
});

test("typical profiles", () => {
  // An iPhone-only app for Apple Watch users, data in the app, no fees.
  assert.equal(decide(with_({ platform: "ios", devices: "apple", server: "device", budget: "free" })).outcome, "healthkit");
  // Android-only, Wear OS users.
  assert.equal(decide(with_({ platform: "android", devices: "android", server: "device", budget: "free" })).outcome, "health-connect");
  // Both apps, Android users, on-device.
  assert.equal(decide(with_({ platform: "both", devices: "android", server: "device", budget: "free" })).outcome, "healthkit-and-health-connect");
  // Many brands, a small team, a few weeks, per-user fee fine.
  assert.equal(decide(base).outcome, "aggregator");
  // Two brands, backend team, raw data, no per-user fee, a quarter.
  assert.equal(
    decide(with_({ devices: "few", data: "raw", budget: "free", team: "backend", timeline: "months" })).outcome,
    "direct-wearable-apis",
  );
  // Web-only can never land on a platform store.
  for (const a of allAnswerSets()) {
    if (a.platform !== "web") continue;
    assert.ok(!["healthkit", "health-connect", "healthkit-and-health-connect"].includes(decide(a).outcome), JSON.stringify(a));
  }
});

test("storeFor maps platforms to the right store outcome", () => {
  assert.equal(storeFor("ios", "many"), "healthkit");
  assert.equal(storeFor("android", "apple"), "health-connect");
  assert.equal(storeFor("both", "android"), "healthkit-and-health-connect");
  assert.equal(storeFor("both", "apple"), "healthkit");
});

test("incomplete or invalid answers are refused", () => {
  assert.equal(isComplete({ ...base, team: undefined }), false);
  assert.equal(isComplete({ ...base, team: "huge" }), false);
  assert.throws(() => decide({ platform: "ios" }));
});

test("share code round-trips and rejects anything else", () => {
  for (const a of [base, with_({ platform: "web", devices: "camera", timeline: "months" })]) {
    const q = encodeAnswers(a);
    assert.match(q, /^\?a=\d{8}$/);
    assert.deepEqual(decodeAnswers(q), a);
  }
  for (const bad of ["", "?a=", "?a=0000000", "?a=000000000", "?a=9000000x", "?a=90000000", "?b=00000000"]) {
    assert.equal(decodeAnswers(bad), null, bad);
  }
  assert.equal(encodeAnswers({ platform: "ios" }), "");
});

test("share intents: plain URLs for X, LinkedIn, Bluesky and Reddit, all encoded", () => {
  const url = "https://aifitnessapi.com/quiz/which-wearable-api/aggregator";
  const text = "My result: a health-data aggregator & more";
  const links = shareIntents({ url, text });
  assert.deepEqual(links.map((l) => l.id), SHARE_TARGETS.map((t) => t.id));
  assert.deepEqual(links.map((l) => l.id), ["x", "linkedin", "bluesky", "reddit"]);
  const byId = Object.fromEntries(links.map((l) => [l.id, new URL(l.href)]));
  assert.equal(byId.x.origin, "https://x.com");
  assert.equal(byId.x.searchParams.get("url"), url);
  assert.equal(byId.x.searchParams.get("text"), text);
  assert.equal(byId.linkedin.origin, "https://www.linkedin.com");
  assert.equal(byId.linkedin.searchParams.get("url"), url);
  assert.equal(byId.bluesky.origin, "https://bsky.app");
  assert.equal(byId.bluesky.searchParams.get("text"), `${text} ${url}`);
  assert.equal(byId.reddit.origin, "https://www.reddit.com");
  assert.equal(byId.reddit.searchParams.get("url"), url);
  assert.equal(byId.reddit.searchParams.get("title"), text);
  for (const l of links) assert.ok(!l.href.includes(" "), l.href);
});

test("share CTA ids are fixed strings that carry no user data", () => {
  assert.equal(shareCtaId("rate-limit-calculator", "x"), "share-rate-limit-calculator-x");
  assert.equal(shareCtaId("quiz", "copy"), "share-quiz-copy");
  assert.throws(() => shareCtaId("Rate Limit", "x"));
  assert.throws(() => shareCtaId("quiz", "mastodon"));
});

test("stack card: products capped, past deadlines dropped, nearest three first", () => {
  const products = Array.from({ length: 15 }, (_, i) => `P${i}`);
  const deadlines = [
    { title: "Old", target: "2026-10-01", exact: true, who: ["P1"] },
    { title: "Later", target: "2026-12-31", exact: false, who: ["P2"] },
    { title: "Soon", target: "2026-11-08", exact: true, who: ["P3", "P4"] },
    { title: "Today", target: "2026-11-06", exact: true, who: ["P5"] },
    { title: "Next year", target: "2027-03-01", exact: true, who: ["P6"] },
  ];
  const m = stackCardModel({ products, deadlines, today: "2026-11-06" });
  assert.equal(m.products.length, STACK_CARD_MAX_PRODUCTS);
  assert.equal(m.more, 15 - STACK_CARD_MAX_PRODUCTS);
  assert.equal(m.ahead, 4);
  assert.deepEqual(m.deadlines, ["today · P5: Today", "in 2 days · P3, P4: Soon", "in ~55 days · P2: Later"]);
  assert.match(m.text, /^My health-data stack: P0, P1/);
  assert.match(m.text, /4 dated items ahead, the next today · P5: Today\.$/);
});

test("stack card: an empty stack has no text; no deadlines says so", () => {
  assert.equal(stackCardModel({ products: [], deadlines: [], today: "2026-11-06" }).text, "");
  const m = stackCardModel({ products: ["Oura"], deadlines: [{ title: "x", target: "2026-01-01", exact: true, who: ["Oura"] }], today: "2026-11-06" });
  assert.deepEqual(m.deadlines, []);
  assert.equal(m.text, "My health-data stack: Oura. No dated item ahead.");
  const one = stackCardModel({ products: ["Oura"], deadlines: [{ title: "y", target: "2026-11-07", exact: true, who: ["Oura"] }], today: "2026-11-06" });
  assert.deepEqual(one.deadlines, ["in 1 day · Oura: y"]);
});
