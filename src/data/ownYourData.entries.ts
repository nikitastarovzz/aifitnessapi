import type { ClusterEntry, SourceCheck } from "@/lib/cluster";
import { LIBRARIES, LIBRARIES_FETCHED_ON } from "./libraries";

/**
 * Cluster entries — how a person exports their own data, per source.
 *
 * Written 2026-11-05 from the vendors' own help-center and developer pages.
 * Apple's iPhone User Guide and Google's Android and Google Health help
 * pages were fetched directly; every other host is blocked from the writing
 * environment and was read through .github/workflows/source-snapshot.yml on
 * the same day. Quoted passages for those pages sit in
 * ops/sources/evidence/own-your-data-<slug>.json and are re-checked by
 * .github/workflows/source-quotes.yml.
 *
 * Library facts (name, registry description, latest version and its date)
 * are rendered from the generated src/data/libraries.ts, never typed here.
 *
 * Order is the hub's reading order: phone platforms first, then wearables
 * and apps alphabetically by vendor.
 */

const CHECKED = "2026-11-05";
const src = (url: string, note: string): SourceCheck => ({ url, checked: CHECKED, note });

function lib(slug: string): string {
  const l = LIBRARIES.find((x) => x.slug === slug);
  if (!l) throw new Error(`ownYourData.entries: no generated library "${slug}"`);
  return `[${l.name}](/libraries/${l.slug}) (${l.ecosystem === "pypi" ? "PyPI" : l.ecosystem}), described by its registry entry as "${l.description}"; latest release ${l.latestVersion}, published ${l.latestPublished} (registry read ${LIBRARIES_FETCHED_ON})`;
}

const APPLE_GUIDE = "https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios";
const HC_HELP = "https://support.google.com/android/answer/15323271?hl=en";
const SAMSUNG_HELP = "https://www.samsung.com/us/support/answer/ANS10001379/";
const GARMIN_DEV = "https://developer.garmin.com/gc-developer-program/overview/";
const GOOGLE_HEALTH_HELP = "https://support.google.com/googlehealth/answer/14236615?hl=en";
const TAKEOUT_HELP = "https://support.google.com/accounts/answer/3024190?hl=en";
const FITBIT_APP_TYPES = "https://dev.fitbit.com/build/reference/web-api/developer-guide/application-design/";
const OURA_HELP = "https://support.ouraring.com/hc/en-us/articles/360025441594-Export-Share-Your-Oura-Data";
const OURA_AUTH = "https://cloud.ouraring.com/docs/authentication";
const POLAR_HELP = "https://support.polar.com/en/how-to-download-all-your-data-from-polar-flow";
const POLAR_ACCESSLINK = "https://www.polar.com/accesslink-api/";
const STRAVA_HELP = "https://support.strava.com/en-us/articles/15401919-how-do-i-export-my-strava-data";
const STRAVA_DEV = "https://developers.strava.com/docs/getting-started/";
const SUUNTO_FAQ = "https://www.suunto.com/Support/faq-articles/suunto-app/what-type-of-files-can-i-export-from-the-suunto-app/";
const COROS_BULK = "https://support.coros.com/hc/en-us/articles/25002333092500-Requesting-a-Bulk-Export-of-COROS-Data";
const COROS_SINGLE = "https://support.coros.com/hc/en-us/articles/360043975752-Exporting-Workout-Data-and-Uploading-to-3rd-Party-Apps";
const GARTH_README = "https://github.com/matin/garth";
const GARMINCONNECT_README = "https://github.com/cyberjunky/python-garminconnect";

