import type { Metadata } from "next";
import Container from "@/components/Container";
import { site } from "@/lib/site";

const UPDATED = "2026-07-31";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What AIFitnessAPI collects when you sign up, where it is stored, and how to update or delete it.",
  alternates: { canonical: "/privacy" },
};

/**
 * Short and factual. A site whose content tells builders to be honest about
 * data handling has to be honest about its own — this states exactly what we
 * collect, where it lives, and how to get it removed. Plain-English on
 * purpose; expand only if the data we collect actually expands.
 */
export default function PrivacyPage() {
  return (
    <Container className="py-14">
      <div className="prose prose-neutral mx-auto max-w-2xl dark:prose-invert">
        <h1>Privacy</h1>
        <p className="text-sm text-[var(--muted)]">Last updated {UPDATED}</p>

        <h2>What we collect, and when</h2>
        <p>
          If you sign up for the newsletter, we store what you type into the
          form: your name, email address, country and city, field of work and
          position, and which topics you told us you&rsquo;re interested in.
          Only your first name and email are required — everything else is up
          to you. If you never sign up, we don&rsquo;t store any of this.
        </p>

        <h2>What we use it for</h2>
        <p>
          Two things: sending you the emails you asked for, and understanding
          who reads this site so we can write things that are useful to them.
          We don&rsquo;t sell it, rent it, or share it with anyone else, and we
          don&rsquo;t enrich it with data from other sources.
        </p>

        <h2>Where it lives</h2>
        <p>
          Signup data is stored in Google Cloud Firestore (Firebase), written
          only by our own server — there is no client-side database access.
          Signing up again with the same email updates your existing record
          rather than creating a new one.
        </p>

        <h2>Updating or deleting your info</h2>
        <p>
          Email <a href={`mailto:${site.newsletterMailto}`}>{site.newsletterMailto}</a>{" "}
          from the address you signed up with and ask. We&rsquo;ll update or
          delete your record and confirm when it&rsquo;s done. Every email we
          send also includes an unsubscribe link.
        </p>

        <h2>Analytics</h2>
        <p>
          We keep lightweight, anonymous counts of which calls-to-action get
          clicked (a page identifier and a source label — no names, no emails,
          no cross-site tracking).
        </p>
      </div>
    </Container>
  );
}
