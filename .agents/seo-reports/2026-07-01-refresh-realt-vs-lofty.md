# Refresh Brief: `/compare/realt-vs-lofty`

**Date**: 2026-07-01  
**Routine**: seo-routine / monthly-refresh  
**File**: `app/compare/realt-vs-lofty/page.tsx`  
**Last git edit**: 2026-05-16 (46 days ago)  
**Primary keyword**: "realt vs lofty" / "lofty vs realt"  
**H1**: (check live page — source uses dynamic metadata)

---

## Age note

46 days old. **Early-watch candidate** and strategically the most important page on Brickwise. SEO_INTELLIGENCE.md calls this page "the single highest-leverage SEO move" with "zero authoritative competitors." It is the highest commercial-intent public page and the most likely to be discovered by mid-funnel users ready to open an account. Any staleness here directly impacts affiliate conversion. First formally eligible for 90-day refresh: **2026-08-14**.

---

## Current angle

"Independent data-driven platform comparison." The page uses live PROPERTIES data to show side-by-side platform averages (realtAvgYield, loftyAvgYield, realtMaxYield, loftyMaxYield, avgScore per platform). The metadata description dynamically inserts the total property count.

Source shows the page also imports `getRecommendation` from `@/lib/recommendations` — this suggests the page renders a recommendation output somewhere. Human should check whether the recommendation logic is still current and whether the stated winner/recommendation reflects current data.

---

## Current SERP intent

Decision-stage comparison: users have already researched both platforms and want a clear recommendation ("which one should I use?"). They want:
- Feature table (blockchain, minimum, payout frequency, liquidity)  
- Yield data (real, not marketing claims)  
- Use-case segmentation ("Lofty if you want X, RealT if you want Y")  
- Explicit winner calls with caveats  

The "best for" framing matters more here than on the review pages. SERP for "realt vs lofty" likely includes: platform marketing pages (biased), Reddit threads, and generic finance comparison sites without live data. Brickwise's differentiation is live yield data + independent scoring.

Live SERP fetch unavailable (403). Verify current SERP manually.

---

## Proposed new H2 sections

1. **"Tax Treatment: RealT vs Lofty"**  
   Entirely missing from current page. Tax treatment of tokenized RE income is a top-anxiety question for mid-funnel investors — it directly affects their comparison. A section covering: K-1 vs 1099 implications, basis tracking, how Algorand vs Ethereum transactions are treated, and links to "tokenized real estate taxes" content (content gap identified in SEO_INTELLIGENCE.md) would be high-value. Target: "realt taxes", "lofty tax treatment", "tokenized real estate K-1".  
   **Note**: Do NOT give tax advice. Frame as "what each platform reports, what questions to bring to your tax advisor." Use `{TODO: verify current 1099/K-1 treatment for each platform}` for specific regulatory details.

2. **"Which Platform Has Better Properties Right Now? (Live Data)"**  
   The page shows yield averages but may not highlight the current state of the distribution (e.g., "As of today, Brickwise tracks {TODO: N} Lofty properties with a buy signal vs {TODO: N} RealT"). A dynamic section linking to current rankings would increase click-through to the analyzer. Target: "best realt vs lofty properties", "which platform has higher yields today".

3. **"Portfolio Strategy: Should You Use Both Platforms?"**  
   Missing from current page. Many investors will hold both (complementary: Lofty for daily income + PMM liquidity; RealT for DeFi integration + geographic breadth). A section explicitly addressing this reduces zero-sum framing and opens internal link to `/analyzer` with a multi-platform filter. Target: "realt and lofty together", "diversify across tokenized platforms".

4. **"Common Switching Point: When to Move From Lofty to RealT (or Vice Versa)"**  
   Addresses users who already hold one platform and are evaluating the other. "I have $2,000 in Lofty, should I add RealT?" Specific, actionable, and captures long-tail queries about platform migration. Links naturally to the platform reviews.

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/learn/lofty-review` — "full Lofty review with yield tier breakdown" (confirm currently linked)
- `/learn/realt-review` — "full RealT review with fee analysis" (confirm currently linked)
- `/rankings/highest-yield` — "current highest-yield properties across both platforms"
- `/rankings/buy-signals` — "current buy signals on Brickwise, filterable by platform"
- `/algorand` — for users who want to understand the Algorand ecosystem before choosing Lofty
- `/methodology` — "how Brickwise scores properties: 30% yield, 25% risk, 20% neighborhood, 25% fair value"
- New content gap: `/learn/tokenized-real-estate-taxes` (doesn't exist yet; note as "coming soon" or create as part of this refresh)

**Link TO this page FROM:**
- `/learn/lofty-review` → already linked ("see the full RealT vs Lofty comparison")
- `/learn/realt-review` → already linked
- `/page.tsx` (homepage) → check if comparison page is in homepage navigation/featured links
- `/rankings/highest-yield` — add "How do RealT and Lofty compare overall? See our full platform comparison" CTA
- `/algorand/page.tsx` — "For a head-to-head comparison of Lofty (Algorand) vs RealT (Ethereum), see our platform comparison"

---

## Stat and data refresh points

Most yield stats on this page auto-update from PROPERTIES. Focus refreshes on editorial claims:

| Location | Current claim | Refresh trigger |
|----------|--------------|-----------------|
| Comparison table | "DeFi integration: Limited (Lofty) vs Extensive (RealT)" | Verify if Lofty has added DeFi integrations since May 2026 {TODO: check lofty.ai changelog} |
| Comparison table | "Property catalog: Smaller (Lofty) vs Larger (RealT)" | Auto-calculable from PROPERTIES — confirm code reflects current filter logic |
| Comparison table | "Minimum investment: $50 (Lofty) vs ~$15–200+ (RealT)" | RealT token prices change. Pull current min from PROPERTIES for RealT {TODO: current RealT min token price} |
| `getRecommendation` output | Platform-level recommendation | Review the recommendation logic in `@/lib/recommendations` — does it weight fairly? Has data changed enough to shift the recommendation? |
| OG metadata | `publishedTime: "2026-02-01"` | Note: page was apparently drafted before Feb 2026 according to this field but committed May 2026. If the page was actually written in May 2026, correct the publishedTime to reflect the actual publication date |
| All yield numbers | realtAvgYield, loftyAvgYield, etc. | These compute from PROPERTIES at runtime — no manual update needed, but verify the filter logic correctly identifies each platform |

---

## Who writes this

Human author. This is the single highest-stakes content page on the site. Tone must be explicitly neutral and data-backed. Do not name a "winner" without data backing. Do not soften cons for either platform. The independence statement is most visible here — do not weaken it.
