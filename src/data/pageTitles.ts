/**
 * The H1 of each hand-built page that other pages link to by name.
 *
 * Cluster spokes, library pages and the HealthKit standalone references keep
 * their title in their data entry, so a link built from data can read it
 * there. These pages are written directly as routes and have no entry, so
 * their H1 lives here instead: each page renders its H1 from this map, and
 * lib/routeLabel reads the same string for the links built from data (the
 * vendor menus, the search-demand lists on /apis). A page's name is typed
 * once, and a link to it cannot disagree with the heading it lands on.
 *
 * Change a title here, not in the page.
 */
export const PAGE_H1 = {
  "/fitbit-api-shutdown": "Fitbit Web API Retirement: Deadlines and the Migration Path",
  "/google-fit-shutdown": "Google Fit Is Shutting Down",
  "/matrix": "HealthKit ↔ Health Connect: The Data-Type Reference",
  "/healthkit": "HealthKit, mapped",
  "/healthkit-identifiers": "Every HealthKit type identifier",
  "/healthkit-metadata-keys": "Every HealthKit metadata key",
  "/healthkit-errors": "Every HealthKit error code",
  "/health-connect": "Health Connect record types, every one",
  "/health-connect/permissions": "Every Health Connect permission string",
  "/health-connect/aggregate-metrics": "Every Health Connect aggregate metric",
  "/health-connect-releases": "Health Connect SDK releases",
  "/error-codes": "HealthKit and Health Connect error codes",
  "/error-codes/health-connect": "Health Connect error codes and exceptions",
} as const;
