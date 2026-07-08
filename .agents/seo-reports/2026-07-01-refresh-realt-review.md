# Refresh Brief: `/learn/realt-review`

**Date**: 2026-07-01  
**Routine**: seo-routine / monthly-refresh  
**File**: `app/learn/realt-review/page.tsx`  
**Last git edit**: 2026-05-16 (46 days ago)  
**Primary keyword**: "RealT review" / "is RealT legit"  
**H1**: "RealT Review {currentYear}" (dynamic)

---

## Age note

46 days old. **Early-watch candidate** for the same reason as lofty-review: platform data on an investment product (yields, property count, fee structure, DeFi integrations) goes stale faster than category education. First formally eligible: **2026-08-14**.

---

## Current angle

"Data-driven platform review" with live stats pulled from PROPERTIES (count, avgYield, maxYield, buyCount). Structure: stats bar → what is RealT → yields table → fee structure → pros/cons → verdict → email capture → FAQ.

The page's data-driven stats bar is one of its strongest elements — it shows live tracked data, not marketing claims. The editorial sections (pros/cons, DeFi description, verdict paragraph) are static and will drift from reality.

---

## Current SERP intent

Brand-research intent: users are evaluating RealT before investing. They want to know: "is it legit?", "what does it actually pay?", "how do I exit?", "how does this compare to what RealT says about itself?". SERP for "is RealT legit" likely includes Reddit threads, RealT's own documentation, and generic investment review sites. Brickwise has a third-party analytics advantage that no competitor page can replicate: we're citing our own tracked dataset, not rephrasing RealT marketing copy.

Live SERP fetch unavailable (403). Treat intent analysis as directional.

---

## Proposed new H2 sections

1. **"RealT RMM (Real Token Money Market): What You Can Do With Your Tokens"**  
   Missing entirely from current review. SEO_INTELLIGENCE.md lists "RealT RMM" as a target keyword (cluster C). RMM lets token holders use RealT tokens as collateral for USDC loans. This is a major DeFi differentiator that justifies the "DeFi power users" use case but is currently only referenced obliquely in the Cons list. Target: "realt rmm", "realt lending", "realt collateral".

2. **"What Happens If a RealT Property Goes Vacant?"**  
   High-anxiety question missing from FAQ and main content. Currently the cons list mentions "Property vacancies can drop income to $0" in one line. A dedicated H2 covering: vacancy rates across the dataset, what the LLC structure means for vacancy risk, whether RealT offers any vacancy protection, and what has historically happened with vacancies would surface the downside explicitly (passes downside test) and capture "realt vacancy" and "tokenized real estate vacancy risk" queries.

3. **"Is RealT Available Outside the US?"**  
   Currently noted only in passing: "Limited non-US investor access on some properties." This is a high-frequency FAQ question for international investors. Deserves its own H2 with specifics on which countries can access RealT, what documentation is required, and what restrictions apply.

4. **"How to Sell RealT Tokens: Uniswap, Secondary Market, and Liquidity Realities"**  
   Current content covers liquidity at the FAQ level. A dedicated section with step-by-step exit mechanics, typical slippage ranges, gas fee estimates, and realistic timelines for exiting a position would convert high-intent "how do I exit RealT" searchers.

5. **"RealT Property Breakdown: Which Cities Are Represented?"**  
   Missing from current page. Should cover the city distribution within the RealT catalog on Brickwise, concentration risk, and link to relevant city pages. Targets "realt detroit properties", "realt chicago properties".

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/city/detroit` — "Detroit represents {TODO: % of RealT catalog} of all RealT properties on Brickwise"
- `/rankings/highest-yield` — "The current highest-yielding RealT property on Brickwise scores..."
- `/compare/realt-vs-lofty` — already linked; confirm anchor text is specific (not generic "comparison")
- `/compare/realt-vs-fundrise` — add link in the "who is RealT for" verdict section
- `/methodology` — add "how we score" inline reference when mentioning avgScore

**Link TO this page FROM:**
- `/compare/realt-vs-lofty` — should reference "full RealT review" with exact URL; check current implementation
- `/learn/page.tsx` (learn hub) — verify it's in the hub index with a one-line descriptor
- `/algorand/page.tsx` — does NOT link here (correct; RealT is Ethereum, not Algorand)
- `/platform/realt/page.tsx` — check if platform hub page exists and if so, whether it links back

---

## Stat and data refresh points

| Location | Current claim | Refresh trigger |
|----------|--------------|-----------------|
| Overview paragraph | "founded in 2019... the largest by total property count" | Verify RealT is still the largest tokenized RE platform by count {TODO: verify current Lofty vs RealT property count on brickwise.pro/analyzer} |
| Cons list | "Lower liquidity vs Lofty — no PMM mechanism" | Verify RealT hasn't introduced a liquidity mechanism since May 2026 {TODO: check realt.co changelog} |
| Cons list | "Ethereum gas fees when trading tokens" | Verify whether RealT has moved any tokens to Gnosis Chain (layer 2) which has near-zero gas {TODO: check} — if so, update to reflect dual-chain reality |
| Cons list | "Higher minimum investment (~$50–200+ per token)" | Check current minimum from RealT — token prices drift {TODO: current range from PROPERTIES data} |
| Verdict paragraph | "broad geographic diversification... 40+ US cities" | Verify current city count from PROPERTIES data {TODO: count distinct RealT cities} |
| FAQ | "RealT has been operating since 2019" | Remains accurate; verify no major regulatory/operational events since May 2026 |
| FAQ | "Tokens can be sold on the RealT Marketplace or on Uniswap" | Verify Uniswap/secondary market still active {TODO: check realt.co secondary market status} |

**Gnosis Chain note**: RealT has historically operated on both Ethereum and Gnosis Chain. The current page describes Ethereum without mentioning Gnosis. If a significant share of RealT tokens are on Gnosis Chain (which has ~$0 gas fees), the Cons item about "Ethereum gas fees" may be misleading. Human should verify current chain breakdown before the next edit.

---

## Who writes this

Human author using this brief. Maintain the analytical, skeptical tone — surface vacancies and liquidity limits explicitly. Do not soften the cons. Do not add generic "Web3 is changing everything" framing. One number or specific address in the opening paragraph.
