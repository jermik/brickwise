# Brickwise — Project Handoff

You are joining a project mid-flight. Read this in full before suggesting anything. The owner is moving fast and wants execution, not generic advice.

---

## 1. What Brickwise is now

**Brickwise has two faces, one codebase, one domain.**

**Public face (brickwise.pro):** independent analytics for **tokenized rental real estate**. We track every active listing on **Lofty** (Algorand) and **RealT** (Ethereum/Gnosis) — 460+ properties — and score each on yield, risk, neighborhood quality, and fair value (0–100 composite). Output: buy/hold/avoid signals, comparison pages, rankings, city/property detail pages, plus an **Algorand ecosystem directory** (30+ projects).

**Private face (crm.brickwise.pro):** internal **GrowthOS CRM** — a system the owner uses to run a growth/outreach/agency operation for local businesses. Lead management, discovery, audits, proposals, follow-ups, content. Not public, gated by Clerk + a second access code.

**Target audience (public):** ZZP/freelance investors and crypto-curious users researching tokenized real estate. Secondary: Algorand ecosystem watchers.

**Target audience (CRM, private):** the owner only, for now. Possibly small team later.

**How it differs from older framings:** earlier briefs framed Brickwise as a generic "AI growth platform for agencies." That positioning is **not the live public site.** The live public site is **tokenized real estate analytics + Algorand ecosystem.** The CRM/GrowthOS is the internal tooling that lives inside the same Next.js codebase but is hidden behind auth.

---

## 2. Live product areas

**Public:**
- **Property Analyzer** — browse, filter, sort all 460 tracked tokens
- **Per-property detail pages** — score breakdown, yield math, comparables, risk notes
- **City pages** (dynamic SSG) — Detroit, Cleveland, Akron, Chicago, etc. ~30 cities
- **Rankings** — highest yield, buy signals, undervalued, new listings
- **Platform overview pages** — `/platform/lofty`, `/platform/realt`
- **Comparison pages (7)** — RealT vs Lofty (live data), Lofty vs Arrived, RealT vs Fundrise, Arrived vs Fundrise, Ark7 vs Lofty, Best Fractional Platforms, Best Real Estate Investing Apps
- **Learn hub** — 4 articles: tokenized RE intro, Lofty review, RealT review, how to invest
- **Market reports** — daily aggregate stats, dated reports at `/market/[date]`
- **Algorand ecosystem directory** — 30 projects, filtered + searchable
- **AI discoverability** — `/llms.txt` and `/llms-full.txt` for Perplexity/ChatGPT/Claude

**Private (Clerk + access code):**
- **CRM dashboard** at `/crm`
- **Leads** — add, edit, audit, view
- **Discovery** — find new leads
- **Follow-ups** — task management
- **Offers** — proposal generation
- **Content** — campaign content management
- **Proposal/audit/outreach pipeline** — currently weak, needs rework (see section 8)

---

## 3. Important routes / URLs

**Public:**
- `https://brickwise.pro` — homepage
- `https://brickwise.pro/analyzer` — main property browser
- `https://brickwise.pro/property/[id]` — per-property detail
- `https://brickwise.pro/city/[slug]` — per-city
- `https://brickwise.pro/platform/lofty` and `/platform/realt`
- `https://brickwise.pro/rankings/[highest-yield|buy-signals|undervalued|new-listings]`
- `https://brickwise.pro/compare/realt-vs-lofty` (live data)
- `https://brickwise.pro/compare/best-fractional-real-estate-platforms`
- `https://brickwise.pro/compare/best-real-estate-investing-apps`
- `https://brickwise.pro/compare/lofty-vs-arrived`
- `https://brickwise.pro/compare/realt-vs-fundrise`
- `https://brickwise.pro/compare/arrived-vs-fundrise`
- `https://brickwise.pro/compare/ark7-vs-lofty`
- `https://brickwise.pro/learn` (hub) + `/learn/{lofty-review, realt-review, what-is-tokenized-real-estate, how-to-invest-in-tokenized-real-estate}`
- `https://brickwise.pro/market` and `/market/[date]`
- `https://brickwise.pro/algorand` (ecosystem listing)
- `https://brickwise.pro/algorand/[slug]` (30 project pages)
- `https://brickwise.pro/llms.txt` and `/llms-full.txt`
- `https://brickwise.pro/x-avatar`, `/x-banner` (Brickwise brand PNG endpoints)
- `https://brickwise.pro/apple-icon`, `/favicon.svg`

