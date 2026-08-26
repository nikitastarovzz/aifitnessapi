import { site, absoluteUrl } from "@/lib/site";
import { changesSorted, WATCH_ITEMS } from "@/data/changes";

/**
 * A subscribable calendar of the dated ecosystem events (/changes/calendar.ics).
 *
 * The tracker already answers "what is changing"; this answers "remind me".
 * A developer subscribes once in Google or Apple Calendar and every deadline
 * we verify afterwards arrives in the place they already look, which is the
 * one distribution channel a static site otherwise has no way to reach.
 *
 * HONESTY RULE (this file inherits src/data/changes.ts):
 * `date` precision varies — "2026-09" means a reported month, not a day. ICS
 * has no way to express "sometime in September", so every event is PLACED at
 * `sortDate` (already the designated sort key) but is NAMED and DESCRIBED
 * with its stated precision. A fuzzy event is prefixed so the calendar entry
 * itself carries the hedge:
 *
 *     [reported month] Fitbit Web API turndown — stated as 2026-09
 *
 * That way a consumer who only ever sees the calendar entry — never the
 * page — still inherits the grading. We never sharpen a date into a
 * commitment the source did not make.
 */
export const dynamic = "force-static";

/** RFC 5545 §3.1: escape , ; \ and newlines in TEXT values. */
function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 §3.1: lines are octet-limited to 75 and continue with CRLF + one
 * space. Folding is done over UTF-8 bytes, not characters, so a multi-byte
 * character is never split across the fold.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Back off until `end` sits on a UTF-8 boundary (never mid-sequence).
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines lose one octet to the leading space
  }
  return out.join("\r\n ");
}

function stamp(isoDate: string): string {
  return `${isoDate.replace(/-/g, "")}T000000Z`;
}

/** All-day events use a DATE value and an exclusive DTEND of the next day. */
function nextDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** "2026-09-15" = a day we can stand behind. "2026-09" / "2026" = we cannot. */
function isExactDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function GET(): Response {
  const events = changesSorted();

  // DTSTAMP must be stable across rebuilds or every subscriber's client sees
  // every event as modified on every deploy. The newest verification date is
  // the honest "as of" for this dataset and changes only when the data does.
  const dtstamp = stamp(
    events.map((e) => e.verifiedOn).sort().at(-1) ?? new Date().toISOString().slice(0, 10),
  );

  const vevents = events.map((e) => {
    const exact = isExactDate(e.date);
    const summary = exact
      ? e.title
      : `[reported ${/^\d{4}$/.test(e.date) ? "year" : "month"}] ${e.title}`;

    const precision = exact
      ? `Date confirmed as ${e.date}.`
      : `PLACED on this day for calendaring only. The source states ${e.date}, not an exact day — do not treat this as a committed date.`;

    const description = [
      `[${e.status.toUpperCase()}] ${e.summary}`,
      "",
      precision,
      `Last checked: ${e.verifiedOn}.`,
      `Source page: ${absoluteUrl(e.page.href)}`,
    ].join("\n");

    return [
      "BEGIN:VEVENT",
      `UID:${e.sortDate}-${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}@aifitnessapi.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${e.sortDate.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${nextDay(e.sortDate)}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      `URL:${absoluteUrl(e.page.href)}`,
      `CATEGORIES:${escapeIcs(e.status)}`,
      // Undated risks are not events; dated-but-fuzzy ones are marked
      // TENTATIVE so a client that renders status shows the hedge too.
      `STATUS:${e.status === "confirmed" && exact ? "CONFIRMED" : "TENTATIVE"}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    ];
  });

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aifitnessapi.com//Fitness API Changes & Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `NAME:${escapeIcs(`${site.name} — API deadlines`)}`,
    `X-WR-CALNAME:${escapeIcs(`${site.name} — API deadlines`)}`,
    `DESCRIPTION:${escapeIcs(
      `Dated fitness-API ecosystem changes: deprecations, turndowns and term changes. Events marked [reported month] have no confirmed day. ${WATCH_ITEMS.length} undated risks are tracked on the site but are deliberately not in this calendar — they have no date to place.`,
    )}`,
    `X-WR-CALDESC:${escapeIcs("Fitness API deprecations, turndowns and deadlines. Graded confirmed vs reported.")}`,
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
    "X-PUBLISHED-TTL:P1D",
    ...vevents.flat(),
    "END:VCALENDAR",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="aifitnessapi-deadlines.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
