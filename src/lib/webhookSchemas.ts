/**
 * JSON Schemas (draft 2020-12) for the payloads in src/data/webhookPayloads.ts,
 * built from the fields each vendor documents. Served whole at
 * /webhooks/schemas.json and shown per payload on /webhooks.
 *
 * What a schema says, and no more:
 *   - `type` is the vendor's documented type, or the type of the value in its
 *     example where the vendor's page has no field table; `x-type-from`
 *     records which, on every property.
 *   - `required` lists only fields the vendor calls required.
 *   - `additionalProperties` is left open: a vendor adding a field is not an
 *     error in your payload.
 *   - Form-encoded payloads (Withings) are schemas for the parsed key/value
 *     object, where every value is text; `x-documented-type` keeps the type
 *     Withings states, and integer fields carry a digits pattern.
 *
 * `validate` is a small checker for exactly the keywords emitted here (type,
 * enum, pattern, properties, required, items), so the tests can prove every
 * documented sample matches its own schema without a dependency.
 *
 * Only `import type`, so Node's type stripping can load it.
 */
import type { DocumentedPayload, PayloadField, WebhookVendorDoc } from "../data/webhookPayloads";

export type JsonSchema = Record<string, unknown>;

const INT_PATTERN = "^-?[0-9]+$";

function fieldSchema(f: PayloadField): JsonSchema {
  const out: JsonSchema = {};
  if (f.description) out.description = f.description;
  out.type = f.type;
  if (f.enum) out.enum = f.enum;
  if (f.format) out.format = f.format;
  if (f.formType) {
    out["x-documented-type"] = f.formType;
    if (/^int\b/.test(f.formType)) out.pattern = INT_PATTERN;
    if (f.formType.startsWith("string (YYYY-MM-DD) or int")) out.pattern = "^([0-9]{4}-[0-9]{2}-[0-9]{2}|-?[0-9]+)$";
  }
  out["x-type-from"] = f.typeFrom;
  if (f.properties) Object.assign(out, objectBody(f.properties));
  if (f.items) {
    const item = fieldSchema(f.items);
    delete item["x-type-from"];
    out.items = { ...item, "x-type-from": f.items.typeFrom };
  }
  return out;
}

function objectBody(fields: PayloadField[]): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];
  for (const f of fields) {
    properties[f.name] = fieldSchema(f);
    if (f.required) required.push(f.name);
  }
  return { properties, ...(required.length ? { required } : {}), additionalProperties: true };
}

export function schemaId(vendor: Pick<WebhookVendorDoc, "id">, payload: Pick<DocumentedPayload, "id">): string {
  return `${vendor.id}-${payload.id}`.toLowerCase();
}

/**
 * The schema for one documented payload. In the bundle at /webhooks/schemas.json
 * each sits under $defs with an $anchor, so `<bundle url>#<anchor>` addresses it.
 */
export function payloadSchema(vendor: WebhookVendorDoc, payload: DocumentedPayload, sourceUrl: string): JsonSchema {
  const body = { type: "object", ...objectBody(payload.fields) };
  const top =
    payload.topLevel === "array"
      ? { type: "array", items: body }
      : vendor.id === "google-health"
        ? // Google batches several notifications as an array of the same objects.
          { oneOf: [body, { type: "array", items: body }] }
        : body;
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $anchor: schemaId(vendor, payload),
    title: `${vendor.name} webhook: ${payload.title}`,
    description: `Built from the fields ${vendor.name} documents at ${sourceUrl}. ${payload.encoding === "form" ? "The payload is application/x-www-form-urlencoded; this schema describes the parsed key/value object." : "JSON body."}`,
    ...top,
  };
}

/* ---------------------------------------------------------------------- *
 * Validation for the emitted subset
 * ---------------------------------------------------------------------- */

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

function typeMatches(want: unknown, v: unknown): boolean {
  const t = typeOf(v);
  const ok = (w: string) => w === t || (w === "number" && t === "integer");
  return Array.isArray(want) ? want.some((w) => ok(String(w))) : ok(String(want));
}

/** Errors as "path: message"; empty when `value` matches. */
export function validate(schema: JsonSchema, value: unknown, path = "$"): string[] {
  if (Array.isArray(schema.oneOf)) {
    const passing = (schema.oneOf as JsonSchema[]).filter((s) => validate(s, value, path).length === 0);
    return passing.length === 1 ? [] : [`${path}: matches ${passing.length} of the oneOf branches`];
  }
  const errs: string[] = [];
  if (schema.type !== undefined && !typeMatches(schema.type, value)) {
    // A null value is allowed where the example itself shows null (Wahoo's plan_id).
    if (value !== null) return [`${path}: expected ${JSON.stringify(schema.type)}, got ${typeOf(value)}`];
  }
  if (Array.isArray(schema.enum) && !(schema.enum as unknown[]).includes(value)) errs.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if (typeof schema.pattern === "string" && typeof value === "string" && !new RegExp(schema.pattern).test(value)) errs.push(`${path}: does not match ${schema.pattern}`);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const r of (schema.required as string[] | undefined) ?? []) if (!(r in obj)) errs.push(`${path}: missing ${r}`);
    const props = (schema.properties as Record<string, JsonSchema> | undefined) ?? {};
    for (const [k, s] of Object.entries(props)) if (k in obj) errs.push(...validate(s, obj[k], `${path}.${k}`));
  }
  if (Array.isArray(value) && schema.items) value.forEach((item, i) => errs.push(...validate(schema.items as JsonSchema, item, `${path}[${i}]`)));
  return errs;
}

/** Parse a documented sample into the value its schema describes (form payloads become key/value objects). */
export function sampleValue(payload: DocumentedPayload): unknown {
  if (payload.sample == null) return null;
  if (payload.encoding === "form") return Object.fromEntries(new URLSearchParams(String(payload.sample)));
  return payload.sample;
}

/** The whole bundle: every documented payload's schema under $defs. */
export function schemaBundle(vendors: WebhookVendorDoc[], bundleUrl: string, sourceUrl: (v: WebhookVendorDoc, p: DocumentedPayload) => string): JsonSchema {
  const defs: Record<string, JsonSchema> = {};
  for (const v of vendors) for (const p of v.payloads) defs[schemaId(v, p)] = payloadSchema(v, p, sourceUrl(v, p));
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: bundleUrl,
    title: "Wearable webhook payloads, as documented by each vendor",
    description: "One schema per documented example on /webhooks, built from the fields each vendor documents. x-type-from says whether a type comes from the vendor's field table or only from its example.",
    $defs: defs,
  };
}
