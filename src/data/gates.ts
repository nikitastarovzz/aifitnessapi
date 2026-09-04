/**
 * Reader-facing description of every automated refusal in `scripts/qa.mjs`.
 *
 * One row per failure code the QA gate can emit. `refuses` states, in one
 * sentence, what the build declines to publish when that code fires — written
 * from the check itself, not from the code name.
 *
 * This file is a description of qa.mjs, so it can rot the moment a gate is
 * added or renamed. qa.mjs asserts parity in both directions (GATE-UNDESCRIBED
 * for a live code with no row here, GATE-STALE for a row whose code is gone),
 * which is why the list is allowed to be hand-written at all.
 *
 * `code` values use the same normalisation qa.mjs applies when it extracts
 * them: an interpolated suffix collapses to `*`, so `TITLE-${t.length}`
 * appears here as `TITLE-*`.
 */
export const GATES: { code: string; refuses: string; area: string }[] = [
  // ── Per-page crawl: links, metadata, structured data ──────────────────
  {
    code: "PHANTOM-LINK",
    area: "Links and anchors",
    refuses: "A page carrying an internal link to a URL that no built page answers.",
  },
  {
    code: "TITLE-*",
    area: "Metadata",
    refuses: "A page whose rendered title tag is longer than 60 characters and would be truncated in results.",
  },
  {
    code: "DESC-*",
    area: "Metadata",
    refuses: "A page whose meta description is longer than 155 characters.",
  },
  {
    code: "NO-CANONICAL",
    area: "Metadata",
    refuses: "A page with no rel=canonical link telling crawlers which URL is the real one.",
  },
  {
    code: "NO-OG-IMAGE",
    area: "Metadata",
    refuses: "A page with no og:image, which would share as a blank card everywhere it is linked.",
  },
  {
    code: "BAD-JSON-LD",
    area: "Structured data / GEO",
    refuses: "A page carrying a JSON-LD block that does not parse as JSON.",
  },
  {
    code: "MULTI-BREADCRUMB",
    area: "Structured data / GEO",
    refuses: "A page emitting more than one BreadcrumbList, which makes its breadcrumb trail ambiguous.",
  },
  {
    code: "LINK-TO-404",
    area: "Links and anchors",
    refuses: "A site that links to a route which builds a file but renders notFound() to the reader.",
  },
  {
    code: "ORPHAN",
    area: "Links and anchors",
    refuses: "A published page that no other page on the site links to.",
  },
  {
    code: "DUP-TITLE",
    area: "Metadata",
    refuses: "Two pages shipping the identical title tag, so neither can be told apart in a result list.",
  },
  {
    code: "DUP-DESC",
    area: "Metadata",
    refuses: "Two pages shipping the identical meta description.",
  },
  {
    code: "DUP-FAQ",
    area: "Content integrity",
    refuses: "The same question answered in the FAQ data of two pages, where the two entries would compete in one rich result.",
  },

  // ── Type reference ────────────────────────────────────────────────────
  {
    code: "MATRIX-INCOMPLETE",
    area: "Content integrity",
    refuses: "The HealthKit-to-Health-Connect type table with any row missing its Apple or its Android identifier.",
  },

  // ── Published artifacts ───────────────────────────────────────────────
  {
    code: "DATASET-UNGATED",
    area: "Datasets and artifacts",
    refuses: "A dataset published under /datasets that no check in the QA suite covers.",
  },
  {
    code: "DATASET-MISSING",
    area: "Datasets and artifacts",
    refuses: "A build where a dataset the site advertises has no JSON or no CSV file on disk.",
  },
  {
    code: "DATASET-EMPTY",
    area: "Datasets and artifacts",
    refuses: "A dataset file whose items array is empty, which a generator can produce silently.",
  },
  {
    code: "DATASET-NO-LICENCE",
    area: "Datasets and artifacts",
    refuses: "A dataset published without the licence field that tells a reuser what they may do with it.",
  },
  {
    code: "DATASET-CSV-ROWS",
    area: "Datasets and artifacts",
    refuses: "A dataset whose CSV export carries a different number of rows than its JSON.",
  },
  {
    code: "DATASET-INVALID",
    area: "Datasets and artifacts",
    refuses: "A dataset JSON file that does not parse.",
  },
  {
    code: "KIT-MISSING",
    area: "Datasets and artifacts",
    refuses: "A build where a file in the downloadable decision kit is absent.",
  },
  {
    code: "KIT-EMPTY",
    area: "Datasets and artifacts",
    refuses: "A kit file that exists but is zero bytes.",
  },
  {
    code: "KIT-UNGATED",
    area: "Datasets and artifacts",
    refuses: "A file published under /kit that no check in the QA suite covers.",
  },
  {
    code: "DATASET-NO-MANIFEST",
    area: "Datasets and artifacts",
    refuses: "Datasets published without the manifest that records their hashes and row counts.",
  },
  {
    code: "DATASET-UNMANIFESTED",
    area: "Datasets and artifacts",
    refuses: "A dataset the manifest does not cover, so its changes never show up in the published diff.",
  },
  {
    code: "DATASET-MANIFEST-STALE",
    area: "Datasets and artifacts",
    refuses: "A manifest whose recorded byte sizes disagree with the dataset files actually on disk.",
  },

  // ── API directory ─────────────────────────────────────────────────────
  {
    code: "APIS-COUNT",
    area: "Content integrity",
    refuses: "An API directory with a different number of product pages than there are products in the cost model.",
  },
  {
    code: "APIS-MISSING",
    area: "Content integrity",
    refuses: "A build in which a product named by the cost model has no directory page.",
  },
  {
    code: "APIS-NO-COVERAGE",
    area: "Content integrity",
    refuses: "A directory page that lists no pages covering its product, which is a thin page pretending to be an entity.",
  },
  {
    code: "APIS-NO-ENTITY",
    area: "Structured data / GEO",
    refuses: "A directory page with no SoftwareApplication node identifying the product it describes.",
  },

  // ── Markdown mirrors and llms.txt ─────────────────────────────────────
  {
    code: "GEO-NO-MD-MIRRORS",
    area: "Feeds and mirrors",
    refuses: "A build with no /md markdown mirrors at all, leaving machine readers nothing clean to fetch.",
  },
  {
    code: "GEO-MIRROR-COUNT",
    area: "Feeds and mirrors",
    refuses: "A build where the number of markdown spoke mirrors does not match the number of spoke pages.",
  },
  {
    code: "GEO-HUB-MIRRORS",
    area: "Feeds and mirrors",
    refuses: "A build missing a markdown index for a cluster, or the site index mirror.",
  },
  {
    code: "GEO-MD-FRONTMATTER",
    area: "Feeds and mirrors",
    refuses: "A markdown mirror that does not open with the YAML front matter a parser reads instead of prose.",
  },
  {
    code: "GEO-MD-CANONICAL",
    area: "Feeds and mirrors",
    refuses: "A markdown mirror whose front matter does not name the canonical URL of the page it mirrors.",
  },
  {
    code: "GEO-MD-REWRITE",
    area: "Feeds and mirrors",
    refuses: "A cluster missing from the rewrite list, which would make its conventional /cluster/slug.md addresses 404.",
  },
  {
    code: "GEO-NO-LLMS",
    area: "Feeds and mirrors",
    refuses: "A build with no llms.txt in its output.",
  },
  {
    code: "GEO-LLMS-MISSING",
    area: "Feeds and mirrors",
    refuses: "A spoke page that llms.txt does not list, so a model reading the index never learns it exists.",
  },
  {
    code: "GEO-LLMS-SURFACE",
    area: "Feeds and mirrors",
    refuses: "An llms.txt that fails to advertise the answers, changes and full-text surfaces.",
  },

  // ── Crawler access ────────────────────────────────────────────────────
  {
    code: "GEO-NO-ROBOTS",
    area: "Structured data / GEO",
    refuses: "A build with no robots.txt in its output.",
  },
  {
    code: "GEO-ROBOTS",
    area: "Structured data / GEO",
    refuses: "A robots.txt that does not explicitly allow each named AI crawler.",
  },
  {
    code: "GEO-ROBOTS-SURFACE",
    area: "Structured data / GEO",
    refuses: "A robots.txt that does not point crawlers at llms.txt, answers.json and the changes feed.",
  },

  // ── Structured answer index ───────────────────────────────────────────
  {
    code: "GEO-NO-ANSWERS",
    area: "Structured data / GEO",
    refuses: "A build with no answers.json in its output.",
  },
  {
    code: "GEO-ANSWERS-INVALID",
    area: "Structured data / GEO",
    refuses: "An answers.json that does not parse as JSON.",
  },
  {
    code: "GEO-ANSWERS-COUNT",
    area: "Structured data / GEO",
    refuses: "An answers.json holding a different number of records than there are cluster spokes.",
  },
  {
    code: "GEO-ANSWERS-FIELDS",
    area: "Structured data / GEO",
    refuses: "An answers.json record missing its question, answer, URL, markdown mirror or last-reviewed date.",
  },

  // ── Changes feed ──────────────────────────────────────────────────────
  {
    code: "GEO-NO-CHANGES-FEED",
    area: "Feeds and mirrors",
    refuses: "A build with no changes.xml in its output.",
  },
  {
    code: "GEO-CHANGES-FEED-EMPTY",
    area: "Feeds and mirrors",
    refuses: "A changes feed that contains no items.",
  },

  // ── Derived blocks joined from data ───────────────────────────────────
  {
    code: "REFERENCE-CALLOUT",
    area: "Derived blocks",
    refuses: "A build where the reference callout renders on a different number of guides than the map declares, which is how a renamed slug drops it.",
  },
  {
    code: "APP-STACK",
    area: "Derived blocks",
    refuses: "A build where the derived type-and-API stack block is missing from any /build guide that should carry it.",
  },

  // ── Blog ──────────────────────────────────────────────────────────────
  {
    code: "POST-FRONTMATTER",
    area: "Blog",
    refuses: "A post file with no YAML front matter.",
  },
  {
    code: "POST-NO-TITLE",
    area: "Blog",
    refuses: "A post whose front matter declares no title.",
  },
  {
    code: "POST-TITLE-*",
    area: "Blog",
    refuses: "A post title over 45 characters, which overflows the tab once the site suffix is appended.",
  },
  {
    code: "POST-NO-DESC",
    area: "Blog",
    refuses: "A post whose front matter declares no description.",
  },
  {
    code: "POST-DESC-*",
    area: "Blog",
    refuses: "A post description longer than 155 characters.",
  },
  {
    code: "POST-NO-DATE",
    area: "Blog",
    refuses: "A post with no publication date in its front matter.",
  },
  {
    code: "POST-NO-UPDATED",
    area: "Blog",
    refuses: "A post with no last-updated stamp in its front matter.",
  },
  {
    code: "POST-NOT-BUILT",
    area: "Blog",
    refuses: "A live post that silently stopped building and would be invisible rather than broken.",
  },
  {
    code: "POST-FAQ-RENDER",
    area: "Blog",
    refuses: "A build where the number of posts rendering their FAQ block does not match the number that declare FAQs.",
  },
  {
    code: "POST-PLACE-PARSE",
    area: "Blog",
    refuses: "A build in which the blog placement map cannot be read out of the component source, so neither half of the placement check can run.",
  },
  {
    code: "POST-PLACE-SLUG",
    area: "Blog",
    refuses: "A placement pointing at a post slug that is not a live post.",
  },
  {
    code: "POST-PLACE-PATH",
    area: "Blog",
    refuses: "A placement that would surface a post on a page which does not exist.",
  },
  {
    code: "POST-LINKS",
    area: "Blog",
    refuses: "A build where the blog link block renders on a different set of pages than the placement map declares.",
  },
  {
    code: "POST-EXEMPT-CREEP",
    area: "Blog",
    refuses: "More than two posts opting out of the FAQ requirement, which would turn an announcement exemption into the default.",
  },

  // ── Question indexes ──────────────────────────────────────────────────
  {
    code: "QUESTIONS-HUBS",
    area: "Links and anchors",
    refuses: "A build where a cluster stops generating its /questions index and a whole topic disappears from the list.",
  },
  {
    code: "QUESTIONS-DEAD-ANCHOR",
    area: "Links and anchors",
    refuses: "A question-index deep link whose FAQ anchor no longer exists on the page it points into.",
  },

  // ── HealthKit group pages ─────────────────────────────────────────────
  {
    code: "HK-GROUP-COVERAGE",
    area: "Derived blocks",
    refuses: "A set of HealthKit group pages that does not carry every identifier in the dataset exactly once.",
  },
  {
    code: "HK-GROUP-PARTIAL",
    area: "Derived blocks",
    refuses: "A build where only some of the HealthKit group pages were generated.",
  },

  // ── Tools ─────────────────────────────────────────────────────────────
  {
    code: "TOOLS",
    area: "Content integrity",
    refuses: "A build where an interactive tool page has dropped out, which nothing else would notice because the tools have no data file behind them.",
  },

  // ── Disclosure ────────────────────────────────────────────────────────
  {
    code: "KINESTEX-NOTE",
    area: "Disclosure",
    refuses: "A build where the disclosed first-party link renders on a different number of pages than the map declares.",
  },
  {
    code: "KINESTEX-UNDISCLOSED",
    area: "Disclosure",
    refuses: "A page linking to the site's funder without the funding disclosure beside it.",
  },
  {
    code: "FIRSTPARTY",
    area: "Disclosure",
    refuses: "A page whose prose features the site's funder three or more times with no funding disclosure anywhere on it.",
  },

  // ── Derived metric facts ──────────────────────────────────────────────
  {
    code: "METRIC-FACTS",
    area: "Derived blocks",
    refuses: "A /data guide that quietly lost its derived HealthKit facts block because the join behind it stopped matching.",
  },

  // ── Citation anchors ──────────────────────────────────────────────────
  {
    code: "FACTS-NO-ANSWERS",
    area: "Links and anchors",
    refuses: "A build with no answers.json to resolve published fact citations against.",
  },
  {
    code: "FACTS-ANSWERS-INVALID",
    area: "Links and anchors",
    refuses: "An answers.json that does not parse when the citation anchors are checked.",
  },
  {
    code: "FACTS-MISSING",
    area: "Links and anchors",
    refuses: "An answers.json with no facts section, so the citable fragment URLs are not published at all.",
  },
  {
    code: "FACTS-NO-FRAGMENT",
    area: "Links and anchors",
    refuses: "A published fact whose id has no fragment, leaving nothing precise for a machine reader to cite.",
  },
  {
    code: "FACTS-NO-PAGE",
    area: "Links and anchors",
    refuses: "A published fact pointing at a page that is not in the build output.",
  },
  {
    code: "FACTS-DEAD-ANCHOR",
    area: "Links and anchors",
    refuses: "A published fact whose fragment does not resolve on the page it points into, which would break every citation already made to it.",
  },

  // ── Calendar feed ─────────────────────────────────────────────────────
  {
    code: "ICS-MISSING",
    area: "Feeds and mirrors",
    refuses: "A build with no changes calendar in its output.",
  },
  {
    code: "ICS-EMPTY",
    area: "Feeds and mirrors",
    refuses: "A changes calendar containing no events.",
  },
  {
    code: "ICS-PARITY",
    area: "Feeds and mirrors",
    refuses: "A changes calendar holding a different number of events than the changes feed holds items.",
  },
  {
    code: "ICS-UNTERMINATED",
    area: "Feeds and mirrors",
    refuses: "A calendar file with no END:VCALENDAR, which a strict client will reject outright.",
  },
  {
    code: "ICS-FOLD",
    area: "Feeds and mirrors",
    refuses: "A calendar file with lines over the 75-octet limit the format allows.",
  },
  {
    code: "ICS-LINE-ENDINGS",
    area: "Feeds and mirrors",
    refuses: "A calendar file that is not CRLF-terminated as the format requires.",
  },

  // ── Per-page GEO invariants on hubs and spokes ────────────────────────
  {
    code: "GEO-NO-MD-ALT",
    area: "Structured data / GEO",
    refuses: "A hub or spoke with no rel=alternate link advertising its markdown mirror.",
  },
  {
    code: "GEO-NO-DESCRIBEDBY",
    area: "Structured data / GEO",
    refuses: "A hub or spoke with no rel=describedby link to its structured description.",
  },
  {
    code: "GEO-NO-COLLECTIONPAGE",
    area: "Structured data / GEO",
    refuses: "A cluster hub with no CollectionPage or ItemList describing what it collects.",
  },
  {
    code: "GEO-NO-FAQPAGE",
    area: "Structured data / GEO",
    refuses: "A spoke page with no FAQPage data, unless it is a post that explicitly opted out.",
  },
  {
    code: "GEO-NO-SPEAKABLE",
    area: "Structured data / GEO",
    refuses: "A spoke page that names no speakable section for voice and assistant surfaces.",
  },
  {
    code: "GEO-NO-TECHARTICLE",
    area: "Structured data / GEO",
    refuses: "A spoke page with no TechArticle node identifying it as documentation.",
  },
  {
    code: "GEO-NO-FAQ-ANCHOR",
    area: "Structured data / GEO",
    refuses: "A page publishing FAQ data whose answers carry no per-answer anchor, so an assistant cannot deep link the one it quoted.",
  },

  // ── Discovery surfaces ────────────────────────────────────────────────
  {
    code: "FEED-COUNT",
    area: "Feeds and mirrors",
    refuses: "A build with a different number of per-cluster RSS feeds than there are populated clusters.",
  },
  {
    code: "FEED-EMPTY",
    area: "Feeds and mirrors",
    refuses: "A cluster feed that contains no items.",
  },
  {
    code: "FEED-NO-SELF",
    area: "Feeds and mirrors",
    refuses: "A cluster feed with no self link, so readers cannot tell where it lives.",
  },
  {
    code: "FEED-UNESCAPED-AMP",
    area: "Feeds and mirrors",
    refuses: "A feed containing a raw ampersand outside CDATA, which breaks strict readers.",
  },
  {
    code: "FEED-NO-JSON",
    area: "Feeds and mirrors",
    refuses: "A build with no feed.json in its output.",
  },
  {
    code: "FEED-JSON-VERSION",
    area: "Feeds and mirrors",
    refuses: "A feed.json that declares no JSON Feed version, so conforming clients will not read it.",
  },
  {
    code: "FEED-JSON-ITEMS",
    area: "Feeds and mirrors",
    refuses: "A feed.json with no items array.",
  },
  {
    code: "FEED-JSON-INVALID",
    area: "Feeds and mirrors",
    refuses: "A feed.json that does not parse.",
  },
  {
    code: "NO-OPENSEARCH",
    area: "Feeds and mirrors",
    refuses: "A build with no OpenSearch descriptor in its output.",
  },
  {
    code: "OPENSEARCH-TARGET",
    area: "Feeds and mirrors",
    refuses: "An OpenSearch descriptor that does not point at the site's own results page.",
  },
  {
    code: "NO-MANIFEST",
    area: "Feeds and mirrors",
    refuses: "A build with no web app manifest in its output.",
  },
  {
    code: "MANIFEST-FIELDS",
    area: "Feeds and mirrors",
    refuses: "A web app manifest missing its name, start URL or icons.",
  },
  {
    code: "MANIFEST-INVALID",
    area: "Feeds and mirrors",
    refuses: "A web app manifest that does not parse as JSON.",
  },

  // ── This page ─────────────────────────────────────────────────────────
  {
    code: "GATE-UNDESCRIBED",
    area: "Content integrity",
    refuses: "A gate that exists in the build but is described nowhere on this page, which would make the published list an understatement.",
  },
  {
    code: "GATE-STALE",
    area: "Content integrity",
    refuses: "A row on this page describing a gate the build no longer runs.",
  },
  {
    code: "GATE-PAGE-MISSING",
    area: "Content integrity",
    refuses: "A build where this page did not render its table of gates at all.",
  },
  {
    code: "GATE-PAGE-ROWS",
    area: "Content integrity",
    refuses: "A rendered gates table holding a different number of rows than there are described gates.",
  },
  {
    code: "ARCH-DIAGRAM",
    area: "Derived blocks",
    refuses: "An /architecture page publishing without its hand-drawn mechanism figure.",
  },
  {
    code: "ARCH-DIAGRAM-LEAK",
    area: "Derived blocks",
    refuses: "The architecture diagram marker appearing on any page outside the /architecture cluster.",
  },
];

/** Group order on /gates. Every area used above must appear here. */
export const GATE_AREAS = [
  "Content integrity",
  "Links and anchors",
  "Metadata",
  "Structured data / GEO",
  "Feeds and mirrors",
  "Datasets and artifacts",
  "Disclosure",
  "Blog",
  "Derived blocks",
] as const;
