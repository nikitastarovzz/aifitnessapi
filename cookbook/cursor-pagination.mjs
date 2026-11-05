/**
 * cursor-pagination.mjs — walk a next_token-paginated collection to the end,
 * without looping forever, dropping a page, or changing the query mid-walk.
 *
 * WHAT THIS IMPLEMENTS
 *   `paginate({ firstUrl, getJson, cursor, maxPages, onPage })` is an async
 *   generator of pages. Between pages it changes exactly one thing, the
 *   cursor parameter, and keeps every other query parameter (WHOOP: "using
 *   the same query parameters", including start and end). It stops when the
 *   response's token is null, absent or empty, and it refuses to continue
 *   when a token repeats or the page budget runs out — the two ways a buggy
 *   upstream or a buggy client turns a backfill into an infinite bill.
 *
 *   Two cursor descriptions ship, each from the vendor's own documentation as
 *   quoted on the site's integration guides:
 *     OURA   response `data` array plus `next_token` (string or null);
 *            request parameter `next_token`
 *     WHOOP  response `next_token` (empty on the last page); request
 *            parameter `nextToken`; page size `limit`, maximum 25
 *   WHOOP's guide quoted on the site does not name the array that holds a
 *   page's records, so WHOOP's `items` is left for you to set from a
 *   captured response rather than guessed here.
 *
 *   `onPage(page)` runs after a page is yielded and processed: persist
 *   `page.nextUrl` there and a crashed walk resumes from `resumeUrl` instead
 *   of from page one.
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/integrate/oura-api
 *   https://aifitnessapi.com/integrate/whoop-api
 *   https://aifitnessapi.com/cookbook/backfill-checkpointer (windows, retries)
 *
 * No dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

export const OURA = Object.freeze({ name: "oura", requestParam: "next_token", responseField: "next_token", items: (body) => body.data });
export const WHOOP = Object.freeze({ name: "whoop", requestParam: "nextToken", responseField: "next_token", items: null, maxLimit: 25 });

export class PaginationLoopError extends Error {
  constructor(token, page) {
    super(`cursor "${token}" came back a second time on page ${page}: stopping instead of looping`);
    this.name = "PaginationLoopError";
    this.token = token;
    this.page = page;
  }
}

export class PageBudgetError extends Error {
  constructor(maxPages, nextUrl) {
    super(`stopped after ${maxPages} pages with more to read; resume from nextUrl`);
    this.name = "PageBudgetError";
    this.maxPages = maxPages;
    this.nextUrl = nextUrl;
  }
}

/** null, undefined and "" all mean "this was the last page". */
export function isLastToken(token) {
  return token === null || token === undefined || token === "";
}

/** The URL for the page after `url`: same parameters, cursor replaced. */
export function nextPageUrl(url, cursor, token) {
  const u = new URL(url);
  u.searchParams.set(cursor.requestParam, token);
  return u.toString();
}

/** Clamp a requested page size to the vendor's documented maximum, if any. */
export function withPageSize(url, cursor, limit) {
  const u = new URL(url);
  const n = cursor.maxLimit ? Math.min(limit, cursor.maxLimit) : limit;
  u.searchParams.set("limit", String(n));
  return u.toString();
}

/**
 * @param {{ firstUrl: string, resumeUrl?: string|null, getJson: (url: string) => Promise<any>,
 *           cursor: { requestParam: string, responseField: string, items: ((body: any) => any[])|null },
 *           items?: (body: any) => any[], maxPages?: number,
 *           onPage?: (page: { index: number, url: string, items: any[], nextUrl: string|null }) => Promise<void>|void }} opts
 */
export async function* paginate({ firstUrl, resumeUrl = null, getJson, cursor, items, maxPages = 1000, onPage }) {
  const pick = items ?? cursor.items;
  if (typeof pick !== "function") throw new TypeError(`say which field holds ${cursor.name ?? "this API"}'s records: pass items(body)`);
  const seen = new Set();
  let url = resumeUrl ?? firstUrl;
  const startToken = new URL(url).searchParams.get(cursor.requestParam);
  if (startToken) seen.add(startToken);

  for (let index = 0; ; index++) {
    if (index >= maxPages) throw new PageBudgetError(maxPages, url);
    const body = await getJson(url);
    const rows = pick(body);
    if (!Array.isArray(rows)) throw new TypeError(`page ${index} has no record array where items() looked`);
    const token = body?.[cursor.responseField];
    let nextUrl = null;
    if (!isLastToken(token)) {
      if (seen.has(token)) throw new PaginationLoopError(token, index);
      seen.add(token);
      nextUrl = nextPageUrl(url, cursor, token);
    }
    const page = { index, url, items: rows, nextUrl };
    yield page;
    if (onPage) await onPage(page);
    if (!nextUrl) return;
    url = nextUrl;
  }
}

/** Convenience: every record, in order. Prefer `paginate` for large walks. */
export async function collectAll(opts) {
  const out = [];
  for await (const page of paginate(opts)) out.push(...page.items);
  return out;
}
