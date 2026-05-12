# SEO Terrain — Launch Strategy

*Last updated: 2026-05-12*
*Production: https://seoterrain.vercel.app*

> Companion to [seoterrain-product-marketing-context.md](./seoterrain-product-marketing-context.md).
> Read that first if positioning isn't fresh in your head.
>
> This document executes the **launch-strategy skill** for SEO Terrain
> specifically: ORB channel choices, 5-phase rollout adapted for an
> already-live MVP, pre-launch checklist, 30-day sequence, the first 10
> outreach targets, what to measure, failure scenarios, and the
> explicit no-go list.

---

## TL;DR — why this launch is different

SEO Terrain is a **soft-launch product**, not a Product Hunt product.
We sell to local-business owners (a salon owner in Rotterdam, a
dentist in Eindhoven) — not to tech-Twitter or HN. The launch motion
is therefore:

- One-to-one hand-personalised outreach, not a big-bang announcement
- Owned + borrowed channels heavily favoured over rented channels
- LinkedIn as the only rented channel during launch month
- Product Hunt **deliberately deferred** — wait until at least one
  shared report URL is in the world and ideally 1 permissioned
  teardown page
- "Launch" is a 30-day calendar with daily 2-hour blocks, not a single
  day

---

## 1 — Launch Positioning

### Launch headline (one-liner)

> See why nearby competitors outrank you, then know what to fix first.

### Launch sub (25 words)

> Paste your Google Maps URL. SEO Terrain scores your site, profile,
> reviews and nearby competitors, then tells you the three things to
> fix first.

### Launch story (60-second pitch — what you say in DMs and on calls)

> I built SEO Terrain because I needed it myself for two other
> businesses I run. Every local SEO audit I bought was either a 40-page
> PDF or generic advice that didn't fit my category. This is the
> opposite: paste a Google Maps URL, get a ranked plan in 60 seconds,
> share the report URL. Free while we're talking to the first 50 users.
> If you want help fixing what we find, I route you to someone I trust.

### Anchor proof points (use in copy, never invent more)

- 5 weighted dimensions, weights visible on the homepage
- Hand-written category-specific copy for restaurants, salons, gyms,
  dental clinics, real estate agents
- Honest-absence framing when data is missing
- Independent, founder-built — not a VC-funded SaaS platform

### What this launch is **not** about

- Announcing a "platform"
- Announcing AI features (we have none, deliberately)
- Hitting #1 on Product Hunt
- A 12-month roadmap
- An investor narrative

---

## 2 — Target Audiences (launch-specific cut)

(Full personas live in the [product marketing context](./seoterrain-product-marketing-context.md).
Here are the launch-window cuts only.)

### Primary launch audience: "Marieke" — independent salon/barber owner

- Where: Rotterdam, Amsterdam, Utrecht, Antwerp
- Why first: short decision cycle (no purchasing committee), high
  audit-to-action rate, easiest to spot a "winnable" gap (often missing
  GBP secondary category)
- How to reach: hand-personalised cold email after running the audit,
  occasional LinkedIn comment in a local-owner thread

### Primary launch audience: "Joost" — indie web freelancer / 1–3 person agency

- Where: NL-wide on LinkedIn
- Why first: he forwards reports to his clients, multiplying our reach
  with zero ad spend
- How to reach: LinkedIn (founder voice, teardown posts), warm DM after
  he engages with a post, cold email to his contact form

### Secondary launch audience: "Bart" — solo dentist

- Where: Eindhoven, Utrecht, Den Haag
- Why second: longer decision cycle but higher unit-economic outcome if
  he becomes a "Quick fixes" buyer
- How to reach: cold email only, no DMs (professional category)

### Defer for launch month

- "Anna" (fitness/Pilates studio): keep on the radar, target Month 2
- "David" (real estate agent): wait for the `/audits/real-estate` page
  to earn a first organic visit before going after this segment

---

## 3 — Channel Selection (ORB Framework applied)

### Owned channels (where compounding happens)

