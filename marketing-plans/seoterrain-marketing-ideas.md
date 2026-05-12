# SEO Terrain — Marketing Ideas

*Last updated: 2026-05-12*
*Production: https://seoterrain.vercel.app*

> Companion to:
> - [seoterrain-product-marketing-context.md](./seoterrain-product-marketing-context.md)
> - [seoterrain-launch-strategy.md](./seoterrain-launch-strategy.md)
> - [seoterrain-lead-magnets.md](./seoterrain-lead-magnets.md)
> - [seoterrain-social-content.md](./seoterrain-social-content.md)
>
> Executes the **marketing-ideas skill** for SEO Terrain. 40 ideas
> filtered through MVP-stage reality and the product's audit-first,
> local-business, anti-AI-slop positioning. Every idea has effort,
> impact, fit and verdict.

---

## Scoring legend

**Effort**: 1 = afternoon, 2 = 1–3 days, 3 = a week, 4 = multi-week
**Impact**: 1 = micro (1–5 audits), 2 = small (5–25), 3 = solid (25–100), 4 = step-change (100+)
**Fit**: 1 = off-brand, 5 = perfect for stage + positioning
**Verdict**: **DO NOW** · **DO THIS QUARTER** · **DEFER** · **REJECT**

---

## TL;DR — Top 10 high-leverage moves for this quarter

| # | Idea | Effort | Impact | Verdict |
|---|---|---|---|---|
| 1 | Hand-run audits + warm cold email to 10 local owners/week | 2 | 4 | DO NOW |
| 2 | Permissioned teardown pages (`/teardowns/<slug>`) | 3 | 4 | DO NOW (when ready) |
| 3 | Weekly LinkedIn teardown / pattern post | 1 | 3 | DO NOW |
| 4 | Fix-guide content (`/guides/<slug>`) — one per week, 6 in 60 days | 2 | 3 | DO NOW |
| 5 | "Audit my competitor instead" subject-line variant | 1 | 3 | DO NOW |
| 6 | Agency pre-sales asset pitch (5 small NL agencies) | 2 | 4 | DO NOW |
| 7 | `/scoring` explainer page | 1 | 2 | DO NOW |
| 8 | Server-side report-view counter (instrumentation) | 1 | 2 | DO NOW |
| 9 | Featured-in-a-newsletter outreach (1 NL SMB newsletter / month) | 2 | 3 | DO THIS QUARTER |
| 10 | NL/BE local-business community engagement (Facebook + forums) | 1 | 2 | DO THIS QUARTER |

The next 30 ideas are useful, but if you only ship 10 — these are them.

---

## All 40 ideas, scored

### A. Audit-as-distribution (the core loop)

#### 1 — Hand-run audits + warm cold email

- **What**: Audit 10 local businesses per week by hand, then email the
  owner the report URL as a no-pitch artefact.
- **Why it fits**: The audit is the magnet. Cold email with a real
  report URL is the only outreach with a pre-built proof artefact.
- **Effort**: 2 (≈ 2 hours/week per cohort of 10)
- **Impact**: 4 (every reply is a qualified lead)
- **Fit**: 5
- **Verdict**: **DO NOW** — the spine of the entire growth motion.
- **First steps**: (a) Pull 10 owner targets by hand from Google Maps.
  (b) Run audits, save URLs in tracker. (c) Send max 5 emails/day,
  one-by-one.

#### 2 — Permissioned teardown pages (`/teardowns/<slug>`)

- **What**: Long-form public case study of one audited business, with
  the owner's permission, name + numbers visible.
- **Why it fits**: Concrete proof beats any positioning. Each teardown
  is permanent SEO inventory.
