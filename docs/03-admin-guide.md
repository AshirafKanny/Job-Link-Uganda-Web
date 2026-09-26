# Job Link Uganda: Admin Guide

This guide is for the people who manage the Job Link Uganda website day to day: posting jobs, handling employer enquiries, editing pages and keeping the site accurate.

---

## 1. The big picture

The website has two parts that run together:

| Part | Address (on this computer) | What it's for |
|---|---|---|
| **The website** | http://127.0.0.1:3001 | What job seekers and employers see |
| **The admin** | http://127.0.0.1:3001/admin | Where you manage everything |

Everything you enter in the admin (jobs, services, articles, settings) is saved in a **database**. The website reads from that database, so changes appear on the site automatically. You never edit the website's code to post a job.

> **Important:** at the moment the site only runs on this computer. It is not on the internet yet. Going live needs a domain name and hosting (see section 12). Everything in this guide works the same way once the site is live, just at your real web address.

---

## 2. Starting and stopping the site

The site needs **two programs running**: the database and the website. Open the project folder in VS Code, open two terminals (**Terminal → New Terminal**, twice), and run:

**Terminal 1 (the database):**
```
npm run dev:db
```
Wait until you see `Postgres ready`.

**Terminal 2 (the website):**
```
npm run dev
```
Wait until you see `Ready`. Then open **http://127.0.0.1:3001** in your browser.

**To stop:** click into each terminal and press **Ctrl + C**. Stop the website first, then the database.

> Always use **127.0.0.1:3001**, not `localhost:3001`. Your Chrome forces `localhost` addresses onto a secure connection this local setup doesn't support.

---

## 3. Your first login

1. Go to **http://127.0.0.1:3001/admin**.
2. The first time, it asks you to **create the first user**. Enter your email and a strong password.
3. This first account automatically becomes the **Admin** (full control).

### Adding colleagues

Go to **Settings → Staff users → Create new** and give each person their own account and the right **role**:

| Role | Can do | Give it to |
|---|---|---|
| **Admin** | Everything, including staff accounts and Site Settings | Owners / managers |
| **Recruiter** | Jobs, employers, recruitment requests | Recruitment team |
| **Editor** | Articles, services, categories, images (can view jobs but not edit them) | Whoever writes content |

Only admins can change someone's role. Never share one login between several people.

For security, you're logged out after 8 hours, and an account locks for 15 minutes after 5 wrong passwords.

---

## 4. Your dashboard

The admin home page (`/admin`) is your control centre. It shows real data only; nothing on it is invented.

- **Recruitment:**
  - Open vacancies (live on the site now).
  - Jobs closing within 7 days.
  - New employer enquiries waiting for a reply.
  - Draft jobs.

  Click a tile to open that list.
- **Website traffic** (Admins and Recruiters). Choose **7, 30 or 90 days** at the top right:
  - **Visitors, page views, job views and enquiries**, each compared with the previous period (▲ up / ▼ down).
  - **Visitors per day:** hover over the chart, or click it and use the ← → arrow keys, to read each day. **Show as table** lists every day.
  - **Most viewed jobs:** which vacancies attract the most interest. Click one to edit it.
  - **Where visitors come from:** Google, Facebook, WhatsApp, direct visits and so on.
  - **Most visited pages** and **Devices** (mobile, desktop, tablet).
