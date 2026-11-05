#!/usr/bin/env python3
"""
Writes and runs the /own-your-data analysis notebooks (public/notebooks/*.ipynb).

    python3 scripts/build-notebooks.py          # needs pandas, matplotlib, nbformat, nbclient, ipykernel

ops/AUDIENCE-30-2026-11-05.md item 13. Each notebook is built from the cells
below and then EXECUTED against this site's synthetic samples
(public/samples/apple-health-export-synthetic.zip and
public/notebooks/data/*.csv, written by scripts/build-own-data-samples.mjs),
so the outputs saved in the .ipynb files, and shown on GitHub, are real runs
rather than pasted text. Only pandas and matplotlib are imported, plus the
standard library.

The samples are synthetic and the CSV column names are this site's own, not
any vendor's layout; every notebook says so in its first cell. Run from the
repository root.
"""
import os
import sys

import nbformat
from nbclient import NotebookClient

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "notebooks")
SITE = "https://aifitnessapi.com"

FETCH = '''import os, urllib.request

def local_or_download(path, url):
    """Use the file next to this notebook if it is there (a clone of the repo),
    otherwise download the synthetic sample once (Colab)."""
    if os.path.exists(path):
        return path
    name = os.path.basename(path)
    if not os.path.exists(name):
        urllib.request.urlretrieve(url, name)
    return name
'''

STYLE = '''import matplotlib.pyplot as plt
plt.rcParams.update({"figure.figsize": (10, 3.2), "axes.spines.top": False, "axes.spines.right": False,
                     "axes.grid": True, "grid.alpha": 0.3, "figure.dpi": 72})
'''


def md(s):
    return nbformat.v4.new_markdown_cell(s.strip())


def code(s):
    return nbformat.v4.new_code_cell(s.strip())


