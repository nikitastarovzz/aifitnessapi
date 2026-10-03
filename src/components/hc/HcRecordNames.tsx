import Link from "next/link";
import { HC_RECORDS } from "@/data/healthConnectRecords";
import { recordPath } from "@/data/hcPages";

/**
 * Renders a matrix row's Android text (for example
 * "StepsRecord, StepsCadenceRecord") with every Health Connect record class
 * that has a generated reference page linked to that page. Only the names the
 * verified matrix row already prints are linked — nothing is added — and a
 * name with no generated record (ExerciseRoute, a nested type) stays text.
 */
const BY_CLASS = new Map(HC_RECORDS.map((r) => [r.className, r]));

export default function HcRecordNames({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts = text.split(/\b([A-Z][A-Za-z0-9]*Record)\b/);
  return (
    <>
      {parts.map((part, i) => {
        const record = i % 2 === 1 ? BY_CLASS.get(part) : undefined;
        return record ? (
          <Link
            key={i}
            href={recordPath(record)}
            className={linkClassName ?? "text-brand-600 hover:text-brand-500"}
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}
