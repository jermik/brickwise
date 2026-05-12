# SEO Terrain — Lead Magnets

*Last updated: 2026-05-12*
*Production: https://seoterrain.vercel.app*

> Companion to:
> - [seoterrain-product-marketing-context.md](./seoterrain-product-marketing-context.md)
> - [seoterrain-launch-strategy.md](./seoterrain-launch-strategy.md)
>
> Executes the **lead-magnets skill** for SEO Terrain. Pushes back on
> ebook/PDF defaults: the audit itself is the magnet. Everything else
> is engineered to extend the audit experience, not replace it.

---

## TL;DR

The free audit at `/dashboard/new` is the strongest lead magnet
available to this product. No PDF, ebook, "2025 checklist" or generic
SEO download will beat it. **All capture motion compounds when it ends
inside the audit, not when it ends at an email-gate.**

This document:
1. Frames the audit as the primary magnet (and instruments it
   properly)
2. Specifies 4 supporting magnets that extend the audit experience
3. Explicitly rejects 10 default ideas and explains why
4. Maps each magnet to its funnel stage, capture flow, and follow-up

---

## 1 — Why the audit *is* the magnet

The lead-magnets skill says "High perceived value, low time
investment". The audit hits both at the maximum end of the spectrum:

| Skill principle | The audit's score |
|---|---|
| Solve a specific problem | "Why am I being outranked by the salon two streets over?" — precisely. |
| Match buyer stage | All three (awareness via category pages, consideration via competitor matrix, decision via fixed-price packages) |
| High perceived value, low time investment | 60 seconds in, structured report out. Agency equivalents cost €1–3k. |
| Natural path to product | The audit IS the product. Other magnets are funnels into it. |
| Easy to consume | One web page, mobile-friendly, no install |

**Hard rule for this document**: every "magnet" we ship must end in
either (a) running the audit on the user's own business or (b)
deepening the relationship of someone who already ran an audit.

If a proposed magnet doesn't do one of those, we don't build it —
regardless of how well it would convert as a standalone download.

---

## 2 — Candidate Magnets (full inventory)

Brainstormed against the brief. Each candidate is scored on three
axes, then accepted, deferred or rejected.

| # | Candidate | MVP fit | Audit funnel | Local-business utility | Verdict |
|---|---|---|---|---|---|
| 1 | The live free audit (Maps URL → ranked plan) | ✓✓✓ | ✓✓✓ | ✓✓✓ | **CORE — already live** |
| 2 | Shareable public report URL (`/report/<slug>`) | ✓✓✓ | ✓✓✓ | ✓✓✓ | **CORE — already live** |
| 3 | Permissioned teardown pages (`/teardowns/<slug>`) | ✓✓ | ✓✓✓ | ✓✓✓ | **ACCEPT — Stage 1** |
| 4 | Category fix-guides (`/guides/<slug>`) | ✓✓ | ✓✓ | ✓✓ | **ACCEPT — Week 2 onward** |
| 5 | Score explainer mini-page (`/scoring`) | ✓✓✓ | ✓✓ | ✓ | **ACCEPT — Week 1, low effort** |
| 6 | Single-dimension mini-tool ("GBP Completeness") | ✓ | ✓✓ | ✓✓ | **DEFER — Stage 1.5** |
| 7 | Category PDF (e.g. "Restaurant Local SEO checklist") | ✓ | ✗ | ✓ | **REJECT** |
| 8 | Generic "Local SEO 101" ebook | ✓ | ✗ | ✗ | **REJECT** |
| 9 | Email mini-course ("5 days to better local SEO") | ✓ | ✗ | ✗ | **REJECT** |
| 10 | Free domain authority / robots.txt / hreflang generator | ✓ | ✗ | ✗ | **REJECT** |
| 11 | Newsletter signup ("weekly SEO tips") | ✓ | ✗ | ✗ | **REJECT** |
| 12 | Free Google Business Profile course (gated) | ✓ | ✗ | ✓ | **REJECT** |
| 13 | LinkedIn carousel "3 GBP gaps in 12 audited [category]s" | ✓✓ | ✓ (drives traffic) | ✓ | **DISTRIBUTION, not a magnet** |
| 14 | "Audit my competitor for free" route | ✓✓ | ✓✓ | ✓✓ | **DEFER — Week 4 framing test** |
| 15 | Exit-intent popup with PDF download | ✓ | ✗ | ✗ | **REJECT** |
| 16 | Lead form gating the audit itself | ✓ | ✗✗ | ✗ | **REJECT — would tank conversion** |

