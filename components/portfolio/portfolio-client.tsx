"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useHoldings } from "@/lib/hooks/use-holdings";
import { PROPERTIES } from "@/lib/data/properties";
import { getMissedInsights, getAvoidMistakes, getRecommendation } from "@/lib/recommendations";
import { MiniChart } from "@/components/ui/mini-chart";
import { ScoreRing } from "@/components/ui/score-ring";
import { AppShell } from "@/components/layout/app-shell";
import { Holding } from "@/lib/types";

// ── Add Holding Modal ──────────────────────────────────────────────────────
function AddHoldingModal({
  onClose,
  onAdd,
  existingIds,
}: {
  onClose: () => void;
  onAdd: (h: Holding) => void;
  existingIds: number[];
}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tokens, setTokens] = useState("");
  const [value, setValue] = useState("");

  const selected = PROPERTIES.find((p) => p.id === selectedId);

  const filtered = PROPERTIES.filter(
    (p) =>
      !existingIds.includes(p.id) &&
      (search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.platform.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 7);

  const handleTokenChange = (t: string) => {
    setTokens(t);
    if (selected && t && !isNaN(parseFloat(t))) {
      setValue(String(Math.round(selected.tokenPrice * parseFloat(t))));
    }
  };

  const canSubmit = selectedId && tokens && value && parseFloat(tokens) > 0 && parseFloat(value) > 0;

  const handleSubmit = () => {
    if (!canSubmit || !selectedId) return;
    onAdd({ propertyId: selectedId, tokens: Math.round(parseFloat(tokens)), currentValue: parseFloat(value) });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] rounded-[14px] overflow-hidden"
        style={{ background: "#131109", border: "1px solid #2A2420", boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #2A2420" }}
        >
          <span className="text-[14px] font-semibold" style={{ color: "#F2EDE6" }}>
            Add holding
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 rounded-[5px] transition-opacity hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.5)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Property selector */}
          <div>
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-2"
              style={{ color: "rgba(242,237,230,0.35)" }}
            >
              Property
            </div>
            {selected ? (
              <div
                className="flex items-center gap-3 p-3 rounded-[8px]"
                style={{ background: "#1C1815", border: "1px solid #2A2420" }}
              >
                <img
                  src={selected.image}
                  alt={selected.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-[5px] object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate" style={{ color: "#F2EDE6" }}>
                    {selected.name}
                  </div>
                  <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                    {selected.flag} {selected.city} · {selected.expectedYield}% yield · €{selected.tokenPrice.toFixed(2)}/token
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedId(null); setTokens(""); setValue(""); }}
                  className="text-[11px] transition-opacity hover:opacity-70"
                  style={{ color: "rgba(242,237,230,0.4)" }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search by name, city, or platform..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
                  style={{
                    background: "#1C1815",
                    border: "1px solid #2A2420",
                    color: "#F2EDE6",
                  }}
                />
                {filtered.length > 0 && (
                  <div
                    className="mt-1.5 rounded-[8px] overflow-hidden"
                    style={{ border: "1px solid #2A2420" }}
                  >
                    {filtered.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedId(p.id); setSearch(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-opacity hover:opacity-80"
                        style={{
                          background: "#1C1815",
                          borderBottom: i < filtered.length - 1 ? "1px solid #2A2420" : undefined,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-[4px] object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium truncate" style={{ color: "#F2EDE6" }}>
                            {p.name}
                          </div>
                          <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                            {p.flag} {p.city} · {p.platform} · {p.expectedYield}% yield
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-semibold flex-shrink-0"
                          style={{ color: "#22c55e", fontFamily: "var(--font-dm-mono)" }}
                        >
                          €{p.tokenPrice.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {search && filtered.length === 0 && (
                  <div className="mt-2 text-[12px] text-center py-3" style={{ color: "rgba(242,237,230,0.35)" }}>
                    No properties found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inputs */}
          {selected && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-2"
                    style={{ color: "rgba(242,237,230,0.35)" }}
                  >
                    Tokens owned
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={tokens}
                    onChange={(e) => handleTokenChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
                    style={{
                      background: "#1C1815",
                      border: "1px solid #2A2420",
                      color: "#F2EDE6",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  />
                </div>
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-2"
                    style={{ color: "rgba(242,237,230,0.35)" }}
                  >
                    Value (€)
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Auto-calculated"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
                    style={{
                      background: "#1C1815",
                      border: "1px solid #2A2420",
                      color: "#F2EDE6",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  />
                </div>
              </div>

              {tokens && value && parseFloat(value) > 0 && (
                <div
                  className="px-3 py-2.5 rounded-[8px] text-[11px]"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#4ade80" }}
                >
                  Est. monthly income:{" "}
                  <strong>€{Math.round((parseFloat(value) * selected.expectedYield) / 1200)}/mo</strong>{" "}
                  at {selected.expectedYield}% yield
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity disabled:opacity-25"
            style={{ background: "#22c55e", color: "#0A0907" }}
          >
            Add to portfolio
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <AppShell>
      <div className="max-w-[820px] mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-5"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="8" width="18" height="12" rx="2" stroke="#22c55e" strokeWidth="1.4" />
            <path d="M7 8V6a4 4 0 018 0v2" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M11 12v4M9 14h4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-[18px] font-semibold mb-2" style={{ color: "#F2EDE6" }}>
          No holdings yet
        </h2>
        <p className="text-[13px] text-center mb-6 max-w-[280px]" style={{ color: "rgba(242,237,230,0.45)" }}>
          Add the tokenized properties you own and track your real income and portfolio analytics.
        </p>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-85"
          style={{ background: "#22c55e", color: "#0A0907" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Add your first holding
        </button>
        <Link
          href="/"
          className="mt-4 text-[12px] no-underline transition-opacity hover:opacity-70"
          style={{ color: "rgba(242,237,230,0.4)" }}
        >
          Browse properties →
        </Link>
      </div>
    </AppShell>
  );
}

// ── Main portfolio client ──────────────────────────────────────────────────
export function PortfolioClient() {
  const { holdings, incomeHistory, addHolding, removeHolding, loaded } = useHoldings();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);

  if (!loaded) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-[13px]" style={{ color: "rgba(242,237,230,0.3)" }}>
            Loading portfolio...
          </div>
        </div>
      </AppShell>
    );
  }

  if (holdings.length === 0) {
    return (
      <>
        <EmptyState onAdd={() => setShowAdd(true)} />
        <AnimatePresence>
          {showAdd && (
            <AddHoldingModal
              onClose={() => setShowAdd(false)}
              onAdd={addHolding}
              existingIds={[]}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);

  const holdingProps = holdings.map((h) => {
    const p = PROPERTIES.find((x) => x.id === h.propertyId);
    if (!p) return null;
    const monthlyIncome = Math.round((h.currentValue * p.expectedYield) / 100 / 12);
    return { h, p, monthlyIncome };
  }).filter(Boolean) as { h: Holding; p: (typeof PROPERTIES)[0]; monthlyIncome: number }[];

  const totalMonthly = holdingProps.reduce((s, { monthlyIncome }) => s + monthlyIncome, 0);
  const weightedYield = totalValue > 0
    ? holdingProps.reduce((sum, { h, p }) => sum + h.currentValue * p.expectedYield, 0) / totalValue
    : 0;

  const missed = getMissedInsights(holdings, PROPERTIES);
  const mistakes = getAvoidMistakes(holdings, PROPERTIES);

  const latestIncome = incomeHistory.length > 0 ? incomeHistory[incomeHistory.length - 1].value : totalMonthly;
  const prevIncome = incomeHistory.length > 1 ? incomeHistory[incomeHistory.length - 2].value : latestIncome;
  const incomeDelta = latestIncome - prevIncome;

  const cardStyle = {
    background: "#131109",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <AppShell>
      <div className="max-w-[820px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1
              className="text-[22px] font-bold tracking-[-0.5px] mb-1"
              style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
            >
              Portfolio
            </h1>
            <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.4)" }}>
              {holdings.length} holding{holdings.length !== 1 ? "s" : ""} · live data
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12px] font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#22c55e", color: "#0A0907" }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Add holding
          </button>
        </div>

        {/* KPI bar */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-[10px] overflow-hidden mb-5"
          style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)", gap: 1 }}
        >
          {[
            {
              label: "Total Value",
              value: `€${totalValue.toLocaleString("de-DE")}`,
              sub: `${holdings.length} propert${holdings.length !== 1 ? "ies" : "y"}`,
            },
            {
              label: "Monthly Income",
              value: `€${totalMonthly.toLocaleString("de-DE")}`,
              sub: incomeDelta >= 0 ? `+€${incomeDelta} vs last month` : `-€${Math.abs(incomeDelta)} vs last month`,
              subGreen: incomeDelta >= 0,
            },
            {
              label: "Avg Yield",
              value: `${weightedYield.toFixed(1)}%`,
              sub: "weighted by value",
            },
            {
              label: "Buy-rated",
              value: `${holdingProps.filter(({ p }) => getRecommendation(p, PROPERTIES).action === "Buy").length}`,
              sub: `of ${holdings.length} holdings`,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="px-5 py-4" style={{ background: "#131109" }}>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-1.5"
                style={{ color: "rgba(242,237,230,0.35)" }}
              >
                {kpi.label}
              </div>
              <div
                className="text-[20px] font-medium leading-none tracking-[-0.4px] mb-1"
                style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
              >
                {kpi.value}
              </div>
              <div
                className="text-[11px]"
                style={{ color: kpi.subGreen ? "#22c55e" : "rgba(242,237,230,0.35)" }}
              >
                {kpi.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Income chart — only shown when history exists */}
        {incomeHistory.length >= 2 && (
          <div className="rounded-[10px] p-5 mb-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
                  Monthly Income
                </div>
                <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  Net rental income · {incomeHistory.length} month{incomeHistory.length !== 1 ? "s" : ""} of data
                </div>
              </div>
              <div
                className="text-[20px] font-medium tracking-[-0.4px]"
                style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
              >
                €{totalMonthly}/mo
              </div>
            </div>
            <MiniChart data={incomeHistory} showLabels={true} />
          </div>
        )}

        {/* Holdings list */}
        <div className="rounded-[10px] overflow-hidden mb-5" style={cardStyle}>
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-[12px] font-semibold" style={{ color: "#F2EDE6" }}>
              Holdings
            </div>
            <Link
              href="/"
              className="text-[11px] font-medium no-underline"
              style={{ color: "#22c55e" }}
            >
              Browse properties →
            </Link>
          </div>

          {holdingProps.map(({ h, p, monthlyIncome }, i) => {
            const rec = getRecommendation(p, PROPERTIES);
            const isLast = i === holdingProps.length - 1;
            return (
              <div
                key={h.propertyId}
                className="flex items-center gap-4 px-5 py-3.5 group"
                style={!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : undefined}
              >
                <Link href={`/property/${p.id}`} className="flex items-center gap-4 flex-1 min-w-0 no-underline">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-[7px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-semibold truncate mb-0.5 group-hover:opacity-70 transition-opacity"
                      style={{ color: "#F2EDE6" }}
                    >
                      {p.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                        {p.flag} {p.city}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px]"
                        style={{
                          background:
                            rec.action === "Buy"
                              ? "rgba(34,197,94,0.12)"
                              : rec.action === "Avoid"
                              ? "rgba(239,68,68,0.12)"
                              : "rgba(255,255,255,0.06)",
                          color:
                            rec.action === "Buy"
                              ? "#22c55e"
                              : rec.action === "Avoid"
                              ? "#f87171"
                              : "rgba(242,237,230,0.5)",
                        }}
                      >
                        {rec.action}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Tokens */}
                <div className="text-right hidden sm:block flex-shrink-0 w-20">
                  <div
                    className="text-[12px] font-medium leading-tight mb-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
                  >
                    {h.tokens}
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                    tokens
                  </div>
                </div>

                {/* Monthly */}
                <div className="text-right flex-shrink-0 w-20">
                  <div
                    className="text-[12px] font-medium leading-tight mb-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                  >
                    €{monthlyIncome}/mo
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                    {p.expectedYield}% yield
                  </div>
                </div>

                {/* Value */}
                <div className="text-right flex-shrink-0 w-24">
                  <div
                    className="text-[13px] font-semibold leading-tight mb-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
                  >
                    €{h.currentValue.toLocaleString("de-DE")}
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                    market value
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0">
                  <ScoreRing score={p.overallScore} size={32} />
                </div>

                {/* Remove button */}
                <div className="flex-shrink-0 w-6">
                  {confirmRemove === h.propertyId ? (
                    <button
                      onClick={() => { removeHolding(h.propertyId); setConfirmRemove(null); }}
                      className="text-[10px] font-semibold transition-opacity hover:opacity-70"
                      style={{ color: "#f87171" }}
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmRemove(h.propertyId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded-[4px]"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.4)" }}
                      title="Remove holding"
                    >
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Missed profit */}
        {missed.length > 0 && (
          <div className="rounded-[10px] overflow-hidden mb-5" style={cardStyle}>
            <div
              className="px-5 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
                Missed profit opportunities
              </div>
              <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                Higher-yield Buy-rated properties you could switch to
              </div>
            </div>
            {missed.map((m, i) => (
              <div
                key={m.better.id}
                className="px-5 py-4 flex items-start gap-4"
                style={i < missed.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : undefined}
              >
                <img
                  src={m.better.image}
                  alt={m.better.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-[7px] object-cover flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div className="text-[13px] font-semibold truncate mb-0.5" style={{ color: "#F2EDE6" }}>
                        {m.better.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                        vs your {m.held.name}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className="text-[14px] font-semibold"
                        style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                      >
                        +€{m.deltaMonthly}/mo
                      </div>
                      <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                        +€{m.deltaAnnual}/yr
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] mb-2" style={{ color: "rgba(242,237,230,0.5)" }}>
                    {m.better.expectedYield}% yield · score {m.better.overallScore} · {m.better.flag} {m.better.city}
                  </div>
                  <Link
                    href={`/property/${m.better.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold no-underline px-3 py-1.5 rounded-[5px] transition-opacity hover:opacity-80"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.18)" }}
                  >
                    View property →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk warnings */}
        {mistakes.length > 0 && (
          <div className="rounded-[10px] overflow-hidden" style={cardStyle}>
            <div
              className="px-5 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
                Holdings to review
              </div>
              <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                Properties in your portfolio with risk signals
              </div>
            </div>
            {mistakes.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4"
                style={i < mistakes.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : undefined}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#f59e0b" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
                    {m.message}
                  </div>
                  <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.5)" }}>
                    {m.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add holding modal */}
      <AnimatePresence>
        {showAdd && (
          <AddHoldingModal
            onClose={() => setShowAdd(false)}
            onAdd={addHolding}
            existingIds={holdings.map((h) => h.propertyId)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
