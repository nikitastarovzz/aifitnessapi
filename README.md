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
