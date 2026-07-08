# Refresh Brief: `/compare/best-fractional-real-estate-platforms`

**Date**: 2026-07-01  
**Routine**: seo-routine / monthly-refresh  
**File**: `app/compare/best-fractional-real-estate-platforms/page.tsx`  
**Last git edit**: 2026-05-16 (46 days ago)  
**Primary keyword**: "best fractional real estate platforms" / "best tokenized real estate platforms 2026"  
**H1**: (check source — not yet read fully)

---

## Age note

46 days old. **Early-watch candidate.** This page targets a high-volume, high-commercial-intent keyword ("best fractional real estate platforms") where competitors like Arrived Homes, Fundrise, and Roofstock publish their own content. The five platforms covered (Lofty, RealT, Fundrise, Arrived, Ark7) each update their products, fees, and minimums regularly. Static editorial content on this page will diverge from reality. First formally eligible: **2026-08-14**.

---

## Current angle

Editorial comparison of five platforms (Lofty, RealT, Fundrise, Arrived, Ark7) with a structured `PlatformRow` interface. Source code shows a comparison table with: name, type (Tokenized / REIT-style / Hybrid Securities), minimum, distributions, liquidity, geo coverage, bestFor, and optional link. The page is set to `revalidate = 86400` (daily ISR rebuild).

---

## Current SERP intent

Commercial intent: users are at the platform-selection stage. They want:
- Ranked list or comparison table
- Clear criteria (not just features — "best for X type of investor")
- Third-party perspective not written by any of the platforms
- Transparent methodology for why each platform appears on the list

SERPs for this query likely include Fundrise's blog, NerdWallet, Forbes Advisor, and platform-aggregator listicles. Brickwise's differentiation: independent scoring of tokenized platforms, live yield data for Lofty + RealT, and explicit "avoid" signals missing from all competitor pages.

Live SERP fetch unavailable (403). Verify manually.

---

## Proposed new H2 sections

1. **"Tokenized vs REIT-Style Platforms: What's Actually Different?"**  
   The current table includes a "type" column (Tokenized / REIT-style / Hybrid) but likely doesn't explain what this distinction means for the investor. A 150–200 word H2 covering: legal structure differences (LLC membership vs fund shares), liquidity implications, tax treatment differences, and DeFi accessibility would capture "tokenized real estate vs REIT" queries and serve users who are deciding between both categories. Internal link to `/learn/what-is-tokenized-real-estate`.

2. **"Platform-by-Platform Risk Assessment"**  
   Currently missing a risk dimension. Fundrise and Arrived are REIT-style — their risk profile is different from Lofty/RealT (platform risk vs property-level risk, fund NAV vs token price, etc.). A section comparing downside scenarios for each platform type would serve the "is fractional real estate safe?" and "fractional real estate risks" queries. Must surface explicit downsides for each platform (tone test: downside present).

3. **"Which Platform for Which Investor Type? (Decision Matrix)"**  
   The `bestFor` field in the current table is one line per platform. A decision matrix format (investor profile → recommended platform + reason) would capture long-tail queries like "should I use Fundrise or Lofty", "best platform for beginners fractional real estate", "fractional real estate for crypto investors". Matrix rows: total beginner, crypto-native investor, traditional investor who hates wallets, passive-income-focused, DeFi user, international investor.

4. **"Platforms We Intentionally Left Off This List (and Why)"**  
   What about Roofstock? Groundfloor? Republic Real Estate? A short "honorable mentions and exclusions" section builds credibility (shows Brickwise evaluated the whole landscape, not just 5 convenient ones) and can capture traffic for each excluded platform name. Target: "roofstock vs lofty", "groundfloor fractional real estate".

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/learn/lofty-review` — "Read our full Lofty review with yield and fee data"
- `/learn/realt-review` — "Read our full RealT review"
- `/compare/realt-vs-lofty` — "Compare RealT and Lofty head-to-head"
- `/compare/lofty-vs-arrived` — for users drilling down on specific pairs
- `/compare/realt-vs-fundrise` — for users interested in the tokenized vs REIT comparison
- `/rankings/highest-yield` — "See which individual properties across Lofty and RealT are scoring highest right now"
- `/methodology` — "How Brickwise scores tokenized properties"

**Link TO this page FROM:**
- `/compare/realt-vs-lofty` — "See how RealT and Lofty rank against all fractional real estate platforms"
- `/page.tsx` (homepage) — check if this comparison appears in homepage featured links
- `/learn/what-is-tokenized-real-estate` — add "See how the leading platforms compare" near the bottom
- `/learn/how-to-invest-in-tokenized-real-estate` — step 1 of any how-to guide is platform selection; link here

---

## Stat and data refresh points

The platform data in this page is largely hardcoded editorial content. Key fields to check:

| Platform | Field | Current claim | Verify |
|----------|-------|--------------|--------|
| Lofty | minimum | "$50" | Confirm — appears accurate, unlikely to change |
| Lofty | distributions | "Daily (USDC)" | Confirm — appears accurate |
| RealT | minimum | "$50–100" | Token prices drift. Pull current range from PROPERTIES {TODO: current min/max RealT token price} |
| RealT | distributions | "Weekly (USDC)" | Confirm — appears accurate; verify RealT hasn't changed cadence |
| Fundrise | minimum | (check source) | Fundrise occasionally changes its $10 minimum; verify current {TODO: check fundrise.com} |
| Arrived | minimum | (check source) | Arrived changed its minimum; verify {TODO: check arrivedhomes.com} |
| Ark7 | minimum | (check source) | Ark7 minimum has varied; verify {TODO: check ark7.com} |
| All platforms | liquidity | (check source) | Liquidity mechanisms change; verify Fundrise's current redemption windows, Arrived's liquidity approach {TODO: check each platform} |

The Brickwise affiliate status matters here: Lofty affiliate is live per product-marketing-context.md; RealT, Ark7, Arrived, Fundrise are "pending". If any new affiliate is now live, update the relevant link to use the affiliate URL and add the standard affiliate disclosure. Human must verify affiliate status before edit.

---

## Who writes this

Human author. Maintain the independent editorial voice — this page covers competitors to Lofty and RealT, but Brickwise doesn't score Fundrise/Arrived/Ark7 with the same live data. Make the data limitation explicit: "We track Lofty and RealT with live scoring; our coverage of Fundrise, Arrived, and Ark7 is editorial and updated quarterly." Do not invent comparative yields for Fundrise/Arrived/Ark7. Use `{TODO: stat}` for any unverified data.
