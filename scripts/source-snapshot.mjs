#!/usr/bin/env node
/**
 * Fetch a list of public source pages and archive their text, so a page on
 * this site can be written from a primary source fetched today even when the
 * host is blocked from the environment the writer works in.
 * ops/EXPANSION-3-2026-10-17.md item 4.8.
 *
 *   node scripts/source-snapshot.mjs --list ops/sources/aggregators.txt --out snapshot
 *
 * Runs in GitHub Actions (.github/workflows/source-snapshot.yml), which has
 * open egress, and uploads the result as a short-lived workflow artifact. The
 * snapshots are research material, not site content: they are never committed,
 * because the pages belong to their publishers. What a page on the site may
 * say is still decided by a person reading the snapshot, and the page cites
 * the original URL and the fetch date recorded here.
 *
 * For every URL the snapshot records the final URL after redirects, the HTTP
 * status, the fetch time, the content type, the byte count and a SHA-256 of
 * the raw bytes, then the page text: HTML reduced to its <main> or <article>
 * (else <body>) with headings, list items and table rows kept, and JSON or
 * YAML kept as-is. Same-host links are listed so a follow-up list can go one
 * level deeper. A failed fetch is recorded, not fatal; the run fails only if
 * every URL failed, which means the list or the network is wrong.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
};
const LIST = arg("--list");
const OUT = arg("--out") ?? "snapshot";
// With --print-chars N each page's text (first N characters) is also written to
// stdout, for readers who can reach the job log but not the artifact store.
const PRINT_CHARS = Math.max(0, Number(arg("--print-chars") ?? 0) || 0);
if (!LIST || !/^ops\/sources\/[a-z0-9-]+\.txt$/.test(LIST)) {
  console.error("source-snapshot: --list must be ops/sources/<name>.txt (lowercase, digits, hyphens)");
  process.exit(2);
}

const urls = readFileSync(LIST, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
for (const u of urls) {
  if (!/^https:\/\/[^\s]+$/.test(u)) {
    console.error(`source-snapshot: not an https URL: ${u}`);
    process.exit(2);
  }
}

const UA = "aifitnessapi-source-snapshot/1.0 (+https://aifitnessapi.com/methodology)";
const MAX_BYTES = 3_000_000;

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

function htmlToText(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ");
  const pick = (tag) => {
    const m = s.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
    return m ? m[1] : null;
  };
  s = pick("main") ?? pick("article") ?? pick("body") ?? s;
  s = s
    .replace(/<(h[1-6])\b[^>]*>/gi, (_, h) => `\n\n${"#".repeat(Number(h[1]))} `)
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<tr\b[^>]*>/gi, "\n|")
    .replace(/<\/t[dh]>/gi, " |")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|ul|ol|table|thead|tbody|dl|dt|dd|blockquote|pre)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decode(s)
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sameHostLinks(html, base) {
  const host = new URL(base).host;
  const out = new Set();
  for (const m of html.matchAll(/href="([^"#]+)"/gi)) {
    try {
      const u = new URL(decode(m[1]), base);
      if (u.protocol === "https:" && u.host === host) out.add(u.href);
    } catch {
      /* not a URL */
    }
  }
  return [...out].slice(0, 300);
}

const slug = (u) => {
  const { host, pathname, search } = new URL(u);
  const s = `${host}${pathname}${search}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  return s.slice(0, 150) || "root";
};

mkdirSync(OUT, { recursive: true });
const index = [];
let ok = 0;
for (const url of urls) {
  const entry = { url, fetchedAt: new Date().toISOString() };
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/json,application/yaml,text/plain;q=0.9,*/*;q=0.5" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type") ?? "";
    Object.assign(entry, {
      finalUrl: res.url,
      status: res.status,
      contentType: type,
      bytes: buf.length,
      sha256: createHash("sha256").update(buf).digest("hex"),
    });
    const raw = buf.subarray(0, MAX_BYTES).toString("utf8");
    const isHtml = /html/i.test(type) || /^\s*<(!doctype|html)/i.test(raw);
    const text = isHtml ? htmlToText(raw) : raw;
    const file = `${slug(res.url || url)}.txt`;
    const header = [
      `URL: ${url}`,
      `Final URL: ${res.url}`,
      `Status: ${res.status}`,
      `Fetched: ${entry.fetchedAt}`,
      `Content-Type: ${type}`,
      `SHA-256: ${entry.sha256}`,
      "",
    ].join("\n");
    writeFileSync(join(OUT, file), `${header}\n${text}\n`);
    if (PRINT_CHARS > 0) {
      console.log(`\n===== SNAPSHOT ${url} | status ${res.status} | fetched ${entry.fetchedAt} | final ${res.url}`);
      console.log(text.slice(0, PRINT_CHARS));
      if (text.length > PRINT_CHARS) console.log(`[... ${text.length - PRINT_CHARS} more characters in the artifact]`);
      console.log(`===== END ${url}\n`);
    }
    entry.file = file;
    if (isHtml) entry.links = sameHostLinks(raw, res.url || url);
    if (res.ok) ok++;
    console.log(`${res.status} ${url} → ${file} (${buf.length} bytes)`);
  } catch (e) {
    entry.error = [e?.name, e?.message, e?.cause?.code, e?.cause?.message].filter(Boolean).join(": ") || String(e);
    console.log(`ERR ${url} ${entry.error}`);
  }
  index.push(entry);
  await new Promise((r) => setTimeout(r, 750));
}
writeFileSync(join(OUT, "index.json"), JSON.stringify({ list: LIST, generatedAt: new Date().toISOString(), entries: index }, null, 2));
console.log(`source-snapshot: ${ok}/${urls.length} fetched with a 2xx status`);
if (ok === 0) process.exit(1);
