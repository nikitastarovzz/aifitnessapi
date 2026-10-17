import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import PageActions from "@/components/PageActions";
import { GHAPI_FETCHED_ON, GHAPI_FLAGS, GHAPI_PAGES, GHAPI_WEBHOOK_TOKENS, GHAPI_WEBHOOK_TYPES } from "@/data/googleHealthApi";
import { GHAPI_BASE, GHAPI_PATHS, allTypes, fitDescription, fitTitle, getType, joinList, quote, source, typePath } from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../../error-codes/_shared";
import { Blocks, CAPSULE, Code, FetchedLine, FlagList, GoogleSection, H2, LINK, QuotedFrom, SourcesChecked, TH, TopicNav, ghapiGraph } from "../_shared";

/**
 * Google Health API webhooks, from Google's webhooks guide: which data types
 * notify (the guide's list, joined to the data-types table's badge and the
 * token vocabulary), subscribers, the endpoint-verification handshake,
 * automatic and manual subscriptions, the payload, signatures, retries and
 * the common errors. Google's text is quoted section by section.
 */

const PATH = GHAPI_PATHS.webhooks;
const TYPES = GHAPI_WEBHOOK_TYPES;
const TITLE = fitTitle(["Google Health API Webhooks: Subscribers and Notifications", "Google Health API Webhooks"]);
const H1 = "Google Health API webhooks: subscribers, verification and notifications";
const DESCRIPTION = fitDescription([
  `Google Health API webhooks from Google's guide: the ${TYPES.length} data types that notify, subscribers, endpoint verification, payloads, signatures and retries.`,
  `Google Health API webhooks: the ${TYPES.length} data types that notify, subscribers, endpoint verification, payloads and retries.`,
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const plain = (s: string) => s.replace(/`/g, "");
const INTRO = quote("webhooks", null, "receive real-time notifications");
const RESPOND = quote("webhooks", "respond_to_a_notification", "204 No Content");
const RECOVERY = quote("webhooks", "subscriber_status_and_recovery", "7 days");
const HANDSHAKE = quote("webhooks", "endpoint_verification", "two-step verification handshake");
const AUTH_STEP = quote("webhooks", "endpoint_verification", "Authorized Handshake", true);
const UNAUTH_STEP = quote("webhooks", "endpoint_verification", "Unauthorized Challenge", true);
const SIGNATURE = quote("webhooks", "signature_verification", "GOOGLE-HEALTH-API-SIGNATURE");
const ROTATION = quote("webhooks", "signature_verification", "rotated every 30 days");
const WEBHOOK_FLAGS = GHAPI_FLAGS.filter((f) => /webhook/.test(f.kind));
const systemTokens = GHAPI_WEBHOOK_TOKENS.filter((t) => t.systemEvent);
const BADGED = allTypes()
  .filter((t) => t.webhookSupport)
  .map((t) => t.dataType);
/** Does the data-types table's badge mark exactly the guide's list? */
const AGREE = BADGED.length === TYPES.length && BADGED.every((id) => TYPES.includes(id));

const FAQS: Faq[] = [
  {
    q: "Which data types does the Google Health API send webhooks for?",
    a: `${TYPES.length}, per Google's webhooks guide (last updated ${source("webhooks").lastUpdated}): ${joinList(TYPES)}.${
      AGREE
        ? ` The same ${TYPES.length} carry the Webhook support badge in Google's data-types table.`
        : ` Google's data-types table badges ${BADGED.length} types, which is not the same set; this page lists the differences.`
    }${
      systemTokens.length ? ` The guide's token vocabulary adds ${systemTokens.length} system events: ${joinList(systemTokens.map((t) => t.dataType))}.` : ""
    }`,
  },
  {
    q: "How does Google Health API webhook endpoint verification work?",
    a: `${plain(HANDSHAKE)} ${plain(AUTH_STEP)} ${plain(UNAUTH_STEP)}`,
  },
  {
    q: "What status code should a Google Health API webhook endpoint return?",
    a: `204. Google's webhooks guide: "${plain(RESPOND)}"`,
  },
  {
    q: "How long does the Google Health API retry an undelivered webhook?",
    a: `Up to 7 days. Google's webhooks guide: "${plain(RECOVERY)}" ${plain(quote("webhooks", "subscriber_status_and_recovery", "cannot be recovered"))}`,
  },
  {
    q: "How do you verify a Google Health API webhook signature?",
    a: `${plain(SIGNATURE)} ${plain(ROTATION)} Google recommends verifying it with Tink's PublicKeyVerify primitive and documents a manual path on the same page.`,
  },
];

