# Brickwise Page CRO Audit — Pre-Launch

**Pages audited:** `/` (homepage), `/analyzer`, `/compare/realt-vs-lofty`

**Primary conversion goal hierarchy** (from `.agents/product-marketing-context.md`):
1. Email subscriber to The Brickwise Brief
2. Affiliate click to Lofty / RealT
3. Return visit (organic compounding)

**Traffic context:** HN / Reddit / IH cold traffic incoming. Today, near-zero baseline. Visitors will land mostly on homepage and `/analyzer`; comparison page gets long-tail SEO traffic.

---

## Homepage `/` (file: `app/page.tsx`)

### What's working

- Strong trust signals in viewport-1: "Independent analytics · No paid placements · Refreshed daily · No signup required"
- The "Curated · not scraped" green badge is excellent independence-signaling
- Coverage strip with live counts (`X properties tracked · X verified · X platforms · X buy signals`) is dense and credible
- "Best pick today" card with €1k return calculator is a conversion device done right
- "Properties to avoid" section embodies the anti-hype voice perfectly
- "Curated manually — no scrapers, no synthetic data" footer line is strong differentiation

### Hidden weaknesses

#### 1. H1 "What to do right now" fails the 5-second test for cold traffic

The H1 assumes the visitor already knows what Brickwise is. A cold HN visitor reads "What to do right now" and has no idea what THIS site does. It's an instruction without context.

**Quick win — replace H1.** Options to A/B test:

A. `Independent scoring for every tokenized rental on Lofty and RealT` (matches product-marketing-context one-liner)
B. `Should you buy this $50 property token? 460 rentals scored honestly.` (the audit-v2 suggested headline)
C. `What to do right now in tokenized real estate` (current H1, expanded for context)

Current "Decision Engine" eyebrow text is too jargon-y. Drop it or change to "Tokenized real estate analytics."

**Lowest-risk implementation:** Keep "What to do right now" as a section H2 farther down the page. Replace the page H1 with one of A/B/C above.

#### 2. Email capture is at the BOTTOM of a very long page

`<EmailCapture>` is the last content block before the footer. Cold HN traffic typically scrolls 30-50% before bouncing. They never see the capture.

**High-impact change:** Add a second compact email capture between the "Coverage strip" and "Best pick today" — viewport-2 placement. Same field structure (email only), shorter pitch: "Get the weekly Buy/Avoid scorecard. Free."

#### 3. The lead magnet is misnamed

Current capture heading: "Weekly market digest" with subtext "Top properties, yield changes, and buy signals."

The lead-magnet design doc named this **"The Brickwise Brief — Weekly Buy/Avoid Scorecard."** Use the named product, not the generic "digest" word the skill explicitly says to avoid.

**Quick win:** rename to "The Brickwise Brief" + subtext "3 buy candidates, 3 avoid signals. Every Monday."

#### 4. Trust links missing from viewport-1

The audit-v2 doc flagged "Methodology" + "About the analyst" as required trust signals before HN launch. They don't exist anywhere on this page (or anywhere on the site that I can see). The footer mentions methodology in a sentence but doesn't link to a page.

**Must do before HN:** add a `Methodology` and `About` link to the viewport-1 trust strip:
```
Independent analytics · Refreshed daily · Methodology · About the analyst
```

#### 5. "Reality check on your holdings" and "You could be earning more" hide for cold traffic

These sections only render if `HOLDINGS` is populated. Cold visitors see neither. Both are great for return users but invisible to first-time visitors — fine, just flagging that the page's "personalization" surface is dark for HN day.

**Test idea:** add a fallback for cold visitors. Instead of hiding the "Reality check" block, show a demo version with anonymized example data and a CTA: "Add your holdings to see this for your portfolio." That's a personalization wedge that drives engagement.

#### 6. No anchor to your contrarian story

The Reddit post leads with "30.9% yield, and I'd still avoid it." That's brand-anchor content. It's nowhere on the homepage as a featured surface. The "Properties to avoid" section is great but generic.

**Quick win:** add a hero callout above-the-fold or in viewport-2: "The highest-yield property right now scores 78/100. Here's why we still don't buy it." Link to that property page.

### Copy alternatives (homepage)

**H1 options:**
- A: `Independent scoring for every tokenized rental on Lofty and RealT`
- B: `Should you buy this $50 property token? 460 rentals scored honestly.`
- C: `Tokenized rentals, scored.`

**Subhead options:**
- A: `460+ properties tracked daily. 3 buys and 3 avoids in your inbox every Monday. No paid placements.`
- B: `One independent scoreboard for Lofty and RealT. No affiliation. No fluff. Free.`