| Channel | Status | Launch action |
|---|---|---|
| **Production app + audit form** | Live | The audit IS the lead magnet. Every other surface points here. |
| **Public report URLs** | Live | The artefact we want shared. Treat each one as a single-use landing page for that prospect. |
| **5 category landing pages** (`/audits/<cat>`) | Live | Long-tail SEO surfaces — see [seoterrain-seo-audit.md](./seoterrain-seo-audit.md) |
| **`/about`, `/privacy`, `/terms`** | Live | Trust signals — already in place |
| **Email inbox** (`mgmikeymg@gmail.com`) | Live | The CRM for now. No newsletter, no broadcast, no list-building. |
| **Lead-tracking spreadsheet** | To build T-3 | Replaces a CRM during Stage 0 |
| **`/guides/<slug>` fix-guides** | To build week 2+ | One canonical guide per category fix problem |
| **`/teardowns/<biz>`** | To build week 3+ | Only when a real owner permissions the case study |

**Explicitly NOT building**:
- A newsletter / list
- A Discord / community
- A branded blog with multi-author drift
- An RSS feed (until guides exist)

### Rented channels (visibility, but ration carefully)

| Channel | Use during launch month? | How |
|---|---|---|
| **LinkedIn (founder personal profile)** | ✓ primary | 1–2 posts/week, teardown + pattern + owner-voice + behind-scenes posts. See [seoterrain-social-pack.md](./seoterrain-social-pack.md) for the 12 ready-to-publish drafts. |
| **LinkedIn company page** | ✗ — not yet | Wait for 5 paying customers first |
| **Twitter / X** | ✗ — defer | Open the account only when there's a real shared report URL or teardown to anchor a thread |
| **TikTok / Reels / YouTube Shorts** | ✗ | Wrong demographic + wrong format for the JTBD |
| **Reddit** | ✗ | Easy to come off spammy; revisit only after Month 1 |
| **Instagram** | ✗ | Founder presence only, no business posting |
| **Product Hunt** | ✗ during launch month | Justified deferral (see Section 9) |

**Single-channel discipline**: LinkedIn during launch month. Period.
We do not add a second rented channel until LinkedIn is producing at
least 1 audit-attributed visit per post.

### Borrowed channels (where the leverage is)

Tap someone else's audience. **This is the highest-leverage launch
tactic for SEO Terrain.**

| Borrowed source | Approach | Win criteria |
|---|---|---|
| **A local web freelancer's client list** | Approach 5 of them as "I'd like to run a free audit on one of your prospects" | One forwards a report to a real prospect within 14 days |
| **A relevant local-business podcast / YouTube** | If a Dutch SMB owner podcast exists, pitch a "I audited 10 [category]s — here's what I found" segment | One booking, one episode |
| **A category-specific FB group (NL)** (e.g. "Kappers Nederland", "Restaurant Eigenaren NL") | Reply to specific posts where someone asks "how do I show up on Google" — share a report from a competitor, never self-promote | One thread that drives ≥ 3 inbound audits |
| **NVM real-estate newsletters / KNMT dental newsletters** | Long-tail — only worth pitching if a 30-day audit pattern has emerged across that vertical | One mention |
| **YouTube reviewer of small-business marketing tools** | Send a free done-for-you audit on the reviewer's own business (or a business of their choice) | One unsolicited shoutout (do NOT ask for one) |

Borrowed > rented because every share of a real report URL converts
better than any LinkedIn impression.

---

## 4 — Five-Phase Rollout (mapped to SEO Terrain's actual state)

The skill's 5-phase model assumes a pre-launch product. SEO Terrain is
already live, so we collapse phases 1–4 into a single "soft launch"
window and treat the Month 2 milestone as the equivalent of Phase 5.

| Skill phase | SEO Terrain mapping | Status |
|---|---|---|
| **Phase 1 — Internal** | Founder's personal use across Brickwise + FactuurDirect properties | ✓ done |
| **Phase 2 — Alpha** | Production deploy + 3 friend-of-the-founder test audits | ✓ done (production live since 2026-05-11) |
| **Phase 3 — Beta** | Hand-run 10 audits on real-but-cold local businesses (launch week 1) | In progress |
| **Phase 4 — Early access** | Continued cold outreach + LinkedIn teardown content + first guide live | Weeks 2–4 |
| **Phase 5 — Full launch** | Stage 0 → Stage 1 advancement (see monetization plan); ONLY then consider Product Hunt / wider rented-channel push | Targeted: Day 60+ |

