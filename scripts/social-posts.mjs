#!/usr/bin/env node
/**
 * Social post kit (ops/VIRAL-20-2026-11-06.md item 19).
 *
 *   npm run build && node scripts/social-posts.mjs [--date 2026-11-06]
 *
 * Writes ops/social/posts-<date>.md: one ready-to-post text per recent
 * change (src/data/changes.ts, sortDate in the last 30 days) and per page
 * first published in the last 14 days (src/data/published.ts), each as an
 * X post (at most 280 characters as X counts them) and a longer LinkedIn
 * variant, with the page URL tagged utm_source=x or linkedin and
 * utm_medium=social.
 *
 * It adds no facts. A change post is that entry's own title, date and
 * summary; a page post is the built page's own <title> and meta description,
 * read from .next/server/app/<path>.html, so run it after `npm run build`.
 * A page with no built HTML fails the run rather than being skipped, and so
 * does any post that comes out with a hype word in it (BANNED below) or over
 * the X limit, so the kit can be posted as written.
 *
 * The file is ops-only: not served, not under public/, and never generated
 * by CI. The owner posts by hand; see ops/LAUNCH-KIT.md.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const SITE = "https://aifitnessapi.com";
export const X_LIMIT = 280;
/** X counts every URL as 23 characters, whatever its length (t.co wrapping). */
export const X_URL_WEIGHT = 23;
export const CHANGE_DAYS = 30;
export const PAGE_DAYS = 14;
export const DISCLOSURE = "Independent reference, funded by KinesteX (AI motion tracking for fitness apps).";
export const DISCLOSURE_SHORT = "Site funded by KinesteX.";

/** Words a post must not contain: the site states facts, it does not rank or sell. */
export const BANNED = /\b(best|ultimate|revolutionary|game[- ]chang\w*|amazing|incredible|insane|must[- ]have|killer|unbeatable|world[- ]class|#1)\b|!/i;

const DAY = 86400000;

export function daysBefore(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) - days * DAY).toISOString().slice(0, 10);
}

