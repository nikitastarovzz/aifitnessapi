import fs from "node:fs";
import path from "node:path";
import { absoluteUrl, site } from "@/lib/site";

/**
 * What changed in the published datasets between the last two regenerations,
 * computed from the committed manifests. An agent (or a person) who cached a
 * dataset can hit this one URL to learn whether a re-fetch is worth it and
 * which files moved — without diffing the files themselves.
 */
export const dynamic = "force-static";

type Manifest = { generated: string; files: { file: string; bytes: number; rows: number | null; sha256: string }[] };

function read(p: string): Manifest | null {
  const full = path.join(process.cwd(), "public", "datasets", p);
  if (!fs.existsSync(full)) return null;
  try {
    return JSON.parse(fs.readFileSync(full, "utf8")) as Manifest;
  } catch {
    return null;
  }
}

export function GET() {
  const cur = read("manifest.json");
  const prev = read("manifest-prev.json");

  const changes: { file: string; status: string; rows_before: number | null; rows_after: number | null }[] = [];
  if (cur && prev) {
    const prevBy = new Map(prev.files.map((f) => [f.file, f]));
    for (const f of cur.files) {
      const p = prevBy.get(f.file);
      if (!p) changes.push({ file: f.file, status: "added", rows_before: null, rows_after: f.rows });
      else if (p.sha256 !== f.sha256)
        changes.push({ file: f.file, status: "changed", rows_before: p.rows, rows_after: f.rows });
      prevBy.delete(f.file);
    }
    for (const [name, p] of prevBy) changes.push({ file: name, status: "removed", rows_before: p.rows, rows_after: null });
  }

  const body = {
    name: `${site.name} dataset diff`,
    description:
      "Changes between the last two dataset regenerations, from the committed manifests. No previous manifest means no regeneration has happened since this feed shipped.",
    datasets: absoluteUrl("/datasets"),
    current_generated: cur?.generated ?? null,
    previous_generated: prev?.generated ?? null,
    files_tracked: cur?.files.length ?? 0,
    changes,
    manifest: absoluteUrl("/datasets/manifest.json"),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
