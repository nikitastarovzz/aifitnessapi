/**
 * Rehype plugins for the "Embed this table" feature (ops/NEXT-10-2026-11-04.md
 * item 7). They run inside the same MDX pipeline the page uses (remark-gfm →
 * remark-rehype), so "the n-th table" means the n-th <table> that pipeline
 * produces — never a second, hand-rolled markdown parser that could disagree
 * with what the page shows.
 *
 * Numbering is 1-based, in document order (a pre-order walk of the hast tree).
 */

type HNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HNode[];
};

function walk(node: HNode, fn: (n: HNode) => void) {
  fn(node);
  for (const c of node.children ?? []) walk(c, fn);
}

function textOf(node: HNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function rowCount(table: HNode): number {
  let rows = 0;
  walk(table, (n) => {
    if (n.type === "element" && n.tagName === "tr") rows++;
  });
  return rows;
}

const isTable = (n: HNode) => n.type === "element" && n.tagName === "table";
const isHeading = (n: HNode) => n.type === "element" && /^h[2-4]$/.test(n.tagName ?? "");

/** What the counting pass records for each table. */
export type TableInfo = {
  /** 1-based position among the body's tables. */
  n: number;
  /** Text of the nearest h2–h4 above the table, if any. */
  section: string | null;
  /** <tr> count, header row included. */
  rows: number;
  /** The table's visible text, whitespace-collapsed. */
  text: string;
};

/** Collects a TableInfo per table into `out`. Leaves the tree alone. */
export function rehypeCollectTables(out: TableInfo[]) {
  return () => (tree: HNode) => {
    let section: string | null = null;
    walk(tree, (n) => {
      if (isHeading(n)) section = textOf(n).replace(/\s+/g, " ").trim() || null;
      else if (isTable(n)) {
        out.push({
          n: out.length + 1,
          section,
          rows: rowCount(n),
          text: textOf(n).replace(/\s+/g, " ").trim(),
        });
      }
    });
  };
}

/**
 * Page mode: stamps each table with its number, row count and section, which the MDX
 * `table` override reads to place the Embed control. Only applied on pages
 * that offer embeds, so every other table on the site renders as before.
 */
export function rehypeNumberTables() {
  return (tree: HNode) => {
    let i = 0;
    let section = "";
    walk(tree, (n) => {
      if (isHeading(n)) section = textOf(n).replace(/\s+/g, " ").trim();
      if (!isTable(n)) return;
      i++;
      n.properties = {
        ...(n.properties ?? {}),
        dataTableIndex: String(i),
        dataTableRows: String(rowCount(n)),
        dataTableSection: section,
      };
    });
  };
}

/**
 * Embed mode: keeps only the n-th table and drops everything else, so the
 * widget renders that table out of the page's own pipeline — same cells, same
 * links, same glossary autolinks as the page shows.
 */
export function rehypeKeepTable(target: number) {
  return () => (tree: HNode) => {
    let i = 0;
    let kept = null as HNode | null;
    walk(tree, (n) => {
      if (!isTable(n)) return;
      i++;
      if (i === target) kept = n;
    });
    tree.children = kept ? [kept] : [];
  };
}
