/**
 * Access reports: developers' own accounts of applying for a wearable
 * vendor's API access, collected in the open.
 *
 * No vendor this site covers publishes how long an access application takes
 * to answer or how often one is refused, so the only source is the people who
 * applied. There is no backend. A reader opens a prefilled GitHub issue in the
 * site's public repository (buildIssueUrl, or the template
 * .github/ISSUE_TEMPLATE/access-report.md); a maintainer reads it and adds
 * ACCEPT_LABEL; scripts/import-access-reports.mjs (run by hand,
 * unauthenticated, no secrets) turns accepted issues into
 * src/data/accessReports.ts, which components/AccessReports renders at build
 * on each vendor's English /integrate page and on /fix/garmin-api-approval,
 * and components/AccessScoreboard sums per vendor on the /integrate hub. The
 * importer also redraws one README badge per vendor,
 * public/badges/access/<vendor>.svg (accessBadges below).
 *
 * One module, imported by the component (to build the link), by the importer
 * (to parse what came back) and by scripts/access-reports.test.mjs, so the
 * form asked and the form read cannot drift. It follows the pose-benchmark
 * submission (src/lib/poseBenchmarkSubmission.mjs), which documents the
 * GitHub source: /issues/new takes `title` and `body` as query parameters,
 * and a visitor cannot set labels, so the importer selects by title prefix
 * and by the maintainer's label, never by a label the submitter set.
 *
 * A report is copied as submitted or not at all: a field outside its
 * enumeration, an out-of-range number, an over-long text or an unknown line
 * makes the issue invalid, and the importer reports and skips it rather than
 * repairing it. The one thing taken out is text that looks like a secret or
 * a person (keys, tokens, emails, URLs carrying a query value, @mentions),
 * which is replaced by REDACTED before anything is stored.
 */

export const REPO = "nikitastarovzz/aifitnessapi";
export const REPO_URL = `https://github.com/${REPO}`;
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;
export const TEMPLATE_FILE = "access-report.md";
export const TEMPLATE_URL = `${NEW_ISSUE_URL}?template=${TEMPLATE_FILE}`;
export const TITLE_PREFIX = "[access-report]";
/** Added by a maintainer after reading the issue; only these are imported. */
export const ACCEPT_LABEL = "access-report:accepted";
/** The fenced block's info string; the parser reads only this block. */
export const BLOCK_TAG = "access-report";
export const REDACTED = "[removed]";

/**
 * The vendors a report can name: those with an English /integrate page on
 * this site, keyed by that page's slug without "-api". `pages` are the
 * English pages that show the vendor's reports.
 */
export const VENDORS = [
  { slug: "garmin", name: "Garmin", pages: ["/integrate/garmin-api", "/fix/garmin-api-approval"] },
  { slug: "whoop", name: "WHOOP", pages: ["/integrate/whoop-api"] },
  { slug: "oura", name: "Oura", pages: ["/integrate/oura-api"] },
  { slug: "strava", name: "Strava", pages: ["/integrate/strava-api"] },
  { slug: "polar", name: "Polar", pages: ["/integrate/polar-api"] },
  { slug: "coros", name: "COROS", pages: ["/integrate/coros-api"] },
  { slug: "suunto", name: "Suunto", pages: ["/integrate/suunto-api"] },
  { slug: "withings", name: "Withings", pages: ["/integrate/withings-api"] },
  { slug: "fitbit", name: "Fitbit", pages: ["/integrate/fitbit-api"] },
  { slug: "samsung-health", name: "Samsung Health", pages: ["/integrate/samsung-health-api"] },
  { slug: "dexcom", name: "Dexcom", pages: ["/integrate/dexcom-api"] },
  { slug: "wahoo", name: "Wahoo", pages: ["/integrate/wahoo-api"] },
];
export const VENDOR_SLUGS = VENDORS.map((v) => v.slug);
export const USES = ["personal", "commercial", "research"];
export const OUTCOMES = ["approved", "rejected", "no-answer", "pending"];
export const MAX_DAYS = 730;
/** Length caps, in characters, after trimming. Longer is invalid, not cut. */
export const CAPS = { program: 80, askedFor: 200, notes: 500 };