**Email capture heading:**
- Current: `Weekly market digest`
- Proposed: `The Brickwise Brief`

**Email capture subtext:**
- Current: `Top properties, yield changes, and buy signals across all X listings — every Monday.`
- Proposed: `3 buy candidates, 3 avoid signals, scored across X tokenized rentals. Every Monday. Free.`

---

## Analyzer `/analyzer` (file: `app/analyzer/page.tsx`)

### What's working

- Live stats in the header are dense and credible
- ROI calculator strip ("If I invest €X → best monthly: €Y") is excellent engagement bait
- Compare mode flow is clean (select 2-3, side-by-side drawer)
- Pagination keeps the DOM lean (good for SEO)
- Three view modes (grid / list / chart) cover different exploration styles
- Filter reset button and empty state are polished

### Hidden weaknesses

#### 1. No email capture on the entire analyzer page

This is the single most-visited tool surface for a cold visitor and there's no way to leave an email. They explore, filter, find an interesting property, click out to Lofty / RealT (~10% will), and the other 90% bounce with zero recapture.

**Must do before HN:** Add an inline email capture surface, ideally:
- As a sticky sidebar element OR
- As a top-of-page band between the header and the ROI calculator OR
- As a "Save these filters as a watchlist (free, by email)" CTA inside the filter panel

The watchlist-via-email framing is the strongest because it ties capture to the user's current intent: "I want to track these specific properties."

#### 2. H1 "Property Analyzer" is descriptive but bland

It tells you what the page IS, not what it DOES for you. For someone who landed here via Google "tokenized real estate analyzer" search, the H1 should reinforce why this analyzer is the right one.

**Copy alternatives:**
- A: `Score every tokenized rental on Lofty and RealT`
- B: `460 tokenized rentals, scored on yield, risk, and fair value`
- C: `The independent analyzer for tokenized rental real estate`

#### 3. No first-time visitor explainer

First-time visitors drop into a filter UI with no orientation. The numeric stats are great if you already know what "Avg Yield" or "Buy signals" mean in this context. A new visitor doesn't.

**High-impact change:** Add a collapsible "How this works" banner that auto-shows for first-visit users:
```
This analyzer scores every active token on Lofty (Algorand) and RealT (Ethereum)
on a 0–100 composite: yield 30%, risk 25%, neighborhood 20%, fair value 25%.
Filter, sort, compare. We're independent — no affiliation with either platform.
[Read methodology] [Dismiss]
```

Use localStorage to remember dismissal.

#### 4. No re-engagement after filter empty state

Empty state CTA is "Reset filters" — practical but a lost opportunity. Add: "Or tell us what you're looking for" with a one-field email capture: "Email me when a property matches these filters."

#### 5. Compare drawer has no email anchor

When a user compares 2-3 properties, that's peak engagement. The compare drawer (`CompareDrawer`) is rendered but I haven't seen its source. Worth verifying it has an "Email this comparison to myself" or "Get weekly updates on these properties" CTA at the bottom.

#### 6. The €/month ROI calculator buries the killer use case

"If I invest €1,000 → best monthly: €X.XX from [property name] (Y%)" is fantastic. But the average user won't notice the small text. Make this loud — bigger font, contrasting color, animated number when they change the input.

### Test ideas (analyzer)

- A/B test: visible inline email capture (sticky top band) vs no capture (current state). Hypothesis: 5-10x email signups.
- A/B test: H1 wording (A vs B vs C above)
- Test: "Save this filter as a watchlist (free)" CTA with email field vs default no-capture. Hypothesis: 8-15% capture rate when paired with active filtering intent.
- Test: dismissable explainer banner for first-visit. Measure: scroll depth + filter changes + outbound clicks lift.

---

## RealT vs Lofty `/compare/realt-vs-lofty` (file: `app/compare/realt-vs-lofty/page.tsx`)

### What's working

This is the strongest of the three pages.

- H1 is explicit and search-intent-matched
- "Bottom line" verdict box is exactly the right pattern (TL;DR for skimmers)
- Side-by-side stat cards are visually clean and data-dense
- Feature comparison table with star winners is excellent
- "Top Buy Signals Right Now" section drives commercial intent toward property pages
- "Which Platform Is Right for You?" decision matrix is conversion gold (matches user JTBD scenarios directly)
- Pros and cons sections are bidirectional and honest
- FAQ section is comprehensive and matches the JSON-LD FAQPage schema
- Bottom CTA "Open Analyzer →" is clear

### Hidden weaknesses

#### 1. The "Bottom line" verdict is positioned AFTER the page header text

