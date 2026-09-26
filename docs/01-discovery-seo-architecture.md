# Job Link Uganda — Discovery, SEO Research & Site Architecture

**Status:** Foundation / pre-build. Visual design system on hold until official logo & brand assets are supplied.
**Prepared:** 25 September 2026

Items marked **⚠ REQUIRES BUSINESS INPUT** cannot be answered from research. They must come from Job Link Uganda before the related page or feature goes live.

---

## Steps 1–3: Existing project audit

### Findings

The project directory (`Job Link Uganda Web/`) is **empty**. There is no code, `package.json`, git repository, assets, routing, styling system or SEO setup.

| Area | Current state |
|---|---|
| Framework / dependencies | None |
| Routing | None |
| Components | None |
| Styling system | None |
| Images / fonts / icons | None |
| SEO architecture | None |
| Version control | Not a git repository |

**Preserve:** nothing to preserve.
**Improve:** n/a.
**Build:** everything. Starting from nothing lets us design the architecture around SEO from the beginning, with no legacy URLs to redirect.

### Recommended technical architecture

The brief needs a fast, SEO-first marketing site, a real job platform (indexable job pages, filters, expiry handling), a CMS for non-developers to post jobs and articles, and secure private storage of candidate data (CVs, personal details) with access control. One codebase covers all of that:

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Server-rendered/static HTML for every public page, per-page metadata API, native `sitemap.ts`/`robots.ts`, image optimisation, and most components ship no client JavaScript. |
| CMS + admin + auth | **Payload CMS (runs inside the Next.js app)** | Staff can manage jobs, categories, locations and articles. It has field-level access control, so candidate data is never public. It is self-hosted, so candidate data stays under Job Link's control. |
| Database | **PostgreSQL** (managed, e.g. Neon / Supabase / Railway) | Relational data for jobs, applications and candidates, and full-text search for the jobs page. |
| File storage | **Private S3-compatible bucket** (e.g. Cloudflare R2) | CVs are never public. Staff get short-lived signed URLs. Public images go in a separate public bucket or through `next/image`. |
| Styling | **Tailwind CSS** with design tokens (CSS variables) | Small CSS output. Tokens get filled in from the brand assets. |
| Forms | Server Actions + **Zod** validation, **Cloudflare Turnstile**, honeypot, rate limiting | Server-side validation and spam protection without CAPTCHA friction. |
| Email | Transactional provider (e.g. Resend) | Application confirmations and internal alerts to the recruitment team. |
| Hosting | Vercel or a Node host behind Cloudflare | Global CDN, which matters for Ugandan mobile networks. Edge-cached static pages. |
| Analytics | Google Search Console, Bing Webmaster Tools, plus GA4 or Plausible | Plausible is lighter. GA4 is free and familiar. Choose one. |

**Fonts:** self-hosted through `next/font` (no layout shift, no third-party request). The typeface waits for brand review.
**Icons:** inline SVG icon set (e.g. Lucide), tree-shaken.
**Images:** `next/image` with AVIF/WebP, explicit dimensions, `sizes` attributes, and lazy loading below the fold.

Alternative considered: **Astro plus a separate headless CMS**. It is excellent for static performance, but authenticated applications, candidate data and admin workflows would need a second backend. Next.js + Payload keeps it to one codebase and one deployment, with comparable performance when components default to server rendering.

---

## Step 4: The Ugandan recruitment search landscape

### Who ranks, and for what

**1. "Jobs in Uganda / Kampala / near me"** — dominated by high-volume aggregators and job boards:
- BrighterMonday (`brightermonday.co.ug`): category × location URLs such as `/jobs/hospitality-hotel/kampala`, filters by experience level, separate job-seeker and employer navigation, career blog, learning hub.
- Fuzu, Great Uganda Jobs, AllJobspo, Advance Africa, UOT Magazine, Naukri, Glassdoor, Jiji (classifieds).
- These sites carry thousands of listings, are updated daily and have strong domain authority.

**Implication:** Job Link Uganda **will not realistically rank for head terms like "jobs in Uganda" in the first 12 months**, and should not build its strategy around them. Individual job pages (long tail plus Google for Jobs) and niche hubs (hospitality/restaurant) are winnable.

**2. "Recruitment agency Uganda / Kampala"** — commercial employer intent. The SERP is a mix of:
- Listicles ("5 Best Recruitment Agencies in Uganda" – Flexi Personnel; Alliance Recruitment Agency "Top Recruitment Agencies").
- Directories (Yellow.ug employment agencies in Kampala).
- Agency sites: Premier Recruitment, Career Options Africa, Q-Sourcing Servtec, Ajeets, Airswift (STEM/energy), HE Consulting.

