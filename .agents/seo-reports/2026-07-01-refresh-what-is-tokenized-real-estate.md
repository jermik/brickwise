# Refresh Brief: `/learn/what-is-tokenized-real-estate`

**Date**: 2026-07-01  
**Routine**: seo-routine / monthly-refresh  
**File**: `app/learn/what-is-tokenized-real-estate/page.tsx`  
**Last git edit**: 2026-05-16 (46 days ago)  
**Primary keyword**: "what is tokenized real estate"  
**H1**: "What Is Tokenized Real Estate?" (inferred from metadata title pattern)

---

## Age note

46 days old. **Early-watch candidate.** Evergreen educational content decays more slowly than platform reviews, but this page uses live stats (avgYield, maxYield, buyCount from PROPERTIES) and specific platform claims that can drift. More importantly, this is a top-of-funnel pillar page targeting the highest-volume educational query in Brickwise's keyword universe — it needs to be optimally structured for PAA (People Also Ask) boxes and featured snippets before it can compete. First formally eligible: **2026-08-14**.

---

## Current angle

"Complete beginner's guide" covering: what tokenized RE is → how it works → typical yields (using live data: avgYield, maxYield, buyCount from PROPERTIES) → platforms (Lofty and RealT) → how to get started.

The meta description is strong: "Tokenized real estate converts property ownership into blockchain tokens, letting investors buy fractional shares from $50. Learn how it works, typical yields (8–14%), risks, and how to get started." It leads with a specific mechanism and number — passes tone tests.

---

## Current SERP intent

Pure informational, top-of-funnel. Users have heard the phrase and want a plain-language explanation. SERP for "what is tokenized real estate" likely includes:
- Lofty's own educational content ("The Ultimate Guide to Tokenized Real Estate Investment Strategies")
- Generic finance sites (Investopedia-style)
- Platform marketing pages
- YouTube explainers

Brickwise's differentiation: independent perspective with actual tracked data, not platform marketing. The page can own featured snippets by having precise, scannable 40–60 word definition paragraphs at the top of each H2 section.

SEO_INTELLIGENCE.md identifies specific PAA targets for this query:
- "What is tokenized real estate?" (own the definition snippet)
- "How does tokenized real estate work?"
- "Is tokenized real estate a good investment?"
- "What are the risks of tokenized real estate?"
- "What is the minimum investment for tokenized real estate?"
- "Is tokenized real estate legal in the US?"
- "What is the difference between tokenized real estate and a REIT?"

Live SERP fetch unavailable (403). Verify current SERP + PAA boxes manually.

---

## Proposed new H2 sections

1. **"Is Tokenized Real Estate a Good Investment? The Honest Answer"**  
   Almost certainly a PAA box trigger. Must pass downside test. Structure: 40–60 word direct answer (yes/no/depends with one key caveat), then supporting detail covering: yield range ({TODO: current avgYield}% on Brickwise), liquidity limitations, concentration risk (37% Detroit), platform regulatory risk. Anchor quote: "30.9% yield, and I'd still avoid it" fits naturally here. Target: "is tokenized real estate worth it", "is tokenized real estate a good investment".

2. **"Tokenized Real Estate vs REITs: Which Is Better?"**  
   Missing from current page. SEO_INTELLIGENCE.md lists this as a Tier 2 content gap (`/learn/tokenized-real-estate-vs-reit`). A 300–400 word comparison section on this page (before building a standalone page) would capture "tokenized real estate vs REIT" and "fractional real estate vs REIT" queries without requiring a new page build. Format: short comparison table + one-paragraph verdict per investor profile. Internal link to `/compare/best-fractional-real-estate-platforms`.

3. **"Tax Treatment of Tokenized Real Estate Income"**  
   SEO_INTELLIGENCE.md identifies this as a content gap (`/learn/tokenized-real-estate-taxes`). Even without a full standalone page, a 200-word H2 section on this page covering: how rental income is reported (K-1 vs 1099), how token sales are treated (capital gains), the record-keeping burden, and "what to ask your tax advisor" would capture high-anxiety search queries and serve as a forcing function to build the standalone tax page later. All tax claims must be framed as "how platforms report it" not "tax advice." Use `{TODO: verify current K-1 treatment for Lofty LLC membership}`.

4. **"What Happens If a Tokenized Real Estate Platform Shuts Down?"**  
   A PAA box target per SEO_INTELLIGENCE.md. High-anxiety question that no platform publishes an honest answer to (they're not incentivized to). Brickwise can own this. Structure: the property is held in an LLC → the LLC doesn't disappear with the platform → historical precedent for platform failure in similar structures → what investors should do to protect themselves. Target: "is realt safe", "what if lofty shuts down", "tokenized real estate platform risk".

5. **"How to Get Started: Your First Tokenized Real Estate Investment ($50)"**  
   Check whether the current page already has a "how to get started" section — source code shows this keyword in the metadata. If the section exists, confirm it links to `/learn/how-to-invest-in-tokenized-real-estate` for the full step-by-step. If it doesn't exist or is very brief, a 200-word section with a concrete flow (choose platform → complete KYC → fund wallet → analyze properties on Brickwise → buy token) would capture "how to buy real estate tokens" queries and create a natural internal link to the how-to guide.

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/learn/how-to-invest-in-tokenized-real-estate` — "Ready to invest? See our step-by-step guide"
- `/compare/realt-vs-lofty` — "Compare the two largest platforms: RealT and Lofty"
- `/compare/best-fractional-real-estate-platforms` — "See how tokenized RE compares to REITs and other platforms"
- `/rankings/highest-yield` — "See which tokenized properties are scoring highest yield right now"
- `/methodology` — "How Brickwise generates its 0–100 scores"
- `/analyzer` — CTA at bottom of page

**Link TO this page FROM:**
- `/learn/page.tsx` (learn hub) — confirm this page is prominently featured (it should be listed first or second)
- `/page.tsx` (homepage) — check whether homepage has an educational section linking to TOFU content
- `/compare/realt-vs-lofty` — add "new to tokenized real estate? Start here" link at the top
- `/learn/realt-review` and `/learn/lofty-review` — add "learn more about how tokenized real estate works" near the intro sections
- `/algorand/page.tsx` — "Tokenized real estate is one of the primary use cases for Algorand; see our explainer on how it works"

---

## Stat and data refresh points

| Location | Current element | Refresh trigger |
|----------|----------------|-----------------|
| Source | `avgYield = ... PROPERTIES.reduce(...)` | Auto-updates from PROPERTIES — no manual change needed |
| Source | `maxYield = Math.max(...)` | Auto-updates — no manual change needed |
| Source | `buyCount = PROPERTIES.filter(score >= 75)` | Auto-updates — no manual change needed |
| Meta description | "typical yields (8–14%)" | Hardcoded range — verify this range still reflects the live PROPERTIES distribution {TODO: confirm current yield range} |
| (Unknown) | Platform descriptions of Lofty/RealT | If editorial copy exists in JSX, check for any outdated platform claims (property counts, minimum changes, feature changes) |
| (Unknown) | "Is it legal?" section | If present, verify no regulatory developments affecting tokenized RE legality in the US since May 2026 {TODO: check SEC/CFTC news on tokenized real estate} |

---

## Who writes this

Human author. This is the highest-traffic-potential TOFU page on the site. Every claim must be sourced or scoped with appropriate uncertainty. The downside test is especially important here — if readers only see the upside of tokenized RE, they will distrust Brickwise when they later discover the risks. Lead with a downside-present framing (e.g., "460 properties tracked. Some earn 30% yield. We'd still avoid most of them.").