The header has eyebrow + H1 + subhead, THEN the verdict box. Most CRO research on comparison pages says: put the verdict FIRST. The reader who came via Google "realt vs lofty" wants the answer before the framing.

**High-impact change:** Move the "Bottom line" verdict box ABOVE the H1, as the first thing the reader sees. Keep the H1 and subhead for SEO and breadcrumb consistency, but the user's eye-magnet should be the verdict.

Or: keep H1 first but compress it. Currently 2-line H1 ("RealT vs Lofty: Which Tokenized Real Estate Platform Is Better?") pushes the verdict out of viewport-1 on smaller screens.

#### 2. No email capture anywhere on this page

A user reading "RealT vs Lofty" deeply enough to scroll to the FAQ has very high commercial intent. They are deciding right now. No email capture = leaving conversion on the table.

**Must do before HN:** Add an inline email capture between "Top Buy Signals Right Now" and "City Coverage" — that's the peak-intent breakpoint. Pitch: "Want monthly RealT vs Lofty updates? Get the Brief — free."

#### 3. CTA at the bottom is single-purpose

"Open Analyzer →" is a great secondary CTA but a poor primary on a comparison page. The reader has just consumed 600+ words deciding which platform to use. Asking them to "open the analyzer" is asking them to start over.

**High-impact change:** Add a second CTA next to "Open Analyzer":
- Primary (left): "Get the weekly Brief →" (email capture)
- Secondary (right): "Open Analyzer →" (current button)

Or split based on intent:
- "Compare individual RealT properties →" (filters analyzer to RealT)
- "Compare individual Lofty properties →" (filters analyzer to Lofty)

#### 4. Each row in the decision matrix could link to the analyzer with pre-set filters

"You want to be able to exit your position quickly → Lofty" should be clickable to `/analyzer?platform=Lofty&sort=score`. Same for the other rows. Currently the recommendation is text only.

#### 5. Affiliate disclosure not present

The page recommends one platform over another in different scenarios. Per product-marketing-context, affiliate disclosure is in the objections table. But it's not visible on the page itself. After "Not financial advice. Always verify..." add: "Brickwise earns a referral fee if you sign up via our affiliate links on the platform pages. Scores and recommendations are not influenced by referral revenue."

This is a trust win, not a trust loss. Hiding it looks worse than showing it.

#### 6. Min token price uses two currencies

The table shows "Min. investment" as `$5` (RealT) and `$50` (Lofty), but elsewhere on the site you use €. Consistency check: either use one currency throughout or show both. The mismatch is jarring.

### Test ideas (comparison page)

- A/B test: verdict-above-H1 vs current layout. Hypothesis: verdict-above lifts time-on-page and FAQ-scroll-depth.
- A/B test: add inline email capture mid-page vs current no-capture state. Hypothesis: 6-12% capture rate.
- Test: dual CTA at bottom (Brief + Analyzer) vs single Analyzer CTA. Hypothesis: brief CTA wins on capture, Analyzer CTA loses ~20% clickthrough but overall conversion value rises.

---

## Cross-page must-do before HN launch

1. **Rename email capture from "Weekly market digest" to "The Brickwise Brief"** sitewide
2. **Add email capture to `/analyzer`** (single biggest CRO gap on the site)
3. **Add email capture to `/compare/realt-vs-lofty`** between Top Buy Signals and City Coverage
4. **Add a viewport-2 email capture to the homepage** (currently only at the bottom)
5. **Build `/methodology` page** and link from every page's trust strip
6. **Build `/about` page with author byline** and link from footer
7. **Add affiliate disclosure** to comparison page and footer
8. **Replace homepage H1** "What to do right now" with one that explains the product

## Cross-page should-do (post-launch, 1-2 weeks)

9. Move comparison-page verdict above H1
10. Add first-time-visitor explainer to `/analyzer`
11. Add "Save these filters" lead-capture CTA in analyzer
12. Add "Watch this property" email capture on `/property/[id]` pages
13. Add personalization fallback for homepage "Reality check" section (demo data for cold visitors)

## Don't bother changing (already strong)

- The "Best pick today" card design
- The Properties to Avoid grid
- The Rankings 4-column grid
- The category breakdowns (city / yield / risk)
- The CompareDrawer flow (assuming it doesn't have its own gaps — worth a separate read)

---

## Single highest-leverage CRO fix before HN

**Wire email capture on `/analyzer`.** The analyzer is where curious visitors spend the most time. It has zero capture currently. A sticky sidebar form or in-filter-panel "save as watchlist" CTA would turn the analyzer from a pure browsing surface into a high-intent capture funnel.

This single fix likely 5-10x's the email capture rate from launch traffic, because the analyzer is where curious-and-considering visitors land and engage longest.
