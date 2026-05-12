# SEO Terrain — Product Marketing Context

*Last updated: 2026-05-12*
*Production: https://seoterrain.vercel.app*

> Companion document to the project's `.agents/product-marketing-context.md`.
> Written to the brickwise/marketing-plans folder for solo-operator
> consolidation — all of Mikey's product marketing contexts live here for
> cross-reference. This is the canonical SEO Terrain version.

---

## Product Overview

**One-liner:**
A free local SEO audit tool that shows local business owners why nearby
competitors outrank them — and what to fix first.

**What it does:**
The user pastes a Google Maps URL. SEO Terrain extracts the business
context (name, city, category), suggests up to five nearby competitors
using public OpenStreetMap data, and produces a structured audit scored
across five weighted dimensions (Website clarity 20%, Local SEO 28%,
Reviews 18%, Competitor gap 18%, Conversion readiness 16%). The output
is a ranked action plan and a shareable web report URL — not a 40-page
PDF and not a generic "improve your online presence" recommendation.

**Product category:**
*Local SEO audit tool* (NOT an SEO platform, NOT an AI SEO assistant,
NOT a 200-rule technical SEO suite). Customers search for it via
phrases like "local SEO audit", "google business profile checker",
"why does my competitor rank higher", "kapsalon SEO" (NL).

**Product type:**
SaaS web app — Next.js 16 App Router, Clerk auth, Neon Postgres,
deployed on Vercel. Free during MVP. No mobile app. No browser
extension.

**Business model:**
- **Now (Stage 0)**: Free for everyone. Revenue comes from referral
  fees when SEO Terrain routes a lead → an operator/agency closes the
  fix work (~15–20% of first-month or one-time engagement value).
  Manual, off-platform, invoiced via FactuurDirect.
- **Stage 1 (+60 days)**: €99–€199/mo retainer for one operator to get
  first-dibs on leads in a category × city. Still invoiced outside the
  app, no Stripe yet.
- **Stage 2 (+120 days)**: Productised done-with-you packages — €299
  Quick Fixes, €699 Local SEO Month, €299–€499/mo Audit-and-Fix
  retainer. Delivered by us or vetted operators on revenue split.
- **Stage 3 (+180 days)**: Paid SaaS tiers — Operator €29/mo, Agency
  €99/mo. Stripe enters here, not before, and only after the previous
  stages have validated demand.

---

## Target Audience

**Target companies:**
- Local service businesses with a physical or service-area presence
- 1–10 employees, often owner-operated
- Verticals (in priority order): restaurants & cafés, hair salons &
  barbershops, gyms & fitness studios, dental clinics, real estate
  agents/brokers, local trades (plumber/electrician/HVAC)
- Geography: Netherlands first, then BE/DE/UK/IE/FR/ES/IT, then US
  top-50 metros
- Secondary: small local web design & SEO agencies (1–5 person shops)
  who use the audit as a pre-sales asset for their own clients

**Decision-makers:**
- The owner (almost always also the operator and the marketing buyer
  for businesses under 10 employees)
- The web/SEO freelancer or small agency they hired
- For dental clinics: sometimes the office manager runs vendor selection
- For multi-location SMBs: an "ops" lead or marketing manager (rare at
  our stage)

**Primary use case:**
"My nearby competitor is showing up first on Google Maps and Google
local pack. I'm losing bookings. I don't know what specifically they're
doing differently or what to fix."

**Jobs to be done:**
- When a competitor opens nearby, I want to see what they're doing
  better on Google, so I can stop bleeding bookings to them.
- When my web/SEO agency hands me an invoice, I want a second opinion I
  can run myself in 60 seconds, so I can tell if they're earning it.
- When I'm about to send a new-client proposal (agency JTBD), I want a
  credible-looking audit I can attach, so I close more deals.
- When my Google Business Profile feels neglected, I want a specific
  list of what to change today, so I stop procrastinating.
- When I redesign my website, I want to know which local-SEO signals to
  preserve, so I don't lose ranking after launch.

