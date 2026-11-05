import {
  UNIFIED_RECORDS,
  UNIFIED_SCHEMA_FILES,
  UNIFIED_SLEEP_STAGE_MAPS,
  UNIFIED_STAGES,
  UNIFIED_TIME_FIELDS,
  type UsCell,
} from "@/data/unifiedSchema";
import { SCHEMA_DESCRIPTION, SCHEMA_FAQS, SCHEMA_PATH, US_PLATFORMS, UNIFIED_READ_ON, schemaCapsule, schemaCounts } from "@/lib/unifiedSchemaView";
import { faqSection, link, table, type MirrorDoc } from "./core";

/** A cell as the page prints it: field, declared type, conversion; or the reason. */
const cellText = (c: UsCell) =>
  c.status === "mapped" ? [c.field, c.platformType, c.conversion].filter(Boolean).join(" ") : `Not mapped ${c.reason ?? ""}`;

/** /schema.md — mirrors src/app/schema/page.tsx from the same generated module. */
export function schemaMirror(): MirrorDoc {
  const counts = schemaCounts();
  const records = UNIFIED_RECORDS.flatMap((r) => {
    const time = r.shape === "sample" ? UNIFIED_TIME_FIELDS.sample : UNIFIED_TIME_FIELDS.interval;
    const fields = [...time.map((f) => f.name), ...r.valueFields.map((f) => f.name)];
    const out = [
      `## ${r.title} type: "${r.id}"`,
      "",
      r.description,
      "",
      ...table(
        ["Unified field", ...US_PLATFORMS.map((p) => p.label)],
        [
          ["(type)", ...US_PLATFORMS.map((p) => (r.platforms[p.key].type.status === "mapped" ? r.platforms[p.key].type.type : "No type"))],
          ...fields.map((f) => [f, ...US_PLATFORMS.map((p) => cellText(r.platforms[p.key].fields[f]))]),
        ],
      ),
      ...r.notes.map((n) => `- ${n}`),
      ...US_PLATFORMS.flatMap((p) => (r.platforms[p.key].unmappedFields ?? []).map((u) => `- ${u.field} (${p.label}): ${u.reason}`)),
      "",
    ];
    if (r.id === "sleepSession") {
      out.push(`### Sleep stages: ${UNIFIED_STAGES.length} unified values`, "");
      for (const p of ["healthkit", "health-connect", "google-health-api"] as const) {
        out.push(
          ...table(
            ["Value", "Unified", "Platform says"],
            UNIFIED_SLEEP_STAGE_MAPS[p].map((s) => [s.name ? `${s.name} (${s.value})` : String(s.value), s.unified, [s.evidence, s.note].filter(Boolean).join(" ")]),
          ),
        );
      }
    }
    return out;
  });

  const conversions = UNIFIED_RECORDS.flatMap((r) =>
    US_PLATFORMS.flatMap((p) =>
      Object.entries(r.platforms[p.key].fields)
        .filter(([, c]) => c.status === "mapped" && c.factor !== null)
        .map(([f, c]) => [`${r.title} · ${p.label}`, c.field, f, `× ${c.factor} — ${c.conversion}`]),
    ),
  );
  const notMapped = UNIFIED_RECORDS.flatMap((r) =>
    US_PLATFORMS.flatMap((p) => (r.platforms[p.key].type.status === "mapped" ? [] : [`- ${r.title} on ${p.label}. ${r.platforms[p.key].type.reason ?? ""}`])),
  );

  return {
    path: SCHEMA_PATH,
    title: "Unified health-data schema: one shape for four platforms",
    description: SCHEMA_DESCRIPTION,
    updated: UNIFIED_READ_ON,
    type: "dataset-index",
    capsule: schemaCapsule(),
    body: [
      `${link("JSON Schema (draft 2020-12)", UNIFIED_SCHEMA_FILES.schema)} · ${link("TypeScript types (.d.ts)", UNIFIED_SCHEMA_FILES.types)} · ${link("Mappings with evidence (JSON)", UNIFIED_SCHEMA_FILES.mappings)} · ${link("Try the converter", "/tools/schema-converter")}`,
      "",
      `## The ${counts.records} records`,
      "",
      ...UNIFIED_RECORDS.map((r) => `- ${r.title} ${r.id}`),
      "",
      "## How to read the tables",
      "",
      `- A mapped cell names the platform field, its declared type, any conversion, and a Source with the platform’s own sentence. A Not mapped cell says why.`,
      "",
      ...records,
      "## Unit conversions, each with its source",
      "",
      "A factor appears only where a source states it, or where the platform’s field name states its unit and the factor is an SI prefix. Every other mapped value is already in the unified unit.",
      "",
      ...table(["Record · platform", "From", "To", "Factor and source"], conversions),
      "## What is not mapped, and why",
      "",
      ...notMapped,
      "",
      "## How it is generated",
      "",
      "The record shapes are this site’s design. Every platform name in a mapping is looked up in a generated dataset, and the generator stops when one is missing, so a renamed field fails the build instead of shipping a stale mapping.",
      "",
      ...faqSection(SCHEMA_PATH, SCHEMA_FAQS),
    ],
  };
}
