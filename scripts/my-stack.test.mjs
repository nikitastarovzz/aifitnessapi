/**
 * The calendar, feed, stack-address and countdown helpers behind /my-stack,
 * /changes/calendar.ics and /embed/countdown/<id>, tested through the module
 * those pages import (src/lib/stackFeeds.mjs).
 *
 *   node --test scripts/my-stack.test.mjs     (npm run test:my-stack)
 *
 * The calendar test runs the site's real tracker entries (src/data/changes.ts)
 * through buildCalendar and through a verbatim copy of the formatter the
 * calendar route used before it moved into the shared module, and asserts the
 * two are byte-identical, so moving it changed nothing a subscriber sees.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildCalendar,
  buildOpml,
  buildRss,
  countdownParts,
  countdownTarget,
  daysBetween,
  endOfPeriod,
  escapeIcs,
  fmtStatedDate,
  foldIcs,
  parseStack,
  pickNext,
  stackQuery,
} from "../src/lib/stackFeeds.mjs";

const { CHANGE_EVENTS, WATCH_ITEMS } = await import(new URL("../src/data/changes.ts", import.meta.url).href);
const SITE = "https://aifitnessapi.com";
const abs = (p) => `${SITE}${p}`;

/** The route's formatter as it stood before the move (src/app/changes/calendar.ics/route.ts). */
function legacyCalendar(events) {
  const escapeLegacy = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  function fold(line) {
    const bytes = Buffer.from(line, "utf8");
    if (bytes.length <= 75) return line;
    const out = [];
    let start = 0;
    let limit = 75;
    while (start < bytes.length) {
      let end = Math.min(start + limit, bytes.length);
      while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
      out.push(bytes.subarray(start, end).toString("utf8"));
      start = end;
      limit = 74;
    }
    return out.join("\r\n ");
  }
  const stamp = (d) => `${d.replace(/-/g, "")}T000000Z`;
  const nextDay = (iso) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  };
  const isExact = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
  const dtstamp = stamp(events.map((e) => e.verifiedOn).sort().at(-1));
  const vevents = events.map((e) => {
    const exact = isExact(e.date);
    const summary = exact ? e.title : `[reported ${/^\d{4}$/.test(e.date) ? "year" : "month"}] ${e.title}`;
    const precision = exact
      ? `Date confirmed as ${e.date}.`
      : `PLACED on this day for calendaring only. The source states ${e.date}, not an exact day — do not treat this as a committed date.`;
    const description = [`[${e.status.toUpperCase()}] ${e.summary}`, "", precision, `Last checked: ${e.verifiedOn}.`, `Source page: ${abs(e.page.href)}`].join("\n");
    return [
      "BEGIN:VEVENT",
      `UID:${e.sortDate}-${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}@aifitnessapi.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${e.sortDate.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${nextDay(e.sortDate)}`,
      `SUMMARY:${escapeLegacy(summary)}`,
      `DESCRIPTION:${escapeLegacy(description)}`,
      `URL:${abs(e.page.href)}`,
      `CATEGORIES:${escapeLegacy(e.status)}`,
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
    `NAME:${escapeLegacy("AIFitnessAPI — API deadlines")}`,
    `X-WR-CALNAME:${escapeLegacy("AIFitnessAPI — API deadlines")}`,
    `DESCRIPTION:${escapeLegacy(`Dated fitness-API ecosystem changes: deprecations, turndowns and term changes. Events marked [reported month] have no confirmed day. ${WATCH_ITEMS.length} undated risks are tracked on the site but are deliberately not in this calendar — they have no date to place.`)}`,
    `X-WR-CALDESC:${escapeLegacy("Fitness API deprecations, turndowns and deadlines. Graded confirmed vs reported.")}`,
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
    "X-PUBLISHED-TTL:P1D",
    ...vevents.flat(),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

const sorted = [...CHANGE_EVENTS].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));

test("buildCalendar reproduces the site calendar byte for byte", () => {
  const got = buildCalendar({
    events: sorted,
    absolute: abs,
    name: "AIFitnessAPI — API deadlines",
    description: `Dated fitness-API ecosystem changes: deprecations, turndowns and term changes. Events marked [reported month] have no confirmed day. ${WATCH_ITEMS.length} undated risks are tracked on the site but are deliberately not in this calendar — they have no date to place.`,
    caldesc: "Fitness API deprecations, turndowns and deadlines. Graded confirmed vs reported.",
    fallbackDay: "2000-01-01",
  });
  assert.equal(got, legacyCalendar(sorted));
});

test("every calendar line is at most 75 octets and folds rejoin to the original", () => {
  const cal = buildCalendar({ events: sorted, absolute: abs, name: "n", description: "d", caldesc: "c", fallbackDay: "2000-01-01" });
  const physical = cal.split("\r\n");
  for (const l of physical) assert.ok(Buffer.byteLength(l, "utf8") <= 75, l);
  // A long line of multi-byte characters is never split inside a character.
  const long = `SUMMARY:${"é—".repeat(60)}`;
  const folded = foldIcs(long);
  assert.equal(folded.split("\r\n ").join(""), long);
  for (const part of folded.split("\r\n")) assert.ok(Buffer.byteLength(part, "utf8") <= 75);
});

test("a fuzzy date is named with its precision and marked tentative", () => {
  const e = { date: "2026", sortDate: "2026-06-01", title: "T", summary: "S", status: "confirmed", page: { href: "/x", label: "X" }, verifiedOn: "2026-10-01" };
  const cal = buildCalendar({ events: [e], absolute: abs, name: "n", description: "d", caldesc: "c", fallbackDay: "2000-01-01" });
  assert.match(cal, /SUMMARY:\[reported year\] T/);
  assert.match(cal, /STATUS:TENTATIVE/);
  assert.equal(escapeIcs("a,b;c\\d\ne"), "a\\,b\\;c\\\\d\\ne");
  const noRefresh = buildCalendar({ events: [e], absolute: abs, name: "n", description: "d", caldesc: "c", fallbackDay: "2000-01-01", refresh: false });
  assert.doesNotMatch(noRefresh, /REFRESH-INTERVAL/);
});

test("RSS and OPML are well-formed and escape what they carry", () => {
  const e = { ...sorted[0], title: `A <b> & "c"` };
  const rss = buildRss({ events: [e], absolute: abs, title: "T & U", link: `${SITE}/my-stack?v=a,b`, description: "D" });
  assert.match(rss, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0">/);
  assert.equal((rss.match(/<item>/g) ?? []).length, 1);
  assert.match(rss, /A &lt;b&gt; &amp; &quot;c&quot;/);
  assert.doesNotMatch(rss, /<b>/);
  const opml = buildOpml({ title: "S", feeds: [{ title: "F&G", xmlUrl: `${SITE}/feeds/vendors/fitbit.xml`, htmlUrl: `${SITE}/changes/fitbit` }] });
  assert.match(opml, /<opml version="2.0">/);
  assert.match(opml, /text="F&amp;G"/);
  assert.match(opml, /xmlUrl="https:\/\/aifitnessapi.com\/feeds\/vendors\/fitbit.xml"/);
});

test("a stack address is canonical: known ids, no repeats, directory order", () => {
  const ids = ["fitbit", "garmin", "oura", "health-connect"];
  assert.deepEqual(parseStack("oura,fitbit,oura,nope", ids), ["fitbit", "oura"]);
  assert.deepEqual(parseStack(" Health-Connect , GARMIN", ids), ["garmin", "health-connect"]);
  assert.deepEqual(parseStack("", ids), []);
  assert.deepEqual(parseStack(null, ids), []);
  assert.equal(stackQuery(["fitbit", "oura"]), "?v=fitbit,oura");
  assert.equal(stackQuery([]), "");
  // Round trip.
  assert.deepEqual(parseStack(stackQuery(["garmin", "oura"]).slice(3), ids), ["garmin", "oura"]);
});

test("a fuzzy date counts to the last day of its period, never earlier", () => {
  assert.equal(endOfPeriod("2026"), "2026-12-31");
  assert.equal(endOfPeriod("2026-02"), "2026-02-28");
  assert.equal(endOfPeriod("2024-02"), "2024-02-29");
  assert.equal(endOfPeriod("2026-11-02"), "2026-11-02");
  assert.equal(countdownTarget("2026-12"), "2026-12-31");
  assert.equal(countdownTarget("2026-11-02"), "2026-11-02");
  assert.equal(fmtStatedDate("2026-11-02"), "November 2, 2026");
  assert.equal(fmtStatedDate("2026-10"), "October 2026");
  assert.equal(fmtStatedDate("2026"), "2026");
});

test("countdown parts count to 00:00 UTC on the day and flip to past at that instant", () => {
  const at = Date.parse("2026-11-01T22:30:15Z");
  assert.deepEqual(countdownParts("2026-11-02", at), { past: false, days: 0, hours: 1, minutes: 29, seconds: 45 });
  assert.deepEqual(countdownParts("2026-11-05", at), { past: false, days: 3, hours: 1, minutes: 29, seconds: 45 });
  assert.equal(countdownParts("2026-11-02", Date.parse("2026-11-02T00:00:00Z")).past, true);
  assert.deepEqual(countdownParts("2026-11-01", Date.parse("2026-11-03T06:00:00Z")), { past: true, days: 2, hours: 6, minutes: 0, seconds: 0 });
  assert.equal(countdownParts("not a date", at), null);
  assert.equal(daysBetween("2026-11-05", "2026-11-02"), -3);
  assert.equal(daysBetween("2026-11-05", "2026-12-31"), 56);
});

test("pickNext chooses the soonest item ahead, else the latest passed", () => {
  const items = [{ target: "2026-12-31" }, { target: "2026-11-02" }, { target: "2027-03-01" }, { target: "2025-01-01" }];
  const a = pickNext(items, "2026-11-05");
  assert.equal(a.ahead, true);
  assert.equal(a.item.target, "2026-12-31");
  assert.deepEqual(a.rest.map((i) => i.target), ["2027-03-01"]);
  const onDay = pickNext(items, "2026-11-02");
  assert.equal(onDay.item.target, "2026-11-02");
  const past = pickNext(items, "2028-01-01");
  assert.equal(past.ahead, false);
  assert.equal(past.item.target, "2027-03-01");
  assert.equal(pickNext([], "2026-01-01"), null);
});
