/**
 * The questions a page answers, as jump links to the individual answers.
 *
 * The FAQ block already lives at the bottom with a stable `#faq-N` anchor per
 * answer (assistants deep-link them). This surfaces the same anchors near the
 * top, where somebody who arrived with one specific question can use them.
 */
export default function FaqJump({ questions }: { questions: string[] }) {
  if (questions.length === 0) return null;
  return (
    <nav
      aria-label="Questions answered on this page"
      className="not-prose mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Questions answered here
      </p>
      <ul className="mt-3 space-y-1.5">
        {questions.map((q, i) => (
          <li key={q}>
            <a
              href={`#faq-${i + 1}`}
              className="text-sm text-brand-600 underline-offset-2 hover:text-brand-500 hover:underline"
            >
              {q}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
