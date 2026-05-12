# Brickwise Lead Magnet — Design & Build Plan

**Goal of the magnet:** Convert pre-launch cold traffic (HN, Reddit, organic SEO) into recurring email subscribers. Establish return-visit habit. No paid-tier pretense yet.

**Constraint set:** Must ship in 3-5 days, match the skeptical/anti-hype voice, leverage Brickwise's daily-data unfair advantage, avoid sounding like a generic crypto pump newsletter.

---

## 1. Recommendation

**The magnet: "The Brickwise Brief — Weekly Buy/Avoid Scorecard for Tokenized Rentals"**

A weekly email auto-generated from the existing scoring engine. Single format (email), single offer, no PDF, no course, no spreadsheet. Embeds the brand's defining behavior: it surfaces BOTH buy candidates and avoid signals every week.

**Why this format over alternatives:**

| Alternative | Why rejected |
|---|---|
| "Top 10 Buy Signals" PDF | Contradicts anti-hype voice. Pure-upside framing creates expectations Brickwise then has to walk back. |
| "15 Red Flags" PDF (risk-only) | One-time consumption. No return habit. Wastes the daily-data advantage. |
| "RealT vs Lofty" comparison PDF | Duplicates an existing public page. Adds friction for content that should stay free + indexed. |
| Interactive "Score My Property" tool | Strong concept but requires real engineering. Magnet should ship in days, not weeks. Park for Phase 2. |
| Weekly newsletter (buy-only) | Same anti-hype problem. Lower trust. |

**Stage of the buyer journey:** Awareness/Consideration. Cold visitor lands from HN, sees independent scoring, signs up to see weekly picks. Trust compounds over 4-8 weeks of seeing the Brief land.

**Estimated build effort:** 8-16 hours total. No new content production. Reuses existing scoring engine + a single email template.

---

## 2. Content outline (per weekly issue)

Every Brief follows the same 6-block format. Same structure each week so subscribers know what they're getting:

1. **One-line market line** — e.g., "Average yield ticked down 0.2 points this week. Detroit concentration steady at 37%."

2. **3 Buy Candidates this week** — top 3 properties by composite score this week. For each: address, platform, score, current yield, the single biggest score driver. One sentence each.

3. **3 Avoid Signals this week** — 3 properties that scored low OR have red-flag patterns (vacancy creep, yield-too-high-for-area, neighborhood downgrade). For each: address, platform, score, the single biggest red flag. One sentence each.

4. **Data finding of the week** — one short paragraph on something the data revealed. Examples: "Lofty's PMM saw the largest one-week spread widening since August"; "New Cleveland listings have higher avg yield than existing Cleveland inventory"; "Properties listed within 60 days score 4 points higher on average than listings older than 12 months."

5. **One link to a Brickwise page** — rotating: a learn article, a comparison page, a city hub, a ranking. Drives return visits.

6. **One-line methodology reminder** — single line under footer: "Scoring weights: yield 30%, risk 25%, neighborhood 20%, fair value 25%. Read the full methodology." Linked to the methodology page.

**Total reading time:** under 3 minutes. Hard cap on length.

**Tone:** "30.9% yield, and I'd still avoid it" applied to every Avoid block.

**Output format:** Single-column responsive email. No graphics beyond a small brand mark in the header. Plain text version mirrors HTML version.

---

## 3. Gating & capture plan

### What to ask for at signup
- **Email only.** Nothing else. Per skill: each extra field costs 5-10% conversion. At pre-launch traffic levels, every percentage point matters.
- Single-step form. No multi-page wizard. No "what's your role" qualifier.

### Where the capture form lives

| Surface | Treatment | Priority |
|---|---|---|
| Homepage (above the fold) | Inline form after the analyzer CTA. Headline: "Free weekly buy/avoid scorecard." | P1 |
| `/rankings/highest-yield` and other ranking pages | Inline form mid-page. Contextual: "Get this scorecard weekly." | P1 |
| `/property/[id]` pages | End-of-page form: "Get weekly buy signals like this in your inbox." | P2 |
| Footer of every page | Always-visible. Single field. | P1 |
| Exit-intent popup (desktop) | Triggered on cursor-leave only. Mobile: scroll-50% trigger. Throttle: once per 7 days per visitor. | P2 |
| HN/Reddit landing page (optional) | `/from-hn` / `/from-reddit` with welcome message and prominent form. | P3 |

### The headline language to test first

Lead with: **"The Brickwise Brief"** subhead **"3 buy candidates and 3 avoid signals every week, scored across 460 tokenized rentals. Free. No fluff."**

Alternative to A/B test later:
- "Get the weekly scorecard the platforms can't publish about themselves."
- "We score every Lofty and RealT property weekly. You see the 3 best and 3 worst. Free."

### Risk-reduction language under the form

Single line: "Weekly email. Unsubscribe in one click. No spam, no upsells. Just the data."

Do NOT include "we'll never share your email" — that's a phrase trust-erodes more than it builds.

---

## 4. Delivery flow

### On signup (within 2 minutes)

**Email 1 — "You're in"** — confirms signup, sets expectations, embeds the most recent Brief edition as the welcome content. Subject: "You're in. Here's this week's scorecard."

Why embed instead of "you'll get the next one Monday": subscriber gets instant value. No waiting. Sets format expectation immediately.

