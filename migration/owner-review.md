# Medicly site — items for the site owner

The new site carries over every word of the old Webflow site exactly as it was published. I didn't silently fix anything in the copy. This page lists what needs your decision: typos, stale content, and the few behaviours that had to change once the site left Webflow.

Each item says what is live now and what I suggest. None of them block launch.

---

## 0. Changes made at your request (2 October 2026)

| Change | What it means on the site |
|---|---|
| Former team members removed | Jason Gleason and Andy Ellis are gone from the About page (team section), the blog (bylines and author boxes) and the nav. Their profile pages `/team/andy-ellis` and `/team/jason-gleason` are deleted and redirect to /about-us. Their photos are deleted from the repo. |
| Video series removed | The /videos page, its nav and footer links, and the nav feature card are gone (the series featured Jason). /videos redirects to the homepage. The homepage intro video stays. |
| Blog bylines | Every post is credited to "Eightwire team". |
| Contact email | Every email link now goes to **support@eight-wire.com** (was hello@medicly.co.nz). |
| Office address | "Level 3, 2/12 Allen St, Wellington 6011" and the Google Maps link are removed from /contact and /get-started. The phone number stays on /get-started. |
| Stats | See §1 below. |

The archived Webflow pages in `migration/snapshot/` still contain the old names and address. That folder is the historical record of the old site; it is never published.

## 1. Typos and copy slips (kept word for word, awaiting your OK to fix)

| Page | Current text | Suggested fix |
|---|---|---|
| /about-us, "Automated and secure health data sharing" | "They also **effect** everyone…" | "affect" |
| /contact | "how **contact-driven** data sharing works" | Probably "contract-driven" |
| Blog: *Sharing data securely…* | "such as **SNOWMED** or FHIR" | "SNOMED" (as on /product) |
| Blog: *Companies are using…* | "so no one **access** any data" | "no one can access" |
| Every blog post, "Enjoyed this read?" | "the latest **video business news**…" | Leftover template text; perhaps "the latest health data news" |
| /job/intermediate-engineer | "We are looking for **their** next Junior/Intermediate Software Engineer!" | "our next" |
| /job/intermediate-engineer | "employment bas**ı**s" (dotless ı) | "Employment basis" |
| /privacy-policy | "Medicly(we, us, our)", "(if necessary)to bill you", "requesting).We may" | Add the missing spaces |

**Stats replaced (done, at your request).** The homepage and About page now show the same four figures from one file, `src/data/stats.ts`:

| Figure | Wording on the site |
|---|---|
| 100+ | Public and private organisations exchange data on our platform |
| 10+ | Years making data sharing between enterprises simple and secure |
| 34 | Connectors across databases, files, transfer and SaaS |
| 20 min | As little as it takes to connect and begin exchanging data |

These are Eightwire's published figures from eightwire.io: "100+ organisations", "Since 2015", "34 connectors", "20 min".

The old Webflow figures were unsourced and contradicted each other: 4,000 records a second works out to about 10 billion a month, not "3.5b". Please confirm these figures are fine to publish under the Medicly name, or send Medicly-specific ones.

## 2. Content that looks wrong or out of date

1. **/terms-and-conditions is broken on the live site.** It is a copy of the FAQ accordion:
   - Only the first answer was replaced with T&C clauses 1.1–1.2, and it ends with a stray fragment ("…healthcare networks to perform flexible and frequent Population Health assessments…").
   - The other five items are FAQ answers.
   - No page links to it; it is only in the sitemap.
   - I migrated it as-is at the same URL. It needs real terms or removal.
2. **The privacy policy cites the Privacy Act 1993.** The Privacy Act 2020 replaced it. The policy is dated 1 February 2023. Please have it reviewed.
3. **Is the job posting still open?**
   - *Intermediate Engineer* dates from 2023.
   - The old footer "Careers" link pointed to /jobs, which never existed (404). It now goes to the job page, and /jobs redirects there.
   - "Apply Now" linked to `#` (nowhere). It now opens an email to support@eight-wire.com.
4. **The YouTube channel link returns 404.** The blog sidebar's "Youtube" link goes to `https://www.youtube.com/@eightwire485`, which returned "not found" when checked. It needs a new URL.
5. **The /about-us search description was template filler.** It read "Felix is the ultimate product…". It now uses that page's own opening paragraph.
6. **The copyright year now updates itself.** The live site showed 2023, 2024 or 2025 depending on the page. It now shows the current year.

