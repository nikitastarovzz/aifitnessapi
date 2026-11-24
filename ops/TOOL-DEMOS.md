# Tool demo clips (owner-run)

Short screen recordings of the most shareable tools, for posting on X,
LinkedIn, Bluesky, Reddit, YouTube Shorts, Instagram Reels or TikTok.
`scripts/record-tool-demos.mjs` drives each tool in Playwright's Chromium the
way a reader would and records it. Nothing here runs in CI or on deploy, and
no video is ever committed.

## What it records

Seven demos, each 20–30 seconds, in two formats:

| Demo | Page | What the clip shows |
|---|---|---|
| `pose-benchmark` | `/tools/pose-benchmark` | The synthetic test frame, Run benchmark, the results table |
| `heart-rate-lab` | `/tools/heart-rate-lab` | Replay a synthetic sample, the decoded stream |
| `rep-counter-playground` | `/tools/rep-counter-playground` | The synthetic demo (no model), the trace and the config |
| `aggregator-chooser` | `/tools/aggregator-chooser` | Three requirements ticked, the evidence matrix |
| `keypoint-playground` | `/tools/keypoint-playground` | Two schemes mapped, joints picked on the body |
| `daily` | `/daily` | Today's five questions answered, the result grid |
| `challenge` | `/challenge?ex=pushups&beat=17` | The "Beat 17 push-ups" banner, the camera started, Go |

| Format | File | Size | For |
|---|---|---|---|
| portrait | `<demo>-portrait.mp4` | 1080×1920, from a 540×960 phone viewport | Reels, Shorts, TikTok, Stories |
| landscape | `<demo>-landscape.mp4` | 1920×1080, from a 1280×720 laptop viewport | X, LinkedIn, YouTube, Bluesky |

Playwright records at the viewport's own size, so the page is laid out the
way a phone or a laptop shows it and ffmpeg scales the clip up to the posting
size. A `.webm` at the viewport size sits beside each `.mp4`.

## Run it

```bash
npm run build && npx next start -p 3100     # a production build: no dev-mode badge in the corner
# in a second terminal
node scripts/record-tool-demos.mjs --base http://localhost:3100
```

`npx next dev -p 3100` works too, but its "N" indicator shows in the corner
of every clip.

Options:

- `--only daily,challenge` records some demos; `--list` names them all.
- `--formats portrait` or `--formats landscape` records one format.
- `--out .cache/tool-demos/2026-11-24` writes elsewhere under `.cache/`; the
  script refuses any directory outside `.cache/` (gitignored), so a clip
  cannot land in `public/` or a commit.
- `--fake-video clip.y4m` (or `.mjpeg`) feeds a file to the challenge as the
  camera. Without it Chromium's built-in test pattern is the camera, which no
  pose model finds a person in, so the clip shows the banner, the camera
  starting and the counter waiting. To show reps being counted, record
  yourself doing push-ups side-on for about 20 seconds and convert it:
  `ffmpeg -i pushups.mov -vf scale=640:480,fps=30 -pix_fmt yuv420p pushups.y4m`.
  It is your own footage: only use a clip of someone who agreed to be posted.
- `--no-mp4` skips the ffmpeg step (the `.webm` files are still written).

Needs: Playwright's Chromium (`npx playwright install chromium` if it is
missing) and `ffmpeg` on the PATH for the `.mp4` files. The pose benchmark
and the challenge download the MediaPipe runtime from cdn.jsdelivr.net and
the model from storage.googleapis.com, as the live pages do; where those
hosts are blocked their clips show the page's own error message.

## Check before posting

`.cache/tool-demos/manifest.json` lists every clip with its URL, length and
each step's result. A step that found nothing to click is marked `ok: false`
with the reason, and the clip still records; watch any clip with a failed
step before posting it, and fix the selector in the script if a label moved.
The script exits non-zero when a clip comes out shorter than 20 or longer
than 30 seconds.

Watch every clip end to end before it goes out. The synthetic samples are
labeled as synthetic on the pages; keep that label in frame or say so in the
post.

## Post it

- One clip per post, with the page's link. The `title` in `manifest.json` is
  a starting line for the caption; it restates the page and claims nothing
  the page does not.
- Native upload (not a link to the file) on every network; the `.mp4` files
  are H.264, which all of them accept. X and LinkedIn take the landscape
  clip, Reels, Shorts and TikTok the portrait one.
- The rules for anything we post are the site's: no numbers the page does not
  state, no "best", and if a post mentions KinesteX, say that KinesteX funds
  the site (ops/GEO.md). The pose benchmark and challenge clips show
  MediaPipe running in the browser; they do not show or rank KinesteX.
- Log what went out in `ops/outreach-log.jsonl`, like every other post.
- Delete the clips from `.cache/tool-demos/` when they are posted, or keep
  them there; never move them into the repository.