**Implication:** this is the **primary commercial opportunity**. Competitors' service pages are generic and thin. A clearly positioned hospitality and general-staffing recruiter with real service pages, a clear process, and honest trust signals can compete. A listing on Yellow.ug and similar directories also helps local SEO.

**3. "Hospitality / hotel / restaurant jobs Kampala"** — job boards rank with category pages (BrighterMonday, Glassdoor, Naukri, Jiji). Common roles: waiter/waitress, restaurant hostess, bar manager, sous chef, restaurant supervisor, receptionist, kitchen steward. **No agency clearly owns the "hospitality recruitment Uganda" employer niche.** That is Job Link's natural wedge, given its restaurant experience.

**4. "Jobs abroad / overseas jobs for Ugandans"** — a high-demand, high-risk space:
- Ranking: licensed agencies (Freshmind International, Premier Recruitment, RS Uganda, Explorer Dubai), "jobs abroad" aggregator sites, and news about the government register.
- **Regulatory context (critical):** recruiting Ugandans for work abroad is only legal through a firm holding a valid **Ministry of Gender, Labour and Social Development (MGLSD) external employment licence**, registered on **EEMIS** (`eemis.mglsd.go.ug`). In April 2026 the Ministry **de-licensed 275 external recruitment firms** and published a list of roughly 225 licensed firms. Scams by unlicensed brokers are a major public concern.
- Competitor trust signals: licence numbers in the footer (Freshmind: "MGLSD Licensed • License No. …"; Premier: internal and external licence numbers plus UAERA membership).
- Competitor gaps: little fee transparency, weak anti-fraud guidance, no "how to verify us" content.

> **⚠ REQUIRES BUSINESS INPUT:** Does Job Link Uganda hold a current MGLSD **external** employment licence, and is it listed on EEMIS? Does it hold a licence for **domestic** recruitment?
> **If there is no external licence, the website must not advertise or recruit for overseas jobs.** The overseas section stays out of scope until a licence exists. This is both a legal risk and a brand-trust risk.

### Competitor UX/SEO patterns

| Pattern | Seen at | Our response |
|---|---|---|
| Separate Job Seeker / Employer navigation | BrighterMonday, Premier | Adopt. Two clear journeys from the header. |
| Category × location job URLs | BrighterMonday | Adopt, but index only combinations that have live jobs. |
| Licence number displayed site-wide | Freshmind, Premier | Adopt once real licence details are supplied. |
| Fixed WhatsApp button | Premier | Adopt with context-aware, pre-filled messages. Keep it secondary to on-site forms. |
| Placement stats and named testimonials | Freshmind, Alliance | **Do not fabricate.** Add only verified, consented testimonials later. |
| Broken placeholder images, empty categories, expired licence badges | Premier | Avoid. Hide empty categories and never show stale badges. |
| No fee disclosure or scam guidance | Most agencies | **Differentiate:** a "How we work / what we never charge for" page and a scam-awareness guide. |

### Google for Jobs

Google's JobPosting documentation lists **Sub-Saharan Africa** among the regions where the job search experience is available. Correct JobPosting markup on individual job pages is therefore worth implementing. Required: `title`, `description`, `datePosted`, `hiringOrganization`, `jobLocation`. `validThrough` must be set. Expired jobs must have `validThrough` in the past, have their markup removed, or return 404/410.

### About keyword volume data

No paid keyword tool (Ahrefs/Semrush/Keyword Planner) was available during this research, so **absolute search volumes are not stated**. Priorities below come from SERP composition, commercial value, competitive difficulty and fit with the business. **Before launch:** check volumes in Google Keyword Planner (location: Uganda), then re-prioritise using Search Console data 60–90 days after launch.

---

## Step 5: Preliminary keyword map

Priority is **High / Medium / Low**. Difficulty is a relative estimate from SERP composition.

### Employer / commercial

