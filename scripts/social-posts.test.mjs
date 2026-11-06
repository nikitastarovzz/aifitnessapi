/**
 * scripts/social-posts.mjs — the generator behind ops/social/posts-<date>.md.
 *
 *   node --test scripts/social-posts.test.mjs     (npm run test:social)
 *
 * Every change entry from the last 30 days (relative to the newest entry)
 * must produce a post that lints clean: within X's 280 as X counts it, the
 * UTM link on both variants, no hype word.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  changePost,
  pagePost,
  lint,
  xLength,
  withUtm,
  deHype,
  readMeta,
  daysBefore,
  sentences,
  clauses,
  X_LIMIT,
} from "./social-posts.mjs";

const { CHANGE_EVENTS } = await import(new URL("../src/data/changes.ts", import.meta.url).href);

test("UTM link carries source and medium", () => {
  const u = withUtm("/changes", "x", "c1");
  assert.equal(u, "https://aifitnessapi.com/changes?utm_source=x&utm_medium=social&utm_campaign=c1");
  assert.match(withUtm("/a?b=1", "linkedin"), /\?b=1&utm_source=linkedin&utm_medium=social$/);
});

test("X length counts a URL as 23 characters", () => {
  assert.equal(xLength("ab https://example.com/" + "x".repeat(200)), 3 + 23);
});

test("ranking words come out of titles", () => {
  assert.equal(deHype("The Best Fitbit API Alternatives (2026)"), "Fitbit API Alternatives (2026)");
  assert.equal(deHype("Garmin vs Oura"), "Garmin vs Oura");
});

test("sentences split after a closing quote", () => {
  assert.deepEqual(sentences('It says "keeps working today." Then it stops.'), ['It says "keeps working today."', "Then it stops."]);
});

test("dates", () => {
  assert.equal(daysBefore("2026-11-06", 30), "2026-10-07");
});

test("every recent change yields a postable pair", () => {
  const newest = CHANGE_EVENTS.map((e) => e.sortDate).sort().at(-1);
  const recent = CHANGE_EVENTS.filter((e) => e.sortDate >= daysBefore(newest, 30));
  assert.ok(recent.length > 0);
  for (const e of recent) {
    const p = changePost(e, "t");
    assert.deepEqual(lint(p), [], `${e.title}: ${lint(p).join("; ")}`);
    assert.ok(p.x.startsWith(e.title), "X post leads with the entry's own title");
    assert.ok(p.linkedin.includes("KinesteX"), "LinkedIn post carries the disclosure");
  }
});

test("a very long summary still fits X by dropping whole sentences", () => {
  const e = { title: "T", date: "2026-11-01", sortDate: "2026-11-01", status: "confirmed", summary: "A sentence of moderate length here. ".repeat(40), page: { href: "/changes", label: "Changes" } };
  const p = changePost(e, "t");
  assert.ok(xLength(p.x) <= X_LIMIT);
  assert.deepEqual(lint(p), []);
});

test("a page post uses the built title and description, minus hype", () => {
  const html = '<html><head><title>The Best Thing Ever (2026) | AIFitnessAPI</title><meta name="description" content="Compare A &amp; B on price."/></head></html>';
  const m = readMeta(html);
  assert.deepEqual(m, { title: "The Best Thing Ever (2026)", description: "Compare A & B on price." });
  const p = pagePost("x/y", "2026-11-05", m.title, m.description, "t");
  assert.match(p.x, /^New on the site: Thing Ever \(2026\)\. Compare A & B on price\./);
  assert.deepEqual(lint(p), []);
});

test("a sentence too long for X is cut at a clause outside quotes, not reworded", () => {
  assert.deepEqual(clauses('Google now gives November 2 as the turn-off: "A: b; c." Then.'), ["Google now gives November 2 as the turn-off."]);
  const e = { title: "T", date: "2026-11-02", sortDate: "2026-11-02", status: "confirmed", summary: `Google's page now gives November 2, 2026 as the turn-off: "${"x ".repeat(200)}"`, page: { href: "/changes", label: "Changes" } };
  const p = changePost(e, "t");
  assert.match(p.x, /^T \(2026-11-02\): Google's page now gives November 2, 2026 as the turn-off\./);
  assert.deepEqual(lint(p), []);
});

test("lint catches hype and missing UTM", () => {
  const bad = { key: "k", x: "The best API!", linkedin: "nothing" };
  const problems = lint(bad).join(" ");
  assert.match(problems, /contains/);
  assert.match(problems, /lacks its UTM/);
});
