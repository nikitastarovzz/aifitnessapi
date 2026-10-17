/**
 * One menu per vendor (ops/EXPANSION-3-2026-10-17.md, item 1.2).
 *
 * Search Console splits "garmin api" between /fix/garmin-api-approval and
 * /integrate/garmin-api, and "fitbit api" across /fitbit-api-shutdown,
 * /integrate/fitbit-api and /migrate/fitbit-web-api-to-google-health, while
 * the page Google mostly shows for "<vendor> api" is the integration guide.
 * So each vendor gets one hub (its /integrate guide, or its /apis directory
 * entry where there is no guide) and every page about the vendor carries the
 * same menu (components/VendorHubMenu), linking the hub and all the others,
 * grouped by what the reader came for. It is the consolidation
 * ops/SERP-30-2026-10-12.md #1 made for "fitness api".
 *
 * Hand-written, and it adds no facts: it names pages that already exist.
 * Each link's text is that page's own H1 (lib/routeLabel) and its group comes
 * from its address (intentOf in lib/vendorMenu), so nothing typed here can
 * disagree with the page it points at.
 *
 * Who belongs. A page is about a vendor when the vendor is its subject, not
 * when it is mentioned:
 *  - its address names the vendor as a whole hyphen-separated word (`tokens`):
 *    "health-connect" is a word of healthkit-vs-health-connect, which so
 *    belongs to both platforms, and "google-fit" is not "fitbit";
 *  - a comparison belongs to every vendor it compares. Apple Watch is filed
 *    under HealthKit, because each Apple Watch comparison says its data is
 *    read through HealthKit;
 *  - a shared pricing page belongs to each vendor it prices by name in its
 *    H1 or capsule, because it is where that vendor's pricing lives here
 *    (and the ExerciseDB one has a section of its own on ExerciseDB plans);
 *  - a /data guide belongs to the platform its H1 names;
 *  - a library belongs to the stores or APIs its generated `wraps` field
 *    names (data/libraries.ts, read from the registry description), and a
 *    library comparison to the vendors of its two packages;
 *  - a roundup of many products belongs to none of them;
 *  - the pages under a listed reference (one per record, type group, iOS
 *    version, query or API method) are reached through that reference.
 *
 * Who gets a menu: a vendor with three or more pages; below that a menu is a
 * link to the directory entry and back. Polar (a guide and its entry),
 * Withings (one library), wger, USDA FoodData Central, Open Food Facts, Sency,
 * QuickPose, MediaPipe, MoveNet and Apple Vision have fewer. KinesteX has five
 * and gets none: the funder of this site would be the only motion vendor with
 * a menu, and it would sit on the comparison pages of competitors who have
 * none of their own (ops/GEO.md: never tilt the site toward our own product).
 *
 * Google Fit is filed under Health Connect, the on-device successor every
 * Google Fit page on the site points to; it has no guide or directory entry
 * of its own to be a hub.
 *
 * The lists are explicit so the menu can be reviewed line by line, and qa
 * holds them to the build (the VENDOR-HUB gates): every page built, every page
 * carrying its menu, the hub linking all of them, each link reading its page's
 * H1, and no page in the menu's sections whose address names a vendor (or
 * library whose `wraps` names it) left off the vendor's list.
 */

export type VendorHub = {
  /** The product's id in data/apis.ts, which supplies its name. */
  id: string;
  /** The menu's home: the /integrate guide where the vendor has one, else its /apis entry. */
  hub: string;
  /** Whole hyphen-separated words in an address that make the page this vendor's. */
  tokens: string[];
  /** Values of a library's generated `wraps` field that mean this vendor. */
  wraps: string[];
  /** Every page about the vendor, hub included, in reading order within each group. */
  pages: string[];
};