| Keyword | Search intent | Target audience | Suggested page | Priority |
|---|---|---|---|---|
| recruitment agency Kampala / recruitment agencies in Kampala | Commercial, local | Employers | `/` (home) + `/recruitment-services` | High |
| recruitment agency Uganda / recruitment agencies in Uganda | Commercial | Employers | `/` (home) | High (competitive) |
| recruitment companies Uganda / recruitment services Uganda | Commercial | Employers | `/recruitment-services` | High |
| employment agency Kampala / employment agencies Uganda | Commercial (mixed with seekers) | Employers + job seekers | `/recruitment-services`, secondary `/for-job-seekers` | Medium |
| staffing agencies Uganda / staff recruitment Uganda | Commercial | Employers | `/recruitment-services` | Medium |
| hospitality recruitment Uganda / Kampala | Commercial, niche | Hotels, restaurants | `/recruitment-services/hospitality-recruitment` | **High (best wedge)** |
| restaurant staff recruitment Uganda / hire restaurant staff Kampala | Commercial, niche | Restaurant owners | `/recruitment-services/restaurant-staff-recruitment` | **High** |
| hotel staff recruitment Uganda | Commercial | Hotels, lodges | `/recruitment-services/hotel-staff-recruitment` | Medium |
| hire waiters / waitresses Kampala | Transactional | Restaurants, bars | Restaurant staff recruitment page (section) | Medium |
| candidate screening / pre-employment screening Uganda | Commercial | Employers | `/recruitment-services` (section); dedicated page later | Low–Medium |
| recruitment consultancy Uganda | Commercial | Employers | `/recruitment-services` | Low |
| office / administrative staff recruitment Uganda | Commercial | SMEs | `/recruitment-services/office-administrative-recruitment` ⚠ | Low (if offered) |
| sales staff recruitment Uganda | Commercial | Businesses | `/recruitment-services/sales-marketing-recruitment` ⚠ | Low (if offered) |
| request staff / hire staff Uganda | Transactional | Employers | `/hire-staff` (recruitment request form) | High (conversion) |

### Job seeker — general

| Keyword | Search intent | Target audience | Suggested page | Priority |
|---|---|---|---|---|
| jobs in Kampala | Navigational/transactional | Job seekers | `/jobs/location/kampala` | Medium (aggregators dominate) |
| jobs in Uganda / job vacancies Uganda | Transactional | Job seekers | `/jobs` | Low for ranking, core page anyway |
| jobs near me Uganda | Local, transactional | Job seekers | `/jobs` (location filter) + location hubs | Low |
| [job title] job Kampala (e.g. "cashier job Kampala") | Transactional, long tail | Job seekers | Individual job pages `/jobs/[slug]` | **High (volume in aggregate)** |
| register as job seeker Uganda / submit CV Uganda | Transactional | Job seekers | `/register` | High (conversion) |
| recruitment agency for job seekers Kampala | Commercial | Job seekers | `/for-job-seekers` | Medium |
| sales jobs Kampala / office jobs Kampala | Transactional | Job seekers | `/jobs/category/sales`, `/jobs/category/office-admin` | Low (build when jobs exist) |
| cleaner jobs Kampala | Transactional | Job seekers | `/jobs/category/cleaning-facilities` | Low–Medium |

### Job seeker — hospitality (niche cluster)

| Keyword | Search intent | Target audience | Suggested page | Priority |
|---|---|---|---|---|
| hospitality jobs Uganda / Kampala | Transactional | Job seekers | `/jobs/category/hospitality` | **High** |
| restaurant jobs Kampala / Uganda | Transactional | Job seekers | `/jobs/category/restaurant` | **High** |
| hotel jobs Kampala / Uganda | Transactional | Job seekers | `/jobs/category/hotel` | Medium |
| waitress jobs Kampala / waiter jobs Uganda | Transactional | Job seekers | Individual jobs + `/careers/waiter-waitress-jobs-uganda` guide | Medium |
| barista jobs Kampala | Transactional | Job seekers | Individual jobs + career guide | Medium |
| kitchen jobs / chef jobs / cook jobs Kampala | Transactional | Job seekers | `/jobs/category/kitchen` | Medium |
| restaurant supervisor jobs Kampala | Transactional | Job seekers | Individual jobs | Low |
| how to get a hotel job in Uganda | Informational | Job seekers | Blog article (hospitality cluster) | Medium |

### Overseas (⚠ only if licensed)

| Keyword | Search intent | Target audience | Suggested page | Priority |
|---|---|---|---|---|
| jobs abroad for Ugandans / overseas jobs Uganda | Transactional | Job seekers | `/overseas-jobs` | High *if licensed*, otherwise excluded |
| licensed recruitment agencies Uganda (abroad) | Trust / navigational | Job seekers | `/overseas-jobs` + licence display | High *if licensed* |
| jobs in Qatar / Dubai / Saudi for Ugandans | Transactional | Job seekers | Country pages only when real approved EEMIS job orders exist | Medium |
| how to verify a recruitment agency in Uganda / fake jobs abroad | Informational, safety | Job seekers | Blog: scam-awareness guide (**publishable even without a licence**) | **High (trust + links)** |
| requirements to work abroad from Uganda | Informational | Job seekers | Blog guide | Medium |

### Informational (content clusters)

