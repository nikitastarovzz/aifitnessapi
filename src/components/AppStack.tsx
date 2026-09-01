import Link from "next/link";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { API_ENTRIES } from "@/data/apis";

/**
 * The concrete stack for one app category, on its /build guide.
 *
 * The /build pages are strategy — user loop, MVP scope, monetisation — and
 * they were good at that and silent on specifics: 1,816 words on how to build
 * a running app without naming a single type identifier. A reader who has
 * decided to build it still had to go and work out what to actually read from
 * the phone.
 *
 * This closes that gap from data rather than prose. The category-to-types map
 * below is the only authored part; everything rendered from it — what each
 * type measures, whether it aggregates, which unit, which Android record — is
 * joined out of the generated identifier dataset and the verified matrix, so
 * it cannot drift from the reference pages and cannot state anything those
 * pages do not.
 *
 * Health Connect names come ONLY from matrix.ts, which is restricted to
 * metrics confirmed against both platforms' documentation. Where a type has no
 * matrix row the Android column is omitted rather than guessed.
 */

type Stack = {
  /** HealthKit cases, in the order a reader should care about them. */
  healthkit: string[];
  /** Product ids from the API directory that serve this category. */
  apis: string[];
  /** The one-line framing of why this set and not another. */
  note: string;
};

