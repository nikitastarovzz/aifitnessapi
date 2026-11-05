import fs from "node:fs";
import path from "node:path";
import { API_ENTRIES, CATEGORY_LABELS } from "@/data/apis";
import { CHANGE_EVENTS } from "@/data/changes";
import { graveyardCheckedOn } from "@/data/graveyard";
import { graveyardCopy } from "@/lib/graveyardCopy";
import { indexDataDate, indexInputDates, indexRows } from "@/lib/ecosystemSignals";
import { derive, shortDate, WINDOW_DAYS } from "@/lib/ecosystemDerive";
import { buildDate, freshness, slides, yearDataDate, YEAR_PATH, type Slide } from "@/lib/year2026";
import { vendorTimelines } from "@/lib/vendorChanges";
import { collections } from "@/lib/publicApi";

/**
 * The numbers behind /press (ops/MORE-30-2026-11-05.md item 16): figures a
 * journalist or a model can quote about this site and the ecosystem it
 * tracks, each counted at build time from a file in the repository and
 * printed with that file and the date its contents were last written or
 * checked. No figure here is typed by hand; a rebuild is the update, the
 * same rule /2026 and /fitness-api-index follow (and the ecosystem figures
 * below are theirs, read through the same functions, not recounted).
 */

export const PRESS_PATH = "/press";

export type PressSource = { file: string; date: string; dateLabel: string };
export type PressStat = {
  id: string;
  value: string;
  label: string;
  detail: string;
  source: PressSource;
  link: { href: string; label: string };
};

type DatasetFile = { name: string; items: unknown[] };

/** The published datasets, read off public/datasets as /datasets reads them. */
function datasetFiles(): { slug: string; rows: number }[] {
  const dir = path.join(process.cwd(), "public", "datasets");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("manifest"))
    .sort()
    .map((f) => {
      const doc = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as DatasetFile;
      if (!Array.isArray(doc.items) || doc.items.length === 0) throw new Error(`public/datasets/${f} has no items`);
      return { slug: f.replace(/\.json$/, ""), rows: doc.items.length };
    });
}

/** The day the dataset files last changed: the manifest's own date, which
 *  scripts/build-dataset-manifest.mjs moves only when a file's bytes move. */
function datasetsDate(): string {
  const m = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "datasets", "manifest.json"), "utf8")) as {
    generated: string;
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.generated)) throw new Error("public/datasets/manifest.json has no generated date");
  return m.generated;
}

