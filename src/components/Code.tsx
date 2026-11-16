/** An inline code span that breaks anywhere, for long identifiers in prose and tables. */
export default function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}
