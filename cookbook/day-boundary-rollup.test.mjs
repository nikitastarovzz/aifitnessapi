/**
 * day-boundary-rollup.test.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The test contract for day-boundary-rollup.mjs: a spring-forward civil day
 *   holds 23 hours of samples and still rolls up as one date, a fall-back day
 *   holds 25, a traveller's samples land on the date they actually lived
 *   through, and the fixed-UTC-window anti-pattern drops and double-counts
 *   exactly the samples the civil-date rollup does not.
 *
 * WHICH aifitnessapi.com PAGE DOCUMENTS THE PATTERN
 *   https://aifitnessapi.com/architecture/timezones-and-day-boundaries
 *   https://aifitnessapi.com/cookbook/day-boundary-rollup
 *
 * No network, no wall clock: the offset series and the sample store are both
 * injected. Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  DAY_RULE,
  civilDateFrom,
  civilDayBoundsUtc,
  civilDayLengthHours,
  compareRollups,
  createMemorySampleStore,
  createOffsetSeries,
  createSampleWriter,
  misfiledByUtcWindow,
  nextCivilDate,
  rollupByCivilDate,
  rollupByFixedUtcWindowAntiPattern,
  startOfCivilDayUtc,
  utcDateOf,
} from "./day-boundary-rollup.mjs";

const HOUR = 3_600_000;

/**
 * America/New_York across 2026, as a piecewise offset series.
 * Spring forward 2026-03-08 at 02:00 EST = 07:00Z; fall back 2026-11-01 at
 * 02:00 EDT = 06:00Z. (Both boundaries match the worked table on
 * /architecture/timezones-and-day-boundaries.)
 */
function newYork2026() {
  return createOffsetSeries([
    { from: null, offsetMinutes: -300 },
    { from: Date.UTC(2026, 2, 8, 7, 0), offsetMinutes: -240 },
    { from: Date.UTC(2026, 10, 1, 6, 0), offsetMinutes: -300 },
  ]);
}

function freshWriter() {
  const store = createMemorySampleStore();
  return { store, writer: createSampleWriter({ store }) };
}

/** One sample per real hour of a civil day, each stamped with its own offset. */
function writeHourlyDay({ writer, civilDate, series, value = 100 }) {
  const { startUtc, endUtc } = civilDayBoundsUtc(civilDate, series);
  let i = 0;
  const written = [];
  for (let t = startUtc; t < endUtc; t += HOUR) {
    written.push(
      writer.write({
        provider: "fake",
        externalId: `${civilDate}#${String(i++).padStart(2, "0")}`,
        metric: "steps",
        value,
        utcInstant: t,
        utcOffsetMinutes: series.offsetAt(t),
      }),
    );
  }
  return written;
}

// ---------------------------------------------------------------------------

test("civilDateFrom refuses to invent an offset", () => {
  assert.equal(civilDateFrom(Date.UTC(2026, 5, 11, 5, 30), -420), "2026-06-10");
  assert.throws(() => civilDateFrom(Date.UTC(2026, 5, 11), undefined), TypeError);
  assert.throws(() => civilDateFrom(Date.UTC(2026, 5, 11), null), TypeError);
});

test("spring-forward day is 23 hours long and still rolls up as one civil date", () => {
  const ny = newYork2026();
  const bounds = civilDayBoundsUtc("2026-03-08", ny);

  assert.equal(new Date(bounds.startUtc).toISOString(), "2026-03-08T05:00:00.000Z");
  assert.equal(new Date(bounds.endUtc).toISOString(), "2026-03-09T04:00:00.000Z");
  assert.equal(bounds.hours, 23);
  assert.equal(civilDayLengthHours("2026-03-08", ny), 23);

  const { store, writer } = freshWriter();
  const samples = writeHourlyDay({ writer, civilDate: "2026-03-08", series: ny });
  assert.equal(samples.length, 23, "23 real hours of samples");

  // The offset genuinely changes mid-day, and local 02:00 never happens.
  assert.deepEqual(
    [...new Set(samples.map((s) => s.utcOffsetMinutes))].sort((a, b) => a - b),
    [-300, -240],
  );
  const localHours = samples.map((s) =>
    new Date(s.utcInstant + s.utcOffsetMinutes * 60_000).getUTCHours(),
  );
  assert.ok(!localHours.includes(2), "local 02:00 is skipped on the spring-forward day");

  const rollup = rollupByCivilDate(store.all());
  assert.equal(rollup.length, 1, "23 hours, one civil date");
  assert.deepEqual(rollup[0], {
    civilDate: "2026-03-08",
    total: 2300,
    count: 23,
    sampleIds: samples.map((s) => s.externalId),
  });
});

