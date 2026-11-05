/**
 * The sentences /tools/schema-converter and /tools/fitbit-to-google-health
 * share with their markdown mirrors, /llms-index.txt and /llms-full.txt, so
 * a count said in one place is said the same way everywhere.
 */
import { UNIFIED_CONVERTER, UNIFIED_RECORDS, UNIFIED_SCHEMA_VERSION } from "@/data/unifiedSchema";
import { FG_COUNTS, FG_FITBIT_READ_ON, FG_GOOGLE_READ_ON } from "@/lib/fitbitGoogleMap";

export const CONVERTER_TITLE = "Health Data Schema Converter";
export const CONVERTER_DESCRIPTION =
  "Paste a Health Connect record, Google Health API data point or HealthKit export row and see it in one unified shape, field by field, in your browser.";

export function converterCapsule(): string {
  return `Paste a payload in one of the shapes this site documents — HealthKit export.xml rows, Health Connect records in the synthetic data generator's JSON encoding, or Google Health API data points — and see it converted to the unified health-data schema v${UNIFIED_SCHEMA_VERSION} (${UNIFIED_RECORDS.length} record types), with every field traced to its source path, the conversion applied and the platform sentence it rests on. Each result is checked against the published JSON Schema. It runs in your browser; nothing you paste is uploaded. Types outside the schema, and values without a sourced conversion, are reported instead of guessed.`;
}

export const CONVERTER_COUNTS = {
  records: UNIFIED_RECORDS.length,
  healthkitTypes: Object.keys(UNIFIED_CONVERTER.healthkitTypes).length,
  healthConnectClasses: Object.keys(UNIFIED_CONVERTER.healthConnectClasses).length,
  googleProperties: Object.keys(UNIFIED_CONVERTER.googleProperties).length,
};

export const FITBIT_TOOL_TITLE = "Fitbit to Google Health API Mapping";
export const FITBIT_TOOL_DESCRIPTION =
  "Search every Fitbit Web API endpoint and see its Google Health API data type, method and scopes, from Google's migration tables. Unmapped ones say so.";

export function fitbitToolCapsule(): string {
  const c = FG_COUNTS;
  return `Search all ${c.endpoints} endpoints in Fitbit's Web API reference (read ${FG_FITBIT_READ_ON}) and see what replaces each in the Google Health API, using only Google's own migration tables (read ${FG_GOOGLE_READ_ON}): the data type, the method Google's endpoint table names, and the scopes. ${c.mapped} endpoints map on both halves, ${c.partial} map their data but have no endpoint-type row, ${c.nameMatch} have only a same-named discovery method, and ${c.unmapped} — friends, badges, alarms, goals, favorites, water and Fitbit's OAuth endpoints among them — are not in Google's tables, and the tool says so.`;
}
