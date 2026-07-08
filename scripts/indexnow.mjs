#!/usr/bin/env node
/**
 * IndexNow submitter — pings Bing + Yandex (and any IndexNow-participating
 * engine) so new/updated pages get crawled fast. Google does NOT use IndexNow;
 * for Google, rely on the sitemap + internal links + URL Inspection.
 *
 * Usage:
 *   node scripts/indexnow.mjs                 # submit EVERY url in the live sitemap
 *   node scripts/indexnow.mjs /guides /blog   # submit only these paths (flagship drip)
 *
 * Requires the site to be deployed (it reads the live sitemap) and the key file
 * public/<KEY>.txt to be reachable at https://<host>/<KEY>.txt.
 */

// Canonical site URL. Keep in sync with src/lib/site.ts `url` (override with
// SITE_URL=... for preview deploys). Plain .mjs can't import the TS config.
const SITE_URL = (process.env.SITE_URL || "https://aifitnessapi.com").replace(/\/$/, "");
const KEY = "7ab02ba01079101c36facfcb28908c50";
const HOST = new URL(SITE_URL).host; // aifitnessapi.com
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

async function urlsFromSitemap() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { "user-agent": "aifitnessapi-indexnow/1.0" },
  });
  if (!res.ok) throw new Error(`Could not fetch sitemap (${res.status}). Is the site deployed?`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function toAbsolute(pathOrUrl) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length ? args.map(toAbsolute) : await urlsFromSitemap();

  if (!urlList.length) {
    console.error("No URLs to submit.");
    process.exit(1);
  }
  // IndexNow requires every submitted URL to be on HOST.
  const bad = urlList.filter((u) => new URL(u).host !== HOST);
  if (bad.length) {
    console.error(`These URLs are not on ${HOST} and were dropped:\n${bad.join("\n")}`);
  }
  const urls = urlList.filter((u) => new URL(u).host === HOST);

  console.log(`Submitting ${urls.length} URL(s) to IndexNow for ${HOST} …`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });

  // IndexNow returns 200/202 on success; 4xx tells you what's wrong.
  const body = await res.text();
  if (res.ok || res.status === 202) {
    console.log(`✓ Accepted (HTTP ${res.status}). Bing/Yandex will crawl these shortly.`);
  } else {
    console.error(`✗ IndexNow returned HTTP ${res.status}: ${body || "(no body)"}`);
    if (res.status === 403) console.error("403 usually means the key file is not reachable at " + KEY_LOCATION);
    if (res.status === 422) console.error("422 usually means a URL host mismatch or malformed URL.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
