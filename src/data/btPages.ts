/**
 * Bluetooth GATT reference for fitness and health devices — /bluetooth-fitness
 * and /bluetooth-fitness/<characteristic>.
 *
 * Everything a page states about a characteristic is read out of
 * src/data/bluetoothGatt.ts (GENERATED from the Bluetooth SIG's public
 * repository by scripts/fetch-bluetooth-gatt.mjs — never hand-edited). This
 * file is the hand-written half: paths, titles and descriptions built from the
 * data, the capsule and FAQ templates, the renderer for the SIG's LaTeX-style
 * cross-references, the join to the /devices guides (by UUID, as the guides
 * print it), and four definitions quoted from Google's Android BLE overview
 * with the URL and the date they were read.
 *
 * Grouping: the SIG's files do not say which characteristics a service
 * contains, apart from the permitted-characteristics lists (here, User Data),
 * so nothing groups characteristics under services. The hub lists them in
 * UUID order, the order of characteristic_uuids.yaml.
 *
 * No markdown mirror exists for this section (as for /health-connect), so the
 * pages carry no text/markdown alternate.
 */
import {
  BT_CHARACTERISTICS,
  BT_GATT_FETCHED_ON,
  BT_GATT_PERMITTED_LISTS,
  BT_GATT_SOURCE,
  BT_SERVICES,
  type BtCharacteristic,
  type BtDefinition,
  type BtField,
} from "./bluetoothGatt";
import { releasedDevices } from "./devices";
import { absoluteUrl } from "@/lib/site";
import { orgRef, publishedDate, WEBSITE_ID } from "@/lib/schema";

export const BT_BASE = "/bluetooth-fitness";
export const BT_FETCHED = BT_GATT_FETCHED_ON;
export const BT_COMMIT_SHORT = BT_GATT_SOURCE.commit.slice(0, 7);
export const BT_SECTION = "Bluetooth GATT reference";

export const BT_ALL: BtCharacteristic[] = BT_CHARACTERISTICS;
/** The characteristics that pass the thin-page rule, in UUID order. */
export const BT_PAGES: BtCharacteristic[] = BT_CHARACTERISTICS.filter((c) => c.hasPage);

export const btBySlug = (slug: string) => BT_PAGES.find((c) => c.slug === slug);
export const btById = (id: string) => BT_CHARACTERISTICS.find((c) => c.id === id);
export const btPath = (c: BtCharacteristic) => `${BT_BASE}/${c.slug}`;
export const btHubAnchor = (c: BtCharacteristic) => `char-${c.slug}`;
/** A characteristic's page, or its row on the hub when it has none. */
export const btHref = (c: BtCharacteristic) => (c.hasPage ? btPath(c) : `${BT_BASE}#${btHubAnchor(c)}`);

/** The SIG's file at the commit this data was read from (Bitbucket's file view). */
export const sigFileUrl = (path: string) => `${BT_GATT_SOURCE.repository}/src/${BT_GATT_SOURCE.commit}/${path}`;
export const sigCommitUrl = `${BT_GATT_SOURCE.repository}/commits/${BT_GATT_SOURCE.commit}`;