test("fall-back day is 25 hours long and still rolls up as one civil date", () => {
  const ny = newYork2026();
  const bounds = civilDayBoundsUtc("2026-11-01", ny);

  assert.equal(new Date(bounds.startUtc).toISOString(), "2026-11-01T04:00:00.000Z");
  assert.equal(new Date(bounds.endUtc).toISOString(), "2026-11-02T05:00:00.000Z");
  assert.equal(bounds.hours, 25);

  const { store, writer } = freshWriter();
  const samples = writeHourlyDay({ writer, civilDate: "2026-11-01", series: ny });
  assert.equal(samples.length, 25, "25 real hours of samples");

  // Local 01:00 happens twice, at two different instants. That is the whole
  // reason storing local time alone is unrecoverable.
  const oneAm = samples.filter(
    (s) => new Date(s.utcInstant + s.utcOffsetMinutes * 60_000).getUTCHours() === 1,
  );
  assert.equal(oneAm.length, 2);
  assert.notEqual(oneAm[0].utcInstant, oneAm[1].utcInstant);
  assert.equal(oneAm[0].utcOffsetMinutes, -240);
  assert.equal(oneAm[1].utcOffsetMinutes, -300);

  const rollup = rollupByCivilDate(store.all());
  assert.equal(rollup.length, 1);
  assert.equal(rollup[0].civilDate, "2026-11-01");
  assert.equal(rollup[0].count, 25);
  assert.equal(rollup[0].total, 2500);

  // A streak is successor arithmetic over civil dates, never a duration test.
  assert.equal(nextCivilDate("2026-11-01"), "2026-11-02");
  assert.ok(bounds.endUtc - bounds.startUtc > 24 * HOUR, "a 24h duration test would break the streak");
});

test("a traveller's samples land on the civil date they experienced", () => {
  const { store, writer } = freshWriter();
  const LA = -420; // PDT
  const LON = 60; // BST

  // LAX -> LHR, the worked example from the architecture page.
  const flight = [
    { id: "t0", iso: "2026-06-11T01:00:00Z", offset: LA }, //  2026-06-10 18:00 PDT
    { id: "t1", iso: "2026-06-11T05:30:00Z", offset: LA }, //  2026-06-10 22:30 PDT
    { id: "t2", iso: "2026-06-11T09:00:00Z", offset: LA }, //  2026-06-11 02:00 PDT, in the air
    { id: "t3", iso: "2026-06-11T14:00:00Z", offset: LON }, // 2026-06-11 15:00 BST, landed
    { id: "t4", iso: "2026-06-11T21:00:00Z", offset: LON }, // 2026-06-11 22:00 BST
    { id: "t5", iso: "2026-06-12T07:00:00Z", offset: LON }, // 2026-06-12 08:00 BST
  ];
  for (const s of flight) {
    writer.write({
      provider: "fake",
      externalId: s.id,
      metric: "steps",
      value: 100,
      utcInstant: s.iso,
      utcOffsetMinutes: s.offset,
    });
  }

  const rollup = rollupByCivilDate(store.all());
  assert.deepEqual(
    rollup.map((b) => [b.civilDate, b.count]),
    [
      ["2026-06-10", 2],
      ["2026-06-11", 3],
      ["2026-06-12", 1],
    ],
  );

  // Under a UTC window the traveller's 10 June does not exist at all.
  const anti = rollupByFixedUtcWindowAntiPattern(store.all());
  assert.deepEqual(
    anti.map((b) => [b.civilDate, b.count]),
    [
      ["2026-06-11", 5],
      ["2026-06-12", 1],
    ],
  );
  assert.deepEqual(
    misfiledByUtcWindow(store.all()).map((m) => m.externalId),
    ["t0", "t1"],
  );

  // Their 11 June, built from their own offset history, is 16 hours long.
  const travelled = createOffsetSeries([
    { from: null, offsetMinutes: LA },
    { from: Date.parse("2026-06-11T13:00:00Z"), offsetMinutes: LON },
  ]);
  assert.equal(civilDayLengthHours("2026-06-11", travelled), 16);
  assert.equal(civilDayLengthHours("2026-06-10", travelled), 24);
  assert.equal(
    new Date(startOfCivilDayUtc("2026-06-11", travelled)).toISOString(),
    "2026-06-11T07:00:00.000Z",
  );
});

