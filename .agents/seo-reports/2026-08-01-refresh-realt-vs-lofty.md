# Refresh Brief: `/compare/realt-vs-lofty`

**Date:** 2026-08-01  
**Mode:** Monthly Refresh — Early Advisory  
**Eligibility note:** Page last committed 2026-06-11 (51 days). 90-day threshold not met until 2026-09-09. Brief is advisory — act on it in September or when live data drift warrants it.

---

## Page facts

| | |
|---|---|
| Route | `/compare/realt-vs-lofty` |
| File | `app/compare/realt-vs-lofty/page.tsx` |
| Primary keyword | `realt vs lofty` |
| Priority in sitemap | 0.9 (second-highest after home) |
| Last committed | 2026-06-11 |
| Description | Dynamic — pulls live PROPERTIES count. Good. |

---

## Current angle vs SERP intent

**Current angle:** Side-by-side comparison backed by live data from the PROPERTIES dataset. Includes per-platform averages for yield, score, city count, min token price, and undervalued counts. Live data is a genuine differentiator vs static competitor reviews.

**Likely SERP intent (keyword: "realt vs lofty"):** Transactional-comparative. User is between the two platforms and close to a decision. SERP typically surfaces pages that answer:
- "Which pays more?" (yield comparison)
- "Which is easier to use?" (onboarding + wallet UX)
- "Which is safer?" (regulatory + smart contract risk)
- "Should I use both?" (increasingly common answer)
- Tax comparison (less common but growing as more investors hit their second year and get K-1s)

**Key differentiator to protect:** Brickwise is the only source with live cross-platform yield/score data. This angle should be front-and-center in a refresh. Any static competitor doing a "RealT vs Lofty" comparison cannot update their comparison table daily — Brickwise can. Make this visible.

**Live SERP check:** Could not fetch — proxy blocked external access. Owner should run `google.com/search?q=realt+vs+lofty` and check:
- Which site is in position #1? What sections do they have?
- Is there a featured snippet? If yes, match the structure it uses (typically: pros/cons table or a "verdict" paragraph).
- PAA questions — add any that aren't currently answered.

---

## Gaps in current content (inferred from code review of first 80 lines)

1. **No "Should I use both?" section.** Many tokenized RE investors hold both platforms. This question is a natural SERP intent and is not addressed.
2. **No tax and reporting comparison.** RealT (Ethereum/Gnosis) creates different crypto tax events than Lofty (Algorand). Weekly vs daily distribution timing also creates different 1099 complexity. A brief side-by-side table (not advice) would address a major pre-decision anxiety.
3. **No city-level diversity breakdown.** The comparison likely has aggregate data but no city map or city table. Showing "RealT: 40+ cities" vs "Lofty: [N] cities" with a Detroit concentration warning for both serves the data-driven user persona.
4. **No regulatory / structural risk section.** Both platforms hold properties in Delaware LLCs. But Ethereum smart contract risk differs from Algorand. Neither platform is FDIC insured. A brief "What happens if the platform shuts down?" section addresses the #1 objection from cautious investors.
5. **No "Who should use which?" concrete use-case table.** The existing comparison likely has feature rows but not a use-case decision table: "If you want X, use Y" format works well for transactional-intent queries.
6. **Live data freshness not surfaced.** If the comparison table pulls from live PROPERTIES data, make this explicit ("Updated daily from Brickwise's scoring database"). Competitors use static tables; this is a differentiator.

---

## Proposed new H2 sections

Add these — exact placement to be determined by the writer after reading the full page:

1. **Can You Use Both RealT and Lofty?** — Yes; explain why many investors diversify across both (different blockchains = different counterparty risk; daily + weekly distributions smooth income timing; different city exposure). Note operational overhead (two wallets, two KYC processes). This section addresses a gap in all competitor comparison pages.
2. **Tax Reporting: RealT vs Lofty** — Side-by-side: weekly USDC (Ethereum) vs daily USDC (Algorand). Both generate ordinary income. ERC-20 token transfers vs ASA transactions — different on-chain footprints for crypto tax tools. Add: {TODO: confirm whether RealT sends K-1 or 1099, and same for Lofty}. Explicitly disclaim this is not tax advice.
3. **Platform Risk: What Happens If Either Shuts Down?** — Delaware LLC structure means properties are held independently. Neither platform custody risk extends to the underlying real estate. Add smart-contract key-management notes and recovery options for each chain. Use {TODO: verify current self-custody options for each platform's tokens}.
4. **Live Yield Data: Today's Comparison** — If the comparison table is already backed by live data, add a visible "Live as of [date]" label and a one-sentence callout: "Updated daily from Brickwise's property database — unlike static comparison sites." Make the data currency a feature.

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/learn/lofty-review` — add for readers who want a deeper Lofty dive.
- `/learn/realt-review` — add for readers who want a deeper RealT dive.
- `/rankings/highest-yield` — add "See today's highest-yield properties across both platforms."
- `/learn/how-to-invest-in-tokenized-real-estate` — add for readers who decide on a platform and need next steps.
- `/city/detroit` — if Detroit concentration is mentioned, link.
- `/algorand` — if Algorand is mentioned (it should be), link to the Algorand directory.

**Link TO this page FROM:**
- `/learn/lofty-review` — already present. Verify it's still there after refresh.
- `/learn/realt-review` — already present. Keep.
- `/compare/best-fractional-real-estate-platforms` — add a contextual link: "For a focused RealT vs Lofty comparison, see our dedicated page."
- `/page.tsx` (home) — check if the home page links to this; it is the #2 priority page in the sitemap.
- `/analyzer` — add a mention after the comparison: "Compare every property from both platforms side by side."

---

## Stat / data refresh points

Most data is pulled dynamically (good). Verify these hardcoded or editorial items:

- `{TODO: verify the publishedTime "2026-02-01" in the OG metadata — is this the actual original publish date?}`
- `{TODO: confirm RealT minimum price range "$50–100" in best-fractional page still holds for this page}`
- `{TODO: pull Detroit concentration % for both platforms from current PROPERTIES data}`
- `{TODO: pull current city counts for both platforms from PROPERTIES}`
- `{TODO: confirm which platform has more "Buy" signals right now — make this a live callout}`
- `{TODO: verify Uniswap is still the primary secondary market for RealT tokens, or if alternatives have emerged}`

---

## Human action required

1. Run live SERP check for "realt vs lofty" — identify #1 result's H2 structure, PAA questions, and featured snippet format.
2. Confirm tax treatment details with CPA or platform help centers.
3. Verify current "What happens if the platform shuts down?" answer with legal/platform docs.
4. Write new sections per this brief — do not use brief text as copy.