const STACKS: Record<string, Stack> = {
  "running-app": {
    healthkit: ["distanceWalkingRunning", "runningSpeed", "runningPower", "heartRate", "activeEnergyBurned", "vo2Max"],
    apis: ["strava", "garmin", "polar", "healthkit", "health-connect"],
    note: "Distance and pace come free from the platform store; the interesting differentiators are the running-dynamics types Apple added later, which most competitors ignore.",
  },
  "home-workout-app": {
    healthkit: ["activeEnergyBurned", "appleExerciseTime", "heartRate"],
    apis: ["exercisedb", "wger", "kinestex", "healthkit", "health-connect"],
    note: "You are writing a workout, not reading one. The energy and exercise-time types are what you contribute back to the health store so the ring closes.",
  },
  "strength-training-app": {
    healthkit: ["activeEnergyBurned", "appleExerciseTime", "bodyMass", "leanBodyMass", "bodyFatPercentage"],
    apis: ["exercisedb", "wger", "healthkit", "health-connect"],
    note: "Sets, reps and load live in your own schema — no platform store models them. The health types here are the body-composition context around the log, not the log itself.",
  },
  "yoga-app": {
    healthkit: ["appleExerciseTime", "heartRate", "mindfulSession"],
    apis: ["exercisedb", "kinestex", "healthkit", "health-connect"],
    note: "The mindful-session type is a category type, not a quantity type: it carries an enum value rather than a number, so it is written as a session with a duration.",
  },
  "nutrition-tracking-app": {
    healthkit: ["dietaryEnergyConsumed", "dietaryProtein", "dietaryCarbohydrates", "dietaryFatTotal", "dietaryWater", "bodyMass"],
    apis: ["nutritionix", "edamam", "usda-fdc", "open-food-facts", "healthkit"],
    note: "HealthKit models 39 dietary types. Writing the four macros plus water covers most products; the micronutrient types matter only if your food database resolves them.",
  },
  "rehab-physical-therapy-app": {
    healthkit: ["walkingSpeed", "walkingAsymmetryPercentage", "appleWalkingSteadiness", "sixMinuteWalkTestDistance", "stairAscentSpeed"],
    apis: ["kinestex", "mediapipe", "healthkit", "health-connect"],
    note: "Apple's mobility types are the closest thing to clinical gait measures available without hardware — and the reason this category can measure progress the others cannot.",
  },
  "corporate-wellness-app": {
    healthkit: ["stepCount", "appleExerciseTime", "activeEnergyBurned"],
    apis: ["terra", "rook", "spike", "healthkit", "health-connect"],
    note: "Breadth beats depth: your population is on every device there is, which is the strongest case on this site for an aggregator over direct integrations.",
  },
  "personal-training-app": {
    healthkit: ["activeEnergyBurned", "heartRate", "appleExerciseTime", "bodyMass"],
    apis: ["exercisedb", "terra", "healthkit", "health-connect"],
    note: "Two audiences, one app: the trainer needs the client's history, which makes identity linking and consent a first-class design problem rather than a setting.",
  },
  "ai-fitness-coaching-app": {
    healthkit: ["heartRate", "restingHeartRate", "heartRateVariabilitySDNN", "activeEnergyBurned", "appleExerciseTime"],
    apis: ["kinestex", "sency", "mediapipe", "healthkit", "health-connect"],
    note: "Recovery signals are what make coaching adaptive rather than a fixed plan with a chat interface — and HRV is the trap, because Apple stores SDNN and Health Connect stores RMSSD.",
  },
  "weight-loss-app": {
    healthkit: ["bodyMass", "bodyFatPercentage", "leanBodyMass", "waistCircumference", "dietaryEnergyConsumed", "activeEnergyBurned", "basalEnergyBurned"],
    apis: ["nutritionix", "edamam", "usda-fdc", "open-food-facts", "fitbit", "healthkit", "health-connect"],
    note: "Both sides of the ledger are estimates, and they aggregate differently: the energy types sum over a day, body mass is a discrete sample you have to smooth before you show it.",
  },
  "meal-planning-app": {
    healthkit: ["dietaryEnergyConsumed", "dietaryProtein", "dietaryCarbohydrates", "dietaryFatTotal", "dietaryFiber", "dietarySodium", "dietarySugar"],
    apis: ["edamam", "usda-fdc", "open-food-facts", "nutritionix", "healthkit"],
    note: "A planner writes these rather than reading them, and it computes every one of them from ingredients — so the accuracy of the whole block is the accuracy of your ingredient resolution.",
  },
  "sleep-tracking-app": {
    healthkit: ["sleepAnalysis", "restingHeartRate", "heartRateVariabilitySDNN", "respiratoryRate", "oxygenSaturation", "appleSleepingWristTemperature", "appleSleepingBreathingDisturbances"],
    apis: ["oura", "whoop", "fitbit", "garmin", "terra", "healthkit", "health-connect"],
    note: "Sleep is the odd one out: it is a category type carrying an enum per segment, not a number, so one night arrives as many records that you have to stitch into a session yourself.",
  },
  "recovery-app": {
    healthkit: ["heartRateVariabilitySDNN", "restingHeartRate", "respiratoryRate", "oxygenSaturation", "appleSleepingWristTemperature", "heartRateRecoveryOneMinute", "vo2Max"],
    apis: ["whoop", "oura", "garmin", "polar", "terra", "healthkit", "health-connect"],
    note: "Every input here is a discrete sample averaged against a personal baseline, which is why a recovery score has nothing to say until it has watched a user for a while.",
  },
  "meditation-app": {
    healthkit: ["mindfulSession", "heartRate", "heartRateVariabilitySDNN", "restingHeartRate", "respiratoryRate"],
    apis: ["healthkit", "health-connect", "oura", "whoop"],
    note: "The mindful session is the only thing you write, and it is a duration rather than a measurement; the rest of this list you read, to show what a session looked like from the outside.",
  },
  "cycle-tracking-app": {
    healthkit: ["menstrualFlow", "ovulationTestResult", "cervicalMucusQuality", "basalBodyTemperature", "sexualActivity", "pregnancyTestResult", "progesteroneTestResult", "intermenstrualBleeding"],
    apis: ["healthkit", "health-connect", "oura", "fitbit"],
    note: "Almost everything in this category is an enum with a date, not a time series — which makes the schema unlike every other app here, and makes each record far more identifying.",
  },
  "step-challenge-app": {
    healthkit: ["stepCount", "distanceWalkingRunning", "flightsClimbed", "appleExerciseTime", "activeEnergyBurned", "appleStandHour", "pushCount"],
    apis: ["fitbit", "garmin", "strava", "terra", "rook", "spike", "healthkit", "health-connect"],
    note: "Read the aggregation column: these are cumulative sums, so a phone and a watch reporting the same walk will add up rather than agree. Pick one source per participant per day.",
  },
  "senior-fitness-app": {
    healthkit: ["appleWalkingSteadiness", "appleWalkingSteadinessEvent", "walkingSpeed", "walkingStepLength", "walkingAsymmetryPercentage", "walkingDoubleSupportPercentage", "stairAscentSpeed", "stairDescentSpeed", "sixMinuteWalkTestDistance", "numberOfTimesFallen"],
    apis: ["exercisedb", "mediapipe", "healthkit", "health-connect"],
    note: "The mobility family is the most under-used data on this site: ten types the phone already computes from ordinary walking, which almost no consumer app reads.",
  },
};