test("ANTI-PATTERN: a fixed UTC window double-counts an hour in spring and drops one in autumn", () => {
  const ny = newYork2026();

  // --- spring forward -----------------------------------------------------
  {
    const { store, writer } = freshWriter();
    for (const d of ["2026-03-07", "2026-03-08", "2026-03-09"]) {
      writeHourlyDay({ writer, civilDate: d, series: ny });
    }
    const records = store.all();
    const correct = rollupByCivilDate(records);
    const anti = rollupByFixedUtcWindowAntiPattern(records);
    const cmp = compareRollups(correct, anti);
    const row = cmp.find((r) => r.civilDate === "2026-03-08");

    assert.equal(row.correctCount, 23, "the civil day really is 23 hours");
    assert.equal(row.antiCount, 24, "the UTC window is always 24");
    assert.equal(row.delta, +100, "one extra hour of steps, invented");

    // And it is not a rounding artefact — these are the exact samples.
    const misfiled = misfiledByUtcWindow(records);
    const droppedFromMar8 = misfiled.filter(
      (m) => m.civilDate === "2026-03-08" && m.utcBucket === "2026-03-09",
    );
    const addedToMar8 = misfiled.filter(
      (m) => m.civilDate === "2026-03-07" && m.utcBucket === "2026-03-08",
    );
    assert.equal(droppedFromMar8.length, 4, "the user's last four EDT hours are filed under the 9th");
    assert.equal(addedToMar8.length, 5, "five hours of the 7th are filed under the 8th");
    assert.equal((addedToMar8.length - droppedFromMar8.length) * 100, row.delta);
  }

  // --- fall back ----------------------------------------------------------
  {
    const { store, writer } = freshWriter();
    for (const d of ["2026-10-31", "2026-11-01", "2026-11-02"]) {
      writeHourlyDay({ writer, civilDate: d, series: ny });
    }
    const records = store.all();
    const cmp = compareRollups(
      rollupByCivilDate(records),
      rollupByFixedUtcWindowAntiPattern(records),
    );
    const row = cmp.find((r) => r.civilDate === "2026-11-01");

    assert.equal(row.correctCount, 25);
    assert.equal(row.antiCount, 24);
    assert.equal(row.delta, -100, "one real hour of steps, silently dropped");

    const misfiled = misfiledByUtcWindow(records);
    const dropped = misfiled.filter(
      (m) => m.civilDate === "2026-11-01" && m.utcBucket === "2026-11-02",
    );
    const added = misfiled.filter(
      (m) => m.civilDate === "2026-10-31" && m.utcBucket === "2026-11-01",
    );
    assert.equal(dropped.length, 5);
    assert.equal(added.length, 4);
    assert.equal((added.length - dropped.length) * 100, row.delta);
  }
});

test("the rollup will not re-derive a civil date at read time", () => {
  const records = [
    { externalId: "x1", utcInstant: Date.UTC(2026, 5, 11, 5, 30), value: 10 }, // no civilDate
  ];
  assert.throws(() => rollupByCivilDate(records), /no stored civilDate/);
  // The anti-pattern is happy to, which is exactly how it gets shipped.
  assert.equal(rollupByFixedUtcWindowAntiPattern(records)[0].civilDate, "2026-06-11");
});

test("writes are idempotent on provider record identity and carry the day rule", () => {
  const { store, writer } = freshWriter();
  const sample = {
    provider: "fake",
    externalId: "dup-1",
    metric: "steps",
    value: 250,
    utcInstant: "2026-03-08T16:00:00Z",
    utcOffsetMinutes: -240,
  };
  const first = writer.write(sample);
  writer.write(sample); // replayed window
  writer.write(sample);

  assert.equal(store.size, 1, "a replay is a no-op, not a doubling");
  assert.equal(first.civilDate, "2026-03-08");
  assert.equal(first.dayRule, DAY_RULE.SAMPLE_OFFSET);
  assert.equal(utcDateOf(first.utcInstant), "2026-03-08");
  assert.equal(rollupByCivilDate(store.all())[0].total, 250);
});
