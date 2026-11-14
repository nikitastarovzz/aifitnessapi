/**
 * The wearable and fitness API coverage matrix behind /tools/api-coverage-matrix
 * (ops/AUDIENCE-30-2026-11-05.md item 3).
 *
 * Plain ESM with no dependencies, imported by the page, its client filter and
 * scripts/api-coverage.test.mjs, so the test checks exactly what a reader sees.
 *
 * Hand-curated, and it adds no facts. Every cell, delivery note, history note
 * and resolution note carries `src`: the vendor URL, the vendor's own words,
 * and `ev`, the evidence file that already holds that quote. Each was copied
 * from the evidence file of the vendor's integration guide
 * (ops/sources/evidence/integrate-<slug>.json), whose quotes
 * .github/workflows/source-quotes.yml re-checks against the live pages; the
 * test fails if a quote here is not in its evidence file under the same URL.
 * Our short `note` paraphrases the quote and must not say more than it.
 *
 * Absence is never inferred. A metric the pages we read do not mention is
 * left out of `cells` and renders as "not stated", linked to the guide that
 * lists what was read. `no` holds only the metrics a vendor says it does not
 * provide. The Google Health API column is not here: it is derived at build
 * time from the generated src/data/googleHealthApi.ts (lib/ghapiCoverage.ts).
 *
 * To change a cell, re-read the vendor page, update the evidence file first,
 * then copy the quote here verbatim.
 */

/** The metric rows, in display order. `matrix` names the matching row of the
 *  HealthKit/Health Connect type reference (/matrix), where one exists. */
export const COVERAGE_METRICS = [
  { id: "heart-rate", label: "Heart rate", matrix: "heart-rate" },
  { id: "hrv", label: "HRV or beat intervals", matrix: "hrv" },
  { id: "sleep", label: "Sleep", matrix: "sleep" },
  { id: "steps", label: "Steps and daily activity", matrix: "steps" },
  { id: "workouts", label: "Workouts", matrix: "workouts" },
  { id: "gps-route", label: "GPS route", matrix: "gps-route" },
  { id: "spo2", label: "Blood oxygen (SpO2)", matrix: "blood-oxygen" },
  { id: "respiration", label: "Respiration", matrix: null },
  { id: "temperature", label: "Body or skin temperature", matrix: null },
  { id: "body", label: "Weight and body composition", matrix: "body-composition" },
  { id: "vo2max", label: "VO2 max", matrix: "vo2-max" },
  { id: "glucose", label: "Glucose", matrix: null },
  { id: "stress", label: "Stress, recovery or readiness", matrix: null },
];

export const DELIVERY_LABELS = {
  webhook: "Webhook",
  push: "Push",
  pull: "Pull",
  "on-device": "On-device",
};

export const KIND_LABELS = {
  cloud: "Cloud API",
  aggregator: "Aggregator",
  "on-device": "On-device SDK",
};

