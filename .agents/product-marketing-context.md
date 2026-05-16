# Product Marketing Context

*Last updated: 2026-05-11*

*Status: V1 auto-draft, awaiting owner review.*

## Product Overview
**One-liner:** Independent yield, risk, and fair-value scoring for every tokenized rental property on Lofty and RealT. 460+ properties tracked daily.

**Independence statement:** Brickwise is intentionally independent and not affiliated with Lofty or RealT. This is a core trust differentiator and must remain visible across all public surfaces.

**What it does:** Brickwise pulls every active listing from Lofty (Algorand) and RealT (Ethereum/Gnosis), scores each property 0 to 100 across yield, risk, neighborhood quality, and fair value, then publishes buy/hold/avoid signals plus cross-platform comparisons, rankings, city pages, and market reports. Free, no signup, not affiliated with either platform.

**Product category:** Tokenized real estate analytics platform. Adjacent shelves: fractional real estate review sites, crypto RWA data tools, real estate investment analytics.

**Product type:** Content site + free analytics tool (public face). Private internal CRM (GrowthOS) for Dutch SMB outreach lives in the same codebase but is gated by Clerk + access cookie and is not part of the public brand.

**Business model:** Free for users. Monetization via affiliate referrals (Lofty live; RealT, Ark7, Arrived, Fundrise pending). Premium analytics/tools may be introduced later once recurring usage patterns emerge. No validated retention loop yet, so pricing is intentionally not anchored at this stage.

## Target Audience
**Target companies:** N/A (B2C).

**Decision-makers:** Individual retail investors. Two flavors:
1. Crypto-curious investors who already hold ETH/USDC and want yield-bearing real-world assets
2. Traditional fractional-RE investors comparing tokenized platforms (Lofty/RealT) against incumbents (Fundrise, Arrived, Ark7)

**Primary use case:** "Should I buy this $50 property token? Which property? Which platform?"

**Jobs to be done:**
- Decide which specific tokenized property to buy across platforms
- Compare platforms before opening an account
- Vet if a high-yield listing is legit or a hidden vacancy/neighborhood red flag
- Confirm "is tokenized real estate worth it" before getting started

**Use cases:**
- Pre-purchase scoring on a specific property the user is considering
- Weekly "what's the best buy right now" check
- Platform comparison shopping
- Top-of-funnel "is this whole category legit" research

## Personas
B2C product, and traffic is too low pre-launch to fictionalize specific personas with detailed cares/challenges/values. Broad audience buckets only:

- **Crypto-curious retail investors** — already hold crypto, exploring real-world-asset yield
- **Yield-focused real estate investors** — comparing cashflow products across platforms
- **Data-driven passive investors** — want scoring/transparency before committing capital

Specific personas will be refined once real user behavior emerges from launch traffic, email subscriber engagement, and Reddit/HN comment patterns. Do not invent persona detail ahead of evidence.

## Problems & Pain Points
**Core problem:** No independent way to compare tokenized RE properties across platforms. Each platform markets its own listings. High yields often hide vacancy or neighborhood risk. Token prices drift 5 to 15% from fair value on illiquid listings. Buyers have no neutral scoreboard.

**Why alternatives fall short:**
- RealT cannot publish independent analysis of itself (commercial bias)
- Lofty cannot publish independent RealT analysis (competitive)
- BiggerPockets, Roofstock, Norada cover traditional fractional RE, not tokenized
- Reddit threads are subjective, slow, and don't cover all 460 properties
- Forum/influencer takes are episodic, not data-driven

**What it costs them:**
- Buying the wrong $500 to 5,000 token
- Overpaying 5 to 15% above fair value
- Accidentally concentrating in one city (37% of all listings are Detroit)
- Buying a high-yield trap (top-yield properties often have hidden vacancy or rough-street risk)

**Emotional tension:** "Is this a scam?" Distrust of platform marketing. Fear of putting real money into a vacant property dressed up as high yield. Anxiety about Algorand wallet complexity for first-time crypto buyers.

## Competitive Landscape
**Direct:** None confirmed (verified in `SEO_INTELLIGENCE.md`). No third-party cross-platform analytics tool exists in this niche.

**Secondary:** Reddit subreddits (r/RealEstateInvesting, r/AlgorandOfficial, r/passive_income), platform marketing pages themselves, individual YouTube reviewers. Fall short because they are biased, episodic, or unstructured.

