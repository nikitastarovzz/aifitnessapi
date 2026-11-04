/**
 * The landing-source classifier and the funder-link helper, tested through
 * the same module the browser runs (src/lib/measure.mjs).
 *
 *   node --test scripts/measure.test.mjs     (npm run test:measure)
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { classifySource, funderHref, isFunderUrl, FUNDER_PLACEMENTS } from "../src/lib/measure.mjs";

const SITE = "aifitnessapi.com";
const c = (referrer, utmSource = "") => classifySource({ referrer, utmSource, siteHost: SITE });

test("AI assistants by referrer", () => {
  const cases = [
    ["https://chatgpt.com/", "chatgpt"],
    ["https://chat.openai.com/c/abc", "chatgpt"],
    ["https://www.perplexity.ai/search?q=x", "perplexity"],
    ["https://perplexity.ai/", "perplexity"],
    ["https://claude.ai/", "claude"],
    ["https://copilot.microsoft.com/", "copilot"],
    ["https://www.bing.com/chat?q=x", "copilot"],
    ["https://gemini.google.com/app", "gemini"],
    ["https://you.com/search?q=x", "you"],
    ["https://www.phind.com/", "phind"],
    ["https://kagi.com/assistant/123", "kagi_assistant"],
    ["https://duck.ai/", "duckduckgo_ai"],
    ["https://duckduckgo.com/?q=x&ia=chat", "duckduckgo_ai"],
    ["https://chat.deepseek.com/", "deepseek"],
  ];
  for (const [ref, source] of cases) {
    assert.deepEqual(c(ref), { source_class: "ai_assistant", source }, ref);
  }
});

test("AI assistants by utm_source, case-insensitive", () => {
  assert.deepEqual(c("", "chatgpt.com"), { source_class: "ai_assistant", source: "chatgpt" });
  assert.deepEqual(c("", "ChatGPT.com"), { source_class: "ai_assistant", source: "chatgpt" });
  assert.deepEqual(c("", "perplexity"), { source_class: "ai_assistant", source: "perplexity" });
  assert.deepEqual(c("", " claude.ai "), { source_class: "ai_assistant", source: "claude" });
  // An AI utm wins over a search or internal referrer: the assistant's
  // appended tag is the stronger signal when a redirect sits in between.
  assert.deepEqual(c("https://www.google.com/", "chatgpt.com"), { source_class: "ai_assistant", source: "chatgpt" });
  assert.deepEqual(c("https://aifitnessapi.com/x", "chatgpt.com"), { source_class: "ai_assistant", source: "chatgpt" });
});

test("search engines", () => {
  const cases = [
    ["https://www.google.com/", "google"],
    ["https://www.google.co.uk/", "google"],
    ["https://www.google.com.br/", "google"],
    ["https://google.de/", "google"],
    ["https://www.bing.com/", "bing"],
    ["https://www.bing.com/search?q=x", "bing"],
    ["https://duckduckgo.com/", "duckduckgo"],
    ["https://duckduckgo.com/?q=x", "duckduckgo"],
    ["https://kagi.com/", "kagi"],
    ["https://search.brave.com/search?q=x", "brave"],
    ["https://www.ecosia.org/", "ecosia"],
  ];
  for (const [ref, source] of cases) {
    assert.deepEqual(c(ref), { source_class: "search", source }, ref);
  }
  assert.deepEqual(c("", "google"), { source_class: "search", source: "google" });
});

test("origin-only referrers fall to search, never to AI", () => {
  // Default referrer policy trims cross-site referrers to the origin.
  assert.equal(c("https://www.bing.com/").source_class, "search");
  assert.equal(c("https://kagi.com/").source_class, "search");
  assert.equal(c("https://duckduckgo.com/").source_class, "search");
});

test("look-alike hosts are not matched", () => {
  assert.equal(c("https://notchatgpt.com/").source_class, "other");
  assert.equal(c("https://claude.ai.example.com/").source_class, "other");
  assert.equal(c("https://google.example.com/").source_class, "other");
  assert.equal(c("https://mygoogle.com/").source_class, "other");
});

test("other, internal and direct", () => {
  assert.deepEqual(c("https://www.reddit.com/r/x/comments/abc?utm=1"), { source_class: "other", source: "reddit.com" });
  assert.deepEqual(c("https://aifitnessapi.com/guides"), { source_class: "internal", source: "self" });
  assert.deepEqual(c("https://www.aifitnessapi.com/"), { source_class: "internal", source: "self" });
  assert.deepEqual(c(""), { source_class: "direct", source: "none" });
  assert.deepEqual(c("", "newsletter-2026-11"), { source_class: "other", source: "utm" });
  assert.deepEqual(c("not a url"), { source_class: "direct", source: "none" });
  assert.deepEqual(c("android-app://com.google.android.gm/"), { source_class: "direct", source: "none" });
  assert.deepEqual(classifySource(), { source_class: "direct", source: "none" });
});

test("no path, query or free text leaks into the label", () => {
  const r = c("https://news.ycombinator.com/item?id=123&user=someone");
  assert.equal(r.source, "news.ycombinator.com");
  assert.equal(c("", "someone@example.com").source, "utm");
});

test("funderHref tags every placement", () => {
  for (const p of FUNDER_PLACEMENTS) {
    const u = new URL(funderHref(p, "/motion/movenet-models"));
    assert.equal(u.origin, "https://kinestex.com");
    assert.equal(u.searchParams.get("utm_source"), "aifitnessapi");
    assert.equal(u.searchParams.get("utm_medium"), "referral");
    assert.equal(u.searchParams.get("utm_campaign"), p);
    assert.equal(u.searchParams.get("utm_content"), "/motion/movenet-models");
  }
});

test("funderHref strips query and fragment from the page path and rejects unknown placements", () => {
  const u = new URL(funderHref("footer_funding", "/challenge?utm_source=chatgpt.com#x"));
  assert.equal(u.searchParams.get("utm_content"), "/challenge");
  assert.equal(new URL(funderHref("footer_funding", "")).searchParams.get("utm_content"), "/");
  assert.throws(() => funderHref("banner", "/"));
});

test("isFunderUrl", () => {
  assert.ok(isFunderUrl("https://kinestex.com/?utm_source=aifitnessapi"));
  assert.ok(isFunderUrl("https://www.kinestex.com/docs"));
  assert.ok(!isFunderUrl("https://kinestex.com.evil.example/"));
  assert.ok(!isFunderUrl("/about#funding"));
  assert.ok(!isFunderUrl("mailto:nikita@kinestex.com"));
});
