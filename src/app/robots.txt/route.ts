import { absoluteUrl } from "@/lib/site";

/**
 * Crawler policy — GEO-deliberate, and hand-rendered rather than generated
 * from Next's metadata object so it can carry comments. Those comments are
 * the point: robots.txt is the one file every crawler fetches first, so it is
 * where we advertise the machine-readable surfaces.
 *
 * This site exists to be read AND cited, so AI crawlers are welcomed by name
 * rather than left to the wildcard: an explicit per-agent allow is
 * unambiguous under any future default, and documents the policy in the file
 * everyone checks. The named list is drawn from the maintained ai.robots.txt
 * registry, filtered to agents that plausibly produce a citation — assistant
 * fetchers, search indexers, and the training crawlers behind them.
 *
 * Rule of the house (ops/GEO.md): never add a disallow for an AI agent
 * without a written decision — blocking citation traffic is a product
 * change, not a config tweak.
 */
export const dynamic = "force-static";

/**
 * The one rule list every group gets, the wildcard included.
 *
 * A crawler follows the one group that names it, not that group plus the
 * `User-agent: *` rules, so a named group is a full override of the wildcard.
 * When each group carried its own literal "Allow: /", a Disallow added under
 * `*` would have silently skipped every named agent in AI_CRAWLERS. Emitting
 * every group from this array means a rule added here reaches all of them.
 *
 * Before adding anything:
 * - A Disallow here applies to every AI agent above, which ops/GEO.md ("Never,
 *   without a written decision in this file") forbids until the owner's
 *   decision is recorded there. A rule meant only for non-AI crawlers is the
 *   same decision, because this list is deliberately shared.
 * - Never disallow /s or /search. Both are kept out of the index by a noindex
 *   meta tag, and a crawler that is disallowed never fetches the page, so it
 *   never sees the noindex — the URL can then be indexed from links alone.
 *
 * The type keeps entries to path rules; non-path lines (Sitemap) are emitted
 * once, outside the groups.
 */
const RULES: readonly `${"Allow" | "Disallow"}: /${string}`[] = ["Allow: /"];

/** Grouped for legibility; every group gets the same RULES. */
const AI_CRAWLERS: [string, string[]][] = [
  [
    "OpenAI",
    ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ChatGPT Agent", "Operator"],
  ],
  [
    "Anthropic",
    ["ClaudeBot", "Claude-User", "Claude-SearchBot", "Claude-Web", "anthropic-ai"],
  ],
  [
    "Google",
    [
      "Google-Extended",
      "GoogleOther",
      "Google-NotebookLM",
      "Gemini-Deep-Research",
      "GoogleAgent-URLContext",
      "Google-CloudVertexBot",
    ],
  ],
  ["Apple", ["Applebot", "Applebot-Extended"]],
  ["Perplexity", ["PerplexityBot", "Perplexity-User"]],
  ["Meta", ["meta-externalagent", "meta-externalfetcher", "meta-webindexer", "FacebookBot"]],
  // `bingbot` is Bing's web-crawler token, and Bing's index is what its
  // assistant answers from — so this is a search allow and an AI allow in
  // one group. It was already allowed, via `User-agent: *`, which has only
  // ever carried `Allow: /`; naming it changes no rule (the group gets the
  // same shared RULES, and qa's GEO-ROBOTS-UNIFORM holds every group to the
  // `*` list). What it changes is legibility in the file Bing fetches first,
  // and it puts Bing inside the "a Disallow here reaches every named agent"
  // rule above instead of outside it.
  //
  // Deliberately no Crawl-delay. Bing honours it, and this site has no Bing
  // presence to protect — slowing the one engine we are trying to be crawled
  // by is the opposite of the goal. If Bing ever does need throttling, that
  // belongs in Bing Webmaster Tools' own crawl settings, where it can be
  // changed without a deploy (ops/BING.md).
  ["Microsoft Bing", ["bingbot"]],
  ["Microsoft / Amazon", ["AzureAI-SearchBot", "Amazonbot", "Amzn-SearchBot", "bedrockbot"]],
  [
    "Other assistants",
    [
      "MistralAI-User",
      "DuckAssistBot",
      "cohere-ai",
      "DeepSeekBot",
      "Kimi-User",
      "TongyiBot",
      "YiyanBot",
      "PhindBot",
      "LinerBot",
      "Andibot",
      "YouBot",
      "iAskBot",
      "Bravebot",
      "kagi-fetcher",
    ],
  ],
  [
    "Retrieval providers (power third-party RAG apps)",
    ["ExaBot", "ExaSearchBot", "LinkupBot", "TavilyBot", "FirecrawlAgent", "Diffbot"],
  ],
  [
    "Open datasets and research corpora",
    ["CCBot", "AI2Bot", "Ai2Bot-Dolma", "ICC-Crawler", "Timpibot", "omgili", "omgilibot", "Webzio-Extended", "SBIntuitionsBot"],
  ],
];

export function GET(): Response {
  const lines: string[] = [
    "# aifitnessapi.com — AI crawlers welcome.",
    "#",
    "# Machine-readable surfaces (no directive exists for these; listed so you",
    "# do not have to guess):",
    `#   Site map for LLMs .......... ${absoluteUrl("/llms.txt")}`,
    `#   Full text for LLMs ......... ${absoluteUrl("/llms-full.txt")}`,
    `#   Structured answer index .... ${absoluteUrl("/answers.json")}`,
    `#   Ecosystem changes feed ..... ${absoluteUrl("/changes.xml")}`,
    `#   Blog feed (JSON Feed 1.1) .. ${absoluteUrl("/feed.json")}`,
    `#   Per-section RSS ............ ${absoluteUrl("/feeds/<cluster>.xml")}`,
    `#   Open datasets (CC BY 4.0) .. ${absoluteUrl("/state-of-fitness-apis-2026")}`,
    "#",
    "# Markdown mirrors live at the page's own URL with .md appended, per the",
    "# llms.txt convention: every cluster page",
    "# (e.g. /devices/ftms-fitness-machine-service.md), every cluster hub",
    "# (/<cluster>.md), the blog and its posts (/blog.md, /blog/<slug>.md),",
    "# and a whole-site index at /index.md. Other pages (tools, datasets,",
    "# glossary, /apis product pages) have no markdown mirror.",
    "#",
    "# Attribution: quote freely, cite the canonical URL. This site is funded",
    "# by KinesteX; pages covering KinesteX are flagged first_party in",
    "# answers.json and carry a disclosure in the page itself.",
    "",
  ];

  // The wildcard is just the last group, built the same way, so it cannot
  // drift from the named ones.
  const groups: [string, string[]][] = [...AI_CRAWLERS, ["Everyone else", ["*"]]];
  for (const [group, agents] of groups) {
    lines.push(`# ${group}`);
    for (const ua of agents) {
      lines.push(`User-agent: ${ua}`);
    }
    lines.push(...RULES, "");
  }

  // No `Host:` line. It is not a standard robots.txt directive, and it was a
  // second place stating the canonical host: that has exactly one home, the
  // Vercel domain settings (see the redirects note in next.config.ts — two
  // places disagreeing about the host is how the redirect loop happened).
  lines.push(`Sitemap: ${absoluteUrl("/sitemap.xml")}`, "");

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
