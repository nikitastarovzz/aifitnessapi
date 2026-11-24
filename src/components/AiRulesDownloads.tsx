import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import manifest from "../../public/kit/ai-rules/manifest.json";

/**
 * The "Rule files for AI coding assistants" section of /developers: the
 * packs scripts/build-ai-rules.mjs renders into public/kit/ai-rules/, one
 * download per topic and tool, and the command that installs each where the
 * tool looks for it. Read from the generated manifest, so the dates, line
 * counts and install paths are the files' own. qa's AI-RULES-UNLINKED holds
 * this section to a link for every file.
 */

type Entry = (typeof manifest.files)[number];

const TOPIC_LABEL: Record<string, string> = {
  healthkit: "HealthKit",
  "health-connect": "Health Connect",
  "pose-keypoints": "Pose keypoints",
};
const FLAVOR_LABEL: Record<string, string> = { cursor: "Cursor", claude: "Claude Code", copilot: "GitHub Copilot" };
const FLAVORS = ["cursor", "claude", "copilot"] as const;
const TOPICS = ["healthkit", "health-connect", "pose-keypoints"] as const;
const DIR = "/kit/ai-rules";
const SITE = "https://aifitnessapi.com";

const fileOf = (topic: string, flavor: string): Entry => {
  const f = manifest.files.find((x) => x.topic === topic && x.flavor === flavor);
  if (!f) throw new Error(`AiRulesDownloads: ${topic}/${flavor} is not in public/kit/ai-rules/manifest.json`);
  return f;
};

function install(flavor: string): string {
  return TOPICS.map((t) => {
    const f = fileOf(t, flavor);
    return `curl -fsSL --create-dirs -o ${f.installAs} ${SITE}${DIR}/${f.file}`;
  }).join("\n");
}

const NOTE: Record<string, string> = {
  cursor:
    "Cursor reads project rules from .cursor/rules as .mdc files. These carry a description and alwaysApply: false, so Agent pulls a rule in when the description fits the task.",
  claude:
    "Claude Code loads every markdown file in .claude/rules/ at launch. To load a rule only for some files, add a paths: front matter; to keep the file elsewhere, import it from CLAUDE.md with @path/to/file.",
  copilot:
    "Copilot reads path-specific instructions from .github/instructions/*.instructions.md; these apply to every path (applyTo: \"**\"). GitHub documents path-specific files for Copilot cloud agent and code review on GitHub.com; for the rest, paste a file's text into .github/copilot-instructions.md.",
};

export default function AiRulesDownloads() {
  const generated = [...new Set(manifest.files.map((f) => f.generatedOn))].sort().at(-1);
  const ext = "text-brand-600 hover:text-brand-500 break-words";
  return (
    <section id="ai-rules" className="mt-12 scroll-mt-24" data-ai-rules>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Rule files for AI coding assistants</h2>
      <p className="mt-3 text-[var(--fg)]">
        Commit one of these into your own repository and Cursor, Claude Code or GitHub Copilot will write HealthKit, Health
        Connect and pose code with the exact identifier and record names, permission strings, units, cumulative or discrete
        aggregation and error cases this site publishes, instead of names that only sound right. Each file is rendered from
        the generated datasets by <code>scripts/build-ai-rules.mjs</code>, quotes the vendor sentence behind every
        aggregation style, links the{" "}
        <Link href="/fix" className={ext}>
          troubleshooting pages
        </Link>{" "}
        and the{" "}
        <Link href="/healthkit-errors" className={ext}>
          HKError reference
        </Link>
        , and opens with the date it was generated (latest {generated}) and the date its data was read.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 pr-4 font-semibold">Topic</th>
              {FLAVORS.map((f) => (
                <th key={f} className="py-2 pr-4 font-semibold">
                  {FLAVOR_LABEL[f]}
                </th>
              ))}
              <th className="py-2 font-semibold">Data read</th>
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((t) => (
              <tr key={t} className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">{TOPIC_LABEL[t]}</td>
                {FLAVORS.map((fl) => {
                  const f = fileOf(t, fl);
                  return (
                    <td key={fl} className="py-2 pr-4">
                      <a
                        href={`${DIR}/${f.file}`}
                        download
                        className={`font-mono text-xs ${ext}`}
                        data-cta={`ai-rules-${t}-${fl}`}
                        data-cta-source="developers-ai-rules"
                      >
                        {f.file}
                      </a>{" "}
                      <span className="text-xs text-[var(--muted)]">({f.lines} lines)</span>
                    </td>
                  );
                })}
                <td className="py-2 text-xs text-[var(--muted)]">{fileOf(t, "claude").dataReadOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {FLAVORS.map((fl) => (
        <div key={fl} className="mt-6">
          <h3 className="text-lg font-semibold text-[var(--fg)]">{FLAVOR_LABEL[fl]}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{NOTE[fl]}</p>
          <div data-copy-scope className="relative mt-2">
            <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card,transparent)] p-4 text-xs leading-relaxed">
              <code>{install(fl)}</code>
            </pre>
            <span className="mt-2 inline-block" data-cta={`ai-rules-copy-${fl}`} data-cta-source="developers-ai-rules">
              <CopyButton label={`Copy the ${FLAVOR_LABEL[fl]} install commands`} />
            </span>
          </div>
        </div>
      ))}
      <p className="mt-6 text-xs text-[var(--muted)]">
        Formats as each tool documents them, read on 2026-11-24:{" "}
        {manifest.formats.map((f, i) => (
          <span key={f.url}>
            {i > 0 && "; "}
            <a href={f.url} className={ext} rel="nofollow noreferrer" target="_blank">
              {f.tool}
            </a>
          </span>
        ))}
        . No Garmin or Terra pack: this site has no generated dataset of either vendor&rsquo;s data types to render one from.
      </p>
    </section>
  );
}
