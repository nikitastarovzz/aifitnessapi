#!/usr/bin/env node
/**
 * Convert the site's own prose to US spelling (ops/NEXT-10-2026-11-04.md
 * item 10). The word list and the quote/code-aware scanner live in
 * scripts/lib/usEnglish.mjs, which qa's US-SPELLING gate also reads.
 *
 * What it touches: string literals, template-literal text and JSX text in
 * hand-written src/ files (.ts, .tsx, .mjs) and mcp/src (the MCP tool
 * descriptions /developers renders), and the prose of content/posts/*.mdx. It parses
 * TypeScript with the compiler's own AST, so identifiers, comments, import
 * paths, object keys and type literals are never candidates, and it skips:
 *
 * - the generated data files CLAUDE.md lists ("Generated data — never
 *   hand-edit") — those are vendor text and regenerate anyway;
 * - fields that hold identifiers or verbatim quotes (slug, href, url, id,
 *   quote, verbatim, …) and JSX attributes such as href, id, className;
 * - single-token strings that look like identifiers ("catalogue", "a-b");
 * - JSX inside <code>, <pre>, <blockquote>, <q>, <kbd>, <samp>;
 * - inside any prose: quotations, blockquotes, code, URLs, paths, tags (see
 *   the scanner).
 *
 * content/translations is Portuguese and is not read.
 *
 * Usage: node scripts/us-english.mjs [--dry] [--report]
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { GENERATED, toUS } from "./lib/usEnglish.mjs";

const DRY = process.argv.includes("--dry");

/** Object keys whose values are identifiers, addresses or verbatim quotes. */
const SKIP_KEYS = new Set([
  "slug", "href", "url", "src", "id", "key", "path", "anchor", "className", "icon", "code", "type", "kind",
  "quote", "quotes", "verbatim", "said", "sourceQuote", "identifier", "rawValue", "symbol", "pkg", "package",
  "repo", "npm", "pub", "pypi", "domain", "host", "selector", "event", "field", "fields", "enPath", "basePath",
  "updated", "checked", "date", "lang", "locale",
]);
const SKIP_ATTRS = new Set([
  "href", "src", "id", "className", "key", "rel", "type", "as", "target", "style", "lang", "hrefLang",
  "property", "itemProp", "name", "htmlFor", "role", "method", "action", "pattern", "inputMode", "autoComplete",
  "d", "viewBox", "fill", "stroke", "xmlns", "dateTime", "value", "defaultValue",
]);
const NON_PROSE_JSX = new Set(["code", "pre", "blockquote", "q", "kbd", "samp", "script", "style"]);
const SKIP_CALLS = new Set([
  "includes", "startsWith", "endsWith", "indexOf", "split", "replace", "replaceAll", "match", "matchAll", "test",
  "get", "set", "has", "delete", "querySelector", "querySelectorAll", "getElementById", "track", "require",
  "fetch", "URL", "RegExp", "join", "readFileSync", "existsSync", "resolve", "localeCompare", "getItem", "setItem",
]);

function keyName(n) {
  if (!n) return "";
  if (ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  return "";
}

/** Walk up from a literal to decide whether it is prose. */
function isProseLiteral(node, rawText) {
  // Identifier-like single tokens.
  if (!ts.isJsxText(node) && !/\s/.test(rawText.replace(/\\n/g, " "))) {
    if (/^[a-z]/.test(rawText) || /[-_/.:#@=]/.test(rawText)) return false;
  }
  let child = node;
  let p = node.parent;
  if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
    child = ts.isTemplateHead(node) ? node.parent : node.parent.parent;
    p = child.parent;
  }
  while (p) {
    if (ts.isPropertyAssignment(p)) {
      if (p.name === child) return false;
      if (SKIP_KEYS.has(keyName(p.name))) return false;
      return true;
    }
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isLiteralTypeNode(p) || ts.isImportTypeNode?.(p)) return false;
    if (ts.isElementAccessExpression(p) && p.argumentExpression === child) return false;
    if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(p.operatorToken.kind)) return false;
    if (ts.isCaseClause(p) && p.expression === child) return false;
    if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
      const callee = p.expression;
      const name = ts.isPropertyAccessExpression(callee) ? callee.name.text : ts.isIdentifier(callee) ? callee.text : "";
      if (SKIP_CALLS.has(name)) return false;
      return true;
    }
    if (ts.isJsxAttribute(p)) {
      const n = p.name.getText();
      if (SKIP_ATTRS.has(n) || n.startsWith("data-") || n.startsWith("aria-describedby")) return false;
      return true;
    }
    if (ts.isJsxElement(p)) {
      const tag = p.openingElement.tagName.getText();
      if (NON_PROSE_JSX.has(tag)) return false;
    }
    if (ts.isSourceFile(p)) return true;
    child = p;
    p = p.parent;
  }
  return true;
}

function rawRange(node, sf) {
  const start = node.getStart(sf);
  const end = node.end;
  if (ts.isJsxText(node)) return [node.pos, end];
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [start + 1, end - 1];
  if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node)) return [start + 1, end - 2];
  if (ts.isTemplateTail(node)) return [start + 1, end - 1];
  return null;
}

export function convertTs(file, src, counts) {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : /\.m?js$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  const visit = (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node)
    ) {
      const r = rawRange(node, sf);
      if (r && r[1] > r[0]) {
        const raw = src.slice(r[0], r[1]);
        if (isProseLiteral(node, raw)) {
          const local = {};
          const next = toUS(raw, local);
          if (next !== raw) {
            edits.push([r[0], r[1], next]);
            for (const [k, v] of Object.entries(local)) counts[k] = (counts[k] ?? 0) + v;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  let out = src;
  for (const [a, b, t] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + t + out.slice(b);
  return out;
}

/** MDX: front-matter values are prose except identifier keys; the body is markdown. */
export function convertMdx(src, counts) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
  if (!m) return toUS(src, counts);
  const fm = m[1]
    .split("\n")
    .map((line) => {
      const k = /^\s*(?:- )?([A-Za-z_]+):/.exec(line)?.[1];
      if (k && ["slug", "date", "updated", "author", "tags", "draft", "image", "canonical", "href", "url"].includes(k)) return line;
      // A YAML value is not a quotation even when written in "…": convert inside it.
      const v = /^(\s*(?:- )?[A-Za-z_]+:\s*)"(.*)"\s*$/.exec(line);
      if (v) return `${v[1]}"${toUS(v[2], counts)}"`;
      return toUS(line, counts);
    })
    .join("\n");
  return `---\n${fm}\n---\n${toUS(src.slice(m[0].length), counts)}`;
}

function listFiles() {
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|mjs)$/.test(e.name) && !/\.d\.m?ts$/.test(e.name)) files.push(p);
    }
  };
  walk("src");
  // The MCP server's tool descriptions render on /developers.
  for (const f of fs.readdirSync("mcp/src")) if (f.endsWith(".js")) files.push(path.join("mcp/src", f));
  for (const f of fs.readdirSync("content/posts")) if (f.endsWith(".mdx")) files.push(path.join("content/posts", f));
  return files.filter((f) => !GENERATED.has(f));
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  const counts = {};
  const changed = [];
  for (const f of listFiles()) {
    const src = fs.readFileSync(f, "utf8");
    const out = f.endsWith(".mdx") ? convertMdx(src, counts) : convertTs(f, src, counts);
    if (out !== src) {
      changed.push(f);
      if (!DRY) fs.writeFileSync(f, out);
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`us-english: ${total} replacements in ${changed.length} files${DRY ? " (dry run)" : ""}`);
  for (const [w, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${w}`);
}