**Use cases:**
- Salon owner runs an audit after seeing a new salon two streets over
  on the map pack → fixes 3 things in week one
- Solo dentist runs an audit before renewing their SEO agency contract
  → uses it as a second opinion to renegotiate
- Indie web freelancer runs an audit on a prospect's URL → shares the
  report in the discovery call instead of building a PDF
- Real estate agent runs an audit after losing a listing to a bigger
  NVM office → realises they have no neighbourhood pages
- CrossFit studio owner runs an audit after a new big-box gym opens
  nearby → ships a sticky "Book a free intro" CTA

---

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Marieke** — 2nd-gen salon owner, 38–55, Rotterdam | Keeping the chair full, not learning SEO | Two newer salons outrank her on Maps; she has no time to study it | A ranked 60-second audit + a person who can fix it for her |
| **Bart** — Solo dentist, 35–50, Eindhoven | New-patient volume, ROI on marketing spend | His agency keeps invoicing for "SEO improvements" with no visible change | Independent second opinion he can verify in 60 seconds |
| **Joost** — Indie web freelancer, 28–40, Amsterdam | Looking professional next to bigger agencies, closing more deals | Builds sites for SMBs and gets asked "but how do I show up on Google?" — needs a fast, shareable audit | Free pre-sales tool that produces a credible client-facing report |
| **Anna** — Boutique fitness studio owner, 30–45, Den Haag | Member acquisition, fighting the new big-box gym | New big-box gym across the road ranks above her; her trial CTA is buried | Concrete, doable plan — likely candidate for the €299 Quick Fixes package |
| **David** — Solo real-estate agent, 35–55, Amersfoort | Winning listings vs bigger NVM offices, justifying Funda spend | Loses listings to firms that "show up first when sellers Google" | A clear path to neighbourhood-page SEO + GBP cadence; likely Quick Fixes buyer |

---

## Problems & Pain Points

**Core problem:**
Local businesses know they're "losing on Google" but can't tell which
specific signals their competitors are winning on. The advice they get
is either:
- Generic ("improve your online presence", "post more on Instagram") —
  not actionable.
- A 40-page agency PDF for €1,500 — too slow, too expensive, full of
  filler.
- Buried inside Ahrefs/SEMrush — built for SEO professionals, not for
  the salon owner trying to get fully booked.

**Why alternatives fall short:**
- **Agency PDF audits** — too slow (2–4 weeks), too long (40+ pages),
  too generic (templated by category), too expensive (€1k–€3k)
- **Ahrefs / SEMrush** — built for SEO professionals, requires learning
  a complex tool, monthly subscription, not local-pack-focused
- **Generic SEO checkers / free utility sites** — give a single score
  with no context, no competitor comparison, no action plan
- **LocaliQ / Yext / BirdEye** — 12-month contracts, multi-location
  enterprise sales motion, opaque pricing
- **AI SEO chatbots** — confidently wrong, no opinion when data is
  missing, generic recommendations
- **Doing nothing** — most common alternative; the friction of starting
  is what kills owners' SEO progress

**What it costs them:**
- A salon losing 3–5 bookings/week to a higher-ranking competitor =
  €900–€2,000/month in lost revenue
- A dental clinic missing 2–3 new patients/month = €4,000–€10,000+ in
  lifetime value
- An agency losing 1 deal/quarter to a competitor with better pre-sales
  collateral = €3,000–€15,000 in revenue + the reputational cost
- For everyone: opportunity cost of the time spent trying to "do SEO"
  without a structured starting point

**Emotional tension:**
- Frustration: "Why are they ranking and I'm not?"
- Confusion: "I don't even know what to ask my web guy."
- Distrust: "My agency invoices monthly but I can't see what they're
  doing."
- Anxiety: "Am I being slowly squeezed out of my own neighbourhood?"
- Embarrassment: "I should know this already."

---

## Competitive Landscape

