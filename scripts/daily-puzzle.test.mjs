/**
 * Tests for src/lib/dailyPuzzle.ts, the generator behind /daily.
 *
 * Run: npm run test:daily   (node --test; Node strips the modules' types)
 *
 * The bank is built from the real generated datasets, the same modules
 * src/lib/dailyBank.ts passes in, so a regeneration that changes a field the
 * puzzle reads fails here as well as in the build. The one input that differs
 * is the HealthKit page lookup (it lives behind a path alias); it only changes
 * which page an aggregation answer links to, never what is asked.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const src = new URL("../src/", import.meta.url);
const load = (p) => import(new URL(p, src).href);

const [ec, gh, mx, hk, pk, dp] = await Promise.all([
  load("data/errorCodes.ts"),
  load("data/googleHealthApi.ts"),
  load("data/matrix.ts"),
  load("data/healthkitIdentifiers.ts"),
  load("data/poseKeypoints.ts"),
  load("lib/dailyPuzzle.ts"),
]);

const GHA_URL = gh.GHAPI_SOURCES.find((s) => s.key === "errors").url;
const inputs = {
  hkErrors: ec.HK_ERROR_CODES,
  hcErrors: ec.HC_ERROR_CONSTANTS,
  ghaErrors: gh.GHAPI_ERRORS,
  ghaErrorsUrl: GHA_URL,
  matrixRows: mx.ROWS,
  hkIdentifiers: hk.HK_IDENTIFIERS,
  hkPagePath: () => null,
  poseSchemes: pk.POSE_SCHEMES,
  poseSources: pk.POSE_SOURCES,
};
const bank = dp.buildDailyBank(inputs);

/** Every UTC date from launch through the end of 2027. */
const DATES = [];
for (let d = dp.LAUNCH_DATE; d <= "2027-12-31"; d = dp.addDays(d, 1)) DATES.push(d);

test("bank sizes: every kind has enough rows to draw from", () => {
  const sizes = dp.bankSizes(bank);
  console.log("bank sizes", JSON.stringify(sizes), "errors by platform", JSON.stringify(Object.fromEntries(Object.entries(bank.errors).map(([k, v]) => [k, v.length]))));
  for (const p of dp.PLATFORMS) assert.ok(bank.errors[p.id].length >= 3, `${p.id} errors`);
  assert.ok(sizes.translate >= 8);
  assert.ok(sizes.aggregation >= 50);
  assert.ok(sizes.keypoint >= 100);
  assert.ok(bank.translateRows.length >= 4, "translate needs four distinct rows for four options");
});

test("same date, same puzzle; rebuilding the bank changes nothing", () => {
  const again = dp.buildDailyBank(inputs);
  for (const d of DATES.slice(0, 60)) {
    assert.deepEqual(dp.puzzleFor(d, bank), dp.puzzleFor(d, again), d);
  }
  assert.notDeepEqual(dp.puzzleFor("2026-11-01", bank).questions, dp.puzzleFor("2026-11-02", bank).questions);
});

