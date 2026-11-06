import { AGGREGATOR_MATRIX } from "@/data/aggregatorChooser";
import type { CellValue, EvidenceMatrix, MatrixRow } from "@/lib/evidenceMatrix";

/**
 * What /tools/aggregator-chooser says about its data (ops/VIRAL-20-2026-11-06.md
 * item 16), shared by the page, its markdown mirror and the llms files so all
 * of them print the same names and counts.
 *
 * Every sentence below that names a vendor is assembled from the matrix's
 * cells (src/data/aggregatorChooser.ts), each of which quotes its source, so
 * the use cases and FAQ answers cannot say more than the cells do and change
 * when they change. The connecting prose states no vendor fact, ranks no one
 * and recommends no one.
 */

export const AGG_PATH = "/tools/aggregator-chooser";
export const AGG_H1 = "Wearable health data aggregator chooser: Terra, ROOK, Junction, Spike, Thryve, Sahha, Open Wearables, Validic";
export const AGG_TITLE = "Health Data Aggregator Chooser: Terra, ROOK, Junction";
export const AGG_DESCRIPTION =
  "Filter Terra, ROOK, Junction, Spike, Thryve, Sahha, Open Wearables and Validic by sources, price, webhooks, BAA, data region and self-hosting.";
export const AGG_PRIMARY_QUERY = "terra api alternatives comparison";

const m: EvidenceMatrix = AGGREGATOR_MATRIX;

/** "A, B and C" */
export function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** A row's name without the parenthetical ("Junction (formerly Vital)" → "Junction"). */
export const shortName = (r: MatrixRow) => r.name.replace(/ \(.*\)$/, "");

/** Rows whose cell for `col` has `value`. */
export function rowsWith(col: string, value: CellValue = "yes"): MatrixRow[] {
  return m.rows.filter((r) => r.cells[col]?.value === value);
}
const notYes = (col: string) => m.rows.filter((r) => r.cells[col].value !== "yes").map(shortName);

/** "Name: cell text" for every row that documents `col`. */
export function said(col: string): string[] {
  return rowsWith(col).map((r) => `${shortName(r)}: ${r.cells[col].text}`);
}

export function aggregatorCapsule(): string {
  const n = m.rows.length;
  const priced = rowsWith("price");
  const baa = rowsWith("baa");
  const region = rowsWith("residency");
  const self = rowsWith("selfHost");
  return (
    `There is no single best aggregator: the right one depends on which sources you need, how you want to be billed and what compliance you must show. ` +
    `Of the ${n} here, ${priced.length === n ? "all" : priced.length} publish a starting price, ${baa.length} document a BAA (on which plan varies), ` +
    `${region.length} say where data is stored or let you choose (${list(region.map(shortName))}), and ` +
    `${self.length === 1 ? `only ${self[0].name} is software` : `${self.length} are software`} you host yourself. ` +
    `Tick what you need and the table reorders by what each vendor's own pages document. Every cell quotes its source, each quote re-found in its live source on ${m.checkedOn}; "not stated" means the pages read do not say, not that a feature is missing.`
  );
}

export type UseCase = { id: string; title: string; col: string; intro: string; lines: string[]; silent: string[] };

/**
 * Trade-offs per use case: `lines` are what each documenting vendor's cell
 * says, `silent` the vendors whose pages read do not say. No order beyond the
 * matrix's own, and no winner.
 */
