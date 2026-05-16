import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";

// Regenerate every hour so rankings stay fresh without a redeploy
export const revalidate = 3600;

type Category = "highest-yield" | "buy-signals" | "undervalued" | "new-listings";

const CATEGORY_META: Record<
  Category,
  { title: string; h1: string; description: string; tag: string; keywords: string[] }
> = {
  "highest-yield": {
    title: "Highest Yield Tokenized Real Estate Properties Right Now",
    h1: "Highest Yield Tokenized Real Estate Properties",
    description: `Live rankings of the top-yield tokenized properties across RealT and Lofty. See which of ${PROPERTIES.length} properties offer the best net returns right now.`,
    tag: "Yield Rankings",
    keywords: [
      "highest yield tokenized real estate",
      "best yield real estate tokens",
      "realt highest yield",
      "lofty highest yield",
      "tokenized real estate yield rankings",
      "10% yield real estate token",
      "fractional real estate returns",
    ],
  },
  "buy-signals": {
    title: "Active Buy Signals — Best Tokenized Real Estate to Buy Now",
    h1: "Active Buy Signals: Best Tokenized Real Estate Right Now",
    description: `All properties currently rated Buy across RealT and Lofty — scored for yield, risk, fair value, and neighborhood quality. Updated from ${PROPERTIES.length} analyzed properties.`,
    tag: "Buy Signals",
    keywords: [
      "best tokenized real estate to buy",
      "realt buy recommendation",
      "lofty buy signal",
      "tokenized real estate buy signal",
      "best fractional real estate investment",
      "tokenized property analysis",
      "realt best properties",
    ],
  },
  undervalued: {
    title: "Undervalued Tokenized Real Estate Properties — Below Fair Value",
    h1: "Undervalued Tokenized Real Estate Properties",
    description: `Properties where the current token price sits below our estimated fair value — potential upside on top of rental yield. Screened from ${PROPERTIES.length} tracked properties.`,
    tag: "Undervalued",
    keywords: [
      "undervalued tokenized real estate",
      "tokenized property below fair value",
      "real estate token discount",
      "undervalued realt properties",
      "undervalued lofty properties",
      "fractional real estate value",
    ],
  },
  "new-listings": {
    title: "New Tokenized Real Estate Listings — Latest Properties Added",
    h1: "New Tokenized Real Estate Listings",
    description: `The latest properties added to Brickwise — scored, risk-rated, and flagged buy/hold/avoid from day one. Track new listings across RealT and Lofty.`,
    tag: "New Listings",
    keywords: [
      "new tokenized real estate listings",
      "new realt properties",
      "new lofty properties",
      "latest tokenized real estate",
      "new fractional real estate",
      "realt new listing",
    ],
  },
};