**We are at the boundary of Phase 3 → Phase 4 today.** The full
"opening of the floodgates" Phase-5 moment is deferred until at least
4 of 7 day-60 rubric signals are met (see Section 8).

---

## 5 — Pre-Launch Checklist (T-3 to T-1)

Most items are already done from earlier sessions — keep this list for
re-launches when the next major surface lands.

### T-3 days

- [x] Landing page with clear value proposition
- [x] Email auth (Clerk) live, sign-in flow tested
- [x] Free audit flow tested end-to-end with a real Maps URL
- [x] Lead-capture path verified (Resend → mgmikeymg@gmail.com)
- [x] Trust pages live (About, Privacy, Terms)
- [x] Sitemap + robots in place
- [x] 5 category landing pages live
- [ ] Submit `/sitemap.xml` to Google Search Console (~5 min) **— DO THIS TODAY**
- [ ] Add static Open Graph image (1200×630, brand-on-white)
- [ ] Set up `Lead-tracker-2026.xlsx` with columns: date / business / city / category / audit URL / score / lead status / routed to / fee owed / fee collected / notes
- [ ] Verify clock-skew tolerance still set in `proxy.ts` (60s)

### T-2 days

- [ ] Identify the 10 launch-week target businesses by hand-searching
      Google Maps (see Section 7)
- [ ] Identify 5 small NL web/SEO agencies to approach (Section 7)
- [ ] Pre-write the 10 owner cold emails (one per business, full personalisation)
- [ ] Pre-write 5 agency emails

### T-1 day

- [ ] Run audits on each of the 10 owner targets, save report URLs into tracker
- [ ] Pull screenshots from 1–2 audits for the first LinkedIn teardown post
- [ ] Block out 2-hour daily windows in calendar for Week 1

### T-0 (Launch Monday)

- [ ] LinkedIn post #1 (founder story — see [seoterrain-social-pack.md](./seoterrain-social-pack.md))
- [ ] Send first 3 owner cold emails (not batched, 30 minutes apart)
- [ ] Reply to any DMs within 4 hours

**Tripwire**: If any T-3 item fails (sitemap rejected, audit crashes
on a real Maps URL, lead email lands in spam), **stop and fix before
Day 1**. Don't launch with the lead path broken.

---

## 6 — 30-Day Launch Sequence (daily calendar)

Daily commitment: ~2 hours, not full days. Solo builder running other
projects alongside.

### Week 1 — first outreach wave

| Day | Action | Time |
|---|---|---|
| Mon | Send 3 owner emails (the 3 strongest of 10). LinkedIn post #1 (founder story) | 60 min |
| Tue | Send 3 more owner emails. Reply to Day-1 replies. Run audits on any warm-intro businesses surfaced. | 75 min |
| Wed | Send last 4 owner emails. LinkedIn post #2 (teardown of a permissioned audit if possible, anonymised otherwise) | 90 min |
| Thu | Day-1 follow-up bumps (one-liner). Outreach to 2 of the 5 agency targets. | 50 min |
| Fri | Outreach to remaining 3 agency targets. Tally Week-1 metrics. | 50 min |

**Week 1 KPIs**: 10 owner emails sent, 5 agency emails sent, ≥ 2 owner
replies, 2 LinkedIn posts shipped, 0 broken audits.

### Week 2 — first conversion attempts

| Day | Action | Time |
|---|---|---|
| Mon | LinkedIn post #3 (pattern post: "I've audited 12 [category]s. Same three problems every time."). Day-7 nudges to non-replies. | 65 min |
| Tue | First sales conversation if any owner asked "how can you help fix this?" — Calendly slot. Forward 1 closed referral to a specific operator with a personal email. | 60 min |
| Wed | Outreach: 5 more owner targets (second cohort). LinkedIn post #4 (owner-voice if a first owner is willing). | 120 min |
| Thu | Agency 20-min walkthroughs if any agency replied. Draft fix-guide #1. | 90 min |
| Fri | Publish fix-guide #1 as `/guides/gbp-categories-restaurants`. Tally Week-2 metrics. | 110 min |

