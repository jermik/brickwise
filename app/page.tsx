import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { EmailCapture } from "@/components/ui/email-capture";
import { PropertyCard } from "@/components/property/property-card";
import { RecommendationBadge } from "@/components/ui/recommendation-badge";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";
import { FallbackImg } from "@/components/ui/fallback-img";
import { PROPERTIES, HOLDINGS } from "@/lib/data/properties";
import {
  getRecommendation,
  getBestPick,
  getConfidence,
  getUrgencySignal,
  getComparison,
  getThousandEuroReturn,
  getAvoidMistakes,
  getMissedInsights,
} from "@/lib/recommendations";

export const metadata: Metadata = {
  title: "Tokenized Real Estate Scored — Lofty & RealT | Brickwise",
  description: `${PROPERTIES.length} tokenized properties scored for yield, risk and fair value on Lofty & RealT. Buy/hold/avoid signals updated daily.`,
  keywords: [
    "best tokenized real estate investment",
    "Lofty best properties",
    "RealT best properties",
    "fractional real estate yield comparison",
    "tokenized property buy signal",
    "best fractional property investment",
    "high yield tokenized real estate",
    "real estate token analysis",
    "passive income tokenized property",
    "fractional property investment returns",
  ],
  openGraph: {
    title: `${PROPERTIES.length} Tokenized Properties Scored — Buy/Hold/Avoid | Brickwise`,
    description: `Get buy/hold/avoid signals for ${PROPERTIES.length} tokenized real estate investments on Lofty and RealT. Yield comparisons, risk scores, and fair value analysis updated daily.`,
    type: "website",
    url: "https://brickwise.pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Tokenized Real Estate — Daily Buy Signals | Brickwise",
    description: `${PROPERTIES.length} properties scored for yield, risk, and fair value. Updated daily.`,
  },
  alternates: {
    canonical: "https://brickwise.pro",
  },
};

const bestPick = getBestPick(PROPERTIES);
const mistakes = getAvoidMistakes(HOLDINGS, PROPERTIES);
const missedInsights = getMissedInsights(HOLDINGS, PROPERTIES);
const latestUpdate = PROPERTIES.reduce(
  (max, p) => (p.lastUpdated > max ? p.lastUpdated : max),
  ""
);

const buyProperties = PROPERTIES.filter(
  (p) => getRecommendation(p, PROPERTIES).action === "Buy" && p.id !== bestPick?.id
)
  .sort((a, b) => b.overallScore - a.overallScore)
  .slice(0, 6);

const avoidProperties = PROPERTIES.filter(
  (p) => getRecommendation(p, PROPERTIES).action === "Avoid"
);

// ── Rankings ───────────────────────────────────────────────────────────
const top5ByScore = [...PROPERTIES].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5);
const top5ByYield = [...PROPERTIES].sort((a, b) => b.expectedYield - a.expectedYield).slice(0, 5);
const bestValueProps = PROPERTIES.filter((p) => p.fairValueStatus === "undervalued").sort((a, b) => b.overallScore - a.overallScore);
const lowestRiskProps = PROPERTIES.filter((p) => p.risk === "Low").sort((a, b) => b.expectedYield - a.expectedYield).slice(0, 5);

// ── Categories ─────────────────────────────────────────────────────────
const byCityEntries = Object.entries(
  PROPERTIES.reduce<Record<string, number>>((acc, p) => {
    acc[p.city] = (acc[p.city] ?? 0) + 1;
    return acc;
  }, {})
).sort((a, b) => b[1] - a[1]);

const yieldBuckets = [
  { label: "8–10%", count: PROPERTIES.filter((p) => p.expectedYield >= 8 && p.expectedYield < 10).length },
  { label: "10–12%", count: PROPERTIES.filter((p) => p.expectedYield >= 10 && p.expectedYield < 12).length },
  { label: "12%+", count: PROPERTIES.filter((p) => p.expectedYield >= 12).length },
];
const riskCounts = {
  Low: PROPERTIES.filter((p) => p.risk === "Low").length,
  Medium: PROPERTIES.filter((p) => p.risk === "Medium").length,
};

