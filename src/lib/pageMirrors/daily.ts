import { PAGE_H1 } from "@/data/pageTitles";
import { DAILY_CAPSULE, DAILY_PATH, DAILY_SOURCE_DATES, dailyBank, dailyDataDate, dailyFaqs } from "@/lib/dailyBank";
import { bankSizes } from "@/lib/dailyPuzzle";
import { site } from "@/lib/site";
import { faqSection, interactiveNote, link, type MirrorDoc } from "./core";

/** /daily.md — mirrors src/app/daily/page.tsx: how the bank is built, with the
 *  same counts, and the FAQs. Today's five questions are the interactive part. */
export function dailyMirror(): MirrorDoc {
  const bank = dailyBank();
  const sizes = bankSizes(bank);
  const modified = dailyDataDate();
  const total = sizes.platform + sizes.translate + sizes.aggregation + sizes.keypoint;
  return {
    path: DAILY_PATH,
    title: PAGE_H1[DAILY_PATH],
    description:
      "Five questions a day from our HealthKit, Health Connect, Google Health API and pose-keypoint datasets, with a spoiler-free grid to share.",
    updated: modified,
    type: "game",
    capsule: DAILY_CAPSULE,
    body: [
      `A new puzzle every day at 00:00 UTC · ${total} questions in the bank · built from datasets read ${DAILY_SOURCE_DATES.healthkitIdentifiers} to ${modified}`,
      "",
      interactiveNote(DAILY_PATH, "today's five questions"),
      "",
      "## How the puzzle is built",
      "",
      "Each day has all four kinds of question, led by a different kind each day, with the lead kind asked twice. The bank holds:",
      "",
      `- **Which platform throws this?** ${sizes.platform} error messages: ${bank.errors.healthkit.length} from Apple’s ${link("HKError.Code reference", "/healthkit-errors")}, ${bank.errors["health-connect"].length} from Google’s ${link("HealthConnectException constants", "/error-codes/health-connect")} (read ${DAILY_SOURCE_DATES.errorCodes}) and ${bank.errors["google-health-api"].length} from the ${link("Google Health API v4 error catalog", "/google-health-api/errors")} (read ${DAILY_SOURCE_DATES.googleHealthApi}). The platform is drawn first, so the larger catalog does not crowd out the other two. Messages that name their own platform, or that two platforms share word for word, are left out.`,
      `- **Translate it:** ${sizes.translate} HealthKit identifiers named in the ${link("HealthKit ↔ Health Connect matrix", "/matrix")}, each checked against Apple’s and Google’s documentation. The four options are matrix rows, so an identifier is never paired with a record the matrix does not pair it with.`,
      `- **Sum or average?** ${sizes.aggregation} quantity types where Apple’s documentation states the aggregation style, from the ${link("HealthKit identifier dataset", "/healthkit-identifiers")} (read ${DAILY_SOURCE_DATES.healthkitIdentifiers}). The same sentence drives the ${link("aggregation checker", "/tools/aggregation-checker")}.`,
      `- **Name the keypoint:** ${sizes.keypoint} indexed points across ${bank.keypoints.length} schemes in the ${link("pose keypoint reference", "/pose-keypoints")} (read ${DAILY_SOURCE_DATES.poseKeypoints}). COCO-WholeBody’s face-0 to face-67 points are not asked, and when a point has a left or right twin in the same scheme, the twin is one of the options.`,
      "",
      "The selection code is one pure module tested against every date from launch to the end of 2027: same date, same puzzle, every answer traced back to its dataset row. A dataset regeneration can change the bank, and so the draw for days that have not happened yet.",
      "",
      ...faqSection(DAILY_PATH, dailyFaqs(), "Questions"),
      "## Related",
      "",
      `- ${link("Every free tool for health-app builders", "/tools")}`,
      `- ${link("HealthKit and Health Connect error codes", "/error-codes")}`,
      `- ${link("Translate a HealthKit type to Health Connect", "/tools/identifier-translator")}`,
      `- ${link("Pose keypoint indices, every scheme", "/pose-keypoints")}`,
      "",
      `By ${site.name}. Product and company names are trademarks of their respective owners; ${site.name} is not affiliated with or endorsed by Apple, Google or the pose-model projects quoted here. Vendor wording is quoted as the datasets hold it on their read dates.`,
    ],
  };
}
