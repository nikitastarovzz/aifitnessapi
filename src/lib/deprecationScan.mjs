/**
 * The deprecation scanner's engine: find references to shut-down, dying or
 * deprecated fitness APIs and SDKs in text (ops/VIRAL-20-2026-11-06.md items
 * 14 and 15).
 *
 * One file, no imports, no Node or DOM APIs, so it runs unchanged in three
 * places:
 *   - the browser, on /tools/deprecation-scanner (src/components/tools/DeprecationScanner.tsx);
 *   - the GitHub Action, which ships a byte-for-byte copy of this file as
 *     actions/fitness-api-deprecation-check/dist/scan.mjs;
 *   - node --test (scripts/deprecation-scan.test.mjs).
 *
 * It knows nothing about any vendor. The rules come from the generated bundle
 * (src/data/deprecationRules.json, the same bytes as the action's
 * dist/rules.json), written by scripts/build-deprecation-rules.mjs from the
 * site's sourced data. qa's DEPRECATION-RULES-STALE fails when either copy, or
 * this file's copy, differs from what the generator would write.
 */

/** A line carrying this marker is skipped (for a reference you keep on purpose). */
export const IGNORE_MARKER = "fitness-api-deprecation-ignore";

/** The kinds of file a rule can be limited to. "code" is everything else. */
export const CONTEXTS = ["code", "npm-manifest", "pypi-manifest", "gradle", "podfile", "pubspec"];

/** Which context a file name puts its text in. */
export function fileContext(name) {
  const base = String(name ?? "").split(/[\\/]/).pop() ?? "";
  const lower = base.toLowerCase();
  if (lower === "package.json") return "npm-manifest";
  if (/^requirements.*\.(txt|in)$/.test(lower) || lower === "pyproject.toml" || lower === "pipfile" || lower === "setup.py" || lower === "setup.cfg" || lower === "constraints.txt")
    return "pypi-manifest";
  if (lower.endsWith(".gradle") || lower.endsWith(".gradle.kts") || lower === "libs.versions.toml") return "gradle";
  if (lower === "podfile" || lower.endsWith(".podspec")) return "podfile";
  if (lower === "pubspec.yaml") return "pubspec";
  return "code";
}

