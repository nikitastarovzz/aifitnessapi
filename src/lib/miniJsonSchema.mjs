/**
 * A small JSON Schema (draft 2020-12) validator for the subset the unified
 * health-data schema uses (public/schema/v1/unified-health-data.schema.json):
 * local $ref into $defs, oneOf, type (one or a list), const, enum, required,
 * properties, additionalProperties: false, items, minimum, maximum, pattern
 * and format "date-time". Anything else in a schema is ignored, so this is a
 * checker for that one schema, not a general validator.
 *
 * Pure and dependency-free: the /tools/schema-converter page and
 * scripts/unified-convert.test.mjs run the same code.
 */

const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

function typeOk(want, v) {
  const t = typeOf(v);
  return want === t || (want === "number" && t === "integer");
}

function resolve(root, ref) {
  if (!ref.startsWith("#/")) throw new Error(`only local refs are supported: ${ref}`);
  return ref
    .slice(2)
    .split("/")
    .reduce((o, k) => (o ? o[k] : undefined), root);
}

function check(root, schema, v, path, errs) {
  if (schema.$ref) return check(root, resolve(root, schema.$ref), v, path, errs);
  if (schema.oneOf) {
    const results = schema.oneOf.map((s) => {
      const e = [];
      check(root, s, v, path, e);
      return e;
    });
    const passing = results.filter((e) => e.length === 0).length;
    if (passing !== 1) {
      // Report the branch whose `type` const matches, when there is one.
      const i = schema.oneOf.findIndex((s) => {
        const d = s.$ref ? resolve(root, s.$ref) : s;
        return d?.properties?.type?.const !== undefined && v && d.properties.type.const === v.type;
      });
      if (i >= 0) errs.push(...results[i]);
      else errs.push(`${path || "/"}: matches ${passing} of the ${schema.oneOf.length} record shapes, expected exactly 1`);
    }
    return;
  }
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeOk(t, v))) {
      errs.push(`${path || "/"}: expected ${types.join(" or ")}, got ${typeOf(v)}`);
      return;
    }
  }
  if (schema.const !== undefined && v !== schema.const) errs.push(`${path || "/"}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(v)) errs.push(`${path || "/"}: ${JSON.stringify(v)} is not one of ${schema.enum.join(", ")}`);
  if (typeof v === "number") {
    if (schema.minimum !== undefined && v < schema.minimum) errs.push(`${path}: ${v} is below ${schema.minimum}`);
    if (schema.maximum !== undefined && v > schema.maximum) errs.push(`${path}: ${v} is above ${schema.maximum}`);
  }
  if (typeof v === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(v)) errs.push(`${path}: ${JSON.stringify(v)} does not match ${schema.pattern}`);
    if (schema.format === "date-time" && !RFC3339.test(v)) errs.push(`${path}: ${JSON.stringify(v)} is not an RFC 3339 date-time`);
  }
  if (Array.isArray(v) && schema.items) v.forEach((x, i) => check(root, schema.items, x, `${path}/${i}`, errs));
  if (typeOf(v) === "object") {
    for (const k of schema.required ?? []) if (!(k in v)) errs.push(`${path || ""}/${k}: required`);
    const props = schema.properties ?? {};
    for (const [k, x] of Object.entries(v)) {
      if (props[k]) check(root, props[k], x, `${path}/${k}`, errs);
      else if (schema.additionalProperties === false) errs.push(`${path}/${k}: not allowed`);
    }
  }
}

/** Validate `value` against `schema` (the root document). Returns a list of error strings; empty means valid. */
export function validate(schema, value) {
  const errs = [];
  check(schema, schema, value, "", errs);
  return errs;
}