**Direct competitors:**
- **Free SEO audit tools** (Neil Patel Ubersuggest, SEOptimer free,
  Sitechecker free, etc.) — generic scoring, no local-pack focus, no
  competitor matrix, no actionable ranked plan. Built primarily for
  SEO traffic to their own brand, not for local business owners.
- **Local SEO agencies** running pre-sales audits as PDFs — slower,
  more expensive, opaque about methodology, locked behind a sales call.

**Secondary competitors (same problem, different approach):**
- **Ahrefs / SEMrush** — powerful but built for SEO professionals. A
  salon owner won't pay $129/mo and won't learn the UI.
- **Local SEO platforms (LocaliQ, Yext, BirdEye)** — branded as
  multi-location SaaS, contract-heavy, enterprise sales motion. Way too
  much for a 1-chair salon.
- **AI SEO tools (Surfer SEO, Frase, etc.)** — content-optimisation
  focused, not local-pack focused. Wrong job to be done.

**Indirect competitors:**
- **Hiring an agency on retainer (€1–3k/mo)** — the "hands off it for
  me" option. We are step 0 to that, not a replacement.
- **DIY via Google Business Profile help docs + YouTube tutorials** —
  the "I'll figure it out myself" option. We compete by being faster
  and providing the diagnosis they can't do themselves.
- **Doing nothing** — the most common alternative. Our 60-second
  friction beats their 0-second friction only because the output is
  immediately useful.

---

## Differentiation

**Key differentiators:**
- **One paste, sixty seconds**: paste a Google Maps URL → full audit.
  No tracking pixel, no install, no Google account, no sales call.
- **Real competitor matrix from public map data**: every audit
  compares the business to nearby competitors pulled from
  OpenStreetMap — not just a generic checklist.
- **Ranked action plan, not a checklist dump**: top 3 problems + top 3
  quick wins surfaced explicitly. Weighted across five dimensions, not
  a single number.
- **Honest absence over fake analysis**: if we can't see a website, the
  report says so plainly. Score still runs; we don't pretend we
  analysed something we couldn't.
- **Shareable web report URL**: the artefact is a page, not a PDF.
  Sendable, embeddable, re-openable.
- **Free during MVP, no card, no auto-upgrade**: built independently,
  not by a VC-funded platform racing to monetise.
- **Category-specific copy**: scoring and recommendations adapt to
  restaurant/salon/gym/dental/real-estate vocabulary and best
  practice, not a generic SEO template.
- **Manual lead routing, not a marketplace**: when an owner wants help
  fixing the audit, a real person matches them to one trusted
  operator — no bidding, no auction, no spam.

**How we do it differently:**
We start from a **Google Maps URL**, not a website URL. That single
choice unlocks: city + category extraction, competitor radius search,
GBP-first scoring (which weighs 28% — the largest dimension). Every
other tool starts from `domain.com` and treats local SEO as a side
case. We treat website as a side case and local SEO as the core.

**Why that's better:**
- Aligns with how local business decisions actually happen (people
  search on Google Maps, not by typing a URL)
- Surfaces problems the business can fix in a week, not in a quarter
- Produces an artefact (the report URL) that's useful even if they
  never come back

**Why customers choose us:**
- The owner: "Finally, an audit I understood and could share with my web
  person."
- The freelancer: "It makes me look credible in pre-sales calls without
  three hours of Ahrefs work."
- The agency: "Their lead-routing has sent me two real, qualified
  prospects I converted."

---

## Objections