// ── Platform coverage ──────────────────────────────────────────────────
const platformCoverage = [
  {
    name: "RealT",
    color: "#3b82f6",
    total: PROPERTIES.filter((p) => p.platform === "RealT").length,
    verified: PROPERTIES.filter((p) => p.platform === "RealT" && p.sourceVerified).length,
    status: "verified" as const,
  },
  {
    name: "Lofty",
    color: "#f97316",
    total: PROPERTIES.filter((p) => p.platform === "Lofty").length,
    verified: PROPERTIES.filter((p) => p.platform === "Lofty" && p.sourceVerified).length,
    status: "partial" as const,
  },
];
const verifiedCount = PROPERTIES.filter((p) => p.sourceVerified).length;

export default function DecisionPage() {
  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tokenized real estate converts property ownership into blockchain tokens, letting investors buy fractional shares of rental properties from as little as $50. Each token entitles the holder to proportional rental income, paid out in USDC stablecoin. Platforms like RealT and Lofty issue these tokens on Ethereum and Algorand respectively.",
        },
      },
      {
        "@type": "Question",
        "name": "What is Brickwise?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Brickwise is an independent tokenized real estate analytics platform. We track ${PROPERTIES.length} properties across RealT and Lofty, score each one for yield, risk, neighborhood quality, and fair value, and give a clear buy/hold/avoid signal so investors know exactly which properties to act on.`,
        },
      },
      {
        "@type": "Question",
        "name": "What is the average yield on tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Across the ${PROPERTIES.length} properties tracked by Brickwise, the average net yield is ${(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(1)}%. Individual properties range from below 6% to over 14%. Net yield is calculated after property management fees, insurance, and property tax.`,
        },
      },
      {
        "@type": "Question",
        "name": "How does RealT work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealT acquires US rental properties through Delaware LLCs and issues ERC-20 tokens representing fractional ownership. Token holders receive weekly rental income in USDC proportional to their token stake. Tokens can be traded on Uniswap or RealT's RMM protocol. Founded in 2019, RealT is the largest tokenized real estate platform by property count.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the difference between RealT and Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealT (realt.co) has the larger catalog and longer track record since 2019. Lofty (lofty.ai) offers a $50 minimum investment, near-instant liquidity via its Proactive Market Maker (PMM), and daily income payouts. See our full RealT vs Lofty comparison for a detailed breakdown.",
        },
      },
      {
        "@type": "Question",
        "name": "Is tokenized real estate safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both RealT and Lofty use SPV (Special Purpose Vehicle) structures, meaning investors hold real legal ownership in the underlying property through LLC shares. However, tokenized real estate carries real estate risk (vacancies, maintenance), platform operational risk, and liquidity risk. It is not a guaranteed investment. Brickwise scores each property for risk to help investors make informed decisions.",
        },
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Tokenized Real Estate Investment Opportunities",
    "description": `Best-rated tokenized property investments across Lofty and RealT — ${PROPERTIES.length} properties scored for yield, risk, and fair value`,
    "url": "https://brickwise.pro",
    "numberOfItems": top5ByScore.length,
    "itemListElement": top5ByScore.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${p.name} — ${p.expectedYield}% Net Yield Tokenized Property`,
      "url": `https://brickwise.pro/property/${p.id}`,
      "description": p.shortDescription,
    })),
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="px-6 lg:px-10 py-9 max-w-[1080px]">
        {/* Header */}
        <div className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            Decision Engine
          </div>
          <h1
            className="text-[30px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            What to do right now
          </h1>
        </div>

        {/* ── Coverage strip ── */}
        <div
          className="reveal reveal-1 flex flex-wrap items-center gap-3 mb-8 px-4 py-3 rounded-[10px]"
          style={{ background: "#1A1713", border: "1px solid #2A2420" }}
        >
          {[
            { value: String(PROPERTIES.length), label: "properties tracked" },
            { value: String(verifiedCount), label: "source-verified listings" },
            { value: `${platformCoverage.length}`, label: "platforms covered" },
            { value: String(PROPERTIES.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length), label: "active buy signals" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className="text-[13px] font-bold"
                style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
              >
                {s.value}
              </span>
              <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
                {s.label}
              </span>
              <span className="text-[#e5e5e5] ml-1.5">·</span>
            </div>
          ))}
          <span
            className="text-[11px] font-medium ml-auto px-2.5 py-1 rounded-[5px]"
            style={{ background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.22)" }}
          >
            Curated · not scraped
          </span>
        </div>

        {/* ── Best pick today ── */}
        <div className="reveal reveal-2">
        {bestPick && (() => {
          const rec = getRecommendation(bestPick, PROPERTIES);
          const conf = getConfidence(bestPick);
          const urgency = getUrgencySignal(bestPick, PROPERTIES);
          const cmp = getComparison(bestPick, PROPERTIES);
          const k1 = getThousandEuroReturn(bestPick, PROPERTIES);

          return (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <div
                    className="text-[18px] font-normal"
                    style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
                  >
                    Best pick today
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                    One property. The strongest signal right now.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {bestPick.isNew && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-[5px] uppercase tracking-[0.4px]"
                      style={{ background: "rgba(59,130,246,0.08)", color: "#2563eb", border: "1px solid rgba(59,130,246,0.25)" }}
                    >
                      New
                    </span>
                  )}
                  {urgency && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-[5px] uppercase tracking-[0.4px]"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      {urgency}
                    </span>
                  )}
                  {rec.label === "Best Buy" && (
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-[5px]"
                      style={{ background: "#22c55e", color: "#fff" }}
                    >
                      ★ Best Buy
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/property/${bestPick.id}`} className="block no-underline group">
                <div
                  className="rounded-[12px] overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                  style={{ border: "1px solid rgba(34,197,94,0.22)", background: "#131109" }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0 overflow-hidden">
                      <FallbackImg
                        src={bestPick.image}
                        alt={bestPick.name}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)",
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <div
                          style={{
                            background: "rgba(10,9,7,0.75)",
                            backdropFilter: "blur(6px)",
                            borderRadius: "50%",
                            padding: 3,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <ScoreRing score={bestPick.overallScore} size={40} />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                          style={{
                            background: "rgba(0,0,0,0.45)",
                            backdropFilter: "blur(6px)",
                            color: "rgba(255,255,255,0.9)",
                            padding: "2px 8px",
                            borderRadius: 4,
                          }}
                        >
                          <PlatformDot platform={bestPick.platform} light />
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div className="min-w-0">
                            <div
                              className="text-[19px] font-normal truncate"
                              style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
                            >
                              {bestPick.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                                {bestPick.flag} {bestPick.city}
                              </span>
                              <ValueTag status={bestPick.fairValueStatus} />
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <RecommendationBadge action="Buy" reason={rec.reason} />
                          </div>
                        </div>

                        {/* Comparison bar */}
                        {cmp.yieldDelta !== null && cmp.yieldDelta > 0 && (
                          <div
                            className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[7px]"
                            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 2v8M2 6l4-4 4 4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[11px]" style={{ color: "#4ade80" }}>
                              <strong>+{cmp.yieldDelta}pp</strong> above {bestPick.city} average ·{" "}
                              better than <strong>{cmp.betterThanPct}%</strong> of platform listings
                            </span>
                          </div>
                        )}

                        {/* €1k calculator */}
                        <div
                          className="flex items-center gap-3 mt-3 px-3 py-2 rounded-[7px]"
                          style={{ background: "#1A1713", border: "1px solid #2A2420" }}
                        >
                          <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>
                            €1,000 invested →
                          </span>
                          <span
                            className="text-[13px] font-bold"
                            style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                          >
                            €{k1.monthly.toFixed(2)}/mo
                          </span>
                          <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                            = €{k1.annual}/year
                          </span>
                          {k1.vsAvgMonthly > 0 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>
                              +€{k1.vsAvgMonthly.toFixed(2)} vs avg
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div
                        className="rounded-[8px] overflow-hidden mt-4 grid grid-cols-2 sm:grid-cols-4"
                        style={{ gap: 1, background: "#2A2420" }}
                      >
                        {[
                          { label: "Net yield", value: `${bestPick.expectedYield}%`, green: true },
                          { label: "Monthly rent", value: `€${bestPick.monthlyRent}` },
                          { label: "Token price", value: `€${bestPick.tokenPrice.toFixed(2)}` },
                          { label: "Occupancy", value: `${bestPick.occupancyRate}%` },
                        ].map((s) => (
                          <div key={s.label} className="px-3 py-2.5" style={{ background: "#131109" }}>
                            <div
                              className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1"
                              style={{ color: "rgba(242,237,230,0.4)" }}
                            >
                              {s.label}
                            </div>
                            <div
                              className="text-[13px] font-medium"
                              style={{
                                fontFamily: "var(--font-dm-mono)",
                                color: s.green ? "#22c55e" : "#F2EDE6",
                              }}
                            >
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <ConfidenceBadge confidence={conf} showReason={false} />
                        <div
                          className="text-[12px] font-semibold px-4 py-2 rounded-[7px] transition-opacity group-hover:opacity-80"
                          style={{ background: "#F2EDE6", color: "#0A0907" }}
                        >
                          View full analysis →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })()}
        </div>

        {/* ── Reality check ── */}
        {mistakes.length > 0 && (
          <div className="reveal reveal-3 mb-8">
            <div className="mb-3.5">
              <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                Reality check on your holdings
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                Patterns in your portfolio worth reconsidering
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {mistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-[10px] px-5 py-4 flex items-start gap-3.5"
                  style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1L11 10H1L6 1z" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M6 4.5v2.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="6" cy="9" r="0.6" fill="#d97706" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#fcd34d" }}>
                      {m.message}
                    </div>
                    <div className="text-[12px]" style={{ color: "#f59e0b" }}>
                      {m.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Missed profit ── */}
        {missedInsights.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                  You could be earning more
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                  Same capital, higher-rated property — here's what you're leaving on the table
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missedInsights.map((insight) => (
                <div
                  key={`${insight.held.id}-${insight.better.id}`}
                  className="rounded-[10px] p-5"
                  style={{ background: "#131109", border: "1px solid #2A2420" }}
                >
                  {/* Currently holding */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-0.5"
                        style={{ color: "rgba(242,237,230,0.4)" }}
                      >
                        You currently hold
                      </div>
                      <div className="text-[13px] font-semibold truncate" style={{ color: "#F2EDE6" }}>
                        {insight.held.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {insight.held.flag} {insight.held.city} ·{" "}
                        <span style={{ fontFamily: "var(--font-dm-mono)", color: "#f59e0b" }}>
                          {insight.held.expectedYield}%
                        </span>{" "}
                        yield
                      </div>
                    </div>
                    <RecommendationBadge action="Hold" size="sm" />
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px" style={{ background: "#242018" }} />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex-1 h-px" style={{ background: "#242018" }} />
                  </div>

                  {/* Better option */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-0.5"
                        style={{ color: "#4ade80" }}
                      >
                        Better alternative available
                      </div>
                      <div className="text-[13px] font-semibold truncate" style={{ color: "#F2EDE6" }}>
                        {insight.better.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {insight.better.flag} {insight.better.city} ·{" "}
                        <span style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>
                          {insight.better.expectedYield}%
                        </span>{" "}
                        yield
                      </div>
                    </div>
                    <RecommendationBadge
                      action="Buy"
                      label={insight.better.overallScore >= 84 ? "Best Buy" : "Buy"}
                      size="sm"
                    />
                  </div>

                  {/* Impact: monthly + annual */}
                  <div
                    className="rounded-[7px] px-4 py-3 mb-3.5"
                    style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium" style={{ color: "#4ade80" }}>
                        You could earn more
                      </span>
                      <span
                        className="text-[18px] font-bold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                      >
                        +€{insight.deltaMonthly}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: "rgba(74,222,128,0.6)" }}>
                        Same €{insight.investmentAmount.toLocaleString("de-DE")} investment
                      </span>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#4ade80" }}
                      >
                        +€{insight.deltaAnnual}/year
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] mb-4" style={{ color: "rgba(242,237,230,0.4)" }}>
                    Yield gap +{insight.deltaYield}pp · switching to {insight.better.name} would earn{" "}
                    <strong style={{ color: "rgba(242,237,230,0.7)" }}>+€{insight.deltaAnnual} more this year</strong>
                  </div>

                  <Link
                    href={`/property/${insight.better.id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[12px] font-semibold no-underline transition-opacity hover:opacity-80"
                    style={{ background: "#F2EDE6", color: "#0A0907" }}
                  >
                    Switch to this property →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Best opportunities ── */}
        {buyProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                  Other strong buys
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                  {buyProperties.length} more properties rated Buy · sorted by score
                </div>
              </div>
              <Link
                href="/analyzer"
                className="text-[12px] font-medium no-underline px-3 py-[5px] rounded-[6px]"
                style={{ color: "#F2EDE6", border: "1px solid #2A2420", background: "#1A1713" }}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {buyProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── Rankings ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                Rankings
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                Every list ranks the same {PROPERTIES.length} properties — no padding, no duplicates
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: "Top opportunities", sub: "by overall score", items: top5ByScore, metric: (p: typeof PROPERTIES[0]) => `${p.overallScore}/100`, metricLabel: "score" },
              { title: "Highest yield", sub: "net yield after fees", items: top5ByYield, metric: (p: typeof PROPERTIES[0]) => `${p.expectedYield}%`, metricLabel: "yield" },
              { title: "Best value", sub: "undervalued token price", items: bestValueProps.slice(0, 5), metric: (p: typeof PROPERTIES[0]) => `${p.expectedYield}%`, metricLabel: "yield" },
              { title: "Lowest risk", sub: "Low risk rating only", items: lowestRiskProps, metric: (p: typeof PROPERTIES[0]) => `${p.expectedYield}%`, metricLabel: "yield" },
            ].map((list) => (
              <div
                key={list.title}
                className="rounded-[10px] overflow-hidden"
                style={{ background: "#131109", border: "1px solid #2A2420" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #252018" }}>
                  <div className="text-[12px] font-bold" style={{ color: "#F2EDE6" }}>{list.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>{list.sub}</div>
                </div>
                {list.items.length === 0 ? (
                  <div className="px-4 py-5 text-[11px] text-center" style={{ color: "rgba(242,237,230,0.4)" }}>No properties in this category yet</div>
                ) : (
                  list.items.map((p, i) => {
                    const cmp = getComparison(p, PROPERTIES);
                    const rec = getRecommendation(p, PROPERTIES);
                    const recColor = rec.action === "Buy" ? "#22c55e" : rec.action === "Avoid" ? "#dc2626" : "#f59e0b";
                    return (
                      <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                        <div
                          className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#fafafa]"
                          style={{ borderBottom: "1px solid #222018" }}
                        >
                          <span
                            className="text-[10px] font-bold w-4 flex-shrink-0 text-center"
                            style={{ color: i === 0 ? "#22c55e" : "rgba(242,237,230,0.18)" }}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>{p.flag} {p.city}</span>
                              <span
                                className="text-[9px] font-medium"
                                style={{ color: recColor }}
                              >
                                · {rec.action}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div
                              className="text-[12px] font-bold"
                              style={{ fontFamily: "var(--font-dm-mono)", color: i === 0 ? "#22c55e" : "#F2EDE6" }}
                            >
                              {list.metric(p)}
                            </div>
                            {cmp.betterThanPct > 0 && (
                              <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                                top {100 - cmp.betterThanPct}%
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Category breakdown ── */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* By city */}
          <div
            className="rounded-[10px] p-4"
            style={{ background: "#131109", border: "1px solid #2A2420" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#F2EDE6" }}>By city</div>
            <div className="space-y-2">
              {byCityEntries.map(([city, count]) => (
                <div key={city} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate" style={{ color: "rgba(242,237,230,0.7)" }}>{city}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: Math.max(16, (count / PROPERTIES.length) * 80),
                        background: "#e5e5e5",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: "100%", background: "#22c55e", opacity: 0.6 + (count / PROPERTIES.length) * 0.4 }}
                      />
                    </div>
                    <span className="text-[11px] font-medium w-4 text-right" style={{ color: "rgba(242,237,230,0.45)" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By yield range */}
          <div
            className="rounded-[10px] p-4"
            style={{ background: "#131109", border: "1px solid #2A2420" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#F2EDE6" }}>By yield range</div>
            <div className="space-y-2.5">
              {yieldBuckets.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <div className="w-12 text-[11px] font-medium flex-shrink-0" style={{ color: "rgba(242,237,230,0.7)" }}>{b.label}</div>
                  <div className="flex-1 h-5 rounded-[4px] overflow-hidden" style={{ background: "#1A1510" }}>
                    <div
                      className="h-full rounded-[4px] flex items-center px-2"
                      style={{
                        width: `${Math.max(12, (b.count / PROPERTIES.length) * 100)}%`,
                        background: b.label === "12%+" ? "#22c55e" : b.label === "10–12%" ? "#f59e0b" : "#d4d4d4",
                        transition: "width 0.3s",
                      }}
                    >
                      <span className="text-[10px] font-bold text-white">{b.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #252018" }}>
              <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                Avg yield: <strong style={{ color: "#F2EDE6" }}>{(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* By risk */}
          <div
            className="rounded-[10px] p-4"
            style={{ background: "#131109", border: "1px solid #2A2420" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#F2EDE6" }}>By risk level</div>
            <div className="space-y-2.5">
              {([["Low", "#22c55e"], ["Medium", "#f59e0b"]] as [keyof typeof riskCounts, string][]).map(([level, color]) => (
                <div key={level} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px] font-medium" style={{ color: "rgba(242,237,230,0.7)" }}>{level}</span>
                  </div>
                  <div className="flex-1 h-5 rounded-[4px] overflow-hidden" style={{ background: "#1A1510" }}>
                    <div
                      className="h-full rounded-[4px] flex items-center px-2"
                      style={{
                        width: `${Math.max(12, (riskCounts[level] / PROPERTIES.length) * 100)}%`,
                        background: color,
                        opacity: 0.75,
                      }}
                    >
                      <span className="text-[10px] font-bold text-white">{riskCounts[level]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #252018" }}>
              <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                {Math.round((riskCounts.Low / PROPERTIES.length) * 100)}% of listings rated Low risk
              </div>
            </div>
          </div>
        </div>

        {/* ── Platform coverage ── */}
        <div className="mb-8">
          <div className="mb-3.5">
            <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>Platform coverage</div>
            <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
              We track every listing manually. No scrapers, no feeds, no synthetic data.
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformCoverage.map((p) => (
              <div
                key={p.name}
                className="rounded-[10px] px-5 py-4 flex items-center gap-4"
                style={{ background: "#131109", border: "1px solid #2A2420" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ background: p.color + "18", border: `1.5px solid ${p.color}30` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold" style={{ color: "#F2EDE6" }}>{p.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(242,237,230,0.45)" }}>
                    {p.total} properties · {p.verified > 0 ? `${p.verified} source-verified` : "verification in progress"}
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-[4px] flex-shrink-0"
                  style={p.status === "verified"
                    ? { background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.22)" }
                    : { background: "rgba(245,158,11,0.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }
                  }
                >
                  {p.status === "verified" ? "Verified" : "Partial"}
                </span>
              </div>
            ))}
            {/* Coming soon slot */}
            <div
              className="rounded-[10px] px-5 py-4 flex items-center gap-4"
              style={{ background: "#1C1815", border: "1px dashed #2A2420" }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "#1A1510", border: "1.5px dashed #e5e5e5" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="rgba(242,237,230,0.18)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-semibold" style={{ color: "rgba(242,237,230,0.4)" }}>More platforms coming</div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(242,237,230,0.18)" }}>Blocksquare, Arrived, others</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Avoid ── */}
        {avoidProperties.length > 0 && (
          <div>
            <div className="mb-3.5">
              <div className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                Properties to avoid
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                Token price, yield, or occupancy disqualifies these from consideration
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {avoidProperties.map((p) => {
                const rec = getRecommendation(p, PROPERTIES);
                return (
                  <Link
                    key={p.id}
                    href={`/property/${p.id}`}
                    className="block no-underline rounded-[10px] overflow-hidden"
                    style={{ border: "1px solid rgba(239,68,68,0.2)", background: "#131109" }}
                  >
                    <div className="relative h-[120px] overflow-hidden">
                      <FallbackImg
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full object-cover opacity-70"
                        fallback="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80&auto=format&fit=crop"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.55) 100%)",
                        }}
                      />
                      <div className="absolute bottom-2.5 left-3">
                        <div className="text-white text-[13px] font-semibold">{p.name}</div>
                        <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                          {p.flag} {p.city}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <RecommendationBadge action="Avoid" reason={rec.reason} />
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          { label: "Score", value: String(p.overallScore) },
                          { label: "Yield", value: `${p.expectedYield}%` },
                          { label: "Occupancy", value: `${p.occupancyRate}%` },
                        ].map((s) => (
                          <div key={s.label}>
                            <div
                              className="text-[9px] font-semibold uppercase tracking-[0.5px] mb-0.5"
                              style={{ color: "rgba(242,237,230,0.4)" }}
                            >
                              {s.label}
                            </div>
                            <div
                              className="text-[12px] font-medium"
                              style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
                            >
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Email digest */}
        <div className="mb-8">
          <EmailCapture
            source="homepage"
            heading="Weekly market digest"
            subtext={`Top properties, yield changes, and buy signals across all ${PROPERTIES.length} listings — every Monday.`}
          />
        </div>

        {/* Footer trust signal */}
        <div
          className="mt-10 pt-6 flex items-center gap-3"
          style={{ borderTop: "1px solid #242018" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4d4d4" }} />
          <p className="text-[10px] leading-[1.6]" style={{ color: "#c4c4c4" }}>
            {verifiedCount} source-verified listings across {platformCoverage.length} platforms · Last updated{" "}
            {new Date(latestUpdate + "T00:00:00").toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}{" "}
            · Curated manually — no scrapers, no synthetic data · Scores computed from yield, risk, neighbourhood, and fair-value metrics. Not financial advice.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
