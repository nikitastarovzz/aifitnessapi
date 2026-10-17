/**
 * Wear OS Health Services data type pages — /wear-os-data-types/<slug>, one
 * page per DataType companion constant that clears the thin-page rule below.
 *
 * Everything a page states is read out of src/data/healthServicesDataTypes.ts
 * (GENERATED from Google's DataType reference and the Health Services
 * permissions guide — never hand-edited): Google's description verbatim, the
 * declared Kotlin type, the permission only where Google's permissions table
 * names the constant (with the table row it was read from), and the table
 * quirk the generator recorded. This file is the hand-written half: slugs,
 * the rule, and the title, description, capsule and FAQ templates, every
 * clause of which is a field.
 *
 * Cross-platform links: no data on this site maps a Health Services constant
 * to a Health Connect record or a HealthKit type — the verified matrix
 * (matrix.ts) pairs HealthKit with Health Connect only — so no page shows
 * one. Pairing them by name would be the guess the matrix exists to prevent.
 */
import {
  HS_DATA_TYPES,
  HS_DATA_TYPES_FETCHED_ON,
  HS_DATA_TYPE_SUBCLASSES,
  HS_PERMISSION_ROWS,
  HS_PERMISSION_TABLE_LINK_MISMATCHES,
  type HsDataType,
} from "./healthServicesDataTypes";
import { clampDescription, clampTitle } from "@/lib/cluster";

export const HS_BASE = "/wear-os-data-types";

const SITE_SUFFIX = " · AIFitnessAPI";

/** HEART_RATE_BPM → heart-rate-bpm (lower-case ASCII and hyphens only). */
export function hsSlug(name: string): string {
  return name.toLowerCase().replace(/_/g, "-");
}

/** The table row id on /wear-os-data-types (the table page's own formula). */
export function hsRowAnchor(t: Pick<HsDataType, "name">): string {
  return `type-${t.name.toLowerCase()}`;
}

/** Google's one-line description of the data-type class, from the DataType
 *  reference's "Known direct subclasses" table. */
export function hsClassDescription(t: Pick<HsDataType, "dataTypeClass">): string | null {
  return HS_DATA_TYPE_SUBCLASSES.find((s) => s.name === t.dataTypeClass)?.description ?? null;
}

const AGGREGATE = HS_DATA_TYPES.filter((t) => t.dataTypeClass === "AggregateDataType");
const DELTA = HS_DATA_TYPES.filter((t) => t.dataTypeClass === "DeltaDataType");

/**
 * The constant's counterpart on the same reference, by Google's naming: a
 * delta constant NAME and an aggregate constant NAME_TOTAL or NAME_STATS. The
 * same pairing /wear-os-data-types computes for its FAQ, read in both
 * directions. It is a fact about the reference's names; the page shows both
 * constants' own declarations and descriptions so the reader sees what each is.
 */
export function hsCounterpart(t: HsDataType): HsDataType | null {
  if (t.dataTypeClass === "DeltaDataType") {
    return AGGREGATE.find((a) => a.name === `${t.name}_TOTAL` || a.name === `${t.name}_STATS`) ?? null;
  }
  if (t.dataTypeClass === "AggregateDataType") {
    return DELTA.find((d) => t.name === `${d.name}_TOTAL` || t.name === `${d.name}_STATS`) ?? null;
  }
  return null;
}

/** Cells of Google's permissions table that print this constant's name but
 *  link somewhere else (recorded by the generator). */
export function hsTableMismatches(t: Pick<HsDataType, "name">): { shown: string; linksTo: string }[] {
  return HS_PERMISSION_TABLE_LINK_MISMATCHES.filter((m) => m.shown === t.name);
}

/** The row of Google's permissions table the permission was read from. */
export function hsPermissionRow(t: HsDataType) {
  if (!t.permission || !t.permissionEvidence) return null;
  return HS_PERMISSION_ROWS.find((r) => r.text === t.permissionEvidence && r.permission === t.permission) ?? null;
}