**Week 2 KPIs**: 15 cumulative owner emails sent, 1+ Calendly booked,
1 fix-guide live, 4 LinkedIn posts cumulative.

### Week 3 — first revenue attempts

| Day | Action | Time |
|---|---|---|
| Mon | LinkedIn post #5 (pattern post on GBP gap). Push fix-guide #1 on LinkedIn with the audit CTA. | 45 min |
| Tue | If an owner wants help: send a **specific** quote based on the audit (Stage-2 package shape from monetization plan). Second batch of owner outreach. | 120 min |
| Wed | Draft fix-guide #2 ("Replying to bad reviews — what dental clinics get wrong"). | 60 min |
| Thu | Publish fix-guide #2. LinkedIn post #6 (behind-the-scenes: scoring weights). | 105 min |
| Fri | Reach out to 2 small-agency prospects with a different angle: "I have a paying owner who needs help. Would you take this lead?" Tally Week-3 metrics. | 50 min |

**Week 3 KPIs**: 1+ paid engagement quoted, 2 fix-guides live, 6
LinkedIn posts cumulative, 20 cumulative owner emails sent.

### Week 4 — decision week

| Day | Action | Time |
|---|---|---|
| Mon | Audit-validation day: run day-60 rubric against current numbers. LinkedIn post #7 (aggregate insight: "After 25 audits, here's the most common problem"). | 105 min |
| Tue | If 4 of 7 signals met → draft the first Stage-1 retainer agreement copy. Otherwise → focus on increasing reply rate. | 90 min |
| Wed | Outreach #4: 5 more owner targets from a new category if previous cohorts were single-category. Decide whether to ship the budget/timeline modal fields if Stage 0 has ≥ 10 real leads. | 90 min |
| Thu | Founder Q&A LinkedIn post — solicit specific questions from local-business owners. | 30 min |
| Fri | Monthly review journal entry. Tally Week-4 + Month-1 metrics. Decide Stage 0 → Stage 1 advance or not. | 90 min |

**Month-1 KPIs**: see day-60 rubric (Section 8).

---

## 7 — First 10 Outreach Targets + Categories

### Owner targets (mix of category and city)

Real targets are pulled from Google Maps by hand at T-2; below is the
intended **profile mix**:

| # | Type | City | Why this profile |
|---|---|---|---|
| 1 | Family-run trattoria | Rotterdam | Strong reviews, weak GBP cadence — easy "win one fix" demo |
| 2 | Brunch / breakfast spot | Amsterdam Centrum | Tourist-heavy; GBP posts often dormant |
| 3 | Independent hair salon | Rotterdam | No website, GBP claimed but neglected |
| 4 | Independent CrossFit / gym | Utrecht | Free-trial CTA test case |
| 5 | Newer dental practice | Den Haag | Low review velocity vs established clinics — easy fix surface |
| 6 | Solo NVM makelaar | Eindhoven | No neighbourhood pages — visible content gap |
| 7 | Speciality coffee shop | Haarlem | Strong reviews but invisible in local pack |
| 8 | Pilates studio | Antwerp (BE) | Owner-operated, schedule behind a portal |
| 9 | Veterinary clinic | Utrecht | Stable practice, weak website — different category to test response |
| 10 | Local bike repair shop | Amsterdam | Underserved by SEO industry — fresh signal |

Replace with real names at T-2. Tracker fields: business, city,
category, website, contact email, owner first name if available, audit
score (filled after T-1).

### Agency targets (5)

Pick from this profile:

- 1–5 person NL web/SEO agencies serving local SMBs
- Active LinkedIn presence (so we have something to reference)
- Not currently using a competing audit product
- Geographically diverse: Amsterdam, Rotterdam, Eindhoven, Antwerp, Maastricht

### Outreach angles per audience

#### Owner — primary angle: "I already did the audit. Here's the result."

> Subject: Lokale SEO-audit voor {BUSINESS} — score {SCORE}/100
>
> Body: Ik draai lokale SEO-audits voor [category] in {CITY} en heb er
> een voor jullie gedraaid. Drie dingen die concurrenten doen die jullie
> niet doen staan in dit rapport: {REPORT_URL}. Geen verkoop. Als er
> iets in staat dat je wilt laten oplossen, kan ik je doorverwijzen
> naar iemand die dat goed kan. Anders is het rapport gewoon van jou.

