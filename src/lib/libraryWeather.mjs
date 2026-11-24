/**
 * "Weather" for the unofficial vendor-API client libraries: how many issues
 * were opened on the repository lately, and how many of those have a title
 * that mentions signing in or being blocked. scripts/fetch-library-weather.mjs
 * reads the issues from GitHub's REST API and calls weather() below; the
 * /libraries/<slug> page renders the result (src/app/libraries/_weather.tsx)
 * and lists KEYWORDS exactly as defined here.
 *
 * Plain ESM with no imports, so the generator, the page and
 * scripts/library-weather.test.mjs share one definition.
 *
 * What it is and is not: a count of issue titles matching a keyword list. An
 * issue is one person's report, and a title can match without being about
 * sign-in at all ("Broken link in README"), so a count is a signal that
 * people are reporting breakage, not proof the library is broken.
 */

/**
 * The keyword set. Each is matched case-insensitively against the issue
 * title only (not the body, not comments), at the start of a word:
 * "auth" counts "auth", "authentication", "authorize", "authorization" but
 * not "author" or "authority"; "login" counts "login" and "logins"; numbers
 * count only as whole numbers ("403", not "4030").
 */
export const KEYWORDS = [
  { word: "login", re: /\blogin/i },
  { word: "log in", re: /\blog[ -]in\b/i },
  { word: "auth", re: /\bauth(?!or(?!i[sz]))/i },
  { word: "oauth", re: /\boauth/i },
  { word: "403", re: /\b403\b/ },
  { word: "429", re: /\b429\b/ },
  { word: "broken", re: /\bbroken\b/i },
  { word: "MFA", re: /\bmfa\b/i },
];

/** The keywords a title matches, in KEYWORDS order (empty when none). */
export function matchedKeywords(title) {
  const t = String(title ?? "");
  return KEYWORDS.filter((k) => k.re.test(t)).map((k) => k.word);
}

export const isAuthRelated = (title) => matchedKeywords(title).length > 0;

export const WINDOWS = { short: 14, long: 90 };
const DAY_MS = 86400000;

/** YYYY-MM-DD, `days` before `asOf` (YYYY-MM-DD), in UTC. */
export function daysBefore(asOf, days) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error(`daysBefore: asOf must be YYYY-MM-DD, got ${asOf}`);
  return new Date(Date.parse(`${asOf}T00:00:00Z`) - days * DAY_MS).toISOString().slice(0, 10);
}

/** Longest issue title kept, in characters; a longer one is cut with an ellipsis. */
export const TITLE_MAX = 140;
const clip = (s) => (s.length > TITLE_MAX ? `${s.slice(0, TITLE_MAX - 1).trimEnd()}…` : s);

/**
 * The weather for one repository from the issues GitHub returned (pull
 * requests already excluded). An issue is in a window when it was opened on
 * or after 00:00 UTC on the window's first day, `asOf` minus the window's
 * days; anything older than the long window is ignored, anything after
 * `asOf` is an error (the read and the date disagree).
 *
 * @param {{ number: number; title: string; html_url: string; created_at: string; pull_request?: unknown }[]} issues
 * @param {string} asOf  The day the issues were read, YYYY-MM-DD (UTC).
 */
export function weather(issues, asOf) {
  const since = { short: daysBefore(asOf, WINDOWS.short), long: daysBefore(asOf, WINDOWS.long) };
  const rows = [];
  for (const is of issues) {
    if (is.pull_request) throw new Error(`#${is.number} is a pull request; the query must exclude them`);
    const on = String(is.created_at ?? "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(on)) throw new Error(`#${is.number} has no created_at`);
    if (on > asOf) throw new Error(`#${is.number} was opened ${on}, after the read on ${asOf}`);
    if (on < since.long) continue;
    rows.push({ number: is.number, title: String(is.title ?? ""), url: is.html_url, createdOn: on, at: is.created_at });
  }
  const inShort = rows.filter((r) => r.createdOn >= since.short);
  const auth = rows.filter((r) => isAuthRelated(r.title));
  const authShort = auth.filter((r) => r.createdOn >= since.short);
  const newest = [...auth].sort((a, b) => b.at.localeCompare(a.at) || b.number - a.number)[0] ?? null;
  return {
    asOf,
    since,
    opened: { short: inShort.length, long: rows.length },
    authRelated: { short: authShort.length, long: auth.length },
    newestAuthRelated: newest
      ? { number: newest.number, title: clip(newest.title), url: newest.url, createdOn: newest.createdOn, matched: matchedKeywords(newest.title) }
      : null,
  };
}

/** The search query the generator sends: every issue (no pull requests) opened since `since`. */
export const searchQuery = (repo, since) => `repo:${repo} is:issue created:>=${since}`;
