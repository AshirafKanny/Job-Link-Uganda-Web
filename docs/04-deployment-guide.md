# Job Link Uganda: Deployment Guide

How to put the website on the internet and connect your domain name. Follow the steps in order.

---

## The setup

| Service | What it does | Cost |
|---|---|---|
| **Vercel** | Runs the website and admin, with a global network that keeps pages fast | Pro plan ($20/month). The free "Hobby" plan is for personal, non-commercial use only, so a business must use Pro |
| **Neon** | The live **database** (PostgreSQL), with automatic backups | Free plan to start; upgrade as the business grows |
| **Cloudflare R2** | Stores **images uploaded in the admin** | Free up to 10 GB |
| **Cloudflare Turnstile** | Invisible spam protection for the Request staff form | Free |
| **Domain registrar** | Your web address, e.g. `joblinkuganda.co.ug` | Yearly fee; varies by registrar |

Prices change. Check each provider's pricing page when you sign up.

**Why this setup:** it's the officially supported way to host Payload + Next.js, it needs no server maintenance, it includes HTTPS automatically, and every update you push to GitHub goes live automatically.

**Cheaper alternative:** Railway or Render can run the site and database on one plan. The steps are similar; ask for a tailored guide if you prefer that route.

---

## Step 0: Push the latest code to GitHub

The deployment setup added database migration files (`src/migrations/`) and new scripts in `package.json`. They must be on GitHub before deploying:

```bash
git add package.json src/migrations
git commit -m "chore: add production database migration and deploy scripts"
git push
```

---

## Step 1: Create the live database (Neon)

1. Go to **https://neon.tech** and sign up. Signing in with GitHub is easiest.
2. **Create a project:**
   - Name: `job-link-uganda`
   - Postgres version: the latest offered
   - **Region: Europe (Frankfurt).** Neon has no African region, so pick the closest to Uganda.
3. Open **Connection details** and turn on **Connection pooling**. The connection string will then contain `-pooler`.
4. Copy the connection string. It looks like:
   `postgresql://USER:PASSWORD@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`
5. Keep it somewhere private. **This is your `DATABASE_URL`.** Never share it or put it in code.

---

## Step 2: Create storage for uploaded images (Cloudflare R2)

1. Go to **https://dash.cloudflare.com** and create a free account.
2. In the left menu open **R2 Object Storage**. Enabling R2 asks for a card, but the free allowance covers this site.
3. **Create bucket** and name it `joblink-media`.
4. Go to **R2 → Manage R2 API Tokens → Create API token**:
   - Permissions: **Object Read & Write**
   - Apply to: the `joblink-media` bucket only
5. Copy the four values shown. **The secret is shown only once:**