**Private (Clerk + access code):**
- `https://brickwise.pro/crm` — main CRM dashboard
- `https://crm.brickwise.pro` — same CRM, subdomain
- `/crm/leads`, `/crm/leads/[id]`, `/crm/leads/new`, `/crm/leads/import`
- `/crm/leads/[id]/audit`, `/crm/leads/[id]/edit`, `/crm/leads/[id]/proposal`, `/crm/leads/[id]/proposal-package`
- `/crm/discovery`, `/crm/follow-ups`, `/crm/offers`, `/crm/content`
- `/crm/content/[id]`
- `/growthos` — public-facing landing for the CRM brand (logged-out visitors to crm.brickwise.pro see this)
- `/crm/access` — the access-code gate page
- `/api/crm/access` (POST), `/api/crm/logout` (POST)

**Auth:**
- `/sign-in`, `/sign-up` (Clerk)

---

## 4. Current tech stack

- **Framework:** Next.js 16 App Router. NOTE: this is Next 16, which has breaking changes vs older versions. Middleware is named `proxy.ts` (not `middleware.ts`). Don't assume Next 13/14/15 conventions.
- **Hosting:** Vercel (auto-deploy on push to `main`)
- **Auth:** Clerk (multi-domain session — brickwise.pro + crm.brickwise.pro share cookies via `.brickwise.pro` domain)
- **Database:** None currently. All data is JSON files in `lib/data/`:
  - `properties-live.json` + `properties-auto.json` (460 properties)
  - `market-updates.json`
  - `algorand-projects.json` (30 ecosystem projects)
- **CRM persistence:** Currently uses... TBD — the owner has lead/proposal data flowing through the CRM pages. Investigate `app/crm/*` server actions to see if it's JSON, Vercel KV, or some other store. (Sub-investigation needed before assuming.)
- **Email sending:** Not yet wired in a clean centralized way. Owner wants `growth@brickwise.pro` as the from-address. Likely candidate: Resend, Postmark, or Sendgrid. Currently no production email pipeline.
- **Analytics:** Vercel Analytics + Vercel Speed Insights (both live).
- **Error tracking:** Sentry (configured in `next.config.ts` via `@sentry/nextjs`).
- **Image handling:** `next/image` with `remotePatterns` for `images.unsplash.com`, `images.lofty.ai`, `**.lofty.ai`. Algorand projects use a deterministic gradient `LetterAvatar` fallback component instead of remote logos.
- **Brand component:** `<BrickwiseMark>` in `components/brand/` — single source for the brand mark. Used in sidebar, navbar, login screens, OG image, favicon.

**Env vars (do NOT share values, but ChatGPT should know these names exist):**
- `CLERK_SECRET_KEY` — Clerk server key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk client key
- `CRM_ACCESS_CODE` — second-layer CRM password
- `CRM_COOKIE_SECRET` — HMAC signing key for the CRM access cookie (32+ chars random)
- `KIE_AI_API_KEY` — Kie.ai for AI image generation (probably for content/proposals)
- Possibly `SENTRY_*` — Sentry DSN and auth token

---

## 5. What was recently built (this and prior sessions)

**SEO infrastructure (locked in, maintenance mode):**
- 687 indexed static/ISR pages
- Per-page canonicals, no homepage canonical leakage
- Single robots source (`app/robots.ts`)
- Sitemap generation including all property, city, ranking, market, algorand URLs
- CRM subdomain fully blocked from indexing
- `/llms.txt` and `/llms-full.txt` for AI search engines (Perplexity, ChatGPT, Claude)
- Removed synthetic `AggregateRating` from property pages (replaced with `PropertyValue` schema)

**Comparison page expansion:**
- 7 editorial comparison pages, all with FAQPage + Article + BreadcrumbList JSON-LD, mobile-responsive, internal-link-rich.

**Brand identity refresh:**
- New mark: 3×3 stair grid (cream cells, electric blue accent dot top-left)
- Variants: dark/light/mono
- Wired into: favicon, apple-touch-icon, opengraph-image, sign-in/sign-up screens, sidebar, public navbar, mobile nav, OG meta tags
- Live PNG endpoints for X profile: `/x-avatar` (400×400), `/x-banner` (1500×500)

**Algorand ecosystem (just shipped):**
- 30 hand-curated projects across 12 categories (Wallet, DEX, DeFi, NFT, Infrastructure, Tooling, Stablecoin, RWA, Gaming, Analytics, Bridge, Governance, Identity, AI)
- `/algorand` listing with category filters + search + featured section
- `/algorand/[slug]` SSG detail pages with Article + BreadcrumbList + SoftwareApplication JSON-LD
- Logos: deterministic gradient letter avatars (no remote image dependencies)

