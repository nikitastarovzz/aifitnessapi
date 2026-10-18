/**
 * Pull the HKQuantityTypeIdentifier / HKCategoryTypeIdentifier case names out
 * of a matrix `apple` cell (src/data/matrix.ts).
 *
 * The cells are written for humans and use a shorthand the parser has to
 * honour: "HKQuantityTypeIdentifier.heartRate, .restingHeartRate" means two
 * identifiers, the second continuing the first's type. A trailing
 * parenthetical ("(values: inBed, awake…)") is prose about the enum and must
 * not be read as more cases.
 *
 * Lives here rather than in components/MetricFacts so that the data modules
 * which need it (hkIdentifierPages) do not import a component, and the
 * component can import those modules without a cycle. MetricFacts re-exports
 * it, and qa.mjs repeats the same parse independently.
 */
export function appleCases(apple: string): string[] {
  const withoutParens = apple.replace(/\([^)]*\)/g, " ");
  const out: string[] = [];
  for (const m of withoutParens.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}