| Keyword | Search intent | Target audience | Suggested page | Priority |
|---|---|---|---|---|
| how to write a CV in Uganda / CV format Uganda | Informational | Job seekers | Pillar: CV guide | High |
| interview questions and answers (Uganda) | Informational | Job seekers | Pillar: interview guide | High |
| waiter / waitress interview questions | Informational | Job seekers | Hospitality cluster article | Medium |
| how recruitment agencies work in Uganda | Informational | Both | Article + `/how-it-works` | Medium |
| how to recruit restaurant staff | Informational (employer) | Employers | Employer guide → links to restaurant recruitment | Medium |
| cost of hiring through a recruitment agency Uganda | Commercial investigation | Employers | Employer guide / FAQ ⚠ pricing input | Medium |
| salary of waiter in Uganda | Informational | Job seekers | Only with a reliable source ⚠ | Low (defer) |

---

## Step 6: Proposed sitemap

```
/                                        Home (dual-audience router)
│
├── /jobs                                All live vacancies (search + filters)
│   ├── /jobs/category/[category]        e.g. hospitality, restaurant, hotel, kitchen, sales, office-admin, cleaning-facilities
│   ├── /jobs/location/[location]        e.g. kampala, entebbe, mukono, wakiso, jinja
│   ├── /jobs/category/[c]/location/[l]  Indexed only when ≥ 3 live jobs (see faceted rules)
│   └── /jobs/[job-slug]                 Individual vacancy, e.g. /jobs/restaurant-supervisor-kampala-jl1042
│       └── /jobs/[job-slug]/apply       Application form (noindex)
│
├── /for-job-seekers                     How Job Link helps candidates, process, what we never charge ⚠
├── /register                            Candidate registration / CV submission
├── /job-alerts                          Alerts sign-up (WhatsApp/email) — phase 2
│
├── /for-employers                       Employer hub: why us, process, industries, request staff
├── /recruitment-services                Services overview
│   ├── /recruitment-services/hospitality-recruitment
│   ├── /recruitment-services/restaurant-staff-recruitment
│   ├── /recruitment-services/hotel-staff-recruitment
│   ├── /recruitment-services/candidate-screening            (phase 2)
│   ├── /recruitment-services/office-administrative-recruitment   ⚠ only if offered
│   ├── /recruitment-services/sales-marketing-recruitment         ⚠ only if offered
│   ├── /recruitment-services/skilled-general-workers              ⚠ only if offered
│   └── /recruitment-services/domestic-household-staff             ⚠ only if offered and compliant
├── /hire-staff                          Recruitment request form (employer conversion page)
│
├── /overseas-jobs                       ⚠ ONLY with a valid MGLSD external licence
│   └── /overseas-jobs/[country]         Only with real approved job orders
│
├── /locations                           ⚠ Only when service areas are confirmed
│   └── /locations/[city]                Employer + candidate local hub (Kampala first)
│
├── /career-advice                       Blog / resources hub
│   ├── /career-advice/[category]        job-search, cv-and-interviews, hospitality-careers, working-abroad, for-employers
│   └── /career-advice/[article-slug]
│
├── /about                               Company story, team (real only), licences, how we work
├── /how-it-works                        Transparent process for both audiences
├── /faq                                 Real questions, FAQPage schema only if visibly rendered Q&A
├── /contact                             Contact details ⚠, map only if a real office exists
├── /privacy-policy                      Required by Data Protection and Privacy Act 2019
├── /terms
└── /404
```

URL rules:
- Lowercase, hyphenated, no trailing slash, no query-string URLs indexed.
- Job slugs end in a short, stable ID (`-jl1042`). The page still resolves if the title changes, and the canonical then updates via 301.
- Job-seeker (`/jobs/...`) and employer (`/recruitment-services/...`) intents live in separate trees, so they never compete for the same query.

---

## Step 7: SEO architecture

### Page-level template contract

Every route supplies, through one shared `buildMetadata()` helper:
- unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars)
- self-referencing canonical (absolute, https, preferred host)
- Open Graph + Twitter card (title, description, 1200×630 image, `og:locale=en_UG`)
- `robots` directive, resolved from indexation rules
- breadcrumb trail (visible and `BreadcrumbList` JSON-LD from the same data)
- exactly one `<h1>` and a logical H2/H3 hierarchy

### Structured data (each type only where the visible content supports it)

| Schema | Where | Condition |
|---|---|---|
| `Organization` (or `EmploymentAgency`, a LocalBusiness subtype) | Home, About | Name, logo, `sameAs` socials. `address`/`telephone` **only when supplied** ⚠ |
| `WebSite` | Home | Name and URL. Add SearchAction only if a site-search results page exists (`/jobs?q=`) |
| `BreadcrumbList` | All non-home pages | Mirrors the visible breadcrumb |
| `JobPosting` | `/jobs/[slug]` | Only while the job is **open**. Fields match visible content. `validThrough` always set. `baseSalary` only if the salary is shown. `hiringOrganization` = the real employer, or Job Link Uganda if confidential ⚠ |
| `Service` | Recruitment service pages | Describes the service, `provider` = Organization, `areaServed` = confirmed areas |
| `Article` / `BlogPosting` | Career advice articles | Real author (person or organisation), `datePublished`, `dateModified` |
| `FAQPage` | Only pages with a visible FAQ section | Google shows FAQ rich results mainly for authoritative sites now. Use it for clarity, not expected SERP gain |
| ❌ `Review` / `AggregateRating` | Nowhere | Until genuine third-party reviews exist, and never self-served |

