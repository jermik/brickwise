import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";
import { RecommendationBadge } from "@/components/ui/recommendation-badge";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { WatchlistButton } from "@/components/ui/watchlist-button";
import {
  getRecommendation,
  getConfidence,
  getUrgencySignal,
  getComparison,
  getThousandEuroReturn,
  toPoints,
} from "@/lib/recommendations";
import { PROPERTIES } from "@/lib/data/properties";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = PROPERTIES.find((prop) => prop.id === Number(id));
  if (!p) return { title: "Property not found" };
  return {
    title: `${p.name}, ${p.city} — ${p.expectedYield}% Net Yield | Tokenized Real Estate | Brickwise`,
    description: `${p.shortDescription} ${p.propertyType} in ${p.city}, ${p.country}. Token price €${p.tokenPrice.toFixed(2)}. ${p.overallScore}/100 Brickwise score. Listed on ${p.platform}.`,
    keywords: [
      p.name,
      `tokenized real estate ${p.city}`,
      `fractional property investment ${p.city}`,
      `${p.platform} ${p.city}`,
      `real estate token ${p.country}`,
      `${p.expectedYield}% yield property investment`,
      "tokenized property investment",
      "fractional real estate",
    ],
    openGraph: {
      title: `${p.name} — ${p.expectedYield}% Net Yield | Brickwise`,
      description: p.shortDescription,
      images: [{ url: p.image, alt: p.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — ${p.expectedYield}% Net Yield`,
      description: p.shortDescription,
      images: [p.image],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = PROPERTIES.find((p) => p.id === Number(id));
  if (!property) notFound();
  const p = property;

  const totalFees = p.fees.propertyTax + p.fees.insurance + p.fees.management;
  const netMonthly = p.monthlyRent - totalFees;
  const share100 = 100 / p.totalTokens;
  const totalPropertyValue = Math.round(p.tokenPrice * p.totalTokens);
  const rec = getRecommendation(p, PROPERTIES);
  const conf = getConfidence(p);
  const urgency = getUrgencySignal(p, PROPERTIES);
  const cmp = getComparison(p, PROPERTIES);
  const k1 = getThousandEuroReturn(p, PROPERTIES);
  const attractivePoints = toPoints(p.attractiveNote);
  const riskPoints = toPoints(p.riskNote);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `${p.name} — Tokenized Real Estate`,
        "description": p.shortDescription,
        "image": p.image,
        "brand": { "@type": "Brand", "name": p.platform },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": p.tokenPrice.toFixed(2),
          "availability": "https://schema.org/InStock",
          ...(p.sourceUrl ? { "url": p.sourceUrl } : {}),
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": String(p.overallScore),
          "bestRating": "100",
          "ratingCount": "1",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Analyzer", "item": "https://brickwise.pro/analyzer" },
          { "@type": "ListItem", "position": 2, "name": p.name, "item": `https://brickwise.pro/property/${p.id}` },
        ],
      },
    ],
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="px-6 lg:px-10 py-8 max-w-[960px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[12px]">
          <Link
            href="/analyzer"
            className="no-underline transition-opacity hover:opacity-70"
            style={{ color: "#a3a3a3" }}
          >
            Analyzer
          </Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>{p.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* ── Left ── */}
          <div className="space-y-4">
            {/* Hero image */}
            <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div className="relative h-[260px]">
                <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.7) 100%)",
                  }}
                />
                <div className="absolute bottom-4 left-5">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <div className="text-white text-[19px] font-bold tracking-[-0.4px] leading-tight">
                      {p.name}
                    </div>
                    {p.isNew && (
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-[0.4px]"
                        style={{ background: "#2563eb", color: "#fff" }}
                      >
                        New
                      </span>
                    )}
                    {urgency && (
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-[0.4px]"
                        style={{ background: "#dc2626", color: "#fff" }}
                      >
                        {urgency}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {p.flag} {p.city}, {p.country}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <WatchlistButton propertyId={p.id} size={16} />
                </div>
                <div className="absolute top-4 right-4">
                  <div
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      borderRadius: "50%",
                      padding: 3,
                    }}
                  >
                    <ScoreRing score={p.overallScore} size={52} />
                  </div>
                </div>
              </div>

              {/* Tags row */}
              <div
                className="px-5 py-3.5 flex items-center gap-2.5 flex-wrap"
                style={{ background: "#fff" }}
              >
                <ValueTag status={p.fairValueStatus} />
                <RiskBadge risk={p.risk} />
                <PlatformDot platform={p.platform} />
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded"
                  style={{ background: "#f5f5f5", color: "#737373" }}
                >
                  {p.propertyType}
                </span>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded"
                  style={{ background: "#f5f5f5", color: "#737373" }}
                >
                  Built {p.yearBuilt}
                </span>
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    {tag}
                  </span>
                ))}
                <div className="ml-auto">
                  <WatchlistButton propertyId={p.id} variant="full" size={13} />
                </div>
              </div>
            </div>

            {/* Comparison bar */}
            {(cmp.yieldDelta !== null || cmp.betterThanPct > 0) && (
              <div
                className="rounded-[10px] p-4"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[1px] mb-3"
                  style={{ color: "#64748b" }}
                >
                  How this compares
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {cmp.yieldDelta !== null && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: cmp.yieldDelta > 0 ? "#f0fdf4" : "#fff1f2",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          {cmp.yieldDelta > 0 ? (
                            <path d="M6 2v8M2 6l4-4 4 4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          ) : (
                            <path d="M6 10V2M2 6l4 4 4-4" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <div
                          className="text-[13px] font-bold"
                          style={{ color: cmp.yieldDelta > 0 ? "#16a34a" : "#dc2626" }}
                        >
                          {cmp.yieldDelta > 0 ? "+" : ""}{cmp.yieldDelta}pp vs {p.city} avg
                        </div>
                        <div className="text-[11px]" style={{ color: "#94a3b8" }}>
                          {p.city} avg: {cmp.cityAvgYield}%
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: cmp.betterThanPct >= 70 ? "#f0fdf4" : "#fafafa" }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={cmp.betterThanPct >= 70 ? "#16a34a" : "#94a3b8"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold" style={{ color: "#111" }}>
                        Better than {cmp.betterThanPct}% of listings
                      </div>
                      <div className="text-[11px]" style={{ color: "#94a3b8" }}>
                        by overall score
                      </div>
                    </div>
                  </div>
                  {/* €1k calculator */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "#f0fdf4" }}
                    >
                      <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>€</span>
                    </div>
                    <div>
                      <div
                        className="text-[13px] font-bold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                      >
                        €{k1.monthly.toFixed(2)}/mo per €1,000
                      </div>
                      <div className="text-[11px]" style={{ color: "#94a3b8" }}>
                        = €{k1.annual}/year
                        {k1.vsAvgMonthly > 0 && ` · +€${k1.vsAvgMonthly.toFixed(2)} vs ${p.city} avg`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why this looks attractive — bullet points */}
            <div className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <div className="flex items-center gap-2 mb-3.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Why this looks attractive
                </div>
              </div>
              <ul className="space-y-2.5">
                {attractivePoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                      style={{ background: "#16a34a" }}
                    />
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#404040" }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks to consider — bullet points */}
            <div className="rounded-[10px] p-5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
              <div className="flex items-center gap-2 mb-3.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#fef3c7" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 2.5v3" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="5" cy="7.5" r="0.75" fill="#b45309" />
                  </svg>
                </div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#b45309" }}
                >
                  Risks to consider
                </div>
              </div>
              <ul className="space-y-2.5">
                {riskPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                      style={{ background: "#d97706" }}
                    />
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#78350f" }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Score breakdown */}
            <div className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Score breakdown
                </div>
                <div className="relative group">
                  <div
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center cursor-help text-[10px] font-bold select-none"
                    style={{ background: "#f0f0f0", color: "#a3a3a3" }}
                  >
                    ?
                  </div>
                  <div
                    className="absolute right-0 top-6 w-64 p-3 rounded-[8px] text-[11px] leading-[1.6] z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
                    style={{ background: "#111", color: "rgba(255,255,255,0.85)" }}
                  >
                    Yield score: net yield vs city average. Risk score: occupancy stability,
                    build year, risk profile. Neighbourhood score: location quality and
                    employment anchors. Value score: token price vs estimated fair value.
                    Overall = weighted average (30/25/20/25).
                  </div>
                </div>
              </div>
              <ScoreBar label="Yield score" score={p.yieldScore} />
              <ScoreBar label="Risk score" score={p.riskScore} />
              <ScoreBar label="Neighbourhood score" score={p.neighborhoodScore} />
              <ScoreBar label="Value score" score={p.valueScore} />
              <div
                className="mt-4 pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid #f0f0f0" }}
              >
                <span className="text-[13px] font-semibold" style={{ color: "#111" }}>
                  Overall score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
                    better than {cmp.betterThanPct}% of listings
                  </span>
                  <ScoreRing score={p.overallScore} size={38} />
                </div>
              </div>
            </div>

            {/* Occupancy */}
            <div className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Occupancy rate
                </div>
                <span
                  className="text-[14px] font-medium"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: p.occupancyRate >= 95 ? "#16a34a" : p.occupancyRate >= 88 ? "#d97706" : "#dc2626",
                  }}
                >
                  {p.occupancyRate}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f0f0" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.occupancyRate}%`,
                    background:
                      p.occupancyRate >= 95 ? "#16a34a" : p.occupancyRate >= 88 ? "#d97706" : "#dc2626",
                  }}
                />
              </div>
              <p className="text-[12px] mt-2.5" style={{ color: "#a3a3a3" }}>
                {p.occupancyRate >= 95
                  ? `${p.occupancyRate}% occupied — income is highly reliable. Platform avg: ~92%.`
                  : p.occupancyRate >= 88
                  ? `${p.occupancyRate}% occupied — above platform average. Minor vacancy risk.`
                  : `${p.occupancyRate}% occupied — below 88% threshold. Income may vary significantly.`}
              </p>
            </div>

            {/* Data source */}
            <div
              className="rounded-[10px] px-5 py-4 flex items-center gap-3"
              style={{ background: "#fafafa", border: "1px solid #ebebeb" }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#d4d4d4" }}
              />
              <p className="text-[11px] leading-[1.5]" style={{ color: "#a3a3a3" }}>
                <strong style={{ color: "#737373" }}>Source:</strong> {p.source} ·{" "}
                <strong style={{ color: "#737373" }}>Last updated:</strong> {p.lastUpdated} ·
                Scores computed from yield vs market benchmarks, occupancy history, neighbourhood
                quality, and token fair-value estimate.
              </p>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="space-y-4">
            {/* Verdict */}
            <div
              className="rounded-[10px] p-5"
              style={{
                background:
                  rec.action === "Buy" ? "#f0fdf4" : rec.action === "Avoid" ? "#fff1f2" : "#fafafa",
                border: `1px solid ${
                  rec.action === "Buy" ? "#bbf7d0" : rec.action === "Avoid" ? "#fecdd3" : "#e5e5e5"
                }`,
              }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-2.5"
                style={{
                  color:
                    rec.action === "Buy" ? "#15803d" : rec.action === "Avoid" ? "#be123c" : "#737373",
                }}
              >
                Brickwise verdict
              </div>
              <div className="flex items-start gap-3 mb-3">
                <RecommendationBadge
                  action={rec.action}
                  label={rec.label ?? rec.action}
                />
                <p
                  className="text-[13px] leading-[1.6] flex-1"
                  style={{
                    color:
                      rec.action === "Buy" ? "#166534" : rec.action === "Avoid" ? "#9f1239" : "#525252",
                  }}
                >
                  {rec.reason}
                </p>
              </div>
              <ConfidenceBadge confidence={conf} />
            </div>

            {/* Key numbers */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Key numbers
                </div>
              </div>
              {[
                { label: "Net yield", value: `${p.expectedYield}%`, green: true },
                { label: "Gross yield", value: `${p.grossYield}%` },
                { label: "Monthly rent", value: `€${p.monthlyRent}` },
                { label: "Occupancy", value: `${p.occupancyRate}%` },
                { label: "Property type", value: p.propertyType },
                { label: "Year built", value: String(p.yearBuilt) },
                { label: "Size", value: `${p.squareFeet.toLocaleString()} sqft` },
              ].map(({ label, value, green }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{
                    background: "#fff",
                    borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : undefined,
                  }}
                >
                  <span className="text-[12px]" style={{ color: "#737373" }}>
                    {label}
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{
                      fontFamily: /[%€]|\d/.test(value) ? "var(--font-dm-mono)" : "inherit",
                      color: green ? "#16a34a" : "#111",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* €1k calculator panel */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  If you invest €1,000
                </div>
              </div>
              <div className="px-5 py-4" style={{ background: "#fff" }}>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div
                      className="text-[24px] font-bold tracking-[-0.5px]"
                      style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                    >
                      €{k1.monthly.toFixed(2)}
                    </div>
                    <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                      per month
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[16px] font-semibold"
                      style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                    >
                      €{k1.annual}
                    </div>
                    <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                      per year
                    </div>
                  </div>
                </div>
                {k1.vsAvgMonthly !== 0 && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px]"
                    style={{
                      background: k1.vsAvgMonthly > 0 ? "#f0fdf4" : "#fff1f2",
                      border: `1px solid ${k1.vsAvgMonthly > 0 ? "#d1fae5" : "#fecdd3"}`,
                    }}
                  >
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: k1.vsAvgMonthly > 0 ? "#15803d" : "#be123c" }}
                    >
                      {k1.vsAvgMonthly > 0 ? "+" : ""}€{k1.vsAvgMonthly.toFixed(2)}/mo vs {p.city} average
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Income breakdown · monthly
                </div>
              </div>
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: "#fff", borderBottom: "1px solid #f5f5f5" }}
              >
                <span className="text-[12px]" style={{ color: "#737373" }}>
                  Gross rent
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                >
                  €{p.monthlyRent}
                </span>
              </div>
              {[
                { label: "Property tax", value: p.fees.propertyTax },
                { label: "Insurance", value: p.fees.insurance },
                { label: "Management", value: p.fees.management },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ background: "#fff", borderBottom: "1px solid #f5f5f5" }}
                >
                  <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
                    {label}
                  </span>
                  <span
                    className="text-[12px] font-medium"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#dc2626" }}
                  >
                    −€{value}
                  </span>
                </div>
              ))}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: "#f9fafb" }}
              >
                <span className="text-[12px] font-semibold" style={{ color: "#111" }}>
                  Net income
                </span>
                <span
                  className="text-[14px] font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                >
                  €{netMonthly}
                </span>
              </div>
            </div>

            {/* Returns calculator */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Returns · 100 tokens
                </div>
              </div>
              {[
                {
                  label: "Investment",
                  value: `€${Math.round(p.tokenPrice * 100).toLocaleString("de-DE")}`,
                },
                {
                  label: "Annual net income",
                  value: `€${Math.round(netMonthly * 12 * share100)}`,
                },
                {
                  label: "Monthly net income",
                  value: `€${Math.round(netMonthly * share100)}`,
                },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    background: "#fff",
                    borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : undefined,
                  }}
                >
                  <span className="text-[12px]" style={{ color: "#737373" }}>
                    {label}
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Token info */}
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#a3a3a3" }}
                >
                  Token info
                </div>
              </div>
              {[
                { label: "Token price", value: `€${p.tokenPrice.toFixed(2)}` },
                { label: "Total supply", value: p.totalTokens.toLocaleString("de-DE") },
                {
                  label: "Property value",
                  value: `€${totalPropertyValue.toLocaleString("de-DE")}`,
                },
                { label: "Platform", value: p.platform },
                { label: "Source", value: p.sourceVerified ? "✓ Verified" : "Unverified" },
                { label: "Last updated", value: p.lastUpdated },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{
                    background: "#fff",
                    borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : undefined,
                  }}
                >
                  <span className="text-[12px]" style={{ color: "#737373" }}>
                    {label}
                  </span>
                  <span
                    className="text-[12px] font-medium"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {p.sourceVerified && p.sourceUrl ? (
              <a
                href={p.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-[9px] text-[13px] font-semibold no-underline transition-opacity hover:opacity-90"
                style={{ background: "#111", color: "#fff" }}
              >
                View on {p.platform} →
              </a>
            ) : (
              <div
                className="block w-full text-center py-3 rounded-[9px] text-[13px] font-semibold"
                style={{ background: "#f5f5f5", color: "#a3a3a3", cursor: "not-allowed" }}
              >
                Source unavailable
              </div>
            )}
            <Link
              href="/analyzer"
              className="block w-full text-center py-3 rounded-[9px] text-[13px] font-medium no-underline"
              style={{ background: "transparent", color: "#a3a3a3", border: "1px solid #ebebeb" }}
            >
              ← Back to Analyzer
            </Link>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${p.expectedYield}% net yield · ${p.name}, ${p.city}\n\nScore: ${p.overallScore}/100 · Listed on ${p.platform}`)}&url=${encodeURIComponent(`https://brickwise.pro/property/${p.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-[9px] text-[13px] font-medium no-underline transition-opacity hover:opacity-80"
              style={{ background: "#000", color: "#fff", border: "1px solid #222" }}
            >
              <svg width="12" height="12" viewBox="0 0 1200 1227" fill="none">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284Z" fill="white" />
              </svg>
              Share on X
            </a>

            <p className="text-[10px] leading-[1.6]" style={{ color: "#c4c4c4" }}>
              Scores and yield estimates are for informational purposes only and do not constitute
              financial advice. Past occupancy does not guarantee future income. Always review the
              offering documents on the issuing platform before investing.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