export const COVERAGE_VENDORS =[
  {
    "id": "oura",
    "name": "Oura",
    "guide": "/integrate/oura-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Time-series heart rate",
        "res": "5-minute increments",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "Heart rate is provided at 5-minute increments.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "sleep": {
        "note": "Sleep periods; a user can have several a day",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "A user can have multiple sleep periods per day.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "steps": {
        "note": "Daily activity summary and activity levels",
        "res": "Daily summary",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "The Daily Activity scope includes daily activity summary values and detailed activity levels.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "spo2": {
        "note": "Daily SpO2 average, Gen 3 ring only",
        "res": "Daily average",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "The Daily SpO2 (blood oxygenation) routes include daily SpO2 average. Data will only be available for users with a Gen 3 Oura Ring",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "stress": {
        "note": "Daily minutes in high stress and high recovery",
        "res": "Daily",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "The daily stress route includes a summary of the number of minutes the user spends in high stress and high recovery each day.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "vo2max": {
        "note": "VO2 max route",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "VO2 Max is a measure of the maximum volume of oxygen that an individual can use during intense exercise.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      "body": {
        "note": "Weight and height in personal info",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "The Personal Info scope includes personal information (e.g. age, email, weight, and height) about the user.",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhooks, which Oura calls the preferred way to consume its data",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "Webhooks are the preferred way to consume Oura data",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "REST under /v2/usercollection/",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "curl -X GET https://api.ouraring.com/v2/usercollection/personal_info",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "One request for history when a user connects, then webhooks; depth not stated",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "Make a single request for historical data when a user first connects, then use webhooks for ongoing updates",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      {
        "note": "Fetch history in ranges of about 1 to 3 months",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "Use date range queries with reasonable time spans (e.g., 1-3 months at a time)",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      }
    ]
  },
  {
    "id": "whoop",
    "name": "WHOOP",
    "guide": "/integrate/whoop-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Average heart rate per cycle (and per workout)",
        "res": "Average per cycle or workout",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:cycles - Read cycles data, including day Strain and average heart rate during a physiological cycle.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "hrv": {
        "note": "HRV and resting heart rate in Recovery",
        "res": "Per recovery",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:recovery - Read Recovery data, including score, heart rate variability, and resting heart rate.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "sleep": {
        "note": "Sleep performance and duration per stage",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:sleep - Read sleep data, including performance % and duration per sleep stage.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "steps": {
        "note": "Total steps per cycle (since September 23, 2026)",
        "res": "Total per cycle",
        "src": {
          "url": "https://developer.whoop.com/docs/api-changelog/",
          "quote": "Cycles now include the total number of steps taken during the cycle.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "workouts": {
        "note": "Workouts with activity Strain and average heart rate",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:workout - Read workout data, including activity Strain and average heart rate.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "body": {
        "note": "Height, weight and max heart rate",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:body_measurement - Read body measurements data, including height, weight, and max heart rate.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      "stress": {
        "note": "Recovery score",
        "src": {
          "url": "https://developer.whoop.com/api/",
          "quote": "read:recovery - Read Recovery data, including score, heart rate variability, and resting heart rate.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhooks for workout, sleep and recovery updates and deletes",
        "src": {
          "url": "https://developer.whoop.com/docs/developing/webhooks/",
          "quote": "Enum : \"workout.updated\" \"workout.deleted\" \"sleep.updated\" \"sleep.deleted\" \"recovery.updated\" \"recovery.deleted\"",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "No webhooks for day Strain, cycles or body measurements: fetch those",
        "src": {
          "url": "https://developer.whoop.com/docs/developing/webhooks/",
          "quote": "Not at the moment; these data points should be retrieved by calling their respective APIs.",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      }
    ],
    "history": []
  },
  {
    "id": "garmin",
    "name": "Garmin",
    "guide": "/integrate/garmin-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Health API all-day heart rate",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Steps Intensity Minutes Sleep Calories Heart Rate",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "hrv": {
        "note": "Enhanced beat-to-beat interval, asterisked as an Enterprise item",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Stress Pulse Ox Body Battery Body Composition Respiration Blood Pressure *Enhanced Beat-To-Beat Interval *",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "sleep": {
        "note": "Health API sleep",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Steps Intensity Minutes Sleep Calories Heart Rate",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "steps": {
        "note": "Health API steps, with epoch summaries for all-day activities",
        "res": "Epoch summaries (interval not stated)",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Data includes heart rate, steps, calories, sleep, respiration, body composition as well as detailed stress, pulse-ox, and epoch summaries for all-day activities.",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "workouts": {
        "note": "Activity API: running, cycling, swimming, yoga, strength training",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/activity-api/",
          "quote": "Running Cycling Swimming Yoga Strength Training Activity Details",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "spo2": {
        "note": "Pulse Ox",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Stress Pulse Ox Body Battery Body Composition Respiration Blood Pressure *Enhanced Beat-To-Beat Interval *",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "respiration": {
        "note": "Respiration",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Stress Pulse Ox Body Battery Body Composition Respiration Blood Pressure *Enhanced Beat-To-Beat Interval *",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "body": {
        "note": "Body composition",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Stress Pulse Ox Body Battery Body Composition Respiration Blood Pressure *Enhanced Beat-To-Beat Interval *",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      "stress": {
        "note": "Stress and Body Battery",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Stress Pulse Ox Body Battery Body Composition Respiration Blood Pressure *Enhanced Beat-To-Beat Interval *",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "push",
        "note": "Starter: push only",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/overview/",
          "quote": "Push only Historical Data Not included User Capacity Limited",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "Enterprise: push or ping/pull",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/overview/",
          "quote": "Golf API JSON Delivery Push or Ping/Pull Historical Data 1 month + User Capacity Unlimited Technical Support Included",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "Starter: historical data not included",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/overview/",
          "quote": "Push only Historical Data Not included User Capacity Limited",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      {
        "note": "Enterprise: 1 month+ of historical data",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/overview/",
          "quote": "Golf API JSON Delivery Push or Ping/Pull Historical Data 1 month + User Capacity Unlimited Technical Support Included",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      },
      {
        "note": "Backfill marked Enterprise-only",
        "src": {
          "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
          "quote": "Developer Web Tools: Easy on-boarding, sample data, *backfill user data, and auto-verification of your integration before production",
          "ev": "ops/sources/evidence/integrate-garmin-api.json"
        }
      }
    ]
  },
  {
    "id": "polar",
    "name": "Polar AccessLink",
    "guide": "/integrate/polar-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Continuous heart rate, excluding training sessions",
        "res": "5-minute intervals",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Samples are recording in 5 minute intervals. Heart rate samples from training sessions are not available through this resource.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "sleep": {
        "note": "Sleep for the last 28 days",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "List sleep data of user for the last 28 days.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "steps": {
        "note": "Daily activity",
        "res": "Daily",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "When no date range is given, activities from the last 28 days are returned. When `from` is given, activities for the specified date range are returned. From date cannot be older than 365 days from today and the maximum range between from and to is 28 days.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "workouts": {
        "note": "Exercises, with optional samples and zones",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Use samples and zones query parameters to return optional samples and zone information of the exercises.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "gps-route": {
        "note": "Route data for an exercise",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "description: Return all route data for this exercise.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "spo2": {
        "note": "SpO2 test reports (Elixir biosensing)",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Biosensing data consists of body temperature data, sleep skin temperature data, skin contacts data, wrist ECG test report data and SpO2 test report data.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      "temperature": {
        "note": "Body and sleep skin temperature (Elixir biosensing)",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Biosensing data consists of body temperature data, sleep skin temperature data, skin contacts data, wrist ECG test report data and SpO2 test report data.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhook, which must answer Polar's ping when created",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "When creating webhook the AccessLink sends a ping message to the url in request body. The ping message must be answered with 200 OK or otherwise the webhook is not created.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "Notifications list available exercises and activities",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Get list of available exercises and activities for users",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "Exercises: last 30 days, and only after the user registered with your client",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "Only Exercises uploaded to Flow in the last 30 days are returned. Only exercises that have been uploaded to Flow after the user is registered with your client will be returned.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      {
        "note": "Daily activity: last 28 days by default, from up to 365 days back, 28 days per request",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "When no date range is given, activities from the last 28 days are returned. When `from` is given, activities for the specified date range are returned. From date cannot be older than 365 days from today and the maximum range between from and to is 28 days.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      },
      {
        "note": "Sleep: last 28 days",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "List sleep data of user for the last 28 days.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      }
    ]
  },
  {
    "id": "withings",
    "name": "Withings",
    "guide": "/integrate/withings-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Heart rate with blood pressure measurements, when supported",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "A new blood pressure measurement (and heart rate, when supported) was recorded.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      "sleep": {
        "note": "Sleep summary: duration, deep/light (no REM), wakeups",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "New sleep data is available — duration, sleep state, deep/light state duration (no REM), and wakeup counts.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      "steps": {
        "note": "Activity: steps, distance, calories, intensity",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "New activity data is available — steps, distance, calories, intensity, or workouts.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      "workouts": {
        "note": "Workouts in the activity category",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "New activity data is available — steps, distance, calories, intensity, or workouts.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      "body": {
        "note": "Weight and body composition from Withings scales",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "A new weight or body composition measurement was recorded by a Withings scale.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      "glucose": {
        "note": "Glucose measurements",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
          "quote": "A new glucose measurement was recorded.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Notifications POSTed to your callback, then you fetch",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
          "quote": "Withings POSTs to your callback URL the moment new measurements arrive, then your handler fetches the data via the Data API.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "lastupdate returns everything created or modified since your last fetch",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/fetch-data-example/",
          "quote": "For ongoing sync, we recommend lastupdate instead: pass the timestamp of your last successful fetch and the Data API returns everything created or modified since, including any updates you missed if a notification was lost.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "All historical data the user's devices collected",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/oauth-web-flow/",
          "quote": "you will have access not only to new data but also to all historical health data collected by the devices",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      }
    ]
  },
  {
    "id": "strava",
    "name": "Strava",
    "guide": "/integrate/strava-api",
    "kind": "cloud",
    "cells": {
      "workouts": {
        "note": "Activities (with athletes, routes and gear)",
        "src": {
          "url": "https://developers.strava.com/docs/getting-started/",
          "quote": "The Strava REST API includes data on athletes, activities, routes, and gear.",
          "ev": "ops/sources/evidence/integrate-strava-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "One push subscription per app for activity and athlete events",
        "src": {
          "url": "https://developers.strava.com/docs/webhooks/",
          "quote": "Each application may only have one subscription, but that single subscription will allow the application to receive webhook events for all supported changes to data owned by athletes that have authorized that application.",
          "ev": "ops/sources/evidence/integrate-strava-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "Athlete activities filtered by before/after epoch timestamps",
        "src": {
          "url": "https://developers.strava.com/swagger/swagger.json",
          "quote": "An epoch timestamp to use for filtering activities that have taken place before a certain time.",
          "ev": "ops/sources/evidence/integrate-strava-api.json"
        }
      }
    ],
    "history": []
  },
  {
    "id": "suunto",
    "name": "Suunto",
    "guide": "/integrate/suunto-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Heart rate samples inside workout FIT files",
        "res": "Per-sample in FIT (rate not stated)",
        "src": {
          "url": "https://apizone.suunto.com/",
          "quote": "These also have all the measured samples such as heart rate, r-r data, power data, altitude, temperature. These files also contain GPS tracks.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      "hrv": {
        "note": "R-R data inside workout FIT files",
        "src": {
          "url": "https://apizone.suunto.com/",
          "quote": "These also have all the measured samples such as heart rate, r-r data, power data, altitude, temperature. These files also contain GPS tracks.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      "steps": {
        "note": "Daily steps and calories",
        "res": "Daily",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "This contains daily steps and calories.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      "workouts": {
        "note": "Workouts as FIT files",
        "src": {
          "url": "https://apizone.suunto.com/",
          "quote": "Application interface (API) provides you possibility to access the workout data tracked with Suunto devices. The API provides you the FIT files common in sports industry.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      "gps-route": {
        "note": "GPS tracks inside workout FIT files",
        "src": {
          "url": "https://apizone.suunto.com/",
          "quote": "These also have all the measured samples such as heart rate, r-r data, power data, altitude, temperature. These files also contain GPS tracks.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      }
    },
    "no": {
      "sleep": {
        "note": "Suunto says the Cloud API does not yet support sleep",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "The Suunto Cloud API doesn’t yet support the sleep data fetch/push.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      "body": {
        "note": "Suunto says weight is not available yet",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "Personal data such as weight data or heartrate zones are not available yet from Suunto Cloud API",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      }
    },
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhook for new workouts",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "Use the webhook method to get a notification about new workouts.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "No webhook for daily activity: fetch it, about once a day",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "You can additionally fetch the daily activity for the user i.e. once a day, just in case user has synched their device with Suunto app wihout workouts.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "Workout list covers past history; depth not stated",
        "src": {
          "url": "https://apizone.suunto.com/faq",
          "quote": "To get list of the workouts from the past history.",
          "ev": "ops/sources/evidence/integrate-suunto-api.json"
        }
      }
    ]
  },
  {
    "id": "coros",
    "name": "COROS",
    "guide": "/integrate/coros-api",
    "kind": "cloud",
    "cells": {
      "heart-rate": {
        "note": "Daily heart rate and resting heart rate (via the COROS MCP)",
        "res": "Daily",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Daily heart rate, HRV, stress, Wellness Checks, and resting heart rate",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "hrv": {
        "note": "Daily HRV (via the COROS MCP)",
        "res": "Daily",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Daily heart rate, HRV, stress, Wellness Checks, and resting heart rate",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "steps": {
        "note": "Daily steps and calories (via the COROS MCP)",
        "res": "Daily",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Daily steps, calories, workout duration, and weekly Training Load",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "workouts": {
        "note": "Workout records (getWorkoutRecords)",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "getUserInfo, getWorkoutRecords (30-day max, 3-month lookback), getDailyData",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "gps-route": {
        "note": "FIT files with GPS tracks, 50 file requests a day (via the COROS MCP)",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": ".FIT files, including GPS tracks (capped at 50 file requests per day)",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "vo2max": {
        "note": "VO2 Max (via the COROS MCP)",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "VO2 Max, Running Fitness, race prediction times, and recovery status",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      "stress": {
        "note": "Daily stress and recovery status (via the COROS MCP)",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Daily heart rate, HRV, stress, Wellness Checks, and resting heart rate",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Partner API: workout data pushed within about 5 minutes",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Webhook push notifications (workout data pushed to your endpoint within ~5 minutes)",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "MCP path: no webhooks, your app polls",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "No webhook push notifications (your app polls the MCP)",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "getWorkoutRecords: 30 days per request, 3-month lookback",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "getUserInfo, getWorkoutRecords (30-day max, 3-month lookback), getDailyData",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      }
    ]
  },
  {
    "id": "wahoo",
    "name": "Wahoo",
    "guide": "/integrate/wahoo-api",
    "kind": "cloud",
    "cells": {
      "workouts": {
        "note": "Workout summaries: distance, duration, calories; not workouts from third-party apps",
        "src": {
          "url": "https://cloud-api.wahooligan.com/",
          "quote": "The workout_summary contains the results of the workout, such as distance, duration, and calories burned.",
          "ev": "ops/sources/evidence/integrate-wahoo-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "workout_summary webhook (needs offline_data)",
        "src": {
          "url": "https://cloud-api.wahooligan.com/",
          "quote": "Please make sure the offline_data scope is added and users have a valid access token with the scope to receive webhooks.",
          "ev": "ops/sources/evidence/integrate-wahoo-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "Workout upload and download over the Cloud API",
        "src": {
          "url": "https://developers.wahooligan.com/cloud",
          "quote": "The Cloud API allows you to connect Wahoo users directly to your mobile and web applications. Using the OAuth2.0 standard protocol, the API authorizes login/connection to Wahoo, and supports managing profile data, heart rate and power zones, and the upload/download of workout data to the cloud.",
          "ev": "ops/sources/evidence/integrate-wahoo-api.json"
        }
      }
    ],
    "history": []
  },
  {
    "id": "dexcom",
    "name": "Dexcom",
    "guide": "/integrate/dexcom-api",
    "kind": "cloud",
    "cells": {
      "glucose": {
        "note": "Estimated glucose values (EGVs) and events",
        "src": {
          "url": "https://developer.dexcom.com/docs/",
          "quote": "Using the Dexcom API, authorized Digital Health Partners can leverage Dexcom CGM data, such as estimated glucose values and events, to build or enhance their apps.",
          "ev": "ops/sources/evidence/integrate-dexcom-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "pull",
        "note": "GET /v3/users/self/egvs and related endpoints",
        "src": {
          "url": "https://developer.dexcom.com/docs/dexcomv3/endpoint-overview",
          "quote": "GET /v3/users/self/egvs Estimated Glucose Values",
          "ev": "ops/sources/evidence/integrate-dexcom-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "At most 30 days per request window; longer returns 400",
        "src": {
          "url": "https://developer.dexcom.com/docs/dexcomv3/endpoint-overview",
          "quote": "This window can be a maximum of 30 days, and any request with a time window greater than 30 days returns a 400 (Bad Request) error.",
          "ev": "ops/sources/evidence/integrate-dexcom-api.json"
        }
      }
    ]
  },
  {
    "id": "concept2",
    "name": "Concept2 Logbook",
    "guide": "/integrate/concept2-api",
    "kind": "cloud",
    "cells": {
      "workouts": {
        "note": "Results (rower, SkiErg, bike and more)",
        "res": "Stroke data per workout",
        "src": {
          "url": "https://log.concept2.com/developers/documentation/",
          "quote": "Fetches only results of this type. Must be one of rower skierg bike dynamic slides paddle water snow rollerski multierg",
          "ev": "ops/sources/evidence/integrate-concept2-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhook on result added, updated or deleted",
        "src": {
          "url": "https://log.concept2.com/developers/documentation/",
          "quote": "Through your self-service developer portal, you can register and manage a webhook that will fire when a relevant result is added, updated, or deleted.",
          "ev": "ops/sources/evidence/integrate-concept2-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "GET /api/users/me/results",
        "src": {
          "url": "https://log.concept2.com/developers/documentation/",
          "quote": "fetches all the workouts for the authenticated user",
          "ev": "ops/sources/evidence/integrate-concept2-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "Results filter by from, to, type and updated_after; depth not stated",
        "src": {
          "url": "https://log.concept2.com/developers/documentation/",
          "quote": "Fetches only results created or updated on or after this date.",
          "ev": "ops/sources/evidence/integrate-concept2-api.json"
        }
      }
    ]
  },
  {
    "id": "terra",
    "name": "Terra",
    "guide": "/integrate/terra-api",
    "kind": "aggregator",
    "cells": {
      "sleep": {
        "note": "/sleep: sleep sessions",
        "src": {
          "url": "https://raw.githubusercontent.com/tryterra/openapi/master/dist/core/v2-bundled.yaml",
          "quote": "summary: Retrieve sleep sessions",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      },
      "workouts": {
        "note": "/activity: completed workout sessions",
        "src": {
          "url": "https://raw.githubusercontent.com/tryterra/openapi/master/dist/core/v2-bundled.yaml",
          "quote": "Returns a user's completed workout sessions in a date range, each with a start and end time and an activity type such as running or cycling.",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      },
      "body": {
        "note": "/body: body metrics (fields depend on the source)",
        "src": {
          "url": "https://raw.githubusercontent.com/tryterra/openapi/master/dist/core/v2-bundled.yaml",
          "quote": "summary: Retrieve body metrics",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "webhook",
        "note": "Webhooks, databases, cloud storage or queues as destinations",
        "src": {
          "url": "https://tryterra.co/",
          "quote": "Terra delivers to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore.",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      },
      {
        "mode": "pull",
        "note": "Requests over a month must use to_webhook and arrive asynchronously",
        "src": {
          "url": "https://docs.tryterra.co/unified-api/requesting-historical-data",
          "quote": "Time ranges longer than one month must use to_webhook=true , and Terra sends the data asynchronously .",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      }
    ],
    "history": [
      {
        "note": "No single request may span more than five years",
        "src": {
          "url": "https://docs.tryterra.co/reference/health-and-fitness-api/rate-limits",
          "quote": "your start_date to end_date window is wider than 5 years",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      }
    ],
    "resolution": [
      {
        "note": "with_samples must be true for granular data",
        "src": {
          "url": "https://docs.tryterra.co/unified-api/requesting-historical-data",
          "quote": "must be set to true to receive granular data",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      }
    ]
  },
  {
    "id": "samsung",
    "name": "Samsung Health Data SDK",
    "guide": "/integrate/samsung-health-api",
    "kind": "on-device",
    "cells": {
      "heart-rate": {
        "note": "Heart rate",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "sleep": {
        "note": "Sleep",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "steps": {
        "note": "Steps, aggregated across sources",
        "res": "Aggregates by periods down to MINUTELY",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "workouts": {
        "note": "Exercise",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "gps-route": {
        "note": "Exercise location",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "spo2": {
        "note": "Blood oxygen",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "temperature": {
        "note": "Body and skin temperature",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "body": {
        "note": "Body composition",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      },
      "glucose": {
        "note": "Blood glucose",
        "src": {
          "url": "https://developer.samsung.com/health/data/overview.html",
          "quote": "Activity summary Active calories burned goal Active time goal Blood glucose Blood oxygen Blood pressure Body composition Body temperature Energy score Exercise Exercise location Floors climbed Heart rate Irregular heart rhythm notification Nutrition Nutrition goal Skin temperature Sleep Sleep apnea Sleep goal Steps Step goal Water intake Water intake goal User profile",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      }
    },
    "no": {},
    "delivery": [
      {
        "mode": "on-device",
        "note": "Reads Samsung Health on the phone; readChanges() returns what changed",
        "src": {
          "url": "https://developer.samsung.com/health/data/faq.html",
          "quote": "HealthDataStore.readChanges() and HealthDataStore.readChangesAsync() provide data change information for a given data type and a time filter.",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      }
    ],
    "history": [],
    "resolution": [
      {
        "note": "Aggregates group by periods such as MINUTELY, DAILY, WEEKLY, MONTHLY and YEARLY",
        "src": {
          "url": "https://developer.samsung.com/codelab/health/steps-data.html",
          "quote": "You can also group by other time periods such as MINUTELY , DAILY , WEEKLY , MONTHLY , and YEARLY .",
          "ev": "ops/sources/evidence/integrate-samsung-health-api.json"
        }
      }
    ]
  }
];

/** "yes" with the cell, "no" with the vendor's own statement, or "unknown". */
export function cellState(vendor, metricId) {
  const yes = vendor.cells?.[metricId];
  if (yes) return { state: "yes", cell: yes };
  const no = vendor.no?.[metricId];
  if (no) return { state: "no", cell: no };
  return { state: "unknown", cell: null };
}

/** Whether the vendor documents any way to push data to you. */
export function pushes(vendor) {
  return vendor.delivery.some((d) => d.mode === "webhook" || d.mode === "push");
}

const norm = (s) => String(s ?? "").toLowerCase();

/**
 * The vendors a filter state keeps. A vendor stays when it is among the picked
 * vendors (or none are picked), every picked metric is documented ("yes"),
 * it documents a webhook or push when `push` is set, and the search text, if
 * any, occurs in its name, kind, or the label or note of a documented cell.
 */
export function filterVendors(vendors, state, metrics = COVERAGE_METRICS) {
  const q = norm(state.q).trim();
  return vendors.filter((v) => {
    if (state.vendors?.length && !state.vendors.includes(v.id)) return false;
    if (state.metrics?.some((m) => cellState(v, m).state !== "yes")) return false;
    if (state.push && !pushes(v)) return false;
    if (!q) return true;
    if (norm(v.name).includes(q) || norm(KIND_LABELS[v.kind]).includes(q)) return true;
    return metrics.some((m) => {
      const c = v.cells?.[m.id];
      return c && (norm(m.label).includes(q) || norm(c.note).includes(q) || norm(c.res).includes(q));
    });
  });
}

/** The metric rows a state shows: the picked ones, else all. */
export function visibleMetrics(state, metrics = COVERAGE_METRICS) {
  return state.metrics?.length ? metrics.filter((m) => state.metrics.includes(m.id)) : metrics;
}

const list = (s, allowed) =>
  String(s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter((x) => allowed.includes(x))
    .filter((x, i, a) => a.indexOf(x) === i);

/** Reads ?q=&m=a,b&v=x,y&push=1. Unknown ids are dropped, never guessed. */
export function parseCoverageState(search, vendorIds, metricIds = COVERAGE_METRICS.map((m) => m.id)) {
  const p = new URLSearchParams(search);
  return {
    q: (p.get("q") ?? "").slice(0, 80),
    metrics: list(p.get("m"), metricIds),
    vendors: list(p.get("v"), vendorIds),
    push: p.get("push") === "1",
  };
}

/** The query string for a state ("" when nothing is set). */
export function coverageStateToSearch(state) {
  const p = new URLSearchParams();
  if (state.q?.trim()) p.set("q", state.q.trim());
  if (state.metrics?.length) p.set("m", state.metrics.join(","));
  if (state.vendors?.length) p.set("v", state.vendors.join(","));
  if (state.push) p.set("push", "1");
  const s = p.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}