def apple():
    return [
        md(f"""
# Apple Health export.zip to pandas

Reads the file the iPhone Health app writes with **Export All Health Data** (Apple's iPhone User Guide: "You can export all of your health and fitness data from Health in XML format"), streams its `Record` and `Workout` elements into pandas DataFrames, and charts three things: daily steps, resting heart rate and nightly sleep.

**The input here is synthetic.** It is `apple-health-export-synthetic.zip` from [{SITE}/own-your-data]({SITE}/own-your-data#notebooks): 120 made-up days from a "Synthetic Watch", a "Synthetic Phone" and a "Synthetic Scale App", generated from a fixed seed. Point `EXPORT` at your own `export.zip` (or the `export.xml` inside it) to run it on your data, which never leaves your machine.

Apple publishes no schema for `export.xml` that we could find, so this notebook reads elements and attributes by the names the file uses (`Record`, `type`, `sourceName`, `unit`, `startDate`, `endDate`, `value`). Only pandas, matplotlib and the standard library are used.
"""),
        code(FETCH + f'''
# Your export: a path to export.zip or export.xml.
EXPORT = local_or_download("../samples/apple-health-export-synthetic.zip",
                           "{SITE}/samples/apple-health-export-synthetic.zip")
EXPORT'''),
        md("""
## Stream the XML

`iterparse` hands over one element at a time and `elem.clear()` frees it, so memory stays flat even for an export of hundreds of megabytes. Inside a ZIP, the file to read is the shallowest one named `export.xml`.
"""),
        code('''import zipfile
import xml.etree.ElementTree as ET
import pandas as pd

def open_export(path):
    if path.lower().endswith(".zip"):
        z = zipfile.ZipFile(path)
        names = [n for n in z.namelist() if n.split("/")[-1].lower() == "export.xml"]
        return z.open(min(names, key=lambda n: n.count("/")))
    return open(path, "rb")

RECORD_COLS = ["type", "sourceName", "unit", "startDate", "endDate", "value"]
WORKOUT_COLS = ["workoutActivityType", "sourceName", "duration", "durationUnit", "startDate", "endDate"]
records, workouts = [], []
with open_export(EXPORT) as f:
    for _, elem in ET.iterparse(f, events=("end",)):
        if elem.tag == "Record":
            records.append([elem.get(c) for c in RECORD_COLS])
            elem.clear()
        elif elem.tag == "Workout":
            workouts.append([elem.get(c) for c in WORKOUT_COLS])
            elem.clear()

df = pd.DataFrame(records, columns=RECORD_COLS)
wo = pd.DataFrame(workouts, columns=WORKOUT_COLS)
print(f"{len(df):,} records, {len(wo):,} workouts")'''),
        md("""
## Dates: keep the day where it happened

Each timestamp is written with its UTC offset, for example `2026-06-01 07:13:00 -0700`. The first ten characters are the local calendar day, which is the day a person means by "Monday's steps". Converting to UTC first would push late-evening samples into the next day, so the day comes straight from the string.
"""),
        code('''for frame in (df, wo):
    frame["start"] = pd.to_datetime(frame["startDate"], format="%Y-%m-%d %H:%M:%S %z", utc=True)
    frame["end"] = pd.to_datetime(frame["endDate"], format="%Y-%m-%d %H:%M:%S %z", utc=True)
    frame["day"] = pd.to_datetime(frame["startDate"].str[:10])
df["num"] = pd.to_numeric(df["value"], errors="coerce")
df["short"] = df["type"].str.replace(r"^HK(Quantity|Category)TypeIdentifier", "", regex=True)

summary = (df.groupby("short")
             .agg(rows=("type", "size"), first=("day", "min"), last=("day", "max"),
                  units=("unit", lambda u: ", ".join(sorted(set(u.dropna())))),
                  sources=("sourceName", "nunique"))
             .sort_values("rows", ascending=False))
summary'''),
        md("""
## Daily steps, and the double-count trap

Steps can arrive from more than one source. When a phone in a pocket and a watch on the wrist both count the same walk, summing every row adds the two counts together. HealthKit's statistics queries are built to merge overlapping sources; a raw export is not, so look at the sources side by side before trusting a sum. In this synthetic file the phone and watch rows cover different hours, so the sum happens to be right; check your own file the same way.
"""),
        code(STYLE + '''
steps = df[df["type"] == "HKQuantityTypeIdentifierStepCount"]
by_source = steps.pivot_table(index="day", columns="sourceName", values="num", aggfunc="sum").fillna(0)
by_source["all sources summed"] = by_source.sum(axis=1)
ax = by_source.plot(title="Steps per day (synthetic)", lw=1)
ax.set_ylabel("steps"); ax.set_xlabel("")
plt.show()
by_source.describe().round(0)'''),
        md("""
## Resting heart rate and nightly sleep

Resting heart rate is one value per day here, so a 7-day rolling mean shows the trend. Sleep is a category type: each row is a stretch of time with a stage in `value`. Summing the stretches whose value starts with `HKCategoryValueSleepAnalysisAsleep` gives hours asleep. A night straddles midnight, so each stretch is assigned to a night by shifting its local start time forward 12 hours and taking the date: a stretch starting at 23:00 or at 02:00 both land on the morning the night ended.
"""),
        code('''rhr = (df[df["type"] == "HKQuantityTypeIdentifierRestingHeartRate"]
       .groupby("day")["num"].mean())
ax = rhr.plot(lw=0.8, label="daily", title="Resting heart rate (synthetic)")
rhr.rolling(7).mean().plot(ax=ax, lw=2, label="7-day mean")
ax.set_ylabel("bpm"); ax.set_xlabel(""); ax.legend()
plt.show()

sleep = df[(df["type"] == "HKCategoryTypeIdentifierSleepAnalysis")
           & df["value"].str.startswith("HKCategoryValueSleepAnalysisAsleep")].copy()
sleep["hours"] = (sleep["end"] - sleep["start"]).dt.total_seconds() / 3600
sleep["night"] = (pd.to_datetime(sleep["startDate"].str[:19]) + pd.Timedelta(hours=12)).dt.normalize()
per_night = sleep.groupby("night")["hours"].sum()
ax = per_night.plot(kind="bar", width=0.9, title="Hours asleep per night (synthetic)")
ax.set_xticks(range(0, len(per_night), 14))
ax.set_xticklabels([d.strftime("%b %d") for d in per_night.index[::14]], rotation=0)
ax.set_ylabel("hours"); ax.set_xlabel("")
plt.show()
per_night.describe().round(2)'''),
        md("""
## Workouts

`Workout` elements carry the activity type and a duration with its unit.
"""),
        code('''wo["minutes"] = pd.to_numeric(wo["duration"], errors="coerce").where(wo["durationUnit"] == "min")
wo["activity"] = wo["workoutActivityType"].str.replace("HKWorkoutActivityType", "", regex=False)
wo.groupby("activity")["minutes"].agg(["count", "sum", "mean"]).round(1)'''),
        md(f"""
## Save one type as CSV

```python
df[df["type"] == "HKQuantityTypeIdentifierHeartRate"][RECORD_COLS].to_csv("heart_rate.csv", index=False)
```

The browser version of this notebook, with no Python at all, is the [Apple Health export explorer]({SITE}/tools/apple-health-explorer).
"""),
    ]


