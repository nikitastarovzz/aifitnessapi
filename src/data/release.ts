/**
 * Release gate. Only slugs in this Set are built + revealed (generateStaticParams
 * filters to it, the hub lists only these). Ship machinery in one PR, reveal
 * content in batches by adding slugs here. Unreleased pages earn nothing —
 * don't sit on finished content.
 */
export const RELEASED_FITNESS_APIS = new Set<string>([
  "exercise-database-apis",
  "wearable-data-apis",
  "health-data-aggregator-apis",
  "ai-workout-tracking-apis",
  "nutrition-apis",
  "free-fitness-apis",
  "apple-healthkit-vs-google-health-connect",
  "terra-vs-vital",
  "fitbit-api-vs-garmin-api",
  "fitness-api-vs-build-your-own",
]);
