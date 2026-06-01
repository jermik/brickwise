# Refresh Brief: `/compare/best-fractional-real-estate-platforms`

**File:** `app/compare/best-fractional-real-estate-platforms/page.tsx`  
**Last git commit:** 2026-05-11  
**Age:** 21 days  
**Priority:** High — SERP competition has intensified; page coverage is now incomplete

---

## Current angle vs SERP intent

**Current page angle:** Five-platform comparison — Lofty, RealT, Fundrise, Arrived, Ark7. Comparison table (type, minimum, distributions, liquidity). "Who each platform is best for" section. Tokenized vs REIT-style explainer.

**What SERP shows searchers want for "best fractional real estate platforms 2026":**
- SERP now shows 7–10 platform roundups, many covering 6–10 platforms (Benzinga: "6 Best Fractional Real Estate Investment Platforms", Fraxioned: "7 Best", fractionalpropertyhub.com: "50+ platforms")
- Mogul (founded by ex-Goldman Sachs executives, 18.8% avg returns claim) is appearing in new roundups not in the current Brickwise comparison
- Arrived Homes exited properties showing 18.60% average returns on 173 sales — a strong new data point the page doesn't mention
- RealT's operational crisis is now a significant negative signal that affects its ranking; the current table lists RealT without any qualification
- "Best for beginners" framing is heavily used across SERP competitors — Brickwise's table lacks a dedicated beginner recommendation
- Searchers at this query have **high commercial intent** — they want a clear winner recommendation, not just a feature table

**Gap:** The page currently treats all five platforms neutrally. Given the RealT crisis, listing "Weekly (USDC)" under Distributions for RealT is factually wrong. More broadly, the page would benefit from:
1. An explicit "best overall" / "best for beginners" / "best for DeFi" verdict box
2. Updated RealT status
3. Considering whether any new entrant (Mogul, Fraxioned) should be added or noted

---

## Proposed new H2 structure

Current H2s:
1. *(no H2 intro — jumps straight to comparison table)*
2. Who each platform is best for
3. Tokenized vs REIT-style: the core trade-off
4. Deeper, data-backed comparisons *(links block)*
5. Frequently asked questions

**Proposed revised structure:**

1. **Our Rankings at a Glance** ← new opening section; short verdicts for "best overall", "best for beginners", "best for DeFi users", "most stable long-term" — gives the SERP snippet Google wants
2. Platform comparison table *(keep — but update RealT distribution row; add footnote for current RealT status)*
3. Who each platform is best for *(keep, revise RealT card to note distribution suspension)*
4. Tokenized vs REIT-style: the core trade-off *(keep)*
5. **How we rank fractional real estate platforms** ← new; 3–4 sentence methodology note for credibility (trust signal, LLM citation target)
6. Deeper, data-backed comparisons *(keep)*
7. Frequently asked questions *(update: add "Is RealT still a good investment in 2026?" and "What happened to RealT?" since that is now a top SERP question in this cluster)*

---

## Key stat/data refresh points

- `{TODO: stat}` — Arrived Homes exited properties return figure: verify the "18.60% average return on 173 sales" claim independently (per Arrived's own investor reporting) before including
- `{TODO: stat}` — Fundrise historical range: per SERP, individual years ranged -7.45% (2023) to +22.99% (2021) — verify these figures from Fundrise's own disclosures before adding to the table
- `{TODO: stat}` — RealT Distributions row must be updated: "Suspended (Feb 2026)" or "Paused — see RealT review for status" — do not leave as "Weekly (USDC)"
- `{TODO: decision}` — Should Mogul be added as a 6th platform? Mogul now appears in competitor roundups. If added, its claims (18.8% avg returns, Goldman-founded) must be attributed and caveat-noted, not taken at face value
- The existing data for Lofty and RealT (type, minimum, distributions, liquidity, geo) is pulled from static constants in the page — needs manual verification against each platform's current docs, not just the original launch values

---

## Tone guidance

This page is competing against pure affiliate roundups (Benzinga, NerdWallet-style sites). Brickwise's edge is independence plus live data on Lofty/RealT. The new "How we rank" section should make this explicit: "We track Lofty and RealT properties live. Fundrise, Arrived, and Ark7 figures are from each platform's current public documentation."

Do not write superlative language ("best platform in 2026"). Do write specific verdicts tied to investor type ("If you want daily payouts and low minimums: Lofty. If you want hands-off diversification: Fundrise. If you want individual property exposure without crypto: Ark7.").

---

## Internal-link opportunities

**Links TO this page** (add or strengthen):
- Homepage — this is a high-intent commercial page; it should be linked from the homepage nav or a "compare platforms" widget
- `/learn/what-is-tokenized-real-estate` — add a "ready to pick a platform?" link pointing here
- All individual platform review pages (`/learn/lofty-review`, `/learn/realt-review`) should link back with anchor text like "see how Lofty ranks in our platform comparison"

**Links FROM this page** (already present — verify still accurate):
- `/compare/realt-vs-lofty` ✓
- `/compare/lofty-vs-arrived` ✓
- `/compare/realt-vs-fundrise` ✓
- `/learn/lofty-review` ✓
- `/learn/realt-review` ✓

Consider adding: `/rankings/highest-yield` — anchor text "see which tokenized properties score Buy right now"

---

## Schema notes

Current schemas: Article, FAQPage, BreadcrumbList — all appropriate. No structural changes needed. The Article schema's "about" field lists organizations from the platforms array — verify names match current canonical platform names.

---

*Brief written 2026-06-01 by seo-routine. Human writes the actual refreshed copy.*