/** A best guess at what pasted text is, when no file name says. */
export function guessContext(text) {
  const t = String(text ?? "").trim();
  if (/^\{[\s\S]*"(dependencies|devDependencies|peerDependencies)"\s*:/.test(t)) return "npm-manifest";
  if (/^\s*(dependencies|dev_dependencies)\s*:/m.test(t) && /^\s*(name|environment|flutter)\s*:/m.test(t)) return "pubspec";
  if (/^\s*(target\s+['"]|platform\s+:ios|pod\s+['"])/m.test(t)) return "podfile";
  if (/\b(implementation|api|compileOnly|testImplementation)\s*[("']/.test(t) || /^\s*plugins\s*\{/m.test(t)) return "gradle";
  const lines = t.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  if (lines.length && lines.every((l) => /^[A-Za-z0-9][A-Za-z0-9._-]*\s*(\[[^\]]*\])?\s*((==|>=|<=|~=|!=|>|<|===)\s*[^\s;#]+(\s*,\s*(==|>=|<=|~=|!=|>|<)\s*[^\s;#]+)*)?\s*(;.*)?$/.test(l) || /^-[rce]\s/.test(l)))
    return "pypi-manifest";
  return "code";
}

/** Compile a bundle's rules once; the result is what scanText takes. */
export function compileRules(bundle) {
  return bundle.rules.map((r) => ({
    rule: r,
    res: r.patterns.map((p) => new RegExp(p.re, `g${p.flags ?? ""}`)),
    requiresFile: r.requiresFile ? new RegExp(r.requiresFile, "i") : null,
    contexts: r.contexts && r.contexts.length ? new Set(r.contexts) : null,
  }));
}

function allowed(c, context) {
  return !c.contexts || c.contexts.has(context);
}

/**
 * Scan one text. Returns hits in line order:
 *   { ruleId, entry, line, column, match, lineText }
 * line and column are 1-based. On each line, overlapping matches keep the
 * most specific rule, and a fallback rule (a bare host or path prefix) is
 * dropped when a specific rule of the same entry matched that line.
 */
export function scanText(text, { compiled, filename, context } = {}) {
  if (!compiled) throw new Error("scanText: pass { compiled: compileRules(bundle) }");
  const ctx = context ?? (filename ? fileContext(filename) : guessContext(text));
  const src = String(text ?? "");
  const usable = compiled.filter((c) => allowed(c, ctx) && (!c.requiresFile || c.requiresFile.test(src)));
  const lines = src.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    if (!lineText || lineText.includes(IGNORE_MARKER)) continue;
    const found = [];
    for (const c of usable) {
      for (const re of c.res) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(lineText))) {
          if (m[0] === "") {
            re.lastIndex++;
            continue;
          }
          found.push({ c, start: m.index, end: m.index + m[0].length, match: m[0] });
        }
      }
    }
    if (!found.length) continue;
    // Most specific first; ties keep rule order (the generator's order).
    found.sort((a, b) => b.c.rule.specificity - a.c.rule.specificity || a.start - b.start);
    const kept = [];
    for (const f of found) {
      if (kept.some((k) => f.start < k.end && k.start < f.end)) continue;
      if (kept.some((k) => k.c.rule.id === f.c.rule.id && k.start === f.start)) continue;
      kept.push(f);
    }
    const specificEntries = new Set(kept.filter((k) => !k.c.rule.fallback).map((k) => k.c.rule.entry));
    const final = kept.filter((k) => !(k.c.rule.fallback && specificEntries.has(k.c.rule.entry)));
    final.sort((a, b) => a.start - b.start);
    for (const f of final) hits.push({ ruleId: f.c.rule.id, entry: f.c.rule.entry, line: i + 1, column: f.start + 1, match: f.match, lineText });
  }
  return hits;
}

/**
 * How serious a hit is, from the graveyard entry it belongs to:
 *   "error"   — the vendor says it is gone (dead), or it is dying and the end
 *               date the vendor gave has passed;
 *   "warning" — dying with the end still ahead, or deprecated (the vendor says
 *               deprecated or unsupported; a date there is when that happened,
 *               not an end).
 * `today` is YYYY-MM-DD. A fuzzy end ("2026") counts as passed only after its
 * last day, so the scanner never claims an end the source does not state.
 */
export function severityOf(entry, today) {
  if (entry.status === "dead") return { level: "error", passed: true };
  if (entry.status === "dying" && entry.endLast && entry.endLast < today) return { level: "error", passed: true };
  return { level: "warning", passed: false };
}

/** Today's date in UTC, YYYY-MM-DD. */
export function todayUtc(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** Hits joined to their rule and entry, ready to print. */
export function describeHits(hits, bundle, today = todayUtc()) {
  const byId = new Map(bundle.rules.map((r) => [r.id, r]));
  return hits.map((h) => {
    const rule = byId.get(h.ruleId);
    const entry = bundle.entries[rule.entry];
    return { ...h, rule, entry, severity: severityOf(entry, today) };
  });
}

/** Counts by severity and by entry. */
export function summarize(described) {
  const out = { total: described.length, errors: 0, warnings: 0, entries: {} };
  for (const d of described) {
    if (d.severity.level === "error") out.errors++;
    else out.warnings++;
    out.entries[d.entry.id] = (out.entries[d.entry.id] ?? 0) + 1;
  }
  return out;
}

/** One plain-text sentence for a hit: what happened and what replaces it. */
export function hitMessage(d) {
  const e = d.entry;
  const when = e.end ? `${e.endLabel}: ${e.endText}` : e.endLabel;
  const passed = d.severity.passed && e.status !== "dead" ? " (that date has passed)" : "";
  const repl = d.rule.replacement.length
    ? `Replacement: ${d.rule.replacement.map((r) => r.label).join("; ")}.`
    : d.rule.replacementNote
      ? d.rule.replacementNote
      : "The vendor names no replacement.";
  return `${d.rule.label}. ${e.name} (${e.vendor}) is ${e.statusLabel.toLowerCase()}. ${when}${passed}. ${repl} “${e.quote}” (${e.publisher})`;
}

// GitHub workflow-command escaping (the toolkit's escapeData / escapeProperty).
export function escapeData(s) {
  return String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
export function escapeProperty(s) {
  return escapeData(s).replace(/:/g, "%3A").replace(/,/g, "%2C");
}

/** A ::error / ::warning workflow command for one described hit. */
export function annotation(d, file, siteUrl) {
  const props = [`file=${escapeProperty(file)}`, `line=${d.line}`, `col=${d.column}`, `title=${escapeProperty(`${d.entry.name}: ${d.entry.statusLabel.toLowerCase()}`)}`].join(",");
  const link = d.entry.migrate ? ` Migration: ${siteUrl}${d.entry.migrate.href}` : "";
  return `::${d.severity.level} ${props}::${escapeData(hitMessage(d) + link)}`;
}
