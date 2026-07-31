/**
 * Email sending via Resend's REST API — no SDK, same zero-dependency pattern
 * as the Firestore client. Activates when RESEND_API_KEY exists; until then
 * every send is a silent no-op that reports itself unsent, so the signup
 * flow never depends on email infrastructure being ready.
 *
 * Env (server only):
 *   RESEND_API_KEY     from resend.com (requires the sending domain verified)
 *   NEWSLETTER_FROM    optional, default "AIFitnessAPI <hello@aifitnessapi.com>"
 */

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const FROM = () =>
  process.env.NEWSLETTER_FROM ?? "AIFitnessAPI <hello@aifitnessapi.com>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!emailConfigured()) return { sent: false, error: "not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM(),
        to: [opts.to],
        subject: opts.subject,
        text: opts.text,
        ...(opts.html ? { html: opts.html } : {}),
      }),
    });
    if (!res.ok) return { sent: false, error: `${res.status} ${await res.text()}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

const INTEREST_LABELS: Record<string, string> = {
  "motion-tracking": "AI motion tracking & camera form feedback",
  "wearable-data": "wearable & health data integrations",
  "ai-coaching": "AI coaching & LLM features",
  compliance: "compliance & privacy",
  "choosing-an-api": "choosing the right fitness API",
  "building-an-app": "building a fitness app end to end",
  pricing: "pricing & running costs",
};

const INTEREST_LINKS: Record<string, string> = {
  "motion-tracking": "https://aifitnessapi.com/motion",
  "wearable-data": "https://aifitnessapi.com/architecture",
  "ai-coaching": "https://aifitnessapi.com/ai",
  compliance: "https://aifitnessapi.com/compliance",
  "choosing-an-api": "https://aifitnessapi.com/picker",
  "building-an-app": "https://aifitnessapi.com/build",
  pricing: "https://aifitnessapi.com/pricing",
};

/** Welcome email, personalized to declared interests. Plain text on purpose —
 *  it reads like a person, lands better, and has nothing to break. */
export function welcomeEmail(firstName: string, interests: string[]) {
  const named = interests.filter((i) => INTEREST_LABELS[i]);
  const interestLine =
    named.length > 0
      ? `You said you're interested in ${named
          .map((i) => INTEREST_LABELS[i])
          .join(", ")} — start here:\n\n${named
          .map((i) => `  ${INTEREST_LABELS[i]}: ${INTEREST_LINKS[i]}`)
          .join("\n")}`
      : `Not sure where to start? The interactive picker narrows 190+ guides down to your situation: https://aifitnessapi.com/picker`;

  return {
    subject: "Welcome — here's where to start",
    text: `Hi ${firstName},

Thanks for signing up to AIFitnessAPI. We write independent, primary-source
guides for people building health and fitness products — what the docs
actually say, what we could not verify, and what we'd build.

${interestLine}

Two free tools you might use this week:
  Which fitness API should I use?  https://aifitnessapi.com/picker
  HealthKit <-> Health Connect type reference  https://aifitnessapi.com/matrix

You'll hear from us when there's something worth your time — new deep
dives, API deprecations that affect builders, and what changed. No spam.
Reply to this email any time; a human reads it.

— AIFitnessAPI
https://aifitnessapi.com · unsubscribe: just reply "unsubscribe"`,
  };
}
