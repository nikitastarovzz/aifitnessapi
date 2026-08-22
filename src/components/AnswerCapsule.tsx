import type { ReactNode } from "react";

/**
 * The answer-first block every cluster spoke opens with, extracted so the
 * standalone pages (tools, trackers, the report) can carry one too. It is the
 * element `speakable` points at and the paragraph an assistant quotes, so its
 * markup — id and class — must match the cluster template exactly.
 */
export default function AnswerCapsule({
  id = "answer",
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