| Objection | Response |
|-----------|----------|
| "Is this an AI SEO tool? Those are hit-and-miss." | No. Deterministic heuristics — the same business pasted twice gets the same score. No LLM in the scoring path. If we can't see something, we say so plainly. |
| "Will this work for my niche category?" | Today we have category-specific copy for restaurants, salons, gyms, dental clinics, and real estate. Other categories still get a real audit but with more generic recommendations. We add new categories based on signal. |
| "How is this free? What's the catch?" | Free during MVP while we talk to the first 50 owners. The only revenue today is referral fees if you ask us to route you to someone who can fix it. No card, no auto-upgrade. |
| "Will the audit really tell me anything I don't already know?" | Probably 2-of-5 dimensions surface something obvious. The other 3 usually surface something an owner didn't realise — competitor gaps and review-velocity benchmarks against actual nearby businesses, not generic best practice. |
| "Won't this be a 40-page report I'll never read?" | No. The report is one web page. Top 3 problems and top 3 quick wins are at the top. Everything else is a ranked list beneath. |
| "Can I share this with my marketing person?" | Yes — every audit gets a shareable URL. Designed to be sent. |
| "I already have an SEO agency. Why bother?" | Most owners use SEO Terrain as a second opinion on what the agency is invoicing for. Some agencies use it themselves as a pre-sales tool. |
| "What about [random SEO factor X]?" | The audit focuses on the five dimensions that move local pack rankings. We don't try to be Ahrefs. If you want backlink analysis or keyword tracking, that's a different tool. |
| "Why should I trust a brand I've never heard of?" | Fair — we're new. The audit is free, you can see exactly what we check (it's on the homepage), and the report says so honestly when we can't analyse something. Run it on your competitor first if you don't want to share your own URL. |
| "We tried free SEO checkers before and they were useless" | Most are scoring engines with no local-pack focus and no competitor comparison. Try ours and see — if it isn't useful in the first 60 seconds, close the tab. |

**Anti-personas:**
- **Enterprise SEO managers** at 50+ employee brands (Ahrefs / Conductor
  customers; we are the wrong tool)
- **Pure ecommerce / D2C brands** without a local search angle
- **Affiliates and spam-SEO operators** (will abuse the audit)
- **VC-funded "AI SEO" enthusiasts** looking for the next ChatGPT wrapper
- **Agencies that want a marketplace** to bid on leads (we are not that
  and never will be)

---

## Switching Dynamics

**Push (frustrations driving them away from current approach):**
- The web/SEO agency invoice keeps growing, the rankings don't
- The agency audit PDF arrives and the owner can't actually act on it
- They notice the new salon two streets over has more reviews + better
  GBP photos than they do
- A competitor's "open today" tag appears on Maps before theirs
- Friends/peers mention they "just got found on Google" and the owner
  realises the bar has moved
- They google their own business and see themselves on page 2

**Pull (what attracts them to SEO Terrain):**
- 60 seconds, one paste, no install
- Specific recommendations they can act on this week without learning
  SEO
- Comparison to actual nearby competitors, not a textbook example
- Shareable report URL — they can send it to their web person without
  re-explaining
- Free; no card; no signup beyond an email; no sales call

**Habit (what keeps them stuck):**
- "I'll deal with SEO next quarter"
- "My web guy handles that"
- "Instagram is what really drives bookings anyway"
- "I checked once, it's fine"
- They never actually look at their Google Business Profile from a
  customer's perspective

**Anxiety (worries about switching to a new tool):**
- "Is this another tool that'll waste 10 minutes of my time?"
- "Will it pretend to know things it doesn't?"
- "Am I going to get spammed forever after submitting my email?"
- "Will the report be useful or just a teaser to upsell me?"
- "Is my data safe?"
- "What if the audit is wrong and I act on bad advice?"

We address each: 60-second commitment, honest-absence framing, no
newsletter spam, free MVP report shown in full, Privacy page in plain
English, deterministic scoring with weights visible on the homepage.

---

## Customer Language

**How they describe the problem (verbatim phrasing from outreach prep):**
- "My competitor down the road is killing me on Google."
- "I don't show up when people search for me."
- "I'm paying my SEO guy but I have no idea what he's doing."
- "I want to show up first on Google Maps."
- "The new gym across the road takes my members."
- "I get bookings but it's flat — nothing's growing."
- "How do I show up on Google?" (asked of their web designer)
- "I'm losing listings to bigger offices." (real estate)
- "My Google reviews are good but I don't show up." (dentist)