- **Effort**: 3 per teardown (~ 1 day write + permissioning)
- **Impact**: 4 (each teardown drives ≥ 15 audits in first 30 days
  if it's any good)
- **Fit**: 5
- **Verdict**: **DO NOW (when ready)** — once a Week-1–2 audited
  owner permissions us.
- **First steps**: Ask one in-flight audited owner about a teardown
  with a € 50–€ 100 thank-you. Draft. Show them. Publish only after
  written sign-off.

#### 3 — "Audit my competitor instead" subject-line variant

- **What**: Alternate cold-email opener: "Don't want to share your
  own business? Run a free audit on the competitor that's outranking
  you." Use the **competitor's** audit URL in the email instead of
  the owner's.
- **Why it fits**: Removes the "I don't want my own data scored"
  hesitation entirely. Lower-friction reply.
- **Effort**: 1 (it's a copy variant)
- **Impact**: 3 (likely to lift reply rate 5–10 percentage points)
- **Fit**: 5
- **Verdict**: **DO NOW** — A/B test starting Week 4 of launch.
- **First steps**: Identify 5 prospects with an obvious nearby
  competitor. Audit the competitor. Send the email referencing
  competitor.

#### 4 — Server-side report-view counter

- **What**: Track when each `/report/<slug>` URL is opened. Anything
  with > 1 view = the owner forwarded it.
- **Why it fits**: Single highest-signal instrumentation possible.
  Reveals which reports led to internal sharing → followup window.
- **Effort**: 1 (2 hours of dev)
- **Impact**: 2 (no direct growth, but enables surgical followup)
- **Fit**: 5
- **Verdict**: **DO NOW** — Week 1.

#### 5 — UTM stamping on every internal CTA

- **What**: Add `?utm_source=<surface>` to every CTA → `/dashboard/new`.
- **Why it fits**: Cheap attribution. Lets us cut content that
  doesn't drive audits.
- **Effort**: 1 (30 min)
- **Impact**: 2 (enabler, not a lever itself)
- **Fit**: 5
- **Verdict**: **DO NOW** — Week 1.

---

### B. SEO surfaces & content

#### 6 — Fix-guides (`/guides/<slug>`) — one per week

- **What**: 800–1,400 word focused guide on one specific audit
  recommendation (e.g. GBP categories for restaurants).
- **Why it fits**: Permanent SEO inventory + each one funnels into
  the audit + provides social/cold-email reference material.
- **Effort**: 2 per guide
- **Impact**: 3 (each guide: ≥ 50 organic visits in 90 days, ≥ 5
  audits attributed)
- **Fit**: 5
- **Verdict**: **DO NOW** — start Week 2 of launch, six guides in
  60 days.

#### 7 — Category landing pages (already 5; add 3 more after Stage 1)

- **What**: `/audits/restaurant`, `/audits/salon`, etc. — already
  shipped. Future: `/audits/cafe`, `/audits/yoga-pilates-studio`,
  `/audits/vet-clinic`.
- **Why it fits**: Long-tail SEO + targeted cold-email landing.
- **Effort**: 2 per category page (existing template makes it fast)
- **Impact**: 3 cumulatively
- **Fit**: 5
- **Verdict**: **DO THIS QUARTER** — only after Stage 1 advancement;
  first prove the current 5 convert.

#### 8 — `/scoring` explainer page

- **What**: One page explaining the five weighted dimensions and how
  the scoring works. Linked from every report and audit.
- **Why it fits**: Defuses the "is this AI?" objection in inbound
  conversations. Trust-signal at scale.
- **Effort**: 1 (1 day)
- **Impact**: 2 (reduces inbound friction, doesn't directly drive
  audits)
- **Fit**: 5
- **Verdict**: **DO NOW** — Week 1.

#### 9 — Comparison pages: "SEO Terrain vs [LocaliQ / Yext / Surfer]"

- **What**: Explicit competitor-comparison pages for the most common
  alternatives.
- **Why it fits**: Catches high-intent decision-stage searchers.
- **Effort**: 2 per page
- **Impact**: 2 (modest at MVP scale — these win when there's a name
  to compare against)
- **Fit**: 3
- **Verdict**: **DEFER** — not enough brand recognition yet for
  prospects to compare us against alternatives. Revisit at Month 6.

#### 10 — Year/quarter wrap report: "State of local SEO for NL SMBs"

- **What**: Aggregate insights from 50+ audits into one annual report.
- **Why it fits**: High-trust signal, generates real backlinks,
  becomes the artefact for a TV/podcast pitch.
- **Effort**: 4 (multi-week)
- **Impact**: 4 (eventually) — but only if N is high enough
- **Fit**: 5
- **Verdict**: **DEFER** — needs ≥ 50 audits and ≥ 30 days of data.
  Plan for Month 4.

#### 11 — Glossary / terminology marketing

- **What**: SEO Terrain–owned definitions for "GBP categories", "review
  velocity", "local pack", etc. — one URL per term.
- **Why it fits**: Long-tail search capture for educational queries.
- **Effort**: 2 (initial 8 terms, 2 hours each)
- **Impact**: 2 (slow burn, but compounds)
- **Fit**: 4
- **Verdict**: **DEFER** — only after the fix-guide library has
  proven out. Don't fragment SEO surface area early.

#### 12 — Programmatic SEO (`/audits/<cat>/<city>`)

- **What**: Auto-generate `/audits/salon/rotterdam`,
  `/audits/restaurant/amsterdam`, etc.
- **Why it fits**: Captures hyper-local long-tail.
- **Effort**: 3
- **Impact**: 2 (low quality content tax: Google now penalises thin
  programmatic pages aggressively)
- **Fit**: 1 (off-brand — explicitly rejected in product context)
- **Verdict**: **REJECT** — programmatic-thin-page SEO is the
  opposite of our trust-first positioning.

---

### C. Borrowed-channel leverage

#### 13 — Agency pre-sales asset pitch (5 small NL agencies)

- **What**: Pitch SEO Terrain to small local agencies as their
  pre-sales audit tool. They use it; we get referrals when their
  clients ask for help.
- **Why it fits**: Higher-leverage than owner-by-owner outreach.
  Agencies feed audits + leads at zero marginal cost to us.
- **Effort**: 2 (5 personalised emails + 2 calls)
- **Impact**: 4 (one active agency = 2–5 audits/month flowing in)
- **Fit**: 5
- **Verdict**: **DO NOW** — Week 1 of launch, send 5 emails.

#### 14 — Featured in an NL SMB newsletter

- **What**: Pitch one Dutch local-business / kappers / horeca
  newsletter per month: "free audit code for your subscribers".
- **Why it fits**: Borrowed credibility in front of pre-qualified
  owners. Single best high-leverage NL acquisition channel.
- **Effort**: 2 (find + pitch + reply)
- **Impact**: 3 per inclusion (20–50 audits per featured slot)
- **Fit**: 5
- **Verdict**: **DO THIS QUARTER** — Month 2 onward.
- **First steps**: List candidates: Salon Magazine NL, Misset Horeca
  digital newsletter, KvK MKB updates, local Chamber of Commerce
  bulletins, NVM Connect (real estate), KNMT (dental).

#### 15 — Local-business community engagement (Facebook + forums)

- **What**: Reply substantively in Dutch SMB-owner groups when
  someone asks "how do I show up on Google". Share a real audit URL
  in context — never self-promote.
- **Why it fits**: Where the actual prospects already are.
  Conversation > content.
- **Effort**: 1 (15 min, 3x/week)
- **Impact**: 2 (slow but trust-compounding)
- **Fit**: 5
- **Verdict**: **DO THIS QUARTER** — Month 1 light, Month 2 onward
  scale.
- **First steps**: Join "Kappers Nederland", "Restaurant Eigenaren
  NL", local FB Ondernemers groups per city.

#### 16 — Podcast / interview circuit

- **What**: Pitch SMB-focused podcasts (NL): "I audited 50 [category]s
  in NL. Here's what I found."
- **Why it fits**: Long-tail trust; one episode = years of audit
  attribution.
- **Effort**: 3 per booking (prep + recording + edits + promotion)
- **Impact**: 3 (one good booking can produce 30+ audits)
- **Fit**: 4
- **Verdict**: **DEFER** — needs N ≥ 30 audits before there's a story
  to tell. Plan for Month 3.

#### 17 — Influencer marketing

- **What**: Pay or partner with NL business influencers.
- **Effort**: 4 + budget
- **Impact**: 2 (mostly noise at our stage)
- **Fit**: 1
- **Verdict**: **REJECT** — off-brand and uneconomic at MVP scale.

---

### D. Product-led loops

#### 18 — Shareable report URL forwarding (already live)

- **What**: Every report has a clean public URL that owners forward
  to their web designer / accountant / marketing person.
- **Why it fits**: The fundamental virality vector. Most product-led
  growth this product gets.
- **Effort**: 0 (already live)
- **Impact**: 3
- **Fit**: 5
- **Verdict**: **DO NOW** (instrument it — see #4 + #5)

#### 19 — "Audited by" badge for owners who shipped fixes

- **What**: After a fix-ship event, offer the owner a small "Audited
  by SEO Terrain" web/email badge — a static SVG they can place on
  their site footer.
- **Why it fits**: Powered-by marketing without paid spam.
- **Effort**: 1 (one design + hosting)
- **Impact**: 1 (low at MVP scale; meaningful at 50+ adopted)
- **Fit**: 3
- **Verdict**: **DEFER** — Month 3 once 10+ owners have shipped a fix.

#### 20 — Free-migration / done-with-you pull

- **What**: For agencies considering an alternative audit tool, offer
  to run their next 10 prospects through SEO Terrain for free as a
  test.
- **Why it fits**: Eliminates the trial friction for agency partners.
- **Effort**: 2 per agency
- **Impact**: 3
- **Fit**: 5
- **Verdict**: **DO THIS QUARTER** — extension of idea #13.

#### 21 — Public weekly "audits this week" digest on the homepage

- **What**: Small homepage section: "20 audits run this week. Most
  common gap: GBP secondary categories." Updated weekly, manually.
- **Why it fits**: Real-time social proof without fake metrics.
- **Effort**: 1 to build + 5 min/week to update
- **Impact**: 2 (trust signal, not a direct lever)
- **Fit**: 4
- **Verdict**: **DEFER** — Month 2 once weekly volume hits ≥ 10
  audits.

#### 22 — Owner-friendly action checklist embed in the report

- **What**: Already in the action plan section of every report. No
  change needed.
- **Verdict**: **(already live)**

---

### E. Email / outbound

#### 23 — Founder-from-the-trenches email (cold)

- **What**: The owner-email template already in
  [seoterrain-launch-strategy.md](./seoterrain-launch-strategy.md)
  — sent 5/day max, hand-personalised, with the prospect's actual
  audit URL.
- **Effort**: 1 per email
- **Impact**: 4
- **Fit**: 5
- **Verdict**: **DO NOW** — the spine of acquisition.

#### 24 — One-bump follow-up only

- **What**: Single short follow-up to non-replies: "did this land in
  spam?". Never two.
- **Effort**: 0
- **Impact**: 2 (recovers ~10% of non-replies)
- **Fit**: 5
- **Verdict**: **DO NOW**.

#### 25 — Email mini-course / drip

- **What**: 5-day "Local SEO in your inbox" course.
- **Effort**: 3 (multi-week build)
- **Impact**: 1 (~5% completion rate; SMB owners don't take SEO
  courses)
- **Fit**: 1
- **Verdict**: **REJECT** — explicitly rejected in lead-magnets doc.

#### 26 — Newsletter

- **Effort**: 3 (ongoing)
- **Impact**: 1 at our stage
- **Fit**: 2
- **Verdict**: **REJECT** — no list, no list-building strategy, wrong
  audience.

#### 27 — Personal LinkedIn DMs to engaged commenters

- **What**: When a LinkedIn comment is substantive, follow with a
  single thoughtful DM offering a free audit on their own business.
- **Effort**: 1 per DM
- **Impact**: 2 (high-quality leads, low volume)
- **Fit**: 5
- **Verdict**: **DO NOW** — but rule: only after 3 substantive
  exchanges, never as first DM.

---

### F. Paid (deferred almost entirely)

#### 28 — Google Ads on "local SEO audit" / "[category] SEO audit"

- **Effort**: 2 + budget
- **Impact**: 3 (high-intent)
- **Fit**: 4
- **Verdict**: **DEFER** — defer until Stage 1 and CAC economics
  exist. Premature now.

#### 29 — LinkedIn Ads

- **Effort**: 3 + budget
- **Impact**: 2
- **Fit**: 3
- **Verdict**: **DEFER** — wrong audience targeting at MVP scale;
  agencies are too small a market to optimise an ad campaign for.

#### 30 — Facebook / Instagram Lead Ads

- **Effort**: 3 + budget
- **Impact**: 1 (broad audience, low conversion intent)
- **Fit**: 2
- **Verdict**: **REJECT** — wrong intent surface.

#### 31 — Retargeting

- **Effort**: 2
- **Impact**: 1 (need traffic to retarget)
- **Fit**: 2
- **Verdict**: **DEFER** until there's ≥ 1k monthly visitors.

---

### G. Events & launches

#### 32 — Product Hunt launch

- **Effort**: 3
- **Impact**: 2 (tech-Twitter audience doesn't overlap with our SMB
  ICP)
- **Fit**: 2
- **Verdict**: **DEFER** — only after Stage 1 + at least one shared
  teardown URL exists.

#### 33 — BetaList submission

- **Effort**: 1
- **Impact**: 1 (small spike, wrong audience)
- **Fit**: 2
- **Verdict**: **DEFER** — Month 2+; cheap so worth doing eventually
  but not a priority.

#### 34 — Lifetime deal on AppSumo

- **Effort**: 3 + commercial commitment
- **Impact**: 2 (wrong audience — AppSumo buyers are deal-hunters,
  not local-business owners)
- **Fit**: 1
- **Verdict**: **REJECT**.

#### 35 — Speaking at a local-business conference

- **Effort**: 4
- **Impact**: 3 (one room of right-fit owners)
- **Fit**: 4
- **Verdict**: **DEFER** — apply once there's a 50-audit story.
- **First steps**: When ready, target NL events: Kappers Vakdagen,
  Horeca Expo, NVM Vastgoeddag.

#### 36 — Webinar / virtual summit

- **Effort**: 4
- **Impact**: 1 (SMB owners don't attend webinars)
- **Fit**: 1
- **Verdict**: **REJECT** — wrong audience format.

---

### H. Trust & PR

#### 37 — Press: pitch one NL business outlet for the year-end report

- **What**: When the annual "State of local SEO for NL SMBs" report
  ships (idea #10), pitch it to Sprout / De Ondernemer / NRC Carrière
  / FD outlet.
- **Effort**: 3
- **Impact**: 3 (single press hit = 50+ audits + permanent backlink)
- **Fit**: 5
- **Verdict**: **DEFER** — gated by idea #10 (need the data first).

#### 38 — Awards / "best of"

- **Effort**: 3
- **Impact**: 2 (small)
- **Fit**: 2
- **Verdict**: **DEFER** — premature; awards require numbers.

#### 39 — Trust copy on the homepage (already shipped)

- **What**: "Independent project, not VC-funded SEO platform." / "No
  AI marketing pitch." / "Free during MVP."
- **Verdict**: **(already live)**.

#### 40 — Public roadmap

- **What**: A `/roadmap` page that's honest about what's shipping
  next, when, and why.
- **Effort**: 1
- **Impact**: 2 (trust signal)
- **Fit**: 4
- **Verdict**: **DEFER** — Month 2; only valuable once there's enough
  shipping cadence to make a roadmap credible.

---

## Quarter execution plan

The 40 ideas mapped onto a 90-day timeline.

### Month 1 (launch)

| Week | Ship | Why |
|---|---|---|
| Week 1 | #1 hand-run audits + cold email (10/week) · #4 view counter · #5 UTM stamping · #8 `/scoring` page · #13 first 5 agency pitches · #23 cold email template · #24 one-bump follow-up | Foundation: instrumentation + the first 10 owner audits + 5 agency outreaches |
| Week 2 | #6 first fix-guide live · #1 next 10 audits · LinkedIn pattern post · #27 DMs to engaged commenters | Adds the long-tail SEO surface + maintains outreach cadence |
| Week 3 | #6 second fix-guide · #2 first permissioned teardown (if available) · #1 next 10 audits | First teardown = compounding trust |
| Week 4 | #6 third fix-guide · #3 "audit my competitor" A/B test · stage-0→1 rubric review | Decide whether to advance |

### Month 2

| Theme | Ships |
|---|---|
| **Borrowed-channel push** | #14 newsletter outreach · #15 community engagement |
| **More fix-guides** | #6 #4-#6 in sequence |
| **More teardowns** | #2 second permissioned teardown |
| **Light defer ships** | #20 agency free-migration pitch · #21 weekly digest on homepage · #33 BetaList |

### Month 3

| Theme | Ships |
|---|---|
| **Trust artefacts** | #19 "Audited by" badge (after first 10 fixes shipped) · #40 public roadmap |
| **Compound moves** | #7 three more category pages · #16 first podcast pitch |
| **Data collection for Month 4** | Begin collecting data for #10 year-end report |

### Month 4+ (post-stage-1)

| Idea | Ships when |
|---|---|
| #10 NL SMB year-end report | When N ≥ 50 audits |
| #37 NL press pitch | When report is ready |
| #28 Google Ads (cautious test) | When CAC economics exist |
| #11 glossary marketing | When fix-guide library is proven |
| #35 speaking | Once a 50-audit story exists |

---

## Things explicitly rejected (and why)

| Idea | Reject reason |
|---|---|
| Influencer marketing | Off-brand, uneconomic at MVP scale |
| Email mini-course | Wrong audience (SMB owners don't take SEO courses) |
| Newsletter | No list, no list-building strategy |
| Facebook / Instagram lead ads | Wrong intent surface |
| AppSumo lifetime deal | Wrong audience (deal hunters, not owners) |
| Webinars / virtual summits | SMB owners don't attend |
| Mass cold DM | Spam tactic; off-brand |
| Programmatic city × category pages | Thin pages, Google penalty risk |
| Comparison vs unknown competitors | No brand recognition for prospects to compare us against |
| "AI tools roundup" listicle | Off-brand; we're explicitly not AI |
| Affiliate / refer-a-friend with payouts | No paid month yet |
| Engagement pods / follow-for-follow | Trust-killer |
| Buying followers / engagement | One-strike termination |
| TikTok / Reels / Shorts | Wrong format for this JTBD |
| Twitter daily presence | No artefact to anchor yet |
| LinkedIn company page | No paying customers yet |
| Discord / Slack community | Wrong cadence + signals SaaS template drift |
| Bidding / auction marketplace | Explicit anti-positioning |
| 12-month roadmap content | We don't have a 12-month roadmap |
| ABM enterprise sales motion | Wrong product, wrong audience |

---

## Realistic solo-founder execution guidance

### Time budget (per week)

| Activity | Hours | When |
|---|---|---|
| Hand-run audits (10/week) | 2 | Mon morning |
| Cold email (5/day max) | 2.5 | Across Mon–Fri |
| Fix-guide drafting | 2 | Wed or Thu |
| LinkedIn (post + engagement) | 2.5 | Tue/Thu mornings (post days) + 20 min/day off-days |
| Inbox / reply / Calendly calls | 2 | Reactive across the week |
| Weekly KPI tally | 0.5 | Friday |
| Buffer | 1.5 | Always need it |
| **Total** | **~13 h/week** | |

### What this means

- 13 hours is the **upper limit** while also running Brickwise and
  FactuurDirect. Anything more isn't sustainable.
- "13 hours" is the **commitment**, not the **input**. If a week
  comes in at 8 hours because something else demanded attention,
  that's fine. Don't double up the next week — pick up where you
  are.
- The week's must-ship is: **10 audits + 5 cold emails + 1 LinkedIn
  post**. If that minimum is hit, the week was a success.

### What to drop first when time is tight

In order:
1. Engagement comments on others' posts (lowest leverage)
2. The second LinkedIn post of the week
3. Fix-guide drafting (it's catching up, not driving)
4. Outreach beyond the 10-audit minimum

Never drop:
- Replying to inbound replies < 4 hours
- Running the first 10 audits of the week
- Sending at least 5 cold emails

---

## Best channels (by trust-building yield)

In descending order of trust generated per hour invested:

1. **Hand-personalised cold email with a real report URL** — single
   highest-trust touch
2. **Permissioned teardown page** — concrete + permanent
3. **LinkedIn teardown post with a public report URL embedded**
4. **Substantive comment on an NL SMB owner's post**
5. **Borrowed-channel newsletter feature**
6. **Agency referral relationship**
7. **Fix-guide ranking on a long-tail query**
8. **Founder Q&A LinkedIn posts**
9. **Public roadmap / changelog updates**
10. **Score explainer page deep-link from inside reports**

Trust-building anti-patterns:
- Mass cold email (negative trust)
- "AI-powered" hooks
- Inflated metrics
- Faked testimonials
- Engagement bait

---

## Best hooks (cold email subject lines + LinkedIn first lines)

### Hooks that work

- "Local SEO audit for {BUSINESS} — score {SCORE}/100"
- "Before your site redesign, here's what to preserve"
- "Quick sanity check on what your SEO agency is invoicing for"
- "Don't share your business — run an audit on the competitor that's
  outranking you"
- "I audited 12 [category]s in [city]. Same three problems every time."
- "Real teardown of a real salon — 67/100"

### Hooks that don't

- "Quick question…"
- "[Brand-name] AI — try it free"
- "Limited time — free audit (€500 value)"
- "We help businesses 10x their local SEO"
- "[Name], saw your business on Maps"
- "Hi 👋"

---

## Repeatable distribution loops

### Loop 1 — Audit → email → reply → forward → second audit

```
Audit run
   │
   └──> Cold email with report URL
            │
            ├──> Reply: "interesting"
            │       │
            │       └──> Calendly conversation OR followup
            │
            └──> Reply: "forwarded to my web person"
                    │
                    └──> Second audit appears in dashboard 1–7 days later
```

**Trigger to act**: when the view counter on a report shows > 1 view,
follow up with "noticed someone else opened it — happy to talk to
them too?"

### Loop 2 — LinkedIn → audit → DM → conversation

```
LinkedIn teardown post (anchored to real report URL)
   │
   └──> Reader runs audit on their own business
            │
            └──> "Get help" form submission OR LinkedIn DM
                    │
                    └──> Founder reply within 4 hours
                            │
                            └──> Calendly OR routing to operator
```

**Trigger to act**: anyone who runs an audit within 24 hours of a
LinkedIn post gets a personal "saw your audit — anything I can help
clarify?" DM.

### Loop 3 — Fix-guide → audit → "fix this for me"

```
Long-tail Google search for the fix
   │
   └──> Lands on /guides/<slug>
            │
            └──> Runs audit via CTA at end of guide
                    │
                    └──> Sees the issue confirmed on their own business
                            │
                            └──> Submits "Get help improving my SEO"
```

**Trigger to act**: every audit attributed to a fix-guide gets a
priority reply.

### Loop 4 — Permissioned teardown → owner shares on own LinkedIn → second audited owner appears

```
Teardown page goes live
   │
   ├──> Audited owner shares on their own LinkedIn (≥ 30% of teardowns)
   │       │
   │       └──> Their network sees it — another local owner runs an audit
   │
   └──> Founder reposts the same week with framing
            │
            └──> 5–20 audits attributed in first 7 days
```

**Trigger to act**: every published teardown gets a 7-day, 30-day,
and 90-day review of attributed audits.

### Loop 5 — Agency → client audit → owner conversation → SEO Terrain referral

```
Agency uses SEO Terrain as pre-sales asset
   │
   └──> Shares report URL with prospect in sales call
            │
            └──> Prospect runs second audit later (on competitor or own location 2)
                    │
                    └──> Prospect submits "Get help" → SEO Terrain forwards back to the same agency
```

**Trigger to act**: every audit attributed to an agency partner →
manual followup to the agency: "another one in your pipe."

---

## Final principle

The marketing question for SEO Terrain is **never "how do we grow
faster"** — it's **"how do we make each audit a more useful artefact
that gets shared more often"**.

If a tactic doesn't pass that test, it's a distraction. Most "growth
hack" tactics aren't on this list because they don't pass that test.

Run more audits. Make each one share-worthy. Repeat.
