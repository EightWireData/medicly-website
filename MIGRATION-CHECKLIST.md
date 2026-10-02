# Medicly — Webflow migration checklist

Source: https://www.medicly.co.nz (Webflow, last published 2025-03-19).
Target: Astro static site in this repo. Copy is verbatim; colours are Medicly's; layout follows eightwire.io.
Owner questions live in [migration/owner-review.md](migration/owner-review.md).

## 0 — Archive first
- [x] `git init`, `.gitignore`, first commit
- [x] `scripts/snapshot-site.mjs`: all 20 URLs + 404 + CSS + sitemap → `migration/snapshot/`
- [x] `scripts/fetch-assets.mjs`: 54 original assets downloaded, `migration/asset-manifest.json` written, sizes > 0

## 1 — Foundation
- [x] Astro 7 + `@astrojs/sitemap` + `@fontsource/poppins` + `@fontsource/jetbrains-mono`; cheerio (dev)
- [x] `src/styles/tokens.css` + `global.css` (palette, type scale, grain, grid/glow backgrounds, reveal, reduced motion)
- [x] `src/layouts/Base.astro` (SEO head, Intercom, grain, motion toggle)
- [x] Nav (Resources dropdown + mobile drawer)
- [x] Footer (verbatim, Powered by Eightwire)
- [x] Shared components

## 2 — Content collections
- [x] Blog posts ×3 (verbatim bodies)
- [x] Team ×2
- [x] Jobs ×1
- [x] Categories ×2

## 3 — Pages
- [x] `/`
- [x] `/about-us`
- [x] `/product`
- [x] `/technical-overview`
- [x] `/partners`
- [x] `/videos`
- [x] `/faq`
- [x] `/contact`
- [x] `/get-started`
- [x] `/privacy-policy`
- [x] `/terms-and-conditions`
- [x] `/blog`
- [x] `/blog/[slug]` ×3
- [x] `/category/[slug]` ×2
- [x] `/team/[slug]` ×2
- [x] `/job/[slug]`
- [x] 404

## 4 — Fixes & SEO
- [x] Wrong `mailto:Hello@website.com` → `hello@medicly.co.nz`
- [x] Footer "Careers" (`/jobs` 404) → `/job/intermediate-engineer` + redirect
- [x] "Take me home" `#` → `/`; "Apply Now" `#` → mailto
- [x] Empty / invisible template links removed (`/company/about-us-1`, flowbase)
- [x] Blog category badge shows its category name
- [x] `/about-us` meta description (Felix template text) → that page's hero paragraph
- [x] Blog list-item colour bug not carried over
- [x] One H1 per page, `lang="en-NZ"`, canonical, OG tags per page
- [x] `robots.txt`, sitemap, `_redirects`

## 5 — Verify
- [x] `npm run build` + `astro check` clean (0 errors, 0 warnings)
- [x] `scripts/verify-copy.mjs` — every archived text run present, occurrence-counted, on all 21 pages + nav + footer
- [x] `scripts/verify-build.mjs` — 20/20 URLs, sitemap exact, no Webflow references, links + assets resolve
- [x] Screenshots reviewed at 1440 / 390; no overflow at 360–1024 on any page; nav, drawer, FAQ, video, count-up, motion toggle, reduced motion tested in a browser; critic review done and fixed
- [x] axe: no issues except brand-colour contrast (white on teal, coral/teal on white — same as the live site; owner decision, see owner-review §4)

## 6 — Handover
- [x] README (run, build, edit content)
- [x] `migration/owner-review.md` complete
- [x] Hosting + DNS cutover steps written (README → Going live) — cutover itself is yours

## 7 — Post-migration changes (owner requests)
- [x] Stats replaced with Eightwire's published figures (`src/data/stats.ts`)
- [x] Security review; security headers added (`public/_headers`)
- [x] Former team members removed everywhere; `/team/*` → `/about-us`
- [x] Video series removed; `/videos` → `/`
- [x] Blog bylines → "Eightwire team"
- [x] Contact email → support@eight-wire.com
- [x] Office address removed