export default function GhapiWebhooksPage() {
  const url = absoluteUrl(PATH);
  const tokenFor = (id: string) => GHAPI_WEBHOOK_TOKENS.find((t) => t.dataType === id);
  return (
    <Container className="py-14">
      <JsonLd data={ghapiGraph({ path: PATH, title: TITLE, headline: H1, description: DESCRIPTION, sources: ["webhooks", "dataTypes", "discoveryV4", "releaseNotes"] })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: "Webhooks", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={<> · Google’s webhooks guide last updated {source("webhooks").lastUpdated}</>} />

        <p id="answer" className={CAPSULE}>
          Google’s webhooks guide: “{plain(INTRO)}” It lists {TYPES.length} data types that notify. A subscriber’s endpoint
          must pass a two-step verification handshake when it is created or its endpoint changes, answer every notification
          with 204 No Content, and can verify a signature on each; undelivered notifications are retried for up to 7 days.
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />
        <TopicNav current={PATH} />

        <section id="types" className="mt-12 scroll-mt-24">
          <h2 className={H2}>The {TYPES.length} data types that send notifications</h2>
          <p className="mt-2 text-[var(--muted)]">
            The webhooks guide’s list, with the token an automatic subscription’s name carries for each.{" "}
            {AGREE
              ? `The same ${TYPES.length} types carry the Webhook support badge in Google's data-types table.`
              : "The data-types table's Webhook support badge does not mark exactly these types; see the flags below."}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Data type
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Token (automatic subscriptions)
                  </th>
                </tr>
              </thead>
              <tbody>
                {TYPES.map((id) => {
                  const t = getType(id);
                  const tok = tokenFor(id);
                  return (
                    <tr key={id} id={`webhook-${id}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        {t ? (
                          <Link href={typePath(t)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                            {id}
                          </Link>
                        ) : (
                          <Code>{id}</Code>
                        )}
                      </td>
                      <td className="py-2">{tok ? <Code>{tok.token}</Code> : "—"}</td>
                    </tr>
                  );
                })}
                {systemTokens.map((tok) => (
                  <tr key={tok.token} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 text-[var(--muted)]">
                      <Code>{tok.dataType}</Code> (system event)
                    </td>
                    <td className="py-2">
                      <Code>{tok.token}</Code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <GoogleSection page="webhooks" id="notifications_scopes" heading="Which scopes a notification needs" />
          <FlagList flags={WEBHOOK_FLAGS} />
        </section>

        <section id="subscribers" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Subscribers</h2>
          <GoogleSection page="webhooks" id="manage_subscribers" heading="Managing subscribers" childIds={["create_a_subscriber", "list_subscribers", "update_a_subscriber", "delete_a_subscriber"]} />
          <GoogleSection page="webhooks" id="service-accounts" heading="IAM service accounts" />
          <GoogleSection page="webhooks" id="cpe_roles" heading="Roles" />
        </section>

        <section id="verification" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Endpoint verification</h2>
          <GoogleSection page="webhooks" id="endpoint_verification" heading="The handshake" childIds={["key_rotation"]} />
        </section>

        <section id="subscriptions" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Automatic and manual subscriptions</h2>
          <GoogleSection page="webhooks" id="user_subscriptions" heading="User subscriptions" childIds={["automatic_subscriptions", "manual_subscriptions"]} />
        </section>

        <section id="notifications" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Notifications</h2>
          <div className="text-[var(--muted)]">
            <Blocks blocks={GHAPI_PAGES.webhooks.sections.find((s) => s.id === "notifications")?.blocks ?? []} />
          </div>
          <GoogleSection page="webhooks" id="notification-format" heading="The payload" />
          <GoogleSection page="webhooks" id="user-id-mapping" heading="Mapping healthUserId to a user" />
          <GoogleSection page="webhooks" id="time-intervals" heading="Time intervals" />
          <GoogleSection page="webhooks" id="aggregation-of-updates" heading="Batching" />
          <GoogleSection page="webhooks" id="respond_to_a_notification" heading="Responding" />
          <GoogleSection page="webhooks" id="best-practices" heading="Google’s best practices" />
          <GoogleSection page="webhooks" id="signature_verification" heading="Signature verification" childIds={["how_to_verify_the_signature"]} />
        </section>

        <section id="recovery" className="mt-14 scroll-mt-24">
          <h2 className={H2}>When the endpoint is down</h2>
          <GoogleSection page="webhooks" id="subscriber_status_and_recovery" heading="Subscriber status and recovery" />
          <GoogleSection page="webhooks" id="common_errors" heading="Common errors" />
        </section>

        <QuotedFrom page="webhooks" />
        <p className="mt-6 text-[var(--muted)]">
          The subscriber methods in the discovery document, with the rest of the API’s methods:{" "}
          <Link href={`${GHAPI_BASE}#methods`} className={LINK}>
            the methods overview
          </Link>
          . Every error reason Google catalogues:{" "}
          <Link href={GHAPI_PATHS.errors} className={LINK}>
            Google Health API errors
          </Link>
          .
        </p>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="Quoted from Google's webhooks guide, which carries its own last-updated date. Subscribe to hear when a data type gains webhook support or the notification format changes."
          source="spoke-inline"
          id="cta-ghapi-webhooks"
        />

        <SourcesChecked keys={["webhooks", "dataTypes", "discoveryV4", "releaseNotes"]} />
      </div>
    </Container>
  );
}