## 3. What changed because the site left Webflow

### Forms are now email links (your decision)

Webflow forms only work on Webflow. Each form is now a button that opens an email to **support@eight-wire.com**:

| Where | Email subject | Body pre-filled with |
|---|---|---|
| /contact | Contact Medicly | First Name, Last Name, Phone number, Email address, Company, Message |
| /get-started | Get started with Medicly | Name, Email Address, Company, Phone number |
| "Let's work together" block (most pages) | Medicly enquiry | nothing |
| /technical-overview whitepaper request | Technical Whitepaper request | nothing |
| /blog newsletter | Newsletter subscription | nothing |
| Blog "Enjoyed this read?" | Subscribe to Medicly updates | nothing |

Two lines of copy still say "entering your email below" (/technical-overview) and "Enter your details" (/get-started). They are accurate enough for an email link, but you may want to reword them.

**Later:** a hosted form service or a CRM form can replace any of these without changing the design.

### Scripts and tracking

| Item | Status |
|---|---|
| **Intercom chat** (app `ymbkb5nq`) | **Kept**, on every page as before |
| **Google Tag Manager** (GTM-PRZJ598) | **Removed.** The container is unpublished/deleted (404), so it was loading nothing. Tell us if you want analytics set up. |
| Google Search Console verification tag | **Kept**, so the existing verification keeps working |
| Cloudflare Turnstile, reCAPTCHA, jQuery, Webflow scripts | Removed; they only served Webflow features |

### Small behaviour changes

- The Webflow nav hid the link to the page you were on. All links now always show, and the current page is underlined.
- The "Log in" link (to conductor.eight-wire.com) was hidden at every screen size on the live site, so it is still not shown. eightwire.io has a "Sign in" link; do you want one here?
- The homepage video plays inline with YouTube's privacy-enhanced player, and nothing loads from YouTube until someone presses play.
- A hidden page-loader animation and three decorative background shapes weren't carried over; the new design replaces them. The 404 page keeps its heart animation.

## 4. Accessibility: brand colours and contrast

The brand teal and coral fall below the WCAG 2.1 AA contrast minimum (4.5:1) for small text:

| Pair | Contrast | Used for |
|---|---|---|
| White on teal `#268f8e` | 3.9:1 | Buttons |
| Teal `#268f8e` on white | 3.9:1 | Small labels |
| Coral `#ef4951` on white | 3.7:1 | Section labels |

The live Webflow site has the same issue. I kept the exact colours because you asked for the current site's colours. Everything else passes an automated accessibility scan (axe).

If you want full AA compliance, these shades look almost the same and pass. It is a two-line change in `src/styles/tokens.css`:

- Teal `#238281`, 9% darker (4.6:1 with white)
- Coral `#d24047`, 12% darker (4.6:1 on white)

## 5. Hosting and domain (your decision)

The site is built and verified locally. Steps to go live are in the README under "Going live". Webflow should stay live until the new host serves www.medicly.co.nz correctly.

## 6. Security review (2 October 2026)

**No high or medium findings.** What was checked:

| Area | Result |
|---|---|
| Secrets | None in the repo. The archived pages hold only public client identifiers the live site already publishes (Intercom app ID, Turnstile site key, Webflow's Embedly key, Google verification token). |
| Dependencies | `npm audit`: 0 vulnerabilities. |
| Injection | Raw HTML is used in four places (FAQ answers, page titles, section titles, privacy policy), but only with text committed to this repo. No visitor input reaches the page. The site has no forms, no server code and no user data. |
| External links | Every link that opens a new tab carries `rel="noopener"`. The one plain `http://` link (privacy.org.nz) now uses https. |
| Third-party code | Intercom is the only third-party script, loaded as before. YouTube only loads after someone presses play, through the privacy-enhanced domain. |

**Added:** `public/_headers` sets HSTS, nosniff, clickjacking protection, a referrer policy and a permissions policy. It also sets a Content Security Policy in **report-only** mode.

**Before or after go-live, decide:**

1. **Enforce the CSP.** Check the browser console on the live host for CSP reports, mostly about Intercom domains. Once it's clean, rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `public/_headers`. Hosts other than Netlify and Cloudflare Pages need the same headers in their own config.
2. **Repo access.** Because content files are trusted as HTML, anyone with commit access can publish arbitrary markup. Keep write access limited and require reviewed pull requests.
3. **Privacy policy.** It doesn't mention Intercom chat, which collects visitor data, and it still cites the 1993 Act (see §2).
