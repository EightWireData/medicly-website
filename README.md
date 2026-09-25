# medicly.co.nz

This repo holds the Medicly marketing site, moved off Webflow into a static [Astro](https://astro.build) site.

- **Copy:** every word is carried over verbatim from the Webflow site.
- **Colours:** Medicly's own.
- **Layout:** takes its cues from [eightwire.io](https://eightwire.io).
- **URLs:** identical to Webflow (`/about-us`, `/blog/<slug>`, …), so existing links and search results keep working.

Related files:

- [MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md): the migration, step by step.
- [migration/owner-review.md](migration/owner-review.md): decisions the site owner still needs to make (typos, stale content, forms, hosting).

## Run it

Requires Node 22.12 or newer.

```sh
npm install
npm run dev        # http://localhost:4321 with live reload
npm run build      # static site -> dist/
npm run preview    # serve dist/ locally
npm run check      # type-check
npm run verify     # after a build: copy + structure checks (below)
```

## Editing content

| What | Where |
|---|---|
| Blog posts | `src/content/blog/<slug>.md`. The filename is the URL. |
| Team members | `src/content/team/<slug>.md` (role, photo, background colour, LinkedIn; the body is the bio) |
| Job listings | `src/content/jobs/<slug>.md` |
| Blog categories | `src/content/categories/<slug>.json` |
| Page copy | `src/pages/*.astro`: each page's text sits in its file |
| Nav and footer links | `src/data/nav.ts` |
| FAQ | `src/data/faq.ts` |
| Email, phone, address, socials | `src/data/site.ts` |
| Privacy policy | `src/data/legal/privacy-policy.html` |
| Colours, fonts, spacing | `src/styles/tokens.css` |

### Adding a blog post

1. Put the header image in `src/assets/images/`.
2. Create `src/content/blog/my-new-post.md` with the frontmatter below. The build fails with a clear message if a field is missing or an author or category doesn't exist.

```md
---
title: "My new post"
summary: "One or two sentences for the card, the page intro and search results."
date: 2026-10-01
author: "andy-ellis"          # a file name from src/content/team/
category: "data-sharing"      # a file name from src/content/categories/
image: "../../assets/images/my-header.jpg"
---

Body in Markdown. Use ## for section headings.
```

### Images

Raster images (JPG and PNG) go in `src/assets/images/`, where Astro resizes them and converts them to WebP. SVGs, social-card images and favicons live in `public/media/` and are served as-is.

## Checks

`npm run verify` runs two scripts against `dist/`:

- **`scripts/verify-copy.mjs`** takes every visible run of text from each archived Webflow page and confirms it appears on the matching new page, including the nav and footer. This is what guarantees the copy survived. Differences allowed on purpose are listed in the script, each with its reason.
- **`scripts/verify-build.mjs`** checks four things:
  - all 20 Webflow URLs exist, and the sitemap lists exactly those
  - nothing still references Webflow or the dead GTM container
  - every internal link and asset resolves
  - every downloaded Webflow asset is either used or listed as intentionally dropped

Once you start rewriting copy on purpose, `verify-copy` reports each change as missing. That's expected: it marks the point where the site stops being a straight migration. You can retire the script then.

## The migration archive

`migration/` holds the source of truth taken from Webflow on 25 September 2026:

- `snapshot/`: the raw HTML of every page, plus the stylesheet and sitemap. Keep it after Webflow is cancelled.
- `asset-manifest.json`: which Webflow CDN file became which local file.
- `owner-review.md`: open questions for the owner.

The scripts that built the archive only work while the Webflow site is still live:

| Script | What it does |
|---|---|
| `npm run snapshot` | Re-archives the HTML |
| `npm run fetch-assets` | Re-downloads the assets |
| `node scripts/extract-cms.mjs` | Regenerates `src/content/` from the archive. It overwrites local edits, so don't run it after content changes. |

## Going live

The output is plain static files in `dist/`, so any static host works.

**Pages** are built as `about-us.html`, `blog/<slug>.html`, and so on. The host must serve `/about-us` from `about-us.html`. Cloudflare Pages and Netlify do this by default. On other hosts, check before cutover.

**Redirects:** `public/_redirects` sends `/jobs` to `/job/intermediate-engineer`. Cloudflare Pages and Netlify read this file; on other hosts, set up the same redirect in their own config. The same applies to serving `404.html` for unknown URLs.

**Cutover steps:**

1. Deploy `dist/` to the new host and open its preview URL. Click through, and check the Intercom chat and the email links.
2. A day before the switch, lower the TTL on the `medicly.co.nz` DNS records.
3. On the new host, add the custom domains `www.medicly.co.nz` (primary) and `medicly.co.nz`, with the bare domain redirecting to `www`, as it does today.
4. At the DNS provider, point the records from Webflow to the new host. Wait for HTTPS to come up on both names.
5. In Google Search Console, which is already verified through the meta tag this site keeps, submit `https://www.medicly.co.nz/sitemap-index.xml`.
6. Once the new site has served traffic for a few days, unpublish the Webflow site and cancel the plan.