**CRM security gate (just shipped):**
- Two-layer gate: Clerk auth + HMAC-signed access cookie
- `/crm/access` page with the unlock form
- `/api/crm/access` POST verifies code, sets cookie
- `/api/crm/logout` POST clears cookie
- "🔒 Lock CRM" button in CRM sidebar
- Cookie attrs: HttpOnly, Secure, SameSite=Lax, Domain=.brickwise.pro, Max-Age 7 days
- HMAC-SHA256 signed via `CRM_COOKIE_SECRET` — not forgeable

**Distribution started:**
- X account `@BrickwisePro` set up with new avatar, banner, bio, first thread pinned
- Lofty affiliate URL active in `lib/affiliate.ts` (per-platform CTA component flips automatically when each affiliate URL is set)

**Content artifacts in repo (not committed depending on `.gitignore`):**
- `content/short-form-scripts.md` — 10 TikTok/Reels/Shorts scripts from live data
- `content/launch-posts-final.md` — copy-paste-ready posts for HN, Reddit, IH
- `content/launch-posts.md` — first draft of launch posts

---

## 6. Deployment state

- **Latest commit:** `98dc28f` (CRM access gate). May have moved since this doc was written.
- **Live:** Everything in section 2 (public + private).
- **Protected:** All `/crm/*`, `/growthos`, `crm.brickwise.pro/*` require Clerk auth + access code.
- **Public:** Everything else on `brickwise.pro` (home, analyzer, property, city, learn, compare, rankings, market, algorand, llms.txt).
- **Pending / not yet done:**
  - HN Show HN post (planned Tuesday 5pm Amsterdam = 8am US Pacific)
  - Reddit posts (planned Tue/Wed/Thu, copy ready in `content/launch-posts-final.md`)
  - YouTube Shorts / TikTok rollout (10 scripts ready)
  - RealT affiliate URL (email pending)
  - Arrived / Fundrise / Ark7 affiliate URLs (requires user-account activation first)
  - Migration of CRM data to a real database (Phase 2 — currently JSON-driven)
  - Smarter audit/proposal/outreach pipeline (see section 8)

---

## 7. Growth / distribution strategy

**Locked priorities (post-shipping, distribution-first mode):**

1. **Show HN** — single highest-leverage move, ~2,000–8,000 visitors if it hits front page. Post Tuesday 8am US Pacific. Copy in `content/launch-posts-final.md`.
2. **Reddit** — r/RealEstateInvesting (Tue/Wed morning EST), then r/passive_income, then r/AlgorandOfficial. Pace one per day.
3. **X/Twitter** — thread is posted and pinned. Follow up weekly with new data hooks.
4. **YouTube Shorts** — start with "30.9% Cleveland yield" hook (script in `content/short-form-scripts.md`). YouTube Shorts before TikTok (better fit for finance, less platform risk).
5. **Affiliate revenue** — Lofty live, others pending email outreach. Fundrise/Arrived require user-account first.
6. **Local business agency angle** — separate track from the public site. Uses the CRM/GrowthOS for Dutch-market outreach to small businesses. **Priority: Dutch-language emails, human tone, no AI feel, no bulk sending.** Owner wants to refine the audit→proposal→outreach pipeline before scaling.

**Indie Hackers:** blocked (new account, needs reputation building). Defer.

**Highest priority right now:** Show HN tomorrow + start the audit-proposal-outreach overhaul for the CRM.

---

## 8. Current problems / weak points

**CRM-side (this is the active improvement zone):**
- **Audit system is not smart enough** — the per-lead audit doesn't produce specific, actionable findings. Generic output.
- **Proposal generator is not accurate enough** — outputs feel generic, don't tie tightly to the specific audit findings.
- **Outreach generation doesn't match the audit** — what gets sent doesn't reference what the audit found. Should be tightly coupled.
- **Contact enrichment is weak** — lead records don't have enough context (decision-maker, channel preference, history, recent activity).
- **No status workflow** — owner wants buttons: mailed / instagrammed / need IRL / proposed / replied.
- **No integrated email sender** — owner wants to send from `growth@brickwise.pro` directly from the CRM.
- **No follow-up reminders** — once a lead is contacted, nothing prompts the next touch.
- **No reply handling** — replies aren't ingested back into the CRM.
- **Dutch outreach quality** — current outputs are too AI-flavored. Owner wants human-feel, no em dashes, no weird `mailto:` markdown links.

