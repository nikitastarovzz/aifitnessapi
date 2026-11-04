/**
 * Measurement helpers: where a visit came from, and the tagged link to the
 * site's funder.
 *
 * One module, imported by the client tracker (src/components/CtaTracker.tsx),
 * the components that link to kinestex.com, and scripts/measure.test.mjs, so
 * the test runs exactly the rules a reader's browser runs. Plain ESM, no
 * dependencies, no DOM: every function takes strings and returns values.
 *
 * Nothing here identifies a person. classifySource() reduces a referrer and a
 * utm_source to a bucket and a short label from a fixed list; the full
 * referrer URL, its query string and any free-text utm value are never
 * returned, so they cannot reach an analytics event.
 *
 * ops/MEASUREMENT.md documents the events and how to read them.
 */

/** @typedef {"ai_assistant" | "search" | "other" | "direct" | "internal"} SourceClass */

/**
 * AI assistants, matched on the referrer's host (and path where the host is
 * shared with a search product) or on the utm_source value an assistant
 * appends to the links it cites (ChatGPT, for one, adds utm_source=chatgpt.com).
 *
 * `hosts` match the hostname exactly or as a parent domain (www.perplexity.ai
 * matches perplexity.ai). `paths` restricts a host to path prefixes, and
 * `query` to a referrer query string matching the pattern (DuckDuckGo's AI
 * chat is duckduckgo.com/?ia=chat); the query is tested, never returned. `utm`
 * lists the lower-cased utm_source values taken to mean the assistant.
 *
 * Browsers send only the origin of a cross-site referrer by default
 * (strict-origin-when-cross-origin), so a path rule matches only when the
 * referring page sent its full URL. Where it does not — Bing's chat, Kagi's
 * Assistant, DuckDuckGo's AI chat on duckduckgo.com — the visit falls to the
 * host's search bucket. That is an undercount of AI, never an overcount.
 */
const AI = [
  { source: "chatgpt", hosts: ["chatgpt.com", "chat.openai.com"], utm: ["chatgpt.com", "chatgpt", "chat.openai.com", "openai"] },
  { source: "perplexity", hosts: ["perplexity.ai"], utm: ["perplexity", "perplexity.ai", "www.perplexity.ai"] },
  { source: "claude", hosts: ["claude.ai"], utm: ["claude", "claude.ai"] },
  { source: "copilot", hosts: ["copilot.microsoft.com", "copilot.cloud.microsoft"], utm: ["copilot", "copilot.microsoft.com", "bing_chat"] },
  { source: "copilot", hosts: ["bing.com"], paths: ["/chat"] },
  { source: "gemini", hosts: ["gemini.google.com", "bard.google.com"], utm: ["gemini", "gemini.google.com", "bard"] },
  { source: "you", hosts: ["you.com"], utm: ["you.com", "you"] },
  { source: "phind", hosts: ["phind.com"], utm: ["phind", "phind.com"] },
  { source: "kagi_assistant", hosts: ["kagi.com"], paths: ["/assistant"], utm: ["kagi_assistant"] },
  { source: "duckduckgo_ai", hosts: ["duck.ai"], utm: ["duck.ai", "duckassist"] },
  { source: "duckduckgo_ai", hosts: ["duckduckgo.com"], query: /(^|&)ia=chat(&|$)/ },
  { source: "deepseek", hosts: ["chat.deepseek.com"], utm: ["deepseek", "chat.deepseek.com"] },
  { source: "grok", hosts: ["grok.com"], utm: ["grok", "grok.com"] },
  { source: "meta_ai", hosts: ["meta.ai"], utm: ["meta.ai", "meta_ai"] },
  { source: "mistral", hosts: ["chat.mistral.ai"], utm: ["mistral", "chat.mistral.ai", "le_chat"] },
];

/**
 * Search engines. Google is matched on any google.<tld> or google.co.<cc>
 * host except the assistant hosts above, which are checked first.
 */
const SEARCH = [
  { source: "google", test: (h) => /(^|\.)google\.(com?\.)?[a-z]{2,3}$/.test(h) },
  { source: "bing", hosts: ["bing.com"] },
  { source: "duckduckgo", hosts: ["duckduckgo.com"] },
  { source: "kagi", hosts: ["kagi.com"] },
  { source: "yahoo", hosts: ["search.yahoo.com", "yahoo.com"] },
  { source: "ecosia", hosts: ["ecosia.org"] },
  { source: "brave", hosts: ["search.brave.com"] },
  { source: "yandex", test: (h) => /(^|\.)yandex\.[a-z]{2,3}$/.test(h) },
  { source: "baidu", hosts: ["baidu.com"] },
];

