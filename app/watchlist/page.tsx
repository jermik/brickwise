"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PropertyCard } from "@/components/property/property-card";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";

type SortKey = "score" | "yield" | "price" | "monthly";

export default function WatchlistPage() {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [sort, setSort] = useState<SortKey>("score");
  const [investAmount, setInvestAmount] = useState(1000);
  const [investInput, setInvestInput] = useState("1000");

  useEffect(() => {
    try { setIds(JSON.parse(localStorage.getItem("bw_watchlist") || "[]")); } catch { setIds([]); }
    setReady(true);
    function onStorage(e: StorageEvent) {
      if (e.key === "bw_watchlist") {
        try { setIds(JSON.parse(e.newValue || "[]")); } catch { setIds([]); }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleInvest = (v: string) => {
    setInvestInput(v);
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    if (!isNaN(n) && n > 0) setInvestAmount(n);
  };

  const removeId = useCallback((id: number) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem("bw_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = () => {
    setIds([]);
    localStorage.setItem("bw_watchlist", JSON.stringify([]));
  };

  const saved = PROPERTIES.filter((p) => ids.includes(p.id));

  const sorted = [...saved].sort((a, b) => {
    switch (sort) {
      case "yield": return b.expectedYield - a.expectedYield;
      case "price": return a.tokenPrice - b.tokenPrice;
      case "monthly": return b.monthlyRent - a.monthlyRent;
      default: return b.overallScore - a.overallScore;
    }
  });

  const totalMonthly = +(saved.reduce((s, p) => s + investAmount * p.expectedYield / 1200, 0)).toFixed(2);
  const avgYield = saved.length ? +(saved.reduce((s, p) => s + p.expectedYield, 0) / saved.length).toFixed(1) : 0;
  const buyCount = saved.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
  const bestYield = saved.length ? Math.max(...saved.map((p) => p.expectedYield)) : 0;

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-[1100px]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-1.5" style={{ color: "rgba(242,237,230,0.4)" }}>
              Saved
            </div>
            <h1 className="text-[26px] font-normal tracking-[-0.4px]" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Watchlist
            </h1>
          </div>
          {saved.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] font-medium px-3 py-1.5 rounded-[6px] transition-opacity hover:opacity-70 self-start mt-1"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(242,237,230,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Clear all
            </button>
          )}
        </div>

        {!ready ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[12px] animate-pulse" style={{ background: "#1a1611", height: 260 }} />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-5" style={{ background: "rgba(242,237,230,0.04)", border: "1px solid rgba(242,237,230,0.08)" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 2h14a1 1 0 011 1v16l-9-5-9 5V3a1 1 0 011-1z" stroke="rgba(242,237,230,0.35)" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[16px] font-normal mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Your watchlist is empty
            </div>
            <p className="text-[13px] text-center mb-6 max-w-[260px]" style={{ color: "rgba(242,237,230,0.4)" }}>
              Tap the heart icon on any property to save it here for quick reference
            </p>
            <div className="flex gap-3">
              <Link
                href="/analyzer"
                className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85"
                style={{ background: "#22c55e", color: "#0A0907" }}
              >
                Browse analyzer →
              </Link>
              <Link
                href="/"
                className="text-[13px] font-medium px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-70"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats + calculator strip */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 rounded-[12px] overflow-hidden mb-4"
              style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
            >
              {[
                { label: "Saved", value: String(saved.length), sub: `${buyCount} Buy-rated` },
                { label: "Avg yield", value: `${avgYield}%`, sub: `Best: ${bestYield}%`, green: true },
                { label: "Buy signals", value: String(buyCount), sub: `${Math.round((buyCount / saved.length) * 100)}% of saved`, accent: true },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3.5" style={{ background: "#131109" }}>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
                  <div
                    className="text-[18px] font-medium leading-none mb-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : s.accent ? "#3b82f6" : "#F2EDE6" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
                </div>
              ))}

              {/* ROI calculator cell */}
              <div className="px-4 py-3.5 flex flex-col justify-between" style={{ background: "#131109" }}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>
                  If I invest €— each
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex items-center rounded-[5px] overflow-hidden flex-1"
                    style={{ background: "#1a1611", border: "1px solid #2A2420" }}
                  >
                    <span className="px-2 text-[11px]" style={{ color: "rgba(242,237,230,0.3)", borderRight: "1px solid #2A2420" }}>€</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={investInput}
                      onChange={(e) => handleInvest(e.target.value)}
                      className="text-[12px] font-semibold outline-none text-right bg-transparent"
                      style={{ width: 56, padding: "4px 8px", color: "#F2EDE6" }}
                    />
                  </div>
                  <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>→</span>
                  <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>€{totalMonthly}/mo</span>
                </div>
              </div>
            </div>

            {/* Sort bar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>Sort by</span>
              {([
                { key: "score", label: "Best score" },
                { key: "yield", label: "Highest yield" },
                { key: "price", label: "Lowest price" },
                { key: "monthly", label: "Monthly rent" },
              ] as { key: SortKey; label: string }[]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className="px-2.5 py-1 rounded-[5px] text-[11px] font-medium transition-all"
                  style={{
                    background: sort === opt.key ? "rgba(242,237,230,0.1)" : "transparent",
                    border: `1px solid ${sort === opt.key ? "rgba(242,237,230,0.2)" : "rgba(255,255,255,0.06)"}`,
                    color: sort === opt.key ? "#F2EDE6" : "rgba(242,237,230,0.4)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
              <span className="ml-auto text-[11px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                {saved.length} saved
              </span>
            </div>

            {/* Property grid with remove button overlay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.map((p) => (
                <div key={p.id} className="relative group/card">
                  <PropertyCard property={p} investAmount={investAmount} />
                  <button
                    onClick={() => removeId(p.id)}
                    className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.12)" }}
                    title="Remove from watchlist"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 1l6 6M7 1L1 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Compare CTA */}
            <div
              className="mt-6 rounded-[10px] px-5 py-4 flex items-center justify-between gap-4"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div>
                <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
                  Compare your saved properties
                </div>
                <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  Use the Analyzer to compare any selection side-by-side
                </div>
              </div>
              <Link
                href="/analyzer"
                className="text-[12px] font-semibold px-4 py-2 rounded-[7px] no-underline flex-shrink-0 transition-opacity hover:opacity-85"
                style={{ background: "#22c55e", color: "#0A0907" }}
              >
                Open Analyzer →
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
