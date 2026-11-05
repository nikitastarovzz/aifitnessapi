/**
 * Calendar, feed and countdown helpers shared by the server and the browser
 * (ops/AUDIENCE-30-2026-11-05.md items 24 and 26).
 *
 * Pure functions, no Node APIs: /changes/calendar.ics builds the site-wide
 * calendar with them at build time, and /my-stack builds a reader's own
 * calendar, OPML subscription list and RSS snapshot with the same code in the
 * browser, so the two calendars cannot format an event differently. The
 * countdown arithmetic behind /embed/countdown/<id> lives here too.
 *
 * Tested in scripts/my-stack.test.mjs (npm run test:my-stack).
 *
 * HONESTY RULE (inherited from src/data/changes.ts and src/data/graveyard.ts):
 * a date keeps its source's precision. "2026-09" is a month, "2026" a year.
 * The calendar places a fuzzy event on its `sortDate` but names it with its
 * stated precision; the countdown counts a fuzzy date to the last day of its
 * period, so it never says a deadline has passed before the whole stated
 * period has.
 */

/** RFC 5545 §3.1: escape , ; \ and newlines in TEXT values. */
export function escapeIcs(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

const enc = new TextEncoder();
const dec = new TextDecoder();

/**
 * RFC 5545 §3.1: lines are octet-limited to 75 and continue with CRLF + one
 * space. Folding is done over UTF-8 bytes, not characters, so a multi-byte
 * character is never split across the fold.
 */
export function foldIcs(line) {
  const bytes = enc.encode(line);
  if (bytes.length <= 75) return line;
  const out = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Back off until `end` sits on a UTF-8 boundary (never mid-sequence).
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(dec.decode(bytes.subarray(start, end)));
    start = end;
    limit = 74; // continuation lines lose one octet to the leading space
  }
  return out.join("\r\n ");
}

export function icsStamp(isoDate) {
  return `${isoDate.replace(/-/g, "")}T000000Z`;
}

