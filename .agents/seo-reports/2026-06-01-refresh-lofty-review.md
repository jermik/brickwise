# Refresh Brief: `/learn/lofty-review`

**File:** `app/learn/lofty-review/page.tsx`  
**Last git commit:** 2026-05-11  
**Age:** 21 days  
**Priority:** High — SERP showing growing competition; Lofty's relative standing has improved vs RealT crisis

---

## Current angle vs SERP intent

**Current page angle:** Balanced platform review. $50 minimum, daily USDC payouts, Algorand PMM. 4.2/5 verdict. Pros/cons, fee table, Lofty vs RealT comparison. Generic positive tone.

**What SERP shows searchers want for "lofty review 2026":**
- Lofty is appearing in nearly all 2026 comparison pieces as the *recommended alternative* to RealT for investors who are nervous after the RealT crisis
- Searches show intent to validate: "is Lofty safe?" and "is Lofty better than RealT now?"
- Trustpilot presence in SERP suggests users want third-party verification of Lofty's operational reliability
- SERP shows "40+ active properties" as the number cited by competitors — Brickwise tracks significantly more and should surface this data advantage

**Gap:** The current page does not mention RealT's 2026 crisis at all. In the current environment, the comparison table line "Lofty: Smaller [property catalog] vs RealT: Larger" is technically true but contextually misleading — RealT's operational reliability is now the more important variable. The page treats both platforms as equivalent alternatives, when Lofty's relative standing has materially improved.

---

## Proposed new H2 structure

Current H2s:
1. How Lofty Works
2. Pros & Cons
3. Real Yield Data
4. Fee Structure
5. Lofty vs RealT: Key Differences
6. Who Is Lofty Best For?
7. Frequently Asked Questions

**Proposed revised structure:**

1. How Lofty Works *(keep, minor update — verify current property count)*
2. **Lofty's Operational Track Record** ← new section; addresses the trust question directly with specific evidence (payout streak, city diversification, property age)
3. Real Yield Data *(keep, update with freshest numbers from Brickwise database)*
4. Fee Structure *(keep)*
5. **Lofty vs RealT: Updated for 2026** ← revise the comparison table; add a new row for "Distribution status" and "Operational risk" that reflects current reality
6. Pros & Cons *(move after comparison; update cons — "Fewer properties than RealT" is less important now)*
7. Who Is Lofty Best For? *(keep, may warrant updating — now also appropriate for RealT refugees)*
8. Frequently Asked Questions *(add: "Is Lofty safe compared to RealT?" given SERP demand)*

---

## Key stat/data refresh points

- `{TODO: stat}` — Verify current active property count on Lofty (competitor sources say 40+; Brickwise database should have the authoritative figure)
- `{TODO: stat}` — Confirm whether Lofty daily distributions have been uninterrupted through May/June 2026 (would be a strong trust signal given RealT suspension — verify via investor community or platform comms)
- `{TODO: stat}` — Current Lofty PMM liquidity depth: has it changed? Is there evidence of increased redemptions following RealT investor migration?
- `{TODO: stat}` — Update avgLoftyYield and maxLoftyYield in the stat boxes (these are pulled live from PROPERTIES data — confirm the database is current)
- `{TODO: stat}` — Does Lofty still only cover US properties? Any international expansion announced?
- The "4.2 / 5" verdict rating in the review schema and UI — is this still accurate given the updated competitive context? May warrant upgrading to reflect Lofty's improved relative position.

---

## Tone guidance

The Lofty review update should be honest, not promotional. Lofty's improved relative standing vs RealT is a data point, not a marketing claim. The draft must still surface Lofty's genuine weaknesses (Algorand wallet friction, PMM depth limits for large exits, smaller property catalog than RealT's pre-crisis level). Do not write a puff piece.

The anchor: "Daily payouts, no missed distributions, Algorand-based. $50 minimum. Not affiliated with RealT's Detroit situation." Let the contrast speak for itself.

---

## Internal-link opportunities

**Links TO this page** (strengthen):
- `/compare/realt-vs-lofty` should reference this page for deeper Lofty-specific analysis
- `/compare/best-fractional-real-estate-platforms` — add Lofty review link to the Lofty "Best for" card
- `/platform/lofty` — bidirectional with this review

**Links FROM this page** (add or clarify):
- Add explicit link to `/compare/realt-vs-lofty` (already present — ensure anchor text reflects updated framing)
- Add link to `/algorand` for users who want to understand the Algorand ecosystem before investing
- The "See which Lofty properties score Buy" CTA at bottom should link to `/analyzer` filtered for Lofty only if that URL param exists; otherwise `/analyzer` is fine

---

## Schema notes

Current schemas: Review, Article, FAQPage, BreadcrumbList — all appropriate. No schema changes needed; update the reviewBody text in the Review schema to reflect current data. The "ratingValue": "4.2" in the Review schema may be worth reviewing.

---

*Brief written 2026-06-01 by seo-routine. Human writes the actual refreshed copy.*