**Picked (5)**: #1, #2, #3, #4, #5
**Deferred (2)**: #6, #14
**Rejected (8)**: #7, #8, #9, #10, #11, #12, #15, #16
**Reframed (1)**: #13 (it's a distribution surface, not a magnet)

### Rejections — explicit reasoning

- **#7 Category PDF**: looks like every other SEO content shop. People
  download PDFs and never open them. The live audit converts them
  on the same paste.
- **#8 Generic ebook**: doesn't fit the product (we are audit-first,
  not content-first) and signals "AI SEO platform" to the wrong
  audience.
- **#9 Email mini-course**: high build cost (5 emails × design × copy)
  for an audience who'd rather just run the audit. Newsletter habit
  is wrong for SMB owners.
- **#10 SEO utilities**: random traffic with no funnel into the audit.
  Generates SEO noise we don't want to be known for.
- **#11 Newsletter signup**: we don't have a newsletter and shouldn't
  start one. SMB owners don't read SEO newsletters.
- **#12 GBP course**: course-completion rates are ~5% even when free.
  The audit gives the same info as a 60-second exam, not a course.
- **#15 Exit-intent popup**: signals "growth-hack tool". Off-brand.
- **#16 Gating the audit**: kills the magic moment. The audit's whole
  edge is the 60-second turnaround. Any pre-audit form destroys that.

---

## 3 — Accepted Magnets — detailed specs

### Magnet 1 + 2 — The audit + the shareable report URL (live, core)

**Status**: Live as of 2026-05-11.

**The funnel**:
```
Cold email / LinkedIn post / fix-guide / teardown / category page
    │
    └──> Land on a category page or /dashboard/new
              │
              └──> Paste Google Maps URL
                        │
                        └──> Audit report renders (60 sec)
                                  │
                                  ├──> User can share report URL
                                  └──> User can click "Get help" CTA
                                          │
                                          └──> Lead email lands in inbox
```

**What's instrumented today**:
- ✓ Auth via Clerk
- ✓ Audit + report stored in Postgres
- ✓ Shareable `/report/[slug]` URL with `noindex`
- ✓ Public report URL is the canonical share artefact (no PDF
  generation — deliberately)
- ✓ Lead email path via Resend → mgmikeymg@gmail.com

**What's missing (≤ 1 day of work each)**:
- [ ] Server-side view counter on `/report/[slug]` — to track which
      report URLs actually get opened by recipients
- [ ] Referrer / UTM capture on `/dashboard/new` so we know which
      magnet drove each audit
- [ ] Lightweight tracking for "Get help" form open rate vs submit
      rate (per audit)

**KPI targets (first 30 days)**:
- 30+ audits run (any source)
- ≥ 50% of audits have their report URL opened at least once
- ≥ 5% of audits result in a "Get help" submission
- ≥ 1 audit shared more than once (forwarded by the recipient)

---

### Magnet 3 — Permissioned teardown pages (`/teardowns/<slug>`)

**Status**: Not yet built. Stage 1 magnet.

**What it is**: a 700–1,200-word page on a real local business with the
owner's explicit permission. Tells the story: the audit, the score,
the three things to fix, what the owner did, what changed.

**Why it works for this product**:
- Concrete evidence the audit produces useful output
- High-quality long-tail SEO ("salon SEO audit Rotterdam example",
  "restaurant local SEO case study Amsterdam")
- Trust signal for cold outreach: "here's an actual report on a real
  business with the owner's name on it"
