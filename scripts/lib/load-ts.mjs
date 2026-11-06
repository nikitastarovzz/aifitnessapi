// Import a src/ TypeScript module from a plain Node script.
//
// Node 22.18+ strips types from .ts files on import, but it does not know the
// bundler's "@/…" path alias (tsconfig.json). This registers a resolve hook
// that maps "@/x" to src/x.ts (or src/x/index.ts, or the file as named when
// it already has an extension), so a generator can read the same modules the
// site renders instead of re-parsing them with regular expressions.
//
//   import { loadTs } from "./lib/load-ts.mjs";
//   const m = await loadTs("src/lib/fitbitGoogleMap.ts");
import { registerHooks } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
let registered = false;

function resolveAlias(spec) {
  const base = path.join(ROOT, "src", spec.slice(2));
  for (const p of [base, `${base}.ts`, `${base}.tsx`, `${base}.mjs`, path.join(base, "index.ts")]) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return pathToFileURL(p).href;
  }
  throw new Error(`load-ts: cannot resolve ${spec}`);
}

export async function loadTs(rel) {
  if (!registered) {
    registerHooks({
      resolve(spec, ctx, next) {
        if (spec.startsWith("@/")) return next(resolveAlias(spec), ctx);
        return next(spec, ctx);
      },
    });
    registered = true;
  }
  return import(pathToFileURL(path.join(ROOT, rel)).href);
}
