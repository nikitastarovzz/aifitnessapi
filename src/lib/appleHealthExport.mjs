/**
 * The /tools/apple-health-explorer reader: a streaming scanner for the
 * export.xml file the iPhone Health app writes when you tap Export All Health
 * Data, plus the ZIP directory reader that finds that file inside export.zip.
 *
 * Why streaming. An export holds every sample a phone and its watch have
 * written, so the XML runs to hundreds of megabytes. Nothing here ever holds
 * the whole file: bytes arrive in chunks (File.stream() in the browser, a
 * file stream in the tests), each chunk is scanned for complete start tags,
 * and only a small tail that might be the first half of a tag is kept for the
 * next chunk. What survives is the summary: per-type counts, date ranges,
 * units, sources and one row per day per type.
 *
 * What it reads, and what that rests on. Apple's iPhone User Guide says
 * Health exports "all of your health and fitness data from Health in XML
 * format"; it does not publish the file's element and attribute names, and
 * this site could not find a page from Apple that does. The scanner
 * therefore reads only what the file itself declares: start tags named
 * Record, Workout and ActivitySummary and ExportDate, and their attributes by
 * name (type, unit, value, sourceName, sourceVersion, device, creationDate,
 * startDate, endDate; workoutActivityType, duration, durationUnit;
 * dateComponents). Any other element is skipped, including Me, which holds
 * date of birth and sex and is never read.
 *
 * Pure: no DOM, no network, no clock. The page's Web Worker and
 * scripts/apple-health-export.test.mjs run exactly this code.
 */

const ENTITY = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };

/** Decode the five XML entities and numeric character references. */
export function decodeXml(s) {
  if (s.indexOf("&") === -1) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-z]+);/g, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITY[e] ?? m;
  });
}

/** Elements the scanner reports. Everything else is skipped unread. */
export const WANTED = new Set(["Record", "Workout", "ActivitySummary", "ExportDate"]);

const NAME_RE = /[A-Za-z_][\w.:-]*/y;
const ATTR_RE = /\s*([A-Za-z_][\w.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/y;
const END_RE = /\s*(\/?)>/y;

/**
 * A push scanner over XML text. `onElement(name, attrs)` is called once per
 * start (or self-closing) tag whose name is in `wanted`. Text, end tags,
 * comments, processing instructions and the DOCTYPE's internal subset are
 * skipped. Feed text with push(); call end() after the last chunk.
 */
export function createScanner(onElement, wanted = WANTED) {
  let buf = "";
  let inComment = false;
  let elements = 0;

  function drain() {
    let pos = 0;
    const n = buf.length;
    for (;;) {
      if (inComment) {
        const close = buf.indexOf("-->", pos);
        if (close === -1) {
          // Keep two characters in case "-->" is split across chunks.
          pos = Math.max(pos, n - 2);
          break;
        }
        inComment = false;
        pos = close + 3;
      }
      const lt = buf.indexOf("<", pos);
      if (lt === -1) {
        pos = n;
        break;
      }
      if (lt + 1 >= n) {
        pos = lt;
        break;
      }
      const c = buf.charCodeAt(lt + 1);
      // "<!" and "<?": comments, DOCTYPE and its <!ELEMENT>/<!ATTLIST>
      // declarations, the XML declaration. "</": end tags.
      if (c === 33 /* ! */) {
        if (buf.startsWith("<!--", lt)) {
          inComment = true;
          pos = lt + 4;
          continue;
        }
        if (lt + 4 > n) {
          pos = lt;
          break;
        }
        pos = lt + 2;
        continue;
      }
      if (c === 63 /* ? */ || c === 47 /* / */) {
        pos = lt + 2;
        continue;
      }
      NAME_RE.lastIndex = lt + 1;
      const nm = NAME_RE.exec(buf);
      if (!nm) {
        pos = lt + 1;
        continue;
      }
      const name = nm[0];
      let p = NAME_RE.lastIndex;
      if (p >= n) {
        pos = lt;
        break;
      }
      if (!wanted.has(name)) {
        // Skip an unwanted tag cheaply; its attributes may still hold ">"
        // inside quotes, so step over quoted values to find the real end.
        const end = tagEnd(buf, p);
        if (end === -1) {
          pos = lt;
          break;
        }
        pos = end + 1;
        continue;
      }
      const attrs = {};
      let complete = false;
      for (;;) {
        END_RE.lastIndex = p;
        const e = END_RE.exec(buf);
        if (e) {
          p = END_RE.lastIndex;
          complete = true;
          break;
        }
        ATTR_RE.lastIndex = p;
        const a = ATTR_RE.exec(buf);
        if (!a) break;
        attrs[a[1]] = decodeXml(a[2] ?? a[3] ?? "");
        p = ATTR_RE.lastIndex;
      }
      if (!complete) {
        // Either the tag runs past this chunk, or it is malformed. Only the
        // first is recoverable; a malformed tag far from the end is skipped.
        if (n - lt < 1 << 16 && tagEnd(buf, lt + 1) === -1) {
          pos = lt;
          break;
        }
        pos = lt + 1;
        continue;
      }
      elements++;
      onElement(name, attrs);
      pos = p;
    }
    buf = buf.slice(pos);
  }

  return {
    push(text) {
      buf = buf.length ? buf + text : text;
      drain();
    },
    end() {
      drain();
      const leftover = buf.trim().length;
      buf = "";
      return { elements, leftover };
    },
  };
}

/** Index of the ">" that ends the tag whose name ended at `from`, or -1. */
function tagEnd(s, from) {
  let q = 0;
  for (let i = from; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (q) {
      if (c === q) q = 0;
    } else if (c === 34 || c === 39) q = c;
    else if (c === 62) return i;
  }
  return -1;
}

// ---------------------------------------------------------------------------
// Dates

/**
 * "2026-03-01 07:12:00 -0800" → epoch milliseconds, or NaN. The export writes
 * each date with the UTC offset of the device at the time, so the instant is
 * exact and the first ten characters are the calendar day where it happened.
 */
export function parseExportDate(s) {
  if (!s) return NaN;
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})\s*([+-]\d{2}):?(\d{2})?$/.exec(s.trim());
  if (m) return Date.parse(`${m[1]}T${m[2]}${m[3]}:${m[4] ?? "00"}`);
  return Date.parse(s);
}