**Indirect:** Traditional REITs (Fundrise, Roofstock public listings, public REITs). Solve the "real estate income" job with less liquidity risk but higher fees, no $50 entry, no per-property selection, no daily distributions.

## Differentiation
**Key differentiators:**
- Only third-party cross-platform analytics for Lofty + RealT
- Explicit 0 to 100 composite scoring (yield 30%, risk 25%, neighborhood 20%, fair value 25%)
- Cross-platform ranking tables (highest yield, undervalued, buy signals, new listings)
- Per-property hedonic fair-value estimate
- City-level rollups across both platforms (Detroit, Cleveland, Chicago, Memphis, Atlanta, etc.)
- Algorand ecosystem directory (30+ projects) for crypto-native users
- AI-discoverable via `/llms.txt` and `/llms-full.txt` for Perplexity, ChatGPT, Claude citations
- All free, no signup wall

**How we do it differently:** Pull live data daily, score with explicit public weights, publish openly with no paywall and no account creation.

**Why that's better:** A buyer can vet a specific property in 30 seconds without trusting platform marketing. The scoreboard is universal across platforms, not siloed.

**Why customers choose us:** Independence. We don't sell tokens. We don't promote any single property. The scoring is transparent.

**Long-term moat (clarified):** The moat is NOT the scoring algorithm itself. Any algorithm is replicable. The moat is:
- **Proprietary longitudinal market data** — scores, yields, occupancy, fair-value drift across the entire tokenized-rental universe over time
- **Normalized cross-platform tracking** — only third-party currently doing this for Lofty + RealT
- **Historical change data** — only Brickwise can show "this property's score dropped from 84 to 71 over six months" or "this city's average yield is rising"
- **Public trust around methodology** — transparent weights, independent stance, no platform affiliation. Reputation compounds.

## Objections

**HYPOTHESIZED PRE-LAUNCH OBJECTIONS.** No real customer conversations yet. These are educated guesses. Replace with verbatim objections from HN/Reddit comments, email replies, and DM threads once launch traffic arrives.

| Objection (hypothesized) | Response |
|--------------------------|----------|
| "Is this affiliated with Lofty/RealT?" | No. We earn referral fees if you sign up via our links, but scores are not influenced. Methodology is public. |
| "How do I know your scoring is right?" | The methodology page explains every weight and input. All raw data is linkable back to platform sources. |
| "Why should I trust a free site?" | We track every property daily and update scores. No single analyst can match this breadth, free or paid. |
| "What's the catch?" | We earn referral fees from platforms if you sign up. That funds the site. The data is free regardless of whether you click out. |

**Anti-persona:**
- Institutional buyers needing offer-memo-grade DD
- Pure-REIT investors who refuse to touch crypto wallets (point them to Fundrise or Arrived)
- Short-term token flippers/speculators (we are focused on rental income, not token price action)

## Switching Dynamics
**Push:** Burned by buying a high-yield Lofty/RealT token that sat vacant. Tired of comparing platforms by hand in spreadsheets. Distrust of platform marketing. Confusion about Algorand wallet flow.

**Pull:** One scoreboard for all 460 properties. Honest "avoid" signals. Cross-platform comparisons. Free, no signup. Fast.

**Habit:** Manually scrolling Lofty/RealT marketplaces. Reading platform-published "featured properties" lists. Asking Reddit "is X legit." Spreadsheet-based DIY analysis.

**Anxiety:** "What if the scoring is wrong?" "What's the catch on a free site?" "How fresh is the data?" "Is the founder credible?"

## Customer Language
**How they describe the problem:**
- "no one was tracking yields, occupancy, or fair value across them"
- "30.9% yield, and I'd still avoid it"
- "concentration risk is real"
- "liquidity is theoretical for most listings"
- "tokens drift 5 to 15% from fair value"
- "the marketing on these platforms is wildly optimistic"

**How they describe us:**
- "yield scorer for tokenized rentals"
- "independent third-party analytics for Lofty + RealT"
- "buy/hold/avoid signals"
- "scoring with explicit weights"

**Words to use:** yield, fair value, occupancy, concentration risk, buy signal, undervalued, scoring, independent, honest, methodology, cross-platform, distribution frequency, daily USDC, hedonic model

