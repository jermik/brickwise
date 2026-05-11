import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { EmailCapture } from "@/components/ui/email-capture";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";
import { ScoreRing } from "@/components/ui/score-ring";
import { FallbackImg } from "@/components/ui/fallback-img";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

export const metadata: Metadata = {
  title: { absolute: "Tokenized Real Estate Market Overview — Brickwise" },
  description: `Live market overview for ${PROPERTIES.length} tokenized real estate investments on Lofty & RealT. Current yields, buy signals, and city-level data.`,
  keywords: [
    "tokenized real estate market overview",
    "fractional property yield analysis",
    "Lofty RealT market comparison",
    "real estate token market data",
    "fractional property investment returns",
  ],
  openGraph: {
    title: "Tokenized Real Estate Market Overview — Brickwise",
    description: `Live market overview for ${PROPERTIES.length} tokenized real estate investments on Lofty & RealT.`,
    type: "website",
    url: "https://brickwise.pro/market",
    images: [{ url: "/market/opengraph-image", width: 1200, height: 630, alt: "Brickwise tokenized real estate market overview" }],
  },
  alternates: { canonical: "https://brickwise.pro/market" },
};

interface MarketUpdate {
  date: string;
  slug: string;
  title: string;
  highlights: string[];
  stats: { totalListings: number; avgYield: number; topYield: number; topYieldCity: string };
}
const updates = marketUpdatesRaw as unknown as MarketUpdate[];

// ── Live market stats ──────────────────────────────────────────────────────
const recs = PROPERTIES.map((p) => ({ p, rec: getRecommendation(p, PROPERTIES) }));
const buyCount = recs.filter((r) => r.rec.action === "Buy").length;
const holdCount = recs.filter((r) => r.rec.action === "Hold").length;
const avoidCount = recs.filter((r) => r.rec.action === "Avoid").length;

