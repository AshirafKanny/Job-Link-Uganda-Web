# Job Link Uganda: SEO Audit & Optimisation Plan

**Site:** https://www.joblinkuganda.com (live) · **Audit date:** 28 September 2026
**Method:** crawl of the live site as Googlebot, inspection of the served sitemap and robots.txt, HTTP and redirect checks, Lighthouse (mobile), a local production build, and a review of the source code (this repository).

**Legend**
- ✅ **Verified:** measured or observed on the live site or in the code.
- 🔧 **Fixed in code:** implemented in this repository and ships on the next deploy.
- 💡 **Recommendation.**
- ⚠️ **Assumption / unverified:** could not be checked; the reason is given.

> **Keyword data caveat:** no paid keyword tool (Google Keyword Planner, Ahrefs, Semrush) was available. **No search volumes or difficulty scores are given as fact.** Priorities come from observed search results, commercial value and fit with the business. Validate them in Keyword Planner (location: Uganda) and, after launch, with Search Console query data.

---

## 1. Executive SEO summary

The technical foundation is strong:
- Server-rendered pages, clean URLs, correct 404s, one H1 per page, breadcrumbs.
- Structured data generated from the same content that is visible on the page.
- A lifecycle that removes expired jobs from the index automatically.
- Accessibility 100, CLS 0.

**But the site cannot currently rank at all, for two configuration reasons:**
1. **Every page is `noindex` and robots.txt blocks all crawlers.** This is the pre-launch switch (`SITE_INDEXABLE=false`) still in place.
2. **Every canonical tag, sitemap URL, Open Graph URL and structured-data URL points to `https://joblink-uganda.vercel.app`, which returns 404.** `NEXT_PUBLIC_SITE_URL` is set to that Vercel address instead of the real domain.

Both are Vercel environment-variable fixes (section 25). Code-level safeguards now make issue 2 impossible to repeat.

After those fixes, the realistic path to visibility has four parts:
- **Employer searches** such as "recruitment agency Kampala" and "hospitality recruitment Uganda", where competitors' service pages are thin.
- **Individual vacancies** in Google's job search experience. This needs real jobs to be published.
- **A hospitality niche** that no Ugandan agency clearly owns.
- **Trust content** (recruitment safety).

Head terms like "jobs in Uganda" are dominated by large job boards with thousands of listings. Don't expect to win those in year one.

---

## 2. Current SEO health (verified 28 Sep 2026)

