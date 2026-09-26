# Job Link Uganda — Website

Recruitment website and job platform for Job Link Uganda. Built with Next.js (App Router), Payload CMS, PostgreSQL and Tailwind CSS.

- Strategy & SEO: [docs/01-discovery-seo-architecture.md](docs/01-discovery-seo-architecture.md)
- Technical architecture: [docs/02-technical-architecture.md](docs/02-technical-architecture.md)
- **Admin guide (start here if you manage the site):** [docs/03-admin-guide.md](docs/03-admin-guide.md)

## Local development

Requirements: Node.js ≥ 20.9. No local PostgreSQL or Docker is needed.

```bash
npm install
cp .env.example .env        # then set PAYLOAD_SECRET (command in the file)

npm run dev:db              # terminal 1 — embedded PostgreSQL on port 54329
npm run dev                 # terminal 2 — http://127.0.0.1:3001, admin at /admin
npm run seed                # once — loads launch content (services, categories, guides; no jobs)
```

The first account created at `/admin` becomes the administrator. Then fill in **Admin → Site Settings** (phone, email, WhatsApp, socials): empty fields are simply not shown on the site.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `npm run build` / `npm start` | Next.js dev, production build, production server |
| `npm run dev:db` | Local embedded PostgreSQL (data in `.dev-db/`, git-ignored) |
| `npm run seed` | Load launch content into the CMS (idempotent; never overwrites edits; creates no jobs) |
| `npm test` | Unit tests (Vitest) |
| `node scripts/qa.mjs <baseUrl> <paths…>` | Milestone QA: overflow at 390/768/1440 px, axe WCAG 2.2 AA, one H1, metadata, JSON-LD, screenshots in `.qa/` |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `npm run generate:importmap` | Regenerate the Payload admin import map after adding admin components |

## Ground rules

- **Never invent business facts.** Unknown values stay empty (`src/config/business.ts`, Site Settings) and the UI omits them. Never publish example jobs, testimonials or statistics.
- **Pages read content only through `@/data`.** Never import `payload` in a page or component.
- **Build every URL with `src/lib/routes.ts`, and every page's metadata with `buildMetadata()`.**
- **Overseas recruitment and the candidate system stay disabled** until verified licence and PDPO documentation is supplied (`src/config/features.ts`).
