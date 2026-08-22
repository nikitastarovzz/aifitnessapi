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

/** Grouped for legibility; every group is allowed identically. */
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
    "# Every page is also served as markdown at its own URL with .md appended",
    "# (e.g. /devices/ftms-fitness-machine-service.md), per the llms.txt",
    "# convention. Directory URLs use /index.md and /<cluster>.md.",
    "#",
    "# Attribution: quote freely, cite the canonical URL. This site is funded",
    "# by KinesteX; pages covering KinesteX are flagged first_party in",
    "# answers.json and carry a disclosure in the page itself.",
    "",
  ];

  for (const [group, agents] of AI_CRAWLERS) {
    lines.push(`# ${group}`);
    for (const ua of agents) {
      lines.push(`User-agent: ${ua}`);
    }
    lines.push("Allow: /", "");
  }

  lines.push(
    "# Everyone else",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Host: ${absoluteUrl("/")}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