**Words to avoid:** "AI-powered", "revolutionary", "disrupt", "Web3 native", "next-gen", em-dashes in marketing copy, generic VC-pitch language, "synergy", "best-in-class"

**Glossary:**
| Term | Meaning |
|------|---------|
| Token | Digital share of an LLC that owns one rental property |
| Net yield | Annual net rental income divided by current token price |
| Fair value | Hedonic-model price estimate based on platform historical price/rent ratios |
| PMM | Proactive Market Maker (Lofty's automated secondary market) |
| RMM | RealT Money Market (lending vault on RealT) |
| SPV | Special-purpose vehicle, usually a Delaware/Wyoming LLC, that owns one property |
| DRIP | Distribution reinvestment plan, reinvesting payouts into more tokens |
| Score | Brickwise composite 0 to 100 across yield, risk, neighborhood, fair value |
| Buy signal | Composite scoring based on yield, risk, neighborhood quality, and relative fair value |

## Brand Voice
**Tone:** Skeptical. Analytical. Anti-hype. Transparent about risk. Practitioner-credible. Numerate.

**Style:** Direct, data-led, no fluff. Conversational where useful (Reddit/HN posts) but never salesy. References specific numbers and properties by address, not generalities. Surfaces downside risk explicitly, including for properties we list favorably.

**Personality:** Independent. Skeptical. Anti-hype. Quietly contrarian when the data warrants it. Anchor quote: "30.9% yield, and I'd still avoid it."

**Explicitly NOT:** bullish, maximalist, influencer-style, hype-driven, VC-pitch flavored, "to the moon", crypto-bro, finfluencer. If a sentence could appear on a generic Web3 landing page, rewrite it.

## Proof Points
**Metrics:**
- 460+ tokenized properties tracked
- 687 indexed pages
- 2 platforms tracked live (Lofty, RealT), 5 covered in comparison content (+ Arrived, Fundrise, Ark7)
- 30+ Algorand ecosystem projects in directory
- Average tracked yield: 10.08% net
- 37% of all listings concentrated in Detroit (illustrative data finding)
- Highest yield in dataset: 30.89% (Cleveland property on Lofty, scored 78/100)

**Customers:** Pre-traction. ~12 weekly visitors as of audit baseline. Goal: first 500 email subscribers.

**Testimonials:** None yet. Will collect from HN/Reddit responses and early newsletter subscribers.

**Value themes:**
| Theme | Proof |
|-------|-------|
| Independence | Not affiliated, no platform editorial influence, methodology public |
| Cross-platform breadth | Only tool covering Lofty + RealT side by side |
| Methodology transparency | Public 30/25/20/25 weight breakdown |
| Free + no signup | Zero friction, full data accessible to anyone |
| AI-discoverable | `/llms.txt` + `/llms-full.txt` shipped for LLM-search citations |
| Honest contrarianism | "30.9% yield, and I'd still avoid it" is the brand voice |

## Goals
**Business goal:** Build a defensible, indexed content asset whose moat is proprietary longitudinal scoring data plus an email list of qualified tokenized-RE investors. Monetize via affiliate referrals first, paid tier later.

**Conversion action hierarchy:**
1. Email capture (primary near-term goal)
2. Affiliate click to Lofty/RealT/Ark7/Fundrise/Arrived (revenue)
3. Return visits (organic SEO compounding)

**Current metrics:**
- ~12 weekly visitors (baseline)
- 687 indexed pages
- 0 email subscribers (capture recently wired, lead magnet pending)
- Lofty affiliate live; 4 others pending
- 0 commissions yet
- Distribution pending: HN, 4 Reddit posts, Indie Hackers, YouTube Shorts (all copy-ready, not yet shipped)

**Primary goals (pre-launch, intentionally unquantified):**
- Validate acquisition channels (HN, Reddit, Indie Hackers, YouTube Shorts, X, organic SEO)
- Identify repeat usage behavior (return visits, email open rates, watchlist saves)
- Establish trust with early investors (methodology transparency, independence signaling, honest "avoid" signals)
- Grow indexed data footprint (more property surface, more long-tail keyword capture, more LLM citations)
- Collect first recurring users and email subscribers

Hard numeric targets will be set once channel acquisition data exists. Setting them pre-launch invites either unrealistic optimism or premature contraction. Validate first, quantify second.
