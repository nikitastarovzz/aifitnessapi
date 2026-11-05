import type { EvidenceMatrix } from "../lib/evidenceMatrix";
import { yes, unknown } from "../lib/evidenceMatrixCore.mjs";

/**
 * The research-platform chooser (/tools/research-platform-chooser,
 * ops/AUDIENCE-30-2026-11-05.md item 29).
 *
 * Every cell cites rows of
 * ops/sources/evidence/fitness-apis-wearable-research-data-platforms.json by
 * index — the file /fitness-apis/wearable-research-data-platforms was written
 * from, every quote of which source-quotes.yml run 42082822142 found again in
 * its live page on 2026-11-05 — and the page prints each quote beside its
 * cell. "unknown" means the vendor pages read do not say; "no" appears only
 * where a quote says no.
 */

const U = unknown();

export const RESEARCH_PLATFORM_MATRIX: EvidenceMatrix = {
  id: "research-platform-chooser",
  evidenceFile: "fitness-apis-wearable-research-data-platforms",
  roundup: { href: "/fitness-apis/wearable-research-data-platforms", label: "Wearable research data platforms" },
  checkedOn: "2026-11-05",
  checkRun: "42082822142",
  columns: [
    { id: "devices", label: "Devices", kind: "text" },
    { id: "consumer", label: "Participants' own consumer wearables", kind: "feature", need: "Works with participants' own Fitbit or Garmin" },
    { id: "bbi", label: "Beat-to-beat or pulse-rate variability", kind: "feature", need: "Beat-to-beat interval or pulse-rate variability" },
    { id: "ecg", label: "ECG", kind: "feature", need: "ECG" },
    { id: "eda", label: "Electrodermal activity", kind: "feature", need: "Electrodermal activity (EDA)" },
    { id: "cgm", label: "Continuous glucose", kind: "feature", need: "Continuous glucose (CGM)" },
    { id: "raw", label: "Raw motion data", kind: "feature", need: "Raw accelerometer or motion data" },
    { id: "fda", label: "FDA-cleared device", kind: "feature", need: "An FDA 510(k)-cleared device" },
    { id: "api", label: "Programmatic access", kind: "feature", need: "An API for programmatic export" },
    { id: "csv", label: "CSV download", kind: "feature", need: "CSV download" },
    { id: "free", label: "Free plan for a pilot", kind: "feature", need: "A free plan to pilot a protocol" },
    { id: "pricing", label: "Pricing", kind: "text" },
    { id: "fitbit", label: "Fitbit Web API turn-off", kind: "text" },
  ],
  rows: [
    {
      id: "fitabase",
      name: "Fitabase",
      cells: {
        devices: yes("Fitbit and Garmin wearables and internet-connected scales (not Fitbit Ace or Garmin Jr), through Garmin and Fitbit Partner APIs", 1, 2),
        consumer: yes("Study-controlled or participant-owned devices", 1, 3),
        bbi: unknown("Heart rate at the highest resolution available plus daily resting heart rate; Google Health heart rate every 3-15 seconds", 6, 9),
        ecg: U,
        eda: U,
        cgm: U,
        raw: unknown("CSV files for daily, hourly and minute-level data", 11),
        fda: U,
        api: yes("The Fitabase API (batch export, daily activity, device profiles, sync times), a separate add-on; an Aggregate Data API for JSON or CSV exports", 12, 13, 14, 15, 16, 17),
        csv: yes("Daily, hourly and minute-level CSV, per participant or as batch exports", 11),
        free: U,
        pricing: yes("Fitabase works with you to craft an exact pricing plan", 20),
        fitbit: yes(
          "Fitabase is moving exports to the Google Health API one dataset at a time; participants still collecting must grant permission again, with no programmatic way to do it; the Fitabase API does not change",
          22, 27, 35, 36,
        ),
      },
    },
    {
      id: "labfront",
      name: "Labfront",
      cells: {
        devices: yes("Select Garmin, Movesense and Dexcom devices; any Garmin through Garmin Connect, high-resolution data from the select ones; hardware not included in any plan", 40, 41, 63),
        consumer: yes("All Garmin devices, including older models, through Garmin Connect", 41),
        bbi: yes("Beat-to-beat interval from Garmin wearables at each heartbeat; RR interval from Movesense ECG", 42, 43, 44),
        ecg: yes("Movesense ECG at 125 Hz to 500 Hz", 44, 45),
        eda: U,
        cgm: yes("Dexcom continuous glucose", 48),
        raw: yes("9-axis motion from Movesense at 12.5 Hz to 208 Hz; actigraphy from raw Garmin accelerometer data", 46, 47, 49),
        fda: U,
        api: yes("Developer access to raw data for dashboards and applications, in beta", 55, 56),
        csv: yes("CSV importable into tools like MATLAB", 54),
        free: yes("Free Tester plan: up to 5 participants, downloads limited to a 30-day window", 61, 62),
        pricing: yes("Billed annually, in advance", 60),
        fitbit: U,
      },
    },
    {
      id: "empatica",
      name: "Empatica",
      cells: {
        devices: yes("Its own EmbracePlus and EmbraceMini, via Bluetooth to the Care Lab app and the Empatica Cloud", 64, 65),
        consumer: U,
        bbi: yes("Optical PPG with pulse rate and pulse-rate variability", 67),
        ecg: U,
        eda: yes("Ventral EDA sensor", 68),
        cgm: U,
        raw: yes("Raw acceleration and angular velocity", 69),
        fda: yes("EmbracePlus: FDA 510(k) clearance, EU MDR class IIa; EmbraceMini: 510(k) for sleep, circadian rhythm and physical activity monitoring", 66, 71),
        api: yes("A Cloud API for study sponsors and CROs, Avro and CSV files in S3; no SDK for academic research", 76, 77, 78, 79),
        csv: yes("Download from the Care Lab Portal; CSV among the platform's two file formats; not viewable in real time", 74, 75, 78),
        free: U,
        pricing: yes("Bundles of one device with 3 or 5 years of app, portal and cloud access; a 25% academic discount", 80, 81),
        fitbit: U,
      },
    },
    {
      id: "ametris",
      name: "Ametris (formerly ActiGraph)",
      cells: {
        devices: yes("CentrePoint Insight Watch, ActiGraph LEAP and wGT3X-BT; CentrePoint is built for clinical investigations", 86, 87, 91),
        consumer: U,
        bbi: U,
        ecg: U,
        eda: U,
        cgm: U,
        raw: yes("Raw sensor data that can be reprocessed as new methods emerge", 88),
        fda: yes("ActiGraph LEAP: 510(k) cleared for activity, sleep and mobility; its other vital signs are for investigational use only", 85),
        api: yes("The CentrePoint API sends data outcomes to a third-party system", 89),
        csv: U,
        free: U,
        pricing: yes("Calculated for each unique order", 90),
        fitbit: U,
      },
    },
  ],
};