/** "1, 2 and 3". */
export function listOf(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/* ── The SIG's cross-references ─────────────────────────────────────────── */

/**
 * A run of the SIG's text: plain text, or a cross-reference rendered as a
 * label (a link where it resolves to something on this site).
 *   \autoref{sec:<characteristic>}               → that characteristic
 *   \autoref{sec:<characteristic>/field/<key>}   → a `fields` entry (subfield likewise)
 *   \autoref{sec:<anything else>}                → "§ <label>", a section the YAML files do not include
 *   \RefRef{<key>}                               → "[<key>]", the SIG's bibliography key
 *   \textellipsis → "…", \textsubscript{x} → x, \newpage → nothing
 * The generator refuses any other macro, so nothing here is guessed at.
 */
export type Seg = { t: "text"; v: string } | { t: "ref"; label: string; href: string | null; code: boolean };

function findDefinition(c: BtCharacteristic | undefined, key: string): BtDefinition | null {
  const walk = (defs: BtDefinition[]): BtDefinition | null => {
    for (const d of defs) {
      if (d.key === key) return d;
      const sub = walk(d.subfields);
      if (sub) return sub;
    }
    return null;
  };
  return c?.gss ? walk(c.gss.definitions) : null;
}

/**
 * `idPrefix` is prepended to same-page anchors: the hub renders several
 * characteristics' definitions on one page and prefixes their ids with the
 * characteristic's slug so they stay unique.
 */
function resolveRef(target: string, self: BtCharacteristic | null, idPrefix: string): Seg {
  if (!target.startsWith("org.bluetooth.characteristic.")) return { t: "ref", label: `§ ${target}`, href: null, code: true };
  const [charId, part, key] = target.split("/");
  const c = btById(charId);
  const same = !!c && c.id === self?.id;
  if (!part) {
    if (!c) return { t: "ref", label: charId, href: null, code: true };
    return { t: "ref", label: `${c.name} (${c.uuid})`, href: same ? (c.hasPage && !idPrefix ? "#layout" : btHref(c)) : btHref(c), code: false };
  }
  const def = findDefinition(c, key ?? "");
  if (!c || !def) return { t: "ref", label: `§ ${key ?? target}`, href: null, code: true };
  const href = same ? `#${idPrefix}${def.anchor}` : c.hasPage ? `${btPath(c)}#${def.anchor}` : btHref(c);
  return { t: "ref", label: same ? def.name : `${def.name} in ${c.name}`, href, code: false };
}

export function segments(text: string, self: BtCharacteristic | null, idPrefix = ""): Seg[] {
  const out: Seg[] = [];
  const re = /\\(autoref|RefRef|textsubscript)\{([^}]*)\}|\\(textellipsis|newpage)\b/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ t: "text", v: text.slice(last, at) });
    if (m[1] === "autoref") out.push(resolveRef(m[2].replace(/^sec:/, ""), self, idPrefix));
    else if (m[1] === "RefRef") out.push({ t: "ref", label: `[${m[2]}]`, href: null, code: true });
    else if (m[1] === "textsubscript") out.push({ t: "text", v: m[2] });
    else if (m[3] === "textellipsis") out.push({ t: "text", v: "…" });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out;
}

/** The SIG's text with references flattened to their labels, for capsules, FAQs and descriptions. */
export const plain = (text: string, self: BtCharacteristic | null) =>
  segments(text, self)
    .map((s) => (s.t === "text" ? s.v : s.label))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

/** The first line of a multi-line description, flattened. */
export const firstLine = (text: string, self: BtCharacteristic | null) => plain(text.split("\n")[0] ?? "", self);

/** A multi-line description on one line: "Label:" runs into its next line, other lines are joined with "; ". */
export function oneLine(text: string, self: BtCharacteristic | null): string {
  return text
    .split("\n")
    .map((l) => plain(l, self))
    .filter(Boolean)
    .reduce((acc, l) => (acc ? `${acc}${/:$/.test(acc) ? " " : "; "}${l}` : l), "");
}

/* ── Layout helpers ─────────────────────────────────────────────────────── */

const FLAGS_NAME = /(^|\s)flags$/i;
export const isFlagsField = (f: Pick<BtField, "name" | "type">) => /^boolean\[\d+\]/.test(f.type) && FLAGS_NAME.test(f.name);

/** "0" → [0], "5–7" → [5, 6, 7]; null for anything else. */
export function bitsOf(cell: string): number[] | null {
  const one = /^\d+$/.exec(cell.trim());
  if (one) return [Number(cell)];
  const range = /^(\d+)\s*[–-]\s*(\d+)$/.exec(cell.trim());
  if (!range) return null;
  const out: number[] = [];
  for (let b = Number(range[1]); b <= Number(range[2]); b++) out.push(b);
  return out;
}

/** Every field (structure or struct row) whose parsed condition names this flags definition and one of these bits. */
export function controlledBy(c: BtCharacteristic, def: BtDefinition, bits: number[]) {
  const all: BtField[] = [...(c.gss?.structure ?? [])];
  const walk = (defs: BtDefinition[]) => defs.forEach((d) => (all.push(...(d.layout ?? [])), walk(d.subfields)));
  walk(c.gss?.definitions ?? []);
  return all.filter((f) => f.presence && f.presence.field.toLowerCase() === def.name.toLowerCase() && bits.includes(f.presence.bit));
}

/** The struct a structure field's own description points to, for nested rows in the layout. */
export function structOf(c: BtCharacteristic, f: BtField): BtDefinition | null {
  for (const m of (f.description ?? "").matchAll(/\\autoref\{sec:([^}]+)\}/g)) {
    const [charId, part, key] = m[1].split("/");
    if (charId !== c.id || part !== "field" || !key) continue;
    const d = findDefinition(c, key);
    if (d?.kind === "struct" && d.layout) return d;
  }
  return null;
}

