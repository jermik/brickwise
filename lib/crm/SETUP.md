# CRM Setup — Neon Postgres + Drizzle

The CRM storage layer uses **Neon Postgres** over an HTTP driver, so it works on Vercel serverless without connection pools, and on Fluid Compute. There are zero `fs.writeFileSync` calls — all reads and writes go through Drizzle.

---

## 1. Provision Neon Postgres

Pick one of:

### Option A — via Vercel Marketplace (recommended)
1. Vercel Dashboard → your project → **Storage** → **Create Database** → **Neon**
2. Pick a region close to your Vercel functions (e.g. `aws-eu-west-2`)
3. Vercel automatically writes `DATABASE_URL` to your project env (Production, Preview, Development)

### Option B — directly at neon.tech
1. Sign up at https://neon.tech (free tier: 0.5 GB storage, 1 project, plenty for a personal CRM)
2. Create a project → copy the **pooled connection string** (we use the HTTP driver, but the pooled URL works fine)
3. Manually add it to Vercel project env (`DATABASE_URL`, all environments)

---

## 2. Local environment

Add to `.env.local`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

If you use Vercel CLI:
```
vercel env pull .env.local
```

---

## 3. Apply the schema

The initial migration is already generated at `lib/crm/db/migrations/0000_crm_initial.sql`.

Pick one approach:

### A. Direct push (simplest, dev-style)
```
npm run db:push
```
Pushes the schema state directly. Good for solo development.

### B. Run migrations (production-grade)
```
npm run db:migrate
```
Applies the SQL files in `lib/crm/db/migrations/` in order.

### Generating future migrations
After editing `lib/crm/db/schema.ts`:
```
npm run db:generate
```
Then commit the new SQL file and run `db:migrate` (or `db:push` for dev).

### Inspecting data
```
npm run db:studio
```
Opens Drizzle Studio at https://local.drizzle.studio.

---

## 4. Verify the connection (smoke test)

After setting `DATABASE_URL` and running `db:push`:

```
npm run dev
```

Open http://localhost:3000/crm — you should see the dashboard with `0 total leads`.

If you see `[CRM] DATABASE_URL is not set` instead, the env var didn't load. Restart the dev server after editing `.env.local`.

---

## 5. Deploy to Vercel

1. Confirm `DATABASE_URL` is set in Vercel project env (all three: Production, Preview, Development) — it's auto-set if you used Marketplace
2. Run migrations against production:
   ```
   DATABASE_URL=<prod url> npm run db:migrate
   ```
   (or `db:push` for the first time)
3. Push your branch — Vercel builds and deploys

The CRM is auth-gated by `auth()` in `app/crm/layout.tsx` — only signed-in Clerk users can reach it.

---

# Test plan (manual smoke test)

After running `npm run db:push` against your Neon DB, walk through each step:

### Pipeline CRUD
- [ ] `/crm` loads the dashboard. Empty state shows "No leads yet".
- [ ] `/crm/leads/new` — fill out a lead (name, category, city). Submit.
- [ ] You're redirected to `/crm/leads/{id}`. Lead detail loads with the data you entered.
- [ ] `/crm/leads` — the new lead appears in the table.
- [ ] Click "Edit details" on the detail page. Change a field. Save. Detail page reflects the change.

### Compliance
- [ ] On the lead detail, click **Mark DNC**. Lead now shows "DO NOT CONTACT" badge. Status changes to "Lost". Contact logger is hidden.
- [ ] Toggle DNC off. Logger reappears.
- [ ] Try to log 11 contacts in one day across leads — the 11th must throw "Daily outreach limit of 10 reached".

### Audit + Proposal
- [ ] On a lead, click **Website audit**. Tick a few boxes. Save.
- [ ] Detail page now shows website/SEO/automation scores + summary.
- [ ] Click **Proposal**. Click "Generate proposal".
- [ ] Email/LinkedIn/Call/Bullets tabs each have content. "Copy to clipboard" works.

### Contact log
- [ ] Click **Log contact** on detail (with confirmation checkbox checked). Status auto-bumps from `new` → `contacted`. `lastContactedAt` updates. A follow-up appears scheduled +3 days.
- [ ] Refresh — contact history shows the entry. Follow-up appears in the right rail.

### Follow-ups
- [ ] `/crm/follow-ups` — your scheduled follow-up shows under "Upcoming".
- [ ] Manually update its `due_at` in Drizzle Studio to yesterday's date. Reload — it moves to "Overdue".
- [ ] Click **Mark done** — it disappears.

### CSV import
- [ ] `/crm/leads/import` — download the template CSV.
- [ ] Edit it (add a real business). Upload. You should see "X leads imported."
- [ ] `/crm/leads` shows the imported row(s).

### Persistence on serverless (the whole point)
- [ ] After any of the above, redeploy or restart your dev server. **All data persists** — that's the difference vs the old JSON storage.
- [ ] Open Drizzle Studio (`npm run db:studio`) — see your rows in `leads`, `contacts`, `follow_ups`.

### Negative tests
- [ ] Without `DATABASE_URL` set, the CRM throws "[CRM] DATABASE_URL is not set" on first request — does NOT silently swallow.
- [ ] Logging a contact on a DNC lead throws "do-not-contact. Action blocked."

---

## Rollback / migration from old JSON file

If you had data in `data/crm/leads.json` from the previous version:

1. Open `data/crm/leads.json`
2. For each lead, manually re-add via `/crm/leads/new` or transform to a CSV and use `/crm/leads/import`
3. Once verified, delete `data/crm/`

There's no automatic JSON → DB migration script (the prior version was for personal use only — keep manual entries small).
