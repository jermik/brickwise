# Refresh Brief: `/compare/realt-vs-fundrise`

**File:** `app/compare/realt-vs-fundrise/page.tsx`  
**Last git commit:** 2026-05-11  
**Age:** 21 days  
**Priority:** High — comparison matrix has a factually incorrect row; SERP intent has shifted

---

## Current angle vs SERP intent

**Current page angle:** Structural comparison. RealT (direct LLC tokenized ownership, weekly USDC, Ethereum, per-property control) vs Fundrise (eREIT fund shares, quarterly distributions, diversified portfolio, no crypto needed). Comparison matrix with 11 rows. Pros/cons for each. Verdict: "RealT for crypto DeFi users, Fundrise for hands-off diversification."

**What SERP shows for "realt vs fundrise 2026":**
- No dominant third-party page specifically for this comparison — this is still differentiated content for Brickwise
- The broader comparison SERP shows Fundrise has become the safer-seeming choice given RealT's situation
- Searches for "realt vs fundrise" now appear in the context of "I'm in RealT, is Fundrise better?" (migration intent) or "I was going to invest in RealT, should I use Fundrise instead?" (avoidance intent)
- Ark7 content from Ark7.com is now targeting "Lofty vs Fundrise vs Ark7" — competing for this traffic cluster
- Benzinga "best fractional real estate platforms" article now outranks head-to-head comparison pages for some of these queries

**Gap:** The page's neutral framing ("choose RealT if you want weekly cashflow and DeFi") is no longer accurate advice. The Distributions row of the matrix currently reads "Weekly (USDC)" for RealT — factually incorrect. More significantly, the entire framing treats RealT as a stable, fully operational platform with predictable income, which is no longer the case.

---

## Proposed new H2 structure

Current H2s *(page uses inline layout rather than explicit H2s — check the rendered output; content sections are clearly distinct but H2 tagging needs verification)*:
1. Comparison matrix
2. RealT pros
3. RealT cons
4. Fundrise pros
5. Fundrise cons
6. Who should choose RealT?
7. Who should choose Fundrise?

**Proposed revised structure:**

1. **RealT vs Fundrise in 2026: What's Changed** ← new opening section (200–300 words) summarizing why this comparison is more consequential now than when the page was written — RealT's operational situation, Fundrise's long track record. Sets stakes.
2. Comparison matrix *(keep; update Distributions row for RealT; add new row "Operational status 2026")*
3. **RealT pros** *(keep; add conditional note — "these pros apply when the platform is fully operational")*
4. **RealT cons** *(update significantly — add: distributions suspended Feb 2026; Detroit portfolio under third-party management; foreclosure risk on 300+ properties)*
5. Fundrise pros *(keep)*
6. Fundrise cons *(keep)*
7. **Who should choose RealT now?** *(revise: "If RealT appeals to you, we recommend waiting until distributions resume before new investment. Monitor the Detroit situation.")*
8. **Who should choose Fundrise?** *(update framing: Fundrise is now the default for investors who want predictable quarterly distributions without operational risk)*
9. **What if you're already in RealT?** ← new section (this is now a major use case — existing RealT investors arriving at this page looking for guidance)

---

## Key stat/data refresh points

**Comparison matrix — row "Distributions":**
> Currently: RealT = "Weekly (USDC)"  
Must change to: "Suspended (as of Feb 2026) — see RealT review for current status" or equivalent

**New row to add to matrix:**
| Operational status | RealT: Distributions paused; Detroit portfolio under court-ordered management | Fundrise: Operating normally |

**Stat refresh:**
- `{TODO: stat}` — Fundrise quarterly distribution actual amounts for 2025 (not just "quarterly" — provide one or two real figures from their investor disclosures if available, for comparison against RealT's pre-suspension yields)
- `{TODO: stat}` — Fundrise's 2025 or trailing-12-month total return (per their disclosures; the SERP shows range of -7.45% to +22.99% across years — a specific recent figure would be more useful)
- `{TODO: stat}` — RealT's realtAvgYield dynamic stat comes from the Brickwise PROPERTIES database; confirm this reflects current data, and clearly label it as "pre-suspension average" or "historical"
- `{TODO: stat}` — Fundrise AUM fee — currently not mentioned in the matrix; SERP competitors call out "approximately 1% AUM fee" — adding this gives a more complete picture

---

## Tone guidance

This is one of the comparison pages most likely to be read by an existing RealT investor who is anxious. The Brickwise brand voice is not financial advice, but it is honest and numerate.

Do not: tell investors what to do with their existing tokens.  
Do: accurately describe the current operational status of both platforms with citations.  
Do: give a factual, honest updated verdict that reflects the current situation.  
Do not: write an anti-RealT hit piece that overweights the current crisis without acknowledging that RealT's situation is evolving.

---

## Internal-link opportunities

**Links TO this page:**
- `/learn/realt-review` → "compare RealT vs Fundrise" link (already exists conceptually, verify it's present)
- `/compare/best-fractional-real-estate-platforms` → "see RealT vs Fundrise head-to-head" link
- `/compare/realt-vs-lofty` → "if you're deciding between tokenized platforms, also see RealT vs Fundrise"

**Links FROM this page:**
- Add link to `/learn/realt-review` (new "What's happened with RealT in 2026?" anchor) for users who want the full picture
- Add link to `/learn/lofty-review` for users who arrive here considering tokenized but not necessarily committed to RealT
- Current links to Brickwise analyzer exist; keep

---

## Schema notes

Current schemas: Article, FAQPage (if present), BreadcrumbList. Verify the Article schema's description does not say "RealT distributes weekly" — update if it does. The FAQPage schema answers (if present) may contain the same stale distribution claims.

---

*Brief written 2026-06-01 by seo-routine. Human writes the actual refreshed copy. Prioritize updating the Distributions row in the comparison matrix — it is the most directly misleading element.*