const avgYield = +(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(1);
const maxYield = Math.max(...PROPERTIES.map((p) => p.expectedYield));
const avgScore = Math.round(PROPERTIES.reduce((s, p) => s + p.overallScore, 0) / PROPERTIES.length);
const verifiedCount = PROPERTIES.filter((p) => p.sourceVerified).length;

const yieldBuckets = [
  { label: "<6%", min: 0, max: 6, color: "#64748b" },
  { label: "6–8%", min: 6, max: 8, color: "#94a3b8" },
  { label: "8–10%", min: 8, max: 10, color: "#f59e0b" },
  { label: "10–12%", min: 10, max: 12, color: "#22c55e" },
  { label: "12%+", min: 12, max: 99, color: "#4ade80" },
].map((b) => ({
  ...b,
  count: PROPERTIES.filter((p) => p.expectedYield >= b.min && p.expectedYield < b.max).length,
}));
const maxBucket = Math.max(...yieldBuckets.map((b) => b.count));

const realtProps = PROPERTIES.filter((p) => p.platform === "RealT");
const loftyProps = PROPERTIES.filter((p) => p.platform === "Lofty");

function platformStats(props: typeof PROPERTIES) {
  if (!props.length) return { avgYield: 0, avgScore: 0, buyPct: 0, count: 0 };
  return {
    count: props.length,
    avgYield: +(props.reduce((s, p) => s + p.expectedYield, 0) / props.length).toFixed(1),
    avgScore: Math.round(props.reduce((s, p) => s + p.overallScore, 0) / props.length),
    buyPct: Math.round(
      (props.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length / props.length) * 100
    ),
  };
}

const realtStats = platformStats(realtProps);
const loftyStats = platformStats(loftyProps);

const cities = [...new Set(PROPERTIES.map((p) => p.city))];
const cityData = cities
  .map((city) => {
    const props = PROPERTIES.filter((p) => p.city === city);
    return {
      city,
      flag: props[0]?.flag ?? "🏠",
      count: props.length,
      avgYield: +(props.reduce((s, p) => s + p.expectedYield, 0) / props.length).toFixed(1),
      avgScore: Math.round(props.reduce((s, p) => s + p.overallScore, 0) / props.length),
      buyCount: props.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length,
      topYield: Math.max(...props.map((p) => p.expectedYield)),
    };
  })
  .filter((c) => c.count >= 2)
  .sort((a, b) => b.avgYield - a.avgYield)
  .slice(0, 10);

const topBuys = recs
  .filter((r) => r.rec.action === "Buy")
  .sort((a, b) => b.p.overallScore - a.p.overallScore)
  .slice(0, 6);

const undervalued = PROPERTIES.filter((p) => p.fairValueStatus === "undervalued")
  .sort((a, b) => b.overallScore - a.overallScore)
  .slice(0, 5);

const newListings = PROPERTIES.filter((p) => p.isNew).slice(0, 4);

const lastUpdated = PROPERTIES.reduce((max, p) => (p.lastUpdated > max ? p.lastUpdated : max), "");
const lastUpdatedFmt = lastUpdated
  ? new Date(lastUpdated + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  : "—";

export default function MarketPage() {
  return (
    <PublicShell>
      <div className="px-6 lg:px-10 py-8 max-w-[1100px]">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Market Intelligence
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-[28px] font-normal leading-tight tracking-[-0.4px]" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Market Overview
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
                {PROPERTIES.length} listings tracked · Updated {lastUpdatedFmt}
              </span>
            </div>
          </div>
        </div>

        {/* ── Key stats ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-[12px] overflow-hidden mb-6"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Properties tracked", value: String(PROPERTIES.length), sub: `${verifiedCount} source-verified` },
            { label: "Avg net yield", value: `${avgYield}%`, sub: `Range ${Math.min(...PROPERTIES.map(p => p.expectedYield))}–${maxYield}%`, green: true },
            { label: "Active buy signals", value: String(buyCount), sub: `${Math.round((buyCount / PROPERTIES.length) * 100)}% of listings`, accent: true },
            { label: "Avg overall score", value: `${avgScore}`, sub: "out of 100" },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4" style={{ background: "#131109" }}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1.5" style={{ color: "rgba(242,237,230,0.35)" }}>
                {s.label}
              </div>
              <div
                className="text-[22px] font-medium leading-none tracking-[-0.4px] mb-1"
                style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : s.accent ? "#3b82f6" : "#F2EDE6" }}
              >
                {s.value}
              </div>
              <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Signal distribution + Yield distribution ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Signal distribution */}
          <div className="rounded-[12px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.8px] mb-4" style={{ color: "rgba(242,237,230,0.4)" }}>
              Signal Distribution
            </div>
            <div className="space-y-3">
              {[
                { label: "Buy", count: buyCount, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
                { label: "Hold", count: holdCount, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
                { label: "Avoid", count: avoidCount, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-semibold" style={{ color: s.color }}>{s.label}</span>
                    <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.7)" }}>
                      {s.count} <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>({Math.round((s.count / PROPERTIES.length) * 100)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.count / PROPERTIES.length) * 100}%`, background: s.color, opacity: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 grid grid-cols-3 gap-2" style={{ borderTop: "1px solid #2A2420" }}>
              {[
                { label: "Low risk", value: String(PROPERTIES.filter(p => p.risk === "Low").length) },
                { label: "Undervalued", value: String(undervalued.length) },
                { label: "New listings", value: String(newListings.length) },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[14px] font-semibold mb-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}>{s.value}</div>
                  <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Yield distribution */}
          <div className="rounded-[12px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.8px] mb-4" style={{ color: "rgba(242,237,230,0.4)" }}>
              Yield Distribution
            </div>
            <div className="flex items-end gap-2 h-[100px]">
              {yieldBuckets.map((b) => {
                const pct = maxBucket > 0 ? (b.count / maxBucket) * 100 : 0;
                return (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: b.color }}>{b.count}</span>
                    <div
                      className="w-full rounded-t-[3px]"
                      style={{ height: `${Math.max(4, pct)}%`, background: b.color, opacity: 0.8, minHeight: b.count > 0 ? 4 : 0 }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {yieldBuckets.map((b) => (
                <div key={b.label} className="flex-1 text-center">
                  <span className="text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.4)" }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 flex items-center gap-4" style={{ borderTop: "1px solid #2A2420" }}>
              <div>
                <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>Avg yield </span>
                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{avgYield}%</span>
              </div>
              <div>
                <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>Peak yield </span>
                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#4ade80" }}>{maxYield}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top buy signals ── */}
        {topBuys.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="text-[16px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                  Top buy signals right now
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                  {buyCount} properties rated Buy · sorted by overall score
                </div>
              </div>
              <Link
                href="/analyzer"
                className="text-[12px] font-medium no-underline px-3 py-[5px] rounded-[6px]"
                style={{ color: "#F2EDE6", border: "1px solid #2A2420", background: "#1A1713" }}
              >
                View all in Analyzer →
              </Link>
            </div>
            <div className="rounded-[12px] overflow-hidden" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              {topBuys.map(({ p, rec }, i) => (
                <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                  <div
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#1a1611]"
                    style={{ borderBottom: i < topBuys.length - 1 ? "1px solid #1e1a14" : undefined }}
                  >
                    <span className="text-[11px] font-bold w-5 text-center flex-shrink-0" style={{ fontFamily: "var(--font-dm-mono)", color: i === 0 ? "#22c55e" : "rgba(242,237,230,0.2)" }}>
                      {i + 1}
                    </span>
                    <FallbackImg
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-9 h-9 rounded-[6px] object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate mb-0.5" style={{ color: "#F2EDE6" }}>{p.name}</div>
                      <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {p.flag} {p.city} · {p.platform} · {p.propertyType}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block w-16">
                      <div className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{p.expectedYield}%</div>
                      <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>yield</div>
                    </div>
                    <div className="text-right flex-shrink-0 hidden md:block w-20">
                      <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.5)", fontFamily: "var(--font-dm-mono)" }}>€{p.tokenPrice.toFixed(2)}</div>
                      <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>token</div>
                    </div>
                    <div className="flex-shrink-0">
                      <ScoreRing score={p.overallScore} size={34} />
                    </div>
                    <div
                      className="text-[12px] font-bold px-2 py-0.5 rounded-[4px] flex-shrink-0"
                      style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                    >
                      {rec.label ?? rec.action}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Platform head-to-head ── */}
        <div className="mb-6">
          <div className="text-[16px] font-normal mb-3.5" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Platform comparison
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "RealT", stats: realtStats, color: "#3b82f6", desc: "US-based platform, primarily Detroit & Midwest properties with HUD-backed tenants" },
              { name: "Lofty", stats: loftyStats, color: "#f97316", desc: "Multi-city US platform, higher token liquidity, wider geographic diversification" },
            ].map(({ name, stats, color, desc }) => (
              <div key={name} className="rounded-[12px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-[15px] font-semibold" style={{ color: "#F2EDE6" }}>{name}</span>
                  <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>{stats.count} properties</span>
                </div>
                <p className="text-[11px] mb-4 leading-[1.6]" style={{ color: "rgba(242,237,230,0.45)" }}>{desc}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Avg yield", value: `${stats.avgYield}%`, highlight: true },
                    { label: "Avg score", value: String(stats.avgScore) },
                    { label: "Buy rate", value: `${stats.buyPct}%`, green: true },
                  ].map((m) => (
                    <div key={m.label} className="rounded-[6px] p-2.5 text-center" style={{ background: "#1a1611" }}>
                      <div
                        className="text-[15px] font-semibold mb-0.5"
                        style={{
                          fontFamily: "var(--font-dm-mono)",
                          color: m.green ? "#22c55e" : m.highlight ? color : "#F2EDE6",
                        }}
                      >
                        {m.value}
                      </div>
                      <div className="text-[12px] uppercase tracking-[0.5px]" style={{ color: "rgba(242,237,230,0.35)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── City leaders ── */}
        {cityData.length > 0 && (
          <div className="mb-6">
            <div className="text-[16px] font-normal mb-3.5" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              City leaders by avg yield
            </div>
            <div className="rounded-[12px] overflow-hidden" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div
                className="grid px-5 py-2.5"
                style={{
                  borderBottom: "1px solid #2A2420",
                  gridTemplateColumns: "24px 1fr 60px 60px 50px 60px",
                  gap: "0 12px",
                }}
              >
                {["#", "City", "Listings", "Avg Yield", "Buys", "Avg Score"].map((h) => (
                  <div key={h} className="text-[12px] font-bold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.3)" }}>{h}</div>
                ))}
              </div>
              {cityData.map((c, i) => (
                <div
                  key={c.city}
                  className="grid px-5 py-3 items-center"
                  style={{
                    borderBottom: i < cityData.length - 1 ? "1px solid #1a1611" : undefined,
                    gridTemplateColumns: "24px 1fr 60px 60px 50px 60px",
                    gap: "0 12px",
                  }}
                >
                  <span className="text-[11px] font-bold" style={{ color: i === 0 ? "#22c55e" : "rgba(242,237,230,0.2)", fontFamily: "var(--font-dm-mono)" }}>
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-[12px] font-semibold" style={{ color: "#F2EDE6" }}>{c.flag} {c.city}</div>
                    <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>top: {c.topYield}% yield</div>
                  </div>
                  <div className="text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.6)" }}>{c.count}</div>
                  <div className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{c.avgYield}%</div>
                  <div className="text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6" }}>{c.buyCount}</div>
                  <div className="text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.6)" }}>{c.avgScore}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Undervalued right now ── */}
        {undervalued.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="text-[16px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                  Undervalued tokens
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                  Token price below estimated fair value — margin of safety on entry
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {undervalued.map((p) => {
                const rec = getRecommendation(p, PROPERTIES);
                return (
                  <Link key={p.id} href={`/property/${p.id}`} className="block no-underline group">
                    <div
                      className="rounded-[10px] p-4 h-full transition-opacity group-hover:opacity-85"
                      style={{ background: "#131109", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      <FallbackImg
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-[80px] object-cover rounded-[6px] mb-3"
                      />
                      <div className="text-[12px] font-semibold truncate mb-0.5" style={{ color: "#F2EDE6" }}>{p.name}</div>
                      <div className="text-[12px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>{p.flag} {p.city}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{p.expectedYield}%</span>
                        <span
                          className="text-[12px] font-bold px-1.5 py-0.5 rounded-[3px]"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                        >
                          {rec.action}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── New listings ── */}
        {newListings.length > 0 && (
          <div className="mb-6">
            <div className="text-[16px] font-normal mb-3.5" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              New this week
            </div>
            <div className="flex gap-3 flex-wrap">
              {newListings.map((p) => (
                <Link key={p.id} href={`/property/${p.id}`} className="no-underline group">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-[9px] transition-opacity group-hover:opacity-80"
                    style={{ background: "#131109", border: "1px solid rgba(59,130,246,0.25)" }}
                  >
                    <FallbackImg
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-9 h-9 rounded-[5px] object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="text-[12px] font-semibold" style={{ color: "#F2EDE6" }}>{p.name}</div>
                      <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {p.flag} {p.city} · <span style={{ color: "#22c55e" }}>{p.expectedYield}%</span>
                      </div>
                    </div>
                    <span
                      className="text-[12px] font-bold px-1.5 py-0.5 rounded-[3px] flex-shrink-0"
                      style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                    >
                      New
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Past reports ── */}
        {updates.length > 0 && (
          <div className="mb-8">
            <div className="text-[16px] font-normal mb-3.5" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Past reports
            </div>
            <div className="space-y-2">
              {updates.slice(0, 5).map((u) => (
                <Link
                  key={u.slug}
                  href={`/market/${u.slug}`}
                  className="flex items-start justify-between gap-4 px-5 py-3.5 rounded-[10px] no-underline transition-opacity hover:opacity-80"
                  style={{ background: "#131109", border: "1px solid #2A2420" }}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate mb-0.5" style={{ color: "#F2EDE6" }}>{u.title}</div>
                    <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                      {u.stats.totalListings} listings · avg {u.stats.avgYield}% · top {u.stats.topYield}% in {u.stats.topYieldCity}
                    </div>
                  </div>
                  <div className="text-[11px] flex-shrink-0" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.35)" }}>
                    {u.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Email capture ── */}
        <EmailCapture
          source="market"
          heading="Weekly market digest"
          subtext={`Top properties, yield shifts, and buy signals across all ${PROPERTIES.length} listings — every Monday.`}
        />

        {/* ── Footer ── */}
        <div className="mt-8 pt-5 flex items-center gap-3" style={{ borderTop: "1px solid #2A2420" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4d4d4" }} />
          <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.3)" }}>
            {verifiedCount} source-verified listings · Last updated {lastUpdatedFmt} · Not financial advice.
          </p>
        </div>

      </div>
    </PublicShell>
  );
}