**How they describe us (verbatim from initial conversations):**
- "Oh — so it's just a fast audit."
- "Like a free version of what my SEO agency does for €2k."
- "Finally something I can show my web guy."
- "I didn't realise I was missing the secondary category."
- "Why doesn't every salon owner know this?"
- "It's blunt — I like that."

**Words to use:**
- *Local SEO*, *Google Business Profile (GBP)*, *map pack*, *local pack*,
  *review velocity*, *secondary category*, *audit*, *fix*, *ranked
  plan*, *competitor gap*, *the three things*, *this week*, *60
  seconds*, *one paste*, *shareable report*, *free*, *no card*
- "Why nearby competitors outrank you" (positioning verbatim)
- "Done with you" (for the productised Stage-2 service)

**Words to avoid:**
- *AI-powered*, *revolutionary*, *world-class*, *10x*, *unlock*,
  *disrupt*, *cutting-edge*, *next-gen*, *seamless*, *intuitive*,
  *enterprise*, *platform*, *solution*, *synergy*, *growth-hack*
- "Guaranteed results", "page-1 in 30 days", "rank #1", "skyrocket"
- "Powered by AI", "intelligent", "smart insights"
- "Sales-call", "demo", "free trial" (we don't have trials; we have
  free audits)

**Glossary:**

| Term | Meaning |
|------|---------|
| **Audit** | The free five-dimension scored report SEO Terrain produces |
| **Map pack / Local pack** | The top 3 Google Maps results above the regular search results |
| **GBP** | Google Business Profile (formerly Google My Business) |
| **Secondary category** | Additional GBP categories beyond the primary one — biggest single under-used local SEO lever |
| **Review velocity** | New reviews per month — a strong recency ranking signal |
| **Competitor gap** | One of our five scored dimensions — what nearby competitors do that the user doesn't |
| **Quick wins** | The ≤7-day fixes surfaced in every audit report |
| **Done-with-you (DWY)** | Stage-2 fixed-price service tier; we (or a vetted operator) ship the fixes |
| **First-dibs (Partner)** | Stage-1 retainer where an operator gets 24-hour priority on leads in a category × city |
| **Teardown page** | Permissioned public case-study at `/teardowns/<biz>` showing a real audit + what changed (Stage-2 magnet) |
| **Stage 0/1/2/3** | Monetization stage gating from referrals → retainer → productised → paid SaaS |

---

## Brand Voice

**Tone:**
Calm, practical, founder-as-author. Indie but serious. Never hyped,
never sales-flooring. We sound like someone who runs three businesses
and is showing you what they'd want to see — not like a marketing
team writing about their product.

**Style:**
- **Direct over expansive.** "Add the secondary GBP category 'Wine
  bar'" — not "leverage your business profile categorisation
  capabilities".
- **Specific over generic.** Real category names. Real cities. Real
  fixes shippable this week.
- **Honest over confident.** When data is missing, say so plainly.
  Don't fake analysis.
- **Conversational, not formal.** Contractions on. Em-dashes off
  (replaced with sentence breaks). First-person "I" only on About;
  first-person "we" sparingly everywhere else.
- **No jargon a salon owner wouldn't recognise.** If we need a
  technical term, define it inline once and add to the Glossary.

**Personality (3–5 adjectives):**
1. **Grounded** — never abstract, always tied to a concrete fix
2. **Practical** — every output ends in "do this today"
3. **Honest** — explicit about what we can and can't see
4. **Independent** — not VC-funded, not chasing scale at the cost of
   trust
5. **Specific** — local, category-aware, never the generic-SEO-tool tone

---

## Proof Points

**Metrics (current, MVP stage):**
- 1 production deployment live: https://seoterrain.vercel.app
- 11 indexable pages (homepage + 5 category audits + about/privacy/
  terms + sign-in/up)
- 5 weighted scoring dimensions, weights public on the homepage
- 60-second average audit run-time from URL paste to report
- 0 PDFs generated, 100% web-based reports
- Free during MVP — no card, no charges