/** The block's lines, in order: key in the issue, key in the record, required. */
export const FIELDS = [
  { key: "vendor", prop: "vendor", required: true, help: VENDOR_SLUGS.join(" | ") },
  { key: "program", prop: "program", required: true, help: `the program or tier you applied to, up to ${CAPS.program} characters` },
  { key: "use", prop: "use", required: true, help: USES.join(" | ") },
  { key: "applied", prop: "applied", required: true, help: "the month you applied, YYYY-MM" },
  { key: "outcome", prop: "outcome", required: true, help: OUTCOMES.join(" | ") },
  { key: "days_to_first_answer", prop: "daysToFirstAnswer", required: false, help: `optional: a whole number of days, 0 to ${MAX_DAYS}; leave blank for no-answer` },
  { key: "asked_for", prop: "askedFor", required: false, help: `optional: what the vendor asked you for, up to ${CAPS.askedFor} characters` },
  { key: "notes", prop: "notes", required: false, help: `optional: anything else, one line, up to ${CAPS.notes} characters` },
];

export const vendorBySlug = (slug) => VENDORS.find((v) => v.slug === slug);

/** The vendor whose reports an English page shows, or null. */
export function vendorForPath(path) {
  return VENDORS.find((v) => v.pages.includes(path))?.slug ?? null;
}

/**
 * Text that looks like a secret or a person, after the test search-pull.mjs
 * applies to queries (`sensitive()`), widened to free text: whole URLs that
 * carry a query value, emails, @mentions, bearer/basic credentials, UUIDs,
 * long hex or base64-like runs, and long digit runs (phone or account
 * numbers). Order matters: a URL or email is removed whole before its parts
 * could match a shorter rule.
 */