export const VENDOR_HUBS: VendorHub[] = [
  {
    id: "garmin",
    hub: "/integrate/garmin-api",
    tokens: ["garmin"],
    wraps: ["Garmin Connect"],
    pages: [
      "/integrate/garmin-api",
      "/pricing/garmin-api-pricing",
      "/alternatives/garmin-api-alternatives",
      "/fitness-apis/garmin-connect-iq-vs-health-api",
      "/fitness-apis/fitbit-api-vs-garmin-api",
      "/compare/strava-vs-garmin-connect",
      "/compare/whoop-vs-garmin",
      "/compare/apple-watch-vs-garmin",
      "/fix/garmin-api-approval",
      "/libraries/garminconnect",
      "/libraries/garth",
      "/libraries/compare/garminconnect-vs-garth",
      "/apis/garmin",
    ],
  },
  {
    id: "fitbit",
    hub: "/integrate/fitbit-api",
    tokens: ["fitbit"],
    wraps: ["Fitbit Web API"],
    pages: [
      "/integrate/fitbit-api",
      "/pricing/fitbit-api-pricing",
      "/alternatives/fitbit-api-alternatives",
      "/fitness-apis/fitbit-api-vs-garmin-api",
      "/compare/fitbit-vs-oura",
      "/compare/fitbit-vs-apple-watch",
      "/fix/fitbit-api-429-rate-limit",
      "/fix/fitbit-error-code-401",
      "/libraries/python-fitbit",
      "/fitbit-api-shutdown",
      "/migrate/fitbit-web-api-to-google-health",
      "/migrate/fitbit-research-studies-after-turndown",
      // The Google Health API section (EXPANSION-3 item 1.1) is being built in
      // parallel. When it lands, add its hub and its Fitbit Web API mapping
      // page here, after the two migration guides above. intentOf files a
      // page by its address, so give the mapping page an entry in its
      // INTENT_OF_PAGE (lib/vendorMenu) to show it under Migration.
      "/apis/fitbit",
    ],
  },
  {
    id: "strava",
    hub: "/integrate/strava-api",
    tokens: ["strava"],
    wraps: ["Strava API"],
    pages: [
      "/integrate/strava-api",
      "/pricing/strava-api-pricing",
      "/alternatives/strava-api-alternatives",
      "/compare/strava-vs-garmin-connect",
      "/fix/strava-api-401-unauthorized",
      "/fix/strava-webhook-not-firing",
      "/libraries/stravalib",
      "/migrate/adapt-to-strava-api-changes",
      "/apis/strava",
    ],
  },
  {
    id: "whoop",
    hub: "/integrate/whoop-api",
    tokens: ["whoop"],
    wraps: [],
    pages: [
      "/integrate/whoop-api",
      "/pricing/whoop-api-pricing",
      "/alternatives/whoop-api-alternatives",
      "/compare/oura-vs-whoop",
      "/compare/whoop-vs-garmin",
      "/compare/apple-watch-vs-whoop",
      "/apis/whoop",
    ],
  },
  {
    id: "oura",
    hub: "/integrate/oura-api",
    tokens: ["oura"],
    wraps: ["Oura API"],
    pages: [
      "/integrate/oura-api",
      "/pricing/oura-api-pricing",
      "/alternatives/oura-api-alternatives",
      "/compare/oura-vs-whoop",
      "/compare/fitbit-vs-oura",
      "/fix/oura-personal-access-token-deprecated",
      "/libraries/oura-ring",
      "/libraries/oura-python",
      "/libraries/compare/oura-ring-vs-oura-python",
      "/apis/oura",
    ],
  },
  {
    id: "healthkit",
    hub: "/integrate/healthkit",
    tokens: ["healthkit"],
    wraps: ["Apple HealthKit"],
    pages: [
      "/integrate/healthkit",
      "/alternatives/healthkit-alternatives",
      "/fitness-apis/apple-healthkit-vs-google-health-connect",
      "/health-connect-api/healthkit-vs-health-connect-api-equivalents",
      "/compare/fitbit-vs-apple-watch",
      "/compare/apple-watch-vs-garmin",
      "/compare/apple-watch-vs-whoop",
      "/healthkit-errors",
      "/error-codes",
      "/fix/healthkit-no-data",
      "/fix/healthkit-authorization-denied",
      "/fix/healthkit-authorization-not-determined",
      "/fix/healthkit-required-authorization-denied",
      "/fix/healthkit-background-delivery-not-working",
      "/fix/healthkit-database-inaccessible",
      "/fix/healthkit-health-data-unavailable",
      "/fix/healthkit-data-restricted-mdm",
      "/fix/healthkit-error-no-data",
      "/fix/healthkit-invalid-argument",
      "/fix/healthkit-workout-session-errors",
      "/fix/healthkit-guest-user-mode",
      "/fix/healthkit-undocumented-errors",
      "/libraries/react-native-health",
      "/libraries/kingstinct-react-native-healthkit",
      "/libraries/compare/react-native-health-vs-kingstinct-react-native-healthkit",
      "/libraries/capacitor-health",
      "/libraries/capgo-capacitor-health",
      "/libraries/compare/capacitor-health-vs-capgo-capacitor-health",
      "/libraries/perfood-capacitor-healthkit",
      "/libraries/cordova-plugin-health",
      "/libraries/flutter-health",
      "/libraries/health-connector",
      "/libraries/compare/flutter-health-vs-health-connector",
      "/libraries/health-kit-reporter",
      "/migrate/add-android-to-healthkit-app",
      "/healthkit",
      "/healthkit-identifiers",
      "/healthkit-units",
      "/healthkit-category-values",
      "/healthkit-metadata-keys",
      "/healthkit-versions",
      "/healthkit-status",
      "/healthkit-queries",
      "/matrix",
      "/data/clinical-records-api",
      "/data/medications-api",
      "/data/mental-health-assessments-api",
      "/data/state-of-mind-api",
      "/data/resting-heart-rate-api",
      "/apis/healthkit",
    ],
  },
  {
    id: "health-connect",
    hub: "/integrate/google-health-connect",
    tokens: ["health-connect", "google-fit"],
    wraps: ["Health Connect", "Google Fit"],
    pages: [
      "/integrate/google-health-connect",
      "/alternatives/google-fit-api-alternatives",
      "/fitness-apis/apple-healthkit-vs-google-health-connect",
      "/health-connect-api/healthkit-vs-health-connect-api-equivalents",
      "/error-codes/health-connect",
      "/error-codes",
      "/fix/health-connect-no-data",
      "/fix/health-connect-securityexception",
      "/fix/health-connect-not-available",
      "/fix/health-connect-changes-token-expired",
      "/fix/health-connect-rate-limit",
      "/fix/google-fit-api-deprecated",
      "/libraries/react-native-health-connect",
      "/libraries/expo-health-connect",
      "/libraries/react-native-google-fit",
      "/libraries/capacitor-health",
      "/libraries/capgo-capacitor-health",
      "/libraries/compare/capacitor-health-vs-capgo-capacitor-health",
      "/libraries/cordova-plugin-health",
      "/libraries/flutter-health",
      "/libraries/health-connector",
      "/libraries/compare/flutter-health-vs-health-connector",
      "/libraries/flutter-health-connect",
      "/migrate/google-fit-to-health-connect",
      "/migrate/add-android-to-healthkit-app",
      "/google-fit-shutdown",
      "/health-connect",
      "/health-connect/permissions",
      "/health-connect/aggregate-metrics",
      "/health-connect-api",
      "/health-connect-releases",
      "/matrix",
      "/data/health-connect-medical-records-api",
      "/data/resting-heart-rate-api",
      "/apis/health-connect",
    ],
  },
  {
    id: "terra",
    hub: "/integrate/terra-api",
    tokens: ["terra"],
    wraps: [],
    pages: [
      "/integrate/terra-api",
      "/pricing/health-data-aggregator-pricing",
      "/alternatives/terra-alternatives",
      "/fitness-apis/terra-vs-vital",
      "/compare/terra-vs-rook",
      "/compare/terra-vs-spike",
      "/apis/terra",
    ],
  },
  {
    id: "junction",
    hub: "/apis/junction",
    tokens: ["junction"],
    wraps: [],
    pages: [
      "/apis/junction",
      "/pricing/health-data-aggregator-pricing",
      // Vital is Junction's former name, and the page's H1 says so.
      "/fitness-apis/terra-vs-vital",
    ],
  },
  {
    id: "rook",
    hub: "/apis/rook",
    tokens: ["rook"],
    wraps: [],
    pages: [
      "/apis/rook",
      "/pricing/health-data-aggregator-pricing",
      "/compare/terra-vs-rook",
      "/compare/rook-vs-spike",
    ],
  },
  {
    id: "spike",
    hub: "/apis/spike",
    tokens: ["spike"],
    wraps: [],
    pages: [
      "/apis/spike",
      "/pricing/health-data-aggregator-pricing",
      "/compare/terra-vs-spike",
      "/compare/rook-vs-spike",
    ],
  },
  {
    id: "exercisedb",
    hub: "/integrate/exercisedb-api",
    tokens: ["exercisedb"],
    wraps: [],
    pages: [
      "/integrate/exercisedb-api",
      "/pricing/exercise-database-api-pricing",
      "/alternatives/exercisedb-alternatives",
      "/compare/exercisedb-vs-wger",
      "/apis/exercisedb",
    ],
  },
  {
    id: "nutritionix",
    hub: "/integrate/nutritionix-api",
    tokens: ["nutritionix"],
    wraps: [],
    pages: [
      "/integrate/nutritionix-api",
      "/pricing/nutrition-api-pricing",
      "/alternatives/nutritionix-alternatives",
      "/compare/nutritionix-vs-edamam",
      "/apis/nutritionix",
    ],
  },
  {
    id: "edamam",
    hub: "/apis/edamam",
    tokens: ["edamam"],
    wraps: [],
    pages: [
      "/apis/edamam",
      "/pricing/nutrition-api-pricing",
      "/compare/nutritionix-vs-edamam",
      "/compare/edamam-vs-spoonacular",
    ],
  },
];
