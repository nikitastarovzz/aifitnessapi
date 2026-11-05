import { UNIFIED_SCHEMA_FILES, UNIFIED_READ_ON } from "@/data/unifiedSchema";
import { CONVERTER_COUNTS, CONVERTER_DESCRIPTION, converterCapsule } from "@/lib/schemaToolsText";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/schema-converter";

/** /tools/schema-converter.md — mirrors src/app/tools/schema-converter/page.tsx. */
export function schemaConverterMirror(): MirrorDoc {
  return {
    path: PATH,
    title: "Health data schema converter: three platforms in, one shape out",
    description: CONVERTER_DESCRIPTION,
    updated: UNIFIED_READ_ON,
    type: "tool",
    capsule: converterCapsule(),
    body: [
      interactiveNote(PATH, "the converter, with synthetic samples and field-by-field explanations"),
      "",
      "## What it reads",
      "",
      `- HealthKit export.xml rows. <Record> and <Workout> start tags from the file the iPhone Health app exports, read with the ${link("Apple Health export explorer", "/tools/apple-health-explorer")}’s scanner. Apple does not publish the file’s attribute names, so the converter reads the ones the file carries (type, unit, value, startDate, endDate). It maps ${CONVERTER_COUNTS.healthkitTypes} type identifiers; sleep rows are grouped into one session.`,
      `- HealthKit JSON in the ${link("synthetic data generator", "/tools/sample-data")}’s encoding. HealthKit has no JSON wire format, so this is that tool’s documented encoding; a zone name in HKMetadataKeyTimeZone becomes an offset through your browser’s own time-zone database.`,
      `- Health Connect records, keyed by class ({ "StepsRecord": [ … ] }), in the same generator’s encoding of the Kotlin classes: Instants as ISO 8601, ZoneOffsets as +HH:MM, Mass and Length as { value, unit }. ${CONVERTER_COUNTS.healthConnectClasses} classes are mapped.`,
      `- Google Health API data points, one ({ "heartRate": { … } }) or a list response ({ "dataPoints": [ … ] }). int64 values arrive as strings and are parsed; offsets are google-duration seconds. ${CONVERTER_COUNTS.googleProperties} data types are mapped.`,
      "- A whole sample-data download, which the converter recognizes by its _synthetic block.",
      "",
      "## What it refuses to guess",
      "",
      "- A HealthKit percent above 1.0: Apple states percent is 0.0 to 1.0, so 97 is either already scaled or wrong, and the converter will not pick.",
      "- A unit with no sourced factor (feet, stone): pounds and inches use the factors Google’s migration guide prints; anything else is refused.",
      "- A Google standardDeviationMilliseconds as SDNN: Google describes it as the deviation of the measurement, so only the RMSSD field converts.",
      "- A type the schema does not cover: it is listed as not converted, never dropped without a word.",
      "",
      `The page fetches two static files once, the ${link("mappings", UNIFIED_SCHEMA_FILES.mappings)} and the ${link("JSON Schema", UNIFIED_SCHEMA_FILES.schema)}, and converts in this tab. There is no server code behind it and nothing is stored.`,
      "",
      `A free tool from ${site.name}. The schema itself, with every mapping and gap, is at ${link("the unified health-data schema", "/schema")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
