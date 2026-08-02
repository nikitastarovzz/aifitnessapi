import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Crawler policy — GEO-deliberate. This site exists to be read AND cited, so
 * AI crawlers are explicitly welcomed rather than left to the wildcard:
 * an explicit per-agent allow is unambiguous under any future default, and
 * documents the policy in the file everyone checks. Machine-readable content
 * lives at /llms.txt, /llms-full.txt, and /md/<path> mirrors (by convention;
 * robots.txt has no directive for them).
 *
 * Rule of the house (ops/GEO.md): never add a disallow for an AI agent
 * without a written decision — blocking citation traffic is a product
 * change, not a config tweak.
 */
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training/index
  "OAI-SearchBot",     // ChatGPT search
  "ChatGPT-User",      // user-triggered fetches
  "ClaudeBot",         // Anthropic index
  "Claude-User",       // user-triggered fetches
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",   // Gemini grounding
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent",
  "CCBot",             // Common Crawl (feeds many models)
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
