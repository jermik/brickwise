import type { Metadata } from "next";
import Link from "next/link";
import { HOLDINGS, PROPERTIES, INCOME_HISTORY } from "@/lib/data/properties";
import { getMissedInsights, getAvoidMistakes, getRecommendation } from "@/lib/recommendations";
import { MiniChart } from "@/components/ui/mini-chart";
import { ScoreRing } from "@/components/ui/score-ring";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "My Tokenized Real Estate Portfolio — Income & Yield Tracker | Brickwise",
  description: "Track your tokenized real estate holdings, monthly rental income, and yield performance across Lofty and RealT. See portfolio-level insights and better alternatives.",
  robots: { index: false, follow: false },
};

export default function PortfolioPage() {
  const totalValue = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  const latestIncome = INCOME_HISTORY[INCOME_HISTORY.length - 1].value;
  const prevIncome = INCOME_HISTORY[INCOME_HISTORY.length - 2]?.value ?? latestIncome;
  const incomeDelta = latestIncome - prevIncome;

  const holdingProps = HOLDINGS.map((h) => {
    const p = PROPERTIES.find((x) => x.id === h.propertyId)!;
    const monthlyIncome = Math.round((h.currentValue * p.expectedYield) / 100 / 12);
    return { h, p, monthlyIncome };
  });

  const weightedYield =
    holdingProps.reduce((sum, { h, p }) => sum + h.currentValue * p.expectedYield, 0) /
    totalValue;

  const missed = getMissedInsights(HOLDINGS, PROPERTIES);
  const mistakes = getAvoidMistakes(HOLDINGS, PROPERTIES);

  const chartData = INCOME_HISTORY.map((d) => ({ month: d.month, value: d.value }));

  return (
    <AppShell>
    <div className="max-w-[820px] mx-auto px-6 py-8">
      {/* Demo notice */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-[8px] mb-6"
        style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
          <path d="M7 1L13 12H1L7 1z" stroke="#d97706" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M7 5.5v3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="7" cy="10" r="0.5" fill="#d97706" stroke="#d97706" strokeWidth="0.5"/>
        </svg>
        <p className="text-[12px] leading-relaxed" style={{ color: "#92400e" }}>
          <strong>Demo portfolio.</strong> This shows illustrative holdings to demonstrate what Brickwise can do. Real wallet integration and personalised holdings are coming soon.
        </p>
      </div>

      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-1">
          <h1
            className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ color: "#111" }}
          >
            Portfolio
          </h1>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-0.5 rounded-[4px]"
            style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
          >
            Demo
          </span>
        </div>
        <p className="text-[13px]" style={{ color: "#a3a3a3" }}>
          This is sample data to demonstrate the product. Not your real holdings.
        </p>
      </div>

      {/* KPI bar */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 rounded-[10px] overflow-hidden mb-5"
        style={{ border: "1px solid #ebebeb", background: "#ebebeb", gap: 1 }}
      >
        {[
          {
            label: "Total Value",
            value: `€${totalValue.toLocaleString("de-DE")}`,
            sub: `${HOLDINGS.length} properties`,
          },
          {
            label: "Monthly Income",
            value: `€${latestIncome}`,
            sub: incomeDelta >= 0 ? `+€${incomeDelta} vs last month` : `-€${Math.abs(incomeDelta)} vs last month`,
            subGreen: incomeDelta >= 0,
          },
          {
            label: "Avg Yield",
            value: `${weightedYield.toFixed(1)}%`,
            sub: "weighted by value",
          },
          {
            label: "Holdings",
            value: `${HOLDINGS.length}`,
            sub: `${holdingProps.filter(({ p }) => getRecommendation(p, PROPERTIES).action === "Buy").length} rated Buy`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="px-5 py-4" style={{ background: "#fff" }}>
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-1.5"
              style={{ color: "#a3a3a3" }}
            >
              {kpi.label}
            </div>
            <div
              className="text-[20px] font-medium leading-none tracking-[-0.4px] mb-1"
              style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
            >
              {kpi.value}
            </div>
            <div
              className="text-[11px]"
              style={{ color: kpi.subGreen ? "#16a34a" : "#a3a3a3" }}
            >
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Income chart */}
      <div
        className="rounded-[10px] p-5 mb-5"
        style={{ background: "#fff", border: "1px solid #ebebeb" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              className="text-[12px] font-semibold mb-0.5"
              style={{ color: "#111" }}
            >
              Monthly Income
            </div>
            <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
              Net rental income, trailing {INCOME_HISTORY.length} months
            </div>
          </div>
          <div
            className="text-[20px] font-medium tracking-[-0.4px]"
            style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
          >
            €{latestIncome}/mo
          </div>
        </div>
        <MiniChart data={chartData} showLabels={true} />
      </div>

      {/* Holdings list */}
      <div
        className="rounded-[10px] overflow-hidden mb-5"
        style={{ background: "#fff", border: "1px solid #ebebeb" }}
      >
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f5f5f5" }}
        >
          <div
            className="text-[12px] font-semibold"
            style={{ color: "#111" }}
          >
            Holdings
          </div>
          <Link
            href="/"
            className="text-[11px] font-medium no-underline"
            style={{ color: "#16a34a" }}
          >
            Browse properties →
          </Link>
        </div>

        {holdingProps.map(({ h, p, monthlyIncome }, i) => {
          const rec = getRecommendation(p, PROPERTIES);
          const isLast = i === holdingProps.length - 1;
          return (
            <Link
              key={h.propertyId}
              href={`/property/${p.id}`}
              className="flex items-center gap-4 px-5 py-3.5 no-underline group"
              style={!isLast ? { borderBottom: "1px solid #f5f5f5" } : undefined}
            >
              <img
                src={p.image}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-[7px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-semibold truncate mb-0.5 group-hover:opacity-70 transition-opacity duration-150"
                  style={{ color: "#111" }}
                >
                  {p.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
                    {p.flag} {p.city}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px]"
                    style={{
                      background:
                        rec.action === "Buy"
                          ? "#f0fdf4"
                          : rec.action === "Avoid"
                          ? "#fef2f2"
                          : "#fafaf9",
                      color:
                        rec.action === "Buy"
                          ? "#16a34a"
                          : rec.action === "Avoid"
                          ? "#dc2626"
                          : "#78716c",
                    }}
                  >
                    {rec.action}
                  </span>
                </div>
              </div>

              {/* Tokens */}
              <div className="text-right hidden sm:block flex-shrink-0 w-20">
                <div
                  className="text-[12px] font-medium leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                >
                  {h.tokens}
                </div>
                <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                  tokens
                </div>
              </div>

              {/* Monthly */}
              <div className="text-right flex-shrink-0 w-20">
                <div
                  className="text-[12px] font-medium leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                >
                  €{monthlyIncome}/mo
                </div>
                <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                  {p.expectedYield}% yield
                </div>
              </div>

              {/* Value */}
              <div className="text-right flex-shrink-0 w-24">
                <div
                  className="text-[13px] font-semibold leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
                >
                  €{h.currentValue.toLocaleString("de-DE")}
                </div>
                <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                  market value
                </div>
              </div>

              {/* Score */}
              <div className="flex-shrink-0">
                <ScoreRing score={p.overallScore} size={32} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Missed profit */}
      {missed.length > 0 && (
        <div
          className="rounded-[10px] overflow-hidden mb-5"
          style={{ background: "#fff", border: "1px solid #ebebeb" }}
        >
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: "1px solid #f5f5f5" }}
          >
            <div
              className="text-[12px] font-semibold mb-0.5"
              style={{ color: "#111" }}
            >
              Missed profit opportunities
            </div>
            <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
              Higher-yield Buy-rated properties you could switch to
            </div>
          </div>
          {missed.map((m, i) => {
            const isLast = i === missed.length - 1;
            return (
              <div
                key={m.better.id}
                className="px-5 py-4 flex items-start gap-4"
                style={!isLast ? { borderBottom: "1px solid #f5f5f5" } : undefined}
              >
                <img
                  src={m.better.image}
                  alt={m.better.name}
                  className="w-10 h-10 rounded-[7px] object-cover flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div
                        className="text-[13px] font-semibold truncate mb-0.5"
                        style={{ color: "#111" }}
                      >
                        {m.better.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                        vs your {m.held.name}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className="text-[14px] font-semibold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
                      >
                        +€{m.deltaMonthly}/mo
                      </div>
                      <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                        +€{m.deltaAnnual}/yr
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] mb-2" style={{ color: "#737373" }}>
                    {m.better.expectedYield}% yield · score {m.better.overallScore} · {m.better.flag} {m.better.city}
                  </div>
                  <Link
                    href={`/property/${m.better.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold no-underline px-3 py-1.5 rounded-[5px] transition-opacity hover:opacity-80"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    Switch to this property →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Risk warnings */}
      {mistakes.length > 0 && (
        <div
          className="rounded-[10px] overflow-hidden"
          style={{ background: "#fff", border: "1px solid #ebebeb" }}
        >
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: "1px solid #f5f5f5" }}
          >
            <div
              className="text-[12px] font-semibold mb-0.5"
              style={{ color: "#111" }}
            >
              Holdings to review
            </div>
            <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
              Properties in your portfolio with risk signals
            </div>
          </div>
          {mistakes.map((m, i) => {
            const isLast = i === mistakes.length - 1;
            return (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4"
                style={!isLast ? { borderBottom: "1px solid #f5f5f5" } : undefined}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#f59e0b" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[12px] font-semibold mb-0.5"
                    style={{ color: "#111" }}
                  >
                    {m.message}
                  </div>
                  <div className="text-[11px]" style={{ color: "#737373" }}>
                    {m.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </AppShell>
  );
}
