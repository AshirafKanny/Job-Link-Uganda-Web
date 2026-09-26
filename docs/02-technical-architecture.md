# Job Link Uganda — Technical Architecture

**Status:** Website built (Phases 1–4) and verified, 25 September 2026. The candidate system (Phase 5) is gated off.
**Strategy source of truth:** [01-discovery-seo-architecture.md](01-discovery-seo-architecture.md)

---

## 1. Stack and versions

Verified against npm on 25 September 2026. All versions are pinned exactly.

| Package | Version | Notes |
|---|---|---|
| next | 16.3.6 | App Router, Turbopack. Payload 3.90 supports `>=16.3.3 <17` |
| react / react-dom | 19.3.0 | Within Payload's peer range (`^19.2.1`) |
| payload + @payloadcms/* | 3.90.2 | db-postgres, richtext-lexical, plugin-seo, plugin-redirects, storage-s3 |
| graphql | 16.14.2 | **Pinned to 16.** Payload's peer range is `^16.8.1`; graphql 17 is incompatible. GraphQL is disabled anyway |
| typescript | 5.9.3 | **Not 7.x.** TS 7 is the native (Go) compiler without the JS API that Next's build-time type check and Payload's tooling use. TS 6 deprecates options the tooling still emits. Revisit when Next/Payload declare TS 7 support |
| tailwindcss | 4.3.3 | CSS-first config (`@theme`) |
| zod | 4.6.5 | Form/input validation |
| eslint | 9.39.5 | **Not 10.x.** `eslint-config-next` depends on eslint-plugin-react, jsx-a11y and import, which cap at ESLint 9. Upgrade when they support 10 |
| vitest | 5.0.1 | Unit tests; tsconfig paths resolved natively |
| @playwright/test + @axe-core/playwright | 1.63.0 / 4.13.0 | **Dev only.** QA script (`scripts/qa.mjs`) using the locally installed Chrome |
| embedded-postgres | 18.4.0-beta.17 | **Dev only.** Real Postgres binaries in node_modules; no system install or Docker needed |

Node ≥ 20.9 is required (developed on Node 22.18).

---

## 2. Layered structure

```
src/
├── config/              Business facts, site settings, feature gates (no CMS dependency)
│   ├── business.ts      Verified business facts only; unknowns are null (never invented)
│   ├── features.ts      Legal/operational gates (overseas, candidates, employer enquiries)
│   └── site.ts          Canonical origin, locale, indexability switch
│
├── domain/              Pure TypeScript: types + business rules, no framework imports
│   ├── content/types.ts Article, Service, JobCategory, Location, ImageAsset…
│   └── jobs/            Job types, slug rules, lifecycle (expiry) rules + tests
│
├── data/                THE ONLY GATEWAY between pages and the backend (server-only)
│   ├── repositories.ts  Interfaces: JobsRepository, ServicesRepository, …
│   ├── index.ts         Wires interfaces → implementation
│   └── payload/         Payload adapter: queries + mappers (privacy boundary)
│
├── cms/                 Payload-specific configuration
│   ├── access.ts        Roles and access rules
│   ├── collections/     Public content collections
│   │   └── private/     Employers, recruitment requests, candidate gate
│   ├── fields/  hooks/  Slug field, revalidation, slug-change redirects
│
├── lib/
│   ├── routes.ts        Single source of truth for every public URL
│   ├── seo/             buildMetadata(), indexation rules, JSON-LD builders
│   └── cms-redirect.ts  CMS redirect lookup for missing dynamic pages
│
├── components/seo/      <JsonLd />
├── app/(frontend)/      Public website (root layout, pages)
├── app/(payload)/       Payload admin + REST API (generated, do not edit)
├── app/global-not-found.tsx, robots.ts, sitemap.ts
└── payload.config.ts
```

### Replaceability

Pages import only from `@/data`, `@/domain`, `@/lib` and `@/config`. They never import from `payload` or `@/payload-types`.
- **To change CMS or database:** implement the interfaces in `src/data/repositories.ts` with a new adapter and swap it in `src/data/index.ts`. Pages and components stay the same.
- **To change storage:** public media storage is a Payload plugin, configured by environment (`S3_*`), and pages only receive a URL. Candidate documents will use a separate private bucket (see §4).

---

## 3. Information separation

| Tier | Where | Who can read |
|---|---|---|
| **Public job & content information** | `jobs`, `job-categories`, `locations`, `services`, `articles`, `article-categories` | Staff via admin. The public reads **only through `src/data`**, which maps an explicit allow-list of fields |
| **Public media** | `media` | Anyone (image files) |
| **Employer information** | `employers` (private), `recruitment-requests` (private) | Recruiters and admins only. The only employer field that can reach a page is `publicName`, and only when a vacancy is set to "Named" |
| **Candidate information** | *Not built.* Gated by `FEATURE_CANDIDATE_SYSTEM` + PDPO registration | Recruiters and admins only (planned) |
| **Admin-only** | `users`, `redirects`, job `internalNotes` | Admins; internal notes limited to recruiters and admins |

Defence in depth:
1. **Collection access.** No collection except `media` grants public read. Verified: `/api/jobs`, `/api/users` and `/api/recruitment-requests` return 403 without a staff session.
2. **Field access.** `employer` and `internalNotes` on jobs are recruiter/admin only, even inside the admin.
3. **Query select.** The data layer excludes `internalNotes` and loads only `publicName`/`website` from employers, so private values never enter the render process.
4. **Mappers.** `src/data/payload/mappers.ts` is the allow-list of what reaches a page.
5. **GraphQL disabled.** Smaller attack surface; REST remains for the admin.
6. **Recruitment requests have `create: nobody`.** Submissions will go through a validated server action (Zod + Turnstile + rate limiting) that writes via the Local API.

Roles: `admin` (everything), `recruiter` (jobs, employers, requests), `editor` (articles, services, taxonomy, media; read-only jobs). The first account created through the admin's first-user screen is forced to `admin`. Roles can only be changed by an admin.

---

## 4. Feature gates

Defined in `src/config/features.ts`. A gate that is off removes the capability entirely: no collections, no routes, no admin options, no structured data.

| Gate | Needs | Effect when off (current state) |
|---|---|---|
| **Overseas recruitment** | `FEATURE_OVERSEAS_RECRUITMENT=true` **and** a non-expired licence in `business.licences.externalRecruitment` | Locations must be `UG` (a non-UG country code is rejected with an explicit error). The job location picker only offers UG locations. The data layer filters `location.countryCode = UG` on every public query. `/overseas-jobs` will not exist |
| **Candidate system** | `FEATURE_CANDIDATE_SYSTEM=true` **and** `business.pdpoRegistration` set | No candidate/application collections or endpoints. The "Apply online" option is hidden. JobPosting `directApply` is false. Config refuses to start if the flag is on but the system isn't implemented |
| **Employer enquiries** | `FEATURE_EMPLOYER_ENQUIRIES=true` | Recruitment-request form not rendered (Phase 3) |

Planned candidate design (for Phase 5, once cleared): see `src/cms/collections/private/candidates.ts`.

---

## 5. Job system

### URLs
`/jobs/[title-location-id]`, e.g. `/jobs/restaurant-supervisor-kampala-jl1042`. The trailing `jl<ref>` (the database id) identifies the job. If the title or location changes, the job page will 301 to the new canonical slug. Slugs are derived, never stored, so they can't go stale.

### Lifecycle (`src/domain/jobs/lifecycle.ts`)
Visibility is **computed from status and dates on every request**. Expiry therefore never depends on a cron job or on staff remembering to close a vacancy.

| State | When | Page | JobPosting | Sitemap / listings |
|---|---|---|---|---|
| `unpublished` | status = draft | 404 | — | — |
| `open` | status = open and before `validThrough` | 200, indexable | ✅ | ✅ |
| `closed` | staff closed it (filled/withdrawn) **or** the deadline passed | 200, "Closed" banner, `noindex`, related open jobs | ❌ | ❌ |
| `retired` | 90 days after closing | 410 Gone, or 301 to its category if "redirect-to-category" | ❌ | ❌ |

- `validThrough` is the end of the closing date in Kampala time (EAT, UTC+3), or **30 days after posting** when there is no closing date. Open-ended vacancies must be re-dated to stay advertised.
- Hooks set `publishedAt` when a job is first opened and `closedAt` when it is closed. A close reason is required.
- Pages will use time-based revalidation (≤ 1 h) plus on-demand revalidation from CMS hooks. Deadline expiry is reflected within the hour without any CMS action.

Verified end to end against Postgres: an open job appears in listings, counts, the sitemap and JobPosting. After it's marked filled, all four drop it, while the page data still loads with state `closed`.

### Structured data
`jobPostingJsonLd()` returns `null` unless the lifecycle state is `open`. `description` is generated from the same summary and lists the page renders. `baseSalary` appears only when a confirmed salary is published. A confidential employer is represented as Job Link Uganda (the organisation advertising the role).

### Indexation of hubs (`src/lib/seo/indexation.ts`)
- `/jobs/category/[c]` and `/jobs/location/[l]` are indexable with ≥ 1 live job or genuine intro content.
- `/jobs/category/[c]/location/[l]` is **not rendered** (404) at 0 jobs and is indexable at ≥ 3.
- Any `q`, `type`, `sort`, `page>1`, `category` or `location` query parameter makes the page `noindex, follow`, with the canonical pointing to the clean URL.

---

## 6. SEO infrastructure

- **`buildMetadata()`**: title, description, absolute canonical, Open Graph (`en_UG`), Twitter card, robots. Every page must use it.
- **Global indexing switch.** Nothing is indexable unless `SITE_INDEXABLE=true`. Otherwise `robots.txt` disallows everything and every page is `noindex`. Only production sets it.
- **robots.txt (production):** blocks `/admin`, `/api/` (but allows `/api/media/file/` so images can be indexed), and `sort=` URLs. Filtered job URLs are *not* blocked, so crawlers can see their `noindex`.
- **sitemap.xml** lists static pages, services, open jobs, articles, and only those hubs and resource categories that pass the same indexation rules as their pages.
- **JSON-LD** builders are typed with `schema-dts`: Organization (upgrades to `EmploymentAgency` only once a real address exists), WebSite, BreadcrumbList, JobPosting, BlogPosting, Service, FAQPage (only for visibly rendered FAQs). `<JsonLd>` escapes `<` to prevent script injection.
- **Redirects:** changing the slug of a published article, service or category automatically records a 301 in the CMS `redirects` collection. Dynamic pages call `redirectOrNotFound(path)` before returning 404.
- **404s:** unmatched URLs use `app/global-not-found.tsx`, which is fully server-rendered.

### Media and imagery
Every image records its `source` (Unsplash / licensed stock / Job Link original) and credit. The admin warns that stock images are illustrative only and must never be presented as Job Link staff, candidates, clients or premises. Sizes generated: 400, 800, 1600 and a 1200×630 OG crop. `next/image` serves AVIF/WebP. `images.unsplash.com` is allowed as a remote source.

---

## 7. Security baseline

- **Headers:** `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, and HSTS (production only; `preload` is deliberately left off until the final domain is decided). `X-Powered-By` is removed.
- **Payload:** `serverURL`, CORS and CSRF are locked to the site origin. In development, `localhost` and `127.0.0.1` are both allowed. Admin sessions expire after 8 h, and accounts lock for 15 minutes after 5 failed logins. Cookies are secure in production.
- **Secrets:** `PAYLOAD_SECRET` is required at start-up, and `.env` is git-ignored.
- **Employer enquiry form** (`/hire-staff`):
  - Server-side Zod validation, which also strips control characters and caps field lengths.
  - A honeypot field and a 3-second minimum fill time. Bots receive a normal-looking success response and nothing is stored.
  - A per-IP rate limit of 5 requests per 15 minutes.
  - Cloudflare Turnstile when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set.
  - Records are written only by the server action through the data layer. The collection denies public create and read.
- **Rate limiter caveat:** the limiter is in-memory. That's fine for a single Node instance. On serverless or multi-instance hosting, swap its store for Redis/Upstash; the function signature stays the same.
- **Before launch:**
  - A Content-Security-Policy, once analytics and Turnstile are final.
  - An email adapter for Payload, so new enquiries notify the team. Payload currently logs to the console.

---

## 8. Known upstream issues

| Issue | Impact | Mitigation |
|---|---|---|
| Next.js 16: a thrown `notFound()` serves an **empty HTML body** in production. Content appears only after hydration ([#98954](https://github.com/vercel/next.js/issues/98954), [#98295](https://github.com/vercel/next.js/issues/98295)) | Missing jobs and articles still return a correct **404 status** and `noindex`, so crawling is unaffected. Visitors without JavaScript see a blank page | Unmatched URLs use `global-not-found`, which is fully server-rendered and verified. Recheck `notFound()` on every Next.js upgrade |
| Next.js pages cannot emit **410 Gone** | Retired jobs should return 410 | Retired jobs 404 for now (search engines treat 404 and 410 almost identically). Planned fix: a route handler, or `proxy.ts` backed by a cached list of retired refs |

---

## 9. Brand and design system

The logo was received on 25 September 2026. The source files are not served publicly:
- `assets/brand/JBU logo-original.svg`: the **vector master**, 1254×1254 viewBox.
- `assets/brand/job-link-logo1-original.jpeg`: the earlier raster.

The supplied SVG has a black background square behind the circle. The web copy wraps the unmodified artwork in a circular `clipPath` (centre 627,625, r 613.5, fitted to the outer ring), so the corners are transparent. All raster files are rendered from that vector:

| File | Use |
|---|---|
| `public/brand/job-link-uganda-logo.svg` | On-page logo (`<Logo />`) |
| `public/brand/job-link-uganda-logo.png` | 512 px PNG for Organization structured data |
| `public/brand/og-default.jpg` | 1200×630 default share image |
| `src/app/icon.png`, `src/app/apple-icon.png` | Favicon and Apple touch icon |

### Tokens (`src/app/(frontend)/globals.css`)

| Token | Value | Rule |
|---|---|---|
| `brand-red` | `#D91519` | Primary CTAs, links, active states. ≈ 5.2:1 on white |
| `brand-red-dark` | `#B01116` | Hover and small text. ≈ 7.2:1 |
| `brand-yellow` | `#FEC106` | Accent only: rules, eyebrow marks, text on dark sections. **Never text on light backgrounds** |
| `brand-black` | `#0D0D0D` | Footer, dark feature sections |
| `surface` / `surface-muted` / `line` | warm neutrals | Most of every page is neutral |
| Radius | 4 px (controls), 6 px (cards) | Deliberately restrained, not "rounded everything" |

### Typography and components

- **Typography:** Montserrat 600–800 for headings (it matches the logo wordmark) and Inter for body text at 17 px. Both are self-hosted by `next/font`. Hierarchy comes from weight and size, never italics.
- **Components:** `Button`/`ButtonLink`/`ArrowLink`, `SectionHeading` (with a yellow-rule eyebrow), `PageHeader`, `Breadcrumbs` (visible trail plus JSON-LD from one array), `JobCard`, `JobSearchForm`, `JobsSidebar`, `JobHubView`, `ServiceCard`, `ArticleCard`, `ProcessSteps`, `FaqList` (native `<details>`), `SafetyCallout`, `EmployerCtaBand`, `AudienceCta`, `EmptyState`, `Pagination`, `WhatsAppLink`, `Photo`, `Icon` (inline SVG, no library).

### Motion

- **Load entrance:** `.enter` is a staggered CSS entrance for page headers and the hero, and `.hero-photo` is a slow settle-in of the hero image.
- **Scroll animations (AOS-style):** the same `data-aos` API as the AOS library (https://michalsnik.github.io/aos/), implemented in `src/components/motion/ScrollAnimations.tsx` (about 1 KB, IntersectionObserver).
  - Usage: `data-aos="fade-up"`, plus optional `data-aos-delay` and `data-aos-duration` in ms.
  - Available effects: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `slide-up`, and `image-reveal` (used by `<Photo reveal />`).
  - Each element animates once. Scans are repeated after client-side navigation and on DOM changes.
- **Why not the `aos` package:**
  - Its last release was in 2018, it's unmaintained, and it's about 290 KB unpacked.
  - It mutates classes on React-owned elements and needs `AOS.refresh()` after client navigation.
  - The in-house version keeps the same authoring API and works in every browser (the earlier CSS scroll-timeline version didn't run in Firefox).
- **Safety:**
  - Elements are hidden only after the observer starts (`html.aos-ready`), so content is visible without JavaScript.
  - `prefers-reduced-motion` disables everything.
  - Only opacity and transform are animated.
  - Sideways effects become a vertical rise below 768 px.
  - `html { overflow-x: clip }` prevents horizontal scroll.
  - Verified: 0 px overflow at 390, 768 and 1440 px while scrolling.

### Home hero photograph (supplied by Job Link Uganda)

`assets/brand/jlu-hero1-original.jpg` (6144×3456, 7 MB) was colour-corrected, contrast-lifted and sharpened, then exported to `public/images/hero/` via `src/config/hero.ts`:

- **Colour correction:** the strong orange cast was neutralised. White paper went from (232, 213, 179) to (234, 233, 222) in RGB.
- **Formats and sizes:** AVIF (13–104 KB) and WebP at widths 640–2560, a 154 KB JPEG fallback, and a tiny blurred placeholder.
- **Rendering (`<HomeHero />`):** a real `<img>` inside `<picture>`, preloaded with high fetch priority so it can be the LCP element. Decorative, so `alt=""`.
- **Desktop:** full-bleed with a left-to-right dark overlay behind the text.
- **Mobile:** a photo band that fades into a solid dark base beneath the text.

### Imagery (`src/config/images.ts` → `<Photo />`)

- Seven Unsplash photos, each viewed before selection, with African subjects and hospitality or workplace contexts.
- Served as plain `<img>` with a responsive `srcset` from the Unsplash image CDN (imgix: `auto=format` gives AVIF/WebP, and crops centre on each photo's focal point). Every image has explicit dimensions and lazy loading; only the hero loads with high priority.
- Each photo carries a visible credit, and nothing implies the people are Job Link staff, candidates or clients.

---

## 10. Website structure (built)

| Route | Purpose | Indexation |
|---|---|---|
| `/` | Two-journey home: hero with two routes, pathways, both processes, featured jobs, hospitality specialism, services, employer reasons, resources, transparency, split CTA | Indexable |
| `/jobs` | Search (GET form: keyword, category, location, type, date posted) plus results and browse sidebar | Clean URL indexable; any refinement noindex with canonical to `/jobs` |
| `/jobs/category/[c]` | Category hub with intro, child categories, category-in-location links, and "Hiring for these roles?" link to the matching service | ≥ 1 live job, or an intro of ≥ 280 characters |
| `/jobs/location/[l]` | Location hub | Same rule |
| `/jobs/category/[c]/location/[l]` | Combined hub | 404 at 0 jobs; indexable at ≥ 3 |
| `/jobs/[title-location-id]` | Vacancy page. Lifecycle-driven, JobPosting only while open, 301 on slug change, closed notice, related jobs, safety guidance | Open only |
| `/recruitment-services` | Employer hub: hospitality specialism, other services, process, expectations | Indexable |
| `/recruitment-services/[slug]` | Service pages from the CMS: body, process, visible FAQs, related services and job hubs. `Service` JSON-LD | Indexable |
| `/hire-staff` | Employer recruitment request (server action) | Indexable |
| `/for-job-seekers` | Candidate guide: process, commitments, categories, safety, resources | Indexable |
| `/how-it-works` | Full transparency page for both audiences | Indexable |
| `/recruitment-safety` | Scam-awareness pillar, including MGLSD/EEMIS verification for overseas offers | Indexable |
| `/career-resources`, `/career-resources/category/[slug]`, `/career-resources/[slug]` | Articles with `BlogPosting` JSON-LD and a CTA that routes readers into jobs or services | Categories 404 when empty |
| `/about`, `/contact`, `/privacy-policy`, `/terms` | Company and legal pages. Legal pages show a "draft" notice until reviewed (`src/config/legal.ts`) | Indexable |

### Internal-link clusters

- **Hospitality recruitment** links to the restaurant and hotel services, which link to the job categories they recruit for. Those category hubs link back to their service and to the career resources.
- **Every article** routes readers either to its related job category or to its related service and `/hire-staff`.
- **Jobs** link to their category hub, similar vacancies, and the safety guidance.

### Content

`npm run seed` loads 4 services, 9 job categories with hub intros, Kampala, 6 resource categories and 3 articles. The seed is idempotent and never overwrites edited documents. **It creates no jobs.**

---

## 11. Admin dashboard and analytics

- **Branding:** the logo on the login page and nav icon (`src/cms/admin/graphics`), brand-red primary buttons and focus states (`src/app/(payload)/custom.scss`), and the admin favicon.
- **Dashboard** (`src/cms/admin/dashboard/Dashboard.tsx`, rendered via `beforeDashboard`):
  - Role-aware: editors don't see traffic or enquiries.
  - Recruitment tiles; traffic tiles with change vs the previous period; a date range of 7, 30 or 90 days.
  - A visitors-per-day chart (a client component with a crosshair tooltip, arrow-key navigation and a table view).
  - Bar lists for most viewed jobs, traffic sources, top pages and devices.
  - Latest enquiries, and job deadlines, including jobs marked Open but past their date.
  - Built on Payload theme variables, so it works in light and dark mode.
- **Analytics:** cookieless and anonymous.
  - `PageViewTracker` sends a beacon to `POST /track` on each page view.
  - That handler drops bots, automated browsers, Do Not Track / Global Privacy Control signals, logged-in staff and non-public paths.
  - It stores path, job reference, device, referrer host, and a daily-rotating salted SHA-256 visitor ID. **No IP address is stored.**
  - Records go to the private, hidden `page-views` collection. Aggregation runs as SQL in `src/data/payload/analytics.ts`.
  - Records are pruned after about 400 days.
  - The privacy policy describes this.
- **Validation:** an Open job can no longer be saved with a closing date in the past.

---

## 12. Verification at this milestone

| Check | Result |
|---|---|
| `tsc`, `eslint` | ✅ clean |
| Unit tests | ✅ 35 passed (lifecycle, slugs, indexation, JobPosting, taxonomy roll-up, search-param parsing, form validation, rate limit) |
| `next build` | ✅ static pages, pre-rendered services and articles, dynamic job routes |
| `node scripts/qa.mjs`: 19 page types × 390/768/1440 px | ✅ no horizontal overflow, **0 axe WCAG 2.2 AA violations**, exactly one H1, valid JSON-LD, canonical present, no console errors |
| Job lifecycle end to end (temporary data, since deleted) | ✅ open job: JobPosting with salary, `validThrough` at the end of the Kampala day, listed, searchable, rolled into its parent hub, in the sitemap. Stale slug → 308. Closed: banner shown, no JobPosting, noindex, removed from the sitemap and listings |
| Enquiry form end to end | ✅ server-side field errors, successful submission stored privately with service and consent, public API 403, rate limit triggers after 5 submissions |

---

## 13. Business inputs still required

The following are needed before launch. Each one currently renders nothing, rather than a placeholder:
- Phone, email and WhatsApp numbers: entered in **Admin → Site Settings**.
- Social links, and office and opening hours (only if a verified office exists): also in Site Settings.
- Legal name.
- MGLSD domestic and external licence status.
- PDPO registration.
- Fee statements (`src/config/business.ts`).
- Legal review of the privacy policy and terms (`src/config/legal.ts`).
- Confirmation of the four seeded services.
- Real vacancies.
- The production domain.
