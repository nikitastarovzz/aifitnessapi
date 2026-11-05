/**
 * The full-text answer search behind /answers-search, tested through the
 * module the page imports (src/lib/answerSearch.mjs).
 *
 *   node --test scripts/answer-search.test.mjs     (npm run test:answer-search)
 *
 * Documents are synthetic, shaped like the records in /answers/<section>.json.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { addDocs, createIndex, docsFromSection, search, sitePath, snippet, tokenize } from "../src/lib/answerSearch.mjs";

const SITE = "https://aifitnessapi.com";

const section = {
  section: "fix",
  answers: [
    {
      question: "fitbit api 410 gone",
      answer: "A 410 Gone from a Fitbit Web API endpoint after the turn-off date means the endpoint is off, not a bug in your code.",
      title: "Fitbit API 410 Gone",
      url: `${SITE}/fix/fitbit-api-410-gone`,
      last_reviewed: "2026-11-02",
      first_party: false,
      faqs: [
        { question: "Will retrying help?", answer: "No. Retrying a request that returns 410 Gone will keep failing; migrate to the Google Health API instead.", url: `${SITE}/fix/fitbit-api-410-gone#faq-1` },
        { question: "Does the refresh token still work?", answer: "Refresh tokens issued by the Fitbit OAuth endpoints stop working at the turn-off as well.", url: `${SITE}/fix/fitbit-api-410-gone#faq-2` },
      ],
    },
    {
      question: "healthkit step count query",
      answer: "Use HKStatisticsQuery with cumulativeSum for stepCount, because Apple describes step count as cumulative.",
      title: "Querying stepCount in HealthKit",
      url: `${SITE}/healthkit-queries/step-count`,
      last_reviewed: "2026-10-01",
      first_party: false,
      faqs: [],
    },
  ],
};
const changes = {
  section: "changes",
  changes: [{ date: "2026-11-02", title: "Fitbit Web API turn-off", summary: "Google says requests will fail with 410 Gone.", status: "confirmed", url: `${SITE}/fitbit-api-shutdown`, verified_on: "2026-10-31" }],
  watching: [{ title: "Pricing model", summary: "Google has not published quotas.", url: `${SITE}/google-health-api` }],
};
const posts = {
  section: "blog",
  posts: [{ title: "A post", description: "About sleep stages.", url: `${SITE}/blog/a-post`, last_reviewed: "2026-09-01", faqs: [{ question: "Q?", answer: "Sleep stage mapping differs." }] }],
};

function build() {
  const idx = createIndex();
  addDocs(idx, docsFromSection(section, SITE));
  addDocs(idx, docsFromSection(changes, SITE));
  addDocs(idx, docsFromSection(posts, SITE));
  return idx;
}

test("tokenize lowercases, drops stop words and spells out identifiers", () => {
  assert.deepEqual(tokenize("What is the 410 Gone?"), ["410", "gone"]);
  assert.deepEqual(tokenize("stepCount"), ["stepcount", "step", "count"]);
  assert.deepEqual(tokenize("HKUnit"), ["hkunit", "hk", "unit"]);
  assert.deepEqual(tokenize(""), []);
});

test("documents come out of every section shape, with site paths and FAQ anchors", () => {
  const docs = docsFromSection(section, SITE);
  assert.equal(docs.length, 4);
  assert.deepEqual(docs.map((d) => d.kind), ["answer", "faq", "faq", "answer"]);
  assert.equal(docs[1].href, "/fix/fitbit-api-410-gone#faq-1");
  assert.equal(docs[1].page, "Fitbit API 410 Gone");
  const ch = docsFromSection(changes, SITE);
  assert.deepEqual(ch.map((d) => d.kind), ["change", "change"]);
  assert.equal(ch[0].href, "/fitbit-api-shutdown");
  const ps = docsFromSection(posts, SITE);
  assert.equal(ps.length, 2);
  assert.equal(ps[1].href, "/blog/a-post");
  assert.equal(sitePath("https://example.com/x", SITE), "https://example.com/x");
  assert.equal(sitePath(`${SITE}`, SITE), "/");
});

test("a word deep inside an FAQ answer finds that FAQ, ranked first", () => {
  const r = search(build(), "refresh token");
  assert.ok(r.length > 0);
  assert.equal(r[0].doc.href, "/fix/fitbit-api-410-gone#faq-2");
});

test("question and title matches outrank body-only matches", () => {
  const r = search(build(), "410 gone");
  assert.equal(r[0].doc.title, "Fitbit API 410 Gone");
});

test("results matching more of the words come first, and partial matches still appear", () => {
  const r = search(build(), "retrying google migrate");
  assert.equal(r[0].doc.href, "/fix/fitbit-api-410-gone#faq-1");
  const loose = search(build(), "retrying nonexistentword");
  assert.ok(loose.some((x) => x.doc.href.endsWith("#faq-1")));
});

test("the last word matches as a prefix while typing, an identifier matches its words", () => {
  const typing = search(build(), "cumul");
  assert.equal(typing[0].doc.href, "/healthkit-queries/step-count");
  assert.equal(search(build(), "cumul ").length, 0);
  const ident = search(build(), "step count");
  assert.equal(ident[0].doc.href, "/healthkit-queries/step-count");
});

test("an empty or stop-word query returns nothing; limit is respected", () => {
  assert.deepEqual(search(build(), ""), []);
  assert.deepEqual(search(build(), "the and of"), []);
  assert.equal(search(build(), "fitbit", { limit: 2 }).length, 2);
  assert.deepEqual(search(createIndex(), "fitbit"), []);
});

test("snippets mark the matched words and window long text", () => {
  const segs = snippet("Retrying a request that returns 410 Gone will keep failing.", "410 gone");
  assert.deepEqual(segs.filter((s) => s.hit).map((s) => s.t), ["410", "Gone"]);
  assert.equal(segs.map((s) => s.t).join(""), "Retrying a request that returns 410 Gone will keep failing.");
  const long = `${"word ".repeat(200)}target ${"tail ".repeat(200)}`;
  const w = snippet(long, "target", 100);
  const text = w.map((s) => s.t).join("");
  assert.ok(text.startsWith("…") && text.endsWith("…"));
  assert.ok(text.length <= 104);
  assert.ok(w.some((s) => s.hit && s.t === "target"));
});
