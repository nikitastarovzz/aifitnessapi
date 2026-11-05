/**
 * The model and SVG of the printable Fitness API Atlas (/atlas,
 * ops/AUDIENCE-30-2026-11-05.md item 30). scripts/build-atlas.mjs renders it;
 * scripts/atlas.test.mjs tests it.
 *
 * Nothing on the poster is typed here. Every product, category and billing
 * label comes from public/datasets/fitness-apis-2026.json (built from
 * src/data/apis.ts), every dated shutdown from src/data/graveyard.ts, and
 * every change from public/datasets/fitness-api-changes-2026.json. The date
 * printed is the newest date those inputs were checked, never the day the
 * script ran, so a rebuild with unchanged inputs writes identical bytes.
 */
import fs from "node:fs";
import path from "node:path";

/** The cost model's category order and labels (src/data/costModel.ts), read from the module itself. */
export function readCategories(root) {
  const src = fs.readFileSync(path.join(root, "src/data/costModel.ts"), "utf8");
  const labelsBlock = /export const CATEGORY_LABELS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(src)?.[1];
  const orderBlock = /export const CATEGORY_ORDER[^=]*=\s*\[([\s\S]*?)\n\];/.exec(src)?.[1];
  const devBlock = /export const DEV_COST_LABELS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(src)?.[1];
  if (!labelsBlock || !orderBlock || !devBlock) throw new Error("atlas: could not read CATEGORY_LABELS, CATEGORY_ORDER or DEV_COST_LABELS from costModel.ts");
  const pairs = (block) => Object.fromEntries([...block.matchAll(/^\s*"?([a-z-]+)"?:\s*"([^"]+)",?$/gm)].map((m) => [m[1], m[2]]));
  const labels = pairs(labelsBlock);
  const order = [...orderBlock.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
  const devCost = pairs(devBlock);
  for (const id of order) if (!labels[id]) throw new Error(`atlas: category ${id} has no label`);
  return { order, labels, devCost };
}

const maxDate = (ds) => ds.filter(Boolean).sort().at(-1);

/**
 * @param {{ root: string, graveyard: object[] }} input  graveyard: GRAVEYARD from src/data/graveyard.ts
 */
export function atlasModel({ root, graveyard }) {
  const dir = JSON.parse(fs.readFileSync(path.join(root, "public/datasets/fitness-apis-2026.json"), "utf8"));
  const changes = JSON.parse(fs.readFileSync(path.join(root, "public/datasets/fitness-api-changes-2026.json"), "utf8"));
  const { order, labels, devCost } = readCategories(root);
  // The directory (/apis) leaves out cost-model rows that are categories, not
  // products (src/data/apis.ts EXCLUDED); the poster follows it.
  const apisSrc = fs.readFileSync(path.join(root, "src/data/apis.ts"), "utf8");
  const excludedBlock = /const EXCLUDED = new Set\(\[([^\]]*)\]\)/.exec(apisSrc)?.[1];
  if (excludedBlock === undefined) throw new Error("atlas: could not read EXCLUDED from src/data/apis.ts");
  const excluded = new Set([...excludedBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
  const products = dir.items.filter((i) => !excluded.has(i.id));
  const categories = order
    .map((id) => ({
      id,
      label: labels[id],
      items: products
        .filter((i) => i.category === id)
        .map((i) => ({ id: i.id, label: i.label, devCost: i.devCost, devCostLabel: devCost[i.devCost] ?? i.devCost, gated: Boolean(i.approvalGate) })),
    }))
    .filter((c) => c.items.length > 0);
  const placed = categories.reduce((n, c) => n + c.items.length, 0);
  if (placed !== products.length) throw new Error(`atlas: placed ${placed} of ${products.length} directory products; a category is missing from CATEGORY_ORDER`);

  const asOf = maxDate([...graveyard.map((g) => g.source?.checkedOn), ...changes.items.map((c) => c.verifiedOn)]);
  const shutdowns = [...graveyard]
    .map((g) => ({ id: g.id, name: g.name, vendor: g.vendor, status: g.status, end: g.end, endLabel: g.endLabel }))
    .sort((a, b) => (b.end ?? "").localeCompare(a.end ?? "") || a.name.localeCompare(b.name));
  const yearBefore = `${Number(asOf.slice(0, 4)) - 1}${asOf.slice(4)}`;
  const recent = changes.items
    .filter((c) => c.status === "confirmed" && c.sortDate > yearBefore)
    .map((c) => ({ date: c.date, title: c.title }));
  return { asOf, total: products.length, categories, shutdowns, recent, devCost };
}

/* ── SVG ─────────────────────────────────────────────────────────────── */

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Greedy wrap by an estimated character width; never splits a word. */
export function wrap(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if (line && (line + " " + w).length > maxChars) {
      lines.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push(line);
  return lines;
}

const W = 1191;
const H = 1684;
const M = 48;
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
const INK = "#0f172a";
const MUTED = "#475569";
const RULE = "#cbd5e1";
const BRAND = "#4f46e5";
const COST_COLOR = { free: "#15803d", "free-tier-then-paid": "#0e7490", "usage-based": "#b45309", "contact-sales": "#475569" };
const STATUS_COLOR = { dying: "#b91c1c", deprecated: "#b45309", dead: "#475569" };
const STATUS_WORD = { dying: "Dying", deprecated: "Deprecated", dead: "Dead" };

const fmtDate = (d) => {
  if (!d) return "Undated";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m, day] = d.split("-");
  if (!m) return y;
  if (!day) return `${months[Number(m) - 1]} ${y}`;
  return `${months[Number(m) - 1]} ${Number(day)}, ${y}`;
};

function text(x, y, s, { size = 12, weight = 400, fill = INK, anchor = "start" } = {}) {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
}

export function atlasSvg(model, { site = "aifitnessapi.com" } = {}) {
  const out = [];
  const push = (s) => out.push(s);
  let y = M + 40;
  push(text(M, y, "The Fitness API Atlas", { size: 44, weight: 800 }));
  y += 34;
  push(
    text(M, y, `${model.total} products in the ${site} directory, by category and by how each bills developers, with every shutdown in the ${site} graveyard.`, {
      size: 15,
      fill: MUTED,
    }),
  );
  y += 22;
  push(text(M, y, `Data as of ${fmtDate(model.asOf)} · ${site}/atlas · CC BY 4.0`, { size: 12, fill: MUTED }));
  y += 18;
  push(`<line x1="${M}" y1="${y}" x2="${W - M}" y2="${y}" stroke="${INK}" stroke-width="2"/>`);

  // Section A: the directory by category.
  y += 36;
  push(text(M, y, "1 · The directory, by category", { size: 20, weight: 700 }));
  // Legend.
  let lx = W - M;
  const legend = Object.entries(model.devCost).reverse();
  for (const [id, label] of legend) {
    const w = label.length * 6.6 + 18;
    lx -= w;
    push(`<rect x="${lx}" y="${y - 13}" width="${w - 6}" height="18" rx="9" fill="${COST_COLOR[id] ?? MUTED}"/>`);
    push(text(lx + (w - 6) / 2, y, label, { size: 10.5, weight: 600, fill: "#ffffff", anchor: "middle" }));
  }
  push(text(lx - 10, y, "How it bills you:", { size: 11, fill: MUTED, anchor: "end" }));
  y += 18;
  push(text(M, y, "◆ a review, approval or declaration to clear before you can ship.", { size: 11, fill: MUTED }));
  y += 16;

  const colW = (W - 2 * M - 24) / 2;
  const ROW = 24;
  const boxH = (c) => 44 + c.items.length * ROW + 6;
  for (let i = 0; i < model.categories.length; i += 2) {
    const pair = model.categories.slice(i, i + 2);
    const h = Math.max(...pair.map(boxH));
    pair.forEach((c, j) => {
      const x = M + j * (colW + 24);
      push(`<rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="10" fill="#f8fafc" stroke="${RULE}"/>`);
      push(text(x + 16, y + 28, c.label, { size: 15, weight: 700, fill: BRAND }));
      push(text(x + colW - 16, y + 28, `${c.items.length}`, { size: 13, weight: 700, fill: MUTED, anchor: "end" }));
      c.items.forEach((it, k) => {
        const ry = y + 44 + k * ROW + 14;
        push(text(x + 16, ry, `${it.gated ? "◆ " : ""}${it.label}`, { size: 12.5 }));
        const bw = it.devCostLabel.length * 6.4 + 14;
        push(`<rect x="${x + colW - 16 - bw}" y="${ry - 12}" width="${bw}" height="16" rx="8" fill="${COST_COLOR[it.devCost] ?? MUTED}"/>`);
        push(text(x + colW - 16 - bw / 2, ry, it.devCostLabel, { size: 10, weight: 600, fill: "#ffffff", anchor: "middle" }));
      });
    });
    y += h + 16;
  }

  // Section B: shutdowns.
  y += 18;
  push(text(M, y, "2 · Shutdowns, deprecations and deadlines", { size: 20, weight: 700 }));
  y += 10;
  for (const g of model.shutdowns) {
    y += 22;
    push(text(M, y, fmtDate(g.end), { size: 12, weight: 600 }));
    push(`<circle cx="${M + 132}" cy="${y - 4}" r="5" fill="${STATUS_COLOR[g.status] ?? MUTED}"/>`);
    push(text(M + 146, y, g.name, { size: 12.5, weight: 600 }));
    const word = STATUS_WORD[g.status] ?? g.status;
    const what = g.endLabel.toLowerCase() === word.toLowerCase() ? word : `${g.endLabel} · ${word}`;
    push(text(W - M, y, `${g.vendor} · ${what}`, { size: 11, fill: MUTED, anchor: "end" }));
  }

  // Section C: the year's confirmed changes, two columns.
  y += 44;
  push(text(M, y, "3 · Confirmed changes in the twelve months to the data date", { size: 20, weight: 700 }));
  y += 12;
  const half = Math.ceil(model.recent.length / 2);
  const colTop = y;
  let bottom = y;
  [model.recent.slice(0, half), model.recent.slice(half)].forEach((col, j) => {
    let cy = colTop;
    const x = M + j * (colW + 24);
    for (const c of col) {
      cy += 20;
      push(text(x, cy, fmtDate(c.date), { size: 11, weight: 600, fill: MUTED }));
      const lines = wrap(c.title, 58);
      lines.forEach((l, k) => push(text(x + 104, cy + k * 15, l, { size: 11.5 })));
      cy += (lines.length - 1) * 15;
    }
    bottom = Math.max(bottom, cy);
  });
  y = bottom;

  const footY = H - M + 8;
  if (y > footY - 40) throw new Error(`atlas: content runs to y=${Math.round(y)}, past the footer at ${footY - 40}; the poster no longer fits`);
  push(`<line x1="${M}" y1="${footY - 28}" x2="${W - M}" y2="${footY - 28}" stroke="${RULE}"/>`);
  push(
    text(M, footY - 10, `Sources: ${site}/datasets (fitness-apis-2026, fitness-api-changes-2026) and ${site}/graveyard, each entry linked to its sourced page there.`, {
      size: 10.5,
      fill: MUTED,
    }),
  );
  push(
    text(M, footY + 6, "Not a ranking. KinesteX funds this site; its entry is drawn like every other. Billing labels describe what the developer pays, not quality.", {
      size: 10.5,
      fill: MUTED,
    }),
  );

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-labelledby="atlas-title">` +
    `<title id="atlas-title">The Fitness API Atlas, data as of ${model.asOf}</title>` +
    `<rect width="${W}" height="${H}" fill="#ffffff"/>` +
    out.join("") +
    `</svg>\n`
  );
}
