# SEO Terrain — Homepage CRO

*Last updated: 2026-05-12*
*Production URL analyzed: https://seoterrain.vercel.app*

> Companion to the rest of the `seoterrain-*` marketing plans.
> Executes the **page-cro skill** against the homepage specifically.
> The other public conversion surfaces (category pages, audit form,
> public report) are covered briefly at the end.

---

## TL;DR — what to ship

| Priority | Action | Time | Likely lift |
|---|---|---|---|
| 🟢 1 | Add **"Free · 60 sec · No card"** microcopy directly under the primary CTA | 10 min | Removes the 3-second "what's the catch?" hesitation |
| 🟢 2 | Clarify the **"See a sample report"** link: "See a sample (fictional restaurant)" | 5 min | Sets expectation; reduces report-abandonment |
| 🟢 3 | Add a **repeat primary CTA** between "How it works" and "Sample report" sections | 15 min | Currently 600+px of scroll between CTAs |
| 🟢 4 | Add a small **founder-attribution line** above H1: "Built by an independent operator." | 5 min | Closest viable trust signal at pre-revenue stage |
| 🟢 5 | Add **one inline FAQ** near the pricing block: "Why is the audit free?" | 15 min | Pre-empts the #1 cold-visitor objection |
| 🟡 6 | Add **sign-in expectation** microcopy: "Sign in with Google or email — 30 seconds" | 20 min | Owners deserve to know auth gates the click |
| 🟡 7 | A/B test **H1 variant** folding the time-to-output into the headline | 1 day setup | Headline = 80% of conversion-funnel impact |
| 🔵 8 | Replace fictional Bella Trattoria sample with a **real permissioned teardown** once available | (gated by teardown availability) | Massive trust step-up |

🟢 = ship this week · 🟡 = ship within 2 weeks · 🔵 = ship when prerequisite is met

---

## Framework analysis (dimension-by-dimension)

### 1. Value proposition clarity ✓ Strong

**What's working**:
- H1 communicates the outcome clearly: "See why nearby competitors outrank you, then know what to fix first."
- Sub leads with the user's first action: "Paste your Google Maps URL."
- Three honest stats anchor scope, speed, and price: "5 dimensions · <60s · Free."
- Eyebrow tag immediately disambiguates the audience: "Local SEO audits for owners and agencies."

**5-second test**: A cold visitor lands and within 5 seconds learns:
- *What this is*: a local SEO audit
- *What I do*: paste a Maps URL
- *What I get*: a ranked list of fixes
- *What it costs*: free, no card

**Pass**. The hero answers all four questions.

**Small gap**: the sub mentions "up to five nearby competitors" but
doesn't say *where* we get them. OSM-based competitor data is a real
trust signal; could be surfaced. Test in a future variant.

---

### 2. Headline effectiveness ✓ Strong, with one test idea

**Current H1**: *"See why nearby competitors outrank you, then know what to fix first."*

Hits the strongest patterns:
- **Outcome-focused** (not feature-focused)
- **Specific** ("nearby competitors", not generic "your SEO")
- **Two-beat structure** ("see why X, then know what to fix") with a green-highlighted second beat (`text-accent`)

**Improvement opportunity**: time-to-output isn't in the H1. It's in
the stats below ("<60s"). Folding it in would make the H1
self-contained. See **Test idea #7** below for variants.

---

### 3. CTA placement, copy, and hierarchy ⚠ One real gap

**Primary CTA**: `Run a free audit →`
- Above the fold ✓
- Action-oriented ✓
- Single primary ✓
- Color contrast strong (emerald `btn-accent`) ✓

**Secondary CTA**: `See a sample report`
- Anchor link to `#sample` ✓
- Clear secondary visual weight (`btn-ghost`) ✓

**Issues**:

1. **Above-the-fold CTA appears once.** After the hero (about 720px),
   the next CTA is at the end of the "How it works" section — a
   ~1,200px scroll. Plenty of opportunity to lose intent.
2. **"Free · No card"** is in the stat strip, but the stat strip sits
   *below* the CTA cluster. The hesitation moment (the cursor over the
   button) is when reassurance helps most — and right now it isn't there.
3. **Secondary CTA confusion**: "See a sample report" might suggest
   "show me MY report" to a cold visitor. The sample is currently a
   fictional restaurant (Bella Trattoria). The label should make that
   explicit.
4. **No sign-in expectation set**. Clicking "Run a free audit"
   redirects to `/sign-in` via Clerk middleware. A cold visitor might
   bounce on the unexpected auth step. Microcopy can pre-empt this.

---

### 4. Visual hierarchy and scannability ✓ Strong

The page reads cleanly top-to-bottom: hero (with mockup) → categories
strip → how-it-works (4 steps) → sample report → what-we-check →
pricing → footer. The mockup card on the right of the hero is the
single most effective visual element — it shows the actual product
output, not a placeholder.

