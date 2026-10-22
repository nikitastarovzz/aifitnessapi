import type { ClusterEntry } from "./fitnessApis";

/**
 * AUTO-ASSEMBLED from per-spoke research + writing (originally auto-assembled;
 * since hand-edited — edit here). Body is MDX-safe GFM; plain-text fields are
 * entity-decoded. Every claim about a third-party product is hedged/attributed.
 */
export const entries: ClusterEntry[] =
[
  {
    "slug": "exercise-database-apis",
    "primaryQuery": "exercise database API",
    "h1": "The Best Exercise Database APIs for Developers (2026)",
    "metaTitle": "Exercise Database APIs for Developers (2026): 5 Compared",
    "metaDescription": "Exercise database APIs compared: ExerciseDB (AscendAPI), wger, API Ninjas and free-exercise-db by free tier, price, licence, media and catalog size.",
    "updated": "2026-10-22",
    "answer": "For data you own outright, use free-exercise-db, a public-domain dataset of 876 exercises with images; for a self-hosted open stack, use wger. For a hosted API, AscendAPI's ExerciseDB, formerly exercisedb.dev, is free to start: 1,500 exercises with GIFs and no key on V1, or a 200-exercise V2 trial with watermarked MP4 video, with full catalogs on paid RapidAPI plans. API Ninjas Exercises suits text metadata plus start and finish photos, but its free plan is evaluation only and commercial use starts at $39 to $59 a month. All of this was checked on October 22, 2026.",
    "body": "Two axes decide this category: **licence and hosting** (data you own and serve, or an API you rent) and **media** (text, still images, animated GIFs, or video). Muscle, equipment and instruction fields look alike everywhere, so they rarely decide anything.\n\nOne naming note before you compare. **\"ExerciseDB\" now mostly means AscendAPI.** The exercisedb.dev home page reads \"Previously ExerciseDB\" above the AscendAPI name, and AscendAPI's documentation names the `ExerciseDB/exercisedb-api` GitHub repository as its own. There is also an older ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6, which our July review covered; its page renders only its title to a non-browser client today, so we could not establish whether it and AscendAPI's listings are the same product. When a tutorial says ExerciseDB, check which host it calls.\n\n## The options at a glance\n\n| Option | Licence / hosting | Free entry point | Media | Catalog (as each source states it) |\n|---|---|---|---|---|\n| ExerciseDB V1 (AscendAPI) | Hosted; free tier keyless, paid tier on RapidAPI | 1,500 exercises, no key | GIFs: 180p free, up to 1080p paid | 1,500 free; \"over 2,000\" in V1 |\n| ExerciseDB V2 (AscendAPI) | Hosted on RapidAPI | Basic plan: 2,000 requests a month, 200 exercises | MP4 video plus images; free media watermarked | 11,000+ (vendor figure) |\n| wger | AGPL-3.0-or-later code, Creative Commons data per entry; self-host | Free | Still images; video supported in its code | Live count not readable from our environment |\n| API Ninjas Exercises | Proprietary, hosted | Free plan for evaluation only | Start and finish photos on premium plans | \"over 3000\" (vendor figure) |\n| free-exercise-db | The Unlicense (public domain); static files | Free | 1,746 JPEG images | 876, counted October 22, 2026 |\n\nEvery count above is as the source states it on October 22, 2026, except free-exercise-db's, which we counted ourselves.\n\n## ExerciseDB V1 and V2 (AscendAPI)\n\nAscendAPI's documentation describes two exercise products. **ExerciseDB V1** is \"the classic, open dataset\" in AscendAPI's words, with GIF animations and step-by-step instructions. Its free tier is \"1,500 exercises with 180p GIFs. No authentication required\", at `oss.exercisedb.dev/api/v1/exercises`, and a paid tier on RapidAPI adds 360p to 1080p images and GIFs, difficulty levels and exercise types. **ExerciseDB V2** is the larger product: AscendAPI states 11,000+ exercises, 15,000+ videos and 20,000+ images, with an MP4 demonstration video per exercise, `overview`, `exerciseTips`, `variations` and `relatedExerciseIds`. V2 runs only through RapidAPI; its free Basic plan gives 2,000 requests a month and 200 exercises, and \"free tier media is watermarked\".\n\nAscendAPI's rate-limiting guide gives free plans 1,000 requests per hour per API key and says paid plans \"have no strict rate limit\". Paid prices are on its RapidAPI listings, which we could not read, and its terms of use sit behind a link that answered our snapshot runner with a bot check. It is also not self-hostable: a git clone of [the exercisedb-api repository](https://github.com/ExerciseDB/exercisedb-api) on October 22, 2026 found only a README and an AGPL-3.0 LICENSE. Best for a hosted catalog with GIFs or video and a free way to try it. Watch out: free tiers with unreadable terms, a 200-exercise V2 trial, and prices you have to read on RapidAPI. The plans are broken down on [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## wger\n\nAn open-source, self-hostable fitness application (routines, nutrition logging against Open Food Facts, body weight) whose README lists a \"REST API for third-party integrations or automations\". The application code is AGPL-3.0-or-later and the exercise and ingredient data is \"Creative Commons (see individual entries)\". In wger's code, each exercise, image and video carries its own licence and author fields, new uploads default to CC-BY-SA 4, and the exercise endpoints are commented \"Everybody can read\". Images must be static (the validator rejects animation), and a separate video model accepts mp4, mov, webm, ogv and ogg files. We could not read the live catalog size on wger.de, whose bot check blocked our runner, so this page gives no wger count. Best for full control and an auditable stack with no per-call fee. Watch out: AGPL on code you modify and deploy, attribution and share-alike on much of the data, and an application to operate rather than a dataset. For per-image licences and the options if wger does not fit, see [how wger's exercise image licenses work](/alternatives/wger-alternatives).\n\n## API Ninjas Exercises\n\nA hosted REST API that API Ninjas says covers \"over 3000 exercises\". Each record has name, type, muscle, difficulty, instructions, an `equipments` array and `safety_info`, and on premium plans an `images` array of start and finish photos \"in movement order\". A call to `/v1/exercises` returns up to five results; paging past them uses a premium `offset`, and the full list for a muscle group (`/v1/allexercises`) needs the Business tier or an annual plan. A free key exists, but the free plan is \"Evaluation and demo purposes only\" and API Ninjas says commercial use \"is not permitted on the free tier\". Its pricing page lists the Developer plan at $59 a month, or $39 a month billed yearly, and that plan does not allow storing data; Business, at $149 or $99, does. Best for lightweight metadata with simple photos. Watch out: no video or GIFs, five results per call, and the storage rule if you plan to cache the catalog.\n\n## free-exercise-db\n\nTechnically a dataset, not an API: `yuhonas/free-exercise-db` on GitHub, which its README calls an \"Open Public Domain Exercise Dataset\" of 800+ exercises. When we counted the combined `dist/exercises.json` on October 22, 2026 it held 876 exercises with `force`, `level`, `mechanic`, `equipment`, primary and secondary muscles, instructions and category, and 1,746 JPEG image paths. Its LICENSE.md is the Unlicense, so there is no attribution or share-alike to carry. There is no key and no server: you clone the repo or fetch the JSON and images from raw GitHub URLs, as the README describes, and serve them yourself. Best for bootstrapping with zero cost and zero licence friction. Watch out: static files, English only, no motion, and you own search, hosting and fixes. The counted breakdown is on [what free-exercise-db contains, counted](/compare/exercisedb-vs-free-exercise-db).\n\n## Exercise and workout video APIs\n\nOnly one option here serves demonstration video from a hosted API: AscendAPI's ExerciseDB V2, with an MP4 per exercise, watermarked on the free plan. wger's code can store and serve videos you supply on your own server. ExerciseDB V1 stops at GIFs, API Ninjas at still photos and free-exercise-db at JPEGs. Formats, watermarks, licences and the stock-library route are compared in [exercise video APIs compared](/fitness-apis/exercise-video-apis). If what you need is to analyse the user's own movement through the camera rather than play a demonstration, that is pose estimation: see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).\n\n## Which should you pick?\n\n- **Zero cost and zero licence obligations:** free-exercise-db. Public domain, no key, no attribution; you host the files.\n- **A maintained, self-hosted, auditable stack:** wger, if you can accept AGPL on deployed changes and per-entry Creative Commons on the data.\n- **A hosted catalog with GIFs or video:** AscendAPI's ExerciseDB. Prototype on V1's keyless free tier or V2's Basic plan, then read the paid prices and the terms of use on RapidAPI before launch.\n- **Text metadata with simple photos:** API Ninjas Exercises on a paid plan, Business if you will store the data.\n\n## Watch the fine print\n\nExercise counts, free tiers, prices and gating in this category change often. This page was re-checked on October 22, 2026 against AscendAPI's documentation and home page, API Ninjas' Exercises and pricing pages, and the free-exercise-db, wger and exercisedb-api repositories. Before you commit, re-read the licence or terms that govern the exact files you will ship.",
    "faqs": [
      {
        "q": "What is the best free exercise database API?",
        "a": "It depends on whether you want an API or data you own. For a hosted API, AscendAPI's ExerciseDB V1 is free with no key: 1,500 exercises with 180p GIFs at oss.exercisedb.dev, as of October 22, 2026, though its terms of use were unreadable from our environment. For data you own, free-exercise-db is public domain, 876 exercises with JPEG images, which you host yourself. wger is free, open source and self-hostable under AGPL."
      },
      {
        "q": "Is ExerciseDB the same as AscendAPI?",
        "a": "exercisedb.dev now presents itself as AscendAPI, previously ExerciseDB, and AscendAPI's documentation names the ExerciseDB/exercisedb-api GitHub repository as its own; it sells ExerciseDB V1 and ExerciseDB V2. A separate, older ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6 also exists, and as of October 22, 2026 we could not establish whether it is the same product, so check which host a tutorial calls."
      },
      {
        "q": "Which exercise API has GIFs or video demonstrations?",
        "a": "AscendAPI's ExerciseDB V2 gives each exercise an MP4 demonstration video, through RapidAPI, with watermarked media on its free plan; its V1 serves animated GIFs, at 180p on the free tier. wger's open-source code stores videos you supply if you self-host. API Ninjas returns start and finish photos on premium plans, and free-exercise-db ships JPEG images only."
      },
      {
        "q": "Is wger's exercise API really free to use?",
        "a": "Yes. wger is open source with no per-request fees, and its code marks the exercise endpoints as readable by everyone. The costs are self-hosting if you run your own instance, plus license obligations: AGPL-3.0-or-later on code you modify and deploy, and Creative Commons attribution, often share-alike, on the exercise data, set per entry."
      },
      {
        "q": "Does API Ninjas offer a free exercise endpoint?",
        "a": "For evaluation only. A free API Ninjas key calls the Exercises API, but its pricing page describes the free plan as evaluation and demo purposes only, with 3,000 calls a month and no commercial use, and exercise images and paging past five results are premium. Commercial use starts with the Developer plan, listed on October 22, 2026 at $59 a month or $39 a month billed yearly."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise video APIs"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/compare/exercisedb-vs-free-exercise-db",
        "label": "ExerciseDB vs free-exercise-db"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "AI workout & motion-tracking APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and health API every week — the license traps, media paywalls, and rate-limit gotchas included. Subscribe and skip the trial-and-error."
    },
    "sources": [
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-10-22",
        "note": "AscendAPI, previously ExerciseDB; free V1 (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/",
        "checked": "2026-10-22",
        "note": "products, classic V1 dataset, RapidAPI access (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-10-22",
        "note": "V1 free and paid tiers (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-10-22",
        "note": "V2 fields, MP4 video, watermark (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-10-22",
        "note": "free Basic plan (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-10-22",
        "note": "rate limits (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/llms.txt",
        "checked": "2026-10-22",
        "note": "GitHub repository link (snapshot)"
      },
      {
        "url": "https://api-ninjas.com/api/exercises",
        "checked": "2026-10-22",
        "note": "fields, images, results per call, gating (snapshot)"
      },
      {
        "url": "https://api-ninjas.com/pricing",
        "checked": "2026-10-22",
        "note": "plans and prices (snapshot)"
      },
      {
        "url": "https://github.com/ExerciseDB/exercisedb-api",
        "checked": "2026-10-22",
        "note": "README and AGPL LICENSE only (git clone)"
      },
      {
        "url": "https://github.com/yuhonas/free-exercise-db",
        "checked": "2026-10-22",
        "note": "Unlicense; 876 exercises and 1,746 JPEGs counted"
      },
      {
        "url": "https://github.com/wger-project/wger",
        "checked": "2026-10-22",
        "note": "README licences, API permissions, image and video models"
      }
    ]
  },
  {
    "slug": "exercise-video-apis",
    "primaryQuery": "exercise video api",
    "h1": "Exercise Video APIs: Which Exercise Databases Serve Video",
    "metaTitle": "Exercise Video APIs: Which Ones Serve MP4 Demos (2026)",
    "metaDescription": "Which exercise APIs serve demonstration video? ExerciseDB V2's MP4s, wger's self-hosted video, GIF and image-only APIs, and buying licensed clips instead.",
    "updated": "2026-10-22",
    "answer": "Few exercise APIs serve video. As of October 22, 2026, AscendAPI's ExerciseDB V2, from the team formerly branded ExerciseDB, is the hosted API whose documentation gives each exercise an MP4 demonstration video, through RapidAPI, with watermarked media on its free plan. wger's open-source server stores licensed exercise videos if you host it yourself, ExerciseDB V1 stops at GIFs, API Ninjas returns still images on premium plans only, and GymVisual sells video files under a royalty-free licence rather than through an API.",
    "body": "Most exercise APIs stop at text, still images or animated GIFs. This page narrows the [exercise database API roundup](/fitness-apis/exercise-database-apis) to one question, which sources hand you demonstration **video**, and compares only what each provider's own pages and code say about media: formats, resolutions, watermarks, licence and price. Everything here was read on October 22, 2026, from a source-snapshot run or, for open-source code, from GitHub.\n\n## Who serves what\n\n| Source | Video | Animated | Stills | How you get it | What the source says about cost or licence |\n|---|---|---|---|---|---|\n| ExerciseDB V2 (AscendAPI) | An MP4 per exercise | Not listed | WebP at 360p to 1080p | RapidAPI key | Free Basic plan with images and videos; free-tier media watermarked |\n| ExerciseDB V1 (AscendAPI) | None | GIFs: 180p free, 360p to 1080p paid | Paid tier only | Free hosted endpoint, no key; or RapidAPI | Free tier of 1,500 exercises |\n| wger (self-hosted) | Video uploads: mp4, mov, webm, ogv, ogg | Rejected | jpeg, png, webp, avif | Your own server | Code AGPL 3+; initial exercise data CC-BY-SA 3.0 |\n| API Ninjas Exercises | None | None | Image URLs on premium plans | X-Api-Key | Commercial use needs a paid plan |\n| free-exercise-db | None | None | JPG files | Static JSON on GitHub | Unlicense (public domain) |\n| GymVisual | 9,935 videos in its store | 6,558 animated GIFs | Illustrations | Buy and download files | Royalty-free licence, priced per item |\n\nMuscleWiki blocked our snapshot with a Cloudflare page, so it is not covered here.\n\n## ExerciseDB V2 by AscendAPI: an MP4 per exercise\n\nexercisedb.dev now presents itself as AscendAPI (\"Previously ExerciseDB\"), and its documentation describes two exercise products. **ExerciseDB V2** is the video one. AscendAPI's docs say: \"Each exercise includes an MP4 demonstration video for in-app playback.\" The record carries a `videoUrl` alongside `imageUrl` and an `imageUrls` object, and the docs list static images in four sizes, 360p, 480p, 720p and 1080p. AscendAPI's own figures are 11,000+ exercises, 15,000+ videos and 20,000+ images, which are vendor numbers we have not counted.\n\nAccess runs through RapidAPI: \"Currently AscendAPI is accessed via RapidAPI.\" The free and paid tiers differ in one way the docs spell out: \"free tier media is watermarked\", while the paid tier \"serves clean, watermark-free assets across all resolutions\". AscendAPI's quickstart describes the free Basic plan as 2,000 requests a month, 200 exercises in the library, and exercise images and videos, with no credit card. Its rate-limiting guide gives free plans 1,000 requests per hour per API key, says paid plans \"have no strict rate limit\", and says media served through its CDN \"is generally unlimited\".\n\nWhat we could not verify: paid plan prices, which AscendAPI's docs leave to its RapidAPI listing and which we did not read, and the licence terms for the video files. The earlier ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6 also rendered empty, so we cannot say whether it is the same product as AscendAPI's listings. Plan pricing in this category is tracked on [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## ExerciseDB V1: GIFs, with a free tier that needs no key\n\n**ExerciseDB V1** is the GIF product. Its free tier is \"1,500 exercises with 180p GIFs. No authentication required\", served at `oss.exercisedb.dev/api/v1/exercises`, and exercisedb.dev's home page says the same: \"No sign-up, no API key\". The paid V1 tier on RapidAPI adds `imageUrls` and `gifUrls` objects at 360p to 1080p. V1 has no video field. AscendAPI describes the whole V1 dataset as \"over 2,000 structured exercises\", more than the free tier's 1,500.\n\n## wger: video, if you host it\n\nwger is open-source software you run yourself, and its code supports exercise video. The `ExerciseVideo` model accepts files with the extensions mp4, mov, webm, ogv and ogg, up to 100 MB each, and records size, duration, width, height and codec. Each video inherits wger's licence fields, including the licence, the original title, the author and a link to the original object, so attribution travels with the file. The REST router registers a `video` endpoint.\n\nImages are stills only. wger's image validator allows jpeg, jpg, png, webp and avif, and rejects animation with the message \"Animated images are not supported.\" So wger has no GIF route: a moving demonstration goes in as a video.\n\nLicensing, from wger's documentation: the application is AGPL 3 or later, and \"The initial exercise and ingredient data is licensed additionally under a Creative Commons Attribution Share-Alike 3.0 (CC-BY-SA 3.0)\". How many videos the public wger.de instance carries we could not check, because wger.de answered our snapshot with a bot-check page. The trade-offs of running it are in [ExerciseDB vs wger](/compare/exercisedb-vs-wger).\n\n## Still images only: API Ninjas and free-exercise-db\n\n**API Ninjas Exercises** returns no video. Its reference lists an `images` field as \"Premium only\": an \"Array of image URLs showing the exercise, in movement order (usually the start and finish positions)\". Its FAQ says commercial use \"is not permitted on the free tier\", and its pricing page says all paid plans are premium plans; the cheapest, Developer, is listed at $59 a month or $39 a month billed yearly.\n\n**free-exercise-db** is a public-domain JSON dataset, 876 exercises with 1,746 JPG image paths when we counted its combined file on October 22, 2026 (its README says 800+), whose records point to JPG files which its README says you can fetch from `raw.githubusercontent.com`. There is no video or GIF.\n\n## Buying the videos instead: GymVisual\n\nIf you want to own the files and serve them from your own storage, a stock library is the other route. GymVisual sells \"royalty-free workout animations, GIFs, and fitness illustrations\" and names app developers among the people its library is designed for. Its Videos category listed 9,935 products and its Animated GIFs category 6,558 when we read them. The category pages show volume pricing, \"$6 per 1 video after 5 items in cart\" and \"$0.9 per 1 animated GIF after 10 items in cart\"; the single-item prices were not on the pages we read.\n\nThe licence matters more than the price. GymVisual's Non-Exclusive Commercial Royalty-Free License means \"you pay for the Media only once and then you can use it as many times as you like, with just a few restrictions\", and its permitted uses include Android or iOS apps. Among the restrictions: no reselling or redistribution, no making files \"available on a website for download\", and no using them \"to process, modify, or use for training by any Artificial Intelligence (AI) systems\". The terms add that the licence is a one-person licence for the account owner and cannot be transferred. None of the GymVisual pages we read mentions an API, so you host, index and serve the files yourself.\n\n## Which should you pick?\n\nOur judgement, from the sources above:\n\n- **You want video from a hosted API today:** ExerciseDB V2, starting on the watermarked free plan and moving to a paid plan for clean files. Confirm the price and the media licence on RapidAPI first.\n- **You want to own the stack and the licence trail:** self-host wger and upload your own or licensed videos; each one carries its licence and author.\n- **You want files you control, without an API dependency:** buy from a stock library such as GymVisual, after checking that its no-redistribution and no-AI-training terms fit your product.\n- **Stills are enough:** API Ninjas on a paid plan, or free-exercise-db at no cost.\n\nFull-length workout classes are a different product from per-exercise demonstrations, and we have not reviewed any. If what you need is to analyse the user's own movement on camera rather than play a demonstration, that is pose estimation: see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).",
    "faqs": [
      {
        "q": "Is there a free exercise video API?",
        "a": "Two partial answers. AscendAPI's ExerciseDB V2 has a free Basic plan on RapidAPI with 2,000 requests a month, 200 exercises, and exercise images and videos, but its documentation says free-tier media is watermarked. wger is free open-source software whose code supports exercise videos, but you host it and supply the videos yourself."
      },
      {
        "q": "What video format does ExerciseDB V2 return?",
        "a": "MP4. AscendAPI's documentation says each exercise includes an MP4 demonstration video for in-app playback, returned in the videoUrl field. Still images come separately in an imageUrls object at 360p, 480p, 720p and 1080p, and the docs suggest using the video on detail screens and the images in lists."
      },
      {
        "q": "Can I self-host an exercise video library with an API?",
        "a": "Yes, with wger. Its ExerciseVideo model accepts mp4, mov, webm, ogv and ogg files up to 100 MB, stores size, duration, resolution and codec, and keeps licence and author fields on every video, and its REST router registers a video endpoint. The code is AGPL 3 or later, so check what that means for your product before you deploy a modified copy."
      },
      {
        "q": "Can I use GymVisual exercise videos in my app?",
        "a": "GymVisual's royalty-free licence lists Android and iOS apps among the permitted uses: you pay once and can reuse the file. It forbids reselling or redistributing the media, offering it for download, and using it to train AI systems, and its terms make the licence a one-person licence for the account owner. GymVisual sells files, not an API, so you host them yourself."
      },
      {
        "q": "Does API Ninjas return exercise images or videos?",
        "a": "Images only, and only on paid plans. API Ninjas documents an images field, marked premium only, with image URLs in movement order, usually the start and finish positions. It returns no video or GIF, and its FAQ says commercial use of the Exercises API is not permitted on the free tier."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/compare/exercisedb-vs-free-exercise-db",
        "label": "ExerciseDB vs free-exercise-db"
      },
      {
        "href": "/compare/exercisedb-vs-wger",
        "label": "ExerciseDB vs wger"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "Exercise media is where these APIs differ most, and their tiers and licences change. We re-read the vendors' docs and report what moved, weekly."
    },
    "sources": [
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-10-22",
        "note": "MP4 per exercise, videoUrl, image resolutions, watermarked free tier, RapidAPI access, catalogue figures"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-10-22",
        "note": "free tier 1,500 exercises with 180p GIFs and no auth, paid GIF and image resolutions, dataset size"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-10-22",
        "note": "free Basic plan contents"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-10-22",
        "note": "free and paid rate limits, CDN media"
      },
      {
        "url": "https://docs.ascendapi.com/",
        "checked": "2026-10-22",
        "note": "access via RapidAPI"
      },
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-10-22",
        "note": "Previously ExerciseDB, free V1 with no sign-up"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/wger/exercises/models/video.py",
        "checked": "2026-10-22",
        "note": "ExerciseVideo model, extensions, size limit, metadata"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/wger/utils/images.py",
        "checked": "2026-10-22",
        "note": "allowed image formats, animation rejected"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/wger/utils/models.py",
        "checked": "2026-10-22",
        "note": "licence fields on media"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/wger/urls.py",
        "checked": "2026-10-22",
        "note": "video endpoint in the REST router"
      },
      {
        "url": "https://wger.readthedocs.io/en/latest/",
        "checked": "2026-10-22",
        "note": "AGPL and CC-BY-SA 3.0 licensing"
      },
      {
        "url": "https://api-ninjas.com/api/exercises",
        "checked": "2026-10-22",
        "note": "images field premium only, commercial use needs premium"
      },
      {
        "url": "https://api-ninjas.com/pricing",
        "checked": "2026-10-22",
        "note": "all paid plans are premium plans; Developer plan price"
      },
      {
        "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/README.md",
        "checked": "2026-10-22",
        "note": "Unlicense, 800+ claim, JPG image paths; 876 exercises and 1,746 JPEGs counted in dist/exercises.json"
      },
      {
        "url": "https://www.gymvisual.com/",
        "checked": "2026-10-22",
        "note": "royalty-free animations, GIFs and illustrations for app developers"
      },
      {
        "url": "https://gymvisual.com/12-videos",
        "checked": "2026-10-22",
        "note": "video count and volume price"
      },
      {
        "url": "https://gymvisual.com/16-animated-gifs",
        "checked": "2026-10-22",
        "note": "animated GIF count and volume price"
      },
      {
        "url": "https://gymvisual.com/content/9-license",
        "checked": "2026-10-22",
        "note": "licence permissions and restrictions"
      },
      {
        "url": "https://gymvisual.com/content/3-terms-and-conditions-of-use",
        "checked": "2026-10-22",
        "note": "one-person licence"
      }
    ]
  },
  {
    "slug": "wearable-data-apis",
    "primaryQuery": "wearable fitness API",
    "h1": "The Best Wearable Fitness & Health-Data APIs (2026)",
    "metaTitle": "Best Wearable & Fitness Tracker APIs: Fitbit, Garmin, Oura",
    "metaDescription": "Compare the best wearable fitness APIs in 2026 — Fitbit, Garmin, Oura, WHOOP and Polar — on data, approval friction and pricing to pick the right one.",
    "updated": "2026-07-08",
    "answer": "The best wearable fitness API depends on your use-case, since all five major options — Fitbit (Google), Garmin, Oura, WHOOP and Polar — use OAuth 2.0 with per-user consent and are free to use as of 2026. Pick Garmin for serious GPS and multisport with the widest health metrics, Oura or WHOOP for sleep and recovery data, Fitbit for broad mainstream reach and intraday data, and Polar if you want the least approval friction. The real gate is not price but getting approved to read other users' data plus your users owning the hardware.",
    "body": "If you need a wearable fitness API, your choice comes down to one thing more than data or price: how easily you can get approved to read other people's data. All five of the major options here — Fitbit (now Google), Garmin, Oura, WHOOP, and Polar — use `OAuth 2.0` with per-user consent, and all are documented as free to use as of 2026 (always verify current commercial terms). What actually separates them is the approval gate, the depth of data, and, in Fitbit's case, a migration to the Google Health API that changes how you integrate.\n\n## What to look for in a wearable API\n\nFour criteria decide this category. Weigh them in this order:\n\n- **Access and approval friction.** None of these is a bulk data feed. Each returns data only for individual users who authorize your app, and most gate production access behind an application or review step. This is the single biggest practical difference between them — a self-serve API you can ship this week versus one that needs partner approval you may not get.\n- **Data-model fit.** GPS and multisport detail, all-day wellness metrics, sleep and recovery scores, HRV, `SpO2` — each device ecosystem leans toward a different strength. Match the API to the metric your product actually needs.\n- **Pricing model.** As of 2026, all five publish no per-call fee. The real cost is (a) clearing the approval step and (b) your users owning the hardware — and, for WHOOP, a paid membership. Always verify current commercial terms for at-scale use.\n- **Migration and stability.** APIs move. Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit), updated September 10, 2026, lists the Google Health API as the recommended path for Fitbit Web API integrations, so anything you build for Fitbit should target it.\n\nA note on approval friction throughout this page: it is a factual access requirement, not a knock on any product. A tighter review gate often reflects stricter user-data handling. To set any two of these side by side on that gate, on developer billing and on what each user must own, use [the API comparison tool](/compare-apis).\n\n## Wearable fitness APIs at a glance\n\n| API | Best for | Access model | Pricing model | Watch out |\n|---|---|---|---|---|\n| Fitbit / Google Health | Broad consumer reach, intraday HR/sleep | Self-serve for own data; case-by-case for other users' intraday | Free to use (verify commercial terms) | Legacy Web API support ended Sept 30, 2026 and it turns off Oct 30, 2026; Google Health API is the recommended path; tokens cannot be transferred |\n| Garmin | GPS/sport, widest health-metric breadth | Apply to program; partner approval required | No price published for Starter Access; Enterprise terms tailored | Ping/pull, backfill and some metrics are Enterprise-only |\n| Oura | Sleep, readiness, HRV, recovery | Self-serve OAuth app; approval to exceed 10 users | Free for personal and commercial apps; user needs an Oura Ring | Personal Access Tokens deprecated Dec 2025 — OAuth-only now |\n| WHOOP | Recovery, strain, HRV coaching | Self-serve dev app; Sandbox tier of 10 members, reviewed tiers above it | API currently provided at no charge; users are WHOOP members | 10-member Sandbox cap until WHOOP approves the next tier |\n| Polar | Low-friction training/GPS + Nightly Recharge | Self-serve client registration | Free of charge at the moment, per Polar's API agreement | Only recent data is exposed — sync regularly or lose history |\n\n## Fitbit Web API (Google)\n\nFitbit is best for broad, mainstream consumer reach with rich sleep, heart-rate, and intraday data across a large device base. It exposes a user's Fitbit-account data — activity and steps, heart rate (including intraday time series down to 1-second or 1-minute granularity), sleep, `SpO2`, HRV, and workout logs — via `OAuth 2.0` (authorization-code grant, PKCE recommended). Registering a Personal app for your own data is self-serve; accessing other users' high-resolution intraday data is granted case-by-case on request, and the rate limit is 150 requests per hour per consented user as of 2026. The trade-off to know: [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026, with the Google Health API and Google `OAuth 2.0` as its replacement. Google's Fit migration guide, updated September 10, 2026, lists the Google Health API as the recommended path for Fitbit Web API integrations. New builds should target the Google Health API, and Google's Health API migration guide says existing tokens cannot be transferred, so plan for every user to re-consent. Our [Fitbit API deprecation status](/fitbit-api-shutdown) page separates what is confirmed from what is only reported. Verify current terms in the docs.\n\n## Garmin (Health API + Connect Developer Program)\n\nGarmin offers the broadest set of GPS, multisport, and health metrics — think Body Battery, VO2 max, pulse-ox, and HRV — making it a strong fit for endurance and athletic use cases. It splits into a Health API for all-day wellness metrics and an Activity API for per-activity data such as running, cycling and swimming, with GPS, heart rate, and session detail, delivered through registerable push/ping callback URLs. Access uses `OAuth 2.0` across the Connect Developer Program, but full server-side access to user health data requires applying to and being approved for the program — it is not a self-serve credential. Watch out: since October 2026 Garmin's program comes as Starter and Enterprise Access; Starter is push only, and features such as ping/pull delivery, backfill and enhanced beat-to-beat interval are marked as supported with Enterprise Access only, where Garmin says commercial terms are tailored. Garmin's pages no longer state how long a review takes. Confirm you can get approved before committing to Garmin. If you only need your own Garmin data, start with [Garmin's official Personal API for your own data](/fix/garmin-api-personal-use); the two unofficial Python clients are compared in [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth).\n\n## Oura API (v2)\n\nOura is best for detailed sleep, readiness, HRV, and recovery data from a low-friction, well-documented ring API. The v2 API is the only supported integration point and returns sleep, daily readiness and activity, heart rate, HRV, `SpO2`, workouts, sessions, and daily stress, all scoped across eight documented `OAuth 2.0` scopes that users can toggle individually. You register an OAuth application self-serve; an app is capped at 10 users until you pass Oura's approval, after which there is no user limit. Rate limits are enforced per-token and per-application, and Oura documents 5,000 requests per 5-minute period. The trade-off: Personal Access Tokens were deprecated in December 2025, so it is `OAuth 2.0`-only now, and users must own an Oura Ring; the API returns 403 when a user's Oura subscription has expired. If a tutorial still has you pasting a personal token, the [Oura personal access tokens deprecated](/fix/oura-personal-access-token-deprecated) fix covers the move to OAuth.\n\n## WHOOP API\n\nWHOOP is best for recovery, strain, and HRV-centric coaching and readiness apps built on its continuous physiological model. The API exposes a member's cycles, recovery (including recovery score, HRV, and resting heart rate), sleep, workouts with strain, and body measurements. You create an app in the Developer Dashboard for a Client ID and secret and request per-scope consent over `OAuth 2.0`, with short-lived access tokens and webhook support. Every new app starts on WHOOP's Sandbox tier, which allows up to 10 WHOOP members; to launch more broadly you request the next tier from the Developer Dashboard, and WHOOP asks that you have tested with at least one member and filled in your app name, contact emails and privacy-policy URL. Rate limits run around 100 requests per minute and 10,000 per day per client as of 2026, with increases available on request. Watch out: the tiers above Sandbox (100, 1,000, 5,000, then unlimited members) are earned one at a time through a manual review, and every user who connects is a WHOOP member.\n\n## Polar (Open AccessLink)\n\nPolar is best for low-friction, self-serve access to training, heart-rate, and GPS data plus Nightly Recharge, with long-lived tokens that simplify token management. Open AccessLink sits over data stored in Polar Flow and returns training and exercises across 100-plus sport types (with duration, distance, HR time series and zones, cadence, and altitude, exportable as `TCX` or `GPX`), daily activity, Nightly Recharge (ANS charge, HRV, breathing rate), sleep, and continuous heart rate. You register a client self-serve at the AccessLink admin portal using Polar Flow credentials; note one flow detail — after `OAuth 2.0` authorization you must explicitly register the user with a POST to the users endpoint to link their account to your app. The trade-off to know: the API exposes only recent data — older history is not retrievable — so you must poll or export (JSON, `FIT`, `TCX`, or `GPX`) regularly to retain a full history. What remains on your side of the bill is covered in [Polar AccessLink pricing](/pricing/polar-api-pricing).\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If you need serious GPS, multisport, and the deepest health metrics** (Body Battery, VO2 max, pulse-ox) → pick Garmin, but confirm first that you can get through Garmin's approval at the access level you need, since Starter Access is push only and ping/pull and backfill are Enterprise-only.\n- **If you need deep sleep, readiness, and recovery data with low onboarding friction** → pick Oura for the ring or WHOOP for a continuous strain and recovery model. Remember both cap you at 10 users or members until you pass approval, and WHOOP users need a paid membership.\n- **If you want the broadest mainstream device reach and rich intraday heart-rate and sleep data** → pick Fitbit, but build against the Google Health API and plan for user re-consent through the migration.\n- **If you want to ship quickly with the least approval friction** → pick Polar, whose self-serve client registration and long-lived tokens make it the most self-serve option here, as long as you can live with only recent data being available and sync it regularly.\n- **If you are connecting a whole workforce for an employer wellness program** → start from the device mix and the access gates, which [wearable data APIs for corporate wellness programs](/fitness-apis/corporate-wellness-wearable-apis) maps route by route.\n\n## Watch the fine print\n\nPricing models, rate limits, user caps, and migration dates in this category shift often. Everything volatile above is flagged \"as of 2026 — verify,\" and you should confirm the current numbers and commercial terms in each provider's primary developer docs before you build, especially for anything running at scale.",
    "faqs": [
      {
        "q": "Are wearable fitness APIs free to use?",
        "a": "As of 2026, Fitbit/Google, Garmin, Oura, WHOOP and Polar all publish no per-call fee and are documented as free to use. The real cost is clearing an approval or review step and your users owning the hardware — and, for WHOOP, a paid membership. Verify current commercial terms for at-scale use."
      },
      {
        "q": "Which wearable API is best for GPS and running data?",
        "a": "Garmin is generally the richest for GPS, multisport and endurance metrics, with an Activity API for per-activity data such as running, cycling and swimming, plus session detail. Polar is a strong low-friction alternative and exports activities as TCX or GPX. Note Garmin requires approval into its Connect Developer Program for other users' data; for your own data it now offers a Personal API."
      },
      {
        "q": "Do wearable APIs push data to me, or do I have to poll for it?",
        "a": "It varies by provider, and it changes your architecture. Garmin delivers through registerable push and ping callback URLs, so you build an event consumer rather than a scheduler, and WHOOP documents webhook support. Fitbit is request-response REST that you poll on your own schedule, and Polar's Open AccessLink exposes only recent data, so you sync regularly or lose history. If you support several of these, expect to run both patterns side by side behind one normalization layer, with idempotency and ordering guards on the pushed events."
      },
      {
        "q": "Do wearable APIs let me pull data for all users at once?",
        "a": "No. These are consent-based OAuth 2.0 APIs that return data only for individual users who explicitly authorize your app — none is a bulk or population data feed. Most also cap you to a small number of users (often 10) until you pass a production approval review."
      },
      {
        "q": "Which wearable API has the least approval friction?",
        "a": "Polar's Open AccessLink is generally the most self-serve: you register a client yourself and tokens are long-lived. The trade-off is that it exposes only recent data, so you must sync or export regularly to retain history. Verify the current terms in Polar's developer docs."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week — the OAuth quirks, approval gates and rate-limit gotchas included. Subscribe to get the next one."
    }
  },
  {
    "slug": "health-data-aggregator-apis",
    "primaryQuery": "health data aggregator API",
    "h1": "The Best Health-Data Aggregator APIs (2026)",
    "metaTitle": "Health Data Aggregator APIs Compared: Terra, Junction & More",
    "metaDescription": "Ten health-data aggregator APIs compared from their own pages in October 2026: coverage, published prices, lab testing and which need your own credentials.",
    "updated": "2026-10-17",
    "answer": "A health-data aggregator API lets you integrate once and read normalized data from many wearables and health apps instead of building one integration per device. As of October 17, 2026, the main options split four ways on their own pages: breadth aggregators (Terra, Rook, Spike, Thryve), wearables plus lab ordering (Junction, and now Terra), a phone-first platform that adds scores (Sahha), and enterprise or self-hosted routes (Validic for remote patient monitoring, Open Wearables as MIT-licensed software you run). Most now publish an entry price, such as Validic's free developer tier, Junction's flat $300 a month and Terra's $399 a month billed annually, so compare the bill at your own user count and check which providers still need your own developer credentials. Human API, often listed alongside them, is now a LexisNexis product with no public price, and Metriport sells medical-record access to covered entities.",
    "body": "If you need data from many wearables without building and maintaining a separate integration for each one, a health-data aggregator API is the tool for the job: you integrate once and the vendor normalizes Garmin, Oura, WHOOP, Fitbit, phone health stores and the rest into one schema. This page compares the ones developers shortlist, from what each vendor's own pages said when we read them on October 17, 2026. For the cost side in one place, see [health-data aggregator pricing](/pricing/health-data-aggregator-pricing).\n\n## Corrections in this revision\n\nEarlier versions of this page said Terra was wearables-only, that Junction priced per user with a monthly minimum, and that Rook's and Spike's prices could not be verified. The vendors' current pages say otherwise, so those claims are gone:\n\n- **Terra** now sells lab testing alongside its wearable API. Its homepage offers blood tests \"through home kits, mobile phlebotomy, or lab walk-ins\", and its lab page says \"Nationwide US, plus the UK\".\n- **Junction**'s pricing page lists a Launch plan at \"a flat $300 a month\" for up to 500 users and a custom Enterprise plan.\n- **Rook** publishes four plans, from Core at $399 a month for up to 750 active users, and now also sells medical-device and lab-report APIs.\n- **Spike**'s pricing page lists a Sandbox plan that \"Starts from $450 /month\", and a banner on its integrations page reads \"Raintree Systems Acquires Spike Technologies\".\n- **Human API**'s old domain now opens a LexisNexis Risk Solutions product page, covered under adjacent options below.\n\n## How to compare aggregators\n\nThree things decide the fit, in our experience, more than the size of a device list:\n\n- **The billing unit.** Terra bills credits for each connected data source and for events past a free allowance; Rook bills by active users; Sahha and Thryve charge per user above an included number; Junction's Launch plan is flat up to 500 connected users. The same 1,000 people can cost very different amounts. Model your own numbers, and see the worked comparison on our [aggregator pricing page](/pricing/health-data-aggregator-pricing).\n- **Who holds the provider credentials.** Most aggregators here still ask you to register your own developer app for some providers, commonly WHOOP, Dexcom, Strava and Samsung Health. That is onboarding time the integration code does not show.\n- **Phone health stores.** Apple Health, Health Connect and Samsung Health keep data on the device. Terra's docs say these \"have no cloud API for third parties, so your mobile app reads them with the Terra SDK and sends the data to Terra\". Terra, Junction, Rook, Spike, Sahha, Thryve and Open Wearables ship mobile SDKs for them, and Validic lists full mobile SDK access on its Enterprise plan. Our [HealthKit vs Health Connect comparison](/fitness-apis/apple-healthkit-vs-google-health-connect) covers the platform side.\n\nCoverage counts in this category are marketing figures, and the vendors count different things (providers, devices, apps that write to a phone store). Check your users' actual devices against each vendor's live list.\n\n## The aggregators at a glance\n\n| API | What it adds beyond wearables | Entry price on its pricing page | Your own provider credentials | Watch out |\n|---|---|---|---|---|\n| Terra | Lab testing in the US and UK, delivery to databases and queues, MCP server | $399 a month billed annually ($499 monthly), 100,000 credits included | Its integrations table marks Garmin, WHOOP, Strava, Dexcom and Samsung as Required | Credits scale with connected sources and events |\n| Junction (formerly Vital) | Lab testing across all 50 US states | Launch at a flat $300 a month for 1 to 500 connected users | Custom OAuth credentials are listed under Enterprise | Labs, a signed BAA and unlimited users are Enterprise-only |\n| Rook | Medical-device readings, lab-report parsing, a 0 to 100 health score | Core at $399 a month for up to 750 active users | Dexcom, Samsung Health, Strava and WHOOP | Standard contract term is 12 months |\n| Spike | Medical IoT, lab-report OCR, food-photo nutrition, MCP | Sandbox from $450 a month | Not stated in the docs we read | Its site announces an acquisition by Raintree Systems |\n| Sahha | Phone-as-sensor data, scores and archetypes | Starter at $299 a month billed annually with 1,000 users | Its beta cloud integrations use your own provider app, Garmin with approval | Direct cloud integrations are beta and sandbox-only |\n| Thryve | EU hosting in Germany, analytics for insurers and research | Start Up from 499 euros a month with 500 users | Your own OAuth client where Thryve has no shared one, such as Dexcom and WHOOP | Start Up stores data for two weeks |\n| Validic | Remote patient monitoring programs that write into the EHR | Inform Developer plan free for 5 users | Several vendors are closed to new applications | Acquired by ChartSpan in June 2026 |\n| Open Wearables | MIT-licensed software you host yourself | Free open-source core; custom Enterprise | Yes: you register with each cloud provider | You run, secure and upgrade it; pre-1.0 APIs |\n\nEvery price is a list price from the vendor's page on October 17, 2026, before taxes, add-ons and negotiated discounts.\n\n## Terra\n\nTerra's FAQ describes one API that \"returns standardised data from 500+ providers, including Garmin, Fitbit, Apple Health, Oura, WHOOP and Strava\"; its setup docs say the Unified API \"supports over 150+ Data Sources\", so ask which count your users' devices fall into. Data types cover \"sleep stages and latency, workouts, heart rate, HRV, VO2max, blood oxygen (SpO2), continuous glucose monitoring (CGM), menstrual cycle, body composition and per-set strength training\". Delivery goes to webhooks or straight into \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". Its Vantage API orders blood and DNA test kits and returns results in FHIR format, and its homepage lists home kits, mobile phlebotomy and lab walk-ins.\n\nPricing, per its pricing page: subscriptions start \"from $399 per month billed annually, or $499 per month billed monthly\", including 100,000 credits a month. \"An active authentication is one connected data source for one end user, and costs 200 credits per month\", and the first 400 events per active authentication each month are free. By our arithmetic the included credits cover 500 connected sources before events, and each further source costs about one dollar a month at the starting rate of $0.005 per credit. Note the unit: one person with two wearables is two active authentications.\n\nOn credentials, Terra's docs say it \"manages API Keys of data sources\", but they name WHOOP, Dexcom, Huawei, Strava and Virtuagym as needing special processes, and its integrations reference marks Garmin and Samsung as Required as well. Its homepage FAQ, by contrast, says Garmin data flows through Terra's own long-standing partner integration. Ask Terra which applies to your account before you promise Garmin support. Our [Terra integration guide](/integrate/terra-api) walks through the setup.\n\n## Junction (formerly Vital)\n\nJunction announced the rename from Vital on March 11, 2025, alongside an $18M Series A led by Creandum. Its homepage offers \"300+ wearables\" and lab testing \"spanning all 50 states\", through \"a nationwide network of labs (NY, NJ, and RI included)\" with walk-in, at-home kit and mobile phlebotomy collection. Its mobile SDKs cover Apple HealthKit and Android Health Connect, and its docs say it \"can push wearable device data as webhook events\".\n\nThe pricing page is two plans: Launch, \"a flat $300 a month\" for 1 to 500 connected users, billed monthly, and Enterprise, custom and billed annually, which is where lab testing, unlimited users, uptime SLAs and the signed BAA sit. Custom OAuth credentials appear in the Enterprise column, and Junction's docs warn that \"Some OAuth providers are unavailable unless you can Bring Your Own OAuth (BYOO)\". Each team is tied to an EU or US region, which, per its docs, \"dictates where data is stored\". Our [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital) comparison goes deeper.\n\n## Rook\n\nROOK's homepage now pitches \"Wearables, medical devices, EHR/EMR and labs\" behind one integration. Beyond the wearable API it sells a Medical Device API that tags glucose, blood pressure, oxygen saturation, temperature and ECG readings with the device that recorded them, a Lab Data API that turns PDF and image lab reports into biomarkers with LOINC codes and FHIR R4 output, and an EHR/EMR API, listed as a waitlist on its pricing page, whose page says that today it \"delivers wearable data to clinical systems\" as FHIR R4, with EHR records flowing into ROOK still \"coming soon\". Its health score runs from 0 to 100.\n\nCoverage claims differ by page: its docs say \"400+ wearables and health data sources\", while its integrations page says \"72 data sources and more than 500 devices\", 59 of the 72 marked Indirect, meaning they reach ROOK through Apple Health or Health Connect. Pricing is published per plan and active users: Core $399 a month up to 750 active users, Core+ $999 up to 5,000, Business $1,999 up to 15,000, and custom Enterprise, with \"billing adjusts based on usage\" past each limit and a standard 12-month contract. Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts, which ROOK says \"can take several weeks\".\n\n## Spike\n\nSpike pitches \"360° Health Data for AI\": its homepage offers \"500+ wearables & IoT sensors\", nutrition from food photos and lab report data, and its pricing page says \"Access 40+ providers and 500+ devices via single SDK\". The Lab Reports API reads PDFs, JPEGs or PNG files up to 10MB with OCR and assigns LOINC codes, and Spike MCP feeds wearable, IoT, lab and nutrition data to the LLM of your choice. \"Every organization gets a dedicated implementation engineer from the sandbox level.\" Webhooks are signed with HMAC-SHA256 in an X-Body-Signature header.\n\nThe Sandbox plan \"Starts from $450 /month\" and Enterprise is custom; Spike calls its pricing \"Usage-driven, transparent, and flexible\" but does not itemize how the bill grows. Each of its plans is bought through a \"Book a demo\" button rather than a checkout. A banner on its integrations and blog pages reads \"Raintree Systems Acquires Spike Technologies\"; we found no further detail on Spike's own pages, so ask about roadmap and contract continuity. More in [Terra vs Spike](/compare/terra-vs-spike).\n\n## Sahha\n\nSahha is phone-first. Its homepage says it \"turns the smartphone itself into a passive sensor for sleep, activity, and behavior\", and that it covers \"800+ devices across 165 integrations\", which, per its integrations page, mostly \"arrive on-device through Apple Health or Health Connect\". Direct cloud integrations for Garmin, Oura and WHOOP \"are in public beta and are Sandbox only\", use an app you create with each provider, and Garmin's needs Garmin's approval. What it adds on top of the data is biomarkers, five scores, archetypes and insights.\n\nPricing: free for 30 days with 25 development users, then Starter at $299 a month billed annually with 1,000 users included and $0.40 per extra user, Pro at $1,499 a month billed annually with 10,000 users and $0.20 per extra user, and custom Enterprise. \"A BAA is included from Pro.\" Details on our [Sahha pricing page](/pricing/sahha-api-pricing).\n\n## Thryve\n\nThryve, founded in 2016, says its API \"integrates with over 500 leading wearables and health data ecosystems\", and that it is \"Developed and hosted entirely in Europe\"; its pricing FAQ adds that data \"is hosted in Germany\". Start Up starts at 499 euros a month with 500 users, one app and 0.50 euros per additional user; Scale Up starts at 1,000 euros a month for startups less than ten years old, with up to 5,000 users; Enterprise is bespoke. Its certifications page says \"BAA agreements included on all plans\".\n\nIts docs list which providers use a shared OAuth client; \"When no shared oAuth-client is available, you must bring your own oAuth-client\", which its table shows for Dexcom, WHOOP and Google Health among others. See [Thryve API pricing](/pricing/thryve-api-pricing) and [Terra vs Thryve](/compare/terra-vs-thryve).\n\n## Validic\n\nValidic is the enterprise option: its homepage says one platform \"normalizes 700+ devices into a single standard\", and its care product runs remote-monitoring programs \"that write directly to Epic, Cerner, and other EHRs\". ChartSpan announced \"the completed acquisition of Validic\" on June 22, 2026. On April 23, 2026 Validic opened its Inform API to self-serve sign-up \"at no cost\": the Developer plan covers 5 users, 5 cloud integrations and 90-day data retention, while Enterprise pricing is negotiated and carries the BAA. Its device list warns that some vendors are closed to new applications, including Fitbit \"due to the transition to Google Health\".\n\n## Open Wearables\n\nOpen Wearables is MIT-licensed software from Momentum: an \"Open-source platform that unifies wearable device data from multiple providers behind a single API\", which you deploy yourself (\"each deployment serves a single organization\"). The open-source core is \"Free forever\"; Enterprise support, with a BAA, is \"scoped per project\". Self-hosting means you hold every provider relationship: its docs say \"You must apply for Garmin Developer Program\", and the same for Suunto and Polar. Its README calls it \"an early-stage project under active development\" whose APIs \"may change before version 1.0\". See [Terra vs Open Wearables](/compare/terra-vs-open-wearables).\n\n## Adjacent options that are not wearable aggregators\n\n**Human API.** The humanapi.co domain now opens LexisNexis Health Intelligence, a life-insurance underwriting product \"formerly Human API Health Intelligence\". LexisNexis sells Human API to healthcare and life-science organizations as a consumer-consented network of \"over 30,000 data connections including medical records, labs, fitness wearables and apps\", through a contact form with no public price. Our [Human API alternatives](/alternatives/human-api-alternatives) page covers where developers go instead.\n\n**Metriport.** Metriport is open-source (AGPLv3) medical-records infrastructure: its docs say access to its Medical API requires requests \"on behalf of a covered entity with an NPI number for a valid Treatment purpose of use\". It is the records half of a health app, not a wearable feed.\n\n## Which should you pick?\n\nOur recommendation, by situation:\n\n- **Mixed consumer wearables, startup scale, a bill you can predict:** price Terra, Rook, Junction's Launch plan, Sahha and Thryve at your own user count, then check each one's credential list against your users' devices.\n- **Lab ordering in the same integration:** Junction for US-wide coverage, or Terra if you also need the UK.\n- **EU data residency:** Thryve hosts in Germany; Junction offers an EU region; Terra's Enterprise plan lists a dedicated instance in a localised area.\n- **Many users without a wearable, or scores without building them:** Sahha.\n- **Clinical remote-monitoring programs inside the EHR:** Validic.\n- **Health data must stay on your own servers:** Open Wearables, if you can register with every provider and run the stack.\n- **Medical records rather than wearables:** Metriport or LexisNexis Human API.\n\n## Watch the fine print\n\nPrices, plan limits and device counts in this category move, and two vendors here changed owners in 2026. Before you commit, read the live pricing and integrations pages for whichever aggregator you shortlist, and check the two things that bite later: which providers on your list need your own developer credentials, and how the bill behaves as your connected-user count grows.",
    "faqs": [
      {
        "q": "What is a health data aggregator API?",
        "a": "It is a server-side API that normalizes data from many wearables and health accounts behind one integration, so you connect once instead of coding against Garmin, Oura, Fitbit and others separately. Aggregators also ship mobile SDKs for the phone health stores, because Apple Health, Health Connect and Samsung Health keep data on the device. Terra, Junction, Rook, Spike, Sahha, Thryve and Validic sell it as a service; Open Wearables is open-source software you host yourself."
      },
      {
        "q": "How is an aggregator different from Apple HealthKit or Google Health Connect?",
        "a": "HealthKit and Health Connect are on-device stores, one per platform, and only expose what is on that phone. Aggregators work server-side and across devices, and their SDKs read the phone stores too: Terra's docs say those sources have no cloud API for third parties, so your app reads them with the Terra SDK and sends the data on. So aggregators sit on top of the platform stores rather than replacing them."
      },
      {
        "q": "Do I still need my own developer accounts with each wearable provider?",
        "a": "For some providers, yes, with every aggregator. As of October 17, 2026, Rook names Dexcom, Samsung Health, Strava and WHOOP; Terra's docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym, and its integrations table also marks Garmin and Samsung as Required; Thryve requires your own OAuth client where it has no shared one, such as Dexcom and WHOOP; Open Wearables needs your own app for every cloud provider. Check your users' providers against each list, because approval can take weeks."
      },
      {
        "q": "How much do health data aggregator APIs cost?",
        "a": "Most now publish an entry price. As of October 17, 2026: Validic's Inform Developer plan is free for 5 users, Open Wearables is free open-source software, Junction's Launch plan is a flat $300 a month for up to 500 connected users, Sahha's Starter is $299 a month billed annually with 1,000 users, Terra starts at $399 a month billed annually with 100,000 credits, Rook's Core is $399 a month for up to 750 active users, Spike's Sandbox starts from $450 a month, and Thryve's Start Up starts at 499 euros a month for 500 users. Each counts users differently, so compare at your own volume."
      },
      {
        "q": "Which aggregator API supports lab and diagnostics data?",
        "a": "Two order lab tests: Junction, across all 50 US states through a nationwide lab network on its Enterprise plan, and Terra, whose lab page says nationwide US plus the UK. Rook and Spike parse lab reports instead: both turn uploaded PDF or image reports into structured results with LOINC codes, and we found no test ordering on their pages. All of this is from the vendors' pages on October 17, 2026."
      }
    ],
    "related": [
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Health-data aggregator pricing compared"
      },
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable fitness APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We re-read the aggregators' pricing and docs pages and log what changed, so you hear when a plan, a credential requirement or an owner moves. Subscribe to get the next update."
    },
    "sources": [
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://www.junction.com/pricing",
        "checked": "2026-10-17",
        "note": "Junction Launch and Enterprise plans"
      },
      {
        "url": "https://tryrook.io/pricing/",
        "checked": "2026-10-17",
        "note": "Rook plans, add-ons and contract terms"
      },
      {
        "url": "https://tryrook.io/rookconnect/medical-device-api/",
        "checked": "2026-10-17",
        "note": "Rook Medical Device API"
      },
      {
        "url": "https://tryrook.io/rookconnect/lab-data-api/",
        "checked": "2026-10-17",
        "note": "Rook Lab Data API"
      },
      {
        "url": "https://www.spikeapi.com/pricing",
        "checked": "2026-10-17",
        "note": "Spike Sandbox and Enterprise plans"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://www.humanapi.co/",
        "checked": "2026-10-17",
        "note": "humanapi.co redirects to LexisNexis Health Intelligence"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
      },
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://docs.tryrook.io/data-sources/",
        "checked": "2026-10-17",
        "note": "Rook data sources and own developer accounts"
      },
      {
        "url": "https://docs.tryterra.co/vantage-api/overview",
        "checked": "2026-10-17",
        "note": "Terra Vantage lab API"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      },
      {
        "url": "https://www.junction.com/",
        "checked": "2026-10-17",
        "note": "Junction devices and lab network"
      },
      {
        "url": "https://docs.tryrook.io/",
        "checked": "2026-10-17",
        "note": "Rook health score"
      },
      {
        "url": "https://www.spikeapi.com/",
        "checked": "2026-10-17",
        "note": "Spike scope, implementation engineer and customers"
      },
      {
        "url": "https://www.spikeapi.com/lab-reports",
        "checked": "2026-10-17",
        "note": "Spike Lab Reports API"
      },
      {
        "url": "https://www.spikeapi.com/mcp-health-ai-integration",
        "checked": "2026-10-17",
        "note": "Spike MCP"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/integrations",
        "checked": "2026-10-17",
        "note": "Sahha cloud integrations beta"
      },
      {
        "url": "https://www.thryve.health/",
        "checked": "2026-10-17",
        "note": "Thryve coverage and hosting"
      },
      {
        "url": "https://docs.thryve.health/thryve-data-sources/overview",
        "checked": "2026-10-17",
        "note": "Thryve data sources and OAuth clients"
      },
      {
        "url": "https://validic.com/",
        "checked": "2026-10-17",
        "note": "Validic devices and EHR programs"
      },
      {
        "url": "https://validic.com/inform-signup/",
        "checked": "2026-10-17",
        "note": "Validic Inform plans"
      },
      {
        "url": "https://validic.com/features/supported-devices/",
        "checked": "2026-10-17",
        "note": "Validic restricted devices"
      },
      {
        "url": "https://validic.com/news/chartspan/",
        "checked": "2026-10-17",
        "note": "ChartSpan acquisition of Validic"
      },
      {
        "url": "https://openwearables.io/pricing",
        "checked": "2026-10-17",
        "note": "Open Wearables licence and Enterprise"
      },
      {
        "url": "https://openwearables.io/docs/providers/supported",
        "checked": "2026-10-17",
        "note": "Open Wearables provider setup"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables",
        "checked": "2026-10-17",
        "note": "Open Wearables README"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/dedicated-data-source-api-keys",
        "checked": "2026-10-17",
        "note": "Terra managed and dedicated provider keys"
      },
      {
        "url": "https://www.junction.com/post/series-a",
        "checked": "2026-10-17",
        "note": "Junction rebrand from Vital and Series A"
      },
      {
        "url": "https://docs.junction.com/home/welcome",
        "checked": "2026-10-17",
        "note": "Junction SDKs and webhooks"
      },
      {
        "url": "https://docs.junction.com/wearables/connecting-providers/bring-your-own-oauth/overview",
        "checked": "2026-10-17",
        "note": "Junction Bring Your Own OAuth"
      },
      {
        "url": "https://docs.junction.com/home/quickstart",
        "checked": "2026-10-17",
        "note": "Junction data regions"
      },
      {
        "url": "https://tryrook.io/",
        "checked": "2026-10-17",
        "note": "Rook product scope"
      },
      {
        "url": "https://tryrook.io/rookconnect/ehr-emr-api/",
        "checked": "2026-10-17",
        "note": "Rook EHR/EMR API"
      },
      {
        "url": "https://tryrook.io/wearable-api-sdk/integrations/",
        "checked": "2026-10-17",
        "note": "Rook source catalogue"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/webhooks",
        "checked": "2026-10-17",
        "note": "Spike webhook signing and retries"
      },
      {
        "url": "https://www.spikeapi.com/blog",
        "checked": "2026-10-17",
        "note": "Spike acquisition banner"
      },
      {
        "url": "https://sahha.ai/integrations/",
        "checked": "2026-10-17",
        "note": "Sahha integrations"
      },
      {
        "url": "https://sahha.ai/pricing/",
        "checked": "2026-10-17",
        "note": "Sahha plans"
      },
      {
        "url": "https://www.thryve.health/about",
        "checked": "2026-10-17",
        "note": "Thryve company"
      },
      {
        "url": "https://www.thryve.health/certifications-compliance",
        "checked": "2026-10-17",
        "note": "Thryve certifications and BAA"
      },
      {
        "url": "https://validic.com/blog/Validic-Inform-Is-Now-Free/",
        "checked": "2026-10-17",
        "note": "Validic Inform free tier"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables/blob/main/LICENSE",
        "checked": "2026-10-17",
        "note": "Open Wearables licence"
      },
      {
        "url": "https://risk.lexisnexis.com/products/humanapi",
        "checked": "2026-10-17",
        "note": "LexisNexis Human API"
      },
      {
        "url": "https://github.com/metriport/metriport",
        "checked": "2026-10-17",
        "note": "Metriport README and licence"
      },
      {
        "url": "https://docs.metriport.com/medical-api/getting-started/quickstart",
        "checked": "2026-10-17",
        "note": "Metriport Medical API access"
      },
      {
        "url": "https://openwearables.io/faq",
        "checked": "2026-10-17",
        "note": "Open Wearables FAQ"
      },
      {
        "url": "https://openwearables.io/docs",
        "checked": "2026-10-17",
        "note": "Open Wearables docs"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/provider_integration",
        "checked": "2026-10-17",
        "note": "Spike provider consent flow"
      },
      {
        "url": "https://tryrook.io/rookconnect/wearable-api/",
        "checked": "2026-10-17",
        "note": "Rook wearable API, SDKs and delivery"
      }
    ]
  },
  {
    "slug": "ai-workout-tracking-apis",
    "primaryQuery": "AI workout tracking API",
    "h1": "The Best AI Workout & Motion-Tracking APIs (2026)",
    "metaTitle": "Best AI Workout Tracking APIs & SDKs (2026)",
    "metaDescription": "AI workout tracking SDKs compared from their own docs: QuickPose, Sency, Kemtai and KinesteX (which funds this site), vs free pose models like MediaPipe.",
    "updated": "2026-10-18",
    "answer": "For camera-based rep counting and form feedback without building a computer-vision team, an AI workout-tracking SDK is usually the most direct path. Pick QuickPose for MediaPipe-based building blocks with a published per-device price list, Sency for assessments and workout plans in a native kit, Kemtai for clinical and physiotherapy work, and KinesteX (this site's own product) for a hosted white-label coaching experience across mobile and the web. If motion analysis is your core product, build on free pose models like MediaPipe, MoveNet, Apple Vision or ML Kit instead; the keypoints are free, and the recurring cost is the rep logic, form rules and exercise coverage on top.",
    "body": "**Disclosure: KinesteX, one of the four SDKs below, is this site's own product, and KinesteX funds this site.** It is listed last, described to the same factual bar as the others, and nothing here ranks it first. Every vendor fact on this page comes from the vendor's own repositories, documentation or published pages as read on October 17 and 18, 2026.\n\n## The two layers: pose primitives vs coaching SDKs\n\nThere are two very different things people mean by an \"AI workout tracking API,\" and confusing them is the most common mistake.\n\nThe bottom layer is **pose-estimation primitives**: MediaPipe/BlazePose, TensorFlow MoveNet, Apple Vision and Google's ML Kit. These give you a skeleton of joint keypoints per video frame (17 to 33 landmarks in 2D and, in some cases, 3D) and nothing more. They are free, run on-device, and are permissively licensed or bundled with the platform.\n\nThe top layer is **coaching SDKs**: QuickPose, Sency, Kemtai and KinesteX. These sit on the keypoints and add the application logic that turns a stream of landmarks into a product: rep counting, per-exercise form rules, exercise libraries, assessments, and feedback UI.\n\nHere is the key thing to internalize before you compare vendors: **the keypoints are the easy, commoditized part. The recurring cost is everything after them.** Getting 33 landmarks per frame is a solved, free problem. Turning noisy landmarks into reliable rep counts and per-exercise form feedback across body types, camera angles, lighting, and low-end devices is the actual engineering cost, and it recurs as maintenance rather than being a one-time build. Every new exercise needs its own state logic and joint-angle thresholds; accuracy across real-world conditions needs continuous tuning, test data, and QA. That second column of work is exactly what the coaching SDKs sell.\n\n## How to compare AI workout-tracking SDKs\n\nFour criteria decide this category for most builders:\n\n- **Scope fit.** Are you building consumer fitness, or clinical/rehab? The vendors specialize differently, and paying for rehab-grade scope you don't need (or missing it when you do) is a common mismatch.\n- **Platform coverage.** iOS-only, or do you need Android, web, Flutter, and React Native at parity? This alone rules some options in or out.\n- **Access and pricing model.** Published plans with a free tier, or a demo request and a quote? This affects how fast you can start and how you budget.\n- **How much you still build.** A pose-and-logic toolkit leaves the exercise programming and UI to you; a white-label platform ships more of the product but gives you less control over the exact form logic.\n\nOne accuracy note that applies to every product below: none of these vendors publishes an independent benchmark, and we have not measured any of them. Treat every accuracy or speed figure as a marketing claim to confirm in a trial; [how to evaluate motion SDKs](/guides/evaluate-motion-sdks) sets out a protocol.\n\n## Comparison table\n\n| SDK | Best for | Platforms | Access model | Watch out |\n|---|---|---|---|---|\n| QuickPose | MediaPipe pose plus ready rep, range-of-motion and feedback logic inside your own UI | iOS 14+, Android API 26+, React Native plugin | Self-serve free tier, paid above a device threshold; every plan published per monthly active device | Building blocks, not content: exercise programming and UI stay on you |\n| Sency | Assessments and workout plans, as a no-UI native kit or a white-label UI kit | iOS, Android, React Native, Flutter; JavaScript and Unity marked \"NA\" | Free trial, then usage-based; contact-sales sign-up, with per-user plans published on two pages that disagree about the first 100 users | Models download from Sency's server at configuration; proprietary Terms of Use |\n| Kemtai | Clinical, physiotherapy and MSK | Any device with a camera; embeddable components plus data APIs | Demo request; API docs by email; no published prices | Clinical-first scope may exceed a pure consumer need |\n| KinesteX (this site's own product) | A hosted white-label coaching experience with content, plans and assessments | iOS, Android, Flutter, React Native, web (iframe, PWA, React TypeScript) | Contact-sales; vendor-described per-active-user pricing | A WebView or iframe experience, not native rendering; no published prices |\n\n_Prices, tiers and platform details are volatile: everything above is as of October 2026, so verify in the vendor's own pages._\n\n## The options in detail\n\n### QuickPose\n\nQuickPose is a pose-estimation toolkit built on Google's MediaPipe: its iOS README describes \"developer-oriented cutting edge ML features of MediaPipe and BlazePose\", and its Swift package ships MediaPipe lite, full and heavy libraries as modules. It runs on iOS 14 and later (its product page says all iPhones from iPhone 8 onwards), on Android from API 26, and in React Native through a plugin, and its product pages say all inference runs on the device with no video frames sent to a server. It provides joint overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, counters for 20 named exercises, body-position feedback, and yoga pose detection; you can use its overlays or consume raw landmarks and build your own. Its distinguishing trait is access: a free SDK key, and a published price list by monthly active device, free for up to 10 devices and then from $25 a month for 100 devices to $1,000 a month for 100,000, with every SDK feature on every plan ([QuickPose pricing](/pricing/quickpose-pricing)). It is best for teams that want MediaPipe pose plus ready-made rep and range-of-motion logic without a sales call to start. Watch out: it is a pose-and-logic SDK rather than a workout platform, so exercise programming and UI are on you, and the Android README's feature table is shorter than the iOS one.\n\n### Sency\n\nSency is a motion SDK for fitness and health apps that uses only a phone camera, in two kits: SMKit, which its version table calls a \"Native no-UI SDK\" where you own the camera preview and UI, and SMKitUI, a white-label Branded Kit. It ships for iOS, Android, React Native and Flutter, with JavaScript and Unity marked \"NA\". Its README leads with movement and fitness assessments, monthly progress evaluations and personalized workout plans, and its pricing page describes a four-step assessment that takes less than 4 minutes and covers functional movement, core strength, mobility and endurance. Its FAQ says data is analyzed on the user's device and never sent to the cloud, but its iOS and Android SDKs download their models from Sency's server during configuration, with no bundled fallback. Sency prices by monthly active user on two pages that disagree about the start: its packages page lists a free Starter plan for up to 100 users and a Growth plan from $499 a month for up to 3,800, while its main pricing page describes a free trial and then a minimal monthly fee covering up to 100 active users, with pay-as-you-go above that ([Sency pricing](/pricing/sency-pricing)). Its main pricing page invites you to start with a free trial, \"no commitment required\". Sign-up runs through a contact form, and commercial use falls under a separate paid agreement in its Terms of Use. It is best for consumer fitness and health apps that want assessments and plans in a native kit. Watch out: the first configuration needs a connection, and the two pricing pages need reconciling in writing.\n\n### Kemtai\n\nKemtai is a computer-vision movement-analysis platform oriented toward physiotherapy, rehab and medical fitness. Its site says it works on any device with a camera, with no sensors or wearables, and that it ships as embeddable components plus data APIs that return exercise scores, range-of-motion changes and adherence data to your system. It cites a library of more than 2,000 exercises and movement variations, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. It says its accuracy was validated in a study against a gold-standard motion lab that used 10 3D cameras and body sensors, a vendor claim about a study worth asking to see, and two of its own pages give different body-point counts, 111 and 113. Its API documentation is behind an email request and it publishes no prices. It is best for clinical, PT and MSK products that need a large exercise library plus assessment and adherence data. Watch out: the positioning is clinical-first, so a pure consumer-fitness team may pay for scope it doesn't need.\n\n### KinesteX\n\nKinesteX (this site's own product, described here to the same factual bar as the others) is a white-label AI fitness coaching SDK whose iOS, Android, Flutter, React Native and web SDKs embed a hosted camera workout experience through a WebView or iframe, plus a content API. It provides ready-made workouts and plans, challenges and leaderboards, AI movement assessments with risk-level outputs, rep counting, mistake detection, posture tracking and calorie estimates, and it sends rep, mistake, exercise and workout events back to your app. Its SDK READMEs describe \"optional edge processing (no cloud transmission)\", while its security page says all camera and vision processing stays on-device and its HIPAA page says KinesteX is HIPAA compliant; confirm what your configuration does. It is best for teams that want a brandable, multi-platform coaching layer, including the web, without building pose logic in-house. Watch out: it publishes no prices (its FAQ describes usage-based plans priced per active user per month; access starts with a contact form), the experience is the vendor's hosted web app rather than native rendering you control, and its accuracy figures (above 90 percent in a README, 97.2 percent in its FAQ) are its own claims.\n\n## The build-your-own alternative: pose primitives\n\nIf motion analysis is your core product, you can skip the coaching SDKs and build on free primitives. All run on-device and are commercially usable:\n\n- **MediaPipe / BlazePose** (Google AI Edge) detects 33 body landmarks with 3D world landmarks, is positioned by its model card for on-device real-time fitness, and runs on Android, iOS, Python, and web under an Apache-2.0 license. See [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models).\n- **TensorFlow MoveNet** detects 17 keypoints in a latency-focused \"Lightning\" and a higher-accuracy \"Thunder\" variant, plus a MultiPose model for up to 6 people, and runs in TensorFlow Lite and TensorFlow.js. The older standalone PoseNet package is deprecated in its favour. See [MoveNet models](/motion/movenet-models).\n- **Apple Vision** provides on-device body-pose detection inside the Apple SDK: 19 2D joints from iOS 14, plus a 3D request from iOS 17, free within the Apple toolchain, on Apple platforms only. See [Apple Vision body pose](/motion/apple-vision-body-pose).\n- **ML Kit Pose Detection** returns 33 landmarks for one person on Android and iOS, offered in beta. See [ML Kit pose detection](/motion/ml-kit-pose-detection).\n\nThe catch is the one from the top of this page: these give you keypoints and stop there. Rep logic, form rules, exercise coverage, calibration, and edge-case handling are all on you, and that work recurs. Whether owning it is worth it is a build-vs-buy decision, not a feature checklist. [How to build an AI fitness app](/ai-fitness-app) maps this layer and the five others, with a build-versus-buy position for each, and [pose estimation models compared](/motion/pose-estimation-models-compared) covers the model choice.\n\n## Which should you pick?\n\nMatch the tool to the job rather than hunting for a single winner:\n\n- **If you want building blocks inside your own UI and a price you can read today** → QuickPose, for its free key, published per-device plans and MediaPipe foundation.\n- **If you want assessments and workout plans in a native kit, or Flutter** → Sency, with its two pricing pages reconciled in writing.\n- **If you're in physiotherapy, rehab, or medical fitness** → Kemtai, for its exercise library, embeddables and clinical positioning, with its regulatory and validation claims confirmed first-hand.\n- **If you want a white-label coaching experience with content across mobile and the web** → KinesteX, which funds this site; [KinesteX alternatives](/alternatives/kinestex-alternatives) lists the reasons you might not.\n- **If motion analysis is your core IP, you have CV/ML talent, or you need exercises the vendors don't cover** → build on MediaPipe, MoveNet, Apple Vision or ML Kit, and accept that the rep, form and library logic is yours to build and maintain.\n\nHead-to-heads with the same sourcing: [QuickPose vs Sency](/compare/quickpose-vs-sency), [KinesteX vs Sency](/compare/kinestex-vs-sency) and [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose).\n\n## Watch the fine print\n\nPricing tiers, device and user thresholds, exercise counts and platform parity all change, and two of these four vendors publish no prices at all. Confirm every volatile number against the vendor's own pages before you commit, and use trials and free tiers to verify accuracy and platform parity on your actual exercises and target devices.",
    "faqs": [
      {
        "q": "What is the difference between a pose estimation API and an AI workout tracking SDK?",
        "a": "A pose-estimation API such as MediaPipe, MoveNet, Apple Vision or ML Kit gives you a skeleton of joint keypoints per frame and nothing more. A workout-tracking SDK such as QuickPose, Sency, Kemtai or KinesteX adds the application logic on top: rep counting, per-exercise form rules, exercise libraries, assessments and feedback UI."
      },
      {
        "q": "Is there a free AI workout tracking API?",
        "a": "The pose-estimation primitives are free: MediaPipe/BlazePose and TensorFlow MoveNet are Apache-2.0, and Apple Vision and ML Kit come with their platforms. Among commercial coaching SDKs, QuickPose publishes a free tier for up to 10 monthly active devices, and Sency's packages page lists a free Starter plan for up to 100 monthly active users, though its main pricing page describes those users as a paid tier after a free trial. Kemtai and KinesteX publish no prices."
      },
      {
        "q": "Can I build my own rep counting instead of using an SDK?",
        "a": "Yes. Free pose primitives give you the keypoints, and you can write your own rep-counting and form logic on top. The trade-off is that this is a multi-month effort for a CV/ML team and it recurs as maintenance, since each new exercise needs its own logic and accuracy must be tuned across body types, camera angles, lighting, and devices."
      },
      {
        "q": "Which AI motion-tracking SDK is best for physiotherapy or rehab?",
        "a": "Kemtai is positioned for clinical, physiotherapy, and MSK use cases: its site describes embeddable exercise and patient-management components, data APIs for exercise scores and adherence, more than 2,000 exercises, and an FDA listing and CE marking as a medical device. It publishes no prices and its API documentation is behind an email request, so confirm the regulatory status, the validation study it cites and the terms directly with Kemtai."
      },
      {
        "q": "Do these workout tracking SDKs run on-device or in the cloud?",
        "a": "The raw pose primitives run on the client. The commercial SDKs all claim on-device analysis, with differences worth checking: QuickPose bundles MediaPipe and says no video frames are sent to a server; Sency's FAQ says data is analyzed on the device, but its SDKs download their models from Sency's server at configuration; Kemtai says processing is done on the edge device and video is not recorded; and KinesteX's READMEs say optional edge processing while its security page says all camera and vision processing stays on-device. Get your configuration's behaviour in writing before relying on it for privacy or compliance."
      }
    ],
    "related": [
      {
        "href": "/compare/quickpose-vs-sency",
        "label": "QuickPose vs Sency"
      },
      {
        "href": "/guides/evaluate-motion-sdks",
        "label": "How to evaluate motion SDKs"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/fitness-apis/fitness-api-vs-build-your-own",
        "label": "Fitness API vs building your own"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and motion API every week, including the on-device latency, platform-parity, and contact-sales pricing gotchas that never make the marketing page."
    },
    "sources": [
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "MediaPipe and BlazePose description, modules, features, iOS 14.0"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-10-17",
        "note": "Android API 26 (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/ios-sdk/",
        "checked": "2026-10-17",
        "note": "iPhone 8 onwards, on-device inference, yoga pose detection (snapshot)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "plans by monthly active device (snapshot)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "kits, platform table, features, Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "server-downloaded models"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-10-17",
        "note": "server-delivered models"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial, usage-based billing, four-step assessment, contact form (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-10-18",
        "note": "on-device processing claim (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "devices, exercises, edge processing, regulatory and validation claims, 111 points, API docs by email (snapshot)"
      },
      {
        "url": "https://kemtai.com/kemtai-api-and-embeddables/",
        "checked": "2026-10-17",
        "note": "embeddables and data APIs (snapshot)"
      },
      {
        "url": "https://kemtai.com/our-computer-vision/",
        "checked": "2026-10-17",
        "note": "113 body points (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-10-17",
        "note": "WebView and iframe SDKs, events, assessments, accuracy claim"
      },
      {
        "url": "https://www.kinestex.com/docs",
        "checked": "2026-10-17",
        "note": "platforms, contact-form access (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "pricing model, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-10-17",
        "note": "on-device statement (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/hipaa",
        "checked": "2026-10-17",
        "note": "HIPAA compliance claim (snapshot)"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "33 landmarks, fitness positioning, Apache-2.0"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/tree/master/pose-detection",
        "checked": "2026-10-17",
        "note": "MoveNet 17 keypoints; PoseNet package deprecated"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "up to 6 people"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname",
        "checked": "2026-10-18",
        "note": "19 2D joints; the 3D request from iOS 17"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-17",
        "note": "33 landmarks, one person, beta"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "nutrition-apis",
    "primaryQuery": "nutrition API",
    "h1": "The Best Nutrition & Food Database APIs (2026)",
    "metaTitle": "Best Nutrition & Food Database APIs (2026)",
    "metaDescription": "Compare the top nutrition and food database APIs in 2026 — USDA FoodData Central, Open Food Facts, Nutritionix, Edamam, and Spoonacular by use-case.",
    "updated": "2026-07-08",
    "answer": "For free, authoritative nutrient data, use the USDA FoodData Central API (public domain, free key); for global barcode and packaged-product data, use Open Food Facts (open data, no key). If you need natural-language meal logging or restaurant coverage, Nutritionix fits; Edamam bundles food lookup, nutrition analysis, and recipes; Spoonacular is best for recipe and ingredient apps. Verify current pricing and quotas before committing.",
    "body": "## What to look for in a nutrition API\n\nNutrition APIs are not interchangeable. Four things decide which one fits:\n\n- **Data model fit.** Are you looking up a nutrient reference (USDA), scanning barcodes on packaged products (Open Food Facts, Nutritionix, Edamam, Spoonacular), parsing a free-text meal someone typed (Nutritionix, Edamam), or building around recipes and ingredients (Spoonacular, Edamam)? These are genuinely different jobs.\n- **Licensing and cost model.** Two of these are free and open (USDA is public domain / CC0; Open Food Facts is open data under ODbL). The other three are proprietary and freemium — free or low-cost entry tiers that gate volume, commercial use, and full features behind paid plans.\n- **Access friction.** USDA needs a free data.gov key. Open Food Facts needs no key at all (just a required custom `User-Agent`). Nutritionix, Edamam, and Spoonacular each issue their own API keys.\n- **Coverage type.** Whole-food lab values, branded grocery items, restaurant/chain menus, and recipes are curated differently by each provider. Match coverage to your users' meals.\n\n## Nutrition API comparison (2026)\n\nVolatile cells — pricing, quotas, database counts — change often. Treat every one as \"as of 2026, verify in the docs.\"\n\n| API | Best for | Access model | Pricing model | Watch out |\n|---|---|---|---|---|\n| USDA FoodData Central | Authoritative free nutrient reference | Free data.gov key | Free (public domain / CC0) | No NLP parsing, no restaurant menus; modest hourly rate limit |\n| Open Food Facts | Barcode / global packaged products | No key (custom `User-Agent` required) | Free (open data, ODbL) | Crowdsourced accuracy; share-alike license obligations |\n| Nutritionix | Natural-language logging + restaurants | `x-app-id` + `x-app-key` | Commercial / freemium (sources conflict) | Reports disagree on whether a free tier still exists — verify |\n| Edamam | Food DB + NLP analysis + recipes together | `app_id` + `app_key` per API | Freemium (attribution on lower tiers) | Three APIs keyed and licensed separately |\n| Spoonacular | Recipe / ingredient / meal-planning apps | `apiKey` or RapidAPI key | Freemium (daily \"points\" quota) | Point-per-call cost; free quota reported inconsistently |\n\n## The five options\n\n### USDA FoodData Central\n\nThe USDA FoodData Central API is the go-to free source for authoritative, lab-grade nutrient values. It is a U.S. government REST API serving several curated datasets — Foundation Foods, SR Legacy, Survey (FNDDS) foods as consumed, and Branded Foods (label data with GTIN/UPC fields). Its standout property is licensing: the data is public domain, published under CC0 1.0, so there is no copyright and no license fee — USDA requests but does not require attribution. You need only a free data.gov API key (a shared `DEMO_KEY` exists for initial exploration). Watch out: it is a nutrient-reference database, not a food-logging engine — there is no natural-language meal parsing, no restaurant-menu product, and no consumer barcode-lookup product, and the per-key rate limit is modest (reported around 1,000 requests per hour as of 2026, verify). You build the logging UX and fill coverage gaps yourself.\n\n### Open Food Facts\n\nOpen Food Facts is the go-to free source for global packaged-product and barcode data. It is a crowdsourced open database queryable by barcode or search — the core call returns ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images for a product code. It is free and open: the database is under the Open Database License (ODbL), contents under DbCL, and images under CC-BY-SA. There is no API key — read requests are open but must send a custom `User-Agent` identifying your app (the project has said it intends to keep the API free and add no keys). Watch out: data is volunteer-contributed with no accuracy or completeness guarantee, and the ODbL share-alike obligation can require you to publish any derived database as open data — review both your data-quality needs and the license before relying on it.\n\n### Nutritionix\n\nNutritionix is designed for conversational and voice food logging with strong U.S. branded-grocery and chain-restaurant coverage. Its core feature is natural-language food parsing: free-text meal descriptions (for example, \"1 cup rice and 2 eggs\") are turned into structured nutrient data through a single endpoint. It also offers barcode/UPC lookup, instant-search autocomplete, and geolocation-based restaurant endpoints against a large curated catalog of grocery and restaurant items. It uses two headers, `x-app-id` and `x-app-key`, issued after you create an API application. Watch out: it is a paid, closed database, and as of 2026 sources conflict on whether a usable free tier still exists — some describe a free entry tier plus paid plans, others say public free/non-commercial trials were discontinued. Confirm the current access terms and pricing directly before you build.\n\n### Edamam\n\nEdamam is a good fit when you want one vendor covering food lookup, natural-language nutrition analysis, and recipe search together. It is a family of three APIs sharing a curated dataset: a Food Database API (basic, packaged, and restaurant items, with UPC/barcode and NLP inputs), a Nutrition Analysis API (free-text recipes and ingredient lists parsed into a full nutrient profile), and a Recipe Search API (searchable recipes with diet and health filters). Each API uses an `app_id` and `app_key` pair. Watch out: the three APIs are provisioned, keyed, and licensed separately, and lower tiers carry attribution requirements (a link and logo next to nutrition facts) plus rate caps — scope which API and tier you actually need, and verify current pricing as of 2026.\n\n### Spoonacular\n\nSpoonacular is oriented around recipes, ingredients, meal planning, and cost/nutrition computation. Alongside a large searchable recipe corpus with diet, cuisine, and intolerance filters, it covers store-bought packaged products and chain-restaurant menu items, and offers recipe nutrition and cost estimation, ingredient parsing and conversion, meal-plan generation, and product/UPC lookup. Its focus differs from Nutritionix and Edamam: it is built around recipes and ingredients rather than free-text \"meal you ate\" logging. Access is via an `apiKey` in the request URL when you subscribe directly, or a RapidAPI key; sign-up is free with no card required for the on-site free plan. Watch out: pricing runs on a daily \"points\" quota where each call costs points, so real cost depends on result-heavy calls, and the exact free quota is reported inconsistently (figures like roughly 50 calls or 150 points per day appear, but sources conflict) — meter your call patterns and verify the current quota as of 2026.\n\n## Which should you pick?\n\nThere is no single winner — pick by the job:\n\n- **You need free, authoritative nutrient values** (whole and branded foods) and can build your own logging UX → **USDA FoodData Central**.\n- **You are building a barcode scanner** for packaged products, want global coverage, and no key or fee → **Open Food Facts** (and mind the share-alike license).\n- **You need users to type or speak a meal** and get nutrients back, with strong U.S. restaurant and grocery coverage → **Nutritionix**.\n- **You want food lookup, NLP nutrition analysis, and recipes from one vendor** → **Edamam**.\n- **You are building a recipe, meal-planning, or ingredient-cost app** → **Spoonacular**.\n- **On a tight budget?** Combine the two free sources: USDA for authoritative whole-food nutrients plus Open Food Facts for barcode/packaged coverage often covers a surprising amount before you pay anyone.\n\n## Watch the fine print\n\nEvery commercial vendor here has changed its tiers, quotas, and limits historically, and reports even conflict on whether Nutritionix still has a free tier and on Spoonacular's exact free quota. Before you commit, confirm current pricing, rate limits, attribution requirements, and commercial-use terms against each provider's own documentation — and, for the open datasets, read the license (CC0 for USDA, ODbL for Open Food Facts) so you understand your obligations.",
    "faqs": [
      {
        "q": "What is the best free nutrition API?",
        "a": "The USDA FoodData Central API is the best free source for authoritative nutrient data — it is public domain (CC0) and needs only a free data.gov key. For barcode and packaged-product data, Open Food Facts is free open data with no API key required (just a custom User-Agent header)."
      },
      {
        "q": "Which nutrition API can parse a meal from plain text?",
        "a": "Nutritionix and Edamam both parse free-text meal descriptions like \"1 cup rice and 2 eggs\" into structured nutrient data. USDA FoodData Central and Open Food Facts do not offer natural-language meal parsing, and Spoonacular focuses on recipes and ingredients rather than free-text meal logging."
      },
      {
        "q": "Does Nutritionix have a free tier?",
        "a": "As of 2026, sources conflict — some describe a free entry tier plus paid plans, while others say public free or non-commercial trials were discontinued. Confirm the current access terms and pricing directly with Nutritionix before building."
      },
      {
        "q": "Which nutrition API supports barcode lookup?",
        "a": "Nutritionix, Edamam, Spoonacular, and Open Food Facts all support barcode or UPC lookup. Open Food Facts makes it the core call and is free with no key. USDA FoodData Central includes GTIN/UPC fields in its Branded Foods dataset but is oriented around its own food IDs rather than a consumer barcode-lookup product."
      },
      {
        "q": "Is Open Food Facts free to use commercially?",
        "a": "Yes, Open Food Facts data can be used for any purpose including commercial use, but it is licensed under the ODbL with a share-alike obligation — derived databases combining its data may have to be released as open data. Attribution is also required, and the data is crowdsourced with no accuracy guarantee."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new health and fitness API every week — the licensing traps, rate limits, and pricing gotchas included. Subscribe to get the next one."
    }
  },
  {
    "slug": "free-fitness-apis",
    "primaryQuery": "free fitness API",
    "h1": "Free & Open-Source Fitness APIs (2026)",
    "metaTitle": "Free Fitness APIs (2026): No-Cost and Open-Source Options",
    "metaDescription": "The genuinely free and open-source fitness APIs in 2026: wger, free-exercise-db, USDA FoodData Central, Open Food Facts, HealthKit and Health Connect.",
    "updated": "2026-07-08",
    "answer": "For zero-cost, zero-licensing-friction exercise data, use the free-exercise-db dataset (public domain). For a maintained self-hostable stack, use wger (open source, mind AGPL and CC attribution). For nutrition, USDA FoodData Central is free and public domain, and Open Food Facts is free open data for barcodes. Apple HealthKit and Google Health Connect are free but platform-bound to one OS and on-device only. The key distinction: genuinely-free/open options let you own and self-host the data, while free tiers of commercial APIs are borrowed access you can lose when you scale.",
    "body": "A genuinely free fitness API usually means one of two very different things, and the difference decides your whole architecture. Either you get **open data you own and self-host** (wger, the free-exercise-db dataset, USDA FoodData Central, Open Food Facts) or you get the **free tier of a paid product** you borrow until you scale. Both cost zero dollars today. Only one of them still costs zero when you have real traffic. This page maps the genuinely-free/open options across exercise content, nutrition, and platform data, then gets honest about where \"free\" actually bites.\n\n## How to judge a \"free\" fitness API\n\nPrice is the easy part — it is zero. The questions that actually matter are the ones that show up after you ship:\n\n- **Do you own the data, or borrow it?** Open datasets and self-hostable projects (wger, free-exercise-db) let you download, host, and keep the data. Free tiers of commercial APIs are access you can lose the moment you exceed a quota or the vendor changes terms.\n- **What are the licensing obligations?** \"Free\" is not the same as \"no strings\". Public-domain sources (free-exercise-db, USDA) are effectively obligation-free. Copyleft and share-alike licenses (AGPL-3.0, CC-BY-SA, ODbL) are free to use but require attribution and, in some cases, that you open-source what you build on top or release derived databases as open data.\n- **Is it platform-bound?** Apple `HealthKit` and Google `Health Connect` cost nothing, but they only run on one operating system and only see on-device data. Free, but boxed in.\n- **What breaks at scale?** Rate limits, no SLA or support, feature/media gating, and data freshness. A free tier is built for prototyping, not production load.\n\n## The genuinely free/open options at a glance\n\n| Option | Category | What you get | License / model | Watch out |\n|---|---|---|---|---|\n| free-exercise-db | Exercise content | 876 exercises as JSON plus 1,746 JPEG images (counted October 22, 2026) | Unlicense (public domain) — you own it | Static dataset, not a live service; images only, no GIFs; you host and maintain it |\n| wger | Exercise content (plus nutrition/weight) | Self-hostable app with an open exercise DB, public read API | Software AGPL-3.0; data Creative Commons (historically CC-BY-SA) | AGPL copyleft on deployed changes; per-entry attribution/share-alike; smaller catalog |\n| USDA FoodData Central | Nutrition | Authoritative lab-grade nutrient data, branded foods dataset | Public domain / CC0 — hosted, free key | Rate-limited (reported ~1,000 req/hr/key, verify); no NLP parsing or barcode-lookup product |\n| Open Food Facts | Nutrition | Global packaged-product and barcode data | Open data (ODbL / DbCL / CC-BY-SA images) | Crowdsourced accuracy varies; ODbL share-alike can require opening derived databases |\n| Apple HealthKit | Platform data | On-device Apple health and workout data | Free with Apple Developer Program | Apple-only, on-device, on-device; no server-to-server access |\n| Google Health Connect | Platform data | On-device Android health and fitness data | Free (part of Android/Jetpack) | Android-only, on-device; ~30-day history cap by default; Play review step |\n\n_All counts, rate limits, and tier details above are volatile — treat them as \"as of 2026, verify in the docs.\"_\n\n## The genuinely free and open options\n\n### free-exercise-db (`yuhonas/free-exercise-db`)\n\nThe lowest-friction way to bootstrap an exercise library. It is a public-domain dataset — 876 exercises as structured JSON when we counted its combined file on October 22, 2026 (the README says 800+), with fields like `force`, `level`, `mechanic`, `equipment`, `primaryMuscles`, `instructions`, and static image paths — released under the Unlicense, so there is effectively no attribution requirement or restriction at all. You clone the repo or fetch the combined `exercises.json` and host it yourself. The trade-off: it is a static dataset, not a maintained live service, so you own updates, hosting, and search, and the media is static images only (no GIFs or video). Freshness depends on community commits. See [free-exercise-db compared with ExerciseDB](/compare/exercisedb-vs-free-exercise-db).\n\n### wger (`wger-project/wger`)\n\nA self-hosted FLOSS fitness, nutrition, and weight tracker that also exposes an open exercise database over a documented REST API. Its live catalog size on `wger.de` was not readable from our environment on October 22, 2026; it offers multilingual names, muscle groups, equipment, images, and per-entry license metadata. Public exercise-list endpoints are readable without authentication, and you can either query the hosted `wger.de` instance or run your own via Docker. Best for teams that want full control and an auditable open-source stack with no per-request fees. The trade-off is licensing: the software is AGPL-3.0, so copyleft applies to modifications you deploy, and the data is Creative Commons (attribution/share-alike per entry). The catalog is also lighter on media than commercial GIF libraries. See [wger alternatives compared](/alternatives/wger-alternatives).\n\n### Free nutrition data: USDA FoodData Central and Open Food Facts\n\nIf your fitness product also needs food data, two sources are genuinely free rather than free-tier. **USDA FoodData Central** is U.S. government nutrient data in the public domain (CC0) — no license fee, just a free `data.gov` key — and is the authoritative choice for lab-grade nutrient values, though it is a reference database, not a food-logging engine. **Open Food Facts** is crowdsourced open data for packaged products and barcodes, with no API key required (only a custom `User-Agent`). Their catch is licensing shape, not price: USDA is obligation-free public domain, while Open Food Facts is copyleft (ODbL/DbCL, images CC-BY-SA) with attribution and share-alike strings. For the full breakdown against the commercial options, see our [best nutrition and food database APIs](/fitness-apis/nutrition-apis) guide.\n\n### Apple HealthKit and Google Health Connect\n\nFree, but platform-bound — this is the trade-off in one line. `HealthKit` is Apple's on-device health and fitness store (iOS, iPadOS, watchOS, visionOS) and `Health Connect` is Google's on-device equivalent for Android. Neither charges a usage fee; the cost is that each runs inside one operating system and exposes only what is on that device, using per-data-type OS permission prompts rather than `OAuth`. That gives you rich, high-frequency data with tight OS-level privacy, but no server-to-server or cross-user access on its own. Two specifics to plan around: with `HealthKit` an app cannot tell whether read permission was denied (denied data simply appears empty), and `Health Connect` caps historical reads at roughly 30 days by default and adds a Play Store health-permission review step before launch. Do not start new work on the older Google Fit APIs either. Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit), updated September 10, 2026, says the Google Fit API, including the REST API, \"will only be supported until the end of 2026\", and new Fit sign-ups reportedly closed in May 2024. Google recommends `Health Connect` for step tracking and mobile-first apps and the Google Health API for cloud-based integrations.\n\n## Free tiers of commercial APIs — borrowed, not owned\n\nThe other kind of \"free\" is a free tier of a paid product. These are worth knowing, but understand what you are getting: access, not ownership. On the exercise side, **ExerciseDB**, now sold by AscendAPI (formerly exercisedb.dev), has two free entry points as of October 22, 2026: ExerciseDB V1 serves 1,500 exercises with 180p GIFs with no API key, and ExerciseDB V2's Basic plan on RapidAPI gives 2,000 requests a month and 200 exercises with watermarked images and video. The full catalogs, higher resolutions and clean media are on paid plans whose prices we could not read. **API Ninjas** gives a free key that calls its Exercises API, but its free plan is for evaluation and demo purposes only, with no commercial use; exercise images and paging past five results are premium, and its Developer plan is listed at $59 a month or $39 a month billed yearly.\n\nOn the nutrition side, **Nutritionix**, **Edamam**, and **Spoonacular** are all commercial/freemium. Edamam offers a free developer tier but requires attribution (link plus logo) on lower plans and keys each of its three APIs separately. Spoonacular runs a daily \"points\" quota where result-heavy calls cost more. Reports even conflict on whether Nutritionix still has a usable free tier — confirm directly. For cross-device wearable data, the aggregators (Terra, Vital/Junction, Rook, Spike) are subscription or usage-based from the start; they are not a free path, though some offer sandboxes for building.\n\n## The real catch of \"free\"\n\nWhichever kind of free you pick, budget for these five realities:\n\n1. **Rate limits.** Free and BASIC tiers enforce hard hourly and monthly request caps — fine for a prototype, not for production traffic. Even the open, hosted APIs (USDA) meter per hour.\n2. **No support or SLA.** Free tiers carry no uptime guarantee. If it goes down at 2am, that is your problem to route around.\n3. **Feature and media gating.** On commercial free tiers, the higher exercise counts and the GIF/video media — the reason you wanted the API — usually sit behind the paywall.\n4. **Attribution and copyleft obligations.** \"Free open data\" still carries strings except for public-domain sources. wger's CC data needs attribution and share-alike; AGPL projects (wger's software) impose copyleft on derivatives you deploy; Open Food Facts' ODbL can require you to open derived databases. Only the Unlicense (free-exercise-db) and CC0 (USDA) are effectively obligation-free.\n5. **Data freshness and lock-in.** Hosted APIs can change counts, schema, or pricing unilaterally, and a free tier is the first thing a vendor tightens. Open datasets flip the risk: no lock-in, but they are only as fresh as their last community commit — you own maintenance.\n\n## Which should you pick?\n\n- **If you want zero cost and zero licensing friction to bootstrap → free-exercise-db.** Public domain, no auth, no attribution. You accept static images and self-maintenance.\n- **If you want a maintained, self-hosted stack you control → wger.** Open source, self-hostable, public read API — just plan for AGPL copyleft on your deployed changes and CC attribution on the data.\n- **If you need authoritative nutrient data → USDA FoodData Central.** CC0 public domain, license-free, lab-grade. You build the logging UX around it.\n- **If you need global packaged-product or barcode data → Open Food Facts.** Free, keyless, huge coverage — mind crowdsourced accuracy and the ODbL share-alike obligation.\n- **If you need rich on-device wearable data and are single-platform → HealthKit (iOS) or Health Connect (Android).** Free, deep, but boxed to one OS and on-device only.\n- **If you need turnkey GIF/video-rich exercise content or cross-device wearable aggregation → budget for a paid tier.** The free options either lack the media or are platform-bound; commercial ExerciseDB tiers and the aggregators solve those problems for money, not for free.\n\n## Watch the fine print\n\nEvery count, rate limit, price, and tier gate above is volatile — vendors and projects change them often. Before you commit, verify the current numbers and, just as important, the current license terms at each project's primary docs. The licensing obligations (AGPL, CC-BY-SA, ODbL, CC0, Unlicense) are the part that outlives any pricing change, so read those carefully against what you intend to build and ship.",
    "faqs": [
      {
        "q": "Is there a completely free fitness API with no rate limits?",
        "a": "Yes, if you self-host. The free-exercise-db dataset (Unlicense/public domain) and wger (open source, self-hostable) are just data you download and serve, so there are no per-request quotas. Hosted free options like USDA FoodData Central and Open Food Facts are free but do meter requests."
      },
      {
        "q": "Which free fitness APIs let you self-host the data?",
        "a": "For obligation-free bootstrapping, the free-exercise-db dataset (876 exercises when we counted it on October 22, 2026, public domain, static images) is the lowest-friction choice as of 2026. For a maintained, self-hostable stack with a REST API, wger is the leading self-hostable open-source option, though its software is AGPL-3.0 and its data is Creative Commons (attribution/share-alike)."
      },
      {
        "q": "Are Apple HealthKit and Google Health Connect free?",
        "a": "Yes, both are free to use with no per-call fee. The catch is that they are platform-bound: HealthKit runs only on Apple devices and Health Connect only on Android, both are on-device, and neither gives you server-to-server or cross-user access on its own."
      },
      {
        "q": "Is USDA FoodData Central free for commercial use?",
        "a": "Yes. USDA FoodData Central is U.S. government data published in the public domain under CC0, so it is free for any use including commercial, with no license fee and no attribution required (USDA requests but does not require credit). You only need a free data.gov API key, and rate limits apply, so verify current limits in the docs."
      },
      {
        "q": "What is the catch with free-tier fitness APIs?",
        "a": "Free tiers of commercial APIs are access you borrow, not data you own. Expect hard rate limits, no support or SLA, and feature or media gating that hides the higher exercise counts and GIF/video content behind paid plans. Free open data has its own strings: attribution and copyleft obligations like AGPL, CC-BY-SA, and ODbL, except for public-domain sources."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition & food database APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness or health API every week, including the licensing traps and the point where free stops being free, so subscribe to get the next one."
    }
  },
  {
    "slug": "apple-healthkit-vs-google-health-connect",
    "primaryQuery": "HealthKit vs Health Connect",
    "h1": "Apple HealthKit vs Google Health Connect (2026)",
    "metaTitle": "HealthKit vs Health Connect: Which to Build (2026)",
    "metaDescription": "Google's version of HealthKit is called Health Connect. How the two on-device stores compare, and why a cross-platform app needs both.",
    "updated": "2026-10-02",
    "answer": "HealthKit and Health Connect are not an either/or choice — they are the on-device health stores for two different operating systems, so a cross-platform app implements both. Use Apple HealthKit on iPhone, Apple Watch, Vision Pro and iPads running iPadOS 17 or later, and Google Health Connect on Android 9 and up, where it is built into Android 14 and later and a Google Play app before that. Neither uses OAuth: the user grants access per data type in an OS permission prompt, and your app reads the data on the device rather than from a server.",
    "body": "## How these two compare\n\nThese are platform SDKs, not cross-platform APIs, so the criteria are different from picking a wearable or aggregator service. Four things decide how each one behaves in your app:\n\n- **Platform lock.** HealthKit data exists only on Apple devices, and Google describes Health Connect as \"exclusive to Android and Google Play.\" Both are read on the device: Apple gives iPhone, Apple Watch, Vision Pro and iPadOS 17+ iPads their own HealthKit store and syncs between them, while Google's Fit migration guide calls Health Connect's storage device-centric and points server-to-server integrations at the separate Google Health API. This is why they are complementary, not competing.\n- **Permission model.** Both use on-device, per-data-type user permission, granted (or denied) per type and per direction — read and write are separate. Health Connect needs every permission declared in the manifest before you request it; HealthKit lets you ask for a type when you first need it rather than all at once. Neither uses an OAuth consent screen. That changes your onboarding UX: the user is toggling individual data types, not approving a single scope.\n- **History and approval friction.** Health Connect returns data from up to 30 days before the first permission grant unless you hold the history permission, and the Play Console requires a Health apps declaration before you publish. HealthKit now lets a person grant only a recent window of history instead of everything — Apple's authorization flow asks on a second screen — and Apple calls the HealthKit purpose strings \"an App Store requirement for any app that integrates with HealthKit.\"\n- **The \"denied reads as empty\" gotcha.** A HealthKit app cannot tell whether the user denied read permission for a type — Apple says it \"simply appears as if there is no data of the requested type in the HealthKit store,\" apart from samples your own app saved. Full access and denied access also look identical; only a limited history window is detectable, through `earliestAuthorizedSampleDate(for:)` on iOS 27 and later. That directly complicates data-completeness logic.\n\n## HealthKit vs Health Connect at a glance\n\n| | Apple HealthKit | Google Health Connect |\n|---|---|---|\n| Platform | iPhone, Apple Watch, Vision Pro, iPad on iPadOS 17+ (the framework compiles for macOS and older iPadOS, but those have no store) | Android 9+ with Google Play services: built into Android 14+, a Google Play app on Android 13 and lower |\n| Where data lives | A store on each of the user's Apple devices, synced between them | On-device (\"device-centric\" in Google's words) |\n| Access model | Per-data-type OS permission (not OAuth) | Per-data-type OS permission (not OAuth) |\n| Developer setup | HealthKit capability in Xcode, available to free Apple Developer accounts; App Store distribution needs the paid Apple Developer Program | A Play Store project plus the Health apps declaration — no Google Cloud project, unlike Fit |\n| History default | Full history, unless the person grants only a recent window | 30 days before the first grant, unless the history permission is granted |\n| Approval step | App Review; purpose strings are an App Store requirement | Play Console Health apps declaration, filed again when your data types change |\n| Best for | Apple Watch and iPhone health data on Apple platforms | One on-device store fed by other Android apps |\n| Watch out | Cannot detect a denied read | Older reads capped by default; declaration gate |\n\n## Apple HealthKit\n\nHealthKit is best for iOS-native apps that want the health data iPhone and Apple Watch already collect, with the tightest OS-level privacy integration. Apple describes it as \"a central repository for health and fitness data on iPhone and Apple Watch\" that your app reads from and writes to with the user's permission. Its type catalogue covers steps, distance, active and basal energy, heart rate, HRV (SDNN, plus RMSSD from iOS 27), respiratory rate, blood oxygen, VO2 max, sleep stages (core, deep and REM), workouts, body measurements and characteristics such as date of birth — plus clinical records in FHIR format behind a separate Clinical Health Records capability. Access is on-device and per-data-type: you add the HealthKit capability, set the `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` purpose strings, and call `requestAuthorization(toShare:read:)` — Apple notes it can make more sense to wait until you need a type before asking for it. The trade-off to know is a deliberate privacy design decision: an app cannot tell whether read permission was denied, because denied data reads as empty rather than raising an error, and a person can also limit you to a recent window of their history. Plan your data-completeness and empty-state handling around both. The HealthKit capability itself is available even to free Apple Developer accounts, per Apple's capability table; shipping on the App Store needs the paid Apple Developer Program.\n\n## Google Health Connect\n\nHealth Connect is best for Android-native apps that want one on-device store fed by the other health apps on the phone, rather than a per-provider integration for each — Google pitches it as access to \"a growing ecosystem of apps with just one connection.\" It needs Android 9 or later with Google Play services; it is part of the Android framework from Android 14 and a Google Play app on Android 13 and lower. Google's data-types table lists 42 record types (as of its September 23, 2026 revision) across activity, body measurement, cycle tracking, nutrition, sleep with stages, vitals such as heart rate and HRV (stored as RMSSD) and wellness, plus a separate medical-records feature in FHIR format, all through the `androidx.health.connect:connect-client` Jetpack library, whose 1.1.0 release Google announces as stable. Permissions are declared in the manifest and granted by the user per type, with dedicated background-read and history-read permissions — again, no OAuth consent screen. Two constraints shape your build: by default an app sees data from up to 30 days before its first permission grant unless it holds `PERMISSION_READ_HEALTH_DATA_HISTORY`, and the Play Console requires a Health apps declaration listing every data type you use before you publish. Do not start new work on Google Fit. Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit), updated September 10, 2026, cautions that \"The Google Fit API (including the REST API) will only be supported until the end of 2026.\" Google recommends Health Connect for step tracking and mobile-first apps and the Google Health API for cloud-based integrations, and the guide maps Fit History and Session API integrations to the Google Health API, not to Health Connect.\n\n## Which should you pick?\n\nFrame this by platform, not by picking a winner — for most builders the honest answer is \"both\":\n\n- **If your app is iOS-only** → implement HealthKit, and design your empty-state and data-completeness logic around the fact that you cannot detect a denied read.\n- **If your app is Android-only** → implement Health Connect, request the history permission if you need data from more than 30 days before the first grant, and budget time for the Play Console Health apps declaration.\n- **If your app is cross-platform** → you implement both, one per OS. Apple's HealthKit runs only on Apple platforms and Google calls Health Connect exclusive to Android, so each is the native surface for its own OS. In React Native, [the comparison of react-native-health and @kingstinct/react-native-healthkit](/libraries/compare/react-native-health-vs-kingstinct-react-native-healthkit) covers the two bridges to the HealthKit half.\n- **If you don't want to build and maintain two native integrations** → compare the third-party [aggregator APIs](/fitness-apis/health-data-aggregator-apis) instead. What each one covers and costs is a vendor claim, sourced and dated on that page; this page checks only Apple's and Google's documentation.\n\nThe key takeaway: HealthKit vs Health Connect is not a competition you have to resolve. They cover different operating systems, so a real cross-platform product uses each on its own OS, or offloads both to an aggregator. See our [wearable data APIs](/fitness-apis/wearable-data-apis) guide if your real need is pulling from specific devices rather than the OS store. To look up the Health Connect record for a given HealthKit identifier, or the reverse, use [the identifier translator](/tools/identifier-translator).\n\n## Watch the fine print\n\nPlatform details in this category move — SDK versions, permission names, history defaults and review policies all change; HealthKit's limited-history authorization is a recent example. Every fact above was checked on October 2, 2026 against the Apple and Google pages listed in this page's sources. Confirm current behavior in Apple's HealthKit documentation and Android's Health Connect documentation before you build, especially the permission and review requirements that gate your launch.",
    "faqs": [
      {
        "q": "Is HealthKit or Health Connect better for a cross-platform app?",
        "a": "Neither on its own. They cover different operating systems, so a cross-platform app implements both — HealthKit on Apple platforms and Health Connect on Android — or hands the work to a third-party aggregator, whose coverage you should check against that vendor's own documentation."
      },
      {
        "q": "What review or declaration steps do HealthKit and Health Connect require before launch?",
        "a": "Both gate your release on a declaration, not just on code. On Apple platforms you add the HealthKit capability and the purpose strings that explain why you read and write health data — Apple calls them an App Store requirement for any HealthKit app — and App Review Guideline 5.1.1 asks that purpose strings clearly and completely describe your use of the data and that you request only data relevant to your core functionality. On Android you declare Health Connect permissions in the manifest, and the Play Console requires a Health apps declaration that justifies each data type before you can publish; you file it again whenever your data types change. Budget calendar time for both, request only the types you can justify, and confirm current review policy before you submit."
      },
      {
        "q": "Can a HealthKit app tell if the user denied read access?",
        "a": "No. By design, denied read permission in HealthKit returns empty data rather than an error, so the app cannot distinguish a denial from a user who simply has no recorded data — which complicates data-completeness logic. The one exception is data your own app saved, which stays readable either way."
      },
      {
        "q": "How much history can Health Connect read by default?",
        "a": "Data from up to 30 days before the app's first permission grant, unless it holds PERMISSION_READ_HEALTH_DATA_HISTORY. Without it, Google's Jetpack reference says reading a single older record by ID errors, while other reads simply leave the older data points out. On Android 14 and later an app can always read the data it wrote itself, whatever its age."
      },
      {
        "q": "Are HealthKit and Health Connect free?",
        "a": "Neither setup involves an API key or a billing account. HealthKit is a capability you switch on in Xcode, and Apple's capability table lists it for free Apple Developer accounts as well as paid ones — although distributing on the App Store requires the paid Apple Developer Program. Health Connect's registration is a Play Store project plus the Health apps declaration, which Google contrasts with the Google Cloud project Fit required. The real cost is platform lock: HealthKit is Apple-only and Health Connect is Android-only."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Health-data aggregator APIs"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable fitness APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We take apart a fitness or health API every week — the permission-model quirks and cross-platform gotchas included."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/healthkit",
        "checked": "2026-10-02",
        "note": "HealthKit as the central repository on iPhone and Apple Watch; framework platforms"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/about-the-healthkit-framework",
        "checked": "2026-10-02",
        "note": "a store per device (iPadOS 17+), sync between devices, no store on macOS or older iPadOS, characteristic data"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data",
        "checked": "2026-10-02",
        "note": "per-type read and share permission, asking when needed, denied reads, the limited-history screen"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/authorizationstatus(for:)",
        "checked": "2026-10-02",
        "note": "\"simply appears as if there is no data\" quote; own data stays visible"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/earliestauthorizedsampledate(for:)",
        "checked": "2026-10-02",
        "note": "limited history window detectable from iOS 27; full and denied access look the same"
      },
      {
        "url": "https://developer.apple.com/documentation/xcode/configuring-healthkit-access",
        "checked": "2026-10-02",
        "note": "purpose strings as an App Store requirement; Clinical Health Records capability and FHIR"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier",
        "checked": "2026-10-02",
        "note": "quantity types named in the HealthKit section; heartRateVariabilityRMSSD is iOS 27+"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis",
        "checked": "2026-10-02",
        "note": "core, deep and REM sleep stages"
      },
      {
        "url": "https://developer.apple.com/help/account/reference/supported-capabilities-ios",
        "checked": "2026-10-02",
        "note": "HealthKit capability available to free and paid developer accounts; App Store distribution is paid-program only"
      },
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-02",
        "note": "guideline 5.1.1 purpose strings and data minimization (last updated June 8, 2026)"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/availability",
        "checked": "2026-10-02",
        "note": "exclusive to Android and Google Play; Android 9+ with Play services; framework module on Android 14"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-02",
        "note": "declare permissions in the manifest before requesting; app vs framework by Android version"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/data-types",
        "checked": "2026-10-02",
        "note": "42 record types and their categories; history and background-read permissions"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-02",
        "note": "30-day default window; no limit on an app's own data on Android 14+"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission",
        "checked": "2026-10-02",
        "note": "what reads do without PERMISSION_READ_HEALTH_DATA_HISTORY"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/publish",
        "checked": "2026-10-02",
        "note": "Health apps declaration, refiled when data types change"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
        "checked": "2026-10-02",
        "note": "Fit end-of-support quote (revision of September 10, 2026); device-centric storage; registration; server-to-server path"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/migration/fit/faq",
        "checked": "2026-10-02",
        "note": "\"a growing ecosystem of apps with just one connection\""
      },
      {
        "url": "https://developer.android.com/health-and-fitness/guides/health-connect",
        "checked": "2026-10-02",
        "note": "Jetpack library 1.1.0 stable; medical records in FHIR"
      }
    ]
  },
  {
    "slug": "terra-vs-vital",
    "primaryQuery": "Terra vs Vital",
    "h1": "Terra vs Vital (Junction): Health-Data APIs Compared (2026)",
    "metaTitle": "Terra vs Vital (Junction): Health-Data APIs Compared",
    "metaDescription": "Terra vs Junction (formerly Vital) as of October 2026: both now sell lab testing. Compare wearable coverage, US vs US and UK labs, and published prices.",
    "updated": "2026-10-17",
    "answer": "Terra and Junction (Vital renamed itself Junction in March 2025) now overlap more than they used to: both connect wearables through one API and both sell lab testing, so the choice turns on reach and price shape. Pick Junction if your users are in the US and you want lab ordering across all 50 states, or a flat $300 a month for your first 500 connected users; its lab API, BAA and unlimited users sit on the custom Enterprise plan. Pick Terra if you need its wider marketed wearable list (500+ providers against Junction's 300+), labs in the UK as well as the US, or delivery straight into databases and queues, and can model a credit bill that starts at $399 a month billed annually. Prices are as of October 17, 2026.",
    "body": "## How Terra and Vital/Junction compare\n\nBoth products solve the same core problem, one integration instead of a separate build per wearable, and since this page was first written they have converged: Terra's homepage now sells lab testing, and Junction's pricing page now publishes a flat entry plan. An earlier version of this page said labs were the thing Junction did that Terra did not, and that Junction priced per user with a monthly minimum; neither is true of the vendors' pages as we read them on October 17, 2026. What still separates them:\n\n- **Lab reach.** Junction offers lab testing \"spanning all 50 states\" through \"a nationwide network of labs (NY, NJ, and RI included)\". Terra's lab page says \"Nationwide US, plus the UK\", and its Vantage API docs list the United Kingdom and the USA as supported countries.\n- **Wearable coverage and delivery.** Terra markets 500+ providers and delivers to webhooks or straight into databases, cloud storage and queues. Junction markets 300+ wearables and devices and pushes webhook events, with ETL pipelines on its Enterprise plan.\n- **Price shape.** Terra bills a subscription plus credits per connected data source; Junction's Launch plan is a flat monthly fee for up to 500 connected users, and everything past that, including labs, is a custom Enterprise contract.\n\n## Terra vs Vital/Junction at a glance\n\n| Dimension | Terra | Junction (formerly Vital) |\n|---|---|---|\n| Wearables | 500+ providers on its site; mobile SDK for Apple Health, Samsung Health and Health Connect | 300+ wearables; mobile SDKs for Apple HealthKit and Android Health Connect |\n| Lab testing | Home kits, mobile phlebotomy or lab walk-ins; US and UK | Walk-in, at-home kit and mobile phlebotomy; all 50 US states; Enterprise plan only |\n| Delivery | Webhooks, SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB, Firestore | Webhook events; ETL pipelines to your warehouse on Enterprise |\n| Entry price | $399 a month billed annually, or $499 monthly, with 100,000 credits | Launch at a flat $300 a month, billed monthly, for 1 to 500 connected users |\n| Scaling | 200 credits per connected source per month, extra credits from $0.005 | Enterprise: custom, billed annually, unlimited users |\n| BAA | Enterprise | Enterprise |\n| Data location | Enterprise lists a \"Dedicated instance to localised area\" | US or EU region per team |\n\nPrices are list prices from the vendors' pricing pages on October 17, 2026.\n\n## Terra\n\nTerra is a server-side API with mobile SDKs: its FAQ describes one integration returning \"standardised data from 500+ providers, including Garmin, Fitbit, Apple Health, Oura, WHOOP and Strava\", covering \"sleep stages and latency, workouts, heart rate, HRV, VO2max, blood oxygen (SpO2), continuous glucose monitoring (CGM), menstrual cycle, body composition and per-set strength training\". Its docs explain why the SDK exists: Apple Health, Samsung Health and Health Connect \"have no cloud API for third parties, so your mobile app reads them with the Terra SDK and sends the data to Terra.\"\n\nIts lab side is the Vantage API, which, per its docs, lets you \"order blood and DNA test kits, track fulfilment, and receive lab results in FHIR format through a single API\". On pricing, \"Subscriptions start from $399 per month billed annually, or $499 per month billed monthly\", with 100,000 credits a month; each \"active authentication is one connected data source for one end user, and costs 200 credits per month\", and the first 400 events per active authentication are free. The signed BAA is on its Enterprise plan. Our [Terra integration guide](/integrate/terra-api) covers the build.\n\n## Vital / Junction\n\nJunction is Vital under a new name: it announced the rebrand on March 11, 2025, alongside an $18M Series A led by Creandum, and its docs still accept *.tryvital.io base URLs. Its homepage pitches \"300+ wearables\" plus lab operations \"spanning all 50 states\", and its 2025 announcement described ordering \"across all 50 states, with results from 10+ labs (including LabCorp & Quest)\". Collection options are walk-in, at-home kit and mobile phlebotomy.\n\nThe pricing page has two plans. Launch is \"a flat $300 a month\" for connecting \"wearables and devices for up to 500 users\", billed monthly. Enterprise is custom and billed annually, and it is where you go \"when you need lab testing, unlimited users, uptime SLAs, or a signed BAA\"; custom OAuth credentials are listed there too. Junction says device data \"is typically flowing within days of picking up the API keys\", while lab testing takes longer because kits and workflows are configured for you: \"expect 4-6 weeks depending on how much customization you need\". Each team is tied to an EU or US region, which \"dictates where data is stored\".\n\n## Which should you pick?\n\nRecommend by use case rather than crowning a winner:\n\n- **US-only product where labs matter and you want ordering across every state** → Junction. Its lab network and operations support are the center of the product; budget for Enterprise from the start, because labs are not on Launch.\n- **Labs for UK as well as US users, or wearables first with labs later** → Terra. Its lab ordering covers the US and the UK, and the wearable side keeps the widest marketed provider list of the two.\n- **Wearables only, up to 500 connected users, and a fixed bill** → Junction's Launch plan is the simplest number in the category: flat, monthly, no contract.\n- **Wearables at a few thousand users** → by our arithmetic Terra costs roughly $899 a month at 1,000 connected sources and $4,899 at 5,000 on annual billing, while Junction needs an Enterprise quote past 500; get the quote before deciding. Our [aggregator pricing page](/pricing/health-data-aggregator-pricing) shows the full comparison.\n- **Data stored in the EU** → Junction lets you pick an EU region on any plan; Terra's Enterprise plan lists a \"Dedicated instance to localised area\", so ask Terra where that can be.\n\nEither way, both let you ingest HealthKit and Health Connect through their SDKs, so on-device Apple and Android data is available whichever you choose. For the rest of the field, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Watch the fine print\n\nPlan names, limits and prices in this category change, and this page has already had to reverse two of its own earlier claims. Before you commit, re-read both live pricing pages (tryterra.co/pricing and junction.com/pricing), and check which of your users' providers need your own OAuth credentials on each.",
    "faqs": [
      {
        "q": "Is Vital the same as Junction?",
        "a": "Yes. Junction announced its new brand, replacing Vital, on March 11, 2025, alongside an $18M Series A led by Creandum. It is the same company and product: its docs say older *.tryvital.io base URLs are still supported alongside *.junction.com, and tryvital.io now redirects to junction.com."
      },
      {
        "q": "What is the main difference between Terra and Vital/Junction?",
        "a": "Reach and price shape, now that both sell lab testing. As of October 17, 2026, Junction offers lab ordering across all 50 US states and a flat $300 a month Launch plan for up to 500 connected users, with labs on its custom Enterprise plan. Terra markets 500+ wearable providers to Junction's 300+, offers labs in the US and the UK, and bills credits per connected data source from $399 a month on annual billing."
      },
      {
        "q": "Can Terra and Vital both pull Apple HealthKit and Health Connect data?",
        "a": "Yes. Terra's mobile SDK connects Apple Health, Samsung Health and Health Connect, which its docs say have no cloud API for third parties. Junction's mobile SDKs integrate Apple HealthKit and Android Health Connect, in native, React Native and Flutter versions. Both also normalize cloud wearable accounts server-side."
      },
      {
        "q": "How do Terra and Vital pricing models differ?",
        "a": "As of October 17, 2026, Terra starts at $399 a month billed annually or $499 monthly, includes 100,000 credits, and charges 200 credits a month for each connected data source plus credits for events past a free allowance. Junction's Launch plan is a flat $300 a month for 1 to 500 connected users, billed monthly, and anything bigger, or anything with lab testing, is a custom Enterprise contract billed annually."
      },
      {
        "q": "Does Vital/Junction support lab tests outside the US?",
        "a": "Not on the pages we read on October 17, 2026: Junction describes lab testing spanning all 50 states through a nationwide US lab network, and we found no non-US lab coverage. If you need labs in the UK, Terra's lab page says nationwide US plus the UK, and its Vantage API docs list both countries as supported."
      }
    ],
    "related": [
      {
        "href": "/integrate/terra-api",
        "label": "Integrate the Terra API"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Health-data aggregator pricing"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We re-read Terra's and Junction's pricing and docs pages and log what changed, so you can pick an aggregator before you write a line of code. Subscribe for the next update."
    },
    "sources": [
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://www.junction.com/pricing",
        "checked": "2026-10-17",
        "note": "Junction Launch and Enterprise plans"
      },
      {
        "url": "https://www.junction.com/",
        "checked": "2026-10-17",
        "note": "Junction devices and lab network"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://docs.tryterra.co/vantage-api/overview",
        "checked": "2026-10-17",
        "note": "Terra Vantage lab API"
      },
      {
        "url": "https://docs.junction.com/home/welcome",
        "checked": "2026-10-17",
        "note": "Junction SDKs and webhooks"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://docs.junction.com/home/quickstart",
        "checked": "2026-10-17",
        "note": "Junction data regions"
      },
      {
        "url": "https://www.junction.com/post/series-a",
        "checked": "2026-10-17",
        "note": "Junction rebrand from Vital and Series A"
      },
      {
        "url": "https://docs.junction.com/api-details/junction-api",
        "checked": "2026-10-17",
        "note": "Junction base URLs including tryvital.io"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
      },
      {
        "url": "https://tryvital.io/",
        "checked": "2026-10-17",
        "note": "tryvital.io redirects to junction.com"
      }
    ]
  },
  {
    "slug": "fitbit-api-vs-garmin-api",
    "primaryQuery": "Fitbit API vs Garmin API",
    "h1": "Fitbit API vs Garmin API (2026)",
    "metaTitle": "Fitbit API vs Garmin API (2026) Compared",
    "metaDescription": "Fitbit API vs Garmin API compared for developers: OAuth, data depth, rate limits, approval gates, and Fitbit's 2026 Google Health API migration.",
    "updated": "2026-07-08",
    "answer": "Pick Garmin's API when you need serious GPS, multisport, and the deepest health metrics like Body Battery, VO2 max, pulse-ox, and HRV; pick Fitbit's API when you want broad mainstream device reach with rich intraday heart-rate and sleep data. Both use OAuth 2.0 with per-user consent and are documented as free to use with approval as of 2026. The catches: Google's Google Health API page (read October 12, 2026) lists end of support for Fitbit's legacy Web API on September 30, 2026 and a full turn-off on October 30, 2026, and Google's Health API migration guide says existing tokens cannot be transferred, so every user re-consents. Garmin's Connect Developer Program needs Garmin's approval, now as Starter or Enterprise Access, and Garmin's pages no longer state how long a review takes, so apply before you commit.",
    "body": "## How to compare Fitbit and Garmin\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Data-model fit.** Garmin leans toward GPS, multisport, and advanced physiological metrics; Fitbit leans toward broad consumer wellness with detailed intraday time series. Match the API to the metric your product actually needs.\n- **Access and approval friction.** Neither is fully self-serve for other people's data at scale. Fitbit lets you self-serve for your own data but gates other users' intraday data case-by-case; Garmin gates its full server-side access behind partner approval. This is the biggest practical difference between them.\n- **Roadmap and stability.** APIs move. Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit), updated September 10, 2026, lists the Google Health API as the recommended path for Fitbit Web API integrations, and Garmin's developer program has an access constraint of its own as of 2026. Both affect whether you can ship on your timeline.\n\nA note on approval and roadmap items throughout this page: they are factual access and roadmap constraints, not a knock on either product. A tighter review gate often reflects stricter user-data handling.\n\n## Fitbit API vs Garmin API at a glance\n\n| API | Best for | Access model | Pricing model | Watch out |\n|---|---|---|---|---|\n| Fitbit / Google Health | Broad consumer reach, intraday HR and sleep | Self-serve for own data; case-by-case for other users' intraday | Free to use (verify commercial terms) | Legacy Web API support ended Sept 30, 2026 and it turns off Oct 30, 2026; Google Health API is the recommended path; tokens cannot be transferred |\n| Garmin (Health + Activity API) | GPS/sport, widest health-metric breadth | Apply to program; partner approval required | No price published for Starter Access; Enterprise terms tailored | Ping/pull, backfill and some metrics are Enterprise-only |\n\n## Where Fitbit pulls ahead\n\nThe case for Fitbit over Garmin comes down to reach and time-to-first-call. Its device base is broadly mainstream, and for products that live on intraday signals it exposes heart-rate time series down to 1-second or 1-minute granularity alongside sleep, `SpO2`, HRV, and workout logs. Crucially, you can register a Personal app and start pulling *your own* account data without waiting on anyone — the self-serve on-ramp Garmin does not offer. The trade-offs that decide it against Garmin: other users' high-resolution intraday data is unlocked case-by-case rather than by default, throughput is modest (reported around 150 requests per hour per consented user as of 2026, verify), and the integration is changing. [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Web API on September 30, 2026 and a full turn-off on October 30, 2026, in favor of the Google Health API on Google `OAuth 2.0`. Google's Health API migration guide says existing tokens cannot be transferred, so migrating users re-consent; [Fitbit API deprecation status](/fitbit-api-shutdown) tracks what is confirmed and what is only reported. If you can absorb that migration, Fitbit is the faster API to get moving on.\n\n## Where Garmin pulls ahead\n\nGarmin wins on metric depth and on delivery model, not on ease of entry. Its split of a Health API (all-day metrics like Body Battery, VO2 max, pulse-ox, HRV, respiration, stress, per-minute epochs) and an Activity API (per-activity data such as running, cycling and swimming, with GPS and session detail) reaches further into serious multisport and physiology than Fitbit does. It also inverts the integration pattern: instead of you polling REST endpoints, Garmin pushes data to registerable callback URLs per type, so you build an event consumer rather than a scheduler — better at scale, but a different architecture to plan for. The gate is the catch. Full server-side access requires partner approval (not a self-serve credential), rate limits are set per partner agreement, and Garmin's program FAQ says that once your request is approved you get access to the Garmin Developer Portal, starting with Starter Access; since October 2026 it no longer states a review time. Confirm you can actually get approved before you design around Garmin's data. For data from your own Garmin account only, Garmin now offers [an official Personal API](/fix/garmin-api-personal-use), and [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth) compares the two unofficial Python clients.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If you need serious GPS, multisport, and the deepest health metrics** (Body Battery, VO2 max, pulse-ox, HRV) → pick Garmin, but confirm first that you can get through Garmin's approval at the access level you need.\n- **If you need the broadest mainstream device reach and rich intraday heart-rate and sleep data** → pick Fitbit, but build against the Google Health API and plan for user re-consent through the migration.\n- **If you are shipping soon and need to onboard immediately** → Fitbit's self-serve path for your own data lets you start testing today, whereas Garmin depends on approval: its pages no longer state how long a review takes, and its FAQ puts a typical integration at one to four weeks. If Garmin's data depth is essential, apply before you design around it.\n- **If your product is push-driven and event-based** → Garmin's push and ping callbacks fit naturally; if you prefer request-response over standard REST endpoints, Fitbit's model is the more familiar fit.\n\n## Watch the fine print\n\nPricing models, rate limits, approval status, and migration dates in this category shift often. Everything volatile above — the reported 150 requests per hour on Fitbit — is flagged \"as of 2026, verify.\" Confirm the current numbers, commercial terms, and program availability in each provider's primary developer docs before you build, especially for anything running at scale.",
    "faqs": [
      {
        "q": "Is the Fitbit API free to use?",
        "a": "There is no published per-call fee; Fitbit is documented as free to use with the standard developer registration and approval as of 2026. Registering a Personal app for your own data is self-serve, while accessing other users' high-resolution intraday data requires case-by-case approval. Verify current commercial terms under the Google Health API before building at scale."
      },
      {
        "q": "Can I get minute-level heart rate from both Fitbit and Garmin?",
        "a": "Not on the same terms. Fitbit exposes heart-rate time series down to 1-second or 1-minute granularity, but other users' high-resolution intraday data is unlocked case-by-case rather than by default — self-serve covers your own account only. Garmin's Health API includes per-minute epochs as part of its standard partner data set, but that whole surface sits behind partner approval. On both sides the granularity you want is an approval question first and an API question second. Verify current terms with each provider."
      },
      {
        "q": "Can I still sign up for the Garmin Connect Developer Program?",
        "a": "Garmin's own pages still invite requests. Its program FAQ, read on October 22, 2026, after Garmin reorganised the program, describes Starter and Enterprise Access and says that once your request is approved you get the Garmin Developer Portal; it no longer states a review time. Third-party reports from 2026 that new sign-ups were on hold could not be verified on Garmin's own pages. Confirm you can get approved directly with Garmin before designing around its APIs."
      },
      {
        "q": "Which is better for GPS and workout data, Fitbit or Garmin?",
        "a": "Garmin is the richer option for GPS, multisport, and workout detail: its Activity API covers per-activity data such as running, cycling and swimming, with GPS, heart rate, and session detail, and its Health API adds metrics like Body Battery, VO2 max, pulse-ox, and HRV. Fitbit exposes GPS and exercise detail through activity logs but leans more toward broad consumer wellness and intraday time series."
      },
      {
        "q": "Can one app support both Fitbit and Garmin users?",
        "a": "Yes, and plenty do — but treat it as two integrations, not one. Both use OAuth 2.0 with per-user consent, so the connect flow rhymes, yet you register separately with each provider, clear each one's approval gate, and consume two different delivery models: pull-based REST on Fitbit, push callbacks on Garmin. Their data models differ too, so you need your own normalization layer before the rest of your app sees a workout. If you would rather build one integration than two, that is the case for a health-data aggregator."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable fitness APIs"
      },
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week — the OAuth approval gates, rate limits, and migration gotchas included, so subscribe and skip the surprises."
    }
  },
  {
    "slug": "fitness-api-vs-build-your-own",
    "primaryQuery": "build or buy fitness API",
    "h1": "Fitness API vs Building Your Own: How to Decide (2026)",
    "metaTitle": "Fitness API vs Build Your Own: How to Decide (2026)",
    "metaDescription": "Free pose APIs give you keypoints; the cost is the rep and form logic on top. A framework for when to build a fitness API vs buy one in 2026.",
    "updated": "2026-07-08",
    "answer": "Build your own if camera-based motion analysis is your core product and you have the CV/ML team to maintain it; buy a fitness API if motion coaching is a feature inside a larger product and you want to ship fast without owning form logic forever. Pose estimation (MediaPipe, MoveNet, Apple Vision) gives you joint keypoints for free, but rep counting, form rules, exercise coverage, and ongoing tuning are the recurring cost. So build vs buy is really a maintenance-ownership decision, not a feature one.",
    "body": "The trap most teams fall into is comparing the wrong thing. They see that pose estimation is free and conclude that building is nearly free too. It isn't. The keypoints are commoditized; the coaching logic on top of them is the cost, and that cost recurs.\n\n## First, understand what is actually free\n\nGetting a skeleton of joint keypoints out of a camera frame is a solved, free, on-device commodity. Three mature options give you this today at no license cost:\n\n- **Google MediaPipe Pose / BlazePose** — 33 body landmarks in 2D and 3D, optimized for real-time on-device fitness use, Apache-2.0 licensed, runs on Android, iOS, web, and Python.\n- **TensorFlow MoveNet** — 17 keypoints, very fast, with a latency-tuned \"Lightning\" and an accuracy-tuned \"Thunder\" variant; runs 30-plus fps on modern phones and in the browser via TensorFlow.js.\n- **Apple Vision body pose** — 19 2D joints (plus a newer 3D request), built into the Apple SDK, free within the Apple toolchain but iOS and macOS only.\n\nIf your mental model is \"the AI part is the hard part,\" update it. The AI that finds elbows and knees is the free part. What you do with a stream of noisy landmarks is the hard part.\n\n## What you still have to build after the keypoints\n\nTurning landmarks into a product means owning every layer below. None of it comes from the primitives.\n\n| Layer | Primitives give you | You still build and maintain |\n|---|---|---|\n| Per-frame joint keypoints (17 to 33 points) | Yes, free, on-device | Nothing |\n| 2D/3D coordinates, real-time fps | Yes | Nothing |\n| Rep-counting logic | No | A state machine per exercise, cadence, partial-rep handling |\n| Form rules and feedback | No | Joint-angle thresholds, depth, tempo, cues authored and tuned per exercise |\n| Exercise coverage | No | Every exercise you support, modeled individually |\n| Calibration and setup | No | Framing, distance, body-in-frame, handedness |\n| Edge cases | Partly, via model quality | Occlusion, off-angle cameras, lighting, body types, clothing, low-end devices |\n| Feedback UI, assessments, programs | No | All of it |\n\nThe primitives solve keypoint extraction. A commercial fitness API's value is that entire right-hand column. And that column is where the recurring cost lives: each new exercise needs its own logic and thresholds, and accuracy across body types, camera angles, lighting, and devices needs continuous tuning, test data, and QA. This is ongoing headcount, not a one-time build.\n\n## The one framing that actually decides it\n\nBuild vs buy here is not a feature decision. It is a maintenance-ownership decision.\n\nYou can build rep counting and form feedback on free primitives. The real question is whether owning that logic, and its endless tuning across new exercises and edge cases, is core to your product or a distraction from it. Ask: \"Do we want to own and maintain the rep, form, and exercise-library logic forever?\" If yes and it is your differentiator, build. If it is a feature you want maintained for you, buy.\n\n## Build vs buy, across the dimensions that matter\n\nHedge every specific below against your own numbers; usage-based SDK pricing is mostly contact-sales and volatile (as of 2026, verify with the vendor).\n\n| Dimension | Build (in-house on free primitives) | Buy (commercial fitness API/SDK) |\n|---|---|---|\n| Time to market | Months to a robust first version | Weeks; wiring can be days, production integration longer |\n| Upfront cost | Engineering time; no engine license | Low; integration effort only |\n| Ongoing cost | CV/ML headcount for tuning and new exercises | Usage-based per active user or device; scales with your base |\n| Control | Full — you own the model and every form rule | Bounded by the vendor's roadmap and coverage |\n| Data ownership | Complete, in your stack | Depends on vendor; on-device processing is common here |\n| Maintenance burden | Yours, permanently | Vendor's |\n| Talent needed | In-house CV/ML capability | General app engineers |\n\n## When build wins\n\n- Motion analysis *is* your core product or IP and a genuine differentiator.\n- You have in-house CV/ML talent and want to own the model and the exact form logic.\n- You need exercises, sports, or a clinical domain the vendors do not cover well.\n- You are at a scale where per-user SDK fees would exceed the cost of an in-house team.\n- You have strict control, customization, or data-residency requirements that a third-party SDK cannot meet.\n\n## When buy wins\n\n- Motion coaching is a *feature* inside a larger product, not the product itself.\n- You want to ship in weeks, not quarters.\n- You lack a CV/ML team and do not want to hire and retain one.\n- You need a ready exercise library, movement assessments, and cross-platform SDKs out of the box.\n- You would rather pay a predictable per-user cost than carry tuning and maintenance headcount indefinitely.\n\n## The hybrid middle ground\n\nThe choice is not strictly binary. A permissively-licensed wrapper over MediaPipe that ships pre-built rep and form helpers, exposes raw landmarks, and offers a self-serve free tier lets you lower the build cost without a full contact-sales commitment. QuickPose is one example of this shape. The trade-off is usually narrower platform focus (often iOS-first) and less packaged content (programs, branded UI, assessments) than a broader packaged platform such as KinesteX, Kemtai, or Sency. If you want vendor-maintained accuracy but also want to keep your hands on the landmarks, the middle ground is worth pricing out before you commit to either extreme.\n\n## A short checklist before you decide\n\nAnswer these honestly and the direction usually becomes obvious:\n\n1. Is camera motion analysis the thing users pay us for, or a nice-to-have on top of something else?\n2. Do we have people who can tune a form-rule system across body types and camera angles — and keep tuning it?\n3. How many distinct exercises must we support at launch, and how fast does that list grow?\n4. What is our realistic user scale, and where does per-user SDK cost cross the cost of a small CV team?\n5. Do compliance or data-ownership rules force processing and models to stay in our control?\n\n## Watch the fine print\n\nEvery vendor pricing tier, quota, and exercise-library figure in this space moves. Before you build a business case on any number here, confirm it against the primary docs — the primitive licenses (Apache-2.0 for MediaPipe and MoveNet; Apple Vision within the Apple SDK) and each vendor's current pricing page. Treat headline accuracy and fps figures as vendor claims until you have tested them on your own footage and devices.",
    "faqs": [
      {
        "q": "Is it cheaper to build my own fitness pose-tracking instead of using an API?",
        "a": "Only the pose engine is free. Libraries like MediaPipe, MoveNet, and Apple Vision give you joint keypoints at no license cost, but rep counting, per-exercise form rules, calibration, and edge-case tuning are a multi-month build for a CV/ML team plus ongoing maintenance. Building is cheaper only if that logic is core to your product or your user scale outgrows per-user SDK fees."
      },
      {
        "q": "What do free pose estimation libraries like MediaPipe give you, and what do they not?",
        "a": "They give you a per-frame skeleton of 17 to 33 joint keypoints in 2D and 3D, on-device and free. They do not give you rep counting, form feedback, an exercise library, calibration, or assessments. That application layer is exactly what you build yourself or buy from a coaching SDK."
      },
      {
        "q": "When should I buy a fitness API instead of building one?",
        "a": "Buy when motion coaching is a feature inside a larger product, you need to ship in weeks, you lack a CV/ML team, you want a ready exercise library and cross-platform SDKs, or you prefer a predictable per-user cost over maintaining tuning logic yourself. Buy trades control for speed and lower maintenance."
      },
      {
        "q": "When does building your own fitness motion tracking actually make sense?",
        "a": "Build when motion analysis is your core product or differentiator, you have in-house CV/ML talent, you need exercises or a clinical domain vendors do not cover, you are at a scale where per-user fees exceed an in-house team, or strict control and data-residency rules rule out a third-party SDK."
      },
      {
        "q": "Is there a middle ground between building and buying?",
        "a": "Yes. A permissively-licensed wrapper over MediaPipe (QuickPose is one example) ships pre-built rep and form helpers, exposes raw landmarks, and offers a self-serve free tier, lowering the build cost without a sales commitment. The trade-off is usually narrower platform focus and less packaged content than a full white-label fitness API."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "AI workout & motion-tracking APIs"
      },
      {
        "href": "/blog/how-to-choose-a-fitness-api",
        "label": "How to choose a fitness API"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness or motion-tracking API every week, including the build-vs-buy math and the pricing gotchas vendors keep off the pricing page."
    }
  },
  {
    "slug": "garmin-connect-iq-vs-health-api",
    "primaryQuery": "garmin connect iq vs health api",
    "h1": "Garmin Connect IQ vs Health API vs Activity API",
    "metaTitle": "Garmin Connect IQ vs Health API: What's the Difference?",
    "metaDescription": "Connect IQ runs Monkey C apps on Garmin devices; the Health and Activity APIs push synced data to your backend after partner approval. How to choose.",
    "updated": "2026-10-12",
    "answer": "Connect IQ is Garmin's platform for software that runs on the device itself, such as watch faces, data fields, widgets and device apps written in Monkey C, optionally paired with a companion phone app built on the Connect IQ Mobile SDK. The Health API and Activity API are server-to-server feeds instead: after a user's device syncs, Garmin delivers all-day wellness metrics (Health API) or per-activity data such as running, cycling and swimming (Activity API) to your backend. Choose Connect IQ when your code has to run on the wrist, for example inside a workout, and the Health or Activity API when your server needs synced history for many users. Access differs too: Garmin calls Connect IQ its open platform for third-party developer apps, with SDKs downloaded under a license agreement, while the Health and Activity APIs require approval into the Garmin Connect Developer Program, which since October 2026 comes as Starter and Enterprise Access, and Garmin's pages no longer state a review time.",
    "body": "## Connect IQ vs Health API at a glance\n\nOne question decides it: does your code run on the watch, or on your server after the watch syncs?\n\n| | Connect IQ | Health API and Activity API |\n|---|---|---|\n| Where your code runs | On the Garmin device, plus an optional companion app on the phone | On your backend |\n| What you build | Watch faces, data fields, widgets, device apps or audio content providers, written in Monkey C | An OAuth connect flow and HTTPS callback endpoints |\n| Data you work with | What your app computes on the device, such as values from the current activity | Health API: all-day wellness metrics. Activity API: per-activity data such as running, cycling and swimming |\n| Whose data | The person wearing the device your app runs on | Every user who connects through OAuth 2.0 with PKCE, each with a `userAccessToken` |\n| How data moves | Between watch app and companion phone app via Garmin's companion SDKs; direct calls to your server not verified | Garmin POSTs to callback URLs you register (Ping or Push) after a device syncs; you do not poll |\n| Access | Garmin's \"open platform for third-party developer apps\"; SDKs downloaded under its License Agreement; store review not verified | Approval into the Garmin Connect Developer Program, as Starter or Enterprise Access; no review time stated |\n| Our sources | Garmin's GitHub READMEs and Maven Central, read October 12, 2026 | Our integration guide as verified on July 9, 2026, and Garmin's program FAQ for access, read October 17, 2026; Garmin's partner docs are gated |\n\nThe Health API and Activity API split by data, not by access: both come through the same partner program and push delivery, and your partnership agreement sets which of them you get.\n\n## What Connect IQ is\n\nConnect IQ is Garmin's platform for apps that run on its wearables. Garmin's [connectiq-apps repository](https://github.com/garmin/connectiq-apps), whose README says it is \"officially maintained by the Garmin Connect IQ team\", lists these types:\n\n| Type | Garmin's description in the README |\n|---|---|\n| Data fields | \"Apps that run within the native activities that allow developers to compute values based off of the current activity, such as running, biking, etc.\" |\n| Device apps | \"More capable than the other app types, device apps can implement third party activities and provide additional functionality that is not otherwise addressed by the other available app types.\" |\n| Watch faces | \"Low power apps that replace the main watch face and are the home screen on wearable devices.\" |\n| Widgets | \"At-a-glance apps that are readily accessible from the watch face or device home screen. Widgets automatically close after a period of inactivity.\" |\n| Audio content providers | \"Special apps that are used directly by the device media player to acquire and play audio content.\" |\n| Barrels | \"Monkey Barrels are a way for developers to create custom Monkey C libraries containing source code and resource information that can be easily shared across Connect IQ Projects.\" |\n\nIn our reading, the data field is the type that overlaps most with the Health and Activity APIs, because it works on the activity itself. The same README describes Garmin Connect as giving users a dashboard and tools for reviewing their fitness activities, including custom data from Connect IQ apps, so a data field's values can show up in the user's own activity view in Garmin Connect.\n\n### The phone side: companion SDKs\n\nGarmin's [iOS companion SDK README](https://github.com/garmin/connectiq-companion-app-sdk-ios) says: \"The Connect IQ Mobile SDK allows companion iOS applications to be created that interact with Monkey C applications running on Garmin wearable devices.\" It gives two examples of what that enables: retrieving remote data, and offloading resource-intensive tasks from the wearable to the iOS device.\n\nOn Android, the [Connect IQ SDK for Android](https://github.com/garmin/connectiq-android-sdk) is published on Maven Central as `com.garmin.connectiq:ciq-companion-app-sdk`. Its README describes two samples that work as a pair: Comm Android, a companion app that runs on the phone, and Comm Watch, the matching watch app, which sits in the samples folder of the Connect IQ SDK for devices. The [Maven Central listing](https://repo1.maven.org/maven2/com/garmin/connectiq/ciq-companion-app-sdk/) named 2.4.0 as the latest release when we read it on October 12, 2026; its metadata was last updated on March 27, 2026.\n\nBoth companion READMEs tie the download to Garmin's License Agreement, so read it before you ship. Nothing on this page is legal advice; confirm with counsel what the agreement means for your product.\n\n## What the Health API and Activity API are\n\nThese are server-to-server feeds, not code that runs on the watch. After a user's device syncs, Garmin sends that user's data from its cloud to endpoints on your backend. What follows comes from our [Garmin API integration guide](/integrate/garmin-api) as verified on July 9, 2026, except where a bullet names Garmin's own FAQ:\n\n- **Health API:** all-day wellness metrics such as heart rate, steps, sleep, stress and Pulse Ox.\n- **Activity API:** per-activity data; Garmin's page names running, cycling, swimming, yoga and strength training and gives no total count.\n- **Auth:** OAuth 2.0 with PKCE, which gives you a per-user `userAccessToken`.\n- **Delivery:** you register callback URLs and Garmin POSTs to them. Ping sends a notification carrying a `callbackURL` that you then GET; Push sends the full data inline as JSON. You do not poll, which changes how you design ingestion; see [webhooks vs polling for fitness data](/learn/webhooks-vs-polling-for-fitness-data).\n- **Access:** the Garmin Connect Developer Program is approval-only, not self-serve. Garmin's program FAQ, read on October 22, 2026, describes Starter and Enterprise Access and says that once your request is approved you get the Garmin Developer Portal; it no longer states a review time, and personal-use questions now go to Garmin's separate Personal API. Our page on [what to do about Garmin's approval gate](/fix/garmin-api-approval) covers the options.\n- **Other programs:** a partnership may cover others, such as a Training or Women's Health API. Verify what yours includes.\n\nGarmin's partner docs are gated, so verify hosts, scopes and summary-type names against the current partner docs rather than any public page.\n\n## What we could not verify about Connect IQ\n\nGarmin's developer site could not be reached from our environment on October 12, 2026, so everything about Connect IQ on this page comes from Garmin's GitHub repositories and Maven Central. We left these gaps open rather than guess; check each in Garmin's developer documentation before a design depends on it:\n\n- Whether apps submitted to the Connect IQ Store go through a review, and how long it takes.\n- Which sensors and metrics a Connect IQ app may read, and on which devices. We have no device compatibility list.\n- Whether a Connect IQ app may send data to your own server directly.\n- Whether custom data from a Connect IQ app is included in what the Activity API delivers.\n- Costs or fees of any kind for Connect IQ.\n- The current version of the Connect IQ SDK for devices.\n\n## Which one do you need?\n\nOur recommendation, by what you are building:\n\n- **A custom value computed during a run or ride, inside Garmin's own activity:** a Connect IQ data field.\n- **Your own activity type on the watch:** a Connect IQ device app, which Garmin says \"can implement third party activities\".\n- **Something on the home screen, or one glance away from it:** a watch face or a widget.\n- **Watch features that need remote data or heavy processing:** add a companion phone app built on Garmin's companion SDK for iOS or Android.\n- **All-day wellness for many users, in your backend:** the Health API.\n- **Per-activity data for many users, in your backend:** the Activity API.\n- **An on-watch experience and backend history:** both, as two separate integrations. The server side depends on partner approval, so plan it around the reported sign-up hold.\n- **No route to partner approval:** read [Garmin API alternatives](/alternatives/garmin-api-alternatives) before you design around Garmin's server feeds.\n\nIf you also build for Apple Watch or Wear OS, our [watchOS vs Wear OS development guide](/watch-apps/watch-platform-differences) covers the matching on-watch layer there.\n\n## A fourth path for personal projects: garminconnect\n\n`garminconnect` is neither Connect IQ nor a Garmin API. It is an unofficial Python client for Garmin Connect's web services that signs in with the user's own credentials, and its README says \"it does not pair with the Garmin Connect phone app or connect directly to a watch.\" In our reading it suits, at most, a personal script against your own account, and our Garmin approval page records that Garmin blocks third-party clients and that using them breaks its terms; for your own data, Garmin's official Personal API is now the better start. For an app that serves other people's data, our [garminconnect library page](/libraries/garminconnect) points to Garmin's official program, and so do we.",
    "faqs": [
      {
        "q": "Does Connect IQ give my server access to a user's Garmin data?",
        "a": "Not the way the Health API does. Connect IQ is for code that runs on the Garmin device, optionally with a companion phone app built on Garmin's companion SDKs, rather than a feed of synced data to your backend. Whether a Connect IQ app may send data to your own server directly we could not verify, because Garmin's developer site was unreachable for us. For many users' synced history in your backend, the route this site has verified is the Health and Activity APIs, behind partner approval."
      },
      {
        "q": "How is getting started with Connect IQ different from getting Health API access?",
        "a": "Garmin's iOS companion SDK README calls Connect IQ its \"open platform for third-party developer apps\", and both companion SDK READMEs tie the download to Garmin's License Agreement. The Health and Activity APIs instead require approval into the Garmin Connect Developer Program, which since October 2026 comes as Starter and Enterprise Access; Garmin's pages no longer state a review time. Whether Connect IQ Store submissions go through a review, and how long one takes, we could not verify."
      },
      {
        "q": "Can values from a Connect IQ data field show up in Garmin Connect?",
        "a": "Garmin's connectiq-apps README describes Garmin Connect as giving users a dashboard and tools for reviewing their fitness activities, including custom data from Connect IQ apps. Data fields are the app type that runs within Garmin's native activities and computes values from the current activity, so their values can appear in the user's own activity view in Garmin Connect. Whether that custom data also reaches your server through the Activity API we could not verify."
      },
      {
        "q": "Which SDK builds the phone companion for a Connect IQ app?",
        "a": "On iOS it is the Connect IQ Mobile SDK, which Garmin's README says lets companion iOS apps interact with Monkey C applications running on Garmin wearable devices. On Android it is the Connect IQ SDK for Android, published on Maven Central as com.garmin.connectiq:ciq-companion-app-sdk, whose metadata listed 2.4.0 as the latest release when we read it on October 12, 2026. Garmin's Android samples pair Comm Android on the phone with Comm Watch on the device."
      },
      {
        "q": "What separates the Garmin Health API from the Activity API?",
        "a": "The data they carry, not how you get them. The Health API carries all-day wellness metrics such as heart rate, steps, sleep, stress and Pulse Ox, while the Activity API carries per-activity data such as running, cycling and swimming. Both come through the partner-approval-only Garmin Connect Developer Program, authenticate each user with OAuth 2.0 and PKCE, and deliver to callback URLs you register by Ping or Push. Which of them you are granted is set by your partnership agreement, so verify against the current partner docs."
      }
    ],
    "related": [
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/compare/apple-watch-vs-garmin",
        "label": "Apple Watch vs Garmin: which to build on"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/pricing/garmin-api-pricing",
        "label": "Garmin API pricing"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We track Garmin's developer access, including its October 2026 move to Starter, Enterprise and Personal API access. Subscribe to get those updates as they land."
    }
  },
  {
    "slug": "corporate-wellness-wearable-apis",
    "primaryQuery": "wearable data api for corporate wellness programs",
    "h1": "Wearable Data APIs for Corporate Wellness Programs",
    "metaTitle": "Corporate Wellness Wearable APIs: Which Data Source to Use",
    "metaDescription": "Which wearable data APIs an employer wellness program should connect: aggregator, vendor APIs or HealthKit, and the Garmin, Fitbit and MDM access gates.",
    "updated": "2026-10-12",
    "answer": "The devices employees already wear decide which wearable data API an employer wellness program should connect. Our recommendation is one health-data aggregator such as Terra, Vital/Junction, Rook or Spike for a mixed workforce, the vendor's own API for a program built around one issued device, and Apple HealthKit plus Google Health Connect for phone-only step challenges. Check the gates first: Garmin's Connect Developer Program is partner-approval-only, an MDM profile can disable HealthKit on company-managed iPhones, and as of October 12, 2026, Google says the Fitbit Web API turns off on October 30, 2026, with every user re-consenting. Whatever you connect, per-person data must stay out of anything the employer sees.",
    "body": "An employer wellness program does not choose its devices. Employees bring whatever they already wear, the employer may manage some of their phones, and the employer must never see any one person's health data. In our reading, those three constraints decide the data source. This page covers that decision only; challenges, rewards, the HR dashboard and the legal tracks are in our [guide to building a corporate wellness app](/build/corporate-wellness-app).\n\n## Start from the device mix\n\nOur build guide lists what employees show up with: Fitbits, Garmins, Apple Watches, Ouras, WHOOPs, Samsung devices and phone step counters, each with its own API, auth and data model. Unless the program issues the device, you inherit the whole list.\n\nOur recommendation: before writing integration code, ask the pilot employer which devices employees wear and whether company phones are enrolled in device management. The first answer picks your route. The second can rule one out.\n\n## Three routes to the data\n\n| Route | What you connect | What it reaches | Catch for an employer program |\n|---|---|---|---|\n| Phone health stores | Apple HealthKit, Google Health Connect | Data already on that phone, one OS each, behind per-data-type permission prompts rather than OAuth | Nothing server-side or cross-user on its own, and MDM can switch HealthKit off |\n| Direct vendor APIs | Fitbit through the Google Health API, Garmin, Oura, WHOOP, Polar | One vendor's cloud account per integration, per employee who grants OAuth 2.0 consent | One integration and one access step per vendor |\n| Aggregator | Terra, Vital/Junction, Rook, Spike | Many wearables and cloud accounts behind one API and one OAuth-style flow | Some providers still need your own developer or partner credentials, commonly including Garmin, WHOOP and Samsung Health |\n\nThe routes stack. Our [health-data aggregator comparison](/fitness-apis/health-data-aggregator-apis) notes that aggregators typically sit on top of the other two, with mobile SDKs that pull from HealthKit and Health Connect and servers that pull from vendor cloud APIs. Our [wearable data API comparison](/fitness-apis/wearable-data-apis) found that each vendor API returns data only for individual users who authorize your app, and none is a bulk or population feed. Enrollment is an authorization flow every employee completes, not a workforce-wide switch.\n\n## Access gates to clear before a pilot\n\n| Source | Gate | What it means for a program |\n|---|---|---|\n| Fitbit, through the Google Health API | Every scope is Restricted, so access needs a privacy and security review | The Fitbit Web API turns off on October 30, 2026, and every participant must re-consent |\n| Garmin | Approval for the Connect Developer Program, now as Starter or Enterprise Access | Garmin's pages state no review time; if you offer Garmin devices, it asks you to use its inquiry form |\n| Oura | Self-serve OAuth app, capped at 10 users until Oura approves it | Past 10 Oura wearers, a pilot needs approval first |\n| WHOOP | Self-serve app, capped at 10 members until WHOOP approves it | Past 10 WHOOP members, a pilot needs approval first |\n| Polar | Self-serve client registration | Only recent data is exposed, so sync on a schedule or lose history |\n| HealthKit on company iPhones | The device's MDM profile | The employer's administrator decides, not your code |\n\nThe Fitbit row is from Google's pages as of October 12, 2026, and the Garmin row from Garmin's program FAQ as of October 17, 2026. The Oura, WHOOP and Polar rows are from our July 2026 checks; confirm them in current vendor docs.\n\n### Fitbit: the Web API turns off on October 30, 2026\n\nAs of October 12, 2026, Google's [Google Health API overview](https://developers.google.com/health/about) lists September 30, 2026 as the end of support, after which the Fitbit Web API keeps operating but Google no longer fixes bugs or provides API support. On October 30, 2026 the Fitbit Web API \"will be turned off and will no longer function or sync data to or from Fitbit users.\" Its successor is the Google Health API.\n\nGoogle's [migration guide](https://developers.google.com/health/migration) says existing tokens cannot be transferred, requiring users to re-consent. So every Fitbit participant authorizes your app again, and in our reading anyone who does not stops counting toward challenges. Google also categorizes all Google Health API scopes as Restricted, which means a privacy and security review before access.\n\nOur recommendation: if your program still reads the Fitbit Web API, migrate and plan the re-consent campaign now, and keep challenge scoring windows on the old integration clear of October 30. If an aggregator supplies your Fitbit data, ask how its connection moves and whether participants must reconnect; we have not verified any aggregator's answer. Our [Fitbit Web API to Google Health API migration guide](/migrate/fitbit-web-api-to-google-health) covers the mechanics.\n\n### Garmin: approval first, Starter or Enterprise\n\nGarmin must approve your application before you receive any API credentials. Its program FAQ, read on October 22, 2026, describes Starter and Enterprise Access and says that once your request is approved you get the Garmin Developer Portal; it no longer states a review time. Garmin's Health API page names corporate wellness among the markets it serves. For a program that issues devices, the FAQ says to request the program and contact Garmin through its inquiry form with details of your project. Garmin's overview gives Starter Access limited user capacity and Enterprise Access unlimited user capacity, with commercial terms tailored to business and technical requirements, so an employer-scale rollout should expect to talk to Garmin about Enterprise. Earlier versions of this section passed on community reports that new sign-ups were on hold; Garmin's own pages do not say that. Confirm the status on developer.garmin.com before you promise Garmin support to an employer.\n\nAn aggregator may not remove this gate. One that holds its own Garmin partnership can resell access, but our aggregator comparison lists Garmin among the providers where you commonly must bring your own developer or partner credentials. Ask each shortlisted aggregator which applies before counting Garmin wearers as covered.\n\n### Company iPhones: MDM can switch HealthKit off\n\nApple's documentation for `errorHealthDataRestricted` says \"A Mobile Device Management (MDM) profile restricts the use of HealthKit on this device,\" and notes that such a profile can disable HealthKit on a managed device. Nothing in your app lifts the restriction. Only whoever administers the device can.\n\nIn the wellness case, the employer pushes your app to managed phones, the same profile may have HealthKit disabled, and every HealthKit-based data path is dead for that group while it works in your testing. In our reading that includes an aggregator's mobile SDK, which pulls from the same store, while a server-side connection to a wearable vendor's cloud account does not touch HealthKit. We have not verified whether Android device management affects Health Connect the same way, so test managed Android phones too.\n\nOur recommendation: ask the employer whether HealthKit is allowed on its managed devices, give its administrator a short note on what your app needs, test on one of their phones before launch, and keep manual logging as the fallback. [HealthKit restricted by MDM](/fix/healthkit-data-restricted-mdm) covers detection and user messaging.\n\n## Employer visibility is a routing rule\n\nOur build guide treats aggregate-only, de-identified reporting to the employer as an architecture requirement, with small groups suppressed and no drill-down that exposes one person. The legal tracks behind it are in [the corporate wellness build guide](/build/corporate-wellness-app). This is general information, not legal advice. Confirm your program's obligations with counsel.\n\nIn our reading, that sets two routing rules. Per-person samples from any route land in a participant-scoped store that no employer-facing screen, export or report can query. Aggregation runs in your own layer, after small-group suppression, and only participation, engagement and category-level results cross to the employer. No route does this for you, because what the employer may see is a policy decision specific to your program.\n\n## Which privacy rules can reach a wellness vendor\n\nThe FTC's [Mobile Health Apps Interactive Tool](https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool) asks whether you are \"developing, offering, or operating an app on behalf of a HIPAA covered entity (such as a hospital, doctor's office, health insurer, or health plan's wellness program)\", and says that if so, you likely are a HIPAA business associate. Outside HIPAA, the FTC's Health Breach Notification Rule can apply: the FTC's guidance says a fitness app that can sync with wearable fitness trackers is likely a vendor of personal health records, even if some users never connect a tracker. Our pages on [HIPAA for fitness apps](/compliance/hipaa-compliance-fitness-app), [the FTC breach rule](/compliance/ftc-health-breach-notification-rule) and [Washington's My Health My Data Act](/compliance/washington-my-health-my-data-act) cover each test. This is general information, not legal advice.\n\n## HR systems are a separate integration\n\nRosters and eligibility come in from the employer's HR side, and single sign-on from its identity provider. Wearable data comes in from each employee, on that employee's own consent. Aggregate engagement goes back out, plus incentive payouts if the program pays them. We have not evaluated HRIS or benefits-platform integrations and make no claims about them.\n\nOur recommendation is to keep the two inbound pipes apart in your schema. The roster says who may join, the wearable connection says what a participant did, and on the employer side the two meet only as an aggregate.\n\n## Our recommendation by situation\n\n- **Mixed devices across the workforce → one aggregator.** Shortlist from Terra, Vital/Junction, Rook and Spike. For each provider your employees use, check whether the aggregator needs your own credentials, and ask how it handles the Fitbit turn-off. Advertised device counts are marketing figures, so test coverage against the employer's actual device list, and compare cost models on our [aggregator pricing page](/pricing/health-data-aggregator-pricing).\n- **One issued device → that vendor's API.** Confirm access first against the gate table above, Garmin approval and the Google Health API review especially.\n- **Phone-only step challenge → HealthKit plus Health Connect.** First find out whether company phones are managed and whether HealthKit is allowed on them. Where it is not, those employees need manual logging or a wearable connected through its vendor's cloud.",
    "faqs": [
      {
        "q": "Which wearable access gates should I check before a wellness pilot?",
        "a": "Garmin's Connect Developer Program needs approval, now as Starter or Enterprise Access, with no review time stated, and Oura and WHOOP cap an unapproved app at 10 users or members. As of October 12, 2026, Google says the Fitbit Web API turns off on October 30, 2026 and categorizes every Google Health API scope as Restricted, which requires a privacy and security review. On company-managed iPhones an MDM profile can disable HealthKit, so ask the employer about device management too."
      },
      {
        "q": "What happens to a wellness program's Fitbit participants on October 30, 2026?",
        "a": "As of October 12, 2026, Google says the Fitbit Web API will be turned off that day and will no longer function or sync data to or from Fitbit users. Google's migration guide says existing tokens cannot be transferred, so each participant has to re-consent through your Google Health API integration. Google also says all Fitbit devices and Google Pixel watches, current and previous, will collect data that is returned through the Google Health API, so older devices are not left behind. If an aggregator supplies your Fitbit data, ask it how it handles the switch."
      },
      {
        "q": "Will a step challenge work on iPhones the employer manages?",
        "a": "Not through HealthKit if the employer's MDM profile restricts it. Apple documents that an MDM profile can disable HealthKit on a managed device, and HealthKit calls then fail with errorHealthDataRestricted until the device's administrator changes the policy. Ask the employer before launch, test on one of their managed phones, and keep manual logging as a fallback."
      },
      {
        "q": "Should roster and benefits data share a pipeline with wearable data?",
        "a": "Our recommendation is to keep them apart. Rosters and eligibility come from the employer's HR side, single sign-on from its identity provider, and wearable data from each employee on that employee's own consent. The roster and the wearable data should meet on the employer side only as an aggregate. We have not evaluated HRIS or benefits-platform integrations, so this page names none and makes no claims about them."
      }
    ],
    "related": [
      {
        "href": "/fix/garmin-api-approval",
        "label": "Garmin API approval and access problems"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/architecture/normalize-wearable-data",
        "label": "Normalizing wearable data across providers"
      },
      {
        "href": "/learn/what-is-a-health-data-aggregator",
        "label": "What a health-data aggregator does"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness and wearable APIs"
      }
    ],
    "cta": {
      "pitch": "We track the access gates that decide what a wellness program can connect, including Garmin's partner approval and the Fitbit Web API turn-off. Subscribe to hear when one of them changes."
    }
  },
  {
    "slug": "wearable-research-data-platforms",
    "primaryQuery": "wearable data platform for research studies",
    "h1": "Wearable Data Platforms for Research Studies: Fitabase, Labfront, Empatica and Ametris",
    "metaTitle": "Wearable Data Platforms for Research Studies Compared",
    "metaDescription": "Fitabase, Labfront, Empatica and Ametris (ActiGraph) compared for research studies: supported devices, data resolution, export formats, APIs and hosting.",
    "updated": "2026-10-17",
    "answer": "Fitabase, Labfront, Empatica and Ametris (formerly ActiGraph) are four wearable research platforms, and the device a protocol needs decides between them. Fitabase collects from participants' Fitbit and Garmin devices and exports CSV at daily, hourly and minute level, Labfront collects from select Garmin, Movesense and Dexcom devices with configurable sampling rates, and Empatica and Ametris supply their own FDA-cleared wearables and cloud platforms. Fitabase documents its move to the Google Health API, with participants reauthorizing before the Fitbit Web API turns off on October 30, 2026. Everything here is from each company's own pages as of October 17, 2026.",
    "body": "A research platform sits between participants' wearables and your analysis: it handles device authorization, syncing, adherence monitoring and export, so the study team does not build and run its own integration. The four platforms below split first on one question: will the study use consumer devices participants own or are given, or a research-grade device the platform supplies? Everything here is what each company's own pages said on October 17, 2026. We have not used these platforms, plans and prices change, and nothing here is an endorsement. If you are weighing building your own Fitbit integration instead, start with [our guide to Fitbit research studies after the Web API turndown](/migrate/fitbit-research-studies-after-turndown).\n\n## The four at a glance\n\n| Platform | Devices it documents | Data access | Worth knowing |\n| --- | --- | --- | --- |\n| Fitabase | Fitbit and Garmin wearables and internet-connected scales, except Fitbit Ace and Garmin Jr models | CSV exports at daily, hourly and minute level, per participant or in batch; a Fitabase API sold as an add-on | Moving its Fitbit collection to the Google Health API; custom pricing |\n| Labfront | Select Garmin, Movesense and Dexcom devices | CSV export; developer access to raw data in beta | Configurable sampling rates; a free Tester plan for up to 5 participants; US-hosted |\n| Empatica | Its own EmbracePlus and EmbraceMini | Download from the Care Lab Portal; a Cloud API for sponsors and CROs that delivers Avro and CSV files | FDA-cleared devices; no SDK for academic research |\n| Ametris, formerly ActiGraph | Its own ActiGraph LEAP, CentrePoint Insight Watch and wGT3X-BT | CentrePoint cloud platform with an API to third-party systems | Built around clinical trials; priced per order |\n\n## Fitabase\n\nFitabase describes itself as \"a comprehensive data management platform designed to support innovative research projects using wearable and internet-connected devices.\" Its FAQ says it supports \"the entire ecosystem of wearable activity tracking devices and internet-connected scales from Fitbit and Garmin (except Fitbit Ace models and Garmin Jr models which do not sync data to their respective servers)\", and that it uses \"Garmin and Fitbit Partner APIs\". Studies can use study-controlled or participant-owned devices.\n\n- **Data.** Fitbit physical activity covers steps, activity intensity, energy expenditure and METs; Garmin covers steps, activity intensity, energy expenditure and stress. Heart rate comes at \"the highest resolution data available\" plus daily resting heart rate, sleep includes stages on some devices, and weight comes from supported scales. Fitabase's knowledge base lists Google Health heart rate as \"variable sampling with readings every 3-15 seconds\" and sleep stages at 30 seconds.\n- **Export.** \"Download CSV files for daily, hourly and minute-level data\", per participant or as custom batch exports. The Fitabase API covers batch export, daily activity, connected device profiles and sync times, and Fitabase says the API and automated batch exports \"are currently offered as separate add ons\". Its pricing page also lists an Aggregate Data API that \"Enables large-volume programmatic data exports in JSON or CSV formats\".\n- **Participants.** Fitabase says it has been used to collect de-identified data in studies of children and adolescents, and that \"Garmin's privacy policy requires that users be at least 16 years old, or with consent from guardians.\"\n- **Pricing.** \"Fitabase will work with you to craft an exact pricing plan.\"\n\n### Fitabase and the Fitbit Web API turn-off\n\nFitabase's knowledge base has a migration section, last updated October 14, 2026. It says participants who are still collecting data \"will need to grant Fitabase permission again so their data keeps syncing\" after the Fitbit Web API shuts off on October 30, 2026:\n\n- Reauthorization opened in the Fitabase platform on October 15, 2026, and participants can also reconnect from the Partner apps screen in the Google Health app. They only need to do it once, in either place, and Fitabase says there is no way to reauthorize programmatically.\n- Participants whose data collection ends before the cutoff do not need to reauthorize. The reconnect option stays in the Google Health app through November 30, 2026, and Fitabase says it backfills a late participant's gap as long as their device kept syncing to the Google Health app.\n- Exports gain UTC time, time zone and source columns, and \"We aren't renaming or removing existing columns.\" Fitabase says the Fitabase API is not changing.\n- Exports move \"one dataset at a time\", with a per-export availability table; classic sleep is rolled into the main sleep export, and writing step goals to participants' apps \"isn't available in the Google Health API yet.\"\n\n## Labfront\n\nLabfront's home page says it can \"Capture raw wearable and EMA data for research\", and its devices FAQ says \"Labfront is currently compatible with select Garmin, Movesense and Dexcom devices\". All Garmin devices work through Garmin Connect, but high-resolution data needs one of the select compatible devices.\n\n- **Data.** Beat-to-beat interval from Garmin wearables at each heartbeat; ECG waveform at 125Hz to 500Hz and 9-axis motion at 12.5Hz to 208Hz from Movesense; continuous glucose from Dexcom at 5-minute resolution; and actigraphy, respiration, oxygen saturation, stress, steps and daily summaries from Garmin.\n- **Export.** \"Download your data in a CSV format that is easily importable into your favorite analysis tools, like MATLAB.\" Developer access to raw data for building dashboards and applications is in beta.\n- **Hosting and retention.** \"We currently only support U.S. data centers and the data is stored in Virginia, America.\" Research data is typically kept \"for 3 years after study completion\", and Labfront will delete all data if the researcher asks.\n- **Pricing.** Plans are published and billed annually in advance. The free Tester plan collects from up to 5 participants, with downloads limited to a 30-day window, and hardware is not included in any plan.\n\n## Empatica\n\nEmpatica's platform runs on its own wearables, which send data over Bluetooth to a phone app and from there to the Empatica Cloud. EmbracePlus has 510(k) clearance from the FDA and is marked under the EU MDR as a class IIa medical device, with optical PPG, electrodermal activity, accelerometer, gyroscope and skin temperature sensors; EmbraceMini has 510(k) clearance \"for sleep, circadian rhythm, and physical activity monitoring.\"\n\n- **Data.** Empatica's research page offers \"comprehensive raw data, EDA, vital signs, activity and more, in one wearable solution\", plus digital biomarkers.\n- **Export.** For academic studies, \"All collected data can be securely and directly downloaded from the Care Lab Portal\", data is not viewable in real time, and \"We do not provide an SDK for academic research purposes.\" For sponsors and CROs, the Cloud API works with \"two formats of files, Avro and CSV\", and \"Data will be available in S3.\"\n- **Pricing.** Bundles pair one device with three or five years of cloud data access and portal access, and Empatica offers a 25% academic discount.\n\n## Ametris, formerly ActiGraph\n\nActiGraph's site, theactigraph.com, now redirects to Ametris, which says it was \"Founded in 2004\" as \"Ametris (formerly ActiGraph)\" and joined Signant Health in 2026.\n\n- **Devices.** The ActiGraph LEAP, which Ametris says \"is US FDA 510(k) cleared for the measurement of activity, sleep, and mobility\", with its additional vital signs \"for investigational use only\"; the CentrePoint Insight Watch; and the wGT3X-BT.\n- **Data.** CentrePoint \"generates future-proof raw sensor data that can be reprocessed indefinitely as new methods emerge.\"\n- **Export.** \"Data outcomes can be integrated directly to a third party system with the CentrePoint API.\"\n- **Pricing.** \"Pricing is calculated for each unique order.\"\n\n## How to choose (our recommendation)\n\n- **Participants wear their own Fitbit or Garmin.** Fitabase is the one of the four that documents both. While it moves Fitbit exports to the Google Health API, check its dataset availability table against every variable in your analysis plan.\n- **Garmin plus research sensors such as ECG, IMU or continuous glucose.** Labfront covers Garmin, Movesense and Dexcom with configurable sampling rates.\n- **An FDA-cleared device for a regulated trial.** Empatica and Ametris supply their own cleared devices and platforms built around clinical research, with APIs aimed at sponsors and research organizations.\n- **Ask every platform, in writing,** where data is hosted, how long it is kept, how deletion works and what IRB documentation it provides. Of the pages we read, only Labfront's state a hosting location and a retention period.\n\nThe platform does not carry your study's obligations for you. Google's research policy binds Fitbit data through the Google Health API, as our [Fitbit research migration guide](/migrate/fitbit-research-studies-after-turndown) covers, and Washington's [My Health My Data Act](/compliance/washington-my-health-my-data-act) leaves out research that an institutional review board approves, monitors and governs.",
    "faqs": [
      {
        "q": "Which research platforms will still collect Fitbit data after the Fitbit Web API turns off?",
        "a": "Of the four platforms compared here, Fitabase is the one that documents Fitbit collection. Its knowledge base says it is moving to the Google Health API and that participants still collecting data must reauthorize once, either in the Google Health app or through a Fitabase link. Labfront lists Garmin, Movesense and Dexcom devices, and Empatica and Ametris use their own wearables. We have not checked other platforms."
      },
      {
        "q": "Can study participants use their own Garmin or Fitbit with a research platform?",
        "a": "Fitabase says studies can connect study-controlled or participant-owned Fitbit and Garmin devices, except Fitbit Ace and Garmin Jr models. Labfront says all Garmin devices, including older models, work through Garmin Connect on its platform, but high-resolution data needs one of its select compatible devices. Empatica and Ametris supply their own hardware."
      },
      {
        "q": "Which wearable research platforms give raw sensor data?",
        "a": "Labfront lists beat-to-beat intervals from Garmin, ECG waveform and 9-axis motion from Movesense, and Dexcom glucose. Empatica offers raw data from its EmbracePlus and EmbraceMini, and Ametris says CentrePoint keeps raw sensor data that can be reprocessed as methods change. Fitabase offers the highest resolution its Fitbit and Garmin partner APIs provide, such as heart rate every 3 to 15 seconds."
      },
      {
        "q": "Do wearable research platforms offer an API for automated exports?",
        "a": "All four mention one. Fitabase sells its API and automated batch exports as add-ons, plus an Aggregate Data API for JSON or CSV exports; Labfront's developer access to raw data is in beta; Empatica's Cloud API serves sponsors and clinical research organizations with Avro and CSV files, while academic users download from its portal and get no SDK; and Ametris says its CentrePoint API integrates data outcomes with third-party systems."
      },
      {
        "q": "Where does a research platform store participant data, and for how long?",
        "a": "Of the pages we read, only Labfront states it: U.S. data centers in Virginia, research data typically kept for 3 years after study completion, and deletion of all data on the researcher's request. Fitabase, Empatica and Ametris did not state a hosting location or retention period on the pages we read, so ask each in writing before an IRB submission."
      }
    ],
    "related": [
      {
        "href": "/migrate/fitbit-research-studies-after-turndown",
        "label": "Fitbit research studies after the Web API turndown"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable fitness APIs"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Health-data aggregator APIs"
      },
      {
        "href": "/compliance/washington-my-health-my-data-act",
        "label": "Washington's My Health My Data Act for apps"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness and wearable APIs"
      }
    ],
    "cta": {
      "pitch": "Research platforms are mid-migration to the Google Health API and their device lists change. Subscribe and we'll flag changes that affect a running study."
    },
    "sources": [
      {
        "url": "https://www.fitabase.com/",
        "checked": "2026-10-17",
        "note": "Fitbit and Garmin support, study-controlled or participant-owned devices, CSV exports at daily, hourly and minute level."
      },
      {
        "url": "https://fitabase.com/resources/faq/",
        "checked": "2026-10-17",
        "note": "Supported devices and exceptions, partner APIs, data types, children and Garmin's age policy."
      },
      {
        "url": "https://www.fitabase.com/how-it-works/pricing/",
        "checked": "2026-10-17",
        "note": "Custom pricing and the Aggregate Data API."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/learn-about-fitbit-data/data-resolutions/",
        "checked": "2026-10-17",
        "note": "Heart rate and sleep-stage resolution."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/fitabase-api/what-is-the-fitabase-api/",
        "checked": "2026-10-17",
        "note": "API and batch exports sold as add-ons."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/fitabase-api/available-core-apis/",
        "checked": "2026-10-17",
        "note": "Batch Export, Daily Activity, Profiles and Sync endpoints."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/migration-overview/",
        "checked": "2026-10-17",
        "note": "Reauthorization required to keep syncing; last updated October 14, 2026."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/who-needs-to-reauthorize/",
        "checked": "2026-10-17",
        "note": "Finished participants do not need to reauthorize."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/key-dates/",
        "checked": "2026-10-17",
        "note": "October 15, October 30 and November 30, 2026 dates."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/export-changes/",
        "checked": "2026-10-17",
        "note": "New UTC, time zone and source columns; API unchanged."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/migration-faq/",
        "checked": "2026-10-17",
        "note": "Reauthorize once in either place, no programmatic route, backfill, classic sleep, step goals."
      },
      {
        "url": "https://www.fitabase.com/resources/knowledge-base/google-health-api-migration/dataset-availability/",
        "checked": "2026-10-17",
        "note": "Exports move one dataset at a time."
      },
      {
        "url": "https://www.labfront.com/",
        "checked": "2026-10-17",
        "note": "Raw wearable and EMA data for research."
      },
      {
        "url": "https://www.labfront.com/compatible-devices",
        "checked": "2026-10-17",
        "note": "Select Garmin, Movesense and Dexcom devices; Garmin Connect compatibility; hardware not included."
      },
      {
        "url": "https://www.labfront.com/collect/physiological-data",
        "checked": "2026-10-17",
        "note": "Data types and sampling rates; CSV export."
      },
      {
        "url": "https://www.labfront.com/research/data-storage",
        "checked": "2026-10-17",
        "note": "U.S. hosting in Virginia, retention and deletion."
      },
      {
        "url": "https://www.labfront.com/research/data-management",
        "checked": "2026-10-17",
        "note": "Developer access in beta."
      },
      {
        "url": "https://www.labfront.com/pricing",
        "checked": "2026-10-17",
        "note": "Annual billing and the Tester plan."
      },
      {
        "url": "https://www.empatica.com/platform/research-studies",
        "checked": "2026-10-17",
        "note": "Devices, clearances, data flow, data download, no SDK, bundles and academic discount."
      },
      {
        "url": "https://www.empatica.com/cloud-api",
        "checked": "2026-10-17",
        "note": "Cloud API for sponsors and CROs, Avro and CSV files in S3."
      },
      {
        "url": "https://theactigraph.com/",
        "checked": "2026-10-17",
        "note": "Redirects to ametris.com."
      },
      {
        "url": "https://ametris.com/about-us",
        "checked": "2026-10-17",
        "note": "Formerly ActiGraph, founded 2004, joined Signant Health in 2026."
      },
      {
        "url": "https://ametris.com/centrepoint",
        "checked": "2026-10-17",
        "note": "Raw sensor data, CentrePoint API, compatible devices."
      },
      {
        "url": "https://ametris.com/wearable-devices",
        "checked": "2026-10-17",
        "note": "Device list and per-order pricing."
      },
      {
        "url": "https://ametris.com/actigraph-leap",
        "checked": "2026-10-17",
        "note": "LEAP 510(k) clearance scope."
      }
    ]
  },
  {
    "slug": "wearable-data-to-ehr-fhir",
    "primaryQuery": "send wearable data to an ehr with fhir observation",
    "h1": "Getting Wearable Data into Health Records with FHIR Observation",
    "metaTitle": "Wearable Data to EHRs: FHIR Observation and Vital Signs",
    "metaDescription": "What FHIR R4 requires for wearable readings in a health record: Observation's required elements and the Vital Signs profile's LOINC codes and UCUM units.",
    "updated": "2026-10-17",
    "answer": "In FHIR R4 a wearable reading goes into an Observation resource, which must carry a status and a code, and HL7's specification says implementations that record vital signs as structured data SHALL conform to the FHIR Vital Signs profile. That profile requires a status, a 'vital-signs' category, a LOINC code for what was measured, a patient, a time, and a numeric value with a UCUM unit, or a reason when there is no value. Heart rate, for example, is LOINC 8867-4 in /min, and blood pressure is one panel observation, LOINC 85354-9, with systolic and diastolic components. HL7's R4 pages note that FHIR 5.0.0 supersedes R4, so confirm the version and profiles the receiving system expects.",
    "body": "If a provider or health system wants wearable readings in its record and accepts FHIR, each reading becomes an Observation resource. This page covers what the FHIR R4 specification itself requires of that resource and of its Vital Signs profile, read from HL7's [Observation](https://hl7.org/fhir/R4/observation.html) and [Vital Signs profile](https://hl7.org/fhir/R4/observation-vitalsigns.html) pages on October 17, 2026. R4 is version 4.0.1, a \"Mixed Normative and STU\" release, and HL7's R4 pages say \"The current version which supercedes this version is 5.0.0\", so ask the receiving system which version and which profiles it accepts.\n\n## Why Observation\n\nHL7 defines Observation as \"Measurements and simple assertions made about a patient, device or other subject.\" Its listed uses include \"Vital signs such as body weight, blood pressure, and temperature\" and \"Device measurements such as EKG data or Pulse Oximetry data\". The Vital Signs profile names the wearable case directly: a single vocabulary is needed \"Particularly with the use of wearables by patients where they want to/need to share information from those devices.\"\n\nIn R4 the Observation resource is \"Normative (from v4.0.0)\", while the Vital Signs profile page gives its standards status as Informative.\n\n## What every Observation must carry\n\nHL7 notes that \"At its simplest, a resource instance can consist of only a code and a value, and status flag.\" In R4's element table, status and code are the two mandatory elements:\n\n| Element | Cardinality | What it holds |\n| --- | --- | --- |\n| status | 1..1 | registered, preliminary, final, amended and further codes, from a required code list |\n| code | 1..1 | What was measured; LOINC is the example binding |\n| subject | 0..1 | A Patient, Group, Device or Location |\n| effective[x] | 0..1 | The clinically relevant time or period, as a dateTime, Period, Timing or instant |\n| issued | 0..1 | When this version was made available |\n| value[x] | 0..1 | The result, as a Quantity, CodeableConcept, string, boolean, integer, Range, Ratio, SampledData, time, dateTime or Period |\n| dataAbsentReason | 0..1 | Why the result is missing |\n| device | 0..1 | The measuring Device or DeviceMetric |\n| component | 0..* | Results read together, such as systolic and diastolic pressure |\n| derivedFrom and hasMember | 0..* | The observations a value was made from, or the members a panel groups |\n\nTwo rules apply to every Observation. Rule obs-6 says \"dataAbsentReason SHALL only be present if Observation.value[x] is not present\", and rule obs-7 says that if Observation.code matches a component's code, the value for that code \"SHALL NOT be present\".\n\nFor timing, effectiveDateTime or effectivePeriod \"is the time that the observation is most relevant as an observation of the subject\", which for a person is \"the physiologically relevant time of the observation\"; for an observation obtained directly from the subject, such as blood pressure, it is the start and end of the observation process. In our reading, that is when the watch or cuff measured, not when your server received the reading; issued is the element for when a version was made available.\n\n## The Vital Signs profile\n\nThe Observation page says that if implementations use the resource to express the profile's concepts as structured data, \"they SHALL conform to the following profiles\", naming Vital signs. The profile page puts it this way: \"When a FHIR implementation supports any of the vital signs listed below, the implementation SHALL conform to this profile for the vital sign observation.\" Each vital-signs Observation must have:\n\n- a status;\n- a category code of 'vital-signs';\n- a LOINC code for what is measured, which the profile calls the \"magic value\";\n- a patient;\n- a time indicating when the measurement was taken;\n- a numeric result value with a standard UCUM unit or, when there is no numeric result, a reason.\n\nThe profile's minimum set of codes and units:\n\n| Vital sign | LOINC code | UCUM unit |\n| --- | --- | --- |\n| Vital signs panel | 85353-1 | none; member observations linked with hasMember |\n| Respiratory rate | 9279-1 | /min |\n| Heart rate | 8867-4 | /min |\n| Oxygen saturation | 2708-6 | % |\n| Body temperature | 8310-5 | Cel or [degF] |\n| Body height | 8302-2 | cm or [in_i] |\n| Head circumference | 9843-4 | cm or [in_i] |\n| Body weight | 29463-7 | g, kg or [lb_av] |\n| Body mass index | 39156-5 | kg/m2 |\n| Blood pressure panel | 85354-9 | none; systolic and diastolic go in components |\n| Systolic blood pressure | 8480-6 | mm[Hg] |\n| Diastolic blood pressure | 8462-4 | mm[Hg] |\n\nFor blood pressure, \"you must have both a systolic and a diastolic component, though one or both may have dataAbsentReason instead of a value.\" The bindings are extensible: if you also record a more specific code, \"implementers must support both the values (LOINC) listed below and the translated code\". The table is a floor, and the profile says \"The table above is the minimum set, additional vital signs are allowed.\"\n\n## How a server is searched\n\nThe profile's quick start lists searches servers must support: a patient's vital signs by category, by category and date, and by one or more of the LOINC codes, for example `GET [base]/Observation?patient=[id]&category=vital-signs`. Blood pressure has a trap: the code parameter \"searches only Observation.code\", so searching for the systolic or diastolic component code \"will not return the resource\", and the profile points to the combo-code search parameter to search both. The profile also has the server ensure \"that every API request includes a valid Authorization token\" and reject unauthorized requests \"by returning an HTTP 401 Unauthorized response code\".\n\n## Mapping a wearable reading (our worked example)\n\n| From the wearable | Into the Observation | Spec basis |\n| --- | --- | --- |\n| The metric type, such as heart rate | code with LOINC 8867-4 | Vital Signs code table |\n| The number and its unit | valueQuantity with the UCUM unit /min | Vital Signs mandatory elements |\n| When the device measured | effectiveDateTime, or effectivePeriod for an interval | Observation timing note |\n| When your system made it available | issued | Observation element table |\n| The user | subject, a Patient | Vital Signs mandatory elements |\n| The watch or sensor | device, a Device or DeviceMetric | Observation element table |\n| A missed reading | dataAbsentReason, with no value | Rule obs-6 and the profile's reason rule |\n| A waveform, such as ECG samples | valueSampledData | Observation value types |\n| A metric computed from other readings | derivedFrom, pointing at the source observations | Observation grouping notes |\n\nA heart-rate reading's code and value, in the shape HL7's own examples use for LOINC codes and UCUM quantities:\n\n```json\n\"code\": {\n  \"coding\": [{ \"system\": \"http://loinc.org\", \"code\": \"8867-4\" }]\n},\n\"valueQuantity\": {\n  \"value\": 72,\n  \"unit\": \"/min\",\n  \"system\": \"http://unitsofmeasure.org\",\n  \"code\": \"/min\"\n}\n```\n\nThe full resource also needs its status, the vital-signs category, the patient and the time.\n\nMetrics outside the vital-signs table, such as step counts, are still Observations, but R4 binds Observation.code to LOINC only as an example, so the receiving system's own profile decides which code it expects. HL7's grouping notes add that \"Profiling will normally be necessary for implementation.\" HL7 also publishes a Personal Health Device FHIR implementation guide, version 2.0.0 (STU 2), based on R4; we have not reviewed its contents.\n\n## Before you build (our recommendation)\n\n- **Ask for the contract.** Find out which FHIR version the receiving system accepts and which Observation profiles it enforces; the base resource and the Vital Signs profile are the floor, not the whole agreement.\n- **Keep independent readings separate.** HL7 says a body mass index Observation \"should not contain components for height and weight because they are clinically relevant observations on their own\", and asks for separate Observations linked with derivedFrom instead.\n- **Keep your raw data apart from the FHIR projection,** so a profile change means re-mapping rather than re-collecting; see [normalizing wearable data across providers](/architecture/normalize-wearable-data).\n- **Expect HIPAA when you send data for a provider.** The FTC's health-app tool says a developer operating an app on behalf of a HIPAA covered entity likely is a business associate; see [does my fitness app need HIPAA](/compliance/hipaa-compliance-fitness-app). For the opposite direction, reading clinical records on the phone, see [HealthKit clinical records](/data/clinical-records-api) and [Health Connect medical records](/data/health-connect-medical-records-api).",
    "faqs": [
      {
        "q": "Which FHIR resource carries readings from a wearable?",
        "a": "Observation. HL7 defines it as measurements and simple assertions made about a patient, device or other subject, lists device measurements such as EKG and pulse oximetry data among its uses, and its Vital Signs profile names patients sharing data from wearables as a reason a common vocabulary is needed. In R4, status and code are the only mandatory elements."
      },
      {
        "q": "What LOINC code and unit does FHIR use for heart rate?",
        "a": "The R4 Vital Signs profile uses LOINC 8867-4 with the UCUM unit /min. The profile adds that 8887-2, heart rate device type, may be included as an additional observation. The Observation also needs a status, the vital-signs category, the patient and the time the measurement was taken."
      },
      {
        "q": "How does FHIR represent a home blood pressure reading?",
        "a": "As one blood pressure panel Observation, LOINC 85354-9, with no top-level value and systolic (8480-6) and diastolic (8462-4) components in mm[Hg]. The profile requires both components, though either may carry a dataAbsentReason instead of a value. A search by the component codes alone will not return it; the profile points to the combo-code parameter."
      },
      {
        "q": "How should a missing wearable reading be sent in FHIR?",
        "a": "Leave the value out and fill dataAbsentReason. Rule obs-6 says dataAbsentReason SHALL only be present when Observation.value[x] is not present, and the Vital Signs profile says that if there is no numeric result you have to supply a reason. When the reading failed with an error, HL7's Observation notes say to use dataAbsentReason with the value error or NaN."
      },
      {
        "q": "Should a wearable integration send FHIR R4 or R5?",
        "a": "Whichever the receiving system accepts. HL7's R4 pages say the current version, 5.0.0, supersedes R4, while R4 stays at its permanent address. The Observation resource and the Vital Signs profile described here are R4's, so confirm the version and any further profiles with the system you send to before you build."
      }
    ],
    "related": [
      {
        "href": "/compliance/remote-patient-monitoring-device-requirements",
        "label": "Remote patient monitoring device requirements"
      },
      {
        "href": "/data/clinical-records-api",
        "label": "HealthKit clinical records (FHIR)"
      },
      {
        "href": "/data/health-connect-medical-records-api",
        "label": "Health Connect medical records (FHIR)"
      },
      {
        "href": "/architecture/normalize-wearable-data",
        "label": "Normalizing wearable data across providers"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness and wearable APIs"
      }
    ],
    "cta": {
      "pitch": "FHIR versions and the profiles health systems enforce keep moving. Subscribe and we'll flag changes that affect how wearable data reaches a health record."
    },
    "sources": [
      {
        "url": "https://hl7.org/fhir/R4/observation.html",
        "checked": "2026-10-17",
        "note": "R4 version and status, scope and uses, element table, rules obs-6 and obs-7, timing, value types, grouping, LOINC and UCUM examples."
      },
      {
        "url": "https://hl7.org/fhir/R4/observation-vitalsigns.html",
        "checked": "2026-10-17",
        "note": "The wearables rationale, conformance statement, mandatory elements, code and unit table, blood pressure rule, search requirements, Informative status."
      },
      {
        "url": "https://hl7.org/fhir/uv/phd/",
        "checked": "2026-10-17",
        "note": "Personal Health Device FHIR IG version 2.0.0 (STU 2) on R4."
      },
      {
        "url": "https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool",
        "checked": "2026-10-17",
        "note": "Developer acting on behalf of a covered entity likely a business associate."
      }
    ]
  },
  {
    "slug": "gym-management-software-apis",
    "primaryQuery": "gym management software API",
    "h1": "Gym and Studio Management Software APIs (2026)",
    "metaTitle": "Gym Management Software & Studio Booking APIs (2026)",
    "metaDescription": "Which gym and studio software has a developer API: Mindbody, TeamUp, Mariana Tek, Wodify and ABC Glofox compared on access, auth, limits and API pricing.",
    "updated": "2026-10-17",
    "answer": "As of October 17, 2026, Mindbody, TeamUp, Mariana Tek, Wodify and ABC Glofox publish developer API documentation we could read, and they differ most in who hands out credentials: a TeamUp business creates its own API Application, a Wodify gym gets its key from Wodify Core, Mindbody and Mariana Tek approve developers before each studio opts in, and ABC Fitness runs a partner program. Only Mindbody publishes a per-call API price, a third of a cent per call beyond 1,000 a day in its developer FAQ, while TeamUp says API access carries no extra fee. A studio's existing platform decides which API you must use, so start from the platforms your customers already run.",
    "body": "If you are building a class booking app, a member portal, a payroll or marketing tool, or anything else that has to read and write a gym's members, classes and sales, the API you need is the one in the studio's management software. This page maps which of the platforms we checked on October 17, 2026 publish a developer API, how you get access, how requests authenticate, what the limits and prices are, and which push changes to you.\n\nEverything below comes from each vendor's own pages, read on that date. Several vendors run their developer portals as JavaScript applications that returned no readable text to our fetch, and where that hid a fact we say so rather than fill the gap.\n\n## The short answer, platform by platform\n\n| Platform | Developer docs we could read | Who issues credentials | Authentication | API price published | Webhooks |\n|---|---|---|---|---|---|\n| Mindbody | Webhooks API docs, FAQ, endpoints list, terms, release notes | Self-serve developer account, then Mindbody approves going live and each business activates you | API key in an `API-Key` header, server-side only | Yes: 1,000 calls a day, then a third of a cent per call | Yes, signed with HMAC-SHA-256 |\n| TeamUp | REST API v2 guides, reference, FAQ and terms | The business's super admin creates an API Application | OAuth, M2M tokens, or Direct Authentication after review | No extra fee for API access | Yes, per its getting-started guide |\n| Mariana Tek | Developer guides and a Customer API OpenAPI document | Mariana Tek's Integrations team, with technical review before going live | OAuth 2.0 (with PKCE for public clients) or an API key, as bearer tokens | Not in the guides we read | Yes, enabled on request |\n| Wodify | Getting started, authentication, rate limits, API reference | The gym (Web Integrations in Wodify Core) or, for partners, the Wodify Developer Portal | API key in an `x-api-key` header | Not published; quota of 500,000 requests a month | Not listed in its docs navigation |\n| ABC Glofox | API reference, version 2.3.0 | A \"Request access\" entry in its API portal, process not readable | Branch ID, API key and API token headers, server-side only | Not on the pages we read | Yes, events listed in the reference |\n| ABC Fitness partner program | Partner FAQ; developer portal not readable | Partner registration and review | Not readable | Tiers and terms discussed during onboarding | Not readable |\n| ABC Trainerize | API help article refused our fetch | Eligible Studio and Enterprise customers | Not readable | API access tied to Studio and Enterprise plans | Not readable |\n| ClubReady | Machine-generated operation list | Not documented on pages we could read | An `ApiKey` parameter on each operation | Not published | Not readable |\n| Zen Planner, PushPress, Virtuagym, Exercise.com, Sportivity | No public API reference found | | | | |\n\nOur integration guides go deeper on the five with readable documentation: [Mindbody](/integrate/mindbody-api), [TeamUp](/integrate/teamup-api), [Mariana Tek](/integrate/mariana-tek-api), [Wodify](/integrate/wodify-api) and [ABC Glofox](/integrate/glofox-api). Mindbody's per-call price has its own page: [Mindbody API pricing](/pricing/mindbody-api-pricing).\n\n## Three ways studio platforms hand out API access\n\nThe biggest difference between these APIs is not the endpoints. It is who decides that you may call them.\n\n**The business switches it on.** TeamUp lets a staff member with the super admin permission create an API Application directly in the business dashboard, and its FAQ says free trial accounts can do it too. Wodify's documentation tells a gym where its API key lives in Wodify Core, and its API reference says to request one through the Web Integrations screen. For a developer working for one studio, this is the fastest route: the studio can grant access the same day.\n\n**The platform approves you, then each studio opts in.** Mindbody's steps are a developer account, a request to go live, Mindbody's approval, and then an activation link or code from each business. Mariana Tek registers applications through its Integrations team, has you build against a sandbox tenant, and says a technical review before going live with a studio can take up to 1-3 weeks; production webhooks also need the studio owner's approval by email.\n\n**A partner program.** ABC Fitness, whose site lists ABC Ignite, ABC Trainerize, ABC Glofox and ABC Evo, runs a partner program for app partners and solution providers. Its FAQ says you register at partners.abcfitness.com and ABC reviews the request, and that you qualify if you are an ABC customer with your own in-house developer, or a vendor supporting an integration for a mutual customer, able to meet ABC's infosec and data privacy policies. The program has several tiers, with terms discussed during evaluation and onboarding. ABC describes this as its \"open API platform\"; its developer portal returned only an error message to our fetch, so we could not read the API itself.\n\nIn our experience, the approval routes take weeks, not days, and they decide your launch date more than any endpoint does. If your product depends on Mindbody or Mariana Tek, start the approval while you build.\n\n## Authentication at a glance\n\nEvery platform here expects its credentials to stay on your server:\n\n- **Header API keys.** Mindbody uses an `API-Key` header plus a required `User-Agent`, and says all requests must come from your back-end servers because keys cannot be safely stored on mobile devices or websites. Wodify uses an `x-api-key` header. ABC Glofox sends three headers, `x-glofox-branch-id`, `x-api-key` and `x-glofox-api-token`, and says to always proxy them through a secure backend.\n- **OAuth.** TeamUp recommends OAuth when your app acts for a customer or staff member, offers machine-to-machine tokens when it acts for the business, and says it does not support static API keys. Mariana Tek runs the OAuth 2.0 Authorization Code flow on each studio's own subdomain, with PKCE for single-page and mobile apps, and also issues API keys tied to a service account.\n- **Query-string keys.** ClubReady's operation metadata lists an `ApiKey` parameter described as the key that \"grants access to resources\", alongside a `StoreId`.\n\nIf your users log in to book classes, OAuth is the route on TeamUp and Mariana Tek; on the API-key platforms, your server holds the key and enforces who may do what. The [OAuth explainer](/learn/what-is-oauth-for-health-data) covers the difference.\n\n## Limits, and what API access costs\n\n| Platform | Published limit | Published API price |\n|---|---|---|\n| Mindbody | Daily call limits set per developer when you receive your API key; its FAQ cites 1,000 calls a day | One third of a cent per call beyond 1,000 a day; sandbox free, also limited to 1,000 calls a day |\n| TeamUp | 250 requests per minute per caller, unless an endpoint says otherwise | No extra fee for API access, and no paid plan needed to build |\n| Wodify | 5 requests per second, bursts of 20, 500,000 requests per month | Not published |\n| ABC Glofox | HTTP 429 when you exceed the rate limit; the number is not in the sections we read | Not on the pages we read |\n| Mariana Tek | Not in the guides we read | Not in the guides we read |\n| ABC Fitness partner program | Not readable | Several tiers, with terms discussed during onboarding |\n| ABC Trainerize | Not readable | API access for eligible Studio and Enterprise customers |\n\nMindbody is the only platform we checked that prints a per-call price, and the FAQ that prints it still describes the API as SOAP and XML web services, so confirm the current fee schedule before you budget. Its API Terms of Use add that fees are billed monthly, starting 30 days after you first receive access to a business's data. The details are on [Mindbody API pricing](/pricing/mindbody-api-pricing).\n\nNone of these figures is the studio's own subscription to the platform. That is a separate bill the studio pays, which we have not reviewed.\n\n## Webhooks: which platforms push changes\n\n- **Mindbody** pushes events for bookings, clients, memberships, contracts, sales, staff and more, signed with an `X-Mindbody-Signature` header. It retries every 15 minutes for up to 3 hours, and recommends re-syncing cached data through the Public API every 24 hours.\n- **Mariana Tek** posts events such as a new account, a reservation or a class check-in, after you request a subscription from its Integrations team.\n- **ABC Glofox** lists webhook events for bookings, members, memberships, invoices and more in its API reference.\n- **TeamUp** lists receiving event notifications with webhooks as a next step in its getting-started guide; we did not read its webhook pages.\n- **Wodify**'s documentation navigation does not mention webhooks, so plan to poll within its monthly quota.\n\nWhichever you integrate, process events idempotently and keep a scheduled re-sync. [Ingesting webhooks reliably](/architecture/webhook-ingestion) covers the pattern.\n\n## The rest of the market\n\n- **ABC Trainerize.** Trainerize's own summary lists \"API access for eligible Studio and Enterprise customers\" and workflow automation through Zapier. Its help-center article on the API and webhooks refused our fetch, so we could not read the details.\n- **ClubReady.** ClubReady serves a machine-generated list of operations, such as class bookings, check-ins and class schedules, with JSON, XML, JSV and CSV formats. Its class-schedule operation, for example, covers at most 7 days per request. How a developer obtains a key is not on any page we could read, and ClubReady's main site answered our fetch with an error.\n- **Zen Planner.** Its integrations page says Zen Planner's \"flexible API\" lets businesses build custom integrations or connect proprietary tools, and lists Zapier among its integrations. We found no public API reference.\n- **PushPress.** Its integrations page says integration partners are \"curated by actual gym owners\" rather than opened to thousands of integrations, and lists Zapier for syncing data with other systems. We found no public API reference.\n- **Exercise.com.** Its custom development page offers custom integrations built by its team and Zapier consulting. We found no public API reference.\n- **Virtuagym and Sportivity.** We found no current public API reference for either, and Sportivity's site returned no readable text to our fetch.\n\n\"No public reference found\" means only that: some of these vendors may share documentation with customers or partners privately. Ask the vendor before you rule it out.\n\n## How to choose\n\nOur recommendation, in order:\n\n1. **Start from your customers' platforms.** A studio rarely switches management software to suit an integration, so the platforms your customers already run decide which APIs you need.\n2. **Begin access work on day one.** Self-serve platforms take a day; approval and review routes take weeks.\n3. **Check that the booking flow you need exists.** Mindbody lists class registration and appointment booking, TeamUp's OAuth use cases include a customer website where users book spots, Mariana Tek's Customer API is built for custom booking and buying experiences, Glofox documents booking endpoints, and Wodify documents class reservations.\n4. **Design for push plus re-sync, within the terms.** Mindbody's API Terms of Use, for example, prohibit caching its data for more than 48 hours, so a long-term copy of a studio's data may not be yours to keep.\n\nFor the general build-versus-buy question across fitness APIs, see [fitness API vs building your own](/fitness-apis/fitness-api-vs-build-your-own), and for every other category, the [fitness API guide](/fitness-apis).",
    "faqs": [
      {
        "q": "Which gym and studio management platforms have a public developer API?",
        "a": "On October 17, 2026 we could read developer API documentation from Mindbody, TeamUp, Mariana Tek, Wodify and ABC Glofox. ABC Fitness runs a partner program whose developer portal we could not read, ABC Trainerize offers API access to eligible Studio and Enterprise customers, and ClubReady publishes a machine-generated list of operations. We found no public API reference for Zen Planner, PushPress, Virtuagym, Exercise.com or Sportivity."
      },
      {
        "q": "Do gym management software APIs charge for API access?",
        "a": "Mostly they publish no price. Mindbody is the exception: as of October 17, 2026 its developer FAQ says calls beyond 1,000 a day cost one third of a cent each, with a free sandbox limited to 1,000 calls a day. TeamUp's FAQ says there is no extra fee for API access, ABC Fitness discusses partner tiers and terms during onboarding, and ABC Trainerize ties API access to its Studio and Enterprise plans."
      },
      {
        "q": "Can I build a class booking app on top of a studio's management software?",
        "a": "Yes, on the platforms that document booking. Mindbody lists class registration and appointment booking, TeamUp's OAuth use cases include a customer website where users book spots, Mariana Tek's Customer API is built for custom booking and buying experiences, ABC Glofox documents booking endpoints, and Wodify documents class reservations. Each studio still has to grant access, and Mindbody and Mariana Tek approve developers first."
      },
      {
        "q": "Is there a sandbox for testing gym and studio software APIs?",
        "a": "It depends on the platform. Mindbody's FAQ says sandbox testing is free but limited to 1,000 calls a day, and Mariana Tek gives developers a sandbox tenant seeded with sample data. TeamUp has no separate sandbox and suggests using a free trial account as a test business."
      },
      {
        "q": "How do I get API access to ABC Fitness products like Glofox or Trainerize?",
        "a": "ABC Fitness runs a partner program: its FAQ says to register at partners.abcfitness.com, open to ABC customers with their own in-house developer and to vendors supporting an integration for a mutual customer who can meet ABC's infosec and data privacy policies. ABC Glofox's API portal has its own Request access entry, and ABC Trainerize lists API access for eligible Studio and Enterprise customers."
      }
    ],
    "related": [
      {
        "href": "/integrate/mindbody-api",
        "label": "Integrate the Mindbody API"
      },
      {
        "href": "/integrate/teamup-api",
        "label": "Integrate the TeamUp API"
      },
      {
        "href": "/integrate/mariana-tek-api",
        "label": "Integrate the Mariana Tek API"
      },
      {
        "href": "/pricing/mindbody-api-pricing",
        "label": "Mindbody API pricing"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness and wearable APIs"
      }
    ],
    "cta": {
      "pitch": "We track the access rules, limits and prices of gym and studio software APIs from the vendors' own pages. Subscribe to hear when one of them changes."
    },
    "sources": [
      {
        "url": "https://developers.mindbodyonline.com/WebhooksDocumentation",
        "checked": "2026-10-17",
        "note": "Mindbody access steps, API-Key and User-Agent headers, server-side requests, webhook signing, retries and re-sync."
      },
      {
        "url": "https://developers.mindbodyonline.com/resources/faqs",
        "checked": "2026-10-17",
        "note": "Mindbody API price and sandbox limit, activation link or code, SOAP and XML description."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/Endpoints",
        "checked": "2026-10-17",
        "note": "Mindbody class registration and appointment booking."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/DeveloperAgreement",
        "checked": "2026-10-17",
        "note": "Mindbody billing start, call limits and the 48-hour caching restriction."
      },
      {
        "url": "https://docs.goteamup.com/support/faq",
        "checked": "2026-10-17",
        "note": "TeamUp: who creates API Applications, no extra fee, no sandbox."
      },
      {
        "url": "https://docs.goteamup.com/guides/getting-started",
        "checked": "2026-10-17",
        "note": "TeamUp REST API v2, authentication methods and webhooks next step."
      },
      {
        "url": "https://docs.goteamup.com/api-reference/rate-limits",
        "checked": "2026-10-17",
        "note": "TeamUp 250 requests per minute per caller."
      },
      {
        "url": "https://docs.goteamup.com/llms.txt",
        "checked": "2026-10-17",
        "note": "TeamUp authentication page: OAuth use cases, M2M tokens, no static API keys."
      },
      {
        "url": "https://guides.marianatek.com/credentials",
        "checked": "2026-10-17",
        "note": "Mariana Tek credentials through Integrations: OAuth or API keys."
      },
      {
        "url": "https://guides.marianatek.com/integration-review",
        "checked": "2026-10-17",
        "note": "Mariana Tek technical review and its 1-3 week timeframe."
      },
      {
        "url": "https://guides.marianatek.com/faqs",
        "checked": "2026-10-17",
        "note": "Mariana Tek sandbox tenants and webhook setup with studio owner approval."
      },
      {
        "url": "https://guides.marianatek.com/auth",
        "checked": "2026-10-17",
        "note": "Mariana Tek OAuth on the studio's subdomain, with PKCE."
      },
      {
        "url": "https://guides.marianatek.com/webhooks",
        "checked": "2026-10-17",
        "note": "Mariana Tek webhook events."
      },
      {
        "url": "https://docs.marianatek.com/api/customer/v1/schema/",
        "checked": "2026-10-17",
        "note": "Mariana Tek Customer API description."
      },
      {
        "url": "https://docs.wodify.com/docs/authentication",
        "checked": "2026-10-17",
        "note": "Wodify x-api-key and where gyms and partners get keys."
      },
      {
        "url": "https://docs.wodify.com/docs/rate-limiting",
        "checked": "2026-10-17",
        "note": "Wodify rate, burst and monthly quota."
      },
      {
        "url": "https://docs.wodify.com/docs/getting-started",
        "checked": "2026-10-17",
        "note": "Wodify documentation navigation and API categories."
      },
      {
        "url": "https://docs.wodify.com/reference/get_dropin",
        "checked": "2026-10-17",
        "note": "Wodify Web Integrations screen and the reference's section list."
      },
      {
        "url": "https://api-portal.glofox.com/api-portal/glofox/api/openapi-reference.html",
        "checked": "2026-10-17",
        "note": "ABC Glofox API reference 2.3.0: headers, server-side proxying, 429, webhook events, booking endpoints, Request access."
      },
      {
        "url": "https://abcfitness.com/partners/",
        "checked": "2026-10-17",
        "note": "ABC Fitness partner program FAQ: registration, requirements, tiers, open API platform."
      },
      {
        "url": "https://abcfitness.com/",
        "checked": "2026-10-17",
        "note": "ABC Fitness lists ABC Ignite, ABC Trainerize, ABC Glofox and ABC Evo."
      },
      {
        "url": "https://developers.abcfitness.com/",
        "checked": "2026-10-17",
        "note": "Returned only an error message to our fetch."
      },
      {
        "url": "https://www.trainerize.com/llm-info/",
        "checked": "2026-10-17",
        "note": "ABC Trainerize API access for eligible Studio and Enterprise customers; Zapier."
      },
      {
        "url": "https://www.clubready.com/api/current/metadata",
        "checked": "2026-10-17",
        "note": "ClubReady operation list and formats."
      },
      {
        "url": "https://www.clubready.com/api/current/json/metadata?op=GetClassScheduleRequest",
        "checked": "2026-10-17",
        "note": "ClubReady ApiKey and StoreId parameters and the 7-day schedule window."
      },
      {
        "url": "https://www.zenplanner.com/integrations",
        "checked": "2026-10-17",
        "note": "Zen Planner's flexible API claim and Zapier."
      },
      {
        "url": "https://www.pushpress.com/integrations",
        "checked": "2026-10-17",
        "note": "PushPress curated integrations and Zapier."
      },
      {
        "url": "https://www.exercise.com/platform/custom-dev/",
        "checked": "2026-10-17",
        "note": "Exercise.com custom integrations and Zapier consulting."
      }
    ]
  },
  {
    "slug": "smart-ring-apis",
    "primaryQuery": "smart ring api",
    "h1": "Smart Ring APIs: Which Rings Give Developers Access (2026)",
    "metaTitle": "Smart Ring APIs (2026): Which Rings Let Developers In",
    "metaDescription": "Oura, Ultrahuman, Galaxy Ring and RingConn compared for developers: cloud API or SDK, how users consent, approval gates, limits and what users must pay.",
    "updated": "2026-10-17",
    "answer": "Of the four smart rings compared here, two have documented cloud APIs. Oura's API V2 uses OAuth 2.0 and webhooks, is free for personal and commercial apps by Oura's own account, limits new apps to 10 users until Oura approves them, and returns 403 when a user's membership has expired. Ultrahuman's UltraSignal API uses personal API tokens, with other users opting in by entering your sharing code in the Ultrahuman app. Samsung's Galaxy Ring data reaches developers only through the Samsung Health Data SDK on Android. We found no developer API for RingConn.",
    "body": "Smart rings measure much the same things (sleep, heart rate, HRV, temperature, activity), but the way a developer gets at that data differs completely from ring to ring. This roundup covers four rings: Oura, Ultrahuman, Samsung's Galaxy Ring and RingConn, from each maker's own developer pages as read on October 17, 2026. Two have a documented cloud API, one reaches developers only through the phone's health app, and for one we found no developer access at all.\n\n## What to look for in a smart ring API\n\n- **Cloud API or on-device SDK.** A cloud API lets your server pull data for many users; an on-device SDK means your Android or iOS app reads the data on the user's phone.\n- **How users consent.** OAuth with per-scope consent, a code the user types into the ring's app, or OS-level permissions each shape your onboarding.\n- **Approval and user limits.** Some APIs cap how many users a new app can connect until the vendor approves it.\n- **What the user must pay.** A ring membership on the user's side can decide whether your API calls succeed at all.\n- **Limits and push.** Rate limits, date-range limits and webhooks decide how you sync.\n\n## The comparison\n\n| Ring | Developer access | How users connect | Gate and limits | Developer cost |\n|---|---|---|---|---|\n| Oura | Cloud REST API V2, with webhooks | OAuth 2.0, PKCE recommended | 10 users until Oura approves the app; 5,000 requests per 5 minutes | Free for personal and commercial apps, per Oura's FAQ; users need an active membership |\n| Ultrahuman | UltraSignal API, a cloud REST API | A personal API token for your own data; other users enter your data-sharing code in the Ultrahuman app | Date ranges of up to 7 days per request | Not stated on the public docs |\n| Samsung Galaxy Ring | Samsung Health Data SDK, an Android library | Per-data-type permissions in Samsung Health | A partnership request before release | Not stated on Samsung's pages |\n| RingConn | None found on RingConn's site | Not applicable | Not applicable | Not applicable |\n\n## Oura: the most complete ring API\n\nOura's API V2 is, in Oura's words, \"the only available integration point for Oura data\". Users authorize your app over OAuth 2.0 with per-data-type consent, and Oura's documentation marks PKCE as recommended. It covers daily sleep, readiness and activity summaries, sleep periods, 5-minute heart rate, SpO2 for Gen 3 rings, stress, resilience, cardiovascular age, VO2 max, workouts, sessions and tags, and Oura calls webhooks \"the preferred way to consume Oura data\".\n\nTwo gates matter. A new API application is limited to 10 users until Oura approves it, with no limit after approval. And Oura's API returns 403 when a user's Oura subscription has expired, so your users need an active membership, which Oura lists at $5.99 USD a month before tax in the US. The API itself is free: Oura's FAQ says it is free to use for both personal and commercial applications. The full walkthrough is in the [Oura API integration guide](/integrate/oura-api), and the costs are broken down in [Oura API pricing](/pricing/oura-api-pricing).\n\n## Ultrahuman: a token-based cloud API\n\nUltrahuman documents the **UltraSignal API** for \"health and fitness metrics collected by Ultrahuman devices\". Its public documentation describes a daily metrics endpoint at `https://partner.ultrahuman.com/api/v1/partner/daily_metrics` that takes either a single `date` or a `start_epoch` and `end_epoch` range of up to 7 days.\n\nAccess works differently from OAuth. You create a personal API token in Ultrahuman's developer portal; with it alone you can read your own account. To read another user's data you pass their email address, and that user must authorize you in the Ultrahuman app by entering the data-sharing code you give them under Profile, Settings, Partner ID. Ultrahuman warns that anyone with the token can use the API as you, so keep it on your server.\n\nThe metrics list is long: heart rate, skin temperature, HRV, steps, sleep stages and scores, recovery, VO2 max, SpO2, and glucose metrics such as average glucose and time in target. The public docs also have tabs for OAuth and MCP documentation, but Ultrahuman shows the OAuth app setup only after you log in, so we cannot describe it here.\n\n## Samsung Galaxy Ring: through Samsung Health on Android\n\nOn Samsung's developer pages, Galaxy Ring data reaches developers through Samsung Health. Samsung says the ring, like the Galaxy Watch, automatically transfers its data to the paired phone's Samsung Health app, and the **Samsung Health Data SDK** lets an Android app read selected data from Samsung Health's data store. Each data point names its source device, so you can tell ring data from watch or phone data.\n\nThat makes Galaxy Ring data an on-device, Android-only integration: the user grants per-data-type permissions in Samsung Health, the SDK needs Samsung Health 6.30.2 or later on Android 10 or later, and a released app needs Samsung's partnership approval, which registers its package name and signature. The details are in the [Samsung Health integration guide](/integrate/samsung-health-api).\n\n## RingConn: no developer API found\n\nRingConn's site, as we read it on October 17, 2026, lists its rings, its app features and user manuals, but its pages and footer link no developer API or developer documentation. The sharing feature RingConn describes is for people: \"Share your health data with friends and family anytime, anywhere.\" If RingConn data matters to you, ask RingConn directly; we found nothing a developer can integrate.\n\n## Which should you pick?\n\n- **You need ring data from many users, synced to your server:** Oura, through its OAuth API and webhooks, with the 10-user approval step and the user-side membership in your plan.\n- **You want Ultrahuman users:** the UltraSignal API, with its sharing-code consent and 7-day request ranges.\n- **Your users have Galaxy Rings and Android phones:** the Samsung Health Data SDK in your Android app.\n- **You need many rings and other wearables at once:** compare the device APIs in [wearable data APIs](/fitness-apis/wearable-data-apis) before you commit to one ring.",
    "faqs": [
      {
        "q": "Which smart rings have a developer API?",
        "a": "Oura and Ultrahuman document cloud APIs: Oura's API V2 with OAuth 2.0 and webhooks, and Ultrahuman's UltraSignal API with personal tokens. Samsung's pages route Galaxy Ring data through Samsung Health, where an Android app reads it with the Samsung Health Data SDK. RingConn's site, as we read it, offers no developer API."
      },
      {
        "q": "Do smart ring APIs cost money?",
        "a": "Oura's API FAQ says its API is free for both personal and commercial applications, but your users need an active Oura membership, because the API returns 403 when it has expired. Ultrahuman's public API docs and Samsung's SDK pages state no developer fees. Check each vendor's terms before launch."
      },
      {
        "q": "How do developers get Samsung Galaxy Ring data?",
        "a": "Through the phone. Samsung says the Galaxy Ring automatically transfers its data to the paired phone's Samsung Health app, and an Android app reads it with the Samsung Health Data SDK after the user grants per-data-type permissions. A released app needs Samsung's partnership approval first."
      },
      {
        "q": "Does Ultrahuman have an API?",
        "a": "Yes, the UltraSignal API. You create a personal API token in Ultrahuman's developer portal; to read another user's data you pass their email, and the user authorizes you by entering your data-sharing code in the Ultrahuman app. Each request covers one date or a range of up to 7 days."
      },
      {
        "q": "Does RingConn have a developer API?",
        "a": "We found none. RingConn's site, read on October 17, 2026, covers its rings, app features and user manuals, and the sharing feature it describes is for sharing health data with friends and family. Ask RingConn directly if you need its data in your app."
      }
    ],
    "related": [
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/pricing/oura-api-pricing",
        "label": "Oura API pricing"
      },
      {
        "href": "/integrate/samsung-health-api",
        "label": "Integrate Samsung Health"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "All fitness & workout APIs"
      }
    ],
    "cta": {
      "pitch": "We track which wearables open their data to developers and on what terms, from ring APIs to membership rules, so you can plan an integration on facts rather than spec sheets."
    },
    "sources": [
      {
        "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.42.json",
        "checked": "2026-10-17",
        "note": "Oura API V2: only integration point, data types, webhooks, user limit, 403 on expired subscription, FAQ on cost and rate limits"
      },
      {
        "url": "https://cloud.ouraring.com/docs/authentication",
        "checked": "2026-10-17",
        "note": "Oura OAuth 2.0 and PKCE"
      },
      {
        "url": "https://ouraring.com/membership",
        "checked": "2026-10-17",
        "note": "Oura membership price"
      },
      {
        "url": "https://vision.ultrahuman.com/developer-docs",
        "checked": "2026-10-17",
        "note": "UltraSignal API: tokens, sharing codes, endpoint, date ranges, metrics"
      },
      {
        "url": "https://www.ultrahuman.com/us/",
        "checked": "2026-10-17",
        "note": "Ultrahuman Ring"
      },
      {
        "url": "https://developer.samsung.com/health/data/overview.html",
        "checked": "2026-10-17",
        "note": "Galaxy Ring data in Samsung Health and the Data SDK"
      },
      {
        "url": "https://developer.samsung.com/health/data/process.html",
        "checked": "2026-10-17",
        "note": "partnership request before release"
      },
      {
        "url": "https://ringconn.com/pages/app-features",
        "checked": "2026-10-17",
        "note": "RingConn app features and health data sharing"
      }
    ]
  }
];
