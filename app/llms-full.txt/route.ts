import { PROPERTIES } from "@/lib/data/properties";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

interface MarketUpdate {
  date: string;
  slug: string;
  title: string;
  highlights: string[];
}
const MARKET_UPDATES = marketUpdatesRaw as unknown as MarketUpdate[];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const dynamic = "force-static";

// /llms-full.txt — extended index with descriptions for AI answer engines.
// Same allowlist as /llms.txt: only public/indexable surfaces. CRM, GrowthOS,
// dashboard, watchlist, portfolio, sign-in, sign-up, settings, /api are
// intentionally excluded.
export async function GET() {
  const base = "https://brickwise.pro";
  const cities = [...new Set(PROPERTIES.map((p) => p.city))].sort();
  const platforms = [...new Set(PROPERTIES.map((p) => p.platform))].filter(Boolean) as string[];
  const avgYield = +(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(2);
  const maxYield = Math.max(...PROPERTIES.map((p) => p.expectedYield));
  const avgScore = Math.round(PROPERTIES.reduce((s, p) => s + p.overallScore, 0) / PROPERTIES.length);
  const topProperties = [...PROPERTIES].sort((a, b) => b.overallScore - a.overallScore).slice(0, 50);

  const body = `# Brickwise — Tokenized Real Estate Investment Analytics

Brickwise is an analytics platform for tokenized (fractional) real estate investments. We score ${PROPERTIES.length} live properties listed on Lofty and RealT for yield, risk, neighbourhood quality, and fair value — combining those into a single 0–100 Brickwise Score and a buy/hold/avoid signal.

## What Brickwise Does

- Tracks every tokenized property listed on supported platforms
- Computes a composite Brickwise Score per property (yield 30% / risk 25% / neighbourhood 20% / value 25%)
- Produces buy / hold / avoid recommendations using cross-listing comparisons
- Surfaces undervalued tokens and unusually high yields
- Publishes daily market overview snapshots

Brickwise is independent. We are not affiliated with Lofty or RealT.

## Current Market Snapshot

- Tracked properties: ${PROPERTIES.length}
- Average expected net yield: ${avgYield}%
- Highest expected yield observed: ${maxYield}%
- Average Brickwise Score: ${avgScore}/100
- Platforms covered: ${platforms.join(", ")}
- Cities covered: ${cities.length}

## Public Surfaces

### Homepage
[${base}](${base}) — Latest buy signals, best pick, and avoid-this-mistake learnings derived from current market data.

### Analyzer
[${base}/analyzer](${base}/analyzer) — Browse, filter, and sort every tracked property. Filters: city, platform, yield band, score band, fair-value status, risk profile.

### Market Reports
[${base}/market](${base}/market) — Aggregate market view: buy/hold/avoid distribution, average yield, top-yielding city, platform comparison.

Recent dated reports:
${MARKET_UPDATES.slice(0, 10)
  .map((u) => `- [${u.title}](${base}/market/${u.slug}) · ${u.date}\n  Highlights: ${u.highlights?.[0] ?? ""}`)
  .join("\n")}

### Comparisons
- [RealT vs Lofty](${base}/compare/realt-vs-lofty) — Editorial + data comparison covering yield, fees, liquidity, regulatory model, and onboarding.

### Rankings (computed from live data)
- [Highest Yield](${base}/rankings/highest-yield) — Top properties by expected net yield.
- [Buy Signals](${base}/rankings/buy-signals) — Properties currently flagged Buy by the Brickwise model.
- [Undervalued](${base}/rankings/undervalued) — Properties priced below estimated fair value.
- [New Listings](${base}/rankings/new-listings) — Recently added properties.

### Learn
- [Learn hub](${base}/learn) — Education and guides.
- [What Is Tokenized Real Estate?](${base}/learn/what-is-tokenized-real-estate) — Beginner explainer covering blockchain ownership, dividends, and platform mechanics.
- [How to Invest in Tokenized Real Estate](${base}/learn/how-to-invest-in-tokenized-real-estate) — Step-by-step onboarding guide.
- [Lofty Review](${base}/learn/lofty-review) — Editorial review of the Lofty platform: $50 minimum, daily USDC payouts, Algorand-based tokens.
- [RealT Review](${base}/learn/realt-review) — Editorial review of RealT: Ethereum-based, US LLC-backed tokenization, monthly USDC payouts.

### Platforms
- [Lofty](${base}/platform/lofty) — Platform-level data: yields, fees, properties tracked.
- [RealT](${base}/platform/realt) — Platform-level data: yields, fees, properties tracked.

### Cities
${cities.map((c) => `- [${c}](${base}/city/${slugify(c)}) — All tracked tokenized properties in ${c}.`).join("\n")}

### Properties (Top 50 by Brickwise Score)
${topProperties
  .map(
    (p) =>
      `- [${p.name}, ${p.city}](${base}/property/${p.id}) — ${p.expectedYield}% expected net yield · Brickwise Score ${p.overallScore}/100 · ${p.platform}`
  )
  .join("\n")}

## Methodology Notes

**Brickwise Score** is an algorithmic composite, not a user rating. It uses a weighted sum of four sub-scores:
- Yield score (30%): expected net yield vs. city average
- Risk score (25%): occupancy stability, build year, risk profile
- Neighbourhood score (20%): location quality and employment anchors
- Value score (25%): token price vs. estimated fair value

**Recommendations** (Buy / Hold / Avoid) are computed from the score plus cross-listing relative ranking. Confidence is a derived signal based on data freshness and source verification.

**Yields** are expected net yields after typical operating costs (property tax, insurance, management). Past performance does not guarantee future income.

## Excluded From This Surface

The following are private or internal and are intentionally not exposed to crawlers or AI agents:
- /dashboard, /portfolio, /watchlist, /settings (authenticated user views)
- /sign-in, /sign-up (auth flows)
- /announce, /seo-dashboard (internal tooling)
- /crm, /growthos (CRM and internal product surfaces)
- /api/* (server endpoints)

## Disclaimers

Brickwise content is informational and educational. It is not financial advice. Tokenized real estate investments carry risks including platform risk, illiquidity, vacancy, and regulatory change. Always read the offering documents on the issuing platform before investing.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
