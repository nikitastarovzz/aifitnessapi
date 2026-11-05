/**
 * The logic behind evidence-backed comparison matrices
 * (src/lib/evidenceMatrix.ts; /tools/gym-software-api-matrix and
 * /tools/research-platform-chooser). Plain JavaScript so the unit tests
 * (scripts/evidence-matrix.test.mjs) and the pages run the same code.
 *
 * A cell is { value: "yes" | "no" | "unknown", text, ev }: `ev` lists row
 * indices of the page's evidence file, whose verbatim quotes the page prints
 * beside the cell. "unknown" means the passages read do not say; it is never
 * a "no".
 */

export const UNKNOWN_TEXT = "Not stated in the passages read";

/** @typedef {{ value: "yes" | "no" | "unknown", text: string, ev: number[] }} Cell */

/** @param {string} text @param {...number} ev @returns {Cell} */
export const yes = (text, ...ev) => ({ value: "yes", text, ev });
/** @param {string} text @param {...number} ev @returns {Cell} */
export const no = (text, ...ev) => ({ value: "no", text, ev });
/** @param {string} [text] @param {...number} ev @returns {Cell} */
export const unknown = (text = UNKNOWN_TEXT, ...ev) => ({ value: "unknown", text, ev });

/**
 * Every problem with a matrix: missing cells, dangling evidence, a value with
 * no evidence, a text column marked "no".
 * @param {{ id: string, columns: { id: string, kind: string }[], rows: { id: string, cells: Record<string, { value: string, text: string, ev: number[] }> }[] }} m
 * @param {{ quote: string, url: string }[]} evidence
 */
export function matrixProblems(m, evidence) {
  const out = [];
  const colIds = new Set(m.columns.map((c) => c.id));
  const rowIds = new Set();
  for (const r of m.rows) {
    if (rowIds.has(r.id)) out.push(`${m.id}: duplicate row ${r.id}`);
    rowIds.add(r.id);
    for (const c of m.columns) {
      const cell = r.cells[c.id];
      if (!cell) {
        out.push(`${m.id}: ${r.id} has no ${c.id} cell`);
        continue;
      }
      if (!["yes", "no", "unknown"].includes(cell.value)) out.push(`${m.id}: ${r.id}.${c.id} has value ${cell.value}`);
      if (c.kind === "text" && cell.value === "no") out.push(`${m.id}: ${r.id}.${c.id} is a text column and cannot be "no"`);
      if (cell.value !== "unknown" && cell.ev.length === 0) out.push(`${m.id}: ${r.id}.${c.id} says ${cell.value} with no evidence`);
      if (cell.value === "unknown" && cell.ev.length === 0 && cell.text !== UNKNOWN_TEXT)
        out.push(`${m.id}: ${r.id}.${c.id} is unknown but carries its own text without evidence`);
      for (const i of cell.ev) if (!Number.isInteger(i) || !evidence[i]) out.push(`${m.id}: ${r.id}.${c.id} cites evidence row ${i}, which does not exist`);
    }
    for (const k of Object.keys(r.cells)) if (!colIds.has(k)) out.push(`${m.id}: ${r.id} has a cell for unknown column ${k}`);
  }
  return out;
}

/** The matrix with each cell's quotes attached. Throws on any problem. */
export function resolveWith(m, evidence) {
  const problems = matrixProblems(m, evidence);
  if (problems.length) throw new Error(`evidence matrix ${m.id}:\n${problems.join("\n")}`);
  return {
    ...m,
    rows: m.rows.map((r) => ({
      ...r,
      cells: Object.fromEntries(
        Object.entries(r.cells).map(([k, c]) => [k, { ...c, sources: c.ev.map((i) => ({ url: evidence[i].url, quote: evidence[i].quote })) }]),
      ),
    })),
  };
}

/**
 * Rows ordered by how many of the required features they are documented to
 * have ("yes"), then by name. A ranking of documentation, not of products.
 * @template {{ name: string, cells: Record<string, { value: string }> }} T
 * @param {T[]} rows @param {string[]} required
 * @returns {{ row: T, met: number, missing: string[] }[]}
 */
export function rankRows(rows, required) {
  return rows
    .map((row) => {
      const missing = required.filter((id) => row.cells[id]?.value !== "yes");
      return { row, met: required.length - missing.length, missing };
    })
    .sort((a, b) => b.met - a.met || a.row.name.localeCompare(b.row.name));
}