def daily():
    return [
        md(f"""
# A daily-summary CSV: trends and a weekly view

Many wearable exports boil down to one row per day. This notebook shows the pandas steps that work on any of them: parse the date column, add 7-day rolling means, compare two metrics, and resample by week.

**The input here is synthetic** (`daily-summary-synthetic.csv` from [{SITE}/own-your-data]({SITE}/own-your-data#notebooks)), generated from a fixed seed. Its column names are **ours, not any vendor's**: no vendor's CSV layout was verified for this notebook. To use your own export, set `CSV` and map your columns in `COLUMNS`. Lines starting with `#` are comments and are skipped.
"""),
        code(FETCH + f'''
CSV = local_or_download("data/daily-summary-synthetic.csv",
                        "{SITE}/notebooks/data/daily-summary-synthetic.csv")

# Map your file's column names to the names used below.
COLUMNS = {{"date": "date", "steps": "steps", "sleep_hours": "sleep_hours",
           "resting_hr_bpm": "resting_hr_bpm", "weight_kg": "weight_kg"}}'''),
        code('''import pandas as pd
d = pd.read_csv(CSV, comment="#").rename(columns={v: k for k, v in COLUMNS.items()})
d["date"] = pd.to_datetime(d["date"])
d = d.set_index("date").sort_index()
d.head()'''),
        md("""
## Rolling means

Day-to-day numbers are noisy; a 7-day rolling mean is the usual first look. `min_periods` keeps the first days from being blank.
"""),
        code(STYLE + '''
fig, axes = plt.subplots(3, 1, figsize=(10, 7), sharex=True)
for ax, col, unit in zip(axes, ["steps", "sleep_hours", "resting_hr_bpm"], ["steps", "hours", "bpm"]):
    d[col].plot(ax=ax, lw=0.7, alpha=0.6, label="daily")
    d[col].rolling(7, min_periods=3).mean().plot(ax=ax, lw=2, label="7-day mean")
    ax.set_ylabel(unit); ax.set_title(col + " (synthetic)", fontsize=10)
axes[0].legend(loc="upper right")
axes[-1].set_xlabel("")
plt.tight_layout(); plt.show()'''),
        md("""
## Weight: sparse readings

Weight is logged every few days, so most rows are empty. Plot the readings themselves, and interpolate only for a trend line.
"""),
        code('''w = d["weight_kg"].dropna()
ax = w.plot(style="o", ms=3, label="readings", title="Weight (synthetic)")
d["weight_kg"].interpolate(limit_area="inside").rolling(14, min_periods=5).mean().plot(ax=ax, lw=2, label="14-day trend")
ax.set_ylabel("kg"); ax.set_xlabel(""); ax.legend()
plt.show()
print(f"{len(w)} readings over {len(d)} days")'''),
        md("""
## Does sleep move with resting heart rate?

A correlation and a scatter are the honest first step. On this synthetic file the two columns were generated independently, so expect a value near zero: the point is the method, not the result.
"""),
        code('''r = d["sleep_hours"].corr(d["resting_hr_bpm"])
ax = d.plot.scatter(x="sleep_hours", y="resting_hr_bpm", s=12, figsize=(5, 4),
                    title=f"Sleep vs resting HR, r = {r:.2f} (synthetic)")
plt.show()'''),
        md("""
## Weekly view

`resample("W-MON", label="left", closed="left")` gives Monday-starting weeks. Steps are summed and averaged; sleep and heart rate are averaged.
"""),
        code('''weekly = d.resample("W-MON", label="left", closed="left").agg(
    {"steps": ["sum", "mean"], "sleep_hours": "mean", "resting_hr_bpm": "mean"}).round(1)
weekly.columns = ["steps_total", "steps_per_day", "sleep_hours", "resting_hr"]
weekly'''),
    ]