// ---------------------------------------------------------------------------
// THE THIN-PAGE RULE
//
// A Health Services DataType constant gets its own page only when ALL of
// these hold:
//   1. Google gives it a description (quoted verbatim on the page);
//   2. its declared Kotlin type was read, so the data-type class, value type
//      and data-point class are known;
//   3. the generated data holds at least TWO of these constant-specific facts:
//        permission      — the permission Google's permissions table lists it
//                          under, with the table row it was read from;
//        detail          — a further paragraph of Google's reference beyond
//                          the first;
//        table-mismatch  — a quirk the generator recorded in Google's
//                          permissions table for this constant;
//        counterpart     — its delta/aggregate counterpart on the same
//                          reference (NAME ↔ NAME_TOTAL or NAME_STATS).
//
// Availability is not counted: the reference prints no per-constant "Added
// in" version and marks none deprecated, so every page would carry the same
// class-level version. No cross-platform mapping is counted because none
// exists in the site's data (see the header).
//
// A constant that fails stays a row on /wear-os-data-types and gets no page
// and no sitemap row. qa's TYPE-PAGE-RULE recomputes the rule from the
// generated file and fails the build when the built pages differ from it.
// ---------------------------------------------------------------------------

export type HsFactKey = "permission" | "detail" | "table-mismatch" | "counterpart";

export const HS_MIN_FACTS = 2;

export function hsFacts(t: HsDataType): HsFactKey[] {
  const facts: HsFactKey[] = [];
  if (hsPermissionRow(t)) facts.push("permission");
  if (t.detail) facts.push("detail");
  if (hsTableMismatches(t).length) facts.push("table-mismatch");
  if (hsCounterpart(t)) facts.push("counterpart");
  return facts;
}

export function hsPageEligible(t: HsDataType): boolean {
  return Boolean(t.description?.trim()) && Boolean(t.kotlinType) && hsFacts(t).length >= HS_MIN_FACTS;
}

let PAGES: HsDataType[] | null = null;

/** Constants that get a page, in the reference's (alphabetical) order. */
export function hsPageTypes(): HsDataType[] {
  PAGES ??= HS_DATA_TYPES.filter(hsPageEligible);
  return PAGES;
}

export function hsHeldBack(): HsDataType[] {
  return HS_DATA_TYPES.filter((t) => !hsPageEligible(t));
}

let BY_SLUG: Map<string, HsDataType> | null = null;
let PATH_BY_NAME: Map<string, string> | null = null;

export function getHsDataTypePage(slug: string): HsDataType | undefined {
  BY_SLUG ??= new Map(hsPageTypes().map((t) => [hsSlug(t.name), t]));
  return BY_SLUG.get(slug);
}

export function hsDataTypePath(t: Pick<HsDataType, "name">): string {
  return `${HS_BASE}/${hsSlug(t.name)}`;
}

/** The page for a constant, or null when the rule holds it back. */
export function hsDataTypePagePath(name: string): string | null {
  PATH_BY_NAME ??= new Map(hsPageTypes().map((t) => [t.name, hsDataTypePath(t)]));
  return PATH_BY_NAME.get(name) ?? null;
}

/** Every fact on these pages is the generator's read; the page's date is it. */
export const hsPageModified = () => HS_DATA_TYPES_FETCHED_ON;

// ---------------------------------------------------------------------------
// Titles, descriptions, capsule, FAQs — every clause a field.
// ---------------------------------------------------------------------------

function fit(candidates: string[], max: number, clamp: (s: string, max: number) => string): string {
  for (const c of candidates) if (c.length <= max) return c;
  return clamp(candidates[candidates.length - 1], max);
}

export function hsPageTitle(t: HsDataType): string {
  return fit(
    [
      `DataType.${t.name}: Wear OS Health Services${SITE_SUFFIX}`,
      `DataType.${t.name}: Wear OS Health Services`,
      `DataType.${t.name} (Wear OS)`,
    ],
    60,
    clampTitle,
  );
}

