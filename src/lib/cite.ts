/**
 * Citation strings for a page: one builder, so the "Cite this page" box at
 * the foot of a spoke and the toggle in PageActions say the same thing.
 * Pure string functions — safe in client and server components alike.
 */

const PUBLISHER = "AIFitnessAPI";

/** BibTeX reserves these; a title that contains one must escape it. */
function bibEscape(s: string): string {
  return s.replace(/([&%$#_{}])/g, "\\$1");
}

/** `aifitnessapi-pricing-oura-api-pricing` for `/pricing/oura-api-pricing`. */
export function citeKey(path: string): string {
  return `aifitnessapi-${path.split("/").filter(Boolean).join("-")}`;
}

/**
 * Plain-text citation. `verifiedLabel` is the phrase before the date:
 * "Last verified" in English; a translation passes its own wording.
 */
export function plainCitation({
  title,
  url,
  verified,
  verifiedLabel = "Last verified",
  verifiedSuffix = "",
}: {
  title: string;
  url: string;
  verified: string;
  verifiedLabel?: string;
  /** Appended after the date, e.g. a translation's "(versão em inglês)". */
  verifiedSuffix?: string;
}): string {
  // A title that already ends a sentence ("What Does It Actually Cost?") takes no extra period.
  const stop = /[.?!]$/.test(title) ? "" : ".";
  return `${PUBLISHER}. "${title}${stop}" ${verifiedLabel} ${verified}${verifiedSuffix}. ${url}`;
}

/** BibTeX @misc entry. `note` defaults to the English verification line. */
export function bibtexCitation({
  path,
  title,
  url,
  verified,
  note,
  language,
}: {
  path: string;
  title: string;
  url: string;
  verified: string;
  note?: string;
  language?: string;
}): string {
  const lines = [
    `@misc{${citeKey(path)},`,
    `  author = {{${PUBLISHER}}},`,
    `  title = {${bibEscape(title)}},`,
    `  year = {${verified.slice(0, 4)}},`,
    `  url = {${url}},`,
    `  urldate = {${verified}},`,
    ...(language ? [`  language = {${language}},`] : []),
    `  note = {${bibEscape(note ?? `Last verified ${verified}`)}}`,
    `}`,
  ];
  return lines.join("\n");
}

/**
 * BibTeX @misc entry for one published dataset edition (/datasets, /press).
 * The year is the edition's, read off its version string ("2026.1"), not a
 * date typed here; the access date is the citing reader's to add.
 */
export function datasetBibtex({
  slug,
  name,
  version,
  url,
  license,
}: {
  slug: string;
  name: string;
  version: string;
  url: string;
  license: string;
}): string {
  return [
    `@misc{aifitnessapi-${slug},`,
    `  author = {{${PUBLISHER}}},`,
    `  title = {${bibEscape(name)}},`,
    `  version = {${version}},`,
    `  year = {${version.slice(0, 4)}},`,
    `  publisher = {aifitnessapi.com},`,
    `  url = {${url}},`,
    `  note = {${bibEscape(`Dataset, ${license}`)}}`,
    `}`,
  ].join("\n");
}
