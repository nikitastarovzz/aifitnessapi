"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/track";

/**
 * Pick the products you depend on; get an email when something dated changes
 * about one of them.
 *
 * This is the same subscriber record as the newsletter — one person, one
 * document — with a `watching` list attached, so nobody has to manage two
 * subscriptions. The promise is deliberately narrow: we only send when the
 * changes tracker gains an entry naming a product you watch, and the tracker
 * only gains entries we could verify. A watch list is a promise about volume
 * as much as content.
 */
export type WatchOption = { id: string; label: string; category: string };

export default function WatchForm({ options }: { options: WatchOption[] }) {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [watching, setWatching] = useState<Set<string>>(new Set());
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(Date.now());
  const website = useRef<HTMLInputElement>(null);

  // A "Watch Fitbit" link from a directory page arrives with ?watch=fitbit.
  useEffect(() => {
    const pre = params.getAll("watch").flatMap((v) => v.split(","));
    const valid = pre.filter((v) => options.some((o) => o.id === v));
    if (valid.length) setWatching((s) => new Set([...s, ...valid]));
  }, [params, options]);

  const groups = useMemo(() => {
    const m = new Map<string, WatchOption[]>();
    for (const o of options) m.set(o.category, [...(m.get(o.category) ?? []), o]);
    return [...m.entries()];
  }, [options]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (watching.size === 0) {
      setState("error");
      setMessage("Pick at least one product to watch.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          watching: [...watching],
          source: "alerts",
          website: website.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState("error");
        setMessage(body.error ?? "Something went wrong. Try again in a moment.");
        return;
      }
      track("signup-complete", "alerts");
      setState("done");
    } catch {
      setState("error");
      setMessage("Network error — nothing was saved. Try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-brand-400/40 bg-brand-500/5 p-6">
        <p className="text-lg font-semibold text-[var(--fg)]">
          Watching {watching.size} product{watching.size === 1 ? "" : "s"}.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You will hear from us when the changes tracker gains a dated entry naming one of
          them — and not otherwise. Reply to any email to change the list or stop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--fg)]">
          What do you depend on?
        </legend>
        <div className="mt-4 space-y-5">
          {groups.map(([cat, items]) => (
            <div key={cat}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {cat}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {items.map((o) => {
                  const on = watching.has(o.id);
                  return (
                    <label
                      key={o.id}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        on
                          ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() =>
                          setWatching((s) => {
                            const next = new Set(s);
                            if (next.has(o.id)) next.delete(o.id);
                            else next.add(o.id);
                            return next;
                          })
                        }
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[var(--fg)]">First name</span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] focus:border-brand-400 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--fg)]">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] focus:border-brand-400 focus:outline-none"
          />
        </label>
      </div>

      {/* Honeypot — humans never see it, bots fill it. */}
      <input
        ref={website}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
        >
          {state === "sending" ? "Saving…" : `Watch ${watching.size || ""} ${watching.size === 1 ? "product" : "products"}`.trim()}
        </button>
        <span className="text-xs text-[var(--muted)]">
          No spam, no sequence, no sharing. Reply to stop.
        </span>
      </div>

      {state === "error" && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}
