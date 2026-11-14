// node --test scripts/index-governor.test.mjs
// Pins the index governor's rules in scripts/lib/index-governor.mjs and the
// service-account path in scripts/lib/gsc-auth.mjs. Small synthetic fixtures
// only, never the repo's data.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  addDays,
  firstSeenFromRows,
  mergeLedger,
  shownWithin,
  judge,
  baseline,
  budget,
  cohorts,
  sectionRank,
  requestList,
  recovered,
  buildState,
  stateJson,
  renderMarkdown,
} from "./lib/index-governor.mjs";
import { serviceAccountToken, GSC_SCOPE, TOKEN_URL } from "./lib/gsc-auth.mjs";

const ASOF = "2026-11-14";

/** n pages published on `date`, the first `shown` of them seen on `seenOn`. */
function cohort(prefix, date, n, shown, seenOn = date) {
  const published = new Map();
  const firstSeen = {};
  for (let i = 0; i < n; i++) {
    const p = `/${prefix}/p${String(i).padStart(2, "0")}`;
    published.set(p, date);
    if (i < shown) firstSeen[p] = seenOn;
  }
  return { published, firstSeen };
}

// ── Ledger ───────────────────────────────────────────────────────────────
test("firstSeenFromRows keeps the earliest date per normalised path and the latest date as asOf", () => {
  const r = firstSeenFromRows([
    { keys: ["2026-11-02", "https://aifitnessapi.com/a/"], impressions: 3 },
    { keys: ["2026-10-30", "https://www.aifitnessapi.com/a"], impressions: 1 },
    { keys: ["2026-11-05", "https://aifitnessapi.com/b#faq"], impressions: 2 },
    { keys: ["2026-11-09", "https://aifitnessapi.com/c"], impressions: 0 },
  ]);
  assert.deepEqual(r.firstSeen, { "/a": "2026-10-30", "/b": "2026-11-05" });
  assert.equal(r.asOf, "2026-11-05");
});

test("mergeLedger keeps the earliest date, never drops a path, and takes the later asOf", () => {
  const old = { asOf: "2026-11-10", firstSeen: { "/a": "2026-09-01", "/b": "2026-10-05", "/gone": "2026-08-01" } };
  const read = { asOf: "2026-11-13", firstSeen: { "/a": "2026-10-01", "/b": "2026-10-02", "/new": "2026-11-12" } };
  const m = mergeLedger(old, read);
  assert.deepEqual(m.firstSeen, { "/a": "2026-09-01", "/b": "2026-10-02", "/gone": "2026-08-01", "/new": "2026-11-12" });
  assert.deepEqual(Object.keys(m.firstSeen), ["/a", "/b", "/gone", "/new"]);
  assert.equal(m.asOf, "2026-11-13");
  assert.equal(mergeLedger(read, { asOf: "2026-11-01", firstSeen: {} }).asOf, "2026-11-13");
  assert.equal(mergeLedger(null, read).asOf, "2026-11-13");
});

// ── Shown within 7 days ──────────────────────────────────────────────────
test("shownWithin: on publish + 7 counts, + 8 does not, before publish counts", () => {
  assert.equal(shownWithin("2026-10-08", "2026-10-01", 7), true);
  assert.equal(shownWithin("2026-10-09", "2026-10-01", 7), false);
  assert.equal(shownWithin("2026-09-20", "2026-10-01", 7), true);
  assert.equal(shownWithin(undefined, "2026-10-01", 7), false);
});

// ── Verdict ──────────────────────────────────────────────────────────────
test("judge: the window is asOf - 21 to asOf - 7 inclusive", () => {
  const inside = cohort("in", addDays(ASOF, -21), 3, 3);
  const edge = cohort("edge", addDays(ASOF, -7), 3, 3);
  const outside = cohort("out", addDays(ASOF, -6), 10, 0);
  const before = cohort("old", addDays(ASOF, -22), 10, 0);
  const published = new Map([...inside.published, ...edge.published, ...outside.published, ...before.published]);
  const j = judge({ published, firstSeen: { ...inside.firstSeen, ...edge.firstSeen }, asOf: ASOF });
  assert.equal(j.sample, 6);
  assert.equal(j.shownWithin7, 6);
  assert.deepEqual(j.window, { from: "2026-10-24", to: "2026-11-07" });
  assert.equal(j.verdict, "open");
});