def activities():
    return [
        md(f"""
# An activity-list CSV: weekly training volume

Exports of workouts (Strava's, Garmin's, Polar's, COROS's, once FIT or TCX files are turned into rows) reduce to one row per activity. This notebook sums minutes and distance per week and activity type and charts the weekly volume.

**The input here is synthetic** (`activities-synthetic.csv` from [{SITE}/own-your-data]({SITE}/own-your-data#notebooks)), generated from a fixed seed. Its column names are **ours, not any vendor's**. Set `CSV` and `COLUMNS` for your own file.
"""),
        code(FETCH + f'''
CSV = local_or_download("data/activities-synthetic.csv",
                        "{SITE}/notebooks/data/activities-synthetic.csv")
COLUMNS = {{"start_time": "start_time", "activity_type": "activity_type",
           "duration_min": "duration_min", "distance_km": "distance_km", "avg_hr_bpm": "avg_hr_bpm"}}'''),
        code('''import pandas as pd
a = pd.read_csv(CSV, comment="#").rename(columns={v: k for k, v in COLUMNS.items()})
# Keep the local wall-clock time as written: the offset is dropped, not converted.
a["start"] = pd.to_datetime(a["start_time"].str[:19])
a["week"] = a["start"].dt.to_period("W-SUN").dt.start_time
a.head()'''),
        code('''a.groupby("activity_type").agg(sessions=("start", "size"), minutes=("duration_min", "sum"),
                               km=("distance_km", "sum"), avg_hr=("avg_hr_bpm", "mean")).round(1)'''),
        md("""
## Weekly minutes by activity

A pivot table with weeks as rows and activity types as columns, then a stacked bar chart.
"""),
        code(STYLE + '''
weekly = a.pivot_table(index="week", columns="activity_type", values="duration_min", aggfunc="sum").fillna(0)
ax = weekly.plot(kind="bar", stacked=True, width=0.85, title="Training minutes per week (synthetic)")
ax.set_xticks(range(len(weekly)))
ax.set_xticklabels([d.strftime("%b %d") for d in weekly.index], rotation=0, fontsize=8)
ax.set_ylabel("minutes"); ax.set_xlabel("week starting")
plt.show()
weekly.round(0)'''),
        md("""
## Load change week to week

A common rule of thumb compares each week with the average of the previous four. Here it is computed, not judged: what counts as too fast an increase is a coaching question.
"""),
        code('''total = weekly.sum(axis=1)
ratio = (total / total.shift(1).rolling(4).mean()).round(2)
pd.DataFrame({"minutes": total.round(0), "vs previous 4-week mean": ratio})'''),
    ]


NOTEBOOKS = {
    "apple-health-export.ipynb": apple,
    "wearable-daily-summary.ipynb": daily,
    "activities-log.ipynb": activities,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, build in NOTEBOOKS.items():
        nb = nbformat.v4.new_notebook()
        nb.cells = build()
        nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
        nb.metadata["language_info"] = {"name": "python"}
        NotebookClient(nb, timeout=300, kernel_name="python3", resources={"metadata": {"path": OUT}}).execute()
        # Execution metadata (timings) would change on every run; drop it so a
        # rerun on the same samples rewrites the same file apart from images.
        for c in nb.cells:
            c.metadata.pop("execution", None)
        path = os.path.join(OUT, name)
        nbformat.write(nb, path)
        print(f"{os.path.relpath(path, ROOT)}  {os.path.getsize(path)} bytes")


if __name__ == "__main__":
    sys.exit(main())
