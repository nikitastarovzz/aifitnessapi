import { ALL_TERMS, GLOSSARY_PATH } from "@/data/glossary";

/**
 * First-mention glossary linking. Every cluster body already uses the site's
 * vocabulary — HRV, Health Connect, rep counting — and the glossary already
 * defines each term in one honest sentence with a link to the page that
 * treats it properly. Wiring the two together turns that vocabulary into
 * navigation without a writer having to remember to do it.
 *
 * Deliberately conservative:
 *  - only the FIRST mention of a term, and at most `MAX` links per page
 *  - never inside code (fenced or inline), an existing link, a heading, or a
 *    raw HTML tag — the places where an injected link would corrupt meaning
 *  - never on the page the glossary itself points at for that term (a page
 *    does not link to the glossary to explain its own subject)
 */

const MAX = 5;

const slugOf = (term: string) =>
  term
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Term → the phrase that actually appears in prose, longest first. */
const PHRASES = ALL_TERMS.map((t) => ({
  href: t.href,
  target: `${GLOSSARY_PATH}#term-${slugOf(t.term)}`,
  phrase: t.term.replace(/\s*\([^)]*\)\s*/g, " ").trim(),
}))
  .filter((t) => t.phrase.length >= 4)
  .sort((a, b) => b.phrase.length - a.phrase.length);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Spans a link must never be injected into. */
const PROTECTED = /(`[^`]*`|\[[^\]]*\]\([^)]*\)|!\[[^\]]*\]|<[^>]+>|https?:\/\/\S+)/g;

export function autolinkGlossary(body: string, currentPath: string): string {
  const remaining = PHRASES.filter((p) => p.href !== currentPath);
  const used = new Set<string>();
  const lines = body.split("\n");
  let inFence = false;
  let linked = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    // Headings keep their own anchor behaviour; indented blocks are code.
    if (inFence || /^\s{4,}\S/.test(line) || /^\s*#{1,6}\s/.test(line)) continue;
    if (linked >= MAX) break;

    const parts = line.split(PROTECTED);
    for (let p = 0; p < parts.length; p++) {
      // Odd indices are the captured protected spans — leave them alone.
      if (p % 2 === 1 || linked >= MAX) continue;
      for (const t of remaining) {
        if (used.has(t.target) || linked >= MAX) continue;
        const re = new RegExp(`(?<![\\w-])(${escape(t.phrase)})(?![\\w-])`, "i");
        const m = parts[p].match(re);
        if (!m) continue;
        parts[p] = parts[p].replace(re, `[$1](${t.target})`);
        used.add(t.target);
        linked++;
      }
    }
    lines[i] = parts.join("");
  }
  return lines.join("\n");
}