### Indexation and faceted navigation

| URL type | Index? | Canonical | In sitemap |
|---|---|---|---|
| `/jobs` | Yes | self | Yes |
| `/jobs?page=2…` | `noindex, follow` for page 2+ (or index with self-canonical once inventory is large) | self | No |
| `/jobs?q=…&type=…&sort=…` (free filters) | `noindex, follow` | `/jobs` | No |
| `/jobs/category/[c]` | Yes if ≥ 1 live job **or** hub has unique content; else noindex | self | Conditional |
| `/jobs/location/[l]` | Yes if ≥ 1 live job; else noindex | self | Conditional |
| `/jobs/category/[c]/location/[l]` | Yes only if ≥ 3 live jobs | self | Conditional |
| `/jobs/[slug]` open | Yes | self | Yes (`lastmod` = updated date) |
| `/jobs/[slug]` expired | See expiry lifecycle | self | No |
| `/jobs/[slug]/apply`, `/register/thanks`, form steps | `noindex` | — | No |
| Article tag pages | `noindex` (categories are the indexable hubs) | — | No |

### Expired job lifecycle (no misleading results)

1. **Open:** indexable, JobPosting present, `validThrough` = deadline (or `datePosted` + 30 days if no deadline is given).
2. **Deadline passes / filled:** status shows as **"Closed"** in a visible banner. The apply form is removed. **JobPosting JSON-LD is removed.** The page drops out of sitemaps and job listings. `robots: noindex`. Related open jobs are linked.
3. **After 60–90 days:** the page returns **410 Gone**, unless it has earned external links, in which case it gets a **301** to the most relevant category page.
4. The job sitemap is regenerated on every publish, close or expiry. Google gets notified via sitemap ping or the Indexing API ([Google permits the Indexing API specifically for JobPosting pages](https://developers.google.com/search/apis/indexing-api/v3/quickstart)).

### Sitemaps and robots

- `sitemap.xml` index → `sitemap-pages.xml`, `sitemap-jobs.xml`, `sitemap-articles.xml`, `sitemap-locations.xml` (only if location pages exist).
- `robots.txt` disallows `/admin`, `/api`, `/*/apply`, internal search parameters, and preview routes. Sitemap URL included.
- Staging environment: `noindex` header plus password protection so it never leaks into the index.

### Redirects and duplicates

- Single canonical host (e.g. `https://joblinkuganda.[tld]` ⚠ domain), with 301s from `www`/non-`www` and http→https.
- Trailing-slash normalisation, lowercase enforcement.
- Redirect table in the CMS (staff can add 301s when job slugs or articles change).
- Job-seeker and employer pages never share a target keyword.

---

## Step 8: Content clusters

Each cluster has a **pillar** (hub) and **supporting articles**. Articles exist to answer a real query and route readers into a conversion page.

### Cluster A — Hospitality careers & hiring (primary niche; strongest fit with experience)
- Pillar (seeker): *Hospitality Jobs in Uganda: Roles, Skills and How to Get Hired*
- Pillar (employer): `/recruitment-services/hospitality-recruitment`
- Supporting: waiter/waitress job guide and interview questions; barista career guide; how to get a hotel job in Kampala; kitchen roles explained (steward, commis, cook, chef); customer-service skills for restaurant work; *How to hire reliable restaurant staff in Kampala* (employer); *What to look for when screening waiters and waitresses* (employer).

### Cluster B — Job search in Uganda (broad; builds topical authority)
- Pillar: *How to Find a Job in Uganda: A Practical Guide*
- Supporting: CV guide with Ugandan-context examples; cover letter guide; interview preparation and common questions; what to bring to an interview; first-job and fresh-graduate guide; how to follow up after applying; recognising fake job adverts in Uganda.

### Cluster C — Safe employment and working abroad (trust cluster)
- Pillar: *How to Verify a Recruitment Agency in Uganda (and Avoid Job Scams)*. Cites the MGLSD/EEMIS verification process. **Valuable and linkable even without an overseas licence.**
- Supporting (⚠ only if licensed): requirements to work abroad from Uganda; pre-departure checklist; worker rights overview (sourced from official material only).

### Cluster D — Employer hiring guides (commercial support)
- Pillar: *Hiring in Uganda: A Guide for Small and Growing Businesses*
- Supporting: how recruitment agencies work; recruitment agency vs hiring yourself; writing a good job description; reference checks and screening; onboarding new staff. Pricing and fees article ⚠ only with business input.

### Cluster E — Local (only with real local activity)
- `/locations/kampala` first. It combines live Kampala jobs, the employer services offered there, areas served and local hiring context. More cities are added only when there are real placements or active job orders there.

---

## Step 9: Internal linking

| From | To | Mechanism |
|---|---|---|
| Home | `/jobs`, `/for-employers`, top 3 service pages, latest jobs, top categories | Dual-audience hero + sections |
| Header | Jobs · For Job Seekers · For Employers · Services ▾ · Career Advice · About · [Hire Staff] CTA | Global nav |
| Footer | All service pages, job categories with live jobs, confirmed locations, legal, licence info ⚠ | Global footer |
| Job page | Category hub, location hub, 3–5 related open jobs, "Register your CV" | Auto-generated |
| Category hub (`/jobs/category/hospitality`) | Matching career-advice pillar + matching employer service page ("Hiring hospitality staff?") | Contextual block |
| Service page | Relevant job category (proof of active roles), employer guides, `/hire-staff` | Contextual + CTA |
| Articles | Pillar ↔ supporting links, 1 primary conversion link per article (jobs category or `/register` or `/hire-staff`) | In-content + end-of-article CTA |
| Location page | Location job hub, relevant services, local articles | Contextual |
| Closed job page | Related open jobs in the same category and location | Auto-generated |

Anchor text should be descriptive and varied ("restaurant jobs in Kampala", "our hospitality recruitment service"), never "click here" and never exact-match repeated sitewide.

---

## Step 10: Technical SEO, performance, accessibility and security requirements

### Technical SEO
- [ ] Server-rendered HTML for all indexable pages, with no content depending on client JS
- [ ] `buildMetadata()` helper: title, description, canonical, OG/Twitter, robots
- [ ] JSON-LD components: `OrganizationJsonLd`, `BreadcrumbJsonLd`, `JobPostingJsonLd`, `ArticleJsonLd`, `ServiceJsonLd`, `FaqJsonLd`, each typed and generated from the same data as the visible content
- [ ] Dynamic segmented sitemaps with accurate `lastmod`
- [ ] `robots.ts` with environment-aware rules (staging = disallow all)
- [ ] Expired-job lifecycle (status field + scheduled job + 410/301 handling)
- [ ] Redirect manager in CMS; host, https and slash normalisation
- [ ] Custom 404 with job search + main paths, returning a real 404 status
- [ ] `lang="en"` on `<html>`, `og:locale=en_UG`
- [ ] Search Console + Bing Webmaster verification, sitemap submission
- [ ] Rich Results Test and Schema validator checks in QA for every template

### Performance targets (mobile, mid-range Android on 3G/4G)
- LCP < 2.5 s, INP < 200 ms, CLS < 0.1
- Initial JS on marketing pages kept minimal (server components by default; client components only for filters, menus and forms)
- `next/image` with AVIF/WebP, correct `sizes`, priority only on the LCP image
- Self-hosted subset fonts, `font-display: swap`, at most 2 families / 4 weights
- Static generation + ISR for jobs (revalidate on publish/close via on-demand revalidation)
- No carousel on the hero, no autoplay video, no animation libraries

### Accessibility (WCAG 2.2 AA)
- Colour contrast ≥ 4.5:1 for text (checked against brand colours once supplied)
- Visible focus states, skip link, full keyboard operation of menus and filters
- Labelled form fields, inline error messages linked with `aria-describedby`, no placeholder-only labels
- Semantic landmarks; ARIA only where native HTML is insufficient
- Tap targets ≥ 44px; readable body size (≥ 16px)

### Security and candidate data
- **Uganda Data Protection and Privacy Act, 2019:** Job Link Uganda must be **registered with the Personal Data Protection Office (PDPO)** as a data controller (annual renewal). Collecting CVs without it is an offence. ⚠ Confirm registration status.
- Explicit consent checkbox (not pre-ticked) and privacy notice at every candidate form, stating the purpose, who sees the data (Job Link and prospective employers), and the retention period ⚠
- Data minimisation: no national ID numbers, dates of birth or photos unless genuinely required ⚠
- CV uploads: PDF/DOC/DOCX only, ≤ 5 MB, MIME + magic-byte check, randomised object names, **private bucket**, signed URLs for staff only, malware scan on upload
- Server-side Zod validation, output encoding, Turnstile + honeypot + IP rate limiting on every form
- Role-based access in Payload: `admin`, `recruiter` (candidates + jobs), `editor` (content only). Candidates are never readable by public API.
- HTTPS everywhere, HSTS, strict CSP, secure cookies, secrets in environment variables only
- Audit log for candidate record access; deletion-on-request workflow (a data-subject right under DPPA)

### WhatsApp
- A floating WhatsApp button on mobile, **secondary** to the page's main CTA and never covering content.
- Context-aware `wa.me` links with pre-filled text. For example, on a job page: *"Hello Job Link Uganda, I'm interested in the Restaurant Supervisor (JL1042) vacancy."* On employer pages: *"Hello, I'd like to discuss hiring staff for my business."*
- Separate numbers or labels for candidates and employers if the team can support that ⚠
- Every WhatsApp click is tracked as a conversion event
- On-site forms remain the primary route, so every lead is captured in the CMS rather than lost in a phone chat.

---

## Step 11: Pages to build (phased)

### Phase 1 — Launch (foundation, no thin pages)
1. Home
2. Jobs listing (search, category/location/type filters)
3. Job detail template + application form
4. Job category hubs (only categories with jobs: likely Hospitality, Restaurant, Hotel, Kitchen)
5. Job location hub: Kampala
6. For Job Seekers
7. Candidate Registration (CV submission)
8. For Employers
9. Recruitment Services overview
10. Hospitality Recruitment
11. Restaurant Staff Recruitment
12. Hire Staff (recruitment request form)
13. How It Works
14. About
15. Contact
16. Career Advice hub + 4–6 launch articles (CV guide, interview guide, hospitality jobs pillar, verify-an-agency guide, how to hire restaurant staff)
17. Privacy Policy, Terms, 404

### Phase 2 — Expansion (driven by data and real activity)
- Hotel Staff Recruitment; Candidate Screening service
- Additional job categories as vacancies appear
- Job alerts (email/WhatsApp opt-in)
- FAQ page
- Location pages for confirmed service areas (e.g. Entebbe, Mukono/Wakiso)
- Further cluster articles based on Search Console queries

### Phase 3 — Conditional
- Overseas Jobs section + country pages (**only with MGLSD external licence**)
- Office/Admin, Sales & Marketing, Skilled & General, Domestic/Household services (**only if offered**)
- Candidate accounts / saved applications
- Employer portal for posting and reviewing shortlists

---

## Step 12: Brand and design system (on hold)

Waiting on: official logo (SVG preferred), brand colours, fonts (if any), existing flyers/social posts, and any photography of the real team or office. Once received: extract colour tokens, check contrast, choose type pairing, and set up component styles. Until then the build uses neutral tokens that can be swapped in one place.

Imagery plan: Unsplash photography of African professionals, hospitality and workplace settings, used illustratively and **never captioned or implied as Job Link's own staff, clients or office**. Replace with real photography as soon as it is available.

---

## ⚠ Business inputs required

| # | Input | Blocks |
|---|---|---|
| 1 | Domain name (e.g. `.ug`, `.co.ug`, `.com`) | Canonicals, deployment, Search Console |
| 2 | Legal/registered business name, URSB registration (display optional) | Organization schema, footer, Terms |
| 3 | MGLSD **domestic** recruitment licence status + number | Trust signals, About page |
| 4 | MGLSD **external** licence + EEMIS listing | Whole overseas section |
| 5 | PDPO data-controller registration | Launching candidate forms |
| 6 | Physical office address (or service-area-only business?), opening hours | Contact, LocalBusiness schema, Google Business Profile |
| 7 | Phone number(s), WhatsApp number(s), email(s) | Contact, CTAs |
| 8 | Services actually offered (confirm list in §6) | Service pages |
| 9 | Industries actually served beyond restaurants/hospitality | Categories, positioning |
| 10 | Locations actually served | Location pages, `areaServed` |
| 11 | Fee model: do candidates ever pay anything? How are employers charged? | How It Works, FAQ, trust messaging |
| 12 | Whether employer names can be shown on job ads, or jobs are posted as "Confidential employer" | JobPosting `hiringOrganization` |
| 13 | Current live vacancies (real) | Jobs section at launch |
| 14 | Social media profiles | `sameAs`, footer |
| 15 | Candidate data retention period and who can access CVs | Privacy policy, access roles |
| 16 | Existing Google Business Profile? | Local SEO |
| 17 | Verified testimonials/client logos with written permission (optional) | Social proof sections |
| 18 | Logo, colours, fonts, flyers, real photos | Design system |

---

## Changes since discovery (implementation decisions)

These refinements were made while building the foundation. Details and reasons are in [02-technical-architecture.md](02-technical-architecture.md).

| Date | Area | Discovery said | Now | Why |
|---|---|---|---|---|
| 2026-09-25 | robots.txt | Disallow internal search parameters | Only `sort=` is disallowed. Filtered `/jobs` URLs stay crawlable | A URL blocked in robots.txt can't be crawled, so its `noindex` is never seen and it can still be indexed from links. `noindex, follow` + canonical is the reliable control |
| 2026-09-25 | Sitemaps | Sitemap index with segmented child sitemaps | Single `sitemap.xml` listing only live pages | Segmenting adds no value at launch volumes. Split into an index when any section exceeds a few thousand URLs |
| 2026-09-25 | Expired jobs | 410 after 60–90 days | 90 days. Retired jobs return 404 until a 410 route is built in Phase 2 | Next.js pages cannot emit 410. Search engines treat 404 and 410 almost identically for removal |
| 2026-09-25 | Jobs without a closing date | `validThrough` = posting date + 30 days | Same, and the vacancy **automatically stops being advertised** at that point | Prevents stale vacancies from staying live. Staff re-date a vacancy to keep advertising it |
| 2026-09-25 | Overseas & candidate data | Conditional / phase 3 | Enforced in code by feature gates that require the env flag **and** recorded licence/PDPO evidence | Business direction of 25 Sep 2026 |
| 2026-09-25 | 404 page | Custom 404 | Unmatched URLs use Next's `global-not-found` (server-rendered) | Upstream Next.js 16 bug: thrown `notFound()` serves an empty HTML body in production |
| 2026-09-25 | Resources URL | `/career-advice` | `/career-resources` | Specified in the build brief |
| 2026-09-25 | Employer hub | Separate `/for-employers` and `/recruitment-services` | Merged: `/recruitment-services` is the employer hub | Two pages would compete for the same intent; the brief allowed merging |
| 2026-09-25 | Trust pages | FAQ page | `/how-it-works` (full process for both sides) + `/recruitment-safety` (scam-awareness pillar); FAQs live on service pages | Transparency is a brand pillar; a standalone FAQ page would duplicate those pages |
| 2026-09-25 | FAQ schema | FAQPage where a visible FAQ exists | Not emitted | Brief: no FAQ schema just because FAQs exist; Google limits FAQ rich results to authoritative sites |
| 2026-09-25 | Location pages | `/locations/[city]` | Not built yet; Kampala served by `/jobs/location/kampala` | Brief: start with Kampala and add dedicated pages only with genuine local activity |
| 2026-09-25 | Hub indexation | Indexable with ≥1 live job **or** unique content | "Unique content" = CMS intro of ≥ 280 characters | Prevents short stub intros from getting empty hubs indexed |

---

## Sources

- [Flexi Personnel — Best Recruitment Agencies in Uganda 2026](https://www.flexi-personnel.com/best-recruitment-agencies-in-uganda/)
- [Alliance Recruitment Agency — Recruitment agencies Uganda](https://www.alliancerecruitmentagency.com/recruitment-agencies-uganda/)
- [Yellow.ug — Employment agencies in Kampala](https://www.yellow.ug/category/employment-agencies/city:kampala)
- [Premier Recruitment](https://premierrecruitment.com/)
- [Freshmind International](https://www.freshmindinternational.com/)
- [Q-Sourcing Servtec Uganda](https://qsourcing.com/uganda/)
- [BrighterMonday Uganda](https://www.brightermonday.co.ug/) and [Hospitality & Hotel jobs in Kampala](https://www.brightermonday.co.ug/jobs/hospitality-hotel/kampala)
- [AllJobspo — Jobs in Kampala](https://jobsinuganda.alljobspo.com/jobs-in-kampala)
- [Great Uganda Jobs](https://www.greatugandajobs.com/jobs/)
- [Fuzu Uganda](https://www.fuzu.com/uganda/job)
- [Google Search Central — JobPosting structured data](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
- [Monitor — Govt releases list of licensed firms](https://www.monitor.co.ug/uganda/news/national/govt-releases-list-of-licensed-firms-amid-labour-exploitation-5418522)
- [PML Daily — Ministry de-licenses 275 recruitment agencies](https://pmldaily.com/business/2026/04/ministry-delicenses-275-recruitment-agencies-in-major-regulatory-shake-up.html)
- [MGLSD — EEMIS](https://eemis.mglsd.go.ug/) and [EEMIS companies directory](https://eemis.mglsd.go.ug/companies)
- [Global Law Experts — Recruiting workers for employment abroad (Uganda)](https://globallawexperts.com/how-to-recruit-workers-for-employment-abroad-uganda/)
- [Cliffe Dekker Hofmeyr — PDPO registration of data controllers](https://www.cliffedekkerhofmeyr.com/en/news/publications/2025/Sectors/Technology-Communications/technology-and-communications-alert-13-august-to-register-or-not-to-register-the-ugandan-personal-data-protection-offices-decision-on-the-registration-of-data-controllers)
- [Global Law Experts — How to register with PDPO Uganda](https://globallawexperts.com/how-to-register-with-pdpo-uganda/)