- The audited business often shares it on their own LinkedIn,
  unlocking borrowed-channel reach

**Trigger to build**: first owner explicitly permissions us to use
their audit + name. Don't build before — never a fictional teardown.

**Template (every teardown follows this)**:
1. Hero: business name, city, category, audit date, current overall score
2. "Why I ran this audit" — 80-word founder voiceover
3. Embedded report card with the same component used on `/report/[slug]`
4. **Top 3 problems** — exact recommendations, screenshots where useful
5. **Top 3 quick wins** — concrete, doable within a week
6. **What the owner actually shipped** — only filled in once it
   happens; never speculative
7. **What changed** — concrete numbers if available
   ("3 new bookings in week 2", "review velocity from 0 to 4/mo");
   never speculative "we expect X"
8. CTA: "Want this for your [category]? Run a free audit →"
9. Internal links: matching `/audits/<cat>` + 2 related fix-guides

**Permission protocol**:
- Always written permission in email or DM
- Offer a € 50–€ 100 voucher equivalent — or credit + a follow-up
  done-with-you discount — as a thank-you (never required, but
  offered)
- Owner gets a draft to review before publish
- Either party can ask for take-down within 24 hours, no fight

**Capture flow**:
- The teardown does NOT collect email directly
- The teardown's single CTA is "Run a free audit on yours" — which
  routes to `/dashboard/new`
- Email capture happens at the audit form (auth via Clerk) as it
  already does

**KPI per teardown**: ≥ 15 audits attributed to that URL in its first
30 days live. If a teardown produces < 5 in its first 30 days, it
isn't worth the effort and we don't make a second of that category.

**Build target**: first teardown by end of Week 3 if a permissioned
audit exists by Week 2.

---

### Magnet 4 — Category fix-guides (`/guides/<slug>`)

**Status**: Not yet built. Build one per week starting Week 2.

**What it is**: a 800–1,400-word SSR page targeting **one** specific
problem from the audit's recommendation library. Long-tail SEO
surface that turns "how do I fix [specific thing]" searchers into
audit runners.

**Why it works**:
- Long-tail SEO inventory (each guide is permanent)
- High intent — searchers are already trying to fix something
- Direct funnel into the audit ("see if this applies to you →")
- Internal-link target for the matching category page

**Structure (every guide follows this)**:
1. One specific problem the guide addresses
2. Why it matters (1 short paragraph, no jargon)
3. **How to identify if you have this problem** — 3 checks the
   reader can run in 30 seconds without our audit
4. **The fix, step by step** — numbered list, plain language
5. **Example: before and after** — real or anonymised
6. **What our scoring engine looks for here** — connects back to
   the audit
7. CTA: "See if this applies to your business — run a free audit →"
8. Internal links: matching category page + 2 other guides

**First six guides (priority order — by audit-data frequency)**:

| # | Slug | Title | Linked from |
|---|---|---|---|
| 1 | `gbp-categories-restaurants` | How to pick the right secondary GBP categories for your restaurant | /audits/restaurant |
| 2 | `local-review-velocity` | What "review velocity" means and how to fix yours | /audits/salon |
| 3 | `dental-insurance-prominence` | Why accepted-insurance needs to be above the fold for dental clinics | /audits/dentist |
| 4 | `realtor-neighborhood-pages` | The neighbourhood page every real-estate agent should write first | /audits/real-estate |
| 5 | `gym-free-trial-cta` | The free-trial CTA test that converts 5–12% better on gym sites | /audits/gym |
| 6 | `gbp-posts-cadence` | Why one Google Business post a week is the local-SEO cheat code | linked from all 5 |

**One per week. No batching. Quality over quantity.** Each guide is
hand-edited, anchored in real audit findings, and ends with a
specific CTA.

**Capture flow**:
- No email gate — the guide is fully readable
- The single CTA on the page routes to `/dashboard/new` with a
  `?utm_source=guide&utm_content=<slug>` parameter
- Email capture happens at the audit form