test("judge: thresholds at 0.5 and 0.2", () => {
  const d = addDays(ASOF, -10);
  const at = (n, shown) => {
    const c = cohort("x", d, n, shown);
    return judge({ ...c, asOf: ASOF });
  };
  assert.equal(at(10, 5).verdict, "open"); // 0.5
  assert.equal(at(10, 5).share, 0.5);
  assert.equal(at(100, 49).verdict, "throttled"); // 0.49
  assert.equal(at(10, 2).verdict, "throttled"); // 0.2
  assert.equal(at(100, 19).verdict, "closed"); // 0.19
  assert.equal(at(10, 0).verdict, "closed");
  assert.match(at(10, 2).reason, /^2 of 10 pages published 2026-10-24 to 2026-11-07/);
});

test("judge: a first-seen date before publication counts as shown", () => {
  const c = cohort("x", addDays(ASOF, -10), 5, 5, addDays(ASOF, -40));
  assert.equal(judge({ ...c, asOf: ASOF }).verdict, "open");
});

test("judge: a page seen on day 8 is not shown within 7", () => {
  const d = addDays(ASOF, -10);
  const c = cohort("x", d, 5, 5, addDays(d, 8));
  const j = judge({ ...c, asOf: ASOF });
  assert.equal(j.shownWithin7, 0);
  assert.equal(j.verdict, "closed");
});

test("judge: under five pages widens to asOf - 35; still under five is throttled with no recent sample", () => {
  const recent = cohort("r", addDays(ASOF, -10), 2, 0);
  const older = cohort("o", addDays(ASOF, -35), 3, 3);
  const tooOld = cohort("t", addDays(ASOF, -36), 10, 10);
  const published = new Map([...recent.published, ...older.published, ...tooOld.published]);
  const firstSeen = { ...older.firstSeen, ...tooOld.firstSeen };
  const w = judge({ published, firstSeen, asOf: ASOF });
  assert.equal(w.widened, true);
  assert.deepEqual(w.window, { from: "2026-10-10", to: "2026-11-07" });
  assert.equal(w.sample, 5);
  assert.equal(w.shownWithin7, 3);
  assert.equal(w.verdict, "open"); // 3 of 5
});

test("judge: widened sample of 5 with 3 shown is open; 4 pages is no recent sample", () => {
  const recent = cohort("r", addDays(ASOF, -10), 2, 0);
  const older = cohort("o", addDays(ASOF, -30), 3, 3);
  let published = new Map([...recent.published, ...older.published]);
  const j = judge({ published, firstSeen: older.firstSeen, asOf: ASOF });
  assert.equal(j.sample, 5);
  assert.equal(j.verdict, "open");
  published = new Map([...recent.published, ...cohort("o", addDays(ASOF, -30), 2, 2).published]);
  const none = judge({ published, firstSeen: older.firstSeen, asOf: ASOF });
  assert.equal(none.sample, 4);
  assert.equal(none.verdict, "throttled");
  assert.equal(none.reason, "no recent sample");
});

test("baseline reads asOf - 120 to asOf - 22", () => {
  const a = cohort("a", addDays(ASOF, -22), 4, 4);
  const b = cohort("b", addDays(ASOF, -120), 4, 0);
  const c = cohort("c", addDays(ASOF, -121), 4, 4);
  const d = cohort("d", addDays(ASOF, -21), 4, 0);
  const published = new Map([...a.published, ...b.published, ...c.published, ...d.published]);
  assert.deepEqual(baseline({ published, firstSeen: { ...a.firstSeen, ...c.firstSeen }, asOf: ASOF }), { share: 0.5, sample: 8 });
  assert.deepEqual(baseline({ published: new Map(), firstSeen: {}, asOf: ASOF }), { share: null, sample: 0 });
});

