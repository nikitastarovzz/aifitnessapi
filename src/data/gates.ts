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
    code: "SITEMAP-NOINDEX",
    area: "Hosting and crawl",
    refuses:
      "A route listed in sitemap.xml whose own HTML says noindex. The two are contradictory instructions — the sitemap asks a crawler to index what the page tells it to skip — and the contradiction is easy to create, because noindexing a page and de-listing it are edits in different files.",
  },
  {
    code: "CANNIBAL-QUERY",
    area: "Search",
    refuses:
      "Two released entries claiming the same primaryQuery. Pages that bid against each other split their own impressions — a query spread over thirteen of our URLs left every one of them stuck between position 40 and 90 — and the clash is invisible from inside either entry file.",
  },
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
    code: "OG-URL-MISMATCH",
    area: "Metadata",
    refuses: "A page whose og:url names a different address from its rel=canonical, so a share and a search result credit two different URLs.",
  },
  {
    code: "NO-OG-URL",
    area: "Metadata",
    refuses: "An indexable page that names a canonical but no og:url, so a share of it carries no address of its own.",
  },
  {
    code: "NOTFOUND-ROBOTS",
    area: "Metadata",
    refuses: "A 404 page carrying anything other than exactly one robots meta tag, and that one saying noindex.",
  },
  {
    code: "NOTFOUND-CANONICAL",
    area: "Metadata",
    refuses: "A 404 page that names a canonical or og:url, which would point every unknown address at a real page.",
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
    code: "FRAGMENT-NO-PAGE",
    area: "Links and anchors",
    refuses: "An internal link carrying a #fragment whose page is not built or renders notFound(), which the plain broken-link check never sees.",
  },
  {
    code: "FRAGMENT-DEAD",
    area: "Links and anchors",
    refuses: "An internal link whose #fragment matches no element id on the built page it points into, so the reader lands at the top instead of on the row or answer promised.",
  },
  {
    code: "HUB-LINK",
    area: "Links and anchors",
    refuses: "A section hub that does not link every released page in its section, or a section whose hub was not built.",
  },
  {
    code: "VENDOR-HUB-PAGE",
    area: "Links and anchors",
    refuses:
      "A vendor menu whose list names a page that does not build or renders a 404, a hub other than the vendor's integration guide (or, where it has none, its directory entry), or fewer than three pages.",
  },
  {
    code: "VENDOR-HUB-MENU",
    area: "Links and anchors",
    refuses: "A page listed as being about a vendor that does not render the vendor's menu, or a vendor's hub that does not carry it at the top.",
  },
  {
    code: "VENDOR-HUB-LINK",
    area: "Links and anchors",
    refuses: "A vendor's hub that does not link every page listed as being about that vendor.",
  },
  {
    code: "VENDOR-HUB-LABEL",
    area: "Links and anchors",
    refuses: "A vendor menu entry whose text differs from the H1 of the page it links to.",
  },
  {
    code: "VENDOR-HUB-UNLISTED",
    area: "Links and anchors",
    refuses:
      "A page whose address names a vendor that has a menu, or a library whose registry description names one, left off that vendor's list. Such a page would compete with the vendor's hub for its searches instead of linking to it.",
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

  // ── The public API and the MCP endpoint ───────────────────────────────
  {
    code: "API-OPENAPI",
    area: "Datasets and artifacts",
    refuses:
      "A build whose /api/v1/openapi.json is missing, is not OpenAPI 3.1, documents a path outside /api/v1, or describes an item path without listing the ids it serves, which would leave its promised URLs uncheckable.",
  },
  {
    code: "API-NOT-BUILT",
    area: "Datasets and artifacts",
    refuses: "An API path the OpenAPI document promises that the build did not write, or wrote as anything other than a 200 JSON response.",
  },
  {
    code: "API-UNDOCUMENTED",
    area: "Datasets and artifacts",
    refuses: "An /api/v1 response the OpenAPI document does not describe, which no client reading the document would ever find.",
  },
  {
    code: "API-HEADERS",
    area: "Datasets and artifacts",
    refuses: "An API response served without Access-Control-Allow-Origin: *, a Cache-Control max-age, or the noindex that keeps machine files out of search results.",
  },
  {
    code: "API-ENVELOPE",
    area: "Datasets and artifacts",
    refuses: "An API response without its CC BY 4.0 licence, its attribution, its source page, or a verified date that says what it means.",
  },
  {
    code: "API-SOURCE-DEAD",
    area: "Datasets and artifacts",
    refuses: "An API response whose source link points at a page the build did not produce, or at an anchor that page does not have.",
  },
  {
    code: "API-ROWS",
    area: "Datasets and artifacts",
    refuses:
      "An API collection that serves a different number of rows than its dataset holds, beyond the ones it lists as excluded with a reason, or a row without its own item URL.",
  },
  {
    code: "API-UNADVERTISED",
    area: "Datasets and artifacts",
    refuses:
      "An API or MCP endpoint that llms.txt, robots.txt or the /developers page fails to name, so an agent or a developer could not discover it.",
  },
  {
    code: "MCP-ROUTE",
    area: "Datasets and artifacts",
    refuses: "A hosted MCP endpoint that is missing, prerendered instead of answered per request, or allowed to run longer than ten seconds.",
  },
  {
    code: "MCP-TOOLS",
    area: "Datasets and artifacts",
    refuses:
      "An MCP tool not annotated read-only, or one whose answer over the published datasets drops the source line or cites a dataset that is not published.",
  },
  {
    code: "MCP-SERVER-JSON",
    area: "Datasets and artifacts",
    refuses:
      "An MCP Registry entry that disagrees with the package it describes: another name, version or URL, a description over the registry's 100 characters, or a package that would ship without its data.",
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
    code: "GEO-MD-ALT-LOOP",
    area: "Feeds and mirrors",
    refuses: "A response-header rule that matches a markdown mirror's own address and advertises a .md.md alternate for it, a URL that does not exist.",
  },
  {
    code: "GEO-MD-LINK-SHADOWED",
    area: "Feeds and mirrors",
    refuses: "A response-header rule that sets a Link header on a markdown mirror's address, replacing the canonical the mirror sends for itself.",
  },
  {
    code: "GEO-MD-LINK-CANONICAL",
    area: "Feeds and mirrors",
    refuses: "A markdown mirror whose Link header is not one canonical-plus-llms.txt value naming the same URL as its front matter and its HTML page.",
  },
  {
    code: "GEO-ALT-HEADER",
    area: "Feeds and mirrors",
    refuses: "A spoke or blog post whose HTTP Link header does not name its own markdown mirror and llms.txt, or a hub or the homepage whose header does not name llms.txt.",
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
  {
    code: "JSX-ENTITY-SPACE",
    area: "Content integrity",
    refuses: "A JSX text run that follows an expression or a tag, starts with a space, contains an HTML entity and spans lines. Next's compiler drops that space, so the page shows the words glued together; 69 such runs were found on 2026-10-12.",
  },
  {
    code: "MACHINE-FILE-INDEXABLE",
    area: "Structured data / GEO",
    refuses: "An /opensearch.xml served without an X-Robots-Tag: noindex header. Google once listed the browser search descriptor in its results as if it were a page.",
  },
  {
    code: "GEO-ROBOTS-HOST",
    area: "Structured data / GEO",
    refuses: "A robots.txt carrying a Host: line, a second statement of the canonical host outside the one place it is set.",
  },
  {
    code: "GEO-ROBOTS-UNIFORM",
    area: "Structured data / GEO",
    refuses: "A robots.txt with no catch-all group, or with any crawler group whose Allow and Disallow rules differ from the catch-all's.",
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

  // ── Generated references (GROWTH-OCT-2026-B) ──────────────────────────
  {
    code: "HC-RECORD-COVERAGE",
    area: "Derived blocks",
    refuses: "A Health Connect record reference with fewer than the 42 record classes the generator guarantees, a generated record without its own page, a record page missing its record marker, or a hub that does not link every record page.",
  },
  {
    code: "HC-PERM-ON-PAGE",
    area: "Derived blocks",
    refuses: "A Health Connect record page that does not show every read and write permission string the generated data gives that record.",
  },
  {
    code: "HC-PERMISSION-ROWS",
    area: "Derived blocks",
    refuses: "A Health Connect permissions page that renders a different set of android.permission.health rows than the generated framework permission list, or a list shorter than the 219 strings the generator guarantees.",
  },
  {
    code: "LIBS-ROWS",
    area: "Derived blocks",
    refuses: "An open-source library dataset whose row count differs from the count its generator declares, a package or comparison without a built page, or a /libraries hub that does not link all of them.",
  },
  {
    code: "LIBS-FRESH",
    area: "Derived blocks",
    refuses: "Library pages whose registry facts were read more than 45 days ago, which means the weekly refresh has stopped running.",
  },
  {
    code: "AUDIO-EVIDENCE",
    area: "Content integrity",
    refuses: "An audio-coaching page that names a cross-platform framework whose documentation could not be verified, links outside Apple's and Google's developer documentation, or carries a source not checked on the date the page was last updated.",
  },
  {
    code: "ERROR-CODES-ROWS",
    area: "Derived blocks",
    refuses: "A Health Connect error-code page missing a row for any generated HealthConnectException constant, a generated list shorter than nine constants, or an error-code hub that was not built.",
  },
  {
    code: "HC-RELEASES-ROWS",
    area: "Derived blocks",
    refuses: "A Health Connect SDK release page missing any generated connect-client release, or a generated release list shorter than 32 entries.",
  },
  {
    code: "HK-METADATA-ROWS",
    area: "Derived blocks",
    refuses: "A HealthKit metadata-key page missing a row for any generated HKMetadataKey constant, a generated list shorter than the 67 keys Apple's collection held, or a page that was not built.",
  },
  {
    code: "HK-METADATA-EVIDENCE",
    area: "Derived blocks",
    refuses: "A metadata key whose derived value type is published without the sentence it was read from, whose sentence is not Apple's own abstract or discussion text, or whose row does not show the type and the sentence together.",
  },
  {
    code: "WEAR-DATATYPE-ROWS",
    area: "Derived blocks",
    refuses: "A Wear OS data-type page missing a row for any generated Health Services DataType constant, a generated list shorter than the 65 constants Google's reference held, or a page that was not built.",
  },
  {
    code: "WEAR-DATATYPE-PERMS",
    area: "Derived blocks",
    refuses: "Fewer than 26 Wear OS data types carrying the permission Google's permissions table lists, or a row that does not show its permission (or say the table does not name it).",
  },
  {
    code: "WEAR-DATATYPE-EVIDENCE",
    area: "Derived blocks",
    refuses: "A Wear OS data type whose permission is published without the permissions-table row it was read from, or whose row is not one of Google's table rows naming that constant under that permission.",
  },
  {
    code: "POSE-KEYPOINT-ROWS",
    area: "Derived blocks",
    refuses: "A pose keypoint scheme page that was not built, or that is missing the row for any point of the generated scheme or shows a name other than the one its source spells; or a generated module with fewer than the nine schemes read on 2026-10-17.",
  },
  {
    code: "POSE-KEYPOINT-CROSSWALK",
    area: "Derived blocks",
    refuses: "A /pose-keypoints hub that was not built, whose crosswalk has no column for one of the schemes, or that is missing a crosswalk row or a cell's link and source spelling.",
  },
  {
    code: "POSE-KEYPOINT-MAPPING",
    area: "Derived blocks",
    refuses: "A crosswalk that joins two points whose names are not identical once lowercased with separators removed, names a point its scheme does not have, holds a single point, or leaves out a name two schemes share — the one rule that lets the pages map keypoints without guessing.",
  },
  {
    code: "GHAPI-TYPE-COVERAGE",
    area: "Derived blocks",
    refuses: "A Google Health API reference with fewer than the 44 data types the generator guarantees, a generated data type without its own page, a page missing its data-type marker, or a hub that was not built.",
  },
  {
    code: "GHAPI-HUB-TABLE",
    area: "Derived blocks",
    refuses: "A Google Health API hub whose data-type table has no row linking one of the generated data types.",
  },
  {
    code: "GHAPI-TYPE-FACTS",
    area: "Derived blocks",
    refuses: "A Google Health API data-type page that does not show every operation Google's table lists for the type, with its documented request path, and every scope URL the generated data gives it.",
  },
  {
    code: "GHAPI-FLAG-SHOWN",
    area: "Derived blocks",
    refuses: "A Google Health API data-type page that shows fewer of the disagreements found between Google's own pages than the generator raised for that type, or a hub that leaves out one that belongs to no data-type page.",
  },
  {
    code: "GHAPI-EVIDENCE",
    area: "Derived blocks",
    refuses: "A Google Health API data type whose derived fields arrive without their evidence: a DataPoint field or rollup matched by a description that does not name the type, a scope URL that is not Google's documented prefix plus the printed suffix, an operation paired with a differently named method without the text that pairs them, or a flag with no quoted source.",
  },
  {
    code: "GHAPI-TOPIC-ROWS",
    area: "Derived blocks",
    refuses: "A Google Health API topic page that was not built or leaves out a row of the generated list it presents: a documented scope, an error reason, a webhook data type, a Fitbit mapping row, or the rate-limits table.",
  },
  {
    code: "MCP-SERVER-ROWS",
    area: "Derived blocks",
    refuses: "A health MCP server directory missing a row for any server the registry generator kept, a generated list below the generator's own floor, or a directory page that was not built.",
  },
  {
    code: "MCP-SERVER-OFFICIAL",
    area: "Derived blocks",
    refuses: "An MCP server labelled official when the generator did not find it under the vendor's own domain namespace, or one marked as the vendor's whose namespace is not the reverse-DNS form of a domain listed for a source it names.",
  },
  {
    code: "MCP-SERVER-EVIDENCE",
    area: "Derived blocks",
    refuses: "An MCP server listed without a matched term, with a match whose text is not in the field it names, or with a row that does not quote the registry description it was kept for.",
  },
  {
    code: "HCAPI-EQUIV-BACKLINK",
    area: "Links and anchors",
    refuses: "A HealthKit query page that the HealthKit-to-Health Connect equivalents page maps, or the /healthkit-queries hub, without a link back to that equivalents page, or an equivalents page that was not built.",
  },

  // ── Per-type reference pages (EXPANSION-3, 2026-10-17) ────────────────
  {
    code: "TYPE-PAGE-RULE",
    area: "Derived blocks",
    refuses: "A page for a HealthKit identifier or a Wear OS data type that fails its thin-page rule — fewer than two evidence-backed facts specific to the type, recomputed by the gate from the generated files rather than trusted from the page code — a type that passes the rule left without a page, or a page whose declared facts differ from the recomputed ones.",
  },
  {
    code: "TYPE-PAGE-EVIDENCE",
    area: "Derived blocks",
    refuses: "A per-type page that counts a fact without rendering the evidence for it in the page text: Apple's abstract or Google's description, the aggregation or unit sentence, the value enum, the read-only sentence, the matrix row and its caveat, the deprecation note, the metadata key, the permissions-table row, the table quirk, or the counterpart and its own description.",
  },
  {
    code: "TYPE-PAGE-UNLINKED",
    area: "Links and anchors",
    refuses: "A HealthKit identifier or Wear OS data-type page that its table page, /healthkit-identifiers or /wear-os-data-types, does not link, or a table page that was not built.",
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

  // ── Hosting and crawl surface ─────────────────────────────────────────
  {
    code: "IMAGE-PROXY-OPEN",
    area: "Hosting and crawl",
    refuses: "A build whose image optimizer is on and allowed to fetch remote images, which lets anyone run resize jobs from any host on the site's compute.",
  },
  {
    code: "DYNAMIC-FALLBACK",
    area: "Hosting and crawl",
    refuses: "A dynamic route that renders parameters it did not prerender, so an unknown address under it is rendered on request instead of answering 404.",
  },
  {
    code: "SITEMAP-MISSING",
    area: "Hosting and crawl",
    refuses: "A build with no sitemap.xml in its output.",
  },
  {
    code: "SITEMAP-NO-PAGE",
    area: "Hosting and crawl",
    refuses: "A sitemap row for an address that no built page answers, or that answers with a 404.",
  },
  {
    code: "SITEMAP-LASTMOD",
    area: "Hosting and crawl",
    refuses: "A sitemap row whose lastmod is missing or differs from the dateModified its page declares in its structured data.",
  },
  {
    code: "SITEMAP-CHANGEFREQ",
    area: "Hosting and crawl",
    refuses: "A sitemap carrying changefreq or priority values, fields that were never facts anyone kept true.",
  },

  // ── Freshness markers ─────────────────────────────────────────────────
  {
    code: "YEAR-MARKER",
    area: "Metadata",
    refuses: "A page whose title or h1 puts a year in parentheses, such as (2026), when that year differs from the year of the newest dateModified in the page's structured data, or when the page declares no dateModified to back it.",
  },
];

/** Group order on /gates. Every area used above must appear here. */
export const GATE_AREAS = [
  "Content integrity",
  // Cross-page search behaviour, as opposed to one page's own metadata: the
  // failures here are only visible when entries are compared with each other.
  "Search",
  "Links and anchors",
  "Metadata",
  "Structured data / GEO",
  "Feeds and mirrors",
  "Datasets and artifacts",
  "Disclosure",
  "Blog",
  "Derived blocks",
  "Hosting and crawl",
] as const;