### Day 3

**Email 2 — Methodology**. Subject: "How the scores work." Body: 200-word plain-English explanation of the 30/25/20/25 weights, what each input measures, why fair value matters. Link to the full methodology page. End with: "Reply with one question you'd want answered in next week's Brief."

Why this email: trust-builder + light feedback loop. Reply rate is a leading indicator of subscriber quality.

### Day 7 onward — Weekly Brief

Send every Tuesday at 9am US Eastern (Reddit traffic peaks Tue/Wed mornings, matches launch-post timing).

### Day 14

**Email 3 — soft engagement check**. Subject: "Should I keep sending these?" Body: 80 words. Single CTA: "Reply 'yes' to stay subscribed. No reply needed if you want to keep getting them either way." This is a self-segmenting move — high-intent subscribers reply, dead emails stay quietly subscribed.

---

## 5. Distribution plan

### Pre-launch (this week, before HN posts)

1. Wire the capture form across all P1 surfaces (homepage, ranking pages, footer)
2. Build the first Brief by hand using current data (will be the "embed-on-signup" welcome content)
3. Schedule cron to auto-generate next week's Brief
4. Wire Resend or Postmark for send-from `growth@brickwise.pro` (per handoff section 8)
5. Set up SPF/DKIM/DMARC so emails land in inbox, not spam (verify with mail-tester.com)
6. Add "Subscribe to the weekly scorecard" line to every launch post body before posting

### Launch wave amplification

- Reddit post bodies: bare mention of the brief at the end, no link ("brickwise.pro has a free weekly scorecard if anyone wants the data")
- HN post body: optional one-line mention near the bottom
- @BrickwisePro thread: one tweet in the pinned thread mentioning the Brief
- YouTube Shorts: caption + final card mentions "weekly scorecard, link in description"

### Post-launch distribution

- Add a one-line CTA to every blog post and learn article
- Add a contextual content-upgrade form to each comparison page: "Get next month's RealT-vs-Lofty update in the Brief"
- Cross-mention in monthly market reports at `/market/[date]`
- Use as the closing line in Reddit comment replies on tokenized-RE threads (sparingly, only when contextually relevant)

### Channels NOT to use yet
- Paid ads — no LTV data
- Influencer outreach — premature
- Affiliate-program co-promotion — Brickwise is the affiliate, not the merchant

---

## 6. Measurement plan

### KPIs to track from day one

| Metric | Target range | What it tells you |
|---|---|---|
| Form view to signup rate (homepage) | 2-6% cold traffic; 8-15% post-HN | Form is positioned right and headline lands |
| Form view to signup rate (ranking pages) | 8-20% | Contextual relevance |
| Welcome email open rate | 60-80% | Email is actually being delivered to inbox |
| Brief open rate (week 1 onward) | 35-55% | Subject line + sender reputation |
| Brief click rate | 4-10% | Content is engaging, links are well-placed |
| Reply rate to Day 3 methodology email | 1-4% | Quality of subscriber (high-intent leads reply) |
| 14-day unsubscribe rate | under 8% | Magnet matched expectations |

### First A/B test (after 100 signups)

Test **form headline only**:
- A: "The Brickwise Brief"
- B: "Weekly Buy/Avoid Scorecard"

Run for 2 weeks or until each variant has 200 form views, whichever comes first. Statistical significance threshold: 95%.

Do NOT A/B test before you have 100 signups. Sample size too small. Optimize gut, not data, until then.

### Second A/B test (after 500 signups)

Test **subject line of Day 3 methodology email**:
- A: "How the scores work."
- B: "Why a 30% yield can still be a bad buy."

---

## 7. What ships in week 1 vs later

### Week 1 — must ship before HN post
- Email-only form on homepage + footer + at least 2 ranking pages
- First Brief hand-built and saved as the welcome content
- Resend/Postmark wired with SPF/DKIM/DMARC clean
- Welcome + methodology emails written and queued
- Unsubscribe flow tested

### Week 2-3 — should ship
- Cron-based auto-generation of weekly Brief
- Exit-intent popup
- Contextual upgrades on comparison pages
- Day 14 engagement-check email

### Week 4+ — can wait
- Segmentation by signup source (HN vs Reddit vs organic)
- A/B testing infrastructure
- "Reply with a question" email handling
- Optional preferences (frequency, region filter)

---

## 8. Anti-patterns to avoid

- Do not call it a "newsletter." Call it "the Brief" or "the weekly scorecard."
- Do not add a download button for a PDF version. Single format = email. Reducing options reduces friction.
- Do not gate the methodology page. It must be public for SEO and trust.
- Do not include personal-finance disclaimers in every email — one sentence in the footer is enough.
- Do not pump the highest-yield property as a "buy" if the score doesn't support it. Brand voice depends on this discipline.
- Do not include affiliate links inside the Brief content body. Affiliate links live on property pages, not in editorial content. Mixing them poisons trust.

---

## 9. Single highest-leverage launch action

Wire the form on the homepage + footer + ranking pages, hand-build the first Brief, and have the welcome email firing — all before the HN post goes live. Skipping this means the HN traffic spike captures 2% of visitors instead of 10%. That delta is the difference between 100 subscribers and 500 subscribers from the same launch event.