// ── Budget ───────────────────────────────────────────────────────────────
test("budget: allowance minus the last 7 days, floored at 0, one page per run", () => {
  const T = "2026-11-14";
  const pub = (dates) => new Map(dates.map((d, i) => [`/p${i}`, d]));
  const last7 = ["2026-11-08", "2026-11-14"]; // both inside; 11-07 is not
  const b = budget({ verdict: "open", published: pub([...last7, "2026-11-07", "2026-11-15"]), today: T });
  assert.deepEqual(b, { allowance: 7, publishedLast7: 2, budget: 5, newPagesToday: 1 });
  assert.deepEqual(budget({ verdict: "throttled", published: pub(last7), today: T }), { allowance: 2, publishedLast7: 2, budget: 0, newPagesToday: 0 });
  assert.deepEqual(budget({ verdict: "throttled", published: pub(["2026-11-10"]), today: T }), { allowance: 2, publishedLast7: 1, budget: 1, newPagesToday: 1 });
  assert.deepEqual(budget({ verdict: "closed", published: pub([...last7, "2026-11-12"]), today: T }), { allowance: 1, publishedLast7: 3, budget: 0, newPagesToday: 0 });
  assert.deepEqual(budget({ verdict: "closed", published: pub(["2026-11-07"]), today: T }), { allowance: 1, publishedLast7: 0, budget: 1, newPagesToday: 1 });
});

// ── Cohorts ──────────────────────────────────────────────────────────────
test("cohorts: one row per publish date with 7, 14 and ever counts", () => {
  const published = new Map([
    ["/a", "2026-10-01"],
    ["/b", "2026-10-01"],
    ["/c", "2026-10-01"],
    ["/d", "2026-10-20"],
  ]);
  const firstSeen = { "/a": "2026-10-05", "/b": "2026-10-12", "/c": "2026-11-01" };
  assert.deepEqual(cohorts({ published, firstSeen, asOf: ASOF }), [
    { date: "2026-10-01", pages: 3, within7: 1, within14: 2, ever: 3, ageDays: 44 },
    { date: "2026-10-20", pages: 1, within7: 0, within14: 0, ever: 0, ageDays: 25 },
  ]);
});

// ── Request list ─────────────────────────────────────────────────────────
test("sectionRank: priority sections in order, the rest, then /pt-br", () => {
  assert.equal(sectionRank("/alternatives/x"), 0);
  assert.equal(sectionRank("/compliance/x"), 7);
  assert.equal(sectionRank("/blog/x"), 8);
  assert.equal(sectionRank("/pricing-old/x"), 8);
  assert.equal(sectionRank("/pt-br/alternatives/x"), 9);
});

test("requestList: section priority, then oldest, then path; never seen and 7+ days only", () => {
  const published = new Map([
    ["/blog/old", "2026-09-01"],
    ["/pricing/b", "2026-10-01"],
    ["/pricing/a", "2026-10-01"],
    ["/pricing/older", "2026-09-15"],
    ["/alternatives/z", "2026-11-01"],
    ["/pt-br/alternatives/x", "2026-08-01"],
    ["/fix/seen", "2026-09-01"],
    ["/fix/too-new", addDays(ASOF, -6)],
    ["/fix/just-old-enough", addDays(ASOF, -7)],
  ]);
  const r = requestList({ published, firstSeen: { "/fix/seen": "2026-09-03" }, asOf: ASOF, today: ASOF });
  assert.deepEqual(
    r.requestIndexing.map((x) => x.path),
    ["/alternatives/z", "/pricing/older", "/pricing/a", "/pricing/b", "/fix/just-old-enough", "/blog/old", "/pt-br/alternatives/x"],
  );
  assert.deepEqual(r.requestIndexing[0], { path: "/alternatives/z", published: "2026-11-01", ageDays: 13 });
  assert.equal(r.neverSeenCount, 7);
  assert.deepEqual(Object.keys(r.listed), [...r.requestIndexing.map((x) => x.path)].sort());
  assert.ok(Object.values(r.listed).every((d) => d === ASOF));
});

const many = (n, section = "/compare") => new Map(Array.from({ length: n }, (_, i) => [`${section}/p${String(i).padStart(2, "0")}`, "2026-10-01"]));

test("requestList: at most 10", () => {
  const r = requestList({ published: many(15), firstSeen: {}, asOf: ASOF, today: ASOF });
  assert.equal(r.requestIndexing.length, 10);
  assert.equal(r.neverSeenCount, 15);
  assert.equal(r.requestIndexing[9].path, "/compare/p09");
});

