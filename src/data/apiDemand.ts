/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/build-api-demand.mjs
 * after scripts/search-pull.mjs (the weekly live pull).
 *
 * What developers searched for about each product in the API directory, in
 * the 28 days 2026-09-22 to 2026-10-19: impressions of the
 * disclosed queries naming the product, per engine and never added together,
 * and the pages on this site those queries surfaced, with up to three of the
 * queries each. Selection and filtering rules are in the script's header.
 * 24 products.
 */

export type DemandEngine = "Google" | "Bing" | "Google and Bing";
export type DemandPage = { href: string; queries: { q: string; engine: DemandEngine }[] };
export type ApiDemand = { google: number; bing: number; pages: DemandPage[] };

export const API_DEMAND_RANGE = {"start":"2026-09-22","end":"2026-10-19"} as const;

export const API_DEMAND: Record<string, ApiDemand> = {
  "fitbit": {
    "google": 54,
    "bing": 103,
    "pages": [
      {
        "href": "/integrate/fitbit-api",
        "queries": [
          {
            "q": "fitbit api",
            "engine": "Google"
          },
          {
            "q": "fitbit get the current running pace api",
            "engine": "Bing"
          },
          {
            "q": "api fitbit",
            "engine": "Google and Bing"
          }
        ]
      },
      {
        "href": "/fitbit-api-shutdown",
        "queries": [
          {
            "q": "fitbit api deprecation",
            "engine": "Google and Bing"
          },
          {
            "q": "fitbit api end of life",
            "engine": "Bing"
          }
        ]
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "queries": [
          {
            "q": "should i build my own fitbit api integration or use a research platform? which companies offer this?",
            "engine": "Google"
          },
          {
            "q": "fitbit web api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "is there a platform that gives me a single api to pull all my participants' fitbit data at once?",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/migrate/fitbit-web-api-to-google-health",
        "queries": [
          {
            "q": "fitbit web",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "garmin": {
    "google": 284,
    "bing": 52,
    "pages": [
      {
        "href": "/libraries/garminconnect",
        "queries": [
          {
            "q": "garmin connect python library garth unofficial api",
            "engine": "Google"
          },
          {
            "q": "garmin connect python",
            "engine": "Google"
          },
          {
            "q": "python garmin connect",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra garmin api",
            "engine": "Google"
          },
          {
            "q": "terra garmin",
            "engine": "Google and Bing"
          },
          {
            "q": "terra api garmin",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fix/garmin-api-approval",
        "queries": [
          {
            "q": "garmin api",
            "engine": "Google"
          },
          {
            "q": "garmin connect developer program access request form",
            "engine": "Google"
          },
          {
            "q": "garmin connect api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "garmin health api oauth developer registration",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/garmin-api",
        "queries": [
          {
            "q": "garmin connect iq api vs health api unterschied",
            "engine": "Google"
          },
          {
            "q": "api garmin",
            "engine": "Google"
          },
          {
            "q": "garmin api developer",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/garmin-api-alternatives",
        "queries": [
          {
            "q": "garmin connect api private use alternative 2025",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "oura": {
    "google": 33,
    "bing": 20,
    "pages": [
      {
        "href": "/integrate/oura-api",
        "queries": [
          {
            "q": "oura connector",
            "engine": "Google"
          },
          {
            "q": "oura api",
            "engine": "Google and Bing"
          },
          {
            "q": "oura ring api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "whoop": {
    "google": 64,
    "bing": 30,
    "pages": [
      {
        "href": "/integrate/whoop-api",
        "queries": [
          {
            "q": "whoop api",
            "engine": "Google and Bing"
          },
          {
            "q": "is whoop api free",
            "engine": "Google"
          },
          {
            "q": "whoop developer",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/apple-watch-vs-whoop",
        "queries": [
          {
            "q": "whoop api developer integration",
            "engine": "Google"
          },
          {
            "q": "whoop vs apple watch",
            "engine": "Google"
          },
          {
            "q": "whoop vs apple watch app",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/whoop-api-alternatives",
        "queries": [
          {
            "q": "how does whoop compare to alternatives for recovery scoring?",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/pricing",
        "queries": [
          {
            "q": "whoop api cost",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "strava": {
    "google": 68,
    "bing": 11,
    "pages": [
      {
        "href": "/integrate/strava-api",
        "queries": [
          {
            "q": "strava api",
            "engine": "Google"
          },
          {
            "q": "strava integration",
            "engine": "Google"
          },
          {
            "q": "api strava",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/data/gps-activity-api",
        "queries": [
          {
            "q": "strava developers site route suggestion api endpoint",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/migrate/adapt-to-strava-api-changes",
        "queries": [
          {
            "q": "strava api integration",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/pricing/strava-api-pricing",
        "queries": [
          {
            "q": "strava api pricing",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "polar": {
    "google": 13,
    "bing": 33,
    "pages": [
      {
        "href": "/integrate/polar-api",
        "queries": [
          {
            "q": "polar flow api",
            "engine": "Google and Bing"
          },
          {
            "q": "polar accesslink",
            "engine": "Bing"
          },
          {
            "q": "polar accesslink api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "healthkit": {
    "google": 187,
    "bing": 71,
    "pages": [
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "queries": [
          {
            "q": "cliniko vs healthkit",
            "engine": "Google"
          },
          {
            "q": "healthkit vs cliniko",
            "engine": "Google"
          },
          {
            "q": "google healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/matrix",
        "queries": [
          {
            "q": "healthkit",
            "engine": "Google"
          },
          {
            "q": "what is healthkit",
            "engine": "Google"
          },
          {
            "q": "healthkit api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/healthkit",
        "queries": [
          {
            "q": "apple healthkit",
            "engine": "Google"
          },
          {
            "q": "apple healthkit api",
            "engine": "Google"
          },
          {
            "q": "swift healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/react-native-health",
        "queries": [
          {
            "q": "react-native-healthkit",
            "engine": "Google"
          },
          {
            "q": "react native healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/kingstinct-react-native-healthkit",
        "queries": [
          {
            "q": "kingstinct/react-native-healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/healthkit-queries/hkanchoredobjectquery",
        "queries": [
          {
            "q": "hkanchoredobjectquery",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "health-connect": {
    "google": 34,
    "bing": 53,
    "pages": [
      {
        "href": "/libraries/flutter-health-connect",
        "queries": [
          {
            "q": "flutter health connect",
            "engine": "Google"
          },
          {
            "q": "health connect flutter",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/google-fit-api-alternatives",
        "queries": [
          {
            "q": "google fit apis deprecated health connect official 2026",
            "engine": "Google"
          },
          {
            "q": "google fit api deprecation health connect official 2026",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fix/google-fit-api-deprecated",
        "queries": [
          {
            "q": "google fit api deprecation health connect 2026 official",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/health-connect-api",
        "queries": [
          {
            "q": "health connect api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "terra": {
    "google": 101,
    "bing": 23,
    "pages": [
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          },
          {
            "q": "spike vs terra api in united states",
            "engine": "Google"
          },
          {
            "q": "terra wearable api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra aggregator",
            "engine": "Google"
          },
          {
            "q": "terra garmin",
            "engine": "Google and Bing"
          },
          {
            "q": "terra api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/terra-alternatives",
        "queries": [
          {
            "q": "terra api alternative",
            "engine": "Google"
          },
          {
            "q": "terra api alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "junction": {
    "google": 2,
    "bing": 15,
    "pages": [
      {
        "href": "/alternatives/terra-alternatives",
        "queries": [
          {
            "q": "what is the best vital api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "rook": {
    "google": 8,
    "bing": 14,
    "pages": []
  },
  "spike": {
    "google": 46,
    "bing": 3,
    "pages": [
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          },
          {
            "q": "spike vs terra api in united states",
            "engine": "Google"
          },
          {
            "q": "spike api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare",
        "queries": [
          {
            "q": "spike api alternative",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "nutritionix": {
    "google": 16,
    "bing": 7,
    "pages": [
      {
        "href": "/alternatives/nutritionix-alternatives",
        "queries": [
          {
            "q": "nutritionix alternative",
            "engine": "Google"
          },
          {
            "q": "nutritionix api alternative",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/nutritionix-vs-edamam",
        "queries": [
          {
            "q": "nutritionix api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "edamam": {
    "google": 1,
    "bing": 5,
    "pages": []
  },
  "usda-fdc": {
    "google": 0,
    "bing": 2,
    "pages": []
  },
  "open-food-facts": {
    "google": 0,
    "bing": 1,
    "pages": []
  },
  "exercisedb": {
    "google": 36,
    "bing": 36,
    "pages": [
      {
        "href": "/alternatives/exercisedb-alternatives",
        "queries": [
          {
            "q": "exercisedb",
            "engine": "Google"
          },
          {
            "q": "is exercisedb io same as rapiapi exercisedb",
            "engine": "Bing"
          },
          {
            "q": "exercisedb (rapidapi)",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "queries": [
          {
            "q": "exercisedb free",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "wger": {
    "google": 10,
    "bing": 9,
    "pages": [
      {
        "href": "/alternatives/exercisedb-alternatives",
        "queries": [
          {
            "q": "wger alternative",
            "engine": "Google"
          },
          {
            "q": "wger alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "kinestex": {
    "google": 1,
    "bing": 0,
    "pages": []
  },
  "sency": {
    "google": 0,
    "bing": 2,
    "pages": []
  },
  "quickpose": {
    "google": 0,
    "bing": 0,
    "pages": []
  },
  "mediapipe": {
    "google": 69,
    "bing": 50,
    "pages": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "queries": [
          {
            "q": "movenet vs mediapipe",
            "engine": "Google"
          },
          {
            "q": "mediapipe vs yolo",
            "engine": "Google"
          },
          {
            "q": "yolo pose vs mediapipe",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "queries": [
          {
            "q": "mediapipe pose landmarker",
            "engine": "Bing"
          },
          {
            "q": "mediapipe pose landmarker lite",
            "engine": "Bing"
          }
        ]
      }
    ]
  },
  "movenet": {
    "google": 18,
    "bing": 14,
    "pages": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "queries": [
          {
            "q": "movenet vs mediapipe",
            "engine": "Google"
          },
          {
            "q": "mediapipe vs movenet",
            "engine": "Google"
          },
          {
            "q": "movenet model",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "apple-vision": {
    "google": 21,
    "bing": 0,
    "pages": [
      {
        "href": "/motion/apple-vision-body-pose",
        "queries": [
          {
            "q": "vndetecthumanbodyposerequest",
            "engine": "Google"
          },
          {
            "q": "vndetecthumanbodypose3drequest",
            "engine": "Google"
          }
        ]
      }
    ]
  }
};
