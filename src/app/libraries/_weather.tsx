import { LIBRARY_WEATHER, LIBRARY_WEATHER_KEYWORDS, LIBRARY_WEATHER_WINDOWS, type LibraryWeather } from "@/data/libraryWeather";

/**
 * The "Weather" box on /libraries/<slug> for the Python clients of vendor
 * cloud APIs: issues opened on the repository in the last 14 and 90 days whose
 * title mentions signing in or being blocked, the newest one, and the latest
 * release. From src/data/libraryWeather.ts (scripts/fetch-library-weather.mjs,
 * weekly). Every number is a count of issue titles, and the box says so.
 */

export function libraryWeather(slug: string): LibraryWeather | undefined {
  return LIBRARY_WEATHER.find((w) => w.slug === slug);
}

const issues = (n: number) => `${n} auth-related ${n === 1 ? "issue" : "issues"}`;
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export function LibraryWeatherBox({ w }: { w: LibraryWeather }) {
  const { short, long } = LIBRARY_WEATHER_WINDOWS;
  const n = w.newestAuthRelated;
  return (
    <aside
      id="weather"
      aria-labelledby="weather-heading"
      data-library-weather={`${w.slug}:${w.authRelated.short}/${w.authRelated.long}`}
      className="mt-10 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <h2 id="weather-heading" className="text-lg font-bold tracking-tight text-[var(--fg)]">
        Weather: reported sign-in trouble
      </h2>
      <p className="mt-2 text-[var(--fg)]">
        <strong>{issues(w.authRelated.short)}</strong>
        {` opened in the last ${short} days (${w.authRelated.long} in ${long}), out of ${w.opened.short} and ${w.opened.long} issues opened on `}
        <a href={w.issuesUrl} className={linkCls} rel="noopener">
          {w.repo}
        </a>
        {` in those windows.`}
      </p>
      <p className="mt-2 text-sm text-[var(--fg)]">
        {n ? (
          <>
            {"Newest such issue: "}
            <a href={n.url} className={linkCls} rel="noopener">
              {`#${n.number} ${n.title}`}
            </a>
            {` (opened ${n.createdOn}; matched ${n.matched.join(", ")}).`}
          </>
        ) : (
          `No issue opened in the last ${long} days has a matching title.`
        )}
      </p>
      <p className="mt-2 text-sm text-[var(--fg)]">
        {w.latestRelease ? (
          <>
            {"Latest GitHub release: "}
            <a href={w.latestRelease.url} className={linkCls} rel="noopener">
              {w.latestRelease.tag}
            </a>
            {`, published ${w.latestRelease.publishedOn}.`}
          </>
        ) : (
          "The repository has published no GitHub release."
        )}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {`This is a signal of reported breakage, not proof the library is broken: an issue is one person's report, and a title can match a keyword without being about sign-in at all. ` +
          `Counted from GitHub's REST API on ${w.asOf}: issues only (no pull requests) opened on or after ${w.since.short} and ${w.since.long}, whose title contains, at the start of a word and ignoring case, one of: ${LIBRARY_WEATHER_KEYWORDS.join(", ")} ("auth" does not count "author"). ` +
          `Bodies and comments are not read. Refreshed weekly.`}
      </p>
    </aside>
  );
}