export function hsPageH1(t: HsDataType): string {
  return `DataType.${t.name}: Wear OS Health Services data type`;
}

export function hsPageDescription(t: HsDataType): string {
  const perm = t.permission ? `permission ${t.permission}` : "no permission in Google's table";
  return fit(
    [
      `DataType.${t.name}: ${t.kotlinType}, ${perm}. Google's description and the permissions-table row, from the Health Services reference.`,
      `DataType.${t.name}: ${t.dataTypeClass} of ${t.valueType} in ${t.dataPointClass}, ${perm}. From Google's Health Services reference.`,
      `DataType.${t.name}: ${t.dataTypeClass}, ${perm}, from Google's Health Services reference.`,
    ],
    155,
    clampDescription,
  );
}

function article(word: string): string {
  return /^[AEIOU]/.test(word) ? "an" : "a";
}

export function hsPageCapsule(t: HsDataType): string {
  const parts: string[] = [];
  parts.push(
    `DataType.${t.name} is ${article(t.dataTypeClass)} ${t.dataTypeClass} constant of Wear OS Health Services (androidx.health.services.client.data.DataType), declared as ${t.kotlinType}: each value is a ${t.valueType} delivered in ${article(t.dataPointClass)} ${t.dataPointClass}.`,
  );
  parts.push(`Google describes it as: “${t.description}”`);
  parts.push(
    t.permission
      ? `Google's Health Services permissions table lists it under ${t.permission}.`
      : "Google's Health Services permissions table does not name it.",
  );
  const c = hsCounterpart(t);
  if (c) parts.push(`The same reference defines ${c.name}, ${article(c.dataTypeClass)} ${c.dataTypeClass} (${c.kotlinType}).`);
  return parts.join(" ");
}

export type HsFaq = { q: string; a: string };

export function hsPageFaqs(t: HsDataType): HsFaq[] {
  const faqs: HsFaq[] = [];
  const row = hsPermissionRow(t);
  faqs.push({
    q: `What permission does DataType.${t.name} need on Wear OS?`,
    a: row
      ? `${t.permission}. Google's Health Services permissions table (read ${HS_DATA_TYPES_FETCHED_ON}) lists ${t.name} in the row "${row.text}".${
          hsTableMismatches(t).length
            ? ` In that table, ${hsTableMismatches(t)
                .map((m) => `the link on ${m.shown} points to #${m.linksTo}`)
                .join("; ")}; this page goes by the name printed.`
            : ""
        }`
      : `Google's Health Services permissions table (read ${HS_DATA_TYPES_FETCHED_ON}) does not name DataType.${t.name}, so this page states no permission for it rather than extending the table by analogy.`,
  });
  const classText = hsClassDescription(t);
  faqs.push({
    q: `Is DataType.${t.name} a delta or an aggregate data type?`,
    a: `${t.dataTypeClass === "DeltaDataType" ? "A delta type" : "An aggregate type"}: Google's reference declares it as ${t.kotlinType}.${
      classText ? ` Google describes ${t.dataTypeClass} as "${classText}"` : ""
    }`,
  });
  faqs.push({
    q: `What value type does DataType.${t.name} deliver?`,
    a: `${t.valueType}, in ${article(t.dataPointClass)} ${t.dataPointClass}, per the declaration ${t.kotlinType}. Google's description: "${t.description}"`,
  });
  const c = hsCounterpart(t);
  if (c) {
    faqs.push({
      q:
        t.dataTypeClass === "DeltaDataType"
          ? `Which aggregate constant goes with DataType.${t.name}?`
          : `Which delta constant does DataType.${t.name} correspond to?`,
      a: `By Google's naming on the same reference, ${c.name} (${c.kotlinType}). Google describes it as: "${c.description}"`,
    });
  }
  if (t.detail) {
    faqs.push({
      q: `What else does Google's reference say about DataType.${t.name}?`,
      a: t.detail,
    });
  }
  return faqs.slice(0, 5);
}

export { HS_DATA_TYPES_FETCHED_ON };
