"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/track";

/**
 * The signup form — replaces the old mailto placeholder. Posts to
 * /api/signup. First name + email required; everything else optional,
 * because every extra required field costs real signups.
 */

const INTERESTS: { id: string; label: string }[] = [
  { id: "motion-tracking", label: "AI motion tracking & camera form feedback" },
  { id: "wearable-data", label: "Wearable & health data integrations" },
  { id: "ai-coaching", label: "AI coaching & LLM features" },
  { id: "compliance", label: "Compliance & privacy" },
  { id: "choosing-an-api", label: "Choosing the right fitness API" },
  { id: "building-an-app", label: "Building a fitness app end to end" },
  { id: "pricing", label: "Pricing & running costs" },
];

const FIELDS_OF_WORK: { id: string; label: string }[] = [
  { id: "engineering", label: "Engineering" },
  { id: "product", label: "Product" },
  { id: "founder-exec", label: "Founder / Executive" },
  { id: "design", label: "Design" },
  { id: "data-ml", label: "Data / ML" },
  { id: "fitness-professional", label: "Coach / Fitness professional" },
  { id: "healthcare", label: "Healthcare" },
  { id: "marketing", label: "Marketing / Growth" },
  { id: "student", label: "Student" },
  { id: "other", label: "Other" },
];

const input =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-brand-400 focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold text-[var(--fg)]";

export default function SignupForm({ source = "signup-form" }: { source?: string }) {
  const startedAt = useMemo(() => Date.now(), []);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [interests, setInterests] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "busy") return;
    const f = new FormData(e.currentTarget);
    setState("busy");
    setErrMsg("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: f.get("firstName"),
          lastName: f.get("lastName"),
          email: f.get("email"),
          country: f.get("country"),
          city: f.get("city"),
          fieldOfWork: f.get("fieldOfWork"),
          position: f.get("position"),
          interests: [...interests],
          interestNote: f.get("interestNote"),
          website: f.get("website"), // honeypot
          startedAt,
          source,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      track("signup-complete", source);
      setState("done");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "something went wrong");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-brand-400/40 bg-brand-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-[var(--fg)]">You&rsquo;re in. 🎉</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Thanks — we&rsquo;ll send API breakdowns and playbooks that match what
          you told us you&rsquo;re building. No spam, unsubscribe any time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="text-left">
      {/* Honeypot: hidden from humans, tempting to bots. */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="firstName">First name *</label>
          <input id="firstName" name="firstName" required maxLength={200} autoComplete="given-name" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" maxLength={200} autoComplete="family-name" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="email">Work email *</label>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="country">Country</label>
          <input id="country" name="country" maxLength={200} autoComplete="country-name" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="city">City</label>
          <input id="city" name="city" maxLength={200} autoComplete="address-level2" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="fieldOfWork">Field of work</label>
          <select id="fieldOfWork" name="fieldOfWork" defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {FIELDS_OF_WORK.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="position">Position / title</label>
          <input id="position" name="position" maxLength={200} placeholder="e.g. iOS engineer, CTO" className={input} />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={label}>What are you most interested in?</legend>
        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          {INTERESTS.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                interests.has(o.id)
                  ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400/50"
              }`}
            >
              <input
                type="checkbox"
                checked={interests.has(o.id)}
                onChange={() => toggle(o.id)}
                className="h-4 w-4 accent-[#10b981]"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label className={label} htmlFor="interestNote">
          Anything specific you&rsquo;re building or trying to figure out?
        </label>
        <textarea id="interestNote" name="interestNote" rows={2} maxLength={200} className={input} />
      </div>

      {state === "error" && (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          Couldn&rsquo;t sign you up: {errMsg}. Please try again.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "busy"}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
        >
          {state === "busy" ? "Signing you up…" : "Sign up →"}
        </button>
        <p className="max-w-xs text-xs text-[var(--muted)]">
          We store this to send you the newsletter and understand who&rsquo;s
          building what. <a href="/privacy" className="underline hover:text-[var(--fg)]">Privacy</a> — update or delete any time.
        </p>
      </div>
    </form>
  );
}
