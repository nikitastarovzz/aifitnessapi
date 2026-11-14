# {{TITLE}}

The open datasets behind [aifitnessapi.com](https://aifitnessapi.com/datasets), a reference for developers working with fitness and health APIs: HealthKit, Health Connect, Wear OS Health Services, the Google Health API, wearable vendor APIs, Bluetooth fitness profiles and pose estimation. This repository holds only the data, {{DATASET_COUNT}} datasets each in JSON and CSV with a Markdown card, so other projects can depend on it, pin a commit and link to a file. It is a mirror: the files are built in the [source repository](https://github.com/nikitastarovzz/aifitnessapi) and copied here unchanged.

aifitnessapi.com is an independent reference funded by KinesteX (AI motion tracking for fitness apps). How the site keeps that separate from what it publishes: https://aifitnessapi.com/about#funding.

## Datasets

Row counts are read from [`data/manifest.json`](data/manifest.json) (generated {{MANIFEST_GENERATED}}), which also lists each file's size and SHA-256.

| Dataset | Rows | Files |
|---|---:|---|
{{DATASET_TABLE}}
{{OTHER_FILES}}
## How it is regenerated

Each dataset is built by `npm run datasets` in the source repository, from the same data modules that render the site's pages, so a published row cannot drift from the page that carries its sourced claim. The generators exit non-zero rather than publish a truncated dataset, and a field the source does not state is null, never guessed. Each card (the `.md` file) says where its rows come from and when the sources were read.

On every change to `public/datasets/` in the source repository, `.github/workflows/dataset-mirror.yml` runs `scripts/mirror-datasets.mjs`, which copies that directory into `data/` here, removes files that no longer exist there, and rewrites this README, `LICENSE` and `CITATION.cff`. Edits made directly in this repository are overwritten by the next sync, so please send corrections to the source repository instead.

## License

The datasets are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/legalcode. Credit aifitnessapi.com when you use them. See [`LICENSE`](LICENSE).

## How to cite

[`CITATION.cff`](CITATION.cff) is the machine-readable citation. It is copied from the source repository, where these files live in `public/datasets/` rather than `data/`. In prose:

> {{CITATION_LINE}}

## Report a wrong row

Open an issue on the source repository, https://github.com/nikitastarovzz/aifitnessapi/issues, naming the dataset, the row and the primary source that contradicts it. The datasets are also described, with their pages, at https://aifitnessapi.com/datasets.
