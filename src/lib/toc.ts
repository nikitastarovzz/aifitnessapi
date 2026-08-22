import GithubSlugger from "github-slugger";

/**
 * Headings of a markdown body, with the exact ids `rehype-slug` will generate
 * for them — same slugger, same order, so the on-page table of contents can
 * never point at an anchor that doesn't exist.
 *
 * Fenced code is skipped: a `# comment` inside a shell block is not a heading.
 */
export type Heading = { depth: 2 | 3; text: string; id: string };

export function headings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const depth = m[1].length;
    // Strip inline markdown so the label reads as text, not source.
    const text = m[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();
    // Every heading consumes a slug (dedupe counters must stay in step with
    // rehype-slug even for depths we don't display).
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) out.push({ depth: depth as 2 | 3, text, id });
  }
  return out;
}
