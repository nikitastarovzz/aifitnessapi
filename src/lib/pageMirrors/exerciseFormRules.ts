import { FORM_RULES, FORM_RULE_EXERCISES, FORM_RULE_PRESETS, FORM_RULE_SOURCES, FORM_RULES_FETCHED_ON } from "@/data/formRules";
import { formRuleSource as src, formRuleValueText, formRulesCapsule } from "@/lib/formRulesView";
import { site } from "@/lib/site";
import { link, table, type MirrorDoc } from "./core";

const PATH = "/tools/exercise-form-rules";
const DATASET = "exercise-form-rules-2026";

/** An inline code span that survives a backtick in the quoted line. */
const code = (s: string) => (s.includes("`") ? `\`\` ${s} \`\`` : `\`${s}\``);

/** /tools/exercise-form-rules.md — mirrors src/app/tools/exercise-form-rules/page.tsx:
 *  every rule of the generated dataset (src/data/formRules.ts), per exercise,
 *  with the values and evidence the page prints (src/lib/formRulesView.ts). */
export function exerciseFormRulesMirror(): MirrorDoc {
  const exercises = FORM_RULE_EXERCISES.flatMap((e) => {
    const rows = FORM_RULES.filter((r) => r.exercise === e.id);
    const presets = FORM_RULE_PRESETS.filter((p) => p.exercise === e.id);
    return [
      `## ${e.name}`,
      "",
      presets.length > 0
        ? `Load into the rep counter: ${presets
            .map((p) => link(`${p.joint} ${p.top}°/${p.bottom}° (${src(p.sourceId)?.name})`, `/tools/rep-counter-playground?preset=${p.id}`))
            .join(" · ")}`
        : "No source read gives both a top and a bottom angle for counting, so there is no rep-counter preset for this exercise.",
      "",
      ...table(
        ["Rule", "Measures", "Value", "Source and evidence"],
        rows.map((r) => {
          const s = src(r.sourceId);
          const measures = [r.joint ?? "—", r.points ? r.points.join(" · ") : null, r.keypointIndices ? `COCO ${r.keypointIndices.join(", ")}` : null]
            .filter(Boolean)
            .join(" · ");
          const evidence =
            r.value === null
              ? [r.nullReason, r.reasonQuote && r.source ? `${code(r.reasonQuote)} ${link(s?.repo ?? r.source, r.source)}` : null].filter(Boolean).join(" ")
              : `${code(r.quote ?? "")} · applied: ${code(r.usage ?? "")} · measured: ${code(r.measureQuote ?? "")} · ${link(s?.name ?? "source", r.source ?? "#")}, ${s?.license}`;
          return [`${r.purpose}: ${r.meaning}`, measures, formRuleValueText(r), evidence];
        }),
      ),
      `How these are detected on camera: ${link(`${e.name.toLowerCase()} detection`, e.motion)}.`,
      "",
    ];
  });

  return {
    path: PATH,
    title: "Exercise form rules: the joint angles open-source trackers use",
    description:
      "Joint-angle rules for squats, push-ups, lunges, planks, curls, presses and deadlifts from open-source trackers, each quoted from its code. JSON and CSV.",
    updated: FORM_RULES_FETCHED_ON,
    type: "tool",
    capsule: formRulesCapsule(),
    body: [
      `${link("Download JSON", `/datasets/${DATASET}.json`)} · ${link("Download CSV", `/datasets/${DATASET}.csv`)} · ${link("Try a rule in the rep counter", "/tools/rep-counter-playground")}`,
      "",
      ...exercises,
      "## Sources",
      "",
      ...FORM_RULE_SOURCES.map(
        (s) =>
          `- ${link(s.name, s.repoUrl)} (${s.repo}, branch ${s.branch}), licensed ${link(s.license, s.licenseUrl)}, built on ${s.poseModel}. Angles computed as ${code(s.angleMethodQuote ?? "")}.${
            s.caveat ? ` Its README warns: “${s.caveat}”` : ""
          } Files read on ${s.files[0]?.fetchedOn}: ${s.files.map((f) => f.path).join(", ")}.`,
      ),
      "",
      "## How this dataset is built, and its limits",
      "",
      "- Only code under an open-source license whose LICENSE file could be read is used. Repositories whose README claims a license but that ship no LICENSE file were left out.",
      "- A source that disappears is dropped, not kept from an old copy. thphuc05/PythonExcercisePoseEstimation (MIT), the source of 11 squat, push-up and plank rules here until November 2026, answered 404 on November 14, 2026, while its owner’s GitHub account still answered, so its rules were removed, and squat rep counting and the plank hold, which only it filled, are null.",
      "- No number is typed by hand. The generator fetches each file, refuses to write unless the quoted line is in it, and captures the value from that line; the line that applies the value and the line that computes the angle are stored and checked the same way, and a weekly job re-checks every quote against the live file.",
      `- Peer-reviewed definitions, such as the finite-state exercise definitions cited on ${link("deadlift detection", "/motion/deadlift-pose-estimation")}, were on hosts the build environment could not reach on ${FORM_RULES_FETCHED_ON}. Their numbers are not copied until a fetched copy can be quoted, which is why the deadlift rules are null.`,
      "- Every source measures 2D angles in the image, from one model and one camera setup its author chose. A threshold that suits a side-on phone at hip height can fail from the front. The values are starting points to test, not a standard of correct form, and nothing here is coaching or medical advice.",
      "- Sources count a rep at different points of the movement; the “meaning” column says where, in the source’s own terms where they differ from the rep counter’s.",
      "",
      `An open dataset from ${site.name}, CC BY 4.0, listed with the others on ${link("open datasets", "/datasets")}. Test a rule with ${link("the rep counter playground", "/tools/rep-counter-playground")}; the method behind it is ${link("how form feedback works", "/motion/how-form-feedback-works")}.`,
    ],
  };
}
