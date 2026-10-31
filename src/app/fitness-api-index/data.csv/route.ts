import { indexExport } from "@/lib/ecosystemSignals";

/**
 * /fitness-api-index as CSV (RFC 4180, every non-null cell quoted, null as an
 * empty field — the convention of the files under public/datasets).
 */
export const dynamic = "force-static";

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  return `"${String(v).replace(/"/g, '""')}"`;
}

export function GET() {
  const asOf = new Date().toISOString().slice(0, 10);
  const items = indexExport(asOf).map((r) => ({ as_of: asOf, ...r }));
  const cols = Object.keys(items[0]) as (keyof (typeof items)[number])[];
  const csv =
    [cols.join(","), ...items.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'inline; filename="fitness-api-index.csv"',
    },
  });
}