/** Can the published size be zero? ("0 or 2", "0–18", "0 to 3", "0 … 17", "0 or n*2"). */
export const canBeAbsent = (f: Pick<BtField, "size">) => /^0(\s|–|-|…)/.test(f.size.trim());

/** The offset cell: a number where every earlier size is fixed, else what it depends on. */
export function offsetText(fields: BtField[], f: BtField): string {
  if (f.offset !== null) return String(f.offset);
  const vary = f.offsetVariesWith.map((n) => fields.find((x) => x.name === n)).filter((x): x is BtField => !!x);
  if (vary.length && vary.every((v) => v.sizeKind === "optional" && v.presence)) {
    const flagsNames = [...new Set(vary.map((v) => v.presence!.field))];
    const bits = [...new Set(vary.map((v) => v.presence!.bit))].sort((a, b) => a - b);
    return `Depends on ${listOf(flagsNames)} (${bits.length === 1 ? "bit" : "bits"} ${listOf(bits.map(String))})`;
  }
  return `Depends on the size of ${listOf(f.offsetVariesWith)}`;
}

/** The "present when" cell. */
export function presenceText(f: BtField): string {
  if (f.presence) return `Bit ${f.presence.bit} of ${f.presence.field} is ${f.presence.value}`;
  if (f.presenceText) return f.presenceText;
  if (f.sizeKind === "fixed") return "Always (fixed size)";
  return "Not stated in the field's text";
}

/* ── The join to the /devices guides ────────────────────────────────────── */

/** /devices guides that print this characteristic's UUID — the guides' own text decides, not a hand list. */
export function relatedGuides(c: BtCharacteristic): { href: string; label: string }[] {
  const re = new RegExp(`\\b${c.uuid}\\b`);
  return releasedDevices()
    .filter((e) => [e.answer, e.body, ...e.faqs.flatMap((f) => [f.q, f.a])].some((t) => re.test(t)))
    .map((e) => ({ href: `/devices/${e.slug}`, label: e.h1 }));
}

/* ── Titles, descriptions, capsules ─────────────────────────────────────── */

const TITLE_MAX = 60;
const DESC_MAX = 155;
function fit(candidates: string[], max: number, what: string): string {
  const ok = candidates.find((t) => t.length <= max);
  if (!ok) throw new Error(`btPages: no ${what} within ${max} characters: ${candidates[0]}`);
  return ok;
}

export const btTitle = (c: BtCharacteristic) =>
  fit([`${c.name} (${c.uuid}) Characteristic Format`, `${c.name} (${c.uuid}) Byte Layout`, `${c.name} (${c.uuid})`], TITLE_MAX, "title");

export const btH1 = (c: BtCharacteristic) => `${c.name} (${c.uuid}): byte layout`;

export function btDescription(c: BtCharacteristic): string {
  const n = c.gss?.structure.length ?? 0;
  const flags = c.gss?.flagsFields.length ? ", the Flags bits" : "";
  const all = n === 1 ? "its one field" : `all ${n} fields`;
  return fit(
    [
      `${c.name} (${c.uuid}) field by field: ${all} with type, size and offset${flags}, units and conditions, from the Bluetooth SIG's own YAML.`,
      `${c.name} (${c.uuid}): ${all} with type, size, offset${flags} and units, from the Bluetooth SIG's own YAML.`,
      `${c.name} (${c.uuid}): ${plural(n, "field")} with type, size, offset and units, from the Bluetooth SIG's YAML.`,
    ],
    DESC_MAX,
    "description",
  );
}

const fieldNames = (c: BtCharacteristic) => (c.gss?.structure ?? []).map((f) => f.name);
const namesShort = (names: string[], max = 6) => (names.length <= max ? listOf(names) : `${names.slice(0, max - 1).join(", ")} and ${names.length - (max - 1)} more`);

/** Every struct row in a characteristic's definitions, with the struct it belongs to. */
function structRows(c: BtCharacteristic): { def: BtDefinition; f: BtField }[] {
  const out: { def: BtDefinition; f: BtField }[] = [];
  const walk = (defs: BtDefinition[]) => defs.forEach((d) => (d.layout?.forEach((f) => out.push({ def: d, f })), walk(d.subfields)));
  walk(c.gss?.definitions ?? []);
  return out;
}

