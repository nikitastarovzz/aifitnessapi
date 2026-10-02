import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import { JOB_OPTIONS, PLATFORM_OPTIONS, PRIORITY_OPTIONS, shareAnswer } from "@/lib/picker";

/**
 * Social card for a shared picker answer (/s): one PNG per combination of the
 * picker's three choices, at /og/picker/<j>/<p>/<pr>, written by `next build`.
 *
 * It used to be /api/og?j=…&p=…&pr=…, rendered on request. Validating the three
 * values against the option lists made the answers finite but not the URLs:
 * the server rebuilds the query string from its parsed values before a route
 * handler runs, so percent-escaped spellings (`wearable%2Ddata`, `%6A=`) and a
 * trailing `&` arrived looking canonical, rendered, and each one was a cache
 * key of its own — a fresh render per spelling anyone cared to send, on a plan
 * that has already been paused once. The answer space is known at build time,
 * so the card is now static output and no request renders anything.
 *
 * `dynamicParams = false` is the validation now: a combination missing from
 * generateStaticParams is a 404 from the router, without reaching GET. qa's
 * DYNAMIC-FALLBACK gate holds this route to `fallback: false` like every other
 * dynamic route. /s takes the path from `shareAnswer().card`, the same call
 * that writes its title, so a card cannot preview a different answer.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

/** A value is used as a path segment as-is, so it must already be a safe one. */
const SEGMENT = /^[a-z0-9-]+$/;

export function generateStaticParams(): { j: string; p: string; pr: string }[] {
  // Every option value today is lowercase words joined by hyphens. One added
  // with anything else fails the build here rather than shipping a card URL
  // that needs escaping — escaped spellings are the ambiguity this route
  // exists to remove.
  const unsafe = [...JOB_OPTIONS, ...PLATFORM_OPTIONS, ...PRIORITY_OPTIONS]
    .map((o) => o.value)
    .filter((v) => !SEGMENT.test(v));
  if (unsafe.length) {
    throw new Error(`og/picker: option values are not path-safe: ${unsafe.join(", ")}`);
  }
  return JOB_OPTIONS.flatMap(({ value: j }) =>
    PLATFORM_OPTIONS.flatMap(({ value: p }) =>
      PRIORITY_OPTIONS.map(({ value: pr }) => ({ j, p, pr })),
    ),
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ j: string; p: string; pr: string }> },
) {
  const { j, p, pr } = await params;
  const answer = shareAnswer(j, p, pr);
  // Unreachable while dynamicParams is false (every param set above is a
  // valid answer), but nothing but a resolved answer is ever drawn.
  if (!answer) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    ogCard({
      eyebrow: "API picker",
      title: answer.result.title,
      line: answer.question,
    }),
    {
      ...OG_SIZE,
      headers: {
        // A day in the browser and no longer, and not `immutable`: the address
        // outlives a deploy, and the title drawn on it changes whenever
        // recommend() does.
        "cache-control": "public, max-age=86400",
      },
    },
  );
}
