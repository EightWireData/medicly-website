# Medicly site — items for the site owner

The new site carries over every word of the old Webflow site exactly as it was published. I didn't silently fix anything in the copy. This page lists what needs your decision: typos, stale content, and the few behaviours that had to change once the site left Webflow.

Each item says what is live now and what I suggest. None of them block launch.

---

## 1. Typos and copy slips (kept word for word, awaiting your OK to fix)

| Page | Current text | Suggested fix |
|---|---|---|
| /about-us, "Automated and secure health data sharing" | "They also **effect** everyone…" | "affect" |
| /videos | "**Medically** evolved from these frustrations…" | "Medicly" |
| /contact | "how **contact-driven** data sharing works" | Probably "contract-driven" |
| Blog: *Sharing data securely…* | "such as **SNOWMED** or FHIR" | "SNOMED" (as on /product) |
| Blog: *Companies are using…* | "so no one **access** any data" | "no one can access" |
| Every blog post, "Enjoyed this read?" | "the latest **video business news**…" | Leftover template text; perhaps "the latest health data news" |
| /job/intermediate-engineer | "We are looking for **their** next Junior/Intermediate Software Engineer!" | "our next" |
| /job/intermediate-engineer | "employment bas**ı**s" (dotless ı) | "Employment basis" |
| /privacy-policy | "Medicly(we, us, our)", "(if necessary)to bill you", "requesting).We may" | Add the missing spaces |

**Minor inconsistency:** the homepage says "80+ Existing customers…" and "Faster to implement than comparable solutions". The About page says "80+ Customers across APAC" and "…than other solutions". Worth aligning?

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
   - "Apply Now" linked to `#` (nowhere). It now opens an email to hello@medicly.co.nz.
4. **The YouTube channel link returns 404.** The blog sidebar's "Youtube" link goes to `https://www.youtube.com/@eightwire485`, which returned "not found" when checked. It needs a new URL.
5. **The /about-us search description was template filler.** It read "Felix is the ultimate product…". It now uses that page's own opening paragraph.
6. **The copyright year now updates itself.** The live site showed 2023, 2024 or 2025 depending on the page. It now shows the current year.

## 3. What changed because the site left Webflow

### Forms are now email links (your decision)

Webflow forms only work on Webflow. Each form is now a button that opens an email to **hello@medicly.co.nz**:

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
- Videos play inline with YouTube's privacy-enhanced player, and nothing loads from YouTube until someone presses play.
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

## 6. Security note

The repo contains no secrets. The archived Webflow pages in `migration/snapshot/` include public client identifiers that the live site already publishes:

- Intercom app ID
- Turnstile site key
- Webflow's Embedly key
- Google verification token

None of them grants access to anything.
