# SEO Terrain — Pricing Strategy

*Last updated: 2026-05-12*
*Production: https://seoterrain.vercel.app*

> Companion to:
> - [seoterrain-product-marketing-context.md](./seoterrain-product-marketing-context.md)
> - [seoterrain-launch-strategy.md](./seoterrain-launch-strategy.md)
> - [seoterrain-lead-magnets.md](./seoterrain-lead-magnets.md)
> - [seoterrain-social-content.md](./seoterrain-social-content.md)
> - [seoterrain-marketing-ideas.md](./seoterrain-marketing-ideas.md)
>
> Executes the **pricing-strategy skill** for SEO Terrain. Disciplined,
> staged, no VC fantasy modelling. Every paid tier is gated by real
> demand signals, not roadmap optimism.

---

## TL;DR

| Stage | When | What gets monetized | Tooling |
|---|---|---|---|
| **0 — Validation** | Now → +60d | Referral fees on closed deals | Manual: inbox + Google Sheet, no Stripe |
| **1 — First retainer** | +60 → +120d | Operator pays for first-dibs on a category × city | Invoice via FactuurDirect outside the app |
| **2 — Productised service** | +120 → +180d | Fixed-price done-with-you packages | Manual quote, manual invoice, no Stripe |
| **3 — Paid SaaS tier** | +180d+ | Operator €29 / Agency €99 monthly subscriptions | Stripe enters here, not before |

**The audit always stays free**. Forever. No exception.

This document is the playbook. Each stage has a **validation gate**
(must hit X signal before advancing) and explicit **anti-patterns**.

---

## 1 — Pricing fundamentals applied to SEO Terrain

### What is the value being delivered?

| Value type | Recipient | Concrete output |
|---|---|---|
| **Diagnosis** | Local business owner | A ranked, category-specific list of 3–6 fixes that, if shipped, lift local pack ranking |
| **Comparison** | Owner + agency | Concrete competitor matrix (real businesses by name) |
| **Pre-sales asset** | Web/SEO agency | Shareable report URL they can attach to a discovery call |
| **Lead routing** | Operator / agency | A pre-qualified prospect with full audit context |
| **Time saved** | Everyone | 60 seconds vs. the agency-PDF equivalent (€1–3k, 2–4 weeks) |

The **first three** are the audit output itself (and stay free).
The **fourth** is where Stage 0 revenue happens.
The **fifth** is the leverage that makes paid tiers worth charging
for once they exist.

### What value metric should pricing scale on?

Looking forward to Stage 3 paid tiers, the candidates:

