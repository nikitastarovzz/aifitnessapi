import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import { shareAnswer } from "@/lib/picker";

/**
 * Social card for a shared picker answer (/s), the one result on this site
 * that exists only as a URL. Every other card is a static file per route,
 * which is right for pages; a result has no route of its own, so this one is
 * rendered on request.
 *
 * It takes the picker's three choices — j, p, pr — and nothing else, and
 * computes every word on the card from them. It used to take the eyebrow,
 * title and supporting line as free text and draw whatever it was given:
 * truncated, but still one fresh render and one fresh cache entry for every
 * distinct string anybody cared to send — unbounded compute, billed to us, on
 * a plan that has already been paused once. Validating against the option
 * lists makes the answer space finite (one card per combination), so the
 * whole surface is a fixed number of renders per cache lifetime.
 *
 * Anything else is a 400 before rendering: a missing or unknown value, an
 * extra parameter, a repeated one, or the right ones in another order. Those
 * would render the same card as the canonical URL, but each spelling is its
 * own cache key, so accepting them would hand back the unbounded surface
 * through the side door. /s builds this URL from `shareAnswer().query`, so a
 * real caller always sends exactly the canonical form.
 *
 * Known gap: percent-escaped spellings (`wearable%2Ddata`, `%6A=`) and a
 * trailing `&` are NOT refused. Observed under `next start` (16.2.10): the
 * server rebuilds the query string from its parsed values before this
 * handler runs, so `req.url` arrives already normalised and those spellings
 * cannot be told apart from the canonical one here — they render, with the
 * long cache header. Closing that needs the raw request URL, which a route
 * handler is not given.
 */
export const runtime = "nodejs";

const reject = (why: string) =>
  new Response(`${why}\n`, {
    status: 400,
    // Never cached: a 400 is cheap to recompute, and caching one per junk
    // URL would only fill the cache with junk.
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });

export function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams;
  const answer = shareAnswer(q.get("j"), q.get("p"), q.get("pr"));
  if (!answer) return reject("Bad request: j, p and pr must each be one of the picker's options.");
  if (url.search !== `?${answer.query}`) {
    return reject("Bad request: send exactly j, p and pr, once each, in that order.");
  }

  return new ImageResponse(
    ogCard({
      eyebrow: "API picker",
      title: answer.result.title,
      line: answer.question,
    }),
    {
      ...OG_SIZE,
      headers: {
        // Deterministic output for a given answer, and the set of answers is
        // fixed for the life of a deploy, so it is safe to cache hard.
        "cache-control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