- **Needs attention:**
  - The latest employer enquiries.
  - Jobs closing soon.
  - Jobs marked **Open** whose closing date has already passed (shown as **Expired**, because they're hidden from the website).

### About the visitor statistics

The statistics are **anonymous by design**. They show *how many* people visited and *what* they looked at, never *who* they are.
- No cookies are used, and no names, emails or IP addresses are stored.
- Visitors are counted with a code that changes every day.

This keeps Job Link Uganda within the Data Protection and Privacy Act, and no cookie banner is needed.

Not counted:
- **Your own visits** while you're logged into the admin, so browsing your site doesn't inflate the numbers.
- Search-engine bots, link previews (such as WhatsApp or Facebook previews) and automated tools.
- People whose browser asks not to be tracked.

Raw visit records are kept for about 13 months, then removed automatically.

> Tip: to see the site as a visitor would (and be counted), open it in a private/incognito window.

## 5. First thing to do: Site Settings

**Settings → Site Settings** holds the contact details shown across the website.

| Field | What to enter |
|---|---|
| **Phone** | As you want it displayed, e.g. `+256 7XX XXX XXX` |
| **Email** | Your business email |
| **WhatsApp for job seekers** | Digits only, international format, **no +, no spaces**: `2567XXXXXXXX` |
| **WhatsApp for employers** | Same format. It can be the same number |
| **Has public office** | Tick **only** if there is a real office visitors can come to, then fill in the address and a Google Maps link |
| **Opening hours** | One line each, e.g. `Mon–Fri 8:30–17:30` |
| **Social links** | Pick the platform and paste the full link (starting with `https://`) |
| **Default description** | A one-sentence description used by Google when a page has none |

Click **Save**. The website updates within a few seconds:
- WhatsApp buttons ("Ask about this job", "WhatsApp our team") **only appear once a number is entered**. Until then they're hidden.
- Phone, email and address appear in the footer and on the Contact page.

**Golden rule:** if a detail isn't real and confirmed, leave it empty. Empty fields simply don't show. The site never displays placeholders.

---

## 6. Posting a job

Go to **Recruitment → Jobs → Create new**.

### The fields

| Field | Tips |
|---|---|
| **Title** | The name people search for: "Waitress", "Restaurant Supervisor", "Barista". Not internal titles |
| **Category** | Pick the most specific one (e.g. *Restaurant*, not *Hospitality*). Parent categories include their sub-categories automatically |
| **Location** | E.g. *Kampala*. Only Ugandan locations are available (see section 10) |
| **Summary** | One or two sentences. Shown on job cards and in Google results |
| **Employment types** | Full-time, part-time, etc. You can pick more than one |
| **Employer** | Choose **Confidential** (default) to advertise as Job Link Uganda, or **Named** if the employer agreed to be shown. For Named, pick the employer record (see section 8) |
| **Responsibilities / Requirements** | Click **Add item** for each point. Short, clear bullet points |
| **Experience** | Only if the employer specified it, e.g. "At least 1 year in a busy restaurant" |
| **Benefits** | Only benefits the employer has **confirmed** |
| **Additional details** | Optional extra text |
| **Salary** | Tick **Show salary** only for a **confirmed** salary. Enter the min, the max (optional) and the period (per month, etc.) |
| **How to apply** | Choose the method and write clear instructions: what to send, where, and any reference to quote |

### The right-hand sidebar

| Field | What it does |
|---|---|
| **Status** | **Draft** = not public. **Open** = live on the website. **Closed** = no longer accepting applications |
| **Featured** | Shows the job on the home page (featured jobs appear first) |
| **Date posted** | Filled in automatically the first time you set the job to Open |
| **Closing date** | The last day to apply. The job stays open until **the end of that day (Kampala time)** |
| **After retirement** | What happens to the page 90 days after closing (see below). Leave as *Remove page* unless other websites link to it |
| **Internal notes** | Private notes. **Never shown** on the website |

### Publishing

1. Fill in the job and leave the status as **Draft** while you work. Click **Save**.
2. When it's ready, set the status to **Open** and **Save**.
3. Visit **http://127.0.0.1:3001/jobs**. Your job is there, with its own page at an address like `/jobs/restaurant-supervisor-kampala-jl12`.

The number at the end (e.g. `jl12`) is the job's **reference number**. It's shown on the job page as "Reference: JL12", so candidates can quote it.

### What the site does automatically

- Adds the job to the job listings, search results, its category page, the location page and the sitemap.
- Tells Google it's a real vacancy (Google for Jobs data).
- If you later change the title, the old link still works and redirects to the new one.

---

## 7. Closing jobs, and why you don't always have to

### Jobs close themselves

- **With a closing date:** the job closes automatically at the end of that day.
- **Without a closing date:** the job closes automatically **30 days after it was posted**. To keep it open longer, set a closing date.

### Closing a job early (filled or withdrawn)

Open the job, set the **Status** to **Closed**, choose a **Close reason** (*Filled*, *Withdrawn* or *Deadline*), and **Save**.

### What happens to a closed job

1. The job page stays online with a clear **"This vacancy is closed"** notice and links to similar open jobs. People with an old link aren't left on an error page.
2. It disappears from job listings, search, the home page and the sitemap.
3. Google is told it's no longer a live vacancy.
4. **After 90 days** the page is removed completely, or redirected to its category if you chose that.

**Reopening:** set the status back to **Open** (and update the closing date if it has passed).

**Don't delete jobs.** Close them instead, so the website handles everything correctly. Deleting is only for mistakes, such as a duplicate you created by accident.

---

## 8. Employers (private)

**Private records → Employers** is your private client list. Only Admins and Recruiters can see it.

- **Name:** your internal name for the business.
- **Public name:** the name shown on vacancies, **only** when a job is set to *Named*.
- **Contact details and notes:** private; never shown on the website.

---

## 9. Employer enquiries ("Request staff")

When a business fills in the **Request staff** form on the website, the enquiry appears in **Private records → Recruitment requests**.

For each one:
1. Open it to see the business, contact person, phone, roles needed and requirements. The **Service** field shows which service page they came from.
2. Update the **Status** as you work: *New → Contacted → In progress → Closed*.
3. Use **Internal notes** to record calls and decisions.

These records are private: they never appear on the website and can't be read by the public.

> **Check this section regularly.** The site does not email you about new enquiries yet. Email notifications can be added once an email service is set up.

The form has spam protection built in. If one person sends more than 5 enquiries in 15 minutes, they're asked to wait. This also means that if **you** test the form several times in a row, it will eventually ask you to wait. That's expected.

---

## 10. What is locked, and why

These are switched off on purpose, to keep Job Link Uganda compliant:

| Feature | Status | What unlocks it |
|---|---|---|
| **Overseas jobs** | Off. Locations outside Uganda are rejected | A valid MGLSD external recruitment licence, registered on EEMIS, supplied as documentation |
| **Online job applications / CV uploads** | Off | Confirmed registration with the Personal Data Protection Office (PDPO) |
| **Request staff form** | On | Already enabled |

Candidates currently apply the way each job's **How to apply** instructions describe.

---

## 11. Content you can edit

### Recruitment services (Content → Services)

These are your employer service pages (Hospitality, Restaurant Staff, Hotel Staff, General Recruitment).

- **Please review each one** and confirm it describes a service you really offer. Edit the text if needed.
- Services use **Save draft** and **Publish**. Drafts are invisible on the website until you click **Publish changes**.
- **FAQs** appear on the page exactly as written.
- **Related job categories** link the service to the matching job pages.
- The **SEO** section sets the title and description shown in Google. Keep titles under about 60 characters and descriptions under about 155.

### Articles (Content → Articles)

The career advice guides.

1. **Create new**. Write a title, an **excerpt** (what the reader will learn), and the **body**.
2. Pick a **Category**. Set **Author name** only if a real person wrote or reviewed it; otherwise leave it empty and the article is credited to Job Link Uganda.
3. Under **Internal links & conversion**, pick the related job category or service, and the **Primary CTA** (*Browse jobs* for job-seeker articles, *Request staff* for employer articles).
4. **Save draft** while writing, then **Publish** when it is ready.

**Writing tips:**
- Write for Ugandan readers.
- Use short paragraphs and subheadings.
- Give practical advice.
- **No invented statistics, salaries or success stories.**

### Job categories and locations (Recruitment)

- **Job categories:** the **Intro** text appears at the top of each category page. A good intro (a short paragraph or two) describes what those jobs involve.
- **Locations:** Kampala is set up. Add another town only when you actually recruit there. Leave **Has landing page** unticked unless we build a dedicated page for it.

### Images (Content → Media)

- **Alt text is required.** Describe what the image shows, for people who can't see it.
- **Source:** say whether it's your own photo or stock. **Never use stock photos in a way that suggests they show your staff, clients or office.**
- Images are automatically resized for fast loading.

### Changing a page's web address (slug)

Every service, article and category has a **slug** (its web address). If you change the slug of a published page, the website **automatically redirects** the old address to the new one, so existing links keep working. You can see these in **Settings → Redirects**.

---

## 12. The database: what you need to know

### What it is

The database is where everything you enter in the admin is stored. Right now it's a PostgreSQL database stored **on this computer**, in the project folder **`.dev-db`**.

- It must be running (Terminal 1) for the website to work.
- **Never delete the `.dev-db` folder.** It contains all your jobs, articles, enquiries and accounts.
- You never need to open or edit the database directly. The admin is how you manage its contents.

### Backing it up

Do this regularly, and always before any big change:

1. Stop the website, then the database (**Ctrl + C** in both terminals).
2. Copy the whole **`.dev-db`** folder somewhere safe (another drive or cloud storage). Name the copy with the date, e.g. `dev-db-backup-2026-09-26`.
3. Start the database and website again.

**To restore:** stop both programs, replace `.dev-db` with your backup copy, and start again.

### When the site goes live

The live website will use a **hosted database** in the cloud with its own automatic backups, not this computer. When we deploy:
- The launch content (services, categories, guides) is loaded with `npm run seed`.
- Anything you created locally (jobs, users, settings) will need to be entered again on the live site, or migrated. We'll plan this at launch.

### Loading the starting content

`npm run seed` loads the starting services, categories and guides. It's safe to run again: it **never overwrites** anything you've edited, and it **never creates jobs**.

---

## 13. Your checklist: rules that protect the brand

- ✅ Only post **real** vacancies you're actively recruiting for.
- ✅ Only publish salaries and benefits the employer has **confirmed**.
- ✅ Close jobs when filled, or let them close automatically. **Don't delete them.**
- ✅ Keep Site Settings accurate. Leave unknown details empty.
- ❌ Never add fake jobs, testimonials, reviews, statistics or client logos.
- ❌ Never advertise overseas jobs (the site blocks it until licensed).
- ❌ Never share logins between people.

---

## 14. Before going live: still needed from the business

- [ ] Contact details in **Site Settings**
- [ ] Legal business name
- [ ] MGLSD recruitment licence status (domestic and, if applicable, external)
- [ ] PDPO data-protection registration
- [ ] Fee statements, if you want them published
- [ ] Legal review of the **Privacy policy** and **Terms** (both currently marked "Draft")
- [ ] Confirmation of the four services
- [ ] Real vacancies
- [ ] A domain name (e.g. `joblinkuganda.co.ug`) and hosting

---

## 15. Troubleshooting

| Problem | Fix |
|---|---|
| "This site can't be reached" | The website isn't running. Start both terminals (section 2) |
| "This site can't provide a secure connection" | You used `localhost`. Use **http://127.0.0.1:3001** |
| Admin shows errors or won't load data | The database isn't running. Check Terminal 1 shows `Postgres ready` |
| My job doesn't appear on the site | Check the status is **Open**, the closing date hasn't passed, and it's under 30 days old if there's no closing date |
| A change doesn't show yet | Refresh the page. Most pages update within seconds, some within an hour |
| The Request staff form says to wait | Too many submissions in a short time. Wait 15 minutes |
| I forgot my password | Use **Forgot password** on the login page. Email sending isn't set up yet, so for now an admin can set a new password for you under **Staff users** |
