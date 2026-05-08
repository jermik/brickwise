import { PROPERTIES } from "@/lib/data/properties";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

interface MarketUpdate { date: string; slug: string; title: string }
const MARKET_UPDATES = marketUpdatesRaw as unknown as MarketUpdate[];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const dynamic = "force-static";

// /llms.txt — concise machine-readable index for AI answer engines
// (Perplexity, ChatGPT browsing, Claude, etc.). Excludes auth, CRM, GrowthOS.
// Structure follows the llmstxt.org community convention.
export async function GET() {
  const base = "https://brickwise.pro";
  const cities = [...new Set(PROPERTIES.map((p) => p.city))].sort();
  const topProperties = [...PROPERTIES]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 20);

  const body = `# Brickwise

> Tokenized real estate investment analytics. Brickwise scores ${PROPERTIES.length}+ tokenized properties across Lofty and RealT for yield, risk, and fair value — producing buy/hold/avoid signals for fractional real estate investors.

## Core tools

- [Property Analyzer](${base}/analyzer): Browse and filter every tracked tokenized property by yield, risk, city, and platform.
- [Market Overview](${base}/market): Live aggregate stats — average yield, buy-signal counts, top-yielding cities.

## Comparisons

- [RealT vs Lofty](${base}/compare/realt-vs-lofty): Data-backed comparison of yields, fees, liquidity, and platform mechanics.

## Rankings

- [Highest Yield Properties](${base}/rankings/highest-yield)
- [Buy Signals](${base}/rankings/buy-signals)
- [Undervalued Properties](${base}/rankings/undervalued)
- [New Listings](${base}/rankings/new-listings)

## Learn (education)

- [Learn hub](${base}/learn): Curated guides on tokenized real estate.
- [What Is Tokenized Real Estate?](${base}/learn/what-is-tokenized-real-estate)
- [How To Invest in Tokenized Real Estate](${base}/learn/how-to-invest-in-tokenized-real-estate)
- [Lofty Review](${base}/learn/lofty-review)
- [RealT Review](${base}/learn/realt-review)

## Platforms

- [Lofty Platform Overview](${base}/platform/lofty)
- [RealT Platform Overview](${base}/platform/realt)

## Cities

${cities.map((c) => `- [${c}](${base}/city/${slugify(c)})`).join("\n")}

## Top Properties (by Brickwise Score)

${topProperties
  .map(
    (p) =>
      `- [${p.name} (${p.city})](${base}/property/${p.id}): ${p.expectedYield}% expected net yield · score ${p.overallScore}/100 · listed on ${p.platform}`
  )
  .join("\n")}

## Market Reports

${MARKET_UPDATES.slice(0, 12)
  .map((u) => `- [${u.title}](${base}/market/${u.slug}) · ${u.date}`)
  .join("\n")}

## Optional

- Brickwise scoring methodology: weighted composite of yield (30%), risk (25%), neighbourhood (20%), and value (25%). Scores 0–100, not user reviews.
- Data sources: aggregated from Lofty and RealT public listings; refreshed regularly.
- Out of scope: not financial advice; not affiliated with Lofty or RealT.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
