# Medicly — Webflow migration checklist

Source: https://www.medicly.co.nz (Webflow, last published 2025-03-19).
Target: Astro static site in this repo. Copy is verbatim; colours are Medicly's; layout follows eightwire.io.
Owner questions live in [migration/owner-review.md](migration/owner-review.md).

## 0 — Archive first
- [ ] `git init`, `.gitignore`, first commit
- [ ] `scripts/snapshot-site.mjs`: all 20 URLs + 404 + CSS + sitemap → `migration/snapshot/`
- [ ] `scripts/fetch-assets.mjs`: 54 original assets downloaded, `migration/asset-manifest.json` written, sizes > 0

## 1 — Foundation
- [ ] Astro 7 + `@astrojs/sitemap` + `@fontsource/poppins` + `@fontsource/jetbrains-mono`; cheerio (dev)
- [ ] `src/styles/tokens.css` + `global.css` (palette, type scale, grain, grid/glow backgrounds, reveal, reduced motion)
- [ ] `src/layouts/Base.astro` (SEO head, Intercom, grain, motion toggle)
- [ ] Nav (Resources dropdown + mobile drawer)
- [ ] Footer (verbatim, Powered by Eightwire)
- [ ] Shared components

## 2 — Content collections
- [ ] Blog posts ×3 (verbatim bodies)
- [ ] Team ×2
- [ ] Jobs ×1
- [ ] Categories ×2

## 3 — Pages
- [ ] `/`
- [ ] `/about-us`
- [ ] `/product`
- [ ] `/technical-overview`
- [ ] `/partners`
- [ ] `/videos`
- [ ] `/faq`
- [ ] `/contact`
- [ ] `/get-started`
- [ ] `/privacy-policy`
- [ ] `/terms-and-conditions`
- [ ] `/blog`
- [ ] `/blog/[slug]` ×3
- [ ] `/category/[slug]` ×2
- [ ] `/team/[slug]` ×2
- [ ] `/job/[slug]`
- [ ] 404

## 4 — Fixes & SEO
- [ ] Wrong `mailto:Hello@website.com` → `hello@medicly.co.nz`
- [ ] Footer "Careers" (`/jobs` 404) → `/job/intermediate-engineer` + redirect
- [ ] "Take me home" `#` → `/`; "Apply Now" `#` → mailto
- [ ] Empty / invisible template links removed (`/company/about-us-1`, flowbase)
- [ ] Blog category badge shows its category name
- [ ] `/about-us` meta description (Felix template text) → that page's hero paragraph
- [ ] Blog list-item colour bug not carried over
- [ ] One H1 per page, `lang="en-NZ"`, canonical, OG tags per page
- [ ] `robots.txt`, sitemap, `_redirects`

## 5 — Verify
- [ ] `npm run build` + `astro check` clean
- [ ] `scripts/verify-copy.mjs` — 0 unexpected missing text
- [ ] `scripts/verify-build.mjs` — URL parity, no Webflow references, links + assets resolve
- [ ] Screenshots at 1440 / 768 / 390 vs live site; interactions exercised
- [ ] axe: 0 serious/critical issues

## 6 — Handover
- [ ] README (run, build, edit content)
- [ ] `migration/owner-review.md` complete
- [ ] Hosting + DNS cutover steps (user performs cutover)