Why this works: there's no ask. The audit is already done. Walking
away with the URL is a complete value transaction.

#### Owner — secondary angle: "Pre-redesign sanity check"

> Subject: Voordat je website-redesign live gaat — wat te bewaren
>
> For owners with a visible "website redesign" / fresh portfolio piece.
> Pitch: paste the new URL alongside the old GBP, get a list of signals
> to preserve before launch.

#### Agency — primary angle: "Free pre-sales asset"

> Subject: A pre-sales audit tool you can use today
>
> Body: Built a free local SEO audit. Paste a Google Maps URL, get a
> 5-dimension scored report + competitor matrix + ranked action plan
> as a shareable web link. The thing most agencies build internally as
> a PDF for pre-sales calls. We made it free and shareable. Want a few
> audits run for your current pipeline? Reply with 2–3 URLs.

#### Agency — warm-handoff angle (week 3+)

> Subject: Have a {CATEGORY} owner who wants to pay to fix what we found
>
> Body: Audited a {CATEGORY} in {CITY} ({REPORT_URL}). Score
> {SCORE}/100. Owner asked if we could just fix it. I'm not equipped
> to deliver — I think you are. 15% finder's fee if it closes, no
> markup. Only routing one a week to one trusted agency per category.

### Outreach hygiene

- **Send rate**: max 5 cold emails per day. Quality > volume.
- **Personalisation**: every email mentions the business name and one
  specific finding from their audit
- **Subject line discipline**: never `[Test]`, never emoji, never
  `re: [made-up thread]`