| Candidate metric | Aligns with value? | Easy to understand? | Gameable? | Verdict |
|---|---|---|---|---|
| Per audit | ✓ (each audit = a unit of output) | ✓ | ⚠ (owner can paste competitor) | **Backup** |
| Per business tracked | ✓ (re-audits over time) | ✓ | ✗ | **Top pick for Operator tier** |
| Per location | ✓ for multi-location chains | ✓ | ✗ | Agency tier later |
| Per team seat | Weak (audit isn't a collab artefact) | ✓ | ✗ | **Reject** |
| Flat monthly fee | ✓ if value is unlocked instantly | ✓ | ✗ | **Top pick for both tiers** |

**Working hypothesis for Stage 3**: Operator tier = flat monthly (€29)
including unlimited audits + re-audit history for up to 1 business.
Agency tier = flat monthly (€99) including unlimited audits + history
for up to 25 businesses + white-label report URL.

**Not** per-audit-billed. SMB owners would game it or skip; the unit
cost-to-serve is trivial; the friction of metered billing destroys the
60-second-paste magic.

### What's the next best alternative? (the floor)

| Alternative | Cost | Why owner picks SEO Terrain over it |
|---|---|---|
| Hiring an SEO agency for an audit | €1–3k one-off | We are step 0; faster + cheaper to validate |
| Ahrefs / SEMrush | $129+/mo | We're local-only and don't need them to learn an Ahrefs UI |
| LocaliQ / Yext / BirdEye | $200–500+/mo, 12-month contracts | No lock-in, single-purpose, no enterprise overhead |
| Free SEO checkers (Ubersuggest, etc.) | Free | Specific to local; competitor matrix; ranked plan |
| Doing nothing | €0 | The 60-second friction beats the 0-second alternative *only* if the output is immediately useful (it is) |

The **realistic willingness-to-pay** for a solo local owner is
**€20–€60/mo** for a tool, **€200–€800 one-off** for a fix engagement,
**€500–€2,500/mo** for ongoing managed-SEO retainer.

This document anchors paid tiers to those numbers — not to industry
"average SaaS ARPU".

---

## 2 — Stage-by-stage monetization roadmap

### Stage 0 — Validation (Now → +60 days)

**Question being answered**: does an audit-driven lead convert to a
paid local-SEO engagement at a non-trivial rate, with referral
economics that work?

**Revenue source**: Referral fees on closed deals.

**Mechanics**:
1. Owner runs free audit
2. Owner clicks "Get help improving my SEO"
3. Lead lands in `mgmikeymg@gmail.com`
4. Founder hand-picks an operator / freelancer in the right
   category, forwards the audit
5. Operator quotes the prospect directly. If they close, the
   operator pays SEO Terrain a referral fee on the **first-month**
   (recurring) or **one-time** (project) engagement value

**Pricing of the referral fee**:

| Engagement type | Fee | Rationale |
|---|---|---|
| One-time fix (e.g. "redo their GBP") | **15%** of project value | Operator does the work; 15% is the going freelance-platform rate |
| Recurring retainer | **20% of first month**, no trail | Discourages racing to "the next month"; one clean payment |
| Productised package we sell ourselves (Stage 2 preview) | **N/A** — we keep the full margin | We earn it; no split needed |

**Hard rules**:
- Fee invoiced **after** the operator has been paid by the client.
  We never pre-bill referrals.
- One operator per category × city. Document the rule, enforce by
  manual rotation if SLA missed.
- No fee on lifetime recurring revenue. Trailing percentage creates
  perverse incentives for the operator.

**Operational tooling**: A single Google Sheet with columns:

| Date | Business | City | Category | Audit URL | Score | Lead status | Routed to | Engagement value | Fee owed | Fee collected | Notes |

No Stripe. No subscription billing. No automation. **Just the sheet
+ invoices via FactuurDirect**.

**Validation gate to advance to Stage 1**:
- ≥ 5 closed referrals (paid or pipelined)
- ≥ 2 operators say "send me more" without prompting
- ≥ 1 prospect explicitly asks "can you just do this for me"

If < 4 of those 3 signals hit by Day 60 — **do not advance**. Stay
in Stage 0 another 30 days. Tighten cold-email subject lines, tighten
audit copy.

---

### Stage 1 — First retainer (+60 → +120 days)

**Question being answered**: will operators pay a monthly retainer
for first-dibs access to category × city leads?

**Revenue source**: **Operator pays SEO Terrain a monthly retainer**
to get 24-hour first-look access on all leads from their category
within ~25 km of their HQ.

**Pricing**:

| Geography size | Suggested price |
|---|---|
| Single small/mid city (Eindhoven, Rotterdam) | **€99 / month** |
| Major metro (Amsterdam, Rotterdam metro, Antwerp) | **€149 / month** |
| Cross-NL or capital + region | **€199 / month** |

**Why these numbers**:
- The operator captures ~€500–€2,000 per closed Stage-0 referral.
  At a 20–30% close rate on warm leads, that's ~€500–€1,500/mo in
  closed-deal value per "first-dibs" category × city. We charge them
  about 10–15% of that for the pipeline.
- It must be cheap enough that they say "yes" after one closed deal.
  €99 ≈ one good lead, no contract math required.

**What the operator gets**:
- 24-hour priority on every audit in their category + radius
- A monthly digest of all audits in that combo (won + missed)
- The right to claim or pass; passed leads go to the next operator or
  stay open
- One operator per category × city — **no auction**

**What the operator doesn't get**:
- Lifetime exclusivity
- Their logo on shared reports (that's Agency Stage 3)
- Inbound prospect data outside the audit context
- API access (no API)

**Operational tooling**:
- A simple `Partner` table in the DB: `name`, `email`, `categories[]`,
  `cities[]`, `active_from`
- A manual or lightly-scripted matching email when a lead arrives
- Monthly invoice via FactuurDirect

**Still no Stripe.** Invoiced manually. SMBs and freelance operators
prefer it that way.

**Validation gate to advance to Stage 2**:
- 5 operators paying retainer for ≥ 2 consecutive months
- OR ≥ €1,000 MRR from retainers
- AND ≥ 10 productised-quote conversations (Stage 2 demand signal)

---

### Stage 2 — Productised service (+120 → +180 days)

**Question being answered**: will owners pay SEO Terrain *directly*
for a fixed-price fix package?

**Revenue source**: Fixed-price productised "done-with-you" packages
delivered either by SEO Terrain (founder) or a vetted Stage-1
operator (revenue split).

**The packages**:

| Package | Scope | Price | Delivery |
|---|---|---|---|
| **Quick Fixes** | Top 3 audit problems shipped end-to-end | **€299 fixed** | 7 business days, by us or a vetted operator |
| **Local SEO Month** | Quick Fixes + 4 weekly GBP posts + review-ask SMS template + 1 fix-guide implementation | **€699 fixed** | 30 days |
| **Audit + Fix Retainer** | Monthly re-audit + ongoing top-3 fix shipping | **€299–€499 / month** | Operator-led; we earn 20–30% of MRR |

**Why these numbers**:
- A Dutch local-business owner pays €100–€300/month for a web/SEO
  agency that hasn't moved their ranking. €299 once for visible
  results is a no-brainer if delivery is real.
- €699 sits below the "needs partner-decision" threshold for solo
  owners (typically €1,000).
- €299–€499/mo retainer is competitive vs €1,000+/mo agency
  retainers — and it's a step UP from doing nothing.

**Where it shows up in the product**:
- A "Want it fixed for you?" block in every public report, **next to**
  the existing "Get help improving my SEO" CTA — not replacing it.
- The free help CTA captures exploratory leads.
- The package block captures owners who already decided to pay.

**How delivery happens**:
- For the first 5 Quick Fixes packages: **the founder delivers**
  personally. This builds the SOP, the screenshot library, and the
  understanding of where the time actually goes.
- After 5: route to one Stage-1 operator per package. SEO Terrain
  keeps **20–30%**, operator keeps **70–80%**. Operator handles
  delivery + reporting.

**Payment**:
- 50% on order (invoice via FactuurDirect)
- 50% on delivery (same)
- No subscription billing yet. Each package is a discrete invoice.

**Stripe?** Still not yet. The packages are infrequent enough that
manual invoicing is fine and **higher-trust** for SMB owners.

**Validation gate to advance to Stage 3**:
- 10 productised packages sold
- OR ≥ €3,000 in a single month from packages
- AND ≥ 3 owners explicitly ask "is there a tool I can subscribe to"

---

### Stage 3 — Paid SaaS tier (+180 days+, only if justified)

**Question being answered**: are there enough owners + agencies who
want **the tool itself** on a subscription that we should ship Stripe?

**Revenue source**: Monthly SaaS subscriptions.

**Tentative tier shape** — NOT for implementation yet:

| Tier | Audience | Price | Includes |
|---|---|---|---|
| **Free** | Owners running one audit | **€0** | Audit, report URL, lead-routing path |
| **Operator** | Owners running monthly audits on their business + ≤ 2 locations | **€29 / month** | Unlimited audits, re-audit history, CSV export, monthly change-tracking, no white-label |
| **Agency** | Local agencies running audits for up to 25 client businesses | **€99 / month** | Everything in Operator + white-label report URL + custom subdomain + 5 team seats |
| **Enterprise** | Multi-location chains, larger agencies | **Custom** | Custom integrations, dedicated support — explicit anti-pattern at this stage; do NOT pursue inbound |

**Pricing principles for Stage 3**:

1. **No paid feature blocks the free audit.** Every paid feature is a
   layered convenience over the free audit (history, white-label,
   exports), never a "gate".
2. **No per-audit metering.** Flat monthly tiers — keeps the
   60-second-paste magic untouched.
3. **No annual lock-in.** Monthly only. If they leave, they leave.
   Annual pricing only when retention has been measured (≥ 80% at
   month 3).
4. **No "AI" tier.** Not allowed.
5. **No "starter" / "pro" / "premium" naming.** Use the personas:
   Operator and Agency.
6. **Grandfather rule**: anyone on free tier as of Stage 3 launch
   stays free for life on the same feature set.

**Stripe finally enters here**:
- Subscription products: Operator (€29/mo) and Agency (€99/mo)
- Card-only, no invoicing flow needed at this stage
- Self-serve upgrade from inside the product
- Cancel with one click; no save-offer flow at MVP scale

---

## 3 — Pricing positioning + packaging

### What the homepage says

Today the homepage's pricing section reads (correctly):

> **Free during MVP.** Audits are free while we're talking to the first
> 50 users. Paid tiers will exist when there's something worth charging
> for — until then, every audit you run helps shape what we build next.

This is the **right** positioning until Stage 1 closes. Keep it.

### Recommended wording for /pricing once Stages exist

**Stage 1 era** (operators retainer is live, audits still free):

> **Audits are free.** Always.
>
> If you're a local SEO professional or small agency, we offer
> first-dibs access on leads in your category and region for €99/mo.
> One operator per category × city. Cancel any time.

**Stage 2 era** (productised packages live, audits still free):

> **Audits are free.** Always.
>
> Want us to fix what we found? Three packages:
>
> · Quick Fixes — €299, 7 days. Top 3 audit problems shipped end-to-end.
> · Local SEO Month — €699, 30 days. Quick Fixes + GBP cadence + review-ask system.
> · Audit + Fix Retainer — from €299/mo. Monthly re-audit + ongoing fixes.
>
> Delivered by us or a vetted operator. Paid by invoice, not card-on-file.

**Stage 3 era** (SaaS tiers, the audit is still free):

Three columns. Free / Operator / Agency. **The Free tier card is
prominent and never sub-positioned to the others**. Annual toggle
absent until retention proven. No "most popular" badge on Operator —
honest comparison without sales-flooring tricks.

### Packaging philosophy

- **Free does the job for 90% of users.** Paid tiers are about
  cadence, history, white-label — not about access.
- **Tiers differentiate on value metric, not feature gates.**
  Operator = 1 business tracked. Agency = up to 25.
- **No "Pro" feature creep into the audit.** The audit is the same
  audit for everyone.

---

## 4 — Upgrade triggers (Stage 3+)

When a free user encounters one of these, the natural next thought
should be "should I upgrade?" — not blocked, just nudged.

| Trigger | What user sees | Tier targeted |
|---|---|---|
| Running the 3rd audit on the same business in 30 days | "Track this business over time — Operator (€29/mo) shows the change-graph" | Operator |
| Sharing the same report URL with > 5 people | "Want to remove the SEO Terrain footer? Agency tier white-labels report URLs" | Agency |
| Submitting > 5 audits in a week | "Looks like you're running these for clients — Agency tier gives you 25 client slots + your logo" | Agency |
| Re-auditing a business they audited 30+ days ago | "See what changed between audits — Operator tier keeps audit history" | Operator |
| Trying to export an audit | "CSV export is in the Operator tier (€29/mo)" | Operator |

**Anti-pattern to avoid**: A pricing-modal popup. Use small inline
hints in the relevant context — not interrupting flows. SMB owners
hate paywalls more than any other audience type.

---

## 5 — Referral fee structure (Stage 0–1)

This is the single most-asked-about-in-DM topic from operators when
they hear about Stage 0.

| Engagement type | Fee on first | Fee on later renewals | Notes |
|---|---|---|---|
| One-time fix project | 15% of project value | n/a | Most common Stage 0 deal |
| Monthly retainer | 20% of first month | **0%** thereafter | Cleaner; no perpetual tail |
| Productised SEO Terrain package | n/a | n/a | We keep 100%; operator gets revenue-share inside delivery (70–80%) |
| Long-term contract (≥ 6 months) | 20% of first month + 10% of months 2–6 | 0% from month 7 | Compromise for higher-value deals |

**Invoicing flow**:
1. Lead arrives → SEO Terrain forwards to one operator
2. Operator quotes the prospect directly
3. Prospect agrees + pays operator
4. **Operator notifies SEO Terrain that the deal closed** (subject line:
   "Closed: [Business]")
5. SEO Terrain invoices the operator the referral fee within 7 days
6. Operator pays within 14 days (FactuurDirect, NL invoicing standard)

**No upfront fees**, **no monthly minimums**, **no exclusivity demands
in either direction** until Stage 2.

**Trust rule**: if an operator says "the deal didn't close" but the
prospect mentions otherwise in their next audit, the operator gets
**one warning**. Second time → no more referrals to them, ever.

---

## 6 — SMB psychology considerations

The pricing brain of a salon/restaurant/dental/real-estate/gym owner
is **not** the brain of a SaaS-buying tech professional. Pricing must
reflect that.

| Pattern | What it means for SEO Terrain |
|---|---|
| **Skepticism of recurring subscriptions** | Avoid auto-renew until they've experienced ≥ 1 month of value. Hard rule: first month always cancellable in 1 click. |
| **Strong preference for invoices over card-on-file** | Honour this in Stage 2; only require card-on-file in Stage 3 self-serve flow. |
| **"What's the catch?" with free tools** | The audit is free — but the "Why is it free?" line on /about answers it directly. Repeat that answer in every pricing context. |
| **Bias against "AI" / "platform" framing** | Pricing copy stays specific: "audit" not "platform", "fix" not "feature", "month" not "plan". |
| **Round numbers preferred** | €99 over €97. €299 over €297. NL/EU buyers don't read charm pricing as "deal" — they read it as gimmick. |
| **Strong word-of-mouth weight** | Pricing must be socially defensible. An owner needs to be able to tell another owner "I paid €299 to fix this" without feeling overpaid. |
| **Tax-deductibility matters** | All packages and tiers are zakelijk uitgaven (deductible). Pricing copy should hint at this lightly ("zakelijk uitgaven, BTW aftrekbaar") in NL contexts. |
| **Low tolerance for upsell** | One upgrade prompt per page max. No drip emails to free users until Stage 3 retention path is proven. |
| **Resistance to onboarding calls / demos** | Self-serve everything for SMB. Demos reserved for Agency tier inquiries only. |

---

## 7 — Risks and dangers

| Risk | Likelihood | Mitigation |
|---|---|---|
| Operators pay retainer but no leads come | Medium-high (especially in slow categories) | Money-back guarantee for month 1 if zero leads delivered. Sets expectation honestly. |
| Operators close deal but don't report it | Medium | One-warning policy + occasional follow-up with the audited owner ("did anyone get back to you?") |
| Owners think audit will be paywalled later | Low (well-positioned now) | Keep "audit always free" copy permanent in all stages |
| Stripe charged before Stage 3 | High temptation | Hard rule: do not enable Stripe products before Stage-2 validation gate is met |
| Tier confusion ("which one do I need?") | Medium | Simple language: "Are you a business? → Operator. Are you doing this for clients? → Agency." |
| Annual lock-in pushed too early | Medium | Don't ship annual pricing until ≥ 80% retention at month 3 measured |
| Saving accounts / cancel-flow misery | Low at MVP | One-click cancel from day one. No save offers. |
| White-label demanded prematurely | Medium | Stage 3 only. Defer until 5 agencies have used the raw tool and asked for it. |
| Enterprise / multi-location inquiries | Low-medium | Polite no until Stage 4 (which isn't planned). "We don't serve enterprise yet" beats half-built features. |
| Productised package over-promises | High eventually | Set the deliverable scope in writing on every package quote. No vague "and more". |
| Operator dispute over a referred lead | Low | One-operator-per-category-city rule is the deescalator. Document everything in the tracker. |
| Free tier abuse (mass auto-audits) | Low | Rate-limit at 30 audits/day per user. Don't disclose the limit publicly. |
| "Why is your AI not better than ChatGPT?" objection | Medium | The audit is not AI. The /scoring page + /about page explain this. Pricing copy must not contradict. |

---

## 8 — Anti-patterns explicit no-go list

These would all "feel like growth" while destroying the business.

- ❌ Stripe + paid tiers before Stage 2 gate is met
- ❌ Per-audit metered billing (kills the magic moment)
- ❌ "Most popular" badges before retention data exists
- ❌ Annual lock-in pricing in Year 1
- ❌ Discount codes / coupons (signals "we overpriced")
- ❌ Lifetime deals (AppSumo etc.) — wrong audience + wrong economics
- ❌ Free trial expiration emails (we don't have a trial)
- ❌ Sales-call-gated pricing ("Contact us") on Operator tier
- ❌ AI / "Smart" / "Pro" tier framing
- ❌ Bidding / auction marketplace for operators (anti-positioning)
- ❌ Exclusive territory pricing for operators ("buy out the city")
- ❌ Bronze / Silver / Gold tier names
- ❌ "From €X/month" pricing (always state the actual price)
- ❌ Multi-currency before EU is proven
- ❌ Hidden fees, setup fees, "credit card processing fees"
- ❌ Pro plan that locks the report URL until upgrade
- ❌ Re-auditing only available on paid tier (creates pressure to upgrade for the wrong reason)
- ❌ Watermarked free-tier reports ("Made with SEO Terrain – upgrade to remove")
- ❌ Asking for a credit card to access the free audit
- ❌ Save-offer dark patterns at cancellation
- ❌ Save % off if you stay (signals weak pricing)
- ❌ Stickering "limited time" / "early bird" / fake urgency

---

## 9 — Trust destroyers in SEO pricing (industry-specific)

SMB owners have been burned by SEO agencies before. Avoiding these
is more important than getting any tier right.

| Trust destroyer | Why it kills | What we do instead |
|---|---|---|
| "Page 1 guaranteed in 30 days" | Nobody can guarantee Google. The owner already heard this and didn't believe it. | Explicitly never claim ranking outcomes. |
| Hidden 12-month contracts | Owners associate this with "the last SEO agency that scammed me." | Monthly, cancellable, no contract. |
| "Free trial" that becomes paid silently | Free trials in SEO software are notorious for this. | No free trial. Free = forever free at the free tier. |
| Auto-bill upgrade after running N audits | Predatory. | Manual upgrade only. The free tier doesn't expire. |
| Watermarks / "powered by" stripped only on paid tier | Off-brand for owners; they think it's branding extortion. | The "powered by SEO Terrain" footer in shared reports is fine on free tier — most owners want to credit us anyway. |
| Reseller margins disguised as "your price" | Common in marketplaces. | One-operator-per-category-city, no reseller, no obfuscation. |
| Upselling consulting hours into the audit | Audits are free, full stop. | The audit and the package are clearly separated. |
| Charging for "category access" or "industry data" | Snake-oil pricing. | Categories are free for everyone. |
| Paywalled "real" recommendations behind a teaser audit | Bait-and-switch. | The free audit is the complete audit. |
| Asking for industry trade-secrets (revenue, profit) on signup | Privacy red flag for SMB owners. | We never ask for any business financial data, ever. |

---

## 10 — What stays free forever (the audit pricing constitution)

These are **permanent** decisions, written here so they survive
roadmap drift. Re-read before changing any pricing.

| Always free | Why |
|---|---|
| Running one audit on any business | The audit is the magnet. Charging here kills acquisition. |
| Reading the full audit report | Truncated reports are a trust-destroyer in this industry. |
| Sharing the public report URL | Sharing is the virality engine. |
| "Get help improving my SEO" lead submission | This is HOW Stage 0–1 revenue happens; can't paywall it. |
| The five-dimension scored output | Tier-locking dimensions would be the dishonest move. |
| The competitor matrix from OSM data | Free at the data source; passing the cost on would be unfair. |
| Category-specific recommendation text | Same. |
| Honest-absence framing when data is missing | Trust signal. |

---

## 11 — What becomes paid later (Stage 2 / 3)

| Paid feature | Earliest stage | Why charge for it |
|---|---|---|
| Re-audit history (timeline of past scores) | Stage 3 (Operator) | Genuinely incremental value, not a gate |
| CSV / PDF export of audit | Stage 3 (Operator) | Convenience for agencies / record-keeping |
| White-label report URL | Stage 3 (Agency) | The clearest line agencies want to pay to cross |
| Custom subdomain | Stage 3 (Agency) | Same as above |
| 5 team seats | Stage 3 (Agency) | Multi-user is genuinely operationally costly |
| Multi-location tracking | Stage 3 (Agency or Enterprise) | Higher unit cost-to-serve |
| Priority routing / SLA on lead delivery | Stage 1 (operator retainer) | Operators pay for first-dibs |
| "Audit + Fix" delivery service | Stage 2 | The work is real; pricing reflects it |

---

## 12 — What NEVER becomes paid

| Feature | Why we don't paywall it |
|---|---|
| The audit itself | Acquisition would die overnight |
| Specific recommendations (vs generic) | Specificity is the product's edge; gating it = becoming generic |
| Number of competitors in the matrix (currently 5) | This is a tooling decision; tier-locking it would be dishonest |
| The "Get help" CTA / lead submission | This is how Stage 0–1 revenue works |
| The shareable public report URL | Sharing virality > whatever paywall would earn |
| The `/scoring`, `/about`, `/guides/*`, `/teardowns/*` content | All trust infrastructure |
| The Honest-Absence framing | Charging for honesty is absurd |
| Category page content | SEO surface, not a feature |

---

## 13 — Future Stage 4+ possibilities (only if very justified)

These are explicitly **NOT roadmap**. Listed here so that if they ever
look attractive, the reader knows they're flagged conditional.

| Possibility | What it would be | Earliest realistic |
|---|---|---|
| Multi-language (NL/DE/FR/ES UI) | Translated UI + multi-region categories | Stage 4, only after Operator + Agency tiers hit €5k MRR each |
| API access for agencies | Programmatic audit submission for client portfolios | Stage 4+, only if 5+ agencies explicitly request and we can charge ≥ €299/mo for it |
| Audit + competitive intelligence subscription (€499/mo) | Adds historical competitor tracking | Stage 4+, only after Agency tier proves viable |
| Native integrations (Mindbody, Treatwell, Salonized, Funda) | Auto-pull GBP + booking data | Stage 4+, partner-driven only |
| Enterprise multi-location | 50+ location SaaS | Reject; not our market |
| Add-on AI summary subscription | A higher tier with LLM exec summary | Reject; off-brand |

**Hard rule**: nothing on this list ships until ARR per stage tier
exists and one of the above is being explicitly requested by paying
customers. No speculative builds.

---

## 14 — Operational decisions today

These are immediate ops moves that the rest of the strategy hinges on.

1. **Set up the lead tracker** (Google Sheet) before Stage 0 outreach
   begins. Done = part of the Day-1 launch checklist.
2. **Write the standard referral-fee letter** for operators that
   walks them through the 15% / 20% structure in one paragraph. Send
   it as the second message after the first audit handoff. Template:

   > Hi [Operator],
   >
   > Sending you a lead today: [Business] — audit at [URL].
   >
   > How this works: if you quote them and the project closes, I
   > invoice you 15% of one-time projects or 20% of the first
   > monthly retainer. No exclusivity, no monthly minimum, no
   > lifetime trail.
   >
   > Reply "closed: [Business]" when you've been paid and I'll
   > invoice you within 7 days.

3. **Decide on monthly retainer pricing for Stage 1 specifically**.
   Suggested anchor: **€99 / month** for the first three Stage-1
   partners, **€149 / month** thereafter once it works.

4. **Create the FactuurDirect invoice template** for referral fees +
   future retainer fees. Should be a 30-second send.

5. **Postpone Stripe**. Do not create Stripe products or paid
   features in production until Stage 2's validation gate is met.

---

## 15 — Decision rules + tripwires

Stop and re-read this document if:

- A "paid tier" idea appears in a roadmap meeting before the prior
  stage's gate is met
- A pricing change is proposed without a measured retention number
  to back it
- "Enterprise" or "platform" appears in a pricing context
- An operator proposes paying for exclusivity (not first-dibs)
- A prospect asks for "the AI tier"
- A discount code appears anywhere on the site
- Annual pricing is proposed in Year 1
- "Limited-time" or "founding member" pricing is proposed
- Anyone proposes a "free trial" of paid tiers (we have a free tier
  instead — there is no trial)
- A pricing-page mockup contains the words "Bronze", "Silver",
  "Gold", "Starter", or "Premium"
- A copywriter proposes "guarantee" anywhere on the pricing page

If any of these happens, the answer is **no** until the document
is updated and re-committed.

---

## Final principle

**Pricing here is not a growth lever — it is a trust artefact.**

Local business owners pick SEO Terrain over alternatives in part
because the pricing doesn't feel like a trap. Lose that, and the
whole positioning collapses.

The job of pricing is to stay **disciplined enough that an operator
or owner can defend it to their accountant in one sentence**.

If a tier or fee fails that test — it doesn't ship.
