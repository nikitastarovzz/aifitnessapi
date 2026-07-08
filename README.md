# AIFitnessAPI

A blog and hub for people **building — or looking for — products in health,
wellness, and fitness tech**. Live at [aifitnessapi.com](https://aifitnessapi.com).

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, with
file-based **MDX** posts. Optimized for SEO out of the box: per-page metadata,
Open Graph, JSON-LD structured data, `sitemap.xml`, `robots.txt`, and an RSS
feed.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Writing a post

Posts are MDX files in [`content/posts/`](content/posts). Create a new
`.mdx` file — the filename becomes the URL slug
(`content/posts/my-post.mdx` → `/blog/my-post`).

Frontmatter:

```mdx
---
title: "Your post title"
description: "One or two sentences used for SEO and previews."
date: 2026-07-08
author: "Your Name"
tags: ["fitness API", "guides"]
image: "/og/your-post.png"   # optional, used for social previews
draft: false                 # true = visible in dev only, hidden in prod
---

Write your post in Markdown/MDX here.
```

Everything else — the blog index, sitemap, RSS, and homepage listing — updates
automatically.

## Project structure

```
content/posts/        MDX blog posts (the content you edit most)
src/app/              App Router pages, sitemap, robots, RSS feed
src/components/        Header, Footer, PostCard, MDX renderer, etc.
src/lib/site.ts        Site-wide config (name, URL, social, author)
src/lib/posts.ts       Reads + parses posts from content/posts
```

To change the site name, URL, description, or social links, edit
[`src/lib/site.ts`](src/lib/site.ts).

## Deployment (Vercel)

This repo is set up for zero-config deploys on Vercel — the framework is
auto-detected. Import the repository at
[vercel.com/new](https://vercel.com/new), then add `aifitnessapi.com` as a
domain in the project's **Settings → Domains**.

## SEO: content clusters + fast indexing

Two interlinked content clusters live alongside the blog:

```
/fitness-apis          Buyer/comparison cluster (pillar + 10 spokes)
/guides                Developer how-to cluster  (pillar + 10 guides)
```

Both follow a fixed page anatomy (answer capsule, body, FAQ, related links,
tracked CTA, disclaimer) and emit JSON-LD (Article/HowTo/FAQPage/Breadcrumb +
an Organization entity graph). Each cluster is data-driven — add a page by
adding an entry to its data file and its release Set:

```
src/data/fitnessApis.entries.ts   +  src/data/release.ts
src/data/guides.entries.ts        +  RELEASED_GUIDES in src/data/guides.ts
```

Machine-readable maps are generated from that data: `/sitemap.xml`,
`/llms.txt`, and `/llms-full.txt`.

### IndexNow (Bing + Yandex instant indexing)

New/updated URLs can be pushed to IndexNow so Bing and Yandex crawl them
quickly (Google does not use IndexNow — for Google, rely on the sitemap,
internal links, and Search Console URL Inspection).

The verification key is served at `/7ab02ba01079101c36facfcb28908c50.txt`
(`public/…`). After a deploy is live, submit URLs:

```bash
npm run indexnow                      # submit every URL in the live sitemap
npm run indexnow /guides /fitness-apis  # submit only specific paths (flagship drip)
```

Run it after each content release. (It reads the deployed sitemap, so the
site must be live first. Use `SITE_URL=... npm run indexnow` for a preview URL.)

For **Bing Webmaster Tools**, you can also verify the site and submit URLs
manually (100/day quota); the same IndexNow key works there.