test("requestList: a path listed in the last 14 days is skipped while 10 others remain", () => {
  const listed = { "/compare/p00": "2026-11-01", "/compare/p01": addDays(ASOF, -14), "/compare/p02": addDays(ASOF, -15) };
  const r = requestList({ published: many(15), firstSeen: {}, asOf: ASOF, today: ASOF, listed });
  const paths = r.requestIndexing.map((x) => x.path);
  assert.equal(paths.length, 10);
  assert.ok(!paths.includes("/compare/p00"));
  assert.ok(!paths.includes("/compare/p01")); // exactly 14 days ago is within the last 14 days
  assert.ok(paths.includes("/compare/p02")); // 15 days ago is eligible again
  assert.equal(r.listed["/compare/p02"], addDays(ASOF, -15)); // the first-listed date is kept
  assert.equal(r.listed["/compare/p00"], "2026-11-01"); // still never seen, so it stays listed
});

test("requestList: skipped paths fill the list when fewer than 10 would remain", () => {
  const listed = { "/compare/p00": "2026-11-10", "/compare/p01": "2026-11-11", "/compare/p02": "2026-11-12" };
  const r = requestList({ published: many(11), firstSeen: {}, asOf: ASOF, today: ASOF, listed });
  const paths = r.requestIndexing.map((x) => x.path);
  assert.equal(paths.length, 10);
  assert.deepEqual(paths.slice(0, 8), ["/compare/p03", "/compare/p04", "/compare/p05", "/compare/p06", "/compare/p07", "/compare/p08", "/compare/p09", "/compare/p10"]);
  assert.deepEqual(paths.slice(8), ["/compare/p00", "/compare/p01"]);
});

test("requestList: a listing dated today does not count as recent, so a rerun is identical", () => {
  const first = requestList({ published: many(15), firstSeen: {}, asOf: ASOF, today: ASOF });
  const again = requestList({ published: many(15), firstSeen: {}, asOf: ASOF, today: ASOF, listed: first.listed });
  assert.deepEqual(again, first);
});

test("requestList: listed drops paths that have been shown or left published.ts", () => {
  const listed = { "/compare/p00": "2026-11-01", "/compare/gone": "2026-11-01" };
  const r = requestList({ published: many(3), firstSeen: { "/compare/p00": "2026-11-05" }, asOf: ASOF, today: ASOF, listed });
  assert.deepEqual(Object.keys(r.listed), ["/compare/p01", "/compare/p02"]);
});

test("requestList: the indexable set filters the pool", () => {
  const published = many(4);
  const indexable = new Set(["/compare/p01", "/compare/p03"]);
  const r = requestList({ published, firstSeen: {}, asOf: ASOF, today: ASOF, indexable });
  assert.deepEqual(r.requestIndexing.map((x) => x.path), ["/compare/p01", "/compare/p03"]);
  assert.equal(r.neverSeenCount, 2);
});

// ── Recovered ────────────────────────────────────────────────────────────
test("recovered: never seen as of the previous asOf, seen since", () => {
  const prev = "2026-11-07";
  const published = new Map([
    ["/back", "2026-10-01"],
    ["/always", "2026-10-01"],
    ["/still-missing", "2026-10-01"],
    ["/too-new-then", "2026-11-03"],
  ]);
  const firstSeen = { "/back": "2026-11-10", "/always": "2026-10-02", "/too-new-then": "2026-11-09" };
  assert.deepEqual(recovered({ published, firstSeen, previousAsOf: prev }), ["/back"]);
  assert.deepEqual(recovered({ published, firstSeen, previousAsOf: null }), []);
});

test("buildState: recovered compares with the previous run, and a same-asOf rerun keeps that comparison", () => {
  const published = new Map([...many(6), ["/back", "2026-10-01"]]);
  const ledger = { asOf: ASOF, firstSeen: { "/back": "2026-11-12" } };
  const previous = { asOf: "2026-11-07", listed: {} };
  const s1 = buildState({ published, ledger, today: ASOF, previous });
  assert.deepEqual(s1.recovered, ["/back"]);
  assert.equal(s1.previousAsOf, "2026-11-07");
  const s2 = buildState({ published, ledger, today: ASOF, previous: s1 });
  assert.equal(stateJson(s2), stateJson(s1));
});

