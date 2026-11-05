"use client";

import { useMemo, useState } from "react";
import { SCAFFOLD_STACKS, SCAFFOLD_VENDORS, generateScaffold } from "@/lib/starterScaffold.mjs";
import { zipFiles } from "@/lib/zipWriter.mjs";

/**
 * The interactive half of /tools/starter-scaffold. The files are generated
 * and zipped in this tab by src/lib/starterScaffold.mjs and src/lib/zipWriter.mjs,
 * the same modules scripts/starter-scaffold.test.mjs compiles and runs for
 * every stack and vendor. Nothing is uploaded and nothing is stored.
 */

const chip =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors has-[:checked]:border-brand-400 has-[:checked]:bg-brand-500/10";

export default function StarterScaffold() {
  const [stack, setStack] = useState<string>("express");
  const [vendors, setVendors] = useState<string[]>(["oura", "whoop"]);
  const [project, setProject] = useState("fitness-integration");
  const [open, setOpen] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!vendors.length) return null;
    try {
      return generateScaffold({ stack: stack as "express" | "nextjs" | "fastapi", vendors, project });
    } catch {
      return null;
    }
  }, [stack, vendors, project]);

  const shown = result?.files.find((f) => f.path === open) ?? result?.files.find((f) => f.path.endsWith("README.md")) ?? null;

  function toggle(id: string) {
    setVendors((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  }

  function download() {
    if (!result) return;
    const bytes = zipFiles(result.files);
    const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.project}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--fg)]">Stack</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCAFFOLD_STACKS.map((s) => (
            <label key={s.id} className={`${chip} border-[var(--border)]`}>
              <input type="radio" name="stack" value={s.id} checked={stack === s.id} onChange={() => setStack(s.id)} className="accent-brand-500" />
              <span className="text-[var(--fg)]">{s.name}</span>
              <span className="text-xs text-[var(--muted)]">{s.language}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--fg)]">Vendors</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCAFFOLD_VENDORS.map((v) => (
            <label key={v.id} className={`${chip} border-[var(--border)]`}>
              <input type="checkbox" checked={vendors.includes(v.id)} onChange={() => toggle(v.id)} className="accent-brand-500" />
              <span className="text-[var(--fg)]">{v.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold text-[var(--fg)]">
        Project name
        <input
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="mt-1.5 w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[13px] text-[var(--fg)]"
          spellCheck={false}
        />
      </label>

      {result ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={download}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
              data-scaffold-download
            >
              Download {result.project}.zip
            </button>
            <span className="text-xs text-[var(--muted)]">
              {result.files.length} files, built in your browser. Nothing is uploaded.
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
            <ul className="space-y-0.5 font-mono text-xs" aria-label="Files">
              {result.files.map((f) => (
                <li key={f.path}>
                  <button
                    type="button"
                    onClick={() => setOpen(f.path)}
                    className={`w-full truncate rounded-lg px-2 py-1 text-left ${shown?.path === f.path ? "bg-brand-500/10 text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"}`}
                  >
                    {f.path.split("/").slice(1).join("/")}
                  </button>
                </li>
              ))}
            </ul>
            {shown && (
              <pre className="max-h-[32rem] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-xs leading-relaxed text-[var(--fg)]">
                {shown.content}
              </pre>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--muted)]">Pick at least one vendor.</p>
      )}
    </div>
  );
}
