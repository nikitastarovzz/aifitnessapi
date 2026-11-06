# Awesome Fitness APIs

> A list of 24 fitness and health APIs and platforms, 20 open-source libraries, 176 MCP servers, 16 open datasets and 40 free tools for developers building with wearable, health and workout data. Generated from aifitnessapi.com's sourced data by a script, so every line restates a published fact and nothing is ranked.

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

### AI motion / coaching SDKs

- [KinesteX](https://aifitnessapi.com/apis/kinestex) - Developer billing: Contact sales. An approval, review or declaration stands before production. KinesteX funds aifitnessapi.com; it is listed the same way as every other product.
- [Sency (SMKit)](https://aifitnessapi.com/apis/sency) - Developer billing: Usage-based. An approval, review or declaration stands before production.
- [QuickPose](https://aifitnessapi.com/apis/quickpose) - Developer billing: Free tier.

### Pose-estimation models

- [MediaPipe Pose Landmarker (BlazePose)](https://aifitnessapi.com/apis/mediapipe) - Developer billing: Free.
- [TensorFlow MoveNet](https://aifitnessapi.com/apis/movenet) - Developer billing: Free.
- [Apple Vision body pose](https://aifitnessapi.com/apis/apple-vision) - Developer billing: Free.

## Libraries and SDK bridges

Open-source packages for HealthKit, Health Connect and vendor web APIs, read from their registries on 2026-10-03. Each links its registry page; the license is the one the registry states.

### React Native

- [react-native-health](https://www.npmjs.com/package/react-native-health) - The long-standing React Native bridge to Apple HealthKit, and the one this site's SDK release tracker follows. npm, license MIT.
- [@kingstinct/react-native-healthkit](https://www.npmjs.com/package/@kingstinct/react-native-healthkit) - The other React Native HealthKit binding, typed close to Apple's own identifiers — the usual alternative to react-native-health. npm, license MIT.
- [react-native-health-connect](https://www.npmjs.com/package/react-native-health-connect) - The React Native wrapper for Android Health Connect; since v4 it also carries the Expo config plugin. npm, license MIT.
- [expo-health-connect](https://www.npmjs.com/package/expo-health-connect) - Still in many Expo app.json files. Deprecated in the registry and merged into react-native-health-connect v4 — the page exists to say how to remove it. npm, license MIT. Deprecated on npm: Merged into react-native-health-connect v4 — remove this package, replace the expo-health-connect entry in your app.json plugins array with react-native-health-connect, then re-run expo prebuild --clean. See https://github.com/matinzd/react-native-health-connect. Repository archived on GitHub.
- [react-native-google-fit](https://www.npmjs.com/package/react-native-google-fit) - The React Native bridge to the Google Fit Android API, which Google has deprecated in favour of Health Connect. npm, license MIT.

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

Model Context Protocol servers whose official MCP Registry entry names a health or fitness source, read from the registry on 2026-10-17. The description is the registry's, verbatim; none of these servers was reviewed or run for this list. Each links its repository, else its website, else its registry record.

### Apple Health (HealthKit)

- [Somvia (app.somvia/health)](https://somvia.app/) - Apple Health training load, recovery, HRV and workout detail for Claude, ChatGPT and any MCP client.
- [io.github.Fino-wind/vaultbeat](https://github.com/Fino-wind/vaultbeat-mcp) - Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine. Marked deprecated in the registry.
- [io.github.Fino-wind/vaultbeat-apple-health](https://github.com/Fino-wind/vaultbeat-apple-health) - Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine.
- [MetricBridge Apple Health (io.github.PhilipAD/health-export-mcp)](https://github.com/PhilipAD/health-export-mcp) - Query 190 Apple Health metrics from any MCP agent: zero-dependency, read-only, local-first.
- [io.github.davidmosiah/apple-health-mcp](https://github.com/davidmosiah/apple-health-mcp) - Unofficial local-first MCP server for Apple Health export data.
- [health4ai (io.github.jefflitt1/health4ai)](https://github.com/jefflitt1/health4ai) - Query your Apple Health data from your own Supabase/Postgres via local MCP.
- [Apple Health MCP Server (io.github.krumjahn/health-analyzer-mcp)](https://github.com/krumjahn/MacHealthAnalyzer) - Apple Health data for Claude, Cursor, and any MCP client — 100% local on your Mac.
- [Apple Health (io.github.neiltron/apple-health-mcp)](https://github.com/neiltron/apple-health-mcp) - Local-first Apple Health MCP server for questions about your sleep, workouts and heart data.
- [Health Bridge for AI (io.github.roian6/health-bridge)](https://github.com/roian6/apple-health-ai-bridge) - Apple Health AI Bridge provides read-only local MCP access for Health Bridge for AI.
- [tech.skeletonarmy/marrow](https://github.com/skeletonarmytech/marrow-mcp) - Nine MCP tools that read your own Apple Health data, mirrored from the Marrow iOS app.

### Health Connect

- [Health Hub MCP (io.github.naymEvg/health-mcp)](https://github.com/naymEvg/health-conect-mcp) - Self-hosted MCP server for Android Health Connect — 34 metrics, daily rollups, dedup, 5 LLM tools.

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

- [Garmin MCP (com.garminmcp/garmin)](https://garminmcp.com) - Read-only Garmin data for your AI: sleep, Body Battery, activities, laps, and training status.
- [Simma (com.getsimma/simma)](https://getsimma.com/resources/connect-simma-to-claude) - Your swim, run and ride training, explained. For coaches and athletes, computed from Garmin data.
- [Garmin — MissingMCP (com.missingmcp/garmin)](https://github.com/VelkyVenik/missingmcp) - Garmin data in Claude: 135 tools — activities, sleep, HRV, training, workouts. Free, open source.
- [Nutrition by Pack4Back (com.pack4back/nutrition)](https://github.com/pack4back/garmin-nutrition) - Log meals, water, and weight to Garmin Connect from Claude or ChatGPT.
- [Weight Forecast (com.weight-forecast/weight-forecast)](https://www.weight-forecast.com/) - Know your goal-weight date. Log food, sync Garmin, get a daily AI coach in Telegram.
- [Running Workout (fr.runningworkout/running-workout)](https://www.runningworkout.fr/) - AI coach for Garmin: builds training plans and structured workouts, synced straight to your watch.
- [Garmin Connect (io.github.DynamicsNinja/garminconnect)](https://github.com/DynamicsNinja/garminconnect-js) - Unofficial Garmin Connect access: sleep, HRV, training, activities, workouts and weight.
- [hybridlog (io.github.Imgrund/hybridlog)](https://github.com/Imgrund/hybridlog) - Reads your own Garmin mirror: readiness, training load, muscle freshness, and read-only SQL.
- [io.github.NasserAlbusaidi/macrofactor-mcp](https://github.com/NasserAlbusaidi/macrofactor-mcp) - Fueling & recovery decision engine combining MacroFactor nutrition with Garmin training data.
- [io.github.anup-shesh/garmin-local-mcp](https://github.com/anup-shesh/garmin-local-mcp) - Local-first Garmin data warehouse: sync once to SQLite, analyze trends and correlations offline.
- [Run Coach (io.github.chenhunghan/garmin-mcp-app)](https://github.com/chenhunghan/garmin-mcp-app) - Garmin data with interactive charts: daily briefing, training trends, workout planning. Unofficial.
- [io.github.davidmosiah/garminmcp](https://github.com/davidmosiah/garmin-mcp) - Privacy-first unofficial Garmin Connect MCP for AI health, sleep, activity & recovery agents.
- [ConnectIQ MCP Server (io.github.deugene/connect-iq-mcp)](https://github.com/deugene/connect-iq-mcp.git) - MCP server for Garmin ConnectIQ SDK documentation and resources.
- [io.github.endurancetools/garmin-mcp](https://github.com/endurancetools/garmin-mcp) - Unofficial Garmin Connect server: training load, form, HRV readiness and workouts for your watch.
- [Fitness AI Connector (io.github.fmp-projects/fitness-ai-connector)](https://github.com/fmp-projects/fitness-ai-connector) - Garmin data in Claude & ChatGPT via the Garmin Health API. OAuth sign-in, no password sharing.
- [Futureweb Intervals MCP (io.github.futureweb/intervals-mcp-server)](https://github.com/futureweb/intervals-mcp-server) - Self-hosted Intervals.icu MCP server: training analytics, Garmin data, wellness, workout planning.
- [io.github.mbrionesalvarez/caddie-mcp](https://github.com/mbrionesalvarez/caddie-mcp) - Your Garmin golf data in Claude: GPS shots, strokes gained, club distances, health context.
- [Garmin Connect (treinos) (io.github.mcp-dir/garmin-mcp)](https://github.com/mcp-dir/garmin-mcp) - List, fetch, create, edit (replace), delete and schedule structured workouts on Garmin Connect (runn.
- [io.github.pablo-albaladejo/kaiord](https://github.com/pablo-albaladejo/kaiord) - Convert, validate, and inspect workout files (FIT, TCX, ZWO, Garmin Connect) for AI agents.
- [Garmin Workouts MCP (io.github.pranciskus/garmin-workouts-mcp)](https://github.com/pranciskus/garmin-workouts-mcp) - Manage Garmin Connect workouts, including strength workouts with mapped exercises.
- [io.github.slaat/garmin-connect-workouts-mcp](https://github.com/slaat/garmin-connect-workouts-mcp) - Turn plain language into real workouts on your Garmin watch: pace, HR, power, intervals, swim sets.
- [io.github.snoozelieb/coach-mcp](https://github.com/snoozelieb/coach-mcp) - Adaptive AI training coach MCP server backed by Garmin Connect.
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
- [Oura MCP by usefulapi (io.usefulapi/oura)](https://github.com/m190/usefulapi-mcp) - Read sleep, readiness, activity, stress, heart rate and workouts from the Oura Ring.
- [MCP for Oura (link.smirnov/mcp-oura)](https://github.com/Smirnov-Labs/mcpforoura) - Multi-tenant hosted MCP server for Oura Ring — 21 read-only tools, OAuth per user.
- [Passport.Me (me.passport/mcp)](https://passport.me/developers) - Your Gmail, Calendar, Drive, GitHub, Oura, wallet and confirmed profile facts in any MCP client.

### WHOOP

- [WHOOP — MissingMCP (com.missingmcp/whoop)](https://github.com/VelkyVenik/missingmcp) - WHOOP recovery, strain, sleep and workouts in Claude via official WHOOP OAuth. Free, open source.
- [io.github.AshwanthramKL/whoop-mcp](https://github.com/AshwanthramKL/whoop-mcp) - Read-only WHOOP v2 data for MCP clients, with local SQLite cache and CSV/JSONL/Parquet exports.
- [WHOOP Health Signals (io.github.Yadheedhya06/mcp-server-whoop)](https://github.com/Yadheedhya06/mcp-server-whoop) - Local-first, read-only WHOOP MCP server for recovery, sleep, strain, workouts, and body signals.
- [io.github.Zayden16/whoop-mcp-server](https://github.com/Zayden16/whoop-mcp-server) - MCP server for the official Whoop API v2: cycles, recovery, sleep, workouts, and profile data.
- [io.github.briangaoo/totem](https://github.com/briangaoo/totem) - Totem — talk to your wearables with AI. Today: full Whoop access (48 tools).
- [io.github.briangaoo/whoop-mcp](https://github.com/briangaoo/whoop-mcp) - Full read + write access to your Whoop fitness data via the private iOS API. 48 tools.
- [WHOOP MCP (io.github.cunicopia-dev/whoop-postgres-mcp)](https://github.com/cunicopia-dev/whoop-mcp) - Sync WHOOP recovery, sleep, strain, and workouts into Postgres and query them from any MCP client.
- [io.github.davidmosiah/whoop-mcp](https://github.com/davidmosiah/whoop-mcp) - Privacy-first, unofficial WHOOP MCP server for AI health, sleep, recovery, and performance agents.
- [WHOOP (io.github.mcp-dir/whoop-mcp)](https://github.com/mcp-dir/whoop-mcp) - Your WHOOP data in the assistant, read-only: recovery, sleep, strain, workouts, cycles and body meas.
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

### Dexcom

- [io.github.davidmosiah/wellness-cgm-mcp](https://github.com/davidmosiah/wellness-cgm-mcp) - Local-first CGM MCP for AI agents: Dexcom Developer API + FreeStyle Libre via LibreLink Up.

### Strava

- [HAPI Strava MCP Server (ai.com.mcp/strava)](https://github.com/la-rebelion/hapimcp) - Strava MCP tools for AI: athletes, activities, segments, clubs, routes. Powered by HAPI MCP server.
- [Strava Training MCP (io.github.ArjanLig/strava-mcp)](https://github.com/ArjanLig/strava-mcp) - Connect Strava training data to Claude for training load analysis and activity insights.
- [io.github.davidmosiah/strava-mcp](https://github.com/davidmosiah/strava-mcp) - Privacy-first MCP server for Strava activities, streams, routes and training.
- [io.github.ljcl/strava-mcp](https://github.com/ljcl/strava-mcp) - Remote MCP server for your Strava activities, segments, and routes.
- [Strava MCP Bridge (io.github.millerchou/strava-mcp-bridge)](https://github.com/millerchou/strava-mcp-bridge) - Use Strava's official MCP from Codex and other local stdio clients without a developer app.
- [io.github.musette-cc/musette-mcp](https://github.com/musette-cc/musette-mcp) - AI soigneur for cyclists: Strava ride to an Ien-Vitse-validated nutrition plan + orderable box.
- [io.github.r-huijts/strava-mcp](https://github.com/r-huijts/strava-mcp) - MCP server for accessing Strava API.

### MyFitnessPal

- [MyFitnessPal (io.github.Mason-Levyy/mfp-mcp)](https://github.com/Mason-Levyy/myfitnesspal-mcp) - MCP server for MyFitnessPal: log, search, and analyze your food diary.

### Cronometer

- [io.github.cphoskins/cronometer](https://github.com/cphoskins/cronometer-mcp) - MCP server for Cronometer — food logs, macros, fasting, biometrics, and recurring foods.
- [io.github.rwestergren/cronometer-api-mcp](https://github.com/rwestergren/cronometer-api-mcp) - MCP server for Cronometer nutrition tracking — food logs, diary, macros, fasting.

### Junction (formerly Vital)

- [Vital MCP by usefulapi (io.usefulapi/vital)](https://github.com/m190/usefulapi-mcp) - Read wearables and lab health data — sleep, activity, workouts, timeseries, lab tests and orders.

### Several sources

- [Cycling Coach AI (com.cyclingcoachai/cycling-coach-ai)](https://registry.modelcontextprotocol.io/v0.1/servers/com.cyclingcoachai%2Fcycling-coach-ai/versions/1.0.0) - AI cycling coach: training plans, workouts, nutrition, strength training, Strava, Garmin and Wahoo.
- [io.github.BerkKilicoglu/google-health-fitbit-mcp](https://github.com/BerkKilicoglu/google-health-fitbit-mcp) - Privacy-first Google Health API MCP server for health, sleep, activity and HR agents.
- [Leo Training (io.github.leo-runningcoach/coachleo)](https://github.com/leo-runningcoach/coachleo) - Running, trail and triathlon coach. Reads Strava, Garmin, COROS, Suunto, Polar. Adapts to your feel.
- [Toolforest (io.toolforest/toolforest)](https://www.toolforest.io) - Hosted MCP server with managed OAuth for 15+ toolkits: Google Workspace, Fitbit, Oura, Kalshi, etc.
- [ghurt (org.ghurt/ghurt)](https://ghurt.org) - Query Garmin, Oura & Whoop sleep, HRV, recovery & training load from Claude or ChatGPT.
- [Pacing Tools (tools.pacing/mcp)](https://pacing.tools/docs/mcp) - Ask your AI about your fitness: activities and data from Garmin, COROS, Strava, GPX and more.
- [Garmin & Strava for Claude and ChatGPT (training.stats/garmin)](https://stats.training/garmin-mcp) - Read-only Garmin and Strava data for your AI: activities, sleep, HRV, readiness, training load.

### Wearable, fitness and health data in general

- [Coach MCP (ai.iamcoach/coach)](https://www.iamcoach.ai/mcp) - Your endurance training data in your AI assistant: activities, recovery, plan, workout edits.
- [Povver — Strength Training (ai.povver/mcp-server)](https://github.com/bvatech/povver-mcp) - Your strength-training data for any AI assistant: workouts, progress, muscle volume, routines.
- [Rippd (ai.rippd/rippd)](https://rippd.ai/connectors) - Your Rippd training and nutrition data in your AI: food, workouts, weigh-ins, targets, coach notes.
- [ai.smithery/fitaf-ai-fitaf-ai-mcp](https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-ai-mcp/versions/1.0.0) - Manage workouts, nutrition, goals, and progress across the FitAF platform. Connect wearables, sync…
- [ai.smithery/fitaf-ai-fitaf-mcp](https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-mcp/versions/1.0.0) - Track workouts, nutrition, body metrics, habits, and SMART goals with insights and trends. Connect…
- [Wellness Project (ai.wellnessproject/wellness-project)](https://github.com/turnnoblindeye/wellness-project-mcp) - Connect your health, fitness, nutrition, sleep, and wearable data to your AI assistant.
- [APICK Business (app.apick/business)](https://github.com/lead788/apick-mcp) - Korean business, parcel and simple-auth employment, income, pension, license and health data.
- [Athlete Diary (app.athletediary/athlete-diary)](https://athletediary.app/connect) - Your workout log in chat: history, progress, records, muscle volume, body weight, programs.
- [Evertrain (app.evertrain/evertrain)](https://registry.modelcontextprotocol.io/v0.1/servers/app.evertrain%2Fevertrain/versions/1.0.0) - Manage your Evertrain training — programs, workouts, exercises, history, and coaching notes.
- [Framezone (app.framezone/framezone)](https://framezone.app/mcp-for-life-management) - Your life dashboard for AI: tasks, habits, goals, budgets, workouts, nutrition, journal, notes.
- [MoveMate: Gym Workout Tracker (app.movemate/movemate)](https://movemate.app/ai) - Gym workout tracker: review your training, PRs and progression, and schedule workouts in the app.
- [OnlineFitness.app (app.onlinefitness/coach)](https://onlinefitness.app/ai) - Manage fitness coaching clients, workouts, programs, chats and funnels from your assistant.
- [PumpX (app.pumpx/pumpx)](https://pumpx.app/claude/) - Read-only access to your PumpX workout log: sessions, lift history, PRs, routines, measurements.
- [WOD Coach: AI Personal Trainer (app.railway.up.wod-api-production/wod-coach)](https://wod-api-production.up.railway.app/llms.txt) - Fitness MCP: AI personal trainer, workouts, injury exercise swaps, race pacing. Pay-per-call x402.
- [tectonic plates (app.tectonicplates/tectonic-plates)](https://github.com/stephaniewilkinson/tectonic) - Write whole barbell programmes, not just workouts: weeks, progressions, ramps, and plate maths.
- [Moveat (app.wemoveat/moveat)](https://wemoveat.app) - Coaching app for fitness coaches: read client check-ins, weight trends, diets and programs.
- [Your Move Exercise Video API (app.ymove/exercise-api)](https://github.com/ymove-app/exercise-api-mcp) - 1,413+ HD exercise videos with muscles and instructions, plus workout and program generation.
- [Trainer Connect (br.com.trainerconnect/personal-trainer)](https://trainerconnect.com.br/assistentes-ia) - Manage students, workouts, appointments and payments through your personal trainer account.
- [freddy (coach.freddy/freddy)](https://freddy.coach) - Connect your wearables, rings and training apps, then ask your AI about your own health data.
- [AIm Workout Journal (com.aim-journal/aim)](https://github.com/persistmcp/aim) - Chat forgets your workouts. AIm remembers them for Claude and ChatGPT: sets, weights, 1RM, volume.
- [Gym Navigator Coach (com.gymnavigator/coach)](https://gymnavigator.com/coach/) - Plan workouts, find exercises and gyms, log sessions and track progress with Gym Navigator.
- [JustGains (com.justgains/mcp-server)](https://github.com/JustGains/justgains-connector) - Save workouts, read training history and progress, search exercises, and log food in JustGains.
- [Joti (com.kompetic/joti)](https://registry.modelcontextprotocol.io/v0.1/servers/com.kompetic%2Fjoti/versions/1.0.0) - Read your workouts, history, and stats; create and schedule new workouts. Writes are additive only.
- [LiftTrack (com.lifttrackapp/lifttrack)](https://lifttrackapp.com) - Manage strength workouts and track exercise progress. Requires a LiftTrack account.
- [MyoAmigo (com.myoamigo/myoamigo)](https://www.myoamigo.com) - Agent-first strength-training platform across iOS, Web & MCP: read & write workouts, PRs & plans.
- [CDC PLACES Health Data (com.olyport/cdc-places)](https://olyport.com) - County and tract-level health outcomes, behaviors, and preventive services from CDC PLACES.
- [Pacelab Intervals (com.pacelabintervals/workouts)](https://pacelabintervals.com/claude) - Create and schedule interval workouts (Tabata, AMRAP, EMOM) from your real training history.
- [Parameter (com.parameterfit/parameter)](https://parameterfit.com) - Your AI writes training plans that arrive as structured workouts on iPhone and Apple Watch.
- [Reps (com.repsworkout/reps)](https://repsworkout.com/connect?utm_source=mcp-registry) - Your Reps gym log in Claude or ChatGPT: workouts, PRs, progress, routines and training plans.
- [Rhylthyme (com.rhylthyme/rhylthyme)](https://github.com/rhylthyme/rhylthyme-mcp) - Real-time multi-track schedules for cooking, lab protocols, events and workouts. Validate and share.
- [RIRLift (com.rirlift/rirlift)](https://www.rirlift.com/ai/) - Your RIRLift strength training log: workouts, progress, volume, recovery and program drafts.
- [Tredict (com.tredict/mcp-server)](https://github.com/tredict-com/mcp-server) - Analyse activities, build training plans and sync structured workouts to your sports watch.
- [dev.anatome/anatome](https://anatome.dev) - Log workouts and meals by telling your AI. 873 exercises, muscle diagrams, food lookup.
- [depot.fitness (fitness.depot/strength-programs)](https://depot.fitness) - Search 101 structured strength-training programs, exercises and guides from depot.fitness.
- [Dofek (io.github.Asherlc/dofek)](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Asherlc%2Fdofek/versions/0.1.0) - Private health and fitness analytics through a secure remote MCP connection.
- [io.github.CSOAI-ORG/fitness-ai-mcp](https://github.com/CSOAI-ORG/fitness-ai-mcp) - Fitness Ai MCP Server by MEOK AI Labs.
- [io.github.CSOAI-ORG/sleep-tracker-ai-mcp](https://github.com/CSOAI-ORG/sleep-tracker-ai-mcp) - Sleep Tracker Ai MCP Server by MEOK AI Labs.
- [io.github.CSOAI-ORG/workout-planner-ai-mcp](https://github.com/CSOAI-ORG/workout-planner-ai-mcp) - MCP server for workout planner ai. Features create workout, track progress, suggest exercises. From.
- [Plan My Workout (io.github.GoodTurnStudio/planmyworkout)](https://github.com/GoodTurnStudio/goodturn-mcp) - A workout plan for your goal, level, days and equipment, and how to do any exercise.
- [Sync My Cycle (io.github.GoodTurnStudio/syncmycycle)](https://github.com/GoodTurnStudio/goodturn-mcp) - Your likely menstrual cycle phase today and this week, with food and workout ideas.
- [mifit (io.github.Jenwein/mifit)](https://github.com/Jenwein/mifit) - Read-only access to your own Mi Fitness (Xiaomi) data: sleep, heart rate, steps, workouts.
- [Fitatu (io.github.Jezue/fitatu-api)](https://github.com/Jezue/fitatu_library) - Unofficial Fitatu calorie counter: read and log food, weight, water and workouts.
- [Hybriqx Workout Adaptation (io.github.LKennedyShare/hybriqx-workout-adaptation)](https://github.com/LKennedyShare/hybriqx-workout-assistant) - Advisory workout adaptation via hosted MCP and x402. Python buyer with operator-approved tools.
- [TrainBud (io.github.Zsadigzade/trainbud)](https://github.com/Zsadigzade/trainbud) - Talk to your own fitness data. Findings computed in code against your own 28-day baselines.
- [bodylog (io.github.abhaymettu/bodylog)](https://github.com/abhaymettu/bodylog) - Agent-first workout and food log: sets and meals from chat, USDA and Open Food Facts macros, cards.
- [Fitness Tools (io.github.almostjacked/fitness-tools)](https://github.com/almostjacked/fitness-tools) - Deterministic fitness calculators — TDEE, adaptive TDEE, body fat, 1RM, macros — with consensus.
- [Health Data (your own Supabase) (io.github.almostjacked/health-mcp)](https://github.com/almostjacked/health-mcp) - Your health data (weight, macros, weigh-ins) as MCP tools — in your own Supabase, zero custody.
- [health-os (io.github.andronaft/health-os)](https://github.com/andronaft/health-os) - Local-first personal health record: labs, meds, wearables, food log, deterministic safety checks.
- [io.github.anthesiallc/meddata](https://github.com/anthesiallc/meddata-mcp) - Drug & supplement lookup and interaction checks from free U.S. government health data.
- [SisRUN Training Plan (io.github.cdutr/sisrun-mcp)](https://github.com/cdutr/sisrun-mcp) - Read your SisRUN (appsisrun.com.br) training plan: prescribed workouts, pace/HR windows, structure.
- [Hevy MCP Server (io.github.chrisdoc/hevy-mcp)](https://github.com/chrisdoc/hevy-mcp) - MCP server for managing workouts, routines, and exercise data through the Hevy API.
- [API Tool Calls (io.github.cowerxdev/apitoolcalls)](https://apitoolcalls.com/agent.html) - 94 tools, one small door: home costs, fitness, QR, barcodes, Markdown, SEO, recalls.
- [MusclesWorked (io.github.csjoblom/musclesworked)](https://github.com/csjoblom/musclesworked-mcp) - Exercise-to-muscle mapping: 856 exercises, 65 muscles, workout analysis & alternatives.
- [io.github.cyanheads/cdc-health-mcp-server](https://github.com/cyanheads/cdc-health-mcp-server) - Search and query CDC public health data — mortality, vaccinations, surveillance, behavioral risk.
- [io.github.dengxuhui/igpsport-mcp](https://github.com/dengxuhui/igpsport-mcp) - iGPSport cycling data with training metrics (NP/IF/TSS/CTL/ATL/TSB) and workout generation.
- [Hevy MCP (io.github.diecoscai/hevy-mcp)](https://github.com/diecoscai/hevy-mcp) - MCP server for the Hevy fitness API — spec-generated schemas, dry-run-safe writes, easy setup.
- [io.github.dropflyai/fitfly-engine](https://workout-engine-production-5dd7.up.railway.app/connect) - Deterministic fitness coaching engine: adaptive programs, progression math, readiness autoregulation.
- [io.github.gabrielmahia/kenya-health-mcp](https://github.com/gabrielmahia/kenya-health-mcp) - MCP server for Kenya health data: SHIF contributions (NHIF's successor), a small facility sample, ma.
- [io.github.hhopke/intervals-icu-mcp](https://github.com/hhopke/intervals-icu-mcp) - Read/write Intervals.icu MCP server: activities, wellness, calendar, gear, and workouts.
- [MFIT Personal (io.github.mcp-dir/mfit-mcp)](https://github.com/mcp-dir/mfit-mcp) - Client, workout, body composition, retention and finance management for personal trainers.
- [io.github.mrfentmen/wger-mcp](https://github.com/mrfentmen/wger-mcp) - Exercises, muscles, and workout data from the open wger database. No key required.
- [io.github.nftechie/transition-mcp](https://github.com/nftechie/transition-mcp) - AI-powered multisport coaching — workouts, training plans, and performance analytics.
- [Wger (io.github.pipeworx-io/wger)](https://github.com/pipeworx-io/mcp-wger) - Wger MCP — wraps wger Workout Manager REST API (free, no auth for read)
- [Hevy MCP (Remote) (io.github.rwestergren/hevy-mcp-remote)](https://github.com/rwestergren/hevy-mcp) - Hosted/gateway-ready Hevy fitness MCP: workouts, routines, templates.
- [Mi Fitness Data Bridge (io.github.shkyyy18/mi-fitness-data-bridge)](https://github.com/shkyyy18/mi-fitness-data-bridge) - Local-first bridge: export your own Mi Fitness (Xiaomi) health data to SQLite/JSON/CSV and MCP.
- [ATENA Decision Intelligence (io.github.shrek9999/atena)](https://github.com/shrek9999/atena-mvp) - Decision support for AI fitness agents: next-action choices under uncertainty and trade-offs.
- [io.github.shrynshjn/health-partner](https://github.com/shrynshjn/health_partner) - Manage your Health Partner account, log food, water, workouts, body using agent.
- [Open Health Sync (io.github.soma-intelligence/open-health-sync)](https://github.com/soma-intelligence/open-health-sync) - Read-only access to self-hosted health data: samples, sleep, workouts, nutrition, daily summaries.
- [Tally Workout (io.github.westvegh/tally-workout)](https://github.com/westvegh/tally-workout-mcp) - iPhone strength log. Any MCP agent reads your training and plans workouts in the Tally app.
- [io.github.wmarceau/fitness-influencer](https://github.com/MarceauSolutions/dev-sandbox) - AI-powered fitness content creator tools: video editing, image generation, workout plans, analytics.
- [K01 Synthetic Health Data (is.k01/synthetic-health-data)](https://github.com/K01labs/k01-mcp-server) - Privacy-preserving synthetic health data generation. FHIR R4/R5 compliant.
- [twyn (life.twyn/twyn)](https://twyn.life/for-ai-agents) - Your labs, wearables, DNA and notes as one health record your AI agent can read (OAuth 2.1).
- [Phorme Training (me.phor/phorme-training)](https://phor.me/chatgpt) - Coach-built training methods, gym weeks, workouts with demos and your log. Coaches run theirs here.
- [Upfit Plan Builder (mobile.upfit/upfit)](https://www.upfit.mobile) - Read-only bodyweight workout builder and exercise form cues from the Upfit iPhone app.
- [no.sladd/mcp](https://sladd.no/api) - Detect and redact Norwegian PII (fodselsnummer, names, health data) in text and PDFs.
- [Health Data (org.memoryapi/health)](https://registry.modelcontextprotocol.io/v0.1/servers/org.memoryapi%2Fhealth/versions/1.0.0) - Health data: NIH grants, WHO statistics, and genetic variants.
- [plus.gym/gym-plus](https://gym.plus) - Connect ChatGPT or Claude to your Gym Plus account to log and review workouts with AI coaching.
- [STAS Running Coach for Claude (run.stas/stas)](https://github.com/hivrich/stas.run) - Connect Claude to your Intervals.icu watch data for fitness, workout review, and plan writing.
- [uk.slate-hq/slate](https://slate-hq.uk/mcp-connector/) - Your own SLATE health data in your AI assistant: read, trend, plan and log. Never suggests a dose.
- [BearTrail (xyz.perpvue/mcp)](https://gitlab.com/xihay/beartrail-mcp) - Query workouts, browse exercises, and explore fitness data from BearTrail.

## Open datasets

Datasets aifitnessapi.com publishes, each as JSON and CSV under the license it states, versioned rather than overwritten.

- [Bluetooth Fitness GATT Characteristics 2026](https://aifitnessapi.com/datasets#bluetooth-fitness-gatt-2026) - JSON at https://aifitnessapi.com/datasets/bluetooth-fitness-gatt-2026.json, CSV beside it; CC BY 4.0.
- [Exercise Form Rules 2026 (joint-angle thresholds from open-source trackers)](https://aifitnessapi.com/datasets#exercise-form-rules-2026) - JSON at https://aifitnessapi.com/datasets/exercise-form-rules-2026.json, CSV beside it; CC BY 4.0.
- [Exercise Taxonomy Crosswalk 2026 (free-exercise-db, wger, ExerciseDB v1 to HealthKit and Health Connect)](https://aifitnessapi.com/datasets#exercise-taxonomy-crosswalk-2026) - JSON at https://aifitnessapi.com/datasets/exercise-taxonomy-crosswalk-2026.json, CSV beside it; CC BY 4.0.
- [Fitness API Changes & Deadlines 2026](https://aifitnessapi.com/datasets#fitness-api-changes-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-changes-2026.json, CSV beside it; CC BY 4.0.
- [Fitness & Health API Glossary 2026](https://aifitnessapi.com/datasets#fitness-api-glossary-2026) - JSON at https://aifitnessapi.com/datasets/fitness-api-glossary-2026.json, CSV beside it; CC BY 4.0.
- [State of Fitness APIs 2026](https://aifitnessapi.com/datasets#fitness-apis-2026) - JSON at https://aifitnessapi.com/datasets/fitness-apis-2026.json, CSV beside it; CC BY 4.0.
- [Google Health API Data Types 2026](https://aifitnessapi.com/datasets#google-health-api-data-types-2026) - JSON at https://aifitnessapi.com/datasets/google-health-api-data-types-2026.json, CSV beside it; CC BY 4.0.
- [Health Connect Permission Strings 2026](https://aifitnessapi.com/datasets#health-connect-permissions-2026) - JSON at https://aifitnessapi.com/datasets/health-connect-permissions-2026.json, CSV beside it; CC BY 4.0.
- [Health Connect Record Types 2026](https://aifitnessapi.com/datasets#health-connect-records-2026) - JSON at https://aifitnessapi.com/datasets/health-connect-records-2026.json, CSV beside it; CC BY 4.0.
- [Health Data Type Matrix 2026 (HealthKit ↔ Health Connect)](https://aifitnessapi.com/datasets#health-data-type-matrix-2026) - JSON at https://aifitnessapi.com/datasets/health-data-type-matrix-2026.json, CSV beside it; CC BY 4.0.
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
- [Fitness app build plan and PRD generator](https://aifitnessapi.com/tools/build-plan) - Pick an app type, platforms, data sources and features: a shareable build plan and a PRD template with the APIs, compliance items, store rules and cost shape.
- [App Store and Google Play submission checklist](https://aifitnessapi.com/tools/store-submission-checklist) - Apple's App Review Guidelines and Google Play's health policies, quoted item by item and narrowed to what your app does, with progress kept in your browser.
- [Health app compliance wizard](https://aifitnessapi.com/tools/compliance-wizard) - Nine questions route your app to the rules that likely apply (HIPAA, the FTC breach rule, GDPR, Washington, FDA, app stores), each quoted from its source.
- [Which fitness API should I use?](https://aifitnessapi.com/picker) - Three questions, a tailored recommendation.
- [Fitness API cost planner](https://aifitnessapi.com/cost-planner) - The cost structure of your stack: billing models, user-side costs, approval gates, eng effort.
- [Fitness & health API market map](https://aifitnessapi.com/market-map) - Every product in the directory as one map, grouped by category, filterable by billing model, approval gate and tracked library.
- [Fitness API index](https://aifitnessapi.com/fitness-api-index) - Sortable raw signals per product: SDK and library releases, dated changes in the last 12 months, approval gates, verification age. No score.
- [Compare two fitness APIs side by side](https://aifitnessapi.com/compare-apis) - Access structure, user-side cost and approval gates for any two products in the directory.
- [Wearable API coverage matrix](https://aifitnessapi.com/tools/api-coverage-matrix) - Which wearable and fitness APIs document which metrics, at what resolution, how far back, and by webhook or pull. Every mark sourced; unknown where no page says.
- [Rate-limit and quota calculator](https://aifitnessapi.com/tools/rate-limit-calculator) - Users × syncs × endpoints against each fitness API's documented rate limits: which binds first, the most users it supports, and the vendor's own mitigations.
- [Why “today’s steps” is a bug](https://aifitnessapi.com/day-boundaries) - Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.
- [Ship It: a fitness-app survival game](https://aifitnessapi.com/play/ship-it) - Pick a product and a data stack, then live through the real, dated API events that hit it: Fitbit turn-off, Google Fit end of support, Garmin approval, Strava rules.
- [Pose model benchmark](https://aifitnessapi.com/tools/pose-benchmark) - Time MediaPipe Pose Landmarker lite, full and heavy on your own device, copy the latency table as markdown and submit it to the leaderboard.
- [Rep counter playground](https://aifitnessapi.com/tools/rep-counter-playground) - Load a workout video, see joint angles over time, tune a hysteresis rep counter's thresholds and export the config as JSON. The video stays in your browser.
- [Bluetooth heart-rate lab](https://aifitnessapi.com/tools/heart-rate-lab) - Connect a BLE heart-rate strap in the browser: every 0x2A37 byte decoded, and whether it sends the RR intervals HRV needs.
- [FTMS lab](https://aifitnessapi.com/tools/ftms-lab) - Connect a treadmill, indoor bike, rower or cross trainer over Web Bluetooth, or paste hex: every FTMS flag bit and field decoded against the SIG structure.
- [Cycling power and cadence lab](https://aifitnessapi.com/tools/cycling-power-lab) - Cycling Power (0x2A63) and CSC (0x2A5B) decoded, with cadence and speed computed from cumulative revolutions and event times, live or pasted.
- [BLE GATT explorer](https://aifitnessapi.com/tools/ble-gatt-explorer) - Connect any Bluetooth LE device: services and characteristics by SIG name, read or notify, values decoded where the SIG defines a structure.
- [My stack](https://aifitnessapi.com/my-stack) - Pick the APIs your product depends on: their tracked changes and deadlines, every page here about them with its date, and a calendar to save. Stays in your browser.
- [Answer search](https://aifitnessapi.com/answers-search) - Search the full text of every answer capsule, FAQ answer and tracked change, ranked in your browser, with links to the exact answer.
- [Daily health-API developer puzzle](https://aifitnessapi.com/daily) - Five questions a day from the site's datasets: which platform throws this error, HealthKit to Health Connect, sum or average, name the keypoint.
- [Step lab](https://aifitnessapi.com/tools/step-lab) - Walk with your phone and watch a visible step detector count; move its threshold and interval to see why two apps disagree.
- [Apple Health export explorer](https://aifitnessapi.com/tools/apple-health-explorer) - Open your iPhone Health export.zip in the browser: record types with counts and dates, sources, a daily chart and a CSV per type. Nothing is uploaded.
- [Gym software API matrix](https://aifitnessapi.com/tools/gym-software-api-matrix) - Mindbody, Glofox, TeamUp, Mariana Tek, Wodify and more: auth, access, pricing, webhooks and coverage, filterable, each cell quoting its vendor source.
- [Research platform chooser](https://aifitnessapi.com/tools/research-platform-chooser) - Fitabase, Labfront, Empatica and Ametris: tick what your study needs and see which platforms document it, each answer quoting the vendor's page.

## About this list

- Generated by `scripts/build-awesome.mjs` from the data modules behind aifitnessapi.com. Do not edit this file by hand: change the data and run `node scripts/build-awesome.mjs`; the site's qa gate fails when this file is stale.
- Inclusion is mechanical: every product in the site's directory, every library on its libraries hub, every server its MCP Registry scan matched, every dataset and tool it publishes. A mistake is a mistake in the data, so report it on the source page: https://aifitnessapi.com/corrections.
- KinesteX funds aifitnessapi.com. Its entry is drawn from the same directory as every other, and the list ranks nothing.

## License

This list is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit AIFitnessAPI and link https://aifitnessapi.com/awesome. The libraries, servers and services it links keep their own licenses and terms.
