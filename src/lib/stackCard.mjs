/**
 * What the /my-stack share card says (ops/VIRAL-20-2026-11-06.md item 7),
 * kept apart from the drawing (src/lib/shareCard.ts) so it can be tested
 * (scripts/wearable-quiz.test.mjs). The card is drawn in the browser from
 * the stack the reader picked and the deadlines the page already shows;
 * nothing is uploaded.
 */

export const STACK_CARD_MAX_PRODUCTS = 12;
export const STACK_CARD_MAX_DEADLINES = 3;

const DAY = 86400000;
const days = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

/**
 * @param {{ products: string[], deadlines: { title: string, target: string, exact: boolean, who: string[] }[], today: string }} o
 * @returns {{ products: string[], more: number, deadlines: string[], ahead: number, text: string }}
 */
export function stackCardModel({ products, deadlines, today }) {
  const shown = products.slice(0, STACK_CARD_MAX_PRODUCTS);
  const ahead = deadlines
    .filter((d) => d.target >= today)
    .sort((a, b) => (a.target < b.target ? -1 : a.target > b.target ? 1 : a.title.localeCompare(b.title)));
  const lines = ahead.slice(0, STACK_CARD_MAX_DEADLINES).map((d) => {
    const n = days(today, d.target);
    const when = n === 0 ? "today" : `in ${d.exact ? "" : "~"}${n} day${n === 1 ? "" : "s"}`;
    return `${when} · ${d.who.join(", ")}: ${d.title}`;
  });
  const text =
    products.length === 0
      ? ""
      : `My health-data stack: ${products.join(", ")}.${ahead.length ? ` ${ahead.length} dated ${ahead.length === 1 ? "item" : "items"} ahead, the next ${lines[0]}.` : " No dated item ahead."}`;
  return { products: shown, more: products.length - shown.length, deadlines: lines, ahead: ahead.length, text };
}