**KPI per guide**:
- ≥ 50 organic visits in the first 90 days (long-tail)
- ≥ 5 audits attributed in the first 90 days
- Indexed in Google Search Console within 14 days

---

### Magnet 5 — Score explainer page (`/scoring`)

**Status**: Not yet built. Quick build (≤ 1 day).

**What it is**: a single page that explains the five scoring
dimensions in plain language — what each measures, why it's weighted
the way it is, what a "good" / "at risk" / "critical" score actually
means in practice.

**Why it works**:
- Builds trust by showing the methodology
- Anchors the conversation away from "is this AI guessing?"
- Linkable from inside the audit report ("How was this scored? →")
- Useful for cold outreach replies: "click here if you want to see
  how the scoring works"

**Structure**:
1. Hero: "How we score local SEO — five weighted dimensions, no AI."
2. One section per dimension:
   - Website clarity 20%
   - Local SEO 28% (the largest, called out as such)
   - Reviews 18%
   - Competitor gap 18%
   - Conversion readiness 16%
3. Plain-language **"What good looks like / what bad looks like"** for
   each dimension
4. Honesty section: "What the audit can't see" (real PageSpeed,
   real SERP rankings, real review history)
5. CTA: "Run a free audit on your business →"

**Capture flow**: same — links into the audit form.

**KPI**:
- ≥ 20% of audit-report viewers click the "How was this scored" link
  (within 30 days of shipping)
- Reduces the rate of "is this AI?" objections in inbound replies

**Build target**: end of Week 1. Lowest-effort, highest-trust magnet
in this list.

---

### Deferred — Magnet 6: Single-dimension mini-tool ("GBP Completeness")

**Status**: Deferred to Stage 1.5 (Day 60+). Reason: teardown pages
and fix-guides do the trust-building job better at first.

**What it would be**: paste a Google Business Profile URL, get a 0–100
"GBP Completeness Score" + a "Now check the full audit →" CTA.

**Hard rule** (from product marketing context): every mini-tool must
end with "this is one dimension of five — see the full picture in a
60-second audit".

**Why deferred**: building the mini-tool requires extracting the GBP
heuristics into a standalone flow. Not hard, but the ROI vs a
fix-guide is lower at MVP scale. Build only after the first 6 guides
are shipped and at least one teardown is live.

---

### Deferred — Magnet 14: "Audit my competitor for free"

**Status**: Deferred to Week 4 as a framing test.

**What it is**: an alternate CTA on cold outreach and category pages:
"Don't want to share your own business? Run a free audit on the
competitor that's outranking you."

**Why interesting**: removes the "I don't want my own data scored"
hesitation. The audit runs against any business; the asker still gets
trained on the methodology and the artefact, just not their own
business first.

**Why deferred**: it's a copy test, not a feature. Try it as a
subject-line variant in Week 4 if Week-1–3 reply rates are below
target.

---

## 4 — Funnel Map

```
Awareness (long-tail / cold)
    Category pages /audits/<cat>        ──┐
    Fix-guides /guides/<slug>             │
    Teardown pages /teardowns/<slug>      │
                                          ▼
                                  /dashboard/new
                                          │
                                  ┌───────┴────────┐
                                  │                │
                              First audit      Returning user
                                  │                │
Consideration                     │                │
    Audit report /report/<slug>   ◄────────────────┘
    Score explainer /scoring  ────►
                                  │
Decision                          │
    "Get help" CTA in report   ───►  Lead email
    Permissioned teardown invite ──► Stage-1 referral path
                                  │
                                  ▼
                          Conversation / quote / referral
```

Two things this funnel does NOT have, deliberately:

- No newsletter signup branch
- No PDF / ebook gate at any stage

The audit is the only email-capture moment. Everything else is in
service of it.

---

## 5 — Capture Flow + Form Spec

### Capture point 1 — Audit form (`/dashboard/new`)

**Already optimised**. Cleared earlier in this session.