**Architecture/tech debt:**
- **GrowthOS/CRM lives inside the public Brickwise codebase.** Long-term it should extract to its own Next.js project (the `proxy.ts` rewrites are designed to make that extraction trivial when ready). Currently fine but coupling will grow.
- **Algorand ecosystem positioning risk:** the ecosystem page is currently framed as "Brickwise has an Algorand directory." If positioned wrong, could dilute the core "tokenized real estate analytics" brand. May want to either lean harder into it (become a credible Algorand intelligence platform) or de-emphasize and keep it as a side surface.

**Distribution gaps:**
- Only ~12 visitors/week as of last analytics check. Site is technically indexed (687 pages) but invisible.
- HN/Reddit posts are written and ready but NOT yet shipped.

---

## 9. Tomorrow's priorities

Concrete things to build/improve next:

1. **Smarter audit → proposal → outreach pipeline.** Tightly coupled. The audit's specific findings should be referenced directly in the proposal. The outreach should quote 1–2 specific audit findings. Make it feel personally observed, not generated.
2. **CRM lead status buttons.** Mailed / Instagrammed / Need IRL / Proposed / Replied. Each one a toggle on the lead record with a timestamp.
3. **Integrated email sender from `growth@brickwise.pro`.** Likely Resend or Postmark. Needs to land in inbox (SPF/DKIM/DMARC). One-click send from a lead detail page.
4. **Dutch outreach quality.** No em dashes. No `[link](url)` markdown that breaks in plain text. Plain text or simple HTML emails. Conversational tone. Owner is Dutch-native and will notice non-native phrasing.
5. **Follow-up reminders.** When a lead is contacted, schedule a follow-up 3 days later. Show on a dashboard. No automated send — just a nudge to the owner.
6. **Reply handling.** Ingest replies (forward `growth@brickwise.pro` to a webhook? Resend inbound? Postmark inbound?). Attach the reply to the lead record.
7. **Better lead enrichment.** When a new lead is added, auto-pull: website status, Instagram presence, Google review score, last website-update date, contact form availability. Use this to power the audit.
8. **Ship the Show HN post.** Highest-leverage external action this week.

---

## 10. Owner preferences (CRITICAL — read this)

The owner is direct, fast-moving, and impatient with fluff. Follow these rules:

- **No generic advice.** "Make sure to test your code" or "consider user feedback" type lines waste time. Be specific.
- **Practical execution over discussion.** When the owner asks for a feature, they want it built, not debated. Push back only when there's a real technical risk or a clear conflict with previous decisions.
- **Dutch for local business outreach.** All cold emails, follow-ups, audit summaries that go to Dutch SMBs must be in fluent, idiomatic Dutch. Owner is Dutch-native.
- **No em dashes (`—`) in emails.** Use normal punctuation (commas, periods, semicolons).
- **No markdown mailto links** in plain-text emails (`[email](mailto:x@y.com)` renders as garbage in some clients). Use plain URLs or just the email address inline.
- **Outreach must feel human, not AI-generated.** No "I hope this message finds you well." No "Let me know if you have any questions!" closers. Specific observations from a real audit. Conversational length (50–150 words). Personal openers that reference something concrete about the recipient's business.
- **No spam / no bulk sending.** Maximum ~10 sends/day. Always personalized. Owner has been clear on this.
- **CRM stays private behind Clerk + access code.** Do not propose making it public. Do not propose removing the Clerk layer.
- **Do NOT pre-write prompts unless asked.** The owner doesn't want a wall of "here's a prompt for you to feed into ChatGPT next." Direct work only.
- **Don't expose secrets.** Never paste access codes, API keys, cookie secrets, or affiliate codes into chat. Reference env-var names only.
- **The owner ships fast.** Expect short replies, "do this now," "what next." Match that energy. Give concrete next actions, not strategy decks.

---

## How to help the owner

When the owner asks you (ChatGPT) for something:

1. **Read what they actually need.** Not what you assume they need.
2. **Push back on contradictions** with this doc (e.g., if they ask to make CRM public, flag it).
3. **Be concrete.** File paths, code, exact commands.
4. **No fluff.** No "great question!" No "let me know if you need anything else."
5. **Default to Dutch** for outreach copy unless told otherwise.
6. **Default to JSON-driven** for new data features unless they explicitly ask for a database migration.
7. **Default to Next 16 App Router conventions** unless told otherwise. Don't assume older Next versions.

If asked something outside this scope (e.g., "make me a logo"), just do it cleanly. The owner wants forward motion.
