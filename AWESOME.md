# Awesome Fitness APIs

> A list of 25 fitness and health APIs and platforms, 20 open-source libraries, 283 MCP servers, 20 open datasets and 44 free tools for developers building with wearable, health and workout data. Generated from aifitnessapi.com's sourced data by a script, so every line restates a published fact and nothing is ranked.

The same list is served at [aifitnessapi.com/awesome](https://aifitnessapi.com/awesome), with a markdown copy at [/awesome.md](https://aifitnessapi.com/awesome.md).

## Contents

- [APIs and platforms](#apis-and-platforms)
  - [Wearable APIs (direct)](#wearable-apis-direct)
  - [Health-data aggregators](#health-data-aggregators)
  - [Platform health stores](#platform-health-stores)
  - [Nutrition & food data](#nutrition--food-data)
  - [Exercise content](#exercise-content)
  - [AI motion / coaching SDKs](#ai-motion--coaching-sdks)
  - [Pose-estimation models](#pose-estimation-models)
- [Libraries and SDK bridges](#libraries-and-sdk-bridges)
  - [React Native](#react-native)
  - [Capacitor and Cordova](#capacitor-and-cordova)
  - [Flutter](#flutter)
  - [Python](#python)
- [MCP servers for health data](#mcp-servers-for-health-data)
  - [Apple Health (HealthKit)](#apple-health-healthkit)
  - [Health Connect](#health-connect)
  - [Google Health API](#google-health-api)
  - [Fitbit](#fitbit)
  - [Samsung Health](#samsung-health)
  - [Garmin](#garmin)
  - [Oura](#oura)
  - [WHOOP](#whoop)
  - [Polar](#polar)
  - [Withings](#withings)
  - [Suunto](#suunto)
  - [COROS](#coros)
  - [Dexcom](#dexcom)
  - [Strava](#strava)
  - [MyFitnessPal](#myfitnesspal)
  - [Cronometer](#cronometer)
  - [Junction (formerly Vital)](#junction-formerly-vital)
  - [Several sources](#several-sources)
  - [Wearable, fitness and health data in general](#wearable-fitness-and-health-data-in-general)
- [Open datasets](#open-datasets)
- [Free tools](#free-tools)

## APIs and platforms

Every product in the site's API directory, by category, with how it bills developers (Free, Free tier, Usage-based or Contact sales) and whether its entry names a review, approval or declaration before production. Each link is the product's directory page, which cites the pages that verify it.

### Wearable APIs (direct)

- [Fitbit Web API (Google)](https://aifitnessapi.com/apis/fitbit) - Developer billing: Free. An approval, review or declaration stands before production.
- [Garmin Health / Activity API](https://aifitnessapi.com/apis/garmin) - Developer billing: Free. An approval, review or declaration stands before production.
- [Oura Cloud API](https://aifitnessapi.com/apis/oura) - Developer billing: Free. An approval, review or declaration stands before production.
- [WHOOP Developer Platform](https://aifitnessapi.com/apis/whoop) - Developer billing: Free. An approval, review or declaration stands before production.
- [Strava API](https://aifitnessapi.com/apis/strava) - Developer billing: Free. An approval, review or declaration stands before production.
- [Polar Open AccessLink](https://aifitnessapi.com/apis/polar) - Developer billing: Free.

### Health-data aggregators

- [Terra](https://aifitnessapi.com/apis/terra) - Developer billing: Usage-based. An approval, review or declaration stands before production.
- [Junction (formerly Vital)](https://aifitnessapi.com/apis/junction) - Developer billing: Usage-based.
- [Rook](https://aifitnessapi.com/apis/rook) - Developer billing: Usage-based. An approval, review or declaration stands before production.
- [Spike](https://aifitnessapi.com/apis/spike) - Developer billing: Usage-based. An approval, review or declaration stands before production.

### Platform health stores

- [Apple HealthKit](https://aifitnessapi.com/apis/healthkit) - Developer billing: Free. An approval, review or declaration stands before production.
- [Google Health Connect](https://aifitnessapi.com/apis/health-connect) - Developer billing: Free. An approval, review or declaration stands before production.

### Nutrition & food data

- [Nutritionix](https://aifitnessapi.com/apis/nutritionix) - Developer billing: Free tier. An approval, review or declaration stands before production.
- [Edamam](https://aifitnessapi.com/apis/edamam) - Developer billing: Free tier.
- [USDA FoodData Central](https://aifitnessapi.com/apis/usda-fdc) - Developer billing: Free.
- [Open Food Facts](https://aifitnessapi.com/apis/open-food-facts) - Developer billing: Free.

### Exercise content

- [ExerciseDB (AscendAPI)](https://aifitnessapi.com/apis/exercisedb) - Developer billing: Free tier.
- [wger (self-hosted)](https://aifitnessapi.com/apis/wger) - Developer billing: Free.
- [Your Move Exercise API](https://aifitnessapi.com/apis/your-move) - Developer billing: Usage-based. An approval, review or declaration stands before production.

### AI motion / coaching SDKs

- [KinesteX](https://aifitnessapi.com/apis/kinestex) - Developer billing: Contact sales. An approval, review or declaration stands before production. KinesteX funds aifitnessapi.com; it is listed the same way as every other product.
- [Sency (SMKit)](https://aifitnessapi.com/apis/sency) - Developer billing: Usage-based. An approval, review or declaration stands before production.
- [QuickPose](https://aifitnessapi.com/apis/quickpose) - Developer billing: Free tier.

### Pose-estimation models

- [MediaPipe Pose Landmarker (BlazePose)](https://aifitnessapi.com/apis/mediapipe) - Developer billing: Free.
- [TensorFlow MoveNet](https://aifitnessapi.com/apis/movenet) - Developer billing: Free.
- [Apple Vision body pose](https://aifitnessapi.com/apis/apple-vision) - Developer billing: Free.

## Libraries and SDK bridges

Open-source packages for HealthKit, Health Connect and vendor web APIs, read from their registries on 2026-11-24. Each links its registry page; the license is the one the registry states.

### React Native

- [react-native-health](https://www.npmjs.com/package/react-native-health) - The long-standing React Native bridge to Apple HealthKit, and the one this site's SDK release tracker follows. npm, license MIT.
- [@kingstinct/react-native-healthkit](https://www.npmjs.com/package/@kingstinct/react-native-healthkit) - The other React Native HealthKit binding, typed close to Apple's own identifiers — the usual alternative to react-native-health. npm, license MIT.
- [react-native-health-connect](https://www.npmjs.com/package/react-native-health-connect) - The React Native wrapper for Android Health Connect; since v4 it also carries the Expo config plugin. npm, license MIT.
- [expo-health-connect](https://www.npmjs.com/package/expo-health-connect) - Still in many Expo app.json files. Deprecated in the registry and merged into react-native-health-connect v4 — the page exists to say how to remove it. npm, license MIT. Deprecated on npm: Merged into react-native-health-connect v4 — remove this package, replace the expo-health-connect entry in your app.json plugins array with react-native-health-connect, then re-run expo prebuild --clean. See https://github.com/matinzd/react-native-health-connect. Repository archived on GitHub.
- [react-native-google-fit](https://www.npmjs.com/package/react-native-google-fit) - The React Native bridge to the Google Fit Android API, which Google has deprecated in favour of Health Connect. npm, license MIT. Repository archived on GitHub.

### Capacitor and Cordova

- [capacitor-health](https://www.npmjs.com/package/capacitor-health) - A Capacitor plugin over both Apple Health and Health Connect, derived in part from cordova-plugin-health. npm, license MIT.
- [@capgo/capacitor-health](https://www.npmjs.com/package/@capgo/capacitor-health) - Capgo's Capacitor plugin over HealthKit and Health Connect — the other cross-platform choice for Capacitor apps. npm, license MPL-2.0.
- [@perfood/capacitor-healthkit](https://www.npmjs.com/package/@perfood/capacitor-healthkit) - An iOS-only Capacitor plugin for HealthKit, still found in older Ionic projects. npm, license MIT.
- [cordova-plugin-health](https://www.npmjs.com/package/cordova-plugin-health) - The Cordova plugin over HealthKit and Health Connect, published since 2016 and documented for manual use under Capacitor. npm, license MIT.

### Flutter

- [health](https://pub.dev/packages/health) - The Flutter plugin over HealthKit and Health Connect most Flutter health apps start from. pub.dev, license MIT.
- [health_connector](https://pub.dev/packages/health_connector) - A newer Flutter SDK over HealthKit and Health Connect, first published in November 2025 — the alternative to `health`. pub.dev, license MIT.
- [health_kit_reporter](https://pub.dev/packages/health_kit_reporter) - An iOS-only Flutter wrapper around the HealthKitReporter CocoaPods library. pub.dev, license MIT.
- [flutter_health_connect](https://pub.dev/packages/flutter_health_connect) - A Health Connect-only Flutter plugin that still turns up in search results and older projects. pub.dev, license MIT.

### Python

- [garminconnect](https://pypi.org/project/garminconnect/) - The Python client most people reach for to read their own Garmin Connect data. PyPI, license MIT.
- [garth](https://pypi.org/project/garth/) - The Garmin auth library garminconnect used to depend on; its README now declares it deprecated. PyPI, license MIT.
- [stravalib](https://pypi.org/project/stravalib/) - The Python client for the Strava V3 API. PyPI, license Apache-2.0.
- [oura-ring](https://pypi.org/project/oura-ring/) - A Python client for the Oura API v2 with an OAuth2 helper. PyPI, license MIT.
- [oura](https://pypi.org/project/oura/) - The older Python Oura client (repository python-ouraring), whose maintainer is asking for someone to take it over. PyPI, license MIT License.
- [fitbit](https://pypi.org/project/fitbit/) - The python-fitbit client for the legacy Fitbit Web API, which Google is retiring in favour of the Google Health API. PyPI, license Apache 2.0.
- [withings-api](https://pypi.org/project/withings-api/) - A Python client for the Withings Health API using OAuth 2.0. PyPI, license MIT.

## MCP servers for health data

Model Context Protocol servers whose official MCP Registry entry names a health or fitness source, read from the registry on 2026-11-18. The description is the registry's, verbatim; none of these servers was reviewed or run for this list. Each links its repository, else its website, else its registry record.

### Apple Health (HealthKit)

- [Telo by BlynkAI (app.ferryman.telo/telo)](https://telo.ferryman.app/) - Read synced Apple Health sleep, activity, Telo scores, and health log details with OAuth.
- [HealthAPI (app.healthapi/healthapi)](https://healthapi.app/apple-health-mcp) - Read-only Apple Health data synced from your iPhone: sleep, heart rate, HRV, workouts and trends.
- [Metrics Nest (app.metricsnest/metrics-nest)](https://www.metricsnest.app/apple-health-ai) - Ask Claude, ChatGPT or Cursor about your Apple Health data: workouts, sleep, food. Read-only.
- [Somvia (app.somvia/health)](https://somvia.app/) - Apple Health training load, recovery, HRV and workout detail for Claude, ChatGPT and any MCP client.
- [Health MCP (cc.healthmcp/health)](https://github.com/iddogino/HealthMCP) - Encrypted Apple Health for MCP clients. Your key never leaves your iPhone.
- [Health Access MCP (com.healthaccessmcp/healthaccess-mcp)](https://healthaccessmcp.com) - Apple Health and Apple Watch workouts for your AI, from local files. Plans go back to the Watch.
- [Marrow Health: Apple Health for your AI (com.marrowhealthapp/apple-health)](https://marrowhealthapp.com/connect) - Your Apple Health data, food diary and lifts, for ChatGPT, Claude and Gemini. Approved on iPhone.
- [telo (health.telo/telo)](https://telo.health/apple-health-mcp) - Hosted Apple Health MCP for Claude and ChatGPT, works outside the US. iPhone app, no local server.
- [io.github.Fino-wind/vaultbeat](https://github.com/Fino-wind/vaultbeat-mcp) - Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine. Marked deprecated in the registry.
- [io.github.Fino-wind/vaultbeat-apple-health](https://github.com/Fino-wind/vaultbeat-apple-health) - Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine.
- [A Good Sign: Apple Health MCP (io.github.Good-Feels/a-good-sign)](https://agoodsign.app/setup) - Connect Apple Health to AI via MCP. Requires A Good Sign iPhone app, sync and subscription.
- [MetricBridge Apple Health (io.github.PhilipAD/health-export-mcp)](https://github.com/PhilipAD/health-export-mcp) - Ask your agent about your own Apple Health data: 194 metrics, 21 tools, local, 0 deps.
- [io.github.davidmosiah/apple-health-mcp](https://github.com/davidmosiah/apple-health-mcp) - Unofficial local-first MCP server for Apple Health export data.
- [Health MCP (io.github.iddogino/health-mcp)](https://github.com/iddogino/HealthMCP) - Encrypted Apple Health for MCP clients. Your key never leaves your iPhone.
- [health4ai (io.github.jefflitt1/health4ai)](https://github.com/jefflitt1/health4ai) - Query your Apple Health data from your own Supabase/Postgres via local MCP.
- [Apple Health MCP Server (io.github.krumjahn/health-analyzer-mcp)](https://github.com/krumjahn/MacHealthAnalyzer) - Apple Health data for Claude, Cursor, and any MCP client — 100% local on your Mac.
- [Apple Health (io.github.neiltron/apple-health-mcp)](https://github.com/neiltron/apple-health-mcp) - Local-first Apple Health MCP server for questions about your sleep, workouts and heart data.
- [Apple Health AI Bridge (io.github.roian6/health-bridge)](https://github.com/roian6/apple-health-ai-bridge) - Read-only local MCP access to Apple Health data through Apple Health AI Bridge.
- [P.R.O. Apple Health MCP (io.github.runwithfun/pro)](https://proapp.uk/apple-health-mcp) - Hosted Apple Health MCP: workouts, sleep and HRV in ChatGPT, Claude, Gemini, Grok. Free, no export.
- [Syncky Health (io.github.syncky/syncky-health)](https://github.com/syncky/syncky-open) - Apple Health data, end-to-end encrypted between iPhone and local Syncky agent, allowed write-back.
- [tech.skeletonarmy/marrow](https://github.com/skeletonarmytech/marrow-mcp) - Marrow Health: your Apple Health data over MCP, from the free iOS app. Reads, and writes on demand.

### Health Connect

- [Health Hub MCP (io.github.naymEvg/health-mcp)](https://github.com/naymEvg/health-conect-mcp) - Self-hosted MCP server for Android Health Connect — 34 metrics, daily rollups, dedup, 5 LLM tools.
- [HC Sync: Health Connect data (io.github.shaharfrish6/hc-sync)](https://hcsync.dev/mcp.html) - Read Android Health Connect users, daily summaries and records synced to your backend.

### Google Health API

- [io.github.davidmosiah/google-health-mcp](https://github.com/davidmosiah/google-health-mcp) - Privacy-first unofficial Google Health API v4 MCP server for health, sleep, activity, HR agents.
- [io.github.partymola/google-health-mcp](https://github.com/partymola/google-health-mcp) - MCP server for the Google Health API, with a local SQLite cache and trend analysis.

### Fitbit

- [io.github.davidmosiah/fitbitmcp](https://github.com/davidmosiah/fitbit-mcp) - Privacy-first, unofficial Fitbit MCP server for AI health, sleep, activity and heart-rate agents.
- [io.github.partymola/fitbit-mcp](https://github.com/partymola/fitbit-mcp) - Retired, superseded by google-health-mcp. Fitbit Web API shuts down 30 Sept 2026. Marked deprecated in the registry.
- [Fitbit MCP by usefulapi (io.usefulapi/fitbit)](https://github.com/m190/usefulapi-mcp) - Read Fitbit profile, activity, sleep, heart rate and device data.

### Samsung Health

- [io.github.davidmosiah/samsung-health-mcp](https://github.com/davidmosiah/samsung-health-mcp) - Unofficial local-first MCP server for Samsung Health personal-data CSV/ZIP exports.

### Garmin

- [garmlink (ai.garmlink/garmlink)](https://github.com/svassaux/garmlink.ai) - Garmin watch data for AI assistants: activities, sleep, HRV, recovery. Never writes to Garmin.
- [durely insights MCP for Garmin (app.durely/garmin-insights-mcp)](https://github.com/durely/garmin-insights-mcp) - Your full Garmin history, kept locally, analysed down to the second, via the official Personal API.
- [Garmin MCP (com.garminmcp/garmin)](https://garminmcp.com) - Read-only Garmin data for your AI: sleep, Body Battery, activities, laps, and training status.
- [Simma (com.getsimma/simma)](https://getsimma.com/resources/connect-simma-to-claude) - Your swim, run and ride training, explained. For coaches and athletes, computed from Garmin data.
- [Garmin — MissingMCP (com.missingmcp/garmin)](https://github.com/VelkyVenik/missingmcp) - Garmin data in Claude: 135 tools — activities, sleep, HRV, training, workouts. Free, open source.
- [Nutrition by Pack4Back (com.pack4back/nutrition)](https://github.com/pack4back/garmin-nutrition) - Log meals, water, and weight to Garmin Connect from Claude or ChatGPT.
- [tri-train (com.tri-train/tri-train)](https://tri-train.com/en/claude) - Your triathlon training in Claude: activities, PMC load, plans pushed to Garmin, races, recovery.
- [Weight Forecast (com.weight-forecast/weight-forecast)](https://www.weight-forecast.com/) - Know your goal-weight date. Log food, sync Garmin, get a daily AI coach in Telegram.
- [Garmin Connect MCP Server and API by Cotlet (dev.cotlet/garmin)](https://github.com/cotlet-connect/garmin-mcp) - Garmin Connect fitness and health tracking MCP server: list activities, download FIT file.
- [Running Workout (fr.runningworkout/running-workout)](https://www.runningworkout.fr/) - AI coach for Garmin: builds training plans and structured workouts, synced straight to your watch.
- [Garmin Connect Personal API (io.github.DynamicsNinja/garmin-connect-personal-api)](https://github.com/DynamicsNinja/connect-personal-api-js) - Read your Garmin sleep, HRV, steps, stress, Body Battery, and activities (unofficial)
- [Garmin Connect (io.github.DynamicsNinja/garminconnect)](https://github.com/DynamicsNinja/garminconnect-js) - Unofficial Garmin Connect access: sleep, HRV, training, activities, workouts and weight.
- [hybridlog (io.github.Imgrund/hybridlog)](https://github.com/Imgrund/hybridlog) - Reads your own Garmin mirror: readiness, training load, muscle freshness, and read-only SQL.
- [Garmin Personal MCP (io.github.Mason-Levyy/garmin-personal-mcp)](https://github.com/Mason-Levyy/garmin-personal-mcp) - Garmin Connect on Garmin's official Personal API: sleep, HRV, body battery, activities.
- [io.github.NasserAlbusaidi/macrofactor-mcp](https://github.com/NasserAlbusaidi/macrofactor-mcp) - Fueling & recovery decision engine combining MacroFactor nutrition with Garmin training data.
- [Paceva for Garmin (io.github.OwenScheuer/paceva-garmin)](https://github.com/OwenScheuer/paceva-garmin-mcp) - Your own Garmin Connect data: sleep, HRV, Body Battery and activities. Local, read-only.
- [io.github.anup-shesh/garmin-local-mcp](https://github.com/anup-shesh/garmin-local-mcp) - Local-first Garmin data warehouse: sync once to SQLite, analyze trends and correlations offline.
- [OwnMetrics (io.github.badisbenhamida/ownmetrics-mcp)](https://github.com/badisbenhamida/ownmetrics-mcp) - Ask AI apps about your own Garmin data via Garmin's official Personal API. Unofficial.
- [Run Coach (io.github.chenhunghan/garmin-mcp-app)](https://github.com/chenhunghan/garmin-mcp-app) - Garmin data with interactive charts: daily briefing, training trends, workout planning. Unofficial.
- [io.github.colincooperio/garmin-mcp](https://github.com/colincooperio/garmin-mcp) - Ask your AI assistant about your Garmin training, sleep and recovery data.
- [io.github.davidmosiah/garminmcp](https://github.com/davidmosiah/garmin-mcp) - Privacy-first unofficial Garmin Connect MCP for AI health, sleep, activity & recovery agents.
- [ConnectIQ MCP Server (io.github.deugene/connect-iq-mcp)](https://github.com/deugene/connect-iq-mcp.git) - MCP server for Garmin ConnectIQ SDK documentation and resources.
- [Runspector — AI running coach for Garmin (io.github.edxleon/runspector)](https://github.com/edxleon/runspector) - AI running coach for Garmin: HRV, readiness and VO2max explained, workouts on your watch.
- [io.github.endurancetools/garmin-mcp](https://github.com/endurancetools/garmin-mcp) - Unofficial Garmin Connect server: training load, form, HRV readiness and workouts for your watch.
- [Garmin Dynamic MCP (io.github.fabriziodebortoli/garmin-dynamic-mcp)](https://github.com/fabriziodebortoli/garmin-dynamic-mcp) - Read-only access to your Garmin Connect data. Key in the OS keychain, self-updating catalog.
- [Fitness AI Connector (io.github.fmp-projects/fitness-ai-connector)](https://github.com/fmp-projects/fitness-ai-connector) - Garmin data in Claude & ChatGPT via the Garmin Health API. OAuth sign-in, no password sharing.
- [Futureweb Intervals MCP (io.github.futureweb/intervals-mcp-server)](https://github.com/futureweb/intervals-mcp-server) - Self-hosted Intervals.icu MCP server: training analytics, Garmin data, wellness, workout planning.
- [Garmin Connect Personal API (io.github.hannta/garmin-connect-personal-api-mcp)](https://github.com/hannta/garmin-connect-personal-api-mcp) - Read-only Garmin Connect data on Garmin's official Personal API: training, sleep, HRV, recovery.
- [Garmin Connect (io.github.happyc0der/garmin-connect-api)](https://github.com/happyc0der/garmin-connect-api) - Read and write Garmin Connect: activities, strength sets, health data, workouts and weigh-ins.
- [Connect IQ MCP (io.github.idoo/connect-iq-mcp)](https://github.com/idoo/connect-iq-mcp) - MCP server for Garmin Connect IQ developers: store portal, SDK builds, simulator. Read-only default.
- [io.github.mbrionesalvarez/caddie-mcp](https://github.com/mbrionesalvarez/caddie-mcp) - Your Garmin golf data in Claude: GPS shots, strokes gained, club distances, health context.
- [Garmin Connect (treinos) (io.github.mcp-dir/garmin-mcp)](https://github.com/mcp-dir/garmin-mcp) - List, fetch, create, edit (replace), delete and schedule structured workouts on Garmin Connect (runn.
- [io.github.pablo-albaladejo/kaiord](https://github.com/pablo-albaladejo/kaiord) - Convert, validate, and inspect workout files (FIT, TCX, ZWO, Garmin Connect) for AI agents.
- [Garmin Workouts MCP (io.github.pranciskus/garmin-workouts-mcp)](https://github.com/pranciskus/garmin-workouts-mcp) - Manage Garmin Connect workouts, including strength workouts with mapped exercises.
- [Garmin Connect (unofficial) (io.github.sasha-sup/garmin-mcp)](https://github.com/sasha-sup/garmin-mcp) - Unofficial read-only Garmin Connect data: sleep, HRV, heart rate, stress, recovery analysis.
- [io.github.slaat/garmin-connect-workouts-mcp](https://github.com/slaat/garmin-connect-workouts-mcp) - Turn plain language into real workouts on your Garmin watch: pace, HR, power, intervals, swim sets.
- [io.github.snoozelieb/coach-mcp](https://github.com/snoozelieb/coach-mcp) - Adaptive AI training coach MCP server backed by Garmin Connect.
- [Garmin MCP by geekist.co (io.github.theGeekist/garmin-mcp)](https://garmin.geekist.co/) - Explore Garmin activity and health data with your AI assistant.
- [Pulsai — Garmin for any AI (me.pulsai/garmin)](https://pulsai.me) - Hosted MCP: your Garmin data (activities, sleep, HRV) in Claude, ChatGPT & Gemini.

### Oura

- [ai.smithery/eliu243-oura-mcp-server](https://github.com/eliu243/oura-mcp-server) - Connect your Oura Ring account and enable access to your wellness data in apps and automations. In…
- [ai.smithery/eliu243-oura-mcp-server-2](https://github.com/eliu243/oura-mcp-server) - Connect your Oura Ring account to enable secure, authenticated access in your workflows. Generate…
- [ai.smithery/eliu243-oura-mcp-server-eliu](https://github.com/eliu243/oura-mcp-server) - Connect your Oura Ring account securely in minutes. Enable authorized access to your sleep, activi…
- [Health OS (app.health-os/health-os)](https://health-os.app/en/ai) - N-of-1 health experiments in your AI assistant: Oura/RescueTime data, protocols, workouts.
- [Oura Ring (io.github.AntVsl/oura-mcp)](https://github.com/AntVsl/oura_mcp) - Sleep, readiness, HRV, resting heart rate, activity and stress from your Oura Ring.
- [Oura Ring (io.github.YasuakiOmokawa/oura-mcp)](https://github.com/YasuakiOmokawa/oura-mcp) - MCP server for Oura Ring API v2 (sleep, activity, readiness, heart rate, workouts).
- [io.github.davidmosiah/ouramcp](https://github.com/davidmosiah/oura-mcp) - Privacy-first, unofficial Oura MCP server for AI health, sleep, activity and heart-rate agents.
- [io.github.jordanburke/oura-ring-mcp-server](https://github.com/jordanburke/oura-ring-mcp-server) - Oura Ring MCP server for the Oura API v2: sleep, readiness, activity, heart rate, and more.
- [io.github.mitchhankins01/oura-ring-mcp](https://github.com/mitchhankins01/oura-ring-mcp) - Connect your Oura Ring to Claude AI assistants. Health metrics with smart analysis tools.
- [Oura Ring (io.github.osjayaprakash/oura-ring-python-mcp)](https://github.com/osjayaprakash/oura-ring-python-mcp) - Read-only Oura Ring sleep, readiness, activity, stress and heart rate data (OAuth2)
- [io.github.proscar87/oura-mcp](https://github.com/proscar87/oura-mcp) - The Oura v2 API as an MCP server. Paginates, fixes the date range, warns when data is missing.
- [Oura Ring (read-only) (io.github.royreznik/oura-ring-mcp)](https://github.com/royreznik/oura-ring-mcp) - Read-only access to your Oura Ring readiness, sleep, activity, HRV, heart rate and trends.
- [Oura MCP by usefulapi (io.usefulapi/oura)](https://github.com/m190/usefulapi-mcp) - Read sleep, readiness, activity, stress, heart rate and workouts from the Oura Ring.
- [MCP for Oura (link.smirnov/mcp-oura)](https://github.com/Smirnov-Labs/mcpforoura) - Multi-tenant hosted MCP server for Oura Ring — 21 read-only tools, OAuth per user.
- [Passport.Me (me.passport/mcp)](https://passport.me/developers) - Your Gmail, Calendar, Drive, GitHub, Oura, wallet and confirmed profile facts in any MCP client.

### WHOOP

- [WHOOP — MissingMCP (com.missingmcp/whoop)](https://github.com/VelkyVenik/missingmcp) - WHOOP recovery, strain, sleep and workouts in Claude via official WHOOP OAuth. Free, open source.
- [WHOOP MCP Server and API by Cotlet (dev.cotlet/whoop)](https://cotlet.dev/integrations/whoop-api-mcp-server) - WHOOP fitness and recovery tracking MCP server: get day summary, list recoveries, list sleeps.
- [io.github.AshwanthramKL/whoop-mcp](https://github.com/AshwanthramKL/whoop-mcp) - Read-only WHOOP v2 data for MCP clients, with local SQLite cache and CSV/JSONL/Parquet exports.
- [WHOOP Health Signals (io.github.Yadheedhya06/mcp-server-whoop)](https://github.com/Yadheedhya06/mcp-server-whoop) - Local-first, read-only WHOOP MCP server for recovery, sleep, strain, workouts, and body signals.
- [io.github.Zayden16/whoop-mcp-server](https://github.com/Zayden16/whoop-mcp-server) - MCP server for the official Whoop API v2: cycles, recovery, sleep, workouts, and profile data.
- [io.github.briangaoo/totem](https://github.com/briangaoo/totem) - Totem — talk to your wearables with AI. Today: full Whoop access (48 tools).
- [io.github.briangaoo/whoop-mcp](https://github.com/briangaoo/whoop-mcp) - Full read + write access to your Whoop fitness data via the private iOS API. 48 tools.
- [WHOOP MCP (io.github.cunicopia-dev/whoop-postgres-mcp)](https://github.com/cunicopia-dev/whoop-mcp) - Sync WHOOP recovery, sleep, strain, and workouts into Postgres and query them from any MCP client.
- [io.github.davidmosiah/whoop-mcp](https://github.com/davidmosiah/whoop-mcp) - Privacy-first, unofficial WHOOP MCP server for AI health, sleep, recovery, and performance agents.
- [WHOOP (io.github.mcp-dir/whoop-mcp)](https://github.com/mcp-dir/whoop-mcp) - Your WHOOP data in the assistant, read-only: recovery, sleep, strain, workouts, cycles and body meas.
- [io.github.mselcukozturk/hevy2whoop](https://github.com/mselcukozturk/hevy2whoop) - Copy Hevy strength workouts into WHOOP Strength Trainer sets with reps and weight.
- [WHOOP (read-only) (io.github.oryanomer1/whoop-mcp)](https://github.com/oryanomer1/whoop-mcp) - Read-only access to your WHOOP recovery, HRV, sleep, strain, workouts and trends.
- [io.github.rajdeepmondaldotcom/whoop-mcp](https://github.com/rajdeepmondaldotcom/whoop-mcp-server) - WHOOP recovery, sleep, strain, and workouts for any AI. Analysis tools, demo mode, fast setup.
- [io.github.rajdeepmondaldotcom/whoop-mcp-server](https://github.com/rajdeepmondaldotcom/whoop-mcp-server) - WHOOP recovery, sleep, strain, and workouts for any AI. Analysis tools, demo mode, fast setup.
- [io.github.shashankswe2020-ux/whoop](https://github.com/shashankswe2020-ux/whoop-mcp) - MCP server for WHOOP health data — recovery, sleep, workouts, cycles, and trends.
- [io.github.souravpn/whoop-mcp](https://github.com/souravpn/whoop-mcp) - MCP server for WHOOP — gives Claude access to your recovery, sleep, strain, and workout data.
- [io.github.thebriangao/totem](https://github.com/thebriangao/totem) - Totem — talk to your wearables with AI. Today: full Whoop access (48 tools).
- [Whoop MCP Server (io.github.yuridivonis/whoop-mcp-server)](https://github.com/yuridivonis/whoop-mcp-server) - Your WHOOP recovery, sleep, strain and workouts in Claude, ChatGPT or other MCP apps. Self-hosted.
- [WHOOP MCP by usefulapi (io.usefulapi/whoop)](https://github.com/m190/usefulapi-mcp) - Read WHOOP recovery, sleep, cycles, workouts and body measurements.

### Polar

- [Polar Health Data (self-hosted) (io.github.StuMason/polar-flow-server)](https://github.com/StuMason/polar-flow-server) - Self-hosted Polar health analytics with a built-in MCP server: sleep, HRV, workouts, baselines.
- [io.github.davidmosiah/polarmcp](https://github.com/davidmosiah/polar-mcp) - Privacy-first unofficial Polar AccessLink v4 MCP server for AI health, sleep and training agents.

### Withings

- [Withings Health Data (io.github.akutishevsky/withings)](https://github.com/akutishevsky/withings-mcp) - MCP server for Withings health data — sleep, activity, heart, and body metrics.
- [io.github.davidmosiah/withingsmcp](https://github.com/davidmosiah/withings-mcp) - Privacy-first, unofficial Withings MCP server for AI health, sleep, activity and heart-rate agents.
- [io.github.partymola/withings-mcp](https://github.com/partymola/withings-mcp) - MCP server for the Withings Health API with OAuth, local SQLite cache, and trend analysis.

### Suunto

- [Suunto MCP (io.github.googlarz/suunto-mcp)](https://github.com/googlarz/suunto-mcp) - Suunto watch data (workouts, sleep, recovery, 24/7 activity) for Claude and other AI assistants.
- [io.github.mrfentmen/suunto-mcp](https://github.com/mrfentmen/awesome-mcps) - Suunto API: workout history, summaries. Needs OAuth token.

### COROS

- [COROS (io.github.coroslab/coros-mcp)](https://github.com/coroslab/COROS-MCP) - Access COROS activity, training and health data, and manage training plans and workouts.

### Dexcom

- [io.github.davidmosiah/wellness-cgm-mcp](https://github.com/davidmosiah/wellness-cgm-mcp) - Local-first CGM MCP for AI agents: Dexcom Developer API + FreeStyle Libre via LibreLink Up.

### Strava

- [HAPI Strava MCP Server (ai.com.mcp/strava)](https://github.com/la-rebelion/hapimcp) - Strava MCP tools for AI: athletes, activities, segments, clubs, routes. Powered by HAPI MCP server.
- [Strava MCP Server and API by Cotlet (dev.cotlet/strava)](https://github.com/cotlet-connect/strava-mcp) - Strava running cycling activity tracking MCP server: list activities, update activity gear.
- [Strava Training MCP (io.github.ArjanLig/strava-mcp)](https://github.com/ArjanLig/strava-mcp) - Connect Strava training data to Claude for training load analysis and activity insights.
- [io.github.davidmosiah/strava-mcp](https://github.com/davidmosiah/strava-mcp) - Privacy-first MCP server for Strava activities, streams, routes and training.
- [io.github.ljcl/strava-mcp](https://github.com/ljcl/strava-mcp) - Remote MCP server for your Strava activities, segments, and routes.
- [Strava MCP Bridge (io.github.millerchou/strava-mcp-bridge)](https://github.com/millerchou/strava-mcp-bridge) - Use Strava's official MCP from Codex and other local stdio clients without a developer app.
- [io.github.musette-cc/musette-mcp](https://github.com/musette-cc/musette-mcp) - AI soigneur for cyclists: Strava ride to an Ien-Vitse-validated nutrition plan + orderable box.
- [io.github.r-huijts/strava-mcp](https://github.com/r-huijts/strava-mcp) - MCP server for accessing Strava API.

### MyFitnessPal

- [MyFitnessPal MCP Server and API by Cotlet (dev.cotlet/myfitnesspal)](https://cotlet.dev/integrations/myfitnesspal-api-mcp-server) - MyFitnessPal calorie and nutrition tracking MCP server: get diary day, search foods, log food.
- [MyFitnessPal MCP (io.github.Mason-Levyy/mfp-mcp)](https://github.com/Mason-Levyy/myfitnesspal-mcp) - Log MyFitnessPal by talking to your AI: search foods with macros, log meals, weight, water and more.

### Cronometer

- [Cronometer MCP Server and API by Cotlet (dev.cotlet/cronometer)](https://cotlet.dev/integrations/cronometer-api-mcp-server) - Cronometer personal nutrition tracker MCP server: get diary day, log food, get nutrition summary.
- [Cronometer MCP (io.github.atticoos/cronometer-mcp)](https://github.com/atticoos/cronometer-mcp) - Review nutrition, log meals, and manage foods and recipes in your Cronometer account.
- [io.github.cphoskins/cronometer](https://github.com/cphoskins/cronometer-mcp) - MCP server for Cronometer — food logs, macros, fasting, biometrics, and recurring foods.
- [Cronometer (io.github.ekelly95/cronometer-mcp)](https://github.com/ekelly95/cronometer-mcp) - Your Cronometer diary, nutrition with honest coverage (missing is never zero), and safe writes.
- [io.github.rwestergren/cronometer-api-mcp](https://github.com/rwestergren/cronometer-api-mcp) - MCP server for Cronometer nutrition tracking — food logs, diary, macros, fasting.

### Junction (formerly Vital)

- [Vital MCP by usefulapi (io.usefulapi/vital)](https://github.com/m190/usefulapi-mcp) - Read wearables and lab health data — sleep, activity, workouts, timeseries, lab tests and orders.

### Several sources

- [Cycling Coach AI (com.cyclingcoachai/cycling-coach-ai)](https://registry.modelcontextprotocol.io/v0.1/servers/com.cyclingcoachai%2Fcycling-coach-ai/versions/1.0.0) - AI cycling coach: training plans, workouts, nutrition, strength training, Strava, Garmin and Wahoo.
- [PulsVy (com.pulsvy/pulsvy)](https://pulsvy.com/) - Your Google Health data (Fitbit, Pixel Watch): sleep, HRV, readiness and biological age.
- [Shape (com.shapecalendar/shape)](https://shapecalendar.com/help/mcp-server) - Training calendar, workouts and health data from Garmin, Wahoo, Polar, Apple Health and more.
- [athletedata (health.athletedata/mcp)](https://github.com/athletedata-health/mcp) - Your Garmin, Oura, WHOOP, Hevy and 35 more fitness apps, queryable from your own AI.
- [io.github.BerkKilicoglu/google-health-fitbit-mcp](https://github.com/BerkKilicoglu/google-health-fitbit-mcp) - Privacy-first Google Health API MCP server for health, sleep, activity and HR agents.
- [Leo Training (io.github.leo-runningcoach/coachleo)](https://github.com/leo-runningcoach/coachleo) - Running, trail and triathlon coach. Reads Strava, Garmin, COROS, Suunto, Polar. Adapts to your feel.
- [OpenAthlete (io.github.whz14/openathlete)](https://github.com/whz14/openathlete) - Unified Garmin and COROS training data, analysis, memory, and workout scheduling for AI agents.
- [Toolforest (io.toolforest/toolforest)](https://www.toolforest.io) - Hosted MCP server with managed OAuth for 15+ toolkits: Google Workspace, Fitbit, Oura, Kalshi, etc.
- [ghurt (org.ghurt/ghurt)](https://ghurt.org) - Query Garmin, Oura & Whoop sleep, HRV, recovery & training load from Claude or ChatGPT.
- [OpenAthlete (org.openathlete/mcp)](https://github.com/openathleteorg/openathlete) - Endurance training: activities, load, zones, and workouts sent to Garmin, COROS and Suunto watches.
- [Pacing Tools (tools.pacing/mcp)](https://pacing.tools/docs/mcp) - Ask your AI about your fitness: activities and data from Garmin, COROS, Strava, GPX and more.
- [Garmin & Strava for Claude and ChatGPT (training.stats/garmin)](https://stats.training/garmin-mcp) - Read-only Garmin and Strava data for your AI: activities, sleep, HRV, readiness, training load.

### Wearable, fitness and health data in general

- [iAM360 (ai.iam360.app/iam360)](https://app.iam360.ai/docs/mcp) - Access your iAM360 fitness record: wearable data, meals, workouts, challenges and journal.
- [Coach MCP (ai.iamcoach/coach)](https://www.iamcoach.ai/mcp) - Your endurance training data in your AI assistant: activities, recovery, plan, workout edits.
- [Povver — Strength Training (ai.povver/mcp-server)](https://github.com/bvatech/povver-mcp) - Your strength-training data for any AI assistant: workouts, progress, muscle volume, routines.
- [Rippd (ai.rippd/rippd)](https://rippd.ai/connectors) - Your Rippd training and nutrition data in your AI: food, workouts, weigh-ins, targets, coach notes.
- [ai.smithery/fitaf-ai-fitaf-ai-mcp](https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-ai-mcp/versions/1.0.0) - Manage workouts, nutrition, goals, and progress across the FitAF platform. Connect wearables, sync…
- [ai.smithery/fitaf-ai-fitaf-mcp](https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-mcp/versions/1.0.0) - Track workouts, nutrition, body metrics, habits, and SMART goals with insights and trends. Connect…
- [Wellness Project (ai.wellnessproject/wellness-project)](https://github.com/turnnoblindeye/wellness-project-mcp) - Connect your health, fitness, nutrition, sleep, and wearable data to your AI assistant.
- [Athlete Diary (app.athletediary/athlete-diary)](https://athletediary.app/connect) - Your workout log in chat: history, progress, records, muscle volume, body weight, programs.
- [Derny (app.derny/workouts)](https://derny.app/ai-workouts/) - Create, edit and organize structured workouts for your bike trainer, treadmill or elliptical.
- [Evertrain (app.evertrain/evertrain)](https://registry.modelcontextprotocol.io/v0.1/servers/app.evertrain%2Fevertrain/versions/1.0.0) - Manage your Evertrain training — programs, workouts, exercises, history, and coaching notes.
- [Framezone (app.framezone/framezone)](https://framezone.app/mcp-for-life-management) - Your life dashboard for AI: tasks, habits, goals, budgets, workouts, nutrition, journal, notes.
- [Heza (app.heza/heza)](https://heza.app/docs) - Bring-your-own-AI fitness coach: your AI logs and reads your food, lifting, runs, sleep and weight.
- [KinFit (app.kin-fit/kinfit)](https://kin-fit.app/docs/) - Your AI becomes your fitness coach. It writes your plan; the app tracks progress and health for it.
- [LiftChat (app.liftchat/liftchat)](https://liftchat.app/features/mcp) - Workout tracker with a chat assistant: routines, live workouts, history and progress stats.
- [Metodix — training log for coaches (app.metodix/metodix)](https://metodix.app) - Training log for coaches: your AI assistant finds clients, reads history, logs and plans workouts.
- [MoveMate: Gym Workout Tracker (app.movemate/movemate)](https://movemate.app/ai) - Gym workout tracker and planner: plan, log and analyze training from your own sets and weights.
- [OnlineFitness.app (app.onlinefitness/coach)](https://onlinefitness.app/ai) - Manage fitness coaching clients, workouts, programs, chats and funnels from your assistant.
- [PumpX (app.pumpx/pumpx)](https://pumpx.app/claude/) - Read-only access to your PumpX workout log: sessions, lift history, PRs, routines, measurements.
- [WOD Coach: AI Personal Trainer (app.railway.up.wod-api-production/wod-coach)](https://wod-api-production.up.railway.app/llms.txt) - Fitness MCP: AI personal trainer, workouts, injury exercise swaps, race pacing. Pay-per-call x402.
- [tectonic plates (app.tectonicplates/tectonic-plates)](https://github.com/stephaniewilkinson/tectonic) - Write whole barbell programmes, not just workouts: weeks, progressions, ramps, and plate maths.
- [GetFit (app.thegetfit/getfit)](https://thegetfit.app/for-agents.html) - Build a workout that fits your time, gear and body — free, no sign-in.
- [ThresholdLink (app.thresholdlink/thresholdlink)](https://thresholdlink.app) - Connect Intervals.icu to Claude and ChatGPT: read training, plan workouts. Training never stored.
- [TrainRec (app.trainrec/trainrec)](https://trainrec.app/) - Your AI assistant logs your meals and workouts, then plans your week from what you did.
- [Train Ultra (app.trainultra/coach)](https://github.com/trainultra/coach) - Ask your private endurance coach about your workouts, plan, goals, recovery and nutrition.
- [Overload (app.tryoverload/overload)](https://tryoverload.app/your-ai) - Log food and workouts in Overload from ChatGPT or Claude, then ask about your training and diet.
- [Moveat (app.wemoveat/moveat)](https://wemoveat.app) - Coaching app for fitness coaches: read client check-ins and diets, write drafts the coach sends.
- [Your Move Exercise Video API (app.ymove/exercise-api)](https://github.com/ymove-app/exercise-api-mcp) - 1,413+ HD exercise videos with muscles and instructions, plus workout and program generation.
- [ZeroPhase (app.zerophase/zerophase)](https://zerophase.app/mcp-server) - BUD/S prep training: read today's workout, log tasks and PST results from your agent.
- [Trainer Connect (br.com.trainerconnect/personal-trainer)](https://trainerconnect.com.br/assistentes-ia) - Manage students, workouts, appointments and payments through your personal trainer account.
- [Hyperhuman (cc.hyperhuman/hyperhuman)](https://mcp.hyperhuman.cc/) - Create, personalize and deliver branded workouts and programs from any AI assistant.
- [freddy (coach.freddy/freddy)](https://freddy.coach) - Connect your wearables, rings and training apps, then ask your AI about your own health data.
- [AIm Workout Journal (com.aim-journal/aim)](https://github.com/persistmcp/aim) - Workout journal Claude and ChatGPT write to: log workouts, get a program, see your progress.
- [Exercise Images (com.exerciseimages/exercise-images)](https://exerciseimages.com/developers) - 1 000+ exercise line drawings: find an exercise, list by body part or equipment, show a workout.
- [Fitai (com.fitailabs/fitai)](https://www.fitailabs.com/es/mcp) - Fitai MCP: read and manage clients, messages and appointments for fitness and nutrition pros.
- [Fitzap (com.fitzapapps/fitzap)](https://github.com/LinusWestling/FitzapMCP) - Read your Fitzap workout and nutrition data and create workout drafts and recipes for review.
- [com.getliftcompass/liftcompass](https://registry.modelcontextprotocol.io/v0.1/servers/com.getliftcompass%2Fliftcompass/versions/0.1.0) - Compare protein, creatine and pre-workout by price per serving, third-party testing and dose.
- [goblingains (com.goblingains/workouts)](https://goblingains.com/ai) - Conditioning workouts from a coached library: suggest, vary or invent one for your kit and time.
- [Gym Navigator Coach (com.gymnavigator/coach)](https://gymnavigator.com/coach/) - Plan workouts, find exercises and gyms, log sessions and track progress with Gym Navigator.
- [Gyms NJ directory (com.gymsnj/directory)](https://gymsnj.com/) - Gyms and fitness studios across New Jersey: hours, prices, free trials, and booking.
- [JustGains (com.justgains/mcp-server)](https://github.com/JustGains/justgains-connector) - Save workouts, read training history and progress, search exercises, and log food in JustGains.
- [Joti (com.kompetic/joti)](https://registry.modelcontextprotocol.io/v0.1/servers/com.kompetic%2Fjoti/versions/1.0.0) - Read your workouts, history, and stats; create and schedule new workouts. Writes are additive only.
- [Kove (com.kovejournal/kove)](https://github.com/kovejournal/kove-skills) - Your private health journal: log meals, workouts and anything you track, and ask about your days.
- [Kracey (com.kracey/mcp)](https://kracey.com) - Your training, fitness and race predictions, HYROX pacing, a race finder and training plans.
- [Nexus (com.kushalsm.nexus/nexus)](https://nexus.kushalsm.com/) - Calorie, workout and body-weight log inside ChatGPT and Claude. Log meals by text, photo or voice.
- [LiftTrack (com.lifttrackapp/lifttrack)](https://lifttrackapp.com) - Manage strength workouts and track exercise progress. Requires a LiftTrack account.
- [MyoAmigo (com.myoamigo/myoamigo)](https://www.myoamigo.com) - Agent-first strength-training platform across iOS, Web & MCP: read & write workouts, PRs & plans.
- [CDC PLACES Health Data (com.olyport/cdc-places)](https://olyport.com) - County and tract-level health outcomes, behaviors, and preventive services from CDC PLACES.
- [Pacelab Intervals (com.pacelabintervals/workouts)](https://pacelabintervals.com/claude) - Create and schedule interval workouts (Tabata, AMRAP, EMOM) from your real training history.
- [Parameter (com.parameterfit/parameter)](https://parameterfit.com) - Your AI writes training plans that arrive as structured workouts on iPhone and Apple Watch.
- [Play This Life (com.playthislife/play-this-life)](https://www.playthislife.com/facts) - Your whole life in one planner: projects, tasks, habits, routines, workouts and chores.
- [Hearth (com.protoductai/hearth)](https://legal.hearth.protoductai.com) - Log meals, weight and workouts in Hearth and review your progress. Subscription required.
- [Reps: Gym Workout Log (com.repsworkout/reps)](https://repsworkout.com/connect?utm_source=mcp-registry) - Gym workout log for iPhone and Android: ask Claude or ChatGPT about your lifts, PRs and plans.
- [Rhylthyme (com.rhylthyme/rhylthyme)](https://github.com/rhylthyme/rhylthyme-mcp) - Real-time multi-track schedules for cooking, lab protocols, events and workouts. Validate and share.
- [RIRLift (com.rirlift/rirlift)](https://www.rirlift.com/ai/) - Your RIRLift strength training log: workouts, progress, volume, recovery and program drafts.
- [Sport MCP (com.sport-mcp/sport-mcp)](https://sport-mcp.com) - Strength-training log for iPhone: read workouts, records and progress; plan and log training.
- [Superset Fitness Coaching (com.supersetapp/training)](https://www.supersetapp.com/mcp) - Fitness MCP for coaches and gyms: build workouts and read clients' training from live Superset data.
- [Tredict (com.tredict/mcp-server)](https://github.com/tredict-com/mcp-server) - Analyse activities, build training plans and sync structured workouts to your sports watch.
- [Wellnizz (com.wellnizz/health)](https://wellnizz.com/) - Your lab results, DNA files and wearable data explained in your agent, with action plans. EU-hosted.
- [WorkoutLog Pro (com.workoutlogpro/workoutlog)](https://workoutlogpro.com) - Workout log your AI fills in: sets from text or notebook photos, daily plans, history and records.
- [dev.anatome/anatome](https://anatome.dev) - Log workouts and meals by telling your AI. 873 exercises, muscle diagrams, food lookup.
- [ClassPass MCP Server and API by Cotlet (dev.cotlet/classpass)](https://cotlet.dev/integrations/classpass-api-mcp-server) - ClassPass fitness class booking marketplace MCP server: search classes, list reservations.
- [CoachingPortal by Cotlet (dev.cotlet/coachingportal)](https://cotlet.dev/integrations/coachingportal-api-mcp-server) - Manage clients, workout and meal plans, check-ins, habits.
- [FitBudd MCP Server and API by Cotlet (dev.cotlet/fitbudd)](https://cotlet.dev/integrations/fitbudd-api-mcp-server) - FitBudd fitness coach client management MCP server: add client, schedule workout, review check-ins.
- [FitSW MCP Server and API by Cotlet (dev.cotlet/fitsw)](https://cotlet.dev/integrations/fitsw-api-mcp-server) - FitSW personal trainer management MCP server: add client, assign program, create workout.
- [Kahunas MCP Server and API by Cotlet (dev.cotlet/kahunas)](https://cotlet.dev/integrations/kahunas-api-mcp-server) - Kahunas fitness coaching platform MCP server: list check-ins, assign workout plan, add client.
- [Mariana Tek MCP Server and API by Cotlet (dev.cotlet/mariana-tek)](https://cotlet.dev/integrations/mariana-tek-api-mcp-server) - Mariana Tek boutique fitness studio management MCP server: list classes, book reservation.
- [Mindbody MCP Server and API by Cotlet (dev.cotlet/mindbody)](https://cotlet.dev/integrations/mindbody-api-mcp-server) - Mindbody fitness wellness studio management MCP server: list classes, get class roster.
- [Momence MCP Server and API by Cotlet (dev.cotlet/momence)](https://cotlet.dev/integrations/momence-api-mcp-server) - Momence fitness wellness studio booking MCP server: list sessions, book customer into class.
- [TrainingPeaks MCP Server and API by Cotlet (dev.cotlet/trainingpeaks)](https://cotlet.dev/integrations/trainingpeaks-api-mcp-server) - TrainingPeaks endurance training platform MCP server: list calendar workouts, get workout details.
- [TrueCoach MCP Server and API by Cotlet (dev.cotlet/truecoach)](https://cotlet.dev/integrations/truecoach-api-mcp-server) - TrueCoach personal trainer coaching MCP server: list clients, create workout, assign program.
- [WellnessLiving MCP Server and API by Cotlet (dev.cotlet/wellnessliving)](https://cotlet.dev/integrations/wellnessliving-api-mcp-server) - WellnessLiving fitness and wellness management MCP server: book client into class, book appointment.
- [MTFIT Programming (dev.workers.mtfit-mcp.mtfit-mcp/programming)](https://mtfit.ca) - Workout plans, meal plans and macros from a real personal trainer's rules. Pay per call with x402.
- [OutPace (fit.outpace/outpace)](https://www.outpace.fit/developers/mcp) - Free step and fitness challenges on OutPace for friends, run clubs, teams and military units.
- [Splyt (fit.splyt/splyt)](https://splyt.fit/ai) - Read-only access to your Splyt workouts, records, training plan, habits and sleep.
- [Swole.fit (fit.swole/swole)](https://www.swole.fit) - Swole.fit: your training plan, workout history and food log for your AI assistant (read-only).
- [depot.fitness (fitness.depot/strength-programs)](https://depot.fitness) - Search 101 structured strength-training programs, exercises and guides from depot.fitness.
- [Embark (fitness.embark/embark)](https://www.embark.fitness/features/ai-assistants) - Ask about your training, log sessions and query your history in Embark.
- [Bodywise Fitness and Nutrition (io.bodywise/mcp)](https://bodywise.io) - Public fitness and nutrition calculators, exercise information, and evidence-based guides.
- [Joy2Move Home Exercise Library (io.github.AG-ITAcademy/home-fitness-exercise-library)](https://github.com/AG-ITAcademy/home-fitness-exercise-library) - Find home exercises, equipment variations and reviewed 15-second video demonstrations.
- [Aidlab MCP (io.github.Aidlab/aidlab-mcp)](https://github.com/Aidlab/aidlab-mcp) - Read your Aidlab sleep, heart rate, HRV, steps and workouts through OAuth. Read-only access.
- [Dofek (io.github.Asherlc/dofek)](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Asherlc%2Fdofek/versions/0.1.0) - Private health and fitness analytics through a secure remote MCP connection.
- [io.github.CSOAI-ORG/fitness-ai-mcp](https://github.com/CSOAI-ORG/fitness-ai-mcp) - Fitness Ai MCP Server by MEOK AI Labs. Marked deprecated in the registry.
- [io.github.CSOAI-ORG/sleep-tracker-ai-mcp](https://github.com/CSOAI-ORG/sleep-tracker-ai-mcp) - Sleep Tracker Ai MCP Server by MEOK AI Labs.
- [io.github.CSOAI-ORG/workout-planner-ai-mcp](https://github.com/CSOAI-ORG/workout-planner-ai-mcp) - MCP server for workout planner ai. Features create workout, track progress, suggest exercises. From.
- [Eclipse Zenith MCP (io.github.CYAN-ECLIPSE-TECHNOLOGIES-LLC/zenith)](https://eclipsebazaar.com) - The fitness module of Eclipse Procure — reads the machine, turns the dial under a safety ladder.
- [io.github.CloudCorpRecords/exercisedb](https://github.com/CloudCorpRecords/exercisedb) - YMove exercise video API: search exercises, generate workouts and multi-week programs.
- [io.github.CloudCorpRecords/healthfolder](https://github.com/CloudCorpRecords/healthfolder) - Read a Health Access folder of Apple Watch workouts and vitals; write training plans back as files.
- [io.github.CloudCorpRecords/supprecord](https://github.com/CloudCorpRecords/supprecord) - Dated formula history, confirmed changes, and evidence for U.S. pre-workout supplements.
- [Plan My Workout (io.github.GoodTurnStudio/planmyworkout)](https://github.com/GoodTurnStudio/goodturn-mcp) - A workout plan for your goal, level, days and equipment, and how to do any exercise.
- [Sync My Cycle (io.github.GoodTurnStudio/syncmycycle)](https://github.com/GoodTurnStudio/goodturn-mcp) - Your likely menstrual cycle phase today and this week, with food and workout ideas.
- [mifit (io.github.Jenwein/mifit)](https://github.com/Jenwein/mifit) - Read-only access to your own Mi Fitness (Xiaomi) data: sleep, heart rate, steps, workouts.
- [Fitatu (io.github.Jezue/fitatu-api)](https://github.com/Jezue/fitatu_library) - Unofficial Fitatu calorie counter: read and log food, weight, water and workouts.
- [STRUGGL Hybrid Coach (io.github.Kubyer/struggl)](https://github.com/Kubyer/struggl-mcp) - Zero-LLM-Math sports science calculators (Hyrox, 1RM/RPE, Zone 2, MEV/MRV) & workout ledger.
- [Hybriqx Workout Adaptation (io.github.LKennedyShare/hybriqx-workout-adaptation)](https://github.com/LKennedyShare/hybriqx-workout-assistant) - Advisory workout adaptation via hosted MCP and x402. Python buyer with operator-approved tools.
- [Paceva (io.github.OwenScheuer/paceva)](https://github.com/OwenScheuer/paceva-MCP) - Your swim, bike and run training: readiness, HRV, sleep, workouts and race predictions. Read-only.
- [Quantified Self MCP (io.github.Thecimal/quantified-self-mcp)](https://github.com/Thecimal/quantified-self-mcp) - Local-first MCP server for personal health data with privacy, statistical evidence, and provenance.
- [TrainBud (io.github.Zsadigzade/trainbud)](https://github.com/Zsadigzade/trainbud) - Talk to your own fitness data. Findings computed in code against your own 28-day baselines.
- [bodylog (io.github.abhaymettu/bodylog)](https://github.com/abhaymettu/bodylog) - Agent-first workout and food log: sets and meals from chat, USDA and Open Food Facts macros, cards.
- [Fitness Tools (io.github.almostjacked/fitness-tools)](https://github.com/almostjacked/fitness-tools) - Deterministic fitness calculators — TDEE, adaptive TDEE, body fat, 1RM, macros — with consensus.
- [Health Data (your own Supabase) (io.github.almostjacked/health-mcp)](https://github.com/almostjacked/health-mcp) - Your health data (weight, macros, weigh-ins) as MCP tools — in your own Supabase, zero custody.
- [health-os (io.github.andronaft/health-os)](https://github.com/andronaft/health-os) - Local-first personal health record: labs, meds, wearables, food log, deterministic safety checks.
- [io.github.anthesiallc/meddata](https://github.com/anthesiallc/meddata-mcp) - Drug & supplement lookup and interaction checks from free U.S. government health data.
- [HouseExhale (io.github.attachmentnerd/houseexhale)](https://houseexhale.com/ai) - Explain bedroom CO2 readings, check certified HRV/ERV airflow, and find US installers and rebates.
- [SisRUN Training Plan (io.github.cdutr/sisrun-mcp)](https://github.com/cdutr/sisrun-mcp) - Read your SisRUN (appsisrun.com.br) training plan: prescribed workouts, pace/HR windows, structure.
- [Hevy MCP Server (io.github.chrisdoc/hevy-mcp)](https://github.com/chrisdoc/hevy-mcp) - MCP server for managing workouts, routines, and exercise data through the Hevy API.
- [API Tool Calls (io.github.cowerxdev/apitoolcalls)](https://apitoolcalls.com/agent.html) - 94 tools, one small door: home costs, fitness, QR, barcodes, Markdown, SEO, recalls.
- [MusclesWorked (io.github.csjoblom/musclesworked)](https://github.com/csjoblom/musclesworked-mcp) - Exercise-to-muscle mapping: 856 exercises, 65 muscles, workout analysis & alternatives.
- [io.github.cyanheads/cdc-health-mcp-server](https://github.com/cyanheads/cdc-health-mcp-server) - Search and query CDC public health data — mortality, vaccinations, surveillance, behavioral risk.
- [io.github.degenbmp-25/executive-performance](https://github.com/degenbmp-25/bmphumanengineering) - Free executive fitness diagnostic. Finds the primary performance lever.
- [io.github.dengxuhui/igpsport-mcp](https://github.com/dengxuhui/igpsport-mcp) - iGPSport cycling data with training metrics (NP/IF/TSS/CTL/ATL/TSB) and workout generation.
- [Hevy MCP (io.github.diecoscai/hevy-mcp)](https://github.com/diecoscai/hevy-mcp) - MCP server for the Hevy fitness API — spec-generated schemas, dry-run-safe writes, easy setup.
- [io.github.dropflyai/fitfly-engine](https://workout-engine-production-5dd7.up.railway.app/connect) - Deterministic fitness coaching engine: adaptive programs, progression math, readiness autoregulation.
- [WorkoutX Exercise API (io.github.furkanuruk/workoutx)](https://github.com/furkanuruk/workoutx-mcp) - Exercise API MCP: 1,900+ exercises with video, workout generator, supplements, dev tools.
- [io.github.gabrielmahia/kenya-health-mcp](https://github.com/gabrielmahia/kenya-health-mcp) - MCP server for Kenya health data: SHIF contributions (NHIF's successor), a small facility sample, ma.
- [io.github.hhopke/intervals-icu-mcp](https://github.com/hhopke/intervals-icu-mcp) - Read/write Intervals.icu MCP server: activities, wellness, calendar, gear, and workouts.
- [GymLog (io.github.jarm-dev/gymlog)](https://github.com/jarm-dev/gymlog-mcp) - Strength training log: read your workouts, stats and gyms, and plan, log or edit sessions.
- [io.github.jmbremer/rawwatts](https://rawwatts.com/ai/) - Smart trainer rides from the RawWatts iPhone app: power, heart rate, laps. Writes ERG workouts.
- [PRzilla (io.github.kangax/przilla)](https://github.com/kangax/przilla-mcp) - OAuth-protected CrossFit and HYROX catalog: workouts, benchmarks, and movement guides.
- [io.github.lgda-technologies/lgda-autonomic-node](https://github.com/lgda-technologies/lgda-autonomic-node) - Buy LGDA wellness music with USDC: 27 tracks, x402 payments, signed HRV receipts.
- [Fitness Starter – hand-picked gift ideas (io.github.maggat/fitness-gifts)](https://fitness-starter.vercel.app) - Hand-picked gift ideas for new runners and yogis, turned into shareable wishlists fast.
- [MFIT Personal (io.github.mcp-dir/mfit-mcp)](https://github.com/mcp-dir/mfit-mcp) - Client, workout, body composition, retention and finance management for personal trainers.
- [io.github.mrfentmen/wger-mcp](https://github.com/mrfentmen/wger-mcp) - Exercises, muscles, and workout data from the open wger database. No key required.
- [io.github.nftechie/transition-mcp](https://github.com/nftechie/transition-mcp) - AI-powered multisport coaching — workouts, training plans, and performance analytics.
- [Wger (Unofficial) (io.github.pipeworx-io/wger)](https://github.com/pipeworx-io/mcp-wger) - Unofficial Wger MCP — wraps wger Workout Manager REST API (free, no auth for read)
- [Hevy MCP (Remote) (io.github.rwestergren/hevy-mcp-remote)](https://github.com/rwestergren/hevy-mcp) - Hosted/gateway-ready Hevy fitness MCP: workouts, routines, templates.
- [Mi Fitness Data Bridge (io.github.shkyyy18/mi-fitness-data-bridge)](https://github.com/shkyyy18/mi-fitness-data-bridge) - Local-first bridge: export your own Mi Fitness (Xiaomi) health data to SQLite/JSON/CSV and MCP.
- [ATENA Decision Intelligence (io.github.shrek9999/atena)](https://github.com/shrek9999/atena-mvp) - Decision support for AI fitness agents: next-action choices under uncertainty and trade-offs.
- [io.github.shrynshjn/health-partner](https://github.com/shrynshjn/health_partner) - Manage your Health Partner account, log food, water, workouts, body using agent.
- [Open Health Sync (io.github.soma-intelligence/open-health-sync)](https://github.com/soma-intelligence/open-health-sync) - Read-only access to self-hosted health data: samples, sleep, workouts, nutrition, daily summaries.
- [Tally Workout (io.github.westvegh/tally-workout)](https://github.com/westvegh/tally-workout-mcp) - Strength log with a mobile app. Any MCP agent reads your training and plans workouts in the app.
- [io.github.wmarceau/fitness-influencer](https://github.com/MarceauSolutions/dev-sandbox) - AI-powered fitness content creator tools: video editing, image generation, workout plans, analytics.
- [SugarWOD MCP by usefulapi (io.usefulapi/sugarwod)](https://github.com/m190/usefulapi-mcp) - Read athletes, workouts, scores and movements; change an athlete's name or email in SugarWOD.
- [K01 Synthetic Health Data (is.k01/synthetic-health-data)](https://github.com/K01labs/k01-mcp-server) - Privacy-preserving synthetic health data generation. FHIR R4/R5 compliant.
- [twyn (life.twyn/twyn)](https://twyn.life/for-ai-agents) - Your labs, wearables, DNA and notes as one health record your AI agent can read (OAuth 2.1).
- [Heart (me.heart-of/heart)](https://github.com/kit-g/heart-api) - Your Heart workout log: workouts, records, templates, programs. Holds no health data.
- [Upfit Plan Builder (mobile.upfit/upfit)](https://www.upfit.mobile) - Read-only bodyweight workout builder and exercise form cues from the Upfit iPhone app.
- [no.sladd/mcp](https://sladd.no/api) - Detect and redact Norwegian PII (fodselsnummer, names, health data) in text and PDFs.
- [LiftBrain (online.liftbrain/liftbrain)](https://github.com/anetesa/liftbrain-mcp) - AI strength coach: writes your program, reads your logged sets, food and health data, adjusts loads.
- [Health Data (org.memoryapi/health)](https://registry.modelcontextprotocol.io/v0.1/servers/org.memoryapi%2Fhealth/versions/1.0.0) - Health data: NIH grants, WHO statistics, and genetic variants.
- [plus.gym/gym-plus](https://gym.plus) - Connect ChatGPT or Claude to your Gym Plus account to log and review workouts with AI coaching.
- [UK Fitness Pro (pro.ukfitness/personal-trainers)](https://mcp.ukfitness.pro/) - Find UK personal trainers by location, speciality, gender and price, and read their public profiles.
- [STAS Running Coach for Claude (run.stas/stas)](https://github.com/hivrich/stas.run) - Connect Claude to your Intervals.icu watch data for fitness, workout review, and plan writing.
- [uk.slate-hq/slate](https://slate-hq.uk/mcp-connector/) - Your own SLATE health data in your AI assistant: read, trend, plan and log. Never suggests a dose.
- [BearTrail (xyz.perpvue/mcp)](https://gitlab.com/xihay/beartrail-mcp) - Query workouts, browse exercises, and explore fitness data from BearTrail.

## Open datasets

Datasets aifitnessapi.com publishes, each as JSON and CSV under the license it states, versioned rather than overwritten.

- [Bluetooth Fitness GATT Characteristics 2026](https://aifitnessapi.com/datasets#bluetooth-fitness-gatt-2026) - JSON at https://aifitnessapi.com/datasets/bluetooth-fitness-gatt-2026.json, CSV beside it; CC BY 4.0.
- [Exercise Form Rules 2026 (joint-angle thresholds from open-source trackers)](https://aifitnessapi.com/datasets#exercise-form-rules-2026) - JSON at https://aifitnessapi.com/datasets/exercise-form-rules-2026.json, CSV beside it; CC BY 4.0.
- [Exercise Taxonomy Crosswalk 2026 (free-exercise-db, wger, ExerciseDB v1 to HealthKit and Health Connect)](https://aifitnessapi.com/datasets#exercise-taxonomy-crosswalk-2026) - JSON at https://aifitnessapi.com/datasets/exercise-taxonomy-crosswalk-2026.json, CSV beside it; CC BY 4.0.
- [Fitness API Changes & Deadlines 2026](https://aifitnessapi.com/datasets#fitness-api-changes-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-changes-2026.json, CSV beside it; CC BY 4.0.
- [Fitness API Docs Drift 2026 (how often the sources behind this site's quotes changed)](https://aifitnessapi.com/datasets#fitness-api-docs-drift-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-docs-drift-2026.json, CSV beside it; CC BY 4.0.
- [Fitness & Health API Glossary 2026](https://aifitnessapi.com/datasets#fitness-api-glossary-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-glossary-2026.json, CSV beside it; CC BY 4.0.
- [Fitness API Pricing Transparency 2026 (who publishes a price, per vendor)](https://aifitnessapi.com/datasets#fitness-api-pricing-transparency-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-pricing-transparency-2026.json, CSV beside it; CC BY 4.0.
- [Fitness API Shutdown Notice 2026 (announcement to end date, per graveyard entry)](https://aifitnessapi.com/datasets#fitness-api-shutdown-notice-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-shutdown-notice-2026.json, CSV beside it; CC BY 4.0.
- [State of Fitness APIs 2026](https://aifitnessapi.com/datasets#fitness-apis-2026) - JSON at https://aifitnessapi.com/datasets/fitness-apis-2026.json, CSV beside it; CC BY 4.0.
- [Google Health API Data Types 2026](https://aifitnessapi.com/datasets#google-health-api-data-types-2026) - JSON at https://aifitnessapi.com/datasets/google-health-api-data-types-2026.json, CSV beside it; CC BY 4.0.
- [Health Connect Permission Strings 2026](https://aifitnessapi.com/datasets#health-connect-permissions-2026) - JSON at https://aifitnessapi.com/datasets/health-connect-permissions-2026.json, CSV beside it; CC BY 4.0.
- [Health Connect Record Types 2026](https://aifitnessapi.com/datasets#health-connect-records-2026) - JSON at https://aifitnessapi.com/datasets/health-connect-records-2026.json, CSV beside it; CC BY 4.0.
- [Health Data Type Matrix 2026 (HealthKit ↔ Health Connect)](https://aifitnessapi.com/datasets#health-data-type-matrix-2026) - JSON at https://aifitnessapi.com/datasets/health-data-type-matrix-2026.json, CSV beside it; CC BY 4.0.
- [Health Library Support 2026 (HealthKit and Health Connect types each wrapper library maps)](https://aifitnessapi.com/datasets#health-library-support-2026) - JSON at https://aifitnessapi.com/datasets/health-library-support-2026.json, CSV beside it; CC BY 4.0.
- [Health and Fitness MCP Servers 2026](https://aifitnessapi.com/datasets#health-mcp-servers-2026) - JSON at https://aifitnessapi.com/datasets/health-mcp-servers-2026.json, CSV beside it; CC BY 4.0.
- [HealthKit Metadata Keys 2026](https://aifitnessapi.com/datasets#healthkit-metadata-keys-2026) - JSON at https://aifitnessapi.com/datasets/healthkit-metadata-keys-2026.json, CSV beside it; CC BY 4.0.
- [HealthKit Type Identifiers 2026](https://aifitnessapi.com/datasets#healthkit-type-identifiers-2026) - JSON at https://aifitnessapi.com/datasets/healthkit-type-identifiers-2026.json, CSV beside it; CC BY 4.0.
- [Pose Keypoint Maps 2026](https://aifitnessapi.com/datasets#pose-keypoint-maps-2026) - JSON at https://aifitnessapi.com/datasets/pose-keypoint-maps-2026.json, CSV beside it; CC BY 4.0.
- [Wear OS Health Services Data Types 2026](https://aifitnessapi.com/datasets#wear-os-health-services-data-types-2026) - JSON at https://aifitnessapi.com/datasets/wear-os-health-services-data-types-2026.json, CSV beside it; CC BY 4.0.
- [Workout Types Crosswalk 2026 (HealthKit, Health Connect, Wear OS, Google Health API)](https://aifitnessapi.com/datasets#workout-types-crosswalk-2026) - JSON at https://aifitnessapi.com/datasets/workout-types-crosswalk-2026.json, CSV beside it; CC BY 4.0.

## Free tools

Browser tools on aifitnessapi.com built on the same data. They run on your device and need no account.

- [Which error is this?](https://aifitnessapi.com/tools/error-diagnoser) - Paste an error string and get the matching HKError.Code case in Apple's wording, plus the guide that covers it.
- [Sum it or average it?](https://aifitnessapi.com/tools/aggregation-checker) - Whether Apple describes a quantity type as cumulative or discrete, with the sentence that says so.
- [Apple type, Android record](https://aifitnessapi.com/tools/identifier-translator) - Two-way lookup between HealthKit identifiers and Health Connect records — verified pairs only.
- [HealthKit permission builder](https://aifitnessapi.com/tools/permission-builder) - Pick the types your app touches: the Info.plist keys, the toShare/toRead Swift, and the Health Connect record names.
- [HealthKit query generator](https://aifitnessapi.com/tools/query-generator) - Pick a quantity type and a window; get the HKStatisticsQuery with the aggregation option Apple's own prose states.
- [Fitness app stack generator](https://aifitnessapi.com/tools/stack-generator) - Answer four questions and get the HealthKit types and APIs that survive them, with the exclusions shown.
- [Synthetic health data generator](https://aifitnessapi.com/tools/sample-data) - Seeded synthetic HealthKit, Health Connect and Google Health API fixtures as JSON or CSV, with per-record UTC offsets.
- [Is this webhook real?](https://aifitnessapi.com/tools/webhook-verifier) - Paste an Oura, WHOOP, Terra, Polar, Strava, Withings, Wahoo or Google Health API webhook: the vendor's documented check, run in your browser.
- [Wearable OAuth playground](https://aifitnessapi.com/tools/oauth-playground) - Pick Oura, WHOOP, Strava, Polar, Withings, Wahoo, Dexcom, Suunto or Google Health: documented endpoints and scopes, an authorize URL, a PKCE pair and token curl. Sends nothing.
- [Starter scaffold generator](https://aifitnessapi.com/tools/starter-scaffold) - Pick Express, Next.js or FastAPI and Oura, WHOOP, Polar, Strava or Wahoo: a tested project skeleton with OAuth routes, a token store and verified webhooks, as a .zip.
- [Pose keypoint playground](https://aifitnessapi.com/tools/keypoint-playground) - Click a joint and see its index in BlazePose, COCO, OpenPose, ML Kit and Apple Vision, then copy an index map built from matching names only.
- [Exercise form rules](https://aifitnessapi.com/tools/exercise-form-rules) - The joint-angle thresholds open-source exercise trackers use for squats, push-ups, lunges, planks, curls and presses, each quoted from its code; null where none says.
- [Exercise taxonomy crosswalk](https://aifitnessapi.com/tools/exercise-taxonomy-crosswalk) - free-exercise-db, wger and ExerciseDB v1 categories, equipment and muscles against HealthKit and Health Connect workout types, matched by name only.
- [Health data schema converter](https://aifitnessapi.com/tools/schema-converter) - Paste a HealthKit export row, Health Connect record or Google Health API data point and see it in one unified schema, each field traced to its source.
- [Fitbit to Google Health API map](https://aifitnessapi.com/tools/fitbit-to-google-health) - Search every Fitbit Web API endpoint and see its Google Health API data type, method and scopes from Google's migration tables, or that none is listed.
- [Deprecation scanner](https://aifitnessapi.com/tools/deprecation-scanner) - Paste code or a manifest and find Fitbit Web API, Google Fit and other retired fitness API calls, each with its replacement. Also a GitHub Action.
- [Fitness app build plan and PRD generator](https://aifitnessapi.com/tools/build-plan) - Pick an app type, platforms, data sources and features: a shareable build plan and a PRD template with the APIs, compliance items, store rules and cost shape.
- [App Store and Google Play submission checklist](https://aifitnessapi.com/tools/store-submission-checklist) - Apple's App Review Guidelines and Google Play's health policies, quoted item by item and narrowed to what your app does, with progress kept in your browser.
- [Health app compliance wizard](https://aifitnessapi.com/tools/compliance-wizard) - Nine questions route your app to the rules that likely apply (HIPAA, the FTC breach rule, GDPR, Washington, FDA, app stores), each quoted from its source.
- [Which fitness API should I use?](https://aifitnessapi.com/picker) - Three questions, a tailored recommendation.
- [Fitness API cost planner](https://aifitnessapi.com/cost-planner) - The cost structure of your stack: billing models, user-side costs, approval gates, eng effort.
- [Fitness & health API market map](https://aifitnessapi.com/market-map) - Every product in the directory as one map, grouped by category, filterable by billing model, approval gate and tracked library.
- [Fitness API index](https://aifitnessapi.com/fitness-api-index) - Sortable raw signals per product: SDK and library releases, dated changes in the last 12 months, approval gates, verification age. No score.
- [Fitness API openness index](https://aifitnessapi.com/openness-index) - Which developer basics each wearable and health-data API documents: self-serve start, sandbox, pricing, rate limits, signed webhooks, PKCE, refresh, deletion.
- [Compare two fitness APIs side by side](https://aifitnessapi.com/compare-apis) - Access structure, user-side cost and approval gates for any two products in the directory.
- [Wearable API coverage matrix](https://aifitnessapi.com/tools/api-coverage-matrix) - Which wearable and fitness APIs document which metrics, at what resolution, how far back, and by webhook or pull. Every mark sourced; unknown where no page says.
- [Rate-limit and quota calculator](https://aifitnessapi.com/tools/rate-limit-calculator) - Users × syncs × endpoints against each fitness API's documented rate limits: which binds first, the most users it supports, and the vendor's own mitigations.
- [Why “today’s steps” is a bug](https://aifitnessapi.com/day-boundaries) - Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.
- [Ship It: a fitness-app survival game](https://aifitnessapi.com/play/ship-it) - Pick a product and a data stack, then live through the real, dated API events that hit it: Fitbit turn-off, Google Fit end of support, Garmin approval, Strava rules.
- [Pose model benchmark](https://aifitnessapi.com/tools/pose-benchmark) - Time MediaPipe Pose Landmarker lite, full and heavy, and MoveNet Lightning and Thunder, on your own device, copy the latency table as markdown and submit it to the leaderboard.
- [Rep counter playground](https://aifitnessapi.com/tools/rep-counter-playground) - Load a workout video, see joint angles over time, tune a hysteresis rep counter's thresholds and export the config as JSON. The video stays in your browser.
- [Bluetooth heart-rate lab](https://aifitnessapi.com/tools/heart-rate-lab) - Connect a BLE heart-rate strap in the browser: every 0x2A37 byte decoded, and whether it sends the RR intervals HRV needs.
- [FTMS lab](https://aifitnessapi.com/tools/ftms-lab) - Connect a treadmill, indoor bike, rower or cross trainer over Web Bluetooth, or paste hex: every FTMS flag bit and field decoded against the SIG structure.
- [Cycling power and cadence lab](https://aifitnessapi.com/tools/cycling-power-lab) - Cycling Power (0x2A63) and CSC (0x2A5B) decoded, with cadence and speed computed from cumulative revolutions and event times, live or pasted.
- [BLE GATT explorer](https://aifitnessapi.com/tools/ble-gatt-explorer) - Connect any Bluetooth LE device: services and characteristics by SIG name, read or notify, values decoded where the SIG defines a structure.
- [Which wearable API quiz](https://aifitnessapi.com/quiz/which-wearable-api) - Eight questions on platform, devices, data depth, webhooks, budget and team decide how your app should get wearable data, with a shareable result.
- [My stack](https://aifitnessapi.com/my-stack) - Pick the APIs your product depends on: their tracked changes and deadlines, every page here about them with its date, and a calendar to save. Stays in your browser.
- [Answer search](https://aifitnessapi.com/answers-search) - Search the full text of every answer capsule, FAQ answer and tracked change, ranked in your browser, with links to the exact answer.
- [Daily health-API developer puzzle](https://aifitnessapi.com/daily) - Five questions a day from the site's datasets: which platform throws this error, HealthKit to Health Connect, sum or average, name the keypoint.
- [Step lab](https://aifitnessapi.com/tools/step-lab) - Walk with your phone and watch a visible step detector count; move its threshold and interval to see why two apps disagree.
- [Apple Health export explorer](https://aifitnessapi.com/tools/apple-health-explorer) - Open your iPhone Health export.zip in the browser: record types with counts and dates, sources, a daily chart and a CSV per type. Nothing is uploaded.
- [Gym software API matrix](https://aifitnessapi.com/tools/gym-software-api-matrix) - Mindbody, Glofox, TeamUp, Mariana Tek, Wodify and more: auth, access, pricing, webhooks and coverage, filterable, each cell quoting its vendor source.
- [Research platform chooser](https://aifitnessapi.com/tools/research-platform-chooser) - Fitabase, Labfront, Empatica and Ametris: tick what your study needs and see which platforms document it, each answer quoting the vendor's page.
- [Health data aggregator chooser](https://aifitnessapi.com/tools/aggregator-chooser) - Terra, ROOK, Junction, Spike, Thryve, Sahha, Open Wearables and Validic: tick sources, price, webhooks, BAA, data region or self-hosting; every cell quotes its source.

## About this list

- Generated by `scripts/build-awesome.mjs` from the data modules behind aifitnessapi.com. Do not edit this file by hand: change the data and run `node scripts/build-awesome.mjs`; the site's qa gate fails when this file is stale.
- Inclusion is mechanical: every product in the site's directory, every library on its libraries hub, every server its MCP Registry scan matched, every dataset and tool it publishes. A mistake is a mistake in the data, so report it on the source page: https://aifitnessapi.com/corrections.
- KinesteX funds aifitnessapi.com. Its entry is drawn from the same directory as every other, and the list ranks nothing.

## License

This list is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit AIFitnessAPI and link https://aifitnessapi.com/awesome. The libraries, servers and services it links keep their own licenses and terms.