test("numbering counts from launch day, and kinds rotate", () => {
  assert.equal(dp.puzzleNumber(dp.LAUNCH_DATE), 1);
  assert.equal(dp.puzzleNumber("2026-11-01"), 2);
  assert.equal(dp.puzzleNumber("2027-10-31"), 366);
  assert.equal(dp.addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(dp.utcDate(new Date("2026-11-01T23:59:59-05:00")), "2026-11-02");
  for (let n = 1; n <= 8; n++) {
    const k = dp.kindsFor(n);
    assert.equal(k.length, 5);
    assert.equal(new Set(k).size, 4, "every kind every day");
    assert.equal(k[0], dp.KINDS[(n - 1) % 4], "lead kind rotates");
  }
});

test("every question on every day is well formed and traceable to a dataset row", () => {
  const hkErr = new Map(ec.HK_ERROR_CODES.map((r) => [r.case, r]));
  const hcErr = new Map(ec.HC_ERROR_CONSTANTS.map((r) => [r.name, r]));
  const ghErr = new Map(gh.GHAPI_ERRORS.map((r) => [r.reason, r]));
  const hkId = new Map(hk.HK_IDENTIFIERS.map((r) => [r.case, r]));
  const rows = new Map(mx.ROWS.map((r) => [r.id, r]));
  const schemes = new Map(pk.POSE_SCHEMES.map((s) => [s.slug, s]));
  const kinds = { platform: new Set(), translate: new Set(), aggregation: new Set(), keypoint: new Set() };

  for (const d of DATES) {
    const pz = dp.puzzleFor(d, bank);
    assert.equal(pz.questions.length, 5, d);
    assert.equal(new Set(pz.questions.map((q) => q.id)).size, 5, `${d}: a question repeats within the day`);
    for (const q of pz.questions) {
      kinds[q.kind].add(q.id);
      const where = `${d} ${q.id}`;
      assert.ok(q.options.length >= 2 && new Set(q.options).size === q.options.length, `${where}: options`);
      assert.ok(q.correct >= 0 && q.correct < q.options.length, `${where}: correct index`);
      assert.ok(q.evidence && q.evidence.length > 10, `${where}: evidence`);
      assert.match(q.href, /^\/[a-z0-9/#._-]*$/, `${where}: href`);
      const [, a, b] = q.id.split(":");
      if (q.kind === "platform") {
        const label = q.options[q.correct];
        const [prefix, key] = q.id.split(":");
        const row = prefix === "hk-error" ? hkErr.get(key) : prefix === "hc-error" ? hcErr.get(key) : ghErr.get(key);
        assert.ok(row, `${where}: no dataset row`);
        const text = row.abstract ?? row.description;
        assert.ok(text, `${where}: answer from a null message`);
        assert.equal(q.subject, text, `${where}: message not verbatim`);
        assert.ok(q.evidence === text && q.evidenceIsQuote, `${where}: evidence is not the verbatim message`);
        assert.equal(label, { "hk-error": "HealthKit", "hc-error": "Health Connect", "gha-error": "Google Health API" }[prefix]);
        assert.ok(!/healthkit|health connect|google|fitbit|apple|android/i.test(text), `${where}: message names its platform`);
      } else if (q.kind === "translate") {
        const row = rows.get(a);
        assert.ok(row, `${where}: no matrix row`);
        assert.ok(hkId.has(b), `${where}: ${b} is not in Apple's identifier dataset`);
        assert.ok(row.apple.includes(`.${b}`), `${where}: matrix row does not name ${b}`);
        assert.equal(q.options[q.correct], row.android);
        assert.equal(q.options.length, 4);
        for (const o of q.options) assert.ok(mx.ROWS.some((r) => r.android === o), `${where}: option ${o} is not a matrix row`);
      } else if (q.kind === "aggregation") {
        const row = hkId.get(a);
        assert.ok(row && row.family === "quantity", `${where}: not a quantity type`);
        assert.ok(row.aggregation !== null && row.aggregationEvidence, `${where}: asked a type Apple does not state`);
        assert.equal(q.correct, row.aggregation === "cumulative" ? 0 : 1);
        assert.equal(q.evidence, row.aggregationEvidence);
        assert.equal(q.evidenceIsQuote, true);
        assert.equal(q.sourceUrl, row.docUrl);
      } else {
        const s = schemes.get(a);
        assert.ok(s && s.indexed, `${where}: scheme`);
        const pt = s.points.find((p) => p.index === Number(b));
        assert.ok(pt, `${where}: no point at index ${b}`);
        assert.equal(q.options[q.correct], pt.name);
        assert.equal(q.options.length, 4);
        for (const o of q.options) assert.ok(s.points.some((p) => p.name === o), `${where}: option ${o} not in ${s.slug}`);
        assert.ok(!/^face-\d+$/.test(pt.name));
      }
    }
  }
  console.log("distinct questions drawn 2026-10-31..2027-12-31", JSON.stringify(Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, v.size]))));
});

test("no bank item rests on a null or undocumented answer", () => {
  for (const id of ec.HK_ERROR_CODES.filter((r) => !r.abstract).map((r) => `hk-error:${r.case}`)) {
    assert.ok(!bank.errors.healthkit.some((e) => e.id === id), id);
  }
  const nullAgg = new Set(hk.HK_IDENTIFIERS.filter((r) => r.aggregation === null || !r.aggregationEvidence).map((r) => `hk-aggregation:${r.case}`));
  assert.ok(nullAgg.size > 0, "the dataset has nulls to exclude");
  for (const a of bank.aggregation) assert.ok(!nullAgg.has(a.id), a.id);
  assert.ok(!bank.keypoints.some((s) => s.slug.startsWith("apple-vision")), "Apple's joints have no index");
});

test("score, grid, share text and streak", () => {
  const pz = dp.puzzleFor("2026-11-03", bank);
  const right = pz.questions.map((q) => q.correct);
  const oneWrong = [...right];
  oneWrong[1] = (right[1] + 1) % pz.questions[1].options.length;
  assert.equal(dp.score(pz, right), 5);
  assert.equal(dp.score(pz, oneWrong), 4);
  assert.equal(dp.grid(pz, oneWrong), "🟩🟥🟩🟩🟩");
  assert.equal(dp.shareText(pz, oneWrong, "https://aifitnessapi.com/daily"), `aifitnessapi daily #4 🟩🟥🟩🟩🟩\nhttps://aifitnessapi.com/daily`);
  // The share text never carries an answer.
  for (const q of pz.questions) assert.ok(!dp.shareText(pz, right, "u").includes(q.options[q.correct]));
  assert.equal(dp.streak([], "2026-11-03"), 0);
  assert.equal(dp.streak(["2026-11-01", "2026-11-02"], "2026-11-03"), 2, "today unplayed keeps yesterday's run");
  assert.equal(dp.streak(["2026-11-01", "2026-11-02", "2026-11-03"], "2026-11-03"), 3);
  assert.equal(dp.streak(["2026-10-31", "2026-11-02", "2026-11-03"], "2026-11-03"), 2);
  assert.equal(dp.streak(["2026-10-30"], "2026-11-03"), 0);
});
