"use client";

import { useState, useSyncExternalStore } from "react";
import PermissionBuilder, { type PermOption } from "@/components/tools/PermissionBuilder";
import PermissionXray from "@/components/tools/PermissionXray";
import type { AndroidReference } from "@/lib/permissionXray.mjs";

/**
 * The two modes of /tools/permission-builder on one URL: build the request
 * from HealthKit types, or paste a manifest / plist and X-ray what it asks
 * for. Both stay mounted, so switching never loses picks or a paste; #xray
 * opens the paste mode.
 */

type Mode = "build" | "xray";

const MODES: { id: Mode; label: string }[] = [
  { id: "build", label: "Build from HealthKit types" },
  { id: "xray", label: "Permission X-ray: paste a manifest or plist" },
];

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readHash() {
  return window.location.hash;
}

export default function PermissionTool({ options, androidRef }: { options: PermOption[]; androidRef: AndroidReference }) {
  // The hash is read as an external store so #xray opens the paste mode
  // without a setState-in-effect; a click then takes over.
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const [chosen, setChosen] = useState<Mode | null>(null);
  const mode: Mode = chosen ?? (hash === "#xray" ? "xray" : "build");

  function choose(next: Mode) {
    setChosen(next);
    const nextHash = next === "xray" ? "#xray" : "";
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }

  return (
    <div>
      <div role="group" aria-label="Tool mode" className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={active}
              aria-controls={`perm-mode-${m.id}`}
              onClick={() => choose(m.id)}
              className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand-400 bg-brand-500/15 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <div id="perm-mode-build" hidden={mode !== "build"} className="mt-4">
        <PermissionBuilder options={options} />
      </div>
      <div id="perm-mode-xray" hidden={mode !== "xray"} className="mt-4">
        <PermissionXray androidRef={androidRef} />
      </div>
    </div>
  );
}
