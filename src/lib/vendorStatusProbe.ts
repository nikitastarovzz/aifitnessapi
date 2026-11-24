import https from "node:https";
import { OAUTH_SOURCES, OAUTH_VENDORS } from "@/data/oauthVendors";
import { GHAPI_SOURCES } from "@/data/googleHealthApi";
import {
  MAX_REDIRECTS,
  RULES,
  STATUS_ENDPOINTS,
  TIMEOUT_MS,
  USER_AGENT,
  errorWord,
  verdict,
} from "@/lib/vendorStatus.mjs";

/**
 * The requests behind "Are vendor APIs up?" on /alerts (rules and wording in
 * src/lib/vendorStatus.mjs).
 *
 * One GET per endpoint, all at once, each with a hard TIMEOUT_MS limit that
 * covers every redirect it follows. Only the status line and headers are
 * read: the body is discarded as it arrives, so a 800 KB sign-in page costs
 * nothing. No cookie, no credential, no query parameter is sent, and nothing
 * from the answer but the status code and the final address is kept.
 *
 * node:https rather than fetch on purpose: Next.js patches fetch with its
 * data cache, which would replay a stored answer (and its old timing) instead
 * of asking again. The page's own `revalidate` is the only cache: /alerts is
 * regenerated in the background at most every REVALIDATE_SECONDS, so a
 * reader never waits on these requests.
 */

export type ProbeResult = {
  id: string;
  vendor: string;
  what: string;
  url: string;
  rule: string;
  observed: string;
  status: number | null;
  finalUrl: string | null;
  error: string | null;
  timedOut: boolean;
  ms: number | null;
  verdict: "up" | "unexpected" | "no-answer";
};

function urlOf(e: (typeof STATUS_ENDPOINTS)[number]): string {
  const s = e.source;
  if (s.module === "oauth") {
    const v = OAUTH_VENDORS.find((x) => x.id === s.vendorId);
    if (!v) throw new Error(`vendor status: no OAuth vendor ${s.vendorId}`);
    return v.authorizeUrl;
  }
  if (s.module === "oauthSource") {
    const src = OAUTH_SOURCES[s.key as keyof typeof OAUTH_SOURCES];
    if (!src) throw new Error(`vendor status: no OAuth source ${s.key}`);
    return src.url;
  }
  const g = GHAPI_SOURCES.find((x) => x.key === s.key);
  if (!g) throw new Error(`vendor status: no Google Health API source ${s.key}`);
  return g.url;
}

/** The endpoints with their URLs, for the page's list even before any answer. */
export function statusEndpoints() {
  return STATUS_ENDPOINTS.map((e) => ({ ...e, url: urlOf(e), ruleText: RULES[e.rule] }));
}

type Raw = { status: number | null; finalUrl: string | null; error: string | null; timedOut: boolean; ms: number | null };

function get(url: string, deadline: number, hops: number, started: number): Promise<Raw> {
  return new Promise((resolve) => {
    const left = deadline - Date.now();
    if (left <= 0) return resolve({ status: null, finalUrl: url, error: null, timedOut: true, ms: null });
    let done = false;
    const finish = (r: Raw) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(r);
    };
    const req = https.request(
      url,
      { method: "GET", headers: { "user-agent": USER_AGENT, accept: "*/*" } },
      (res) => {
        const status = res.statusCode ?? null;
        const loc = res.headers.location;
        res.resume(); // discard the body
        if (status && status >= 300 && status < 400 && loc) {
          req.destroy();
          if (hops >= MAX_REDIRECTS) return finish({ status: null, finalUrl: url, error: errorWord("TOO_MANY_REDIRECTS"), timedOut: false, ms: null });
          let next: string;
          try {
            next = new URL(loc, url).href;
          } catch {
            return finish({ status, finalUrl: url, error: null, timedOut: false, ms: Date.now() - started });
          }
          if (!next.startsWith("https://")) return finish({ status, finalUrl: url, error: null, timedOut: false, ms: Date.now() - started });
          clearTimeout(timer);
          done = true;
          get(next, deadline, hops + 1, started).then(resolve);
          return;
        }
        finish({ status, finalUrl: url, error: null, timedOut: false, ms: Date.now() - started });
        req.destroy();
      },
    );
    const timer = setTimeout(() => {
      req.destroy();
      finish({ status: null, finalUrl: url, error: null, timedOut: true, ms: null });
    }, left);
    req.on("error", (e: NodeJS.ErrnoException) => finish({ status: null, finalUrl: url, error: errorWord(e.code), timedOut: false, ms: null }));
    req.end();
  });
}

/** Probe every endpoint in parallel. Never throws; at most TIMEOUT_MS. */
export async function probeVendorStatus(): Promise<{ checkedAt: string; results: ProbeResult[] }> {
  const checkedAt = new Date().toISOString();
  const results = await Promise.all(
    statusEndpoints().map(async (e) => {
      const started = Date.now();
      let raw: Raw;
      try {
        raw = await get(e.url, started + TIMEOUT_MS, 0, started);
      } catch {
        raw = { status: null, finalUrl: e.url, error: errorWord(""), timedOut: false, ms: null };
      }
      return {
        id: e.id,
        vendor: e.vendor,
        what: e.what,
        url: e.url,
        rule: e.ruleText,
        observed: e.observed,
        ...raw,
        verdict: verdict(e.rule, raw),
      };
    }),
  );
  return { checkedAt, results };
}
