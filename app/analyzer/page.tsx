"use client";

import { useState, useMemo, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PropertyFilters, DEFAULT_FILTERS } from "@/components/property/property-filters";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyRow } from "@/components/property/property-row";
import { ChartView } from "@/components/analyzer/chart-view";
import { CompareDrawer } from "@/components/analyzer/compare-drawer";
import { PROPERTIES } from "@/lib/data/properties";
import { filterAndSort, calcMonthlyReturn, calcPaybackYears } from "@/lib/scoring";
import { getRecommendation } from "@/lib/recommendations";
import { FilterState, SortKey, ViewMode } from "@/lib/types";

export default function AnalyzerPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [investAmount, setInvestAmount] = useState<number>(1000);
  const [investInput, setInvestInput] = useState("1000");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const compareMode = compareIds.length > 0;

  const results = useMemo(
    () => filterAndSort(PROPERTIES, filters, sortKey),
    [filters, sortKey]
  );

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    const buyCount = results.filter((p) => getRecommendation(p, results).action === "Buy").length;
    const avgYield = +(results.reduce((s, p) => s + p.expectedYield, 0) / results.length).toFixed(1);
    const bestYield = Math.max(...results.map((p) => p.expectedYield));
    const avgScore = Math.round(results.reduce((s, p) => s + p.overallScore, 0) / results.length);
    const bestMonthly = calcMonthlyReturn(
      results.slice().sort((a, b) => b.expectedYield - a.expectedYield)[0],
      investAmount
    );
    const bestForInvest = results.slice().sort((a, b) => b.expectedYield - a.expectedYield)[0];
    return { buyCount, avgYield, bestYield, avgScore, bestMonthly, bestForInvest };
  }, [results, investAmount]);

  const toggleCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const compareProperties = useMemo(
    () => compareIds.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean) as typeof PROPERTIES,
    [compareIds]
  );

  const handleInvestChange = (val: string) => {
    setInvestInput(val);
    const n = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(n) && n > 0) setInvestAmount(n);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 pt-7 pb-5" style={{ borderBottom: "1px solid #ebebeb" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-1.5" style={{ color: "#a3a3a3" }}>
                Explore
              </div>
              <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: "#111" }}>
                Property Analyzer
              </h1>
            </div>

            {/* Stats row */}
            {stats && (
              <div className="flex items-center gap-6 flex-wrap">
                <StatPill label="Properties" value={String(results.length)} />
                <StatPill label="Avg Yield" value={`${stats.avgYield}%`} green />
                <StatPill label="Best Yield" value={`${stats.bestYield}%`} green />
                <StatPill label="Buy signals" value={String(stats.buyCount)} accent />
                <StatPill label="Avg Score" value={String(stats.avgScore)} />
              </div>
            )}
          </div>
        </div>

        {/* ROI Calculator strip */}
        <div className="px-6 py-3" style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[12px] font-medium" style={{ color: "#737373" }}>If I invest</span>
            <div className="flex items-center" style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 7, overflow: "hidden" }}>
              <span className="px-2.5 text-[13px]" style={{ color: "#a3a3a3", borderRight: "1px solid #e5e5e5", padding: "5px 8px" }}>€</span>
              <input
                type="text"
                inputMode="numeric"
                value={investInput}
                onChange={(e) => handleInvestChange(e.target.value)}
                className="text-[13px] font-semibold outline-none text-right"
                style={{ width: 80, padding: "5px 10px", color: "#111", background: "transparent" }}
              />
            </div>
            {stats && (
              <>
                <span className="text-[12px]" style={{ color: "#a3a3a3" }}>→</span>
                <span className="text-[12px] font-medium" style={{ color: "#111" }}>
                  best monthly:{" "}
                  <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>
                    €{stats.bestMonthly}
                  </span>
                  <span className="text-[11px] ml-1" style={{ color: "#a3a3a3" }}>
                    from {stats.bestForInvest.name} ({stats.bestForInvest.expectedYield}%)
                  </span>
                </span>
                <span className="text-[11px] ml-2 px-2 py-1 rounded-[5px]" style={{ background: "#f5f5f5", color: "#737373" }}>
                  avg across shown: €{(investAmount * stats.avgYield / 1200).toFixed(2)}/mo
                </span>
              </>
            )}
          </div>
        </div>

        {/* Compare mode bar */}
        {compareMode && (
          <div
            className="px-6 py-2.5 flex items-center gap-3"
            style={{ background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "#3b82f6" }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: "#1d4ed8" }}>
                {compareIds.length} selected
              </span>
            </div>
            <span className="text-[11px]" style={{ color: "#3b82f6" }}>
              {compareIds.length < 2 ? "Select 1 more to compare" : compareIds.length < 3 ? "Select up to 1 more, or compare now" : "Maximum 3 properties"}
            </span>
            <div className="ml-auto flex items-center gap-2">
              {compareIds.length >= 2 && (
                <button
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-[6px] transition-opacity hover:opacity-80"
                  style={{ background: "#3b82f6", color: "#fff" }}
                  onClick={() => setCompareOpen(true)}
                >
                  Compare side-by-side →
                </button>
              )}
              <button
                className="text-[11px] px-2.5 py-1.5 rounded-[6px] transition-opacity hover:opacity-70"
                style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                onClick={() => setCompareIds([])}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ borderBottom: "1px solid #ebebeb" }}>
          <PropertyFilters
            filters={filters}
            sortKey={sortKey}
            viewMode={viewMode}
            onFiltersChange={setFilters}
            onSortChange={setSortKey}
            onViewModeChange={setViewMode}
            resultCount={results.length}
          />
        </div>

        {/* Compare mode hint in filter bar */}
        <div
          className="px-6 py-2 flex items-center gap-2"
          style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}
        >
          <button
            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-[5px] transition-all"
            style={{
              background: compareMode ? "rgba(59,130,246,0.1)" : "transparent",
              border: `1px solid ${compareMode ? "rgba(59,130,246,0.3)" : "#e5e5e5"}`,
              color: compareMode ? "#3b82f6" : "#737373",
            }}
            onClick={() => {
              if (compareMode) setCompareIds([]);
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="0.5" y="0.5" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="6.5" y="0.5" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {compareMode ? `Comparing ${compareIds.length} · click to exit` : "Compare mode — click + on any card"}
          </button>
          <span className="text-[10px]" style={{ color: "#c4c4c4" }}>select up to 3 properties to compare side-by-side</span>
        </div>

        {/* Results */}
        <div className="flex-1 px-6 py-5 overflow-auto">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "#f5f5f5" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 8.5L10 3l7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z" stroke="#a3a3a3" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 18v-6h6v6" stroke="#a3a3a3" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-[14px] font-semibold mb-1.5" style={{ color: "#111" }}>No properties match</div>
              <div className="text-[12px] mb-4" style={{ color: "#a3a3a3" }}>Try adjusting your filters above</div>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[12px] font-semibold px-4 py-2 rounded-[7px] transition-opacity hover:opacity-75"
                style={{ background: "#111", color: "#fff" }}
              >
                Reset filters
              </button>
            </div>
          ) : viewMode === "chart" ? (
            <ChartView properties={results} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  compareMode={true}
                  isCompared={compareIds.includes(p.id)}
                  onCompareToggle={() => toggleCompare(p.id)}
                  investAmount={investAmount}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] overflow-hidden" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              {/* List header */}
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
                <div className="w-5 flex-shrink-0" />
                <div className="w-10 flex-shrink-0" />
                <div className="flex-1 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#a3a3a3" }}>Property</div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] hidden sm:block" style={{ color: "#a3a3a3" }}>Status</div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] hidden md:block" style={{ color: "#a3a3a3" }}>Risk</div>
                <div className="w-16 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden lg:block" style={{ color: "#a3a3a3" }}>Occ.</div>
                <div className="w-16 text-[10px] font-semibold uppercase tracking-[0.6px] text-right" style={{ color: "#a3a3a3" }}>Yield</div>
                <div className="w-16 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden xl:block" style={{ color: "#a3a3a3" }}>Cap Rt.</div>
                <div className="w-16 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden xl:block" style={{ color: "#a3a3a3" }}>Payback</div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden sm:block" style={{ color: "#a3a3a3" }}>Token</div>
                <div className="w-24 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden lg:block" style={{ color: "#a3a3a3" }}>
                  {investAmount > 0 ? `€${investAmount.toLocaleString()}/mo` : "Monthly"}
                </div>
                <div className="w-[38px] text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#a3a3a3" }}>Score</div>
                <div className="w-5 flex-shrink-0" />
              </div>
              {results.map((p) => (
                <PropertyRow
                  key={p.id}
                  property={p}
                  compareMode={true}
                  isCompared={compareIds.includes(p.id)}
                  onCompareToggle={() => toggleCompare(p.id)}
                  investAmount={investAmount}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating compare bar */}
        {compareIds.length >= 2 && !compareOpen && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-full shadow-xl"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {compareIds.length} properties selected
            </span>
            <button
              className="text-[13px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: "#22c55e", color: "#fff" }}
              onClick={() => setCompareOpen(true)}
            >
              Compare →
            </button>
            <button
              className="text-[11px] transition-opacity hover:opacity-60"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onClick={() => setCompareIds([])}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Compare drawer */}
      {compareOpen && compareProperties.length >= 2 && (
        <CompareDrawer
          properties={compareProperties}
          onRemove={(id) => {
            setCompareIds((prev) => {
              const next = prev.filter((x) => x !== id);
              if (next.length < 2) setCompareOpen(false);
              return next;
            });
          }}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </AppShell>
  );
}

function StatPill({ label, value, green, accent }: { label: string; value: string; green?: boolean; accent?: boolean }) {
  return (
    <div className="text-center">
      <div
        className="text-[16px] font-bold leading-tight"
        style={{
          color: green ? "#16a34a" : accent ? "#2563eb" : "#111",
          fontFamily: "var(--font-dm-mono)",
        }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.5px]" style={{ color: "#a3a3a3" }}>
        {label}
      </div>
    </div>
  );
}
