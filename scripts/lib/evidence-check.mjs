/**
 * Shared by scripts/api-coverage.test.mjs, scripts/rate-limit-calc.test.mjs
 * and qa's COVERAGE-EVIDENCE gate: every `src` a data module cites must be a
 * quote its evidence file already holds, under the same URL. Exact match, no
 * normalisation: the modules copy quotes, they do not retype them.
 */
import fs from "node:fs";
import path from "node:path";

const cache = new Map();

function load(root, ev) {
  if (!cache.has(ev)) {
    const p = path.join(root, ev);
    cache.set(ev, fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
  }
  return cache.get(ev);
}

/** Every { url, quote, ev } object anywhere inside `value`, with its path. */
export function collectSources(value, at = "") {
  const out = [];
  if (Array.isArray(value)) value.forEach((v, i) => out.push(...collectSources(v, `${at}[${i}]`)));
  else if (value && typeof value === "object") {
    if (typeof value.url === "string" && typeof value.quote === "string" && typeof value.ev === "string") out.push({ at, src: value });
    for (const [k, v] of Object.entries(value)) out.push(...collectSources(v, at ? `${at}.${k}` : k));
  }
  return out;
}

/** Problems for one source, as strings ([] when it checks out). */
export function checkSource(root, { at, src }) {
  const text = load(root, src.ev);
  if (text === null) return [`${at}: evidence file ${src.ev} does not exist`];
  if (src.quote.length < 12) return [`${at}: quote shorter than 12 characters`];
  if (src.ev.endsWith(".json")) {
    let rows;
    try {
      rows = JSON.parse(text);
    } catch {
      return [`${at}: ${src.ev} is not valid JSON`];
    }
    const hit = rows.some((r) => r.url === src.url && r.quote === src.quote);
    return hit ? [] : [`${at}: quote not in ${src.ev} under ${src.url}: "${src.quote.slice(0, 80)}"`];
  }
  if (!text.includes(src.url)) return [`${at}: ${src.url} not in ${src.ev}`];
  return text.includes(JSON.stringify(src.quote).slice(1, -1)) || text.includes(src.quote) ? [] : [`${at}: quote not in ${src.ev}`];
}

export function checkAll(root, value) {
  return collectSources(value).flatMap((s) => checkSource(root, s));
}

/** "10,000" and "10000" both count as stating 10000. */
export function statesNumber(quote, n) {
  const plain = String(n);
  const commas = n.toLocaleString("en-US");
  const re = (s) => new RegExp(`(^|[^\\d.,])${s.replace(/[.,]/g, "\\$&")}(?![\\d])`);
  return re(plain).test(quote) || re(commas).test(quote);
}