const byCase = new Map(HK_IDENTIFIERS.map((r) => [r.case, r]));
const androidFor = new Map<string, string>();
for (const row of MATRIX_ROWS) {
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    androidFor.set(m[1], row.android);
  }
}

/** Every case and api id referenced, for the qa gate. */
export function allStackRefs(): { slug: string; healthkit: string[]; apis: string[] }[] {
  return Object.entries(STACKS).map(([slug, s]) => ({ slug, healthkit: s.healthkit, apis: s.apis }));
}

export default function AppStack({ path }: { path: string }) {
  const slug = path.startsWith("/build/") ? path.slice("/build/".length) : null;
  const stack = slug ? STACKS[slug] : undefined;
  if (!stack) return null;

  const rows = stack.healthkit.map((c) => ({ name: c, record: byCase.get(c) })).filter((r) => r.record);
  if (rows.length === 0) return null;

  const apis = stack.apis
    .map((id) => API_ENTRIES.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <section data-app-stack className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">The concrete stack</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{stack.note}</p>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Health data types you will touch
      </h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th scope="col" className="py-2 pr-4 font-semibold">Apple HealthKit</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Aggregate with</th>
              <th scope="col" className="py-2 font-semibold">Android Health Connect</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ name, record }) => (
              <tr key={name} className="border-b border-[var(--border)] align-top">
                <td className="py-2 pr-4">
                  <Link
                    href={`/healthkit-identifiers#id-${name.toLowerCase()}`}
                    className="font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                  >
                    {name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">{record!.abstract}</span>
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  {record!.aggregation === "cumulative" ? (
                    <code className="font-mono text-xs">.cumulativeSum</code>
                  ) : record!.aggregation === "discrete" ? (
                    <code className="font-mono text-xs">.discreteAverage</code>
                  ) : record!.family === "category" ? (
                    <span className="text-xs">category — {record!.valueEnum ?? "enum value"}</span>
                  ) : (
                    <span className="text-xs">not stated</span>
                  )}
                </td>
                <td className="py-2 text-[var(--muted)]">
                  {androidFor.get(name) ? (
                    <span className="font-mono text-[12px]">{androidFor.get(name)}</span>
                  ) : (
                    <span className="text-xs">not verified on both platforms</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        APIs that serve this category
      </h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {apis.map((a) => (
          <li key={a.id}>
            <Link
              href={`/apis/${a.id}`}
              className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--fg)] hover:border-brand-400"
            >
              {a.short}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-[var(--muted)]">
        Types read from Apple&rsquo;s documentation on {HK_FETCHED_ON} · full set at{" "}
        <Link href="/healthkit-identifiers" className="font-medium text-brand-600 hover:text-brand-500">
          every HealthKit type identifier
        </Link>
        . Android names shown only where{" "}
        <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
          verified on both platforms
        </Link>
        .
      </p>
    </section>
  );
}