export function btCapsule(c: BtCharacteristic): string {
  const g = c.gss!;
  const n = g.structure.length;
  const parts: string[] = [];
  parts.push(`${c.name} is Bluetooth GATT characteristic ${c.uuid}, ${c.id} in the Bluetooth SIG's assigned numbers.`);
  parts.push(`The SIG's GATT Specification Supplement file lays its value out as ${plural(n, "field")}: ${namesShort(fieldNames(c))}.`);
  const flagsFirst = g.structure[0] && isFlagsField(g.structure[0]) ? g.structure[0] : null;
  const conditional = g.structure.filter((f) => f.presence && f.presence.field === flagsFirst?.name);
  const varying = g.structure.filter((f) => f.sizeKind !== "fixed");
  if (flagsFirst && conditional.length) {
    const allFlagged = varying.every((f) => f.sizeKind === "optional" && f.presence);
    parts.push(
      `The first, ${flagsFirst.name}, is a ${flagsFirst.type}; ${conditional.length} of the others ${conditional.length === 1 ? "is" : "are"} present only when a bit of it is set as the field's text states, so ${
        allFlagged ? "after the first of those, a field's offset depends on which bits are set" : "after the first field whose size can change, offsets depend on the fields before them"
      }.`,
    );
  } else if (g.flagsFields.length) {
    const rows = structRows(c).filter(({ f }) => f.presence);
    parts.push(
      `It carries a flags field (${listOf(g.flagsFields)})${rows.length ? `, and ${plural(rows.length, "field")} inside ${listOf([...new Set(rows.map((r) => r.def.name))])} ${rows.length === 1 ? "is" : "are"} present only when one of its bits is set as the text states` : ""}.`,
    );
  } else if (g.structure.every((f) => f.sizeKind === "fixed")) {
    parts.push(`Every field has a fixed size, ${g.structure.reduce((s, f) => s + (f.sizeN ?? 0), 0)} octets in all.`);
  }
  if (c.services.length) parts.push(`The SIG's ${listOf(c.services.map((s) => s.name ?? s.id))} permitted-characteristics list includes it.`);
  return parts.join(" ");
}

/* ── FAQs ───────────────────────────────────────────────────────────────── */

export type Faq = { q: string; a: string };

const unitPhrase = (u: { id: string; name: string | null }) => (u.name ? `${u.name} (${u.id})` : `${u.id} (not an id in units.yaml)`);
const RESERVED = /^Reserved for Future Use$/i;
const has = (n: number, one = "has", many = "have") => (n === 1 ? one : many);

