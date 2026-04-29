import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmailCapture } from "@/components/ui/email-capture";
import { PropertyCard } from "@/components/property/property-card";
import { RecommendationBadge } from "@/components/ui/recommendation-badge";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";
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
  title: "Best Tokenized Real Estate Investments — Lofty & RealT Analysis | Brickwise",
  description: `${PROPERTIES.length} tokenized properties scored for yield, risk, and fair value across Lofty and RealT. Get buy/hold/avoid signals, yield comparisons, and daily market insights for fractional real estate investing.`,
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
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="px-6 lg:px-10 py-9 max-w-[1080px]">
        {/* Header */}
        <div className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "#a3a3a3", letterSpacing: "0.04em" }}
          >
            Decision Engine
          </div>
          <h1
            className="text-[30px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
          >
            What to do right now
          </h1>
        </div>

        {/* ── Coverage strip ── */}
        <div
          className="flex flex-wrap items-center gap-3 mb-8 px-4 py-3 rounded-[10px]"
          style={{ background: "#F2EEE6", border: "1px solid #E0DAD0" }}
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
                style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
              >
                {s.value}
              </span>
              <span className="text-[12px]" style={{ color: "#737373" }}>
                {s.label}
              </span>
              <span className="text-[#e5e5e5] ml-1.5">·</span>
            </div>
          ))}
          <span
            className="text-[11px] font-medium ml-auto px-2.5 py-1 rounded-[5px]"
            style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #d1fae5" }}
          >
            Curated · not scraped
          </span>
        </div>

        {/* ── Best pick today ── */}
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
                    style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
                  >
                    Best pick today
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
                    One property. The strongest signal right now.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {bestPick.isNew && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-[5px] uppercase tracking-[0.4px]"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                    >
                      New
                    </span>
                  )}
                  {urgency && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-[5px] uppercase tracking-[0.4px]"
                      style={{ background: "#fff0f0", color: "#dc2626", border: "1px solid #fecaca" }}
                    >
                      {urgency}
                    </span>
                  )}
                  {rec.label === "Best Buy" && (
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-[5px]"
                      style={{ background: "#16a34a", color: "#fff" }}
                    >
                      ★ Best Buy
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/property/${bestPick.id}`} className="block no-underline group">
                <div
                  className="rounded-[12px] overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                  style={{ border: "1px solid #d1fae5", background: "#F8F5F0" }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={bestPick.image}
                        alt={bestPick.name}
                        referrerPolicy="no-referrer"
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
                            background: "rgba(255,255,255,0.92)",
                            borderRadius: "50%",
                            padding: 2,
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
                              style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
                            >
                              {bestPick.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[12px]" style={{ color: "#a3a3a3" }}>
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
                            style={{ background: "#f0fdf4", border: "1px solid #d1fae5" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 2v8M2 6l4-4 4 4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[11px]" style={{ color: "#15803d" }}>
                              <strong>+{cmp.yieldDelta}pp</strong> above {bestPick.city} average ·{" "}
                              better than <strong>{cmp.betterThanPct}%</strong> of platform listings
                            </span>
                          </div>
                        )}

                        {/* €1k calculator */}
                        <div
                          className="flex items-center gap-3 mt-3 px-3 py-2 rounded-[7px]"
                          style={{ background: "#F2EEE6", border: "1px solid #E0DAD0" }}
                        >
                          <span className="text-[11px]" style={{ color: "#737373" }}>
                            €1,000 invested →
                          </span>
                          <span
                            className="text-[13px] font-bold"
                            style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                          >
                            €{k1.monthly.toFixed(2)}/mo
                          </span>
                          <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
                            = €{k1.annual}/year
                          </span>
                          {k1.vsAvgMonthly > 0 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                              +€{k1.vsAvgMonthly.toFixed(2)} vs avg
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div
                        className="rounded-[8px] overflow-hidden mt-4 grid grid-cols-2 sm:grid-cols-4"
                        style={{ gap: 1, background: "#E0DAD0" }}
                      >
                        {[
                          { label: "Net yield", value: `${bestPick.expectedYield}%`, green: true },
                          { label: "Monthly rent", value: `€${bestPick.monthlyRent}` },
                          { label: "Token price", value: `€${bestPick.tokenPrice.toFixed(2)}` },
                          { label: "Occupancy", value: `${bestPick.occupancyRate}%` },
                        ].map((s) => (
                          <div key={s.label} className="px-3 py-2.5" style={{ background: "#F8F5F0" }}>
                            <div
                              className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1"
                              style={{ color: "#a3a3a3" }}
                            >
                              {s.label}
                            </div>
                            <div
                              className="text-[13px] font-medium"
                              style={{
                                fontFamily: "var(--font-dm-mono)",
                                color: s.green ? "#16a34a" : "#111",
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
                          style={{ background: "#111", color: "#fff" }}
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

        {/* ── Reality check ── */}
        {mistakes.length > 0 && (
          <div className="mb-8">
            <div className="mb-3.5">
              <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                Reality check on your holdings
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
                Patterns in your portfolio worth reconsidering
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {mistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-[10px] px-5 py-4 flex items-start gap-3.5"
                  style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: "#fef3c7", border: "1px solid #fde68a" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1L11 10H1L6 1z" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M6 4.5v2.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="6" cy="9" r="0.6" fill="#d97706" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#92400e" }}>
                      {m.message}
                    </div>
                    <div className="text-[12px]" style={{ color: "#b45309" }}>
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
                <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                  You could be earning more
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
                  Same capital, higher-rated property — here's what you're leaving on the table
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missedInsights.map((insight) => (
                <div
                  key={`${insight.held.id}-${insight.better.id}`}
                  className="rounded-[10px] p-5"
                  style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
                >
                  {/* Currently holding */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-0.5"
                        style={{ color: "#a3a3a3" }}
                      >
                        You currently hold
                      </div>
                      <div className="text-[13px] font-semibold truncate" style={{ color: "#111" }}>
                        {insight.held.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "#a3a3a3" }}>
                        {insight.held.flag} {insight.held.city} ·{" "}
                        <span style={{ fontFamily: "var(--font-dm-mono)", color: "#b45309" }}>
                          {insight.held.expectedYield}%
                        </span>{" "}
                        yield
                      </div>
                    </div>
                    <RecommendationBadge action="Hold" size="sm" />
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px" style={{ background: "#f0f0f0" }} />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex-1 h-px" style={{ background: "#f0f0f0" }} />
                  </div>

                  {/* Better option */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-0.5"
                        style={{ color: "#15803d" }}
                      >
                        Better alternative available
                      </div>
                      <div className="text-[13px] font-semibold truncate" style={{ color: "#111" }}>
                        {insight.better.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "#a3a3a3" }}>
                        {insight.better.flag} {insight.better.city} ·{" "}
                        <span style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}>
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
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium" style={{ color: "#15803d" }}>
                        You could earn more
                      </span>
                      <span
                        className="text-[18px] font-bold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                      >
                        +€{insight.deltaMonthly}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: "#86efac" }}>
                        Same €{insight.investmentAmount.toLocaleString("de-DE")} investment
                      </span>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#15803d" }}
                      >
                        +€{insight.deltaAnnual}/year
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] mb-4" style={{ color: "#a3a3a3" }}>
                    Yield gap +{insight.deltaYield}pp · switching to {insight.better.name} would earn{" "}
                    <strong style={{ color: "#555" }}>+€{insight.deltaAnnual} more this year</strong>
                  </div>

                  <Link
                    href={`/property/${insight.better.id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[12px] font-semibold no-underline transition-opacity hover:opacity-80"
                    style={{ background: "#111", color: "#fff" }}
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
                <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                  Other strong buys
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
                  {buyProperties.length} more properties rated Buy · sorted by score
                </div>
              </div>
              <Link
                href="/analyzer"
                className="text-[12px] font-medium no-underline px-3 py-[5px] rounded-[6px]"
                style={{ color: "#111", border: "1px solid #ebebeb", background: "#fff" }}
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
              <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                Rankings
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
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
                style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #EAE5DC" }}>
                  <div className="text-[12px] font-bold" style={{ color: "#111" }}>{list.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#a3a3a3" }}>{list.sub}</div>
                </div>
                {list.items.length === 0 ? (
                  <div className="px-4 py-5 text-[11px] text-center" style={{ color: "#a3a3a3" }}>No properties in this category yet</div>
                ) : (
                  list.items.map((p, i) => {
                    const cmp = getComparison(p, PROPERTIES);
                    const rec = getRecommendation(p, PROPERTIES);
                    const recColor = rec.action === "Buy" ? "#16a34a" : rec.action === "Avoid" ? "#dc2626" : "#b45309";
                    return (
                      <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                        <div
                          className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#fafafa]"
                          style={{ borderBottom: "1px solid #f9f9f9" }}
                        >
                          <span
                            className="text-[10px] font-bold w-4 flex-shrink-0 text-center"
                            style={{ color: i === 0 ? "#16a34a" : "#c3c3c3" }}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold truncate" style={{ color: "#111" }}>{p.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px]" style={{ color: "#a3a3a3" }}>{p.flag} {p.city}</span>
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
                              style={{ fontFamily: "var(--font-dm-mono)", color: i === 0 ? "#16a34a" : "#111" }}
                            >
                              {list.metric(p)}
                            </div>
                            {cmp.betterThanPct > 0 && (
                              <div className="text-[9px]" style={{ color: "#a3a3a3" }}>
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
            style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#111" }}>By city</div>
            <div className="space-y-2">
              {byCityEntries.map(([city, count]) => (
                <div key={city} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate" style={{ color: "#333" }}>{city}</div>
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
                        style={{ width: "100%", background: "#16a34a", opacity: 0.6 + (count / PROPERTIES.length) * 0.4 }}
                      />
                    </div>
                    <span className="text-[11px] font-medium w-4 text-right" style={{ color: "#737373" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By yield range */}
          <div
            className="rounded-[10px] p-4"
            style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#111" }}>By yield range</div>
            <div className="space-y-2.5">
              {yieldBuckets.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <div className="w-12 text-[11px] font-medium flex-shrink-0" style={{ color: "#333" }}>{b.label}</div>
                  <div className="flex-1 h-5 rounded-[4px] overflow-hidden" style={{ background: "#f5f5f5" }}>
                    <div
                      className="h-full rounded-[4px] flex items-center px-2"
                      style={{
                        width: `${Math.max(12, (b.count / PROPERTIES.length) * 100)}%`,
                        background: b.label === "12%+" ? "#16a34a" : b.label === "10–12%" ? "#b45309" : "#d4d4d4",
                        transition: "width 0.3s",
                      }}
                    >
                      <span className="text-[10px] font-bold text-white">{b.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f5f5f5" }}>
              <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                Avg yield: <strong style={{ color: "#111" }}>{(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* By risk */}
          <div
            className="rounded-[10px] p-4"
            style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
          >
            <div className="text-[12px] font-bold mb-3" style={{ color: "#111" }}>By risk level</div>
            <div className="space-y-2.5">
              {([["Low", "#16a34a"], ["Medium", "#b45309"]] as [keyof typeof riskCounts, string][]).map(([level, color]) => (
                <div key={level} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px] font-medium" style={{ color: "#333" }}>{level}</span>
                  </div>
                  <div className="flex-1 h-5 rounded-[4px] overflow-hidden" style={{ background: "#f5f5f5" }}>
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
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f5f5f5" }}>
              <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                {Math.round((riskCounts.Low / PROPERTIES.length) * 100)}% of listings rated Low risk
              </div>
            </div>
          </div>
        </div>

        {/* ── Platform coverage ── */}
        <div className="mb-8">
          <div className="mb-3.5">
            <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Platform coverage</div>
            <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
              We track every listing manually. No scrapers, no feeds, no synthetic data.
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformCoverage.map((p) => (
              <div
                key={p.name}
                className="rounded-[10px] px-5 py-4 flex items-center gap-4"
                style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
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
                  <div className="text-[13px] font-bold" style={{ color: "#111" }}>{p.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#737373" }}>
                    {p.total} properties · {p.verified > 0 ? `${p.verified} source-verified` : "verification in progress"}
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-[4px] flex-shrink-0"
                  style={p.status === "verified"
                    ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #d1fae5" }
                    : { background: "#fff7ed", color: "#b45309", border: "1px solid #fed7aa" }
                  }
                >
                  {p.status === "verified" ? "Verified" : "Partial"}
                </span>
              </div>
            ))}
            {/* Coming soon slot */}
            <div
              className="rounded-[10px] px-5 py-4 flex items-center gap-4"
              style={{ background: "#fafafa", border: "1px dashed #e5e5e5" }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "#f5f5f5", border: "1.5px dashed #e5e5e5" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="#c3c3c3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-semibold" style={{ color: "#a3a3a3" }}>More platforms coming</div>
                <div className="text-[10px] mt-0.5" style={{ color: "#c3c3c3" }}>Blocksquare, Arrived, others</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Avoid ── */}
        {avoidProperties.length > 0 && (
          <div>
            <div className="mb-3.5">
              <div className="text-[18px] font-normal" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                Properties to avoid
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
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
                    style={{ border: "1px solid #fecdd3", background: "#fff" }}
                  >
                    <div className="relative h-[120px] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-70"
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
                              style={{ color: "#a3a3a3" }}
                            >
                              {s.label}
                            </div>
                            <div
                              className="text-[12px] font-medium"
                              style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
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
          style={{ borderTop: "1px solid #f0f0f0" }}
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
    </AppShell>
  );
}