| Area | Status | Evidence |
|---|---|---|
| Indexability | ❌ **Blocked** | `<meta name="robots" content="noindex, follow">` on all pages; robots.txt `Disallow: /` |
| Canonical host | ❌ **Wrong** | Canonicals point to `joblink-uganda.vercel.app` (404) |
| Sitemap | ❌ **Wrong host** | All 28 `<loc>` on `joblink-uganda.vercel.app` |
| Domain setup | ✅ | `joblinkuganda.com` → 308 → `https://www.joblinkuganda.com` (primary). HTTP → HTTPS 308. HSTS on |
| Redirect chain | ⚠️ minor | `http://joblinkuganda.com` → `https://joblinkuganda.com` → `https://www…` is 2 hops (Vercel's HTTPS upgrade runs before the domain redirect) |
| Trailing slash | ✅ | `/jobs/` → 308 → `/jobs` |
| 404 handling | ✅ | Unknown pages and unknown jobs return a real 404 |
| Filters / parameters | ✅ | `/jobs?q=…`, `?page=2` render with `noindex, follow` and canonical `/jobs` |
| Titles | ✅ mostly | Unique and descriptive, 26–65 characters including the brand |
| Meta descriptions | ⚠️ → 🔧 | 9 page-level and 7 CMS descriptions were 157–198 characters (truncated). Rewritten to ≤155 |
| H1 | ✅ | Exactly one per page (verified on 10 key pages) |
| Structured data | ✅ valid, ❌ wrong host | Organization, WebSite, BreadcrumbList, Service, BlogPosting all parse, but URLs use the Vercel host |
| Performance (lab, mobile, emulated slow 4G) | ⚠️ | Home: Performance 76–82, **LCP 3.7–4.3 s**, CLS 0, TBT 180–460 ms. Accessibility 100, Best Practices 100 |
| SEO score (Lighthouse) | 69 | The **only** failing check is `is-crawlable` (the noindex). Everything else passes |
| Compression / CDN | ✅ | Brotli, Vercel edge cache HIT |
| Content | ⚠️ | **0 live vacancies.** No phone, email or WhatsApp published. 3 articles. 4 service pages |
| Field Core Web Vitals | ⚠️ unverified | No real-user (CrUX) data yet. The site is new and not indexed |

---

## 3. Critical problems

| # | Problem | Verified evidence | Fix |
|---|---|---|---|
| **P0-1** | Site set to `noindex` + robots `Disallow: /` | Every page; robots.txt | Vercel env `SITE_INDEXABLE=true` → redeploy, **once** content is ready (section 22) |
| **P0-2** | Canonicals, sitemap, OG and schema on a 404 host | All pages | Vercel env `NEXT_PUBLIC_SITE_URL=https://www.joblinkuganda.com` → redeploy. 🔧 Build now fails if indexing is enabled while this is a Vercel or localhost URL |
| **P0-3** | Admin login likely blocked on the real domain | Payload `serverURL`, CORS and CSRF are derived from `NEXT_PUBLIC_SITE_URL` (code) | Same fix as P0-2. ⚠️ Not tested live (it needs your admin credentials) |
| **P0-4** | Duplicate host risk | Any production `*.vercel.app` alias would serve a full copy of the site | 🔧 Production now 308-redirects `*.vercel.app` to the real domain (`next.config.ts`) |
| **P1-1** | No vacancies published | `/jobs` shows "No vacancies found" | Publish real vacancies. There's nothing for Google Jobs to index until then |
| **P1-2** | No contact details or NAP | `/contact`, footer | Admin → Site Settings (phone, email, WhatsApp; address only if a real office exists) |
| **P1-3** | Empty job hubs indexable and in the sitemap | 5 category hubs + Kampala hub listed with 0 jobs | 🔧 Hubs are indexable **only with ≥1 open vacancy**, avoiding soft-404 / thin listings |
| **P1-4** | Unreliable `lastmod` | 21 sitemap entries showed the request timestamp | 🔧 `lastmod` only where a real edit date exists |

---

## 4. Complete URL inventory

These are all the routes that exist (from the code and the sitemap). The canonical host is `https://www.joblinkuganda.com`. "Index" is the state **after** the P0 fixes.

| URL | Purpose | Intent | Primary keyword (hypothesis) | Index | Schema | Priority |
|---|---|---|---|---|---|---|
| `/` | Dual-audience home | Commercial + navigational | recruitment agency Kampala | ✅ | Organization, WebSite | P0 |
| `/jobs` | Vacancy search | Transactional | jobs in Uganda / vacancies | ✅ (filters noindex) | BreadcrumbList | P0 |
| `/jobs/[title-location-jlID]` | Vacancy | Transactional | "[job title] job Kampala" | ✅ while open | JobPosting, BreadcrumbList | P0 |
| `/jobs/category/hospitality` | Hub | Transactional | hospitality jobs Uganda | Only with ≥1 job | BreadcrumbList | P1 |
| `/jobs/category/restaurant` | Hub | Transactional | restaurant jobs Kampala | Only with ≥1 job | BreadcrumbList | P1 |
| `/jobs/category/hotel` · `/kitchen` · `/bar-and-cafe` · `/sales` · `/office-and-administration` · `/cleaning-and-facilities` · `/general-work` | Hubs | Transactional | "[category] jobs Uganda" | Only with ≥1 job | BreadcrumbList | P2 |
| `/jobs/location/kampala` | Location hub | Transactional + local | jobs in Kampala | Only with ≥1 job | BreadcrumbList | P1 |
| `/jobs/category/[c]/location/[l]` | Combination | Transactional + local | restaurant jobs in Kampala | 404 at 0 jobs, indexable at ≥3 | BreadcrumbList | P2 |
| `/recruitment-services` | Employer hub | Commercial | recruitment services Kampala | ✅ | BreadcrumbList | P0 |
| `/recruitment-services/hospitality-recruitment` | Service pillar | Commercial | hospitality recruitment Uganda | ✅ | Service, BreadcrumbList | P0 |
| `/recruitment-services/restaurant-staff-recruitment` | Service | Commercial | restaurant staff recruitment Kampala | ✅ | Service | P1 |
| `/recruitment-services/hotel-staff-recruitment` | Service | Commercial | hotel staff recruitment Uganda | ✅ | Service | P1 |
| `/recruitment-services/general-recruitment` | Service | Commercial | staff recruitment Uganda | ✅ | Service | P1 |
| `/hire-staff` | Conversion form | Transactional | hire staff Kampala | ✅ | BreadcrumbList | P1 |
| `/for-job-seekers` | Candidate guide | Informational | how to find a job in Uganda | ✅ | BreadcrumbList | P2 |
| `/how-it-works` | Transparency | Informational | how recruitment agencies work Uganda | ✅ | BreadcrumbList | P2 |
| `/recruitment-safety` | Scam awareness pillar | Informational | fake job offers Uganda | ✅ | BreadcrumbList | P1 |
| `/career-resources` | Resources hub | Informational | career advice Uganda | ✅ (page>1 noindex) | BreadcrumbList | P2 |
| `/career-resources/category/[slug]` | Topic hubs | Informational | — | ✅ only with articles, else 404 | BreadcrumbList | P3 |
| `/career-resources/[slug]` (×3) | Articles | Informational | see section 14 | ✅ | BlogPosting, BreadcrumbList | P2 |
| `/about` · `/contact` | Trust | Navigational | Job Link Uganda | ✅ | Organization (about) | P1 |
| `/privacy-policy` · `/terms` | Legal | — | — | ✅ | — | P3 |
| `/admin/*` · `/api/*` · `/track` | Private | — | — | Blocked (robots) | — | — |

- **Orphans:** none. Every indexable route is linked from the header, the footer, hubs or cards. ✅ Verified in the navigation config and templates.
- **Missing pages vs discovery plan:** location landing pages (`/locations/*`) are intentionally **not built** until there's genuine activity outside Kampala. An FAQ page is intentionally merged into service pages.

---

## 5. Sitemap audit (the attached sitemap)

| Check | Result |
|---|---|
| Valid XML / namespace | ✅ `urlset` with the sitemaps.org 0.9 namespace |
| HTTPS | ✅ |
| **Correct host** | ❌ All 28 URLs on `joblink-uganda.vercel.app` (404). Fixed by P0-2 |
| Duplicates / parameters | ✅ none |
| Redirected URLs | ❌ indirectly: every URL points at a dead host |
| Non-indexable URLs listed | ❌ 6 job hubs with 0 jobs (thin / soft-404 risk) 🔧 |
| `lastmod` accuracy | ❌ 21 URLs used the generation time 🔧 |
| Missing important pages | ✅ none. There are no vacancies to list yet |
| Size | ✅ 28 URLs (limit 50,000 / 50 MB) |
| Referenced in robots.txt | ✅ when indexable (`Sitemap:` line). Not while `Disallow: /` is in place |

## 6. Recommended sitemap structure

**One `/sitemap.xml` is correct at this size.** Splitting into `/pages-sitemap.xml`, `/jobs-sitemap.xml` and so on adds no crawl benefit below roughly several thousand URLs. Split into a sitemap index only when the jobs archive grows large.

**After the fixes, with no vacancies yet, the sitemap is exactly (22 URLs):**
```
https://www.joblinkuganda.com/
https://www.joblinkuganda.com/jobs
https://www.joblinkuganda.com/recruitment-services
https://www.joblinkuganda.com/hire-staff
https://www.joblinkuganda.com/for-job-seekers
https://www.joblinkuganda.com/how-it-works
https://www.joblinkuganda.com/recruitment-safety
https://www.joblinkuganda.com/career-resources
https://www.joblinkuganda.com/about
https://www.joblinkuganda.com/contact
https://www.joblinkuganda.com/privacy-policy
https://www.joblinkuganda.com/terms
https://www.joblinkuganda.com/recruitment-services/hospitality-recruitment        (lastmod = CMS edit)
https://www.joblinkuganda.com/recruitment-services/restaurant-staff-recruitment   (lastmod)
https://www.joblinkuganda.com/recruitment-services/hotel-staff-recruitment        (lastmod)
https://www.joblinkuganda.com/recruitment-services/general-recruitment            (lastmod)
https://www.joblinkuganda.com/career-resources/cv-for-hospitality-jobs            (lastmod)
https://www.joblinkuganda.com/career-resources/restaurant-interview-questions     (lastmod)
https://www.joblinkuganda.com/career-resources/job-description-for-restaurant-staff (lastmod)
https://www.joblinkuganda.com/career-resources/category/cvs-and-applications
https://www.joblinkuganda.com/career-resources/category/hiring-advice
https://www.joblinkuganda.com/career-resources/category/interviews
```

Added automatically as content appears:
- **Each open vacancy**, with `lastmod`.
- **Each job category or location hub** once it has at least 1 open vacancy.
- **Category × location pages** once they have at least 3.

Closed and expired vacancies drop out automatically. Implementation: `src/app/sitemap.ts` 🔧.

---

## 7. Keyword research (Uganda)

**Sources:** live results pages for the core queries (28 Sep 2026), plus the discovery research in `docs/01-discovery-seo-architecture.md`. **No volumes are claimed.**

**Observed results-page patterns (✅ observed):**
- **"jobs in Kampala / Uganda":** high-volume aggregators (AllJobspo, Fuzu, Naukri, Great Uganda Jobs, Advance Africa, BrighterMonday, UNjobs). Titles lean on dates and counts ("September 2026 Latest Vacancies", "9879+"). These results pages are **very hard** for a new site without large inventory.
- **"hotel / restaurant jobs Kampala":** BrighterMonday category pages, Jiji classifieds, AllJobspo, EverJobs, UgandaJob.
- **"recruitment agencies in Kampala / Uganda":** listicles (Flexi Personnel "5 Best…", Alliance "Top…"), directories (Yellow.ug), agencies (Airswift, Ajeets, RS Recruitment, Q-Sourcing, Manpower Uganda), and an EEMIS listing. This is **winnable with strong service pages, a Google Business Profile, and directory citations.**
- **"staffing agency Uganda / temporary staff":** Q-Sourcing, Airswift, Houston Executive Consulting (HE Consulting), Manpower Uganda.

| Cluster | Keywords (examples) | Intent | Opportunity (qualitative) |
|---|---|---|---|
| **Primary (employer)** | recruitment agency Kampala · recruitment agency Uganda · recruitment services Uganda · staff recruitment Uganda | Commercial | **High**: realistic with service pages + GBP |
| **Hospitality niche (employer)** | hospitality recruitment Uganda/Kampala · restaurant staff recruitment · hotel staff recruitment · hire waiters Kampala | Commercial | **Highest**: weak competition, matches experience |
| **Job seeker (niche)** | hospitality jobs Uganda · restaurant jobs Kampala · hotel jobs Kampala · waiter / waitress / barista / chef jobs Kampala | Transactional | Medium: needs live vacancies |
| **Job seeker (head)** | jobs in Uganda · jobs in Kampala · vacancies in Uganda · latest jobs Uganda | Transactional | Low in year 1 (aggregator-dominated) |
| **Long-tail vacancies** | "[job title] job in Kampala", "[job title] vacancy Uganda" | Transactional | **High in aggregate** via individual job pages + Google Jobs |
| **Local** | … in Kampala / Entebbe / Wakiso / Mukono / Jinja | Local | Kampala now; others only with real activity |
| **Informational (seekers)** | how to write a CV in Uganda · interview questions and answers · how to find a job in Uganda · fake job offers Uganda | Informational | Medium–high: builds authority and links |
| **Informational (employers)** | how to recruit restaurant staff · job description template · cost of recruitment agency Uganda | Commercial investigation | Medium |
| **Other categories in the brief** (driver, accounting, IT, teaching, NGO, remote jobs) | — | Transactional | ⚠️ **Only if Job Link actually recruits for them.** Creating pages without vacancies would be thin content |

Question keywords to cover in content: "how to know a fake job in Uganda", "what to include in a CV in Uganda", "how much do recruitment agencies charge in Uganda" (⚠️ only with confirmed fee information), "how to get a hotel job in Uganda".

---

## 8. Keyword-to-page map

One primary keyword per page. The live ranking column is empty because the site isn't indexed.

| Page | Primary | Secondary | Intent | Title (implemented) | H1 (implemented) |
|---|---|---|---|---|---|
| `/` | recruitment agency Kampala | recruitment agency Uganda, jobs in Uganda | Commercial | Recruitment Agency in Kampala, Uganda \| Job Link Uganda | The right people for the right jobs in Uganda. |
| `/recruitment-services` | recruitment services Kampala | staffing, staff recruitment Uganda | Commercial | Recruitment Services in Kampala, Uganda | Recruitment services for employers in Uganda |
| `/recruitment-services/hospitality-recruitment` | hospitality recruitment Uganda | hospitality recruitment Kampala, hospitality staffing | Commercial | Hospitality Recruitment in Kampala, Uganda | Hospitality Recruitment |
| `/recruitment-services/restaurant-staff-recruitment` | restaurant staff recruitment | hire waiters Kampala, restaurant staffing | Commercial | Restaurant Staff Recruitment in Kampala | Restaurant Staff Recruitment |
| `/recruitment-services/hotel-staff-recruitment` | hotel staff recruitment Uganda | hotel staffing Kampala | Commercial | Hotel Staff Recruitment in Kampala | Hotel Staff Recruitment |
| `/recruitment-services/general-recruitment` | staff recruitment Uganda | employee recruitment Kampala | Commercial | Staff Recruitment Services in Kampala, Uganda | General Recruitment |
| `/jobs` | jobs in Uganda | job vacancies Uganda | Transactional | Jobs in Uganda: Current Vacancies | Jobs in Uganda |
| `/jobs/location/kampala` | jobs in Kampala | vacancies Kampala | Transactional | Jobs in Kampala: Current Vacancies | Jobs in Kampala |
| `/jobs/category/hospitality` | hospitality jobs Uganda | hotel & restaurant jobs | Transactional | Hospitality Jobs in Uganda | Hospitality jobs in Uganda |
| `/jobs/category/restaurant` | restaurant jobs Kampala | waiter jobs, waitress jobs | Transactional | Restaurant Jobs in Kampala and Uganda | Restaurant jobs in Uganda |
| `/recruitment-safety` | fake job offers Uganda | verify recruitment agency Uganda, EEMIS | Informational | How to Recognise a Genuine Job Offer | How to recognise a genuine job opportunity |
| Articles | see section 14 | | Informational | | |

**Cannibalisation risks and resolutions:**
- `/` vs `/recruitment-services`: the home page targets "recruitment agency", while the hub targets "recruitment services". Internal links reinforce the split: "recruitment agency" anchors point to `/`, and "our recruitment services" anchors point to the hub.
- `/jobs/category/hospitality` vs `/recruitment-services/hospitality-recruitment`: different intent (job seeker vs employer). They cross-link, and titles differ ("Jobs" vs "Recruitment"). ✅ Low risk.
- `/jobs/category/restaurant` H1 says "in Uganda" while its title says "in Kampala and Uganda". 💡 Align both, e.g. "Restaurant jobs in Kampala and Uganda" (CMS title override + template).

---

## 9. Page-by-page recommendations (key pages)

The meta descriptions below are 🔧 **already rewritten in code**. The CMS ones take effect on the live database once you run `npm run seo:update-meta` (section 25).

| Page | CURRENT description (length) | RECOMMENDED description (length) |
|---|---|---|
| `/` | "Job Link Uganda helps businesses find suitable, screened staff and helps job seekers reach genuine vacancies. Specialists in hospitality and restaurant recruitment in Kampala." (175) | "Job Link Uganda helps businesses hire screened staff and helps job seekers find genuine vacancies. Specialists in hospitality recruitment in Kampala." (149) |
| `/jobs` | 177 | "Current job vacancies in Kampala and across Uganda, including hospitality, restaurant and hotel jobs. Each listing shows the requirements and how to apply." (155) |
| `/recruitment-services` | 178 | "Recruitment services in Kampala for hospitality, restaurant, hotel and general roles. Candidates are sourced and screened against your requirements." (148) |
| `/recruitment-services/hospitality-recruitment` (CMS) | 186 | "Hospitality recruitment in Kampala for restaurants, hotels and cafés. We source and screen waiters, chefs, baristas, supervisors and hotel staff." (145) |
| `/about` | 187 | "Job Link Uganda is a Kampala recruitment agency connecting employers with suitable staff and job seekers with genuine vacancies, focused on hospitality." (152) |
| `/recruitment-safety` | 188 | "Practical checks to tell a genuine job offer from a recruitment scam in Uganda: warning signs, verifying a recruiter and protecting your documents." (147) |
| `/career-resources` | 198 | "Practical career advice for job seekers in Uganda: CV writing, interview preparation, hospitality careers and avoiding scams, plus hiring guides." (145) |

Also updated: `/for-job-seekers` (170→149), `/hire-staff` (174→152), `/how-it-works` (186→144), the Kampala hub template (159→135), and 6 more CMS descriptions (services, job categories, articles).

**Page-level content recommendations** 💡
- **Service pages:** add a short "Areas we recruit in" line (Kampala, plus other areas only if genuinely served) and at least one real, consented example of the process ("A typical restaurant brief includes…"). **No invented clients.**
- **`/about`:**
  - Add a named person or team (with consent), how long Job Link has operated, and registration or licence numbers (⚠️ business input).
  - This is the single biggest E-E-A-T gain available.
- **`/contact`:** real phone, email and WhatsApp. An address and map **only if** a verified office exists.
- **Articles:** add a featured image to each. BlogPosting rich results expect an image, and share previews improve.
- **Headings:** H2/H3 structure is ✅ logical on all templates (verified in the code). Image alt text ✅ is descriptive. The hero is decorative (`alt=""`, correct).

---

## 10. Technical SEO audit

| Area | Status | Notes |
|---|---|---|
| Rendering | ✅ | Server components; full HTML served to Googlebot (verified by fetching as Googlebot) |
| Canonicals | ❌ → env fix | Self-referencing canonicals, absolute URLs, filters point to clean URLs. Only the host is wrong |
| robots.txt | ✅ logic | Production (indexable): allows `/` and `/api/media/file/`, disallows `/admin`, `/api/`, `/track`, `?sort=` |
| Redirects | ✅ | 308 permanent; slug changes create CMS 301s; job slugs self-canonicalise via 308 |
| Pagination | ✅ | `?page=N` is noindex/follow with canonical to page 1; rel prev/next links present (harmless, not used by Google) |
| Faceted navigation | ✅ | Free filters noindex; only curated hubs are indexable |
| Duplicate content | ✅ | One host (after fixes); trailing slash normalised; no parameter duplicates indexed |
| Images | ✅ | AVIF/WebP, responsive `srcset`, explicit dimensions (CLS 0), lazy below the fold 🔧; above-the-fold images eager + high priority |
| Fonts | ✅ | Self-hosted via next/font, `display: swap`. 83 KB total (Inter 48 KB, Montserrat 35 KB) |
| JavaScript | ✅ | 148 KB compressed across 7 files; 28 KB unused (framework). No third-party scripts |
| CSS | ✅ | 10 KB, one file |
| Caching / CDN / compression | ✅ | Vercel edge, Brotli, ISR |
| **LCP (lab)** | ⚠️ | Mobile emulated slow 4G: **3.6–4.3 s** (target ≤2.5 s). 🔧 Fixed: lazy-loaded above-the-fold service photo (−1.1 s of load delay), scroll animations hiding on-screen content, and opacity-0 entrance fades. Remaining time is mostly bandwidth (about 370 KB total) and framework CPU. **Field data after launch decides** |
| INP | ⚠️ unverified | Lab TBT 180–500 ms. Needs field data |
| CLS | ✅ 0 | All pages tested |
| Mobile | ✅ | No horizontal overflow at 390/768/1440 px; tap targets ≥44 px; axe WCAG 2.2 AA: 0 violations |
| Crawl depth | ✅ | Every indexable page within 3 clicks of `/` |
| HTTP → HTTPS → www | ⚠️ minor | 2 hops from `http://apex`. Negligible SEO impact; Vercel limitation |

💡 **Optional performance lever (a design decision):** replacing the Inter body font with the system font stack saves about 48 KB on every first visit (roughly −0.2 to −0.3 s LCP on slow 3G/4G). Montserrat headings keep the brand. Recommended if field LCP comes in above 2.5 s.

---

## 11. Structured data plan

| Type | Where | Why | Data source (all visible on the page) | Status |
|---|---|---|---|---|
| Organization (→ EmploymentAgency when a verified office exists) | `/`, `/about` | Entity and knowledge-panel signals | Name, logo, URL, slogan, areaServed; telephone/email/ContactPoint/sameAs **only when set in Site Settings** | ✅ (🔧 ContactPoint added) |
| WebSite | `/` | Site name in results | name, url, publisher | ✅ No SearchAction: Google retired the sitelinks search box (2024) |
| BreadcrumbList | All inner pages | Breadcrumb display in results | The same array renders the visible breadcrumb | ✅ |
| JobPosting | Open vacancies only | Google job search | See section 12 | ✅ |
| Service | Service pages | Relevance | name, description, provider, areaServed | ✅ |
| BlogPosting | Articles | Article understanding | headline, dates, author (real person or Organization) | ✅ 💡 add featured images |
| FAQPage | **Not used** | Google limits FAQ rich results to authoritative government and health sites | — | ✅ Deliberate |
| Review / AggregateRating | **Never** (no genuine third-party reviews exist) | — | — | ✅ |

Validate after launch with the **Rich Results Test** and the **Schema Markup Validator** on one page of each type.

---

## 12. Google Jobs strategy

**Verified in code** (`src/lib/seo/jsonld/job-posting.ts`, `src/domain/jobs/lifecycle.ts`, with unit and end-to-end tests):

| Property | Implementation |
|---|---|
| title, description | From the visible title, summary, responsibilities, requirements, experience, benefits and how-to-apply (HTML-escaped) |
| datePosted | The first time the job is set to Open |
| validThrough | End of the closing day in Kampala time, or posting date + 30 days if there's no closing date |
| hiringOrganization | The named employer (with permission), otherwise Job Link Uganda for confidential roles |
| jobLocation | Place → PostalAddress (locality, region, UG) |
| employmentType | Google enum values |
| baseSalary | **Only** when a confirmed salary is published |
| directApply | `false` (online applications are off until PDPO registration) |
| identifier | JL + reference |

**Expired jobs** (automatic, ✅ tested end to end):
- Past the closing date or marked filled: the page shows a visible **"This vacancy is closed"** notice. JobPosting is **removed**, the page becomes `noindex`, and it leaves the sitemap, listings and search.
- After 90 days: 404, or a 301 to its category.

💡 **Actions:**
1. **Publish real vacancies.** This is the only blocker.
2. After the P0 fixes, test one live job URL in the **Rich Results Test**.
3. Request indexing in Search Console for new jobs.
4. **Optional:** the Google Indexing API (officially allowed for JobPosting pages) for faster pickup and removal. It needs a Google Cloud service account.

⚠️ Google's job search experience covers **Sub-Saharan Africa** per Google's documentation. Visibility in Uganda specifically can't be verified until jobs are indexed.

---

## 13. Local SEO strategy (Uganda)

1. **Google Business Profile (highest local impact for "recruitment agency Kampala"):**
   - Category **"Employment agency"** (secondary: "Recruiter").
   - If there's no public office, set it up as a **service-area business** covering Kampala and the nearby districts you actually serve.
   - Use the **exact same name, phone and website** as the site.
   - Post each new vacancy as a GBP update.
   - ⚠️ An address can only be shown if one genuinely exists.
2. **NAP consistency:** one canonical name ("Job Link Uganda"), one phone format, and `https://www.joblinkuganda.com` everywhere: the website, GBP, Facebook, LinkedIn and directories.
3. **Reviews:** ask real employers and placed candidates to review you **on Google**. Never incentivise or fabricate reviews. Reply to every review. Don't mark up reviews on your own site.
4. **Location pages:**
   - **Kampala only**, served by `/jobs/location/kampala` plus service-page copy.
   - Add Entebbe, Wakiso, Mukono, Jinja, Mbarara, Gulu or Mbale **only** once there are real vacancies or clients there (the system then indexes them automatically).
   - **No doorway pages.**
5. **Citations:** Yellow.ug (it ranks for "employment agencies Kampala"), Google Maps, Bing Places, Facebook Page, LinkedIn Company, the Uganda Chamber of Commerce directory and relevant sector associations. Keep NAP identical.
6. **Local authority:** hospitality training institutes (e.g. UHTTI), university career offices, and hospitality associations. See section 16.

---

## 14. Content strategy (6 months)

**Rules:**
- Each article answers a real query.
- Each links to one conversion page.
- No invented statistics or salaries.
- Maximum pace: 2 articles a month, at quality.

| # | Title | Primary keyword | Audience | URL | Words | Links to | CTA |
|---|---|---|---|---|---|---|---|
| 1 | How to Recognise a Fake Job Offer in Uganda | fake job offer Uganda | Seekers | `/career-resources/fake-job-offers-uganda` | 1,200–1,600 | `/recruitment-safety`, `/jobs` | Browse genuine jobs |
| 2 | How to Find a Job in Kampala: A Practical Guide | how to find a job in Kampala | Seekers | `/career-resources/find-a-job-in-kampala` | 1,500–2,000 | `/jobs/location/kampala`, CV article | Browse jobs |
| 3 | Waiter and Waitress Interview Questions (with Sample Answers) | waiter interview questions | Seekers | `/career-resources/waiter-interview-questions` | 1,200–1,500 | Restaurant jobs hub | Restaurant jobs |
| 4 | How to Become a Barista in Uganda | barista jobs Uganda | Seekers | `/career-resources/become-a-barista-uganda` | 1,000–1,400 | Bar & café hub | Hospitality jobs |
| 5 | Hospitality Careers in Uganda: Roles and How to Progress | hospitality careers Uganda | Seekers | `/career-resources/hospitality-careers-uganda` | 1,800–2,200 | Hospitality hub, 3 articles | Hospitality jobs |
| 6 | Cover Letter Guide for Jobs in Uganda (with Template) | cover letter Uganda | Seekers | `/career-resources/cover-letter-guide` | 1,200–1,500 | CV article | Browse jobs |
| 7 | How to Hire Reliable Restaurant Staff in Kampala | hire restaurant staff Kampala | Employers | `/career-resources/hire-restaurant-staff-kampala` | 1,500–1,800 | Restaurant recruitment service | Request staff |
| 8 | Recruitment Agency or Hire Yourself? A Guide for Ugandan Businesses | recruitment agency vs direct hiring | Employers | `/career-resources/agency-vs-direct-hiring` | 1,400–1,800 | `/recruitment-services`, `/how-it-works` | Request staff |
| 9 | How to Screen Hospitality Candidates Before Interview | screening candidates | Employers | `/career-resources/screening-hospitality-candidates` | 1,200–1,500 | Hospitality service | Request staff |
| 10 | Staff Onboarding Checklist for Restaurants and Hotels | staff onboarding checklist | Employers | `/career-resources/onboarding-checklist` | 1,000–1,400 | Hotel service | Request staff |
| 11 | Reducing Staff Turnover in Hospitality Businesses | staff retention hospitality | Employers | `/career-resources/reduce-staff-turnover` | 1,400–1,800 | Hospitality service | Talk to us |
| 12 | Your First Job in Uganda: A Guide for School Leavers and Graduates | first job Uganda | Seekers | `/career-resources/first-job-uganda` | 1,500–1,800 | `/for-job-seekers`, `/jobs` | Browse jobs |

- **H2 structure pattern:** problem → practical steps → examples → common mistakes → next step, adapted per article.
- **Schema:** BlogPosting (automatic).
- **Linking both ways:** each new article links to its pillar, and the pillar or hub links back via "Related".
- **Salary content:** ⚠️ only with a reliable, cited source.

---

## 15. Internal linking plan

```
Home ──► Jobs ──► Category hubs ──► Vacancies ──► Similar vacancies / category
  │                    ▲    │
  │                    │    └──► "Hiring for these roles?" ──► Service page
  └──► Recruitment services ──► Hospitality (pillar) ──► Restaurant / Hotel services
                                     │                          │
                                     └──► Hospitality jobs ◄────┘
Articles ──► related job category or service ──► Hire staff / Jobs
```

**Implemented ✅:**
- Header and footer navigation.
- Hub-to-service cross-links.
- Service-to-job-hub links.
- Related vacancies on each job page.
- Each article's primary CTA linking to its category or service.
- Breadcrumbs.

**Add 💡:**
1. Home "Why employers" section: link the phrase "hospitality recruitment" to the pillar (currently a button).
2. Each article: 2–3 **contextual in-text** links (e.g. the CV article → "restaurant interview questions").
3. `/recruitment-safety` → the fake-job-offer article (#1) once published.
4. Kampala hub intro → the restaurant and hospitality hubs.

**Anchor text:** vary it ("our hospitality recruitment service", "restaurant jobs in Kampala", "how we recruit"). Never repeat one exact-match phrase sitewide.

---

## 16. Backlink & authority strategy (ethical)

| Tactic | Targets | Effort |
|---|---|---|
| Business directories (quality, relevant) | Yellow.ug, Uganda Chamber of Commerce, Kampala Capital City business listings (⚠️ verify availability), Bing Places | Low |
| Education partnerships | UHTTI (Uganda Hotel & Tourism Training Institute), hospitality and catering schools, university career offices: offer CV and interview workshops; they link to you as a placement partner | Medium |
| Industry associations | Uganda Hotel Owners Association, Uganda Tourism Association, restaurant owners' groups (⚠️ confirm membership criteria) | Medium |
| Employer partners | Clients you recruit for (with permission): "Our staff are recruited through Job Link Uganda" link or case note | Medium |
| Media / PR | A scam-awareness angle (topical after the 2026 de-licensing news); a hospitality jobs market commentary for Daily Monitor, New Vision, Nile Post business desks | Medium |
| Guest contributions | Hospitality blogs, HR communities (e.g. Uganda HR networks): **genuine** expert articles | Medium |
| Linkable assets | The recruitment safety guide, a free job-description template, an interview-question PDF | Medium |

**Excluded:** paid links, private blog networks (PBNs), automated or mass directory submissions, comment spam, link exchanges.

---

## 17. E-E-A-T and trust improvements

| Signal | Status | Action |
|---|---|---|
| Who we are | ✅ `/about` | 💡 Add a named founder or team (with consent), years operating, company registration (⚠️ input) |
| Contact information | ❌ | Site Settings: phone, email, WhatsApp |
| Physical presence | ⚠️ unknown | Show an address **only if** verified |
| Licences | ⚠️ unknown | If MGLSD-licensed, the site already displays the number automatically (`src/config/business.ts`) |
| Privacy / terms | ✅ (draft notice) | Legal review, then set `legal.reviewed = true` |
| Cookie info | ✅ | No tracking cookies; the privacy policy explains the anonymous statistics |
| Vacancy verification policy | 💡 | Add a short "How we verify vacancies" section to `/how-it-works`: every vacancy comes from an employer brief we have discussed. **State only what you actually do** |
| Report suspicious jobs | 💡 | A "Report a suspicious job" link to a real email or WhatsApp, on `/recruitment-safety` and job pages |
| Scam guidance | ✅ | `/recruitment-safety` including EEMIS verification |

---

## 18. Social / sharing

- ✅ **OG and Twitter tags** on all pages: `og:title`, `og:description`, `og:image` (1200×630 default: logo on white), `og:locale en_UG`, `summary_large_image`.
- ❌ **URLs use the wrong host.** Fixed by P0-2. WhatsApp and Facebook cache previews, so after fixing, **re-scrape** with the Facebook Sharing Debugger and LinkedIn Post Inspector.
- 💡 **Better share images:**
  - A branded 1200×630 card per page type (e.g. "Hospitality Recruitment · Job Link Uganda" on the brand black with the flag bar).
  - For vacancies, a dynamic OG image (`opengraph-image.tsx` in `/jobs/[slug]`) showing title, location and "Apply by" date.

  These noticeably improve WhatsApp click-through, the main sharing channel in Uganda.

---

## 19. Google Search Console plan

**Setup (day of launch):**
1. Add a **Domain property** `joblinkuganda.com` and verify via **DNS TXT** at your registrar.
2. Submit `https://www.joblinkuganda.com/sitemap.xml`.
3. URL Inspection → Test live URL for `/`, `/jobs`, the hospitality service page and one job → **Request indexing**.
4. Link GSC with GA4 or Looker Studio if used.

| Weekly | Monthly |
|---|---|
| **Pages** (indexing report): "Crawled/Discovered – not indexed", "Soft 404", "Duplicate without user-selected canonical" | Performance: **queries** gaining impressions → new content ideas and title tests |
| **Job postings** enhancement report (errors, warnings) | Performance by **page**: CTR < 2% with position < 10 → rewrite the title or description |
| Manual actions / Security issues | **Countries**: confirm Uganda dominates; spot overseas traffic |
| New vacancies indexed (URL Inspection) | **Core Web Vitals** (field) once data exists: LCP, INP, CLS by URL group |
| Sitemap status (submitted vs indexed) | Links report: new referring domains |

---

## 20. Analytics plan

**Already built ✅** (privacy-first, no cookies; see the admin dashboard): page views, visitors, job views, sources, devices, enquiries.

**Recommended additions:**
- 💡 Extend the same beacon with **events**:
  - `whatsapp_click` (with context: job, employer, general)
  - `phone_click` and `email_click`
  - `apply_instructions_view` (scroll or click to "How to apply")
  - `job_search` (query and filter usage, anonymised)
  - `enquiry_submit` (already stored as records)

  This keeps analytics cookie-free and consistent with the privacy policy.
- 💡 **GA4 is optional.** It sets cookies, so it would need a consent banner and a privacy-policy update under the Data Protection and Privacy Act. **Recommended stack:** Search Console (search data) + built-in analytics (on-site behaviour).
- **KPIs:** employer enquiries per month, job views per vacancy, WhatsApp contacts, organic clicks (GSC), and indexed vacancies.

---

## 21. Competitor analysis (observed 28 Sep 2026)

| Competitor type | Examples | Strengths | Gaps Job Link can exploit |
|---|---|---|---|
| Aggregators | AllJobspo, Fuzu, Great Uganda Jobs, Advance Africa, BrighterMonday, Jiji | Huge inventory, domain authority, date/count titles | Generic, no screening, weak trust and scam guidance, little hospitality depth |
| Listicle / directory | Flexi Personnel "5 Best…", Alliance "Top…", Yellow.ug | Rank for "recruitment agencies Uganda" | 💡 **Get listed on them**; they're link and visibility opportunities |
| General / technical agencies | Airswift (energy/STEM), Q-Sourcing, Manpower Uganda, HE Consulting | Established brands, broad services | Not hospitality specialists |
| Overseas-focused | Ajeets, RS Recruitment, Freshmind, Oman Agencies | Rank for international recruitment | Job Link is domestic and transparent (no overseas advertising until licensed) |

**Differentiation:**
- Hospitality and restaurant specialism.
- Transparency (process, safety, EEMIS guidance).
- Every vacancy screened and current (automatic expiry).
- A fast, accessible mobile site.

**Unverified ⚠️:** competitors' ranking keywords and backlink profiles need a paid tool (Ahrefs or Semrush).

---

## 22. Priority matrix

| Pri | Problem | Why it matters | Exact fix | Benefit | Difficulty |
|---|---|---|---|---|---|
| **P0** | Canonical, sitemap, OG and schema host = dead `vercel.app` | Google would consolidate signals to a 404 host | Vercel → Env `NEXT_PUBLIC_SITE_URL=https://www.joblinkuganda.com` → Redeploy | Required for any ranking | Trivial |
| **P0** | Site noindex + robots Disallow | Nothing can be indexed | `SITE_INDEXABLE=true` → Redeploy (after P0 above + contact details) | Required | Trivial |
| **P0** | Admin CSRF bound to the Vercel host | Can't log in to publish jobs | Same env fix | Operational | Trivial |
| **P0** | Push pending code | Fixes aren't live until deployed | `git push` (section 25) | All code fixes | Trivial |
| **P1** | No vacancies | No Google Jobs visibility, empty hubs | Publish real jobs | Large | Business |
| **P1** | No contact / NAP | Trust, local SEO, conversions | Site Settings | Large | Trivial |
| **P1** | CMS descriptions too long | Truncated snippets | `npm run seo:update-meta` against Neon | Medium (CTR) | Low |
| **P1** | Google Business Profile | Local pack for "recruitment agency Kampala" | Create and verify GBP | Large (local) | Low |
| **P1** | Search Console | No visibility into indexing | Section 19 | Monitoring | Low |
| **P2** | LCP 3.6–4.3 s (lab) | CWV is a (minor) ranking and UX factor | 🔧 shipped fixes; then check field data; optional system body font | Medium | Low |
| **P2** | Articles lack images | Weaker rich results and shares | Add featured images | Low–medium | Low |
| **P2** | E-E-A-T gaps | Trust for YMYL-adjacent (employment) queries | Section 17 | Medium | Business |
| **P2** | Content velocity | Topical authority | Section 14 (2/month) | Large over time | Medium |
| **P3** | 2-hop HTTP redirect | Negligible | Accept (Vercel) | Minimal | — |
| **P3** | Dynamic OG images for jobs | WhatsApp CTR | `opengraph-image.tsx` for jobs | Low–medium | Medium |

---

## 23. 30-day plan
- **Day 1:** push the code; set `NEXT_PUBLIC_SITE_URL`; redeploy; verify that canonicals and the sitemap show `www.joblinkuganda.com`; log into the admin.
- **Days 2–3:** Site Settings (contact details); run `seo:update-meta` on Neon; publish the first real vacancies; review service copy.
- **Days 4–7:** `SITE_INDEXABLE=true` → redeploy; Search Console + sitemap; Rich Results Test on a job and a service; Google Business Profile.
- **Week 2:** Bing Webmaster; citations (Yellow.ug, Facebook, LinkedIn); re-scrape social previews.
- **Weeks 3–4:** articles #1–#2; contextual internal links; article featured images.

## 24. 90-day and 6-month plans
- **By day 90:**
  - 6 articles.
  - A steady flow of real vacancies.
  - 5–10 quality citations and 2–3 partnership links (schools, associations).
  - First GSC query review → title and description tests.
  - Field CWV review.
- **Months 4–6:**
  - Articles #7–#12.
  - Location hubs outside Kampala only where real vacancies exist.
  - A PR piece (scam awareness / hospitality market).
  - Review programme via GBP.
  - Consider the Indexing API if job volume grows.
  - Evaluate expanding categories (e.g. drivers, office) **only** with real vacancies.

---

## 25. Exact code changes (this repository)

**🔧 Implemented (ships on push):**

| File | Change |
|---|---|
| `next.config.ts` | **Build guard:** fails if `SITE_INDEXABLE=true` while `NEXT_PUBLIC_SITE_URL` is missing, `*.vercel.app` or localhost. **Canonical-host redirect:** production 308s `*.vercel.app` → the real domain |
| `src/lib/seo/indexation.ts` (+ tests) | Job category and location hubs are indexable only with ≥1 open vacancy |
| `src/app/sitemap.ts` | Uses the new hub rule; `lastmod` only for real content dates; documented single-sitemap decision |
| `src/app/(frontend)/*/page.tsx` (9 pages) + Kampala hub template | Meta descriptions ≤155 characters |
| `src/seed/*.ts` | Shortened CMS descriptions (new installs) |
| `scripts/update-seo-meta.ts` + `npm run seo:update-meta` | Safely updates the **existing** database's seeded descriptions. It only touches unedited originals (tested: 7 updated, second run 0) |
| `src/lib/seo/jsonld/organization.ts` | ContactPoint (phone/email) once contact details exist |
| `src/app/(frontend)/globals.css` | Entrance animation no longer starts at opacity 0 (it was delaying LCP) |
| `src/components/motion/ScrollAnimations.tsx` | Content already on screen at load is never hidden or re-animated (it was delaying LCP) |
| `src/app/(frontend)/recruitment-services/[slug]/page.tsx` | First image eager + high priority, no reveal (removed about 1.1 s of LCP load delay) |

Also pending from the deployment check: `vercel.json`, R2-safe storage settings, Node 22 pin, lint config.

**Your actions (in order):**
```bash
# 1. Push the code
git add -A && git commit -m "fix(seo): canonical host guard, hub indexation, sitemap lastmod, meta descriptions, LCP" && git push
```
2. **Vercel → Settings → Environment Variables (Production):**
   - `NEXT_PUBLIC_SITE_URL` = `https://www.joblinkuganda.com`
   - Keep `SITE_INDEXABLE` = `false` for now → **Redeploy**.
3. Verify: `https://www.joblinkuganda.com/sitemap.xml` now lists `www.joblinkuganda.com` URLs, and the page source shows `<link rel="canonical" href="https://www.joblinkuganda.com/…">`.
4. Update the live CMS descriptions:
   ```powershell
   $env:DATABASE_URL="<Neon pooled connection string>"; npm run seo:update-meta
   ```
5. Add contact details and vacancies in the admin.
6. Set `SITE_INDEXABLE` = `true` → **Redeploy** → Search Console (section 19).

---

## 26. Final SEO checklist

- [ ] Code pushed and deployed
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.joblinkuganda.com`; canonicals and sitemap verified on www
- [ ] Admin login works on www.joblinkuganda.com
- [ ] `npm run seo:update-meta` run on Neon
- [ ] Site Settings: phone, email, WhatsApp (and social links)
- [ ] At least a few real vacancies published; one tested in the Rich Results Test
- [ ] `SITE_INDEXABLE=true` → robots.txt allows crawling, pages `index, follow`
- [ ] Search Console domain verified, sitemap submitted, key URLs inspected
- [ ] Google Business Profile created with consistent NAP
- [ ] Social previews re-scraped (Facebook, LinkedIn)
- [ ] First 2 articles published, with featured images
- [ ] Citations: Yellow.ug, Facebook, LinkedIn, Bing Places
- [ ] Weekly GSC review routine started (section 19)

**Sources consulted:**
- Google Search Central (JobPosting structured data, sitemaps, canonicalisation, FAQ and sitelinks-search-box changes).
- Live results pages observed 28 Sep 2026: [Flexi Personnel](https://www.flexi-personnel.com/best-recruitment-agencies-in-uganda/), [Alliance Recruitment](https://www.alliancerecruitmentagency.com/recruitment-agencies-uganda/), [Yellow.ug](https://www.yellow.ug/category/employment-agencies/city:kampala), [Airswift](https://www.airswift.com/about/locations/uganda), [Q-Sourcing](https://qsourcing.com/uganda-recruitment-agency/), [Manpower Uganda](https://manpoweruganda.com/), [AllJobspo Kampala](https://jobsinuganda.alljobspo.com/jobs-in-kampala), [Fuzu Kampala](https://www.fuzu.com/uganda/job/kampala), [BrighterMonday Hospitality Kampala](https://www.brightermonday.co.ug/jobs/hospitality-hotel/kampala), [Jiji hotel jobs Kampala](https://jiji.ug/kampala/hotel-jobs), [EverJobs](https://everjobs.ug/jobs/locations/jobs-in-kampala/hotel-restaurant-jobs-in-kampala/), [EEMIS](https://eemis.mglsd.go.ug/).