export function withUtm(path, source, campaign) {
  const u = new URL(path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  if (campaign) u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/** Length as X counts it: each http(s) URL weighs X_URL_WEIGHT. */
export function xLength(text) {
  let n = 0;
  const parts = text.split(/(https?:\/\/\S+)/);
  for (const p of parts) n += /^https?:\/\//.test(p) ? X_URL_WEIGHT : [...p].length;
  return n;
}

/** Markdown → plain text: links keep their label, code spans lose backticks. */
export function plain(md) {
  return String(md)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function sentences(text) {
  return plain(text)
    .split(/(?<=[.?!]["”)]?)\s+(?=["“A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Drop ranking words from a page title ("The Best X" → "X") instead of posting them. */
export function deHype(title) {
  return title
    .replace(/^(the\s+)?best\s+/i, "")
    .replace(/\s+best\s+/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Leading clauses of a sentence, cut at ": " or "; " outside quotation
 * marks, each ended with a period: "A gives B as the turn-off: "…"" → "A gives
 * B as the turn-off." Nothing is reworded; the rest is dropped.
 */
export function clauses(sentence) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < sentence.length; i++) {
    const c = sentence[i];
    if (c === '"' ) depth = depth ? 0 : 1;
    else if (c === "“") depth = 1;
    else if (c === "”") depth = 0;
    else if (!depth && (c === ":" || c === ";") && sentence[i + 1] === " ") {
      out.push(`${sentence.slice(start, i).trim()}.`);
      start = i + 2;
    }
  }
  return out;
}

/** Longest run of whole sentences from `parts` that keeps `build(text)` within X's limit;
 *  when not even the first sentence fits, its leading clauses. */
function fitX(parts, build) {
  if (parts.length && xLength(build(parts[0])) > X_LIMIT) {
    const lead = clauses(parts[0]);
    if (lead.length && xLength(build(lead[0])) <= X_LIMIT) parts = lead;
  }
  let best = build("");
  let acc = "";
  for (const s of parts) {
    const next = acc ? `${acc} ${s}` : s;
    if (xLength(build(next)) > X_LIMIT) break;
    acc = next;
    best = build(acc);
  }
  return best;
}

function finishX(body, url) {
  const withDisclosure = `${body}\n\n${url}\n\n${DISCLOSURE_SHORT}`;
  return xLength(withDisclosure) <= X_LIMIT ? withDisclosure : `${body}\n\n${url}`;
}

export function changePost(ev, campaign) {
  const xUrl = withUtm(ev.page.href, "x", campaign);
  const liUrl = withUtm(ev.page.href, "linkedin", campaign);
  const head = `${ev.title} (${ev.date})`;
  const parts = sentences(ev.summary);
  const x = fitX(parts, (t) => finishX(t ? `${head}: ${t}` : head, xUrl));
  const linkedin = [
    `${ev.title} — ${ev.date}${ev.status === "confirmed" ? "" : ` (${ev.status})`}`,
    "",
    plain(ev.summary),
    "",
    `Sourced details: ${ev.page.label} ${liUrl}`,
    "",
    DISCLOSURE,
  ].join("\n");
  return { kind: "change", key: `${ev.sortDate} ${ev.title}`, x, linkedin };
}

export function pagePost(path, published, title, description, campaign) {
  const xUrl = withUtm(`/${path}`, "x", campaign);
  const liUrl = withUtm(`/${path}`, "linkedin", campaign);
  const t = deHype(title);
  const desc = BANNED.test(description) ? "" : plain(description);
  const x = fitX(sentences(desc), (d) => finishX(d ? `New on the site: ${t}. ${d}` : `New on the site: ${t}.`, xUrl));
  const linkedin = [`New page: ${t} (published ${published})`, "", desc, "", liUrl, "", DISCLOSURE].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
  return { kind: "page", key: `${published} ${path}`, x, linkedin };
}

/** Problems that would make a post unpostable as written. */
export function lint(post) {
  const out = [];
  if (xLength(post.x) > X_LIMIT) out.push(`X post is ${xLength(post.x)} characters as X counts them`);
  for (const [name, text] of [["X", post.x], ["LinkedIn", post.linkedin]]) {
    const m = text.replace(/https?:\/\/\S+/g, "").match(BANNED);
    if (m) out.push(`${name} post contains "${m[0]}"`);
  }
  if (!/utm_source=x&utm_medium=social/.test(post.x)) out.push("X post lacks its UTM URL");
  if (!/utm_source=linkedin&utm_medium=social/.test(post.linkedin)) out.push("LinkedIn post lacks its UTM URL");
  return out;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/** <title> and meta description from a built page's HTML. */
export function readMeta(html) {
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  if (!title || !desc) return null;
  return { title: decodeEntities(title).replace(/\s*[|—–-]\s*AIFitnessAPI\s*$/, "").trim(), description: decodeEntities(desc) };
}

export function render(date, changes, pages) {
  const block = (p, i) =>
    [
      `### ${i + 1}. ${p.key}`,
      "",
      `**X** (${xLength(p.x)}/${X_LIMIT} as X counts it):`,
      "",
      "```text",
      p.x,
      "```",
      "",
      "**LinkedIn:**",
      "",
      "```text",
      p.linkedin,
      "```",
      "",
    ].join("\n");
  return [
    `# Social post kit — ${date}`,
    "",
    `Generated by \`node scripts/social-posts.mjs --date ${date}\` (after \`npm run build\`). Do not edit by hand; regenerate.`,
    `Changes from src/data/changes.ts dated ${daysBefore(date, CHANGE_DAYS)} to ${date}; pages first published ${daysBefore(date, PAGE_DAYS)} to ${date} (src/data/published.ts).`,
    "",
    "Before posting: open the link and check the post against the page, since pages regenerate. Every text below is the entry's or page's own words; nothing is added.",
    "X counts each URL as 23 characters, so the long UTM link fits. See ops/LAUNCH-KIT.md for cadence and community rules.",
    "",
    `## Changes (${changes.length})`,
    "",
    ...changes.map(block),
    `## New pages (${pages.length})`,
    "",
    ...pages.map(block),
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const di = args.indexOf("--date");
  const date = di >= 0 ? args[di + 1] : new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const root = new URL("..", import.meta.url);
  const campaign = `social-kit-${date}`;

  const { CHANGE_EVENTS } = await import(new URL("src/data/changes.ts", root).href);
  const { PUBLISHED } = await import(new URL("src/data/published.ts", root).href);

  const changeFrom = daysBefore(date, CHANGE_DAYS);
  const changes = CHANGE_EVENTS.filter((e) => e.sortDate >= changeFrom && e.sortDate <= date)
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .map((e) => changePost(e, campaign));

  const pageFrom = daysBefore(date, PAGE_DAYS);
  const rows = Object.entries(PUBLISHED)
    .filter(([p, d]) => d >= pageFrom && d <= date && !p.startsWith("pt-br/"))
    .sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0]));
  const missing = [];
  const pages = [];
  for (const [path, published] of rows) {
    const file = fileURLToPath(new URL(`.next/server/app/${path}.html`, root));
    if (!existsSync(file)) {
      missing.push(path);
      continue;
    }
    const meta = readMeta(readFileSync(file, "utf8"));
    if (!meta) {
      missing.push(`${path} (no <title> or meta description)`);
      continue;
    }
    pages.push(pagePost(path, published, meta.title, meta.description, campaign));
  }
  if (missing.length) {
    console.error(`social-posts: no built page for ${missing.length} published path(s); run npm run build first:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }

  const problems = [...changes, ...pages].flatMap((p) => lint(p).map((m) => `${p.key}: ${m}`));
  if (problems.length) {
    console.error(`social-posts: ${problems.length} unpostable post(s):\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }

  const dir = fileURLToPath(new URL("ops/social/", root));
  mkdirSync(dir, { recursive: true });
  const out = `${dir}posts-${date}.md`;
  writeFileSync(out, render(date, changes, pages));
  console.log(`social-posts: ${changes.length} change post(s), ${pages.length} page post(s) → ops/social/posts-${date}.md`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
