# Refresh Brief: `/learn/realt-review`

**Date:** 2026-08-01  
**Mode:** Monthly Refresh — Early Advisory  
**Eligibility note:** Page last committed 2026-06-11 (51 days). 90-day threshold not met until 2026-09-09. Brief is advisory — act on it in September or when platform changes warrant it.

---

## Page facts

| | |
|---|---|
| Route | `/learn/realt-review` |
| File | `app/learn/realt-review/page.tsx` |
| Primary keyword | `realt review 2026` |
| H1 | "RealT Review [current year]" (dynamic) |
| Last committed | 2026-06-11 |
| Current H2s | What Is RealT? · RealT Yields: What the Data Shows · RealT Fee Structure · RealT Pros and Cons · Verdict: Who Should Invest on RealT? · Frequently Asked Questions |

---

## Current angle vs SERP intent

**Current angle:** Data-driven review anchored to live property counts and yield calculations from the PROPERTIES dataset. Good brevity on fee structure. The verdict section is honest about DeFi requirements and liquidity caveats. No rating score (unlike the Lofty review).

**Likely SERP intent (keyword: "RealT review"):** Transactional-informational. Users are comparing RealT against Lofty or deciding whether to open an account. SERP typically surfaces pages with: specific yield numbers, clear risk warnings about Detroit concentration, RealT's Gnosis Chain migration context, and the RMM (RealT Money Market) DeFi integration — which is a significant differentiator that the current page omits.

**Live SERP check:** Could not fetch — proxy blocked external access. Owner should run `google.com/search?q=RealT+review+2026` and note:
- PAA questions (add any new questions to FAQ)
- Whether "RealT scam" or "is RealT safe" appears — add a dedicated trust/risk section if so
- Whether competitors have a more recent publish date visible in SERP snippet

---

## Gaps in current content

1. **No RealT Money Market (RMM) section.** The RMM is a lending vault that lets RealT token holders use their tokens as collateral to borrow USDC. This is a first-class DeFi feature that differentiates RealT from all non-blockchain competitors. Its omission is a meaningful content gap for DeFi-curious readers.
2. **No Gnosis Chain vs Ethereum distinction.** RealT operates on both Ethereum (older properties) and Gnosis Chain (newer, lower gas). The current review mentions only "Ethereum blockchain" in the FAQ. Readers who encounter Gnosis Chain addresses or xDAI will be confused.
3. **No DRIP section.** RealT supports reinvestment of distributions. This is a frequently searched feature; the current review does not address it.
4. **No tax treatment section.** Same gap as the Lofty review — a pre-purchase blocker for cautious investors. How are weekly USDC distributions taxed? ERC-20 token transactions — gas-fee deductibility? K-1 or 1099?
5. **No freshness signal in the body.** The H1 is dynamic (`RealT Review [year]`) but the body has no "Updated [Month Year]" callout.
6. **No credit / rating score.** The Lofty review has a 4.2/5 verdict badge. The RealT review ends with an average Brickwise score (which is a property-level metric, not a platform verdict). This asymmetry may confuse readers comparing both reviews.
7. **Detroit concentration risk not mentioned.** Product-marketing-context notes that 37% of all listings are in Detroit. The RealT review does not warn about geographic concentration risk — a meaningful omission for a page positioning itself as "honest and data-driven."

---

## Proposed new H2 sections

Add these sections — to be placed after "RealT Fee Structure" and before "Pros and Cons":

1. **RealT on Gnosis Chain vs Ethereum** — Brief explainer: older RealT properties issued ERC-20s on Ethereum mainnet; newer properties are on Gnosis Chain (formerly xDai) with near-zero gas fees and USDC payouts in xDAI. Investors may hold tokens on both chains. Confirm specific chain details with current RealT documentation: {TODO: verify current Gnosis/Eth split and bridging mechanics}.
2. **RealT Money Market (RMM): Using Your Tokens as Collateral** — Explain that RealT token holders can deposit tokens into the RMM to borrow against them. Note the risks (liquidation if collateral value drops, illiquidity of collateral during loan). Do not recommend. Use {TODO: confirm current RMM APY rates, collateral factors, and supported tokens}.
3. **DRIP on RealT** — Explain the reinvestment mechanism. Confirm whether it is automated or manual, and which chains/wallets support it: {TODO: confirm current DRIP mechanics and UI steps}.
4. **Geographic Concentration Risk** — Note that RealT's catalog is heavily weighted toward specific cities (primarily Detroit, Chicago, Cleveland). {TODO: pull current city distribution from PROPERTIES data — what % is Detroit, what % is top-3 cities?}. Frame this as a diversification consideration, not a defect.
5. **Tax Treatment of RealT Income** — Same structure as the Lofty review brief: ordinary income treatment for LLC distributions, ERC-20 transaction considerations, potential 1099/K-1. Informational only: {TODO: verify with CPA or RealT's help center}.

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/compare/realt-vs-lofty` — already present via the "Continue reading" block. Keep.
- `/learn/what-is-tokenized-real-estate` — not linked. Add contextual link in "What Is RealT?" section.
- `/rankings/highest-yield` — not linked. Add "See which RealT properties currently score highest."
- `/city/detroit` — once the Detroit concentration section is added, link to the Detroit city page.
- `/learn/lofty-review` — the comparison table links to the comparison page, but not to the Lofty review directly. Add a reference for readers who want the Lofty-specific review.

**Link TO this page FROM:**
- `/learn/what-is-tokenized-real-estate` — add "See our full RealT review."
- `/compare/best-fractional-real-estate-platforms` — the RealT row should link to this review.
- `/compare/realt-vs-lofty` — check if the comparison page links here; add if missing.
- `/platform/realt` — add a link to the detailed review.

---

## Stat / data refresh points

The page pulls `count`, `avgYield`, `maxYield`, `buyCount`, and `avgScore` dynamically from PROPERTIES — good. Hardcoded items to verify:

- `{TODO: confirm "RealT operating since 2019" is still the correct founding date — no rebranding or restructuring since then?}`
- `{TODO: confirm property management fee range 8–12% applies to current RealT listings}`
- `{TODO: confirm weekly USDC payout is still the current cadence — any properties that changed?}`
- `{TODO: verify Gnosis Chain / Ethereum split for property count}`
- `{TODO: confirm the RMM exists and is still active under this name}`
- `{TODO: pull Detroit concentration % from current PROPERTIES data}`

---

## Human action required

1. Run live SERP check for "RealT review 2026" and "is RealT legit" — note PAA questions and featured snippet structure.
2. Check RealT's blog or changelog for any platform changes since June 2026.
3. Verify RMM mechanics and current APY with RealT documentation.
4. Confirm Gnosis Chain / Ethereum property split in current listings.
5. Write new sections per the brief; do not use this as copy — structural guidance only.
