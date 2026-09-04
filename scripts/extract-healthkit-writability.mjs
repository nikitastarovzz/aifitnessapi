/**
 * Derive per-identifier writability from the SAME cached Apple documentation
 * corpus the identifier generator fetched (.cache/healthkit), so the fetch
 * date matches src/data/healthkitIdentifiers.ts exactly and no network is
 * needed. A type is marked read-only ONLY when Apple's own text says so —
 * the sentence is stored beside the flag, and every identifier without such
 * a sentence is simply absent (unknown ≠ writable ≠ read-only).
 *
 * House rule: a short parse fails the build rather than publishing a
 * truncated dataset.
 */
import fs from "node:fs";
import path from "node:path";

const CACHE = ".cache/healthkit";
const OUT = "src/data/healthkitWritability.ts";
// The corpus contained exactly 14 distinct cases with an explicit read-only /
// cannot-save statement when this extractor was written (18 cache files — four
// cases appear under both a bare and a family-prefixed filename). Fewer means
// the parse broke.
const EXPECTED_MIN = 14;

/** Flatten Apple's doc JSON into plain sentences. */
function textOf(node, out) {
  if (node == null) return;
  if (Array.isArray(node)) { for (const n of node) textOf(n, out); return; }
  if (typeof node === "object") {
    if (typeof node.text === "string") out.push(node.text);
    if (typeof node.code === "string") out.push(node.code);
    for (const k of ["inlineContent", "content", "primaryContentSections", "sections", "items", "terms", "definition"]) {
      if (node[k]) textOf(node[k], out);
    }
    return;
  }
}

const PATTERNS = [
  /read-?only/i,
  /cannot save/i,
  /can[’']t save/i,
  /can[’']t request authorization to (?:share|write)/i,
];

const found = new Map(); // case -> evidence sentence
for (const f of fs.readdirSync(CACHE)) {
  if (f.startsWith("_index") || !f.endsWith(".json")) continue;
  const j = JSON.parse(fs.readFileSync(path.join(CACHE, f), "utf8"));
  const runs = [];
  textOf(j, runs);
  const text = runs.join(" ").replace(/\s+/g, " ");
  const sentences = text.split(/(?<=[.!?])\s+/);
  const hit = sentences.find((s) => PATTERNS.some((p) => p.test(s)));
  if (!hit) continue;
  // File names are either "<case>.json" or "<family>-<case>.json".
  const base = f.replace(/\.json$/, "");
  const caseName = base.includes("-") ? base.slice(base.indexOf("-") + 1) : base;
  const prev = found.get(caseName);
  // Keep the longer (more specific) evidence when the case appears twice.
  if (!prev || hit.length > prev.length) found.set(caseName, hit.trim());
}

if (found.size < EXPECTED_MIN) {
  console.error(`extract-healthkit-writability: found ${found.size} read-only statements, expected >= ${EXPECTED_MIN} — parse looks broken, refusing to write.`);
  process.exit(1);
}

const rows = [...found.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([c, e]) => ({ case: c, readOnly: true, evidence: e.slice(0, 400) }));

const body = `/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/extract-healthkit-writability.mjs
 *
 * Identifiers whose Apple documentation EXPLICITLY states the samples are
 * read-only (apps cannot save them). Derived from the same cached corpus as
 * healthkitIdentifiers.ts, so the read date matches. An identifier absent
 * from this list is UNKNOWN, not writable: Apple states writability only in
 * prose, and silence is not a statement.
 */
export type HkWritability = {
  case: string;
  readOnly: true;
  /** Apple's sentence, verbatim — the evidence for the flag. */
  evidence: string;
};

/** Read from the corpus cached on the date in HK_FETCHED_ON. */
export const HK_READONLY: HkWritability[] = ${JSON.stringify(rows, null, 2)};

export const HK_READONLY_SET = new Set(HK_READONLY.map((r) => r.case));
`;
fs.writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${rows.length} explicitly read-only identifiers`);
for (const r of rows) console.log(` ${r.case}`);