/** All-day events use a DATE value and an exclusive DTEND of the next day. */
export function icsNextDay(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** "2026-09-15" = a day we can stand behind. "2026-09" / "2026" = we cannot. */
export function isExactDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/** The stable UID of a tracker entry, the same in every calendar this site serves. */
export function icsUid(e) {
  return `${e.sortDate}-${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}@aifitnessapi.com`;
}

/**
 * One tracker entry (src/data/changes.ts ChangeEvent shape) as VEVENT lines.
 * `url` is the absolute URL of the entry's source page.
 */
export function icsEvent(e, url, dtstamp) {
  const exact = isExactDate(e.date);
  const summary = exact ? e.title : `[reported ${/^\d{4}$/.test(e.date) ? "year" : "month"}] ${e.title}`;
  const precision = exact
    ? `Date confirmed as ${e.date}.`
    : `PLACED on this day for calendaring only. The source states ${e.date}, not an exact day — do not treat this as a committed date.`;
  const description = [
    `[${e.status.toUpperCase()}] ${e.summary}`,
    "",
    precision,
    `Last checked: ${e.verifiedOn}.`,
    `Source page: ${url}`,
  ].join("\n");
  return [
    "BEGIN:VEVENT",
    `UID:${icsUid(e)}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${e.sortDate.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${icsNextDay(e.sortDate)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `URL:${url}`,
    `CATEGORIES:${escapeIcs(e.status)}`,
    // Dated-but-fuzzy entries are marked TENTATIVE so a client that renders
    // status shows the hedge too.
    `STATUS:${e.status === "confirmed" && exact ? "CONFIRMED" : "TENTATIVE"}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
  ];
}

/**
 * A whole VCALENDAR. `events` are tracker entries, `absolute` turns a site
 * path into an absolute URL, `fallbackDay` is used only when there are no
 * events to date the calendar by.
 *
 * DTSTAMP must be stable across rebuilds or every subscriber's client sees
 * every event as modified on every deploy. The newest verification date among
 * the events is the honest "as of" and changes only when the data does.
 */
export function buildCalendar({ events, absolute, name, description, caldesc, fallbackDay, refresh = true }) {
  const dtstamp = icsStamp(events.map((e) => e.verifiedOn).sort().at(-1) ?? fallbackDay);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aifitnessapi.com//Fitness API Changes & Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `NAME:${escapeIcs(name)}`,
    `X-WR-CALNAME:${escapeIcs(name)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `X-WR-CALDESC:${escapeIcs(caldesc)}`,
    ...(refresh ? ["REFRESH-INTERVAL;VALUE=DURATION:P1D", "X-PUBLISHED-TTL:P1D"] : []),
    ...events.flatMap((e) => icsEvent(e, absolute(e.page.href), dtstamp)),
    "END:VCALENDAR",
  ];
  return lines.map(foldIcs).join("\r\n") + "\r\n";
}

// ── RSS and OPML ──────────────────────────────────────────────────────────

/** The same escaping rule as /changes.xml and the vendor feeds. */
export function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

export const rfc822 = (day) => new Date(`${day}T00:00:00Z`).toUTCString();

/** One RSS <item> per tracker entry, in the shape /feeds/vendors/<id>.xml uses. */
export function rssItem(e, url) {
  const desc = `[${e.status.toUpperCase()}] ${e.summary} (Stated date: ${e.date}. Last checked: ${e.verifiedOn}.)`;
  return `    <item>
      <title>${escapeXml(`${e.date} — ${e.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${escapeXml(`${e.sortDate}-${e.title}`)}</guid>
      <pubDate>${rfc822(e.sortDate)}</pubDate>
      <category>${escapeXml(e.status)}</category>
      <description>${escapeXml(desc)}</description>
    </item>`;
}

/** An RSS 2.0 document over tracker entries (newest first is the caller's order). */
export function buildRss({ events, absolute, title, link, description }) {
  const newest = events.map((e) => e.verifiedOn).sort().at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
${newest ? `    <lastBuildDate>${rfc822(newest)}</lastBuildDate>\n` : ""}    <docs>${escapeXml(absolute("/changes"))}</docs>
${events.map((e) => rssItem(e, absolute(e.page.href))).join("\n")}
  </channel>
</rss>
`;
}

/** An OPML 2.0 subscription list: feed readers import one file and follow every feed in it. */
export function buildOpml({ title, feeds }) {
  const outlines = feeds
    .map(
      (f) =>
        `    <outline type="rss" text="${escapeXml(f.title)}" title="${escapeXml(f.title)}" xmlUrl="${escapeXml(f.xmlUrl)}" htmlUrl="${escapeXml(f.htmlUrl)}" />`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(title)}</title>
  </head>
  <body>
${outlines}
  </body>
</opml>
`;
}

// ── Stack addressing ──────────────────────────────────────────────────────

/**
 * The stack in a URL is `?v=<id>,<id>`. Unknown ids are dropped, repeats
 * collapse, and the result is in `validIds` order, so one stack has one
 * address however it was picked.
 */
export function parseStack(value, validIds) {
  if (typeof value !== "string" || !value) return [];
  const want = new Set(
    value
      .split(/[,\s+]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  return validIds.filter((id) => want.has(id));
}

export function stackQuery(ids) {
  return ids.length ? `?v=${ids.join(",")}` : "";
}

// ── Countdown arithmetic ──────────────────────────────────────────────────

/** The last day a fuzzy date can mean: "2026" → 2026-12-31, "2025-12" → 2025-12-31. */
export function endOfPeriod(d) {
  if (/^\d{4}$/.test(d)) return `${d}-12-31`;
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-").map(Number);
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return `${d}-${String(last).padStart(2, "0")}`;
  }
  return d;
}

/** The day a countdown counts to: the day itself, or the end of a stated month or year. */
export function countdownTarget(date) {
  return isExactDate(date) ? date : endOfPeriod(date);
}

/**
 * Time left until 00:00 UTC on `day` (a full ISO date), from `nowMs`.
 * `past` once that instant is reached. The units are whole days, hours,
 * minutes and seconds of the remaining (or elapsed) span.
 */
export function countdownParts(day, nowMs) {
  const target = Date.parse(`${day}T00:00:00Z`);
  if (Number.isNaN(target)) return null;
  const diff = target - nowMs;
  const past = diff <= 0;
  let s = Math.floor(Math.abs(diff) / 1000);
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  return { past, days, hours, minutes, seconds };
}

/** Whole UTC calendar days from `todayIso` to `day` (negative once past) — the rule components/Countdown uses. */
export function daysBetween(todayIso, day) {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${todayIso}T00:00:00Z`)) / 86_400_000);
}

/**
 * Which item a countdown shows on `todayIso`: the soonest whose target day is
 * today or later; when none is ahead, the one whose target passed most
 * recently, flagged `ahead: false`. Items carry `target` (a full ISO day).
 */
export function pickNext(items, todayIso) {
  const ahead = items.filter((i) => i.target >= todayIso).sort((a, b) => (a.target < b.target ? -1 : a.target > b.target ? 1 : 0));
  if (ahead.length) return { ahead: true, item: ahead[0], rest: ahead.slice(1) };
  const past = [...items].sort((a, b) => (a.target < b.target ? 1 : a.target > b.target ? -1 : 0));
  return past.length ? { ahead: false, item: past[0], rest: [] } : null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-11-02" → "November 2, 2026", "2026-10" → "October 2026", "2026" → "2026". Never sharpens. */
export function fmtStatedDate(d) {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const mn = MONTHS[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

/** What a fuzzy date's countdown counts to, in words: "the last day of 2026". */
export function periodWords(d) {
  if (/^\d{4}$/.test(d)) return `the last day of ${d}`;
  if (/^\d{4}-\d{2}$/.test(d)) return `the last day of ${fmtStatedDate(d)}`;
  return fmtStatedDate(d);
}