| From Cloudflare | Becomes |
|---|---|
| Access Key ID | `S3_ACCESS_KEY_ID` |
| Secret Access Key | `S3_SECRET_ACCESS_KEY` |
| Endpoint (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`) | `S3_ENDPOINT` |
| Bucket name `joblink-media` | `S3_BUCKET` |

---

## Step 3: Create spam protection (Cloudflare Turnstile)

1. In the Cloudflare dashboard open **Turnstile → Add widget**.
2. Name: `Job Link Uganda`. Hostnames: your domain (e.g. `joblinkuganda.co.ug`). You can add the temporary Vercel address later too.
3. Widget mode: **Managed**.
4. Copy the **Site Key** (becomes `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and the **Secret Key** (becomes `TURNSTILE_SECRET_KEY`).

---

## Step 4: Deploy on Vercel

1. Go to **https://vercel.com**, sign up **with your GitHub account**, and choose the **Pro** plan.
2. **Add New → Project → Import** your `Job-Link-Uganda-Web` repository.
3. Framework preset: **Next.js** (detected automatically).
4. Under **Build and Output Settings**, override the **Build Command** with:
   ```
   npm run ci
   ```
   This applies database migrations first and then builds the site, so the live database always matches the code.
5. Open **Environment Variables** and add these. Use real values, not the examples:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | For now, the Vercel address you'll get (e.g. `https://job-link-uganda-web.vercel.app`). Change it to your domain in Step 7 |
| `SITE_INDEXABLE` | `false` until you're ready for Google (Step 8) |
| `DATABASE_URL` | Your Neon pooled connection string (Step 1) |
| `PAYLOAD_SECRET` | A **new** long random string. Generate one on your computer with the command below; don't reuse your local one |
| `S3_BUCKET` | `joblink-media` |
| `S3_REGION` | `auto` |
| `S3_ENDPOINT` | From Step 2 |
| `S3_ACCESS_KEY_ID` | From Step 2 |
| `S3_SECRET_ACCESS_KEY` | From Step 2 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | From Step 3 |
| `TURNSTILE_SECRET_KEY` | From Step 3 |
| `FEATURE_EMPLOYER_ENQUIRIES` | `true` |
| `FEATURE_OVERSEAS_RECRUITMENT` | `false` |
| `FEATURE_CANDIDATE_SYSTEM` | `false` |

To generate `PAYLOAD_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Click **Deploy** and wait a few minutes.
7. In **Project → Settings → Functions**, set the **Function Region** to **Frankfurt (fra1)**, the same region as the database, so pages load faster. Then **redeploy** (Deployments → ⋯ → Redeploy).

When it's done, Vercel gives you an address like `https://job-link-uganda-web.vercel.app`. Your site is live there.

> If the build fails, open the deployment's **Build Logs**. The most common cause is a missing or mistyped environment variable.

---

## Step 5: First-time setup of the live site

The live database is **new and empty**. Your local data (your admin account, the test "waiter" job, settings) stays on your computer and does not transfer.

1. **Load the launch content** (services, categories, guides) into the live database. On your computer, in the project folder:
   ```bash
   # PowerShell
   $env:DATABASE_URL="<your Neon connection string>"; npm run seed
   ```
   You should see `Seed complete: 23 created`. Close that terminal afterwards so the live database address isn't left set.
2. Open `https://<your-vercel-address>/admin` and **create your admin account**. The first account becomes the administrator.
3. Fill in **Site Settings** (phone, email, WhatsApp, social links).
4. Add your **real vacancies** under Jobs.

---

## Step 6: Get a domain name

- **`.co.ug` or `.ug`:** best for local trust. Buy from an accredited Ugandan registrar (the `.ug` registry lists them). Uganda-based web hosting companies commonly sell these.
- **`.com`:** can be bought from Cloudflare Registrar or Namecheap.

Tip: if budget allows, register both `.co.ug` and `.com` and redirect one to the other, so nobody else can take the name.

---

## Step 7: Connect your domain

1. In Vercel: **Project → Settings → Domains → Add**. Enter your domain, e.g. `joblinkuganda.co.ug`, and add `www.joblinkuganda.co.ug` too.
2. Choose which one is primary. The version **without www** is recommended; Vercel then redirects `www` to it automatically.
3. Vercel shows the **DNS records** to create. Typically:

| Type | Name / Host | Value |
|---|---|---|
| **A** | `@` (the domain itself) | the IP address Vercel shows (commonly `76.76.21.21`) |
| **CNAME** | `www` | the value Vercel shows (commonly `cname.vercel-dns.com`) |

   **Use the exact values Vercel displays for your project.**
4. Log in to your **domain registrar**, open **DNS management** for your domain, and create those records. Delete any old `A` record on `@` that points elsewhere.
5. Back in Vercel, wait for both domains to show **Valid Configuration**. This usually takes minutes, and occasionally up to 48 hours. Vercel issues the **HTTPS certificate** automatically.
6. **Update the site address:** in Vercel **Environment Variables**, change `NEXT_PUBLIC_SITE_URL` to `https://joblinkuganda.co.ug` (your real domain, no trailing slash), then **Redeploy**. This fixes links, canonical tags, the sitemap, share images and admin security checks.
7. In **Cloudflare Turnstile**, make sure your domain is listed under the widget's hostnames.

---

## Step 8: Go live on Google (when the content is ready)

Only do this once real contact details, vacancies and reviewed legal pages are in place:

1. In Vercel set `SITE_INDEXABLE` to `true` and **Redeploy**. Until then, search engines are asked not to index the site.
2. **Google Search Console** (https://search.google.com/search-console):
   - Add your domain as a property and verify it with the **DNS TXT record** it gives you (add it at your registrar).
   - Open **Sitemaps** and submit `https://joblinkuganda.co.ug/sitemap.xml`.
3. **Bing Webmaster Tools:** import your site from Search Console.
4. **Google Business Profile:** create or claim it with the same name, phone and website as the site. Include the address only if you have a verified public office.

---

## Everyday running

### Updating the website

Any change pushed to the `main` branch on GitHub **deploys automatically**. Vercel builds it, applies any new database migrations, and switches over with no downtime. You can watch progress under **Deployments**.

### Changing the database structure (developers)

After changing collections or fields:
```bash
npm run migrate:create   # generates a new file in src/migrations
```
Commit that file along with the code. The next deploy applies it.

### Backups

- **Neon** keeps a restore window, whose length depends on your plan. Check it under your Neon project's **Backup & Restore**.
- **Images** are stored in R2 and aren't affected by deployments.

### Rolling back a bad update

In Vercel, open **Deployments**, find the last good one, and choose **⋯ → Promote to Production**.

---

## Checklist

- [ ] Latest code pushed to GitHub (Step 0)
- [ ] Neon database created, pooled connection string saved
- [ ] R2 bucket and API token created
- [ ] Turnstile widget created
- [ ] Vercel project deployed with all environment variables, build command `npm run ci`, region Frankfurt
- [ ] Launch content seeded; admin account created; Site Settings filled in
- [ ] Domain bought and connected; `NEXT_PUBLIC_SITE_URL` updated; redeployed
- [ ] Content verified, then `SITE_INDEXABLE=true`, redeployed, and sitemap submitted to Google
