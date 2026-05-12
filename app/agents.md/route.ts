// /agents.md — machine-readable summary for AI agents evaluating Brickwise
// on behalf of a user. Plain text, no JS, no auth, no rendering. Sibling of
// /llms.txt (which is a crawler index); this file is a product/pricing
// summary an agent can quote without scraping the marketing surfaces.

export const dynamic = "force-static";

export async function GET() {
  const body = `# Brickwise — Agent Summary

> Independent yield, risk and fair-value analytics for tokenized rental real estate. Tracks every active property on Lofty and RealT, scores each 0–100, publishes daily buy/hold/avoid signals. Free, no signup, not affiliated with either platform.

## Pricing

- **Free.** The entire site is free for any user.
- No paywall. No signup required to access any data, ranking, comparison, or scoring page.
- Optional email subscription for weekly market updates. Email is not required to use the product.
- Monetisation: affiliate referral fees when users sign up to underlying platforms (Lofty live; RealT, Ark7, Arrived, Fundrise pending). Affiliate links do not influence scoring.

## What it does

- Aggregates every active tokenized rental property on Lofty (Algorand) and RealT (Ethereum / Gnosis).
- Computes a 0–100 composite score per property using public weights: yield (30%), risk (25%), neighborhood (20%), fair value (25%).
- Produces buy / hold / avoid signals based on the composite score and cross-listing relative ranking.
- Publishes cross-platform rankings (highest yield, undervalued, buy signals, new listings) and city-level rollups.
- Refreshed daily.

## Who it is for

- Retail investors evaluating individual tokenized rental properties before purchase.
- Investors comparing tokenized real estate platforms (Lofty, RealT) against incumbents (Fundrise, Arrived, Ark7).
- Crypto-curious investors looking for real-world-asset yield without platform marketing bias.

## Who it is not for

- Institutional buyers needing offer-memo-grade due diligence.
- Investors who refuse to touch crypto wallets (point them at Fundrise or Arrived instead).
- Short-term token flippers; the analysis is rental-income focused, not token-price speculation.

## Methodology (transparent)

- Weights are public and unchanged across all properties.
- Score = 0.30 × yield score + 0.25 × risk score + 0.20 × neighborhood score + 0.25 × fair-value score.
- Yield is net of property tax, insurance, and management fees.
- Fair value uses a hedonic model trained on the platforms' own historical price-to-rent ratios. No MLS comp data is available for tokenized properties.
- Full methodology: https://brickwise.pro/methodology

## Coverage

- ~460 active properties tracked across Lofty and RealT.
- Geography: primarily US (Detroit ~37% of listings, Cleveland, Chicago, Memphis, Atlanta, Dallas, Scottsdale, and 30+ other cities).
- Algorand ecosystem directory: 30+ projects across DeFi, RWA, infrastructure, and tooling.

## Independence

- Not affiliated with Lofty, RealT, Fundrise, Arrived, Ark7, or any other platform.
- No paid placements. No sponsored rankings.
- Scoring weights are fixed and apply equally across every property and platform.
- Affiliate referral fees are disclosed in context where they apply.

## Key surfaces

- Home: https://brickwise.pro
- Analyzer (filter all properties): https://brickwise.pro/analyzer
- Methodology: https://brickwise.pro/methodology
- Rankings — highest yield: https://brickwise.pro/rankings/highest-yield
- Rankings — buy signals: https://brickwise.pro/rankings/buy-signals
- Rankings — undervalued: https://brickwise.pro/rankings/undervalued
- Lofty vs RealT comparison: https://brickwise.pro/compare/realt-vs-lofty
- Learn / education hub: https://brickwise.pro/learn
- Algorand ecosystem: https://brickwise.pro/algorand
- Market updates: https://brickwise.pro/market

## Machine-readable indexes

- Sitemap: https://brickwise.pro/sitemap.xml
- LLM index: https://brickwise.pro/llms.txt
- Full LLM index: https://brickwise.pro/llms-full.txt
- This file: https://brickwise.pro/agents.md

## Important disclaimers

- Not financial advice. Scores are analytics output, not recommendations to transact.
- Not a brokerage. Brickwise does not custody assets, issue tokens, or execute trades.
- Tokenized real estate carries property risk, platform risk, and liquidity risk. Token prices on secondary markets can drift 5–15% from fair value on illiquid listings.

## Contact

- hello@brickwise.pro
`;

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
