import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
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
  title: "Decision Engine — Brickwise",
  description: "What to buy, avoid, and reconsider right now.",
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

export default function DecisionPage() {
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-9 max-w-[1080px]">
        {/* Header */}
        <div className="mb-8">
          <div
            className="text-[11px] font-medium uppercase tracking-[0.6px] mb-1.5"
            style={{ color: "#a3a3a3" }}
          >
            Decision Engine
          </div>
          <h1
            className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ color: "#111" }}
          >
            What to do right now
          </h1>
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
                    className="text-[14px] font-bold tracking-[-0.2px]"
                    style={{ color: "#111" }}
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
                  style={{ border: "1px solid #d1fae5", background: "#fff" }}
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
                              className="text-[16px] font-bold tracking-[-0.3px] truncate"
                              style={{ color: "#111" }}
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
                          style={{ background: "#fafafa", border: "1px solid #ebebeb" }}
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
                        style={{ gap: 1, background: "#ebebeb" }}
                      >
                        {[
                          { label: "Net yield", value: `${bestPick.expectedYield}%`, green: true },
                          { label: "Monthly rent", value: `€${bestPick.monthlyRent}` },
                          { label: "Token price", value: `€${bestPick.tokenPrice.toFixed(2)}` },
                          { label: "Occupancy", value: `${bestPick.occupancyRate}%` },
                        ].map((s) => (
                          <div key={s.label} className="px-3 py-2.5" style={{ background: "#fff" }}>
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
              <div className="text-[14px] font-bold tracking-[-0.2px]" style={{ color: "#111" }}>
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
                <div className="text-[14px] font-bold tracking-[-0.2px]" style={{ color: "#111" }}>
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
                  style={{ background: "#fff", border: "1px solid #ebebeb" }}
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
                <div className="text-[14px] font-bold tracking-[-0.2px]" style={{ color: "#111" }}>
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

        {/* ── Avoid ── */}
        {avoidProperties.length > 0 && (
          <div>
            <div className="mb-3.5">
              <div className="text-[14px] font-bold tracking-[-0.2px]" style={{ color: "#111" }}>
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

        {/* Footer trust signal */}
        <div
          className="mt-10 pt-6 flex items-center gap-3"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4d4d4" }} />
          <p className="text-[10px] leading-[1.6]" style={{ color: "#c4c4c4" }}>
            Source: RealT verified dataset · Last updated{" "}
            {new Date(latestUpdate + "T00:00:00").toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}{" "}
            · Scores computed from yield, risk, neighbourhood, and fair-value metrics. Not financial advice.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