Fields:
- Google Maps URL (paste) — optional but recommended
- Business name (required, prefills from Maps)
- Website URL (recommended)
- City (required, prefills from Maps)
- Category (required, prefills from Maps)
- Competitors (optional, auto-suggested from OSM)

KPIs to watch:
- Maps URL paste rate (target ≥ 60% of visits)
- Audit completion (visit → submit) (target ≥ 35%)

### Capture point 2 — "Get help improving my SEO" modal

**Already live**. Captures lead intent after the audit.

Fields (current):
- Name (required)
- Email (required)
- Business name (prefilled)
- Phone (optional)
- Notes (optional)
- Hidden: audit ID, report URL, city, category, score

Deferred enhancements (already documented in monetization plan; do not
build until ~10 real leads have flowed through):
- Budget select (`< €500 / €500–2k / €2–5k / €5k+ / not sure`)
- Timeline select (`this month / this quarter / just exploring`)

### Capture point 3 — Inline forms (none)

There are no inline lead-capture forms on category pages, fix-guides,
or teardowns. The single CTA on each routes to the audit form. This
is deliberate.

---

## 6 — Email follow-up concepts

There is currently **no email sequence**. Everything is one-to-one.

### What happens today

| Event | Email sent | Recipient | Sender |
|---|---|---|---|
| User submits "Get help improving my SEO" | Subject: `New SEO Terrain lead · <business>` | mgmikeymg@gmail.com (founder) | Resend |
| Founder replies manually within 4 hours | Personal one-to-one reply | Inquirer | Founder's gmail |

### What we will NOT build during launch month

- A welcome email sequence
- A drip campaign
- A reactivation email
- A weekly newsletter
- Automated nurture from the audit

### What we WILL build (Stage 1, not now)

| Trigger | Email | Why |
|---|---|---|
| 7 days after audit run, no return visit | "How did the audit go? Anything not clear?" — one short personal-feeling email | Recover ~10% of dropped audits |
| Owner asked "fix this" + we routed → 14 days later | "Did [Operator] reach you? Want me to find someone else?" — manual check-in | Quality of the routing layer |
| Lead reply with "not now" | Tagged in tracker, no auto-followup. Wait 90 days, manual outreach with a new audit if their business has changed | Don't burn the relationship |

These are SOPs, not automation. Founder runs them off the tracker
spreadsheet manually until the volume justifies actual sequence tooling.

---

## 7 — Share Loops + Social Loops

The strongest virality lever is the **shareable report URL itself**.
Loops to design around it:

### Loop 1 — Audit → owner forwards report → owner's web/SEO person sees it