// ── Determinism ──────────────────────────────────────────────────────────
test("buildState and renderMarkdown are deterministic with a fixed key order", () => {
  const c = cohort("compare", addDays(ASOF, -10), 20, 1);
  const input = () => ({ published: new Map(c.published), ledger: { asOf: ASOF, firstSeen: { ...c.firstSeen } }, today: ASOF, previous: null });
  const a = buildState(input());
  const b = buildState(input());
  assert.equal(stateJson(a), stateJson(b));
  assert.equal(renderMarkdown(a), renderMarkdown(b));
  assert.deepEqual(Object.keys(a), [
    "generatedOn", "asOf", "verdict", "reason", "share", "sample", "shownWithin7", "window", "baseline", "allowance",
    "publishedLast7", "budget", "newPagesToday", "requestIndexing", "listed", "recovered", "previousAsOf", "neverSeenCount", "cohorts",
  ]);
  assert.equal(a.verdict, "closed");
  const md = renderMarkdown(a);
  assert.match(md, /^# Index governor\n\n_Generated by `node scripts\/index-governor\.mjs`\. Do not edit by hand\._/);
  assert.match(md, /\*\*Closed: 1 of 20 pages published Oct 24 to Nov 7 were shown in Google within 7 days \(5%\)/);
  assert.match(md, /```\nhttps:\/\/aifitnessapi\.com\/compare\/p01\n/);
  assert.match(md, /not filtered by the sitemap/);
  assert.doesNotMatch(md, /\u2014/);
});

// ── gsc-auth ─────────────────────────────────────────────────────────────
test("serviceAccountToken returns null when GSC_SERVICE_ACCOUNT_JSON is unset or blank", async () => {
  assert.equal(await serviceAccountToken({}), null);
  assert.equal(await serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: "  " }), null);
});

test("serviceAccountToken posts a well-formed RS256 JWT with the webmasters.readonly scope", async () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const key = { client_email: "reader@example.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) };
  const realFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ access_token: "stub-token" }), { status: 200 });
  };
  try {
    for (const raw of [JSON.stringify(key), Buffer.from(JSON.stringify(key)).toString("base64")]) {
      const before = Math.floor(Date.now() / 1000);
      const got = await serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: raw });
      assert.deepEqual(got, { token: "stub-token", account: key.client_email });
      const { url, init } = calls.at(-1);
      assert.equal(url, TOKEN_URL);
      assert.equal(init.method, "POST");
      assert.equal(init.headers["Content-Type"], "application/x-www-form-urlencoded");
      const form = new URLSearchParams(String(init.body));
      assert.equal(form.get("grant_type"), "urn:ietf:params:oauth:grant-type:jwt-bearer");
      const parts = form.get("assertion").split(".");
      assert.equal(parts.length, 3);
      const [h, p, sig] = parts;
      assert.deepEqual(JSON.parse(Buffer.from(h, "base64url")), { alg: "RS256", typ: "JWT" });
      const claims = JSON.parse(Buffer.from(p, "base64url"));
      assert.equal(claims.iss, key.client_email);
      assert.equal(claims.scope, GSC_SCOPE);
      assert.equal(claims.scope, "https://www.googleapis.com/auth/webmasters.readonly");
      assert.equal(claims.aud, TOKEN_URL);
      assert.ok(claims.iat >= before && claims.iat <= before + 5);
      assert.equal(claims.exp - claims.iat, 3600);
      assert.ok(crypto.createVerify("RSA-SHA256").update(`${h}.${p}`).verify(publicKey, Buffer.from(sig, "base64url")));
    }
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("serviceAccountToken throws, without the key, on a bad key or a refused token", async () => {
  await assert.rejects(serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: "{not json" }), /not a service-account JSON key/);
  await assert.rejects(serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: '{"client_email":"a@b"}' }), /no client_email or private_key/);
  await assert.rejects(serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: '{"client_email":"a@b","private_key":"nope"}' }), /could not sign a JWT/);
  const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" });
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ error: "invalid_grant" }), { status: 400 });
  try {
    await assert.rejects(serviceAccountToken({ GSC_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "a@b", private_key: pem }) }), (e) => {
      assert.match(e.message, /answered HTTP 400 \(invalid_grant\) for a@b/);
      assert.doesNotMatch(e.message, /PRIVATE KEY/);
      return true;
    });
  } finally {
    globalThis.fetch = realFetch;
  }
});
