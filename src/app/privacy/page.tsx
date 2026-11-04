import type { Metadata } from "next";
import Container from "@/components/Container";
import { site } from "@/lib/site";

const UPDATED = "2026-11-04";

const TITLE = "Privacy";
const DESCRIPTION =
  "What AIFitnessAPI collects when you sign up, where it is stored, and how to update or delete it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/privacy",
    images: ["/opengraph-image"],
  },
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
          We use Vercel Web Analytics to count page views, and send it a few
          events of our own. Our events carry no name and no email, we set no
          cookie for them, and they do not follow you to other sites:
        </p>
        <ul>
          <li>
            <strong>Where your visit came from.</strong> On the first page you
            open in a browser session, your browser sorts the referring site
            and any <code>utm_source</code>{" "}tag in the link into a broad group
            (an AI assistant such as ChatGPT or Perplexity, a search engine,
            another site, or none) and sends that group, a short label for it
            (for example &ldquo;chatgpt&rdquo;, &ldquo;google&rdquo; or the
            referring site&rsquo;s domain) and the page you landed on. The full
            referring address and the rest of the link are not sent. A
            &ldquo;sent&rdquo; flag is kept in your browser&rsquo;s session
            storage so this happens once per session; it is gone when you
            close the tab.
          </li>
          <li>
            <strong>Which calls-to-action get clicked</strong>: an identifier
            for the button or link, where on the page it sits, and the page.
          </li>
          <li>
            <strong>Clicks on links to KinesteX</strong>, the company that
            funds this site: where the link sits and the page. Those links
            also carry <code>utm_</code>{" "}tags naming this site, the link&rsquo;s
            placement and the page, so KinesteX&rsquo;s own analytics can see
            that a visit came from here. Nothing about you is in the tags.
          </li>
        </ul>
        <p>
          None of this runs inside the widgets other sites embed from{" "}
          <code>/embed</code>.
        </p>
      </div>
    </Container>
  );
}
