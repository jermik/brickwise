import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";
import { FireEvent } from "@/components/analytics/page-view-tracker";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "RealT vs Lofty (2026): Full Platform Comparison | Brickwise",
  description:
    "Independent comparison of RealT and Lofty based on live data from " +
    PROPERTIES.length +
    " analyzed properties. Fees, yields, liquidity, city coverage, and a clear bottom-line verdict.",
  keywords: [
    "realt vs lofty",
    "lofty vs realt",
    "realt vs lofty comparison",
    "realt vs lofty fees",
    "realt vs lofty yield",
    "best tokenized real estate platform",
    "tokenized real estate platform comparison",
    "realt review",
    "lofty review",
    "fractional real estate marketplace comparison",
  ],
  openGraph: {
    title: "RealT vs Lofty (2026): Which Tokenized Real Estate Platform Is Better? | Brickwise",
    description:
      "Side-by-side comparison of RealT and Lofty — yields, fees, liquidity, city coverage. Based on independent analysis of " +
      PROPERTIES.length +
      " properties.",
    type: "article",
    url: "https://brickwise.pro/compare/realt-vs-lofty",
  },
  alternates: { canonical: "https://brickwise.pro/compare/realt-vs-lofty" },
};

function avg(arr: number[]) {
  return arr.length ? +(arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(1) : 0;
}

const realtProps = PROPERTIES.filter((p) => p.platform === "RealT");
const loftyProps = PROPERTIES.filter((p) => p.platform === "Lofty");

const realtAvgYield = avg(realtProps.map((p) => p.expectedYield));
const loftyAvgYield = avg(loftyProps.map((p) => p.expectedYield));
const realtMaxYield = realtProps.length ? +Math.max(...realtProps.map((p) => p.expectedYield)).toFixed(1) : 0;
const loftyMaxYield = loftyProps.length ? +Math.max(...loftyProps.map((p) => p.expectedYield)).toFixed(1) : 0;
const realtAvgScore = realtProps.length
  ? Math.round(realtProps.reduce((s, p) => s + p.overallScore, 0) / realtProps.length)
  : 0;
const loftyAvgScore = loftyProps.length
  ? Math.round(loftyProps.reduce((s, p) => s + p.overallScore, 0) / loftyProps.length)
  : 0;
const realtCities = [...new Set(realtProps.map((p) => p.city))].sort();
const loftyCities = [...new Set(loftyProps.map((p) => p.city))].sort();
const realtMinPrice = realtProps.length ? +Math.min(...realtProps.map((p) => p.tokenPrice)).toFixed(2) : 0;
const loftyMinPrice = loftyProps.length ? +Math.min(...loftyProps.map((p) => p.tokenPrice)).toFixed(2) : 0;
const realtLowRisk = realtProps.filter((p) => p.risk === "Low").length;
const loftyLowRisk = loftyProps.filter((p) => p.risk === "Low").length;
const realtUndervalued = realtProps.filter((p) => p.fairValueStatus === "undervalued").length;
const loftyUndervalued = loftyProps.filter((p) => p.fairValueStatus === "undervalued").length;
const realtBuyCount = realtProps.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
const loftyBuyCount = loftyProps.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;

const topRealtBuys = realtProps
  .filter((p) => getRecommendation(p, PROPERTIES).action === "Buy")
  .sort((a, b) => b.overallScore - a.overallScore)
  .slice(0, 3);
const topLoftyBuys = loftyProps
  .filter((p) => getRecommendation(p, PROPERTIES).action === "Buy")
  .sort((a, b) => b.overallScore - a.overallScore)
  .slice(0, 3);

export default function CompareRealtVsLoftyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "RealT vs Lofty (2026): Full Platform Comparison",
    "description":
      "Independent comparison of RealT and Lofty tokenized real estate platforms based on live yield data, fees, and property-level analysis.",
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "url": "https://brickwise.pro/compare/realt-vs-lofty",
    "about": [
      { "@type": "WebSite", "name": "RealT", "url": "https://realt.co" },
      { "@type": "WebSite", "name": "Lofty", "url": "https://lofty.ai" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is RealT or Lofty better for tokenized real estate investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Both platforms deliver strong yields. RealT has ${realtProps.length} properties across ${realtCities.length} cities with an average yield of ${realtAvgYield}%. Lofty has ${loftyProps.length} properties with an average yield of ${loftyAvgYield}% and offers instant liquidity via its Proactive Market Maker. Choose RealT for depth and track record; choose Lofty for liquidity and newer builds.`,
        },
      },
      {
        "@type": "Question",
        "name": "What is the minimum investment on RealT vs Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `On RealT, the minimum investment is one token — the lowest token price in our dataset is $${realtMinPrice}. On Lofty, the minimum is $50 per property. Both platforms allow fractional ownership, so investors can start with small amounts.`,
        },
      },
      {
        "@type": "Question",
        "name": "How does liquidity compare between RealT and Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty offers faster liquidity through its Proactive Market Maker (PMM), which allows near-instant token sales. RealT tokens trade on secondary markets (Uniswap and its RMM protocol) which can have variable liquidity depending on the property. For investors prioritizing the ability to exit quickly, Lofty has a structural advantage.",
        },
      },
      {
        "@type": "Question",
        "name": "Which platform has higher yields — RealT or Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Based on our analysis of ${PROPERTIES.length} properties, RealT averages ${realtAvgYield}% net yield with a high of ${realtMaxYield}%. Lofty averages ${loftyAvgYield}% with a high of ${loftyMaxYield}%. Yield differences largely reflect city and property-type selection — compare specific properties rather than platform averages for the most meaningful comparison.`,
        },
      },
      {
        "@type": "Question",
        "name": "Are RealT and Lofty safe investments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Both platforms use SPV (Special Purpose Vehicle) structures, meaning investors hold real legal ownership of the underlying property via LLC or similar entities, not just a digital token. This provides a legal backstop if either platform were to shut down. However, tokenized real estate is illiquid relative to stocks and carries real estate risk (vacancies, repairs, market value changes). Neither investment is guaranteed.",
        },
      },
      {
        "@type": "Question",
        "name": "What cities does RealT have properties in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `RealT primarily covers US cities including ${realtCities.slice(0, 6).join(", ")} and more. The platform focuses heavily on the Midwest and Sun Belt markets.`,
        },
      },
      {
        "@type": "Question",
        "name": "Can I use both RealT and Lofty at the same time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. Many investors diversify across both platforms to access more properties and different liquidity profiles. Brickwise tracks all properties from both platforms so you can compare them side-by-side and manage a multi-platform portfolio in one place.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://brickwise.pro/compare" },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "RealT vs Lofty",
        "item": "https://brickwise.pro/compare/realt-vs-lofty",
      },
    ],
  };

  const winner = realtAvgYield > loftyAvgYield ? "RealT" : "Lofty";
  const winnerColor = winner === "RealT" ? "#3b82f6" : "#f97316";

  return (
    <AppShell>
      <FireEvent name="comparison_viewed" params={{ slug: "realt-vs-lofty" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[900px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.4)" }}>Compare</span>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>RealT vs Lofty</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Platform Comparison
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            RealT vs Lofty: Which Tokenized Real Estate Platform Is Better?
          </h1>
          <p className="text-[14px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>
            Independent analysis based on {PROPERTIES.length} properties tracked across both platforms. Updated regularly with live yield and score data.
          </p>
        </div>

        {/* Quick verdict */}
        <div className="rounded-[12px] p-5 mb-8" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "#4ade80" }}>Bottom line</div>
          <p className="text-[14px] leading-[1.6]" style={{ color: "#F2EDE6" }}>
            <strong style={{ color: "#F2EDE6" }}>RealT</strong> leads on property depth ({realtProps.length} listings, {realtCities.length} cities, avg {realtAvgYield}% yield) and has the longer track record since 2019. <strong style={{ color: "#F2EDE6" }}>Lofty</strong> leads on liquidity (instant PMM exits), lower minimum entry ($50), and newer property stock. Most serious investors use both.
          </p>
        </div>

        {/* Live stats comparison */}
        <div className="mb-8">
          <div className="text-[12px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.5)" }}>Live data — {PROPERTIES.length} properties analyzed</div>
          <div className="grid grid-cols-2 gap-3">
            {/* RealT card */}
            <div className="rounded-[12px] p-5" style={{ background: "#131109", border: "1px solid #3b82f680" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3b82f6" }} />
                <span className="text-[16px] font-bold" style={{ color: "#F2EDE6" }}>RealT</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] ml-auto" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>realt.co</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Properties tracked", value: String(realtProps.length) },
                  { label: "Avg net yield", value: `${realtAvgYield}%`, green: true },
                  { label: "Max yield", value: `${realtMaxYield}%` },
                  { label: "Avg score", value: `${realtAvgScore}/100` },
                  { label: "Buy signals", value: `${realtBuyCount} of ${realtProps.length}` },
                  { label: "Low-risk props", value: `${realtLowRisk} (${Math.round((realtLowRisk / realtProps.length) * 100)}%)` },
                  { label: "Undervalued", value: String(realtUndervalued) },
                  { label: "Cities covered", value: String(realtCities.length) },
                  { label: "Min token price", value: `$${realtMinPrice}` },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>{s.label}</span>
                    <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : "#F2EDE6" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lofty card */}
            <div className="rounded-[12px] p-5" style={{ background: "#131109", border: "1px solid #f9731680" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f97316" }} />
                <span className="text-[16px] font-bold" style={{ color: "#F2EDE6" }}>Lofty</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] ml-auto" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>lofty.ai</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Properties tracked", value: String(loftyProps.length) },
                  { label: "Avg net yield", value: `${loftyAvgYield}%`, green: true },
                  { label: "Max yield", value: `${loftyMaxYield}%` },
                  { label: "Avg score", value: `${loftyAvgScore}/100` },
                  { label: "Buy signals", value: `${loftyBuyCount} of ${loftyProps.length}` },
                  { label: "Low-risk props", value: `${loftyLowRisk} (${Math.round((loftyLowRisk / loftyProps.length) * 100)}%)` },
                  { label: "Undervalued", value: String(loftyUndervalued) },
                  { label: "Cities covered", value: String(loftyCities.length) },
                  { label: "Min token price", value: "$50" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>{s.label}</span>
                    <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : "#F2EDE6" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Head-to-Head Feature Comparison
          </h2>
          <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)", width: "40%" }}>Feature</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold" style={{ color: "#3b82f6", width: "30%" }}>RealT</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold" style={{ color: "#f97316", width: "30%" }}>Lofty</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Founded", realt: "2019", lofty: "2021" },
                  { feature: "Blockchain", realt: "Ethereum / Gnosis", lofty: "Algorand" },
                  { feature: "Min. investment", realt: `$${realtMinPrice}`, lofty: "$50" },
                  { feature: "Avg. net yield", realt: `${realtAvgYield}%`, lofty: `${loftyAvgYield}%`, highlight: realtAvgYield > loftyAvgYield ? "realt" : "lofty" },
                  { feature: "Properties tracked", realt: String(realtProps.length), lofty: String(loftyProps.length), highlight: realtProps.length > loftyProps.length ? "realt" : "lofty" },
                  { feature: "Cities covered", realt: String(realtCities.length), lofty: String(loftyCities.length), highlight: realtCities.length > loftyCities.length ? "realt" : "lofty" },
                  { feature: "Liquidity mechanism", realt: "Uniswap / RMM", lofty: "PMM (instant)" },
                  { feature: "Exit speed", realt: "Market-dependent", lofty: "Near-instant" },
                  { feature: "Ownership structure", realt: "LLC tokens (ERC-20)", lofty: "SPV / LLC tokens" },
                  { feature: "KYC required", realt: "Yes", lofty: "Yes" },
                  { feature: "US investors", realt: "Yes (accredited)", lofty: "Yes" },
                  { feature: "Non-US investors", realt: "Yes", lofty: "Yes" },
                  { feature: "Rental payment", realt: "USDC weekly", lofty: "USDC daily" },
                  { feature: "Secondary market", realt: "Uniswap + RMM", lofty: "Lofty marketplace" },
                  { feature: "Buy signals (Brickwise)", realt: `${realtBuyCount} active`, lofty: `${loftyBuyCount} active`, highlight: realtBuyCount > loftyBuyCount ? "realt" : "lofty" },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                    <td className="px-5 py-3 text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.6)" }}>{row.feature}</td>
                    <td
                      className="px-4 py-3 text-[12px] font-semibold text-center"
                      style={{ fontFamily: "var(--font-dm-mono)", color: row.highlight === "realt" ? "#22c55e" : "#F2EDE6" }}
                    >
                      {row.highlight === "realt" && <span className="text-[9px] mr-1">★</span>}{row.realt}
                    </td>
                    <td
                      className="px-4 py-3 text-[12px] font-semibold text-center"
                      style={{ fontFamily: "var(--font-dm-mono)", color: row.highlight === "lofty" ? "#22c55e" : "#F2EDE6" }}
                    >
                      {row.highlight === "lofty" && <span className="text-[9px] mr-1">★</span>}{row.lofty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-2" style={{ color: "rgba(242,237,230,0.3)" }}>★ = better value in row based on Brickwise scoring</p>
        </div>

        {/* Top buys from each platform */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Top Buy Signals Right Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* RealT top buys */}
            <div>
              <div className="text-[11px] font-semibold mb-2.5 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
                <span style={{ color: "#3b82f6" }}>RealT — Best Buy Signals</span>
              </div>
              <div className="space-y-2">
                {topRealtBuys.map((p) => (
                  <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                    <div className="rounded-[8px] px-4 py-3 flex items-center gap-3 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>{p.flag} {p.city} · Score {p.overallScore}/100</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{p.expectedYield}%</div>
                        <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.35)" }}>yield</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Lofty top buys */}
            <div>
              <div className="text-[11px] font-semibold mb-2.5 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
                <span style={{ color: "#f97316" }}>Lofty — Best Buy Signals</span>
              </div>
              <div className="space-y-2">
                {topLoftyBuys.length > 0 ? topLoftyBuys.map((p) => (
                  <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                    <div className="rounded-[8px] px-4 py-3 flex items-center gap-3 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>{p.flag} {p.city} · Score {p.overallScore}/100</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{p.expectedYield}%</div>
                        <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.35)" }}>yield</div>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="text-[12px] px-4 py-8 text-center rounded-[8px]" style={{ background: "#131109", border: "1px solid #2A2420", color: "rgba(242,237,230,0.35)" }}>
                    No active buy signals for Lofty at this time
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Link href="/analyzer?platform=RealT" className="text-[11px] font-medium no-underline hover:opacity-70 transition-opacity mr-4" style={{ color: "#3b82f6" }}>
              See all RealT buy signals →
            </Link>
            <Link href="/analyzer?platform=Lofty" className="text-[11px] font-medium no-underline hover:opacity-70 transition-opacity" style={{ color: "#f97316" }}>
              See all Lofty buy signals →
            </Link>
          </div>
        </div>

        {/* City coverage */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            City Coverage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[10px] p-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div className="text-[11px] font-semibold mb-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
                <span style={{ color: "#3b82f6" }}>RealT — {realtCities.length} cities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {realtCities.map((city) => {
                  const count = realtProps.filter((p) => p.city === city).length;
                  const slug = city.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link key={city} href={`/city/${slug}`} className="no-underline">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-[4px] hover:opacity-80 transition-opacity"
                        style={{ background: "rgba(59,130,246,0.08)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.18)" }}
                      >
                        {city} <span style={{ color: "rgba(147,197,253,0.5)" }}>({count})</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[10px] p-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div className="text-[11px] font-semibold mb-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
                <span style={{ color: "#f97316" }}>Lofty — {loftyCities.length} cities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {loftyCities.map((city) => {
                  const count = loftyProps.filter((p) => p.city === city).length;
                  const slug = city.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link key={city} href={`/city/${slug}`} className="no-underline">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-[4px] hover:opacity-80 transition-opacity"
                        style={{ background: "rgba(249,115,22,0.08)", color: "#fdba74", border: "1px solid rgba(249,115,22,0.18)" }}
                      >
                        {city} <span style={{ color: "rgba(253,186,116,0.5)" }}>({count})</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pros / cons */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Pros and Cons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* RealT pros/cons */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
                <span className="text-[13px] font-bold" style={{ color: "#F2EDE6" }}>RealT</span>
              </div>
              <div className="p-4 space-y-2" style={{ background: "#131109" }}>
                {[
                  { pro: true, text: `Largest catalog — ${realtProps.length} properties` },
                  { pro: true, text: "5+ year track record since 2019" },
                  { pro: true, text: `${realtCities.length} cities including major Midwest markets` },
                  { pro: true, text: "Deep DeFi integration (RMM, Uniswap)" },
                  { pro: true, text: "Weekly USDC rent payments" },
                  { pro: false, text: "Liquidity depends on secondary market depth" },
                  { pro: false, text: "Older housing stock on average" },
                  { pro: false, text: "Higher token prices on some listings" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px]">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: item.pro ? "#22c55e" : "#ef4444" }}>
                      {item.pro ? "+" : "−"}
                    </span>
                    <span style={{ color: item.pro ? "rgba(242,237,230,0.7)" : "rgba(242,237,230,0.45)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lofty pros/cons */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
                <span className="text-[13px] font-bold" style={{ color: "#F2EDE6" }}>Lofty</span>
              </div>
              <div className="p-4 space-y-2" style={{ background: "#131109" }}>
                {[
                  { pro: true, text: "$50 minimum investment — lowest entry point" },
                  { pro: true, text: "Near-instant liquidity via PMM" },
                  { pro: true, text: "Daily USDC rent payments" },
                  { pro: true, text: "Newer property stock on average" },
                  { pro: true, text: "Cleaner UI and onboarding experience" },
                  { pro: false, text: "Smaller catalog than RealT" },
                  { pro: false, text: "PMM liquidity tied to platform health" },
                  { pro: false, text: "Algorand ecosystem (narrower DeFi) " },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px]">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: item.pro ? "#22c55e" : "#ef4444" }}>
                      {item.pro ? "+" : "−"}
                    </span>
                    <span style={{ color: item.pro ? "rgba(242,237,230,0.7)" : "rgba(242,237,230,0.45)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Who should use which */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Which Platform Is Right for You?
          </h2>
          <div className="space-y-3">
            {[
              {
                scenario: "You want maximum yield and don't care about instant exits",
                winner: "RealT",
                reason: `RealT's ${realtProps.length}-property catalog gives more yield-optimization options. Sort by our highest-yield filter to find the top opportunities.`,
                color: "#3b82f6",
              },
              {
                scenario: "You want to be able to exit your position quickly",
                winner: "Lofty",
                reason: "Lofty's Proactive Market Maker (PMM) provides near-instant liquidity — critical if your investment horizon is uncertain.",
                color: "#f97316",
              },
              {
                scenario: "You're starting with a small amount ($50–$500)",
                winner: "Lofty",
                reason: "Lofty's $50 minimum makes it easier to diversify across many properties without large capital. RealT tokens can be higher per unit.",
                color: "#f97316",
              },
              {
                scenario: "You want to diversify across the most cities",
                winner: "RealT",
                reason: `RealT covers ${realtCities.length} cities vs Lofty's ${loftyCities.length}. More geography = lower concentration risk.`,
                color: "#3b82f6",
              },
              {
                scenario: "You want to use DeFi strategies (collateral, LP, etc.)",
                winner: "RealT",
                reason: "RealT tokens are ERC-20 and work natively with Ethereum DeFi — you can use them as collateral in the RealT RMM protocol.",
                color: "#3b82f6",
              },
              {
                scenario: "You want both — diversification and liquidity",
                winner: "Both",
                reason: "Most active investors hold both. Brickwise tracks all properties across both platforms so you can manage your full multi-platform portfolio in one place.",
                color: "#22c55e",
              },
            ].map((s) => (
              <div key={s.scenario} className="rounded-[10px] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium mb-0.5" style={{ color: "rgba(242,237,230,0.5)" }}>If…</div>
                  <div className="text-[13px] font-semibold mb-1.5" style={{ color: "#F2EDE6" }}>{s.scenario}</div>
                  <div className="text-[11px] leading-[1.5]" style={{ color: "rgba(242,237,230,0.45)" }}>{s.reason}</div>
                </div>
                <div
                  className="flex-shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-[6px] text-center"
                  style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30`, minWidth: 64 }}
                >
                  {s.winner}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Is RealT or Lofty better for tokenized real estate investing?",
                a: `Both platforms deliver strong yields. RealT has ${realtProps.length} properties across ${realtCities.length} cities with an average yield of ${realtAvgYield}%. Lofty has ${loftyProps.length} properties with an average yield of ${loftyAvgYield}% and offers instant liquidity via its Proactive Market Maker. Choose RealT for depth and track record; choose Lofty for liquidity and newer builds.`,
              },
              {
                q: "What is the minimum investment on RealT vs Lofty?",
                a: `On RealT, the minimum investment is one token — the lowest token price in our dataset is $${realtMinPrice}. On Lofty, the minimum is $50 per property. Both platforms allow fractional ownership, so investors can start with small amounts.`,
              },
              {
                q: "How does liquidity compare between RealT and Lofty?",
                a: "Lofty offers faster liquidity through its Proactive Market Maker (PMM), which allows near-instant token sales. RealT tokens trade on secondary markets (Uniswap and its RMM protocol) which can have variable liquidity depending on the property.",
              },
              {
                q: "Which platform has higher yields — RealT or Lofty?",
                a: `Based on our analysis of ${PROPERTIES.length} properties, RealT averages ${realtAvgYield}% net yield with a high of ${realtMaxYield}%. Lofty averages ${loftyAvgYield}% with a high of ${loftyMaxYield}%. Compare specific properties using the Brickwise analyzer for the most meaningful comparison.`,
              },
              {
                q: "Are RealT and Lofty safe investments?",
                a: "Both platforms use SPV (Special Purpose Vehicle) structures, meaning investors hold real legal ownership of the underlying property via LLC entities, not just a digital token. However, tokenized real estate carries real estate risk (vacancies, repairs, market value changes) and is illiquid relative to stocks. Neither investment is guaranteed.",
              },
              {
                q: "Can I use both RealT and Lofty at the same time?",
                a: "Yes — and most serious investors do. Brickwise tracks all properties from both platforms so you can compare them side-by-side and find the best opportunities across both.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                <h3 className="text-[13px] font-semibold mb-2" style={{ color: "#F2EDE6" }}>{faq.q}</h3>
                <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[12px] px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[15px] font-semibold mb-1" style={{ color: "#F2EDE6" }}>
              Analyze every property on both platforms
            </div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              {PROPERTIES.length} properties scored for yield, risk, and fair value. Filter by platform, city, and buy signal.
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href="/analyzer"
              className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85"
              style={{ background: "#22c55e", color: "#0A0907" }}
            >
              Open Analyzer →
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-[10px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.25)" }}>
          Data based on Brickwise analysis of {PROPERTIES.length} properties. Yields and scores are updated regularly but may not reflect real-time listings. Not financial advice. Always verify directly on realt.co and lofty.ai before investing.
        </p>
      </div>
    </AppShell>
  );
}