const newest = (ds: (string | null | undefined)[]) =>
  ds.filter((d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().at(-1) as string;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The site's own record: what it tracks, counted. */
export function siteStats(asOf = buildDate()): PressStat[] {
  const out: PressStat[] = [];

  // The directory.
  const inputs = indexInputDates();
  const contactSales = API_ENTRIES.filter((a) => a.devCost === "contact-sales").length;
  const gated = API_ENTRIES.filter((a) => a.approvalGate).length;
  const categories = new Set(API_ENTRIES.map((a) => a.category)).size;
  out.push({
    id: "apis-tracked",
    value: String(API_ENTRIES.length),
    label: "fitness and health APIs, SDKs and models in the directory",
    detail: `In ${plural(categories, "category", "categories")} (${[...new Set(API_ENTRIES.map((a) => CATEGORY_LABELS[a.category]))].join(", ")}). ${contactSales} ${contactSales === 1 ? "publishes" : "publish"} no price (contact sales); ${gated} ${gated === 1 ? "has" : "have"} an approval or review step the site could source.`,
    source: {
      file: "src/data/costModel.ts",
      date: inputs.verifiedNewest as string,
      dateLabel: `source pages verified ${shortDate(inputs.verifiedOldest as string)} to ${shortDate(inputs.verifiedNewest as string)}`,
    },
    link: { href: "/apis", label: "The API directory" },
  });

  // The changes tracker.
  const confirmed = CHANGE_EVENTS.filter((e) => e.status === "confirmed").length;
  const reported = CHANGE_EVENTS.filter((e) => e.status === "reported").length;
  const changesChecked = newest(CHANGE_EVENTS.map((e) => e.verifiedOn));
  const timelines = vendorTimelines();
  out.push({
    id: "changes-logged",
    value: String(CHANGE_EVENTS.length),
    label: "dated ecosystem changes logged: deprecations, deadlines and term changes",
    detail: `${confirmed} confirmed in the vendor's own words, ${reported} reported. ${
      timelines.length
        ? `${plural(timelines.length, "vendor has", "vendors have")} a timeline of their own (${timelines.map((t) => `${t.api.short}, ${t.events.length}`).join("; ")}).`
        : ""
    }`.trim(),
    source: { file: "src/data/changes.ts", date: changesChecked, dateLabel: `newest entry checked ${shortDate(changesChecked)}` },
    link: { href: "/changes", label: "The changes tracker" },
  });

  // The graveyard.
  const g = graveyardCopy();
  out.push({
    id: "deprecations",
    value: String(g.total),
    label: "shut-down, dying or deprecated fitness and health APIs, SDKs and endpoints recorded",
    detail: `${g.dead} dead, ${g.dying} dying with a published end date, ${g.deprecated} deprecated, each with a verbatim quote from the vendor's notice.`,
    source: { file: "src/data/graveyard.ts", date: graveyardCheckedOn(), dateLabel: `sources read up to ${shortDate(graveyardCheckedOn())}` },
    link: { href: "/graveyard", label: "The Fitness API Graveyard" },
  });

  // The open datasets.
  const files = datasetFiles();
  const rows = files.reduce((n, f) => n + f.rows, 0);
  const largest = [...files].sort((a, b) => b.rows - a.rows)[0];
  const dsDate = datasetsDate();
  out.push({
    id: "datasets",
    value: String(files.length),
    label: "open datasets, CC BY 4.0, in JSON and CSV",
    detail: `${rows.toLocaleString("en-US")} rows in all; the largest is ${largest.slug} (${largest.rows.toLocaleString("en-US")} rows).`,
    source: { file: "public/datasets/*.json", date: dsDate, dateLabel: `files last regenerated ${shortDate(dsDate)}` },
    link: { href: "/datasets", label: "The open datasets" },
  });

  // The public API.
  const cols = collections();
  const items = cols.reduce((n, c) => n + c.rows.length, 0);
  const apiDate = newest(cols.map((c) => c.verifiedNow.date));
  out.push({
    id: "api",
    value: String(cols.length),
    label: "collections in the free read-only JSON API",
    detail: `${items.toLocaleString("en-US")} item responses in all, each with its source page, license and verification date; no key.`,
    source: { file: "src/lib/publicApi.ts", date: apiDate, dateLabel: `newest collection verified ${shortDate(apiDate)}` },
    link: { href: "/developers", label: "The developer API and MCP server" },
  });

  // The site's own freshness.
  const f = freshness(asOf);
  out.push({
    id: "verified-90-days",
    value: `${f.within90} of ${f.pages}`,
    label: "guide pages re-checked against their sources in the last 90 days",
    detail: `Median age of a verification stamp: ${f.median} days; ${f.due} pages are due (90 days or older).`,
    source: { file: "src/data/*.entries.ts (updated stamps)", date: asOf, dateLabel: `as of build ${shortDate(asOf)}` },
    link: { href: "/methodology", label: "How pages are verified" },
  });

  return out;
}

/** Release cadence across the directory, as /fitness-api-index computes it. */
export function indexStats(asOf = buildDate()): PressStat[] {
  const rows = indexRows().filter((r) => !r.firstParty);
  const derived = rows.map((r) => ({ r, d: derive(r, asOf) }));
  const withPackages = derived.filter(({ d }) => d.packageCount > 0);
  const active = withPackages.filter(({ d }) => d.packagesActive12 > 0 || (d.sdkReleases12 ?? 0) > 0);
  const withChanges = derived.filter(({ d }) => d.changes12 > 0);
  const inputs = indexInputDates();
  const relDate = newest([inputs.libraries, inputs.sdkReleases, inputs.hcReleases]);
  const out: PressStat[] = [];
  if (withPackages.length >= 2) {
    out.push({
      id: "index-release-cadence",
      value: `${active.length} of ${withPackages.length}`,
      label: `directory products with a tracked SDK or package that released in the last ${WINDOW_DAYS} days`,
      detail: `Counted over the products the index tracks a vendor SDK or open-source package for, ${shortDate(asOf)} back ${WINDOW_DAYS} days. KinesteX, which funds this site, is left out, as the index leaves it unranked.`,
      source: { file: "src/data/libraries.ts, sdkReleases.ts, hcReleases.ts", date: relDate, dateLabel: `registries and releases read up to ${shortDate(relDate)}` },
      link: { href: "/fitness-api-index", label: "The fitness API index" },
    });
  }
  if (withChanges.length >= 2) {
    out.push({
      id: "index-changes-12mo",
      value: `${withChanges.length} of ${rows.length}`,
      label: `directory products named by a tracked change dated in the last ${WINDOW_DAYS} days`,
      detail: `Matched as the directory matches them; KinesteX left out.`,
      source: { file: "src/data/changes.ts", date: inputs.changes as string, dateLabel: `newest entry checked ${shortDate(inputs.changes as string)}` },
      link: { href: "/fitness-api-index", label: "The fitness API index" },
    });
  }
  return out;
}

/** The /2026 story's slides, as that page computes them. */
export function yearStats(asOf = buildDate()): Slide[] {
  return slides(asOf);
}

export { YEAR_PATH };

/**
 * The page's dateModified: the newest date any input was written or checked.
 * The freshness figure moves with the build date, which the page states in
 * words, as /2026 does, rather than re-dating itself.
 */
export function pressDataDate(): string {
  return newest([yearDataDate(), indexDataDate(), graveyardCheckedOn(), datasetsDate(), ...collections().map((c) => c.verifiedNow.date)]);
}