**How**: when the audit ends, the report page shows a Share button
with the public `/report/<slug>` URL. Encourage forwarding ("Send this
to your web designer").

**Tracking**: the server-side view counter on `/report/<slug>` reveals
how often each report URL is opened. Reports with > 1 view are
high-signal — the owner forwarded it.

**Action when triggered**: founder reaches out to the audited owner
asking "I noticed someone else opened your report — happy to talk to
them too if you want me to?"

### Loop 2 — LinkedIn teardown post → audit on poster's own business

**How**: every LinkedIn teardown ends with `https://seoterrain.vercel.app`
(or the matching category page URL). Readers paste their own Maps URL
to compare.

**Tracking**: UTM-stamped link from LinkedIn → measure new audits with
that referrer.

### Loop 3 — Permissioned teardown → audited owner shares on their LinkedIn

**How**: when a teardown ships, the audited owner gets a polished link
suitable for posting on their own LinkedIn. Many will share — it's
flattering social proof for them.

**Tracking**: shares to LinkedIn are visible if the owner tags us.
Otherwise: spike in `/teardowns/<slug>` views the day after we deliver
the link.

### Loop 4 — Agency uses audit in pre-sales call → client runs follow-up audit

**How**: when an agency runs an audit on a prospect's business and
shares the report URL in a discovery call, the prospect often runs a
second audit later on a competitor (typical agency-call behaviour).

**Tracking**: emerges only after 1–2 agency partners have used the
tool in their pipeline. Manual observation.

### Loop 5 — Fix-guide → social share → audit

**How**: each fix-guide gets one LinkedIn announce post when it
publishes. The guide stands alone as readable content, and embeds the
audit CTA.

**No widgets, no embeds, no JavaScript-tracked sharing**. Loops are
human-driven.

---

## 8 — Lightweight Automation Opportunities

What can be safely automated without "platform" drift:

| Automation | What it does | Effort | When to build |
|---|---|---|---|
| **Server-side view counter on `/report/<slug>`** | Increments on each GET; surfaces in admin Sheet via tiny endpoint | 1–2 hours | Week 1 |
| **UTM stamping on category-page CTAs** | `/dashboard/new?utm_source=<surface>` | 30 min | Week 1 |
| **Lead-email enrichment** | Adds last-7-days audit count and "report opened? yes/no" to the lead notification email body | 1 hour | Week 2 |
| **Founder daily digest** | One short morning email summarising new audits + leads in the last 24h | 2 hours | Week 3 (if volume > 1/day) |
| **Partner-routing email** (later) | When a lead arrives, auto-email the operator with first-dibs in that category × city | 4 hours | Stage 1 (Day 60+) |
| **Sitemap auto-ping to GSC** | Already handled by Next/Vercel | n/a | shipped |

What we will NOT automate during launch month:

- ❌ Lead nurture sequences (no list yet)
- ❌ Slack notifications (email is enough; one inbox = focus)
- ❌ CRM integration (Google Sheet IS the CRM)
- ❌ "Audit completed" trigger emails to the user (we don't want to
  send unsolicited mail to people who only wanted to see their score)
- ❌ Auto-tweeting / auto-LinkedIn posting (kills tone)
- ❌ AI-generated email replies (every reply is hand-typed)
- ❌ Zapier / Make.com / n8n until Stage 1

---

## 9 — KPI Expectations

Targets calibrated to MVP-stage, solo-builder reality. Not industry
benchmarks for a funded SaaS.

### Audit (Magnet 1+2) — Month 1

| Metric | Target | Vanity? |
|---|---|---|
| Audits run (any source) | ≥ 30 | No |
| Audits via cold email | ≥ 15 | No |
| Audits via LinkedIn referrer | ≥ 5 | No |
| Audits via organic search | ≥ 2 | No |
| Audit completion rate (`/dashboard/new` visit → audit row) | ≥ 35% | No |
| Report URL opened > 0 times by anyone other than the runner | ≥ 50% | No |
| "Get help" form submissions | ≥ 3 | No |
| LinkedIn impressions per post | (whatever) | **Yes — ignore** |

### Score explainer (Magnet 5) — first 30 days post-ship

| Metric | Target |
|---|---|
| Click-through from `/report/<slug>` to `/scoring` | ≥ 20% |
| "Is this AI?" objections in inbound replies | drop by ≥ 50% |

### Fix-guides (Magnet 4) — first 90 days per guide

| Metric | Target per guide |
|---|---|
| Organic search visits | ≥ 50 |
| Audits attributed (UTM) | ≥ 5 |
| Indexed in Google Search Console | within 14 days |
| Click-through to `/dashboard/new` | ≥ 8% |

### Teardown pages (Magnet 3) — first 30 days per teardown

| Metric | Target per teardown |
|---|---|
| Total views | ≥ 100 |
| Audits attributed | ≥ 15 |
| Audited business reshared on their own LinkedIn | ≥ 30% of teardowns |

### Conversion (across all magnets)

| Metric | Month-1 target |
|---|---|
| Total leads captured (Get-help submissions) | ≥ 3 |
| Leads quoted by a partner operator | ≥ 1 |
| Leads converted to referral (pipelined or paid) | ≥ 1 |

**Vanity metrics to ignore entirely**: total visitors, sessions,
bounce rate, LinkedIn likes, email open rates (no list to open), Vercel
build count, Vercel deployment count.

---

## 10 — Build now vs build later

### Build NOW (Week 1)

1. ✓ Submit sitemap to GSC (5 min)
2. Server-side view counter on `/report/<slug>` (2 hr)
3. UTM stamping on category-page CTAs (30 min)
4. `/scoring` explainer page (1 day)
5. Lead-tracker Google Sheet (10 min — wraps Stage 0)

### Build WEEK 2

6. Fix-guide #1: `/guides/gbp-categories-restaurants`

### Build WEEK 3

7. Fix-guide #2: `/guides/local-review-velocity`
8. First teardown if a Week-2 audited owner permissions us
9. Lead-email enrichment (audit-count + report-opened indicator)

### Build WEEK 4

10. Fix-guide #3: `/guides/dental-insurance-prominence`
11. Founder daily digest (only if volume justifies — ≥ 1 audit/day)
12. UTM analytics roll-up in tracker

### Defer to Stage 1 (Day 60+)

- Mini-tool: GBP Completeness Score
- Partner-routing automation
- Budget / timeline modal fields
- Reactivation email SOP

### Defer indefinitely / never

- Newsletter
- PDF downloads of any kind
- Email mini-course
- AI-generated content engine
- Anything tracked via a popup, modal interrupt, or exit-intent
- Standalone SEO utilities (DA checker, robots generator, etc.)

---

## 11 — Distribution per magnet

| Magnet | Cold email | LinkedIn | SEO (organic) | Direct hit | Paid |
|---|---|---|---|---|---|
| 1 — Audit | ✓ primary | ✓ (CTA on every post) | ✓ via homepage + category pages | ✓ | ✗ |
| 2 — Report URL | ✓ (the email IS the URL) | ✓ (teardown screenshots) | ✗ (noindex) | ✓ | ✗ |
| 3 — Teardown | ✓ (signature/footer link) | ✓ primary | ✓ long-tail | ✓ | ✗ |
| 4 — Fix-guide | secondary | ✓ ("we just published…") | ✓ primary long-term | ✓ | ✗ |
| 5 — Score explainer | rare | rare | ✗ (light SEO) | ✓ (linked from every report) | ✗ |

Paid promotion across all magnets: **none during launch month**. The
cost-per-audit hasn't been established; we'd be optimising the wrong
number.

---

## 12 — Things that look like lead magnets but aren't

These produce leads but should be treated as distribution surfaces,
not standalone magnets:

- LinkedIn posts (drive cold traffic; the audit converts them)
- Cold emails (carry an existing audit URL, not a download)
- Fix-guides (indexed, but end in "run the audit", not "give me your
  email")

We never gate any of these behind an email. The audit form IS the
email-capture moment.

---

## 13 — Anti-patterns

Things competitors / generic SaaS playbooks do that we won't:

| Anti-pattern | Why we reject |
|---|---|
| "Free SEO Audit (gated, give us your email and we'll call you)" | Adds friction to the existing 60-second flow |
| "Download our 50-page Local SEO playbook" | PDF lead magnets convert worse than the live audit and look like every other SEO content shop |
| "Free SEO course (5 days, 5 emails)" | Course completion rates ~5%; salon owners don't take SEO courses |
| Exit-intent popups with PDF downloads | Off-brand. Signals "growth-hack tool". |
| Newsletter signup that promises "tips and tricks" | We have no newsletter and shouldn't start one |
| Free SEO tools indexed primarily for SEO traffic (DA checker, etc.) | Generates noise we don't want to be known for |
| Quizzes ("What kind of local business owner are you?") | Off-tone, doesn't extend the audit |
| Webinars / virtual summits | Wrong audience format — SMB owners don't attend webinars |
| Refer-a-friend with paid kickback | We have no paid month yet |
| Affiliate program for content creators | Anti-marketplace stance |
| Slack/Discord community | Wrong cadence + signals "community-led growth" SaaS template |

---

## 14 — Final principle

Every magnet ships when it makes the next 10 audits easier to acquire,
not because it's "on the playbook". If a proposed magnet won't move
the audit-run number — kill it.

The audit is the magnet. Everything else extends the audit.