export function btFaqs(c: BtCharacteristic): Faq[] {
  const g = c.gss!;
  const fields = g.structure;
  const faqs: Faq[] = [];
  const sizeNote = (f: BtField) => `${f.name} (${f.size}; ${f.presenceText ?? "no “Present if” line in its text"})`;

  faqs.push({
    q: `What is the UUID of the ${c.name} characteristic?`,
    a:
      `${c.uuid}. The Bluetooth SIG's characteristic_uuids.yaml lists ${c.name} as ${c.uuid} with the identifier ${c.id}.` +
      (c.services.length
        ? ` The SIG's ${listOf(c.services.map((s) => `${s.name} (${s.uuid})`))} permitted-characteristics list includes it.`
        : " No file in the SIG's repository ties it to a service: the repository lists service and characteristic UUIDs separately.") +
      (c.referencedBy.length
        ? ` ${listOf(c.referencedBy.map((id) => btById(id)?.name ?? id))} ${c.referencedBy.length === 1 ? "refers" : "refer"} to it in ${c.referencedBy.length === 1 ? "its" : "their"} own structure.`
        : ""),
  });

  const absent = fields.filter(canBeAbsent);
  const inside = structRows(c).filter(({ f }) => canBeAbsent(f));
  if (absent.length || inside.length) {
    const fixed = fields.filter((f) => f.sizeKind === "fixed");
    const other = fields.filter((f) => f.sizeKind !== "fixed" && !canBeAbsent(f));
    const parts: string[] = [];
    if (absent.length) parts.push(`${absent.length} of its ${fields.length} fields ${has(absent.length)} a published size that can be zero: ${absent.map(sizeNote).join("; ")}.`);
    else parts.push(fields.length === 1 ? "Its one top-level field has no size that can be zero." : `None of its ${fields.length} top-level fields has a size that can be zero.`);
    if (fixed.length) parts.push(`${listOf(fixed.map((f) => `${f.name} (${f.size})`))} ${has(fixed.length)} a fixed size.`);
    if (other.length) parts.push(`${listOf(other.map((f) => `${f.name} (${f.size})`))} ${has(other.length)} a size that is not a plain number.`);
    for (const d of [...new Set(inside.map((r) => r.def))]) {
      const rows = inside.filter((r) => r.def === d).map((r) => r.f);
      parts.push(`Inside ${d.name}, ${rows.length} ${rows.length === 1 ? "field's" : "fields'"} size can be zero: ${rows.map(sizeNote).join("; ")}.`);
    }
    faqs.push({ q: `Which ${c.name} fields are optional?`, a: parts.join(" ") });
  } else {
    faqs.push({
      q: `Are any ${c.name} fields optional?`,
      a: `No. Every field in the SIG's structure has a size that cannot be zero: ${listOf(fields.map((f) => `${f.name} (${f.type}, ${f.size})`))}.`,
    });
  }

  const withUnits = fields.filter((f) => f.units.length);
  if (withUnits.length) {
    faqs.push({
      q: `What units does ${c.name} use?`,
      a:
        `The SIG's text names a unit for ${withUnits.length} of the ${fields.length} fields: ` +
        withUnits
          .map((f) =>
            f.units.length === 1
              ? `${f.name}: ${unitPhrase(f.units[0])}`
              : `${f.name}: ${listOf(f.units.map(unitPhrase))}, each on its own line of the field's text with the condition it states`,
          )
          .join("; ") +
        ".",
    });
  }

  const flagsDef = g.definitions.find((d) => d.kind === "bits" && FLAGS_NAME.test(d.name));
  if (flagsDef) {
    const rows = flagsDef.rows.filter((r) => !RESERVED.test((r.description ?? "").trim()));
    faqs.push({
      q: `What do the bits of the ${c.name} ${flagsDef.name} field mean?`,
      a:
        `The SIG defines them as: ` +
        rows
          .map((r) => {
            const bits = bitsOf(r.bit ?? "") ?? [];
            const ctl = controlledBy(c, flagsDef, bits);
            return `bit ${r.bit}, ${oneLine(r.description ?? "", c)}${ctl.length ? ` (${ctl.map((f) => `${f.name} when ${f.presence!.value}`).join(", ")})` : ""}`;
          })
          .join("; ") +
        "." +
        (flagsDef.rows.length > rows.length ? " The remaining bits are reserved for future use." : ""),
    });
  }

  if (!flagsDef && fields.every((f) => f.sizeKind === "fixed")) {
    const total = fields.reduce((s, f) => s + (f.sizeN ?? 0), 0);
    faqs.push({
      q: `How many bytes is a ${c.name} value?`,
      a: `${total} octets. Every field has a fixed size in the SIG's structure: ${listOf(fields.map((f) => `${f.name} at offset ${f.offset} (${f.type}, ${f.size})`))}.`,
    });
  }

  // A value or op-code table, where its rows say something (an RR-Interval
  // table of "Value 0 … Value n" with empty text does not make an answer).
  const textColOf = (d: BtDefinition) => (d.columns.includes("definition") ? "definition" : "description");
  const meaningful = (d: BtDefinition) => d.rows.filter((r) => (r[textColOf(d)] ?? "").trim() && !RESERVED.test((r[textColOf(d)] ?? "").trim()));
  const table = g.definitions.find((d) => (d.kind === "table" || d.kind === "values") && meaningful(d).length >= 2);
  if (faqs.length < 5 && table) {
    const keyCol = table.columns.find((k) => /value$|^value|bit/.test(k)) ?? table.columns[0];
    const textCol = textColOf(table);
    const rows = meaningful(table);
    faqs.push({
      q: `Which values does the ${c.name} ${table.name} table define?`,
      a:
        `${rows.map((r) => `${plain(r[keyCol] ?? "", c)}: ${firstLine(r[textCol] ?? "", c)}`).join("; ")}.` +
        (table.rows.length > rows.length ? " The other rows are reserved for future use or carry no text." : ""),
    });
  }

  // Every page answers at least three questions; the last resort is the order itself.
  if (faqs.length < 3) {
    faqs.push({
      q: `In what order does the ${c.name} structure list its fields?`,
      a: `${fields.map((f, i) => `${i + 1}. ${f.name} (${f.type}, ${f.size}${f.offset !== null ? `, offset ${f.offset}` : ""})`).join("; ")}. Sizes are as the SIG publishes them; an offset is given only where every earlier size is a plain number.`,
    });
  }
  return faqs.slice(0, 5);
}

