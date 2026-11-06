/**
 * Reporting a stale or wrong fact, and how a reporter gets credit
 * (ops/VIRAL-20-2026-11-06.md item 17).
 *
 * There is no backend. Every page's "Suggest a correction" link opens a
 * prefilled GitHub issue in the site's public repository; the same fields are
 * in .github/ISSUE_TEMPLATE/correction.md for readers who start from the
 * template chooser. The issue asks, in a line of its own, whether the reporter
 * wants to be credited and under which name. A maintainer who fixes the page
 * logs the fix in src/data/corrections.ts and, only when the reporter said yes,
 * adds `reportedBy` with the name they gave and the issue's URL; /contributors
 * lists exactly those. No name is ever taken from anywhere else.
 *
 * One module, imported by the page footer's Feedback component (to build the
 * URL), by /contributors and by scripts/correction-report.test.mjs, so the
 * question asked and the answer read cannot drift. GitHub's /issues/new takes
 * `title` and `body` as query parameters (the pose-benchmark submission,
 * src/lib/poseBenchmarkSubmission.mjs, documents the source); labels cannot
 * be set by a visitor, so they live in the template.
 */

export const REPO = "nikitastarovzz/aifitnessapi";
export const REPO_URL = `https://github.com/${REPO}`;
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;
export const TEMPLATE_FILE = "correction.md";
export const TEMPLATE_URL = `${NEW_ISSUE_URL}?template=${TEMPLATE_FILE}`;
export const TITLE_PREFIX = "[correction]";
export const CONTRIBUTORS_PATH = "/contributors";

/** The line the reporter answers. The answer follows the colon on the same line. */
export const CREDIT_LINE = "Credit me on aifitnessapi.com/contributors as";
export const CREDIT_HELP =
  "(write the name or GitHub handle you want shown, or \"no\" to stay uncredited; credit appears only once the fix ships)";

/** The issue body, the same in the link and the template. */
export function correctionBody(pageUrl = "") {
  return [
    `Page: ${pageUrl}`,
    "",
    "What's wrong:",
    "",
    "",
    "Source that shows it (a link to the vendor's own documentation is ideal):",
    "",
    "",
    `${CREDIT_LINE}: `,
    CREDIT_HELP,
    "",
  ].join("\n");
}

/** The prefilled "Suggest a correction" link for one page. */
export function correctionIssueUrl({ path, title, origin = "https://aifitnessapi.com", repoUrl = REPO_URL }) {
  const q = new URLSearchParams({ title: `${TITLE_PREFIX} ${title}`, body: correctionBody(`${origin}${path}`) });
  return `${repoUrl}/issues/new?${q.toString().replace(/\+/g, "%20")}`;
}

/**
 * The reporter's answer to the credit line: { credit: true, name } for a name,
 * { credit: false } for "no", a blank answer or no credit line at all. Silence
 * is never consent.
 * @param {string} body
 * @returns {{ credit: true, name: string } | { credit: false }}
 */
export function parseCredit(body) {
  const line = String(body ?? "")
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith(CREDIT_LINE));
  if (!line) return { credit: false };
  const answer = line
    .trim()
    .slice(CREDIT_LINE.length)
    .replace(/^\s*:\s*/, "")
    .trim();
  if (!answer || /^(no|none|n\/a|-|—|no thanks|anonymous)\.?$/i.test(answer) || answer.startsWith("(")) return { credit: false };
  return { credit: true, name: answer.slice(0, 80) };
}

/** An issue URL this repository could have issued: https://github.com/<REPO>/issues/<n>. */
export const ISSUE_URL = new RegExp(`^${REPO_URL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}/issues/\\d+$`);

/**
 * The contributors wall: one entry per credited person, with every page their
 * reports changed, newest first. Only corrections that carry `reportedBy`
 * count, and the wall is empty until one does.
 * @param {{ date: string, page: { href: string, label: string }, reportedBy?: { name: string, issue: string, url?: string } }[]} corrections
 */
export function contributorsFrom(corrections) {
  const byName = new Map();
  for (const c of corrections) {
    if (!c.reportedBy) continue;
    const key = c.reportedBy.name.trim().toLowerCase();
    const entry = byName.get(key) ?? { name: c.reportedBy.name.trim(), url: c.reportedBy.url, corrections: [] };
    entry.corrections.push({ date: c.date, page: c.page, issue: c.reportedBy.issue });
    if (!entry.url && c.reportedBy.url) entry.url = c.reportedBy.url;
    byName.set(key, entry);
  }
  return [...byName.values()]
    .map((e) => ({ ...e, corrections: e.corrections.sort((a, b) => b.date.localeCompare(a.date)) }))
    .sort((a, b) => b.corrections[0].date.localeCompare(a.corrections[0].date) || a.name.localeCompare(b.name));
}

/** Problems with a corrections list's credit fields (qa and the tests). */
export function creditProblems(corrections) {
  const out = [];
  for (const c of corrections) {
    const r = c.reportedBy;
    if (!r) continue;
    const where = `${c.date} ${c.page.href}`;
    if (!r.name || !r.name.trim()) out.push(`${where}: reportedBy has no name`);
    if (!ISSUE_URL.test(r.issue ?? "")) out.push(`${where}: reportedBy.issue "${r.issue}" is not an issue of ${REPO}`);
    if (r.url && !/^https:\/\//.test(r.url)) out.push(`${where}: reportedBy.url "${r.url}" is not an https link`);
  }
  return out;
}