- **One follow-up bump only**: a single short line ("did this land in
  spam?"). Never two.
- **Reply SLA**: < 4 hours during business day, otherwise next morning
- **Forwarding etiquette**: never insert the prospect into a list or
  sequence. Every email is one-to-one.

---

## 8 — First-Week Actions (the real Day-1 → Day-7)

| Day | Action | Done means |
|---|---|---|
| **Day 1 (Mon)** | Submit sitemap to GSC + send 3 owner emails + ship LinkedIn post #1 | GSC accepted sitemap; 3 emails in sent folder; post live |
| **Day 2 (Tue)** | Send 3 more owner emails; reply to any Day-1 responses; track all in spreadsheet | 6 cumulative emails; tracker has every reply logged |
| **Day 3 (Wed)** | Send last 4 owner emails; ship LinkedIn post #2 (teardown) | 10 cumulative emails; second post live with a real (or anonymised) audit URL embedded |
| **Day 4 (Thu)** | Send one-line bumps to Day-1 emails that didn't reply; pitch 2 agencies | 2 agency cold emails sent |
| **Day 5 (Fri)** | Pitch remaining 3 agencies; tally Week-1 metrics; decide if anything in the funnel is broken | 5 agency emails total; weekly metrics row filled in tracker |

**Week-1 hard floor**: if reply rate is < 10% by Friday, **stop new
emails next week**. Re-write the cold copy based on what came back
(even a "no thanks" reply teaches you something).

---

## 9 — What to Measure (lightweight, 1-page dashboard)

All in a Google Sheet. No CRM, no Mixpanel, no analytics platform
purchases.

### Top-of-funnel

| Metric | Wk 1 | Wk 2 | Wk 3 | Wk 4 | Month |
|---|---|---|---|---|---|
| Audits run (any source) |  |  |  |  |  |
| Audits via cold email |  |  |  |  |  |
| Outreach emails sent |  |  |  |  |  |
| Reply rate (%) |  |  |  |  |  |
| LinkedIn posts shipped |  |  |  |  |  |
| LinkedIn impressions (sum) |  |  |  |  |  |
| Audits via LinkedIn referrer |  |  |  |  |  |

### Mid-funnel

| Metric | Wk 1 | Wk 2 | Wk 3 | Wk 4 | Month |
|---|---|---|---|---|---|
| Calendly bookings |  |  |  |  |  |
| "Get help" form submissions |  |  |  |  |  |
| Audits forwarded to operators |  |  |  |  |  |

### Bottom-of-funnel

| Metric | Wk 1 | Wk 2 | Wk 3 | Wk 4 | Month |
|---|---|---|---|---|---|
| Closed referrals (paid or pipelined) |  |  |  |  |  |
| Revenue collected (€) |  |  |  |  |  |
| Operators paying / committed |  |  |  |  |  |

### Day-60 advancement rubric (Stage 0 → Stage 1)

| Signal | Target |
|---|---|
| Audits sent (outreach) | ≥ 10 |
| Owner email reply rate | ≥ 25% |
| Owner asked "fix this for me" | ≥ 1 |
| Small agency committed to using SEO Terrain | ≥ 1 |
| Closed referral deals (paid or pipelined) | ≥ 5 |
| Fix-guides live + linked from a category page | ≥ 1 |
| LinkedIn teardown posts shipped | ≥ 4 |

**Advance only if ≥ 4 of 7 hit.** Below that → re-invest in lead
quality, not features.

### Vanity metrics to **ignore**

- Vercel visitor counts
- LinkedIn followers
- Total sessions
- "Engagement"
- Audit completion percentage (until it has a denominator that makes sense)

---

## 10 — Failure Scenarios (and what to do)

| Scenario | Likelihood | Response |
|---|---|---|
| Reply rate < 10% in Week 1 | Medium | Stop new outreach. Re-write cold subject lines. Check: was the audit URL the dominant CTA, or did the email pitch too hard? |
| Audit produces an obviously wrong recommendation | High eventually | Acknowledge in the next LinkedIn post. Add disclaimer to the relevant fix-guide. Don't try to silence the feedback. |
| First "fix this for me" arrives but no operator can take it | Medium | Quote and deliver yourself for that ONE engagement to learn the work. Document everything. Use it to recruit operators for Stage 1. |
| Resend emails land in spam | Medium | Move from `onboarding@resend.dev` to a domain-verified address. Buy `seoterrain.com` and set up SPF/DKIM if it persists. |
| GBP TOS challenges OSM data use | Low | We don't republish GBP data; OSM is independent open data. Document and respond if asked. |
| A LinkedIn teardown post upsets the audited business | Low | Always anonymise unless permissioned. If it happens: take it down within 1 hour, apologise privately, send the audit owner a free done-for-you fix. |
| An agency demands exclusivity in their city | Low (no scale yet) | We have a one-operator-per-category-per-city rule. Document; agency-routing pipeline is manual, no marketplace. |
| LinkedIn algorithm reach drops to ~0 | Medium | Don't post more to "fight the algorithm". Re-allocate that time to 1-to-1 email. The product is the message, not the channel. |
| First teardown owner asks for the post to be deleted | Medium | Remove within 24 hours, no fight. Replace with a different permissioned audit. |
| Stage 0 → 1 numbers miss | Possible | Don't advance. Keep running Stage 0 for another 30 days. Don't ship Stripe / paid tiers / new features. |

---

## 11 — What NOT to Do Yet

Explicit no-go list for the launch window. Re-read before adding any
new tactic.

- ❌ **Product Hunt launch.** Defer until at least one shared teardown
  page exists, real testimonials are sourced, and we've validated that
  PH's tech-Twitter audience overlaps with our local-SMB ICP at all.
- ❌ **Paid ads** (Google, LinkedIn, Meta). The cost-per-audit hasn't
  been established yet; we'd be optimising the wrong number.
- ❌ **Newsletter / email list.** No list to nurture; audit is the
  magnet. Revisit only after Month 3.
- ❌ **A second rented channel.** LinkedIn-only until LinkedIn is
  producing visible audit attribution.
- ❌ **Mass cold-outreach automation.** Maximum 5 hand-personalised
  emails per day.
- ❌ **Webinars / virtual summits.** Wrong audience format. SMB owners
  don't attend webinars.
- ❌ **Daily content production.** 1–2 LinkedIn posts/week is the cap.
- ❌ **A LinkedIn company page.** Wait for 5 paying customers first.
- ❌ **Twitter / X presence.** Wait for a shared report URL to anchor a
  thread.
- ❌ **Buying a domain.** Vercel URL is fine for 30–60 days. Buy when
  there's a shareable report URL flowing through LinkedIn at least
  weekly.
- ❌ **Affiliate / referral programs.** No paid tier exists; no
  commission economics to design.
- ❌ **Press releases / PR pitching.** Nothing newsworthy yet.
- ❌ **Speaking at conferences.** Apply for these in Month 3+ once
  there's a data-backed story ("after 100 audits in NL salons…").
- ❌ **Building a Discord / Slack community.** Defer indefinitely.
- ❌ **Renaming or pivoting positioning** in response to first-week
  silence. Give the launch 30 days before any structural change.

---

## 12 — Post-Launch (Day 30 → Day 60 → beyond)

### Day 30 review (run at end of Week 4)

Three branches based on Month-1 numbers (from
[seoterrain-launch-sequence-v2.md](./seoterrain-launch-sequence-v2.md)
— consolidated here):

**Branch A — Stage 1 ready** (4+ rubric signals hit):
- Open Stage-1 retainer conversations with replying operators
- Spec + ship the budget/timeline modal fields (week 5)
- Plan Month 2: continue outreach + 3 more category pages + first
  teardown page

**Branch B — On the bubble** (3 signals hit):
- Stay in Stage 0 another 30 days
- Tighten lead quality (subject lines, audit copy)
- Add ONE more category page per week (coffee shop, vet, yoga/Pilates)
- Re-check at Day 90

**Branch C — Off track** (≤ 2 signals hit):
- Stop new feature work
- Do 10 hand-run audits with phone follow-ups instead of email
- Talk to 5 actual replies on a call
- Re-evaluate positioning at Day 90 — the JTBD may not yet be clear

### Compounding moves (only after Stage 0 advance)

- Ship `/guides/<slug>` weekly until 6 fix-guides live
- Ship one `/teardowns/<biz>` per month with permission
- Add 3 more category landing pages (coffee shop, vet, yoga)
- Custom domain + 301 redirect from `*.vercel.app`
- Submit to BetaList (week 6+) — single, slow-burn directory only
- Approach one local-business newsletter / podcast per month — borrowed
  channel leverage

### Ongoing launch motion

Treat every shipped surface as a mini-launch:

- **New fix-guide**: 1 LinkedIn post + 1 email to the most relevant
  past lead
- **New teardown page**: 1 LinkedIn post + 1 cold email cohort using
  the teardown as social proof
- **New category page**: send to the 2–3 operators in that category
  who've engaged with the product

No "big bang" Phase-5 launch is planned. The product compounds on
artefacts, not announcements.

---

## 13 — Launch Checklist (printed version)

### Pre-launch (T-3 → T-0)

- [ ] Sitemap submitted to GSC
- [ ] OG image added (1200×630)
- [ ] Lead tracker spreadsheet set up
- [ ] 10 owner targets identified + audited
- [ ] 5 agency targets identified
- [ ] 10 cold owner emails drafted
- [ ] 5 agency emails drafted
- [ ] Calendly link ready (only for warm asks, not in cold copy)

### Launch week

- [ ] 3 owner emails sent Monday
- [ ] LinkedIn post #1 (founder story) live Monday
- [ ] 3 owner emails sent Tuesday
- [ ] 4 owner emails sent Wednesday + LinkedIn post #2
- [ ] Day-1 bumps Thursday + 2 agency emails
- [ ] Remaining 3 agency emails Friday + Week-1 metrics tallied

### Post-launch (Week 2–4)

- [ ] Fix-guide #1 published Week 2
- [ ] Fix-guide #2 published Week 3
- [ ] First Calendly call taken if anyone asked
- [ ] First quote sent if anyone asked
- [ ] Day-60 rubric tallied end of Week 4
- [ ] Stage-1 advancement decision recorded

---

## Final note

This launch is a marathon paced at a walk. The product is good enough
to ship; the only thing that compounds is the artefacts (audits,
report URLs, teardown pages, fix-guides). Resist the urge to make this
a "launch event". Make it 30 days of small, ordinary, hand-personalised
moves.

If at Day 60 fewer than 4 rubric signals are hit — that's the data,
respect it. Do not advance to paid features. Do not build a community.
Do not redesign the homepage. Re-invest in lead quality.

If 4+ are hit — proceed to Stage 1 per [seoterrain-monetization-plan.md](./seoterrain-monetization-plan.md).
