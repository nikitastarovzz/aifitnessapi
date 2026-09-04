/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/extract-healthkit-writability.mjs
 *
 * Identifiers whose Apple documentation EXPLICITLY states the samples are
 * read-only (apps cannot save them). Derived from the same cached corpus as
 * healthkitIdentifiers.ts, so the read date matches. An identifier absent
 * from this list is UNKNOWN, not writable: Apple states writability only in
 * prose, and silence is not a statement.
 */
export type HkWritability = {
  case: string;
  readOnly: true;
  /** Apple's sentence, verbatim — the evidence for the flag. */
  evidence: string;
};

/** Read from the corpus cached on the date in HK_FETCHED_ON. */
export const HK_READONLY: HkWritability[] = [
  {
    "case": "appleSleepingWristTemperature",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "appleWalkingSteadiness",
    "readOnly": true,
    "evidence": "Walking Steadiness samples are read-only."
  },
  {
    "case": "appleWalkingSteadinessEvent",
    "readOnly": true,
    "evidence": "Walking Steadiness events are read-only."
  },
  {
    "case": "atrialFibrillationBurden",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "environmentalAudioExposureEvent",
    "readOnly": true,
    "evidence": "Environmental audio exposure event samples are read-only."
  },
  {
    "case": "highHeartRateEvent",
    "readOnly": true,
    "evidence": "The high heart rate samples are read-only."
  },
  {
    "case": "infrequentMenstrualCycles",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "irregularHeartRhythmEvent",
    "readOnly": true,
    "evidence": "The irregular rhythm samples are read-only."
  },
  {
    "case": "irregularMenstrualCycles",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "lowCardioFitnessEvent",
    "readOnly": true,
    "evidence": "Low-cardio fitness event samples are read-only."
  },
  {
    "case": "lowHeartRateEvent",
    "readOnly": true,
    "evidence": "The low heart rate samples are read-only."
  },
  {
    "case": "persistentIntermenstrualBleeding",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "prolongedMenstrualPeriods",
    "readOnly": true,
    "evidence": "These samples are read-only."
  },
  {
    "case": "walkingHeartRateAverage",
    "readOnly": true,
    "evidence": "You cannot save your own walking heart rate samples; however, you can query these samples."
  }
];

export const HK_READONLY_SET = new Set(HK_READONLY.map((r) => r.case));