/* ── The hub ────────────────────────────────────────────────────────────── */

export function btTotals() {
  return {
    characteristics: BT_ALL.length,
    withStructure: BT_ALL.filter((c) => c.gss).length,
    pages: BT_PAGES.length,
    withoutStructure: BT_ALL.filter((c) => !c.gss).length,
    services: BT_SERVICES.length,
    fields: BT_ALL.reduce((n, c) => n + (c.gss?.structure.length ?? 0), 0),
    withFlags: BT_ALL.filter((c) => c.gss?.flagsFields.length).length,
    conditionalFields: BT_ALL.reduce((n, c) => n + (c.gss?.structure.filter((f) => f.presence).length ?? 0), 0),
  };
}

/** The device categories the "device" part of the scope was chosen for — ours, as the generator's comments say. */
export const BT_SCOPE_DEVICES =
  "heart rate monitors, cycling power and speed-and-cadence sensors, running sensors, fitness machines (treadmills, cross trainers, step and stair climbers, rowers, indoor bikes), weight scales, body composition analysers, glucose meters and CGMs, blood pressure monitors, pulse oximeters and thermometers";

/** Optional-size fields in scope, and how many of them carry a parsed "Present if bit…" line. */
export function btOptionalStats() {
  const fields = BT_ALL.flatMap((c) => c.gss?.structure ?? []);
  const optional = fields.filter((f) => f.sizeKind === "optional");
  return {
    fields: fields.length,
    optional: optional.length,
    optionalWithCondition: optional.filter((f) => f.presence).length,
    conditionOnZero: fields.filter((f) => f.presence?.value === 0).length,
  };
}

export function btHubFaqs(): Faq[] {
  const T = btTotals();
  const by = (r: BtCharacteristic["scopeReason"]) => BT_ALL.filter((c) => c.scopeReason === r);
  const referenced = by("referenced");
  const none = BT_ALL.filter((c) => !c.gss);
  const O = btOptionalStats();
  const lists = BT_GATT_PERMITTED_LISTS;
  const uds = BT_SERVICES.find((s) => s.id === "org.bluetooth.service.user_data");
  return [
    {
      q: "Which Bluetooth GATT characteristics does this fitness device reference cover?",
      a: `${T.characteristics}: ${by("device").length} chosen for ${BT_SCOPE_DEVICES}; the ${by("user-data").length} on the Bluetooth SIG's User Data list; and the ${plural(referenced.length, "characteristic")} those structures refer to (${listOf(referenced.map((c) => c.name))}). ${T.withStructure} have a structure in the SIG's GATT Specification Supplement files, and the ${T.pages} with at least two fields or a flags field have a page of their own.`,
    },
    {
      q: "Does the Bluetooth SIG publish which characteristics belong to each GATT service?",
      a: `Not in its public repository, apart from ${plural(lists.length, "permitted-characteristics list")}: ${listOf(lists.map((l) => `${l.name} (${l.uuid}, ${plural(l.characteristics, "characteristic")})`))}. Every other file assigns UUIDs to services and to characteristics in separate lists, so this reference ties a characteristic to a service only where one of those lists does${uds ? `, which here means the ${uds.permittedCharacteristics?.length ?? 0} User Data characteristics` : ""}.`,
    },
    {
      q: "Why do some characteristics in this Bluetooth reference have no byte layout?",
      a: `Because the SIG's repository at commit ${BT_COMMIT_SHORT} (branch ${BT_GATT_SOURCE.branch}, committed ${BT_GATT_SOURCE.commitDate}) has no GATT Specification Supplement file for them: ${listOf(none.map((c) => `${c.name} (${c.uuid})`))}. Their UUIDs and names come from characteristic_uuids.yaml; no structure is printed for a characteristic whose structure was not read.`,
    },
    {
      q: "What does a size of “0 or 2” mean in the Bluetooth SIG's GATT structures?",
      a: `That the field is either absent or 2 octets long. Of the ${O.fields} structure fields in scope, ${O.optional} have a size of that “0 or N” form, and ${O.optionalWithCondition} of those carry a line such as “Present if bit 3 of Flags field is set to 1” saying when the field is there; ${O.conditionOnZero} conditions are met when the bit is 0, not 1. Because a field may be absent, this reference prints an offset only where every earlier field has a fixed size.`,
    },
    {
      q: "Where does this Bluetooth GATT data come from, and under what terms?",
      a: `From the Bluetooth SIG's public repository on Bitbucket (bitbucket.org/bluetooth-SIG/public), branch ${BT_GATT_SOURCE.branch} at commit ${BT_COMMIT_SHORT}, committed ${BT_GATT_SOURCE.commitDate} and read ${BT_FETCHED}. The repository has no README or licence file; every file carries the same notice, which says “This document is proprietary to Bluetooth SIG.” and “The furnishing of this document does not grant any license to any intellectual property of Bluetooth SIG or its members.” The SIG's text is quoted here with that attribution; this site is not affiliated with Bluetooth SIG.`,
    },
  ];
}