export function useCases(): UseCase[] {
  const mk = (id: string, title: string, col: string, intro: string): UseCase => ({ id, title, col, intro, lines: said(col), silent: notYes(col) });
  return [
    mk(
      "phone-first",
      "Your users mostly carry iPhones and Android phones",
      "phoneSdk",
      "Apple Health and Health Connect keep data on the phone, so an aggregator reaches them through its own mobile SDK. What differs is which SDKs ship and on which plan.",
    ),
    mk("try-free", "You want to build before you pay", "free", "A trial ends; a free plan or a self-hosted core does not. Check which one a vendor offers before you plan a pilot around it."),
    mk(
      "hipaa",
      "You build for a covered entity or a business associate",
      "baa",
      "Which plan carries the BAA matters as much as whether there is one: it sets your real entry price.",
    ),
    mk(
      "region",
      "Your data has to stay in one region",
      "residency",
      "A stated hosting country, a region you pick per team and a deployment in your own cloud are different promises.",
    ),
    mk(
      "own-the-stack",
      "You want to own the stack",
      "selfHost",
      "Self-hosting trades the vendor's managed provider credentials for your own developer account with every provider; read the own-accounts column with this one.",
    ),
    mk(
      "glucose",
      "You need continuous glucose",
      "cgm",
      "Glucose providers are where aggregators most often need your own developer account, so read the own-accounts column with this one too.",
    ),
    mk("labs", "You want lab results beside wearable data", "labs", "Some vendors order tests, others parse lab reports your users upload. They are different products, billed differently."),
    mk(
      "agents",
      "You are wiring health data into an AI agent",
      "mcp",
      "An MCP server saves writing a retrieval layer; it does not change which sources the vendor can reach.",
    ),
  ];
}

export type AggFaq = { q: string; a: string };

export function aggregatorFaqs(): AggFaq[] {
  const n = m.rows.length;
  const free = rowsWith("free");
  const region = rowsWith("residency");
  const self = rowsWith("selfHost");
  const priced = rowsWith("price");
  const viaSales = priced.filter((r) => /demo|negotiated/i.test(r.cells.price.text));
  return [
    {
      q: "Is there a best wearable health data aggregator for developers?",
      a:
        `No single one: each documents a different mix of sources, billing, compliance and hosting, so decide by use case. ` +
        `If your users are mostly on phones, compare the mobile SDKs. For HIPAA work, compare which plan carries the BAA. ` +
        `For a fixed data region, ${list(region.map(shortName))} state one. ` +
        (self.length ? `To own the stack, ${list(self.map(shortName))} ${self.length === 1 ? "is" : "are"} self-hosted. ` : "") +
        `The chooser on this page orders all ${n} by what their own pages document for the needs you tick, and quotes the page behind every cell.`,
    },
    {
      q: "Which aggregators can I build on without paying first?",
      a: `${said("free").join(". ")}. That is ${free.length} of the ${n}; for ${list(notYes("free"))} the pages read do not state a free plan, free sandbox or free trial.`,
    },
    {
      q: "Which aggregators say where my users' data is stored?",
      a: `${said("residency").join(". ")}. For ${list(notYes("residency"))}, the pages read do not say.`,
    },
    {
      q: "Can I self-host a wearable data aggregator?",
      a:
        self.length === 0
          ? "None of the vendors here documents a self-hosted edition in the pages read."
          : `${said("selfHost").join(". ")}. The trade-off is credentials. ${self.map((r) => `${shortName(r)} on your own accounts: ${r.cells.ownAccounts.text}`).join(". ")}.`,
    },
    {
      q: "Which aggregators publish a starting price?",
      a:
        `${priced.length === n ? "All" : priced.length} of the ${n}. ${said("price").join(". ")}. ` +
        (viaSales.length ? `${list(viaSales.map(shortName))} still route part of the purchase through sales. ` : "") +
        `The billing units differ (per connected source, per active user, per deployment), so compare them at your own user count.`,
    },
  ];
}

/** One paragraph for llms.txt / llms-full.txt. */
export function aggregatorText(): string {
  const yesCells = m.columns.filter((c) => c.kind === "feature").reduce((k, c) => k + rowsWith(c.id).length, 0);
  return `${m.rows.length} aggregators × ${m.columns.length} columns, ${yesCells} documented feature cells, each citing a verbatim quote from the evidence files behind ${m.roundup.href} and the site's aggregator pricing, compare and alternatives pages, every quote re-found in its live source by source-quotes.yml run ${m.checkRun} on ${m.checkedOn}. Filters run in the browser; "not stated" is never read as "no". No vendor is ranked or recommended.`;
}