const SEARCH_UTM = { google: "google", bing: "bing", duckduckgo: "duckduckgo", ddg: "duckduckgo", kagi: "kagi" };

function hostMatches(host, list) {
  return list.some((d) => host === d || host.endsWith(`.${d}`));
}

function parseUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return { host: u.hostname.toLowerCase().replace(/\.$/, ""), path: u.pathname.toLowerCase(), query: u.search.slice(1) };
  } catch {
    return null;
  }
}

function aiFromReferrer(ref) {
  for (const a of AI) {
    if (!hostMatches(ref.host, a.hosts)) continue;
    if (a.paths && !a.paths.some((p) => ref.path === p || ref.path.startsWith(`${p}/`))) continue;
    if (a.query && !a.query.test(ref.query)) continue;
    return a.source;
  }
  return null;
}

function aiFromUtm(utm) {
  for (const a of AI) if (a.utm && a.utm.includes(utm)) return a.source;
  return null;
}

function searchFromReferrer(ref) {
  for (const s of SEARCH) {
    if (s.test ? s.test(ref.host) : hostMatches(ref.host, s.hosts)) return s.source;
  }
  return null;
}

/**
 * Classify a landing.
 *
 * @param {{ referrer?: string | null, utmSource?: string | null, siteHost?: string | null }} input
 *   `referrer` is document.referrer; `utmSource` the landing URL's utm_source;
 *   `siteHost` this site's hostname, so a same-site referrer reads as internal.
 * @returns {{ source_class: SourceClass, source: string }}
 *   `source` is a label from the fixed lists above, "utm" for an unrecognised
 *   utm_source, the referrer's registrable-looking host for an unrecognised
 *   referrer (host only, never path or query), or "none".
 *
 * Order: an AI match from either signal wins, because an assistant's cited
 * link often reaches the page through an intermediate redirect or with its
 * referrer stripped, and the utm_source it appends is then the only trace.
 * Search comes next, then anything else.
 */
export function classifySource({ referrer = "", utmSource = "", siteHost = "" } = {}) {
  const utm = typeof utmSource === "string" ? utmSource.trim().toLowerCase().slice(0, 64) : "";
  const ref = parseUrl(referrer);
  const self = (siteHost || "").toLowerCase().replace(/^www\./, "");

  const aiRef = ref && aiFromReferrer(ref);
  if (aiRef) return { source_class: "ai_assistant", source: aiRef };
  const aiUtm = utm && aiFromUtm(utm);
  if (aiUtm) return { source_class: "ai_assistant", source: aiUtm };

  if (ref && self && (ref.host === self || ref.host.endsWith(`.${self}`))) {
    return { source_class: "internal", source: "self" };
  }

  const searchRef = ref && searchFromReferrer(ref);
  if (searchRef) return { source_class: "search", source: searchRef };
  if (utm && SEARCH_UTM[utm]) return { source_class: "search", source: SEARCH_UTM[utm] };

  if (ref) return { source_class: "other", source: ref.host.replace(/^www\./, "").slice(0, 64) };
  if (utm) return { source_class: "other", source: "utm" };
  return { source_class: "direct", source: "none" };
}

// ── The funder link ──────────────────────────────────────────────────────

export const FUNDER_ORIGIN = "https://kinestex.com";

/**
 * Where on the site a funder link sits. utm_campaign carries this, so the
 * funder's analytics can tell a contextual note from the footer credit.
 * Add a placement here, not ad hoc in a component.
 */
export const FUNDER_PLACEMENTS = /** @type {const} */ (["kinestex_note", "footer_funding", "methodology"]);

/**
 * A kinestex.com URL tagged for the funder's analytics:
 * utm_source=aifitnessapi, utm_medium=referral, utm_campaign=<placement>,
 * utm_content=<page path>. The path is this site's pathname only (no query,
 * no fragment), so nothing about the reader rides along.
 *
 * @param {string} placement one of FUNDER_PLACEMENTS
 * @param {string} pagePath the linking page's pathname, e.g. "/challenge"
 * @param {string} [target] a path on kinestex.com, default "/"
 */
export function funderHref(placement, pagePath, target = "/") {
  if (!FUNDER_PLACEMENTS.includes(placement)) throw new Error(`funderHref: unknown placement ${placement}`);
  const u = new URL(target, FUNDER_ORIGIN);
  const path = (pagePath || "/").split(/[?#]/)[0] || "/";
  u.searchParams.set("utm_source", "aifitnessapi");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", placement);
  u.searchParams.set("utm_content", path);
  return u.toString();
}

/** True for a link to the funder's site (kinestex.com or a subdomain). */
export function isFunderUrl(href) {
  const u = parseUrl(href);
  return !!u && (u.host === "kinestex.com" || u.host.endsWith(".kinestex.com"));
}
