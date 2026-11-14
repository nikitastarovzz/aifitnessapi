/**
 * The landing-source classifier, the funder-link helper and the picker-answer
 * property, tested through
 * the same module the browser runs (src/lib/measure.mjs).
 *
 *   node --test scripts/measure.test.mjs     (npm run test:measure)
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  classifySource,
  funderHref,
  isFunderUrl,
  FUNDER_PLACEMENTS,
  PICKER_KEY,
  pickerAnswerId,
  parsePickerId,
  withPicker,
} from "../src/lib/measure.mjs";

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

test("pickerAnswerId joins the three option values", () => {
  assert.equal(pickerAnswerId("ai-motion", "ios", "ship-fast"), "ai-motion.ios.ship-fast");
  assert.equal(
    pickerAnswerId("specific-metric", "cross-platform", "avoid-lock-in"),
    "specific-metric.cross-platform.avoid-lock-in",
  );
  assert.equal(PICKER_KEY, "aifa_picker");
});

test("pickerAnswerId rejects anything that is not a short option slug", () => {
  assert.equal(pickerAnswerId("ai-motion", "ios", null), null);
  assert.equal(pickerAnswerId("ai-motion", "", "ship-fast"), null);
  assert.equal(pickerAnswerId(undefined, "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("AI-Motion", "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("ai motion", "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("someone@example.com", "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("ai.motion", "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("-ai", "ios", "ship-fast"), null);
  assert.equal(pickerAnswerId("a".repeat(25), "ios", "ship-fast"), null);
});

test("parsePickerId re-checks a stored value", () => {
  assert.equal(parsePickerId("nutrition.web.low-cost"), "nutrition.web.low-cost");
  assert.equal(parsePickerId(null), null);
  assert.equal(parsePickerId(""), null);
  assert.equal(parsePickerId("nutrition.web"), null);
  assert.equal(parsePickerId("nutrition.web.low-cost.extra"), null);
  assert.equal(parsePickerId("nutrition.web.<script>"), null);
  assert.equal(parsePickerId(42), null);
});

test("withPicker adds the answer id only when there is a valid one", () => {
  const cta = { id: "picker-result", source: "spoke-inline", page: "/picker" };
  assert.deepEqual(withPicker(cta, "ai-motion.ios.ship-fast"), { ...cta, picker: "ai-motion.ios.ship-fast" });
  const funder = { placement: "kinestex_note", page: "/motion" };
  assert.deepEqual(withPicker(funder, "ai-motion.android.data-depth"), {
    ...funder,
    picker: "ai-motion.android.data-depth",
  });
  // No answer, no property — never an empty one.
  assert.deepEqual(withPicker(cta, null), cta);
  assert.ok(!("picker" in withPicker(cta, null)));
  assert.ok(!("picker" in withPicker(cta, "free text from somewhere")));
  // Never mutates the caller's object, never overwrites an explicit value.
  const before = { ...cta };
  withPicker(cta, "ai-motion.ios.ship-fast");
  assert.deepEqual(cta, before);
  assert.equal(withPicker({ ...cta, picker: "x.y.z" }, "ai-motion.ios.ship-fast").picker, "x.y.z");
});

test("every picker answer has an id (option values read from src/lib/picker.ts)", () => {
  // picker.ts is TypeScript, so its option arrays are read as text: a new
  // option value that is not a short hyphenated slug would otherwise drop
  // the picker property silently.
  const src = readFileSync(new URL("../src/lib/picker.ts", import.meta.url), "utf8");
  const values = (name) => {
    const block = src.match(new RegExp(`export const ${name}[^=]*= \\[([\\s\\S]*?)\\n\\];`));
    assert.ok(block, name);
    return [...block[1].matchAll(/value: "([^"]+)"/g)].map((m) => m[1]);
  };
  const jobs = values("JOB_OPTIONS");
  const platforms = values("PLATFORM_OPTIONS");
  const priorities = values("PRIORITY_OPTIONS");
  assert.equal(jobs.length + platforms.length + priorities.length, 16);
  const ids = new Set();
  for (const j of jobs) for (const p of platforms) for (const pr of priorities) {
    const id = pickerAnswerId(j, p, pr);
    assert.ok(id, `${j} ${p} ${pr}`);
    assert.equal(parsePickerId(id), id);
    ids.add(id);
  }
  assert.equal(ids.size, jobs.length * platforms.length * priorities.length);
});