**One mobile concern**: on small screens, the text column stacks
*above* the mockup. Cold visitors on mobile thus scroll past
"description of an audit" before seeing "what an audit looks like".
Test idea #10 below.

---

### 5. Trust signals and social proof ⚠ Weakest dimension

This is the **lowest-scoring dimension** by category — and the only
sustainable fix is **earning real customer evidence**, not faking it.

**What we have**:
- "Built independently, not by a VC-funded SEO platform." (pricing
  footer)
- "Free during MVP" framing — implicitly honest about stage
- A structured-data Organization + WebSite + SoftwareApplication
  schema (helps for AI Overviews + AI search, doesn't show on page)

**What we do NOT have, and shouldn't fake**:
- Customer logos (we have none)
- Testimonials (we have none yet)
- Counter ("4,200 audits run") — would be fake; reject

**Realistic moves at this stage**:
- **Founder attribution above the fold**: a small "Built by [Founder] — independent operator. Open to talk." line under the eyebrow tag, with a mailto link. Concrete, human, defensible.
- **"As featured in" placeholders are off-limits.** Don't.
- **Teardown URL injection**: as soon as one permissioned teardown
  page exists at `/teardowns/<slug>`, that URL becomes the homepage's
  single best trust signal. Replace or supplement the sample-report
  block with it.
- **GitHub link** (if open-sourcing any pieces would be on-brand) —
  often counts as trust for tech-savvy buyers. Defer unless natural.

---

### 6. Objection handling ⚠ Could add one inline FAQ

**Cold-visitor objections, ranked by frequency** (based on the
[ICPs doc](./seoterrain-product-marketing-context.md)):

| Objection | Where it's currently answered | Inline on homepage? |
|---|---|---|
| "Is this an AI SEO tool?" | `/about`, `/scoring` (when shipped) | ✗ — needs a short answer in the hero or "What we check" |
| "Why is it free?" | Pricing block (mentions MVP) | ⚠ — implicit, not direct |
| "Will the report be useful?" | Sample report deep-dive (Bella Trattoria) | ✓ |
| "Do I need to install anything?" | Implicit ("paste your URL") | ✗ — not directly addressed |
| "Will I get spammed?" | `/privacy` | ✗ — needs a one-liner near sign-in |

**Recommendation**: add a single 4-question inline FAQ between
"What we check" and pricing. Most cold visitors won't click to /privacy
or /about; bringing the answers inline is high-leverage.

---

### 7. Friction points ⚠ One sneaky friction

**Conversion path today**:

```
Click "Run a free audit"
   │
   └──> /dashboard/new
            │
            └──> Clerk middleware: not signed in
                    │
                    └──> Redirect to /sign-in
                              │
                              └──> Sign in (Google or email/password)
                                       │
                                       └──> Land on /dashboard/new
                                                │
                                                └──> Paste Maps URL
                                                         │
                                                         └──> Audit runs
```

That's **6 steps** for a cold visitor's first audit. The Clerk auth
step is the surprise.

**Mitigations**:
- Pre-empt with microcopy: "Sign in with Google or email — 30 seconds"
- Or: lazy-auth — let users paste a URL on the public marketing page
  first, then auth gating only at the moment they hit "Run". (Bigger
  build, defer.)

---

## Quick wins (implement this week)

### 1. CTA microcopy

Under the primary CTA button (between the button and the stat strip),
add a single line:

```html
<div className="text-[12px] text-ink-500 mt-1.5 num">
  Free · 60 seconds · No card · No newsletter
</div>
```

**Why**: the hesitation moment is at the button. Reassurance has to be
adjacent, not 200px below.

### 2. Secondary CTA disambiguation

Change "See a sample report" → "**See a sample report (fictional)**"
or "**See an example report**". Tells the cold visitor the sample is
illustrative, not theirs.

### 3. Repeat primary CTA mid-page

After the **"How it works"** section, add a one-line CTA card:

```
Want one for your business?    [Run a free audit →]
```

Currently the next CTA after the hero is at the end of the sample
report section (~1,400px scroll). The mid-page repeat catches
intent that builds during "How it works".

### 4. Founder attribution above the fold

Under the eyebrow tag, before the H1:

```
Local SEO audits for owners and agencies · Built by [Founder] · indie operator
```

Or as a separate line below the eyebrow:

```
Built by an independent operator. Not VC-funded.
```

The second form is brand-consistent with the existing pricing
footer line and travels well in social shares.

### 5. Inline FAQ block

Add a 4-row FAQ between "What we check" and "Pricing":

| Q | A (short) |
|---|---|
| Why is the audit free? | We're in MVP — talking to the first 50 users. No card, no auto-upgrade. |
| Is this an AI SEO tool? | No. Deterministic heuristics. If we can't see something (no website, no GBP), the report says so plainly. |
| What do I need to get started? | A Google Maps URL. That's it. Sign-in takes 30 seconds via Google or email. |
| Will you spam me? | No newsletter. We only contact you about an audit you started. |

These four questions absorb ~80% of cold-visitor friction without
adding sales copy.

### 6. Sign-in expectation microcopy

Optional addition near the primary CTA:

```
First audit takes 30s to sign in (Google or email) — no card.
```

Smaller weight than CTA. Sets accurate expectation without scaring
anyone away.

---

## High-impact changes (prioritize for the next 2 weeks)

### 7. Hero H1 A/B test

The current H1 is strong. Worth testing a variant that folds the
60-second promise in:

**Current**:
> See why nearby competitors outrank you, then know what to fix first.

**Variant A** (folds time-to-output in):
> See why nearby competitors outrank you — in 60 seconds.

**Variant B** (folds value into the second beat):
> See why nearby competitors outrank you. Get the ranked fix list.

**Variant C** (puts the trigger event first):
> A 60-second local SEO audit. See exactly why competitors outrank you.

**My recommendation**: ship the inline FAQ + microcopy first
(low-risk, high-clarity wins), then run **Current vs. Variant A**
once there's enough cold traffic to measure (target: ≥ 500 cold
visitors per variant per week, so probably Month 2+).