export const ownYourDataEntries: ClusterEntry[] = [
  {
    "slug": "apple-health-export",
    "primaryQuery": "how to export Apple Health data",
    "h1": "How to export your Apple Health data, and read the file",
    "metaTitle": "Export Apple Health Data: Steps and the export.xml File",
    metaDescription:
      "Apple's steps for Export All Health Data on iPhone, what the XML archive is, and how to open export.xml in a browser or pandas without uploading it.",
    "updated": CHECKED,
    answer:
      "On iPhone, open the Health app, tap Summary, tap your picture or initials, then tap Export All Health Data and choose how to share the file. Apple's iPhone User Guide says this exports all of your health and fitness data from Health in XML format. Apple's guide describes no web download, and HealthKit is read by apps on the device rather than through a web API. To look inside the file without uploading it, open it in this site's in-browser Apple Health explorer or one of the pandas notebooks linked below.",
    "body": `## Apple's steps

Apple's iPhone User Guide, in its page on sharing health data, puts the export under the profile, not under Settings:

1. Go to the Health app on your iPhone.
2. Tap Summary, then tap your picture or initials.
3. Tap Export All Health Data, then choose a method for sharing your data.

Apple describes the result in one sentence: "You can export all of your health and fitness data from Health in XML format, which is a common format for sharing data between apps." That is everything the guide says about the format. It does not list the files in the archive, the element names, or how long the export takes, and this page does not fill those in from elsewhere.

## Opening the file

Apple's guide does not name the file. The [Apple Health export explorer](/tools/apple-health-explorer) on this site accepts either a ZIP archive or the export.xml file inside it, reads it in your browser, streaming it in chunks so a large file does not have to fit in memory, and shows each record type with its count, first and last date, units and sources, a daily chart and a CSV download per type. Nothing is uploaded. It maps each type identifier in the file to its name in [the HealthKit identifier reference](/healthkit-identifiers), so \`HKQuantityTypeIdentifierStepCount\` shows up as \`stepCount\` with Apple's one-line description.

For analysis in Python, the [Apple Health notebook](/own-your-data#notebooks) reads the same ZIP with the standard library's \`zipfile\` and \`xml.etree.ElementTree.iterparse\`, so memory stays flat, and builds a pandas DataFrame per type.

## Is there an API for my own Health data?

Not one this site could find. HealthKit is read on the phone by an app the user installs and grants permission per data type, as the [HealthKit integration guide](/integrate/healthkit) covers, and Apple's guide offers the export file as the way to take everything with you. The export is the route for a person; an app is the route for a product.

## Things to check in your export

- **More than one unit.** The explorer counts units per type and charts one unit at a time, because nothing guarantees a type arrives in a single unit (distance in kilometers and miles, for example).
- **Several sources write the same type.** A phone and a watch can both count steps, and adding every row double-counts. HealthKit's statistics queries are built to merge overlapping sources; a raw file is not. The explorer lists the sources per type, and its CSV keeps the source on every row so you can filter to one.
- **Which day.** The explorer groups by the calendar date written at the start of each record's timestamp, the day where it happened; converting everything to UTC first moves late-evening samples to the next day. [Why "today's steps" is a bug](/day-boundaries) shows the same trap in code.
`,
    "faqs": [
      {
        "q": "Where is Export All Health Data in the iPhone Health app?",
        "a": "Under your profile, not in Settings. Apple's iPhone User Guide says to go to the Health app, tap Summary, then tap your picture or initials, then tap Export All Health Data and choose a method for sharing your data. The guide says the export is in XML format.",
      },
      {
        "q": "Can I download my Apple Health data from a website or API instead of the phone?",
        "a": "Not that this site could find. HealthKit data is read on the device by apps the user grants permission to, and Apple's iPhone User Guide offers no web download. The Export All Health Data file on the iPhone is the route for an individual, and a HealthKit app is the route for a product.",
      },
      {
        "q": "How do I open a large Apple Health export.xml without crashing my computer?",
        "a": "Stream it instead of loading it whole. In a browser, this site's Apple Health explorer reads the ZIP or XML in chunks in a Web Worker and keeps only per-type summaries. In Python, xml.etree.ElementTree.iterparse with elem.clear() after each Record keeps memory flat; the linked notebook does exactly that and runs on a synthetic sample.",
      },
    ],
    "related": [
      { "href": "/tools/apple-health-explorer", "label": "Apple Health export explorer" },
      { "href": "/healthkit-identifiers", "label": "HealthKit identifier reference" },
      { "href": "/integrate/healthkit", "label": "HealthKit integration guide" },
      { "href": "/own-your-data/health-connect-export", "label": "Export Health Connect data" },
    ],
    "cta": {
      pitch:
        "Apple changes what Health records and how it labels them with each iOS release. We track the changes that alter what an export or a HealthKit app contains.",
    },
    "steps": [
      { "name": "Open Health", "text": "Go to the Health app on your iPhone." },
      { "name": "Open your profile", "text": "Tap Summary, then tap your picture or initials." },
      { "name": "Export", "text": "Tap Export All Health Data, then choose a method for sharing your data." },
    ],
    "sources": [src(APPLE_GUIDE, "export steps and the XML-format sentence")],
  },
  {
    "slug": "health-connect-export",
    "primaryQuery": "how to export Health Connect data",
    "h1": "How to export your Health Connect data on Android",
    "metaTitle": "Export Health Connect Data: Scheduled Export and Import",
    metaDescription:
      "Google's Health Connect scheduled export: Android 14 and up, a zip in your cloud storage, daily, weekly or monthly, import on another phone, and its limits.",
    "updated": CHECKED,
    answer:
      "Health Connect exports through Settings: search Health Connect, then Manage data, Backup and restore, Scheduled export. Google says the data is bundled in a zip file and saved to a cloud storage provider of your choice, on a daily, weekly or monthly schedule, and that the feature needs Android 14 and up. The file is named \"Health Connect.zip\" by default and is meant to be imported into Health Connect on another device; Google does not document its contents as a format for analysis, and health records are not included.",
    "body": `## Google's steps

Google's Android Help page "Back up & restore your Health Connect data" covers export and import together. To turn on the export:

1. Open your device's Settings app.
2. In the search bar, search Health Connect.
3. Tap Manage data, then Backup and restore, then Scheduled export.
4. Turn Scheduled export on, and select a frequency between daily, weekly, or monthly exports.
5. Tap Next, select one of the cloud storage apps already installed on the device, and choose a location in it.

Google's description of the result: "Your Health Connect data is bundled in a zip file and saved to a cloud storage provider of your choice." By default the file is named "Health Connect.zip", and you can rename it.

## What it is for, and what it leaves out

- **Android 14 and up.** "To use this feature, you need an Android device with version 14 and up."
- **No health records.** Google says "Export and import of health records isn't supported at this time."
- **Built for restore.** The same page's import steps (Manage data, Backup and restore, Import data, pick the cloud app and the file) put the data back into Health Connect on another device. For moving phones over a cable, Google points to device-to-device transfer instead.
- **Turning it off keeps old files.** If you turn off Scheduled export, Google says "it won't delete your previously exported data automatically"; you delete the file from the cloud storage app yourself.

Google's help page does not describe the files inside the zip, so this site does not either. If you want your data as rows to analyze, the documented routes are the apps that write into Health Connect, each with its own export: [Samsung Health](/own-your-data/samsung-health-export), [Fitbit and Google Health](/own-your-data/fitbit-google-health-export), and the wearable pages in this section.

## Is there an API for my own data?

Google's help page describes no web download or personal-use API for Health Connect data. Apps read it on the phone with the user's permission, which is a developer question, covered in [the Health Connect API section](/health-connect-api) and the [Health Connect integration guide](/integrate/google-health-connect).
`,
    "faqs": [
      {
        "q": "Where does Health Connect save its scheduled export?",
        "a": "In a cloud storage app you choose. Google says the data is bundled in a zip file and saved to a cloud storage provider of your choice, picked from the cloud storage apps already installed on the device, and that by default the file is named Health Connect.zip. If no cloud storage app is installed, Google says to download one from Google Play.",
      },
      {
        "q": "Which Android version do I need to export Health Connect data?",
        "a": "Android 14 or later. Google's backup and restore help page says: To use this feature, you need an Android device with version 14 and up. Exports can be scheduled daily, weekly or monthly from Settings, Health Connect, Manage data, Backup and restore, Scheduled export.",
      },
      {
        "q": "Does a Health Connect export include health records?",
        "a": "No. Google's help page says export and import of health records isn't supported at this time. The export and import feature covers the rest of the Health Connect data and is meant for restoring it in Health Connect on another device.",
      },
    ],
    "related": [
      { "href": "/own-your-data/samsung-health-export", "label": "Export Samsung Health data" },
      { "href": "/health-connect-api", "label": "Health Connect API" },
      { "href": "/integrate/google-health-connect", "label": "Health Connect integration guide" },
      { "href": "/own-your-data/apple-health-export", "label": "Export Apple Health data" },
    ],
    "cta": {
      pitch:
        "Health Connect's export, permissions and record types move with each Android release. We track the changes that alter what you can read and keep.",
    },
    "steps": [
      { "name": "Open Health Connect settings", "text": "Open your device's Settings app and search Health Connect." },
      { "name": "Find scheduled export", "text": "Tap Manage data, then Backup and restore, then Scheduled export." },
      { "name": "Choose a schedule", "text": "Turn Scheduled export on and pick daily, weekly or monthly, then tap Next." },
      { "name": "Choose where to save", "text": "Pick an installed cloud storage app and a location; the file is named Health Connect.zip by default." },
    ],
    "sources": [src(HC_HELP, "export and import steps, Android 14 requirement, health-records exclusion")],
  },
  {
    "slug": "samsung-health-export",
    "primaryQuery": "how to download Samsung Health data",
    "h1": "How to download your personal data from Samsung Health",
    "metaTitle": "Download Samsung Health Data: Samsung's Steps",
    metaDescription:
      "Samsung's steps to download your personal data from the Samsung Health app, where the files land on the phone, and how erasing data differs.",
    "updated": CHECKED,
    answer:
      "In the Samsung Health app, tap More options (the three vertical dots), then Settings, then Download personal data, then Download, allow the permissions it asks for and enter your Samsung account details. Samsung's support page says the files are then in My Files, Downloads, in a Samsung Health folder on the phone. Samsung's page does not state the file format. Erase personal data, on the same settings screen, deletes your Samsung Health data from the phone and Samsung's server, so download first.",
    "body": `## Samsung's steps

Samsung's US support article "Download or erase your personal data from Samsung Health" gives the download path:

1. Open the Samsung Health app, tap More options (the three vertical dots), and then tap Settings.
2. Swipe to and tap Download personal data, and then tap Download. Allow the necessary permissions.
3. When prompted, enter your Samsung account information, wait for the information to download, and then tap OK to finish.
4. To view the downloaded data, navigate to My Files, and then tap Downloads. Tap the Samsung Health folder and browse the downloaded files.

The article does not say what format the files are in or how they are organized, and this page does not guess. Open the folder and look.

## Erase is a different button

The same settings screen has Erase personal data. Samsung warns that all of your Samsung Health data stored on the phone or tablet, as well as in Samsung Health and on the Samsung Health server, will be permanently deleted, and that you won't be able to sign into your account until the deletion completes. Download first if you want a copy.

## Other routes

If Samsung Health shares data with Health Connect on your phone, Health Connect's own [scheduled export](/own-your-data/health-connect-export) is a second copy, built for restoring on another device rather than for analysis. Reading Samsung Health data from an app is a separate developer question, covered in the [Samsung Health API guide](/integrate/samsung-health-api).
`,
    "faqs": [
      {
        "q": "Where do Samsung Health downloaded files go on the phone?",
        "a": "To the phone's own storage. Samsung's support page says to open My Files, tap Downloads, then tap the Samsung Health folder to browse the downloaded files, after tapping Download personal data in Samsung Health's settings and entering your Samsung account information.",
      },
      {
        "q": "Does erasing Samsung Health personal data also delete it from Samsung's server?",
        "a": "Yes, by Samsung's own warning: all of your Samsung Health data stored on the phone or tablet, as well as in Samsung Health and on the Samsung Health server, will be permanently deleted. Samsung adds that you won't be able to sign into your account until all of the data is deleted.",
      },
      {
        "q": "What file format does Samsung Health's personal data download use?",
        "a": "Samsung's support article does not say. It documents where the files land (My Files, Downloads, a Samsung Health folder) but not their format or layout, so check the folder after the download finishes rather than relying on a third-party description.",
      },
    ],
    "related": [
      { "href": "/own-your-data/health-connect-export", "label": "Export Health Connect data" },
      { "href": "/integrate/samsung-health-api", "label": "Samsung Health API guide" },
      { "href": "/own-your-data", "label": "Export your data from every platform" },
    ],
    "cta": {
      "pitch": "Samsung Health's data paths shift as Samsung moves more of it onto Health Connect. We track the changes that matter to the people who read that data.",
    },
    "steps": [
      { "name": "Open settings", "text": "In Samsung Health, tap More options (the three vertical dots), then Settings." },
      { "name": "Download", "text": "Tap Download personal data, then Download, and allow the permissions." },
      { "name": "Sign in", "text": "Enter your Samsung account information and wait for the download, then tap OK." },
      { "name": "Find the files", "text": "Open My Files, then Downloads, then the Samsung Health folder." },
    ],
    "sources": [src(SAMSUNG_HELP, "download and erase steps")],
  },
  {
    "slug": "garmin-connect-export",
    "primaryQuery": "export Garmin Connect data",
    "h1": "How to get your own data out of Garmin Connect",
    "metaTitle": "Export Garmin Connect Data: Personal API and Libraries",
    metaDescription:
      "Garmin's Personal API for your own data (JSON and FIT, pull only), what we could not verify about the account export, and where garth and garminconnect stand.",
    "updated": CHECKED,
    answer:
      "Garmin's developer site now offers a Personal tier: secure access to your own Garmin Connect data, where you log in to the Garmin Connect website to retrieve a personal API key and generate access tokens, with activity data as JSON and FIT, health and women's health data as JSON, pull only. Garmin's account-wide data export could not be verified for this page: Garmin's support and account pages could not be read from where it was written. Of the two Python libraries people search for, garth's README says it is deprecated and new logins will not work.",
    "body": `## Garmin's Personal API

On its Connect Developer Program overview, Garmin describes a Personal option as "Secure access to your own Garmin Connect data for individuals who want to explore, analyze, and build personalized experiences using their own data." How it works, in Garmin's words: "Log in to the Garmin Connect website to retrieve your personal API key and generate access tokens for Garmin Connect API requests."

What Garmin lists as included in Personal:

| Data | Format Garmin lists |
|---|---|
| Activity Data | JSON & .FIT |
| Health Data | JSON |
| Women's Health Data | JSON |

Delivery is listed as "Pull only": your script asks; Garmin does not push. The step-by-step, and what this site could not verify about the Personal API's limits, is in [Garmin API for personal use](/fix/garmin-api-personal-use). Building on other people's Garmin data is a different program, covered in the [Garmin API integration guide](/integrate/garmin-api).

## The account data export

Third-party guides describe an account-wide export requested from Garmin's account pages. This page cannot confirm its steps, contents or timing: Garmin's support article, its account pages and its privacy pages could not be read from where this page was written on ${CHECKED} (the support host refused the request, the account pages require sign-in, and the privacy pages render nothing without JavaScript). This site does not repeat steps it has not read from Garmin.

## Python libraries

- ${lib("garth")}. Its README now opens: "Garth is deprecated and no longer maintained." It says Garmin changed its auth flow, breaking the mobile auth approach garth depends on, and that "New logins will not work."
- ${lib("garminconnect")}. Its README documents what it calls "the endpoints the Garmin Connect web app uses", so it talks to the same endpoints as Garmin's website rather than to the documented Personal API.

Both are covered with their registry and repository facts in [Python libraries](/libraries/python).

## Analyze what you get

For a per-day or per-activity CSV, whatever tool produced it, the [daily-summary and activity-list notebooks](/own-your-data#notebooks) show the pandas steps: parse dates, roll up by week, chart.
`,
    "faqs": [
      {
        "q": "Which data does Garmin's Personal API include, and in what format?",
        "a": "Garmin's developer program overview lists Activity Data as JSON and .FIT, Health Data as JSON and Women's Health Data as JSON for the Personal option, with delivery pull only. Garmin says you log in to the Garmin Connect website to retrieve your personal API key and generate access tokens.",
      },
      {
        "q": "Does garth still work for Garmin Connect logins?",
        "a": "Not for new logins, by its own README: Garth is deprecated and no longer maintained, because Garmin changed its auth flow and broke the mobile auth approach it depends on. The README says an existing saved session with a valid OAuth1 token may keep working until that token expires, and that new logins will not work.",
      },
      {
        "q": "Is python-garminconnect the same as Garmin's official API?",
        "a": "No. The garminconnect package's README documents the endpoints the Garmin Connect web app uses, which makes it a client for Garmin's website, not for the Personal API Garmin documents on its developer site. Garmin's Personal API is the documented route for your own data.",
      },
    ],
    "related": [
      { "href": "/fix/garmin-api-personal-use", "label": "Garmin API for personal use" },
      { "href": "/integrate/garmin-api", "label": "Garmin API integration guide" },
      { "href": "/libraries/python", "label": "Python fitness API libraries" },
      { "href": "/own-your-data/strava-export", "label": "Export your Strava data" },
    ],
    "cta": {
      "pitch": "Garmin's developer program and the sign-in flow that community libraries rely on both change with little notice. We track changes like these as they happen.",
    },
    "sources": [
      src(GARMIN_DEV, "Personal option: description, how it works, included data and formats, delivery"),
      src(GARTH_README, "garth deprecation notice"),
      src(GARMINCONNECT_README, "garminconnect documents the web app's endpoints"),
    ],
  },
  {
    "slug": "fitbit-google-health-export",
    "primaryQuery": "how to export Fitbit data",
    "h1": "How to export your Fitbit and Google Health data",
    "metaTitle": "Export Fitbit Data: Google Takeout or Fitbit Data Export",
    metaDescription:
      "Fitbit export depends on how you sign in: Google Takeout for Google Accounts, Data Export for Fitbit logins, TCX for GPS workouts, and Personal apps.",
    "updated": CHECKED,
    answer:
      "It depends on how you sign in. Google's Google Health help page says that if you sign in with a Google Account, you download your data with Google's standard download (Google Takeout) with Google Health selected. If you still use a Fitbit login, you open the Fitbit settings page, click Data Export, and under Export Your Account Archive click Request Data, then confirm by email and download from a second email. GPS workouts export one at a time as TCX from the Google Health app. For code over your own account, the Fitbit Web API's Personal app type reads only the developer's own data, intraday included.",
    "body": `## If you sign in with a Google Account

Google's help page "How do I export my Google Health data?" says to follow Google's instructions for downloading your Google data and to make sure Google Health is selected. Google's Accounts help for that download (Google Takeout) documents the choices you get:

- **Delivery:** a download link by email, or an archive added to Google Drive, Dropbox, Microsoft OneDrive or Box.
- **Frequency:** a one-time archive, or one created automatically every 2 months for one year.
- **File type:** zip or tgz.
- **Archive size:** a maximum you choose; if the data is larger, multiple archives are created.
- **Timing:** Google says the process "could take from a few minutes to a few days", and that most people get the link the same day.

## If you still sign in with a Fitbit login

The same Google Health page gives the older Fitbit route for the complete archive:

1. Visit the Fitbit settings page and sign in with your Fitbit login.
2. Click Data Export under the Settings menu.
3. Under Export Your Account Archive, click Request Data.
4. Open the email Fitbit sends and confirm the request.
5. When the archive is ready, a second email links to the Data Export page; download the file.

Google says a large amount of Fitbit data "can take up to a few days" to generate, and that a Fitbit family account gets separate folders for each child account. For recent data only, the same Data Export page has "Export a selection of your Fitbit data", where you choose the time period, the data and the file format.

## GPS workouts

Google says GPS exercises export to a Training Center XML (TCX) file: in the Google Health app, open the Fitness tab, tap the activity, tap More, then Export, and share or save the file.

## An API over your own account

The Fitbit Web API has a "Personal" application type. Fitbit's developer guide says such an app "can only access the data in the developer's Fitbit account, including their intraday data", and that the intraday request form other app types need is not required. Google is retiring the Fitbit Web API in favor of the Google Health API; the dates and what changes are on [the Fitbit API shutdown page](/fitbit-api-shutdown) and [Google Health API](/google-health-api).

The Python client this site tracks is ${lib("python-fitbit")}, written for the Fitbit Web API.

## Analyze what you get

Takeout and the Fitbit archive are files you then have to parse. The [daily-summary notebook](/own-your-data#notebooks) shows the pandas steps on a generic one-row-per-day CSV; this site has not verified the column layout of either archive, so the notebook does not pretend to read one.
`,
    "faqs": [
      {
        "q": "How do I export Fitbit data after moving my Fitbit account to a Google Account?",
        "a": "Through Google's standard data download. Google's Google Health help page says that if you log in with a Google Account, you follow the instructions for downloading your Google data and make sure Google Health is selected. Google's Takeout help lists delivery by email link or to Drive, Dropbox, OneDrive or Box, as zip or tgz files.",
      },
      {
        "q": "How long does a Fitbit account archive take to generate?",
        "a": "Google says that with a large amount of Fitbit data it can take up to a few days, and that you can check the status in your Data Export account settings. That is for the Fitbit-login route (Data Export, Request Data); for Google Accounts, Google's Takeout help says a few minutes to a few days, with most people getting the link the same day.",
      },
      {
        "q": "Can a Fitbit Personal app read intraday data without the intraday request form?",
        "a": "Yes, for the developer's own account only. Fitbit's application design guide says a Personal application can only access the data in the developer's Fitbit account, including their intraday data, and that completing the Intraday Request form is not needed. Client and Server apps that want other users' intraday data must request it.",
      },
    ],
    "related": [
      { "href": "/fitbit-api-shutdown", "label": "Fitbit Web API shutdown" },
      { "href": "/google-health-api", "label": "Google Health API" },
      { "href": "/integrate/fitbit-api", "label": "Fitbit API integration guide" },
      { "href": "/own-your-data/oura-export", "label": "Export your Oura data" },
    ],
    "cta": {
      "pitch": "Fitbit's move to Google Accounts and the Google Health API keeps changing where data lives. We track each dated step.",
    },
    "sources": [
      src(GOOGLE_HEALTH_HELP, "Google Account and Fitbit-login export routes, archive timing, TCX export"),
      src(TAKEOUT_HELP, "Takeout delivery methods, frequency, file types, archive size, timing"),
      src(FITBIT_APP_TYPES, "Personal application type and intraday access"),
    ],
  },
  {
    "slug": "oura-export",
    "primaryQuery": "how to export Oura data",
    "h1": "How to export your Oura data",
    "metaTitle": "Export Oura Data: Membership Hub, Reports and the API",
    metaDescription:
      "Oura's Membership Hub export for every user, with or without membership: up to 10 days to prepare, durations in seconds, plus Shareable Reports and the API.",
    "updated": CHECKED,
    answer:
      "Log in to Oura's Membership Hub, select Export data, then Request your data. Oura's support article says this option is available for all Oura users, with or without active membership, that it may take up to 10 days before the data is ready, and that Oura emails you when it is. Durations in the download are in total seconds, not hours and minutes. Oura also offers Shareable Reports (a PDF summary) and the Oura API, whose documentation now marks personal access tokens as deprecated.",
    "body": `## Oura's three routes

Oura's support article "Export & Share Your Oura Data" lists three options: Shareable Reports, the Oura API, and a download from Membership Hub.

### Download from Membership Hub

"This option is available for all Oura users, with or without active membership." The steps Oura gives:

1. Log in to the Membership Hub with your Oura account details.
2. Select Export data.
3. Select Request your data.

Oura notes that "it may take up to 10 days from the time of request before your data is available for download", and that it sends a reminder email when the export is ready; you then download it from Membership Hub. For the meaning of each field, Oura says "Data models are described in the documentation for the Oura API V2."

One detail that trips up spreadsheets: "Time duration for downloaded Oura data is presented in total seconds, not in hours and minutes." Oura's own example is 24,030 seconds of sleep, which the app shows as 6 hours 41 minutes; divide by 3,600 for hours.

### Shareable Reports

A PDF summary of sleep, daily movement and cycle trends to share with a clinician, from the Oura app's menu under Reports, then Shareable Reports. Oura says you cannot currently adjust the timeframes or type of data shared, and that some reports need Gen3 or later with an active membership.

### The Oura API

Oura says the API "can be used to fetch your Oura data or build an integration", and that you need an Oura account and an API application. The API's documentation authenticates through OAuth2, and its menu lists "Personal Access Tokens [Deprecated]", so a quick token for your own account is no longer the route; [Oura personal access token deprecated](/fix/oura-personal-access-token-deprecated) covers the change, and the [Oura API integration guide](/integrate/oura-api) the OAuth2 flow.

## Python libraries

- ${lib("oura-ring")}.
- ${lib("oura-python")}.

## Analyze what you get

The [daily-summary notebook](/own-your-data#notebooks) shows how to parse dates, convert a seconds column to hours and roll up by week in pandas, on a synthetic CSV rather than Oura's exact layout, which this site has not verified.
`,
    "faqs": [
      {
        "q": "Can I export my Oura data without an active membership?",
        "a": "Yes. Oura's support article says the Membership Hub download is available for all Oura users, with or without active membership: log in to Membership Hub, select Export data, then Request your data.",
      },
      {
        "q": "How long does an Oura data export take?",
        "a": "Oura says it may take up to 10 days from the time of request before your data is available for download, and that it emails a reminder to the address on your Oura account when the export is ready. You download it from Membership Hub.",
      },
      {
        "q": "Why are the sleep times in my Oura export such large numbers?",
        "a": "Because they are seconds. Oura says time duration for downloaded data is presented in total seconds, not in hours and minutes. Oura's example: 24,030 seconds is 6.675 hours, which the app shows as 6 hours 41 minutes. Divide by 3,600 to get hours.",
      },
    ],
    "related": [
      { "href": "/fix/oura-personal-access-token-deprecated", "label": "Oura personal access token deprecated" },
      { "href": "/integrate/oura-api", "label": "Oura API integration guide" },
      { "href": "/libraries/python", "label": "Python fitness API libraries" },
      { "href": "/own-your-data/polar-flow-export", "label": "Download your Polar data" },
    ],
    "cta": {
      "pitch": "Oura retired personal access tokens and changes what its API and exports carry. We track those changes with their dates.",
    },
    "sources": [
      src(OURA_HELP, "Membership Hub steps, availability, timing, seconds note, Shareable Reports, API"),
      src(OURA_AUTH, "OAuth2 authentication and the deprecated personal access tokens menu item"),
    ],
  },
  {
    "slug": "polar-flow-export",
    "primaryQuery": "how to download Polar Flow data",
    "h1": "How to download all your data from Polar Flow",
    "metaTitle": "Download Polar Flow Data: Polar's Export and AccessLink",
    metaDescription:
      "Polar's account export at account.polar.com, the two-week download window, why activity and sleep are missing, and AccessLink for any Polar Flow user.",
    "updated": CHECKED,
    answer:
      "Sign in at account.polar.com, click Download your data in the left-hand menu, then click Download. Polar emails you when the data is collected and gives you two weeks to download it. Polar says the export contains the data you provided and most of the data from your Polar devices and apps, but nothing derived by Polar's algorithms, so activity and sleep information are not included. For code, Polar's AccessLink API documentation says any registered Polar Flow user can create an API client.",
    "body": `## Polar's steps

Polar's support article "How to download all your data from the Polar ecosystem" covers users of the Polar Flow and Polar Beat apps:

1. Go to account.polar.com and sign in using your Polar account email address and password.
2. In the left-hand menu, click Download your data, or scroll down to find the section.
3. Click the Download button to initiate the request and begin the data collection process.

"You will get an email when your data is ready to be downloaded." Polar says collection takes some time, depending on the amount of data and other data collection traffic, and "You will have two weeks to download the data, once you get the email."

## What is in it, and what is not

In Polar's words, the export "contains all of the Polar Flow data that was originally provided by you (for example, data given by you during the account registration process), and most of the data coming from the Polar devices or Polar apps you use." It "does not include any data that is derived from the data provided by you using Polar algorithms so, for instance, activity and sleep information are not included in the exported file."

So a Polar export is raw recordings and your own inputs, not the daily activity and sleep summaries you see in the app. If those summaries are what you want, the API is the route.

Team products differ: for Polar Team Pro, Polar says your team is responsible for the data and that it can be downloaded or transferred to a third party via the Team Pro API; the Polar Team app has a download under Settings.

## AccessLink for your own account

Polar's AccessLink API v3 documentation calls AccessLink "the access channel to the training and daily activity data recorded by Polar devices", and says "Any registered Polar Flow user can create API client to AccessLink" at admin.polaraccesslink.com, authenticating with OAuth2. You then register your own user through the API before reading data. The [Polar API integration guide](/integrate/polar-api) covers the flow and its limits.

## Analyze what you get

The [activity-list notebook](/own-your-data#notebooks) shows weekly training volume by sport in pandas on a synthetic per-workout CSV; this site has not verified the layout of Polar's export files, so the notebook uses its own columns.
`,
    "faqs": [
      {
        "q": "How long do I have to download my Polar data export?",
        "a": "Two weeks from the email. Polar's support article says you will get an email when your data is ready to be downloaded, and that you will have two weeks to download the data once you get it. Collection itself takes a variable time, depending on the amount of data and other collection traffic.",
      },
      {
        "q": "Why are activity and sleep missing from my Polar export?",
        "a": "Because Polar leaves out anything its algorithms derive. Polar says the export does not include any data derived from the data you provided using Polar algorithms, so activity and sleep information are not included in the exported file. It does contain the data you provided and most of the data from your Polar devices and apps.",
      },
      {
        "q": "Can any Polar Flow user create an AccessLink API client?",
        "a": "Yes, by Polar's own documentation: any registered Polar Flow user can create an API client to AccessLink by filling in application details at admin.polaraccesslink.com. AccessLink uses OAuth2, and a user must be registered through the API before their data can be read.",
      },
    ],
    "related": [
      { "href": "/integrate/polar-api", "label": "Polar API integration guide" },
      { "href": "/own-your-data/suunto-export", "label": "Export your Suunto workouts" },
      { "href": "/own-your-data", "label": "Export your data from every platform" },
    ],
    "cta": { "pitch": "Polar's export and AccessLink terms change quietly. We track the changes that alter what you can get out." },
    "steps": [
      { "name": "Sign in", "text": "Go to account.polar.com and sign in with your Polar account email address and password." },
      { "name": "Find the download", "text": "In the left-hand menu, click Download your data." },
      { "name": "Request", "text": "Click Download to start the data collection, then wait for Polar's email." },
      { "name": "Download", "text": "Download the data within two weeks of the email." },
    ],
    "sources": [
      src(POLAR_HELP, "account export steps, two-week window, contents and exclusions, Team products"),
      src(POLAR_ACCESSLINK, "AccessLink: any registered Polar Flow user can create a client; OAuth2"),
    ],
  },
  {
    "slug": "strava-export",
    "primaryQuery": "how to export Strava data",
    "h1": "How to export your Strava data: one activity or your whole account",
    "metaTitle": "Export Strava Data: Bulk Export, Original, TCX and GPX",
    metaDescription:
      "Strava's bulk account export, Export Original, the /export_tcx trick and GPX, all from the Strava website, plus the single-player mode of Strava's API.",
    "updated": CHECKED,
    answer:
      "For everything, log in on Strava.com, open Settings, then My Account, select Get Started under Download your account, then Request download; Strava emails a download link, which it says may take a few hours. For one activity, use Export Original from the activity page's more menu (often a FIT file), Export GPX, or add /export_tcx to the activity URL for TCX. Strava says exporting is only available on the website. For code, every new Strava API app starts in single-player mode, where only your own account can authenticate.",
    "body": `## The whole account

Strava's support article "How Do I Export My Strava Data?" gives the bulk export, which it has offered since May 25, 2018:

1. Log in to the account on Strava.com from which you wish to bulk export data.
2. Hover over your name in the upper right-hand corner. Choose Settings, then find the My Account tab in the menu on the left.
3. Select Get Started under Download your account.
4. On the next page, select Request download.
5. You will receive an email with a link to download your data. Strava says this may take a few hours, so you need access to the email account on your Strava profile.

"Please note that exporting your data is only available on the Strava website."

## One activity at a time

Strava lists three formats per activity, and recommends the original:

- **Export Original.** From the activity page's more (ellipsis) menu. "In many cases, the original will be in FIT (Flexible and Interoperable Data Transfer) format", downloaded in whatever format it was uploaded.
- **TCX.** Add \`/export_tcx\` to the end of the activity page URL. Strava says TCX files carry more than GPX, such as heart rate, cadence and watts, including power, but "TCX export only works for activities with GPS data, which may exclude indoor activities with no GPS."
- **GPX.** Export GPX from the same menu. An activity with no GPS data produces an unreadable or empty file, and Strava's GPX includes power from a power meter but not estimated power.

Developer Hub (formerly Community Hub) members can request an export of that data by email, per the same article.

## Strava's API in single-player mode

Strava's getting-started guide says "All new applications start in single-player mode", where "only your own Strava account can authenticate with the app", which suits a script over your own activities. It also says "A Strava subscription is a prerequisite for creating an app." Rate limits and what it takes to serve more athletes are in the [Strava API integration guide](/integrate/strava-api).

The Python client this site tracks is ${lib("stravalib")}.

## Analyze what you get

The [activity-list notebook](/own-your-data#notebooks) sums weekly minutes and distance by activity type in pandas, on a synthetic per-activity CSV with its own columns rather than Strava's archive layout, which this site has not verified.
`,
    "faqs": [
      {
        "q": "Can I export my Strava data from the mobile app?",
        "a": "No. Strava's support article says exporting your data is only available on the Strava website. The bulk export is under Settings, My Account, Download your account, and single activities export from each activity page's menu on Strava.com.",
      },
      {
        "q": "How do I get a TCX file of a Strava activity?",
        "a": "Add /export_tcx to the end of the activity page URL on Strava.com, for example strava.com/activities/<id>/export_tcx. Strava says TCX includes heart rate, cadence and watts, and that TCX export only works for activities with GPS data, which may exclude indoor activities.",
      },
      {
        "q": "Do I need a Strava subscription to use the Strava API for my own data?",
        "a": "Yes, as of Strava's getting-started guide read on November 5, 2026: it says a Strava subscription is a prerequisite for creating an app. New apps start in single-player mode, where only your own Strava account can authenticate, which is enough for a script over your own activities.",
      },
    ],
    "related": [
      { "href": "/integrate/strava-api", "label": "Strava API integration guide" },
      { "href": "/fix/strava-api-401-unauthorized", "label": "Strava API 401 Unauthorized" },
      { "href": "/libraries/python", "label": "Python fitness API libraries" },
      { "href": "/own-your-data/garmin-connect-export", "label": "Get your Garmin Connect data" },
    ],
    "cta": { "pitch": "Strava has changed its API terms more than once. We track every dated change to what developers and athletes can get out." },
    "steps": [
      { "name": "Open settings on the website", "text": "Log in on Strava.com, choose Settings, then the My Account tab." },
      { "name": "Start the download", "text": "Select Get Started under Download your account." },
      { "name": "Request", "text": "Select Request download." },
      { "name": "Download", "text": "Open the email from Strava and follow the link to download your data." },
    ],
    "sources": [
      src(STRAVA_HELP, "bulk export steps, website-only note, Export Original, TCX, GPX, Developer Hub export"),
      src(STRAVA_DEV, "single-player mode and subscription prerequisite"),
    ],
  },
  {
    "slug": "suunto-export",
    "primaryQuery": "export workouts from Suunto app",
    "h1": "How to export workouts from the Suunto app: FIT or GPX",
    "metaTitle": "Export Suunto Workouts: FIT vs GPX From the Suunto App",
    metaDescription:
      "Suunto's own guidance: export a workout as FIT for everything, GPX for location, time and heart rate, routes as GPX, and why no-GPS workouts are FIT only.",
    "updated": CHECKED,
    answer:
      "In the Suunto app, open a workout, tap the three dots in the top right corner, pick a format and save or share the file. Suunto says a FIT file includes all the relevant information from your workout (location, time, timestamps, heart rate, power, cadence) and is the preferred format; a GPX workout has location and time and, where available, heart rate; and exercise recordings without GPS can only be exported as FIT. Suunto's FAQ documents no account-wide bulk export, and this site's Suunto pages record that Suunto does not offer its API for personal use.",
    "body": `## Suunto's steps

Suunto's FAQ "What type of files can I export from the Suunto app?" gives one path for both iOS and Android: "go to any of your workouts available in the Suunto app, and in the top right corner, tap the three dots. Select the format you want to export the information in and save the file either on your device or directly open it in a compatible app."

## Which format

| Export | What Suunto says it contains |
|---|---|
| Workout as FIT | "all the relevant information from your workout: location, time, timestamps, heart rate, power, cadence, etc." Suunto calls FIT "the preferred format for workout export and use in different services." |
| Workout as GPX | Location and time, and, where available, heart rate. GPX workouts "don't contain all the information available in the Suunto app." |
| Route as GPX | "only the location information from your workout", exportable from a workout or from the route gallery, for navigation in other services. |

And one rule: "exercise recordings without GPS will not have the possibility of exporting GPX files, only FIT files."

## All of it at once

Suunto's FAQ covers one workout at a time and does not describe an account-wide export, and this page has no Suunto source that does. For code, the [Suunto API alternatives page](/alternatives/suunto-api-alternatives) records, from Suunto's API Zone, that Suunto does not currently offer API access for personal use; the partner route is in the [Suunto API integration guide](/integrate/suunto-api).

## Analyze what you get

FIT files need a parser (the FIT SDK or a library for it) before pandas can use them; GPX is XML. Once you have one row per workout, the [activity-list notebook](/own-your-data#notebooks) shows the weekly roll-up.
`,
    "faqs": [
      {
        "q": "Should I export Suunto workouts as FIT or GPX?",
        "a": "FIT, unless a service only takes GPX. Suunto says a FIT workout includes all the relevant information (location, time, timestamps, heart rate, power, cadence) and is the preferred format, while a GPX workout has location, time and, where available, heart rate, and does not contain all the information in the Suunto app.",
      },
      {
        "q": "Why can't I export a GPX file from a Suunto workout?",
        "a": "Most likely the workout has no GPS track. Suunto's FAQ says exercise recordings without GPS will not have the possibility of exporting GPX files, only FIT files. Indoor sessions and workouts recorded with GPS off fall into this group.",
      },
      {
        "q": "Can I use the Suunto API to download my own workouts?",
        "a": "Not as a private individual, according to Suunto's API Zone as recorded on this site's Suunto alternatives page: Suunto says it does not currently offer API access for personal use, and provides the API to companies and organizations. For your own workouts, export FIT files from the Suunto app one workout at a time.",
      },
    ],
    "related": [
      { "href": "/alternatives/suunto-api-alternatives", "label": "Suunto API alternatives" },
      { "href": "/integrate/suunto-api", "label": "Suunto API integration guide" },
      { "href": "/own-your-data/coros-export", "label": "Bulk export your COROS data" },
    ],
    "cta": { "pitch": "Suunto's API and export options are changing as its platform does. We track what is documented, with dates." },
    "steps": [
      { "name": "Open a workout", "text": "In the Suunto app, open any of your workouts." },
      { "name": "Open the menu", "text": "Tap the three dots in the top right corner." },
      { "name": "Pick a format", "text": "Select FIT or GPX, then save the file on your device or open it in a compatible app." },
    ],
    "sources": [src(SUUNTO_FAQ, "export path, FIT vs GPX contents, routes, no-GPS rule")],
  },
  {
    "slug": "coros-export",
    "primaryQuery": "COROS bulk export",
    "h1": "How to bulk export your COROS data",
    "metaTitle": "COROS Bulk Export: Training Hub FIT or TCX, and Daily Data",
    metaDescription:
      "COROS's own steps: bulk export every activity as FIT or TCX from Training Hub on a desktop, single workouts from the app, and daily data by support request.",
    "updated": CHECKED,
    answer:
      "Log in to COROS Training Hub from a desktop computer, click the Activity List tab, and select Export Data on the right side of the screen; COROS asks for a file format, either .FIT or .TCX, and an email address to receive the files, and says other file types are not supported. Single workouts export from the COROS app as FIT or GPX. Sleep and daily data such as heart rate are not in the bulk export: COROS says to request them from support in the app, with a date range.",
    "body": `## Every activity: COROS Training Hub

COROS's support article "Requesting a Bulk Export of COROS Data" gives the steps for your activity history:

1. Log in to COROS Training Hub from a desktop computer.
2. Click the Activity List tab at the top of the screen.
3. Select the Export Data option on the right side of the screen.
4. Choose a file format, either .FIT or .TCX, and enter an email address to receive the exported files.

COROS adds that "Exporting to other file types are not supported at this time."

## One workout: the COROS app

COROS's article on exporting workout data says to open the workout from the Workout page, tap the top right corner to open its settings, select Export Data, and pick a format: "If heart rate is not included or important, you can select .GPX format. Otherwise .FIT is a popular option." You then send the file to your computer, by email for example.

## Sleep and daily data

The bulk export covers activities. For "non-activity data recorded by your watch, such as daily metrics, sleep data, or heart rate", COROS says to contact support from the COROS app: make sure the watch is in sync, open the Profile page, select Customer Support, then Contact Support, give the date range you want, agree to the Privacy Policy and submit. Its single-workout article states the limit plainly: "Daily data like HR and steps cannot be exported from COROS currently."

## For code

COROS documents its own developer routes, compared in the [COROS API integration guide](/integrate/coros-api).

## Analyze what you get

FIT and TCX files need parsing into rows first; once you have one row per activity, the [activity-list notebook](/own-your-data#notebooks) shows the weekly roll-up in pandas.
`,
    "faqs": [
      {
        "q": "Which file formats does COROS Training Hub bulk export support?",
        "a": "FIT and TCX only. COROS's bulk export article says you will be prompted to choose a file format, either .FIT or .TCX, and an email address to receive the exported files, and that exporting to other file types is not supported at this time. Single workouts from the COROS app can also be exported as GPX.",
      },
      {
        "q": "How do I get my COROS sleep and daily heart-rate data?",
        "a": "By asking COROS support. COROS says that to export non-activity data such as daily metrics, sleep data or heart rate, you open the COROS app with the watch in sync, go to the Profile page, Customer Support, Contact Support, and give the date range you want. Its single-workout article also says daily data like HR and steps cannot be exported from COROS currently.",
      },
      {
        "q": "Can I bulk export COROS activities from the phone app?",
        "a": "Not according to COROS: its bulk export runs in COROS Training Hub from a desktop computer, under Activity List, Export Data. The phone app exports one workout at a time, from the workout's settings menu.",
      },
    ],
    "related": [
      { "href": "/integrate/coros-api", "label": "COROS API integration guide" },
      { "href": "/alternatives/coros-api-alternatives", "label": "COROS API alternatives" },
      { "href": "/own-your-data/suunto-export", "label": "Export your Suunto workouts" },
    ],
    "cta": { "pitch": "COROS's export and developer options keep changing. We track what each one gives you, with its date." },
    "steps": [
      { "name": "Open Training Hub", "text": "Log in to COROS Training Hub from a desktop computer." },
      { "name": "Open the activity list", "text": "Click the Activity List tab at the top of the screen." },
      { "name": "Export", "text": "Select Export Data on the right side of the screen." },
      { "name": "Pick a format", "text": "Choose .FIT or .TCX and enter the email address to receive the files." },
    ],
    "sources": [
      src(COROS_BULK, "bulk export steps and formats; sleep and daily data by support request"),
      src(COROS_SINGLE, "single-workout export and the daily-data limit"),
    ],
  },
];
