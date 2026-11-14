import {
  FORM_RULES,
  FORM_RULE_EXERCISES,
  FORM_RULE_PRESETS,
  FORM_RULE_SOURCES,
  FORM_RULES_FETCHED_ON,
  type FormRule,
} from "@/data/formRules";

/**
 * What /tools/exercise-form-rules says about the generated form-rules
 * dataset (src/data/formRules.ts), shared with its markdown mirror
 * (src/lib/pageMirrors/exerciseFormRules.ts) so both print the same values
 * and counts.
 */

export const formRuleSource = (id: string | null) => FORM_RULE_SOURCES.find((s) => s.id === id);

/** The Value cell: "null", "below 90°", "100° to 160°", "above 10 frames". */
export function formRuleValueText(r: FormRule): string {
  if (r.value === null) return "null";
  const u = r.unit === "degrees" ? "°" : r.unit === "frames" ? " frames" : "";
  if (r.comparison === "within") return `${r.value}${u} to ${r.value2}${u}`;
  return `${r.comparison} ${r.value}${u}`;
}

/**
 * The first pair of rules that sets the same check (exercise, purpose, role,
 * joint, in degrees) from two different sources at different values, so the
 * pages can show a disagreement the data actually contains; null when the
 * dataset holds none.
 */
export function formRuleDisagreement(): { exerciseName: string; joint: string; role: string; a: FormRule; b: FormRule } | null {
  const valued = FORM_RULES.filter((r) => r.value !== null && r.unit === "degrees" && r.comparison !== "within" && r.joint);
  for (const [i, a] of valued.entries()) {
    const b = valued
      .slice(i + 1)
      .find((x) => x.exercise === a.exercise && x.purpose === a.purpose && x.role === a.role && x.joint === a.joint && x.sourceId !== a.sourceId && x.value !== a.value);
    if (b) return { exerciseName: a.exerciseName, joint: a.joint as string, role: a.role, a, b };
  }
  return null;
}

/** The page's #answer capsule. */
export function formRulesCapsule(): string {
  const nonNull = FORM_RULES.filter((r) => r.value !== null);
  const nulls = FORM_RULES.filter((r) => r.value === null);
  const pushUps = FORM_RULE_PRESETS.filter((p) => p.exercise === "push-up");
  const pair = formRuleDisagreement();
  const disagree =
    pushUps.length >= 2
      ? `one licensed project counts a push-up between elbow angles of ${pushUps[0].top} and ${pushUps[0].bottom} degrees, another between ${pushUps[1].top} and ${pushUps[1].bottom}.`
      : pair
        ? `on the same ${pair.exerciseName.toLowerCase()} ${pair.joint} ${pair.role} check, one licensed project uses ${pair.a.value} degrees and another ${pair.b.value}.`
        : "each picks its own top and bottom angles.";
  return (
    `Open-source pose-estimation exercise trackers count and check reps with fixed joint-angle thresholds, and they do not agree: ${disagree} ` +
    `This dataset collects ${nonNull.length} such thresholds for ${FORM_RULE_EXERCISES.length} exercises from ${FORM_RULE_SOURCES.length} licensed projects, ` +
    `each with the line of code it was read from on ${FORM_RULES_FETCHED_ON}, and marks ${nulls.length} rules null where no source read states a number. ` +
    "They are the authors’ choices, not biomechanical standards. CC BY 4.0, JSON and CSV."
  );
}