### 8. Mobile hero re-order

On mobile (`< sm`), reverse the column order so the **HeroMockup**
appears *above* the text column. The mockup is the single most
persuasive element; on a thumb-scrolled cold visit, it should be
the first thing.

Effort: ~30 min CSS (`order-1 sm:order-2` on the mockup column).

### 9. Replace fictional sample with a real teardown

The "Sample report" section currently shows fictional "Bella Trattoria
— Cleveland, OH". Once a real permissioned teardown exists at
`/teardowns/<slug>`, replace this block with:

- A real businessname (anonymised allowed: "A hair salon in
  Rotterdam, score 67/100")
- A real public report URL link
- "What the owner actually changed" callout

This is the single highest-leverage CRO change available — but it's
gated by teardown availability (Stage 1 work).

### 10. Pricing block CTA continuity

The pricing block currently has three subtle cards (Now / Later /
Later). The "Now" card has a CTA button — but it sits inside the
card and reads as "informational" rather than "action".

Recommendation: pull the "Run a free audit →" button OUT of the
card and place it on its own row directly under the pricing block
heading.

---

## Test ideas (A/B test once traffic supports it)

Order by expected impact:

1. **H1 variant** with "in 60 seconds" folded in (see #7 above)
2. **Primary CTA copy** test:
   - A: `Run a free audit →` (current)
   - B: `Paste a Google Maps URL →` (shows the friction is low)
   - C: `Audit my business →` (first-person; intent-stronger)
3. **Hero stat strip** test:
   - A (current): `5 Scored dimensions · <60s · Free`
   - B (with real volume once it exists): `N audits this week · <60s · Free`
4. **Secondary CTA position** test:
   - A (current): `See a sample report` (`btn-ghost`)
   - B: replace secondary CTA with: `→ How it works` (anchor to `#how`)
5. **Above-the-fold trust line** test:
   - A: `Built by an independent operator.`
   - B: `Built by [Founder Name]. Talk to me: [email].`
   - Whichever wins gets canonical placement.

**Do not test** (low value at this stage):
- Color palette
- Button shape (radius)
- Font family
- Microscopic copy tweaks ("a free" vs "the free")
- Pricing tier ordering (pricing isn't the conversion surface yet)

---

## Copy alternatives (3 options each)

### Hero H1

| Option | Strengths | Weaknesses |
|---|---|---|
| **A** (current): See why nearby competitors outrank you, then know what to fix first. | Concrete; two-beat with promise + outcome | Doesn't include speed signal |
| **B**: See why nearby competitors outrank you — in 60 seconds. | Adds urgency; matches user intent | Slightly shorter outcome beat |
| **C**: Your local SEO audit, free in 60 seconds. | Most concrete possible | Loses the "competitors outrank you" pain hook |

**Recommendation**: keep A for now. Test against B in Month 2 once
cold-traffic volume is meaningful.

### Hero sub

| Option | Strengths | Weaknesses |
|---|---|---|
| **A** (current): Paste your Google Maps URL. SEO Terrain scores your site, profile, reviews and up to five nearby competitors, then gives you a ranked list of fixes. No 40-page PDF. | Lists every component; clearly anti-PDF | A little long for a sub-header (38 words) |
| **B**: Paste a Google Maps URL. We score five dimensions, compare to nearby competitors, and give you a ranked plan. No 40-page PDF. | Tighter (24 words); matches the "How it works" copy | Loses "site, profile, reviews" specificity |
| **C**: A free local SEO audit. Paste a Google Maps URL, get a ranked fix list, share the report. Built for owners — not for SEO experts. | Adds audience differentiation | Loses "competitors outrank you" framing |

**Recommendation**: keep A. Tighten by 5 words if needed:
"Paste your Google Maps URL. SEO Terrain scores your site, profile,
reviews and up to five nearby competitors, then ranks the fixes by
impact."

### Primary CTA button

| Option | Strengths | Weaknesses |
|---|---|---|
| **A** (current): Run a free audit → | Clear value (free) + action (run) | Generic verb |
| **B**: Audit my business → | First-person; intent-stronger | Doesn't mention free |
| **C**: Paste a Google Maps URL → | Demonstrates the friction is low | Wordier; less imperative |

**Recommendation**: keep A. The "Free · 60 sec · No card" microcopy
below the button (Quick Win #1) carries the value framing; the
button itself should stay imperative.

---

## Per-page CRO notes (other surfaces)

### Category pages `/audits/<slug>` ✓ Mostly solid

What's working:
- Per-category H1 (e.g. "Restaurant SEO audit — outrank nearby restaurants on the map")
- Hand-written copy, not templated
- FAQ section ✓
- Clear primary CTA
- Related-categories block at bottom

Quick wins:
- Add the same "Free · 60 sec · No card" microcopy under each
  category-page CTA
- Test a category-specific stat in the hero: "We've audited [N]
  [category]s" — only once N ≥ 5 to keep honest

### Audit creation form `/dashboard/new` ✓ Already optimized

What's working:
- Maps URL is the first field
- Auto-prefill of business name / city / category on paste
- Competitor suggestions (OSM) appear automatically
- Single primary submit CTA

Quick wins:
- Optional: a small "X audits completed this week" counter on the
  form page — but only once volume justifies (≥ 10/week)
- Add a one-line trust ribbon at the top: "Audit is free. Report is
  yours to keep. No upsell after."

### Audit report `/dashboard/audits/[id]` and `/report/[slug]` ⚠ One CTA-hierarchy issue

The "Get help improving my SEO" CTA is correctly placed below the
action plan. **However**: it currently competes with the share button
at the top of the page. Two CTAs of similar visual weight = decision
fatigue.

Recommendation: subordinate the share button to a smaller icon-only
position; keep "Get help" as the dominant secondary action below the
action plan.

(Already deferred per the monetization plan: ship budget + timeline
selects in the modal once Stage 0 has ≥ 10 real leads.)

---

## What to measure

Before any A/B test ships, the following baseline metrics need to exist
in a Google Sheet (no analytics tool needed yet):

| Metric | Source | Baseline target |
|---|---|---|
| Homepage views / week | GSC + manual sample | Need to know before optimising |
| Homepage → `/dashboard/new` click-through | UTM stamping (`?utm_source=home`) | Target: ≥ 12% of homepage visitors |
| Sign-in completion rate (cold → first audit) | Postgres: `User.createdAt` joined to `Audit.createdAt` | Target: ≥ 60% within 5 minutes of sign-in |
| Audit completion rate (`/dashboard/new` visit → `Audit` row) | Postgres | Target: ≥ 35% |
| Bounce rate from homepage hero | Inferred via page-views vs session-length | Eyeball only — no Mixpanel until Stage 2 |

**Do not run an A/B test before there are ≥ 200 cold homepage visits
per week.** Below that the variance is noise.

---

## Anti-patterns to avoid (homepage-specific)

| Anti-pattern | Why we reject |
|---|---|
| Exit-intent popup | Off-brand; signals "growth-hack tool" |
| "Limited time offer" banner | We don't have limited-time pricing |
| Fake customer logos / "as seen in" placeholders | Trust destroyer |
| Faked counters ("4,200 audits run") | Won't fake any number, ever |
| Live chat widget | Wrong stage; solo builder can't staff it |
| Newsletter signup popup | We have no newsletter |
| "Featured by Google" / "Recommended by X" without truth | Same as fake logos |
| Modal popups | Off-brand for trust-first positioning |
| Hard-sell sticky banner | Trust-killer |
| Re-marketing pixel | No paid ads → no re-marketing |
| Annotations / tooltips on the score ring | Adds visual noise; the ring speaks for itself |
| Multiple competing primary CTAs ("Sign up" + "Get a demo" + "Talk to us") | One primary, period |
| Cookie banner beyond legal minimum | Privacy page is short and direct; banner shouldn't be longer than the privacy page |

---

## Final principle for homepage CRO

The homepage's job is to make the visitor want to **paste one URL**.

Every quick win, test idea, and copy variant in this document is
evaluated against that single goal. Anything that doesn't make the
paste more likely — cut.

If a CRO suggestion smells like generic SaaS-landing-page hygiene,
it's almost certainly wrong for SEO Terrain.