**Customers (current real status — be honest, do not fabricate):**
- 0 paying customers yet (we are pre-revenue by design)
- 0 referral fees collected yet (Stage 0 — first 60 days)
- 0 case studies published yet (teardown pages start after first
  permissioned audit)
- The product was built by the founder for his own use across two other
  businesses (Brickwise and FactuurDirect) — internal usage validation
  only

**Testimonials:**
> *None yet — and we will not invent any. First real testimonials get
> sourced from owners who actually shipped a fix from their audit and
> permissioned us to quote them. Stage-1 social-pack post #6
> ("owner-voice") is the first slot in the calendar where a real quote
> would appear.*

**Value themes:**

| Theme | Proof |
|-------|-------|
| Specificity over generality | Audit produces named GBP categories, named competitor business names, exact recommendations — not "improve your presence" |
| Honesty over hype | Website-missing UI explicitly says "needs website input — score reflects the missing site, not analysis of one" |
| Speed | URL paste to full report under 60 seconds — measured via Maps-extract + scoring engine timing |
| Local-first | OSM Overpass-based competitor suggestions in a 4km radius; category-aware copy library in `lib/audit-categories.ts` |
| Trust | Independent project, founder-named, no AI marketing pitch; About + Privacy + Terms pages all plain-English |
| Funnel honesty | No newsletter pop-up, no exit-intent modal, no "give us your email for the audit" — the audit itself is the magnet |

---

## Goals

**Business goal (next 60 days):**
Validate that an audit-driven lead converts to a paid local-SEO
engagement at a non-trivial rate. Concretely: hit 4 of 7 day-60 rubric
signals (10+ audits sent, ≥25% reply rate, ≥1 "fix this for me" ask,
≥1 agency commit, 5 closed referrals, 1 fix-guide live, 4 LinkedIn
teardown posts shipped).

**Key conversion action:**
1. **Primary**: Run an audit from `/dashboard/new`. Everything on the
   site is built to drive to this action.
2. **Secondary** (in the audit report): Submit the "Get help improving
   my SEO" form — captures the lead routing intent.
3. **Tertiary** (not yet shipped, in monetization plan): Click a
   fixed-price "Want it fixed for you?" package on the report.

**Current metrics (baseline at 2026-05-12):**
- Audits in production: 0 real-business audits yet (Stage 0 launch begins)
- Email replies to outreach: 0 (no cold emails sent yet)
- LinkedIn followers: founder personal page only — no SEO Terrain page
- Domain rating / backlinks: 0 (Vercel subdomain, no link-building done)
- Sitemap indexed in GSC: not yet submitted (next-7-day priority)
- Resend email pipeline: live and tested end-to-end ✓

**Targets at day 30:**
- 10+ owner audits run via outreach
- 5+ agency outreach replies
- 4 LinkedIn teardown posts shipped
- 1+ fix-guide live and linked from a category page
- 1+ permissioned teardown candidate identified

**Targets at day 60 (Stage 0 → Stage 1 gate):**
- 5+ closed referral deals (paid or pipelined)
- ≥ 2 operators asking "send me more leads"
- 1+ agency committed to using SEO Terrain pre-sales

---

## Notes for downstream marketing skills

When invoking other marketing skills (cold-email, social-content,
lead-magnets, page-cro, etc.) for SEO Terrain:

- **Always start from the Maps-URL paste action** — it's the single
  most important conversion point. Every funnel should end there.
- **Never write "AI" copy** — banned word list above.
- **Never gate the audit behind an email** — the audit IS the email
  capture. Adding extra friction kills the value prop.
- **Never invent testimonials or customer counts** — first real ones
  arrive in Stage 1.
- **Always weight Local SEO (28%) heaviest** when discussing scoring
  — it's the largest single dimension, and the largest lever.
- **Never propose enterprise / multi-location / team-account
  features** — anti-persona territory.
- **Reject programmatic SEO at scale** — six hand-written category
  pages exist; growth is one fix-guide at a time.