/** The calendar day the record's own timestamp names (no timezone conversion). */
export function dayOf(s) {
  return s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null;
}

/** "<<HKDevice: 0x…>, name:Apple Watch, manufacturer:Apple Inc., model:Watch, hardware:Watch6,1, software:9.0>" → fields. */
export function parseDevice(s) {
  if (!s) return null;
  const out = {};
  for (const key of ["name", "manufacturer", "model", "hardware", "software"]) {
    const m = new RegExp(`(?:^|[,\\s])${key}:([^,>]*(?:,\\d+)?)`).exec(s);
    if (m) out[key] = m[1].trim();
  }
  return Object.keys(out).length ? out : null;
}

// ---------------------------------------------------------------------------
// Aggregation

const DURATION_TO_MIN = { min: 1, s: 1 / 60, sec: 1 / 60, h: 60, hr: 60 };

function bump(map, key, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

/**
 * Summary of a whole export. add() takes what createScanner reports;
 * result() returns plain, structured-cloneable data:
 *
 *   exportDate, records, workouts, activitySummaries,
 *   types: [{ type, kind, count, first, last, units: [{unit, count}],
 *             sources: [{name, count}], numeric, days: {unit: [[day, sum, n, min, max, minutes]]} }]
 *   sources: [{ name, records, types }], devices: [{ name, model, hardware, manufacturer, records }]
 *
 * `kind` is "record" for Record elements, "workout" for Workout elements
 * (type = workoutActivityType), "summary" for ActivitySummary.
 */
export function createAggregator() {
  const types = new Map();
  const sources = new Map();
  const devices = new Map();
  let exportDate = null;
  let records = 0;
  let workouts = 0;
  let summaries = 0;
  let summaryFirst = null;
  let summaryLast = null;

  function typeEntry(type, kind) {
    let t = types.get(type);
    if (!t) {
      t = { type, kind, count: 0, firstMs: Infinity, lastMs: -Infinity, first: null, last: null, units: new Map(), sources: new Map(), numeric: 0, days: new Map() };
      types.set(type, t);
    }
    return t;
  }

  function addDay(t, unit, day, value, minutes) {
    if (!day) return;
    let byDay = t.days.get(unit);
    if (!byDay) t.days.set(unit, (byDay = new Map()));
    let d = byDay.get(day);
    if (!d) byDay.set(day, (d = [0, 0, Infinity, -Infinity, 0]));
    if (Number.isFinite(value)) {
      d[0] += value;
      d[1] += 1;
      if (value < d[2]) d[2] = value;
      if (value > d[3]) d[3] = value;
    } else {
      d[1] += 1;
    }
    if (Number.isFinite(minutes) && minutes > 0) d[4] += minutes;
  }

  function common(t, a) {
    t.count++;
    const startMs = parseExportDate(a.startDate);
    const endMs = parseExportDate(a.endDate) || startMs;
    if (startMs < t.firstMs) {
      t.firstMs = startMs;
      t.first = a.startDate;
    }
    const lastMs = Number.isFinite(endMs) ? endMs : startMs;
    if (lastMs > t.lastMs) {
      t.lastMs = lastMs;
      t.last = a.endDate || a.startDate;
    }
    const src = a.sourceName || "(no sourceName)";
    bump(t.sources, src);
    let s = sources.get(src);
    if (!s) sources.set(src, (s = { name: src, records: 0, types: new Set() }));
    s.records++;
    s.types.add(t.type);
    const dev = parseDevice(a.device);
    if (dev) {
      const key = `${dev.name ?? ""}|${dev.model ?? ""}|${dev.hardware ?? ""}|${dev.manufacturer ?? ""}`;
      let d = devices.get(key);
      if (!d) devices.set(key, (d = { name: dev.name ?? null, model: dev.model ?? null, hardware: dev.hardware ?? null, manufacturer: dev.manufacturer ?? null, records: 0 }));
      d.records++;
    }
    return { startMs, endMs };
  }

  return {
    add(name, a) {
      if (name === "Record") {
        if (!a.type) return;
        records++;
        const t = typeEntry(a.type, "record");
        const { startMs, endMs } = common(t, a);
        const unit = a.unit || "";
        bump(t.units, unit);
        const v = a.value !== undefined && a.value !== "" ? Number(a.value) : NaN;
        if (Number.isFinite(v)) t.numeric++;
        const minutes = Number.isFinite(startMs) && Number.isFinite(endMs) ? (endMs - startMs) / 60000 : NaN;
        addDay(t, unit, dayOf(a.startDate), v, minutes);
      } else if (name === "Workout") {
        const type = a.workoutActivityType || "HKWorkoutActivityTypeOther";
        workouts++;
        const t = typeEntry(type, "workout");
        const { startMs, endMs } = common(t, a);
        const factor = DURATION_TO_MIN[a.durationUnit ?? ""];
        const dur = Number(a.duration);
        const minutes = factor && Number.isFinite(dur) ? dur * factor : Number.isFinite(startMs) && Number.isFinite(endMs) ? (endMs - startMs) / 60000 : NaN;
        bump(t.units, "min");
        if (Number.isFinite(minutes)) t.numeric++;
        addDay(t, "min", dayOf(a.startDate), minutes, minutes);
      } else if (name === "ActivitySummary") {
        summaries++;
        const d = a.dateComponents;
        if (d) {
          if (!summaryFirst || d < summaryFirst) summaryFirst = d;
          if (!summaryLast || d > summaryLast) summaryLast = d;
        }
      } else if (name === "ExportDate") {
        exportDate = a.value ?? null;
      }
    },
    result() {
      const out = [];
      for (const t of types.values()) {
        const days = {};
        for (const [unit, byDay] of t.days) {
          days[unit] = [...byDay.entries()]
            .sort((x, y) => (x[0] < y[0] ? -1 : 1))
            .map(([day, d]) => [day, round(d[0]), d[1], d[2] === Infinity ? null : d[2], d[3] === -Infinity ? null : d[3], round(d[4])]);
        }
        out.push({
          type: t.type,
          kind: t.kind,
          count: t.count,
          first: t.first,
          last: t.last,
          units: sortedCounts(t.units, "unit"),
          sources: sortedCounts(t.sources, "name"),
          numeric: t.numeric,
          days,
        });
      }
      out.sort((a, b) => b.count - a.count || (a.type < b.type ? -1 : 1));
      return {
        exportDate,
        records,
        workouts,
        activitySummaries: summaries,
        activitySummaryRange: summaryFirst ? [summaryFirst, summaryLast] : null,
        types: out,
        sources: [...sources.values()]
          .map((s) => ({ name: s.name, records: s.records, types: s.types.size }))
          .sort((a, b) => b.records - a.records),
        devices: [...devices.values()].sort((a, b) => b.records - a.records),
      };
    },
  };
}

function round(x) {
  return Math.round(x * 1000) / 1000;
}

function sortedCounts(map, key) {
  return [...map.entries()].map(([k, count]) => ({ [key]: k, count })).sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// CSV

export const RECORD_CSV_COLUMNS = ["startDate", "endDate", "value", "unit", "sourceName", "sourceVersion", "device", "creationDate"];
export const WORKOUT_CSV_COLUMNS = ["startDate", "endDate", "duration", "durationUnit", "sourceName", "sourceVersion", "device", "creationDate"];

/** RFC 4180 field: quoted when it holds a comma, quote or line break. */
export function csvField(v) {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Collects one type's rows as CSV text, for a second pass over the file.
 * `type` is a Record type or a workoutActivityType. Rows come out in file
 * order. Returns chunks so a large type never becomes one giant string.
 */
export function createCsvCollector(type, kind = "record") {
  const cols = kind === "workout" ? WORKOUT_CSV_COLUMNS : RECORD_CSV_COLUMNS;
  const chunks = [cols.join(",") + "\n"];
  let lines = [];
  let rows = 0;
  return {
    add(name, a) {
      if (kind === "workout" ? name !== "Workout" || a.workoutActivityType !== type : name !== "Record" || a.type !== type) return;
      lines.push(cols.map((c) => csvField(a[c])).join(","));
      rows++;
      if (lines.length >= 5000) {
        chunks.push(lines.join("\n") + "\n");
        lines = [];
      }
    },
    result() {
      if (lines.length) chunks.push(lines.join("\n") + "\n");
      lines = [];
      return { rows, chunks };
    },
  };
}

// ---------------------------------------------------------------------------
// ZIP

const u16 = (b, o) => b[o] | (b[o + 1] << 8);
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const u64 = (b, o) => u32(b, o) + u32(b, o + 4) * 2 ** 32;

/**
 * List a ZIP archive's entries from its central directory, ZIP64 included.
 * `readAt(offset, length)` resolves to a Uint8Array; `size` is the archive
 * length. Returns [{ name, method, compressedSize, size, dataOffset }], where
 * dataOffset is where the entry's (possibly deflated) bytes begin.
 */
export async function listZipEntries(readAt, size) {
  const tailLen = Math.min(size, 65557);
  const tail = await readAt(size - tailLen, tailLen);
  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (u32(tail, i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("Not a ZIP file (no end-of-central-directory record).");
  let count = u16(tail, eocd + 10);
  let cdSize = u32(tail, eocd + 12);
  let cdOffset = u32(tail, eocd + 16);
  if (count === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
    const loc = eocd - 20;
    if (loc < 0 || u32(tail, loc) !== 0x07064b50) throw new Error("ZIP64 archive without a ZIP64 locator.");
    const z64Offset = u64(tail, loc + 8);
    const z = await readAt(z64Offset, 56);
    if (u32(z, 0) !== 0x06064b50) throw new Error("Bad ZIP64 end-of-central-directory record.");
    count = u64(z, 32);
    cdSize = u64(z, 40);
    cdOffset = u64(z, 48);
  }
  const cd = await readAt(cdOffset, cdSize);
  const entries = [];
  let p = 0;
  const dec = new TextDecoder();
  for (let i = 0; i < count && p + 46 <= cd.length; i++) {
    if (u32(cd, p) !== 0x02014b50) throw new Error("Bad ZIP central directory entry.");
    const method = u16(cd, p + 10);
    let compressedSize = u32(cd, p + 20);
    let uncompressed = u32(cd, p + 24);
    const nameLen = u16(cd, p + 28);
    const extraLen = u16(cd, p + 30);
    const commentLen = u16(cd, p + 32);
    let localOffset = u32(cd, p + 42);
    const name = dec.decode(cd.subarray(p + 46, p + 46 + nameLen));
    let e = p + 46 + nameLen;
    const extraEnd = e + extraLen;
    while (e + 4 <= extraEnd) {
      const id = u16(cd, e);
      const len = u16(cd, e + 2);
      if (id === 0x0001) {
        let q = e + 4;
        if (uncompressed === 0xffffffff) (uncompressed = u64(cd, q)), (q += 8);
        if (compressedSize === 0xffffffff) (compressedSize = u64(cd, q)), (q += 8);
        if (localOffset === 0xffffffff) localOffset = u64(cd, q);
      }
      e += 4 + len;
    }
    entries.push({ name, method, compressedSize, size: uncompressed, localOffset });
    p = extraEnd + commentLen;
  }
  for (const en of entries) {
    const lh = await readAt(en.localOffset, 30);
    if (u32(lh, 0) !== 0x04034b50) throw new Error(`Bad local header for ${en.name}.`);
    en.dataOffset = en.localOffset + 30 + u16(lh, 26) + u16(lh, 28);
  }
  return entries;
}

/** The entry to read: a file named export.xml (Apple's main file), never export_cda.xml. */
export function pickExportXml(entries) {
  const xml = entries.filter((e) => /(^|\/)export\.xml$/i.test(e.name));
  xml.sort((a, b) => a.name.split("/").length - b.name.split("/").length);
  return xml[0] ?? null;
}