export const BT_HUB_TITLE = "Bluetooth GATT Characteristics for Fitness Devices";
export const BT_HUB_H1 = "Bluetooth GATT characteristics for fitness and health devices";
export const btHubDescription = () =>
  fit(
    [
      `Byte layouts of ${btTotals().withStructure} Bluetooth GATT characteristics for heart rate, cycling, FTMS machines, scales, glucose, blood pressure and thermometers, from the SIG's YAML.`,
      `Byte layouts of ${btTotals().withStructure} Bluetooth GATT characteristics for fitness and health devices, read from the Bluetooth SIG's own YAML files.`,
    ],
    DESC_MAX,
    "hub description",
  );

/**
 * Google's definitions, quoted from "Bluetooth Low Energy" on
 * developer.android.com (footer: last updated 2026-02-26), read 2026-10-17.
 * Quoted rather than paraphrased: the SIG's YAML files define structures, not
 * the vocabulary, and this page says nothing about GATT it has not read.
 */
export const ANDROID_BLE_OVERVIEW = {
  url: "https://developer.android.com/develop/connectivity/bluetooth/ble/ble-overview",
  title: "Bluetooth Low Energy",
  read: "2026-10-17",
  updated: "2026-02-26",
  terms: [
    {
      term: "Generic Attribute Profile (GATT)",
      text: 'The GATT profile is a general specification for sending and receiving short pieces of data known as "attributes" over a BLE link. All current BLE application profiles are based on GATT.',
    },
    {
      term: "Service",
      text: 'A service is a collection of characteristics. For example, you could have a service called "Heart Rate Monitor" that includes characteristics such as "heart rate measurement."',
    },
    {
      term: "Characteristic",
      text: "A characteristic contains a single value and 0-n descriptors that describe the characteristic's value. A characteristic can be thought of as a type, analogous to a class.",
    },
    {
      term: "Descriptor",
      text: "Descriptors are defined attributes that describe a characteristic value. For example, a descriptor might specify a human-readable description, an acceptable range for a characteristic's value, or a unit of measure that is specific to a characteristic's value.",
    },
  ],
} as const;

/* ── Structured data ────────────────────────────────────────────────────── */

export function btGraph({
  path,
  title,
  headline,
  description,
  pageType = "WebPage",
  parts,
  about,
  citations,
}: {
  path: string;
  title: string;
  headline: string;
  description: string;
  pageType?: "WebPage" | "CollectionPage";
  parts?: { name: string; path: string }[];
  about?: { name: string; url: string };
  citations: { name: string; url: string }[];
}) {
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline,
        description,
        datePublished: publishedDate(path.replace(/^\//, ""), BT_FETCHED),
        dateModified: BT_FETCHED,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: BT_SECTION,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        ...(about ? { about: { "@type": "Thing", name: about.name, sameAs: about.url } } : {}),
        citation: citations.map((c) => ({ "@type": "TechArticle", name: c.name, url: c.url })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": pageType,
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: BT_FETCHED,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image` },
        ...(parts?.length
          ? {
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: parts.length,
                itemListOrder: "https://schema.org/ItemListOrderAscending",
                itemListElement: parts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(p.path) })),
              },
            }
          : {}),
      },
    ],
  };
}

export function btFaqGraph(path: string, faqs: Faq[]) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };
}