export async function generateStaticParams() {
  return (Object.keys(CATEGORY_META) as Category[]).map((c) => ({ category: c }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category as Category];
  if (!meta) return {};
  const url = `https://brickwise.pro/rankings/${category}`;
  return {
    title: `${meta.title} | Brickwise`,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${meta.title} | Brickwise`,
      description: meta.description,
      type: "website",
      url,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: meta.title }],
    },
    alternates: { canonical: url },
  };
}

function recAction(p: (typeof PROPERTIES)[0]) {
  return getRecommendation(p, PROPERTIES).action;
}

export default async function RankingsPage({ params }: Props) {
  const { category } = await params;
  const meta = CATEGORY_META[category as Category];
  if (!meta) notFound();

  // Cap each ranking to 60 to keep DOM size and HTML weight reasonable
  // (audit threshold: <800 DOM nodes, <300 anchors, <100KB HTML).
  const RANKING_CAP = 60;
  let ranked: typeof PROPERTIES;
  switch (category as Category) {
    case "highest-yield":
      ranked = [...PROPERTIES]
        .sort((a, b) => b.expectedYield - a.expectedYield)
        .slice(0, RANKING_CAP);
      break;
    case "buy-signals":
      ranked = PROPERTIES.filter((p) => recAction(p) === "Buy")
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, RANKING_CAP);
      break;
    case "undervalued":
      ranked = PROPERTIES.filter((p) => p.fairValueStatus === "undervalued")
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, RANKING_CAP);
      break;
    case "new-listings":
      ranked = [...PROPERTIES]
        .sort((a, b) => (b.lastUpdated > a.lastUpdated ? 1 : -1))
        .slice(0, RANKING_CAP);
      break;
    default:
      notFound();
  }

  const avgYield = ranked.length
    ? +(ranked.reduce((s, p) => s + p.expectedYield, 0) / ranked.length).toFixed(1)
    : 0;
  const buyCount =
    category === "buy-signals"
      ? ranked.length
      : ranked.filter((p) => recAction(p) === "Buy").length;
  const platforms = [...new Set(ranked.map((p) => p.platform))];

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": meta.h1,
    "description": meta.description,
    "url": `https://brickwise.pro/rankings/${category}`,
    "numberOfItems": ranked.length,
    "itemListElement": ranked.slice(0, 10).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${p.name} — ${p.expectedYield}% Net Yield`,
      "url": `https://brickwise.pro/property/${p.id}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Rankings", "item": "https://brickwise.pro/rankings" },
      {
        "@type": "ListItem",
        "position": 3,
        "name": meta.tag,
        "item": `https://brickwise.pro/rankings/${category}`,
      },
    ],
  };

  const otherCategories = (Object.keys(CATEGORY_META) as Category[]).filter((c) => c !== category);

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[1100px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.4)" }}>Rankings</span>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>{meta.tag}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            {meta.tag}
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-normal leading-[1.1] tracking-[-0.4px] mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            {meta.h1}
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.5)" }}>
            {ranked.length} properties · avg yield {avgYield}% · {buyCount} buy signals · refreshed regularly
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 rounded-[12px] overflow-hidden mb-6"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Listed", value: String(ranked.length) },
            { label: "Avg yield", value: `${avgYield}%`, green: true },
            { label: "Buy signals", value: String(buyCount), accent: true },
            { label: "Platforms", value: platforms.join(" + ") },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div
                className="text-[15px] font-semibold leading-none"
                style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : s.accent ? "#3b82f6" : "#F2EDE6" }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Other ranking tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {otherCategories.map((cat) => (
            <Link key={cat} href={`/rankings/${cat}`} className="no-underline">
              <span
                className="inline-block text-[11px] font-medium px-3 py-1.5 rounded-[6px] hover:opacity-80 transition-opacity"
                style={{ background: "#131109", color: "rgba(242,237,230,0.5)", border: "1px solid #2A2420" }}
              >
                {CATEGORY_META[cat].tag}
              </span>
            </Link>
          ))}
        </div>

        {/* Rankings table */}
        <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
          <div
            className="grid px-5 py-2.5"
            style={{ background: "#1A1713", borderBottom: "1px solid #2A2420", gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 80px" }}
          >
            {["#", "Property", "Yield", "Score", "Risk", "Platform", "Signal"].map((h) => (
              <div key={h} className="text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.35)" }}>{h}</div>
            ))}
          </div>

          {ranked.map((p, i) => {
            const rec = getRecommendation(p, PROPERTIES);
            const recColor = rec.action === "Buy" ? "#22c55e" : rec.action === "Avoid" ? "#ef4444" : "#f59e0b";
            const platformColor = p.platform === "RealT" ? "#3b82f6" : "#f97316";

            return (
              <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                <div
                  className="grid px-5 py-3.5 hover:bg-[#1a1611] transition-colors"
                  style={{
                    background: i % 2 === 0 ? "#131109" : "#0f0e0b",
                    borderBottom: "1px solid #252018",
                    gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 80px",
                    alignItems: "center",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="text-[11px] font-bold"
                    style={{ color: i < 3 ? "#22c55e" : "rgba(242,237,230,0.2)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {i + 1}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 pr-3">
                    <div className="text-[12px] font-semibold truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {p.flag} {p.city}
                      </span>
                      {p.fairValueStatus === "undervalued" && (
                        <span className="text-[12px] px-1 py-0.5 rounded-[3px]" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>Undervalued</span>
                      )}
                    </div>
                  </div>

                  {/* Yield */}
                  <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>
                    {p.expectedYield}%
                  </div>

                  {/* Score */}
                  <div className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: p.overallScore >= 80 ? "#22c55e" : "#F2EDE6" }}>
                    {p.overallScore}/100
                  </div>

                  {/* Risk */}
                  <div>
                    <span
                      className="text-[12px] font-semibold px-1.5 py-0.5 rounded-[3px]"
                      style={{
                        background: p.risk === "Low" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                        color: p.risk === "Low" ? "#22c55e" : "#f59e0b",
                      }}
                    >
                      {p.risk}
                    </span>
                  </div>

                  {/* Platform */}
                  <div className="text-[12px] font-semibold" style={{ color: platformColor }}>
                    {p.platform}
                  </div>

                  {/* Signal */}
                  <div>
                    <div
                      className="text-[12px] font-bold px-2 py-1 rounded-[4px] text-center"
                      style={{ background: `${recColor}15`, color: recColor, border: `1px solid ${recColor}30` }}
                    >
                      {rec.action}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA strip */}
        <div className="mt-6 rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
              Filter and compare all {PROPERTIES.length} properties
            </div>
            <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Sort by yield, score, risk, city, platform, and fair value in the full analyzer.
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
            <Link
              href="/compare/realt-vs-lofty"
              className="text-[13px] font-medium px-4 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(242,237,230,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              RealT vs Lofty
            </Link>
          </div>
        </div>

        <p className="mt-4 text-[12px]" style={{ color: "rgba(242,237,230,0.25)" }}>
          Rankings refresh hourly. Scores are computed from yield, risk, neighborhood, and fair-value metrics. Not financial advice.
        </p>

        <div className="mt-8">
          <EmailCaptureWidget source="rankings_page" />
        </div>
      </div>
    </PublicShell>
  );
}
