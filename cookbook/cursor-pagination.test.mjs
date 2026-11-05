/**
 * cursor-pagination.test.mjs
 *
 * The contract for cursor-pagination.mjs, against fake Oura- and WHOOP-shaped
 * servers: every record exactly once and in order; the query held constant
 * except for the cursor; null, missing and empty tokens all end the walk; a
 * repeated token and an exhausted page budget stop it with a resumable error;
 * and a walk resumed from the last persisted URL finishes without re-reading
 * pages.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  OURA,
  WHOOP,
  PageBudgetError,
  PaginationLoopError,
  collectAll,
  isLastToken,
  nextPageUrl,
  paginate,
  withPageSize,
} from "./cursor-pagination.mjs";

/** A fake server: `pages` is a list of { rows, token }, keyed by the token that requests it. */
function fakeServer(cursor, pages, { itemsField = "data", lastToken = null } = {}) {
  const calls = [];
  const byToken = new Map(pages.map((p, i) => [i === 0 ? null : pages[i - 1].token, p]));
  async function getJson(url) {
    calls.push(url);
    const token = new URL(url).searchParams.get(cursor.requestParam);
    const page = byToken.get(token);
    if (!page) throw new Error(`no page for token ${token}`);
    return { [itemsField]: page.rows, [cursor.responseField]: page.token ?? lastToken };
  }
  return { getJson, calls };
}

const OURA_URL = "https://api.ouraring.com/v2/usercollection/daily_activity?start_date=2026-10-01&end_date=2026-10-16";
const WHOOP_URL = "https://api.prod.whoop.com/developer/v2/activity/sleep?start=2026-10-01T00:00:00Z&end=2026-10-16T00:00:00Z";

test("Oura: every record once, in order, ending on a null next_token", async () => {
  const s = fakeServer(OURA, [
    { rows: [1, 2], token: "a" },
    { rows: [3, 4], token: "b" },
    { rows: [5], token: null },
  ]);
  assert.deepEqual(await collectAll({ firstUrl: OURA_URL, getJson: s.getJson, cursor: OURA }), [1, 2, 3, 4, 5]);
  assert.equal(s.calls.length, 3);
  assert.equal(new URL(s.calls[1]).searchParams.get("next_token"), "a");
});

test("only the cursor changes between pages: start and end ride along", async () => {
  const s = fakeServer(WHOOP, [{ rows: ["x"], token: "t1" }, { rows: ["y"], token: "" }], { itemsField: "rows", lastToken: "" });
  await collectAll({ firstUrl: WHOOP_URL, getJson: s.getJson, cursor: WHOOP, items: (b) => b.rows });
  const [first, second] = s.calls.map((u) => new URL(u).searchParams);
  assert.equal(second.get("start"), first.get("start"));
  assert.equal(second.get("end"), first.get("end"));
  assert.equal(second.get("nextToken"), "t1");
  assert.equal(second.has("next_token"), false, "WHOOP's request parameter is nextToken, not next_token");
});

test("WHOOP: an empty next_token ends the walk", async () => {
  const s = fakeServer(WHOOP, [{ rows: [1], token: "t1" }, { rows: [2], token: "" }], { itemsField: "rows", lastToken: "" });
  assert.deepEqual(await collectAll({ firstUrl: WHOOP_URL, getJson: s.getJson, cursor: WHOOP, items: (b) => b.rows }), [1, 2]);
});

test("WHOOP: without an items() the walker refuses to guess the record field", async () => {
  const s = fakeServer(WHOOP, [{ rows: [1], token: null }]);
  await assert.rejects(collectAll({ firstUrl: WHOOP_URL, getJson: s.getJson, cursor: WHOOP }), /pass items\(body\)/);
});

test("WHOOP: a page size above 25 is clamped to WHOOP's maximum", () => {
  assert.equal(new URL(withPageSize(WHOOP_URL, WHOOP, 100)).searchParams.get("limit"), "25");
  assert.equal(new URL(withPageSize(WHOOP_URL, WHOOP, 10)).searchParams.get("limit"), "10");
  assert.equal(new URL(withPageSize(OURA_URL, OURA, 100)).searchParams.get("limit"), "100");
});

test("null, undefined and empty string are all the last page; anything else is not", () => {
  for (const t of [null, undefined, ""]) assert.equal(isLastToken(t), true);
  for (const t of ["0", "a", " "]) assert.equal(isLastToken(t), false);
});

test("a token that comes back twice stops the walk instead of looping", async () => {
  // A buggy upstream: the page requested with token "a" hands back "a" again.
  const s = fakeServer(OURA, [{ rows: [1], token: "a" }, { rows: [2], token: "a" }]);
  await assert.rejects(collectAll({ firstUrl: OURA_URL, getJson: s.getJson, cursor: OURA }), PaginationLoopError);
  assert.equal(s.calls.length, 2);
});

test("the page budget stops a walk with the URL to resume from", async () => {
  const pages = Array.from({ length: 5 }, (_, i) => ({ rows: [i], token: i < 4 ? `t${i}` : null }));
  const s = fakeServer(OURA, pages);
  const got = [];
  let err;
  try {
    for await (const p of paginate({ firstUrl: OURA_URL, getJson: s.getJson, cursor: OURA, maxPages: 2 })) got.push(...p.items);
  } catch (e) {
    err = e;
  }
  assert.ok(err instanceof PageBudgetError);
  assert.deepEqual(got, [0, 1]);
  assert.equal(new URL(err.nextUrl).searchParams.get("next_token"), "t1");
});

test("a walk resumed from the persisted nextUrl reads no page twice", async () => {
  const pages = Array.from({ length: 4 }, (_, i) => ({ rows: [i], token: i < 3 ? `t${i}` : null }));
  const s = fakeServer(OURA, pages);
  let saved = null;
  const got = [];
  try {
    for await (const p of paginate({ firstUrl: OURA_URL, getJson: s.getJson, cursor: OURA, onPage: (pg) => (saved = pg.nextUrl) })) {
      if (p.index === 2) throw new Error("worker crashed mid-page");
      got.push(...p.items);
    }
  } catch (e) {
    assert.match(e.message, /crashed/);
  }
  // The crash happened before page 2's onPage ran, so the checkpoint still points at page 2.
  assert.equal(new URL(saved).searchParams.get("next_token"), "t1");
  for await (const p of paginate({ firstUrl: OURA_URL, resumeUrl: saved, getJson: s.getJson, cursor: OURA })) got.push(...p.items);
  assert.deepEqual(got, [0, 1, 2, 3]);
});

test("a page with no record array is an error, not an empty page", async () => {
  const getJson = async () => ({ next_token: null });
  await assert.rejects(collectAll({ firstUrl: OURA_URL, getJson, cursor: OURA }), /no record array/);
});

test("nextPageUrl replaces an existing cursor rather than appending a second one", () => {
  const u = nextPageUrl(`${OURA_URL}&next_token=old`, OURA, "new");
  assert.deepEqual(new URL(u).searchParams.getAll("next_token"), ["new"]);
});