const SENSITIVE = [
  /\bhttps?:\/\/[^\s]*[?&#][a-z0-9_.-]+=[^&\s]{4,}[^\s]*/gi,
  /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi,
  /(?<![\w.])@[a-z0-9](?:[a-z0-9-]{0,38})\b/gi,
  /\b(?:bearer|basic|token|apikey|api[_-]?key|secret|password|client[_-]?secret)\s*[:=]?\s*(?=[A-Za-z0-9._~+/=-]*\d)[A-Za-z0-9._~+/=-]{8,}/gi,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  /\b[0-9a-f]{24,}\b/gi,
  /\b(?=[A-Za-z0-9_-]*\d)(?=[A-Za-z0-9_-]*[A-Za-z])[A-Za-z0-9_-]{32,}\b/g,
  /\b\d[\d -]{7,}\d\b/g,
];

/** Replace every sensitive run with REDACTED; returns the text and how many were removed. */
export function redact(text) {
  let out = String(text ?? "");
  let removed = 0;
  for (const re of SENSITIVE) {
    out = out.replace(re, () => {
      removed++;
      return REDACTED;
    });
  }
  return { text: out, removed };
}

/** True when redact() would remove something. */
export const looksSensitive = (text) => redact(text).removed > 0;

/** The issue body, the same in the link and in the template file. */
export function issueBody(prefill = {}) {
  const value = (f) => {
    const v = prefill[f.prop] ?? prefill[f.key];
    return v === undefined || v === null ? "" : String(v);
  };
  return [
    "One application, as it happened to you. Everything in this issue is public.",
    "",
    "Please do not post API keys, tokens, client secrets, emails, or the names of people",
    "(your own or the vendor's staff). Text that looks like a key, token, email or @mention",
    "is removed before a report is listed on aifitnessapi.com.",
    "",
    "Fill in the block below, one line per field, after the colon. Allowed values:",
    "",
    ...FIELDS.map((f) => `- ${f.key}: ${f.help}`),
    "",
    "```" + BLOCK_TAG,
    ...FIELDS.map((f) => `${f.key}: ${value(f)}`.trimEnd()),
    "```",
    "",
    "A maintainer reads each report and adds the `" + ACCEPT_LABEL + "` label; only those are",
    "listed, each with a link back to this issue. Edit the issue if your outcome changes.",
    "",
  ].join("\n");
}

/** The prefilled "Report your application" link, for one vendor or none. */
export function buildIssueUrl(prefill = {}) {
  const v = prefill.vendor ? vendorBySlug(prefill.vendor) : undefined;
  if (prefill.vendor && !v) throw new Error(`unknown vendor ${prefill.vendor}`);
  const title = `${TITLE_PREFIX} ${v ? `${v.name} ` : ""}API access application`;
  const q = new URLSearchParams({ title, body: issueBody(prefill) });
  return `${NEW_ISSUE_URL}?${q.toString().replace(/\+/g, "%20")}`;
}

const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

/**
 * Read a report back out of an issue body. Returns { ok, record, redacted }
 * or { ok: false, errors }. `now` (a Date) bounds the month and the days.
 * Nothing is repaired: enumerations are matched case-insensitively after
 * trimming, and anything else that does not fit is an error.
 */
export function parseIssueBody(body, { now = new Date() } = {}) {
  if (typeof body !== "string") return { ok: false, errors: ["no body"] };
  const text = body.replace(/\r\n?/g, "\n");
  const fence = "```" + BLOCK_TAG + "\n";
  const start = text.indexOf(fence);
  if (start < 0) return { ok: false, errors: [`no \`\`\`${BLOCK_TAG} block`] };
  if (text.indexOf(fence, start + fence.length) >= 0) return { ok: false, errors: [`more than one \`\`\`${BLOCK_TAG} block`] };
  const end = text.indexOf("\n```", start + fence.length - 1);
  if (end < 0) return { ok: false, errors: ["the report block is not closed"] };

  const errors = [];
  const raw = {};
  for (const line of text.slice(start + fence.length, end + 1).split("\n")) {
    if (!line.trim()) continue;
    const m = /^\s*([a-z_]+)\s*:(.*)$/.exec(line);
    const field = m && FIELDS.find((f) => f.key === m[1]);
    if (!field) {
      errors.push(`unknown line ${JSON.stringify(line.slice(0, 40))}`);
      continue;
    }
    if (field.prop in raw) errors.push(`${field.key} given twice`);
    raw[field.prop] = m[2].trim();
  }

  const enumOf = (prop, allowed) => {
    const v = (raw[prop] ?? "").toLowerCase();
    if (!v) errors.push(`${prop} is missing`);
    else if (!allowed.includes(v)) errors.push(`${prop} ${JSON.stringify(raw[prop].slice(0, 30))} is not one of ${allowed.join(", ")}`);
    return v;
  };
  const vendor = enumOf("vendor", VENDOR_SLUGS);
  const use = enumOf("use", USES);
  const outcome = enumOf("outcome", OUTCOMES);

  let redacted = 0;
  const textOf = (prop, required) => {
    const v = raw[prop] ?? "";
    if (!v) {
      if (required) errors.push(`${prop} is missing`);
      return null;
    }
    if (v.length > CAPS[prop]) errors.push(`${prop} is ${v.length} characters, over ${CAPS[prop]}`);
    if (/[<>`]/.test(v)) errors.push(`${prop} contains markup`);
    const r = redact(v);
    redacted += r.removed;
    return r.text;
  };
  const program = textOf("program", true);
  const askedFor = textOf("askedFor", false);
  const notes = textOf("notes", false);

  const applied = raw.applied ?? "";
  const mm = MONTH.exec(applied);
  const nowMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  if (!applied) errors.push("applied is missing");
  else if (!mm) errors.push(`applied ${JSON.stringify(applied.slice(0, 20))} is not YYYY-MM`);
  else if (Number(mm[1]) < 2000) errors.push("applied is before 2000");
  else if (applied > nowMonth) errors.push(`applied ${applied} is in the future`);

  let daysToFirstAnswer = null;
  const d = raw.daysToFirstAnswer ?? "";
  if (d) {
    if (!/^\d{1,4}$/.test(d)) errors.push(`days_to_first_answer ${JSON.stringify(d.slice(0, 20))} is not a whole number`);
    else {
      daysToFirstAnswer = Number(d);
      if (daysToFirstAnswer > MAX_DAYS) errors.push(`days_to_first_answer ${daysToFirstAnswer} is over ${MAX_DAYS}`);
      if (outcome === "no-answer") errors.push("days_to_first_answer is given but the outcome is no-answer");
      if (mm && applied <= nowMonth) {
        const since = Math.floor((now.getTime() - Date.UTC(Number(mm[1]), Number(mm[2]) - 1, 1)) / 86400000);
        if (daysToFirstAnswer > since) errors.push(`days_to_first_answer ${daysToFirstAnswer} is longer than the time since ${applied}`);
      }
    }
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, redacted, record: { vendor, program, use, applied, outcome, daysToFirstAnswer, askedFor, notes } };
}

/**
 * What the panel prints above a vendor's table: the count per outcome, and
 * the median days to a first answer only when at least MEDIAN_MIN reports
 * give a number. Computed from the reports passed in and nothing else.
 */
export const MEDIAN_MIN = 3;
export function summarize(reports) {
  const counts = Object.fromEntries(OUTCOMES.map((o) => [o, 0]));
  for (const r of reports) counts[r.outcome]++;
  const days = reports
    .map((r) => r.daysToFirstAnswer)
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
  let medianDays = null;
  if (days.length >= MEDIAN_MIN) {
    const mid = Math.floor(days.length / 2);
    medianDays = days.length % 2 ? days[mid] : (days[mid - 1] + days[mid]) / 2;
  }
  return { total: reports.length, counts, withDays: days.length, medianDays };
}

/** An issue URL this repository could have issued: https://github.com/<REPO>/issues/<n>. */
export const ISSUE_URL = new RegExp(`^${REPO_URL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}/issues/\\d+$`);

/**
 * The all-vendor scoreboard on /integrate (components/AccessScoreboard): one
 * row per vendor in VENDORS, each summarize()d from that vendor's reports
 * alone, so the median follows the panel's rule (MEDIAN_MIN). Vendors with
 * more reports come first; ties keep the VENDORS order. `page` is the English
 * page whose #access-reports panel the row links.
 */
export function scoreboard(reports) {
  return VENDORS.map((v, order) => ({ slug: v.slug, name: v.name, page: v.pages[0], order, ...summarize(reports.filter((r) => r.vendor === v.slug)) }))
    .sort((a, b) => b.total - a.total || a.order - b.order)
    .map(({ order: _order, ...row }) => row);
}

/**
 * The README badge per vendor, written by the importer to
 * public/badges/access/<vendor>.svg with the site's shared badge drawing
 * (src/lib/statBadgeSvg.mjs). The value is the panel's own summary: the
 * report count, and the median days only where summarize() gives one.
 */
export const ACCESS_BADGE_BASE = "/badges/access";
export const ACCESS_BADGE_DIR = "public/badges/access";
export const accessBadgePath = (slug) => `${ACCESS_BADGE_BASE}/${slug}.svg`;
export const ACCESS_BADGE_COLORS = { none: "#4b5563", some: "#059669" };
const fmtDays = (n) => `${n} ${n === 1 ? "day" : "days"}`;

/** The badge text for one vendor from its summarize() result: { label, value, color }. */
export function accessBadge(vendorName, s) {
  const label = `${vendorName} API access`;
  if (!s.total) return { label, value: "no reports yet", color: ACCESS_BADGE_COLORS.none };
  const count = `${s.total} ${s.total === 1 ? "report" : "reports"}`;
  return { label, value: s.medianDays === null ? count : `${count} · median ${fmtDays(s.medianDays)}`, color: ACCESS_BADGE_COLORS.some };
}

/** Every vendor's badge, from the reports given: [{ slug, path, label, value, color }]. */
export function accessBadges(reports) {
  return VENDORS.map((v) => ({
    slug: v.slug,
    path: accessBadgePath(v.slug),
    ...accessBadge(v.name, summarize(reports.filter((r) => r.vendor === v.slug))),
  }));
}

/** The README snippet's fixed alt text: the image changes under it, the alt does not. */
export const accessBadgeAlt = (vendorName) => `${vendorName} API access reports`;

/**
 * The line a reader shares from one accepted report's row. It describes the
 * report, not the reader ("per developer report #7"), because anyone can
 * press Share on any row; the link is the vendor's panel (shareUrl).
 */
export function shareText(r) {
  const v = vendorBySlug(r.vendor);
  if (!v) throw new Error(`unknown vendor ${r.vendor}`);
  const inDays = Number.isInteger(r.daysToFirstAnswer) ? ` in ${fmtDays(r.daysToFirstAnswer)}` : "";
  const what = {
    approved: `approved${inDays}`,
    rejected: `rejected${inDays}`,
    "no-answer": "no answer",
    pending: inDays ? `pending, first answer${inDays}` : "pending",
  }[r.outcome];
  if (!what) throw new Error(`unknown outcome ${r.outcome}`);
  return `${v.name} API access ${what}, per developer report #${r.issue} (applied ${r.applied}). Reports from developers:`;
}

/** The link that goes with shareText: the vendor's first English page, at its panel. */
export function shareUrl(r, origin = "https://aifitnessapi.com") {
  const v = vendorBySlug(r.vendor);
  if (!v) throw new Error(`unknown vendor ${r.vendor}`);
  return `${origin}${v.pages[0]}#access-reports`;
}
